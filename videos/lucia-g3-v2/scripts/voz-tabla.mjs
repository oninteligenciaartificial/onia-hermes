#!/usr/bin/env node
// Tabla «cabe / no cabe» de la voz, por línea (revisión 1, H1, 11-oct-2026). Lee plan-resuelto.json (lo escribe build.mjs) y guion-voz.txt; NO genera ni mide voz:
// estima cada línea a plan.voz.cps (17 caracteres por segundo, G1 v2) o usa duraciones.json si existe (voz real, escrita por poner-voz.mjs --medir).
//   · ventana  = tiempo de voz que el plan le da a la línea (T<n> → L<n>); entre ventanas hay 6 cuadros (0,25 s), donde cae cada empuje de pantalla
//   · cabe     = voz ≤ ventana (la línea no pisa a la siguiente ni cruza la costura)
//   · hueco    = ventana − voz (lo que sobra dentro de la ventana; objetivo ≤ 0,25 s, tope 0,30 s)
//   · pausa    = hueco + 0,25 s de la costura = el silencio real entre una línea y la siguiente SI la voz arranca en el inicio de su ventana. Con duraciones reales la ventana se
//                ajusta a la voz (ceil a cuadros) y la pausa queda en 0,25 s + menos de 1 cuadro.
// Escribe qa/voz-tramos.txt y qa/voz-tramos.json (los lee poner-voz.mjs). Sale con 1 si alguna línea no cabe o deja más hueco que el tope.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const R = JSON.parse(fs.readFileSync(path.join(P, 'plan-resuelto.json'), 'utf8'));
const V = R.voz, T = V.tramos, FPS = R.lienzo.fps, hueco = V.hueco_cuadros / FPS;
const filas = T.map((t, i) => {
  const ult = i === T.length - 1;
  const cabe = t.voz_s <= t.dur_s + 1e-9, huecoOk = t.sobra_s <= V.sobra_max_s + 1e-9;
  return { n: t.i, linea: t.texto, chars: t.chars, fuente: t.fuente, voz_s: t.voz_s, a: +(t.a_s).toFixed(3), b: +(t.b_s).toFixed(3), dura: t.dur_s, a_f: t.a, b_f: t.b, sobra: t.sobra_s,
    pausa: t.pausa_s, car_max: Math.floor(t.dur_s * V.cps + 1e-9), car_min: Math.max(0, Math.ceil((t.dur_s - V.sobra_max_s) * V.cps - 1e-9)), cabe, hueco_ok: huecoOk, ultimo: ult };
});
const out = [];
out.push(`Voz de G3 v2 · tabla caben/no caben (${filas[0].fuente === 'medida' ? 'duraciones REALES de duraciones.json' : `ESTIMADA a ${V.cps} caracteres por segundo: no hay voz todavía`})`);
out.push('lín  car  voz(s)  ventana(s)  [de → a, s]       hueco  pausa  car(mín-máx)  cabe  hueco ≤ 0,30   línea');
for (const f of filas) {
  out.push(`${String(f.n).padStart(3)}  ${String(f.chars).padStart(3)}  ${f.voz_s.toFixed(3)}  ${f.dura.toFixed(3).padStart(8)}    [${f.a.toFixed(3).padStart(6)} → ${f.b.toFixed(3).padStart(6)}]  ${f.sobra.toFixed(3).padStart(5)}  ${f.ultimo ? ' cola ' : f.pausa.toFixed(3)}  ${String(f.car_min).padStart(2)}-${String(f.car_max).padEnd(2)}        ${f.cabe ? 'SÍ  ' : 'NO  '}  ${f.hueco_ok ? 'sí' : 'NO'}${f.sobra > V.sobra_obj_s + 1e-9 ? ' (> 0,25)' : '           '}  ${f.linea}`);
}
const chars = filas.reduce((s, f) => s + f.chars, 0), vozTot = filas.reduce((s, f) => s + f.voz_s, 0);
const margen = filas.filter((f) => f.sobra < 0.05).map((f) => `L${f.n}`);
out.push('');
out.push(`caben ${filas.filter((f) => f.cabe).length} de ${filas.length}; hueco ≤ 0,30 s en ${filas.filter((f) => f.hueco_ok).length} de ${filas.length} (mayor ${Math.max(...filas.map((f) => f.sobra)).toFixed(3)} s, menor ${Math.min(...filas.map((f) => f.sobra)).toFixed(3)} s)`);
out.push(`caracteres: ${chars} sin saltos (${chars + filas.length - 1} con saltos; cupo del guion ${V.max_caracteres}); cupo de ElevenLabs que QUEDA hasta el 13-oct 01:17 UTC: 381 → NO alcanza (${chars - 381} de más; una sola toma, sin retomas)`);
out.push(`voz estimada: ${vozTot.toFixed(2)} s en ${filas.length} líneas; ventanas ${filas.reduce((s, f) => s + f.dura, 0).toFixed(2)} s + ${(filas.length - 1)} costuras de ${hueco.toFixed(2)} s + cola ${(V.cola_cuadros / FPS).toFixed(2)} s = ${R.lienzo.duracion} s (pedido 26-30 s)`);
out.push(`margen < 0,05 s (la estimación de 17 car/s tiene ±10 %: si Marcela habla más lento estas líneas se salen hasta ~0,25 s hacia la costura, sin pisar a la siguiente): ${margen.join(', ') || 'ninguna'}`);
out.push(`pausa = hueco + 0,25 s de costura. Antes de la voz real es ${Math.min(...filas.filter((f) => !f.ultimo).map((f) => f.pausa)).toFixed(3)}-${Math.max(...filas.filter((f) => !f.ultimo).map((f) => f.pausa)).toFixed(3)} s; con duraciones.json (build.mjs ajusta cada ventana a la voz real) baja a 0,25 s + < 1 cuadro (0,042 s).`);
const mal = filas.filter((f) => !f.cabe || !f.hueco_ok).length;
out.push(mal ? `✖ ${mal} línea(s) no cumplen` : '✔ las 12 líneas caben en su ventana con un hueco ≤ 0,30 s');
console.log(out.join('\n'));
fs.writeFileSync(path.join(P, 'qa/voz-tramos.txt'), out.join('\n') + '\n');
fs.writeFileSync(path.join(P, 'qa/voz-tramos.json'), JSON.stringify(filas.map((f) => ({ n: f.n, linea: f.linea, a: f.a, b: f.b, dura: f.dura, ultimo: f.ultimo })), null, 1) + '\n');
process.exit(mal ? 1 : 0);
