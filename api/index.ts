import express from "express";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { z } from "zod";
import pg from "pg";
import { randomUUID } from "crypto";
import { allQuestions } from "./_lib/questions.js";

const app = express();
const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL;

app.set("trust proxy", 1);
app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: false }));

// ── Schemas ──
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Lösenordet måste vara minst 8 tecken"),
  name: z.string().min(1),
  companyCode: z.string().optional(),
});

const insertStudyProgressSchema = z.object({
  userId: z.number(),
  chapterId: z.string(),
  completed: z.boolean(),
});

// ── Types ──
type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  hasPaid: boolean;
  isAdmin: boolean;
  companyCode: string | null;
  companyId: number | null;
  canRenew: boolean;
  isDisabled: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
};

type StudyProgress = { id: number; userId: number; chapterId: string; completed: boolean };

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
  track: number;
  issuedAt: Date;
  expiresAt: Date | null;
  isRenewal: boolean;
};

type CompanyCode = {
  id: number;
  code: string;
  companyName: string;
  companyId: number | null;
  maxUses: number;
  usedCount: number;
  pricePerUser: number;
  isActive: boolean;
  createdAt: Date;
};

type Company = {
  id: number;
  name: string;
  orgNumber: string | null;
  contactName: string | null;
  contactEmail: string | null;
  seats: number;
  validUntil: string | null;
  invoiceStatus: string;
  notes: string | null;
  createdAt: Date;
};

// ── Password hashing (bcrypt, with migration from legacy hash) ──
const BCRYPT_ROUNDS = 12;

/** Legacy, insecure hash. Only used to verify old passwords so they can be migrated to bcrypt. */
function legacyHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = ((hash << 5) - hash) + password.charCodeAt(i);
    hash |= 0;
  }
  return `$hash$${Math.abs(hash).toString(36)}$${password.length}`;
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

async function verifyPassword(password: string, stored: string): Promise<{ ok: boolean; needsRehash: boolean }> {
  if (!stored) return { ok: false, needsRehash: false };
  if (stored.startsWith("$2")) {
    return { ok: await bcrypt.compare(password, stored), needsRehash: false };
  }
  if (stored.startsWith("$hash$")) {
    return { ok: legacyHash(password) === stored, needsRehash: true };
  }
  return { ok: false, needsRehash: false };
}

// ── PostgreSQL ──
function getDbUrl(): string {
  const raw = process.env.DATABASE_POSTGRES_URL_NO_SSL
    || process.env.DATABASE_POSTGRES_URL
    || process.env.DATABASE_URL
    || process.env.DATABASE_URL_UNPOOLED
    || "";
  try {
    const url = new URL(raw);
    url.searchParams.delete("channel_binding");
    return url.toString();
  } catch {
    return raw.replace(/[?&]channel_binding=[^&]*/g, "");
  }
}

const dbPool = new pg.Pool({ connectionString: getDbUrl(), ssl: { rejectUnauthorized: false }, max: 5 });

const USER_COLS = 'id, email, password, name, has_paid as "hasPaid", is_admin as "isAdmin", company_code as "companyCode", company_id as "companyId", can_renew as "canRenew", is_disabled as "isDisabled", last_login_at as "lastLoginAt", created_at as "createdAt"';
const CERT_COLS = 'id, user_id as "userId", certificate_id as "certificateId", exam_score as "examScore", total_questions as "totalQuestions", track, issued_at as "issuedAt", expires_at as "expiresAt", is_renewal as "isRenewal"';
const QUIZ_COLS = 'id, user_id as "userId", domains, total_questions as "totalQuestions", correct_answers as "correctAnswers", answers, completed_at as "completedAt"';
const CC_COLS = 'id, code, company_name as "companyName", company_id as "companyId", max_uses as "maxUses", used_count as "usedCount", price_per_user as "pricePerUser", is_active as "isActive", created_at as "createdAt"';
const COMPANY_COLS = 'id, name, org_number as "orgNumber", contact_name as "contactName", contact_email as "contactEmail", seats, to_char(valid_until, \'YYYY-MM-DD\') as "validUntil", invoice_status as "invoiceStatus", notes, created_at as "createdAt"';

function safeUser(u: User) {
  const { password, ...rest } = u;
  return rest;
}

