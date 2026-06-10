/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { FavoritesProvider } from '@/app/contexts/FavoritesContext';

// ─── Domain entity imports (for tests that use domain layer) ──────────────────
import { Movie } from '@/domain/entities/Movie';
import { MovieDetails } from '@/domain/entities/MovieDetails';
import { FavoriteMovie } from '@/domain/entities/FavoriteMovie';
import type { RatingLevel } from '@/domain/entities/Movie';

// ─── Mock factories — return proper domain entity instances ───────────────────

export function createMockMovie(overrides: Partial<ConstructorParameters<typeof Movie>[0]> = {}): Movie {
  const rating = overrides.rating ?? 7.5;
  const ratingLevel: RatingLevel = rating >= 7.5 ? 'excellent' : rating >= 6 ? 'good' : 'average';
  return new Movie({
    id: 1,
    title: 'Test Movie',
    overview: 'A test movie overview.',
    posterUrl: 'https://image.tmdb.org/t/p/w300/test-poster.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/test-backdrop.jpg',
    releaseDate: '2024-01-15',
    releaseYear: 2024,
    rating,
    ratingFormatted: rating.toFixed(1),
    ratingLevel,
    voteCount: 1200,
    genreIds: [28, 12],
    popularity: 100,
    isAdult: false,
    originalLanguage: 'en',
    originalTitle: 'Test Movie',
    ...overrides,
  });
}

export function createMockMovieDetails(
  overrides: Partial<ConstructorParameters<typeof MovieDetails>[0]> = {},
): MovieDetails {
  const base = createMockMovie(overrides);
  return new MovieDetails({
    ...base.toPlainObject(),
    genres: [{ id: 28, name: 'Ação' }, { id: 12, name: 'Aventura' }],
    runtime: 120,
    runtimeFormatted: '2h',
    status: 'Released',
    tagline: 'A great tagline',
    budget: 10_000_000,
    revenue: 50_000_000,
    homepage: null,
    imdbId: 'tt1234567',
    productionCompanies: [],
    spokenLanguages: [{ englishName: 'English', isoCode: 'en', name: 'English' }],
    ...overrides,
  });
}

export function createMockFavoriteMovie(
  overrides: Partial<ConstructorParameters<typeof FavoriteMovie>[0]> = {},
): FavoriteMovie {
  const base = createMockMovie(overrides);
  return new FavoriteMovie({
    ...base.toPlainObject(),
    addedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  });
}

// ─── Test QueryClient ─────────────────────────────────────────────────────────

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

// ─── Render wrapper ───────────────────────────────────────────────────────────

interface WrapperOptions extends RenderOptions {
  routerProps?: MemoryRouterProps;
  queryClient?: QueryClient;
}

function AllProviders({
  children,
  routerProps,
  queryClient,
}: {
  children: React.ReactNode;
  routerProps?: MemoryRouterProps;
  queryClient?: QueryClient;
}) {
  const qc = queryClient ?? createTestQueryClient();
  return (
    <MemoryRouter {...routerProps}>
      <QueryClientProvider client={qc}>
        <FavoritesProvider>{children}</FavoritesProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );
}

export function renderWithProviders(ui: React.ReactElement, options?: WrapperOptions) {
  const { routerProps, queryClient, ...renderOptions } = options ?? {};
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders routerProps={routerProps} queryClient={queryClient}>
        {children}
      </AllProviders>
    ),
    ...renderOptions,
  });
}
