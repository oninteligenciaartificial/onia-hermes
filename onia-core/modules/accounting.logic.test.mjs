/*
 * Tests de la logica contable pura (Bolivia). Se enlazan al bolivianConfig real
 * del modulo accounting para que los calculos usen la misma fuente de verdad.
 * Run: node --test onia-core/modules/accounting.logic.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getModule, loadModules } from "./index.mjs";
import {
  accountBalance,
  addDays,
  assertBalanced,
  assertCanPost,
  assertPeriodOpen,
  assetDepreciationAsOf,
  balanceSheet,
  buildClosingEntry,
  canPostToPeriod,
  cashFlowIndirect,
  cashFlowStatement,
  accruedProvision,
  computeIt,
  computeIue,
  computeIva,
  computeWithholdingAlquiler,
  computeWithholdingBeneficiarioExterior,
  computeWithholdingCompraSinFactura,
  computeWithholdingHonorarios,
  depreciationForAssetType,
  depreciationSchedule,
  equityStatement,
  fiscalYearEnd,
  incomeStatement,
  isBalanced,
  isFullyDepreciated,
  isPeriodClosed,
  iueDueDate,
  ivaOfRecord,
  ledgerByAccount,
  monthlyProvision,
  monthsBetween,
  requiresBankization,
  straightLineDepreciation,
  subsidiaryLedger,
  sumDebitCredit,
  taxDueDate,
  trialBalance,
} from "./accounting.logic.mjs";

const config = getModule(loadModules(), "accounting").bolivianConfig;

// Asiento de ejemplo: venta de Bs 1130 (100% cobrada), IVA 13% por dentro.
const ventaLines = [
  { accountCode: "1.1.1", debit: 1130, credit: 0 }, // Caja
  { accountCode: "4.1.1", debit: 0, credit: 1000.1 }, // Ingresos por ventas
  { accountCode: "2.1.3", debit: 0, credit: 129.9 }, // IVA debito fiscal
];

describe("doble partida", () => {
  it("suma debe y haber", () => {
    assert.deepEqual(sumDebitCredit(ventaLines), { debit: 1130, credit: 1130 });
  });

  it("reconoce un asiento cuadrado y uno descuadrado", () => {
    assert.equal(isBalanced(ventaLines), true);
    assert.equal(isBalanced([{ debit: 100, credit: 0 }, { debit: 0, credit: 90 }]), false);
  });

  it("assertBalanced lanza si no cuadra", () => {
    assert.throws(() => assertBalanced([{ debit: 100, credit: 0 }]), /descuadrado/);
    assert.equal(assertBalanced(ventaLines), ventaLines);
  });
});

describe("libro mayor y balance de comprobacion", () => {
  const lines = [
    { accountCode: "1.1.1", debit: 1130, credit: 0 },
    { accountCode: "1.1.1", debit: 0, credit: 200 },
    { accountCode: "4.1.1", debit: 0, credit: 930 },
  ];

  it("agrega por cuenta con saldo debe - haber", () => {
    const ledger = ledgerByAccount(lines);
    assert.deepEqual(ledger["1.1.1"], { debit: 1130, credit: 200, balance: 930 });
    assert.equal(accountBalance(lines, "4.1.1"), -930);
    assert.equal(accountBalance(lines, "9.9.9"), 0);
  });

  it("balance de comprobacion cuadra por construccion", () => {
    const tb = trialBalance(ventaLines);
    assert.equal(tb.totalDebit, 1130);
    assert.equal(tb.totalCredit, 1130);
    assert.equal(tb.balanced, true);
    assert.equal(tb.rows.length, 3);
  });
});

describe("libro auxiliar (libro menor) por partner", () => {
  const cxc = [
    { accountCode: "1.1.3", debit: 500, credit: 0, partnerId: "cli-1" },
    { accountCode: "1.1.3", debit: 300, credit: 0, partnerId: "cli-2" },
    { accountCode: "1.1.3", debit: 0, credit: 200, partnerId: "cli-1" },
    { accountCode: "1.1.3", debit: 100, credit: 0 },
  ];

  it("agrupa por cliente y deja lo no asignado aparte", () => {
    const aux = subsidiaryLedger(cxc, { accountCode: "1.1.3", by: "partnerId" });
    assert.deepEqual(aux["cli-1"], { debit: 500, credit: 200, balance: 300 });
    assert.deepEqual(aux["cli-2"], { debit: 300, credit: 0, balance: 300 });
    assert.equal(aux["sin_asignar"].balance, 100);
  });
});

describe("estados financieros", () => {
  // Mes completo y cuadrado: apertura + una venta + un gasto.
  const accounts = {
    "1.1.1": { accountType: "activo" }, // Caja
    "2.1.3": { accountType: "pasivo" }, // IVA debito fiscal
    "3.1.1": { accountType: "patrimonio" }, // Capital
    "4.1.1": { accountType: "ingreso" }, // Ventas
    "5.1.1": { accountType: "gasto" }, // Alquiler
  };
  const lines = [
    { accountCode: "1.1.1", debit: 2000, credit: 0 },
    { accountCode: "3.1.1", debit: 0, credit: 2000 },
    { accountCode: "1.1.1", debit: 1130, credit: 0 },
    { accountCode: "4.1.1", debit: 0, credit: 1000 },
    { accountCode: "2.1.3", debit: 0, credit: 130 },
    { accountCode: "5.1.1", debit: 500, credit: 0 },
    { accountCode: "1.1.1", debit: 0, credit: 500 },
  ];

  it("estado de resultados: ingresos - gastos = resultado", () => {
    assert.deepEqual(incomeStatement(lines, accounts), {
      ingresos: 1000,
      gastos: 500,
      costos: 0,
      resultado: 500,
    });
  });

  it("balance general cuadra: activo = pasivo + patrimonio + resultado", () => {
    const bs = balanceSheet(lines, accounts);
    assert.equal(bs.activo, 2630);
    assert.equal(bs.pasivo, 130);
    assert.equal(bs.patrimonio, 2000);
    assert.equal(bs.resultado, 500);
    assert.equal(bs.patrimonioTotal, 2500);
    assert.equal(bs.balanced, true);
  });
});

describe("estados financieros basicos: EEP y flujo de efectivo (Bolivia)", () => {
  const accounts = {
    "1.1.1": { accountType: "activo" }, // Caja
    "1.1.2": { accountType: "activo" }, // Bancos
    "3.1.1": { accountType: "patrimonio" }, // Capital
    "4.1.1": { accountType: "ingreso" }, // Ventas
    "5.1.1": { accountType: "gasto" }, // Alquiler
  };
  const lines = [
    { accountCode: "1.1.1", debit: 500, credit: 0 }, // aporte adicional de capital
    { accountCode: "3.1.1", debit: 0, credit: 500 },
    { accountCode: "1.1.2", debit: 1000, credit: 0 }, // cobro de venta (bancos)
    { accountCode: "4.1.1", debit: 0, credit: 1000 },
    { accountCode: "5.1.1", debit: 300, credit: 0 }, // pago de alquiler (caja)
    { accountCode: "1.1.1", debit: 0, credit: 300 },
  ];

  it("EEP: saldo inicial + aumentos + resultado = patrimonio neto final", () => {
    const eep = equityStatement(lines, accounts, { openingBalances: { "3.1.1": 2000 } });
    const capital = eep.rows.find((row) => row.accountCode === "3.1.1");
    assert.equal(capital.opening, 2000);
    assert.equal(capital.increases, 500);
    assert.equal(capital.decreases, 0);
    assert.equal(capital.closing, 2500);
    assert.equal(eep.resultado, 700); // 1000 - 300
    assert.equal(eep.closingTotal, 3200); // 2000 + 500 + 700
  });

  it("flujo de efectivo (metodo directo): entradas - salidas = variacion del efectivo", () => {
    const cf = cashFlowStatement(lines, { cashAccountCodes: ["1.1"], openingCash: 100 });
    assert.equal(cf.inflows, 1500); // 500 caja + 1000 bancos
    assert.equal(cf.outflows, 300); // 300 caja
    assert.equal(cf.netCashFlow, 1200);
    assert.equal(cf.endingCash, 1300);
  });

  it("flujo operativo (metodo indirecto): resultado + ajustes - Δcapital de trabajo", () => {
    // 700 resultado + 100 depreciacion (no efectivo) - 250 aumento de CxC = 550
    assert.equal(cashFlowIndirect({ resultado: 700, nonCashAdjustments: [100], workingCapitalChange: 250 }), 550);
    assert.equal(cashFlowIndirect({ resultado: 700, nonCashAdjustments: 100 }), 800);
  });
});

describe("cierre de gestion y bloqueo de periodo", () => {
  const accounts = {
    "3.2.1": { accountType: "patrimonio" }, // Resultado del ejercicio
    "4.1.1": { accountType: "ingreso" }, // Ventas
    "5.1.1": { accountType: "gasto" }, // Gastos
    "5.2.1": { accountType: "costo" }, // Costo de ventas
  };

  it("cancela ingresos/gastos/costos contra resultado y cuadra (utilidad)", () => {
    const lines = [
      { accountCode: "4.1.1", debit: 0, credit: 1000 },
      { accountCode: "5.1.1", debit: 300, credit: 0 },
      { accountCode: "5.2.1", debit: 200, credit: 0 },
    ];
    const closing = buildClosingEntry(lines, accounts, { resultAccountCode: "3.2.1" });
    assert.equal(closing.ingresos, 1000);
    assert.equal(closing.gastosCostos, 500);
    assert.equal(closing.resultado, 500);
    assert.equal(isBalanced(closing.lines), true);
    const resultLine = closing.lines.find((line) => line.accountCode === "3.2.1");
    assert.equal(resultLine.credit, 500); // utilidad -> se acredita
  });

  it("perdida: la cuenta de resultado se debita y el asiento cuadra", () => {
    const lines = [
      { accountCode: "4.1.1", debit: 0, credit: 100 },
      { accountCode: "5.1.1", debit: 400, credit: 0 },
    ];
    const closing = buildClosingEntry(lines, accounts, { resultAccountCode: "3.2.1" });
    assert.equal(closing.resultado, -300);
    assert.equal(isBalanced(closing.lines), true);
    const resultLine = closing.lines.find((line) => line.accountCode === "3.2.1");
    assert.equal(resultLine.debit, 300);
  });

  it("periodo cerrado no admite asientos; abierto y en rango si", () => {
    const abierto = { name: "2026", status: "open", startDate: "2026-01-01", endDate: "2026-12-31" };
    const cerrado = { name: "2025", status: "closed" };
    assert.equal(isPeriodClosed(cerrado), true);
    assert.equal(isPeriodClosed(abierto), false);
    assert.throws(() => assertPeriodOpen(cerrado), /cerrado/);
    assert.equal(canPostToPeriod(abierto, "2026-06-15"), true);
    assert.equal(canPostToPeriod(abierto, "2027-01-05"), false); // fuera de rango
    assert.equal(canPostToPeriod(cerrado, "2025-06-15"), false);
    assert.equal(canPostToPeriod(null, "2026-06-15"), true); // sin periodo no bloquea
    assert.throws(() => assertCanPost(cerrado, "2025-06-15"), /no se puede contabilizar/);
  });
});

describe("IVA (Bolivia, 13% por dentro)", () => {
  it("toma el IVA del registro o lo calcula por la alicuota", () => {
    assert.equal(ivaOfRecord({ amount: 1000, ivaAmount: 130 }), 130);
    assert.equal(ivaOfRecord({ amount: 1000 }, 0.13), 130);
  });

  it("IVA a pagar = debito (ventas) - credito (compras)", () => {
    const rcv = [
      { kind: "venta", amount: 1000, ivaAmount: 130 },
      { kind: "compra", amount: 500, ivaAmount: 65 },
    ];
    const iva = computeIva(rcv, { rate: 0.13 });
    assert.equal(iva.debito, 130);
    assert.equal(iva.credito, 65);
    assert.equal(iva.payable, 65);
    assert.equal(iva.balanceForward, 0);
  });

  it("credito mayor que debito deja saldo a favor", () => {
    const rcv = [
      { kind: "venta", amount: 100, ivaAmount: 13 },
      { kind: "compra", amount: 500, ivaAmount: 65 },
    ];
    const iva = computeIva(rcv);
    assert.equal(iva.payable, 0);
    assert.equal(iva.balanceForward, 52);
  });
});

describe("IT e IUE", () => {
  it("IT = 3% de ingresos brutos", () => {
    assert.equal(computeIt(10000), 300);
    assert.equal(computeIt(-5), 0);
  });

  it("IUE = 25% de la utilidad, 0 si hay perdida", () => {
    assert.equal(computeIue(100000), 25000);
    assert.equal(computeIue(-8000), 0);
  });
});

describe("bancarizacion", () => {
  it("aplica desde el umbral (Bs 50.000)", () => {
    assert.equal(requiresBankization(50000, config.bancarizacionThresholdBob), true);
    assert.equal(requiresBankization(49999.99, config.bancarizacionThresholdBob), false);
    assert.equal(requiresBankization(60000, config.bancarizacionThresholdBob), true);
  });
});

describe("depreciacion y provisiones (ajustes de cierre)", () => {
  it("linea recta: (costo - residual) / vida util", () => {
    assert.deepEqual(straightLineDepreciation(48000, 4), {
      depreciableBase: 48000,
      annual: 12000,
      monthly: 1000,
    });
    assert.equal(straightLineDepreciation(48000, 4, { salvageValue: 8000 }).annual, 10000);
  });

  it("acumulada y valor en libros, sin superar la base depreciable", () => {
    const partial = depreciationSchedule(48000, 4, 6);
    assert.equal(partial.perPeriod, 1000);
    assert.equal(partial.accumulated, 6000);
    assert.equal(partial.netBookValue, 42000);

    const overrun = depreciationSchedule(48000, 4, 60);
    assert.equal(overrun.accumulated, 48000);
    assert.equal(overrun.netBookValue, 0);
  });

  it("depreciacion por tipo de activo desde el config (DS 24051)", () => {
    assert.equal(depreciationForAssetType(20000, "vehiculos", config).annual, 4000);
    assert.equal(depreciationForAssetType(4800, "equipos_computacion", config).annual, 1200);
    assert.throws(() => depreciationForAssetType(1000, "nave_espacial", config), /tipo de activo/);
  });

  it("provisiones laborales aguinaldo/indemnizacion (sueldo/12)", () => {
    assert.equal(monthlyProvision(5220, 1), 435);
    assert.equal(accruedProvision(5220, 6, 1), 2610);
  });
});

describe("vencimientos por NIT y cierre de gestion", () => {
  it("vence en el mes siguiente segun el ultimo digito del NIT", () => {
    assert.equal(taxDueDate("1234567", "2026-01", config), "2026-02-20");
    assert.equal(taxDueDate("9876540", "2026-12", config), "2027-01-13");
  });

  it("lanza si el ultimo caracter del NIT no tiene dia definido", () => {
    assert.throws(() => taxDueDate("123A", "2026-01", config), /digito NIT/);
  });

  it("cierre de gestion por sector", () => {
    assert.equal(fiscalYearEnd("comerciales_servicios_bancos_seguros_otras", 2026, config), "2026-12-31");
    assert.equal(fiscalYearEnd("mineras", 2026, config), "2026-09-30");
    assert.throws(() => fiscalYearEnd("desconocido", 2026, config), /sector/);
  });

  it("IUE vence 120 dias despues del cierre", () => {
    assert.equal(addDays("2026-12-31", 120), "2027-04-30");
    assert.equal(iueDueDate("2026-12-31"), "2027-04-30");
  });
});

describe("activo fijo (registro individual)", () => {
  it("monthsBetween cuenta meses COMPLETOS (mismo criterio day-aware que payroll)", () => {
    assert.equal(monthsBetween("2024-01-15", "2026-01-15"), 24);
    assert.equal(monthsBetween("2024-01-15", "2026-01-06"), 23); // dia 6 < dia 15
  });

  it("assetDepreciationAsOf se deriva de acquisitionDate/cost/assetType (no se guarda duplicado)", () => {
    const asset = { assetType: "equipos_computacion", acquisitionDate: "2024-01-15", acquisitionCost: 48000 };
    const result = assetDepreciationAsOf(asset, "2026-01-15", config);
    assert.equal(result.perPeriod, 1000);
    assert.equal(result.accumulated, 24000);
    assert.equal(result.netBookValue, 24000);
  });

  it("isFullyDepreciated es true cuando el valor en libros llega a 0", () => {
    const asset = { assetType: "equipos_computacion", acquisitionDate: "2024-01-15", acquisitionCost: 48000 };
    assert.equal(isFullyDepreciated(asset, "2026-01-15", config), false);
    assert.equal(isFullyDepreciated(asset, "2034-01-15", config), true); // 10 anios > 4 de vida util
  });

  it("lanza si el tipo de activo no tiene vida util definida", () => {
    const asset = { assetType: "nave_espacial", acquisitionDate: "2024-01-15", acquisitionCost: 1000 };
    assert.throws(() => assetDepreciationAsOf(asset, "2026-01-15", config), /tipo de activo/);
  });
});

describe("retenciones a terceros (agente de retencion)", () => {
  it("compra sin factura: IUE 5% + IT 3% = 8%", () => {
    const result = computeWithholdingCompraSinFactura(1000, config.withholdings.compraSinFactura);
    assert.equal(result.iue, 50);
    assert.equal(result.it, 30);
    assert.equal(result.total, 80);
  });

  it("alquiler a persona natural: RC-IVA 13% + IT 3% = 16%", () => {
    const result = computeWithholdingAlquiler(1000, config.withholdings.alquilerPersonaNatural);
    assert.equal(result.rcIva, 130);
    assert.equal(result.it, 30);
    assert.equal(result.total, 160);
  });

  it("honorarios a persona natural: RC-IVA 13%", () => {
    assert.equal(computeWithholdingHonorarios(1000, config.withholdings.honorariosPersonaNatural.rcIvaRate), 130);
  });

  it("beneficiario del exterior: 25% sobre base presunta 50% = 12.5% efectivo", () => {
    const result = computeWithholdingBeneficiarioExterior(10000, config.withholdings.beneficiarioExterior);
    assert.equal(result.base, 5000);
    assert.equal(result.withheld, 1250);
    assert.equal(result.effectiveRate, 0.125);
  });
});

describe("advertencia de reforma del IVA (Ley 1.733)", () => {
  it("el modulo documenta el cambio pendiente sin haber tocado el codigo de IVA", () => {
    const warning = getModule(loadModules(), "accounting").bolivianConfig.ivaReformWarning;
    assert.ok(warning, "ivaReformWarning present");
    assert.match(warning.law, /1\.733/);
    assert.match(warning.impact, /NO se modifico ninguna formula de IVA/);
    assert.match(warning.effectiveDate, /TODAVIA NO RIGE/);
  });
});
