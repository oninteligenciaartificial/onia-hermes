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
const add = (t, que) => { if (t > 0.2 && t < p.lienzo.duracion - 0.1) ev.set(+t.toFixed(3), (ev.get(+t.toFixed(3)) || []).concat(que)); };
for (const c of p.tarjetas) { add(c.a, c.id); if (c.acento_t) add(c.acento_t, c.id + ' acento'); }
add(p.rotulo.b, 'rótulo IA sale');
const g = p.gancho.miniaturas; p.imagenes.forEach((m, i) => add(g.a + i * g.escalon, 'miniatura ' + m.letra));
const rg = p.regla; for (let i = 0; i < p.refs.recortes.length; i++) add(rg.refs.a + i * rg.refs.escalon, 'ref ' + (i + 1));
add(rg.escala.a, 'escala'); add(rg.escala.uno_t, '«1» se enciende'); add(rg.escala.marca_t, 'marca 0,70');
for (const m of p.imagenes) { add(m.tag_t, m.letra + ' dato'); if (m.sello) add(m.sello.t, m.letra + ' sello'); if (m.pastilla) add(m.pastilla.t, m.letra + ' pastilla'); add(m.fin, m.letra + ' dato sale'); }
const l1 = p.l1; add(l1.nota2.t, 'l1 nota 2'); add(l1.ruido.t, 'l1 franja de ruido');
for (const f of l1.filas) { add(f.t, 'l1 fila ' + f.img); add(f.t + 0.1, 'l1 punto ' + f.img); add(f.t + 0.2, 'l1 valor ' + f.img); }
const l2 = p.l2; for (const f of l2.tabla.filas) { if (f.etiqueta_t != null) add(f.etiqueta_t, 'l2 etiqueta ' + f.img); for (const c of f.celdas) add(c.t, `l2 ${f.img}${c.n}`); }
for (const f of l2.fotos.lista) { add(f.t, 'l2 foto ' + f.letra); add(f.cap_t, 'l2 pie ' + f.letra); } add(l2.anillo_t, 'l2 anillo');
for (const c of p.costuras) add(c.t, 'costura');
const ts = [0.1, ...[...ev.keys()].sort((a, b) => a - b), p.lienzo.duracion];
const gaps = [];
for (let i = 1; i < ts.length; i++) gaps.push({ a: ts[i - 1], b: ts[i], d: +(ts[i] - ts[i - 1]).toFixed(3) });
gaps.sort((x, y) => y.d - x.d);
console.log(`eventos visuales: ${ts.length - 2} (más el inicio 0,1 s y el final)`);
console.log('mayores huecos entre eventos:');
for (const x of gaps.slice(0, 8)) console.log(`  ${x.a.toFixed(2)} → ${x.b.toFixed(2)} s: ${x.d.toFixed(2)} s   (${(ev.get(x.a) || ['inicio']).join(', ')} → ${(ev.get(x.b) || ['fin']).join(', ')})`);
const max = gaps[0].d;
console.log(max <= 3.0 + 1e-9 ? `✔ hueco máximo ${max.toFixed(2)} s (≤ 3,0 s)` : `✖ hueco máximo ${max.toFixed(2)} s (> 3,0 s)`);
if (max > 3.0 + 1e-9) process.exit(1);
