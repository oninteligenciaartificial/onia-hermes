#!/usr/bin/env node
// Grep de frases prohibidas (editor-videos § «Reels de Lucía» + plan v5 §2) sobre TODO el texto en pantalla (tarjetas, rótulo, etiquetas,
// panel, placa, sello), sobre el pie y sobre guion-voz.txt. Sale con 1 si algo coincide. G4: se suman los nombres de los motores de imagen y de los teléfonos.
// v2: además comprueba que estén las frases OBLIGATORIAS (rótulo, CTA, lección, escena 2, las dos notas) y que no quede «El café».
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
const enPantalla = await pg.evaluate(() => { const ns = []; const w = document.createTreeWalker(document.getElementById('root'), NodeFilter.SHOW_TEXT); while (w.nextNode()) { const t = w.currentNode.textContent.trim(); if (t) ns.push(t); } return ns.join(' ').replace(/\s+/g, ' ').trim(); });
await b.close();
const pie = fs.readFileSync(path.join(P, 'pie.txt'), 'utf8');
const voz = fs.readFileSync(path.join(P, 'guion-voz.txt'), 'utf8').replace(/\n/g, ' ');
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
  // marcas de terceros (modelos, plataformas, competidores): la lista de editor-videos. D-N1 (11-oct-2026, Sergio Urcullo): SE NOMBRAN, como uso propio y no como recomendación pagada,
  // SOLO los seis motores de imagen de la prueba (Seedream 4.5, Kling O1 Image, Nano Banana 2.1, Seedream 5.0 Pro, FLUX 3, GPT Image 2.5): salen de esta lista
  // ('seedream', 'kling', 'nano banana', 'banana', 'nano ', 'flux', 'gpt'). Todo lo demás sigue prohibido (incluido el nombre viejo «Omni» y «chatgpt»).
  'seedance', 'higgsfield', 'soul', 'cinema', 'veo', 'midjourney', 'runway', 'elevenlabs', 'sora', 'claude', 'chatgpt', 'omni', 'cinematic', 'start_image', 'start image', 'sync.so', 'sync_so', 'buffalo', 'insightface', 'arcface', 'scrfd', 'instagram', 'meta ', 'tiktok', 'buffer',
  // otras marcas que podrían aparecer en un rótulo
  'imagen 4', 'imagen 3', 'dall', 'stable diffusion', 'ideogram', 'recraft', 'leonardo', 'firefly', 'adobe', 'google', 'openai', 'anthropic', 'iphone', 'apple', 'samsung', 'pixel', 'grok', 'qwen', 'hunyuan', 'wan ', 'pika', 'luma', 'minimax', 'hailuo', 'vidu', 'marketing studio',
  // D-N1: nada que suene a «el mejor» o a recomendación general (la frase «no es una recomendación pagada» del pie es la única excepción, ver más abajo)
  'el mejor', 'la mejor', 'los mejores', 'las mejores', 'mejor motor', 'mejor opción', 'recomiendo', 'recomendamos', 'te recomiend', 'usá este', 'usen este',
];
let hits = 0;
for (const [donde, txt] of [['pantalla', enPantalla], ['pie', pie], ['voz', voz]]) {
  const low = txt.toLowerCase();
  for (const f of PROHIBIDAS) if (low.includes(f.toLowerCase())) { console.log(`✖ ${donde}: «${f}»`); hits++; }
}
console.log(`texto en pantalla (${enPantalla.split(' ').length} tokens): ${enPantalla}`);
console.log(`pie (${pie.trim().split(/\s+/).length} palabras); voz (${voz.trim().split(/\s+/).length} palabras)`);
// frases OBLIGATORIAS en pantalla (exactas) y retiradas
const OBLIGATORIAS = ['Seedream 4.5', 'Seedream 5.0 Pro', 'FLUX 3', 'Kling O1 Image', 'Nano Banana 2.1', 'GPT Image 2.5', 'Lucía Antelo · personaje IA de Onia', '¿Cuál conserva su cara?', 'Seguime: cada semana, una prueba.', 'Pagar más no mejoró el parecido.', 'Escena 2: Kling perdió la cara.', 'Una toma cada uno: es una prueba, no una regla.', 'Entre 0,66 y 0,70 la diferencia es ruido (±0,03).', 'mi piso · 0,70'];
for (const f of OBLIGATORIAS) { const ok = enPantalla.replace(/ +/g, ' ').includes(f); console.log(`  ${ok ? 'ok ' : '✖  '} obligatoria en pantalla: «${f}»`); if (!ok) hits++; }
for (const f of ['El café', 'café:', 'Motor ']) if (enPantalla.includes(f)) { console.log(`✖ pantalla: frase retirada «${f}»`); hits++; }
for (const [donde, txt] of [['pantalla', enPantalla], ['pie', pie], ['voz', voz]]) if (/\bImagen [A-F]\b/.test(txt)) { console.log(`✖ ${donde}: queda una «Imagen A-F»: desde D-N1 los motores van con su nombre`); hits++; }
if (!pie.includes('Nombro lo que uso; no es una recomendación pagada.')) { console.log('✖ pie: falta «Nombro lo que uso; no es una recomendación pagada.»'); hits++; } else console.log('  ok  el pie trae «Nombro lo que uso; no es una recomendación pagada.»');
if (!/^personaje hecho con ia/i.test(pie.trim())) { console.log('✖ pie: no abre con «personaje hecho con IA»'); hits++; } else console.log('  ok  el pie abre con «personaje hecho con IA»');
if (hits) { console.error(`✖ ${hits} coincidencia(s)`); process.exit(1); }
console.log('✔ ninguna frase prohibida ni marca de terceros en pantalla ni en el pie');
