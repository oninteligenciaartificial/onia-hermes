#!/usr/bin/env node
// Grep de frases prohibidas (editor-videos § «Reels de Lucía» + PLAN.md §4-bis) sobre TODO el texto en pantalla (tarjetas, rótulo, etiquetas,
// recortes, placa, sello), sobre el pie y sobre guion-voz.txt (v2: la voz también). Sale con 1 si algo coincide. «tapada» está en la lista (H1 de G3).
// v2.1 (revisión 1, H2, D-N1 del 11-oct): el VIDEO (pantalla y voz) no nombra ninguna herramienta; el PIE sí nombra SOLO «Seedream 4.5», «Kling 3.0 std» y «Higgsfield» (con procedencia escrita:
// build.mjs lo valida contra PROCEDENCIA.jsonl). Cualquier otra marca o modelo en el pie sigue prohibida.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
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
const PROHIBIDAS = [
  // editor-videos § Reels de Lucía (decisión 3-oct: nunca se identifica con el rubro de salud)
  'hoy soy odontóloga', 'soy doctora', 'como odontóloga', 'mis pacientes', 'mi consultorio', 'mi estudio', 'me pasó con un paciente',
  'odontólog', 'doctora', 'paciente', 'consultorio', 'clínica', 'médic', 'dentista',
  // promesas y resultados
  'agenda llena', 'cero ausencias', 'garantiz', 'resultado', 'aument', 'ahorr', 'ganá', 'ventas', 'clientes', '%',
  // no sé (el chiste va con «soy IA», nunca con «no sé»)
  'no sé',
  // afirmaciones ya verificadas como FALSAS (H1, 8-oct): en los cuadros 84 y 96 de K4 la mano NO está tapada (v4/PROCEDENCIA.jsonl línea 94)
  'tapada',
  // ni cara, voz ni nombre de Sergio Urcullo; ni producto de Onia
  'sergio', 'urcullo', 'dental', 'onia platform', 'gestión', 'chatbot',
  // marcas de terceros (modelos, plataformas, competidores)
  'kling', 'seedream', 'seedance', 'higgsfield', 'soul', 'nano banana', 'cinema studio', 'veo ', 'midjourney', 'runway', 'elevenlabs', 'sora', 'gpt', 'claude', 'chatgpt',
];
let hits = 0;
const PERMITIDAS_EN_PIE = [/Seedream 4\.5/g, /Kling 3\.0 std/g, /Higgsfield/g];
const sinPermitidas = (t) => PERMITIDAS_EN_PIE.reduce((s, r) => s.replace(r, ' '), t);
for (const [donde, txt] of [['pantalla', enPantalla], ['pie', sinPermitidas(pie)], ['voz', voz]]) {
  const low = txt.toLowerCase();
  for (const f of PROHIBIDAS) if (low.includes(f.toLowerCase())) { console.log(`✖ ${donde}: «${f}»`); hits++; }
}
console.log(`texto en pantalla (${enPantalla.split(' ').length} tokens): ${enPantalla}`);
console.log(`pie (${pie.trim().split(/\s+/).length} palabras): ${pie.trim().slice(0, 60)}…`);
console.log(`voz (${voz.trim().split(/\s+/).length} palabras, ${voz.trim().length} caracteres con saltos)`);
if (hits) { console.error(`✖ ${hits} coincidencia(s)`); process.exit(1); }
const enPie = PERMITIDAS_EN_PIE.map((r) => (pie.match(r) || []).length);
console.log(`herramientas nombradas en el pie (permitidas): Seedream 4.5 ×${enPie[0]}, Kling 3.0 std ×${enPie[1]}, Higgsfield ×${enPie[2]}; en pantalla y voz: ninguna`);
console.log('✔ ninguna frase prohibida ni marca de terceros en pantalla ni en la voz; en el pie solo las 3 herramientas permitidas');
