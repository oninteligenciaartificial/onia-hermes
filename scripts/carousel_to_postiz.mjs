#!/usr/bin/env node
// Puente render -> programar: la pieza que faltaba para que un carrusel cruce
// solo de brief aprobado a la cola de Postiz. Une las dos puntas YA probadas
// en produccion (carousel_render.js y postiz_schedule.mjs) sin duplicar nada.
//
//   node scripts/carousel_to_postiz.mjs --brief <slug|ruta.json> --date 2026-09-04T23:00:00.000Z \
//        [--key-file <apikey>] [--skip-render] [--dry-run]
//
// --dry-run: renderiza y muestra que programaria, sin tocar Postiz.
// La apiKey sale de POSTIZ_API_KEY o de --key-file (igual que postiz_schedule).
//
// NO publica a Instagram directo: Postiz es la unica boca (cola editable,
// comentario automatico de hashtags, borrado limpio). El camino viejo por
// ig-publish (carousel_pipeline --publish) queda para lo que ya lo usaba.

import { existsSync, readdirSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const BRIEFS = join(ROOT, 'hermes-content', 'carousels', 'briefs');
const OUT = join(ROOT, 'hermes-content', 'carousels', 'out');

function parseArgs(argv) {
  const a = { brief: '', date: '', keyFile: '', skipRender: false, dryRun: false };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--brief') a.brief = argv[++i];
    else if (k === '--date') a.date = argv[++i];
    else if (k === '--key-file') a.keyFile = argv[++i];
    else if (k === '--skip-render') a.skipRender = true;
    else if (k === '--dry-run') a.dryRun = true;
  }
  return a;
}

const args = parseArgs(process.argv);
if (!args.brief || !args.date) {
  console.error('uso: carousel_to_postiz.mjs --brief <slug|ruta.json> --date <ISO> [--key-file f] [--skip-render] [--dry-run]');
  process.exit(1);
}
if (Number.isNaN(Date.parse(args.date))) {
  console.error(`--date invalida: ${args.date}`);
  process.exit(1);
}

const briefPath = existsSync(args.brief) ? resolve(args.brief) : join(BRIEFS, `${args.brief}.json`);
if (!existsSync(briefPath)) {
  console.error(`brief no encontrado: ${briefPath}`);
  process.exit(1);
}
const slug = basename(briefPath, '.json');
const outDir = join(OUT, slug);

if (!args.skipRender) {
  execFileSync('node', [join(ROOT, 'scripts', 'carousel_render.js'), '--brief', briefPath, '--out', outDir], { stdio: 'inherit' });
}

const slides = existsSync(outDir)
  ? readdirSync(outDir).filter((f) => /^slide-\d+\.png$/.test(f)).sort()
  : [];
if (!slides.length) {
  console.error(`sin slides en ${outDir} — el render fallo o --skip-render sin render previo`);
  process.exit(1);
}

if (args.dryRun) {
  console.log(JSON.stringify({ dryRun: true, slug, slides: slides.length, date: args.date, outDir }, null, 2));
  process.exit(0);
}

const schedArgs = [join(ROOT, 'scripts', 'postiz_schedule.mjs'), '--slides', outDir, '--caption-from', briefPath, '--date', args.date];
if (args.keyFile) schedArgs.push('--key-file', args.keyFile);
execFileSync('node', schedArgs, { stdio: 'inherit' });
