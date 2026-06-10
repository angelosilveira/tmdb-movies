export default async function handler(req, res) {
  const { path = '/', ...params } = req.query;

  const query = new URLSearchParams(params);
  const tmdbUrl = `https://api.themoviedb.org/3/${path}?${query}`;

  const token = process.env.TMDB_READ_TOKEN;

  if (!token) {
    return res.status(500).json({ error: 'TMDB_READ_TOKEN não configurado.' });
  }

  const upstream = await fetch(tmdbUrl, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept':        'application/json',
    },
  });

  const data = await upstream.json();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  res.status(upstream.status).json(data);
}
