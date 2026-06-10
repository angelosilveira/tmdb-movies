import React from 'react';
import { clsx } from '@/shared/utils/format';

interface SkeletonProps {
  className?: string;
  rounded?: boolean;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, rounded = false, circle = false }) => (
  <div
    className={clsx(
      'relative overflow-hidden bg-surface-overlay',
      circle ? 'rounded-full' : rounded ? 'rounded-xl' : 'rounded-md',
      className,
    )}
    aria-hidden="true"
    role="presentation"
  >
    {/* Shimmer sweep */}
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
  </div>
);

export const MovieCardSkeleton: React.FC = () => (
  <div className="flex flex-col gap-2">
    {/* Poster skeleton */}
    <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-surface-overlay">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      {/* Fake rating badge */}
      <div className="absolute top-2 left-2 h-5 w-10 rounded-md bg-white/5" />
      {/* Fake heart */}
      <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white/5" />
    </div>
    {/* Title skeleton */}
    <Skeleton className="h-3 w-4/5 mx-0.5" rounded />
  </div>
);

export const MovieGridSkeleton: React.FC<{ count?: number }> = ({ count = 12 }) => (
  <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <MovieCardSkeleton key={i} />
    ))}
  </div>
);
