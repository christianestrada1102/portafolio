import { Physics, useSphere, useBox } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';

// Ball starts in front of hoop, visible from basket-view camera
export const BALL_START = [-1.5, -0.35, -1.5];

// Basket model: position=[-2.5, 0, -2.5], scale=1.5, rotation=[0, PI/4, 0]
// The arm extends ~0.4u in the [+x, +z] direction (toward room center at 45°)
// Rim center ≈ base + 0.4 * [sin(PI/4), 0, cos(PI/4)] * 1.5 ≈ base + [0.42, 0, 0.42]
export const HOOP_CENTER = [-2.08, 0.85, -2.08];
const HOOP_RADIUS = 0.22; // slightly generous for detection

const S = Math.SQRT1_2; // sin/cos of 45° ≈ 0.707

// ── BALL ─────────────────────────────────────────────────────────────────────

function Ball({ mass, initialVelocity, onScore, onReset }) {
  const [ref, api] = useSphere(() => ({
    mass,
    args: [0.08],
    position: BALL_START,
    linearDamping: 0.15,
    angularDamping: 0.05,
    material: { restitution: 0.7, friction: 0.4 },
  }));

  const pos        = useRef([...BALL_START]);
  const lightRef   = useRef();
  const scored     = useRef(false);
  const didReset   = useRef(false);
  const onScoreRef = useRef(onScore);
  const onResetRef = useRef(onReset);
  onScoreRef.current = onScore;
  onResetRef.current = onReset;

  useEffect(() => {
    const unsub = api.position.subscribe(v => { pos.current = [...v]; });
    return unsub;
  }, [api]);

  // Apply velocity + schedule auto-reset (runs once per mount = once per throw)
  useEffect(() => {
    if (mass <= 0 || !initialVelocity) return;
    api.velocity.set(...initialVelocity);
    api.angularVelocity.set(
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * 5
    );
    const timer = setTimeout(() => {
      if (!didReset.current) { didReset.current = true; onResetRef.current?.(); }
    }, 3000);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame(() => {
    if (mass <= 0) return;

    const [x, y, z] = pos.current;
    const [hx, hy, hz] = HOOP_CENTER;
    const horizDist = Math.sqrt((x - hx) ** 2 + (z - hz) ** 2);

    // Score detection: ball passes through hoop zone going downward
    if (!scored.current && y < hy && y > hy - 0.35 && horizDist < HOOP_RADIUS) {
      scored.current = true;
      console.log('SCORE! ball at', x.toFixed(2), y.toFixed(2), z.toFixed(2), 'hoop at', hx, hy, hz);
      onScoreRef.current?.();
    }

    if (!didReset.current && y < -1) {
      didReset.current = true;
      onResetRef.current?.();
    }

    if (lightRef.current) lightRef.current.position.set(x, y, z);
  });

  return (
    <>
      <mesh ref={ref}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#f97316"
          emissive="#f97316"
          emissiveIntensity={0.1}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      <pointLight ref={lightRef} color="#f97316" intensity={1} distance={1.5} decay={2} />
    </>
  );
}

// ── STATIC COLLIDERS ──────────────────────────────────────────────────────────

function PhysicsFloor() {
  const [ref] = useBox(() => ({ type: 'Static', position: [0, -0.52, 0], args: [20, 0.1, 20] }));
  return <mesh ref={ref} visible={false} />;
}

function PhysicsWalls() {
  const [back]  = useBox(() => ({ type: 'Static', position: [0,  1, -3], args: [6, 3, 0.2] }));
  const [front] = useBox(() => ({ type: 'Static', position: [0,  1,  3], args: [6, 3, 0.2] }));
  const [left]  = useBox(() => ({ type: 'Static', position: [-3, 1,  0], args: [0.2, 3, 6] }));
  const [right] = useBox(() => ({ type: 'Static', position: [3,  1,  0], args: [0.2, 3, 6] }));
  return (
    <>
      <mesh ref={back}  visible={false} />
      <mesh ref={front} visible={false} />
      <mesh ref={left}  visible={false} />
      <mesh ref={right} visible={false} />
    </>
  );
}

// Vertical post at model base
function PhysicsPost() {
  const [ref] = useBox(() => ({
    type: 'Static', position: [-2.5, 0.15, -2.5], args: [0.07, 0.4, 0.07],
  }));
  return <mesh ref={ref} visible={false} />;
}

// Backboard — behind HOOP_CENTER in the [-x, -z] direction at 45°
function PhysicsBackboard() {
  const [ref] = useBox(() => ({
    type: 'Static',
    // Place backboard 0.3u behind the rim center along [-S, 0, -S] direction
    position: [HOOP_CENTER[0] - 0.3 * S, 1.0, HOOP_CENTER[2] - 0.3 * S],
    args: [0.65, 0.5, 0.05],
    rotation: [0, Math.PI / 4, 0],
  }));
  return <mesh ref={ref} visible={false} />;
}

// Rim — 4 elongated boxes forming a square ring at 45° around HOOP_CENTER
// Hoop plane axes: u = [-S, 0, S] (left-right), v = [S, 0, S] (front-back)
function PhysicsRim() {
  const r  = HOOP_RADIUS;
  const [cx, cy, cz] = HOOP_CENTER;
  const th = 0.05; // rim thickness
  const len = r * 2 + th;

  // Front (toward room center along [+S, 0, +S])
  const [front] = useBox(() => ({
    type: 'Static',
    position: [cx + r * S, cy, cz + r * S],
    args: [len, th, th],
    rotation: [0, -Math.PI / 4, 0], // elongated along [-S, 0, S] axis
  }));

  // Back (toward wall along [-S, 0, -S])
  const [back] = useBox(() => ({
    type: 'Static',
    position: [cx - r * S, cy, cz - r * S],
    args: [len, th, th],
    rotation: [0, -Math.PI / 4, 0],
  }));

  // Left (along [-S, 0, +S])
  const [ll] = useBox(() => ({
    type: 'Static',
    position: [cx - r * S, cy, cz + r * S],
    args: [len, th, th],
    rotation: [0, Math.PI / 4, 0], // elongated along [+S, 0, +S] axis
  }));

  // Right (along [+S, 0, -S])
  const [rr] = useBox(() => ({
    type: 'Static',
    position: [cx + r * S, cy, cz - r * S],
    args: [len, th, th],
    rotation: [0, Math.PI / 4, 0],
  }));

  return (
    <>
      <mesh ref={front} visible={false} />
      <mesh ref={back}  visible={false} />
      <mesh ref={ll}    visible={false} />
      <mesh ref={rr}    visible={false} />
    </>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function BasketballGame({ active, throwTrigger, onScore, onReset }) {
  const [ballConfig, setBallConfig] = useState({ key: 0, mass: 0, velocity: null });
  const wasThrowing = useRef(false);

  useEffect(() => {
    if (throwTrigger) {
      wasThrowing.current = true;
      setBallConfig(prev => ({
        key: prev.key + 1,
        mass: 0.6,
        velocity: [throwTrigger.vx, throwTrigger.vy, throwTrigger.vz],
      }));
    } else if (wasThrowing.current) {
      wasThrowing.current = false;
      setBallConfig(prev => ({ key: prev.key + 1, mass: 0, velocity: null }));
    }
  }, [throwTrigger]);

  if (!active) return null;

  return (
    <Physics gravity={[0, -9.81, 0]}>
      <Ball
        key={ballConfig.key}
        mass={ballConfig.mass}
        initialVelocity={ballConfig.velocity}
        onScore={onScore}
        onReset={onReset}
      />
      <PhysicsFloor />
      <PhysicsWalls />
      <PhysicsPost />
      <PhysicsBackboard />
      <PhysicsRim />
    </Physics>
  );
}
