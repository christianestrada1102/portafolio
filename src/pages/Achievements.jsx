import { useRef, useLayoutEffect, useState } from 'react';
import ScrambleButton from '../components/ScrambleButton';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { FiExternalLink } from 'react-icons/fi';
import nasaImg      from '../assets/nasa-space-apps.jpg';
import etherfuseImg from '../assets/etherfuse.webp';
import baseImg      from '../assets/base.webp';
import ensImg       from '../assets/ens.webp';
import ubdImg       from '../assets/UBD.webp';
import ethmexicoImg from '../assets/ethmexico.gif';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const ICATECH_HOURS = [40, 10, 10, 10, 10];

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
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
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
        <div data-reveal>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand-400 mb-2">
            {t('achievements.label')}
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white">
            {t('achievements.heading')}{' '}
            <em className="not-italic accent-subtle">{t('achievements.heading.accent')}</em>
          </h2>
        </div>

        {/* ── NASA ── */}
        <div data-reveal>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400 mb-6">
            {t('achievements.featured')}
          </p>
          <div className="max-w-md bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-sm transition-all duration-300">
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

        {/* ── ICATECH ── */}
        <div data-reveal>
          <div className="flex items-baseline justify-between mb-6">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-500">
              {t('achievements.icatech.label')}
            </p>
            <span className="font-mono text-xs text-neutral-400">
              {t('achievements.icatech.total')}
            </span>
          </div>
          <div className="w-full bg-neutral-900 border border-neutral-800 rounded-sm overflow-hidden divide-y divide-neutral-800">
            {ICATECH_HOURS.map((hours, i) => (
              <div key={i} className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-neutral-800/40 transition-colors duration-150">
                <span className="text-neutral-300 text-sm leading-snug">
                  {t(`achievements.icatech.course.${i}`)}
                </span>
                <span className="font-mono text-xs text-neutral-400 shrink-0">{hours}h</span>
              </div>
            ))}
          </div>
        </div>

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
              <div key={name} className="poap-item flex flex-col items-center gap-2 group cursor-default">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-neutral-800 group-hover:border-brand-500/40 transition-all duration-200 group-hover:scale-105">
                  <img
                    src={img}
                    alt={name}
                    className="w-full h-full object-cover"
                    loading="lazy"
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
