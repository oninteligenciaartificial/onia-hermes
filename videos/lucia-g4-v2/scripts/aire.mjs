#!/usr/bin/env node
// AIRE MUERTO (regla 15, 11-oct-2026) medido en el DOM, cuadro a cuadro (24 fps), sobre la misma composición que se renderiza.
//  · «Tramo quieto» = cuadros seguidos SIN ningún cambio en pantalla (opacidad, posición, tamaño, color, fondo o recorte de cualquier elemento visible;
//    el empuje lento de las fotos es un movimiento continuo y NO cuenta como cambio) Y sin una tarjeta/texto en lectura.
//  · «En lectura» = desde que el texto es legible (opacidad ≥ 0,9 y ≥ 95 % dentro del lienzo) durante 0,35 s por palabra + 0,3 s.
//  · Dos medidas: ESTRICTA (solo las tarjetas narrativas y las dos notas de honestidad) y COMPLETA (además el rótulo, los datos, sellos, pastillas, etiquetas y pies).
//  · Un tramo quieto de m cuadros iguales dura m/24 s; el máximo permitido es 0,3 s (7 cuadros iguales).
//  · Eventos = ráfagas de cambios (se unen las que están a ≤ 2 cuadros); el hueco máximo entre el comienzo de dos ráfagas tiene que ser ≤ 2,0 s.
// Uso: node scripts/aire.mjs [out/g4-v2-final-1080x1920.mp4] > qa/aire.txt   (sale con 1 si algo incumple). Con el video como argumento suma un CONTROL EN PÍXELES sobre el render final:
//      en las placas (sin empuje lento) mide cuadro a cuadro la diferencia media de gris entre cuadros seguidos y repite la cuenta de tramos quietos con el mismo criterio de lectura.
import { abrir, plan, FPS, N, lectura, idsDeTexto, textos, legibles, cambios, grupos } from './lib-dom.mjs';
import { listaEventos } from './eventos.mjs';
import { spawnSync } from 'node:child_process';
const { b, pg } = await abrir();
const { tarjetas, otros } = idsDeTexto();
const ids = [...tarjetas, ...otros];
const tx = await textos(pg, ids);
const leg = await legibles(pg, ids);
const ch = await cambios(pg);
await b.close();

const cubre = (lista) => {
  const c = new Uint8Array(N);
  for (const [id, , n] of tx) {
    if (!lista.includes(id)) continue;
    if (!leg[id].length) continue;
    const r = Math.ceil(lectura(n) * FPS - 1e-9);
    for (const g of grupos(leg[id])) for (let f = g[0]; f < Math.min(N, g[0] + r) && f <= g.at(-1); f++) c[f] = 1;
  }
  return c;
};
const MAXF = Math.round(plan.aire.max_quieto_s * FPS - 1e-9);       // 0,3 s = 7 cuadros iguales como máximo (7,2 → 7)
const quietos = (cov) => {
  const q = []; for (let f = 1; f < N; f++) if (!ch[f] && !cov[f]) q.push(f);
  // el cuadro anterior al primero quieto también es igual: m = n + 1
  return grupos(q).map((g) => ({ f0: g[0] - 1, n: g.length, m: g.length + 1 }));
};
const informe = (nombre, lista) => {
  const cov = cubre(lista), runs = quietos(cov);
  const mayor = runs.reduce((a, r) => (r.m > a.m ? r : a), { m: 0, f0: 0 });
  const malos = runs.filter((r) => r.m > MAXF);
  console.log(`\n${nombre}`);
  console.log(`  mayor tramo quieto: ${(mayor.m / FPS).toFixed(3)} s (${mayor.m} cuadros iguales) desde ${(mayor.f0 / FPS).toFixed(3)} s`);
  const top = [...runs].sort((x, y) => y.m - x.m).slice(0, 6).map((r) => `${(r.f0 / FPS).toFixed(2)} s: ${(r.m / FPS).toFixed(2)} s`).join(' · ');
  console.log(`  los 6 mayores: ${top}`);
  console.log(`  tramos quietos de más de ${plan.aire.max_quieto_s} s: ${malos.length}${malos.length ? ' → ' + malos.map((r) => `${(r.f0 / FPS).toFixed(2)}–${((r.f0 + r.m) / FPS).toFixed(2)} s (${(r.m / FPS).toFixed(2)} s)`).join(', ') : ''}`);
  return { mayor, malos, cov };
};

console.log(`AIRE MUERTO — ${plan.titulo}`);
console.log(`${N} cuadros a ${FPS} fps = ${(N / FPS).toFixed(3)} s. Se mide en el DOM (cada cuadro vs el anterior); el empuje lento de las fotos no cuenta como cambio.`);
const est = informe('ESTRICTA (solo tarjetas narrativas + las dos notas de honestidad cuentan como «en lectura»)', tarjetas);
const com = informe('COMPLETA (todo texto con tiempo de lectura: tarjetas, notas, rótulo, datos, sellos, pastillas, etiquetas, pies)', ids);

// cobertura: cuadros cambiando / en lectura de tarjeta / en lectura de otro texto / quietos
const nCambio = ch.reduce((a, v) => a + v, 0);
console.log(`\ncuadros con cambio: ${nCambio} de ${N} (${(100 * nCambio / N).toFixed(0)} %); en lectura de tarjeta o nota: ${est.cov.reduce((a, v) => a + v, 0)}; en lectura de cualquier texto: ${com.cov.reduce((a, v) => a + v, 0)}`);

