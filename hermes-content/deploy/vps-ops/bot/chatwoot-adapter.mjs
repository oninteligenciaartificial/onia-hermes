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
import { createStore } from "./persistence.mjs";
import { pickAudioAttachment, transcribeChatwootAudio } from "./audio-transcribe.mjs";
import { describeChatwootImage } from "./vision.mjs";
import { ensureKnowledge, esInboxDeCliente } from "./knowledge.mjs";

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

/**
 * DE QUE INBOX vino un payload de Chatwoot, mire donde mire el evento.
 *
 * Chatwoot lo pone en TRES lugares distintos segun el evento, y hasta el 2026-09-13 cada rama lo
 * extraia por su cuenta con un orden propio: `message_created` mira `inbox.id` (top-level,
 * capturado en vivo el 2026-07-26) con `conversation.inbox_id` de respaldo, y
 * `conversation_created` mira `inbox_id` PLANO, porque ahi el payload ES la conversacion. Tres
 * copias del mismo dato es el par clasico que diverge y se arregla de un solo lado — y el que
 * quedaba afuera era el log del webhook, que no podia deducirlo solo.
 *
 * El orden va de lo mas especifico a lo mas general y es superset de los tres casos: donde habia
 * un solo origen posible, el resultado no cambia.
 *
 * @returns {string|null} el id como string, o `null` si el evento no lo trae.
 */
export function inboxDelPayload(payload) {
  const crudo = payload?.inbox?.id ?? payload?.inbox_id ?? payload?.conversation?.inbox_id ?? null;
  return crudo === undefined || crudo === null || crudo === "" ? null : String(crudo);
}

/**
 * El MEDIO por el que entro la conversacion (`Channel::Whatsapp`, `Channel::WebWidget`, ...).
 *
 * Es distinto del inbox y no se deriva de el: el id es un dato de instalacion y se renumera al
 * recrear un inbox, el medio no. De aca sale `{{via_humano}}` — si el bot puede prometerle al
 * prospecto que le escriben "desde este mismo numero" o tiene que decir "por este mismo chat".
 * Mismo orden de respaldo que `inboxDelPayload`, por las mismas tres formas de payload.
 */
export function canalDelPayload(payload) {
  const crudo =
    payload?.inbox?.channel_type ??
    payload?.channel_type ??
    payload?.conversation?.channel_type ??
    payload?.conversation?.inbox?.channel_type ??
    null;
  return crudo === undefined || crudo === null || crudo === "" ? null : String(crudo);
}

