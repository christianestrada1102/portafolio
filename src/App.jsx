import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Achievements from './pages/Achievements';
import Projects from './pages/Projects';
import Contact from './pages/Contact';

function App() {
  return (
    <Layout>
      <Home />
      <About />
      <Achievements />
      <Projects />
      <Contact />
    </Layout>
  );
}

export default App;
