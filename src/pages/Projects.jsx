import { motion } from 'framer-motion';
import { FiExternalLink, FiGithub, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import astroImg from '../assets/Astro.jpg';
import safezoneImg from '../assets/safezone.png';
import profileImg from '../assets/Img.jpg';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: 'Alera',
      status: 'coming-soon',
      statusText: 'Próximamente',
      image: null,
      description: 'Plataforma digital que conecta pacientes con médicos cercanos de forma rápida y segura. Permite solicitar consultas por videollamada, a domicilio o en consultorio, según la urgencia y preferencia del usuario. Ofrece geolocalización, historial de consultas y chat seguro.',
      goal: 'Revolucionar el acceso a la salud en México.',
      technologies: ['React', 'Node.js', 'MongoDB', 'WebRTC'],
      link: null,
      github: null,
    },
    {
      id: 2,
      title: 'Astro Yuyin',
      status: 'in-progress',
      statusText: 'En desarrollo',
      image: astroImg,
      description: 'Plataforma educativa interactiva surgida del hackatón de la NASA Space Apps Challenge. Enseña a niños y niñas mediante juegos, retos y música con un enfoque en concentración y memoria. Personaje guía: Yuyin.',
      goal: 'Convertir el aprendizaje en una experiencia positiva e inclusiva (considera daltonismo y TDAH).',
      technologies: ['React', 'Three.js', 'Firebase', 'Web Audio API'],
      link: null,
      github: null,
    },
    {
      id: 3,
      title: 'SafeZone',
      status: 'in-progress',
      statusText: 'En desarrollo',
      image: safezoneImg,
      description: 'App móvil de seguridad personal y comunitaria. Permite enviar alertas en tiempo real ante situaciones de riesgo o emergencia. Crea una red de apoyo entre usuarios, familiares y autoridades.',
      goal: 'Prevenir, reaccionar y proteger con tecnología.',
      technologies: ['React Native', 'Node.js', 'Socket.io', 'PostgreSQL'],
      link: null,
      github: null,
    },
    {
      id: 4,
      title: 'Portafolio Web',
      status: 'completed',
      statusText: 'Terminado',
      image: profileImg,
      description: 'Este mismo sitio, que refleja mis habilidades, proyectos y crecimiento como desarrollador. Diseñado con enfoque UI/UX y Design Thinking.',
      goal: 'Mostrar mi trabajo y conectar con otros profesionales.',
      technologies: ['React', 'Vite', 'TailwindCSS', 'Framer Motion'],
      link: '#',
      github: 'https://github.com/ChristianEstrada',
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="text-green-500" />;
      case 'in-progress':
        return <FiClock className="text-yellow-500" />;
      case 'coming-soon':
        return <FiAlertCircle className="text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'coming-soon':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Mis Proyectos</span>
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-400 to-primary-800 mx-auto rounded-full mb-6" />
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Soluciones tecnológicas que buscan impactar positivamente en la sociedad
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-purple transition-all duration-300"
            >
              {/* Project Image */}
              <div className="relative h-64 bg-gradient-to-br from-primary-400 to-primary-800 overflow-hidden">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-white text-6xl font-bold opacity-20">
                      {project.title.charAt(0)}
                    </div>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                    {getStatusIcon(project.status)}
                    {project.statusText}
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-8">
                <h3 className="text-3xl font-bold mb-4 gradient-text">
                  {project.title}
                </h3>
                
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="bg-primary-50 border-l-4 border-primary-600 p-4 mb-6 rounded">
                  <p className="text-sm font-semibold text-primary-900 mb-1">
                    🎯 Objetivo:
                  </p>
                  <p className="text-sm text-primary-800">
                    {project.goal}
                  </p>
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Tecnologías:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                {(project.link || project.github) && (
                  <div className="flex gap-4">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 gradient-purple text-white rounded-full font-medium hover:shadow-purple transition-shadow"
                      >
                        <FiExternalLink />
                        Ver Demo
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                      >
                        <FiGithub />
                        GitHub
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-primary-400 to-primary-800 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              ¿Tienes un proyecto en mente?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Estoy siempre abierto a colaborar en proyectos innovadores
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-shadow"
            >
              Hablemos
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Projects;

