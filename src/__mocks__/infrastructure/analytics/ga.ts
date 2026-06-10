export const initAnalytics = jest.fn();
export const analytics = {
  pageView: jest.fn(),
  event: jest.fn(),
  events: {
    searchMovie: jest.fn(),
    viewMovieDetails: jest.fn(),
    addToFavorites: jest.fn(),
    removeFromFavorites: jest.fn(),
  },
};
