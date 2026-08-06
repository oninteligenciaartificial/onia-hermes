// ONIA — Chatbot propio: RESERVA REAL en Cal.com.
//
// EL PROBLEMA QUE RESUELVE: hasta hoy el bot decia "Listo, agendado" y no reservaba NADA.
// `calcom-availability.mjs` solo LEE disponibilidad (`slots/getSchedule`); nadie escribia la
// reserva, y `calendar_event_id` quedaba en null para siempre. Consecuencias reales, no teoricas:
// dos prospectos podian elegir el mismo horario, y la demo no aparecia en el calendario de
// Sergio — o sea que el bot cerraba reuniones a las que no iba a ir nadie.
//
// COMO RESERVA: `POST /api/book/event`, el MISMO endpoint que usa la pagina publica de reservas.
// Se eligio ese y no la API v1 (`/api/bookings`) por dos razones verificadas contra el VPS:
//   1. La API v1 es un servicio aparte que en este self-hosted NO esta desplegado (devuelve 404),
//      y ademas exigiria manejar una API key (hoy hay 0 en la base).
//   2. Al ser el camino publico, Cal.com aplica SUS PROPIAS reglas: si el horario ya se tomo,
//      responde 409. La proteccion contra doble reserva no la inventamos nosotros — verificado:
//      reservar el mismo horario dos veces da 409 `no_available_users_found_error`.
//
// DOS TIPOS DE EVENTO A PROPOSITO (verificado 2026-07-31):
//   - `demo-onia` (publico) tiene 12 campos custom, 10 OBLIGATORIOS (empresa, presupuesto,
//     urgencia, rol...). Esta bien para el humano que entra solo a cal.onia.com.bo.
//   - `demo-bot` (oculto, id 5) no tiene ninguno. El bot ya califico por WhatsApp con 3 datos;
//     pedirle 10 mas lo perderia en el tercero.
//   Comparten `userId` y `scheduleId`, asi que una reserva en uno BLOQUEA al otro. Por eso la
//   disponibilidad se lee de `demo-onia` (publico: un evento oculto no publica slots) y se
//   reserva en `demo-bot`.
//
// Tolerante por contrato: no tira NUNCA. Si Cal.com no responde, devuelve `ok:false` con una
// razon y el llamador decide. Un fallo de calendario no puede dejar al prospecto sin respuesta.

import { DEFAULT_CONFIG } from "./config.mjs";

/**
 * Duracion de la demo. NO es un numero suelto: sale del MISMO bloque del que el guion saca lo que
 * le promete al prospecto ({{demo_duracion}}), asi que el texto y el calendario no pueden decir
 * dos cosas distintas. Igual que el tipo de evento; si no coinciden, manda el tipo de evento.
 */
export const DEFAULT_DURATION_MINUTES = DEFAULT_CONFIG.demo.duracionMinutos;

/** Bolivia no tiene horario de verano: siempre UTC-4. */
export const DEFAULT_TIME_ZONE = "America/La_Paz";

/**
 * Config desde el entorno. `eventTypeId` es el del evento OCULTO del bot (`demo-bot`), NO el
 * publico: reservar en el publico falla por los 10 campos obligatorios.
 * @param {number} [fallbackMinutes]  la duracion del conocimiento/config, que se usa cuando el
 *   entorno no fija CALCOM_BOT_DURATION_MINUTES. El entorno sigue ganando: es el freno de mano
 *   del que despliega y no queremos que una edicion de datos se lo saque.
 */
export function getBookingConfig(env = process.env, fallbackMinutes = DEFAULT_DURATION_MINUTES) {
  const rawId = Number(env.CALCOM_BOT_EVENT_TYPE_ID);
  const rawDuration = Number(env.CALCOM_BOT_DURATION_MINUTES);
  const fallback = Number.isFinite(fallbackMinutes) && fallbackMinutes > 0 ? fallbackMinutes : DEFAULT_DURATION_MINUTES;
  return {
    baseUrl: String(env.CALCOM_BASE_URL || "").replace(/\/+$/, ""),
    eventTypeId: Number.isInteger(rawId) && rawId > 0 ? rawId : null,
    durationMinutes: Number.isFinite(rawDuration) && rawDuration > 0 ? rawDuration : fallback,
    timeZone: String(env.CALCOM_TIMEZONE || DEFAULT_TIME_ZONE),
  };
}

/**
 * Correo del asistente. El bot NO le pide el mail al prospecto a proposito (cada dato que pide
 * es un prospecto que se cae), pero Cal.com exige uno. Se arma uno propio y trazable en el
 * dominio de Onia: la confirmacion le llega a Onia, no a un correo inventado del prospecto.
 * NUNCA fabricar un mail con pinta de real: seria dato falso en el calendario del cliente.
 */
export function botAttendeeEmail(conversationKey, domain = "onia.com.bo") {
  const safe = String(conversationKey || "sin-clave").replace(/[^a-zA-Z0-9]+/g, "-").slice(0, 40);
  return `bot+${safe}@${domain}`;
}

