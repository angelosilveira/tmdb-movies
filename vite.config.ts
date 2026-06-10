import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import path from 'path';

export default defineConfig(({ mode }) => {
  // ─── loadEnv carrega o .env no contexto do vite.config ──────────────────
  // process.env NÃO tem variáveis VITE_* — só o bundle do browser as recebe.
  // loadEnv lê o arquivo .env e retorna um objeto com todas as variáveis,
  // incluindo as VITE_*. O terceiro argumento '' inclui variáveis sem prefixo.
  const env = loadEnv(mode, process.cwd(), '');

  const readToken = env.VITE_TMDB_READ_TOKEN;

  return {
    plugins: [
      react(),
      sentryVitePlugin({
        org:       process.env.SENTRY_ORG,
        project:   process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        silent:    true,
        disable:   !process.env.SENTRY_AUTH_TOKEN,
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      sourcemap: true,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react':  ['react', 'react-dom', 'react-router-dom'],
            'vendor-query':  ['@tanstack/react-query', '@tanstack/react-query-devtools'],
            'vendor-sentry': ['@sentry/react'],
            'vendor-axios':  ['axios'],
          },
        },
      },
    },
    server: {
      port: 3000,
      proxy: {
        // ───────────────────────────────────────────────────────────────────
        // PROXY DE DESENVOLVIMENTO
        //
        // Fluxo:
        //   Browser → GET /api/tmdb/movie/popular (mesma origem → sem CORS)
        //   → Vite proxy reescreve para https://api.themoviedb.org/3/movie/popular
        //   → Injeta Authorization: Bearer via proxyReq (Node.js, não browser)
        //   → Resposta chega ao browser sem CORS
        //
        // Por que o token vem de loadEnv e não de process.env:
        //   Vite não expõe VITE_* em process.env no vite.config.ts.
        //   loadEnv lê o .env diretamente e retorna o objeto com os valores.
        // ───────────────────────────────────────────────────────────────────
        '/api/tmdb': {
          target:       'https://api.themoviedb.org/3',
          changeOrigin: true,
          rewrite:      (reqPath) => reqPath.replace(/^\/api\/tmdb/, ''),
          configure:    (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (readToken) {
                proxyReq.setHeader('Authorization', `Bearer ${readToken}`);
              } else {
                console.warn(
                  '[Vite Proxy] ⚠️  VITE_TMDB_READ_TOKEN não encontrado no .env — requisição irá falhar com 401.',
                );
              }
            });
          },
        },
      },
    },
  };
});
