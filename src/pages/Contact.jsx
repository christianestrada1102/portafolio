import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';
import { revealHeaders } from '../utils/sectionReveal';

gsap.registerPlugin(ScrollTrigger);

const EMAIL   = 'christianestrada1102.dev@gmail.com';
const CAL_URL = 'https://cal.com/christian-estrada-nas/llamada-de-trabajo';
const CV_PATH = { es: '/cv-christian-estrada-es.pdf', en: '/cv-christian-estrada-en.pdf' };

export default function Contact() {
  const containerRef = useRef(null);
  const { t, lang } = useLanguage();

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      revealHeaders(containerRef.current);
      gsap.utils.toArray('[data-reveal]', containerRef.current).forEach((el, i) => {
        gsap.from(el, {
          y: 20, opacity: 0, duration: 0.5, ease: 'power2.out', delay: i * 0.08,
          scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' },
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={containerRef} className="py-20 md:py-36">
      <div className="max-w-2xl mx-auto px-6 md:px-6 flex flex-col items-center text-center gap-10">

        {/* ── Heading ── */}
        <div data-reveal>
          <h2 className="text-[clamp(3.5rem,9vw,6rem)] font-semibold leading-none tracking-tight text-white">
            {t('contact.heading')}
          </h2>
          <p className="text-neutral-500 text-sm mt-4 leading-relaxed max-w-xs mx-auto">
            {t('contact.description')}
          </p>
        </div>

        {/* ── CTAs ── */}
        <div data-reveal className="w-full flex flex-col divide-y divide-neutral-800/70 mt-2">
          <a
            href={`https://mail.google.com/mail/?view=cm&to=${EMAIL}&su=Hola Christian`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between py-4 text-white hover:text-neutral-300 transition-colors duration-200"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em]">{t('contact.cta.message')}</span>
            <svg className="w-3.5 h-3.5 -rotate-45 opacity-30 group-hover:opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>

          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between py-4 text-neutral-400 hover:text-white transition-colors duration-200"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em]">{t('contact.cta.schedule')}</span>
            <svg className="w-3.5 h-3.5 -rotate-45 opacity-30 group-hover:opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>

          <a
            href={CV_PATH[lang] ?? CV_PATH.es}
            download
            className="group flex items-center justify-between py-4 text-neutral-400 hover:text-white transition-colors duration-200"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em]">{t('contact.cta.cv')}</span>
            <svg className="w-3.5 h-3.5 opacity-30 group-hover:opacity-80 group-hover:translate-y-0.5 transition-all duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 15V3M7 10l5 5 5-5M3 17v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"/>
            </svg>
          </a>
        </div>

        {/* ── Email ── */}
        <div data-reveal>
          <a
            href={`https://mail.google.com/mail/?view=cm&to=${EMAIL}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors duration-200"
          >
            {EMAIL}
          </a>
        </div>

      </div>
    </section>
  );
}
