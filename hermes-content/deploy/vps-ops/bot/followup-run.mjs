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
//   1. DOS CARRILES SEGUN LA VENTANA DE META (24 h desde el ultimo mensaje ENTRANTE):
//      - DENTRO (20-24 h, el caso normal): texto libre M3. Gratis y natural. Se apunta a las 20 h
//        justamente para caer aca con 4 h de colchon si el cron se atrasa.
//      - FUERA (24 h - 7 dias): el texto libre falla con 131047, asi que sale la plantilla aprobada
//        `seguimiento_demo` (MARKETING, ~0,0740 USD). Antes esto se descartaba con
//        `fuera_de_ventana` porque no habia plantilla; ahora la hay y el mensaje SALE.
//      Pasados los 7 dias no se escribe ni con plantilla: `conversacion_muerta`.
//   2. UN solo follow-up por conversacion (regla N7). Despues, silencio: decide un humano.
//   3. La reserva es un CAS y va SIEMPRE ANTES de emitir. Si reserva 0 filas, NO se manda nada:
//      preferimos perder un follow-up a mandar dos (un duplicado quema el quality rating).
//   4. DETERMINISTA: el "ahora" entra por `--now` y viaja como parametro. Cero Date.now() dentro
//      de la logica (el unico esta en main(), en el borde, cuando no se paso --now).
//   5. TOLERANTE: sin base -> lista vacia + warning. Nunca tira.
//   6. NO se llama `saveConversation`: escribiria el estado ENTERO y podria pisar un
//      `human_took_over` que ocurrio entre el barrido y ahora. El CAS ya dejo `followup_step = 1`
//      y la bitacora va en `bot_messages` (append-only).
//   7. UN ENVIO QUE SALIO NUNCA QUEDA SIN RASTRO CONTABLE. Aca se manda ANTES de registrar (al
//      reves que el recordatorio), asi que un insert fallido dejaria un mensaje que Meta COBRA y
//      que el medidor (usage-run.mjs) NO cuenta — el espejo del bug del recordatorio, que
//      facturaba de mas. El insert se reintenta UNA vez (es idempotente por `message_key`, no
//      puede duplicar) y, si ni asi entra, se grita: warning con la conversacion y el carril, mas
//      la nota `envio_sin_fila`. Nunca se vuelve a mandar el mensaje: la regla 3 manda.
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

import { DEFAULT_CONFIG, createBotConfig, localHour, parseSlotsSpec, renderTemplate, slotsPending } from "./config.mjs";
import { cuotaAgotada, withKnowledge } from "./knowledge.mjs";
import { buildFollowUp } from "./bot-engine.mjs";
import { activeSlots, slotLabel } from "./reply-builder.mjs";
import { createStore, stateFromRow } from "./persistence.mjs";
import { MOTIVO_NUESTRA, cargarInboxesDePrueba, esConversacionNuestra } from "./es-nuestra.mjs";
import { createChatwootClient, whatsappTemplate } from "./chatwoot-adapter.mjs";
import { getAvailableSlots as getAvailableSlotsFromCalcom } from "./calcom-availability.mjs";
import { agendaDelEntorno } from "./calcom-booking.mjs";
import {
  construirAvisoDeColgadas,
  enviarAvisoTelegram,
  getAvisoTelegramConfig,
} from "./aviso-telegram.mjs";
import { crearGuardaDeEfectoReal, crearMarcasEnDisco } from "./marcas-en-disco.mjs";

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

/**
 * "jue 15:00@2026-07-30T19:00:00Z|vie 10:00@2026-07-31T14:00:00Z" -> slots del config.
 * Se re-exporta el canonico de config.mjs: el parseo estaba copiado en tres modulos y la copia
 * de simulate.mjs filtraba el ISO al guion del cliente.
 */
export { parseSlotsSpec };

/**
 * Config del barrido: DEFAULT_CONFIG + slots + dryRun + los HECHOS editables (knowledge.json).
 * Nada mas se pisa desde la CLI. Sin archivo de conocimiento devuelve el MISMO objeto de antes.
 */
