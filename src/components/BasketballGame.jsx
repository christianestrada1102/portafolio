import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Physics, useSphere, useBox, usePlane } from '@react-three/cannon';

export const BALL_START  = [-1.5, -0.35, -1.5];
export const HOOP_CENTER = [-2.08, 0.85, -2.08];

const HOOP_RADIUS = 0.20;
const GRAVITY     = 10;
const SEG_ARGS    = [0.03, 0.05, 0.03];

function HoopSegment({ position }) {
  const [ref] = useBox(() => ({ type: 'Static', position, args: SEG_ARGS }));
  return (
    <mesh ref={ref} visible={false}>
      <boxGeometry args={SEG_ARGS} />
    </mesh>
  );
}

function HoopRing() {
  const [hx, hy, hz] = HOOP_CENTER;
  return (
    <>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <HoopSegment
            key={i}
            position={[hx + HOOP_RADIUS * Math.cos(a), hy, hz + HOOP_RADIUS * Math.sin(a)]}
          />
        );
      })}
    </>
  );
}

function Backboard() {
  const args = [0.5, 0.38, 0.04];
  const [ref] = useBox(() => ({
    type: 'Static',
    position: [-2.42, 1.05, -2.42],
    rotation: [0, Math.PI / 4, 0],
    args,
  }));
  return <mesh ref={ref} visible={false}><boxGeometry args={args} /></mesh>;
}

function Post() {
  const args = [0.07, 0.6, 0.07];
  const [ref] = useBox(() => ({
    type: 'Static',
    position: [-2.5, 0.1, -2.5],
    args,
  }));
  return <mesh ref={ref} visible={false}><boxGeometry args={args} /></mesh>;
}

function Floor() {
  const [ref] = usePlane(() => ({
    type: 'Static',
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.49, 0],
  }));
  return <mesh ref={ref} visible={false} />;
}

function Ball({ throwTrigger, onScore, onReset }) {
  const [ballRef, ballApi] = useSphere(() => ({
    mass: 0.6,
    position: BALL_START,
    args: [0.08],
    linearDamping: 0.3,
    angularDamping: 0.4,
    allowSleep: false,
  }));

  const ballPos   = useRef([...BALL_START]);
  const wasAbove  = useRef(false);
  const hasScored = useRef(false);
  const isActive  = useRef(false);
  const resetId   = useRef(null);

  const onScoreRef = useRef(onScore);
  const onResetRef = useRef(onReset);
  onScoreRef.current = onScore;
  onResetRef.current = onReset;

  useEffect(() => {
    const unsub = ballApi.position.subscribe(v => { ballPos.current = [...v]; });
    return unsub;
  }, [ballApi]);

  useEffect(() => {
    if (!throwTrigger) return;

    const { isScore } = throwTrigger;
    const [sx, sy, sz] = BALL_START;
    const [hx, hy, hz] = HOOP_CENTER;
    const T = 0.85;

    ballApi.position.set(sx, sy, sz);
    ballApi.velocity.set(0, 0, 0);
    ballApi.angularVelocity.set(0, 0, 0);

    isActive.current  = true;
    hasScored.current = false;
    wasAbove.current  = false;

    let tx = hx, tz = hz;
    if (isScore) {
      tx += (Math.random() - 0.5) * 0.06;
      tz += (Math.random() - 0.5) * 0.06;
    } else {
      const a = Math.random() * Math.PI * 2;
      const d = HOOP_RADIUS + 0.12 + Math.random() * 0.25;
      tx = hx + Math.cos(a) * d;
      tz = hz + Math.sin(a) * d;
    }

    const vx = (tx - sx) / T;
    const vz = (tz - sz) / T;
    const vy = ((hy - sy) + 0.5 * GRAVITY * T * T) / T;

    ballApi.velocity.set(vx, vy, vz);
    ballApi.angularVelocity.set(
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4,
    );

    resetId.current = setTimeout(() => {
      if (!isActive.current) return;
      isActive.current = false;
      ballApi.position.set(sx, sy, sz);
      ballApi.velocity.set(0, 0, 0);
      ballApi.angularVelocity.set(0, 0, 0);
      onResetRef.current?.();
    }, 4000);

    return () => clearTimeout(resetId.current);
  }, [throwTrigger, ballApi]);

  useFrame(() => {
    if (!isActive.current) return;

    const [bx, by, bz] = ballPos.current;
    const [hx, hy, hz] = HOOP_CENTER;

    const above = by > hy + 0.02;
    if (wasAbove.current && !above && !hasScored.current) {
      const d = Math.sqrt((bx - hx) ** 2 + (bz - hz) ** 2);
      if (d < HOOP_RADIUS * 0.85) {
        hasScored.current = true;
        onScoreRef.current?.();
      }
    }
    wasAbove.current = above;

    if (by < -0.47) {
      isActive.current = false;
      clearTimeout(resetId.current);
      ballApi.position.set(...BALL_START);
      ballApi.velocity.set(0, 0, 0);
      ballApi.angularVelocity.set(0, 0, 0);
      onResetRef.current?.();
    }
  });

  return (
    <mesh ref={ballRef}>
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
  return (
    <Physics
      gravity={[0, -10, 0]}
      iterations={5}
      tolerance={0.001}
      defaultContactMaterial={{ restitution: 0.35, friction: 0.6 }}
      allowSleep={false}
    >
      <Ball throwTrigger={throwTrigger} onScore={onScore} onReset={onReset} />
      <HoopRing />
      <Backboard />
      <Post />
      <Floor />
    </Physics>
  );
}
