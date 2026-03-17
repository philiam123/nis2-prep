import type { User, InsertUser, StudyProgress, InsertStudyProgress, QuizResult, InsertQuizResult, Certificate, InsertCertificate } from "../shared/schema";
import { PostgresStorage } from "./pgStorage";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPayment(userId: number, hasPaid: boolean, stripeCustomerId?: string): Promise<void>;

  // Study Progress
  getStudyProgress(userId: number): Promise<StudyProgress[]>;
  upsertStudyProgress(progress: InsertStudyProgress): Promise<StudyProgress>;

  // Quiz Results
  getQuizResults(userId: number): Promise<QuizResult[]>;
  createQuizResult(result: InsertQuizResult): Promise<QuizResult>;

  // Certificates
  getCertificates(userId: number): Promise<Certificate[]>;
  createCertificate(cert: InsertCertificate): Promise<Certificate>;
  getCertificateById(certificateId: string): Promise<Certificate | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private studyProgressMap: Map<number, StudyProgress[]> = new Map();
  private quizResultsMap: Map<number, QuizResult[]> = new Map();
  private certificatesMap: Map<number, Certificate[]> = new Map();
  private nextUserId = 1;
  private nextProgressId = 1;
  private nextQuizId = 1;
  private nextCertId = 1;

  constructor() {
    this.seedAdmin();
  }

  private seedAdmin() {
    const adminPassword = this.hashPassword("Nis2Admin2026!");
    const admin: User = {
      id: this.nextUserId++,
      email: "admin@nis2prep.se",
      password: adminPassword,
      name: "Admin",
      hasPaid: true,
      isAdmin: true,
      stripeCustomerId: null,
      createdAt: new Date(),
    };
    this.users.set(admin.id, admin);
  }

  private hashPassword(password: string): string {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return `$hash$${Math.abs(hash).toString(36)}$${password.length}`;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: this.nextUserId++,
      email: user.email,
      password: user.password,
      name: user.name,
      hasPaid: false,
      isAdmin: false,
      stripeCustomerId: null,
      createdAt: new Date(),
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  async updateUserPayment(userId: number, hasPaid: boolean, stripeCustomerId?: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.hasPaid = hasPaid;
      if (stripeCustomerId) user.stripeCustomerId = stripeCustomerId;
    }
  }

  async getStudyProgress(userId: number): Promise<StudyProgress[]> {
    return this.studyProgressMap.get(userId) || [];
  }

  async upsertStudyProgress(progress: InsertStudyProgress): Promise<StudyProgress> {
    const userProgress = this.studyProgressMap.get(progress.userId) || [];
    const existing = userProgress.find(p => p.chapterId === progress.chapterId);
    if (existing) {
      existing.completed = progress.completed;
      return existing;
    }
    const newProgress: StudyProgress = {
      id: this.nextProgressId++,
      userId: progress.userId,
      chapterId: progress.chapterId,
      completed: progress.completed,
    };
    userProgress.push(newProgress);
    this.studyProgressMap.set(progress.userId, userProgress);
    return newProgress;
  }

  async getQuizResults(userId: number): Promise<QuizResult[]> {
    return this.quizResultsMap.get(userId) || [];
  }

  async createQuizResult(result: InsertQuizResult): Promise<QuizResult> {
    const newResult: QuizResult = {
      id: this.nextQuizId++,
      userId: result.userId,
      domains: result.domains,
      totalQuestions: result.totalQuestions,
      correctAnswers: result.correctAnswers,
      answers: result.answers,
      completedAt: new Date(),
    };
    const results = this.quizResultsMap.get(result.userId) || [];
    results.push(newResult);
    this.quizResultsMap.set(result.userId, results);
    return newResult;
  }

  async getCertificates(userId: number): Promise<Certificate[]> {
    return this.certificatesMap.get(userId) || [];
  }

  async createCertificate(cert: InsertCertificate): Promise<Certificate> {
    const newCert: Certificate = {
      id: this.nextCertId++,
      userId: cert.userId,
      certificateId: cert.certificateId,
      examScore: cert.examScore,
      totalQuestions: cert.totalQuestions,
      issuedAt: new Date(),
    };
    const certs = this.certificatesMap.get(cert.userId) || [];
    certs.push(newCert);
    this.certificatesMap.set(cert.userId, certs);
    return newCert;
  }

  async getCertificateById(certificateId: string): Promise<Certificate | undefined> {
    for (const certs of this.certificatesMap.values()) {
      const cert = certs.find(c => c.certificateId === certificateId);
      if (cert) return cert;
    }
    return undefined;
  }
}

// Use PostgresStorage when DATABASE_URL is available, otherwise fall back to MemStorage
const storage: IStorage = process.env.DATABASE_URL
  ? new PostgresStorage()
  : new MemStorage();

if (process.env.DATABASE_URL) {
  console.log("Using PostgreSQL storage");
} else {
  console.log("Using in-memory storage (no DATABASE_URL)");
}

export { storage };
