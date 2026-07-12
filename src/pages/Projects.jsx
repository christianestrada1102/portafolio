import { useRef, useEffect, useState, useCallback } from 'react';
import { FaGithub } from 'react-icons/fa';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { PROJECTS } from '../data/projects';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

/**
 * Preview con video muted en loop. Se reproduce solo cuando está en viewport
 * (IntersectionObserver) para no cargar 7 videos a la vez. Fallback a imagen.
 */
function ProjectPreview({ project }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: '100px' }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  if (project.videoSrc) {
    return (
      <video
        ref={videoRef}
        className="project-preview-media"
        src={project.videoSrc}
        poster={project.image ?? undefined}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={project.name}
      />
    );
  }
  return (
    <img
      src={project.image}
      alt={project.name}
      className="project-preview-media"
      loading="lazy"
      decoding="async"
    />
  );
}

export default function Projects() {
  const sectionRef = useRef(null);
  const modalRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const { t } = useLanguage();

  // ── Entrada scroll-triggered de cada fila ──
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.project-row').forEach((row) => {
        gsap.from(row.querySelectorAll('.row-anim'), {
          y: 24,
          opacity: 0,
          scale: 0.98,
          duration: 0.85,
          stagger: 0.08,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: row,
            start: 'top 85%',
            once: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── Hover por fila (desktop): clip-path reveal + flip del número ──
  const handleRowEnter = useCallback((e) => {
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const row = e.currentTarget;
    const preview = row.querySelector('.project-preview');
    const num = row.querySelector('.project-num-inner');
    if (preview) {
      gsap.to(preview, {
        clipPath: 'inset(0% 0% 0% 0% round 4px)',
        scale: 1,
        duration: 0.7,
        ease: 'power3.out',
      });
    }
    if (num) {
      gsap.fromTo(
        num,
        { yPercent: 0 },
        { yPercent: -50, duration: 0.5, ease: 'power3.inOut' }
      );
    }
    gsap.to(row, {
      backgroundColor: 'rgba(124, 58, 237, 0.05)',
      duration: 0.4,
      ease: 'power2.out',
    });
  }, []);

  const handleRowLeave = useCallback((e) => {
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const row = e.currentTarget;
    const preview = row.querySelector('.project-preview');
    const num = row.querySelector('.project-num-inner');
    if (preview) {
      gsap.to(preview, {
        clipPath: 'inset(6% 5% 6% 5% round 4px)',
        scale: 0.985,
        duration: 0.7,
        ease: 'power3.out',
      });
    }
    if (num) {
      gsap.to(num, { yPercent: 0, duration: 0.5, ease: 'power3.inOut' });
    }
    gsap.to(row, {
      backgroundColor: 'rgba(124, 58, 237, 0)',
      duration: 0.4,
      ease: 'power2.out',
    });
  }, []);

  // ── Modal (iframe) para proyectos con demo web ──
  const openProject = useCallback((project) => {
    if (!project.url) return;
    // GitHub como destino → nueva pestaña, no iframe
    if (project.url.includes('github.com')) {
      window.open(project.url, '_blank', 'noopener,noreferrer');
      return;
    }
    setSelectedProject(project);
  }, []);

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

  return (
    <>
      <section id="projects" ref={sectionRef} className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6 mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold text-white">
            {t('projects.heading')}{' '}
            <em className="not-italic accent-subtle">{t('projects.heading.accent')}</em>
          </h2>
          <p className="text-neutral-400 mt-2">{t('projects.subtitle')}</p>
        </div>

        {/* ── Lista editorial vertical ── */}
        <div className="border-t border-neutral-800">
          {PROJECTS.map((project) => {
            const clickable = !!project.url;
            return (
              <article
                key={project.num}
                data-cursor={clickable ? 'ver' : undefined}
                className={`project-row group border-b border-neutral-800 ${
                  clickable ? 'cursor-pointer' : 'cursor-default'
                }`}
                onMouseEnter={handleRowEnter}
                onMouseLeave={handleRowLeave}
                onClick={() => openProject(project)}
              >
                <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12 grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-10 items-center">

                  {/* ── Izquierda (40%): info ── */}
                  <div className="md:col-span-2 flex flex-col gap-3 md:gap-4">
                    <div className="flex items-baseline gap-4">
                      {/* Número con flip vertical al hover */}
                      <span className="project-num row-anim font-mono text-sm text-neutral-500 h-5 overflow-hidden inline-block" aria-hidden="true">
                        <span className="project-num-inner block leading-5">
                          <span className="block">{project.num}</span>
                          <span className="block text-brand-400">{project.num}</span>
                        </span>
                      </span>
                      <span className="row-anim font-mono text-[10px] uppercase tracking-[0.2em] text-brand-400/80">
                        {t(project.badgeKey)}
                      </span>
                    </div>

                    <h3 className="row-anim text-2xl md:text-4xl font-semibold text-white leading-tight">
                      {project.name}
                    </h3>

                    <p className="row-anim text-neutral-400 text-sm leading-relaxed line-clamp-3 md:line-clamp-4">
                      {t(project.descriptionKey)}
                    </p>

                    {/* Stack chips */}
                    <div className="row-anim flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[11px] bg-neutral-800/50 text-neutral-400 px-2.5 py-1 rounded-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* CTA / estado */}
                    <div className="row-anim flex items-center gap-4 mt-1">
                      {clickable ? (
                        <span className="text-sm font-medium text-white inline-flex items-center gap-2">
                          {t('projects.cta.view')}
                          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true">→</span>
                        </span>
                      ) : (
                        <span className="text-sm text-neutral-500">
                          {t(`projects.status.${project.status}`)}
                        </span>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.name} — GitHub`}
                          className="text-neutral-500 hover:text-white transition-colors duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaGithub size={16} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* ── Derecha (60%): preview ── */}
                  <div className="md:col-span-3 row-anim">
                    <div
                      className="project-preview relative aspect-video overflow-hidden rounded-[4px] bg-neutral-900"
                      style={{ clipPath: 'inset(6% 5% 6% 5% round 4px)', transform: 'scale(0.985)' }}
                    >
                      <ProjectPreview project={project} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                    </div>
                  </div>

                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Modal con iframe ── */}
      {selectedProject && selectedProject.url && (
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
            <iframe src={selectedProject.url} title={selectedProject.name} />
          </div>
          <div className="modal-actions">
            <a href={selectedProject.url} target="_blank" rel="noopener noreferrer">
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
