// Presentation: Quiz Store (Zustand)
// Global state management for quiz session

import { Answer } from '@/domain/entities/Answer';
import { Question, QuestionCategory } from '@/domain/entities/Question';
import { QuizSession } from '@/domain/entities/QuizSession';
import { User } from '@/domain/entities/User';
import { QuizSessionRepositoryFirestore } from '@/infrastructure/repositories/QuizSessionRepositoryFirestore';
import { UserRepository } from '@/infrastructure/repositories/UserRepository';
import { create } from 'zustand';
import { useAuthStore } from './authStore';

interface QuizState {
  // Current Quiz Session
  currentSession: QuizSession | null;
  questions: Question[];
  currentQuestionIndex: number;

  // UI State
  loading: boolean;
  error: string | null;
  savingSession: boolean;

  // Actions
  startQuiz: (userId: string, category: string, questions: Question[]) => void;
  answerQuestion: (answer: Answer) => void;
  completeQuiz: () => Promise<void>;
  resetQuiz: () => void;
  setError: (error: string | null) => void;
}

// Repository instances
const quizSessionRepository = new QuizSessionRepositoryFirestore();
const userRepository = new UserRepository();

export const useQuizStore = create<QuizState>((set, get) => ({
  // Initial state
  currentSession: null,
  questions: [],
  currentQuestionIndex: 0,
  loading: false,
  error: null,
  savingSession: false,

  // Start new quiz
  startQuiz: (userId: string, category: string, questions: Question[]) => {
    const questionIds = questions.map((q) => q.id);
    const maxScore = questions.reduce((sum, q) => sum + q.weight, 0);

    const session = QuizSession.create({
      id: `${userId}_${Date.now()}`, // Simple ID generation
      userId,
      category: category as QuestionCategory,
      questionIds,
      answers: [],
      startedAt: new Date(),
      totalScore: 0,
      maxScore,
    });

    set({
      currentSession: session,
      questions,
      currentQuestionIndex: 0,
      error: null,
    });
  },

  // Answer current question
  answerQuestion: (answer: Answer) => {
    const { currentSession, questions, currentQuestionIndex } = get();

    if (!currentSession) {
      set({ error: 'No active quiz session' });
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) {
      set({ error: 'Invalid question index' });
      return;
    }

    // Calculate score for this answer
    const scoreGained = answer.isCorrect ? currentQuestion.weight : 0;
    const newTotalScore = currentSession.totalScore + scoreGained;

    // Create updated session with new answer
    const updatedSession = QuizSession.create({
      ...currentSession.toJSON(),
      answers: [...currentSession.answers, answer.toJSON()],
      totalScore: newTotalScore,
    });

    // Move to next question
    const nextIndex = currentQuestionIndex + 1;

    set({
      currentSession: updatedSession,
      currentQuestionIndex: nextIndex,
    });
  },

  // Complete quiz and save to Firestore
  completeQuiz: async () => {
    const { currentSession } = get();

    if (!currentSession) {
      set({ error: 'No active quiz session' });
      return;
    }

    set({ savingSession: true, error: null });

    try {
      // Mark session as completed
      const completedSession = QuizSession.create({
        ...currentSession.toJSON(),
        completedAt: new Date(),
      });

      // Save to Firestore
      await quizSessionRepository.create(completedSession);

      // Calculate XP reward (10 XP per point scored)
      const xpReward = completedSession.totalScore * 10;

      // Update user XP
      const user = await userRepository.getCurrentUser();
      if (user) {
        const newXp = user.xp + xpReward;
        const newLevel = Math.floor(newXp / 1000) + 1;

        const updatedUser = {
          ...user.toJSON(),
          xp: newXp,
          level: newLevel,
        };

        await userRepository.saveUser(User.create(updatedUser));

        // Sync new stats to auth store
        await useAuthStore.getState().refreshUser();
      }

      set({
        currentSession: completedSession,
        savingSession: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save quiz session';
      set({ error: errorMessage, savingSession: false });
      throw error;
    }
  },

  // Reset quiz
  resetQuiz: () => {
    set({
      currentSession: null,
      questions: [],
      currentQuestionIndex: 0,
      error: null,
      savingSession: false,
    });
  },

  // Set error
  setError: (error: string | null) => {
    set({ error });
  },
}));
