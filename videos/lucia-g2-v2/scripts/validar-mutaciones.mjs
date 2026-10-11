#!/usr/bin/env node
// Prueba NEGATIVA de scripts/build.mjs (la compuerta de reglas y de cifras de G2 v2): ejecuta el build con las lecturas interceptadas (plan.json, pie.txt, guion-voz.txt y la propia
// MEDICIÓN mutados en memoria; las escrituras no hacen nada; ningún archivo del repo cambia) y exige que CADA mutación se rechace POR EL MOTIVO ESPERADO. Además corre el build SIN mutar y exige que pase.
// v2.3 (revisión 2, H7): la prueba ya no solo comprueba que una cadena ESTÁ en el pie; comprueba que lo que el pie y el plan dicen es VERDAD contra el archivo de la medición
// (hermes-content/references/modelos/lucia/v4/prueba-motores-20261008/medicion-sin-refs-entrada-20261011.txt): se falsea el pie, se falsea el plan y se falsea el propio archivo, y el build tiene que
// notar la diferencia. Mutaciones pedidas: borrar el hecho de que K1 se hizo con R1, R3, R6 y R7; cambiar «el orden de los finales no cambia» por lo contrario; restituir «dentro del ruido».
// Uso: node scripts/validar-mutaciones.mjs   (escribe qa/validar-mutaciones.txt; sale con 1 si una mutación NO se rechaza o se rechaza por otro motivo)
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buscarProhibidas, buscarProhibidasPie, buscarRecomendacion, buscarGenerales, buscarRetiradas, AVISO_PIE } from './prohibidas.mjs';
import { cronograma, leerDuraciones, holgura, tablaCaben, ORIGINALES_V2_0 } from './voz.mjs';

const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BUILD = path.join(P, 'scripts/build.mjs');
if (!fs.existsSync(path.join(P, 'assets/th6.jpg'))) { console.error('✖ falta el material de assets/: corré primero node scripts/build.mjs (copia las 6 miniaturas y las referencias)'); process.exit(1); }
const src = fs.readFileSync(BUILD, 'utf8').replace(/^import .*;\r?$/gm, '').replaceAll('import.meta.url', JSON.stringify(pathToFileURL(BUILD).href));
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
const MEDICION = path.join('..', '..', plan.fuga_refs.fuente);      // relativo a la carpeta de la pieza (el build lo lee de ahí)

