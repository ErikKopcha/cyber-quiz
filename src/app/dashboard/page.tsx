'use client';

import { ActivityChart } from '@/presentation/components/features/ActivityChart';
import { SkillMatrix } from '@/presentation/components/features/SkillMatrix';
import { DashboardLayout } from '@/presentation/components/layouts/DashboardLayout';
import { Button } from '@/presentation/components/ui/Button';
import { Card } from '@/presentation/components/ui/Card';
import { ProgressBar } from '@/presentation/components/ui/ProgressBar';
import {
  Activity,
  AlertTriangle,
  Award,
  MoreHorizontal,
  Play,
  Target,
  TrendingUp,
} from 'lucide-react';
import styles from './page.module.scss';

// Mock data
const skillData = [
  { category: 'React', score: 92, fullMark: 100 },
  { category: 'TS', score: 78, fullMark: 100 },
  { category: 'Node', score: 65, fullMark: 100 },
  { category: 'System', score: 58, fullMark: 100 },
  { category: 'Algo', score: 48, fullMark: 100 },
  { category: 'CSS', score: 85, fullMark: 100 },
];

const activityData = [
  { day: 'Mon', score: 40 },
  { day: 'Tue', score: 65 },
  { day: 'Wed', score: 35 },
  { day: 'Thu', score: 80 },
  { day: 'Fri', score: 90 },
  { day: 'Sat', score: 60 },
  { day: 'Sun', score: 75 },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>Dashboard</h1>
          <div className={styles.status}>
            <span className={styles.statusDot} />
            <span>System Online</span>
            <span className={styles.statusSeparator}>/</span>
            <span className={styles.userId}>USER_ID: 8X-291</span>
          </div>
        </div>
        <Button size="lg">
          <Play size={18} />
          Start Quick Quiz
        </Button>
      </div>

      {/* Bento Grid */}
      <div className={styles.grid}>
        {/* Skill Matrix (Large) */}
        <Card variant="neonCyan" className={styles.radarCard}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>Skill Matrix</h3>
              <p className={styles.cardSubtitle}>Based on last 20 quizzes</p>
            </div>
            <button className={styles.iconButton}>
              <MoreHorizontal size={20} />
            </button>
          </div>
          <SkillMatrix data={skillData} />
        </Card>

        {/* Rank Card */}
        <Card className={styles.rankCard}>
          <div className={styles.rankContent}>
            <Award size={80} className={styles.rankIcon} />
            <div>
              <div className={styles.rankLabel}>
                <Target size={16} className={styles.icon} />
                <span className={styles.text}>Current Rank</span>
              </div>
              <h3 className={styles.rankTitle}>Cyber-Junior</h3>
              <p className={styles.rankPercentile}>Top 15% of users</p>
            </div>
            <div>
              <ProgressBar label="XP Progress" value={4250} max={5000} variant="cyan" showValue />
            </div>
          </div>
        </Card>

        {/* Accuracy Card */}
        <Card className={styles.accuracyCard}>
          <div className={styles.cardHeader}>
            <div className={styles.rankLabel}>
              <Target size={16} className={styles.icon} />
              <span className={styles.text}>Accuracy</span>
            </div>
            <div className={styles.accuracyIcon}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className={styles.accuracyValue}>
            <span className={styles.number}>78</span>
            <span className={styles.percent}>%</span>
          </div>
          <div className={styles.accuracyStats}>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Correct</div>
              <div className={`${styles.statValue} ${styles.success}`}>142</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Wrong</div>
              <div className={`${styles.statValue} ${styles.error}`}>38</div>
            </div>
          </div>
        </Card>

        {/* Activity Chart */}
        <Card className={styles.activityCard}>
          <div className={styles.cardHeader}>
            <div className={styles.rankLabel}>
              <Activity size={16} className={styles.icon} />
              <span className={styles.text}>Recent Activity Log</span>
            </div>
          </div>
          <ActivityChart data={activityData} />
        </Card>

        {/* Alert Card */}
        <Card variant="alert" className={styles.alertCard}>
          <div className={styles.alertContent}>
            <div className={styles.alertInfo}>
              <div className={styles.alertTitle}>
                <AlertTriangle size={20} className={styles.icon} />
                <span className={styles.text}>Analysis Required</span>
              </div>
              <p className={styles.alertDescription}>
                Your score in <span className={styles.highlight}>System Design</span> dropped by
                12%.
              </p>
            </div>
            <Button variant="secondary" size="sm">
              Improve
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