function buildTurn({ conversationId, messageId, content, attachments, sender, createdAtIso, conversation, inboxId, channelType }) {
  const text = String(content || "").trim();
  const atribucion = attributionFrom(conversation);
  return {
    skip: false,
    turn: {
      channel: "chatwoot",
      // OJO: `contact_ref` es la IDENTIDAD de la conversación (de acá sale `conversationKey`).
      // Cambiarlo rompe todas las conversaciones vivas. El teléfono va aparte, en `public_contact`.
      contact_ref: String(conversationId),
      // DE QUE INBOX vino: es lo que resuelve "de que cliente es esta conversación" (el
      // cargador de knowledge keyea por inbox y el producto lo traduce a organización).
      // null = comportamiento de siempre (conocimiento de Onia, archivo/código).
      inbox_id: inboxId,
      // El MEDIO, aparte del inbox: decide por que via promete el bot que escribe el humano.
      channel_type: channelType,
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
 * El NOMBRE de la plantilla de Meta con la que salio este mensaje, o null si fue texto libre.
 *
 * Chatwoot lo expone en el nivel de ARRIBA del payload del webhook — capturado en vivo en sus logs
 * el 2026-08-13 (el WebhookJob que apunta a nuestro endpoint):
 *   additional_attributes: { template_params: { name: "seguimiento_demo", language: "es",
 *                                               processed_params: { body: { ... } } } }
 * Es el MISMO objeto que arma whatsappTemplate() para el POST: el builder lo guarda en el mensaje
 * (`messages/message_builder.rb:122-124`) y de ahi sale al webhook. O sea que para saber que este
 * envio se cobra como plantilla no hay que preguntarle nada a Meta.
 *
 * ACA SOLO SE REGISTRA EL HECHO ("salio con la plantilla X"). Que categoria y que tarifa le toca lo
 * decide el medidor, que es el unico dueño del registro de plantillas (usage-run.mjs
 * `PLANTILLAS_META`): dos tablas de plantillas en dos archivos se desincronizan y ahi se factura mal.
 *
 * OJO: `payload.additional_attributes` del NIVEL DEL MENSAJE es esto; el de la conversacion
 * (`payload.conversation.additional_attributes`) es otra cosa — de ahi sale la atribucion.
 */
function templateNameOf(payload) {
  const extra = payload?.additional_attributes;
  const params = extra && typeof extra === "object" ? extra.template_params : null;
  // Se recorta como todo lo que viene de afuera y termina en la base (mismo criterio que
  // `external_message_id`): el payload lo arma otro sistema, no nosotros.
  const name = params && typeof params === "object" ? String(params.name ?? "").trim().slice(0, 200) : "";
  return name || null;
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
 * dice "human" — es uno de los tres valores que acepta `bot_messages.author` (contact | bot | human)
 * y es el unico que no miente: no lo escribio el contacto y tampoco el bot. Iba como "agent", que
 * la base no conoce, y `buildMessageRow` lo degradaba en silencio.
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
      author: "human",
      human_takeover: true,
      // Con que plantilla de Meta salio (o null si fue texto libre). Es lo que separa un envio de
      // 0,0113 USD de uno de 0,0740: sin esto, todo lo que manda un humano se cobra como servicio.
      template_name: templateNameOf(payload),
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
    inboxId: inboxDelPayload(payload),
    channelType: canalDelPayload(payload),
  });
}

/**
 * RESOLVER = devolverle la conversacion al bot (bandeja nativa 2026-08-29).
 * No es un mensaje: es un turno de sistema que solo limpia el candado del
 * takeover. El dedup usa el timestamp del evento para que resolver dos veces
 * (reabrir y volver a resolver) genere claves distintas.
 */
function fromConversationResolved(payload) {
  const conversationId = payload?.id ?? payload?.conversation?.id ?? null;
  if (!conversationId) return { skip: true, reason: "sin_conversation_id" };
  return {
    skip: false,
    turn: {
      channel: "chatwoot",
      contact_ref: String(conversationId),
      kind: "system",
      text: "",
      human_takeover_clear: true,
      message_key: `chatwoot:resolved:${conversationId}:${payload?.timestamp ?? "s/ts"}`,
      received_at: toIsoFlexible(payload?.timestamp) || new Date().toISOString(),
    },
    meta: { conversationId: String(conversationId), messageId: "", attachments: [], resolved: true },
  };
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
    // ... y el inbox es el de la conversación misma (`inbox_id` plano en push_event_data).
    inboxId: inboxDelPayload(payload),
    channelType: canalDelPayload(payload),
  });
}

/**
 * EL CLICK DE UN BOTON (input_select) NO crea un mensaje nuevo: Chatwoot escribe
 * `content_attributes.submitted_values` SOBRE el mensaje SALIENTE original y dispara
 * `message_updated` (verificado en vivo contra el 4.12.1 del VPS, 2026-08-18: el mensaje del
 * menu quedo con `items` + `submitted_values` y NINGUN message_created nuevo). Sin manejar este
 * evento los botones se muestran pero clickearlos no hace nada — y el webhook de la cuenta
 * tiene que estar suscripto a `message_updated` ademas de `message_created`.
 *
 * Guardas, en orden: no privado, content_type `input_select`, y `submitted_values` con algo.
 * CUALQUIER otro message_updated (ediciones, cambios de estado) se skipea: este evento entra
 * al motor unicamente como "el contacto eligio una opcion del menu".
 *
 * El turno es INBOUND con el TITULO elegido como texto (es lo que el contacto vio; el motor
 * rutea titulo O value). El `sender` del payload NO se lee: en un mensaje saliente el sender es
 * el propio bot, no el contacto. La clave de idempotencia lleva el valor elegido: un
 * message_updated re-disparado por el mismo mensaje no procesa el click dos veces.
 */