export function buildConfig(args = {}) {
  const overrides = {};
  const envDry = String(process.env.ONIA_BOT_DRY_RUN ?? "").toLowerCase();
  if (envDry === "false") overrides.dryRun = false;
  else if (envDry === "true") overrides.dryRun = true;

  // Sin agenda propia M3 no sale: ofrece dos horarios y cierra con «la dejamos agendada», la misma
  // promesa que el turno ya no hace (`agendaDelEntorno`, 2-oct). Sin horarios el barrido bloquea
  // ANTES de reservar la fila, asi que el seguimiento queda para cuando haya con que agendar.
  if (agendaDelEntorno(process.env).modo === "persona") {
    overrides.agenda = { modo: "persona" };
  } else {
    const slots = parseSlotsSpec(args.slots || process.env.ONIA_BOT_SLOTS || "");
    if (slots) overrides.slots = slots;
  }
  return withKnowledge(Object.keys(overrides).length ? createBotConfig(overrides) : DEFAULT_CONFIG);
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
  if (config.agenda?.modo === "persona") return config; // sin agenda propia no se ofrecen horarios
  const explicit = Boolean(args.slots || process.env.ONIA_BOT_SLOTS);
  if (explicit) return config; // Sergio (o el operador) ya fijó los horarios a mano: no se pisa

  const getSlots = typeof deps.getAvailableSlots === "function" ? deps.getAvailableSlots : getAvailableSlotsFromCalcom;
  const live = await getSlots({ nowIso: deps.nowIso }, deps);
  if (!live || !Array.isArray(live.slots) || live.slots.length === 0) return config;
  return withKnowledge(createBotConfig({ slots: live.slots, dryRun: config.dryRun }));
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
  // DEFINITIVO y por eso va arriba de todo: quien es el contacto no cambia esperando. Sin esta
  // pregunta el barrido le escribe a nuestras propias sondas — el 2026-09-18, DOS de las tres
  // filas que iba a tomar eran nuestras (ver `es-nuestra.mjs`).
  if (esConversacionNuestra(state)) return MOTIVO_NUESTRA;
  if (state.humanTookOver) return "humano_a_cargo";
  if (state.optOutAt) return "opt_out";
  if (state.followupStep >= config.followUp.maxSteps) return "ya_tiene_followup";
  if (!FOLLOWUP_STAGES.includes(state.botStage)) return `estado_no_aplica:${state.botStage}`;
  if (!state.lastInboundAt) return "sin_last_inbound_at";
  const elapsed = hoursBetween(state.lastInboundAt, nowIso);
  if (elapsed === null) return "fecha_invalida";
  if (elapsed < config.followUp.afterHours) return `demasiado_pronto:${elapsed.toFixed(1)}h`;
  if (elapsed > config.followUp.staleAfterDays * 24) return `conversacion_muerta:${elapsed.toFixed(1)}h`;
  // OJO: la ventana de Meta YA NO se descarta aca. Antes devolvia `fuera_de_ventana` y el mensaje
  // moria, porque fuera de la ventana solo salen plantillas aprobadas y no habia ninguna. Ahora
  // `seguimiento_demo` esta aprobada, asi que fuera de la ventana se manda ESA (ver outsideWindow).
  // Lo que sigue mandando es `conversacion_muerta`, arriba: a los 8 dias no se escribe ni con
  // plantilla — eso ya no es un seguimiento, es spam.

  // TRANSITORIO y por eso va al FINAL: la hora se arregla esperando, y confundirla con un
  // descarte definitivo haria que el barrido mire esta fila para siempre. A quien se le escribe
  // lo elige el silencio del prospecto, asi que la hora de salida es la de entrada corrida 20 h:
  // el que escribe a las 10:00 recibiria el seguimiento a las 06:00, y el cron corre las 24 horas.
  // La fila sigue elegible y sale en el primer barrido de la mañana (ver config.followUp).
  const hora = localHour(nowIso, config);
  const desde = config.followUp?.quietBeforeHour ?? DEFAULT_CONFIG.followUp.quietBeforeHour;
  const hasta = config.followUp?.quietAfterHour ?? DEFAULT_CONFIG.followUp.quietAfterHour;
  if (hora !== null && (hora < desde || hora >= hasta)) return `horario_silencioso:${hora}h`;

  return null;
}

/**
 * ¿La ventana de servicio de 24 h de Meta ya se cerro para esta conversacion?
 *
 * Se cuenta desde el ULTIMO MENSAJE ENTRANTE, no desde el ultimo saliente. Adentro: texto libre,
 * gratis y natural. Afuera: el texto libre falla con 131047 y hay que pagar una plantilla.
 * El unico hecho del canal, en un solo lugar: lo usa este barrido Y el del recordatorio (M9).
 *
 * Fecha ilegible => false (o sea, texto libre). Ese caso ya lo descarto skipReason con
 * `fecha_invalida` antes de llegar aca; el false es solo para que nadie pague una plantilla por un
 * dato roto si alguien la llama suelta.
 */
