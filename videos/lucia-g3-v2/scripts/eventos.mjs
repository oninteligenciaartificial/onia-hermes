#!/usr/bin/env node
// Aire muerto, medido desde plan-resuelto.json (no a mano). Dos números:
//  1) hueco máximo entre EVENTOS VISUALES nuevos (regla 15: como máximo cada 2,0 s) y eventos por 10 s. Evento = entrada de tarjeta, acento de texto,
//     etiqueta (entra/sale), aro, recorte (entra/sale), marco de la cara, empuje (arranca), contador, destello «origen», sello, salida del rótulo de IA.
//     El cuadro 0 cuenta (el gancho ya está en pantalla).
//  2) «tramo quieto» DE DISEÑO: tiempo en que no hay ni una tarjeta en su tiempo de lectura (0,35 s/palabra + 0,3 desde que entra en reposo) ni un evento
//     reciente (cada evento «ocupa» 0,3 s: lo que tarda en animarse) ni un clip moviéndose (K4 y K1 son video). NO cuenta el empuje lento de las fotos
//     (1,00→1,03) ni el del visor: es el peor caso si esos movimientos no se vieran.
// Uso: node scripts/eventos.mjs   (sale con 1 si el hueco máximo pasa de 2,0 s)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = JSON.parse(fs.readFileSync(path.join(P, 'plan-resuelto.json'), 'utf8'));
const DUR = p.lienzo.duracion, FR = 1 / p.lienzo.fps, PUSH = p.empuje.cuadros * FR, OCUPA = 0.3;
const r3 = (x) => +(+x).toFixed(3);
const ev = new Map();
const add = (t, que) => { if (t > -1e-9 && t < DUR - 1e-9) ev.set(r3(t), (ev.get(r3(t)) || []).concat(que)); };
add(0, 'gancho (cuadro 0)');
const viajan = new Map(p.costuras.map((c) => [c.tarjetas.entra, c.t_f * FR]));
for (const c of p.tarjetas) { if (c.id !== 'c1') add(viajan.has(c.id) ? viajan.get(c.id) - PUSH : c.a, c.id); if (c.acento_t) add(c.acento_t, c.id + ' acento'); }
add(p.rotulo.b - 0.25, 'rótulo IA sale');
for (const e of p.etiquetas) { add(e.a, e.id); add(e.b - 0.18, e.id + ' sale'); }
add(p.aro.a, 'aro');
if (p.insL) { add(p.insL.a, 'recorte letrero'); add(p.insL.b - 0.18, 'recorte letrero sale'); }
add(p.marco.a, 'marco cara'); add(p.marco.b - 0.18, 'marco cara sale');
for (const k of ['ins1', 'ins2']) if (p.agenda[k]) { add(p.agenda[k].a, k); add(p.agenda[k].b - 0.18, k + ' sale'); }
for (const c of p.costuras) add(c.t - PUSH, 'empuje');
add(p.contador.a + 0.05, 'contador'); add(p.k4.t120, 'destello origen'); add(p.placa.sello_t, 'sello');
const ts = [...ev.keys()].sort((a, b) => a - b);
const pts = [...ts, DUR];
const gaps = []; for (let i = 1; i < pts.length; i++) gaps.push({ a: pts[i - 1], b: pts[i], d: r3(pts[i] - pts[i - 1]) });
gaps.sort((x, y) => y.d - x.d);
const por10 = (ts.length / DUR) * 10;
console.log(`eventos visuales: ${ts.length} en ${DUR.toFixed(3)} s = ${por10.toFixed(1)} por 10 s`);
console.log('mayores huecos entre eventos:');
for (const g of gaps.slice(0, 5)) console.log(`  ${g.a.toFixed(3)} → ${g.b.toFixed(3)} s: ${g.d.toFixed(3)} s   (${(ev.get(g.a) || []).join(', ')} → ${(ev.get(g.b) || ['fin']).join(', ')})`);
const max = gaps[0].d, LIM = 2.0;
console.log(max <= LIM + 1e-9 ? `✔ hueco máximo entre eventos ${max.toFixed(3)} s (≤ ${LIM} s)` : `✖ hueco máximo entre eventos ${max.toFixed(3)} s (> ${LIM} s)`);

// 2) tramo quieto de diseño (cuadro a cuadro)
const N = p.lienzo.cuadros, activo = new Array(N).fill(false);
const marca = (a, b) => { for (let f = Math.max(0, Math.floor(a / FR + 1e-6)); f < Math.min(N, Math.ceil(b / FR - 1e-6)); f++) activo[f] = true; };
for (const t of ts) marca(t, t + OCUPA);
for (const c of p.tarjetas) marca(c.a, c.a + c.min_s);                         // la tarjeta en reposo, durante su tiempo de lectura
for (const s of Object.values(p.escenas)) if (s.tipo === 'clip') marca(s.a, s.b); // el clip se mueve solo
// la primera tarjeta ya está en el cuadro 0: su lectura cuenta desde 0
const quietos = []; let ini = -1;
for (let f = 0; f <= N; f++) { const q = f < N && !activo[f]; if (q && ini < 0) ini = f; if (!q && ini >= 0) { quietos.push({ a: ini * FR, b: f * FR, d: (f - ini) * FR }); ini = -1; } }
quietos.sort((x, y) => y.d - x.d);
const qmax = quietos.length ? quietos[0].d : 0;
console.log(`tramo quieto de diseño (sin contar el empuje lento de las fotos ni el del visor): mayor ${qmax.toFixed(3)} s` + (quietos.length ? `   [${quietos.slice(0, 4).map((q) => q.a.toFixed(2) + '→' + q.b.toFixed(2) + ' (' + q.d.toFixed(2) + ' s)').join(', ')}]` : ''));
fs.writeFileSync(path.join(P, 'qa/eventos-visuales.json'), JSON.stringify({ eventos: ts.length, por_10s: +por10.toFixed(2), hueco_max_eventos_s: max, tramo_quieto_diseno_s: +qmax.toFixed(3), quietos: quietos.slice(0, 6) }, null, 1) + '\n');
if (max > LIM + 1e-9) process.exit(1);
