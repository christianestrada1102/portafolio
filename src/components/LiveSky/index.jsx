import { useEffect, useRef, useCallback, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SkyEngine } from './engine';
import '@fontsource/nunito/900.css';
import './LiveSky.css';

const POLL_MS = 15_000;
const FADE_MS = 400;

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
  const canvasRef  = useRef(null);
  const engineRef  = useRef(null);
  const pollRef    = useRef(null);
  const artRef     = useRef(null);
  const { lang }   = useLanguage();
  const [artUrl, setArtUrl] = useState(null);
  // Up to two covers mounted at once so a song change can crossfade
  const [covers, setCovers] = useState([]);

  const fetchStatus = useCallback(async (currentLang) => {
    try {
      const res = await fetch(`/api/status?lang=${currentLang}`, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) return;
      const data = await res.json();
      engineRef.current?.setLiveData(data);
      setArtUrl(data.grid?.find(c => c.art)?.art ?? null);
    } catch {
      // network error — engine keeps showing last known state
    }
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr    = Math.min(2, window.devicePixelRatio || 1);
    const engine = new SkyEngine(canvas, dpr, STRINGS[lang] ?? STRINGS.es);
    engineRef.current = engine;
    engine.attachArt(artRef.current);

    const parent = canvas.parentElement;

    const doResize = () => {
      const { width, height } = parent.getBoundingClientRect();
      if (width > 0 && height > 0) engine.resize(width, height);
    };
    doResize();

    // Start RAF loop immediately; writing starts after preloader
    engine._startLoop();

    const startPolling = (l) => {
      fetchStatus(l);
      pollRef.current = setInterval(() => fetchStatus(l), POLL_MS);
    };

    const beginWriting = () => {
      engine.beginWriting();
      startPolling(lang);
    };

    // Start only after preloader signals — never before hero is visible
    window.addEventListener('skywriting:start', beginWriting, { once: true });

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
      clearInterval(pollRef.current);
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

  // Update strings and re-fetch API labels when language toggles
  useEffect(() => {
    engineRef.current?.setStrings(STRINGS[lang] ?? STRINGS.es);
    if (engineRef.current) {
      clearInterval(pollRef.current);
      fetchStatus(lang);
      pollRef.current = setInterval(() => fetchStatus(lang), POLL_MS);
    }
  }, [lang, fetchStatus]);

  useEffect(() => {
    if (!artUrl) {
      engineRef.current?.setArtReady(null);
      const t = setTimeout(() => setCovers([]), FADE_MS);
      return () => clearTimeout(t);
    }
    setCovers(cs => cs.some(c => c.url === artUrl) ? cs : [...cs, { url: artUrl, loaded: false }]);
  }, [artUrl]);

  const onCoverLoad = (url) => {
    setCovers(cs => cs.map(c => c.url === url ? { ...c, loaded: true } : c));
    if (url !== artUrl) return;
    engineRef.current?.setArtReady(url);
    setTimeout(() => setCovers(cs => cs.filter(c => c.url === url)), FADE_MS);
  };

  const onCoverError = (url) => {
    setCovers(cs => cs.filter(c => c.url !== url));
    if (url === artUrl) {
      engineRef.current?.setArtReady(null);
      setCovers([]);
    }
  };

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
    <>
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
      <div ref={artRef} className="ls-art-wrap" data-show="0" aria-hidden="true">
        {covers.map(c => (
          <img
            key={c.url}
            src={c.url}
            alt=""
            decoding="async"
            referrerPolicy="no-referrer"
            className={`ls-art${c.loaded && c.url === artUrl ? ' on' : ''}`}
            onLoad={() => onCoverLoad(c.url)}
            onError={() => onCoverError(c.url)}
          />
        ))}
      </div>
    </>
  );
}
