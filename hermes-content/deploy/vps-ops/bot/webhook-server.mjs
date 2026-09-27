// ONIA — Chatbot propio: SERVIDOR DE WEBHOOK. n8n SALE DEL CAMINO CRÍTICO.
//
// ANTES (n8n adentro del camino de respuesta):
//   Chatwoot -> n8n -> SSH -> chatwoot-adapter.sh -> md5sum de *.mjs + docker cp + docker exec
//            -> node (arranque en frío) -> runTurn -> API de Chatwoot
//   n8n caído o trabado = BOT MUDO. Y el salto extra se paga en cada mensaje, con el VPS al
//   240% de carga (load 9,6 sobre 4 núcleos, swap al 80%).
//
// AHORA (patrón de Bolivian Electric, `apps/web/app/api/chatwoot/webhook/route.ts`):
//   Chatwoot -> ESTE servidor (proceso caliente) -> runChatwootTurn -> API de Chatwoot
//            -> n8n fire-and-forget, DESPUÉS de responder, sin esperarlo
//   n8n caído = se pierde una fila de analítica. El prospecto ya fue atendido.
//
// Lo que se elimina por mensaje: el salto a n8n, el SSH, el `md5sum` de todos los `.mjs`, el
// `docker cp` y el arranque en frío de Node. El proceso queda vivo y el módulo ya importado.
//
// ORDEN DEL PIPELINE (no negociable, cada paso es más caro que el anterior):
//   1. método + ruta            5. dedup por id de mensaje  -> 200 `deduped`
//   2. tope de tamaño del body  6. correr el turno (motor + Chatwoot)
//   3. AUTENTICAR -> 401/503    7. responder 200
//   4. parsear -> 400 / skip    8. recién ahí, disparar el evento a n8n (desacoplado)
//
// REGLA DE ORO DE LOS CÓDIGOS DE ESTADO: salvo auth y JSON roto, TODO devuelve 2xx. Chatwoot
// reintrega los webhooks no-2xx: un 500 nuestro se traduce en que el prospecto recibe la misma
// respuesta dos veces. Un error interno se reporta en el cuerpo con 200, no reventando.
//
// El motor (`bot-engine.mjs`) NO se toca: este archivo es transporte y nada más.
//
// Config (nada secreto vive en el repo — ver webhook-server.sh y N8N_WORKFLOW.md §10.9):
//   ONIA_WEBHOOK_PORT                        default 3020
//   ONIA_CHATWOOT_WEBHOOK_SECRET             secreto HMAC de la firma
//   ONIA_CHATWOOT_WEBHOOK_PATH_SECRET        secreto en la URL (el que siempre funciona)
//   ONIA_CHATWOOT_SIGNATURE_TOLERANCE_SECONDS  default 300
//   ONIA_CHATWOOT_ALLOW_UNSIGNED=true        SÓLO local. Sin esto, sin secreto = 503.
//   ONIA_WEBHOOK_MAX_BODY_BYTES              default 1 MiB
//   ONIA_N8N_ENABLED / ONIA_N8N_EVENT_URL / ONIA_N8N_EVENT_SECRET  (ver n8n-event.mjs)

import { createServer } from "node:http";
import { pathToFileURL } from "node:url";

import { inboxDelPayload, parseChatwootWebhook, runChatwootTurn } from "./chatwoot-adapter.mjs";
import { authenticateChatwootRequest, DEFAULT_TOLERANCE_SECONDS } from "./webhook-security.mjs";
import { shouldProcessMessage, releaseMessage } from "./message-dedup.mjs";
import { buildBotTurnEvent, fireN8nBotTurnEvent, getN8nEventConfig } from "./n8n-event.mjs";
import { construirAviso, dispararAvisoTelegram, getAvisoTelegramConfig } from "./aviso-telegram.mjs";
import { esEntranteReal, dispararUsoPlataforma, getUsoConfig } from "./uso-plataforma.mjs";
import { ensureKnowledgeHealth } from "./knowledge.mjs";
import { createStore } from "./persistence.mjs";
import { handlePreviewRequest } from "./preview-route.mjs";
import { handleEditorRequest } from "./editor-sugerir.mjs";
import { handleBcpCobrar, handleBcpCallback } from "./bcp-qr.mjs";
import { createChatwootClient } from "./chatwoot-adapter.mjs";

export const DEFAULT_PORT = 3020;
export const DEFAULT_MAX_BODY_BYTES = 1024 * 1024;
export const WEBHOOK_PATH = "/webhook/chatwoot";

/**
 * Timeout del chequeo de base. CORTO a proposito (el resto del bot usa 8 s): /health lo mira el
 * vigilante cada 10 minutos y tiene que contestar SIEMPRE. Preferimos reportar `db.ok=false` por
 * lentitud a dejar la unica ventana de diagnostico colgada esperando a una base que no vuelve.
 */
export const DB_HEALTH_TIMEOUT_MS = 2500;

/** Clave que no existe ni va a existir: la lectura pega el indice unico y no devuelve datos. */
const DB_HEALTH_PROBE_KEY = "health:probe";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export function getServerConfig(env = process.env) {
  const tolerance = Number(env.ONIA_CHATWOOT_SIGNATURE_TOLERANCE_SECONDS);
  const maxBody = Number(env.ONIA_WEBHOOK_MAX_BODY_BYTES);
  const port = Number(env.ONIA_WEBHOOK_PORT);

  return {
    port: Number.isFinite(port) && port > 0 ? port : DEFAULT_PORT,
    webhookSecret: String(env.ONIA_CHATWOOT_WEBHOOK_SECRET ?? "").trim() || undefined,
    pathSecret: String(env.ONIA_CHATWOOT_WEBHOOK_PATH_SECRET ?? "").trim() || undefined,
    toleranceSeconds: Number.isFinite(tolerance) ? tolerance : DEFAULT_TOLERANCE_SECONDS,
    allowUnsigned: String(env.ONIA_CHATWOOT_ALLOW_UNSIGNED ?? "").toLowerCase() === "true",
    maxBodyBytes: Number.isFinite(maxBody) && maxBody > 0 ? maxBody : DEFAULT_MAX_BODY_BYTES,
  };
}

