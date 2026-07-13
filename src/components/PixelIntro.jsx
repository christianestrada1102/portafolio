import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * Intro de la bitácora de hackathons.
 * Grid de pixeles (adaptado del Pixel Card de OriginKit) que crece desde el
 * centro y hace shimmer, con </>CodeByNas al medio; luego la cortina sube
 * revelando la página.
 */

class Pixel {
  constructor(canvas, ctx, x, y, color, speed, delay, maxPx) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = (Math.random() * 0.8 + 0.1) * speed;
    this.size = 0;
    const factor = maxPx / 2;
    this.sizeStep = Math.random() * 0.4 * factor;
    this.minSize = 0.5 * factor;
    this.maxSize = Math.random() * (maxPx - this.minSize) + this.minSize;
    this.maxSizeInteger = maxPx;
    this.delay = delay;
    this.counter = 0;
    this.counterStep = Math.random() * 4 + (canvas.width + canvas.height) * 0.01;
    this.isShimmer = false;
    this.isReverse = false;
  }

  draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x + centerOffset, this.y + centerOffset, this.size, this.size);
  }

  appear() {
    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }
    if (this.size >= this.maxSize) this.isShimmer = true;
    if (this.isShimmer) {
      if (this.size >= this.maxSize) this.isReverse = true;
      else if (this.size <= this.minSize) this.isReverse = false;
      this.size += this.isReverse ? -this.speed : this.speed;
    } else {
      this.size += this.sizeStep;
    }
    this.draw();
  }
}

const COLORS = [
  'rgba(124, 58, 237, 0.9)',
  'rgba(167, 139, 250, 0.65)',
  'rgba(96, 70, 160, 0.5)',
];

export default function PixelIntro({ onDone }) {
  const overlayRef = useRef(null);
  const canvasRef  = useRef(null);
  const labelRef   = useRef(null);
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

    // Grid de pixeles con delay radial: crecen desde el centro
    const gap = 12;
    const speed = 80 * 0.002;
    const pixels = [];
    for (let x = 0; x < w; x += gap) {
      for (let y = 0; y < h; y += gap) {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const dx = x - w / 2;
        const dy = y - h / 2;
        const delay = Math.sqrt(dx * dx + dy * dy);
        pixels.push(new Pixel(canvas, ctx, x, y, color, speed, delay, 3));
      }
    }

    let raf;
    let last = performance.now();
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 1000 / 60) return;
      last = now;
      ctx.clearRect(0, 0, w, h);
      for (const p of pixels) p.appear();
    };
    raf = requestAnimationFrame(loop);

    // Label al centro y salida en cortina
    const tl = gsap.timeline();
    tl.fromTo(
      labelRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.6, delay: 0.4, ease: 'power3.out' }
    )
      .to(labelRef.current, { opacity: 0, y: -16, duration: 0.3, ease: 'power2.in' }, '+=0.9')
      .to(
        overlayRef.current,
        {
          yPercent: -100,
          duration: 0.65,
          ease: 'power4.inOut',
          onComplete: () => {
            cancelAnimationFrame(raf);
            setGone(true);
            onDone?.();
          },
        },
        '-=0.05'
      );

    return () => {
      tl.kill();
      cancelAnimationFrame(raf);
    };
  }, [onDone]);

  if (gone) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[90] overflow-hidden"
      style={{ background: '#0a0610' }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div
        ref={labelRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: 0 }}
      >
        <span
          className="font-mono font-bold select-none"
          style={{ fontSize: 'clamp(1.6rem, 5vw, 3rem)', color: '#e0d0ff' }}
        >
          <span style={{ color: '#a78bfa' }}>{'</>'}</span>CodeByNas
        </span>
      </div>
    </div>
  );
}
