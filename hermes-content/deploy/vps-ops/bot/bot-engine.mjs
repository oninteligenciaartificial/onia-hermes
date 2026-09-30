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
  claveDeSlot,
  renderTemplate,
  joinEs,
  isOutsideBusinessHours,
  slotsPending,
  slotSostenible,
} from "./config.mjs";
import { enforceGuardrails, normalize, SAFE_REPLY } from "./guardrails.mjs";
import * as intents from "./intents.mjs";
import { campanaExacta, faqNegocioVigente, recepcionistaStep } from "./recepcionista.mjs";
// COMO se escribe cada respuesta vive en reply-builder.mjs; aca queda QUE rama se toma.
import {
  ESPERA_HORARIO_STAGES,
  activeSlots,
  capturedLabels,
  elegibleSlots,
  missingFields,
  pendingAsk,
  pendingBranch,
  say,
  slotLabel,
  varsFor,
} from "./reply-builder.mjs";

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
    // El contacto con el que un humano puede LLAMAR (telefono de WhatsApp). Distinto de
    // `contactRef`, que es el id de la conversacion del canal y no sirve para contactar a nadie.
    // Se persiste en `bot_conversations.raw`, no en columna: ver saveConversation().
    publicContact: input.publicContact || null,
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
    inboxId: input.inboxId || null,
    // El MEDIO por el que entró (`channel_type` de Chatwoot), que es distinto del inbox: el id
    // se renumera, el medio no. De acá sale `{{via_humano}}` — por qué vía promete el bot que
    // le va a escribir el humano. Sin dato, `viaDelCanal` cae en la forma canal-agnóstica.
    channelType: input.channelType || null,
    humanTookOver: Boolean(input.humanTookOver),
    humanTookOverAt: input.humanTookOverAt || null,
    // Cuando se ACUSO el primer inbound posterior a un handoff. `handoff_humano` no significa
    // que un humano haya llegado, solo que el bot derivo; sin esta marca la persona escribe al
    // vacio. Se persiste en `bot_conversations.raw`, no en columna: no hace falta DDL.
    handoffAckAt: input.handoffAckAt || null,
    // Cuando se MARCO como urgente (dijo "urgente" — la palabra que M5 le pidio — o dijo que
    // quiere comprar). Una sola vez por conversacion: el aviso ya le llega a Sergio Urcullo por
    // un canal saturado, y repetirlo es apagarlo. Vive en `raw`, como handoffAckAt: sin DDL.
    urgenteAvisadoAt: input.urgenteAvisadoAt || null,
    // Cuando se aviso que la persona sigue escribiendo en un handoff que NADIE tomo. El bot se
    // calla para no pisar al humano; si ese humano no existe, el silencio ademas es invisible.
    // Una sola vez, por el mismo canal saturado. Vive en `raw`, como los dos de arriba: sin DDL.
    handoffMudoAvisadoAt: input.handoffMudoAvisadoAt || null,
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

/**
 * El DESARME del takeover (bandeja nativa 2026-08-29): resolver la conversacion
 * se la devuelve al bot. Tambien resetea el handoff del recepcionista — ambos
 * candados significan "humano a cargo", y resolver significa "termine".
 *
 * ⚠️ "Termine" solo vale si alguien EMPEZO. Medido el 2026-09-04: la conversacion 57
 * pidio un humano a las 14:38:10 (aviso a Sergio enviado) y 35 s despues quedo resuelta
 * con el cartel "marked resolved by system due to 0 minutes of inactivity", lo que
 * disparaba este desarme y dejaba `chatwoot:57 | nuevo | human_took_over=f`. El handoff
 * se borraba sin que nadie lo atendiera, y el lead que volvia recibia el saludo de cero
 * en vez del acuse. Le paso a 8 conversaciones desde el 29-ago.
 *
 * ⚠️ Ese cartel NO acusa a Chatwoot, y creerle cuesta media vuelta (paso el 2026-09-04).
 * El barrendero por inactividad esta APAGADO: `accounts.settings` es `{}`, y sin
 * `auto_resolve_after` los scopes `resolvable_all` / `resolvable_not_waiting`
 * (conversation.rb:83,88) devuelven `none` — cero automation_rules, cero agent_bots,
 * cero env. "by system ... 0 minutes" es solo la ETIQUETA que Chatwoot le pone a toda
 * resolucion sin `Current.user` ni `Current.contact`, y el 0 sale de
 * `auto_resolve_after || 0` (activity_message_handler.rb:76). Quien resolvia era NUESTRA
 * sonda: scripts/sonda_widget.mjs:519 corre `Conversation.find(N).resolved!` por
 * `rails runner` a proposito, para ejercitar este mismo desarme.
 * Por eso configurar `auto_resolve_after` para "arreglarlo" ENCIENDE un barrendero que
 * hoy no corre. Lo correcto es lo de abajo: el stage solo se libera cuando un humano
 * REALMENTE escribio.
 */
export function clearHumanTakeover(state) {
  const loAtendioUnHumano = state.humanTookOver === true;
  return {
    ...state,
    humanTookOver: false,
    humanTookOverAt: null,
    botStage:
      state.botStage === "handoff_humano" && loAtendioUnHumano ? "nuevo" : state.botStage,
  };
}

