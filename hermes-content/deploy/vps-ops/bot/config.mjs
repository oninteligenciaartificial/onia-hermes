// ONIA — Chatbot propio (el que atiende "DEMO"): CONFIG POR CLIENTE.
// Todo lo que cambia de un cliente a otro vive ACA (spec §7.1): identidad y tono, disparador,
// preguntas de calificacion, horarios ofrecidos, destino del handoff, horario de atencion y
// los textos M0-M7 del guion.
// Lo que NO se toca por cliente (spec §7.2) vive en bot-engine.mjs y guardrails.mjs:
// la maquina de estados, el guardrail determinista, el silencio ante un humano, opt-in/opt-out,
// la reserva CAS y la bitacora completa.
// Spec: hermes-content/docs/ONIA_CHATBOT_PROPIO_SPEC_20260725.md

// ---------------------------------------------------------------------------
// Horarios de demo
// ---------------------------------------------------------------------------
// TODO(Sergio): definir los 2 horarios fijos semanales de demo (punto 4 del STOP del plan de
// Lucia; §9.1 de la spec: "sin eso el bot no agenda"). Son 2 bloques FIJOS que Sergio reserva,
// NO se leen del Google Calendar (asi no hace falta un integrador de agenda y no hay doble booking).
// Mientras esten pendientes el motor devuelve la nota 'slots_sin_definir' y scheduled_at queda null.
// PROHIBIDO inventar horarios aca.
export const DEMO_SLOTS = Object.freeze([
  Object.freeze({ key: "A", label: "HORARIO A (pendiente de definir)", startAt: null, pending: true }),
  Object.freeze({ key: "B", label: "HORARIO B (pendiente de definir)", startAt: null, pending: true }),
]);

