#!/usr/bin/env node
// Baja un video de TikTok / YouTube / Instagram sin abrir el navegador del usuario.
//
//   node fetch-video.mjs <url> [<url>...] [--out DIR]
//   node fetch-video.mjs --login          # una sola vez: abre Chromium para loguear IG
//
// TikTok / YouTube: yt-dlp directo, cero cookies.
// Instagram (medido el 19-oct-2026): los reels publicos bajan SIN cookies. Orden:
// sin cookies -> --impersonate chrome -> recien al final la sesion guardada.
// La sesion es un perfil de Chromium PROPIO de Playwright (no el Chrome del usuario)
// => sus cookies se leen por API, sin DPAPI ni App-Bound Encryption.
// Siempre deja <id>.info.json al lado del mp4 (caption, likes, comentarios), sin cookies.

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdirSync, writeFileSync, readFileSync, existsSync, statSync, copyFileSync, readdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { IG_SESSION as SESSION_DIR } from './ig-session.mjs';

const run = promisify(execFile);

const PROFILE_DIR = path.join(SESSION_DIR, 'profile');
const JAR = path.join(SESSION_DIR, 'cookies.txt');
const JAR_MAX_AGE_MS = 12 * 60 * 60 * 1000;

const args = process.argv.slice(2);
const outIdx = args.indexOf('--out');
const OUT = outIdx === -1 ? process.cwd() : args[outIdx + 1];
const urls = args.filter(
  (a, i) => !a.startsWith('--') && !(outIdx !== -1 && i === outIdx + 1),
);
const wantLogin = args.includes('--login');

const isIG = (u) => /(?:^|\/\/)(?:www\.)?instagram\.com\//i.test(u);

/** Playwright cookie -> linea Netscape que yt-dlp acepta. */
function toNetscape(c) {
  const httpOnly = c.httpOnly ? '#HttpOnly_' : '';
  const includeSub = c.domain.startsWith('.') ? 'TRUE' : 'FALSE';
  const expires = c.expires && c.expires > 0 ? Math.floor(c.expires) : 0;
  return [
    httpOnly + c.domain,
    includeSub,
    c.path || '/',
    c.secure ? 'TRUE' : 'FALSE',
    expires,
    c.name,
    c.value,
  ].join('\t');
}

async function readProfileCookies({ headed = false } = {}) {
  const { chromium } = await import('playwright').catch(() => {
    throw new Error(
      'Playwright no esta instalado: no se puede leer ni renovar la sesion de IG ' +
        '(instalarlo pide OK de Sergio Urcullo).',
    );
  });
  mkdirSync(PROFILE_DIR, { recursive: true });
  const opts = {
    headless: !headed,
    viewport: headed ? null : { width: 1280, height: 800 },
    // Con el flag --enable-automation puesto, reCAPTCHA se niega a validar y el
    // login queda trabado en el captcha (medido 2026-09-17).
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'],
  };
  // Perfil PROPIO, aparte del Chrome del usuario: las cookies se leen por CDP,
  // asi que no importa el cifrado en disco (DPAPI / App-Bound Encryption).
  // Usa el Chrome ya instalado; si no esta, cae al Chromium de Playwright.
  const ctx = await chromium
    .launchPersistentContext(PROFILE_DIR, { ...opts, channel: 'chrome' })
    .catch(() => chromium.launchPersistentContext(PROFILE_DIR, opts));
  try {
    if (headed) {
      // Un sessionid REVOCADO por el servidor sigue viviendo en el perfil y el
      // poll de abajo lo tomaria por login exitoso. Limpiar antes, siempre.
      await ctx.clearCookies();
      const page = ctx.pages()[0] || (await ctx.newPage());
      await page.goto('https://www.instagram.com/').catch(() => {});
      process.stderr.write(
        'Login de Instagram: entra en la ventana que se abrio. Espero hasta 5 min...\n',
      );
      const deadline = Date.now() + 5 * 60_000;
      while (Date.now() < deadline) {
        const cookies = await ctx.cookies();
        if (cookies.some((c) => c.name === 'sessionid' && c.value)) {
          process.stderr.write('Sesion detectada. Guardando cookies.\n');
          // dar un respiro para que IG termine de setear cookies asociadas
          await new Promise((r) => setTimeout(r, 3000));
          return await ctx.cookies();
        }
        await new Promise((r) => setTimeout(r, 2000));
      }
      throw new Error('Timeout esperando el login de Instagram.');
    }
    return await ctx.cookies();
  } finally {
    await ctx.close();
  }
}