/** Parte SINCRÓNICA del estado: sólo la config, sin tocar red. NUNCA devuelve el valor de un secreto. */
export function getAuthHealth(config = getServerConfig()) {
  const ok = Boolean(config.webhookSecret || config.pathSecret || config.allowUnsigned);
  return {
    ok,
    firma: Boolean(config.webhookSecret),
    ruta: Boolean(config.pathSecret),
    sinVerificar: Boolean(config.allowUnsigned),
    // Se grita fuerte: sin esto el endpoint no procesa nada y hay que enterarse mirando /health,
    // no descubriéndolo porque el bot no contesta.
    aviso: ok ? undefined : "SIN SECRETO CONFIGURADO: el webhook responde 503 a todo.",
  };
}

/**
 * ¿La base RESPONDE? Una lectura de verdad contra PostgREST, no un ping ni una variable de entorno.
 *
 * POR QUÉ EXISTE: el bot degrada a memoria por diseño (persistence.mjs regla 1), así que una base
 * caída no lo deja mudo — lo deja AMNÉSICO, y eso no se ve desde afuera. En agosto 2026 una regla
 * de firewall bloqueó el puerto de PostgREST entre contenedores y el bot pasó CINCO DÍAS sin poder
 * guardar nada mientras `/health` decía `ok:true`. Ningún chequeo indirecto habría visto eso: hay
 * que hacer la lectura.
 *
 * Se reusa `createStore()` (el MISMO cliente que escribe en producción) a propósito: un cliente
 * aparte para el chequeo puede estar sano mientras el real falla, y entonces el health miente.
 *
 * NUNCA TIRA Y NUNCA CUELGA: `rest()` ya es tolerante por contrato y aborta a los `timeoutMs`,
 * pero igual va contra un reloj propio. `AbortSignal.timeout` es opcional en `rest()` (`: undefined`
 * si el runtime no lo tiene) y ahí el fetch no tendría tope: la carrera es lo que garantiza que
 * `/health` conteste aunque el socket quede colgado para siempre.
 *
 * @returns {Promise<{ok:boolean, latencyMs:number, error?:string}>}
 */
export async function checkDatabaseHealth(deps = {}) {
  const now = typeof deps.now === "function" ? deps.now : Date.now;
  const started = now();
  const elapsed = () => Math.max(0, now() - started);

  // NO se toma `deps.fetch`: ese inyectable es el del evento a n8n (createWebhookServer) y
  // apuntarlo a la base haría que el chequeo mida un cliente que no es el que escribe de verdad.
  const store = deps.store || createStore({ timeoutMs: DB_HEALTH_TIMEOUT_MS });
  const timeoutMs = Number(deps.timeoutMs) > 0 ? Number(deps.timeoutMs) : DB_HEALTH_TIMEOUT_MS;

  const vencido = Symbol("db_health_timeout");
  let timer;
  const reloj = new Promise((resolve) => {
    // El timer va REFERENCIADO a propósito. Con `unref()` este reloj sólo corría si algo MÁS
    // mantenía vivo el event loop: en un proceso sin otro handle en vuelo, el loop se vaciaba
    // antes de los `timeoutMs` y esta promesa NO SE RESOLVÍA NUNCA — justo lo contrario de lo
    // que promete el bloque de arriba. En producción no se veía (el servidor está escuchando,
    // así que siempre hay un handle vivo); se veía en `node --test`, donde dejaba el archivo
    // entero cancelado con "Promise resolution is still pending but the event loop has already
    // resolved" en Node 20. El tope no demora el apagado: el `finally` hace `clearTimeout`
    // siempre, dura como mucho `timeoutMs + 500`, y `main()` apaga con `process.exit`, que no
    // espera timers. La garantía "nunca cuelga" tiene que sostenerse SOLA.
    timer = setTimeout(() => resolve(vencido), timeoutMs + 500);
  });

  let rows;
  try {
    rows = await Promise.race([store.loadConversation(DB_HEALTH_PROBE_KEY), reloj]);
  } catch (error) {
    // `loadConversation` promete no tirar; esto es la red de contención por si alguna vez deja de
    // cumplirlo. Un throw acá tumbaría /health, que es lo único que no puede pasar.
    return { ok: false, latencyMs: elapsed(), error: String(error?.message || error).slice(0, 200) };
  } finally {
    clearTimeout(timer);
  }

  if (rows === vencido) {
    return { ok: false, latencyMs: elapsed(), error: `sin respuesta en ${timeoutMs + 500} ms` };
  }
  // `null` = el store apiló el motivo en warnings (sin credenciales, HTTP 4xx/5xx, red caída).
  if (rows === null) {
    const motivo = store.warnings[store.warnings.length - 1] || "lectura fallida sin motivo declarado";
    return { ok: false, latencyMs: elapsed(), error: String(motivo).slice(0, 200) };
  }
  return { ok: true, latencyMs: elapsed() };
}

/**
 * `?inboxId=N` -> el alcance con el que resuelve el camino de respuesta. Sólo dígitos: un valor
 * que no es un inbox NO se convierte en una medición por inbox disfrazada — se mide el proceso,
 * y `alcance` lo dice. (Devolver un alcance que no se midió sería el mismo falso verde que esto
 * viene a cerrar, con otra cara.)
 */
export function alcanceDeConsulta(consulta = {}) {
  const crudo = String(consulta.inboxId ?? "").trim();
  return /^[0-9]+$/.test(crudo) ? { inboxId: crudo } : {};
}

/**
 * Estado para `GET /health`. NUNCA devuelve un secreto: sólo si está o no está.
 * `knowledge` es obligatorio y no decorativo: sin ver la FUENTE y la VERSIÓN que el bot está
 * usando, "edité el JSON y no pasó nada" tarda días en descubrirse — que es exactamente el modo
 * de falla que ya nos costó caro con `sync-onia-core.mjs`.
 *
 * `ok` GLOBAL PASA A FALSE SI LA BASE NO RESPONDE. Es la decisión importante de esta función y va
 * contra la intuición, porque el bot SIGUE contestando sin base. El argumento:
 *   · Sin base no hay estado: cada mensaje reabre la conversación en `nuevo`, el prospecto vuelve a
 *     empezar el guion en cada turno y nunca llega a agendar.
 *   · Sin base no hay dedup (`bot_messages.message_key`): un reintento de Chatwoot le manda la
 *     misma respuesta DOS VECES al prospecto.
 *   · Sin base no hay lead: nada de lo que el bot atienda llega al CRM. Comercialmente, atender
 *     sin registrar es equivalente a no atender.
 *   Un bot así tiene la boca sana y la cabeza vacía. `ok` existe para que suene una alarma; si no
 *   suena para el modo de falla que ya nos costó cinco días, no sirve para nada.
 * Se verificó que ningún automatismo reinicia el contenedor por `ok:false` — `webhook-watchdog.sh`
 * mira si /health CONTESTA (código de salida de wget), no el cuerpo — así que esto alerta, no
 * apaga: durante una caída de base el bot degradado sigue en pie.
 *
 * `consulta` es el querystring de la ruta: con `inboxId` resuelve por la MISMA vía que el camino
 * de respuesta, y el `alcance` de `knowledge` declara cuál de las dos se midió.
 */
