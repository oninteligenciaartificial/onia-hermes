/**
 * sonda_mfa_salida.mjs — ¿la pantalla de 2FA obligatorio tiene SALIDA real?
 *
 * Nace de t_faa550af (2026-09-17): el recorrido de cliente midió "cero llamadas a la API" al
 * apretar el botón de activar el 2FA y concluyó que la función está rota de raíz. Ese veredicto
 * no se puede sostener con ese instrumento: `supabase.auth.mfa.enroll()` le habla a GoTrue
 * (`<supabase>/auth/v1/factors`) por HTTPS, NO a `/api/` de la plataforma. Un oyente acotado a
 * `/api/` es CIEGO a todo el enrolamiento, así que su cero es el cero de no haber mirado.
 *
 * Esta sonda escucha TODAS las peticiones y separa los DOS sujetos que la pantalla ofrece,
 * porque fallan por motivos opuestos:
 *   - "Activar ahora" (MfaBanner)  → es un <Link href="/profile"> y el usuario YA está en
 *     /profile: navegar a donde ya estás no dispara nada. Roto, pero de navegación.
 *   - "Activar" (MfaSection)       → es el botón real con onClick={activar}.
 *
 * Y espera de verdad: el enroll son 2-3 viajes a GoTrue (listFactors → unenroll* → enroll),
 * más de lo que tarda una captura tomada 1,5 s después del clic.
 */
import { acunarSesion } from "./lib/sesion_dueno.mjs";
import { cargarPlaywright } from "./lib/playwright-que-arranca.mjs";

function arg(nombre, porDefecto) {
  const i = process.argv.indexOf(`--${nombre}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : porDefecto;
}

const EMAIL = arg("email", "sergio@onia.com.bo");
const SALIDA = arg("salida", "/tmp/mfa");

const { host, cookies } = await acunarSesion(EMAIL);
const { chromium } = await cargarPlaywright();

const navegador = await chromium.launch({ args: ["--no-sandbox"] });
// reducedMotion: un DOM a medio animar se lee como dato del sitio (memoria 2026-09-12).
const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
// `host` es un hostname pelado, no una URL: Playwright exige domain+path o url.
await ctx.addCookies(cookies.map((c) => ({ ...c, domain: host, path: "/", httpOnly: false, secure: true, sameSite: "Lax" })));
const pagina = await ctx.newPage();
const BASE = `https://${host}`;

/** Toda petición, no sólo /api/: ahí vive el enrolamiento. */
const pedidos = [];
pagina.on("request", (r) => pedidos.push({ metodo: r.method(), url: r.url() }));
const consola = [];
pagina.on("console", (m) => m.type() === "error" && consola.push(m.text()));

const desde = () => pedidos.length;
const nuevos = (i) => pedidos.slice(i).filter((p) => !/\.(js|css|woff2?|png|svg|ico)(\?|$)/.test(p.url));

await pagina.goto(`${BASE}/profile?mfa=obligatorio`, { waitUntil: "load", timeout: 60000 });
await pagina.waitForTimeout(3000);

const informe = { email: EMAIL, url: pagina.url(), sujetos: [] };

async function apretar(etiqueta, selector) {
  const el = pagina.locator(selector).first();
  if ((await el.count()) === 0) return { etiqueta, estado: "AUSENTE" };
  const urlAntes = pagina.url();
  const textoAntes = await pagina.locator("main, body").first().innerText();
  const i = desde();
  await el.click({ timeout: 15000 }).catch((e) => ({ err: String(e) }));
  // El enroll son varios viajes a GoTrue: 1,5 s no alcanza para declararlo mudo.
  await pagina.waitForTimeout(6000);
  const textoDespues = await pagina.locator("main, body").first().innerText();
  const red = nuevos(i);
  return {
    etiqueta,
    urlAntes,
    urlDespues: pagina.url(),
    navego: urlAntes !== pagina.url(),
    peticiones: red.map((p) => `${p.metodo} ${p.url}`),
    aGoTrue: red.filter((p) => /\/auth\/v1\//.test(p.url)).length,
    aApi: red.filter((p) => /\/api\//.test(p.url)).length,
    cambioPantalla: textoAntes !== textoDespues,
    apareceQr: /Escribí abajo el código de 6 dígitos|escaneá este código/i.test(textoDespues),
  };
}

// Sujeto 1: el botón del banner rojo (MfaBanner) — el que el reporte apretó primero.
informe.sujetos.push(await apretar("banner «Activar ahora»", 'a:has-text("Activar ahora")'));
// Volver al estado de partida: el banner puede haber navegado y tirado el ?mfa=obligatorio.
await pagina.goto(`${BASE}/profile?mfa=obligatorio`, { waitUntil: "load", timeout: 60000 });
await pagina.waitForTimeout(3000);
// Sujeto 2: el botón real de la tarjeta (MfaSection).
informe.sujetos.push(await apretar("tarjeta «Activar»", 'button:has-text("Activar")'));

await pagina.screenshot({ path: `${SALIDA}-tras-activar.png`, fullPage: true });
informe.erroresDeConsola = consola;
console.log(JSON.stringify(informe, null, 2));
await navegador.close();
