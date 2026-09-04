#!/usr/bin/env node
// ver-videos — fotogramas por DENSIDAD DE TEXTO, no a intervalo fijo.
//
//   node text-frames.mjs <video.mp4> --out DIR [--max 12]
//
// Por que: con muestreo a intervalo fijo (see-video.sh, 1 cuadro cada 5-45 s) por poco se
// pierde un prompt que aparecia en UN solo cuadro. Aca se escanea CUADRO POR CUADRO
// (barato: 320px, gris, edgedetect) y se extraen los picos de densidad de bordes — proxy
// de "hay texto/UI en pantalla". Los picos se sacan a 960px para leerlos con los ojos.
// ponytail: densidad de bordes como proxy de texto; si genera falsos positivos molestos,
// el upgrade es OCR barato (tesseract) sobre los candidatos.
//
// Salida: DIR/f_tSSSS.S.jpg por pico + lineas "t<TAB>score<TAB>archivo" en stdout.
// Sin picos claros imprime "0 cuadros" y sale 0 (no es un error: hay videos sin texto).

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const run = promisify(execFile);

const args = process.argv.slice(2);
const flag = (n, d) => {
  const i = args.indexOf(n);
  return i === -1 ? d : args[i + 1];
};
const video = args.find((a) => !a.startsWith('--') && a !== flag('--out') && a !== flag('--max'));
const OUT = flag('--out', process.cwd());
const MAX = Number(flag('--max', 12));
const GAP = 1.5; // s: dos picos mas juntos que esto suelen ser la misma lamina

if (!video) {
  console.error('uso: node text-frames.mjs <video.mp4> --out DIR [--max 12]');
  process.exit(1);
}

const { stdout: durRaw } = await run('ffprobe', [
  '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', video,
]);
const dur = Number(durRaw) || 0;

// Cortos (<5 min): TODOS los cuadros nativos — asi un texto de 1 cuadro no se escapa.
// Largos: fps=4 para que el escaneo no tarde mas que el video.
const muestreo = dur < 300 ? '' : 'fps=4,';
const tmp = mkdtempSync(path.join(os.tmpdir(), 'tf-'));
try {
  // metadata=print con ruta relativa y cwd=tmp: una ruta Windows (C:\...) dentro del
  // grafo de filtros rompe el parseo por los ":" y "\".
  await run(
    'ffmpeg',
    ['-y', '-v', 'error', '-i', path.resolve(video), '-vf',
      `${muestreo}scale=320:-2,format=gray,edgedetect,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=stats.txt`,
      '-f', 'null', '-'],
    { cwd: tmp, timeout: 10 * 60_000, maxBuffer: 1 << 24 },
  );

  const stats = readFileSync(path.join(tmp, 'stats.txt'), 'utf8');
  const cuadros = [];
  for (const m of stats.matchAll(/pts_time:([\d.]+)\s*\r?\n\s*lavfi\.signalstats\.YAVG=([\d.]+)/g)) {
    cuadros.push({ t: Number(m[1]), s: Number(m[2]) });
  }
  if (!cuadros.length) throw new Error('signalstats no devolvio cuadros');

  const media = cuadros.reduce((a, c) => a + c.s, 0) / cuadros.length;
  const desv = Math.sqrt(cuadros.reduce((a, c) => a + (c.s - media) ** 2, 0) / cuadros.length);
  // Piso absoluto ademas del umbral relativo: en un video PLANO (varianza ~0) el umbral
  // relativo marcaba "texto" en cuadros negros. Texto real mide >10; vacio mide ~0.
  const umbral = Math.max(media + 0.5 * desv, 2);

  // Greedy: mejores primero, separados >= GAP, hasta MAX. Solo por encima del umbral:
  // en un video sin texto no se inventa nada.
  const picos = [];
  for (const c of [...cuadros].sort((a, b) => b.s - a.s)) {
    if (c.s < umbral || picos.length >= MAX) break;
    if (picos.every((p) => Math.abs(p.t - c.t) >= GAP)) picos.push(c);
  }
  picos.sort((a, b) => a.t - b.t);

  mkdirSync(OUT, { recursive: true });
  for (const p of picos) {
    const f = path.join(OUT, `f_t${p.t.toFixed(1).padStart(6, '0')}.jpg`);
    await run('ffmpeg', ['-y', '-v', 'error', '-ss', String(p.t), '-i', path.resolve(video),
      '-frames:v', '1', '-vf', 'scale=960:-2', '-q:v', '3', f]);
    console.log(`${p.t.toFixed(1)}\t${p.s.toFixed(1)}\t${f}`);
  }
  console.error(
    `text-frames: ${cuadros.length} cuadros escaneados, media=${media.toFixed(1)} umbral=${umbral.toFixed(1)}, ${picos.length} picos de texto`,
  );
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