export async function getHealthStatus(config = getServerConfig(), n8nConfig = getN8nEventConfig(), deps = {}, consulta = {}) {
  const auth = getAuthHealth(config);
  const knowledge =
    deps.knowledge || (await ensureKnowledgeHealth({ ...(deps.knowledgeOptions || {}), ...alcanceDeConsulta(consulta) }));
  const checkDb = typeof deps.checkDb === "function" ? deps.checkDb : checkDatabaseHealth;
  const db = await checkDb(deps);
  return {
    ok: auth.ok && db.ok === true,
    service: "onia-chatbot-webhook",
    auth,
    // `ok:false` acá = el bot contesta pero NO GUARDA NADA (ni estado, ni dedup, ni lead).
    db,
    n8n: { enabled: n8nConfig.enabled, configurado: Boolean(n8nConfig.url && n8nConfig.secret) },
    // source: "panel" = manda la fila publicada del panel (ONIA_KNOWLEDGE_URL) ·
    // "file" = manda knowledge.json · "code" = se cayó a los valores del código.
    // Caer a "code" después de haber sido "file" es la alarma: alguien editó y el bot no lo tomó.
    knowledge,
  };
}

// ---------------------------------------------------------------------------
// Ruta
// ---------------------------------------------------------------------------

/**
 * `/webhook/chatwoot` o `/webhook/chatwoot/<secreto>` -> { match, pathSecret }.
 * El querystring se descarta: un secreto en la query se termina logueando en cualquier proxy.
 */
export function matchWebhookPath(url) {
  const path = String(url || "").split("?")[0].replace(/\/+$/, "") || "/";
  if (path === WEBHOOK_PATH) return { match: true, pathSecret: "" };
  if (path.startsWith(`${WEBHOOK_PATH}/`)) {
    return { match: true, pathSecret: decodeURIComponent(path.slice(WEBHOOK_PATH.length + 1)) };
  }
  return { match: false, pathSecret: "" };
}

// ---------------------------------------------------------------------------
// LA TRAZA — una línea por webhook, y el MOTIVO cuando el bot no contestó.
//
// POR QUÉ EXISTE. Medido el 2026-09-02: `/tmp/onia-bot-webhook.log` tenía 2,5 MB de
// "escuchando en :3020" y NI UNA línea por mensaje. Con esa ceguera, el bug de "contesta una
// vez y se calla" sobrevivió UNA SEMANA con cinco personas reales del otro lado; nadie podía
// decir POR QUÉ se callaba, así que se adivinó. Este archivo ya recibía un `log`, pero sólo lo
// llamaba en dos errores raros (socket muerto y n8n): el camino que importa no escribía nunca.
// Un log que existe y no se llama es peor que no tenerlo, porque aparenta diagnóstico.
//
// LO QUE HACE FALTA VER, y por qué estas ramas y no un dump del cuerpo: los tres silencios
// devuelven 200 con cuerpos casi iguales, así que a ojo los tres se leen como éxito.
//   · `MUDO`         el turno corrió y no produjo NADA. Es el bug de la semana.
//   · `NO_ENTREGADO` produjo respuesta y Chatwoot la rechazó. Cuatro días reales en agosto:
//                    el bot calculaba respuestas que nadie recibía, con /health en verde.
//   · `ignorado`     el parser lo descartó (saliente, nota privada, evento ajeno).
// Distinguirlas es todo el valor: mandan a mirar archivos distintos.
//
// PRIVACIDAD. Acá sí viaja el texto del prospecto, acotado a `MAX_ENTRADA`. Es deliberado y no
// contradice a `n8n-event.mjs`, que lo redacta: ese evento SALE del sistema, éste es un archivo
// local del contenedor. Sin la entrada, la línea dice que el bot se calló y no permite
// reproducirlo, que es justo lo que costó la semana.
// ---------------------------------------------------------------------------

/** Tope del texto del prospecto en la traza: alcanza para reproducir, no para volcar la charla. */
export const MAX_ENTRADA = 120;

/** Una línea de log NUNCA puede traer saltos: rompen el `grep` y el `tail -f` que la van a leer. */
function unaSolaLinea(texto, max = MAX_ENTRADA) {
  const plano = String(texto ?? "").replace(/[\r\n\t]+/g, " ").trim();
  return plano.length > max ? `${plano.slice(0, max)}…` : plano;
}

/**
 * Traza -> línea de texto. Función PURA: se testea sin servidor, sin red y sin motor.
 * @param {object} traza { conversacion, mensaje, entrada, estado, cuerpo }
 */
