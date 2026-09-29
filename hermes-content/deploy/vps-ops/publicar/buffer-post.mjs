#!/usr/bin/env node
// Publica en TikTok, YouTube Shorts y LinkedIn a través de Buffer (plan GRATIS: 3 canales, API
// incluida). Buffer ya está auditado por TikTok y YouTube: publica en PÚBLICO, cosa que una app
// propia no puede (ver REDES-ANALISIS.md). Corre en el VPS; la clave vive en
// /root/.config/onia-publicar/buffer.env (600): BUFFER_API_KEY=...
//   node buffer-post.mjs --listar                                   # organizaciones y canales (ids)
//   node buffer-post.mjs --campos                                   # qué metadata acepta cada red (introspección)
//   node buffer-post.mjs --canal <id> --video v.mp4 --texto t.txt [--cuando 2026-10-01T16:30:00Z] [--meta m.json]
//        (sin --publicar solo muestra lo que mandaría)  ·  --publicar  crea el post en Buffer
// La API de Buffer pide la URL del video pública y viva HASTA que se publique: el archivo queda en
// /root/publicar/public con nombre aleatorio y lo borra el cron de limpieza (48 h).
// Publicar es acción pública: solo con el OK de Sergio Urcullo sobre esa pieza.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';

const API = 'https://api.buffer.com';
const CONF = '/root/.config/onia-publicar/buffer.env';
const PUBLIC_DIR = '/root/publicar/public';
const PUBLIC_URL = 'https://onia.com.bo/hermes-assets';
const LEDGER = '/root/publicar/publicado.jsonl';

// Arma el input de createPost (formas tomadas de developers.buffer.com, 29-sep).
export function postInput({ canal, texto, url, cuando, meta, coverMs }) {
  const input = { text: texto, channelId: canal, schedulingType: 'automatic',
    mode: cuando ? 'customScheduled' : 'shareNow',
    assets: [{ video: { url, ...(coverMs ? { metadata: { thumbnailOffset: Number(coverMs) } } : {}) } }] };
  if (cuando) {
    if (Number.isNaN(Date.parse(cuando))) throw new Error(`--cuando no es fecha ISO: ${cuando}`);
    input.dueAt = new Date(cuando).toISOString();
  }
  if (meta) input.metadata = meta;
  return input;
}

async function gql(key, query, variables) {
  const r = await fetch(API, { method: 'POST', body: JSON.stringify({ query, variables }),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` } });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.errors) throw new Error(`${r.status} ${JSON.stringify(j.errors || j).slice(0, 400)}`);
  return j.data;
}

async function main() {
  const { values: a } = parseArgs({ options: {
    listar: { type: 'boolean' }, campos: { type: 'boolean' }, canal: { type: 'string' }, video: { type: 'string' },
    texto: { type: 'string' }, cuando: { type: 'string' }, meta: { type: 'string' }, 'cover-ms': { type: 'string' },
    publicar: { type: 'boolean' }, selftest: { type: 'boolean' } } });
  if (a.selftest) return selftest();
  const key = fs.readFileSync(CONF, 'utf8').match(/^BUFFER_API_KEY=(.+)$/m)?.[1]?.trim();
  if (!key) throw new Error(`falta BUFFER_API_KEY en ${CONF}`);

  if (a.listar) {
    const { account } = await gql(key, 'query { account { organizations { id name } } }');
    for (const o of account.organizations) {
      if (!/^[\w-]+$/.test(o.id)) throw new Error(`id de organización raro: ${o.id}`);
      const { channels } = await gql(key, `query { channels(input: { organizationId: "${o.id}" }) { id name displayName service isQueuePaused } }`);
      console.log(`org ${o.name} (${o.id})`);
      for (const c of channels) console.log(`  ${c.service.padEnd(10)} ${c.id}  ${c.displayName || c.name}${c.isQueuePaused ? '  [cola pausada]' : ''}`);
    }
    return;
  }
  if (a.campos) {
    // Descubre por introspección qué acepta `metadata` para cada red (no se adivinan nombres).
    const q = 'query($n: String!) { __type(name: $n) { inputFields { name type { name kind ofType { name kind } } } } }';
    const root = (await gql(key, q, { n: 'PostInputMetaData' })).__type;
    if (!root) return console.log('PostInputMetaData no existe en el esquema');
    for (const f of root.inputFields) {
      const tn = f.type.name || f.type.ofType?.name;
      const t = tn ? (await gql(key, q, { n: tn })).__type : null;
      console.log(`${f.name} (${tn}): ${t?.inputFields ? t.inputFields.map((x) => `${x.name}:${x.type.name || x.type.ofType?.name}`).join(', ') : '-'}`);
    }
    return;
  }

  const texto = fs.readFileSync(a.texto, 'utf8').trim();
  const meta = a.meta ? JSON.parse(fs.readFileSync(a.meta, 'utf8')) : undefined;
  const name = `${crypto.randomBytes(16).toString('hex')}.mp4`;
  const url = `${PUBLIC_URL}/${name}`;
  const input = postInput({ canal: a.canal, texto, url, cuando: a.cuando, meta, coverMs: a['cover-ms'] });
  if (!a.publicar) { console.log('ENSAYO (sin --publicar), se mandaría:\n' + JSON.stringify({ ...input, text: input.text.slice(0, 80) + '…' }, null, 2)); return; }

  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  fs.copyFileSync(a.video, path.join(PUBLIC_DIR, name));
  fs.chmodSync(path.join(PUBLIC_DIR, name), 0o644);
  const m = `mutation($i: CreatePostInput!) { createPost(input: $i) {
    ... on PostActionSuccess { post { id text } } ... on MutationError { message } } }`;
  const res = (await gql(key, m, { i: input })).createPost;
  if (!res.post) { fs.rmSync(path.join(PUBLIC_DIR, name), { force: true }); throw new Error(`Buffer rechazó: ${res.message}`); }
  fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
  fs.appendFileSync(LEDGER, JSON.stringify({ red: 'buffer', canal: a.canal, post: res.post.id, cuando: input.dueAt || 'ya', video: a.video, fecha: new Date().toISOString() }) + '\n');
  console.log(`EN BUFFER post ${res.post.id} (${input.dueAt || 'publica ya'}); el video queda en ${url} hasta la limpieza`);
}

function selftest() {
  const now = postInput({ canal: 'c', texto: 't', url: 'u' });
  assert.equal(now.mode, 'shareNow');
  assert.equal(now.dueAt, undefined);
  const later = postInput({ canal: 'c', texto: 't', url: 'u', cuando: '2026-10-01T16:30:00Z', coverMs: '1500' });
  assert.equal(later.mode, 'customScheduled');
  assert.equal(later.dueAt, '2026-10-01T16:30:00.000Z');
  assert.equal(later.assets[0].video.metadata.thumbnailOffset, 1500);
  assert.throws(() => postInput({ canal: 'c', texto: 't', url: 'u', cuando: 'mañana' }), /ISO/);
  console.log('selftest ok');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => { console.error('ERROR', e.message); process.exit(1); });
}
