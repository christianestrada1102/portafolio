import { useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { hackathons } from '../data/hackathons';
import PixelIntro from '../components/PixelIntro';
import CharacterWaves from '../components/CharacterWaves';

// ── Typography & palette ───────────────────────────────────────────────────────
const SERIF = "'Fraunces', Georgia, serif";
const SANS  = "'Inter', system-ui, sans-serif";
const MONO  = "'JetBrains Mono', ui-monospace, monospace";

const C = {
  bg:       '#0a0610',
  bg2:      '#1a0f2a',
  border:   '#2a1f4a',
  text:     '#e0d0ff',
  prose:    '#c8b8f0',
  muted:    '#8a7aa8',
  faint:    '#6a5a8a',
  accent:   '#9b7fd4',
  italic:   '#b8a2e0',
};

const GBC_FILTER =
  'grayscale(100%) sepia(60%) hue-rotate(220deg) saturate(450%) brightness(0.85) contrast(1.4)';

// ── Photo components ───────────────────────────────────────────────────────────

function PhotoPlaceholder({ idx, ratio = '16/9' }) {
  return (
    <div
      aria-hidden="true"
      style={{
        aspectRatio: ratio,
        backgroundImage: [
          'linear-gradient(45deg, #14092a 25%, transparent 25%)',
          'linear-gradient(-45deg, #14092a 25%, transparent 25%)',
          'linear-gradient(45deg, transparent 75%, #14092a 75%)',
          'linear-gradient(-45deg, transparent 75%, #14092a 75%)',
        ].join(','),
        backgroundSize: '14px 14px',
        backgroundPosition: '0 0, 0 7px, 7px -7px, -7px 0',
        backgroundColor: '#0f0820',
        border: `1px solid ${C.border}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
      }}
    >
      <span
        style={{
          width: 28, height: 28,
          border: `1px solid #4a3570`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: SANS, fontSize: '18px', color: C.faint,
        }}
      >
        +
      </span>
      <span style={{ fontFamily: MONO, fontSize: '10px', color: C.faint }}>
        IMG_0{String(idx + 1).padStart(2, '0')}.GBC
      </span>
    </div>
  );
}

function GBCPhoto({ photo, idx, ratio = '16/9' }) {
  const [broken, setBroken] = useState(false);

  if (!photo.src || broken) {
    return (
      <figure style={{ margin: 0 }}>
        <PhotoPlaceholder idx={idx} ratio={ratio} />
        {photo.caption && (
          <figcaption style={{ fontFamily: MONO, fontSize: '11px', color: C.faint, marginTop: '8px' }}>
            IMG_{String(idx + 1).padStart(3, '0')}.GBC — {photo.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure style={{ margin: 0 }}>
      <div
        style={{
          aspectRatio: ratio,
          position: 'relative',
          overflow: 'hidden',
          border: `1px solid ${C.border}`,
        }}
      >
        <img
          src={photo.src}
          alt={photo.caption || ''}
          onError={() => setBroken(true)}
          loading="lazy"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
            filter: GBC_FILTER,
            imageRendering: 'pixelated',
          }}
        />
        {/* Scanlines */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)',
          }}
        />
        {/* Dither */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(96,70,160,0.07) 0px, rgba(96,70,160,0.07) 1px, transparent 1px, transparent 4px)',
            mixBlendMode: 'overlay',
          }}
        />
      </div>
      {photo.caption && (
        <figcaption style={{ fontFamily: MONO, fontSize: '11px', color: C.faint, marginTop: '8px' }}>
          IMG_{String(idx + 1).padStart(3, '0')}.GBC — {photo.caption}
        </figcaption>
      )}
    </figure>
  );
}

// ── Text components ────────────────────────────────────────────────────────────

function Paragraphs({ paragraphs, dropCap = false }) {
  return (
    <>
      {paragraphs.map((text, i) => {
        const isFirst = dropCap && i === 0;
        return (
          <p
            key={i}
            style={{
              fontFamily: SERIF,
              fontSize: '19px',
              lineHeight: 1.78,
              color: C.prose,
              margin: '0 0 1.5em',
              letterSpacing: '0.01em',
            }}
          >
            {isFirst ? (
              <>
                <span
                  style={{
                    fontFamily: SERIF,
                    fontSize: '4.4em',
                    fontWeight: 500,
                    color: C.italic,
                    float: 'left',
                    lineHeight: 0.78,
                    marginRight: '0.07em',
                    marginTop: '0.08em',
                  }}
                  aria-hidden="true"
                >
                  {text[0]}
                </span>
                {text.slice(1)}
                <span style={{ display: 'block', clear: 'both' }} />
              </>
            ) : text}
          </p>
        );
      })}
    </>
  );
}

// ── Photo + story interleaved layout ──────────────────────────────────────────

