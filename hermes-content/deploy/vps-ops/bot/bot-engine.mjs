// ONIA — Chatbot propio (el que atiende "DEMO"): MOTOR CONVERSACIONAL.
// Funcion pura: step(state, mensaje) -> { nextState, replies[], sideEffects[] }.
// NO toca la base, NO manda mensajes, NO llama al LLM por su cuenta: devuelve QUE hay que hacer.
// El ejecutor (n8n en fase 2, simulate.mjs hoy) es el que persiste y envia.
//
// DETERMINISTA POR CONTRATO: cero Date.now(), cero Math.random(). El tiempo entra por
// `message.receivedAt` (ISO). Mismo estado + mismo mensaje = misma salida, siempre.
//
// El 85-90% de las respuestas son texto fijo de config.script (no pueden alucinar). El LLM
// aparece en UNA sola rama ("no entendi") y su texto pasa por enforceGuardrails().
//
// Spec: hermes-content/docs/ONIA_CHATBOT_PROPIO_SPEC_20260725.md (§2 guion, §3 reglas, §5.2 pipeline)

import {
  DEFAULT_CONFIG,
  branchFor,
  renderTemplate,
  joinEs,
  isOutsideBusinessHours,
  slotsPending,
} from "./config.mjs";
import { enforceGuardrails, normalize, SAFE_REPLY } from "./guardrails.mjs";
import * as intents from "./intents.mjs";

export const STAGES = Object.freeze([
  "nuevo",
  "esperando_calificacion",
  "calificado",
  "esperando_horario",
  "demo_agendada",
  "demo_realizada",
  "handoff_humano",
  "descartado",
  "opt_out",
]);

/** Marcador que devuelve la rama LLM cuando no se le inyecta un cliente de LLM. */
export const LLM_PENDING = "[[LLM_PENDIENTE]]";

/**
 * Estados donde lo unico pendiente es que el prospecto elija uno de los dos horarios.
 * `esperando_calificacion` y `calificado` son del guion VIEJO (las 3 preguntas iban antes de los
 * horarios): siguen en la lista porque hay conversaciones vivas en la base con ese estado.
 */
const ESPERA_HORARIO_STAGES = Object.freeze(["esperando_calificacion", "calificado", "esperando_horario"]);

/** Estados del embudo en los que se leen datos de calificacion del mensaje entrante. */
const INTAKE_STAGES = Object.freeze(["nuevo", ...ESPERA_HORARIO_STAGES, "demo_agendada"]);

/** Estados en los que un mensaje puede descartar al prospecto (en 'nuevo' manda el disclosure). */
const DESCARTABLE_STAGES = Object.freeze([...ESPERA_HORARIO_STAGES, "demo_agendada"]);

// ---------------------------------------------------------------------------
// Estado
// ---------------------------------------------------------------------------

/** Estado inicial de una conversacion. Espejo 1:1 de onia_center.bot_conversations. */
export function createState(input = {}) {
  const channel = input.channel || "sim";
  const contactRef = String(input.contactRef || "sin-contacto");
  return {
    conversationKey: input.conversationKey || `${channel}:${contactRef}`,
    channel,
    contactRef,
    displayName: input.displayName || null,
    botStage: input.botStage || "nuevo",
    pieceKey: input.pieceKey || null,
    sourceCampaign: input.sourceCampaign || null,
    qualification: { ...(input.qualification || {}) },
    slotsOffered: [...(input.slotsOffered || [])],
    scheduledAt: input.scheduledAt || null,
    scheduledLabel: input.scheduledLabel || null,
    calendarEventId: input.calendarEventId || null,
    leadKey: input.leadKey || null,
    ownerRoleKey: input.ownerRoleKey || "sergio",
    humanTookOver: Boolean(input.humanTookOver),
    humanTookOverAt: input.humanTookOverAt || null,
    optInAt: input.optInAt || null,
    optInSource: input.optInSource || null,
    optOutAt: input.optOutAt || null,
    followupStep: Number.isInteger(input.followupStep) ? input.followupStep : 0,
    offScriptCount: Number.isInteger(input.offScriptCount) ? input.offScriptCount : 0,
    qualifyAsks: Number.isInteger(input.qualifyAsks) ? input.qualifyAsks : 0,
    // La pregunta EXTRA del rubro se hace UNA sola vez y no bloquea: si el prospecto no la
    // contesta, igual se le ofrecen los horarios. Perder una demo por un dato opcional seria
    // cambiar una reunion por un campo del CRM.
    branchAsked: Boolean(input.branchAsked),
    outboundSeq: Number.isInteger(input.outboundSeq) ? input.outboundSeq : 0,
    lastInboundAt: input.lastInboundAt || null,
    lastOutboundAt: input.lastOutboundAt || null,
  };
}

