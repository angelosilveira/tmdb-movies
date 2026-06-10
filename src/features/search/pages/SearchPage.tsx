import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchMovies } from '../hooks/useSearchMovies';
import { MovieCard } from '@/shared/components/ui/MovieCard';
import { MovieGridSkeleton } from '@/shared/components/ui/Skeleton';
import { ErrorState } from '@/shared/components/ui/ErrorState';
import { analytics } from '@/infrastructure/analytics/ga';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useSearchMovies(query);

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Analytics
  useEffect(() => {
    if (query) {
      analytics.pageView(`/search?q=${query}`, `Busca: ${query}`);
    }
  }, [query]);

  // Infinite scroll
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

  const allMovies = data?.pages.flatMap((p) => p.items) ?? [];
  const totalResults = data?.pages[0]?.totalResults ?? 0;

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="text-7xl mb-6" role="img" aria-label="Lupa">🔍</div>
        <h2 className="text-display-xs font-bold text-text-primary mb-3">
          O que você está procurando?
        </h2>
        <p className="text-text-secondary max-w-sm">
          Use a barra de busca no topo para encontrar filmes.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="mb-6">
          <div className="h-8 w-64 bg-surface-elevated rounded-xl animate-pulse mb-2" />
          <div className="h-4 w-32 bg-surface-elevated rounded animate-pulse" />
        </div>
        <MovieGridSkeleton count={12} />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Erro na busca"
        message={error?.message ?? 'Não foi possível realizar a busca.'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-display-sm font-extrabold text-text-primary">
          Resultados para:{' '}
          <span className="text-brand-secondary">"{query}"</span>
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          {totalResults > 0
            ? `Encontrados ${totalResults.toLocaleString('pt-BR')} filmes`
            : 'Nenhum filme encontrado'}
        </p>
      </div>

      {/* No results */}
      {allMovies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-6" role="img" aria-label="Sem resultados">🎭</div>
          <h2 className="text-display-xs font-bold text-text-primary mb-2">
            Nenhum resultado encontrado
          </h2>
          <p className="text-text-secondary">
            Tente buscar por outro termo ou verifique a ortografia.
          </p>
        </div>
      )}

      {/* Grid */}
      {allMovies.length > 0 && (
        <div
          className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
          role="list"
          aria-label={`Resultados da busca por ${query}`}
        >
          {allMovies.map((movie) => (
            <div key={movie.id} role="listitem">
              <MovieCard movie={movie} highlight={query} />
            </div>
          ))}
        </div>
      )}

      {isFetchingNextPage && (
        <div className="mt-8">
          <MovieGridSkeleton count={6} />
        </div>
      )}

      <div ref={sentinelRef} className="h-4 mt-4" aria-hidden="true" />

      {!hasNextPage && allMovies.length > 0 && (
        <p className="text-center text-text-muted text-sm mt-8 py-4">
          Todos os resultados foram carregados 🎬
        </p>
      )}
    </div>
  );
};
