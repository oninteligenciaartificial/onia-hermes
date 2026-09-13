/**
 * Verificación de /guia-facturacion — el lead magnet.
 *
 * Existe por UNA razón concreta: el circuito de captura cruza dos apps que se
 * hablan por el nombre de una clave JSON. La página postea `{ email, whatsapp,
 * src }` a `/api/agenda-intake`, ese proxy lo reenvía tal cual al intake de
 * Onia Center (`web-factory/apps/site/.../leads/intake/route.ts`), y ese intake
 * decide si el lead vive o muere leyendo `body.email`. Si alguien renombra esa
 * clave de un lado, el otro devuelve 422 y **cada correo capturado se pierde en
 * silencio**: la persona ve que todo salió bien, porque el proxy siempre
 * responde 204. Un `tsc` no ve nada de esto — son dos procesos distintos.
 *
 * Chequea además lo que las reglas de la casa prohíben en material de venta
 * (precios, estado de obra) y el enlace cruzado con /facturacion en las dos
 * direcciones, que es lo que mantiene separadas las dos intenciones de búsqueda.
 *
 * Uso (con el sitio levantado; 3320 es el puerto del carril, cambialo si hace
 * falta con GUIA_URL):
 *   cd web-factory/apps/onia-platform
 *   npx next dev -p 3320
 *   node scripts/verificar-guia-facturacion.mjs
 *
 * Sale con código 1 si algo falla, así se puede colgar de un gate.
 */
import { createRequire } from "node:module";

const BASE = process.env.GUIA_URL || "http://localhost:3320";
const require_ = createRequire(import.meta.url);
const { chromium } = require_("playwright");

let fallos = 0;
const ok = (cond, msg) => {
  console.log((cond ? "OK   " : "FALLA") + "  " + msg);
  if (!cond) fallos++;
};

const navegador = await chromium.launch();
// reducedMotion en todas las pantallas de este guion: lo que se lee de un DOM
// animado son estados intermedios que el cliente nunca ve fijos. Ver
// scripts/navegador-sin-animacion.test.ts (Bs 364 fantasma, 2026-09-12).
const p = await navegador.newPage({
  viewport: { width: 390, height: 844 },
  reducedMotion: "reduce",
});
await p.goto(`${BASE}/guia-facturacion?src=guia-siat-dm`, {
  waitUntil: "domcontentloaded",
});
await p.waitForTimeout(1200);

/* 1 · un correo mal escrito no gasta un envío y se avisa en el campo */
let peticiones = 0;
p.on("request", (r) => {
  if (r.url().includes("/api/agenda-intake")) peticiones++;
});
await p.fill('input[name="email"]', "sin-arroba");
await p.click('button[type="submit"]');
await p.waitForTimeout(400);
ok(peticiones === 0, "correo inválido: no se envía nada");
ok(
  await p.locator('form [role="alert"]').isVisible(),
  "correo inválido: se muestra el error",
);
ok(
  (await p.getAttribute('input[name="email"]', "aria-invalid")) === "true",
  "correo inválido: aria-invalid en el campo",
);

/* 2 · el cuerpo que viaja es EXACTAMENTE el que lee el intake de Onia Center */
let cuerpo = null;
p.on("request", (r) => {
  if (r.url().includes("/api/agenda-intake")) cuerpo = r.postData();
});
await p.fill('input[name="email"]', "dueno@ferreteria.bo");
await p.fill('input[name="whatsapp"]', "70000000");
await p.click('button[type="submit"]');
await p.waitForTimeout(1200);
const enviado = JSON.parse(cuerpo || "{}");
ok(enviado.email === "dueno@ferreteria.bo", "el intake recibe `email`");
ok(enviado.whatsapp === "70000000", "el intake recibe `whatsapp`");
ok(enviado.src === "guia-siat-dm", "atribución: viaja el ?src= del canal");

/* 3 · la hoja se entrega */
ok(await p.locator("text=La hoja es tuya").isVisible(), "estado logrado visible");
ok(
  await p.locator("text=Guardar la hoja en PDF").isVisible(),
  "botón de la hoja disponible",
);

/* 4 · sin ?src= la fuente sigue siendo distinguible del resto del sitio */
const p2 = await navegador.newPage({
  viewport: { width: 390, height: 844 },
  reducedMotion: "reduce",
});
let cuerpo2 = null;
p2.on("request", (r) => {
  if (r.url().includes("/api/agenda-intake")) cuerpo2 = r.postData();
});
await p2.goto(`${BASE}/guia-facturacion`, { waitUntil: "domcontentloaded" });
await p2.waitForTimeout(1000);
await p2.fill('input[name="email"]', "a@b.bo");
await p2.click('button[type="submit"]');
await p2.waitForTimeout(1000);
ok(
  JSON.parse(cuerpo2 || "{}").src === "guia-siat",
  "sin ?src= la fuente es `guia-siat`",
);

/* 5 · enlace cruzado en las dos direcciones (canibalización SEO) */
const p3 = await navegador.newPage({ reducedMotion: "reduce" });
await p3.goto(`${BASE}/facturacion`, { waitUntil: "domcontentloaded" });
await p3.waitForTimeout(800);
ok(
  (await p3.locator('a[href="/guia-facturacion"]').count()) > 0,
  "/facturacion enlaza a la guía",
);
ok(
  (await p.locator('a[href="/facturacion"]').count()) > 0,
  "la guía enlaza a /facturacion",
);

/* 6 · reglas de la casa: ni precios ni obra a la vista */
const texto = (await p.evaluate(() => document.body.innerText)).toLowerCase();
const prohibidas = [
  "muy pronto",
  "próximamente",
  "proximamente",
  "en construcción",
  "beta",
  "bs ",
];
const encontradas = prohibidas.filter((w) => texto.includes(w));
ok(
  encontradas.length === 0,
  "sin precios ni estado de obra (" + (encontradas.join(", ") || "limpio") + ")",
);

/*
 * 7 · la hoja entra en UNA página. Es la promesa entera del magnet.
 *
 * Se mide en una pestaña del ANCHO DE LA HOJA, no en la del teléfono: el alto
 * del texto depende del ancho, y medirlo a 390px daba 1.303px — un falso
 * negativo que hace perseguir un problema que no existe.
 * A4 a 96dpi = 794x1123; los márgenes de @page son 13mm laterales (~98px) y
 * 11mm + 8mm verticales (~72px).
 */
const hoja = await navegador.newPage({
  viewport: { width: 794 - 98, height: 1123 - 72 },
  reducedMotion: "reduce",
});
await hoja.goto(`${BASE}/guia-facturacion`, { waitUntil: "domcontentloaded" });
await hoja.waitForTimeout(1200);
await hoja.emulateMedia({ media: "print" });
await hoja.waitForTimeout(400);
const alto = await hoja.evaluate(() => document.body.scrollHeight);
ok(alto <= 1123 - 72, `la hoja impresa entra en una página (${alto}px de 1051)`);

await navegador.close();
console.log(fallos === 0 ? "\nTODO VERDE" : `\n${fallos} FALLAS`);
process.exit(fallos === 0 ? 0 : 1);
