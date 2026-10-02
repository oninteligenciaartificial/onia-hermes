// ONIA — Chatbot propio (el que atiende "DEMO"): EJECUTOR DE UN TURNO.
//
// Corre DENTRO del contenedor onia-center (docker exec), invocado por n8n via SSH.
// Es el pegamento entre el motor puro (bot-engine.mjs) y la base (persistence.mjs).
//
//   entrada  : JSON por STDIN (o BOT_TURN_B64 en base64 si el canal no da stdin)
//   salida   : JSON por STDOUT con las respuestas A ENVIAR + lo que n8n tiene que hacer
//   codigo de salida: SIEMPRE 0. Un error se reporta en el JSON, no reventando el proceso
//                     (si el ejecutor revienta, n8n reintenta y el prospecto recibe duplicados).
//
// ENTRADA
// {
//   "channel": "telegram",            // sim | telegram | whatsapp | instagram
//   "contact_ref": "1234567",         // chat_id de Telegram / wa_id / ig id
//   "conversation_key": null,         // opcional: default `<channel>:<contact_ref>`
//   "display_name": "Sergio",         // opcional
//   "text": "DEMO",                   // texto del prospecto
//   "kind": "text",                   // text | voice | attachment
//   "transcript": null,               // texto de Speaches cuando kind = voice
//   "message_key": "telegram:8891",   // id del mensaje del canal -> DEDUP. Sin esto no hay dedup fuerte
//   "received_at": "2026-07-26T18:00:00Z",  // opcional: default ahora
//   "piece_key": "lucia-d03-reel-siat",     // opcional, atribucion de campana
//   "source_campaign": "lucia-dentalgest-jul2026",
//   "human_takeover": false,          // true = un humano contesto: el bot se calla PARA SIEMPRE
//                                     //        y ese mensaje se guarda como SALIENTE (lo cobra Meta)
//   "template_name": null,            // nombre de la plantilla de Meta con la que salio, si aplica
//                                     //        ("seguimiento_demo"): decide utility vs marketing
//   "dry_run": true,                  // opcional: pisa ONIA_BOT_DRY_RUN
//   "slots": [{"key":"A","label":"jueves 15:00","startAt":"2026-07-30T19:00:00Z"}]  // opcional
// }
//
// SALIDA (lo que consume n8n)
// { ok, conversationKey, channel, contactRef, duplicate, stageBefore, stageAfter,
//   send:[{text,templateKey,replySource,deliveryStatus}], notify:[...], calendar:[...],
//   leadKey, reviewKeys, persisted, notes, warnings }
//
// PIPELINE (spec §5.2). Orden NO negociable:
//   1. cargar/crear la conversacion       5. resolver LLM (solo rama off-guion)
//   2. correr step() en memoria (puro)    6. aplicar efectos de base (leads / review / audit)
//   3. RECLAMAR el inbound (dedup)        7. persistir outbound + estado
//   4. si el inbound ya estaba: CORTAR    8. imprimir lo que hay que enviar
//
// Spec: hermes-content/docs/ONIA_CHATBOT_PROPIO_SPEC_20260725.md

import { pathToFileURL } from "node:url";

import {
  candidatosDeLista,
  createBotConfig,
  DEFAULT_CONFIG,
  parseSlotsSpec,
  renderTemplate,
  slotsDeCandidatos,
  slotsElegibles,
} from "./config.mjs";
import { esConversacionNuestra } from "./es-nuestra.mjs";
import { ensureKnowledge, withKnowledge } from "./knowledge.mjs";
import { createState, step, markHumanTakeover,
  clearHumanTakeover, LLM_PENDING } from "./bot-engine.mjs";
import { createStore } from "./persistence.mjs";
import { getAvailableSlots as getAvailableSlotsFromCalcom } from "./calcom-availability.mjs";
import {
  agendaDelEntorno,
  createBooking,
  buildBookingNotes,
  meetingLink,
  avisoDeReservaFallida,
  motivoEnSeco,
  reservaQueNoSalio,
} from "./calcom-booking.mjs";

// ---------------------------------------------------------------------------
// Entrada
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