function fromMessageUpdated(payload) {
  const conversationId = payload?.conversation?.id ?? payload?.conversation_id ?? null;
  if (!conversationId) return { skip: true, reason: "sin_conversation_id" };
  if (payload.private === true) return { skip: true, reason: "nota_privada" };
  if (payload.content_type !== "input_select") return { skip: true, reason: "update_sin_botones" };
  const submitted = Array.isArray(payload?.content_attributes?.submitted_values)
    ? payload.content_attributes.submitted_values.filter((v) => v && typeof v === "object" && (v.title || v.value))
    : [];
  if (!submitted.length) return { skip: true, reason: "sin_valor_elegido" };
  if (!payload.id) return { skip: true, reason: "sin_message_id" };

  const eleccion = submitted[submitted.length - 1];
  const texto = String(eleccion.title || eleccion.value || "").trim();
  if (!texto) return { skip: true, reason: "eleccion_vacia" };

  const atribucion = attributionFrom(payload.conversation);
  const inboxId = inboxDelPayload(payload);
  return {
    skip: false,
    turn: {
      channel: "chatwoot",
      contact_ref: String(conversationId),
      inbox_id: inboxId,
      channel_type: canalDelPayload(payload),
      kind: "text",
      text: texto,
      message_key: `chatwoot:${conversationId}:${payload.id}:select:${String(eleccion.value || eleccion.title).slice(0, 100)}`,
      received_at: toIsoFlexible(payload.updated_at) || toIsoFlexible(payload.created_at) || new Date().toISOString(),
      piece_key: atribucion.pieceKey,
      source_campaign: atribucion.sourceCampaign,
    },
    meta: { conversationId: String(conversationId), messageId: String(payload.id), attachments: [] },
  };
}

/**
 * Webhook crudo de Chatwoot -> { skip:true, reason } | { skip:false, turn, meta }.
 * PURO: no toca red, no llama al motor. Es lo primero que corre y lo mas facil de testear.
 */
export function parseChatwootWebhook(payload) {
  const event = payload?.event;
  if (event === "message_created") return fromMessageCreated(payload);
  if (event === "message_updated") return fromMessageUpdated(payload);
  if (event === "conversation_created") return fromConversationCreated(payload);
  if (event === "conversation_resolved") return fromConversationResolved(payload);
  if (event === "conversation_status_changed") {
    // Solo el paso a resolved desarma; reabrir (open) no toca nada — el proximo
    // outgoing humano re-arma el takeover solo si el dueno vuelve a hablar.
    if (String(payload?.status || "") === "resolved") return fromConversationResolved(payload);
    return { skip: true, reason: `status_no_desarma:${payload?.status || "desconocido"}` };
  }
  return { skip: true, reason: `evento_no_manejado:${event || "desconocido"}` };
}

// ---------------------------------------------------------------------------
// El toque de un boton del RECORDATORIO DE CITA (lo contesta la plataforma, no el bot)
// ---------------------------------------------------------------------------
//
// El recordatorio de cita por WhatsApp sale desde el numero del NEGOCIO CLIENTE con tres botones
// de respuesta rapida. Cuando el paciente toca uno, Chatwoot 4.12.1 entrega un `message_created`
// entrante comun cuyo `content` es SOLO el texto del boton: sin payload, sin contexto (medido el
// 1-oct, ver la cabecera del gemelo). La plataforma recibe ese mismo mensaje —se lo reenvia ESTE
// motor (`uso-plataforma.mjs`), porque Chatwoot tiene un solo webhook y apunta aca—, cambia la
// cita y le CONTESTA al paciente en la misma conversacion. Si el bot tambien contesta, el paciente
// recibe dos respuestas, y la del bot es un LLM improvisando sobre la palabra «Cancelar».
//
// ⚠️ GEMELO: `onia-platform/lib/whatsapp/respuesta-al-recordatorio.ts` (`accionDelBoton` y su
// `soloLetras`), con los textos en `lib/whatsapp/plantilla-recordatorio.ts` (`BOTONES_RECORDATORIO`).
// Los dos lados tienen que reconocer EXACTAMENTE los mismos toques. Si uno cambia un texto o la
// normalizacion sin el otro: o el bot contesta encima de la plataforma (doble respuesta), o el bot
// se calla ante algo que la plataforma ya no reconoce como boton — y nadie le contesta a nadie.