/**
 * Un humano contesto en esta conversacion => el bot se calla PARA SIEMPRE.
 * Nunca vuelve solo a false: solo Sergio puede devolverla al bot desde el panel (spec §3.2).
 */
export function markHumanTakeover(state, atIso = null) {
  return { ...state, humanTookOver: true, humanTookOverAt: atIso || state.humanTookOverAt };
}

/** Fila lista para onia_center.bot_conversations. */
export function toConversationRow(state) {
  return {
    conversation_key: state.conversationKey,
    channel: state.channel,
    contact_ref: state.contactRef,
    display_name: state.displayName,
    bot_stage: state.botStage,
    piece_key: state.pieceKey,
    source_campaign: state.sourceCampaign,
    qualification: state.qualification,
    slots_offered: state.slotsOffered,
    scheduled_at: state.scheduledAt,
    calendar_event_id: state.calendarEventId,
    lead_key: state.leadKey,
    owner_role_key: state.ownerRoleKey,
    human_took_over: state.humanTookOver,
    human_took_over_at: state.humanTookOverAt,
    opt_in_at: state.optInAt,
    opt_in_source: state.optInSource,
    opt_out_at: state.optOutAt,
    followup_step: state.followupStep,
    off_script_count: state.offScriptCount,
    last_inbound_at: state.lastInboundAt,
    last_outbound_at: state.lastOutboundAt,
    // Contadores del motor que no tienen columna propia (la spec los deja "aparte").
    raw: {
      qualifyAsks: state.qualifyAsks,
      outboundSeq: state.outboundSeq,
      scheduledLabel: state.scheduledLabel,
      branchAsked: state.branchAsked,
    },
  };
}

// ---------------------------------------------------------------------------
// Helpers internos
// ---------------------------------------------------------------------------

function readIncoming(incoming) {
  const raw = incoming || {};
  const kind = raw.kind || "text";
  const transcript = typeof raw.transcript === "string" ? raw.transcript : "";
  const text = kind === "voice" ? transcript : String(raw.text ?? "");
  return {
    kind,
    text,
    norm: normalize(text),
    hasText: text.trim().length > 0,
    externalMessageId: raw.externalMessageId || null,
    receivedAt: raw.receivedAt || null,
    author: raw.author || "contact",
  };
}

function slotLabel(slots, key) {
  const slot = (slots || []).find((item) => item.key === key);
  return slot ? slot.label : "";
}

function activeSlots(state, config) {
  return state.slotsOffered && state.slotsOffered.length ? state.slotsOffered : config.slots;
}

function varsFor(state, config, extra = {}) {
  const q = state.qualification || {};
  const slots = activeSlots(state, config);
  const label = state.scheduledLabel || "";
  const branch = branchFor(q.industry, config);
  return {
    humano: config.identity.humanName,
    producto: config.identity.productName,
    bot: config.identity.botName,
    slot_a: slotLabel(slots, "A"),
    slot_b: slotLabel(slots, "B"),
    rubro: intents.industryLabel(q.industry) || "",
    personas: q.teamSize ?? "",
    persona_palabra: q.teamSize === 1 ? "persona" : "personas",
    // Se nombra el modulo del rubro SOLO si ese rubro tiene uno de verdad. Para el resto queda
    // vacio: nombrar un modulo que no existe es prometer una feature (N2) con otro disfraz.
    nota_modulo: (branch && branch.moduleNote) || "",
    sillones: q.chairs ?? "",
    sillon_palabra: q.chairs === 1 ? "sillón" : "sillones",
    dia_hora_elegida: label,
    dia: label ? label.split(/\s+/)[0] : "",
    preguntas: askList(state, config),
    ...extra,
  };
}

/** 1️⃣ 2️⃣ 3️⃣ 4️⃣ — la lista de M2 nunca pasa de 4 items (3 datos + el dolor). */
const VINETAS = Object.freeze(["1️⃣", "2️⃣", "3️⃣", "4️⃣"]);

/**
 * Las preguntas que M2 pone sobre la mesa DESPUES de reservar: los datos que todavia faltan
 * (nunca los que el prospecto ya dio) y, siempre al final, la del dolor.
 * Las preguntas se DERIVAN del `missLabel` de cada campo: asi el guion no puede desincronizarse
 * de la config, y el banco (que busca ese mismo texto) mide lo que el bot realmente pregunto.
 */
function askList(state, config) {
  const items = missingFields(state.qualification || {}, config).map(
    (field) => `¿${field.missLabel.charAt(0).toUpperCase()}${field.missLabel.slice(1)}?`,
  );
  items.push(config.script.M2_PREGUNTA_DOLOR);
  return items.map((item, index) => `${VINETAS[index] || "•"} ${item}`).join("\n");
}

function say(templateKey, state, config, extraVars = {}) {
  const text = renderTemplate(config.script[templateKey], varsFor(state, config, extraVars));
  return { templateKey, replySource: "script", text };
}

