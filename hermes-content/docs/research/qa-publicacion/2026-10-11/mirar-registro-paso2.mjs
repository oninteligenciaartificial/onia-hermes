// Q9b (11-oct): el paso 2 de /register de app.onia.com.bo, a 390 y 1440. Solo elige un rubro (un clic en una tarjeta):
// no escribe en ningún campo ni envía el formulario, así que no crea ninguna cuenta. Mismo método TLS que mirar-publico.mjs
// (cada pedido lo hace Node con route.fetch y NODE_EXTRA_CA_CERTS). Uso: node mirar-registro-paso2.mjs <carpeta> <etiqueta>
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [SALIDA, ETIQUETA] = process.argv.slice(2);
mkdirSync(SALIDA, { recursive: true });
const URL = "https://app.onia.com.bo/register";
// Segunda persona (tú y vos) que no debe ver un cliente: lista corta y explícita, con límites de palabra.
const SEGUNDA = /(?<![\p{L}\p{N}_])(tu|tus|tuyo|tuya|vas|eres|tienes|puedes|quieres|tenés|podés|querés|elegí|ingresá|probá|elige|ingresa|revisa|escribe|selecciona|vos)(?![\p{L}\p{N}_])/giu;
const browser = await chromium.launch();
const resultado = { cuando: new Date().toISOString(), url: URL, anchos: {} };
for (const ancho of [390, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: ancho, height: ancho === 390 ? 844 : 1000 }, locale: "es-BO" });
  await ctx.route("**/*", async (route) => {
    try { await route.fulfill({ response: await route.fetch() }); } catch { await route.abort(); }
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1000);
  const tarjeta = page.getByRole("button", { name: /Clínica dental/i }).first();
  const hay = (await tarjeta.count()) > 0;
  if (hay) { await tarjeta.click(); await page.waitForTimeout(1200); }
  const texto = await page.evaluate(() => document.body.innerText);
  const archivo = `${ETIQUETA}-register-paso2-${ancho}.png`;
  await page.screenshot({ path: join(SALIDA, archivo), fullPage: true });
  const segunda = [...texto.matchAll(SEGUNDA)].map((m) => m[0]);
  resultado.anchos[ancho] = { tarjetaEncontrada: hay, archivo, segundaPersona: segunda, texto: texto.slice(0, 900) };
  await ctx.close();
}
await browser.close();
writeFileSync(join(SALIDA, `${ETIQUETA}-register-paso2.json`), JSON.stringify(resultado, null, 2));
console.log(JSON.stringify(resultado, null, 1));
