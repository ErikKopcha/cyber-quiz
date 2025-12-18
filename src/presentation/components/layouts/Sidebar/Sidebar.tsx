'use client';

import clsx from 'clsx';
import { BarChart2, History, LayoutDashboard, LucideIcon, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.scss';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Active Quiz', href: '/quiz', icon: Zap },
  { label: 'History', href: '/history', icon: History },
  { label: 'Analytics', href: '/analytics', icon: BarChart2 },
];

export const Sidebar = () => {
  const pathname = usePathname();

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
          <div className={styles.challengeProgressBar} style={{ width: '65%' }} />
        </div>
        <div className={styles.challengeStats}>
          <span>2/3 Done</span>
          <span>+500 XP</span>
        </div>
      </div>
    </aside>
  );
};
