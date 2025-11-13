import { lazy, Suspense, useEffect } from 'react';
import Layout from './components/Layout';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  useEffect(() => {
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
    <Layout>
      <Suspense
        fallback={(
          <span className="sr-only" role="status" aria-live="polite">
            Cargando secciones...
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
  );
}

export default App;
