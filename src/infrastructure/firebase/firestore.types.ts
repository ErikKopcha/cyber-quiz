// Firestore Type Converters
// Provides type-safe conversions between Domain entities and Firestore documents

import { QuestionCategory } from '@/domain/entities/Question';
import { QuizSession, QuizSessionProps } from '@/domain/entities/QuizSession';
import {
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    SnapshotOptions,
    Timestamp,
} from 'firebase/firestore';

// Firestore Document Types
export interface AnswerDocument {
  questionId: string;
  userAnswer: number | number[];
  isCorrect: boolean;
  timeSpent: number;
  answeredAt: Timestamp;
}

export interface QuizSessionDocument {
  userId: string;
  category: QuestionCategory;
  questionIds: string[];
  answers: AnswerDocument[];
  startedAt: Timestamp;
  completedAt?: Timestamp;
  totalScore: number;
  maxScore: number;
}

// QuizSession Converter
export const quizSessionConverter: FirestoreDataConverter<QuizSession> = {
  toFirestore: (session: QuizSession): QuizSessionDocument => {
    const props = session.toJSON();
    return {
      userId: props.userId,
      category: props.category,
      questionIds: [...props.questionIds],
      answers: props.answers.map((answer) => ({
        questionId: answer.questionId,
        userAnswer: answer.userAnswer,
        isCorrect: answer.isCorrect,
        timeSpent: answer.timeSpent,
        answeredAt: Timestamp.fromDate(answer.answeredAt),
      })),
      startedAt: Timestamp.fromDate(props.startedAt),
      completedAt: props.completedAt ? Timestamp.fromDate(props.completedAt) : undefined,
      totalScore: props.totalScore,
      maxScore: props.maxScore,
    };
  },

  fromFirestore: (
    snapshot: QueryDocumentSnapshot<QuizSessionDocument>,
    options?: SnapshotOptions
  ): QuizSession => {
    const data = snapshot.data(options);

    const props: QuizSessionProps = {
      id: snapshot.id,
      userId: data.userId,
      category: data.category,
      questionIds: data.questionIds,
      answers: data.answers.map((answer) => ({
        questionId: answer.questionId,
        userAnswer: answer.userAnswer,
        isCorrect: answer.isCorrect,
        timeSpent: answer.timeSpent,
        answeredAt: answer.answeredAt.toDate(),
      })),
      startedAt: data.startedAt.toDate(),
      completedAt: data.completedAt?.toDate(),
      totalScore: data.totalScore,
      maxScore: data.maxScore,
    };

    return QuizSession.create(props);
  },
};
