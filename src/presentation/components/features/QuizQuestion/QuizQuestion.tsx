'use client';

import { Question } from '@/domain/entities/Question';
import { Badge } from '@/presentation/components/ui/Badge';
import { Button } from '@/presentation/components/ui/Button';
import { ArrowRight, Flag } from 'lucide-react';
import { useState } from 'react';
import styles from './QuizQuestion.module.scss';

interface QuizQuestionProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  onAnswer: (answer: number) => void;
}

export const QuizQuestion = ({
  question,
  currentQuestion,
  totalQuestions,
  onAnswer,
}: QuizQuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      onAnswer(selectedAnswer);
      setSelectedAnswer(null);
    }
  };

  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className={styles.container}>
      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <div className={styles.progress} style={{ width: `${progress}%` }} />
      </div>

      <div className={styles.content}>
        {/* Badges */}
        <div className={styles.header}>
          <Badge variant={question.difficulty}>{question.difficulty}</Badge>
          <Badge
            variant={question.category === 'system-design' ? 'systemDesign' : question.category}
          >
            {question.category}
          </Badge>
        </div>

        {/* Question */}
        <h2 className={styles.question}>{question.question}</h2>

        {/* Code Block (if exists) */}
        {question.code && (
          <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
              <div className={`${styles.dot} ${styles.red}`} />
              <div className={`${styles.dot} ${styles.yellow}`} />
              <div className={`${styles.dot} ${styles.green}`} />
              <span className={styles.fileName}>Component.tsx</span>
            </div>
            <div className={styles.codeContent}>
              <pre>
                <code>{question.code}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Options */}
        <div className={styles.options}>
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`${styles.option} ${selectedAnswer === index ? styles.selected : ''}`}
            >
              <input
                type="radio"
                name="answer"
                value={index}
                checked={selectedAnswer === index}
                onChange={() => setSelectedAnswer(index)}
                style={{ display: 'none' }}
              />
              <div className={styles.radio}>
                <div className={styles.radioInner} />
              </div>
              <span className={styles.optionText}>{option}</span>
            </label>
          ))}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.reportButton}>
            <Flag size={16} />
            Report Issue
          </button>
          <Button size="lg" onClick={handleSubmit} disabled={selectedAnswer === null}>
            Confirm Answer
            <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};
