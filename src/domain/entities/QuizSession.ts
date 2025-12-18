// Domain Entity: QuizSession
// Represents an active or completed quiz session

import type { AnswerProps } from './Answer';
import type { QuestionCategory } from './Question';

export interface QuizSessionProps {
  readonly id: string;
  readonly userId: string;
  readonly category: QuestionCategory;
  readonly questionIds: ReadonlyArray<string>;
  readonly answers: ReadonlyArray<AnswerProps>;
  readonly startedAt: Date;
  readonly completedAt?: Date;
  readonly totalScore: number;
  readonly maxScore: number;
}

export class QuizSession {
  private constructor(private readonly props: QuizSessionProps) {
    this.validate();
  }

  static create(props: QuizSessionProps): QuizSession {
    return new QuizSession(props);
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get category(): QuestionCategory {
    return this.props.category;
  }

  get questionIds(): ReadonlyArray<string> {
    return this.props.questionIds;
  }

  get answers(): ReadonlyArray<AnswerProps> {
    return this.props.answers;
  }

  get startedAt(): Date {
    return this.props.startedAt;
  }

  get completedAt(): Date | undefined {
    return this.props.completedAt;
  }

  get totalScore(): number {
    return this.props.totalScore;
  }

  get maxScore(): number {
    return this.props.maxScore;
  }

  // Business Logic
  isCompleted(): boolean {
    return this.props.completedAt !== undefined;
  }

  getProgress(): number {
    return Math.round((this.props.answers.length / this.props.questionIds.length) * 100);
  }

  getAccuracy(): number {
    if (this.props.answers.length === 0) return 0;
    const correctAnswers = this.props.answers.filter((a) => a.isCorrect).length;
    return Math.round((correctAnswers / this.props.answers.length) * 100);
  }

  getScorePercentage(): number {
    if (this.props.maxScore === 0) return 0;
    return Math.round((this.props.totalScore / this.props.maxScore) * 100);
  }

  getDuration(): number {
    if (!this.props.completedAt) {
      return Math.floor((Date.now() - this.props.startedAt.getTime()) / 1000);
    }
    return Math.floor((this.props.completedAt.getTime() - this.props.startedAt.getTime()) / 1000);
  }

  private validate(): void {
    if (!this.props.id || this.props.id.trim() === '') {
      throw new Error('Quiz session ID cannot be empty');
    }

    if (!this.props.userId || this.props.userId.trim() === '') {
      throw new Error('User ID cannot be empty');
    }

    if (this.props.questionIds.length === 0) {
      throw new Error('Quiz session must have at least one question');
    }

    if (this.props.totalScore < 0 || this.props.maxScore < 0) {
      throw new Error('Scores cannot be negative');
    }

    if (this.props.totalScore > this.props.maxScore) {
      throw new Error('Total score cannot exceed max score');
    }
  }

  toJSON(): QuizSessionProps {
    return {
      ...this.props,
      startedAt: this.props.startedAt,
      completedAt: this.props.completedAt,
    };
  }
}
