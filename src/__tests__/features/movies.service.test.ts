// ─────────────────────────────────────────────────────────────────────────────
// Test: TmdbMovieRepository
// Clean Architecture: testamos a implementação do repositório de infraestrutura
// mockando o apiClient (dependência externa), não o domínio.
// ─────────────────────────────────────────────────────────────────────────────

import { TmdbMovieRepository } from '@/infrastructure/repositories/TmdbMovieRepository';
import { apiClient } from '@/infrastructure/api/client';

// Mock apenas o cliente HTTP — o repositório e adaptadores são testados de verdade
jest.mock('@/infrastructure/api/client', () => ({
  apiClient: { get: jest.fn() },
}));

const mockGet = apiClient.get as jest.Mock;

const rawMoviePage = {
  page: 1,
  results: [{
    id: 550, title: 'Fight Club', overview: 'An insomniac...',
    poster_path: '/poster.jpg', backdrop_path: '/backdrop.jpg',
    release_date: '1999-10-15', vote_average: 8.4, vote_count: 26000,
    genre_ids: [18], popularity: 61.0, adult: false,
    original_language: 'en', original_title: 'Fight Club', video: false,
  }],
  total_pages: 5,
  total_results: 100,
};

describe('TmdbMovieRepository', () => {
  let repo: TmdbMovieRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new TmdbMovieRepository();
  });

  describe('getPopular', () => {
    it('calls /movie/popular with page param', async () => {
      mockGet.mockResolvedValue({ data: rawMoviePage });
      await repo.getPopular(2);
      expect(mockGet).toHaveBeenCalledWith('/movie/popular', { params: { page: 2 } });
    });

    it('returns Movie domain entities (no snake_case)', async () => {
      mockGet.mockResolvedValue({ data: rawMoviePage });
      const result = await repo.getPopular(1);

      expect(result.items[0].posterUrl).toContain('/poster.jpg');
      expect(result.items[0].rating).toBe(8.4);
      expect(result.items[0].ratingFormatted).toBe('8.4');
      expect(result.items[0].ratingLevel).toBe('excellent');
      expect(result.items[0].releaseYear).toBe(1999);
      expect(result.hasNextPage).toBe(true);

      // Raw API fields must NOT exist on domain entity
      expect((result.items[0] as Record<string, unknown>)['vote_average']).toBeUndefined();
      expect((result.items[0] as Record<string, unknown>)['poster_path']).toBeUndefined();
    });

    it('maps pagination fields to domain names', async () => {
      mockGet.mockResolvedValue({ data: rawMoviePage });
      const result = await repo.getPopular(1);
      expect(result.totalPages).toBe(5);
      expect(result.totalResults).toBe(100);
      expect(result.items).toHaveLength(1);
      expect((result as Record<string, unknown>)['results']).toBeUndefined();
    });

    it('returns Movie class instances with domain methods', async () => {
      mockGet.mockResolvedValue({ data: rawMoviePage });
      const result = await repo.getPopular(1);
      expect(typeof result.items[0].isHighlyRated).toBe('function');
      expect(result.items[0].isHighlyRated()).toBe(true);
    });
  });

  describe('search', () => {
    it('calls /search/movie with query, page and include_adult=false', async () => {
      mockGet.mockResolvedValue({ data: { ...rawMoviePage, results: [] } });
      await repo.search('batman', 1);
      expect(mockGet).toHaveBeenCalledWith('/search/movie', {
        params: { query: 'batman', page: 1, include_adult: false },
      });
    });
  });

  describe('getById', () => {
    it('calls /movie/:id and returns MovieDetails instance', async () => {
      const rawDetails = {
        ...rawMoviePage.results[0],
        genres: [{ id: 18, name: 'Drama' }],
        runtime: 139, status: 'Released', tagline: 'Mischief.',
        budget: 63000000, revenue: 101000000, homepage: null,
        imdb_id: 'tt0137523', production_companies: [],
        production_countries: [], spoken_languages: [],
        belongs_to_collection: null,
      };
      mockGet.mockResolvedValue({ data: rawDetails });
      const result = await repo.getById(550);

      expect(mockGet).toHaveBeenCalledWith('/movie/550');
      expect(result.imdbId).toBe('tt0137523');
      expect(result.runtimeFormatted).toBe('2h 19min');
      expect(typeof result.isProfitable).toBe('function');
      expect((result as Record<string, unknown>)['imdb_id']).toBeUndefined();
    });
  });
});
