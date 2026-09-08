/**
 * sesion_dueno.mjs — acuñar una sesion de PRODUCCION del dueño de una org, sin su clave.
 *
 * Salio de `scripts/mirar_bandeja_dueno.mjs`, que era el unico que sabia hacerlo. Se extrajo
 * cuando aparecio el segundo consumidor (recorrer el onboarding por la UI) por dos motivos, y
 * el segundo es el que importa:
 *
 *   1. Dos copias de esto divergen, y la que quede vieja no falla: entra igual y mide otra cosa.
 *   2. `mirar_bandeja_dueno.mjs` hace su medicion en el TOP-LEVEL — importarlo para reusar la
 *      funcion lanzaria su captura y su `process.exit()` antes de la primera linea del que
 *      importa. Ya esta anotado en la memoria compartida como trampa medida (2026-09-03,
 *      demo_agendada_real.mjs). Un modulo sin efectos al importarse es la salida.
 *
 * NO tiene efectos al importarse: solo exporta funciones.
 */
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
// El navegador se elige por el que ARRANCA, no por el primer node_modules que exista: ver
// playwright-que-arranca.mjs (nodo-casa quedó ciego un día entero por eso).
import { cargarPlaywright } from "./playwright-que-arranca.mjs";

/**
 * Ni playwright ni @supabase/ssr viven en el repo onia-hermes: se resuelven por lista de
 * candidatos y se FALLA FUERTE nombrando cual falto. Un import que se cae en silencio deja un
 * gate que no mide nada y sale verde.
 */
const RAICES = [
  "/root/loops/onia-platform-chatbot/node_modules",
  "/root/loops/onia-platform/node_modules",
  "/root/node_modules",
];

export function cargar(paquete) {
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

export function envDelContenedor(contenedor) {
  const crudo = execFileSync("docker", ["exec", contenedor, "env"], { encoding: "utf8" });
  const out = {};
  for (const linea of crudo.split("\n")) {
    const i = linea.indexOf("=");
    if (i > 0) out[linea.slice(0, i)] = linea.slice(i + 1);
  }
  return out;
}

/** Una consulta suelta a la base de produccion, devuelta como texto pelado. */
export function psql(sql) {
  return execFileSync(
    "docker",
    ["exec", "supabase-db", "psql", "-U", "postgres", "-d", "postgres", "-tAc", sql],
    { encoding: "utf8" }
  ).trim();
}

/**
 * ⚠️ `generate_link` CREA la cuenta si el correo no existe, y devuelve 200 igual.
 * Medido el 2026-09-04 apuntándolo a un correo inventado: quedó un usuario nuevo en
 * `auth.users` de PRODUCCION (hubo que borrarlo), y como la app rebotó a `/register` —que no
 * es `/login`— el guard del llamador lo dejó pasar y sacó la captura con exit 0. Un instrumento
 * que ESCRIBE en producción cuando le erran el parámetro no es un instrumento de lectura.
 * Por eso el correo se comprueba ANTES, y contra `profiles`: sin perfil no hay dueño de org
 * que mirar, aunque la cuenta de auth exista.
 */
export function exigirCuentaConPerfil(email) {
  const salida = psql(
    `select count(*) from public.profiles where email = '${email.replace(/'/g, "''")}'`
  );
  if (salida !== "1") {
    console.error(
      `'${email}' no tiene perfil en producción (profiles devolvió ${salida || "nada"}).\n` +
        `NO se emite el magiclink: hacerlo CREARÍA la cuenta en auth.users.`
    );
    process.exit(2);
  }
}

/**
 * Magiclink de un solo uso -> cookies, canjeado con la libreria que lee el servidor.
 *
 * El canje NO se hace a mano: `/auth/callback` de la app solo entiende `code` de PKCE, y
 * adivinar el nombre, el troceado y la codificacion de la cookie de @supabase/ssr es justo la
 * clase de suposicion que este proyecto paga cara. Corre con la MISMA libreria que lee el
 * servidor de Next sobre un tarro de cookies de mentira: lo que la libreria ESCRIBE ahi es,
 * por construccion, lo que el servidor va a LEER.
 */
export async function acunarSesion(email) {
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

/** Navegador con la sesion ya puesta, listo para abrir una pantalla logueada. */
export async function navegadorConSesion(email, { viewport = { width: 1440, height: 900 } } = {}) {
  const { host, cookies, email: confirmado } = await acunarSesion(email);
  console.log(
    `sesión emitida para ${confirmado} — ${cookies.length} cookie(s): ${cookies.map((c) => c.name).join(", ")}`
  );
  const { chromium } = await cargarPlaywright();
  const navegador = await chromium.launch({ args: ["--no-sandbox"] });
  const ctx = await navegador.newContext({ viewport });
  await ctx.addCookies(
    cookies.map((c) => ({ ...c, domain: host, path: "/", httpOnly: false, secure: true, sameSite: "Lax" }))
  );
  const pagina = await ctx.newPage();

  // Un chunk 404 pinta la pagina en blanco y tiene la misma firma que un bug real del producto;
  // un 522 transitorio dispara el error boundary y se lee como "Algo salió mal". Se juntan acá
  // para poder descartarlos ANTES de creerle a la captura (medido el 2026-09-06 en /comercio/caja).
  const fallos = [];
  pagina.on("response", (r) => {
    if (r.status() >= 400) fallos.push(`${r.status()} ${r.url()}`);
  });

  return { navegador, ctx, pagina, host, fallos };
}
