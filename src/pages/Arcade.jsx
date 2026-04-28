import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useThree, useFrame } from '@react-three/fiber';
import { useGLTF, useProgress, Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

const VIEWS = {
  overview: {
    pos:    [0, 0.3, 2.5],
    target: [0, 0.1, 0],
  },
  arcade: {
    pos:    [0, 0.15, 0.7],
    target: [0, 0.15, 0],
  },
  basket: {
    pos:    [-1.2, 0.5, 0.2],
    target: [-2, 0.3, -2],
  },
};

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        fontFamily: "'Space Grotesk', sans-serif",
      }}>
        <div style={{
          fontSize: '48px',
          fontWeight: 700,
          color: '#A855F7',
          animation: 'breathe 1.5s ease-in-out infinite',
        }}>
          {'</>'}
        </div>
        <div style={{
          fontSize: '12px',
          color: '#737373',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}>
          {Math.round(progress)}%
        </div>
        <style>{`
          @keyframes breathe {
            0%, 100% { opacity: 0.3; transform: scale(0.95); }
            50% { opacity: 1; transform: scale(1.05); }
          }
        `}</style>
      </div>
    </Html>
  );
}

function CameraController({ activeView }) {
  const { camera } = useThree();
  const targetRef    = useRef(new THREE.Vector3(...VIEWS.overview.target));
  const isAnimating  = useRef(false);

  useEffect(() => {
    const view = VIEWS[activeView];
    isAnimating.current = true;

    gsap.to(camera.position, {
      x: view.pos[0],
      y: view.pos[1],
      z: view.pos[2],
      duration: 1.2,
      ease: 'power3.inOut',
      onComplete: () => { isAnimating.current = false; },
    });

    gsap.to(targetRef.current, {
      x: view.target[0],
      y: view.target[1],
      z: view.target[2],
      duration: 1.2,
      ease: 'power3.inOut',
    });
  }, [activeView, camera]);

  useFrame(() => {
    camera.lookAt(targetRef.current);
  });

  useEffect(() => {
    const handleWheel = (e) => {
      if (activeView === 'overview' || isAnimating.current) return;
      e.preventDefault();

      const view = VIEWS[activeView];
      const dir = new THREE.Vector3(
        view.target[0] - view.pos[0],
        view.target[1] - view.pos[1],
        view.target[2] - view.pos[2]
      ).normalize();

      const zoomSpeed = e.deltaY * 0.0008;
      const newPos = camera.position.clone().add(dir.multiplyScalar(zoomSpeed));

      const dist = newPos.distanceTo(new THREE.Vector3(...view.target));
      if (dist > 0.3 && dist < 2.5) {
        camera.position.copy(newPos);
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeView, camera]);

  return null;
}

function BasketModel() {
  const { scene } = useGLTF('/models/basket.glb', true);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.vertexColors = true;
        child.material.needsUpdate = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} position={[-2, 0, -2]} scale={1.5} rotation={[0, Math.PI / 4, 0]} />;
}

function ArcadeModel() {
  const { scene } = useGLTF('/models/arcade.glb', true);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.vertexColors = true;
        child.material.needsUpdate = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}

export default function Arcade() {
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setActiveView('overview');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505' }}>
      <Canvas
        camera={{ position: [0, 0.3, 2.5], fov: 50 }}
        style={{ background: '#050505' }}
        onPointerMissed={() => setActiveView('overview')}
      >
        <fog attach="fog" args={['#050505', 3, 8]} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 3, 2]} intensity={2} />
        <directionalLight position={[-2, 2, -1]} intensity={0.8} />
        <pointLight position={[0, 0.5, 1.5]} intensity={1.5} color="#A855F7" distance={4} />
        <pointLight position={[0, 2.5, 0]} intensity={0.3} color="#1a1a2e" distance={6} />
        <pointLight position={[0, -0.3, 0.8]} intensity={0.5} color="#7c3aed" distance={2} decay={2} />

        <CameraController activeView={activeView} />

        <Suspense fallback={<Loader />}>
          <group
            onClick={(e) => { e.stopPropagation(); setActiveView('arcade'); }}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'default'}
          >
            <ArcadeModel />
          </group>

          <group
            onClick={(e) => { e.stopPropagation(); setActiveView('basket'); }}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'default'}
          >
            <BasketModel />
          </group>

          {/* ── CUARTO ── */}

          {/* Piso */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
            <planeGeometry args={[6, 6]} />
            <meshStandardMaterial color="#080808" roughness={0.8} metalness={0.2} />
          </mesh>

          {/* Pared trasera */}
          <mesh position={[0, 1, -3]}>
            <planeGeometry args={[6, 3]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
          </mesh>

          {/* Pared izquierda */}
          <mesh position={[-3, 1, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[6, 3]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
          </mesh>

          {/* Pared derecha */}
          <mesh position={[3, 1, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[6, 3]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
          </mesh>

          {/* Pared frontal (detrás de la cámara) */}
          <mesh position={[0, 1, 3]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[6, 3]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
          </mesh>

          {/* ── LEDS en TODAS las paredes ── */}

          {/* LED pared trasera */}
          <mesh position={[0, 2.49, -2.99]}>
            <boxGeometry args={[5.9, 0.03, 0.02]} />
            <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={3} />
          </mesh>

          {/* LED pared frontal */}
          <mesh position={[0, 2.49, 2.99]} rotation={[0, Math.PI, 0]}>
            <boxGeometry args={[5.9, 0.03, 0.02]} />
            <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={3} />
          </mesh>

          {/* LED pared izquierda */}
          <mesh position={[-2.99, 2.49, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[5.9, 0.03, 0.02]} />
            <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={3} />
          </mesh>

          {/* LED pared derecha */}
          <mesh position={[2.99, 2.49, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <boxGeometry args={[5.9, 0.03, 0.02]} />
            <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={3} />
          </mesh>
        </Suspense>
      </Canvas>

      {activeView !== 'overview' && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '8px',
          color: '#737373',
          letterSpacing: '1px',
          zIndex: 10,
        }}>
          ESC / CLICK FUERA PARA VOLVER
        </div>
      )}
    </div>
  );
}

useGLTF.preload('/models/arcade.glb');
useGLTF.preload('/models/basket.glb', true);
