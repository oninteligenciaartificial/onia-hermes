// Mira el ÁRBOL DE ACCESIBILIDAD de las pantallas públicas y cuenta cuántos íconos de Material Symbols aparecen leídos como texto (pulido 11b, #182).
// Un ícono de ligadura es texto («credit_card_off»); sin `aria-hidden` el lector de pantalla dice su nombre. El script lista los nombres de ligadura que
// hay en el DOM (elementos `.material-symbols-outlined`) y revisa cuáles aparecen en el árbol de accesibilidad (`ariaSnapshot`). Solo lectura: no escribe ni envía.
// Uso: NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt node mirar-arbol-de-accesibilidad.mjs <carpeta> <etiqueta> <ruta> [<ruta> ...]
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [SALIDA, ETIQUETA, ...RUTAS] = process.argv.slice(2);
if (!SALIDA || !ETIQUETA || RUTAS.length === 0) { console.error("uso: node mirar-arbol-de-accesibilidad.mjs <carpeta> <etiqueta> <ruta> [<ruta> ...]"); process.exit(64); }
mkdirSync(SALIDA, { recursive: true });
const BASE = (process.env.BASE || "https://app.onia.com.bo").replace(/\/$/, "");
const resultado = { cuando: new Date().toISOString(), rutas: {} };
const browser = await chromium.launch();
for (const ruta of RUTAS) {
  resultado.rutas[ruta] = {};
  for (const ancho of [390, 1440]) {
    const ctx = await browser.newContext({ viewport: { width: ancho, height: ancho === 390 ? 844 : 1000 }, locale: "es-BO" });
    await ctx.route("**/*", async (r) => { try { await r.fulfill({ response: await r.fetch() }); } catch { await r.abort(); } });
    const page = await ctx.newPage();
    try {
      await page.goto(`${BASE}${ruta}`, { waitUntil: "networkidle", timeout: 60000 });
      await page.waitForTimeout(1000);
      const iconos = await page.evaluate(() => [...document.querySelectorAll(".material-symbols-outlined")].map((e) => ({
        nombre: (e.textContent || "").trim(), ocultoEnSuTramo: !!e.closest("[aria-hidden=true]"),
      })));
      const arbol = await page.locator("body").ariaSnapshot();
      const nombres = [...new Set(iconos.map((i) => i.nombre).filter(Boolean))];
      const leidos = nombres.filter((n) => new RegExp(`(^|[^A-Za-z0-9_])${n}([^A-Za-z0-9_]|$)`).test(arbol));
      resultado.rutas[ruta][ancho] = {
        iconosEnElDom: iconos.length, nombresDeIcono: nombres,
        sinAriaHidden: iconos.filter((i) => !i.ocultoEnSuTramo).length,
        leidosEnElArbol: leidos, lineasDelArbol: arbol.split("\n").length,
      };
      writeFileSync(join(SALIDA, `${ETIQUETA}-arbol-${ruta.replace(/\W+/g, "_")}-${ancho}.txt`), arbol);
    } catch (e) {
      resultado.rutas[ruta][ancho] = { falla: String(e.message).slice(0, 220) };
    }
    await ctx.close();
  }
}
await browser.close();
writeFileSync(join(SALIDA, `${ETIQUETA}-arbol.json`), JSON.stringify(resultado, null, 1));
for (const [r, v] of Object.entries(resultado.rutas)) for (const [w, x] of Object.entries(v)) console.log(r, w, x.falla ? "FALLA " + x.falla : `iconos=${x.iconosEnElDom} sinAriaHidden=${x.sinAriaHidden} leidosEnElArbol=${JSON.stringify(x.leidosEnElArbol)}`);
