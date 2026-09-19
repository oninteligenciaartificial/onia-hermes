// ONIA — Chatbot propio: ¿LA RESPUESTA DEL BOT LE LLEGO AL PROSPECTO?
//
// Para que existe: todo instrumento del carril cuenta "el bot contesto" por la EXISTENCIA de
// la fila saliente — la definicion de hecho del loop ("el bot contesto los DOS") se mide
// contando filas en `messages` de Chatwoot, el simulador imprime el texto, y el adapter solo
// mira que el POST devuelva 2xx. Un POST 2xx dice "Chatwoot lo acepto", NO "WhatsApp lo
// entrego": el veredicto de Meta llega DESPUES, por webhook asincrono, y Chatwoot lo escribe
// en `messages.status` + `content_attributes.external_error`.
//
// Nadie de los nuestros leia esa columna. Medido el 2026-09-19 en la base de Chatwoot:
// CINCO salientes en `failed`, tres de ellos en el inbox 5 (el de leads reales), con
// `131042: Business eligibility payment issue` — el error de Meta por falta de metodo de pago.
// Hoy no muerde (los cinco son nuestros y de agosto, y hubo entregas posteriores), pero es
// exactamente el modo de falla que el 1-oct-2026 pasa a ser el NORMAL: desde esa fecha Meta
// cobra la respuesta dentro de la ventana de 24 h y el metodo de pago sigue sin cargarse
// (tablero t_ac3aa802). Ese dia TODO saliente de WhatsApp vuelve `failed` y el sistema entero
// reporta verde, porque la fila existe.
//
// `usage-run.mjs` ya declara la mitad honesta de esto en su cabecera ("nuestra fila quedo
// diciendo `sent` para siempre"), pero cierra con "con lo que hay guardado hoy ese caso es
// INDISTINGUIBLE". Eso es cierto de NUESTRA tabla (`onia_center.bot_messages`, append-only,
// escrita en el momento del POST) y FALSO del sistema: Chatwoot lo guarda. Este medidor lee
// donde esta el dato.
//
//   entrada : la base de Chatwoot (lectura pura: ni un INSERT, ni un UPDATE)
//   salida  : texto legible · --json una linea JSON
//   codigo  : 0 ok · 1 hay una respuesta que NO llego · 2 NO MEDIDO (no se pudo preguntar)
//
// POR QUE TRI-ESTADO Y NO "0 fallidos = verde": un lector que no puede preguntar y firma ok
// es la familia de falso verde mas cara de esta casa. Sin filas juzgables NO se concluye.

import { execFileSync } from "node:child_process";

// El enum de Chatwoot (`Message.statuses`), verificado contra la base el 2026-09-19:
// inbox 4 (widget web) tiene sus 574 salientes en `read`, y los `failed` son los unicos que
// traen `external_error`.
export const ESTADO = { SENT: 0, DELIVERED: 1, READ: 2, FAILED: 3 };
export const LLEGO = [ESTADO.DELIVERED, ESTADO.READ];

/**
 * Un error puede apagar el canal ENTERO (la cuenta no puede pagar, la plantilla no existe, la
 * credencial murio) o ser propio de UN destinatario (numero que no esta en WhatsApp, ventana
 * de 24 h vencida para ese chat).
 *
 * La distincion no es cosmetica: decide QUE lo cura. Un fallo global lo desmiente cualquier
 * entrega POSTERIOR en el mismo inbox — si el canal volvio a entregar, el problema de cuenta
 * se resolvio. Un fallo por sujeto NO lo cura que otro haya salido bien despues, y por eso
 * sigue siendo rojo hasta que ese prospecto reciba algo.
 *
 * Sin esta pregunta el medidor quedaria rojo PARA SIEMPRE por los cinco fallidos de agosto,
 * que es como se apaga un gate sobre una tabla que nadie rota.
 *
 * La lista nombra lo GLOBAL y el default es "por sujeto", o sea ROJO: un error que no sabemos
 * clasificar se reporta. Falla hacia avisar, que es el lado barato.
 */
export function causaEsGlobal(error) {
  const e = String(error ?? "").toLowerCase();
  if (!e) return false;
  return (
    e.includes("131042") || // Meta: "Business eligibility payment issue" — no hay como cobrar
    e.includes("payment") ||
    e.includes("eligibility") ||
    e.includes("template not found") ||
    e.includes("invalid template") ||
    e.includes("404") || // el canal apunta a una URL que no existe
    e.includes("401") ||
    e.includes("403") ||
    e.includes("access token")
  );
}

