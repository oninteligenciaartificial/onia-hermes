#!/usr/bin/env node
// Prueba NEGATIVA de scripts/build.mjs (la compuerta de reglas y de cifras de G2 v2): ejecuta el build con las lecturas interceptadas (plan.json, pie.txt y
// guion-voz.txt mutados en memoria; las escrituras no hacen nada; ningún archivo del repo cambia) y exige que CADA mutación se rechace POR EL MOTIVO ESPERADO.
// Hallazgo del 11-oct (dos clips recibieron fotos de las 8 del puntaje): borrar o falsear la advertencia del pie, quitar la etiqueta de Kling O3 de la pantalla o
// cambiar una cifra de fuga_refs contra la medición tiene que romper el build. Además corre el build SIN mutar y exige que pase (si no, la prueba no vale).
// Uso: node scripts/validar-mutaciones.mjs   (escribe qa/validar-mutaciones.txt; sale con 1 si una mutación NO se rechaza o se rechaza por otro motivo)
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buscarProhibidas, buscarProhibidasPie, buscarRecomendacion, buscarGenerales, AVISO_PIE } from './prohibidas.mjs';
import { cronograma, leerDuraciones, holgura, tablaCaben, ORIGINALES_V2_0 } from './voz.mjs';

const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BUILD = path.join(P, 'scripts/build.mjs');
if (!fs.existsSync(path.join(P, 'assets/th6.jpg'))) { console.error('✖ falta el material de assets/: corré primero node scripts/build.mjs (copia las 6 miniaturas y las referencias)'); process.exit(1); }
const src = fs.readFileSync(BUILD, 'utf8').replace(/^import .*;\r?$/gm, '').replaceAll('import.meta.url', JSON.stringify(pathToFileURL(BUILD).href));
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));