function missingFields(qualification, config) {
  return config.qualification.fields.filter((field) => {
    const value = qualification[field.key];
    return value === undefined || value === null || value === "";
  });
}

/** Como se lee el dolor cuando el bot lo repite en voz alta ("anotado ... que lo que más te come"). */
const DOLOR_LABEL = Object.freeze({
  agenda: "la agenda",
  cobros: "los cobros",
  clientes: "los clientes que no vuelven",
});

function capturedLabels(qualification) {
  const labels = [];
  if (qualification.industry) {
    const label = intents.industryLabel(qualification.industry);
    labels.push(label ? `que te dedicás a ${label}` : "a qué te dedicás");
  }
  if (qualification.teamSize) {
    labels.push(qualification.teamSize === 1 ? "que trabajás por tu cuenta" : `que son ${qualification.teamSize} personas`);
  }
  if (qualification.city) labels.push(`que estás en ${qualification.city}`);
  if (qualification.chairs) {
    labels.push(`que tenés ${qualification.chairs} ${qualification.chairs === 1 ? "sillón" : "sillones"}`);
  }
  if (DOLOR_LABEL[qualification.painPoint]) {
    labels.push(`que lo que más tiempo te come es ${DOLOR_LABEL[qualification.painPoint]}`);
  }
  return labels;
}

/**
 * La pregunta EXTRA que este rubro todavia debe, o null.
 * Se pregunta una sola vez (`branchAsked`): si el prospecto no la contesta, el embudo sigue.
 */
function pendingBranch(state, config) {
  if (state.branchAsked) return null;
  const branch = branchFor((state.qualification || {}).industry, config);
  if (!branch) return null;
  const value = (state.qualification || {})[branch.field.key];
  return value === undefined || value === null || value === "" ? branch : null;
}

/** La pregunta pendiente del estado actual: con esto una respuesta off-guion vuelve al embudo. */
function pendingAsk(state, config) {
  // Antes de reservar lo unico pendiente es elegir horario: los datos ya no se piden aca.
  if (ESPERA_HORARIO_STAGES.includes(state.botStage)) return say("PENDING_HORARIO", state, config).text;
  if (state.botStage === "demo_agendada") {
    const missing = missingFields(state.qualification, config);
    if (missing.length > 0) {
      return say("PENDING_CALIFICACION", state, config, {
        dato_faltante: joinEs(missing.map((field) => field.missLabel)),
      }).text;
    }
    const branch = pendingBranch(state, config);
    if (branch) return say(branch.askKey, state, config).text;
    return say("PENDING_AGENDADA", state, config).text;
  }
  return null;
}

function stageEffect(prev, next, reason) {
  return {
    type: "stage_change",
    payload: { from: prev.botStage, to: next.botStage, reason, conversationKey: next.conversationKey },
  };
}

function auditEffect(prev, next, reason) {
  return {
    type: "audit_log",
    payload: {
      action: "bot_stage_change",
      conversationKey: next.conversationKey,
      detail: { from: prev.botStage, to: next.botStage, reason },
    },
  };
}

function summarize(state, msg, reason) {
  const q = state.qualification || {};
  const datos = [
    q.industry ? `rubro: ${intents.industryLabel(q.industry) || "otro"}` : null,
    q.teamSize ? `${q.teamSize} ${q.teamSize === 1 ? "persona" : "personas"}` : null,
    q.city || null,
    q.chairs ? `${q.chairs} sillones` : null,
  ].filter(Boolean);
  return [
    `Conversación ${state.conversationKey} (${state.channel}).`,
    `Motivo: ${reason}.`,
    datos.length ? `Datos: ${datos.join(", ")}.` : "Sin calificar.",
    `Último mensaje del prospecto: "${String(msg.text || "").slice(0, 200)}"`,
  ].join(" ");
}

// ---------------------------------------------------------------------------
// Cierre: M7 fuera de horario, claves de mensaje, estado de entrega
// ---------------------------------------------------------------------------

