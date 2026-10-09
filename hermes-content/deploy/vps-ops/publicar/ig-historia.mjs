#!/usr/bin/env node
// Publica una HISTORIA de Instagram (foto vertical) por la API oficial, con el mismo token, la misma carpeta pública
// y el mismo registro que ig-reel.mjs e ig-carrusel.mjs. Pedido de Sergio Urcullo (8-oct): «subime historias con las
// fotos mías que me vaya sacando».
//   node ig-historia.mjs --cuenta sergio --imagen /root/publicar/historias/h01.png            # ensayo: NO publica
//   node ig-historia.mjs ... --publicar
// La imagen se pasa a JPEG (la API no acepta PNG) y se sirve un rato desde onia.com.bo/hermes-assets.
// LÍMITE de la API: no admite stickers (link, encuesta, pregunta, música). Lo que necesite un sticker lo hace Sergio a
// mano; acá solo va foto + el texto que ya trae pintado.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import { API, PUBLIC_DIR, PUBLIC_URL, LEDGER, loadEnv, call } from './ig-reel.mjs';

export const IMAGEN = /\.(png|jpe?g)$/i;

export function storyParams({ url }) {
  if (!/^https:\/\//.test(url)) throw new Error('la historia necesita una URL https pública');
  return { media_type: 'STORIES', image_url: url };
}

async function esperar(id, token) {
  const t0 = Date.now();
  for (;;) {
    const s = await call(`${API}/${id}?fields=status_code,status&access_token=${token}`);
    if (s.status_code === 'FINISHED') return;
    if (['ERROR', 'EXPIRED'].includes(s.status_code)) throw new Error(`Instagram rechazó ${id}: ${s.status}`);
    if (Date.now() - t0 > 5 * 60e3) throw new Error(`Instagram tardó más de 5 min con ${id}`);
    await new Promise((r) => setTimeout(r, 3000));
  }
}

async function main() {
  const { values: a } = parseArgs({ options: { cuenta: { type: 'string' }, imagen: { type: 'string' },
    publicar: { type: 'boolean' }, selftest: { type: 'boolean' } } });
  if (a.selftest) return selftest();
  if (!a.imagen || !IMAGEN.test(a.imagen)) throw new Error('falta --imagen (png o jpg)');
  const env = loadEnv(a.cuenta);

  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  const tmp = path.join(PUBLIC_DIR, `${crypto.randomBytes(16).toString('hex')}.jpg`);
  let historia;
  try {
    // 1080x1920, 9:16. Si la foto viene con otra proporción se recorta al centro en vez de deformarse.
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', a.imagen, '-vf',
      'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920', '-q:v', '2', tmp]);
    fs.chmodSync(tmp, 0o644);
    ({ id: historia } = await call(`${API}/${env.IG_USER_ID}/media`, { method: 'POST', body: new URLSearchParams({
      ...storyParams({ url: `${PUBLIC_URL}/${path.basename(tmp)}` }), access_token: env.IG_TOKEN }) }));
    await esperar(historia, env.IG_TOKEN);
  } finally {
    fs.rmSync(tmp, { force: true });
  }
  console.log(`historia ${historia} lista en Instagram`);
  if (!a.publicar) return console.log('NO publicada (falta --publicar). El contenedor expira solo en 24 h.');

  const { id: media } = await call(`${API}/${env.IG_USER_ID}/media_publish`, { method: 'POST',
    body: new URLSearchParams({ creation_id: historia, access_token: env.IG_TOKEN }) });
  const info = await call(`${API}/${media}?fields=media_product_type,timestamp&access_token=${env.IG_TOKEN}`);
  fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
  fs.appendFileSync(LEDGER, JSON.stringify({ cuenta: a.cuenta, media, tipo: 'historia', imagen: a.imagen, ...info }) + '\n');
  console.log(`PUBLICADA historia ${media} (${info.timestamp})`);
}

function selftest() {
  assert.deepEqual(storyParams({ url: 'https://x.test/a.jpg' }), { media_type: 'STORIES', image_url: 'https://x.test/a.jpg' });
  assert.throws(() => storyParams({ url: 'http://x.test/a.jpg' }), /https/);
  assert.ok(IMAGEN.test('h.PNG') && IMAGEN.test('h.jpeg') && !IMAGEN.test('h.mp4'));
  console.log('selftest ok');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => { console.error('ERROR', e.message); process.exit(1); });
}
