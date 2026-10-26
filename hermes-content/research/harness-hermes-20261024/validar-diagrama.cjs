const { chromium } = require('C:/dev/proyectos/onia-hermes/web-factory/node_modules/playwright');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
(async () => {
  const dir = __dirname;
  const browser = await chromium.launch({ headless: true });
  const results = [];
  for (const viewport of [{width:1440,height:1100},{width:390,height:844}]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    const errors = [], requests = [];
    page.on('pageerror', e => errors.push(String(e)));
    page.on('request', r => { if (/^https?:/.test(r.url())) requests.push(r.url()); });
    await page.goto(pathToFileURL(path.join(dir, 'ESQUEMA-HARNESS.html')).href, {waitUntil:'load'});
    const geometry = await page.evaluate(() => ({
      docWidth: document.documentElement.scrollWidth,
      viewport: innerWidth,
      svgCount: document.querySelectorAll('svg').length,
      sections: [...document.querySelectorAll('h2')].map(e=>e.textContent),
      legendOutsideSvg: !document.querySelector('svg .legend'),
      brokenImages: [...document.images].filter(i=>!i.complete || !i.naturalWidth).length,
      mainTitle: document.querySelector('h1').textContent
    }));
    if (geometry.docWidth > viewport.width) throw new Error('Whole-page horizontal overflow');
    if (geometry.svgCount !== 1 || errors.length || requests.length || geometry.brokenImages) throw new Error(JSON.stringify({geometry,errors,requests}));
    const screenshot = path.join(dir, `esquema-${viewport.width}.png`);
    await page.screenshot({path:screenshot,fullPage:true});
    results.push({viewport, geometry, pageErrors:errors, externalRequests:requests, screenshot});
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(dir,'qa-diagrama.json'),JSON.stringify({scope:'local Chromium desktop/narrow viewport, not physical mobile',results},null,2));
  console.log(JSON.stringify(results));
})().catch(e=>{console.error(e);process.exit(1)});
