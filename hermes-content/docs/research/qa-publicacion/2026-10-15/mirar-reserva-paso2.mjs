// Mira el PASO 2 («Fecha») de la reserva pública /book/<slug>, a 390 y 1440, SIN reservar nada: elige al profesional, lee los topes del selector
// de fecha (min y max) y se va. No elige una fecha, no aprieta un horario y no envía datos: reservar es otra autorización, y la página solo hace
// GET hasta el último paso.
// Qué comprueba: desde el pulido 11a (#181, publicado 16-oct 09:50 UTC) `min` es HOY en La Paz y `max` es hoy + 30 días sobre el calendario
// (`lib/agenda/rango-de-reserva.ts`). Antes salían del día de UTC: de las 20:00 a las 24:00 de La Paz (00:00-04:00 UTC) `min` ya era mañana y el
// calendario no dejaba elegir hoy. Fuera de esa franja los dos relojes coinciden y la prueba no distingue; por eso se mira a las 00:30 UTC.
// Uso: NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt node mirar-reserva-paso2.mjs <carpeta> <etiqueta> <slug>
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [SALIDA, ETIQUETA, SLUG] = process.argv.slice(2);
if (!SALIDA || !ETIQUETA || !SLUG) { console.error("uso: node mirar-reserva-paso2.mjs <carpeta> <etiqueta> <slug>"); process.exit(64); }
mkdirSync(SALIDA, { recursive: true });
const BASE = (process.env.BASE || "https://app.onia.com.bo").replace(/\/$/, "");

const hoyLaPaz = new Intl.DateTimeFormat("en-CA", { timeZone: "America/La_Paz" }).format(new Date());
const masDias = (dia, n) => {
  const [a, m, d] = dia.split("-").map(Number);
  const s = new Date(Date.UTC(a, m - 1, d + n));
  return `${s.getUTCFullYear()}-${String(s.getUTCMonth() + 1).padStart(2, "0")}-${String(s.getUTCDate()).padStart(2, "0")}`;
};
const esperado = { min: hoyLaPaz, max: masDias(hoyLaPaz, 30) };

const browser = await chromium.launch();
const resultado = { cuando: new Date().toISOString(), hoyEnUtc: new Date().toISOString().slice(0, 10), esperado, anchos: {} };
for (const ancho of [390, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: ancho, height: ancho === 390 ? 844 : 1000 }, locale: "es-BO" });
  await ctx.route("**/*", async (r) => { try { await r.fulfill({ response: await r.fetch() }); } catch { await r.abort(); } });
  const page = await ctx.newPage();
  const pedidosNoGet = [];
  page.on("request", (rq) => { if (rq.method() !== "GET" && rq.method() !== "HEAD") pedidosNoGet.push(`${rq.method()} ${rq.url()}`); });
  try {
    await page.goto(`${BASE}/book/${SLUG}`, { waitUntil: "networkidle", timeout: 60000 });
    // La tarjeta del profesional es el primer texto con nombre propio de la lista; «Profesional» a secas es también el rótulo del primer paso.
    await page.locator("text=/^Elija su profesional/").first().waitFor({ timeout: 15000 });
    const tarjeta = page.locator("[role=radio], [role=button], button, label, div").filter({ hasText: /Profesional$/ }).filter({ has: page.locator("text=/^[A-ZÁÉÍÓÚ][\\p{L}.]+ [\\p{L} .]+$/u") }).last();
    await tarjeta.click({ timeout: 15000 });
    await page.waitForTimeout(1500);
    const fecha = await page.evaluate(() => {
      const i = document.querySelector("input[type=date]");
      return i ? { min: i.getAttribute("min"), max: i.getAttribute("max"), value: i.value } : null;
    });
    const archivo = `${ETIQUETA}-reserva-paso2-${ancho}.png`;
    await page.screenshot({ path: join(SALIDA, archivo), fullPage: true });
    resultado.anchos[ancho] = { archivo, fecha, coincideConLoEsperado: !!fecha && fecha.min === esperado.min && fecha.max === esperado.max, pedidosNoGet };
  } catch (e) {
    resultado.anchos[ancho] = { falla: String(e.message).slice(0, 220), pedidosNoGet };
  }
  await ctx.close();
}
await browser.close();
writeFileSync(join(SALIDA, `${ETIQUETA}-reserva-paso2.json`), JSON.stringify(resultado, null, 1));
console.log(JSON.stringify(resultado, null, 1));
