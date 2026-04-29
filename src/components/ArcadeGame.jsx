import { useEffect, useRef } from 'react';

// ── Canvas dimensions ───────────────────────────────────────────────────────
const W = 400, H = 350;
const GROUND = 264;
const GRAV   = 0.55;
const SPEED  = 2.8;
const JUMP_V = -11;
const FW = 32, FH = 52;

// ── Fighter configs ─────────────────────────────────────────────────────────
const P1C = { color: '#9333EA', glow: '#c084fc', name: 'NAS', rgb: '147,51,234' };
const P2C = { color: '#dc2626', glow: '#f87171', name: 'BUG', rgb: '220,38,38' };

// ── Attack data ─────────────────────────────────────────────────────────────
const DMG = { punch: 8,  kick: 14, special: 22 };
const DUR = { punch: 16, kick: 22, special: 26 };
const ACS = { punch: 5,  kick: 7,  special: 9  }; // active-start frame
const ACE = { punch: 12, kick: 17, special: 21 }; // active-end frame
const RNG = { punch: 58, kick: 65, special: 90 };
const HIT_STUN  = 18;
const BLOCK_MULT = 0.15;
const SPECIAL_CD = 180;
const ROUND_TIME = 60 * 60; // 60 s @ 60 fps

// ── Pre-computed scene data ─────────────────────────────────────────────────
const STARS = Array.from({ length: 44 }, (_, i) => ({
  x: (i * 173.3) % W,
  y: (i * 97.7)  % (GROUND * 0.72),
  r: i % 3 === 0 ? 1.5 : 1,
}));
const BUILDINGS = [
  [0, 140, 45], [42, 160, 38], [78, 115, 52], [128, 145, 42],
  [167, 105, 55], [220, 130, 45], [262, 110, 55], [314, 140, 42], [352, 100, 48],
];
const WINDOWS = [
  [48,168],[56,178],[88,122],[96,136],[140,152],[175,113],[184,128],
  [232,138],[268,118],[276,133],[320,148],[358,108],[366,124],
];

// ── Helpers ─────────────────────────────────────────────────────────────────
function mkFighter(x, facing) {
  return {
    x, y: GROUND - FH,
    vx: 0, vy: 0,
    hp: 100,
    facing,
    state: 'idle',   // idle|walk|punch|kick|special|block|hit|down
    stateTimer: 0,
    onGround: true,
    hitUsed: false,
    sCD: 0,
    aiCD: 60 + Math.floor(Math.random() * 40),
    frame: 0,        // generic animation frame counter
  };
}

function initGame() {
  return {
    phase: 'title',  // title|countdown|fight|roundEnd|gameOver
    p1: mkFighter(70, 1),
    p2: mkFighter(W - 70 - FW, -1),
    p1Wins: 0,
    p2Wins: 0,
    round: 1,
    timer: ROUND_TIME,
    particles: [],
    shakeMag: 0,
    shakeX: 0, shakeY: 0,
    countdownN: 3,
    countdownT: 0,
    roundMsg: '',
    roundT: 0,
    gameOverT: 0,
  };
}

function isAttackActive(f, type) {
  const elapsed = DUR[type] - f.stateTimer;
  return elapsed >= ACS[type] && elapsed <= ACE[type];
}

function spawnParticles(list, x, y, color) {
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    const s = 1.5 + Math.random() * 2.5;
    list.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.8,
      r: 1.5 + Math.random() * 2, color, life: 22, max: 22 });
  }
}

