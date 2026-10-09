#!/usr/bin/env node
// G4 (de G2): ventana REAL en que cada texto no-tarjeta se puede leer, medida en el DOM cuadro a cuadro (24 fps), no desde plan.json.
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
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
const FPS = plan.lienzo.fps, N = plan.lienzo.duracion * FPS;
const b = await chromium.launch({ executablePath: process.env.PRODUCER_HEADLESS_SHELL_PATH || '/opt/pw-browsers/chromium/chrome', args: ['--no-sandbox'] }).catch(async () => chromium.launch({ args: ['--no-sandbox'] }));
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.goto(pathToFileURL(path.join(P, 'index.html')).href);
await pg.evaluate(() => document.fonts.ready);
await pg.waitForTimeout(400);
// ids de TODO texto que no es tarjeta; las palabras se cuentan en el DOM (sin «·» ni «→»)
const ids = ['rotulo', 'sc-mkl', 'sc-ax1', 'l1-mkl', 'l1-nota', 'l2-tag'];
for (const m of plan.imagenes) { ids.push('dA-' + m.id); if (m.sello) ids.push('s-' + m.id); if (m.pastilla) ids.push('p-' + m.id); }
for (let i = 1; i <= plan.l1.filas.length; i++) ids.push('l1-t' + i, 'l1-v' + i);
for (const c of plan.l2.chips.lista) ids.push('l2-ch' + c.n);
for (let i = 1; i <= plan.l2.fotos.lista.length; i++) ids.push('l2-cap' + i);
// el texto se arma nodo por nodo (con un espacio entre elementos): «Escena 1» + «0,79» son 3 palabras aunque textContent las pegue
const items = await pg.evaluate((ids) => ids.map((id) => { const e = document.getElementById(id); const ns = []; if (e) { const w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT); while (w.nextNode()) ns.push(w.currentNode.textContent.trim()); } const t = ns.filter(Boolean).join(' '); return [id, t, t.split(/\s+/).filter((x) => x && x !== '·' && x !== '→').length]; }), ids);
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
