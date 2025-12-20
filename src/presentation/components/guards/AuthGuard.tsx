'use client';

import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/presentation/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Auth Guard Component
 * Protects routes by redirecting unauthenticated users to login page
 * Shows loading state while checking authentication
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, initialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to initialize before making decisions
    if (!initialized || loading) {
      return;
    }

    // If no user after initialization, redirect to auth page
    if (!user) {
      router.replace(ROUTES.AUTH);
    }
  }, [user, loading, initialized, router]);

  // Show loading while auth is initializing
  if (!initialized || loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#0a0e17',
          color: '#94a3b8',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(59, 130, 246, 0.1)',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p style={{ marginTop: '1rem' }}>Initializing...</p>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // If no user after loading, don't render children (will redirect)
  if (!user) {
    return null;
  }

  // User is authenticated, render protected content
  return <>{children}</>;
}
