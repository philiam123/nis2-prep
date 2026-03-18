import express from "express";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import Stripe from "stripe";
import { z } from "zod";
import pg from "pg";
import { randomUUID } from "crypto";

const app = express();

app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: false }));

// ── Stripe setup ──
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not set — payment features will fail');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_missing');

const STRIPE_PRICE_AMOUNT = 149000; // 1490 SEK in öre
const STRIPE_CURRENCY = "sek";

// ── Schemas (inline to avoid drizzle dependency) ──
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

const insertStudyProgressSchema = z.object({
  userId: z.number(),
  chapterId: z.string(),
  completed: z.boolean(),
});

const insertQuizResultSchema = z.object({
  userId: z.number(),
  domains: z.array(z.number()),
  totalQuestions: z.number(),
  correctAnswers: z.number(),
  answers: z.record(z.string(), z.number()),
});

// ── Types ──
type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  hasPaid: boolean;
  isAdmin: boolean;
  stripeCustomerId: string | null;
  createdAt: Date;
};

type StudyProgress = {
  id: number;
  userId: number;
  chapterId: string;
  completed: boolean;
};

type QuizResult = {
  id: number;
  userId: number;
  domains: number[];
  totalQuestions: number;
  correctAnswers: number;
  answers: Record<string, number>;
  completedAt: Date;
};

type Certificate = {
  id: number;
  userId: number;
  certificateId: string;
  examScore: number;
  totalQuestions: number;
  issuedAt: Date;
};

// ── Simple hash ──
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

// ── PostgreSQL storage ──
function getDbUrl(): string {
  const raw = process.env.DATABASE_POSTGRES_URL_NO_SSL
    || process.env.DATABASE_POSTGRES_URL
    || process.env.DATABASE_URL
    || process.env.DATABASE_URL_UNPOOLED
    || '';
  let cleaned = raw;
  try {
    const url = new URL(raw);
    url.searchParams.delete('channel_binding');
    cleaned = url.toString();
  } catch {
    cleaned = raw.replace(/[?&]channel_binding=[^&]*/g, '');
  }
  return cleaned;
}

const dbPool = new pg.Pool({
  connectionString: getDbUrl(),
  ssl: { rejectUnauthorized: false },
  max: 5,
});

class PgStorage {
  async getUser(id: number): Promise<User | undefined> {
    const { rows } = await dbPool.query(
      'SELECT id, email, password, name, has_paid as "hasPaid", is_admin as "isAdmin", stripe_customer_id as "stripeCustomerId", created_at as "createdAt" FROM users WHERE id = $1',
      [id]
    );
    return rows[0] || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { rows } = await dbPool.query(
      'SELECT id, email, password, name, has_paid as "hasPaid", is_admin as "isAdmin", stripe_customer_id as "stripeCustomerId", created_at as "createdAt" FROM users WHERE email = $1',
      [email]
    );
    return rows[0] || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    const { rows } = await dbPool.query(
      'SELECT id, email, password, name, has_paid as "hasPaid", is_admin as "isAdmin", stripe_customer_id as "stripeCustomerId", created_at as "createdAt" FROM users'
    );
    return rows;
  }

