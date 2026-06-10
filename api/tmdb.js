export default async function handler(req, res) {
  const path  = req.query.path ? '/' + req.query.path : '/';
  const query = new URLSearchParams();

  for (const [k, v] of Object.entries(req.query)) {
    if (k !== 'path') query.append(k, v);
  }

  const apiKey = process.env.TMDB_API_KEY;
  query.append('api_key', apiKey);
  query.append('language', 'pt-BR');

  const tmdbUrl = `https://api.themoviedb.org/3${path}?${query.toString()}`;

  const response = await fetch(tmdbUrl, {
    headers: { 'Accept': 'application/json' },
  });

  const data = await response.json();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  res.status(response.status).json(data);
}
