#!/usr/bin/env node
// Control de tarjetas (regla 15, v2). Lleva el timeline a cada cuadro (24 fps) y mide, para cada tarjeta narrativa y para las dos notas de honestidad:
//  (1) su ventana legible real (opacidad ≥ 0,9 y ≥ 95 % dentro del lienzo) contra su tiempo de lectura (0,35 s por palabra + 0,3 s): tiene que alcanzar;
//  (2) cuánto se queda en pantalla DESPUÉS de leerse («sobra»): una tarjeta solo puede quedarse durante su tiempo de lectura; si sobra más de 0,3 s, ese tramo
//      tiene que estar cubierto por otro cambio o por otro texto en lectura (lo decide aire.mjs, que mide cuadro a cuadro si la pantalla queda idéntica);
//  (3) los cuadros SIN ninguna tarjeta ni nota visible (informativo: las escenas que se apoyan en otro texto en lectura).
// Uso: node scripts/hueco-tarjetas.mjs   (sale con 1 si una tarjeta no alcanza su tiempo de lectura)
import { abrir, plan, FPS, N, lectura, idsDeTexto, textos, legibles, grupos } from './lib-dom.mjs';
const { b, pg } = await abrir();
const { tarjetas } = idsDeTexto();
const items = await textos(pg, tarjetas);
const res = await legibles(pg, tarjetas);
await b.close();
let malos = 0;
const cubierto = new Uint8Array(N);
console.log('tarjeta   pal  legible (s)       dura   pide   sobra');
for (const [id, txt, n] of items) {
  const g = grupos(res[id]).sort((x, y) => y.length - x.length)[0]; if (!g) { console.log(`  ✖ ${id}: nunca legible`); malos++; continue; }
  for (const f of g) cubierto[f] = 1;
  const dur = g.length / FPS, min = lectura(n), sobra = dur - min;
  if (sobra < -1e-9) malos++;
  console.log(`  ${sobra < -1e-9 ? '✖' : ' '} ${id.padEnd(8)} ${String(n).padStart(2)}  ${(g[0] / FPS).toFixed(2)}–${((g.at(-1) + 1) / FPS).toFixed(2)}  ${dur.toFixed(2).padStart(6)} ${min.toFixed(2).padStart(6)} ${sobra.toFixed(2).padStart(6)}${sobra > 0.3 + 1e-9 ? '  (sobra > 0,3 s: cubierto por otros cambios/textos, ver aire.mjs)' : ''}  «${txt}»`);
}
const sin = []; for (let f = 0; f < N; f++) if (!cubierto[f]) sin.push(f);
console.log(`cuadros sin tarjeta ni nota legible: ${sin.length} de ${N}`);
for (const g of grupos(sin)) console.log(`  cuadros ${g[0]}–${g.at(-1)} (${(g[0] / FPS).toFixed(3)}–${((g.at(-1) + 1) / FPS).toFixed(3)} s, ${(g.length / FPS).toFixed(2)} s)`);
if (malos) { console.error(`✖ ${malos} tarjeta(s) no alcanzan su tiempo de lectura`); process.exit(1); }
console.log('✔ cada tarjeta y cada nota se lee entera (0,35 s por palabra + 0,3 s); lo que sobra lo cubre aire.mjs');
