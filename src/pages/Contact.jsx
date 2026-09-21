import { useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { useLanguage } from '../context/LanguageContext';
import { revealHeaders } from '../utils/sectionReveal';

gsap.registerPlugin(ScrollTrigger);

const BACKEND   = import.meta.env.VITE_BACKEND_URL ?? 'https://portafolioweb-backend.onrender.com';
const EMAIL     = 'christianestrada1102.dev@gmail.com';
const CAL_URL   = 'https://cal.com/christian-estrada'; // ← cambia por tu URL real
const CV_PATH   = '/cv-christian-estrada.pdf';          // ← pon el PDF en /public/

const SOCIAL = [
  { Icon: FaGithub,    label: 'GitHub',    href: 'https://github.com/christianestrada1102' },
  { Icon: FaLinkedin,  label: 'LinkedIn',  href: 'https://www.linkedin.com/in/christian-estrada-a59130386/' },
  { Icon: FaXTwitter,  label: 'X',         href: 'https://x.com/CodeByNAS' },
  { Icon: FaInstagram, label: 'Instagram', href: 'https://www.instagram.com/christian_estrada1102' },
];

const EMPTY = { name: '', email: '', message: '' };

function validate(fields, t) {
  const errors = {};
  if (!fields.name.trim() || fields.name.trim().length < 2)       errors.name    = t('contact.validate.name');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))           errors.email   = t('contact.validate.email');
  if (!fields.message.trim() || fields.message.trim().length < 10) errors.message = t('contact.validate.message');
  return errors;
}