export function parseInput(raw) {
  const fromEnv = process.env.BOT_TURN_B64
    ? Buffer.from(process.env.BOT_TURN_B64, "base64").toString("utf8")
    : "";
  const text = String(raw || "").trim() || fromEnv.trim();
  if (!text) throw new Error("sin payload: mandá el JSON del turno por stdin o BOT_TURN_B64");
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== "object") throw new Error("el payload no es un objeto JSON");
  return parsed;
}

/**
 * De que INBOX de Chatwoot vino este turno. Es lo que resuelve "de que organizacion es esta
 * conversacion" sin organizationId manual: el cargador de knowledge keyea por inbox y el
 * producto lo traduce a org (clinic_settings.chatwootInboxId). Sin inbox (Telegram, sim,
 * followups) devuelve {} y todo queda exactamente como antes.
 */
function knowledgeOptions(input) {
  const inboxId = String(input?.inbox_id ?? input?.inboxId ?? "").trim();
  return inboxId ? { inboxId } : {};
}

/**
 * Config del turno: DEFAULT_CONFIG + slots + dryRun + los HECHOS editables (knowledge.json).
 * Nada mas se pisa desde el canal. Sin archivo de conocimiento devuelve exactamente lo de antes
 * (el MISMO objeto): la capa editable degrada a codigo sin cambiar una coma.
 */
export function buildConfig(input) {
  const overrides = {};
  const envDry = String(process.env.ONIA_BOT_DRY_RUN ?? "").toLowerCase();
  if (typeof input.dry_run === "boolean") overrides.dryRun = input.dry_run;
  else if (envDry === "false") overrides.dryRun = false;
  else if (envDry === "true") overrides.dryRun = true;

  // SIN AGENDA PROPIA NO SE CARGAN HORARIOS (2-oct). Los de ONIA_BOT_SLOTS los escribe un cron
  // desde las ventanas de atencion, no un calendario: ofrecerlos sin `ONIA_BOT_AGENDA=calcom` (y
  // Cal.com de verdad) es prometer «agendo yo» sin con que — el «Listo, agendado» que la auditoria
  // del 2-oct midio en produccion. El motor lee `agenda.modo` y deriva a la persona.
  const agenda = agendaDelEntorno(process.env);
  const delTurno = Array.isArray(input.slots) && input.slots.length ? input.slots : null;
  if (agenda.modo === "persona") {
    overrides.agenda = { modo: "persona" };
  } else if (delTurno) {
    // Tampoco esta rama parsea por su cuenta. Tenia la MISMA copia que la de abajo —`slice(0, 2)`
    // y `pending: false` fijo— y sin `slotsElegibles`: los candidatos 3 a 5 que trajera un turno
    // volvian a ser inalcanzables y un horario ya caducado se ofrecia como vivo. Hoy nadie la
    // despierta (en produccion manda ONIA_BOT_SLOTS, y Cal.com no existe en el VPS por decision,
    // tablero `t_b18ca430`), y por eso se cierra ahora: un bug dormido vuelve MUDO y en verde.
    // La letra sale de la POSICION, igual que en la otra rama: el par se reordena cronologicamente
    // al juzgarlo, asi que una "A" que venga en el payload puede terminar nombrando otro horario.
    const { slots, slotsElegibles: elegibles } = slotsDeCandidatos(candidatosDeLista(delTurno, relojDelTurno(input)));
    overrides.slots = slots;
    overrides.slotsElegibles = elegibles;
  } else {
    // El spec del entorno lo parsea `config.mjs`, NO este archivo. Tenia su propia copia —
    // `slice(0, 2)` con `pending: false` fijo— y eso costaba dos cosas a la vez: el bot vivo
    // ofrecia un horario ya caducado como si estuviera bueno (la regla de anticipacion vivia
    // solo en `parseSlotsSpec`, o sea en el simulador), y los candidatos 3 a 5 que el cron deja
    // LIBRES eran inalcanzables, asi que quien los nombraba terminaba en la cola humana —
    // medido el 2026-09-24: 43 conversaciones, 18 paradas en `esperando_horario`. (El CERO de
    // `calendar_event_id` NO es evidencia de esto: no hay Cal.com en el VPS por decision,
    // tablero `t_b18ca430`.) Dos parseos del mismo dato es un instrumento que no mide lo que corre.
    const raw = String(process.env.ONIA_BOT_SLOTS || "").trim();
    if (raw) {
      const now = relojDelTurno(input);
      overrides.slots = parseSlotsSpec(raw, { now });
      overrides.slotsElegibles = slotsElegibles(raw, { now });
    }
  }
  return withKnowledge(Object.keys(overrides).length ? createBotConfig(overrides) : DEFAULT_CONFIG, knowledgeOptions(input));
}

