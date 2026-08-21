#!/usr/bin/env node
// Intake de video punta a punta: link -> mp4 -> escenas (Higgsfield, encolado) ->
// lectura (Gemini) -> verbatim (Speaches) -> caption (IG) -> fotogramas con texto ->
// archivos en hermes-content/references/video-intake/.
//
//   node scripts/video-intake.mjs <url|ruta.mp4> [<url|ruta.mp4>...]
//
// Acepta tambien una RUTA LOCAL (re-procesar un video ya bajado, sin re-fetch).
//
// Deja SIEMPRE la fuente cruda. NO emite veredicto: decidir si algo sirve o es
// humo es trabajo de una sesion con el contexto de ONIA delante, no de un cron.
// El veredicto se escribe despues, en la ficha; esto llena la bandeja.
//
// Corre SIN supervision: todo error de red/API degrada con log y sigue. Nada de claves
// en el codigo (GEMINI_API_KEY por env/.env; IG por cookies; Higgsfield por MCP).
//
// Escenas: el analisis escena por escena (video_analysis_create de Higgsfield, GRATIS,
// medido 2026-08-19) NO se llama desde aca — el MCP solo existe en una sesion de Claude.
// Este script ENCOLA (solo videos < 3 min: la propia herramienta degrada en largos) y
// scripts/video-scenes.mjs drena la cola desde una sesion con el MCP. El poll de 3-5 min
// nunca bloquea el intake: se encola y se sigue con Whisper.
//
// Requisitos: yt-dlp, ffmpeg, GEMINI_API_KEY. Cookies de IG solo para links de
// Instagram (ver .claude/skills/ver-videos/SKILL.md).

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdirSync, writeFileSync, appendFileSync, existsSync, readFileSync, copyFileSync, statSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { shortcodeOf, cookieHeader, fetchMediaItem } from '../.claude/skills/ver-videos/scripts/ig-carousel.mjs';

const run = promisify(execFile);
const REPO = path.resolve(import.meta.dirname, '..');
const SKILL = path.join(REPO, '.claude', 'skills', 'ver-videos', 'scripts');
const DEST = path.join(REPO, 'hermes-content', 'references', 'video-intake');
const TRANS = path.join(DEST, 'transcripciones');
const BANDEJA = path.join(DEST, 'BANDEJA.md');
const SPOOL_BASE = path.join(REPO, '.hermes', 'video-intake'); // gitignoreado: estado de maquina
const QUEUE = path.join(SPOOL_BASE, 'scenes-queue.jsonl');
const ESCENAS_MAX_S = 180; // < 3 min: "the longer the video, the less accurate" (dicho por la herramienta)

// Nota fija al pie de toda transcripcion: Whisper inventa fonetica con los nombres.
const NOTA_WHISPER =
  'Whisper degrada términos técnicos (SIDANZ=Seedance, Hitsfield=Higgsfield, viesel=VSL); ' +
  'ningún término técnico se cita sin contrastar con la imagen.';

const urls = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!urls.length) {
  console.error('uso: node scripts/video-intake.mjs <url|ruta.mp4> [<url|ruta.mp4>...]');
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

/** Identificador estable del video: shortcode de IG, o basename saneado. */
function idDe(url, mp4) {
  const sc = shortcodeOf(url);
  const crudo = sc !== url ? sc : path.basename(mp4).replace(/\.[^.]+$/, '');
  return crudo.replace(/[^A-Za-z0-9_-]/g, '_');
}

/**
 * Encola el video para analisis por escenas (lo drena scripts/video-scenes.mjs desde
 * una sesion con el MCP de Higgsfield). Copia el mp4 al spool: el tmp no sobrevive.
 * Devuelve el estado en una frase — nunca bloquea, nunca tira.
 */
function encolarEscenas({ sc, url, mp4, dur }) {
  if (dur >= ESCENAS_MAX_S)
    return `salteado: ${Math.round(dur)} s >= ${ESCENAS_MAX_S} s (la herramienta degrada en videos largos)`;
  if (existsSync(path.join(DEST, 'analisis', `${sc}-escenas.md`))) return 'ya analizado (analisis/ existente)';
  const cola = existsSync(QUEUE)
    ? readFileSync(QUEUE, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))
    : [];
  if (cola.some((e) => e.sc === sc && e.estado !== 'fallo')) return 'ya en cola';
  mkdirSync(path.join(SPOOL_BASE, 'spool'), { recursive: true });
  const copia = path.join(SPOOL_BASE, 'spool', `${sc}.mp4`);
  copyFileSync(mp4, copia);
  appendFileSync(
    QUEUE,
    JSON.stringify({ sc, url, mp4: copia, dur: Math.round(dur), fecha: today, estado: 'pendiente' }) + '\n',
  );
  return `encolado (${cola.filter((e) => e.estado === 'pendiente').length + 1} pendientes) — drenar con scripts/video-scenes.mjs`;
}

