import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader({ onComplete }) {
  const preloaderRef = useRef(null);
  const nameRef = useRef(null);
  const devRef = useRef(null);

  useEffect(() => {
    const el = preloaderRef.current;
    const name = nameRef.current;
    const dev = devRef.current;

    const finish = () => {
      sessionStorage.setItem('preloader-shown', '1');
      el.style.display = 'none';
      document.body.style.overflow = '';
      document.documentElement.classList.remove('preloader-active');
      onComplete?.();
    };

    // Respeta prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set('#home', { visibility: 'visible', opacity: 1 });
      finish();
      return;
    }

    // Bloquea scroll durante el preloader
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('preloader-active');

    // Hero reserva espacio pero permanece invisible hasta el reveal
    gsap.set('#home', { visibility: 'hidden', opacity: 0 });

    const letters = name.querySelectorAll('.pre-char');

    gsap.set([name, dev], { opacity: 1 });
    gsap.set(letters, { yPercent: 110 });
    gsap.set(dev, { yPercent: 110 });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to('#home', { visibility: 'visible', opacity: 1, duration: 0.6, ease: 'power2.out' });
        finish();
      },
    });

    tl
      // 1. "CODEBYNAS.DEV" entra letra por letra (clip reveal desde abajo)
      .to(letters, {
        yPercent: 0,
        duration: 0.6,
        stagger: 0.03,
        ease: 'power3.out',
      })
      .to(dev, {
        yPercent: 0,
        duration: 0.5,
        ease: 'power3.out',
      }, '-=0.35')

      // 2. (800ms de lectura) ".DEV" se separa: el nombre se desvanece
      .to(letters, {
        yPercent: -110,
        duration: 0.5,
        stagger: 0.02,
        ease: 'power2.in',
      }, '+=0.8')

      // 3. ".DEV" escala hasta llenar la pantalla y se desvanece
      .set(dev.parentElement, { overflow: 'visible' })
      .to(dev, {
        scale: 22,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.inOut',
      })

      // 4. El fondo se desvanece revelando el hero
      .to(el, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
      }, '-=0.45');

    return () => {
      tl.kill();
      document.body.style.overflow = '';
      document.documentElement.classList.remove('preloader-active');
    };
  }, [onComplete]);

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      <span className="absolute bottom-4 left-4 text-xs tracking-widest select-none" style={{ color: '#ffffff' }}>
        Portfolio
      </span>
      <span className="absolute bottom-4 right-4 text-xs tracking-widest select-none" style={{ color: '#ffffff' }}>
        2026
      </span>

      {/* Escenario: CODEBYNAS + .DEV con overflow oculto para el clip reveal */}
      <div className="flex items-baseline overflow-hidden py-1" aria-label="CodeByNas.dev">
        <span
          ref={nameRef}
          className="font-sans font-bold text-2xl md:text-4xl tracking-widest uppercase whitespace-nowrap"
          style={{ color: '#ffffff', opacity: 0 }}
          aria-hidden="true"
        >
          {'CODEBYNAS'.split('').map((char, i) => (
            <span key={i} className="pre-char inline-block">{char}</span>
          ))}
        </span>
        <span
          ref={devRef}
          className="font-sans font-bold text-2xl md:text-4xl tracking-widest uppercase whitespace-nowrap inline-block"
          style={{ color: '#7c3aed', opacity: 0, transformOrigin: 'center center' }}
          aria-hidden="true"
        >
          .DEV
        </span>
      </div>
    </div>
  );
}
