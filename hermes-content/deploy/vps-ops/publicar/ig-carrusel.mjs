#!/usr/bin/env node
// Publica un carrusel de Instagram (2 a 10 láminas) por la API oficial, con el mismo token, la misma
// carpeta pública y el mismo registro que ig-reel.mjs. Pedido de Sergio Urcullo (29-sep): un carrusel
// por día, agendado con agendar-publicacion.sh.
//   node ig-carrusel.mjs --cuenta sergio --dir /root/publicar/k04 --caption caption.txt   # ensayo: NO publica
//   node ig-carrusel.mjs ... --publicar
// Toma de --dir las láminas slide-01.png, slide-02.png… en orden (ignora la hoja de contacto), las
// pasa a JPEG porque la API no acepta PNG, y las sirve un rato desde onia.com.bo/hermes-assets.
// Publicar es una acción pública: solo con el OK de Sergio sobre ESA pieza (CLAUDE.md).
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';
import { API, PUBLIC_DIR, PUBLIC_URL, LEDGER, loadEnv, call } from './ig-reel.mjs';

export const LAMINA = /^slide-\d+\.(png|jpe?g)$/i;

export function carouselParams({ caption, children }) {
  if (children.length < 2 || children.length > 10) throw new Error(`un carrusel lleva de 2 a 10 láminas, no ${children.length}`);
  return { media_type: 'CAROUSEL', children: children.join(','), caption };
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
  const { values: a } = parseArgs({ options: { cuenta: { type: 'string' }, dir: { type: 'string' },
    caption: { type: 'string' }, publicar: { type: 'boolean' }, selftest: { type: 'boolean' } } });
  if (a.selftest) return selftest();
  const env = loadEnv(a.cuenta);
  const caption = fs.readFileSync(a.caption, 'utf8').trim();
  if (caption.length > 2200) throw new Error('caption de más de 2.200 caracteres');
  const laminas = fs.readdirSync(a.dir).filter((f) => LAMINA.test(f)).sort();
  carouselParams({ caption, children: laminas }); // valida la cantidad antes de subir nada

  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  const tmps = [];
  let carrusel;
  try {
    const hijos = [];
    for (const f of laminas) {
      const tmp = path.join(PUBLIC_DIR, `${crypto.randomBytes(16).toString('hex')}.jpg`);
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', path.join(a.dir, f), '-q:v', '2', tmp]);
      fs.chmodSync(tmp, 0o644);
      tmps.push(tmp);
      const { id } = await call(`${API}/${env.IG_USER_ID}/media`, { method: 'POST', body: new URLSearchParams({
        image_url: `${PUBLIC_URL}/${path.basename(tmp)}`, is_carousel_item: 'true', access_token: env.IG_TOKEN }) });
      hijos.push(id);
    }
    for (const id of hijos) await esperar(id, env.IG_TOKEN);
    ({ id: carrusel } = await call(`${API}/${env.IG_USER_ID}/media`, { method: 'POST',
      body: new URLSearchParams({ ...carouselParams({ caption, children: hijos }), access_token: env.IG_TOKEN }) }));
    await esperar(carrusel, env.IG_TOKEN);
  } finally {
    for (const t of tmps) fs.rmSync(t, { force: true }); // las copias públicas no quedan ni si falla
  }
  console.log(`carrusel ${carrusel} listo en Instagram: ${laminas.length} láminas`);
  if (!a.publicar) return console.log('NO publicado (falta --publicar). El contenedor expira solo en 24 h.');

  const { id: media } = await call(`${API}/${env.IG_USER_ID}/media_publish`, { method: 'POST',
    body: new URLSearchParams({ creation_id: carrusel, access_token: env.IG_TOKEN }) });
  const info = await call(`${API}/${media}?fields=permalink,media_product_type,timestamp&access_token=${env.IG_TOKEN}`);
  fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
  fs.appendFileSync(LEDGER, JSON.stringify({ cuenta: a.cuenta, media, tipo: 'carrusel', dir: a.dir, ...info }) + '\n');
  console.log(`PUBLICADO ${info.permalink}`);
}

function selftest() {
  assert.deepEqual(carouselParams({ caption: 'c', children: ['1', '2'] }), { media_type: 'CAROUSEL', children: '1,2', caption: 'c' });
  assert.throws(() => carouselParams({ caption: 'c', children: ['1'] }), /de 2 a 10/);
  assert.throws(() => carouselParams({ caption: 'c', children: Array(11).fill('x') }), /de 2 a 10/);
  assert.ok(LAMINA.test('slide-01.png') && LAMINA.test('slide-12.JPG'));
  assert.ok(!LAMINA.test('_contactsheet.png') && !LAMINA.test('brief.json'));
  console.log('selftest ok');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => { console.error('ERROR', e.message); process.exit(1); });
}
