// Domain Entity: Question
// Represents a single quiz question with immutable properties

export type QuestionCategory =
  | 'react'
  | 'typescript'
  | 'css'
  | 'javascript'
  | 'algorithms'
  | 'system-design';

export type QuestionDifficulty = 'junior' | 'middle' | 'senior';

export type QuestionType = 'multiple-choice' | 'code-review' | 'true-false';

export interface QuestionProps {
  readonly id: string;
  readonly category: QuestionCategory;
  readonly difficulty: QuestionDifficulty;
  readonly type: QuestionType;
  readonly question: string;
  readonly code?: string;
  readonly options: ReadonlyArray<string>;
  readonly correctAnswer: number | ReadonlyArray<number>;
  readonly explanation: string;
  readonly tags: ReadonlyArray<string>;
  readonly weight: number; // Used for skill matrix calculation (1-10)
}

export class Question {
  private constructor(private readonly props: QuestionProps) {
    this.validate();
  }

  static create(props: QuestionProps): Question {
    return new Question(props);
  }

  // Getters (Encapsulation)
  get id(): string {
    return this.props.id;
  }

  get category(): QuestionCategory {
    return this.props.category;
  }

  get difficulty(): QuestionDifficulty {
    return this.props.difficulty;
  }

  get type(): QuestionType {
    return this.props.type;
  }

  get question(): string {
    return this.props.question;
  }

  get code(): string | undefined {
    return this.props.code;
  }

  get options(): ReadonlyArray<string> {
    return this.props.options;
  }

  get correctAnswer(): number | ReadonlyArray<number> {
    return this.props.correctAnswer;
  }

  get explanation(): string {
    return this.props.explanation;
  }

  get tags(): ReadonlyArray<string> {
    return this.props.tags;
  }

  get weight(): number {
    return this.props.weight;
  }

  // Business Logic
  isCorrectAnswer(userAnswer: number | number[]): boolean {
    if (Array.isArray(this.props.correctAnswer)) {
      if (!Array.isArray(userAnswer)) return false;
      return this.arrayEquals(userAnswer, this.props.correctAnswer);
    }
    return userAnswer === this.props.correctAnswer;
  }

  private arrayEquals(a: number[], b: ReadonlyArray<number>): boolean {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, idx) => val === sortedB[idx]);
  }

  private validate(): void {
    if (!this.props.id || this.props.id.trim() === '') {
      throw new Error('Question ID cannot be empty');
    }

    if (this.props.options.length < 2) {
      throw new Error('Question must have at least 2 options');
    }

    if (this.props.weight < 1 || this.props.weight > 10) {
      throw new Error('Question weight must be between 1 and 10');
    }

    // Validate correctAnswer is within options range
    if (Array.isArray(this.props.correctAnswer)) {
      const invalidIndices = this.props.correctAnswer.filter(
        (idx) => idx < 0 || idx >= this.props.options.length
      );
      if (invalidIndices.length > 0) {
        throw new Error('Correct answer indices out of range');
      }
    } else if (typeof this.props.correctAnswer === 'number') {
      if (this.props.correctAnswer < 0 || this.props.correctAnswer >= this.props.options.length) {
        throw new Error('Correct answer index out of range');
      }
    }
  }

  // Serialization for persistence
  toJSON(): QuestionProps {
    return { ...this.props };
  }
}
