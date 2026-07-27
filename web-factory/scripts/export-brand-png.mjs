/**
 * Exporta cada SVG de marca a PNG de alta resolución con fondo transparente.
 * Uso: node scripts/export-brand-png.mjs <dirSVG> <dirSalida>
 */
import { chromium } from 'playwright';
import { readFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, basename } from 'node:path';

const [, , srcDir, outDir] = process.argv;
mkdirSync(outDir, { recursive: true });

// ancho objetivo por tipo de pieza
const WIDTH = (name) =>
  name.includes('lockup') ? 4000 : name.includes('icon') ? 2048 : 3000;

const browser = await chromium.launch();
const files = readdirSync(srcDir).filter((f) => f.endsWith('.svg'));

for (const f of files) {
  const svg = readFileSync(join(srcDir, f), 'utf8');
  const vb = svg.match(/viewBox="([^"]+)"/);
  if (!vb) {
    console.log(`SKIP ${f} (sin viewBox)`);
    continue;
  }
  const [, , vw, vh] = vb[1].trim().split(/\s+/).map(Number);
  const w = WIDTH(f);
  const h = Math.round((vh / vw) * w);

  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(
    `<style>html,body{margin:0;padding:0;background:transparent}
     svg{display:block;width:${w}px;height:${h}px}</style>${svg}`
  );
  const el = await page.$('svg');
  const out = basename(f, '.svg') + `@${w}.png`;
  await el.screenshot({ path: join(outDir, out), omitBackground: true });
  await page.close();
  console.log(`${out.padEnd(42)} ${w}x${h}`);
}
await browser.close();
