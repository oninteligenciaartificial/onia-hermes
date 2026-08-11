#!/usr/bin/env node
// Intake de video punta a punta: link -> mp4 -> lectura (Gemini) -> verbatim
// (Speaches) -> archivos en hermes-content/references/video-intake/.
//
//   node scripts/video-intake.mjs <url> [<url>...]
//
// Deja SIEMPRE la fuente cruda. NO emite veredicto: decidir si algo sirve o es
// humo es trabajo de una sesion con el contexto de ONIA delante, no de un cron.
// El veredicto se escribe despues, en la ficha; esto llena la bandeja.
//
// Requisitos: yt-dlp, ffmpeg, GEMINI_API_KEY. Cookies de IG solo para links de
// Instagram (ver .claude/skills/ver-videos/SKILL.md).

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdirSync, writeFileSync, appendFileSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const run = promisify(execFile);
const REPO = path.resolve(import.meta.dirname, '..');
const SKILL = path.join(REPO, '.claude', 'skills', 'ver-videos', 'scripts');
const DEST = path.join(REPO, 'hermes-content', 'references', 'video-intake');
const TRANS = path.join(DEST, 'transcripciones');
const BANDEJA = path.join(DEST, 'BANDEJA.md');

const urls = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!urls.length) {
  console.error('uso: node scripts/video-intake.mjs <url> [<url>...]');
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const ts = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${(s % 60).toFixed(1).padStart(4, '0')}`;

/** El primer bloque tras "### 1. RESUMEN" — para la linea de la bandeja. */
function resumen(texto) {
  const m = texto.match(/###\s*1\.\s*RESUMEN\s*([\s\S]*?)(?=\n#{2,3}\s|\n---)/i);
  const t = (m ? m[1] : texto).replace(/\s+/g, ' ').trim();
  return t.length > 320 ? t.slice(0, 317) + '...' : t;
}

async function transcribir(mp4, tmp, lang) {
  // Nombre unico: transcribe.sh copia el audio a /tmp/ del VPS por basename. Con un
  // nombre fijo, dos intakes en paralelo se pisan y un video recibe la transcripcion
  // del otro, en silencio.
  const mp3 = path.join(tmp, `${path.basename(mp4).replace(/\.[^.]+$/, '')}.mp3`);
  await run('ffmpeg', ['-y', '-v', 'error', '-i', mp4, '-vn', '-ac', '1', '-ar', '16000', '-b:a', '64k', mp3]);
  // Sin pista de audio util, ffmpeg igual produce un mp3: Speaches devuelve 0 segmentos.
  const { stdout } = await run('bash', [path.join(SKILL, 'transcribe.sh'), mp3], {
    maxBuffer: 1 << 26,
    // auto = que Whisper detecte. Forzar "es" traduce los videos en ingles.
    env: { ...process.env, ONIA_AUDIO_STT_LANGUAGE: lang || 'auto' },
  });
  const j = JSON.parse(stdout);
  if (!j.ok) return `_Speaches falló: ${j.error}_`;
  if (!j.n_segments) return '_Sin locución: el video no tiene voz (solo música / sonido ambiente)._';
  return [
    `Modelo: \`${j.model}\` · ${j.n_segments} segmentos · ${j.n_words} palabras · ${Number(j.duration).toFixed(1)} s`,
    '',
    '```',
    ...j.segments.map((s) => `[${ts(s.start)} -> ${ts(s.end)}] ${s.text.trim()}`),
    '```',
  ].join('\n');
}

async function procesar(url) {
  const dir = path.join(os.tmpdir(), `vi-${Date.now()}-${Math.abs(hash(url))}`);
  mkdirSync(dir, { recursive: true });

  const { stdout: dl } = await run('node', [path.join(SKILL, 'fetch-video.mjs'), url, '--out', dir], {
    maxBuffer: 1 << 24,
  });
  const mp4 = dl.trim().split('\n').pop().split('\t').pop().trim();
  if (!mp4 || !existsSync(mp4)) throw new Error(`no se bajó el mp4 (salida: ${dl.trim()})`);

  const { stdout: dur } = await run('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4,
  ]);

  const { stdout: lectura } = await run('node', [path.join(SKILL, 'gemini-see-video.mjs'), mp4], {
    maxBuffer: 1 << 26,
    timeout: 15 * 60_000,
  });

  const verbatim = await transcribir(mp4, dir, null).catch((e) => `_Transcripción falló: ${e.message}_`);

  const slug = `${today}-${path.basename(mp4).replace(/\.[^.]+$/, '')}`;
  mkdirSync(TRANS, { recursive: true });
  writeFileSync(
    path.join(TRANS, `${slug}.md`),
    [
      `# Lectura completa — ${slug}`,
      '',
      `- Fuente: ${url}`,
      `- Duración: ${Number(dur).toFixed(1)} s`,
      `- Motor: Gemini nativo (video + audio) · verbatim: Whisper/Speaches`,
      `- Ingresado: ${today} por \`scripts/video-intake.mjs\` (automático, SIN veredicto)`,
      '',
      '---',
      '',
      lectura.trim(),
      '',
      '---',
      '',
      '## Transcripción literal (Whisper / Speaches, verbatim)',
      '',
      verbatim,
      '',
    ].join('\n'),
  );

  if (!existsSync(BANDEJA)) {
    writeFileSync(
      BANDEJA,
      [
        '# Bandeja — videos ingresados sin veredicto',
        '',
        'Los llena `scripts/video-intake.mjs` automáticamente. **Ninguno tiene veredicto**:',
        'decidir si sirve, mejora algo o es humo se hace en sesión, con el contexto de ONIA',
        'delante. Cuando uno se procesa, se le escribe su ficha y se mueve a [INDEX.md](INDEX.md).',
        '',
      ].join('\n'),
    );
  }
  appendFileSync(
    BANDEJA,
    `\n## ${slug}\n\n- ${url} · ${Number(dur).toFixed(0)} s\n- [Lectura + verbatim](transcripciones/${slug}.md)\n- Resumen: ${resumen(lectura)}\n- **Veredicto: PENDIENTE**\n`,
  );

  return slug;
}

function hash(s) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
  return h;
}

const out = await Promise.allSettled(urls.map(procesar));
let fail = 0;
out.forEach((r, i) => {
  if (r.status === 'fulfilled') console.log(`OK\t${urls[i]}\t${r.value}`);
  else {
    fail++;
    console.error(`FALLO\t${urls[i]}\t${String(r.reason.stderr || r.reason.message).trim().split('\n').pop()}`);
  }
});
process.exit(fail === urls.length ? 1 : 0);