// ── Background (drawn once to offscreen canvas) ─────────────────────────────
function buildBg() {
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');

  // Sky gradient
  const sky = g.createLinearGradient(0, 0, 0, GROUND);
  sky.addColorStop(0, '#040110');
  sky.addColorStop(1, '#110722');
  g.fillStyle = sky; g.fillRect(0, 0, W, GROUND);

  // Stars
  STARS.forEach(s => {
    g.fillStyle = '#ffffff';
    g.beginPath(); g.arc(s.x, s.y, s.r, 0, Math.PI * 2); g.fill();
  });

  // Moon glow
  const mg = g.createRadialGradient(320, 28, 6, 320, 28, 34);
  mg.addColorStop(0, 'rgba(192,132,252,0.4)');
  mg.addColorStop(1, 'rgba(147,51,234,0)');
  g.fillStyle = mg; g.fillRect(286, 0, 68, 64);
  g.fillStyle = '#e9d5ff';
  g.beginPath(); g.arc(320, 28, 9, 0, Math.PI * 2); g.fill();

  // Buildings
  g.fillStyle = '#06030e';
  BUILDINGS.forEach(([bx, by, bw]) => g.fillRect(bx, by, bw, GROUND - by));

  // Neon windows
  g.shadowBlur = 4; g.shadowColor = '#9333EA';
  g.fillStyle = 'rgba(147,51,234,0.7)';
  WINDOWS.forEach(([wx, wy]) => g.fillRect(wx, wy, 4, 3));
  g.shadowBlur = 0;

  // Ground fill
  const grd = g.createLinearGradient(0, GROUND, 0, H);
  grd.addColorStop(0, '#180928'); grd.addColorStop(1, '#0a0612');
  g.fillStyle = grd; g.fillRect(0, GROUND, W, H - GROUND);

  // Ground LED line
  g.shadowColor = '#9333EA'; g.shadowBlur = 10;
  g.strokeStyle = 'rgba(147,51,234,0.9)';
  g.lineWidth = 2;
  g.beginPath(); g.moveTo(0, GROUND); g.lineTo(W, GROUND); g.stroke();
  g.shadowBlur = 0;

  return c;
}

