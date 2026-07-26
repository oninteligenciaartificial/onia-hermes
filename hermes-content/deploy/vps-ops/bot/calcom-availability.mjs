// ONIA — Chatbot propio: DISPONIBILIDAD REAL vía Cal.com (reemplazo del placeholder DEMO_SLOTS).
//
// Por qué existe: config.mjs trae 2 horarios FIJOS hardcodeados a mano (DEMO_SLOTS) porque
// esperábamos que Sergio los dictara. El VPS YA corre Cal.com (onia-calcom-calcom-1) con un
// usuario `onia` y un event-type `demo-onia` (45 min, visible) configurados — investigado y
// verificado 2026-07-26: hay un Schedule "ONIA Comercial Base" con disponibilidad real.
//
// Este módulo consulta el endpoint PÚBLICO que ya usa la página de reserva de Cal.com para
// mostrarle horarios a un visitante anónimo (`/api/trpc/slots/getSchedule`): no hace falta
// API key ni credencial — es el mismo request que haría cualquiera al abrir la página de
// reserva. Se probó en vivo contra `https://cal.onia.com.bo` y devuelve slots reales.
//
// CONTRATO — TOLERANTE, igual que persistence.mjs: nunca tira. Si Cal.com no responde, no está
// configurado, devuelve 4xx/5xx o la ventana viene vacía, `slots` sale `null` y el llamador cae
// al placeholder de config.mjs (DEMO_SLOTS). El bot NUNCA se queda mudo por esto.
//
// Config (no son secretos — son la URL/slug/usuario públicos de la página de reserva):
//   CALCOM_BASE_URL         default "https://cal.onia.com.bo" (o el hostname interno del
//                           contenedor de docker, "http://calcom:3000", si se corre dentro del
//                           mismo stack — más rápido y sin salir a internet).
//   CALCOM_EVENT_TYPE_SLUG  default "demo-onia"
//   CALCOM_USERNAME         default "onia"
//
// Spec: hermes-content/docs/ONIA_CHATBOT_PROPIO_SPEC_20260725.md (§9.1 slots pendientes)

import { DEFAULT_CONFIG } from "./config.mjs";

const ENV_BASE_URL = () => process.env.CALCOM_BASE_URL || "https://cal.onia.com.bo";
const ENV_EVENT_SLUG = () => process.env.CALCOM_EVENT_TYPE_SLUG || "demo-onia";
const ENV_USERNAME = () => process.env.CALCOM_USERNAME || "onia";

// ---------------------------------------------------------------------------
// Helpers puros (testeables sin red)
// ---------------------------------------------------------------------------

/** URL del endpoint público de slots de Cal.com (el mismo que usa la página de reserva). */
export function buildSlotsUrl({ baseUrl, eventTypeSlug, username, startIso, endIso, timeZone }) {
  const input = {
    json: {
      eventTypeSlug,
      usernameList: [username],
      startTime: startIso,
      endTime: endIso,
      timeZone,
    },
    // Cal.com espera 'duration' en el shape de superjson; 'undefined' deja que use la del event-type.
    meta: { values: { duration: ["undefined"] } },
  };
  return `${String(baseUrl).replace(/\/+$/, "")}/api/trpc/slots/getSchedule?input=${encodeURIComponent(JSON.stringify(input))}`;
}

/** Respuesta de Cal.com ({slots: {"2026-07-27": [{time}, ...], ...}}) -> lista plana y ordenada. */
export function flattenSlots(parsed) {
  const byDate = parsed?.result?.data?.json?.slots;
  if (!byDate || typeof byDate !== "object") return [];
  const all = [];
  for (const day of Object.keys(byDate)) {
    for (const slot of byDate[day] || []) {
      if (slot && typeof slot.time === "string" && Number.isFinite(Date.parse(slot.time))) all.push({ time: slot.time });
    }
  }
  all.sort((a, b) => Date.parse(a.time) - Date.parse(b.time));
  return all;
}

/**
 * De la lista completa (puede tener decenas de horarios cada 15 min) elige 2 opciones que
 * tengan sentido para un prospecto: la primera disponible y una segunda separada por al menos
 * `minGapMinutes` (evita ofrecer "14:00" y "14:15" como si fueran opciones distintas).
 * Si no hay ninguna con ese margen, cae al segundo de la lista antes que no ofrecer nada.
 */
