import { Movie } from '@/domain/entities/Movie';
import { FavoriteMovie } from '@/domain/entities/FavoriteMovie';

const baseProps = {
  id: 1,
  title: 'Inception',
  overview: 'A dream within a dream.',
  posterUrl: 'https://image.tmdb.org/t/p/w300/poster.jpg',
  backdropUrl: null,
  releaseDate: '2010-07-16',
  releaseYear: 2010,
  rating: 8.4,
  ratingFormatted: '8.4',
  ratingLevel: 'excellent' as const,
  voteCount: 34000,
  genreIds: [28, 878],
  popularity: 89.5,
  isAdult: false,
  originalLanguage: 'en',
  originalTitle: 'Inception',
};

describe('Movie Entity', () => {
  describe('isHighlyRated', () => {
    it('returns true for rating >= 7.5', () => {
      expect(new Movie({ ...baseProps, rating: 7.5 }).isHighlyRated()).toBe(true);
      expect(new Movie({ ...baseProps, rating: 9.0 }).isHighlyRated()).toBe(true);
    });

    it('returns false for rating < 7.5', () => {
      expect(new Movie({ ...baseProps, rating: 7.4 }).isHighlyRated()).toBe(false);
    });
  });

  describe('isRecent', () => {
    it('returns true for movies released within 2 years', () => {
      const currentYear = new Date().getFullYear();
      const movie = new Movie({ ...baseProps, releaseYear: currentYear - 1 });
      expect(movie.isRecent()).toBe(true);
    });

    it('returns false for old movies', () => {
      expect(new Movie({ ...baseProps, releaseYear: 2010 }).isRecent()).toBe(false);
    });

    it('returns false for null releaseYear', () => {
      expect(new Movie({ ...baseProps, releaseYear: null }).isRecent()).toBe(false);
    });
  });

  describe('belongsToGenre', () => {
    it('returns true when genre is in genreIds', () => {
      expect(new Movie(baseProps).belongsToGenre(28)).toBe(true);
    });

    it('returns false when genre is not in genreIds', () => {
      expect(new Movie(baseProps).belongsToGenre(99)).toBe(false);
    });
  });

  describe('toPlainObject', () => {
    it('returns all properties as plain object', () => {
      const movie = new Movie(baseProps);
      const plain = movie.toPlainObject();
      expect(plain.id).toBe(1);
      expect(plain.title).toBe('Inception');
      expect(plain.rating).toBe(8.4);
    });
  });
});

describe('FavoriteMovie Entity', () => {
  it('creates from Movie with addedAt timestamp', () => {
    const movie = new Movie(baseProps);
    const favorite = FavoriteMovie.fromMovie(movie);
    expect(favorite.id).toBe(1);
    expect(favorite.title).toBe('Inception');
    expect(favorite.addedAt).toBeTruthy();
    expect(new Date(favorite.addedAt).getFullYear()).toBe(new Date().getFullYear());
  });

  it('includes addedAt in toPlainObject', () => {
    const movie = new Movie(baseProps);
    const favorite = FavoriteMovie.fromMovie(movie);
    expect(favorite.toPlainObject().addedAt).toBeTruthy();
  });
});
