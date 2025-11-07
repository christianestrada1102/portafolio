# 📄 Cómo agregar tus certificados físicos al portafolio

## ✅ **Ya está preparado:**

- ✅ Sección de certificados creada
- ✅ NASA Space Apps Challenge agregado (pendiente imagen)
- ✅ Estructura lista para ICATECH STEAM y otros

---

## 📸 **PASO 1: Digitalizar tus certificados físicos**

Tienes 3 opciones para convertir tus certificados físicos en imágenes:

### **OPCIÓN A: Escáner (Mejor calidad)**

1. **Usa un escáner** (en tu universidad, biblioteca, o escáner de impresora)
2. **Configuración recomendada:**
   - Resolución: 300 DPI (mínimo)
   - Formato: JPG o PNG
   - Color: A color (no en escala de grises)
3. **Guarda el archivo** con un nombre descriptivo:
   - `nasa-space-apps.jpg`
   - `icatech-steam.jpg`

### **OPCIÓN B: Fotos con el celular (Más fácil)**

1. **Prepara el certificado:**
   - Colócalo sobre una superficie plana y bien iluminada
   - Asegúrate de que esté completamente plano (sin arrugas)
   - Usa luz natural o buena iluminación (sin sombras)

2. **Toma la foto:**
   - Usa la cámara de tu celular en modo normal
   - Asegúrate de que todo el certificado esté en el marco
   - Mantén el celular paralelo al certificado (sin ángulo)
   - Enfoca bien para que el texto se vea nítido

3. **Edita la foto (opcional pero recomendado):**
   - Usa la app **"Scanner Pro"** o **"Adobe Scan"** (gratis)
   - O ajusta en Google Fotos:
     - Recorta los bordes
     - Ajusta brillo y contraste
     - Endereza si está torcido

4. **Exporta:**
   - Formato: JPG
   - Calidad: Alta
   - Tamaño: Al menos 1000px de ancho

### **OPCIÓN C: Apps de escaneo móvil (Recomendado)**

1. **Descarga una app de escaneo:**
   - **Adobe Scan** (Gratis, Android/iOS)
   - **Microsoft Office Lens** (Gratis, Android/iOS)
   - **CamScanner** (Gratis con opciones premium)

2. **Usa la app:**
   - Abre la app
   - Toma foto del certificado
   - La app automáticamente:
     - Detecta los bordes
     - Endereza la imagen
     - Mejora la calidad
     - Elimina sombras
   - Guarda como PDF o JPG

3. **Exporta como imagen:**
   - Si guardaste como PDF, conviértelo a JPG
   - Puedes usar: https://pdf2jpg.net/

---

## 📁 **PASO 2: Guardar las imágenes**

1. **Crea nombres descriptivos:**
   - `nasa-space-apps.jpg` (o .png)
   - `icatech-steam.jpg`
   - `certificado-3.jpg` (para otros que tengas)

2. **Mueve las imágenes a:**
   ```
   src/assets/
   ```

3. **Verifica que los archivos estén ahí:**
   - Abre la carpeta `src/assets/`
   - Deberías ver: `nasa-space-apps.jpg`, `icatech-steam.jpg`, etc.

---

## 🔧 **PASO 3: Agregar al código**

### **Para NASA Space Apps Challenge:**

1. Abre: `src/pages/Achievements.jsx`

2. Busca la línea con los imports (línea ~4):
   ```javascript
   import poapEthMexico from '../assets/ethmexico.gif';
   ```

3. Agrega después de esa línea:
   ```javascript
   import nasaCertificate from '../assets/nasa-space-apps.jpg';
   ```

4. Busca el array `certificates` (línea ~77):
   ```javascript
   const certificates = [
     {
       id: 1,
       name: 'NASA Space Apps Challenge',
       // ...
       image: null, // ← Cambia esto
   ```

5. Cambia `image: null` por:
   ```javascript
   image: nasaCertificate,
   ```

### **Para ICATECH STEAM:**

1. Agrega el import:
   ```javascript
   import icatechCertificate from '../assets/icatech-steam.jpg';
   ```

2. Descomenta y actualiza en el array `certificates`:
   ```javascript
   {
     id: 2,
     name: 'Manejo STEAM',
     issuer: 'ICATECH',
     date: '2024', // Ajusta el año
     description: 'Certificado en manejo STEAM',
     image: icatechCertificate,
     link: null,
     category: 'Educación',
   },
   ```

---

## ✅ **PASO 4: Verificar**

1. Ejecuta: `npm run dev`
2. Ve a la sección "Logros"
3. Verifica que:
   - ✅ Se muestra el certificado de NASA
   - ✅ La imagen se ve nítida y clara
   - ✅ El diseño se ve bien
   - ✅ Funciona en móvil y desktop

---

## 🎨 **Tips para mejores resultados:**

### **Calidad de imagen:**
- ✅ **Tamaño mínimo:** 800x600px
- ✅ **Tamaño recomendado:** 1200x900px o más
- ✅ **Formato:** JPG (mejor para fotos) o PNG (mejor para escaneos)
- ✅ **Peso máximo:** 2MB (para que cargue rápido)

### **Contenido:**
- ✅ Asegúrate de que el texto se lea claramente
- ✅ Si el certificado tiene mucho texto pequeño, escanéalo en alta resolución
- ✅ Recorta los bordes blancos innecesarios

### **Diseño:**
- ✅ Si el certificado tiene colores importantes, escanéalo a color
- ✅ Si es solo texto negro, escala de grises está bien

---

## 📋 **Checklist:**

- [ ] Certificado de NASA escaneado/fotografiado
- [ ] Certificado de ICATECH escaneado/fotografiado
- [ ] Imágenes guardadas en `src/assets/`
- [ ] Imports agregados en `Achievements.jsx`
- [ ] Imágenes asignadas en el array `certificates`
- [ ] Probado en `npm run dev`
- [ ] Verificado en móvil y desktop

---

## 🚀 **Resultado final:**

Cuando termines, verás:
- ✨ Certificados con imágenes reales
- 🏆 Badge "Destacado" en NASA Space Apps
- 📱 Diseño responsive
- 🎨 Animaciones suaves
- 🌙 Soporte dark mode

---

## 💡 **Consejos adicionales:**

1. **Si tienes muchos certificados:**
   - Puedes agregar más al array `certificates`
   - O crear categorías separadas (Educación, Hackathons, etc.)

2. **Si quieres destacar alguno:**
   - Cambia `isFeatured: true` en el certificado que quieras destacar

3. **Si tienes links a certificados digitales:**
   - Agrega el link en el campo `link:` del certificado
   - Aparecerá un botón "Ver certificado"

---

**¿Listo para digitalizar tus certificados?** 📸✨