class PgStorage {
  async getUser(id: number): Promise<User | undefined> {
    const { rows } = await dbPool.query(`SELECT ${USER_COLS} FROM users WHERE id = $1`, [id]);
    return rows[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { rows } = await dbPool.query(`SELECT ${USER_COLS} FROM users WHERE lower(email) = lower($1)`, [email]);
    return rows[0];
  }

  async getAllUsers(): Promise<User[]> {
    const { rows } = await dbPool.query(`SELECT ${USER_COLS} FROM users`);
    return rows;
  }

  async createUser(user: { email: string; password: string; name: string; hasPaid?: boolean; companyCode?: string; companyId?: number | null }): Promise<User> {
    const { rows } = await dbPool.query(
      `INSERT INTO users (email, password, name, has_paid, company_code, company_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING ${USER_COLS}`,
      [user.email, user.password, user.name, user.hasPaid || false, user.companyCode || null, user.companyId ?? null]
    );
    return rows[0];
  }

  async setPassword(userId: number, hashed: string) {
    await dbPool.query("UPDATE users SET password = $1 WHERE id = $2", [hashed, userId]);
  }

  async touchLogin(userId: number) {
    await dbPool.query("UPDATE users SET last_login_at = now() WHERE id = $1", [userId]);
  }

  async updateUserAccess(userId: number, hasPaid: boolean): Promise<void> {
    await dbPool.query("UPDATE users SET has_paid = $1 WHERE id = $2", [hasPaid, userId]);
  }

  async getStudyProgress(userId: number): Promise<StudyProgress[]> {
    const { rows } = await dbPool.query('SELECT id, user_id as "userId", chapter_id as "chapterId", completed FROM study_progress WHERE user_id = $1', [userId]);
    return rows;
  }

  async upsertStudyProgress(p: { userId: number; chapterId: string; completed: boolean }): Promise<StudyProgress> {
    const { rows: existing } = await dbPool.query("SELECT id FROM study_progress WHERE user_id = $1 AND chapter_id = $2", [p.userId, p.chapterId]);
    if (existing.length > 0) {
      const { rows } = await dbPool.query('UPDATE study_progress SET completed = $1 WHERE id = $2 RETURNING id, user_id as "userId", chapter_id as "chapterId", completed', [p.completed, existing[0].id]);
      return rows[0];
    }
    const { rows } = await dbPool.query('INSERT INTO study_progress (user_id, chapter_id, completed) VALUES ($1, $2, $3) RETURNING id, user_id as "userId", chapter_id as "chapterId", completed', [p.userId, p.chapterId, p.completed]);
    return rows[0];
  }

  async getQuizResults(userId: number): Promise<QuizResult[]> {
    const { rows } = await dbPool.query(`SELECT ${QUIZ_COLS} FROM quiz_results WHERE user_id = $1 ORDER BY completed_at DESC`, [userId]);
    return rows;
  }

  async createQuizResult(r: { userId: number; domains: number[]; totalQuestions: number; correctAnswers: number; answers: Record<string, number> }): Promise<QuizResult> {
    const { rows } = await dbPool.query(
      `INSERT INTO quiz_results (user_id, domains, total_questions, correct_answers, answers) VALUES ($1, $2, $3, $4, $5) RETURNING ${QUIZ_COLS}`,
      [r.userId, JSON.stringify(r.domains), r.totalQuestions, r.correctAnswers, JSON.stringify(r.answers)]
    );
    return rows[0];
  }

  async getCertificates(userId: number): Promise<Certificate[]> {
    const { rows } = await dbPool.query(`SELECT ${CERT_COLS} FROM certificates WHERE user_id = $1 ORDER BY issued_at DESC`, [userId]);
    return rows;
  }

  async createCertificate(c: { userId: number; examScore: number; totalQuestions: number; track: number; isRenewal?: boolean }): Promise<Certificate> {
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    const { rows } = await dbPool.query(
      `INSERT INTO certificates (user_id, certificate_id, exam_score, total_questions, track, expires_at, is_renewal) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ${CERT_COLS}`,
      [c.userId, randomUUID(), c.examScore, c.totalQuestions, c.track, expiresAt, c.isRenewal || false]
    );
    return rows[0];
  }

  /** Public lookup: intentionally does NOT include email or internal ids. */
  async getPublicCertificate(certificateId: string) {
    const { rows } = await dbPool.query(
      'SELECT c.certificate_id as "certificateId", c.exam_score as "examScore", c.total_questions as "totalQuestions", c.track, c.issued_at as "issuedAt", c.expires_at as "expiresAt", c.is_renewal as "isRenewal", u.name as "userName" FROM certificates c JOIN users u ON c.user_id = u.id WHERE c.certificate_id = $1',
      [certificateId]
    );
    return rows[0];
  }

  // ── Company codes ──
  async getCompanyCodes(): Promise<CompanyCode[]> {
    const { rows } = await dbPool.query(`SELECT ${CC_COLS} FROM company_codes ORDER BY created_at DESC`);
    return rows;
  }

  async getCompanyCodeByCode(code: string): Promise<CompanyCode | undefined> {
    const { rows } = await dbPool.query(`SELECT ${CC_COLS} FROM company_codes WHERE code = $1`, [code]);
    return rows[0];
  }

  async createCompanyCode(d: { code: string; companyName: string; maxUses: number; pricePerUser: number; companyId?: number | null }): Promise<CompanyCode> {
    const { rows } = await dbPool.query(
      `INSERT INTO company_codes (code, company_name, max_uses, price_per_user, company_id) VALUES ($1, $2, $3, $4, $5) RETURNING ${CC_COLS}`,
      [d.code, d.companyName, d.maxUses, d.pricePerUser, d.companyId ?? null]
    );
    return rows[0];
  }

  async incrementCompanyCodeUsage(code: string): Promise<void> {
    await dbPool.query("UPDATE company_codes SET used_count = used_count + 1 WHERE code = $1", [code]);
  }

  async updateCompanyCode(id: number, d: { isActive?: boolean; maxUses?: number; companyId?: number | null }): Promise<void> {
    if (d.isActive !== undefined) await dbPool.query("UPDATE company_codes SET is_active = $1 WHERE id = $2", [d.isActive, id]);
    if (d.maxUses !== undefined) await dbPool.query("UPDATE company_codes SET max_uses = $1 WHERE id = $2", [d.maxUses, id]);
    if (d.companyId !== undefined) await dbPool.query("UPDATE company_codes SET company_id = $1 WHERE id = $2", [d.companyId, id]);
  }

  async deleteCompanyCode(id: number): Promise<void> {
    await dbPool.query("DELETE FROM company_codes WHERE id = $1", [id]);
  }

  // ── Companies ──
  async getCompanies(): Promise<(Company & { userCount: number; certifiedCount: number })[]> {
    const { rows } = await dbPool.query(
      `SELECT ${COMPANY_COLS.split(", ").map(c => "co." + c).join(", ")},
        (SELECT count(*)::int FROM users u WHERE u.company_id = co.id) as "userCount",
        (SELECT count(DISTINCT c.user_id)::int FROM certificates c JOIN users u ON u.id = c.user_id WHERE u.company_id = co.id) as "certifiedCount"
       FROM companies co ORDER BY co.name`
    );
    return rows;
  }

  async getCompany(id: number): Promise<Company | undefined> {
    const { rows } = await dbPool.query(`SELECT ${COMPANY_COLS} FROM companies WHERE id = $1`, [id]);
    return rows[0];
  }

  async countCompanyUsers(id: number): Promise<number> {
    const { rows } = await dbPool.query("SELECT count(*)::int AS n FROM users WHERE company_id = $1", [id]);
    return rows[0].n;
  }
}

const storage = new PgStorage();

// ── Session setup ──
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET environment variable is required");
}

