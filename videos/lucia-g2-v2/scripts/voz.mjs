// Cronograma de los TRAMOS de voz (G2 v2). Una línea de guion-voz.txt = un tramo. Revisión 1 (11-oct-2026, hallazgo H1): la voz se mide en CARACTERES, no en palabras.
//   · la voz de Marcela se midió en G1 v2 en ≈ 17 caracteres por segundo (320 caracteres en ~19 s). La primera versión de G2 v2 calculaba los tramos a 3,6 PALABRAS por segundo
//     (= 20 caracteres por segundo con este guion) y por eso cinco líneas se pisaban con la siguiente y una dejaba 0,55 s de silencio.
//   · una línea dura  chars / 17  s (estimada). Si existe `duraciones.json` (la duración REAL de cada pista, escrita por `node scripts/poner-voz.mjs --medir DIR`), esa duración
//     manda sobre la estimación y todo se re-temporiza solo: en G2 v2 los tiempos del plan son anclas («T6+0.8») que `build.mjs` resuelve desde este cronograma.
//   · el tramo = voz + hueco, bajado al cuadro de 24 fps. Hueco objetivo ≤ 0,25 s (lucia §11). Si una tarjeta necesita más tiempo de lectura (plan.json → voz.lectura_min_cuadros)
//     el tramo crece hasta el tope de hueco ≤ 0,30 s. Si ni así alcanza, el build corta: hay que cambiar la línea o la tarjeta, no el tope.
//   · el último tramo (el CTA) dura plan.voz.cta_ventana_cuadros: el CTA se queda en pantalla ≥ 2,4 s aunque la voz termine antes (cola sin voz, se lee).
// Uso:  node scripts/voz.mjs [--escribir]   → imprime la tabla caben/no caben (a 16, 17 y 18 caracteres por segundo) y, con --escribir, la guarda en qa/voz-caben.txt.
//       Sale con 1 si alguna línea no cabe a 17 c/s (pisa a la siguiente o deja un hueco > 0,30 s) o si el guion pasa del cupo.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const FPS = 24;
export const palabras = (l) => l.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

// duraciones reales de las pistas: { "t01": 3.21, … } o un arreglo de 14 números (segundos de voz útil, sin silencio de cabeza ni de cola). null si no existe el archivo.
export function leerDuraciones(P) {
  const f = path.join(P, 'duraciones.json');
  if (!fs.existsSync(f)) return null;
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  const out = {};
  if (Array.isArray(j)) j.forEach((d, i) => { out[i + 1] = +d; });
  else for (const [k, d] of Object.entries(j)) { const n = +String(k).replace(/^t/i, ''); if (Number.isInteger(n) && n > 0) out[n] = +d; }
  return out;
}

// V = plan.voz. Devuelve los tramos con los campos que usa build.mjs: i, texto, palabras, caracteres, sf (cuadro de inicio), df (cuadros hasta el hueco: la ventana de voz),
// t (inicio, s), e (fin de la ventana de voz, s), w (inicio del tramo siguiente, s) y los datos de la tabla (voz_s, fuente, hueco_est, extendido).
export function cronograma(texto, V, { duraciones = null } = {}) {
  const cps = V.cps, objG = V.gap_objetivo, maxG = V.gap_max, hu = V.hueco_cuadros;
  const lineas = texto.split('\n').map((l) => l.trim()).filter(Boolean);
  let f = V.inicio_cuadros;
  const tramos = lineas.map((l, i) => {
    const n = i + 1, ultimo = i === lineas.length - 1;
    const chars = [...l].length, medida = duraciones?.[n];
    const voz = medida ?? chars / cps;
    const objetivo = Math.floor(FPS * (voz + objG) + 1e-9), tope = Math.floor(FPS * (voz + maxG) + 1e-9);
    const pide = +(V.lectura_min_cuadros?.[n] ?? 0);
    let tf = ultimo ? Math.max(V.cta_ventana_cuadros, objetivo) : Math.max(objetivo, Math.min(pide, tope));
    const lecturaCorta = !ultimo && pide > tope;                  // la lectura pide más de lo que permite un hueco ≤ gap_max
    const df = ultimo ? Math.min(tf, Math.ceil(FPS * voz)) : tf - hu;
    const t = {
      i: n, texto: l, palabras: palabras(l), caracteres: chars, voz_s: voz, fuente: medida != null ? 'medida' : 'estimada', pide,
      sf: f, tf, df, t: f / FPS, e: (f + df) / FPS, w: null, ultimo, lecturaCorta, extendido: !ultimo && tf > objetivo,
    };
    f += tf;
    return t;
  });
  tramos.forEach((t, k) => { t.w = k + 1 < tramos.length ? tramos[k + 1].sf / FPS : (t.sf + t.tf) / FPS; });
  tramos.forEach((t) => { t.hueco_est = t.w - (t.t + t.voz_s); });
  return { lineas, tramos, chars: lineas.reduce((s, l) => s + [...l].length, 0), cuadros: f };
}

