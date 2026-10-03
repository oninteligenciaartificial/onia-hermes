// capturar.mjs — pruebas REALES para la receta Santiago Muñoz: capturas de páginas oficiales (con el
// rectángulo de cada frase que se va a marcar) y logos SVG rasterizados. Lo llama santiago.py cuando falta
// un asset; también se puede correr solo.
//
// Uso:  node capturar.mjs <storyboard.json> <carpeta-assets> [--forzar]
//
// Lee del storyboard:
//   "capturas": [ { "id": "doc-bloquea",
//                   "url": "https://code.claude.com/docs/en/permission-modes",
//                   "ancho_css": 560,            // ventana; sale a 2x (1120 px de ancho)
//                   "esquema": "dark",           // dark | light
//                   "ancla": "Blocked by default",   // texto donde arranca el recorte (null = arriba de todo)
//                   "margen": 18,                // px CSS por encima del ancla
//                   "alto_css": 520,             // alto del recorte
//                   "fijos": "ocultar",          // ocultar | abajo (oculta solo lo fijo de la mitad de abajo)
//                   "frases": ["Force push", "Production deploys and migrations"] } ],
//   "logos_svg":  [ { "id": "whatsapp", "svg": "hermes-content/references/brand-logos/whatsapp.svg", "alto": 240 } ]
//
// Escribe <id>.png y capturas.json: { "<id>": { "w", "h", "frases": { "<frase>": [x, y, w, h] } } } en
// píxeles de la captura. Una frase que no aparece corta el proceso (mejor fallar que marcar en el aire).
// Rutas de svg relativas a la raíz del repo. Playwright: /opt/node-tools o el del repo.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const [sbPath, outDir] = args.filter((a) => !a.startsWith("--"));
const FORZAR = args.includes("--forzar");
if (!sbPath || !outDir) {
  console.error("uso: node capturar.mjs <storyboard.json> <carpeta-assets> [--forzar]");
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
  console.error("capturar: falta playwright. npm i -D playwright (o usar /opt/node-tools)");
  process.exit(1);
}

const { chromium } = playwright();
const browser = await chromium.launch(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {});

for (const c of sb.capturas || []) {
  const png = join(outDir, `${c.id}.png`);
  if (!FORZAR && existsSync(png) && meta[c.id]) { console.log(`= ${c.id} (ya existe)`); continue; }
  const alto = c.alto_css || 500;
  const ctx = await browser.newContext({
    viewport: { width: c.ancho_css || 560, height: alto + 400 },
    deviceScaleFactor: 2,
    colorScheme: c.esquema || "dark",
  });
  const page = await ctx.newPage();
  const r = await page.goto(c.url, { waitUntil: "networkidle", timeout: 90000 });
  if (!r || r.status() >= 400) {
    console.error(`capturar: ${c.url} respondió ${r && r.status()} — no hay captura real; usá una tarjeta dibujada y decilo`);
    process.exit(3);
  }
  await page.waitForTimeout(1200);
  // Busca el texto en los nodos de texto (cruza <code>, <strong>…) y devuelve su rectángulo en coordenadas de página.
  const buscar = async (frase, desdeY = -1) =>
    page.evaluate(([frase, desdeY]) => {
      const nodos = [];
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: (n) => (n.parentElement && !/^(SCRIPT|STYLE|NOSCRIPT)$/.test(n.parentElement.tagName)
          && n.parentElement.offsetParent !== null ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
      });
      let todo = "";
      for (let n = w.nextNode(); n; n = w.nextNode()) { nodos.push([n, todo.length]); todo += n.nodeValue; }
      const norm = (s) => s.replace(/\s+/g, " ");
      // índice sobre el texto con espacios colapsados → mapa al índice crudo
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
  let y0 = 0;
  if (c.ancla) {
    const ra = await buscar(c.ancla);
    if (!ra) { console.error(`capturar: no encontré el ancla «${c.ancla}» en ${c.url}`); process.exit(4); }
    y0 = Math.max(0, ra[1] - (c.margen ?? 18));
  }
  await page.evaluate((y) => window.scrollTo(0, y), y0);
  await page.waitForTimeout(500);
  const scrollY = await page.evaluate(() => window.scrollY);
  // Lo fijo (barra de arriba, caja «Ask a question» de abajo) taparía el texto del recorte.
  await page.evaluate((modo) => {
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      if (cs.position !== "fixed" && cs.position !== "sticky") continue;
      const r = el.getBoundingClientRect();
      if (modo === "ocultar" || r.top > window.innerHeight / 2) el.style.visibility = "hidden";
    }
  }, c.fijos || "ocultar");
  await page.waitForTimeout(200);
  const clipTop = y0 - scrollY; // si el scroll no llegó (final de página), compensa
  await page.screenshot({ path: png, clip: { x: 0, y: clipTop, width: c.ancho_css || 560, height: alto } });
  const frases = {};
  for (const f of c.frases || []) {
    const rf = await buscar(f, y0);
    if (!rf) { console.error(`capturar: «${f}» no aparece en ${c.id}`); process.exit(5); }
    const [x, y, w, h] = rf;
    if (y + h > y0 + alto) { console.error(`capturar: «${f}» cae fuera del recorte de ${c.id} (subí alto_css)`); process.exit(5); }
    frases[f] = [x * 2, (y - y0) * 2, w * 2, h * 2].map((v) => Math.round(v));
  }
  meta[c.id] = { url: c.url, w: (c.ancho_css || 560) * 2, h: alto * 2, frases };
  console.log(`+ ${c.id}.png  ${Object.keys(frases).length} frases`);
  await ctx.close();
}

for (const l of sb.logos_svg || []) {
  const png = join(outDir, `${l.id}.png`);
  if (!FORZAR && existsSync(png)) { console.log(`= ${l.id} (ya existe)`); continue; }
  const svg = readFileSync(resolve(REPO, l.svg), "utf8");
  const ctx = await browser.newContext({ viewport: { width: l.alto * 4, height: l.alto }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.setContent(`<html><body style="margin:0;background:transparent">
    <img id="l" style="height:${l.alto}px;display:block" src="data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}"></body></html>`);
  await page.locator("#l").screenshot({ path: png, omitBackground: true });
  console.log(`+ ${l.id}.png (logo)`);
  await ctx.close();
}

await browser.close();
writeFileSync(jsonPath, JSON.stringify(meta, null, 1));
