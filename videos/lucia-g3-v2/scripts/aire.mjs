#!/usr/bin/env node
// Aire muerto medido en los PÍXELES de un video renderizado (regla 15: ningún tramo de más de 0,3 s con la pantalla idéntica y sin una tarjeta en lectura).
// Pasa el video a 270x480 en gris (ffmpeg, rawvideo) y compara cada cuadro con el anterior. Un cuadro es «quieto» si cambian < 0,02 % de los píxeles en más de
// 3 niveles de luma Y la diferencia media es < 0,05 niveles (el ruido de H.264 en una imagen fija queda muy por debajo); «idéntico» si la diferencia es 0.
// «Excusado» = dentro del tiempo de lectura de una tarjeta (0,35 s por palabra + 0,3 desde que entra en reposo). Se informa el mayor tramo quieto TOTAL y el
// mayor tramo quieto NO excusado (el que cuenta para la regla).
// Uso: node scripts/aire.mjs video.mp4 [plan.json|plan-resuelto.json]   (sale con 1 si el tramo no excusado pasa de 0,3 s)
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const video = process.argv[2];
const planF = process.argv[3] || path.join(P, 'plan-resuelto.json');
if (!video) { console.error('uso: node scripts/aire.mjs video.mp4 [plan]'); process.exit(2); }
const plan = JSON.parse(fs.readFileSync(planF, 'utf8'));
const FPS = 24, Wd = 270, Ht = 480, SZ = Wd * Ht;
const pr = spawnSync('ffmpeg', ['-v', 'error', '-i', video, '-vf', `scale=${Wd}:${Ht}:flags=area,format=gray`, '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], { maxBuffer: 1 << 30 });
if (pr.status !== 0) { console.error(String(pr.stderr)); process.exit(2); }
const buf = pr.stdout, N = Math.floor(buf.length / SZ);
const pal = (c) => `${c.num ? c.num + ' ' : ''}${c.texto} ${c.acento || ''}`.trim().split(/\s+/).filter((s) => s && s !== '·').length;
const ventanas = (plan.tarjetas || []).map((c) => ({ a: c.a, b: c.a + (c.min_s ?? 0.35 * pal(c) + 0.3) }));
const excusado = (f) => { const t = f / FPS; return ventanas.some((w) => t >= w.a - 1e-6 && t < w.b - 1e-6); };
const quieto = new Array(N).fill(false), ident = new Array(N).fill(false), pct = new Array(N).fill(0), media = new Array(N).fill(0);
for (let i = 1; i < N; i++) {
  let ch = 0, sum = 0; const o = i * SZ, q = (i - 1) * SZ;
  for (let j = 0; j < SZ; j++) { const d = Math.abs(buf[o + j] - buf[q + j]); sum += d; if (d > 3) ch++; }
  pct[i] = (100 * ch) / SZ; media[i] = sum / SZ;
  ident[i] = sum === 0; quieto[i] = pct[i] < 0.02 && media[i] < 0.05;
}
const tramos = (pred) => { const out = []; let ini = -1; for (let f = 0; f <= N; f++) { const q = f < N && pred(f); if (q && ini < 0) ini = f; if (!q && ini >= 0) { out.push({ a: ini, b: f, d: (f - ini) / FPS }); ini = -1; } } return out.sort((x, y) => y.d - x.d); };
const tTot = tramos((f) => quieto[f]), tNoEx = tramos((f) => quieto[f] && !excusado(f)), tIdent = tramos((f) => ident[f]);
const fmt = (t) => t.length ? t.slice(0, 4).map((x) => `${(x.a / FPS).toFixed(2)}→${(x.b / FPS).toFixed(2)} s (${x.d.toFixed(3)} s)`).join(', ') : 'ninguno';
const dur = N / FPS;
const bajos = Array.from({ length: N - 1 }, (_, k) => k + 1).sort((a, b) => pct[a] - pct[b]).slice(0, 5);
const evF = path.join(P, 'qa/eventos-visuales.json');
const ev = fs.existsSync(evF) ? JSON.parse(fs.readFileSync(evF, 'utf8')) : null;
console.log(`video: ${path.basename(video)}  ${N} cuadros  ${dur.toFixed(3)} s`);
console.log(`cuadros quietos (< 0,02 % de píxeles cambiados > 3 niveles y dif. media < 0,05): ${quieto.filter(Boolean).length}; idénticos al anterior (dif. 0): ${ident.filter(Boolean).length}`);
console.log(`los 5 cuadros con MENOS cambio respecto del anterior: ${bajos.map((f) => `${f} (${(f / FPS).toFixed(2)} s: ${pct[f].toFixed(3)} % de píxeles > 3 niveles, dif. media ${media[f].toFixed(3)})`).join('; ')}`);
console.log(`mayor tramo quieto TOTAL: ${(tTot[0]?.d ?? 0).toFixed(3)} s   [${fmt(tTot)}]`);
console.log(`mayor tramo idéntico (dif. exactamente 0): ${(tIdent[0]?.d ?? 0).toFixed(3)} s   [${fmt(tIdent)}]`);
console.log(`mayor tramo quieto SIN tarjeta en lectura: ${(tNoEx[0]?.d ?? 0).toFixed(3)} s   [${fmt(tNoEx)}]`);
if (ev) console.log(`eventos visuales por 10 s: ${ev.por_10s} (${ev.eventos} en ${dur.toFixed(1)} s); hueco máximo entre eventos: ${ev.hueco_max_eventos_s.toFixed(3)} s; tramo quieto de diseño (sin empuje lento ni clips): ${ev.tramo_quieto_diseno_s} s`);
const peor = tNoEx[0]?.d ?? 0;
console.log(peor <= 0.3 + 1e-9 ? '✔ ningún tramo de más de 0,3 s con la pantalla quieta y sin una tarjeta en lectura' : `✖ hay un tramo quieto sin tarjeta en lectura de ${peor.toFixed(3)} s (> 0,3 s)`);
if (peor > 0.3 + 1e-9) process.exit(1);
