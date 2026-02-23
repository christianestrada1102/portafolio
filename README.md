# Christian Estrada — Portafolio Web

<div align="center">

![Portfolio](https://img.shields.io/badge/Portfolio-Christian_Estrada-purple?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4.0-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)
![GSAP](https://img.shields.io/badge/GSAP-3.x-88CE02?style=for-the-badge&logo=greensock)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js)

Portafolio web profesional construido con enfoque en UI/UX, animaciones avanzadas y rendimiento.

[Ver Demo](https://www.codebynas.dev/) · [Reportar Bug](https://github.com/christianestrada1102/portafolio/issues)

</div>

---

## Características destacadas

- **Animaciones GSAP** — entrada de letras staggered, parallax en hero, scroll-reveal en cada sección y carrusel infinito de proyectos con ScrollTrigger.
- **Preloader animado** — pantalla de introducción con GSAP que siempre usa tema oscuro, independiente del tema activo.
- **ScrambleButton** — botones con efecto scramble de caracteres al hacer hover, implementado con GSAP timeline.
- **Tema claro / oscuro** — sistema CSS variable (`data-theme`) con 6 variables semánticas, persistido en `localStorage` y sin flash de tema incorrecto al cargar gracias a un inline script en `<head>`.
- **i18n manual (ES / EN)** — sistema de traducciones sin librerías externas: `translations.js` con claves planas, `LanguageContext` con `useCallback` y persistencia en `localStorage`.
- **Scroll suave Lenis** — integrado con GSAP ScrollTrigger para animaciones precisas por scroll.
- **Carrusel infinito** — loop perfecto usando proxy GSAP + módulo matemático: `x = -(val % stride)`, sin frame de corte visible. Cards duplicadas en JSX para que React las gestione completamente.
- **Responsive mobile** — menú hamburguesa mejorado, hero reposicionado al tercio inferior, gradiente overlay, font-size clamp en móvil.
- **Formulario funcional** — backend Express + Resend API en Render, con timeout de 30 s y `AbortController`.
- **Barra de progreso de scroll** — en navbar con `transition: width 0.3s ease-out`.
- **Radio global** — variable CSS `--radius: 4px` aplicada a cards, modales, badges e inputs.
- **Accesibilidad** — `prefers-reduced-motion`, `aria-hidden` en clones del carrusel, jerarquía de headings y contraste óptimo.

---

## Preview

<video src="https://raw.githubusercontent.com/christianestrada1102/portafolio/main/public/preview.webm" controls muted loop playsinline style="max-width: 420px; border-radius: 8px;">
  Tu navegador no soporta video embebido.
</video>

---

## Tecnologías

### Frontend
| Tecnología | Uso |
|---|---|
| React 18 | UI, lazy loading, Suspense |
| Vite 5 | Dev server, build, code splitting |
| TailwindCSS 3 | Estilos utilitarios |
| GSAP 3 + ScrollTrigger | Animaciones, carrusel, parallax |
| Lenis | Smooth scroll integrado con GSAP |
| React Icons | Íconos SVG (FaGithub, SiReact, etc.) |

### Animaciones implementadas
- **Hero** — letras staggered con `gsap.timeline`, parallax de imagen con ScrollTrigger scrub
- **Preloader** — fade-in del nombre con inline styles (inmune al tema) + clase `preloader-active` para el navbar
- **ScrambleButton** — scramble left→right en `mouseenter`, restore right→left en `mouseleave`
- **Scroll reveal** — `[data-reveal]` con `gsap.from` + ScrollTrigger en About, Achievements y Contact
- **Carrusel** — proxy tween `0 → stride` con `onUpdate: x = -(val % stride)`, pausa/play con ScrollTrigger

### Backend
- **Node.js + Express** — endpoint `POST /api/sendEmail`
- **Resend API** — correos transaccionales
- **Render** — hosting con cold start (~30 s)

---

## Estructura del proyecto

```
PortafolioWeb/
├── index.html                  # Anti-flash script + data-theme="dark" por defecto
├── src/
│   ├── assets/                 # Imágenes (PNG, JPG, WebP, GIF)
│   ├── components/
│   │   ├── Layout.jsx          # Navbar, footer, scroll progress, tema, idioma
│   │   ├── Preloader.jsx       # Intro animada GSAP (siempre oscura)
│   │   └── ScrambleButton.jsx  # Botón con scramble de caracteres
│   ├── context/
│   │   ├── ThemeContext.jsx    # data-theme toggle + localStorage
│   │   └── LanguageContext.jsx # t(), toggleLang(), localStorage
│   ├── hooks/
│   │   └── useScrollReveal.js
│   ├── pages/
│   │   ├── Home.jsx            # Hero parallax + GSAP stagger
│   │   ├── About.jsx           # Bio, stack, herramientas
│   │   ├── Projects.jsx        # Carrusel GSAP infinito + modal iframe
│   │   ├── Achievements.jsx    # NASA modal, ICATECH, POAPs
│   │   └── Contact.jsx         # Formulario + validación + Resend
│   ├── translations.js         # Claves ES/EN para toda la app
│   ├── App.jsx                 # Lazy loading + Suspense
│   ├── main.jsx                # ThemeProvider + LanguageProvider + Lenis
│   └── index.css               # Variables CSS, tema claro, media queries móvil
├── server/
│   ├── index.js
│   └── ENV_TEMPLATE.txt
└── README.md
```

---

## Sistema de temas

Implementado con CSS custom properties y el atributo `data-theme` en `<html>`:

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

El anti-flash script en `<head>` aplica el tema guardado antes de que React monte:

```html
<script>(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
```

---

## Sistema i18n

Sin librerías externas. Archivo plano `src/translations.js`:

```js
export const translations = {
  es: { 'nav.home': 'Inicio', 'home.cta.projects': 'Ver proyectos', ... },
  en: { 'nav.home': 'Home',   'home.cta.projects': 'View projects', ... },
};
```

`LanguageContext` expone `t(key)` memoizado con `useCallback([lang])` y `toggleLang()` con persistencia en `localStorage`. Toggle visible en navbar desktop y menú móvil.

---

## Carrusel de proyectos

Loop infinito sin corte visible:

```js
// JSX: originals + clones (React gestiona ambos)
{PROJECTS.map((p, i) => renderCard(p, i, false))}
{PROJECTS.map((p, i) => renderCard(p, i, true))}

// Stride exacto desde offsetLeft (inmune al padding CSS)
const stride = track.children[PROJECTS.length].offsetLeft
             - track.children[0].offsetLeft;

// Proxy + módulo: nunca renderiza el frame de corte
const proxy = { val: 0 };
gsap.to(proxy, {
  val: stride, duration: 30, ease: 'none', repeat: -1,
  onUpdate() { gsap.set(track, { x: -(proxy.val % stride) }); },
});
```

El viewport usa `mask-image` para desvanecer los bordes izquierdo y derecho.

---

## Instalación

```bash
# Clonar
git clone https://github.com/christianestrada1102/portafolio.git
cd portafolio/PortafolioWeb

# Instalar dependencias frontend + backend
npm run install:all

# Dev server — http://localhost:3000
npm run dev

# Backend (otra terminal)
cd server && node index.js
```

### Variables de entorno — `server/.env`

```env
PORT=3001
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@tudominio.com
```

---

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Vite dev server (puerto 3000) |
| `npm run build` | Build de producción → `dist/` |
| `npm run preview` | Sirve el build localmente |
| `npm run install:all` | Instala frontend + backend |

---

## Despliegue

### Frontend → Vercel
- Build command: `npm run build`
- Output directory: `dist`
- No requiere variables de entorno

### Backend → Render
- Root directory: `server`
- Build: `npm install` · Start: `node index.js`
- Variables: `RESEND_API_KEY`, `EMAIL_FROM`, `PORT`

---

## Autor

**CodeByNas / Christian Estrada**
Chihuahua, México

[LinkedIn](https://www.linkedin.com/in/christian-estrada-a59130386/) · [GitHub](https://github.com/christianestrada1102) · [X](https://x.com/CodeByNAS) · [Instagram](https://www.instagram.com/christian_estrada1102)

---

CodeByNas © 2026
