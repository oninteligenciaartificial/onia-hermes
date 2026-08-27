import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 1.4 });
await p.goto(pathToFileURL(resolve(process.argv[2])).href, { waitUntil: 'networkidle' });
await p.waitForTimeout(2000);
const secs = await p.$$('.page');
// La carpeta de salida es argumento. Estaba fija en `humo/`, asi que rendir otro
// recurso le pisaba los previews a HUMO (pasado el 2026-08-27).
const salida = process.argv[3] || 'hermes-content/recursos/humo';
for (let i = 0; i < secs.length; i++) {
  await secs[i].screenshot({ path: `${salida}/pag-${i+1}.png` });
}
await b.close();
console.log('paginas:', secs.length);
