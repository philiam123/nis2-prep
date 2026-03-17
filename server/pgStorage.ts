import { eq, and } from "drizzle-orm";
import { getDb } from "./db";
import {
  users,
  studyProgress,
  quizResults,
  certificates,
  type User,
  type InsertUser,
  type StudyProgress,
  type InsertStudyProgress,
  type QuizResult,
  type InsertQuizResult,
  type Certificate,
  type InsertCertificate,
} from "../shared/schema";
import type { IStorage } from "./storage";

export class PostgresStorage implements IStorage {
  private get db() {
    return getDb();
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return this.db.select().from(users);
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await this.db.insert(users).values(user).returning();
    return created;
  }

  async updateUserPayment(userId: number, hasPaid: boolean, stripeCustomerId?: string): Promise<void> {
    const updateData: Record<string, any> = { hasPaid };
    if (stripeCustomerId) updateData.stripeCustomerId = stripeCustomerId;
    await this.db.update(users).set(updateData).where(eq(users.id, userId));
  }

  async getStudyProgress(userId: number): Promise<StudyProgress[]> {
    return this.db.select().from(studyProgress).where(eq(studyProgress.userId, userId));
  }

  async upsertStudyProgress(progress: InsertStudyProgress): Promise<StudyProgress> {
    const [existing] = await this.db
      .select()
      .from(studyProgress)
      .where(
        and(
          eq(studyProgress.userId, progress.userId),
          eq(studyProgress.chapterId, progress.chapterId)
        )
      );

    if (existing) {
      const [updated] = await this.db
        .update(studyProgress)
        .set({ completed: progress.completed })
        .where(eq(studyProgress.id, existing.id))
        .returning();
      return updated;
    }

    const [created] = await this.db.insert(studyProgress).values(progress).returning();
    return created;
  }

  async getQuizResults(userId: number): Promise<QuizResult[]> {
    return this.db.select().from(quizResults).where(eq(quizResults.userId, userId));
  }

  async createQuizResult(result: InsertQuizResult): Promise<QuizResult> {
    const [created] = await this.db.insert(quizResults).values(result).returning();
    return created;
  }

  async getCertificates(userId: number): Promise<Certificate[]> {
    return this.db.select().from(certificates).where(eq(certificates.userId, userId));
  }

  async createCertificate(cert: InsertCertificate): Promise<Certificate> {
    const [created] = await this.db.insert(certificates).values(cert).returning();
    return created;
  }

  async getCertificateById(certificateId: string): Promise<Certificate | undefined> {
    const [cert] = await this.db.select().from(certificates).where(eq(certificates.certificateId, certificateId));
    return cert;
  }
}
