// ONIA — Chatbot propio (el que atiende "DEMO"): FOLLOW-UP UNICO (M3).
//
// Es el cron del embudo: barre las conversaciones que quedaron a medias, RESERVA cada una con el
// CAS y devuelve el mensaje M3 para que n8n lo envie. Une las dos piezas que ya estaban en
// persistence.mjs (`sweepFollowUpCandidates` + `reserveFollowUp`) con `buildFollowUp` del motor.
//
//   entrada : argumentos de CLI (no hay stdin)
//   salida  : texto legible (dry-run) o una linea JSON (--emit / --json)
//   codigo de salida: SIEMPRE 0. Un error se reporta en la salida, no reventando el proceso
//                     (si esto revienta, n8n reintenta y el prospecto recibe el follow-up dos veces).
//
// REGLAS DURAS
//   1. 22 h, no 24 (spec §3.6): el mensaje queda DENTRO de la ventana de servicio de 24 h de Meta,
//      asi que en WhatsApp no necesita plantilla HSM aprobada ni cuesta un mensaje utility.
//   2. UN solo follow-up por conversacion (regla N7). Despues, silencio: decide un humano.
//   3. La reserva es un CAS y va SIEMPRE ANTES de emitir. Si reserva 0 filas, NO se manda nada:
//      preferimos perder un follow-up a mandar dos (un duplicado quema el quality rating).
//   4. DETERMINISTA: el "ahora" entra por `--now` y viaja como parametro. Cero Date.now() dentro
//      de la logica (el unico esta en main(), en el borde, cuando no se paso --now).
//   5. TOLERANTE: sin base -> lista vacia + warning. Nunca tira.
//   6. NO se llama `saveConversation`: escribiria el estado ENTERO y podria pisar un
//      `human_took_over` que ocurrio entre el barrido y ahora. El CAS ya dejo `followup_step = 1`
//      y la bitacora va en `bot_messages` (append-only).
//
// Uso:
//   node followup-run.mjs                               dry-run: dice a quien le mandaria y que
//   node followup-run.mjs --now 2026-07-28T14:05:00Z    con un "ahora" fijo (reproducible)
//   node followup-run.mjs --emit                        reserva y devuelve el JSON para n8n
//   node followup-run.mjs --emit --limit 20
//   node followup-run.mjs --slots "jue 15:00@2026-07-30T19:00:00Z|vie 10:00@2026-07-31T14:00:00Z"
//
// Spec: hermes-content/docs/ONIA_CHATBOT_PROPIO_SPEC_20260725.md (§2.2 M3, §3.6 ventana, §4.6 CAS)
// Workflow B: hermes-content/deploy/vps-ops/bot/N8N_WORKFLOW.md §5

import { pathToFileURL } from "node:url";

import { DEFAULT_CONFIG, createBotConfig, slotsPending } from "./config.mjs";
import { buildFollowUp, followUpDue } from "./bot-engine.mjs";
import { createStore, stateFromRow } from "./persistence.mjs";
import { getAvailableSlots as getAvailableSlotsFromCalcom } from "./calcom-availability.mjs";

/** Estados donde el follow-up tiene sentido (mismos que el barrido en SQL). */
export const FOLLOWUP_STAGES = Object.freeze(["esperando_calificacion", "esperando_horario"]);

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

export function parseArgs(argv = []) {
  const args = { now: null, emit: false, json: false, limit: 50, slots: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = String(argv[index]);
    const value = () => argv[++index] ?? null;
    if (arg === "--emit") args.emit = true;
    else if (arg === "--dry-run") args.emit = false;
    else if (arg === "--json") args.json = true;
    else if (arg === "--now") args.now = value();
    else if (arg.startsWith("--now=")) args.now = arg.slice("--now=".length);
    else if (arg === "--limit") args.limit = Number(value());
    else if (arg.startsWith("--limit=")) args.limit = Number(arg.slice("--limit=".length));
    else if (arg === "--slots") args.slots = value();
    else if (arg.startsWith("--slots=")) args.slots = arg.slice("--slots=".length);
  }
  if (!Number.isFinite(args.limit) || args.limit <= 0) args.limit = 50;
  return args;
}

/** "jue 15:00@2026-07-30T19:00:00Z|vie 10:00@2026-07-31T14:00:00Z" -> slots del config. */
export function parseSlotsSpec(raw) {
  const text = String(raw || "").trim();
  if (!text) return null;
  return text
    .split("|")
    .slice(0, 2)
    .map((part, index) => {
      const [label, startAt] = part.split("@").map((piece) => (piece || "").trim());
      return {
        key: index === 0 ? "A" : "B",
        label: label || `opción ${index === 0 ? "A" : "B"}`,
        startAt: startAt || null,
        pending: false,
      };
    });
}

/** Config del barrido: DEFAULT_CONFIG + slots + dryRun. Nada mas se pisa desde la CLI. */
export function buildConfig(args = {}) {
  const overrides = {};
  const envDry = String(process.env.ONIA_BOT_DRY_RUN ?? "").toLowerCase();
  if (envDry === "false") overrides.dryRun = false;
  else if (envDry === "true") overrides.dryRun = true;

  const slots = parseSlotsSpec(args.slots || process.env.ONIA_BOT_SLOTS || "");
  if (slots) overrides.slots = slots;
  return Object.keys(overrides).length ? createBotConfig(overrides) : DEFAULT_CONFIG;
}