// [nombre, mutar(plan), reescribir {archivo relativo: (texto) → texto} | null, patrón del mensaje esperado]
const quitar = (re) => (s) => { const t = s.replace(re, ''); if (t === s) throw new Error(`la mutación no cambió nada (${re})`); return t; };
const cambiar = (a, b) => (s) => { if (!s.includes(a)) throw new Error(`la mutación no cambió nada («${a}»)`); return s.replace(a, b); };
// cambia solo dentro de la PRUEBA ESTRICTA de la medición (las tablas de arriba repiten algunas filas)
const enEstricta = (a, b) => (s) => { const i = s.indexOf('== PRUEBA ESTRICTA'); const h = s.slice(i); if (i < 0 || !h.includes(a)) throw new Error(`la mutación no cambió nada («${a}»)`); return s.slice(0, i) + h.replace(a, b); };
const AVISO = 'Aviso: los 6 clips parten de 4 de las 8 fotos con que se mide (abajo). ';
const casos = [
  // ── el pie: lo que dice sobre la medición tiene que ser lo que dice el ARCHIVO ──
  ['pie: borrar TODO el párrafo «Sobre la medición»', () => {}, { 'pie.txt': quitar(/Sobre la medición:[\s\S]*?poco confiable\. /) }, /falta decir de dónde salió la foto de arranque/],
  ['pie: borrar el hecho de que la foto de arranque (K1) se hizo con R1, R3, R6 y R7', () => {}, { 'pie.txt': cambiar('la foto de arranque se hizo con 4 de esas 8 fotos (R1, R3, R6 y R7), así que ningún clip es independiente. ', '') }, /falta decir de dónde salió la foto de arranque/],
  ['pie: K1 «se hizo con R1, R3 y R6» (la medición dice R1, R3, R6 y R7)', () => {}, { 'pie.txt': cambiar('(R1, R3, R6 y R7), así que ningún clip', '(R1, R3 y R6), así que ningún clip') }, /falta decir de dónde salió la foto de arranque/],
  ['pie: «el orden de los finales no cambia» → «el orden de los finales cambia» (lo contrario)', () => {}, { 'pie.txt': cambiar('el orden de los finales no cambia', 'el orden de los finales cambia') }, /la medición estricta .* no dice lo que dice el archivo/],
  ['pie: restituir «dentro del ruido» (frase retirada)', () => {}, { 'pie.txt': cambiar('0,79 a 0,77: casi igual', '0,79 a 0,77: dentro del ruido') }, /«dentro del ruido» es una frase RETIRADA/],
  ['pie: restituir «exceso atribuible ≈ 0,012, dentro del ruido de ±0,03» (frase retirada)', () => {}, { 'pie.txt': cambiar('En Kling O3 la cara mide solo', 'El exceso atribuible es ≈ 0,012, dentro del ruido de ±0,03. En Kling O3 la cara mide solo') }, /«exceso» es una frase RETIRADA/],
  ['pie: el aviso del principio fuera', () => {}, { 'pie.txt': cambiar(AVISO, '') }, /falta el aviso del principio/],
  ['pie: el aviso pasa al final (fuera de los primeros 125 caracteres)', () => {}, { 'pie.txt': (s) => { if (!s.includes(AVISO)) throw new Error('la mutación no cambió nada'); return s.replace(AVISO, '').replace('Cada semana hago una prueba.', AVISO + 'Cada semana hago una prueba.'); } }, /el aviso empieza en el carácter/],
  ['pie: la apertura se alarga y empuja el aviso pasados los 125 caracteres', () => {}, { 'pie.txt': cambiar('Lucía Antelo, por @oniahq.', 'Lucía Antelo, personaje de Onia, por @oniahq.') }, /el aviso (empieza|termina) en el carácter/],
  ['pie: «los 6 clips parten de 4 de las 8» → «de 2 de las 8» (la medición dice 4)', () => {}, { 'pie.txt': cambiar('parten de 4 de las 8 fotos', 'parten de 2 de las 8 fotos') }, /falta el aviso del principio/],
  ['pie: Kling O3 «recibió R1 y R3» (la medición dice R1, R3, R6 y R7)', () => {}, { 'pie.txt': cambiar('y Kling O3, R1, R3, R6 y R7.', 'y Kling O3, R1 y R3.') }, /falta decir qué recibió cada uno de los dos clips/],
  ['pie: Seedance + referencias «recibió R1, R3 y R6» (la medición dice R1 y R3)', () => {}, { 'pie.txt': cambiar('recibió R1 y R3 como entrada', 'recibió R1, R3 y R6 como entrada') }, /falta decir qué recibió cada uno de los dos clips/],
  ['pie: final de Kling O3 con las 4 fotos 0,79 (la medición dice 0,749 → 0,75)', () => {}, { 'pie.txt': cambiar('Kling O3 0,75, Seedance', 'Kling O3 0,79, Seedance') }, /no dice lo que dice el archivo de la medición/],
  ['pie: «bajan entre 0,03 y 0,05» (la medición dice 0,03 y 0,09)', () => {}, { 'pie.txt': cambiar('entre 0,03 y 0,09', 'entre 0,03 y 0,05') }, /no dice lo que dice el archivo de la medición/],
  ['pie: orden de los finales intercambiado (Kling 3.0 std antes que Kling 3.0 pro)', () => {}, { 'pie.txt': cambiar('Kling 3.0 pro 0,68, Kling 3.0 std 0,67', 'Kling 3.0 std 0,67, Kling 3.0 pro 0,68') }, /no dice lo que dice el archivo de la medición/],
  ['pie: las fotos que nadie recibió «R2, R4, R5 y R7» (la medición dice R8)', () => {}, { 'pie.txt': cambiar('(R2, R4, R5 y R8)', '(R2, R4, R5 y R7)') }, /no dice lo que dice el archivo de la medición/],
  ['pie: sin el tamaño de cara de Kling O3 (89 a 168 px)', () => {}, { 'pie.txt': cambiar('En Kling O3 la cara mide solo 89 a 168 px en el clip: poco confiable. ', 'En Kling O3 la cara es chica: poco confiable. ') }, /falta el tamaño de cara de Kling O3/],
  ['pie: tamaño de cara «89 a 170 px» (la medición dice 89 a 168)', () => {}, { 'pie.txt': cambiar('89 a 168 px', '89 a 170 px') }, /el tamaño de cara «89 a 170 px» no sale de la medición/],
  ['pie: sin «las caras de los tres clips del video miden menos de 200 px»', () => {}, { 'pie.txt': cambiar('las caras de los tres clips del video miden menos de 200 px, así que', 'las caras son chicas, así que') }, /debe decir «las caras de los tres clips del video miden menos de 200 px»/],
  ['pie: sin «poco confiable»', () => {}, { 'pie.txt': cambiar(': poco confiable.', '.') }, /no dice «poco confiable»/],
  ['pie: pasa de 2.200 caracteres', () => {}, { 'pie.txt': cambiar('Cada semana hago una prueba.', 'Cada semana hago una prueba. ' + 'x'.repeat(100)) }, /tope de Instagram 2\.200/],
  // ── el resto de las reglas del pie ──
  ['pie: ya no abre con «Personaje hecho con IA»', () => {}, { 'pie.txt': cambiar('Personaje hecho con IA', 'Personaje digital') }, /debe abrir con «Personaje hecho con IA»/],
  ['pie: sin el aviso «Nombro lo que uso…» (D-N1)', () => {}, { 'pie.txt': quitar(/Nombro lo que uso; no es una recomendación pagada\. /) }, /falta el aviso/],
  ['pie: cifra que no sale de los datos (0,72 → 0,73)', () => {}, { 'pie.txt': cambiar('0,79 a 0,72', '0,79 a 0,73') }, /falta «0,79 a 0,72» de Kling 3\.0 std/],
  ['pie: cifra que no sale de ningún dato (0,64 → 0,66 en el pie de Seedance 2.0 Mini)', () => {}, { 'pie.txt': cambiar('(0,69 a 0,64)', '(0,69 a 0,66)') }, /la cifra 0,66 no sale de los datos/],
  ['pie: «Higgsfield» fuera (plataforma de los créditos)', () => {}, { 'pie.txt': (s) => s.replaceAll('Higgsfield', 'la plataforma') }, /no dice la plataforma de los créditos/],
  // ── la pantalla: el aviso en la lección, sobre el clip de Kling O3 y en el gancho ──
  ['pantalla: quitar la etiqueta de la lección (plan.leccion.fuga)', (p) => { delete p.leccion.fuga; }, null, /sale en pantalla y la placa de la lección no lleva su etiqueta/],
  ['pantalla: la etiqueta de la lección apunta a un clip que no sale (m4)', (p) => { p.leccion.fuga.motor = 'm4'; }, null, /no es un clip con fotos recibidas que salga en pantalla/],
  ['pantalla: la etiqueta de la lección llega sin ventana de lectura (T14-6f)', (p) => { p.leccion.fuga.t = 'T14-6f'; }, null, /lectura «lección: fotos recibidas \(Kling O3\)»/],
  ['pantalla: la etiqueta de la lección llega con ventana corta (T13+1.5: 0,24 s, pide 3,8)', (p) => { p.leccion.fuga.t = 'T13+1.5'; }, null, /lectura «lección: fotos recibidas \(Kling O3\)»/],
  ['pantalla: quitar el aviso del gancho (el 0,82 de la pastilla sin aviso)', (p) => { delete p.gancho.fuga; }, null, /el gancho no lleva su aviso/],
  ['pantalla: el aviso del gancho llega con ventana corta (3,0 s)', (p) => { p.gancho.fuga.t = 3.0; }, null, /lectura «gancho: aviso junto al 0,82»/],
  ['pantalla: quitar el aviso del clip de Kling O3 (plan.motores.m5.fuga_escena)', (p) => { delete p.motores[2].fuga_escena; }, null, /su clip no lleva el aviso/],
  ['pantalla: el clip de Kling O3 termina antes (T10) y el aviso se queda sin ventana de lectura', (p) => { p.medios.find((m) => m.id === 'm5').b = 'T10'; }, null, /lectura «Kling O3: aviso sobre el clip»/],
  // ── el PLAN contra la medición (plan ≠ archivo corta el build) ──
  ['datos: Kling O3 «recibió R1, R3 y R6» (la medición dice R1, R3, R6 y R7)', (p) => { p.fuga_refs.clips[1].recibio = ['R1', 'R3', 'R6']; }, null, /fuga_refs m5: recibió R1, R3, R6 y la medición dice R1, R3, R6, R7/],
  ['datos: Seedance + referencias «recibió R1, R3 y R6» (la medición dice R1, R3)', (p) => { p.fuga_refs.clips[0].recibio = ['R1', 'R3', 'R6']; }, null, /fuga_refs m4: recibió R1, R3, R6 y la medición dice R1, R3/],
  ['datos: K1 «se hizo con R1, R3 y R6» (la medición dice R1, R3, R6 y R7)', (p) => { p.fuga_refs.k1.recibio = ['R1', 'R3', 'R6']; }, null, /K1 se hizo con R1, R3, R6 y la medición dice R1, R3, R6, R7/],
  ['datos: cara de Kling O3 89-170 px (la medición dice 89-168)', (p) => { p.fuga_refs.clips[1].cara_px = [89, 170]; }, null, /fuga_refs m5: cara de 89-170 px y la medición dice 89-168/],
  ['datos: imágenes de Seedance + referencias 4 (la clave dice 3_refs)', (p) => { p.fuga_refs.clips[0].imagenes = 4; }, null, /fuga_refs m4: 4 imágenes y la clave de PROCEDENCIA dice 3/],
  ['datos: Kling O3 «no sale en pantalla» (el plan lo muestra)', (p) => { p.fuga_refs.clips[1].en_pantalla = false; }, null, /fuga_refs m5: en_pantalla=false pero el plan lo muestra/],
  ['datos: fuente de la medición inexistente', (p) => { p.fuga_refs.fuente = 'hermes-content/references/modelos/lucia/v4/no-existe.txt'; }, null, /falta la fuente/],
  ['datos: sección de la medición con otro nombre', (p) => { p.fuga_refs.clips[1].etiqueta_medicion = 'Kling O3 7 refs (948a89d3)'; }, null, /la medición no tiene la sección «== Kling O3 7 refs/],
  ['estricta: «las fotos que nadie recibió son R2, R4, R5 y R7» (la medición dice R8)', (p) => { p.fuga_refs.estricta.sin_recibir = ['R2', 'R4', 'R5', 'R7']; }, null, /las fotos que nadie recibió son R2, R4, R5, R7 y la medición dice R2, R4, R5, R8/],
  ['estricta: «bajan entre 0,03 y 0,05» (la medición dice 0,03 y 0,09)', (p) => { p.fuga_refs.estricta.baja_entre = [0.03, 0.05]; }, null, /bajan entre 0\.03 y 0\.05 en el plan y la medición dice 0\.03 y 0\.09/],
  ['estricta: orden_igual=false (la medición dice que NO cambia)', (p) => { p.fuga_refs.estricta.orden_igual = false; }, null, /orden_igual=false y la medición dice que el orden por valor final NO cambia/],
  ['estricta: final de Kling O3 0,76 (la medición dice 0,749 → 0,75)', (p) => { p.fuga_refs.estricta.finales[0].valor = 0.76; }, null, /estricta m5: final 0\.76 con las 4 fotos y la medición dice 0\.749 → 0\.75/],
  ['estricta: finales en otro orden en el plan (Kling 3.0 std antes que Kling 3.0 pro)', (p) => { const f = p.fuga_refs.estricta.finales; [f[3], f[4]] = [f[4], f[3]]; }, null, /los finales van m5 > m4 > m6 > m1 > m2 > m3 en el plan y la medición los ordena/],
  ['estricta: sobre el piso «4 de 6 con las 4 fotos» (la medición da 3)', (p) => { p.fuga_refs.estricta.sobre_piso.con_4 = 4; }, null, /quedan 5 con las 8 fotos y 4 con las 4 en el plan; la medición da 5 y 3/],
  // ── la MEDICIÓN misma mutada: el plan y el pie ya no dicen la verdad y el build lo nota ──
  ['medición: K1 se generó solo con R1, R3 y R6 (el plan y el pie dicen R1, R3, R6 y R7)', () => {}, { [MEDICION]: cambiar('se generó con abe2e6bd, R1, R3, R6, R7 y 688d63a7', 'se generó con abe2e6bd, R1, R3, R6 y 688d63a7') }, /K1 se hizo con R1, R3, R6, R7 y la medición dice R1, R3, R6/],
  ['medición: el final de Kling O3 con las 4 fotos es 0,790 (el plan y el pie dicen 0,75)', () => {}, { [MEDICION]: enEstricta('0.824  0.824  -0.000  0.749  -0.075', '0.824  0.824  -0.000  0.790  -0.034') }, /estricta m5: final 0\.75 con las 4 fotos y la medición dice 0\.79 → 0\.79/],
  ['medición: «¿Cambia el orden por valor final? SI» (el plan y el pie dicen que no cambia)', () => {}, { [MEDICION]: cambiar('¿Cambia el orden por valor final? NO', '¿Cambia el orden por valor final? SI') }, /la línea «¿Cambia el orden por valor final\?» de la medición/],
  ['medición: Kling O3 recibió directo R1, R3 y R6 (cabecera de la prueba estricta)', () => {}, { [MEDICION]: cambiar('Kling O3 (sin K1) recibió R1, R3, R6 y R7 directo', 'Kling O3 (sin K1) recibió R1, R3 y R6 directo') }, /fuga_refs m5: la cabecera de la prueba estricta dice que recibió directo R1, R3, R6/],
  ['medición: sin la sección «PRUEBA ESTRICTA»', () => {}, { [MEDICION]: cambiar('== PRUEBA ESTRICTA', '== OTRA COSA') }, /la medición no trae la sección «== PRUEBA ESTRICTA/],
  // ── reglas que ya existían (el build sigue cortando) ──
  ['cifra: final de Kling 3.0 std 0,73 contra PROCEDENCIA', (p) => { p.motores[0].fin = 0.73; }, null, /final 0\.73 y PROCEDENCIA dice/],
  ['créditos: Kling O3 7 contra PROCEDENCIA', (p) => { p.motores[2].cr = 7; }, null, /7 créditos y PROCEDENCIA dice 6/],
  ['CTA: texto distinto', (p) => { p.tarjetas.find((c) => c.id === 'c12').acento = 'cada semana'; }, null, /CTA: «/],
  ['voz: frase prohibida en el guion', () => {}, { 'guion-voz.txt': cambiar('Se mide contra ocho fotos suyas.', 'Se mide contra ocho fotos de mis pacientes.') }, /frase prohibida «mis pacientes»/],
  ['voz: frase retirada en el guion («dentro del ruido»)', () => {}, { 'guion-voz.txt': cambiar('Queda bajo el piso.', 'Queda dentro del ruido.') }, /«dentro del ruido» es una frase RETIRADA/],
];

