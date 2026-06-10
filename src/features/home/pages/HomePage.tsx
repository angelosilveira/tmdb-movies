import React, { useEffect, useRef } from 'react';
import { usePopularMovies } from '../hooks/usePopularMovies';
import { MovieCard } from '@/shared/components/ui/MovieCard';
import { MovieGridSkeleton } from '@/shared/components/ui/Skeleton';
import { ErrorState } from '@/shared/components/ui/ErrorState';
import { analytics } from '@/infrastructure/analytics/ga';

export const HomePage: React.FC = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = usePopularMovies();

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    analytics.pageView('/', 'Home - Filmes Populares');
  }, []);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '300px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allMovies = data?.pages.flatMap((p) => p.items) ?? [];
  const totalResults = data?.pages[0]?.totalResults ?? 0;

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Em Alta" count={null} />
        <MovieGridSkeleton count={18} />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar filmes"
        message={error?.message ?? 'Não foi possível carregar os filmes populares.'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Em Alta" count={totalResults} />

      {/* Movie Grid */}
      <div
        className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
        role="list"
        aria-label="Lista de filmes populares"
      >
        {allMovies.map((movie, index) => (
          <div
            key={movie.id}
            role="listitem"
            className="animate-fade-in"
            style={{ animationDelay: `${Math.min(index % 20, 12) * 30}ms` }}
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      {/* Load more skeleton */}
      {isFetchingNextPage && (
        <div className="mt-4">
          <MovieGridSkeleton count={6} />
        </div>
      )}

      {/* Sentinel */}
      <div ref={sentinelRef} className="h-8 mt-2" aria-hidden="true" />

      {/* End of content */}
      {!hasNextPage && allMovies.length > 0 && (
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-surface-overlay" />
          <p className="text-text-muted text-sm font-medium">Você viu tudo 🎬</p>
          <div className="flex-1 h-px bg-surface-overlay" />
        </div>
      )}
    </div>
  );
};

// ─── Page header ──────────────────────────────────────────────────────────────
const PageHeader: React.FC<{ title: string; count: number | null }> = ({ title, count }) => (
  <div className="flex items-baseline gap-3 mb-5">
    <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
      {title}
    </h1>
    {count !== null && count > 0 && (
      <span className="text-text-muted text-sm font-medium tabular-nums">
        {count.toLocaleString('pt-BR')} filmes
      </span>
    )}
    {/* Decorative line */}
    <div className="flex-1 h-px bg-gradient-to-r from-brand-primary/40 to-transparent hidden sm:block ml-2" />
  </div>
);
