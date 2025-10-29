import { motion } from 'framer-motion';
import { 
  SiCplusplus, 
  SiReact, 
  SiNodedotjs, 
  SiHtml5, 
  SiCss3,
  SiGit,
  SiGithub
} from 'react-icons/si';
import { 
  FaMicrosoft, 
  FaCode, 
  FaCodeBranch,
  FaLaptopCode 
} from 'react-icons/fa';

const About = () => {
  const technologies = [
    { name: 'C#', icon: FaMicrosoft, color: '#68217A' },
    { name: 'C++', icon: SiCplusplus, color: '#00599C' },
    { name: 'React', icon: SiReact, color: '#61DAFB' },
    { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
    { name: 'HTML5', icon: SiHtml5, color: '#E34F26' },
    { name: 'CSS3', icon: SiCss3, color: '#1572B6' },
  ];

  const tools = [
    { name: 'Visual Studio', icon: FaMicrosoft, percentage: 85, color: '#5C2D91' },
    { name: 'VS Code', icon: FaCode, percentage: 80, color: '#007ACC' },
    { name: 'Cursor', icon: FaLaptopCode, percentage: 75, color: '#000000' },
    { name: 'Git', icon: SiGit, percentage: 75, color: '#F05032' },
    { name: 'GitHub', icon: SiGithub, percentage: 80, color: '#181717' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="sobre-mi" className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Sobre mí</span>
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-400 to-primary-800 mx-auto rounded-full" />
        </motion.div>

        {/* About Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-lg p-8 md:p-12 mb-16"
        >
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Hi! I'm <span className="font-semibold text-primary-600">Christian Estrada</span>, 
            a passionate software developer from Chihuahua, Mexico.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            I enjoy creating meaningful and scalable applications using technologies like{' '}
            <span className="font-semibold text-primary-600">C#, C++, React, and Node.js</span>.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            I'm currently expanding my skills in{' '}
            <span className="font-semibold text-primary-600">Web3</span> and cloud environments 
            such as <span className="font-semibold text-primary-600">AWS</span>.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            I've participated in hackathons with{' '}
            <span className="font-semibold text-primary-600">NASA, MIT, AWS, and ETH Mty</span>, 
            where I've learned to work in teams and build creative, real-world solutions.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Always open to collaboration and new challenges that push my limits as a developer.
          </p>
        </motion.div>

        {/* Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            <span className="gradient-text">Tecnologías</span>
          </h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {technologies.map((tech) => (
              <motion.div
                key={tech.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-purple transition-shadow flex flex-col items-center justify-center"
              >
                <tech.icon size={48} color={tech.color} className="mb-3" />
                <p className="text-sm font-medium text-gray-700">{tech.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Tools & IDEs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            <span className="gradient-text">Herramientas & IDEs</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-purple transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <tool.icon size={28} color={tool.color} />
                    <span className="font-semibold text-gray-800">{tool.name}</span>
                  </div>
                  <span className="text-primary-600 font-bold">{tool.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${tool.percentage}%` }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ 
                      background: `linear-gradient(90deg, ${tool.color}, ${tool.color}dd)` 
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Student Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-primary-400 to-primary-800 rounded-3xl p-8 md:p-12 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Estudiante UTCH</h2>
          <p className="text-xl opacity-90">
            Universidad Tecnológica de Chihuahua
          </p>
          <p className="text-lg opacity-80 mt-2">
            Desarrollo de Software • Tercer Cuatrimestre
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
