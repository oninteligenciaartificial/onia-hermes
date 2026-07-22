/*
 * Tests de la logica pura del modulo payroll (Bolivia). Se enlazan al
 * laborConfig real del modulo para que los calculos usen la misma fuente de
 * verdad. Run: node --test onia-core/modules/payroll.logic.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getModule, loadModules } from "./index.mjs";
import {
  TERMINATION_REASONS,
  buildTerminationSettlement,
  buildTotalGanado,
  computeSeniorityBonus,
  seniorityBonusPct,
  computeAfpLaboral,
  computeAfpPatronal,
  computeAguinaldoProportional,
  computeAporteNacionalSolidario,
  computeCnsPatronal,
  computeDesahucio,
  computeIndemnizacion,
  computeNetPay,
  computeRcIvaBase,
  computeRcIvaCompensacionAutomatica,
  computeRcIvaRetencionBruta,
  computeRcIvaRetencionNeta,
  computeVacationCompensation,
  dailySalaryFromMonthly,
  finiquitoLatePenalty,
  monthsBetween,
  qualifiesForAguinaldo,
  qualifiesForIndemnizacion,
  terminationDeadline,
  vacationDaysForYears,
  yearsWorked,
} from "./payroll.logic.mjs";

const config = getModule(loadModules(), "payroll").laborConfig;

describe("bono de antiguedad (DS 21060 Art. 60)", () => {
  const { scale } = config.seniorityBonus;

  it("escala oficial por tramos de anios (0 debajo de 2)", () => {
    assert.equal(seniorityBonusPct(1.5, scale), 0);
    assert.equal(seniorityBonusPct(3, scale), 0.05);
    assert.equal(seniorityBonusPct(6, scale), 0.11);
    assert.equal(seniorityBonusPct(9, scale), 0.18);
    assert.equal(seniorityBonusPct(12, scale), 0.26);
    assert.equal(seniorityBonusPct(17, scale), 0.34);
    assert.equal(seniorityBonusPct(22, scale), 0.42);
    assert.equal(seniorityBonusPct(30, scale), 0.5);
  });

  it("limite superior EXCLUSIVO: 5 anios cae en 5-7 (11%), no en 2-4", () => {
    assert.equal(seniorityBonusPct(5, scale), 0.11);
  });

  it("bono mensual = SMN x 3 x pct (6 anios, SMN 3300 -> Bs 1089)", () => {
    assert.equal(config.seniorityBonus.baseSmnMultiplier, 3);
    assert.equal(computeSeniorityBonus(6, config.smnBob, config.seniorityBonus), 1089);
  });

  it("sin derecho debajo de 2 anios -> bono 0", () => {
    assert.equal(computeSeniorityBonus(1, config.smnBob, config.seniorityBonus), 0);
  });

  it("integra el total ganado -> sube la base de aportes AFP y RC-IVA", () => {
    const bono = computeSeniorityBonus(6, config.smnBob, config.seniorityBonus);
    const totalGanado = buildTotalGanado({ baseSalary: 5000, seniorityBonus: bono });
    assert.equal(totalGanado, 6089);
    const afpConBono = computeAfpLaboral(totalGanado, config.afpLaboralBreakdown).total;
    const afpSinBono = computeAfpLaboral(5000, config.afpLaboralBreakdown).total;
    assert.ok(afpConBono > afpSinBono, "el aporte se calcula sobre el total CON bono");
    assert.equal(afpConBono, 773.92);
  });
});

describe("aportes AFP / Gestora Publica", () => {
  it("desglose del aporte laboral suma exactamente 12.71%", () => {
    const result = computeAfpLaboral(5000, config.afpLaboralBreakdown);
    assert.equal(result.cuentaIndividual, 500);
    assert.equal(result.primaRiesgoComun, 85.5);
    assert.equal(result.comisionGestora, 25);
    assert.equal(result.aporteSolidario, 25);
    assert.equal(result.total, 635.5);
  });

  it("desglose del aporte patronal suma exactamente 7.21%", () => {
    const result = computeAfpPatronal(5000, config.afpPatronalBreakdown);
    assert.equal(result.primaRiesgoProfesional, 85.5);
    assert.equal(result.proVivienda, 100);
    assert.equal(result.aporteSolidarioPatronal, 175);
    assert.equal(result.total, 360.5);
  });

  it("aporte nacional solidario: aditivo, solo sueldos altos", () => {
    const brackets = config.aporteNacionalSolidarioBrackets;
    assert.equal(computeAporteNacionalSolidario(10000, brackets), 0); // bajo el primer umbral
    assert.equal(computeAporteNacionalSolidario(20000, brackets), 80.5); // solo 1er tramo
    assert.equal(computeAporteNacionalSolidario(30000, brackets), 482.5); // 2 tramos
    assert.equal(computeAporteNacionalSolidario(40000, brackets), 1745.5); // 3 tramos
  });

  it("CNS patronal: 10% sobre el total ganado", () => {
    assert.equal(computeCnsPatronal(5000, config.cnsPatronalRate), 500);
  });
});

describe("RC-IVA dependientes", () => {
  it("cadena completa: base -> retencion bruta -> compensacion -> neta -> sueldo neto", () => {
    const totalGanado = 20000;
    const smnBob = 3000; // numero redondo de prueba, no el SMN real
    const afp = computeAfpLaboral(totalGanado, config.afpLaboralBreakdown);
    assert.equal(afp.total, 2542);

    const base = computeRcIvaBase(totalGanado, afp.total, smnBob, config.rcIva.minimoNoImponibleSmnMultiplier);
    assert.equal(base, 11458);

    const bruta = computeRcIvaRetencionBruta(base, config.rcIva.rate);
    assert.equal(bruta, 1489.54);

    const compensacion = computeRcIvaCompensacionAutomatica(smnBob, config.rcIva.compensacionAutomaticaSmnMultiplier, config.rcIva.rate);
    assert.equal(compensacion, 390);

    const neta = computeRcIvaRetencionNeta(bruta, compensacion);
    assert.equal(neta, 1099.54);

    const netPay = computeNetPay(totalGanado, afp.total, neta);
    assert.equal(netPay, 16358.46);
  });

  it("la base nunca es negativa (sueldos bajos quedan exentos)", () => {
    const base = computeRcIvaBase(3000, 381.3, 3300, 2);
    assert.equal(base, 0);
  });

  it("la retencion neta nunca es negativa aunque la compensacion supere la bruta", () => {
    assert.equal(computeRcIvaRetencionNeta(100, 500), 0);
  });
});

describe("antiguedad", () => {
  it("monthsBetween cuenta meses COMPLETOS (dia de fin < dia de inicio resta un mes)", () => {
    assert.equal(monthsBetween("2024-01-15", "2026-07-15"), 30); // mismo dia -> exacto
    assert.equal(monthsBetween("2024-01-15", "2026-07-06"), 29); // dia 6 < dia 15 -> aun no cumplio el mes 30
    assert.equal(monthsBetween("2024-01-15", "2026-07-20"), 30); // dia 20 >= dia 15 -> ya cumplio
  });

  it("yearsWorked es monthsBetween/12", () => {
    assert.equal(yearsWorked("2024-01-15", "2026-01-15"), 2);
  });
});

describe("aguinaldo (reutiliza accruedProvision de accounting)", () => {
  it("califica desde el minimo de meses trabajados en la gestion", () => {
    assert.equal(qualifiesForAguinaldo(3, config.aguinaldo.minMonthsWorkedToQualify), true);
    assert.equal(qualifiesForAguinaldo(2, config.aguinaldo.minMonthsWorkedToQualify), false);
  });

  it("proporcional: sueldo x meses trabajados / 12", () => {
    assert.equal(computeAguinaldoProportional(6000, 6), 3000);
    assert.equal(computeAguinaldoProportional(6000, 12), 6000);
  });
});

describe("indemnizacion y desahucio", () => {
  it("califica solo desde el minimo de dias trabajados (90, no desde el primer dia)", () => {
    assert.equal(qualifiesForIndemnizacion(90, config.indemnizacion.minDaysWorkedToQualify), true);
    assert.equal(qualifiesForIndemnizacion(89, config.indemnizacion.minDaysWorkedToQualify), false);
  });

  it("indemnizacion: sueldo promedio ultimos 3 meses x anios trabajados (proporcional)", () => {
    assert.equal(computeIndemnizacion(6000, 30), 15000); // 2.5 anios
  });

  it("desahucio: 3x el sueldo promedio de los ultimos 3 meses", () => {
    assert.equal(computeDesahucio(6000, config.desahucio.multiplierOfAverageSalary), 18000);
  });
});

describe("vacaciones", () => {
  it("escala de dias habiles por antiguedad", () => {
    const scale = config.vacationScaleDays;
    assert.equal(vacationDaysForYears(0.5, scale), 0); // sin derecho aun
    assert.equal(vacationDaysForYears(1, scale), 15);
    assert.equal(vacationDaysForYears(4.9, scale), 15);
    assert.equal(vacationDaysForYears(5, scale), 20);
    assert.equal(vacationDaysForYears(9.9, scale), 20);
    assert.equal(vacationDaysForYears(10, scale), 30);
    assert.equal(vacationDaysForYears(20, scale), 30);
  });

  it("salario diario (mensual/30) y compensacion por dias no gozados", () => {
    assert.equal(dailySalaryFromMonthly(6000), 200);
    assert.equal(computeVacationCompensation(200, 10), 2000);
  });
});

describe("finiquito", () => {
  it("vencimiento: 15 dias HABILES desde el cese (excluye sabado/domingo)", () => {
    assert.equal(terminationDeadline("2026-07-06", 15), "2026-07-27"); // lunes -> lunes
    assert.equal(terminationDeadline("2026-07-01", 15), "2026-07-22"); // miercoles
    assert.equal(terminationDeadline("2026-12-24", 15), "2027-01-14"); // rollover de anio
  });

  it("multa del 30% solo si esta fuera de plazo", () => {
    assert.equal(finiquitoLatePenalty(1000, true, config.finiquito.latePenaltyRate), 300);
    assert.equal(finiquitoLatePenalty(1000, false, config.finiquito.latePenaltyRate), 0);
  });

  it("buildTerminationSettlement: renuncia voluntaria con >90 dias SI genera indemnizacion, no desahucio", () => {
    const settlement = buildTerminationSettlement({
      reason: "renuncia_voluntaria",
      pendingSalary: 2000,
      aguinaldoProportional: 1000,
      vacationCompensation: 500,
      avgLast3MonthsSalary: 6000,
      monthsWorkedTotal: 24,
      daysWorkedTotal: 730,
      config,
    });
    assert.equal(settlement.indemnizacion, 12000); // 6000*24/12
    assert.equal(settlement.desahucio, 0);
    assert.equal(settlement.total, 2000 + 1000 + 12000 + 0 + 500);
  });

  it("despido intempestivo SI genera desahucio ademas de indemnizacion", () => {
    const settlement = buildTerminationSettlement({
      reason: "despido_intempestivo",
      avgLast3MonthsSalary: 6000,
      monthsWorkedTotal: 12,
      daysWorkedTotal: 365,
      config,
    });
    assert.equal(settlement.indemnizacion, 6000);
    assert.equal(settlement.desahucio, 18000);
  });

  it("sin calificar (menos de 90 dias), no genera indemnizacion aunque el motivo sea despido intempestivo", () => {
    const settlement = buildTerminationSettlement({
      reason: "despido_intempestivo",
      avgLast3MonthsSalary: 6000,
      monthsWorkedTotal: 2,
      daysWorkedTotal: 60,
      config,
    });
    assert.equal(settlement.indemnizacion, 0);
    assert.equal(settlement.desahucio, 18000); // el desahucio no depende de la antiguedad
  });

  it("rechaza un motivo de cese invalido", () => {
    assert.throws(() => buildTerminationSettlement({ reason: "porque_si", config }), /reason invalido/);
  });

  it("TERMINATION_REASONS cubre los 3 motivos investigados", () => {
    assert.deepEqual(TERMINATION_REASONS, ["renuncia_voluntaria", "despido_causa_justificada", "despido_intempestivo"]);
  });
});
