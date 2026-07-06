/*
 * Tests de los puentes entre modulos (commerce/invoicing -> accounting). Run:
 *   node --test onia-core/modules/bridge.logic.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isBalanced } from "./accounting.logic.mjs";
import {
  invoiceToJournalEntry,
  invoiceToRcvRecord,
  orderToJournalEntry,
  payrollEntryToJournalEntry,
  saleToJournalEntry,
} from "./bridge.logic.mjs";

const accounts = {
  cash: "1.1.1",
  receivable: "1.1.3",
  sales: "4.1",
  ivaDebit: "2.1.2",
};

describe("saleToJournalEntry", () => {
  it("venta al contado: debe caja, haber ventas + IVA debito (por dentro)", () => {
    const entry = saleToJournalEntry({ total: 1000, paymentType: "cash", id: "s1" }, { accounts });
    assert.equal(entry.sourceType, "sale");
    assert.equal(entry.lines.length, 3);
    assert.ok(isBalanced(entry.lines), "el asiento cuadra");

    const byAccount = Object.fromEntries(entry.lines.map((line) => [line.accountCode, line]));
    assert.equal(byAccount["1.1.1"].debit, 1000); // Caja
    assert.equal(byAccount["4.1"].credit, 870); // Ventas (neto)
    assert.equal(byAccount["2.1.2"].credit, 130); // IVA debito fiscal
  });

  it("venta a credito usa cuentas por cobrar en el debe", () => {
    const entry = saleToJournalEntry({ total: 1000, paymentType: "credit", partnerId: "cli-1" }, { accounts });
    const debitLine = entry.lines.find((line) => line.debit > 0);
    assert.equal(debitLine.accountCode, "1.1.3");
    assert.equal(debitLine.partnerId, "cli-1");
  });

  it("exige las cuentas necesarias", () => {
    assert.throws(() => saleToJournalEntry({ total: 100 }, { accounts: { cash: "1.1.1" } }), /faltan cuentas/);
  });
});

describe("orderToJournalEntry (puente commerce -> accounting)", () => {
  it("calcula el total desde las lineas de commerce y arma el asiento cuadrado", () => {
    const order = {
      paymentType: "cash",
      lines: [
        { quantity: 2, unitPrice: 400 },
        { quantity: 1, unitPrice: 200 },
      ],
    };
    const entry = orderToJournalEntry(order, { accounts });
    assert.ok(isBalanced(entry.lines));
    const byAccount = Object.fromEntries(entry.lines.map((line) => [line.accountCode, line]));
    assert.equal(byAccount["1.1.1"].debit, 1000); // total 2*400 + 1*200
    assert.equal(byAccount["4.1"].credit, 870);
    assert.equal(byAccount["2.1.2"].credit, 130);
  });
});

describe("invoiceToJournalEntry (puente invoicing -> accounting)", () => {
  it("arma el asiento cuadrado a partir del total de la factura", () => {
    const invoice = { id: "f1", invoiceNumber: "FAC-000042", total: 1000, paymentType: "cash", issueDate: "2026-07-06" };
    const entry = invoiceToJournalEntry(invoice, { accounts });
    assert.equal(entry.sourceType, "invoice");
    assert.equal(entry.date, "2026-07-06");
    assert.match(entry.glosa, /FAC-000042/);
    assert.ok(isBalanced(entry.lines));
    const byAccount = Object.fromEntries(entry.lines.map((line) => [line.accountCode, line]));
    assert.equal(byAccount["1.1.1"].debit, 1000);
    assert.equal(byAccount["4.1"].credit, 870);
    assert.equal(byAccount["2.1.2"].credit, 130);
  });
});

describe("invoiceToRcvRecord (puente invoicing -> RCV)", () => {
  it("arma un registro de venta con el IVA calculado y los campos SIAT de la factura", () => {
    const invoice = {
      invoiceNumber: "FAC-000042",
      cuis: "CUIS123",
      controlCode: "CTRL-456",
      partnerId: "cli-1",
      partnerName: "Cliente SRL",
      issueDate: "2026-07-06",
      total: 1000,
    };
    const record = invoiceToRcvRecord(invoice);
    assert.equal(record.kind, "venta");
    assert.equal(record.invoiceNumber, "FAC-000042");
    assert.equal(record.authorizationCode, "CUIS123");
    assert.equal(record.controlCode, "CTRL-456");
    assert.equal(record.amount, 1000);
    assert.equal(record.ivaAmount, 130);
  });
});

describe("payrollEntryToJournalEntry (puente payroll -> accounting)", () => {
  const accounts = {
    salaryExpense: "5.1.1",
    payrollTax: "5.1.3",
    salariesPayable: "2.1.4",
    afpPayable: "2.1.5",
    cnsPayable: "2.1.5",
    rcIvaPayable: "2.1.3",
  };

  it("arma el asiento cuadrado: gasto sueldos + cargas patronales = neto por pagar + aportes + RC-IVA", () => {
    const entry = {
      id: "p1",
      periodMonth: 7,
      periodYear: 2026,
      date: "2026-07-31",
      totalGanado: 5000,
      afpLaboralTotal: 635.5,
      afpPatronalTotal: 360.5,
      cnsPatronal: 500,
      rcIvaRetencionNeta: 0,
    };
    const journalEntry = payrollEntryToJournalEntry(entry, { accounts });
    assert.equal(journalEntry.sourceType, "payroll");
    assert.match(journalEntry.glosa, /7\/2026/);
    assert.ok(isBalanced(journalEntry.lines), "el asiento cuadra");

    const debitTotal = journalEntry.lines.reduce((sum, line) => sum + line.debit, 0);
    const creditTotal = journalEntry.lines.reduce((sum, line) => sum + line.credit, 0);
    assert.equal(debitTotal, 5000 + 360.5 + 500); // sueldos + cargas patronales
    assert.equal(creditTotal, debitTotal);
  });

  it("recalcula el neto internamente (no confia en un campo externo) para garantizar el cuadre", () => {
    const entry = {
      totalGanado: 5000,
      afpLaboralTotal: 635.5,
      afpPatronalTotal: 360.5,
      cnsPatronal: 500,
      rcIvaRetencionNeta: 200,
      netPay: 999999, // deliberadamente incorrecto: la funcion no debe usarlo
    };
    const journalEntry = payrollEntryToJournalEntry(entry, { accounts });
    const salariesPayableLine = journalEntry.lines.find((line) => line.accountCode === accounts.salariesPayable);
    assert.equal(salariesPayableLine.credit, 5000 - 635.5 - 200); // netPay recalculado, no el campo erroneo
    assert.ok(isBalanced(journalEntry.lines));
  });

  it("exige las cuentas necesarias", () => {
    assert.throws(
      () => payrollEntryToJournalEntry({ totalGanado: 100 }, { accounts: { salaryExpense: "5.1.1" } }),
      /faltan cuentas/,
    );
  });
});
