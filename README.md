<div align="center">
  <h1>CodeByNas Portfolio</h1>
  <p><strong>Professional web portfolio built with a focus on UI/UX, advanced animations, and performance</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white" />
    <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white" />
    <img src="https://img.shields.io/badge/GSAP-88CE02?style=flat&logo=greensock&logoColor=black" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" />
    <img src="https://img.shields.io/badge/license-MIT-green?style=flat" />
  </p>

  <p>
    <a href="https://www.codebynas.dev/">🌐 Live Demo</a> ·
    <a href="https://github.com/christianestrada1102/portafolio/issues">🐛 Report Bug</a>
  </p>
</div>

---

## About

A professional web portfolio designed and built from scratch, focused on smooth motion design, a custom theming system, bilingual support, and a standalone hackathon archive — all without relying on heavy external libraries beyond GSAP and Framer Motion.

> Built and maintained by **[Christian Estrada](https://github.com/christianestrada1102)** (@CodeByNas)
> Chihuahua, Mexico

---

## Key Features

| Feature | Description |
|---|---|
| 🎬 GSAP Animations | Staggered letter entrance, hero parallax, scroll-reveal in every section, boarding-pass transition in `/hackathons` |
| 🚀 Pixel Intro | `/hackathons` entry screen: pixels scatter randomly using per-block threshold + drift vectors; gated before cover starts |
| ✈️ Boarding Pass | Animated airline-ticket overlay on article open — route line + plane fly CUU→MTY, stamp drops, GSAP timeline |
| ✨ ScrambleButton | Custom button with character-scramble on hover, GSAP timeline |
| 🌗 Light / Dark Theme | CSS variable system (`data-theme`) with semantic tokens, persisted in `localStorage`, zero flash via inline `<head>` script |
| 🌍 Manual i18n (ES/EN) | Zero-dependency translation system — flat key dictionary + `LanguageContext` |
| 🖱️ Lenis Smooth Scroll | Integrated with GSAP ScrollTrigger for precise scroll-driven animations |
| 🃏 Projects Ring | 3D rotating card ring built with Three.js; click to open modal with project detail |
| 📬 Functional Contact Form | Express backend + Resend API on Render; 30 s `AbortController` timeout |
| 🏆 Achievements Hover | Title roll + sibling dimming + cursor color-bloom (radial CSS mask) on certs and hackathon rows |
| 📄 Hackathon Archive | Standalone `/hackathons` — per-article navigation (keyboard ← →, swipe), data in `src/data/hackathons.js` |
| 🔍 404 Page | Scramble + magnetic effect on digits; `sessionStorage` guard against loops |
| ♿ Accessibility | `prefers-reduced-motion`, `aria-hidden` on decorative clones, proper heading hierarchy, `aria-live` on dynamic text |

---

## Preview

<video src="https://raw.githubusercontent.com/christianestrada1102/portafolio/main/public/preview.webm" controls muted loop playsinline style="max-width: 420px; border-radius: 8px;">
  Your browser does not support embedded video.
</video>

---

## Tech Stack

### Frontend

```
React 18                 → UI, lazy loading, Suspense
Vite 5                   → Dev server, build, code splitting (vendor / motion / three chunks)
TailwindCSS 3            → Utility-first styling
GSAP 3 + ScrollTrigger   → Timelines, scroll reveals, boarding-pass animation
Framer Motion            → Page transitions
Lenis                    → Smooth scroll synchronized with gsap.ticker
React Router DOM v6      → Client-side routing; vercel.json rewrites all paths to index.html
vite-imagetools          → WebP/AVIF via ?as=picture imports
React Icons              → SVG icons (FaGithub, FaLinkedin, FaXTwitter, etc.)
@vercel/analytics        → Vercel Web Analytics
Three.js                 → 3D projects ring (separate chunk)
```

### Backend

```
Node.js + Express        → POST /api/sendEmail endpoint
Resend API               → Transactional emails (owner notification + user confirmation)
Render                   → Hosting with cold start (~30 s)
```

### Animations Breakdown

| Animation | Implementation |
|---|---|
| Hero | Staggered letters via `gsap.timeline`, image parallax with ScrollTrigger scrub |
| Pixel Intro | Per-block `blockThr` (random 0–0.9) + `driftX`/`driftY`; GSAP `prog.p 0→1.1`; `lifeAt()` drives shrink + fade |
| Boarding Pass | Overlay fade → pass `y:-70→0` → route `scaleX 0→1` + plane `left 0%→100%` → stamp → pass exit → article fade |
| Achievements hover | CSS `mask-image: radial-gradient` following `--mx`/`--my` custom props; title `translateY(-100%)` roll |
| ScrambleButton | Left→right scramble on `mouseenter`, restore on `mouseleave` |
| Scroll Reveal | `[data-reveal]` with `gsap.from` + ScrollTrigger across all sections |
| 404 | GSAP scramble on digits + magnetic cursor tracking |

---

## Project Structure

```
PortafolioWeb/
├── index.html                    # Anti-flash script + data-theme="dark" by default
├── src/
│   ├── assets/
│   │   ├── hacks/                # Hackathon photos (per-event subfolders)
│   │   └── ...                   # General images (WebP)
│   ├── components/
│   │   ├── Layout.jsx            # Navbar, footer, scroll progress, theme/lang toggles
│   │   ├── Preloader.jsx         # GSAP animated intro (always dark)
│   │   ├── ScrambleButton.jsx    # Button with character scramble effect
│   │   ├── TiltCard.jsx          # Mouse-tracking 3D tilt card
│   │   ├── TypingText.jsx        # Animated typing text
│   │   ├── PixelIntro.jsx        # Pixel scatter intro for /hackathons
│   │   └── ASCIIText.jsx         # ASCII art text (React Bits)
│   ├── context/
│   │   ├── ThemeContext.jsx      # data-theme toggle + localStorage
│   │   └── LanguageContext.jsx   # t(), toggleLang(), localStorage
│   ├── hooks/
│   │   └── useInView.js          # Intersection Observer for scroll reveals
│   ├── data/
│   │   └── hackathons.js         # Per-event metadata (title, date, photos, description)
│   ├── utils/
│   │   └── sectionReveal.js      # Shared revealHeaders GSAP utility
│   ├── pages/
│   │   ├── Home.jsx              # Hero parallax + GSAP stagger
│   │   ├── About.jsx             # Bio, stack, tools
│   │   ├── Projects.jsx          # 3D ring (Three.js) + modal
│   │   ├── Achievements.jsx      # NASA modal, ICATECH, hackathon rows w/ hover effects
│   │   ├── Contact.jsx           # Form + validation + Resend
│   │   ├── HackathonsPage.jsx    # Standalone article viewer + boarding pass + pixel intro
│   │   └── NotFound.jsx          # 404 with scramble + magnetic digits
│   ├── translations.js           # ES/EN keys for the whole app
│   ├── App.jsx                   # Lazy loading + Suspense + React Router
│   ├── main.jsx                  # ThemeProvider + LanguageProvider + Lenis + Analytics
│   └── index.css                 # CSS variables, theme tokens, custom animations
├── server/
│   ├── index.js                  # Express + Resend — POST /api/sendEmail
│   └── ENV_TEMPLATE.txt
├── public/
│   └── hackathons/               # Static hackathon assets (.gitkeep)
└── README.md
```

---

## Theme System

Implemented with CSS custom properties and the `data-theme` attribute on `<html>`:

```css
:root {
  --bg: #000000;
  --bg-secondary: #111111;
  --text-primary: #ffffff;
  --text-secondary: #aaaaaa;
  --accent: #7c3aed;
  --border: #333333;
  --radius: 4px;
}

[data-theme="light"] {
  --bg: #e8e5e0;
  --bg-secondary: #d0ccc5;
  --text-primary: #111111;
  --text-secondary: #555555;
  --accent: #6d28d9;
  --border: #cccccc;
}
```

The anti-flash script in `<head>` applies the saved theme before React mounts:

```html
<script>(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
```

---

## i18n System

No external libraries. Flat file `src/translations.js`:

```js
export const translations = {
  es: { 'nav.home': 'Inicio', 'home.cta.projects': 'Ver proyectos', ... },
  en: { 'nav.home': 'Home',   'home.cta.projects': 'View projects', ... },
};
```

`LanguageContext` exposes a memoized `t(key)` via `useCallback([lang])` and `toggleLang()` with persistence in `localStorage`.

---

## Installation

### Prerequisites

- Node.js 18+

### Setup

```bash
# Clone
git clone https://github.com/christianestrada1102/portafolio.git
cd portafolio/PortafolioWeb

# Install frontend + backend dependencies
npm run install:all

# Dev server — http://localhost:3000
npm run dev

# Backend (separate terminal)
cd server && node index.js
```

### Environment Variables — `server/.env`

```env
PORT=3001
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Vite dev server (port 3000) |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serves the build locally (use this for Lighthouse) |
| `npm run install:all` | Installs frontend + backend |

---

## Deployment

| Service | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Build: `npm run build` · Output: `dist` · SPA rewrite in `vercel.json` |
| Backend | Render | Root: `server` · Start: `node index.js` · Cold start ~30 s |

**Backend environment variables:** `RESEND_API_KEY`, `EMAIL_FROM`, `PORT`

**Security headers** (`vercel.json`): X-Frame-Options, HSTS, COOP, Referrer-Policy, Permissions-Policy. CSP intentionally omitted (caused Lighthouse Performance drop from 81→55).

---

## License

```
MIT License
Copyright (c) 2026 CodeByNas
```

See the full [LICENSE](LICENSE) file for details.

---

## Author

**Christian Estrada**
Chihuahua, Mexico

[![LinkedIn](https://img.shields.io/badge/LinkedIn-000000?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/christian-estrada-a59130386/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/christianestrada1102)
[![X](https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/CodeByNAS)

---

<div align="center">
  <p><sub>© 2026 CodeByNas · MIT License</sub></p>
</div>
