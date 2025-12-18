// Repository Interface: IQuestionRepository
// Defines contract for question data access (Dependency Inversion Principle)

import { Question, QuestionCategory, QuestionDifficulty } from '../entities/Question';

export interface QuestionFilters {
  category?: QuestionCategory;
  difficulty?: QuestionDifficulty;
  tags?: string[];
  limit?: number;
}

export interface IQuestionRepository {
  getAll(filters?: QuestionFilters): Promise<Question[]>;
  getById(id: string): Promise<Question | null>;
  getByCategory(category: QuestionCategory, limit?: number): Promise<Question[]>;
  getRandomQuestions(count: number, filters?: QuestionFilters): Promise<Question[]>;
  getCategories(): Promise<QuestionCategory[]>;
}
