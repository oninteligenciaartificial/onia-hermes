/*
 * Logica pura canonica de agenda (core) sobre ScheduleEvent: proximos, vencidos
 * y recordatorios. Separa el tiempo real del evento del dueAt de un WorkItem.
 * Sin estado, sin IO.
 */

export const SCHEDULE_STATUSES = ["scheduled", "done", "cancelled", "no_show"];

const DAY_MS = 24 * 60 * 60 * 1000;

function isActive(event) {
  return event?.status === "scheduled";
}

/** Proximo: agendado y su inicio cae entre ahora y ahora + ventana (24h por defecto). */
export function isUpcoming(event, { now = new Date().toISOString(), withinMs = DAY_MS } = {}) {
  if (!isActive(event) || !event?.startAt) {
    return false;
  }
  const start = new Date(event.startAt).getTime();
  const nowMs = new Date(now).getTime();
  return start >= nowMs && start <= nowMs + withinMs;
}

/** Vencido: agendado y su inicio ya paso (no se atendio ni cerro). */
export function isPastDue(event, { now = new Date().toISOString() } = {}) {
  if (!isActive(event) || !event?.startAt) {
    return false;
  }
  return new Date(event.startAt).getTime() < new Date(now).getTime();
}

/** Recordatorio a disparar: agendado y su remindAt ya llego. */
export function isReminderDue(event, { now = new Date().toISOString() } = {}) {
  if (!isActive(event) || !event?.remindAt) {
    return false;
  }
  return new Date(event.remindAt).getTime() <= new Date(now).getTime();
}
