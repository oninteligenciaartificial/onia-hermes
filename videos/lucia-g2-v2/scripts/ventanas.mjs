#!/usr/bin/env node
// v2 (regla 15): ventana REAL en que cada texto no-tarjeta se puede leer, medida en el DOM cuadro a cuadro (24 fps), no desde plan.json.
// «Legible» = opacidad efectiva ≥ 0,9 y ≥ 95 % de su caja dentro del lienzo (en un empuje la caja se sale: ahí no cuenta). Compara con 0,35 s/palabra + 0,3.
// Complementa a build.mjs (que valida los tiempos del plan): este script ve lo que de verdad hace el timeline (entradas, empujes, salidas).
// Uso: node scripts/ventanas.mjs   (sale con 1 si alguna ventana no alcanza)
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const require = createRequire('/opt/node-tools/package.json');
const { chromium } = require('playwright');
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan.resuelto.json'), 'utf8'));
const FPS = plan.lienzo.fps, N = plan.lienzo.duracion * FPS;
const b = await chromium.launch({ executablePath: process.env.PRODUCER_HEADLESS_SHELL_PATH || '/opt/pw-browsers/chromium/chrome', args: ['--no-sandbox'] }).catch(async () => chromium.launch({ args: ['--no-sandbox'] }));
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.goto(pathToFileURL(path.join(P, 'index.html')).href);
await pg.evaluate(() => document.fonts.ready);
await pg.waitForTimeout(400);
// [id, texto, palabras]: todo texto que NO es tarjeta (rótulo, datos, sellos, etiquetas y placas); la lista sale de plan.resuelto.json → lecturas (build.mjs)
const items = plan.lecturas.map((x) => [x.id, x.texto, x.n]);
const res = await pg.evaluate(([items, N, FPS]) => {
  const tl = window.__timelines.main; tl.pause();
  const out = Object.fromEntries(items.map((i) => [i[0], []]));
  for (let f = 0; f < N; f++) {
    tl.time(f / FPS);
    for (const [id] of items) {
      const e = document.getElementById(id); if (!e) continue;
      let o = 1, n = e;
      while (n && n !== document.body) { const cs = getComputedStyle(n); o *= +cs.opacity; if (cs.visibility === 'hidden' || cs.display === 'none') o = 0; n = n.parentElement; }
      const clip = e.closest('.clip'); if (clip) { const a = +clip.dataset.start, d = +clip.dataset.duration, t = f / FPS; if (t < a - 1e-6 || t > a + d + 1e-6) o = 0; }
      const q = e.getBoundingClientRect(); const dentro = q.width ? Math.max(0, Math.min(q.right, 1080) - Math.max(q.left, 0)) / q.width : 0;
      if (o >= 0.9 && dentro >= 0.95) out[id].push(f);
    }
  }
  return out;
}, [items, N, FPS]);
await b.close();
let malos = 0;
console.log('ventana legible medida en el DOM (opacidad ≥ 0,9 y ≥ 95 % dentro del lienzo), cuadro a cuadro:');
for (const [id, txt, n] of items) {
  const fs_ = res[id]; if (!fs_.length) { console.log(`  ✖ ${id}: nunca legible`); malos++; continue; }
  const grupos = []; for (const f of fs_) { const g = grupos[grupos.length - 1]; if (g && f === g.at(-1) + 1) g.push(f); else grupos.push([f]); }
  const g = grupos.sort((x, y) => y.length - x.length)[0], dur = g.length / FPS, min = n * 0.35 + 0.3;
  const ok = dur >= min - 1e-9; if (!ok) malos++;
  console.log(`  ${ok ? 'ok ' : '✖  '} ${id.padEnd(8)} ${String(n).padStart(2)} pal  ${(g[0] / FPS).toFixed(2)}–${((g.at(-1) + 1) / FPS).toFixed(2)} s  ${dur.toFixed(2)} s (pide ${min.toFixed(2)})  «${txt}»`);
}
if (malos) { console.error(`✖ ${malos} ventana(s) cortas`); process.exit(1); }
console.log('✔ todas las ventanas medidas alcanzan la regla de lectura');