class Salida { constructor(c) { this.c = c; } }
function correr(mutar, reescribir) {
  const p = structuredClone(plan); mutar(p);
  const fake = Object.create(fs);
  fake.readFileSync = (file, ...a) => {
    const f = path.resolve(String(file));
    if (f === path.join(P, 'plan.json')) return JSON.stringify(p);
    const v = fs.readFileSync(file, ...a);
    if (reescribir) for (const [rel, fn] of Object.entries(reescribir)) if (f === path.join(P, rel)) return fn(v);
    return v;
  };
  for (const k of ['writeFileSync', 'mkdirSync', 'copyFileSync', 'symlinkSync', 'rmSync']) fake[k] = () => {};
  const err = [];
  const consola = { log: () => {}, error: (...a) => err.push(a.join(' ')) };
  const proceso = { argv: [], exit: (c) => { throw new Salida(c); } };
  const sinProcesos = () => { throw new Error('el build intentó ejecutar un proceso externo (ffmpeg/curl): falta material en assets/'); };
  let salida = 0;
  try {
    vm.runInNewContext(src, { fs: fake, path, fileURLToPath, execFileSync: sinProcesos, buscarProhibidas, buscarProhibidasPie, buscarRecomendacion, buscarGenerales, buscarRetiradas, AVISO_PIE, cronograma, leerDuraciones, holgura, tablaCaben, ORIGINALES_V2_0, process: proceso, console: consola }, { timeout: 8000 });
  } catch (e) { if (e instanceof Salida) salida = e.c; else return { salida: -1, texto: `${e.message}` }; }
  return { salida, texto: err.join('\n') };
}

