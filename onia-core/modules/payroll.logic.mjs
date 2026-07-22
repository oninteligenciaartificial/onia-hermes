/*
 * Logica pura del modulo payroll (Bolivia - planilla de sueldos). Calcula
 * aportes AFP/Gestora Publica, RC-IVA de dependientes, aguinaldo,
 * indemnizacion, desahucio, vacaciones y finiquito. SIN declarar ante el SIN
 * ni la Gestora: eso es external_gate del core. Referencia canonica para
 * portar, no duplicar.
 *
 * ADVERTENCIA (verificado 2026-07-06, investigacion cruzada): el porcentaje
 * exacto del "aporte solidario patronal" (3% vs 3.5% segun la fuente) y la
 * exencion de RC-IVA sobre indemnizacion/desahucio en el finiquito (DS 21531)
 * NO estan 100% confirmados contra el texto oficial. Los porcentajes/SMN
 * llegan como parametros (laborConfig del modulo), nunca hardcodeados aca, para
 * que una correccion sea un cambio de dato, no de codigo. Esto no es asesoria
 * legal ni laboral.
 */
import { accruedProvision } from "./accounting.logic.mjs";

export function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

// --- Aportes AFP / Gestora Publica -------------------------------------------

/** Desglose del aporte LABORAL (retenido al trabajador), segun afpLaboralBreakdown. */
export function computeAfpLaboral(totalGanado, breakdown) {
  const gross = Number(totalGanado ?? 0);
  const cuentaIndividual = round2(gross * breakdown.cuentaIndividual);
  const primaRiesgoComun = round2(gross * breakdown.primaRiesgoComun);
  const comisionGestora = round2(gross * breakdown.comisionGestora);
  const aporteSolidario = round2(gross * breakdown.aporteSolidarioTrabajador);
  return {
    cuentaIndividual,
    primaRiesgoComun,
    comisionGestora,
    aporteSolidario,
    total: round2(cuentaIndividual + primaRiesgoComun + comisionGestora + aporteSolidario),
  };
}

/** Desglose del aporte PATRONAL (a cargo del empleador), segun afpPatronalBreakdown. */
export function computeAfpPatronal(totalGanado, breakdown) {
  const gross = Number(totalGanado ?? 0);
  const primaRiesgoProfesional = round2(gross * breakdown.primaRiesgoProfesional);
  const proVivienda = round2(gross * breakdown.proViviendaPatronal);
  const aporteSolidarioPatronal = round2(gross * breakdown.aporteSolidarioPatronal);
  return {
    primaRiesgoProfesional,
    proVivienda,
    aporteSolidarioPatronal,
    total: round2(primaRiesgoProfesional + proVivienda + aporteSolidarioPatronal),
  };
}

/**
 * Aporte Nacional Solidario: tramos progresivos ADITIVOS sobre el excedente de
 * cada umbral (solo afecta sueldos altos). Cada tramo suma, no reemplaza.
 */
export function computeAporteNacionalSolidario(totalGanado, brackets = []) {
  const gross = Number(totalGanado ?? 0);
  let total = 0;
  for (const bracket of brackets) {
    const excess = gross - bracket.thresholdBob;
    if (excess > 0) {
      total += excess * bracket.rate;
    }
  }
  return round2(total);
}

/** Aporte patronal a la Caja Nacional de Salud (100% empleador, no se descuenta al trabajador). */
export function computeCnsPatronal(totalGanado, rate) {
  return round2(Number(totalGanado ?? 0) * rate);
}

/**
 * Base cotizable a la Gestora: el total ganado TOPADO a maxMultiplier x SMN (tope de
 * cotizacion, Ley 065 de Pensiones = 60 SMN). En sueldos altos los aportes AFP se
 * calculan sobre este tope, NO sobre el total. Aplicar ANTES de computeAfpLaboral/Patronal.
 */
export function cotizableBase(totalGanado, { smnBob, maxMultiplier } = {}) {
  const total = Number(totalGanado ?? 0);
  const cap = Number(smnBob ?? 0) * Number(maxMultiplier ?? 0);
  return cap > 0 && total > cap ? round2(cap) : round2(total);
}

// --- Bono de antiguedad y total ganado ---------------------------------------

/**
 * Porcentaje del bono de antiguedad segun anios de servicio (DS 21060 Art. 60).
 * Escala de tramos del laborConfig (limite superior EXCLUSIVO, igual que la
 * escala de vacaciones); 0 debajo de 2 anios (sin derecho aun).
 */
