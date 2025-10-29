# 🚀 Guía para Desplegar en Vercel

## 📋 Requisitos Previos

- [x] Cuenta de GitHub (crea una en github.com si no tienes)
- [x] Cuenta de Vercel (crea una en vercel.com - puedes usar tu cuenta de GitHub)
- [x] Git instalado en tu computadora
- [x] Tu portafolio funcionando localmente

---

## 🎯 OPCIÓN 1: Desplegar desde GitHub (Recomendado)

### Paso 1: Crear Repositorio en GitHub

1. Ve a [github.com](https://github.com) e inicia sesión
2. Haz clic en el botón **"New"** (nuevo repositorio)
3. Configura tu repositorio:
   - **Repository name:** `portfolio` o `christian-estrada-portfolio`
   - **Description:** Portfolio web profesional de Christian Estrada
   - **Public** o **Private** (tu elección)
   - **NO** marques "Initialize with README"
4. Haz clic en **"Create repository"**

### Paso 2: Subir tu Código a GitHub

Abre PowerShell en la carpeta de tu portafolio y ejecuta:

```bash
# Inicializar Git (si no lo has hecho)
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit - Portfolio profesional"

# Conectar con tu repositorio de GitHub
# (Reemplaza TU-USUARIO con tu nombre de usuario de GitHub)
git remote add origin https://github.com/TU-USUARIO/portfolio.git

# Si tu rama se llama 'master', cámbiala a 'main'
git branch -M main

# Subir el código
git push -u origin main
```

**📝 Ejemplo real:**
```bash
git remote add origin https://github.com/ChristianEstrada/portfolio.git
git branch -M main
git push -u origin main
```

### Paso 3: Desplegar en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en **"Sign Up"** o **"Login"**
3. Selecciona **"Continue with GitHub"**
4. Haz clic en **"Import Project"** o **"Add New..."** → **"Project"**
5. Selecciona tu repositorio `portfolio` de la lista
6. Vercel detectará automáticamente que es un proyecto Vite
7. Configura las opciones (debería detectarlas automáticamente):
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
8. Haz clic en **"Deploy"**
9. ¡Espera 1-2 minutos y listo! 🎉

Tu portafolio estará disponible en: `https://portfolio-tu-usuario.vercel.app`

---

## 🎯 OPCIÓN 2: Desplegar desde CLI de Vercel

### Paso 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Paso 2: Login en Vercel

```bash
vercel login
```

Sigue las instrucciones en pantalla.

### Paso 3: Desplegar

En la carpeta de tu portafolio, ejecuta:

```bash
vercel
```

Responde las preguntas:
- **Set up and deploy?** → Yes
- **Which scope?** → Tu cuenta personal
- **Link to existing project?** → No
- **What's your project's name?** → christian-estrada-portfolio
- **In which directory is your code located?** → ./ (presiona Enter)
- **Want to override the settings?** → No

¡Listo! Vercel te dará una URL donde está desplegado.

Para desplegar actualizaciones futuras:
```bash
vercel --prod
```

---

## ⚠️ IMPORTANTE: Backend (Formulario de Contacto)

El frontend se desplegará en Vercel, pero el **backend necesita desplegarse por separado**.

### Opciones para el Backend:

#### 🔸 Opción A: Render (Recomendado - Gratis)

1. Ve a [render.com](https://render.com)
2. Crea una cuenta
3. Haz clic en **"New +"** → **"Web Service"**
4. Conecta tu repositorio de GitHub
5. Configura:
   - **Name:** christian-estrada-backend
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. En **Environment Variables**, agrega:
   - `EMAIL_USER`: tu-email@gmail.com
   - `EMAIL_PASS`: tu-contraseña-de-aplicación
   - `PORT`: 5000
7. Haz clic en **"Create Web Service"**

Render te dará una URL como: `https://christian-estrada-backend.onrender.com`

#### 🔸 Opción B: Railway

1. Ve a [railway.app](https://railway.app)
2. Haz clic en **"Start a New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Elige tu repositorio
5. En Settings:
   - **Root Directory:** `server`
   - **Start Command:** `npm start`
6. En Variables, agrega:
   - `EMAIL_USER`
   - `EMAIL_PASS`
7. Railway generará una URL automáticamente

### Actualizar URL del Backend en tu Frontend

Una vez que tengas la URL de tu backend, actualiza el archivo:

```javascript
// src/pages/Contact.jsx (línea ~51)

// CAMBIAR ESTO:
const response = await fetch('http://localhost:5000/api/sendEmail', {

// POR ESTO:
const response = await fetch('https://tu-backend.onrender.com/api/sendEmail', {
```

Luego, vuelve a desplegar:
```bash
git add .
git commit -m "Update backend URL"
git push origin main
```

Vercel lo redesplegrá automáticamente.

---

## 🔧 Configuración Avanzada (Opcional)

### Agregar Dominio Personalizado

1. Ve a tu proyecto en Vercel
2. Settings → Domains
3. Agrega tu dominio personalizado
4. Sigue las instrucciones para configurar el DNS

### Variables de Entorno en Vercel

Si necesitas variables de entorno en el frontend:

1. Ve a Settings → Environment Variables
2. Agrega las variables necesarias
3. Redespliega el proyecto

---

## 📊 Estructura Final

```
Tu Portfolio
├── Frontend en Vercel
│   └── https://portfolio-christian.vercel.app
│
└── Backend en Render/Railway
    └── https://christian-backend.onrender.com
```

---

## ✅ Checklist de Despliegue

### Antes de Desplegar
- [ ] El proyecto funciona localmente
- [ ] Has ejecutado `npm run build` sin errores
- [ ] Todas las imágenes están en `src/assets/`
- [ ] No hay console.logs innecesarios

### Frontend (Vercel)
- [ ] Cuenta de Vercel creada
- [ ] Código subido a GitHub
- [ ] Proyecto importado en Vercel
- [ ] Despliegue exitoso
- [ ] URL funcional

### Backend (Render/Railway)
- [ ] Backend desplegado
- [ ] Variables de entorno configuradas
- [ ] URL del backend obtenida
- [ ] URL actualizada en Contact.jsx
- [ ] Frontend redespllegado con nueva URL

### Testing Final
- [ ] Página de inicio carga
- [ ] Todas las páginas funcionan
- [ ] Imágenes se muestran correctamente
- [ ] Formulario de contacto funciona
- [ ] Email se recibe correctamente

---

## 🎉 URLs Ejemplo

Después del despliegue, tendrás:

- **Frontend:** https://christian-estrada.vercel.app
- **Backend:** https://christian-estrada-api.onrender.com

---

## 🆘 Solución de Problemas

### Error: "Build failed"
- Verifica que `package.json` esté en la raíz
- Asegúrate de que no hay errores en el código
- Revisa los logs de Vercel

### Las imágenes no se muestran
- Verifica que estén en `src/assets/`
- Las rutas deben ser relativas: `import img from '../assets/img.jpg'`

### El formulario no funciona
- Verifica que el backend esté desplegado
- Actualiza la URL en Contact.jsx
- Verifica las variables de entorno del backend

### Error 404 al recargar
- Vercel.json debe estar configurado (ya está incluido)
- Verifica que tenga los rewrites correctos

---

## 📱 Compartir tu Portafolio

Una vez desplegado, comparte tu URL:

- 📧 En tu email signature
- 💼 En tu perfil de LinkedIn
- 🐱 En tu bio de GitHub
- 📄 En tu CV
- 🐦 En Twitter

---

## 🔄 Actualizar tu Portafolio

Para hacer cambios en el futuro:

```bash
# 1. Hacer los cambios en tu código local
# 2. Guardar y probar localmente
# 3. Subir a GitHub
git add .
git commit -m "Descripción de los cambios"
git push origin main

# Vercel redesplegrá automáticamente! 🎉
```

---

## 💡 Tips Profesionales

1. **Dominio Personalizado:** Considera comprar `christianestrada.com`
2. **Analytics:** Agrega Vercel Analytics para ver visitas
3. **SEO:** Actualiza meta tags para mejor posicionamiento
4. **Performance:** Vercel optimiza automáticamente las imágenes
5. **Preview Deployments:** Cada push crea un preview único

---

## 🎓 Recursos Útiles

- [Documentación de Vercel](https://vercel.com/docs)
- [Guía de Vite + Vercel](https://vercel.com/guides/deploying-vite-with-vercel)
- [Documentación de Render](https://render.com/docs)
- [Documentación de Railway](https://docs.railway.app)

---

## 🎉 ¡Listo!

Tu portafolio profesional estará disponible en internet 24/7, accesible desde cualquier parte del mundo.

**URLs de ejemplo:**
- https://christian-estrada.vercel.app
- https://christianestrada.dev
- https://portfolio-christian.vercel.app

---

**🚀 ¡Éxito con tu despliegue!**

*Si tienes problemas, revisa los logs de Vercel o contacta su soporte.*

