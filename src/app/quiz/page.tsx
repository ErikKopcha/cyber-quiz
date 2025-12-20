'use client';

import { ROUTES } from '@/constants/routes';
import { Question } from '@/domain/entities/Question';
import { QuizSession } from '@/domain/entities/QuizSession';
import { User } from '@/domain/entities/User';
import { questionRepository } from '@/infrastructure/repositories/QuestionRepository';
import { QuizSessionRepositoryFirestore } from '@/infrastructure/repositories/QuizSessionRepositoryFirestore';
import { UserRepository } from '@/infrastructure/repositories/UserRepository';
import { QuizQuestion } from '@/presentation/components/features/QuizQuestion';
import { DashboardLayout } from '@/presentation/components/layouts/DashboardLayout';
import { Button } from '@/presentation/components/ui/Button';
import { Card } from '@/presentation/components/ui/Card';
import { useAuthStore } from '@/presentation/stores/authStore';
import { Check, CheckCircle2, Home, RotateCcw, TerminalSquare, Trophy, X, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load questions
  useEffect(() => {
    const loadQuestions = async () => {
      const quizQuestions = await questionRepository.getRandomQuestions(10);
      setQuestions(quizQuestions);
      setIsLoading(false);
    };
    loadQuestions();
  }, []);

  const handleAnswer = (answer: number) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Use the local variable newAnswers immediately
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = async (finalAnswers: number[]) => {
    setIsSaving(true);
    try {
      const { user } = useAuthStore.getState();

      if (!user) {
        console.error('[Quiz] No user found, cannot save quiz results');
        setIsCompleted(true);
        setIsSaving(false);
        return;
      }

      const sessionRepo = new QuizSessionRepositoryFirestore();
      const userRepo = new UserRepository();

         // Calculate score
         const maxScore = questions.reduce((sum, q) => sum + q.weight, 0);
         let totalScore = 0;
         const answersList = finalAnswers.map((ansIdx, qIdx) => {
             const q = questions[qIdx];
             const isCorrect = q.isCorrectAnswer(ansIdx);
             if (isCorrect) totalScore += q.weight;
             return {
                 questionId: q.id,
                 userAnswer: ansIdx,
                 isCorrect,
                 timeSpent: 0, // placeholder
                 answeredAt: new Date(),
             };
         });

         // Determine quiz category from the first question (all questions in a quiz should have same category)
         const quizCategory = questions[0]?.category || 'react';

         const session = QuizSession.create({
             id: `${user.id}_${Date.now()}`,
             userId: user.id,
             category: quizCategory,
             questionIds: questions.map(q => q.id),
             answers: answersList,
             startedAt: new Date(), // approx
             completedAt: new Date(),
             totalScore,
             maxScore
         });

      await sessionRepo.create(session);

      // Update XP
      const xpReward = totalScore * 10;
      const newXp = user.xp + xpReward;
      const newLevel = Math.floor(newXp / 1000) + 1;


      const updatedUser = User.create({ ...user.toJSON(), xp: newXp, level: newLevel });

      await userRepo.saveUser(updatedUser);

      // Optimistically update local store to reflect changes immediately without network wait
      useAuthStore.getState().setUser(updatedUser);

      setIsCompleted(true);
    } catch (error) {
      console.error('[Quiz] ERROR saving quiz:', error);
      if (error instanceof Error) {
        console.error('[Quiz] Error details:', error.message, error.stack);
      }
      // Show completion anyway to not block user
      setIsCompleted(true);
    } finally {
      console.log('[Quiz] Setting isSaving=false');
      setIsSaving(false);
    }
  };

  const handleRestart = async () => {
    setIsLoading(true);
    const quizQuestions = await questionRepository.getRandomQuestions(10);
    setQuestions(quizQuestions);
    setCurrentIndex(0);
    setAnswers([]);
    setIsCompleted(false);
    setIsLoading(false);
  };

  // Calculate results for display
  const correctCount = questions.reduce((count, question, index) => {
    if (answers[index] !== undefined && question.isCorrectAnswer(answers[index])) {
      return count + 1;
    }
    return count;
  }, 0);

  const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  if (isLoading || isSaving) {
    return (
      <DashboardLayout>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
          gap: '1rem'
        }}>
          <div className={styles.resultsIcon} style={{ width: 40, height: 40, margin: 0 }}>
             <RotateCcw className={styles.icon} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
          <p style={{ color: '#94a3b8' }}>{isSaving ? 'Saving results...' : 'Loading quiz...'}</p>
          <style jsx>{`
            @keyframes spin { 100% { transform: rotate(360deg); } }
          `}</style>
        </div>
      </DashboardLayout>
    );
  }

  if (isCompleted) {
    return (
      <DashboardLayout>
        <div className={styles.results}>
          <Card variant="neonCyan" className={styles.resultsCard}>
            <div className={styles.resultsIcon}>
              <Trophy size={48} />
            </div>
            <h1 className={styles.resultsTitle}>Quiz Complete!</h1>
            <div className={styles.resultsScore}>{accuracy}%</div>
            <p className={styles.resultsMessage}>
              {accuracy >= 80
                ? 'Outstanding performance! 🔥'
                : accuracy >= 60
                  ? 'Good job! Keep practicing.'
                  : "Keep learning! You'll get better."}
            </p>

            <div className={styles.resultsStats}>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Correct</div>
                <div className={`${styles.statValue} ${styles.success}`}>{correctCount}</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Wrong</div>
                <div className={`${styles.statValue} ${styles.error}`}>
                  {questions.length - correctCount}
                </div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Total</div>
                <div className={`${styles.statValue} ${styles.info}`}>{questions.length}</div>
              </div>
            </div>

            <div className={styles.resultsActions}>
              <Button variant="secondary" onClick={handleRestart}>
                <RotateCcw size={18} />
                Try Again
              </Button>
              <Button onClick={() => router.push(ROUTES.DASHBOARD)}>
                <Home size={18} />
                Dashboard
              </Button>
            </div>
          </Card>

          {/* Detailed Review Section */}
          <div className={styles.reviewSection}>
            <h2 className={styles.reviewTitle}>Detailed Review</h2>
            <div className={styles.reviewList}>
                {questions.map((q, index) => {
                    const userAnswer = answers[index];
                    const isCorrect = q.isCorrectAnswer(userAnswer);

                    return (
                        <Card key={q.id} className={styles.reviewCard} variant={isCorrect ? 'default' : 'alert'}>
                            <div className={styles.reviewHeader}>
                                <span className={styles.questionNumber}>#{index + 1}</span>
                                <span className={styles.questionText}>{q.question}</span>
                                {isCorrect ? (
                                    <CheckCircle2 size={24} className={styles.iconSuccess} />
                                ) : (
                                    <XCircle size={24} className={styles.iconError} />
                                )}
                            </div>

                            {q.code && (
                                <pre className={styles.codeBlock}>
                                    <code>{q.code}</code>
                                </pre>
                            )}

                            <div className={styles.optionsList}>
                                {q.options.map((opt, optIdx) => {
                                    const isSelected = userAnswer === optIdx;
                                    const isCorrectOpt = q.isCorrectAnswer(optIdx);

                                    let optionStyle = styles.option;
                                    if (isSelected && isCorrectOpt) optionStyle = `${styles.option} ${styles.optionCorrect}`;
                                    else if (isSelected && !isCorrectOpt) optionStyle = `${styles.option} ${styles.optionWrong}`;
                                    else if (isCorrectOpt) optionStyle = `${styles.option} ${styles.optionIdeal}`;

                                    return (
                                        <div key={optIdx} className={optionStyle}>
                                            {opt}
                                            {isCorrectOpt && <Check size={16} style={{ marginLeft: 'auto' }} />}
                                            {isSelected && !isCorrectOpt && <X size={16} style={{ marginLeft: 'auto' }} />}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className={styles.explanation}>
                                <div className={styles.explanationLabel}>
                                    <TerminalSquare size={16} />
                                    Explanation & Best Practices
                                </div>
                                <p>{q.explanation}</p>
                            </div>
                        </Card>
                    );
                })}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <DashboardLayout>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <TerminalSquare size={24} className={styles.icon} />
          Active Session: Quiz
        </h1>
        <span className={styles.counter}>
          Q {currentIndex + 1}/{questions.length}
        </span>
      </div>

      <div className={styles.questionContainer}>
        <QuizQuestion
          question={currentQuestion}
          currentQuestion={currentIndex + 1}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
          disabled={isSaving}
        />
      </div>
    </DashboardLayout>
  );
}
