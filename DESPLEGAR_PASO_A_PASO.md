# 🎯 Desplegar a Vercel - Paso a Paso

## ✅ Checklist Completo (Marca cada paso)

---

## PARTE 1: PREPARACIÓN (5 minutos)

### ☐ Paso 1: Verificar que el proyecto funcione
```bash
npm run build
```
✅ Si no hay errores, continúa al siguiente paso.

### ☐ Paso 2: Crear cuenta en servicios necesarios

1. **GitHub** → [github.com/signup](https://github.com/signup)
   - Crea tu cuenta si no tienes
   - Anota tu usuario: `_________________`

2. **Vercel** → [vercel.com/signup](https://vercel.com/signup)
   - Haz clic en "Continue with GitHub"
   - ✅ Autoriza Vercel

3. **Render** (para el backend) → [render.com/register](https://render.com/register)
   - Regístrate con GitHub
   - ✅ Autoriza Render

---

## PARTE 2: SUBIR A GITHUB (5 minutos)

### ☐ Paso 3: Crear repositorio en GitHub

1. Ve a [github.com/new](https://github.com/new)
2. Llena los datos:
   - **Repository name:** `portfolio`
   - **Description:** `Mi portafolio web profesional`
   - **Public** ✅
   - **NO** marques "Add a README file"
3. Click en "Create repository"
4. **COPIA LA URL** que aparece (algo como):
   ```
   https://github.com/TU-USUARIO/portfolio.git
   ```

### ☐ Paso 4: Subir tu código

Abre **PowerShell** en la carpeta de tu portafolio:

```powershell
# 1. Inicializar Git
git init

# 2. Configurar tu nombre y email (solo la primera vez)
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@gmail.com"

# 3. Agregar todos los archivos
git add .

# 4. Crear el primer commit
git commit -m "Initial commit - Portfolio profesional"

# 5. Conectar con tu repositorio (USA TU URL COPIADA)
git remote add origin https://github.com/TU-USUARIO/portfolio.git

# 6. Cambiar la rama a main
git branch -M main

# 7. Subir el código
git push -u origin main
```

✅ Si te pide usuario y contraseña, usa tu usuario de GitHub y un [Personal Access Token](https://github.com/settings/tokens)

---

## PARTE 3: DESPLEGAR FRONTEND EN VERCEL (3 minutos)

### ☐ Paso 5: Importar proyecto en Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Click en **"Import Project"**
3. Busca tu repositorio `portfolio`
4. Click en **"Import"**
5. Vercel detectará automáticamente la configuración:
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
6. ✅ **NO CAMBIES NADA**
7. Click en **"Deploy"**
8. Espera 1-2 minutos... ⏳

### ☐ Paso 6: ¡Obtén tu URL!

Vercel te mostrará algo como:

```
🎉 Congratulations!

Your site is now live at:
https://portfolio-abc123.vercel.app
```

**ANOTA TU URL:** `_________________________________`

✅ Haz clic en la URL para ver tu portafolio en vivo!

---

## PARTE 4: DESPLEGAR BACKEND EN RENDER (5 minutos)

### ☐ Paso 7: Crear servicio en Render

1. Ve a [render.com/dashboard](https://dashboard.render.com)
2. Click en **"New +"** → **"Web Service"**
3. Click en **"Build and deploy from a Git repository"**
4. Click en **"Connect account"** (si no lo has hecho)
5. Busca y selecciona tu repositorio `portfolio`
6. Click en **"Connect"**

### ☐ Paso 8: Configurar el servicio

Llena los siguientes campos:

| Campo | Valor |
|-------|-------|
| **Name** | `christian-estrada-backend` |
| **Region** | Oregon (US West) |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

### ☐ Paso 9: Agregar variables de entorno

Scroll down hasta "Environment Variables" y agrega:

| KEY | VALUE |
|-----|-------|
| `EMAIL_USER` | `christianmanuel1233@gmail.com` |
| `EMAIL_PASS` | Tu contraseña de aplicación de Gmail |
| `PORT` | `5000` |

⚠️ **Recuerda:** Usa la contraseña de aplicación de Gmail, no tu contraseña normal.

[¿Cómo obtener contraseña de aplicación?](https://myaccount.google.com/apppasswords)

### ☐ Paso 10: Desplegar

1. Click en **"Create Web Service"**
2. Espera 3-5 minutos... ⏳
3. Render te dará una URL como:
   ```
   https://christian-estrada-backend.onrender.com
   ```

**ANOTA TU URL BACKEND:** `_________________________________`

---

## PARTE 5: CONECTAR FRONTEND CON BACKEND (3 minutos)

### ☐ Paso 11: Actualizar URL en el código

1. Abre el archivo: `src/pages/Contact.jsx`
2. Busca la línea ~51 (usa Ctrl+F y busca "localhost:5000")
3. Cambia:

**ANTES:**
```javascript
const response = await fetch('http://localhost:5000/api/sendEmail', {
```

**DESPUÉS:**
```javascript
const response = await fetch('https://TU-URL-DE-RENDER.onrender.com/api/sendEmail', {
```

4. Guarda el archivo

### ☐ Paso 12: Subir los cambios

En PowerShell:

```powershell
git add .
git commit -m "Update backend URL for production"
git push origin main
```

✅ Vercel redesplegrá automáticamente en 1-2 minutos.

---

## PARTE 6: PROBAR TODO (2 minutos)

### ☐ Paso 13: Verificar que todo funcione

1. **Abre tu URL de Vercel** en el navegador
2. Navega por las 4 páginas:
   - [ ] Home
   - [ ] Sobre mí
   - [ ] Proyectos
   - [ ] Contacto
3. **Prueba el formulario de contacto:**
   - [ ] Llena todos los campos
   - [ ] Click en "Enviar mensaje"
   - [ ] Deberías ver: ✅ "Mensaje enviado correctamente"
   - [ ] Revisa tu email: christianmanuel1233@gmail.com

✅ Si todo funciona, **¡FELICIDADES!** 🎉

---

## 🎨 EXTRAS (Opcional)

### ☐ Agregar dominio personalizado

1. Ve a tu proyecto en Vercel
2. Settings → Domains
3. Agrega tu dominio (ej: `christianestrada.com`)
4. Sigue las instrucciones de configuración DNS

### ☐ Configurar dominio en Render

1. Ve a tu servicio en Render
2. Settings → Custom Domains
3. Agrega tu subdominio (ej: `api.christianestrada.com`)

---

## 📊 RESUMEN FINAL

Ahora tienes:

```
✅ Frontend desplegado en Vercel
   https://tu-portfolio.vercel.app

✅ Backend desplegado en Render
   https://tu-backend.onrender.com

✅ Formulario de contacto funcionando
   Emails llegan a: christianmanuel1233@gmail.com

✅ Código en GitHub
   https://github.com/TU-USUARIO/portfolio
```

---

## 🔄 ACTUALIZAR EN EL FUTURO

Para hacer cambios:

```powershell
# 1. Edita tus archivos
# 2. Guarda los cambios
# 3. Sube a GitHub:

git add .
git commit -m "Descripción de los cambios"
git push origin main

# ¡Vercel redesplegrá automáticamente! 🚀
```

---

## 🆘 PROBLEMAS COMUNES

### Error: "Build failed" en Vercel
- ✅ Ejecuta `npm run build` localmente
- ✅ Corrige los errores que aparezcan
- ✅ Sube los cambios a GitHub

### Error: "Application failed to respond" en Render
- ✅ Verifica las variables de entorno
- ✅ Revisa los logs en Render Dashboard
- ✅ Asegúrate de que el puerto sea 5000

### El formulario no envía emails
- ✅ Verifica que el backend esté corriendo (abre la URL en navegador)
- ✅ Revisa que la URL en Contact.jsx sea correcta
- ✅ Verifica las credenciales de Gmail en Render

### Git pide usuario y contraseña
- ✅ Usa tu usuario de GitHub
- ✅ Crea un [Personal Access Token](https://github.com/settings/tokens)
- ✅ Usa el token como contraseña

---

## 🎉 ¡ÉXITO!

Tu portafolio ahora está:
- 🌐 Disponible 24/7 en internet
- 📱 Accesible desde cualquier dispositivo
- 🚀 Con actualizaciones automáticas
- 💼 Listo para compartir con reclutadores

**Comparte tu URL:**
- LinkedIn
- CV
- GitHub bio
- Email signature
- Twitter

---

**🎨 Christian Estrada - UTCH**
**🚀 Portfolio desplegado exitosamente!**

