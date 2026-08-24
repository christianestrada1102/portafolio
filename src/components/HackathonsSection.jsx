import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { useLanguage } from '../context/LanguageContext';

// ── Dynamic image loading ──────────────────────────────────────────────────────
// Vite picks up any image added to src/assets/hackathons/<folder>/ automatically
const RAW_IMAGES = import.meta.glob(
  '../assets/hackathons/**/*.{jpg,jpeg,png,webp}',
  { eager: true },
);

const getImages = (folder) =>
  Object.entries(RAW_IMAGES)
    .filter(([p]) => p.includes(`/hackathons/${folder}/`))
    .map(([, m]) => m.default);

// ── Hackathon data ─────────────────────────────────────────────────────────────

const HACKATHONS = [
  {
    id: 'nasa',
    folder: 'nasa-space-apps',
    date: 'Oct 2025',
    name: 'NASA Space Apps Challenge',
    description:
      'Competencia internacional de la NASA celebrada en todo el mundo simultáneamente. Construimos Yuyin, una plataforma educativa digital para fortalecer la atención y el lenguaje en niños, diseñada como herramienta de apoyo complementario para terapeutas y especialistas.',
    project: { name: 'Yuyin', id: 'projects' },
    stack: ['Unity', 'C#'],
    achievement: 'Certificado "Galactic Problem Solver" by NASA',
  },
  {
    id: 'ethmty',
    folder: 'eth-mexico',
    date: 'Nov 2025',
    name: 'ETH Mexico MTY',
    description:
      'Hackathon de Ethereum organizado en Monterrey. En 48 horas construimos SettArb, una plataforma Web3 que reduce el tiempo de retiro de Arbitrum a Ethereum de 7 días a menos de 2 minutos mediante smart contracts y una interfaz accesible para cualquier usuario.',
    project: { name: 'SettArb', id: 'projects' },
    stack: ['Solidity', 'TypeScript', 'React', 'Next.js', 'Web3'],
    achievement: 'Deployado en producción',
  },
  {
    id: 'icatech',
    folder: 'icatech',
    date: '2025',
    name: 'MIT · ICATECH Hackathon',
    description:
      'Hackathon de tecnología para emergencias e impacto social. En 48 horas construimos SafeZone, una app móvil de seguridad personal que conecta usuarios con familiares y autoridades locales en tiempo real mediante alertas georreferenciadas.',
    project: { name: 'SafeZone', id: 'projects' },
    stack: ['React Native', 'Expo', 'Django', 'PostgreSQL'],
    achievement: 'MVP entregado en 48 horas',
  },
  {
    id: 'hacklatam',
    folder: 'hack-latam',
    date: '2026',
    name: 'hack@latam',
    description:
      'Hackathon latinoamericano de inteligencia artificial. Construimos HAVEN, una plataforma de defensa colectiva que detecta fraudes digitales, phishing y extorsión en tiempo real mediante IA multimodal, protegiendo a usuarios de LATAM a través de una red colaborativa de incidentes.',
    project: { name: 'HAVEN', id: 'projects' },
    stack: ['FastAPI', 'React', 'Mistral AI', 'Claude AI', 'Whisper', 'Railway', 'Vercel'],
    achievement: 'Deployado en producción',
  },
];


// ── Pixel logo animation ───────────────────────────────────────────────────────

