// Final visual verification against the deployed landing.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";
const BASE = process.argv[2];
const OUT = process.argv[3];
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const report = {};

const settle = async (p, ms = 2500) => { await p.waitForLoadState("networkidle").catch(() => {}); await p.waitForTimeout(ms); };

// ---- desktop ----
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto(BASE, { waitUntil: "domcontentloaded" });
await settle(page);
await page.screenshot({ path: path.join(OUT, "A-hero-1440.png") });
report.heroPhotoGone = await page.evaluate(() => !document.querySelector('[class*="photoHero"]'));
report.heroMockReadable = await page.evaluate(() => {
  const txt = [...document.querySelectorAll('[class*="shot"] *')].map(e => e.innerText || "").join(" ");
  return ["09:00", "10:30", "11:15", "Gestión", "WhatsApp", "Agentes IA", "Página web"].filter(t => txt.includes(t));
});
report.kickerFontHome = await page.evaluate(() => {
  const k = document.querySelector('[class*="kicker"]');
  return k ? getComputedStyle(k).fontFamily.split(",")[0].replace(/["']/g, "") : null;
});

// pricing, scrolled onto the cards
await page.goto(BASE + "/precios", { waitUntil: "domcontentloaded" });
await settle(page);
await page.evaluate(() => document.querySelector('[class*="plans"]')?.scrollIntoView({ block: "center" }));
await page.waitForTimeout(2200);
await page.screenshot({ path: path.join(OUT, "B-precios-cards-1440.png") });
report.precios = await page.evaluate(() => {
  const g = document.querySelector('[class*="plans"]');
  const c = g ? [...g.children] : [];
  const box = c.map(e => e.getBoundingClientRect());
  const cta = c.map(e => { const b = [...e.querySelectorAll("a,button")].pop(); return b ? Math.round(b.getBoundingClientRect().bottom + scrollY) : null; });
  return {
    heights: box.map(b => Math.round(b.height)),
    widths: box.map(b => Math.round(b.width)),
    tops: box.map(b => Math.round(b.top + scrollY)),
    ctaBottoms: cta,
    precios: c.map(e => (e.innerText.match(/\n([\d.]+)\s*\nBs\/mes/) || [])[1] || (e.innerText.match(/([\d.]+)\s*Bs\/mes/) || [])[1] || null),
  };
});
// the CTA row of the three cards
await page.evaluate(() => { const g = document.querySelector('[class*="plans"]'); const b = [...g.children[0].querySelectorAll("a,button")].pop(); b?.scrollIntoView({ block: "center" }); });
await page.waitForTimeout(1200);
await page.screenshot({ path: path.join(OUT, "C-precios-botones-1440.png") });

// footer wordmark
await page.goto(BASE, { waitUntil: "domcontentloaded" });
await settle(page);
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(2200);
await page.screenshot({ path: path.join(OUT, "D-footer-1440.png") });

// subpage
await page.goto(BASE + "/nosotros", { waitUntil: "domcontentloaded" });
await settle(page);
await page.screenshot({ path: path.join(OUT, "E-subpagina-nosotros-1440.png") });

await ctx.close();

// ---- mobile 390 ----
const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const mp = await m.newPage();
await mp.goto(BASE, { waitUntil: "domcontentloaded" });
await settle(mp);
await mp.screenshot({ path: path.join(OUT, "F-hero-390.png") });
report.mobileOverflow = await mp.evaluate(() => Math.max(0, document.documentElement.scrollWidth - 390));

await mp.goto(BASE + "/precios", { waitUntil: "domcontentloaded" });
await settle(mp);
await mp.evaluate(() => document.querySelector('[class*="plans"]')?.scrollIntoView({ block: "start" }));
await mp.waitForTimeout(2200);
await mp.screenshot({ path: path.join(OUT, "G-precios-390.png") });
await m.close();

await browser.close();
console.log(JSON.stringify(report, null, 2));
