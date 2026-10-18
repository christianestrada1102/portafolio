// GET /api/status — public endpoint consumed by the LiveSky frontend.
// Returns the current state (build | idle | offline) plus live stats.
// Cache: s-maxage=10, stale-while-revalidate=30

import { createClient } from '@supabase/supabase-js';

const TZ = 'America/Chihuahua';
const GITHUB_USER = 'christianestrada1102';

// Simple in-memory GitHub cache (lives for the function instance lifetime)
let ghCache = { data: null, fetchedAt: 0 };

async function fetchGitHub() {
  const now = Date.now();
  if (ghCache.data && now - ghCache.fetchedAt < 5 * 60 * 1000) return ghCache.data;

  try {
    const headers = { 'User-Agent': 'live-sky/1.0' };
    if (process.env.GITHUB_TOKEN) headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;

    const res  = await fetch(`https://api.github.com/users/${GITHUB_USER}/events?per_page=30`, { headers });
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const events = await res.json();

    // Last push commit message + repo (public repos only)
    const pushes = events.filter(e => e.type === 'PushEvent');
    const lastPush = pushes[0] ?? null;
    const lastCommit = lastPush
      ? { repo: lastPush.repo.name.split('/')[1], ago: Date.now() - new Date(lastPush.created_at).getTime() }
      : null;

    // Repos with push activity today in Chihuahua timezone
    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: TZ }); // YYYY-MM-DD
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

function fmtAgo(ms, lang = 'es') {
  const s = Math.round(ms / 1000);
  if (s < 60)  return lang === 'en' ? `${s}s ago`        : `hace ${s}s`;
  const m = Math.round(s / 60);
  if (m < 60)  return lang === 'en' ? `${m} min ago`     : `hace ${m} min`;
  const h = Math.round(m / 60);
  return lang === 'en' ? `${h} h ago` : `hace ${h} h`;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=30');

  const lang = (req.query.lang === 'en') ? 'en' : 'es';

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );

  const { data: row, error } = await supabase
    .from('live_status')
    .select('payload, updated_at')
    .eq('id', 1)
    .single();

  const now = Date.now();

  // Determine state
  let state = 'offline';
  let payload = null;

  if (!error && row) {
    const ageSec = (now - new Date(row.updated_at).getTime()) / 1000;
    payload = row.payload;

    if (ageSec <= 90) {
      const isBuilding = payload.appClass === 'editor' || payload.appClass === 'terminal' || payload.recentPush;
      state = isBuilding ? 'build' : 'idle';
    }
  }

  const gh = await fetchGitHub();
  const localTime = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', timeZone: TZ });

  // Build grid cells
  const lastCommitLabel = gh.lastCommit
    ? { value: gh.lastCommit.repo, sub: fmtAgo(now - (now - gh.lastCommit.ago), lang) }
    : { value: '—', sub: '—' };

  // Fix: ago is already ms elapsed, so:
  const lastCommitDisplay = gh.lastCommit
    ? { value: gh.lastCommit.repo, sub: fmtAgo(gh.lastCommit.ago, lang) }
    : { value: '—', sub: '—' };

  const songDisplay = payload?.song?.title
    ? { value: payload.song.title.slice(0, 22), sub: payload.song.artist }
    : state === 'offline'
      ? { value: lang === 'en' ? 'Nothing' : 'Nada', sub: lang === 'en' ? 'not playing' : 'sin reproducir' }
      : { value: lang === 'en' ? 'Paused' : 'En pausa', sub: '—' };

  const reposDisplay = gh.todayRepos.length > 0
    ? { value: `${gh.todayRepos.length} ${lang === 'en' ? 'active' : 'activos'}`, sub: gh.todayRepos.slice(0, 2).join(' · ') }
    : { value: '0', sub: '—' };

  const grid = [
    { label: lang === 'en' ? 'LAST COMMIT'  : 'ÚLTIMO COMMIT', ...lastCommitDisplay },
    { label: lang === 'en' ? 'LISTENING'    : 'ESCUCHANDO',    ...songDisplay },
    { label: lang === 'en' ? 'REPOS TODAY'  : 'REPOS HOY',     ...reposDisplay },
    { label: lang === 'en' ? 'LOCAL TIME'   : 'HORA LOCAL',    value: localTime, sub: 'Chihuahua, MX' },
  ];

  // Live terminal line data
  const live = state === 'offline'
    ? null
    : {
        hostname: payload?.hostname ?? 'linux',
        cpu:      payload?.cpu ?? 0,
        ramUsed:  payload?.ramUsed ?? 0,
        ramTotal: payload?.ramTotal ?? 16,
        uptime:   payload?.uptime ?? 0,
        syncAgo:  row ? Math.round((now - new Date(row.updated_at).getTime()) / 1000) : null,
      };

  return res.status(200).json({ state, grid, live });
}
