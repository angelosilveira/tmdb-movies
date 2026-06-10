/* eslint-disable react-refresh/only-export-components, @typescript-eslint/no-unused-vars */
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FavoritesProvider, useFavorites } from '@/app/contexts/FavoritesContext';
import { __resetFavorites } from '@/app/container';
import { createMockMovie, createTestQueryClient } from '../../helpers/testUtils';

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = createTestQueryClient();
  return (
    <MemoryRouter>
      <QueryClientProvider client={qc}>
        <FavoritesProvider>{children}</FavoritesProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );
}

describe('FavoritesContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    __resetFavorites();
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);
  });

  it('starts with empty favorites', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    expect(result.current.favorites).toEqual([]);
    expect(result.current.totalFavorites).toBe(0);
  });

  it('adds a movie to favorites', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    const movie = createMockMovie({ id: 1, title: 'Inception' });

    act(() => result.current.addFavorite(movie));

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].title).toBe('Inception');
    expect(result.current.isFavorite(1)).toBe(true);
  });

  it('does not add duplicate favorites', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    const movie = createMockMovie({ id: 1 });

    act(() => result.current.addFavorite(movie));
    act(() => result.current.addFavorite(movie));

    expect(result.current.favorites).toHaveLength(1);
  });

  it('removes a movie from favorites', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    const movie = createMockMovie({ id: 42, title: 'The Dark Knight' });

    act(() => result.current.addFavorite(movie));
    expect(result.current.isFavorite(42)).toBe(true);

    act(() => result.current.removeFavorite(42));
    expect(result.current.isFavorite(42)).toBe(false);
    expect(result.current.favorites).toHaveLength(0);
  });

  it('toggleFavorite adds when not favorited', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    const movie = createMockMovie({ id: 5 });

    act(() => result.current.toggleFavorite(movie));
    expect(result.current.isFavorite(5)).toBe(true);
  });

  it('toggleFavorite removes when already favorited', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    const movie = createMockMovie({ id: 5 });

    act(() => result.current.addFavorite(movie));
    act(() => result.current.toggleFavorite(movie));
    expect(result.current.isFavorite(5)).toBe(false);
  });

  it('calls toggleFavoriteUseCase when adding a favorite', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    const { toggleFavoriteUseCase } = require('@/app/container');
    const movie = createMockMovie({ id: 1 });

    act(() => result.current.addFavorite(movie));

    expect(toggleFavoriteUseCase.execute).toHaveBeenCalledWith({ movie });
  });

  it('sorts favorites by title A-Z', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });

    act(() => {
      result.current.addFavorite(createMockMovie({ id: 1, title: 'Zorro' }));
      result.current.addFavorite(createMockMovie({ id: 2, title: 'Avengers' }));
      result.current.setSortOption('title-asc');
    });

    expect(result.current.sortedFavorites[0].title).toBe('Avengers');
    expect(result.current.sortedFavorites[1].title).toBe('Zorro');
  });

  it('sorts favorites by rating descending', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });

    act(() => {
      result.current.addFavorite(createMockMovie({ id: 1, rating: 6.0 }));
      result.current.addFavorite(createMockMovie({ id: 2, rating: 9.5 }));
      result.current.setSortOption('rating-desc');
    });

    expect(result.current.sortedFavorites[0].rating).toBe(9.5);
    expect(result.current.sortedFavorites[1].rating).toBe(6.0);
  });

  it('throws if used outside FavoritesProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useFavorites())).toThrow(
      'useFavorites must be used within FavoritesProvider',
    );
    consoleError.mockRestore();
  });
});
