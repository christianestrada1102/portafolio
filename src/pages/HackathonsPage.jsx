import { useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { hackathons } from '../data/hackathons';
import PixelIntro from '../components/PixelIntro';
import CharacterWaves from '../components/CharacterWaves';
import ASCIIText from '../components/ASCIIText';
import { useLanguage } from '../context/LanguageContext';

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

const STRINGS = {
  es: {
    coverHi:    'que_onda',
    coverPre:   'Bitácora de',
    coverAccent:'experiencias',
    coverP1:    'Este es mi blog personal. Acá comparto lo que he vivido gracias al desarrollo de software: hackathons, eventos y comunidad — como builder y founder.',
    coverP2:    'Fotos en 8-bit, historias reales y lo que construimos en cada una.',
    coverCta:   'Entrar a la bitácora ▶',
    back:       '◀ Volver al portafolio',
    eyebrow:    'BITÁCORA',
    place:      'LUGAR',
    team:       'EQUIPO',
    duration:   'DURACIÓN',
    hint:       '← → NAVEGAR · ESC VOLVER',
  },
  en: {
    coverHi:    'hey_there',
    coverPre:   'An archive of',
    coverAccent:'experiences',
    coverP1:    'This is my personal blog. Here I share what software development has let me live: hackathons, events and community — as a builder and founder.',
    coverP2:    '8-bit photos, real stories, and what we built at each one.',
    coverCta:   'Enter the archive ▶',
    back:       '◀ Back to portfolio',
    eyebrow:    'ARCHIVE',
    place:      'PLACE',
    team:       'TEAM',
    duration:   'DURATION',
    hint:       '← → NAVIGATE · ESC BACK',
  },
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
  const [revealed, setRevealed] = useState(false);
  const boxRef    = useRef(null);
  const canvasRef = useRef(null);
  const imgRef    = useRef(null);
  const gridRef   = useRef(null);
  const progRef   = useRef({ p: 0 });
  const drawRef   = useRef(() => {});

  const has8 = !!(photo.src8 && photo.src);

  // Disolve por celdas (técnica del PixelReveal de OriginKit): la capa 8-bit
  // vive en un canvas y sus celdas se perforan en barrido con frente ruidoso,
  // revelando la foto real debajo. Reversible.
  useLayoutEffect(() => {
    if (!has8) return;
    const box = boxRef.current;
    const canvas = canvasRef.current;
    if (!box || !canvas) return;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = photo.src8;
    imgRef.current = img;

    const GS = 12;      // tamaño de celda (px css)
    const EDGE = 0.35;  // ruido del frente

    // Offscreen con la imagen 8-bit ya recortada a cover: cada frame solo
    // copia celdas de aquí (nada de reescalar el PNG grande por frame)
    const off = document.createElement('canvas');
    const offCtx = off.getContext('2d');

    const build = () => {
      const w = Math.max(1, box.clientWidth);
      const h = Math.max(1, box.clientHeight);
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      off.width = w;
      off.height = h;
      if (img.complete && img.naturalWidth > 0) {
        const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
        const dw = img.naturalWidth * scale;
        const dh = img.naturalHeight * scale;
        offCtx.clearRect(0, 0, w, h);
        offCtx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      } else {
        offCtx.fillStyle = '#0f0820';
        offCtx.fillRect(0, 0, w, h);
      }

      const cols = Math.max(1, Math.ceil(w / GS));
      const rows = Math.max(1, Math.ceil(h / GS));
      // Celdas ordenadas por umbral para updates incrementales
      const cells = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const base = cols === 1 ? 0 : c / (cols - 1); // barrido hacia la derecha
          cells.push({ x: c * (w / cols), y: r * (h / rows), thr: base * (1 - EDGE) + Math.random() * EDGE });
        }
      }
      cells.sort((a, b) => a.thr - b.thr);
      gridRef.current = { w, h, cellW: w / cols, cellH: h / rows, cells, lastP: -1 };
    };

    const draw = () => {
      const g = gridRef.current;
      if (!g) return;
      const p = progRef.current.p;
      if (p === g.lastP) return;

      if (g.lastP < 0) {
        // Primer paint: capa completa desde el offscreen
        ctx.clearRect(0, 0, g.w, g.h);
        ctx.drawImage(off, 0, 0);
        for (const cell of g.cells) {
          if (cell.thr <= p) ctx.clearRect(cell.x, cell.y, g.cellW + 1, g.cellH + 1);
        }
      } else if (p > g.lastP) {
        // Avanza: perforar solo las celdas que acaban de cruzar el umbral
        for (const cell of g.cells) {
          if (cell.thr > p) break;
          if (cell.thr > g.lastP) ctx.clearRect(cell.x, cell.y, g.cellW + 1, g.cellH + 1);
        }
      } else {
        // Retrocede: restaurar solo las celdas que vuelven a cubrirse
        for (const cell of g.cells) {
          if (cell.thr > g.lastP) break;
          if (cell.thr > p) {
            ctx.drawImage(off, cell.x, cell.y, g.cellW + 1, g.cellH + 1, cell.x, cell.y, g.cellW + 1, g.cellH + 1);
          }
        }
      }
      g.lastP = p;
    };
    drawRef.current = draw;

    img.onload = () => { build(); draw(); };
    img.onerror = () => setBroken(true);
    build();
    draw();

    const ro = new ResizeObserver(() => { build(); draw(); });
    ro.observe(box);
    return () => ro.disconnect();
  }, [has8, photo.src8]);

  const animateTo = (target) => {
    setRevealed(target === 1);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      progRef.current.p = target;
      drawRef.current();
      return;
    }
    gsap.to(progRef.current, {
      p: target,
      duration: 1.6,
      ease: 'power2.inOut',
      overwrite: true,
      onUpdate: () => drawRef.current(),
    });
  };

  if ((!photo.src && !photo.src8) || broken) {
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
        ref={boxRef}
        onPointerEnter={(e) => { if (e.pointerType === 'mouse' && has8) animateTo(1); }}
        onPointerLeave={(e) => { if (e.pointerType === 'mouse' && has8) animateTo(0); }}
        onClick={() => { if (has8) animateTo(revealed ? 0 : 1); }}
        style={{
          aspectRatio: ratio,
          position: 'relative',
          overflow: 'hidden',
          border: `1px solid ${C.border}`,
          cursor: has8 ? 'pointer' : 'default',
        }}
      >
        {/* Foto real debajo (o única foto con filtro GBC) */}
        <img
          src={photo.src ?? photo.src8}
          alt={photo.caption || ''}
          onError={() => setBroken(true)}
          loading="lazy"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
            filter: has8 ? 'none' : GBC_FILTER,
            imageRendering: has8 ? 'auto' : 'pixelated',
          }}
        />
        {/* Capa 8-bit en canvas: se disuelve celda a celda */}
        {has8 && (
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              display: 'block', pointerEvents: 'none',
              imageRendering: 'pixelated',
            }}
          />
        )}
        {/* Scanlines (se apagan al revelar) */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)',
            opacity: revealed ? 0 : 1,
            transition: 'opacity 0.5s ease',
          }}
        />
        {/* Dither */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(96,70,160,0.07) 0px, rgba(96,70,160,0.07) 1px, transparent 1px, transparent 4px)',
            mixBlendMode: 'overlay',
            opacity: revealed ? 0 : 1,
            transition: 'opacity 0.5s ease',
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

