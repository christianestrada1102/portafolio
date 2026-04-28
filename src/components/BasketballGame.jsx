import { Physics, useSphere, useBox } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';

// Ball sits in front of the hoop, visible from basket-view camera [-1.2, 0.5, 0.2]
export const BALL_START   = [-2.5, 0.12, -0.8];
// Approximate hoop rim — basket model at [-2.5, 0, -2.5] scale 1.5
export const HOOP_CENTER  = [-2.5, 0.95, -2.35];
const HOOP_RADIUS = 0.2;

// Ball remounts with a new key each throw/reset so we can switch mass (mass=0 → Static in cannon-es)
function Ball({ mass, initialVelocity, onScore, onReset }) {
  const [ref, api] = useSphere(() => ({
    mass,
    args: [0.12],
    position: BALL_START,
    linearDamping: 0.15,
    angularDamping: 0.05,
    material: { restitution: 0.5, friction: 0.4 },
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

  // Apply velocity and schedule reset only for dynamic launches
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
  }, []); // intentionally empty — runs once on mount (each key = fresh mount)

  useFrame(() => {
    if (mass <= 0) return; // static ball — nothing to track

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
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#f97316"
          emissive="#f97316"
          emissiveIntensity={0.4}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      <pointLight ref={lightRef} color="#f97316" intensity={1} distance={1.5} decay={2} />
    </>
  );
}

function PhysicsFloor() {
  const [ref] = useBox(() => ({
    type: 'Static',
    position: [0, -0.52, 0],
    args: [20, 0.1, 20],
  }));
  return <mesh ref={ref} visible={false} />;
}

function PhysicsBackboard() {
  const [ref] = useBox(() => ({
    type: 'Static',
    position: [-2.55, 1.1, -2.55],
    args: [0.7, 0.5, 0.05],
    rotation: [0, Math.PI / 4, 0],
  }));
  return <mesh ref={ref} visible={false} />;
}

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
      <PhysicsBackboard />
    </Physics>
  );
}
