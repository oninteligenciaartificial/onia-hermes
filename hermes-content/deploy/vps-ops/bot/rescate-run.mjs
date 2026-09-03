// ONIA — BARRIDO DE RESCATE: el mensaje que llego con el webhook caido.
//
// EL BUG QUE RESUELVE, medido en vivo el 2026-09-03 y no supuesto:
//
//   docker inspect onia-center  -> StartedAt 00:03:32  (el contenedor reinicio)
//   messages id=282  message_type=0  00:03:52  "Hola, quiero informacion sobre el sistema"
//   /var/log/onia-bot-watchdog.log  00:04:01  "el webhook NO responde en :3020 — reiniciando"
//   messages id=283  message_type=0  00:04:08  -> ESTE si tuvo respuesta (284, 00:04:12)
//
// O sea: el proceso del webhook cuelga de `docker exec -d` sobre `onia-center`. Cuando el
// contenedor reinicia, el proceso se va con el. El watchdog lo levanta, pero tarda hasta
// 2 minutos — y en esa ventana Chatwoot ya disparo su UNICO webhook contra un puerto muerto.
// Chatwoot no reintenta despues de eso. **Ese mensaje no se contesta nunca y nadie se entera.**
//
// No es teorico ni raro: hubo 20 reinicios del webhook entre el 28-ago y el 3-sep. Cada uno
// es una ventana en la que un desconocido puede escribir y quedar colgado para siempre. Es
// exactamente el modo de falla que el carril tiene escrito — el primer mensaje anda, el
// sistema muere en el segundo — pero por debajo del motor: el motor nunca se entera.
//
// EL ARREGLO NO ES EVITAR QUE EL PROCESO MUERA (eso es el watchdog, y ya existe): es que
// morirse deje de costar un lead. El barrido pregunta "quien escribio y sigue sin respuesta"
// y vuelve a meter ese mensaje por el MISMO webhook, con el MISMO payload que manda Chatwoot.
//
// POR QUE REINYECTAR ES SEGURO — y es lo que hace barato todo esto: el `message_key` que sale
// de aca es `chatwoot:<conv>:<msgId>`, IDENTICO al que arma el webhook en vivo. Si el mensaje
// ya se habia procesado, `store.claimInbound` (unique en `bot_messages.message_key`) lo corta
// antes de que el motor corra. El dedup durable ya existia; esto solo lo usa. Reinyectar de
// mas no produce una segunda respuesta — produce un skip.
//
// LAS DOS BARANDAS, y las dos son contra hablar de mas, no contra hablar de menos:
//   · MIN_EDAD_MS  — un mensaje de hace 10 s puede estar siendo contestado AHORA por el
//                    webhook normal. Rescatarlo seria correr una carrera contra el dedup.
//   · MAX_EDAD_MS  — contestarle a alguien que escribio hace tres dias es peor que no
//                    contestarle: llega fuera de contexto y fuera de la ventana de 24 h de Meta.
//
// Seco por defecto, como todo barrido del bot: solo `--emit` toca produccion.
//
//   node rescate-run.mjs [--emit] [--limit 20] [--now 2026-09-03T00:10:00Z]

/** Por debajo de esto el webhook en vivo todavia puede estar contestando. 3 min. */
export const MIN_EDAD_MS = 3 * 60 * 1000;

/** Por encima de esto la respuesta llega fuera de contexto. 12 h, dentro de la ventana Meta. */
export const MAX_EDAD_MS = 12 * 60 * 60 * 1000;

/** Inboxes donde atiende el bot: 4 = Onia Web (widget), 5 = Onia WhatsApp. */
export const INBOXES_BOT = [4, 5];

const ENTRANTE = 0;
const SALIENTE = 1;

/**
 * De todas las filas de mensajes, cuales quedaron sin contestar.
 *
 * Pura y sin I/O: recibe las filas tal como salen del psql, en cualquier orden, y devuelve
 * un entrante por conversacion — el ultimo — solo si NO hay ningun saliente posterior.
 *
 * La actividad del sistema (`message_type=2`: "marked resolved", cambios de estado) NO tapa
 * a un entrante: resolver una conversacion no es haberle contestado a la persona.
 */