/** Payload de `/api/book/event`. Puro: mismo input, mismo output. */
export function buildBookingPayload(options = {}) {
  const startMs = Date.parse(options.startAt);
  if (!Number.isFinite(startMs)) return null;

  const minutes = Number(options.durationMinutes) > 0 ? Number(options.durationMinutes) : DEFAULT_DURATION_MINUTES;
  const start = new Date(startMs);
  const end = new Date(startMs + minutes * 60_000);

  return {
    eventTypeId: options.eventTypeId,
    start: start.toISOString(),
    end: end.toISOString(),
    timeZone: options.timeZone || DEFAULT_TIME_ZONE,
    language: "es",
    metadata: {},
    responses: {
      name: String(options.name || "Prospecto").slice(0, 120),
      email: options.email,
      ...(options.notes ? { notes: String(options.notes).slice(0, 500) } : {}),
    },
  };
}

/** Lo que el bot ya sabe del prospecto, en una linea para el calendario. Nunca inventa. */
export function buildBookingNotes(qualification = {}) {
  // Los campos de calificacion son rubro/tamano/ciudad, iguales para todos los rubros. `chairs`
  // sobrevive como dato de RAMA (solo dental): si esta, suma; si no, no se nombra. Antes esto
  // escribia \"clinica propia\" y \"sillones\" siempre, asi que la reserva de una ferreteria
  // llegaba al calendario vacia.
  const parts = [];
  if (qualification.industry) parts.push(`rubro: ${qualification.industry}`);
  if (qualification.teamSize !== undefined && qualification.teamSize !== null) parts.push(`personas: ${qualification.teamSize}`);
  if (qualification.city) parts.push(`ciudad: ${qualification.city}`);
  if (qualification.chairs !== undefined && qualification.chairs !== null) parts.push(`sillones: ${qualification.chairs}`);
  parts.push("agendado por el asistente automatico de Onia");
  return parts.join(" | ");
}

/**
 * Crea la reserva.
 *
 * @returns {Promise<{ok: boolean, uid: string|null, reason: string, warnings: string[]}>}
 *   `reason: "horario_tomado"` es el caso IMPORTANTE: alguien gano la carrera por ese horario.
 *   El llamador tiene que ofrecer el otro, no repetir "listo, agendado".
 */
export async function createBooking(options = {}, deps = {}) {
  const warnings = [];
  const config = options.config || getBookingConfig(deps.env || process.env, options.durationMinutes);
  const doFetch = deps.fetch || options.fetch || globalThis.fetch;

  if (!config.baseUrl || !config.eventTypeId) {
    return { ok: false, uid: null, reason: "sin_config", warnings: ["calcom: falta CALCOM_BASE_URL o CALCOM_BOT_EVENT_TYPE_ID"] };
  }
  if (typeof doFetch !== "function") {
    return { ok: false, uid: null, reason: "sin_fetch", warnings: ["calcom: no hay implementacion de fetch"] };
  }

  const payload = buildBookingPayload({
    eventTypeId: config.eventTypeId,
    startAt: options.startAt,
    durationMinutes: config.durationMinutes,
    timeZone: config.timeZone,
    name: options.name,
    email: options.email || botAttendeeEmail(options.conversationKey),
    notes: options.notes,
  });
  if (!payload) {
    return { ok: false, uid: null, reason: "inicio_invalido", warnings: [`calcom: startAt invalido: ${options.startAt}`] };
  }

  let response;
  try {
    response = await doFetch(`${config.baseUrl}/api/book/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: deps.signal,
    });
  } catch (error) {
    return { ok: false, uid: null, reason: "error", warnings: [`calcom: la reserva no salio: ${String(error?.message || error).slice(0, 200)}`] };
  }

  // 409 = el horario se ocupo entre que se ofrecio y que el prospecto contesto. NO es un bug:
  // es exactamente la carrera que esta reserva viene a cerrar, y hay que distinguirla de un
  // error de red para poder ofrecer el otro horario en vez de mentir.
  if (response.status === 409) {
    return { ok: false, uid: null, reason: "horario_tomado", warnings: ["calcom: el horario ya estaba tomado"] };
  }

  if (!response.ok) {
    let detail = "";
    try { detail = (await response.text()).slice(0, 200); } catch { /* el cuerpo no importa tanto como el status */ }
    return { ok: false, uid: null, reason: "error", warnings: [`calcom: HTTP ${response.status} ${detail}`] };
  }

  let body = null;
  try { body = await response.json(); } catch { warnings.push("calcom: reservo pero la respuesta no era JSON"); }

  const uid = body && typeof body.uid === "string" ? body.uid : null;
  if (!uid) warnings.push("calcom: reservo pero no devolvio uid");

  return { ok: true, uid, reason: "reservado", warnings };
}