export default function Contact() {
  const [formOpen,  setFormOpen]  = useState(false);
  const [fields,    setFields]    = useState(EMPTY);
  const [errors,    setErrors]    = useState({});
  const [status,    setStatus]    = useState('idle');
  const containerRef = useRef(null);
  const formRef      = useRef(null);
  const { t }        = useLanguage();

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      revealHeaders(containerRef.current);
      gsap.utils.toArray('[data-reveal]', containerRef.current).forEach((el) => {
        gsap.from(el, {
          y: 32, opacity: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Animate form open/close
  useLayoutEffect(() => {
    const el = formRef.current;
    if (!el) return;
    if (formOpen) {
      gsap.fromTo(el, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' });
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
    }
  }, [formOpen]);

  const change = (e) => {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => { const n = { ...er }; delete n[name]; return n; });
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate(fields, t);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStatus('sending');
    try {
      const ctrl = new AbortController();
      const tid  = setTimeout(() => ctrl.abort(), 30000);
      const res  = await fetch(`${BACKEND}/api/sendEmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, subject: `Mensaje de ${fields.name}` }),
        signal: ctrl.signal,
      });
      clearTimeout(tid);
      if (!res.ok) throw new Error('server');
      setStatus('success');
      setFields(EMPTY);
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" ref={containerRef} className="pt-6 pb-16 md:pt-10 md:pb-24">
      <div className="max-w-6xl mx-auto px-4 md:px-6">

        {/* ── Header ── */}
        <div className="mb-10 md:mb-14">
          <p data-anim="eyebrow" className="font-mono text-xs uppercase tracking-[0.25em] text-brand-400 mb-2">
            {t('contact.label')}
          </p>
          <h2 data-anim="title" className="text-3xl md:text-4xl font-semibold text-white mb-3">
            {t('contact.heading.pre')}<em className="not-italic accent-subtle">{t('contact.heading.accent')}</em>{t('contact.heading.post')}
          </h2>
          <p data-anim="copy" className="text-neutral-400 text-base max-w-md leading-relaxed">
            {t('contact.description')}
          </p>
        </div>

        {/* ── Layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-12 md:gap-20">

          {/* Left: CTAs + form */}
          <div data-reveal className="flex flex-col gap-6">

            {/* 3 action buttons */}
            <div className="flex flex-wrap gap-3">

              {/* Send message toggle */}
              <button
                type="button"
                onClick={() => { setFormOpen((v) => !v); setStatus('idle'); }}
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] px-5 py-2.5 border rounded-sm transition-all duration-200"
                style={{
                  borderColor: formOpen ? 'white' : 'rgba(100,100,100,0.5)',
                  color: formOpen ? 'white' : 'rgb(163,163,163)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7Z"/>
                </svg>
                {formOpen ? t('contact.form.cancel') ?? 'Cancelar' : t('contact.form.submit') ?? 'Enviar mensaje'}
              </button>

              {/* Schedule call */}
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] px-5 py-2.5 border border-neutral-700 text-neutral-400 hover:border-white hover:text-white rounded-sm transition-all duration-200"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
                {t('contact.cta.schedule') ?? 'Agendar llamada'}
              </a>

              {/* Download CV */}
              <a
                href={CV_PATH}
                download
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] px-5 py-2.5 border border-neutral-700 text-neutral-400 hover:border-white hover:text-white rounded-sm transition-all duration-200"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15V3M7 10l5 5 5-5M3 17v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"/>
                </svg>
                {t('contact.cta.cv') ?? 'Descargar CV'}
              </a>
            </div>

            {/* Collapsible form */}
            <div ref={formRef} style={{ overflow: 'hidden', height: 0, opacity: 0 }}>
              <div className="pt-2 pb-4">
                {status === 'success' ? (
                  <div className="py-8">
                    <p className="text-white text-lg font-semibold mb-1">{t('contact.success.message')}</p>
                    <p className="text-neutral-400 text-sm mb-5">{t('contact.success.sub')}</p>
                    <button
                      onClick={() => { setStatus('idle'); setFormOpen(false); }}
                      className="font-mono text-xs uppercase tracking-[0.18em] text-brand-400 hover:text-white transition-colors duration-200"
                    >
                      {t('contact.success.another')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submit} noValidate className="flex flex-col gap-6 max-w-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Field label={t('contact.form.name.label')}  name="name"    type="text"  placeholder={t('contact.form.name.ph')}    value={fields.name}    onChange={change} error={errors.name} />
                      <Field label={t('contact.form.email.label')} name="email"   type="email" placeholder={t('contact.form.email.ph')}   value={fields.email}   onChange={change} error={errors.email} />
                    </div>
                    <Field label={t('contact.form.message.label')} name="message" type="textarea" placeholder={t('contact.form.message.ph')} value={fields.message} onChange={change} error={errors.message} rows={4} />
                    {status === 'error' && (
                      <p className="text-red-400 text-sm font-mono">{t('contact.form.error')}</p>
                    )}
                    <div>
                      <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="font-mono text-sm uppercase tracking-[0.18em] px-8 py-3 bg-white text-neutral-950 hover:bg-neutral-200 disabled:opacity-40 transition-all duration-200 rounded-sm"
                      >
                        {status === 'sending' ? t('contact.form.submitting') : t('contact.form.submit')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Direct email */}
            <div className="mt-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-600 mb-2">
                {t('contact.direct.label')}
              </p>
              <a href={`mailto:${EMAIL}`} className="text-sm text-neutral-400 hover:text-white transition-colors duration-200 break-all">
                {EMAIL}
              </a>
              <span className="text-neutral-600 mx-2">·</span>
              <a href="tel:+526141070683" className="text-sm text-neutral-400 hover:text-white transition-colors duration-200">
                +52 614 107 0683
              </a>
            </div>
          </div>

          {/* Sidebar: socials */}
          <div data-reveal className="flex flex-col gap-6 md:pt-14">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500 mb-3">
                {t('contact.social.label')}
              </p>
              <div className="flex flex-col gap-2.5">
                {SOCIAL.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors duration-200 w-fit"
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-sm">{label}</span>
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

function Field({ label, name, type, placeholder, value, onChange, error, rows }) {
  return (
    <div>
      <label htmlFor={name} className="block font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-2">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name} name={name} rows={rows ?? 4}
          placeholder={placeholder} value={value} onChange={onChange}
          className={`w-full bg-transparent resize-none text-sm text-white placeholder-neutral-600 border-b py-2 outline-none transition-colors duration-200 ${error ? 'border-red-500' : 'border-neutral-700 focus:border-brand-400'}`}
        />
      ) : (
        <input
          id={name} name={name} type={type}
          placeholder={placeholder} value={value} onChange={onChange}
          className={`w-full bg-transparent text-sm text-white placeholder-neutral-600 border-b py-2 outline-none transition-colors duration-200 ${error ? 'border-red-500' : 'border-neutral-700 focus:border-brand-400'}`}
        />
      )}
      {error && <p className="mt-1.5 font-mono text-[10px] text-red-400 tracking-wide">{error}</p>}
    </div>
  );
}
