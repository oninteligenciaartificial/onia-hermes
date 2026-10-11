#!/usr/bin/env node
// Tabla «caben / no caben» de la voz, por CARACTERES (revisión 1, H1; 12-oct-2026). Lee plan.json + guion-voz.txt; NO genera audio ni usa cupo de voz.
// Para cada línea: caracteres, duración estimada a 17 car/s (G1 v2: 320 car ≈ 19 s, PLAN §4-bis), su tramo (de su inicio al inicio de la siguiente), si CABE
// (pausa ≥ 0), la pausa hasta la línea siguiente a 16 · 17 · 18 car/s (sensibilidad ±1 car/s), su costura y desfase, y qué evento de pantalla cae con qué palabra.
// Uso: node scripts/voz-tramos.mjs > qa/voz-tramos.txt      (sale con 1 si a 17 car/s alguna línea no cabe o deja una pausa > 0,25 s)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tramosDeVoz } from './voz-lib.mjs';
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
const DUR = plan.lienzo.frames / plan.lienzo.fps;
const txt = fs.readFileSync(path.join(P, plan.voz.archivo), 'utf8').replace(/\n$/, '');
const { tramos, V } = tramosDeVoz(plan, txt, DUR);
const f = (n, d = 2) => (n >= 0 ? '+' : '−') + Math.abs(n).toFixed(d);
const [lo, hi] = V.car_por_s_sensibilidad;
let malos = 0;
console.log(`VOZ POR CARACTERES — ${plan.titulo}`);
console.log(`Estimación a ${V.car_por_s} car/s (sensibilidad ${lo}/${hi}); pausa máxima entre frases ${V.hueco} s (PLAN §4-bis); desfase máximo tras su costura ${V.desfase_max} s. NO hay voz: son estimaciones; se derivan de las duraciones reales cuando exista el audio.`);
console.log(`Texto: ${[...txt].length} caracteres con saltos (${[...txt].length - tramos.length + 1} sin ellos); cupo de voz restante hasta el 13-oct 01:17 UTC: 381 (la madre lo confirma).`);
console.log('');
console.log('línea  car  voz@17   inicio   tramo   ¿cabe?   pausa → siguiente (16 · 17 · 18 car/s)    costura (desfase)   texto');
for (const s of tramos) {
  const ultima = s.i === tramos.length;
  const cabe = s.hueco >= -1e-9, pausaOk = ultima || s.hueco <= V.hueco + 1e-9;
  if (!ultima && (!cabe || !pausaOk)) malos++;
  const marca = (h) => (ultima ? '' : h < -1e-9 ? '✖' : h > V.hueco + 1e-9 ? '▲' : ' ');
  const triple = `${f(s.hueco_lo)}${marca(s.hueco_lo)} · ${f(s.hueco)}${marca(s.hueco)} · ${f(s.hueco_hi)}${marca(s.hueco_hi)}`;
  console.log(`${String(s.i).padStart(4)}  ${String(s.car).padStart(3)}  ${s.dur.toFixed(2).padStart(5)} s  ${s.ini.toFixed(3).padStart(7)}  ${s.tramo.toFixed(2).padStart(5)} s  ${(cabe ? 'cabe' : 'NO CABE').padEnd(7)}  ${triple.padEnd(42)}  ${(s.costura != null ? `${s.costura.toFixed(3)} (${f(s.desfase, 3)})` : '—').padEnd(16)}  ${s.texto}`);
}
const ult = tramos.at(-1);
console.log(`\nCola: la voz termina a ${ult.fin.toFixed(2)} s y el video a ${DUR.toFixed(2)} s → ${ (DUR - ult.fin).toFixed(2)} s (16 car/s: ${ult.hueco_lo.toFixed(2)} · 18 car/s: ${ult.hueco_hi.toFixed(2)}). No es una pausa entre frases: es el final del video (el CTA queda ${(DUR - plan.costuras.at(-1).t).toFixed(2)} s en pantalla).`);
console.log('Leyenda: ✖ = la línea se pisa con la siguiente; ▲ = pausa > 0,25 s. A 16 y 18 car/s solo informan (±1 car/s mueve cada pausa ±0,06-0,15 s).');

// qué evento de pantalla cae con qué palabra de la voz (estimado a 17 car/s: inicio de la línea + caracteres anteriores ÷ 17)
const SYNC = [
  [1, 'su cara', 'c1 acento «su cara?»', plan.tarjetas.find((c) => c.id === 'c1').acento_t],
  [2, '6 motores', 'c2 acento «Seis motores…»', plan.tarjetas.find((c) => c.id === 'c2').acento_t],
  [4, 'Piso', 'marca «mi piso · 0,70»', plan.regla.escala.marca_t],
  [5, '1 crédito', 'c4 acento «1 crédito»', plan.tarjetas.find((c) => c.id === 'c4').acento_t],
  [6, 'justo en el piso', 'pastilla «justo en el piso» (golpe)', plan.imagenes.find((m) => m.id === 'd').enfasis[0].t],
  [7, 'bajo el piso', 'sello «bajo el piso» (golpe)', plan.imagenes.find((m) => m.id === 'e').enfasis[0].t],
  [8, 'mejoró', 'c7 acento «mejoró el parecido.»', plan.tarjetas.find((c) => c.id === 'c7').acento_t],
  [10, 'se rozan', 'pulso de los tres puntos (último)', plan.l1.pulsos.at(-1).t],
  [11, 'el Kling', 'anillo sobre Kling O1 Image', plan.l2.anillo_t],
  [11, 'perdió', 'c8 acento «perdió la cara.»', plan.tarjetas.find((c) => c.id === 'c8').acento_t],
  [12, 'cada semana', 'c9 acento «cada semana…»', plan.tarjetas.find((c) => c.id === 'c9').acento_t],
];
console.log('\nSincronía (palabra estimada vs evento; − = el evento llega antes que la palabra):');
let peor = 0;
for (const [n, palabra, que, t] of SYNC) {
  const s = tramos[n - 1], i = s.texto.indexOf(palabra);
  if (i < 0) { console.log(`  ✖ línea ${n}: no encuentro «${palabra}»`); malos++; continue; }
  const tp = s.ini + i / V.car_por_s, d = t - tp;
  peor = Math.max(peor, Math.abs(d));
  console.log(`  línea ${String(n).padStart(2)} «${palabra}» ≈ ${tp.toFixed(2)} s · ${que.padEnd(40)} ${t.toFixed(2)} s  (${f(d)} s)`);
}
console.log(`  mayor desfase evento-palabra: ${peor.toFixed(2)} s (la pastilla y el sello llegan antes que sus palabras a propósito: se leen primero)`);
if (malos) { console.error(`✖ ${malos} línea(s) no caben o dejan una pausa > ${V.hueco} s a ${V.car_por_s} car/s`); process.exit(1); }
console.log(`\n✔ las 12 líneas caben a ${V.car_por_s} car/s y ninguna pausa pasa de ${V.hueco} s (mayor: ${Math.max(...tramos.slice(0, -1).map((s) => s.hueco)).toFixed(2)} s; menor: ${Math.min(...tramos.slice(0, -1).map((s) => s.hueco)).toFixed(2)} s)`);