const lineas = [];
let malos = 0;
const base = correr(() => {}, null);
if (base.salida !== 0) { console.error(`✖ el build SIN mutar no pasa (salida ${base.salida}): ${base.texto}`); process.exit(1); }
lineas.push('(sin mutar): el build pasa (salida 0), así que cada rechazo de abajo se debe a la mutación y no a otra cosa');
for (const [nombre, mutar, reescribir, patron] of casos) {
  let r;
  try { r = correr(mutar, reescribir); } catch (e) { r = { salida: -2, texto: `la mutación falló: ${e.message}` }; }
  const ok = r.salida === 1 && patron.test(r.texto);
  if (!ok) malos++;
  const motivo = (r.texto.split('\n').find((l) => patron.test(l)) || r.texto.split('\n').filter(Boolean).slice(0, 2).join(' | ')).trim().slice(0, 170);
  lineas.push(`${ok ? 'RECHAZADO correctamente' : '✖ NO rechazado como se esperaba (salida ' + r.salida + ')'} · ${nombre}\n    ↳ ${motivo}`);
}
const resumen = malos ? `✖ ${malos} de ${casos.length} mutaciones no se rechazaron por el motivo esperado` : `✔ ${casos.length} de ${casos.length} mutaciones rechazadas por el motivo esperado (y el build sin mutar pasa)`;
lineas.push(resumen);
const txt = lineas.join('\n') + '\n';
fs.mkdirSync(path.join(P, 'qa'), { recursive: true });
fs.writeFileSync(path.join(P, 'qa/validar-mutaciones.txt'), txt + (malos ? 'EXIT 1\n' : 'EXIT 0\n'));
console.log(txt);
process.exit(malos ? 1 : 0);
