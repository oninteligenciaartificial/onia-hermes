/*
 * Maquina de estados de una emision SIAT (corazon operativo del emisor).
 *
 * Pura, sin IO, inmutable — igual patron que las state machines del core
 * (work-items.logic.mjs, dental lab case). NO depende del NIT ni del Anexo
 * Tecnico: modela el ciclo de vida de una factura en la cola de emision, que es
 * construible y testeable hoy. El envio real al SIN (SOAP) se enchufa despues.
 *
 * Flujo (plan seccion 3, diagrama del emisor):
 *   draft -> queued -> sent -> validated | observed | rejected
 *   observed -> queued (reintento tras corregir) | rejected
 *   rejected -> queued (reintento)
 *   validated -> annulled (anulacion, con reglas de fecha)
 *   annulled -> reverted (reversion de anulacion, UNA sola vez por factura)
 */

export const EMISSION_STATES = [
  "draft",
  "queued",
  "sent",
  "validated",
  "observed",
  "rejected",
  "annulled",
  "reverted",
];

// Transiciones permitidas. validated/reverted son "factura vale"; annulled es
// "factura no vale"; rejected/observed admiten reintento.
const TRANSITIONS = {
  draft: ["queued"],
  queued: ["sent"],
  sent: ["validated", "observed", "rejected"],
  observed: ["queued", "rejected"],
  rejected: ["queued"],
  validated: ["annulled"],
  annulled: ["reverted"],
  reverted: [], // terminal: la reversion es por unica vez (no se re-anula desde aca)
};

export function canTransition(from, to) {
  return (TRANSITIONS[from] ?? []).includes(to);
}

/** Aplica una transicion y devuelve una emision NUEVA (no muta la original). */
export function applyTransition(emission, to, { now = new Date().toISOString(), sinStatus, reason } = {}) {
  const from = emission?.state;
  if (!canTransition(from, to)) {
    throw new Error(`transicion de emision invalida ${from} -> ${to}`);
  }
  return {
    ...emission,
    state: to,
    sinStatus: sinStatus ?? emission?.sinStatus ?? null,
    lastReason: reason ?? emission?.lastReason ?? null,
    sentAt: to === "sent" ? now : (emission?.sentAt ?? null),
    validatedAt: to === "validated" ? now : (emission?.validatedAt ?? null),
    annulledAt: to === "annulled" ? now : (emission?.annulledAt ?? null),
    revertedAt: to === "reverted" ? now : (emission?.revertedAt ?? null),
    updatedAt: now,
  };
}

/** La factura es fiscalmente valida (vale como respaldo). */
export function isValidInvoice(emission) {
  return emission?.state === "validated" || emission?.state === "reverted";
}

/** Necesita atencion humana: observada o rechazada por el SIN. */
export function needsAttention(emission) {
  return emission?.state === "observed" || emission?.state === "rejected";
}

/**
 * Se puede anular: la factura debe estar validada, dentro del plazo (hasta el
 * dia N del mes siguiente a la emision) y no estar ya declarada en RCV/F110.
 * `cancellationDayOfNextMonth` viene de constants.DEADLINES.
 */
export function canCancel(emission, { asOf = new Date(), cancellationDayOfNextMonth = 9 } = {}) {
  if (emission?.state !== "validated") {
    return false;
  }
  if (emission?.declaredInRcv === true) {
    return false; // no anulable si ya se confirmo en RCV o se declaro
  }
  const issued = emission?.issueDate ? new Date(emission.issueDate) : null;
  if (!issued) {
    return false;
  }
  const now = new Date(asOf);
  // Limite: dia N del mes SIGUIENTE al de emision (fin de ese dia).
  const deadline = new Date(Date.UTC(issued.getUTCFullYear(), issued.getUTCMonth() + 1, cancellationDayOfNextMonth, 23, 59, 59));
  return now.getTime() <= deadline.getTime();
}

/** La reversion de anulacion es por UNICA vez: solo desde annulled. */
export function canRevertCancellation(emission) {
  return emission?.state === "annulled";
}

/**
 * Una emision offline esta VENCIDA de envio si sigue en cola/enviada mas de
 * `offlineSendHours` desde que se genero (plan: 48h). Senal para priorizar.
 */
export function isOfflineSendOverdue(emission, { asOf = new Date(), offlineSendHours = 48 } = {}) {
  if (!["queued", "sent"].includes(emission?.state)) {
    return false;
  }
  if (emission?.emissionType !== "offline") {
    return false;
  }
  const created = emission?.createdAt ? new Date(emission.createdAt) : null;
  if (!created) {
    return false;
  }
  const hours = (new Date(asOf).getTime() - created.getTime()) / (1000 * 60 * 60);
  return hours > offlineSendHours;
}
