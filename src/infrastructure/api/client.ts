import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import * as Sentry from '@sentry/react';

// Em dev: Vite proxy /api/tmdb → api.themoviedb.org (evita CORS)
// Em prod: /api/tmdb → Vercel Serverless Function (api/tmdb.js) → TMDB
// Em ambos: mesma origem para o browser, zero CORS
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
  });

  client.interceptors.request.use(
    (config) => {
      // Converte /movie/popular → path=/movie/popular como query param
      // para a Serverless Function em prod; em dev o proxy reescreve a URL
      if (config.url && import.meta.env.PROD) {
        const path = config.url;
        config.url = '';
        config.params = { ...config.params, path };
      }
      return config;
    },
    (error) => { Sentry.captureException(error); return Promise.reject(error); },
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      const status  = error.response?.status ?? 0;
      const message = getErrorMessage(status);
      Sentry.captureException(error, {
        extra: { url: error.config?.url, status },
      });
      throw new ApiError(status, message);
    },
  );

  return client;
}

function getErrorMessage(status: number): string {
  const messages: Record<number, string> = {
    401: 'API key inválida.',
    403: 'Acesso negado.',
    404: 'Conteúdo não encontrado.',
    429: 'Muitas requisições. Tente novamente.',
    500: 'Erro interno do servidor.',
    503: 'Serviço indisponível.',
  };
  return messages[status] ?? 'Ocorreu um erro inesperado.';
}

export const apiClient = createApiClient();
