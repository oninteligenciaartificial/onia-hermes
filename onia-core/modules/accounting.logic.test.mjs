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
  computeIt,
  computeIue,
  computeIva,
  fiscalYearEnd,
  isBalanced,
  iueDueDate,
  ivaOfRecord,
  ledgerByAccount,
  requiresBankization,
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