export function pickTwoSlots(sorted, options = {}) {
  const minGapMs = (Number(options.minGapMinutes) > 0 ? Number(options.minGapMinutes) : 120) * 60000;
  if (!sorted || sorted.length === 0) return [];
  const first = sorted[0];
  const firstMs = Date.parse(first.time);
  const second = sorted.find((slot) => Date.parse(slot.time) - firstMs >= minGapMs) || sorted[1] || null;
  return second ? [first, second] : [first];
}

/** "2026-07-27T18:00:00.000Z" + "America/La_Paz" -> "lun 27/07 14:00". */
export function formatSlotLabel(iso, timeZone) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return String(iso);
  const parts = new Intl.DateTimeFormat("es-BO", {
    timeZone,
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value || "";
  return `${get("weekday")} ${get("day")}/${get("month")} ${get("hour")}:${get("minute")}`;
}

// ---------------------------------------------------------------------------
// Llamada de red — TOLERANTE POR CONTRATO (nunca tira)
// ---------------------------------------------------------------------------

/**
 * @param {object} [options] { nowIso, windowDays=7, baseUrl, eventTypeSlug, username, timeZone, timeoutMs=4000 }
 * @param {object} [deps]    { fetch } — inyectable para test
 * @returns {Promise<{slots: object[]|null, source: string, warnings: string[]}>}
 *   slots === null  => Cal.com no respondió / no hay horarios / no está configurado: el
 *                      llamador debe caer al placeholder (DEMO_SLOTS). NUNCA se inventa un horario.
 */
export async function getAvailableSlots(options = {}, deps = {}) {
  const warnings = [];
  const baseUrl = String(options.baseUrl ?? ENV_BASE_URL());
  const eventTypeSlug = options.eventTypeSlug || ENV_EVENT_SLUG();
  const username = options.username || ENV_USERNAME();
  const timeZone = options.timeZone || DEFAULT_CONFIG.businessHours.tzLabel;
  const doFetch = deps.fetch || options.fetch || globalThis.fetch;
  const windowDays = Number(options.windowDays) > 0 ? Number(options.windowDays) : 7;
  const timeoutMs = Number(options.timeoutMs) > 0 ? Number(options.timeoutMs) : 4000;

  if (!baseUrl || !eventTypeSlug || !username) {
    return { slots: null, source: "sin_config", warnings: ["calcom: falta baseUrl/eventTypeSlug/username"] };
  }
  if (typeof doFetch !== "function") {
    return { slots: null, source: "sin_fetch", warnings: ["calcom: no hay implementación de fetch disponible"] };
  }

  const nowMs = Date.parse(options.nowIso || new Date().toISOString());
  if (!Number.isFinite(nowMs)) {
    return { slots: null, source: "error", warnings: [`calcom: nowIso inválido: ${options.nowIso}`] };
  }
  const startIso = new Date(nowMs).toISOString();
  const endIso = new Date(nowMs + windowDays * 86400000).toISOString();
  const url = buildSlotsUrl({ baseUrl, eventTypeSlug, username, startIso, endIso, timeZone });

  let res;
  try {
    res = await doFetch(url, { signal: AbortSignal.timeout ? AbortSignal.timeout(timeoutMs) : undefined });
  } catch (error) {
    warnings.push(`calcom: ${error?.message || error}`);
    return { slots: null, source: "error", warnings };
  }

  if (!res.ok) {
    warnings.push(`calcom: HTTP ${res.status}`);
    return { slots: null, source: "error", warnings };
  }

  let parsed;
  try {
    parsed = JSON.parse(await res.text());
  } catch (error) {
    warnings.push(`calcom: respuesta no es JSON válido (${error?.message || error})`);
    return { slots: null, source: "error", warnings };
  }

  const flat = flattenSlots(parsed);
  if (flat.length === 0) {
    warnings.push("calcom: sin horarios disponibles en la ventana consultada");
    return { slots: null, source: "sin_horarios", warnings };
  }

  const picked = pickTwoSlots(flat);
  const slots = picked.map((slot, index) => ({
    key: index === 0 ? "A" : "B",
    label: formatSlotLabel(slot.time, timeZone),
    startAt: slot.time,
    pending: false,
  }));
  return { slots, source: "calcom", warnings };
}
