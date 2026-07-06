/*
 * Tests del puente commerce -> accounting. Run:
 *   node --test onia-core/modules/bridge.logic.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isBalanced } from "./accounting.logic.mjs";
import { orderToJournalEntry, saleToJournalEntry } from "./bridge.logic.mjs";

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
