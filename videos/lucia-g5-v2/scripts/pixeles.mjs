#!/usr/bin/env node
// Controles de PÍXELES del render sin Python: las versiones de Node + ffmpeg de scripts/vacios.py, scripts/aire.py y scripts/psnr-fotos.py (revisión 1, 11-oct-2026).
// Existen porque el venv del face-gate (numpy + cv2) no está en toda máquina y instalar dependencias pide aprobación; los umbrales y las reglas son LOS MISMOS que los de los .py
// (que siguen siendo la referencia donde haya venv). Salidas con el mismo formato que las de qa/.
// Uso:  node scripts/pixeles.mjs vacios out/g5-v2-final-1080x1920.mp4 > qa/vacios-y-saltos.txt
//       node scripts/pixeles.mjs aire   out/g5-v2-final-1080x1920.mp4 > qa/aire-pixeles.txt        (necesita qa/lectura-tarjetas.json, que escribe aire.mjs)
//       node scripts/pixeles.mjs psnr   out/g5-v2-final-1080x1920.mp4 > qa/psnr-fotos.txt
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
const [modo, video] = process.argv.slice(2);
const FPS = plan.lienzo.fps;
const out = [];
const say = (s = '') => out.push(s);
const raw = (args) => { const r = spawnSync('ffmpeg', ['-v', 'error', ...args, '-f', 'rawvideo', '-'], { maxBuffer: 1 << 30 }); if (r.status !== 0) throw new Error(String(r.stderr)); return r.stdout; };
// cuadros en gris a w x h (promedio de área): Uint8Array por cuadro
const grises = (w, h) => { const b = raw(['-i', video, '-vf', `scale=${w}:${h}:flags=area,format=gray`, '-pix_fmt', 'gray']); const n = Math.floor(b.length / (w * h)); return Array.from({ length: n }, (_, i) => b.subarray(i * w * h, (i + 1) * w * h)); };
let codigo = 0;

