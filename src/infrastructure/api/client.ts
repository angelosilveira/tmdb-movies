import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import * as Sentry from '@sentry/react';

// ─────────────────────────────────────────────────────────────────────────────
// A autenticação do TMDB v3 suporta dois métodos:
//   1. api_key como query param  (legado, menos seguro)
//   2. Bearer token no header    (recomendado — oculta a chave da URL/logs)
//
// Usamos o método 2: Authorization: Bearer <VITE_TMDB_READ_TOKEN>
// O token JWT (Read Access Token) é obtido em:
//   https://www.themoviedb.org/settings/api  →  "API Read Access Token"
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL    = import.meta.env.VITE_TMDB_BASE_URL  || 'https://api.themoviedb.org/3';
const READ_TOKEN  = import.meta.env.VITE_TMDB_READ_TOKEN;

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
    baseURL: BASE_URL,
    timeout: 10_000,
    headers: {
      // Bearer token — nunca aparece na URL, não vaza em logs de proxy/CDN
      'Authorization': `Bearer ${READ_TOKEN}`,
      'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
      // Apenas language como query param global — sem api_key na URL
      language: 'pt-BR',
    },
  });

  // ─── Request interceptor ────────────────────────────────────────────────────
  client.interceptors.request.use(
    (config) => config,
    (error) => {
      Sentry.captureException(error);
      return Promise.reject(error);
    },
  );

  // ─── Response interceptor ───────────────────────────────────────────────────
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
