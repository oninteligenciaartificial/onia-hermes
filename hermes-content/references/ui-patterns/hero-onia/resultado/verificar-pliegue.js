#!/usr/bin/env node
/* Verifica el hero MIRÁNDOLO, no suponiendo.
 *
 * Existe por el error que le costó el primer puesto a la dirección
 * `mecanica`: se midió con la ALTURA DE PANTALLA del teléfono (812, 844…)
 * en vez del VIEWPORT del navegador, que es ~150px más bajo porque la barra
 * de direcciones ocupa lugar. En el emulador entraba todo; en un teléfono
 * de verdad la pieza se cortaba antes del CTA.
 *
 * Los tres viewports de abajo YA tienen la barra descontada. No subirlos.
 *
 * Uso (desde la raíz del repo, que es donde vive node_modules):
 *   node hermes-content/references/ui-patterns/hero-onia/resultado/verificar-pliegue.js
 *   node .../verificar-pliegue.js --capturas   (además guarda los PNG)
 */
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');
const { chromium } = require(require.resolve('playwright', { paths: [process.cwd(), __dirname] }));

const HTML = path.join(__dirname, 'index.html');
const OUT = path.join(__dirname, 'capturas');
const GUARDAR = process.argv.includes('--capturas');

// viewport REAL de navegador en teléfono (barra del browser ya descontada)
const TELEFONOS = [[390, 664], [375, 667], [360, 640]];
// lo que tiene que entrar arriba del pliegue, sí o sí
const OBLIGATORIOS = { titular: 'h1', botones: '.actions', 'línea del asistente': '.puerta' };

(async () => {
  const browser = await chromium.launch();
  let fallas = 0;
  if (GUARDAR) fs.mkdirSync(OUT, { recursive: true });

  for (const [w, h] of TELEFONOS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.goto(pathToFileURL(HTML).href, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(250);

    const m = await page.evaluate((sels) => {
      const out = {};
      for (const [nombre, sel] of Object.entries(sels)) {
        const e = document.querySelector(sel);
        out[nombre] = e ? +e.getBoundingClientRect().bottom.toFixed(1) : null;
      }
      const negro = document.querySelector('.slab--vos');
      const cs = getComputedStyle(negro);
      const alto = negro.getBoundingClientRect().height;
      const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      let cont = 0; for (const k of negro.children) cont += k.getBoundingClientRect().height;
      out.__negro = { alto: +alto.toFixed(1), hueco: +(alto - pad - cont).toFixed(1) };
      return out;
    }, OBLIGATORIOS);

    const negro = m.__negro; delete m.__negro;
    console.log(`\n${w}x${h}  ·  bloque negro ${negro.alto}px, hueco interno ${negro.hueco}px`);
    for (const [nombre, bottom] of Object.entries(m)) {
      if (bottom === null) { console.log(`  ✗ ${nombre}: NO EXISTE en el DOM`); fallas++; continue; }
      const ok = bottom <= h;
      if (!ok) fallas++;
      console.log(`  ${ok ? '✓' : '✗'} ${nombre}: termina en ${bottom}px de ${h} (${ok ? 'sobran' : 'FALTAN'} ${Math.abs(h - bottom).toFixed(1)}px)`);
    }
    if (GUARDAR) await page.screenshot({ path: path.join(OUT, `hero-v3-${w}x${h}-pliegue.png`) });
    await ctx.close();
  }

  await browser.close();
  console.log(fallas === 0
    ? '\nOK — titular, botones y la línea del asistente entran sin scrollear en los tres.'
    : `\nROTO — ${fallas} elemento(s) caen abajo del pliegue.`);
  process.exit(fallas === 0 ? 0 : 1);
})();