/**
 * El "ahora" con el que se juzga un horario es el del MENSAJE, no el de la maquina: es el mismo
 * instante con el que `handleHorario` re-mide la eleccion (`msg.receivedAt`). Sin fecha legible en
 * el turno se cae al reloj, que es lo unico que queda.
 */
function relojDelTurno(input) {
  const iso = input?.received_at || input?.receivedAt || null;
  const t = iso ? Date.parse(iso) : NaN;
  return Number.isFinite(t) ? t : Date.now();
}

/**
 * Config REAL de producción: como buildConfig(), pero si nadie fijó horarios a mano (ni el
 * turno trae `slots`, ni ONIA_BOT_SLOTS) intenta traer disponibilidad real de Cal.com ANTES de
 * caer al placeholder DEMO_SLOTS (spec §9.1). Sólo la usa runTurn() cuando no le inyectan
 * `deps.config` (o sea: producción real, nunca los tests — todos inyectan config explícito).
 * Tolerante por contrato: si Cal.com no responde, se queda con buildConfig(input) tal cual.
 */
export async function resolveConfig(input, deps = {}) {
  // El turno de un inbox de cliente con la cache FRIA espera UNA lectura acotada (5 s max)
  // antes de armar la config: sin esto el primer mensaje saldria con la cara de Onia (el
  // fallback archivo/codigo) y recien el segundo con la del cliente. Cache caliente = cero
  // red, el patron sincronico + refresh en background de siempre (ver ensureKnowledge).
  const kOpts = knowledgeOptions(input);
  if (kOpts.inboxId) await ensureKnowledge({ ...kOpts, ...(deps.knowledge || {}) });

  const config = buildConfig(input);
  // Modo recepcionista (org cliente): no hay demo de Onia que agendar — Cal.com no se consulta.
  if (config.modo === "recepcionista") return config;
  // Sin agenda propia tampoco: preguntarle disponibilidad a un Cal.com que no va a reservar es
  // gastar el tope de red del turno para ofrecer algo que el bot no puede cumplir.
  if (config.agenda?.modo === "persona") return config;
  const explicitSlots = Array.isArray(input.slots) && input.slots.length > 0;
  const envSlots = Boolean(String(process.env.ONIA_BOT_SLOTS || "").trim());
  if (explicitSlots || envSlots) return config; // horario ya fijado a mano: no se pisa

  const getSlots = typeof deps.getAvailableSlots === "function" ? deps.getAvailableSlots : getAvailableSlotsFromCalcom;
  const live = await getSlots({ nowIso: input.received_at || input.receivedAt }, deps);
  if (!live || !Array.isArray(live.slots) || live.slots.length === 0) return config;
  return withKnowledge(createBotConfig({ slots: live.slots, dryRun: config.dryRun }), kOpts);
}

// ---------------------------------------------------------------------------
// LLM (unica rama off-guion). Corre en LiteLLM, ya desplegado. Si no hay key: texto seguro.
// ---------------------------------------------------------------------------

// Exportado a proposito: los evals (evals/evals.test.mjs) miden el costo en tokens
// de ESTE prompt. Si se vuelve a inlinear, el archivo de evals deja de importar y
// sus 20 casos dejan de correr en silencio (paso en d334d776, al sincronizar el espejo).
export const LLM_SYSTEM_PROMPT = [
  "Sos el asistente automático de una agencia boliviana. Hablás en voseo boliviano, informal y corto.",
  "Tu ÚNICA tarea es reformular la pregunta pendiente del embudo para que el prospecto la entienda.",
  "PROHIBIDO: dar precios, planes, features, cifras, plazos, casos de clientes o inventar datos.",
  "PROHIBIDO: prometer cualquier cosa. Máximo 2 frases. Nada de markdown.",
].join(" ");