// [nombre, mutar(plan), reescribir {archivo relativo: (texto) → texto} | null, patrón del mensaje esperado]
const quitar = (re) => (s) => { const t = s.replace(re, ''); if (t === s) throw new Error(`la mutación no cambió nada (${re})`); return t; };
const cambiar = (a, b) => (s) => { if (!s.includes(a)) throw new Error(`la mutación no cambió nada («${a}»)`); return s.replace(a, b); };
const casos = [
  // ── la advertencia de las fotos recibidas, en el PIE (hallazgo 11-oct) ──
  ['pie: borrar TODA la advertencia de fotos recibidas', () => {}, { 'pie.txt': quitar(/Dos de los seis clips recibieron[\s\S]*?poco confiable\. /) }, /falta la advertencia de las fotos recibidas/],
  ['pie: borrar solo la parte de Kling O3 (5 imágenes, 4 de las 8)', () => {}, { 'pie.txt': quitar(/ y Kling O3 \(5 imágenes, 4 de ellas entre las 8\)/) }, /no dice «Kling O3 \(5 imágenes, 4 de ellas entre las 8…»/],
  ['pie: borrar solo la parte de Seedance 2.0 Mini + referencias (3 imágenes, 2 de las 8)', () => {}, { 'pie.txt': quitar(/Seedance 2\.0 Mini \+ referencias \(3 imágenes, 2 de ellas entre las 8 fotos con que se mide\) y /) }, /no dice «Seedance 2\.0 Mini \+ referencias \(3 imágenes, 2 de ellas entre las 8…»/],
  ['pie: «los otros cuatro, ninguna» fuera', () => {}, { 'pie.txt': cambiar('; los otros cuatro, ninguna:', ':') }, /no recibieron ninguna/],
  ['pie: exceso de Kling O3 falseado (0,012 → 0,002)', () => {}, { 'pie.txt': cambiar('≈ 0,012 en Kling O3', '≈ 0,002 en Kling O3') }, /no dice «≈ 0,012 en Kling O3»/],
  ['pie: exceso de Seedance + referencias falseado (0,026 → 0,016)', () => {}, { 'pie.txt': cambiar('≈ 0,026 en Seedance', '≈ 0,016 en Seedance') }, /no dice «≈ 0,026 en Seedance 2\.0 Mini \+ referencias»/],
  ['pie: sin el tamaño de cara de Kling O3 (89 a 168 px)', () => {}, { 'pie.txt': cambiar('En Kling O3 la cara mide solo 89 a 168 px: poco confiable. ', 'En Kling O3 la cara es chica: poco confiable. ') }, /la cara mide 89 a 168 px/],
  ['pie: sin «poco confiable»', () => {}, { 'pie.txt': cambiar(': poco confiable.', '.') }, /no dice «poco confiable»/],
  ['pie: sin «dentro del ruido de ±0,03»', () => {}, { 'pie.txt': cambiar('dentro del ruido de ±0,03; los números', 'dentro del ruido; los números') }, /no dice «dentro del ruido de ±0,03»/],
  ['pie: sin «los números del video no se corrigieron»', () => {}, { 'pie.txt': cambiar('; los números del video no se corrigieron.', '.') }, /no dice «los números del video no se corrigieron»/],
  ['pie: sin «descontado el efecto de usar menos fotos»', () => {}, { 'pie.txt': cambiar('Medido sin esas fotos y descontado el efecto de usar menos fotos, el exceso', 'El exceso') }, /no dice «descontado el efecto de usar menos fotos»/],
  // ── el resto de las reglas del pie ──
  ['pie: ya no abre con «Personaje hecho con IA»', () => {}, { 'pie.txt': cambiar('Personaje hecho con IA', 'Personaje digital') }, /debe abrir con «Personaje hecho con IA»/],
  ['pie: sin el aviso «Nombro lo que uso…» (D-N1)', () => {}, { 'pie.txt': quitar(/Nombro lo que uso; no es una recomendación pagada\. /) }, /falta el aviso/],
  ['pie: cifra que no sale de los datos (0,72 → 0,73)', () => {}, { 'pie.txt': cambiar('0,79 a 0,72', '0,79 a 0,73') }, /la cifra 0,73 no sale de los datos/],
  ['pie: «Higgsfield» fuera (plataforma de los créditos)', () => {}, { 'pie.txt': (s) => s.replaceAll('Higgsfield', 'la plataforma') }, /no dice la plataforma de los créditos/],
  // ── la etiqueta en PANTALLA (Kling O3 sale en la lección) ──
  ['pantalla: quitar la etiqueta de Kling O3 (plan.leccion.fuga)', (p) => { delete p.leccion.fuga; }, null, /sale en pantalla y la placa de la lección no lleva su etiqueta/],
  ['pantalla: la etiqueta apunta a un clip que no sale (m4)', (p) => { p.leccion.fuga.motor = 'm4'; }, null, /no es un clip con fotos recibidas que salga en pantalla/],
  ['pantalla: la etiqueta llega sin ventana de lectura (T14-6f)', (p) => { p.leccion.fuga.t = 'T14-6f'; }, null, /lectura «lección: fotos recibidas \(Kling O3\)»/],
  ['pantalla: la etiqueta llega con ventana corta (T13+1.5: 0,24 s, pide 3,1)', (p) => { p.leccion.fuga.t = 'T13+1.5'; }, null, /lectura «lección: fotos recibidas \(Kling O3\)»/],
  // ── las cifras de fuga_refs contra la medición del 11-oct ──
  ['datos: Kling O3 «recibió 3 de las 8» (la medición dice 4)', (p) => { p.fuga_refs.clips[1].de_las_8 = 3; }, null, /fuga_refs m5: 3 de las 8 y la medición dice 4/],
  ['datos: Seedance + referencias «recibió 3 de las 8» (la medición dice 2)', (p) => { p.fuga_refs.clips[0].de_las_8 = 3; }, null, /fuga_refs m4: 3 de las 8 y la medición dice 2/],
  ['datos: exceso de Kling O3 0,02 (la medición dice -0.012)', (p) => { p.fuga_refs.clips[1].exceso = 0.02; }, null, /fuga_refs m5: exceso 0\.02 y la medición dice -0\.012/],
  ['datos: exceso 0,05 (pasa del ruido de ±0,03)', (p) => { p.fuga_refs.clips[0].exceso = 0.05; }, null, /pasa del ruido de ±0,03/],
  ['datos: cara de Kling O3 89-170 px (la medición dice 89-168)', (p) => { p.fuga_refs.clips[1].cara_px = [89, 170]; }, null, /fuga_refs m5: cara de 89-170 px y la medición dice 89-168/],
  ['datos: imágenes de Seedance + referencias 4 (la clave dice 3_refs)', (p) => { p.fuga_refs.clips[0].imagenes = 4; }, null, /fuga_refs m4: 4 imágenes y la clave de PROCEDENCIA dice 3/],
  ['datos: Kling O3 «no sale en pantalla» (el plan lo muestra)', (p) => { p.fuga_refs.clips[1].en_pantalla = false; }, null, /fuga_refs m5: en_pantalla=false pero el plan lo muestra/],
  ['datos: fuente de la medición inexistente', (p) => { p.fuga_refs.fuente = 'hermes-content/references/modelos/lucia/v4/no-existe.txt'; }, null, /falta la fuente/],
  ['datos: sección de la medición con otro nombre', (p) => { p.fuga_refs.clips[1].etiqueta_medicion = 'Kling O3 7 refs (948a89d3)'; }, null, /la medición no tiene la sección «== Kling O3 7 refs/],
  // ── reglas que ya existían (el build sigue cortando) ──
  ['cifra: final de Kling 3.0 std 0,73 contra PROCEDENCIA', (p) => { p.motores[0].fin = 0.73; }, null, /final 0\.73 y PROCEDENCIA dice/],
  ['créditos: Kling O3 7 contra PROCEDENCIA', (p) => { p.motores[2].cr = 7; }, null, /7 créditos y PROCEDENCIA dice 6/],
  ['CTA: texto distinto', (p) => { p.tarjetas.find((c) => c.id === 'c12').acento = 'cada semana'; }, null, /CTA: «/],
  ['voz: frase prohibida en el guion', () => {}, { 'guion-voz.txt': cambiar('Se mide contra ocho fotos suyas.', 'Se mide contra ocho fotos de mis pacientes.') }, /frase prohibida «mis pacientes»/],
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
    vm.runInNewContext(src, { fs: fake, path, fileURLToPath, execFileSync: sinProcesos, buscarProhibidas, buscarProhibidasPie, buscarRecomendacion, buscarGenerales, AVISO_PIE, cronograma, leerDuraciones, holgura, tablaCaben, ORIGINALES_V2_0, process: proceso, console: consola }, { timeout: 8000 });
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
