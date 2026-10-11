// capturar-meta.mjs — copia de erik/capturar.mjs adaptada a developers.facebook.com (NO se tocó el original).
// Cambios: (1) el ancla es el elemento MÁS PROFUNDO que contiene el texto (las clases de Meta son hashes y los párrafos son <div>:
// con locator(...).first() sale el ancestro más grande); (2) oculta todo lo fixed y pasa lo sticky a static (cabeceras y overlays);
// (3) escribe capturas.json con url, fecha y hora UTC (el original solo guarda fecha ISO), y (4) loguea el status HTTP.
// Uso: node capturar-meta.mjs <spec.json> <carpeta-salida>   (mismo formato de spec que capturar.mjs)
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve, dirname, join } from "node:path";

const [specPath, outDir] = process.argv.slice(2);
if (!specPath || !outDir) { console.error("uso: node capturar-meta.mjs <spec.json> <carpeta-salida>"); process.exit(2); }
const spec = JSON.parse(readFileSync(specPath, "utf8"));
const base = dirname(resolve(specPath));
mkdirSync(outDir, { recursive: true });

function cargarPlaywright() {
  for (const a of ["/opt/node-tools/package.json", join(process.cwd(), "package.json")]) {
    for (const mod of ["playwright", "playwright-core"]) { try { return createRequire(a)(mod); } catch { /* sigue */ } }
  }
  console.error("falta playwright(-core)"); process.exit(1);
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
  return undefined;
}

const { chromium } = cargarPlaywright();
const browser = await chromium.launch({ executablePath: chromiumPath(), args: ["--no-sandbox"] });
const anchoCss = spec.ancho_css ?? 900;
const dsf = 1080 / anchoCss;
const altoSalida = spec.alto_salida ?? 606;
const ahora = new Date();
const resultado = { url: spec.url, fecha: ahora.toISOString().slice(0, 10), hora_utc: ahora.toISOString().slice(11, 16), http: null, capturas: {}, logos: {} };

if (spec.capturas?.length) {
  const page = await browser.newPage({ viewport: { width: anchoCss, height: 1400 }, deviceScaleFactor: dsf, colorScheme: spec.tema ?? "light" });
  const resp = await page.goto(spec.url, { waitUntil: "networkidle", timeout: 90000 });
  resultado.http = resp?.status() ?? null;
  resultado.url_final = page.url();
  if (!resp || resp.status() >= 400) {
    console.error(`capturar: ${spec.url} respondió ${resp?.status()} — tarjeta de texto sin captura y decilo en el reporte`);
    process.exit(3);
  }
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    for (const e of document.querySelectorAll("*")) {
      const p = getComputedStyle(e).position;
      if (p === "fixed") e.style.setProperty("display", "none", "important");
      else if (p === "sticky") e.style.setProperty("position", "static", "important");
    }
  });
  for (const sel of spec.ocultar ?? []) await page.addStyleTag({ content: `${sel}{display:none !important}` });
  for (const c of spec.capturas) {
    // ancla = elemento más profundo cuyo texto contiene el ancla (ninguno de sus hijos la contiene entera)
    const h = await page.evaluateHandle(([txt]) => {
      let mejor = null;
      for (const e of document.querySelectorAll("main *, body *")) {
        if (!e.textContent.includes(txt)) continue;
        if ([...e.children].some((k) => k.textContent.includes(txt))) continue;
        const r = e.getBoundingClientRect();
        if (r.width < 5 || r.height < 5) continue;
        mejor = e; break;
      }
      return mejor;
    }, [c.ancla.texto]);
    const ancla = h.asElement();
    if (!ancla) throw new Error(`no encontré el ancla «${c.ancla.texto}»`);
    await ancla.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    const bb = await ancla.boundingBox();
    const scroll = await page.evaluate(() => window.scrollY);
    const clip = { x: 0, y: bb.y - (c.margen_sup ?? 16), width: anchoCss, height: altoSalida / dsf };
    const archivo = join(outDir, `${c.nombre}.png`);
    await page.screenshot({ path: archivo, clip });
    let marca = null;
    if (c.marca?.texto) {
      const r = await page.evaluate(([texto, anc]) => {
        const walker = document.createTreeWalker(document.querySelector("main") ?? document.body, NodeFilter.SHOW_TEXT);
        const nodos = []; let n;
        while ((n = walker.nextNode())) nodos.push(n);
        // el rango se busca DESDE el texto del ancla (la misma frase puede aparecer antes en la página)
        const plano = nodos.map((x) => x.textContent).join("");
        const base = plano.indexOf(anc);
        const i = plano.indexOf(texto, Math.max(0, base));
        if (i < 0) return null;
        let acc = 0, ini = null, fin = null;
        for (const x of nodos) {
          const L = x.textContent.length;
          if (ini === null && i < acc + L) ini = [x, i - acc];
          if (i + texto.length <= acc + L) { fin = [x, i + texto.length - acc]; break; }
          acc += L;
        }
        const range = document.createRange();
        range.setStart(ini[0], ini[1]); range.setEnd(fin[0], fin[1]);
        const rects = [...range.getClientRects()].filter((q) => q.width > 1);
        const lineas = new Set(rects.map((q) => Math.round(q.top / 4))).size;
        return { x0: Math.min(...rects.map((q) => q.left)), y0: Math.min(...rects.map((q) => q.top)),
                 x1: Math.max(...rects.map((q) => q.right)), y1: Math.max(...rects.map((q) => q.bottom)), lineas };
      }, [c.marca.texto, c.ancla.texto]);
      if (!r) throw new Error(`no encontré el texto a marcar «${c.marca.texto}»`);
      if (r.lineas > 1) console.warn(`AVISO: la marca «${c.marca.texto}» cae en ${r.lineas} renglones: dibuja un bloque de los dos`);
      marca = [r.x0 - clip.x, r.y0 - clip.y, r.x1 - clip.x, r.y1 - clip.y].map((v) => Math.round(v * dsf));
    }
    resultado.capturas[c.nombre] = { archivo: `${c.nombre}.png`, ancho: 1080, alto: altoSalida, marca, scroll, ancla: c.ancla.texto, marca_texto: c.marca?.texto ?? null };
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
  const archivo = join(outDir, `${l.nombre}.png`);
  await page.locator("#l").screenshot({ path: archivo, omitBackground: true });
  resultado.logos[l.nombre] = { archivo: `${l.nombre}.png` };
  console.log(`logo ${l.nombre}: ${archivo}`);
  await page.close();
}
await browser.close();
writeFileSync(join(outDir, "capturas.json"), JSON.stringify(resultado, null, 2));