export function formatearTraza(traza = {}) {
  const cuerpo = traza.cuerpo || {};
  const enviados = Array.isArray(cuerpo.sent) ? cuerpo.sent : [];
  const publicados = enviados.filter((reply) => reply?.posted).length;
  const avisos = Array.isArray(cuerpo.warnings) ? cuerpo.warnings : [];

  let rama;
  let motivo;
  if (Number(traza.estado) >= 400) {
    // Auth, ruta o método. Es LA rama que hay que ver cuando "los webhooks no llegan".
    rama = "rechazado";
    motivo = cuerpo.reason;
  } else if (cuerpo.skipped) {
    rama = "ignorado";
    motivo = cuerpo.reason;
  } else if (cuerpo.deduped || cuerpo.duplicate) {
    rama = "repetido";
    motivo = cuerpo.reason || "mensaje_ya_procesado";
  } else if (cuerpo.error) {
    rama = "ERROR";
    motivo = cuerpo.reason;
  } else if (enviados.length === 0) {
    rama = "MUDO";
    // El primer aviso del motor explica el silencio mejor que cualquier texto nuestro. Si no hay,
    // manda la razón MÁS PRECISA: sin mensaje del prospecto no había nada que contestar, y eso
    // vale cualquiera sea la etapa. Recién después la etapa: `handoff_humano` es una barrera y
    // significa "no habla nunca más" — pero eso explica un silencio ante ALGUIEN QUE HABLÓ, que
    // es justo el caso que hay que poder distinguir. El genérico queda para el bug de verdad.
    motivo =
      avisos[0] ||
      (traza.eventoSinMensaje
        ? `evento sin mensaje (${unaSolaLinea(traza.eventoSinMensaje, 40)}): no hay nada que contestar`
        : cuerpo.stageAfter === "handoff_humano"
          ? "etapa handoff_humano: el bot ya no vuelve a hablar en esta conversacion"
          : "el motor no produjo respuesta");
  } else if (publicados === 0) {
    rama = "NO_ENTREGADO";
    motivo = avisos[0] || enviados[0]?.reason || "chatwoot no acepto la respuesta";
  } else {
    rama = "respondio";
  }

  const campos = [
    `[onia-webhook] ${traza.iso || new Date().toISOString()}`,
    `conv=${traza.conversacion || "?"}`,
    // POR QUE CANAL entro. Va SIEMPRE, aunque no se sepa: si apareciera solo cuando se conoce,
    // un `grep inbox=5` perderia justo las lineas que hay que mirar. Y no es cosmetico — el
    // inbox es la clave con la que el bot elige QUE documento le contesta al lead
    // (`cacheKeyOf` keyea `inbox:<id>`), asi que dos lineas identicas pueden estar cotizando
    // precios distintos. Hasta el 2026-09-13 distinguir "el bot esta mudo en WhatsApp" de "esta
    // mudo en la web" exigia ir a cruzar la base de Chatwoot a mano.
    `inbox=${traza.inbox || "?"}`,
    // `-` es "no hay mensaje" y `?` es "no sé cuál": en un evento sin mensaje el payload ES la
    // conversación, así que `traza.mensaje` trae su id y la línea afirmaba un mensaje inexistente
    // (`msg=49 conv=49`) que manda a buscar a la base algo que no está.
    `msg=${traza.eventoSinMensaje ? "-" : traza.mensaje || "?"}`,
    `estado=${traza.estado ?? "?"}`,
    `rama=${rama}`,
  ];
  if (cuerpo.stageBefore || cuerpo.stageAfter) {
    campos.push(`etapa=${cuerpo.stageBefore || "?"}->${cuerpo.stageAfter || "?"}`);
  }
  // Publicados/producidos, no un total: `0/1` es el bot mudo hacia afuera con la boca sana.
  if (enviados.length > 0 || rama === "MUDO") campos.push(`enviados=${publicados}/${enviados.length}`);
  if (motivo) campos.push(`motivo=${unaSolaLinea(motivo, 140)}`);
  // QUE HIZO el turno, aparte de QUE MANDO. Son dos preguntas distintas y hasta el 2026-09-19
  // el log solo contestaba la segunda: un turno que cambia el ESTADO sin mandar un mensaje caia
  // en `rama=MUDO` y quedaba escrito igual que uno que no hizo nada. El caso medido es el
  // desarme del traspaso humano —el unico camino que tiene el dueño para devolverle una
  // conversacion al bot, y que /inbox le vende como «Resuelta — tu asistente atiende de nuevo»—:
  // corre con `send: []` y `notes: ["takeover_desarmado"]`, asi que `grep takeover_desarmado`
  // daba 0 sobre 47.826 lineas con el desarme funcionando. Ante «marque resuelta y el bot no
  // volvio» eso deja tres causas con remedios opuestos sin forma de separarse.
  //
  // Se deriva de las notas del motor —el vocabulario con el que ya declara lo que hizo— y no de
  // una lista de notas "importantes", que fallaria abierta justo en la que se agregue mañana.
  const hizo = (Array.isArray(cuerpo.notes) ? cuerpo.notes : []).filter(Boolean);
  if (hizo.length > 0) campos.push(`hizo=${unaSolaLinea(hizo.join(","), 140)}`);
  // Un turno que SALIO BIEN puede haber salido bien de casualidad: el respaldo de la
  // transcripcion tapando un destino caido, la descarga con un reintento. Hasta el 2026-09-19
  // los avisos solo se leian cuando el bot se callaba, asi que la falla que no se nota —la mas
  // cara— no dejaba ni una linea, y un circuito degradado que no se ve se vuelve el normal.
  // Va DESPUES del motivo y solo si el motivo no los dijo ya: no se repite lo mismo dos veces.
  if (!motivo && avisos.length > 0) campos.push(`aviso=${unaSolaLinea(avisos.join(" · "), 200)}`);
  if (traza.entrada) campos.push(`entrada="${unaSolaLinea(traza.entrada)}"`);
  return campos.join(" ");
}

// ---------------------------------------------------------------------------
// EL ECO NO PUEDE TAPAR LA COLA DEL LOG — 2026-09-27
//
// Todo webhook sigue dejando rastro; lo que cambia es que el ECO de nuestra propia actividad no
// gasta una línea cada vez. Medido ese día en el log vivo: de las últimas 80 líneas, 59 decían
// que el bot no hizo nada y sólo 21 eran turnos reales, así que el último evento del embudo
// quedaba 133 líneas atrás y `tail -80 | grep demo_agendada` devolvía CERO con 83 eventos en el
// archivo. El bot escribe TRES líneas por turno y dos son el eco de su propia respuesta: la cola
// se tapa sola justo cuando alguien escribe, que es cuando hay que poder mirarla.
//
// LO QUE NO SE AGRUPA, y es la mitad importante del diseño: `MUDO` es el bug que sobrevivió una
// semana con cinco personas reales del otro lado — silenciarlo sería volver al 2026-09-02.
// Tampoco `ERROR`, `NO_ENTREGADO`, `rechazado`, `repetido` ni `respondio`. Sólo el eco previsible.
// ---------------------------------------------------------------------------

/**
 * Las clases de `ignorado` que son ECO de nuestra propia actividad, no señal.
 * Se compara el prefijo antes de `:` (la CLASE), no la razón entera: el sufijo es un detalle
 * variable (`status_no_desarma:open` / `:pending`) y si entrara en la comparación, un estado
 * nuevo de Chatwoot volvería a tapar la cola sin que nadie lo tocara. El sufijo se conserva en
 * el resumen, que es donde sirve.
 */
export const CLASES_DE_ECO = new Set([
  "mensaje_no_entrante", // el bot viendo salir su propio mensaje (348 en 4.000 líneas)
  "update_sin_botones", // Chatwoot avisando un update que no trae nada que atender (350)
  "status_no_desarma", // un cambio de estado que no es el desarme del traspaso humano (132)
]);

