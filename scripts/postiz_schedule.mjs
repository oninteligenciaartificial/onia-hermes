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
const INTEGRATION = 'cmsw091nx0001lq9c8kr6dsg8'; // @oniahq

function parseArgs(argv) {
  const a = { slides: '', captionFrom: '', date: '', keyFile: '', list: false, delete: '' };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--slides') a.slides = argv[++i];
    else if (k === '--caption-from') a.captionFrom = argv[++i];
    else if (k === '--date') a.date = argv[++i];
    else if (k === '--key-file') a.keyFile = argv[++i];
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
    const now = new Date();
    const rows = [];
    for (let w = 0; w < 8; w++) {
      const d = new Date(now.getTime() + w * 7 * 864e5);
      const year = d.getUTCFullYear();
      const week = Math.ceil(((d - new Date(Date.UTC(year, 0, 1))) / 864e5 + 1) / 7);
      const got = await api(key, `/posts?week=${week}&year=${year}&display=week&customer=`).catch(() => null);
      if (Array.isArray(got)) rows.push(...got);
    }
    console.log(JSON.stringify(rows.map((p) => ({ id: p.id, date: p.publishDate, state: p.state })), null, 2));
    return;
  }

  if (args.delete) {
    await api(key, `/posts/${args.delete}`, { method: 'DELETE' });
    console.log(`borrado ${args.delete}`);
    return;
  }

  if (!args.slides || !args.captionFrom || !args.date) {
    throw new Error('Faltan --slides, --caption-from y --date');
  }

  const files = readdirSync(args.slides)
    .filter((f) => /^slide-\d+\.png$/.test(f))
    .sort()
    .map((f) => join(args.slides, f));
  if (!files.length) throw new Error(`sin slides en ${args.slides}`);

  const brief = JSON.parse(readFileSync(args.captionFrom, 'utf8'));
  const caption = [brief.caption, (brief.hashtags || []).join(' ')].filter(Boolean).join('\n\n');

  const image = [];
  for (const f of files) image.push(await uploadSlide(key, f));

  const out = await api(key, '/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'schedule',
      date: args.date,
      shortLink: false,
      tags: [],
      posts: [
        {
          integration: { id: INTEGRATION },
          value: [{ content: caption, image }],
          settings: { post_type: 'post' }, // sin esto: 400
        },
      ],
    }),
  });

  console.log(JSON.stringify({ ok: true, slides: files.length, date: args.date, out }, null, 2));
};

main().catch((e) => {
  console.error(String(e.message || e));
  process.exit(1);
});
