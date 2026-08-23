import { useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { hackathons } from '../data/hackathons';
import savedLayouts from '../data/layouts.json';
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
    coverWords: ['hola', 'soy_christian', 'fullstack_dev', 'builder', 'founder', 'bienvenido'],
    coverPre:   'Bitácora de',
    coverAccent:'experiencias',
    coverP1:    'Apasionado por la tecnología. Este es mi blog personal: lo que he vivido gracias al desarrollo de software — hackathons, eventos y comunidad.',
    coverP2:    'Te invito a recorrer mi camino por el ecosistema.',
    coverCta:   'Entrar a la bitácora ▶',
    back:       '◀ Volver al portafolio',
    eyebrow:    'BITÁCORA',
    place:      'LUGAR',
    team:       'EQUIPO',
    duration:   'DURACIÓN',
    hint:       '← → NAVEGAR',
  },
  en: {
    coverWords: ['hi', "i'm_christian", 'fullstack_dev', 'builder', 'founder', 'welcome'],
    coverPre:   'An archive of',
    coverAccent:'experiences',
    coverP1:    'Passionate about technology. This is my personal blog: everything software development has let me live — hackathons, events and community.',
    coverP2:    'Come walk my path through the ecosystem.',
    coverCta:   'Enter the archive ▶',
    back:       '◀ Back to portfolio',
    eyebrow:    'ARCHIVE',
    place:      'PLACE',
    team:       'TEAM',
    duration:   'DURATION',
    hint:       '← → NAVIGATE',
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
        {/* Foto real debajo — siempre con filtro GBC para consistencia */}
        <img
          src={photo.src ?? photo.src8}
          alt={photo.caption || ''}
          onError={() => setBroken(true)}
          loading="lazy"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: photo.pos ?? 'center', display: 'block',
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

function Paragraphs({ paragraphs, dropCap = false, editor = false, onText }) {
  return (
    <>
      {paragraphs.map((text, i) => {
        // En modo editor el párrafo es texto plano editable (sin capitular,
        // que partiría el primer carácter)
        const isFirst = dropCap && i === 0 && !editor;
        return (
          <p
            key={i}
            contentEditable={editor}
            suppressContentEditableWarning={editor}
            onBlur={editor ? (e) => onText?.(i, e.currentTarget.innerText.replace(/\s*\n+\s*/g, ' ').trim()) : undefined}
            style={{
              ...(editor ? { cursor: 'text', outline: '1px dotted rgba(167,139,250,0.35)', outlineOffset: '4px' } : {}),
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

// Aparece al entrar en viewport: sube, se endereza y asienta con una
// inclinación sutil permanente (efecto foto pegada en diario)
function ScrollReveal({ children, y = 44, x = 0, tilt = 0, delay = 0 }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSeen(true);
      return;
    }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); obs.disconnect(); }
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: seen ? 1 : 0,
        transform: seen
          ? `rotate(${tilt}deg)`
          : `translate(${x}px, ${y}px) rotate(${tilt * 3}deg) scale(0.96)`,
        transition: `opacity 0.7s ease ${delay}s, transform 0.9s cubic-bezier(0.22, 0.9, 0.3, 1) ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}

// Modo editor (?editor=1): envuelve cada foto y permite arrastrarla (mover),
// redimensionarla (cuadro inferior-derecha) y rotarla (círculo superior-derecha).
// Los ajustes se guardan como overrides {dx, dy, w, rot} por artículo/slot.
function Arrangeable({ editor, ov = {}, onOv, textMode = false, children }) {
  const startDrag = (mode) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const sx = e.clientX, sy = e.clientY;
    const base = { dx: ov.dx ?? 0, dy: ov.dy ?? 0, w: ov.w ?? 100, rot: ov.rot ?? 0 };
    const move = (ev) => {
      const mx = ev.clientX - sx, my = ev.clientY - sy;
      if (mode === 'move')      onOv({ dx: Math.round(base.dx + mx), dy: Math.round(base.dy + my) });
      else if (mode === 'size') onOv({ w: Math.round(Math.min(170, Math.max(30, base.w + mx / 4))) });
      else                      onOv({ rot: Math.round(Math.min(20, Math.max(-20, base.rot + mx / 6)) * 10) / 10 });
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const handleBase = {
    position: 'absolute',
    width: '16px',
    height: '16px',
    background: C.accent,
    zIndex: 3,
    touchAction: 'none',
  };

  return (
    <div
      onPointerDown={editor && !textMode ? startDrag('move') : undefined}
      style={{
        width: `${ov.w ?? 100}%`,
        transform: `translate(${ov.dx ?? 0}px, ${ov.dy ?? 0}px) rotate(${ov.rot ?? 0}deg)`,
        position: 'relative',
        touchAction: editor && !textMode ? 'none' : undefined,
        ...(editor ? {
          outline: `1px dashed rgba(167,139,250,${textMode ? 0.35 : 0.7})`,
          cursor: textMode ? undefined : 'grab',
        } : {}),
      }}
    >
      {children}
      {editor && (
        <>
          {/* En fotos se bloquean sus clics; el texto queda libre para editar */}
          {!textMode && <div style={{ position: 'absolute', inset: 0, zIndex: 2 }} />}
          {/* Asa de mover para bloques de texto */}
          {textMode && (
            <div
              onPointerDown={startDrag('move')}
              title="Arrastra para mover el bloque"
              style={{ ...handleBase, left: '-24px', top: '2px', cursor: 'grab', borderRadius: '2px' }}
            />
          )}
          <div
            onPointerDown={startDrag('size')}
            title="Arrastra para redimensionar"
            style={{ ...handleBase, right: '-8px', bottom: '-8px', cursor: 'nwse-resize' }}
          />
          {!textMode && (
            <div
              onPointerDown={startDrag('rot')}
              title="Arrastra para rotar"
              style={{ ...handleBase, right: '-8px', top: '-8px', borderRadius: '50%', cursor: 'ew-resize' }}
            />
          )}
        </>
      )}
    </div>
  );
}

// Layout editorial asimétrico: la foto principal rompe ancho, las secundarias
// se flotan alternando lado (el texto las envuelve) y una ancha se desplaza
// fuera del margen. Nada de rejillas cuadradas.
function EditorialLayout({ photos, story, dropCap = true, editor = false, ovs = {}, onOv }) {
  const wrap = (idx, node) => (
    <Arrangeable editor={editor} ov={ovs[idx]} onOv={(patch) => onOv?.(idx, patch)}>
      {node}
    </Arrangeable>
  );

  // Bloque de texto: movible/redimensionable y con párrafos editables en
  // modo editor. El texto corregido se guarda como override (ov.text)
  const textBlock = (key, paras, extra = {}) => {
    const ov = ovs[key] ?? {};
    const eff = ov.text ?? paras;
    if (eff.length === 0) return null;
    return (
      <Arrangeable editor={editor} textMode ov={ov} onOv={(patch) => onOv?.(key, patch)}>
        <Paragraphs
          paragraphs={eff}
          {...extra}
          editor={editor}
          onText={(i, t) => {
            const next = [...eff];
            next[i] = t;
            onOv?.(key, { text: next });
          }}
        />
      </Arrangeable>
    );
  };

  if (photos.length === 0) {
    return textBlock('tA', story, { dropCap });
  }

  const [main, ...rest] = photos;
  // Reparto del texto en hasta 3 bloques alrededor de las inserciones
  const cut1 = Math.max(1, Math.ceil(story.length / 3));
  const cut2 = Math.max(cut1 + 1, Math.ceil((story.length * 2) / 3));
  const blockA = story.slice(0, cut1);
  const blockB = story.slice(cut1, cut2);
  const blockC = story.slice(cut2);

  const floatBox = (side) => ({
    float: side,
    width: 'clamp(170px, 44%, 330px)',
    margin: side === 'right'
      ? '0.35em 0 1.2rem clamp(16px, 3vw, 32px)'
      : '0.35em clamp(16px, 3vw, 32px) 1.2rem 0',
  });

  // Foto ancha que se sale del margen de la columna
  const bleed = 'min(48px, 4vw)';

  return (
    <>
      {/* Foto principal: panorámica, fuera de margen a ambos lados */}
      <div
        style={{
          width: `calc(100% + ${bleed} * 2)`,
          marginLeft: `calc(${bleed} * -1)`,
          marginBottom: '2.75rem',
        }}
      >
        <ScrollReveal y={52}>
          {wrap(0, <GBCPhoto photo={main} idx={0} ratio="21/9" />)}
        </ScrollReveal>
      </div>

      {/* Bloque 1: primera foto secundaria flotada a la derecha */}
      {rest[0] && (
        <div style={floatBox('right')}>
          <ScrollReveal x={44} y={24} tilt={1.4} delay={0.1}>
            {wrap(1, <GBCPhoto photo={rest[0]} idx={1} ratio="4/5" />)}
          </ScrollReveal>
        </div>
      )}
      {textBlock('tA', blockA, { dropCap })}
      <div style={{ clear: 'both' }} />

      {/* Bloque 2: foto vertical flotada a la izquierda */}
      {rest[1] && blockB.length > 0 && (
        <div style={floatBox('left')}>
          <ScrollReveal x={-44} y={24} tilt={-1.2}>
            {wrap(2, <GBCPhoto photo={rest[1]} idx={2} ratio="3/4" />)}
          </ScrollReveal>
        </div>
      )}
      {rest[1] && blockB.length === 0 && (
        <div style={{ margin: '0 0 2.5rem' }}>
          <ScrollReveal y={48} tilt={-0.8}>
            {wrap(2, <GBCPhoto photo={rest[1]} idx={2} ratio="16/9" />)}
          </ScrollReveal>
        </div>
      )}
      {textBlock('tB', blockB)}
      <div style={{ clear: 'both' }} />

      {textBlock('tC', blockC)}

      {/* Foto ancha al final — después de todo el texto */}
      {rest[2] && (
        <div
          style={{
            width: `calc(88% + ${bleed})`,
            marginLeft: 'auto',
            marginRight: `calc(${bleed} * -1)`,
            margin: `2.75rem calc(${bleed} * -1) 2.75rem auto`,
          }}
        >
          <ScrollReveal y={52}>
            {wrap(3, <GBCPhoto photo={rest[2]} idx={3} ratio="21/9" />)}
          </ScrollReveal>
        </div>
      )}

      {/* Sobrantes: par escalonado (una baja respecto a la otra) */}
      {rest.length > 3 && (
        <div
          style={{
            display: 'flex',
            gap: 'clamp(12px, 2.5vw, 24px)',
            alignItems: 'flex-start',
            margin: '2.75rem 0 1rem',
          }}
        >
          {rest.slice(3, 5).map((photo, i) => (
            <div
              key={i}
              style={{
                flex: i === 0 ? '1.15' : '0.85',
                marginTop: i === 1 ? 'clamp(24px, 5vw, 56px)' : 0,
              }}
            >
              <ScrollReveal y={48} tilt={i === 0 ? -1.1 : 1.5} delay={i * 0.14}>
                {wrap(4 + i, <GBCPhoto photo={photo} idx={4 + i} ratio={i === 0 ? '4/3' : '3/4'} />)}
              </ScrollReveal>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// Encabezado de capítulo dentro de un artículo con varias partes (mismo viaje)
function ChapterHeading({ index, title, titleItalic }) {
  return (
    <div style={{ margin: '0 0 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
        <span
          style={{
            fontFamily: MONO,
            fontSize: '11px',
            color: C.accent,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          Cap. {String(index + 1).padStart(2, '0')}
        </span>
        <span style={{ flex: 1, height: '1px', background: C.border }} />
      </div>
      <h2
        style={{
          fontFamily: SERIF,
          fontSize: 'clamp(1.7rem, 4vw, 2.4rem)',
          fontWeight: 400,
          lineHeight: 1.15,
          color: C.text,
          margin: 0,
          letterSpacing: '-0.01em',
        }}
      >
        {title}{' '}
        <em style={{ fontStyle: 'italic', color: C.italic, fontWeight: 400 }}>
          {titleItalic}
        </em>
      </h2>
    </div>
  );
}

// ── Top nav ────────────────────────────────────────────────────────────────────

// ── Avión pixel (para artículos con viaje) ──────────────────────────────────
// Sprite 8-bit dibujado con rects: cola a la izquierda, nariz a la derecha.
const PLANE_ART = [
  'X..................',
  'XX.................',
  'XXX................',
  '.XXXXXXXXXXXXXXX...',
  '.XXoXoXoXoXXXXXXXX.',
  '.XXXXXXXXXXXXXXX...',
  '....XXXX...........',
  '......XXX..........',
  '........X..........',
];

function PixelPlane({ size = 6 }) {
  return (
    <svg
      width={PLANE_ART[0].length * size}
      height={PLANE_ART.length * size}
      style={{ display: 'block', shapeRendering: 'crispEdges' }}
      aria-hidden="true"
    >
      {PLANE_ART.flatMap((row, y) =>
        [...row].map((ch, x) =>
          ch === '.' ? null : (
            <rect
              key={`${x}-${y}`}
              x={x * size}
              y={y * size}
              width={size}
              height={size}
              fill={ch === 'o' ? '#2a0626' : '#d8baee'}
            />
          )
        )
      )}
    </svg>
  );
}

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
  const articleRef  = useRef(null);
  const passOverlayRef = useRef(null);
  const passRef        = useRef(null);
  const stampRef       = useRef(null);
  const stubRef        = useRef(null);
  const planeRef       = useRef(null);
  const routeRef       = useRef(null);
  const boardingTlRef  = useRef(null);
  const touchStartX = useRef(null);
  const mountedRef  = useRef(false);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [started, setStarted]       = useState(false);
  // La portada no arranca (rotación del saludo) hasta que el intro termina
  const [introDone, setIntroDone]   = useState(false);
  const handleIntroDone = useCallback(() => setIntroDone(true), []);

  // Modo editor (?editor=1): arrastra fotos para acomodarlas; los overrides
  // viven en localStorage y se exportan a src/data/layouts.json para producción
  const editorMode = new URLSearchParams(window.location.search).has('editor');
  const [layoutOv, setLayoutOv] = useState(() => {
    let ls = {};
    try { ls = JSON.parse(localStorage.getItem('bitacora-layout') || '{}'); } catch { /* corrupto: se ignora */ }
    return { ...savedLayouts, ...ls };
  });
  const setOv = useCallback((scope, idx, patch) => {
    setLayoutOv((prev) => {
      const next = {
        ...prev,
        [scope]: { ...prev[scope], [idx]: { ...prev[scope]?.[idx], ...patch } },
      };
      try { localStorage.setItem('bitacora-layout', JSON.stringify(next)); } catch { /* sin espacio */ }
      return next;
    });
  }, []);
  const exportLayout = useCallback(() => {
    const blob = new Blob([JSON.stringify(layoutOv, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'layouts.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }, [layoutOv]);
  const resetLayout = useCallback((articleId) => {
    setLayoutOv((prev) => {
      const next = Object.fromEntries(
        Object.entries(prev).filter(([k]) => k !== articleId && !k.startsWith(`${articleId}#`)),
      );
      try { localStorage.setItem('bitacora-layout', JSON.stringify(next)); } catch { /* sin espacio */ }
      return next;
    });
  }, []);
  const { lang, toggleLang }        = useLanguage();
  const L = STRINGS[lang] ?? STRINGS.es;
  const total = hackathons.length;

  // Saludo rotativo de la portada — scramble entre palabras
  const asciiWrapRef = useRef(null);
  const [coverWord, setCoverWord] = useState(STRINGS.es.coverWords[0]);
  useEffect(() => {
    const words = (STRINGS[lang] ?? STRINGS.es).coverWords;
    setCoverWord(words[0]);
    if (started || !introDone) return;

    // Transición scramble (técnica del ScrambleText de OriginKit): las letras
    // se revuelven con glifos aleatorios y se resuelven de izquierda a derecha
    const GLYPHS = 'abcdefghijklmnopqrstuvwxyz<>/_*+=#%';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let idx = 0;
    let raf = 0;
    let lastFrame = 0;

    const scrambleTo = (word) => {
      const dur = 750;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / dur);
        if (now - lastFrame >= 40 || t === 1) {
          lastFrame = now;
          let out = '';
          for (let i = 0; i < word.length; i++) {
            const reveal = 0.15 + (i / word.length) * 0.75;
            out += t >= reveal ? word[i] : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
          setCoverWord(out);
        }
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const id = setInterval(() => {
      idx = (idx + 1) % words.length;
      if (reduced) setCoverWord(words[idx]);
      else scrambleTo(words[idx]);
    }, 1700);
    return () => { clearInterval(id); cancelAnimationFrame(raf); };
  }, [started, lang, introDone]);

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

    // Artículo con viaje: pase de abordar — cae, se sella ABORDADO, se rasga
    // el talón y el artículo entra con un fade normal
    const art     = articleRef.current;
    const overlay = passOverlayRef.current;
    const pass    = passRef.current;
    const stamp   = stampRef.current;
    const stub    = stubRef.current;
    const plane   = planeRef.current;
    const route   = routeRef.current;

    // Si había un abordaje en curso (flechas rápidas), se cancela y se
    // limpia todo su rastro antes de animar el artículo nuevo
    const killBoarding = () => {
      if (boardingTlRef.current) {
        boardingTlRef.current.kill();
        boardingTlRef.current = null;
      }
      // Resets explícitos: clearProps:'all' borraría también los estilos
      // inline que puso React (display, background, position...)
      if (overlay) gsap.set(overlay, { display: 'none', opacity: 1 });
      if (pass) gsap.set(pass, { y: 0, rotation: 0, scale: 1, opacity: 1 });
      if (stamp) gsap.set(stamp, { opacity: 0, scale: 1, rotation: 0 });
      if (plane) gsap.set(plane, { left: '0%', xPercent: -50, yPercent: -50 });
      if (route) gsap.set(route, { scaleX: 0 });
      if (art) gsap.set(art, { opacity: 1, y: 0 });
    };
    killBoarding();

    if (started && hackathons[currentIdx]?.travel && art && overlay && pass && stamp && stub && plane && route) {
      mountedRef.current = true;
      gsap.set(el, { opacity: 1, y: 0 });
      gsap.set(art, { opacity: 0, y: 18 });
      const tl = gsap.timeline({ onComplete: killBoarding });
      boardingTlRef.current = tl;
      tl.set(overlay, { display: 'flex' })
        .set(plane, { xPercent: -50, yPercent: -50, left: '0%' })
        // Entra el pase, suave
        .fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'power1.out' })
        .fromTo(pass,
          { y: 26, opacity: 0, scale: 0.97 },
          { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }, '-=0.08')
        // El vuelo: la línea se dibuja y el avión la recorre CUU → MTY
        .to(route, { scaleX: 1, duration: 0.85, ease: 'power1.inOut' }, '-=0.05')
        .to(plane, { left: '100%', duration: 0.85, ease: 'power1.inOut' }, '<')
        // Sello ABORDADO al aterrizar
        .fromTo(stamp,
          { opacity: 0, scale: 1.9, rotation: -20 },
          { opacity: 1, scale: 1, rotation: -8, duration: 0.22, ease: 'power3.in' }, '+=0.06')
        // Sale hacia arriba y entra el artículo
        .to(pass, { y: -34, opacity: 0, duration: 0.38, ease: 'power2.in' }, '+=0.32')
        .to(overlay, { opacity: 0, duration: 0.32, ease: 'power1.in' }, '<0.06')
        .set(overlay, { display: 'none' })
        .to(art, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '<');
      return () => killBoarding();
    }

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
  }, [currentIdx, started]);

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
      <PixelIntro onDone={handleIntroDone} />

      {/* Pase de abordar — overlay para artículos con viaje */}
      <div
        ref={passOverlayRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(10, 6, 16, 0.93)',
          pointerEvents: 'none',
        }}
      >
        <div
          ref={passRef}
          style={{
            display: 'flex',
            fontFamily: MONO,
            filter: 'drop-shadow(0 18px 50px rgba(0,0,0,0.65))',
            maxWidth: '92vw',
          }}
        >
          {/* Cuerpo del pase */}
          <div
            style={{
              position: 'relative',
              background: '#150b26',
              border: `1px solid ${C.border}`,
              borderRight: 'none',
              borderRadius: '10px 0 0 10px',
              overflow: 'hidden',
              minWidth: 0,
              flex: 1,
            }}
          >
            {/* Cabecera de aerolínea */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '18px',
                padding: '10px clamp(18px, 3.5vw, 30px)',
                background: 'rgba(124, 58, 237, 0.18)',
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <span style={{ fontSize: '10px', letterSpacing: '0.22em', color: C.text }}>{'</>'}CODEBYNAS AIR</span>
              <span style={{ fontSize: '10px', letterSpacing: '0.22em', color: C.accent }}>PASE DE ABORDAR</span>
            </div>
            <div style={{ padding: 'clamp(14px, 2.5vw, 22px) clamp(18px, 3.5vw, 30px)' }}>
              {/* Ruta: la línea se dibuja y el avión la recorre */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2.5vw, 20px)', marginBottom: '18px' }}>
                <div>
                  <div style={{ fontSize: 'clamp(24px, 4.5vw, 36px)', color: C.text, letterSpacing: '0.06em' }}>CUU</div>
                  <div style={{ fontSize: '9px', letterSpacing: '0.16em', color: C.faint }}>CHIHUAHUA</div>
                </div>
                <div style={{ flex: 1, position: 'relative', height: '30px', minWidth: 'clamp(90px, 16vw, 190px)' }}>
                  <div style={{ position: 'absolute', left: 0, right: 0, top: 'calc(50% - 1px)', borderTop: `2px dashed ${C.border}` }} />
                  <div
                    ref={routeRef}
                    style={{
                      position: 'absolute', left: 0, right: 0, top: 'calc(50% - 1px)',
                      height: '2px', background: C.accent,
                      transform: 'scaleX(0)', transformOrigin: 'left center',
                    }}
                  />
                  <div style={{ position: 'absolute', left: '-2px', top: 'calc(50% - 3px)', width: '6px', height: '6px', borderRadius: '50%', background: C.accent }} />
                  <div style={{ position: 'absolute', right: '-2px', top: 'calc(50% - 3px)', width: '6px', height: '6px', borderRadius: '50%', background: C.muted }} />
                  <div ref={planeRef} style={{ position: 'absolute', left: 0, top: '50%' }}>
                    <PixelPlane size={2} />
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 'clamp(24px, 4.5vw, 36px)', color: C.text, letterSpacing: '0.06em' }}>MTY</div>
                  <div style={{ fontSize: '9px', letterSpacing: '0.16em', color: C.faint }}>MONTERREY</div>
                </div>
              </div>
              {/* Datos del pasajero */}
              <div style={{ display: 'flex', gap: 'clamp(14px, 3vw, 26px)', flexWrap: 'wrap', marginBottom: '16px' }}>
                {[['PASAJERO', 'CHRISTIAN'], ['FECHA', 'NOV 2025'], ['VUELO', 'BIT-025'], ['PUERTA', 'A7'], ['ASIENTO', '4E']].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: '9px', letterSpacing: '0.18em', color: C.faint, marginBottom: '3px' }}>{k}</div>
                    <div style={{ fontSize: '13px', color: C.prose }}>{v}</div>
                  </div>
                ))}
              </div>
              {/* Código de barras */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '24px' }}>
                {[3,1,2,1,4,1,1,3,2,1,3,1,1,2,4,1,2,1,3,1,2,2,1,4,1,1,3,1,2,1].map((w, i) => (
                  <div key={i} style={{ width: `${w}px`, height: '100%', background: i % 3 ? C.muted : C.accent, opacity: 0.8 }} />
                ))}
              </div>
            </div>
            {/* Sello ABORDADO */}
            <div
              ref={stampRef}
              style={{
                position: 'absolute',
                top: '34%',
                left: '50%',
                marginLeft: '-90px',
                border: `3px solid ${C.accent}`,
                borderRadius: '4px',
                color: C.accent,
                fontSize: '19px',
                letterSpacing: '0.3em',
                padding: '7px 16px',
                opacity: 0,
                background: 'rgba(10, 6, 16, 0.4)',
              }}
            >
              ABORDADO
            </div>
          </div>
          {/* Perforación + talón */}
          <div
            ref={stubRef}
            style={{
              position: 'relative',
              background: '#150b26',
              border: `1px solid ${C.border}`,
              borderLeft: `2px dashed ${C.border}`,
              borderRadius: '0 10px 10px 0',
              padding: 'clamp(16px, 3vw, 26px) clamp(14px, 2.5vw, 22px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
            }}
          >
            {/* Muescas de la perforación */}
            <div style={{ position: 'absolute', left: '-9px', top: '-9px', width: '16px', height: '16px', borderRadius: '50%', background: '#0a0610', zIndex: 1 }} />
            <div style={{ position: 'absolute', left: '-9px', bottom: '-9px', width: '16px', height: '16px', borderRadius: '50%', background: '#0a0610', zIndex: 1 }} />
            <div style={{ fontSize: '10px', letterSpacing: '0.2em', color: C.faint }}>TALÓN</div>
            <div style={{ fontSize: '17px', color: C.text, lineHeight: 1.5, textAlign: 'center' }}>
              CUU
              <div style={{ fontSize: '11px', color: C.accent }}>▼</div>
              MTY
            </div>
            <div style={{ fontSize: '10px', color: C.faint }}>BIT-025 · 4E</div>
          </div>
        </div>
      </div>

      {/* Fondo: olas de caracteres ASCII (OriginKit character-waves) */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.5, pointerEvents: 'none' }} aria-hidden="true">
        <CharacterWaves />
      </div>

      {/* Content wrapper — max 880px, centered */}
      <div
        ref={contentRef}
        style={{ maxWidth: '880px', margin: '0 auto', padding: '0 36px', position: 'relative', zIndex: 1, opacity: 0 }}
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
              position: 'relative',
              zIndex: 0,
            }}
          >
            {/* Saludo ASCII 3D (React Bits ASCIIText) */}
            <div ref={asciiWrapRef} style={{ position: 'relative', height: 'min(300px, 34vh)', marginBottom: '8px' }}>
              <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                <ASCIIText text={coverWord} enableWaves asciiFontSize={8} />
              </div>
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
        <article ref={articleRef} key={h.id}>

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
          {h.chapters ? (
            <>
              {h.intro && (
                <EditorialLayout
                  photos={[]}
                  story={h.intro}
                  dropCap
                  editor={editorMode}
                  ovs={layoutOv[`${h.id}#intro`] ?? {}}
                  onOv={(key, patch) => setOv(`${h.id}#intro`, key, patch)}
                />
              )}
              {h.chapters.map((c, i) => (
                <section key={i} style={{ marginTop: i === 0 ? '3rem' : '5rem' }}>
                  <ChapterHeading index={i} title={c.title} titleItalic={c.titleItalic} />
                  <EditorialLayout
                    photos={c.photos}
                    story={c.story}
                    dropCap={false}
                    editor={editorMode}
                    ovs={layoutOv[`${h.id}#${i}`] ?? {}}
                    onOv={(idx, patch) => setOv(`${h.id}#${i}`, idx, patch)}
                  />
                </section>
              ))}
            </>
          ) : (
            <EditorialLayout
              photos={h.photos}
              story={h.story}
              editor={editorMode}
              ovs={layoutOv[h.id] ?? {}}
              onOv={(idx, patch) => setOv(h.id, idx, patch)}
            />
          )}

        </article>

        {/* Bottom nav */}
        <BottomNav
          currentIdx={currentIdx}
          total={total}
          onPrev={prevHack}
          onNext={nextHack}
        />

        <KeyHint text={L.hint} />

        {/* Barra del modo editor */}
        {editorMode && (
          <div
            style={{
              position: 'fixed',
              bottom: '18px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 60,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              background: 'rgba(16, 9, 30, 0.95)',
              border: `1px solid ${C.accent}`,
              fontFamily: MONO,
              fontSize: '11px',
              letterSpacing: '0.1em',
            }}
          >
            <span style={{ color: C.accent }}>MODO EDITOR</span>
            <span style={{ color: C.faint }}>arrastra: mover · cuadro: tamaño · círculo: rotar</span>
            <button
              type="button"
              onClick={exportLayout}
              style={{
                fontFamily: MONO, fontSize: '11px', letterSpacing: '0.1em',
                padding: '6px 10px', background: C.accent, color: '#0a0610',
                border: 'none', cursor: 'pointer',
              }}
            >
              EXPORTAR JSON
            </button>
            <button
              type="button"
              onClick={() => resetLayout(h.id)}
              style={{
                fontFamily: MONO, fontSize: '11px', letterSpacing: '0.1em',
                padding: '6px 10px', background: 'transparent', color: C.text,
                border: `1px solid ${C.border}`, cursor: 'pointer',
              }}
            >
              RESET ARTÍCULO
            </button>
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
}
