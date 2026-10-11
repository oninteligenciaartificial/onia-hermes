#!/usr/bin/env node
// PSNR de las fotos fijas del final contra la imagen fuente llevada al mismo encuadre (cover 1080x1920 + empuje lento 1,00→1,03 con origen en el centro): comprueba que
// el empuje lento no deforma ni corre la cara/el fondo (la foto en pantalla ES la del plan). Zona sin tarjetas: la franja y 1500-1900 de la descartada, la de la
// agenda (sin texto bajo y=1500) y la zona y 1480-1900 de la buena (cuerpo; las tarjetas de la buena van arriba).
// Uso: node scripts/fotos-psnr.mjs final.mp4
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan-resuelto.json'), 'utf8'));
const V = process.argv[2];
const casos = [['desc', 'assets/descartada.jpg', 'ancho', 0.5], ['buena', 'assets/buena.jpg', 'ancho', 1.0], ['agenda', 'assets/agenda.jpg', 'ancho', 1.0]];
let fallos = 0;
console.log('PSNR de las fotos del final contra la fuente con el mismo zoom (franja inferior sin tarjetas):');
for (const [id, src, , frac] of casos) {
  const e = plan.escenas[id], z = e.zoom, dur = e.b - e.a;
  for (const frac2 of [0.35, 0.7]) {
    const t = e.a + (id === 'desc' ? 0 : 0.25) + frac2 * (dur - (id === 'desc' ? 0 : 0.25));       // en reposo (fuera del empuje de entrada)
    const F = Math.round(t * 24), tt = F / 24, s = 1 + (z - 1) * ((tt - e.a) / dur);
    const crop = id === 'buena' ? '1000:360:40:1500' : '1000:360:40:1500';
    const fg = `[0:v]select=eq(n\\,${F}),setpts=N/24/TB,crop=${crop},format=yuv420p[a];[1:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,scale=iw*${s.toFixed(5)}:ih*${s.toFixed(5)}:flags=lanczos,crop=1080:1920:(iw-1080)/2:(ih-1920)/2,crop=${crop},format=yuv420p[b];[a][b]psnr`;
    const r = spawnSync('ffmpeg', ['-v', 'info', '-i', V, '-i', path.join(P, src), '-filter_complex', fg, '-frames:v', '1', '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 1 << 28 });
    const mm = /average:([0-9.]+)/.exec(r.stderr), db = mm ? +mm[1] : NaN;
    const ok = db >= 28; if (!ok) fallos++;
    console.log(`  ${ok ? 'ok ' : '✖  '} ${id.padEnd(6)} cuadro ${F} (${tt.toFixed(2)} s, zoom ${s.toFixed(4)}): ${db.toFixed(1)} dB`);
  }
}
if (fallos) { console.error(`✖ ${fallos} foto(s) por debajo de 28 dB`); process.exit(1); }
console.log('✔ las tres fotos coinciden con su fuente al zoom del plan (≥ 28 dB)');
