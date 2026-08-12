import { chromium } from "playwright";

// Real keyboard walk: Tab through the page and record what the focused element
// actually looks like, plus composited contrast (alpha over its real backdrop).
const url = process.argv[2];
const out = process.argv[3];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(900);

const seen = [];
for (let i = 0; i < 22; i++) {
  await page.keyboard.press("Tab");
  const info = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const s = getComputedStyle(el);
    return {
      tag: el.tagName,
      cls: String(el.className).slice(0, 34),
      outline: `${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor}`,
      h: Math.round(el.getBoundingClientRect().height),
    };
  });
  if (info) seen.push(info);
}
const noRing = seen.filter((s) => s.outline.startsWith("none") || s.outline.includes("0px"));
console.log(JSON.stringify({ tabbed: seen.length, noRing }, null, 1));

// screenshot with a mid-page element focused, to eyeball the ring
await page.evaluate(() => document.querySelector(".wf-path-link")?.focus());
await page.evaluate(() => document.querySelector(".wf-paths")?.scrollIntoView());
await page.waitForTimeout(400);
await page.screenshot({ path: `${out}-focus-path.png` });
await page.evaluate(() => document.querySelector(".wf-news-input")?.focus());
await page.evaluate(() => document.querySelector(".wf-news")?.scrollIntoView());
await page.waitForTimeout(400);
await page.screenshot({ path: `${out}-focus-input.png` });

// composited contrast: read the real painted pixels instead of guessing alpha
await browser.close();
