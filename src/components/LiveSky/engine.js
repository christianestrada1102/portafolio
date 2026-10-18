// SkyEngine — canvas skywriting animation engine.
// Ported from docs/skywriting-prototype.html.
// No DOM manipulation; canvas is transparent over the hero photo.

// Cursive single-stroke letter paths. x-height = 1, baseline y = 0, up is negative.
const C = {
  b: { w: 1.0, p: [[.1,-.4],[.5,-1.6],[.55,-2.2],[.35,-2.1],[.3,-1.2],[.3,-.3],[.5,0],[.8,-.45],[.72,-.92],[.55,-.85],[.75,-.8],[1.0,-.85]] },
  u: { w: 1.0, p: [[.15,-.7],[.22,-1],[.15,-.3],[.35,0],[.6,-.45],[.7,-1],[.65,-.3],[.8,0],[1.0,-.35]] },
  i: { w: .7,  p: [[.15,-.5],[.4,-1],[.33,-.35],[.45,-.02],[.7,-.35]] },
  l: { w: .8,  p: [[.1,-.45],[.5,-1.6],[.56,-2.2],[.36,-2.1],[.3,-1.3],[.3,-.35],[.48,0],[.8,-.35]] },
  d: { w: 1.1, p: [[.6,-.88],[.32,-1],[.07,-.6],[.15,-.05],[.45,-.2],[.66,-.9],[.76,-2.2],[.7,-1.1],[.7,-.25],[.85,0],[1.1,-.35]] },
  e: { w: .9,  p: [[.1,-.4],[.55,-.62],[.6,-.95],[.36,-.96],[.15,-.5],[.3,-.04],[.6,0],[.9,-.35]] },
  o: { w: 1.0, p: [[.5,-.95],[.17,-.8],[.1,-.2],[.36,0],[.62,-.4],[.56,-.95],[.45,-.86],[.72,-.8],[1.0,-.86]] },
  f: { w: .8,  p: [[.1,-.45],[.45,-1.7],[.5,-2.2],[.3,-2.1],[.3,-1.2],[.3,0],[.26,1],[.1,1.1],[.2,.5],[.46,-.1],[.8,-.35]] },
  n: { w: 1.0, p: [[.12,-.65],[.25,-1],[.2,0],[.3,-.72],[.52,-1],[.67,-.7],[.6,-.2],[.76,0],[1.0,-.35]] },
};

const CLOUD_FONT = (size) => `900 ${size}px "Nunito","Arial Rounded MT Bold","Trebuchet MS",sans-serif`;

function makePuff() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const pc = c.getContext('2d');
  const gr = pc.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0,    'rgba(255,255,255,0.95)');
  gr.addColorStop(0.35, 'rgba(245,245,250,0.5)');
  gr.addColorStop(1,    'rgba(255,255,255,0)');
  pc.fillStyle = gr;
  pc.fillRect(0, 0, 64, 64);
  return c;
}

function makeCloudPuff() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const cc = c.getContext('2d');
  const g2 = cc.createRadialGradient(28, 26, 0, 32, 32, 32);
  g2.addColorStop(0,    'rgba(255,255,255,1)');
  g2.addColorStop(0.55, 'rgba(240,240,246,0.95)');
  g2.addColorStop(0.8,  'rgba(215,215,226,0.45)');
  g2.addColorStop(1,    'rgba(200,200,215,0)');
  cc.fillStyle = g2;
  cc.fillRect(0, 0, 64, 64);
  return c;
}

