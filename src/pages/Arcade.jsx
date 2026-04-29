import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useThree, useFrame } from '@react-three/fiber';
import BasketballGame from '../components/BasketballGame';
import { useGLTF, useProgress, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

const VIEWS = {
  overview: {
    pos:    [0, 0.8, 3.5],
    target: [0, 0.1, 0],
  },
  arcade: {
    pos:    [0.12, 0.35, 1.25],
    target: [0, 0.15, 0.3],
  },
  basket: {
    pos:    [-1.2, 0.5, 0.2],
    target: [-2, 0.3, -2],
  },
  poster_devmode: {
    pos:    [-1.5, 0.7, -1],
    target: [-2.98, 0.7, -1],
  },
  poster_gameover: {
    pos:    [1.5, 0.8, -1.5],
    target: [1.5, 0.8, -2.98],
  },
  poster_cuadro: {
    pos:    [-0.7, 0.8, -1.5],
    target: [-0.7, 0.8, -2.98],
  },
  poster_poster2: {
    pos:    [1.5, 0.7, -1.5],
    target: [2.98, 0.7, -1.5],
  },
};

function LoadingOverlay() {
  const { progress }    = useProgress();
  const progressRef     = useRef(0);
  const [displayed, setDisplayed] = useState(0);
  const [phase, setPhase]         = useState('loading'); // 'loading' | 'fading' | 'done'

  // Keep a ref in sync so the interval always reads the latest value
  useEffect(() => { progressRef.current = progress; }, [progress]);

  // Lerp displayed toward real progress — starts at 0 regardless of where progress begins
  useEffect(() => {
    if (phase !== 'loading') return;
    const id = setInterval(() => {
      setDisplayed(d => {
        const target = progressRef.current;
        const next   = d + Math.max((target - d) * 0.12, 0.4);
        return next >= target ? target : next;
      });
    }, 16);
    return () => clearInterval(id);
  }, [phase]);

  // Once displayed hits 100, wait 500 ms then begin CSS fade
  useEffect(() => {
    if (displayed < 100 || phase !== 'loading') return;
    const id = setTimeout(() => setPhase('fading'), 500);
    return () => clearTimeout(id);
  }, [displayed, phase]);

  // After the 0.5 s CSS transition finishes, unmount completely
  useEffect(() => {
    if (phase !== 'fading') return;
    const id = setTimeout(() => setPhase('done'), 500);
    return () => clearTimeout(id);
  }, [phase]);

  if (phase === 'done') return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#050505',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      zIndex: 100,
      opacity: phase === 'fading' ? 0 : 1,
      transition: 'opacity 0.5s ease',
      pointerEvents: phase === 'fading' ? 'none' : 'auto',
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.3; transform: scale(0.95); }
          50%       { opacity: 1;   transform: scale(1.05); }
        }
      `}</style>
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
        {Math.round(displayed)}%
      </div>
    </div>
  );
}

function CameraController({ activeView }) {
  const { camera, invalidate } = useThree();
  const targetRef    = useRef(new THREE.Vector3(...VIEWS.overview.target));
  const isAnimating  = useRef(false);
  const zoomLimits = {
    overview: { min: 0.3, max: 2.5 },
    arcade: { min: 1.05, max: 3.2 },
    basket: { min: 0.3, max: 2.5 },
    poster_devmode: { min: 0.5, max: 2.5 },
    poster_gameover: { min: 0.5, max: 2.5 },
    poster_cuadro: { min: 0.5, max: 2.5 },
    poster_poster2: { min: 0.5, max: 2.5 },
  };

  useEffect(() => {
    const view = VIEWS[activeView];
    isAnimating.current = true;

    gsap.to(camera.position, {
      x: view.pos[0],
      y: view.pos[1],
      z: view.pos[2],
      duration: 0.8,
      ease: 'power2.out',
      onComplete: () => { isAnimating.current = false; },
    });

    gsap.to(targetRef.current, {
      x: view.target[0],
      y: view.target[1],
      z: view.target[2],
      duration: 0.8,
      ease: 'power2.out',
    });
  }, [activeView, camera]);

  useFrame(() => {
    camera.lookAt(targetRef.current);
    invalidate();
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
      const limits = zoomLimits[activeView] || zoomLimits.overview;
      if (dist > limits.min && dist < limits.max) {
        camera.position.copy(newPos);
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeView, camera]);

  return null;
}

function Carpet() {
  const alfombraTexture = useTexture('/images/alfombra.png');
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, 0.3]}>
      <planeGeometry args={[3, 2.5]} />
      <meshStandardMaterial map={alfombraTexture} roughness={0.95} />
    </mesh>
  );
}

function WallPoster({ url, position, rotation, width = 0.8, height = 0.6, id, onSelect }) {
  const texture = useTexture(url);
  return (
    <mesh
      position={position}
      rotation={rotation}
      onClick={(e) => { e.stopPropagation(); if (onSelect) onSelect(id); }}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'default'}
    >
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial map={texture} roughness={0.8} metalness={0.1} />
    </mesh>
  );
}

function ChairProp({
  position = [-0.2, -0.28, 0.9],
  rotation = [0, THREE.MathUtils.degToRad(12), 0],
  scale = 0.95,
}) {
  const texture = useTexture('/images/silla.png');
  const size = 0.48 * scale;

  return (
    <group position={position} rotation={rotation}>
      {/* Two crossed cards fake volume and read better from most angles */}
      <mesh>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial
          map={texture}
          transparent
          alphaTest={0.2}
          roughness={0.75}
          metalness={0.05}
          emissive="#3b1a61"
          emissiveIntensity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial
          map={texture}
          transparent
          alphaTest={0.2}
          roughness={0.75}
          metalness={0.05}
          emissive="#3b1a61"
          emissiveIntensity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
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

  return <primitive object={scene} position={[-2.5, 0, -2.5]} scale={1.5} rotation={[0, Math.PI / 4, 0]} />;
}

function ArcadeModel() {
  const { scene } = useGLTF('/models/arcade.glb', true);
  const model = useMemo(() => scene.clone(true), [scene]);

  const yOffset = useMemo(() => {
    const bbox = new THREE.Box3().setFromObject(model);
    return Number.isFinite(bbox.min.y) ? -bbox.min.y : 0;
  }, [model]);

  useEffect(() => {
    model.traverse((child) => {
      if (child.isMesh) {
        child.material.vertexColors = true;
        child.material.needsUpdate = true;
      }
    });
  }, [model]);

  return <primitive object={model} position={[0, yOffset, 0]} />;
}

export default function Arcade() {
  const [activeView, setActiveView] = useState('overview');
  const [score, setScore] = useState(0);
  const [scoreFeedback, setScoreFeedback] = useState(false);
  const [throwTrigger, setThrowTrigger] = useState(null);
  const [aimLine, setAimLine] = useState(null);
  const dragStartRef = useRef(null);
  const canThrowRef  = useRef(true);

  const handleScore = useCallback(() => {
    setScore(s => s + 1);
    setScoreFeedback(true);
    setTimeout(() => setScoreFeedback(false), 1000);
  }, []);
  const handleReset = useCallback(() => {
    setThrowTrigger(null);
    canThrowRef.current = true;
  }, []);

  // Drag-to-throw interaction — only active in basket view
  useEffect(() => {
    if (activeView !== 'basket') {
      setAimLine(null);
      setThrowTrigger(null);
      dragStartRef.current = null;
      canThrowRef.current = true;
      return;
    }

    const onDown = (e) => {
      if (!canThrowRef.current) return;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      setAimLine({ x1: e.clientX, y1: e.clientY, x2: e.clientX, y2: e.clientY });
    };

    const onMove = (e) => {
      if (!dragStartRef.current) return;
      setAimLine({ x1: dragStartRef.current.x, y1: dragStartRef.current.y, x2: e.clientX, y2: e.clientY });
    };

    const onUp = (e) => {
      if (!dragStartRef.current || !canThrowRef.current) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = dragStartRef.current.y - e.clientY; // positive = dragged up
      dragStartRef.current = null;
      setAimLine(null);
      if (Math.abs(dy) < 5 && Math.abs(dx) < 5) return;

      // Score if dragged mostly upward (aim < 0.5 = within ~27° of vertical)
      const power   = Math.min(dy / 150, 1);
      const aim     = Math.abs(dx) / Math.max(dy, 1);
      const isScore = power > 0.12 && aim < 0.5;

      canThrowRef.current = false;
      setThrowTrigger({ isScore, power });
    };

    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [activeView]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setActiveView('overview');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505' }}>
      <LoadingOverlay />
      <Canvas
        camera={{ position: [0, 0.3, 2.5], fov: 50 }}
        style={{ background: '#050505' }}
        frameloop="demand"
        dpr={[1, 1.5]}
        onPointerMissed={() => setActiveView('overview')}
      >
        <fog attach="fog" args={['#050505', 3, 8]} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[2, 3, 2]} intensity={2} />
        <directionalLight position={[-2, 2, -1]} intensity={0.8} />
        <pointLight position={[0, 0.5, 1.5]} intensity={1.5} color="#A855F7" distance={4} />
        <pointLight position={[0, 2.5, 0]} intensity={0.3} color="#1a1a2e" distance={6} />
        <pointLight position={[0, -0.3, 0.3]} intensity={0.75} color="#7c3aed" distance={2.6} decay={2} />

        {/* Luz canasta */}
        <pointLight position={[-2, 1, -1.5]} intensity={1.5} color="#A855F7" distance={3} decay={2} />
        <pointLight position={[-2, 0.5, -0.5]} intensity={1} color="#ffffff" distance={2.5} decay={2} />
        <pointLight position={[-2.5, 1.2, -2.3]} intensity={0.9} color="#c4b5fd" distance={2.2} decay={2} />
        
        {/* Luz poster2 (pared derecha) */}
        <pointLight position={[2.55, 1.05, -1.5]} intensity={0.95} color="#a855f7" distance={2.2} decay={2} />
        <pointLight position={[2.5, 0.7, -1]} intensity={1} color="#A855F7" distance={2} decay={2} />

        {/* Luz arriba del cuadro central */}
        <pointLight position={[-0.7, 1.4, -2.55]} intensity={0.85} color="#c084fc" distance={2.2} decay={2} />

        {/* Luz entre posters pared trasera (Arcade Room y Game Over) */}
        <pointLight position={[0.5, 1.2, -2.5]} intensity={1.2} color="#A855F7" distance={2.5} decay={2} />

        <CameraController activeView={activeView} />
        <BasketballGame
          active={activeView === 'basket'}
          throwTrigger={throwTrigger}
          onScore={handleScore}
          onReset={handleReset}
        />

        <Suspense fallback={null}>
          <group
            position={[0, -0.5, 0.3]}
            rotation={[0, THREE.MathUtils.degToRad(285), 0]}
            scale={[1.15, 1.15, 1.15]}
            onClick={(e) => { e.stopPropagation(); setActiveView('arcade'); }}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'default'}
          >
            <ArcadeModel />
          </group>
          <ChairProp />

          <group
            onClick={(e) => { e.stopPropagation(); setActiveView('basket'); }}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'default'}
          >
            <BasketModel />
          </group>

          {/* ── CUARTO ── */}

          {/* Piso */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} frustumCulled={true}>
            <planeGeometry args={[6, 6]} />
            <meshStandardMaterial color="#080808" roughness={0.8} metalness={0.2} />
          </mesh>

          {/* Alfombra */}
          <Carpet />

          {/* Pared trasera */}
          <mesh position={[0, 1, -3]} frustumCulled={true}>
            <planeGeometry args={[6, 3]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
          </mesh>

          {/* Pared izquierda */}
          <mesh position={[-3, 1, 0]} rotation={[0, Math.PI / 2, 0]} frustumCulled={true}>
            <planeGeometry args={[6, 3]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
          </mesh>

          {/* Pared derecha */}
          <mesh position={[3, 1, 0]} rotation={[0, -Math.PI / 2, 0]} frustumCulled={true}>
            <planeGeometry args={[6, 3]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
          </mesh>

          {/* Pared frontal (detrás de la cámara) */}
          <mesh position={[0, 1, 3]} rotation={[0, Math.PI, 0]} frustumCulled={true}>
            <planeGeometry args={[6, 3]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
          </mesh>

          {/* ── LEDS en TODAS las paredes ── */}

          {/* LED pared trasera */}
          <mesh position={[0, 1.8, -2.99]} frustumCulled={true}>
            <boxGeometry args={[5.9, 0.03, 0.02]} />
            <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={3} />
          </mesh>

          {/* LED pared frontal */}
          <mesh position={[0, 1.8, 2.99]} rotation={[0, Math.PI, 0]} frustumCulled={true}>
            <boxGeometry args={[5.9, 0.03, 0.02]} />
            <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={3} />
          </mesh>

          {/* LED pared izquierda */}
          <mesh position={[-2.99, 1.8, 0]} rotation={[0, Math.PI / 2, 0]} frustumCulled={true}>
            <boxGeometry args={[5.9, 0.03, 0.02]} />
            <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={3} />
          </mesh>

          {/* LED pared derecha */}
          <mesh position={[2.99, 1.8, 0]} rotation={[0, -Math.PI / 2, 0]} frustumCulled={true}>
            <boxGeometry args={[5.9, 0.03, 0.02]} />
            <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={3} />
          </mesh>

          {/* ── LEDS BASE (nivel del piso) ── */}

          {/* LED base pared trasera */}
          <mesh position={[0, -0.49, -2.99]} frustumCulled={true}>
            <boxGeometry args={[5.9, 0.02, 0.02]} />
            <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={2} />
          </mesh>

          {/* LED base pared frontal */}
          <mesh position={[0, -0.49, 2.99]} rotation={[0, Math.PI, 0]} frustumCulled={true}>
            <boxGeometry args={[5.9, 0.02, 0.02]} />
            <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={2} />
          </mesh>

          {/* LED base pared izquierda */}
          <mesh position={[-2.99, -0.49, 0]} rotation={[0, Math.PI / 2, 0]} frustumCulled={true}>
            <boxGeometry args={[5.9, 0.02, 0.02]} />
            <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={2} />
          </mesh>

          {/* LED base pared derecha */}
          <mesh position={[2.99, -0.49, 0]} rotation={[0, -Math.PI / 2, 0]} frustumCulled={true}>
            <boxGeometry args={[5.9, 0.02, 0.02]} />
            <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={2} />
          </mesh>

          {/* ── POSTERS ── */}

          {/* Pared trasera - "Arcade Room" cuadro grande centrado */}
          <WallPoster
            url="/images/cuadro.png"
            position={[-0.7, 0.8, -2.98]}
            rotation={[0, 0, 0]}
            width={1.4}
            height={0.9}
            id="poster_cuadro"
            onSelect={setActiveView}
          />

          {/* Pared izquierda - "DEV MODE" poster */}
          <WallPoster
            url="/images/poster.png"
            position={[-2.98, 0.7, -1]}
            rotation={[0, Math.PI / 2, 0]}
            width={0.8}
            height={1}
            id="poster_devmode"
            onSelect={setActiveView}
          />

          {/* Pared trasera - "GAME OVER" neon, a la derecha del cuadro central */}
          <WallPoster
            url="/images/game-over.png"
            position={[1.5, 0.8, -2.98]}
            rotation={[0, 0, 0]}
            width={1}
            height={0.6}
            id="poster_gameover"
            onSelect={setActiveView}
          />

          {/* Pared derecha - poster2 */}
          <WallPoster
            url="/images/poster2.png"
            position={[2.98, 0.7, -1.5]}
            rotation={[0, -Math.PI / 2, 0]}
            width={0.8}
            height={1}
            id="poster_poster2"
            onSelect={setActiveView}
          />
        </Suspense>
      </Canvas>

      {activeView === 'basket' && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '14px',
          color: '#A855F7',
          zIndex: 50,
          textAlign: 'center',
          pointerEvents: 'none',
          textShadow: '0 0 10px #A855F7',
        }}>
          <div>SCORE: {score}</div>
          <div style={{ fontSize: '8px', color: '#737373', marginTop: '6px' }}>
            ARRASTRA Y SUELTA PARA LANZAR
          </div>
        </div>
      )}

      {activeView === 'basket' && scoreFeedback && (
        <>
          <style>{`
            @keyframes niceFeedback {
              0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
              25%  { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
              70%  { opacity: 1; transform: translate(-50%, -50%) scale(1); }
              100% { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
            }
          `}</style>
          <div style={{
            position: 'fixed',
            top: '45%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '52px',
            color: '#A855F7',
            textShadow: '0 0 20px #A855F7, 0 0 40px #7c3aed',
            zIndex: 20,
            pointerEvents: 'none',
            animation: 'niceFeedback 1s ease-out forwards',
            whiteSpace: 'nowrap',
          }}>
            NICE!
          </div>
        </>
      )}

      {activeView === 'basket' && aimLine && (
        <svg style={{
          position: 'fixed', inset: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none', zIndex: 15,
        }}>
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#f97316" opacity="0.9" />
            </marker>
          </defs>
          <line
            x1={aimLine.x1} y1={aimLine.y1}
            x2={aimLine.x2} y2={aimLine.y2}
            stroke="#f97316" strokeWidth={2} strokeDasharray="6 3"
            opacity={0.8} markerEnd="url(#arrow)"
          />
          <circle cx={aimLine.x1} cy={aimLine.y1} r={7} fill="#f97316" opacity={0.5} />
        </svg>
      )}

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

useTexture.preload('/images/alfombra.png');
useTexture.preload('/images/cuadro.png');
useTexture.preload('/images/poster.png');
useTexture.preload('/images/game-over.png');
useTexture.preload('/images/poster2.png');
useTexture.preload('/images/silla.png');
