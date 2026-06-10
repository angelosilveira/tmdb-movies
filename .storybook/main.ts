import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../src'),
        '@/features': path.resolve(__dirname, '../src/features'),
        '@/shared': path.resolve(__dirname, '../src/shared'),
        '@/infrastructure': path.resolve(__dirname, '../src/infrastructure'),
        '@/design-system': path.resolve(__dirname, '../src/design-system'),
        '@/app': path.resolve(__dirname, '../src/app'),
        '@/assets': path.resolve(__dirname, '../src/assets'),
      };
    }
    return config;
  },
};

export default config;
