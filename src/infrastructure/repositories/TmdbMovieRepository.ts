// ─────────────────────────────────────────────────────────────────────────────
// INFRASTRUCTURE: TmdbMovieRepository
//
// SOLID — DIP: implementa IMovieRepository (contrato do domínio).
//         SRP: responsável apenas por buscar dados do TMDB via HTTP.
//         OCP: para trocar de API, cria-se outra implementação sem tocar no domínio.
//
// Clean Architecture: infraestrutura implementa contratos do domínio.
// O domínio nunca sabe que o TMDB existe.
// ─────────────────────────────────────────────────────────────────────────────

import { IMovieRepository, PaginatedResult } from '@/domain/repositories/IMovieRepository';
import { Movie }                             from '@/domain/entities/Movie';
import { MovieDetails }                      from '@/domain/entities/MovieDetails';
import { apiClient }                         from '@/infrastructure/api/client';
import {
  TmdbMovie,
  TmdbMovieDetails,
  TmdbPaginatedResponse,
  TmdbGenreListResponse,
} from '@/infrastructure/api/tmdb.types';
import {
  adaptMovie,
  adaptMovieDetails,
  adaptPaginatedMovies,
} from '@/infrastructure/adapters/movie.adapter';
import { Genre } from '@/domain/entities/MovieDetails';
import { adaptGenreList } from '@/infrastructure/adapters/movie.adapter';

export class TmdbMovieRepository implements IMovieRepository {
  async getPopular(page = 1): Promise<PaginatedResult<Movie>> {
    const { data } = await apiClient.get<TmdbPaginatedResponse<TmdbMovie>>(
      '/movie/popular',
      { params: { page } },
    );
    const result = adaptPaginatedMovies(data);
    return {
      ...result,
      items: result.items.map((p) => new Movie(p)),
    };
  }

  async search(query: string, page = 1): Promise<PaginatedResult<Movie>> {
    const { data } = await apiClient.get<TmdbPaginatedResponse<TmdbMovie>>(
      '/search/movie',
      { params: { query, page, include_adult: false } },
    );
    const result = adaptPaginatedMovies(data);
    return {
      ...result,
      items: result.items.map((p) => new Movie(p)),
    };
  }

  async getById(id: number): Promise<MovieDetails> {
    const { data } = await apiClient.get<TmdbMovieDetails>(`/movie/${id}`);
    return new MovieDetails(adaptMovieDetails(data));
  }

  async getGenres(): Promise<Genre[]> {
    const { data } = await apiClient.get<TmdbGenreListResponse>('/genre/movie/list');
    return adaptGenreList(data.genres);
  }
}
