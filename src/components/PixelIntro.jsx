import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * Intro de la bitácora de hackathons.
 * Campo de pixeles (adaptado del Pixel Card de OriginKit) que crece desde el
 * centro; el </>CodeByNas está hecho de pixeles muestreados del texto y se
 * ensambla con la misma onda. Glitch bursts con bandas desplazadas y
 * aberración cromática. La salida es una apertura radial que se expande
 * desde el centro revelando la página debajo.
 */

class Pixel {
  constructor(x, y, color, speed, delay, maxPx) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = (Math.random() * 0.8 + 0.1) * speed;
    this.size = 0;
    const factor = maxPx / 2;
    this.sizeStep = Math.random() * 0.4 * factor + 0.1;
    this.minSize = 0.5 * factor;
    this.maxSize = Math.random() * (maxPx - this.minSize) + this.minSize;
    this.maxSizeInteger = maxPx;
    this.delay = delay;
    this.counter = 0;
    this.counterStep = Math.random() * 4 + 18;
    this.isShimmer = false;
    this.isReverse = false;
  }

  step() {
    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return false;
    }
    if (this.size >= this.maxSize) this.isShimmer = true;
    if (this.isShimmer) {
      if (this.size >= this.maxSize) this.isReverse = true;
      else if (this.size <= this.minSize) this.isReverse = false;
      this.size += this.isReverse ? -this.speed : this.speed;
    } else {
      this.size += this.sizeStep;
    }
    return this.size > 0;
  }

  draw(ctx, offsetX = 0, colorOverride = null) {
    const c = this.maxSizeInteger * 0.5 - this.size * 0.5;
    ctx.fillStyle = colorOverride ?? this.color;
    ctx.fillRect(this.x + c + offsetX, this.y + c, this.size, this.size);
  }
}

const BG_COLORS = [
  'rgba(124, 58, 237, 0.55)',
  'rgba(96, 70, 160, 0.4)',
  'rgba(167, 139, 250, 0.3)',
];
const GLITCH_TINTS = ['rgba(34, 211, 238, 0.85)', 'rgba(244, 114, 182, 0.85)'];

