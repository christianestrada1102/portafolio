import { useRef, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ScrambleButton from '../components/ScrambleButton';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import nasaImg from '../assets/nasa-space-apps.webp';
import { useLanguage } from '../context/LanguageContext';
import { revealHeaders } from '../utils/sectionReveal';

gsap.registerPlugin(ScrollTrigger);

const ICATECH_HOURS = [40, 10, 10, 10, 10];

// Timeline estilo git log: cada logro es un commit con hash y tag
const TIMELINE = [
  { id: 'nasa',    hash: 'a3f9c2e', date: 'Oct 2025', title: 'NASA Space Apps', accent: 'Challenge', result: '"Galactic Problem Solver"', tag: 'galactic-problem-solver', type: 'nasa' },
  { id: 'eth',     hash: '7e21b4d', date: 'Nov 2025', title: 'ETH Mexico',      accent: 'MTY',       result: 'SettArb · producción',      tag: 'settarb@prod',            type: 'hack' },
  { id: 'mit',     hash: 'c58a91f', date: '2025',     title: 'MIT',             accent: 'ICATECH',   result: 'SafeZone · MVP en 48h',     tag: 'safezone-mvp',            type: 'hack' },
  { id: 'icatech', hash: 'f04d7a3', date: '2025',     title: 'ICATECH',         accent: '2025',      result: null,                        tag: 'soft-skills-80h',         type: 'icatech' },
  { id: 'latam',   hash: '9b3e6c1', date: '2026',     title: 'hack@',           accent: 'latam',     result: 'HAVEN · producción',        tag: 'haven@prod',              type: 'hack', head: true },
];

export default function Achievements() {
  const containerRef              = useRef(null);
  const [nasaModal, setNasaModal] = useState(false);
  const [icatechOpen, setIcatechOpen] = useState(false);
  const { t }                     = useLanguage();

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      revealHeaders(containerRef.current);

      // La línea se dibuja conforme avanzas por la sección
      gsap.fromTo(
        '.tl-progress',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: {
            trigger: '.tl-wrap',
            start: 'top 70%',
            end: 'bottom 55%',
            scrub: true,
          },
        }
      );

      // Cada nodo entra con su punto
      gsap.utils.toArray('.tl-item', containerRef.current).forEach((el) => {
        gsap.from(el, {
          x: -22,
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

    return () => ctx.revert();
  }, []);

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
          <p data-anim="copy" className="font-mono text-xs text-neutral-600 mt-4 select-none" aria-hidden="true">
            <span className="text-neutral-500">~/codebynas</span>{' '}
            <span className="text-brand-400">$</span> git log --achievements
            <span className="tl-caret" />
          </p>
        </div>

        {/* ── Timeline ── */}
        <div className="tl-wrap relative max-w-3xl pl-7 md:pl-9">
          {/* Riel + progreso */}
          <div className="absolute left-[5px] md:left-[7px] top-1 bottom-1 w-px bg-neutral-800" aria-hidden="true" />
          <div className="tl-progress absolute left-[5px] md:left-[7px] top-1 bottom-1 w-px bg-brand-500/60" aria-hidden="true" />

          <div className="flex flex-col gap-9 md:gap-11">
            {TIMELINE.map((item) => (
              <div key={item.id} className="tl-item relative">
                {/* Commit dot */}
                <span
                  className={`tl-dot absolute -left-7 md:-left-9 top-[7px] block w-[11px] h-[11px] rounded-full border-2 border-brand-400 bg-neutral-950 ${item.head ? 'tl-dot-head' : ''}`}
                  style={{ transform: 'translateX(0.5px)' }}
                  aria-hidden="true"
                />

                {/* Meta del commit */}
                <p className="font-mono text-[11px] text-neutral-500 mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-brand-400/90">{item.hash}</span>
                  <span className="uppercase tracking-[0.2em]">{item.date}</span>
                  {item.head && (
                    <span className="text-[10px] px-1.5 py-px rounded-sm border border-emerald-500/40 text-emerald-400/90 tracking-normal">
                      HEAD → main
                    </span>
                  )}
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
                    <p className="font-mono text-xs mt-2 flex flex-wrap items-center gap-3">
                      <span className="text-[10px] px-2 py-px rounded-full border border-brand-500/40 text-brand-300/90">
                        tag: {item.tag} 🏆
                      </span>
                      <ScrambleButton
                        onClick={() => setNasaModal(true)}
                        className="text-brand-400 hover:text-brand-300 transition-colors duration-200"
                      >
                        {t('achievements.nasa.cta')}
                      </ScrambleButton>
                    </p>
                  </>
                )}

                {item.type === 'hack' && (
                  <Link to="/hackathons" className="group block w-fit">
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
                    <p className="font-mono text-xs text-neutral-500 mt-1.5 flex flex-wrap items-baseline gap-2">
                      <span className="text-[10px] px-2 py-px rounded-full border border-brand-500/40 text-brand-300/90">
                        tag: {item.tag}
                      </span>
                      <span>{item.result}</span>
                    </p>
                  </Link>
                )}

                {item.type === 'icatech' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setIcatechOpen((v) => !v)}
                      aria-expanded={icatechOpen}
                      className="group text-left w-fit"
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
                      <p className="font-mono text-xs text-neutral-500 mt-1.5 flex flex-wrap items-baseline gap-2">
                        <span className="text-[10px] px-2 py-px rounded-full border border-brand-500/40 text-brand-300/90">
                          tag: {item.tag}
                        </span>
                        <span>{t('achievements.icatech.line')}</span>
                      </p>
                    </button>
                    <div
                      className="grid transition-[grid-template-rows] duration-400 ease-out"
                      style={{
                        gridTemplateRows: icatechOpen ? '1fr' : '0fr',
                        transitionTimingFunction: 'cubic-bezier(0.33, 1, 0.68, 1)',
                      }}
                    >
                      <div className="overflow-hidden">
                        <ul className="mt-3 space-y-1.5">
                          {ICATECH_HOURS.map((hours, i) => (
                            <li key={i} className="flex items-baseline gap-3 text-sm text-neutral-400">
                              <span aria-hidden="true" className="text-neutral-600">→</span>
                              <span>{t(`achievements.icatech.course.${i}`)}</span>
                              <span className="font-mono text-[11px] text-neutral-600">{hours}h</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* Cierre: bitácora */}
            <div className="tl-item relative">
              <span
                className="tl-dot absolute -left-7 md:-left-9 top-[4px] block w-[11px] h-[11px] rounded-full bg-brand-400"
                style={{ transform: 'translateX(0.5px)' }}
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
