// ONIA — Chatbot propio (el que atiende "DEMO"): ADAPTADOR DE CANAL para CHATWOOT.
//
// Traduce el webhook de Chatwoot (`message_created` · `conversation_created`) al contrato que ya
// consume run-turn.mjs, corre el turno con el MOTOR SIN CAMBIOS (bot-engine.mjs) y postea la
// respuesta de vuelta a la conversación vía la API de Chatwoot. Mismo patrón que el resto de
// hermes-content/deploy/vps-ops/bot/*.mjs: TOLERANTE POR CONTRATO, nunca tira, exit 0 siempre.
//
// FORMAS REALES DEL WEBHOOK (capturadas en vivo contra la cuenta 2 de Chatwoot el 2026-07-26,
// con webhook.site como receptor de prueba — no son una suposición de la doc oficial):
//   message_created:      { event, id (=id del MENSAJE), content, message_type: "incoming"|
//                           "outgoing"|..., private, created_at (ISO), sender, inbox, account,
//                           conversation: { id (=id de la CONVERSACION), contact_inbox, ... } }
//   conversation_created: el payload ES la conversación: { event, id (=id de la CONVERSACION),
//                           messages: [...] (vacio si se creo sin mensaje inicial), ... }. Los
//                           mensajes anidados en `conversation.messages[]` (de CUALQUIER evento)
//                           usan `message_type` NUMERICO (0=incoming, 1=outgoing) y `created_at`
//                           en epoch-segundos, a diferencia del nivel superior (string + ISO).
//
// REGLA DE ORO (la mas facil de romper, spec del pedido): ignorar TODO mensaje `outgoing` o
// `private`. Si no, la respuesta que el bot postea dispara su PROPIO webhook de vuelta
// (Chatwoot manda message_created para TODO mensaje, entrante y saliente) y el bot termina
// "contestandose a si mismo" en loop infinito. Probado explicitamente mas abajo.
//
// IDEMPOTENCIA: no hace falta una tabla nueva. El `message_key` que se arma aca
// (`chatwoot:<conversationId>:<messageId>`) es EL MISMO dedup que ya usa run-turn.mjs vía
// `store.claimInbound` (bot_messages.message_key unique). Si Chatwoot reintenta el webhook,
// runTurn() devuelve `duplicate:true` y `send:[]`: este adaptador simplemente no postea nada.
//
// ENTRADA (stdin, invocado igual que run-turn.mjs vía SSH/docker exec desde n8n): el JSON crudo
// del webhook de Chatwoot, una linea.
// SALIDA (stdout): una linea JSON { ok, skipped, reason?, duplicate, sent: [{text, posted}], warnings }
//
// Config (NO son secretos — son la URL pública y el id de cuenta de Chatwoot, iguales para
// cualquiera que abra la instancia):
//   CHATWOOT_BASE_URL     default "https://onia-chatbot-chatwoot.hqdqgh.easypanel.host"
//   CHATWOOT_ACCOUNT_ID   default "2"
// Secreto (NUNCA hardcodear, NUNCA loguear el valor):
//   CHATWOOT_API_TOKEN    token de acceso de la API (de la cuenta 2, user_id=2). Se lee del
//                         entorno en runtime; en n8n va como credencial "Header Auth"/env del
//                         contenedor onia-center, igual que LITELLM_KEY (ver N8N_WORKFLOW.md).
//
// Spec: hermes-content/docs/ONIA_CHATBOT_PROPIO_SPEC_20260725.md
// Workflow n8n: hermes-content/deploy/vps-ops/bot/N8N_WORKFLOW.md (Chatwoot)

import { pathToFileURL } from "node:url";

import { runTurn as realRunTurn } from "./run-turn.mjs";
import { pickAudioAttachment, transcribeChatwootAudio } from "./audio-transcribe.mjs";

