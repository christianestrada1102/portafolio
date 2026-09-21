import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import {
  SiReact,
  SiNodedotjs,
  SiHtml5,
  SiCss3,
  SiFlutter,
  SiVite,
  SiJavascript,
  SiTypescript,
  SiGit,
  SiNextdotjs,
  SiTailwindcss,
  SiSupabase,
  SiFirebase,
  SiGithub,
} from 'react-icons/si';
import LogoLoop from '../components/LogoLoop';
import { useLanguage } from '../context/LanguageContext';
import { revealHeaders } from '../utils/sectionReveal';

gsap.registerPlugin(ScrollTrigger);

function CSharpIcon({ className }) {
  return (
    <svg className={className} viewBox="0 -1.43 255.58 290.11" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <mask id="csharp-cutout">
          <rect x="0" y="-1.43" width="255.58" height="290.11" fill="white"/>
          <path fill="black" d="M201.9 116.3v13.47h13.47v-13.48h6.73v13.48h13.48v6.73H222.1v13.48h13.48v6.74H222.1v13.47h-6.73V156.7h-13.48v13.48h-6.73V156.7h-13.48v-6.73h13.47V136.5h-13.47v-6.74h13.47v-13.48zm13.47 20.2h-13.48v13.48h13.48z"/>
          <path fill="black" d="M128.46 48.63a94.96 94.96 0 0 1 82.26 47.45l-.16-.27-41.35 23.8A47.28 47.28 0 0 0 129 96.33h-.54a47.3 47.3 0 0 0-47.3 47.3 47.08 47.08 0 0 0 6.23 23.47 47.28 47.28 0 0 0 82.29-.27l-.2.35 41.29 23.91a94.97 94.97 0 0 1-81.25 47.54h-1.06a94.96 94.96 0 0 1-95-95 95 95 0 0 1 95-95z"/>
        </mask>
      </defs>
      <g mask="url(#csharp-cutout)">
        <path fill="currentColor" d="M255.57 84.45c0-4.83-1.04-9.1-3.13-12.76a24.4 24.4 0 0 0-9.24-9C209.17 43.05 175.1 23.5 141.1 3.86c-9.17-5.3-18.06-5.1-27.16.27-13.54 7.98-81.35 46.83-101.55 58.53C4.06 67.5.02 74.87 0 84.44v118.37c0 4.72 1 8.9 2.99 12.51 2.05 3.72 5.17 6.82 9.38 9.26 20.21 11.7 88.02 50.55 101.56 58.53 9.11 5.38 18 5.57 27.17.27 34.02-19.64 68.08-39.2 102.1-58.81a24.33 24.33 0 0 0 9.4-9.25c1.99-3.61 2.98-7.8 2.98-12.52l-.01-118.35"/>
        <path fill="currentColor" opacity="0.55" d="M128.18 143.24 2.98 215.33c2.06 3.7 5.18 6.8 9.4 9.25 20.2 11.7 88.01 50.55 101.55 58.53 9.11 5.38 18 5.57 27.17.27 34.02-19.64 68.08-39.2 102.1-58.81a24.33 24.33 0 0 0 9.4-9.25z"/>
        <path fill="currentColor" opacity="0.7" d="M255.57 84.45c0-4.83-1.04-9.1-3.13-12.76l-124.26 71.55 124.41 72.07c2-3.6 2.99-7.79 3-12.51 0 0 0-78.9-.02-118.35"/>
      </g>
    </svg>
  );
}

