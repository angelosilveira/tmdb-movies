/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { FavoriteMovie, Movie, SortOption } from '@/shared/types/movie.types';
import { adaptStoredFavorite } from '@/infrastructure/adapters';
import { analytics } from '@/infrastructure/analytics/ga';

const FAVORITES_STORAGE_KEY = 'tmdb_favorites';

// ─── State ────────────────────────────────────────────────────────────────────

interface FavoritesState {
  favorites: FavoriteMovie[];
  sortOption: SortOption;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

type FavoritesAction =
  | { type: 'ADD_FAVORITE'; payload: Movie }
  | { type: 'REMOVE_FAVORITE'; payload: number }
  | { type: 'SET_SORT'; payload: SortOption }
  | { type: 'HYDRATE'; payload: FavoriteMovie[] };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, favorites: action.payload };

    case 'ADD_FAVORITE': {
      if (state.favorites.some((f) => f.id === action.payload.id)) return state;
      const newFavorite: FavoriteMovie = {
        ...action.payload,
        addedAt: new Date().toISOString(),
      };
      return { ...state, favorites: [...state.favorites, newFavorite] };
    }

    case 'REMOVE_FAVORITE':
      return { ...state, favorites: state.favorites.filter((f) => f.id !== action.payload) };

    case 'SET_SORT':
      return { ...state, sortOption: action.payload };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface FavoritesContextValue {
  favorites: FavoriteMovie[];
  sortOption: SortOption;
  sortedFavorites: FavoriteMovie[];
  isFavorite: (id: number) => boolean;
  addFavorite: (movie: Movie) => void;
  removeFavorite: (id: number) => void;
  toggleFavorite: (movie: Movie) => void;
  setSortOption: (option: SortOption) => void;
  totalFavorites: number;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, {
    favorites: [],
    sortOption: 'title-asc',
  });

  // Hydrate from localStorage — uses adaptStoredFavorite for forward/backward compat
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (!stored) return;

      const raw = JSON.parse(stored) as unknown[];
      if (!Array.isArray(raw)) return;

      // adaptStoredFavorite handles schema migrations (old snake_case → new camelCase)
      const hydrated = raw
        .map(adaptStoredFavorite)
        .filter((m): m is FavoriteMovie => m !== null);

      dispatch({ type: 'HYDRATE', payload: hydrated });
    } catch {
      console.warn('[Favorites] Failed to hydrate from localStorage');
    }
  }, []);

  // Persist domain types to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(state.favorites));
    } catch {
      console.warn('[Favorites] Failed to persist to localStorage');
    }
  }, [state.favorites]);

  const isFavorite = useCallback(
    (id: number) => state.favorites.some((f) => f.id === id),
    [state.favorites],
  );

  const addFavorite = useCallback((movie: Movie) => {
    dispatch({ type: 'ADD_FAVORITE', payload: movie });
    analytics.events.addToFavorites(movie.id, movie.title);
  }, []);

  const removeFavorite = useCallback(
    (id: number) => {
      const movie = state.favorites.find((f) => f.id === id);
      dispatch({ type: 'REMOVE_FAVORITE', payload: id });
      if (movie) analytics.events.removeFromFavorites(id, movie.title);
    },
    [state.favorites],
  );

  const toggleFavorite = useCallback(
    (movie: Movie) => {
      if (isFavorite(movie.id)) removeFavorite(movie.id);
      else addFavorite(movie);
    },
    [isFavorite, addFavorite, removeFavorite],
  );

  const setSortOption = useCallback((option: SortOption) => {
    dispatch({ type: 'SET_SORT', payload: option });
  }, []);

  const sortedFavorites = useMemo(() => {
    const sorted = [...state.favorites];
    switch (state.sortOption) {
      case 'title-asc':   return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':  return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'rating-desc': return sorted.sort((a, b) => b.rating - a.rating);
      case 'rating-asc':  return sorted.sort((a, b) => a.rating - b.rating);
      default: return sorted;
    }
  }, [state.favorites, state.sortOption]);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites: state.favorites,
      sortOption: state.sortOption,
      sortedFavorites,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      setSortOption,
      totalFavorites: state.favorites.length,
    }),
    [state, sortedFavorites, isFavorite, addFavorite, removeFavorite, toggleFavorite, setSortOption],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
}
