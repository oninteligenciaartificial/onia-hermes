// Cronograma de los TRAMOS de voz (G5 v2). Una línea de guion-voz.txt = un tramo. Revisión 1 (11-oct-2026, hallazgo H1): el tiempo de la voz se estima en CARACTERES, no en palabras.
//   · la voz de Marcela se midió en G1 v2 en ≈ 17 caracteres por segundo (320 caracteres en ~19 s): una línea dura chars / 17 s. En palabras (3,6 por segundo) las líneas
//     de pocas letras por palabra salían de 14 a 21 caracteres por segundo y no cabían en su tramo (L2, L8) o dejaban un hueco largo (L3).
//   · si existe `duraciones.json` (la duración REAL de cada pista de voz; lo escribe `node scripts/poner-voz.mjs --medir DIR`), esa duración tiene prioridad sobre la estimación
//   · el tramo = voz + hueco, bajado al cuadro de 24 fps: hueco objetivo ≤ 0,25 s (lucia §11); si una tarjeta o una placa necesita más tiempo de lectura (plan.json → voz.lectura_min_cuadros)
//     el tramo crece hasta el tope: hueco ≤ 0,30 s. Si ni así alcanza, el build corta (hay que cambiar la línea o la tarjeta, no el tope)
//   · el guion de voz entero ≤ 450 caracteres con espacios (cupo de voz escaso: ~17 caracteres por segundo hablado)
// El ÚLTIMO tramo (el CTA) puede durar más que su línea: el CTA tiene que verse ≥ 2,4 s (regla de marca) y se queda en pantalla solo mientras se lee.
// Uso:  node scripts/voz.mjs        → imprime la tabla de tramos (y sale con 1 si algo incumple)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const CPS = 17, GAP_OBJ = 0.25, GAP_MAX = 0.30, FPS = 24, CUPO = 305;
export const palabras = (l) => l.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

// duraciones reales de las pistas: { "t01": 3.21, … } o un arreglo de 10 números (segundos de voz útil, sin silencio de cabeza ni de cola). null si no existe el archivo.
export function leerDuraciones(P) {
  const f = path.join(P, 'duraciones.json');
  if (!fs.existsSync(f)) return null;
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  const out = {};
  if (Array.isArray(j)) j.forEach((d, i) => { out[i + 1] = +d; });
  else for (const [k, d] of Object.entries(j)) { const n = +String(k).replace(/^t/i, ''); if (Number.isInteger(n) && n > 0) out[n] = +d; }
  return out;
}

export function cronograma(texto, ultimoCuadros, { duraciones = null, lecturaMin = {} } = {}) {
  const lineas = texto.split('\n').map((l) => l.trim()).filter(Boolean);
  let f = 0;
  const tramos = lineas.map((l, i) => {
    const n = i + 1, ultimo = i === lineas.length - 1;
    const w = palabras(l), medida = duraciones?.[n];
    const voz = medida ?? l.length / CPS;
    const objetivo = Math.floor(FPS * (voz + GAP_OBJ) + 1e-9), tope = Math.floor(FPS * (voz + GAP_MAX) + 1e-9);
    const pide = lecturaMin?.[n] ?? 0;
    let cuadros = ultimo ? Math.max(ultimoCuadros || 0, objetivo) : Math.max(objetivo, Math.min(pide, tope));
    const lecturaCorta = !ultimo && pide > tope;                 // la lectura pide más de lo que permite un hueco ≤ 0,30 s
    const t = { n, linea: l, palabras: w, chars: l.length, voz_s: voz, fuente: medida != null ? 'medida' : 'estimada', pide, a_f: f, b_f: f + cuadros, a: f / FPS, b: (f + cuadros) / FPS, hueco: (cuadros / FPS) - voz, ultimo, lecturaCorta };
    f += cuadros;
    return t;
  });
  const chars = lineas.join('\n').length;      // con un salto de línea entre una y otra: el peor caso del conteo
  return { lineas, tramos, chars, cuadros: f };
}

// segundo, dentro de la pista, en que empieza `ancla` (un trozo de la línea): reparto lineal por caracteres de la duración de la pista (estimada o medida).
// Es una estimación: la pausa interna entre frases y el ritmo la decide el TTS; con voz real se re-mide en el audio y se corrige `dt` en plan.json → rel.
export function tAncla(t, ancla) {
  const i = t.linea.toLowerCase().indexOf(String(ancla).toLowerCase());
  if (i < 0) throw new Error(`voz.mjs: «${ancla}» no está en la línea ${t.n} («${t.linea}»)`);
  return t.voz_s * i / t.chars;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
  const dur = leerDuraciones(P);
  const c = cronograma(fs.readFileSync(path.join(P, 'guion-voz.txt'), 'utf8'), plan.voz.ultimo_tramo_cuadros, { duraciones: dur, lecturaMin: plan.voz.lectura_min_cuadros });
  let mal = 0;
  console.log(`voz: ${dur ? 'duraciones REALES (duraciones.json) donde existen; el resto estimado' : `ESTIMADA a ${CPS} caracteres por segundo (no hay duraciones.json: no hay voz todavía)`}`);
  console.log('tramo palabras caract  voz(s)  fuente    a(s)    b(s)    dura   hueco');
  for (const t of c.tramos) {
    const ok = t.ultimo || (t.hueco <= GAP_MAX + 1e-9 && !t.lecturaCorta);
    if (!ok) mal++;
    const nota = t.ultimo ? ' (CTA: cola sin voz, se lee)' : t.pide > Math.floor(FPS * (t.voz_s + GAP_OBJ) + 1e-9) ? ` (la lectura pide ${t.pide} cuadros: hueco ${t.hueco.toFixed(3)} s)` : '';
    console.log(`${String(t.n).padStart(3)}   ${String(t.palabras).padStart(5)}   ${String(t.chars).padStart(5)}  ${t.voz_s.toFixed(3)}  ${t.fuente.padEnd(8)} ${t.a.toFixed(3).padStart(7)} ${t.b.toFixed(3).padStart(7)}  ${(t.b - t.a).toFixed(3)}  ${t.hueco.toFixed(3)}${nota}${ok ? '' : ' ✖'}`);
  }
  const huecos = c.tramos.filter((t) => !t.ultimo).map((t) => t.hueco);
  console.log(`total: ${c.lineas.length} líneas, ${c.tramos.reduce((s, t) => s + t.palabras, 0)} palabras, ${c.chars} caracteres con espacios (con un salto entre líneas; cupo ${plan.voz.max_caracteres}), ${c.cuadros} cuadros = ${(c.cuadros / FPS).toFixed(3)} s`);
  console.log(`huecos entre líneas: ${Math.min(...huecos).toFixed(3)} a ${Math.max(...huecos).toFixed(3)} s (objetivo ≤ ${GAP_OBJ}, tope ${GAP_MAX}); cola del CTA: ${c.tramos.at(-1).hueco.toFixed(3)} s`);
  if (c.chars > plan.voz.max_caracteres) { console.error(`✖ ${c.chars} caracteres: pasa el cupo de ${plan.voz.max_caracteres}`); mal++; }
  if (c.cuadros !== plan.lienzo.cuadros) { console.error(`✖ el cronograma da ${c.cuadros} cuadros y plan.json dice ${plan.lienzo.cuadros} (correr scripts/retemporizar.mjs)`); mal++; }
  process.exit(mal ? 1 : 0);
}