function EditorialLayout({ photos, story }) {
  const hasPhotos = photos.length > 0;

  if (!hasPhotos) {
    return <Paragraphs paragraphs={story} dropCap />;
  }

  if (photos.length === 1) {
    return (
      <>
        <div style={{ marginBottom: '2.5rem' }}>
          <GBCPhoto photo={photos[0]} idx={0} ratio="16/9" />
        </div>
        <Paragraphs paragraphs={story} dropCap />
      </>
    );
  }

  // 2+ photos: main photo → first half of story → photo grid → rest of story
  const mid   = Math.ceil(story.length / 2);
  const grid  = photos.slice(1);               // all except main
  const cols  = grid.length >= 2 ? 2 : 1;     // 2-col grid if 2+ secondary

  return (
    <>
      {/* Main photo */}
      <div style={{ marginBottom: '2.5rem' }}>
        <GBCPhoto photo={photos[0]} idx={0} ratio="16/9" />
      </div>

      {/* First chunk of text */}
      {story.slice(0, mid).length > 0 && (
        <Paragraphs paragraphs={story.slice(0, mid)} dropCap />
      )}

      {/* Secondary photos grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: '12px',
          margin: '2.5rem 0',
        }}
      >
        {grid.slice(0, 4).map((photo, i) => (
          <GBCPhoto key={i} photo={photo} idx={i + 1} ratio="4/3" />
        ))}
      </div>

      {/* Remaining text */}
      {story.slice(mid).length > 0 && (
        <Paragraphs paragraphs={story.slice(mid)} />
      )}
    </>
  );
}

// ── Top nav ────────────────────────────────────────────────────────────────────