/**
 * Config REAL del barrido en producción: como buildConfig(), pero si nadie fijó los 2 horarios
 * a mano (ni `--slots`, ni ONIA_BOT_SLOTS) intenta traer disponibilidad real de Cal.com antes de
 * caer al placeholder DEMO_SLOTS (spec §9.1) — así el follow-up M3 deja de estar bloqueado por
 * un horario dictado a mano. Sólo la usa main() (el binario real); las 91 pruebas existentes
 * siguen usando buildConfig() sincrono e inyectable, sin red.
 */
export async function resolveConfig(args = {}, deps = {}) {
  const config = buildConfig(args);
  const explicit = Boolean(args.slots || process.env.ONIA_BOT_SLOTS);
  if (explicit) return config; // Sergio (o el operador) ya fijó los horarios a mano: no se pisa

  const getSlots = typeof deps.getAvailableSlots === "function" ? deps.getAvailableSlots : getAvailableSlotsFromCalcom;
  const live = await getSlots({ nowIso: deps.nowIso }, deps);
  if (!live || !Array.isArray(live.slots) || live.slots.length === 0) return config;
  return createBotConfig({ slots: live.slots, dryRun: config.dryRun });
}

// ---------------------------------------------------------------------------
// Helpers puros
// ---------------------------------------------------------------------------

export function hoursBetween(fromIso, toIso) {
  const from = Date.parse(fromIso);
  const to = Date.parse(toIso);
  if (!Number.isFinite(from) || !Number.isFinite(to)) return null;
  return (to - from) / 3600000;
}

/**
 * Por que ESTA fila no recibe follow-up. Mismo orden que followUpDue(): el barrido en SQL ya
 * filtra, pero la fila se vuelve a chequear en memoria (la base puede devolver de mas si el
 * indice quedo viejo, si alguien toco la fila entre el select y ahora, o si cambia el filtro).
 */
export function skipReason(state, nowIso, config = DEFAULT_CONFIG) {
  if (!state) return "fila_ilegible";
  if (state.humanTookOver) return "humano_a_cargo";
  if (state.optOutAt) return "opt_out";
  if (state.followupStep >= config.followUp.maxSteps) return "ya_tiene_followup";
  if (!FOLLOWUP_STAGES.includes(state.botStage)) return `estado_no_aplica:${state.botStage}`;
  if (!state.lastInboundAt) return "sin_last_inbound_at";
  const elapsed = hoursBetween(state.lastInboundAt, nowIso);
  if (elapsed === null) return "fecha_invalida";
  if (elapsed < config.followUp.afterHours) return `demasiado_pronto:${elapsed.toFixed(1)}h`;
  if (elapsed > config.followUp.staleAfterDays * 24) return `conversacion_muerta:${elapsed.toFixed(1)}h`;
  return null;
}

/** Clave DETERMINISTA del mensaje: reintentar el barrido no duplica la fila en bot_messages. */
export function followUpMessageKey(conversationKey, step) {
  return `followup:${conversationKey}:${step}`;
}

function deliveryStatusFor(state, config) {
  if (state.channel === "sim") return "simulated";
  return config.dryRun ? "skipped" : "sent";
}

// ---------------------------------------------------------------------------
// Barrido
// ---------------------------------------------------------------------------

/**
 * @param {object} options  { nowIso, emit?, limit? }  nowIso es OBLIGATORIO (determinismo)
 * @param {object} [deps]   { store, config } — inyectables para test
 * @returns {Promise<object>} { ok, now, mode, scanned, send[], skipped[], warnings[], notes[] }
 */
