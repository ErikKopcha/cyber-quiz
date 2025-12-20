'use client';

import { ROUTES } from '@/constants/routes';
import { Button } from '@/presentation/components/ui/Button';
import { useAuthStore } from '@/presentation/stores/authStore';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import styles from './AuthButton.module.scss';

export function AuthButton() {
  const { user, loading, signInWithGoogle, signOut } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showDropdown]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowDropdown(false);
      // Hard redirect to auth page to ensure middleware runs and cookie is checked
      window.location.href = ROUTES.AUTH;
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (!user) {
    return (
      <Button variant="primary" size="md" onClick={handleSignIn} icon={<LogIn size={18} />}>
        Sign In
      </Button>
    );
  }

  return (
    <div className={styles.userMenu} ref={dropdownRef}>
      <button className={styles.userButton} onClick={() => setShowDropdown(!showDropdown)}>
        {user.photoURL ? (
          <img src={user.photoURL} alt={user.displayName} className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>
            <UserIcon size={20} />
          </div>
        )}
        <span className={styles.userName}>{user.displayName}</span>
      </button>

      {showDropdown && (
        <div className={styles.dropdown}>
          <div className={styles.userInfo}>
            <p className={styles.displayName}>{user.displayName}</p>
            <p className={styles.email}>{user.email}</p>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.label}>Level</span>
                <span className={styles.value}>{user.level}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.label}>XP</span>
                <span className={styles.value}>{user.xp}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.label}>Rank</span>
                <span className={styles.value}>{user.getRank()}</span>
              </div>
            </div>
          </div>

          <button className={styles.signOutButton} onClick={handleSignOut}>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