const PgSession = ConnectPgSimple(session);
const sessionPool = new pg.Pool({ connectionString: getDbUrl(), ssl: { rejectUnauthorized: false }, max: 2 });

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: { secure: isProd, httpOnly: true, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 },
    store: new PgSession({ pool: sessionPool, createTableIfMissing: true, tableName: "session" }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ── Passport ──
passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const user = await storage.getUserByEmail(email);
      if (!user || user.isDisabled) return done(null, false, { message: "Fel lösenord eller e-post" });
      const { ok, needsRehash } = await verifyPassword(password, user.password);
      if (!ok) return done(null, false, { message: "Fel lösenord eller e-post" });
      if (needsRehash) {
        // Transparent migration from the legacy hash to bcrypt
        await storage.setPassword(user.id, await hashPassword(password));
      }
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
    done(null, user && !user.isDisabled ? user : false);
  } catch (err) {
    done(err);
  }
});

// ── Basic rate limiting (in-memory, per serverless instance) ──
const rateBuckets = new Map<string, { count: number; resetAt: number }>();
function rateLimit(opts: { windowMs: number; max: number; name: string }) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const now = Date.now();
    const ip = (req.ip || req.socket.remoteAddress || "unknown").toString();
    const key = `${opts.name}:${ip}`;
    let b = rateBuckets.get(key);
    if (!b || b.resetAt < now) {
      b = { count: 0, resetAt: now + opts.windowMs };
      rateBuckets.set(key, b);
    }
    b.count++;
    if (rateBuckets.size > 10000) {
      rateBuckets.forEach((v, k) => { if (v.resetAt < now) rateBuckets.delete(k); });
    }
    if (b.count > opts.max) {
      res.setHeader("Retry-After", Math.ceil((b.resetAt - now) / 1000).toString());
      return res.status(429).json({ message: "För många försök. Vänta en stund och försök igen." });
    }
    next();
  };
}
const loginLimiter = rateLimit({ name: "login", windowMs: 15 * 60 * 1000, max: 10 });
const registerLimiter = rateLimit({ name: "register", windowMs: 60 * 60 * 1000, max: 10 });

// ── Auth middleware ──
function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Not authenticated" });
}

function requireAccess(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
  const u = req.user as User;
  if (u.hasPaid || u.isAdmin) return next();
  res.status(403).json({ message: "Licens krävs" });
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.isAuthenticated() && (req.user as User).isAdmin) return next();
  if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
  res.status(403).json({ message: "Admin access required" });
}

// ── Auth routes ──
app.post("/api/auth/register", registerLimiter, async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await storage.getUserByEmail(data.email);
    if (existing) return res.status(400).json({ message: "Email already registered" });

    let hasPaid = false;
    let companyId: number | null = null;
    const code = data.companyCode?.trim().toUpperCase() || undefined;
    if (code) {
      const cc = await storage.getCompanyCodeByCode(code);
      if (!cc) return res.status(400).json({ message: "Ogiltig företagskod" });
      if (!cc.isActive) return res.status(400).json({ message: "Företagskoden är inte längre aktiv" });
      if (cc.usedCount >= cc.maxUses) return res.status(400).json({ message: "Företagskoden har nått sin gräns" });
      if (cc.companyId) {
        const company = await storage.getCompany(cc.companyId);
        if (company) {
          if (company.validUntil && new Date(company.validUntil + "T23:59:59") < new Date()) {
            return res.status(400).json({ message: "Företagets licens har gått ut" });
          }
          if (company.seats > 0 && (await storage.countCompanyUsers(company.id)) >= company.seats) {
            return res.status(400).json({ message: "Företagets alla licenser är använda" });
          }
          companyId = company.id;
        }
      }
      hasPaid = true;
    }

    const user = await storage.createUser({
      email: data.email,
      password: await hashPassword(data.password),
      name: data.name,
      hasPaid,
      companyCode: code,
      companyId,
    });
    if (code) await storage.incrementCompanyCodeUsage(code);
    await storage.touchLogin(user.id);

    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: "Login failed after registration" });
      res.json(safeUser(user));
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0]?.message || "Invalid input" });
    res.status(400).json({ message: "Invalid input" });
  }
});

