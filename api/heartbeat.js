// POST /api/heartbeat — receives system telemetry from the Linux daemon.
// Authenticated with Authorization: Bearer <HEARTBEAT_SECRET>.
// Stores in Upstash Redis with a 90s TTL so the key auto-expires → offline state.

const REDIS_TTL = 90; // seconds

async function redisSet(key, value) {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const res   = await fetch(`${url}/set/${encodeURIComponent(key)}/${encodeURIComponent(JSON.stringify(value))}?EX=${REDIS_TTL}`, {
    method:  'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Redis SET failed: ${res.status}`);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Auth
  const auth  = req.headers.authorization ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token || token !== process.env.HEARTBEAT_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const { cpu, ramUsed, ramTotal, uptime, hostname, appClass, song, recentPush } = body;

  // Sanitize — never store raw window titles or project paths
  const payload = {
    cpu:        typeof cpu === 'number'     ? Math.round(cpu)          : null,
    ramUsed:    typeof ramUsed === 'number' ? +ramUsed.toFixed(1)      : null,
    ramTotal:   typeof ramTotal === 'number'? +ramTotal.toFixed(1)     : 16,
    uptime:     typeof uptime === 'number'  ? Math.round(uptime)       : null,
    hostname:   typeof hostname === 'string'? hostname.slice(0, 32)    : 'linux',
    appClass:   ['editor','terminal','browser','other'].includes(appClass) ? appClass : 'other',
    song:       song && typeof song === 'object'
                  ? { title: String(song.title ?? '').slice(0, 80), artist: String(song.artist ?? '').slice(0, 60) }
                  : null,
    recentPush: Boolean(recentPush),
    ts:         Date.now(),
  };

  try {
    await redisSet('live_status', payload);
  } catch (err) {
    console.error('Redis error:', err.message);
    return res.status(500).json({ error: 'Store error' });
  }

  return res.status(200).json({ ok: true });
}