/**
 * ¿La conversacion esta VENCIDA? NUESTRO lado (bot o humano) no dio señales de vida en
 * `config.reinicio.trasDiasSinActividad` dias. Se mide contra lastOutboundAt y
 * humanTookOverAt — NUNCA contra lastInboundAt: cada "hola" del prospecto a una
 * conversacion muda actualiza esa marca, asi que medirla rearmaria el reloj con cada
 * intento fallido y el bot no reviviria jamas mientras la persona insista (le paso al
 * "hola" real del 10-sep: el turno MUDO dejo lastInboundAt en ese mismo dia).
 * Fallback: si nunca salio nada nuestro ni hubo takeover, cuenta desde lastInboundAt.
 * Determinista: el "ahora" es el receivedAt del mensaje entrante.
 * El opt-out la excluye SIEMPRE: esa barrera no caduca por tiempo (politica de Meta).
 */
export function conversacionVencida(state, receivedAt, config = DEFAULT_CONFIG) {
  const dias = config.reinicio?.trasDiasSinActividad;
  if (!Number.isFinite(dias) || dias <= 0) return false;
  if (!receivedAt || state.optOutAt || state.botStage === "nuevo") return false;
  const nuestras = [state.lastOutboundAt, state.humanTookOverAt]
    .map((iso) => Date.parse(iso))
    .filter(Number.isFinite);
  const marcas = nuestras.length ? nuestras : [Date.parse(state.lastInboundAt)].filter(Number.isFinite);
  if (!marcas.length) return false;
  const inactiva = (Date.parse(receivedAt) - Math.max(...marcas)) / 86400000;
  return Number.isFinite(inactiva) && inactiva > dias;
}

/**
 * El reinicio de una conversacion vencida: vuelve al guion desde el saludo. Limpia TODOS los
 * candados de silencio (humanTookOver, handoffAckAt) y los contadores del embudo; conserva
 * la calificacion ya capturada (el rubro de hace un mes sigue siendo el rubro) y la
 * atribucion. `slotsOffered`/`scheduledAt` se limpian: una demo de hace un mes no es un
 * compromiso vigente.
 */
export function reiniciarConversacionVencida(state) {
  return {
    ...state,
    botStage: "nuevo",
    humanTookOver: false,
    humanTookOverAt: null,
    handoffAckAt: null,
    urgenteAvisadoAt: null,
    handoffMudoAvisadoAt: null,
    slotsOffered: [],
    scheduledAt: null,
    scheduledLabel: null,
    calendarEventId: null,
    offScriptCount: 0,
    qualifyAsks: 0,
    followupStep: 0,
    branchAsked: false,
  };
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
      handoffAckAt: state.handoffAckAt,
      urgenteAvisadoAt: state.urgenteAvisadoAt,
      handoffMudoAvisadoAt: state.handoffMudoAvisadoAt,
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
    imageDescription: typeof raw.imageDescription === "string" ? raw.imageDescription : "",
    imageReceipt: raw.imageReceipt && typeof raw.imageReceipt === "object" ? raw.imageReceipt : null,
    externalMessageId: raw.externalMessageId || null,
    receivedAt: raw.receivedAt || null,
    author: raw.author || "contact",
  };
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

