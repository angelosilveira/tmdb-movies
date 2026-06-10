import { moviesService } from '@/features/home/services/movies.service';
import { apiClient } from '@/infrastructure/api/client';

jest.mock('@/infrastructure/api/client', () => ({
  apiClient: { get: jest.fn() },
}));

const mockGet = apiClient.get as jest.Mock;

// Raw TMDB fixture — what the API actually returns
const rawMoviePage = {
  page: 1,
  results: [{
    id: 550,
    title: 'Fight Club',
    overview: 'An insomniac...',
    poster_path: '/poster.jpg',
    backdrop_path: '/backdrop.jpg',
    release_date: '1999-10-15',
    vote_average: 8.4,
    vote_count: 26000,
    genre_ids: [18],
    popularity: 61.0,
    adult: false,
    original_language: 'en',
    original_title: 'Fight Club',
    video: false,
  }],
  total_pages: 5,
  total_results: 100,
};

describe('moviesService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getPopular', () => {
    it('calls /movie/popular with correct page param', async () => {
      mockGet.mockResolvedValue({ data: rawMoviePage });
      await moviesService.getPopular(2);
      expect(mockGet).toHaveBeenCalledWith('/movie/popular', { params: { page: 2 } });
    });

    it('returns adapted domain types — no snake_case fields', async () => {
      mockGet.mockResolvedValue({ data: rawMoviePage });
      const result = await moviesService.getPopular();

      // Domain fields
      expect(result.items[0].posterUrl).toContain('/poster.jpg');
      expect(result.items[0].rating).toBe(8.4);
      expect(result.items[0].ratingFormatted).toBe('8.4');
      expect(result.items[0].ratingLevel).toBe('excellent');
      expect(result.items[0].releaseYear).toBe(1999);
      expect(result.hasNextPage).toBe(true);

      // Raw fields must NOT be present
      expect((result.items[0] as Record<string, unknown>)['vote_average']).toBeUndefined();
      expect((result.items[0] as Record<string, unknown>)['poster_path']).toBeUndefined();
      expect((result as Record<string, unknown>)['results']).toBeUndefined();
    });

    it('renames total_pages → totalPages and results → items', async () => {
      mockGet.mockResolvedValue({ data: rawMoviePage });
      const result = await moviesService.getPopular();
      expect(result.totalPages).toBe(5);
      expect(result.totalResults).toBe(100);
      expect(Array.isArray(result.items)).toBe(true);
    });
  });

  describe('getDetails', () => {
    it('calls /movie/:id endpoint', async () => {
      const rawDetails = {
        ...rawMoviePage.results[0],
        genres: [{ id: 18, name: 'Drama' }],
        runtime: 139,
        status: 'Released',
        tagline: 'Mischief.',
        budget: 63000000,
        revenue: 101000000,
        homepage: null,
        imdb_id: 'tt0137523',
        production_companies: [],
        production_countries: [],
        spoken_languages: [],
        belongs_to_collection: null,
      };
      mockGet.mockResolvedValue({ data: rawDetails });

      const result = await moviesService.getDetails(550);

      expect(mockGet).toHaveBeenCalledWith('/movie/550');
      expect(result.imdbId).toBe('tt0137523');       // camelCase
      expect(result.runtimeFormatted).toBe('2h 19min');
      expect((result as Record<string, unknown>)['imdb_id']).toBeUndefined();
    });
  });

  describe('search', () => {
    it('calls /search/movie with query, page and include_adult=false', async () => {
      mockGet.mockResolvedValue({ data: { ...rawMoviePage, results: [] } });
      await moviesService.search('batman', 1);
      expect(mockGet).toHaveBeenCalledWith('/search/movie', {
        params: { query: 'batman', page: 1, include_adult: false },
      });
    });
  });

  describe('getGenres', () => {
    it('returns adapted genre list', async () => {
      mockGet.mockResolvedValue({ data: { genres: [{ id: 28, name: 'Ação' }] } });
      const result = await moviesService.getGenres();
      expect(result).toEqual([{ id: 28, name: 'Ação' }]);
    });
  });
});
