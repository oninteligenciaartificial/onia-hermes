#!/usr/bin/env node
// Lucía · chiste de 10 s «¿Lucía Antelo es real?» — build reproducible, 0 créditos (8-oct-2026).
// Receta: .claude/skills/editor-videos/SKILL.md § «Reels de Lucía» · plan: hermes-content/docs/cola/lucia-diario/PLAN.md v4 §5.
// Esta nube no trae PIL/numpy/cv2/insightface ni la librería de SFX, e instalar pide aprobación (CLAUDE.md), así que el
// build usa solo lo que hay: make-mockup.mjs (Playwright + Chromium local) para las tarjetas y ffmpeg para montar.
// Las medidas vienen de piezas ya validadas con el mismo clip y las mismas plantillas:
//   · mentón máx del clip del café (crudo recortado): YuNet 1148 px → texto desde y ≥ 1188 (L08 README, QA del 1-oct);
//   · escala de tarjeta 0,51429 y aire de la plantilla (130u lados, 80u arriba, 190u abajo, @2x) (L02 layout.json);
//   · escala del rótulo 520 / (1353 − 88) (L08 build.mjs).
// Uso: node videos/lucia-chiste/scripts/build.mjs   → renders/gen1.mp4, renders/preview-360.mp4, renders/qa-hoja.jpg
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const R = path.resolve(P, '../..');
const ES = path.join(R, '.claude/skills/editor-videos/scripts');
const H = path.join(R, '.claude/skills/editor-videos/assets/html');
const CLIP = path.join(R, 'hermes-content/references/modelos/lucia/v4/feed/l08-cafe-src.mp4');
const W = 1080, FPS = 24;
const INICIO = 10;            // arranque en caliente: se saltan los 10 cuadros muertos del clip, como en L08 (−0,42 s)
const CUADROS = 241 - INICIO; // 231 cuadros = 9,625 s; no se congela ni se acelera
const F = 0.51429;            // escala de tarjeta de L02
const S_TAG = +(520 / (1353 - 88)).toFixed(4);
const ACENTO = '#10C26B';

// Texto (de usted, D8 del plan v4). ≤ 6 palabras por tarjeta y ≥ 0,35 s por palabra + 0,3 s de entrada.
const TARJETAS = [
  { id: 't1', title: '¿Lucía Antelo es real?', value: '', a: 0.10, b: 3.00, top: 1262 },
  { id: 't2', title: 'No:', value: 'soy IA.', a: 3.00, b: 5.40, top: 1222 },
  { id: 't3', title: 'Lo que le muestro,', value: 'sí.', a: 5.40, b: CUADROS / FPS, top: 1222 },
];
const ROTULO = { title: 'Lucía Antelo · personaje IA de Onia', a: 0, b: 2.40, top: 1194 };
const FADE_IN = 0.15, FADE_OUT = 0.22;

const sh = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'inherit'], encoding: 'utf8' });
const tam = (png) => sh('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', png])
  .trim().split(',').map(Number);

function palabras(t) { return `${t.title} ${t.value}`.trim().split(/\s+/).length; }
for (const t of TARJETAS) {
  const n = palabras(t), min = n * 0.35 + 0.3;
  if (n > 6 || t.b - t.a < min - 1e-9) throw new Error(`${t.id}: ${n} palabras en ${(t.b - t.a).toFixed(2)} s (mín ${min.toFixed(2)})`);
}

fs.mkdirSync(path.join(P, 'assets'), { recursive: true });
fs.mkdirSync(path.join(P, 'renders'), { recursive: true });
const mock = (out, args) => sh('node', [path.join(ES, 'make-mockup.mjs'), '--template', 'custom', '--accent', ACENTO,
  '--width', '1000', '--out', out, ...args]);
for (const t of TARJETAS) {
  mock(path.join(P, 'assets', `${t.id}.png`), ['--html-file', path.join(P, 'assets/frase-card.html'), '--title', t.title,
    ...(t.value ? ['--value', t.value] : [])]);
}
mock(path.join(P, 'assets/rotulo.png'), ['--html-file', path.join(H, 'tag-ia.html'), '--title', ROTULO.title]);

