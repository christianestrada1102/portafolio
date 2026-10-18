// POST /api/heartbeat — receives system telemetry from the Linux daemon.
// Authenticated with Authorization: Bearer <HEARTBEAT_SECRET>.
// Upserts a single row (id=1) in the Supabase live_status table.

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Auth
  const auth = req.headers.authorization ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token || token !== process.env.HEARTBEAT_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Validate payload
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const {
    cpu,          // number 0-100
    ramUsed,      // number GB
    ramTotal,     // number GB
    uptime,       // number seconds
    hostname,     // string
    appClass,     // 'editor' | 'terminal' | 'browser' | 'other'
    song,         // { title, artist } | null
    recentPush,   // boolean — pushed to git in last 30 min
  } = body;

  // Sanitize: only store what we need, no raw window titles
  const payload = {
    cpu:        typeof cpu === 'number'      ? Math.round(cpu)           : null,
    ramUsed:    typeof ramUsed === 'number'  ? +ramUsed.toFixed(1)       : null,
    ramTotal:   typeof ramTotal === 'number' ? +ramTotal.toFixed(1)      : null,
    uptime:     typeof uptime === 'number'   ? Math.round(uptime)        : null,
    hostname:   typeof hostname === 'string' ? hostname.slice(0, 32)     : 'linux',
    appClass:   ['editor','terminal','browser','other'].includes(appClass) ? appClass : 'other',
    song:       song && typeof song === 'object'
                  ? { title: String(song.title ?? '').slice(0, 80), artist: String(song.artist ?? '').slice(0, 60) }
                  : null,
    recentPush: Boolean(recentPush),
  };

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );

  const { error } = await supabase
    .from('live_status')
    .upsert({ id: 1, payload, updated_at: new Date().toISOString() });

  if (error) {
    console.error('Supabase upsert error:', error.message);
    return res.status(500).json({ error: 'DB error' });
  }

  return res.status(200).json({ ok: true });
}
