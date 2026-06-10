import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useFavorites } from '@/app/contexts/FavoritesContext';
import { clsx } from '@/shared/utils/format';
import { analytics } from '@/infrastructure/analytics/ga';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { totalFavorites } = useFavorites();
  const [searchValue, setSearchValue] = useState(searchParams.get('q') ?? '');
  const [isFocused, setIsFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha menu ao navegar
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Fecha menu ao clicar fora
  useEffect(() => {
    if (!menuOpen) return;
    const handle = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [menuOpen]);

  // Bloqueia scroll do body quando menu aberto em mobile
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    setSearchValue(searchParams.get('q') ?? '');
  }, [searchParams]);

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
    setSearchValue(e.target.value);
    handleSearch(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      analytics.events.searchMovie(searchValue);
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setMenuOpen(false);
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) => clsx(
    'flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
    isActive
      ? 'bg-brand-primary text-white'
      : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated',
  );

  const navLinkClassDesktop = ({ isActive }: { isActive: boolean }) => clsx(
    'px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
    isActive
      ? 'bg-brand-primary text-white'
      : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated',
  );

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface-base/95 backdrop-blur-md border-b border-surface-overlay">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-lg p-1"
              aria-label="MovieDB - Página inicial"
            >
              <span className="text-xl" role="img" aria-hidden="true">🎬</span>
              <span className="text-brand-primary font-extrabold text-lg tracking-tight hidden xs:block">
                MovieDB
              </span>
            </Link>

            {/* Search */}
            <form
              onSubmit={handleSubmit}
              className="flex-1"
              role="search"
              aria-label="Buscar filmes"
            >
              <div className={clsx(
                'relative flex items-center rounded-full border transition-all duration-200',
                isFocused
                  ? 'border-brand-primary bg-surface-elevated shadow-glow-primary'
                  : 'border-surface-overlay bg-surface-elevated hover:border-text-muted',
              )}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-4 text-text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="search"
                  value={searchValue}
                  onChange={handleInputChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => e.key === 'Escape' && inputRef.current?.blur()}
                  placeholder="Buscar filmes..."
                  className="flex-1 bg-transparent text-text-primary placeholder-text-muted text-sm py-2 px-3 focus:outline-none min-w-0"
                  aria-label="Campo de busca de filmes"
                  autoComplete="off"
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={() => { setSearchValue(''); inputRef.current?.focus(); }}
                    className="mr-3 text-text-muted hover:text-text-primary transition-colors focus:outline-none flex-shrink-0"
                    aria-label="Limpar busca"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </form>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1 flex-shrink-0" aria-label="Navegação principal">
              <NavLink to="/" end className={navLinkClassDesktop}>Home</NavLink>
              <NavLink to="/favorites" className={({ isActive }) => clsx(
                navLinkClassDesktop({ isActive }),
                'relative',
              )}>
                Favoritos
                {totalFavorites > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-secondary text-surface-base text-xs font-extrabold rounded-full h-4 w-4 flex items-center justify-center leading-none">
                    {totalFavorites > 9 ? '9+' : totalFavorites}
                  </span>
                )}
              </NavLink>
            </nav>

            {/* Hamburger button — mobile only */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className={clsx(
                'md:hidden flex-shrink-0 flex flex-col justify-center items-center w-9 h-9 rounded-lg',
                'text-text-secondary hover:text-text-primary hover:bg-surface-elevated',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
                'transition-colors duration-200 gap-1.5',
              )}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span className={clsx(
                'block w-5 h-0.5 bg-current rounded-full transition-all duration-300 origin-center',
                menuOpen ? 'rotate-45 translate-y-2' : '',
              )} />
              <span className={clsx(
                'block w-5 h-0.5 bg-current rounded-full transition-all duration-200',
                menuOpen ? 'opacity-0 scale-x-0' : '',
              )} />
              <span className={clsx(
                'block w-5 h-0.5 bg-current rounded-full transition-all duration-300 origin-center',
                menuOpen ? '-rotate-45 -translate-y-2' : '',
              )} />
            </button>

          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={clsx(
          'fixed inset-0 z-40 md:hidden transition-all duration-300',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        aria-hidden={!menuOpen}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />

        {/* Drawer */}
        <div
          ref={menuRef}
          id="mobile-menu"
          className={clsx(
            'absolute top-[57px] left-0 right-0',
            'bg-surface-base border-b border-surface-overlay',
            'transition-transform duration-300 ease-out',
            menuOpen ? 'translate-y-0' : '-translate-y-full',
          )}
        >
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1" aria-label="Menu mobile">

            <NavLink to="/" end className={navLinkClass}>
              {({ isActive }) => (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Home</span>
                  {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-primary" />}
                </>
              )}
            </NavLink>

            <NavLink to="/favorites" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  <span>Favoritos</span>
                  {totalFavorites > 0 && (
                    <span className="ml-1 bg-brand-secondary text-surface-base text-xs font-extrabold rounded-full px-1.5 py-0.5 leading-none">
                      {totalFavorites > 9 ? '9+' : totalFavorites}
                    </span>
                  )}
                  {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-primary" />}
                </>
              )}
            </NavLink>

          </nav>
        </div>
      </div>
    </>
  );
};
