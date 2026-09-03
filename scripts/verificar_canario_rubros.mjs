/**
 * Verificación EN VIVO del arreglo del canario (COLA.md, ítem naranja de `rubros`).
 *
 * No es un gate ni corre en `npm test`: es el repro de 30 segundos que el propio ítem pide,
 * ejecutado una vez para poder MIRAR las dos fotos y decidir con los ojos, no con un grep.
 *
 *   viejo → `fullPage: true`  (agranda el viewport al alto del documento: mata el scroll que
 *                              mueve el `position: sticky`, y el carril sale en blanco)
 *   nuevo → por viewport, con `scroll-behavior: auto` inyectado y esperando a que el scroll
 *           LLEGUE de verdad (`waitForFunction`), no un `setTimeout` optimista.
 *
 * Uso: node scripts/verificar_canario_rubros.mjs
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const URL = 'https://onia.com.bo/rubros';
const OUT = '/tmp/verificar-canario';
const Y = 850;

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });

const alto = await page.evaluate(() => document.body.scrollHeight);

// --- MÉTODO NUEVO (el que quedó mergeado) ---
await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' }).catch(() => {});
await page.evaluate((t) => window.scrollTo(0, t), Y);
await page.waitForFunction((t) => Math.abs(window.scrollY - t) < 3, Y, { timeout: 5000 });
await page.waitForTimeout(900);
const scrollReal = await page.evaluate(() => window.scrollY);
await page.screenshot({ path: `${OUT}/nuevo-viewport.png` });

// --- MÉTODO VIEJO (el que mentía). Va último: fullPage deja la página en otro estado. ---
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: `${OUT}/viejo-fullpage.png`, fullPage: true, clip: { x: 0, y: Y, width: 1440, height: 620 } });

console.log(JSON.stringify({ alto, scrollPedido: Y, scrollReal, out: OUT }, null, 1));
await browser.close();
