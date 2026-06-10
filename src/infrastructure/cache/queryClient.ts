import { QueryClient } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10,   // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 404 or 401
        if (error instanceof Error && 'status' in error) {
          const status = (error as { status: number }).status;
          if (status === 404 || status === 401) return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        Sentry.captureException(error);
      },
    },
  },
});

// Query key factory - centralized keys for cache management
export const queryKeys = {
  movies: {
    all: ['movies'] as const,
    popular: (page: number) => ['movies', 'popular', page] as const,
    details: (id: number) => ['movies', 'details', id] as const,
    search: (query: string, page: number) => ['movies', 'search', query, page] as const,
    genres: () => ['movies', 'genres'] as const,
  },
} as const;
