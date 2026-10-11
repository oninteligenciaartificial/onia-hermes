#!/usr/bin/env node
// PSNR del FINAL contra cada foto fuente (método de psnr-fotos.py de G4, hecho con ffmpeg + Node: sin numpy ni OpenCV, nada se instala).
// Para cada escena de foto de plan.json se toman 3 cuadros en reposo, se arma lo que DEBERÍA verse (foto fuente → cover a 1080x1920 → empuje lento 1,00→1,04 con el origen en
// el centro de la cara medida) y se compara contra el cuadro del final, SOLO en la franja y 0-900 (abajo van la tarjeta, el dato y el sello).
// Dos controles: (1) entre las 9 fotos candidatas, el pico tiene que ser la foto del plan; (2) con la foto correcta, el pico tiene que estar en la escala de zoom del plan
// (se prueban −0,02 … +0,02). Además mide el PSNR SOLO de la caja de la cara (no se deformó con el escalado ni el H.264). Ojo: el escalador de ffmpeg no es el de Chromium:
// el valor absoluto es menor que el de OpenCV; lo que cuenta es el pico y la brecha contra las otras fotos.
// Uso: node scripts/psnr-fotos.mjs out/g4-v2-final-1080x1920.mp4 > qa/psnr-fotos.txt
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
const caras = JSON.parse(fs.readFileSync(path.join(P, 'qa/caras-fotos.json'), 'utf8')).fotos;
const final = path.resolve(process.argv[2]);
const FPS = plan.lienzo.fps, PUSH = plan.empuje.cuadros / FPS, ZOOM = plan.zoom.fin;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'psnr-'));
const run = (args) => { const r = spawnSync('ffmpeg', ['-v', 'error', '-y', ...args], { maxBuffer: 1 << 26 }); if (r.status !== 0) throw new Error(String(r.stderr)); };
const casos = [];
for (const m of plan.medios) if (m.tipo === 'foto') {
  const ts = m.a === 0 ? [3.4, 4.0, 4.4] : [m.a + PUSH + 0.5, (m.a + m.b) / 2, m.b - PUSH - 0.3];
  for (const t of ts) casos.push({ m, n: Math.round(t * FPS) });
}
const frameDe = (n) => { const o = path.join(tmp, `final_${n}.png`); if (!fs.existsSync(o)) run(['-i', final, '-vf', `select=eq(n\\,${n})`, '-vsync', '0', '-frames:v', '1', o]); return o; };
const esperado = (foto, s, ox, oy) => {
  const o = path.join(tmp, `exp_${foto}_${s.toFixed(4)}.png`);
  if (fs.existsSync(o)) return o;
  const src = path.join(P, plan.fotos[foto].src);
  const w = Math.round(1080 * s), h = Math.round(1920 * s);
  const cx = Math.max(0, Math.min(w - 1080, Math.round(ox * (s - 1)))), cy = Math.max(0, Math.min(h - 1920, Math.round(oy * (s - 1))));
  run(['-i', src, '-vf', `scale=1080:1920:force_original_aspect_ratio=increase:flags=bicubic,crop=1080:1920,scale=${w}:${h}:flags=bicubic,crop=1080:1920:${cx}:${cy}`, '-frames:v', '1', o]);
  return o;
};
const psnr = (a, b, region) => {
  const [x, y, w, h] = region;
  const r = spawnSync('ffmpeg', ['-hide_banner', '-i', a, '-i', b, '-lavfi', `[0:v]crop=${w}:${h}:${x}:${y}[a];[1:v]crop=${w}:${h}:${x}:${y}[b];[a][b]psnr`, '-f', 'null', '-'], { maxBuffer: 1 << 26 });
  const m = String(r.stderr).match(/average:([\d.]+|inf)/); return m ? (m[1] === 'inf' ? 99 : +m[1]) : NaN;
};
const par = (v) => 2 * Math.round(v / 2);
const claves = Object.keys(plan.fotos);
console.log('PSNR del final contra la fuente (franja y 0-900). Pico esperado: la foto del plan, con el zoom del plan. Caja de cara: PSNR solo de la cara.');
console.log(`${'escena'.padEnd(10)} ${'t_final'.padStart(8)} ${'zoom'.padStart(6)}   ` + claves.map((k) => k.padStart(7)).join(' ') + '   mejor     zoom pico   caja-cara   ok');
let malos = 0, minPico = 99, maxOtra = 0, minCara = 99;
for (const { m, n } of casos.sort((a, b) => a.n - b.n)) {
  const t = n / FPS, fr = frameDe(n);
  const s = 1 + (ZOOM - 1) * Math.min(1, Math.max(0, (t - m.a) / (m.b - m.a)));
  const [x1, y1, x2, y2] = caras[m.foto].caja, ox = (x1 + x2) / 2, oy = (y1 + y2) / 2;
  const res = {};
  for (const k of claves) { const [a1, b1, a2, b2] = caras[k].caja; res[k] = psnr(fr, esperado(k, s, (a1 + a2) / 2, (b1 + b2) / 2), [0, 0, 1080, 900]); }
  const mejor = claves.reduce((a, k) => (res[k] > res[a] ? k : a), claves[0]);
  const zs = {}; for (const d of [-0.02, -0.01, 0, 0.01, 0.02]) zs[d] = psnr(fr, esperado(m.foto, s + d, ox, oy), [0, 0, 1080, 900]);
  const zpico = [-0.02, -0.01, 0, 0.01, 0.02].reduce((a, d) => (zs[d] > zs[a] ? d : a), -0.02);
  // caja de la cara en el cuadro con zoom (el origen es el centro de la cara: la caja crece alrededor de ese punto)
  const fx1 = ox + (x1 - ox) * s, fy1 = oy + (y1 - oy) * s, fx2 = ox + (x2 - ox) * s, fy2 = oy + (y2 - oy) * s;
  const reg = [par(Math.max(0, fx1)), par(Math.max(0, fy1)), par(Math.min(1080, fx2) - par(Math.max(0, fx1))), par(Math.min(1920, fy2) - par(Math.max(0, fy1)))];
  const cara = psnr(fr, esperado(m.foto, s, ox, oy), reg);
  const ok = mejor === m.foto && Math.abs(zpico) < 1e-9;
  malos += ok ? 0 : 1;
  minPico = Math.min(minPico, res[m.foto]); minCara = Math.min(minCara, cara);
  for (const k of claves) if (k !== m.foto) maxOtra = Math.max(maxOtra, res[k]);
  console.log(`${m.id.padEnd(10)} ${t.toFixed(3).padStart(8)} ${s.toFixed(3).padStart(6)}   ` + claves.map((k) => res[k].toFixed(1).padStart(7)).join(' ') + `   ${mejor.padEnd(8)} ${(zpico >= 0 ? '+' : '') + zpico.toFixed(2)}      ${cara.toFixed(1).padStart(6)} dB   ${ok ? 'ok' : '✖'}`);
}
console.log(malos ? `✖ ${malos} caso(s) con la foto cruzada o el zoom corrido` : `✔ cada escena muestra la foto del plan, con el empuje lento del plan (pico mínimo ${minPico.toFixed(1)} dB contra ${maxOtra.toFixed(1)} dB de la mejor de las otras; cara mínima ${minCara.toFixed(1)} dB)`);
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(malos ? 1 : 0);