// ---------------------------------------------------------------------------
// Guion — texto EXACTO de la spec §2.2. Es texto fijo: NO pasa por el LLM y NO pasa por el
// guardrail (lo escribimos nosotros y esta versionado). Variables entre {{ }}.
// ---------------------------------------------------------------------------
export const SCRIPT = Object.freeze({
  // M0 — bienvenida + disclosure + las 3 preguntas juntas.
  M0: [
    "¡Hola! Soy el asistente automático de Onia — sí, un bot, los mismos que hacen a Lucía 🙂",
    "Gracias por escribir. Te agendo la demo en 2 minutos, pero primero quiero saber si te va a servir de verdad.",
    "",
    "Contame tres cosas rápidas:",
    "1️⃣ ¿La clínica es tuya o trabajás en la de alguien más?",
    "2️⃣ ¿Cuántos sillones tenés? (1, 2, 3 o más)",
    "3️⃣ ¿En qué ciudad estás?",
  ].join("\n"),

  // M0_DISCLOSURE — AGREGADO: mismas 2 primeras lineas de M0, sin las 3 preguntas. Se usa cuando
  // el primer mensaje YA trae los 3 datos: el disclosure es innegociable (D2) pero preguntar lo
  // que el prospecto acaba de contestar hace quedar mal al producto.
  M0_DISCLOSURE: [
    "¡Hola! Soy el asistente automático de Onia — sí, un bot, los mismos que hacen a Lucía 🙂",
    "Gracias por escribir.",
  ].join("\n"),

  // M1a — falta algun dato. Maximo 2 re-preguntas; a la tercera, handoff.
  M1a: "Perfecto, anotado {{datos_que_si_dio}}. Me falta sólo {{dato_faltante}} — ¿me lo pasás?",

  // M1b — calificado, ofrece los 2 horarios.
  M1b: [
    "Buenísimo. Con {{sillones}} {{sillon_palabra}} en {{ciudad}} esto te sirve, sí.",
    "",
    "La demo la da {{humano}} (humano, esta vez 😄): son 15-20 minutos por videollamada — o presencial si estás en Santa Cruz. Te muestra la agenda, el agente que reprograma solo por WhatsApp, y hacen la cuenta con TUS números.",
    "",
    "¿Cuál te va mejor?",
    "**A)** {{slot_a}}",
    "**B)** {{slot_b}}",
    "",
    "(Si ninguno te sirve, decime y lo coordina {{humano}} directo.)",
  ].join("\n"),

  // M1c — descalificado suave.
  M1c: [
    "Gracias por contarme. Hoy {{producto}} está armado para clínicas dentales de 1 a 3 sillones, así que no te quiero hacer perder 20 minutos si no es tu caso.",
    "",
    "Si en algún momento manejás vos la clínica, o conocés a alguien a quien le sirva, escribime y lo agendamos. Y si querés ver cómo funciona igual, todo está en el feed de Lucía.",
  ].join("\n"),

  // M2 — confirmacion + pre-arma la demo.
  M2: [
    "Listo, agendado: **{{dia_hora_elegida}}**. Te llega el link el mismo día por acá.",
    "",
    "Para que {{humano}} llegue con la demo armada para vos: ¿qué es lo que más tiempo te come hoy — la **agenda**, los **cobros**, o los **pacientes que no vuelven**?",
    "",
    "(Respondé con una palabra y listo. Si no, igual nos vemos {{dia}}.)",
  ].join("\n"),

  // M2b — acuse del dolor capturado. AGREGADO (no esta en la spec): sin esto el bot queda mudo
  // ante la respuesta que el propio M2 pide. Sigue siendo texto fijo y sin cifras.
  M2b: "Anotado: **{{pain_point}}**. {{humano}} llega con eso preparado. Nos vemos {{dia_hora_elegida}}.",

  // M3 — follow-up unico a las 22 h (dentro de la ventana de servicio de 24 h de Meta).
  M3: [
    "¡Hola de nuevo! Te escribí ayer por la demo de {{producto}} y quedó a medias — sé que la clínica no para.",
    "",
    "Te dejo dos opciones nuevas por si te sirven: **{{slot_a}}** o **{{slot_b}}**.",
    "Si preferís que te escriba en otro momento, decime \"después\" y no te molesto más.",
  ].join("\n"),

  // M4 — el prospecto trae el precio. El cuerpo NUNCA cotiza; el cierre lo pone el motor segun
  // el estado (spec §2.3 + regla de oro §2.1: el estado no avanza sin dato capturado).
  M4_BODY: [
    "Buena pregunta, y te la contesto derecho: **el número exacto te lo pasa {{humano}} en la demo**, porque depende de cuántos sillones tenés y de qué necesitás activar. No te quiero tirar una cifra que después no sea la tuya.",
    "",
    "Lo que sí te adelanto: en la demo se hace la cuenta con TUS números — cuánto te cuesta hoy un hueco en la agenda contra lo que cuesta el sistema. Si no cierra, te lo decimos ahí mismo.",
  ].join("\n"),

  // M5 — handoff a humano.
  M5: [
    "Eso lo tiene que ver {{humano}}, no yo — soy un bot y no quiero inventarte una respuesta.",
    "",
    "Ya le pasé tu consulta con todo lo que me contaste. Te escribe él desde este mismo número, en horario de oficina (lun-vie, 9:00-18:00). Si es urgente, decime \"urgente\" y lo marco.",
  ].join("\n"),

  // M6 — opt-out.
  M6: "Listo, no te escribo más. Si algún día querés verlo, escribí DEMO y arrancamos de nuevo. ¡Éxitos con la clínica!",

  // M7 — fuera de horario. Se APENDEA a la respuesta que corresponda, no la reemplaza.
  M7: "_(Estoy respondiendo automático fuera de horario de oficina. {{humano}} te confirma en la mañana.)_",

  // SIAT / fiscal — respuesta fija segura (spec §2.3). Solo lo que es publico, cero promesa.
  M_SIAT_BODY:
    "Sobre facturación en línea te contesto sólo lo que es público: desde el 30 de septiembre es obligatoria y el SIN tiene un portal gratis. Lo que hace {{producto}} es que los datos ya estén cargados para que no tipees dos veces. El detalle exacto de tu caso lo ve {{humano}} en la demo.",

  // Audio que no se pudo transcribir (spec §2.3).
  M_AUDIO_FAIL: "No me llegó bien el audio, ¿me lo escribís?",

  // Imagen / documento (spec §2.3): se reconoce y se pasa a humano.
  M_ATTACH_BODY: "Recibí tu archivo. Lo mira {{humano}}, no lo puedo leer bien yo.",

  // Cierres de embudo — AGREGADOS: son la linea con la que una respuesta fuera de guion
  // (precio / SIAT / archivo) vuelve al embudo sin saltear la calificacion.
  PENDING_CALIFICACION: "Volviendo a lo nuestro: me falta {{dato_faltante}} — ¿me lo pasás?",
  PENDING_HORARIO: "¿Te reservo **{{slot_a}}** o **{{slot_b}}**?",
  PENDING_AGENDADA: "Igual ya quedamos para **{{dia_hora_elegida}}**.",
});

