// ONIA — Chatbot propio (el que atiende "DEMO"): RECORDATORIO DEL DIA DE LA DEMO (M9).
//
// Es el segundo cron del embudo: barre las demos que empiezan dentro de las proximas horas y
// devuelve el mensaje con el link para que n8n lo envie. Hermano de followup-run.mjs, mismo
// contrato de CLI y misma disciplina.
//
//   entrada : argumentos de CLI (no hay stdin)
//   salida  : texto legible (dry-run) o una linea JSON (--emit / --json)
//   codigo de salida: SIEMPRE 0. Un error se reporta en la salida, no reventando el proceso
//                     (si esto revienta, n8n reintenta y el prospecto recibe el recordatorio dos veces).
//
// REGLAS DURAS
//   1. LA VENTANA DE META DECIDE EL CARRIL, ya no si se manda. Se cierra a las 24 h del ULTIMO
//      MENSAJE ENTRANTE del prospecto. Dentro: texto libre M9 (gratis). Fuera: la plantilla
//      aprobada `recordatorio_demo` (UTILITY, ~0,0113 USD). Antes, sin plantilla aprobada, quien
//      reservaba para dentro de 3 dias se descartaba con `fuera_de_ventana` y no recibia nada —
//      que era justo el caso mas comun de este barrido.
//      El link igual NO depende de esto: sale en M2, cuando la ventana esta abierta seguro (el
//      prospecto acaba de escribir). Esto es un RECORDATORIO, no la unica entrega del link.
//   2. UNO SOLO POR DEMO. La reserva es la clave unica de `bot_messages`
//      (`recordatorio:<conversacion>:<inicio>`): el insert con `on_conflict` devuelve 1 fila si
//      gano la carrera y 0 si ya estaba. Va SIEMPRE ANTES de emitir. Sin reserva confirmada no se
//      manda: preferimos perder un recordatorio a mandar dos (un duplicado quema el quality rating).
//      Es el MISMO mecanismo con el que el pipeline dedupea los entrantes (claimInbound), no un
//      invento nuevo — y no necesita columna nueva, o sea que no hay migracion pendiente.
//   3. SIN LINK NO SE MANDA. Si la reserva en Cal.com fallo, `calendar_event_id` quedo null y no
//      hay nada que recordar; se descarta con `sin_link` (que es justo lo que Sergio tiene que
//      arreglar) en vez de mandar un recordatorio a medias.
//   4. DETERMINISTA: el "ahora" entra por `--now` y viaja como parametro. Cero Date.now() dentro
//      de la logica (el unico esta en main(), en el borde, cuando no se paso --now).
//   5. TOLERANTE: sin base -> lista vacia + warning. Nunca tira.
//   6. NO se llama `saveConversation`: el recordatorio no mueve la maquina de estados. Escribir el
//      estado ENTERO podria pisar un `human_took_over` que ocurrio entre el barrido y ahora.
//
// Uso:
//   node reminder-run.mjs                               dry-run: dice a quien le mandaria y que
//   node reminder-run.mjs --now 2026-07-30T15:00:00Z    con un "ahora" fijo (reproducible)
//   node reminder-run.mjs --emit                        reserva y devuelve el JSON para n8n
//   node reminder-run.mjs --emit --limit 20
//
// Spec: hermes-content/docs/ONIA_CHATBOT_PROPIO_SPEC_20260725.md (§3.6 ventana, §4.6 CAS)

import { pathToFileURL } from "node:url";

import { DEFAULT_CONFIG, createBotConfig, localHour, renderTemplate } from "./config.mjs";
import { cuotaAgotada, withKnowledge } from "./knowledge.mjs";
import { createStore, stateFromRow } from "./persistence.mjs";
import { MOTIVO_NUESTRA, cargarInboxesDePrueba, esConversacionNuestra } from "./es-nuestra.mjs";
import { whatsappTemplate } from "./chatwoot-adapter.mjs";
import { meetingLink } from "./calcom-booking.mjs";
import { formatSlotLabel } from "./calcom-availability.mjs";
import { deliver, hoursBetween, outsideWindow } from "./followup-run.mjs";

