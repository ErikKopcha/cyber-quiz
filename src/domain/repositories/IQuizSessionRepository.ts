// Repository Interface: IQuizSessionRepository
// Defines contract for quiz session data access

import { QuestionCategory } from '../entities/Question';
import { QuizSession } from '../entities/QuizSession';

export interface IQuizSessionRepository {
  create(session: QuizSession): Promise<void>;
  update(session: QuizSession): Promise<void>;
  getById(id: string): Promise<QuizSession | null>;
  getByUserId(userId: string, limit?: number): Promise<QuizSession[]>;
  getUserSessionsByCategory(userId: string, category: QuestionCategory): Promise<QuizSession[]>;
  getLatestSessions(userId: string, limit: number): Promise<QuizSession[]>;
  delete(id: string): Promise<void>;
}
