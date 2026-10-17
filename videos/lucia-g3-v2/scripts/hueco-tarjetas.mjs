#!/usr/bin/env node
// H8: cuadros SIN tarjeta narrativa visible. Lleva el timeline a cada cuadro (24 fps) y mira la opacidad real de cada tarjeta (#c1…#c15).
// Un cuadro cuenta como «con tarjeta» si alguna tiene opacidad ≥ 0,05 (visibility visible) Y está a la vista (3ra pasada: ≥ 25 % de su caja dentro del lienzo).
// v2: NO se permite ningún hueco, ni siquiera el arranque (el gancho está ya en el cuadro 0).
// Uso: node scripts/hueco-tarjetas.mjs    (sale con 1 si aparece algún cuadro sin tarjeta)
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
const ids = plan.tarjetas.map((c) => c.id);
const huecos = await pg.evaluate(([ids, N, FPS]) => {
  const out = [];
  const tl = window.__timelines.main; tl.pause();
  for (let f = 0; f < N; f++) {
    tl.time(f / FPS);
    // el clip contenedor (cc-<id>) lo prende el runtime según data-start; acá se mide la opacidad que da el timeline
    // 3ra pasada (C4): además de la opacidad, la tarjeta tiene que estar A LA VISTA (≥ 25 % de su caja dentro del lienzo): una tarjeta que ya salió
    // con el empuje (x −1080) sigue con opacidad 1 pero no se ve, y no cuenta.
    const vis = ids.filter((id) => {
      const e = document.getElementById(id); if (!e) return false; const cs = getComputedStyle(e);
      if (cs.visibility === 'hidden' || +cs.opacity < 0.05) return false;
      const q = e.getBoundingClientRect(); if (q.width < 1) return false;
      const dentro = Math.max(0, Math.min(q.right, 1080) - Math.max(q.left, 0)) / q.width;
      return dentro >= 0.25;
    });
    if (!vis.length) out.push(f);
  }
  return out;
}, [ids, N, FPS]);
await b.close();
const grupos = [];
for (const f of huecos) { const g = grupos[grupos.length - 1]; if (g && f === g.at(-1) + 1) g.push(f); else grupos.push([f]); }
const permitido = () => false;   // v2: ningún hueco
console.log(`cuadros sin tarjeta narrativa visible: ${huecos.length} de ${N}`);
for (const g of grupos) console.log(`  cuadros ${g[0]}–${g.at(-1)} (${(g[0] / FPS).toFixed(3)}–${((g.at(-1) + 1) / FPS).toFixed(3)} s, ${g.length} cuadro(s)) ✖ HUECO`);
const malos = grupos.filter((g) => !permitido(g));
if (malos.length) { console.error(`✖ ${malos.length} hueco(s) de tarjeta`); process.exit(1); }
console.log(`✔ los ${N} cuadros (del 0 al ${N - 1}) tienen una tarjeta visible (opacidad ≥ 5 % y ≥ 25 % de su caja en el lienzo)`);
