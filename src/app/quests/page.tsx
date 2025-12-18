import { DashboardLayout } from '@/presentation/components/layouts/DashboardLayout';
import { Card } from '@/presentation/components/ui/Card';
import { Zap } from 'lucide-react';
import styles from './page.module.scss';

export default function QuestsPage() {
  return (
    <DashboardLayout>
      <h1 className={styles.title}>Quest Challenges</h1>

      <Card className={styles.placeholder}>
        <Zap size={64} className={styles.icon} />
        <h2 className={styles.placeholderTitle}>Coming Soon</h2>
        <p className={styles.placeholderText}>
          Daily quests and weekly challenges to boost your XP are coming soon!
        </p>
      </Card>
    </DashboardLayout>
  );
}
