#!/usr/bin/env node
// G5 v2 · AIRE MUERTO medido en el DOM, cuadro a cuadro (24 fps). Regla de la madre (regla 15): «ningún tramo de más de 0,3 s con la pantalla idéntica y sin una
// tarjeta en lectura; una tarjeta puede quedarse en pantalla solo durante su tiempo de lectura (0,35 s por palabra + 0,3 s)».
// Cómo se mide: se lleva el timeline a cada cuadro y se arma la FIRMA de lo que se ve: de todo elemento que el timeline anima y está a la vista (opacidad efectiva > 0,01
// y caja dentro del lienzo) se anota su opacidad, sus colores y su caja redondeada a 0,5 px. Se EXCLUYE el empuje lento 1,00 → 1,04 de las fotos (la <img> y su caja de cara):
// no cuenta como cambio, así que el criterio es MÁS estricto que mirar píxeles (un tramo con foto y sin eventos sale como quieto aunque la foto se acerque).
// Un cuadro es «quieto» si su firma es igual a la del cuadro anterior. Un tramo quieto de k cuadros iguales dura k/24 s.
// «Tarjeta en lectura» = desde el primer cuadro en que la tarjeta es legible (opacidad ≥ 0,9 y ≥ 95 % dentro del lienzo, como ventanas.mjs) hasta 0,35 s × palabras + 0,3 s después.
// Uso: node scripts/aire.mjs   → imprime el resultado, escribe qa/lectura-tarjetas.json (para aire.py, que mide los píxeles del render) y sale con 1 si algún tramo
//      quieto fuera de una lectura pasa de 0,3 s.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const require = createRequire('/opt/node-tools/package.json');
const { chromium } = require('playwright');
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
const FPS = plan.lienzo.fps, N = plan.lienzo.cuadros, MAXQ = plan.aire.quieto_max_s;
const b = await chromium.launch({ executablePath: process.env.PRODUCER_HEADLESS_SHELL_PATH || '/opt/pw-browsers/chromium/chrome', args: ['--no-sandbox'] }).catch(async () => chromium.launch({ args: ['--no-sandbox'] }));
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.goto(pathToFileURL(path.join(P, 'index.html')).href);
await pg.evaluate(() => document.fonts.ready);
await pg.waitForTimeout(400);
const nPal = Object.fromEntries(plan.tarjetas.map((c) => [c.id, `${c.texto} ${c.acento || ''}`.trim().split(/\s+/).filter((s) => s && s !== '·').length]));
const res = await pg.evaluate(([N, FPS, ids]) => {
  const tl = window.__timelines.main; tl.pause();
  // elementos que el timeline anima (sin el empuje lento de las fotos: la <img id="…-i"> y la caja de cara .fz)
  const set = new Set();
  for (const tw of tl.getChildren(true, true, false)) for (const e of tw.targets()) if (e instanceof Element) set.add(e);
  const objetivos = [...set].filter((e) => !/-i$/.test(e.id) && !e.classList.contains('fz'));
  const efectivo = (e, t) => {
    let o = 1, n = e;
    while (n && n !== document.body) {
      const cs = getComputedStyle(n); o *= +cs.opacity;
      if (cs.visibility === 'hidden' || cs.display === 'none') return 0;
      if (n.classList && n.classList.contains('clip')) { const a = +n.dataset.start, d = +n.dataset.duration; if (t < a - 1e-6 || t > a + d + 1e-6) return 0; }
      n = n.parentElement;
    }
    return o;
  };
  const firmas = [], legible = Object.fromEntries(ids.map((i) => [i, []]));
  for (let f = 0; f < N; f++) {
    const t = f / FPS; tl.time(t);
    const partes = [];
    objetivos.forEach((e, i) => {
      const o = efectivo(e, t); if (o < 0.01) return;
      const q = e.getBoundingClientRect();
      const dentro = Math.max(0, Math.min(q.right, 1080) - Math.max(q.left, 0)) * Math.max(0, Math.min(q.bottom, 1920) - Math.max(q.top, 0));
      if (dentro < 4) return;
      const cs = getComputedStyle(e);
      const enFoto = !!e.closest('.ph');                                   // la caja de cara de una foto se agranda con el empuje lento: ahí no cuenta su caja
      partes.push(`${i}|${o.toFixed(2)}|${cs.color}|${cs.backgroundColor}|${cs.borderTopColor}|${enFoto ? '' : [q.left, q.top, q.width, q.height].map((v) => Math.round(v * 2) / 2).join(',')}`);
    });
    firmas.push(partes.join(';'));
    for (const id of ids) {
      const e = document.getElementById(id); const o = efectivo(e, t); if (o < 0.9) continue;
      const q = e.getBoundingClientRect(); const dentro = q.width ? Math.max(0, Math.min(q.right, 1080) - Math.max(q.left, 0)) / q.width : 0;
      if (dentro >= 0.95) legible[id].push(f);
    }
  }
  return { firmas, legible, n: objetivos.length };
}, [N, FPS, plan.tarjetas.map((c) => c.id)]);
await b.close();
const { firmas, legible } = res;
// ventana de lectura de cada tarjeta
const lectura = plan.tarjetas.map((c) => {
  const fs_ = legible[c.id]; const f0 = fs_[0] ?? Math.round(c.a * FPS);
  return { id: c.id, n: nPal[c.id], legible_desde: f0 / FPS, lee_hasta: f0 / FPS + nPal[c.id] * 0.35 + 0.3, a: c.a, b: c.b };
});
fs.writeFileSync(path.join(P, 'qa/lectura-tarjetas.json'), JSON.stringify(lectura, null, 1));
const enLectura = (f) => lectura.find((l) => f / FPS >= l.legible_desde - 1e-9 && f / FPS < l.lee_hasta - 1e-9);
// cuadros quietos y tramos
const quieto = firmas.map((s, f) => f > 0 && s === firmas[f - 1]);
const tramos = (excluirLectura) => {
  const out = []; let cur = null;
  for (let f = 0; f < N; f++) {
    const q = quieto[f] && !(excluirLectura && enLectura(f));
    if (q) { if (!cur) cur = { f0: f - 1, f1: f }; else cur.f1 = f; } else if (cur) { out.push(cur); cur = null; }
  }
  if (cur) out.push(cur);
  return out.map((r) => ({ ...r, n: r.f1 - r.f0 + 1, dur: (r.f1 - r.f0 + 1) / FPS }));   // k cuadros iguales = k / 24 s
};
const crudo = tramos(false).sort((x, y) => y.dur - x.dur), muerto = tramos(true).sort((x, y) => y.dur - x.dur);
const fmt = (r) => `${(r.f0 / FPS).toFixed(3)}–${((r.f1 + 1) / FPS).toFixed(3)} s (${r.n} cuadros iguales = ${r.dur.toFixed(3)} s)`;
const cual = (r) => { const l = lectura.find((x) => r.f0 / FPS >= x.a - 1e-6 && r.f0 / FPS < x.b); return l ? l.id : '—'; };
console.log(`firma de ${res.n} elementos animados, ${N} cuadros; empuje lento de las fotos EXCLUIDO (criterio más estricto que mirar píxeles)`);
console.log('ventanas de lectura de las tarjetas (legible → fin de lectura = 0,35 s × palabras + 0,3 s):');
for (const l of lectura) console.log(`  ${l.id.padEnd(4)} ${String(l.n).padStart(2)} pal  ${l.legible_desde.toFixed(3)} → ${l.lee_hasta.toFixed(3)} s  (tarjeta en pantalla ${l.a.toFixed(3)}–${l.b.toFixed(3)})`);
console.log(`\nSIN descontar la lectura de tarjetas: ${crudo.length} tramos quietos; los mayores:`);
for (const r of crudo.slice(0, 6)) console.log(`  ${fmt(r)}  en ${cual(r)}`);
console.log(`\nDESCONTANDO la lectura de tarjetas (regla de aire): ${muerto.length} tramos; los mayores:`);
for (const r of muerto.slice(0, 8)) console.log(`  ${fmt(r)}  en ${cual(r)}`);
const mx = muerto[0]?.dur ?? 0;
console.log(`\nMAYOR TRAMO QUIETO fuera de una lectura: ${mx.toFixed(3)} s (límite ${MAXQ} s)`);
console.log(`MAYOR TRAMO QUIETO contando las lecturas (pantalla idéntica con una tarjeta en lectura): ${(crudo[0]?.dur ?? 0).toFixed(3)} s`);
if (mx > MAXQ + 1e-9) { console.error(`✖ hay aire muerto: ${mx.toFixed(3)} s > ${MAXQ} s`); process.exit(1); }
console.log(`✔ ningún tramo quieto de más de ${MAXQ} s fuera del tiempo de lectura de una tarjeta`);