/** Cada cuántos ecos sale UNA línea de resumen. 200 ≈ dos por hora en el tráfico medido. */
export const ECO_CADA = 200;

/** La clase de eco de una traza, o `null` si la línea es señal y hay que escribirla. */
function claseDeEco(traza = {}) {
  const cuerpo = traza.cuerpo || {};
  // Sólo la rama `ignorado`: se pregunta por lo MISMO que `formatearTraza` para decidir la rama,
  // no por el nombre de la rama ya formateada (parsear la línea de vuelta las desacoplaría).
  if (!cuerpo.skipped || Number(traza.estado) >= 400) return null;
  const razon = String(cuerpo.reason || "");
  const clase = razon.split(":")[0];
  // Falla CERRADO: una razón de `ignorado` que nadie previó NO es eco y se escribe entera. Una
  // lista de inclusión que fallara abierta perdería en silencio justo la razón que se agregue
  // mañana, que es la única que vale mirar.
  return CLASES_DE_ECO.has(clase) ? razon : null;
}

/**
 * Filtro con estado por proceso: traza -> línea a escribir, o `null` para no escribir nada.
 * Devuelve la línea de resumen recién al llegar al tope, con el conteo por razón COMPLETA: si el
 * eco cambia de forma o de volumen, se ve; si no, no gasta la cola.
 */
export function crearFiltroDeEco({ cada = ECO_CADA } = {}) {
  const porRazon = new Map();
  let acumulados = 0;
  return function decidirLinea(traza = {}) {
    const razon = claseDeEco(traza);
    if (!razon) return formatearTraza(traza);
    porRazon.set(razon, (porRazon.get(razon) || 0) + 1);
    acumulados += 1;
    if (acumulados < cada) return null;
    const detalle = [...porRazon.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([r, n]) => `${r}=${n}`)
      .join(" ");
    const total = acumulados;
    porRazon.clear();
    acumulados = 0;
    return `[onia-webhook] ${traza.iso || new Date().toISOString()} rama=eco total=${total} ${detalle}`;
  };
}

/**
 * Datos mínimos para la traza cuando `parseChatwootWebhook` los descartó.
 * Un `skip` devuelve `{skip, reason}` SIN `meta`, y una traza sin conversación no sirve para
 * nada: hay que poder decir CUÁL charla se ignoró, no sólo que se ignoró alguna.
 */