export function outsideWindow(state, nowIso, config = DEFAULT_CONFIG) {
  const elapsed = hoursBetween(state?.lastInboundAt, nowIso);
  if (elapsed === null) return false;
  const cierre = config.followUp?.windowClosesAtHours ?? DEFAULT_CONFIG.followUp.windowClosesAtHours;
  return elapsed >= cierre;
}

/**
 * El M3 convertido en la plantilla `seguimiento_demo`, o null si NO hay dos horarios de verdad.
 *
 * null NO significa "manda texto libre": significa NO MANDES NADA. Los dos horarios son la unica
 * razon de ser del mensaje, y mandarle "HORARIO A (pendiente de definir)" a un prospecto — encima
 * en una plantilla de marketing que se paga y que Meta mide — es peor que perder el follow-up.
 * Se miran los MISMOS horarios que usa el texto libre (`activeSlots`: los que se le ofrecieron a
 * esta conversacion, o los del config), asi los dos caminos nunca pueden decir cosas distintas.
 */
export function followUpTemplate(state, config = DEFAULT_CONFIG) {
  const slots = activeSlots(state, config);
  if ((slots || []).some((slot) => slot?.pending === true)) return null;
  const a = slotLabel(slots, "A");
  const b = slotLabel(slots, "B");
  if (!a || !b) return null;
  return {
    name: "seguimiento_demo",
    templateKey: "M3_PLANTILLA",
    text: renderTemplate(config.script.M3_PLANTILLA, { 1: a, 2: b }),
    params: whatsappTemplate("seguimiento_demo", [a, b]),
  };
}

/** Clave DETERMINISTA del mensaje: reintentar el barrido no duplica la fila en bot_messages. */
export function followUpMessageKey(conversationKey, step) {
  return `followup:${conversationKey}:${step}`;
}

/**
 * Manda el mensaje POR EL CANAL REAL y devuelve lo que de verdad paso.
 *
 * Antes esto era `deliveryStatusFor()`, que devolvia "sent" sin haber mandado NADA: el barrido
 * reservaba, escribia "enviado" en la base y ahi moria. n8n tenia que mandarlo, pero eso obligaba a
 * meter el token de Chatwoot tambien en n8n; el bot ya lo tiene, asi que manda el bot.
 *
 * Tolerante por contrato: un fallo de Chatwoot no puede tumbar el barrido. Y la conversacion NO se
 * reintenta — la reserva ya se gasto. Es deliberado: preferimos perder un follow-up antes que
 * mandar dos, que es lo que quema el numero ante Meta (spec §4.6).
 *
 * @param {object|null} [templateParams]  presente = va como PLANTILLA aprobada (fuera de la ventana
 *   de 24 h). Ausente = texto libre, que es lo de siempre y lo que hace el 99% del trafico.
 */
export async function deliver(state, text, config, deps = {}, templateParams = null) {
  if (state.channel === "sim") return { status: "simulated", warning: null };
  if (config.dryRun) return { status: "skipped", warning: null };
  // ULTIMA BARRERA DE LA CUOTA, y la unica que un barrido NUEVO hereda sin acordarse: por aca
  // salen los tres. Cada barrido ademas corta antes, para no quemar su reserva — pero si alguno
  // se olvida, el mensaje igual no sale. `skipped` no esta en ESTADOS_COBRABLES: no se factura.
  if (cuotaAgotada(config)) {
    return { status: "skipped", warning: "cuota mensual agotada: no se manda nada" };
  }
  if (state.channel !== "chatwoot") {
    return { status: "failed", warning: `canal ${state.channel}: sin envio automatico` };
  }
  const client = deps.chatwoot || createChatwootClient();
  if (!client.enabled) return { status: "failed", warning: "chatwoot: sin token/config, no se mando nada" };
  // En Chatwoot el contactRef ES el id de conversacion (chatwoot-adapter.mjs lo fija asi).
  const sent = await client.sendMessage(state.contactRef, text, templateParams);
  if (sent) return { status: "sent", warning: null };
  return { status: "failed", warning: client.warnings[client.warnings.length - 1] || "chatwoot: no se pudo enviar" };
}

// ---------------------------------------------------------------------------
// Barrido
// ---------------------------------------------------------------------------

/**
 * @param {object} options  { nowIso, emit?, limit? }  nowIso es OBLIGATORIO (determinismo)
 * @param {object} [deps]   { store, config } — inyectables para test
 * @returns {Promise<object>} { ok, now, mode, scanned, send[], skipped[], warnings[], notes[] }
 */
