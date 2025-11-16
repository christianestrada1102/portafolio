import { motion, useReducedMotion } from 'framer-motion';
import { FiArrowRight, FiMail } from 'react-icons/fi';
import profileImg from '../assets/Img.jpg';
import TypingText from '../components/TypingText';

const Home = () => {
  const prefersReducedMotion = useReducedMotion();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="inicio" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl"
          animate={prefersReducedMotion ? { opacity: 0.25 } : {
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={prefersReducedMotion ? { duration: 0 } : {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-800/20 rounded-full blur-3xl"
          animate={prefersReducedMotion ? { opacity: 0.25 } : {
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={prefersReducedMotion ? { duration: 0 } : {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center">
          {/* Profile Media (Video promocional) */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
            className="mb-8 inline-block"
          >
            <div className="relative">
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-800 rounded-full blur-xl opacity-50"
                animate={prefersReducedMotion ? { opacity: 0.5 } : {
                  scale: [1, 1.1, 1],
                }}
                transition={prefersReducedMotion ? { duration: 0 } : {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.video
                src="/preview.webm"
                className="relative w-48 h-48 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-purple-lg"
                autoPlay
                muted
                loop
                playsInline
                poster={profileImg}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.05, rotate: 5 }}
                transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 300 }}
                width={192}
                height={192}
                aria-label="Video de presentación del portafolio de Christian Estrada"
                role="img"
              />
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.2, duration: 0.5 }}
            className="text-5xl md:text-7xl font-bold mb-4"
          >
            <span className="gradient-text">Christian Estrada</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.4, duration: 0.5 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed"
          >
            Desarrollador de software de Chihuahua, México
          </motion.p>
          
          <motion.p
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.5, duration: 0.5 }}
            className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
          >
            <TypingText 
              text="apasionado por construir aplicaciones escalables y significativas."
              speed={50}
              delay={1500}
            />
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              onClick={() => scrollToSection('proyectos')}
              whileHover={prefersReducedMotion ? undefined : { 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(160, 86, 241, 0.4)"
              }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
              className="gradient-purple text-white px-8 py-4 rounded-full font-medium text-lg shadow-purple flex items-center gap-2 transition-all relative overflow-hidden group"
              aria-label="Ir a la sección de proyectos"
            >
              <span className="relative z-10">Ver proyectos</span>
              <motion.span
                className="relative z-10"
                animate={prefersReducedMotion ? { x: 0 } : { x: [0, 5, 0] }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 1.5, repeat: Infinity }}
              >
                <FiArrowRight aria-hidden="true" />
              </motion.span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800"
                initial={prefersReducedMotion ? { x: 0 } : { x: '-100%' }}
                whileHover={prefersReducedMotion ? undefined : { x: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
              />
            </motion.button>
            
            <motion.button
              onClick={() => scrollToSection('contacto')}
              whileHover={prefersReducedMotion ? undefined : { 
                scale: 1.05,
                backgroundColor: 'rgba(160, 86, 241, 0.1)'
              }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
              className="bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 px-8 py-4 rounded-full font-medium text-lg border-2 border-primary-600 dark:border-primary-400 transition-all flex items-center gap-2"
              aria-label="Ir a la sección de contacto"
            >
              Contactarme
              <FiMail aria-hidden="true" />
            </motion.button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={prefersReducedMotion ? { duration: 0 } : { delay: 1, duration: 0.5 }}
            className="mt-20"
            aria-hidden="true"
          >
            <motion.div
              animate={prefersReducedMotion ? { y: 0 } : { y: [0, 10, 0] }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 2, repeat: Infinity }}
              className="inline-block"
            >
              <div className="w-6 h-10 border-2 border-primary-400 rounded-full flex justify-center">
                <motion.div
                  animate={prefersReducedMotion ? { y: 0 } : { y: [0, 12, 0] }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-2"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Home;

