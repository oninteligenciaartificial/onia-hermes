// ONIA — Chatbot propio (el que atiende "DEMO"): PERSISTENCIA (PostgREST / schema onia_center).
//
// El motor (bot-engine.mjs) es PURO: devuelve `nextState`, `replies[]` y `sideEffects[]` y no toca
// nada. Este modulo es el UNICO que escribe. Reglas duras:
//
//   1. TOLERANTE POR CONTRATO: ninguna funcion tira. Ante fallo de red, 4xx, 5xx, JSON roto o
//      credenciales ausentes devuelve `null` (o `[]`) y apila el motivo en `store.warnings`.
//      El bot sigue respondiendo con el estado en memoria: una base caida NO deja mudo al bot.
//   2. APPEND-ONLY en bot_messages, con dedup por `message_key` (on conflict do nothing).
//      Si Telegram/Meta reentregan el mismo update, el segundo NO avanza el estado ni reenvia.
//   3. El follow-up se RESERVA con CAS antes de mandar (spec §4.6). 0 filas => no se manda nada.
//   4. `pipeline_status` de onia_center.leads solo acepta los 6 valores que entiende el panel:
//      Nuevo | Contactado | Reunion | Propuesta | Ganado | Perdido. Escribir otra cosa deja el
//      lead invisible en el pipeline; por eso pasa SIEMPRE por safePipelineStatus().
//
// Mismo patron de headers que el resto de hermes-content/deploy/vps-ops/*.mjs:
// apikey + Authorization + Accept-Profile/Content-Profile: onia_center.
//
// Spec: hermes-content/docs/ONIA_CHATBOT_PROPIO_SPEC_20260725.md (§4.5 tablas, §4.6 CAS, §5.2 pipeline)
// Migracion: supabase/migrations/20260725_onia_center_bot_conversations.sql

import { createState, STAGES } from "./bot-engine.mjs";
import { DEFAULT_CONFIG } from "./config.mjs";

// ---------------------------------------------------------------------------
// Constantes de contrato con la base
// ---------------------------------------------------------------------------

/** Valores EXACTOS que entiende el panel (onia-center-store.ts). No agregar por las tuyas. */
export const PIPELINE_STATUSES = Object.freeze([
  "Nuevo",
  "Contactado",
  "Reunion",
  "Propuesta",
  "Ganado",
  "Perdido",
]);

/** CHECK de bot_conversations.channel. */
export const CHANNELS = Object.freeze(["sim", "telegram", "whatsapp", "instagram", "chatwoot"]);

/** onia_center.leads.channel es texto libre; estas son las etiquetas que usa el panel. */
const CHANNEL_LABEL = Object.freeze({
  sim: "Simulador",
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  chatwoot: "Chatwoot",
});

const PRIORITIES = Object.freeze(["alta", "media", "baja"]);

// ---------------------------------------------------------------------------
// Helpers puros (testeables sin base)
// ---------------------------------------------------------------------------

export function safePipelineStatus(value, fallback = "Nuevo") {
  return PIPELINE_STATUSES.includes(value) ? value : fallback;
}

export function safeChannel(value) {
  return CHANNELS.includes(value) ? value : "sim";
}

export function safePriority(value, fallback = "media") {
  return PRIORITIES.includes(value) ? value : fallback;
}

/**
 * Slug ASCII estable para claves (`lead_key`, `review_key`, `audit_key`).
 * NFD + descarte de todo lo que no sea [a-z0-9]: las marcas de acento caen solas, sin
 * necesidad de un rango unicode literal en el fuente (que se corrompe al copiar archivos).
 */
