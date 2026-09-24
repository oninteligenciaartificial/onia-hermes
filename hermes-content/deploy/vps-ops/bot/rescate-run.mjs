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

// El unico import del archivo, y es de un HERMANO del mismo directorio: `deploy-bot.sh` copia
// por glob (`*.mjs`), asi que viaja con el resto. Lo que no se puede importar acá es algo de
// `scripts/`, que no existe en `/opt/onia/bot` — ver `escaparHtml` mas abajo.
import { crearMarcasEnDisco as crearMarcas } from "./marcas-en-disco.mjs";

/** Por debajo de esto el webhook en vivo todavia puede estar contestando. 3 min. */
export const MIN_EDAD_MS = 3 * 60 * 1000;

/** Por encima de esto la respuesta llega fuera de contexto. 12 h, dentro de la ventana Meta. */
export const MAX_EDAD_MS = 12 * 60 * 60 * 1000;

/** Inboxes donde atiende el bot: 4 = Onia Web (widget), 5 = Onia WhatsApp. */
export const INBOXES_BOT = [4, 5];

/**
 * Los motivos por los que NO salir nada es correcto — y por lo tanto no es un rescate fallido.
 *
 * Es una excusa, asi que va nombrada y con dueno: en `handoff_humano` el bot se calla A
 * PROPOSITO porque la conversacion paso a una persona. Que esa persona tampoco haya
 * contestado es real y es de `onia-vigia-sin-respuesta.sh` (cron 39 de cada 2 h); repetirlo
 * aca cada 10 min duplicaria su aviso, que es como se entrena a no leer los avisos.
 *
 * Todo lo demas que no emite ES un fallo: `seleccionarHuerfanos` ya probo que en esa
 * conversacion no hay ningun saliente. Enumerar motivos MALOS seria una lista de inclusion y
 * fallaria abierto con el motivo nuevo que nadie previo; enumerar la excusa falla cerrado.
 */
export const MOTIVOS_SIN_RESCATE_AJENO = new Set(["handoff_humano"]);

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
    // ⚠️ Acá había un `.slice(0, 300)` y era EL bug, medido el 2026-09-03 con el primer
    // rescate real: el cuerpo de exito son ~903 caracteres (lleva adentro el mensaje que el
    // bot mando) y cortado a 300 deja de ser JSON. El de dedup son 101 y sobrevivia intacto.
    // O sea que el corte rompia UNICAMENTE el caso que salva un lead, y por eso todo lo que
    // se habia probado —dedup— salio verde siempre. El cuerpo se devuelve entero: lo unico
    // que lo lee es `clasificarRespuesta`, y truncar lo que hay que parsear no es acotar, es
    // corromper. Quien quiera mostrarlo, que lo acote al mostrarlo.
    return { ok: true, respuesta: redactar(stdout, secreto) };
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

/**
 * Telegram va en HTML (`onia-tg.sh`), asi que el texto de la persona se escapa SIEMPRE: un `<`
 * suelto no rompe el mensaje, lo hace no llegar — y el aviso que no llega es el bug otra vez.
 *
 * Se escribe aca en vez de importarlo de `scripts/`: este archivo se rsyncea plano a
 * `/opt/onia/bot`, donde esa carpeta no existe, y `espejo-check.mjs` compara el juego de
 * archivos. Un import que cruce el espejo revienta en produccion, no en el test.
 */
