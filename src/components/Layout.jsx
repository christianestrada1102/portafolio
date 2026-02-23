import { useState, useEffect, useCallback } from 'react';
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

function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

export default function Layout({ children }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled,     setIsScrolled]     = useState(false);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [active,         setActive]         = useState('#home');
  const { lang, t, toggleLang }             = useLanguage();

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y   = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? (y / max) * 100 : 0);
      setIsScrolled(y > 20);
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/60'
            : 'bg-transparent'
        }`}
      >
        {/* Scroll progress bar */}
        <div
          className="absolute bottom-0 left-0 h-px bg-brand-500"
          style={{ width: `${scrollProgress}%`, transition: 'width 0.3s ease-out' }}
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
            className="md:hidden flex flex-col gap-[5px] p-2 text-neutral-400 hover:text-white transition-colors"
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <span className={`block h-px w-5 bg-current transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block h-px w-5 bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block h-px w-5 bg-current transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <nav className="border-t border-neutral-800/60 bg-neutral-950/95 backdrop-blur-md p-8 flex flex-col gap-6">
            {NAV.map(({ href, key }) => (
              <button
                key={href}
                onClick={() => scrollTo(href)}
                className={`text-left text-xl transition-colors duration-200 cursor-pointer ${
                  active === href
                    ? 'font-medium text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {t(key)}
              </button>
            ))}
            <button
              onClick={() => { toggleLang(); setMobileOpen(false); }}
              className="font-mono text-xl text-left text-neutral-400 cursor-pointer select-none hover:text-white transition-colors duration-200"
              aria-label="Toggle language"
            >
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
            <button
              onClick={() => { toggleTheme(); setMobileOpen(false); }}
              className="font-mono text-xl text-left cursor-pointer select-none transition-colors duration-200"
              style={{ color: '#7c3aed' }}
              aria-label="Toggle theme"
            >
              {'<Theme/>'}
            </button>
          </nav>
        </div>
      </header>

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
