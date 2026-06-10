import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/infrastructure/cache/queryClient';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import { ErrorState } from '@/shared/components/ui/ErrorState';

// Use typeof check so this works in both Vite (import.meta) and Jest (process.env)
const isDev = typeof process !== 'undefined'
  ? process.env.NODE_ENV === 'development'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  : (import.meta as any).env?.DEV === true;

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
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        {children}
        {isDev && <ReactQueryDevtools initialIsOpen={false} />}
      </FavoritesProvider>
    </QueryClientProvider>
  );
};
