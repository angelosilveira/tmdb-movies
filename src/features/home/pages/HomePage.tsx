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

  // Analytics
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
      { rootMargin: '200px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allMovies = data?.pages.flatMap((p) => p.results) ?? [];
  const totalResults = data?.pages[0]?.total_results ?? 0;

  if (isLoading) return <MovieGridSkeleton count={18} />;

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
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-display-sm font-extrabold text-text-primary">
          Filmes Populares
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          {totalResults.toLocaleString('pt-BR')} filmes encontrados
        </p>
      </div>

      {/* Grid */}
      <div
        className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
        role="list"
        aria-label="Lista de filmes populares"
      >
        {allMovies.map((movie) => (
          <div key={movie.id} role="listitem">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      {/* Loading more */}
      {isFetchingNextPage && (
        <div className="mt-8">
          <MovieGridSkeleton count={6} />
        </div>
      )}

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-4 mt-4" aria-hidden="true" />

      {/* End of list */}
      {!hasNextPage && allMovies.length > 0 && (
        <p className="text-center text-text-muted text-sm mt-8 py-4">
          Você chegou ao fim da lista! 🎬
        </p>
      )}
    </div>
  );
};
