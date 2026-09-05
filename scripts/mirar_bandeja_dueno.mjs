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
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

const RAICES = [
  "/root/loops/onia-platform-chatbot/node_modules",
  "/root/loops/onia-platform/node_modules",
  "/root/node_modules",
];

function cargar(paquete) {
  for (const raiz of RAICES) {
    try {
      return createRequire(`${raiz}/`)(paquete);
    } catch (e) {
      if (e?.code !== "MODULE_NOT_FOUND") throw e;
    }
  }
  console.error(
    `FALTA la dependencia '${paquete}'. Se buscó en:\n  ${RAICES.join("\n  ")}\n` +
      `Sin eso esto NO puede medir nada — no sale verde por defecto.`
  );
  process.exit(2);
}

function arg(nombre, porDefecto) {
  const i = process.argv.indexOf(`--${nombre}`);
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : porDefecto;
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

function envDelContenedor(contenedor) {
  const crudo = execFileSync("docker", ["exec", contenedor, "env"], { encoding: "utf8" });
  const out = {};
  for (const linea of crudo.split("\n")) {
    const i = linea.indexOf("=");
    if (i > 0) out[linea.slice(0, i)] = linea.slice(i + 1);
  }
  return out;
}

/**
 * ⚠️ `generate_link` CREA la cuenta si el correo no existe, y devuelve 200 igual.
 * Medido el 2026-09-04 apuntándolo a un correo inventado: quedó un usuario nuevo en
 * `auth.users` de PRODUCCION (hubo que borrarlo), y como la app rebotó a `/register` —que no
 * es `/login`— el guard de abajo lo dejó pasar y sacó la captura con exit 0. Un instrumento
 * que ESCRIBE en producción cuando le erran el parámetro no es un instrumento de lectura.
 * Por eso el correo se comprueba ANTES, y contra `profiles`: sin perfil no hay dueño de org
 * que mirar, aunque la cuenta de auth exista.
 */
function exigirCuentaConPerfil(email) {
  const salida = execFileSync(
    "docker",
    ["exec", "supabase-db", "psql", "-U", "postgres", "-d", "postgres", "-tAc",
      `select count(*) from public.profiles where email = '${email.replace(/'/g, "''")}'`],
    { encoding: "utf8" }
  ).trim();
  if (salida !== "1") {
    console.error(
      `'${email}' no tiene perfil en producción (profiles devolvió ${salida || "nada"}).\n` +
        `NO se emite el magiclink: hacerlo CREARÍA la cuenta en auth.users.`
    );
    process.exit(2);
  }
}

/** Magiclink de un solo uso -> cookies, canjeado con la libreria que lee el servidor. */
async function acunarSesion(email) {
  exigirCuentaConPerfil(email);
  const { createServerClient } = cargar("@supabase/ssr");
  const env = envDelContenedor("onia-platform");
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anon || !service) {
    console.error("El contenedor onia-platform no expone las 3 variables de Supabase.");
    process.exit(2);
  }

  const r = await fetch(`${url}/auth/v1/admin/generate_link`, {
    method: "POST",
    headers: { apikey: service, Authorization: `Bearer ${service}`, "Content-Type": "application/json" },
    body: JSON.stringify({ type: "magiclink", email }),
  });
  const j = await r.json();
  const tokenHash = j?.hashed_token || j?.properties?.hashed_token;
  if (!tokenHash) {
    console.error(`generate_link no devolvió hashed_token (HTTP ${r.status}):`, JSON.stringify(j).slice(0, 300));
    process.exit(2);
  }

  const tarro = new Map();
  const cliente = createServerClient(url, anon, {
    cookies: {
      getAll: () => [...tarro].map(([name, value]) => ({ name, value })),
      setAll: (lista) => lista.forEach(({ name, value }) => tarro.set(name, value)),
    },
  });

  let ultimo = null;
  for (const tipo of ["magiclink", "email"]) {
    const { data, error } = await cliente.auth.verifyOtp({ token_hash: tokenHash, type: tipo });
    if (!error && data?.session) {
      const cookies = [...tarro].map(([name, value]) => ({ name, value }));
      if (!cookies.length) {
        console.error("La librería no escribió ni una cookie: sin eso el servidor no ve la sesión.");
        process.exit(2);
      }
      return { host: new URL(url).host, cookies, email: data.session.user?.email };
    }
    ultimo = error;
  }
  console.error("verifyOtp falló:", ultimo?.message || ultimo);
  process.exit(2);
}

const { host, cookies, email } = await acunarSesion(EMAIL);
console.log(`sesión emitida para ${email} — ${cookies.length} cookie(s): ${cookies.map((c) => c.name).join(", ")}`);

const { chromium } = cargar("playwright");
const navegador = await chromium.launch({ args: ["--no-sandbox"] });
const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addCookies(
  cookies.map((c) => ({ ...c, domain: host, path: "/", httpOnly: false, secure: true, sameSite: "Lax" }))
);
const pagina = await ctx.newPage();

// Un chunk 404 pinta la pagina en blanco y tiene la misma firma que un bug real del producto:
// se descarta ANTES de creerle a la captura.
const fallos = [];
pagina.on("response", (r) => { if (r.status() >= 400) fallos.push(`${r.status()} ${r.url()}`); });

await pagina.goto(`https://${host}${RUTA}`, { waitUntil: "networkidle", timeout: 90000 });
await pagina.waitForTimeout(2500);
// El scroll suave saca la foto a mitad de camino.
await pagina.addStyleTag({ content: "*{scroll-behavior:auto !important}" });

const urlFinal = pagina.url();
console.log("URL final:", urlFinal);
console.log("respuestas >=400:", fallos.length ? `\n  ${fallos.slice(0, 8).join("\n  ")}` : "ninguna");
// Exigir la ruta PEDIDA, no "cualquier cosa que no sea /login": la app rebota a /register, a
// /onboarding o a la portada segun por que no entro la sesion, y todas esas pasaban el filtro
// viejo y se llevaban un exit 0 con una captura que no prueba nada.
if (new URL(urlFinal).pathname !== RUTA) {
  console.error(`La sesión NO entró: se pidió ${RUTA} y la app terminó en ${new URL(urlFinal).pathname}.`);
  await navegador.close();
  process.exit(2);
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