/**
 * El ULTIMO saliente de cada conversacion. Es el sujeto correcto y no "todos los salientes":
 * lo que decide si un prospecto se quedo esperando es si la ULTIMA cosa que le dijimos le
 * llego. Un fallo del medio que despues se recupero no lo dejo colgado.
 */
export function ultimoDeCadaConversacion(salientes = []) {
  const porConv = new Map();
  for (const f of salientes) {
    if (!f || !Number.isInteger(f.conv)) continue;
    const previo = porConv.get(f.conv);
    // Desempate por id: dos filas del mismo segundo mantienen el orden de insercion.
    const masNuevo = !previo || f.creadoMs > previo.creadoMs || (f.creadoMs === previo.creadoMs && f.id > previo.id);
    if (masNuevo) porConv.set(f.conv, f);
  }
  return [...porConv.values()].sort((a, b) => a.conv - b.conv);
}

/**
 * NUCLEO PURO. `salientes`: filas `{id, conv, inbox, estado, creadoMs, error, nuestra}`.
 *
 * `nuestra` NO silencia nada: etiqueta. El sesgo de esta familia se invierte segun a quien le
 * escribe el circuito — en un barrido, confundir un desconocido con nosotros lo deja sin
 * seguimiento; aca, callar un fallo porque "parece nuestro" esconde que el canal esta muerto.
 * Se reporta todo y se ordena poniendo a los leads primero.
 */
// Un canal en desuso y uno que ACABA de romperse se ven igual si solo se pregunta "¿hubo algo
// despues?": los dos tienen cero salientes posteriores. Lo unico que los separa es el reloj.
export const DIAS_PARA_DESUSO = 14;

export function juzgarEntregas({ salientes, ahoraMs = Date.now() } = {}) {
  if (!Array.isArray(salientes)) {
    return { veredicto: "no-medido", motivo: "no se pudo preguntarle a la base de Chatwoot", sinLlegar: [], curados: [], mirados: 0 };
  }
  if (salientes.length === 0) {
    return {
      veredicto: "no-medido",
      motivo: "la consulta no devolvio ni un saliente: o el bot nunca contesto, o la consulta esta mal. No medir NO es estar bien",
      sinLlegar: [],
      curados: [],
      mirados: 0,
    };
  }

  const ultimos = ultimoDeCadaConversacion(salientes);
  const sinLlegar = [];
  const curados = [];

  for (const u of ultimos) {
    if (u.estado !== ESTADO.FAILED) continue;
    const global = causaEsGlobal(u.error);
    const posteriores = salientes.filter((f) => f.inbox === u.inbox && f.creadoMs > u.creadoMs);
    const hayEntregaPosterior = posteriores.some((f) => LLEGO.includes(f.estado));

    if (global && hayEntregaPosterior) {
      curados.push({ ...u, porQue: "causa global del canal, y despues volvio a entregar" });
    } else if (global && posteriores.length === 0 && ahoraMs - u.creadoMs > DIAS_PARA_DESUSO * 86_400_000) {
      // Ni una entrega ni un intento despues, en TODO el inbox: ese canal no esta roto, esta
      // en desuso, y no hay nadie esperando una respuesta. Distinguirlo importa porque si no
      // el gate queda rojo para siempre por una prueba nuestra del 1-ago sobre una tabla que
      // nadie rota — que es como se apaga un gate. DOS barandas para que no absuelva de mas:
      // la condicion es POR INBOX, y el fallo tiene que ser VIEJO — un canal que se rompio
      // recien tambien tiene cero salientes posteriores, y ese es justo el caso del 1-oct.
      curados.push({ ...u, porQue: "canal sin un solo saliente posterior: esta en desuso, no roto" });
    } else {
      sinLlegar.push({ ...u, global });
    }
  }

  // Los leads primero: son los unicos que se pierden de verdad.
  sinLlegar.sort((a, b) => Number(a.nuestra) - Number(b.nuestra) || a.conv - b.conv);

  return {
    veredicto: sinLlegar.length ? "rojo" : "ok",
    motivo: null,
    sinLlegar,
    curados,
    mirados: ultimos.length,
  };
}