// Geometría: el PNG trae el aire de la sombra; se ubica por lo VISIBLE (cuerpo de la tarjeta), centrado.
const capas = [];
const plan = { inicio_cuadro: INICIO, cuadros: CUADROS, fps: FPS, capas: [] };
for (const t of TARJETAS) {
  const [w, h] = tam(path.join(P, 'assets', `${t.id}.png`));
  const sw = Math.round(w * F), shh = Math.round(h * F);
  const visW = sw - 2 * Math.round(130 * 2 * F), visH = shh - Math.round(80 * 2 * F) - Math.round(190 * 2 * F);
  const x = Math.round((W - sw) / 2), y = t.top - Math.round(80 * 2 * F);
  if (x + Math.round(130 * 2 * F) + visW > W - 80) throw new Error(`${t.id}: invade los 80 px de la derecha`);
  if (t.top + visH > 1490) throw new Error(`${t.id}: baja de y=1490 (${t.top + visH})`);
  capas.push({ file: `assets/${t.id}.png`, sw, shh, x, y, a: t.a, b: t.b });
  plan.capas.push({ id: t.id, texto: `${t.title} ${t.value}`.trim(), visible: [x + Math.round(130 * 2 * F), t.top, x + Math.round(130 * 2 * F) + visW, t.top + visH], a: t.a, b: t.b });
}
{
  const [w, h] = tam(path.join(P, 'assets/rotulo.png'));
  const sw = Math.round(w * S_TAG), shh = Math.round(h * S_TAG);
  capas.push({ file: 'assets/rotulo.png', sw, shh, x: Math.round((W - sw) / 2), y: Math.round(ROTULO.top - 56 * S_TAG), a: ROTULO.a, b: ROTULO.b, sinFadeIn: true });
  plan.capas.push({ id: 'rotulo', texto: ROTULO.title, a: ROTULO.a, b: ROTULO.b, top: ROTULO.top });
}

// Una pasada: recorte en caliente + escala a 1080×1920 + capas con fundido + pista de audio en silencio.
const ins = ['-i', CLIP, ...capas.flatMap((c) => ['-loop', '1', '-framerate', String(FPS), '-t', (CUADROS / FPS).toFixed(4), '-i', path.join(P, c.file)]),
  '-f', 'lavfi', '-t', (CUADROS / FPS).toFixed(4), '-i', 'anullsrc=r=48000:cl=stereo'];
let fc = `[0:v]trim=start_frame=${INICIO}:end_frame=${INICIO + CUADROS},setpts=PTS-STARTPTS,scale=1080:1920:flags=lanczos,setsar=1,format=yuv420p[v0]`;
capas.forEach((c, i) => {
  const fi = c.sinFadeIn ? '' : `,fade=t=in:st=${c.a}:d=${FADE_IN}:alpha=1`;
  const fo = c.b < CUADROS / FPS - 0.01 ? `,fade=t=out:st=${(c.b - FADE_OUT).toFixed(3)}:d=${FADE_OUT}:alpha=1` : '';
  fc += `;[${i + 1}:v]scale=${c.sw}:${c.shh}:flags=lanczos,format=rgba${fi}${fo}[c${i}]`;
  fc += `;[v${i}][c${i}]overlay=x=${c.x}:y=${c.y}:enable='between(t,${(c.a - 1 / FPS).toFixed(3)},${c.b.toFixed(3)})'[v${i + 1}]`;
});
const out = path.join(P, 'renders/gen1.mp4');
sh('ffmpeg', ['-v', 'error', '-y', ...ins, '-filter_complex', fc, '-map', `[v${capas.length}]`, '-map', `${capas.length + 1}:a`,
  '-r', String(FPS), '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p',
  '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-movflags', '+faststart',
  '-c:a', 'aac', '-b:a', '128k', '-shortest', out]);
sh('ffmpeg', ['-v', 'error', '-y', '-i', out, '-vf', 'scale=360:640', '-c:v', 'libx264', '-crf', '28', '-c:a', 'aac', path.join(P, 'renders/preview-360.mp4')]);
// Hoja de QA: 8 cuadros con guías (mentón + 40 = 1188 cian, 1490 rojo, 80 px a la derecha magenta).
sh('ffmpeg', ['-v', 'error', '-y', '-i', out, '-vf',
  `select='eq(n\\,1)+eq(n\\,36)+eq(n\\,70)+eq(n\\,74)+eq(n\\,130)+eq(n\\,132)+eq(n\\,180)+eq(n\\,230)',` +
  'drawbox=x=0:y=1188:w=1080:h=3:color=cyan@0.9:t=fill,drawbox=x=0:y=1490:w=1080:h=3:color=red@0.9:t=fill,' +
  'drawbox=x=1000:y=1000:w=3:h=920:color=magenta@0.9:t=fill,scale=270:480,tile=8x1:padding=6:color=white',
  '-frames:v', '1', '-vsync', 'vfr', path.join(P, 'renders/qa-hoja.jpg')]);
fs.writeFileSync(path.join(P, 'scripts/plan.json'), JSON.stringify(plan, null, 2) + '\n');
console.log(JSON.stringify(plan.capas, null, 1));
console.log('ok:', out);
