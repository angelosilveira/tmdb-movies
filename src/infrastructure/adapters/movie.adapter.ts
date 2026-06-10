// ─────────────────────────────────────────────────────────────────────────────
// MOVIE ADAPTER
//
// Responsabilidade: converter os dados brutos da API do TMDB nos tipos de
// domínio da aplicação. É a única camada que conhece a estrutura da API.
//
// Benefícios:
//   • Se o TMDB renomear "vote_average" para "score", só esse arquivo muda.
//   • Se a estrutura de imagens mudar, só a função de URL é atualizada aqui.
//   • Os componentes React nunca veem campos snake_case ou null inesperados.
//   • Lógica de negócio derivada (ratingLevel, runtimeFormatted) fica centralizada.
// ─────────────────────────────────────────────────────────────────────────────

import {
  TmdbGenre,
  TmdbMovie,
  TmdbMovieDetails,
  TmdbPaginatedResponse,
  TmdbProductionCompany,
  TmdbSpokenLanguage,
} from '@/infrastructure/api/tmdb.types';
import {
  FavoriteMovie,
  Genre,
  Movie,
  MovieDetails,
  PaginatedResult,
  ProductionCompany,
  RatingLevel,
  SpokenLanguage,
} from '@/shared/types/movie.types';

// ─── Image URL helpers ────────────────────────────────────────────────────────

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const IMAGE_SIZES = {
  poster: { sm: 'w154', md: 'w300', lg: 'w500', original: 'original' },
  backdrop: { sm: 'w300', md: 'w780', lg: 'w1280', original: 'original' },
  logo: { sm: 'w45', md: 'w185', lg: 'w300' },
} as const;

function buildPosterUrl(
  path: string | null,
  size: keyof typeof IMAGE_SIZES.poster = 'md',
): string | null {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${IMAGE_SIZES.poster[size]}${path}`;
}

function buildBackdropUrl(
  path: string | null,
  size: keyof typeof IMAGE_SIZES.backdrop = 'lg',
): string | null {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${IMAGE_SIZES.backdrop[size]}${path}`;
}