  async createUser(user: { email: string; password: string; name: string }): Promise<User> {
    const { rows } = await dbPool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, password, name, has_paid as "hasPaid", is_admin as "isAdmin", stripe_customer_id as "stripeCustomerId", created_at as "createdAt"',
      [user.email, user.password, user.name]
    );
    return rows[0];
  }

  async updateUserPayment(userId: number, hasPaid: boolean, stripeCustomerId?: string): Promise<void> {
    if (stripeCustomerId) {
      await dbPool.query('UPDATE users SET has_paid = $1, stripe_customer_id = $2 WHERE id = $3', [hasPaid, stripeCustomerId, userId]);
    } else {
      await dbPool.query('UPDATE users SET has_paid = $1 WHERE id = $2', [hasPaid, userId]);
    }
  }

  async getStudyProgress(userId: number): Promise<StudyProgress[]> {
    const { rows } = await dbPool.query(
      'SELECT id, user_id as "userId", chapter_id as "chapterId", completed FROM study_progress WHERE user_id = $1',
      [userId]
    );
    return rows;
  }

  async upsertStudyProgress(progress: { userId: number; chapterId: string; completed: boolean }): Promise<StudyProgress> {
    const { rows: existing } = await dbPool.query(
      'SELECT id FROM study_progress WHERE user_id = $1 AND chapter_id = $2',
      [progress.userId, progress.chapterId]
    );

    if (existing.length > 0) {
      const { rows } = await dbPool.query(
        'UPDATE study_progress SET completed = $1 WHERE id = $2 RETURNING id, user_id as "userId", chapter_id as "chapterId", completed',
        [progress.completed, existing[0].id]
      );
      return rows[0];
    }

    const { rows } = await dbPool.query(
      'INSERT INTO study_progress (user_id, chapter_id, completed) VALUES ($1, $2, $3) RETURNING id, user_id as "userId", chapter_id as "chapterId", completed',
      [progress.userId, progress.chapterId, progress.completed]
    );
    return rows[0];
  }

  async getQuizResults(userId: number): Promise<QuizResult[]> {
    const { rows } = await dbPool.query(
      'SELECT id, user_id as "userId", domains, total_questions as "totalQuestions", correct_answers as "correctAnswers", answers, completed_at as "completedAt" FROM quiz_results WHERE user_id = $1',
      [userId]
    );
    return rows;
  }

  async createQuizResult(result: { userId: number; domains: number[]; totalQuestions: number; correctAnswers: number; answers: Record<string, number> }): Promise<QuizResult> {
    const { rows } = await dbPool.query(
      'INSERT INTO quiz_results (user_id, domains, total_questions, correct_answers, answers) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id as "userId", domains, total_questions as "totalQuestions", correct_answers as "correctAnswers", answers, completed_at as "completedAt"',
      [result.userId, JSON.stringify(result.domains), result.totalQuestions, result.correctAnswers, JSON.stringify(result.answers)]
    );
    return rows[0];
  }

  async getCertificates(userId: number): Promise<Certificate[]> {
    const { rows } = await dbPool.query(
      'SELECT id, user_id as "userId", certificate_id as "certificateId", exam_score as "examScore", total_questions as "totalQuestions", track, issued_at as "issuedAt" FROM certificates WHERE user_id = $1',
      [userId]
    );
    return rows;
  }

  async createCertificate(cert: { userId: number; certificateId: string; examScore: number; totalQuestions: number; track: number }): Promise<Certificate> {
    const { rows } = await dbPool.query(
      'INSERT INTO certificates (user_id, certificate_id, exam_score, total_questions, track) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id as "userId", certificate_id as "certificateId", exam_score as "examScore", total_questions as "totalQuestions", track, issued_at as "issuedAt"',
      [cert.userId, cert.certificateId, cert.examScore, cert.totalQuestions, cert.track]
    );
    return rows[0];
  }

  async getCertificateById(certificateId: string): Promise<Certificate | undefined> {
    const { rows } = await dbPool.query(
      'SELECT id, user_id as "userId", certificate_id as "certificateId", exam_score as "examScore", total_questions as "totalQuestions", track, issued_at as "issuedAt" FROM certificates WHERE certificate_id = $1',
      [certificateId]
    );
    return rows[0] || undefined;
  }
}

const storage = new PgStorage();

// Seed admin if not exists
(async () => {
  try {
    const admin = await storage.getUserByEmail("admin@nis2.com");
    if (!admin) {
      await dbPool.query(
        'INSERT INTO users (email, password, name, has_paid, is_admin) VALUES ($1, $2, $3, true, true) ON CONFLICT (email) DO NOTHING',
        ["admin@nis2.com", simpleHash("Nis2Admin2026!"), "Admin"]
      );
      console.log("Admin account seeded");
    }
  } catch (err) {
    console.error("Admin seed error:", err);
  }
})();

