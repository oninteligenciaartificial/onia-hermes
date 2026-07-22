/*
 * Scheduler de codigos SIAT: logica PURA de tiempo para renovar CUFD y CUIS.
 *
 * Fuente: onia-core/ONIA_SIAT_CERTIFICACION_PLAN_2026.md seccion 2.3 ("Tecnica
 * de emision"):
 *  - CUFD: codigo DIARIO (24h) por sucursal/punto de venta; incluye "codigo de
 *    control" (se concatena al CUF del dia). Es por dia calendario.
 *  - CUIS: codigo de inicio por NIT/sistema/sucursal/PdV; RENOVABLE desde 5 dias
 *    antes de vencer.
 *
 * Igual patron que emission-state.mjs: sin IO, sin dependencias de red, inmutable
 * y con "now"/fechas SIEMPRE como PARAMETRO (nada de Date.now escondido). El
 * obtener el CUFD/CUIS real es del cliente SOAP (external_gate: viene del SIN);
 * aca vive solo la decision de CUANDO renovar. Esto NO es asesoria fiscal.
 *
 * Modelos:
 *   CUFD  = { codigo, codigoControl, fechaVigencia (ISO), sucursalCodigo,
 *             puntoVentaCodigo, fechaEmision? (ISO, opcional) }
 *   CUIS  = { codigo, fechaVigencia (ISO) }
 *
 * Comparaciones: instantes por Date UTC (getTime, mismo criterio que
 * emission-state/accounting); dia calendario por clave ISO YYYY-MM-DD ordenable.
 */

// Defaults del scheduler (plan seccion 2.3).
export const SCHEDULER_DEFAULTS = {
  cuisRenewDaysBefore: 5, // CUIS: renovable desde 5 dias antes de vencer
  cufdVigenciaHours: 24, // CUFD: vigencia de 24h, codigo por dia
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Parsea un ISO a Date; devuelve null si es ausente o invalido. */
function toDate(iso) {
  if (iso === undefined || iso === null || iso === "") {
    return null;
  }
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Clave de dia calendario (UTC) YYYY-MM-DD de un ISO; null si invalido. */
function utcDayKey(iso) {
  const d = toDate(iso);
  return d ? d.toISOString().slice(0, 10) : null;
}

/*
 * Dia calendario "de emision" del CUFD. Preferimos fechaEmision si el SIN la
 * entrega; si no, caemos al dia de la fechaVigencia.
 * [VERIFICAR] semantica exacta de fechaVigencia del CUFD contra el Anexo
 * Tecnico: si el SIN la sella como fin del dia de emision (23:59:59) el fallback
 * es exacto; si la sella como emision+24h (dia siguiente) hay que enviar
 * fechaEmision para el corte diario correcto.
 */
function cufdReferenceDay(cufd) {
  return utcDayKey(cufd?.fechaEmision ?? cufd?.fechaVigencia);
}

/**
 * CUFD vencido a la fecha `nowIso`: paso su fechaVigencia (24h) O es un dia
 * calendario distinto al de su emision (el CUFD es POR DIA). Un CUFD ausente o
 * sin fechaVigencia se considera vencido (no usable).
 */
export function isCufdExpired(cufd, nowIso) {
  const vig = toDate(cufd?.fechaVigencia);
  const now = toDate(nowIso);
  if (!vig || !now) {
    return true; // incompleto/invalido: no se puede emitir con el
  }
  if (now.getTime() > vig.getTime()) {
    return true; // paso la vigencia de 24h
  }
  const refDay = cufdReferenceDay(cufd);
  const nowDay = utcDayKey(nowIso);
  if (refDay && nowDay && refDay !== nowDay) {
    return true; // distinto dia calendario al de emision -> vencido (por dia)
  }
  return false;
}

/**
 * Hay que pedir un CUFD nuevo a la fecha `nowIso`: no hay CUFD usable, o el que
 * hay ya vencio / es de otro dia. Senal operativa para abrir el dia por
 * sucursal/PdV antes de emitir.
 */
export function needsCufdRenewal(cufd, nowIso) {
  if (!cufd?.codigo || !cufd?.codigoControl) {
    return true; // sin CUFD o sin codigo de control -> renovar
  }
  return isCufdExpired(cufd, nowIso);
}

/**
 * Un CUFD sirve para una factura emitida en `fechaEmisionIso` si: no esta
 * vencido evaluado a ESE instante (mismo dia calendario y dentro de la vigencia)
 * y la factura no es anterior a la emision del CUFD. Util para validar que el
 * codigo de control que se va a estampar en el CUF corresponde al dia.
 */
export function cufdAppliesTo(cufd, fechaEmisionIso) {
  const emision = toDate(fechaEmisionIso);
  if (!emision) {
    return false;
  }
  if (isCufdExpired(cufd, fechaEmisionIso)) {
    return false; // otro dia o fuera de vigencia respecto de la factura
  }
  const emitidoEl = toDate(cufd?.fechaEmision);
  if (emitidoEl && emision.getTime() < emitidoEl.getTime()) {
    return false; // la factura es anterior a la emision del CUFD
  }
  return true;
}

/**
 * El CUIS esta por vencer (o ya vencido) a la fecha `nowIso`: `now` cayo dentro
 * de la ventana de renovacion, que abre `daysBefore` dias antes de la
 * fechaVigencia (plan: 5 dias). Un CUIS ausente o sin fechaVigencia devuelve
 * false (la ausencia se maneja aparte, no es "por vencer").
 */
export function isCuisExpiringSoon(cuis, nowIso, { daysBefore = SCHEDULER_DEFAULTS.cuisRenewDaysBefore } = {}) {
  const now = toDate(nowIso);
  const renewalIso = nextRenewalDate(cuis, { daysBefore });
  const renewal = toDate(renewalIso);
  if (!now || !renewal) {
    return false;
  }
  return now.getTime() >= renewal.getTime();
}

/**
 * Fecha (ISO) desde la cual el CUIS es renovable: fechaVigencia menos
 * `daysBefore` dias (plan: 5). Conserva la hora de la fechaVigencia. Devuelve
 * null si no hay fechaVigencia valida.
 */
export function nextRenewalDate(cuis, { daysBefore = SCHEDULER_DEFAULTS.cuisRenewDaysBefore } = {}) {
  const vig = toDate(cuis?.fechaVigencia);
  if (!vig) {
    return null;
  }
  return new Date(vig.getTime() - daysBefore * MS_PER_DAY).toISOString();
}
