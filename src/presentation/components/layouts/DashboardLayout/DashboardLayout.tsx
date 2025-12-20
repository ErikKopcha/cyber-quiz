'use client';

import { ReactNode } from 'react';
import { AuthGuard } from '../../guards/AuthGuard';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import styles from './DashboardLayout.module.scss';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <AuthGuard>
      <div className={styles.layout}>
        <Header />
        <div className={styles.container}>
          <Sidebar />
          <main className={styles.main}>{children}</main>
        </div>

        {/* Background Decorative Glows */}
        <div className={styles.bgGlowCyan} />
        <div className={styles.bgGlowPink} />
      </div>
    </AuthGuard>
  );
};
