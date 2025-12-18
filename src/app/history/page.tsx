import { DashboardLayout } from '@/presentation/components/layouts/DashboardLayout';
import { Card } from '@/presentation/components/ui/Card';
import { History as HistoryIcon } from 'lucide-react';
import styles from './page.module.scss';

export default function HistoryPage() {
  return (
    <DashboardLayout>
      <h1 className={styles.title}>Quiz History</h1>

      <Card variant="neonCyan" className={styles.placeholder}>
        <HistoryIcon size={64} className={styles.icon} />
        <h2 className={styles.placeholderTitle}>Coming Soon</h2>
        <p className={styles.placeholderText}>
          View your complete quiz history and track your progress over time.
        </p>
      </Card>
    </DashboardLayout>
  );
}
