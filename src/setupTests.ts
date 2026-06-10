import '@testing-library/jest-dom';

// Mock IntersectionObserver (not available in jsdom)
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: jest.fn((key: string) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock import.meta.env
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_TMDB_API_KEY: 'test-api-key',
    VITE_TMDB_BASE_URL: 'https://api.themoviedb.org/3',
    VITE_TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    VITE_SENTRY_DSN: '',
    VITE_GA_MEASUREMENT_ID: '',
    MODE: 'test',
    DEV: false,
  },
});

// Silence Sentry in tests
jest.mock('@sentry/react', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  withSentryReactRouterV6Routing: (component: unknown) => component,
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => children,
  reactRouterV6BrowserTracingIntegration: jest.fn(),
  replayIntegration: jest.fn(),
}));

// Silence analytics in tests
jest.mock('react-ga4', () => ({
  initialize: jest.fn(),
  send: jest.fn(),
  event: jest.fn(),
}));
