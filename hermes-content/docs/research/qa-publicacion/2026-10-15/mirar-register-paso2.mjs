// Mira el PASO 2 del asistente de alta (/register) en dos rubros, a 390 y 1440, SIN enviar nada: elige el rubro, lee el formulario y se va.
// El paso 1 ya lo mira `mirar-publico.mjs`; el paso 2 (nombre, correo, contraseña, nombre del negocio, el botón «Crear mi cuenta») es el último
// clic del embudo y no se ve sin hacer clic. No escribe en ningún campo ni aprieta «Crear»: crear cuentas es otra autorización.
// Uso: NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt node mirar-register-paso2.mjs <carpeta> <etiqueta>
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [SALIDA, ETIQUETA] = process.argv.slice(2);
if (!SALIDA || !ETIQUETA) { console.error("uso: node mirar-register-paso2.mjs <carpeta> <etiqueta>"); process.exit(64); }
mkdirSync(SALIDA, { recursive: true });
const BASE = (process.env.BASE || "https://app.onia.com.bo").replace(/\/$/, "");
const TUTEO = /(?<![\p{L}\p{N}_])(?:tu|tus|tú|te|ti|vos|tenés|podés|querés|hacé|entrá|escribí|mirá|elegí|ingresá|probá|empezá|creá|completá)(?![\p{L}\p{N}_])/iu;
const OBRA = /muy pronto|pr[óo]ximamente|en construcci[óo]n|\bbeta\b|borrador/i;
const RUBROS = [["dental", /Cl[ií]nica dental/i], ["comercio", /Comercio/i]];

const browser = await chromium.launch();
const resultado = { cuando: new Date().toISOString(), rubros: {} };
for (const [rubro, tarjeta] of RUBROS) {
  resultado.rubros[rubro] = {};
  for (const ancho of [390, 1440]) {
    const ctx = await browser.newContext({ viewport: { width: ancho, height: ancho === 390 ? 844 : 1000 }, locale: "es-BO" });
    await ctx.route("**/*", async (r) => { try { await r.fulfill({ response: await r.fetch() }); } catch { await r.abort(); } });
    const page = await ctx.newPage();
    try {
      await page.goto(`${BASE}/register`, { waitUntil: "networkidle", timeout: 60000 });
      await page.getByRole("button", { name: tarjeta }).first().click({ timeout: 15000 });
      await page.waitForTimeout(1500);
      const lectura = await page.evaluate(() => ({
        titulos: [...document.querySelectorAll("h1,h2")].map((e) => e.innerText.trim()).filter(Boolean),
        etiquetas: [...document.querySelectorAll("label")].map((e) => e.innerText.trim()).filter(Boolean),
        placeholders: [...document.querySelectorAll("input,textarea,select")].map((e) => e.getAttribute("placeholder")).filter(Boolean),
        botones: [...document.querySelectorAll("button,a[role=button]")].map((e) => e.innerText.trim()).filter(Boolean),
        desborde: document.documentElement.scrollWidth > window.innerWidth + 1,
        texto: document.body.innerText,
      }));
      const lineas = lectura.texto.split("\n").map((l) => l.trim()).filter(Boolean);
      const archivo = `${ETIQUETA}-register-paso2-${rubro}-${ancho}.png`;
      await page.screenshot({ path: join(SALIDA, archivo), fullPage: true });
      resultado.rubros[rubro][ancho] = {
        archivo, titulos: lectura.titulos, etiquetas: lectura.etiquetas, placeholders: lectura.placeholders, botones: lectura.botones.slice(0, 12),
        desbordeHorizontal: lectura.desborde, obra: lineas.filter((l) => OBRA.test(l)),
        voseoOTuteoVisible: [...lineas, ...lectura.placeholders].filter((l) => TUTEO.test(l)),
      };
    } catch (e) {
      resultado.rubros[rubro][ancho] = { falla: String(e.message).slice(0, 220) };
    }
    await ctx.close();
  }
}
await browser.close();
writeFileSync(join(SALIDA, `${ETIQUETA}-register-paso2.json`), JSON.stringify(resultado, null, 1));
console.log(JSON.stringify(resultado, null, 1));