// eventos: (1) los EVENTOS VISUALES NUEVOS del plan (tarjeta, acento, dato, sello, énfasis, fila, pulso, empuje…; scripts/eventos.mjs) y (2) las ráfagas de cambios que ve el DOM
const { ev, ts, gaps } = listaEventos(plan);
const mh = gaps.reduce((a, h) => (h.d > a.d ? h : a), { d: 0 });
const END = N / FPS;
console.log(`\nEVENTOS VISUALES NUEVOS (desde plan.json, scripts/eventos.mjs): ${ts.length - 2} en ${END.toFixed(2)} s = ${((ts.length - 2) / END * 10).toFixed(1)} por 10 s`);
const por10 = []; for (let a = 0; a < END; a += 10) por10.push(`${a}-${Math.min(a + 10, END).toFixed(1)} s: ${[...ev.keys()].filter((t) => t >= a && t < a + 10).length}`);
console.log(`  por 10 s: ${por10.join(' · ')}`);
console.log(`  mayor hueco entre eventos: ${mh.d.toFixed(2)} s (${mh.a.toFixed(2)} → ${mh.b.toFixed(2)} s); máximo permitido ${plan.aire.max_entre_eventos_s.toFixed(1)} s`);
console.log('  los 5 mayores huecos: ' + [...gaps].sort((x, y) => y.d - x.d).slice(0, 5).map((h) => `${h.a.toFixed(2)}→${h.b.toFixed(2)}: ${h.d.toFixed(2)} s`).join(' · '));
const idx = []; for (let f = 1; f < N; f++) if (ch[f]) idx.push(f);
const rafagas = grupos(idx);
console.log(`  (control cruzado en el DOM: ${rafagas.length} ráfagas de cambios continuos; la mayor sin ningún cambio es el «mayor tramo quieto» de arriba)`);

// ── control en píxeles del render final (solo las placas: las fotos llevan el empuje lento, que mueve todos los píxeles y no cuenta como evento) ──
let pixMalo = false;
if (process.argv[2]) {
  const W = 270, H = 480, FS = W * H;
  const r = spawnSync('ffmpeg', ['-v', 'error', '-i', process.argv[2], '-vf', `scale=${W}:${H}:flags=area,format=gray`, '-f', 'rawvideo', '-'], { maxBuffer: 1 << 30 });
  if (r.status !== 0) { console.error(String(r.stderr)); process.exit(2); }
  const buf = r.stdout, n = Math.floor(buf.length / FS);
  const dif = new Float64Array(n);
  for (let i = 1; i < n; i++) { let s = 0; const o = i * FS, q = (i - 1) * FS; for (let k = 0; k < FS; k++) s += Math.abs(buf[o + k] - buf[q + k]); dif[i] = s / FS; }
  const PUSHF = plan.empuje.cuadros;
  const enPlaca = new Uint8Array(n);
  for (const m of plan.medios) if (m.tipo === 'placa') for (let f = Math.round(m.a * FPS) + PUSHF + 1; f < Math.round(m.b * FPS) - PUSHF; f++) enPlaca[f] = 1;
  const UMBRAL = 0.05;                                   // gris medio de diferencia entre cuadros seguidos: por debajo, el cuadro es el mismo (ruido del H.264)
  const q = []; for (let f = 1; f < n; f++) if (enPlaca[f] && dif[f] < UMBRAL && !com.cov[f]) q.push(f);
  const runs = grupos(q).map((g) => ({ f0: g[0] - 1, m: g.length + 1 }));
  const mayor = runs.reduce((a, x) => (x.m > a.m ? x : a), { m: 0, f0: 0 });
  const iguales = []; for (let f = 1; f < n; f++) if (enPlaca[f] && dif[f] < UMBRAL) iguales.push(f);
  const mayorIgual = grupos(iguales).reduce((a, g) => (g.length + 1 > a ? g.length + 1 : a), 0);
  console.log(`\nCONTROL EN PÍXELES del render final (solo placas: ${enPlaca.reduce((a, v) => a + v, 0)} cuadros; diferencia media de gris < ${UMBRAL} = cuadro igual):`);
  console.log(`  mayor tramo de cuadros IGUALES (con lectura incluida): ${(mayorIgual / FPS).toFixed(2)} s (en lectura de un texto: permitido)`);
  console.log(`  mayor tramo quieto FUERA de toda lectura (criterio COMPLETA): ${(mayor.m / FPS).toFixed(3)} s desde ${(mayor.f0 / FPS).toFixed(3)} s; los de más de ${plan.aire.max_quieto_s} s: ${runs.filter((x) => x.m > MAXF).length}`);
  const unaFoto = []; for (let f = 1; f < n; f++) if (!enPlaca[f] && dif[f] < UMBRAL) unaFoto.push(f);
  console.log(`  (en las escenas de foto hay ${unaFoto.length} cuadros idénticos al anterior; el empuje lento mueve la imagen y el resto lo cubre el DOM)`);
  pixMalo = runs.some((x) => x.m > MAXF);
}
const malo = est.malos.length || com.malos.length || mh.d > plan.aire.max_entre_eventos_s + 1e-9 || pixMalo;
console.log(malo ? '\n✖ incumple la regla 15' : `\n✔ regla 15: mayor tramo quieto ${(est.mayor.m / FPS).toFixed(3)} s (estricta) / ${(com.mayor.m / FPS).toFixed(3)} s (completa) ≤ ${plan.aire.max_quieto_s} s; mayor hueco entre eventos ${mh.d.toFixed(2)} s ≤ ${plan.aire.max_entre_eventos_s.toFixed(1)} s`);
process.exit(malo ? 1 : 0);