/** Unico estado donde un recordatorio tiene sentido: la demo esta reservada. */
export const REMINDER_STAGE = "demo_agendada";

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

export function parseArgs(argv = []) {
  const args = { now: null, emit: false, json: false, limit: 50 };
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
  }
  if (!Number.isFinite(args.limit) || args.limit <= 0) args.limit = 50;
  return args;
}

/**
 * Config del barrido: DEFAULT_CONFIG + dryRun del entorno + los HECHOS editables (knowledge.json).
 * No hay `--slots`: el recordatorio no ofrece horarios, recuerda el que ya se reservo.
 */
export function buildConfig() {
  const overrides = {};
  const envDry = String(process.env.ONIA_BOT_DRY_RUN ?? "").toLowerCase();
  if (envDry === "false") overrides.dryRun = false;
  else if (envDry === "true") overrides.dryRun = true;
  return withKnowledge(Object.keys(overrides).length ? createBotConfig(overrides) : DEFAULT_CONFIG);
}

// ---------------------------------------------------------------------------
// Helpers puros
// ---------------------------------------------------------------------------

// La hora local se mudo a config.mjs cuando el follow-up necesito la MISMA cuenta para decidir lo
// mismo (si es hora de escribirle a una persona). Se re-exporta para no romper a quien la importa
// de aca; la definicion es una sola.
export { localHour };

/**
 * Por que ESTA demo no recibe recordatorio. El barrido en SQL ya filtra, pero la fila se vuelve a
 * chequear en memoria (la base puede devolver de mas, y la ventana de Meta NO se filtra en SQL a
 * proposito — ver sweepDemoReminders). El orden es de mas definitivo a mas transitorio: primero lo
 * que no se arregla esperando, al final lo que sale solo en el proximo barrido.
 */
export function skipReason(state, nowIso, config = DEFAULT_CONFIG) {
  if (!state) return "fila_ilegible";
  // DEFINITIVO: quien es el contacto no se arregla esperando. Una demo "agendada" contra nuestra
  // propia sonda no lleva recordatorio (ver `es-nuestra.mjs`).
  if (esConversacionNuestra(state)) return MOTIVO_NUESTRA;
  if (state.humanTookOver) return "humano_a_cargo";
  if (state.optOutAt) return "opt_out";
  if (state.botStage !== REMINDER_STAGE) return `estado_no_aplica:${state.botStage}`;
  if (!state.scheduledAt) return "sin_horario";

  const faltan = hoursBetween(nowIso, state.scheduledAt);
  if (faltan === null) return "fecha_invalida";
  if (faltan < 0) return `demo_ya_paso:${Math.abs(faltan).toFixed(1)}h`;
  const lead = config.reminder?.leadHours ?? DEFAULT_CONFIG.reminder.leadHours;
  if (faltan > lead) return `todavia_lejos:${faltan.toFixed(1)}h`;

  // Sin uid de Cal.com no hay link, y un recordatorio sin link no recuerda nada: la reserva fallo
  // y eso lo tiene que resolver un humano.
  if (!state.calendarEventId) return "sin_link";

  // La ventana de servicio de Meta se cuenta desde el ULTIMO mensaje ENTRANTE, y sin ese dato no se
  // puede saber de que lado estamos: se descarta en vez de adivinar (que aca costaria plata).
  // Estar FUERA de la ventana ya NO descarta: sale la plantilla `recordatorio_demo` (ver
  // buildReminder). Lo que se necesita es saber DONDE estamos, no cerrar la puerta.
  if (!state.lastInboundAt) return "sin_last_inbound_at";
  if (hoursBetween(state.lastInboundAt, nowIso) === null) return "fecha_invalida";

  // TRANSITORIO y va al final: la fila sigue elegible y sale en el primer barrido de la mañana.
  const hora = localHour(nowIso, config);
  const desde = config.reminder?.quietBeforeHour ?? DEFAULT_CONFIG.reminder.quietBeforeHour;
  if (hora !== null && hora < desde) return `horario_silencioso:${hora}h`;

  return null;
}

