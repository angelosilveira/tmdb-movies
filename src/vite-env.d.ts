/// <reference types="vite/client" />

interface ImportMetaEnv {
  // TMDB — autenticação via Bearer token (JWT Read Access Token)
  // Obtido em: https://www.themoviedb.org/settings/api → "API Read Access Token"
  readonly VITE_TMDB_READ_TOKEN:    string;
  readonly VITE_TMDB_BASE_URL:      string;
  readonly VITE_TMDB_IMAGE_BASE_URL: string;

  // Observabilidade
  readonly VITE_SENTRY_DSN:         string;
  readonly VITE_GA_MEASUREMENT_ID:  string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