function finalize(ctx, next, replies, effects = [], notes = []) {
  const { config, msg, prev } = ctx;
  const allNotes = [...notes];
  const out = replies.filter(Boolean);

  // M7 se APENDEA a la ultima respuesta con texto, no la reemplaza (spec §2.2 M7).
  if (out.length && isOutsideBusinessHours(msg.receivedAt, config)) {
    for (let index = out.length - 1; index >= 0; index -= 1) {
      if (out[index].text && !out[index].pending) {
        out[index] = { ...out[index], text: `${out[index].text}\n\n${say("M7", next, config).text}` };
        allNotes.push("fuera_de_horario");
        break;
      }
    }
  }

  // Aviso honesto: si Sergio todavia no definio los 2 horarios, el bot ofrecio un placeholder.
  if (out.length && slotsPending(config)) {
    const labelA = slotLabel(config.slots, "A");
    if (labelA && out.some((reply) => (reply.text || "").includes(labelA))) allNotes.push("slots_sin_definir");
  }

  let seq = next.outboundSeq;
  const stamped = out.map((reply) => {
    seq += 1;
    return {
      messageKey: `out:${next.conversationKey}:${seq}`,
      direction: "outbound",
      author: "bot",
      templateKey: reply.templateKey,
      replySource: reply.replySource || "script",
      text: reply.text || "",
      guardrail: reply.guardrail || { ok: true, violations: [] },
      deliveryStatus: next.channel === "sim" ? "simulated" : config.dryRun ? "skipped" : "sent",
      stageBefore: prev.botStage,
      stageAfter: next.botStage,
      ...(reply.pending ? { pending: true, llmRequest: reply.llmRequest, fallbackText: reply.fallbackText } : {}),
    };
  });

  const nextState = {
    ...next,
    outboundSeq: seq,
    lastOutboundAt: stamped.length ? msg.receivedAt || next.lastOutboundAt : next.lastOutboundAt,
  };

  return {
    nextState,
    replies: stamped,
    sideEffects: effects.filter(Boolean),
    notes: allNotes,
    inbound: {
      messageKey: msg.externalMessageId
        ? `${next.channel}:${msg.externalMessageId}`
        : `in:${next.conversationKey}:${next.lastInboundAt || ""}`,
      direction: "inbound",
      author: msg.author,
      body: msg.text,
      stageBefore: prev.botStage,
      stageAfter: nextState.botStage,
    },
  };
}

// ---------------------------------------------------------------------------
// Ramas compuestas
// ---------------------------------------------------------------------------

/**
 * @param {string} [bodyKey]  el mensaje con el que se anuncia el handoff. Por defecto M5 ("eso lo
 *   ve un humano"); el camino de SOPORTE usa el suyo porque decirle "eso lo ve Sergio en la demo"
 *   a un cliente que pide ayuda es contestarle con el guion de venta.
 */
function handoffResult(ctx, base, reason, leadingReplies = [], bodyKey = "M5") {
  const { config, prev, msg } = ctx;
  const next = { ...base, botStage: "handoff_humano" };
  const summary = summarize(next, msg, reason);
  const effects = [
    stageEffect(prev, next, reason),
    {
      type: "review_queue",
      payload: {
        ...config.handoff.reviewQueue,
        conversationKey: next.conversationKey,
        leadKey: next.leadKey,
        summary,
      },
    },
    { type: "notify_sergio", payload: { kind: "handoff", reason, conversationKey: next.conversationKey, text: summary } },
    auditEffect(prev, next, reason),
  ];
  return finalize(ctx, next, [...leadingReplies, say(bodyKey, next, config)], effects, [`handoff:${reason}`]);
}

/**
 * La bienvenida: disclosure + que es Onia + los 2 horarios, todo en el primer mensaje.
 * El compromiso se pide ANTES que los datos (las 3 preguntas viajan a M2): en el momento de
 * maximo interes se ofrece la reunion, no un formulario.
 * El lead nace aca, con el horario ya sobre la mesa: en el embudo nuevo no hay un momento
 * "calificado" previo a la reunion, y sin esto un prospecto que conversa pero no reserva no
 * aparecería en el panel.
 */
function welcomeResult(ctx, base, { reason = "disparador_demo", notes = ["bienvenida"], after = [] } = {}) {
  const { config, prev, msg } = ctx;
  const next = {
    ...base,
    botStage: "esperando_horario",
    slotsOffered: config.slots.map((slot) => ({ ...slot })),
    optInAt: base.optInAt || msg.receivedAt,
    optInSource: base.optInSource || "inbound_demo",
    offScriptCount: 0,
  };
  const effects = [
    stageEffect(prev, next, reason),
    {
      type: "lead_upsert",
      payload: {
        conversationKey: next.conversationKey,
        pipelineStatus: config.pipelineStatus.calificado,
        ownerRoleKey: next.ownerRoleKey,
        channel: next.channel,
        contactRef: next.contactRef,
        pieceKey: next.pieceKey,
        sourceCampaign: next.sourceCampaign,
        qualification: next.qualification,
        // lead_key lo genera el ejecutor (no es determinista): vuelve para guardarse en la conversacion.
      },
    },
  ];
  return finalize(ctx, next, [say("M0", next, config), ...after], effects, notes);
}

/**
 * Descarte suave: el que escribe claramente NO es un negocio (busca trabajo o nos quiere vender
 * algo). Se evalua en cualquier punto del embudo, tambien DESPUES de reservar: con las 3 preguntas
 * al final, el dato que descarta llega recien con la respuesta a M2.
 */
