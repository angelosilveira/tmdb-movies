import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useFavorites } from '@/app/contexts/FavoritesContext';
import { clsx } from '@/shared/utils/format';
import { analytics } from '@/infrastructure/analytics/ga';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { totalFavorites } = useFavorites();
  const [searchValue, setSearchValue] = useState(searchParams.get('q') ?? '');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync search input with URL params — calling setState synchronously in effect is intentional
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    setSearchValue(q);
  }, [searchParams]); // eslint-disable-line

  const searchTimerRef = React.useRef<ReturnType<typeof setTimeout>>();
  const handleSearch = useCallback((value: string) => {
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      if (value.trim()) {
        analytics.events.searchMovie(value);
        navigate(`/search?q=${encodeURIComponent(value.trim())}`);
      }
    }, 500);
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    handleSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      analytics.events.searchMovie(searchValue);
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      inputRef.current?.blur();
      setIsFocused(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-surface-base/95 backdrop-blur-md border-b border-surface-overlay">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0 group focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-lg p-1"
            aria-label="MovieDB - Página inicial"
          >
            <span className="text-xl" role="img" aria-hidden="true">🎬</span>
            <span className="text-brand-primary font-extrabold text-lg tracking-tight hidden xs:block group-hover:text-blue-400 transition-colors">
              MovieDB
            </span>
          </Link>

          {/* Search */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 max-w-xl"
            role="search"
            aria-label="Buscar filmes"
          >
            <div className={clsx(
              'relative flex items-center rounded-full border transition-all duration-200',
              isFocused
                ? 'border-brand-primary bg-surface-elevated shadow-glow-primary'
                : 'border-surface-overlay bg-surface-elevated hover:border-text-muted',
            )}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-4 text-text-muted flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="search"
                value={searchValue}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="Buscar filmes..."
                className="flex-1 bg-transparent text-text-primary placeholder-text-muted text-sm py-2 px-3 focus:outline-none"
                aria-label="Campo de busca de filmes"
                autoComplete="off"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchValue('');
                    inputRef.current?.focus();
                  }}
                  className="mr-3 text-text-muted hover:text-text-primary transition-colors focus:outline-none"
                  aria-label="Limpar busca"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </form>

          {/* Nav */}
          <nav className="flex items-center gap-1 flex-shrink-0" aria-label="Navegação principal">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                clsx(
                  'px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-brand-primary',
                  isActive
                    ? 'bg-brand-primary text-white'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated',
                )
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                clsx(
                  'relative px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-brand-primary',
                  isActive
                    ? 'bg-brand-primary text-white'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated',
                )
              }
            >
              Favoritos
              {totalFavorites > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-secondary text-surface-base text-xs font-extrabold rounded-full h-4 w-4 flex items-center justify-center leading-none">
                  {totalFavorites > 9 ? '9+' : totalFavorites}
                </span>
              )}
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};