function TopNav({ currentIdx, total, onBack }) {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 0',
        borderBottom: `1px solid ${C.border}`,
        marginBottom: '48px',
      }}
    >
      <button
        onClick={onBack}
        style={{
          fontFamily: SANS,
          fontSize: '13px',
          color: C.muted,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          transition: 'color .2s',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
        onMouseEnter={e => e.currentTarget.style.color = C.text}
        onMouseLeave={e => e.currentTarget.style.color = C.muted}
      >
        ◀ Volver al portafolio
      </button>

      <span
        style={{
          fontFamily: MONO,
          fontSize: '11px',
          color: C.faint,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        {String(currentIdx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} — HACKATHON ARCHIVE
      </span>
    </nav>
  );
}

// ── Bottom nav ─────────────────────────────────────────────────────────────────

function BottomNav({ currentIdx, total, onPrev, onNext }) {
  const prev = hackathons[(currentIdx - 1 + total) % total];
  const next = hackathons[(currentIdx + 1) % total];
  const prevLabel = `${prev.event} ${prev.eventItalic}`;
  const nextLabel = `${next.event} ${next.eventItalic}`;

  const btnStyle = (align) => ({
    fontFamily: SANS,
    fontSize: '13px',
    color: C.muted,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    textAlign: align,
    transition: 'color .2s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    maxWidth: '200px',
  });

  return (
    <nav
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        gap: '16px',
        padding: '32px 0 48px',
        borderTop: `1px solid ${C.border}`,
        marginTop: '56px',
      }}
    >
      <button
        onClick={onPrev}
        style={btnStyle('left')}
        onMouseEnter={e => e.currentTarget.style.color = C.text}
        onMouseLeave={e => e.currentTarget.style.color = C.muted}
      >
        <span>◀</span>
        <span style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {prevLabel}
        </span>
      </button>

      <span
        style={{
          fontFamily: MONO,
          fontSize: '11px',
          color: C.faint,
          letterSpacing: '0.12em',
          whiteSpace: 'nowrap',
        }}
      >
        {String(currentIdx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>

      <button
        onClick={onNext}
        style={{ ...btnStyle('right'), justifyContent: 'flex-end' }}
        onMouseEnter={e => e.currentTarget.style.color = C.text}
        onMouseLeave={e => e.currentTarget.style.color = C.muted}
      >
        <span style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {nextLabel}
        </span>
        <span>▶</span>
      </button>
    </nav>
  );
}

// ── Hint bar ───────────────────────────────────────────────────────────────────

function KeyHint() {
  return (
    <p
      style={{
        fontFamily: MONO,
        fontSize: '10px',
        color: C.faint,
        textAlign: 'center',
        letterSpacing: '0.1em',
        paddingBottom: '32px',
        opacity: 0.7,
      }}
    >
      ← → NAVEGAR · ESC VOLVER
    </p>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function HackathonsPage() {
  const navigate    = useNavigate();
  const contentRef  = useRef(null);
  const touchStartX = useRef(null);
  const mountedRef  = useRef(false);

  const [currentIdx, setCurrentIdx] = useState(0);
  const total = hackathons.length;

  // SEO
  useEffect(() => {
    const prevTitle = document.title;
    const prevMeta  = document.querySelector('meta[name="description"]')?.getAttribute('content');
    document.title = 'Hackathon Archive — Christian Estrada';
    document.querySelector('meta[name="description"]')
      ?.setAttribute('content', 'Bitácora visual de hackathons en los que ha participado Christian Estrada.');
    return () => {
      document.title = prevTitle;
      if (prevMeta)
        document.querySelector('meta[name="description"]')?.setAttribute('content', prevMeta);
    };
  }, []);

  // Destroy Lenis completely so its wheel-event interception doesn't block scroll.
  // Recreate it when leaving so the landing page keeps smooth scroll.
  useEffect(() => {
    if (window.stopLenis) window.stopLenis();
    window.scrollTo(0, 0);
    return () => { if (window.startLenis) window.startLenis(); };
  }, []);

  // GSAP entrance + transition animations
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { mountedRef.current = true; return; }

    if (!mountedRef.current) {
      mountedRef.current = true;
      gsap.fromTo(el,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.05 },
      );
    } else {
      gsap.fromTo(el,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' },
      );
    }
  }, [currentIdx]);

  // Navigate between hackathons
  const goTo = useCallback((newIdx) => {
    const el      = contentRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || !el) {
      window.scrollTo(0, 0);
      setCurrentIdx(newIdx);
      return;
    }

    gsap.to(el, {
      opacity: 0, y: -12, duration: 0.22, ease: 'power2.in',
      onComplete: () => {
        window.scrollTo(0, 0);
        setCurrentIdx(newIdx);
      },
    });
  }, []);

  const prevHack = useCallback(() => goTo((currentIdx - 1 + total) % total), [currentIdx, total, goTo]);
  const nextHack = useCallback(() => goTo((currentIdx + 1) % total), [currentIdx, total, goTo]);

  // Keyboard
  useEffect(() => {
    const handle = (e) => {
      if (e.key === 'ArrowLeft')  prevHack();
      if (e.key === 'ArrowRight') nextHack();
      if (e.key === 'Escape')     navigate('/');
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [prevHack, nextHack, navigate]);

  // Touch swipe
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 48) { dx > 0 ? prevHack() : nextHack(); }
    touchStartX.current = null;
  };

  const h = hackathons[currentIdx];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      style={{ background: C.bg, minHeight: '100vh', color: C.text }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Intro: pixeles + </>CodeByNas, cortina que revela la bitácora */}
      <PixelIntro />

      {/* Fondo: olas de caracteres ASCII (OriginKit character-waves) */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.5, pointerEvents: 'none' }} aria-hidden="true">
        <CharacterWaves />
      </div>

      {/* Content wrapper — max 880px, centered */}
      <div
        ref={contentRef}
        style={{ maxWidth: '880px', margin: '0 auto', padding: '0 36px', position: 'relative', zIndex: 1 }}
        className="px-5 md:px-9"
      >
        {/* Top nav */}
        <TopNav currentIdx={currentIdx} total={total} onBack={() => navigate('/')} />

        {/* ── Article ── */}
        <article>

          {/* Eyebrow */}
          <p
            style={{
              fontFamily: MONO,
              fontSize: '11px',
              color: C.accent,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            BITÁCORA — {h.date}
          </p>

          {/* Title */}
          <h1
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(2.4rem, 6vw, 3.6rem)',
              fontWeight: 400,
              lineHeight: 1.12,
              color: C.text,
              margin: '0 0 20px',
              letterSpacing: '-0.02em',
            }}
          >
            {h.event}{' '}
            <em style={{ fontStyle: 'italic', color: C.italic, fontWeight: 400 }}>
              {h.eventItalic}
            </em>
          </h1>

          {/* Meta row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '4px 0',
              marginBottom: '48px',
              alignItems: 'center',
            }}
          >
            {[
              ['LUGAR',    h.location],
              ['EQUIPO',   h.team],
              ['DURACIÓN', h.duration],
            ].map(([label, value], i) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && (
                  <span style={{ margin: '0 10px', color: C.border }}>·</span>
                )}
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: '10px',
                    color: C.accent,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginRight: '6px',
                  }}
                >
                  {label}
                </span>
                <span style={{ fontFamily: SANS, fontSize: '14px', color: C.muted }}>
                  {value}
                </span>
              </span>
            ))}
          </div>

          {/* Editorial content */}
          <EditorialLayout photos={h.photos} story={h.story} />

        </article>

        {/* Bottom nav */}
        <BottomNav
          currentIdx={currentIdx}
          total={total}
          onPrev={prevHack}
          onNext={nextHack}
        />

        <KeyHint />
      </div>
    </div>
  );
}
