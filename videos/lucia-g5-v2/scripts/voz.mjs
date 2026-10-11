// Cronograma de los TRAMOS de voz (G5 v2). Una línea de guion-voz.txt = un tramo. Regla de la madre (10-oct-2026):
//   · cada tramo dura lo que dura su línea a 3,6 palabras por segundo (palabras HABLADAS: una cifra suelta cuenta como una palabra; no hay decimales en la voz)
//   · el hueco entre una línea y la siguiente es ≤ 0,25 s (el tramo = voz + hueco, bajado al cuadro de 24 fps: así el hueco nunca pasa de 0,25 s)
//   · el guion de voz entero ≤ 450 caracteres con espacios (cupo de voz escaso: ~19 caracteres por segundo hablado)
// El ÚLTIMO tramo (el CTA) puede durar más que su línea: el CTA tiene que verse ≥ 2,4 s (regla de marca) y se queda en pantalla solo mientras se lee.
// Uso:  node scripts/voz.mjs        → imprime la tabla de tramos (y sale con 1 si algo incumple)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const WPS = 3.6, GAP_MAX = 0.25, FPS = 24, CUPO = 450;
export const palabras = (l) => l.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

export function cronograma(texto, ultimoCuadros) {
  const lineas = texto.split('\n').map((l) => l.trim()).filter(Boolean);
  let f = 0;
  const tramos = lineas.map((l, i) => {
    const w = palabras(l), voz = w / WPS;
    const ultimo = i === lineas.length - 1;
    const cuadros = ultimo && ultimoCuadros ? ultimoCuadros : Math.floor(FPS * (voz + GAP_MAX) + 1e-9);
    const t = { n: i + 1, linea: l, palabras: w, chars: l.length, voz_s: voz, a_f: f, b_f: f + cuadros, a: f / FPS, b: (f + cuadros) / FPS, hueco: (cuadros / FPS) - voz, ultimo };
    f += cuadros;
    return t;
  });
  const chars = lineas.join('\n').length;      // con un salto de línea entre una y otra: el peor caso del conteo
  return { lineas, tramos, chars, cuadros: f };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
  const c = cronograma(fs.readFileSync(path.join(P, 'guion-voz.txt'), 'utf8'), plan.voz.ultimo_tramo_cuadros);
  let mal = 0;
  console.log('tramo palabras caract  voz(s)  a(s)    b(s)    dura   hueco');
  for (const t of c.tramos) {
    const ok = t.ultimo || t.hueco <= GAP_MAX + 1e-9;
    if (!ok) mal++;
    console.log(`${String(t.n).padStart(3)}   ${String(t.palabras).padStart(5)}   ${String(t.chars).padStart(5)}  ${t.voz_s.toFixed(3)}  ${t.a.toFixed(3).padStart(7)} ${t.b.toFixed(3).padStart(7)}  ${(t.b - t.a).toFixed(3)}  ${t.hueco.toFixed(3)}${t.ultimo ? ' (CTA: cola sin voz, se lee)' : ''}${ok ? '' : ' ✖'}`);
  }
  console.log(`total: ${c.lineas.length} líneas, ${c.tramos.reduce((s, t) => s + t.palabras, 0)} palabras, ${c.chars} caracteres con espacios (con un salto entre líneas; cupo ${CUPO}), ${c.cuadros} cuadros = ${(c.cuadros / FPS).toFixed(3)} s`);
  if (c.chars > CUPO) { console.error(`✖ ${c.chars} caracteres: pasa el cupo de ${CUPO}`); mal++; }
  if (c.cuadros !== plan.lienzo.cuadros) { console.error(`✖ el cronograma da ${c.cuadros} cuadros y plan.json dice ${plan.lienzo.cuadros}`); mal++; }
  process.exit(mal ? 1 : 0);
}
