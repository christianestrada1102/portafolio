import { useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SkyEngine } from './engine';
import '@fontsource/nunito/900.css';

const STRINGS = {
  es: {
    lastCommit:    'ÚLTIMO COMMIT',
    listening:     'ESCUCHANDO',
    reposToday:    'REPOS HOY',
    localTime:     'HORA LOCAL',
    ago23min:      'hace 23 min',
    ago1h:         'hace 1 h',
    ago3h:         'hace 3 h',
    active:        'activos',
    paused:        'En pausa',
    nothing:       'Nada',
    noReproducing: 'sin reproducir',
    noSignal:      'sin señal desde hace 3 h',
    sync:          'sync hace',
    hint:          'click en el humo',
    viewStats:     'ver estadísticas',
  },
  en: {
    lastCommit:    'LAST COMMIT',
    listening:     'LISTENING',
    reposToday:    'REPOS TODAY',
    localTime:     'LOCAL TIME',
    ago23min:      '23 min ago',
    ago1h:         '1 h ago',
    ago3h:         '3 h ago',
    active:        'active',
    paused:        'Paused',
    nothing:       'Nothing',
    noReproducing: 'not playing',
    noSignal:      'no signal for 3 h',
    sync:          'sync',
    hint:          'click on the smoke',
    viewStats:     'view stats',
  },
};

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function LiveSky() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const { lang }  = useLanguage();

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr    = Math.min(2, window.devicePixelRatio || 1);
    const engine = new SkyEngine(canvas, dpr, STRINGS[lang] ?? STRINGS.es);
    engineRef.current = engine;

    const parent = canvas.parentElement;

    const doResize = () => {
      const { width, height } = parent.getBoundingClientRect();
      if (width > 0 && height > 0) engine.resize(width, height);
    };
    doResize();

    // Start RAF loop immediately; writing starts after preloader
    engine._startLoop();

    const beginWriting = () => engine.beginWriting();

    // If preloader already ran (e.g. hot-reload), start immediately
    if (sessionStorage.getItem('preloader-shown')) {
      // Small delay so hero entrance animation plays first
      const tid = setTimeout(beginWriting, 400);
      // Store cleanup
      engine._pendingStart = tid;
    } else {
      window.addEventListener('skywriting:start', beginWriting, { once: true });
    }

    // Resize
    const ro = new ResizeObserver(doResize);
    ro.observe(parent);

    // Pause when hero scrolls out of view
    const section = canvas.closest('section');
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting ? engine.resume() : engine.pause(),
      { threshold: 0 },
    );
    if (section) io.observe(section);

    // Pause when tab is hidden
    const onVis = () => document.hidden ? engine.pause() : engine.resume();
    document.addEventListener('visibilitychange', onVis);

    // Click / tap
    const onClick = (e) => {
      const r  = canvas.getBoundingClientRect();
      engine.click(e.clientX - r.left, e.clientY - r.top);
    };
    canvas.addEventListener('click', onClick);

    return () => {
      clearTimeout(engine._pendingStart);
      window.removeEventListener('skywriting:start', beginWriting);
      engine.destroy();
      engineRef.current = null;
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('click', onClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update strings when language toggles
  useEffect(() => {
    engineRef.current?.setStrings(STRINGS[lang] ?? STRINGS.es);
  }, [lang]);

  if (reducedMotion) {
    return (
      <button
        style={{
          position: 'absolute', right: '1.5rem', bottom: '5.5rem', zIndex: 2,
          background: 'transparent', border: '1px solid #2a2a2a',
          color: '#555', padding: '4px 10px', borderRadius: '4px',
          fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.1em',
          cursor: 'pointer', pointerEvents: 'auto',
        }}
        aria-label={lang === 'en' ? 'View live stats' : 'Ver estadísticas en vivo'}
      >
        {(STRINGS[lang] ?? STRINGS.es).viewStats}
      </button>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        zIndex: 1, display: 'block',
        cursor: 'pointer',
      }}
    />
  );
}