function descartadoResult(ctx, base) {
  const { config, prev, msg } = ctx;
  const next = { ...base, botStage: "descartado" };
  const effects = [stageEffect(prev, next, "descartado_fuera_de_publico"), auditEffect(prev, next, "descartado")];
  if (next.leadKey) {
    effects.push({
      type: "lead_upsert",
      payload: { leadKey: next.leadKey, pipelineStatus: config.pipelineStatus.descartado, conversationKey: next.conversationKey },
    });
  }
  // Ya habia una demo reservada: Sergio tiene que enterarse para liberar el horario, si no se
  // presenta a una reunion con alguien que no es cliente posible.
  if (base.botStage === "demo_agendada") {
    effects.push({
      type: "notify_sergio",
      payload: {
        kind: "descarte_tras_agendar",
        conversationKey: next.conversationKey,
        text: summarize(next, msg, "descartado despues de agendar la demo"),
      },
    });
  }
  return finalize(ctx, next, [say("M1c", next, config)], effects, ["descartado"]);
}

/** Respuesta off-guion (precio / SIAT / archivo): cuerpo fijo + la pregunta pendiente del embudo. */
function composeWithFunnel(ctx, base, bodyKey, reason) {
  const { config } = ctx;

  // En 'nuevo' el disclosure manda (D2, sin excepción): primero M0 —que ya trae los horarios—,
  // despues el cuerpo. Los datos que vinieran en el mismo mensaje ya quedaron guardados.
  if (base.botStage === "nuevo") {
    return welcomeResult(ctx, base, {
      reason: `${reason}_en_bienvenida`,
      notes: [reason],
      after: [say(bodyKey, base, config)],
    });
  }

  const ask = pendingAsk(base, config);
  const body = say(bodyKey, base, config);
  const text = ask ? `${body.text}\n\n${ask}` : body.text;
  return finalize(ctx, base, [{ ...body, text }], [], [reason]);
}

// ---------------------------------------------------------------------------
// step()
// ---------------------------------------------------------------------------

/**
 * @param {object} state          estado actual (createState o la fila de bot_conversations)
 * @param {object} incoming       { text, kind?, transcript?, externalMessageId?, receivedAt? }
 * @param {object} [options]      { config?, llm? }  llm(request) -> string (texto libre a filtrar)
 * @returns {{nextState: object, replies: object[], sideEffects: object[], notes: string[], inbound: object}}
 */
