import { useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import ScrambleButton from '../components/ScrambleButton';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const ENDPOINT = 'https://christian-estrada-backend.onrender.com/api/sendEmail';

const SOCIAL = [
  { Icon: FaGithub,    label: 'GitHub',    href: 'https://github.com/christianestrada1102' },
  { Icon: FaLinkedin,  label: 'LinkedIn',  href: 'https://www.linkedin.com/in/christian-estrada-a59130386/' },
  { Icon: FaXTwitter,  label: 'Twitter/X', href: 'https://x.com/CodeByNAS' },
  { Icon: FaInstagram, label: 'Instagram', href: 'https://www.instagram.com/christian_estrada1102' },
];

export default function Contact() {
  const [form,    setForm]    = useState({ name: '', email: '', subject: '', message: '' });
  const [status,  setStatus]  = useState('idle');
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});
  const containerRef          = useRef(null);
  const { t }                 = useLanguage();

  const validate = (name, value) => {
    if (name === 'name')    return value.length < 2    ? t('contact.validate.name')     : null;
    if (name === 'email')   return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? t('contact.validate.email') : null;
    if (name === 'subject') return !value.trim()       ? t('contact.validate.required') : null;
    if (name === 'message') return value.length < 20   ? t('contact.validate.message')  : null;
    return null;
  };

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allErrors = {};
    Object.entries(form).forEach(([k, v]) => { allErrors[k] = validate(k, v); });
    setErrors(allErrors);
    setTouched({ name: true, email: true, subject: true, message: true });
    if (Object.values(allErrors).some(Boolean)) return;

    setStatus('loading');
    try {
      const controller = new AbortController();
      const timeout    = setTimeout(() => controller.abort(), 30_000);
      const res = await fetch(ENDPOINT, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
        signal:  controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error('Server error');
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
      setErrors({});
      setTouched({});
    } catch {
      setStatus('error');
    }
  };

  const getInputCls = (field) => {
    const hasError = touched[field] && errors[field];
    return `w-full bg-transparent border-0 border-b ${
      hasError ? 'border-red-500/50 focus:border-red-400' : 'border-neutral-800 focus:border-[#7c3aed]'
    } text-white text-sm px-0 py-3 placeholder:text-neutral-600 focus:outline-none transition-colors duration-300`;
  };

  return (
    <section id="contact" ref={containerRef} className="pt-6 pb-12 md:pt-10 md:pb-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6">

        {/* ── Header ── */}
        <div data-reveal className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand-400 mb-2">
            {t('contact.label')}
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-3">
            {t('contact.heading.pre')}<em className="not-italic accent-subtle">{t('contact.heading.accent')}</em>{t('contact.heading.post')}
          </h2>
          <p className="text-neutral-400 text-base max-w-md leading-relaxed">
            {t('contact.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-10 md:gap-20">

          {/* ── Form ── */}
          <div data-reveal className="order-2 md:order-1">
            <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
              {t('contact.form.description')}
            </p>

            {status === 'success' ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-10 h-10 rounded-sm bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mx-auto">
                  <span className="text-emerald-400 text-lg">✓</span>
                </div>
                <p className="text-white font-medium">{t('contact.success.message')}</p>
                <p className="text-neutral-400 text-sm">{t('contact.success.sub')}</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-4 font-mono text-xs text-brand-400 hover:text-brand-300 transition-colors duration-200"
                >
                  {t('contact.success.another')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-7" noValidate>
                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-1.5">
                      {t('contact.form.name.label')}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t('contact.form.name.ph')}
                      minLength={2}
                      required
                      className={getInputCls('name')}
                    />
                    {touched.name && errors.name && (
                      <p className="text-xs text-red-400 mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-1.5">
                      {t('contact.form.email.label')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t('contact.form.email.ph')}
                      required
                      className={getInputCls('email')}
                    />
                    {touched.email && errors.email && (
                      <p className="text-xs text-red-400 mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-1.5">
                    {t('contact.form.subject.label')}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t('contact.form.subject.ph')}
                    required
                    className={getInputCls('subject')}
                  />
                  {touched.subject && errors.subject && (
                    <p className="text-xs text-red-400 mt-1">{errors.subject}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-1.5">
                    {t('contact.form.message.label')}
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t('contact.form.message.ph')}
                    required
                    rows={5}
                    className={`${getInputCls('message')} resize-none`}
                  />
                  <div className="flex items-center justify-between mt-1">
                    {touched.message && errors.message ? (
                      <p className="text-xs text-red-400">{errors.message}</p>
                    ) : (
                      <span />
                    )}
                    <p className="text-xs font-mono text-neutral-500">
                      {form.message.length}/20
                    </p>
                  </div>
                </div>

                {status === 'error' && (
                  <p className="font-mono text-xs text-red-400">
                    {t('contact.form.error')}
                  </p>
                )}

                <ScrambleButton
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-white hover:bg-neutral-200 text-neutral-950 text-sm font-medium rounded-sm px-8 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {status === 'loading' ? t('contact.form.submitting') : t('contact.form.submit')}
                </ScrambleButton>
              </form>
            )}
          </div>

          {/* ── Contact info ── */}
          <div data-reveal className="order-1 md:order-2 space-y-6 md:space-y-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400 mb-4">
                {t('contact.direct.label')}
              </p>
              <div className="space-y-3">
                {[
                  { labelKey: 'contact.direct.email', value: 'christianestrada1102.dev@gmail.com', href: 'mailto:christianestrada1102.dev@gmail.com' },
                  { labelKey: 'contact.direct.phone', value: '+52 614 107 0683',                   href: 'tel:+526141070683' },
                ].map(({ labelKey, value, href }) => (
                  <div key={labelKey}>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-0.5">
                      {t(labelKey)}
                    </p>
                    <a href={href} className="text-neutral-300 text-sm hover:text-white transition-colors duration-200 break-all">
                      {value}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-400 mb-4">
                {t('contact.social.label')}
              </p>
              <div className="flex items-center gap-4">
                {SOCIAL.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-neutral-400 hover:text-white transition-colors duration-200"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
