#!/usr/bin/env node
/**
 * recortar-capturas.mjs — recorta cada foto de una captura real alrededor de su marca.
 *
 * Por qué existe (2026-09-25): el marco de captura del carrusel (pack community-editorial)
 * mide ~530×300 px. Una pantalla entera metida ahí deja el texto en ~12 px: ilegible en un
 * teléfono. El recorte usa la `region_px` que `capturar-web.mjs` anota por foto (la zona que
 * cubre la marca verde), le suma contexto y la lleva a la proporción del marco. La foto sigue
 * siendo la misma captura real; sólo se encuadra.
 *
 * Uso:
 *   node scripts/contenido/recortar-capturas.mjs <manifest.json> [--out DIR] [--aspecto 1.77] [--margen 36]
 * Salida: <out>/<toma>-<foto>.png, uno por foto con región.
 */
import { execSync, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function rutaFfmpeg() {
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH;
  try { execSync('ffmpeg -version', { stdio: 'ignore' }); return 'ffmpeg'; } catch { /* no está */ }
  try {
    return execSync('python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"', { encoding: 'utf8' }).trim();
  } catch { /* no está */ }
  throw new Error('No encuentro ffmpeg. Poné FFMPEG_PATH o `pip install imageio-ffmpeg`.');
}

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const manifestPath = args.find((a) => a.endsWith('.json'));
if (!manifestPath) { console.error('Uso: recortar-capturas.mjs <manifest.json> [--out DIR] [--aspecto 1.77] [--margen 36]'); process.exit(1); }
const dir = path.dirname(path.resolve(manifestPath));
const out = path.resolve(opt('--out', path.join(dir, 'recortes')));
const aspecto = Number(opt('--aspecto', '1.77'));
const margen = Number(opt('--margen', '36'));
const ffmpeg = rutaFfmpeg();
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
fs.mkdirSync(out, { recursive: true });

let hechos = 0;
for (const toma of manifest.tomas) {
  if (!toma.ok) continue;
  const W = toma.viewport.width * toma.dpr;
  const H = toma.viewport.height * toma.dpr;
  for (const foto of toma.fotos ?? []) {
    const r = foto.region_px;
    if (!r) continue;
    // Ancho: la región + margen a cada lado (sin pasarse de la imagen). Alto: por proporción,
    // y nunca menos que la región + margen. Centrado en la región.
    let w = Math.min(W, r.w + 2 * margen * toma.dpr);
    let h = Math.round(w / aspecto);
    if (h < r.h + 2 * margen * toma.dpr) { h = Math.min(H, r.h + 2 * margen * toma.dpr); w = Math.min(W, Math.round(h * aspecto)); }
    const cx = r.x + r.w / 2;
    const cy = r.y + r.h / 2;
    const x = Math.round(Math.max(0, Math.min(W - w, cx - w / 2)));
    const y = Math.round(Math.max(0, Math.min(H - h, cy - h / 2)));
    const par = (n) => n - (n % 2);
    const destino = path.join(out, foto.archivo);
    execFileSync(ffmpeg, ['-y', '-loglevel', 'error', '-i', path.join(dir, foto.archivo),
      '-vf', `crop=${par(w)}:${par(h)}:${x}:${y}`, destino]);
    foto.recorte = { archivo: path.relative(dir, destino), px: { x, y, w: par(w), h: par(h) } };
    hechos++;
  }
}
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`✓ ${hechos} recortes en ${out} (anotados en el manifiesto). MIRARLOS antes de usarlos.`);