function buildLogoUrl(
  path: string | null,
  size: keyof typeof IMAGE_SIZES.logo = 'md',
): string | null {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${IMAGE_SIZES.logo[size]}${path}`;
}

// ─── Rating helpers ───────────────────────────────────────────────────────────

function resolveRatingLevel(rating: number): RatingLevel {
  if (rating >= 7.5) return 'excellent';
  if (rating >= 6.0) return 'good';
  return 'average';
}

function formatRating(rating: number): string {
  return rating.toFixed(1);
}

// ─── Runtime helper ───────────────────────────────────────────────────────────

function formatRuntime(minutes: number | null): string | null {
  if (!minutes || minutes <= 0) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

// ─── Release year helper ──────────────────────────────────────────────────────

function extractReleaseYear(dateString: string): number | null {
  if (!dateString) return null;
  const year = parseInt(dateString.substring(0, 4), 10);
  return isNaN(year) ? null : year;
}

// ─── Sub-adapters ─────────────────────────────────────────────────────────────

export function adaptGenre(raw: TmdbGenre): Genre {
  return {
    id: raw.id,
    name: raw.name,
  };
}

export function adaptProductionCompany(raw: TmdbProductionCompany): ProductionCompany {
  return {
    id: raw.id,
    name: raw.name,
    logoUrl: buildLogoUrl(raw.logo_path),
    originCountry: raw.origin_country,
  };
}

export function adaptSpokenLanguage(raw: TmdbSpokenLanguage): SpokenLanguage {
  return {
    englishName: raw.english_name,
    isoCode: raw.iso_639_1,
    name: raw.name,
  };
}

// ─── Main adapters ────────────────────────────────────────────────────────────

export function adaptMovie(raw: TmdbMovie): Movie {
  return {
    id: raw.id,
    title: raw.title,
    overview: raw.overview ?? '',
    posterUrl: buildPosterUrl(raw.poster_path, 'md'),
    backdropUrl: buildBackdropUrl(raw.backdrop_path, 'lg'),
    releaseDate: raw.release_date ?? '',
    releaseYear: extractReleaseYear(raw.release_date),
    rating: raw.vote_average,
    ratingFormatted: formatRating(raw.vote_average),
    ratingLevel: resolveRatingLevel(raw.vote_average),
    voteCount: raw.vote_count,
    genreIds: raw.genre_ids ?? [],
    popularity: raw.popularity,
    isAdult: raw.adult,
    originalLanguage: raw.original_language,
    originalTitle: raw.original_title,
  };
}

export function adaptMovieDetails(raw: TmdbMovieDetails): MovieDetails {
  return {
    id: raw.id,
    title: raw.title,
    overview: raw.overview ?? '',
    posterUrl: buildPosterUrl(raw.poster_path, 'lg'),
    backdropUrl: buildBackdropUrl(raw.backdrop_path, 'original'),
    releaseDate: raw.release_date ?? '',
    releaseYear: extractReleaseYear(raw.release_date),
    rating: raw.vote_average,
    ratingFormatted: formatRating(raw.vote_average),
    ratingLevel: resolveRatingLevel(raw.vote_average),
    voteCount: raw.vote_count,
    popularity: raw.popularity,
    isAdult: raw.adult,
    originalLanguage: raw.original_language,
    originalTitle: raw.original_title,
    genres: (raw.genres ?? []).map(adaptGenre),
    runtime: raw.runtime,
    runtimeFormatted: formatRuntime(raw.runtime),
    status: raw.status ?? '',
    tagline: raw.tagline || null,
    budget: raw.budget,
    revenue: raw.revenue,
    homepage: raw.homepage || null,
    imdbId: raw.imdb_id || null,
    productionCompanies: (raw.production_companies ?? []).map(adaptProductionCompany),
    spokenLanguages: (raw.spoken_languages ?? []).map(adaptSpokenLanguage),
  };
}

export function adaptPaginatedMovies(
  raw: TmdbPaginatedResponse<TmdbMovie>,
): PaginatedResult<Movie> {
  return {
    page: raw.page,
    items: (raw.results ?? []).map(adaptMovie),
    totalPages: raw.total_pages,
    totalResults: raw.total_results,
    hasNextPage: raw.page < raw.total_pages,
  };
}

export function adaptGenreList(genres: TmdbGenre[]): Genre[] {
  return (genres ?? []).map(adaptGenre);
}

// ─── Persistence adapter ──────────────────────────────────────────────────────
// Garante que dados salvos no localStorage em versões antigas continuam
// funcionando mesmo se o domínio mudar (forward/backward compatibility).

export function adaptStoredFavorite(stored: unknown): FavoriteMovie | null {
  if (!stored || typeof stored !== 'object') return null;

  const s = stored as Record<string, unknown>;

  // Campos obrigatórios
  if (typeof s.id !== 'number' || typeof s.title !== 'string') return null;

  // Suporte a registros antigos que ainda usavam snake_case (pre-adapter)
  const posterUrl =
    typeof s.posterUrl === 'string'
      ? s.posterUrl
      : buildPosterUrl(typeof s.poster_path === 'string' ? s.poster_path : null);

  const backdropUrl =
    typeof s.backdropUrl === 'string'
      ? s.backdropUrl
      : buildBackdropUrl(typeof s.backdrop_path === 'string' ? s.backdrop_path : null);

  const rating =
    typeof s.rating === 'number'
      ? s.rating
      : typeof s.vote_average === 'number'
        ? s.vote_average
        : 0;

  return {
    id: s.id as number,
    title: s.title as string,
    overview: typeof s.overview === 'string' ? s.overview : '',
    posterUrl,
    backdropUrl,
    releaseDate: typeof s.releaseDate === 'string' ? s.releaseDate : '',
    releaseYear: typeof s.releaseYear === 'number' ? s.releaseYear : extractReleaseYear(
      typeof s.release_date === 'string' ? s.release_date : '',
    ),
    rating,
    ratingFormatted: formatRating(rating),
    ratingLevel: resolveRatingLevel(rating),
    voteCount: typeof s.voteCount === 'number' ? s.voteCount : 0,
    genreIds: Array.isArray(s.genreIds) ? s.genreIds as number[] : [],
    popularity: typeof s.popularity === 'number' ? s.popularity : 0,
    isAdult: typeof s.isAdult === 'boolean' ? s.isAdult : false,
    originalLanguage: typeof s.originalLanguage === 'string' ? s.originalLanguage : '',
    originalTitle: typeof s.originalTitle === 'string' ? s.originalTitle : s.title as string,
    addedAt: typeof s.addedAt === 'string' ? s.addedAt : new Date().toISOString(),
  };
}
