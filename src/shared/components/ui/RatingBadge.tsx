import React from 'react';
import { RatingLevel } from '@/shared/types/movie.types';
import { clsx } from '@/shared/utils/format';

interface RatingBadgeProps {
  rating: number;
  ratingFormatted?: string;   // pré-formatado pelo adapter (ex: "8.5")
  ratingLevel?: RatingLevel;  // pré-calculado pelo adapter
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'text-xs px-1.5 py-0.5 font-bold',
  md: 'text-sm px-2 py-1 font-bold',
  lg: 'text-base px-3 py-1.5 font-extrabold',
};

const levelBgClasses: Record<RatingLevel, string> = {
  excellent: 'bg-rating-excellent',
  good: 'bg-rating-good',
  average: 'bg-rating-average',
};

// Fallback para quando o componente é usado sem dados do adapter
function resolveLevel(rating: number): RatingLevel {
  if (rating >= 7.5) return 'excellent';
  if (rating >= 6.0) return 'good';
  return 'average';
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({
  rating,
  ratingFormatted,
  ratingLevel,
  size = 'sm',
  className,
}) => {
  const display = ratingFormatted ?? rating.toFixed(1);
  const level = ratingLevel ?? resolveLevel(rating);
  const bgColor = levelBgClasses[level];

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full text-surface-base',
        bgColor,
        sizeClasses[size],
        className,
      )}
      aria-label={`Nota: ${display}`}
    >
      {display}
    </span>
  );
};
