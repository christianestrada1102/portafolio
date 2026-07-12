import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { Analytics } from '@vercel/analytics/react'
import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// ── GSAP ──
gsap.registerPlugin(ScrollTrigger)

// ── Lenis smooth scroll ──
// No inicializar si el usuario prefiere movimiento reducido
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenisRaf = null

window.startLenis = () => {
  if (reducedMotion || window.lenis) return

  const lenis = new Lenis({
    lerp: 0.08,
    smoothWheel: true,
  })

  // Expose globally so Layout can call lenis.scrollTo()
  window.lenis = lenis

  lenis.on('scroll', ScrollTrigger.update)

  lenisRaf = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(lenisRaf)
  gsap.ticker.lagSmoothing(0)
}

window.stopLenis = () => {
  if (!window.lenis) return
  if (lenisRaf) gsap.ticker.remove(lenisRaf)
  lenisRaf = null
  window.lenis.destroy()
  window.lenis = null
}

window.startLenis()

// ── React ──
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <App />
          <Analytics />
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
