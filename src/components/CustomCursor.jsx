import { useRef, useEffect } from 'react';
import gsap from 'gsap';

const SIZE = { default: 8, link: 40, ver: 72 };

/**
 * Cursor personalizado (solo desktop con puntero fino).
 * - Círculo de 8px que sigue al mouse con lag suave (gsap.quickTo)
 * - Sobre links/botones: escala a 40px con mix-blend-mode: difference
 * - Sobre [data-cursor="ver"] (filas de proyectos): círculo grande con texto "VER"
 * - En touch no se monta y el cursor del OS queda intacto
 */
export default function CustomCursor() {
  const cursorRef = useRef(null);
  const labelRef  = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cursor  = cursorRef.current;
    const label   = labelRef.current;
    if (!cursor) return;

    document.documentElement.classList.add('has-custom-cursor');

    gsap.set(cursor, { xPercent: -50, yPercent: -50, width: SIZE.default, height: SIZE.default });

    const xTo = gsap.quickTo(cursor, 'x', { duration: reduced ? 0 : 0.3, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: reduced ? 0 : 0.3, ease: 'power3' });

    let visible = false;
    let mode    = 'default';

    const setMode = (next) => {
      if (next === mode) return;
      mode = next;
      gsap.to(cursor, {
        width:  SIZE[next],
        height: SIZE[next],
        duration: reduced ? 0 : 0.3,
        ease: 'power3.out',
      });
      gsap.to(label, {
        opacity: next === 'ver' ? 1 : 0,
        duration: reduced ? 0 : 0.2,
        ease: 'power2.out',
      });
    };

    const onMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!visible) {
        visible = true;
        gsap.to(cursor, { opacity: 1, duration: 0.2 });
      }
    };

    const onOver = (e) => {
      const t = e.target instanceof Element ? e.target : null;
      if (!t) return;
      if (t.closest('[data-cursor="ver"]')) setMode('ver');
      else if (t.closest('a, button, [role="button"], input, textarea, select, label')) setMode('link');
      else setMode('default');
    };

    const onLeaveWindow = () => {
      visible = false;
      gsap.to(cursor, { opacity: 0, duration: 0.2 });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeaveWindow);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeaveWindow);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
      <span ref={labelRef} className="custom-cursor-label">VER</span>
    </div>
  );
}