export function step(state, incoming, options = {}) {
  const config = options.config || DEFAULT_CONFIG;
  const msg = readIncoming(incoming);
  const prev = state;
  const base = { ...state, lastInboundAt: msg.receivedAt || state.lastInboundAt };
  const ctx = { config, prev, msg, options };

  // --- Barrera 1: un humano tomo la conversacion. El bot NO habla. Falla hacia el SILENCIO.
  if (state.humanTookOver) return finalize(ctx, base, [], [], ["silencio:humano_a_cargo"]);

  // --- Barrera 2: opt-out previo. Solo el disparador DEMO puede reabrir (lo dice M6).
  // El opt-out le gana SIEMPRE al disparador: "ya no me mandes mas info" trae la palabra "info"
  // (disparador de demo) pero esta REFORZANDO la baja. Reabrirle el guion es escribirle a quien
  // ya dijo basta dos veces — riesgo de politica de Meta, no un detalle de UX.
  if (state.optOutAt) {
    if (intents.isOptOut(msg.norm) || !intents.isDemoTrigger(msg.norm, config)) {
      return finalize(ctx, base, [], [], ["silencio:opt_out"]);
    }
    const reabierto = {
      ...base,
      optOutAt: null,
      optInAt: msg.receivedAt,
      optInSource: "inbound_demo",
      qualifyAsks: 0,
      qualification: {},
    };
    return welcomeResult(ctx, reabierto, { reason: "reapertura_tras_opt_out", notes: ["reabierto_por_demo"] });
  }

  // --- Audio sin transcripcion: el ejecutor debio transcribir antes (Speaches). Pedimos texto.
  if (msg.kind === "voice" && !msg.hasText) {
    return finalize(ctx, base, [say("M_AUDIO_FAIL", base, config)], [], ["audio_sin_transcripcion"]);
  }

  // --- Imagen / documento: se reconoce y va a humano (el bot no lee archivos).
  if (msg.kind === "attachment" && !msg.hasText) {
    return handoffResult(ctx, base, "archivo_adjunto", [say("M_ATTACH_BODY", base, config)]);
  }

  if (!msg.hasText) return finalize(ctx, base, [], [], ["sin_texto"]);

  // --- La ELECCION DE HORARIO se resuelve antes que nada: esperando el horario, un "2" pelado es
  // la opcion B, no un equipo de 2 personas. Sin este orden el bot inventa el dato con el que
  // despues habla (viola la regla de oro §2.1).
  ctx.slotChoice = base.botStage === "esperando_horario"
    ? intents.detectSlotChoice(msg.norm, activeSlots(base, config))
    : null;

  // --- Captura ANTES de rutear (regla de oro §2.1). Un mensaje real trae las respuestas y una
  // pregunta en la misma linea ("tengo una ferreteria, somos 5, en santa cruz. cuanto sale?").
  // Si la intencion cortara antes, los datos se tiran y el bot los vuelve a pedir: parece que no
  // lee. Los datos se guardan igual; la pregunta se contesta igual.
  const intake = INTAKE_STAGES.includes(base.botStage) && !ctx.slotChoice;
  const found = intake ? intents.parseQualification(msg.norm, base.qualification) : {};
  const withData = Object.keys(found).length
    ? { ...base, qualification: { ...base.qualification, ...found } }
    : base;
  ctx.found = found;

  // --- Router determinista (spec §5.2 paso 9): opt-out > queja > precio > SIAT > clinico > estado.
  if (intents.isOptOut(msg.norm)) {
    const next = { ...withData, botStage: "opt_out", optOutAt: msg.receivedAt };
    return finalize(
      ctx,
      next,
      [say("M6", next, config)],
      [stageEffect(prev, next, "opt_out"), auditEffect(prev, next, "opt_out")],
      ["opt_out"],
    );
  }

  if (intents.isComplaint(msg.norm)) return handoffResult(ctx, withData, "queja_o_desconfianza");

  // SEGUNDO CAMINO — el que escribe ya es cliente / necesita ayuda con el sistema. No es venta:
  // no se le ofrece la demo comercial ni se le contesta con el guion del embudo. Va a un humano
  // con el aviso a Sergio, que es quien puede resolverlo o coordinarle la reunion de ayuda.
  // Va ANTES que precio y SIAT: "ya soy cliente y no me anda la factura" trae las dos palabras.
  if (intents.isSupportRequest(msg.norm)) {
    return handoffResult(ctx, withData, "soporte_cliente", [], "M8_SOPORTE");
  }

  if (intents.isPriceQuestion(msg.norm)) return composeWithFunnel(ctx, withData, "M4_BODY", "pregunta_precio");

  if (intents.isSiatQuestion(msg.norm)) return composeWithFunnel(ctx, withData, "M_SIAT_BODY", "pregunta_siat");

  if (intents.isClinicalOrLegal(msg.norm)) return handoffResult(ctx, withData, "consulta_clinica_o_legal");

  if (intents.isProductDetail(msg.norm)) return handoffResult(ctx, withData, "detalle_tecnico_de_producto");

  // Pidio un humano con todas las letras (N3): el bot no puede contestarlo el mismo.
  if (intents.wantsHuman(msg.norm)) return handoffResult(ctx, withData, "pidio_hablar_con_humano");

  // Descarte suave. Va al final del router (era lo ultimo que se juzgaba en la calificacion) y en
  // 'nuevo' NO se evalua: el primer mensaje siempre es la bienvenida, que es donde el bot se
  // declara bot (D2).
  if (DESCARTABLE_STAGES.includes(withData.botStage) && intents.isDisqualified(msg.norm)) {
    return descartadoResult(ctx, withData);
  }

  // --- Rama por estado.
  switch (withData.botStage) {
    case "nuevo":
      return welcomeResult(ctx, withData);
    case "esperando_calificacion":
    case "calificado":
      // Guion VIEJO (las 3 preguntas iban antes de los horarios). Las conversaciones que quedaron
      // en ese estado se migran al embudo nuevo con la bienvenida, que es la que trae la oferta.
      return welcomeResult(ctx, withData, { reason: "migracion_guion_nuevo" });
    case "esperando_horario":
      return handleHorario(ctx, withData);
    case "demo_agendada":
      return handleAgendada(ctx, withData);
    case "descartado":
      return intents.isDemoTrigger(msg.norm, config)
        ? welcomeResult(ctx, { ...base, botStage: "nuevo", qualification: {}, offScriptCount: 0, qualifyAsks: 0 })
        : handoffResult(ctx, base, "escribio_tras_descarte");
    case "demo_realizada":
      return handoffResult(ctx, base, "escribio_tras_la_demo");
    case "handoff_humano":
      // Ya esta en manos de Sergio: se registra el inbound y el bot no vuelve a hablar.
      return finalize(ctx, base, [], [], ["silencio:handoff_en_curso"]);
    default:
      return handoffResult(ctx, base, "estado_desconocido");
  }
}

// ---------------------------------------------------------------------------
// Handlers por estado
// ---------------------------------------------------------------------------