export async function runFollowUpSweep(options = {}, deps = {}) {
  const config = deps.config || DEFAULT_CONFIG;
  const store = deps.store || createStore();
  const nowIso = options.nowIso;
  const emit = options.emit === true;
  const limit = Number.isFinite(options.limit) && options.limit > 0 ? Math.floor(options.limit) : 50;

  const result = {
    ok: true,
    now: nowIso || null,
    mode: emit ? "emit" : "dry-run",
    dryRun: Boolean(config.dryRun),
    windowHours: config.followUp.afterHours,
    scanned: 0,
    send: [],
    skipped: [],
    notes: [],
    warnings: store.warnings,
  };

  if (!nowIso || !Number.isFinite(Date.parse(nowIso))) {
    result.ok = false;
    result.error = `--now invalido o ausente: ${String(nowIso)}`;
    return result;
  }

  const rows = await store.sweepFollowUpCandidates(nowIso, config, limit);
  if (!rows) {
    // Sin base o base caida: lista vacia. El motivo ya quedo en store.warnings.
    result.notes.push("barrido_sin_resultado");
    return result;
  }
  result.scanned = rows.length;

  // Sergio todavia no definio los 2 bloques de demo: M3 saldria con "HORARIO A (pendiente de
  // definir)". Se bloquea el envio ANTES del CAS (no se quema la unica reserva) y se dice quien
  // esta esperando. No fabricamos horarios.
  const blocked = rows.length > 0 && slotsPending(config);
  if (blocked) {
    result.notes.push("slots_sin_definir");
    store.warnings.push("followup: los 2 horarios de demo siguen sin definir — no se manda M3");
  }

  for (const row of rows) {
    const state = stateFromRow(row);
    const key = state?.conversationKey || row?.conversation_key || null;

    const reason = skipReason(state, nowIso, config);
    if (reason) {
      result.skipped.push({ conversationKey: key, reason });
      continue;
    }
    if (blocked) {
      result.skipped.push({ conversationKey: key, reason: "slots_sin_definir" });
      continue;
    }

    const built = buildFollowUp(state, nowIso, config);
    if (!built) {
      result.skipped.push({ conversationKey: key, reason: "no_corresponde" });
      continue;
    }

    const base = {
      conversationKey: key,
      channel: state.channel,
      contactRef: state.contactRef,
      displayName: state.displayName || null,
      botStage: state.botStage,
      followupStep: built.nextState.followupStep,
      silentHours: Number(hoursBetween(state.lastInboundAt, nowIso).toFixed(1)),
      templateKey: built.reply.templateKey,
      replySource: built.reply.replySource,
      text: built.reply.text,
    };

    if (!emit) {
      result.send.push({ ...base, reserved: false, deliveryStatus: "preview" });
      continue;
    }

    // --- CAS: la reserva va ANTES de emitir. false = otra corrida se la llevo; null = fallo de
    // base (tampoco se manda: sin reserva confirmada, mandar es arriesgarse a duplicar).
    const reserved = await store.reserveFollowUp(state.conversationKey, state.followupStep);
    if (reserved !== true) {
      result.skipped.push({ conversationKey: key, reason: reserved === false ? "ya_reservado" : "reserva_fallida" });
      continue;
    }

    const deliveryStatus = deliveryStatusFor(state, config);
    const wrote = await store.insertOutbound(
      [
        {
          messageKey: followUpMessageKey(state.conversationKey, built.nextState.followupStep),
          direction: "outbound",
          author: "bot",
          templateKey: built.reply.templateKey,
          replySource: built.reply.replySource,
          text: built.reply.text,
          deliveryStatus,
          stageBefore: state.botStage,
          stageAfter: built.nextState.botStage,
        },
      ],
      built.nextState,
      { raw: { followup: true, step: built.nextState.followupStep, now: nowIso } },
    );

    result.send.push({ ...base, reserved: true, deliveryStatus, logged: wrote === null ? false : wrote > 0 });
  }

  return result;
}

// ---------------------------------------------------------------------------
// Salida legible (dry-run)
// ---------------------------------------------------------------------------

export function renderHuman(result) {
  const lines = [
    `ONIA — follow-up M3 (${result.windowHours} h) · modo ${result.mode}${result.dryRun ? " · dryRun" : ""}`,
    `ahora: ${result.now} · candidatas del barrido: ${result.scanned}`,
    "",
  ];
  if (result.error) lines.push(`ERROR: ${result.error}`, "");

  lines.push(`${result.mode === "emit" ? "ENVIADAS" : "MANDARIA"} (${result.send.length})`);
  if (result.send.length === 0) lines.push("  (ninguna)");
  for (const item of result.send) {
    lines.push(
      `  ${item.conversationKey} [${item.channel}] ${item.displayName || "sin nombre"} — ${item.botStage}, callado hace ${item.silentHours} h`,
    );
    for (const line of String(item.text).split("\n")) lines.push(`      | ${line}`);
    lines.push("");
  }

  lines.push(`NO SE MANDA (${result.skipped.length})`);
  if (result.skipped.length === 0) lines.push("  (ninguna)");
  for (const item of result.skipped) lines.push(`  ${item.conversationKey} — ${item.reason}`);

  if (result.warnings.length) {
    lines.push("", "WARNINGS");
    for (const warning of result.warnings) lines.push(`  ${warning}`);
  }
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// main — solo cuando se ejecuta como binario, no cuando lo importa un test
// ---------------------------------------------------------------------------

export async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  try {
    // UNICO Date.now() del archivo, y en el borde: si no vino --now, se sella aca y viaja como
    // parametro. La logica de adentro nunca mira el reloj.
    const nowIso = args.now || new Date().toISOString();
    const config = await resolveConfig(args, { nowIso });
    const result = await runFollowUpSweep({ nowIso, emit: args.emit, limit: args.limit }, { config });
    const asJson = args.emit || args.json;
    process.stdout.write(`${asJson ? JSON.stringify(result) : renderHuman(result)}\n`);
  } catch (error) {
    // Falla hacia el silencio: send vacio. n8n no manda nada y el error queda a la vista.
    process.stdout.write(
      `${JSON.stringify({ ok: false, mode: args.emit ? "emit" : "dry-run", send: [], skipped: [], warnings: [], error: String(error?.message || error).slice(0, 300) })}\n`,
    );
  }
}

const invokedDirectly = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) main();