async function ensureJar({ force = false } = {}) {
  const exists = existsSync(JAR);
  if (!force && exists && Date.now() - statSync(JAR).mtimeMs < JAR_MAX_AGE_MS) return JAR;

  // Con --login se abre la ventana SIEMPRE: un sessionid presente no prueba nada
  // (IG revoca sesiones server-side y el cookie queda en el perfil como zombie;
  // el 2026-09-17 eso dejo el "--login" saliendo sin abrir ventana).
  let cookies = null;
  if (!force) {
    try {
      cookies = await readProfileCookies();
    } catch (e) {
      // Sin Playwright (o perfil trabado) no se renueva, pero el jar viejo puede seguir vivo.
      if (!exists) throw e;
      process.stderr.write(`${e.message}\nSe prueba con el cookies.txt viejo.\n`);
      return JAR;
    }
  }
  if (!cookies?.some((c) => c.name === 'sessionid' && c.value)) {
    if (!force) {
      throw new Error(
        'No hay sesion de Instagram en el perfil de Playwright.\n' +
          'Corre una vez:  node fetch-video.mjs --login',
      );
    }
    cookies = await readProfileCookies({ headed: true });
  }

  mkdirSync(SESSION_DIR, { recursive: true });
  const body = ['# Netscape HTTP Cookie File', ...cookies.map(toNetscape), ''].join('\n');
  writeFileSync(JAR, body, { mode: 0o600 });
  process.stderr.write(`cookies -> ${JAR} (${cookies.length})\n`);
  return JAR;
}

let jarPromise; // una sola lectura del perfil aunque bajen varios links de IG en paralelo
const getJar = () => (jarPromise ??= ensureJar());

function cookieFlags(jar, tmp) {
  // Copia descartable: yt-dlp REESCRIBE el archivo de cookies al salir, y en un
  // intento fallido guarda el estado post-rechazo SIN sessionid (IG lo borra via
  // Set-Cookie). Asi nos vacio el jar dos veces el 2026-09-17.
  // Una copia por llamada: con varios links en paralelo se pisaban la misma.
  copyFileSync(jar, tmp);
  return ['--cookies', tmp, '--sleep-requests', '2'];
}

// Con --cookies, yt-dlp copia la cookie (sessionid incluido) en cada formato del .info.json,
// y ese archivo termina citado en fichas del repo. El campo se borra siempre.
// Se limpia la carpeta entera y SIEMPRE (finally): yt-dlp escribe el .info.json antes de bajar el
// video, asi que un intento con sesion que fallaba a mitad dejaba el sessionid escrito (19-oct-2026).
function scrubInfoJsons(dir) {
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.info.json'))) {
    try {
      const file = path.join(dir, f);
      const data = JSON.parse(readFileSync(file, 'utf8'));
      writeFileSync(file, JSON.stringify(data, (k, v) => (k === 'cookies' ? undefined : v)));
    } catch { /* un info.json a medio escribir no convierte una bajada buena en fallo */ }
  }
}

async function download(url, extra = []) {
  const out = path.join(OUT, '%(extractor_key)s-%(id)s.%(ext)s');
  const flags = [
    // -S y no -f: con -f "b[height<=720]" los reels salian 360x640 (19-oct-2026).
    // ext:mp4:m4a mantiene mp4 en YouTube (si no, mezcla webm); vcodec:h264 evita AV1, que
    // editor-videos y el Chromium headless decodifican mal. res va primero: IG sigue en 720p.
    '-S',
    'res:720,vcodec:h264,ext:mp4:m4a',
    '--write-info-json',
    '-o',
    out,
    '--no-playlist',
    '--print',
    'after_move:filepath',
    '--no-simulate',
    '--quiet',
    '--no-warnings',
    ...extra,
  ];
  try {
    const { stdout } = await run('yt-dlp', [...flags, url], { maxBuffer: 1 << 24 });
    return stdout.trim().split('\n').filter(Boolean).pop();
  } finally {
    scrubInfoJsons(OUT);
  }
}

const lastLine = (e) => String(e.stderr || e.message).trim().split('\n').filter(Boolean).pop();

async function downloadIG(url) {
  const fallos = [];
  for (const [via, extra] of [
    ['sin cookies', []],
    ['--impersonate chrome', ['--impersonate', 'chrome']],
  ]) {
    try {
      return await download(url, extra);
    } catch (e) {
      fallos.push(`${via}: ${lastLine(e)}`);
    }
  }
  const tmp = path.join(SESSION_DIR, `cookies.${process.pid}.${Math.random().toString(36).slice(2)}.ytdlp`);
  try {
    return await download(url, cookieFlags(await getJar(), tmp));
  } catch (e) {
    fallos.push(`sesion guardada: ${lastLine(e)}`);
  } finally {
    rmSync(tmp, { force: true });
  }
  throw new Error(fallos.join('\n  '));
}

const main = async () => {
  if (wantLogin) {
    await ensureJar({ force: true });
    return;
  }
  if (!urls.length) {
    console.error('uso: node fetch-video.mjs <url> [...] [--out DIR]  |  --login');
    process.exit(1);
  }
  mkdirSync(OUT, { recursive: true });

  const results = await Promise.allSettled(
    urls.map((u) => (isIG(u) ? downloadIG(u) : download(u))),
  );
  let failed = 0;
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') console.log(`${urls[i]}\t${r.value}`);
    else {
      failed++;
      console.error(`FALLO ${urls[i]}: ${String(r.reason.stderr || r.reason.message).trim()}`);
    }
  });
  process.exit(failed ? 1 : 0);
};

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
