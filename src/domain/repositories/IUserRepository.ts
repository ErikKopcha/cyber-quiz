// Domain Repository Interface: IUserRepository
// Defines contract for User data access operations

import { User } from '../entities/User';

export interface IUserRepository {
  /**
   * Sign in with Google OAuth
   * @returns User entity if successful, null if cancelled
   * @throws Error if authentication fails
   */
  signInWithGoogle(): Promise<User | null>;

  /**
   * Sign in with email and password
   * @param email - User email
   * @param password - User password
   * @returns User entity if successful
   * @throws Error if authentication fails
   */
  signInWithEmail(email: string, password: string): Promise<User>;

  /**
   * Sign up with email and password
   * @param email - User email
   * @param password - User password
   * @param displayName - User display name
   * @returns User entity if successful
   * @throws Error if registration fails
   */
  signUpWithEmail(email: string, password: string, displayName: string): Promise<User>;

  /**
   * Sign out current user
   * @throws Error if sign out fails
   */
  signOut(): Promise<void>;

  /**
   * Get current authenticated user
   * @returns User entity if authenticated, null otherwise
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Get user by ID from Firestore
   * @param userId - User ID
   * @returns User entity if found, null otherwise
   */
  getUserById(userId: string): Promise<User | null>;

  /**
   * Create or update user profile in Firestore
   * @param user - User entity to save
   * @throws Error if save fails
   */
  saveUser(user: User): Promise<void>;

  /**
   * Subscribe to auth state changes
   * @param callback - Function to call when auth state changes
   * @returns Unsubscribe function
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}