export function lectura({ veredicto, sinLlegar = [], curados = [], mirados = 0, motivo } = {}) {
  const l = [];
  if (veredicto === "no-medido") {
    l.push(`NO MEDIDO — ${motivo}`);
    return l;
  }
  l.push(`${mirados} conversacion(es) con respuesta del bot — se mira si la ULTIMA le llego`);
  for (const s of sinLlegar) {
    const de = s.nuestra ? "(nuestra)" : "LEAD";
    l.push(`  NO LLEGO   conv ${s.conv} · inbox ${s.inbox} · ${de} · ${s.error || "sin error declarado"}`);
    l.push(`             lo que cree el sistema: que el bot contesto. Lo que paso: el prospecto no recibio nada.`);
  }
  for (const c of curados) {
    l.push(`  (curado)   conv ${c.conv} · inbox ${c.inbox} · ${c.error} — ${c.porQue}`);
  }
  l.push(
    veredicto === "rojo"
      ? `VEREDICTO: ${sinLlegar.length} respuesta(s) que el sistema da por entregadas y NO llegaron`
      : "ok — la ultima respuesta de cada conversacion llego a destino",
  );
  return l;
}

// ── lado vivo ────────────────────────────────────────────────────────────────

function sh(cmd, args, timeout = 30000) {
  try {
    return execFileSync(cmd, args, { encoding: "utf8", timeout }).trim();
  } catch {
    return null; // no se pudo preguntar — distinto de "me dijeron que no"
  }
}

/**
 * El nombre del contenedor se DERIVA (`docker ps`), nunca se clava: Swarm le pega un sufijo
 * distinto en cada re-deploy, y un nombre a mano deja el gate ciego en verde.
 */
export function leerSalientes(deps = {}) {
  const correr = deps.sh || sh;
  const nombres = correr("docker", ["ps", "--format", "{{.Names}}"], 20000);
  if (nombres === null) return null;
  const db = nombres.split("\n").find((n) => n.includes("chatwoot-db"));
  if (!db) return null;

  // El telefono y el nombre del contacto viajan porque son la unica prueba dura de que un
  // "lead" somos nosotros (el dueño prueba desde el inbox 5 con `+59171654992`).
  const sql =
    "select m.id, m.conversation_id, c.inbox_id, m.status, extract(epoch from m.created_at)*1000, " +
    // `content_attributes` guarda una CADENA JSON, no un objeto: el `->>'external_error'`
    // directo devuelve vacio SIEMPRE (medido el 2026-09-19 sobre los 5 fallidos reales), y un
    // error vacio hace que `causaEsGlobal` diga "por sujeto" y el gate se ponga rojo a ciegas.
    // Hay que desanidar con `#>> '{}'` antes de castear.
    "replace(coalesce((m.content_attributes #>> '{}')::jsonb ->> 'external_error',''), E'\\n', ' '), " +
    "replace(coalesce(ct.name,''), E'\\n', ' '), coalesce(ct.phone_number,'') " +
    "from messages m join conversations c on c.id = m.conversation_id " +
    "left join contacts ct on ct.id = c.contact_id where m.message_type = 1;";
  const out = correr("docker", ["exec", db, "psql", "-U", "postgres", "-d", "onia-chatbot", "-tAc", sql], 30000);
  if (out === null) return null;

  const filas = [];
  for (const linea of out.split("\n")) {
    if (!linea.trim()) continue;
    const [id, conv, inbox, estado, creado, error, nombre, tel] = linea.split("|");
    filas.push({
      id: Number(id),
      conv: Number(conv),
      inbox: Number(inbox),
      estado: Number(estado),
      creadoMs: Math.round(Number(creado)),
      error: error || "",
      nuestra: esNuestraFila({ inbox: Number(inbox), nombre, tel }),
    });
  }
  return filas;
}

// Etiqueta, no filtro. Deliberadamente simple y aditiva: el criterio fino vive en
// `es-nuestra.mjs` y lo usan los barridos que ESCRIBEN; aca solo ordena la salida.
export function esNuestraFila({ inbox, nombre, tel } = {}) {
  if (inbox === 3 || inbox === 7) return true; // ONIA Demo y ZZ QA Clinica Chatbot
  if (String(tel || "").replace(/[^\d+]/g, "") === "+59171654992") return true;
  return /\b(prueba|qa|test|sonda)\b/i.test(String(nombre || ""));
}

// La guarda: sin esto, importar el archivo para probarlo dispara `docker exec` contra produccion.
if (import.meta.url === `file://${process.argv[1]}`) {
  const r = juzgarEntregas({ salientes: leerSalientes() });
  const json = process.argv.includes("--json");
  if (json) console.log(JSON.stringify(r));
  else for (const linea of lectura(r)) console.log(linea);
  process.exit(r.veredicto === "ok" ? 0 : r.veredicto === "rojo" ? 1 : 2);
}
