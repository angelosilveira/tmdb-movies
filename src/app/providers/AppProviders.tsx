import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as Sentry from '@sentry/react';
import { queryClient } from '@/infrastructure/cache/queryClient';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import { ErrorState } from '@/shared/components/ui/ErrorState';

const GlobalErrorFallback = () => (
  <div className="min-h-screen bg-surface-base flex items-center justify-center px-4">
    <ErrorState
      title="Erro crítico da aplicação"
      message="Algo inesperado aconteceu. Por favor, recarregue a página."
      onRetry={() => window.location.reload()}
    />
  </div>
);

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <Sentry.ErrorBoundary fallback={<GlobalErrorFallback />} showDialog={false}>
      <QueryClientProvider client={queryClient}>
        <FavoritesProvider>
          {children}
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </FavoritesProvider>
      </QueryClientProvider>
    </Sentry.ErrorBoundary>
  );
};