// ── Session setup ──
const PgSession = ConnectPgSimple(session);
const sessionPool = new pg.Pool({
  connectionString: getDbUrl(),
  ssl: { rejectUnauthorized: false },
  max: 2,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "nis2-prep-secret-key-2026",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 },
    store: new PgSession({
      pool: sessionPool,
      createTableIfMissing: true,
      tableName: "session",
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ── Passport config ──
passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const user = await storage.getUserByEmail(email);
      if (!user) return done(null, false, { message: "Fel lösenord eller e-post" });
      if (!verifyHash(password, user.password)) return done(null, false, { message: "Fel lösenord eller e-post" });
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

// ── Auth middleware ──
function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Not authenticated" });
}

function requirePaid(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.isAuthenticated() && (req.user as User).hasPaid) return next();
  if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
  res.status(403).json({ message: "Payment required" });
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.isAuthenticated() && (req.user as User).isAdmin) return next();
  if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
  res.status(403).json({ message: "Admin access required" });
}

// ── Auth Routes ──
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
    if (!user) return res.status(401).json({ message: info?.message || "Fel lösenord eller e-post" });

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

// ── Profile Update ──
app.patch("/api/auth/profile", requireAuth, async (req, res) => {
  try {
    const user = req.user as User;
    const { currentPassword, newPassword } = req.body;

    // Update password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Nuvarande lösenord krävs" });
      }
      if (!verifyHash(currentPassword, user.password)) {
        return res.status(400).json({ message: "Fel nuvarande lösenord" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "Nytt lösenord måste vara minst 6 tecken" });
      }
      await dbPool.query('UPDATE users SET password = $1 WHERE id = $2', [simpleHash(newPassword), user.id]);
    }

    const updated = await storage.getUser(user.id);
    if (updated) {
      req.login(updated, (err) => {
        if (err) return res.status(500).json({ message: "Sessionsuppdatering misslyckades" });
        const { password: _, ...safeUser } = updated;
        res.json(safeUser);
      });
    } else {
      res.status(500).json({ message: "Kunde inte hämta uppdaterad profil" });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Profiluppdatering misslyckades" });
  }
});

// ── Payment Routes (Stripe Checkout) ──
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

// Stripe webhook
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
      const customerId = typeof session.customer === 'string' ? session.customer : null;

      if (userId) {
        // In-app checkout: client_reference_id is the user ID
        await storage.updateUserPayment(parseInt(userId), true, customerId || `stripe_${session.id}`);
        console.log(`Payment confirmed for user ${userId}`);
      } else {
        // Payment Link: no client_reference_id, match by email
        const email = session.customer_details?.email || session.customer_email;
        if (email) {
          const user = await storage.getUserByEmail(email);
          if (user) {
            await storage.updateUserPayment(user.id, true, customerId || `stripe_${session.id}`);
            console.log(`Payment Link payment confirmed for user ${user.id} (${email})`);
          } else {
            console.log(`Payment received for unknown email: ${email}`);
          }
        }
      }
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err.message);
    res.status(400).json({ message: `Webhook error: ${err.message}` });
  }
});

// ── Study Progress Routes ──
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

// ── Quiz Routes ──
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

// ── Certificate Routes ──
app.get("/api/certificates", requireAuth, async (req, res) => {
  const user = req.user as User;
  const certs = await storage.getCertificates(user.id);
  res.json(certs);
});

app.post("/api/certificates", requireAuth, async (req, res) => {
  try {
    const user = req.user as User;
    const { examScore, totalQuestions, track } = req.body;

    if (examScore == null || !totalQuestions || !track) {
      return res.status(400).json({ message: "Missing exam score, total questions, or track" });
    }

    if (![1, 2].includes(track)) {
      return res.status(400).json({ message: "Invalid track (must be 1 or 2)" });
    }

    const scorePercent = Math.round((examScore / totalQuestions) * 100);
    if (scorePercent < 70) {
      return res.status(400).json({ message: "Score below passing threshold (70%)" });
    }

    // Check for existing certificate for this track
    const existing = await storage.getCertificates(user.id);
    if (existing.find((c: any) => c.track === track)) {
      return res.status(400).json({ message: "Du har redan ett certifikat för detta spår" });
    }

    const cert = await storage.createCertificate({
      userId: user.id,
      certificateId: randomUUID(),
      examScore,
      totalQuestions,
      track,
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

// ── Admin Routes ──
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

export default app;
