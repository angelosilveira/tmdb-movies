// ─────────────────────────────────────────────────────────────────────────────
// MOVIES SERVICE
//
// Responsabilidade: fazer as chamadas HTTP à API do TMDB e aplicar os adapters.
// Os hooks e componentes recebem apenas tipos de domínio — nunca tipos raw.
// ─────────────────────────────────────────────────────────────────────────────

import { apiClient } from '@/infrastructure/api/client';
import {
  TmdbGenreListResponse,
  TmdbMovie,
  TmdbMovieDetails,
  TmdbPaginatedResponse,
} from '@/infrastructure/api/tmdb.types';
import {
  adaptGenreList,
  adaptMovieDetails,
  adaptPaginatedMovies,
} from '@/infrastructure/adapters';
import { Genre, Movie, MovieDetails, PaginatedResult } from '@/shared/types/movie.types';

export const moviesService = {
  getPopular: async (page = 1): Promise<PaginatedResult<Movie>> => {
    const { data } = await apiClient.get<TmdbPaginatedResponse<TmdbMovie>>('/movie/popular', {
      params: { page },
    });
    return adaptPaginatedMovies(data);
  },

  getDetails: async (id: number): Promise<MovieDetails> => {
    const { data } = await apiClient.get<TmdbMovieDetails>(`/movie/${id}`);
    return adaptMovieDetails(data);
  },

  search: async (query: string, page = 1): Promise<PaginatedResult<Movie>> => {
    const { data } = await apiClient.get<TmdbPaginatedResponse<TmdbMovie>>('/search/movie', {
      params: { query, page, include_adult: false },
    });
    return adaptPaginatedMovies(data);
  },

  getGenres: async (): Promise<Genre[]> => {
    const { data } = await apiClient.get<TmdbGenreListResponse>('/genre/movie/list');
    return adaptGenreList(data.genres);
  },
};
