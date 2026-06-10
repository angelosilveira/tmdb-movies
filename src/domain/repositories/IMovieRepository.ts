import { Movie }         from '../entities/Movie';
import { MovieDetails }  from '../entities/MovieDetails';
import { FavoriteMovie } from '../entities/FavoriteMovie';

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalResults: number;
  hasNextPage: boolean;
}

export interface IMovieListRepository {
  getPopular(page: number): Promise<PaginatedResult<Movie>>;
  getByGenre(genreId: number, page: number): Promise<PaginatedResult<Movie>>;
}

export interface IMovieSearchRepository {
  search(query: string, page: number): Promise<PaginatedResult<Movie>>;
}

export interface IMovieDetailRepository {
  getById(id: number): Promise<MovieDetails>;
}

export interface IFavoritesRepository {
  findAll(): FavoriteMovie[];
  add(movie: Movie): FavoriteMovie;
  remove(movieId: number): void;
  exists(movieId: number): boolean;
  clear(): void;
}

export interface IMovieRepository
  extends IMovieListRepository,
    IMovieSearchRepository,
    IMovieDetailRepository {}
