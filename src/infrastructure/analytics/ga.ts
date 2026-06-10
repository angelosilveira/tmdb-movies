import ReactGA from 'react-ga4';

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export function initAnalytics(): void {
  if (!MEASUREMENT_ID) {
    console.warn('[Analytics] GA Measurement ID not configured. Set VITE_GA_MEASUREMENT_ID.');
    return;
  }

  ReactGA.initialize(MEASUREMENT_ID, {
    gaOptions: {
      send_page_view: false, // We'll send manually via router
    },
  });
}

export const analytics = {
  pageView: (path: string, title?: string): void => {
    if (!MEASUREMENT_ID) return;
    ReactGA.send({ hitType: 'pageview', page: path, title });
  },

  event: (action: string, params?: Record<string, string | number | boolean>): void => {
    if (!MEASUREMENT_ID) return;
    ReactGA.event(action, params);
  },

  // Specific app events
  events: {
    searchMovie: (query: string) => {
      analytics.event('search', { search_term: query });
    },
    viewMovieDetails: (movieId: number, movieTitle: string) => {
      analytics.event('view_item', { item_id: movieId, item_name: movieTitle });
    },
    addToFavorites: (movieId: number, movieTitle: string) => {
      analytics.event('add_to_wishlist', { item_id: movieId, item_name: movieTitle });
    },
    removeFromFavorites: (movieId: number, movieTitle: string) => {
      analytics.event('remove_from_wishlist', { item_id: movieId, item_name: movieTitle });
    },
  },
};