const TECH_LOGOS = [
  { node: <SiJavascript />, title: 'JavaScript', ariaLabel: 'JavaScript' },
  { node: <SiTypescript />, title: 'TypeScript', ariaLabel: 'TypeScript' },
  { node: <SiHtml5 />,      title: 'HTML5',      ariaLabel: 'HTML5' },
  { node: <SiCss3 />,       title: 'CSS3',       ariaLabel: 'CSS3' },
  { node: <SiReact />,      title: 'React',      ariaLabel: 'React' },
  { node: <SiNextdotjs />,  title: 'Next.js',    ariaLabel: 'Next.js' },
  { node: <SiVite />,       title: 'Vite',       ariaLabel: 'Vite' },
  { node: <SiTailwindcss />, title: 'Tailwind CSS', ariaLabel: 'Tailwind CSS' },
  { node: <SiNodedotjs />,  title: 'Node.js',    ariaLabel: 'Node.js' },
  { node: <SiFlutter />,    title: 'Flutter',    ariaLabel: 'Flutter' },
  { node: <CSharpIcon className="w-[1em] h-[1em]" />, title: 'C#', ariaLabel: 'C#' },
  { node: <SiSupabase />,   title: 'Supabase',   ariaLabel: 'Supabase' },
  { node: <SiFirebase />,   title: 'Firebase',   ariaLabel: 'Firebase' },
  { node: <SiGit />,        title: 'Git',        ariaLabel: 'Git' },
];

function VisualStudioIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M17 16.47V7.39l-6 4.54M2.22 9.19a.86.86 0 0 1-.02-1.15l1.2-1.11c.2-.18.69-.26 1.05 0l3.42 2.61l7.93-7.25c.32-.32.87-.45 1.5-.12l4 1.91c.36.21.7.54.7 1.15v13.5c0 .4-.29.83-.6 1l-4.4 2.1c-.32.13-.92.01-1.13-.2l-8.02-7.3l-3.4 2.6c-.38.26-.85.19-1.05 0l-1.2-1.1c-.32-.33-.28-.87.05-1.2l3-2.7"/>
    </svg>
  );
}

function VSCodeIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M21.95 4.903a1 1 0 0 0-.06-.166a1.2 1.2 0 0 0-.31-.425a1.2 1.2 0 0 0-.29-.197l-4.118-1.994a1.27 1.27 0 0 0-.75-.103a1.26 1.26 0 0 0-.672.347L9.106 9.75L5.228 6.553l-.337-.281a.8.8 0 0 0-.413-.19q-.033-.006-.066-.007q-.029-.004-.059-.003q-.046 0-.09.003a.3.3 0 0 0-.079.013a.7.7 0 0 0-.156.046l-1.515.629a.87.87 0 0 0-.372.306a.85.85 0 0 0-.141.463v8.936c0 .163.05.325.14.463c.091.134.222.24.373.306l1.515.638a.85.85 0 0 0 .45.056a.85.85 0 0 0 .413-.19l.337-.294l3.878-3.198l6.644 7.386q.034.033.072.066q.004.005.01.006a1.25 1.25 0 0 0 1.34.172l4.119-1.994a1 1 0 0 0 .153-.088c.097-.065.187-.147.262-.231q.057-.07.103-.144c.125-.2.191-.431.191-.669V5.247q0-.175-.05-.344M4.5 14.874V9.126l2.584 2.876zm7.334-2.873L17 7.742v8.518z"/>
    </svg>
  );
}

function CursorIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" aria-hidden="true">
      <path fill="currentColor" fillRule="evenodd" d="M117.9 30.289L66.664.713a5.32 5.32 0 0 0-5.323 0L10.09 30.29a4.48 4.48 0 0 0-2.234 3.872v59.663c0 1.6.853 3.077 2.24 3.878l51.24 29.586a5.33 5.33 0 0 0 5.324 0l51.246-29.586a4.48 4.48 0 0 0 2.24-3.878V34.166a4.48 4.48 0 0 0-2.24-3.872zm-3.216 6.272l-49.47 85.681c-.337.576-1.217.341-1.217-.325V65.81a3.15 3.15 0 0 0-1.573-2.72l-48.59-28.055c-.571-.331-.336-1.216.33-1.216h98.94c1.409 0 2.284 1.525 1.58 2.741"/>
    </svg>
  );
}

