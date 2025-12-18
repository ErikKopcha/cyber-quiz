import clsx from 'clsx';
import { HTMLAttributes } from 'react';
import styles from './ProgressBar.module.scss';

export type ProgressBarVariant = 'cyan' | 'pink' | 'success' | 'warning';
export type ProgressBarSize = 'sm' | 'md' | 'lg';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  max?: number;
  variant?: ProgressBarVariant;
  size?: ProgressBarSize;
  label?: string;
  showValue?: boolean;
}

export const ProgressBar = ({
  value,
  max = 100,
  variant = 'cyan',
  size = 'md',
  label,
  showValue = false,
  className,
  ...props
}: ProgressBarProps) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={clsx(styles.container, styles[size], className)} {...props}>
      {(label || showValue) && (
        <div className={styles.label}>
          {label && <span className={styles.labelText}>{label}</span>}
          {showValue && (
            <span className={styles.labelValue}>
              {value} / {max}
            </span>
          )}
        </div>
      )}
      <div className={styles.track}>
        <div
          className={clsx(styles.bar, styles[variant])}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};
