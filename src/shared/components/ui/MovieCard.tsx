import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '@/domain/entities/Movie';
import { useFavorites } from '@/app/contexts/FavoritesContext';
import { clsx, highlightText } from '@/shared/utils/format';

interface MovieCardProps {
  movie: Movie;
  showDeleteIcon?: boolean;
  onDelete?: (id: number) => void;
  highlight?: string;
  className?: string;
}

const PLACEHOLDER = '/placeholder-poster.svg';

// ─── Star icon ────────────────────────────────────────────────────────────────
const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// ─── Heart icon ───────────────────────────────────────────────────────────────
const HeartIcon: React.FC<{ filled: boolean; className?: string }> = ({ filled, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor" strokeWidth={filled ? 0 : 1.5}
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  </svg>
);

// ─── Trash icon ───────────────────────────────────────────────────────────────
const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
  </svg>
);

// ─── Play icon ────────────────────────────────────────────────────────────────
const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);

// ─── Rating color ─────────────────────────────────────────────────────────────
function getRatingColor(level: string): string {
  if (level === 'excellent') return 'text-emerald-400';
  if (level === 'good') return 'text-amber-400';
  return 'text-red-400';
}

// ─── Component ────────────────────────────────────────────────────────────────
export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  showDeleteIcon = false,
  onDelete,
  highlight,
  className,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(movie.id);
  const [imgError, setImgError] = useState(false);
  const [heartPulse, setHeartPulse] = useState(false);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setHeartPulse(true);
    setTimeout(() => setHeartPulse(false), 400);
    toggleFavorite(movie);
  }, [toggleFavorite, movie]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(movie.id);
  }, [onDelete, movie.id]);

  const titleParts = highlight ? highlightText(movie.title, highlight) : null;
  const ratingColor = getRatingColor(movie.ratingLevel);

  return (
    <Link
      to={`/movie/${movie.id}`}
      className={clsx(
        'group relative block rounded-xl overflow-hidden',
        'cursor-pointer select-none',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base',
        className,
      )}
      aria-label={`Ver detalhes de ${movie.title}`}
    >
      {/* ── Poster ─────────────────────────────────────────────────────────── */}
      <div className="relative aspect-[2/3] overflow-hidden bg-surface-overlay rounded-xl">
        <img
          src={imgError ? PLACEHOLDER : (movie.posterUrl ?? PLACEHOLDER)}
          alt={`Poster de ${movie.title}`}
          className={clsx(
            'w-full h-full object-cover',
            'transition-transform duration-500 ease-out',
            'group-hover:scale-[1.06]',
          )}
          loading="lazy"
          onError={() => setImgError(true)}
        />

        {/* Vignette always-on (bottom) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Vignette reveal (top — darkens on hover for readability) */}
        <div className={clsx(
          'absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
        )} />

        {/* ── Hover info panel ──────────────────────────────────────────────── */}
        <div className={clsx(
          'absolute inset-x-0 bottom-0',
          'translate-y-1 group-hover:translate-y-0',
          'opacity-0 group-hover:opacity-100',
          'transition-all duration-300 ease-out',
          'px-3 pb-3 pt-8',
        )}>
          {/* Title */}
          <p className="text-white font-bold text-sm leading-tight line-clamp-2 mb-2 drop-shadow-lg">
            {titleParts
              ? titleParts.map((part, i) =>
                  part.highlighted
                    ? <mark key={i} className="bg-brand-secondary text-surface-base rounded px-0.5 not-italic">{part.text}</mark>
                    : <span key={i}>{part.text}</span>
                )
              : movie.title}
          </p>

          {/* Meta row */}
          <div className="flex items-center justify-between gap-2">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <StarIcon className={clsx('w-3.5 h-3.5', ratingColor)} />
              <span className={clsx('text-xs font-bold tabular-nums', ratingColor)}>
                {movie.ratingFormatted}
              </span>
            </div>

            {/* Year */}
            {movie.releaseYear && (
              <span className="text-white/60 text-xs font-medium">
                {movie.releaseYear}
              </span>
            )}

            {/* Play CTA */}
            <span className="flex items-center gap-1 text-white text-xs font-semibold
              bg-white/15 hover:bg-white/25 backdrop-blur-sm
              rounded-full px-2 py-0.5 transition-colors duration-150">
              <PlayIcon className="w-2.5 h-2.5" />
              Ver
            </span>
          </div>
        </div>

        {/* ── Rating badge (always visible — top-left) ─────────────────────── */}
        <div className="absolute top-2 left-2 group-hover:opacity-0 transition-opacity duration-200">
          <span className={clsx(
            'flex items-center gap-0.5 text-xs font-bold tabular-nums',
            'bg-black/70 backdrop-blur-sm rounded-md px-1.5 py-0.5',
            ratingColor,
          )}>
            <StarIcon className="w-3 h-3 flex-shrink-0" />
            {movie.ratingFormatted}
          </span>
        </div>

        {/* ── Action button (top-right) ─────────────────────────────────────── */}
        <div className="absolute top-2 right-2 z-10">
          {showDeleteIcon ? (
            <button
              onClick={handleDeleteClick}
              className={clsx(
                'p-1.5 rounded-full',
                'bg-black/60 backdrop-blur-sm border border-white/10',
                'text-white/70 hover:text-red-400 hover:bg-red-500/20 hover:border-red-400/30',
                'transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400',
              )}
              aria-label={`Remover ${movie.title} dos favoritos`}
            >
              <TrashIcon className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFavoriteClick}
              className={clsx(
                'p-1.5 rounded-full',
                'bg-black/60 backdrop-blur-sm border',
                'transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary',
                heartPulse && 'scale-125',
                favorited
                  ? 'text-rose-400 border-rose-400/40 bg-rose-500/20'
                  : 'text-white/60 border-white/10 hover:text-rose-400 hover:border-rose-400/30 hover:bg-rose-500/20',
              )}
              aria-label={favorited ? `Remover ${movie.title} dos favoritos` : `Adicionar ${movie.title} aos favoritos`}
              aria-pressed={favorited}
            >
              <HeartIcon
                filled={favorited}
                className={clsx('w-3.5 h-3.5 transition-transform duration-150', heartPulse && 'scale-110')}
              />
            </button>
          )}
        </div>

        {/* ── Favorited glow ring ───────────────────────────────────────────── */}
        {favorited && (
          <div className="absolute inset-0 rounded-xl ring-2 ring-rose-400/60 ring-inset pointer-events-none" />
        )}
      </div>

      {/* ── Static title below (visible when NOT hovered) ─────────────────── */}
      <div className="px-0.5 pt-2 pb-1 group-hover:opacity-0 transition-opacity duration-200">
        <p className="text-text-primary text-xs font-semibold leading-snug line-clamp-1">
          {titleParts
            ? titleParts.map((part, i) =>
                part.highlighted
                  ? <mark key={i} className="bg-brand-secondary text-surface-base rounded px-0.5">{part.text}</mark>
                  : <span key={i}>{part.text}</span>
              )
            : movie.title}
        </p>
      </div>
    </Link>
  );
};
