#!/usr/bin/env node
// G5 v2 · EVENTOS visuales nuevos (regla de aire de la madre: «un evento visual nuevo —tarjeta, sello, empuje, zoom, contador— como máximo cada 2,0 s»).
// Los eventos los escribe build.mjs en qa/eventos-plan.json desde plan.json (entrada y acento de cada tarjeta, rótulo de IA que sale, caja de cara, pastillas,
// filas de referencias, flecha, escala, cursor, marca del piso, caja / lupa / punta / banda / aro y cada empuje). El empuje lento de las fotos NO cuenta como evento.
// Mide el mayor hueco entre eventos (incluidos el cuadro 0 y el final) y cuenta eventos por ventanas de 10 s. Imprime el resultado; sale con 1 si algún hueco pasa de 2,0 s.
// Uso: node scripts/eventos.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
const DUR = p.lienzo.cuadros / p.lienzo.fps, MAX = p.aire.evento_cada_max_s;
const ev = new Map();
for (const x of JSON.parse(fs.readFileSync(path.join(P, 'qa/eventos-plan.json'), 'utf8'))) { const k = +x.t.toFixed(3); if (k > 0 && k < DUR) ev.set(k, (ev.get(k) || []).concat(x.que)); }
const ts = [0, ...[...ev.keys()].sort((a, b) => a - b), DUR];
const gaps = [];
for (let i = 1; i < ts.length; i++) gaps.push({ a: ts[i - 1], b: ts[i], d: +(ts[i] - ts[i - 1]).toFixed(3) });
const orden = [...gaps].sort((x, y) => y.d - x.d);
console.log(`eventos visuales: ${ts.length - 2} en ${DUR.toFixed(3)} s (más el cuadro 0 y el final)`);
console.log('mayores huecos entre eventos:');
for (const x of orden.slice(0, 8)) console.log(`  ${x.a.toFixed(2)} → ${x.b.toFixed(2)} s: ${x.d.toFixed(2)} s   (${(ev.get(x.a) || ['cuadro 0']).join(', ')} → ${(ev.get(x.b) || ['fin']).join(', ')})`);
// eventos por cada 10 s (ventanas contiguas; la última, más corta, se prorratea a 10 s)
const evs = [...ev.keys()];
const por10 = [];
for (let t0 = 0; t0 < DUR - 1e-9; t0 += 10) { const t1 = Math.min(DUR, t0 + 10), n = evs.filter((t) => t >= t0 && t < t1).length; por10.push({ t0, t1, n, por10: n * 10 / (t1 - t0) }); }
for (const w of por10) console.log(`  ${w.t0.toFixed(0).padStart(2)}-${w.t1.toFixed(1).padStart(4)} s: ${w.n} eventos (${w.por10.toFixed(1)} por 10 s)`);
const global = (ts.length - 2) * 10 / DUR;
console.log(`eventos por 10 s (todo el video): ${global.toFixed(1)}`);
const max = orden[0].d;
console.log(max <= MAX + 1e-9 ? `✔ hueco máximo entre eventos ${max.toFixed(2)} s (≤ ${MAX.toFixed(1)} s)` : `✖ hueco máximo entre eventos ${max.toFixed(2)} s (> ${MAX.toFixed(1)} s)`);
if (max > MAX + 1e-9) process.exit(1);
