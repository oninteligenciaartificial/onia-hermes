#!/usr/bin/env node
// Costuras RÍGIDAS de 6 cuadros, medidas en el DOM (no a ojo): en cada uno de los 6 empujes, cuadro a cuadro de T−6 a T,
//  · el medio que sale y el que entra están pegados borde con borde (borde derecho del que sale = borde izquierdo del que entra, ±0,75 px);
//  · no queda ninguna tira de fondo (el que sale cubre desde x ≤ 0 y el que entra llega hasta x ≥ 1080);
//  · el empuje dura exactamente 6 cuadros: en T−6 el que sale está en 0 y el que entra en +1080; en T el que sale está en −1080 y el que entra en 0;
//  · antes y después del empuje los dos están quietos (cuadro T−7: saliente en 0; cuadro T+1: entrante en 0).
// Uso: node scripts/costuras.mjs   (sale con 1 si alguna costura incumple)
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const require = createRequire('/opt/node-tools/package.json');
const { chromium } = require('playwright');
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan.resuelto.json'), 'utf8'));
const FPS = plan.lienzo.fps, W = plan.lienzo.w, K = plan.empuje.cuadros;
const medios = new Set(plan.medios.map((m) => m.id));
const b = await chromium.launch({ executablePath: process.env.PRODUCER_HEADLESS_SHELL_PATH || '/opt/pw-browsers/chromium/chrome', args: ['--no-sandbox'] }).catch(async () => chromium.launch({ args: ['--no-sandbox'] }));
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.goto(pathToFileURL(path.join(P, 'index.html')).href);
await pg.evaluate(() => document.fonts.ready);
await pg.waitForTimeout(400);
let malos = 0;
const falla = (m) => { malos++; console.log('  ✖ ' + m); };
for (const c of plan.costuras.filter((x) => x.tipo === 'empuje')) {
  const sale = c.sale.find((i) => medios.has(i)), entra = c.entra.find((i) => medios.has(i));
  const T = Math.round(c.t * FPS);
  const filas = await pg.evaluate(([sale, entra, T, K, FPS]) => {
    const tl = window.__timelines.main; tl.pause();
    const out = [];
    for (let k = -1; k <= K + 1; k++) {
      tl.time((T - K + k) / FPS);
      const a = document.getElementById(sale).getBoundingClientRect(), e = document.getElementById(entra).getBoundingClientRect();
      out.push({ k, aL: a.left, aR: a.right, eL: e.left, eR: e.right });
    }
    return out;
  }, [sale, entra, T, K, FPS]);
  const lin = filas.map((f) => `${f.k >= 0 && f.k <= K ? f.k : f.k < 0 ? 'ant' : 'des'}:${f.aR.toFixed(0)}|${f.eL.toFixed(0)}`).join('  ');
  console.log(`empuje ${(c.t - K / FPS).toFixed(3)}→${c.t.toFixed(3)} s  ${sale} → ${entra}   (borde der. saliente | borde izq. entrante)  ${lin}`);
  for (const f of filas) {
    if (f.k >= 0 && f.k <= K) {
      if (Math.abs(f.aR - f.eL) > 0.75) falla(`${sale}→${entra} cuadro ${f.k}: borde saliente ${f.aR.toFixed(1)} y entrante ${f.eL.toFixed(1)} (tira de ${(f.eL - f.aR).toFixed(1)} px)`);
      if (f.aL > 0.75 && f.k > 0) falla(`${sale} cuadro ${f.k}: deja ver fondo a la izquierda (${f.aL.toFixed(1)} px)`);
      if (f.eR < W - 0.75 && f.k < K) falla(`${entra} cuadro ${f.k}: deja ver fondo a la derecha (${f.eR.toFixed(1)} px)`);
    }
  }
  const f0 = filas.find((f) => f.k === 0), fK = filas.find((f) => f.k === K), fa = filas.find((f) => f.k === -1), fd = filas.find((f) => f.k === K + 1);
  if (Math.abs(f0.aL) > 0.75 || Math.abs(f0.eL - W) > 0.75) falla(`${sale}→${entra}: el cuadro T−6 no está en reposo (saliente ${f0.aL.toFixed(1)}, entrante ${f0.eL.toFixed(1)})`);
  if (Math.abs(fK.aR) > 0.75 || Math.abs(fK.eL) > 0.75) falla(`${sale}→${entra}: el cuadro T no terminó (saliente ${fK.aR.toFixed(1)}, entrante ${fK.eL.toFixed(1)})`);
  if (Math.abs(fa.aL) > 0.75) falla(`${sale}: ya se mueve antes del empuje (cuadro T−7 en ${fa.aL.toFixed(1)})`);
  if (Math.abs(fd.eL) > 0.75) falla(`${entra}: se sigue moviendo después del empuje (cuadro T+1 en ${fd.eL.toFixed(1)})`);
}
await b.close();
if (malos) { console.error(`✖ ${malos} incumplimiento(s)`); process.exit(1); }
console.log(`✔ ${plan.costuras.length} empujes rígidos de ${K} cuadros: borde con borde, sin tiras de fondo, en reposo antes y después`);
