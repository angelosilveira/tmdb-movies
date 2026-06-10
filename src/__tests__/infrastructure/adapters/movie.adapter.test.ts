import {
  adaptMovie,
  adaptMovieDetails,
  adaptPaginatedMovies,
  adaptGenre,
  adaptStoredFavorite,
} from '@/infrastructure/adapters/movie.adapter';
import { TmdbMovie, TmdbMovieDetails, TmdbPaginatedResponse } from '@/infrastructure/api/tmdb.types';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const rawMovie: TmdbMovie = {
  id: 550,
  title: 'Fight Club',
  overview: 'An insomniac office worker forms an underground fight club.',
  poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
  backdrop_path: '/rr7E0NoGKxvbkb89eR1GwfoYjpA.jpg',
  release_date: '1999-10-15',
  vote_average: 8.433,
  vote_count: 26280,
  genre_ids: [18, 53, 35],
  popularity: 61.416,
  adult: false,
  original_language: 'en',
  original_title: 'Fight Club',
  video: false,
};

const rawMovieDetails: TmdbMovieDetails = {
  ...rawMovie,
  genres: [
    { id: 18, name: 'Drama' },
    { id: 53, name: 'Thriller' },
  ],
  runtime: 139,
  status: 'Released',
  tagline: 'Mischief. Mayhem. Soap.',
  budget: 63000000,
  revenue: 101200000,
  homepage: 'http://www.foxmovies.com/movies/fight-club',
  imdb_id: 'tt0137523',
  production_companies: [
    { id: 508, name: 'Regency Enterprises', logo_path: '/7PzJdsLGlR7oW4J0J5Xcd0pHGRg.png', origin_country: 'US' },
  ],
  production_countries: [{ iso_3166_1: 'DE', name: 'Germany' }],
  spoken_languages: [
    { english_name: 'English', iso_639_1: 'en', name: 'English' },
  ],
  belongs_to_collection: null,
};

// ─── adaptMovie ───────────────────────────────────────────────────────────────

