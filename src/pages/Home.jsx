import { useRef, useLayoutEffect, useCallback } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import nasPhoto from '../assets/nas2.png';
import ScrambleButton from '../components/ScrambleButton';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef(null);
  const nameRef      = useRef(null);
  const subtitleRef  = useRef(null);
  const ctaRef       = useRef(null);
  const statsRef     = useRef(null);
  const photoWrapRef = useRef(null);
  const scrollIndRef = useRef(null);
  const { t }        = useLanguage();

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const letters = nameRef.current?.querySelectorAll('.letter-char') ?? [];

      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power2.out' } });

      tl.from(letters, { y: 60, opacity: 0, stagger: 0.022, duration: 0.55 })
        .from(subtitleRef.current, { y: 20, opacity: 0, duration: 0.45 }, '-=0.1')
        .from(ctaRef.current,      { y: 16, opacity: 0, duration: 0.35 }, '-=0.15')
        .from(statsRef.current,    { y: 10, opacity: 0, duration: 0.3  }, '-=0.1')
        .from(scrollIndRef.current,{ opacity: 0, duration: 0.4 }, '-=0.2');

      gsap.to(photoWrapRef.current, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end:   'bottom top',
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollTo = useCallback((href) => {
    const target = document.querySelector(href);
    if (!target) return;
    if (window.lenis) {
      window.lenis.scrollTo(target, { offset: -64, duration: 1.2 });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <section id="home" ref={containerRef} className="relative flex items-center pt-16 min-h-[100vh] overflow-hidden">
      {/* ── Background texture ── */}
      <div
        ref={photoWrapRef}
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      >
        <img
          src={nasPhoto}
          alt=""
          aria-hidden="true"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', opacity: 0.25 }}
          loading="eager"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 w-full py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8 items-center">

          {/* ── Text ── */}
          <div className="order-1 md:col-span-7 flex flex-col gap-4 md:gap-5" style={{ position: 'relative', zIndex: 3 }}>

            {/* Name */}
            <div ref={nameRef} aria-label="Christian Estrada" className="relative flex flex-col items-start">
              <div
                className="font-display italic text-neutral-400 leading-none tracking-tight"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 300 }}
              >
                {'Christian'.split('').map((char, i) => (
                  <span key={i} className="letter-char">{char}</span>
                ))}
              </div>
              <div
                className="accent-subtle leading-none mt-2"
                style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', fontWeight: 700 }}
              >
                {'Estrada'.split('').map((char, i) => (
                  <span key={i} className="letter-char">{char}</span>
                ))}
              </div>
            </div>

            {/* Role badge */}
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
              {t('home.role')}
            </p>

            {/* Subtitle */}
            <p ref={subtitleRef} className="text-neutral-400 font-light text-sm md:text-base leading-relaxed max-w-md">
              {t('home.subtitle.pre')}{' '}
              <span className="text-neutral-300">{t('home.location')}</span>
            </p>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-wrap gap-3">
              <ScrambleButton
                onClick={() => scrollTo('#projects')}
                className="bg-white text-neutral-950 rounded-sm px-5 py-2.5 text-sm font-medium"
              >
                {t('home.cta.projects')} <span aria-hidden="true">→</span>
              </ScrambleButton>
              <ScrambleButton
                onClick={() => scrollTo('#contact')}
                className="border border-neutral-700 text-neutral-300 rounded-sm px-5 py-2.5 text-sm font-medium hover:border-neutral-500 hover:text-white transition-colors duration-200"
              >
                {t('home.cta.contact')}
              </ScrambleButton>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-neutral-400">
              <span>{t('home.stats.projects')}</span>
              <span className="text-neutral-600">·</span>
              <span>{t('home.stats.hackathons')}</span>
              <span className="text-neutral-600">·</span>
              <span>NASA</span>
              <span className="text-neutral-600">·</span>
              <span>ETH México</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        ref={scrollIndRef}
        className="absolute bottom-8 right-6 hidden md:flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-neutral-600 [writing-mode:vertical-rl]">
          {t('home.scroll')}
        </span>
        <div className="relative h-10 w-px bg-neutral-800 overflow-hidden">
          <div className="scroll-shimmer absolute inset-0" />
        </div>
      </div>
      {/* ── Bottom fade ── */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '120px', background: 'linear-gradient(to bottom, transparent 0%, #000000 100%)', zIndex: 2, pointerEvents: 'none' }} />
    </section>
  );
}