async function askLiteLLM(request) {
  const base = process.env.LITELLM_BASE || "http://onia_selfhosted-litellm-1:4000/v1";
  const key = process.env.LITELLM_KEY || "";
  const model = process.env.ONIA_BOT_MODEL || "gpt-4o-mini";
  if (!key) return "";
  const system = LLM_SYSTEM_PROMPT;
  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 160,
        messages: [
          { role: "system", content: system },
          { role: "user", content: JSON.stringify(request) },
        ],
      }),
      signal: AbortSignal.timeout ? AbortSignal.timeout(20000) : undefined,
    });
    if (!res.ok) return "";
    const data = await res.json();
    return String(data?.choices?.[0]?.message?.content || "").trim();
  } catch {
    return "";
  }
}

// ---------------------------------------------------------------------------
// Turno
// ---------------------------------------------------------------------------

export function seedFrom(input) {
  const channel = String(input.channel || "sim");
  const contactRef = String(input.contact_ref ?? input.contactRef ?? "sin-contacto");
  return {
    conversationKey: input.conversation_key || input.conversationKey || `${channel}:${contactRef}`,
    channel,
    contactRef,
    publicContact: input.public_contact || input.publicContact || null,
    displayName: input.display_name || input.displayName || null,
    pieceKey: input.piece_key || input.pieceKey || null,
    sourceCampaign: input.source_campaign || input.sourceCampaign || null,
    inboxId: String(input.inbox_id ?? input.inboxId ?? "").trim() || null,
    // El MEDIO, aparte del inbox: de acá sale `{{via_humano}}`. Sin dato el motor cae en la
    // forma canal-agnóstica, que es cierta en todos los canales.
    channelType: String(input.channel_type ?? input.channelType ?? "").trim() || null,
    ownerRoleKey: input.owner_role_key || "sergio",
  };
}

/**
 * Rellena con lo que trae el canal SOLO los campos que la fila guardada tiene vacios.
 *
 * `ensureConversation()` escribe estos datos UNA vez, al crear la fila con el primer mensaje. Si el
 * telefono o la atribucion recien aparecen en el segundo webhook, el estado cargado de la base los
 * pisa con null y no se guardan NUNCA (los siguientes turnos ya encuentran la fila creada). Se
 * rellena y no se sobrescribe a proposito: un dato ya guardado gana, asi un turno posterior sin
 * atribucion no borra la que trajo el primero.
 */
function fillFromSeed(state, seed) {
  const patch = {};
  if (!state.publicContact && seed.publicContact) patch.publicContact = seed.publicContact;
  if (!state.pieceKey && seed.pieceKey) patch.pieceKey = seed.pieceKey;
  if (!state.sourceCampaign && seed.sourceCampaign) patch.sourceCampaign = seed.sourceCampaign;
  if (!state.inboxId && seed.inboxId) patch.inboxId = seed.inboxId;
  return Object.keys(patch).length ? { ...state, ...patch } : state;
}

export function incomingFrom(input, nowIso) {
  const kind = ["text", "voice", "attachment"].includes(input.kind) ? input.kind : "text";
  const externalMessageId = input.message_key || input.messageKey || input.external_message_id || null;
  return {
    kind,
    text: String(input.text ?? ""),
    transcript: typeof input.transcript === "string" ? input.transcript : "",
    imageDescription: typeof input.image_description === "string" ? input.image_description
      : typeof input.imageDescription === "string" ? input.imageDescription : "",
    imageReceipt: input.image_receipt && typeof input.image_receipt === "object" ? input.image_receipt
      : input.imageReceipt && typeof input.imageReceipt === "object" ? input.imageReceipt : null,
    externalMessageId,
    receivedAt: input.received_at || input.receivedAt || nowIso,
    // El traspaso (un humano NUESTRO contesta desde la bandeja) entra al motor como "human":
    // sin esto, un humano escribiendo en una conversacion vencida (>N dias) disparaba el
    // reinicio de la Barrera 0 y el bot le mandaba la bienvenida ENCIMA al humano.
    author: input.human_takeover === true ? "human" : "contact",
  };
}

/** Una reply pendiente de LLM sin LiteLLM disponible cae al texto seguro (nunca sale el marcador). */
function resolvePendingReply(reply) {
  if (!reply.pending) return reply;
  return {
    ...reply,
    pending: false,
    templateKey: "safe_reply",
    replySource: "script",
    text: reply.fallbackText || "",
  };
}

