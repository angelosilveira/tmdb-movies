// Mock do Composition Root — stateful para testes de integração do Context
import { Movie } from '@/domain/entities/Movie';
import { MovieDetails } from '@/domain/entities/MovieDetails';
import { FavoriteMovie } from '@/domain/entities/FavoriteMovie';
import { PaginatedResult } from '@/domain/repositories/IMovieRepository';

// ─── Stateful favorites store (replicates real behavior for component tests) ──
let _favorites: FavoriteMovie[] = [];

export const favoritesRepository = {
  findAll:         jest.fn(() => [..._favorites]),
  add:             jest.fn((movie: Movie) => {
    const f = FavoriteMovie.fromMovie(movie);
    _favorites = [..._favorites, f];
    return f;
  }),
  remove:          jest.fn((id: number) => { _favorites = _favorites.filter(f => f.id !== id); }),
  exists:          jest.fn((id: number) => _favorites.some(f => f.id === id)),
  clear:           jest.fn(() => { _favorites = []; }),
  invalidateCache: jest.fn(),
};

// Reset store between tests
export const __resetFavorites = () => { _favorites = []; };

// ─── Use Cases (delegate to stateful repo) ────────────────────────────────────
const emptyPage: PaginatedResult<Movie> = {
  items: [], page: 1, totalPages: 0, totalResults: 0, hasNextPage: false,
};

export const getPopularMoviesUseCase  = { execute: jest.fn().mockResolvedValue(emptyPage) };
export const searchMoviesUseCase      = { execute: jest.fn().mockResolvedValue(emptyPage) };
export const getMovieDetailsUseCase   = { execute: jest.fn().mockResolvedValue(null as unknown as MovieDetails) };

export const toggleFavoriteUseCase = {
  execute: jest.fn(({ movie }: { movie: Movie }) => {
    const exists = favoritesRepository.exists(movie.id);
    if (exists) favoritesRepository.remove(movie.id);
    else        favoritesRepository.add(movie);
    return {
      isFavorite: favoritesRepository.exists(movie.id),
      favorites:  favoritesRepository.findAll(),
    };
  }),
};

export const getFavoritesUseCase   = { execute: jest.fn(() => favoritesRepository.findAll()) };
export const isFavoriteUseCase     = { execute: jest.fn((id: number) => favoritesRepository.exists(id)) };
export const removeFavoriteUseCase = {
  execute: jest.fn((id: number) => {
    favoritesRepository.remove(id);
    return favoritesRepository.findAll();
  }),
};
