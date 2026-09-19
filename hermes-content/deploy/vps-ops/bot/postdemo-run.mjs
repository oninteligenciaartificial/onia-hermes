// ONIA — Chatbot propio (el que atiende "DEMO"): CIERRE POST-DEMO.
//
// Es el tercer cron del embudo, y tapa el hueco donde se caian las ventas: el bot conseguia la
// reunion y ahi soltaba la mano. `demo_realizada` estaba en la lista de estados de bot-engine.mjs
// y NADIE lo escribia nunca, asi que una demo agendada se quedaba en `demo_agendada` para siempre:
// el lead no se movia del pipeline y nadie se enteraba de si la reunion ocurrio, si el prospecto no
// vino, o si habia que mandar propuesta.
//
// Hermano de followup-run.mjs y reminder-run.mjs: mismo contrato de CLI, misma disciplina.
//
//   entrada : argumentos de CLI (no hay stdin)
//   salida  : texto legible (dry-run) o una linea JSON (--emit / --json)
//   codigo de salida: SIEMPRE 0. Un error se reporta en la salida, no reventando el proceso.
//
// LO QUE HACE
//   1. Busca demos en `demo_agendada` cuyo horario + duracion + margen de gracia ya paso.
//   2. Mueve el estado a `demo_realizada`, con reserva idempotente.
//   3. Devuelve un aviso para SERGIO con las tres salidas posibles, para que EL decida.
//
// LO QUE NO HACE, Y ES A PROPOSITO
//   - NO le manda NADA al prospecto. Fuera de la ventana de 24 h costaria una plantilla que no
//     tenemos aprobada, y adentro seria un mensaje que nadie pidio. El resultado de la demo lo sabe
//     Sergio, no el bot. Por eso los items de `send[]` van marcados `target: "sergio"`: si alguien
//     clona el workflow del recordatorio y no cambia el nodo de envio, este texto termina en el
//     telefono del prospecto.
//   - NO adivina si vino o no. Cal.com no nos dice si se conecto, asi que ese dato NO EXISTE:
//     inventarlo ensucia el CRM. Lo que no se sabe, se pregunta.
//   - NO toca `pipeline_status`. Ganado / Perdido / Propuesta despues de una demo es una decision
//     comercial de una persona (ver PIPELINE_STATUSES en persistence.mjs). El lead sigue en
//     "Reunion", que es donde lo dejo la reserva, hasta que Sergio diga otra cosa.
//   - NO escribe fila en `bot_messages` ni en `audit_logs`: no hubo mensaje que registrar y el
//     cambio de estado ya queda a la vista en `bot_conversations.bot_stage`. Una segunda bitacora
//     seria un segundo mecanismo de dedup compitiendo con el CAS.
//
// REGLAS DURAS
//   1. UN SOLO AVISO POR DEMO. La reserva ES el cambio de estado (`store.reserveDemoDone`, el mismo
//      CAS de `reserveFollowUp`): al pasar a `demo_realizada` la fila sale del filtro del barrido,
//      asi que correr esto dos veces no avisa dos. Va SIEMPRE ANTES de emitir; sin reserva
//      confirmada no se avisa.
//   2. DETERMINISTA: el "ahora" entra por `--now` y viaja como parametro. Cero Date.now() dentro de
//      la logica (el unico esta en main(), en el borde, cuando no se paso --now).
//   3. TOLERANTE: sin base -> lista vacia + warning. Nunca tira.
//   4. BARATO: si no hay nada que cerrar, no hace nada. Un SELECT con limite y se va.
//
// Uso:
//   node postdemo-run.mjs                               dry-run: dice que demos cerraria y el aviso
//   node postdemo-run.mjs --now 2026-07-30T21:00:00Z    con un "ahora" fijo (reproducible)
//   node postdemo-run.mjs --emit                        cierra y devuelve el JSON para n8n
//   node postdemo-run.mjs --emit --limit 20
//
// Spec: hermes-content/docs/ONIA_CHATBOT_PROPIO_SPEC_20260725.md (§4.6 CAS, §5.2 pipeline)

import { pathToFileURL } from "node:url";

import { DEFAULT_CONFIG, createBotConfig } from "./config.mjs";
import { withKnowledge } from "./knowledge.mjs";
import { createStore, stateFromRow } from "./persistence.mjs";
import { MOTIVO_NUESTRA, cargarInboxesDePrueba, esConversacionNuestra } from "./es-nuestra.mjs";
import { industryLabel } from "./intents.mjs";
import { formatSlotLabel } from "./calcom-availability.mjs";
import { hoursBetween } from "./followup-run.mjs";
import { construirAviso, enviarAvisoTelegram, getAvisoTelegramConfig } from "./aviso-telegram.mjs";

