#!/usr/bin/env node
// Grep de frases prohibidas (editor-videos § «Reels de Lucía» + plan v5 §2) sobre TODO el texto en pantalla (tarjetas, rótulo, etiquetas,
// panel, placa, sello) y sobre el pie. Sale con 1 si algo coincide. G4: se suman los nombres de los motores de imagen y de los teléfonos.
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
const voz = fs.readFileSync(path.join(P, 'guion-voz.txt'), 'utf8');       // G5 v2: la voz que se generará después también se revisa
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
  // G5: el programa solo compara dos caras: no «reconoce» a nadie (el guion lo prohíbe afirmar)
  'reconoc', 'identifica a', 'verifica que es',
  // 3ra pasada: frases retiradas (afirman más de lo que el video demuestra o son ambiguas)
  'baja sola', 'poco confiable', 'orden de magnitud', 'se parece poco', 'es ruido', 'no es fiable', 'lo inventó la ia',
  // marcas de terceros (modelos, plataformas, competidores): la lista de editor-videos + los motores de la prueba de G2
  'kling', 'seedream', 'seedance', 'higgsfield', 'soul', 'nano banana', 'cinema', 'veo', 'midjourney', 'runway', 'elevenlabs', 'sora', 'gpt', 'claude', 'chatgpt', 'omni', 'flux', 'cinematic', 'start_image', 'start image', 'sync.so', 'sync_so', 'buffalo', 'insightface', 'arcface', 'scrfd', 'instagram', 'meta ', 'tiktok', 'buffer',
  // G4: motores de imagen y otras marcas que podrían aparecer en un rótulo (los motores van solo como «Imagen A a F»)
  'banana', 'nano ', 'seedream', 'imagen 4', 'imagen 3', 'dall', 'stable diffusion', 'ideogram', 'recraft', 'leonardo', 'firefly', 'adobe', 'google', 'openai', 'anthropic', 'iphone', 'apple', 'samsung', 'pixel', 'grok', 'qwen', 'hunyuan', 'wan ', 'pika', 'luma', 'minimax', 'hailuo', 'vidu', 'marketing studio',
];
// D-N1 (11-oct-2026, Sergio Urcullo): SOLO estas herramientas se pueden nombrar, con su nombre completo, como uso propio y no como recomendación pagada. Se quitan del texto antes de buscar
// las prohibidas (así «kling», «seedream», «seedance», «cinematic», «gpt», «flux» o «nano banana» sueltos, y toda otra marca, siguen prohibidos).
// Revisión 1 (11-oct, H9): «ArcFace» (el modelo abierto que mide el parecido; el guion G5 aprobado lo permite) se puede NOMBRAR en el pie; scrfd, buffalo e insightface siguen prohibidos.
const PERMITIDAS = ['ArcFace', 'Seedance 2.0 Mini + referencias', 'Seedance 2.0 Mini', 'Cinematic Studio 3.0', 'Nano Banana 2.1', 'Seedream 5.0 Pro', 'Kling O1 Image', 'GPT Image 2.5', 'Kling 3.0 std', 'Kling 3.0 pro', 'Seedream 4.5', 'Kling O3', 'FLUX 3'];
const sinPermitidas = (t) => PERMITIDAS.reduce((x, n) => x.split(new RegExp(n.replace(/[.+*?^${}()|[\]\\]/g, '\\$&'), 'gi')).join(' '), t);
// frases que suenan a «el mejor» o a recomendación general (siguen prohibidas con los nombres permitidos)
const MEJOR = ['el mejor', 'la mejor', 'los mejores', 'lo mejor', 'recomiend', 'recomendamos', 'te conviene', 'usá este', 'mejor que'];
let hits = 0;
const nombradas = PERMITIDAS.filter((n) => [enPantalla, pie, voz].some((t) => t.toLowerCase().includes(n.toLowerCase())));
console.log(`herramientas nombradas (permitidas por D-N1): ${nombradas.join(' / ') || 'ninguna'}`);
for (const [donde, txt0] of [['pantalla', enPantalla], ['pie', pie], ['voz', voz]]) {
  const txt = sinPermitidas(txt0);
  const low = txt.toLowerCase();
  for (const f of MEJOR) if (low.includes(f) && !(donde === 'pie' && f.startsWith('recomend'))) { console.log(`✖ ${donde}: suena a «el mejor» o a recomendación: «${f}»`); hits++; }
  for (const f of PROHIBIDAS) if (low.includes(f.toLowerCase())) { console.log(`✖ ${donde}: «${f}»`); hits++; }
}
console.log(`texto en pantalla (${enPantalla.split(' ').length} tokens): ${enPantalla}`);
console.log(`pie (${pie.trim().split(/\s+/).length} palabras)`);
console.log(`voz (${voz.trim().split(/\s+/).length} palabras): ${voz.trim().replace(/\n/g, ' / ')}`);
if (hits) { console.error(`✖ ${hits} coincidencia(s)`); process.exit(1); }
console.log('✔ ninguna frase prohibida, ninguna marca de terceros fuera de las herramientas permitidas por D-N1, y nada que suene a «el mejor» o a recomendación, en pantalla, pie ni voz');