function cr(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return [
    .5 * ((2*p1[0]) + (-p0[0]+p2[0])*t + (2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2 + (-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3),
    .5 * ((2*p1[1]) + (-p0[1]+p2[1])*t + (2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2 + (-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3),
  ];
}

function spline(pts, sm, out) {
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 1; k <= 60; k++) {
      const q = cr(p0, p1, p2, p3, k / 60);
      out.push({ x: q[0], y: q[1], s: sm });
    }
  }
}

function resample(arr) {
  const out = [arr[0]];
  let acc = 0;
  for (let i = 1; i < arr.length; i++) {
    const a = arr[i - 1], b = arr[i];
    acc += Math.hypot(b.x - a.x, b.y - a.y);
    if (acc >= 1) { out.push(b); acc = 0; }
  }
  return out;
}

function angDiff(a, b) {
  let d = b - a;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
}

function cubic(p0, c1, c2, p3, n) {
  const o = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, u = 1 - t;
    o.push({
      x: u*u*u*p0[0] + 3*u*u*t*c1[0] + 3*u*t*t*c2[0] + t*t*t*p3[0],
      y: u*u*u*p0[1] + 3*u*u*t*c1[1] + 3*u*t*t*c2[1] + t*t*t*p3[1],
    });
  }
  return o;
}

export class SkyEngine {
  constructor(canvas, dpr, strings) {
    this.cv  = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = dpr;
    this.strings = strings;

    this._puff  = makePuff();
    this._cpuff = makeCloudPuff();

    // Dimensions
    this.W = 0; this.H = 0;

    // Animation state
    this.path = []; this.pos = 0; this.parts = [];
    this.word = 'build';
    this.box  = { x: 0, y: 0, w: 0, h: 0 };
    this.wait = 0; this.head = 0; this.bank = 0; this.CY = 0;

    this.mode = 'idle'; // transitions to 'write' once beginWriting() is called
    this.fly  = null; this.cloudC = null; this.cloudA = 0;
    this.tpts = []; this.t = 0; this.lastMin = '';

    // Live system stats — updated by setLiveData()
    this.sys = { cpu: 0, ram: 0, ramTotal: 16, up: 0, hostname: 'linux', syncAgo: null };

    // Real grid cells from API — null means use mock fallback
    this._apiGrid = null;

    // Grid position bookkeeping for live-line drawing
    this._gridX0 = 0; this._gridY0 = 0; this._gridGH = 0;

    this._paused  = false;
    this._rafId   = null;
    this._interval = null;
  }

  // ── Public API ────────────────────────────────────────────────────────────

  resize(w, h) {
    this.W = w; this.H = h;
    this.cv.width  = Math.round(w * this.dpr);
    this.cv.height = Math.round(h * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    if (this.mode === 'write') this._build(this.word);
  }

  beginWriting() {
    if (this.mode !== 'idle') return;
    this.mode = 'write';
    if (this.W > 0) this._build(this.word);
    this._startLoop();
    this._startTick();
  }

  setWord(w) {
    if (this.word === w) return;
    this.word = w;
    if (this.mode === 'open')  { this._renderGrid(); return; }
    if (this.mode !== 'write') return;
    this.parts.forEach(p => { p.a *= 0.3; });
    this.wait = 0;
    this._build(w);
  }

  setStrings(s) {
    this.strings = s;
    if (this.mode === 'open') this._renderGrid();
  }

  // Called by the React component whenever /api/status returns fresh data
  setLiveData({ state, grid, live }) {
    this.setWord(state);
    this._apiGrid = grid ?? null;
    if (live) {
      this.sys = {
        cpu:      live.cpu,
        ram:      live.ramUsed,
        ramTotal: live.ramTotal,
        up:       live.uptime,
        hostname: live.hostname,
        syncAgo:  live.syncAgo,
      };
    }
    if (this.mode === 'open') this._renderGrid();
  }

  pause()  { this._paused = true; }
  resume() { this._paused = false; }

  click(mx, my) {
    if (this.mode === 'write') {
      const i    = Math.min(Math.floor(this.pos), this.path.length - 1);
      const near = this.pos < this.path.length - 1 && i >= 0 &&
        Math.hypot(mx - this.path[i].x, my - this.path[i].y) < 30;
      if (this.parts.length > 40 &&
          (near || (mx > this.box.x && mx < this.box.x + this.box.w &&
                    my > this.box.y && my < this.box.y + this.box.h))) {
        this._startMorph();
      }
    } else if (this.mode === 'open') {
      this._closeMorph();
    }
  }

  destroy() {
    if (this._rafId)    { cancelAnimationFrame(this._rafId); this._rafId = null; }
    if (this._interval) { clearInterval(this._interval);     this._interval = null; }
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  _startLoop() {
    if (this._rafId) return;
    const loop = () => {
      if (!this._paused && this.mode !== 'idle') this._tick();
      this._rafId = requestAnimationFrame(loop);
    };
    this._rafId = requestAnimationFrame(loop);
  }

  _startTick() {
    if (this._interval) return;
    this._interval = setInterval(() => {
      const s = this.sys;
      const isBuild = this.word === 'build';
      s.cpu  = Math.max(4,  Math.min(92, s.cpu  + (Math.random() - .5) * (isBuild ? 14 : 4)));
      s.ram  = Math.max(3,  Math.min(14, s.ram  + (Math.random() - .5) * 0.2));
      s.up  += 1;
      s.sync = (s.sync + 1) % 10;
      if (this.mode === 'open' && this._clockStr() !== this.lastMin) {
        this._renderGrid();
      }
    }, 1000);
  }

  _clockStr() {
    return new Date().toLocaleTimeString('es-MX', {
      hour: '2-digit', minute: '2-digit', timeZone: 'America/Chihuahua',
    });
  }

  _cells() {
    // Use real API data when available
    if (this._apiGrid) {
      return this._apiGrid.map(c => [c.label, c.value, c.sub]);
    }
    // Fallback mock data
    const S     = this.strings;
    const clock = this._clockStr();
    const D = {
      build:   [[S.lastCommit,'CotiEstima',S.ago23min], [S.listening,'The Less I Know','Tame Impala'], [S.reposToday,`3 ${S.active}`,'CotiEstima · HAVEN'], [S.localTime,clock,'Chihuahua, MX']],
      idle:    [[S.lastCommit,'CotiEstima',S.ago1h],    [S.listening,S.paused,'Tame Impala'],           [S.reposToday,`2 ${S.active}`,'CotiEstima · Poised'], [S.localTime,clock,'Chihuahua, MX']],
      offline: [[S.lastCommit,'CotiEstima',S.ago3h],    [S.listening,S.nothing,S.noReproducing],        [S.reposToday,`2 ${S.active}`,'CotiEstima · Poised'], [S.localTime,clock,'Chihuahua, MX']],
    };
    return D[this.word] ?? D.idle;
  }

  _build(w) {
    this.word = w;
    const p   = [];
    this.pos  = 0;

    let units = 1.2;
    for (const ch of w) { if (C[ch]) units += C[ch].w; else units += 0.6; }
    units += 2.6;

    // Write in the upper-center region of the hero (right of the text block).
    // areaW = how much horizontal space the word can use; ox = left anchor.
    const areaW = this.W * 0.42;
    const u     = Math.min(26, areaW / units);
    const ox    = this.W * 0.30;
    const base  = this.H * 0.24;
    const tf   = (x, y) => [ox + (x - y * 0.28) * u, base + y * u];

    const raw = [[-0.2, -0.05], [0.5, -0.15], [1.0, -0.35]];
    let x = 1.2;
    for (const ch of w) {
      if (!C[ch]) { x += 0.6; continue; }
      for (const q of C[ch].p) raw.push([x + q[0], q[1]]);
      x += C[ch].w;
    }
    raw.push([x + 0.9, -0.15], [x + 1.8, -0.05], [x + 2.6, -0.12]);

    const pts   = raw.map(q => tf(q[0], q[1]));
    const start = pts[0];
    spline([[-60, start[1] - 30], [start[0] - u * 3, start[1] - 10], start], false, p);
    spline(pts, true, p);
    const e = pts[pts.length - 1];
    spline([e, [e[0] + u * 2.5, e[1] - 10], [this.W + 80, e[1] - 40]], false, p);

    this.path = resample(p);
    this.head = Math.atan2(this.path[2].y - this.path[0].y, this.path[2].x - this.path[0].x);
    this.box  = { x: ox - u, y: base - 2.4 * u, w: units * u + u * 2, h: 3.8 * u };
    this.CY   = base - 0.6 * u;
  }

  _emit(pt) {
    this.parts.push({
      x: pt.x + (Math.random() - .5) * 1.2,
      y: pt.y + (Math.random() - .5) * 1.2,
      r: 1.5 + Math.random() * 1.2,
      a: 0.55,
      vx: 0.03 + Math.random() * 0.03,
      vy: (Math.random() - .5) * 0.02,
    });
  }

  _drawPlane(x, y, ang, bk) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang);
    ctx.scale(1, Math.cos(bk));
    ctx.fillStyle = '#e6e6ec';
    // Tail
    ctx.beginPath(); ctx.moveTo(-10,-5); ctx.lineTo(-7.5,-5); ctx.lineTo(-6.5,0);
    ctx.lineTo(-7.5,5); ctx.lineTo(-10,5); ctx.lineTo(-9.5,0); ctx.closePath(); ctx.fill();
    // Wings
    ctx.beginPath(); ctx.moveTo(4,-1.6); ctx.lineTo(2.2,-12.5); ctx.lineTo(-0.8,-12.5);
    ctx.lineTo(-2.2,-1.6); ctx.lineTo(-2.2,1.6); ctx.lineTo(-0.8,12.5); ctx.lineTo(2.2,12.5);
    ctx.lineTo(4,1.6); ctx.closePath(); ctx.fill();
    // Fuselage
    ctx.beginPath(); ctx.moveTo(11,0); ctx.quadraticCurveTo(10,-2.2,6,-2.2);
    ctx.lineTo(-9,-0.9); ctx.lineTo(-11,0); ctx.lineTo(-9,0.9);
    ctx.lineTo(6,2.2); ctx.quadraticCurveTo(10,2.2,11,0); ctx.fill();
    // Engine
    ctx.fillStyle = '#9a9aa6';
    ctx.beginPath(); ctx.ellipse(1.5, 0, 2.6, 1.2, 0, 0, Math.PI * 2); ctx.fill();
    // Prop blur
    ctx.fillStyle = 'rgba(220,220,230,0.14)';
    ctx.beginPath(); ctx.ellipse(11.6, 0, 0.7, 4.2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  _steer(P, i, k) {
    const a = P[Math.max(0, i - 6)];
    const c = P[Math.min(P.length - 1, i + 6)];
    const d = angDiff(this.head, Math.atan2(c.y - a.y, c.x - a.x));
    this.head += d * k;
    this.bank += (Math.max(-1.1, Math.min(1.1, d * 9)) - this.bank) * 0.09;
  }

  _renderGrid() {
    const { W, H, dpr } = this;
    const cs   = this._cells();
    this.lastMin = this._clockStr();

    const cols = W >= 900 ? 4 : 2;
    const rows = 4 / cols;
    const x0   = W * (cols === 4 ? 0.4 : 0.47);
    const x1   = W - 26;
    const cw   = (x1 - x0) / cols;

    // Find largest font that fits cell width
    const m  = document.createElement('canvas').getContext('2d');
    let fs   = 30;
    while (fs > 14) {
      m.font = CLOUD_FONT(fs);
      if (Math.max(...cs.map(c => m.measureText(c[1]).width)) <= cw - 14) break;
      fs--;
    }

    const rowH = fs + 42;
    const gh   = rows * rowH + (rows - 1) * 16;
    const y0   = Math.max(20, this.CY - gh / 2 - 40);
    this._gridX0 = x0; this._gridY0 = y0; this._gridGH = gh;

    const lay = cs.map((cell, i) => ({
      cell,
      x: x0 + (i % cols) * cw,
      y: y0 + Math.floor(i / cols) * (rowH + 16),
    }));

    // Sample target pixels for smoke-to-cloud morph
    const s  = document.createElement('canvas');
    s.width  = W; s.height = H;
    const sc = s.getContext('2d');
    sc.font         = CLOUD_FONT(fs);
    sc.textBaseline = 'middle';
    sc.fillStyle    = '#fff';
    for (const L of lay) sc.fillText(L.cell[1], L.x, L.y + 16 + fs / 2);

    const imgData = sc.getImageData(0, 0, W, H).data;
    this.tpts = [];
    // Sample every 3px — dense enough for coverage, sparse enough for puff overlap
    for (let y = 0; y < H; y += 3) {
      for (let x = 0; x < W; x += 3) {
        if (imgData[(y * W + x) * 4 + 3] > 120) this.tpts.push([x, y]);
      }
    }
    this.tpts.sort(() => Math.random() - .5);

    const puffR = fs * 0.55; // puff radius relative to font size

    // Build shadow layer (offset down-right for depth)
    const sh   = document.createElement('canvas');
    sh.width   = Math.round(W * dpr);
    sh.height  = Math.round(H * dpr);
    const sk   = sh.getContext('2d');
    sk.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (const q of this.tpts) {
      const r = puffR * (0.9 + Math.random() * 0.3);
      sk.globalAlpha = 0.22;
      sk.drawImage(this._cpuff, q[0] - r + 2, q[1] - r + 3, r * 2, r * 2);
    }
    sk.globalCompositeOperation = 'source-atop';
    sk.globalAlpha  = 1;
    sk.fillStyle    = '#8a8a9a';
    sk.fillRect(0, 0, W, H);

    // Build final cloud canvas
    const cc  = document.createElement('canvas');
    cc.width  = Math.round(W * dpr);
    cc.height = Math.round(H * dpr);
    const k   = cc.getContext('2d');
    k.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Shadow pass
    k.globalAlpha = 0.5; k.drawImage(sh, 0, 0, W, H);
    // Solid text base so letters are always legible
    k.globalAlpha  = 0.9;
    k.font         = CLOUD_FONT(fs);
    k.textBaseline = 'middle';
    k.fillStyle    = '#ffffff';
    for (const L of lay) k.fillText(L.cell[1], L.x, L.y + 16 + fs / 2);
    // Cloud puffs on top of text for fluffy texture
    for (const q of this.tpts) {
      const r = puffR * (0.85 + Math.random() * 0.3);
      k.globalAlpha = 0.38 + Math.random() * 0.18;
      k.drawImage(this._cpuff, q[0] - r, q[1] - r, r * 2, r * 2);
    }
    // Bright highlight puffs
    for (const q of this.tpts) {
      if (Math.random() > 0.4) continue;
      const r = puffR * 0.4;
      k.globalAlpha = 0.65;
      k.drawImage(this._cpuff, q[0] - r, q[1] - r - 1, r * 2, r * 2);
    }
    k.globalAlpha = 1;
    for (const L of lay) {
      k.font      = '9px monospace';
      k.fillStyle = '#6a6a76';
      k.fillText(L.cell[0].split('').join(' '), L.x, L.y + 4);
      k.font      = '10px monospace';
      k.fillStyle = '#7e7e88';
      k.fillText(L.cell[2], L.x, L.y + 16 + fs + 14);
    }

    this.cloudC = cc;
  }

  _fmtUp(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return `${h}h ${m}m`;
  }

  _startMorph() {
    // Ensure Nunito is loaded before sampling glyph pixels for the cloud effect
    document.fonts.load('900 30px "Nunito"').catch(() => {}).finally(() => {
      this._renderGrid();
      this._beginMorph();
    });
  }

  _beginMorph() {
    const done = this.pos >= this.path.length - 1;
    let p0, dir;
    if (done) {
      p0  = [this.W + 40, this.H * 0.1];
      dir = [-1, 0.25];
    } else {
      const b = this.path[Math.floor(this.pos)];
      p0  = [b.x, b.y];
      dir = [Math.cos(this.head), Math.sin(this.head)];
    }

    const a = cubic(
      p0,
      [p0[0] + dir[0] * 120, p0[1] + dir[1] * 120 - 40],
      [this.box.x - 170, this.CY - 150],
      [this.box.x - 60,  this.CY],
      300,
    );
    for (let x = this.box.x - 58; x <= this.W + 80; x += 2) a.push({ x, y: this.CY });

    this.fly    = { pts: resample(a), f: 0, v: 1.4 };
    this.mode   = 'fly';
    this.cloudA = 0;

    const pool = this.parts.slice();
    const n    = Math.min(this.tpts.length, 1300);
    for (let i = 0; i < n; i++) {
      let p = pool[i];
      if (!p) {
        const src = pool[Math.floor(Math.random() * pool.length)] || { x: this.box.x + this.box.w / 2, y: this.CY };
        p = { x: src.x, y: src.y, r: 2, a: 0.3, vx: 0, vy: 0 };
        this.parts.push(p);
      }
      const q = this.tpts[Math.floor(i * this.tpts.length / n)];
      p.tx = q[0]; p.ty = q[1]; p.go = false;
    }
    for (let i = n; i < pool.length; i++) pool[i].dying = true;
  }

  _closeMorph() {
    this.mode   = 'fade';
    this.parts  = [];
    for (let i = 0; i < 700; i++) {
      const q = this.tpts[Math.floor(Math.random() * this.tpts.length)];
      if (q) this.parts.push({
        x: q[0], y: q[1],
        r: 3 + Math.random() * 3, a: 0.5,
        vx: 0.15 + Math.random() * 0.4,
        vy: -0.1 - Math.random() * 0.4,
        dying: true,
      });
    }
  }

  _finish() {
    this.mode   = 'write';
    this.wait   = 0;
    this.parts  = [];
    this.cloudA = 0;
    this.cloudC = null;
    this._build(this.word);
  }

  _drawHint() {
    if (this.mode !== 'write' || this.parts.length < 40) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha  = 0.35;
    ctx.font         = '10px monospace';
    ctx.fillStyle    = '#4a4a52';
    ctx.textAlign    = 'right';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(this.strings.hint, this.W - 20, this.H - 16);
    ctx.textAlign = 'left';
    ctx.restore();
  }

  _drawLiveLine() {
    if (this.cloudA < 0.15 || this._gridX0 === 0) return;
    const S      = this.strings;
    const sys    = this.sys;
    const active   = this.word !== 'offline';
    const host     = sys.hostname ?? 'linux';
    const syncStr  = sys.syncAgo != null ? `${sys.syncAgo}s` : '—';
    const ramTotal = sys.ramTotal ?? 16;
    const text   = active
      ? `christian@${host} — live · cpu ${Math.round(sys.cpu)}% · ram ${(sys.ram ?? 0).toFixed(1)}/${ramTotal} gb · up ${this._fmtUp(sys.up)} · ${S.sync} ${syncStr}`
      : `christian@${host} — ${S.noSignal}`;

    const alpha  = Math.min(1, (this.cloudA - 0.15) / 0.4);
    const x0     = this._gridX0;
    const y      = this._gridY0 + this._gridGH + 16;
    const dotA   = active ? (0.5 + 0.5 * Math.sin(this.t * 4)) : 0.3;
    const ctx    = this.ctx;

    ctx.save();
    ctx.textBaseline = 'middle';

    // Blinking dot
    ctx.globalAlpha = alpha * dotA;
    ctx.fillStyle   = active ? '#e8e8ec' : '#55555e';
    ctx.beginPath();
    ctx.arc(x0 + 3, y, 3, 0, Math.PI * 2);
    ctx.fill();

    // Text
    ctx.globalAlpha  = alpha * 0.85;
    ctx.font         = '10px monospace';
    ctx.fillStyle    = '#8a8a94';
    ctx.fillText(text, x0 + 12, y);
    ctx.restore();
  }

  _tick() {
    this.t += 0.016;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.W, this.H);
    // Canvas is transparent — no background fill.

    let arrived = 0, tot = 0;
    for (let i = this.parts.length - 1; i >= 0; i--) {
      const p = this.parts[i];
      if (p.tx != null) {
        tot++;
        if (!p.go && this.fly?.cur && this.fly.cur.x > p.x - 8 && Math.abs(this.fly.cur.y - this.CY) < 4) p.go = true;
        if (this.mode === 'open') p.go = true;
        if (p.go) {
          p.x += (p.tx - p.x) * 0.05 + (Math.random() - .5) * 0.2;
          p.y += (p.ty - p.y) * 0.05 + (Math.random() - .5) * 0.2;
          if (Math.abs(p.tx - p.x) + Math.abs(p.ty - p.y) < 3) arrived++;
          p.r += (3 - p.r) * 0.04;
          if (this.cloudA > 0.35) p.a *= 0.9;
          else p.a += (0.6 - p.a) * 0.04;
        }
      } else {
        p.r += 0.025 * (1 - p.r / 12);
        p.x += p.vx;
        p.y += p.vy;
        p.a *= p.dying ? 0.97 : (this.mode === 'write' ? 0.9982 : 0.99);
      }
      if (p.a < 0.012) { this.parts.splice(i, 1); continue; }
      ctx.globalAlpha = p.a;
      ctx.drawImage(this._puff, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
    }
    ctx.globalAlpha = 1;

    if (this.cloudC && (this.mode === 'fly' || this.mode === 'open') && tot > 0 && arrived / tot > 0.5) {
      this.cloudA = Math.min(1, this.cloudA + 0.02);
    }
    if (this.mode === 'open' && tot === 0) this.cloudA = Math.min(1, this.cloudA + 0.02);
    if (this.mode === 'fade')              this.cloudA = Math.max(0, this.cloudA - 0.05);

    if (this.cloudC && this.cloudA > 0) {
      ctx.globalAlpha = this.cloudA;
      ctx.drawImage(this.cloudC, Math.sin(this.t * 0.5) * 0.8, Math.sin(this.t * 0.4) * 0.6, this.W, this.H);
      ctx.globalAlpha = 1;
    }

    this._drawHint();
    this._drawLiveLine();

    if (this.mode === 'write') {
      if (this.pos < this.path.length - 1) {
        const prev = Math.floor(this.pos);
        this.pos   = Math.min(this.path.length - 1, this.pos + 1.35);
        for (let i = prev + 1; i <= Math.floor(this.pos); i++) {
          if (this.path[i].s) {
            this._emit(this.path[i]);
            if (Math.random() < .5) this._emit(this.path[i]);
          }
        }
        const i = Math.floor(this.pos);
        this._steer(this.path, i, 0.12);
        this._drawPlane(this.path[i].x, this.path[i].y, this.head, this.bank);
      } else {
        this.wait++;
        if (this.wait > 1800) { this.wait = 0; this._build(this.word); }
      }
    } else if (this.mode === 'fly') {
      const P    = this.fly.pts;
      this.fly.v = Math.min(4.2, this.fly.v + 0.015);
      this.fly.f = Math.min(P.length - 1, this.fly.f + this.fly.v);
      const i    = Math.floor(this.fly.f);
      const b    = P[i];
      this.fly.cur = b;
      this._steer(P, i, 0.16);
      this._drawPlane(b.x, b.y, this.head, this.bank);
      if (i >= P.length - 1) { this.fly = null; this.mode = 'open'; }
    } else if (this.mode === 'fade' && this.parts.length === 0 && this.cloudA <= 0) {
      this._finish();
    }
  }
}
