export default async function handler(req, res) {
  const { leagueId } = req.query;
  const {
    page_standings = '1',
    page_new_entries = '1',
    phase = '1'
  } = req.query;

  const url = `https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/?page_new_entries=${encodeURIComponent(page_new_entries)}&page_standings=${encodeURIComponent(page_standings)}&phase=${encodeURIComponent(phase)}`;

  try {
    const upstream = await fetch(url, {
      // Node runtime on Vercel exposes fetch globally
      headers: {
        accept: 'application/json',
        'user-agent': 'Mozilla/5.0 (compatible; VercelProxy/1.0)'
      }
    });

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: `Upstream error ${upstream.status}` });
    }

    const data = await upstream.json();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300'); // Cache at the edge
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Proxy failed', detail: String(e) });
  }
}
