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

A professional web portfolio designed and built from scratch, focused on smooth motion design, a custom theming system, and bilingual support — all without relying on heavy external libraries beyond GSAP.

> Built and maintained by **[Christian Estrada](https://github.com/christianestrada1102)** (@CodeByNas)
> Chihuahua, Mexico

---

## Key Features

| Feature | Description |
|---|---|
| 🎬 GSAP Animations | Staggered letter entrance, hero parallax, scroll-reveal in every section, infinite project carousel via ScrollTrigger |
| 🚀 Animated Preloader | Intro screen built with GSAP, always renders in dark theme regardless of active theme |
| ✨ ScrambleButton | Custom button component with character-scramble effect on hover, built with a GSAP timeline |
| 🌗 Light / Dark Theme | CSS variable system (`data-theme`) with 6 semantic tokens, persisted in `localStorage`, zero flash on load via inline `<head>` script |
| 🌍 Manual i18n (ES/EN) | Zero-dependency translation system — flat key dictionary + `LanguageContext` with `useCallback` |
| 🖱️ Lenis Smooth Scroll | Integrated with GSAP ScrollTrigger for precise scroll-driven animations |
| ♾️ Infinite Carousel | Perfect loop via GSAP proxy + modulo math, zero visible cut frame |
| 📱 Mobile Responsive | Improved hamburger menu, hero repositioned to lower third, clamp-based fluid typography |
| 📬 Functional Contact Form | Express backend + Resend API on Render, 30s timeout with `AbortController` |
| ♿ Accessibility | `prefers-reduced-motion`, `aria-hidden` on carousel clones, proper heading hierarchy, optimal contrast |

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
Vite 5                   → Dev server, build, code splitting
TailwindCSS 3            → Utility-first styling
GSAP 3 + ScrollTrigger   → Animations, carousel, parallax
Lenis                    → Smooth scroll integrated with GSAP
React Icons              → SVG icons (FaGithub, SiReact, etc.)
```

### Backend

```
Node.js + Express        → POST /api/sendEmail endpoint
Resend API                → Transactional emails
Render                    → Hosting with cold start (~30s)
```

### Animations Breakdown

| Animation | Implementation |
|---|---|
| Hero | Staggered letters via `gsap.timeline`, image parallax with ScrollTrigger scrub |
| Preloader | Name fade-in with inline styles (theme-immune) + `preloader-active` navbar class |
| ScrambleButton | Left→right scramble on `mouseenter`, right→left restore on `mouseleave` |
| Scroll Reveal | `[data-reveal]` with `gsap.from` + ScrollTrigger across About, Achievements, Contact |
| Carousel | Proxy tween `0 → stride` with `onUpdate: x = -(val % stride)`, pause/play via ScrollTrigger |

---

## Project Structure

```
PortafolioWeb/
├── index.html                  # Anti-flash script + data-theme="dark" by default
├── src/
│   ├── assets/                 # Images (PNG, JPG, WebP, GIF)
│   ├── components/
│   │   ├── Layout.jsx          # Navbar, footer, scroll progress, theme, language
│   │   ├── Preloader.jsx       # GSAP animated intro (always dark)
│   │   └── ScrambleButton.jsx  # Button with character scramble effect
│   ├── context/
│   │   ├── ThemeContext.jsx    # data-theme toggle + localStorage
│   │   └── LanguageContext.jsx # t(), toggleLang(), localStorage
│   ├── hooks/
│   │   └── useScrollReveal.js
│   ├── pages/
│   │   ├── Home.jsx            # Hero parallax + GSAP stagger
│   │   ├── About.jsx           # Bio, stack, tools
│   │   ├── Projects.jsx        # Infinite GSAP carousel + iframe modal
│   │   ├── Achievements.jsx    # NASA modal, ICATECH, POAPs
│   │   └── Contact.jsx         # Form + validation + Resend
│   ├── translations.js         # ES/EN keys for the whole app
│   ├── App.jsx                 # Lazy loading + Suspense
│   ├── main.jsx                # ThemeProvider + LanguageProvider + Lenis
│   └── index.css               # CSS variables, light theme, mobile media queries
├── server/
│   ├── index.js
│   └── ENV_TEMPLATE.txt
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

`LanguageContext` exposes a memoized `t(key)` via `useCallback([lang])` and `toggleLang()` with persistence in `localStorage`. The toggle is visible in the desktop navbar and the mobile menu.

---

## Infinite Project Carousel

Perfect loop with no visible cut:

```js
// JSX: originals + clones (React manages both)
{PROJECTS.map((p, i) => renderCard(p, i, false))}
{PROJECTS.map((p, i) => renderCard(p, i, true))}

// Exact stride from offsetLeft (immune to CSS padding)
const stride = track.children[PROJECTS.length].offsetLeft
             - track.children[0].offsetLeft;

// Proxy + modulo: never renders the cut frame
const proxy = { val: 0 };
gsap.to(proxy, {
  val: stride, duration: 30, ease: 'none', repeat: -1,
  onUpdate() { gsap.set(track, { x: -(proxy.val % stride) }); },
});
```

The viewport uses `mask-image` to fade out the left and right edges.

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
| `npm run preview` | Serves the build locally |
| `npm run install:all` | Installs frontend + backend |

---

## Deployment

| Service | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Build: `npm run build` · Output: `dist` · No env vars required |
| Backend | Render | Root: `server` · Build: `npm install` · Start: `node index.js` |

**Backend environment variables:** `RESEND_API_KEY`, `EMAIL_FROM`, `PORT`

---

## License

```
MIT License
Copyright (c) 2026 CodeByNas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
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
