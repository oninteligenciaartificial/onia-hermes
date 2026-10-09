#!/usr/bin/env node
// Hueco máximo entre EVENTOS VISUALES, medido desde plan.json (no a mano). Evento = entrada o acento de una tarjeta, rótulo de IA que sale, las
// miniaturas, las referencias, la escala y su marca, el dato / la pastilla / el sello de cada imagen, las filas de la lección 1 (fila, punto, valor), la nota 2 y la franja,
// la tabla, las fotos del café y el anillo de la lección 2, y cada costura (empuje). El empuje lento de las fotos no cuenta como evento:
// el hueco se mide igual, sin descontarlo. Uso: node scripts/eventos.mjs   (sale con 1 si algún hueco pasa de 3,0 s: «un evento visual cada 1,5-3 s»)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
const ev = new Map();
// los eventos los escribe build.mjs en qa/eventos-plan.json desde plan.json (tarjetas y acentos, rótulo, caja de cara, datos, filas, lupa, escala, notas, aros y costuras)
const add = (t, que) => { if (t > 0.2 && t < p.lienzo.duracion - 0.1) ev.set(+t.toFixed(3), (ev.get(+t.toFixed(3)) || []).concat(que)); };
for (const x of JSON.parse(fs.readFileSync(path.join(P, 'qa/eventos-plan.json'), 'utf8'))) add(x.t, x.que);
const ts = [0.125, ...[...ev.keys()].sort((a, b) => a - b), p.lienzo.duracion];
const gaps = [];
for (let i = 1; i < ts.length; i++) gaps.push({ a: ts[i - 1], b: ts[i], d: +(ts[i] - ts[i - 1]).toFixed(3) });
gaps.sort((x, y) => y.d - x.d);
console.log(`eventos visuales: ${ts.length - 2} (más el inicio 0,1 s y el final)`);
console.log('mayores huecos entre eventos:');
for (const x of gaps.slice(0, 8)) console.log(`  ${x.a.toFixed(2)} → ${x.b.toFixed(2)} s: ${x.d.toFixed(2)} s   (${(ev.get(x.a) || ['inicio']).join(', ')} → ${(ev.get(x.b) || ['fin']).join(', ')})`);
const max = gaps[0].d;
console.log(max <= 3.0 + 1e-9 ? `✔ hueco máximo ${max.toFixed(2)} s (≤ 3,0 s)` : `✖ hueco máximo ${max.toFixed(2)} s (> 3,0 s)`);
if (max > 3.0 + 1e-9) process.exit(1);