/**
 * Clave DETERMINISTA del mensaje. Lleva el inicio de la demo, no un contador: reintentar el
 * barrido no duplica, y si la demo se REPROGRAMA (otro `scheduled_at`) si corresponde recordarla
 * de nuevo — que es lo correcto, es otra reunion.
 */
export function reminderMessageKey(conversationKey, scheduledAt) {
  return `recordatorio:${conversationKey}:${scheduledAt}`;
}

/**
 * Mensaje M9 listo para enviar. Texto fijo del guion: no pasa por el LLM.
 *
 * DOS CARRILES, y el que decide es la ventana de Meta:
 *   - dentro : texto libre M9_RECORDATORIO. Gratis y con el formato de siempre.
 *   - fuera  : la plantilla aprobada `recordatorio_demo` (UTILITY, ~0,0113 USD). Es el caso NORMAL
 *              de este barrido, no el raro: quien reservo para dentro de 3 dias esta fuera de la
 *              ventana casi seguro. Antes se descartaba y el recordatorio no existia para el.
 * Las dos variables ya estan garantizadas por quien llama (label del horario y link de la reunion):
 * sin link no se llega hasta aca (`sin_link`), y una variable vacia rompe la plantilla en Meta.
 */
export function buildReminder(state, link, config = DEFAULT_CONFIG, outOfWindow = false) {
  const tz = config.businessHours?.tzLabel || DEFAULT_CONFIG.businessHours.tzLabel;
  const label = state.scheduledLabel || formatSlotLabel(state.scheduledAt, tz);

  if (outOfWindow) {
    return {
      templateKey: "M9_PLANTILLA",
      replySource: "script",
      // Las variables son POSICIONALES: {{1}} = dia y hora, {{2}} = link. Es el orden con el que
      // la plantilla quedo aprobada en Meta; invertirlo manda el link donde va la fecha.
      text: renderTemplate(config.script.M9_PLANTILLA, { 1: label, 2: link }),
      scheduledLabel: label,
      templateName: "recordatorio_demo",
      templateParams: whatsappTemplate("recordatorio_demo", [label, link]),
    };
  }

  return {
    templateKey: "M9_RECORDATORIO",
    replySource: "script",
    text: renderTemplate(config.script.M9_RECORDATORIO, {
      producto: config.identity.productName,
      dia_hora_elegida: label,
      link_reunion: link,
    }),
    scheduledLabel: label,
    templateName: null,
    templateParams: null,
  };
}

/**
 * El estado con el que se RESERVA la fila. Aca la reserva ES el insert, asi que se escribe ANTES de
 * mandar: por eso NO puede decir "sent" (seria mentir si el envio falla despues). Dice `reserved`,
 * que es exactamente lo que paso hasta ese instante.
 *
 * No es la ultima palabra: apenas se sabe como termino el envio, sweepRow marca la MISMA fila con
 * `sent` o `failed`. `reserved` solo sobrevive si el proceso murio en el medio — y entonces es la
 * lectura honesta ("se reservo, no se sabe como termino"), que el medidor cuenta como techo.
 */
function deliveryStatusFor(state, config) {
  if (state.channel === "sim") return "simulated";
  return config.dryRun ? "skipped" : "reserved";
}

// ---------------------------------------------------------------------------
// Las tres piezas del barrido: FILTRAR, COMPONER, RESERVAR.
// Salieron de runReminderSweep (que hacia las cuatro cosas de corrido) sin cambiar una linea de
// logica: el orden entre ellas es el mismo y lo sigue mandando el bucle.
// ---------------------------------------------------------------------------

/**
 * FILTRAR: por que ESTA fila no se manda, o el link con el que si (y por que carril sale).
 * Puro: no toca la base ni escribe nada.
 * @returns {{skip: string}|{link: string, outOfWindow: boolean}}
 */
