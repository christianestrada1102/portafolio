import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animaciones de entrada scroll-triggered para headers de sección.
 * Llamar dentro de un gsap.context() pasando el nodo contenedor como scope.
 *
 * - [data-anim="eyebrow"]: letter-spacing expand (0.05em → valor final) + fade in
 * - [data-anim="title"]:   clip-path reveal de abajo hacia arriba
 * - [data-anim="copy"]:    fade in + translateY(20px → 0)
 */
export function revealHeaders(scope) {
  gsap.utils.toArray('[data-anim="eyebrow"]', scope).forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      letterSpacing: '0.05em',
      duration: 0.9,
      ease: 'power3.out',
      immediateRender: false,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });

  gsap.utils.toArray('[data-anim="title"]', scope).forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: 'inset(100% 0% 0% 0%)', y: 30 },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        y: 0,
        duration: 1,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      }
    );
  });

  gsap.utils.toArray('[data-anim="copy"]', scope).forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out',
      immediateRender: false,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
}
