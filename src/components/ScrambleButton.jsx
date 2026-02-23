import { useRef, useCallback } from 'react';
import gsap from 'gsap';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%!&*';

/**
 * Converts children into per-letter <span data-char="X"> elements.
 * Non-string children (icons, arrows) are wrapped as-is.
 */
function buildSpans(children) {
  const result = [];
  const kids = Array.isArray(children) ? children.flat() : [children];

  kids.forEach((child, ci) => {
    if (typeof child === 'string') {
      [...child].forEach((char, i) => {
        if (char === ' ') {
          result.push(<span key={`${ci}-${i}`}>&nbsp;</span>);
        } else {
          result.push(
            <span key={`${ci}-${i}`} data-char={char} className="inline-block">
              {char}
            </span>
          );
        }
      });
    } else {
      // icon, nested element — render untouched
      result.push(<span key={`el-${ci}`} className="inline-block">{child}</span>);
    }
  });

  return result;
}

export default function ScrambleButton({ children, className = '', ...props }) {
  const btnRef = useRef(null);
  const tlRef = useRef(null);

  /* mouseenter — scramble left → right, resolve in place */
  const scramble = useCallback(() => {
    const spans = Array.from(btnRef.current?.querySelectorAll('[data-char]') ?? []);
    if (!spans.length) return;

    if (tlRef.current) tlRef.current.kill();
    const tl = gsap.timeline();
    tlRef.current = tl;

    spans.forEach((span, i) => {
      const original = span.dataset.char;
      const proxy = { t: 0 };

      tl.to(
        proxy,
        {
          t: 1,
          duration: 0.45,
          ease: 'power1.inOut',
          onUpdate() {
            span.textContent =
              proxy.t < 0.75
                ? CHARS[Math.floor(Math.random() * CHARS.length)]
                : original;
          },
          onComplete() {
            span.textContent = original;
          },
        },
        i * 0.035, // stagger — liquid/melting feel
      );
    });
  }, []);

  /* mouseleave — restore right → left */
  const restore = useCallback(() => {
    if (tlRef.current) tlRef.current.kill();
    const spans = Array.from(
      btnRef.current?.querySelectorAll('[data-char]') ?? [],
    ).reverse();

    const tl = gsap.timeline();
    tlRef.current = tl;
    spans.forEach((span, i) => {
      tl.call(() => { span.textContent = span.dataset.char; }, null, i * 0.025);
    });
  }, []);

  return (
    <button
      ref={btnRef}
      onMouseEnter={scramble}
      onMouseLeave={restore}
      className={className}
      {...props}
    >
      {buildSpans(children)}
    </button>
  );
}
