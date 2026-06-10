// ─────────────────────────────────────────────────────────────────────────────
// DOMAIN TYPES — contrato INTERNO da aplicação.
// Esses tipos são usados em toda a UI, hooks, contexts e testes.
// NUNCA importar tipos da API do TMDB diretamente nos componentes.
// Toda conversão passa pelos adapters em src/infrastructure/adapters/.
// ─────────────────────────────────────────────────────────────────────────────

export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterUrl: string | null;       // já resolvido com base URL
  backdropUrl: string | null;     // já resolvido com base URL
  releaseDate: string;            // ISO 8601 "YYYY-MM-DD"
  releaseYear: number | null;
  rating: number;                 // 0–10
  ratingFormatted: string;        // "8.5"
  ratingLevel: RatingLevel;       // 'excellent' | 'good' | 'average'
  voteCount: number;
  genreIds: number[];
  popularity: number;
  isAdult: boolean;
  originalLanguage: string;
  originalTitle: string;
}

export interface MovieDetails extends Omit<Movie, 'genreIds'> {
  genres: Genre[];
  runtime: number | null;
  runtimeFormatted: string | null; // "2h 15min"
  status: string;
  tagline: string | null;
  budget: number;
  revenue: number;
  homepage: string | null;
  imdbId: string | null;
  productionCompanies: ProductionCompany[];
  spokenLanguages: SpokenLanguage[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logoUrl: string | null;         // já resolvido com base URL
  originCountry: string;
}

export interface SpokenLanguage {
  englishName: string;
  isoCode: string;
  name: string;
}

export interface PaginatedResult<T> {
  page: number;
  items: T[];
  totalPages: number;
  totalResults: number;
  hasNextPage: boolean;
}

export type RatingLevel = 'excellent' | 'good' | 'average';
export type SortOption = 'title-asc' | 'title-desc' | 'rating-desc' | 'rating-asc';

export interface FavoriteMovie extends Movie {
  addedAt: string; // ISO 8601
}
