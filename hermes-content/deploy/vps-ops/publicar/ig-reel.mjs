#!/usr/bin/env node
// Publica un Reel en Instagram por la API oficial (Instagram Login), sin Postiz.
// Pedido de Sergio Urcullo (29-sep): «que tú mismo edites y publiques, y los yaps a trial».
//
// Corre EN EL VPS: el token vive en /root/.config/onia-publicar/ig-<cuenta>.env (600) y no sale.
//   node ig-reel.mjs --cuenta sergio --video final.mp4 --caption caption.txt            # Instagram lo procesa, NO publica
//   node ig-reel.mjs ... --trial auto --publicar                                          # Trial reel (no seguidores)
//   node ig-reel.mjs ... --publicar                                                       # Reel normal
//   node ig-reel.mjs --selftest
// --trial manual: vos lo pasás a seguidores desde la app · --trial auto: Instagram lo pasa si rinde
// (graduation_strategy MANUAL / SS_PERFORMANCE, doc ig-user/media, verificada 29-sep).
// Sin --publicar el contenedor queda subido y validado, y expira solo a las 24 h: sirve de ensayo.
// Publicar es una acción pública: solo con el OK de Sergio sobre ESA pieza (CLAUDE.md).
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';

export const API = 'https://graph.instagram.com/v25.0';
// Con Instagram Login la API NO acepta subida directa (rupload es solo para Facebook Login, doc
// content-publishing 29-sep): pide video_url pública. Se sirve un rato desde onia.com.bo/hermes-assets
// (ruta Traefik ya existente -> contenedor nginx `onia-assets`, solo lectura, sin listado) con nombre
// aleatorio, y se borra apenas Instagram termina de procesarlo.
export const PUBLIC_DIR = '/root/publicar/public';
export const PUBLIC_URL = 'https://onia.com.bo/hermes-assets';
const CONF = '/root/.config/onia-publicar';
export const LEDGER = '/root/publicar/publicado.jsonl';
const TRIAL = { manual: 'MANUAL', auto: 'SS_PERFORMANCE' };

export function containerParams({ caption, trial, coverMs, videoUrl }) {
  const p = { media_type: 'REELS', video_url: videoUrl, caption };
  if (trial) {
    if (!TRIAL[trial]) throw new Error(`--trial debe ser manual|auto, no «${trial}»`);
    p.trial_params = JSON.stringify({ graduation_strategy: TRIAL[trial] });
  }
  if (coverMs) p.thumb_offset = String(coverMs);
  return p;
}

export function loadEnv(cuenta) {
  if (!/^[a-z0-9-]+$/.test(cuenta)) throw new Error('cuenta inválida');
  const env = Object.fromEntries(fs.readFileSync(path.join(CONF, `ig-${cuenta}.env`), 'utf8')
    .split('\n').filter(Boolean).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]));
  if (!env.IG_USER_ID || !env.IG_TOKEN) throw new Error(`falta IG_USER_ID/IG_TOKEN en ig-${cuenta}.env`);
  return env;
}

export async function call(url, opts = {}) {
  const r = await fetch(url, opts);
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error(`${r.status} ${JSON.stringify(j.error || j).slice(0, 300)}`);
  return j;
}

function probe(video) {
  const out = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries',
    'stream=width,height,codec_name:format=duration,size', '-of', 'json', video], { encoding: 'utf8' });
  const j = JSON.parse(out);
  const s = j.streams[0];
  return { w: s.width, h: s.height, codec: s.codec_name, dur: Number(j.format.duration), size: Number(j.format.size) };
}

async function main() {
  const { values: a } = parseArgs({ options: {
    cuenta: { type: 'string' }, video: { type: 'string' }, caption: { type: 'string' },
    trial: { type: 'string' }, 'cover-ms': { type: 'string' }, publicar: { type: 'boolean' },
    selftest: { type: 'boolean' } } });
  if (a.selftest) return selftest();
  const env = loadEnv(a.cuenta);
  const caption = fs.readFileSync(a.caption, 'utf8').trim();
  const v = probe(a.video);
  // Límites de Reels por API: 3 s a 15 min, hasta 300 MB. 9:16 es lo que no recorta.
  if (v.dur < 3 || v.dur > 900) throw new Error(`duración ${v.dur}s fuera de 3–900 s`);
  if (v.size > 300e6) throw new Error(`pesa ${(v.size / 1e6).toFixed(0)} MB (máx 300)`);
  if (Math.abs(v.w / v.h - 9 / 16) > 0.02) console.warn(`⚠ no es 9:16 (${v.w}x${v.h}): Instagram lo va a recortar`);
  if (caption.length > 2200) throw new Error('caption de más de 2.200 caracteres');

  const tmp = path.join(PUBLIC_DIR, `${crypto.randomBytes(16).toString('hex')}.mp4`);
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  fs.copyFileSync(a.video, tmp);
  fs.chmodSync(tmp, 0o644);
  let container;
  try {
    const body = new URLSearchParams({ ...containerParams({ caption, trial: a.trial, coverMs: a['cover-ms'],
      videoUrl: `${PUBLIC_URL}/${path.basename(tmp)}` }), access_token: env.IG_TOKEN });
    ({ id: container } = await call(`${API}/${env.IG_USER_ID}/media`, { method: 'POST', body }));
    console.log(`contenedor ${container} creado (${a.trial ? 'trial ' + a.trial : 'reel normal'}); ${(v.size / 1e6).toFixed(1)} MB, ${v.dur.toFixed(1)} s, ${v.w}x${v.h}`);
    const t0 = Date.now();
    for (;;) {
      const s = await call(`${API}/${container}?fields=status_code,status&access_token=${env.IG_TOKEN}`);
      if (s.status_code === 'FINISHED') break;
      if (['ERROR', 'EXPIRED'].includes(s.status_code)) throw new Error(`Instagram rechazó el video: ${s.status}`);
      if (Date.now() - t0 > 10 * 60e3) throw new Error('Instagram tardó más de 10 min en procesar');
      await new Promise((r) => setTimeout(r, 5000));
    }
  } finally {
    fs.rmSync(tmp, { force: true }); // la copia pública no queda ni si falla
  }
  console.log('Instagram procesó el video: FINISHED');
  if (!a.publicar) return console.log('NO publicado (falta --publicar). El contenedor expira solo en 24 h.');

  const { id: media } = await call(`${API}/${env.IG_USER_ID}/media_publish`, { method: 'POST',
    body: new URLSearchParams({ creation_id: container, access_token: env.IG_TOKEN }) });
  const info = await call(`${API}/${media}?fields=permalink,media_product_type,timestamp&access_token=${env.IG_TOKEN}`);
  fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
  fs.appendFileSync(LEDGER, JSON.stringify({ cuenta: a.cuenta, media, trial: a.trial || null, video: a.video, ...info }) + '\n');
  console.log(`PUBLICADO ${info.permalink}`);
}

function selftest() {
  assert.deepEqual(containerParams({ caption: 'x', videoUrl: 'u' }), { media_type: 'REELS', video_url: 'u', caption: 'x' });
  assert.equal(containerParams({ caption: 'x', trial: 'auto' }).trial_params, '{"graduation_strategy":"SS_PERFORMANCE"}');
  assert.equal(containerParams({ caption: 'x', trial: 'manual' }).trial_params, '{"graduation_strategy":"MANUAL"}');
  assert.throws(() => containerParams({ caption: 'x', trial: 'si' }), /manual\|auto/);
  console.log('selftest ok');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => { console.error('ERROR', e.message); process.exit(1); });
}
