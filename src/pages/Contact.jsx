import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiSend,
  FiLinkedin,
  FiGithub,
  FiTwitter,
  FiInstagram,
} from 'react-icons/fi';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  const contactInfo = [
    {
      icon: FiMail,
      label: 'Email',
      value: 'christianmanuel1233@gmail.com',
      link: 'mailto:christianmanuel1233@gmail.com',
    },
    {
      icon: FiPhone,
      label: 'Teléfono',
      value: '+52 614 107 0683',
      link: 'tel:+526141070683',
    },
    {
      icon: FiMapPin,
      label: 'Ubicación',
      value: 'Chihuahua, Chihuahua, México',
      link: null,
    },
  ];

  const socialLinks = [
    {
      icon: FiLinkedin,
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/christian-estrada-a59130386/',
      color: '#0077B5',
    },
    {
      icon: FiGithub,
      label: 'GitHub',
      url: 'https://github.com/christianestrada1102',
      color: '#181717',
    },
    {
      icon: FiTwitter,
      label: 'X (Twitter)',
      url: 'https://x.com/CodeByNAS',
      color: '#000000',
    },
    {
      icon: FiInstagram,
      label: 'Instagram',
      url: 'https://www.instagram.com/christian_estrada1102?igsh=bmZueGZzcjJkc3Vp&utm_source=qr',
      color: '#000000',
    },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Timeout de 30 segundos para cold start de Render
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch('https://christian-estrada-backend.onrender.com/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error completo:', error);
      if (error.name === 'AbortError') {
        setSubmitStatus('timeout');
      } else {
        setSubmitStatus('error');
      }
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  return (
    <section id="contacto" className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={shouldAnimate ? { duration: 0.6 } : { duration: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Contacto</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-400 to-primary-800 mx-auto rounded-full mb-6" />
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            ¿Tienes alguna pregunta o propuesta? ¡Me encantaría saber de ti!
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column - Contact Information */}
          <motion.div
            initial={shouldAnimate ? { opacity: 0, x: -30 } : { opacity: 1, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={shouldAnimate ? { delay: 0.2 } : { duration: 0 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 md:p-8 transition-colors duration-300">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 gradient-text">
                Información de Contacto
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6 md:mb-8 leading-relaxed">
                Estoy disponible para oportunidades de colaboración, proyectos interesantes 
                o simplemente para charlar sobre tecnología.
              </p>

              {/* Contact Cards */}
              <div className="space-y-3 md:space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={shouldAnimate ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={shouldAnimate ? { delay: 0.3 + index * 0.1 } : { duration: 0 }}
                    className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                  >
                    <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                      <info.icon className="text-primary-600 dark:text-primary-400" size={20} aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 font-medium">{info.label}</p>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-sm md:text-base text-gray-800 dark:text-gray-200 font-semibold hover:text-primary-600 dark:hover:text-primary-400 transition-colors break-words"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-sm md:text-base text-gray-800 dark:text-gray-200 font-semibold break-words">{info.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800 dark:text-gray-200">
                  Redes Sociales
                </h3>
                <div className="flex flex-wrap gap-3 md:gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={shouldAnimate ? { scale: 1.1, y: -3 } : undefined}
                      whileTap={shouldAnimate ? { scale: 0.95 } : undefined}
                      className="w-11 h-11 md:w-12 md:h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                      aria-label={`Abrir ${social.label} en una nueva pestaña`}
                      title={social.label}
                    >
                      <social.icon size={22} style={{ color: social.color }} className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={shouldAnimate ? { opacity: 0, x: 30 } : { opacity: 1, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={shouldAnimate ? { delay: 0.2 } : { duration: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 md:p-8 transition-colors duration-300"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-5 md:mb-6 gradient-text">
              Envíame un mensaje
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Tu nombre completo"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="tu@email.com"
                />
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Asunto
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Motivo de tu mensaje"
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                  placeholder="Escribe tu mensaje aquí..."
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={shouldAnimate ? { scale: 1.02 } : undefined}
                whileTap={shouldAnimate ? { scale: 0.98 } : undefined}
                className="w-full gradient-purple text-white py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg flex items-center justify-center gap-2 shadow-purple hover:shadow-purple-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-live="polite"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar mensaje
                    <FiSend aria-hidden="true" />
                  </>
                )}
              </motion.button>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400 text-center font-medium"
                  role="status"
                  aria-live="polite"
                >
                  ✅ ¡Mensaje enviado correctamente! Te responderé pronto.
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-center font-medium"
                  role="alert"
                >
                  ❌ Error al enviar el mensaje. Por favor, intenta de nuevo o contáctame directamente por email.
                </motion.div>
              )}

              {submitStatus === 'timeout' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl text-yellow-700 dark:text-yellow-400 text-center font-medium"
                  role="status"
                  aria-live="assertive"
                >
                  ⏱️ El servidor está despertando (puede tomar hasta 1 minuto). Por favor, intenta de nuevo en unos segundos.
                </motion.div>
              )}

              {isSubmitting && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                       className="text-sm text-gray-600 dark:text-gray-400 text-center italic"
                >
                  {/* Si tarda más de 5 segundos, mostrar mensaje de paciencia */}
                  El servidor gratuito puede tomar unos segundos en responder...
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

