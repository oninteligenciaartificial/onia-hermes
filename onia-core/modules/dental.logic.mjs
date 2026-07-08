/*
 * Logica pura del modulo dental (referencia canonica; los productos la portan).
 * Sin estado, sin IO, sin dependencias: totales de plan de tratamiento, validez
 * de consentimiento informado, severidad de alertas medicas, transiciones de
 * caso de laboratorio y resumen de periodontograma. Inmutable.
 *
 * Estructura datos y flujo clinico; NO diagnostica ni sustituye juicio clinico
 * (ver clinicalConfig.notClinicalAdvice en dental.json).
 */

export function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

/** Total de un plan de tratamiento: suma de los tratamientos que agrupa. */
export function computeTreatmentPlanTotal(treatmentLines = []) {
  return round2(treatmentLines.reduce((sum, line) => sum + Number(line?.cost ?? 0), 0));
}

/** Un plan esta aprobado por el paciente si tiene fecha de aprobacion. */
export function isTreatmentPlanApproved(plan) {
  return Boolean(plan?.patientApprovedAt);
}

/** El consentimiento tiene las 2 firmas obligatorias (paciente + profesional). Testigo es opcional. */
export function hasRequiredSignatures(consent) {
  return Boolean(consent?.patientSignedAt) && Boolean(consent?.professionalSignedAt);
}

/**
 * Se puede proceder con el procedimiento si el consentimiento tiene ambas
 * firmas y fueron firmadas en o antes de la fecha del procedimiento.
 */
export function canProceedWithProcedure(consent, procedureDate) {
  if (!hasRequiredSignatures(consent)) {
    return false;
  }
  const procedure = new Date(procedureDate).getTime();
  const patientSigned = new Date(consent.patientSignedAt).getTime();
  const professionalSigned = new Date(consent.professionalSignedAt).getTime();
  return patientSigned <= procedure && professionalSigned <= procedure;
}

export const MEDICAL_ALERT_SEVERITIES = ["low", "moderate", "high", "critical"];
const SEVERITY_RANK = { low: 0, moderate: 1, high: 2, critical: 3 };

/** Rango numerico de severidad (mayor = mas urgente); severidad desconocida rankea como low. */
export function severityRank(severity) {
  return SEVERITY_RANK[severity] ?? SEVERITY_RANK.low;
}

/** Alertas ACTIVAS ordenadas de mas a menos severas (no muta el array de entrada). */
export function sortAlertsBySeverity(alerts = []) {
  return [...alerts].filter((alert) => alert?.active !== false).sort((a, b) => severityRank(b?.severity) - severityRank(a?.severity));
}

/** True si hay al menos una alerta activa de severidad critica. */
export function hasCriticalAlerts(alerts = []) {
  return alerts.some((alert) => alert?.active !== false && alert?.severity === "critical");
}

export const LAB_CASE_STATUSES = ["ordered", "in_lab", "shipped", "received", "installed", "cancelled"];

// Maquina de estados del caso de laboratorio. installed y cancelled son terminales.
const LAB_CASE_TRANSITIONS = {
  ordered: ["in_lab", "cancelled"],
  in_lab: ["shipped", "cancelled"],
  shipped: ["received", "cancelled"],
  received: ["installed", "cancelled"],
  installed: [],
  cancelled: [],
};

export function canTransitionLabCase(from, to) {
  return (LAB_CASE_TRANSITIONS[from] ?? []).includes(to);
}

/** Aplica una transicion de estado y devuelve un caso nuevo (no muta el original). */
export function applyLabCaseTransition(labCase, to, { now = new Date().toISOString() } = {}) {
  const from = labCase?.status;
  if (!canTransitionLabCase(from, to)) {
    throw new Error(`transicion de caso de laboratorio invalida ${from} -> ${to}`);
  }
  return {
    ...labCase,
    status: to,
    receivedAt: to === "received" ? now : (labCase?.receivedAt ?? null),
    installedAt: to === "installed" ? now : (labCase?.installedAt ?? null),
  };
}

/** Un caso esta vencido si sigue sin recibirse despues de la fecha esperada de retorno. */
export function isLabCaseOverdue(labCase, asOf = new Date().toISOString()) {
  if (!labCase?.expectedReturnDate) {
    return false;
  }
  if (["received", "installed", "cancelled"].includes(labCase?.status)) {
    return false;
  }
  return new Date(labCase.expectedReturnDate).getTime() < new Date(asOf).getTime();
}

const PERIO_SCREENING_HEALTHY_MAX_MM = 3;

/**
 * Resume una lectura de periodontograma (6 sitios por diente): profundidad
 * promedio/maxima y cuantos sitios superan el rango de referencia de screening
 * (no un diagnostico, ver clinicalConfig.perioScreeningReferenceMm).
 */
export function summarizePerioReading(sitesJson = {}) {
  const depths = Object.values(sitesJson).map((value) => Number(value ?? 0));
  if (depths.length === 0) {
    return { averageDepthMm: 0, maxDepthMm: 0, sitesAboveScreeningReference: 0 };
  }
  const sum = depths.reduce((total, depth) => total + depth, 0);
  return {
    averageDepthMm: round2(sum / depths.length),
    maxDepthMm: Math.max(...depths),
    sitesAboveScreeningReference: depths.filter((depth) => depth > PERIO_SCREENING_HEALTHY_MAX_MM).length,
  };
}
