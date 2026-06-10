import React, { useEffect } from 'react';
import { usePopularMovies }  from '../hooks/usePopularMovies';
import { useMoviesByGenre }  from '../hooks/useMoviesByGenre';
import { MovieCarousel }     from '@/shared/components/ui/MovieCarousel';
import { ErrorState }        from '@/shared/components/ui/ErrorState';
import { analytics }         from '@/infrastructure/analytics/ga';

const GENRES = [
  { id: 28, label: 'Ação'     },
  { id: 18, label: 'Drama'    },
  { id: 53, label: 'Suspense' },
  { id: 12, label: 'Aventura' },
  { id: 27, label: 'Terror'   },
] as const;

export const HomePage: React.FC = () => {
  useEffect(() => { analytics.pageView('/', 'Home'); }, []);

  return (
    <div className="animate-fade-in">
      <PopularCarousel />
      {GENRES.map((g) => (
        <GenreCarousel key={g.id} genreId={g.id} label={g.label} />
      ))}
    </div>
  );
};

const PopularCarousel: React.FC = () => {
  const { data, isLoading, isError, error, refetch } = usePopularMovies();
  const movies = data?.pages.flatMap((p) => p.items) ?? [];

  if (isError) {
    return <ErrorState title="Erro ao carregar filmes" message={error?.message} onRetry={() => refetch()} />;
  }

  return (
    <MovieCarousel
      title="Em Alta"
      movies={movies}
      isLoading={isLoading}
    />
  );
};

const GenreCarousel: React.FC<{ genreId: number; label: string }> = ({ genreId, label }) => {
  const { data, isLoading } = useMoviesByGenre(genreId);
  return (
    <MovieCarousel
      title={label}
      movies={data?.items ?? []}
      isLoading={isLoading}
    />
  );
};
