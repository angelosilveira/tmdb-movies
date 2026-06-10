export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);

  const tmdbPath = url.pathname.replace(/^\/api\/tmdb/, '');
  const tmdbUrl  = `https://api.themoviedb.org/3${tmdbPath}${url.search}`;

  // TMDB_READ_TOKEN (sem prefixo VITE_) é a variável server-side.
  // Variáveis VITE_* são injetadas pelo Vite apenas no bundle do browser
  // e NÃO ficam disponíveis em Edge Functions via process.env.
  // Configure TMDB_READ_TOKEN nas Environment Variables da Vercel.
  const readToken = process.env.TMDB_READ_TOKEN;

  if (!readToken) {
    return new Response(
      JSON.stringify({ error: 'TMDB_READ_TOKEN não configurado nas variáveis de ambiente da Vercel.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const tmdbResponse = await fetch(tmdbUrl, {
    method: request.method,
    headers: {
      'Authorization': `Bearer ${readToken}`,
      'Content-Type':  'application/json;charset=utf-8',
      'Accept':        'application/json',
    },
  });

  const data = await tmdbResponse.json();

  return new Response(JSON.stringify(data), {
    status: tmdbResponse.status,
    headers: {
      'Content-Type':                'application/json',
      'Cache-Control':               'public, s-maxage=60, stale-while-revalidate=300',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
