#!/usr/bin/env node
/**
 * mirar_bandeja_dueno.mjs — abre `/inbox` de PRODUCCION con la sesion del dueno de la org
 * y saca la captura. Es el instrumento del punto 1 de ONIA_DEFINICION_DE_TERMINADO.md:
 * "se abre /inbox con la sesion del dueno y hay una conversacion de alguien que no somos".
 *
 *   node scripts/mirar_bandeja_dueno.mjs                      # superadmin@onia.com.bo -> /inbox
 *   node scripts/mirar_bandeja_dueno.mjs --email X --ruta /citas --salida /root/x.png
 *
 * CODIGOS DE SALIDA
 *   0  la pantalla se abrio y la captura quedo escrita  → despues HAY QUE MIRARLA
 *   2  no se pudo medir (falta una dependencia, el mint fallo, la pagina no cargo)
 *
 * ────────────────────────────────────────────────────────────────────────────────────────
 * POR QUE EXISTE, Y POR QUE NO ROTA NINGUNA CLAVE
 *
 * El punto 1 estuvo abierto un dia entero por un bloqueo que decia: "la unica cuenta de
 * 'Onia (interna)' es superadmin@onia.com.bo y su clave no esta en ningun env del VPS". Es
 * cierto que la clave no esta — y rotarla es inaceptable, porque es la cuenta admin de Sergio
 * en produccion y lo dejaria afuera. Pero de ahi no se sigue que no se pueda mirar: el admin
 * API de Supabase emite un magiclink de un solo uso SIN tocar la contrasena. El bloqueo era
 * de metodo, no de credencial.
 *
 * El canje NO se hace a mano. `/auth/callback` de la app solo entiende `code` de PKCE, asi que
 * no sirve fabricarle uno; y adivinar el nombre, el troceado y la codificacion de la cookie de
 * @supabase/ssr es justo la clase de suposicion que este proyecto paga cara. En vez de eso el
 * canje corre con la MISMA libreria que lee el servidor de Next, con un tarro de cookies de
 * mentira: lo que la libreria ESCRIBE ahi es, por construccion, lo que el servidor va a LEER.
 *
 * ⚠️ Ninguna de las dos librerias vive en este repo (playwright esta en /root/node_modules y
 * @supabase/ssr en el arbol de onia-platform), asi que se resuelven por lista de candidatos y
 * se FALLA FUERTE nombrando cual falto. Un import que se cae en silencio deja un gate que no
 * mide nada y sale verde.
 */
// El mint de sesión vive en `scripts/lib/sesion_dueno.mjs` desde el 2026-09-06: apareció un
// segundo consumidor (recorrer el onboarding por la UI) y dos copias de esto divergen sin
// fallar — la que quede vieja entra igual y mide otra cosa.
import { acunarSesion, psql } from "./lib/sesion_dueno.mjs";
import { describirZona, zonaParaMirar } from "./lib/zona-del-negocio.mjs";
import { cargarPlaywright } from "./lib/playwright-que-arranca.mjs";
import { porQueRebote, veredictoDePantalla } from "./lib/pantalla-servida.mjs";

function arg(nombre, porDefecto) {
  const i = process.argv.indexOf(`--${nombre}`);
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : porDefecto;
}

// Todos los valores de una bandera que se puede repetir. `arg` se queda con el primero, y eso
// alcanza para las que nombran UNA cosa (--ruta, --email); las que describen PASOS no.
function args(nombre) {
  const out = [];
  for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === `--${nombre}` && process.argv[i + 1]) out.push(process.argv[i + 1]);
  }
  return out;
}

