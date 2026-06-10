import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';

// ─── DSN padrão (hardcoded como fallback, sobrescrito por VITE_SENTRY_DSN no .env) ───
const DEFAULT_DSN =
  'https://1be36b5fec0c640a5a01952bfffc831e@o4511539104317440.ingest.us.sentry.io/4511539169460224';

export function initSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN || DEFAULT_DSN;
  const isProd = import.meta.env.MODE === 'production';
  const isDev = import.meta.env.MODE === 'development';

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,

    integrations: [
      // Rastreamento de performance integrado ao React Router v6
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),

      // Session Replay: grava sessões para reproduzir erros
      Sentry.replayIntegration({
        maskAllText: false,   // não mascarar textos (app pública)
        blockAllMedia: false, // não bloquear mídias
      }),
    ],

    // Tracing: 100% em dev, 20% em prod (evita custo)
    tracesSampleRate: isProd ? 0.2 : 1.0,

    // Propagação de trace apenas para APIs conhecidas
    tracePropagationTargets: [
      'localhost',
      /^https:\/\/api\.themoviedb\.org/,
    ],

    // Session Replay: 10% das sessões normais, 100% quando há erro
    replaysSessionSampleRate: isProd ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,

    // Logs estruturados enviados ao Sentry (console.log capturado)
    enableLogs: true,

    beforeSend(event, hint) {
      // Em dev: loga no console e envia normalmente
      if (isDev) {
        console.warn('[Sentry] Evento capturado:', event, hint);
      }

      // Ignora erros de extensões de browser
      const error = hint?.originalException;
      if (error instanceof Error) {
        if (error.message?.includes('Extension context invalidated')) return null;
        if (error.message?.includes('ResizeObserver loop')) return null;
      }

      return event;
    },

    // Tag global presente em todos os eventos
    initialScope: {
      tags: {
        app: 'tmdb-movies',
        version: '1.0.0',
      },
    },
  });
}

export { Sentry };