const TOOLS = [
  { label: 'Visual Studio', icon: <VisualStudioIcon className="w-[1em] h-[1em]" /> },
  { label: 'VS Code',       icon: <VSCodeIcon className="w-[1em] h-[1em]" /> },
  { label: 'Cursor',        icon: <CursorIcon className="w-[1em] h-[1em]" /> },
  { label: 'Git',           icon: <SiGit /> },
  { label: 'GitHub',        icon: <SiGithub /> },
];

/** Divide un texto en spans .reveal-word para el reveal scroll-driven palabra por palabra */
function Words({ children }) {
  return String(children)
    .split(/(\s+)/)
    .map((part, i) =>
      /^\s+$/.test(part) || part === ''
        ? part
        : <span key={i} className="reveal-word">{part}</span>
    );
}

export default function About() {
  const containerRef = useRef(null);
  const bioRef       = useRef(null);
  const { t, lang }  = useLanguage();

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

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ── Reveal word-by-word scroll-driven del bio (scrub) ──
  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !bioRef.current) return;

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray('.reveal-word', bioRef.current);
      if (!words.length) return;
      gsap.fromTo(
        words,
        { opacity: 0.15 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.05,
          scrollTrigger: {
            trigger: bioRef.current,
            start: 'top 80%',
            end: 'bottom 55%',
            scrub: true,
          },
        }
      );
    }, bioRef);

    return () => ctx.revert();
  }, [lang]);

  return (
    <section id="about" ref={containerRef} className="pt-8 pb-6 md:pt-12 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6">

        {/* ── Header ── */}
        <div className="mb-8">
          <p data-anim="eyebrow" className="font-mono text-xs uppercase tracking-[0.25em] text-brand-400 mb-2">
            {t('about.label')}
          </p>
          <h2 data-anim="title" className="text-3xl md:text-4xl font-semibold text-white">
            {t('about.heading')}{' '}
            <em className="not-italic accent-subtle">{t('about.heading.accent')}</em>
          </h2>
        </div>

        {/* ── Bio + Tools ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-10 md:mb-12">

          {/* Bio */}
          <div ref={bioRef} data-reveal className="space-y-4 text-neutral-400 text-base leading-relaxed">
            <p>
              <Words>{t('about.bio.1.pre')}</Words>
              <span className="text-white font-medium"><Words>Christian Estrada</Words></span>
              <Words>{t('about.bio.1.post')}</Words>
            </p>
            <p>
              <Words>{t('about.bio.2.pre')}</Words>
              <span className="text-neutral-200"><Words>{t('about.bio.2.stack')}</Words></span>
              <Words>{t('about.bio.2.mid')}</Words>
              <span className="text-neutral-200"><Words>{t('about.bio.2.expanding')}</Words></span>.
            </p>
            <p>
              <Words>{t('about.bio.3.pre')}</Words>
              <span className="text-neutral-200"><Words>{t('about.bio.3.hackathons')}</Words></span>
              <Words>{t('about.bio.3.post')}</Words>
            </p>
          </div>

          {/* Tools */}
          <div data-reveal>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400 mb-4">
              {t('about.tools.label')}
            </p>
            <div className="flex flex-wrap gap-2">
              {TOOLS.map(({ label, icon }) => (
                <span
                  key={label}
                  title={label}
                  aria-label={label}
                  className="inline-flex items-center gap-1.5 bg-neutral-800/50 text-neutral-400 px-3 py-1.5 rounded-sm hover:bg-neutral-800 hover:text-neutral-300 transition-all duration-200 cursor-default text-base"
                >
                  {icon}
                  <span className="font-mono text-xs">{label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tech icons ── */}
        <div data-reveal>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400 mb-6">
            {t('about.stack.label')}
          </p>
          <div className="tech-row relative overflow-hidden text-neutral-400" style={{ height: '80px' }}>
            <LogoLoop
              logos={TECH_LOGOS}
              speed={70}
              direction="left"
              logoHeight={window.innerWidth < 768 ? 22 : 32}
              gap={window.innerWidth < 768 ? 28 : 48}
              hoverSpeed={12}
              scaleOnHover
              fadeOut
              ariaLabel={t('about.stack.label')}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
