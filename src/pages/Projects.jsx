import { useRef, useEffect, useState, useCallback } from 'react';
import { FaGithub } from 'react-icons/fa';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { PROJECTS } from '../data/projects';
import ProjectRing from '../components/ProjectRing';
import { useLanguage } from '../context/LanguageContext';
import { revealHeaders } from '../utils/sectionReveal';

gsap.registerPlugin(ScrollTrigger);

// Rect destino del video grande en la vista de detalle
// (debe coincidir con el CSS de .detail-inner / .detail-media)
function detailMediaRect() {
  const w = Math.min(900, window.innerWidth * 0.92);
  return {
    left: (window.innerWidth - w) / 2,
    top: window.innerHeight * 0.08,
    width: w,
    height: (w * 9) / 16,
  };
}

// Rect destino del modal con iframe (85vw × 80vh centrado, como .modal-content)
function frameRect() {
  const w = window.innerWidth * 0.85;
  const h = window.innerHeight * 0.8;
  return { left: (window.innerWidth - w) / 2, top: (window.innerHeight - h) / 2, width: w, height: h };
}

function makeFlipClone(project, rect, radius) {
  const clone = document.createElement('div');
  clone.style.cssText =
    `position:fixed;z-index:10000;overflow:hidden;border-radius:${radius}px;pointer-events:none;` +
    `left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;` +
    `background:#111 url(${project.image}) center/cover no-repeat;box-shadow:0 24px 80px rgba(0,0,0,0.5);`;
  document.body.appendChild(clone);
  return clone;
}

const FLIP = { duration: 0.65, ease: 'power4.inOut' };