function datosDelPayload(payload) {
  if (!payload || typeof payload !== "object") return {};
  const conversacion = payload.conversation?.id ?? payload.conversation?.display_id ?? payload.display_id;
  return {
    conversacion: conversacion == null ? undefined : String(conversacion),
    mensaje: payload.id == null ? undefined : String(payload.id),
    entrada: typeof payload.content === "string" ? payload.content : undefined,
    // El canal se saca del payload CRUDO y con la misma funcion que usa el adapter: un `skip`
    // no pasa por el parser, y la rama `ignorado` —la mas frecuente del log— es justo la que
    // no puede deducir su canal sola.
    inbox: inboxDelPayload(payload) ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// El manejador — PURO respecto del socket (recibe strings, devuelve un objeto).
// Así se testea el pipeline entero sin levantar un servidor ni abrir un puerto.
// ---------------------------------------------------------------------------

/**
 * @param {object} request { rawBody, headers, method, url }
 * @param {object} [deps]  { config, runChatwootTurn, shouldProcessMessage, nowMs, nowIso, ... }
 * @returns {Promise<{status:number, body:object, n8nEvent?:object, traza:object}>}
 *          `n8nEvent` presente = el llamador debe dispararlo DESPUÉS de responder.
 *          `traza` SIEMPRE presente: es lo que el servidor loguea.
 *
 * La traza se arma acá afuera, envolviendo al pipeline, y no en cada `return` de adentro. Es a
 * propósito: hay NUEVE salidas y la propiedad que importa —"todo webhook deja una línea"— se
 * rompe sola en cuanto alguien agregue la décima y se olvide. Envolviendo, no hay forma de
 * salir sin traza.
 */
export async function handleChatwootWebhook(request = {}, deps = {}) {
  const datos = {};
  const out = await procesarWebhook(request, deps, datos);
  return {
    ...out,
    traza: { ...datos, estado: out.status, cuerpo: out.body, iso: deps.nowIso },
  };
}

async function procesarWebhook(request, deps, datos) {
  const config = deps.config || getServerConfig();
  const method = String(request.method || "POST").toUpperCase();

  if (method !== "POST") {
    return { status: 405, body: { ok: false, reason: "metodo_no_permitido" } };
  }

  const route = matchWebhookPath(request.url);
  if (!route.match) {
    return { status: 404, body: { ok: false, reason: "ruta_desconocida" } };
  }

  const rawBody = String(request.rawBody ?? "");
  if (rawBody.length > config.maxBodyBytes) {
    return { status: 413, body: { ok: false, reason: "payload_demasiado_grande" } };
  }

  // 3. AUTENTICAR antes de parsear: no se gasta ni un JSON.parse en un payload no autenticado.
  const auth = authenticateChatwootRequest(
    { rawBody, headers: request.headers, pathSecret: route.pathSecret },
    config,
    deps.nowMs ?? Date.now(),
  );
  if (!auth.ok) {
    return { status: auth.status, body: { ok: false, reason: auth.reason } };
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    // 400: un JSON roto no es un reintento que valga la pena; que Chatwoot lo marque como fallo.
    return { status: 400, body: { ok: false, reason: "json_invalido" } };
  }

  // Ya hay JSON: la traza puede nombrar la conversación aunque el parseo de abajo lo descarte.
  Object.assign(datos, datosDelPayload(payload));

  // 4. Parseo del canal. Saliente / nota privada / evento ajeno se cortan acá: es LA regla de oro
  // (si no, la respuesta del bot dispara su propio webhook y se contesta a sí mismo en loop).
  const parsed = parseChatwootWebhook(payload);
  // El parseo sabe MÁS que el payload crudo (resuelve el texto real de un audio, de un botón o
  // de una conversación recién creada): pisa lo anterior, pero sólo con lo que trae.
  if (parsed.meta?.conversationId) datos.conversacion = String(parsed.meta.conversationId);
  if (parsed.meta?.messageId) datos.mensaje = String(parsed.meta.messageId);
  if (parsed.turn?.text) datos.entrada = parsed.turn.text;
  // El canal que el motor VA A USAR para elegir el documento es el del turno, no el que se
  // adivino del payload crudo: si alguna vez difieren, la linea tiene que mostrar el que decide.
  if (parsed.turn?.inbox_id) datos.inbox = String(parsed.turn.inbox_id);
  // Un turno que entra SIN mensaje del prospecto no tiene nada que contestar: su silencio es
  // correcto. Hoy es sólo `conversation_resolved`, que nada más desarma el takeover. Se anota acá
  // —donde todavía se ve el evento— porque abajo la traza no lo puede deducir, y sin esto su línea
  // sale IDÉNTICA a la del bug que este log existe para cazar ("una persona escribió y el bot se
  // calló"): medido el 2026-09-12, 9 de las últimas 24 `rama=MUDO` eran esto.
  // `messageId` vacío es la marca estructural, no una lista de eventos: las tres ramas que traen
  // mensaje lo EXIGEN (sin él, el parser devuelve el skip `sin_message_id`), así que una persona
  // no puede caer acá — y un evento sin mensaje que se agregue mañana queda nombrado solo.
  if (!parsed.skip && !parsed.meta?.messageId) {
    datos.eventoSinMensaje = String(payload?.event || "evento_desconocido");
  }
  if (parsed.skip) {
    // Ojo: NO se consume el dedup en un skip. Marcar como "visto" un mensaje que nunca se
    // procesó haría que una reentrega legítima se descarte.
    return { status: 200, body: { ok: true, skipped: true, reason: parsed.reason } };
  }

  // 5. Dedup. `message_key` = `chatwoot:<conversationId>:<messageId>`, LA MISMA clave que usa el
  // dedup durable de base (`bot_messages.message_key`). Éste es el filtro barato de adelante.
  const dedupKey = parsed.turn?.message_key;
  const dedupFn = typeof deps.shouldProcessMessage === "function" ? deps.shouldProcessMessage : shouldProcessMessage;
  if (!dedupFn(dedupKey, deps.nowMs ?? Date.now())) {
    return {
      status: 200,
      body: { ok: true, skipped: false, deduped: true, duplicate: true, sent: [], reason: "mensaje_ya_procesado" },
    };
  }

  // 5b. EL CONTADOR DE LA CUOTA. La plataforma cuenta las conversaciones del add-on en su propio
  // `POST /api/webhooks/chatwoot`, pero ese handler exige el header `X-Chatwoot-Secret` y
  // Chatwoot no manda headers personalizados: por eso el aviso sale del motor, que sí puede.
  // Va DESPUÉS del dedup a propósito (un reintento de Chatwoot no tiene que volver a contar) y
  // viaja en el `outcome` para que el servidor lo dispare recién con la respuesta ya escrita.
  // `rawBody` TAL CUAL: las reglas de conteo viven en la plataforma y en un solo lado.
  const usoPlataforma = esEntranteReal(payload) ? rawBody : null;

  // 6. El turno. Fail-open: cualquier excepción inesperada tiene que terminar en 200, no en 500.
  const runFn = typeof deps.runChatwootTurn === "function" ? deps.runChatwootTurn : runChatwootTurn;
  let result;
  try {
    // `config` se SACA a proposito antes de bajar al motor. Arriba (createWebhookServer) el
    // servidor se inyecta a si mismo su config con `{ ...deps, config }`, pero esa `config` es la
    // del TRANSPORTE (webhookSecret, pathSecret, maxBodyBytes). El motor lee `deps.config`
    // esperando la config del BOT (qualification, slots, script): si le llega la del transporte,
    // `config.qualification` es undefined y el turno muere con "reading 'fields'" — o sea, el bot
    // no le contesta a NADIE. Sacandola, run-turn.mjs cae a `resolveConfig()`, que es justo lo que
    // tiene que pasar en produccion. El resto de los inyectables (client, runTurn, fetch) siguen.
    const { config: _configDelTransporte, ...depsDelTurno } = deps;
    result = await runFn(payload, depsDelTurno);
  } catch (error) {
    // Se suelta la clave: el turno murió ANTES de mandar nada, así que un reintento de Chatwoot
    // (o que el prospecto reescriba) tiene que poder procesarse. Si se dejara reclamada, el
    // mensaje quedaría descartado 10 minutos sin que nadie le haya contestado nunca.
    const releaseFn = typeof deps.releaseMessage === "function" ? deps.releaseMessage : releaseMessage;
    releaseFn(dedupKey);
    return {
      status: 200,
      // El turno murió, pero el mensaje entró: la conversación se cuenta igual.
      usoPlataforma,
      body: {
        ok: false,
        skipped: false,
        duplicate: false,
        sent: [],
        error: "error_interno",
        reason: String(error?.message || error).slice(0, 300),
      },
    };
  }

  // 7/8. La respuesta se devuelve YA; el evento de n8n viaja aparte para que el llamador lo
  // dispare después de escribirla.
  const n8nEvent = buildBotTurnEvent({
    parsed,
    result,
    rawText: parsed.turn?.text,
    nowIso: deps.nowIso,
  });

  // El aviso a Sergio viaja SEPARADO del evento de n8n a propósito. Hasta hoy era un campo
  // (`notifyCount`) adentro de ese evento, así que apagar n8n —que es analítica— apagaba también
  // lo único del evento que NO es analítica: que hay una persona esperando que le contesten.
  // Dos cosas distintas no pueden compartir un interruptor.
  const avisoTelegram = construirAviso({
    notify: result?.notify,
    conversationId: result?.conversationId,
    stageAfter: result?.stageAfter,
    esNuestra: result?.esNuestra,
    // POR DONDE entro y DE QUIEN es. Salen del turno, que es donde el adapter los dejó
    // justamente para esto: el bot los usa para PROMETERLE al prospecto por qué vía le escribe
    // un humano, y hasta hoy no viajaban al aviso que le pide a ese humano que cumpla.
    canal: parsed?.turn?.channel_type,
    inbox: parsed?.turn?.inbox_id,
  });

  return { status: 200, body: result, n8nEvent, avisoTelegram, usoPlataforma };
}

// ---------------------------------------------------------------------------
// Servidor HTTP
// ---------------------------------------------------------------------------

function readBody(req, maxBytes) {
  return new Promise((resolve) => {
    let data = "";
    let bytes = 0;
    let aborted = false;

    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      if (aborted) return;
      bytes += Buffer.byteLength(chunk, "utf8");
      // Corte duro: un body gigante no puede comerse la RAM de un VPS que ya está en swap.
      if (bytes > maxBytes) {
        aborted = true;
        resolve({ tooLarge: true, body: "" });
        // Cortar el socket. Sin esto seguimos recibiendo (y descartando) todo lo que el cliente
        // quiera mandar: el corte de RAM protege el buffer, no el ancho de banda ni el socket.
        req.destroy();
        return;
      }
      data += chunk;
    });
    req.on("end", () => {
      if (!aborted) resolve({ tooLarge: false, body: data });
    });
    req.on("error", () => {
      if (!aborted) resolve({ tooLarge: false, body: data });
    });
  });
}

