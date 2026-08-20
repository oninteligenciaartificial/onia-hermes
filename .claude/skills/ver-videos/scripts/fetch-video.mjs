#!/usr/bin/env node
// Baja un video de TikTok / YouTube / Instagram sin abrir el navegador del usuario.
//
//   node fetch-video.mjs <url> [<url>...] [--out DIR]
//   node fetch-video.mjs --login          # una sola vez: abre Chromium para loguear IG
//
// TikTok / YouTube: yt-dlp directo, cero cookies.
// Instagram: exige sesion. Usamos un perfil de Chromium PROPIO de Playwright
// (no el Chrome del usuario) => sus cookies se leen por API, sin DPAPI ni
// App-Bound Encryption. Login manual una vez; despues es headless y automatico.

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdirSync, writeFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';

const run = promisify(execFile);

const REPO = path.resolve(import.meta.dirname, '../../../..');
const SESSION_DIR = path.join(REPO, '.hermes', 'ig-session');
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
  const { chromium } = await import('playwright');
  mkdirSync(PROFILE_DIR, { recursive: true });
  const opts = {
    headless: !headed,
    viewport: headed ? null : { width: 1280, height: 800 },
  };
  // Perfil PROPIO, aparte del Chrome del usuario: las cookies se leen por CDP,
  // asi que no importa el cifrado en disco (DPAPI / App-Bound Encryption).
  // Usa el Chrome ya instalado; si no esta, cae al Chromium de Playwright.
  const ctx = await chromium
    .launchPersistentContext(PROFILE_DIR, { ...opts, channel: 'chrome' })
    .catch(() => chromium.launchPersistentContext(PROFILE_DIR, opts));
  try {
    if (headed) {
      const page = ctx.pages()[0] || (await ctx.newPage());
      await page.goto('https://www.instagram.com/accounts/login/').catch(() => {});
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
  const fresh =
    !force && existsSync(JAR) && Date.now() - statSync(JAR).mtimeMs < JAR_MAX_AGE_MS;
  if (fresh) return JAR;

  let cookies = await readProfileCookies();
  if (!cookies.some((c) => c.name === 'sessionid' && c.value)) {
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

async function download(url, jar) {
  const out = path.join(OUT, '%(extractor_key)s-%(id)s.%(ext)s');
  const flags = [
    '-f',
    'b[height<=720]/bv[height<=720]+ba/b',
    '-o',
    out,
    '--no-playlist',
    '--print',
    'after_move:filepath',
    '--no-simulate',
    '--quiet',
    '--no-warnings',
  ];
  if (jar) flags.push('--cookies', jar, '--sleep-requests', '2');
  const { stdout } = await run('yt-dlp', [...flags, url], { maxBuffer: 1 << 24 });
  return stdout.trim().split('\n').filter(Boolean).pop();
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
  const jar = urls.some(isIG) ? await ensureJar() : null;

  const results = await Promise.allSettled(
    urls.map((u) => download(u, isIG(u) ? jar : null)),
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