const ENV_BASE_URL = () => process.env.CHATWOOT_BASE_URL || "https://onia-chatbot-chatwoot.hqdqgh.easypanel.host";
const ENV_ACCOUNT_ID = () => process.env.CHATWOOT_ACCOUNT_ID || "2";
const ENV_TOKEN = () => process.env.CHATWOOT_API_TOKEN || process.env.CHATWOOT_TOKEN || "";

/**
 * El id del agente de Chatwoot con el que POSTEA el bot. Existe para una sola cosa: distinguir
 * "esto lo escribio el bot" de "esto lo escribio Sergio".
 *
 * Antes era imposible: el bot posteaba con la MISMA cuenta que Sergio, asi que cuando el tomaba una
 * conversacion el bot no se enteraba y le seguia hablando encima al prospecto en el mensaje
 * siguiente — el peor papelon posible delante de un cliente.
 *
 * VACIO = comportamiento de antes (los salientes se ignoran y ya). Es el default a proposito: si
 * esta variable falta o se escribe mal, el bot NO se auto-silencia. Equivocarse para el otro lado
 * —callarse con todo el mundo— es peor que el problema que esto arregla.
 */
const ENV_BOT_AGENT_ID = () => String(process.env.CHATWOOT_BOT_AGENT_ID || "").trim();

// ---------------------------------------------------------------------------
// Helpers puros
// ---------------------------------------------------------------------------

/** message_type llega como string arriba ("incoming"/"outgoing") pero numerico adentro de conversation.messages[] (0/1). */
export function normalizeMessageType(value) {
  if (value === "incoming" || value === 0 || value === "0") return "incoming";
  if (value === "outgoing" || value === 1 || value === "1") return "outgoing";
  return value === undefined || value === null ? "" : String(value);
}

/** created_at llega como ISO arriba, pero como epoch-segundos adentro de conversation.messages[]. */
export function toIsoFlexible(value) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "number") return new Date(value * 1000).toISOString();
  if (typeof value === "string" && /^\d+$/.test(value)) return new Date(Number(value) * 1000).toISOString();
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? new Date(ms).toISOString() : null;
}

/** El nombre para mostrar: el contacto, o su identifier si no puso nombre. Nunca se inventa. */
function displayNameOf(sender) {
  if (!sender || typeof sender !== "object") return null;
  return sender.name || sender.identifier || null;
}

/**
 * EL TELÉFONO DEL PROSPECTO, que es con lo que un humano puede llamarlo.
 *
 * Hasta hoy el CRM guardaba `contact_ref` como contacto público, o sea el id de la conversación de
 * Chatwoot: en el panel el contacto decía "2847" y desde ahí no se podía llamar a nadie.
 * `contact_ref` NO se toca (es la identidad de la conversación, `conversationKey`); el teléfono
 * viaja aparte.
 *
 * Verificado contra el fuente de Chatwoot 4.12.1 en el VPS: `phone_number` está en
 * `Contact#webhook_data` (el `sender` de `message_created`) Y en `Contact#push_event_data` (el
 * `sender` de los mensajes anidados en `conversation_created`), así que el mismo lector sirve para
 * los dos eventos. Viene lleno en WhatsApp (contacto real: `+59171654992`) y vacío en el widget
 * web y en el inbox de API, donde el contacto simplemente no dio teléfono. Vacío => null, y el
 * lead queda exactamente como está hoy: NO se inventa un contacto.
 */
function phoneOf(sender) {
  if (!sender || typeof sender !== "object") return null;
  return String(sender.phone_number ?? "").trim() || null;
}

