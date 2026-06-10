// ─────────────────────────────────────────────────────────────────────────────
// USE CASES: Favorites
//
// SOLID — SRP: cada use case tem uma única responsabilidade.
//         DIP: dependem de IFavoritesRepository (abstração), nunca do localStorage.
//         OCP: novos comportamentos de favoritos = novos use cases, sem modificar existentes.
// ─────────────────────────────────────────────────────────────────────────────

import { IFavoritesRepository } from '@/domain/repositories/IMovieRepository';
import { Movie }                from '@/domain/entities/Movie';
import { FavoriteMovie }        from '@/domain/entities/FavoriteMovie';

// ─── Toggle ──────────────────────────────────────────────────────────────────

export interface ToggleFavoriteInput {
  movie: Movie;
}

export interface ToggleFavoriteOutput {
  isFavorite: boolean;
  favorites: FavoriteMovie[];
}

export class ToggleFavoriteUseCase {
  constructor(
    private readonly favoritesRepository: IFavoritesRepository,
  ) {}

  execute(input: ToggleFavoriteInput): ToggleFavoriteOutput {
    const { movie } = input;

    if (this.favoritesRepository.exists(movie.id)) {
      this.favoritesRepository.remove(movie.id);
    } else {
      this.favoritesRepository.add(movie);
    }

    return {
      isFavorite: this.favoritesRepository.exists(movie.id),
      favorites:  this.favoritesRepository.findAll(),
    };
  }
}

// ─── Get All ─────────────────────────────────────────────────────────────────

export class GetFavoritesUseCase {
  constructor(
    private readonly favoritesRepository: IFavoritesRepository,
  ) {}

  execute(): FavoriteMovie[] {
    return this.favoritesRepository.findAll();
  }
}

// ─── Check ───────────────────────────────────────────────────────────────────

export class IsFavoriteUseCase {
  constructor(
    private readonly favoritesRepository: IFavoritesRepository,
  ) {}

  execute(movieId: number): boolean {
    return this.favoritesRepository.exists(movieId);
  }
}

// ─── Remove ──────────────────────────────────────────────────────────────────

export class RemoveFavoriteUseCase {
  constructor(
    private readonly favoritesRepository: IFavoritesRepository,
  ) {}

  execute(movieId: number): FavoriteMovie[] {
    this.favoritesRepository.remove(movieId);
    return this.favoritesRepository.findAll();
  }
}