export function planReminder(state, nowIso, config, linkFor, env) {
  // La cuota primero, y ANTES de reserveReminder: aca la reserva ES el insert, asi que escribirla
  // deja la demo marcada como ya recordada para siempre. Con la cuota agotada tampoco sale el
  // recordatorio de una demo ya agendada: ese mensaje lo cobra Meta igual que cualquier otro.
  if (cuotaAgotada(config)) return { skip: "cuota_agotada" };

  const reason = skipReason(state, nowIso, config);
  if (reason) return { skip: reason };

  // El uid existe (lo verifico skipReason) pero el link igual puede no armarse si alguien dejo
  // la URL publica vacia. Sin link no se manda: nunca se inventa uno.
  const link = linkFor(state.calendarEventId, env);
  if (!link) return { skip: "sin_link" };

  // Texto libre o plantilla paga. No cambia A QUIEN se le manda, solo COMO.
  return { link, outOfWindow: outsideWindow(state, nowIso, config) };
}

/**
 * COMPONER: el recordatorio listo para que n8n lo mande. Arma el texto y los datos; no decide.
 * `key` viaja aparte a proposito: es el de la fila (con el fallback a `conversation_key`), no el
 * del estado — que puede no ser el mismo si la fila vino a medias.
 */
export function composeReminder(key, state, link, nowIso, config, outOfWindow = false) {
  const built = buildReminder(state, link, config, outOfWindow);
  return {
    conversationKey: key,
    channel: state.channel,
    contactRef: state.contactRef,
    displayName: state.displayName || null,
    scheduledAt: state.scheduledAt,
    scheduledLabel: built.scheduledLabel,
    hoursUntil: Number(hoursBetween(nowIso, state.scheduledAt).toFixed(1)),
    link,
    templateKey: built.templateKey,
    replySource: built.replySource,
    text: built.text,
    // QUE se mando, no solo si salio: n8n le reporta esto a Sergio y la plantilla cuesta plata
    // (~0,0113 USD la utility) mientras que el texto libre es gratis. Sin este campo, una tanda de
    // envios pagos se veria igual que una gratis hasta que llegue la factura de Meta.
    sendKind: outOfWindow ? "plantilla" : "texto_libre",
    templateName: built.templateName,
    templateParams: built.templateParams,
  };
}

/**
 * RESERVAR: la reserva ES este insert — la clave unica de bot_messages decide quien gana.
 * 1 fila = ganamos y se manda · 0 = ya se mando (otro barrido) · null = fallo de base
 * (tampoco se manda: sin reserva confirmada, mandar es arriesgarse a duplicar).
 * @returns {Promise<{skip: string}|{deliveryStatus: string}>}
 */
export async function reserveReminder(store, state, item, nowIso, config) {
  const deliveryStatus = deliveryStatusFor(state, config);
  const wrote = await store.insertOutbound(
    [
      {
        messageKey: reminderMessageKey(state.conversationKey, state.scheduledAt),
        direction: "outbound",
        author: "bot",
        templateKey: item.templateKey,
        replySource: item.replySource,
        text: item.text,
        deliveryStatus,
        stageBefore: state.botStage,
        stageAfter: state.botStage, // el recordatorio no mueve la maquina de estados
      },
    ],
    state,
    { raw: { reminder: true, scheduledAt: state.scheduledAt, now: nowIso } },
  );

  if (wrote === null) return { skip: "reserva_fallida" };
  if (wrote === 0) return { skip: "ya_recordado" };
  return { deliveryStatus };
}

/**
 * Que le pasa a UNA fila del barrido: se descarta, se muestra (dry-run) o se reserva y se manda.
 * Es el orden de siempre — filtrar, componer, reservar — y sigue siendo el unico lugar donde se
 * decide; el bucle de arriba solo reparte el resultado entre `skipped` y `send`.
 * @returns {Promise<{skip: object}|{send: object, warnings: string[]}>}
 */
