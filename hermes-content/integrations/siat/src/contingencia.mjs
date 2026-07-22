/*
 * Logica pura de CONTINGENCIA / OFFLINE del emisor SIAT (Bolivia).
 *
 * Fuente: onia-core/ONIA_SIAT_CERTIFICACION_PLAN_2026.md seccion 2.3 + diagrama
 * del emisor (seccion 3): "detector de caida SIN -> evento significativo ->
 * acumulacion en paquetes <=500 -> reenvio <=48h". Reglas oficiales:
 * siatinfo.impuestos.gob.bo/.../contingencia-y-eventos-significativos.
 *
 * Regla del plan 2.3: evento significativo se registra hasta 48h despues de
 * finalizado; facturas offline se acumulan en paquetes <=500 y se reenvian
 * dentro de 48h; estados SIN 901 pendiente / 904 observada / 908 validado.
 *
 * Puro, sin IO, inmutable, sin dependencias externas. "now"/fechas SIEMPRE como
 * parametro (mismo patron testable que emission-state.mjs). Reusa las constantes
 * de constants.mjs; no redefine plazos ni limites. Esto NO es asesoria fiscal.
 */
import { SIN_STATUS, DEADLINES, PACKAGE_LIMITS } from "./constants.mjs";

const MS_PER_HOUR = 60 * 60 * 1000;

/** Parsea un ISO a epoch ms; falla rapido y claro si no es fecha valida. */
function toEpochMs(iso, field) {
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) {
    throw new Error(`${field} no es fecha ISO valida: "${iso}"`);
  }
  return ms;
}

/**
 * Decide si hay que ENTRAR en contingencia/offline segun el health check del SIN.
 * healthCheck = { ok: boolean, ... } (o similar). Sano SOLO si el SIN respondio
 * explicitamente ok === true. Ante cualquier otra cosa (sin respuesta, timeout,
 * error, ok === false, o estado desconocido) se entra en contingencia para NO
 * frenar la emision: ese es el objetivo del modo offline. Conservador a proposito.
 */
export function shouldEnterContingency(healthCheck) {
  return !(healthCheck && healthCheck.ok === true);
}

/**
 * Parte las facturas offline en PAQUETES de a lo sumo `maxPerPackage` (plan 2.3:
 * <=500, PACKAGE_LIMITS.offlineMax). Devuelve un array de arrays (cada paquete es
 * un slice NUEVO, no muta la entrada). Array vacio o no-array -> []. 501 -> dos
 * paquetes [500, 1]; exactamente 500 -> un solo paquete.
 */
export function packageOfflineInvoices(invoices, { maxPerPackage = PACKAGE_LIMITS.offlineMax } = {}) {
  if (!Array.isArray(invoices)) {
    return [];
  }
  const max = Number(maxPerPackage);
  if (!Number.isInteger(max) || max < 1) {
    throw new Error(`maxPerPackage debe ser un entero >= 1: "${maxPerPackage}"`);
  }
  const packages = [];
  for (let i = 0; i < invoices.length; i += max) {
    packages.push(invoices.slice(i, i + max));
  }
  return packages;
}

/**
 * Ventana para registrar un EVENTO SIGNIFICATIVO: sigue abierta hasta `hours`
 * despues de finalizado el evento (plan 2.3: 48h, DEADLINES.significantEventHours).
 * Inclusivo en el limite: justo a las 48h todavia esta abierta.
 */
export function isSignificantEventWindowOpen(eventEndIso, nowIso, { hours = DEADLINES.significantEventHours } = {}) {
  const end = toEpochMs(eventEndIso, "eventEndIso");
  const now = toEpochMs(nowIso, "nowIso");
  const deadline = end + hours * MS_PER_HOUR;
  return now <= deadline;
}

/**
 * Una tanda offline esta VENCIDA de envio si pasaron MAS de `hours` desde que se
 * genero offline (plan 2.3: reenviar dentro de 48h, DEADLINES.offlineSendHours).
 * Estricto: justo a las 48h todavia esta a tiempo (no vencida); >48h vencida.
 */
export function isOfflineSendOverdue(offlineSince, nowIso, { hours = DEADLINES.offlineSendHours } = {}) {
  const since = toEpochMs(offlineSince, "offlineSince");
  const now = toEpochMs(nowIso, "nowIso");
  const elapsedHours = (now - since) / MS_PER_HOUR;
  return elapsedHours > hours;
}

/**
 * Clasifica un codigo de estado del SIN a etiqueta legible (plan 2.3, SIN_STATUS):
 * 901 -> pendiente, 904 -> observada, 908 -> validado; cualquier otro -> desconocido.
 * Acepta numero o string numerica ("901").
 */
export function classifyBySinStatus(codigo) {
  const code = Number(codigo);
  switch (code) {
    case SIN_STATUS.PENDING:
      return "pendiente";
    case SIN_STATUS.OBSERVED:
      return "observada";
    case SIN_STATUS.VALIDATED:
      return "validado";
    default:
      return "desconocido";
  }
}
