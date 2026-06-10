import React, { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '@/domain/entities/Movie';
import { MovieCardSkeleton } from './Skeleton';
import { clsx } from '@/shared/utils/format';
import { useFavorites } from '@/app/contexts/FavoritesContext';

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  isLoading?: boolean;
}

const VISIBLE = 6;

const PLACEHOLDER = '/placeholder-poster.svg';

function ratingColor(level: string) {
  if (level === 'excellent') return '#34d399';
  if (level === 'good') return '#fbbf24';
  return '#f87171';
}

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={filled ? 0 : 1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);

export const MovieCarousel: React.FC<MovieCarouselProps> = ({ title, movies, isLoading = false }) => {
  const [offset, setOffset] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [isHoveringRow, setIsHoveringRow] = useState(false);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const maxOffset = Math.max(0, movies.length - VISIBLE);
  const canLeft = offset > 0;
  const canRight = offset < maxOffset;

  const goLeft = useCallback(() => {
    setOffset((p) => Math.max(0, p - VISIBLE));
    setHovered(null);
  }, []);

  const goRight = useCallback(() => {
    setOffset((p) => Math.min(maxOffset, p + VISIBLE));
    setHovered(null);
  }, [maxOffset]);

  const handleRowEnter = () => {
    clearTimeout(leaveTimerRef.current);
    setIsHoveringRow(true);
  };

  const handleRowLeave = () => {
    leaveTimerRef.current = setTimeout(() => {
      setIsHoveringRow(false);
      setHovered(null);
    }, 200);
  };

  if (isLoading) {
    return (
      <section className="mb-10" aria-label={title}>
        <RowHeader title={title} showArrows={false} canLeft={false} canRight={false} onLeft={() => {}} onRight={() => {}} />
        <div className="grid grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <MovieCardSkeleton key={i} />)}
        </div>
      </section>
    );
  }

  if (!movies.length) return null;

  const visible = movies.slice(offset, offset + VISIBLE);

  return (
    <section
      className="mb-10"
      aria-label={title}
      onMouseEnter={handleRowEnter}
      onMouseLeave={handleRowLeave}
    >
      <RowHeader
        title={title}
        showArrows={isHoveringRow}
        canLeft={canLeft}
        canRight={canRight}
        onLeft={goLeft}
        onRight={goRight}
      />

      <div className="relative" style={{ paddingBottom: hovered !== null ? '0' : '0' }}>
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${VISIBLE}, 1fr)` }}>
          {visible.map((movie, colIndex) => {
            const globalIndex = offset + colIndex;
            const isActive = hovered === globalIndex;

            return (
              <CarouselItem
                key={movie.id}
                movie={movie}
                colIndex={colIndex}
                totalVisible={VISIBLE}
                isActive={isActive}
                anyActive={hovered !== null}
                onEnter={() => setHovered(globalIndex)}
                onLeave={() => {}}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

const RowHeader: React.FC<{
  title: string;
  showArrows: boolean;
  canLeft: boolean;
  canRight: boolean;
  onLeft: () => void;
  onRight: () => void;
}> = ({ title, showArrows, canLeft, canRight, onLeft, onRight }) => (
  <div className="flex items-center justify-between mb-3 h-8">
    <div className="flex items-center gap-3">
      <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">{title}</h2>
      <div className="h-px w-12 bg-gradient-to-r from-brand-primary/60 to-transparent" />
    </div>
    <div
      className="flex items-center gap-1.5 transition-all duration-300"
      style={{ opacity: showArrows ? 1 : 0, transform: showArrows ? 'translateX(0)' : 'translateX(8px)' }}
      aria-hidden={!showArrows}
    >
      <button
        onClick={onLeft}
        disabled={!canLeft}
        aria-label="Voltar"
        className={clsx(
          'flex items-center justify-center w-8 h-8 rounded-full',
          'border border-white/20 backdrop-blur-sm transition-all duration-150',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
          canLeft
            ? 'bg-black/60 text-white hover:bg-white hover:text-black hover:border-white cursor-pointer'
            : 'bg-black/20 text-white/20 cursor-not-allowed border-white/5',
        )}
      >
        <ChevronLeft />
      </button>
      <button
        onClick={onRight}
        disabled={!canRight}
        aria-label="Avançar"
        className={clsx(
          'flex items-center justify-center w-8 h-8 rounded-full',
          'border border-white/20 backdrop-blur-sm transition-all duration-150',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
          canRight
            ? 'bg-black/60 text-white hover:bg-white hover:text-black hover:border-white cursor-pointer'
            : 'bg-black/20 text-white/20 cursor-not-allowed border-white/5',
        )}
      >
        <ChevronRight />
      </button>
    </div>
  </div>
);

const CarouselItem: React.FC<{
  movie: Movie;
  colIndex: number;
  totalVisible: number;
  isActive: boolean;
  anyActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
}> = ({ movie, colIndex, totalVisible, isActive, anyActive, onEnter, onLeave }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(movie.id);
  const [imgErr, setImgErr] = useState(false);
  const [pulse, setPulse] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPulse(true);
    setTimeout(() => setPulse(false), 350);
    toggleFavorite(movie);
  };

  const color = ratingColor(movie.ratingLevel);

  const isFirst = colIndex === 0;
  const isLast = colIndex === totalVisible - 1;

  let expandOrigin = 'center';
  if (isFirst) expandOrigin = 'left';
  if (isLast) expandOrigin = 'right';

  return (
    <div
      className="relative"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        zIndex: isActive ? 40 : anyActive ? 1 : 'auto',
        transition: 'z-index 0s',
      }}
    >
      <div
        style={{
          transform: isActive ? 'scale(1.45)' : anyActive ? 'scale(0.95)' : 'scale(1)',
          transformOrigin: `${expandOrigin} center`,
          transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: '10px',
          overflow: isActive ? 'visible' : 'hidden',
          position: 'relative',
        }}
      >
        <Link
          to={`/movie/${movie.id}`}
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-lg"
          aria-label={`Ver ${movie.title}`}
          tabIndex={0}
        >
          <div
            className="relative rounded-lg overflow-hidden bg-surface-overlay"
            style={{ aspectRatio: '2/3' }}
          >
            <img
              src={imgErr ? PLACEHOLDER : (movie.posterUrl ?? PLACEHOLDER)}
              alt={`Poster de ${movie.title}`}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => setImgErr(true)}
            />

            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 40%, transparent 70%)',
                opacity: isActive ? 1 : 0.5,
                transition: 'opacity 0.25s',
              }}
            />

            <div
              className="absolute top-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded"
              style={{
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(4px)',
                color: color,
                fontSize: '10px',
                fontWeight: 700,
                opacity: isActive ? 0 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              <StarIcon />
              <span style={{ color }}>{movie.ratingFormatted}</span>
            </div>

            <button
              onClick={handleFavorite}
              aria-label={favorited ? `Remover ${movie.title} dos favoritos` : `Adicionar ${movie.title} aos favoritos`}
              aria-pressed={favorited}
              className="absolute top-1.5 right-1.5 flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary"
              style={{
                width: 26,
                height: 26,
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(4px)',
                border: favorited ? '1.5px solid rgba(251,113,133,0.5)' : '1.5px solid rgba(255,255,255,0.15)',
                color: favorited ? '#fb7185' : 'rgba(255,255,255,0.6)',
                transform: pulse ? 'scale(1.3)' : 'scale(1)',
                transition: 'transform 0.2s, color 0.2s, border-color 0.2s',
              }}
            >
              <HeartIcon filled={favorited} />
            </button>

            {favorited && (
              <div
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{ boxShadow: 'inset 0 0 0 2px rgba(251,113,133,0.5)' }}
              />
            )}

            {isActive && (
              <div
                className="absolute inset-x-0 bottom-0 p-2.5"
                style={{ animation: 'fadeSlideUp 0.2s ease-out forwards' }}
              >
                <p className="text-white font-bold leading-tight mb-1.5 line-clamp-2"
                  style={{ fontSize: '11px', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                  {movie.title}
                </p>

                <div className="flex items-center gap-1.5 mb-1.5">
                  <span style={{ color, fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <StarIcon />
                    {movie.ratingFormatted}
                  </span>
                  {movie.releaseYear && (
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>{movie.releaseYear}</span>
                  )}
                </div>

                {movie.overview && (
                  <p style={{
                    color: 'rgba(255,255,255,0.75)',
                    fontSize: '9.5px',
                    lineHeight: 1.45,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: '8px',
                  }}>
                    {movie.overview}
                  </p>
                )}

                <div
                  className="flex items-center justify-center gap-1.5 rounded-full cursor-pointer"
                  style={{
                    background: 'white',
                    color: '#0f172a',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '5px 0',
                  }}
                >
                  <PlayIcon />
                  Ver detalhes
                </div>
              </div>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};