export function seleccionarHuerfanos(filas, { ahoraMs, minEdadMs = MIN_EDAD_MS, maxEdadMs = MAX_EDAD_MS } = {}) {
  const porConversacion = new Map();
  for (const fila of Array.isArray(filas) ? filas : []) {
    if (!fila || fila.private === true) continue;
    const tipo = Number(fila.messageType);
    if (tipo !== ENTRANTE && tipo !== SALIENTE) continue; // actividad del sistema: no es un turno
    const lista = porConversacion.get(fila.conversationId) || [];
    lista.push(fila);
    porConversacion.set(fila.conversationId, lista);
  }

  const huerfanos = [];
  for (const lista of porConversacion.values()) {
    // Orden estable: por fecha, y a igual fecha por id — dos mensajes pueden compartir segundo.
    lista.sort((a, b) => a.createdAtMs - b.createdAtMs || a.messageId - b.messageId);
    const ultimo = lista[lista.length - 1];
    if (Number(ultimo.messageType) !== ENTRANTE) continue; // ya le contestaron
    const edad = ahoraMs - ultimo.createdAtMs;
    if (edad < minEdadMs || edad > maxEdadMs) continue;
    huerfanos.push(ultimo);
  }
  return huerfanos;
}

/**
 * El payload `message_created` tal cual lo manda Chatwoot, para que lo coma el MISMO
 * `parseChatwootWebhook` sin un camino aparte. Un rescate que usara su propio formato seria
 * una segunda implementacion que envejece sola.
 */
export function construirPayloadRescate(fila) {
  return {
    event: "message_created",
    id: fila.messageId,
    content: fila.content ?? "",
    message_type: "incoming",
    private: false,
    created_at: new Date(fila.createdAtMs).toISOString(),
    attachments: fila.attachments ?? [],
    sender: fila.sender ?? undefined,
    inbox: { id: fila.inboxId },
    conversation: { id: fila.conversationId, inbox_id: fila.inboxId },
  };
}

/**
 * Lee de la base de Chatwoot los mensajes recientes de los inboxes del bot.
 * Va por `docker exec psql` porque la base de Chatwoot no esta expuesta al host — el mismo
 * camino que usan el resto de los scripts del carril.
 */
async function leerFilasDeChatwoot({ desdeMs, ahoraMs }) {
  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const run = promisify(execFile);

  const contenedor = process.env.ONIA_CHATWOOT_DB_CONTAINER
    || (await run("sh", ["-c", "docker ps --format '{{.Names}}' | grep chatwoot-db | head -1"])).stdout.trim();
  if (!contenedor) throw new Error("no encontre el contenedor de la base de Chatwoot");

  const desde = new Date(desdeMs).toISOString();
  const sql = `select m.conversation_id, m.id, m.message_type, extract(epoch from m.created_at)*1000,
      coalesce(m.private,false), c.inbox_id, replace(coalesce(m.content,''), E'\\t', ' ')
    from messages m join conversations c on c.id = m.conversation_id
    where c.inbox_id in (${INBOXES_BOT.join(",")}) and m.created_at >= '${desde}'
    order by m.conversation_id, m.created_at;`;

  const { stdout } = await run("docker", ["exec", contenedor, "psql", "-U", "postgres", "-d", "onia-chatbot", "-tAF\t", "-c", sql]);
  return stdout
    .split("\n")
    .map((l) => l.split("\t"))
    .filter((c) => c.length >= 7)
    .map((c) => ({
      conversationId: Number(c[0]),
      messageId: Number(c[1]),
      messageType: Number(c[2]),
      createdAtMs: Math.round(Number(c[3])),
      private: c[4] === "t",
      inboxId: Number(c[5]),
      content: c[6],
    }));
}

/** La misma ruta que sirve `webhook-server.mjs` (su `WEBHOOK_PATH`). */
const RUTA_WEBHOOK = "/webhook/chatwoot";

