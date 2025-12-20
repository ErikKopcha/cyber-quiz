'use client';

import { ROUTES } from '@/constants/routes';
import { LoginForm } from '@/presentation/components/features/AuthForms/LoginForm';
import { SignupForm } from '@/presentation/components/features/AuthForms/SignupForm';
import { useAuthStore } from '@/presentation/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';

type AuthMode = 'login' | 'signup';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const router = useRouter();
  const { user, loading } = useAuthStore();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (user && !loading) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [user, loading, router]);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Initializing...</p>
      </div>
    );
  }

  // Don't show auth form if user is authenticated
  if (user) {
    return null;
  }

  return (
    <div className={styles.authPage}>
      {/* Background Effects */}
      <div className={styles.backgroundGrid} />
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />

      {/* Auth Container */}
      <div className={styles.authContainer}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <div className={styles.logoIcon}>
            <div className={styles.logoInner}>&#123; &#125;</div>
          </div>
          <h1 className={styles.title}>
            Cyber<span className={styles.highlight}>Quiz</span>
          </h1>
          <p className={styles.subtitle}>Master Senior Frontend Interviews</p>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={mode === 'login' ? styles.tabActive : styles.tab}
            onClick={() => setMode('login')}
          >
            Sign In
          </button>
          <button
            className={mode === 'signup' ? styles.tabActive : styles.tab}
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
        </div>

        {/* Forms */}
        <div className={styles.formContainer}>
          {mode === 'login' ? <LoginForm /> : <SignupForm />}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
