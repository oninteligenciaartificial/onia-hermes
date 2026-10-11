#!/usr/bin/env node
// PSNR/SSIM de la CARA del final contra la fuente (sustituye a face-gate.sh en esta nube, que necesita numpy + onnxruntime + insightface; instalarlos pide aprobación).
// 1) Que el clip caiga en el cuadro prometido: para un cuadro del final se mide contra los cuadros n-1…n+1 de la fuente; el PICO tiene que ser el n del plan.
// 2) Que el escalado (×1,5 de 720x1280 a 1080x1920) y el H.264 no deformen la cara: PSNR y SSIM del recorte de la cara contra la fuente llevada al mismo tamaño.
// Los recortes evitan tarjetas y contador (la cara de K4 está abajo; la de K1 arriba del cuadro). Uso: node scripts/psnr-clips.mjs final.mp4
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan-resuelto.json'), 'utf8'));
const V = process.argv[2];
const k4 = plan.escenas.k4, k1 = plan.escenas.k1;
// recorte de la cara en coordenadas 1080x1920 (dimensiones pares): K4 cara abajo (y 1000-1420), K1 cara arriba (y 420-700)
const CROP = { k4: '500:420:300:1000', k1: '320:280:380:420' };
const run = (fvf, src, n, crop, ssim) => {
  const fg = `[0:v]select=eq(n\\,${fvf}),setpts=N/24/TB,crop=${crop},format=yuv420p[a];[1:v]select=eq(n\\,${n}),setpts=N/24/TB,scale=1080:1920:flags=lanczos,crop=${crop},format=yuv420p[b]`;
  const out = {};
  for (const m of (ssim ? ['psnr', 'ssim'] : ['psnr'])) {
    const r = spawnSync('ffmpeg', ['-v', 'info', '-i', V, '-i', src, '-filter_complex', `${fg};[a][b]${m}`, '-frames:v', '1', '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 1 << 28 });
    const mm = m === 'psnr' ? /average:([0-9.inf]+)/.exec(r.stderr) : /All:([0-9.]+)/.exec(r.stderr);
    out[m] = mm ? (mm[1] === 'inf' ? 99 : +mm[1]) : NaN;
  }
  return out;
};
const pruebas = [
  ['K4', 'k4', 'assets/k4.mp4', k4.a_f, k4.media_inicio, [20, 72, 104, 120, 125]],
  ['K1', 'k1', 'assets/k1.mp4', k1.a_f, k1.media_inicio, [30, 100, 130]],
];
let fallos = 0;
console.log('PSNR/SSIM de la cara (final vs fuente llevada a 1080x1920), cuadro del final F ↔ cuadro n de la fuente; vecinos n±1 para ver el pico');
for (const [nom, key, src, f0, k0, ns] of pruebas) {
  const nF = plan.escenas[key].b_f - plan.escenas[key].a_f;           // cuadros del clip que se ven: de k0 a k0 + nF − 1 (media_inicio puede ser automático)
  for (const n of ns.filter((x) => x >= k0 + 1 && x <= k0 + nF - 2)) {
    const F = f0 + (n - k0);
    const fila = [];
    for (const dn of [-1, 0, 1]) { const m = run(F, path.join(P, src), n + dn, CROP[key], dn === 0); fila.push({ dn, ...m }); }
    const pico = fila.reduce((a, b) => (b.psnr > a.psnr ? b : a));
    const c = fila.find((x) => x.dn === 0);
    const ok = pico.dn === 0 && c.psnr >= 30 && c.ssim >= 0.9;
    if (!ok) fallos++;
    console.log(`  ${ok ? 'ok ' : '✖  '} ${nom} cuadro ${String(n).padStart(3)} ↔ final F=${F} (${(F / 24).toFixed(3)} s): n=${c.psnr.toFixed(1)} dB SSIM ${c.ssim.toFixed(4)} | vecinos ${fila.filter((x) => x.dn !== 0).map((x) => `${x.dn > 0 ? '+' : ''}${x.dn}:${x.psnr.toFixed(1)}`).join(' ')} | pico en n${pico.dn === 0 ? '' : (pico.dn > 0 ? '+' : '') + pico.dn}`);
  }
}
if (fallos) { console.error(`✖ ${fallos} cuadro(s) sin pico en el cuadro prometido o con cara degradada (PSNR < 30 dB o SSIM < 0,9)`); process.exit(1); }
console.log('✔ cada cuadro medido cae en el cuadro prometido del clip y la cara conserva PSNR ≥ 30 dB y SSIM ≥ 0,9 contra la fuente');