export default function PixelIntro({ onDone }) {
  const overlayRef = useRef(null);
  const canvasRef  = useRef(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setGone(true);
      onDone?.();
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);
    const cx = w / 2;
    const cy = h / 2;

    // ── Texto muestreado: </>CodeByNas pixel por pixel ──
    const off = document.createElement('canvas');
    off.width = w;
    off.height = h;
    const octx = off.getContext('2d');
    const fs = Math.max(34, Math.min(w * 0.085, 104));
    octx.font = `700 ${fs}px "JetBrains Mono", ui-monospace, monospace`;
    octx.textBaseline = 'middle';
    const tag = '</>';
    const name = 'CodeByNas';
    const wTag = octx.measureText(tag).width;
    const wName = octx.measureText(name).width;
    const x0 = (w - (wTag + wName)) / 2;
    octx.fillStyle = '#a78bfa';
    octx.fillText(tag, x0, cy);
    octx.fillStyle = '#ece4ff';
    octx.fillText(name, x0 + wTag, cy);
    const sample = octx.getImageData(0, 0, w, h).data;
    const alphaAt = (x, y) => sample[(Math.min(y, h - 1) * w + Math.min(x, w - 1)) * 4 + 3];

    const speed = 80 * 0.002;

    // Pixeles de fondo (esquivan la zona del texto)
    const bgPixels = [];
    const GAP_BG = 12;
    for (let x = 0; x < w; x += GAP_BG) {
      for (let y = 0; y < h; y += GAP_BG) {
        if (alphaAt(x, y) > 10) continue;
        const color = BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)];
        const delay = Math.hypot(x - cx, y - cy);
        bgPixels.push(new Pixel(x, y, color, speed, delay, 3));
      }
    }

    // Pixeles del texto: grid denso muestreando color real del glifo
    const txtPixels = [];
    const GAP_TX = 4;
    const ty0 = Math.max(0, Math.floor(cy - fs));
    const ty1 = Math.min(h, Math.ceil(cy + fs));
    const tx0 = Math.max(0, Math.floor(x0 - 12));
    const tx1 = Math.min(w, Math.ceil(x0 + wTag + wName + 12));
    for (let x = tx0; x < tx1; x += GAP_TX) {
      for (let y = ty0; y < ty1; y += GAP_TX) {
        const i = (y * w + x) * 4;
        if (sample[i + 3] < 40) continue;
        const color = `rgba(${sample[i]}, ${sample[i + 1]}, ${sample[i + 2]}, ${(sample[i + 3] / 255).toFixed(2)})`;
        const delay = Math.hypot(x - cx, y - cy) * 0.85;
        txtPixels.push(new Pixel(x, y, color, speed * 1.4, delay, 4.2));
      }
    }

    // ── Glitch bursts: bandas horizontales desplazadas + tinte cromático ──
    let glitch = null;
    let nextGlitch = performance.now() + 500;
    const scheduleGlitch = (now) => {
      if (glitch && now > glitch.until) glitch = null;
      if (!glitch && now > nextGlitch) {
        const bands = [];
        const n = 3 + Math.floor(Math.random() * 4);
        for (let i = 0; i < n; i++) {
          bands.push({
            y0: Math.random() * h,
            h: 14 + Math.random() * 70,
            shift: (Math.random() - 0.5) * 46,
            tint: Math.random() < 0.4
              ? GLITCH_TINTS[Math.floor(Math.random() * GLITCH_TINTS.length)]
              : null,
          });
        }
        glitch = { bands, until: now + 90 + Math.random() * 110 };
        nextGlitch = now + 380 + Math.random() * 520;
      }
    };
    const bandFor = (y) => {
      if (!glitch) return null;
      for (const b of glitch.bands) {
        if (y >= b.y0 && y <= b.y0 + b.h) return b;
      }
      return null;
    };

    // ── Salida: dispersión de pixeles. La capa se trocea en bloques que
    //    mueren en orden aleatorio: cada uno se encoge y se desvía un poco,
    //    como si el fondo se esparciera revelando la página debajo ──
    const BLOCK = 16;
    const bw = Math.ceil(w / BLOCK);
    const bh = Math.ceil(h / BLOCK);
    const blockThr = new Float32Array(bw * bh);
    const driftX = new Float32Array(bw * bh);
    const driftY = new Float32Array(bw * bh);
    for (let by = 0; by < bh; by++) {
      for (let bx = 0; bx < bw; bx++) {
        const i = by * bw + bx;
        blockThr[i] = Math.random() * 0.9;
        const ang = Math.random() * Math.PI * 2;
        const mag = 14 + Math.random() * 34;
        driftX[i] = Math.cos(ang) * mag;
        driftY[i] = Math.sin(ang) * mag;
      }
    }
    const FADE = 0.16; // tramo de progreso que tarda cada bloque en morir
    const prog = { p: 0 };
    const lifeAt = (bx, by) => {
      const t = (prog.p - blockThr[by * bw + bx]) / FADE;
      return t <= 0 ? 0 : t >= 1 ? 1 : t;
    };
    const revealedAt = (x, y) => {
      if (prog.p <= 0) return false;
      const bx = Math.min(bw - 1, Math.max(0, Math.floor(x / BLOCK)));
      const by = Math.min(bh - 1, Math.max(0, Math.floor(y / BLOCK)));
      return lifeAt(bx, by) > 0.4;
    };

    let raf;
    let last = performance.now();
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 1000 / 60) return;
      last = now;
      scheduleGlitch(now);

      ctx.clearRect(0, 0, w, h);

      // Fondo: entero antes de la salida; durante ella cada bloque se
      // encoge y se desvía según su vida (dispersión, no círculo)
      ctx.fillStyle = '#0a0610';
      if (prog.p <= 0) {
        ctx.fillRect(0, 0, w, h);
      } else {
        for (let by = 0; by < bh; by++) {
          for (let bx = 0; bx < bw; bx++) {
            const life = lifeAt(bx, by);
            if (life >= 1) continue;
            if (life <= 0) {
              ctx.fillRect(bx * BLOCK, by * BLOCK, BLOCK, BLOCK);
            } else {
              const i = by * bw + bx;
              const size = BLOCK * (1 - life);
              ctx.globalAlpha = 1 - life * 0.6;
              ctx.fillRect(
                bx * BLOCK + (BLOCK - size) / 2 + driftX[i] * life,
                by * BLOCK + (BLOCK - size) / 2 + driftY[i] * life,
                size, size,
              );
              ctx.globalAlpha = 1;
            }
          }
        }
      }

      for (const p of bgPixels) {
        if (revealedAt(p.x, p.y) || !p.step()) continue;
        const b = bandFor(p.y);
        p.draw(ctx, b ? b.shift : 0, b?.tint ?? null);
      }
      for (const p of txtPixels) {
        if (revealedAt(p.x, p.y) || !p.step()) continue;
        const b = bandFor(p.y);
        if (b) {
          // Aberración cromática en el texto durante el burst
          p.draw(ctx, b.shift - 3, 'rgba(34, 211, 238, 0.7)');
          p.draw(ctx, b.shift + 3, 'rgba(244, 114, 182, 0.7)');
          p.draw(ctx, b.shift, null);
        } else {
          p.draw(ctx);
        }
      }
    };
    raf = requestAnimationFrame(loop);

    // ── Salida: el progreso barre todos los umbrales y la capa se esparce ──
    const exit = gsap.to(prog, {
      p: 1.1, // rebasa el último umbral (0.9) más su fade (0.16)
      delay: 2.1,
      duration: 1.15,
      ease: 'power1.inOut',
      onComplete: () => {
        cancelAnimationFrame(raf);
        setGone(true);
        onDone?.();
      },
    });

    return () => {
      exit.kill();
      cancelAnimationFrame(raf);
    };
  }, [onDone]);

  if (gone) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[90] overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