const EMAIL = arg("email", "superadmin@onia.com.bo");
const RUTA = arg("ruta", "/inbox");
const SALIDA = arg("salida", "/root/bandeja-produccion.png");
// La lista de conversaciones scrollea DENTRO de su panel, no con la pagina: sin esto la
// captura sólo alcanza a las conversaciones mas nuevas, y la prueba de que la bandeja lista
// los DOS canales juntos vive mas abajo (los de WhatsApp son de agosto).
const SCROLL = Number(arg("scroll", "0"));
// --ancla "<texto>": la pieza a mirar vive bajo el pliegue (la tarjeta del canal de WhatsApp
// está al final de /settings/chatbot). Sin esto la captura sale del tope de la página y NO
// prueba nada sobre la pieza — con la misma cara que una captura buena.
const ANCLA = arg("ancla", "");
// --click "<texto>": la pieza a mirar puede vivir DETRAS de un clic (un modal, un panel que
// se despliega). Sin esto, lo unico que se puede mirar de la plataforma son las pantallas de
// primer nivel — y los formularios, que es donde el cliente se traba, quedan sin instrumento.
// Nace del 2026-09-06: "servicios profesionales no puede agendar" llevaba dos dias sin poder
// resolverse porque el bloqueo esta dentro del modal de Nueva Cita, y nadie lo habia MIRADO.
// Se puede repetir: una pieza puede vivir detrás de DOS capas, y entonces un solo clic no
// alcanza. Medido el 2026-09-18 sobre /dashboard en móvil: el asistente de configuración es un
// `fixed inset-0 z-[60]` que INTERCEPTA el clic al menú «Más», así que el script moría con
// TimeoutError nombrando al botón del menú — y eso se lee como "el menú no anda", un defecto
// del producto, cuando lo que pasaba es que había una capa encima que el usuario cierra
// primero. Los pasos se aprietan en orden y cada uno conserva su guarda de exit 2.
const CLICKS = args("click");
// --movil: el viewport era 1440x900 fijo, así que TODA pantalla mirada con este instrumento
// quedaba mirada sólo en escritorio. No es un detalle de comodidad: el panel esconde la
// botonera superior en móvil y deja el FAB flotante como única acción, o sea que las dos
// mitades del mismo defecto ("la misma acción tres veces") viven en viewports distintos y
// una captura de escritorio no puede ver la otra. Nace de t_4f185df8, cuya definición de
// hecho pide escritorio Y móvil y no se podía cumplir con este script.
const MOVIL = process.argv.includes("--movil");
const VIEWPORT = MOVIL ? { width: 390, height: 844 } : { width: 1440, height: 900 };

const { host, cookies, email } = await acunarSesion(EMAIL);
console.log(`sesión emitida para ${email} — ${cookies.length} cookie(s): ${cookies.map((c) => c.name).join(", ")}`);

const { chromium, raiz: raizPw } = await cargarPlaywright();
console.log(`playwright: ${raizPw}`);
const navegador = await chromium.launch({ args: ["--no-sandbox"] });
// La zona NO se hereda del proceso. Sin `timezoneId`, Playwright usa la del VPS (UTC) y toda
// pantalla con horas sale 4 h corrida: medido el 2026-09-26 en /inbox, la misma conversación
// decía "10:16 p.m." acá y "06:16 p.m." con `TZ=America/La_Paz`. Las pantallas son `"use client"`,
// o sea que el producto está sano y el que mentía era este instrumento. Detalle en
// `lib/zona-del-negocio.mjs`.
const zonaMirada = zonaParaMirar(email, psql);
const ctx = await navegador.newContext({
  viewport: VIEWPORT,
  isMobile: MOVIL,
  hasTouch: MOVIL,
  timezoneId: zonaMirada.zona,
  locale: "es-BO",
});
console.log(`viewport: ${VIEWPORT.width}x${VIEWPORT.height}${MOVIL ? " (móvil)" : " (escritorio)"}`);
console.log(describirZona(zonaMirada));
await ctx.addCookies(
  cookies.map((c) => ({ ...c, domain: host, path: "/", httpOnly: false, secure: true, sameSite: "Lax" }))
);
const pagina = await ctx.newPage();

// Un chunk 404 pinta la pagina en blanco y tiene la misma firma que un bug real del producto:
// se descarta ANTES de creerle a la captura.
const fallos = [];
pagina.on("response", (r) => { if (r.status() >= 400) fallos.push(`${r.status()} ${r.url()}`); });

