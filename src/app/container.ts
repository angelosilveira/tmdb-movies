// ─────────────────────────────────────────────────────────────────────────────
// COMPOSITION ROOT — Dependency Injection Container
//
// SOLID — DIP: este é o ÚNICO lugar onde implementações concretas são instanciadas.
//              Todo o resto do código depende apenas de abstrações (interfaces).
//
// Clean Architecture: "Composition Root" — orquestra a montagem das camadas
// sem que elas se conheçam diretamente.
//
// PADRÃO: Service Locator simplificado (singleton por módulo).
// Para apps maiores, use inversify ou tsyringe.
// ─────────────────────────────────────────────────────────────────────────────

import { TmdbMovieRepository }               from '@/infrastructure/repositories/TmdbMovieRepository';
import { LocalStorageFavoritesRepository }   from '@/infrastructure/repositories/LocalStorageFavoritesRepository';
import { GetPopularMoviesUseCase }           from '@/domain/use-cases/GetPopularMoviesUseCase';
import { SearchMoviesUseCase }               from '@/domain/use-cases/SearchMoviesUseCase';
import { GetMovieDetailsUseCase }            from '@/domain/use-cases/GetMovieDetailsUseCase';
import {
  ToggleFavoriteUseCase,
  GetFavoritesUseCase,
  IsFavoriteUseCase,
  RemoveFavoriteUseCase,
} from '@/domain/use-cases/FavoritesUseCases';

// ─── Repositories (singletons) ────────────────────────────────────────────────

const movieRepository       = new TmdbMovieRepository();
const favoritesRepository   = new LocalStorageFavoritesRepository();

// ─── Use Cases ────────────────────────────────────────────────────────────────

export const getPopularMoviesUseCase  = new GetPopularMoviesUseCase(movieRepository);
export const searchMoviesUseCase      = new SearchMoviesUseCase(movieRepository);
export const getMovieDetailsUseCase   = new GetMovieDetailsUseCase(movieRepository);
export const toggleFavoriteUseCase    = new ToggleFavoriteUseCase(favoritesRepository);
export const getFavoritesUseCase      = new GetFavoritesUseCase(favoritesRepository);
export const isFavoriteUseCase        = new IsFavoriteUseCase(favoritesRepository);
export const removeFavoriteUseCase    = new RemoveFavoriteUseCase(favoritesRepository);

// ─── Expose repositories for context hydration ───────────────────────────────

export { favoritesRepository };
