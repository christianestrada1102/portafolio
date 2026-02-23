import { useRef, useEffect, useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import settArbImg from '../assets/SettArb.png';
import astroImg from '../assets/Astro.jpg';
import safeZoneImg from '../assets/safezone.png';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    title: 'SettArb',
    status: 'done',
    image: settArbImg,
    descriptionKey: 'projects.desc.settarb',
    techs: ['Web3', 'Arbitrum', 'Solidity', 'TypeScript', 'React', 'Next.js'],
    demo: 'https://eth-mexico.vercel.app/',
    github: 'https://github.com/christianestrada1102/EthMexico',
  },
  {
    title: 'Astro Yuyin',
    status: 'wip',
    image: astroImg,
    descriptionKey: 'projects.desc.astro',
    techs: ['Unity', 'C#'],
    demo: null,
    github: null,
  },
  {
    title: 'SafeZone',
    status: 'wip',
    image: safeZoneImg,
    descriptionKey: 'projects.desc.safezone',
    techs: ['React Native', 'Expo', 'Django', 'PostgreSQL'],
    demo: null,
    github: null,
  },
  {
    title: 'Alera',
    status: 'soon',
    image: null,
    descriptionKey: 'projects.desc.alera',
    techs: [],
    demo: null,
    github: null,
  },
  {
    title: 'Portafolio Web',
    status: 'done',
    image: null,
    descriptionKey: 'projects.desc.portfolio',
    techs: ['React', 'Vite', 'TailwindCSS', 'GSAP'],
    demo: 'https://portafolio-seven-iota-56.vercel.app/',
    github: 'https://github.com/christianestrada1102/portafolio',
  },
];

export default function Projects() {
  const sectionRef     = useRef(null);
  const trackRef       = useRef(null);
  const animationRef   = useRef(null);
  const modalRef       = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const { t }          = useLanguage();

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const isMobile = window.innerWidth < 768;
    const section  = sectionRef.current;
    const track    = trackRef.current;
    if (!section || !track) return;

    // Stride = offset from first original to first clone.
    // JSX renders originals[0..N-1] then clones[N..2N-1], so children[N]
    // is the first clone. offsetLeft gives the exact pixel stride regardless
    // of CSS padding or gap values.
    const stride = track.children[PROJECTS.length].offsetLeft
                 - track.children[0].offsetLeft;

    // Proxy + modulo: proxy.val runs 0→stride on repeat.
    // x = -(val % stride) maps the wrap point to 0 in the same RAF frame,
    // so the track is never rendered at x = -stride and no seam frame exists.
    const proxy = { val: 0 };
    const animation = gsap.to(proxy, {
      val: stride,
      duration: isMobile ? 18 : 30,
      ease: 'none',
      repeat: -1,
      onUpdate() {
        gsap.set(track, { x: -(proxy.val % stride) });
      },
    });

    animationRef.current = animation;
    animation.pause();

    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      onEnter:     () => animation.play(),
      onLeave:     () => animation.pause(),
      onEnterBack: () => animation.play(),
      onLeaveBack: () => animation.pause(),
    });

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars?.trigger === section) trigger.kill();
      });
    };
  }, []);

  const handleCardHover = (isEntering) => {
    if (animationRef.current) {
      isEntering ? animationRef.current.pause() : animationRef.current.play();
    }
  };

  const handleCardClick = (project) => {
    if (project.demo) setSelectedProject(project);
  };

  useEffect(() => {
    if (selectedProject && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [selectedProject]);

  const handleCloseModal = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => setSelectedProject(null),
      });
    } else {
      setSelectedProject(null);
    }
  };

  const renderCard = (project, index, isClone = false) => {
    const hasImage  = project.image !== null;
    const hasLiveUrl = !!project.demo;
    return (
      <article
        key={`${project.title}-${isClone ? 'clone' : 'original'}-${index}`}
        className={`project-card card flex-shrink-0 w-[280px] h-[210px] md:w-[560px] md:h-[420px] rounded-[4px] relative overflow-hidden group ${
          hasLiveUrl ? 'cursor-pointer' : 'cursor-default'
        }`}
        onMouseEnter={() => handleCardHover(true)}
        onMouseLeave={() => handleCardHover(false)}
        onClick={() => hasLiveUrl && handleCardClick(project)}
      >
        {hasImage ? (
          <>
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover card-img"
              loading="lazy"
            />
            <div className="card-overlay absolute inset-0" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900" />
            <div className="card-overlay absolute inset-0 opacity-60" />
          </>
        )}
        <div className="card-content relative z-10 h-full flex flex-col justify-end p-5 md:p-8 text-white">
          <span className="project-number font-mono text-neutral-400 text-xs md:text-sm mb-1 md:mb-2">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="text-lg md:text-3xl font-bold mb-1 md:mb-2">{project.title}</h3>
          <p className="project-description text-xs md:text-sm opacity-90 mb-2 md:mb-3 line-clamp-2 md:line-clamp-3">
            {t(project.descriptionKey)}
          </p>
          {project.techs.length > 0 && (
            <div className="project-stack font-mono text-[10px] md:text-xs opacity-80 mb-2 md:mb-4">
              {project.techs.join(' · ')}
            </div>
          )}
          {hasLiveUrl ? (
            <button className="text-sm font-medium opacity-90 hover:opacity-100 transition-opacity w-fit flex items-center gap-2 group/btn">
              <span>{t('projects.cta.view')}</span>
              <span className="group-hover/btn:translate-x-1 transition-transform inline-block">→</span>
            </button>
          ) : (
            <span className="text-sm opacity-80">{t(`projects.status.${project.status}`)}</span>
          )}
        </div>
      </article>
    );
  };

  return (
    <>
      <section id="projects" ref={sectionRef} className="projects-section">
        <div className="projects-header max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-white">
            {t('projects.heading')} <em className="not-italic accent-subtle">{t('projects.heading.accent')}</em>
          </h2>
          <p className="text-neutral-400 mt-2">{t('projects.subtitle')}</p>
        </div>
        <div className="projects-carousel">
          <div className="projects-viewport">
            <div ref={trackRef} className="projects-track">
              {PROJECTS.map((project, i) => renderCard(project, i, false))}
              {PROJECTS.map((project, i) => renderCard(project, i, true))}
            </div>
          </div>
        </div>
      </section>

      {selectedProject && selectedProject.demo && (
        <div
          ref={modalRef}
          className="project-modal"
          onClick={handleCloseModal}
          style={{ opacity: 0 }}
        >
          <button
            type="button"
            className="close-btn"
            onClick={handleCloseModal}
            aria-label={t('projects.modal.close')}
          >
            ×
          </button>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <iframe src={selectedProject.demo} title={selectedProject.title} />
          </div>
          <div className="modal-actions">
            <a href={selectedProject.demo} target="_blank" rel="noopener noreferrer">
              {t('projects.cta.open')}
            </a>
            {selectedProject.github && (
              <a href={selectedProject.github} target="_blank" rel="noopener noreferrer">
                <FaGithub style={{ marginRight: '0.4rem', display: 'inline', verticalAlign: 'middle' }} />
                {t('projects.cta.github')}
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
