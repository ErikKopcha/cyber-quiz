import { DashboardLayout } from '@/presentation/components/layouts/DashboardLayout';
import { Card } from '@/presentation/components/ui/Card';
import { BarChart2 } from 'lucide-react';
import styles from './page.module.scss';

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <h1 className={styles.title}>Analytics</h1>

      <Card variant="neonPink" className={styles.placeholder}>
        <BarChart2 size={64} className={styles.icon} />
        <h2 className={styles.placeholderTitle}>Coming Soon</h2>
        <p className={styles.placeholderText}>
          Advanced analytics and detailed performance insights are in development.
        </p>
      </Card>
    </DashboardLayout>
  );
}
