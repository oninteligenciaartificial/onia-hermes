#!/usr/bin/env node
// Borrador 360p REAL (H11): no es un reescalado del final, es la MISMA composición renderizada por HyperFrames a 360x640 (--quality draft).
// Truco: se copia index.html a una carpeta de trabajo con el lienzo declarado en 360x640; y #root se reduce con CSS `zoom` conservando su tamaño de
// 1080x1920 con !important (HyperFrames fuerza el tamaño de #root a data-width x data-height: sin el !important queda recortado a 1/3, medido el 8-oct). Los assets se enlazan.
// Uso:  node scripts/borrador-360.mjs <carpeta-de-trabajo>     y después:
//       cd <carpeta> && npx hyperframes@0.8.142 render --quality draft -f 24 -o out.mp4
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.resolve(process.argv[2] || path.join(P, 'renders/draft360'));
if (!dir.startsWith(P + path.sep)) throw new Error('El borrador debe permanecer dentro de la carpeta de la pieza');
fs.mkdirSync(dir, { recursive: true });
let h = fs.readFileSync(path.join(P, 'index.html'), 'utf8');
h = h.replace('<meta name="viewport" content="width=1080, height=1920">', '<meta name="viewport" content="width=360, height=640">')
  .replace('data-width="1080" data-height="1920"', 'data-width="360" data-height="640"')
  .replace('</style>', 'html,body{width:360px!important;height:640px!important}#root{width:1080px!important;height:1920px!important;zoom:0.3333333333}\n</style>');
fs.writeFileSync(path.join(dir, 'index.html'), h);
for (const f of ['hyperframes.json', 'package.json']) fs.copyFileSync(path.join(P, f), path.join(dir, f));
for (const f of ['assets','assets-fijos']) {
 const a=path.join(dir,f);if (!fs.existsSync(a)) fs.symlinkSync(path.join(P,f),a,'junction');
}
console.log('borrador 360x640 listo en', dir);
