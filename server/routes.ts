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
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
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
      if (!sessionId) return res.status(400).json({ message: "Session ID required" });

      const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (checkoutSession.payment_status === "paid" && 
          checkoutSession.client_reference_id === String((req.user as User).id)) {
        const updatedUser = await storage.updateUserPayment((req.user as User).id, true);
        req.login(updatedUser!, (err) => {
          if (err) return res.status(500).json({ message: "Session update failed" });
          const { password, ...safeUser } = updatedUser!;
          res.json({ success: true, user: safeUser });
        });
      } else {
        res.status(400).json({ message: "Payment not completed" });
      }
    } catch (err: any) {
      console.error("Payment verify error:", err.message);
      res.status(500).json({ message: "Failed to verify payment" });
    }
  });

  app.post("/api/payment/webhook", async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!sig || !webhookSecret) {
      return res.status(400).json({ message: "Missing signature or webhook secret" });
    }

    try {
      const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as any;
        if (session.payment_status === "paid" && session.client_reference_id) {
          const userId = parseInt(session.client_reference_id);
          await storage.updateUserPayment(userId, true);
        }
      }
      
      res.json({ received: true });
    } catch (err: any) {
      console.error("Webhook error:", err.message);
      res.status(400).json({ message: "Webhook error" });
    }
  });

  // ── Study Progress Routes ─────────────────────────
  app.get("/api/progress", requirePaid, async (req, res) => {
    const userId = (req.user as User).id;
    const progress = await storage.getStudyProgress(userId);
    res.json(progress);
  });

  app.post("/api/progress", requirePaid, async (req, res) => {
    try {
      const userId = (req.user as User).id;
      const data = insertStudyProgressSchema.parse({ ...req.body, userId });
      const progress = await storage.upsertStudyProgress(data);
      res.json(progress);
    } catch (err: any) {
      res.status(400).json({ message: err.message || "Invalid input" });
    }
  });

  // ── Quiz Results Routes ────────────────────────────
  app.get("/api/quiz-results", requirePaid, async (req, res) => {
    const userId = (req.user as User).id;
    const results = await storage.getQuizResults(userId);
    res.json(results);
  });

  app.post("/api/quiz-results", requirePaid, async (req, res) => {
    try {
      const userId = (req.user as User).id;
      const data = insertQuizResultSchema.parse({ ...req.body, userId });
      const result = await storage.createQuizResult(data);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message || "Invalid input" });
    }
  });

  // ── Certificate Routes ─────────────────────────────
  app.get("/api/certificates", requireAuth, async (req, res) => {
    const userId = (req.user as User).id;
    const certs = await storage.getCertificates(userId);
    res.json(certs);
  });

  app.post("/api/certificates", requirePaid, async (req, res) => {
    try {
      const userId = (req.user as User).id;
      const { examScore, totalQuestions } = req.body;

      if (typeof examScore !== "number" || typeof totalQuestions !== "number") {
        return res.status(400).json({ message: "Invalid score data" });
      }

      const scorePercent = (examScore / totalQuestions) * 100;
      if (scorePercent < 70) {
        return res.status(400).json({ message: "Score too low for certificate (minimum 70%)" });
      }

      const certificateId = randomUUID();
      const cert = await storage.createCertificate({
        userId,
        certificateId,
        examScore,
        totalQuestions,
      });

      res.json(cert);
    } catch (err: any) {
      res.status(400).json({ message: err.message || "Invalid input" });
    }
  });

  // Public certificate verification
  app.get("/api/certificates/:certId", async (req, res) => {
    try {
      const cert = await storage.getCertificateById(req.params.certId);
      if (!cert) return res.status(404).json({ message: "Certificate not found" });
      res.json(cert);
    } catch (err: any) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // ── Admin Routes ──────────────────────────────────────
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    const users = await storage.getAllUsers();
    const safeUsers = users.map(({ password, ...u }) => u);
    res.json(safeUsers);
  });

  app.patch("/api/admin/users/:id/payment", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { hasPaid } = req.body;
      if (typeof hasPaid !== "boolean") return res.status(400).json({ message: "hasPaid must be boolean" });
      const user = await storage.updateUserPayment(userId, hasPaid);
      if (!user) return res.status(404).json({ message: "User not found" });
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (err: any) {
      res.status(400).json({ message: err.message || "Invalid input" });
    }
  });

  return createServer(app);
}
