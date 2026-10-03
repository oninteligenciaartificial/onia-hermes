// capturar.mjs — pruebas reales para la receta Erik Taveras: capturas de una página oficial y logos SVG rasterizados.
//
// Uso:  node capturar.mjs <spec.json> <carpeta-salida>
//
// spec.json:
// {
//   "url": "https://code.claude.com/docs/en/permission-modes",
//   "ancho_css": 900,                       // ventana; la captura sale a 1080 px de ancho (dsf = 1080 / ancho_css)
//   "alto_salida": 606,                     // la captura de la lámina G mide 1080×606 (22-53 % del cuadro)
//   "ocultar": ["#navbar", ".sticky.bottom-0"],   // barras fijas que taparían el texto
//   "capturas": [
//     { "nombre": "cap-modos",
//       "ancla": { "selector": "h1", "texto": "Choose a permission mode" },   // primer elemento que contiene ese texto
//       "margen_sup": 16,                   // px CSS por encima del ancla
//       "marca": { "texto": "a second model, the classifier, reviews actions instead of you" } }  // opcional
//   ],
//   "logos": [ { "nombre": "logo-claudecode", "svg": "ruta.svg", "color": "#D97757", "alto": 256 } ]
// }
//
// Escribe <nombre>.png por captura y por logo, y capturas.json con el rectángulo de cada «marca» en píxeles de
// la captura (lo usa erik_edit.py para dibujar el contorno verde y la pastilla sobre la línea clave).
// Playwright: usa playwright-core de /opt/node-tools o el del repo; Chromium de /opt/pw-browsers o CAROUSEL_BROWSER.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve, dirname, join } from "node:path";

const [specPath, outDir] = process.argv.slice(2);
if (!specPath || !outDir) {
  console.error("uso: node capturar.mjs <spec.json> <carpeta-salida>");
  process.exit(2);
}
const spec = JSON.parse(readFileSync(specPath, "utf8"));
const base = dirname(resolve(specPath));
mkdirSync(outDir, { recursive: true });

function cargarPlaywright() {
  const anclas = ["/opt/node-tools/package.json", join(process.cwd(), "package.json"),
    resolve(new URL("../../../../../package.json", import.meta.url).pathname)];
  for (const a of anclas) {
    for (const mod of ["playwright", "playwright-core"]) {
      try { return createRequire(a)(mod); } catch { /* sigue */ }
    }
  }
  console.error("capturar: falta playwright(-core). Instalalo: npm i -D playwright-core");
  process.exit(1);
}

function chromiumPath() {
  if (process.env.CAROUSEL_BROWSER && existsSync(process.env.CAROUSEL_BROWSER)) return process.env.CAROUSEL_BROWSER;
  const raiz = "/opt/pw-browsers";
  if (existsSync(raiz)) {
    for (const d of readdirSync(raiz).filter((x) => /^chromium-\d+/.test(x)).sort().reverse()) {
      const p = join(raiz, d, "chrome-linux", "chrome");
      if (existsSync(p)) return p;
    }
  }
  return undefined; // que playwright use el suyo
}

const { chromium } = cargarPlaywright();
const browser = await chromium.launch({ executablePath: chromiumPath(), args: ["--no-sandbox"] });
const anchoCss = spec.ancho_css ?? 900;
const dsf = 1080 / anchoCss;
const altoSalida = spec.alto_salida ?? 606;
const resultado = { url: spec.url, fecha: new Date().toISOString(), capturas: {}, logos: {} };

