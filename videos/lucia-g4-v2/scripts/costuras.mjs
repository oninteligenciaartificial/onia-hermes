#!/usr/bin/env node
// Costuras RÍGIDAS de 6 cuadros: en cada empuje, lo que sale (0 → −1080) y lo que entra (+1080 → 0) tienen que ir pegados borde con borde en CADA cuadro
// (sin tira de fondo entre ellos ni solapamiento), empezar en T−6 cuadros y terminar en T, y las tarjetas y los datos que viajan tienen que moverse
// EXACTAMENTE igual que la imagen que los lleva. Se mide en el DOM, cuadro a cuadro. Uso: node scripts/costuras.mjs   (sale con 1 si algo incumple)
import { abrir, plan, FPS } from './lib-dom.mjs';
const { b, pg } = await abrir();
const PUSH = plan.empuje.cuadros;
const vivo = (id) => id; 
const res = await pg.evaluate(([costuras, PUSH, FPS]) => {
  const tl = window.__timelines.main; tl.pause();
  const L = (id) => { const e = document.getElementById(id); return e ? e.getBoundingClientRect().left : null; };
  const R = (id) => { const e = document.getElementById(id); return e ? e.getBoundingClientRect().right : null; };
  const out = [];
  for (const c of costuras) {
    const T = Math.round(c.t * FPS);
    const medios = (ids) => ids.filter((i) => /^(f-|pl-)/.test(i));
    const sM = medios(c.sale)[0], eM = medios(c.entra)[0];
    const filas = [];
    const base = {};
    for (let k = -PUSH; k <= 0; k++) {
      tl.time((T + k) / FPS);
      const fila = { k, sL: L(sM), sR: R(sM), eL: L(eM) };
      fila.viajan = [...c.sale.filter((i) => !/^(f-|pl-)/.test(i)).map((i) => ['s', i, L(i)]), ...c.entra.filter((i) => !/^(f-|pl-)/.test(i)).map((i) => ['e', i, L(i)])];
      if (k === -PUSH) for (const [, i, x] of fila.viajan) base[i] = x;
      fila.dev = fila.viajan.map(([lado, i, x]) => [i, x - base[i] - (lado === 's' ? fila.sL : fila.eL - 1080)]);
      filas.push(fila);
    }
    out.push({ t: c.t, T, sM, eM, filas });
  }
  return out;
}, [plan.costuras, PUSH, FPS]);
await b.close();
let malos = 0;
for (const c of res) {
  let maxJunta = 0, maxViaje = 0;
  for (const f of c.filas) {
    maxJunta = Math.max(maxJunta, Math.abs(f.sR - f.eL));
    for (const [, d] of f.dev) maxViaje = Math.max(maxViaje, Math.abs(d));
  }
  const a = c.filas[0], z = c.filas.at(-1);
  const okIni = Math.abs(a.sL) < 0.6 && Math.abs(a.eL - 1080) < 0.6, okFin = Math.abs(z.sR) < 0.6 && Math.abs(z.eL) < 0.6;
  const ok = maxJunta < 0.6 && maxViaje < 0.6 && okIni && okFin;
  if (!ok) malos++;
  console.log(`${ok ? 'ok ' : '✖  '} T=${c.t.toFixed(3)} s (cuadro ${c.T}): ${c.sM} → ${c.eM}; junta máxima entre borde y borde ${maxJunta.toFixed(2)} px; lo que viaja se desvía ${maxViaje.toFixed(2)} px; sale ${a.sL.toFixed(0)}→${z.sR.toFixed(0)}, entra ${a.eL.toFixed(0)}→${z.eL.toFixed(0)}; cuadros ${c.filas.length} (T−6 … T)`);
}
if (malos) { console.error(`✖ ${malos} costura(s) no son rígidas`); process.exit(1); }
console.log(`✔ ${res.length} costuras rígidas de ${PUSH} cuadros: bordes pegados en todos los cuadros, empiezan en T−${PUSH} y terminan en T, y lo que viaja se mueve con su imagen`);
