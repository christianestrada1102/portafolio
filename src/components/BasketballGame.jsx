import { Physics, useSphere, useBox } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

// Ball start: near the basket-view camera position
const BALL_START = [-1.5, 0.2, -0.5];
// Hoop center: approximate rim position of the basket model at [-2.5, 0, -2.5] scale 1.5
const HOOP_CENTER = [-2.5, 0.95, -2.35];
const HOOP_RADIUS = 0.2;

function Ball({ throwTrigger, onScore }) {
  const [ref, api] = useSphere(() => ({
    mass: 0.6,
    args: [0.12],
    position: BALL_START,
    linearDamping: 0.1,
    angularDamping: 0.05,
    material: { restitution: 0.5, friction: 0.4 },
  }));

  const pos = useRef([...BALL_START]);
  const scored = useRef(false);
  const resetTimer = useRef(null);

  useEffect(() => {
    const unsub = api.position.subscribe(v => { pos.current = [...v]; });
    return unsub;
  }, [api]);

  useEffect(() => {
    if (!throwTrigger) return;
    scored.current = false;
    api.velocity.set(throwTrigger.vx, throwTrigger.vy, throwTrigger.vz);
    api.angularVelocity.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 10
    );

    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      api.position.set(...BALL_START);
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
      scored.current = false;
    }, 3000);

    return () => { if (resetTimer.current) clearTimeout(resetTimer.current); };
  }, [throwTrigger, api]);

  useFrame(() => {
    const [x, y, z] = pos.current;
    const [hx, hy, hz] = HOOP_CENTER;
    const horizDist = Math.sqrt((x - hx) ** 2 + (z - hz) ** 2);

    // Score: ball passes through hoop area going downward
    if (!scored.current && y < hy && y > hy - 0.3 && horizDist < HOOP_RADIUS) {
      scored.current = true;
      onScore();
    }

    // Reset if ball falls below floor
    if (y < -1) {
      api.position.set(...BALL_START);
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
      scored.current = false;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial color="#f97316" roughness={0.7} metalness={0.1} />
    </mesh>
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

export default function BasketballGame({ active, onScore }) {
  const [throwTrigger, setThrowTrigger] = useState(null);
  const dragStart = useRef(null);

  useEffect(() => {
    if (!active) return;

    const onDown = (e) => {
      dragStart.current = { x: e.clientX, y: e.clientY };
    };

    const onUp = (e) => {
      if (!dragStart.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = dragStart.current.y - e.clientY; // positive = drag up
      dragStart.current = null;

      if (Math.abs(dy) < 5 && Math.abs(dx) < 5) return;

      const from = new THREE.Vector3(...BALL_START);
      const to = new THREE.Vector3(...HOOP_CENTER);
      const dir = to.clone().sub(from).normalize();

      const power = Math.min(Math.max(dy * 0.04, 1.5), 5);
      const upward = Math.max(dy * 0.07, 3.5);

      setThrowTrigger({
        vx: dir.x * power + dx * 0.008,
        vy: upward,
        vz: dir.z * power,
      });
    };

    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, [active]);

  if (!active) return null;

  return (
    <Physics gravity={[0, -9.81, 0]}>
      <Ball throwTrigger={throwTrigger} onScore={onScore} />
      <PhysicsFloor />
      <PhysicsBackboard />
    </Physics>
  );
}