function TopNav({ currentIdx, total, onBack, onPrev, onNext, lang, onToggleLang, showNav, backLabel }) {
  const [open, setOpen] = useState(false);

  const btn = {
    fontFamily: MONO,
    fontSize: '12px',
    width: 30,
    height: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: `1px solid ${C.border}`,
    color: C.muted,
    cursor: 'pointer',
    transition: 'color .2s, border-color .2s',
  };
  const hover = (e) => { e.currentTarget.style.color = C.text; e.currentTarget.style.borderColor = C.accent; };
  const leave = (e) => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border; };

  return (
    <>
      {/* Logo compacto (sin fondo): se expande y revela el volver */}
      <div
        style={{ position: 'fixed', top: 18, left: 22, zIndex: 20, display: 'flex', alignItems: 'center', gap: '10px' }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={{
            fontFamily: MONO,
            fontSize: '15px',
            fontWeight: 700,
            color: C.text,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            textShadow: '0 2px 12px rgba(10, 6, 16, 0.9)',
          }}
          aria-expanded={open}
          aria-label="Menú"
        >
          <span style={{ color: C.accent }}>{'</>'}</span>CodeByNas
        </button>
        <button
          type="button"
          onClick={onBack}
          tabIndex={open ? 0 : -1}
          style={{
            fontFamily: MONO,
            fontSize: '11px',
            letterSpacing: '0.1em',
            color: C.muted,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            maxWidth: open ? '220px' : '0px',
            opacity: open ? 1 : 0,
            transform: open ? 'translateX(0)' : 'translateX(-8px)',
            transition: 'max-width .45s cubic-bezier(0.33, 1, 0.68, 1), opacity .3s ease, transform .45s cubic-bezier(0.33, 1, 0.68, 1), color .2s',
            textShadow: '0 2px 12px rgba(10, 6, 16, 0.9)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = C.text; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = C.muted; }}
        >
          {backLabel}
        </button>
      </div>

      {/* Idioma + navegación (sin fondo) */}
      <div style={{ position: 'fixed', top: 16, right: 22, zIndex: 20, display: 'flex', alignItems: 'center', gap: '10px' }}>
        {showNav && (
          <>
            <button type="button" onClick={onPrev} style={btn} onMouseEnter={hover} onMouseLeave={leave} aria-label="Anterior">
              ◀
            </button>
            <span style={{ fontFamily: MONO, fontSize: '11px', color: C.muted, letterSpacing: '0.1em', minWidth: 52, textAlign: 'center', textShadow: '0 2px 12px rgba(10, 6, 16, 0.9)' }}>
              {String(currentIdx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <button type="button" onClick={onNext} style={btn} onMouseEnter={hover} onMouseLeave={leave} aria-label="Siguiente">
              ▶
            </button>
          </>
        )}
        {/* Toggle de idioma — notorio */}
        <button
          type="button"
          onClick={onToggleLang}
          aria-label="Cambiar idioma"
          style={{
            fontFamily: MONO,
            fontSize: '12px',
            letterSpacing: '0.12em',
            padding: '7px 14px',
            marginLeft: showNav ? '6px' : 0,
            background: 'rgba(124, 58, 237, 0.16)',
            border: `1px solid ${C.accent}`,
            color: C.text,
            cursor: 'pointer',
            transition: 'background .2s, color .2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(124, 58, 237, 0.35)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(124, 58, 237, 0.16)'; }}
        >
          <span style={{ color: lang === 'es' ? '#ffffff' : C.faint, fontWeight: lang === 'es' ? 700 : 400 }}>ES</span>
          <span style={{ color: C.faint }}> / </span>
          <span style={{ color: lang === 'en' ? '#ffffff' : C.faint, fontWeight: lang === 'en' ? 700 : 400 }}>EN</span>
        </button>
      </div>
    </>
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

function KeyHint({ text }) {
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
      {text}
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
  const [started, setStarted]       = useState(false);
  const { lang, toggleLang }        = useLanguage();
  const L = STRINGS[lang] ?? STRINGS.es;
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
      if (e.key === 'Escape') { navigate('/'); return; }
      if (!started) return;
      if (e.key === 'ArrowLeft')  prevHack();
      if (e.key === 'ArrowRight') nextHack();
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [prevHack, nextHack, navigate, started]);

  // Touch swipe
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (!started || touchStartX.current === null) return;
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
        <TopNav
          currentIdx={currentIdx}
          total={total}
          onBack={() => navigate('/')}
          onPrev={prevHack}
          onNext={nextHack}
          lang={lang}
          onToggleLang={toggleLang}
          showNav={started}
          backLabel={L.back}
        />
        <div style={{ height: '84px' }} aria-hidden="true" />

        {/* ── Portada: bienvenida a la bitácora ── */}
        {!started && (
          <section
            style={{
              minHeight: 'calc(100vh - 160px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingBottom: '48px',
            }}
          >
            {/* Saludo ASCII 3D (React Bits ASCIIText) */}
            <div style={{ position: 'relative', height: 'min(300px, 34vh)', marginBottom: '8px' }}>
              <ASCIIText text={L.coverHi} enableWaves asciiFontSize={8} />
            </div>

            <h1
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(2.2rem, 5.5vw, 3.4rem)',
                fontWeight: 400,
                lineHeight: 1.12,
                color: C.text,
                margin: '0 0 18px',
                letterSpacing: '-0.02em',
              }}
            >
              {L.coverPre}{' '}
              <em style={{ fontStyle: 'italic', color: C.italic, fontWeight: 400 }}>
                {L.coverAccent}
              </em>
            </h1>

            <p style={{ fontFamily: SERIF, fontSize: '19px', lineHeight: 1.75, color: C.prose, maxWidth: '560px', margin: '0 0 12px' }}>
              {L.coverP1}
            </p>
            <p style={{ fontFamily: SANS, fontSize: '14px', color: C.muted, maxWidth: '560px', margin: '0 0 32px' }}>
              {L.coverP2}
            </p>

            <button
              type="button"
              onClick={() => { setStarted(true); window.scrollTo(0, 0); }}
              style={{
                fontFamily: MONO,
                fontSize: '13px',
                letterSpacing: '0.12em',
                padding: '13px 22px',
                width: 'fit-content',
                background: 'transparent',
                border: `1px solid ${C.accent}`,
                color: C.text,
                cursor: 'pointer',
                transition: 'background .25s, color .25s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.accent; e.currentTarget.style.color = '#0a0610'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.text; }}
            >
              {L.coverCta}
            </button>
          </section>
        )}

        {started && (
        <>
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
            {L.eyebrow} — {h.date}
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
              [L.place,    h.location],
              [L.team,     h.team],
              [L.duration, h.duration],
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

        <KeyHint text={L.hint} />
        </>
        )}
      </div>
    </div>
  );
}