export function slug(text, max = 60) {
  return String(text ?? "")
    .normalize("NFD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max) || "sin-clave";
}

/**
 * lead_key DETERMINISTA a partir de la conversacion: el mismo prospecto no genera dos leads
 * aunque el turno se reintente. (Los agentes viejos usan Date.now()+random; aca no sirve.)
 */
export function leadKeyFor(conversationKey) {
  return `bot-${slug(conversationKey, 48)}`;
}

/** Fila de bot_conversations -> estado del motor (inverso de toConversationRow). */
export function stateFromRow(row) {
  if (!row || typeof row !== "object") return null;
  const raw = row.raw && typeof row.raw === "object" ? row.raw : {};
  return createState({
    conversationKey: row.conversation_key,
    channel: row.channel,
    contactRef: row.contact_ref,
    // Vive en `raw` y no en columna propia: `raw` ya es el carril de los campos de estado que no
    // tienen columna (qualifyAsks, outboundSeq, scheduledLabel), asi que no hace falta un DDL en
    // produccion para dejar de guardar el id de conversacion como telefono del CRM.
    publicContact: raw.publicContact || null,
    displayName: row.display_name,
    botStage: STAGES.includes(row.bot_stage) ? row.bot_stage : "nuevo",
    pieceKey: row.piece_key,
    sourceCampaign: row.source_campaign,
    qualification: row.qualification || {},
    slotsOffered: Array.isArray(row.slots_offered) ? row.slots_offered : [],
    scheduledAt: row.scheduled_at,
    scheduledLabel: raw.scheduledLabel || null,
    calendarEventId: row.calendar_event_id,
    leadKey: row.lead_key,
    ownerRoleKey: row.owner_role_key || "sergio",
    humanTookOver: Boolean(row.human_took_over),
    humanTookOverAt: row.human_took_over_at,
    optInAt: row.opt_in_at,
    optInSource: row.opt_in_source,
    optOutAt: row.opt_out_at,
    followupStep: Number(row.followup_step) || 0,
    offScriptCount: Number(row.off_script_count) || 0,
    qualifyAsks: Number(raw.qualifyAsks) || 0,
    outboundSeq: Number(raw.outboundSeq) || 0,
    lastInboundAt: row.last_inbound_at,
    lastOutboundAt: row.last_outbound_at,
  });
}

/** Nombre de empresa SIN inventar: si no lo dio, se dice que no lo dio. */
function leadCompanyName(state) {
  // Ya NO se asume que todo lead es una clinica: el bot atiende cualquier rubro. Antes esto
  // escribia "Clinica de X" para TODOS, asi que una ferreteria entraba al CRM como consultorio.
  const city = state.qualification?.city ? ` (${state.qualification.city})` : "";
  const who = state.displayName ? String(state.displayName).trim() : "";
  const rubro = state.qualification?.industry ? String(state.qualification.industry).trim() : "";
  if (who) return `${who}${rubro ? ` — ${rubro}` : ""}${city}`.slice(0, 300);
  return `Negocio sin nombre${rubro ? ` — ${rubro}` : ""} — ${state.conversationKey}`.slice(0, 300);
}

/**
 * Fila de onia_center.leads derivada del estado. SQL equivalente:
 *
 *   insert into onia_center.leads (lead_key, company_name, business_type, city, public_contact,
 *          channel, source, contact_permission, origin_role_key, owner_role_key, pipeline_status,
 *          priority, pain_point, next_followup_at, data_complete, raw)
 *   values (...)
 *   on conflict (lead_key) do update set
 *          pipeline_status = excluded.pipeline_status, city = excluded.city,
 *          pain_point = coalesce(excluded.pain_point, onia_center.leads.pain_point),
 *          contact_permission = excluded.contact_permission, data_complete = excluded.data_complete,
 *          raw = onia_center.leads.raw || excluded.raw, updated_at = now();
 */
export function buildLeadRow(payload, state) {
  const q = { ...(state.qualification || {}), ...(payload.qualification || {}) };
  // Los 3 campos de calificacion cambiaron (rubro/tamano/ciudad). Con los viejos esto daba
  // SIEMPRE false y ningun lead se marcaba completo. `chairs` ahora es dato de rama dental,
  // NO requisito: exigirlo dejaria incompleto a todo negocio que no sea consultorio.
  const complete = Boolean(q.industry && q.teamSize && q.city);
  const status = safePipelineStatus(payload.pipelineStatus, "Nuevo");
  return {
    lead_key: state.leadKey || payload.leadKey || leadKeyFor(state.conversationKey),
    company_name: leadCompanyName(state),
    business_type: q.industry || null,
    city: q.city || null,
    country: "Bolivia",
    // El TELEFONO si lo hay; si no, se cae al `contactRef` de siempre. Sin este fallback un lead
    // del widget web (donde el contacto no da telefono) perderia hasta la referencia que tiene hoy.
    public_contact: state.publicContact || state.contactRef || null,
    channel: CHANNEL_LABEL[state.channel] || "Simulador",
    source: `bot:${payload.pieceKey || state.pieceKey || state.sourceCampaign || DEFAULT_CONFIG.botKey}`,
    contact_permission: state.optOutAt ? "no_contact" : state.optInAt ? "approved" : "pending",
    origin_role_key: state.ownerRoleKey || "sergio",
    owner_role_key: payload.ownerRoleKey || state.ownerRoleKey || "sergio",
    pipeline_status: status,
    priority: safePriority(payload.priority, status === "Reunion" ? "alta" : "media"),
    pain_point: q.painPoint || payload.painPoint || null,
    next_followup_at: state.scheduledAt || null,
    data_complete: complete,
    raw: {
      bot: DEFAULT_CONFIG.botKey,
      conversationKey: state.conversationKey,
      botStage: state.botStage,
      channel: state.channel,
      pieceKey: state.pieceKey || null,
      sourceCampaign: state.sourceCampaign || null,
      qualification: q,
      scheduledLabel: state.scheduledLabel || null,
    },
  };
}

/** Fila de bot_messages a partir de una reply/inbound del motor. */
/**
 * Lo que se guarda en `body` de un mensaje ENTRANTE. No es el texto: es un marcador.
 *
 * MINIMIZACION DE DATOS: no se persiste ningun dato del prospecto que no cambie el comportamiento
 * del sistema. El texto crudo de lo que escribe NO lo cambia — verificado en el codigo: nadie lee
 * `bot_messages.body`, ni el motor (`stateFromRow` solo hidrata `bot_conversations`) ni el LLM
 * (recibe el mensaje del turno en curso, nunca el historial). Estaba guardado "por si acaso".
 *
 * Lo que SI cambia el comportamiento ya se guarda aparte y estructurado: rubro, tamaño, ciudad y
 * dolor en `qualification`. De un "estoy enferma" no queda nada, porque no decide nada.
 *
 * La FILA se sigue escribiendo: es la reserva anti-duplicados (`message_key` unique). Lo unico que
 * se va es el contenido. Y no se pierde nada operativo: la conversacion entera vive en Chatwoot,
 * que es la bandeja y la herramienta para leerla — esto solo deja de DUPLICARLA en nuestra base.
 */
export const INBOUND_BODY_PLACEHOLDER = "(entrante — texto no persistido)";

export function buildMessageRow(message, state, extra = {}) {
  const guardrail = message.guardrail || { ok: true, violations: [] };
  const direction = message.direction === "inbound" ? "inbound" : "outbound";
  // El saliente SI se guarda entero: es NUESTRO guion, no un dato del prospecto, y es la unica
  // forma de auditar despues que fue exactamente lo que el bot dijo.
  const body =
    direction === "inbound"
      ? INBOUND_BODY_PLACEHOLDER
      : String(message.text ?? message.body ?? "").trim() || "(sin texto)";
  return {
    message_key: String(message.messageKey || "").slice(0, 400),
    conversation_key: state.conversationKey,
    direction,
    author: ["contact", "bot", "human"].includes(message.author) ? message.author : "bot",
    body,
    template_key: message.templateKey || null,
    reply_source: ["script", "llm", "human"].includes(message.replySource) ? message.replySource : "script",
    stage_before: message.stageBefore || null,
    stage_after: message.stageAfter || null,
    guardrail_ok: guardrail.ok !== false,
    guardrail_violations: Array.isArray(guardrail.violations) ? guardrail.violations : [],
    delivery_status: ["simulated", "skipped", "sent", "failed"].includes(message.deliveryStatus)
      ? message.deliveryStatus
      : "simulated",
    external_message_id: extra.externalMessageId || null,
    raw: extra.raw || {},
  };
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

const ENV_URL = () => process.env.ONIA_CENTER_SUPABASE_URL || process.env.SUPABASE_URL || "";
const ENV_KEY = () =>
  process.env.ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * @param {object} [options] { url, key, fetch, timeoutMs }
 * @returns store tolerante. `store.enabled === false` => modo sin base (todo devuelve null).
 */
export function createStore(options = {}) {
  const url = String(options.url ?? ENV_URL()).replace(/\/+$/, "");
  const key = String(options.key ?? ENV_KEY());
  const doFetch = options.fetch || globalThis.fetch;
  const timeoutMs = Number(options.timeoutMs) > 0 ? Number(options.timeoutMs) : 8000;
  const enabled = Boolean(url && key && typeof doFetch === "function");
  const warnings = [];

  function warn(scope, detail) {
    warnings.push(`${scope}: ${String(detail).slice(0, 200)}`);
    return null;
  }

  function headers(extra) {
    return {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Accept-Profile": "onia_center",
      "Content-Profile": "onia_center",
      "Content-Type": "application/json",
      ...(extra || {}),
    };
  }

  /** Unico punto de red. Devuelve un array (PostgREST) o null. NUNCA tira. */
  async function rest(scope, path, init = {}) {
    if (!enabled) return warn(scope, "sin credenciales de Supabase (modo memoria)");
    try {
      const res = await doFetch(`${url}/rest/v1/${path}`, {
        ...init,
        headers: headers(init.headers),
        signal: init.signal || (AbortSignal.timeout ? AbortSignal.timeout(timeoutMs) : undefined),
      });
      const text = await res.text();
      if (!res.ok) return warn(scope, `HTTP ${res.status} ${text.slice(0, 160)}`);
      if (!text) return [];
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      return warn(scope, error?.message || error);
    }
  }

  const eq = (value) => `eq.${encodeURIComponent(String(value))}`;

  // -------------------------------------------------------------------------
  // bot_conversations
  // -------------------------------------------------------------------------

  async function loadConversation(conversationKey) {
    const rows = await rest("loadConversation", `bot_conversations?conversation_key=${eq(conversationKey)}&limit=1`);
    if (!rows) return null;
    return rows.length ? { row: rows[0], state: stateFromRow(rows[0]) } : { row: null, state: null };
  }

  /**
   * Carga la conversacion; si no existe la crea con el seed. Devuelve el estado o null si no hay
   * base (el llamador arranca con createState() en memoria).
   *   insert into onia_center.bot_conversations (...) values (...)
   *   on conflict (conversation_key) do nothing returning *;
   */
  async function ensureConversation(seed) {
    const found = await loadConversation(seed.conversationKey);
    if (found === null) return null;
    if (found.state) return found.state;
    const inserted = await rest("ensureConversation", "bot_conversations?on_conflict=conversation_key", {
      method: "POST",
      headers: { Prefer: "resolution=ignore-duplicates,return=representation" },
      body: JSON.stringify({
        conversation_key: seed.conversationKey,
        channel: safeChannel(seed.channel),
        contact_ref: String(seed.contactRef || "sin-contacto"),
        display_name: seed.displayName || null,
        bot_stage: "nuevo",
        piece_key: seed.pieceKey || null,
        source_campaign: seed.sourceCampaign || null,
        owner_role_key: seed.ownerRoleKey || "sergio",
      }),
    });
    if (!inserted) return null;
    if (inserted.length) return stateFromRow(inserted[0]);
    const retry = await loadConversation(seed.conversationKey); // carrera: otro turno la creo primero
    return retry?.state || null;
  }

  /** UPDATE del estado completo. `raw` se MERGEA con lo que ya habia (no se pisa). */
  async function saveConversation(state, previousRaw = {}) {
    const patch = {
      channel: safeChannel(state.channel),
      contact_ref: state.contactRef,
      display_name: state.displayName || null,
      bot_stage: STAGES.includes(state.botStage) ? state.botStage : "nuevo",
      piece_key: state.pieceKey || null,
      source_campaign: state.sourceCampaign || null,
      qualification: state.qualification || {},
      slots_offered: state.slotsOffered || [],
      scheduled_at: state.scheduledAt || null,
      calendar_event_id: state.calendarEventId || null,
      lead_key: state.leadKey || null,
      owner_role_key: state.ownerRoleKey || "sergio",
      human_took_over: Boolean(state.humanTookOver),
      human_took_over_at: state.humanTookOverAt || null,
      opt_in_at: state.optInAt || null,
      opt_in_source: state.optInSource || null,
      opt_out_at: state.optOutAt || null,
      followup_step: state.followupStep || 0,
      off_script_count: state.offScriptCount || 0,
      last_inbound_at: state.lastInboundAt || null,
      last_outbound_at: state.lastOutboundAt || null,
      raw: {
        ...(previousRaw && typeof previousRaw === "object" ? previousRaw : {}),
        qualifyAsks: state.qualifyAsks || 0,
        outboundSeq: state.outboundSeq || 0,
        scheduledLabel: state.scheduledLabel || null,
        publicContact: state.publicContact || null,
      },
    };
    const rows = await rest("saveConversation", `bot_conversations?conversation_key=${eq(state.conversationKey)}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(patch),
    });
    return rows && rows.length ? rows[0] : null;
  }

  // -------------------------------------------------------------------------
  // bot_messages (append-only + dedup)
  // -------------------------------------------------------------------------

  /**
   * Reserva el mensaje entrante. Es EL dedup del pipeline (spec §5.2 paso 4).
   * @returns true = ganamos el turno · false = reentrega (no hacer nada) · null = sin base
   */
  async function claimInbound(message, state, extra = {}) {
    const rows = await rest("claimInbound", "bot_messages?on_conflict=message_key", {
      method: "POST",
      headers: { Prefer: "resolution=ignore-duplicates,return=representation" },
      body: JSON.stringify({ ...buildMessageRow({ ...message, author: message.author || "contact" }, state, extra), delivery_status: "sent" }),
    });
    if (!rows) return null;
    return rows.length > 0;
  }

  /** Bitacora de las respuestas del bot. Devuelve cuantas entraron (0 = ya estaban) o null. */
  async function insertOutbound(replies, state, extra = {}) {
    const list = (replies || []).filter(Boolean);
    if (list.length === 0) return 0;
    const rows = await rest("insertOutbound", "bot_messages?on_conflict=message_key", {
      method: "POST",
      headers: { Prefer: "resolution=ignore-duplicates,return=representation" },
      body: JSON.stringify(list.map((reply) => buildMessageRow(reply, state, extra))),
    });
    return rows ? rows.length : null;
  }

  // -------------------------------------------------------------------------
  // Follow-up: reserva CAS + barrido (spec §4.6)
  // -------------------------------------------------------------------------

  /**
   * update onia_center.bot_conversations set followup_step = 1
   *  where conversation_key = $1 and followup_step = 0
   *    and human_took_over = false and opt_out_at is null returning conversation_key;
   * 0 filas => NO se manda. Preferimos perder un follow-up a mandar dos.
   * @returns true reservado · false ya estaba tomado · null sin base
   */
  async function reserveFollowUp(conversationKey, expectedStep = 0) {
    const filter = [
      `conversation_key=${eq(conversationKey)}`,
      `followup_step=eq.${Number(expectedStep) || 0}`,
      "human_took_over=is.false",
      "opt_out_at=is.null",
    ].join("&");
    const rows = await rest("reserveFollowUp", `bot_conversations?${filter}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ followup_step: (Number(expectedStep) || 0) + 1 }),
    });
    if (!rows) return null;
    return rows.length > 0;
  }

  /**
   * Barrido del cron: candidatas a follow-up (inactividad de 20 h hasta `staleAfterDays`).
   *
   * EL PISO CAMBIO DOS VECES, y las dos por el mismo motivo — que vuelvan SOLO filas accionables:
   *   1. Era `staleAfterDays` (7 dias) y rompia el barrido: el orden es `last_inbound_at.asc` (mas
   *      viejas primero) y hay `limit`, asi que una cola de conversaciones VENCIDAS se comia el
   *      lote entero y las que si estaban a tiempo no se procesaban nunca.
   *   2. Se apreto a la ventana de 24 h de Meta, porque afuera de ella no habia NADA que mandar
   *      (el texto libre falla con 131047 y no existia plantilla aprobada).
   * Hoy `seguimiento_demo` esta aprobada: afuera de la ventana el mensaje SI se puede mandar, como
   * plantilla. O sea que esas filas volvieron a ser accionables y el piso vuelve a `staleAfterDays`
   * — el problema (1) ya no aplica porque no quedan filas "vencidas pero inutiles" en el rango.
   * El corte de verdad, el que dice a los 8 dias no se escribe ni con plantilla, lo pone
   * `conversacion_muerta` en followup-run.mjs.
   */
  async function sweepFollowUpCandidates(nowIso, config = DEFAULT_CONFIG, limit = 50) {
    const now = Date.parse(nowIso);
    if (!Number.isFinite(now)) return warn("sweepFollowUpCandidates", `nowIso invalido: ${nowIso}`);
    const staleHoras = (config.followUp.staleAfterDays ?? DEFAULT_CONFIG.followUp.staleAfterDays) * 24;
    const from = new Date(now - staleHoras * 3600000).toISOString();
    const to = new Date(now - config.followUp.afterHours * 3600000).toISOString();
    const filter = [
      "followup_step=eq.0",
      "human_took_over=is.false",
      "opt_out_at=is.null",
      "bot_stage=in.(esperando_calificacion,esperando_horario)",
      `last_inbound_at=gte.${from}`,
      `last_inbound_at=lte.${to}`,
      "order=last_inbound_at.asc",
      `limit=${Number(limit) || 50}`,
    ].join("&");
    return rest("sweepFollowUpCandidates", `bot_conversations?${filter}`);
  }

  /**
   * Barrido del recordatorio (M9): demos agendadas que empiezan DENTRO de las proximas
   * `reminder.leadHours` horas.
   *
   * NO filtra por `last_inbound_at` a proposito, y esa es la diferencia importante con el barrido
   * del follow-up. La ventana de servicio de 24 h de Meta se chequea DESPUES, en memoria, para que
   * la demo que no se puede avisar aparezca en la salida con el motivo `fuera_de_ventana` en vez
   * de desaparecer del listado: es exactamente el caso en que Sergio tiene que escribir el a mano.
   * El lote es chico (las demos de las proximas horas), asi que traerlas todas no cuesta nada.
   *
   * Tampoco filtra "ya recordadas": no hay columna para eso. La reserva es la clave unica de
   * `bot_messages` (ver reminder-run.mjs), asi que en modo --emit un segundo barrido no manda dos;
   * en dry-run la misma demo se lista de nuevo, y es lo correcto: el dry-run no reserva nada.
   */
  async function sweepDemoReminders(nowIso, config = DEFAULT_CONFIG, limit = 50) {
    const now = Date.parse(nowIso);
    if (!Number.isFinite(now)) return warn("sweepDemoReminders", `nowIso invalido: ${nowIso}`);
    const leadHours = config.reminder?.leadHours ?? DEFAULT_CONFIG.reminder.leadHours;
    const filter = [
      "bot_stage=eq.demo_agendada",
      "human_took_over=is.false",
      "opt_out_at=is.null",
      `scheduled_at=gte.${new Date(now).toISOString()}`,
      `scheduled_at=lte.${new Date(now + leadHours * 3600000).toISOString()}`,
      "order=scheduled_at.asc",
      `limit=${Number(limit) || 50}`,
    ].join("&");
    return rest("sweepDemoReminders", `bot_conversations?${filter}`);
  }

  // -------------------------------------------------------------------------
  // Efectos laterales: leads, review_queue, audit_logs
  // -------------------------------------------------------------------------

  /** Crea o actualiza el lead del CRM. Devuelve el lead_key (para guardarlo en la conversacion). */
  async function upsertLead(payload = {}, state) {
    const row = buildLeadRow(payload, state);
    const existing = await rest("upsertLead.load", `leads?lead_key=${eq(row.lead_key)}&select=lead_key,raw&limit=1`);
    if (!existing) return null;
    if (existing.length === 0) {
      const created = await rest("upsertLead.insert", "leads?on_conflict=lead_key", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify(row),
      });
      return created && created.length ? created[0].lead_key : created ? row.lead_key : null;
    }
    // Ya existe: se actualiza SOLO lo que el bot sabe. No se pisan notas ni prioridad de un humano.
    const merged = { ...(existing[0].raw || {}), ...row.raw };
    const patch = {
      pipeline_status: row.pipeline_status,
      city: row.city,
      contact_permission: row.contact_permission,
      data_complete: row.data_complete,
      next_followup_at: row.next_followup_at,
      raw: merged,
    };
    if (row.pain_point) patch.pain_point = row.pain_point;
    // Solo cuando hay TELEFONO de verdad. Sin este guard, un lead al que un humano ya le corrigio
    // el contacto a mano quedaria pisado con el id de conversacion en cada turno siguiente.
    if (state.publicContact) patch.public_contact = state.publicContact;
    const updated = await rest("upsertLead.patch", `leads?lead_key=${eq(row.lead_key)}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(patch),
    });
    return updated ? row.lead_key : null;
  }

  /**
   * Cola de aprobacion del handoff. `review_key` es DETERMINISTA por turno
   * (`rev-bot-<conversacion>-<seq>`): un reintento del mismo turno no duplica la tarjeta.
   *   insert into onia_center.review_queue (...) on conflict (review_key) do nothing;
   */
  async function enqueueReview(payload = {}, state, seq = 0) {
    const reviewKey = `rev-bot-${slug(state.conversationKey, 40)}-${seq}`;
    const rows = await rest("enqueueReview", "review_queue?on_conflict=review_key", {
      method: "POST",
      headers: { Prefer: "resolution=ignore-duplicates,return=representation" },
      body: JSON.stringify({
        review_key: reviewKey,
        // 'lead' ya esta en el CHECK de review_queue: el handoff no necesita ALTER de la tabla.
        source_type: "lead",
        source_key: state.leadKey || payload.leadKey || state.conversationKey,
        title: `Bot: conversación para ${state.ownerRoleKey || "sergio"} — ${state.conversationKey}`.slice(0, 240),
        priority: safePriority(payload.priority, "alta"),
        status: ["pending", "approved", "rejected", "needs_changes"].includes(payload.status) ? payload.status : "pending",
        reviewer_role_key: payload.reviewerRoleKey || "sergio",
        sensitive: payload.sensitive !== false,
        raw: {
          bot: DEFAULT_CONFIG.botKey,
          conversationKey: state.conversationKey,
          channel: state.channel,
          contactRef: state.contactRef,
          botStage: state.botStage,
          qualification: state.qualification || {},
          summary: payload.summary || null,
        },
      }),
    });
    return rows ? reviewKey : null;
  }

  async function writeAudit(payload = {}, state, seq = 0) {
    const auditKey = `aud-bot-${slug(state.conversationKey, 40)}-${seq}`;
    const rows = await rest("writeAudit", "audit_logs?on_conflict=audit_key", {
      method: "POST",
      headers: { Prefer: "resolution=ignore-duplicates,return=representation" },
      body: JSON.stringify({
        audit_key: auditKey,
        actor_role_key: state.ownerRoleKey || "sergio",
        action: payload.action || "bot_stage_change",
        entity_table: "onia_center.bot_conversations",
        entity_key: state.conversationKey,
        sensitivity_scope: "internal_restricted",
        summary: `${payload.action || "bot"} ${JSON.stringify(payload.detail || {})}`.slice(0, 500),
        raw: { bot: DEFAULT_CONFIG.botKey, ...payload },
      }),
    });
    return rows ? auditKey : null;
  }

  /**
   * Aplica los efectos que SI son de base. Los que necesitan un servicio externo
   * (calendario, Telegram, LLM) se devuelven en `deferred` para que los haga n8n.
   */
  async function applySideEffects(effects, state, seq = 0) {
    const applied = { leadKey: state.leadKey || null, reviewKeys: [], auditKeys: [], deferred: [], failed: [] };
    let current = state;
    for (const effect of effects || []) {
      if (!effect || !effect.type) continue;
      if (effect.type === "lead_upsert") {
        const leadKey = await upsertLead(effect.payload || {}, current);
        if (leadKey) {
          applied.leadKey = leadKey;
          current = { ...current, leadKey };
        } else applied.failed.push("lead_upsert");
        continue;
      }
      if (effect.type === "review_queue") {
        const reviewKey = await enqueueReview(effect.payload || {}, current, seq);
        if (reviewKey) applied.reviewKeys.push(reviewKey);
        else applied.failed.push("review_queue");
        continue;
      }
      if (effect.type === "audit_log") {
        const auditKey = await writeAudit(effect.payload || {}, current, seq);
        if (auditKey) applied.auditKeys.push(auditKey);
        else applied.failed.push("audit_log");
        continue;
      }
      applied.deferred.push(effect); // calendar_event · notify_sergio · llm_request · stage_change
    }
    return applied;
  }

  return {
    enabled,
    warnings,
    loadConversation,
    ensureConversation,
    saveConversation,
    claimInbound,
    insertOutbound,
    reserveFollowUp,
    sweepFollowUpCandidates,
    sweepDemoReminders,
    upsertLead,
    enqueueReview,
    writeAudit,
    applySideEffects,
  };
}
