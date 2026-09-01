import { chromium } from 'playwright';
import fs from 'fs';

const OUT = 'C:/dev/capturas-lety';
fs.mkdirSync(OUT, { recursive: true });

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();

// --- network log ---
const net = [];
p.on('response', async (res) => {
  try {
    const req = res.request();
    const t = req.resourceType();
    if (!['image', 'media', 'font', 'script', 'stylesheet'].includes(t)) return;
    const h = res.headers();
    net.push({ type: t, status: res.status(), url: res.url().slice(0, 160), len: h['content-length'] || '?', ct: h['content-type'] || '?' });
  } catch (e) {}
});

await p.goto('https://lety.ai', { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(3500);

await p.screenshot({ path: `${OUT}/01-hero-1440.png` });

// ---------- FIND HERO VISUAL ----------
const HERO_FINDER = () => {
  const h1 = document.querySelector('h1');
  const hero = h1.closest('section') || h1.parentElement.parentElement;
  // the visual = biggest element in hero that is to the right of h1 and has a radius
  const hr = h1.getBoundingClientRect();
  const cands = [...hero.querySelectorAll('div')].filter(d => {
    const r = d.getBoundingClientRect();
    const cs = getComputedStyle(d);
    return r.left > hr.right - 60 && r.width > 250 && r.height > 180 && cs.borderRadius !== '0px';
  }).sort((a, b2) => (b2.getBoundingClientRect().width * b2.getBoundingClientRect().height) - (a.getBoundingClientRect().width * a.getBoundingClientRect().height));
  return cands[0] || null;
};

const cardBox = await p.evaluate(`(${HERO_FINDER})() && (()=>{const d=(${HERO_FINDER})();const r=d.getBoundingClientRect();return{x:r.left,y:r.top,width:r.width,height:r.height}})()`);
if (cardBox) await p.screenshot({ path: `${OUT}/02-hero-visual-card.png`, clip: cardBox });

// ---------- TECHNICAL TEARDOWN ----------
const teardown = await p.evaluate(`(() => {
  const finder = ${HERO_FINDER};
  const card = finder();
  const h1 = document.querySelector('h1');
  const hero = h1.closest('section') || h1.parentElement.parentElement;
  const hcs = getComputedStyle(hero);

  const nodeCount = card ? card.querySelectorAll('*').length : 0;
  const tagTally = {};
  if (card) card.querySelectorAll('*').forEach(e => { tagTally[e.tagName] = (tagTally[e.tagName]||0)+1; });

  // animated elements inside the hero
  const animated = [];
  hero.querySelectorAll('*').forEach(e => {
    const cs = getComputedStyle(e);
    if ((cs.animationName && cs.animationName !== 'none') || (cs.transitionDuration && cs.transitionDuration !== '0s')) {
      animated.push({
        tag: e.tagName,
        cls: (e.className && e.className.baseVal !== undefined ? e.className.baseVal : e.className || '').toString().slice(0,70),
        anim: cs.animationName, dur: cs.animationDuration, iter: cs.animationIterationCount,
        timing: cs.animationTimingFunction, trans: cs.transitionProperty.slice(0,60), transDur: cs.transitionDuration
      });
    }
  });

  // collect @keyframes names defined in the page's own stylesheets
  const kf = [];
  for (const ss of document.styleSheets) {
    let rules; try { rules = ss.cssRules; } catch(e) { continue; }
    if (!rules) continue;
    for (const r of rules) {
      if (r.type === CSSRule.KEYFRAMES_RULE || r.constructor.name === 'CSSKeyframesRule') {
        kf.push({ name: r.name, text: r.cssText.slice(0, 400) });
      }
    }
  }

  return {
    h1Text: h1.innerText,
    h1FontSize: getComputedStyle(h1).fontSize,
    h1FontFamily: getComputedStyle(h1).fontFamily,
    h1Weight: getComputedStyle(h1).fontWeight,
    h1LineHeight: getComputedStyle(h1).lineHeight,
    h1Letter: getComputedStyle(h1).letterSpacing,
    heroBgColor: hcs.backgroundColor,
    heroBgImage: hcs.backgroundImage.slice(0, 400),
    bodyBg: getComputedStyle(document.body).backgroundColor,
    bodyFont: getComputedStyle(document.body).fontFamily,
    card: card ? {
      cls: (card.className||'').toString().slice(0,120),
      rect: (()=>{const r=card.getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height),left:Math.round(r.left),right:Math.round(r.right),top:Math.round(r.top),bottom:Math.round(r.bottom)};})(),
      bg: getComputedStyle(card).backgroundColor,
      radius: getComputedStyle(card).borderRadius,
      border: getComputedStyle(card).borderTopWidth+' '+getComputedStyle(card).borderTopStyle+' '+getComputedStyle(card).borderTopColor,
      shadow: getComputedStyle(card).boxShadow,
      transform: getComputedStyle(card).transform,
      overflow: getComputedStyle(card).overflow,
      backdrop: getComputedStyle(card).backdropFilter,
      descendants: nodeCount,
      tagTally: tagTally,
      imgs: card.querySelectorAll('img').length,
      videos: card.querySelectorAll('video').length,
      svgs: card.querySelectorAll('svg').length,
      canvas: card.querySelectorAll('canvas').length,
      html: card.outerHTML
    } : null,
    animatedInHero: animated.slice(0, 25),
    keyframes: kf.slice(0, 30),
    totalVideosPage: document.querySelectorAll('video').length,
    totalCanvasPage: document.querySelectorAll('canvas').length,
    scriptSrcs: [...document.querySelectorAll('script[src]')].map(s=>s.src.slice(0,140)),
    heroButtons: [...hero.querySelectorAll('a,button')].map(a=>({txt:a.innerText.trim().slice(0,50),href:a.getAttribute('href')}))
  };
})()`);

fs.writeFileSync(`${OUT}/hero-teardown.json`, JSON.stringify(teardown, null, 2), 'utf8');

// ---------- ANIMATION SAMPLING ----------
const samples = [];
for (let i = 0; i < 14; i++) {
  const t = await p.evaluate(`(() => { const c=(${HERO_FINDER})(); return c ? c.innerText.replace(/\\n+/g,' | ') : 'NONE'; })()`);
  samples.push(t);
  await p.waitForTimeout(800);
}
fs.writeFileSync(`${OUT}/hero-animacion-muestras.txt`, [...new Set(samples)].join('\n\n---\n\n'), 'utf8');

await p.screenshot({ path: `${OUT}/03-home-full.png`, fullPage: true });

// mobile
const pm = await ctx.newPage();
await pm.setViewportSize({ width: 390, height: 844 });
await pm.goto('https://lety.ai', { waitUntil: 'networkidle', timeout: 60000 });
await pm.waitForTimeout(3000);
await pm.screenshot({ path: `${OUT}/04-hero-mobile-390.png` });
await pm.close();

// pricing
await p.goto('https://lety.ai/pricing/', { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(2500);
await p.screenshot({ path: `${OUT}/05-pricing.png`, fullPage: true });
const pricing = await p.evaluate(() => document.body.innerText.slice(0, 2500));
fs.writeFileSync(`${OUT}/pricing-texto.txt`, pricing, 'utf8');

fs.writeFileSync(`${OUT}/network.json`, JSON.stringify(net, null, 2), 'utf8');

console.log('IMGS/VIDEOS EN CARD:', JSON.stringify({ imgs: teardown.card?.imgs, videos: teardown.card?.videos, svgs: teardown.card?.svgs, canvas: teardown.card?.canvas, descendants: teardown.card?.descendants }));
console.log('CARD RECT:', JSON.stringify(teardown.card?.rect));
console.log('CARD STYLE:', JSON.stringify({ bg: teardown.card?.bg, radius: teardown.card?.radius, border: teardown.card?.border, shadow: teardown.card?.shadow, transform: teardown.card?.transform, overflow: teardown.card?.overflow }));
console.log('TAGS:', JSON.stringify(teardown.card?.tagTally));
console.log('H1:', teardown.h1Text, '|', teardown.h1FontSize, '|', teardown.h1FontFamily, '|', teardown.h1Weight);
console.log('BODY BG:', teardown.bodyBg, 'HERO BG:', teardown.heroBgColor);
console.log('HERO BG IMAGE:', teardown.heroBgImage);
console.log('BUTTONS:', JSON.stringify(teardown.heroButtons));
console.log('KEYFRAMES:', teardown.keyframes.map(k => k.name).join(', '));
console.log('ANIMATED COUNT:', teardown.animatedInHero.length);
console.log('SCRIPTS:', teardown.scriptSrcs.join('\n  '));
console.log('\nSAMPLES UNIQUE:', [...new Set(samples)].length, 'of', samples.length);
console.log([...new Set(samples)].slice(0, 4).join('\n---\n'));
console.log('\nPRICING:\n', pricing.slice(0, 1500));

await b.close();
