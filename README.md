# Christian Estrada — Web Portfolio

<div align="center">

![Portfolio](https://img.shields.io/badge/Portfolio-Christian_Estrada-purple?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4.0-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)
![GSAP](https://img.shields.io/badge/GSAP-3.x-88CE02?style=for-the-badge&logo=greensock)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

Professional web portfolio built with a focus on UI/UX, advanced animations, and performance.

[View Demo](https://www.codebynas.dev/) · [Report Bug](https://github.com/christianestrada1102/portafolio/issues)

</div>

---

## Key features

- **GSAP animations** — staggered letter entrance, hero parallax, scroll-reveal in every section, and an infinite project carousel powered by ScrollTrigger.
- **Animated preloader** — intro screen built with GSAP that always uses the dark theme, independent of the active theme.
- **ScrambleButton** — buttons with a character-scramble effect on hover, implemented with a GSAP timeline.
- **Light / dark theme** — CSS variable system (`data-theme`) with 6 semantic variables, persisted in `localStorage`, with no flash of the wrong theme on load thanks to an inline script in `<head>`.
- **Manual i18n (ES / EN)** — translation system with no external libraries: `translations.js` with flat keys, `LanguageContext` using `useCallback`, and persistence in `localStorage`.
- **Lenis smooth scroll** — integrated with GSAP ScrollTrigger for precise scroll-driven animations.
- **Infinite carousel** — perfect loop using a GSAP proxy + modulo math: `x = -(val % stride)`, with no visible cut frame. Cards are duplicated in JSX so React fully manages them.
- **Mobile responsive** — improved hamburger menu, hero repositioned to the lower third, gradient overlay, clamp-based font sizing on mobile.
- **Functional contact form** — Express backend + Resend API on Render, with a 30 s timeout and `AbortController`.
- **Scroll progress bar** — in the navbar with `transition: width 0.3s ease-out`.
- **Global radius** — `--radius: 4px` CSS variable applied to cards, modals, badges, and inputs.
- **Accessibility** — `prefers-reduced-motion`, `aria-hidden` on carousel clones, proper heading hierarchy, and optimal contrast.

---

## Preview

<video src="https://raw.githubusercontent.com/christianestrada1102/portafolio/main/public/preview.webm" controls muted loop playsinline style="max-width: 420px; border-radius: 8px;">
  Your browser does not support embedded video.
</video>

---

## Technologies

### Frontend
| Technology | Use |
|---|---|
| React 18 | UI, lazy loading, Suspense |
| Vite 5 | Dev server, build, code splitting |
| TailwindCSS 3 | Utility-first styling |
| GSAP 3 + ScrollTrigger | Animations, carousel, parallax |
| Lenis | Smooth scroll integrated with GSAP |
| React Icons | SVG icons (FaGithub, SiReact, etc.) |

### Implemented animations
- **Hero** — staggered letters with `gsap.timeline`, image parallax with ScrollTrigger scrub
- **Preloader** — name fade-in with inline styles (theme-immune) + `preloader-active` class for the navbar
- **ScrambleButton** — left→right scramble on `mouseenter`, right→left restore on `mouseleave`
- **Scroll reveal** — `[data-reveal]` with `gsap.from` + ScrollTrigger in About, Achievements, and Contact
- **Carousel** — proxy tween `0 → stride` with `onUpdate: x = -(val % stride)`, pause/play with ScrollTrigger

### Backend
- **Node.js + Express** — `POST /api/sendEmail` endpoint
- **Resend API** — transactional emails
- **Render** — hosting with cold start (~30 s)

---

## Project structure

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

## Theme system

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

## i18n system

No external libraries. Flat file `src/translations.js`:

```js
export const translations = {
  es: { 'nav.home': 'Inicio', 'home.cta.projects': 'Ver proyectos', ... },
  en: { 'nav.home': 'Home',   'home.cta.projects': 'View projects', ... },
};
```

`LanguageContext` exposes a memoized `t(key)` via `useCallback([lang])` and `toggleLang()` with persistence in `localStorage`. The toggle is visible in the desktop navbar and the mobile menu.

---

## Project carousel

Infinite loop with no visible cut:

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

### Environment variables — `server/.env`

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

### Frontend → Vercel
- Build command: `npm run build`
- Output directory: `dist`
- No environment variables required

### Backend → Render
- Root directory: `server`
- Build: `npm install` · Start: `node index.js`
- Variables: `RESEND_API_KEY`, `EMAIL_FROM`, `PORT`

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Author

**Christian Estrada**
Chihuahua, Mexico

[![LinkedIn](https://img.shields.io/badge/LinkedIn-000000?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/christian-estrada-a59130386/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/christianestrada1102)
[![X](https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/CodeByNAS)

---

CodeByNas © 2026