// `networkidle` da la pagina ASENTADA, que es lo que se quiere mirar — pero una pantalla con
// conexion persistente (el asistente IA, realtime de Supabase, un widget que hace polling) no
// se queda quieta NUNCA, asi que la espera vence y el script moria con TimeoutError. Eso se lee
// como "la pantalla no carga", que es un defecto del producto: medido el 2026-09-08 sobre
// /dashboard, mientras `curl` daba 200 en 1 s y la app estaba sana. La espera buena se conserva
// y deja de ser fatal: si no llega, se cae a `load` y se DICE, porque una captura degradada no
// se puede leer como una asentada.
let asentada = "networkidle";
// `goto` DEVUELVE la respuesta del documento principal y este script la tiraba. El
// listener de arriba tampoco la alcanza: mide subrecursos. Medido el 2026-09-17
// pidiendo /dev/shell con sesion real — la pantalla era un 404 de cuerpo entero
// ("ERROR 404 · Página no encontrada", capturado y MIRADO) y el instrumento imprimio
// "URL final: .../dev/shell" y "respuestas >=400: ninguna", o sea las dos lineas que
// un carril lee para concluir que la pantalla esta sana. El guard de abajo no lo
// tapa: compara PATHNAME contra PATHNAME y Next sirve el 404 en la MISMA URL.
let respuestaPrincipal = null;
try {
  respuestaPrincipal = await pagina.goto(`https://${host}${RUTA}`, { waitUntil: "networkidle", timeout: 45000 });
} catch (e) {
  if (e?.name !== "TimeoutError") throw e;
  asentada = "load (networkidle no llego: la pantalla tiene conexion persistente)";
  respuestaPrincipal = await pagina.goto(`https://${host}${RUTA}`, { waitUntil: "load", timeout: 45000 });
}
console.log("espera:", asentada);
await pagina.waitForTimeout(2500);
// El scroll suave saca la foto a mitad de camino.
await pagina.addStyleTag({ content: "*{scroll-behavior:auto !important}" });

const urlFinal = pagina.url();
console.log("URL final:", urlFinal);
console.log("respuestas >=400:", fallos.length ? `\n  ${fallos.slice(0, 8).join("\n  ")}` : "ninguna");

// El documento principal, que es lo que la captura va a mostrar. Va ANTES del guard
// de pathname a proposito: una pagina de error se sirve en la MISMA URL que se pidio,
// asi que ese guard la deja pasar entera.
const veredicto = veredictoDePantalla({
  status: respuestaPrincipal?.status() ?? null,
  textoVisible: await pagina.evaluate(() => document.body?.innerText ?? "").catch(() => ""),
});
console.log("documento principal:", veredicto.motivo);
if (veredicto.sirve !== true) {
  console.error(
    `NO se saca la captura: ${veredicto.motivo}. La pantalla que se pidió (${RUTA}) no es la que ` +
      `el servidor entregó, y una captura de una página de error tiene la misma cara que una buena.`
  );
  await navegador.close();
  process.exit(2);
}
// Exigir la ruta PEDIDA, no "cualquier cosa que no sea /login": la app rebota a /register, a
// /onboarding o a la portada segun por que no entro la sesion, y todas esas pasaban el filtro
// viejo y se llevaban un exit 0 con una captura que no prueba nada.
// Se comparan PATHNAME contra PATHNAME: `RUTA` puede traer query string (una
// ruta de API con ?doctorId=&date=) y compararla cruda contra el pathname da un
// falso negativo — la sesion entro perfecto y el guard la declaraba rechazada.
const rutaPedida = new URL(RUTA, `https://${host}`).pathname;
// Y el DESTINO se lee entero, con su query: ahí es donde el producto publica POR QUÉ
// rebotó (`/profile?mfa=obligatorio`). Este script tiraba la query y afirmaba «la sesión
// NO entró» para cualquier rebote — dos cosas falsas a la vez, ver `porQueRebote`.
const rebotada = porQueRebote({ rutaPedida, urlFinal });
if (rebotada.reboto) {
  console.error(`${rebotada.motivo}.`);
  await navegador.close();
  process.exit(2);
}

