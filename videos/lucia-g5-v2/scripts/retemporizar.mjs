#!/usr/bin/env node
// Re-temporiza plan.json desde el CRONOGRAMA DE VOZ (scripts/voz.mjs). Revisión 1 (11-oct-2026, H1): cuando cambian las duraciones de la voz (otra línea, otro ritmo, o las
// duraciones reales en duraciones.json) cambian los tramos, y con ellos las costuras, las tarjetas y TODOS los eventos de la pantalla. Esto lo hace de una vez:
//   · tramos, tarjetas y costuras (plan.costuras[].tramo = el tramo que entra) toman los segundos del cronograma; los medios (fotos y placas) siguen a las costuras (entra en T−6 cuadros, sale en T)
//   · cada evento listado en plan.rel se coloca en  inicio del tramo + desplazamiento  o  inicio del tramo + (segundo de una ANCLA dentro de la línea de voz) + dt.
//     rel: { "ruta.en.plan": [n_de_tramo, segundos] | [n_de_tramo, { ancla: "trozo de la línea", dt: segundos }] }.  El reparto de una ancla es lineal por caracteres (voz.mjs → tAncla):
//     es una estimación hasta que haya voz; con la voz real se re-mide en el audio y se corrige dt.
// Sin argumentos reescribe plan.json. Con --ver solo muestra qué cambiaría (sale con 1 si plan.json está desfasado: build.mjs lo usa como control).
// Uso:  node scripts/retemporizar.mjs [--ver]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cronograma, leerDuraciones, tAncla, FPS } from './voz.mjs';

const redondea = (x, d) => +(+x).toFixed(d);
const poner = (obj, ruta, v) => {
  const k = ruta.split('.'); let o = obj;
  for (const s of k.slice(0, -1)) { if (o[s] == null) throw new Error(`retemporizar: «${ruta}» no existe en plan.json (falla en «${s}»)`); o = o[s]; }
  o[k.at(-1)] = v;
};

export function cronogramaDelPlan(P, plan) {
  return cronograma(fs.readFileSync(path.join(P, 'guion-voz.txt'), 'utf8'), plan.voz.ultimo_tramo_cuadros, { duraciones: leerDuraciones(P), lecturaMin: plan.voz.lectura_min_cuadros });
}

export function retemporizar(plan, crono) {
  const p = structuredClone(plan), T = crono.tramos, PUSH = p.empuje.cuadros / FPS;
  const DUR = crono.cuadros / FPS;
  if (T.length !== p.tramos.length || T.length !== p.tarjetas.length) throw new Error(`retemporizar: ${T.length} líneas de voz, ${p.tramos.length} tramos y ${p.tarjetas.length} tarjetas`);
  p.lienzo.cuadros = crono.cuadros; p.lienzo.duracion = redondea(DUR, 12);
  p.tramos.forEach((tr, i) => { tr.a = redondea(T[i].a, 12); tr.b = redondea(T[i].b, 12); });
  p.tarjetas.forEach((c, i) => { c.a = redondea(T[i].a, 12); c.b = redondea(T[i].b, 12); });
  for (const c of p.costuras) c.t = redondea(T[c.tramo - 1].a, 12);
  const med = Object.fromEntries(p.medios.map((m) => [m.id, m]));
  p.medios[0].a = 0; p.medios.at(-1).b = redondea(DUR, 12);
  for (const c of p.costuras) {
    for (const id of c.entra) med[id].a = redondea(c.t - PUSH, 12);
    for (const id of c.sale) med[id].b = redondea(c.t, 12);
  }
  for (const [ruta, [n, off]] of Object.entries(p.rel || {})) {
    const t = T[n - 1]; if (!t) throw new Error(`retemporizar: rel «${ruta}» pide el tramo ${n}, que no existe`);
    const d = typeof off === 'number' ? off : tAncla(t, off.ancla) + (off.dt || 0);
    poner(p, ruta, redondea(t.a + d, 3));
  }
  return p;
}

// diferencias entre dos planes (números con tolerancia 1e-6): lista de «ruta: antes → después»
export function diferencias(a, b, ruta = '') {
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) > 1e-6 ? [`${ruta}: ${a} → ${b}`] : [];
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const ks = new Set([...Object.keys(a), ...Object.keys(b)]);
    return [...ks].flatMap((k) => diferencias(a[k], b[k], ruta ? `${ruta}.${k}` : k));
  }
  return a === b ? [] : [`${ruta}: ${JSON.stringify(a)} → ${JSON.stringify(b)}`];
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
  const nuevo = retemporizar(plan, cronogramaDelPlan(P, plan));
  const dif = diferencias(plan, nuevo);
  if (process.argv.includes('--ver')) {
    console.log(dif.length ? `plan.json está desfasado del cronograma de voz (${dif.length} valores):\n  ${dif.join('\n  ')}` : 'plan.json está al día con el cronograma de voz');
    process.exit(dif.length ? 1 : 0);
  }
  fs.writeFileSync(path.join(P, 'plan.json'), JSON.stringify(nuevo, null, 1));
  console.log(dif.length ? `plan.json re-temporizado (${dif.length} valores):\n  ${dif.join('\n  ')}` : 'plan.json ya estaba al día');
}
