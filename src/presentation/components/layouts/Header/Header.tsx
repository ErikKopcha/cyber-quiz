'use client';

import { ROUTES } from '@/constants/routes';
import { AuthButton } from '@/presentation/components/features/AuthButton';
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
  { label: 'Dashboard', href: ROUTES.DASHBOARD },
  { label: 'Quests', href: ROUTES.QUESTS },
];

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      {/* Logo */}
      <Link href={ROUTES.DASHBOARD} className={styles.logo}>
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

      {/* Authentication */}
      <div className={styles.userSection}>
        <AuthButton />
      </div>
    </header>
  );
};
