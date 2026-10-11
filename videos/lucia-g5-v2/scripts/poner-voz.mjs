#!/usr/bin/env node
// Pone la VOZ que se genere después (una pista por línea de guion-voz.txt) sobre el video mudo, cada una en el segundo de su tramo (qa/tramos-voz.json).
// NO genera voz: solo mezcla archivos que ya existan. Cada pista se llama tNN.(wav|mp3|m4a|aac|flac), NN = número de línea con dos cifras (t01 … t10).
// Avisa si una pista dura más que su tramo (voz + hueco): se recorta el aire de la pista, NO se acelera la voz (regla de edicion-referentes).
// Salida: video con la pista de voz a −14 LUFS (sin cama de música: con voz, sin cama), el video se copia sin recodificar.
// Uso:  node scripts/poner-voz.mjs DIR_DE_LAS_PISTAS [out/g5-v2-con-voz.mp4]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.resolve(process.argv[2] || '.');
const out = path.resolve(process.argv[3] || path.join(P, 'out/g5-v2-con-voz.mp4'));
const tramos = JSON.parse(fs.readFileSync(path.join(P, 'qa/tramos-voz.json'), 'utf8'));
const video = path.join(P, 'out/g5-v2-final-1080x1920.mp4');
const dur = (f) => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim();
const total = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', video]).toString().trim();
const entradas = [], filtros = [];
let falta = 0, largas = 0;
for (const t of tramos) {
  const nn = String(t.n).padStart(2, '0');
  const f = ['wav', 'mp3', 'm4a', 'aac', 'flac'].map((e) => path.join(dir, `t${nn}.${e}`)).find((x) => fs.existsSync(x));
  if (!f) { console.error(`✖ falta t${nn} (línea ${t.n}: «${t.linea}»)`); falta++; continue; }
  const d = dur(f), cabe = t.dura;                    // la pista tiene que terminar antes de que empiece el tramo siguiente
  if (d > cabe + 1e-3) { console.warn(`⚠ t${nn} dura ${d.toFixed(2)} s y el tramo ${cabe.toFixed(2)} s: recortar silencios de la pista (no acelerar)`); largas++; }
  else console.log(`ok t${nn}  ${d.toFixed(2)} s en ${t.a.toFixed(3)} s (tramo ${cabe.toFixed(2)} s; la voz prevista era ${t.voz_s.toFixed(2)} s)`);
  entradas.push(f); filtros.push(`[${entradas.length}:a]aresample=48000,aformat=channel_layouts=stereo,adelay=${Math.round(t.a * 1000)}|${Math.round(t.a * 1000)}[v${entradas.length}]`);
}
if (falta) process.exit(1);
const mezcla = entradas.map((_, i) => `[v${i + 1}]`).join('') + `amix=inputs=${entradas.length}:normalize=0:duration=longest,apad,atrim=0:${total.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11[a]`;
const args = ['-v', 'error', '-y', '-i', video, ...entradas.flatMap((f) => ['-i', f]), '-filter_complex', [...filtros, mezcla].join(';'), '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', '-movflags', '+faststart', out];
execFileSync('ffmpeg', args, { stdio: 'inherit' });
console.log(`✔ ${out}${largas ? `  (${largas} pista(s) más largas que su tramo)` : ''}`);