/** La clave tal como `webhook-server.sh` la exporta al proceso del webhook. */
const CLAVE_SECRETO_RUTA = "ONIA_CHATWOOT_WEBHOOK_PATH_SECRET";

/** El archivo que `webhook-server.sh` sourcea (`ENV_FILE`) para armar ese env. */
const ENV_FILE_POR_DEFECTO = "/opt/onia/bot/webhook.env";

/**
 * Saca el secreto de ruta del contenido del env file.
 *
 * Se lee del MISMO archivo que usa `webhook-server.sh`, no de una copia: un secreto duplicado
 * en dos lados es un secreto que se desincroniza y vuelve el 401 sin que nadie sepa por que.
 * El archivo lo escribe y lo sourcea un shell, asi que aguanta `export`, comillas y espacios.
 */
export function parsearSecretoDeRuta(contenido) {
  for (const linea of String(contenido ?? "").split("\n")) {
    const limpia = linea.trim().replace(/^export\s+/, "");
    if (!limpia || limpia.startsWith("#")) continue;
    const igual = limpia.indexOf("=");
    if (igual < 0 || limpia.slice(0, igual).trim() !== CLAVE_SECRETO_RUTA) continue;
    return limpia.slice(igual + 1).trim().replace(/^(['"])([\s\S]*)\1$/, "$2") || undefined;
  }
  return undefined;
}

/**
 * La URL contra la que se reinyecta.
 *
 * EL 401 VIVIA ACA. De los dos mecanismos de `authenticateChatwootRequest`, la firma HMAC exige
 * el `rawBody` exacto y un timestamp fresco; el secreto en la ruta es el piso garantizado y el
 * unico que se puede armar desde afuera del proceso. Sin secreto NO se inventa una ruta: se pega
 * pelado a proposito, para que el 401 se vea en vez de disfrazarse de otra cosa.
 */
export function construirUrlWebhook({ puerto, secreto } = {}) {
  const base = `http://127.0.0.1:${puerto || "3020"}${RUTA_WEBHOOK}`;
  return secreto ? `${base}/${encodeURIComponent(secreto)}` : base;
}

/** El comando entero viaja en el mensaje de error de execFile, y de ahi al log. */
function redactar(texto, secreto) {
  let salida = String(texto ?? "");
  if (!secreto) return salida;
  for (const forma of new Set([secreto, encodeURIComponent(secreto)])) {
    salida = salida.split(forma).join("***");
  }
  return salida;
}

export async function postAlWebhook(payload, deps = {}) {
  const env = deps.env || process.env;
  const puerto = env.ONIA_WEBHOOK_PORT || "3020";
  const contenedor = env.ONIA_BOT_CONTAINER || "onia-center";
  const leerEnv = deps.leerEnv || (async () => {
    const { readFileSync } = await import("node:fs");
    try {
      return readFileSync(env.ONIA_WEBHOOK_ENV_FILE || ENV_FILE_POR_DEFECTO, "utf8");
    } catch {
      return ""; // sin archivo se pega pelado y el 401 dice la verdad
    }
  });
  let run = deps.run;
  if (!run) {
    const { execFile } = await import("node:child_process");
    const { promisify } = await import("node:util");
    run = promisify(execFile);
  }

  const secreto = String(env[CLAVE_SECRETO_RUTA] || "").trim() || parsearSecretoDeRuta(await leerEnv());
  const url = construirUrlWebhook({ puerto, secreto });
  // wget desde adentro del contenedor: el 3020 escucha en su loopback, no en el host.
  const cuerpo = JSON.stringify(payload).replace(/'/g, "'\\''");
  try {
    const { stdout } = await run("docker", [
      "exec", contenedor, "sh", "-c",
      `printf '%s' '${cuerpo}' | wget -qO- --timeout=30 --header='Content-Type: application/json' --post-file=- ${url}`,
    ]);
    return { ok: true, respuesta: redactar(stdout, secreto).slice(0, 300) };
  } catch (error) {
    throw new Error(redactar(error?.message || error, secreto));
  }
}

/**
 * Que hizo el webhook con la reinyeccion.
 *
 * MANDAR NO ES RESCATAR. Medido el 2026-09-03: el unico huerfano estaba en `handoff_humano`,
 * la reinyeccion salio sin error y el barrido conto "1 reinyectado" habiendo salvado CERO.
 * Lo unico que salva un lead es que el webhook diga que salio algo (`sent`).
 */
export function clasificarRespuesta(respuesta) {
  let cuerpo;
  try {
    cuerpo = JSON.parse(String(respuesta ?? ""));
  } catch {
    return { contestado: false, motivo: "respuesta_ilegible" };
  }
  const salidas = Array.isArray(cuerpo?.sent) ? cuerpo.sent.length : 0;
  if (salidas > 0) return { contestado: true, motivo: "contestado" };
  return { contestado: false, motivo: String(cuerpo?.reason || "sin_respuesta") };
}

export async function runRescateSweep(options = {}, deps = {}) {
  const ahoraMs = Number.isFinite(options.ahoraMs) ? options.ahoraMs : Date.now();
  const emitir = options.emitir === true;
  const limite = Number.isFinite(options.limit) && options.limit > 0 ? Math.floor(options.limit) : 20;
  const leerFilas = deps.leerFilas || leerFilasDeChatwoot;
  const postWebhook = deps.postWebhook || postAlWebhook;

  const filas = await leerFilas({ desdeMs: ahoraMs - MAX_EDAD_MS - MIN_EDAD_MS, ahoraMs });
  const huerfanos = seleccionarHuerfanos(filas, { ahoraMs }).slice(0, limite);

  const resultado = { huerfanos: huerfanos.length, reinyectados: 0, contestados: 0, fallidos: [], detalle: [] };
  for (const fila of huerfanos) {
    const linea = {
      conversationId: fila.conversationId,
      messageId: fila.messageId,
      edadMin: Math.round((ahoraMs - fila.createdAtMs) / 60000),
      texto: String(fila.content || "").slice(0, 60),
    };
    resultado.detalle.push(linea);
    if (!emitir) continue;
    try {
      const enviado = await postWebhook(construirPayloadRescate(fila));
      resultado.reinyectados += 1;
      const veredicto = clasificarRespuesta(enviado?.respuesta);
      linea.resultado = veredicto.motivo;
      if (veredicto.contestado) resultado.contestados += 1;
    } catch (error) {
      // El fallo de uno no puede cancelar el rescate de los otros: son leads distintos.
      resultado.fallidos.push({ ...linea, motivo: String(error?.message || error) });
    }
  }
  return resultado;
}

const esCLI = process.argv[1] && process.argv[1].endsWith("rescate-run.mjs");
if (esCLI) {
  const argv = process.argv.slice(2);
  const valor = (bandera) => {
    const i = argv.indexOf(bandera);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const nowArg = valor("--now");
  const opciones = {
    emitir: argv.includes("--emit"),
    limit: Number(valor("--limit")) || undefined,
    ahoraMs: nowArg ? Date.parse(nowArg) : Date.now(),
  };
  runRescateSweep(opciones)
    .then((r) => {
      for (const d of r.detalle) {
        const veredicto = d.resultado ? ` -> ${d.resultado}` : "";
        console.log(`conv ${d.conversationId} msg ${d.messageId} — ${d.edadMin} min sin respuesta — "${d.texto}"${veredicto}`);
      }
      for (const f of r.fallidos) console.log(`FALLO conv ${f.conversationId}: ${f.motivo}`);
      console.log(
        `${r.huerfanos} sin respuesta · ${r.reinyectados} reinyectados · ${r.contestados} CONTESTADOS${opciones.emitir ? "" : " (SECO — agregar --emit)"}`,
      );
      process.exit(r.fallidos.length ? 1 : 0);
    })
    .catch((error) => {
      console.error(`rescate-run: ${String(error?.message || error)}`);
      process.exit(2);
    });
}
