import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '@/shared/types/movie.types';
import { RatingBadge } from './RatingBadge';
import { useFavorites } from '@/app/contexts/FavoritesContext';
import { clsx, highlightText } from '@/shared/utils/format';

interface MovieCardProps {
  movie: Movie;
  showDeleteIcon?: boolean;
  onDelete?: (id: number) => void;
  highlight?: string;
  className?: string;
}

const PLACEHOLDER_POSTER = '/placeholder-poster.svg';

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  showDeleteIcon = false,
  onDelete,
  highlight,
  className,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(movie.id);

  const handleFavoriteClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(movie);
    },
    [toggleFavorite, movie],
  );

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onDelete?.(movie.id);
    },
    [onDelete, movie.id],
  );

  const titleParts = highlight ? highlightText(movie.title, highlight) : null;

  return (
    <Link
      to={`/movie/${movie.id}`}
      className={clsx(
        'group flex flex-col bg-surface-card rounded-2xl overflow-hidden',
        'shadow-card hover:shadow-card-hover transition-all duration-300',
        'hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-surface-base',
        'animate-fade-in',
        className,
      )}
      aria-label={`Ver detalhes de ${movie.title}`}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden bg-surface-overlay">
        <img
          src={movie.posterUrl ?? PLACEHOLDER_POSTER}
          alt={`Poster de ${movie.title}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_POSTER; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-base/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Action button */}
        <div className="absolute top-2 right-2">
          {showDeleteIcon ? (
            <button
              onClick={handleDeleteClick}
              className={clsx(
                'p-1.5 rounded-full bg-surface-base/80 backdrop-blur-sm',
                'text-status-error hover:bg-status-error hover:text-white',
                'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-status-error',
              )}
              aria-label={`Remover ${movie.title} dos favoritos`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleFavoriteClick}
              className={clsx(
                'p-1.5 rounded-full bg-surface-base/80 backdrop-blur-sm',
                'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-secondary',
                favorited
                  ? 'text-brand-secondary hover:text-amber-300'
                  : 'text-text-secondary hover:text-brand-secondary',
              )}
              aria-label={favorited ? `Remover ${movie.title} dos favoritos` : `Adicionar ${movie.title} aos favoritos`}
              aria-pressed={favorited}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill={favorited ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={favorited ? 0 : 2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5">
        <p className="text-text-primary text-sm font-semibold leading-tight line-clamp-2 min-h-[2.5rem]">
          {titleParts
            ? titleParts.map((part, i) =>
                part.highlighted ? (
                  <mark key={i} className="bg-brand-secondary text-surface-base rounded px-0.5">
                    {part.text}
                  </mark>
                ) : (
                  <span key={i}>{part.text}</span>
                ),
              )
            : movie.title}
        </p>
        {/* Use pre-formatted values from adapter */}
        <RatingBadge
          rating={movie.rating}
          ratingFormatted={movie.ratingFormatted}
          ratingLevel={movie.ratingLevel}
          size="sm"
        />
      </div>
    </Link>
  );
};
