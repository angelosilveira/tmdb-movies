import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovieDetails } from '../hooks/useMovieDetails';
import { useFavorites } from '@/app/contexts/FavoritesContext';
import { formatDate } from '@/shared/utils/format';
import { Button } from '@/shared/components/ui/Button';
import { RatingBadge } from '@/shared/components/ui/RatingBadge';
import { ErrorState } from '@/shared/components/ui/ErrorState';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { analytics } from '@/infrastructure/analytics/ga';

const PLACEHOLDER_BACKDROP = '/placeholder-backdrop.svg';

export const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieId = Number(id);

  const { data: movie, isLoading, isError, error, refetch } = useMovieDetails(movieId);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = movie ? isFavorite(movie.id) : false;

  useEffect(() => {
    if (movie) {
      analytics.pageView(`/movie/${movieId}`, movie.title);
    }
  }, [movie, movieId]);

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-full md:w-[400px] aspect-video md:aspect-[2/3] rounded-2xl flex-shrink-0" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-3/4 rounded-xl" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-7 w-20 rounded-full" />)}
            </div>
            <Skeleton className="h-5 w-48 rounded-lg" />
            <Skeleton className="h-5 w-32 rounded-lg" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-11 w-48 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <ErrorState
        title="Filme não encontrado"
        message={error?.message ?? 'Não conseguimos carregar os detalhes deste filme.'}
        onRetry={() => refetch()}
      />
    );
  }

  // All fields are domain types — no snake_case, no raw API data
  const imageUrl = movie.backdropUrl ?? movie.posterUrl ?? PLACEHOLDER_BACKDROP;

  return (
    <div className="animate-slide-up">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6 group focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-lg p-1"
        aria-label="Voltar à página anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">Voltar</span>
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Image — uses backdropUrl resolved by adapter */}
        <div className="w-full md:w-[400px] flex-shrink-0">
          <div className="rounded-2xl overflow-hidden shadow-card bg-surface-overlay aspect-video md:aspect-[2/3]">
            <img
              src={imageUrl}
              alt={`Imagem de ${movie.title}`}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_BACKDROP; }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5">
          <h1 className="text-display-md font-extrabold text-text-primary leading-tight">
            {movie.title}
          </h1>

          {/* Genres */}
          {movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2" aria-label="Gêneros">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 rounded-full bg-surface-overlay text-text-secondary text-xs font-semibold border border-surface-overlay hover:border-brand-primary transition-colors"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {/* Meta */}
          <div className="space-y-2">
            <p className="text-text-secondary text-sm">
              <span className="font-semibold text-text-primary">Data de lançamento:</span>{' '}
              {/* releaseDate already formatted by domain helper */}
              {formatDate(movie.releaseDate)}
            </p>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-text-primary text-sm">Nota TMDB:</span>
              {/* RatingBadge uses pre-computed values from adapter */}
              <RatingBadge
                rating={movie.rating}
                ratingFormatted={movie.ratingFormatted}
                ratingLevel={movie.ratingLevel}
                size="md"
              />
              <span className="text-text-muted text-xs">
                ({movie.voteCount.toLocaleString('pt-BR')} votos)
              </span>
            </div>
          </div>

          {/* Tagline */}
          {movie.tagline && (
            <p className="text-text-secondary italic text-sm border-l-2 border-brand-primary pl-3">
              "{movie.tagline}"
            </p>
          )}

          {/* Synopsis */}
          <div>
            <h2 className="text-text-primary font-bold mb-2">Sinopse</h2>
            <p className="text-text-secondary leading-relaxed text-sm">
              {movie.overview || 'Sinopse não disponível para este filme.'}
            </p>
          </div>

          {/* Runtime — pre-formatted by adapter */}
          {movie.runtimeFormatted && (
            <p className="text-text-secondary text-sm">
              <span className="font-semibold text-text-primary">Duração:</span>{' '}
              {movie.runtimeFormatted}
            </p>
          )}

          {/* Favorite button */}
          <Button
            variant={favorited ? 'danger' : 'primary'}
            size="lg"
            onClick={() => toggleFavorite(movie)}
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={favorited ? 0 : 2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            }
            aria-pressed={favorited}
          >
            {favorited ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
          </Button>
        </div>
      </div>
    </div>
  );
};
