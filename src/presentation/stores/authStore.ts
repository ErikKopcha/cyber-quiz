// Presentation: Auth Store (Zustand)
// Global state management for authentication

import { User } from '@/domain/entities/User';
import { auth } from '@/infrastructure/firebase/config';
import { UserRepository } from '@/infrastructure/repositories/UserRepository';
import { create } from 'zustand';

async function setAuthCookie() {
  try {
    const currentUser = auth?.currentUser;
    if (!currentUser) {
      console.warn('No current user to set cookie for');
      return;
    }

    const idToken = await currentUser.getIdToken();

    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
  } catch (error) {
    console.error('Failed to set auth cookie:', error);
  }
}

async function removeAuthCookie() {
  try {
    await fetch('/api/auth/session', { method: 'DELETE' });
  } catch (error) {
    console.error('Failed to remove auth cookie:', error);
  }
}

interface AuthState {
  // State
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;

  // Actions
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  initialize: () => void;
  refreshUser: () => Promise<void>;
}

const userRepository = new UserRepository();

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  loading: false,
  error: null,
  initialized: false,

  refreshUser: async () => {
    const currentUser = get().user;
    if (!currentUser) return;

    try {
      const updatedUser = await userRepository.getUserById(currentUser.id);
      if (updatedUser) {
        set({ user: updatedUser });
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      const user = await userRepository.signInWithGoogle();
      if (user) {
        await setAuthCookie();
        set({ user, loading: false });
      } else {
        // User cancelled sign-in
        set({ loading: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Google';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  signInWithEmail: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const user = await userRepository.signInWithEmail(email, password);
      await setAuthCookie();
      set({ user, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  signUpWithEmail: async (email: string, password: string, displayName: string) => {
    set({ loading: true, error: null });
    try {
      const user = await userRepository.signUpWithEmail(email, password, displayName);
      await setAuthCookie();
      set({ user, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign up';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      await userRepository.signOut();
      await removeAuthCookie();
      set({ user: null, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign out';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  setUser: async (user: User | null) => {
    if (user) {
      await setAuthCookie();
    } else {
      await removeAuthCookie();
    }
    set({ user });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  initialize: () => {
    if (get().initialized) {
      return;
    }

    set({ initialized: true, loading: true });

    userRepository.onAuthStateChanged(async (user) => {
      if (user) {
        await setAuthCookie();
      } else {
        await removeAuthCookie();
      }

      set({ user, loading: false });
    });
  },
}));
