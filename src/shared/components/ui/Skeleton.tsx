import React from 'react';
import { clsx } from '@/shared/utils/format';

interface SkeletonProps {
  className?: string;
  rounded?: boolean;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, rounded = false, circle = false }) => {
  return (
    <div
      className={clsx(
        'animate-pulse bg-gradient-to-r from-surface-overlay via-surface-elevated to-surface-overlay',
        'bg-[length:200%_100%] animate-shimmer',
        circle ? 'rounded-full' : rounded ? 'rounded-xl' : 'rounded-md',
        className,
      )}
      aria-hidden="true"
      role="presentation"
    />
  );
};

export const MovieCardSkeleton: React.FC = () => (
  <div className="flex flex-col bg-surface-card rounded-2xl overflow-hidden">
    <Skeleton className="aspect-[2/3] w-full" />
    <div className="p-3 space-y-2">
      <Skeleton className="h-4 w-3/4" rounded />
      <Skeleton className="h-5 w-12" rounded />
    </div>
  </div>
);

export const MovieGridSkeleton: React.FC<{ count?: number }> = ({ count = 12 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <MovieCardSkeleton key={i} />
    ))}
  </div>
);
