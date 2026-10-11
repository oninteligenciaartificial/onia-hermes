#!/usr/bin/env node
// Costuras rígidas de 6 cuadros, medidas en el DOM cuadro a cuadro: en cada empuje [T−6, T] el borde derecho de lo que sale tiene que tocar el borde izquierdo
// de lo que entra (cero tira vacía), lo que sale llega a x = −1080 y lo que entra a x = 0 en el cuadro T, y la ventana cae EXACTA en el hueco de 6 cuadros entre la
// voz de dos tramos (el empuje no pisa ninguna palabra). Uso: node scripts/costuras.mjs (sale con 1 si algo incumple)
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const require = createRequire('/opt/node-tools/package.json');
const { chromium } = require('playwright');
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan-resuelto.json'), 'utf8'));
const FPS = plan.lienzo.fps, PF = plan.empuje.cuadros;
const b = await chromium.launch({ executablePath: process.env.PRODUCER_HEADLESS_SHELL_PATH || '/opt/pw-browsers/chromium/chrome', args: ['--no-sandbox'] }).catch(async () => chromium.launch({ args: ['--no-sandbox'] }));
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.goto(pathToFileURL(path.join(P, 'index.html')).href);
await pg.evaluate(() => document.fonts.ready);
await pg.waitForTimeout(400);
let fallos = 0;
for (const c of plan.costuras) {
  const sale = c.sale.filter((i) => plan.escenas[i]), entra = c.entra.filter((i) => plan.escenas[i]);
  const filas = await pg.evaluate(([c, sale, entra, PF, FPS]) => {
    const tl = window.__timelines.main; tl.pause(); const out = [];
    const x = (id) => { const e = document.getElementById(id); const q = e.getBoundingClientRect(); return { l: q.left, r: q.right }; };
    for (let k = 0; k <= PF; k++) {
      const f = c.t_f - PF + k; tl.time(f / FPS);
      out.push({ f, s: sale.map(x), e: entra.map(x), cs: x(c.tarjetas.sale), ce: x(c.tarjetas.entra) });
    }
    return out;
  }, [c, sale, entra, PF, FPS]);
  const probs = [];
  for (const r of filas) {
    for (const s of r.s) for (const e of r.e) if (Math.abs(e.l - s.r) > 0.6) probs.push(`cuadro ${r.f}: tira de ${(e.l - s.r).toFixed(1)} px entre lo que sale y lo que entra`);
    if (Math.abs(r.ce.l - r.cs.r) < 0) probs.push('tarjetas pisadas');
  }
  const last = filas.at(-1), first = filas[0];
  for (const s of last.s) if (Math.abs(s.r) > 0.6) probs.push(`en T lo que sale termina en x=${s.r.toFixed(1)} (debe ser 0)`);
  for (const e of last.e) if (Math.abs(e.l) > 0.6) probs.push(`en T lo que entra empieza en x=${e.l.toFixed(1)} (debe ser 0)`);
  for (const e of first.e) if (Math.abs(e.l - 1080) > 0.6) probs.push(`en T−6 lo que entra empieza en x=${e.l.toFixed(1)} (debe ser 1080)`);
  const tr = plan.voz.tramos[+(/^T(\d+)/.exec(String(c.t_f)) || [])[1]];
  // el hueco de voz: el tramo cuyo inicio es T termina de hablar el cuadro anterior al empuje
  const ti = plan.voz.tramos.find((t) => t.a === c.t_f), tprev = plan.voz.tramos.find((t) => t.i === (ti ? ti.i - 1 : -1));
  if (!ti || !tprev || tprev.b !== c.t_f - PF) probs.push('el empuje no cae exacto en el hueco de voz entre dos tramos');
  const sepx = filas.map((r) => (r.e[0].l - r.s[0].r).toFixed(1)).join(' ');
  console.log(`${probs.length ? '✖' : 'ok'} T=${c.t.toFixed(3)} s (cuadros ${c.t_f - PF}-${c.t_f}) sale ${sale.join('+')} → entra ${entra.join('+')}; hueco de voz T${ti ? ti.i - 1 : '?'}→T${ti ? ti.i : '?'} (${tprev ? (tprev.b / FPS).toFixed(3) : '?'}–${(c.t_f / FPS).toFixed(3)} s); separación entre bordes por cuadro: ${sepx}${probs.length ? '\n   ' + probs.join('\n   ') : ''}`);
  if (probs.length) fallos++;
}
await b.close();
if (fallos) { console.error(`✖ ${fallos} costura(s) con problemas`); process.exit(1); }
console.log(`✔ las ${plan.costuras.length} costuras son empujes rígidos de ${PF} cuadros, pegados borde con borde y dentro del hueco de voz`);
