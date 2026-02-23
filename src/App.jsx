import { lazy, Suspense, useEffect, useState } from 'react';
import { useLanguage } from './context/LanguageContext';
import Layout from './components/Layout';
import Preloader from './components/Preloader';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));

function initLenis() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.lenis) return; // Evita doble inicialización
  // Lenis ya está inicializado en main.jsx, solo exponemos la referencia
  // Esta función se mantiene para compatibilidad con el preloader
}

function App() {
  const { t } = useLanguage();
  // Solo muestra el preloader la primera vez en la sesión
  const [showPreloader] = useState(() => !sessionStorage.getItem('preloader-shown'));

  useEffect(() => {
    // Si el preloader ya se mostró, inicia Lenis de inmediato
    if (!showPreloader) {
      initLenis();
    }

    // Prefetch del resto de secciones en tiempo idle
    const prefetchSections = () => {
      import('./pages/About');
      import('./pages/Achievements');
      import('./pages/Projects');
      import('./pages/Contact');
    };

    let idleId;
    let timeoutId;

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(prefetchSections);
    } else {
      timeoutId = window.setTimeout(prefetchSections, 250);
    }

    return () => {
      if (idleId && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <>
      {showPreloader && <Preloader onComplete={initLenis} />}
      <Layout>
        <Suspense
          fallback={(
            <span className="sr-only" role="status" aria-live="polite">
              {t('app.loading')}
            </span>
          )}
        >
          <Home />
          <About />
          <Achievements />
          <Projects />
          <Contact />
        </Suspense>
      </Layout>
    </>
  );
}

export default App;