async function sweepRow(row, ctx) {
  const { nowIso, emit, config, store, linkFor, env } = ctx;
  const state = stateFromRow(row);
  const key = state?.conversationKey || row?.conversation_key || null;

  const plan = planReminder(state, nowIso, config, linkFor, env);
  if (plan.skip) return { skip: { conversationKey: key, reason: plan.skip } };

  const item = composeReminder(key, state, plan.link, nowIso, config, plan.outOfWindow);

  if (!emit) return { send: { ...item, reserved: false, deliveryStatus: "preview" } };

  const reserva = await reserveReminder(store, state, item, nowIso, config);
  if (reserva.skip) return { skip: { conversationKey: key, reason: reserva.skip } };

  // Ganada la reserva, se manda de verdad. Un fallo NO se reintenta: la reserva ya se gasto y
  // mandar dos recordatorios al mismo prospecto es peor que no mandar ninguno.
  const entrega = await deliver(state, item.text, config, ctx, item.templateParams);
  const warnings = entrega.warning ? [`${key}: ${entrega.warning}`] : [];

  // EL DESENLACE, EN LA MISMA FILA. La reserva quedo en `reserved` — lo unico honesto antes de
  // mandar — y recien ahora se sabe como termino. Sin este PATCH, un envio que FALLA se quedaba
  // guardado como `reserved` para siempre, y como el medidor cuenta `reserved` como cobrable
  // (techo honesto mientras no se sabe), se le facturaba al cliente un mensaje que Meta nunca
  // cobro. El resultado real solo vivia en el JSON del barrido, que no queda en ningun lado.
  //
  // APPEND-ONLY: si, la tabla lo es por diseño, y esto NO lo viola. No agrega ni borra historia y
  // NO toca `message_key`, asi que la clave unica — LA proteccion anti-duplicados de este barrido —
  // queda intacta. Es el MISMO hecho (este envio) terminando de contarse, no un hecho nuevo.
  //
  // Solo se escribe si cambio algo: en dry-run y en `sim` la fila ya dice la verdad ("skipped" /
  // "simulated") y un PATCH ahi seria un viaje a la base para no cambiar nada.
  if (entrega.status !== reserva.deliveryStatus) {
    const marcada = await store.markMessageDelivered(
      reminderMessageKey(state.conversationKey, state.scheduledAt),
      entrega.status,
      // Hoy siempre null: `deliver()` colapsa la respuesta de Chatwoot a un booleano y el id se
      // pierde ahi. Se pasa igual para que el dia que lo devuelva quede guardado solo.
      entrega.externalId ?? null,
    );
    // EXIT 0 SIEMPRE: un PATCH fallido se avisa y se sigue. Si reventara, n8n reintentaria el
    // barrido y el prospecto recibiria DOS recordatorios — peor que una fila desactualizada. La
    // fila queda en `reserved`, que sigue siendo cierto: se reservo y no se sabe como termino.
    if (marcada !== true) {
      warnings.push(`${key}: la fila quedo en '${reserva.deliveryStatus}' — no se pudo marcar '${entrega.status}'`);
    }
  }

  return { send: { ...item, reserved: true, deliveryStatus: entrega.status, logged: true }, warnings };
}

/** El resultado vacio del barrido, antes de mirar una sola fila. */
function emptyResult(nowIso, emit, config, store) {
  return {
    ok: true,
    now: nowIso || null,
    mode: emit ? "emit" : "dry-run",
    dryRun: Boolean(config.dryRun),
    leadHours: config.reminder?.leadHours ?? DEFAULT_CONFIG.reminder.leadHours,
    scanned: 0,
    send: [],
    skipped: [],
    notes: [],
    warnings: store.warnings,
  };
}

// ---------------------------------------------------------------------------
// Barrido
// ---------------------------------------------------------------------------