/**
 * ATRIBUCIÓN: qué pieza / campaña trajo al prospecto.
 *
 * Qué expone Chatwoot DE VERDAD (leído del fuente 4.12.1 en el VPS, no de la doc):
 *   · `conversation.custom_attributes` — libre. Lo llena quien crea la conversación (inbox de API)
 *     o el widget con `setCustomAttributes`. Si trae `piece_key`/`source_campaign`, mandan: es un
 *     dato puesto a mano, no adivinado.
 *   · `conversation.additional_attributes.referer` — la URL de la landing, la escribe el widget web
 *     (`app/controllers/api/v1/widget/base_controller.rb`). De ahí sale `?src=`, que es LA
 *     convención de atribución de Onia (la landing ya la captura: `api/onia-center/leads/intake`)
 *     y que la migración de `bot_conversations` documenta como "pieza que lo trajo".
 *   · `utm_content` / `utm_campaign` de esa misma URL, para el tráfico que llega desde pauta.
 *
 * LO QUE CHATWOOT NO EXPONE (y por eso NO se inventa acá): el referral de un anuncio
 * click-to-WhatsApp. Meta manda `messages[].referral` (`source_id`, `source_url`, `ctwa_clid`) en
 * el webhook de la WABA, pero Chatwoot 4.12.1 lo DESCARTA — no hay una sola aparición de
 * "referral" en su código. Para un lead de WhatsApp no hay atribución posible desde acá: hay que
 * capturarla antes, en el webhook de Meta, o parchear el canal de Chatwoot.
 *
 * Todo ausente => null, que es exactamente el comportamiento de hoy.
 */
export function attributionFrom(conversation) {
  const conv = conversation && typeof conversation === "object" ? conversation : {};
  const custom = conv.custom_attributes && typeof conv.custom_attributes === "object" ? conv.custom_attributes : {};
  const extra = conv.additional_attributes && typeof conv.additional_attributes === "object" ? conv.additional_attributes : {};

  let query = null;
  try {
    // `referer` puede ser "", null o basura: URL() tira y el catch lo deja en null.
    query = new URL(String(extra.referer || "")).searchParams;
  } catch {
    query = null;
  }
  const param = (name) => String(query?.get(name) ?? "").trim() || null;
  const attr = (name) => String(custom[name] ?? "").trim() || null;

  return {
    pieceKey: attr("piece_key") || param("src") || param("utm_content"),
    sourceCampaign: attr("source_campaign") || param("utm_campaign"),
  };
}

/**
 * kind: text | voice | attachment — solo cuando NO hay texto y SI hay adjuntos (igual que Telegram).
 * El audio se busca en TODA la lista y no solo en el primero: un mensaje con una foto y una nota
 * de voz sigue siendo, para el guion, una nota de voz que hay que escuchar.
 */
function kindOf(text, attachments) {
  if (text) return "text";
  const list = Array.isArray(attachments) ? attachments : [];
  if (list.length === 0) return "text";
  return pickAudioAttachment(list) ? "voice" : "attachment";
}

function buildTurn({ conversationId, messageId, content, attachments, sender, createdAtIso, conversation }) {
  const text = String(content || "").trim();
  const atribucion = attributionFrom(conversation);
  return {
    skip: false,
    turn: {
      channel: "chatwoot",
      // OJO: `contact_ref` es la IDENTIDAD de la conversación (de acá sale `conversationKey`).
      // Cambiarlo rompe todas las conversaciones vivas. El teléfono va aparte, en `public_contact`.
      contact_ref: String(conversationId),
      public_contact: phoneOf(sender),
      display_name: displayNameOf(sender),
      kind: kindOf(text, attachments),
      text,
      message_key: `chatwoot:${conversationId}:${messageId}`,
      received_at: createdAtIso || new Date().toISOString(),
      piece_key: atribucion.pieceKey,
      source_campaign: atribucion.sourceCampaign,
    },
    // Los adjuntos viajan en `meta` y NO en `turn`: el turno es lo que ve el motor (que es puro y
    // no baja archivos), y los adjuntos son materia prima del transporte para transcribir el audio.
    meta: {
      conversationId: String(conversationId),
      messageId: String(messageId),
      attachments: Array.isArray(attachments) ? attachments : [],
    },
  };
}

