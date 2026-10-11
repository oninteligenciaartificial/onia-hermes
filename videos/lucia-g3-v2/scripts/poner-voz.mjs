#!/usr/bin/env node
// VOZ de G3 v2 (adaptado de videos/lucia-g5-v2/scripts/poner-voz.mjs). NO genera voz: solo MIDE y MEZCLA pistas que ya existan (una por línea de guion-voz.txt, voz Marcela), nombradas t01 … t12 (wav|mp3|m4a|aac|flac).
// Revisión 1 (11-oct-2026, H1). Dos usos, en este orden:
//   1) node scripts/poner-voz.mjs --medir DIR_DE_LAS_PISTAS
//        mide la voz ÚTIL de cada pista (sin el silencio de cabeza ni de cola, umbral −45 dB), la compara con su tramo y escribe duraciones.json (voz.mjs lo lee y
//        manda sobre la estimación de 17 caracteres por segundo). Después: node scripts/build.mjs (cada ventana se ajusta a su pista; media_inicio de K4/K1 automático), node scripts/voz-tabla.mjs,
//        todos los controles del README, render (flock /tmp/hf-render.lock) y el mux de audio en silencio; recién entonces el paso 2.
//   2) node scripts/poner-voz.mjs DIR_DE_LAS_PISTAS [out/g3-v2-con-voz.mp4]
//        pone cada pista en el segundo de su tramo (qa/voz-tramos.json, lo escribe scripts/voz-tabla.mjs) sin acelerar (se aprietan pausas, no la voz), mezcla a −14 LUFS con loudnorm en DOS pasadas y copia
//        el video sin recodificar. AVISA de: pistas que se pasan de su tramo (pisan a la siguiente), pistas cortas (hueco > 0,3 s entre el fin de la pista y la siguiente) y solapes.
//        Al terminar MIDE la mezcla (lo que decide la regla 15, no la estimación): huecos de ≥ 0,3 s con silencedetect (−35 dB, 0,3 s) contados por cada 10 s (máx. 1 por 10 s;
//        la cola del CTA cuenta) y LUFS integrado con ebur128 (objetivo −14, ±1 LU) más pico verdadero (≤ −1 dBTP). Sale con 1 si algo de eso incumple.
// Sin cama de música (con voz, sin cama: edicion-referentes). El hueco ≤ 0,3 s es entre pistas; la pausa DENTRO de una línea (L3 y L9 llevan coma) la decide el TTS: también la mide silencedetect.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const medir = args[0] === '--medir';
const dir = path.resolve((medir ? args[1] : args[0]) || '.');
const out = path.resolve((!medir && args[1]) || path.join(P, 'out/g3-v2-con-voz.mp4'));
const tramos = JSON.parse(fs.readFileSync(path.join(P, 'qa/voz-tramos.json'), 'utf8'));
const video = path.join(P, 'out/g3-v2-final-1080x1920.mp4');
const HUECO_MAX = 0.3, TOL = 1 / 24;                  // tolerancia: un cuadro (0,042 s) de cola o solape no se oye
const dur = (f) => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim();
// recorte de silencio de cabeza y de cola (la cola se recorta dando vuelta el audio: silenceremove con stop_periods cortaría en la primera pausa interna)
const RECORTE = 'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,areverse';
const pista = (n) => {
  const nn = String(n).padStart(2, '0');
  return ['wav', 'mp3', 'm4a', 'aac', 'flac'].map((e) => path.join(dir, `t${nn}.${e}`)).find((x) => fs.existsSync(x));
};
const durUtil = (f) => {
  const tmp = path.join(os.tmpdir(), `voz-${process.pid}-${path.basename(f)}.wav`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', f, '-af', RECORTE, tmp]);
  const d = dur(tmp); fs.rmSync(tmp, { force: true });
  return d;
};
const correr = (a) => spawnSync('ffmpeg', a, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

// ───────────── medir las pistas y comparar con los tramos ─────────────
const filas = [];
let falta = 0;
for (const t of tramos) {
  const f = pista(t.n);
  if (!f) { console.error(`✖ falta t${String(t.n).padStart(2, '0')} (línea ${t.n}: «${t.linea}»)`); falta++; continue; }
  filas.push({ t, f, d: durUtil(f) });
}
if (falta) process.exit(1);
let overflow = 0, cortas = 0, solapes = 0;
console.log('pista  voz útil  tramo   sobra   avisos');
filas.forEach(({ t, d }, i) => {
  const sig = filas[i + 1]?.t, fin = t.a + d, sobra = t.b - fin, av = [];
  if (d > t.dura + TOL) { overflow++; av.push(`⚠ se pasa del tramo por ${(d - t.dura).toFixed(2)} s: recortar silencios de la pista o acortar la línea (NO acelerar)`); }
  if (sig && fin > sig.a + TOL) { solapes++; av.push(`⚠ SOLAPE: termina a ${fin.toFixed(2)} s y la pista ${sig.n} empieza a ${sig.a.toFixed(2)} s (voz sobre voz)`); }
  if (sig && sobra > HUECO_MAX + 1e-3) { cortas++; av.push(`⚠ pista corta: hueco de ${sobra.toFixed(2)} s antes de la pista ${sig.n} (> ${HUECO_MAX} s)`); }
  console.log(`  t${String(t.n).padStart(2, '0')}  ${d.toFixed(2).padStart(7)}  ${t.dura.toFixed(2).padStart(6)}  ${sobra.toFixed(2).padStart(6)}   ${av.join(' · ') || (t.ultimo ? `ok (CTA: cola de ${sobra.toFixed(2)} s sin voz, se lee)` : 'ok')}`);
});
if (medir) {
  const j = Object.fromEntries(filas.map(({ t, d }) => [`t${String(t.n).padStart(2, '0')}`, +d.toFixed(3)]));
  fs.writeFileSync(path.join(P, 'duraciones.json'), JSON.stringify(j, null, 1) + '\n');
  console.log(`✔ duraciones.json escrito (${filas.length} pistas). Siguiente: node scripts/build.mjs && node scripts/voz-tabla.mjs, controles del README, render y mux en silencio; recién después la mezcla.`);
  process.exit(0);
}

// ───────────── mezcla: cada pista en su tramo, −14 LUFS en dos pasadas ─────────────
const total = dur(video);
const filtros = filas.map(({ t }, i) => `[${i + 1}:a]${RECORTE},aresample=48000,aformat=channel_layouts=stereo,adelay=${Math.round(t.a * 1000)}|${Math.round(t.a * 1000)}[v${i + 1}]`);
const base = filas.map((_, i) => `[v${i + 1}]`).join('') + `amix=inputs=${filas.length}:normalize=0:duration=longest,apad,atrim=0:${total.toFixed(3)}`;
const entradas = filas.flatMap(({ f }) => ['-i', f]);
const LN = 'I=-14:TP=-1.5:LRA=11';
const p1 = correr(['-v', 'info', '-i', video, ...entradas, '-filter_complex', [...filtros, `${base},loudnorm=${LN}:print_format=json[a]`].join(';'), '-map', '[a]', '-f', 'null', '-']);
const m = /\{[^{}]*"input_i"[^{}]*\}/s.exec(p1.stderr || '');
if (!m) { console.error('✖ loudnorm no devolvió su medición:\n' + (p1.stderr || '').slice(-600)); process.exit(1); }
const L = JSON.parse(m[0]);
const ln2 = `loudnorm=${LN}:measured_I=${L.input_i}:measured_TP=${L.input_tp}:measured_LRA=${L.input_lra}:measured_thresh=${L.input_thresh}:offset=${L.target_offset}:linear=true,aresample=48000`;
const r = correr(['-v', 'error', '-y', '-i', video, ...entradas, '-filter_complex', [...filtros, `${base},${ln2}[a]`].join(';'), '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', '-movflags', '+faststart', out]);
if (r.status !== 0) { console.error('✖ ffmpeg falló:\n' + (r.stderr || '').slice(-800)); process.exit(1); }
console.log(`✔ ${out}  (loudnorm de dos pasadas: entrada ${L.input_i} LUFS → objetivo −14)`);

// ───────────── medir la mezcla: huecos y LUFS ─────────────
let mal = overflow + solapes;
const s = correr(['-v', 'info', '-i', out, '-vn', '-af', 'silencedetect=n=-35dB:d=0.3', '-f', 'null', '-']).stderr || '';
const huecos = [...s.matchAll(/silence_start: ([\d.]+)[\s\S]*?silence_end: ([\d.]+) \| silence_duration: ([\d.]+)/g)].map((x) => ({ a: +x[1], b: +x[2], d: +x[3] }));
const finSil = /silence_start: ([\d.]+)(?![\s\S]*silence_end)/.exec(s);           // un silencio que llega hasta el final del audio no trae silence_end
if (finSil) huecos.push({ a: +finSil[1], b: total, d: total - +finSil[1] });
const porVentana = new Map();
for (const h of huecos) { const w = Math.floor(h.a / 10); porVentana.set(w, (porVentana.get(w) || 0) + 1); }
console.log(`huecos de ≥ 0,3 s a −35 dB en la mezcla (silencedetect): ${huecos.length}`);
for (const h of huecos) console.log(`  ${h.a.toFixed(2)} → ${h.b.toFixed(2)} s (${h.d.toFixed(2)} s)`);
for (let w = 0; w * 10 < total; w++) { const n = porVentana.get(w) || 0; console.log(`  ${w * 10}-${Math.min(total, w * 10 + 10).toFixed(0)} s: ${n} hueco(s) ${n > 1 ? '✖ (> 1 por 10 s)' : 'ok'}`); if (n > 1) mal++; }
const e = correr(['-v', 'info', '-i', out, '-vn', '-af', 'ebur128=peak=true', '-f', 'null', '-']).stderr || '';
const res = e.slice(e.lastIndexOf('Summary:'));
const I = /\bI:\s+(-?[\d.]+) LUFS/.exec(res), TP = /Peak:\s+(-?[\d.]+) dBFS/.exec(res), LRA = /LRA:\s+([\d.]+) LU/.exec(res);
if (!I) { console.error('✖ ebur128 no devolvió el resumen'); process.exit(1); }
const okI = Math.abs(+I[1] + 14) <= 1.0, okTP = !TP || +TP[1] <= -1.0;
console.log(`ebur128: integrado ${I[1]} LUFS (objetivo −14 ±1) ${okI ? 'ok' : '✖'} · pico verdadero ${TP ? TP[1] : '?'} dBTP (≤ −1) ${okTP ? 'ok' : '✖'} · LRA ${LRA ? LRA[1] : '?'} LU`);
if (!okI || !okTP) mal++;
console.log(mal ? `✖ ${mal} incumplimiento(s): ${overflow} pista(s) pasadas, ${solapes} solape(s), ${cortas} pista(s) corta(s) (aviso)` : `✔ voz dentro de sus tramos, huecos y volumen en regla${cortas ? ` (${cortas} pista(s) corta(s): aviso)` : ''}`);
process.exit(mal ? 1 : 0);
