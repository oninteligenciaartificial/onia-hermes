// Mira dónde cae el FOCO y qué anuncia la región cortés cuando la reserva pública /book/<slug> pasa del paso 1 al 2 (pulido 12, #183), a 390 y 1440,
// SIN reservar nada: elige al profesional con un clic y se va. No elige fecha ni horario y no envía datos; registra todo pedido que no sea GET.
// Qué comprueba: ANTES de #183 el foco cae en <body> y no hay región `role=status`; DESPUÉS cae en el título del paso nuevo (`h2#book-paso-2-titulo`) y la región dice
// «Paso 2 de 4: Elija la fecha». También anota el rol del grupo de profesionales (antes un `div` suelto con `aria-pressed` en cada botón; después `role=group` con nombre).
// Uso: NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt node mirar-foco-reserva.mjs <carpeta> <etiqueta> <slug>
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [SALIDA, ETIQUETA, SLUG] = process.argv.slice(2);
if (!SALIDA || !ETIQUETA || !SLUG) { console.error("uso: node mirar-foco-reserva.mjs <carpeta> <etiqueta> <slug>"); process.exit(64); }
mkdirSync(SALIDA, { recursive: true });
const BASE = (process.env.BASE || "https://app.onia.com.bo").replace(/\/$/, "");
const browser = await chromium.launch();
const resultado = { cuando: new Date().toISOString(), anchos: {} };
for (const ancho of [390, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: ancho, height: ancho === 390 ? 844 : 1000 }, locale: "es-BO" });
  await ctx.route("**/*", async (r) => { try { await r.fulfill({ response: await r.fetch() }); } catch { await r.abort(); } });
  const page = await ctx.newPage();
  const pedidosNoGet = [];
  // `/cdn-cgi/rum` es la baliza de Cloudflare (la mide el borde, no la página): no es un envío de la reserva.
  page.on("request", (rq) => { if (rq.method() !== "GET" && rq.method() !== "HEAD" && !rq.url().includes("/cdn-cgi/")) pedidosNoGet.push(`${rq.method()} ${rq.url()}`); });
  try {
    await page.goto(`${BASE}/book/${SLUG}`, { waitUntil: "networkidle", timeout: 60000 });
    await page.locator("text=/^Elija su profesional/").first().waitFor({ timeout: 15000 });
    const paso1 = await page.evaluate(() => {
      const h = [...document.querySelectorAll("h2")].find((x) => /^Elija su /.test((x.textContent || "").trim()));
      // La lista es el padre común de los botones de profesional (su texto termina en «Profesional»).
      const botones = [...document.querySelectorAll("button")].filter((b) => /Profesional$/.test((b.textContent || "").trim()));
      const lista = botones[0]?.parentElement ?? null;
      return {
        tituloId: h?.id || null, tituloTabindex: h?.getAttribute("tabindex") ?? null,
        listaRol: lista?.getAttribute("role") ?? null, listaNombre: lista?.getAttribute("aria-labelledby") ?? null,
        botones: botones.length, conAriaPressed: botones.filter((b) => b.hasAttribute("aria-pressed")).length,
        regionStatus: document.querySelector("[role=status]")?.textContent ?? null,
        foco: document.activeElement ? `${document.activeElement.tagName}#${document.activeElement.id}` : null,
      };
    });
    const tarjeta = page.locator("[role=radio], [role=button], button, label, div").filter({ hasText: /Profesional$/ }).filter({ has: page.locator("text=/^[A-ZÁÉÍÓÚ][\\p{L}.]+ [\\p{L} .]+$/u") }).last();
    await tarjeta.click({ timeout: 15000 });
    await page.waitForTimeout(1500);
    const paso2 = await page.evaluate(() => ({
      foco: document.activeElement ? `${document.activeElement.tagName}#${document.activeElement.id}` : null,
      focoTexto: (document.activeElement?.textContent || "").trim().slice(0, 60),
      regionStatus: document.querySelector("[role=status]")?.textContent ?? null,
      regionLive: document.querySelector("[role=status]")?.getAttribute("aria-live") ?? null,
    }));
    resultado.anchos[ancho] = { paso1, paso2, pedidosNoGet };
  } catch (e) {
    resultado.anchos[ancho] = { falla: String(e.message).slice(0, 220), pedidosNoGet };
  }
  await ctx.close();
}
await browser.close();
writeFileSync(join(SALIDA, `${ETIQUETA}-foco-reserva.json`), JSON.stringify(resultado, null, 1));
console.log(JSON.stringify(resultado, null, 1));
