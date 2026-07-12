import { useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ScrambleButton from '../components/ScrambleButton';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import nasaImg from '../assets/nasa-space-apps.webp';
import { useLanguage } from '../context/LanguageContext';
import { revealHeaders } from '../utils/sectionReveal';

gsap.registerPlugin(ScrollTrigger);

const ICATECH_HOURS = [40, 10, 10, 10, 10];

// Imágenes del hover: coloca archivos en src/assets/achievements/<id>.(jpg|png|webp)
// ids: nasa, eth, mit, icatech, latam — NASA usa su certificado por defecto
const ACH_IMAGES = import.meta.glob('../assets/achievements/*.{jpg,jpeg,png,webp}', { eager: true });
function imageFor(id) {
  for (const [path, mod] of Object.entries(ACH_IMAGES)) {
    if (path.includes(`/${id}.`)) return mod.default;
  }
  return id === 'nasa' ? nasaImg : null;
}

const TIMELINE = [
  { id: 'nasa',    date: 'Oct 2025', title: 'NASA Space Apps', accent: 'Challenge', result: '"Galactic Problem Solver"', type: 'nasa' },
  { id: 'eth',     date: 'Nov 2025', title: 'ETH Mexico',      accent: 'MTY',       result: 'SettArb · producción',      type: 'hack' },
  { id: 'mit',     date: '2025',     title: 'MIT',             accent: 'ICATECH',   result: 'SafeZone · MVP en 48h',     type: 'hack' },
  { id: 'icatech', date: '2025',     title: 'ICATECH',         accent: '2025',      result: null,                        type: 'icatech' },
  { id: 'latam',   date: '2026',     title: 'hack@',           accent: 'latam',     result: 'HAVEN · producción',        type: 'hack' },
];

export default function Achievements() {
  const containerRef = useRef(null);
  const wrapRef      = useRef(null);
  const svgRef       = useRef(null);
  const railRef      = useRef(null);
  const progRef      = useRef(null);
  const dotRefs      = useRef([]);
  const previewRef   = useRef(null);
  const mouseRef     = useRef({ x: 0, y: 0 });

  const [nasaModal, setNasaModal]     = useState(false);
  const [icatechOpen, setIcatechOpen] = useState(false);
  const [preview, setPreview]         = useState(null);
  const { t } = useLanguage();

  // ── Construir el camino serpenteante que une los puntos ──
  const buildPath = useCallback(() => {
    const wrap = wrapRef.current;
    const svg  = svgRef.current;
    if (!wrap || !svg || !railRef.current || !progRef.current) return;

    const wr  = wrap.getBoundingClientRect();
    const pts = dotRefs.current.filter(Boolean).map((dot) => {
      const r = dot.getBoundingClientRect();
      return { x: r.left - wr.left + r.width / 2, y: r.top - wr.top + r.height / 2 };
    });
    if (pts.length < 2) return;

    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const my = ((a.y + b.y) / 2).toFixed(1);
      d += ` C ${a.x.toFixed(1)} ${my}, ${b.x.toFixed(1)} ${my}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
    }

    svg.setAttribute('viewBox', `0 0 ${wrap.offsetWidth} ${wrap.offsetHeight}`);
    railRef.current.setAttribute('d', d);
    progRef.current.setAttribute('d', d);

    const len = progRef.current.getTotalLength();
    progRef.current.dataset.len = String(len);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    progRef.current.style.strokeDasharray = String(len);
    if (reduced) progRef.current.style.strokeDashoffset = '0';
    else if (!progRef.current.style.strokeDashoffset) progRef.current.style.strokeDashoffset = String(len);
  }, []);

  // ── Animaciones ──
  useLayoutEffect(() => {
    buildPath();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      revealHeaders(containerRef.current);
      if (reduced) return;

      // El camino se dibuja conforme avanzas
      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top 72%',
        end: 'bottom 55%',
        scrub: true,
        onUpdate: (self) => {
          const p = progRef.current;
          if (!p) return;
          const len = parseFloat(p.dataset.len || '0');
          p.style.strokeDashoffset = String(len * (1 - self.progress));
        },
      });

      // Cada logro entra desde su lado, con el punto haciendo pop
      gsap.utils.toArray('.tl-item', containerRef.current).forEach((el) => {
        const fromRight = el.dataset.side === 'right';
        gsap.from(el, {
          x: fromRight ? 26 : -26,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
        const dot = el.querySelector('.tl-dot');
        if (dot) {
          gsap.from(dot, {
            scale: 0,
            duration: 0.45,
            ease: 'back.out(2.5)',
            immediateRender: false,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        }
      });
    }, containerRef);

    const onResize = () => { buildPath(); ScrollTrigger.refresh(); };
    window.addEventListener('resize', onResize);
    return () => {
      ctx.revert();
      window.removeEventListener('resize', onResize);
    };
  }, [buildPath]);

  // Reconstruir el camino cuando ICATECH se expande/colapsa
  useEffect(() => {
    const id = setTimeout(() => { buildPath(); ScrollTrigger.refresh(); }, 420);
    return () => clearTimeout(id);
  }, [icatechOpen, buildPath]);

  // ── Preview flotante que sigue al cursor ──
  useEffect(() => {
    const onMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useEffect(() => {
    const el = previewRef.current;
    if (!preview || !el) return;

    gsap.set(el, {
      x: mouseRef.current.x + 26,
      y: mouseRef.current.y - 70,
      rotation: 0,
      opacity: 0,
      scale: 0.92,
    });
    gsap.to(el, { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' });

    const xTo = gsap.quickTo(el, 'x',        { duration: 0.45, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y',        { duration: 0.45, ease: 'power3' });
    const rTo = gsap.quickTo(el, 'rotation', { duration: 0.6,  ease: 'power3' });

    let lastX = mouseRef.current.x;
    let settle;
    const onMove = (e) => {
      xTo(e.clientX + 26);
      yTo(e.clientY - 70);
      rTo(Math.max(-9, Math.min(9, (e.clientX - lastX) * 0.7)));
      lastX = e.clientX;
      clearTimeout(settle);
      settle = setTimeout(() => rTo(0), 90);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      clearTimeout(settle);
      window.removeEventListener('pointermove', onMove);
    };
  }, [preview]);

  const canHover = typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const hoverProps = (item) => canHover
    ? {
        onMouseEnter: () => setPreview(item),
        onMouseLeave: () => setPreview(null),
      }
    : {};

  const previewImg = preview ? imageFor(preview.id) : null;

  return (
    <section id="achievements" ref={containerRef} className="pt-6 pb-5 md:pt-8 md:pb-6">
      <div className="max-w-6xl mx-auto px-4 md:px-6">

        {/* ── Header ── */}
        <div className="mb-10 md:mb-14">
          <p data-anim="eyebrow" className="font-mono text-xs uppercase tracking-[0.25em] text-brand-400 mb-2">
            {t('achievements.label')}
          </p>
          <h2 data-anim="title" className="text-3xl md:text-4xl font-semibold text-white">
            {t('achievements.heading')}{' '}
            <em className="not-italic accent-subtle">{t('achievements.heading.accent')}</em>
          </h2>
        </div>

        {/* ── Camino serpenteante ── */}
        <div ref={wrapRef} className="relative max-w-4xl mx-auto py-2">
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
          >
            <path ref={railRef} fill="none" stroke="#262626" strokeWidth="1" />
            <path ref={progRef} fill="none" stroke="rgba(124, 58, 237, 0.55)" strokeWidth="1.5" />
          </svg>

          <div className="relative flex flex-col gap-14 md:gap-20">
            {TIMELINE.map((item, i) => {
              const right = i % 2 === 1;
              return (
                <div
                  key={item.id}
                  data-side={right ? 'right' : 'left'}
                  className={`tl-item relative flex ${right ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`relative max-w-md ${right ? 'pr-7 md:pr-9 text-right' : 'pl-7 md:pl-9'}`}
                    {...hoverProps(item)}
                  >
                    <span
                      ref={(el) => { dotRefs.current[i] = el; }}
                      className={`tl-dot absolute top-[7px] ${right ? 'right-0' : 'left-0'} block w-[11px] h-[11px] rounded-full border-2 border-brand-400 bg-neutral-950`}
                      aria-hidden="true"
                    />

                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500 mb-1">
                      {item.date}
                    </p>

                    {item.type === 'nasa' && (
                      <>
                        <h3 className="text-lg md:text-xl text-white font-semibold leading-snug">
                          {item.title}{' '}
                          <em className="not-italic accent-subtle">{item.accent}</em>
                        </h3>
                        <p className="text-neutral-400 text-sm mt-1">
                          {t('achievements.nasa.desc.pre')}
                          <span className="text-neutral-300">{item.result}</span>
                          {t('achievements.nasa.desc.post')}
                        </p>
                        <ScrambleButton
                          onClick={() => setNasaModal(true)}
                          className="font-mono text-xs text-brand-400 hover:text-brand-300 transition-colors duration-200 mt-2"
                        >
                          {t('achievements.nasa.cta')}
                        </ScrambleButton>
                      </>
                    )}

                    {item.type === 'hack' && (
                      <Link to="/hackathons" className={`group block ${right ? 'ml-auto' : ''} w-fit`}>
                        <h3 className="text-lg md:text-xl text-white font-semibold leading-snug">
                          {item.title}{' '}
                          <em className="not-italic accent-subtle">{item.accent}</em>
                          <span
                            aria-hidden="true"
                            className="inline-block ml-2 text-neutral-600 group-hover:text-brand-400 group-hover:translate-x-1 transition-all duration-200 text-base"
                          >
                            →
                          </span>
                        </h3>
                        <p className="font-mono text-xs text-neutral-500 mt-1">{item.result}</p>
                      </Link>
                    )}

                    {item.type === 'icatech' && (
                      <>
                        <button
                          type="button"
                          onClick={() => setIcatechOpen((v) => !v)}
                          aria-expanded={icatechOpen}
                          className={`group text-left ${right ? 'ml-auto' : ''} w-fit`}
                        >
                          <h3 className="text-lg md:text-xl text-white font-semibold leading-snug">
                            {item.title}{' '}
                            <em className="not-italic accent-subtle">{item.accent}</em>
                            <span
                              aria-hidden="true"
                              className={`inline-block ml-2 text-neutral-600 group-hover:text-brand-400 transition-all duration-300 text-base ${
                                icatechOpen ? 'rotate-45 text-brand-400' : ''
                              }`}
                            >
                              +
                            </span>
                          </h3>
                          <p className="font-mono text-xs text-neutral-500 mt-1">
                            {t('achievements.icatech.line')}
                          </p>
                        </button>
                        <div
                          className="grid"
                          style={{
                            gridTemplateRows: icatechOpen ? '1fr' : '0fr',
                            transition: 'grid-template-rows 0.4s cubic-bezier(0.33, 1, 0.68, 1)',
                          }}
                        >
                          <div className="overflow-hidden">
                            <ul className="mt-3 space-y-1.5">
                              {ICATECH_HOURS.map((hours, j) => (
                                <li
                                  key={j}
                                  className={`flex items-baseline gap-3 text-sm text-neutral-400 ${right ? 'justify-end' : ''}`}
                                >
                                  <span aria-hidden="true" className="text-neutral-600">→</span>
                                  <span>{t(`achievements.icatech.course.${j}`)}</span>
                                  <span className="font-mono text-[11px] text-neutral-600">{hours}h</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Cierre: bitácora */}
            <div className="tl-item relative flex justify-start" data-side="left">
              <div className="relative pl-7 md:pl-9">
                <span
                  ref={(el) => { dotRefs.current[TIMELINE.length] = el; }}
                  className="tl-dot absolute top-[4px] left-0 block w-[11px] h-[11px] rounded-full bg-brand-400"
                  aria-hidden="true"
                />
                <Link
                  to="/hackathons"
                  className="font-mono text-xs text-brand-400 hover:text-brand-300 transition-colors duration-200"
                >
                  {t('achievements.hacks.cta')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Preview flotante (hover) ── */}
        {preview && canHover && (
          <div
            ref={previewRef}
            className="fixed left-0 top-0 z-[60] w-64 pointer-events-none"
            aria-hidden="true"
          >
            {previewImg ? (
              <div className="rounded-md overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-900">
                <img src={previewImg} alt="" className="w-full h-auto block" />
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-neutral-700 bg-neutral-950/90 shadow-2xl aspect-[4/3] flex items-center justify-center">
                <span className="font-mono text-[11px] text-neutral-500 px-4 text-center">
                  {preview.title} {preview.accent}
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── NASA Modal ── */}
        {nasaModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setNasaModal(false)}
          >
            <div
              className="relative max-w-2xl w-full bg-neutral-900 border border-neutral-800 rounded-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setNasaModal(false)}
                className="absolute top-3 right-3 text-neutral-500 hover:text-white transition-colors duration-200 font-mono text-xs z-10"
              >
                {t('achievements.nasa.close')}
              </button>
              <img
                src={nasaImg}
                alt="NASA Space Apps Challenge Certificate"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
