// capturar-anthropic.mjs — capturas OFICIALES de platform.claude.com / code.claude.com para el molde Santiago (N07). Mismo formato de
// salida que capturar.mjs: <id>.png a 2x + capturas.json con { url, fecha, w, h, frases: { nombre: [x, y, w, h] } }.
// Es la copia de capturar-openai.mjs (DD-A) con tres cambios:
//   1. lo `sticky` NO se oculta, se pasa a `static` (con `relative` conservaba su `top` y la cabecera caía encima de la primera fila): la cabecera «Pricing» de la tarjeta de precios de platform.claude.com es sticky y
//      ocultarla dejaba el recorte con un hueco vacío arriba. Solo lo `fixed` (barra de arriba, «Ask Docs») se oculta.
//   2. una `frase` que no existe sola en la página (p. ej. «Released» y «October 7, 2026» están en <dt>/<dd> distintos) se marca por su
//      parte única; la búsqueda cruza nodos de texto pero NO inventa el espacio que falta entre dos elementos.
//   3. el JSON guarda también la hora UTC de la captura (`fecha_hora`).
// No se scrollea (como en la copia de OpenAI): se agranda el viewport hasta que el recorte entra y se saca el clip de ahí.
//
// Uso:  node capturar-anthropic.mjs <storyboard.json> <carpeta-assets> [--forzar]
// Lee del storyboard "capturas" (igual que capturar.mjs) y suma:
//   "celdas": { "<nombre>": { "fila": "gpt-6.1-sol", "col": 1 } }   // rectángulo del texto de una celda de tabla (fila visible
//                                                                       cuyo 1.er <td> dice `fila`; col 0 = la fila misma)
//   "logos_svg": [ { "id", "svg", "alto", "tile": true } ]           // tile: logo oscuro sobre cuadrado blanco redondeado
//                                                                       (brand-logos/README: el logo va en su tile blanco)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const [sbPath, outDir] = args.filter((a) => !a.startsWith("--"));
const FORZAR = args.includes("--forzar");
if (!sbPath || !outDir) {
  console.error("uso: node capturar-anthropic.mjs <storyboard.json> <carpeta-assets> [--forzar]");
  process.exit(2);
}
const REPO = fileURLToPath(new URL("../../../../../", import.meta.url));
const sb = JSON.parse(readFileSync(sbPath, "utf8"));
mkdirSync(outDir, { recursive: true });
const jsonPath = join(outDir, "capturas.json");
const meta = existsSync(jsonPath) ? JSON.parse(readFileSync(jsonPath, "utf8")) : {};

function playwright() {
  for (const ancla of ["/opt/node-tools/package.json", join(REPO, "package.json"), join(REPO, "..", "package.json")]) {
    for (const mod of ["playwright", "playwright-core"]) {
      try { return createRequire(ancla)(mod); } catch { /* sigue */ }
    }
  }
  console.error("capturar-anthropic: falta playwright (/opt/node-tools)");
  process.exit(1);
}
const { chromium } = playwright();
const browser = await chromium.launch(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {});

// rectángulo (coordenadas de página) de una frase, buscando en los nodos de texto visibles (cruza <code>, <strong>…)
const buscar = (page, frase, desdeY = -1) =>
  page.evaluate(([frase, desdeY]) => {
    const nodos = [];
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentElement && !/^(SCRIPT|STYLE|NOSCRIPT)$/.test(n.parentElement.tagName)
        && n.parentElement.offsetParent !== null ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
    });
    let todo = "";
    for (let n = w.nextNode(); n; n = w.nextNode()) { nodos.push([n, todo.length]); todo += n.nodeValue; }
    const norm = (s) => s.replace(/\s+/g, " ");
    const crudo = []; let plano = "";
    for (let i = 0; i < todo.length; i++) {
      const ch = /\s/.test(todo[i]) ? " " : todo[i];
      if (ch === " " && plano.endsWith(" ")) continue;
      plano += ch; crudo.push(i);
    }
    let desde = 0;
    for (;;) {
      const k = plano.indexOf(norm(frase), desde);
      if (k < 0) return null;
      const a = crudo[k], b = crudo[k + norm(frase).length - 1] + 1;
      const ubicar = (pos) => { for (let i = nodos.length - 1; i >= 0; i--) if (nodos[i][1] <= pos) return [nodos[i][0], pos - nodos[i][1]]; };
      const [n0, o0] = ubicar(a), [n1, o1] = ubicar(b - 1);
      const rg = document.createRange(); rg.setStart(n0, o0); rg.setEnd(n1, o1 + 1);
      const rs = [...rg.getClientRects()].filter((q) => q.width > 1 && q.height > 1);
      if (!rs.length) { desde = k + 1; continue; }
      const x0 = Math.min(...rs.map((q) => q.left)), y0 = Math.min(...rs.map((q) => q.top));
      const x1 = Math.max(...rs.map((q) => q.right)), y1 = Math.max(...rs.map((q) => q.bottom));
      const top = y0 + window.scrollY;
      if (top < desdeY) { desde = k + 1; continue; }
      return [x0, top, x1 - x0, y1 - y0];
    }
  }, [frase, desdeY]);