function writeJson(res, status, payload) {
  // El stringify va protegido aunque el call site tenga su propio try: `payload` es lo que
  // devuelve runChatwootTurn, que no se controla desde este archivo. Una referencia circular o
  // un BigInt tiraría de forma sincrona dentro de un handler `async` -> unhandled rejection ->
  // proceso caido -> el bot queda mudo para TODOS hasta reinicio manual. Es peor que el
  // problema que este archivo existe para evitar.
  let body;
  try {
    body = JSON.stringify(payload);
  } catch (error) {
    status = 200; // 200 a proposito: un 500 hace que Chatwoot reintente y duplique la respuesta.
    body = JSON.stringify({
      ok: false,
      error: "serializacion_fallida",
      reason: String(error?.message || error).slice(0, 200),
    });
  }
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
  });
  res.end(body);
}

/**
 * Crea el servidor. No llama a `listen()`: eso lo hace `main()`, así un test puede crearlo sin
 * abrir un puerto.
 * @param {object} [deps] inyectables: { config, n8nConfig, handle, fireEvent, log, fetch }
 */
export function createWebhookServer(deps = {}) {
  const config = deps.config || getServerConfig();
  const n8nConfig = deps.n8nConfig || getN8nEventConfig();
  const avisoConfig = deps.avisoConfig || getAvisoTelegramConfig();
  const usoConfig = deps.usoConfig || getUsoConfig();
  const handle = typeof deps.handle === "function" ? deps.handle : handleChatwootWebhook;
  const fireEvent = typeof deps.fireEvent === "function" ? deps.fireEvent : fireN8nBotTurnEvent;
  const log = typeof deps.log === "function" ? deps.log : (line) => process.stdout.write(`${line}\n`);
  // UNO por servidor, no por turno: el agrupador necesita memoria entre webhooks. El proceso es
  // de larga vida (se midieron 6 h 52 de `etime`), así que un `Map` de módulo alcanza y no hay
  // nada que expirar — al reiniciar se pierde un resumen parcial, que es el peor caso aceptable.
  const decidirLinea = typeof deps.decidirLinea === "function" ? deps.decidirLinea : crearFiltroDeEco();

  return createServer(async (req, res) => {
    // Defensa en profundidad: si el cliente corta a mitad de la respuesta, un evento `error`
    // sin listener escala a excepcion no capturada y mata el proceso. Misma familia de riesgo
    // que el stringify de writeJson.
    res.on("error", () => {});
    req.on("error", () => {});

    const url = String(req.url || "/");

    if (req.method === "GET" && url.split("?")[0].replace(/\/+$/, "") === "/health") {
      // El `await` es acotado por diseño (ver checkDatabaseHealth): /health contesta sí o sí.
      // Va con su propio try porque este handler es `async`: un throw acá sería un unhandled
      // rejection, y el proceso caído deja al bot mudo para TODOS.
      let estado;
      try {
        // La query SÍ se lee acá (al revés que en /webhook/chatwoot, donde se descarta porque un
        // secreto en la query termina logueado): `inboxId` no es un secreto, y sin él /health
        // contesta sobre un documento distinto del que recibe el lead de ese inbox.
        const consulta = Object.fromEntries(new URL(url, "http://interno").searchParams);
        estado = await getHealthStatus(config, n8nConfig, deps, consulta);
      } catch (error) {
        estado = { ok: false, service: "onia-chatbot-webhook", error: String(error?.message || error).slice(0, 200) };
      }
      writeJson(res, 200, estado);
      return;
    }

    if (req.method === "POST" && url.split("?")[0].replace(/\/+$/, "") === "/editor-sugerir") {
      // Editor conversacional (v6): la IA propone un doc, validateKnowledge manda,
      // NADA se persiste aca — la plataforma muestra el diff y el dueño publica.
      let out;
      try {
        const { tooLarge, body } = await readBody(req, config.maxBodyBytes);
        out = tooLarge
          ? { status: 413, body: { ok: false, error: "payload_demasiado_grande" } }
          : await handleEditorRequest({ rawBody: body, headers: req.headers });
      } catch (error) {
        out = { status: 500, body: { ok: false, error: String(error?.message || error).slice(0, 200) } };
      }
      writeJson(res, out.status, out.body);
      return;
    }

    if (req.method === "POST" && url.split("?")[0].replace(/\/+$/, "") === "/preview") {
      // Probador del editor de conocimiento: valida un BORRADOR y corre un turno
      // real del motor contra el. Nunca toca la base ni conversaciones vivas.
      let out;
      try {
        const { tooLarge, body } = await readBody(req, config.maxBodyBytes);
        out = tooLarge
          ? { status: 413, body: { ok: false, error: "payload_demasiado_grande" } }
          : await handlePreviewRequest({ rawBody: body, headers: req.headers });
      } catch (error) {
        out = { status: 500, body: { ok: false, error: String(error?.message || error).slice(0, 200) } };
      }
      writeJson(res, out.status, out.body);
      return;
    }

    // Cobro por QR del BCP: /bcp/cobrar lo dispara un humano; /bcp/callback lo
    // llama el banco. Ambos usan el cliente Chatwoot real del server (deps.client).
    const rutaBcp = req.method === "POST" ? url.split("?")[0].replace(/\/+$/, "") : null;
    if (rutaBcp === "/bcp/cobrar" || rutaBcp === "/bcp/callback") {
      let out;
      try {
        const { tooLarge, body } = await readBody(req, config.maxBodyBytes);
        if (tooLarge) {
          out = { status: 413, body: { ok: false, error: "payload_demasiado_grande" } };
        } else {
          const handler = rutaBcp === "/bcp/cobrar" ? handleBcpCobrar : handleBcpCallback;
          out = await handler({ rawBody: body, headers: req.headers }, { client: deps.client || createChatwootClient() });
        }
      } catch (error) {
        out = { status: 500, body: { ok: false, error: String(error?.message || error).slice(0, 200) } };
      }
      writeJson(res, out.status, out.body);
      return;
    }

    let outcome;
    try {
      const { tooLarge, body } = await readBody(req, config.maxBodyBytes);
      outcome = tooLarge
        ? { status: 413, body: { ok: false, reason: "payload_demasiado_grande" } }
        : await handle({ rawBody: body, headers: req.headers, method: req.method, url }, { ...deps, config });
    } catch (error) {
      // Última red de contención: el proceso NO se cae y Chatwoot no recibe un 500 que lo haga
      // reintregar (respuesta duplicada al prospecto).
      outcome = {
        status: 200,
        body: { ok: false, error: "error_interno", reason: String(error?.message || error).slice(0, 300) },
      };
    }

    // LA LÍNEA. Va ANTES de escribir la respuesta a propósito: si el socket ya está muerto, el
    // `writeJson` de abajo falla y sin esto el webhook no dejaría rastro justo en el caso raro.
    // Envuelto porque un log que tira mataría el turno — al revés de para qué existe.
    if (outcome.traza) {
      try {
        // `null` = es eco y quedó contado para el próximo resumen. Cualquier otra rama escribe.
        const linea = decidirLinea(outcome.traza);
        if (linea) log(linea);
      } catch {
        /* nunca romper el turno por no poder loguearlo */
      }
    }

    // Escribir también puede fallar (el cliente cortó la conexión y el socket ya está muerto).
    // Esto va FUERA del try de arriba a propósito, así que necesita el suyo: en un handler
    // `async` una excepción acá es un unhandled rejection, y eso mata el proceso de Node — o sea
    // el bot entero — por un socket que se cerró antes de tiempo.
    try {
      writeJson(res, outcome.status, outcome.body);
    } catch (error) {
      log(`[webhook] no se pudo escribir la respuesta: ${String(error?.message || error)}`);
    }

    // FIRE-AND-FORGET, ya con la respuesta escrita. Si n8n está caído, colgado o mal
    // configurado, nadie se entera acá: el prospecto ya fue atendido.
    // El turno YA se completó, así que esto corre aunque la escritura de arriba haya fallado.
    if (outcome.n8nEvent) {
      try {
        fireEvent(outcome.n8nEvent, n8nConfig, deps, (result) => {
          if (result && result.ok === false) log(`[n8n] ${result.reason}`);
        });
      } catch (error) {
        log(`[n8n] no se pudo disparar el evento: ${String(error?.message || error)}`);
      }
    }

    // El aviso a Sergio. Fire-and-forget igual que el de arriba, pero con su propio interruptor:
    // esto NO es analítica, es alguien esperando. Deja línea siempre —enviado o no— porque el
    // modo de falla de este carril es justamente el aviso que no sale y nadie lo nota.
    if (outcome.avisoTelegram) {
      try {
        dispararAvisoTelegram(outcome.avisoTelegram, avisoConfig, deps, (result) => {
          const motivos = outcome.avisoTelegram.motivos.join(",");
          // `conv=` va SIEMPRE, y sobre todo cuando el aviso no salió: esa línea es lo único que
          // queda de una persona a la que el bot le prometió que Sergio le escribe. Sin el número
          // no se puede ir a buscarla después.
          const conv = outcome.avisoTelegram.conversationId ?? "?";
          log(`[aviso] ${result?.status} conv=${conv} (${motivos}): ${result?.reason}`);
        });
      } catch (error) {
        log(`[aviso] no se pudo disparar: ${String(error?.message || error)}`);
      }
    }

    // El contador de la cuota. Fire-and-forget igual que los dos de arriba y con su propio fetch
    // (`deps.fetchUso`): compartir el de n8n haría que apuntar uno mueva al otro. Sólo se loguea
    // cuando NO se contó — un `sent` por mensaje sería ruido; el silencio por falta de
    // configuración se dice UNA vez (`repetido`), porque lo que no se cuenta no se factura.
    if (outcome.usoPlataforma) {
      try {
        dispararUsoPlataforma(outcome.usoPlataforma, usoConfig, { fetch: deps.fetchUso }, (result) => {
          if (result?.ok === false && result?.repetido !== true) log(`[uso] ${result.reason}`);
        });
      } catch (error) {
        log(`[uso] no se pudo disparar: ${String(error?.message || error)}`);
      }
    }
  });
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

export function main(deps = {}) {
  const config = deps.config || getServerConfig();
  const server = createWebhookServer({ ...deps, config });
  // Sólo la parte sincrónica: el aviso del arranque es sobre el secreto, y el estado de la base se
  // consulta en cada /health. Arrancar no puede depender de una lectura de red.
  const auth = getAuthHealth(config);

  // Timeouts explicitos en vez del default de Node: un cliente que abre el socket y no manda
  // nada no puede quedarse colgado ocupando un handle.
  server.requestTimeout = 30_000;
  server.headersTimeout = 20_000;

  // Red final: NADA puede tumbar este proceso. Si el bot se cae, queda mudo para todos los
  // prospectos hasta que alguien lo reinicie a mano — y nadie se entera hasta que un cliente
  // se queja. Preferimos un proceso vivo con un error logueado.
  process.on("uncaughtException", (error) => {
    process.stdout.write(`[onia-webhook] excepcion no capturada (proceso sigue vivo): ${String(error?.stack || error)}\n`);
  });
  process.on("unhandledRejection", (reason) => {
    process.stdout.write(`[onia-webhook] promesa rechazada sin catch (proceso sigue vivo): ${String(reason)}\n`);
  });

  server.listen(config.port, () => {
    // Timestamp pedido por DOS handoffs (23-ago y 28-ago): el burst de 56 arranques
    // fue irreconstruible sin la cadencia real. Un arranque sin hora no diagnostica.
    process.stdout.write(`[onia-webhook] ${new Date().toISOString()} escuchando en :${config.port}${WEBHOOK_PATH}\n`);
    if (!auth.ok) process.stdout.write(`[onia-webhook] ${auth.aviso}\n`);
  });

  const shutdown = () => {
    server.close(() => process.exit(0));
    // Si algún socket queda colgado, no se espera para siempre.
    setTimeout(() => process.exit(0), 5000).unref();
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  return server;
}

const invokedDirectly = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) main();
