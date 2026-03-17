# 📋 Contexto Completo del Proyecto - Portafolio Web de Christian Estrada

## 🎯 Descripción General

Portafolio web profesional y moderno construido con React, Vite y TailwindCSS. El proyecto está enfocado en UI/UX, accesibilidad y rendimiento. Incluye un backend en Express para el formulario de contacto usando Resend API.

**URL de producción:** https://portafolio-seven-jota-56.vercel.app/

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
PortafolioWeb/
├── public/                 # Archivos estáticos
├── src/
│   ├── assets/             # Imágenes y media (WebP/AVIF/GIF)
│   ├── components/         # Componentes reutilizables
│   │   ├── Layout.jsx      # Layout principal con Navbar y Footer
│   │   ├── TiltCard.jsx    # Componente de tarjeta 3D con efecto tilt
│   │   └── TypingText.jsx  # Componente de texto con efecto de tipeo
│   ├── context/            # Contexto de tema (light/dark)
│   │   └── ThemeContext.jsx
│   ├── hooks/              # Hooks personalizados
│   │   └── useInView.js    # Hook para detectar elementos en viewport
│   ├── pages/              # Secciones principales
│   │   ├── Home.jsx        # Sección Hero/Inicio
│   │   ├── About.jsx       # Sobre mí, tecnologías y herramientas
│   │   ├── Achievements.jsx # POAPs y certificados
│   │   ├── Projects.jsx    # Proyectos con cards 3D
│   │   └── Contact.jsx     # Formulario de contacto
│   ├── App.jsx             # Componente principal con lazy loading
│   ├── main.jsx            # Punto de entrada
│   └── index.css           # Estilos globales (Tailwind + ajustes)
├── server/                 # Backend (Express + Resend)
│   ├── index.js
│   └── package.json
├── vercel.json             # Configuración de despliegue Vercel
├── vite.config.js          # Configuración de Vite
├── tailwind.config.js      # Configuración de TailwindCSS
└── package.json            # Dependencias del proyecto
```

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 18.3.1** - Librería de UI
- **Vite 5.2.0** - Dev server & build tool
- **TailwindCSS 3.4.1** - Estilos utilitarios
- **Framer Motion 11.0.8** - Animaciones fluidas
- **React Icons 5.0.1** - Íconos SVG accesibles
- **React Router DOM 6.22.3** - Navegación (SPA)
- **Lucide React 0.344.0** - Íconos adicionales

### Backend
- **Node.js + Express 4.18.3** - API REST
- **Resend API 3.0.0** - Envío de correos transaccionales
- **CORS 2.8.5** - Configuración CORS
- **dotenv 16.4.5** - Variables de entorno

### Infraestructura
- **Vercel** - Frontend (producción)
- **Render** - Backend (producción)
- **GitHub** - Control de versiones

---

## 🎨 Diseño y Estilos

### Paleta de Colores

```css
--primary-400: #D056F1;  /* Morado claro */
--primary-500: #BD41DE;  /* Morado medio */
--primary-600: #A92BCB;  /* Morado vibrante */
--primary-700: #9616B8;  /* Morado profundo */
--primary-800: #8200A5;  /* Morado oscuro */
--background: #F9F9F9;   /* Fondo claro */
--background-dark: #111827; /* Fondo dark mode */
```

### Tipografía
- **Fuentes principales:** Poppins, Inter
- **Fallback:** system-ui, sans-serif

### Características de Diseño
- ✅ Modo oscuro/claro persistente (localStorage)
- ✅ Diseño responsive (mobile-first)
- ✅ Animaciones suaves con Framer Motion
- ✅ Respeto a `prefers-reduced-motion`
- ✅ Gradientes morados en elementos destacados
- ✅ Efectos de hover y transiciones suaves
- ✅ Cards con efecto 3D tilt (TiltCard)

---

## 📄 Secciones Principales

### 1. **Home (Inicio)**
- Hero section con imagen de perfil
- Animación de texto con efecto typing
- Botones CTA (Ver proyectos, Contactarme)
- Indicador de scroll animado
- Fondos animados con blur

**Componentes utilizados:**
- `TypingText` - Efecto de tipeo
- `motion.div` - Animaciones de entrada
- Imagen optimizada con WebP

### 2. **About (Sobre mí)**
- Información personal y trayectoria
- Grid de tecnologías (C#, C++, React, Node.js, HTML5, CSS3)
- Barras de progreso animadas para herramientas/IDEs
- Información de estudiante UTCH
- Números animados (AnimatedNumber)

**Características:**
- Animaciones escalonadas (stagger)
- Hover effects en tecnologías
- Barras de progreso con animación de llenado

### 3. **Achievements (Logros)**
- Certificado destacado de NASA Space Apps Challenge
- Lista de certificados ICATECH (5 certificados, 80 horas totales)
- Grid de POAPs (5 POAPs de hackathons)
- Modal para ampliar certificado NASA
- Link al perfil completo de POAP.xyz

**POAPs incluidos:**
1. Ethereum Mexico 2025 - Sponsor (etherfuse)
2. Ethereum Mexico 2025 - Sponsor (base)
3. Ethereum Mexico 2025 - Sponsor (ens)
4. University Blockchain Day
5. EthMexico MTY 2025

**Características:**
- Modal con AnimatePresence
- Efectos "breathing" en certificados
- Click para ampliar certificado NASA
- Badges de categoría

### 4. **Projects (Proyectos)**
- Grid de proyectos con cards 3D tilt
- Estados: Terminado, En desarrollo, Próximamente
- Badges de estado con íconos
- Tecnologías utilizadas
- Links a demo y GitHub

**Proyectos incluidos:**
1. **SettArb** - Plataforma Web3 (Terminado)
   - Tech: Web3, Arbitrum, Solidity, TypeScript, React, Next.js
   - Links: Demo y GitHub disponibles

2. **Alera** - Plataforma de salud (Próximamente)
   - Descripción de funcionalidad

3. **Astro Yuyin** - App educativa (En desarrollo)
   - Tech: Unity, C#
   - Proyecto del hackathon NASA

4. **SafeZone** - App de seguridad (En desarrollo)
   - Tech: React Native, Expo, Django, PostgreSQL

5. **Portafolio Web** - Este mismo sitio (Terminado)
   - Tech: React, Vite, TailwindCSS, Framer Motion

**Características:**
- Cards con efecto 3D tilt (TiltCard)
- Imágenes optimizadas WebP
- Badges de estado con colores
- Sección de objetivo destacada
- CTA al final para contactar

### 5. **Contact (Contacto)**
- Formulario funcional con validación
- Información de contacto (email, teléfono, ubicación)
- Links a redes sociales (LinkedIn, GitHub, Twitter, Instagram)
- Manejo de estados (loading, success, error, timeout)
- Integración con backend en Render

**Características:**
- Timeout de 30 segundos para cold start
- Mensajes informativos de estado
- Diseño responsive en dos columnas
- Validación de campos requeridos

---

## 🧩 Componentes Personalizados

### 1. **Layout.jsx**
Componente principal que envuelve toda la aplicación.

**Características:**
- Navbar fija con backdrop blur
- Detección de sección activa con scroll
- Barra de progreso de scroll
- Menú móvil con animaciones
- Toggle de tema (claro/oscuro)
- Footer simple

**Funcionalidades:**
- Scroll suave a secciones
- Indicador visual de sección activa
- Menú hamburguesa responsive
- Persistencia de tema en localStorage

### 2. **TiltCard.jsx**
Componente que aplica efecto 3D tilt a las tarjetas.

**Características:**
- Efecto de rotación 3D al mover el mouse
- Usa `useMotionValue`, `useSpring`, `useTransform`
- Respeta `prefers-reduced-motion`
- Transformación preserve-3d

### 3. **TypingText.jsx**
Componente que muestra texto con efecto de tipeo.

**Características:**
- Velocidad configurable
- Delay inicial configurable
- Cursor parpadeante
- Respeta `prefers-reduced-motion` (muestra texto completo)

### 4. **useInView Hook**
Hook personalizado para detectar cuando un elemento entra en el viewport.

**Características:**
- Usa Intersection Observer API
- Threshold configurable
- Estado `hasBeenInView` para animaciones que solo se ejecutan una vez

---

## 🎭 Sistema de Tema

### ThemeContext.jsx
- Detecta preferencia del sistema (`prefers-color-scheme`)
- Guarda preferencia en localStorage
- Aplica clase `dark` a html, body y root
- Toggle manual disponible

**Implementación:**
- Clase `dark` en elementos principales
- TailwindCSS con `darkMode: 'class'`
- Transiciones suaves entre temas

---

## 🚀 Optimizaciones de Rendimiento

### Code Splitting
- Lazy loading de todas las páginas (excepto Home)
- Prefetching inteligente con `requestIdleCallback`
- Chunks separados para vendor y motion

### Imágenes
- Soporte WebP y AVIF
- Lazy loading con `loading="lazy"`
- `decoding="async"`
- `fetchpriority="high"` en imagen principal
- Uso de `<picture>` para múltiples formatos

### Animaciones
- Respeto a `prefers-reduced-motion`
- Animaciones optimizadas con Framer Motion
- Uso de `will-change` implícito en Framer Motion

---

## 🔧 Configuración

### vite.config.js
```javascript
- Plugin React
- Plugin imagetools para optimización de imágenes
- Puerto 3000 en desarrollo
- Code splitting manual (vendor, motion)
```

### tailwind.config.js
```javascript
- Dark mode: class
- Colores personalizados (primary scale)
- Fuentes personalizadas (Poppins, Inter)
```

### vercel.json
```json
- Build command: npm run build
- Output: dist/
- Framework: vite
- Rewrites para SPA
```

---

## 📧 Backend (Express + Resend)

### Endpoint: `/api/sendEmail`
**Método:** POST

**Body:**
```json
{
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Mensaje enviado correctamente",
  "data": {...}
}
```

**Características:**
- Validación de campos requeridos
- Email HTML formateado con estilos
- Manejo de errores
- CORS configurado
- Variables de entorno (RESEND_API_KEY, EMAIL_FROM, PORT)

**URL de producción:** https://christian-estrada-backend.onrender.com/api/sendEmail

---

## ♿ Accesibilidad

### Implementaciones
- ✅ `aria-label` en botones e íconos
- ✅ `aria-live` en mensajes de estado
- ✅ `role` en elementos semánticos
- ✅ `sr-only` para texto solo para lectores de pantalla
- ✅ Respeto a `prefers-reduced-motion`
- ✅ Contraste adecuado en colores
- ✅ Navegación por teclado funcional
- ✅ Headings semánticos (h1, h2, h3)

---

## 📱 Responsive Design

### Breakpoints (TailwindCSS)
- `sm:` 640px
- `md:` 768px
- `lg:` 1024px
- `xl:` 1280px

### Adaptaciones
- Navbar: Menú hamburguesa en móvil
- Grids: 1 columna en móvil, múltiples en desktop
- Tipografía: Escala según tamaño de pantalla
- Espaciado: Ajustes responsive en padding/margin
- Formulario: Stack vertical en móvil, dos columnas en desktop

---

## 🎯 Funcionalidades Clave

### Navegación
- Scroll suave entre secciones
- Detección automática de sección activa
- Barra de progreso de scroll
- Menú móvil con animaciones

### Animaciones
- Entrada de elementos con fade + translate
- Hover effects en cards y botones
- Efecto typing en texto
- Efecto 3D tilt en proyectos
- Animaciones escalonadas (stagger)

### Formulario de Contacto
- Validación en cliente
- Estados de carga
- Manejo de errores
- Timeout para cold start de Render
- Mensajes informativos

### Tema
- Toggle manual
- Persistencia en localStorage
- Detección de preferencia del sistema
- Transiciones suaves

---

## 📊 Datos del Proyecto

### Información Personal
- **Nombre:** Christian Estrada
- **Ubicación:** Chihuahua, Chihuahua, México
- **Email:** christianmanuel1233@gmail.com
- **Teléfono:** +52 614 107 0683
- **Estudiante:** UTCH - Desarrollo de Software (Tercer Cuatrimestre)

### Redes Sociales
- LinkedIn: https://www.linkedin.com/in/christian-estrada-a59130386/
- GitHub: https://github.com/christianestrada1102
- Twitter/X: https://x.com/CodeByNAS
- Instagram: https://www.instagram.com/christian_estrada1102

### POAP Profile
- URL: https://collectors.poap.xyz/scan/christianmanuel1233@gmail.com

---

## 🔄 Flujo de Datos

### Frontend → Backend
1. Usuario completa formulario
2. Validación en cliente
3. POST a `/api/sendEmail`
4. Backend valida y envía email con Resend
5. Respuesta al frontend
6. Actualización de UI según resultado

### Estado de la Aplicación
- Tema: Context API (ThemeContext)
- Formulario: useState local
- Sección activa: useState en Layout
- Animaciones: Framer Motion (sin estado global)

---

## 🐛 Consideraciones Especiales

### Cold Start de Render
- El backend gratuito puede "dormir" después de inactividad
- Timeout de 30 segundos implementado
- Mensaje informativo al usuario
- Se sugiere reintentar después de unos segundos

### Imágenes
- Todas las imágenes están en `src/assets/`
- Formato WebP preferido
- Fallback a formato original
- Lazy loading implementado

### Navegación
- SPA (Single Page Application)
- No usa React Router para navegación interna (solo scroll)
- IDs de sección: `inicio`, `sobre-mi`, `logros`, `proyectos`, `contacto`

---

## 📝 Scripts Disponibles

```bash
npm run dev          # Inicia Vite en desarrollo (puerto 3000)
npm run build        # Genera build de producción
npm run preview      # Sirve el build localmente
npm run server       # Ejecuta backend desde raíz
npm run install:all  # Instala dependencias frontend + backend
```

---

## 🌐 URLs de Producción

- **Frontend:** https://portafolio-seven-jota-56.vercel.app/
- **Backend:** https://christian-estrada-backend.onrender.com/api/sendEmail
- **GitHub:** https://github.com/christianestrada1102/portafolio

---

## 🎨 Mejoras Potenciales para UX/UI

### Áreas de Oportunidad Identificadas
1. **Microinteracciones:** Más feedback visual en interacciones
2. **Loading States:** Skeleton screens en lugar de spinners simples
3. **Transiciones:** Transiciones más fluidas entre secciones
4. **Accesibilidad:** Mejorar contraste en algunos elementos
5. **Performance:** Implementar Service Worker para offline
6. **Animaciones:** Más variedad en animaciones de entrada
7. **Formulario:** Mejor validación en tiempo real
8. **Navegación:** Breadcrumbs o indicador de progreso más visible
9. **Responsive:** Mejoras en experiencia móvil
10. **SEO:** Meta tags más completos y Open Graph optimizado

---

## 📚 Dependencias Principales

### Producción
- react: ^18.3.1
- react-dom: ^18.3.1
- framer-motion: ^11.0.8
- react-router-dom: ^6.22.3
- react-icons: ^5.0.1
- lucide-react: ^0.344.0

### Desarrollo
- vite: ^5.2.0
- @vitejs/plugin-react: ^4.2.1
- tailwindcss: ^3.4.1
- autoprefixer: ^10.4.18
- postcss: ^8.4.38
- vite-imagetools: ^9.0.0

---

## 🔐 Variables de Entorno (Backend)

```env
PORT=5000
RESEND_API_KEY=tu_api_key_de_resend
EMAIL_FROM=tu_correo_remitente
```

---

## 📖 Notas Adicionales

- El proyecto usa convenciones de nombres en español para IDs y algunos textos
- Los componentes están bien documentados con comentarios
- El código sigue buenas prácticas de React (hooks, context, lazy loading)
- Las animaciones están optimizadas para rendimiento
- El diseño es moderno y profesional, enfocado en mostrar el trabajo del desarrollador

---

**Última actualización:** Febrero 2025  
**Versión:** 1.0.0  
**Licencia:** MIT
