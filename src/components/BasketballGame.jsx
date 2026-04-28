import { Physics, useSphere, useBox } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';

export const BALL_START  = [-2.5, -0.3, -1];
export const HOOP_CENTER = [-2.5, 0.95, -2.35];
const HOOP_RADIUS = 0.18;

// Ball remounts (via key) to switch mass: 0 = Static, 0.6 = Dynamic
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
  }, []); // runs once per mount (key forces remount on each throw)

  useFrame(() => {
    if (mass <= 0) return;

    const [x, y, z] = pos.current;
    const [hx, hy, hz] = HOOP_CENTER;
    const horizDist = Math.sqrt((x - hx) ** 2 + (z - hz) ** 2);

    if (!scored.current && y < hy && y > hy - 0.3 && horizDist < HOOP_RADIUS) {
      scored.current = true;
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
  const [ref] = useBox(() => ({
    type: 'Static', position: [0, -0.52, 0], args: [20, 0.1, 20],
  }));
  return <mesh ref={ref} visible={false} />;
}

// Walls — match the visual mesh positions/sizes in Arcade.jsx (6 wide, 3 tall)
function PhysicsWalls() {
  const [back]  = useBox(() => ({ type: 'Static', position: [0,  1, -3],  args: [6, 3, 0.2] }));
  const [front] = useBox(() => ({ type: 'Static', position: [0,  1,  3],  args: [6, 3, 0.2] }));
  const [left]  = useBox(() => ({ type: 'Static', position: [-3, 1,  0],  args: [0.2, 3, 6] }));
  const [right] = useBox(() => ({ type: 'Static', position: [3,  1,  0],  args: [0.2, 3, 6] }));
  return (
    <>
      <mesh ref={back}  visible={false} />
      <mesh ref={front} visible={false} />
      <mesh ref={left}  visible={false} />
      <mesh ref={right} visible={false} />
    </>
  );
}

// Backboard — behind the rim at 45° (basket model rotation = Math.PI/4)
function PhysicsBackboard() {
  const [ref] = useBox(() => ({
    type: 'Static',
    position: [-2.7, 1.15, -2.7],
    args: [0.7, 0.55, 0.06],
    rotation: [0, Math.PI / 4, 0],
  }));
  return <mesh ref={ref} visible={false} />;
}

// Rim — 4 thin boxes forming a square ring around the hoop opening
// HOOP_CENTER = [-2.5, 0.95, -2.35], inner radius ≈ 0.18
function PhysicsRim() {
  const r = 0.18;
  const [cx, cy, cz] = HOOP_CENTER;
  const seg = { type: 'Static', args: [0.05, 0.05, 0.05] };

  const [n]  = useBox(() => ({ ...seg, position: [cx,      cy, cz - r] })); // back
  const [s]  = useBox(() => ({ ...seg, position: [cx,      cy, cz + r] })); // front
  const [ww] = useBox(() => ({ ...seg, position: [cx - r,  cy, cz    ] })); // left
  const [e]  = useBox(() => ({ ...seg, position: [cx + r,  cy, cz    ] })); // right

  // Elongated side pieces to fill the gaps
  const [ns] = useBox(() => ({ type: 'Static', position: [cx,     cy, cz], args: [r * 2, 0.04, 0.04] }));
  const [ew] = useBox(() => ({ type: 'Static', position: [cx,     cy, cz], args: [0.04, 0.04, r * 2] }));

  return (
    <>
      <mesh ref={n}  visible={false} />
      <mesh ref={s}  visible={false} />
      <mesh ref={ww} visible={false} />
      <mesh ref={e}  visible={false} />
      <mesh ref={ns} visible={false} />
      <mesh ref={ew} visible={false} />
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
      <PhysicsBackboard />
      <PhysicsRim />
    </Physics>
  );
}
