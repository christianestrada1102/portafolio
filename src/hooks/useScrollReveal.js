import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-reveal hook usando GSAP ScrollTrigger.
 *
 * Uso:
 *   const containerRef = useScrollReveal();
 *   <div ref={containerRef}>
 *     <div data-reveal>Este elemento hace fadeUp al entrar al viewport</div>
 *     <div data-reveal-stagger>
 *       <div>Hijo 1 — stagger</div>
 *       <div>Hijo 2 — stagger</div>
 *     </div>
 *   </div>
 *
 * - [data-reveal]         → cada elemento anima de forma independiente
 * - [data-reveal-stagger] → los hijos directos animan en cascada (stagger)
 * - Respeta prefers-reduced-motion (no anima si está activo)
 */
export const useScrollReveal = () => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // ── Reveals individuales ──
      el.querySelectorAll('[data-reveal]').forEach((target) => {
        gsap.fromTo(
          target,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: target,
              start: 'top 88%',
              once: true,
            },
          }
        );
      });

      // ── Grupos staggered ──
      el.querySelectorAll('[data-reveal-stagger]').forEach((parent) => {
        const children = Array.from(parent.children);
        if (!children.length) return;
        gsap.fromTo(
          children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power3.out',
            stagger: 0.07,
            scrollTrigger: {
              trigger: parent,
              start: 'top 88%',
              once: true,
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  return containerRef;
};
