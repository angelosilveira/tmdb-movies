import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import path from 'path';

export default defineConfig({
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
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
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
      // ─────────────────────────────────────────────────────────────────────
      // PROXY DE DESENVOLVIMENTO
      //
      // Por quê é necessário:
      //   O header Authorization: Bearer transforma a requisição em
      //   "non-simple" (CORS), disparando um preflight OPTIONS.
      //   A API do TMDB não responde ao preflight quando chamada diretamente
      //   do browser — resultando em CORS error.
      //
      // Como funciona:
      //   Browser → /api/tmdb/* (localhost:3000)
      //     → Vite proxy reescreve para https://api.themoviedb.org/3/*
      //     → Injeta o header Authorization: Bearer no servidor
      //     → A requisição parte do Node.js (servidor), não do browser
      //     → CORS não se aplica — é server-to-server
      //
      // Em produção, o Vercel Rewrites fazem o mesmo papel (vercel.json).
      // ─────────────────────────────────────────────────────────────────────
      '/api/tmdb': {
        target:      'https://api.themoviedb.org/3',
        changeOrigin: true,
        rewrite:     (path) => path.replace(/^\/api\/tmdb/, ''),
        configure:   (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            const token = process.env.VITE_TMDB_READ_TOKEN;
            if (token) {
              proxyReq.setHeader('Authorization', `Bearer ${token}`);
            }
          });
        },
      },
    },
  },
});
