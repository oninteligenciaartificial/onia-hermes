#!/usr/bin/env node
// G4 v2: ventana REAL en que cada texto se puede leer, medida en el DOM cuadro a cuadro (24 fps), no desde plan.json.
// «Legible» = opacidad efectiva ≥ 0,9 y ≥ 95 % de su caja dentro del lienzo (en un empuje la caja se sale: ahí no cuenta). Compara con 0,35 s/palabra + 0,3.
// Complementa a build.mjs (que valida los tiempos del plan): este script ve lo que de verdad hace el timeline (entradas, empujes, salidas).
// Uso: node scripts/ventanas.mjs   (sale con 1 si alguna ventana no alcanza)
import { abrir, FPS, lectura, idsDeTexto, textos, legibles, grupos } from './lib-dom.mjs';
const { b, pg } = await abrir();
const { tarjetas, otros } = idsDeTexto();
const ids = [...tarjetas, ...otros];
const items = await textos(pg, ids);
const res = await legibles(pg, ids);
await b.close();
let malos = 0, minHolgura = null;
console.log('ventana legible medida en el DOM (opacidad ≥ 0,9 y ≥ 95 % dentro del lienzo), cuadro a cuadro:');
for (const [id, txt, n] of items) {
  const fs_ = res[id]; if (!fs_.length) { console.log(`  ✖ ${id}: nunca legible`); malos++; continue; }
  const g = grupos(fs_).sort((x, y) => y.length - x.length)[0], dur = g.length / FPS, min = lectura(n);
  const ok = dur >= min - 1e-9; if (!ok) malos++;
  if (!minHolgura || dur - min < minHolgura.h) minHolgura = { h: dur - min, id };
  console.log(`  ${ok ? 'ok ' : '✖  '} ${id.padEnd(8)} ${String(n).padStart(2)} pal  ${(g[0] / FPS).toFixed(2)}–${((g.at(-1) + 1) / FPS).toFixed(2)} s  ${dur.toFixed(2)} s (pide ${min.toFixed(2)}, holgura ${(dur - min).toFixed(2)})  «${txt}»`);
}
console.log(`holgura más justa: ${minHolgura.id} (${minHolgura.h.toFixed(2)} s)`);
if (malos) { console.error(`✖ ${malos} ventana(s) cortas`); process.exit(1); }
console.log('✔ todas las ventanas medidas alcanzan la regla de lectura (0,35 s por palabra + 0,3 s)');