// ── Draw fighter ─────────────────────────────────────────────────────────────
function drawFighter(ctx, f, cfg) {
  const { x, y, facing, state, stateTimer, frame } = f;
  const { color, glow, rgb } = cfg;

  ctx.save();

  // Mirror if facing left
  if (facing < 0) {
    ctx.translate(x * 2 + FW, 0);
    ctx.scale(-1, 1);
  }

  ctx.shadowColor = glow;
  ctx.shadowBlur  = state === 'hit' || state === 'down' ? 0 : 10;
  ctx.fillStyle   = color;

  if (state === 'down') {
    ctx.fillRect(x - 4, y + FH - 14, FW + 8, 10);
    ctx.fillRect(x + 4, y + FH - 26, FW - 8, 12);
    ctx.beginPath(); ctx.arc(x + 8, y + FH - 32, 8, 0, Math.PI * 2); ctx.fill();
    ctx.restore(); return;
  }

  const bob  = state === 'walk' ? Math.sin(frame * 0.28) * 1.5 : 0;
  const lean = state === 'walk' ? Math.sin(frame * 0.28) * 1   : 0;
  const lg   = state === 'walk' ? Math.sin(frame * 0.28) * 5   : 0;

  // Legs
  if (state === 'kick' && isAttackActive(f, 'kick')) {
    ctx.fillRect(x + 6, y + FH - 22, 10, 22);          // plant leg
    ctx.fillRect(x + FW - 4, y + FH - 22, 32, 9);      // kick leg
  } else {
    ctx.fillRect(x + 4,      y + FH - 20 - lg, 10, 20 + lg);
    ctx.fillRect(x + FW - 14, y + FH - 20 + lg, 10, 20 - lg);
  }

  // Body
  ctx.fillRect(x + 4 + lean, y + 22 + bob, FW - 8, 26);

  // Arms
  if (state === 'punch' && isAttackActive(f, 'punch')) {
    ctx.fillRect(x - 2, y + 26, 8, 6);              // back arm
    ctx.fillRect(x + FW - 4, y + 24, 36, 8);        // punch arm
  } else if (state === 'kick') {
    ctx.fillRect(x - 2, y + 24, 8, 6);
    ctx.fillRect(x + FW - 4, y + 30, 10, 6);
  } else if (state === 'special' && isAttackActive(f, 'special')) {
    ctx.fillRect(x + FW - 4, y + 20, 42, 8);
    ctx.fillRect(x + FW - 4, y + 32, 34, 8);
    // energy burst
    const prog = (DUR.special - stateTimer - ACS.special) / (ACE.special - ACS.special);
    ctx.fillStyle = `rgba(${rgb},${Math.max(0, 0.45 - prog * 0.4)})`;
    ctx.beginPath();
    ctx.arc(x + FW + 24, y + FH * 0.38, 8 + prog * 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
  } else if (state === 'block') {
    ctx.fillRect(x + FW - 4, y + 20, 16, 26);
  } else {
    ctx.fillRect(x - 4, y + 26, 10, 6);
    ctx.fillRect(x + FW - 6, y + 26, 10, 6);
  }

  // Head
  const hy = y + 13 + bob + (state === 'hit' ? 3 : 0);
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(x + FW / 2, hy, 11, 0, Math.PI * 2); ctx.fill();

  // Eye
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.88)';
  ctx.beginPath(); ctx.arc(x + FW / 2 + 5, hy - 2, 3, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}

// ── Draw HUD ─────────────────────────────────────────────────────────────────
function drawHUD(ctx, g) {
  const { p1, p2, timer, p1Wins, p2Wins } = g;
  const BAR_W = 156, BAR_H = 11, BAR_Y = 12;

  // Bar backgrounds
  ctx.fillStyle = '#120020';
  ctx.fillRect(8, BAR_Y, BAR_W, BAR_H);
  ctx.fillRect(W - 8 - BAR_W, BAR_Y, BAR_W, BAR_H);

  // P1 bar
  const p1p = Math.max(0, p1.hp / 100);
  ctx.fillStyle = p1p > 0.5 ? '#9333EA' : p1p > 0.25 ? '#f59e0b' : '#ef4444';
  ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 5;
  ctx.fillRect(8, BAR_Y, BAR_W * p1p, BAR_H);

  // P2 bar (fills right to left)
  const p2p = Math.max(0, p2.hp / 100);
  ctx.fillStyle = p2p > 0.5 ? '#dc2626' : p2p > 0.25 ? '#f59e0b' : '#ef4444';
  ctx.shadowColor = ctx.fillStyle;
  ctx.fillRect(W - 8 - BAR_W * p2p, BAR_Y, BAR_W * p2p, BAR_H);
  ctx.shadowBlur = 0;

  // Bar borders
  ctx.strokeStyle = '#3b0070'; ctx.lineWidth = 1;
  ctx.strokeRect(8, BAR_Y, BAR_W, BAR_H);
  ctx.strokeRect(W - 8 - BAR_W, BAR_Y, BAR_W, BAR_H);

  // Names
  ctx.font = 'bold 7px "Press Start 2P", monospace';
  ctx.fillStyle = '#c084fc'; ctx.textAlign = 'left';
  ctx.fillText('NAS', 8, BAR_Y - 2);
  ctx.fillStyle = '#f87171'; ctx.textAlign = 'right';
  ctx.fillText('BUG', W - 8, BAR_Y - 2);

  // Timer
  const secs = Math.ceil(timer / 60);
  ctx.fillStyle = secs <= 10 ? '#ef4444' : '#e2e8f0';
  ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 8;
  ctx.font = 'bold 13px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(String(secs), W / 2, 24);
  ctx.shadowBlur = 0;

  // Win dots
  const DR = 4, DY = 30;
  for (let i = 0; i < 2; i++) {
    ctx.beginPath(); ctx.arc(W / 2 - 14 + i * 12, DY, DR, 0, Math.PI * 2);
    ctx.fillStyle = i < p1Wins ? '#9333EA' : '#2a0a4a'; ctx.fill();
  }
  for (let i = 0; i < 2; i++) {
    ctx.beginPath(); ctx.arc(W / 2 + 14 - i * 12, DY, DR, 0, Math.PI * 2);
    ctx.fillStyle = i < p2Wins ? '#dc2626' : '#2a0a4a'; ctx.fill();
  }
}

// ── Update fighter ────────────────────────────────────────────────────────────
function updateFighter(f, keys, isPlayer, enemy) {
  f.frame++;
  if (f.stateTimer > 0) f.stateTimer--;
  if (f.sCD > 0) f.sCD--;

  // State auto-reset
  if (f.stateTimer === 0) {
    if (['punch','kick','special','hit'].includes(f.state)) { f.state = 'idle'; f.hitUsed = false; }
    if (f.state === 'down') f.state = 'idle';
  }

  const canAct = f.state === 'idle' || f.state === 'walk';

  if (isPlayer) {
    if (canAct) {
      const left  = keys['ArrowLeft'];
      const right = keys['ArrowRight'];
      if (left)       { f.vx = -SPEED; f.state = 'walk'; f.facing = -1; }
      else if (right) { f.vx =  SPEED; f.state = 'walk'; f.facing =  1; }
      else            { f.vx = 0; if (f.state === 'walk') f.state = 'idle'; }

      if (keys['w']) { f.state = 'block'; f.stateTimer = 4; f.vx = 0; }
      if ((keys['ArrowUp'] || keys[' ']) && f.onGround) { f.vy = JUMP_V; f.onGround = false; }
      if (keys['a'])          { f.state = 'punch';   f.stateTimer = DUR.punch;   f.hitUsed = false; f.vx = 0; }
      else if (keys['s'])     { f.state = 'kick';    f.stateTimer = DUR.kick;    f.hitUsed = false; f.vx = 0; }
      else if (keys['d'] && f.sCD === 0) { f.state = 'special'; f.stateTimer = DUR.special; f.hitUsed = false; f.sCD = SPECIAL_CD; f.vx = 0; }
    }
  } else {
    // Basic AI
    f.aiCD--;
    if (f.aiCD <= 0 && canAct) {
      const dist = Math.abs(f.x - enemy.x);
      const r    = Math.random();
      if (dist > 110) {
        f.vx = f.x > enemy.x ? -SPEED : SPEED;
        f.facing = f.x > enemy.x ? -1 : 1;
        f.state = 'walk';
        f.aiCD = 25 + Math.floor(Math.random() * 25);
      } else if (dist < RNG.punch) {
        f.vx = 0;
        if      (r < 0.12 && f.sCD === 0) { f.state = 'special'; f.stateTimer = DUR.special; f.hitUsed = false; f.sCD = SPECIAL_CD; }
        else if (r < 0.45)               { f.state = 'punch';   f.stateTimer = DUR.punch;   f.hitUsed = false; }
        else if (r < 0.70)               { f.state = 'kick';    f.stateTimer = DUR.kick;    f.hitUsed = false; }
        else                             { f.state = 'block';   f.stateTimer = 40; }
        f.aiCD = 50 + Math.floor(Math.random() * 50);
      } else {
        f.vx = f.x > enemy.x ? -SPEED * 0.6 : SPEED * 0.6;
        f.facing = f.x > enemy.x ? -1 : 1;
        f.state = 'walk';
        f.aiCD = 18 + Math.floor(Math.random() * 22);
      }
    }
    if (!['walk','punch','kick','special'].includes(f.state)) f.vx = 0;
  }

  // Physics
  if (!f.onGround) f.vy += GRAV;
  f.y += f.vy;
  if (f.y >= GROUND - FH) { f.y = GROUND - FH; f.vy = 0; f.onGround = true; }
  f.x += f.vx;
  f.x = Math.max(4, Math.min(W - FW - 4, f.x));

  // Always face enemy when idle/walk (AI)
  if (!isPlayer && (f.state === 'idle' || f.state === 'walk')) {
    f.facing = f.x < enemy.x ? 1 : -1;
  }
}

// ── Check attack collision ────────────────────────────────────────────────────
function checkHit(atk, def, atkCfg, defCfg, g) {
  if (atk.hitUsed) return;
  const { state } = atk;
  if (!['punch','kick','special'].includes(state)) return;
  if (!isAttackActive(atk, state)) return;

  // Attack box
  const atkX = atk.facing > 0 ? atk.x + FW : atk.x - RNG[state];
  const atkY = atk.y + FH * 0.2;
  const atkW = RNG[state], atkH = FH * 0.6;

  const overlap = atkX + atkW > def.x && atkX < def.x + FW &&
                  atkY + atkH > def.y && atkY < def.y + FH;
  if (!overlap) return;

  atk.hitUsed = true;
  const blocking = def.state === 'block';
  const dmg = Math.round(DMG[state] * (blocking ? BLOCK_MULT : 1));
  def.hp = Math.max(0, def.hp - dmg);

  if (!blocking) {
    def.state = def.hp <= 0 ? 'down' : 'hit';
    def.stateTimer = def.hp <= 0 ? 90 : HIT_STUN;
    def.vx = 0;
  }

  g.shakeMag = state === 'special' ? 8 : state === 'kick' ? 5 : 3;
  spawnParticles(g.particles, def.x + FW / 2, def.y + FH * 0.4,
    blocking ? '#60a5fa' : atkCfg.glow);
}

// ── Overlay text helper ───────────────────────────────────────────────────────
function centerText(ctx, text, y, size, color, glow) {
  ctx.font = `bold ${size}px "Press Start 2P", monospace`;
  ctx.fillStyle = color;
  ctx.shadowColor = glow || color;
  ctx.shadowBlur = 20;
  ctx.textAlign = 'center';
  ctx.fillText(text, W / 2, y);
  ctx.shadowBlur = 0;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ArcadeGame({ onExit }) {
  const canvasRef = useRef(null);
  const gRef      = useRef(null);
  const keysRef   = useRef({});
  const rafRef    = useRef(null);
  const bgRef     = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    bgRef.current = buildBg();
    gRef.current  = initGame();

    function onKey(e) {
      keysRef.current[e.key] = e.type === 'keydown';
      if (e.type !== 'keydown') return;

      const g = gRef.current;
      if (e.key === 'Escape')  { onExit?.(); return; }
      if (e.key === 'Enter' && g.phase === 'title') {
        g.phase = 'countdown'; g.countdownN = 3; g.countdownT = 180;
      }
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup',   onKey);

    function loop() {
      const g = gRef.current;
      const k = keysRef.current;

      // Screen shake
      if (g.shakeMag > 0.2) {
        g.shakeX = (Math.random() - 0.5) * g.shakeMag;
        g.shakeY = (Math.random() - 0.5) * g.shakeMag;
        g.shakeMag *= 0.78;
      } else { g.shakeX = 0; g.shakeY = 0; g.shakeMag = 0; }

      // Particles
      g.particles = g.particles.filter(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.life--;
        return p.life > 0;
      });

      // ── Phase logic ────────────────────────────────────────────────────────
      if (g.phase === 'countdown') {
        g.countdownT--;
        g.countdownN = Math.max(0, Math.ceil(g.countdownT / 60));
        if (g.countdownT <= 0) g.phase = 'fight';
      }

      if (g.phase === 'fight') {
        g.timer--;
        updateFighter(g.p1, k, true,  g.p2);
        updateFighter(g.p2, k, false, g.p1);
        checkHit(g.p1, g.p2, P1C, P2C, g);
        checkHit(g.p2, g.p1, P2C, P1C, g);

        const p1Down = g.p1.hp <= 0 && g.p1.state === 'down';
        const p2Down = g.p2.hp <= 0 && g.p2.state === 'down';
        const out    = g.timer <= 0;

        if (p2Down || (out && g.p1.hp > g.p2.hp)) { g.p1Wins++; g.roundMsg = 'NAS WINS!'; endRound(g); }
        else if (p1Down || (out && g.p2.hp > g.p1.hp)) { g.p2Wins++; g.roundMsg = 'BUG WINS!'; endRound(g); }
        else if (out) { g.roundMsg = 'DRAW!'; endRound(g); }
      }

      if (g.phase === 'roundEnd') {
        if (--g.roundT <= 0) {
          if (g.p1Wins >= 2 || g.p2Wins >= 2) { g.phase = 'gameOver'; g.gameOverT = 300; }
          else { nextRound(g); }
        }
      }

      if (g.phase === 'gameOver') {
        if (--g.gameOverT <= 0) gRef.current = initGame();
      }

      // ── Draw ───────────────────────────────────────────────────────────────
      ctx.save();
      ctx.translate(g.shakeX, g.shakeY);
      if (bgRef.current) ctx.drawImage(bgRef.current, 0, 0);

      // Particles (behind fighters)
      g.particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.life / p.max;
        ctx.fillStyle   = p.color;
        ctx.shadowColor = p.color; ctx.shadowBlur = 4;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });

      if (g.phase === 'title') {
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.fillRect(0, 0, W, H);
        centerText(ctx, 'CODE',    H / 2 - 44, 22, '#c084fc', '#9333EA');
        centerText(ctx, 'FIGHTER', H / 2 - 14, 22, '#f0abfc', '#9333EA');
        const blink = Math.floor(Date.now() / 500) % 2 === 0;
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillStyle = blink ? '#e2e8f0' : 'rgba(0,0,0,0)';
        ctx.shadowBlur = 0; ctx.textAlign = 'center';
        ctx.fillText('PRESS ENTER TO START', W / 2, H / 2 + 30);
        ctx.font = '5.5px "Press Start 2P", monospace';
        ctx.fillStyle = '#4b5563';
        ctx.fillText('←→ MOVE  A PUNCH  S KICK  D SPECIAL  W BLOCK', W / 2, H - 16);

      } else {
        drawFighter(ctx, g.p1, P1C);
        drawFighter(ctx, g.p2, P2C);
        drawHUD(ctx, g);

        if (g.phase === 'countdown') {
          const label = g.countdownN > 0 ? String(g.countdownN) : 'FIGHT!';
          centerText(ctx, label, H / 2 + 18, g.countdownN > 0 ? 42 : 20, '#ffffff', '#9333EA');
        }

        if (g.phase === 'roundEnd' || g.phase === 'gameOver') {
          ctx.fillStyle = 'rgba(0,0,0,0.52)'; ctx.fillRect(0, 0, W, H);
          const msg = g.phase === 'gameOver'
            ? (g.p1Wins >= 2 ? 'NAS WINS!' : 'BUG WINS!')
            : g.roundMsg;
          centerText(ctx, msg, H / 2, 18, '#f0abfc', '#9333EA');
          if (g.phase === 'gameOver') {
            ctx.font = '6px "Press Start 2P", monospace';
            ctx.fillStyle = '#6b7280'; ctx.shadowBlur = 0;
            ctx.fillText('RESTARTING...', W / 2, H / 2 + 28);
          }
        }
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup',   onKey);
    };
  }, [onExit]);

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      style={{ display: 'block', width: '100%', height: '100%', imageRendering: 'pixelated' }}
    />
  );
}

// ── Round helpers ─────────────────────────────────────────────────────────────
function endRound(g) { g.phase = 'roundEnd'; g.roundT = 140; }
function nextRound(g) {
  g.round++;
  g.p1 = mkFighter(70, 1);
  g.p2 = mkFighter(W - 70 - FW, -1);
  g.timer = ROUND_TIME;
  g.phase = 'countdown'; g.countdownN = 3; g.countdownT = 180;
}