/** Respuesta cuando el mensaje ya se habia procesado (reentrega del canal). */
function duplicateResponse(state, stageBefore, warnings) {
  return {
    ok: true,
    duplicate: true,
    conversationKey: state.conversationKey,
    channel: state.channel,
    contactRef: state.contactRef,
    stageBefore,
    stageAfter: state.botStage,
    send: [],
    notify: [],
    calendar: [],
    notes: ["mensaje_ya_procesado"],
    warnings,
  };
}

function buildResponse({ state, stageBefore, config, replies, result, applied, saved, wrote, warnings, extraNotify }) {
  const deferred = applied.deferred || [];
  return {
    ok: true,
    duplicate: false,
    conversationKey: state.conversationKey,
    channel: state.channel,
    contactRef: state.contactRef,
    stageBefore,
    stageAfter: state.botStage,
    humanTookOver: state.humanTookOver,
    // ¿Esta conversacion somos NOSOTROS? Se decide ACA porque este es el unico punto de la
    // cadena que tiene el estado completo (`displayName`, `publicContact`), y viaja como
    // BOOLEANO —no el telefono— porque `n8n-event.mjs` se arma de este mismo resultado y manda
    // analitica fuera del sistema. Lo consume el aviso a Sergio Urcullo (`aviso-telegram.mjs`),
    // que sin esto no puede distinguir una sonda de la primera demo real del negocio.
    esNuestra: esConversacionNuestra(state),
    dryRun: Boolean(config.dryRun),
    send: replies.map((reply) => ({
      text: reply.text,
      // La clave de SU fila en bot_messages: el adapter la usa para cerrar el
      // circuito (markMessageDelivered) despues del POST real. Sin esto, un
      // rechazo de Chatwoot dejaba la fila mintiendo "sent" para siempre.
      messageKey: reply.messageKey,
      templateKey: reply.templateKey,
      replySource: reply.replySource,
      deliveryStatus: reply.deliveryStatus,
      guardrailOk: reply.guardrail ? reply.guardrail.ok !== false : true,
      // Botones (input_select): el adapter de Chatwoot los postea; los demas canales los ignoran.
      ...(reply.options ? { options: reply.options } : {}),
    })),
    // Los del MOTOR primero y los del EJECUTOR despues, y el orden es la garantia: el ejecutor
    // solo agrega avisos que CORRIGEN algo que el motor ya afirmo (hoy: la reserva que no salio),
    // y `construirAviso` pega las lineas en este orden. Al reves, Sergio Urcullo lee la version
    // optimista primero.
    notify: [
      ...deferred.filter((effect) => effect.type === "notify_sergio").map((effect) => effect.payload),
      ...(Array.isArray(extraNotify) ? extraNotify : []),
    ],
    calendar: deferred.filter((effect) => effect.type === "calendar_event").map((effect) => effect.payload),
    leadKey: state.leadKey || null,
    reviewKeys: applied.reviewKeys || [],
    persisted: { conversation: Boolean(saved), outboundRows: wrote, failedEffects: applied.failed || [] },
    qualification: state.qualification || {},
    notes: result.notes,
    warnings,
  };
}

/**
 * Guarda el estado — pero SOLO si este turno pudo LEERLO.
 *
 * `saveConversation` escribe la fila ENTERA: `human_took_over`, `opt_out_at`, `scheduled_at`,
 * `calendar_event_id`, `followup_step`. Cuando la base no contestó la lectura, el turno corre con
 * `createState(seed)` —todos los candados en su valor de fábrica— y escribir eso no es "guardar el
 * turno": es DESARMAR lo que otro escribió bien. Un parpadeo de la base de un segundo dejaba al
 * bot hablando encima del humano que ya estaba atendiendo (barrera 1) y le devolvía la palabra a
 * quien había dicho BAJA (opt-out), sin que nada se pusiera rojo.
 *
 * Medido el 2026-09-18 en producción: de las 15 conversaciones con un traspaso humano registrado
 * en `bot_messages`, TRES tenían `bot_conversations.human_took_over = f` — el candado que el
 * traspaso tenía que dejar puesto (`chatwoot:11`, `chatwoot:39`, `chatwoot:58`).
 *
 * Lo que NO cambia: el bot contesta igual con el estado en memoria. Contestar a ciegas se corrige
 * solo en el turno siguiente; escribir a ciegas no se deshace.
 *
 * `leido` es la fila TAL COMO VINO DE LA BASE al empezar este turno, y viaja hasta el PATCH: en
 * el medio corre `step()` con su llamada al LLM, así que otro escritor puede haber subido un
 * candado mientras tanto. Con `leido`, `saveConversation` omite las columnas que ESTE turno no
 * cambió y deja vivo lo que el otro escribió. Sin él, escribe la fila entera y las pisa.
 */
