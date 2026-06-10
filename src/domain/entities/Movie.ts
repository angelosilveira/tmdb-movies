// ─────────────────────────────────────────────────────────────────────────────
// DOMAIN ENTITY: Movie
//
// SOLID aplicado:
//   SRP — representa apenas o conceito de Filme no domínio.
//   OCP — extensível via herança (MovieDetails extends Movie) sem modificar esta classe.
//   LSP — subclasses (MovieDetails) substituem Movie sem quebrar contratos.
//
// Clean Architecture:
//   Camada mais interna — zero dependências externas (sem React, Axios, etc).
//   Toda regra de negócio derivada do filme vive aqui.
// ─────────────────────────────────────────────────────────────────────────────

export type RatingLevel = 'excellent' | 'good' | 'average';

export interface MovieProps {
  id: number;
  title: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string;
  releaseYear: number | null;
  rating: number;
  ratingFormatted: string;
  ratingLevel: RatingLevel;
  voteCount: number;
  genreIds: number[];
  popularity: number;
  isAdult: boolean;
  originalLanguage: string;
  originalTitle: string;
}

export class Movie {
  readonly id: number;
  readonly title: string;
  readonly overview: string;
  readonly posterUrl: string | null;
  readonly backdropUrl: string | null;
  readonly releaseDate: string;
  readonly releaseYear: number | null;
  readonly rating: number;
  readonly ratingFormatted: string;
  readonly ratingLevel: RatingLevel;
  readonly voteCount: number;
  readonly genreIds: number[];
  readonly popularity: number;
  readonly isAdult: boolean;
  readonly originalLanguage: string;
  readonly originalTitle: string;

  constructor(props: MovieProps) {
    this.id              = props.id;
    this.title           = props.title;
    this.overview        = props.overview;
    this.posterUrl       = props.posterUrl;
    this.backdropUrl     = props.backdropUrl;
    this.releaseDate     = props.releaseDate;
    this.releaseYear     = props.releaseYear;
    this.rating          = props.rating;
    this.ratingFormatted = props.ratingFormatted;
    this.ratingLevel     = props.ratingLevel;
    this.voteCount       = props.voteCount;
    this.genreIds        = props.genreIds;
    this.popularity      = props.popularity;
    this.isAdult         = props.isAdult;
    this.originalLanguage = props.originalLanguage;
    this.originalTitle   = props.originalTitle;
  }

  // ─── Domain business rules ──────────────────────────────────────────────

  /** Filme é bem avaliado se nota >= 7.5 */
  isHighlyRated(): boolean {
    return this.rating >= 7.5;
  }

  /** Filme é recente se lançado nos últimos 2 anos */
  isRecent(): boolean {
    if (!this.releaseYear) return false;
    return new Date().getFullYear() - this.releaseYear <= 2;
  }

  /** Verifica se pertence a um gênero */
  belongsToGenre(genreId: number): boolean {
    return this.genreIds.includes(genreId);
  }

  toPlainObject(): MovieProps {
    return {
      id:               this.id,
      title:            this.title,
      overview:         this.overview,
      posterUrl:        this.posterUrl,
      backdropUrl:      this.backdropUrl,
      releaseDate:      this.releaseDate,
      releaseYear:      this.releaseYear,
      rating:           this.rating,
      ratingFormatted:  this.ratingFormatted,
      ratingLevel:      this.ratingLevel,
      voteCount:        this.voteCount,
      genreIds:         this.genreIds,
      popularity:       this.popularity,
      isAdult:          this.isAdult,
      originalLanguage: this.originalLanguage,
      originalTitle:    this.originalTitle,
    };
  }
}
