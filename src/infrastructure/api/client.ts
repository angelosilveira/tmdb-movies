import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import * as Sentry from '@sentry/react';

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const API_KEY  = import.meta.env.VITE_TMDB_API_KEY;

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
    params: {
      api_key:  API_KEY,
      language: 'pt-BR',
    },
  });

  client.interceptors.request.use(
    (config) => config,
    (error) => { Sentry.captureException(error); return Promise.reject(error); },
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      const status  = error.response?.status ?? 0;
      const message = getErrorMessage(status);
      Sentry.captureException(error, {
        extra: { url: error.config?.url, status, responseData: error.response?.data },
      });
      throw new ApiError(status, message);
    },
  );

  return client;
}

function getErrorMessage(status: number): string {
  const messages: Record<number, string> = {
    401: 'API key inválida. Verifique o VITE_TMDB_API_KEY.',
    403: 'Acesso negado.',
    404: 'Conteúdo não encontrado.',
    429: 'Muitas requisições. Tente novamente.',
    500: 'Erro interno do servidor.',
    503: 'Serviço indisponível.',
  };
  return messages[status] ?? 'Ocorreu um erro inesperado.';
}

export const apiClient = createApiClient();
