/*
 * Logica pura canonica de WorkItem (core). Hoy cada producto reimplementa
 * transiciones/SLA/dedupe/orden de cola (DentalGest lib/onia-core, etc.); esto es
 * la referencia UNICA que deberian portar, para no duplicar (~15-20K lineas hoy).
 * Sin estado, sin IO, inmutable. El core sigue congelado: esto es aditivo (no
 * toca contract.json / schema / adapters).
 */

export const WORK_ITEM_STATUSES = ["open", "in_progress", "done", "cancelled"];

// Maquina de estados del pendiente. done se puede reabrir; cancelled es terminal.
const TRANSITIONS = {
  open: ["in_progress", "done", "cancelled"],
  in_progress: ["done", "cancelled", "open"],
  done: ["in_progress"],
  cancelled: [],
};

export function canTransition(from, to) {
  return (TRANSITIONS[from] ?? []).includes(to);
}

/** Aplica una transicion y devuelve un WorkItem nuevo (no muta el original). */
export function applyTransition(workItem, to, { now = new Date().toISOString() } = {}) {
  const from = workItem?.status;
  if (!canTransition(from, to)) {
    throw new Error(`transicion invalida ${from} -> ${to}`);
  }
  const isClosing = to === "done" || to === "cancelled";
  return {
    ...workItem,
    status: to,
    closedAt: isClosing ? now : null,
  };
}

/** Un pendiente esta abierto si sigue open o in_progress. */
export function isOpen(workItem) {
  return workItem?.status === "open" || workItem?.status === "in_progress";
}

const PRIORITY_RANK = { urgent: 0, high: 1, normal: 2, low: 3 };

export function priorityRank(priority) {
  return PRIORITY_RANK[priority] ?? PRIORITY_RANK.normal;
}

/** dueAt del SLA: createdAt + horas de la politica. policies = { nombre: horas }. */
export function slaDueAt(createdAtIso, slaPolicy, policies = {}) {
  const hours = policies[slaPolicy];
  if (hours === undefined || !createdAtIso) {
    return null;
  }
  return new Date(new Date(createdAtIso).getTime() + hours * 3600 * 1000).toISOString();
}

/** Vencido: tiene slaDueAt/dueAt en el pasado y sigue abierto. */
export function isOverdue(workItem, nowIso = new Date().toISOString()) {
  if (!isOpen(workItem)) {
    return false;
  }
  const due = workItem?.slaDueAt ?? workItem?.dueAt;
  if (!due) {
    return false;
  }
  return new Date(due).getTime() < new Date(nowIso).getTime();
}

/**
 * Clave de dedupe: mismo tipo + canal + contacto dentro de una organizacion.
 * El intake usa esto para no crear dos pendientes por el mismo mensaje.
 */
export function dedupeKey(workItem) {
  return [
    workItem?.organizationId,
    workItem?.type,
    workItem?.channelId ?? "",
    workItem?.partnerId ?? workItem?.contactId ?? "",
  ].join(":");
}

/**
 * Orden de la cola del panel: primero los vencidos, luego por prioridad, luego
 * por antiguedad. Uso: `items.slice().sort((a, b) => comparePending(a, b, now))`.
 */
export function comparePending(a, b, nowIso = new Date().toISOString()) {
  const overdueA = isOverdue(a, nowIso) ? 0 : 1;
  const overdueB = isOverdue(b, nowIso) ? 0 : 1;
  if (overdueA !== overdueB) {
    return overdueA - overdueB;
  }
  const priorityDiff = priorityRank(a?.priority) - priorityRank(b?.priority);
  if (priorityDiff !== 0) {
    return priorityDiff;
  }
  return String(a?.createdAt ?? "").localeCompare(String(b?.createdAt ?? ""));
}
