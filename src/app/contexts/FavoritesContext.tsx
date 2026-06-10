/* eslint-disable react-refresh/only-export-components */
// ─────────────────────────────────────────────────────────────────────────────
// FavoritesContext
//
// SOLID — SRP: gerencia apenas o estado global de favoritos no React.
//         DIP: consome use cases do container, nunca o localStorage diretamente.
//
// Clean Architecture: camada de apresentação (React) orquestra use cases.
// ─────────────────────────────────────────────────────────────────────────────

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { Movie }          from '@/domain/entities/Movie';
import { FavoriteMovie }  from '@/domain/entities/FavoriteMovie';
import {
  toggleFavoriteUseCase,
  getFavoritesUseCase,
  removeFavoriteUseCase,
  favoritesRepository,
} from '@/app/container';
import { analytics } from '@/infrastructure/analytics/ga';

export type SortOption = 'title-asc' | 'title-desc' | 'rating-desc' | 'rating-asc';

// ─── State ────────────────────────────────────────────────────────────────────

interface FavoritesState {
  favorites: FavoriteMovie[];
  sortOption: SortOption;
}

type FavoritesAction =
  | { type: 'HYDRATE';        payload: FavoriteMovie[] }
  | { type: 'SET_FAVORITES';  payload: FavoriteMovie[] }
  | { type: 'SET_SORT';       payload: SortOption };

function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
  switch (action.type) {
    case 'HYDRATE':
    case 'SET_FAVORITES': return { ...state, favorites: action.payload };
    case 'SET_SORT':      return { ...state, sortOption: action.payload };
    default:              return state;
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

  // Hydrate from repository on mount
  useEffect(() => {
    const stored = getFavoritesUseCase.execute();
    dispatch({ type: 'HYDRATE', payload: stored });
  }, []);

  const isFavorite = useCallback(
    (id: number) => state.favorites.some((f) => f.id === id),
    [state.favorites],
  );

  const addFavorite = useCallback((movie: Movie) => {
    // Só adiciona se ainda não for favorito (idempotente)
    if (isFavorite(movie.id)) return;
    const { favorites } = toggleFavoriteUseCase.execute({ movie });
    dispatch({ type: 'SET_FAVORITES', payload: favorites });
    analytics.events.addToFavorites(movie.id, movie.title);
  }, [isFavorite]);

  const removeFavorite = useCallback((id: number) => {
    const movie = state.favorites.find((f) => f.id === id);
    const updated = removeFavoriteUseCase.execute(id);
    dispatch({ type: 'SET_FAVORITES', payload: updated });
    if (movie) analytics.events.removeFromFavorites(id, movie.title);
  }, [state.favorites]);

  const toggleFavorite = useCallback((movie: Movie) => {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

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
      default:            return sorted;
    }
  }, [state.favorites, state.sortOption]);

  const value = useMemo<FavoritesContextValue>(() => ({
    favorites:      state.favorites,
    sortOption:     state.sortOption,
    sortedFavorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    setSortOption,
    totalFavorites: state.favorites.length,
  }), [state, sortedFavorites, isFavorite, addFavorite, removeFavorite, toggleFavorite, setSortOption]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
}