if (spec.capturas?.length) {
  const page = await browser.newPage({ viewport: { width: anchoCss, height: 1400 }, deviceScaleFactor: dsf, colorScheme: spec.tema ?? "light" });
  const resp = await page.goto(spec.url, { waitUntil: "networkidle", timeout: 90000 });
  if (!resp || resp.status() >= 400) {
    console.error(`capturar: ${spec.url} respondió ${resp?.status()} — usá un mockup dibujado y decilo en el reporte`);
    process.exit(3);
  }
  for (const sel of spec.ocultar ?? []) {
    await page.addStyleTag({ content: `${sel}{display:none !important}` });
  }
  for (const c of spec.capturas) {
    const ancla = page.locator(c.ancla.selector ?? "*", { hasText: c.ancla.texto }).first();
    await ancla.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    const bb = await ancla.boundingBox();
    if (!bb) throw new Error(`no encontré el ancla «${c.ancla.texto}»`);
    const scroll = await page.evaluate(() => window.scrollY);
    // la captura cubre todo el ancho de la ventana; el alto sale de 606 px de salida
    const clip = { x: 0, y: bb.y - (c.margen_sup ?? 16), width: anchoCss, height: altoSalida / dsf };
    const archivo = join(outDir, `${c.nombre}.png`);
    await page.screenshot({ path: archivo, clip });
    let marca = null;
    if (c.marca?.texto) {
      const r = await page.evaluate(([texto, sel, txtAncla]) => {
        const walker = document.createTreeWalker(document.querySelector("main") ?? document.body, NodeFilter.SHOW_TEXT);
        // la marca se busca DESDE el ancla: la misma frase puede aparecer antes en la página
        const ancla = [...document.querySelectorAll(sel)].find((e) => e.textContent.includes(txtAncla));
        const nodos = [];
        let n;
        while ((n = walker.nextNode())) {
          if (!ancla || ancla.contains(n) || (ancla.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_FOLLOWING)) nodos.push(n);
        }
        const plano = nodos.map((x) => x.textContent).join("");
        const i = plano.indexOf(texto);
        if (i < 0) return null;
        let acc = 0, ini = null, fin = null;
        for (const x of nodos) {
          const L = x.textContent.length;
          if (ini === null && i < acc + L) ini = [x, i - acc];
          if (i + texto.length <= acc + L) { fin = [x, i + texto.length - acc]; break; }
          acc += L;
        }
        const range = document.createRange();
        range.setStart(ini[0], ini[1]);
        range.setEnd(fin[0], fin[1]);
        const rects = [...range.getClientRects()].filter((q) => q.width > 1);
        const x0 = Math.min(...rects.map((q) => q.left)), y0 = Math.min(...rects.map((q) => q.top));
        const x1 = Math.max(...rects.map((q) => q.right)), y1 = Math.max(...rects.map((q) => q.bottom));
        return { x0, y0, x1, y1 };
      }, [c.marca.texto, c.ancla.selector ?? "*", c.ancla.texto]);
      if (!r) throw new Error(`no encontré el texto a marcar «${c.marca.texto}»`);
      // de coordenadas de ventana a píxeles de la captura
      marca = [r.x0 - clip.x, r.y0 - clip.y, r.x1 - clip.x, r.y1 - clip.y].map((v) => Math.round(v * dsf));
    }
    resultado.capturas[c.nombre] = { archivo: `${c.nombre}.png`, ancho: 1080, alto: altoSalida, marca, scroll };
    console.log(`captura ${c.nombre}: ${archivo}${marca ? ` marca=${marca}` : ""}`);
  }
  await page.close();
}

for (const l of spec.logos ?? []) {
  const svg = readFileSync(resolve(base, l.svg), "utf8");
  const alto = l.alto ?? 256;
  const page = await browser.newPage({ viewport: { width: alto * 4, height: alto }, deviceScaleFactor: 1 });
  await page.setContent(`<html><body style="margin:0;background:transparent">
    <div id="l" style="display:inline-block;height:${alto}px;color:${l.color ?? "#000"};line-height:0">${svg
      .replace(/\s(height|width)="[^"]*"/g, "").replace(/style="[^"]*"/, "")
      .replace("<svg", `<svg width="${alto}" height="${alto}"`)}</div></body></html>`);
  const el = page.locator("#l");
  const archivo = join(outDir, `${l.nombre}.png`);
  await el.screenshot({ path: archivo, omitBackground: true });
  resultado.logos[l.nombre] = { archivo: `${l.nombre}.png` };
  console.log(`logo ${l.nombre}: ${archivo}`);
  await page.close();
}

await browser.close();
writeFileSync(join(outDir, "capturas.json"), JSON.stringify(resultado, null, 2));
