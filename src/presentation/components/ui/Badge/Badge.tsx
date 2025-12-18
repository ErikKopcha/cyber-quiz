import clsx from 'clsx';
import { HTMLAttributes, ReactNode } from 'react';
import styles from './Badge.module.scss';

export type BadgeVariant =
  | 'react'
  | 'typescript'
  | 'css'
  | 'javascript'
  | 'algorithms'
  | 'systemDesign'
  | 'junior'
  | 'middle'
  | 'senior'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant: BadgeVariant;
  withDot?: boolean;
  children: ReactNode;
}

export const Badge = ({ variant, withDot = false, className, children, ...props }: BadgeProps) => {
  return (
    <span
      className={clsx(
        styles.badge,
        styles[variant],
        {
          [styles.withDot]: withDot,
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