describe('adaptMovie', () => {
  it('maps id and title', () => {
    const movie = adaptMovie(rawMovie);
    expect(movie.id).toBe(550);
    expect(movie.title).toBe('Fight Club');
  });

  it('builds posterUrl with correct base URL and size', () => {
    const movie = adaptMovie(rawMovie);
    expect(movie.posterUrl).toBe(
      'https://image.tmdb.org/t/p/w300/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    );
  });

  it('builds backdropUrl with correct base URL and size', () => {
    const movie = adaptMovie(rawMovie);
    expect(movie.backdropUrl).toBe(
      'https://image.tmdb.org/t/p/w1280/rr7E0NoGKxvbkb89eR1GwfoYjpA.jpg',
    );
  });

  it('returns null for posterUrl when poster_path is null', () => {
    const movie = adaptMovie({ ...rawMovie, poster_path: null });
    expect(movie.posterUrl).toBeNull();
  });

  it('returns null for backdropUrl when backdrop_path is null', () => {
    const movie = adaptMovie({ ...rawMovie, backdrop_path: null });
    expect(movie.backdropUrl).toBeNull();
  });

  it('formats rating to one decimal place string', () => {
    const movie = adaptMovie(rawMovie);
    expect(movie.ratingFormatted).toBe('8.4');
  });

  it('sets ratingLevel to "excellent" for rating >= 7.5', () => {
    const movie = adaptMovie({ ...rawMovie, vote_average: 8.0 });
    expect(movie.ratingLevel).toBe('excellent');
  });

  it('sets ratingLevel to "good" for rating 6.0–7.4', () => {
    const movie = adaptMovie({ ...rawMovie, vote_average: 6.5 });
    expect(movie.ratingLevel).toBe('good');
  });

  it('sets ratingLevel to "average" for rating < 6.0', () => {
    const movie = adaptMovie({ ...rawMovie, vote_average: 4.0 });
    expect(movie.ratingLevel).toBe('average');
  });

  it('extracts release year from release_date', () => {
    const movie = adaptMovie(rawMovie);
    expect(movie.releaseYear).toBe(1999);
  });

  it('returns null releaseYear for empty release_date', () => {
    const movie = adaptMovie({ ...rawMovie, release_date: '' });
    expect(movie.releaseYear).toBeNull();
  });

  it('maps genreIds from genre_ids', () => {
    const movie = adaptMovie(rawMovie);
    expect(movie.genreIds).toEqual([18, 53, 35]);
  });

  it('maps isAdult from adult', () => {
    const movie = adaptMovie({ ...rawMovie, adult: true });
    expect(movie.isAdult).toBe(true);
  });

  it('uses camelCase fields — no snake_case fields on output', () => {
    const movie = adaptMovie(rawMovie);
    // Domain type must not have raw API fields
    expect((movie as Record<string, unknown>)['vote_average']).toBeUndefined();
    expect((movie as Record<string, unknown>)['poster_path']).toBeUndefined();
    expect((movie as Record<string, unknown>)['backdrop_path']).toBeUndefined();
    expect((movie as Record<string, unknown>)['release_date']).toBeUndefined();
    expect((movie as Record<string, unknown>)['genre_ids']).toBeUndefined();
  });
});

// ─── adaptMovieDetails ────────────────────────────────────────────────────────

describe('adaptMovieDetails', () => {
  it('formats runtime correctly (hours and minutes)', () => {
    const details = adaptMovieDetails(rawMovieDetails);
    expect(details.runtimeFormatted).toBe('2h 19min');
  });

  it('returns null runtimeFormatted for null runtime', () => {
    const details = adaptMovieDetails({ ...rawMovieDetails, runtime: null });
    expect(details.runtimeFormatted).toBeNull();
  });

  it('formats runtime as minutes only when < 1 hour', () => {
    const details = adaptMovieDetails({ ...rawMovieDetails, runtime: 45 });
    expect(details.runtimeFormatted).toBe('45min');
  });

  it('formats runtime as hours only when no remaining minutes', () => {
    const details = adaptMovieDetails({ ...rawMovieDetails, runtime: 120 });
    expect(details.runtimeFormatted).toBe('2h');
  });

  it('adapts genres array', () => {
    const details = adaptMovieDetails(rawMovieDetails);
    expect(details.genres).toHaveLength(2);
    expect(details.genres[0]).toEqual({ id: 18, name: 'Drama' });
  });

  it('converts empty tagline to null', () => {
    const details = adaptMovieDetails({ ...rawMovieDetails, tagline: '' });
    expect(details.tagline).toBeNull();
  });

  it('maps imdbId from imdb_id', () => {
    const details = adaptMovieDetails(rawMovieDetails);
    expect(details.imdbId).toBe('tt0137523');
  });

  it('builds logoUrl for production companies', () => {
    const details = adaptMovieDetails(rawMovieDetails);
    expect(details.productionCompanies[0].logoUrl).toContain(
      '/7PzJdsLGlR7oW4J0J5Xcd0pHGRg.png',
    );
  });

  it('maps spokenLanguages with camelCase fields', () => {
    const details = adaptMovieDetails(rawMovieDetails);
    expect(details.spokenLanguages[0]).toEqual({
      englishName: 'English',
      isoCode: 'en',
      name: 'English',
    });
    expect((details.spokenLanguages[0] as Record<string, unknown>)['iso_639_1']).toBeUndefined();
  });

  it('uses original-size backdrop for details page', () => {
    const details = adaptMovieDetails(rawMovieDetails);
    expect(details.backdropUrl).toContain('/original/');
  });
});

// ─── adaptPaginatedMovies ─────────────────────────────────────────────────────

describe('adaptPaginatedMovies', () => {
  const rawPage: TmdbPaginatedResponse<TmdbMovie> = {
    page: 1,
    results: [rawMovie],
    total_pages: 10,
    total_results: 200,
  };

  it('maps page, totalPages, totalResults', () => {
    const result = adaptPaginatedMovies(rawPage);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(10);
    expect(result.totalResults).toBe(200);
  });

  it('renames results to items', () => {
    const result = adaptPaginatedMovies(rawPage);
    expect(result.items).toHaveLength(1);
    expect((result as Record<string, unknown>)['results']).toBeUndefined();
  });

  it('sets hasNextPage to true when not on last page', () => {
    const result = adaptPaginatedMovies(rawPage);
    expect(result.hasNextPage).toBe(true);
  });

  it('sets hasNextPage to false on last page', () => {
    const result = adaptPaginatedMovies({ ...rawPage, page: 10 });
    expect(result.hasNextPage).toBe(false);
  });

  it('handles empty results array gracefully', () => {
    const result = adaptPaginatedMovies({ ...rawPage, results: [] });
    expect(result.items).toEqual([]);
  });
});

// ─── adaptGenre ───────────────────────────────────────────────────────────────

describe('adaptGenre', () => {
  it('maps id and name', () => {
    expect(adaptGenre({ id: 28, name: 'Ação' })).toEqual({ id: 28, name: 'Ação' });
  });
});

// ─── adaptStoredFavorite ─────────────────────────────────────────────────────

describe('adaptStoredFavorite', () => {
  const validStored = {
    id: 1,
    title: 'Inception',
    overview: 'A dream within a dream.',
    posterUrl: 'https://image.tmdb.org/t/p/w300/poster.jpg',
    backdropUrl: null,
    releaseDate: '2010-07-16',
    releaseYear: 2010,
    rating: 8.4,
    ratingFormatted: '8.4',
    ratingLevel: 'excellent',
    voteCount: 34000,
    genreIds: [28],
    popularity: 89.5,
    isAdult: false,
    originalLanguage: 'en',
    originalTitle: 'Inception',
    addedAt: '2024-01-01T00:00:00.000Z',
  };

  it('returns a valid FavoriteMovie for well-formed stored data', () => {
    const result = adaptStoredFavorite(validStored);
    expect(result).not.toBeNull();
    expect(result?.id).toBe(1);
    expect(result?.title).toBe('Inception');
  });

  it('returns null for null input', () => {
    expect(adaptStoredFavorite(null)).toBeNull();
  });

  it('returns null for non-object input', () => {
    expect(adaptStoredFavorite('invalid')).toBeNull();
    expect(adaptStoredFavorite(42)).toBeNull();
  });

  it('returns null when id is missing', () => {
    const noId = Object.fromEntries(Object.entries(validStored).filter(([k]) => k !== 'id'));
    expect(adaptStoredFavorite(noId)).toBeNull();
  });

  it('returns null when title is missing', () => {
    const noTitle = Object.fromEntries(Object.entries(validStored).filter(([k]) => k !== 'title'));
    expect(adaptStoredFavorite(noTitle)).toBeNull();
  });

  it('handles legacy snake_case stored data (backward compat)', () => {
    const legacyStored = {
      id: 2,
      title: 'The Matrix',
      overview: 'Red pill or blue pill.',
      poster_path: '/matrix.jpg',    // old snake_case field
      backdrop_path: null,
      release_date: '1999-03-31',    // old field
      vote_average: 8.7,             // old field
      vote_count: 22000,
      genre_ids: [28, 878],
      popularity: 70.0,
      adult: false,
      original_language: 'en',
      original_title: 'The Matrix',
      addedAt: '2023-06-01T00:00:00.000Z',
    };

    const result = adaptStoredFavorite(legacyStored);
    expect(result).not.toBeNull();
    expect(result?.title).toBe('The Matrix');
    // Should build posterUrl from old poster_path
    expect(result?.posterUrl).toContain('/matrix.jpg');
    // Should use vote_average as rating
    expect(result?.rating).toBe(8.7);
  });
});
