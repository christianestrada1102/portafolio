import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

/**
 * Anillo 3D de proyectos.
 * - Desktop (md+): cilindro 3D con perspectiva, arrastre e inercia.
 * - Mobile (<768px): carrusel 2D plano con swipe y botones prev/next.
 */
export default function ProjectRing({ projects, onSelect, onActiveChange, paused = false, bringToFront = null }) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile) {
    return (
      <MobileCarousel
        projects={projects}
        onSelect={onSelect}
        onActiveChange={onActiveChange}
        bringToFront={bringToFront}
      />
    );
  }

  return (
    <DesktopRing
      projects={projects}
      onSelect={onSelect}
      onActiveChange={onActiveChange}
      paused={paused}
      bringToFront={bringToFront}
    />
  );
}

// ── Mobile: carrusel 2D plano ──────────────────────────────────────────────────

function MobileCarousel({ projects, onSelect, onActiveChange, bringToFront }) {
  const [active, setActive] = useState(0);
  const touchStartX = useRef(null);
  const touchMovedX = useRef(0);
  const cardRef = useRef(null);

  const count = projects.length;

  // Sync bringToFront → active index
  useEffect(() => {
    if (bringToFront == null) return;
    const i = projects.findIndex((p) => p.num === bringToFront);
    if (i >= 0) goTo(i);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bringToFront]);

  const goTo = useCallback((next) => {
    const idx = ((next % count) + count) % count;
    setActive(idx);
    onActiveChange?.(idx);
  }, [count, onActiveChange]);

  const prev = () => goTo(active - 1);
  const next = () => goTo(active + 1);

  // Swipe
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchMovedX.current = 0;
  };
  const onTouchMove = (e) => {
    if (touchStartX.current == null) return;
    touchMovedX.current = e.touches[0].clientX - touchStartX.current;
  };
  const onTouchEnd = () => {
    if (Math.abs(touchMovedX.current) > 40) {
      touchMovedX.current < 0 ? next() : prev();
    }
    touchStartX.current = null;
  };

  const p = projects[active];
  const mediaStyle = { width: '100%', height: '100%', objectFit: 'cover', display: 'block' };

  return (
    <div style={{ padding: '0 16px' }}>
      {/* Card */}
      <div
        style={{ position: 'relative', maxWidth: 360, margin: '0 auto' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Prev button */}
        <button
          aria-label="Proyecto anterior"
          onClick={prev}
          style={{
            position: 'absolute', left: -12, top: '50%', transform: 'translateY(-50%)',
            zIndex: 10, width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(20,10,40,0.85)', border: '1px solid rgba(124,58,237,0.4)',
            color: '#a78bfa', fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ◀
        </button>

        {/* Card media */}
        <div
          ref={cardRef}
          role="button"
          tabIndex={0}
          aria-label={p.name}
          data-pnum={p.num}
          onClick={() => p.url && onSelect?.(p, cardRef.current)}
          onKeyDown={(e) => e.key === 'Enter' && p.url && onSelect?.(p, cardRef.current)}
          style={{
            aspectRatio: '16/10',
            borderRadius: 10,
            overflow: 'hidden',
            outline: '1px solid rgba(124,58,237,0.5)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            cursor: p.url ? 'pointer' : 'default',
            background: '#111',
            position: 'relative',
          }}
        >
          {p.videoSrc ? (
            <video
              key={p.num}
              ref={(el) => { if (el) { el.muted = true; el.play?.().catch(() => {}); } }}
              src={p.videoSrc}
              poster={p.image}
              autoPlay muted loop playsInline preload="metadata"
              style={mediaStyle}
            />
          ) : (
            <img
              key={p.num}
              src={p.image}
              alt={p.name}
              loading="eager"
              draggable={false}
              style={mediaStyle}
            />
          )}
          {/* Project number badge */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute', top: 8, left: 10,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 14, color: 'rgba(255,255,255,0.85)',
              textShadow: '0 1px 4px rgba(0,0,0,0.6)',
            }}
          >
            {p.num}
          </span>
        </div>

        {/* Next button */}
        <button
          aria-label="Proyecto siguiente"
          onClick={next}
          style={{
            position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)',
            zIndex: 10, width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(20,10,40,0.85)', border: '1px solid rgba(124,58,237,0.4)',
            color: '#a78bfa', fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ▶
        </button>
      </div>

      {/* Dot indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14 }}>
        {projects.map((_, i) => (
          <button
            key={i}
            aria-label={`Proyecto ${i + 1}`}
            onClick={() => goTo(i)}
            style={{
              width: i === active ? 18 : 6,
              height: 6,
              borderRadius: 3,
              background: i === active ? '#7c3aed' : 'rgba(124,58,237,0.3)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'width 0.25s ease, background 0.25s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Desktop: anillo 3D ─────────────────────────────────────────────────────────

function DesktopRing({ projects, onSelect, onActiveChange, paused, bringToFront }) {
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
  const pausedRef = useRef(paused);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    const set = () => setCard({ w: 320, h: 200 });
    set();
    window.addEventListener('resize', set);
    return () => window.removeEventListener('resize', set);
  }, []);

  const count  = projects.length;
  const angle  = 360 / count;
  const radius = (card.w * 1.35) / (2 * Math.tan(Math.PI / count));

  useEffect(() => {
    if (bringToFront == null) return;
    const i = projects.findIndex((p) => p.num === bringToFront);
    if (i < 0) return;
    const target = -i * (360 / projects.length);
    let t = target;
    while (t - rotYRef.current > 180) t -= 360;
    while (t - rotYRef.current < -180) t += 360;
    const obj = { v: rotYRef.current };
    const tween = gsap.to(obj, {
      v: t, duration: 0.45, ease: 'power2.inOut',
      onUpdate: () => { rotYRef.current = obj.v; },
    });
    return () => tween.kill();
  }, [bringToFront, projects]);

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
        } else if (hoveredRef.current === -1 && !pausedRef.current) {
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
    const face = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-pnum]');
    if (!face) return;
    const project = projects.find((pr) => pr.num === face.dataset.pnum);
    if (project) onSelect?.(project, face);
  };

  const faceBase = {
    position: 'absolute', inset: 0, borderRadius: 8,
    overflow: 'hidden', backfaceVisibility: 'hidden',
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
          style={{ position: 'relative', width: card.w, height: card.h, transformStyle: 'preserve-3d' }}
        >
          {projects.map((p, i) => {
            const isFront = i === active;
            return (
              <div
                key={p.num}
                style={{
                  position: 'absolute', inset: 0,
                  transform: `rotateY(${i * angle}deg) translateZ(${radius}px)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                <div
                  role="button"
                  tabIndex={-1}
                  aria-label={p.name}
                  data-pnum={p.num}
                  onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHovered(i); }}
                  onPointerLeave={(e) => { if (e.pointerType === 'mouse') setHovered(-1); }}
                  style={{
                    ...faceBase,
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
                    const mediaStyle = { width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' };
                    return p.videoSrc ? (
                      <video
                        ref={(el) => { if (el) { el.muted = true; el.play?.().catch(() => {}); } }}
                        src={p.videoSrc} poster={p.image}
                        autoPlay muted loop playsInline preload="metadata"
                        style={mediaStyle}
                      />
                    ) : (
                      <img src={p.image} alt="" loading="lazy" decoding="async" draggable={false} style={mediaStyle} />
                    );
                  })()}
                  {isFront && (
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute', top: 8, left: 10,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 16, color: 'rgba(255,255,255,0.85)',
                        textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                      }}
                    >
                      {p.num}
                    </span>
                  )}
                </div>
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