export function seniorityBonusPct(years, scale = []) {
  const value = Number(years ?? 0);
  for (const tier of scale) {
    const withinMax = tier.maxYears === null || tier.maxYears === undefined || value < tier.maxYears;
    if (value >= tier.minYears && withinMax) {
      return Number(tier.pct ?? 0);
    }
  }
  return 0;
}

/**
 * Bono de antiguedad MENSUAL (DS 21060 Art. 60): SMN x baseSmnMultiplier x pct.
 * Haber OBLIGATORIO que integra el total ganado -> por eso es base de los aportes
 * AFP y del RC-IVA. base = 3 SMN en el regimen general/productivo; empresas de
 * servicios usan 1 SMN. La escala y la base son datos del laborConfig, no
 * constantes (una correccion es un cambio de dato, no de codigo).
 */
export function computeSeniorityBonus(years, smnBob, { scale = [], baseSmnMultiplier = 3 } = {}) {
  const pct = seniorityBonusPct(years, scale);
  return round2(Number(smnBob ?? 0) * Number(baseSmnMultiplier ?? 0) * pct);
}

/**
 * Total ganado = sueldo basico + bono de antiguedad + otros haberes (horas extra,
 * comisiones, otros bonos). Es la BASE de los aportes AFP y del RC-IVA; el bono de
 * antiguedad se suma ACA, no despues, para que arrastre a los aportes y la retencion.
 */
export function buildTotalGanado({ baseSalary = 0, seniorityBonus = 0, otherEarnings = 0 } = {}) {
  return round2(Number(baseSalary ?? 0) + Number(seniorityBonus ?? 0) + Number(otherEarnings ?? 0));
}

// --- RC-IVA dependientes -----------------------------------------------------

/** Base imponible: total ganado - aporte AFP laboral - minimo no imponible (N x SMN). */
export function computeRcIvaBase(totalGanado, afpLaboralTotal, smnBob, minimoNoImponibleMultiplier = 2) {
  const base = Number(totalGanado ?? 0) - Number(afpLaboralTotal ?? 0) - Number(smnBob ?? 0) * minimoNoImponibleMultiplier;
  return round2(Math.max(0, base));
}

export function computeRcIvaRetencionBruta(base, rate = 0.13) {
  return round2(Number(base ?? 0) * rate);
}

/** Compensacion automatica sin facturas: N x SMN x alicuota (N reducido de 2 a 1 por el DS 5383, mayo 2025). */
export function computeRcIvaCompensacionAutomatica(smnBob, multiplier = 1, rate = 0.13) {
  return round2(Number(smnBob ?? 0) * multiplier * rate);
}

/**
 * Credito RC-IVA por facturas "Hecho en Bolivia" (DS 5503, dic-2025): el credito normal
 * (rate del monto) se incrementa un bonusRate (20%) -> 15.6% efectivo, solo para facturas
 * de productos/servicios hechos en Bolivia. Vigente hasta 31-dic-2027. rate y bonusRate
 * son datos del config (rcIva.rate, rcIva.hechoEnBoliviaCreditBonusRate). El resultado se
 * suma al creditoFacturas que entra a computeRcIvaRetencionNeta.
 */
export function computeHechoEnBoliviaCredit(facturaAmount, { rate = 0.13, bonusRate = 0.2 } = {}) {
  return round2(Number(facturaAmount ?? 0) * Number(rate ?? 0) * (1 + Number(bonusRate ?? 0)));
}

/** Retencion neta = bruta - compensaciones (automatica + credito de facturas), nunca negativa. */
export function computeRcIvaRetencionNeta(retencionBruta, compensacionAutomatica, creditoFacturas = 0) {
  const neta = Number(retencionBruta ?? 0) - Number(compensacionAutomatica ?? 0) - Number(creditoFacturas ?? 0);
  return round2(Math.max(0, neta));
}

// --- Sueldo neto --------------------------------------------------------------

/** Neto a pagar: total ganado - aporte AFP laboral - retencion RC-IVA neta. */
export function computeNetPay(totalGanado, afpLaboralTotal, rcIvaRetencionNeta) {
  return round2(Number(totalGanado ?? 0) - Number(afpLaboralTotal ?? 0) - Number(rcIvaRetencionNeta ?? 0));
}

// --- Antiguedad ---------------------------------------------------------------

/**
 * Meses COMPLETOS entre dos fechas ISO (UTC): si el dia de fin es anterior al
 * dia de inicio, ese ultimo mes calendario todavia no se completo por dia
 * (importa para umbrales legales como los 90 dias o 3 meses de aguinaldo).
 */
