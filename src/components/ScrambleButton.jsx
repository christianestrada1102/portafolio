import { useRef, useEffect } from 'react';
import { useAnimationFrame } from 'framer-motion';

const FONT_FACE = `
@font-face {
  font-family: "InterVariableFramer";
  src: url("https://rsms.me/inter/font-files/InterVariable.woff2?v=4.0") format("woff2-variations");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
`;
let fontInjected = false;

const FROM_WEIGHT = 300;
const TO_WEIGHT = 800;
const REACH = 180; // px
const TAU = 0.2;   // transition speed (seconds)

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
            <span key={`${ci}-${i}`} data-dw className="inline-block">
              {char}
            </span>
          );
        }
      });
    } else {
      result.push(<span key={`el-${ci}`} className="inline-block">{child}</span>);
    }
  });
  return result;
}

export default function ScrambleButton({ children, className = '', style, ...props }) {
  const btnRef = useRef(null);
  const mouseRef = useRef({ x: -99999, y: -99999 });
  const factorsRef = useRef([]);
  const lastFrameRef = useRef(0);

  // Inject variable font once globally
  useEffect(() => {
    if (fontInjected) return;
    const s = document.createElement('style');
    s.textContent = FONT_FACE;
    document.head.appendChild(s);
    fontInjected = true;
  }, []);

  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouseRef.current = { x: -99999, y: -99999 }; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  useAnimationFrame((now) => {
    const el = btnRef.current;
    if (!el) return;
    const spans = el.querySelectorAll('[data-dw]');
    if (!spans.length) return;

    const containerRect = el.getBoundingClientRect();
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    const prevT = lastFrameRef.current || now;
    const dtSec = Math.min(0.1, Math.max(0, (now - prevT) / 1000));
    lastFrameRef.current = now;
    const a = 1 - Math.exp(-dtSec / TAU);

    spans.forEach((span, i) => {
      const rect = span.getBoundingClientRect();
      const cx = rect.left + rect.width / 2 - containerRect.left;
      const cy = rect.top + rect.height / 2 - containerRect.top;
      const dist = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2);
      const target = Math.min(Math.max(1 - dist / REACH, 0), 1);
      const prev = factorsRef.current[i] ?? 0;
      const f = prev + (target - prev) * a;
      factorsRef.current[i] = f;

      const w = Math.round(FROM_WEIGHT + (TO_WEIGHT - FROM_WEIGHT) * f);
      const val = `'wght' ${w}`;
      if (span.style.fontVariationSettings !== val) {
        span.style.fontVariationSettings = val;
      }
    });
  });

  return (
    <button
      ref={btnRef}
      className={className}
      style={{ fontFamily: '"InterVariableFramer", "Inter Variable", "Inter", system-ui, sans-serif', fontVariationSettings: `'wght' ${FROM_WEIGHT}`, ...style }}
      {...props}
    >
      {buildSpans(children)}
    </button>
  );
}
