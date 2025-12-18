// Concrete Implementation: QuestionRepository
// Implements IQuestionRepository using JSON data source

import { Question, QuestionCategory, QuestionDifficulty } from '@/domain/entities/Question';
import { IQuestionRepository, QuestionFilters } from '@/domain/repositories/IQuestionRepository';
import questionsData from '../data/questions.json';

export class QuestionRepository implements IQuestionRepository {
  private questions: Question[];

  constructor() {
    // Load and validate questions from JSON
    this.questions = questionsData.questions.map((q) =>
      Question.create({
        id: q.id,
        category: q.category as QuestionCategory,
        difficulty: q.difficulty as QuestionDifficulty,
        type: q.type as 'multiple-choice' | 'code-review' | 'true-false',
        question: q.question,
        code: q.code,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        tags: q.tags,
        weight: q.weight,
      })
    );
  }

  async getAll(filters?: QuestionFilters): Promise<Question[]> {
    let result = [...this.questions];

    if (filters?.category) {
      result = result.filter((q) => q.category === filters.category);
    }

    if (filters?.difficulty) {
      result = result.filter((q) => q.difficulty === filters.difficulty);
    }

    if (filters?.tags && filters.tags.length > 0) {
      result = result.filter((q) => filters.tags!.some((tag) => q.tags.includes(tag)));
    }

    if (filters?.limit) {
      result = result.slice(0, filters.limit);
    }

    return result;
  }

  async getById(id: string): Promise<Question | null> {
    const question = this.questions.find((q) => q.id === id);
    return question || null;
  }

  async getByCategory(category: QuestionCategory, limit?: number): Promise<Question[]> {
    const filtered = this.questions.filter((q) => q.category === category);
    return limit ? filtered.slice(0, limit) : filtered;
  }

  async getRandomQuestions(count: number, filters?: QuestionFilters): Promise<Question[]> {
    const filtered = await this.getAll(filters);

    // Fisher-Yates shuffle algorithm
    const shuffled = [...filtered];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  async getCategories(): Promise<QuestionCategory[]> {
    return questionsData.categories as QuestionCategory[];
  }
}

// Singleton instance
export const questionRepository = new QuestionRepository();
