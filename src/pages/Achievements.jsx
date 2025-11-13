import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FiExternalLink, FiAward, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import poapEtherfuse from '../assets/etherfuse.webp';
import poapBase from '../assets/base.webp';
import poapEns from '../assets/ens.webp';
import poapUniversity from '../assets/UBD.webp';
import poapEthMexico from '../assets/ethmexico.gif';
import nasaSpaceAppsCert from '../assets/nasa-space-apps.jpg';
import nasaSpaceAppsCertWebp from '../assets/nasa-space-apps.jpg?format=webp&imagetools';

const Achievements = () => {
  const { ref: sectionRef, hasBeenInView } = useInView({ threshold: 0.1 });
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedItechCert, setSelectedItechCert] = useState(null);
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

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

  // Certificado destacado
  const featuredCertificate = {
    id: 1,
    name: 'NASA Space Apps Challenge',
    issuer: 'NASA',
    date: 'Octubre 2025',
    description: 'Certificado "Galactic Problem Solver" por participación destacada en el hackathon internacional de NASA Space Apps Challenge, reconociendo esfuerzos para abordar desafíos en la Tierra y el espacio.',
    image: nasaSpaceAppsCert,
    imageWebp: nasaSpaceAppsCertWebp,
    link: null,
    category: 'Hackathon',
    isFeatured: true,
  };

  // Certificados ICATECH (solo texto, sin imágenes)
  const icatechCertificates = [
    {
      name: 'Pensamiento Crítico y Creatividad en STEAM',
      hours: 40,
    },
    {
      name: 'Comunicación Efectiva en STEAM',
      hours: 10,
    },
    {
      name: 'Emprender con Energía',
      hours: 10,
    },
    {
      name: 'Autogestión y Responsabilidad Personal',
      hours: 10,
    },
    {
      name: 'Estrategias Colaborativas para el Trabajo en Equipo',
      hours: 10,
    },
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
          initial={shouldAnimate ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={shouldAnimate ? { duration: 0.6 } : { duration: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Logros y Certificaciones</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-400 to-primary-800 mx-auto rounded-full mb-6" />
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            Mis certificaciones, POAPs y reconocimientos - Prueba de mi participación en hackathons y eventos importantes
          </p>
          
          {/* Link al perfil completo de POAP */}
          <motion.a
            href={poapProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={shouldAnimate ? { scale: 1.05 } : undefined}
            whileTap={shouldAnimate ? { scale: 0.95 } : undefined}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-colors shadow-purple hover:shadow-purple-lg"
            aria-label="Abrir colección completa de POAP en una nueva pestaña"
          >
            <FiExternalLink aria-hidden="true" />
            Ver mi colección completa en POAP.xyz
          </motion.a>
        </motion.div>

        {/* Certificados destacados */}
        <div className="mb-16">
          <motion.h3
            initial={shouldAnimate ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
            animate={hasBeenInView ? { opacity: 1, y: 0 } : { opacity: 1 }}
            transition={shouldAnimate ? { duration: 0.6 } : { duration: 0 }}
            className="text-3xl font-bold text-center mb-8"
          >
            <span className="gradient-text">Certificados</span>
          </motion.h3>
          
          {/* Layout: NASA a la izquierda, ICATECH a la derecha */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* Certificado de NASA */}
            <motion.div
              variants={shouldAnimate ? itemVariants : undefined}
              initial={shouldAnimate ? 'hidden' : undefined}
              animate={hasBeenInView ? 'visible' : shouldAnimate ? 'hidden' : undefined}
              whileHover={shouldAnimate ? { y: -10, scale: 1.02 } : undefined}
              className="relative group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-purple transition-all duration-300 flex flex-col items-center border-2 border-primary-200 dark:border-primary-800 h-full">
                {/* Certificate Image - Más grande y clickeable */}
                <div className="relative mb-4 w-full flex justify-center">
                  <motion.div
                    className="relative w-full max-w-md cursor-pointer"
                    whileHover={shouldAnimate ? { scale: 1.02 } : undefined}
                    whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
                    onClick={() => setIsImageModalOpen(true)}
                  >
                    <picture>
                      {featuredCertificate.imageWebp && (
                        <source srcSet={featuredCertificate.imageWebp} type="image/webp" />
                      )}
                      <motion.img
                        src={featuredCertificate.image}
                        alt="Certificado del NASA Space Apps Challenge"
                        className="w-full h-64 md:h-80 object-contain rounded-xl border-2 border-primary-200 dark:border-primary-800 shadow-lg"
                        animate={shouldAnimate ? {
                          boxShadow: [
                            '0 10px 30px rgba(168, 85, 247, 0.2)',
                            '0 15px 40px rgba(168, 85, 247, 0.4)',
                            '0 10px 30px rgba(168, 85, 247, 0.2)',
                          ],
                        } : {
                          boxShadow: '0 15px 40px rgba(168, 85, 247, 0.3)',
                        }}
                        transition={shouldAnimate ? {
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        } : { duration: 0 }}
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                    {/* Overlay hover */}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 rounded-xl transition-colors duration-300 flex items-center justify-center">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={shouldAnimate ? { opacity: 1 } : undefined}
                        className="bg-white/90 dark:bg-gray-900/90 px-4 py-2 rounded-lg text-sm font-medium text-gray-800 dark:text-gray-200"
                      >
                        Click para ampliar
                      </motion.div>
                    </div>
                    {/* Badge de categoría */}
                    <div className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                      {featuredCertificate.category}
                    </div>
                    {featuredCertificate.isFeatured && (
                      <div className="absolute -top-2 -left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                        ⭐ Destacado
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Certificate Info */}
                <h3 className="font-bold text-gray-800 dark:text-gray-200 text-center mb-2">
                  {featuredCertificate.name}
                </h3>
                <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-2">
                  {featuredCertificate.issuer}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 text-center mb-2">
                  {featuredCertificate.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  {featuredCertificate.date}
                </p>

                {/* Link si existe */}
                {featuredCertificate.link && (
                  <a
                    href={featuredCertificate.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 flex items-center gap-1"
                    aria-label="Ver certificado de NASA Space Apps Challenge en una nueva pestaña"
                  >
                    Ver certificado
                    <FiExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                )}
              </div>
            </motion.div>

            {/* Certificados ICATECH - Lista compacta */}
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              animate={hasBeenInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              transition={shouldAnimate ? { delay: 0.2 } : { duration: 0 }}
              whileHover={
                shouldAnimate
                  ? {
                      scale: 1.02,
                      boxShadow: [
                        '0 10px 30px rgba(168, 85, 247, 0.2)',
                        '0 15px 40px rgba(168, 85, 247, 0.4)',
                        '0 10px 30px rgba(168, 85, 247, 0.2)',
                      ],
                    }
                  : undefined
              }
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-2 border-primary-200 dark:border-primary-800 h-full cursor-pointer transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center lg:text-left">
                Certificados ICATECH (2025)
              </h3>
              <div className="space-y-3">
                {icatechCertificates.map((cert, index) => {
                  const isSelected = selectedItechCert === index;
                  const baseAnimate = hasBeenInView
                    ? {
                        opacity: 1,
                        x: 0,
                        scale: isSelected && shouldAnimate ? [1, 1.02, 1] : 1,
                        boxShadow:
                          isSelected && shouldAnimate
                            ? [
                                '0 10px 30px rgba(168, 85, 247, 0.2)',
                                '0 15px 40px rgba(168, 85, 247, 0.4)',
                                '0 10px 30px rgba(168, 85, 247, 0.2)',
                              ]
                            : '0 0 0 rgba(168, 85, 247, 0)',
                      }
                    : {};

                  const transition = isSelected && shouldAnimate
                    ? {
                        delay: 0.3 + index * 0.05,
                        scale: {
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        },
                        boxShadow: {
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        },
                      }
                    : {
                        delay: 0.3 + index * 0.05,
                        duration: 0.3,
                      };

                  return (
                    <motion.div
                      key={`${cert.name}-${index}`}
                      initial={shouldAnimate ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                      animate={baseAnimate}
                      transition={transition}
                      whileHover={shouldAnimate ? { x: 3 } : undefined}
                      onClick={() => setSelectedItechCert(selectedItechCert === index ? null : index)}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 border-l-4 cursor-pointer ${
                        isSelected
                          ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-600 dark:border-primary-400 ring-2 ring-primary-400/50 dark:ring-primary-500/50'
                          : 'bg-gray-50 dark:bg-gray-700 border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-1 truncate">
                          {cert.name}
                        </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                          ICATECH - Chihuahua
                        </p>
                      </div>
                      <div className="ml-3 flex-shrink-0">
                        <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full text-xs font-medium">
                          {cert.hours}h
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <motion.div
                initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
                animate={hasBeenInView ? { opacity: 1 } : { opacity: 1 }}
                transition={shouldAnimate ? { delay: 0.6 } : { duration: 0 }}
                className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center"
              >
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Total:</span> 80 horas de capacitación
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* POAPs Section */}
        <div className="mb-16">
          <motion.h3
            initial={shouldAnimate ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
            animate={hasBeenInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={shouldAnimate ? { duration: 0.6 } : { duration: 0 }}
            className="text-3xl font-bold text-center mb-8"
          >
            <span className="gradient-text">POAPs (Certificados Blockchain)</span>
          </motion.h3>
          <motion.div
            variants={shouldAnimate ? containerVariants : undefined}
            initial={shouldAnimate ? 'hidden' : undefined}
            animate={hasBeenInView ? 'visible' : shouldAnimate ? 'hidden' : undefined}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12"
          >
            {poaps.map((poap) => (
              <motion.div
                key={poap.id}
                variants={shouldAnimate ? itemVariants : undefined}
                whileHover={shouldAnimate ? { y: -10, scale: 1.05 } : undefined}
                className="relative group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-purple transition-all duration-300 flex flex-col items-center">
                  {/* POAP Image */}
                  <div className="relative mb-4">
                    {poap.image ? (
                      <img
                        src={poap.image}
                        alt={`POAP ${poap.name}`}
                        className="w-32 h-32 rounded-full object-cover border-4 border-primary-200 dark:border-primary-800"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-primary-800 flex items-center justify-center border-4 border-primary-200 dark:border-primary-800">
                        <FiAward className="text-white text-4xl" aria-hidden="true" />
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
                  <p className="text-xs text-gray-600 dark:text-gray-300 text-center mb-1">
                    {poap.event}
                  </p>
                  {poap.sponsor && (
                    <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-2">
                      Sponsor: {poap.sponsor}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    {poap.date}
                  </p>

                  {/* Link si existe */}
                  {poap.link && (
                    <a
                      href={poap.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 flex items-center gap-1"
                      aria-label={`Ver POAP ${poap.name} en una nueva pestaña`}
                    >
                      Ver POAP
                      <FiExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Modal para imagen de NASA */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsImageModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 dark:bg-black/90 p-4"
            transition={shouldAnimate ? { duration: 0.2 } : { duration: 0 }}
          >
            <motion.div
              initial={shouldAnimate ? { scale: 0.8, opacity: 0 } : { scale: 1, opacity: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl"
              transition={shouldAnimate ? { duration: 0.2 } : { duration: 0 }}
            >
              {/* Botón cerrar */}
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/90 dark:bg-gray-900/90 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-900 transition-colors shadow-lg"
                type="button"
                aria-label="Cerrar certificado ampliado"
              >
                <FiX className="w-5 h-5 text-gray-800 dark:text-gray-200" aria-hidden="true" />
              </button>

              {/* Imagen ampliada */}
              <div className="w-full h-full flex items-center justify-center p-8">
                <picture>
                  {featuredCertificate.imageWebp && (
                    <source srcSet={featuredCertificate.imageWebp} type="image/webp" />
                  )}
                  <img
                    src={featuredCertificate.image}
                    alt={`Certificado ampliado: ${featuredCertificate.name}`}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-xl"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>

              {/* Información del certificado */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-white font-bold text-xl mb-1">
                  {featuredCertificate.name}
                </h3>
                <p className="text-white/80 text-sm">
                  {featuredCertificate.issuer} • {featuredCertificate.date}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Achievements;

