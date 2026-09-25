// Rinde el checklist a PDF (A4, para adjuntar en la comunidad) y a PNG (vista previa para
// WhatsApp). Usa el Chromium de Playwright, esté instalado local o globalmente.
// Uso: node hermes-content/recursos/comunidad/opus-5-5-migracion/render.mjs
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
function cargarChromium() {
  const candidatos = ['playwright', 'playwright-core'];
  try { const g = execSync('npm root -g', { encoding: 'utf8' }).trim(); candidatos.push(path.join(g, 'playwright')); } catch { /* sin npm global */ }
  for (const c of candidatos) { try { return require(c).chromium; } catch { /* siguiente */ } }
  throw new Error('No encuentro Playwright.');
}
const aqui = path.dirname(fileURLToPath(import.meta.url));
const src = pathToFileURL(path.join(aqui, 'checklist-opus-5-5.html')).href;
const browser = await cargarChromium().launch();
const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 });
await page.goto(src, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready.then(() => true));
await page.pdf({ path: path.join(aqui, 'checklist-opus-5-5.pdf'), format: 'A4', printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 } });
await page.screenshot({ path: path.join(aqui, 'checklist-opus-5-5.png'), fullPage: false });
await browser.close();
console.log('PDF y PNG ->', aqui);