function handleHorario(ctx, base) {
  const { config, prev, msg } = ctx;
  const slots = activeSlots(base, config);

  // La ELECCION ya se resolvio en step(), antes de leer datos: "el jueves no puedo, el viernes si"
  // esta eligiendo el viernes, y leerlo como "no le sirve ninguno" tira una demo ya aceptada.
  const chosen = ctx.slotChoice;
  if (!chosen) {
    if (intents.noSlotWorks(msg.norm)) return handoffResult(ctx, base, "ningun_horario_le_sirve");
    // Puso SU fecha/hora sobre la mesa sin elegir A ni B ("puedo el jueves a la 1", "el primero
    // de agosto viajo"): eso lo coordina un humano. Agendarle uno de los nuestros y decirle
    // "listo, agendado" es mandarlo a una reunion a la que nunca dijo que iba.
    if (intents.proposesOwnTime(msg.norm)) return handoffResult(ctx, base, "propone_otro_horario");
    // Contesto contando su negocio en vez de elegir: se le acusa recibo y se le vuelven a poner
    // los dos horarios. El dato queda guardado, asi que M2 despues no se lo vuelve a pedir.
    if (Object.keys(ctx.found || {}).length > 0) {
      const reply = say("M0b", base, config, { datos_que_si_dio: joinEs(capturedLabels(base.qualification)) });
      return finalize(ctx, base, [reply], [], ["repregunta:horario"]);
    }
    return offScriptResult(ctx, base);
  }

  const next = {
    ...base,
    botStage: "demo_agendada",
    scheduledAt: chosen.startAt || null,
    scheduledLabel: chosen.label,
    slotsOffered: slots.map((slot) => ({ ...slot, chosen: slot.key === chosen.key })),
  };
  const effects = [
    stageEffect(prev, next, "demo_agendada"),
    {
      type: "calendar_event",
      payload: {
        conversationKey: next.conversationKey,
        slotKey: chosen.key,
        label: chosen.label,
        startAt: chosen.startAt || null,
        summary: `Demo ${config.identity.productName} — ${next.qualification.city || "sin ciudad"}`,
      },
    },
    {
      type: "lead_upsert",
      payload: {
        conversationKey: next.conversationKey,
        leadKey: next.leadKey,
        pipelineStatus: config.pipelineStatus.demo_agendada,
        qualification: next.qualification,
      },
    },
    {
      type: "notify_sergio",
      payload: { kind: "demo_agendada", conversationKey: next.conversationKey, text: summarize(next, msg, `demo agendada ${chosen.label}`) },
    },
    auditEffect(prev, next, "demo_agendada"),
  ];
  const notes = ["demo_agendada"];
  if (!chosen.startAt) notes.push("slot_sin_startAt");
  return finalize(ctx, next, [say("M2", next, config)], effects, notes);
}

/**
 * Despues de reservar. Aca vive AHORA la calificacion: M2 pidio los 3 datos y el dolor, y esto
 * lee lo que el prospecto contesto. La demo ya esta reservada, asi que nada de esto es un gate:
 * si un dato no llega, la reunion sigue en pie y lo pregunta Sergio.
 */
function handleAgendada(ctx, base) {
  const { config, msg } = ctx;
  const found = ctx.found || {};
  const pain = intents.detectPainPoint(msg.norm);
  const captured = Object.keys(found).length > 0 || Boolean(pain);

  // "gracias" / "nos vemos el jueves": no es una consulta ni trae datos, no se molesta a nadie.
  if (!captured && intents.isCourtesy(msg.norm)) return finalize(ctx, base, [], [], ["cortesia_sin_respuesta"]);
  // Escribio algo que no es ni un dato ni el dolor: lo mira un humano (ante la duda, derivar).
  if (!captured) return handoffResult(ctx, base, "mensaje_tras_agendar_sin_dolor");

  const qualification = pain ? { ...base.qualification, painPoint: pain } : base.qualification;
  const effects = [
    {
      type: "lead_upsert",
      payload: {
        conversationKey: base.conversationKey,
        leadKey: base.leadKey,
        painPoint: qualification.painPoint || null,
        qualification,
        // La reunion ya esta agendada: el estado del pipeline no baja por sumar datos.
        pipelineStatus: config.pipelineStatus.demo_agendada,
      },
    },
  ];

  // Falta algo y todavia queda margen: se pide UNA cosa mas. A la 3ra no se insiste (spec D3) —
  // un campo del CRM no vale cansar a quien ya dijo que si.
  const missing = missingFields(qualification, config);
  if (missing.length > 0 && base.qualifyAsks < config.qualification.maxReAsks) {
    const asks = base.qualifyAsks + 1;
    const next = { ...base, qualification, qualifyAsks: asks };
    // M1a repite TODO lo anotado hasta ahora: es lo que hace que "me falta sólo X" se lea bien.
    const reply = say("M1a", next, config, {
      datos_que_si_dio: joinEs(capturedLabels(qualification)),
      dato_faltante: joinEs(missing.map((field) => field.missLabel)),
    });
    return finalize(ctx, next, [reply], effects, [`repregunta:${asks}`]);
  }

  // Los 3 universales estan: el rubro puede pedir UN dato extra (hoy: los sillones de una clinica).
  // Se pregunta una sola vez y no bloquea nada.
  const branch = missing.length === 0 ? pendingBranch({ ...base, qualification }, config) : null;
  if (branch) {
    const next = { ...base, qualification, branchAsked: true };
    return finalize(ctx, next, [say(branch.askKey, next, config)], effects, [`rama_rubro:${branch.key}`]);
  }

  // El acuse repite SOLO lo que vino en ESTE mensaje: si el prospecto contesta en dos tandas,
  // volver a leerle la lista entera suena a formulario, no a alguien que lo escucho.
  const next = { ...base, qualification };
  const reply = say("M2b", next, config, {
    datos_que_si_dio: joinEs(capturedLabels({ ...found, ...(pain ? { painPoint: pain } : {}) })),
  });
  return finalize(ctx, next, [reply], effects, [pain ? `dolor:${pain}` : "calificado"]);
}

