import { TmdbMovieRepository }               from '@/infrastructure/repositories/TmdbMovieRepository';
import { LocalStorageFavoritesRepository }   from '@/infrastructure/repositories/LocalStorageFavoritesRepository';
import { GetPopularMoviesUseCase }           from '@/domain/use-cases/GetPopularMoviesUseCase';
import { SearchMoviesUseCase }               from '@/domain/use-cases/SearchMoviesUseCase';
import { GetMovieDetailsUseCase }            from '@/domain/use-cases/GetMovieDetailsUseCase';
import { GetMoviesByGenreUseCase }           from '@/domain/use-cases/GetMoviesByGenreUseCase';
import {
  ToggleFavoriteUseCase,
  GetFavoritesUseCase,
  IsFavoriteUseCase,
  RemoveFavoriteUseCase,
} from '@/domain/use-cases/FavoritesUseCases';

const movieRepository     = new TmdbMovieRepository();
const favoritesRepository = new LocalStorageFavoritesRepository();

export const getPopularMoviesUseCase  = new GetPopularMoviesUseCase(movieRepository);
export const getMoviesByGenreUseCase  = new GetMoviesByGenreUseCase(movieRepository);
export const searchMoviesUseCase      = new SearchMoviesUseCase(movieRepository);
export const getMovieDetailsUseCase   = new GetMovieDetailsUseCase(movieRepository);
export const toggleFavoriteUseCase    = new ToggleFavoriteUseCase(favoritesRepository);
export const getFavoritesUseCase      = new GetFavoritesUseCase(favoritesRepository);
export const isFavoriteUseCase        = new IsFavoriteUseCase(favoritesRepository);
export const removeFavoriteUseCase    = new RemoveFavoriteUseCase(favoritesRepository);

export { favoritesRepository };