function summarize(state, msg, reason, config) {
  const q = state.qualification || {};
  const datos = [
    q.industry ? `rubro: ${intents.industryLabel(q.industry, config) || "otro"}` : null,
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
  // El reinicio por vencimiento se anota SIEMPRE, en cualquier rama: es lo que explica por
  // que una conversacion de hace un mes arranca de nuevo con la bienvenida.
  if (ctx.vencida) allNotes.unshift("reinicio:conversacion_vencida");
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
      // Botones (Chatwoot input_select): viajan pegados a la respuesta hasta el adapter. El
      // texto plano sigue siendo la base — un canal sin interactivos simplemente los ignora.
      ...(reply.options ? { options: reply.options } : {}),
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
 * @param {string|{key:string, options?:Array}} [bodyKey]  el mensaje con el que se anuncia el
 *   handoff. Por defecto M5 ("eso lo ve un humano"); el camino de SOPORTE usa el suyo porque
 *   decirle "eso lo ve Sergio en la demo" a un cliente que pide ayuda es contestarle con el
 *   guion de venta. Como objeto `{key, options}` permite colgarle botones al anuncio (R_DERIVA
 *   del recepcionista) sin duplicar los efectos de esta funcion.
 */
function handoffResult(ctx, base, reason, leadingReplies = [], bodyKey = "M5") {
  const { config, prev, msg } = ctx;
  const next = { ...base, botStage: "handoff_humano", handoffAckAt: null };
  const summary = summarize(next, msg, reason, config);
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
  const spec = typeof bodyKey === "string" ? { key: bodyKey } : bodyKey;
  const body = { ...say(spec.key, next, config, spec.vars || {}), ...(spec.options ? { options: spec.options } : {}) };
  return finalize(ctx, next, [...leadingReplies, body], effects, [`handoff:${reason}`]);
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
  // SIN HORARIOS REALES NO SE SALUDA CON HORARIOS. El placeholder de config.mjs sale tal cual al
  // prospecto ("HORARIO A (pendiente de definir)") y ademas detectSlotChoice descarta los slots
  // `pending`, asi que el prospecto no puede elegir NADA: la conversacion muere en el primer
  // mensaje. Se lo saluda igual (el lead nace), pero el horario lo coordina un humano.
  const sinHorarios = slotsPending(config);
  const next = {
    ...base,
    // SIN HORARIOS NO ES SILENCIO. Antes esto era `handoff_humano`, y `handoff_humano`
    // significa que el bot NO vuelve a hablar nunca (barrera 1 de step()). Como los slots de
    // config.mjs siguen en "pendiente de definir", CADA conversacion caia ahi: el bot saludaba
    // y se callaba en el segundo mensaje. Medido el 2026-09-02 sobre las 13 conversaciones
    // desde el 24-ago: en el inbox de QA sostuvo 5 mensajes por 5 respuestas; a las personas
    // reales les contesto como maximo UNA vez, SIEMPRE. Cinco escribieron, cuatro sin respuesta.
    // Ahora entra igual a `esperando_horario`, que es la rama VIVA del guion (handleHorario):
    // sigue calificando —lo unico que puede hacer sin agenda— y el humano coordina la hora en
    // paralelo; los dos efectos de abajo (review_queue + notify_sergio) se mantienen intactos.
    // OJO: no sirve `esperando_calificacion`. Ese es el guion VIEJO y su rama del switch
    // reenvia la bienvenida ("migracion_guion_nuevo"), asi que el bot queda saludando en bucle
    // a cada mensaje — probado antes de elegir esta. `slotsOffered` ya queda [] mas abajo, asi
    // que handleHorario no puede leer una eleccion de horario que no se ofrecio.
    botStage: "esperando_horario",
    slotsOffered: sinHorarios ? [] : config.slots.map((slot) => ({ ...slot })),
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
  if (sinHorarios) {
    // Un humano TIENE que enterarse: el prospecto quedo esperando que Sergio le proponga hora.
    const summary = summarize(next, msg, "sin horarios disponibles que ofrecer", config);
    effects.push(
      { type: "review_queue", payload: { ...config.handoff.reviewQueue, conversationKey: next.conversationKey, leadKey: next.leadKey, summary } },
      { type: "notify_sergio", payload: { kind: "sin_horarios", conversationKey: next.conversationKey, text: summary } },
    );
  }
  const bienvenida = say(sinHorarios ? "M0_SIN_HORARIOS" : "M0", next, config);
  return finalize(ctx, next, [bienvenida, ...after], effects, sinHorarios ? [...notes, "sin_horarios_que_ofrecer"] : notes);
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
        text: summarize(next, msg, "descartado despues de agendar la demo", config),
      },
    });
  }
  return finalize(ctx, next, [say("M1c", next, config)], effects, ["descartado"]);
}

/**
 * El PACIENTE que llego por la pauta (busca turno, el precio de un tratamiento, tiene un dolor):
 * salida cortes y fuera del embudo. Es el "riesgo central" de la pauta dental
 * (ONIA_ADQUISICION_Y_PAUTA.md §5.2) y es el primo de `descartadoResult`, con dos diferencias:
 *
 *   · Se evalua TAMBIEN en 'nuevo': "Busco atencion dental" es la respuesta para tocar del anuncio
 *     y llega como primer mensaje. D2 (el bot se declara bot) no se pierde: M1_PACIENTE lo dice.
 *     Y en 'nuevo' no nace el lead — un paciente no es un prospecto de Onia.
 *   · NO avisa a Sergio Urcullo, salvo que hubiera una demo agendada que liberar: cada aviso por un
 *     paciente es una hora de soporte gastada en alguien que nunca va a comprar.
 *
 * Si insiste, se le repite la salida SIN volver a registrar el descarte.
 */
function pacienteResult(ctx, base) {
  const { config, prev, msg } = ctx;
  const next = { ...base, botStage: "descartado" };
  const reply = say("M1_PACIENTE", next, config);
  if (base.botStage === "descartado") return finalize(ctx, next, [reply], [], ["paciente:ya_descartado"]);

  const reason = "paciente_busca_atencion";
  const effects = [stageEffect(prev, next, reason), auditEffect(prev, next, reason)];
  // El lead pudo nacer con el precargado del anuncio ("Tengo una clinica dental"), que un paciente
  // manda igual: se cierra como perdido en vez de quedar "Contactado" en el panel.
  if (next.leadKey) {
    effects.push({
      type: "lead_upsert",
      payload: { leadKey: next.leadKey, pipelineStatus: config.pipelineStatus.descartado, conversationKey: next.conversationKey },
    });
  }
  if (base.botStage === "demo_agendada") {
    effects.push({
      type: "notify_sergio",
      payload: {
        kind: "descarte_tras_agendar",
        conversationKey: next.conversationKey,
        text: summarize(next, msg, "era un paciente buscando atención, no una clínica: liberá el horario", config),
      },
    });
  }
  return finalize(ctx, next, [reply], effects, [reason]);
}

/**
 * Respuesta off-guion (precio / SIAT / archivo / campaña): cuerpo fijo + la pregunta pendiente
 * del embudo. `vars` existe para R_CAMPANA, que es la unica plantilla de este camino cuyo texto
 * no esta en el guion: lo trae el documento publicado ({{respuesta_campana}}).
 */
