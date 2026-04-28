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
        <Suspense fallback={<Loader />}>
          <ArcadeModel />
          {/* Piso */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#080808" roughness={0.8} metalness={0.2} />
          </mesh>
          <OrbitControls makeDefault />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/arcade.glb');
