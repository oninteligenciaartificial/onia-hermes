// E1 (madre DESARROLLO-INFRA, 11-oct): /login de app.onia.com.bo a 390 y 1440 px, y el BUILD_ID que sirve la app
// (sale del HTML: /_next/static/<BUILD_ID>/_buildManifest.js). Solo lectura, sin sesión.
// Chromium no valida el certificado del proxy de la nube: cada pedido lo hace Node (route.fetch, con
// NODE_EXTRA_CA_CERTS), así que la verificación TLS sigue entera.
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const [SALIDA, ETIQUETA] = process.argv.slice(2);
mkdirSync(SALIDA, { recursive: true });
const URL = "https://app.onia.com.bo/login";
const browser = await chromium.launch();
const resultado = { cuando: new Date().toISOString(), url: URL, anchos: {} };
for (const ancho of [390, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: ancho, height: ancho === 390 ? 844 : 1000 }, locale: "es-BO" });
  await ctx.route("**/*", async (route) => {
    try { await route.fulfill({ response: await route.fetch() }); } catch { await route.abort(); }
  });
  const page = await ctx.newPage();
  const errores = [];
  page.on("console", (m) => { if (m.type() === "error") errores.push(m.text().slice(0, 160)); });
  const t0 = Date.now();
  const resp = await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1500);
  const html = await page.content();
  // La app no publica su BUILD_ID en el HTML; los nombres de sus chunks llevan el hash del build, así que la huella
  // es el runtime de webpack más la lista ordenada de chunks: cambia con cada build y es igual entre dos lecturas.
  const chunks = [...new Set(html.match(/\/_next\/static\/chunks\/[^"' ]+\.js/g) || [])].sort();
  const runtime = (chunks.find((c) => /webpack-/.test(c)) || "").split("/").pop();
  const build = runtime || null; // el runtime de webpack lleva el mapa de hashes de todos los chunks: cambia con cada build
  const texto = await page.evaluate(() => document.body.innerText);
  // Los iconos de Material Symbols: si la fuente no carga, se dibuja la palabra (el fallo del 15-ago).
  const ligaduras = await page.evaluate(() => [...document.querySelectorAll(".material-symbols-outlined, .material-symbols-rounded, .material-icons")]
    .map((e) => ({ t: e.textContent.trim(), w: e.getBoundingClientRect().width, h: e.getBoundingClientRect().height }))
    .filter((x) => x.t && x.w > x.h * 2.5));
  const archivo = `${ETIQUETA}-login-${ancho}.png`;
  await page.screenshot({ path: join(SALIDA, archivo), fullPage: true });
  resultado.anchos[ancho] = { estado: resp.status(), ms: Date.now() - t0, build, archivo, ligadurasComoTexto: ligaduras, errores, inicio: texto.slice(0, 300) };
  await ctx.close();
}
await browser.close();
writeFileSync(join(SALIDA, `${ETIQUETA}-login.json`), JSON.stringify(resultado, null, 2));
console.log(JSON.stringify(resultado, null, 1));
