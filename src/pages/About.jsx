import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import {
  SiReact,
  SiNodedotjs,
  SiCplusplus,
  SiHtml5,
  SiCss3,
} from 'react-icons/si';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const TECHS = [
  { name: 'React',   Icon: SiReact     },
  { name: 'Node.js', Icon: SiNodedotjs },
  { name: 'C#',      Icon: null, symbol: 'C#' },
  { name: 'C++',     Icon: SiCplusplus },
  { name: 'HTML5',   Icon: SiHtml5     },
  { name: 'CSS3',    Icon: SiCss3      },
];

const TOOLS = ['Visual Studio', 'VS Code', 'Cursor', 'Git', 'GitHub'];

export default function About() {
  const containerRef = useRef(null);
  const { t }        = useLanguage();

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

      gsap.from('.tech-item', {
        y: 24,
        opacity: 0,
        scale: 0.9,
        stagger: 0.07,
        duration: 0.5,
        ease: 'power2.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: '.tech-row',
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={containerRef} className="pt-8 pb-6 md:pt-12 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6">

        {/* ── Header ── */}
        <div data-reveal className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand-400 mb-2">
            {t('about.label')}
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white">
            {t('about.heading')}{' '}
            <em className="not-italic accent-subtle">{t('about.heading.accent')}</em>
          </h2>
        </div>

        {/* ── Bio + Tools ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-10 md:mb-12">

          {/* Bio */}
          <div data-reveal className="space-y-4 text-neutral-400 text-base leading-relaxed">
            <p>
              {t('about.bio.1.pre')}
              <span className="text-white font-medium">Christian Estrada</span>
              {t('about.bio.1.post')}
            </p>
            <p>
              {t('about.bio.2.pre')}
              <span className="text-neutral-200">{t('about.bio.2.stack')}</span>
              {t('about.bio.2.mid')}
              <span className="text-neutral-200">{t('about.bio.2.expanding')}</span>.
            </p>
            <p>
              {t('about.bio.3.pre')}
              <span className="text-neutral-200">{t('about.bio.3.hackathons')}</span>
              {t('about.bio.3.post')}
            </p>
          </div>

          {/* Tools */}
          <div data-reveal>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400 mb-4">
              {t('about.tools.label')}
            </p>
            <div className="flex flex-wrap gap-2">
              {TOOLS.map((tool) => (
                <span
                  key={tool}
                  className="font-mono text-xs bg-neutral-800/50 text-neutral-400 px-3 py-1 rounded-sm hover:bg-neutral-800 hover:text-neutral-300 transition-all duration-200 cursor-default"
                >
                  {tool}
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
          <div className="tech-row flex flex-wrap items-center gap-6 md:gap-10 justify-center">
            {TECHS.map(({ name, Icon, symbol }) => (
              <div
                key={name}
                title={name}
                className="tech-item flex items-center justify-center text-neutral-400 hover:text-white transition-colors duration-200 cursor-default group"
              >
                {Icon ? (
                  <Icon className="w-6 h-6 md:w-8 md:h-8" />
                ) : (
                  <span className="text-base md:text-xl font-mono font-bold leading-none">
                    {symbol ?? name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
