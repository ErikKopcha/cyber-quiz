// Infrastructure: Firestore QuizSessionRepository Implementation
// Implements IQuizSessionRepository using Firebase Firestore

import {
    collection,
    deleteDoc,
    doc,
    limit as firestoreLimit,
    getDoc,
    getDocs,
    orderBy,
    query,
    setDoc,
    where,
} from 'firebase/firestore';

import { QuestionCategory } from '@/domain/entities/Question';
import { QuizSession } from '@/domain/entities/QuizSession';
import { IQuizSessionRepository } from '@/domain/repositories/IQuizSessionRepository';
import { db } from '../firebase/config';
import { quizSessionConverter } from '../firebase/firestore.types';

const QUIZ_SESSIONS_COLLECTION = 'quizSessions';

export class QuizSessionRepositoryFirestore implements IQuizSessionRepository {
  private checkFirebase(): void {
    if (!db) {
      throw new Error('Firebase not configured. Please add Firebase credentials to .env.local');
    }
  }

  private getCollection() {
    this.checkFirebase();
    return collection(db!, QUIZ_SESSIONS_COLLECTION).withConverter(quizSessionConverter);
  }

  async create(session: QuizSession): Promise<void> {
    try {
      const sessionRef = doc(this.getCollection(), session.id);
      await setDoc(sessionRef, session);
    } catch (error) {
      console.error('Failed to create quiz session (offline?):', error);
      // Do not throw, allow UI to proceed
    }
  }

  async update(session: QuizSession): Promise<void> {
    try {
      const sessionRef = doc(this.getCollection(), session.id);
      await setDoc(sessionRef, session, { merge: true });
    } catch (error) {
      throw new Error(
        `Failed to update quiz session: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getById(id: string): Promise<QuizSession | null> {
    try {
      const sessionRef = doc(this.getCollection(), id);
      const sessionDoc = await getDoc(sessionRef);

      if (!sessionDoc.exists()) {
        return null;
      }

      return sessionDoc.data();
    } catch (error) {
      throw new Error(
        `Failed to get quiz session: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getByUserId(userId: string, limit?: number): Promise<QuizSession[]> {
    try {
      const q = limit
        ? query(
            this.getCollection(),
            where('userId', '==', userId),
            orderBy('startedAt', 'desc'),
            firestoreLimit(limit)
          )
        : query(this.getCollection(), where('userId', '==', userId), orderBy('startedAt', 'desc'));

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => doc.data());
    } catch (error) {
      throw new Error(
        `Failed to get user quiz sessions: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getUserSessionsByCategory(
    userId: string,
    category: QuestionCategory
  ): Promise<QuizSession[]> {
    try {
      const q = query(
        this.getCollection(),
        where('userId', '==', userId),
        where('category', '==', category),
        orderBy('startedAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => doc.data());
    } catch (error) {
      throw new Error(
        `Failed to get user sessions by category: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getLatestSessions(userId: string, limit: number): Promise<QuizSession[]> {
    try {
      const q = query(
        this.getCollection(),
        where('userId', '==', userId),
        orderBy('startedAt', 'desc'),
        firestoreLimit(limit)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => doc.data());
    } catch (error) {
      throw new Error(
        `Failed to get latest sessions: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const sessionRef = doc(this.getCollection(), id);
      await deleteDoc(sessionRef);
    } catch (error) {
      throw new Error(
        `Failed to delete quiz session: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