app.post("/api/auth/login", loginLimiter, (req, res, next) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Ogiltig e-post eller lösenord" });

  passport.authenticate("local", (err: any, user: any, info: any) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (!user) return res.status(401).json({ message: info?.message || "Fel lösenord eller e-post" });
    req.session.regenerate((regenErr) => {
      if (regenErr) return res.status(500).json({ message: "Login failed" });
      req.login(user, async (err) => {
        if (err) return res.status(500).json({ message: "Login failed" });
        try { await storage.touchLogin(user.id); } catch {}
        res.json(safeUser(user));
      });
    });
  })(req, res, next);
});

app.post("/api/auth/logout", (req, res) => {
  req.logout(() => {
    req.session?.destroy(() => res.json({ message: "Logged out" }));
  });
});

app.get("/api/auth/me", (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
  res.json(safeUser(req.user as User));
});

app.patch("/api/auth/profile", requireAuth, async (req, res) => {
  try {
    const user = req.user as User;
    const { currentPassword, newPassword } = req.body || {};
    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ message: "Nuvarande lösenord krävs" });
      const { ok } = await verifyPassword(String(currentPassword), user.password);
      if (!ok) return res.status(400).json({ message: "Fel nuvarande lösenord" });
      if (String(newPassword).length < 8) return res.status(400).json({ message: "Nytt lösenord måste vara minst 8 tecken" });
      await storage.setPassword(user.id, await hashPassword(String(newPassword)));
    }
    const updated = await storage.getUser(user.id);
    if (!updated) return res.status(500).json({ message: "Kunde inte hämta uppdaterad profil" });
    req.login(updated, (err) => {
      if (err) return res.status(500).json({ message: "Sessionsuppdatering misslyckades" });
      res.json(safeUser(updated));
    });
  } catch {
    res.status(500).json({ message: "Profiluppdatering misslyckades" });
  }
});

// ── Study progress ──
app.get("/api/progress", requireAuth, async (req, res) => {
  res.json(await storage.getStudyProgress((req.user as User).id));
});

app.post("/api/progress", requireAuth, async (req, res) => {
  try {
    const data = insertStudyProgressSchema.parse({ ...req.body, userId: (req.user as User).id });
    res.json(await storage.upsertStudyProgress(data));
  } catch {
    res.status(400).json({ message: "Invalid input" });
  }
});

// ── Questions (answer key never leaves the server) ──
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function publicQuestion(id: number, perm?: number[]) {
  const q = allQuestions[id];
  const order = perm || q.options.map((_, i) => i);
  return { id, domain: q.domain, subtopic: q.subtopic, question: q.question, options: order.map(i => q.options[i]) };
}

app.get("/api/questions/count", async (_req, res) => {
  res.json({ total: allQuestions.length });
});

// Practice quiz: returns questions without answers
app.get("/api/questions/practice", requireAccess, async (req, res) => {
  const domains = String(req.query.domains || "0,1,2").split(",").map(Number).filter(n => Number.isInteger(n));
  const count = Math.min(Math.max(parseInt(String(req.query.count || "10")) || 10, 1), 100);
  const ids = allQuestions.map((q, i) => ({ q, i })).filter(x => domains.includes(x.q.domain)).map(x => x.i);
  res.json(shuffle(ids).slice(0, count).map(id => publicQuestion(id)));
});

// Practice quiz: check a single answer (gives feedback + explanation)
app.post("/api/questions/:id/check", requireAccess, async (req, res) => {
  const id = parseInt(req.params.id);
  const option = Number(req.body?.option);
  const q = allQuestions[id];
  if (!q || !Number.isInteger(option)) return res.status(400).json({ message: "Invalid input" });
  res.json({ correct: option === q.correct, correctOption: q.correct, explanation: q.explanation });
});

// ── Quiz results (practice). Score computed server-side. ──
app.get("/api/quiz-results", requireAuth, async (req, res) => {
  res.json(await storage.getQuizResults((req.user as User).id));
});

const practiceResultSchema = z.object({
  domains: z.array(z.number()),
  answers: z.array(z.object({ id: z.number().int(), option: z.number().int() })).min(1).max(200),
});

app.post("/api/quiz-results", requireAccess, async (req, res) => {
  try {
    const data = practiceResultSchema.parse(req.body);
    let correct = 0;
    const answersMap: Record<string, number> = {};
    for (const a of data.answers) {
      const q = allQuestions[a.id];
      if (!q) return res.status(400).json({ message: "Invalid question" });
      if (a.option === q.correct) correct++;
      answersMap[q.subtopic] = a.option;
    }
    const result = await storage.createQuizResult({
      userId: (req.user as User).id,
      domains: data.domains,
      totalQuestions: data.answers.length,
      correctAnswers: correct,
      answers: answersMap,
    });
    res.json(result);
  } catch {
    res.status(400).json({ message: "Invalid input" });
  }
});

// ── Exam (server-issued, server-scored) ──
const PASS_PERCENT = 70;
const TRACK_CONFIGS: Record<number, { domains: number[]; questionCount: number; bonusDomains?: number[]; bonusCount?: number; timeSeconds: number }> = {
  1: { domains: [0, 1], questionCount: 15, bonusDomains: [2], bonusCount: 5, timeSeconds: 40 * 60 },
  2: { domains: [0, 2], questionCount: 25, timeSeconds: 50 * 60 },
};

