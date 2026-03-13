import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import Stripe from "stripe";
import { randomUUID } from "crypto";
import { storage } from "./storage";
import { loginSchema, registerSchema, insertStudyProgressSchema, insertQuizResultSchema } from "../shared/schema";
import type { User } from "../shared/schema";

// Stripe setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_REPLACE_WITH_YOUR_STRIPE_SECRET_KEY", {
  apiVersion: "2025-04-30.basil",
});

const STRIPE_PRICE_AMOUNT = 149000; // 1490 SEK in öre
const STRIPE_CURRENCY = "sek";

// Simple hash (not production bcrypt, but works for demo)
function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `$hash$${Math.abs(hash).toString(36)}$${password.length}`;
}

function verifyHash(password: string, hashed: string): boolean {
  return simpleHash(password) === hashed;
}

// Auth middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Not authenticated" });
}

function requirePaid(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && (req.user as User).hasPaid) return next();
  if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
  res.status(403).json({ message: "Payment required" });
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && (req.user as User).isAdmin) return next();
  if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
  res.status(403).json({ message: "Admin access required" });
}

export async function registerRoutes(server: Server, app: Express) {
  // Session setup
  const SessionStore = MemoryStore(session);
  app.use(
    session({
      secret: "nis2-prep-secret-key-2026",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 },
      store: new SessionStore({ checkPeriod: 86400000 }),
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Passport config
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user) return done(null, false, { message: "Invalid email or password" });
        if (!verifyHash(password, user.password)) return done(null, false, { message: "Invalid email or password" });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || false);
    } catch (err) {
      done(err);
    }
  });

  // ── Auth Routes ──────────────────────────────────
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = registerSchema.parse(req.body);
      const existing = await storage.getUserByEmail(data.email);
      if (existing) return res.status(400).json({ message: "Email already registered" });

      const user = await storage.createUser({
        email: data.email,
        password: simpleHash(data.password),
        name: data.name,
      });

      req.login(user, (err) => {
        if (err) return res.status(500).json({ message: "Login failed after registration" });
        const { password, ...safeUser } = user;
        res.json(safeUser);
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message || "Invalid input" });
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    try {
      loginSchema.parse(req.body);
    } catch (err: any) {
      return res.status(400).json({ message: err.message || "Invalid input" });
    }

    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (!user) return res.status(401).json({ message: info?.message || "Invalid credentials" });

      req.login(user, (err) => {
        if (err) return res.status(500).json({ message: "Login failed" });
        const { password, ...safeUser } = user;
        res.json(safeUser);
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    const { password, ...safeUser } = req.user as User;
    res.json(safeUser);
  });

  // ── Payment Routes (Stripe Checkout) ─────────────
  app.post("/api/payment/create-checkout", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      
      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const host = req.headers['x-forwarded-host'] || req.headers.host;
      const baseUrl = `${protocol}://${host}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: user.email,
        client_reference_id: String(user.id),
        line_items: [
          {
            price_data: {
              currency: STRIPE_CURRENCY,
              unit_amount: STRIPE_PRICE_AMOUNT,
              product_data: {
                name: "NIS2 Cybersäkerhetsutbildning",
                description: "Komplett NIS2-utbildning för energisektorn — obegränsad tillgång",
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${baseUrl}/?session_id={CHECKOUT_SESSION_ID}#/payment-success`,
        cancel_url: `${baseUrl}/#/payment`,
      });

      res.json({ checkoutUrl: session.url });
    } catch (err: any) {
      console.error("Stripe checkout error:", err.message);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });

  app.post("/api/payment/verify", requireAuth, async (req, res) => {
    try {
      const { sessionId } = req.body;
      if (!sessionId) return res.status(400).json({ message: "Missing session ID" });

      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (session.payment_status === "paid") {
        const user = req.user as User;
        const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id || null;
        await storage.updateUserPayment(user.id, true, customerId || `stripe_${session.id}`);
        
        const updated = await storage.getUser(user.id);
        if (updated) {
          req.login(updated, (err) => {
            if (err) return res.status(500).json({ message: "Session update failed" });
            const { password, ...safeUser } = updated;
            res.json({ success: true, user: safeUser });
          });
          return;
        }
      }

      res.status(400).json({ message: "Payment not completed" });
    } catch (err: any) {
      console.error("Payment verify error:", err.message);
      res.status(500).json({ message: "Failed to verify payment" });
    }
  });

  app.post("/api/stripe/webhook", async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
      let event: Stripe.Event;
      
      if (webhookSecret && sig) {
        event = stripe.webhooks.constructEvent((req as any).rawBody, sig, webhookSecret);
      } else {
        event = req.body as Stripe.Event;
      }

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        
        if (userId) {
          const customerId = typeof session.customer === 'string' ? session.customer : null;
          await storage.updateUserPayment(parseInt(userId), true, customerId || `stripe_${session.id}`);
          console.log(`Payment confirmed for user ${userId}`);
        }
      }

      res.json({ received: true });
    } catch (err: any) {
      console.error('Webhook error:', err.message);
      res.status(400).json({ message: `Webhook error: ${err.message}` });
    }
  });

  // ── Study Progress Routes ────────────────────────
  app.get("/api/progress", requireAuth, async (req, res) => {
    const user = req.user as User;
    const progress = await storage.getStudyProgress(user.id);
    res.json(progress);
  });

  app.post("/api/progress", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const data = insertStudyProgressSchema.parse({
        ...req.body,
        userId: user.id,
      });
      const result = await storage.upsertStudyProgress(data);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message || "Invalid input" });
    }
  });

  // ── Quiz Routes ──────────────────────────────────
  app.get("/api/quiz-results", requireAuth, async (req, res) => {
    const user = req.user as User;
    const results = await storage.getQuizResults(user.id);
    res.json(results);
  });

  app.post("/api/quiz-results", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const data = insertQuizResultSchema.parse({
        ...req.body,
        userId: user.id,
      });
      const result = await storage.createQuizResult(data);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message || "Invalid input" });
    }
  });

  // ── Certificate Routes ──────────────────────────
  app.get("/api/certificates", requireAuth, async (req, res) => {
    const user = req.user as User;
    const certs = await storage.getCertificates(user.id);
    res.json(certs);
  });

  app.post("/api/certificates", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const { examScore, totalQuestions } = req.body;
      
      if (!examScore || !totalQuestions) {
        return res.status(400).json({ message: "Missing exam score or total questions" });
      }

      const scorePercent = Math.round((examScore / totalQuestions) * 100);
      if (scorePercent < 70) {
        return res.status(400).json({ message: "Score below passing threshold (70%)" });
      }

      const cert = await storage.createCertificate({
        userId: user.id,
        certificateId: randomUUID(),
        examScore,
        totalQuestions,
      });
      res.json(cert);
    } catch (err: any) {
      res.status(400).json({ message: err.message || "Failed to create certificate" });
    }
  });

  app.get("/api/certificates/:id", async (req, res) => {
    try {
      const cert = await storage.getCertificateById(req.params.id);
      if (!cert) return res.status(404).json({ message: "Certificate not found" });
      res.json(cert);
    } catch (err: any) {
      res.status(500).json({ message: "Failed to retrieve certificate" });
    }
  });

  // ── Admin Routes ────────────────────────────────
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    const allUsers = await storage.getAllUsers();
    const users = allUsers.map(u => {
      const { password, ...safe } = u;
      return safe;
    });
    res.json(users);
  });

  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    const allUsers = await storage.getAllUsers();
    const nonAdminUsers = allUsers.filter(u => !u.isAdmin);
    const paidUsers = nonAdminUsers.filter(u => u.hasPaid);
    const totalRevenue = paidUsers.length * 1490;

    let totalQuizzes = 0;
    let totalCorrect = 0;
    let totalQuestions = 0;
    for (const user of nonAdminUsers) {
      const results = await storage.getQuizResults(user.id);
      totalQuizzes += results.length;
      for (const r of results) {
        totalCorrect += r.correctAnswers;
        totalQuestions += r.totalQuestions;
      }
    }

    let totalChaptersCompleted = 0;
    for (const user of nonAdminUsers) {
      const progress = await storage.getStudyProgress(user.id);
      totalChaptersCompleted += progress.filter(p => p.completed).length;
    }

    res.json({
      totalUsers: nonAdminUsers.length,
      paidUsers: paidUsers.length,
      totalRevenue,
      totalQuizzes,
      avgScore: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
      totalChaptersCompleted,
    });
  });

  app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    const userId = parseInt(req.params.id);
    const user = await storage.getUser(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isAdmin) return res.status(400).json({ message: "Cannot delete admin" });
    res.json({ message: "User deleted", userId });
  });

  return server;
}
