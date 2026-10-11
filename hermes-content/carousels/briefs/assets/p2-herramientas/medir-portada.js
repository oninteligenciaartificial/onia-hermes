const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const path = require('path');
// Uso: PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node medir-portada.js <brief.json> <n de lámina> <html-temporal>
// Mide en el DOM, ya con la fuente cargada, las líneas del título (.wl) y cada marca de una lámina `logos`/`ensayo`.
process.chdir('/home/user/onia-hermes');
const { referentesHtml } = require('/home/user/onia-hermes/scripts/carousel_render');
const brief = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const idx = parseInt(process.argv[3], 10) - 1;
const html = referentesHtml({ ...brief.slides[idx], cta: brief.slides[idx].cta || '' }, idx, brief.slides.length, 'sergio', { serie: brief.serie, theme: '', fonts: '' });
const f = process.argv[4];
fs.writeFileSync(f, html);
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  await page.goto('file://' + f, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => {
    const rect = (e) => { const b = e.getBoundingClientRect(); return { x0: +b.left.toFixed(1), x1: +b.right.toFixed(1), y0: +b.top.toFixed(1), y1: +b.bottom.toFixed(1), w: +b.width.toFixed(1) }; };
    const out = { fontSizeH1: getComputedStyle(document.querySelector('.word,.t,.c-ensayo h2') || document.body).fontSize };
    out.lineas = [...document.querySelectorAll('.wl')].map(rect);
    out.marcas = [...document.querySelectorAll('.logo figcaption')].map((e) => ({ t: e.textContent, ...rect(e) }));
    const h2 = document.querySelector('.c-ensayo h2'); if (h2) { const rg = document.createRange(); rg.selectNodeContents(h2); out.h2 = { ...rect(h2), texto: { x0: +rg.getBoundingClientRect().left.toFixed(1), x1: +rg.getBoundingClientRect().right.toFixed(1) } }; }
    out.vw = document.documentElement.clientWidth;
    return out;
  });
  console.log(JSON.stringify(r, null, 1));
  await browser.close();
})();