/** Los textos de los tres botones, ya pasados por `soloLetras`. */
const BOTONES_DEL_RECORDATORIO = new Set(["confirmar", "cancelar", "reprogramar"]);

/**
 * La misma normalizacion que `soloLetras` de la plataforma: sin tildes, minusculas, solo a-z.
 * El rango del primer `replace` son las marcas combinantes U+0300–U+036F escritas LITERALES, byte
 * por byte iguales a las del gemelo (no se ven en pantalla: no "limpiarlas" al editar).
 */
function soloLetras(texto) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

/**
 * ¿Este texto es el toque de un boton del recordatorio? Tolera mayusculas, tildes, espacios y
 * signos («CONFIRMAR!», «Confirmár»), nada mas: «no puedo confirmar todavia» es una frase, no un
 * toque, y la contesta el bot como siempre.
 */
export function esBotonDelRecordatorio(contenido) {
  if (typeof contenido !== "string") return false;
  return BOTONES_DEL_RECORDATORIO.has(soloLetras(contenido));
}

/**
 * ¿Le toca a la PLATAFORMA contestar este turno? Solo si se cumplen TODAS, porque callarse cuando
 * la plataforma tampoco contesta es dejar a la persona sola:
 *   1. es un mensaje DEL CONTACTO (`message_created`, o el primero embebido en
 *      `conversation_created`, que comparte su `message_key`). No el click en un menu del propio
 *      bot (`message_updated`): ese la plataforma no lo procesa.
 *   2. el texto es EXACTAMENTE un boton (`esBotonDelRecordatorio`).
 *   3. trae telefono. La plataforma busca la cita por el numero del paciente y sin numero contesta
 *      "no aplica" y se calla (`numeroParaWhatsapp` -> null): el widget web de un cliente cae aca.
 *   4. el inbox es de una org CLIENTE (`esInboxDeCliente`). En los inboxes de Onia (4 web, 5
 *      WhatsApp de ventas) la plataforma no hace nada con esos textos; en el huerfano y en el
 *      conflicto tampoco: en todos esos el bot sigue contestando como hoy.
 *
 * La resolucion inbox -> org es la MISMA que usa el turno (`ensureKnowledge`, cache por inbox):
 * con la cache caliente no toca la red, y con la fria hace la lectura que `resolveConfig` iba a
 * hacer igual un instante despues. Cero llamadas nuevas. Nunca tira: ante cualquier falla, el bot
 * contesta como siempre.
 */
