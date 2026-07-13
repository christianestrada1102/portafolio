import { useRef, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  { id: 'latam',   date: '2026',     title: 'hack@',           accent: 'latam',     result: 'HAVEN · producción',       type: 'hack' },
];

export default function Achievements() {
  const containerRef = useRef(null);

  const [nasaModal, setNasaModal]     = useState(false);
  const [icatechOpen, setIcatechOpen] = useState(false);
  const { t } = useLanguage();

  // ── Entrada scroll-triggered de las filas ──
  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      revealHeaders(containerRef.current);

      // Acordeón: las filas están plegadas en 3D (como papel) y se van
      // desplegando ligadas al scroll, alternando la bisagra arriba/abajo
      gsap.utils.toArray('.ach-row', containerRef.current).forEach((el, i) => {
        const hingeTop = i % 2 === 0;
        gsap.fromTo(
          el,
          {
            rotationX: hingeTop ? -72 : 72,
            transformOrigin: hingeTop ? '50% 0%' : '50% 100%',
            opacity: 0.1,
          },
          {
            rotationX: 0,
            opacity: 1,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: 'top 97%',
              end: 'top 68%',
              scrub: true,
            },
          }
        );
      });

      // Banner de la bitácora
      const banner = containerRef.current.querySelector('.ach-banner');
      if (banner) {
        gsap.from(banner, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: { trigger: banner, start: 'top 92%', once: true },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ── Fondo de cada fila: imagen que se revela al hover ──
  const rowBg = (item) => {
    const img = imageFor(item.id);
    return (
      <span aria-hidden="true" className="ach-bg absolute inset-0 -z-10 pointer-events-none">
        {img ? (
          <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
        ) : (
          <span
            className="absolute inset-0"
            style={{ background: 'radial-gradient(60% 150% at 72% 50%, rgba(124, 58, 237, 0.3), transparent 70%)' }}
          />
        )}
        {/* Degradado para mantener legible el texto */}
        <span
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, var(--bg) 0%, transparent 38%, transparent 72%, var(--bg) 100%)' }}
        />
      </span>
    );
  };

  // ── Contenido común de cada fila ──
  const rowInner = (item) => (
    <>
      <span className="ach-date font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500 shrink-0 w-20 md:w-24 pt-2 md:pt-4">
        {item.date}
      </span>
      <span className="ach-title flex-1 min-w-0 font-semibold text-white leading-[1.05] transition-transform duration-300"
        style={{ fontSize: 'clamp(1.7rem, 4.5vw, 3.4rem)' }}
      >
        {item.title}{' '}
        <em className="not-italic accent-subtle">{item.accent}</em>
      </span>
      {item.result && (
        <span className="ach-result hidden md:block font-mono text-xs text-neutral-500 shrink-0 pt-4 max-w-[220px] text-right">
          {item.result}
        </span>
      )}
    </>
  );

  return (
    <section id="achievements" ref={containerRef} className="pt-6 pb-5 md:pt-8 md:pb-6">
      <div className="max-w-6xl mx-auto px-4 md:px-6 mb-8 md:mb-10">
        <p data-anim="eyebrow" className="font-mono text-xs uppercase tracking-[0.25em] text-brand-400 mb-2">
          {t('achievements.label')}
        </p>
        <h2 data-anim="title" className="text-3xl md:text-4xl font-semibold text-white">
          {t('achievements.heading')}{' '}
          <em className="not-italic accent-subtle">{t('achievements.heading.accent')}</em>
        </h2>
      </div>

      {/* ── Lista tipográfica ── */}
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="border-t border-neutral-800" style={{ perspective: '1200px' }}>

          {TIMELINE.map((item) => {
            if (item.type === 'hack') {
              return (
                <Link
                  key={item.id}
                  to="/hackathons"
                  className="ach-row group relative isolate overflow-hidden flex items-start gap-4 md:gap-8 border-b border-neutral-800 py-5 md:py-7"
                >
                  {rowBg(item)}
                  {rowInner(item)}
                  <span
                    aria-hidden="true"
                    className="ach-cta shrink-0 pt-2 md:pt-4 text-neutral-600 group-hover:text-brand-400 group-hover:translate-x-1.5 transition-all duration-300 text-xl md:text-2xl"
                  >
                    →
                  </span>
                </Link>
              );
            }

            if (item.type === 'nasa') {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setNasaModal(true)}
                  className="ach-row group relative isolate overflow-hidden w-full text-left flex items-start gap-4 md:gap-8 border-b border-neutral-800 py-5 md:py-7"
                >
                  {rowBg(item)}
                  {rowInner(item)}
                  <span
                    aria-hidden="true"
                    className="ach-cta shrink-0 pt-2 md:pt-4 font-mono text-[11px] uppercase tracking-[0.15em] text-neutral-600 group-hover:text-brand-400 transition-colors duration-300"
                  >
                    {t('achievements.nasa.cta')}
                  </span>
                </button>
              );
            }

            // icatech: fila expandible
            return (
              <div key={item.id} className="ach-row group relative isolate overflow-hidden border-b border-neutral-800">
                {rowBg(item)}
                <button
                  type="button"
                  onClick={() => setIcatechOpen((v) => !v)}
                  aria-expanded={icatechOpen}
                  className="w-full text-left flex items-start gap-4 md:gap-8 py-5 md:py-7"
                >
                  <span className="ach-date font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500 shrink-0 w-20 md:w-24 pt-2 md:pt-4">
                    {item.date}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span
                      className="ach-title block font-semibold text-white leading-[1.05]"
                      style={{ fontSize: 'clamp(1.7rem, 4.5vw, 3.4rem)' }}
                    >
                      {item.title}{' '}
                      <em className="not-italic accent-subtle">{item.accent}</em>
                    </span>
                    <span className="block font-mono text-xs text-neutral-500 mt-2">
                      {t('achievements.icatech.line')}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`shrink-0 pt-2 md:pt-4 text-neutral-600 group-hover:text-brand-400 transition-all duration-300 text-xl md:text-2xl ${
                      icatechOpen ? 'rotate-45 text-brand-400' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className="grid"
                  style={{
                    gridTemplateRows: icatechOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows 0.4s cubic-bezier(0.33, 1, 0.68, 1)',
                  }}
                >
                  <div className="overflow-hidden">
                    <ul className="pb-6 pl-24 md:pl-32 space-y-1.5">
                      {ICATECH_HOURS.map((hours, j) => (
                        <li key={j} className="flex items-baseline gap-3 text-sm text-neutral-400">
                          <span aria-hidden="true" className="text-neutral-600">→</span>
                          <span>{t(`achievements.icatech.course.${j}`)}</span>
                          <span className="font-mono text-[11px] text-neutral-600">{hours}h</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Banner: invitación a la bitácora ── */}
        <Link
          to="/hackathons"
          className="ach-banner group relative isolate overflow-hidden flex items-center justify-between gap-6 border-b border-neutral-800 py-8 md:py-12"
        >
          <span
            aria-hidden="true"
            className="ach-bg absolute inset-0 -z-10 pointer-events-none"
          >
            <span
              className="absolute inset-0"
              style={{ background: 'radial-gradient(70% 200% at 30% 50%, rgba(124, 58, 237, 0.22), transparent 70%)' }}
            />
          </span>
          <span className="min-w-0">
            <span className="block font-mono text-[11px] uppercase tracking-[0.25em] text-brand-400 mb-2">
              {t('achievements.hacks.label')}
            </span>
            <span
              className="block font-semibold text-white leading-[1.05]"
              style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)' }}
            >
              {t('achievements.hacks.banner.pre')}{' '}
              <em className="not-italic accent-subtle">{t('achievements.hacks.banner.accent')}</em>
            </span>
            <span className="block text-neutral-400 text-sm mt-2">
              {t('achievements.hacks.banner.sub')}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full border border-neutral-700 flex items-center justify-center text-xl md:text-2xl text-neutral-400 group-hover:border-brand-400 group-hover:text-brand-400 group-hover:translate-x-2 transition-all duration-300"
          >
            →
          </span>
        </Link>
      </div>

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
    </section>
  );
}