// rectángulo del texto de la celda `col` de la primera fila VISIBLE cuyo primer <td> dice `fila`
const celda = (page, fila, col) =>
  page.evaluate(([fila, col]) => {
    for (const tr of document.querySelectorAll("tr")) {
      const tds = [...tr.children];
      if (!tds.length || tds[0].textContent.trim() !== fila) continue;
      const r0 = tds[0].getBoundingClientRect();
      if (r0.width < 1 || r0.height < 1) continue; // fila de otra pestaña (Batch, Flex…), oculta
      const td = tds[col];
      if (!td) return null;
      // solo los nodos de TEXTO (el rectángulo de un <span> de bloque ocuparía toda la celda)
      const rs = [];
      const w = document.createTreeWalker(td, NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        if (!n.nodeValue.trim()) continue;
        const rg = document.createRange(); rg.selectNodeContents(n);
        rs.push(...[...rg.getClientRects()].filter((q) => q.width > 1 && q.height > 1));
      }
      if (!rs.length) return null;
      const x0 = Math.min(...rs.map((q) => q.left)), y0 = Math.min(...rs.map((q) => q.top));
      const x1 = Math.max(...rs.map((q) => q.right)), y1 = Math.max(...rs.map((q) => q.bottom));
      return [x0, y0 + window.scrollY, x1 - x0, y1 - y0];
    }
    return null;
  }, [fila, col]);

for (const c of sb.capturas || []) {
  const png = join(outDir, `${c.id}.png`);
  if (!FORZAR && existsSync(png) && meta[c.id]) { console.log(`= ${c.id} (ya existe)`); continue; }
  const ancho = c.ancho_css || 560, alto = c.alto_css || 500;
  const ctx = await browser.newContext({ viewport: { width: ancho, height: 1000 }, deviceScaleFactor: 2, colorScheme: c.esquema || "dark" });
  const page = await ctx.newPage();
  const r = await page.goto(c.url, { waitUntil: "networkidle", timeout: 90000 });
  if (!r || r.status() >= 400) {
    console.error(`capturar-anthropic: ${c.url} respondió ${r && r.status()} — no hay captura real; usá una tarjeta de texto y decilo`);
    process.exit(3);
  }
  await page.waitForTimeout(1500);
  const posicion = async () => {
    if (!c.ancla) return 0;
    const ra = await buscar(page, c.ancla);
    if (!ra) { console.error(`capturar-anthropic: no encontré el ancla «${c.ancla}» en ${c.url}`); process.exit(4); }
    return Math.max(0, Math.round(ra[1] - (c.margen ?? 18)));
  };
  let y0 = await posicion();
  for (let i = 0; i < 3; i++) { // agrandar el viewport hasta que el recorte entre; el layout puede correrse al hacerlo
    const need = y0 + alto + 120;
    if (need > 12000) break; // páginas larguísimas (code.claude.com/docs/en/model-config): las saca fullPage + clip, sin tocar el viewport
    await page.setViewportSize({ width: ancho, height: Math.min(15000, Math.max(1000, need)) });
    await page.waitForTimeout(1200);
    const y1 = await posicion();
    if (Math.abs(y1 - y0) < 2) break;
    y0 = y1;
  }
  // lo fijo (barra de arriba, botón «Ask AI») taparía el recorte
  await page.evaluate(() => {
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      if (cs.position === "fixed") el.style.visibility = "hidden";
      else if (cs.position === "sticky") el.style.position = "static"; // `relative` conservaba el `top` del sticky y corría la cabecera sobre la primera fila
    }
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: png, clip: { x: 0, y: y0, width: ancho, height: alto }, fullPage: true });
  const frases = {};
  for (const f of c.frases || []) {
    const rf = await buscar(page, f, y0);
    if (!rf) { console.error(`capturar-anthropic: «${f}» no aparece en ${c.id}`); process.exit(5); }
    const [x, y, w, h] = rf;
    if (y + h > y0 + alto) { console.error(`capturar-anthropic: «${f}» cae fuera del recorte de ${c.id} (subí alto_css)`); process.exit(5); }
    frases[f] = [x * 2, (y - y0) * 2, w * 2, h * 2].map((v) => Math.round(v));
  }
  for (const [nombre, d] of Object.entries(c.celdas || {})) {
    const rf = await celda(page, d.fila, d.col);
    if (!rf) { console.error(`capturar-anthropic: celda «${nombre}» (${d.fila}, col ${d.col}) no aparece en ${c.id}`); process.exit(5); }
    const [x, y, w, h] = rf;
    if (y < y0 || y + h > y0 + alto) { console.error(`capturar-anthropic: celda «${nombre}» fuera del recorte de ${c.id}`); process.exit(5); }
    frases[nombre] = [x * 2, (y - y0) * 2, w * 2, h * 2].map((v) => Math.round(v));
  }
  meta[c.id] = { url: c.url, fecha: new Date().toISOString().slice(0, 10), fecha_hora: new Date().toISOString(), w: ancho * 2, h: alto * 2, frases };
  console.log(`+ ${c.id}.png  ${Object.keys(frases).length} marcas  (y0=${y0})`);
  await ctx.close();
}

for (const l of sb.logos_svg || []) {
  const png = join(outDir, `${l.id}.png`);
  if (!FORZAR && existsSync(png)) { console.log(`= ${l.id} (ya existe)`); continue; }
  const svg = readFileSync(resolve(REPO, l.svg), "utf8");
  const lado = l.alto;
  const pad = l.tile ? Math.round(lado * 0.22) : 0;
  const ctx = await browser.newContext({ viewport: { width: lado + 2 * pad + 40, height: lado + 2 * pad + 40 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.setContent(`<html><body style="margin:0;background:transparent">
    <div id="t" style="display:inline-block;${l.tile ? `background:#fff;border-radius:${Math.round(lado * 0.22)}px;padding:${pad}px;` : ""}line-height:0">
    <img style="height:${lado}px;display:block" src="data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}"></div></body></html>`);
  await page.locator("#t").screenshot({ path: png, omitBackground: true });
  console.log(`+ ${l.id}.png (logo${l.tile ? ", en su tile blanco" : ""})`);
  await ctx.close();
}

await browser.close();
writeFileSync(jsonPath, JSON.stringify(meta, null, 1));