/**
 * Cuenta a los que quedaron esperando por encima del piso de rescate, y separa al desconocido.
 *
 * No les escribe: a los 8 dias eso ya es spam, y esa decision esta tomada (`conversacion_muerta`).
 * Lo que arregla es el SILENCIO — hasta hoy la consulta los recortaba antes de que el runner
 * pudiera nombrarlos, asi que un lead perdido y un dia tranquilo se leian los dos `scanned: 0`.
 *
 * La clasificacion usa el MISMO criterio que el salteo del bucle de envio (`esConversacionNuestra`),
 * no uno propio: con cero clientes pagando, casi todo lo que hay en la base lo sembramos nosotros,
 * y un contador que mezcle las dos cosas grita todos los dias hasta que nadie lo mire.
 */
async function contarColgadas(result, store, nowIso, config, limit) {
  if (typeof store.sweepFollowUpVencidas !== "function") return;
  const filas = await store.sweepFollowUpVencidas(nowIso, config, limit);
  if (!filas) return; // el motivo ya quedo en store.warnings; sigue en "no medido", no en cero

  const quienes = [];
  let nuestras = 0;
  for (const row of filas) {
    const state = stateFromRow(row);
    if (esConversacionNuestra(state)) {
      nuestras += 1;
      continue;
    }
    const silentHours = hoursBetween(state?.lastInboundAt, nowIso);
    quienes.push({
      conversationKey: state?.conversationKey || row?.conversation_key || null,
      displayName: state?.displayName || null,
      botStage: state?.botStage || null,
      silentHours: silentHours === null ? null : Math.round(silentHours),
      // Los tres que el AVISO necesita y el conteo no usaba. `lastInboundAt` ademas es la mitad
      // de la clave de la marca: sin el, "ya avise" valdria para la persona en vez de para este
      // silencio, y el que vuelve a escribir y se va otra vez quedaria mudo para siempre.
      lastInboundAt: state?.lastInboundAt || row?.last_inbound_at || null,
      contacto: state?.publicContact || state?.contactRef || null,
      inboxId: state?.inboxId ?? null,
      // El MEDIO (`Channel::Whatsapp` / `Channel::WebWidget`) llega en el payload del webhook y
      // la FILA no lo guarda, asi que desde un barrido sale null y `construirAviso` lo omite —
      // nunca lo inventa. Quien identifica la via hoy es el `inbox` (4 web / 5 WhatsApp), que va
      // en el aviso. Se pasa igual para que el dia que la columna exista, el aviso lo diga solo.
      channelType: state?.channelType ?? null,
    });
  }

  result.colgadas = {
    medido: true,
    total: filas.length,
    desconocidas: quienes.length,
    nuestras,
    quienes,
    avisados: [],
  };
  if (quienes.length > 0) result.notes.push("colgadas_sin_rescate");
}

// ---------------------------------------------------------------------------
// EL AVISO DE LA COLGADA — que Sergio Urcullo se entere del lead que se enfrio.
// ---------------------------------------------------------------------------

/**
 * Donde viven las marcas en el VPS. Mismo patron que `/var/lib/onia-rescate-avisado` y que
 * `/var/lib/onia-vigia-remotos/<id>`.
 */
export const DIR_COLGADAS_POR_DEFECTO = "/var/lib/onia-colgada-avisado";

/**
 * CUANTOS LEADS FRIOS ENTRAN EN UN AVISO. Es el numero que pidio Sergio Urcullo, textual y con
 * fecha (2026-09-03): "cuando me mandes una tabla por telegram, maximo 5 filas, si hay mas me
 * pierdo".
 *
 * NO ES UN LIMITE DE CUANTOS SE AVISAN, es de cuantos entran POR MENSAJE: los que no entran no se
 * descartan ni se marcan — vuelven al conteo y salen en el barrido siguiente. Esa distincion es
 * todo el asunto: las marcas de colgada no se purgan a proposito (el silencio de un lead no
 * vence), asi que marcar a quien no se nombro lo silencia PARA SIEMPRE, que es peor que el ruido.
 */
export const TOPE_COLGADAS_POR_AVISO = 5;

const guardaDeMarcasReales = crearGuardaDeEfectoReal(
  "hermetismo: un test llego a las marcas REALES de las colgadas. Pasale `deps.marcas` al " +
    "barrido (o un directorio propio a crearMarcasEnDisco): una marca escrita desde la suite " +
    "silencia para siempre el aviso de un lead de verdad.",
);