/** De donde sale una demo que se cierra, y a donde va. */
export const OPEN_STAGE = "demo_agendada";
export const DONE_STAGE = "demo_realizada";

/**
 * Margen despues de la hora de fin antes de dar la demo por terminada.
 *
 * Vive aca y no en config.mjs a proposito: lo usa UN solo archivo, y config.mjs es para los hechos
 * que se dicen en dos lugares (la duracion de la demo esta ahi justamente porque el guion Y la
 * reserva la nombran). Para cambiarlo, este numero y nada mas.
 *
 * 30 min porque una demo se pasa de largo y un aviso mientras Sergio sigue en la llamada es ruido.
 * Con el cron cada hora no se pierde nada: la demo entra en el barrido siguiente.
 */
export const GRACIA_MINUTOS = 30;

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

export function parseArgs(argv = []) {
  // `dryRunExplicito` existe porque `emit:false` tiene DOS causas — "me lo pidieron" y "nadie dijo
  // nada" — y el entorno sólo puede decidir la segunda. Aplanarlas dejaba al cron sin forma de
  // encender el cierre sin editar el crontab. Ver el bloque de `main`.
  const args = { now: null, emit: false, dryRunExplicito: false, json: false, limit: 50 };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = String(argv[index]);
    const value = () => argv[++index] ?? null;
    if (arg === "--emit") args.emit = true;
    else if (arg === "--dry-run") {
      args.emit = false;
      args.dryRunExplicito = true;
    }
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
 * No hay `--slots`: aca no se ofrece nada, la demo ya paso.
 */
export function buildConfig() {
  const overrides = {};
  const envDry = String(process.env.ONIA_BOT_DRY_RUN ?? "").toLowerCase();
  if (envDry === "false") overrides.dryRun = false;
  else if (envDry === "true") overrides.dryRun = true;
  return withKnowledge(Object.keys(overrides).length ? createBotConfig(overrides) : DEFAULT_CONFIG);
}

/**
 * Por donde sale el aviso, y si se puede.
 *
 * Las TRES condiciones se preguntan por separado y el motivo NOMBRA la que falta: "no se puede
 * avisar" a secas manda a revisar el barrido, cuando lo que falta es una variable que el wrapper
 * tiene que pasarle al `docker exec` — medido el 2026-09-17, el contenedor `onia-center` no tiene
 * `TG_BOT_TOKEN` en su entorno (0 coincidencias), lo tiene el PROCESO del webhook.
 */
export function canalDeAviso(env = process.env) {
  const config = getAvisoTelegramConfig(env);
  const falta = !config.enabled
    ? "el aviso por Telegram esta apagado (ONIA_BOT_TG_AVISO)"
    : !config.token
      ? "falta TG_BOT_TOKEN"
      : !config.chatId
        ? "falta TG_CHAT_ID"
        : null;

  return {
    listo: falta === null,
    motivo: falta,
    config,
    enviar: (aviso) => enviarAvisoTelegram(aviso, config),
  };
}

// ---------------------------------------------------------------------------
// Helpers puros
// ---------------------------------------------------------------------------

/**
 * Cuantas horas despues del INICIO se da la demo por terminada: lo que dura + la gracia.
 * La duracion sale de `config.demo.duracionMinutos` — la MISMA que bloquea Cal.com y que el guion
 * promete en M0. Escribirla a mano aca seria repetir el error que este bot ya pago una vez
 * (15 minutos en el texto, 45 en el calendario).
 */
export function closedAfterHours(config = DEFAULT_CONFIG) {
  const minutos = Number(config.demo?.duracionMinutos);
  const duracion = Number.isFinite(minutos) && minutos > 0 ? minutos : DEFAULT_CONFIG.demo.duracionMinutos;
  return (duracion + GRACIA_MINUTOS) / 60;
}

/**
 * El CORTE que se le pasa al barrido en SQL: una demo que empezo ANTES de este instante ya termino.
 * Es "ahora" menos la duracion y la gracia, no "ahora" pelado — con el ahora pelado entrarian demos
 * que recien estan empezando.
 */
export function endedBefore(nowIso, config = DEFAULT_CONFIG) {
  const now = Date.parse(nowIso);
  if (!Number.isFinite(now)) return null;
  return new Date(now - closedAfterHours(config) * 3600000).toISOString();
}

/**
 * Por que ESTA demo no se cierra. El barrido en SQL ya filtra, pero la fila se vuelve a chequear en
 * memoria (la base puede devolver de mas, o alguien pudo tocar la fila entre el select y ahora).
 * Orden de mas definitivo a mas transitorio: al final lo que se arregla solo esperando.
 */
export function skipReason(state, nowIso, config = DEFAULT_CONFIG) {
  if (!state) return "fila_ilegible";
  // DEFINITIVO: el cierre post-demo avisa a Sergio Urcullo por Telegram, asi que una demo contra
  // nuestra propia sonda le manda un aviso por una reunion que no existe (ver `es-nuestra.mjs`).
  if (esConversacionNuestra(state)) return MOTIVO_NUESTRA;
  if (state.humanTookOver) return "humano_a_cargo";
  if (state.optOutAt) return "opt_out";
  if (state.botStage !== OPEN_STAGE) return `estado_no_aplica:${state.botStage}`;

  // Sin horario NO se adivina que la demo ocurrio. Una conversacion en `demo_agendada` sin
  // `scheduled_at` es una reserva que quedo a medias: la arregla un humano, no un cron.
  if (!state.scheduledAt) return "sin_horario";

  const desde = hoursBetween(state.scheduledAt, nowIso);
  if (desde === null) return "fecha_invalida";
  const faltan = closedAfterHours(config) - desde;
  // TRANSITORIO: la demo es futura o todavia esta en curso. Sale sola en un barrido siguiente.
  if (faltan > 0) return `demo_sin_terminar:${faltan.toFixed(1)}h`;

  return null;
}

/**
 * El aviso para Sergio. Texto interno, no guion: por eso se arma aca y no en `config.script` —
 * ese archivo es lo que se le dice al PROSPECTO, y esto no lo lee un prospecto nunca.
 *
 * Lleva lo minimo para decidir sin abrir el panel (quien, de que rubro, cuando fue) y las TRES
 * salidas posibles, porque el dato que falta — si vino, si cerro — no lo tenemos y no se inventa.
 */
export function buildDemoDoneNotice(state, nowIso, config = DEFAULT_CONFIG) {
  const tz = config.businessHours?.tzLabel || DEFAULT_CONFIG.businessHours.tzLabel;
  const label = state.scheduledLabel || formatSlotLabel(state.scheduledAt, tz);
  const q = state.qualification || {};
  // El rubro con la etiqueta legible del lexico; si el rubro no tiene etiqueta ("otro") se muestra
  // la clave cruda antes que nada. Lo que NO se hace es rellenar con un rubro inventado.
  const rubro = q.industry ? industryLabel(q.industry, config) || q.industry : null;
  const datos = [rubro, q.city].filter(Boolean).join(", ");
  const quien = state.displayName || "sin nombre";
  const desde = hoursBetween(state.scheduledAt, nowIso);

  const text = [
    "Demo terminada — ¿cómo salió?",
    "",
    `${quien}${datos ? ` (${datos})` : ""} · ${state.channel}`,
    `Era: ${label}${desde === null ? "" : ` — empezó hace ${desde.toFixed(1)} h`}`,
    `Conversación: ${state.conversationKey}`,
    "",
    "Decime cuál de las tres:",
    "- CERRÓ — te compró.",
    "- NO VINO — no se presentó.",
    "- PROPUESTA — quedó en que le mandás la propuesta.",
    "",
    "Al prospecto no le escribí nada, y en el CRM no moví nada: el pipeline lo cambiás vos.",
  ].join("\n");

  return { label, rubro, text };
}

/**
 * El aviso listo para que n8n lo mande a Sergio.
 *
 * El item ES un payload de `notify_sergio` (`kind` + `conversationKey` + `text`, igual que los que
 * emite el motor) con los datos del barrido encima. `key` viaja aparte a proposito: es el de la
 * fila, no el del estado — que puede no ser el mismo si la fila vino a medias.
 */
export function composeNotice(key, state, nowIso, config = DEFAULT_CONFIG) {
  const notice = buildDemoDoneNotice(state, nowIso, config);
  const desde = hoursBetween(state.scheduledAt, nowIso);
  return {
    kind: "demo_realizada",
    conversationKey: key,
    // A QUIEN va esto. El unico destinatario posible es Sergio: ver la cabecera.
    target: "sergio",
    channel: state.channel,
    contactRef: state.contactRef,
    displayName: state.displayName || null,
    industry: notice.rubro,
    scheduledAt: state.scheduledAt,
    scheduledLabel: notice.label,
    hoursSince: desde === null ? null : Number(desde.toFixed(1)),
    text: notice.text,
    stageBefore: OPEN_STAGE,
    stageAfter: DONE_STAGE,
  };
}

/**
 * Que le pasa a UNA fila: se descarta, se muestra (dry-run) o se cierra y se avisa.
 *
 * No hay `deliveryStatus` como en los otros dos barridos, y es correcto: aca el bot no entrega
 * nada. Lo unico que se puede afirmar es si el estado se movio, y eso es `reserved`.
 * @returns {Promise<{skip: object}|{send: object}>}
 */
async function sweepRow(row, ctx) {
  const { nowIso, emit, config, store, aviso } = ctx;
  const state = stateFromRow(row);
  const key = state?.conversationKey || row?.conversation_key || null;

  const reason = skipReason(state, nowIso, config);
  if (reason) return { skip: { conversationKey: key, reason } };

  const item = composeNotice(key, state, nowIso, config);
  if (!emit) return { send: { ...item, reserved: false } };

  // CAS: mover el estado ES la reserva. false = otra corrida se la llevo; null = fallo de base
  // (tampoco se avisa: sin reserva confirmada, avisar es arriesgarse a avisar dos veces).
  const reserved = await store.reserveDemoDone(state.conversationKey);
  if (reserved !== true) {
    return { skip: { conversationKey: key, reason: reserved === false ? "ya_cerrada" : "reserva_fallida" } };
  }

  // El aviso va DESPUES de la reserva y por eso es el ultimo tren: la fila ya quedo en
  // `demo_realizada` y ninguna corrida futura la va a volver a mirar. Si el envio falla, no se
  // puede reintentar sin arriesgar el doble aviso — asi que se registra con nombre propio y el
  // barrido lo sube a `warnings`, que es lo que mira un humano. Callarlo seria perder la demo.
  const entrega = await aviso.enviar(
    construirAviso({ notify: [item], conversationId: item.conversationKey, stageAfter: item.stageAfter }),
  );

  return {
    send: {
      ...item,
      reserved: true,
      deliveryStatus: entrega?.status ?? "failed",
      deliveryReason: entrega?.reason ?? "el canal no contesto",
    },
  };
}

// ---------------------------------------------------------------------------
// Barrido
// ---------------------------------------------------------------------------

/**
 * @param {object} options  { nowIso, emit?, limit? }  nowIso es OBLIGATORIO (determinismo)
 * @param {object} [deps]   { store, config } — inyectables para test
 * @returns {Promise<object>} { ok, now, mode, scanned, send[], skipped[], warnings[], notes[] }
 */
export async function runPostDemoSweep(options = {}, deps = {}) {
  const config = deps.config || DEFAULT_CONFIG;
  const store = deps.store || createStore();
  const nowIso = options.nowIso;
  const emit = options.emit === true;
  const aviso = deps.aviso || canalDeAviso();
  const limit = Number.isFinite(options.limit) && options.limit > 0 ? Math.floor(options.limit) : 50;

  const result = {
    ok: true,
    now: nowIso || null,
    mode: emit ? "emit" : "dry-run",
    // `dryRun` se reporta por consistencia con los otros dos barridos y NO gatea el CAS: acá el
    // gate es `emit`, porque este barrido no le envía nada al prospecto.
    //
    // ⚠️ Acá decía además que gatear el CAS con `dryRun` "dejaría el cron encendido y MUDO, que es
    // el hueco que vino a tapar". Era CIERTO mientras la única salida fuera una línea JSON para
    // n8n — y n8n está tapiado (`ONIA_N8N_ENABLED=false`, URL vacía, medido el 2026-09-17 en el
    // proceso vivo). Lo que cambió es la premisa, no la regla: el barrido ahora manda por el mismo
    // Telegram encendido que usa el webhook, así que "encendido y mudo" ya no es un estado posible
    // — si no hay canal, no barre.
    dryRun: Boolean(config.dryRun),
    closedAfterHours: closedAfterHours(config),
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

  // PREPARAR ES PREPARAR: cerrar la fila es irreversible y el aviso es su única razón de ser, así
  // que el canal se pregunta ANTES de tocar la base. Un barrido que cierra sin poder avisar deja la
  // demo marcada como atendida y a Sergio Urcullo sin enterarse nunca — el modo de falla más caro
  // de este archivo. El dry-run no necesita canal: mira y no consume nada.
  if (emit && !aviso.listo) {
    result.ok = false;
    result.error = `sin canal para avisar, no se cierra ninguna demo: ${aviso.motivo || "motivo desconocido"}`;
    return result;
  }

  // Quienes NO son de nadie, ANTES de elegir a quien escribirle: el banco de pruebas es un inbox
  // entero y Chatwoot le pone nombre anonimo a su contacto (ver `es-nuestra.mjs`). Si no se pudo
  // preguntar, el conjunto queda vacio y se avisa: nunca se falla hacia "es nuestra".
  const inboxesQA = await cargarInboxesDePrueba(deps);
  if (inboxesQA.warning) result.warnings.push(inboxesQA.warning);

  const rows = await store.sweepDemosTerminadas(endedBefore(nowIso, config), limit);
  if (!rows) {
    // Sin base o base caida: lista vacia. El motivo ya quedo en store.warnings.
    result.notes.push("barrido_sin_resultado");
    return result;
  }
  result.scanned = rows.length;

  const ctx = { nowIso, emit, config, store, aviso };
  for (const row of rows) {
    const outcome = await sweepRow(row, ctx);
    if (outcome.skip) result.skipped.push(outcome.skip);
    else result.send.push(outcome.send);
  }

  // Un aviso que no salió después de cerrar la fila NO puede quedar sólo adentro del item: los
  // `warnings` son lo que el wrapper deja en el log y lo que mira un humano. Sin esto, la línea del
  // cron diría "CERRADAS (1)" sobre una demo de la que nadie se enteró.
  for (const item of result.send) {
    if (item.reserved && item.deliveryStatus !== "sent") {
      result.warnings.push(
        `aviso NO entregado para ${item.conversationKey} (${item.deliveryReason}): la demo quedó cerrada y nadie avisó`,
      );
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Salida legible (dry-run)
// ---------------------------------------------------------------------------

export function renderHuman(result) {
  const lines = [
    `ONIA — cierre post-demo (${result.closedAfterHours} h despues del inicio) · modo ${result.mode}`,
    `ahora: ${result.now} · demos terminadas sin cerrar: ${result.scanned}`,
    "",
  ];
  if (result.error) lines.push(`ERROR: ${result.error}`, "");

  lines.push(`${result.mode === "emit" ? "CERRADAS — AVISO A SERGIO" : "CERRARIA"} (${result.send.length})`);
  if (result.send.length === 0) lines.push("  (ninguna)");
  for (const item of result.send) {
    // La entrega se imprime al lado del cierre y no al final: el log del cron es lo único que
    // queda de esta corrida, y "CERRADAS (1)" sin decir si el aviso salió es el mismo falso verde
    // que este barrido tuvo durante meses.
    const entrega = item.reserved ? ` · aviso: ${item.deliveryStatus || "sin dato"}` : "";
    lines.push(
      `  ${item.conversationKey} [${item.channel}] ${item.displayName || "sin nombre"} — demo ${item.scheduledLabel}, hace ${item.hoursSince} h${entrega}`,
    );
    for (const line of String(item.text).split("\n")) lines.push(`      | ${line}`);
    lines.push("");
  }

  lines.push(`NO SE CIERRA (${result.skipped.length})`);
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
    const config = buildConfig();

    // El cron de las :47 llama al wrapper SIN `--emit`, y el wrapper le pasa `ONIA_BOT_DRY_RUN`
    // leído de `webhook.env` (hoy `false`) con el comentario de que sin eso "el cierre post-demo
    // quedaba registrado como 'skipped' para siempre". Ese arreglo nunca funcionó porque este
    // archivo miraba sólo el flag: medido el 2026-09-17, el log dice `CERRARIA (0)` en todas las
    // corridas. Precedencia de siempre: un `--dry-run` explícito le gana al entorno.
    const emit = args.emit || (!args.dryRunExplicito && config.dryRun === false);
    const result = await runPostDemoSweep({ nowIso, emit, limit: args.limit }, { config });
    const asJson = args.emit || args.json;
    process.stdout.write(`${asJson ? JSON.stringify(result) : renderHuman(result)}\n`);
  } catch (error) {
    // Falla hacia el silencio: send vacio. n8n no avisa nada y el error queda a la vista.
    process.stdout.write(
      `${JSON.stringify({ ok: false, mode: args.emit ? "emit" : "dry-run", send: [], skipped: [], warnings: [], error: String(error?.message || error).slice(0, 300) })}\n`,
    );
  }
}

const invokedDirectly = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) main();
