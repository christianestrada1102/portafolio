import { useRef, useEffect, useState, useCallback } from 'react';
import { FaGithub } from 'react-icons/fa';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { PROJECTS } from '../data/projects';
import ProjectRing from '../components/ProjectRing';
import { useLanguage } from '../context/LanguageContext';
import { revealHeaders } from '../utils/sectionReveal';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef(null);
  const modalRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const { t } = useLanguage();

  const activeProject = PROJECTS[activeIdx];

  // ── Entrada scroll-triggered ──
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      revealHeaders(sectionRef.current);

      gsap.from('.ring-reveal', {
        y: 32,
        opacity: 0,
        scale: 0.97,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
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

  const clickable = !!activeProject.url;

  return (
    <>
      <section id="projects" ref={sectionRef} className="py-12 md:py-16 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 md:px-6 mb-6 md:mb-8">
          <h2 data-anim="title" className="text-3xl md:text-4xl font-semibold text-white">
            {t('projects.heading')}{' '}
            <em className="not-italic accent-subtle">{t('projects.heading.accent')}</em>
          </h2>
          <p data-anim="copy" className="text-neutral-400 mt-2">{t('projects.subtitle')}</p>
        </div>

        {/* ── Anillo 3D de proyectos ── */}
        <div className="ring-reveal">
          <ProjectRing
            projects={PROJECTS}
            onSelect={openProject}
            onActiveChange={setActiveIdx}
          />
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-600 mt-2 select-none">
            {t('projects.ring.hint')}
          </p>
        </div>

        {/* ── Panel del proyecto activo ── */}
        <div className="ring-reveal max-w-6xl mx-auto px-4 md:px-6 mt-8 md:mt-10">
          <div key={activeProject.num} className="ring-info-anim flex flex-col gap-3 md:gap-4 max-w-2xl">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-sm text-neutral-500" aria-hidden="true">
                {activeProject.num}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-400/80">
                {t(activeProject.badgeKey)}
              </span>
            </div>

            <h3 className="text-2xl md:text-4xl font-semibold text-white leading-tight">
              {activeProject.name}
            </h3>

            <p className="text-neutral-400 text-sm leading-relaxed">
              {t(activeProject.descriptionKey)}
            </p>

            <div className="flex flex-wrap gap-2">
              {activeProject.stack.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[11px] bg-neutral-800/50 text-neutral-400 px-2.5 py-1 rounded-sm"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-1">
              {clickable ? (
                <button
                  type="button"
                  onClick={() => openProject(activeProject)}
                  className="text-sm font-medium text-white inline-flex items-center gap-2 group"
                >
                  {t('projects.cta.view')}
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true">→</span>
                </button>
              ) : (
                <span className="text-sm text-neutral-500">
                  {t(`projects.status.${activeProject.status}`)}
                </span>
              )}
              {activeProject.github && (
                <a
                  href={activeProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${activeProject.name} — GitHub`}
                  className="text-neutral-500 hover:text-white transition-colors duration-200"
                >
                  <FaGithub size={16} />
                </a>
              )}
            </div>
          </div>
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
