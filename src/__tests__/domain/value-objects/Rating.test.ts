import { Rating } from '@/domain/value-objects/Rating';

describe('Rating Value Object', () => {
  describe('create', () => {
    it('creates a valid rating', () => {
      const r = Rating.create(7.5);
      expect(r.value).toBe(7.5);
    });

    it('throws for value > 10', () => {
      expect(() => Rating.create(10.1)).toThrow();
    });

    it('throws for value < 0', () => {
      expect(() => Rating.create(-1)).toThrow();
    });
  });

  describe('createSafe', () => {
    it('clamps to 10 if above', () => {
      expect(Rating.createSafe(15).value).toBe(10);
    });

    it('clamps to 0 if below', () => {
      expect(Rating.createSafe(-5).value).toBe(0);
    });
  });

  describe('formatted', () => {
    it('formats to one decimal place', () => {
      expect(Rating.create(8.433).formatted).toBe('8.4');
    });
  });

  describe('level', () => {
    it('returns excellent for >= 7.5', () => {
      expect(Rating.create(7.5).level).toBe('excellent');
      expect(Rating.create(9.9).level).toBe('excellent');
    });

    it('returns good for 6.0–7.4', () => {
      expect(Rating.create(6.0).level).toBe('good');
      expect(Rating.create(7.4).level).toBe('good');
    });

    it('returns average for < 6.0', () => {
      expect(Rating.create(5.9).level).toBe('average');
      expect(Rating.create(0).level).toBe('average');
    });
  });

  describe('tailwind colors', () => {
    it('returns correct text color for each level', () => {
      expect(Rating.create(8.0).tailwindTextColor).toBe('text-rating-excellent');
      expect(Rating.create(6.5).tailwindTextColor).toBe('text-rating-good');
      expect(Rating.create(4.0).tailwindTextColor).toBe('text-rating-average');
    });

    it('returns correct bg color for each level', () => {
      expect(Rating.create(8.0).tailwindBgColor).toBe('bg-rating-excellent');
      expect(Rating.create(6.5).tailwindBgColor).toBe('bg-rating-good');
      expect(Rating.create(4.0).tailwindBgColor).toBe('bg-rating-average');
    });
  });

  describe('equals', () => {
    it('is equal when values match', () => {
      expect(Rating.create(7.5).equals(Rating.create(7.5))).toBe(true);
    });

    it('is not equal when values differ', () => {
      expect(Rating.create(7.5).equals(Rating.create(8.0))).toBe(false);
    });
  });
});
