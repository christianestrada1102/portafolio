import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, useProgress, Html } from '@react-three/drei';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ textAlign: 'center', fontFamily: 'monospace' }}>
        <div style={{ width: 200, height: 2, background: '#1a1a1a', marginBottom: 8 }}>
          <div style={{ width: `${progress}%`, height: '100%', background: '#A855F7' }} />
        </div>
        <span style={{ fontSize: 12, color: '#A855F7' }}>{Math.round(progress)}%</span>
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
    <div style={{ width: '100vw', height: '100vh', background: '#0A0A0A' }}>
      <Canvas camera={{ position: [0, 0.3, 2], fov: 50 }}>
        <color attach="background" args={['#0A0A0A']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 5, 2]} intensity={1} />
        <Suspense fallback={<Loader />}>
          <ArcadeModel />
          <OrbitControls makeDefault />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/arcade.glb');
