import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import * as Sentry from '@sentry/react';

// ─────────────────────────────────────────────────────────────────────────────
// Por que /api/tmdb e não https://api.themoviedb.org/3 diretamente?
//
//   O header Authorization: Bearer é "non-simple" e dispara um preflight
//   OPTIONS. A API do TMDB não inclui Access-Control-Allow-Origin na resposta
//   ao preflight → browser bloqueia com CORS error.
//
//   Solução: o browser chama /api/tmdb (mesma origem → sem CORS).
//   O proxy (Vite em dev, Vercel Edge em prod) injeta o Bearer token
//   e encaminha ao TMDB server-to-server, onde CORS não se aplica.
//
//   Dev:  Vite proxy  (vite.config.ts  → server.proxy)
//   Prod: Vercel Edge (api/tmdb.ts     + vercel.json rewrites)
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = '/api/tmdb';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function createApiClient(): AxiosInstance {
  const client = axios.create({
    // Caminho relativo — sempre mesma origem, nunca CORS
    baseURL: BASE_URL,
    timeout: 10_000,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
      language: 'pt-BR',
    },
  });

  // ─── Request interceptor ─────────────────────────────────────────────────
  client.interceptors.request.use(
    (config) => config,
    (error) => {
      Sentry.captureException(error);
      return Promise.reject(error);
    },
  );

  // ─── Response interceptor ────────────────────────────────────────────────
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      const status  = error.response?.status ?? 0;
      const message = getErrorMessage(status);

      Sentry.captureException(error, {
        extra: {
          url:          error.config?.url,
          method:       error.config?.method,
          status,
          responseData: error.response?.data,
        },
      });

      throw new ApiError(status, message);
    },
  );

  return client;
}

function getErrorMessage(status: number): string {
  const messages: Record<number, string> = {
    401: 'Token de autenticação inválido. Verifique o VITE_TMDB_READ_TOKEN.',
    403: 'Acesso negado. Verifique as permissões do token.',
    404: 'Conteúdo não encontrado.',
    429: 'Muitas requisições. Tente novamente em alguns segundos.',
    500: 'Erro interno do servidor. Tente novamente mais tarde.',
    503: 'Serviço temporariamente indisponível.',
  };
  return messages[status] ?? 'Ocorreu um erro inesperado. Tente novamente.';
}

export const apiClient = createApiClient();
