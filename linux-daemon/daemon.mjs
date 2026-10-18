#!/usr/bin/env node
// live-sky daemon — sends system telemetry to /api/heartbeat every 10 seconds.
// No npm dependencies; uses only Node built-ins and /proc filesystem.
//
// Required env var: HEARTBEAT_SECRET
// Config file:      ./config.json

import { readFileSync } from 'fs';
import { execSync }     from 'child_process';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join }  from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const cfg   = JSON.parse(readFileSync(join(__dir, 'config.json'), 'utf8'));

const SECRET   = process.env.HEARTBEAT_SECRET;
const INTERVAL = 10_000; // ms

if (!SECRET) {
  console.error('[live-sky] HEARTBEAT_SECRET env var is not set. Exiting.');
  process.exit(1);
}

// ── System stats ────────────────────────────────────────────────────────────

let _prevCpu = null;

function readCpu() {
  const line = readFileSync('/proc/stat', 'utf8').split('\n')[0];
  const parts = line.trim().split(/\s+/).slice(1).map(Number);
  // user, nice, system, idle, iowait, irq, softirq, steal
  const idle  = parts[3] + (parts[4] ?? 0);
  const total = parts.reduce((a, b) => a + b, 0);
  return { idle, total };
}

function getCpuPercent() {
  const curr = readCpu();
  if (!_prevCpu) { _prevCpu = curr; return 0; }
  const dIdle  = curr.idle  - _prevCpu.idle;
  const dTotal = curr.total - _prevCpu.total;
  _prevCpu = curr;
  return dTotal > 0 ? Math.round((1 - dIdle / dTotal) * 100) : 0;
}

function getRam() {
  const lines = readFileSync('/proc/meminfo', 'utf8').split('\n');
  const get   = (key) => {
    const line = lines.find(l => l.startsWith(key + ':'));
    return line ? parseInt(line.trim().split(/\s+/)[1], 10) : 0;
  };
  const total     = get('MemTotal')     / 1024 / 1024; // GB
  const available = get('MemAvailable') / 1024 / 1024;
  return { ramUsed: +(total - available).toFixed(2), ramTotal: +total.toFixed(1) };
}

function getUptime() {
  const content = readFileSync('/proc/uptime', 'utf8');
  return Math.round(parseFloat(content.split(' ')[0]));
}

// ── Active window (Hyprland) ────────────────────────────────────────────────

function getAppClass() {
  try {
    const raw  = execSync('hyprctl activewindow -j', { timeout: 1000 }).toString();
    const win  = JSON.parse(raw);
    const cls  = (win.class ?? '').toLowerCase();

    // Match against config map (case-insensitive prefix/exact)
    for (const [key, cat] of Object.entries(cfg.appClassMap)) {
      if (cls === key.toLowerCase() || cls.startsWith(key.toLowerCase())) {
        return cat;
      }
    }
    return 'other';
  } catch {
    return 'other';
  }
}

// ── Git recent push ─────────────────────────────────────────────────────────

function hadRecentPush() {
  try {
    // Check if any public repo had a git push in the last 30 min
    // We look at the active window's cwd via /proc or just check git log in known repos
    const since = Math.floor(Date.now() / 1000) - 30 * 60;
    const out   = execSync(
      `git -C "$HOME" log --all --format="%ct" --since=${since} 2>/dev/null | head -1`,
      { timeout: 2000, shell: true },
    ).toString().trim();
    return out.length > 0;
  } catch {
    return false;
  }
}

// ── Current song (playerctl) ────────────────────────────────────────────────

function getSong() {
  try {
    // Try spotify first, fall back to any playing player
    const players = execSync('playerctl -l 2>/dev/null', { timeout: 800 }).toString().trim().split('\n');
    const preferred = players.find(p => p.startsWith('spotify')) ?? '';
    const flag = preferred ? `-p ${preferred}` : '';

    const status = execSync(`playerctl ${flag} status 2>/dev/null`, { timeout: 800 }).toString().trim();
    if (status !== 'Playing') return null;

    const title  = execSync(`playerctl ${flag} metadata title  2>/dev/null`, { timeout: 800 }).toString().trim();
    const artist = execSync(`playerctl ${flag} metadata artist 2>/dev/null`, { timeout: 800 }).toString().trim();
    return title ? { title, artist } : null;
  } catch {
    return null;
  }
}

// ── Heartbeat ───────────────────────────────────────────────────────────────

async function sendHeartbeat() {
  const cpu        = getCpuPercent();
  const { ramUsed, ramTotal } = getRam();
  const uptime     = getUptime();
  const appClass   = getAppClass();
  const song       = getSong();
  const recentPush = hadRecentPush();

  const payload = {
    cpu,
    ramUsed,
    ramTotal,
    uptime,
    hostname:  cfg.hostname,
    appClass,
    song,
    recentPush,
  };

  try {
    const res = await fetch(cfg.endpoint, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${SECRET}`,
      },
      body:    JSON.stringify(payload),
      signal:  AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.error(`[live-sky] heartbeat failed: ${res.status}`);
    } else {
      const now = new Date().toLocaleTimeString('es-MX', { timeZone: 'America/Chihuahua' });
      console.log(`[live-sky] ${now} — ${appClass} · cpu ${cpu}% · ram ${ramUsed}/${ramTotal}gb · ${song ? song.title : 'no song'}`);
    }
  } catch (err) {
    // Network error — silently skip, retry next cycle
    console.error(`[live-sky] network error: ${err.message}`);
  }
}

// ── Main loop ────────────────────────────────────────────────────────────────

console.log(`[live-sky] starting — endpoint: ${cfg.endpoint}`);
sendHeartbeat();
setInterval(sendHeartbeat, INTERVAL);
