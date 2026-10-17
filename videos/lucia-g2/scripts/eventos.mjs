#!/usr/bin/env node
// Hueco máximo entre EVENTOS VISUALES, medido desde plan.json (no a mano). Evento = entrada o acento de una tarjeta, rótulo de IA que sale, las
// miniaturas, las referencias, la escala y su marca, las filas y barras de las placas, el resalte y el cambio de rótulos, el dato y el sello de
// cada motor, el aro, el punto y el sello de la placa del Motor 6 y cada costura (empuje). Los clips se mueven solos: el hueco se mide igual,
// sin descontarlos. Uso: node scripts/eventos.mjs   (sale con 1 si algún hueco pasa de 3,0 s: «un evento visual cada 1,5-3 s»)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
const ev = new Map();
const add = (t, que) => { if (t > 0.2 && t < 57.9) ev.set(+t.toFixed(3), (ev.get(+t.toFixed(3)) || []).concat(que)); };
for (const c of p.tarjetas) { add(c.a, c.id); if (c.acento_t) add(c.acento_t, c.id + ' acento'); }
add(p.rotulo.b, 'rótulo IA sale');
const g = p.gancho.miniaturas; for (let i = 0; i < p.motores.length; i++) add(g.a + i * g.escalon, 'miniatura ' + (i + 1));
const rg = p.regla; for (let i = 0; i < p.refs.muestra.length; i++) add(rg.refs.a + i * rg.refs.escalon, 'ref ' + (i + 1));
add(rg.refs.etiqueta_t, 'etiqueta refs'); add(rg.escala.a, 'escala'); add(rg.escala.uno_t, '«1» se enciende'); add(rg.escala.marca_t, 'marca 0,70');
const l1 = p.l1; add(l1.marca_t, 'l1 marca'); add(l1.leyenda_t, 'l1 leyenda'); add(l1.leyenda_t + 0.15, 'l1 nota del final');
for (const f of l1.filas) { add(f.t, 'l1 fila ' + f.motor); add(f.t + 0.5, 'l1 final baja ' + f.motor); add(f.t + 1.0, 'l1 valor ' + f.motor); }
const l2 = p.l2; add(l2.marca_t, 'l2 marca');
l2.orden.forEach((id, i) => add(l2.barra.t0 + i * l2.barra.escalon, 'l2 barra ' + id));
add(l2.resalte_t, 'l2 resalte'); for (const c of l2.cambios) add(c.t, 'l2 cambio ' + c.motor); add(l2.nota.t, 'l2 nota');
const q = p.m6plate; add(q.escala_t, 'm6 escala'); add(q.punto_t, 'm6 punto'); add(q.sello_t, 'm6 sello 4×');
for (const m of p.motores) { add(m.tag_a, m.id + ' dato A'); if (!m.sin_b) add(m.tag_b, m.id + ' dato B'); if (m.sello) add(m.sello.t, m.id + ' sello'); if (m.pastilla) add(m.pastilla.t, m.id + ' pastilla'); add(m.tags_fin, m.id + ' dato sale'); }
add(p.aro_m4.a, 'aro'); for (const pt of p.aro_m4.puntos.slice(1)) add(pt.t, 'aro sigue'); add(p.aro_m4.b, 'aro sale');
for (const c of p.costuras) add(c.t, 'costura');
const ts = [0.1, ...[...ev.keys()].sort((a, b) => a - b), 58];
const gaps = [];
for (let i = 1; i < ts.length; i++) gaps.push({ a: ts[i - 1], b: ts[i], d: +(ts[i] - ts[i - 1]).toFixed(3) });
gaps.sort((x, y) => y.d - x.d);
console.log(`eventos visuales: ${ts.length - 2} (más el inicio 0,1 s y el final 58 s)`);
console.log('mayores huecos entre eventos:');
for (const x of gaps.slice(0, 8)) console.log(`  ${x.a.toFixed(2)} → ${x.b.toFixed(2)} s: ${x.d.toFixed(2)} s   (${(ev.get(x.a) || ['inicio']).join(', ')} → ${(ev.get(x.b) || ['fin']).join(', ')})`);
const max = gaps[0].d;
console.log(max <= 3.0 + 1e-9 ? `✔ hueco máximo ${max.toFixed(2)} s (≤ 3,0 s)` : `✖ hueco máximo ${max.toFixed(2)} s (> 3,0 s)`);
if (max > 3.0 + 1e-9) process.exit(1);