async function getEligibility(user: User) {
  const certs = await storage.getCertificates(user.id);
  return [1, 2].map(track => {
    const cert = certs.find(c => c.track === track);
    const isExpired = cert?.expiresAt ? new Date(cert.expiresAt) < new Date() : false;
    const hasValidCert = !!cert && !isExpired;
    const needsRenewal = !!cert && isExpired;
    const canTakeExam = !cert || (isExpired && user.canRenew);
    return { track, hasValidCert, needsRenewal, canRenew: user.canRenew, canTakeExam };
  });
}

app.get("/api/exam/eligibility", requireAuth, async (req, res) => {
  try {
    res.json(await getEligibility(req.user as User));
  } catch {
    res.status(500).json({ message: "Eligibility check failed" });
  }
});

app.post("/api/exam/start", requireAccess, async (req, res) => {
  try {
    const user = req.user as User;
    const track = Number(req.body?.track);
    const config = TRACK_CONFIGS[track];
    if (!config) return res.status(400).json({ message: "Invalid track (must be 1 or 2)" });
    const elig = (await getEligibility(user)).find(e => e.track === track)!;
    if (!elig.canTakeExam) {
      return res.status(403).json({ message: elig.hasValidCert ? "Du har redan ett giltigt certifikat för detta spår" : "Förnyelse ej aktiverad. Kontakta oss för att förnya ditt certifikat." });
    }

    const idsFor = (domains: number[]) => allQuestions.map((q, i) => ({ q, i })).filter(x => domains.includes(x.q.domain)).map(x => x.i);
    let selected = shuffle(idsFor(config.domains)).slice(0, config.questionCount);
    if (config.bonusDomains && config.bonusCount) {
      selected = [...selected, ...shuffle(idsFor(config.bonusDomains)).slice(0, config.bonusCount)];
    }
    selected = shuffle(selected);
    const items = selected.map(id => ({ id, perm: shuffle(allQuestions[id].options.map((_, i) => i)) }));

    const examId = randomUUID();
    const expiresAt = new Date(Date.now() + (config.timeSeconds + 120) * 1000); // 2 min grace for network latency
    await dbPool.query(
      "INSERT INTO exam_sessions (id, user_id, track, questions, expires_at) VALUES ($1, $2, $3, $4, $5)",
      [examId, user.id, track, JSON.stringify(items), expiresAt]
    );

    res.json({
      examId,
      track,
      timeSeconds: config.timeSeconds,
      questions: items.map((it, idx) => {
        const pq = publicQuestion(it.id, it.perm);
        return { index: idx, domain: pq.domain, subtopic: pq.subtopic, question: pq.question, options: pq.options };
      }),
    });
  } catch (err: any) {
    console.error("exam start error:", err?.message);
    res.status(500).json({ message: "Kunde inte starta provet" });
  }
});

app.post("/api/exam/submit", requireAccess, async (req, res) => {
  const client = await dbPool.connect();
  try {
    const user = req.user as User;
    const examId = String(req.body?.examId || "");
    const answers: unknown = req.body?.answers;
    if (!examId || !Array.isArray(answers)) return res.status(400).json({ message: "Invalid input" });

    await client.query("BEGIN");
    const { rows } = await client.query(
      "SELECT id, user_id, track, questions, expires_at, submitted_at FROM exam_sessions WHERE id = $1 AND user_id = $2 FOR UPDATE",
      [examId, user.id]
    );
    const exam = rows[0];
    if (!exam) { await client.query("ROLLBACK"); return res.status(404).json({ message: "Provet hittades inte" }); }
    if (exam.submitted_at) { await client.query("ROLLBACK"); return res.status(400).json({ message: "Provet är redan inlämnat" }); }

    const items: { id: number; perm: number[] }[] = exam.questions;
    const late = new Date(exam.expires_at) < new Date();
    let correct = 0;
    const answersMap: Record<string, number> = {};
    const perDomain = new Map<number, { correct: number; total: number }>();
    items.forEach((it, idx) => {
      const q = allQuestions[it.id];
      const displayed = (answers as any[])[idx];
      const original = !late && Number.isInteger(displayed) && displayed >= 0 && displayed < it.perm.length ? it.perm[displayed] : -1;
      const isCorrect = original === q.correct;
      if (isCorrect) correct++;
      if (original >= 0) answersMap[q.subtopic] = original;
      const d = perDomain.get(q.domain) || { correct: 0, total: 0 };
      d.total++;
      if (isCorrect) d.correct++;
      perDomain.set(q.domain, d);
    });
    const total = items.length;
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = percent >= PASS_PERCENT;

    await client.query("UPDATE exam_sessions SET submitted_at = now() WHERE id = $1", [examId]);
    const config = TRACK_CONFIGS[exam.track];
    await client.query(
      "INSERT INTO quiz_results (user_id, domains, total_questions, correct_answers, answers) VALUES ($1, $2, $3, $4, $5)",
      [user.id, JSON.stringify(config.domains), total, correct, JSON.stringify(answersMap)]
    );

    let certificate: Certificate | null = null;
    if (passed) {
      const elig = (await getEligibility(user)).find(e => e.track === exam.track)!;
      if (elig.canTakeExam) {
        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        const isRenewal = elig.needsRenewal && user.canRenew;
        const ins = await client.query(
          `INSERT INTO certificates (user_id, certificate_id, exam_score, total_questions, track, expires_at, is_renewal) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ${CERT_COLS}`,
          [user.id, randomUUID(), correct, total, exam.track, expiresAt, isRenewal]
        );
        certificate = ins.rows[0];
        if (isRenewal) await client.query("UPDATE users SET can_renew = false WHERE id = $1", [user.id]);
      }
    }
    await client.query("COMMIT");

    res.json({
      correct,
      total,
      percent,
      passed,
      late,
      certificate,
      breakdown: Array.from(perDomain.entries()).map(([domain, v]) => ({ domain, ...v })),
    });
  } catch (err: any) {
    try { await client.query("ROLLBACK"); } catch {}
    console.error("exam submit error:", err?.message);
    res.status(500).json({ message: "Kunde inte lämna in provet" });
  } finally {
    client.release();
  }
});

