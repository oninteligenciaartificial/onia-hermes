import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const [, , srcDir, outDir] = process.argv;
mkdirSync(outDir, { recursive: true });

// [archivo svg, tamaño, nombre de salida]
const JOBS = [
  // cuadrado sin radio: iOS/Android/stores aplican su propia máscara
  ['onia-icon.svg', 1024, 'onia-icon-1024.png'],
  ['onia-icon.svg', 512, 'onia-icon-512.png'],
  ['onia-icon.svg', 192, 'onia-icon-192.png'],
  // con radio propio: favicon y web
  ['onia-icon-rounded.svg', 180, 'apple-touch-icon.png'],
  ['onia-icon-rounded.svg', 48, 'favicon-48.png'],
  ['onia-icon-rounded.svg', 32, 'favicon-32.png'],
  ['onia-icon-rounded.svg', 16, 'favicon-16.png'],
  // circular: WhatsApp, avatares de redes
  ['onia-icon-circle.svg', 400, 'onia-avatar-400.png'],
  ['onia-icon-circle.svg', 200, 'onia-avatar-200.png'],
];

const browser = await chromium.launch();
for (const [src, size, out] of JOBS) {
  const svg = readFileSync(join(srcDir, src), 'utf8');
  const page = await browser.newPage({
    viewport: { width: size, height: size },
  });
  await page.setContent(
    `<style>html,body{margin:0;padding:0;background:transparent}
     svg{display:block;width:${size}px;height:${size}px}</style>${svg}`
  );
  const el = await page.$('svg');
  await el.screenshot({ path: join(outDir, out), omitBackground: true });
  await page.close();
  console.log(`${out.padEnd(26)} ${size}x${size}`);
}
await browser.close();
