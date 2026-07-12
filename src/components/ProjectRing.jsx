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
  const [hovered, setHovered] = useState(-1);
  const hoveredRef = useRef(-1);
  useEffect(() => { hoveredRef.current = hovered; }, [hovered]);

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
        } else if (hoveredRef.current === -1) {
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
    const wasDrag = dragRef.current.moved > 8;
    dragRef.current.active = false;
    if (wasDrag || e.type === 'pointercancel') return;
    // Click (no arrastre): buscar la carta bajo el cursor.
    // No usamos onClick en la carta porque setPointerCapture redirige el click al stage.
    const face = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest('[data-pnum]');
    if (!face) return;
    const project = projects.find((pr) => pr.num === face.dataset.pnum);
    if (project) onSelect?.(project, face);
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
                {/* Cara exterior: el video siempre corriendo; el marco/fondo
                    solo aparece en la carta del centro */}
                <div
                  role="button"
                  tabIndex={-1}
                  aria-label={p.name}
                  data-pnum={p.num}
                  onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHovered(i); }}
                  onPointerLeave={(e) => { if (e.pointerType === 'mouse') setHovered(-1); }}
                  style={{
                    ...faceBase,
                    /* Sobre-muestreo: la cara vive al 145% y se reduce con scale;
                       el hover la lleva a escala 1:1 nativa, así el zoom no
                       pierde calidad (el navegador rasteriza al tamaño grande) */
                    inset: '-22.5%',
                    boxShadow: hovered === i
                      ? '0 18px 50px rgba(0,0,0,0.5)'
                      : isFront ? '0 10px 30px rgba(0,0,0,0.35)' : 'none',
                    outline: isFront ? '1px solid rgba(124, 58, 237, 0.55)' : 'none',
                    background: isFront ? '#111' : 'transparent',
                    transform: hovered === i ? 'translateZ(80px) scale(1)' : 'translateZ(0px) scale(0.6897)',
                    willChange: 'transform',
                    transition: 'transform 0.35s cubic-bezier(0.33, 1, 0.68, 1), outline-color 0.3s ease, box-shadow 0.3s ease',
                    cursor: p.url ? 'pointer' : 'grab',
                  }}
                >
                  {(() => {
                    const mediaStyle = {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      pointerEvents: 'none',
                    };
                    return p.videoSrc ? (
                      <video
                        src={p.videoSrc}
                        poster={p.image}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        style={mediaStyle}
                      />
                    ) : (
                      <img
                        src={p.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        style={mediaStyle}
                      />
                    );
                  })()}
                  {/* Número de proyecto: solo en la carta frontal */}
                  {isFront && (
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        top: 8,
                        left: 10,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 16,
                        color: 'rgba(255,255,255,0.85)',
                        textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                      }}
                    >
                      {p.num}
                    </span>
                  )}
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