// ── Certificates ──
app.get("/api/certificates", requireAuth, async (req, res) => {
  res.json(await storage.getCertificates((req.user as User).id));
});

// Certificates are only issued via /api/exam/submit. Kept for clarity.
app.post("/api/certificates", requireAuth, (_req, res) => {
  res.status(410).json({ message: "Certifikat utfärdas automatiskt när slutprovet är godkänt" });
});

// Public verification (no email / internal ids)
app.get("/api/certificates/:id", async (req, res) => {
  try {
    const cert = await storage.getPublicCertificate(req.params.id);
    if (!cert) return res.status(404).json({ message: "Certificate not found" });
    res.json(cert);
  } catch {
    res.status(500).json({ message: "Failed to retrieve certificate" });
  }
});

// ── Admin: users ──
app.get("/api/admin/users", requireAdmin, async (req, res) => {
  const search = String(req.query.search || "").trim();
  const companyId = req.query.companyId ? parseInt(String(req.query.companyId)) : null;
  const params: any[] = [];
  const where: string[] = [];
  if (search) {
    params.push(`%${search}%`);
    where.push(`(u.email ILIKE $${params.length} OR u.name ILIKE $${params.length} OR u.company_code ILIKE $${params.length} OR co.name ILIKE $${params.length})`);
  }
  if (companyId) {
    params.push(companyId);
    where.push(`u.company_id = $${params.length}`);
  }
  const { rows } = await dbPool.query(
    `SELECT u.id, u.email, u.name, u.has_paid as "hasPaid", u.is_admin as "isAdmin", u.company_code as "companyCode", u.company_id as "companyId",
       u.can_renew as "canRenew", u.is_disabled as "isDisabled", u.last_login_at as "lastLoginAt", u.created_at as "createdAt",
       co.name as "companyName",
       (SELECT count(*)::int FROM certificates c WHERE c.user_id = u.id) as "certificateCount",
       (SELECT count(*)::int FROM quiz_results q WHERE q.user_id = u.id) as "quizCount",
       (SELECT count(*)::int FROM study_progress s WHERE s.user_id = u.id AND s.completed) as "chaptersCompleted",
       (SELECT max(round(100.0 * q.correct_answers / NULLIF(q.total_questions, 0)))::int FROM quiz_results q WHERE q.user_id = u.id) as "bestScore"
     FROM users u LEFT JOIN companies co ON co.id = u.company_id
     ${where.length ? "WHERE " + where.join(" AND ") : ""}
     ORDER BY u.created_at DESC`,
    params
  );
  res.json(rows);
});

app.get("/api/admin/users/:id", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await storage.getUser(id);
  if (!user) return res.status(404).json({ message: "User not found" });
  const [results, certificates, progress, company] = await Promise.all([
    storage.getQuizResults(id),
    storage.getCertificates(id),
    storage.getStudyProgress(id),
    user.companyId ? storage.getCompany(user.companyId) : Promise.resolve(undefined),
  ]);
  res.json({ user: safeUser(user), company: company || null, quizResults: results, certificates, progress });
});

app.get("/api/admin/certificates", requireAdmin, async (req, res) => {
  const params: any[] = [];
  let where = "";
  if (req.query.companyId) {
    params.push(parseInt(String(req.query.companyId)));
    where = "WHERE u.company_id = $1";
  }
  const { rows } = await dbPool.query(
    `SELECT c.id, c.user_id as "userId", c.certificate_id as "certificateId", c.exam_score as "examScore", c.total_questions as "totalQuestions",
       c.track, c.issued_at as "issuedAt", c.expires_at as "expiresAt", c.is_renewal as "isRenewal",
       u.name as "userName", u.email as "userEmail", u.company_id as "companyId", co.name as "companyName"
     FROM certificates c JOIN users u ON u.id = c.user_id LEFT JOIN companies co ON co.id = u.company_id
     ${where} ORDER BY c.issued_at DESC`,
    params
  );
  res.json(rows);
});

