import { useRef, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ScrambleButton from '../components/ScrambleButton';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { FiExternalLink } from 'react-icons/fi';
import nasaImg      from '../assets/nasa-space-apps.webp';
import etherfuseImg from '../assets/etherfuse.webp';
import baseImg      from '../assets/base.webp';
import ensImg       from '../assets/ens.webp';
import ubdImg       from '../assets/UBD.webp';
import ethmexicoImg from '../assets/ethmexico.gif';
import { useLanguage } from '../context/LanguageContext';
import { revealHeaders } from '../utils/sectionReveal';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 4,   suffix: '',  labelKey: 'achievements.stats.0' },
  { value: 250, suffix: '+', labelKey: 'achievements.stats.1' },
  { value: 7,   suffix: '',  labelKey: 'achievements.stats.2' },
  { value: 1,   suffix: '',  labelKey: 'achievements.stats.3' },
];

const HACKATHONS = [
  { date: 'Oct 2025', name: 'NASA Space Apps',  accent: 'Challenge', result: 'Galactic Problem Solver' },
  { date: 'Nov 2025', name: 'ETH Mexico',        accent: 'MTY',       result: 'SettArb · producción' },
  { date: '2025',     name: 'MIT',               accent: 'ICATECH',   result: 'SafeZone · MVP en 48h' },
  { date: '2026',     name: 'hack@',             accent: 'latam',     result: 'HAVEN · producción' },
];

const POAPS = [
  { img: etherfuseImg, name: 'Etherfuse',                event: 'ETH Mexico 2025',   date: 'Oct 2025' },
  { img: baseImg,      name: 'Base',                     event: 'ETH Mexico 2025',   date: 'Oct 2025' },
  { img: ensImg,       name: 'ENS',                      event: 'ETH Mexico 2025',   date: 'Oct 2025' },
  { img: ubdImg,       name: 'University Blockchain Day',event: 'UBD',               date: 'Sep 2025' },
  { img: ethmexicoImg, name: 'EthMexico MTY 2025',       event: 'EthMexico MTY',     date: 'Nov 2025' },
];

export default function Achievements() {
  const containerRef            = useRef(null);
  const [nasaModal, setNasaModal] = useState(false);
  const { t }                   = useLanguage();

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      revealHeaders(containerRef.current);

      gsap.utils.toArray('[data-reveal]', containerRef.current).forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.65,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });
      });

      // Count-up de los counters al entrar en viewport
      gsap.utils.toArray('.stat-num', containerRef.current).forEach((el) => {
        const end = parseFloat(el.dataset.value);
        const suffix = el.dataset.suffix || '';
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => { el.textContent = `${Math.round(obj.v)}${suffix}`; },
        });
      });

      gsap.from('.poap-item', {
        scale: 0.85,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power2.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: '.poap-grid',
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="achievements" ref={containerRef} className="pt-6 pb-5 md:pt-8 md:pb-6">
      <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-12">

        {/* ── Header ── */}
        <div>
          <p data-anim="eyebrow" className="font-mono text-xs uppercase tracking-[0.25em] text-brand-400 mb-2">
            {t('achievements.label')}
          </p>
          <h2 data-anim="title" className="text-3xl md:text-4xl font-semibold text-white">
            {t('achievements.heading')}{' '}
            <em className="not-italic accent-subtle">{t('achievements.heading.accent')}</em>
          </h2>
        </div>

        {/* ── Hackathons + Destacado/ICATECH en dos columnas ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">

          {/* Hackathons → bitácora */}
          <div data-reveal className="md:col-span-7">
            <div className="flex items-baseline justify-between mb-6">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400">
                {t('achievements.hacks.label')}
              </p>
              <Link
                to="/hackathons"
                className="font-mono text-xs text-brand-400 hover:text-brand-300 transition-colors duration-200"
              >
                {t('achievements.hacks.cta')}
              </Link>
            </div>
            <div className="border-t border-neutral-800">
              {HACKATHONS.map((h) => (
                <Link
                  key={h.name + h.accent}
                  to="/hackathons"
                  className="group flex items-baseline justify-between gap-4 border-b border-neutral-800 px-1 py-4 hover:bg-neutral-800/30 transition-colors duration-200"
                >
                  <span className="flex items-baseline gap-4 min-w-0">
                    <span className="font-mono text-[11px] text-neutral-500 shrink-0 w-16">{h.date}</span>
                    <span className="text-white text-sm md:text-base font-medium truncate">
                      {h.name}{' '}
                      <em className="not-italic accent-subtle">{h.accent}</em>
                    </span>
                  </span>
                  <span className="flex items-baseline gap-3 shrink-0">
                    <span className="font-mono text-[11px] text-neutral-500 hidden sm:inline">{h.result}</span>
                    <span
                      aria-hidden="true"
                      className="text-neutral-600 group-hover:text-brand-400 group-hover:translate-x-1 transition-all duration-200 inline-block"
                    >
                      →
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Destacado + ICATECH */}
          <div className="md:col-span-5 space-y-6">
            <div data-reveal>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400 mb-6">
                {t('achievements.featured')}
              </p>
              <div className="bg-neutral-900 border border-neutral-800 hover:border-brand-500/40 rounded-sm transition-all duration-300">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-white text-base leading-tight">
                      {t('achievements.nasa.title')}
                    </h3>
                    <span className="font-mono text-xs text-neutral-400 shrink-0">
                      {t('achievements.nasa.date')}
                    </span>
                  </div>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                    {t('achievements.nasa.desc.pre')}
                    <span className="text-neutral-300">"Galactic Problem Solver"</span>
                    {t('achievements.nasa.desc.post')}
                  </p>
                  <ScrambleButton
                    onClick={() => setNasaModal(true)}
                    className="font-mono text-xs text-brand-400 hover:text-brand-300 transition-colors duration-200"
                  >
                    {t('achievements.nasa.cta')}
                  </ScrambleButton>
                </div>
              </div>
            </div>

            {/* Counters animados */}
            <div data-reveal className="grid grid-cols-2 gap-x-6 gap-y-7 pt-2">
              {STATS.map((stat) => (
                <div key={stat.labelKey}>
                  <p
                    className="stat-num font-mono text-3xl md:text-4xl text-white leading-none"
                    data-value={stat.value}
                    data-suffix={stat.suffix}
                  >
                    {stat.value}{stat.suffix}
                  </p>
                  <p className="text-neutral-500 text-xs mt-2 leading-snug">
                    {t(stat.labelKey)}
                  </p>
                </div>
              ))}
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

        {/* ── POAPs ── */}
        <div data-reveal>
          <div className="flex items-baseline justify-between mb-6">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-500">
              {t('achievements.poaps.label')}
            </p>
            <a
              href="https://collectors.poap.xyz/scan/christianmanuel1233@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs text-brand-400 hover:text-brand-300 transition-colors duration-200"
            >
              {t('achievements.poaps.cta')} <FiExternalLink size={11} />
            </a>
          </div>
          <div className="poap-grid flex flex-wrap gap-4">
            {POAPS.map(({ img, name, date }) => (
              <div key={name} className="poap-item flex flex-col items-center gap-2 group cursor-default opacity-70 hover:opacity-100 transition-opacity duration-200">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-neutral-800 group-hover:border-brand-500/40 transition-all duration-200 group-hover:scale-105">
                  <img
                    src={img}
                    alt={name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    width="64"
                    height="64"
                  />
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-neutral-400 font-medium leading-tight">{name}</p>
                  <p className="text-[9px] font-mono text-neutral-500">{date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