// «cabe» a una velocidad de voz dada (caracteres por segundo): la línea termina ANTES de que empiece la siguiente (hueco ≥ 0) y deja ≤ gap_max de silencio.
export const holgura = (t, cps) => t.w - (t.t + t.caracteres / cps);
// ventana de caracteres que cabe en este tramo a `cps`: [no pisa, no deja más de `gap` de silencio]
export const ventana = (t, cps, gap) => [Math.ceil(cps * (t.w - t.t - gap) - 1e-9), Math.floor(cps * (t.w - t.t) + 1e-9)];

export function tablaCaben(c, V, originales = null) {
  const out = [];
  const f1 = (x) => (x >= 0 ? '+' : '−') + Math.abs(x).toFixed(2);
  out.push(`Tabla caben / no caben (G2 v2, revisión 1 H1). Voz estimada a ${V.cps} caracteres por segundo (G1 v2: 320 caracteres ≈ 19 s); NO hay voz generada.`);
  out.push('Hueco = segundos entre el fin de la línea y el inicio de la siguiente (+ silencio, − solape con la voz siguiente). Cabe = a 17 c/s no pisa y deja ≤ 0,30 s.');
  out.push('Ventana = caracteres que caben en este tramo a 17 c/s (no pisan y dejan ≤ 0,25 s; entre paréntesis el tope de 0,30 s). Las columnas 16 y 18 son la sensibilidad de ±1 c/s: con voz real se re-deriva el tramo (duraciones.json).');
  out.push('');
  out.push(' L  car  voz17  tramo   ventana (17 c/s)   hueco@16   hueco@17   hueco@18   cabe  línea');
  for (const t of c.tramos) {
    const ult = t.ultimo, w25 = ventana(t, c.cps ?? V.cps, 0.25), w30 = ventana(t, c.cps ?? V.cps, 0.30);
    const h16 = holgura(t, 16), h17 = holgura(t, V.cps), h18 = holgura(t, 18);
    const cabe = ult ? h17 >= 0 : h17 >= -1e-9 && h17 <= V.gap_max + 1e-9;
    out.push(`${String(t.i).padStart(2)}  ${String(t.caracteres).padStart(3)}  ${(t.caracteres / V.cps).toFixed(2).padStart(5)}  ${(t.w - t.t).toFixed(3).padStart(6)}  ${ult ? '   (CTA: cola sin voz)  ' : `${String(w25[0]).padStart(5)}–${String(w25[1]).padEnd(3)} (${String(w30[0])}–${w30[1]})   `.padEnd(22)}${f1(h16).padStart(8)}   ${f1(h17).padStart(8)}   ${f1(h18).padStart(8)}   ${cabe ? 'sí  ' : 'NO  '}  «${t.texto}»${t.extendido ? '  [tramo extendido por lectura: hueco ' + h17.toFixed(2) + ' s]' : ''}`);
  }
  const mx = Math.max(...c.tramos.filter((t) => !t.ultimo).map((t) => holgura(t, V.cps)));
  const mn = Math.min(...c.tramos.filter((t) => !t.ultimo).map((t) => holgura(t, V.cps)));
  out.push('');
  out.push(`A 17 c/s: huecos entre líneas de ${mn.toFixed(2)} a ${mx.toFixed(2)} s (objetivo ≤ ${V.gap_objetivo}, tope ${V.gap_max}); cola del CTA ${c.tramos.at(-1).hueco_est.toFixed(2)} s sin voz (el CTA se lee ${(c.tramos.at(-1).tf / FPS).toFixed(2)} s).`);
  const fr = (cps) => c.tramos.filter((t) => !t.ultimo).filter((t) => holgura(t, cps) < -1e-9).map((t) => `L${t.i}`);
  out.push(`Pisan a la siguiente a 16 c/s: ${fr(16).join(' ') || 'ninguna'} · a 17 c/s: ${fr(17).join(' ') || 'ninguna'} · a 18 c/s: ${fr(18).join(' ') || 'ninguna'}.`);
  const largos = (cps) => c.tramos.filter((t) => !t.ultimo).filter((t) => holgura(t, cps) > V.gap_max + 1e-9).map((t) => `L${t.i}`);
  out.push(`Dejan > 0,30 s de silencio a 16 c/s: ${largos(16).join(' ') || 'ninguna'} · a 17 c/s: ${largos(17).join(' ') || 'ninguna'} · a 18 c/s: ${largos(18).join(' ') || 'ninguna'}.`);
  out.push(`Total: ${c.lineas.length} líneas, ${c.tramos.reduce((s, t) => s + t.palabras, 0)} palabras, ${c.chars} caracteres con espacios (${[...c.lineas.join('\n')].length} con los saltos de línea). Cupo de la pieza ${V.max_caracteres}; cupo de voz que queda hoy ${V.cupo_hoy} hasta el ${V.cupo_hasta}.`);
  if (originales) {
    out.push('');
    out.push('Costuras contra la v2.0 (re-corte mudo del 11-oct, tramos a 3,6 palabras/s): inicio de cada tramo, antes → ahora.');
    out.push(c.tramos.map((t, k) => `T${t.i} ${originales[k].toFixed(3)} → ${t.t.toFixed(3)}`).join(' · '));
    out.push(`Duración: 26,500 s → ${((c.tramos.at(-1).sf + c.tramos.at(-1).tf) / FPS).toFixed(3)} s`);
    out.push('');
    out.push('Contra las ventanas de caracteres de la revisión 1 (H1; calculadas para los tramos de la v2.0 con L1 y L2 intercambiadas: no pisan y dejan ≤ 0,25 s a 17 c/s):');
    out.push(c.tramos.map((t, k) => { const w = VENTANAS_REVISION_1[k]; const ok = w && t.caracteres >= w[0] && t.caracteres <= w[1]; return `L${t.i} ${t.caracteres} car ${w ? `${w[0]}–${w[1]}` : '≤ 47'} ${ok || (!w && t.caracteres <= 47) ? 'dentro' : 'FUERA'}`; }).join(' · '));
    out.push('Las costuras se movieron igual (arriba): H6 pide alargar tarjetas (el gancho solo necesita +0,33 s para que c1 y c2 alcancen su lectura), así que los tramos se derivan de las líneas (caracteres/17 + hueco) y no de una tabla fija; con voz real se derivan de las duraciones medidas.');
  }
  return out.join('\n');
}

