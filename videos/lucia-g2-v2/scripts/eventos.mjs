#!/usr/bin/env node
// Hueco máximo entre EVENTOS VISUALES, medido desde plan.resuelto.json (no a mano). Evento = entrada o acento de una tarjeta, rótulo de IA que sale,
// cada miniatura, cada referencia, la escala y su marca, cada barra, el anillo, cada cambio de rótulo, la nota, el dato y el sello de cada motor y el
// INICIO de cada costura (el empuje de 6 cuadros). Los clips y el empuje lento de la foto se mueven solos: no cuentan como evento.
// v2 (regla 15): un evento nuevo como máximo cada 2,0 s. Además imprime los eventos por cada 10 s (ventana deslizante).
// Uso: node scripts/eventos.mjs   (sale con 1 si algún hueco pasa de 2,0 s)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = JSON.parse(fs.readFileSync(path.join(P, 'plan.resuelto.json'), 'utf8'));
const DUR = p.lienzo.duracion, PUSH = p.empuje.cuadros / p.lienzo.fps, MAXG = 2.0;
const ev = new Map();
const add = (t, que) => { if (t > 0.2 && t < DUR - 0.1) ev.set(+t.toFixed(3), (ev.get(+t.toFixed(3)) || []).concat(que)); };
for (const c of p.tarjetas) { add(+c.entra ?? c.a, c.id); if (c.acento_t) add(c.acento_t, c.id + ' acento'); }
add(p.rotulo.b - 0.18, 'rótulo IA sale');
const g = p.gancho.miniaturas; for (let i = 0; i < 6; i++) add(g.a + i * g.escalon, 'miniatura ' + (i + 1));
const rg = p.regla; for (let i = 0; i < p.refs.muestra.length; i++) add(rg.refs.a + i * rg.refs.escalon, 'ref ' + (i + 1));
add(rg.refs.etiqueta_t, 'etiqueta refs'); add(rg.escala.a, 'escala'); add(rg.escala.ejes_t, 'ejes'); add(rg.escala.uno_t, '«1» se enciende'); add(rg.escala.marca_t, 'marca 0,70');
const l = p.leccion; add(l.marca_t, 'lección marca'); add(l.titulo.t, 'lección título');
l.orden.forEach((id, i) => add(l.barra.t0 + i * l.barra.escalon, 'lección barra ' + id));
add(l.resalte_t, 'lección anillo'); for (const c of l.cambios) add(c.t, 'lección rótulo ' + c.motor); add(l.nota.t, 'lección nota');
for (const m of p.motores) { add(m.tag_a, m.id + ' dato A'); add(m.tag_b, m.id + ' dato B'); if (m.sello) add(m.sello.t, m.id + ' sello'); }
for (const c of p.costuras) add(c.t - PUSH, 'costura (empuje)');
const ts = [0, ...[...ev.keys()].sort((a, b) => a - b), DUR];
const gaps = [];
for (let i = 1; i < ts.length; i++) gaps.push({ a: ts[i - 1], b: ts[i], d: +(ts[i] - ts[i - 1]).toFixed(3) });
const orden = [...gaps].sort((x, y) => y.d - x.d);
console.log(`eventos visuales: ${ts.length - 2} en ${DUR} s (más el cuadro 0 y el final)`);
console.log('mayores huecos entre eventos:');
for (const x of orden.slice(0, 8)) console.log(`  ${x.a.toFixed(2)} → ${x.b.toFixed(2)} s: ${x.d.toFixed(2)} s   (${(ev.get(x.a) || ['inicio']).join(', ')} → ${(ev.get(x.b) || ['fin']).join(', ')})`);
// eventos por 10 s (ventana deslizante de 10 s cada 0,5 s) y por tramo de 10 s consecutivo
const evt = [...ev.keys()];
let mn = 1e9, mx = 0, tmn = 0;
for (let t0 = 0; t0 + 10 <= DUR + 1e-9; t0 += 0.5) { const n = evt.filter((t) => t >= t0 && t < t0 + 10).length; if (n < mn) { mn = n; tmn = t0; } if (n > mx) mx = n; }
console.log(`eventos por 10 s (ventana deslizante): mínimo ${mn} (en ${tmn.toFixed(1)}-${(tmn + 10).toFixed(1)} s), máximo ${mx}, promedio ${(evt.length / DUR * 10).toFixed(1)}`);
const max = orden[0].d;
console.log(max <= MAXG + 1e-9 ? `✔ hueco máximo ${max.toFixed(2)} s (≤ ${MAXG.toFixed(1)} s)` : `✖ hueco máximo ${max.toFixed(2)} s (> ${MAXG.toFixed(1)} s)`);
fs.writeFileSync(path.join(P, 'qa/eventos.json'), JSON.stringify({ eventos: evt.sort((a, b) => a - b), hueco_max: max, por_10s: { min: mn, max: mx, promedio: +(evt.length / DUR * 10).toFixed(2) } }));
if (max > MAXG + 1e-9) process.exit(1);