for (const paso of CLICKS) {
  // Se busca el BOTON por su nombre accesible, no un nodo con ese texto: en esta app el rotulo
  // suele ser un <span> adentro del <button>, y clickear el span funciona por propagacion pero
  // falla mudo cuando el rotulo es una ligadura de Material Symbols. Y si no aparece se sale
  // con 2: una captura de la pantalla SIN el modal abierto tiene la misma cara que una buena.
  const boton = pagina.getByRole("button", { name: paso }).first();
  try {
    await boton.waitFor({ state: "visible", timeout: 20000 });
  } catch {
    console.error(
      `El botón ${JSON.stringify(paso)} NO está en ${RUTA}. No se saca la captura: sería de la ` +
        `pantalla sin abrir y se leería como prueba de algo que no se vio.`
    );
    await navegador.close();
    process.exit(2);
  }
  // Un clic que NO llega porque otra capa lo intercepta tiene que decir QUÉ lo tapó: ese error
  // nombra al botón que se pidió, así que sin esto se lee como "ese botón está roto".
  try {
    await boton.click({ timeout: 20000 });
  } catch (e) {
    const tapa = String(e?.message || e).match(/<(\w+)[^>]*>[^<]*<\/\1>\s*from\s*<[^>]+>/)?.[0];
    console.error(
      `El botón ${JSON.stringify(paso)} está en ${RUTA} pero el clic NO llegó: otra capa lo ` +
        `intercepta${tapa ? ` (${tapa})` : ""}. No es que el botón esté roto — hay algo ENCIMA ` +
        `que el usuario cierra primero; agregá ese paso con otro --click ANTES de éste.`
    );
    await navegador.close();
    process.exit(2);
  }
  await pagina.waitForTimeout(1500);
  console.log(`click ${JSON.stringify(paso)}: apretado.`);
}

if (SCROLL > 0) {
  const movido = await pagina.evaluate((px) => {
    // El panel scrolleable mas alto de la pagina: la lista de conversaciones.
    const candidatos = [...document.querySelectorAll("*")].filter((n) => {
      const s = getComputedStyle(n);
      return /auto|scroll/.test(s.overflowY) && n.scrollHeight > n.clientHeight + 20;
    });
    if (!candidatos.length) return null;
    const lista = candidatos.sort((a, b) => b.scrollHeight - a.scrollHeight)[0];
    lista.scrollTop = px;
    return { pedido: px, quedo: lista.scrollTop, alto: lista.scrollHeight };
  }, SCROLL);
  if (!movido) {
    console.error("Se pidió --scroll pero no hay ningún panel scrolleable: la captura sería la misma de arriba.");
    await navegador.close();
    process.exit(2);
  }
  console.log(`scroll: pedido ${movido.pedido}px, quedó en ${movido.quedo}px (alto ${movido.alto}px)`);
  await pagina.waitForTimeout(800);
}

if (ANCLA) {
  // El texto se busca con :has-text sobre el DOM real, no con un grep del HTML: React parte
  // el texto entre expresiones JSX con comentarios (`Bs <!-- -->3.300`) y ahí un match literal
  // falla ABIERTO. Y si el ancla no aparece se sale con 2: una captura del tope de la página
  // tiene exactamente la misma cara que una captura buena, y se firmaría como prueba.
  const nodo = pagina.locator(`:text-is(${JSON.stringify(ANCLA)})`).last();
  try {
    await nodo.waitFor({ state: "visible", timeout: 20000 });
  } catch {
    console.error(
      `El ancla ${JSON.stringify(ANCLA)} NO está en ${RUTA}. No se saca la captura: sería del ` +
        `tope de la página y se leería como prueba de una pieza que no se vio.`
    );
    await navegador.close();
    process.exit(2);
  }
  // `block: "center"` y no scrollIntoViewIfNeeded: éste deja la pieza pegada al borde inferior,
  // por debajo del margen que dispara las animaciones de entrada, y sale sin pintar.
  await nodo.evaluate((n) => n.scrollIntoView({ block: "center", behavior: "auto" }));
  await pagina.waitForTimeout(1200);
  console.log(`ancla ${JSON.stringify(ANCLA)}: encontrada y centrada.`);
}

await pagina.screenshot({ path: SALIDA });
console.log(`captura: ${SALIDA}  ← AHORA MIRALA. Un exit 0 acá sólo dice que la pantalla cargó.`);
await navegador.close();
