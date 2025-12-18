// Domain Entity: Answer
// Represents user's answer to a question

export interface AnswerProps {
  readonly questionId: string;
  readonly userAnswer: number | number[];
  readonly isCorrect: boolean;
  readonly timeSpent: number; // in seconds
  readonly answeredAt: Date;
}

export class Answer {
  private constructor(private readonly props: AnswerProps) {
    this.validate();
  }

  static create(props: AnswerProps): Answer {
    return new Answer(props);
  }

  get questionId(): string {
    return this.props.questionId;
  }

  get userAnswer(): number | number[] {
    return this.props.userAnswer;
  }

  get isCorrect(): boolean {
    return this.props.isCorrect;
  }

  get timeSpent(): number {
    return this.props.timeSpent;
  }

  get answeredAt(): Date {
    return this.props.answeredAt;
  }

  private validate(): void {
    if (!this.props.questionId || this.props.questionId.trim() === '') {
      throw new Error('Question ID cannot be empty');
    }

    if (this.props.timeSpent < 0) {
      throw new Error('Time spent cannot be negative');
    }
  }

  toJSON(): AnswerProps {
    return {
      ...this.props,
      answeredAt: this.props.answeredAt,
    };
  }
}
