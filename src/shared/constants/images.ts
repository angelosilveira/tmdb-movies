export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const IMAGE_SIZES = {
  poster: {
    small: 'w154',
    medium: 'w300',
    large: 'w500',
    original: 'original',
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original',
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
  },
} as const;

export function getPosterUrl(path: string | null, size: keyof typeof IMAGE_SIZES.poster = 'medium'): string {
  if (!path) return '/placeholder-poster.svg';
  return `${TMDB_IMAGE_BASE_URL}/${IMAGE_SIZES.poster[size]}${path}`;
}

export function getBackdropUrl(path: string | null, size: keyof typeof IMAGE_SIZES.backdrop = 'large'): string {
  if (!path) return '/placeholder-backdrop.svg';
  return `${TMDB_IMAGE_BASE_URL}/${IMAGE_SIZES.backdrop[size]}${path}`;
}

export const FAVORITES_STORAGE_KEY = 'tmdb_favorites';
export const DEFAULT_PAGE_SIZE = 20;
