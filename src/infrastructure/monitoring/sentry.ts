import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';

const DEFAULT_DSN =
  'https://1be36b5fec0c640a5a01952bfffc831e@o4511539104317440.ingest.us.sentry.io/4511539169460224';

export function initSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN || DEFAULT_DSN;
  const isProd = import.meta.env.MODE === 'production';
  const isDev  = import.meta.env.MODE === 'development';

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,

    integrations: [
      // Sentry v8: reactRouterV6BrowserTracingIntegration
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    tracesSampleRate: isProd ? 0.2 : 1.0,

    tracePropagationTargets: [
      'localhost',
      /^https:\/\/api\.themoviedb\.org/,
    ],

    replaysSessionSampleRate: isProd ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,

    beforeSend(event, hint) {
      if (isDev) console.warn('[Sentry] Evento capturado:', event, hint);

      const error = hint?.originalException;
      if (error instanceof Error) {
        if (error.message?.includes('Extension context invalidated')) return null;
        if (error.message?.includes('ResizeObserver loop'))           return null;
      }
      return event;
    },

    initialScope: {
      tags: { app: 'tmdb-movies', version: '1.0.0' },
    },
  });
}

export { Sentry };
