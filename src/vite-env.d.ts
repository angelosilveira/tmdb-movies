/// <reference types="vite/client" />

interface ImportMetaEnv {
  // TMDB — token usado apenas no proxy (Vite dev / Vercel Edge)
  // NÃO é exposto ao browser — nunca aparece no bundle final
  readonly VITE_TMDB_READ_TOKEN:     string;
  readonly VITE_TMDB_BASE_URL:       string;
  readonly VITE_TMDB_IMAGE_BASE_URL: string;

  // Observabilidade
  readonly VITE_SENTRY_DSN:          string;
  readonly VITE_GA_MEASUREMENT_ID:   string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