async function leTocaALaPlataforma(payload, parsed, deps = {}) {
  const event = payload?.event;
  if (event !== "message_created" && event !== "conversation_created") return false;
  const turn = parsed?.turn;
  if (!turn || turn.human_takeover || turn.kind !== "text") return false;
  if (!esBotonDelRecordatorio(turn.text)) return false;
  if (!turn.public_contact || !turn.inbox_id) return false;
  try {
    const resolver = typeof deps.ensureKnowledge === "function" ? deps.ensureKnowledge : ensureKnowledge;
    const opciones = { inboxId: turn.inbox_id, ...(deps.knowledge || {}) };
    return esInboxDeCliente(await resolver(opciones), opciones);
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Cliente de Chatwoot — TOLERANTE POR CONTRATO (nunca tira), mismo patron que persistence.mjs
// ---------------------------------------------------------------------------

/**
 * Los `template_params` con los que Chatwoot manda una PLANTILLA aprobada de WhatsApp.
 *
 * POR QUE HACE FALTA: pasadas las 24 h del ultimo mensaje del prospecto, la ventana de servicio de
 * Meta se cierra y el texto de formato libre falla con 131047. Chatwoot ya lo sabe y cambia solo de
 * carril — `app/services/whatsapp/send_on_whatsapp_service.rb:9` (fuente 4.12.1 leido en el VPS):
 *   `should_send_template_message = template_params.present? || !message.conversation.can_reply?`
 * — pero si no le decimos CUAL plantilla, marca el mensaje `failed` con
 * "Template not found or invalid template name" (linea 27). O sea: fuera de la ventana, sin esto,
 * el mensaje no sale igual.
 *
 * LA FORMA EXACTA, verificada en el fuente (no adivinada):
 *   - va TOP-LEVEL en el POST. `Messages::MessageBuilder#template_params`
 *     (`app/builders/messages/message_builder.rb:122-124`) hace
 *     `@params[:template_params].present? ? { additional_attributes: { template_params: ... } }`,
 *     o sea que ES CHATWOOT quien lo mete adentro de `additional_attributes`. Mandarlo nosotros ya
 *     anidado no sirve: el builder nunca lee `@params[:additional_attributes]`. Y no lo filtra
 *     ningun strong param — el controller le pasa `params` entero
 *     (`api/v1/accounts/conversations/messages_controller.rb:10`).
 *   - `name` + `language` tienen que dar con una plantilla `approved` del canal
 *     (`whatsapp/template_processor_service.rb:21-27`, compara el idioma sin distinguir mayusculas).
 *   - `processed_params` en formato "enhanced": las variables posicionales van en `body` con la
 *     clave en TEXTO ("1", "2"), que es lo que espera `process_body_components` (linea 79-94).
 *     El formato viejo (array plano) tambien entra, pero lo convierte otro servicio: mandamos el
 *     nuevo y nos ahorramos el paso.
 *
 * Una variable vacia se DESCARTA rio abajo (`next if value.blank?`), y entonces la plantilla sale
 * con menos parametros de los que declara y Meta la rechaza. Por eso el que llama garantiza que no
 * haya huecos ANTES de armar esto — nunca se manda una plantilla a medias.
 *
 * @param {string} name        nombre exacto de la plantilla aprobada en Meta
 * @param {Array<string>} variables  {{1}}, {{2}}, ... en orden
 * @param {string} [language]  codigo de idioma con el que se aprobo ("es")
 */
export function whatsappTemplate(name, variables = [], language = "es") {
  const body = {};
  variables.forEach((value, index) => {
    body[String(index + 1)] = String(value);
  });
  return { name, language, processed_params: { body } };
}

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

  /**
   * @param {string|number} conversationId
   * @param {string} text  el cuerpo. Con plantilla sigue viajando: es lo que se ve en el panel de
   *   Chatwoot y lo que queda en la bitacora, asi que tiene que decir LO MISMO que recibe el
   *   prospecto (a Meta el texto se lo da la plantilla aprobada, no esto).
   * @param {object|null} [templateParams]  ver whatsappTemplate(). Sin esto el POST es identico al
   *   de siempre — el 99% del trafico va dentro de la ventana y sigue siendo texto libre gratis.
   * @param {object|null} [interactive]  { items: [{title, value}] } => el mensaje sale como
   *   `content_type: "input_select"`. Es el UNICO content type que sirve en los DOS canales: el
   *   widget Website lo renderiza como opciones clickeables y Chatwoot lo traduce a reply buttons
   *   de WhatsApp (PR #6886, max 3 — por eso el slice). `cards`/`form` NO pasan al canal WhatsApp
   *   (issue #12572), asi que no se usan. Sin items el POST es el texto plano de siempre.
   */
  async function sendMessage(conversationId, text, templateParams = null, interactive = null) {
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
        body: JSON.stringify({
          content: trimmed,
          message_type: "outgoing",
          ...(templateParams ? { template_params: templateParams } : {}),
          ...(interactive && Array.isArray(interactive.items) && interactive.items.length
            ? { content_type: "input_select", content_attributes: { items: interactive.items.slice(0, 3) } }
            : {}),
        }),
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

  /**
   * Manda una IMAGEN (o archivo) como mensaje del bot: `multipart/form-data` con `attachments[]`,
   * la forma documentada del Create Message API (autentica con token de usuario O de agent bot).
   *
   * PLOMERIA SIN USO AUTOMATICO TODAVIA: es la base para el QR dinamico del BCP ("escanea y paga
   * el monto exacto") y las fotos de catalogo — ver ONIA_CHATBOT_ALTA_WHATSAPP_CLIENTE.md §F2/F4b.
   * Ningun flujo del motor la llama aun (YAGNI hasta que haya un QR real que mandar).
   * Limites si el mensaje viaja por el canal WhatsApp de Chatwoot: JPEG/PNG 8-bit, max 5 MB,
   * caption hasta 1024 chars, y fuera de la ventana de 24 h un adjunto libre NO sale. En el
   * widget Website renderiza nativo, sin limites de Meta.
   *
   * @param {string|number} conversationId
   * @param {object} file { buffer: Buffer|Uint8Array, filename?, contentType?, caption? }
   * @returns {Promise<object|null>} el mensaje creado, o null (tolerante por contrato: nunca tira)
   */
  async function sendAttachment(conversationId, { buffer, filename = "imagen.png", contentType = "image/png", caption = "" } = {}) {
    if (!enabled) {
      warnings.push("chatwoot: sin token/config (modo sin envío)");
      return null;
    }
    if (!buffer || !buffer.length) {
      warnings.push("chatwoot: adjunto sin contenido, no se manda");
      return null;
    }
    try {
      const form = new FormData();
      const texto = String(caption || "").trim();
      if (texto) form.append("content", texto);
      form.append("message_type", "outgoing");
      form.append("attachments[]", new Blob([buffer], { type: contentType }), filename);
      const res = await doFetch(`${baseUrl}/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`, {
        method: "POST",
        // Sin Content-Type a mano: el boundary del multipart lo pone fetch al ver el FormData.
        headers: { api_access_token: token },
        body: form,
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

  return { enabled, warnings, sendMessage, sendAttachment };
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
/**
 * Vision (v5, go de Sergio): si el mensaje es una FOTO sin texto, la describe via
 * LiteLLM y la pega al turno como `image_description`. Si NO es foto, no hay key,
 * o la vision falla por lo que sea, devuelve el turno intacto: el motor contesta
 * R_ATTACH pelado, exactamente como antes de que esto existiera.
 */
async function describeIfImage(parsed, deps = {}) {
  const turn = parsed.turn;
  if (turn.kind !== "attachment" || String(turn.text || "").trim()) {
    return { turn, warnings: [] };
  }
  const describeFn = typeof deps.describeImage === "function" ? deps.describeImage : describeChatwootImage;
  let vis;
  try {
    vis = await describeFn(
      {
        attachments: parsed.meta.attachments,
        token: String(deps.token ?? ENV_TOKEN()),
        chatwootBaseUrl: String(deps.baseUrl || ENV_BASE_URL()),
      },
      deps,
    );
  } catch (error) {
    vis = { ok: false, description: "", reason: "vision_exploto", warnings: [`vision: ${String(error?.message || error).slice(0, 160)}`] };
  }
  if (!vis || typeof vis !== "object") vis = { ok: false, description: "", reason: "respuesta_invalida", warnings: [] };
  const warnings = [...(vis.warnings || [])];
  if (!vis.ok || !vis.description) {
    if (vis.reason && vis.reason !== "sin_litellm_key" && vis.reason !== "sin_imagen") {
      warnings.push(`vision: sin descripcion (${vis.reason})`);
    }
    return { turn, warnings };
  }
  return { turn: { ...turn, image_description: vis.description, ...(vis.comprobante ? { image_receipt: vis.comprobante } : {}) }, warnings };
}

export async function runChatwootTurn(payload, deps = {}) {
  const parsed = parseChatwootWebhook(payload);
  if (parsed.skip) {
    return { ok: true, skipped: true, reason: parsed.reason, duplicate: false, sent: [], warnings: [] };
  }

  // EL TOQUE DE UN BOTON DEL RECORDATORIO lo contesta la plataforma (ver `leTocaALaPlataforma`).
  // Se corta ANTES del motor y con el MISMO `skip` que los demas, para que salga igual en el JSON
  // y en el log (`rama=ignorado motivo=boton_del_recordatorio`). Antes del motor significa: no
  // reclama el `message_key` en la base (el dedup durable queda intacto), no gasta LLM y no puede
  // disparar un handoff ni un aviso a Sergio Urcullo. El cupo tampoco se mueve: el reenvio sigue
  // saliendo, pero la plataforma no le cuenta a `registrarMensajeEntrante` un toque de boton.
  // Va ACA y no en `parseChatwootWebhook`, a proposito: el parser es puro (sin red) y, sobre todo,
  // un skip del parser corta el webhook ANTES de que el servidor arme el reenvio a la plataforma
  // (`usoPlataforma`) — y ese reenvio es por donde la plataforma se ENTERA del toque. Cortado ahi,
  // la cita no cambiaba y nadie le contestaba al paciente.
  if (await leTocaALaPlataforma(payload, parsed, deps)) {
    return { ok: true, skipped: true, reason: "boton_del_recordatorio", duplicate: false, sent: [], warnings: [] };
  }

  // LA NOTA DE VOZ, ANTES DEL MOTOR. Va acá (transporte) y no en bot-engine.mjs, que es PURO y no
  // hace I/O — mismo criterio que la reserva de Cal.com, que vive en run-turn.mjs paso 6.5.
  // El texto entra como `transcript`, así que el motor lo trata igual que si el prospecto lo
  // hubiera escrito (readIncoming() usa el transcript como texto cuando kind = "voice") y el guion
  // sigue normal: califica, agenda, todo. `kind` se deja en "voice" a propósito: en la bitácora
  // tiene que quedar que fue un audio, no una mentira de que escribió.
  const audio = await transcribeIfVoice(parsed, deps);
  const visto = await describeIfImage({ ...parsed, turn: audio.turn }, deps);
  const runTurnFn = typeof deps.runTurn === "function" ? deps.runTurn : realRunTurn;
  const turnResult = await runTurnFn(visto.turn, deps);

  const client = deps.client || createChatwootClient(deps);
  const store = deps.store || createStore();
  // Mismo "encendido en dos pasos" que Telegram (N8N_WORKFLOW.md §4.6): con ONIA_BOT_DRY_RUN=true
  // (el default) el motor SI calcula la respuesta real, pero acá no se postea nada a Chatwoot —
  // sólo se reporta qué se habría mandado. Recién con dryRun:false se llama a la API de verdad.
  const dryRun = Boolean(turnResult && turnResult.dryRun);
  const sent = [];
  if (turnResult && turnResult.ok !== false && Array.isArray(turnResult.send)) {
    for (const reply of turnResult.send) {
      if (!reply?.text) continue;
      // Botones del motor (reply.options) => input_select. Se reportan en `sent` para que un
      // curl de verificacion vea QUE botones habrian salido sin abrir el widget.
      const interactive = Array.isArray(reply.options) && reply.options.length ? { items: reply.options } : null;
      if (dryRun) {
        sent.push({ text: reply.text, posted: false, reason: "dry_run", ...(interactive ? { options: reply.options } : {}) });
        continue;
      }
      // eslint-disable-next-line no-await-in-loop -- el orden de los mensajes importa (disclosure antes que cuerpo)
      const posted = await client.sendMessage(parsed.meta.conversationId, reply.text, null, interactive);
      sent.push({ text: reply.text, posted: Boolean(posted), ...(interactive ? { options: reply.options } : {}) });
      // El DESENLACE real sobre la fila que insertOutbound ya escribio como "sent"
      // (fix del handoff 2026-08-23): si Chatwoot rechazo el POST, la fila pasa a
      // "failed" — antes mentia para siempre y el bot estuvo mudo semanas sin que
      // ninguna consulta a la base lo delatara. Tolerante: markMessageDelivered
      // nunca tira, y una reply sin clave simplemente no se marca.
      if (reply.messageKey && store && typeof store.markMessageDelivered === "function") {
        // eslint-disable-next-line no-await-in-loop -- mismo orden que el envio
        await store.markMessageDelivered(
          reply.messageKey,
          posted ? "sent" : "failed",
          posted && posted.id != null ? posted.id : null,
        );
      }
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
    // Viaja pegado a `notify` porque es para el MISMO aviso: sin esto el webhook no puede
    // decirle a Sergio Urcullo si lo que le llega es una sonda nuestra o un lead de verdad.
    esNuestra: Boolean(turnResult && turnResult.esNuestra),
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
