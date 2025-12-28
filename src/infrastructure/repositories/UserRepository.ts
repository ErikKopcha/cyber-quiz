// Infrastructure: Firebase UserRepository Implementation
// Implements IUserRepository using Firebase Auth and Firestore

import {
    createUserWithEmailAndPassword,
    onAuthStateChanged as firebaseOnAuthStateChanged,
    signOut as firebaseSignOut,
    User as FirebaseUser,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    updateProfile,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';

import { User } from '@/domain/entities/User';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { auth, db } from '../firebase/config';

// Firestore collection name
const USERS_COLLECTION = 'users';

export class UserRepository implements IUserRepository {
  private googleProvider: GoogleAuthProvider;

  constructor() {
    this.googleProvider = new GoogleAuthProvider();
    // Optional: Set custom parameters
    this.googleProvider.setCustomParameters({
      prompt: 'select_account',
    });
  }

  private checkFirebase(): void {
    if (!auth || !db) {
      throw new Error('Firebase not configured. Please add Firebase credentials to .env.local');
    }
  }

  /**
   * Convert Firebase User to Domain User entity
   * Uses optimistic approach: create user from Firebase Auth data first,
   * then sync with Firestore in background
   */
  private async firebaseUserToEntity(
    firebaseUser: FirebaseUser,
    skipFirestore = false
  ): Promise<User> {
    // Create user entity from Firebase Auth data (always works, no network needed)
    const user = User.create({
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || 'Anonymous',
      photoURL: firebaseUser.photoURL || undefined,
      createdAt: new Date(),
      level: 1,
      xp: 0,
    });

    // Skip Firestore operations if requested (used for initial login)
    if (skipFirestore) {
      // Sync with Firestore in background (don't await)
      this.syncUserWithFirestore(firebaseUser.uid, user).catch((error) => {
        console.warn('Background Firestore sync failed:', error);
      });
      return user;
    }

    // Try to get enriched data from Firestore (with retry logic)
    try {
      const userDoc = await this.getDocWithRetry(
        doc(db!, USERS_COLLECTION, firebaseUser.uid),
        3,
        1000
      );

      if (userDoc && userDoc.exists()) {
        const data = userDoc.data() as {
          createdAt?: Timestamp | Date;
          level?: number;
          xp?: number;
        };

        return User.create({
          ...user.toJSON(),
          createdAt:
            data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
          level: data.level || 1,
          xp: data.xp || 0,
        });
      }

      // Document doesn't exist, save new user to Firestore
      await this.saveUser(user);
    } catch (error) {
      console.warn('Firestore operation failed, using Auth data only:', error);
      // Still return user from Auth data, sync in background
      this.syncUserWithFirestore(firebaseUser.uid, user).catch((err) => {
        console.error('Background sync also failed:', err);
      });
    }

    return user;
  }

  /**
   * Helper: Get Firestore document with retry logic
   */
  private async getDocWithRetry(
    docRef: ReturnType<typeof doc>,
    maxRetries: number,
    delayMs: number
  ): Promise<ReturnType<typeof getDoc> | null> {
    let lastError: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await getDoc(docRef);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }

    throw lastError;
  }

  /**
   * Helper: Background sync with Firestore (non-blocking)
   */
  private async syncUserWithFirestore(userId: string, user: User): Promise<void> {
    try {
      const userDoc = await getDoc(doc(db!, USERS_COLLECTION, userId));

      if (!userDoc.exists()) {
        // Create new user document
        await this.saveUser(user);
      }
    } catch (error) {
      console.error('Failed to sync user with Firestore:', error);
      throw error;
    }
  }

  async signInWithGoogle(): Promise<User | null> {
    this.checkFirebase();
    try {
      const result = await signInWithPopup(auth!, this.googleProvider);
      // Use optimistic approach: return user immediately, sync with Firestore in background
      // This prevents "client is offline" errors when Firestore connection is slow
      return await this.firebaseUserToEntity(result.user, true);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'auth/popup-closed-by-user'
      ) {
        // User cancelled the sign-in, return null
        return null;
      }
      throw new Error(
        `Google sign-in failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async signInWithEmail(email: string, password: string): Promise<User> {
    this.checkFirebase();
    try {
      const result = await signInWithEmailAndPassword(auth!, email, password);
      // Use optimistic approach: return user immediately, sync with Firestore in background
      return await this.firebaseUserToEntity(result.user, true);
    } catch (error: unknown) {
      throw new Error(
        `Email sign-in failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async signUpWithEmail(email: string, password: string, displayName: string): Promise<User> {
    this.checkFirebase();
    try {
      const result = await createUserWithEmailAndPassword(auth!, email, password);

      // Update profile with display name (must complete before creating user entity)
      await updateProfile(result.user, { displayName });

      // Reload user to get updated profile
      await result.user.reload();

      // Create user entity with the display name we just set
      const user = User.create({
        id: result.user.uid,
        email: result.user.email || email,
        displayName: displayName, // Use the displayName from parameter (guaranteed to be set)
        photoURL: result.user.photoURL || undefined,
        createdAt: new Date(),
        level: 1,
        xp: 0,
      });

      // Save to Firestore in background (non-blocking)
      this.saveUser(user).catch((error) => {
        console.error('Failed to save new user to Firestore:', error);
      });

      return user;
    } catch (error: unknown) {
      throw new Error(
        `Email sign-up failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async signOut(): Promise<void> {
    this.checkFirebase();
    try {
      await firebaseSignOut(auth!);
    } catch (error: unknown) {
      throw new Error(
        `Sign out failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getCurrentUser(): Promise<User | null> {
    this.checkFirebase();
    const firebaseUser = auth!.currentUser;
    if (!firebaseUser) return null;
    return await this.firebaseUserToEntity(firebaseUser);
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db!, USERS_COLLECTION, userId));

      if (!userDoc.exists()) {
        return null;
      }

      const data = userDoc.data();
      return User.create({
        id: userDoc.id,
        email: data.email,
        displayName: data.displayName,
        photoURL: data.photoURL,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        level: data.level || 1,
        xp: data.xp || 0,
      });
    } catch (error: unknown) {
      throw new Error(
        `Failed to get user: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async saveUser(user: User): Promise<void> {
    try {
      const userRef = doc(db!, USERS_COLLECTION, user.id);

      const userData = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL || null,
        level: user.level,
        xp: user.xp,
        updatedAt: serverTimestamp(),
        // We use setDoc with merge, so createdAt won't be overwritten if it exists.
        // But if it's a new doc, we want createdAt.
        // Firestore doesn't have "setOnInsert", so we rely on the fact that if we created the user via Auth,
        // we likely saved it once.
        // However, to be safe for offline-first:
      };

      // Simple set with merge is robust for offline
      await setDoc(userRef, userData, { merge: true });
    } catch (error: unknown) {
      console.error('Save user failed:', error);
      // Don't throw, just log. This allows the UI to proceed even if background sync fails momentarily.
      // throw new Error(...)
    }
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    if (!auth) {
      console.warn('[UserRepository] Firebase auth not configured');
      // Firebase not configured, return no-op unsubscribe
      return () => {};
    }

    return firebaseOnAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const user = await this.firebaseUserToEntity(firebaseUser, true);
          callback(user);
        } catch (error) {
          console.error('[UserRepository] CRITICAL ERROR converting Firebase user to entity:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }
}
