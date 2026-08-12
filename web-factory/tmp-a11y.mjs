import { chromium } from "playwright";

const url = process.argv[2];
const browser = await chromium.launch();

// 1. reduced motion: every animated target must render in its final state
const rm = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 900 } });
const p1 = await rm.newPage();
await p1.goto(url, { waitUntil: "load" });
await p1.waitForTimeout(400);
const reduced = await p1.evaluate(() => {
  const targets = [...document.querySelectorAll(".wf-reveal,.wf-stagger,.wf-stagger>*,.wf-clip-reveal,.wf-zoom")];
  const hidden = targets.filter((el) => {
    const s = getComputedStyle(el);
    return Number(s.opacity) < 0.99 || (s.transform !== "none" && s.transform !== "matrix(1, 0, 0, 1, 0, 0)");
  });
  return { targets: targets.length, hidden: hidden.length, sample: hidden.slice(0, 3).map((e) => e.className) };
});

// 2. focus visibility across every interactive element
const p2 = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
await p2.goto(url, { waitUntil: "load" });
await p2.waitForTimeout(800);
const focus = await p2.evaluate(() => {
  const els = [...document.querySelectorAll("a[href],button,input,summary")];
  const noRing = [];
  const smallTargets = [];
  for (const el of els) {
    el.focus();
    const s = getComputedStyle(el);
    const ring =
      (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0) ||
      s.boxShadow !== "none" ||
      getComputedStyle(el, "::after").transform !== "none";
    if (!ring) noRing.push(el.className || el.tagName);
    const r = el.getBoundingClientRect();
    if (r.height > 0 && r.height < 44 && el.tagName !== "SUMMARY") {
      smallTargets.push(`${el.tagName}.${el.className} h=${Math.round(r.height)}`);
    }
  }
  return { total: els.length, noRing, smallTargets };
});

// 3. contrast of the hero copy over the scrim + section text
const contrast = await p2.evaluate(() => {
  const lum = (c) => {
    const [r, g, b] = c.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number).map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
    return Number(((x + 0.05) / (y + 0.05)).toFixed(2));
  };
  const pick = (sel) => document.querySelector(sel);
  const out = {};
  const heroBg = "rgb(12, 17, 15)"; // --color-fg, the scrim base
  for (const [name, sel] of [
    ["hero h1", ".wf-mh-headline"],
    ["hero sub", ".wf-mh-sub"],
    ["hero kicker", ".wf-mh-kicker"],
    ["nav link", ".wf-mh-nav-link"],
  ]) {
    const el = pick(sel);
    if (el) out[name] = ratio(getComputedStyle(el).color, heroBg);
  }
  const pageBg = getComputedStyle(document.body).backgroundColor;
  for (const [name, sel] of [
    ["path copy", ".wf-path-copy"],
    ["prop location", ".wf-prop-location"],
    ["prop price", ".wf-prop-price"],
    ["spec label", ".wf-prop-spec-label"],
    ["section label", ".wf-props-label"],
    ["footer legal", ".wf-fb-legal"],
  ]) {
    const el = pick(sel);
    if (el) out[name] = ratio(getComputedStyle(el).color, pageBg);
  }
  const news = pick(".wf-news-copy");
  if (news) out["news copy"] = ratio(getComputedStyle(news).color, getComputedStyle(pick(".wf-news")).backgroundColor);
  const note = pick(".wf-news-note");
  if (note) out["news note"] = ratio(getComputedStyle(note).color, getComputedStyle(pick(".wf-news")).backgroundColor);
  return out;
});

console.log(JSON.stringify({ reduced, focus, contrast }, null, 1));
await browser.close();