/**
 * ¿Este mensaje SALIENTE lo escribio un humano? Entonces tomo la conversacion y el bot se calla.
 *
 * Las cuatro condiciones son todas necesarias, y cada una evita un modo de falla distinto:
 *   1. hay `CHATWOOT_BOT_AGENT_ID` configurado — sin eso no se puede distinguir nada (ver arriba);
 *   2. el remitente es un USUARIO de Chatwoot (`sender.type === "user"`), no un contacto ni un bot
 *      de plataforma: un `sender` raro no puede silenciar al bot;
 *   3. tiene id — sin id no se sabe quien fue, y ante la duda NO se silencia;
 *   4. ese id NO es el del bot. Este es EL candado: sin el, la primera respuesta del propio bot lo
 *      dejaria mudo para siempre en esa conversacion.
 * Las notas privadas ya se descartaron antes: escribir una nota no es atender al prospecto.
 *
 * Devuelve un turno SIN texto: no hay nada que contestar, solo hay que anotar el traspaso. `author`
 * dice "agent" para que la bitacora no mienta diciendo que lo escribio el contacto.
 */
function takeoverTurn(payload, conversationId, type) {
  if (type !== "outgoing") return null;
  const botAgentId = ENV_BOT_AGENT_ID();
  if (!botAgentId) return null;
  const sender = payload?.sender;
  if (!sender || typeof sender !== "object") return null;
  if (sender.type && String(sender.type).toLowerCase() !== "user") return null;
  const senderId = sender.id === undefined || sender.id === null ? "" : String(sender.id);
  if (!senderId || senderId === botAgentId) return null;

  return {
    skip: false,
    turn: {
      channel: "chatwoot",
      contact_ref: String(conversationId),
      kind: "text",
      text: "",
      author: "agent",
      human_takeover: true,
      message_key: `chatwoot:takeover:${conversationId}:${payload.id ?? "s/id"}`,
      received_at: toIsoFlexible(payload.created_at) || new Date().toISOString(),
    },
    meta: { conversationId: String(conversationId), messageId: String(payload.id ?? ""), attachments: [], takeover: true },
  };
}

function fromMessageCreated(payload) {
  const conversationId = payload?.conversation?.id ?? payload?.conversation_id ?? null;
  if (!conversationId) return { skip: true, reason: "sin_conversation_id" };
  if (payload.private === true) return { skip: true, reason: "nota_privada" };
  const type = normalizeMessageType(payload.message_type);
  if (type !== "incoming") {
    const traspaso = takeoverTurn(payload, conversationId, type);
    return traspaso || { skip: true, reason: `mensaje_no_entrante:${type || "desconocido"}` };
  }
  const messageId = payload.id;
  if (!messageId) return { skip: true, reason: "sin_message_id" };
  return buildTurn({
    conversationId,
    messageId,
    content: payload.content,
    attachments: payload.attachments,
    sender: payload.sender,
    createdAtIso: toIsoFlexible(payload.created_at),
    // La atribución vive en la CONVERSACIÓN, no en el mensaje: `payload.additional_attributes` de
    // este nivel es del mensaje (campaign_id / template_params de Chatwoot) y no sirve para esto.
    conversation: payload.conversation,
  });
}

function fromConversationCreated(payload) {
  const conversationId = payload?.id ?? null;
  if (!conversationId) return { skip: true, reason: "sin_conversation_id" };
  const messages = Array.isArray(payload.messages) ? payload.messages : [];
  const first = messages[0];
  // Conversacion recien creada, todavia sin mensaje: no hay nada que contestar. El mensaje real
  // llega en su PROPIO evento message_created a continuacion (Chatwoot manda los dos).
  if (!first) return { skip: true, reason: "conversacion_sin_mensajes_todavia" };
  if (first.private === true) return { skip: true, reason: "nota_privada" };
  const type = normalizeMessageType(first.message_type);
  if (type !== "incoming") return { skip: true, reason: `mensaje_no_entrante:${type || "desconocido"}` };
  if (!first.id) return { skip: true, reason: "sin_message_id" };
  return buildTurn({
    conversationId,
    messageId: first.id,
    content: first.content,
    attachments: first.attachments,
    // El `sender` anidado es `Contact#push_event_data`, que también trae `phone_number`.
    sender: first.sender,
    createdAtIso: toIsoFlexible(first.created_at),
    // En `conversation_created` el payload ES la conversación, así que se pasa entero.
    conversation: payload,
  });
}

