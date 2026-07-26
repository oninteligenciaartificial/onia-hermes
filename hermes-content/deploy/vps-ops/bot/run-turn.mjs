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

import { createBotConfig, DEFAULT_CONFIG } from "./config.mjs";
import { createState, step, markHumanTakeover, LLM_PENDING } from "./bot-engine.mjs";
import { createStore } from "./persistence.mjs";
import { getAvailableSlots as getAvailableSlotsFromCalcom } from "./calcom-availability.mjs";

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

/** Config del turno: DEFAULT_CONFIG + slots + dryRun. Nada mas se pisa desde el canal. */
export function buildConfig(input) {
  const overrides = {};
  const envDry = String(process.env.ONIA_BOT_DRY_RUN ?? "").toLowerCase();
  if (typeof input.dry_run === "boolean") overrides.dryRun = input.dry_run;
  else if (envDry === "false") overrides.dryRun = false;
  else if (envDry === "true") overrides.dryRun = true;

  const slots = Array.isArray(input.slots) && input.slots.length ? input.slots : parseEnvSlots();
  if (slots) {
    overrides.slots = slots.slice(0, 2).map((slot, index) => ({
      key: slot.key || (index === 0 ? "A" : "B"),
      label: String(slot.label || "").trim() || `opción ${index === 0 ? "A" : "B"}`,
      startAt: slot.startAt || slot.start_at || null,
      pending: false,
    }));
  }
  return Object.keys(overrides).length ? createBotConfig(overrides) : DEFAULT_CONFIG;
}

/** ONIA_BOT_SLOTS="jueves 15:00@2026-07-30T19:00:00Z|viernes 10:00@2026-07-31T14:00:00Z" */
function parseEnvSlots() {
  const raw = String(process.env.ONIA_BOT_SLOTS || "").trim();
  if (!raw) return null;
  return raw.split("|").map((part) => {
    const [label, startAt] = part.split("@").map((piece) => (piece || "").trim());
    return { label, startAt: startAt || null };
  });
}

/**
 * Config REAL de producción: como buildConfig(), pero si nadie fijó horarios a mano (ni el
 * turno trae `slots`, ni ONIA_BOT_SLOTS) intenta traer disponibilidad real de Cal.com ANTES de
 * caer al placeholder DEMO_SLOTS (spec §9.1). Sólo la usa runTurn() cuando no le inyectan
 * `deps.config` (o sea: producción real, nunca los tests — todos inyectan config explícito).
 * Tolerante por contrato: si Cal.com no responde, se queda con buildConfig(input) tal cual.
 */
export async function resolveConfig(input, deps = {}) {
  const config = buildConfig(input);
  const explicitSlots = Array.isArray(input.slots) && input.slots.length > 0;
  const envSlots = Boolean(String(process.env.ONIA_BOT_SLOTS || "").trim());
  if (explicitSlots || envSlots) return config; // horario ya fijado a mano: no se pisa

  const getSlots = typeof deps.getAvailableSlots === "function" ? deps.getAvailableSlots : getAvailableSlotsFromCalcom;
  const live = await getSlots({ nowIso: input.received_at || input.receivedAt }, deps);
  if (!live || !Array.isArray(live.slots) || live.slots.length === 0) return config;
  return createBotConfig({ slots: live.slots, dryRun: config.dryRun });
}

// ---------------------------------------------------------------------------
// LLM (unica rama off-guion). Corre en LiteLLM, ya desplegado. Si no hay key: texto seguro.
// ---------------------------------------------------------------------------

async function askLiteLLM(request) {
  const base = process.env.LITELLM_BASE || "http://onia_selfhosted-litellm-1:4000/v1";
  const key = process.env.LITELLM_KEY || "";
  const model = process.env.ONIA_BOT_MODEL || "gpt-4o-mini";
  if (!key) return "";
  const system = [
    "Sos el asistente automático de una agencia boliviana. Hablás en voseo boliviano, informal y corto.",
    "Tu ÚNICA tarea es reformular la pregunta pendiente del embudo para que el prospecto la entienda.",
    "PROHIBIDO: dar precios, planes, features, cifras, plazos, casos de clientes o inventar datos.",
    "PROHIBIDO: prometer cualquier cosa. Máximo 2 frases. Nada de markdown.",
  ].join(" ");
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
    displayName: input.display_name || input.displayName || null,
    pieceKey: input.piece_key || input.pieceKey || null,
    sourceCampaign: input.source_campaign || input.sourceCampaign || null,
    ownerRoleKey: input.owner_role_key || "sergio",
  };
}

export function incomingFrom(input, nowIso) {
  const kind = ["text", "voice", "attachment"].includes(input.kind) ? input.kind : "text";
  const externalMessageId = input.message_key || input.messageKey || input.external_message_id || null;
  return {
    kind,
    text: String(input.text ?? ""),
    transcript: typeof input.transcript === "string" ? input.transcript : "",
    externalMessageId,
    receivedAt: input.received_at || input.receivedAt || nowIso,
    author: "contact",
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

function buildResponse({ state, stageBefore, config, replies, result, applied, saved, wrote, warnings }) {
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
    dryRun: Boolean(config.dryRun),
    send: replies.map((reply) => ({
      text: reply.text,
      templateKey: reply.templateKey,
      replySource: reply.replySource,
      deliveryStatus: reply.deliveryStatus,
      guardrailOk: reply.guardrail ? reply.guardrail.ok !== false : true,
    })),
    notify: deferred.filter((effect) => effect.type === "notify_sergio").map((effect) => effect.payload),
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
  let state = loaded || createState(seed);
  if (!loaded && store.enabled) store.warnings.push("estado en memoria: la conversación no se pudo cargar");
  if (input.human_takeover === true && !state.humanTookOver) state = markHumanTakeover(state, nowIso);

  // 2. step() es PURO: correrlo dos veces (con y sin LLM) no tiene efecto de red.
  const incoming = incomingFrom(input, nowIso);
  const stageBefore = state.botStage;
  let result = step(state, incoming, { config });

  // 3-4. Dedup: si el inbound ya estaba, el turno YA se proceso. Cortar antes de tocar nada.
  const claimed = await store.claimInbound(result.inbound, state, {
    externalMessageId: incoming.externalMessageId,
    raw: { kind: incoming.kind, receivedAt: incoming.receivedAt },
  });
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

  // 7. Bitacora + estado.
  const saved = await store.saveConversation(nextState);
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
    warnings: store.warnings,
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
