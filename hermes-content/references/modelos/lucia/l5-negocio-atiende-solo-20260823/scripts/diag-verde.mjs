import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('https://onia.com.bo/', { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(10000);
// elemento en el centro del bloque verde
const info = await p.evaluate(() => {
  const els = document.elementsFromPoint(1065, 560).slice(0, 5);
  return els.map(e => {
    const cs = getComputedStyle(e);
    return { tag: e.tagName, id: e.id, cls: (e.className||'').toString().slice(0,80),
             bg: cs.backgroundColor, w: e.getBoundingClientRect().width|0, h: e.getBoundingClientRect().height|0,
             src: e.getAttribute('src') || e.getAttribute('poster') || '', txt: (e.textContent||'').trim().slice(0,60),
             op: cs.opacity, tr: cs.transform };
  });
});
console.log(JSON.stringify(info, null, 1));
await b.close();
