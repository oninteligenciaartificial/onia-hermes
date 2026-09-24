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
// El magiclink del admin API entra en `aal1`. Toda cuenta con 2FA verificado rebota a
// `/login/2fa` y el instrumento sale con exit 2 — ver `elevarSegundoFactor` abajo.
import { codigoTotp, segundosHastaLaProximaVentana } from "./totp.mjs";

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
 * Sube la sesion de `aal1` a `aal2` cuando la cuenta tiene segundo factor verificado.
 *
 * Sin esto, `superadmin@onia.com.bo` —la UNICA cuenta de `onia-interna`, que es la unica org
 * con los inboxes reales y con conversaciones de desconocidos— no se puede mirar: el guard de
 * `proxy.ts` lee el `aal` del JWT y manda toda pantalla a `/login/2fa`. Medido el 2026-09-24:
 * `--ruta /inbox` terminaba en `URL final: https://app.onia.com.bo/login/2fa`, exit 2.
 *
 * El 2FA NO se toca y el secreto NO se copia a ningun lado: se lee en vivo de la misma base
 * que este modulo ya consulta (`exigirCuentaConPerfil` no corre sin `docker exec supabase-db`).
 * El porque esto no amplia el alcance de nadie esta escrito en `totp.mjs`.
 *
 * Devuelve una linea para el log. Sale con 2 —nunca en silencio— si no puede elevar: una
 * sesion aal1 sacando la captura de `/login/2fa` tiene la misma cara que una captura buena.
 */
export async function elevarSegundoFactor(cliente) {
  const { data, error } = await cliente.auth.mfa.listFactors();
  if (error) {
    console.error(`No se pudieron listar los factores de la cuenta: ${error.message}`);
    process.exit(2);
  }
  const factor = (data?.totp ?? []).find((f) => f.status === "verified");
  if (!factor) return "la cuenta no tiene segundo factor: la sesión aal1 alcanza";

  const secreto = psql(
    `select secret from auth.mfa_factors where id = '${factor.id}' and status = 'verified'`
  );
  if (!secreto) {
    console.error(
      `El factor ${factor.id} existe pero auth.mfa_factors no devolvió su clave. ` +
        `Sin eso no se puede completar el segundo paso y la captura sería de /login/2fa.`
    );
    process.exit(2);
  }

  // Dos intentos, por la protección de repetición del TOTP: si GoTrue rechaza un código ya
  // usado, la SEGUNDA corrida del instrumento dentro de los mismos 30 s falla — y ese fallo
  // tiene la misma cara que una clave mal leída. Esperar la ventana siguiente es la salida.
  // ⚠️ Medido el 2026-09-24 contra este GoTrue: tres mints en 26 s pasaron los tres, o sea
  // que HOY acá no rechaza la repetición (cada `challenge` es nuevo). Se deja igual porque el
  // reintento no cuesta nada y ese comportamiento cambia con una actualización, no con un
  // despliegue nuestro; si alguna vez se dispara, la línea de abajo lo dice en el log.
  for (const intento of [1, 2]) {
    const { data: desafio, error: errorDesafio } = await cliente.auth.mfa.challenge({ factorId: factor.id });
    if (errorDesafio) {
      console.error(`GoTrue no emitió el desafío del segundo factor: ${errorDesafio.message}`);
      process.exit(2);
    }
    const { error: errorVerificar } = await cliente.auth.mfa.verify({
      factorId: factor.id,
      challengeId: desafio.id,
      code: codigoTotp(secreto),
    });
    if (!errorVerificar) return `segundo factor verificado (factor ${factor.id.slice(0, 8)}…) — sesión aal2`;
    if (intento === 2) {
      console.error(`GoTrue rechazó el segundo factor dos veces seguidas: ${errorVerificar.message}`);
      process.exit(2);
    }
    const espera = segundosHastaLaProximaVentana();
    console.log(
      `el segundo factor rechazó el código (GoTrue no acepta dos veces el mismo): ` +
        `espero ${espera}s a la ventana siguiente y reintento.`
    );
    await new Promise((resolver) => setTimeout(resolver, (espera + 1) * 1000));
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
      // El segundo paso va ANTES de leer el tarro: `mfa.verify` reemplaza la sesión por una
      // `aal2`, y las cookies que valen son las de DESPUÉS. Leerlas antes se lleva el JWT
      // `aal1` y la captura sale de /login/2fa con exit 0.
      console.log(`segundo factor: ${await elevarSegundoFactor(cliente)}`);
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
