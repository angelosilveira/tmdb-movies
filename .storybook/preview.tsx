import type { Preview } from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FavoritesProvider } from '../src/app/contexts/FavoritesContext';
import '../src/index.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0F172A' },
        { name: 'card', value: '#1E293B' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <FavoritesProvider>
            <div className="p-6">
              <Story />
            </div>
          </FavoritesProvider>
        </QueryClientProvider>
      </MemoryRouter>
    ),
  ],
};

export default preview;
