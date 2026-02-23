import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader({ onComplete }) {
  const preloaderRef = useRef(null);
  const christianRef = useRef(null);
  const estradaRef = useRef(null);
  const devRef = useRef(null);

  useEffect(() => {
    const el = preloaderRef.current;
    const christian = christianRef.current;
    const estrada = estradaRef.current;
    const dev = devRef.current;

    // Respeta prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.display = 'none';
      gsap.set('#home', { visibility: 'visible', opacity: 1 });
      onComplete?.();
      return;
    }

    // Bloquea scroll durante el preloader
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('preloader-active');

    // Anchos reales para posicionar CHRISTIAN.ESTRADA centrado
    const cWidth = christian.offsetWidth;
    const eWidth = estrada.offsetWidth;

    // Hero reserva espacio pero permanece invisible hasta el reveal
    gsap.set('#home', { visibility: 'hidden', opacity: 0 });

    // Estado inicial: textos centrados, invisible
    gsap.set([christian, estrada, dev], {
      yPercent: -50,
      xPercent: -50,
      opacity: 0,
    });
    // Offset para que "CHRISTIAN." + "ESTRADA" se lean como una sola palabra centrada
    gsap.set(christian, { x: -eWidth / 2 });
    gsap.set(estrada, { x: cWidth / 2 });
    gsap.set(dev, { scale: 0.8 });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to('#home', { visibility: 'visible', opacity: 1, duration: 0.4, ease: 'power2.out' });
        el.style.display = 'none';
        document.body.style.overflow = '';
        document.documentElement.classList.remove('preloader-active');
        onComplete?.();
      },
    });

    tl
      // 1. (0s) "CHRISTIAN.ESTRADA" aparece
      .to([christian, estrada], {
        opacity: 1,
        duration: 0.1,
        ease: 'power2.out',
      })

      // 2. (1.2s) "CHRISTIAN." se va a la izquierda, "ESTRADA" se centra
      .to(christian, {
        opacity: 0,
        x: -eWidth / 2 - 50,
        duration: 0.4,
        ease: 'power2.in',
      }, 1.2)
      .to(estrada, {
        x: 0,
        duration: 0.4,
        ease: 'power2.inOut',
      }, 1.2)

      // 3. (2s) "ESTRADA" → "DEV"
      .to(estrada, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 2)
      .to(dev, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'back.out(1.7)',
      }, 2.2)

      // 4. (2.8s) "DEV" crece enormemente como texto decorativo de fondo
      .to(dev, {
        scale: 15,
        opacity: 0.05,
        duration: 1.2,
        ease: 'power2.inOut',
      }, 2.8)

      // 5. (3.5s) El fondo se desvanece revelando el contenido del hero
      .to(el, {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        duration: 0.5,
        ease: 'power2.in',
      }, 3.5);
    // onComplete del timeline dispara a ~4s

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
      {/* Textos en las 4 esquinas */}
      <span className="absolute top-4 left-4 text-xs tracking-widest select-none" style={{ color: '#ffffff' }}>

      </span>
      <span className="absolute top-4 right-4 text-xs tracking-widest select-none" style={{ color: '#ffffff' }}>

      </span>
      <span className="absolute bottom-4 left-4 text-xs tracking-widest select-none" style={{ color: '#ffffff' }}>
        Portfolio
      </span>
      <span className="absolute bottom-4 right-4 text-xs tracking-widest select-none" style={{ color: '#ffffff' }}>
        2026
      </span>

      {/* Escenario de animación */}
      <div className="relative w-full h-12">
        <span
          ref={christianRef}
          className="font-sans font-bold text-2xl tracking-widest uppercase whitespace-nowrap"
          style={{ position: 'absolute', left: '50%', top: '50%', opacity: 0, color: '#ffffff' }}
        >
          CodeByNas
        </span>
        <span
          ref={estradaRef}
          className="font-sans font-bold text-2xl tracking-widest uppercase whitespace-nowrap"
          style={{ position: 'absolute', left: '50%', top: '50%', opacity: 0, color: '#ffffff' }}
        >

        </span>
        <span
          ref={devRef}
          className="font-sans font-bold text-2xl tracking-widest uppercase whitespace-nowrap"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            opacity: 0,
            color: '#ffffff',
            transformOrigin: 'center center',
          }}
        >
          .DEV
        </span>
      </div>
    </div>
  );
}
