#!/usr/bin/env node
// Ventana REAL en que cada texto se puede leer, medida en el DOM cuadro a cuadro (24 fps), no desde plan.json: tarjetas, rótulo de IA, etiquetas, leyenda del
// recorte, sello y rótulo del visor. «Legible» = opacidad efectiva ≥ 0,9 y ≥ 95 % de su caja dentro del lienzo (en un empuje la caja se sale: ahí no cuenta;
// por eso una tarjeta que SALE con un empuje tiene 6 cuadros menos). Compara con 0,35 s/palabra + 0,3. Las palabras se cuentan con un TreeWalker sobre los
// nodos de texto (textContent pega hermanos). El rótulo de IA, además, tiene que verse desde el cuadro 0 y durante 3 s completos.
// Uso: node scripts/ventanas.mjs   (sale con 1 si alguna ventana no alcanza)
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const require = createRequire('/opt/node-tools/package.json');
const { chromium } = require('playwright');
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan-resuelto.json'), 'utf8'));
const FPS = plan.lienzo.fps, N = plan.lienzo.cuadros;
const b = await chromium.launch({ executablePath: process.env.PRODUCER_HEADLESS_SHELL_PATH || '/opt/pw-browsers/chromium/chrome', args: ['--no-sandbox'] }).catch(async () => chromium.launch({ args: ['--no-sandbox'] }));
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.goto(pathToFileURL(path.join(P, 'index.html')).href);
await pg.evaluate(() => document.fonts.ready);
await pg.waitForTimeout(400);
const ids = [
  ...plan.tarjetas.map((c) => `#${c.id} .card`), '#rotulo .tag', ...plan.etiquetas.map((e) => `#${e.id} .tag`), '#capL', '#sello', '#visor .vn',
];
const res = await pg.evaluate(([ids, N, FPS]) => {
  const tl = window.__timelines.main; tl.pause();
  const palabras = (e) => { const w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT); let n = 0, t; while ((t = w.nextNode())) n += t.textContent.split(/\s+/).filter((s) => s && s !== '·').length; return n; };
  const out = Object.fromEntries(ids.map((i) => [i, { n: palabras(document.querySelector(i)), txt: document.querySelector(i).textContent.replace(/\s+/g, ' ').trim(), f: [] }]));
  for (let f = 0; f < N; f++) {
    tl.time(f / FPS);
    for (const sel of ids) {
      const e = document.querySelector(sel); if (!e) continue;
      let o = 1, n = e;
      while (n && n !== document.body) { const cs = getComputedStyle(n); o *= +cs.opacity; if (cs.visibility === 'hidden' || cs.display === 'none') o = 0; n = n.parentElement; }
      const clip = e.closest('.clip'); if (clip) { const a = +clip.dataset.start, d = +clip.dataset.duration, t = f / FPS; if (t < a - 1e-6 || t > a + d + 1e-6) o = 0; }
      const q = e.getBoundingClientRect(); const dentro = q.width ? Math.max(0, Math.min(q.right, 1080) - Math.max(q.left, 0)) / q.width : 0;
      if (o >= 0.9 && dentro >= 0.95) out[sel].f.push(f);
    }
  }
  return out;
}, [ids, N, FPS]);
await b.close();
let malos = 0;
console.log('ventana legible medida en el DOM (opacidad ≥ 0,9 y ≥ 95 % dentro del lienzo), cuadro a cuadro:');
for (const sel of ids) {
  const { n, txt, f } = res[sel];
  if (!f.length) { console.log(`  ✖ ${sel}: nunca legible`); malos++; continue; }
  const grupos = []; for (const x of f) { const g = grupos[grupos.length - 1]; if (g && x === g.at(-1) + 1) g.push(x); else grupos.push([x]); }
  const g = grupos.sort((x, y) => y.length - x.length)[0], dur = g.length / FPS;
  const rotulo = sel === '#rotulo .tag';
  const min = rotulo ? 3.0 : n * 0.35 + 0.3;
  let ok = dur >= min - 1e-9;
  if (rotulo && g[0] !== 0) ok = false;
  if (!ok) malos++;
  console.log(`  ${ok ? 'ok ' : '✖  '} ${sel.padEnd(18)} ${String(n).padStart(2)} pal  ${(g[0] / FPS).toFixed(2)}–${((g.at(-1) + 1) / FPS).toFixed(2)} s  ${dur.toFixed(2)} s (pide ${min.toFixed(2)}${rotulo ? ', desde el cuadro 0' : ''})  «${txt.slice(0, 44)}»`);
}
if (malos) { console.error(`✖ ${malos} ventana(s) cortas`); process.exit(1); }
console.log('✔ todas las ventanas medidas alcanzan la regla de lectura');
