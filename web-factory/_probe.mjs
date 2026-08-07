// Empirical probe for the 6 F0.5 design bugs. Run against the static server on :4319.
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const BASE = process.env.BASE ?? "http://localhost:4319";
const out = {};

const browser = await chromium.launch();

// ---- 1 + 6: landing demo (.wf-proof-points, .wf-feature-number) -------------
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${BASE}/demo/`, { waitUntil: "networkidle" });

  out.proofPoints = await page.evaluate(() => {
    const ul = document.querySelector(".wf-proof-points");
    if (!ul) return "MISSING FROM DOM";
    const cs = getComputedStyle(ul);
    return {
      listStyleType: cs.listStyleType,
      paddingLeft: cs.paddingLeft,
      marginTop: cs.marginTop,
      fontFamily: cs.fontFamily.slice(0, 60),
      color: cs.color,
      lineHeight: cs.lineHeight,
      rect: ul.getBoundingClientRect().toJSON(),
      panelRect: document.querySelector(".wf-proof-panel").getBoundingClientRect().toJSON(),
    };
  });

  out.featureIcons = await page.evaluate(() =>
    [...document.querySelectorAll(".wf-feature-icon")].map((n) => n.innerHTML.trim().slice(0, 40)),
  );

  out.featureAlign = await page.evaluate(() =>
    [...document.querySelectorAll(".wf-feature")].map((card) => ({
      cardTop: Math.round(card.getBoundingClientRect().top),
      cardH: Math.round(card.getBoundingClientRect().height),
      numTop: Math.round(card.querySelector(".wf-feature-number").getBoundingClientRect().top),
      h3Top: Math.round(card.querySelector("h3").getBoundingClientRect().top),
      pTop: Math.round(card.querySelector("p").getBoundingClientRect().top),
    })),
  );
  await page.close();
}

// ---- 3: store headings overflow-wrap ---------------------------------------
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${BASE}/nuvia/`, { waitUntil: "networkidle" });
  out.storeWrap = await page.evaluate(() => {
    const hs = [...document.querySelectorAll(".store-section-heading h2, .store-hero h1")];
    return hs.slice(0, 6).map((h) => ({
      text: h.textContent.trim().slice(0, 46),
      overflowWrap: getComputedStyle(h).overflowWrap,
      // approximate mid-word break detection: does any line box end inside a word?
      lines: (() => {
        const r = document.createRange();
        const node = [...h.childNodes].find((n) => n.nodeType === 3);
        if (!node) return null;
        const txt = node.textContent;
        const tops = [];
        for (let i = 0; i < txt.length; i += 1) {
          r.setStart(node, i);
          r.setEnd(node, i + 1);
          const b = r.getBoundingClientRect();
          tops.push({ ch: txt[i], top: Math.round(b.top) });
        }
        // last char of each visual line
        const breaks = [];
        for (let i = 1; i < tops.length; i += 1) {
          if (tops[i].top > tops[i - 1].top) {
            breaks.push({ endsLine: tops[i - 1].ch, startsNext: tops[i].ch });
          }
        }
        return breaks;
      })(),
    }));
  });
  await page.close();
}

// ---- 5: sticky CTA at 390px ------------------------------------------------
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${BASE}/dental-demo/`, { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  out.sticky = await page.evaluate(() => {
    const cta = document.querySelector(".wf-sticky-cta");
    if (!cta) return "MISSING";
    const c = cta.getBoundingClientRect();
    const vw = innerWidth;
    const vh = innerHeight;
    const covered = [];
    // sample the CTA area for what is underneath
    for (const step of [0.15, 0.5, 0.85]) {
      const x = c.left + c.width * step;
      const y = c.top + c.height / 2;
      const stack = document.elementsFromPoint(x, y).slice(0, 4).map((e) => {
        const cls = typeof e.className === "string" ? e.className : "";
        return `${e.tagName.toLowerCase()}${cls ? "." + cls.trim().split(/\s+/).join(".") : ""}`;
      });
      covered.push({ at: step, stack });
    }
    return {
      rect: { x: Math.round(c.x), y: Math.round(c.y), w: Math.round(c.width), h: Math.round(c.height) },
      viewport: { vw, vh },
      overflowsRight: c.right > vw,
      widthPct: Math.round((c.width / vw) * 100),
      docScrollWidth: document.documentElement.scrollWidth,
      bodyPaddingBottom: getComputedStyle(document.body).paddingBottom,
      covered,
    };
  });
  await page.close();
}

// ---- 4: axe colour-contrast on nuvia (coral) -------------------------------
for (const [name, url] of [
  ["nuvia", `${BASE}/nuvia/`],
  ["skincare-demo", `${BASE}/skincare-demo/`],
  ["dental-demo", `${BASE}/dental-demo/`],
  ["demo", `${BASE}/demo/`],
]) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  const res = await new AxeBuilder({ page }).withTags(["wcag2aa", "wcag22aa"]).analyze();
  out[`axe_${name}`] = res.violations.map((v) => ({
    id: v.id,
    nodes: v.nodes.length,
    sample: v.nodes.slice(0, 3).map((n) => ({ target: n.target.join(" "), msg: n.failureSummary?.split("\n").slice(1, 3).join(" | ") })),
  }));
  await page.close();
}

await browser.close();
console.log(JSON.stringify(out, null, 2));
