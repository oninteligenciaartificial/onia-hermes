#!/usr/bin/env node
// Bajar las IMAGENES de un post/carrusel de Instagram (lo que yt-dlp no puede).
//
//   node ig-carousel.mjs <url-o-shortcode> [...] --out DIR
//
// yt-dlp falla en carruseles de imagenes con "No video formats found": solo sabe de video.
// Pero un carrusel suele ser el formato MAS denso en informacion (una idea por lamina),
// asi que perderlo es perder lo mejor. La API interna de IG devuelve `carousel_media` con
// todas las laminas; se leen con vision, sin depender de ningun modelo externo.
//
// Usa el mismo cookies.txt que fetch-video.mjs (.hermes/ig-session/cookies.txt).
// Si un slide es video, guarda el mp4 y lo avisa.

import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Tambien es libreria: video-intake.mjs importa shortcodeOf/cookieHeader/fetchMediaItem
// para bajar el caption de un reel. Sin este guard, importar ejecutaba el CLI entero.
const esMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

const REPO = path.resolve(import.meta.dirname, '../../../..');
const JAR = path.join(REPO, '.hermes', 'ig-session', 'cookies.txt');
const IG_APP_ID = '936619743392459'; // app id publico del IG web

const args = process.argv.slice(2);
const outIdx = args.indexOf('--out');
const OUT = outIdx === -1 ? process.cwd() : args[outIdx + 1];
const inputs = args.filter((a, i) => !a.startsWith('--') && !(outIdx !== -1 && i === outIdx + 1));

/** Shortcode de Instagram -> media_id (base64 propio de IG, 64 simbolos). */
export function shortcodeToMediaId(shortcode) {
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let n = 0n;
  for (const ch of shortcode) n = n * 64n + BigInt(ALPHABET.indexOf(ch));
  return n.toString();
}

export const shortcodeOf = (s) => s.match(/\/(?:p|reel|tv)\/([^/?#]+)/)?.[1] || s;

// Solo estas hacen falta para autenticar el GET. Mandar el jar entero rompe: la cookie
// `rur` trae comillas y escapes \054 que undici rechaza como header invalido.
const NECESARIAS = new Set(['sessionid', 'csrftoken', 'ds_user_id', 'mid', 'ig_did']);

/** cookies.txt (Netscape) -> header Cookie con lo minimo de instagram.com. */
export function cookieHeader(jar = JAR) {
  if (!existsSync(jar)) throw new Error(`no hay cookies: ${jar}\ncorre: node fetch-video.mjs --login`);
  const pares = readFileSync(jar, 'utf8')
    // \r?\n: en Windows el jar queda con CRLF y el \r se cuela en el valor de la ultima
    // columna -> "invalid header value" al armar el Cookie.
    .split(/\r?\n/)
    .filter((l) => (l.trim() && !l.startsWith('#')) || l.startsWith('#HttpOnly_'))
    .map((l) => l.replace(/^#HttpOnly_/, '').split('\t'))
    .filter((f) => f.length >= 7 && /instagram\.com$/.test(f[0].replace(/^\./, '')))
    .filter((f) => NECESARIAS.has(f[5]))
    .map((f) => `${f[5]}=${f[6]}`);
  if (!pares.some((p) => p.startsWith('sessionid='))) throw new Error('el jar no tiene sessionid');
  return pares.join('; ');
}

/** La candidata de mayor resolucion. */
const best = (node) =>
  (node.image_versions2?.candidates || []).sort((a, b) => b.width * b.height - a.width * a.height)[0];

/** El item completo de la API de IG (trae caption, slides, video_versions...). */
export async function fetchMediaItem(input, cookie) {
  const sc = shortcodeOf(input);
  const res = await fetch(`https://www.instagram.com/api/v1/media/${shortcodeToMediaId(sc)}/info/`, {
    headers: { cookie, 'x-ig-app-id': IG_APP_ID, 'user-agent': 'Mozilla/5.0' },
  });
  if (!res.ok) throw new Error(`API ${res.status} (sesion caida, media privado o borrado)`);

  const item = (await res.json()).items?.[0];
  if (!item) throw new Error('la API no devolvio item');
  return item;
}

async function bajar(input, cookie) {
  const sc = shortcodeOf(input);
  const item = await fetchMediaItem(sc, cookie);

  const slides = item.carousel_media || [item];
  const dir = path.join(OUT, sc);
  mkdirSync(dir, { recursive: true });

  const escritos = [];
  for (const [i, s] of slides.entries()) {
    const n = String(i + 1).padStart(2, '0');
    const video = s.video_versions?.[0]?.url;
    const url = video || best(s)?.url;
    if (!url) continue;
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    const f = path.join(dir, `s${n}.${video ? 'mp4' : 'jpg'}`);
    writeFileSync(f, buf);
    escritos.push(f);
  }

  // El caption suele traer la mitad del contenido de un carrusel: guardarlo siempre.
  const caption = item.caption?.text?.trim();
  if (caption) writeFileSync(path.join(dir, 'caption.txt'), caption + '\n');

  return { sc, dir, slides: escritos.length, tipo: item.carousel_media ? 'carrusel' : 'simple', caption: !!caption };
}

if (esMain) {
  if (!inputs.length) {
    console.error('uso: node ig-carousel.mjs <url|shortcode> [...] --out DIR');
    process.exit(1);
  }
  const cookie = cookieHeader();
  mkdirSync(OUT, { recursive: true });

  const res = await Promise.allSettled(inputs.map((u) => bajar(u, cookie)));
  let fail = 0;
  res.forEach((r, i) => {
    if (r.status === 'fulfilled')
      console.log(`OK\t${r.value.sc}\t${r.value.tipo}\t${r.value.slides} laminas\tcaption:${r.value.caption ? 'si' : 'no'}\t${r.value.dir}`);
    else {
      fail++;
      console.error(`FALLO\t${inputs[i]}\t${r.reason.message}`);
    }
  });
  process.exit(fail === inputs.length ? 1 : 0);
}
