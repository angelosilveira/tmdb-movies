import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import * as Sentry from '@sentry/react';

// Mesmo endpoint em dev e prod — sem bifurcação de lógica:
//   Dev:  Vite proxy  /api/tmdb/movie/popular → api.themoviedb.org/3/movie/popular
//   Prod: Vercel fn   /api/tmdb?path=movie/popular → api.themoviedb.org (com Bearer)
const BASE_URL = '/api/tmdb';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: BASE_URL,
    timeout: 10_000,
    params: { language: 'pt-BR' },
  });

  client.interceptors.request.use(
    (config) => {
      // Prod: a Vercel fn recebe ?path=movie/popular&page=1&language=pt-BR
      // Dev:  o Vite proxy usa config.url diretamente (/movie/popular)
      if (import.meta.env.PROD && config.url) {
        const path = config.url.replace(/^\//, ''); // remove leading slash
        config.params = { ...config.params, path };
        config.url = '';
      }
      return config;
    },
    (error) => { Sentry.captureException(error); return Promise.reject(error); },
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      const status  = error.response?.status ?? 0;
      Sentry.captureException(error, { extra: { url: error.config?.url, status } });
      throw new ApiError(status, getErrorMessage(status));
    },
  );

  return client;
}

function getErrorMessage(status: number): string {
  const messages: Record<number, string> = {
    401: 'Token inválido.',
    403: 'Acesso negado.',
    404: 'Conteúdo não encontrado.',
    429: 'Muitas requisições. Tente novamente.',
    500: 'Erro interno do servidor.',
    503: 'Serviço indisponível.',
  };
  return messages[status] ?? 'Ocorreu um erro inesperado.';
}

export const apiClient = createApiClient();
