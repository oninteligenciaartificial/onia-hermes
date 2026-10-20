// Mide el diseño de una página pública: captura 390 y 1440 (página entera) y saca del CSS COMPUTADO
// las letras, tamaños y colores reales, para no adivinarlos de una captura (regla de design-dna).
// Uso: node scripts/disenio-pagina-medir.cjs <url> <carpeta-salida> [nombre]
// Salida: <nombre>-390.png, <nombre>-1440.png, <nombre>.json
const fs = require("node:fs");
const path = require("node:path");

function playwrightCore() {
  const root = path.join(process.env.LOCALAPPDATA || "", "npm-cache", "_npx");
  const hit = fs.readdirSync(root)
    .map((d) => path.join(root, d, "node_modules", "playwright-core"))
    .filter((p) => fs.existsSync(p))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
  if (!hit) throw new Error("No hay playwright-core en la cache de npx");
  return require(hit);
}

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

// Corre dentro de la página: letras, tamaños y colores tal como el navegador los dibuja.
function medir() {
  const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const st = (el) => { const s = getComputedStyle(el); return {
    texto: (el.innerText || "").trim().slice(0, 90), fuente: s.fontFamily, peso: s.fontWeight,
    tam: s.fontSize, interlineado: s.lineHeight, tracking: s.letterSpacing, color: s.color,
    fondo: s.backgroundColor, radio: s.borderRadius, borde: s.border, mayus: s.textTransform }; };
  const pick = (sel, n) => [...document.querySelectorAll(sel)].filter(vis).slice(0, n).map(st);
  const cuenta = (prop, sel) => { const m = {}; document.querySelectorAll(sel).forEach((el) => {
    if (!vis(el)) return; const v = getComputedStyle(el)[prop]; if (v && v !== "rgba(0, 0, 0, 0)") m[v] = (m[v] || 0) + 1; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 14); };
  const botones = [...document.querySelectorAll("a,button")].filter((el) => {
    if (!vis(el)) return false; const s = getComputedStyle(el);
    return s.backgroundColor !== "rgba(0, 0, 0, 0)" || parseFloat(s.borderWidth) > 0; }).slice(0, 8).map(st);
  const secciones = [...document.querySelectorAll("section, header, footer, main > div")].filter(vis).slice(0, 25)
    .map((el) => ({ tag: el.tagName, alto: Math.round(el.getBoundingClientRect().height),
      fondo: getComputedStyle(el).backgroundColor, img: getComputedStyle(el).backgroundImage.slice(0, 80),
      titulo: (el.querySelector("h1,h2,h3")?.innerText || "").trim().slice(0, 70) }));
  const vars = {}; for (const sh of document.styleSheets) { try { for (const r of sh.cssRules) {
    if (r.selectorText === ":root") for (const p of r.style) if (p.startsWith("--")) vars[p] = r.style.getPropertyValue(p).trim();
  } } catch (_) { /* hoja de otro origen */ } }
  return {
    titulo: document.title, url: location.href, alto: document.documentElement.scrollHeight,
    fuentes_cargadas: [...document.fonts].filter((f) => f.status === "loaded").map((f) => `${f.family} ${f.weight} ${f.style}`),
    body: st(document.body), h1: pick("h1", 3), h2: pick("h2", 6), h3: pick("h3", 4), p: pick("p", 4),
    botones, secciones, colores_texto: cuenta("color", "body *"), colores_fondo: cuenta("backgroundColor", "body *"),
    imagenes: [...document.images].filter(vis).slice(0, 15).map((i) => ({ src: i.currentSrc.slice(0, 120), w: i.width, h: i.height, alt: i.alt })),
    efectos: { canvas: document.querySelectorAll("canvas").length, video: document.querySelectorAll("video").length,
      svg: document.querySelectorAll("svg").length, iframes: [...document.querySelectorAll("iframe")].map((f) => f.src.slice(0, 80)) },
    vars_root: Object.fromEntries(Object.entries(vars).slice(0, 80)),
  };
}

(async () => {
  const [url, out, nombre = "pagina"] = process.argv.slice(2);
  if (!url || !out) { console.error("Uso: node disenio-pagina-medir.cjs <url> <carpeta> [nombre]"); process.exit(2); }
  fs.mkdirSync(out, { recursive: true });
  const { chromium } = playwrightCore();
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const datos = {};
  try {
    for (const [ancho, alto, movil] of [[390, 844, true], [1440, 900, false]]) {
      const ctx = await browser.newContext({ viewport: { width: ancho, height: alto }, deviceScaleFactor: movil ? 2 : 1, isMobile: movil, hasTouch: movil, locale: "es-419" });
      const page = await ctx.newPage();
      // networkidle puede no llegar nunca (chats, analítica): ante TimeoutError se sigue; cualquier otro error corta.
      await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch((e) => { if (e.name !== "TimeoutError") throw e; });
      // bajar despacio para que carguen las imágenes perezosas y las animaciones de entrada
      await page.evaluate(async () => { for (let y = 0, i = 0; y < document.body.scrollHeight && i < 40; y += 600, i++) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } scrollTo(0, 0); });
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(out, `${nombre}-${ancho}.png`), fullPage: true });
      datos[ancho] = await page.evaluate(medir);
      await ctx.close();
    }
  } finally { await browser.close(); }
  fs.writeFileSync(path.join(out, `${nombre}.json`), JSON.stringify(datos, null, 1));
  console.log(`ok ${nombre}: ${datos[1440].alto}px · fuentes: ${datos[1440].fuentes_cargadas.join(" | ")}`);
})().catch((e) => { console.error("FALLO", e.message); process.exit(1); });
