// mirar.mjs — pasada humana asistida: slices de pantalla + inventario de <video>/<img> por seccion.
// Uso: node mirar.mjs <url> <slug>
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const [url, slug] = process.argv.slice(2);
const OUT = path.join(process.env.MIRADA_OUT, slug);
await mkdir(OUT, { recursive: true });

const { chromium } = await import("@playwright/test");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(4000);

// autoscroll para disparar lazy-load
await page.evaluate(async () => {
  const h = () => document.documentElement.scrollHeight;
  for (let y = 0; y < h(); y += 800) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 250)); }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(2000);

// inventario de media con posicion y heading mas cercano
const media = await page.evaluate(() => {
  const heads = [...document.querySelectorAll("h1,h2,h3")].map(h => ({
    tag: h.tagName, text: h.textContent.trim().replace(/\s+/g, " ").slice(0, 110),
    y: Math.round(h.getBoundingClientRect().top + scrollY),
  })).filter(h => h.text);
  const nearest = (y) => { let best = null; for (const h of heads) if (h.y <= y + 60 && (!best || h.y > best.y)) best = h; return best ? best.text : "-"; };
  const vids = [...document.querySelectorAll("video")].map(v => {
    const r = v.getBoundingClientRect();
    return { y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height),
      dur: Number.isFinite(v.duration) ? Math.round(v.duration * 10) / 10 : null,
      autoplay: v.autoplay || v.hasAttribute("autoplay"), loop: v.loop, muted: v.muted,
      controls: v.controls, src: (v.currentSrc || "").split("/").pop().slice(0, 60), seccion: nearest(r.top + scrollY) };
  }).filter(v => v.w > 40);
  const lotties = [...document.querySelectorAll("lottie-player,[data-lottie],.lottie, dotlottie-player, canvas")].map(el => {
    const r = el.getBoundingClientRect();
    return { tipo: el.tagName.toLowerCase(), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height), seccion: nearest(r.top + scrollY) };
  }).filter(l => l.w > 100 && l.h > 100);
  const iframes = [...document.querySelectorAll("iframe")].map(f => {
    const r = f.getBoundingClientRect();
    return { y: Math.round(r.top + scrollY), w: Math.round(r.width), src: (f.src || "").slice(0, 100), seccion: nearest(r.top + scrollY) };
  }).filter(f => f.w > 200);
  return { alto: document.documentElement.scrollHeight, heads, vids, lotties, iframes };
});
await writeFile(path.join(OUT, "media.json"), JSON.stringify(media, null, 2));

// slices: una captura por pantalla, max 16
const alto = media.alto;
const n = Math.min(16, Math.ceil(alto / 900));
for (let i = 0; i < n; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), i * 900);
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUT, `s${String(i).padStart(2, "0")}.png`) });
}
await browser.close();
console.log(`${slug}: ${alto}px, ${n} slices, ${media.vids.length} videos, ${media.lotties.length} lottie/canvas, ${media.iframes.length} iframes`);
