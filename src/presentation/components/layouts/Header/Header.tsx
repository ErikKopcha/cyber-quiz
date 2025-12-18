'use client';

import clsx from 'clsx';
import { Terminal } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.scss';

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Quests', href: '/quests' },
];

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      {/* Logo */}
      <Link href="/dashboard" className={styles.logo}>
        <div className={styles.logoIcon}>
          <Terminal size={20} />
        </div>
        <span className={styles.logoText}>
          Cyber<span className={styles.highlight}>Quiz</span>
        </span>
      </Link>

      {/* Navigation */}
      <nav className={styles.nav}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(styles.navLink, {
              [styles.active]: pathname === link.href,
            })}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className={styles.userSection}>
        <div className={styles.userInfo}>
          <div className={styles.userRank}>LVL 5 Netrunner</div>
          <div className={styles.userName}>Alex Dev</div>
        </div>
        <div className={styles.userAvatar}>
          <img
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            alt="User Avatar"
            className={styles.avatarImage}
          />
          <div className={styles.onlineIndicator} />
        </div>
      </div>
    </header>
  );
};
