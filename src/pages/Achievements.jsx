import { motion } from 'framer-motion';
import { FiExternalLink, FiAward } from 'react-icons/fi';
import { useInView } from '../hooks/useInView';
import poapEtherfuse from '../assets/etherfuse.webp';
import poapBase from '../assets/base.webp';
import poapEns from '../assets/ens.webp';
import poapUniversity from '../assets/UBD.webp';
import poapEthMexico from '../assets/ethmexico.gif';
import nasaSpaceAppsCert from '../assets/nasa-space-apps.jpg';

const Achievements = () => {
  const { ref: sectionRef, hasBeenInView } = useInView({ threshold: 0.1 });

  // Datos de los POAPs
  const poaps = [
    {
      id: 1,
      name: 'Ethereum Mexico 2025 - Sponsor',
      event: 'ETHEREUM MEXICO 2025',
      sponsor: 'etherfuse',
      date: 'Octubre 2025',
      description: 'Sponsor POAP del hackathon EthMexico MTY 2025',
      image: poapEtherfuse,
      link: null,
      category: 'Hackathon',
    },
    {
      id: 2,
      name: 'Ethereum Mexico 2025 - Sponsor',
      event: 'ETHEREUM MEXICO 2025',
      sponsor: 'base',
      date: 'Octubre 2025',
      description: 'Sponsor POAP del hackathon EthMexico MTY 2025',
      image: poapBase,
      link: null,
      category: 'Hackathon',
    },
    {
      id: 3,
      name: 'Ethereum Mexico 2025 - Sponsor',
      event: 'ETHEREUM MEXICO 2025',
      sponsor: 'ens',
      date: 'Octubre 2025',
      description: 'Sponsor POAP del hackathon EthMexico MTY 2025',
      image: poapEns,
      link: null,
      category: 'Hackathon',
    },
    {
      id: 4,
      name: 'University Blockchain Day',
      event: 'UNIVERSITY BLOCKCHAIN DAY',
      sponsor: null,
      date: 'Septiembre 2025',
      description: 'Certificado de participación en el evento universitario',
      image: poapUniversity,
      link: null,
      category: 'Evento',
    },
    {
      id: 5,
      name: 'EthMexico MTY 2025',
      event: 'EthMexico MTY 2025',
      sponsor: null,
      date: 'Noviembre 2025',
      description: 'POAP del hackathon EthMexico MTY 2025 - Proyecto SettArb',
      image: poapEthMexico,
      link: null,
      category: 'Hackathon',
    },
  ];

  // POAP Profile - Usando email para el perfil de POAP
  const poapProfileEmail = 'christianmanuel1233@gmail.com';
  const poapProfileUrl = `https://collectors.poap.xyz/scan/${poapProfileEmail}`;

  // Certificados
  const certificates = [
    {
      id: 1,
      name: 'NASA Space Apps Challenge',
      issuer: 'NASA',
      date: 'Octubre 2025',
      description: 'Certificado "Galactic Problem Solver" por participación destacada en el hackathon internacional de NASA Space Apps Challenge, reconociendo esfuerzos para abordar desafíos en la Tierra y el espacio.',
      image: nasaSpaceAppsCert,
      link: null,
      category: 'Hackathon',
      isFeatured: true, // Destacar este certificado
    },
    // Si en el futuro quieres agregar ICATECH sin información sensible:
    // {
    //   id: 2,
    //   name: 'Manejo STEAM',
    //   issuer: 'ICATECH',
    //   date: '2024',
    //   description: 'Certificado en metodologías STEAM (Ciencia, Tecnología, Ingeniería, Artes y Matemáticas)',
    //   image: null, // Solo si editas la imagen para ocultar información sensible
    //   link: null,
    //   category: 'Educación',
    // },
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
    <section id="logros" className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={sectionRef}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Logros y Certificaciones</span>
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-400 to-primary-800 mx-auto rounded-full mb-6" />
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            Mis certificaciones, POAPs y reconocimientos - Prueba de mi participación en hackathons y eventos importantes
          </p>
          
          {/* Link al perfil completo de POAP */}
          <motion.a
            href={poapProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-colors shadow-purple hover:shadow-purple-lg"
          >
            <FiExternalLink />
            Ver mi colección completa en POAP.xyz
          </motion.a>
        </motion.div>

        {/* Certificados destacados */}
        {certificates.length > 0 && (
          <div className="mb-16">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
              className="text-3xl font-bold text-center mb-8"
            >
              <span className="gradient-text">Certificados</span>
            </motion.h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={hasBeenInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            >
              {certificates.map((cert) => (
                <motion.div
                  key={cert.id}
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className={`relative group ${cert.isFeatured ? 'md:col-span-2 lg:col-span-1' : ''}`}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-purple transition-all duration-300 flex flex-col items-center border-2 border-primary-200 dark:border-primary-800">
                    {/* Certificate Image */}
                    <div className="relative mb-4 w-full">
                      {cert.image ? (
                        <img
                          src={cert.image}
                          alt={cert.name}
                          className="w-full h-48 object-cover rounded-xl border-2 border-primary-200 dark:border-primary-800"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-primary-400 to-primary-800 rounded-xl flex items-center justify-center border-2 border-primary-200 dark:border-primary-800">
                          <FiAward className="text-white text-6xl" />
                        </div>
                      )}
                      {/* Badge de categoría */}
                      <div className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {cert.category}
                      </div>
                      {cert.isFeatured && (
                        <div className="absolute -top-2 -left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          ⭐ Destacado
                        </div>
                      )}
                    </div>

                    {/* Certificate Info */}
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 text-center mb-2">
                      {cert.name}
                    </h3>
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-2">
                      {cert.issuer}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">
                      {cert.description}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                      {cert.date}
                    </p>

                    {/* Link si existe */}
                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 flex items-center gap-1"
                      >
                        Ver certificado
                        <FiExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* POAPs Section */}
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
            className="text-3xl font-bold text-center mb-8"
          >
            <span className="gradient-text">POAPs (Certificados Blockchain)</span>
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={hasBeenInView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12"
          >
            {poaps.map((poap) => (
              <motion.div
                key={poap.id}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.05 }}
                className="relative group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-purple transition-all duration-300 flex flex-col items-center">
                  {/* POAP Image */}
                  <div className="relative mb-4">
                    {poap.image ? (
                      <img
                        src={poap.image}
                        alt={poap.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-primary-200 dark:border-primary-800"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-primary-800 flex items-center justify-center border-4 border-primary-200 dark:border-primary-800">
                        <FiAward className="text-white text-4xl" />
                      </div>
                    )}
                    {/* Badge de categoría */}
                    <div className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {poap.category}
                    </div>
                  </div>

                  {/* POAP Info */}
                  <h3 className="font-bold text-gray-800 dark:text-gray-200 text-center mb-2 text-sm">
                    {poap.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-1">
                    {poap.event}
                  </p>
                  {poap.sponsor && (
                    <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-2">
                      Sponsor: {poap.sponsor}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                    {poap.date}
                  </p>

                  {/* Link si existe */}
                  {poap.link && (
                    <a
                      href={poap.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 flex items-center gap-1"
                    >
                      Ver POAP
                      <FiExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-primary-400 to-primary-800 rounded-3xl p-8 md:p-12 text-white text-center"
        >
          <h2 className="text-2xl font-bold mb-4">
            ¿Qué son los POAPs?
          </h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto">
            Los POAPs (Proof of Attendance Protocol) son certificados digitales en blockchain que 
            acreditan tu participación en eventos, hackathons y conferencias. Cada POAP es único, 
            verificable y almacenado de forma permanente en la blockchain, sirviendo como prueba 
            auténtica de tus logros y experiencia.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Achievements;

