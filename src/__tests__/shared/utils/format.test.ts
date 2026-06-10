import { formatDate, formatRating, getRatingColor, getRatingBgColor, highlightText, debounce, clsx } from '@/shared/utils/format';

describe('formatDate', () => {
  it('formats a valid ISO date string to pt-BR format', () => {
    const result = formatDate('2024-03-15');
    expect(result).toBe('15 de março de 2024');
  });

  it('returns fallback for empty string', () => {
    expect(formatDate('')).toBe('Data desconhecida');
  });
});

describe('formatRating', () => {
  it('formats rating to one decimal place', () => {
    expect(formatRating(7.5)).toBe('7.5');
    expect(formatRating(8)).toBe('8.0');
    expect(formatRating(6.789)).toBe('6.8');
  });
});

describe('getRatingColor', () => {
  it('returns green class for excellent ratings (>=7.5)', () => {
    expect(getRatingColor(7.5)).toBe('text-rating-excellent');
    expect(getRatingColor(9.0)).toBe('text-rating-excellent');
  });

  it('returns amber class for good ratings (6-7.4)', () => {
    expect(getRatingColor(6.0)).toBe('text-rating-good');
    expect(getRatingColor(7.4)).toBe('text-rating-good');
  });

  it('returns red class for average ratings (<6)', () => {
    expect(getRatingColor(5.9)).toBe('text-rating-average');
    expect(getRatingColor(0)).toBe('text-rating-average');
  });
});

describe('getRatingBgColor', () => {
  it('returns correct background color classes', () => {
    expect(getRatingBgColor(8.0)).toBe('bg-rating-excellent');
    expect(getRatingBgColor(6.5)).toBe('bg-rating-good');
    expect(getRatingBgColor(4.0)).toBe('bg-rating-average');
  });
});

describe('highlightText', () => {
  it('returns a single un-highlighted part when no highlight provided', () => {
    const result = highlightText('Avengers', '');
    expect(result).toEqual([{ text: 'Avengers', highlighted: false }]);
  });

  it('highlights matching text case-insensitively', () => {
    const result = highlightText('The Avengers', 'avengers');
    const highlighted = result.filter((p) => p.highlighted);
    expect(highlighted.length).toBeGreaterThan(0);
    expect(highlighted[0].text.toLowerCase()).toBe('avengers');
  });

  it('handles special regex characters in highlight string', () => {
    expect(() => highlightText('Movie (2024)', '(2024)')).not.toThrow();
  });
});

describe('debounce', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('delays function execution', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('cancels previous call when invoked again within delay', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);

    debounced();
    debounced();
    debounced();

    jest.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('clsx', () => {
  it('joins truthy class names', () => {
    expect(clsx('a', 'b', 'c')).toBe('a b c');
  });

  it('filters falsy values', () => {
    expect(clsx('a', false, undefined, null, 'b')).toBe('a b');
  });

  it('returns empty string for all falsy', () => {
    expect(clsx(false, undefined, null)).toBe('');
  });
});
