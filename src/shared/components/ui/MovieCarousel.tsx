import React, { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '@/domain/entities/Movie';
import { MovieCard } from './MovieCard';
import { MovieCardSkeleton } from './Skeleton';
import { clsx } from '@/shared/utils/format';

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  isLoading?: boolean;
  skeletonCount?: number;
}

const ChevronLeft: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);

function getRatingColor(level: string) {
  if (level === 'excellent') return 'text-emerald-400';
  if (level === 'good')      return 'text-amber-400';
  return 'text-red-400';
}

export const MovieCarousel: React.FC<MovieCarouselProps> = ({
  title,
  movies,
  isLoading = false,
  skeletonCount = 8,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const VISIBLE = 6;
  const [offset, setOffset] = useState(0);

  const maxOffset = Math.max(0, movies.length - VISIBLE);

  const scrollLeft = useCallback(() => {
    setOffset((prev) => Math.max(0, prev - VISIBLE));
    setActiveIndex(null);
  }, []);

  const scrollRight = useCallback(() => {
    setOffset((prev) => Math.min(maxOffset, prev + VISIBLE));
    setActiveIndex(null);
  }, [maxOffset]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveIndex(index === activeIndex ? null : index);
    }
    if (e.key === 'Escape') setActiveIndex(null);
  };

  if (isLoading) {
    return (
      <section className="mb-8" aria-label={`Carregando ${title}`}>
        <SectionTitle title={title} />
        <div className="grid grid-cols-6 gap-3">
          {Array.from({ length: skeletonCount }).map((_, i) => <MovieCardSkeleton key={i} />)}
        </div>
      </section>
    );
  }

  if (!movies.length) return null;

  const visibleMovies = movies.slice(offset, offset + VISIBLE);
  const canLeft  = offset > 0;
  const canRight = offset < maxOffset;

  return (
    <section className="mb-10 group/row" aria-label={title}>
      <div className="flex items-center justify-between mb-3 pr-1">
        <SectionTitle title={title} />
        <div className="flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity duration-200">
          <ArrowBtn onClick={scrollLeft} disabled={!canLeft} label="Anterior" icon={<ChevronLeft className="w-4 h-4" />} />
          <ArrowBtn onClick={scrollRight} disabled={!canRight} label="Próximo" icon={<ChevronRight className="w-4 h-4" />} />
        </div>
      </div>

      <div ref={trackRef} className="relative overflow-visible">
        <div className="grid grid-cols-6 gap-3 items-start">
          {visibleMovies.map((movie, i) => {
            const globalIndex = offset + i;
            const isActive = activeIndex === globalIndex;

            return (
              <div
                key={movie.id}
                className={clsx(
                  'relative transition-all duration-300 ease-out cursor-pointer',
                  isActive ? 'z-30' : 'z-10 hover:z-20',
                )}
                onMouseEnter={() => setActiveIndex(globalIndex)}
                onMouseLeave={() => setActiveIndex(null)}
                onKeyDown={(e) => handleKeyDown(e, globalIndex)}
              >
                {isActive ? (
                  <ActiveCard movie={movie} onClose={() => setActiveIndex(null)} />
                ) : (
                  <MovieCard movie={movie} className="w-full" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center gap-3">
    <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">{title}</h2>
    <div className="h-px w-16 bg-gradient-to-r from-brand-primary/50 to-transparent" />
  </div>
);

const ArrowBtn: React.FC<{
  onClick: () => void;
  disabled: boolean;
  label: string;
  icon: React.ReactNode;
}> = ({ onClick, disabled, label, icon }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className={clsx(
      'p-1.5 rounded-full border transition-all duration-150',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
      disabled
        ? 'border-surface-overlay text-text-muted opacity-30 cursor-not-allowed'
        : 'border-surface-overlay text-text-secondary hover:text-white hover:border-brand-primary hover:bg-brand-primary/20',
    )}
  >
    {icon}
  </button>
);

const ActiveCard: React.FC<{ movie: Movie; onClose: () => void }> = ({ movie, onClose }) => {
  const PLACEHOLDER = '/placeholder-poster.svg';
  const ratingColor = getRatingColor(movie.ratingLevel);

  return (
    <Link
      to={`/movie/${movie.id}`}
      onClick={onClose}
      className={clsx(
        'block rounded-xl overflow-hidden',
        'shadow-[0_8px_40px_rgba(0,0,0,0.8)]',
        'ring-2 ring-brand-primary/60',
        'animate-[expandCard_0.2s_ease-out_forwards]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
      )}
      aria-label={`Ver detalhes de ${movie.title}`}
      style={{ transform: 'scale(1.08)', transformOrigin: 'center top' }}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-surface-overlay">
        <img
          src={movie.posterUrl ?? PLACEHOLDER}
          alt={`Poster de ${movie.title}`}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-3">
          <p className="text-white font-bold text-sm leading-tight mb-2 drop-shadow-lg line-clamp-2">
            {movie.title}
          </p>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1">
              <StarIcon className={clsx('w-3.5 h-3.5', ratingColor)} />
              <span className={clsx('text-xs font-bold tabular-nums', ratingColor)}>
                {movie.ratingFormatted}
              </span>
            </div>
            {movie.releaseYear && (
              <span className="text-white/60 text-xs">{movie.releaseYear}</span>
            )}
          </div>

          {movie.overview && (
            <p className="text-white/70 text-[11px] leading-relaxed line-clamp-3 mb-3">
              {movie.overview}
            </p>
          )}

          <span className="inline-flex items-center gap-1.5 bg-white text-surface-base text-xs font-bold px-3 py-1.5 rounded-full w-full justify-center">
            <PlayIcon className="w-3 h-3" />
            Ver detalhes
          </span>
        </div>
      </div>
    </Link>
  );
};