async function guardarEstado(store, estado, estadoEnMemoria, leido) {
  // Baranda: acá `leido` NO puede faltar. `estadoEnMemoria` es `!loaded`, así que si vamos a
  // escribir es porque la base contestó y `loaded` es un objeto. Un llamador que se lo olvide
  // —o que lo calle con `null` para que compile— devuelve el pisotone entero en silencio, y
  // .mjs no tiene compilador que lo persiga: la única baranda es que reviente acá. Tira, no
  // avisa: un warning más en `store.warnings` no lo lee nadie.
  if (!estadoEnMemoria && !leido) {
    throw new Error("guardarEstado sin el estado LEÍDO: escribir la fila entera pisa los candados (ver saveConversation)");
  }
  if (!estadoEnMemoria) return store.saveConversation(estado, {}, leido);
  if (store.enabled) {
    store.warnings.push("estado NO guardado: la conversación no se pudo leer y escribirla pisaría los candados");
  }
  return null;
}

/**
 * Corre UN turno completo.
 * @param {object} input   payload del canal (ver cabecera)
 * @param {object} [deps]  { store, llm, nowIso } — inyectables para test
 */
export async function runTurn(input, deps = {}) {
  const nowIso = deps.nowIso || new Date().toISOString();
  const config = deps.config || (await resolveConfig(input, deps));
  const seed = seedFrom(input);
  const store = deps.store || createStore();
  const llm = typeof deps.llm === "function" ? deps.llm : askLiteLLM;

  // 1. Estado: base primero, memoria si la base no contesta (el bot NO se queda mudo).
  const loaded = await store.ensureConversation(seed);
  // `null` quiere decir UNA sola cosa (ver loadConversation): la base no contestó. Una
  // conversación que todavía no existe vuelve creada, no nula. Así que de acá en adelante
  // `estadoEnMemoria` es "lo que sigue es un estado INVENTADO", no "una conversación nueva".
  const estadoEnMemoria = !loaded;
  let state = fillFromSeed(loaded || createState(seed), seed);
  if (estadoEnMemoria && store.enabled) store.warnings.push("estado en memoria: la conversación no se pudo cargar");
  if (input.human_takeover === true && !state.humanTookOver) state = markHumanTakeover(state, nowIso);
  // CADA mensaje del humano refresca lastOutboundAt (el traspaso se guarda como outbound
  // nuestro): es la marca con la que conversacionVencida decide si nuestro lado esta vivo.
  // Sin esto, un humano chateando hace un mes con humanTookOverAt viejo contaria como
  // conversacion muerta y el proximo mensaje del prospecto reiniciaria el guion en plena charla.
  if (input.human_takeover === true) {
    state = { ...state, lastOutboundAt: input.received_at || input.receivedAt || nowIso };
  }

  // El DESARME (conversacion resuelta desde la bandeja): limpiar el candado,
  // guardar y salir. No es un mensaje — no corre step, no crea filas, no manda.
  if (input.human_takeover_clear === true) {
    const limpio = clearHumanTakeover(state);
    const saved = await guardarEstado(store, limpio, estadoEnMemoria, loaded);
    return {
      ok: true,
      duplicate: false,
      conversationKey: limpio.conversationKey,
      channel: limpio.channel,
      contactRef: limpio.contactRef,
      stageBefore: state.botStage,
      stageAfter: limpio.botStage,
      send: [],
      notify: [],
      calendar: [],
      notes: ["takeover_desarmado"],
      saved,
      warnings: store.warnings,
    };
  }

  // 2. step() es PURO: correrlo dos veces (con y sin LLM) no tiene efecto de red.
  const incoming = incomingFrom(input, nowIso);
  const stageBefore = state.botStage;
  let result = step(state, incoming, { config });

  // 3-4. Dedup: si el inbound ya estaba, el turno YA se proceso. Cortar antes de tocar nada.
  //
  // EL TRASPASO NO ES UN ENTRANTE. Cuando un humano NUESTRO contesta desde Chatwoot, esta fila es
  // lo UNICO que queda de ese envio — y Meta lo cobra igual que cualquier otro saliente. Guardada
  // como `inbound` quedaba fuera del medidor (usage-run.mjs filtra `direction = 'outbound'`): se
  // media al bot y no a la bandeja, o sea media bolsa del plan sin facturar. Y encima con
  // `author = 'contact'`: dos mensajes NUESTROS atribuidos al prospecto — verificado en la base del
  // VPS el 2026-08-13 (mensajes 30 y 31, las dos unicas plantillas reales que existieron).
  //
  // Lo que NO cambia: el `message_key`. Es el candado que evita que el bot conteste encima del
  // humano, y sigue siendo el mismo. Tampoco el `delivery_status`, que claimInbound fija en `sent`:
  // eso es lo que sabemos (Chatwoot acepto el POST) y ni una letra mas — el veredicto de Meta llega
  // por un webhook asincrono que Chatwoot no nos reenvia.
  const traspaso = input.human_takeover === true;
  const templateName = String(input.template_name ?? input.templateName ?? "").trim();
  const claimed = await store.claimInbound(
    traspaso ? { ...result.inbound, direction: "outbound", author: "human", replySource: "human" } : result.inbound,
    state,
    {
      externalMessageId: incoming.externalMessageId,
      raw: {
        kind: incoming.kind,
        receivedAt: incoming.receivedAt,
        // El nombre de la plantilla de Meta tal cual vino en el webhook. El medidor lo resuelve
        // contra su registro (utility vs marketing, 6,5x de diferencia); una plantilla que nadie
        // registro cae en `plantilla_sin_tarifa` y se ve, en vez de colarse barata como servicio.
        ...(templateName ? { templateName } : {}),
      },
    },
  );
  if (claimed === false) return duplicateResponse(state, stageBefore, store.warnings);
  if (claimed === null && store.enabled) store.warnings.push("sin dedup: el inbound no se pudo registrar");

  // 5. LLM solo si el motor marco la rama off-guion como pendiente.
  const pending = result.replies.find((reply) => reply.pending);
  if (pending) {
    const text = await llm(pending.llmRequest);
    if (text) result = step(state, incoming, { config, llm: () => text });
  }
  const replies = result.replies.map(resolvePendingReply).filter((reply) => reply.text !== LLM_PENDING);

  // 6. Efectos de base. El lead se crea ACA y su clave vuelve a la conversacion.
  let nextState = result.nextState;
  const applied = await store.applySideEffects(result.sideEffects, nextState, nextState.outboundSeq);
  if (applied.leadKey) nextState = { ...nextState, leadKey: applied.leadKey };

  // 6.5. LA RESERVA DE VERDAD. Hasta hoy el bot decia "Listo, agendado" y no reservaba nada:
  // `calendar_event_id` quedaba en null, dos prospectos podian quedarse con el mismo horario y
  // la demo no aparecia en el calendario de Sergio. Va DESPUES del motor (que es puro y no hace
  // I/O) y ANTES de guardar, para que el uid quede persistido en el mismo estado.
  const bookingWarnings = [];
  const bookingNotify = [];
  const recienAgendada = stageBefore !== "demo_agendada" && nextState.botStage === "demo_agendada";
  if (recienAgendada && nextState.scheduledAt && !nextState.calendarEventId) {
    if (config.dryRun) {
      // En seco NO se reserva: escribir en el calendario real es un efecto externo, y el sentido
      // del modo seco es que no salga NADA del sistema.
      //
      // Pero "no reservar" NO autoriza a mostrar un texto mas optimista que el que recibe el
      // prospecto (el simulador imprimia "Listo, agendado" pelado, 2026-09-12). `sin_config` se
      // DERIVA del entorno sin tocar la red: ahi el desenlace se sabe y se aplica el MISMO que en
      // vivo (`reservaQueNoSalio`); con Cal.com configurado no se puede saber, y se dice.
      const { motivo } = motivoEnSeco({
        stageBefore,
        stageAfter: nextState.botStage,
        scheduledAt: nextState.scheduledAt,
        calendarEventId: nextState.calendarEventId,
        env: deps.env || process.env,
        duracionMinutos: config.demo?.duracionMinutos,
      });
      if (motivo === "sin_config") {
        nextState = reservaQueNoSalio({ replies, nextState, config, reason: "sin_config" }).nextState;
        bookingWarnings.push(
          "calcom: no se reservo (dry run) — sin CALCOM_BASE_URL tampoco saldria en vivo: el texto es el mismo que el honesto del vivo",
        );
      } else {
        bookingWarnings.push(
          "calcom: no se reservo (dry run) — hay config, asi que el cierre final depende de la reserva y en seco no se puede saber",
        );
      }
    } else {
      const bookFn = typeof deps.createBooking === "function" ? deps.createBooking : createBooking;
      const booking = await bookFn({
        startAt: nextState.scheduledAt,
        // MISMA fuente que el texto que el prospecto acaba de leer ({{demo_duracion}}): si el
        // guion promete una duracion, el calendario bloquea esa. CALCOM_BOT_DURATION_MINUTES
        // sigue ganando si esta definido en el entorno (es el freno de mano del que despliega).
        durationMinutes: config.demo?.duracionMinutos,
        name: nextState.displayName || "Prospecto",
        conversationKey: nextState.conversationKey,
        notes: buildBookingNotes(nextState.qualification || {}),
      }, deps);

      bookingWarnings.push(...(booking.warnings || []));
      if (booking.ok) {
        nextState = { ...nextState, calendarEventId: booking.uid };
        // EL LINK VA ACA, en el mismo mensaje que confirma la reserva. Es el UNICO momento
        // garantizado dentro de la ventana de servicio de 24 h de Meta: el prospecto acaba de
        // escribir. Dejarlo para el dia de la demo (M9) fallaria con 131047 en todo el que
        // reserva para dentro de 3 dias, y es exactamente lo que M2 prometia sin cumplir.
        const link = meetingLink(booking.uid, deps.env || process.env);
        const ultima = replies[replies.length - 1];
        if (link && ultima && ultima.text) {
          ultima.text += `\n\n${renderTemplate(config.script.M2_LINK, { link_reunion: link })}`;
        }
      } else {
        // La reserva NO salio: el «Listo, agendado» que el motor ya redacto se REEMPLAZA por la
        // version honesta y la conversacion pasa a la persona (`reservaQueNoSalio`). Hasta el 2-oct
        // se le PEGABA una salvedad al final y el prospecto leia la confirmacion y su desmentida en
        // el mismo mensaje (auditoria de produccion del 2-oct, §2 accion 3).
        nextState = reservaQueNoSalio({ replies, nextState, config, reason: booking.reason }).nextState;
        bookingWarnings.push(`calcom: la demo NO quedo reservada (${booking.reason})`);
        // Y el aviso que DESDICE al "DEMO AGENDADA — anotala" que el motor emitio en este mismo
        // turno: va DESPUES para que la correccion se lea ultima.
        bookingNotify.push(avisoDeReservaFallida({
          conversationKey: nextState.conversationKey,
          reason: booking.reason,
          scheduledLabel: nextState.scheduledLabel,
          scheduledAt: nextState.scheduledAt,
        }));
      }
    }
  }

  // 7. Bitacora + estado.
  const saved = await guardarEstado(store, nextState, estadoEnMemoria, loaded);
  const wrote = await store.insertOutbound(replies, nextState, { raw: { notes: result.notes } });

  return buildResponse({
    state: nextState,
    stageBefore,
    config,
    replies,
    result,
    applied,
    saved,
    wrote,
    warnings: [...store.warnings, ...bookingWarnings],
    extraNotify: bookingNotify,
  });
}

// ---------------------------------------------------------------------------
// main — solo cuando se ejecuta como binario, no cuando lo importa un test
// ---------------------------------------------------------------------------

export async function main() {
  try {
    const input = parseInput(await readStdin());
    process.stdout.write(`${JSON.stringify(await runTurn(input))}\n`);
  } catch (error) {
    // Falla hacia el silencio: ok=false y send vacio. n8n no manda nada y avisa.
    process.stdout.write(
      `${JSON.stringify({ ok: false, duplicate: false, send: [], notify: [], calendar: [], error: String(error?.message || error).slice(0, 300) })}\n`,
    );
  }
}

const invokedDirectly = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) main();
