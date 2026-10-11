#!/usr/bin/env node
// Grep de frases prohibidas (editor-videos § «Reels de Lucía» + plan v5 §2) sobre TODO el texto en pantalla (tarjetas, rótulo, etiquetas,
// panel, placa, sello) y sobre el pie. Sale con 1 si algo coincide. G2 v2: la lista vive en scripts/prohibidas.mjs y se aplica también a guion-voz.txt.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PROHIBIDAS } from './prohibidas.mjs';
const require = createRequire('/opt/node-tools/package.json');
const { chromium } = require('playwright');
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const b = await chromium.launch({ args: ['--no-sandbox'] });
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.goto(pathToFileURL(path.join(P, 'index.html')).href);
const enPantalla = await pg.evaluate(() => document.getElementById('root').textContent.replace(/\s+/g, ' ').trim());
await b.close();
const pie = fs.readFileSync(path.join(P, 'pie.txt'), 'utf8');
const voz = fs.readFileSync(path.join(P, 'guion-voz.txt'), 'utf8');
let hits = 0;
for (const [donde, txt] of [['pantalla', enPantalla], ['pie', pie], ['guion de voz', voz]]) {
  const low = txt.toLowerCase();
  for (const f of PROHIBIDAS) if (low.includes(f.toLowerCase())) { console.log(`✖ ${donde}: «${f}»`); hits++; }
}
console.log(`texto en pantalla (${enPantalla.split(' ').length} tokens): ${enPantalla}`);
console.log(`pie (${pie.trim().split(/\s+/).length} palabras)`);
console.log(`guion de voz (${voz.trim().split(/\n/).length} líneas): ${voz.trim().split(/\n/).join(' | ')}`);
if (hits) { console.error(`✖ ${hits} coincidencia(s)`); process.exit(1); }
console.log('✔ ninguna frase prohibida ni marca de terceros en pantalla, en el pie ni en el guion de voz');
