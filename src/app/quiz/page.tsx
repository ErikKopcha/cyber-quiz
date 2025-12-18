'use client';

import { Question } from '@/domain/entities/Question';
import { questionRepository } from '@/infrastructure/repositories/QuestionRepository';
import { QuizQuestion } from '@/presentation/components/features/QuizQuestion';
import { DashboardLayout } from '@/presentation/components/layouts/DashboardLayout';
import { Button } from '@/presentation/components/ui/Button';
import { Card } from '@/presentation/components/ui/Card';
import { Home, RotateCcw, TerminalSquare, Trophy } from 'lucide-react';
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
    setAnswers([...answers, answer]);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsCompleted(true);
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

  // Calculate results
  const correctCount = questions.reduce((count, question, index) => {
    if (answers[index] !== undefined && question.isCorrectAnswer(answers[index])) {
      return count + 1;
    }
    return count;
  }, 0);

  const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p style={{ color: '#94a3b8' }}>Loading quiz...</p>
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
              <Button onClick={() => router.push('/dashboard')}>
                <Home size={18} />
                Dashboard
              </Button>
            </div>
          </Card>
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
        />
      </div>
    </DashboardLayout>
  );
}
