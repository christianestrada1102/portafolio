import { useEffect, useRef, useState } from 'react';

/**
 * Anillo 3D de proyectos (adaptado del Round Carousel de OriginKit).
 * - Cartas 16:10 dispuestas en un cilindro con perspectiva; auto-rotación lenta.
 * - Arrastre horizontal con inercia (momentum); el scroll vertical no se bloquea.
 * - La carta frontal reproduce su video; el resto muestra su imagen.
 * - Click/tap (sin arrastre) sobre una carta → onSelect(project).
 * - Reporta el proyecto frontal vía onActiveChange(index).
 */
export default function ProjectRing({ projects, onSelect, onActiveChange }) {
  const ringRef   = useRef(null);
  const rotYRef   = useRef(0);
  const velRef    = useRef(0);
  const lastRef   = useRef(0);
  const dragRef   = useRef({ active: false, x: 0, moved: 0 });
  const activeRef = useRef(0);
  const cbRef     = useRef(onActiveChange);
  useEffect(() => { cbRef.current = onActiveChange; });

  const [card, setCard]     = useState({ w: 320, h: 200 });
  const [active, setActive] = useState(0);

  const count  = projects.length;
  const angle  = 360 / count;
  const radius = (card.w * 1.35) / (2 * Math.tan(Math.PI / count));

  // Tamaño de carta responsivo
  useEffect(() => {
    const set = () =>
      setCard(window.innerWidth < 768 ? { w: 210, h: 131 } : { w: 320, h: 200 });
    set();
    window.addEventListener('resize', set);
    return () => window.removeEventListener('resize', set);
  }, []);

  // Loop de rotación + detección de carta frontal
  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;

    const reduced   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const degPerSec = reduced ? 0 : -5.5;
    let raf;

    const apply = () => {
      ring.style.transform = `translateZ(${-radius}px) rotateY(${rotYRef.current}deg)`;
    };
    apply();

    const draw = (now) => {
      const dt = lastRef.current ? (now - lastRef.current) / 1000 : 0;
      lastRef.current = now;
      const f = Math.min(dt, 0.1);
      const d = dragRef.current;

      if (!d.active) {
        if (Math.abs(velRef.current) > 0.01) {
          rotYRef.current += velRef.current * f;
          velRef.current *= 0.94;
        } else {
          rotYRef.current += degPerSec * f;
        }
      }
      apply();

      const idx = ((Math.round(-rotYRef.current / angle) % count) + count) % count;
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
        cbRef.current?.(idx);
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [radius, angle, count]);

  // Arrastre horizontal con inercia
  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragRef.current = { active: true, x: e.clientX, moved: 0 };
    velRef.current = 0;
  };
  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d.active) return;
    const dx = e.clientX - d.x;
    d.x = e.clientX;
    d.moved += Math.abs(dx);
    rotYRef.current += dx * 0.35;
    velRef.current = dx * 0.35 * 60;
  };
  const onPointerUp = (e) => {
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    dragRef.current.active = false;
  };

  const handleCardClick = (project, e) => {
    if (dragRef.current.moved > 8) return; // fue un arrastre, no un click
    onSelect?.(project, e.currentTarget);
  };

  const faceBase = {
    position: 'absolute',
    inset: 0,
    borderRadius: 8,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
  };

  return (
    <div
      className="ring-stage"
      style={{
        width: '100%',
        height: card.h * 2.1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        perspective: '3000px',
        cursor: 'grab',
        touchAction: 'pan-y',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-7deg)' }}>
        <div
          ref={ringRef}
          style={{
            position: 'relative',
            width: card.w,
            height: card.h,
            transformStyle: 'preserve-3d',
          }}
        >
          {projects.map((p, i) => {
            const isFront = i === active;
            return (
              <div
                key={p.num}
                style={{
                  position: 'absolute',
                  inset: 0,
                  transform: `rotateY(${i * angle}deg) translateZ(${radius}px)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Cara exterior: video en la frontal, imagen en el resto */}
                <div
                  role="button"
                  tabIndex={-1}
                  aria-label={p.name}
                  onClick={(e) => handleCardClick(p, e)}
                  style={{
                    ...faceBase,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                    outline: isFront
                      ? '1px solid rgba(124, 58, 237, 0.55)'
                      : '1px solid rgba(255,255,255,0.08)',
                    background: '#111',
                  }}
                >
                  {isFront && p.videoSrc ? (
                    <video
                      src={p.videoSrc}
                      poster={p.image}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
                    />
                  ) : (
                    <img
                      src={p.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
                    />
                  )}
                  {/* Número de proyecto */}
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: 8,
                      left: 10,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.85)',
                      textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                    }}
                  >
                    {p.num}
                  </span>
                </div>
                {/* Cara interior: misma imagen espejada y atenuada */}
                <div
                  aria-hidden="true"
                  style={{
                    ...faceBase,
                    transform: 'rotateY(180deg)',
                    backgroundImage: `url(${p.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.3)',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