/** Caption del post (solo IG) — el mismo metodo que ig-carousel.mjs usa en carruseles. */
async function captionIG(url) {
  if (!/instagram\.com\//i.test(url)) return null;
  const item = await fetchMediaItem(shortcodeOf(url), cookieHeader());
  return item.caption?.text?.trim() || null;
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

/** Fotogramas por DENSIDAD DE TEXTO (no intervalo fijo) al spool local. */
async function fotogramasTexto(mp4, sc) {
  const dir = path.join(SPOOL_BASE, 'frames', sc);
  const { stdout } = await run('node', [path.join(SKILL, 'text-frames.mjs'), mp4, '--out', dir], {
    maxBuffer: 1 << 24,
    timeout: 12 * 60_000,
  });
  const lineas = stdout.trim().split('\n').filter(Boolean);
  if (!lineas.length) return '_Sin picos de texto detectados (muestreo por densidad de bordes)._';
  return [
    `${lineas.length} cuadros con texto probable (muestreo por densidad de bordes, LOCAL en \`${path.relative(REPO, dir)}\`):`,
    '',
    '```',
    ...lineas.map((l) => l.split('\t').slice(0, 2).join('s  score=')),
    '```',
  ].join('\n');
}

async function procesar(input) {
  const dir = path.join(os.tmpdir(), `vi-${Date.now()}-${Math.abs(hash(input))}`);
  mkdirSync(dir, { recursive: true });

  let mp4;
  let url = input;
  if (existsSync(input) && statSync(input).isFile()) {
    mp4 = path.resolve(input); // re-proceso de un video ya bajado
    url = `local:${path.basename(input)}`;
  } else {
    const { stdout: dl } = await run('node', [path.join(SKILL, 'fetch-video.mjs'), input, '--out', dir], {
      maxBuffer: 1 << 24,
    });
    mp4 = dl.trim().split('\n').pop().split('\t').pop().trim();
    if (!mp4 || !existsSync(mp4)) throw new Error(`no se bajó el mp4 (salida: ${dl.trim()})`);
  }

  const { stdout: dur } = await run('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4,
  ]);
  const sc = idDe(url, mp4);

  // Escenas: encolar y SEGUIR (el poll de 3-5 min es del drenador, no del intake).
  let escenas;
  try {
    escenas = encolarEscenas({ sc, url, mp4, dur: Number(dur) });
  } catch (e) {
    escenas = `no se pudo encolar: ${e.message}`;
  }
  console.error(`escenas\t${sc}\t${escenas}`);

  const caption = await captionIG(url).catch((e) => {
    console.error(`caption\t${sc}\tfalló: ${e.message}`);
    return null;
  });

  const lectura = await run('node', [path.join(SKILL, 'gemini-see-video.mjs'), mp4], {
    maxBuffer: 1 << 26,
    timeout: 15 * 60_000,
  }).then(
    (r) => r.stdout,
    (e) => `_Lectura Gemini falló: ${String(e.stderr || e.message).trim().split('\n').pop()}_`,
  );

  const verbatim = await transcribir(mp4, dir, null).catch((e) => `_Transcripción falló: ${e.message}_`);

  const frames = await fotogramasTexto(mp4, sc).catch((e) => {
    console.error(`frames\t${sc}\tfalló: ${e.message}`);
    return `_Fotogramas no extraídos: ${e.message}_`;
  });

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
      `- Escenas (Higgsfield): ${escenas} → analisis/${sc}-escenas.md cuando corra`,
      `- Ingresado: ${today} por \`scripts/video-intake.mjs\` (automático, SIN veredicto)`,
      '',
      '---',
      '',
      lectura.trim(),
      '',
      ...(caption ? ['---', '', '## Caption (Instagram)', '', caption, ''] : []),
      '---',
      '',
      '## Fotogramas con texto (densidad de bordes, no intervalo fijo)',
      '',
      frames,
      '',
      '---',
      '',
      '## Transcripción literal (Whisper / Speaches, verbatim)',
      '',
      verbatim,
      '',
      `> **Nota fija:** ${NOTA_WHISPER}`,
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
