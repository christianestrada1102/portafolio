import { useRef, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import nasaImg from '../assets/nasa-space-apps.webp';
import nasaPhoto from '../assets/hacks/nasa.jpeg';
import ethPhoto from '../assets/hacks/ethereum.jpeg';
import mitPhoto from '../assets/hacks/mit.jpeg';
import latamPhoto from '../assets/hacks/hack@latam.jpeg';
import certPensamiento from '../assets/icatech/pensamiento.png';
import certComunicacion from '../assets/icatech/comunicacion.png';
import certEmprender from '../assets/icatech/emprender.png';
import certEstrategias from '../assets/icatech/estrategias.png';
import { useLanguage } from '../context/LanguageContext';
import { revealHeaders } from '../utils/sectionReveal';

gsap.registerPlugin(ScrollTrigger);

const ICATECH_HOURS = [40, 10, 10, 10, 10];
// Certificados por módulo (autogestión aún sin archivo)
const ICATECH_CERTS = [certPensamiento, certComunicacion, certEmprender, null, certEstrategias];

// Encuadre por imagen: `pos` es object-position (horizontal vertical).
// Ajusta el % vertical para subir/bajar el recorte de cada foto por separado.
const ROW_IMAGES = {
  // Certificados reales como fondo
  'cert-nasa': { src: nasaImg,         pos: 'center 40%' },
  icatech:     { src: certPensamiento, pos: 'center 40%' },
  // Hackatones
  nasa:  { src: nasaPhoto,  pos: 'center 19%' },
  eth:   { src: ethPhoto,   pos: 'center 38%' },
  mit:   { src: mitPhoto,   pos: 'center 45%' },
  latam: { src: latamPhoto, pos: 'center 22%' },
};

// Grupo 1: certificaciones · Grupo 2: hackathons
const CERTS = [
  { id: 'cert-nasa', date: 'Oct 2025', title: 'Galactic Problem', accent: 'Solver',       result: 'NASA Space Apps' },
  { id: 'icatech', date: '2025',     title: 'MIT',              accent: 'ICATECH 2025', result: '80h · 5 módulos' },
];
const HACKS = [
  { id: 'nasa',  date: 'Oct 2025', title: 'NASA Space Apps', accent: 'Challenge', result: 'Yuyin · MVP en 48h' },
  { id: 'eth',   date: 'Nov 2025', title: 'ETH Mexico',      accent: 'MTY',       result: 'SettArb · MVP en 54h' },
  { id: 'mit',   date: '2025',     title: 'MIT',             accent: 'ICATECH',   result: 'SafeZone · MVP en 48h' },
  { id: 'latam', date: '2026',     title: 'hack@',           accent: 'latam',     result: 'HAVEN · producción' },
];

export default function Achievements() {
  const containerRef = useRef(null);

  const [imgModal, setImgModal]       = useState(null); // { src, alt }
  const [icatechOpen, setIcatechOpen] = useState(false);
  const { t } = useLanguage();

  // ── Acordeón: las filas se despliegan en 3D ligadas al scroll ──
  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      revealHeaders(containerRef.current);

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

  // ── Fondo de fila: imagen que se revela al hover ──
  const rowBg = (item) => {
    const img = ROW_IMAGES[item.id];
    if (!img) return null;
    return (
      <span aria-hidden="true" className="ach-bg absolute inset-0 -z-10 pointer-events-none">
        <img
          src={img.src}
          alt=""
          className="w-full h-full object-cover"
          style={{ objectPosition: img.pos }}
          loading="lazy"
          decoding="async"
        />
        {/* Degradado para mantener legible el texto */}
        <span className="ach-bg-fade absolute inset-0" />
      </span>
    );
  };

  // ── Contenido común de cada fila ──
  const rowInner = (item) => (
    <>
      <span className="ach-date font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500 shrink-0 w-20 md:w-24 pt-2 md:pt-4">
        {item.date}
      </span>
      <span className="ach-title flex-1 min-w-0 font-semibold text-white leading-[1.05]"
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

  const groupLabel = (text) => (
    <p className="font-mono text-xs md:text-sm uppercase tracking-[0.35em] text-brand-400 pt-10 pb-3 flex items-center gap-3">
      <span aria-hidden="true" className="inline-block w-8 h-px bg-brand-500/60" />
      {text}
    </p>
  );

  return (
    <section id="achievements" ref={containerRef} className="pt-6 pb-5 md:pt-8 md:pb-6">
      <div className="max-w-6xl mx-auto px-4 md:px-6 mb-4 md:mb-6">
        <p data-anim="eyebrow" className="font-mono text-xs uppercase tracking-[0.25em] text-brand-400 mb-2">
          {t('achievements.label')}
        </p>
        <h2 data-anim="title" className="text-3xl md:text-4xl font-semibold text-white">
          {t('achievements.heading')}{' '}
          <em className="not-italic accent-subtle">{t('achievements.heading.accent')}</em>
        </h2>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6">

        {/* ── Certificaciones ── */}
        {groupLabel(t('achievements.group.certs'))}
        <div className="border-t border-neutral-800" style={{ perspective: '1200px' }}>

          {/* NASA */}
          <button
            type="button"
            onClick={() => setImgModal({ src: nasaImg, alt: 'NASA Space Apps Challenge Certificate' })}
            className="ach-row group relative isolate overflow-hidden w-full text-left flex items-start gap-4 md:gap-8 border-b border-neutral-800 py-5 md:py-7"
          >
            {rowBg(CERTS[0])}
            {rowInner(CERTS[0])}
            <span
              aria-hidden="true"
              className="ach-cta shrink-0 pt-2 md:pt-4 font-mono text-[11px] uppercase tracking-[0.15em] text-neutral-600 group-hover:text-brand-400 transition-colors duration-300"
            >
              {t('achievements.nasa.cta')}
            </span>
          </button>

          {/* MIT ICATECH 2025 (expandible con certificados) */}
          <div className="ach-row group relative isolate overflow-hidden border-b border-neutral-800">
            {rowBg(CERTS[1])}
            <button
              type="button"
              onClick={() => setIcatechOpen((v) => !v)}
              aria-expanded={icatechOpen}
              className="w-full text-left flex items-start gap-4 md:gap-8 py-5 md:py-7"
            >
              {rowInner(CERTS[1])}
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
                  {ICATECH_HOURS.map((hours, j) => {
                    const cert = ICATECH_CERTS[j];
                    const inner = (
                      <>
                        <span aria-hidden="true" className="text-neutral-600">→</span>
                        <span>{t(`achievements.icatech.course.${j}`)}</span>
                        <span className="font-mono text-[11px] text-neutral-600">{hours}h</span>
                      </>
                    );
                    return (
                      <li key={j} className="text-sm text-neutral-400">
                        {cert ? (
                          <button
                            type="button"
                            onClick={() => setImgModal({ src: cert, alt: t(`achievements.icatech.course.${j}`) })}
                            className="flex items-baseline gap-3 text-left hover:text-neutral-200 transition-colors duration-200 group/cert"
                          >
                            {inner}
                            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-neutral-600 group-hover/cert:text-brand-400 transition-colors duration-200">
                              {t('achievements.icatech.view')}
                            </span>
                          </button>
                        ) : (
                          <span className="flex items-baseline gap-3">{inner}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ── Hackathons ── */}
        {groupLabel(t('achievements.group.hacks'))}
        <div className="border-t border-neutral-800" style={{ perspective: '1200px' }}>
          {HACKS.map((item) => (
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
          ))}

          {/* Cierre: bitácora */}
          <Link
            to="/hackathons"
            className="ach-banner group flex items-baseline justify-between gap-6 py-6 md:py-8"
          >
            <span className="min-w-0">
              <span
                className="block font-semibold text-white leading-[1.05]"
                style={{ fontSize: 'clamp(1.7rem, 4.5vw, 3.4rem)' }}
              >
                {t('achievements.hacks.banner.pre')}{' '}
                <em className="not-italic accent-subtle underline decoration-1 underline-offset-8 decoration-brand-500/40 group-hover:decoration-brand-400 transition-colors duration-300">
                  {t('achievements.hacks.banner.accent')}
                </em>
              </span>
              <span className="block text-neutral-400 text-sm mt-1.5">
                {t('achievements.hacks.banner.sub')}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="shrink-0 text-xl md:text-2xl text-neutral-500 group-hover:text-brand-400 group-hover:translate-x-1.5 transition-all duration-300"
            >
              →
            </span>
          </Link>
        </div>
      </div>

      {/* ── Modal de certificado ── */}
      {imgModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setImgModal(null)}
        >
          <div
            className="relative max-w-2xl w-full max-h-[88vh] bg-neutral-900 border border-neutral-800 rounded-sm overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setImgModal(null)}
              className="sticky top-3 float-right mr-3 text-neutral-500 hover:text-white transition-colors duration-200 font-mono text-xs z-10 bg-neutral-900/80 px-2 py-1 rounded-sm"
            >
              {t('achievements.nasa.close')}
            </button>
            <img
              src={imgModal.src}
              alt={imgModal.alt}
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </section>
  );
}
