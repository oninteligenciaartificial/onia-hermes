/**
 * ¿El sitio se descarga el widget de chat encima del visitante que no lo pidió?
 *
 * Abre la portada con un navegador de verdad y CUENTA los bytes que viajan al
 * host de Chatwoot en dos escenarios: sin tocar nada, y después de un gesto.
 *
 * **Por qué existe además del gate de unidad.** `chat-diferido.test.ts` ejecuta
 * el snippet contra un DOM escrito a mano: prueba la lógica, no que el HTML que
 * sirve el servidor la lleve. Este script mide el resultado — es la diferencia
 * entre "el código está bien" y "el cliente lo recibe".
 *
 *   node scripts/chat-diferido-vivo.mjs [url]      (default: http://localhost:3311)
 *
 * Salidas: 0 = el chat espera al visitante · 1 = viaja sin pedirlo · 2 = NO
 * MEDIDO (no hubo navegador o la página no cargó; nunca se aplana a verde).
 */
import { chromium } from "playwright";

const URL_BASE = process.argv[2] ?? "http://localhost:3311";
const HOST_CHAT = "onia-chatbot-chatwoot";
const ESPERA_SIN_GESTO_MS = 3000;
const ESPERA_TRAS_GESTO_MS = 6000;

const kb = (n) => `${Math.round(n / 1024)} KB`;

async function medir() {
  const navegador = await chromium.launch();
  const pagina = await navegador.newPage({ viewport: { width: 390, height: 844 } });

  const arranque = Date.now();
  const pedidosChat = [];
  pagina.on("request", (r) => {
    if (r.url().includes(HOST_CHAT))
      pedidosChat.push(`${Date.now() - arranque}ms ${r.url().slice(0, 100)}`);
  });
  let bytes = 0;
  let limiteDeTercero = false;
  pagina.on("response", async (r) => {
    if (!r.url().includes(HOST_CHAT)) return;
    // 429 = el limitador de Chatwoot, que corta al 4º pedido por IP. Lo provoca
    // el propio instrumento al abrir pantallas en serie; un lead abre una vez y
    // recibe 200. No es atribuible al sitio: sale como AVISO, nunca rojo
    // (misma politica que `mirar-primera-pantalla.mjs`).
    if (r.status() === 429) limiteDeTercero = true;
    try {
      bytes += (await r.body()).length;
    } catch {
      /* respuesta sin cuerpo legible: no se cuenta, y el conteo de pedidos ya la ve */
    }
  });

  const res = await pagina.goto(URL_BASE, { waitUntil: "load", timeout: 45000 });
  if (!res || !res.ok()) {
    await navegador.close();
    return { estado: 2, motivo: `la portada devolvió ${res ? res.status() : "nada"}` };
  }

  await pagina.waitForTimeout(ESPERA_SIN_GESTO_MS);
  const sinGesto = { pedidos: pedidosChat.length, bytes };

  // El gesto: lo que hace cualquiera que mire la página.
  await pagina.mouse.wheel(0, 400);
  await pagina.waitForTimeout(ESPERA_TRAS_GESTO_MS);
  const trasGesto = { pedidos: pedidosChat.length, bytes };

  // Y la contraprueba de que el canal sigue existiendo: la burbuja de Chatwoot
  // vive en un iframe propio. Sin esto, "0 bytes" se lograría rompiendo el chat.
  // Selector amplio a proposito: Chatwoot cambia las clases del launcher entre
  // versiones y un selector fino da un falso "el canal quedo muerto" con la
  // burbuja a la vista (pasado el 2026-09-11, verificado contra la captura).
  const launcher = pagina
    .locator('[class*="woot"], [id*="chatwoot"], iframe[src*="' + HOST_CHAT + '"]')
    .first();
  const burbuja = await launcher
    .waitFor({ state: "visible", timeout: 15000 })
    .then(() => true)
    .catch(() => false);
  if (process.env.ONIA_CAPTURA)
    await pagina.screenshot({ path: process.env.ONIA_CAPTURA, fullPage: false });

  await navegador.close();
  return { estado: 0, sinGesto, trasGesto, burbuja, limiteDeTercero, primeros: pedidosChat.slice(0, 4) };
}

const r = await medir().catch((e) => ({ estado: 2, motivo: String(e).slice(0, 200) }));

if (r.estado === 2) {
  console.log(`NO MEDIDO: ${r.motivo}`);
  process.exit(2);
}

console.log(`sin tocar nada:  ${r.sinGesto.pedidos} pedido(s) al chat, ${kb(r.sinGesto.bytes)}`);
console.log(`tras un scroll:  ${r.trasGesto.pedidos} pedido(s) al chat, ${kb(r.trasGesto.bytes)}`);
console.log(`burbuja visible tras el gesto: ${r.burbuja ? "sí" : "no"}`);

if (r.sinGesto.pedidos > 0) {
  console.log("ROJO: el chat viaja sin que nadie lo pida. Los primeros pedidos:");
  for (const p of r.primeros) console.log("   " + p);
  process.exit(1);
}
if (r.trasGesto.pedidos === 0) {
  console.log("ROJO: el visitante hizo un gesto y el chat ni se pidió — el canal quedó muerto.");
  process.exit(1);
}
if (!r.burbuja) {
  if (r.limiteDeTercero) {
    console.log(
      "AVISO: el gesto pidió el chat y Chatwoot contestó 429 (corta al 4º pedido por IP,\n" +
        "       se lo provoca este mismo script). Medilo en frío: espera 5 min y corré de nuevo.",
    );
    process.exit(0);
  }
  console.log("ROJO: el chat se pidió pero la burbuja no apareció.");
  process.exit(1);
}
console.log("VERDE: el chat espera al visitante y aparece apenas lo pide.");
