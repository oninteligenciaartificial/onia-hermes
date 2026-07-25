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
  return {
    humano: config.identity.humanName,
    producto: config.identity.productName,
    bot: config.identity.botName,
    slot_a: slotLabel(slots, "A"),
    slot_b: slotLabel(slots, "B"),
    ciudad: q.city || "",
    sillones: q.chairs ?? "",
    sillon_palabra: q.chairs === 1 ? "sillón" : "sillones",
    dia_hora_elegida: label,
    dia: label ? label.split(/\s+/)[0] : "",
    pain_point: q.painPoint || "",
    ...extra,
  };
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

function capturedLabels(qualification) {
  const labels = [];
  if (qualification.ownsClinic === true) labels.push("que la clínica es tuya");
  if (qualification.ownsClinic === "socio") labels.push("que la manejás con un socio");
  if (qualification.chairs) {
    labels.push(`que tenés ${qualification.chairs} ${qualification.chairs === 1 ? "sillón" : "sillones"}`);
  }
  if (qualification.city) labels.push(`que estás en ${qualification.city}`);
  return labels;
}

/** La pregunta pendiente del estado actual: con esto una respuesta off-guion vuelve al embudo. */
function pendingAsk(state, config) {
  if (state.botStage === "esperando_calificacion") {
    const missing = missingFields(state.qualification, config);
    if (missing.length === 0) return null;
    return say("PENDING_CALIFICACION", state, config, {
      dato_faltante: joinEs(missing.map((field) => field.missLabel)),
    }).text;
  }
  if (state.botStage === "esperando_horario" || state.botStage === "calificado") {
    return say("PENDING_HORARIO", state, config).text;
  }
  if (state.botStage === "demo_agendada") return say("PENDING_AGENDADA", state, config).text;
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
    q.ownsClinic === true ? "clínica propia" : q.ownsClinic === "socio" ? "con socio" : q.ownsClinic === false ? "no es dueño" : null,
    q.chairs ? `${q.chairs} sillones` : null,
    q.city || null,
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

function handoffResult(ctx, base, reason, leadingReplies = []) {
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
  return finalize(ctx, next, [...leadingReplies, say("M5", next, config)], effects, [`handoff:${reason}`]);
}

/** Respuesta off-guion (precio / SIAT / archivo): cuerpo fijo + la pregunta pendiente del embudo. */
function composeWithFunnel(ctx, base, bodyKey, reason) {
  const { config, prev } = ctx;

  // En 'nuevo' el disclosure manda (D2, sin excepción): primero M0, despues el cuerpo.
  if (base.botStage === "nuevo") {
    const next = {
      ...base,
      botStage: "esperando_calificacion",
      optInAt: base.optInAt || ctx.msg.receivedAt,
      optInSource: base.optInSource || "inbound_demo",
    };
    return finalize(
      ctx,
      next,
      [say("M0", next, config), say(bodyKey, next, config)],
      [stageEffect(prev, next, `${reason}_en_bienvenida`)],
      [reason],
    );
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
  if (state.optOutAt) {
    if (!intents.isDemoTrigger(msg.norm, config)) {
      return finalize(ctx, base, [], [], ["silencio:opt_out"]);
    }
    const next = {
      ...base,
      botStage: "esperando_calificacion",
      optOutAt: null,
      optInAt: msg.receivedAt,
      optInSource: "inbound_demo",
      offScriptCount: 0,
      qualifyAsks: 0,
      qualification: {},
    };
    return finalize(ctx, next, [say("M0", next, config)], [stageEffect(prev, next, "reapertura_tras_opt_out")], [
      "reabierto_por_demo",
    ]);
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

  // --- Router determinista (spec §5.2 paso 9): opt-out > queja > precio > SIAT > clinico > estado.
  if (intents.isOptOut(msg.norm)) {
    const next = { ...base, botStage: "opt_out", optOutAt: msg.receivedAt };
    return finalize(
      ctx,
      next,
      [say("M6", next, config)],
      [stageEffect(prev, next, "opt_out"), auditEffect(prev, next, "opt_out")],
      ["opt_out"],
    );
  }

  if (intents.isComplaint(msg.norm)) return handoffResult(ctx, base, "queja_o_desconfianza");

  if (intents.isPriceQuestion(msg.norm)) return composeWithFunnel(ctx, base, "M4_BODY", "pregunta_precio");

  if (intents.isSiatQuestion(msg.norm)) return composeWithFunnel(ctx, base, "M_SIAT_BODY", "pregunta_siat");

  if (intents.isClinicalOrLegal(msg.norm)) return handoffResult(ctx, base, "consulta_clinica_o_legal");

  if (intents.isProductDetail(msg.norm)) return handoffResult(ctx, base, "detalle_tecnico_de_producto");

  // --- Rama por estado.
  switch (base.botStage) {
    case "nuevo":
      return handleNuevo(ctx, base);
    case "esperando_calificacion":
      return handleCalificacion(ctx, base);
    case "calificado":
    case "esperando_horario":
      return handleHorario(ctx, base);
    case "demo_agendada":
      return handleAgendada(ctx, base);
    case "descartado":
      return intents.isDemoTrigger(msg.norm, config)
        ? handleNuevo(ctx, { ...base, botStage: "nuevo", qualification: {}, offScriptCount: 0, qualifyAsks: 0 })
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

function handleNuevo(ctx, base) {
  const { config, prev, msg } = ctx;
  const found = intents.parseQualification(msg.norm, base.qualification);
  const qualification = { ...base.qualification, ...found };
  const optIn = { optInAt: base.optInAt || msg.receivedAt, optInSource: base.optInSource || "inbound_demo" };

  // El primer mensaje ya trajo los 3 datos: disclosure + oferta de horarios, sin re-preguntar.
  if (missingFields(qualification, config).length === 0 && !intents.isDisqualified(msg.norm, qualification)) {
    const staged = { ...base, ...optIn, qualification, botStage: "esperando_calificacion" };
    return qualifiedResult(ctx, staged, [say("M0_DISCLOSURE", staged, config)]);
  }

  const next = { ...base, ...optIn, qualification, botStage: "esperando_calificacion" };
  return finalize(ctx, next, [say("M0", next, config)], [stageEffect(prev, next, "disparador_demo")], ["bienvenida"]);
}

function handleCalificacion(ctx, base) {
  const { config, prev, msg } = ctx;
  const found = intents.parseQualification(msg.norm, base.qualification);
  const qualification = { ...base.qualification, ...found };

  // Descarte suave: claramente no es el publico (o dijo que trabaja en la clinica de otro).
  if (intents.isDisqualified(msg.norm, qualification)) {
    const next = { ...base, qualification, botStage: "descartado" };
    const effects = [stageEffect(prev, next, "descartado_fuera_de_publico"), auditEffect(prev, next, "descartado")];
    if (next.leadKey) {
      effects.push({
        type: "lead_upsert",
        payload: { leadKey: next.leadKey, pipelineStatus: config.pipelineStatus.descartado, conversationKey: next.conversationKey },
      });
    }
    return finalize(ctx, next, [say("M1c", next, config)], effects, ["descartado"]);
  }

  const missing = missingFields(qualification, config);

  if (missing.length === 0) return qualifiedResult(ctx, { ...base, qualification });

  // Ya se re-pregunto el maximo y siguen faltando datos: "no insistimos una tercera vez" (spec M1a).
  // El tope se evalua ANTES de la rama LLM: reformular la pregunta seria insistir igual.
  if (base.qualifyAsks >= config.qualification.maxReAsks) {
    return handoffResult(ctx, { ...base, qualification }, "calificacion_incompleta");
  }

  // No entendio nada nuevo: es la rama off-guion (unica con LLM), no una re-pregunta.
  if (Object.keys(found).length === 0) return offScriptResult(ctx, { ...base, qualification });

  const asks = base.qualifyAsks + 1;
  const next = { ...base, qualification, qualifyAsks: asks };
  const reply = say("M1a", next, config, {
    datos_que_si_dio: joinEs(capturedLabels(qualification)),
    dato_faltante: joinEs(missing.map((field) => field.missLabel)),
  });
  return finalize(ctx, next, [reply], [], [`repregunta:${asks}`]);
}

/** Paso por `calificado` -> ofrece los 2 horarios y queda en `esperando_horario` (spec §2.1). */
function qualifiedResult(ctx, base, leadingReplies = []) {
  const { config, prev } = ctx;
  const next = {
    ...base,
    botStage: "esperando_horario",
    slotsOffered: config.slots.map((slot) => ({ ...slot })),
    offScriptCount: 0,
  };
  const effects = [
    stageEffect(prev, next, "calificado"),
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
  return finalize(ctx, next, [...leadingReplies, say("M1b", next, config)], effects, ["calificado"]);
}

function handleHorario(ctx, base) {
  const { config, prev, msg } = ctx;
  const slots = activeSlots(base, config);

  if (intents.noSlotWorks(msg.norm)) return handoffResult(ctx, base, "ningun_horario_le_sirve");

  const chosen = intents.detectSlotChoice(msg.norm, slots);
  if (!chosen) return offScriptResult(ctx, base);

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

function handleAgendada(ctx, base) {
  const { config, msg } = ctx;
  // "gracias" / "dale" no es una consulta: no se molesta a un humano por cortesia.
  if (intents.isCourtesy(msg.norm)) return finalize(ctx, base, [], [], ["cortesia_sin_respuesta"]);
  const pain = intents.detectPainPoint(msg.norm);
  if (!pain) return handoffResult(ctx, base, "mensaje_tras_agendar_sin_dolor");
  const next = { ...base, qualification: { ...base.qualification, painPoint: pain } };
  const effects = [
    {
      type: "lead_upsert",
      payload: {
        conversationKey: next.conversationKey,
        leadKey: next.leadKey,
        painPoint: pain,
        pipelineStatus: config.pipelineStatus.demo_agendada,
      },
    },
  ];
  return finalize(ctx, next, [say("M2b", next, config)], effects, [`dolor:${pain}`]);
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
