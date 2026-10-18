// E1 (madre DESARROLLO-INFRA, 11-oct): páginas PÚBLICAS a 390 y 1440 px, sin sesión, solo lectura.
// Uso: [BASE=https://onia.com.bo] node mirar-publico.mjs <carpeta> <etiqueta> /login /book ...   (BASE por omisión: app.onia.com.bo)
// Por cada ruta y ancho: estado, tiempo, título de la pestaña, descripción, tarjeta al compartir (og/twitter), huella del
// build: `buildId` (el id que Next pone en el HTML) es la huella de cada build; el nombre de webpack-<hash>.js NO lo es (medido el 11-oct), ligaduras de íconos dibujadas como texto, textos de obra y voseo/tuteo visibles.
// Chromium no valida el certificado del proxy de la nube: cada pedido lo hace Node (route.fetch, con NODE_EXTRA_CA_CERTS),
// así que la verificación TLS sigue entera.
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [SALIDA, ETIQUETA, ...RUTAS] = process.argv.slice(2);
if (!SALIDA || !ETIQUETA || RUTAS.length === 0) {
  console.error("uso: node mirar-publico.mjs <carpeta> <etiqueta> <ruta>...");
  process.exit(64);
}
mkdirSync(SALIDA, { recursive: true });

const BASE = (process.env.BASE || "https://app.onia.com.bo").replace(/\/$/, "");
const OBRA = /muy pronto|pr[óo]ximamente|en construcci[óo]n|\bbeta\b|borrador|\[CONFIRMAR|\[X\]/i;
const TUTEO = /(?<![\p{L}\p{N}_])(?:tu|tus|tú|te|ti|vos|tenés|podés|querés|hacé|entrá|escribí|mirá|elegí|ingresá|probá|empezá)(?![\p{L}\p{N}_])/iu;

const browser = await chromium.launch();
const resultado = { cuando: new Date().toISOString(), rutas: {} };
for (const ruta of RUTAS) {
  const url = `${BASE}${ruta}`;
  resultado.rutas[ruta] = {};
  for (const ancho of [390, 1440]) {
    const ctx = await browser.newContext({ viewport: { width: ancho, height: ancho === 390 ? 844 : 1000 }, locale: "es-BO" });
    await ctx.route("**/*", async (r) => {
      try { await r.fulfill({ response: await r.fetch() }); } catch { await r.abort(); }
    });
    const page = await ctx.newPage();
    const errores = [];
    page.on("console", (m) => { if (m.type() === "error") errores.push(m.text().slice(0, 160)); });
    const t0 = Date.now();
    let estado = null;
    let crudo = "";
    try {
      const resp = await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
      estado = resp.status();
      try { crudo = await resp.text(); } catch { /* una redirección no trae cuerpo */ }
    } catch (e) {
      resultado.rutas[ruta][ancho] = { estado: null, falla: String(e.message).slice(0, 200) };
      await ctx.close();
      continue;
    }
    await page.waitForTimeout(1500);
    const html = await page.content();
    // El BUILD_ID de Next viaja en el payload RSC del HTML: \"b\":\"<id>\". Cambia con CADA build (medido el 11-oct:
    // D5DzLXxrhp8Sx1o0cQhQs en la imagen con #136 y #146). Es la huella buena; el nombre de webpack-<hash>.js no sirve.
    const buildId = (crudo.match(/\\"b\\":\\"([^\\"]+)\\"/) || [])[1] || null;
    const runtime = ([...new Set(html.match(/\/_next\/static\/chunks\/[^"' ]+\.js/g) || [])].find((c) => /webpack-/.test(c)) || "").split("/").pop() || null;
    const meta = await page.evaluate(() => {
      const m = (s) => document.querySelector(s)?.getAttribute("content") || null;
      return {
        titulo: document.title,
        descripcion: m('meta[name="description"]'),
        ogTitulo: m('meta[property="og:title"]'),
        ogDescripcion: m('meta[property="og:description"]'),
        twTitulo: m('meta[name="twitter:title"]'),
        manifest: document.querySelector('link[rel="manifest"]')?.getAttribute("href") || null,
        url: location.pathname + location.search,
      };
    });
    const texto = await page.evaluate(() => document.body.innerText);
    const ligaduras = await page.evaluate(() => [...document.querySelectorAll(".material-symbols-outlined, .material-symbols-rounded, .material-icons")]
      .map((e) => ({ t: e.textContent.trim(), w: e.getBoundingClientRect().width, h: e.getBoundingClientRect().height }))
      .filter((x) => x.t && x.w > x.h * 2.5));
    const desborde = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    const archivo = `${ETIQUETA}${ruta === "/" ? "-home" : ruta.replace(/[^a-z0-9]+/gi, "-")}-${ancho}.png`;
    await page.screenshot({ path: join(SALIDA, archivo), fullPage: true });
    const lineas = texto.split("\n").map((l) => l.trim()).filter(Boolean);
    resultado.rutas[ruta][ancho] = {
      estado, ms: Date.now() - t0, buildId, build: runtime, archivo, ...meta, desbordeHorizontal: desborde,
      ligadurasComoTexto: ligaduras,
      precios: lineas.filter((l) => /\bBs\.?\s?\d|\d[\d.,]*\s?Bs\b|\$\s?\d|US\$|USD/i.test(l)).slice(0, 40),
      obra: lineas.filter((l) => OBRA.test(l)).slice(0, 8),
      voseoOTuteoVisible: lineas.filter((l) => TUTEO.test(l)).slice(0, 8),
      errores, inicio: lineas.slice(0, 12),
    };
    await ctx.close();
  }
}
await browser.close();
writeFileSync(join(SALIDA, `${ETIQUETA}-publico.json`), JSON.stringify(resultado, null, 2));
console.log(JSON.stringify(resultado, null, 1));
