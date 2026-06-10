// ─────────────────────────────────────────────────────────────────────────────
// REPOSITORY INTERFACES
//
// SOLID — DIP: camadas de cima (use-cases) dependem dessas abstrações,
//              nunca das implementações concretas (Axios, localStorage).
//         ISP: cada interface declara apenas o que precisa.
//
// Clean Architecture: a camada de domínio define o CONTRATO.
// A infraestrutura implementa. O domínio nunca importa infraestrutura.
// ─────────────────────────────────────────────────────────────────────────────

import { Movie }         from '../entities/Movie';
import { MovieDetails }  from '../entities/MovieDetails';
import { FavoriteMovie } from '../entities/FavoriteMovie';

// ─── Paginação ────────────────────────────────────────────────────────────────

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalResults: number;
  hasNextPage: boolean;
}

// ─── ISP: cada interface tem responsabilidade única ───────────────────────────

/** Leitura de filmes populares */
export interface IMovieListRepository {
  getPopular(page: number): Promise<PaginatedResult<Movie>>;
}

/** Busca de filmes por termo */
export interface IMovieSearchRepository {
  search(query: string, page: number): Promise<PaginatedResult<Movie>>;
}

/** Leitura de detalhes de um filme */
export interface IMovieDetailRepository {
  getById(id: number): Promise<MovieDetails>;
}

/** Persistência de favoritos */
export interface IFavoritesRepository {
  findAll(): FavoriteMovie[];
  add(movie: Movie): FavoriteMovie;
  remove(movieId: number): void;
  exists(movieId: number): boolean;
  clear(): void;
}

// ─── Composição para uso no serviço de filmes ─────────────────────────────────

export interface IMovieRepository
  extends IMovieListRepository,
    IMovieSearchRepository,
    IMovieDetailRepository {}
