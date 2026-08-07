// Follow-up probe: bug 3 (wrap) at 320px + all store headings, bug 5 (sticky
// overlap detail), bug 6 (feature alignment across demos with varying copy).
import { chromium } from "playwright";

const BASE = "http://localhost:4319";
const out = {};
const browser = await chromium.launch();

// ---- 6: feature card alignment across every landing demo -------------------
for (const slug of ["demo", "restaurant-demo", "saas-demo", "engineering-demo", "clinic-demo"]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const res = await page.goto(`${BASE}/${slug}/`, { waitUntil: "networkidle" }).catch(() => null);
  if (!res || !res.ok()) { await page.close(); continue; }
  out[`align_${slug}`] = await page.evaluate(() => {
    const cards = [...document.querySelectorAll(".wf-feature")];
    if (!cards.length) return "no .wf-feature";
    return cards.map((c) => {
      const t = c.getBoundingClientRect().top;
      const g = (sel) => {
        const n = c.querySelector(sel);
        return n ? Math.round(n.getBoundingClientRect().top - t) : null;
      };
      return {
        h: Math.round(c.getBoundingClientRect().height),
        iconY: g(".wf-feature-icon"),
        numY: g(".wf-feature-number"),
        h3Y: g("h3"),
        pY: g("p"),
        pLines: Math.round(c.querySelector("p").getBoundingClientRect().height),
      };
    });
  });
  await page.close();
}

// ---- 3: mid-word breaks at 320px across all store headings -----------------
for (const [slug, w] of [["nuvia", 320], ["skincare-demo", 320], ["nuvia", 280]]) {
  const page = await browser.newPage({ viewport: { width: w, height: 844 } });
  await page.goto(`${BASE}/${slug}/`, { waitUntil: "networkidle" });
  out[`wrap_${slug}_${w}`] = await page.evaluate(() => {
    const res = [];
    for (const h of document.querySelectorAll("h1, h2, h3")) {
      const node = [...h.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
      if (!node) continue;
      const txt = node.textContent;
      const r = document.createRange();
      let prevTop = null;
      const breaks = [];
      for (let i = 0; i < txt.length; i += 1) {
        r.setStart(node, i);
        r.setEnd(node, i + 1);
        const top = Math.round(r.getBoundingClientRect().top);
        if (prevTop !== null && top > prevTop && txt[i - 1] !== " " && txt[i] !== " ") {
          breaks.push(`${txt.slice(Math.max(0, i - 8), i)} / ${txt.slice(i, i + 8)}`);
        }
        prevTop = top;
      }
      if (breaks.length) res.push({ sel: h.className || h.tagName, overflowWrap: getComputedStyle(h).overflowWrap, breaks });
    }
    return res;
  });
  await page.close();
}

// ---- 5: sticky CTA overlap detail at 390px, several scroll positions -------
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${BASE}/dental-demo/`, { waitUntil: "networkidle" });
  out.stickyOverlap = await page.evaluate(async () => {
    const cta = document.querySelector(".wf-sticky-cta");
    const hits = [];
    const doc = document.documentElement;
    const steps = [0, 0.25, 0.5, 0.75, 1];
    for (const s of steps) {
      window.scrollTo(0, (doc.scrollHeight - innerHeight) * s);
      await new Promise((r) => setTimeout(r, 250));
      const c = cta.getBoundingClientRect();
      const clash = [];
      const sels = "a:not(.wf-sticky-cta), button, .wf-clinic-chip, li, h2, h3, p, summary, .wf-clinic-btn";
      for (const el of document.querySelectorAll(sels)) {
        if (cta.contains(el) || el.contains(cta)) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const ox = Math.min(c.right, r.right) - Math.max(c.left, r.left);
        const oy = Math.min(c.bottom, r.bottom) - Math.max(c.top, r.top);
        if (ox > 4 && oy > 4) {
          const cls = typeof el.className === "string" ? el.className.trim().split(/\s+/).join(".") : "";
          clash.push({
            el: `${el.tagName.toLowerCase()}${cls ? "." + cls : ""}`,
            text: (el.textContent || "").trim().slice(0, 34),
            overlapPx: `${Math.round(ox)}x${Math.round(oy)}`,
            interactive: ["A", "BUTTON", "SUMMARY"].includes(el.tagName),
          });
        }
      }
      hits.push({ scroll: s, ctaTop: Math.round(c.top), clash: clash.slice(-6) });
    }
    return hits;
  });
  // is the very last footer content reachable / unobstructed?
  out.stickyTail = await page.evaluate(() => {
    const cta = document.querySelector(".wf-sticky-cta").getBoundingClientRect();
    const last = document.querySelector(".wf-footer");
    return {
      footerBottom: Math.round(last.getBoundingClientRect().bottom),
      ctaTop: Math.round(cta.top),
      docPadBottom: getComputedStyle(document.body).paddingBottom,
      pagePadBottom: getComputedStyle(document.querySelector(".wf-clinic-page")).paddingBottom,
    };
  });
  await page.close();
}

await browser.close();
console.log(JSON.stringify(out, null, 2));
