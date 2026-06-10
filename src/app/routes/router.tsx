import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from '@/shared/components/layout/RootLayout';
import { MovieGridSkeleton } from '@/shared/components/ui/Skeleton';
import { ErrorState } from '@/shared/components/ui/ErrorState';

const HomePage = lazy(() =>
  import('@/features/home/pages/HomePage').then((m) => ({ default: m.HomePage })),
);
const MovieDetailsPage = lazy(() =>
  import('@/features/movie-details/pages/MovieDetailsPage').then((m) => ({
    default: m.MovieDetailsPage,
  })),
);
const FavoritesPage = lazy(() =>
  import('@/features/favorites/pages/FavoritesPage').then((m) => ({ default: m.FavoritesPage })),
);
const SearchPage = lazy(() =>
  import('@/features/search/pages/SearchPage').then((m) => ({ default: m.SearchPage })),
);

const PageFallback = () => (
  <div className="pt-4">
    <MovieGridSkeleton count={12} />
  </div>
);

const RouteError = () => (
  <div className="container mx-auto px-4 py-6">
    <ErrorState
      title="Página não encontrada"
      message="A página que você está procurando não existe ou foi removida."
    />
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageFallback />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'movie/:id',
        element: (
          <Suspense fallback={<PageFallback />}>
            <MovieDetailsPage />
          </Suspense>
        ),
      },
      {
        path: 'favorites',
        element: (
          <Suspense fallback={<PageFallback />}>
            <FavoritesPage />
          </Suspense>
        ),
      },
      {
        path: 'search',
        element: (
          <Suspense fallback={<PageFallback />}>
            <SearchPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export const AppRouter: React.FC = () => <RouterProvider router={router} />;