function composeWithFunnel(ctx, base, bodyKey, reason, vars = {}) {
  const { config } = ctx;

  // En 'nuevo' el disclosure manda (D2, sin excepción): primero M0 —que ya trae los horarios—,
  // despues el cuerpo. Los datos que vinieran en el mismo mensaje ya quedaron guardados.
  if (base.botStage === "nuevo") {
    return welcomeResult(ctx, base, {
      reason: `${reason}_en_bienvenida`,
      notes: [reason],
      after: [say(bodyKey, base, config, vars)],
    });
  }

  const ask = pendingAsk(base, config);
  const body = say(bodyKey, base, config, vars);
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

  // --- Barrera 0: conversacion VENCIDA (>N dias sin actividad de nadie) => se reinicia al
  // saludo ANTES de evaluar cualquier candado. Ningun estado puede producir 0 mensajes ante
  // un entrante real de un contacto: el candado de una prueba vieja (conv 11, human_took_over
  // del 13-ago) dejo mudo el "hola" real de Sergio el 10-sep. Solo para mensajes DEL contacto:
  // un traspaso humano (author "human") jamas dispara la bienvenida encima del humano.
  const delProspecto = msg.author === "contact";
  const vencida = delProspecto && conversacionVencida(state, msg.receivedAt, config);
  const vivo = vencida ? reiniciarConversacionVencida(state) : state;
  // `lastInboundAt` es el reloj DEL PROSPECTO y lo mueve EL, nadie mas — la MISMA pregunta que la
  // barrera de arriba. Al motor tambien entra lo que sale de nuestro lado (el adapter convierte el
  // saliente de un humano en un turno `author: "human"`), y pisar el reloj con esa hora le miente a
  // los tres consumidores que deciden a quien escribirle: la ventana de 24 h de Meta —que Meta
  // cuenta desde el ultimo mensaje DEL USUARIO— y las dos ventanas del rescate. Medido en la conv 58
  // el 2026-09-18: un lead real quedo con el reloj 20,4 h adelantado por nuestro propio follow-up.
  const base = { ...vivo, lastInboundAt: (delProspecto && msg.receivedAt) || vivo.lastInboundAt };
  const ctx = { config, prev, msg, options, vencida };

  // --- Barrera 1: un humano tomo la conversacion. El bot NO habla. Falla hacia el SILENCIO.
  if (vivo.humanTookOver) return finalize(ctx, base, [], [], ["silencio:humano_a_cargo"]);

  // --- Barrera 1b: CUOTA MENSUAL AGOTADA (la manda /published; null = seguir atendiendo).
  // Hasta hoy el bot se CALLABA al agotarse: el cliente del cliente escribia y nadie contestaba.
  // Ahora: texto fijo SIEMPRE (nunca LLM) y el handoff de siempre (review_queue + notify)
  // UNA sola vez por conversacion — en handoff_humano ya no se repiten los efectos.
  // Opt-out previo sigue mandando: a quien dijo basta no se le escribe ni para avisarle esto.
  if (config.cuota?.agotada === true && !vivo.optOutAt) {
    if (vivo.botStage === "handoff_humano") {
      return finalize(ctx, base, [say("R_CUOTA_AGOTADA", base, config)], [], ["cuota_agotada:ya_derivada"]);
    }
    return handoffResult(ctx, base, "cuota_agotada", [], "R_CUOTA_AGOTADA");
  }

  // --- MODO RECEPCIONISTA: el bot de un CLIENTE de Onia (conocimiento con fuente "db").
  // Va ANTES de la barrera de opt-out porque la reapertura por "DEMO" es del funnel de venta;
  // el recepcionista maneja su propio opt-out (silencio, sin reapertura). Todo el guion de
  // leads de abajo queda EXCLUSIVO del modo venta. Ver recepcionista.mjs.
  if (config.modo === "recepcionista") {
    return recepcionistaStep(ctx, base, { finalize, handoffResult, say });
  }

  // --- Barrera 2: opt-out previo. Solo el disparador DEMO puede reabrir (lo dice M6).
  // El opt-out le gana SIEMPRE al disparador: "ya no me mandes mas info" trae la palabra "info"
  // (disparador de demo) pero esta REFORZANDO la baja. Reabrirle el guion es escribirle a quien
  // ya dijo basta dos veces — riesgo de politica de Meta, no un detalle de UX.
  if (vivo.optOutAt) {
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

  // --- Audio sin transcripcion. El ejecutor DEBIO transcribir antes (Speaches), pero ese
  // contenedor no existe en el VPS (`npm run destinos:vivos`), asi que hoy esta rama no es el
  // caso raro: es el UNICO caso, y en Bolivia la nota de voz es la forma normal de escribir.
  //
  // No podemos leerlo, que es exactamente un fallo de comprension: va al MISMO contador que los
  // malentendidos, no a uno nuevo. Una vez se pide texto; si insiste con audio, el bot deja de
  // insistir y lo pasa a la persona que SI lo puede escuchar (esta ahi, en Chatwoot). Antes esta
  // rama hacia `finalize` pelado: el que no reescribia se perdia en silencio y nadie se enteraba
  // de que habia existido — mientras su hermana de dos lineas mas abajo (el archivo adjunto, MUCHO
  // menos frecuente) si derivaba. Derivar al PRIMER audio tampoco sirve: silenciaria al bot en casi
  // toda conversacion de WhatsApp y subiria las horas de soporte, que son el techo del negocio.
  if (msg.kind === "voice" && !msg.hasText) {
    const count = base.offScriptCount + 1;
    if (count >= config.offScript.maxBeforeHandoff) {
      // Ya derivada: se le contesta igual (nunca silencio) pero SIN repetir los efectos — mismo
      // criterio que la barrera de cuota agotada. Si no, quien manda seis audios seguidos genera
      // seis avisos del mismo hecho, y asi se pierde el que importa.
      if (base.botStage === "handoff_humano") {
        return finalize(ctx, { ...base, offScriptCount: count }, [say("M_AUDIO_FAIL", base, config)], [], [
          "audio_sin_transcripcion:ya_derivada",
        ]);
      }
      return handoffResult(ctx, { ...base, offScriptCount: count }, "audio_que_no_podemos_oir", [
        say("M_AUDIO_FAIL", base, config),
      ]);
    }
    return finalize(
      ctx,
      { ...base, offScriptCount: count },
      [say("M_AUDIO_FAIL", base, config)],
      [],
      ["audio_sin_transcripcion"],
    );
  }

  // --- Imagen / documento: se reconoce y va a humano (el bot no lee archivos).
  if (msg.kind === "attachment" && !msg.hasText) {
    return handoffResult(ctx, base, "archivo_adjunto", [say("M_ATTACH_BODY", base, config)]);
  }

  if (!msg.hasText) return finalize(ctx, base, [], [], ["sin_texto"]);

  // --- La ELECCION DE HORARIO se resuelve antes que nada: esperando el horario, un "2" pelado es
  // la opcion B, no un equipo de 2 personas. Sin este orden el bot inventa el dato con el que
  // despues habla (viola la regla de oro §2.1).
  // Se le ofrecen DOS y se le aceptan TODOS los que tenemos libres: `elegibleSlots` suma a la
  // foto los horarios vivos que el guion no nombra. Mientras el motor miro solo el par, tres de
  // los cinco que publica el cron eran inalcanzables y el que elegia uno terminaba en la cola
  // humana — 43 conversaciones sin una sola reserva (medido el 2026-09-24).
  ctx.slotChoice = base.botStage === "esperando_horario"
    ? intents.detectSlotChoice(msg.norm, elegibleSlots(base, config))
    : null;

  // --- Captura ANTES de rutear (regla de oro §2.1). Un mensaje real trae las respuestas y una
  // pregunta en la misma linea ("tengo una ferreteria, somos 5, en santa cruz. cuanto sale?").
  // Si la intencion cortara antes, los datos se tiran y el bot los vuelve a pedir: parece que no
  // lee. Los datos se guardan igual; la pregunta se contesta igual.
  const intake = INTAKE_STAGES.includes(base.botStage) && !ctx.slotChoice;
  const found = intake ? intents.parseQualification(msg.norm, base.qualification, config) : {};
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

  // EL PACIENTE QUE ENTRA POR LA PAUTA. Va antes que la campaña, el precio y lo clinico: "cuanto
  // cuestan los brackets" no es la pregunta de precio de Onia y "me duele una muela" no es una
  // consulta que Sergio Urcullo pueda contestar — los dos son de alguien que busca un dentista.
  // Se decide sobre `base` y no sobre `withData`: "limpieza" es rubro servicios para el parser, y
  // guardarle un rubro a un paciente es inventar un dato.
  if (intents.isPatientSeekingCare(msg.norm)) return pacienteResult(ctx, base);

  // FRASE DE CAMPAÑA — el que clickeo un wa.me?text= de onia.com.bo. La frase ES el mensaje
  // entero, asi que es la señal mas especifica que puede llegar: gana a los intents difusos de
  // abajo, que son por palabra suelta. Va DETRAS de la bienvenida (composeWithFunnel), no en
  // lugar de ella: M0 es lo que declara al bot como bot (D2), ofrece los horarios y —lo que mas
  // importa— es la linea que dispara `lead_upsert`. Contestar solo la campaña, como hace el
  // recepcionista, aca cambiaria un lead por un texto enlatado.
  const campana = campanaExacta(config, msg.norm);
  if (campana) return composeWithFunnel(ctx, withData, "R_CAMPANA", "campana", { respuesta_campana: campana.respuesta });

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

  // La FAQ editable del dueño (id "negocio") TAMBIEN contesta en venta (F2.2): publicada en el
  // panel, matchea por sus tags igual que en el recepcionista. Se resuelve ACA (despues de los
  // candados de plata y ley: opt-out, queja, soporte, precio, SIAT, clinico) pero se SIRVE mas
  // abajo, para que "que hacen" y "quiero hablar con una persona" sigan ganando.
  const faqNegocio = faqNegocioVigente(config, msg.norm, msg.receivedAt);

  // El handoff por detalle tecnico existe porque el bot NO tiene la respuesta. Si el dueño la
  // PUBLICO en el panel, la tiene: derivar igual seria ignorar la edicion (el fallo silencioso).
  if (intents.isProductDetail(msg.norm) && !faqNegocio) {
    return handoffResult(ctx, withData, "detalle_tecnico_de_producto");
  }

  // "¿Que hacen?" — va DESPUES de lo especifico (precio, SIAT, clinico, tecnico) porque es la
  // generica: si el mensaje traia algo mas concreto, eso ya se contesto. El catalogo sale de
  // config.productos, o sea de un dato editable, no de un texto congelado.
  if (intents.asksWhatWeDo(msg.norm)) return composeWithFunnel(ctx, withData, "M_QUE_ES_ONIA", "pregunta_que_hacemos");

  // Pidio un humano con todas las letras (N3): el bot no puede contestarlo el mismo.
  if (intents.wantsHuman(msg.norm)) return handoffResult(ctx, withData, "pidio_hablar_con_humano");

  // La FAQ del dueño se sirve recien aca: ningun candado de arriba la reclamo, y la pregunta
  // SI tiene respuesta publicada — contestar un dato editable no puede robarle el turno a una
  // rama de plata, pero tampoco puede caer al descarte o al handoff generico teniendo respuesta.
  if (faqNegocio) {
    return composeWithFunnel(ctx, withData, "R_FAQ_NEGOCIO", "faq_negocio", { faq_respuesta: faqNegocio.body });
  }

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
      if (intents.isDemoTrigger(msg.norm, config)) {
        return welcomeResult(ctx, { ...base, botStage: "nuevo", qualification: {}, offScriptCount: 0, qualifyAsks: 0 });
      }
      // "ok gracias" despues de la salida no es una consulta: derivarlo le mandaba M5 al paciente
      // ("eso lo tiene que ver Sergio") y un aviso a Sergio Urcullo por nada. Lo demas sigue yendo
      // a un humano: el descarte pudo equivocarse, y ante la duda se deriva.
      if (intents.isCourtesy(msg.norm)) return finalize(ctx, base, [], [], ["cortesia_sin_respuesta"]);
      return handoffResult(ctx, base, "escribio_tras_descarte");
    case "demo_realizada":
      return handoffResult(ctx, base, "escribio_tras_la_demo");
    case "handoff_humano": {
      // DERIVAR NO ES QUE ALGUIEN HAYA LLEGADO. Aca decia "ya esta en manos de Sergio" y callaba
      // para siempre, pero `handoff_humano` lo prende el BOT al decidir derivar: nadie contesto
      // todavia. El candado legitimo es `humanTookOver` (mas arriba en step()), que se prende
      // cuando un humano ESCRIBE de verdad.
      //
      // Medido en produccion el 2026-09-03, conversacion 49 (widget de la web): Chatwoot entrego
      // el mensaje 287 y el bot lo proceso 4,08 s — corrio el turno entero y no produjo NADA. En
      // las 8 corridas horarias de la sonda la correlacion es perfecta: cada M5 ("eso lo tiene
      // que ver Sergio") dejaba mudo al mensaje siguiente. Del otro lado hay una persona que ve
      // su mensaje entregado y ninguna respuesta, nunca.
      //
      // LO QUE EL GUION PIDIO SE ESCUCHA, Y SE ESCUCHA SIEMPRE — no solo en el primer turno.
      // M5 cierra con «Si es urgente, decime "urgente" y lo marco» (y M8_SOPORTE igual). Hasta
      // el 2026-09-10 esa palabra no existia en ningun .mjs: caia en el acuse generico la
      // primera vez y en el `silencio` de abajo las siguientes. Lo mismo le pasaba a la senal
      // mas cara que existe — "quiero comprar el sistema, cuando puedo pagar" — que es el T5 de
      // la cola de la v1.0. Va ANTES del candado del acuse a proposito: el acuse se gasta con
      // el primer inbound y la compra casi siempre llega despues.
      //
      // UNA sola vez por conversacion, igual que el acuse: el aviso viaja a un canal que ya le
      // llega saturado a Sergio Urcullo, y repetirlo es apagarlo. El aviso del handoff ya salio
      // antes con `handoffResult`; este es OTRO, y por eso lleva kind propio.
      if (!base.urgenteAvisadoAt && intents.needsHumanNow(msg.norm)) {
        const razon = intents.wantsToBuy(msg.norm) ? "quiere_comprar" : "lo_marco_urgente";
        const marcado = { ...base, urgenteAvisadoAt: msg.receivedAt || new Date().toISOString() };
        return finalize(
          ctx,
          marcado,
          [say("M5_URGENTE", marcado, config)],
          [{ type: "notify_sergio", payload: { kind: "handoff_urgente", reason: razon, conversationKey: marcado.conversationKey, text: summarize(marcado, msg, razon, config) } }],
          [`handoff:${razon}`],
        );
      }
      // UNA sola vez: acusar cada mensaje seria spam, y encima taparia a Sergio cuando entre.
      if (base.handoffAckAt) {
        // El silencio de abajo asume que hay un humano del otro lado. Cuando NADIE tomo la
        // conversacion (`humanTookOver === false`) esa premisa es falsa: el bot se calla, el
        // aviso del handoff ya se gasto en el primer turno, y ningun barrido mira
        // `handoff_humano` (followup/insistencia/postdemo miran otras etapas). La persona queda
        // escribiendole a nadie sin que nadie se entere — medido el 2026-09-24 en `chatwoot:11`,
        // 14 dias asi. Se le sigue sin contestar (contestar cada insistencia es un loro que tapa
        // a Sergio Urcullo cuando entre), pero el silencio AVISA una vez.
        // `urgenteAvisadoAt` cuenta como avisado: si ya salio el aviso urgente por ESTA
        // conversacion, Sergio Urcullo ya sabe que esta caliente y un segundo aviso es el ruido
        // que apaga el canal. El caso que se rescata es el otro — el que insiste SIN decir la
        // palabra que el guion le pidio, que es el que nadie estaba viendo.
        if (!base.humanTookOver && !base.handoffMudoAvisadoAt && !base.urgenteAvisadoAt) {
          const marcado = { ...base, handoffMudoAvisadoAt: msg.receivedAt || new Date().toISOString() };
          return finalize(
            ctx,
            marcado,
            [],
            [{ type: "notify_sergio", payload: { kind: "handoff_sin_humano", reason: "handoff_sin_humano", conversationKey: marcado.conversationKey, text: summarize(marcado, msg, "handoff_sin_humano", config) } }],
            ["silencio:handoff_en_curso"],
          );
        }
        return finalize(ctx, base, [], [], ["silencio:handoff_en_curso"]);
      }
      const acusado = { ...base, handoffAckAt: msg.receivedAt || new Date().toISOString() };
      // Cero efectos: el aviso a Sergio y la cola de revision ya salieron con el handoff. Este
      // turno es solo decirle a la persona que su mensaje llego.
      return finalize(ctx, acusado, [say("M5_ACUSE", acusado, config)], [], ["handoff:acuse_de_recibo"]);
    }
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
    // NO ELIGIO: acá abajo el guion vuelve a PONER los dos horarios sobre la mesa, y los saca de
    // `activeSlots`, que prefiere `state.slotsOffered` — la FOTO del dia que nacio la charla.
    //
    // Es la mitad que faltaba de un defecto ya arreglado dos veces en este archivo: se curo al que
    // ELIGE (`slotSostenible(chosen)`, abajo) y al mensaje DIFERIDO (`buildFollowUp`), y quedo
    // libre el que solo MIRA. Volver dos dias despues y contestar cualquier otra cosa —contar el
    // negocio es la rama mas comun del guion— le pintaba "**A)** martes 15, 14:00" tres dias
    // despues de ese martes. Recien si elegia uno se enteraba de que habia caducado: la promesa
    // falsa llegaba primero a la pantalla.
    //
    // La firma es siempre la misma y vale la pena nombrarla: lo que DECIDE la rama se re-mide
    // contra los vigentes (`slotsPending(config)`, dos lineas mas abajo) y lo que HABLA lee el
    // estado. Aca se igualan. Pisar el estado es obligatorio, no cosmetico: sin eso el texto
    // ofrece los nuevos y el proximo "A" reserva el viejo.
    //
    // Va DENTRO de `!chosen` porque solo acá se RE-OFRECE. Lo que protege al camino de la
    // eleccion no es esta posicion —`ctx.slotChoice` ya viene resuelto desde `step()`, que lee
    // `activeSlots` con el estado sin pisar—, asi que adelantarlo no rompe nada hoy. Se anota
    // porque la version anterior de este comentario afirmaba lo contrario y la mutacion lo
    // refuto: quien mueva `slotChoice` adentro de este handler tiene que releer esto, o el "A"
    // de la foto se mapeara al "A" de hoy, que es otro dia, y le confirmaria una reunion que
    // nunca eligio — peor que el bug.
    //
    // El refresco cuelga de que la foto ya NO se sostenga, no de cada turno: dentro de la misma
    // charla el cron puede rotar los horarios y el "A" que leyo hace tres minutos no puede
    // cambiar bajo sus pies. Esa mitad la sostiene el caso 6 del test.
    const ahora = msg.receivedAt ? Date.parse(msg.receivedAt) : Date.now();
    if (slots.some((slot) => !slotSostenible(slot, ahora))) {
      base = { ...base, slotsOffered: config.slots.map((slot) => ({ ...slot })) };
    }

    if (intents.noSlotWorks(msg.norm)) return handoffResult(ctx, base, "ningun_horario_le_sirve");
    // Puso SU fecha/hora sobre la mesa sin elegir A ni B ("puedo el jueves a la 1", "el primero
    // de agosto viajo"): eso lo coordina un humano. Agendarle uno de los nuestros y decirle
    // "listo, agendado" es mandarlo a una reunion a la que nunca dijo que iba.
    if (intents.proposesOwnTime(msg.norm)) return handoffResult(ctx, base, "propone_otro_horario");
    // Contesto contando su negocio en vez de elegir: se le acusa recibo y se le vuelven a poner
    // los dos horarios. El dato queda guardado, asi que M2 despues no se lo vuelve a pedir.
    if (Object.keys(ctx.found || {}).length > 0) {
      // Sin horarios reales, M0b vuelve a ofrecer "**A)** HORARIO A (pendiente de definir)":
      // el prospecto no puede elegir NADA y la charla se estanca repitiendo la misma frase.
      // Medido el 2026-09-02: mensajes 2 y 3 salian identicos. Con slots pendientes se acusa
      // el dato y se pide el contacto, que es lo unico accionable sin agenda.
      const reply = say(slotsPending(config) ? "M0b_SIN_HORARIOS" : "M0b", base, config, { datos_que_si_dio: joinEs(capturedLabels(base.qualification, config)) });
      // El dato tambien va al CRM, no solo a la conversacion. Sin esto, quien contaba su negocio en
      // vez de elegir horario y despues se callaba quedaba en el CRM como "sin definir" y sin
      // ciudad: el rubro y el tamano vivian en `bot_conversations` y nadie los veia en el panel.
      // El estado del pipeline se manda EXPLICITO porque `buildLeadRow` cae a "Nuevo" si falta, y
      // sumar un dato no puede hacer retroceder un lead que ya estaba contactado.
      const effects = [
        {
          type: "lead_upsert",
          payload: {
            conversationKey: base.conversationKey,
            leadKey: base.leadKey,
            qualification: base.qualification,
            pipelineStatus: config.pipelineStatus.calificado,
          },
        },
      ];
      return finalize(ctx, base, [reply], effects, ["repregunta:horario"]);
    }
    return offScriptResult(ctx, base);
  }

  // EL HORARIO ELEGIDO SE RE-MIDE EN ESTE INSTANTE, no en el que se ofrecio. `slots` puede venir
  // de `state.slotsOffered`, que es una FOTO: la guarda `persistence.mjs` con el `pending` que el
  // horario tenia aquel dia y ese booleano no se recalcula nunca, asi que un horario del pasado
  // vuelve marcado como ofrecible y todo el camino lo acepta. Medido el 2026-09-18 en produccion:
  // doce conversaciones en `esperando_horario` guardaban horarios ya vencidos. A las viejas las
  // salva `conversacionVencida` (14 dias), pero la ventana normal no: el generador publica a
  // 24-48 h de anticipacion, asi que alcanza con que la persona conteste dos dias despues para
  // que "A" confirme una reunion de anteayer y dispare la reserva.
  //
  // No se le asigna en silencio uno de los vigentes: el "A" de hoy no es el "A" que el vio, y
  // confirmarle una reunion que nunca eligio seria peor que el bug. Se le dice, se le ponen los
  // de hoy sobre la mesa y elige de nuevo. `slotsOffered` se pisa con los vigentes — es la mitad
  // que evita que el proximo "A" vuelva a reservar el viejo.
  if (!slotSostenible(chosen, msg.receivedAt ? Date.parse(msg.receivedAt) : Date.now())) {
    const reOfrecido = { ...base, slotsOffered: config.slots.map((slot) => ({ ...slot })) };
    const reply = slotsPending(config)
      ? say("PENDING_HORARIO_SIN_HORARIOS", reOfrecido, config)
      : say("M0_HORARIO_CADUCO", reOfrecido, config, { slot_elegido: chosen.label });
    return finalize(ctx, reOfrecido, [reply], [], ["horario_caduco"]);
  }

  const next = {
    ...base,
    botStage: "demo_agendada",
    scheduledAt: chosen.startAt || null,
    scheduledLabel: chosen.label,
    // La foto guarda TODO lo que se le pudo elegir —el par que vio mas los libres que no se le
    // nombraron— y marca cual eligio. Se marcaba comparando `key`, y un horario que no es A ni B
    // no tiene letra: la conversacion quedaba guardada como si nadie hubiera elegido nada.
    slotsOffered: elegibleSlots(base, config).map((slot) => ({
      ...slot,
      chosen: claveDeSlot(slot) === claveDeSlot(chosen),
    })),
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
      payload: { kind: "demo_agendada", conversationKey: next.conversationKey, text: summarize(next, msg, `demo agendada ${chosen.label}`, config) },
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
      datos_que_si_dio: joinEs(capturedLabels(qualification, config)),
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
    datos_que_si_dio: joinEs(capturedLabels({ ...found, ...(pain ? { painPoint: pain } : {}) }, config)),
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

/**
 * Mensaje M3 + el estado con el paso reservado. Si no corresponde, devuelve null.
 *
 * LOS HORARIOS SE REFRESCAN, y por eso `slotsOffered` se pisa con los del config.
 *
 * El M3 es el unico mensaje del guion que sale un DIA DESPUES del turno que lo origino, y en el
 * medio corre el generador (`scripts/loops/renovar-slots-bot.py`, cron diario): los horarios que
 * la conversacion guardo cuando nacio ya no son los que Sergio tiene reservados, y el primero
 * suele haber cruzado el piso de anticipacion. `activeSlots` prefiere `state.slotsOffered` —
 * correcto para el turno en vivo, donde "A" tiene que seguir siendo la A que se ofrecio hace tres
 * minutos, y exactamente al reves aca, donde el texto promete "dos opciones NUEVAS".
 *
 * Era el mismo hecho con dos fuentes dentro del MISMO camino: el barrido ya decide si manda
 * mirando los vigentes (`blocked = slotsPending(config)`, followup-run.mjs) y despues escribia el
 * texto con los viejos, o sea la fuente que decide se re-mide y la que habla no.
 *
 * Medido contra produccion el 2026-09-18 19:17 UTC con un desconocido real esperando
 * (`chatwoot:58`): el rescate ofrecia "sábado 19 de septiembre, 09:00" — un horario que el
 * generador no publico (habia puesto el de las 14:00) y que quedaba a 17,7 h, debajo de las 24 h
 * que el propio `parseSlotsSpec` exige y que la coletilla del mismo mensaje promete. Si el
 * prospecto lo elegia, el bot le agendaba algo que Sergio no tenia libre.
 *
 * Pisar `slotsOffered` es la mitad que hace que el arreglo no sea peor que el bug: sin eso el
 * texto ofrece los nuevos y la respuesta "A" reserva el viejo. Si no hay vigentes, quedan los
 * placeholders `pending` y el guion cae solo a la rama SIN_HORARIOS — que es lo que el barrido ya
 * espera (`slots_sin_definir`, sin quemar la reserva).
 */
export function buildFollowUp(state, nowIso, config = DEFAULT_CONFIG) {
  if (!followUpDue(state, nowIso, config)) return null;
  const next = {
    ...state,
    slotsOffered: config.slots,
    followupStep: state.followupStep + 1,
    lastOutboundAt: nowIso,
  };
  return { nextState: next, reply: say("M3", next, config) };
}
