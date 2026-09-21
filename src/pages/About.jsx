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

function OpenAIIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 611 611" fill="none" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M252.794 108.802C289.191 99.0484 326.265 110.305 351.148 135.135C385.113 126.072 422.85 134.862 449.492 161.505C476.136 188.149 484.925 225.888 475.862 259.85V259.854C500.696 284.735 511.95 321.81 502.198 358.207C492.447 394.602 464.161 421.084 430.215 430.217C421.083 464.162 394.603 492.448 358.206 502.199C321.812 511.951 284.734 500.693 259.852 475.864C225.887 484.927 188.15 476.137 161.507 449.495C134.864 422.851 126.073 385.111 135.136 351.149C110.304 326.266 99.0496 289.192 108.801 252.795C118.552 216.4 146.84 189.918 180.784 180.785C189.917 146.841 216.396 118.553 252.794 108.802ZM374.292 407.145C374.292 411.271 372.092 415.086 368.517 417.148L283.723 466.102C302.487 480.585 327.555 486.459 352.217 479.852C386.997 470.532 410.068 439.312 410.555 405.006V317.717C410.555 315.08 409.125 312.621 406.843 311.303L374.292 292.509V407.145ZM251.868 415.897C248.296 417.959 243.893 417.959 240.317 415.897L155.526 366.942C152.366 390.436 159.811 415.08 177.866 433.136H177.863C203.325 458.594 241.896 462.962 271.85 446.232L347.449 402.586C349.735 401.268 351.148 398.8 351.148 396.163V358.579L251.868 415.897ZM368.602 220.628C366.319 219.309 363.474 219.318 361.191 220.637L328.641 239.431L427.921 296.749C431.496 298.811 433.697 302.627 433.697 306.752V404.661C455.622 395.654 473.244 376.881 479.851 352.218C489.169 317.442 473.668 281.85 444.201 264.274L368.602 220.628ZM177.303 206.34C155.377 215.348 137.756 234.122 131.148 258.783C121.832 293.561 137.331 329.153 166.799 346.727L242.398 390.373C244.68 391.692 247.525 391.684 249.807 390.366L282.357 371.572L183.078 314.253C179.504 312.189 177.303 308.375 177.303 304.251V206.34ZM259.849 279.145V331.858L305.5 358.213L351.15 331.858V279.145L305.5 252.789L259.849 279.145ZM327.276 144.9C308.512 130.418 283.445 124.543 258.782 131.15C224.002 140.471 200.931 171.691 200.445 205.995V293.286C200.445 295.923 201.875 298.381 204.158 299.7L236.707 318.493V203.856C236.707 199.731 238.909 195.916 242.483 193.853L327.276 144.9ZM433.137 177.867C407.675 152.407 369.103 148.038 339.149 164.769L263.55 208.415C261.265 209.734 259.852 212.202 259.852 214.838V252.423L359.132 195.105C362.703 193.041 367.108 193.041 370.682 195.105L455.473 244.06C458.635 220.567 451.189 195.922 433.135 177.867H433.137Z" fill="currentColor"/>
    </svg>
  );
}

function OpenRouterIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 512 512" fill="currentColor" stroke="currentColor" aria-hidden="true">
      <g>
        <path d="M3 248.945C18 248.945 76 236 106 219C136 202 136 202 198 158C276.497 102.293 332 120.945 423 120.945" strokeWidth="90" fill="none"/>
        <path d="M511 121.5L357.25 210.268L357.25 32.7324L511 121.5Z"/>
        <path d="M0 249C15 249 73 261.945 103 278.945C133 295.945 133 295.945 195 339.945C273.497 395.652 329 377 420 377" strokeWidth="90" fill="none"/>
        <path d="M508 376.445L354.25 287.678L354.25 465.213L508 376.445Z"/>
      </g>
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
  { label: 'OpenRouter',    icon: <OpenRouterIcon className="w-[1em] h-[1em]" /> },
  { label: 'ChatGPT',       icon: <OpenAIIcon className="w-[1em] h-[1em]" /> },
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
