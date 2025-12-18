import clsx from 'clsx';
import { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.scss';

export type CardVariant = 'default' | 'neonCyan' | 'neonPink' | 'alert';
export type CardSize = 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  size?: CardSize;
  interactive?: boolean;
  children: ReactNode;
}

export const Card = ({
  variant = 'default',
  size = 'md',
  interactive = false,
  className,
  children,
  ...props
}: CardProps) => {
  return (
    <div
      className={clsx(
        styles.card,
        styles[variant],
        styles[size],
        {
          [styles.interactive]: interactive,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
