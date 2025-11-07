# 🎖️ Configuración de POAPs en el Portafolio

## ✅ Lo que ya está implementado

- ✅ Sección "Logros y Certificaciones" creada
- ✅ Navegación actualizada con "Logros" en el menú
- ✅ Diseño responsive con animaciones
- ✅ Placeholder para tus 5 POAPs
- ✅ Link a tu perfil completo de POAP.xyz configurado con tu email
- ✅ Perfil de POAP conectado: `https://collectors.poap.xyz/scan/christianmanuel1233@gmail.com`

---

## 📝 Pasos para completar la configuración

### **PASO 1: ✅ COMPLETADO - Link a tu perfil de POAP**

El link a tu perfil completo ya está configurado y funcionando. El botón "Ver mi colección completa en POAP.xyz" te llevará directamente a tu perfil con todos tus POAPs.

**URL configurada:** `https://collectors.poap.xyz/scan/christianmanuel1233@gmail.com`

---

### **PASO 2: Descargar las imágenes de tus POAPs**

Tienes 2 opciones:

#### **OPCIÓN A: Desde la app móvil de POAP**
1. Abre la app de POAP
2. Toca cada POAP para verlo en grande
3. Haz screenshot o descarga la imagen
4. Guarda las imágenes con nombres descriptivos:
   - `poap-etherfuse.png`
   - `poap-base.png`
   - `poap-ens.png`
   - `poap-university-blockchain.png`
   - `poap-settarb.png`

#### **OPCIÓN B: Desde POAP.xyz**
1. Ve a: https://app.poap.xyz/
2. Conecta tu wallet
3. Encuentra cada POAP
4. Click derecho en la imagen → "Guardar imagen como..."
5. Guarda en: `src/assets/`

---

### **PASO 3: Agregar las imágenes al código**

1. Mueve todas las imágenes de POAPs a la carpeta:
   ```
   src/assets/
   ```

2. Abre el archivo: `src/pages/Achievements.jsx`

3. Agrega los imports al inicio del archivo (después de la línea 2):
   ```javascript
   import poapEtherfuse from '../assets/poap-etherfuse.png';
   import poapBase from '../assets/poap-base.png';
   import poapEns from '../assets/poap-ens.png';
   import poapUniversity from '../assets/poap-university-blockchain.png';
   import poapSettarb from '../assets/poap-settarb.png';
   ```

4. Actualiza el array `poaps` (línea ~16) con las imágenes:
   ```javascript
   const poaps = [
     {
       id: 1,
       name: 'Ethereum Mexico 2025 - Sponsor',
       event: 'ETHEREUM MEXICO 2025',
       sponsor: 'etherfuse',
       date: 'Octubre 2025',
       description: 'Sponsor POAP del hackathon EthMexico MTY 2025',
       image: poapEtherfuse, // ← Agregar aquí
       link: null,
       category: 'Hackathon',
     },
     {
       id: 2,
       name: 'Ethereum Mexico 2025 - Sponsor',
       event: 'ETHEREUM MEXICO 2025',
       sponsor: 'base',
       date: 'Octubre 2025',
       description: 'Sponsor POAP del hackathon EthMexico MTY 2025',
       image: poapBase, // ← Agregar aquí
       link: null,
       category: 'Hackathon',
     },
     // ... y así con los demás
   ];
   ```

---

### **PASO 4: (Opcional) Agregar links individuales a cada POAP**

Si quieres que cada POAP tenga su propio link:

1. En la app de POAP, abre cada POAP
2. Copia la URL (ejemplo: `https://app.poap.xyz/token/12345678`)
3. En `src/pages/Achievements.jsx`, actualiza cada POAP:
   ```javascript
   {
     id: 1,
     // ... otros datos
     link: 'https://app.poap.xyz/token/12345678', // ← Agregar aquí
   }
   ```

---

## 🎨 Características de la sección

- ✨ **Animaciones suaves** al hacer scroll
- 🎯 **Hover effects** en cada POAP card
- 📱 **Diseño responsive** (móvil, tablet, desktop)
- 🌙 **Soporte dark mode** completo
- 🔗 **Link a perfil completo** de POAP.xyz
- 🏷️ **Badges de categoría** (Hackathon, Evento)
- 📅 **Fechas y descripciones** de cada POAP

---

## 🚀 Prueba rápida

1. Ejecuta: `npm run dev`
2. Navega a la sección "Logros" en el menú
3. Verifica que:
   - ✅ Se muestran los 5 POAPs
   - ✅ El botón de "Ver colección completa" funciona y te lleva a tu perfil
   - ✅ Las imágenes se ven correctamente (después de agregarlas)
   - ✅ El diseño se ve bien en móvil y desktop

---

## 📊 Estructura de datos de cada POAP

```javascript
{
  id: 1,                    // ID único
  name: 'Nombre del POAP',  // Título principal
  event: 'Nombre del evento', // Evento o hackathon
  sponsor: 'nombre-sponsor', // (opcional) Si tiene sponsor
  date: 'Octubre 2025',     // Fecha del evento
  description: '...',       // Descripción breve
  image: poapImage,         // Imagen importada
  link: 'url',              // (opcional) Link al POAP
  category: 'Hackathon',    // Categoría (Hackathon, Evento, etc.)
}
```

---

## 💡 Tips

- **Tamaño de imágenes:** Recomendado 512x512px o superior para mejor calidad
- **Formato:** PNG o JPG funcionan bien
- **Nombres:** Usa nombres descriptivos y en minúsculas (ej: `poap-etherfuse.png`)
- **Wallet:** Si no tienes wallet, puedes dejar el placeholder y solo mostrar las imágenes

---

## ❓ Preguntas frecuentes

**P: ¿Puedo agregar más POAPs en el futuro?**
R: ¡Sí! Solo agrega un nuevo objeto al array `poaps` en `Achievements.jsx`.

**P: ¿Qué pasa si no tengo la wallet address?**
R: ¡No necesitas wallet address! POAP también funciona con email, y ya está configurado con tu email.

**P: ¿Puedo cambiar el orden de los POAPs?**
R: Sí, solo reorganiza el array `poaps` en el orden que prefieras.

---

## 🎯 Próximos pasos

1. ✅ Link a perfil de POAP configurado (COMPLETADO)
2. ⏳ Descargar imágenes de POAPs
3. ⏳ Actualizar el código con las imágenes
4. ⏳ Probar en desarrollo (`npm run dev`)
5. ⏳ Subir cambios a GitHub
6. ⏳ Vercel redeplegará automáticamente

---

**¿Listo para agregar tus POAPs?** 🚀

