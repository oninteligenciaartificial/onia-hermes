#!/usr/bin/env node
// Cuadros PLANOS (vacíos) y saltos de luma entre cuadros consecutivos (destellos) de un render, sin Python: ffmpeg entrega los cuadros en gris (180x320) y Node mide.
// Imprime la luma/desviación de los cuadros de cada costura (de T−6 a T+3 cuadros). Uso: node scripts/vacios.mjs out/g4-v2-final-1080x1920.mp4 > qa/vacios-y-saltos.txt
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
const v = process.argv[2];
const W = 180, H = 320;
const r = spawnSync('ffmpeg', ['-v', 'error', '-i', v, '-vf', `scale=${W}:${H}:flags=area,format=gray`, '-f', 'rawvideo', '-'], { maxBuffer: 1 << 30 });
if (r.status !== 0) { console.error(String(r.stderr)); process.exit(2); }
const buf = r.stdout, FS = W * H, n = Math.floor(buf.length / FS);
const L = new Float64Array(n), S = new Float64Array(n);
for (let i = 0; i < n; i++) {
  let s = 0, s2 = 0; const o = i * FS;
  for (let k = 0; k < FS; k++) { const x = buf[o + k]; s += x; s2 += x * x; }
  const m = s / FS; L[i] = m; S[i] = Math.sqrt(Math.max(0, s2 / FS - m * m));
}
console.log('cuadros', n);
const vac = []; for (let i = 0; i < n; i++) if (S[i] < 6) vac.push(i);
console.log('cuadros PLANOS (std<6):', JSON.stringify(vac));
console.log(`luma min/max: ${Math.min(...L).toFixed(1)} / ${Math.max(...L).toFixed(1)}`);
const d = []; for (let i = 0; i < n - 1; i++) d.push(Math.abs(L[i + 1] - L[i]));
const top = d.map((x, i) => [x, i]).sort((a, b) => b[0] - a[0]).slice(0, 12).map((x) => x[1]).sort((a, b) => a - b);
console.log('mayores saltos de luma entre cuadros consecutivos (cuadro i -> i+1, t, luma_i, luma_i+1):');
for (const i of top) console.log(`  ${i}->${i + 1}  t=${((i + 1) / 24).toFixed(3)}  ${L[i].toFixed(1)} -> ${L[i + 1].toFixed(1)}  (Δ=${d[i].toFixed(1)})`);
const enEmpuje = new Set();
for (const c of plan.costuras) { const T = Math.round(c.t * 24); for (let k = T - 7; k <= T + 1; k++) enEmpuje.add(k); }
let mx = [0, 0]; for (let i = 0; i < d.length; i++) if (!enEmpuje.has(i) && d[i] > mx[0]) mx = [d[i], i];
console.log(`mayor salto de luma FUERA de los empujes: Δ=${mx[0].toFixed(1)} en ${mx[1]}->${mx[1] + 1} (t=${((mx[1] + 1) / 24).toFixed(3)})`);
for (const c of plan.costuras) {
  const T = Math.round(c.t * 24), f0 = T - 6, f1 = T + 4;
  const sal = []; for (let i = f0; i < f1 && i < n; i++) sal.push(`${i}:${L[i].toFixed(0)}/${S[i].toFixed(0)}`);
  console.log(c.t.toFixed(3), sal.join(' '));
}
const malo = vac.length > 0;
console.log(malo ? '✖ hay cuadros planos' : '✔ ningún cuadro plano');
process.exit(malo ? 1 : 0);
