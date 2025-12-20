'use client';

import { ROUTES } from '@/constants/routes';
import { QuizSessionRepositoryFirestore } from '@/infrastructure/repositories/QuizSessionRepositoryFirestore';
import { useAuthStore } from '@/presentation/stores/authStore';
import clsx from 'clsx';
import { BarChart2, History, LayoutDashboard, LucideIcon, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './Sidebar.module.scss';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { label: 'Overview', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Active Quiz', href: ROUTES.QUIZ, icon: Zap },
  { label: 'History', href: ROUTES.HISTORY, icon: History },
  { label: 'Analytics', href: ROUTES.ANALYTICS, icon: BarChart2 },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const weeklyTarget = 3;

  useEffect(() => {
    async function fetchProgress() {
      if (!user) return;
      try {
        const repo = new QuizSessionRepositoryFirestore();
        // Fetch sessions to count for this week
        const sessions = await repo.getByUserId(user.id, 20);

        const count = sessions.filter(s =>
          s.category === 'react' &&
          (new Date().getTime() - new Date(s.startedAt).getTime()) < 7 * 24 * 60 * 60 * 1000
        ).length;

        console.log(`[Sidebar] Weekly progress: ${count}/${3} React quizzes`);
        setWeeklyProgress(count);
      } catch (error) {
        console.error('Failed to fetch sidebar progress:', error);
      }
    }

    fetchProgress();
  }, [user?.id, user?.xp, pathname]); // Re-fetch when user XP changes or route changes

  const progressPercent = Math.min((weeklyProgress / weeklyTarget) * 100, 100);

  return (
    <aside className={styles.sidebar}>
      {/* Navigation */}
      <div>
        <div className={styles.navLabel}>System</div>
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(styles.navLink, {
                  [styles.active]: isActive,
                })}
              >
                <Icon size={20} className={styles.navIcon} />
                <span className={styles.navText}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Weekly Challenge */}
      <div className={styles.challenge}>
        <h4 className={styles.challengeTitle}>Weekly Challenge</h4>
        <p className={styles.challengeDescription}>Complete 3 React quizzes to earn 500 XP.</p>
        <div className={styles.challengeProgress}>
          <div className={styles.challengeProgressBar} style={{ width: `${progressPercent}%` }} />
        </div>
        <div className={styles.challengeStats}>
          <span>{weeklyProgress}/{weeklyTarget} Done</span>
          <span>+500 XP</span>
        </div>
      </div>
    </aside>
  );
};
