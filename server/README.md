# Backend - Servidor de Email

Este es el servidor backend para el formulario de contacto del portafolio de Christian Estrada.

## 🚀 Configuración Rápida

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en esta carpeta (`server/.env`) con el siguiente contenido:

```env
PORT=5000
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicación
```

### 3. Obtener contraseña de aplicación de Gmail

1. Ve a [myaccount.google.com](https://myaccount.google.com)
2. Haz clic en **"Seguridad"** en el menú lateral
3. Activa la **"Verificación en dos pasos"** (si no lo has hecho)
4. Después de activarla, regresa a **"Seguridad"**
5. Busca **"Contraseñas de aplicación"** (App passwords)
6. Selecciona:
   - **App:** Correo
   - **Device:** Otro (nombre personalizado)
7. Copia la contraseña de 16 caracteres generada
8. Pégala en el archivo `.env` como `EMAIL_PASS`

⚠️ **NO USES TU CONTRASEÑA REAL DE GMAIL**, usa solo la contraseña de aplicación.

### 4. Ejecutar el servidor

```bash
npm start
```

El servidor estará disponible en `http://localhost:5000`

## 📡 Endpoints

### GET `/`
Ruta de prueba para verificar que el servidor está activo.

**Respuesta:**
```json
{
  "message": "🚀 Backend del portafolio de Christian Estrada",
  "status": "activo"
}
```

### POST `/api/sendEmail`
Endpoint para enviar emails desde el formulario de contacto.

**Body (JSON):**
```json
{
  "name": "Nombre del remitente",
  "email": "email@ejemplo.com",
  "subject": "Asunto del mensaje",
  "message": "Contenido del mensaje"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Mensaje enviado correctamente"
}
```

**Respuesta de error:**
```json
{
  "success": false,
  "message": "Error al enviar el mensaje",
  "error": "Descripción del error"
}
```

## 🔧 Configuración de CORS

El servidor está configurado para aceptar peticiones desde cualquier origen. En producción, deberías restringir esto:

```javascript
app.use(cors({
  origin: 'https://tu-dominio.com'
}));
```

## 🚀 Despliegue

### Render
1. Crea una nueva Web Service
2. Conecta tu repositorio
3. Root Directory: `server`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Agrega las variables de entorno (EMAIL_USER, EMAIL_PASS)

### Railway
1. New Project → Deploy from GitHub repo
2. Selecciona tu repositorio
3. Root Directory: `server`
4. Agrega las variables de entorno

### Heroku
```bash
cd server
heroku create
heroku config:set EMAIL_USER=tu-email@gmail.com
heroku config:set EMAIL_PASS=tu-contraseña-de-aplicación
git push heroku main
```

## 📧 Personalización

Para cambiar el email de destino, edita la línea 37 en `index.js`:

```javascript
to: 'nuevo-email@gmail.com',
```

Para cambiar el asunto del email, edita la línea 38:

```javascript
subject: 'Tu nuevo asunto',
```

## 🐛 Solución de Problemas

### Error: "Invalid login"
- Verifica que hayas activado la verificación en dos pasos
- Asegúrate de usar la contraseña de aplicación, NO tu contraseña de Gmail
- Verifica que el email en `.env` sea correcto

### Error: "Connection timeout"
- Verifica tu conexión a internet
- Algunos proveedores de internet o redes corporativas bloquean el puerto 587
- Intenta usar una red diferente

### El formulario no se conecta al backend
- Verifica que el servidor esté ejecutándose en el puerto 5000
- Revisa que no haya errores de CORS en la consola del navegador
- Asegúrate de que la URL en el frontend sea correcta (`http://localhost:5000/api/sendEmail`)

## 📝 Tecnologías Utilizadas

- **Express** - Framework web para Node.js
- **Nodemailer** - Envío de emails
- **CORS** - Manejo de peticiones cross-origin
- **dotenv** - Gestión de variables de entorno

