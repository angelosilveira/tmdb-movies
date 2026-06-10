// ─────────────────────────────────────────────────────────────────────────────
// movies.service.ts — Mantido como facade para compatibilidade com os testes.
// Em Clean Architecture, os use cases substituem este serviço.
// Os hooks agora consomem diretamente os use cases via container.
// ─────────────────────────────────────────────────────────────────────────────

import { getPopularMoviesUseCase, searchMoviesUseCase, getMovieDetailsUseCase } from '@/app/container';
import { Genre } from '@/domain/entities/MovieDetails';
import { Movie } from '@/domain/entities/Movie';
import { MovieDetails } from '@/domain/entities/MovieDetails';
import { PaginatedResult } from '@/domain/repositories/IMovieRepository';
import { apiClient } from '@/infrastructure/api/client';
import { TmdbGenreListResponse } from '@/infrastructure/api/tmdb.types';
import { adaptGenreList } from '@/infrastructure/adapters/movie.adapter';

export const moviesService = {
  getPopular: (page = 1): Promise<PaginatedResult<Movie>> =>
    getPopularMoviesUseCase.execute({ page }),

  getDetails: (id: number): Promise<MovieDetails> =>
    getMovieDetailsUseCase.execute({ id }),

  search: (query: string, page = 1): Promise<PaginatedResult<Movie>> =>
    searchMoviesUseCase.execute({ query, page }),

  getGenres: async (): Promise<Genre[]> => {
    const { data } = await apiClient.get<TmdbGenreListResponse>('/genre/movie/list');
    return adaptGenreList(data.genres);
  },
};