/**
 * UNICA rama con LLM. El contexto que se le pasa NO lleva precios, planes ni features:
 * no puede filtrar lo que no tiene (spec §3.4). Su salida SIEMPRE pasa por enforceGuardrails().
 * Al 2do malentendido: handoff (dos fallos de comprension = el bot ya no aporta).
 */
function offScriptResult(ctx, base) {
  const { config, options, msg } = ctx;
  const count = base.offScriptCount + 1;

  if (count >= config.offScript.maxBeforeHandoff) {
    return handoffResult(ctx, { ...base, offScriptCount: count }, "dos_malentendidos");
  }

  const next = { ...base, offScriptCount: count };
  const missing = missingFields(next.qualification, config).map((field) => field.missLabel);
  const llmRequest = {
    task: "reformular la pregunta pendiente del embudo, en voseo boliviano, sin dar datos nuevos",
    stage: next.botStage,
    captured: next.qualification,
    pendingQuestion: pendingAsk(next, config),
    missing,
    lastInboundText: msg.text.slice(0, 400),
    // Prohibido pasar precios, planes, features o cifras: el prompt no recibe numeros.
    forbidden: ["precio", "planes", "features", "cifras", "casos de clientes"],
  };
  const fallbackText = renderTemplate(SAFE_REPLY, varsFor(next, config));

  if (typeof options.llm !== "function") {
    return finalize(
      ctx,
      next,
      [{ templateKey: "llm_freeform", replySource: "llm", text: LLM_PENDING, pending: true, llmRequest, fallbackText }],
      [{ type: "llm_request", payload: llmRequest }],
      [`off_guion:${count}`, "llm_no_inyectado"],
    );
  }

  let rawText = "";
  try {
    rawText = String(options.llm(llmRequest) ?? "");
  } catch {
    rawText = "";
  }
  if (!rawText.trim()) {
    return finalize(ctx, next, [{ templateKey: "safe_reply", replySource: "script", text: fallbackText }], [], [
      `off_guion:${count}`,
      "llm_sin_respuesta",
    ]);
  }

  // Guardrail sobre el texto CRUDO; las variables se renderizan DESPUES (spec §3.1).
  const verdict = enforceGuardrails(rawText);
  return finalize(
    ctx,
    next,
    [
      {
        templateKey: verdict.ok ? "llm_freeform" : "safe_reply",
        replySource: verdict.ok ? "llm" : "script",
        text: renderTemplate(verdict.text, varsFor(next, config)),
        guardrail: { ok: verdict.ok, violations: verdict.violations },
      },
    ],
    [{ type: "llm_request", payload: llmRequest }],
    [`off_guion:${count}`, verdict.ok ? "llm_ok" : `guardrail_bloqueo:${verdict.violations.join(",")}`],
  );
}

// ---------------------------------------------------------------------------
// Follow-up unico (D8 / N7). La reserva REAL es el CAS en SQL (spec §4.6); esto arma el mensaje.
// ---------------------------------------------------------------------------

/** ¿La conversacion califica para el unico follow-up? Determinista: `nowIso` se inyecta. */
export function followUpDue(state, nowIso, config = DEFAULT_CONFIG) {
  if (state.humanTookOver || state.optOutAt) return false;
  if (state.followupStep >= config.followUp.maxSteps) return false;
  if (!["esperando_calificacion", "esperando_horario"].includes(state.botStage)) return false;
  if (!state.lastInboundAt || !nowIso) return false;
  const elapsedHours = (Date.parse(nowIso) - Date.parse(state.lastInboundAt)) / 3600000;
  if (!Number.isFinite(elapsedHours)) return false;
  return elapsedHours >= config.followUp.afterHours && elapsedHours <= config.followUp.staleAfterDays * 24;
}

/** Mensaje M3 + el estado con el paso reservado. Si no corresponde, devuelve null. */
export function buildFollowUp(state, nowIso, config = DEFAULT_CONFIG) {
  if (!followUpDue(state, nowIso, config)) return null;
  const next = { ...state, followupStep: state.followupStep + 1, lastOutboundAt: nowIso };
  return { nextState: next, reply: say("M3", next, config) };
}
