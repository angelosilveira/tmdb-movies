import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      sentryVitePlugin({
        org:       process.env.SENTRY_ORG,
        project:   process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        silent:    true,
        disable:   !process.env.SENTRY_AUTH_TOKEN,
      }),
    ],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    build: {
      sourcemap: true,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react':  ['react', 'react-dom', 'react-router-dom'],
            'vendor-query':  ['@tanstack/react-query', '@tanstack/react-query-devtools'],
            'vendor-sentry': ['@sentry/react'],
            'vendor-axios':  ['axios'],
          },
        },
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api/tmdb': {
          target:       'https://api.themoviedb.org/3',
          changeOrigin: true,
          rewrite:      (p) => p.replace(/^\/api\/tmdb/, ''),
          configure:    (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              const token = env.VITE_TMDB_READ_TOKEN;
              if (token) proxyReq.setHeader('Authorization', `Bearer ${token}`);
            });
          },
        },
      },
    },
  };
});
