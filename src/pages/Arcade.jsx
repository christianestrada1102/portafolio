import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, useProgress, Html } from '@react-three/drei';

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
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505' }}>
      <Canvas
        camera={{ position: [0, 0.2, 1.8], fov: 50 }}
        style={{ background: '#050505' }}
      >
        <fog attach="fog" args={['#050505', 3, 8]} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 3, 2]} intensity={2} />
        <directionalLight position={[-2, 2, -1]} intensity={0.8} />
        <pointLight position={[0, 0.5, 1.5]} intensity={1.5} color="#A855F7" distance={4} />
        {/* Luz techo tenue */}
        <pointLight position={[0, 2.5, 0]} intensity={0.3} color="#1a1a2e" distance={6} />
        {/* Glow morado frente a la maquinita */}
        <pointLight position={[0, -0.3, 0.8]} intensity={0.5} color="#7c3aed" distance={2} decay={2} />
        <Suspense fallback={<Loader />}>
          <ArcadeModel />
          <BasketModel />

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

          <OrbitControls
            minDistance={0.8}
            maxDistance={2.8}
            minPolarAngle={0.3}
            maxPolarAngle={Math.PI / 2 - 0.05}
            enablePan={false}
            target={[0, 0.1, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/arcade.glb');
useGLTF.preload('/models/basket.glb', true);