app.get("/api/admin/stats", requireAdmin, async (_req, res) => {
  const { rows } = await dbPool.query(`
    SELECT
      (SELECT count(*)::int FROM users WHERE NOT is_admin) as "totalUsers",
      (SELECT count(*)::int FROM users WHERE NOT is_admin AND has_paid) as "paidUsers",
      (SELECT count(*)::int FROM companies) as "totalCompanies",
      (SELECT count(*)::int FROM certificates) as "totalCertificates",
      (SELECT count(*)::int FROM quiz_results q JOIN users u ON u.id = q.user_id WHERE NOT u.is_admin) as "totalQuizzes",
      (SELECT COALESCE(round(100.0 * sum(q.correct_answers) / NULLIF(sum(q.total_questions), 0)), 0)::int FROM quiz_results q JOIN users u ON u.id = q.user_id WHERE NOT u.is_admin) as "avgScore",
      (SELECT count(*)::int FROM study_progress s JOIN users u ON u.id = s.user_id WHERE NOT u.is_admin AND s.completed) as "totalChaptersCompleted",
      (SELECT count(*)::int FROM users WHERE NOT is_admin AND last_login_at > now() - interval '30 days') as "activeLast30Days"
  `);
  res.json({ ...rows[0], totalRevenue: 0 });
});

app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
  const userId = parseInt(req.params.id);
  const user = await storage.getUser(userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isAdmin) return res.status(400).json({ message: "Cannot delete admin" });
  res.json({ message: "User deleted", userId });
});

app.post("/api/admin/users", requireAdmin, async (req, res) => {
  try {
    const { email, password, name, hasPaid, companyId } = req.body || {};
    if (!email || !password || !name) return res.status(400).json({ message: "E-post, lösenord och namn krävs" });
    if (String(password).length < 8) return res.status(400).json({ message: "Lösenordet måste vara minst 8 tecken" });
    if (await storage.getUserByEmail(email)) return res.status(400).json({ message: "E-postadressen är redan registrerad" });
    const user = await storage.createUser({
      email,
      password: await hashPassword(String(password)),
      name,
      hasPaid: !!hasPaid,
      companyId: companyId ? parseInt(companyId) : null,
    });
    res.json(safeUser(user));
  } catch {
    res.status(400).json({ message: "Kunde inte skapa användare" });
  }
});

app.patch("/api/admin/users/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { companyId, isDisabled } = req.body || {};
    if (companyId !== undefined) await dbPool.query("UPDATE users SET company_id = $1 WHERE id = $2", [companyId ? parseInt(companyId) : null, id]);
    if (typeof isDisabled === "boolean") {
      if (id === (req.user as User).id) return res.status(400).json({ message: "Du kan inte inaktivera dig själv" });
      await dbPool.query("UPDATE users SET is_disabled = $1 WHERE id = $2", [isDisabled, id]);
    }
    res.json({ message: "Uppdaterad" });
  } catch {
    res.status(500).json({ message: "Kunde inte uppdatera" });
  }
});

app.patch("/api/admin/users/:id/renew", requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { canRenew } = req.body || {};
    if (typeof canRenew !== "boolean") return res.status(400).json({ message: "canRenew måste vara true eller false" });
    await dbPool.query("UPDATE users SET can_renew = $1 WHERE id = $2", [canRenew, userId]);
    res.json({ message: "Förnyelsestatus uppdaterad", userId, canRenew });
  } catch {
    res.status(500).json({ message: "Kunde inte uppdatera" });
  }
});

// Toggle access (licence) — kept at /payment for backward compatibility with the admin UI
app.patch("/api/admin/users/:id/payment", requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { hasPaid } = req.body || {};
    if (typeof hasPaid !== "boolean") return res.status(400).json({ message: "hasPaid måste vara true eller false" });
    await storage.updateUserAccess(userId, hasPaid);
    res.json({ message: "Åtkomst uppdaterad", userId, hasPaid });
  } catch {
    res.status(500).json({ message: "Kunde inte uppdatera" });
  }
});

// ── Admin: companies ──
const companySchema = z.object({
  name: z.string().min(1),
  orgNumber: z.string().nullish(),
  contactName: z.string().nullish(),
  contactEmail: z.string().nullish(),
  seats: z.coerce.number().int().min(0).default(0),
  validUntil: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullish().or(z.literal("")),
  invoiceStatus: z.enum(["pending", "invoiced", "paid", "overdue", "cancelled"]).default("pending"),
  notes: z.string().nullish(),
});

app.get("/api/admin/companies", requireAdmin, async (_req, res) => {
  res.json(await storage.getCompanies());
});

app.get("/api/admin/companies/:id", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  const company = await storage.getCompany(id);
  if (!company) return res.status(404).json({ message: "Företaget hittades inte" });
  const { rows: codes } = await dbPool.query(`SELECT ${CC_COLS} FROM company_codes WHERE company_id = $1`, [id]);
  res.json({ company, codes, userCount: await storage.countCompanyUsers(id) });
});

app.post("/api/admin/companies", requireAdmin, async (req, res) => {
  try {
    const d = companySchema.parse(req.body);
    const { rows } = await dbPool.query(
      `INSERT INTO companies (name, org_number, contact_name, contact_email, seats, valid_until, invoice_status, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING ${COMPANY_COLS}`,
      [d.name, d.orgNumber || null, d.contactName || null, d.contactEmail || null, d.seats, d.validUntil || null, d.invoiceStatus, d.notes || null]
    );
    res.json(rows[0]);
  } catch (err: any) {
    res.status(400).json({ message: err instanceof z.ZodError ? "Ogiltiga uppgifter" : "Kunde inte skapa företag" });
  }
});

