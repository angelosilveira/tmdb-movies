// ─────────────────────────────────────────────────────────────────────────────
// DOMAIN ENTITY: FavoriteMovie
//
// SRP — representa apenas um filme marcado como favorito com metadados de quando foi adicionado.
// ─────────────────────────────────────────────────────────────────────────────

import { Movie, MovieProps } from './Movie';

export interface FavoriteMovieProps extends MovieProps {
  addedAt: string; // ISO 8601
}

export class FavoriteMovie extends Movie {
  readonly addedAt: string;

  constructor(props: FavoriteMovieProps) {
    super(props);
    this.addedAt = props.addedAt;
  }

  static fromMovie(movie: Movie): FavoriteMovie {
    return new FavoriteMovie({
      ...movie.toPlainObject(),
      addedAt: new Date().toISOString(),
    });
  }

  toPlainObject(): FavoriteMovieProps {
    return {
      ...super.toPlainObject(),
      addedAt: this.addedAt,
    };
  }
}