/**
 * Webhook crudo de Chatwoot -> { skip:true, reason } | { skip:false, turn, meta }.
 * PURO: no toca red, no llama al motor. Es lo primero que corre y lo mas facil de testear.
 */
export function parseChatwootWebhook(payload) {
  const event = payload?.event;
  if (event === "message_created") return fromMessageCreated(payload);
  if (event === "conversation_created") return fromConversationCreated(payload);
  return { skip: true, reason: `evento_no_manejado:${event || "desconocido"}` };
}

// ---------------------------------------------------------------------------
// Cliente de Chatwoot — TOLERANTE POR CONTRATO (nunca tira), mismo patron que persistence.mjs
// ---------------------------------------------------------------------------

/**
 * @param {object} [options] { baseUrl, accountId, token, fetch, timeoutMs }
 * @returns cliente tolerante. `client.enabled === false` => sin token/config: no manda nada.
 */
export function createChatwootClient(options = {}) {
  const baseUrl = String(options.baseUrl ?? ENV_BASE_URL()).replace(/\/+$/, "");
  const accountId = String(options.accountId ?? ENV_ACCOUNT_ID());
  const token = String(options.token ?? ENV_TOKEN());
  const doFetch = options.fetch || globalThis.fetch;
  const timeoutMs = Number(options.timeoutMs) > 0 ? Number(options.timeoutMs) : 8000;
  const enabled = Boolean(baseUrl && accountId && token && typeof doFetch === "function");
  const warnings = [];

  async function sendMessage(conversationId, text) {
    const trimmed = String(text || "").trim();
    if (!trimmed) return null;
    if (!enabled) {
      warnings.push("chatwoot: sin token/config (modo sin envío)");
      return null;
    }
    try {
      const res = await doFetch(`${baseUrl}/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { api_access_token: token, "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed, message_type: "outgoing" }),
        signal: AbortSignal.timeout ? AbortSignal.timeout(timeoutMs) : undefined,
      });
      const raw = await res.text();
      if (!res.ok) {
        warnings.push(`chatwoot: HTTP ${res.status} ${raw.slice(0, 160)}`);
        return null;
      }
      try {
        return JSON.parse(raw);
      } catch {
        return {};
      }
    } catch (error) {
      warnings.push(`chatwoot: ${error?.message || error}`);
      return null;
    }
  }

  return { enabled, warnings, sendMessage };
}

// ---------------------------------------------------------------------------
// Nota de voz -> texto
// ---------------------------------------------------------------------------

/**
 * Si el mensaje es una nota de voz, la transcribe con Speaches y la devuelve pegada al turno como
 * `transcript`. Si NO es voz, o si la transcripción falla, devuelve el turno intacto: el motor ve
 * un audio sin texto y contesta M_AUDIO_FAIL, exactamente como antes de que esto existiera. Que se
 * rompa Speaches no puede dejar al prospecto sin ninguna respuesta.
 *
 * @returns {Promise<{turn: object, voice: object|null, warnings: string[]}>}
 */
async function transcribeIfVoice(parsed, deps = {}) {
  const turn = parsed.turn;
  if (turn.kind !== "voice" || String(turn.text || "").trim()) {
    return { turn, voice: null, warnings: [] };
  }

  const transcribeFn = typeof deps.transcribeAudio === "function" ? deps.transcribeAudio : transcribeChatwootAudio;
  let stt;
  try {
    stt = await transcribeFn(
      {
        attachments: parsed.meta.attachments,
        // Mismas fuentes que createChatwootClient. El token NO se guarda en ningún objeto que se
        // serialice después: se pasa, se usa en un header y se olvida.
        token: String(deps.token ?? ENV_TOKEN()),
        // `||` y NO `??`: con `??`, un `deps.baseUrl` vacío ("" de una env sin completar) pasaría
        // tal cual y desarmaría la defensa contra SSRF del adjunto. Vacío = usar el default.
        chatwootBaseUrl: String(deps.baseUrl || ENV_BASE_URL()),
      },
      deps,
    );
  } catch (error) {
    // `transcribeChatwootAudio` promete no tirar, pero esta es la red de contención: acá adentro
    // una excepción se propagaría hasta el servidor de webhook y el prospecto se quedaría MUDO
    // por un audio. El bot tiene que poder decir "escribímelo" aunque Speaches explote.
    stt = { ok: false, text: "", reason: "transcripcion_exploto", warnings: [`audio: ${String(error?.message || error).slice(0, 200)}`] };
  }

  // Un transcriptor que devuelve `undefined` (un mock mal escrito, una versión futura) no puede
  // tumbar el turno con un "cannot read properties of undefined" a esta altura del pipeline.
  if (!stt || typeof stt !== "object") stt = { ok: false, text: "", reason: "respuesta_invalida", warnings: [] };

  const warnings = [...(stt.warnings || [])];
  if (!stt.ok || !stt.text) {
    warnings.push(`audio: sin transcripción (${stt.reason}) — se le pide el texto al prospecto`);
    return { turn, voice: { transcribed: false, reason: stt.reason }, warnings };
  }

  return {
    turn: { ...turn, transcript: stt.text },
    // Se reporta que hubo transcripción y CUÁNTO, nunca QUÉ dijo: la respuesta del webhook la
    // puede loguear Chatwoot, y las palabras del prospecto no tienen por qué salir del sistema.
    voice: { transcribed: true, reason: stt.reason, chars: stt.text.length },
    warnings,
  };
}

// ---------------------------------------------------------------------------
// Orquestacion de un webhook
// ---------------------------------------------------------------------------

/**
 * @param {object} payload  webhook crudo de Chatwoot
 * @param {object} [deps]   { client?, runTurn?, ...opciones de createChatwootClient/runTurn }
 * @returns {Promise<object>} { ok, skipped, reason?, duplicate, sent:[{text,posted}], warnings }
 */
export async function runChatwootTurn(payload, deps = {}) {
  const parsed = parseChatwootWebhook(payload);
  if (parsed.skip) {
    return { ok: true, skipped: true, reason: parsed.reason, duplicate: false, sent: [], warnings: [] };
  }

  // LA NOTA DE VOZ, ANTES DEL MOTOR. Va acá (transporte) y no en bot-engine.mjs, que es PURO y no
  // hace I/O — mismo criterio que la reserva de Cal.com, que vive en run-turn.mjs paso 6.5.
  // El texto entra como `transcript`, así que el motor lo trata igual que si el prospecto lo
  // hubiera escrito (readIncoming() usa el transcript como texto cuando kind = "voice") y el guion
  // sigue normal: califica, agenda, todo. `kind` se deja en "voice" a propósito: en la bitácora
  // tiene que quedar que fue un audio, no una mentira de que escribió.
  const audio = await transcribeIfVoice(parsed, deps);
  const runTurnFn = typeof deps.runTurn === "function" ? deps.runTurn : realRunTurn;
  const turnResult = await runTurnFn(audio.turn, deps);

  const client = deps.client || createChatwootClient(deps);
  // Mismo "encendido en dos pasos" que Telegram (N8N_WORKFLOW.md §4.6): con ONIA_BOT_DRY_RUN=true
  // (el default) el motor SI calcula la respuesta real, pero acá no se postea nada a Chatwoot —
  // sólo se reporta qué se habría mandado. Recién con dryRun:false se llama a la API de verdad.
  const dryRun = Boolean(turnResult && turnResult.dryRun);
  const sent = [];
  if (turnResult && turnResult.ok !== false && Array.isArray(turnResult.send)) {
    for (const reply of turnResult.send) {
      if (!reply?.text) continue;
      if (dryRun) {
        sent.push({ text: reply.text, posted: false, reason: "dry_run" });
        continue;
      }
      // eslint-disable-next-line no-await-in-loop -- el orden de los mensajes importa (disclosure antes que cuerpo)
      const posted = await client.sendMessage(parsed.meta.conversationId, reply.text);
      sent.push({ text: reply.text, posted: Boolean(posted) });
    }
  }

  return {
    ok: Boolean(turnResult && turnResult.ok !== false),
    skipped: false,
    duplicate: Boolean(turnResult && turnResult.duplicate),
    conversationId: parsed.meta.conversationId,
    messageId: parsed.meta.messageId,
    // Aditivo (no rompe a nadie): el servidor de webhook los manda a n8n como analítica
    // redactada. Saber que una conversación pasó de `nuevo` a `esperando_horario` es la
    // señal útil; el texto del prospecto no sale del sistema.
    stageBefore: (turnResult && turnResult.stageBefore) || null,
    stageAfter: (turnResult && turnResult.stageAfter) || null,
    // El motor emite `notify_sergio` cuando deriva a un humano, y hasta hoy ESTE archivo lo
    // tiraba: el lead quedaba en review_queue (se ve en el panel) pero nadie avisaba. Si Sergio
    // no abria el panel, el prospecto esperaba solo. Se propaga para que el servidor lo mande
    // por el canal de n8n, que es donde vive la credencial de Telegram (el plan VPS no soporta
    // $env en los nodos, asi que el token no puede vivir aca).
    notify: (turnResult && Array.isArray(turnResult.notify) ? turnResult.notify : []),
    dryRun: Boolean(turnResult && turnResult.dryRun),
    // null = no era un audio. `{transcribed:false}` = era y no se pudo: eso es lo que hay que
    // mirar si el bot vuelve a contestar "¿me lo escribís?" cuando no debería.
    voice: audio.voice,
    sent,
    warnings: [...audio.warnings, ...(client.warnings || []), ...((turnResult && turnResult.warnings) || [])],
  };
}

// ---------------------------------------------------------------------------
// main — solo cuando se ejecuta como binario, no cuando lo importa un test
// ---------------------------------------------------------------------------

function readStdin() {
  return new Promise((resolve) => {
    if (process.stdin.isTTY) return resolve("");
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", () => resolve(data));
  });
}

/**
 * Igual que run-turn.mjs: el nodo SSH de n8n no tiene stdin, asi que el webhook tambien puede
 * viajar en base64 por variable. `deps.readStdin` es inyectable para test (el real bloquea
 * esperando EOF de un stdin real, que en un runner de tests puede no llegar nunca).
 */
export async function readPayload(deps = {}) {
  const readStdinFn = typeof deps.readStdin === "function" ? deps.readStdin : readStdin;
  const fromEnv = process.env.CHATWOOT_WEBHOOK_B64
    ? Buffer.from(process.env.CHATWOOT_WEBHOOK_B64, "base64").toString("utf8")
    : "";
  const raw = (await readStdinFn()).trim() || fromEnv.trim();
  if (!raw) throw new Error("sin payload: mandá el webhook de Chatwoot por stdin o CHATWOOT_WEBHOOK_B64");
  return JSON.parse(raw);
}

export async function main() {
  try {
    const payload = await readPayload();
    const result = await runChatwootTurn(payload);
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } catch (error) {
    // Falla hacia el silencio: n8n no reintenta con un error, y no se manda nada dos veces.
    process.stdout.write(
      `${JSON.stringify({ ok: false, skipped: false, duplicate: false, sent: [], error: String(error?.message || error).slice(0, 300) })}\n`,
    );
  }
}

const invokedDirectly = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) main();
