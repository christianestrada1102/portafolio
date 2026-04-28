import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';

export const BALL_START  = [-1.5, -0.35, -1.5];
export const HOOP_CENTER = [-2.08, 0.85, -2.08];

function Ball({ throwTrigger, onScore, onReset }) {
  const meshRef    = useRef();
  const isFlying   = useRef(false);
  const { invalidate } = useThree();

  // Keep callbacks fresh without re-triggering the effect
  const onScoreRef = useRef(onScore);
  const onResetRef = useRef(onReset);
  onScoreRef.current = onScore;
  onResetRef.current = onReset;

  // Kill tweens and remove ticker on unmount
  useEffect(() => {
    return () => {
      if (meshRef.current) gsap.killTweensOf(meshRef.current.position);
      gsap.ticker.remove(invalidate);
    };
  }, [invalidate]);

  useEffect(() => {
    if (!throwTrigger || isFlying.current || !meshRef.current) return;
    isFlying.current = true;

    const pos = meshRef.current.position;
    const { isScore, power } = throwTrigger;
    const [sx, sy, sz] = BALL_START;
    const [hx, hy, hz] = HOOP_CENTER;

    // Drive R3F re-renders on every GSAP tick while animating
    gsap.ticker.add(invalidate);

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.ticker.remove(invalidate);
        isFlying.current = false;
        onResetRef.current?.();
      },
    });

    if (isScore) {
      const peak = hy + 0.9 + power * 0.4;

      // Horizontal: linear glide to hoop
      tl.to(pos, { x: hx, z: hz, duration: 0.9, ease: 'none' }, 0);
      // Vertical: parabola up then drop to rim
      tl.to(pos, { y: peak, duration: 0.45, ease: 'power2.out' }, 0);
      tl.to(pos, { y: hy,   duration: 0.45, ease: 'power2.in'  }, 0.45);
      // Ball drops through net
      tl.to(pos, { y: sy - 0.05, duration: 0.28, ease: 'power2.in' }, 0.9);
      // Count the point at rim-crossing moment
      tl.call(() => onScoreRef.current?.(), [], 0.9);
      // Roll back to start
      tl.to(pos, { x: sx, y: sy, z: sz, duration: 0.5, ease: 'power2.inOut' });
    } else {
      // Miss: arc toward near-hoop but off-target
      const offX = hx + (Math.random() - 0.5) * 0.55;
      const offZ = hz + (Math.random() - 0.5) * 0.55;
      const peak = hy + 0.5 + power * 0.3;

      // Arc to miss point
      tl.to(pos, { x: offX, z: offZ, duration: 0.75, ease: 'none' }, 0);
      tl.to(pos, { y: peak,        duration: 0.375, ease: 'power2.out' }, 0);
      tl.to(pos, { y: hy - 0.05,  duration: 0.375, ease: 'power2.in'  }, 0.375);
      // Bounce off rim
      tl.to(pos, {
        x: offX + (Math.random() - 0.5) * 0.5,
        y: sy + 0.45,
        z: offZ + 0.45,
        duration: 0.35,
        ease: 'power1.out',
      });
      // Hit floor
      tl.to(pos, { y: sy - 0.02, duration: 0.18, ease: 'power2.in' });
      // Roll back to start
      tl.to(pos, { x: sx, y: sy, z: sz, duration: 0.5, ease: 'power2.inOut' });
    }
  }, [throwTrigger, invalidate]);

  return (
    // pointLight is a child of the mesh so it follows the ball automatically
    <mesh ref={meshRef} position={BALL_START}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial
        color="#f97316"
        emissive="#f97316"
        emissiveIntensity={0.1}
        roughness={0.6}
        metalness={0.1}
      />
      <pointLight color="#f97316" intensity={1} distance={1.5} decay={2} />
    </mesh>
  );
}

export default function BasketballGame({ active, throwTrigger, onScore, onReset }) {
  if (!active) return null;
  return <Ball throwTrigger={throwTrigger} onScore={onScore} onReset={onReset} />;
}
