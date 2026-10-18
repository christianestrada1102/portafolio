// GET /api/status — public endpoint consumed by the LiveSky frontend.
// Reads from Upstash Redis. If the key is missing (TTL expired) → offline.
// Cache: s-maxage=10, stale-while-revalidate=30

const TZ          = 'America/Chihuahua';
const GITHUB_USER = 'christianestrada1102';

// In-memory GitHub cache (lives for the function instance lifetime)
let ghCache = { data: null, fetchedAt: 0 };

async function redisGet(key) {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const res   = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Redis GET failed: ${res.status}`);
  const { result } = await res.json();
  return result ? JSON.parse(result) : null;
}

async function fetchGitHub() {
  const now = Date.now();
  if (ghCache.data && now - ghCache.fetchedAt < 5 * 60 * 1000) return ghCache.data;

  try {
    const headers = { 'User-Agent': 'live-sky/1.0' };
    if (process.env.GITHUB_TOKEN) headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;

    const res    = await fetch(`https://api.github.com/users/${GITHUB_USER}/events?per_page=30`, { headers });
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const events = await res.json();

    const pushes    = events.filter(e => e.type === 'PushEvent');
    const lastPush  = pushes[0] ?? null;
    const lastCommit = lastPush
      ? { repo: lastPush.repo.name.split('/')[1], agoMs: Date.now() - new Date(lastPush.created_at).getTime() }
      : null;

    const todayStr  = new Date().toLocaleDateString('en-CA', { timeZone: TZ });
    const todayRepos = [...new Set(
      pushes
        .filter(e => new Date(e.created_at).toLocaleDateString('en-CA', { timeZone: TZ }) === todayStr)
        .map(e => e.repo.name.split('/')[1])
    )];

    ghCache = { data: { lastCommit, todayRepos }, fetchedAt: now };
    return ghCache.data;
  } catch (err) {
    console.error('GitHub fetch error:', err.message);
    return ghCache.data ?? { lastCommit: null, todayRepos: [] };
  }
}

function fmtAgo(ms, lang) {
  const s = Math.round(ms / 1000);
  if (s < 60)  return lang === 'en' ? `${s}s ago`      : `hace ${s}s`;
  const m = Math.round(s / 60);
  if (m < 60)  return lang === 'en' ? `${m} min ago`   : `hace ${m} min`;
  const h = Math.round(m / 60);
  return lang === 'en' ? `${h} h ago` : `hace ${h} h`;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=30');

  const lang = req.query.lang === 'en' ? 'en' : 'es';
  const now  = Date.now();

  // Read from Redis — null means TTL expired → offline
  let payload = null;
  try {
    payload = await redisGet('live_status');
  } catch (err) {
    console.error('Redis read error:', err.message);
  }

  // State: offline if key missing, build if active dev, idle otherwise
  let state = 'offline';
  if (payload) {
    const isBuilding = payload.appClass === 'editor' || payload.appClass === 'terminal' || payload.recentPush;
    state = isBuilding ? 'build' : 'idle';
  }

  const gh         = await fetchGitHub();
  const localTime  = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', timeZone: TZ });
  const syncAgo    = payload?.ts ? Math.round((now - payload.ts) / 1000) : null;

  // Grid cells
  const lastCommitCell = gh.lastCommit
    ? { value: gh.lastCommit.repo, sub: fmtAgo(gh.lastCommit.agoMs, lang) }
    : { value: '—', sub: '—' };

  const songCell = payload?.song?.title
    ? { value: payload.song.title.slice(0, 22), sub: payload.song.artist }
    : state === 'offline'
      ? { value: lang === 'en' ? 'Nothing'  : 'Nada',     sub: lang === 'en' ? 'not playing'   : 'sin reproducir' }
      : { value: lang === 'en' ? 'Paused'   : 'En pausa', sub: '—' };

  const reposCell = gh.todayRepos.length > 0
    ? { value: `${gh.todayRepos.length} ${lang === 'en' ? 'active' : 'activos'}`, sub: gh.todayRepos.slice(0, 2).join(' · ') }
    : { value: '0', sub: '—' };

  const grid = [
    { label: lang === 'en' ? 'LAST COMMIT' : 'ÚLTIMO COMMIT', ...lastCommitCell },
    { label: lang === 'en' ? 'LISTENING'   : 'ESCUCHANDO',    ...songCell },
    { label: lang === 'en' ? 'REPOS TODAY' : 'REPOS HOY',     ...reposCell },
    { label: lang === 'en' ? 'LOCAL TIME'  : 'HORA LOCAL',    value: localTime, sub: 'Chihuahua, MX' },
  ];

  const live = state === 'offline' ? null : {
    hostname: payload.hostname ?? 'linux',
    cpu:      payload.cpu ?? 0,
    ramUsed:  payload.ramUsed ?? 0,
    ramTotal: payload.ramTotal ?? 16,
    uptime:   payload.uptime ?? 0,
    syncAgo,
  };

  return res.status(200).json({ state, grid, live });
}
