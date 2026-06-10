import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '@/app/contexts/FavoritesContext';
import { MovieCard } from '@/shared/components/ui/MovieCard';
import { Button } from '@/shared/components/ui/Button';
import { SortOption } from '@/shared/types/movie.types';
import { analytics } from '@/infrastructure/analytics/ga';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'title-asc', label: 'Título (A-Z)' },
  { value: 'title-desc', label: 'Título (Z-A)' },
  { value: 'rating-desc', label: 'Nota (maior)' },
  { value: 'rating-asc', label: 'Nota (menor)' },
];

export const FavoritesPage: React.FC = () => {
  const { sortedFavorites, sortOption, setSortOption, removeFavorite, totalFavorites } = useFavorites();

  useEffect(() => {
    analytics.pageView('/favorites', 'Meus Favoritos');
  }, []);

  const isEmpty = totalFavorites === 0;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-display-sm font-extrabold text-text-primary">
            Meus Filmes Favoritos
          </h1>
          {!isEmpty && (
            <p className="text-text-secondary text-sm mt-1">
              {totalFavorites} {totalFavorites === 1 ? 'filme salvo' : 'filmes salvos'}
            </p>
          )}
        </div>

        {/* Sort */}
        {!isEmpty && (
          <div className="flex items-center gap-3">
            <label
              htmlFor="sort-select"
              className="text-text-secondary text-sm font-medium whitespace-nowrap"
            >
              Ordenar por:
            </label>
            <select
              id="sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-surface-elevated border border-surface-overlay text-text-primary text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Empty state */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-fade-in">
          <div className="text-7xl mb-6" role="img" aria-label="Claquete de cinema">
            🎬
          </div>
          <h2 className="text-display-xs font-bold text-text-primary mb-3">
            Nenhum filme favorito ainda
          </h2>
          <p className="text-text-secondary mb-8 max-w-sm">
            Comece explorando filmes populares e adicione seus favoritos!
          </p>
          <Link to="/">
            <Button variant="primary" size="lg">
              Explorar Filmes
            </Button>
          </Link>
        </div>
      ) : (
        <div
          className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
          role="list"
          aria-label="Lista de filmes favoritos"
        >
          {sortedFavorites.map((movie) => (
            <div key={movie.id} role="listitem">
              <MovieCard
                movie={movie}
                showDeleteIcon
                onDelete={removeFavorite}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