export function monthsBetween(startIso, endIso) {
  const start = new Date(`${String(startIso).slice(0, 10)}T00:00:00Z`);
  const end = new Date(`${String(endIso).slice(0, 10)}T00:00:00Z`);
  let months = (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + (end.getUTCMonth() - start.getUTCMonth());
  if (end.getUTCDate() < start.getUTCDate()) {
    months -= 1;
  }
  return months;
}

export function yearsWorked(hireDateIso, asOfIso) {
  return monthsBetween(hireDateIso, asOfIso) / 12;
}

// --- Aguinaldo (reutiliza accruedProvision de accounting: sueldo*meses/12) --

export function qualifiesForAguinaldo(monthsWorkedInGestion, minMonths = 3) {
  return Number(monthsWorkedInGestion ?? 0) >= minMonths;
}

/** 1 sueldo por gestion, proporcional por meses trabajados en la gestion. */
export const computeAguinaldoProportional = accruedProvision;

// --- Indemnizacion y desahucio ------------------------------------------------

export function qualifiesForIndemnizacion(daysWorkedTotal, minDays = 90) {
  return Number(daysWorkedTotal ?? 0) >= minDays;
}

/** 1 sueldo promedio de los ultimos 3 meses x anios trabajados (proporcional). */
export function computeIndemnizacion(avgLast3MonthsSalary, monthsWorkedTotal) {
  return accruedProvision(avgLast3MonthsSalary, monthsWorkedTotal, 1);
}

/** Desahucio: 3x el sueldo promedio de los ultimos 3 meses. Solo despido injustificado. */
export function computeDesahucio(avgLast3MonthsSalary, multiplier = 3) {
  return round2(Number(avgLast3MonthsSalary ?? 0) * multiplier);
}

// --- Vacaciones ---------------------------------------------------------------

/** Dias HABILES de vacacion segun antiguedad, por la escala de tramos del config. */
export function vacationDaysForYears(years, scale = []) {
  const value = Number(years ?? 0);
  for (const tier of scale) {
    const withinMax = tier.maxYears === null || tier.maxYears === undefined || value < tier.maxYears;
    if (value >= tier.minYears && withinMax) {
      return tier.days;
    }
  }
  return 0;
}

export function dailySalaryFromMonthly(monthlySalary) {
  return round2(Number(monthlySalary ?? 0) / 30);
}

export function computeVacationCompensation(dailySalary, daysNotTaken) {
  return round2(Number(dailySalary ?? 0) * Number(daysNotTaken ?? 0));
}

// --- Finiquito -----------------------------------------------------------------

export const TERMINATION_REASONS = ["renuncia_voluntaria", "despido_causa_justificada", "despido_intempestivo"];

/** Vencimiento del finiquito: N dias HABILES (excluye sabado/domingo) desde el cese. */
export function terminationDeadline(terminationDateIso, businessDays = 15) {
  const date = new Date(`${String(terminationDateIso).slice(0, 10)}T00:00:00Z`);
  let added = 0;
  while (added < businessDays) {
    date.setUTCDate(date.getUTCDate() + 1);
    const day = date.getUTCDay();
    if (day !== 0 && day !== 6) {
      added += 1;
    }
  }
  return date.toISOString().slice(0, 10);
}

export function finiquitoLatePenalty(total, isLate, rate = 0.3) {
  return isLate ? round2(Number(total ?? 0) * rate) : 0;
}

/**
 * Arma el finiquito sumando sus componentes segun el motivo de cese:
 * indemnizacion solo si califica (>= dias minimos); desahucio solo si el
 * motivo es despido injustificado.
 */
export function buildTerminationSettlement({
  reason,
  pendingSalary = 0,
  aguinaldoProportional = 0,
  vacationCompensation = 0,
  avgLast3MonthsSalary,
  monthsWorkedTotal,
  daysWorkedTotal,
  config,
} = {}) {
  if (!TERMINATION_REASONS.includes(reason)) {
    throw new Error(`reason invalido: ${reason}`);
  }

  const minDays = config?.indemnizacion?.minDaysWorkedToQualify ?? 90;
  const indemnizacion = qualifiesForIndemnizacion(daysWorkedTotal, minDays)
    ? computeIndemnizacion(avgLast3MonthsSalary, monthsWorkedTotal)
    : 0;
  const desahucio =
    reason === "despido_intempestivo"
      ? computeDesahucio(avgLast3MonthsSalary, config?.desahucio?.multiplierOfAverageSalary ?? 3)
      : 0;

  const total = round2(
    Number(pendingSalary) + Number(aguinaldoProportional) + indemnizacion + desahucio + Number(vacationCompensation),
  );

  return {
    reason,
    pendingSalary: round2(pendingSalary),
    aguinaldoProportional: round2(aguinaldoProportional),
    indemnizacion,
    desahucio,
    vacationCompensation: round2(vacationCompensation),
    total,
  };
}
