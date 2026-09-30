#!/usr/bin/env node
// Sube un video a YouTube por la API oficial (Data API v3, subida reanudable). Corre en el VPS:
// credenciales en /root/.config/onia-publicar/yt-<cuenta>.env (600): YT_CLIENT_ID, YT_CLIENT_SECRET,
// YT_REFRESH_TOKEN. Las deja ahí `yt-auth.mjs` (se corre una vez en la PC, Sergio aprieta «Permitir»).
//   node yt-video.mjs --cuenta sergio --video final.mp4 --meta meta.json                # privado (ensayo)
//   node yt-video.mjs ... --privacidad public --publicar
// meta.json: { "title": "...", "description": "...", "tags": ["..."], "categoryId": "27" }
// Un vertical de hasta 3 min sube como Short solo. Publicar es acción pública: solo con OK de Sergio.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';

const CONF = '/root/.config/onia-publicar';
const LEDGER = '/root/publicar/publicado.jsonl';
const PRIVACY = ['private', 'unlisted', 'public'];

export function videoResource(meta, privacy) {
  if (!PRIVACY.includes(privacy)) throw new Error(`--privacidad debe ser ${PRIVACY.join('|')}`);
  if (!meta.title || meta.title.length > 100) throw new Error('title obligatorio, ≤ 100 caracteres');
  if ((meta.description || '').length > 5000) throw new Error('description > 5000 caracteres');
  return {
    snippet: { title: meta.title, description: meta.description || '', tags: meta.tags || [], categoryId: meta.categoryId || '27' },
    status: { privacyStatus: privacy, selfDeclaredMadeForKids: false },
  };
}

function loadEnv(cuenta) {
  if (!/^[a-z0-9-]+$/.test(cuenta)) throw new Error('cuenta inválida');
  const env = Object.fromEntries(fs.readFileSync(path.join(CONF, `yt-${cuenta}.env`), 'utf8')
    .split('\n').filter(Boolean).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]));
  for (const k of ['YT_CLIENT_ID', 'YT_CLIENT_SECRET', 'YT_REFRESH_TOKEN']) if (!env[k]) throw new Error(`falta ${k}`);
  return env;
}

async function accessToken(env) {
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', body: new URLSearchParams({
    grant_type: 'refresh_token', refresh_token: env.YT_REFRESH_TOKEN, client_id: env.YT_CLIENT_ID, client_secret: env.YT_CLIENT_SECRET }) });
  const j = await r.json();
  if (!j.access_token) throw new Error(`Google no dio token: ${j.error || r.status} ${j.error_description || ''}`);
  return j.access_token;
}

async function main() {
  const { values: a } = parseArgs({ options: {
    cuenta: { type: 'string' }, video: { type: 'string' }, meta: { type: 'string' },
    privacidad: { type: 'string', default: 'private' }, publicar: { type: 'boolean' }, selftest: { type: 'boolean' } } });
  if (a.selftest) return selftest();
  if (a.privacidad !== 'private' && !a.publicar) throw new Error('para unlisted/public hace falta --publicar (OK de Sergio)');
  const env = loadEnv(a.cuenta);
  const body = videoResource(JSON.parse(fs.readFileSync(a.meta, 'utf8')), a.privacidad);
  const size = fs.statSync(a.video).size;
  const token = await accessToken(env);
  const init = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
    method: 'POST', body: JSON.stringify(body),
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Type': 'video/*', 'X-Upload-Content-Length': String(size) } });
  const uploadUrl = init.headers.get('location');
  if (!uploadUrl) throw new Error(`YouTube no abrió la subida: ${init.status} ${(await init.text()).slice(0, 300)}`);
  const up = await fetch(uploadUrl, { method: 'PUT', body: fs.readFileSync(a.video),
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'video/*', 'Content-Length': String(size) } });
  const v = await up.json();
  if (!v.id) throw new Error(`subida fallida: ${up.status} ${JSON.stringify(v).slice(0, 300)}`);
  const url = `https://youtu.be/${v.id}`;
  fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
  fs.appendFileSync(LEDGER, JSON.stringify({ red: 'youtube', cuenta: a.cuenta, id: v.id, url, privacidad: v.status?.privacyStatus, video: a.video, fecha: new Date().toISOString() }) + '\n');
  console.log(`SUBIDO ${url} (${v.status?.privacyStatus})`);
}

function selftest() {
  const r = videoResource({ title: 't' }, 'private');
  assert.equal(r.status.privacyStatus, 'private');
  assert.equal(r.snippet.categoryId, '27');
  assert.throws(() => videoResource({ title: 't' }, 'publico'), /privacidad/);
  assert.throws(() => videoResource({}, 'private'), /title/);
  console.log('selftest ok');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => { console.error('ERROR', e.message); process.exit(1); });
}
