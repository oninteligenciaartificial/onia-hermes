/*
 * Tests de la logica pura del modulo imports (landed cost Bolivia). Run:
 *   node --test onia-core/modules/imports.logic.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  IMPORT_VAT_RATES,
  buildImportJournalEntry,
  computeCustomsValue,
  computeIce,
  computeImportVat,
  computeLandedCostUsd,
  computeTariff,
  exchangeDifference,
  fifoCogs,
  mapImportToRcvRecord,
  resolveEffectiveGaPct,
  resolveTariffRate,
  round2,
  sumLandedResults,
  weightedAverageCost,
} from "./imports.logic.mjs";

describe("computeCustomsValue (DS 5646)", () => {
  it("aplica FOB + carga/descarga + 10% de (flete + seguro)", () => {
    // 10000 + 0 + 0.10 * (1000 + 500) = 10150 (el caso del 10% del DS 5646)
    assert.equal(computeCustomsValue(10000, 1000, 500, 0), 10150);
  });

  it("suma la carga/descarga completa", () => {
    // 1000 + 30 + 0.10 * (200 + 50) = 1055
    assert.equal(computeCustomsValue(1000, 200, 50, 30), 1055);
  });

  it("el factor flete/seguro es configurable (validar contra DUI real de BE)", () => {
    // con factor 1: 1000 + 30 + 1 * (200 + 50) = 1280
    assert.equal(computeCustomsValue(1000, 200, 50, 30, { freightInsuranceFactor: 1 }), 1280);
  });
});

describe("resolveEffectiveGaPct / resolveTariffRate", () => {
  it("aplica la reduccion de 5 puntos del DS 5646 con piso 0", () => {
    assert.equal(resolveEffectiveGaPct({ gaBasePct: 0.1, reductionPts: 0.05 }), 0.05);
    assert.equal(resolveEffectiveGaPct({ gaBasePct: 0.04, reductionPts: 0.05 }), 0); // piso 0, no negativo
  });

  it("zeroRated (DS 5516/5518) fuerza GA 0", () => {
    assert.equal(resolveEffectiveGaPct({ gaBasePct: 0.2, zeroRated: true }), 0);
  });

  it("null / sin reduccion", () => {
    assert.equal(resolveEffectiveGaPct(null), 0);
    assert.equal(resolveEffectiveGaPct({ gaBasePct: 0.1 }), 0.1);
  });

  const rates = [
    { nandinaCode: "8544.49.90.00", gaBasePct: 0.1, reductionPts: 0, validFrom: "2026-01-01", validTo: "2026-07-05", source: "AAI-2026" },
    { nandinaCode: "8544.49.90.00", gaBasePct: 0.1, reductionPts: 0.05, validFrom: "2026-07-06", source: "DS 5646" },
    { nandinaCode: "9999.99.99.99", gaBasePct: 0.2, zeroRated: true, validFrom: "2026-01-01", source: "DS 5516" },
  ];

  it("elige la tasa vigente ANTES del 06-jul (sin reduccion)", () => {
    const rate = resolveTariffRate("8544.49.90.00", "2026-07-01", rates);
    assert.equal(rate.effectiveGaPct, 0.1);
    assert.equal(rate.source, "AAI-2026");
  });

  it("elige la tasa vigente DESPUES del 06-jul (con -5 pts del DS 5646)", () => {
    const rate = resolveTariffRate("8544.49.90.00", "2026-07-10", rates);
    assert.equal(rate.effectiveGaPct, 0.05);
    assert.equal(rate.source, "DS 5646");
  });

  it("resuelve arancel cero y devuelve null si la subpartida no existe", () => {
    assert.equal(resolveTariffRate("9999.99.99.99", "2026-07-10", rates).effectiveGaPct, 0);
    assert.equal(resolveTariffRate("0000.00.00.00", "2026-07-10", rates), null);
  });
});

describe("computeTariff", () => {
  it("GA = valor en aduana x alicuota efectiva", () => {
    assert.equal(computeTariff(10150, 0.1), 1015);
    assert.equal(computeTariff(1055, 0.05), 52.75);
  });
});

describe("computeImportVat (vatMode conmutable)", () => {
  it("inside_1494 (VIGENTE HOY) sobre valor aduana + GA + ICE", () => {
    const vat = computeImportVat(1000, 100, 0, { vatMode: "inside_1494" });
    assert.equal(vat.base, 1100);
    assert.equal(vat.rate, 0.1494);
    assert.equal(vat.amount, 164.34); // 1100 * 0.1494
    assert.equal(vat.recoverable, true);
  });

  it("outside_13 (Ley 1733, aun NO rige) da menos que inside_1494 para la misma base", () => {
    const inside = computeImportVat(1000, 100, 0, { vatMode: "inside_1494" });
    const outside = computeImportVat(1000, 100, 0, { vatMode: "outside_13" });
    assert.equal(outside.amount, 143); // 1100 * 0.13
    assert.ok(inside.amount > outside.amount);
    assert.deepEqual(IMPORT_VAT_RATES, { inside_1494: 0.1494, outside_13: 0.13 });
  });

  it("default inside_1494 y rechaza un modo invalido", () => {
    assert.equal(computeImportVat(1000, 100).amount, 164.34);
    assert.throws(() => computeImportVat(1000, 100, 0, { vatMode: "nope" }), /vatMode invalido/);
  });
});

describe("computeIce (apagado por default, N/A electrico)", () => {
  it("0 salvo que aplique explicitamente", () => {
    assert.equal(computeIce(1000), 0);
    assert.equal(computeIce(1000, { rate: 0.18, applies: false }), 0);
    assert.equal(computeIce(1000, { rate: 0.18, applies: true }), 180);
  });
});

describe("computeLandedCostUsd", () => {
  const lineA = { id: "la", fobUsd: 6000, quantity: 100, weightKg: 300, nandinaCode: "X" };
  const lineB = { id: "lb", fobUsd: 4000, quantity: 50, weightKg: 100, nandinaCode: "Y" };
  const shipment = {
    id: "shp1",
    duiNumber: "DUI-001",
    validationDate: "2026-07-10",
    mode: "maritimo",
    fobUsd: 10000,
    freightUsd: 1000,
    insuranceUsd: 500,
    loadingUnloadingUsd: 200,
    despachoUsd: 300,
    almacenajeUsd: 100,
    transporteInternoUsd: 400,
    verificacionPct: 0.01,
    lines: [lineA, lineB],
  };

  it("reparte la logistica por valor (fob) y EXCLUYE el IVA del costo", () => {
    const result = computeLandedCostUsd({ shipment, line: lineA, gaPct: 0.1, vatMode: "inside_1494" });
    assert.equal(result.share, 0.6); // 6000 / 10000
    assert.equal(result.customsValueUsd, 6210); // 6000 + 120 + 0.10*(600+300)
    assert.equal(result.breakdown.gaUsd, 621); // 6210 * 0.10
    assert.equal(result.importVatUsd, 1020.55); // recuperable, calculado
    assert.equal(result.recoverableVatUsd, 1020.55); // separado del costo
    assert.equal(result.vatIncludedInCost, false);
    assert.equal(result.inventoryUsd, 8181); // sin IVA
    assert.equal(result.unitLandedCostUsd, 81.81); // 8181 / 100
  });

  it("includeVatInCost=true capitaliza el IVA y deja de separarlo como credito", () => {
    const result = computeLandedCostUsd({ shipment, line: lineA, gaPct: 0.1, includeVatInCost: true });
    assert.equal(result.inventoryUsd, 9201.55); // 8181 + 1020.55
    assert.equal(result.recoverableVatUsd, 0);
    assert.equal(result.unitLandedCostUsd, 92.02); // 9201.55 / 100
  });

  it("distributeBy 'weight' cambia el reparto (peso, no valor)", () => {
    const result = computeLandedCostUsd({ shipment, line: lineA, gaPct: 0.1, distributeBy: "weight" });
    assert.equal(result.share, 0.75); // 300 / 400
  });

  it("las lineas reparten el total del embarque sin perder ni inventar costo", () => {
    const a = computeLandedCostUsd({ shipment, line: lineA, gaPct: 0.1 });
    const b = computeLandedCostUsd({ shipment, line: lineB, gaPct: 0.1 });
    // FOB 10000 + flete 1000 + seguro 500 + carga 200 + despacho 300 + almacen 100
    // + transporte 400 + verificacion 100 + GA (621 + 414) = 13635
    assert.equal(round2(a.inventoryUsd + b.inventoryUsd), 13635);
  });
});

describe("sumLandedResults", () => {
  it("suma inventario e IVA recuperable de las lineas", () => {
    const totals = sumLandedResults([
      { inventoryUsd: 8181, recoverableVatUsd: 1020.55 },
      { inventoryUsd: 5454, recoverableVatUsd: 680.37 },
    ]);
    assert.deepEqual(totals, { inventoryUsd: 13635, recoverableVatUsd: 1700.92 });
  });
});

describe("weightedAverageCost (CPP)", () => {
  it("mezcla existencia previa con la entrada", () => {
    // 100 @ 81.81 + 50 @ 109.08 = 13635 / 150 = 90.9
    assert.deepEqual(weightedAverageCost(100, 81.81, 50, 109.08), { quantity: 150, unitCost: 90.9 });
  });

  it("cantidad total 0 -> costo 0", () => {
    assert.deepEqual(weightedAverageCost(0, 0, 0, 0), { quantity: 0, unitCost: 0 });
  });
});

describe("fifoCogs (PEPS; UEPS prohibido NC 2)", () => {
  const layers = [
    { quantity: 100, unitCost: 81.81 },
    { quantity: 50, unitCost: 109.08 },
  ];

  it("consume las capas mas antiguas primero y devuelve las restantes", () => {
    const { cogs, remainingLayers } = fifoCogs(layers, 120);
    // 100 * 81.81 + 20 * 109.08 = 8181 + 2181.6 = 10362.6
    assert.equal(cogs, 10362.6);
    assert.equal(remainingLayers.length, 1);
    assert.equal(remainingLayers[0].quantity, 30);
    assert.equal(remainingLayers[0].unitCost, 109.08);
  });

  it("no muta las capas de entrada", () => {
    fifoCogs(layers, 120);
    assert.equal(layers[0].quantity, 100);
  });

  it("lanza si el stock es insuficiente o la cantidad es negativa", () => {
    assert.throws(() => fifoCogs([{ quantity: 10, unitCost: 5 }], 20), /insuficiente/);
    assert.throws(() => fifoCogs(layers, -5), /negativa/);
  });
});

describe("buildImportJournalEntry (asiento cuadrado, reusa accounting)", () => {
  const shipment = { id: "shp1", duiNumber: "DUI-001", validationDate: "2026-07-10" };
  const landed = { inventoryUsd: 13635, recoverableVatUsd: 1700.92 };

  it("Debe Inventarios + Debe Credito Fiscal IVA = Haber CxP (todo a CxP por default)", () => {
    const entry = buildImportJournalEntry(shipment, landed);
    const debit = entry.lines.reduce((sum, l) => sum + l.debit, 0);
    const credit = entry.lines.reduce((sum, l) => sum + l.credit, 0);
    assert.equal(round2(debit), round2(credit)); // cuadra (assertBalanced no lanzo)
    assert.equal(round2(debit), 15335.92);
    assert.match(entry.glosa, /DUI-001/);
    assert.equal(entry.date, "2026-07-10");
    const inventory = entry.lines.find((l) => l.accountCode === "1.1.4");
    const ivaCredit = entry.lines.find((l) => l.accountCode === "1.1.5");
    const payable = entry.lines.find((l) => l.accountCode === "2.1.1");
    assert.equal(inventory.debit, 13635);
    assert.equal(ivaCredit.debit, 1700.92);
    assert.equal(payable.credit, 15335.92);
  });

  it("settlement reparte el haber entre bancos, anticipo y CxP y sigue cuadrando", () => {
    const entry = buildImportJournalEntry(shipment, landed, {}, { settlement: { bankUsd: 5000, advanceUsd: 335.92 } });
    const byCode = Object.fromEntries(entry.lines.map((l) => [l.accountCode, l]));
    assert.equal(byCode["1.1.2"].credit, 5000); // bancos
    assert.equal(byCode["1.1.6"].credit, 335.92); // anticipo
    assert.equal(byCode["2.1.1"].credit, 10000); // CxP por diferencia
    const debit = entry.lines.reduce((sum, l) => sum + l.debit, 0);
    const credit = entry.lines.reduce((sum, l) => sum + l.credit, 0);
    assert.equal(round2(debit), round2(credit));
  });

  it("sin IVA recuperable (capitalizado) no genera la linea de credito fiscal y cuadra", () => {
    const entry = buildImportJournalEntry(shipment, { inventoryUsd: 9201.55, recoverableVatUsd: 0 });
    assert.equal(entry.lines.find((l) => l.accountCode === "1.1.5"), undefined);
    const debit = entry.lines.reduce((sum, l) => sum + l.debit, 0);
    const credit = entry.lines.reduce((sum, l) => sum + l.credit, 0);
    assert.equal(round2(debit), round2(credit));
  });
});

describe("mapImportToRcvRecord", () => {
  it("mapea la DUI a un RCV de COMPRA con authorizationCode = nro DUI y date = validationDate", () => {
    const rcv = mapImportToRcvRecord({
      duiNumber: "DUI-001",
      validationDate: "2026-07-10",
      supplierNit: "123456",
      supplierName: "ACME Corp",
      vatBaseUsd: 6831,
      importVatUsd: 1020.55,
    });
    assert.equal(rcv.kind, "compra");
    assert.equal(rcv.authorizationCode, "DUI-001");
    assert.equal(rcv.invoiceNumber, "DUI-001");
    assert.equal(rcv.date, "2026-07-10");
    assert.equal(rcv.period, "2026-07"); // el credito cae en el periodo correcto
    assert.equal(rcv.amount, 6831);
    assert.equal(rcv.ivaAmount, 1020.55);
    assert.equal(rcv.nit, "123456");
  });
});

describe("exchangeDifference (NC 6)", () => {
  it("CxP en USD con dolar que sube = perdida por diferencia de cambio", () => {
    const result = exchangeDifference(1000, 6.96, 10.9, { nature: "liability" });
    assert.equal(result.originBob, 6960);
    assert.equal(result.closeBob, 10900);
    assert.equal(result.resultBob, -3940);
    assert.equal(result.kind, "perdida");
    assert.equal(result.realized, false); // no realizada por default (al cierre)
  });

  it("caja/CxC en USD con dolar que sube = ganancia", () => {
    const result = exchangeDifference(1000, 6.96, 10.9, { nature: "asset" });
    assert.equal(result.resultBob, 3940);
    assert.equal(result.kind, "ganancia");
  });

  it("distingue realizada (al pagar) de no realizada, y el signo por naturaleza", () => {
    assert.equal(exchangeDifference(1000, 6.96, 10.9, { nature: "liability", realized: true }).realized, true);
    // pasivo con dolar que BAJA = ganancia
    assert.equal(exchangeDifference(1000, 10.9, 6.96, { nature: "liability" }).kind, "ganancia");
  });
});