app.patch("/api/admin/companies/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const d = companySchema.partial().parse(req.body);
    const map: Record<string, string> = { name: "name", orgNumber: "org_number", contactName: "contact_name", contactEmail: "contact_email", seats: "seats", validUntil: "valid_until", invoiceStatus: "invoice_status", notes: "notes" };
    const sets: string[] = [];
    const params: any[] = [];
    for (const [k, col] of Object.entries(map)) {
      if (k in req.body && (d as any)[k] !== undefined) {
        params.push((d as any)[k] === "" ? null : (d as any)[k]);
        sets.push(`${col} = $${params.length}`);
      }
    }
    if (!sets.length) return res.json(await storage.getCompany(id));
    params.push(id);
    const { rows } = await dbPool.query(`UPDATE companies SET ${sets.join(", ")} WHERE id = $${params.length} RETURNING ${COMPANY_COLS}`, params);
    res.json(rows[0]);
  } catch {
    res.status(400).json({ message: "Kunde inte uppdatera företaget" });
  }
});

function csvCell(v: unknown): string {
  if (v === null || v === undefined) return "";
  let s = v instanceof Date ? v.toISOString().slice(0, 10) : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // prevent CSV/formula injection
  return /[",;\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

app.get("/api/admin/companies/:id/export.csv", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  const company = await storage.getCompany(id);
  if (!company) return res.status(404).json({ message: "Företaget hittades inte" });
  const { rows } = await dbPool.query(
    `SELECT u.name, u.email, u.created_at, u.last_login_at,
       (SELECT count(*) FROM study_progress s WHERE s.user_id = u.id AND s.completed) as chapters,
       (SELECT max(round(100.0 * q.correct_answers / NULLIF(q.total_questions, 0))) FROM quiz_results q WHERE q.user_id = u.id) as best_score,
       c1.issued_at as t1_issued, c1.expires_at as t1_expires, c1.certificate_id as t1_id,
       c2.issued_at as t2_issued, c2.expires_at as t2_expires, c2.certificate_id as t2_id
     FROM users u
     LEFT JOIN LATERAL (SELECT * FROM certificates c WHERE c.user_id = u.id AND c.track = 1 ORDER BY issued_at DESC LIMIT 1) c1 ON true
     LEFT JOIN LATERAL (SELECT * FROM certificates c WHERE c.user_id = u.id AND c.track = 2 ORDER BY issued_at DESC LIMIT 1) c2 ON true
     WHERE u.company_id = $1 ORDER BY u.name`,
    [id]
  );
  const header = ["Namn", "E-post", "Registrerad", "Senast inloggad", "Avklarade avsnitt", "Bästa resultat %", "Ledning: utfärdat", "Ledning: giltigt till", "Ledning: certifikat-ID", "Personal: utfärdat", "Personal: giltigt till", "Personal: certifikat-ID"];
  const lines = [header.join(";")].concat(rows.map(r => [r.name, r.email, r.created_at, r.last_login_at, r.chapters, r.best_score, r.t1_issued, r.t1_expires, r.t1_id, r.t2_issued, r.t2_expires, r.t2_id].map(csvCell).join(";")));
  const filename = `${company.name.replace(/[^a-zA-Z0-9åäöÅÄÖ_-]+/g, "_")}_nis2.csv`;
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
  res.send("\uFEFF" + lines.join("\r\n"));
});

// ── Company codes (admin) ──
app.get("/api/admin/company-codes", requireAdmin, async (_req, res) => {
  res.json(await storage.getCompanyCodes());
});

app.post("/api/admin/company-codes", requireAdmin, async (req, res) => {
  try {
    const { code, companyName, maxUses, pricePerUser, companyId } = req.body || {};
    let name = companyName;
    if (companyId && !name) name = (await storage.getCompany(parseInt(companyId)))?.name;
    if (!code || !name) return res.status(400).json({ message: "Kod och företagsnamn krävs" });
    if (await storage.getCompanyCodeByCode(String(code).toUpperCase())) return res.status(400).json({ message: "Koden finns redan" });
    const cc = await storage.createCompanyCode({
      code: String(code).toUpperCase(),
      companyName: name,
      maxUses: maxUses || 50,
      pricePerUser: pricePerUser || 119000,
      companyId: companyId ? parseInt(companyId) : null,
    });
    res.json(cc);
  } catch {
    res.status(400).json({ message: "Kunde inte skapa kod" });
  }
});

app.patch("/api/admin/company-codes/:id", requireAdmin, async (req, res) => {
  try {
    const { isActive, maxUses, companyId } = req.body || {};
    await storage.updateCompanyCode(parseInt(req.params.id), { isActive, maxUses, companyId: companyId === undefined ? undefined : (companyId ? parseInt(companyId) : null) });
    res.json({ message: "Uppdaterad" });
  } catch {
    res.status(500).json({ message: "Kunde inte uppdatera" });
  }
});

app.delete("/api/admin/company-codes/:id", requireAdmin, async (req, res) => {
  try {
    await storage.deleteCompanyCode(parseInt(req.params.id));
    res.json({ message: "Borttagen" });
  } catch {
    res.status(500).json({ message: "Kunde inte ta bort" });
  }
});

// Public: validate company code (registration form)
app.get("/api/company-codes/validate/:code", async (req, res) => {
  const cc = await storage.getCompanyCodeByCode(req.params.code.toUpperCase());
  if (!cc || !cc.isActive || cc.usedCount >= cc.maxUses) return res.json({ valid: false });
  res.json({ valid: true, companyName: cc.companyName, remaining: cc.maxUses - cc.usedCount });
});

export default app;
