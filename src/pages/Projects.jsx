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

  // ── Apertura estilo Apple: la carta vuela y se expande hasta ser el modal ──
  const flipRef = useRef(false);

  const flipOpen = useCallback((project, fromRect) => {
    const backdrop = document.createElement('div');
    backdrop.style.cssText =
      'position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,0);pointer-events:none;';
    const clone = document.createElement('div');
    clone.style.cssText =
      `position:fixed;z-index:9999;overflow:hidden;border-radius:8px;pointer-events:none;` +
      `left:${fromRect.left}px;top:${fromRect.top}px;width:${fromRect.width}px;height:${fromRect.height}px;` +
      `background:#111 url(${project.image}) center/cover no-repeat;box-shadow:0 24px 80px rgba(0,0,0,0.5);`;
    document.body.append(backdrop, clone);

    // Destino: mismas medidas que .modal-content (85vw × 80vh centrado)
    const tw = window.innerWidth * 0.85;
    const th = window.innerHeight * 0.8;
    const tx = (window.innerWidth - tw) / 2;
    const ty = (window.innerHeight - th) / 2;

    gsap.to(backdrop, { backgroundColor: 'rgba(0,0,0,0.92)', duration: 0.5, ease: 'power2.out' });
    gsap.to(clone, {
      left: tx, top: ty, width: tw, height: th,
      borderRadius: 4,
      duration: 0.65,
      ease: 'power4.inOut',
      onComplete: () => {
        flipRef.current = true;
        setSelectedProject(project);
        gsap.to(clone, {
          opacity: 0,
          duration: 0.4,
          delay: 0.2,
          ease: 'power2.out',
          onComplete: () => { clone.remove(); backdrop.remove(); },
        });
      },
    });
  }, []);

  const openProject = useCallback((project, cardEl) => {
    if (!project.url) return;
    // GitHub como destino → nueva pestaña, no iframe
    if (project.url.includes('github.com')) {
      window.open(project.url, '_blank', 'noopener,noreferrer');
      return;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setSelectedProject(project);
      return;
    }
    let rect = cardEl?.getBoundingClientRect?.();
    if (!rect) {
      // Desde el botón del panel: parte de una carta virtual centrada en el anillo
      const stage = sectionRef.current?.querySelector('.ring-stage');
      if (stage) {
        const s = stage.getBoundingClientRect();
        const w = Math.min(320, s.width * 0.6);
        const h = w * 0.625;
        rect = { left: s.left + (s.width - w) / 2, top: s.top + (s.height - h) / 2, width: w, height: h };
      }
    }
    if (!rect) {
      setSelectedProject(project);
      return;
    }
    flipOpen(project, rect);
  }, [flipOpen]);

  useEffect(() => {
    if (!selectedProject || !modalRef.current) return;
    if (flipRef.current) {
      // Abierto vía FLIP: el clon ya cubre la pantalla, el modal entra sin animación propia
      flipRef.current = false;
      gsap.set(modalRef.current, { opacity: 1 });
    } else {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [selectedProject]);

  // ── Cierre: el modal se contrae de vuelta hacia el anillo ──
  const handleCloseModal = () => {
    const project = selectedProject;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stage = sectionRef.current?.querySelector('.ring-stage');

    if (reduced || !project || !stage || !modalRef.current) {
      setSelectedProject(null);
      return;
    }

    const content = modalRef.current.querySelector('.modal-content');
    const from = (content ?? modalRef.current).getBoundingClientRect();

    const clone = document.createElement('div');
    clone.style.cssText =
      `position:fixed;z-index:9999;overflow:hidden;border-radius:4px;pointer-events:none;` +
      `left:${from.left}px;top:${from.top}px;width:${from.width}px;height:${from.height}px;` +
      `background:#111 url(${project.image}) center/cover no-repeat;box-shadow:0 24px 80px rgba(0,0,0,0.5);`;
    const backdrop = document.createElement('div');
    backdrop.style.cssText =
      'position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,0.92);pointer-events:none;';
    document.body.append(backdrop, clone);
    setSelectedProject(null);

    // Destino: una carta centrada en el escenario del anillo
    const s = stage.getBoundingClientRect();
    const tw = Math.min(320, s.width * 0.6);
    const th = tw * 0.625;

    gsap.to(backdrop, { backgroundColor: 'rgba(0,0,0,0)', duration: 0.5, ease: 'power2.inOut' });
    gsap.to(clone, {
      left: s.left + (s.width - tw) / 2,
      top: s.top + (s.height - th) / 2,
      width: tw,
      height: th,
      borderRadius: 8,
      duration: 0.55,
      ease: 'power4.inOut',
      onComplete: () => {
        gsap.to(clone, {
          opacity: 0,
          duration: 0.25,
          ease: 'power2.out',
          onComplete: () => { clone.remove(); backdrop.remove(); },
        });
      },
    });
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