function PixelLogo({ onComplete }) {
  const canvasRef       = useRef(null);
  const onCompleteRef   = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let raf;
    let cancelled = false;

    const run = () => {
      if (cancelled) return;

      const TEXT   = '</> CodeByNas';
      const PIXEL  = 3;          // pixel-block size for retro look
      const FONT_H = 14;         // small font → blocky when sampled
      const PAD    = 6;
      const SCALE  = 2.6;        // CSS upscale for visual size

      // Measure
      const tmp = document.createElement('canvas').getContext('2d');
      tmp.font = `bold ${FONT_H}px "JetBrains Mono", monospace`;
      const W = Math.ceil(tmp.measureText(TEXT).width) + PAD * 2;
      const H = FONT_H + PAD * 2;

      // Off-screen render at actual pixel resolution
      const off    = document.createElement('canvas');
      off.width    = W;
      off.height   = H;
      const offCtx = off.getContext('2d');
      offCtx.font      = `bold ${FONT_H}px "JetBrains Mono", monospace`;
      offCtx.fillStyle = '#a78bfa';
      offCtx.fillText(TEXT, PAD, FONT_H + PAD - 2);
      const src = offCtx.getImageData(0, 0, W, H).data;

      // Visible canvas
      canvas.width        = W;
      canvas.height       = H;
      canvas.style.width  = `${Math.round(W  * SCALE)}px`;
      canvas.style.height = `${Math.round(H * SCALE)}px`;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;

      const colsTotal = Math.ceil(W / PIXEL);
      let start       = null;
      const DURATION  = 1500;

      const frame = (ts) => {
        if (cancelled) return;
        if (!start) start = ts;
        const pct        = Math.min((ts - start) / DURATION, 1);
        const revealCols = Math.ceil(pct * colsTotal);

        ctx.clearRect(0, 0, W, H);

        for (let bx = 0; bx < revealCols; bx++) {
          for (let by = 0; by <= Math.ceil(H / PIXEL); by++) {
            const px = bx * PIXEL;
            const py = by * PIXEL;
            const sx = Math.min(px + (PIXEL >> 1), W - 1);
            const sy = Math.min(py + (PIXEL >> 1), H - 1);
            const i  = (sy * W + sx) * 4;
            if (src[i + 3] > 12) {
              ctx.fillStyle = `rgba(${src[i]},${src[i + 1]},${src[i + 2]},${(src[i + 3] / 255).toFixed(2)})`;
              ctx.fillRect(px, py, PIXEL, PIXEL);
            }
          }
        }

        if (pct < 1) {
          raf = requestAnimationFrame(frame);
        } else if (!cancelled) {
          setTimeout(() => { if (!cancelled) onCompleteRef.current(); }, 350);
        }
      };

      raf = requestAnimationFrame(frame);
    };

    document.fonts.ready.then(run);
    return () => { cancelled = true; cancelAnimationFrame(raf); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ imageRendering: 'pixelated' }}
      aria-hidden="true"
    />
  );
}

// ── Photo slot ─────────────────────────────────────────────────────────────────

function PhotoSlot({ src, alt }) {
  if (!src) {
    return (
      <div
        className="aspect-[4/3] rounded-lg flex items-center justify-center font-mono text-xs select-none"
        style={{
          background: '#1a1228',
          border: '1.5px dashed #6046a0',
          color: '#6046a0',
          minWidth: 0,
        }}
      >
        [ foto próximamente ]
      </div>
    );
  }

  return (
    <div className="aspect-[4/3] rounded-lg overflow-hidden" style={{ minWidth: 0 }}>
      <img
        src={src}
        alt={alt}
        className="gbc-photo w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        loading="lazy"
      />
    </div>
  );
}

// ── Single hackathon block ─────────────────────────────────────────────────────