function escaparHtml(texto) {
  return String(texto ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * El aviso de un rescate CONSUMADO.
 *
 * Solo se arma con los que el webhook contesto de verdad: los que se reinyectaron y salieron
 * deduplicados no salvaron a nadie, y avisar de ellos entrena a no leer los avisos.
 */
export function armarAvisoRescate(resultado) {
  const salvados = (resultado?.detalle || []).filter((d) => d.resultado === "contestado");
  if (!salvados.length) return null;
  const cabeza =
    salvados.length === 1
      ? "🛟 <b>Rescatado un mensaje perdido</b>"
      : `🛟 <b>Rescatados ${salvados.length} mensajes perdidos</b>`;
  const lineas = salvados.map(
    (d) =>
      `· conv ${d.conversationId}: esperaba hace ${d.edadMin} min — «${escaparHtml(d.texto)}»`,
  );
  return [
    cabeza,
    "El webhook estaba caido cuando entro y Chatwoot no reintenta. El bot ya le contesto.",
    ...lineas,
  ].join("\n");
}

/**
 * El aviso del mensaje que NO se pudo rescatar — la mala noticia, y va en su PROPIO mensaje.
 *
 * No se mezcla con el de arriba a proposito: `onia-tg.sh` clasifica por la primera linea para
 * decidir si el aviso es informativo o abre una tarea. Un mensaje que empiece con 🛟 y remate
 * con un fallo se rutea como buena noticia y el lead perdido no le llega a nadie.
 */
export function armarAvisoPerdido(perdidos) {
  const lista = (perdidos || []).filter(Boolean);
  if (!lista.length) return null;
  const cabeza =
    lista.length === 1
      ? "🔴 <b>Un mensaje quedo SIN contestar</b>"
      : `🔴 <b>${lista.length} mensajes quedaron SIN contestar</b>`;
  const lineas = lista.map(
    (d) =>
      `· conv ${d.conversationId}: espera hace ${d.edadMin} min — «${escaparHtml(d.texto)}» (${escaparHtml(d.motivo)})`,
  );
  return [
    cabeza,
    "El barrido lo reinyecto y el bot no emitio nada. Hay una persona esperando en la bandeja.",
    ...lineas,
  ].join("\n");
}

// ---------------------------------------------------------------------------
// LA MEMORIA DEL AVISO — una sola vez por mensaje, y durable entre corridas.
// ---------------------------------------------------------------------------

/**
 * Cuanto vive una marca. La ventana del huerfano es `MAX_EDAD_MS`; el doble deja margen para
 * un reloj corrido y garantiza que una marca no pueda silenciar a un mensaje que TODAVIA es
 * huerfano. Pasado eso se borra: sin purga el directorio crece para siempre.
 */
export const VIDA_MARCA_MS = MAX_EDAD_MS * 2;

/** Donde viven las marcas en el VPS. Mismo patron que `/var/lib/onia-vigia-remotos/<id>`. */
export const DIR_MARCAS_POR_DEFECTO = "/var/lib/onia-rescate-avisado";

/**
 * NINGUN TEST TOCA PRODUCCION. Medido el 2026-09-11: los casos que llamaban al barrido con
 * `emitir: true` sin inyectar `deps.avisar` ni `deps.marcas` caian a los defaults REALES y
 * (a) le crearon a Sergio Urcullo una tarea en el tablero afirmando que habia una persona
 * esperando —era la sonda de QA, ya contestada— y (b), lo caro, escribieron la marca
 * `chatwoot-11-873` en `/var/lib/onia-rescate-avisado/`: el lead REAL del 10-sep que motivo
 * todo este archivo. Esa marca existe para no repetir un aviso ya entregado, asi que con
 * ella puesta el aviso de ese mensaje deja de salir. El instrumento que existe para no
 * perder un lead lo silencia su propio test, en verde.
 *
 * TIRA en vez de no-operar, y es la diferencia entre una baranda y un placebo: un no-op
 * silencioso deja en verde a un caso que cree estar probando el aviso. Asi falla CERRADO —
 * un caso futuro con `emitir: true` que no inyecte explota solo y con el nombre de lo que le
 * falta—, y por eso no hace falta ademas un gate que parsee el archivo de tests buscando la
 * forma del descuido: enumerar formas es una lista de inclusion y se le escapa la siguiente.
 *
 * `NODE_TEST_CONTEXT` lo define el runner de Node y NADIE mas (medido: `"child-v8"` adentro,
 * `undefined` afuera). El cron corre `node rescate-run.mjs --emit` sin runner, asi que en
 * produccion esta guarda no existe.
 */
export function guardaDeEfectoReal(que) {
  if (!process.env.NODE_TEST_CONTEXT) return;
  const error = new Error(
    `hermetismo: un test llego al ${que} REAL del rescate. Inyectale deps.${que} al barrido ` +
      `(o pasale un directorio propio a crearMarcasEnDisco): tocar produccion desde la suite ` +
      `manda avisos falsos y, peor, deja marcas que silencian el aviso de un lead de verdad.`,
  );
  // Marcado para que el `try/catch` del aviso —que existe para que un Telegram caido no
  // tumbe un rescate ya hecho— no se lo trague. Sin esto la baranda falla ABIERTA justo en
  // el caso que viene a cuidar: el aviso queda silenciado y el test pasa en VERDE creyendo
  // que lo probo. Un fallo de Telegram se aguanta; un test escrito mal, no.
  error.hermetismo = true;
  throw error;
}

/**
 * El aviso de verdad: Telegram por `onia-tg.sh`, que desde el 08-sep enruta los 🔴 al tablero.
 * Vive aca arriba y con nombre —en vez de ser un closure adentro del barrido— para que la
 * guarda sea visible y para que un test pueda afirmar sobre ella sin ejecutarla.
 */
export async function avisarPorTelegram(texto) {
  guardaDeEfectoReal("avisar");
  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  await promisify(execFile)("/root/bin/onia-tg.sh", [texto]);
}

/**
 * La clave es por MENSAJE, no por conversacion ni por vuelta: dos mensajes perdidos de la
 * misma persona son dos leads distintos.
 *
 * Sin `conv` o sin `msg` devuelve `null` y NO se inventa una clave parcial: una clave
 * compartida silenciaria mensajes que nadie miro. Y el id se valida entero en vez de
 * sanearse, porque un id contaminado que "se limpia" produce una clave que colisiona con otra
 * legitima — es mas seguro no tener marca (y avisar de mas) que tener la marca equivocada.
 */
export function claveDeMarca({ conversationId, messageId } = {}) {
  const conv = String(conversationId ?? "");
  const msg = String(messageId ?? "");
  if (!/^[0-9A-Za-z_-]+$/.test(conv) || !/^[0-9A-Za-z_-]+$/.test(msg)) return null;
  return `chatwoot-${conv}-${msg}`;
}

/**
 * POR QUE UN ARCHIVO Y NO `bot_messages.message_key`, que ya es unique y ya existe.
 *
 * Se midio primero contra produccion el 2026-09-11, que era lo que pedia el item, y la tabla
 * NO sirve — por dos razones independientes:
 *
 *   1. FK. `bot_messages.conversation_key` REFERENCES `bot_conversations(conversation_key)`.
 *      El insert de la marca falla justo cuando el webhook nunca creo la conversacion, que es
 *      EL peor modo de falla (401, puerto muerto, 500): no se puede recordar exactamente al
 *      mensaje que mas hay que recordar, y el aviso volveria cada 10 min.
 *   2. CONTABILIDAD. `direction` solo acepta `inbound|outbound` (CHECK), y `usage-run.mjs`
 *      cuenta `direction=eq.outbound` para el uso que se le COBRA al cliente. Una marca ahi
 *      es una conversacion facturada que nunca existio. Y `inbound` seria mentir sobre un
 *      mensaje que no entro.
 *
 * El archivo no tiene ninguno de los dos problemas y la reserva es atomica: `wx` falla con
 * EEXIST si ya estaba, asi que dos barridos simultaneos no pueden avisar los dos.
 *
 * `reservar` devuelve `true` (es nueva, avisar) · `false` (ya se aviso) · `null` (no pude
 * preguntar). El `null` NO es `false`: se dice aparte, porque "no pude recordar" y "ya avise"
 * llevan a decisiones distintas.
 */
export function crearMarcasEnDisco(dir) {
  // EL CUERPO SE MUDO a `marcas-en-disco.mjs` el 2026-09-24, cuando el segundo barrido (las
  // colgadas de `followup-run.mjs`) necesito el mismo candado. Esta firma no cambio y por eso
  // ningun caso de `rescate-run.test.mjs` se toco: el rescate sigue nombrando SU directorio,
  // SU variable de entorno y SU baranda. Copiar el cuerpo era la salida barata y es el error
  // que este bot ya pago con los dos armadores de config hermanos: se arregla uno y el camino
  // vivo sigue roto, en verde.
  return crearMarcas({
    dir,
    envVar: "ONIA_RESCATE_MARCAS",
    porDefecto: DIR_MARCAS_POR_DEFECTO,
    guarda: () => guardaDeEfectoReal("marcas"),
  });
}

export async function runRescateSweep(options = {}, deps = {}) {
  const ahoraMs = Number.isFinite(options.ahoraMs) ? options.ahoraMs : Date.now();
  const emitir = options.emitir === true;
  const limite = Number.isFinite(options.limit) && options.limit > 0 ? Math.floor(options.limit) : 20;
  const leerFilas = deps.leerFilas || leerFilasDeChatwoot;
  const postWebhook = deps.postWebhook || postAlWebhook;
  const avisar = deps.avisar || avisarPorTelegram;
  // Perezoso: en seco no se avisa ni se marca nada, asi que construir el almacen real seria
  // pedirle permiso de escritura a produccion para no usarlo.
  const marcas = deps.marcas || (emitir ? crearMarcasEnDisco() : null);

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
      // NO EMITIR ES FALLAR, y no hace falta opinar sobre el motivo para saberlo:
      // `seleccionarHuerfanos` ya probo que esta conversacion no tiene NINGUN saliente, asi
      // que una reinyeccion sin `sent` dejo a la persona tan muda como estaba. Antes solo
      // caia aca `respuesta_ilegible` —la mitad de la familia—, y el resto salia con exit 0
      // y "0 CONTESTADOS", identico a una vuelta sin trabajo: asi el testigo roto del 3-sep
      // vivio doce corridas en silencio, y el "hola" del 10-sep (conv 11 msg 873, inbox 5)
      // cuatro mas, hasta que la persona volvio a escribir sola.
      else if (!MOTIVOS_SIN_RESCATE_AJENO.has(veredicto.motivo)) {
        resultado.fallidos.push({ ...linea, motivo: `reinyectado y sin respuesta (${veredicto.motivo})` });
      }
    } catch (error) {
      // El fallo de uno no puede cancelar el rescate de los otros: son leads distintos.
      resultado.fallidos.push({ ...linea, motivo: String(error?.message || error) });
    }
  }

  // LO PERDIDO TAMBIEN SE AVISA, pero UNA SOLA VEZ POR MENSAJE. La ventana del huerfano son
  // 12 h y el cron corre cada 10 min: avisar por vuelta serian hasta 72 mensajes identicos por
  // el MISMO lead, que es como se entrena a no leer los avisos. La marca se reserva ANTES de
  // mandar —igual que el recordatorio (M9)—, asi que si no se puede reservar no se manda: el
  // fallo ya vive en el log y en el `exit 1`, y repetirlo 72 veces seria peor que no decirlo.
  const perdidos = [];
  if (emitir) {
    await marcas.purgar(ahoraMs - VIDA_MARCA_MS);
    for (const f of resultado.fallidos) {
      const reserva = await marcas.reservar(claveDeMarca(f));
      if (reserva === true) perdidos.push(f);
      else if (reserva === null) {
        (resultado.marcasFallidas ||= []).push(
          `conv ${f.conversationId} msg ${f.messageId}: no se pudo recordar el aviso, no se manda`,
        );
      }
    }
  }

  // Telegram es el TESTIGO del rescate, no el rescate. Si el aviso falla, la persona ya fue
  // contestada igual: tirar aca convertiria un exito en un exit 2 y el proximo barrido
  // reinyectaria de gusto.
  const avisos = emitir
    ? [
        { texto: armarAvisoRescate(resultado), reservados: [] },
        { texto: armarAvisoPerdido(perdidos), reservados: perdidos },
      ].filter((a) => a.texto)
    : [];
  for (const { texto, reservados } of avisos) {
    try {
      await avisar(texto);
    } catch (error) {
      if (error?.hermetismo) throw error; // un test sin `deps.avisar` se entera, no se silencia
      resultado.avisoFallido = String(error?.message || error);
      // La marca existe para no repetir un aviso ENTREGADO. Si Telegram se cayo, ese lead no
      // se anuncio nunca: se suelta para que el barrido siguiente lo reintente, o la reserva
      // dejaria de evitar ruido y pasaria a tragarse al unico aviso que importaba.
      for (const f of reservados) await marcas.liberar?.(claveDeMarca(f));
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
      for (const f of r.fallidos) console.log(`FALLO conv ${f.conversationId} msg ${f.messageId}: ${f.motivo}`);
      for (const m of r.marcasFallidas || []) console.log(`SIN MARCA ${m}`);
      if (r.avisoFallido) console.log(`AVISO NO ENTREGADO: ${r.avisoFallido}`);
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