/**
 * La clave lleva la conversacion Y el ultimo entrante.
 *
 * POR QUE NO ALCANZA LA CONVERSACION SOLA: "ya avise" vale para ESTE silencio, no para la
 * persona. Si el lead vuelve a escribir y se enfria otra vez, eso es un lead perdido nuevo y
 * tiene que volver a sonar; con una clave por conversacion se quedaria mudo para siempre.
 *
 * Se VALIDA entero en vez de sanearse: un id contaminado que "se limpia" produce una clave que
 * colisiona con la de otro lead y lo silencia. Es mas seguro no tener marca —y avisar de mas—
 * que tener la marca equivocada. Sin alguna de las dos partes devuelve `null` y NO se inventa
 * una clave parcial.
 */
export function claveDeColgada({ conversationKey, lastInboundAt } = {}) {
  const conv = String(conversationKey ?? "");
  const desde = String(lastInboundAt ?? "");
  // La clave es el NOMBRE de un archivo: `/` la sacaria del directorio de marcas y `.` sola
  // apuntaria al directorio mismo. `:` es legal en Linux y es lo que separa `chatwoot:58`.
  const legal = /^[0-9A-Za-z_.:+-]+$/;
  if (!legal.test(conv) || !legal.test(desde)) return null;
  if (conv.includes("..") || desde.includes("..")) return null;
  return `colgada-${conv}-${desde}`;
}

/**
 * El canal real. Se arma con las piezas de `aviso-telegram.mjs` —que es donde vive el token y
 * el escapado de HTML— y no con las de otro barrido: el aviso de las colgadas tiene que ser el
 * MISMO aviso que Sergio Urcullo ya recibe cuando el bot deriva o agenda, o son dos canales.
 */
export function canalDeAvisoColgadas(env = process.env) {
  const config = getAvisoTelegramConfig(env);
  return { config, enviar: (aviso) => enviarAvisoTelegram(aviso, config) };
}

/** Cuantos dias enteros lleva callado. Es lo que ordena a cual rescatar primero. */
function diasCallado(silentHours) {
  return silentHours === null || silentHours === undefined ? null : Math.floor(silentHours / 24);
}

/**
 * Avisa por cada desconocido que se enfrio, UNA sola vez.
 *
 * POR QUE "UNA VEZ" NO ES UN ADORNO: las colgadas no se vacian nunca —una conversacion por
 * encima del piso de rescate se queda ahi para siempre—, asi que un aviso por corrida seria el
 * mismo lead repetido todos los dias hasta que Sergio Urcullo aprenda a no leer estos avisos.
 * Eso se lleva puesto tambien al aviso que SI importaba.
 *
 * Y POR QUE NO SE PURGAN LAS MARCAS, al reves que en el rescate: alla la ventana del huerfano
 * dura 12 h y pasado eso la marca ya no puede silenciar nada. Aca el silencio del lead NO
 * vence, asi que purgar seria volver a avisar de alguien de hace meses. El directorio crece de
 * a un archivo por lead perdido, que es una cuenta que ya quisieramos tener grande.
 */
