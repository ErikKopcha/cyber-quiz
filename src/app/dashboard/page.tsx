'use client';

import { ROUTES } from '@/constants/routes';
import { getCategoryGroup, getDefaultSkillData, SkillCategoryName } from '@/constants/skillCategories';
import { QuizSession } from '@/domain/entities/QuizSession';
import { QuizSessionRepositoryFirestore } from '@/infrastructure/repositories/QuizSessionRepositoryFirestore';
import { ActivityChart } from '@/presentation/components/features/ActivityChart';
import { SkillMatrix } from '@/presentation/components/features/SkillMatrix';
import { DashboardLayout } from '@/presentation/components/layouts/DashboardLayout';
import { Button } from '@/presentation/components/ui/Button';
import { Card } from '@/presentation/components/ui/Card';
import { ProgressBar } from '@/presentation/components/ui/ProgressBar';
import { useAuthStore } from '@/presentation/stores/authStore';
import {
    Activity,
    Award,
    MoreHorizontal,
    Play,
    Target,
    TrendingUp,
    Trophy
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import styles from './page.module.scss';

// Helper to format date as "Mon", "Tue" etc.
const getDayName = (date: Date) => {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sessions, setSessions] = useState<QuizSession[]>([]);
  const [_loading, setLoading] = useState(true);
  const [refreshKey, _setRefreshKey] = useState(0);

  // Fetch quiz history
  useEffect(() => {
    let mounted = true;

    async function fetchHistory() {
      if (!user) return;
      try {
        const repo = new QuizSessionRepositoryFirestore();
        // Fetch last 50 sessions to calculate stats
        const history = await repo.getByUserId(user.id, 50);

        if (mounted) {
          console.log('Fetched sessions:', history.length);
          setSessions(history);
        }
      } catch (error) {
        console.error('Failed to fetch quiz history:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchHistory();

    return () => { mounted = false; };
  }, [user?.id, user?.xp, pathname, refreshKey]); // Re-run when user XP changes or page is navigated to

  // Derived Statistics
  const stats = useMemo(() => {
    let totalQuestions = 0;
    let totalCorrect = 0;
    const skillCategoryStats: Record<SkillCategoryName, { total: number; correct: number }> = {
      'Frontend Foundations': { total: 0, correct: 0 },
      'Programming Languages': { total: 0, correct: 0 },
      'System & Architecture': { total: 0, correct: 0 },
      'Quality & Performance': { total: 0, correct: 0 },
      'Developer Tools': { total: 0, correct: 0 },
    };
    const dailyActivity: Record<string, number> = {};

    // Initialize last 7 days for activity chart
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dailyActivity[getDayName(d)] = 0;
    }

    sessions.forEach((session) => {
      // Accuracy
      totalQuestions += session.questionIds.length;
      const correctInSession = session.answers.filter((a) => a.isCorrect).length;
      totalCorrect += correctInSession;

      // Category Stats - Map to skill category group
      const skillGroup = getCategoryGroup(session.category);
      skillCategoryStats[skillGroup].total += session.questionIds.length;
      skillCategoryStats[skillGroup].correct += correctInSession;

      // Activity (Score per day)
      // Check if session is within last 7 days
      const sessionDate = new Date(session.startedAt);
      const diffTime = Math.abs(today.getTime() - sessionDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 7) {
        const dayName = getDayName(sessionDate);
        if (dailyActivity[dayName] !== undefined) {
          dailyActivity[dayName] += session.totalScore;
        }
      }
    });

    // Weekly Challenge: Count 'React' quizzes in current week (simplified to last 7 days)
    const weeklyProgress = sessions.filter(
      (s) =>
        s.category === 'react' &&
        new Date().getTime() - new Date(s.startedAt).getTime() < 7 * 24 * 60 * 60 * 1000
    ).length;

    // Format for SkillMatrix - Always show all 5 categories
    const skillData = Object.entries(skillCategoryStats).map(([category, stat]) => ({
      category: category as SkillCategoryName,
      score: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0,
      fullMark: 100,
    }));

    // Format for ActivityChart
    const activityData = Object.entries(dailyActivity).map(([day, score]) => ({
      day,
      score,
    }));

    return {
      accuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
      correctCount: totalCorrect,
      wrongCount: totalQuestions - totalCorrect,
      skillData,
      activityData,
      weeklyProgress,
    };
  }, [sessions]);

  // Weekly Challenge Logic
  const weeklyTarget = 3;
  const weeklyProgress = stats?.weeklyProgress || 0;
  const isChallengeComplete = weeklyProgress >= weeklyTarget;

  // Always show all 5 skill categories (with 0% if no data)
  const displaySkillData = stats?.skillData || getDefaultSkillData();

  const displayActivityData = stats?.activityData.length
    ? stats.activityData
    : [
        { day: 'Mon', score: 0 },
        { day: 'Tue', score: 0 },
        { day: 'Wed', score: 0 },
        { day: 'Thu', score: 0 },
        { day: 'Fri', score: 0 },
        { day: 'Sat', score: 0 },
        { day: 'Sun', score: 0 },
      ];

  const accuracy = stats?.accuracy || 0;

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
            <span className={styles.userId}>
              USER: {user?.displayName || 'Unknown'} <span style={{ opacity: 0.5 }}>#{user?.id.slice(0, 6)}</span>
            </span>
          </div>
        </div>
        <Button size="lg" onClick={() => router.push(ROUTES.QUIZ)}>
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
              <p className={styles.cardSubtitle}>
                Based on last {sessions.length} quizzes
              </p>
            </div>
            <button className={styles.iconButton}>
              <MoreHorizontal size={20} />
            </button>
          </div>
          <SkillMatrix data={displaySkillData} />
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
              <h3 className={styles.rankTitle}>{user?.getRank() || 'Novice'}</h3>
              <p className={styles.rankPercentile}>Level {user?.level || 1}</p>
            </div>
            <div style={{ width: '100%' }}>
               <ProgressBar
                  label="XP Progress"
                  value={user?.xp || 0}
                  max={(user?.level || 1) * 1000}
                  variant="cyan"
                  showValue
               />
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
            <span className={styles.number}>{accuracy}</span>
            <span className={styles.percent}>%</span>
          </div>
          <div className={styles.accuracyStats}>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Correct</div>
              <div className={`${styles.statValue} ${styles.success}`}>{stats?.correctCount || 0}</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>Wrong</div>
              <div className={`${styles.statValue} ${styles.error}`}>{stats?.wrongCount || 0}</div>
            </div>
          </div>
        </Card>

        {/* Activity Chart */}
        <Card className={styles.activityCard}>
          <div className={styles.cardHeader}>
            <div className={styles.rankLabel}>
              <Activity size={16} className={styles.icon} />
              <span className={styles.text}>Recent Activity (XP)</span>
            </div>
          </div>
          <ActivityChart data={displayActivityData} />
        </Card>

        {/* Weekly Challenge Card */}
        <Card variant="neonPurple" className={styles.challengeCard}>
          <div className={styles.challengeHeader}>
            <div className={styles.challengeTitleWrapper}>
              <Trophy size={24} className={styles.challengeIcon} />
              <h3 className={styles.challengeTitle}>Weekly Challenge</h3>
            </div>
            {!isChallengeComplete && (
               <Button variant="secondary" size="sm" onClick={() => router.push(ROUTES.QUIZ)}>
                 Start
               </Button>
            )}
          </div>

          <p className={styles.challengeDescription}>
            Complete {weeklyTarget} React quizzes to earn 500 XP.
          </p>

          <div className={styles.challengeProgressContainer}>
            <ProgressBar
              label=""
              value={weeklyProgress}
              max={weeklyTarget}
              variant="purple"
              showValue={false}
              height={12}
            />
            <div className={styles.challengeStatsRow}>
                <span className={styles.challengeCount}>{weeklyProgress}/{weeklyTarget} Done</span>
                <span className={styles.challengeXp}>+500 XP</span>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