// ventanas de caracteres de la revisión 1 (H1), tramos de la v2.0 con L1 y L2 intercambiadas por H2; la L14 (CTA) solo tiene tope: ≤ 47
export const VENTANAS_REVISION_1 = [[19, 23], [28, 32], [28, 32], [19, 23], [19, 23], [37, 41], [19, 23], [19, 23], [37, 41], [19, 23], [37, 41], [28, 32], [33, 37], null];
export const ORIGINALES_V2_0 = [0.125, 2.042, 3.417, 5.333, 6.708, 8.083, 10.542, 11.917, 13.292, 15.75, 17.125, 19.583, 21.5, 23.708];

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
  const V = plan.voz;
  const dur = leerDuraciones(P);
  const c = cronograma(fs.readFileSync(path.join(P, V.archivo), 'utf8'), V, { duraciones: dur });
  const txt = tablaCaben(c, V, ORIGINALES_V2_0);
  console.log(txt);
  let mal = 0;
  for (const t of c.tramos) {
    if (t.lecturaCorta) { console.error(`✖ L${t.i}: la lectura pide ${t.pide} cuadros y el hueco ≤ ${V.gap_max} s solo permite ${Math.floor(FPS * (t.voz_s + V.gap_max))}`); mal++; }
    const h = holgura(t, V.cps);
    if (!t.ultimo && (h < -1e-9 || h > V.gap_max + 1e-9)) { console.error(`✖ L${t.i}: no cabe a ${V.cps} c/s (hueco ${h.toFixed(3)} s)`); mal++; }
  }
  if (c.chars > V.max_caracteres) { console.error(`✖ ${c.chars} caracteres: pasa el cupo de la pieza (${V.max_caracteres})`); mal++; }
  if (process.argv.includes('--escribir')) fs.writeFileSync(path.join(P, 'qa/voz-caben.txt'), txt + '\n');
  process.exit(mal ? 1 : 0);
}
