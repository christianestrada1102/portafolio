# Christian Estrada – Portafolio Web

Portafolio profesional desarrollado con React + Vite y TailwindCSS. Incluye animaciones con Framer Motion, backend en Node/Express para el formulario de contacto y despliegue en Vercel (frontend) + Render (backend). El foco es UI/UX, accesibilidad y rendimiento.

## Demo
- Frontend: https://portafolio-seven-jota-56.vercel.app/
- Backend: https://christian-estrada-backend.onrender.com/

## Características
- SPA con navegación suave, dark mode persistente y scroll progresivo.
- Secciones: Inicio, Sobre mí, Logros (POAP + certificados), Proyectos, Contacto.
- Animaciones configuradas para respetar `prefers-reduced-motion`.
- Formulario de contacto con backend usando Resend API (antes Nodemailer).
- Optimización Lighthouse: lazy loading, code splitting, imágenes WebP/AVIF, robots.txt, metadatos completos.
- Accesibilidad: jerarquía de headings, aria-labels, contraste ajustado, animaciones degradables.

## Stack
- **Frontend**: React 18, Vite 5, TailwindCSS 3, Framer Motion, React Icons.
- **Backend**: Node.js, Express, Resend API, CORS, dotenv.
- **Infraestructura**: Vercel (frontend), Render (backend).

## Scripts
```bash
# Frontend
npm install
npm run dev       # http://localhost:3000
npm run build     # genera dist/
npm run preview

# Backend
cd server
npm install
npm run dev       # nodemon index.js
npm start         # producción
```

En Windows puedes usar `install-all.bat` y `run-dev.bat` para evitar restricciones de PowerShell.

## Variables de entorno (backend)
Crear `server/.env` basado en `server/ENV_TEMPLATE.txt`:
```
PORT=5000
RESEND_API_KEY=tu_api_key_de_resend
```

## Despliegue
- **Frontend (Vercel)**: conectar el repo, build `npm run build`, output `dist/`.
- **Backend (Render)**: raíz `server/`, build `npm install`, start `npm start`, variables de entorno configuradas.
- Después de desplegar el backend, la URL del formulario ya apunta a `https://christian-estrada-backend.onrender.com/api/sendEmail`.

Documentación adicional:
- `DESPLEGAR_PASO_A_PASO.md`, `DESPLEGAR_VERCEL.md` y `EMPEZAR_AQUI_VERCEL.txt` para Vercel.
- `PASOS_FINALES_CHRISTIAN.txt` y `CONFIGURAR_BACKEND_CHRISTIAN.txt` para Render y Resend.

## Accesibilidad y SEO
- Headings corregidos (`h1` único, h2/h3 subsecuentes).
- `prefers-reduced-motion` en animaciones y CSS global.
- `aria-label` y roles en botones, iconos y badges.
- Metadatos OG/Twitter, canonical y robots.txt.

## Autor
**Christian Estrada**  
Email: christianmanuel1233@gmail.com  
LinkedIn: https://www.linkedin.com/in/christian-estrada-a59130386/  
GitHub: https://github.com/christianestrada1102  
Twitter/X: https://x.com/CodeByNAS

MIT © 2025
