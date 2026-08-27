// Genera versiones 8-bit: halftone de puntos circulares finos (celda 4px)
// con la paleta púrpura exacta extraída de las imágenes de referencia.
// Uso: node scripts/pixelize.js <carpeta>

import sharp from 'sharp';
import fs    from 'fs';
import path  from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CELL = 4;   // celda pequeña → puntos finos (círculos ~2px de radio)

// Paleta exacta de las imágenes de referencia (primer-hack-aws p*-8bit.png)
const PALETTE = [
  [ 26,   6,  38],   // 0 – fondo oscuro
  [ 74,  20, 100],   // 1 – oscuro
  [124,  58, 172],   // 2 – medio
  [178, 122, 220],   // 3 – claro
  [216, 186, 238],   // 4 – muy claro
];

function palIdx(lum) {
  if (lum <  40) return 0;
  if (lum <  95) return 1;
  if (lum < 155) return 2;
  if (lum < 210) return 3;
  return 4;
}

async function pixelize(srcPath, dstPath) {
  const meta = await sharp(srcPath).metadata();
  const W = meta.width;
  const H = meta.height;

  const { data } = await sharp(srcPath)
    .grayscale()
    .normalise()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Fondo = color más oscuro de la paleta
  const [br, bg, bb] = PALETTE[0];
  const out = Buffer.alloc(W * H * 3);
  for (let i = 0; i < W * H; i++) {
    out[i*3] = br; out[i*3+1] = bg; out[i*3+2] = bb;
  }

  const cols = Math.ceil(W / CELL);
  const rows = Math.ceil(H / CELL);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x0 = col * CELL, y0 = row * CELL;
      const x1 = Math.min(x0 + CELL, W), y1 = Math.min(y0 + CELL, H);

      // Brillo promedio de la celda
      let sum = 0, count = 0;
      for (let y = y0; y < y1; y++)
        for (let x = x0; x < x1; x++) { sum += data[y * W + x]; count++; }
      const lum = Math.round(sum / count);

      const maxR = Math.min(x1 - x0, y1 - y0) / 2;
      // Radio proporcional al brillo; gamma 0.5 para que celdas oscuras
      // sigan teniendo un punto visible (no desaparezcan)
      const t = Math.sqrt(lum / 255);
      const r = t * maxR * 1.05;   // 1.05 = ligero solapamiento entre celdas
      if (r < 0.4) continue;

      const [fr, fg, fb] = PALETTE[palIdx(lum)];
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      const r2 = r * r;

      const py0 = Math.max(0, Math.floor(cy - r));
      const py1 = Math.min(H - 1, Math.ceil(cy + r));
      const px0 = Math.max(0, Math.floor(cx - r));
      const px1 = Math.min(W - 1, Math.ceil(cx + r));

      for (let py = py0; py <= py1; py++) {
        for (let px = px0; px <= px1; px++) {
          const dx = px - cx, dy = py - cy;
          if (dx * dx + dy * dy <= r2) {
            const i = (py * W + px) * 3;
            out[i] = fr; out[i+1] = fg; out[i+2] = fb;
          }
        }
      }
    }
  }

  await sharp(out, { raw: { width: W, height: H, channels: 3 } })
    .png({ compressionLevel: 9 })
    .toFile(dstPath);

  console.log(`  ✓ ${path.basename(dstPath)}`);
}

async function main() {
  const folder = process.argv[2];
  if (!folder) { console.error('Uso: node scripts/pixelize.js <carpeta>'); process.exit(1); }
  const dir = path.join(__dirname, '..', 'src', 'assets', 'hacks', folder);
  if (!fs.existsSync(dir)) { console.error(`No existe: ${dir}`); process.exit(1); }
  const jpgs = fs.readdirSync(dir).filter(f => /^p\d+\.jpg$/i.test(f)).sort();
  if (!jpgs.length) { console.error('No hay archivos p*.jpg'); process.exit(1); }
  console.log(`Procesando ${jpgs.length} foto(s) en "${folder}"...`);
  for (const jpg of jpgs) {
    const base = jpg.replace(/\.jpg$/i, '');
    await pixelize(path.join(dir, jpg), path.join(dir, `${base}-8bit.png`));
  }
  console.log('Listo.');
}

main().catch(e => { console.error(e); process.exit(1); });
