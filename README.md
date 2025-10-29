# 🎨 Christian Estrada - Portfolio Web

<div align="center">

![Portfolio](https://img.shields.io/badge/Portfolio-Christian_Estrada-purple?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.2.0-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)

Portafolio web profesional y moderno diseñado con enfoque UI/UX y Design Thinking.

[Ver Demo](#) | [Reportar Bug](https://github.com/ChristianEstrada/portfolio/issues)

</div>

---

## ✨ Características

- 🎨 **Diseño Moderno**: Interfaz elegante con animaciones suaves usando Framer Motion
- 📱 **Totalmente Responsive**: Optimizado para todos los dispositivos
- ♿ **Accesible**: Cumple con las mejores prácticas de accesibilidad web
- 📧 **Formulario Funcional**: Sistema de contacto con backend en Node.js y Nodemailer
- ⚡ **Alto Rendimiento**: Construido con Vite para carga ultrarrápida
- 🎯 **SEO Optimizado**: Metadatos y estructura optimizada para motores de búsqueda

## 🚀 Tecnologías

### Frontend
- **React 18** - Librería de UI
- **Vite** - Build tool y dev server
- **TailwindCSS** - Framework de estilos
- **Framer Motion** - Animaciones fluidas
- **React Router** - Navegación SPA
- **React Icons** - Íconos modernos
- **Lucide React** - Íconos adicionales

### Backend
- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **Nodemailer** - Envío de emails
- **CORS** - Manejo de peticiones cross-origin
- **dotenv** - Variables de entorno

## 📦 Instalación Rápida

### Para Windows:

1. **Instalar todas las dependencias:**
   ```bash
   install-all.bat
   ```

2. **Configurar el email del servidor:**
   - Ve a `server/` y crea un archivo `.env`
   - Copia el contenido de `server/ENV_TEMPLATE.txt`
   - Configura tus credenciales de Gmail (ver instrucciones abajo)

3. **Iniciar el proyecto:**
   ```bash
   start-dev.bat
   ```

### Para Linux/Mac:

1. **Instalar dependencias:**
   ```bash
   npm run install:all
   ```

2. **Configurar variables de entorno:**
   ```bash
   cd server
   cp ENV_TEMPLATE.txt .env
   nano .env  # Edita con tus credenciales
   cd ..
   ```

3. **Iniciar Frontend:**
   ```bash
   npm run dev
   ```

4. **Iniciar Backend (en otra terminal):**
   ```bash
   npm run server
   ```

## 🔧 Configuración Detallada

### Configurar Gmail para Nodemailer

1. Ve a [myaccount.google.com/security](https://myaccount.google.com/security)
2. Activa la **"Verificación en dos pasos"**
3. Busca **"Contraseñas de aplicación"**
4. Genera una nueva contraseña para "Correo"
5. Copia la contraseña de 16 caracteres
6. Agrégala en `server/.env`:

```env
PORT=5000
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

> 📖 Para más detalles, lee el archivo `SETUP.md` o `server/README.md`

## 📂 Estructura del Proyecto

```
PortafolioWeb/
├── src/
│   ├── assets/           # Imágenes y recursos
│   ├── components/       # Componentes React
│   │   └── Layout.jsx    # Layout principal con Navbar
│   ├── pages/            # Páginas de la aplicación
│   │   ├── Home.jsx      # Página de inicio
│   │   ├── About.jsx     # Sobre mí
│   │   ├── Projects.jsx  # Proyectos
│   │   └── Contact.jsx   # Formulario de contacto
│   ├── App.jsx           # Componente raíz
│   ├── main.jsx          # Punto de entrada
│   └── index.css         # Estilos globales
├── server/
│   ├── index.js          # Servidor Express
│   ├── package.json      # Dependencias del backend
│   ├── README.md         # Documentación del backend
│   └── ENV_TEMPLATE.txt  # Template de variables de entorno
├── public/               # Archivos estáticos
├── index.html            # HTML principal
├── package.json          # Dependencias del frontend
├── tailwind.config.js    # Configuración de Tailwind
├── vite.config.js        # Configuración de Vite
├── SETUP.md              # Guía de configuración detallada
└── README.md             # Este archivo
```

## 🎨 Paleta de Colores

```css
--primary-400: #D056F1  /* Morado claro */
--primary-500: #BD41DE  /* Morado */
--primary-600: #A92BCB  /* Morado medio */
--primary-700: #9616B8  /* Morado oscuro */
--primary-800: #8200A5  /* Morado muy oscuro */
--background: #F9F9F9   /* Fondo claro */
```

## 📱 Páginas

1. **Inicio** - Presentación personal con foto y CTAs
2. **Sobre mí** - Biografía, tecnologías y herramientas
3. **Proyectos** - Showcase de proyectos con detalles
4. **Contacto** - Formulario funcional e información de contacto

## 🚀 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo (Frontend) |
| `npm run build` | Construye la aplicación para producción |
| `npm run preview` | Preview del build de producción |
| `npm run server` | Inicia el servidor backend |
| `npm run install:all` | Instala todas las dependencias (Frontend + Backend) |

## 🌐 Despliegue

### 🚀 Despliegue Rápido a Vercel

**¿Quieres desplegar AHORA?** Lee estos archivos en orden:

1. 📄 **`EMPEZAR_AQUI_VERCEL.txt`** - Resumen ejecutivo
2. ✅ **`DESPLEGAR_PASO_A_PASO.md`** - Guía completa con checklist
3. 📖 **`DESPLEGAR_VERCEL.md`** - Documentación técnica detallada

**Script automático:**
```bash
QUICK_DEPLOY.bat  # Prepara tu proyecto para Vercel
```

### Frontend (Vercel) ⚡

1. Sube tu código a GitHub
2. Ve a [vercel.com](https://vercel.com) y conecta tu repo
3. Vercel detectará automáticamente Vite
4. Click en "Deploy"
5. ¡Listo en 2 minutos! 🎉

**Configuración automática:**
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

### Backend (Render) 🔧

1. Ve a [render.com](https://render.com)
2. Crea un "Web Service"
3. Root Directory: `server`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Variables de entorno:
   - `EMAIL_USER`: tu-email@gmail.com
   - `EMAIL_PASS`: contraseña-de-aplicación
   - `PORT`: 5000

### Actualizar URL del Backend

Después de desplegar el backend, actualiza `src/pages/Contact.jsx` (línea ~51):

```javascript
// Cambiar de:
const response = await fetch('http://localhost:5000/api/sendEmail', {

// A:
const response = await fetch('https://tu-backend.onrender.com/api/sendEmail', {
```

Luego sube los cambios:
```bash
git add .
git commit -m "Update backend URL"
git push origin main
```

Vercel redesplegrá automáticamente. ✨

## 🐛 Solución de Problemas

### Las imágenes no se muestran
- Asegúrate de que las imágenes estén en `src/assets/`
- Verifica las rutas de importación

### El formulario no funciona
- Verifica que el backend esté ejecutándose
- Revisa el archivo `.env` en `server/`
- Comprueba la consola para errores de CORS

### Errores de instalación
- Asegúrate de tener Node.js versión 16 o superior
- Elimina `node_modules` y vuelve a instalar

## 📚 Documentación Adicional

- [SETUP.md](SETUP.md) - Guía de configuración paso a paso
- [server/README.md](server/README.md) - Documentación del backend
- [server/ENV_TEMPLATE.txt](server/ENV_TEMPLATE.txt) - Template de variables de entorno

## 👨‍💻 Autor

**Christian Estrada**
- Email: christianmanuel1233@gmail.com
- LinkedIn: [christian-estrada](https://www.linkedin.com/in/christian-estrada)
- GitHub: [ChristianEstrada](https://github.com/ChristianEstrada)
- Twitter: [@ChristianEstrad_](https://twitter.com/ChristianEstrad_)

## 📄 Licencia

© 2025 Christian Estrada. Todos los derechos reservados.

---

<div align="center">
  <p>Hecho en Chihuahua, México</p>
  <p>UTCH - Universidad Tecnológica de Chihuahua</p>
</div>

