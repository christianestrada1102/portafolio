# 🎨 Christian Estrada - Portafolio Web

<div align="center">

![Portfolio](https://img.shields.io/badge/Portfolio-Christian_Estrada-purple?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4.0-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.0-0055FF?style=for-the-badge&logo=framer)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js)

Portafolio web profesional y moderno construido con enfoque UI/UX, accesibilidad y rendimiento.

[Ver Demo](https://portafolio-seven-jota-56.vercel.app/) · [Reportar Bug](https://github.com/christianestrada1102/portafolio/issues)

</div>

---

## ✨ Características destacadas

- 🎨 **Diseño moderno** con animaciones suaves (Framer Motion) y modo oscuro persistente.
- 📱 **Responsive total**: experiencia consistente en desktop, tablet y smartphone.
- ♿ **Accesibilidad cuidada**: `prefers-reduced-motion`, jerarquía de headings, aria-labels y contraste óptimo.
- ⚡ **Alto rendimiento**: Vite, code-splitting, lazy loading e imágenes WebP/AVIF.
- 📨 **Contacto funcional**: backend en Express + Resend API desplegado en Render.
- 🧭 **Navegación fluida**: SPA con scroll suave, navbar inteligente y barra de progreso.
- 🧩 **Contenido dinámico**: sección de POAPs, certificados, proyectos y logros con animaciones interactivas.

## 🎥 Preview

<video src="./src/assets/preview.webm" controls muted loop playsinline style="max-width: 420px; border-radius: 16px; box-shadow: 0 20px 45px rgba(89, 0, 188, 0.25);">
  Tu navegador no soporta la reproducción de video embebido.
</video>

---

## ♻️ Guía de reutilización rápida

1. **Clona este repositorio** y ejecuta `npm install` en la raíz (usa `install-all.bat` si estás en Windows).
2. Personaliza la información de las secciones en `src/pages/` (`Home.jsx`, `About.jsx`, `Projects.jsx`, etc.).
3. Reemplaza imágenes dentro de `src/assets/`. Aprovecha el `<picture>` y el soporte WebP/AVIF para mantener el rendimiento.
4. Ajusta las certificaciones/POAPs en `src/pages/Achievements.jsx` y los proyectos en `src/pages/Projects.jsx`.
5. Para el backend, duplica la carpeta `server/`, cambia el remitente en `server/index.js` y configura tu API key en `server/.env`.
6. Despliega usando la guía de la sección **☁️ Despliegue** (Vercel + Render) y actualiza URLs si apuntas a tus propios servicios.

> El código está modularizado y documentado; puedes extraer componentes de `src/components/` (Navbar, Layout, TiltCard, TypingText) para usarlos en otros proyectos.

---

## 🚀 Tecnologías

### Frontend
- **React 18** · Librería de UI
- **Vite 5** · Dev server & build tool
- **TailwindCSS 3** · Estilos utilitarios
- **Framer Motion 11** · Animaciones fluidas
- **React Icons** · Íconos SVG accesibles
- **Intersection Observer & hooks propios** · Animaciones por scroll

### Backend
- **Node.js + Express** · API REST para el formulario
- **Resend API** · Envío de correos transaccionales
- **CORS + dotenv** · Seguridad y configuración

### Infraestructura
- **Vercel** · Frontend
- **Render** · Backend
- **GitHub Actions** (opcional) · Integración continua

---

## 📦 Instalación rápida

### Windows
```bash
install-all.bat   # Instala dependencias frontend + backend
run-dev.bat       # Arranca Vite y el backend desde CMD
```

### macOS / Linux
```bash
npm install
npm run install:all   # (opcional si quieres instalar backend también)

# Frontend
npm run dev            # http://localhost:3000

# Backend (nueva terminal)
cd server
npm install
npm run dev            # nodemon / node index.js
```

---

## 🔐 Variables de entorno (backend)

Crear `server/.env` basado en `server/ENV_TEMPLATE.txt`:

```env
PORT=5000
RESEND_API_KEY=tu_api_key_de_resend
EMAIL_FROM=tu_correo_remitente
```

> Puedes generar la API key en [resend.com](https://resend.com). El formulario ya está configurado para usar Render en producción.

---

## 🧱 Estructura del proyecto

```
PortafolioWeb/
├── public/                 # Archivos estáticos
├── src/
│   ├── assets/             # Imágenes y media (WebP/AVIF/GIF)
│   ├── components/         # Componentes reutilizables (Layout, Navbar, etc.)
│   ├── context/            # Contexto de tema (light/dark)
│   ├── hooks/              # Hooks personalizados (useInView, etc.)
│   ├── pages/              # Secciones: Home, About, Achievements, Projects, Contact
│   ├── App.jsx             # Configura lazy loading de páginas
│   └── index.css           # Estilos globales (Tailwind + ajustes)
├── server/                 # Backend (Express + Resend)
│   ├── index.js
│   ├── package.json
│   └── ENV_TEMPLATE.txt
├── DESPLEGAR_PASO_A_PASO.md
├── DESPLEGAR_VERCEL.md
└── README.md               # Este archivo
```

---

## 🎨 Paleta principal

```css
--primary-400: #D056F1;  /* Morado claro */
--primary-500: #BD41DE;  /* Morado medio */
--primary-600: #A92BCB;  /* Morado vibrante */
--primary-700: #9616B8;  /* Morado profundo */
--primary-800: #8200A5;  /* Morado oscuro */
--background: #F9F9F9;   /* Fondo claro */
--background-dark: #111827; /* Fondo dark mode */
```

---

## 📄 Secciones principales

1. **Inicio** — Hero con animaciones, CTA y efecto de tipeo.
2. **Sobre mí** — Trayectoria, tecnologías, barras de progreso y métricas animadas.
3. **Logros** — POAPs, certificados (NASA + ICATECH) con modal y efectos “breathing”.
4. **Proyectos** — Cards 3D tilt, descripciones, objetivos y enlaces a demo/GitHub.
5. **Contacto** — Formulario funcional con manejo de estados (timeout, cold start, error).

---

## 🛠 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia Vite en modo desarrollo |
| `npm run build` | Genera la versión de producción (`dist/`) |
| `npm run preview` | Sirve el build localmente |
| `npm run server` | Ejecuta backend Express desde la raíz |
| `npm run install:all` | Instala dependencias frontend + backend |

---

## ☁️ Despliegue

### Frontend (Vercel)
1. Conecta el repo en [vercel.com](https://vercel.com).
2. Build command: `npm run build`.
3. Output: `dist/`.
4. Variables: no necesarias (usa las del backend).

### Backend (Render)
1. Servicio web apuntando a `server/`.
2. Build command: `npm install`.
3. Start command: `npm start`.
4. Configura `RESEND_API_KEY`, `EMAIL_FROM` y `PORT`.

> La app frontend ya apunta a `https://christian-estrada-backend.onrender.com/api/sendEmail`. Al redesplegar el backend no necesitas cambiar el frontend.

---

## 🧰 Troubleshooting

- **El formulario tarda en responder**: Render en free tier puede “dormir” el servicio; se agregó timeout con mensaje informativo.
- **Imágenes no cargan**: verifica que los assets estén en `src/assets` y que las importaciones usen la extensión correcta (`?format=webp&imagetools` cuando aplique).
- **PowerShell bloquea scripts**: usa los `.bat` incluidos (`run-dev.bat`, `install-all.bat`) para evitar restricciones.
- **Scroll móvil salta**: la navbar compensa la altura con un cálculo dinámico; revisa `src/components/Layout.jsx`.

---

## 📚 Documentación adicional

- `DESPLEGAR_PASO_A_PASO.md` — Checklist completo para Vercel + Render.
- `DESPLEGAR_VERCEL.md` — Guía técnica detallada de despliegue.
- `CONFIGURAR_BACKEND_CHRISTIAN.txt` — Ajustes de Resend y Render.
- `PASOS_FINALES_CHRISTIAN.txt` — Tareas finales antes de compartir el portafolio.

---

## 👤 Autor

**Christian Estrada**  
📍 Chihuahua, México  
✉️ christianmanuel1233@gmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/christian-estrada-a59130386/) · [GitHub](https://github.com/christianestrada1102) · [X / Twitter](https://x.com/CodeByNAS)

---

MIT © 2025 · Hecho con React y café ☕
