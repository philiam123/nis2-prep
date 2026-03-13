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
  getCertificatById(certId: string): Promise<Certificate | undefined>;
}

export const storage: IStorage = new PostgresStorage();