if (modo === 'vacios') {
  const fr = grises(180, 320), n = fr.length;
  const L = fr.map((f) => f.reduce((s, v) => s + v, 0) / f.length);
  const S = fr.map((f, i) => Math.sqrt(f.reduce((s, v) => s + (v - L[i]) ** 2, 0) / f.length));
  say(`cuadros ${n}`);
  const vac = [...S.keys()].filter((i) => S[i] < 6);
  say(`cuadros PLANOS (std<6): [${vac.join(', ')}]`);
  say(`luma min/max: ${Math.min(...L).toFixed(1)} / ${Math.max(...L).toFixed(1)}`);
  const d = L.slice(1).map((v, i) => Math.abs(v - L[i]));
  const top = [...d.keys()].sort((a, b) => d[b] - d[a]).slice(0, 12).sort((a, b) => a - b);
  say('mayores saltos de luma entre cuadros consecutivos (cuadro i -> i+1, t, luma_i, luma_i+1):');
  for (const i of top) say(`  ${i}->${i + 1}  t=${((i + 1) / FPS).toFixed(3)}  ${L[i].toFixed(1)} -> ${L[i + 1].toFixed(1)}  (Δ=${d[i].toFixed(1)})`);
  const enEmpuje = new Set();
  for (const c of plan.costuras) if (c.tipo === 'empuje') { const T = Math.round(c.t * FPS); for (let i = T - 7; i < T + 2; i++) enEmpuje.add(i); }
  const fuera = [...d.keys()].filter((i) => !enEmpuje.has(i)).map((i) => [d[i], i]).sort((a, b) => b[0] - a[0])[0];
  say(`mayor salto de luma FUERA de los empujes: Δ=${fuera[0].toFixed(1)} en ${fuera[1]}->${fuera[1] + 1} (t=${((fuera[1] + 1) / FPS).toFixed(3)})`);
  for (const c of plan.costuras) if (c.tipo === 'empuje') { const T = Math.round(c.t * FPS); say(`${c.t} ` + Array.from({ length: 10 }, (_, k) => T - 6 + k).map((i) => `${i}:${L[i].toFixed(0)}/${S[i].toFixed(0)}`).join(' ')); }
  if (vac.length) codigo = 1;
} else if (modo === 'aire') {
  const TAU = 0.02, MAXQ = plan.aire.quieto_max_s;
  const lect = JSON.parse(fs.readFileSync(path.join(P, 'qa/lectura-tarjetas.json'), 'utf8'));
  const fr = grises(270, 480), N = fr.length;
  const d = fr.map((f, i) => { if (!i) return 0; let s = 0; const g = fr[i - 1]; for (let k = 0; k < f.length; k++) s += Math.abs(f[k] - g[k]); return s / f.length; });
  const enLectura = (f) => lect.some((l) => l.legible_desde - 1e-9 <= f / FPS && f / FPS < l.lee_hasta - 1e-9);
  const quieto = d.map((v, f) => f > 0 && v < TAU);
  const tramos = (descontar) => {
    const o = []; let cur = null;
    for (let f = 0; f < N; f++) {
      const q = quieto[f] && !(descontar && enLectura(f));
      if (q) { if (!cur) cur = [f - 1, f]; else cur[1] = f; } else if (cur) { o.push(cur); cur = null; }
    }
    if (cur) o.push(cur);
    return o.map((r) => [r[0], r[1], (r[1] - r[0] + 1) / FPS]).sort((a, b) => b[2] - a[2]);
  };
  const cual = (f) => plan.tarjetas.find((c) => c.a - 1e-6 <= f / FPS && f / FPS < c.b)?.id ?? '—';
  const dd = d.slice(1);
  say(`cuadros: ${N}  (diferencia de luma entre cuadros: mínima ${Math.min(...dd).toFixed(4)}, mediana ${[...dd].sort((a, b) => a - b)[dd.length >> 1].toFixed(3)}, máxima ${Math.max(...dd).toFixed(2)}; quieto = < ${TAU})`);
  const crudo = tramos(false), muerto = tramos(true);
  say(`\nSIN descontar la lectura de tarjetas: ${crudo.length} tramos quietos; los mayores:`);
  for (const [a, b, s] of crudo.slice(0, 6)) say(`  ${(a / FPS).toFixed(3)}–${((b + 1) / FPS).toFixed(3)} s (${b - a + 1} cuadros iguales = ${s.toFixed(3)} s) en ${cual(a)}`);
  say(`\nDESCONTANDO la lectura de tarjetas: ${muerto.length} tramos; los mayores:`);
  for (const [a, b, s] of muerto.slice(0, 6)) say(`  ${(a / FPS).toFixed(3)}–${((b + 1) / FPS).toFixed(3)} s (${b - a + 1} cuadros iguales = ${s.toFixed(3)} s) en ${cual(a)}`);
  const mx = muerto[0]?.[2] ?? 0;
  say(`\nMAYOR TRAMO QUIETO en los píxeles, fuera de una lectura: ${mx.toFixed(3)} s (límite ${MAXQ} s)`);
  say(`MAYOR TRAMO QUIETO en los píxeles, contando las lecturas: ${(crudo[0]?.[2] ?? 0).toFixed(3)} s`);
  for (const m of plan.medios) if (m.tipo === 'foto') {
    const a = Math.floor((m.a + 0.5) * FPS), b = Math.floor((m.b - 0.5) * FPS), seg = d.slice(a, b);
    say(`  ${m.id.padEnd(9)} empuje lento: diferencia media ${(seg.reduce((s, v) => s + v, 0) / seg.length).toFixed(3)} (mín ${Math.min(...seg).toFixed(3)}) entre cuadros, de ${(a / FPS).toFixed(2)} a ${(b / FPS).toFixed(2)} s`);
  }
  if (mx > MAXQ + 1e-9) codigo = 1;
} else if (modo === 'psnr') {
  const caras = JSON.parse(fs.readFileSync(path.join(P, 'qa/caras-fotos.json'), 'utf8')).fotos;
  const PUSH = plan.empuje.cuadros / FPS, ZOOM = plan.zoom.fin, W = 1080, H = 1920, BAND = 700, PAD = 70;
  const CON_CAJA = new Set(['f-gancho', ...plan.ejemplos.map((e) => e.medio)]);
  const base = (k) => raw(['-i', path.join(P, plan.fotos[k].src), '-vf', `scale=${W}:${H}:force_original_aspect_ratio=increase:flags=area,crop=${W}:${H},format=rgb24`, '-frames:v', '1']);
  // warpAffine bilineal con borde replicado (el mismo cambio de escala que el empuje lento: origen en el centro de la cara), solo la franja 0..BAND
  const conZoom = (im, s, ox, oy, [rx1, ry1, rx2, ry2] = [0, 0, W, BAND]) => {
    const rw = rx2 - rx1, o = new Float32Array(rw * (ry2 - ry1) * 3);
    for (let y = ry1; y < ry2; y++) {
      const sy = Math.min(H - 1, Math.max(0, oy + (y - oy) / s)), y0 = Math.floor(sy), y1 = Math.min(H - 1, y0 + 1), fy = sy - y0;
      for (let x = rx1; x < rx2; x++) {
        const sx = Math.min(W - 1, Math.max(0, ox + (x - ox) / s)), x0 = Math.floor(sx), x1 = Math.min(W - 1, x0 + 1), fx = sx - x0;
        for (let c = 0; c < 3; c++) {
          const a = im[(y0 * W + x0) * 3 + c] * (1 - fx) + im[(y0 * W + x1) * 3 + c] * fx, b = im[(y1 * W + x0) * 3 + c] * (1 - fx) + im[(y1 * W + x1) * 3 + c] * fx;
          o[((y - ry1) * rw + (x - rx1)) * 3 + c] = a * (1 - fy) + b * fy;
        }
      }
    }
    return o;
  };
  const tapar = (a, r) => { if (!r) return a; for (let y = Math.max(0, r[1]); y < Math.min(BAND, r[3]); y++) for (let x = Math.max(0, r[0]); x < Math.min(W, r[2]); x++) for (let c = 0; c < 3; c++) a[(y * W + x) * 3 + c] = 0; return a; };
  const psnr = (a, b) => { let m = 0; for (let i = 0; i < a.length; i++) m += (a[i] - b[i]) ** 2; m /= a.length; return m === 0 ? 99 : 10 * Math.log10(255 * 255 / m); };
  const casos = [];
  for (const m of plan.medios) if (m.tipo === 'foto') {
    const ts = m.a === 0 ? [1.0, 2.0, 2.8] : [m.a + PUSH + 0.6, (m.a + m.b) / 2, m.b - PUSH - 0.6];
    for (const t of ts) casos.push([m, Math.round(t * FPS)]);
  }
  const orden = [...casos].sort((a, b) => a[1] - b[1]);
  const sel = orden.map(([, n]) => `eq(n\\,${n})`).join('+');
  const fb = raw(['-i', video, '-vf', `select=${sel},format=rgb24`, '-vsync', '0']);        // cuadros completos (la cara del cierre está abajo, fuera de la franja)
  const tam = W * H * 3;
  const cands = Object.fromEntries(Object.keys(plan.fotos).map((k) => [k, base(k)]));
  const centro = (k) => { const [x1, y1, x2, y2] = caras[k].caja; return [(x1 + x2) / 2, (y1 + y2) / 2]; };
  say('PSNR del final contra la fuente (franja y 0-700). Pico esperado: la foto del plan, con el zoom del plan.');
  say(`${'escena'.padEnd(10)} ${'t_final'.padStart(8)} ${'zoom'.padStart(6)}   ` + Object.keys(plan.fotos).map((k) => k.padStart(7)).join(' ') + '   mejor     zoom pico   ok');
  let malos = 0, caraMin = 99;
  orden.forEach(([m, n], i) => {
    const t = n / FPS, s = 1 + (ZOOM - 1) * Math.min(1, Math.max(0, (t - m.a) / (m.b - m.a)));
    const [ox, oy] = centro(m.foto), [x1, y1, x2, y2] = caras[m.foto].caja;
    const rect = CON_CAJA.has(m.id) ? [ox + (x1 - PAD - ox) * s, oy + (y1 - PAD - oy) * s, ox + (x2 + PAD - ox) * s, oy + (y2 + PAD - oy) * s].map(Math.trunc) : null;
    const cuadro = fb.subarray(i * tam, (i + 1) * tam);
    const f = Float32Array.from(cuadro.subarray(0, W * BAND * 3)); tapar(f, rect);
    const res = {};
    for (const [k, im] of Object.entries(cands)) { const [cx, cy] = centro(k); res[k] = psnr(f, tapar(conZoom(im, s, cx, cy), rect)); }
    const mejor = Object.keys(res).reduce((a, b) => (res[a] >= res[b] ? a : b));
    const zs = {};
    for (const dz of [-0.02, -0.01, 0, 0.01, 0.02]) zs[dz] = psnr(f, tapar(conZoom(cands[m.foto], s + dz, ox, oy), rect));
    const zpico = +Object.keys(zs).reduce((a, b) => (zs[a] >= zs[b] ? a : b));
    const ok = mejor === m.foto && Math.abs(zpico) < 1e-9;
    if (!ok) malos++;
    // fidelidad de la CARA: PSNR del final contra la foto fuente con el mismo zoom, SOLO dentro de la caja SCRFD de la cara (sin el marco de la caja de cara, que va 16 px más afuera)
    const fx1 = Math.ceil(ox + (x1 - ox) * s), fy1 = Math.ceil(oy + (y1 - oy) * s), fx2 = Math.floor(ox + (x2 - ox) * s), fy2 = Math.floor(oy + (y2 - oy) * s);
    const fin = new Float32Array((fx2 - fx1) * (fy2 - fy1) * 3);
    for (let y = fy1; y < fy2; y++) for (let x = fx1; x < fx2; x++) for (let c = 0; c < 3; c++) fin[((y - fy1) * (fx2 - fx1) + (x - fx1)) * 3 + c] = cuadro[(y * W + x) * 3 + c];
    const pc = psnr(fin, conZoom(cands[m.foto], s, ox, oy, [fx1, fy1, fx2, fy2]));
    caraMin = Math.min(caraMin, pc);
    say(`${m.id.padEnd(10)} ${t.toFixed(3).padStart(8)} ${s.toFixed(3).padStart(6)}   ` + Object.values(res).map((v) => v.toFixed(1).padStart(7)).join(' ') + `   ${mejor.padEnd(8)} ${(zpico >= 0 ? '+' : '') + zpico.toFixed(2)}      ${ok ? 'ok' : '✖'}   cara ${(fx2 - fx1)}x${(fy2 - fy1)} px: ${pc.toFixed(1)} dB`);
  });
  say(`PSNR mínimo dentro de la caja de la cara (final contra fuente, mismo zoom): ${caraMin.toFixed(1)} dB (9 cuadros). Es una medida de PÍXELES, no del puntaje de ArcFace del face-gate.`);
  say(malos ? `✖ ${malos} caso(s) con la foto cruzada o el zoom corrido` : '✔ cada escena muestra la foto del plan, con el empuje lento del plan');
  if (malos) codigo = 1;
} else { console.error('uso: node scripts/pixeles.mjs vacios|aire|psnr video.mp4'); process.exit(2); }
console.log(out.join('\n'));
process.exit(codigo);
