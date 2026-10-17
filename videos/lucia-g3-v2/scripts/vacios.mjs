#!/usr/bin/env node
// Sustituto de vacios.py (esta nube no tiene numpy/cv2): cuadros PLANOS (desviación estándar de luma < 6) y mayores saltos de luma entre cuadros consecutivos
// de un render, con ffmpeg → gris 180x320 → JS. Imprime también la luma/desviación de los cuadros de cada costura (empuje de 6 cuadros).
// Uso: node scripts/vacios.mjs video.mp4 > qa/vacios-y-saltos.txt
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan-resuelto.json'), 'utf8'));
const FPS = 24, Wd = 180, Ht = 320, SZ = Wd * Ht;
const pr = spawnSync('ffmpeg', ['-v', 'error', '-i', process.argv[2], '-vf', `scale=${Wd}:${Ht}:flags=area,format=gray`, '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], { maxBuffer: 1 << 30 });
if (pr.status !== 0) { console.error(String(pr.stderr)); process.exit(2); }
const buf = pr.stdout, N = Math.floor(buf.length / SZ), L = [], S = [];
for (let i = 0; i < N; i++) { let s = 0, s2 = 0; for (let j = 0; j < SZ; j++) { const v = buf[i * SZ + j]; s += v; s2 += v * v; } const m = s / SZ; L.push(m); S.push(Math.sqrt(Math.max(0, s2 / SZ - m * m))); }
console.log('cuadros', N);
const vac = []; for (let i = 0; i < N; i++) if (S[i] < 6) vac.push(i);
console.log('cuadros PLANOS (std<6):', JSON.stringify(vac));
console.log(`luma min/max: ${Math.min(...L).toFixed(1)} / ${Math.max(...L).toFixed(1)}`);
const d = []; for (let i = 0; i < N - 1; i++) d.push({ i, v: Math.abs(L[i + 1] - L[i]) });
console.log('mayores saltos de luma entre cuadros consecutivos (cuadro i -> i+1, t, luma_i, luma_i+1):');
for (const x of d.sort((a, b) => b.v - a.v).slice(0, 12).sort((a, b) => a.i - b.i)) console.log(`  ${x.i}->${x.i + 1}  t=${((x.i + 1) / FPS).toFixed(3)}  ${L[x.i].toFixed(1)} -> ${L[x.i + 1].toFixed(1)}  (Δ=${x.v.toFixed(1)})`);
for (const c of plan.costuras) { const f0 = c.t_f - 6 - 2, f1 = c.t_f + 2; console.log(`empuje ${c.t.toFixed(3)} s (cuadros ${c.t_f - 6}-${c.t_f})`, Array.from({ length: f1 - f0 }, (_, k) => f0 + k).filter((i) => i < N).map((i) => `${i}:${L[i].toFixed(0)}/${S[i].toFixed(0)}`).join(' ')); }
