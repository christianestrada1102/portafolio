import { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import ScrambleButton from './ScrambleButton';
import { useLanguage } from '../context/LanguageContext';

const NAV = [
  { href: '#home',         key: 'nav.home'         },
  { href: '#about',        key: 'nav.about'        },
  { href: '#achievements', key: 'nav.achievements' },
  { href: '#projects',     key: 'nav.projects'     },
  { href: '#contact',      key: 'nav.contact'      },
];

const SOCIAL = [
  { href: 'https://github.com/christianestrada1102',                   Icon: FaGithub,    label: 'GitHub'    },
  { href: 'https://www.linkedin.com/in/christian-estrada-a59130386/', Icon: FaLinkedin,  label: 'LinkedIn'  },
  { href: 'https://x.com/CodeByNAS',                                  Icon: FaXTwitter,  label: 'Twitter/X' },
  { href: 'https://www.instagram.com/christian_estrada1102',          Icon: FaInstagram, label: 'Instagram' },
];

function toggleTheme(event) {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  const apply = () => {
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    apply();
    return;
  }

  // View Transition API: se "escribe" </dark> o </light> como máscara SVG
  // sobre el tema nuevo y luego se expande hasta llenar la pantalla.
  // Toda la animación vive en index.css (keyframes theme-type-*).
  if (document.startViewTransition) {
    document.startViewTransition(apply);
    return;
  }

  // Fallback: overlay con clip-path animado por GSAP
  const x = event?.clientX ?? window.innerWidth / 2;
  const y = event?.clientY ?? window.innerHeight / 2;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );
  apply();
  const overlay = document.createElement('div');
  overlay.style.cssText = `position:fixed;inset:0;z-index:9999;pointer-events:none;background:var(--bg);clip-path:circle(${endRadius}px at ${x}px ${y}px)`;
  document.body.appendChild(overlay);
  gsap.fromTo(
    overlay,
    { clipPath: `circle(0px at ${x}px ${y}px)` },
    {
      clipPath: `circle(${endRadius}px at ${x}px ${y}px)`,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => overlay.remove(),
    }
  );
}