// ---------------------------------------------------------------------------
// Config completa
// ---------------------------------------------------------------------------
export const DEFAULT_CONFIG = Object.freeze({
  botKey: "onia-demo-bot",
  tenant: "onia",

  identity: Object.freeze({
    botName: "el asistente automático de Onia",
    productName: "Onia Dental",
    humanName: "Sergio",
    tone: "voseo-boliviano-informal",
  }),

  // Disparadores. 'demo' abre/reabre la conversacion; 'optOut' la cierra en cualquier punto.
  triggers: Object.freeze({
    demo: Object.freeze(["demo", "quiero la demo", "info", "informacion", "quiero info"]),
    optOut: Object.freeze(["stop", "baja", "no me escribas", "no me interesa", "dejame de escribir"]),
  }),

  qualification: Object.freeze({
    maxReAsks: 2, // a la 3ra re-pregunta sin datos -> handoff (spec D3)
    fields: Object.freeze([
      Object.freeze({ key: "ownsClinic", missLabel: "si la clínica es tuya" }),
      Object.freeze({ key: "chairs", missLabel: "cuántos sillones tenés" }),
      Object.freeze({ key: "city", missLabel: "en qué ciudad estás" }),
    ]),
    // Publico objetivo: clinicas dentales. NO se descarta por cantidad de sillones (una clinica
    // de 6 sillones es un cliente mejor, no peor); se descarta por no ser el publico (spec §2.2 M1c).
    targetChairs: Object.freeze({ min: 1, max: 3 }),
  }),

  slots: DEMO_SLOTS,

  handoff: Object.freeze({
    ownerRoleKey: "sergio",
    reviewQueue: Object.freeze({
      sourceType: "lead", // ya esta en el CHECK de review_queue: no hace falta ALTER
      reviewerRoleKey: "sergio",
      sensitive: true,
      status: "pending",
    }),
    notifyChannel: "telegram",
  }),

  // Valores EXACTOS que el panel entiende (onia-center-store.ts). Escribir otra cosa deja el
  // lead mal clasificado y en silencio.
  pipelineStatus: Object.freeze({
    calificado: "Contactado",
    demo_agendada: "Reunion",
    demo_realizada: "Propuesta",
    descartado: "Perdido",
  }),

  businessHours: Object.freeze({
    days: Object.freeze([1, 2, 3, 4, 5]), // lun-vie (0 = domingo)
    startHour: 9,
    endHour: 18,
    tzLabel: "America/La_Paz",
    tzOffsetMinutes: -240, // Bolivia no tiene horario de verano: siempre UTC-4
  }),

  offScript: Object.freeze({ maxBeforeHandoff: 2 }), // 2do malentendido -> handoff

  followUp: Object.freeze({
    maxSteps: 1, // regla N7: UN follow-up y despues silencio
    afterHours: 22, // 22 h, no 24: se queda dentro de la ventana de servicio de Meta
    staleAfterDays: 7,
  }),

  // Arranca en true (patron de Bolivian Electric): corre todo el pipeline y registra
  // delivery_status='skipped' sin mandar un solo mensaje.
  dryRun: true,

  script: SCRIPT,
});

/** Config del cliente = DEFAULT_CONFIG + overrides (merge de un nivel por clave raiz). */
export function createBotConfig(overrides = {}) {
  const merged = { ...DEFAULT_CONFIG };
  for (const [key, value] of Object.entries(overrides || {})) {
    if (value && typeof value === "object" && !Array.isArray(value) && DEFAULT_CONFIG[key] && typeof DEFAULT_CONFIG[key] === "object" && !Array.isArray(DEFAULT_CONFIG[key])) {
      merged[key] = { ...DEFAULT_CONFIG[key], ...value };
    } else {
      merged[key] = value;
    }
  }
  return Object.freeze(merged);
}

/** true si los 2 horarios siguen siendo el placeholder (Sergio no los definio todavia). */
export function slotsPending(config = DEFAULT_CONFIG) {
  return (config.slots || []).some((slot) => slot && slot.pending === true);
}

/** Reemplaza {{clave}} por su valor. Corre SIEMPRE DESPUES del guardrail (spec §3.1). */
export function renderTemplate(text, vars = {}) {
  return String(text ?? "").replace(/\{\{\s*([a-z0-9_]+)\s*\}\}/gi, (match, key) => {
    const value = vars[key];
    return value === undefined || value === null ? match : String(value);
  });
}

/** "a", "a y b", "a, b y c" */
export function joinEs(items) {
  const list = (items || []).filter(Boolean);
  if (list.length === 0) return "";
  if (list.length === 1) return list[0];
  return `${list.slice(0, -1).join(", ")} y ${list[list.length - 1]}`;
}

/**
 * ¿El instante recibido cae fuera del horario de atencion?
 * Determinista: solo lee el ISO inyectado, nunca Date.now().
 */
export function isOutsideBusinessHours(isoInstant, config = DEFAULT_CONFIG) {
  if (!isoInstant) return false;
  const ms = Date.parse(isoInstant);
  if (Number.isNaN(ms)) return false;
  const bh = config.businessHours;
  const local = new Date(ms + bh.tzOffsetMinutes * 60000);
  if (!bh.days.includes(local.getUTCDay())) return true;
  const hour = local.getUTCHours() + local.getUTCMinutes() / 60;
  return hour < bh.startHour || hour >= bh.endHour;
}