async function avisarColgadas(result, nowIso, deps) {
  const quienes = result.colgadas?.quienes || [];
  if (quienes.length === 0) return;

  const marcas = deps.marcas || crearMarcasEnDisco({
    envVar: "ONIA_COLGADAS_MARCAS",
    porDefecto: DIR_COLGADAS_POR_DEFECTO,
    guarda: guardaDeMarcasReales,
  });
  const aviso = deps.aviso || canalDeAvisoColgadas();

  // LOS MAS VIEJOS PRIMERO, y no es una preferencia: es lo unico que hace DRENAR la cola. Con el
  // tope por mensaje, ordenar por el mas reciente deja al de 37 dias esperando detras de cada
  // lead nuevo que se enfria — inanicion, justo para el que menos tiempo le queda de rescate.
  const porAntiguedad = [...quienes].sort((a, b) => (b?.silentHours ?? -1) - (a?.silentHours ?? -1));

  // Se reserva ANTES de armar el mensaje y solo hasta el tope: la reserva es lo que decide quien
  // viaja. A quien no se reserva no se le toca la marca, asi que vuelve al conteo y sale en el
  // barrido siguiente — el tope pospone, no descarta.
  const elegidos = [];
  for (const quien of porAntiguedad) {
    if (elegidos.length >= TOPE_COLGADAS_POR_AVISO) break;
    const clave = claveDeColgada(quien);
    // `null` = no pude recordar. NO es `false`: mandar sin reserva confirmada es arriesgarse a
    // repetir el aviso en cada corrida, que es el ruido que apaga el canal. Se dice y se sigue.
    const reserva = await marcas.reservar(clave);
    if (reserva === false) continue;
    if (reserva !== true) {
      result.warnings.push(
        `${quien.conversationKey}: no se pudo recordar el aviso de la colgada, no se manda`,
      );
      continue;
    }
    elegidos.push({ quien, clave });
  }
  if (elegidos.length === 0) return;

  const texto = construirAvisoDeColgadas({
    leads: elegidos.map(({ quien }) => ({
      conversationKey: quien.conversationKey,
      contacto: quien.contacto || quien.displayName || null,
      botStage: quien.botStage,
      inboxId: quien.inboxId,
      dias: diasCallado(quien.silentHours),
    })),
    // El TOTAL de leads frios, no los que viajan: es lo que le dice cuanto hay en juego. Sale de
    // `desconocidas` —lo nuestro ya quedo afuera con el mismo criterio que usa el barrido para no
    // escribirse solo—, nunca de `total`, que incluye nuestras propias pruebas.
    total: result.colgadas?.desconocidas ?? elegidos.length,
  });

  try {
      // EL VEREDICTO ES EL `status`, NO LA AUSENCIA DE EXCEPCION. `enviarAvisoTelegram` casi
      // nunca tira: devuelve `{status:"sent"|"skipped"|"failed"}`. "skipped" es el canal apagado
      // (`ONIA_BOT_TG_AVISO`) y "failed" es encendido sin credencial — los dos estados en los que
      // el lanzador del barrido no le paso el entorno, que es como este aviso nacio mudo. Mirar
      // solo el `throw` daba por ENTREGADO lo que nunca salio, y como las marcas de colgada no se
      // purgan (el silencio del lead no vence) ese lead quedaba silenciado PARA SIEMPRE, incluso
      // despues de arreglar el entorno: el defecto de configuracion se volvia permanente.
      const veredicto = await aviso.enviar(texto);
      const status = veredicto?.status;
      if (status && status !== "sent") {
        throw Object.assign(new Error(veredicto?.reason || `aviso ${status}`), { noEntregado: true });
      }
    // ENTREGADO: ahora si se escribe el veredicto adentro de la marca. Hasta esta linea la marca
    // era una reserva EN VUELO, y una reserva en vuelo se retoma; lo que silencia al lead para
    // siempre es la confirmacion, no el archivo. Sin esto, un proceso que reserva y muere antes de
    // entregar deja al lead mudo para siempre — paso el 2026-09-25 con cinco desconocidos reales.
    for (const { quien, clave } of elegidos) {
      await marcas.confirmar?.(clave, "sent");
      (result.colgadas.avisados ||= []).push(quien.conversationKey);
    }
  } catch (error) {
    if (error?.hermetismo) throw error; // un test sin `deps.aviso` se entera, no se silencia
    // La marca existe para no repetir un aviso ENTREGADO. Si Telegram se cayo —o si el canal
    // contesto que no lo mando—, estos leads no se anunciaron NUNCA: se sueltan TODOS para que el
    // barrido siguiente los reintente, o la reserva dejaria de evitar ruido y pasaria a tragarse
    // al unico aviso que importaba. Es un solo envio para cinco: o se sueltan los cinco, o se
    // pierden los cinco — y las marcas de colgada no se purgan, asi que "perderse" es para
    // siempre.
    for (const { clave } of elegidos) await marcas.liberar?.(clave);
    // Los NOMBRA a todos, no los cuenta: un warning que dice "5 colgadas" y no cuales deja al
    // lead perdido en silencio, que es el bug original. El log es interno — aca no rige el tope
    // de cinco filas, que es del canal de Telegram.
    result.warnings.push(
      `${elegidos.map(({ quien }) => quien.conversationKey).join(", ")}: el aviso de la colgada NO salio ` +
        `(${String(error?.message || error).slice(0, 120)}) — se reintenta en el proximo barrido`,
    );
  }
}

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
    // Tri-estado a proposito: `null` es "nadie pudo preguntar", `0` es "mire y no hay ninguna".
    // Aplanarlos en 0 hace que el barrido diga "no se perdio ningun lead" justo cuando esta ciego,
    // y falla hacia el lado caro: el que calla el aviso.
    // `avisados` es lo unico que prueba que el lead perdido SALIO del sistema hacia una persona.
    // Vacio en dry-run y vacio cuando ya se habia avisado: las dos cosas son correctas.
    colgadas: { medido: false, total: null, desconocidas: null, nuestras: null, quienes: [], avisados: [] },
    warnings: store.warnings,
  };

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

  const rows = await store.sweepFollowUpCandidates(nowIso, config, limit);
  if (!rows) {
    // Sin base o base caida: lista vacia. El motivo ya quedo en store.warnings.
    result.notes.push("barrido_sin_resultado");
    return result;
  }
  result.scanned = rows.length;

  // Despues del barrido a proposito: primero el trabajo, despues la cuenta de lo que ya no se
  // alcanza. Si la base esta caida el sweep de arriba ya corto, y entonces esto queda en NO MEDIDO,
  // que es la verdad — no habria con que contar.
  await contarColgadas(result, store, nowIso, config, limit);

  // Y CONTAR NO ES AVISAR. Hasta el 2026-09-24 el lead perdido quedaba nombrado en una linea de
  // la salida del cron y nadie la leia: `conv 58` —un lead de WhatsApp llegado desde la web,
  // atendido bien— estuvo seis dias tibio sin que Sergio Urcullo supiera que existia. Solo en
  // `emit`: mirar el barrido no puede gastar el unico aviso del lead.
  if (emit) await avisarColgadas(result, nowIso, deps);

  // Sergio todavia no definio los 2 bloques de demo: M3 saldria con "HORARIO A (pendiente de
  // definir)". Se bloquea el envio ANTES del CAS (no se quema la unica reserva) y se dice quien
  // esta esperando. No fabricamos horarios.
  const blocked = rows.length > 0 && slotsPending(config);
  if (blocked) {
    result.notes.push("slots_sin_definir");
    store.warnings.push("followup: los 2 horarios de demo siguen sin definir — no se manda M3");
  }

  // CUOTA AGOTADA: se corta ANTES del CAS, igual que los horarios sin definir y por el mismo
  // motivo — la reserva es de un solo uso. Quemarla aca perderia el follow-up tambien el mes que
  // viene, cuando la cuota se renueve y la conversacion ya figure como atendida.
  const sinCupo = rows.length > 0 && cuotaAgotada(config);
  if (sinCupo) {
    result.notes.push("cuota_agotada");
    store.warnings.push(
      `followup: cuota mensual agotada (${config.cuota?.usadas ?? "?"}/${config.cuota?.limite ?? "?"}) — no se manda M3`,
    );
  }

  for (const row of rows) {
    const state = stateFromRow(row);
    const key = state?.conversationKey || row?.conversation_key || null;

    const reason = skipReason(state, nowIso, config);
    if (reason) {
      result.skipped.push({ conversationKey: key, reason });
      continue;
    }
    if (sinCupo) {
      result.skipped.push({ conversationKey: key, reason: "cuota_agotada" });
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

    // Pasadas las 24 h el texto libre NO sale (131047): el mismo mensaje va como plantilla paga.
    // Sin dos horarios de verdad no hay plantilla posible — y entonces no se manda NADA, ni siquiera
    // el texto libre (que fuera de la ventana tampoco llegaria). Se corta ANTES del CAS para no
    // quemar la unica reserva: la conversacion sigue elegible cuando haya horarios.
    const fueraDeVentana = outsideWindow(state, nowIso, config);
    const plantilla = fueraDeVentana ? followUpTemplate(built.nextState, config) : null;
    if (fueraDeVentana && !plantilla) {
      result.skipped.push({ conversationKey: key, reason: "slots_sin_definir" });
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
      templateKey: plantilla ? plantilla.templateKey : built.reply.templateKey,
      replySource: built.reply.replySource,
      text: plantilla ? plantilla.text : built.reply.text,
      // QUE se manda, no solo si salio: la plantilla de marketing cuesta 6,5x el texto libre
      // (0,0740 vs 0,0113 USD) y n8n le reporta esto a Sergio. Si un dia el barrido empieza a
      // mandar plantillas de a decenas, se tiene que ver ACA y no en la factura de Meta.
      sendKind: plantilla ? "plantilla" : "texto_libre",
      templateName: plantilla ? plantilla.name : null,
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

    // Envio ANTES del registro: asi `delivery_status` dice lo que paso y no lo que se pensaba hacer.
    const entrega = await deliver(state, base.text, config, deps, plantilla ? plantilla.params : null);
    const deliveryStatus = entrega.status;
    if (entrega.warning) result.warnings.push(`${key}: ${entrega.warning}`);

    const fila = [
      {
        messageKey: followUpMessageKey(state.conversationKey, built.nextState.followupStep),
        direction: "outbound",
        author: "bot",
        templateKey: base.templateKey,
        replySource: base.replySource,
        text: base.text,
        deliveryStatus,
        stageBefore: state.botStage,
        stageAfter: built.nextState.botStage,
      },
    ];
    const extra = { raw: { followup: true, step: built.nextState.followupStep, now: nowIso } };

    // EL REGISTRO, CON UN SEGUNDO INTENTO. El mensaje YA SALIO: si la fila no entra, Meta nos cobra
    // un envio que nuestra base dice que no existio y el medidor (usage-run.mjs) cuenta de MENOS.
    // Es el espejo exacto del bug del recordatorio, que facturaba de mas.
    //
    // Reintentar es GRATIS y no puede duplicar NADA: NO se vuelve a mandar (`deliver()` no se llama
    // otra vez, la regla de "preferimos perder un mensaje a mandar dos" queda intacta) y el insert es
    // IDEMPOTENTE — `message_key` es determinista y va con `on_conflict=ignore-duplicates`, asi que
    // si la primera pasada si habia entrado, la segunda devuelve 0 filas y no escribe nada.
    // UN solo reintento, sin espera: cubre el corte transitorio (la falla realista, con el CAS
    // recien confirmado milisegundos antes) sin retrasar el cron ni encadenar timeouts.
    let wrote = await store.insertOutbound(fila, built.nextState, extra);
    if (wrote === null) wrote = await store.insertOutbound(fila, built.nextState, extra);

    // Y SI NI ASI ENTRO, SE GRITA. Hasta hoy esto moria como un `logged: false` perdido dentro del
    // array y nadie se enteraba: perder plata EN SILENCIO es peor que perderla a la vista. Se avisa
    // con la conversacion y el carril (una plantilla de marketing cuesta 6,5x el texto libre), y
    // queda la nota `envio_sin_fila` para que n8n lo pueda leer sin parsear texto.
    // Solo se grita cuando el mensaje SALIO de verdad: `skipped` (dry-run), `simulated` y `failed`
    // no los cobra Meta, asi que su fila faltante no es plata — y el motivo ya quedo en
    // `store.warnings`, que el propio store empuja en cada fallo de red.
    // EXIT 0 IGUAL: se avisa y se sigue. Si esto reventara, n8n reintentaria el barrido entero y el
    // prospecto recibiria DOS follow-ups — peor que una fila que falta.
    if (wrote === null && deliveryStatus === "sent") {
      result.notes.push("envio_sin_fila");
      result.warnings.push(
        `${key}: MENSAJE ENVIADO SIN FILA en bot_messages (${base.sendKind}${base.templateName ? ` ${base.templateName}` : ""}) — Meta lo cobra y el medidor NO lo cuenta`,
      );
    }

    // `logged` = "existe la fila", no "la escribi yo": 0 filas con `on_conflict` significa que ya
    // estaba (el reintento de arriba lo vuelve un desenlace normal, no una rareza). null es el unico
    // caso en que NO hay fila.
    result.send.push({ ...base, reserved: true, deliveryStatus, logged: wrote !== null });
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
    // La marca de PLANTILLA va en la tabla que Sergio lee antes de encender: en el dry-run un envio
    // pago y uno gratis se veian exactamente igual, y la diferencia es 6,5x.
    const carril = item.sendKind === "plantilla" ? ` · PLANTILLA ${item.templateName} (paga)` : "";
    lines.push(
      `  ${item.conversationKey} [${item.channel}] ${item.displayName || "sin nombre"} — ${item.botStage}, callado hace ${item.silentHours} h${carril}`,
    );
    for (const line of String(item.text).split("\n")) lines.push(`      | ${line}`);
    lines.push("");
  }

  lines.push(`NO SE MANDA (${result.skipped.length})`);
  if (result.skipped.length === 0) lines.push("  (ninguna)");
  for (const item of result.skipped) lines.push(`  ${item.conversationKey} — ${item.reason}`);

  // El tope habla con su cuenta: sin esto, un lead colgado y un dia sin nadie se leen igual.
  const colgadas = result.colgadas || {};
  lines.push("");
  if (!colgadas.medido) {
    lines.push("COLGADAS (por encima del piso): NO MEDIDO — no pude preguntar");
  } else {
    lines.push(
      `COLGADAS (por encima del piso): ${colgadas.total} · desconocidas: ${colgadas.desconocidas} · nuestras: ${colgadas.nuestras}`,
    );
    for (const item of colgadas.quienes || []) {
      lines.push(
        `  ${item.conversationKey} ${item.displayName || "sin nombre"} — ${item.botStage}, esperando hace ${item.silentHours} h · YA NO SE RESCATA`,
      );
    }
  }

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