/**
 * @param {object} options  { nowIso, emit?, limit? }  nowIso es OBLIGATORIO (determinismo)
 * @param {object} [deps]   { store, config, env, meetingLink } — inyectables para test
 * @returns {Promise<object>} { ok, now, mode, scanned, send[], skipped[], warnings[], notes[] }
 */
export async function runReminderSweep(options = {}, deps = {}) {
  const config = deps.config || DEFAULT_CONFIG;
  const store = deps.store || createStore();
  const linkFor = typeof deps.meetingLink === "function" ? deps.meetingLink : meetingLink;
  const env = deps.env || process.env;
  const nowIso = options.nowIso;
  const emit = options.emit === true;
  const limit = Number.isFinite(options.limit) && options.limit > 0 ? Math.floor(options.limit) : 50;

  const result = emptyResult(nowIso, emit, config, store);

  if (!nowIso || !Number.isFinite(Date.parse(nowIso))) {
    result.ok = false;
    result.error = `--now invalido o ausente: ${String(nowIso)}`;
    return result;
  }

  // Quienes NO son de nadie, ANTES de elegir a quien escribirle: el banco de pruebas es un inbox
  // entero y Chatwoot le pone nombre anonimo a su contacto (ver `es-nuestra.mjs`). Si no se pudo
  // preguntar, el conjunto queda vacio y se avisa: nunca se falla hacia "es nuestra".
  const inboxesQA = await cargarInboxesDePrueba(deps);
  if (inboxesQA.warning) result.warnings.push(inboxesQA.warning);

  const rows = await store.sweepDemoReminders(nowIso, config, limit);
  if (!rows) {
    // Sin base o base caida: lista vacia. El motivo ya quedo en store.warnings.
    result.notes.push("barrido_sin_resultado");
    return result;
  }
  result.scanned = rows.length;

  // `chatwoot` viaja en el ctx porque sweepRow es quien manda: sin esto el envio real nunca ve el
  // cliente inyectado y todo termina en "failed" (que fue exactamente lo que cazo el test).
  const ctx = { nowIso, emit, config, store, linkFor, env, chatwoot: deps.chatwoot };
  for (const row of rows) {
    const outcome = await sweepRow(row, ctx);
    if (outcome.warnings?.length) result.warnings.push(...outcome.warnings);
    if (outcome.skip) result.skipped.push(outcome.skip);
    else result.send.push(outcome.send);
  }

  return result;
}

// ---------------------------------------------------------------------------
// Salida legible (dry-run)
// ---------------------------------------------------------------------------

export function renderHuman(result) {
  const lines = [
    `ONIA — recordatorio de demo M9 (${result.leadHours} h antes) · modo ${result.mode}${result.dryRun ? " · dryRun" : ""}`,
    `ahora: ${result.now} · demos en la franja: ${result.scanned}`,
    "",
  ];
  if (result.error) lines.push(`ERROR: ${result.error}`, "");

  lines.push(`${result.mode === "emit" ? "ENVIADOS" : "MANDARIA"} (${result.send.length})`);
  if (result.send.length === 0) lines.push("  (ninguno)");
  for (const item of result.send) {
    // Igual que en el follow-up: en la tabla del dry-run un envio pago y uno gratis se veian
    // identicos. Aca ademas la plantilla es el caso COMUN, asi que verlo importa mas todavia.
    const carril = item.sendKind === "plantilla" ? ` · PLANTILLA ${item.templateName} (paga)` : "";
    lines.push(
      `  ${item.conversationKey} [${item.channel}] ${item.displayName || "sin nombre"} — demo ${item.scheduledLabel}, en ${item.hoursUntil} h${carril}`,
    );
    for (const line of String(item.text).split("\n")) lines.push(`      | ${line}`);
    lines.push("");
  }

  lines.push(`NO SE MANDA (${result.skipped.length})`);
  if (result.skipped.length === 0) lines.push("  (ninguno)");
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
    const result = await runReminderSweep({ nowIso, emit: args.emit, limit: args.limit }, { config: buildConfig() });
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
