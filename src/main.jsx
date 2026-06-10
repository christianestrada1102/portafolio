import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// ── GSAP ──
gsap.registerPlugin(ScrollTrigger)

// ── Lenis smooth scroll ──
// No inicializar si el usuario prefiere movimiento reducido
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lenis = new Lenis({
    lerp: 0.08,
    smoothWheel: true,
  })

  // Expose globally so Layout can call lenis.scrollTo()
  window.lenis = lenis

  function raf(time) {
    lenis.raf(time)
    ScrollTrigger.update()
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)

  lenis.on('scroll', ScrollTrigger.update)
}

// ── React ──
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
