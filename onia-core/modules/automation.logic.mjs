/*
 * Logica pura del modulo automation (referencia canonica; los productos la portan).
 * Sin estado, sin IO, inmutable: matching de reglas, render de plantillas y la
 * maquina de estados del envio. El ENVIO real (correo/WhatsApp) es external_gate;
 * esto decide QUE se manda y registra el ciclo de vida, no lo envia.
 */

const VAR_RE = /\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g;

/** Variables {{var}} presentes en un texto (sin duplicados, en orden de aparicion). */
export function extractVariables(text = "") {
  const found = [];
  for (const match of String(text).matchAll(VAR_RE)) {
    if (!found.includes(match[1])) found.push(match[1]);
  }
  return found;
}

/**
 * Renderiza una plantilla reemplazando {{var}} por vars[var]. Devuelve el texto
 * y las variables que faltaron (para que el caller decida si enviar o no).
 * No lanza: una var faltante se deja como cadena vacia y se reporta.
 */
export function renderTemplate(template, vars = {}) {
  const body = String(template?.body ?? "");
  const subject = template?.subject != null ? String(template.subject) : null;
  const missing = new Set();

  const replace = (text) =>
    text.replace(VAR_RE, (_, key) => {
      const value = vars[key];
      if (value === undefined || value === null) {
        missing.add(key);
        return "";
      }
      return String(value);
    });

  return {
    subject: subject != null ? replace(subject) : null,
    body: replace(body),
    missing: [...missing],
  };
}

/**
 * Evalua la condicion de una regla contra el contexto de un evento. Convencion:
 *  - clave terminada en "Max": context[base] <= condition[clave]  (ej. hoursBeforeMax: 24)
 *  - clave terminada en "Min": context[base] >= condition[clave]  (ej. daysOverdueMin: 1)
 *  - cualquier otra: igualdad estricta (ej. only: "critical")
 * Condicion vacia => siempre matchea.
 */
export function conditionMatches(condition = {}, context = {}) {
  for (const [key, expected] of Object.entries(condition ?? {})) {
    if (key.endsWith("Max")) {
      const base = key.slice(0, -3);
      if (!(Number(context[base]) <= Number(expected))) return false;
    } else if (key.endsWith("Min")) {
      const base = key.slice(0, -3);
      if (!(Number(context[base]) >= Number(expected))) return false;
    } else if (context[key] !== expected) {
      return false;
    }
  }
  return true;
}

/** True si el evento dispara la regla: activa, mismo triggerType y condicion cumplida. */
export function matchRule(rule, event) {
  if (!rule?.active) return false;
  if (rule?.triggerType !== event?.type) return false;
  return conditionMatches(rule?.condition ?? {}, event?.context ?? {});
}

/** Reglas que dispara un evento (no muta la lista). */
export function evaluateTriggers(rules = [], event) {
  return rules.filter((rule) => matchRule(rule, event));
}

/**
 * Clave de idempotencia de un envio: identifica de forma unica (regla + trigger +
 * evento de negocio + destinatario) para NO encolar dos veces el mismo aviso
 * cuando el cron re-evalua o se reintenta. `event.dedupeId` debe identificar el
 * evento + su ventana (ej. "appt-123:24h", "invoice-9:overdue:2026-07"); si no
 * viene, cae al recipient (menos preciso). Mismo criterio que work_items/intake.
 */
export function dispatchIdempotencyKey(rule, event = {}, recipient = null) {
  const scope = event?.dedupeId ?? recipient ?? "";
  return `${rule?.id ?? ""}:${rule?.triggerType ?? event?.type ?? ""}:${scope}`;
}

/** True si ya se encolo un envio con esta clave (dedupe ANTES de encolar). */
export function isDuplicateDispatch(idempotencyKey, existingKeys = []) {
  const set = existingKeys instanceof Set ? existingKeys : new Set(existingKeys);
  return set.has(idempotencyKey);
}

/**
 * Arma el registro de envio (message_dispatch) de una regla send_message.
 * Renderiza la plantilla con vars; el status arranca en 'queued'. El envio real
 * lo hace el external_gate. Devuelve { dispatch, missing } (missing = vars que
 * faltaron; el caller decide si encolar igual o no).
 */
export function buildDispatch(rule, template, { recipient, partnerId = null, vars = {}, now = new Date().toISOString(), scheduledFor = null, dedupeId = null } = {}) {
  const rendered = renderTemplate(template, vars);
  return {
    dispatch: {
      ruleId: rule?.id ?? null,
      idempotencyKey: dispatchIdempotencyKey(rule, { dedupeId, type: rule?.triggerType }, recipient),
      templateId: template?.id ?? null,
      channel: template?.channel ?? null,
      channelId: rule?.channelId ?? null,
      partnerId,
      recipient,
      subject: rendered.subject,
      renderedBody: rendered.body,
      status: "queued",
      retryCount: 0,
      scheduledFor,
      createdAt: now,
      updatedAt: now,
    },
    missing: rendered.missing,
  };
}

export const DISPATCH_STATES = ["queued", "sent", "delivered", "failed", "cancelled"];

// queued -> sent -> delivered|failed ; failed -> queued (reintento) ; queued -> cancelled.
const DISPATCH_TRANSITIONS = {
  queued: ["sent", "cancelled"],
  sent: ["delivered", "failed"],
  delivered: [],
  failed: ["queued"],
  cancelled: [],
};

export function canTransitionDispatch(from, to) {
  return (DISPATCH_TRANSITIONS[from] ?? []).includes(to);
}

/** Aplica una transicion de envio y devuelve un dispatch nuevo (no muta). */
export function applyDispatchTransition(dispatch, to, { now = new Date().toISOString(), externalMessageId, failedReason } = {}) {
  const from = dispatch?.status;
  if (!canTransitionDispatch(from, to)) {
    throw new Error(`transicion de envio invalida ${from} -> ${to}`);
  }
  return {
    ...dispatch,
    status: to,
    externalMessageId: externalMessageId ?? dispatch?.externalMessageId ?? null,
    sentAt: to === "sent" ? now : (dispatch?.sentAt ?? null),
    deliveredAt: to === "delivered" ? now : (dispatch?.deliveredAt ?? null),
    failedReason: to === "failed" ? (failedReason ?? "unknown") : (to === "queued" ? null : dispatch?.failedReason ?? null),
    retryCount: from === "failed" && to === "queued" ? Number(dispatch?.retryCount ?? 0) + 1 : Number(dispatch?.retryCount ?? 0),
    updatedAt: now,
  };
}

export function isDispatchTerminal(dispatch) {
  return dispatch?.status === "delivered" || dispatch?.status === "cancelled";
}

const MAX_RETRIES = 3;

/** True si un envio fallido todavia puede reintentarse (tope de reintentos). */
export function canRetry(dispatch, maxRetries = MAX_RETRIES) {
  return dispatch?.status === "failed" && Number(dispatch?.retryCount ?? 0) < maxRetries;
}

/** Backoff exponencial en minutos para el proximo reintento (1, 2, 4, 8...). */
export function nextRetryDelayMinutes(retryCount) {
  return 2 ** Math.max(0, Number(retryCount ?? 0));
}
