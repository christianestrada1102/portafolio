# 🚀 Instrucciones de Configuración

Sigue estos pasos para configurar y ejecutar el portafolio web de Christian Estrada.

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn
- Una cuenta de Gmail para el formulario de contacto

## 🔧 Instalación

### 1. Instalar dependencias del Frontend

```bash
npm install
```

### 2. Instalar dependencias del Backend

```bash
cd server
npm install
cd ..
```

## 📧 Configurar el Email

Para que el formulario de contacto funcione correctamente, necesitas configurar una contraseña de aplicación de Gmail:

### Pasos:

1. Ve a tu cuenta de Gmail
2. Accede a **Gestión de cuenta de Google** → **Seguridad**
3. Activa la **verificación en dos pasos** (si no lo has hecho)
4. Busca **"Contraseñas de aplicación"**
5. Genera una nueva contraseña de aplicación para "Correo"
6. Crea un archivo `.env` en la carpeta `server/` con el siguiente contenido:

```env
PORT=5000
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicación-generada
```

⚠️ **Importante:** NO uses tu contraseña real de Gmail, usa la contraseña de aplicación generada.

## ▶️ Ejecutar el Proyecto

### Opción 1: Ejecutar Frontend y Backend por separado

**Terminal 1 - Frontend:**
```bash
npm run dev
```
El frontend estará disponible en: `http://localhost:3000`

**Terminal 2 - Backend:**
```bash
cd server
npm start
```
El backend estará disponible en: `http://localhost:5000`

### Opción 2: Usar scripts personalizados

Puedes editar el `package.json` principal para agregar un script que ejecute ambos simultáneamente usando `concurrently`:

```bash
npm install -D concurrently
```

Luego agregar en `package.json`:
```json
"scripts": {
  "dev": "vite",
  "server": "node server/index.js",
  "start:all": "concurrently \"npm run dev\" \"npm run server\""
}
```

Y ejecutar:
```bash
npm run start:all
```

## 🌐 Probar el Formulario de Contacto

1. Asegúrate de que el backend esté ejecutándose en `http://localhost:5000`
2. Accede al formulario en la página de Contacto
3. Llena todos los campos
4. Envía el mensaje
5. Deberías recibir un email en `christianmanuel1233@gmail.com`

## 🏗️ Build para Producción

```bash
npm run build
```

Los archivos de producción se generarán en la carpeta `dist/`.

## 🚀 Despliegue

### Frontend (Netlify/Vercel)
1. Conecta tu repositorio de GitHub
2. Configura el build command: `npm run build`
3. Directorio de publicación: `dist`

### Backend (Render/Railway/Heroku)
1. Despliega la carpeta `server/`
2. Configura las variables de entorno (EMAIL_USER, EMAIL_PASS, PORT)
3. Actualiza la URL del backend en `src/pages/Contact.jsx` (línea del fetch)

## 📝 Notas

- Todos los componentes son responsivos y accesibles
- Las animaciones son suaves y optimizadas
- El formulario valida todos los campos antes de enviar
- Los colores siguen la paleta morada especificada

## 🐛 Solución de Problemas

### El formulario no envía mensajes

- Verifica que el backend esté ejecutándose
- Revisa que el archivo `.env` en `server/` tenga las credenciales correctas
- Comprueba la consola del navegador y del servidor para errores

### Las imágenes no se muestran

- Asegúrate de que las imágenes estén en `src/assets/`
- Verifica las rutas de importación en los componentes

### Errores de CORS

- Verifica que el backend tenga CORS habilitado (ya está configurado)
- Asegúrate de que las URLs coincidan (localhost:3000 → localhost:5000)

## 📧 Soporte

Si tienes problemas, revisa la documentación de:
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Nodemailer](https://nodemailer.com/)