export default function Projects() {
  const sectionRef  = useRef(null);
  const detailRef   = useRef(null);
  const mediaRef    = useRef(null);
  const modalRef    = useRef(null);
  const backdropRef = useRef(null);
  const [detail, setDetail]       = useState(null);
  const [showFrame, setShowFrame] = useState(false);
  const { t } = useLanguage();

  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Entrada scroll-triggered ──
  useEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      revealHeaders(sectionRef.current);
      gsap.from('.ring-reveal', {
        y: 32,
        opacity: 0,
        scale: 0.97,
        duration: 1,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // ── Bloquear scroll de fondo mientras el detalle está abierto ──
  useEffect(() => {
    if (detail) {
      window.lenis?.stop?.();
      document.body.style.overflow = 'hidden';
    } else {
      window.lenis?.start?.();
      document.body.style.overflow = '';
    }
    return () => {
      window.lenis?.start?.();
      document.body.style.overflow = '';
    };
  }, [detail]);

  // ── Backdrop compartido del detalle ──
  const ensureBackdrop = useCallback(() => {
    if (backdropRef.current) return backdropRef.current;
    const b = document.createElement('div');
    b.style.cssText = 'position:fixed;inset:0;z-index:9996;background:rgba(8,8,8,0);pointer-events:none;';
    document.body.appendChild(b);
    backdropRef.current = b;
    return b;
  }, []);
  const removeBackdrop = useCallback(() => {
    backdropRef.current?.remove();
    backdropRef.current = null;
  }, []);

  // ── Abrir detalle: la carta vuela hasta ser el video grande ──
  const openDetail = useCallback((project, cardEl) => {
    if (reduced() || !cardEl?.getBoundingClientRect) {
      setDetail(project);
      return;
    }
    const from = cardEl.getBoundingClientRect();
    const clone = makeFlipClone(project, from, 8);
    const backdrop = ensureBackdrop();
    gsap.to(backdrop, { backgroundColor: 'rgba(8,8,8,0.96)', duration: 0.5, ease: 'power2.out' });
    gsap.to(clone, {
      ...detailMediaRect(),
      borderRadius: 10,
      ...FLIP,
      onComplete: () => {
        setDetail(project);
        gsap.to(clone, {
          opacity: 0,
          duration: 0.35,
          delay: 0.15,
          onComplete: () => clone.remove(),
        });
      },
    });
  }, [ensureBackdrop]);

  // Animación de entrada del texto del detalle
  useEffect(() => {
    if (!detail || !detailRef.current) return;
    gsap.set(detailRef.current, { opacity: 1 });
    if (!reduced()) {
      gsap.from(detailRef.current.querySelectorAll('.detail-text > *'), {
        y: 16,
        opacity: 0,
        stagger: 0.06,
        duration: 0.55,
        delay: 0.1,
        ease: 'power3.out',
      });
    }
  }, [detail]);

  // ── Cerrar detalle: el video se contrae de vuelta al anillo ──
  const closeDetail = useCallback(() => {
    const project = detail;
    const stage = sectionRef.current?.querySelector('.ring-stage');
    if (reduced() || !project || !stage || !mediaRef.current) {
      setDetail(null);
      setShowFrame(false);
      removeBackdrop();
      return;
    }
    const from = mediaRef.current.getBoundingClientRect();
    const clone = makeFlipClone(project, from, 10);
    setDetail(null);
    setShowFrame(false);

    const s = stage.getBoundingClientRect();
    const tw = Math.min(320, s.width * 0.6);
    const th = tw * 0.625;
    if (backdropRef.current) {
      gsap.to(backdropRef.current, {
        backgroundColor: 'rgba(8,8,8,0)',
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: removeBackdrop,
      });
    }
    gsap.to(clone, {
      left: s.left + (s.width - tw) / 2,
      top: s.top + (s.height - th) / 2,
      width: tw,
      height: th,
      borderRadius: 8,
      duration: 0.55,
      ease: 'power4.inOut',
      onComplete: () => {
        gsap.to(clone, { opacity: 0, duration: 0.25, onComplete: () => clone.remove() });
      },
    });
  }, [detail, removeBackdrop]);

  // ── Ver proyecto: el video hace swap hacia la vista en vivo (iframe) ──
  const openFrame = useCallback(() => {
    if (!detail?.url) return;
    if (detail.url.includes('github.com')) {
      window.open(detail.url, '_blank', 'noopener,noreferrer');
      return;
    }
    if (reduced() || !mediaRef.current) {
      setShowFrame(true);
      return;
    }
    const from = mediaRef.current.getBoundingClientRect();
    const clone = makeFlipClone(detail, from, 10);
    gsap.to(clone, {
      ...frameRect(),
      borderRadius: 4,
      ...FLIP,
      onComplete: () => {
        setShowFrame(true);
        gsap.to(clone, {
          opacity: 0,
          duration: 0.4,
          delay: 0.25,
          onComplete: () => clone.remove(),
        });
      },
    });
  }, [detail]);

  // ── Volver del iframe al detalle: swap inverso ──
  const closeFrame = useCallback(() => {
    if (reduced() || !detail || !modalRef.current) {
      setShowFrame(false);
      return;
    }
    const content = modalRef.current.querySelector('.modal-content');
    const from = (content ?? modalRef.current).getBoundingClientRect();
    const clone = makeFlipClone(detail, from, 4);
    setShowFrame(false);
    gsap.to(clone, {
      ...detailMediaRect(),
      borderRadius: 10,
      duration: 0.55,
      ease: 'power4.inOut',
      onComplete: () => {
        gsap.to(clone, { opacity: 0, duration: 0.3, onComplete: () => clone.remove() });
      },
    });
  }, [detail]);

  // ── ESC para volver ──
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (showFrame) closeFrame();
      else if (detail) closeDetail();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showFrame, detail, closeFrame, closeDetail]);

  const clickable = !!detail?.url;

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
          <ProjectRing projects={PROJECTS} onSelect={openDetail} />
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-600 mt-2 select-none">
            {t('projects.ring.hint')}
          </p>
        </div>
      </section>

      {/* ── Vista de detalle: video grande + info ── */}
      {detail && (
        <div
          ref={detailRef}
          className="project-detail"
          data-lenis-prevent
          style={{ opacity: reduced() ? 1 : 0 }}
        >
          <button
            type="button"
            className="close-btn"
            onClick={closeDetail}
            aria-label={t('projects.modal.close')}
          >
            ×
          </button>

          <div className="detail-inner">
            <div ref={mediaRef} className="detail-media">
              {detail.videoSrc ? (
                <video
                  src={detail.videoSrc}
                  poster={detail.image}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                />
              ) : (
                <img src={detail.image} alt={detail.name} />
              )}
            </div>

            <div className="detail-text mt-6 md:mt-8 flex flex-col gap-3 md:gap-4">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-sm text-neutral-500" aria-hidden="true">
                  {detail.num}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-400/80">
                  {t(detail.badgeKey)}
                </span>
              </div>

              <h3 className="text-2xl md:text-4xl font-semibold text-white leading-tight">
                {detail.name}
              </h3>

              <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-2xl">
                {t(detail.descriptionKey)}
              </p>

              <div className="flex flex-wrap gap-2">
                {detail.stack.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-[11px] bg-neutral-800/50 text-neutral-400 px-2.5 py-1 rounded-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-5 mt-2">
                {clickable ? (
                  <button
                    type="button"
                    onClick={openFrame}
                    className="bg-white text-neutral-950 rounded-sm px-5 py-2.5 text-sm font-medium inline-flex items-center gap-2 group"
                  >
                    {t('projects.cta.view')}
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
                  </button>
                ) : (
                  <span className="text-sm text-neutral-500">
                    {t(`projects.status.${detail.status}`)}
                  </span>
                )}
                {detail.github && (
                  <a
                    href={detail.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${detail.name} — GitHub`}
                    className="text-neutral-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-2 text-sm"
                  >
                    <FaGithub size={16} /> GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Vista del proyecto en vivo (iframe) ── */}
      {showFrame && detail?.url && (
        <div ref={modalRef} className="project-modal" onClick={closeFrame}>
          <button
            type="button"
            className="close-btn"
            onClick={closeFrame}
            aria-label={t('projects.modal.close')}
          >
            ×
          </button>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <iframe src={detail.url} title={detail.name} />
          </div>
          <div className="modal-actions">
            <a href={detail.url} target="_blank" rel="noopener noreferrer">
              {t('projects.cta.open')}
            </a>
            {detail.github && (
              <a href={detail.github} target="_blank" rel="noopener noreferrer">
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