export default function Layout({ children }) {
  const progressRef                          = useRef(null);
  const headerRef                            = useRef(null);
  const mobileOpenRef                        = useRef(false);
  const [isScrolled,     setIsScrolled]     = useState(false);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  // Keep ref in sync so the scroll handler always sees the current value
  useEffect(() => { mobileOpenRef.current = mobileOpen; }, [mobileOpen]);
  const [active,         setActive]         = useState('#home');
  const { lang, t, toggleLang }             = useLanguage();

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Progress bar animada con GSAP (quickTo) en vez de estilo directo
    const progressTo = progressRef.current
      ? gsap.quickTo(progressRef.current, 'width', {
          duration: reduced ? 0 : 0.35,
          ease: 'power2.out',
          unit: '%',
        })
      : null;

    let lastY = window.scrollY;
    let hidden = false;

    const onScroll = () => {
      const y   = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressTo) progressTo(max > 0 ? (y / max) * 100 : 0);
      setIsScrolled(y > 20);

      // Ocultar navbar al bajar, reaparecer con slide-down al subir
      if (!reduced && headerRef.current) {
        const goingDown = y > lastY;
        if (goingDown && y > 160 && !hidden && !mobileOpenRef.current) {
          hidden = true;
          gsap.to(headerRef.current, { y: -76, duration: 0.4, ease: 'power3.out' });
        } else if ((!goingDown || mobileOpenRef.current) && hidden) {
          hidden = false;
          gsap.fromTo(
            headerRef.current,
            { y: -12 },
            { y: 0, duration: 0.45, ease: 'power3.out' }
          );
        }
      }
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observe = () => {
      const sections = document.querySelectorAll('section[id]');
      if (!sections.length) return null;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(`#${entry.target.id}`);
          });
        },
        { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
      );
      sections.forEach((s) => observer.observe(s));
      return observer;
    };

    let obs = observe();
    const retry = setTimeout(() => {
      if (obs) obs.disconnect();
      obs = observe();
    }, 600);

    return () => {
      clearTimeout(retry);
      if (obs) obs.disconnect();
    };
  }, []);

  const scrollTo = useCallback((href) => {
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (!target) return;
    if (window.lenis) {
      window.lenis.scrollTo(target, { offset: -64, duration: 1.2 });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">

      {/* ── Navbar ── */}
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-neutral-950/90 backdrop-blur-lg border-b border-neutral-800/60'
            : 'bg-transparent'
        }`}
      >
        {/* Scroll progress bar */}
        <div
          ref={progressRef}
          className="absolute bottom-0 left-0 h-px bg-brand-500"
          style={{ width: '0%' }}
        />

        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => scrollTo('#home')}
            className="font-sans font-bold text-base text-white tracking-tight hover:text-neutral-300 transition-colors duration-200 select-none cursor-pointer"
          >
            CodeByNas
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV.map(({ href, key }) => (
              <ScrambleButton
                key={href}
                onClick={() => scrollTo(href)}
                className={`text-sm transition-colors duration-200 cursor-pointer ${
                  active === href
                    ? 'font-medium text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {t(key)}
              </ScrambleButton>
            ))}
            <button
              onClick={toggleLang}
              className="font-mono text-sm text-neutral-400 cursor-pointer select-none hover:text-white transition-colors duration-200"
              aria-label="Toggle language"
            >
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
            <button
              onClick={toggleTheme}
              className="font-mono text-sm cursor-pointer select-none"
              style={{ color: '#7c3aed' }}
              aria-label="Toggle theme"
            >
              {'<Theme/>'}
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="md:hidden relative z-[60] flex flex-col justify-center items-center w-10 h-10 gap-[5px]"
          >
            <span className={`block h-px w-5 transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-[6px]' : ''}`} style={{ background: 'var(--text-primary)' }} />
            <span className={`block h-px w-5 transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} style={{ background: 'var(--text-primary)' }} />
            <span className={`block h-px w-5 transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} style={{ background: 'var(--text-primary)' }} />
          </button>
        </div>
      </header>

      {/* Mobile menu — dropdown */}
      <div className={`md:hidden fixed top-16 left-0 right-0 z-40 overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="backdrop-blur-md border-b border-neutral-800/60" style={{ background: 'color-mix(in srgb, var(--bg) 95%, transparent)' }}>
          <nav className="px-6 py-5 flex flex-col">
            {NAV.map(({ href, key }) => (
              <button
                key={href}
                onClick={() => scrollTo(href)}
                className="py-3.5 border-b border-neutral-800/40 text-left cursor-pointer transition-colors duration-200 last:border-0"
                style={{ color: active === href ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: active === href ? 500 : 400 }}
              >
                <span className="text-base tracking-wide">{t(key)}</span>
              </button>
            ))}
          </nav>

          <div className="px-6 pb-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => { toggleLang(); setMobileOpen(false); }}
                className="font-mono text-xs text-neutral-500 hover:text-white transition-colors duration-200 select-none"
                aria-label="Toggle language"
              >
                {lang === 'es' ? 'EN' : 'ES'}
              </button>
              <button
                onClick={(e) => { toggleTheme(e); setMobileOpen(false); }}
                className="font-mono text-xs text-neutral-500 hover:text-white select-none transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {'<Theme/>'}
              </button>
            </div>
            <div className="flex items-center gap-3.5">
              {SOCIAL.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-neutral-500 hover:text-white transition-colors duration-200"
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Page content ── */}
      <main>{children}</main>

      {/* ── Footer ── */}
      <footer className="border-t border-neutral-800 py-6">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-neutral-500 text-sm">
            © 2026 <span className="text-neutral-400 font-medium">Christian Estrada</span>
          </p>
          <div className="flex items-center gap-4">
            {SOCIAL.map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-neutral-500 hover:text-neutral-300 transition-colors duration-200"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
