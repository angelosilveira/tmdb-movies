// ─────────────────────────────────────────────────────────────────────────────
// Vercel Edge Function — TMDB API Proxy
//
// Por quê existe:
//   O header Authorization: Bearer não pode sair do browser diretamente
//   para a API do TMDB sem CORS error (preflight OPTIONS bloqueado).
//   Esta função roda na Edge do Vercel (servidor), injeta o token,
//   e retorna a resposta ao client — sem expor o token no browser.
//
// Rota: /api/tmdb/[...path]
//   /api/tmdb/movie/popular   → https://api.themoviedb.org/3/movie/popular
//   /api/tmdb/search/movie    → https://api.themoviedb.org/3/search/movie
//   /api/tmdb/movie/123       → https://api.themoviedb.org/3/movie/123
// ─────────────────────────────────────────────────────────────────────────────

export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);

  // Remove o prefixo /api/tmdb e constrói a URL real da API
  const tmdbPath    = url.pathname.replace(/^\/api\/tmdb/, '');
  const tmdbUrl     = `https://api.themoviedb.org/3${tmdbPath}${url.search}`;
  const readToken   = process.env.VITE_TMDB_READ_TOKEN;

  if (!readToken) {
    return new Response(
      JSON.stringify({ error: 'VITE_TMDB_READ_TOKEN não configurado.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // Faz a requisição para o TMDB com o Bearer token — server-to-server, sem CORS
  const tmdbResponse = await fetch(tmdbUrl, {
    method:  request.method,
    headers: {
      'Authorization':  `Bearer ${readToken}`,
      'Content-Type':   'application/json;charset=utf-8',
      'Accept':         'application/json',
    },
  });

  const data = await tmdbResponse.json();

  return new Response(JSON.stringify(data), {
    status:  tmdbResponse.status,
    headers: {
      'Content-Type':                'application/json',
      'Cache-Control':               'public, s-maxage=60, stale-while-revalidate=300',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
