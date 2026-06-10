import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const DIGITS = ['4', '0', '4'];
const SCRAMBLE_DURATION = 1.2; // segundos hasta que el último dígito se resuelve

function getAccentColor() {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue('--accent')
    .trim();
  return value || '#7c3aed';
}

export default function NotFound() {
  const navigate = useNavigate();
  const digitRefs = useRef([]);
  const fadeRefs = useRef([]);

  // SEO: título y noindex solo mientras esta página está montada
  useEffect(() => {
    const prevTitle = document.title;
    document.title = '404 — Página no encontrada | CodeByNas';

    const robots = document.querySelector('meta[name="robots"]');
    const prevRobots = robots ? robots.getAttribute('content') : null;
    if (robots) robots.setAttribute('content', 'noindex, nofollow');

    return () => {
      document.title = prevTitle;
      if (robots && prevRobots) robots.setAttribute('content', prevRobots);
    };
  }, []);

  // Scramble inicial + fade-in del resto del contenido
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const digits = digitRefs.current.filter(Boolean);
    const fadeEls = fadeRefs.current.filter(Boolean);
    const accent = getAccentColor();
    const intervals = [];

    if (reducedMotion) {
      digits.forEach((el, i) => {
        el.textContent = DIGITS[i];
      });
      if (digits[1]) digits[1].style.color = accent;
      gsap.to(fadeEls, { opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.1 });
      return undefined;
    }

    digits.forEach((el, i) => {
      let iterations = 0;
      const interval = setInterval(() => {
        el.textContent = Math.floor(Math.random() * 10);
        iterations++;
        if (iterations > 20 + i * 5) {
          clearInterval(interval);
          el.textContent = DIGITS[i];
          if (i === 1) gsap.to(el, { color: accent, duration: 0.6 });
        }
      }, 40);
      intervals.push(interval);
    });

    const fadeTween = gsap.fromTo(
      fadeEls,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1, delay: SCRAMBLE_DURATION },
    );

    return () => {
      intervals.forEach(clearInterval);
      fadeTween.kill();
    };
  }, []);

  // Efecto magnetic: los dígitos siguen sutilmente el cursor (solo desktop con mouse)
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover)').matches;
    if (reducedMotion || !canHover) return undefined;

    const digits = digitRefs.current.filter(Boolean);
    const xTo = digits.map((el) => gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' }));
    const yTo = digits.map((el) => gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3.out' }));

    const handleMove = (e) => {
      digits.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        // Fuera del radio de influencia, el dígito regresa a su lugar
        if (Math.hypot(e.clientX - cx, e.clientY - cy) > 300) {
          xTo[i](0);
          yTo[i](0);
          return;
        }
        const dx = (e.clientX - cx) / 25;
        const dy = (e.clientY - cy) / 35;
        xTo[i](Math.max(-12, Math.min(12, dx)));
        yTo[i](Math.max(-8, Math.min(8, dy)));
      });
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <main className="nf-page">
      <Link to="/" className="nf-logo" aria-label="CodeByNas — volver al inicio">
        CodeByNas
      </Link>

      <div className="nf-content">
        <p
          ref={(el) => { fadeRefs.current[0] = el; }}
          className="nf-eyebrow nf-fade"
        >
          Página no encontrada
        </p>

        <h1 className="nf-digits" aria-label="404 — Página no encontrada">
          {DIGITS.map((digit, i) => (
            <span
              key={i}
              ref={(el) => { digitRefs.current[i] = el; }}
              className="nf-digit"
              aria-hidden="true"
              aria-live="off"
            >
              {digit}
            </span>
          ))}
        </h1>

        <p
          ref={(el) => { fadeRefs.current[1] = el; }}
          className="nf-headline nf-fade"
        >
          Esta ruta no <em>existe</em>... todavía.
        </p>

        <p
          ref={(el) => { fadeRefs.current[2] = el; }}
          className="nf-message nf-fade"
        >
          Tal vez la borré, tal vez nunca estuvo, o tal vez es uno de esos
          proyectos que dejé a medias un viernes a las 3am.
        </p>

        <button
          ref={(el) => { fadeRefs.current[3] = el; }}
          type="button"
          className="nf-button nf-fade"
          onClick={() => navigate('/')}
        >
          ← Volver al inicio
        </button>
      </div>
    </main>
  );
}