function HackBlock({ h, index }) {
  const images  = getImages(h.folder);
  const slots   = [images[0] ?? null, images[1] ?? null, images[2] ?? null];
  const isEven  = index % 2 === 0;

  const scrollToProjects = () => {
    const el = document.getElementById(h.project.id);
    if (!el) return;
    if (window.lenis) window.lenis.scrollTo(el, { offset: -64, duration: 1.2 });
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="py-14 md:py-16">
      <div
        className={`flex flex-col gap-10 md:gap-14 md:flex-row ${
          !isEven ? 'md:flex-row-reverse' : ''
        }`}
      >
        {/* Photos */}
        <div className="w-full md:w-5/12 shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <PhotoSlot src={slots[0]} alt={`${h.name} — foto 1`} />
            <PhotoSlot src={slots[1]} alt={`${h.name} — foto 2`} />
          </div>
          {slots[2] !== undefined && (
            <div className="mt-2">
              <PhotoSlot src={slots[2]} alt={`${h.name} — foto 3`} />
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col justify-center gap-4">
          <div>
            <p
              className="font-mono text-xs uppercase tracking-widest mb-1.5"
              style={{ color: '#6046a0' }}
            >
              {h.date}
            </p>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white leading-snug">
              {h.name}
            </h3>
          </div>

          <p className="text-neutral-400 leading-relaxed text-sm md:text-[0.95rem]">
            {h.description}
          </p>

          <button
            onClick={scrollToProjects}
            className="inline-flex items-center gap-2 font-mono text-sm group w-fit"
            style={{ color: '#a78bfa' }}
          >
            <span className="opacity-40 group-hover:opacity-100 transition-opacity duration-200">→</span>
            <span className="underline-offset-4 group-hover:underline transition-all duration-200">
              Proyecto: {h.project.name}
            </span>
          </button>

          <div className="flex flex-wrap gap-1.5">
            {h.stack.map((s) => (
              <span
                key={s}
                className="font-mono text-xs px-2 py-0.5 rounded"
                style={{
                  background: '#160d2a',
                  color: '#a78bfa',
                  border: '1px solid #2a1f4a',
                }}
              >
                {s}
              </span>
            ))}
          </div>

          {h.achievement && (
            <div className="flex items-center gap-2">
              <span aria-hidden="true">🏆</span>
              <span className="font-mono text-xs" style={{ color: '#6046a0' }}>
                {h.achievement}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Section divider ────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div
      className="h-px w-full"
      style={{
        background:
          'linear-gradient(90deg, transparent, #2a1f4a 20%, #2a1f4a 80%, transparent)',
      }}
    />
  );
}

// ── Main export ────────────────────────────────────────────────────────────────

export default function HackathonsSection() {
  const sectionRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const { t }      = useLanguage();

  // Initialise 'done' immediately for users who prefer reduced motion
  const [animPhase, setAnimPhase] = useState(() => {
    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 'done';
    }
    return 'idle';
  });

  // Trigger animation when section enters viewport (once)
  useEffect(() => {
    if (animPhase !== 'idle') return;
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimPhase('playing');
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [animPhase]);

  // After pixel logo completes: fade overlay out, fade content in
  const handleLogoComplete = useCallback(() => {
    if (!overlayRef.current || !contentRef.current) {
      setAnimPhase('done');
      return;
    }
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => setAnimPhase('done'),
    });
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.65, delay: 0.15, ease: 'power2.out' },
    );
  }, []);

  return (
    <section id="hackathons" ref={sectionRef} className="py-24 px-4 md:px-6 relative">

      {/* Pixel logo animation overlay */}
      {animPhase === 'playing' && (
        <div
          ref={overlayRef}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-neutral-950"
        >
          <PixelLogo onComplete={handleLogoComplete} />
          <p
            className="font-mono text-xs select-none"
            style={{ color: '#2a1f4a' }}
            aria-hidden="true"
          >
            iniciando hackathons...
          </p>
        </div>
      )}

      {/* Content */}
      <div
        ref={contentRef}
        className="max-w-6xl mx-auto"
        style={{ opacity: animPhase === 'done' ? 1 : 0 }}
      >
        {/* Heading */}
        <div className="mb-4">
          <p className="text-sm font-medium text-brand-400 uppercase tracking-widest mb-2">
            {t('hackathons.label')}
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white">
            {t('hackathons.heading')}{' '}
            <span className="text-brand-400">{t('hackathons.heading.accent')}</span>
          </h2>
        </div>

        {/* Blocks */}
        {HACKATHONS.map((h, i) => (
          <div key={h.id}>
            <HackBlock h={h} index={i} />
            {i < HACKATHONS.length - 1 && <Divider />}
          </div>
        ))}
      </div>
    </section>
  );
}
