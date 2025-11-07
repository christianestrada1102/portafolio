import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const { isDark, toggleTheme } = useTheme();
  
  // Scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const navLinks = [
    { name: 'Inicio', id: 'inicio' },
    { name: 'Sobre mí', id: 'sobre-mi' },
    { name: 'Logros', id: 'logros' },
    { name: 'Proyectos', id: 'proyectos' },
    { name: 'Contacto', id: 'contacto' },
  ];

  // Detectar la sección activa con scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(link => link.id);
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section) {
          const { offsetTop, offsetHeight } = section;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Altura del navbar
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  const isActive = (id) => activeSection === id;

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 transition-colors duration-300 w-full">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.button 
              onClick={() => scrollToSection('inicio')}
              className="relative text-xl md:text-2xl font-bold cursor-pointer group font-mono"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 inline-flex items-center gap-1">
                <motion.span 
                  className="text-primary-400 dark:text-primary-500"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {'<'}
                </motion.span>
                <motion.span
                  className="relative"
                  animate={{
                    textShadow: [
                      '0 0 5px rgba(168, 85, 247, 0.5)',
                      '0 0 15px rgba(168, 85, 247, 0.8), 0 0 25px rgba(147, 51, 234, 0.6)',
                      '0 0 5px rgba(168, 85, 247, 0.5)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <span className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-primary-600 to-primary-800">
                    CodeByNas
                  </span>
                </motion.span>
                <motion.span 
                  className="text-primary-400 dark:text-primary-500"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  {'/>'}
                </motion.span>
              </span>
              {/* Efecto glow tecnológico */}
              <motion.div
                className="absolute -inset-2 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"
                style={{
                  background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
                }}
                initial={false}
                whileHover={{ opacity: 0.6 }}
              />
            </motion.button>

            {/* Desktop Navigation */}
            <div className="flex items-center gap-6">
              <div className="hidden md:flex space-x-8">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(link.id)
                        ? 'text-primary-600'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                    }`}
                  >
                    {link.name}
                    {isActive(link.id) && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="hidden md:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isDark ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDark ? (
                    <FiSun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <FiMoon className="w-5 h-5 text-gray-700" />
                  )}
                </motion.div>
              </button>
            </div>

            {/* Mobile buttons */}
            <div className="flex items-center gap-2 md:hidden">
              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <FiSun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <FiMoon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <FiX size={24} className="text-gray-700 dark:text-gray-300" />
                ) : (
                  <FiMenu size={24} className="text-gray-700 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.id)
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-16 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-800 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Main Content */}
      <main className="pt-16 min-h-screen bg-background dark:bg-gray-900">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-background dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © 2025 Christian Estrada. Todos los derechos reservados.
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
              Hecho con React y Café ☕
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

