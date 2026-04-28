import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Physics, useSphere, useBox, usePlane } from '@react-three/cannon';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

function createBasketballTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const w = size, h = size;

  // Purple gradient base
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0.0, '#e87828');
  grad.addColorStop(0.5, '#d46818');
  grad.addColorStop(1.0, '#c05810');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Pebble grain: random small dots
  for (let i = 0; i < 14000; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = Math.random() * 1.3 + 0.3;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,0,0,${(Math.random() * 0.12 + 0.05).toFixed(2)})`;
    ctx.fill();
  }

  // Seam lines
  ctx.strokeStyle = '#0d000d';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // 1. Horizontal equator at v=0.5
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();

  // 2. Cosine seam — crosses equator at x=w/4 and x=3w/4
  ctx.beginPath();
  for (let x = 0; x <= w; x++) {
    const y = h / 2 + (h * 0.31) * Math.cos((2 * Math.PI * x) / w);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // 3. Inverted cosine seam (mirror)
  ctx.beginPath();
  for (let x = 0; x <= w; x++) {
    const y = h / 2 - (h * 0.31) * Math.cos((2 * Math.PI * x) / w);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

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

function Walls() {
  const [back]  = useBox(() => ({ type: 'Static', position: [ 0, 1, -3], args: [6, 4, 0.1] }));
  const [front] = useBox(() => ({ type: 'Static', position: [ 0, 1,  3], args: [6, 4, 0.1] }));
  const [left]  = useBox(() => ({ type: 'Static', position: [-3, 1,  0], args: [0.1, 4, 6] }));
  const [right] = useBox(() => ({ type: 'Static', position: [ 3, 1,  0], args: [0.1, 4, 6] }));
  return (
    <>
      <mesh ref={back}  visible={false} />
      <mesh ref={front} visible={false} />
      <mesh ref={left}  visible={false} />
      <mesh ref={right} visible={false} />
    </>
  );
}

function Ball({ throwTrigger, onScore, onReset }) {
  const texture = useMemo(() => createBasketballTexture(), []);

  useEffect(() => () => texture.dispose(), [texture]);

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
  const wallHit   = useRef(false);
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
    wallHit.current   = false;

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

    // Floor reset
    if (by < -0.47) {
      isActive.current = false;
      wallHit.current  = false;
      clearTimeout(resetId.current);
      ballApi.position.set(...BALL_START);
      ballApi.velocity.set(0, 0, 0);
      ballApi.angularVelocity.set(0, 0, 0);
      onResetRef.current?.();
    }

    // Wall hit: stop ball and return to start after short delay
    if (!wallHit.current && (Math.abs(bx) > 2.82 || Math.abs(bz) > 2.82)) {
      wallHit.current = true;
      ballApi.velocity.set(0, 0, 0);
      ballApi.angularVelocity.set(0, 0, 0);
      setTimeout(() => {
        if (!isActive.current) return;
        isActive.current = false;
        wallHit.current  = false;
        clearTimeout(resetId.current);
        ballApi.position.set(...BALL_START);
        ballApi.velocity.set(0, 0, 0);
        ballApi.angularVelocity.set(0, 0, 0);
        onResetRef.current?.();
      }, 450);
    }
  });

  return (
    <mesh ref={ballRef}>
      <sphereGeometry args={[0.08, 32, 32]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.9}
        metalness={0}
        bumpMap={texture}
        bumpScale={0.006}
      />
      <pointLight color="#f97316" intensity={1} distance={1.5} decay={2} />
    </mesh>
  );
}

// Camera right vector for the basket view (pos [-1.2,0.5,0.2] → target [-2,0.3,-2]):
// forward ≈ (-0.34, -0.085, -0.936), right ≈ (0.940, 0, -0.341)
const CAM_RIGHT_X = 0.940;
const CAM_RIGHT_Z = -0.341;

function TrajectoryLine({ aimDrag }) {
  if (!aimDrag) return null;

  const screenDx = aimDrag.x2 - aimDrag.x1;
  const screenDy = aimDrag.y1 - aimDrag.y2; // positive = dragged up

  if (screenDy < 8) return null;

  const [sx, sy, sz] = BALL_START;
  const [hx, hy, hz] = HOOP_CENTER;
  const T = 0.85;

  // Map screen horizontal drag to world-space lateral offset using camera right vector
  const aimSigned = screenDx / Math.max(Math.abs(screenDy), 1);
  const tx = hx + aimSigned * CAM_RIGHT_X;
  const tz = hz + aimSigned * CAM_RIGHT_Z;

  const vx = (tx - sx) / T;
  const vz = (tz - sz) / T;
  const vy = ((hy - sy) + 0.5 * GRAVITY * T * T) / T;

  const points = [];
  for (let i = 0; i <= 14; i++) {
    const t = (i / 14) * T;
    points.push([
      sx + vx * t,
      sy + vy * t - 0.5 * GRAVITY * t * t,
      sz + vz * t,
    ]);
  }

  return (
    <Line
      points={points}
      color="#A855F7"
      lineWidth={2}
      dashed
      dashSize={0.06}
      gapSize={0.04}
    />
  );
}

export default function BasketballGame({ active, throwTrigger, onScore, onReset, aimDrag }) {
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
      <TrajectoryLine aimDrag={aimDrag} />
      <HoopRing />
      <Backboard />
      <Post />
      <Floor />
      <Walls />
    </Physics>
  );
}
