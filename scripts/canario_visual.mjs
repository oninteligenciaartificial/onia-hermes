#!/usr/bin/env node
/**
 * Canario visual — abre las pantallas que ve un cliente, las MIRA (captura full-page)
 * y mide peso real y tiempo real.
 *
 * Un 200 no es verificación: el login de producción mostró durante días los NOMBRES de
 * los iconos como texto, "verificado" con HTTP 200 y grep. Por eso acá se captura y se
 * pesa. La captura la mira un humano (o el agente); el script solo la produce.
 *
 * Uso:
 *   node scripts/canario_visual.mjs                 # todas las pantallas
 *   node scripts/canario_visual.mjs login-plataforma
 *
 * Escribe <out>/<pantalla>.png y <out>/<pantalla>.json (peso, ms, y qué se ve).
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PANTALLAS = [
  { nombre: 'home', url: 'https://onia.com.bo/' },
  { nombre: 'empezar', url: 'https://onia.com.bo/empezar' },
  { nombre: 'login-plataforma', url: 'https://app.onia.com.bo/login' },
  { nombre: 'login-chat', url: 'https://chat.onia.com.bo/app/login' },
  { nombre: 'panel-chatbot', url: 'https://app.onia.com.bo/settings/chatbot' },
];

const OUT = process.env.CANARIO_OUT || join(process.cwd(), '.canario-out');
const TIMEOUT = 60_000;

async function medir(browser, { nombre, url }) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  let bytes = 0;
  const errores = [];
  page.on('response', async (r) => {
    const len = Number(r.headers()['content-length']);
    if (Number.isFinite(len)) bytes += len;
    else {
      // sin content-length (chunked/comprimido): pesar el cuerpo real
      try { bytes += (await r.body()).length; } catch { /* redirect o body no accesible */ }
    }
  });
  page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text().slice(0, 200)); });

  const t0 = Date.now();
  let status = null, fallo = null;
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
    status = resp?.status() ?? null;
  } catch (e) {
    fallo = String(e.message).split('\n')[0];
  }
  const msMirable = Date.now() - t0;

  // red quieta: mejor esfuerzo — una página con polling nunca la alcanza, y eso no es un fallo
  try { await page.waitForLoadState('networkidle', { timeout: 15_000 }); } catch { /* sigue */ }
  const msTotal = Date.now() - t0;

  // Recorrer la página entera antes de capturar. Sin esto, todo lo que aparece al
  // scrollear (IntersectionObserver, opacity:0) sale como bloques de color VACÍOS y la
  // captura miente en la dirección peor: parece rota una página que está sana.
  await page.evaluate(async () => {
    const paso = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += paso) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });

  const png = join(OUT, `${nombre}.png`);
  await page.screenshot({ path: png, fullPage: true });

  const visto = {
    titulo: await page.title().catch(() => null),
    urlFinal: page.url(),
    // el texto es para DESCARTAR (p.ej. nombres de iconos crudos), nunca para confirmar
    texto: (await page.evaluate(() => document.body?.innerText || '').catch(() => '')).replace(/\s+/g, ' ').trim().slice(0, 1200),
  };

  await ctx.close();
  const datos = { nombre, url, status, fallo, bytes, msMirable, msTotal, erroresConsola: errores.slice(0, 10), visto };
  writeFileSync(join(OUT, `${nombre}.json`), JSON.stringify(datos, null, 2));
  return datos;
}

const filtro = process.argv.slice(2);
const lista = filtro.length ? PANTALLAS.filter((p) => filtro.includes(p.nombre)) : PANTALLAS;
if (!lista.length) { console.error('sin pantallas que coincidan:', filtro.join(', ')); process.exit(1); }

mkdirSync(OUT, { recursive: true });
// Como root (el VPS) Chromium NO arranca con su sandbox: falla en la primera pantalla.
// En Windows/usuario normal se deja el sandbox puesto, que es lo correcto.
const esRoot = process.getuid?.() === 0;
const browser = await chromium.launch(
  esRoot ? { args: ['--no-sandbox', '--disable-dev-shm-usage'] } : {},
);
for (const p of lista) {
  const d = await medir(browser, p);
  console.log(`${d.nombre}\tstatus=${d.status ?? 'X'}\t${(d.bytes / 1024).toFixed(0)} KB\t${d.msMirable} ms\t${d.fallo ?? ''}`);
}
await browser.close();
console.log(`\ncapturas en ${OUT}`);
