// HTML animado -> secuencia PNG con alpha. Un frame por carga (?t=segundos): determinista.
// Uso: node render-overlay.mjs --html assets/intro-overlay.html --out-dir renders/ovl
//        [--fps 30] [--dur 13.02] [--w 1920] [--h 1080]
import { mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { launchChromium, resolveChromium } from "../../../.claude/skills/editor-videos/scripts/resolve-playwright.mjs";

const a = process.argv.slice(2);
const f = (n, d) => { const i = a.indexOf("--" + n); return i >= 0 && a[i+1] && !a[i+1].startsWith("--") ? a[i+1] : d; };
const html = resolve(f("html")), outDir = resolve(f("out-dir"));
const extra = f("query", "");   // ej. --query "only=cards"
const fps = +f("fps", 30), dur = +f("dur", 13.02);
const w = +f("w", 1920), h = +f("h", 1080);
const total = Math.round(dur * fps);

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });
const browser = await launchChromium("render-overlay", resolveChromium("render-overlay"));
const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
// self-contained: nada de red
await page.route((u) => u.protocol.startsWith("http"), (r) => r.abort());
const base = pathToFileURL(html).href;
for (let i = 0; i < total; i++) {
  const t = (i / fps).toFixed(4);
  await page.goto(`${base}?t=${t}${extra ? "&" + extra : ""}`, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${outDir}/f${String(i).padStart(5, "0")}.png`, omitBackground: true });
  if (i % 60 === 0) process.stdout.write(`${i}/${total} `);
}
await browser.close();
console.log(`\n${total} frames -> ${outDir}`);
