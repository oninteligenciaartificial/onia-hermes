#!/usr/bin/env node
// Sube los PNG de un carrusel a Postiz y lo programa.
//
//   node scripts/postiz_schedule.mjs --slides <dir> --caption-from <brief.json> --date 2026-08-19T23:00:00.000Z
//   node scripts/postiz_schedule.mjs --list
//   node scripts/postiz_schedule.mjs --delete <postId>
//
// La apiKey sale de POSTIZ_API_KEY o de --key-file <archivo>.
// Base con /api: sin eso el frontend devuelve 200 con el HTML del login.

import { readFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';

const BASE = 'https://postiz.onia.com.bo/api/public/v1';
// Default: @oniahq. --integration permite programar en otra cuenta conectada
// (Lucia: cmt1sv4eh001alq9cl3y6q7es).
const INTEGRATION = 'cmsw091nx0001lq9c8kr6dsg8'; // @oniahq

function parseArgs(argv) {
  const a = { slides: '', image: '', captionFrom: '', date: '', keyFile: '', integration: '', list: false, delete: '', now: false, draft: false };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--slides') a.slides = argv[++i];
    else if (k === '--image') a.image = argv[++i];
    else if (k === '--integration') a.integration = argv[++i];
    else if (k === '--caption-from') a.captionFrom = argv[++i];
    else if (k === '--date') a.date = argv[++i];
    else if (k === '--key-file') a.keyFile = argv[++i];
    else if (k === '--now') a.now = true;
    // --draft crea el post SIN publicarlo. Es la unica forma de probar el
    // circuito entero (subida + creacion + respuesta) sin ensuciar una cuenta
    // real: no hay cuenta de prueba, las tres conectadas son de verdad.
    else if (k === '--draft') a.draft = true;
    else if (k === '--list') a.list = true;
    else if (k === '--delete') a.delete = argv[++i];
  }
  return a;
}

function apiKey(args) {
  const k = args.keyFile ? readFileSync(args.keyFile, 'utf8').trim() : process.env.POSTIZ_API_KEY;
  if (!k) throw new Error('Falta la apiKey: POSTIZ_API_KEY o --key-file');
  return k;
}

async function api(key, path, init = {}) {
  const res = await fetch(BASE + path, {
    ...init,
    headers: { Authorization: key, ...(init.headers || {}) },
  });
  const text = await res.text();
  // Un 200 con HTML es el login, no la API.
  if (text.trimStart().startsWith('<')) {
    throw new Error(`${path} devolvio HTML (${res.status}) — la ruta perdio el /api`);
  }
  if (!res.ok) throw new Error(`${path} → ${res.status} ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}

async function uploadSlide(key, file) {
  const form = new FormData();
  form.append('file', new Blob([readFileSync(file)], { type: 'image/png' }), basename(file));
  const out = await api(key, '/upload', { method: 'POST', body: form });
  if (!out?.id || !out?.path) throw new Error(`upload sin id/path: ${JSON.stringify(out)}`);
  return { id: out.id, path: out.path };
}

const main = async () => {
  const args = parseArgs(process.argv);
  const key = apiKey(args);

  if (args.list) {
    // Esta version de Postiz filtra por startDate/endDate ISO 8601 y RECHAZA con 400 el
    // week/year/display que se pedia antes. Como el error se tragaba con `.catch(() => null)`,
    // --list imprimia [] teniendo posts programados de verdad: decia «no hay nada agendado»
    // sobre una agenda llena. Medido el 2026-09-05: [] contra 2 DRAFT vivos en la misma API.
    // Si la API falla, ahora revienta a proposito — un listado vacio no puede significar a la
    // vez «no hay nada» y «no pude preguntar».
    const desde = new Date();
    const hasta = new Date(desde.getTime() + 8 * 7 * 864e5);
    const got = await api(
      key,
      `/posts?startDate=${desde.toISOString()}&endDate=${hasta.toISOString()}&customer=`,
    );
    const rows = Array.isArray(got) ? got : (got?.posts ?? []);
    console.log(JSON.stringify(rows.map((p) => ({ id: p.id, date: p.publishDate, state: p.state })), null, 2));
    return;
  }

  if (args.delete) {
    await api(key, `/posts/${args.delete}`, { method: 'DELETE' });
    console.log(`borrado ${args.delete}`);
    return;
  }

  if ((!args.slides && !args.image) || !args.captionFrom || (!args.date && !args.now && !args.draft)) {
    throw new Error('Faltan --slides (o --image), --caption-from y --date (o --now)');
  }

  // --image: un post de una sola imagen (los de Lucia). --slides: carrusel.
  const files = args.image
    ? [args.image]
    : readdirSync(args.slides)
        .filter((f) => /^slide-\d+\.png$/.test(f))
        .sort()
        .map((f) => join(args.slides, f));
  if (!files.length) throw new Error(`sin slides en ${args.slides || args.image}`);

  const brief = JSON.parse(readFileSync(args.captionFrom, 'utf8'));

  // Los hashtags NO van en el caption: van al primer comentario. Las dos primeras lineas del
  // caption son las que deciden si alguien abre el post — una pared de hashtags las entierra.
  const caption = brief.caption;
  const slug = basename(args.captionFrom, '.json');
  // brief.src === false apaga el link de atribucion: en la cuenta de Lucia un
  // link a onia.com.bo en cada post es venta de mas para una cuenta de alcance
  // (el trafico va Lucia -> @oniahq por mencion, no por link).
  const comment = [
    (brief.hashtags || []).join(' '),
    brief.src === false ? '' : `📎 onia.com.bo/?src=${slug}`,
  ].filter(Boolean).join('\n\n');

  const image = [];
  for (const f of files) image.push(await uploadSlide(key, f));

  // value[0] = el post. value[1+] = comentarios que el orchestrador publica sobre el propio
  // post apenas sale (apps/orchestrator/src/activities/post.activity.ts → postComment).
  // `image` es obligatorio en cada elemento, aunque el comentario no lleve ninguna.
  const value = [{ content: caption, image }];
  if (comment) value.push({ content: comment, image: [] });

  // --now publica YA. Es lo que usa el circuito de aprobacion: cuando Sergio
  // contesta `ok <id>` por Telegram no quiere una cita en la agenda, quiere que
  // la pieza salga. `schedule` con fecha sigue siendo el default.
  const fecha = args.date || new Date().toISOString();

  const out = await api(key, '/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: args.draft ? 'draft' : args.now ? 'now' : 'schedule',
      date: fecha,
      shortLink: false,
      tags: [],
      posts: [
        {
          integration: { id: args.integration || INTEGRATION },
          value,
          settings: { post_type: 'post' }, // sin esto: 400
        },
      ],
    }),
  });

  console.log(JSON.stringify({ ok: true, slides: files.length, date: fecha, tipo: args.draft ? 'draft' : args.now ? 'now' : 'schedule', out }, null, 2));
};

main().catch((e) => {
  console.error(String(e.message || e));
  process.exit(1);
});
