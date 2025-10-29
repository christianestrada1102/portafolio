# ⚡ Inicio Rápido - Portafolio Christian Estrada

## 🚀 En 3 Pasos

### 1️⃣ Instalar Dependencias

**Windows:**
```bash
install-all.bat
```

**Linux/Mac:**
```bash
npm install && cd server && npm install && cd ..
```

### 2️⃣ Configurar Email

1. Crea el archivo `server/.env`
2. Agrega esto (reemplaza con tus datos):

```env
PORT=5000
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicación
```

**¿Cómo obtener la contraseña de aplicación?**

1. Ve a: https://myaccount.google.com/security
2. Activa "Verificación en dos pasos"
3. Busca "Contraseñas de aplicación"
4. Genera una para "Correo"
5. Copia los 16 caracteres

### 3️⃣ Iniciar el Proyecto

**Windows:**
```bash
start-dev.bat
```

**Linux/Mac - Terminal 1:**
```bash
npm run dev
```

**Linux/Mac - Terminal 2:**
```bash
npm run server
```

---

## 🌐 URLs

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000

---

## ✅ Verificar que todo funciona

1. Abre http://localhost:3000 en tu navegador
2. Navega a la página de "Contacto"
3. Llena el formulario y envía un mensaje de prueba
4. Revisa tu email (christianmanuel1233@gmail.com)

---

## 🆘 ¿Problemas?

### El frontend no inicia
- Verifica que hayas ejecutado `npm install` en la raíz
- Asegúrate de que el puerto 3000 esté libre

### El backend no inicia
- Verifica que el archivo `server/.env` exista
- Asegúrate de que el puerto 5000 esté libre
- Revisa que hayas instalado las dependencias en `server/`

### El formulario no envía emails
- Verifica que el backend esté ejecutándose
- Revisa el archivo `server/.env`
- Asegúrate de usar la contraseña de aplicación, NO tu contraseña de Gmail

---

## 📖 Más información

- `README.md` - Documentación completa
- `SETUP.md` - Guía detallada de configuración
- `server/README.md` - Documentación del backend
- `server/ENV_TEMPLATE.txt` - Ejemplo de variables de entorno

---

## 🎉 ¡Listo!

Tu portafolio ya está funcionando. Ahora puedes:

- ✏️ Personalizar el contenido en las páginas
- 🎨 Ajustar los colores en `tailwind.config.js`
- 📸 Cambiar las imágenes en `src/assets/`
- 🚀 Desplegar en Netlify/Vercel (frontend) y Render/Railway (backend)

---

**Hecho con ❤️ por Christian Estrada**

