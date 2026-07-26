/*
 * Tests de la logica pura del modulo commerce. Run:
 *   node --test onia-core/modules/commerce.logic.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  acceptQuoteToOrder,
  applyOrderTransition,
  applyQuoteTransition,
  applyStockMovement,
  canTransitionOrder,
  canTransitionQuote,
  computeLineTotal,
  computeQuoteTotal,
  isBelowReorder,
  isQuoteExpired,
  ORDER_STATES,
  paymentBalance,
  QUOTE_STATES,
  round2,
} from "./commerce.logic.mjs";

describe("round2", () => {
  it("rounds to 2 decimals avoiding float drift", () => {
    assert.equal(round2(0.1 + 0.2), 0.3);
    assert.equal(round2(2.345), 2.35);
    assert.equal(round2(1.005), 1.01);
  });
});

describe("computeLineTotal", () => {
  it("multiplies quantity by unit price", () => {
    assert.equal(computeLineTotal({ quantity: 3, unitPrice: 10 }), 30);
  });

  it("subtracts an absolute discount", () => {
    assert.equal(computeLineTotal({ quantity: 2, unitPrice: 10, discount: 5 }), 15);
  });

  it("never goes negative", () => {
    assert.equal(computeLineTotal({ quantity: 1, unitPrice: 10, discount: 50 }), 0);
  });
});

describe("computeQuoteTotal", () => {
  it("sums the lines", () => {
    const total = computeQuoteTotal([
      { quantity: 2, unitPrice: 10 },
      { quantity: 1, unitPrice: 5, discount: 2 },
    ]);
    assert.equal(total, 23);
  });

  it("is zero for no lines", () => {
    assert.equal(computeQuoteTotal(), 0);
  });
});

describe("applyStockMovement", () => {
  it("adds on an inbound movement", () => {
    assert.equal(applyStockMovement(10, { movementType: "in", quantity: 5 }), 15);
  });

  it("subtracts on an outbound movement", () => {
    assert.equal(applyStockMovement(10, { movementType: "out", quantity: 3 }), 7);
  });

  it("sets the quantity on an adjust", () => {
    assert.equal(applyStockMovement(10, { movementType: "adjust", quantity: 4 }), 4);
  });

  it("refuses to drive stock negative", () => {
    assert.throws(() => applyStockMovement(10, { movementType: "out", quantity: 20 }), /negative/);
  });

  it("rejects invalid movement types and negative quantities", () => {
    assert.throws(() => applyStockMovement(10, { movementType: "teleport", quantity: 1 }), /invalid movementType/);
    assert.throws(() => applyStockMovement(10, { movementType: "in", quantity: -1 }), />= 0/);
  });
});

describe("isBelowReorder", () => {
  it("flags stock at or below the reorder point", () => {
    assert.equal(isBelowReorder({ quantity: 2, reorderPoint: 5 }), true);
    assert.equal(isBelowReorder({ quantity: 5, reorderPoint: 5 }), true);
    assert.equal(isBelowReorder({ quantity: 10, reorderPoint: 5 }), false);
  });

  it("is false when no reorder point is set", () => {
    assert.equal(isBelowReorder({ quantity: 0 }), false);
  });
});

describe("quote state machine", () => {
  it("declara los estados de la cotizacion", () => {
    assert.deepEqual(QUOTE_STATES, ["draft", "sent", "accepted", "rejected", "expired"]);
  });

  it("draft -> sent -> accepted|rejected|expired (transiciones validas)", () => {
    assert.ok(canTransitionQuote("draft", "sent"));
    assert.ok(canTransitionQuote("sent", "accepted"));
    assert.ok(canTransitionQuote("sent", "rejected"));
    assert.ok(canTransitionQuote("sent", "expired"));
  });

  it("expired y rejected son terminales; no se salta ni se retrocede", () => {
    assert.equal(canTransitionQuote("expired", "sent"), false);
    assert.equal(canTransitionQuote("rejected", "sent"), false);
    assert.equal(canTransitionQuote("accepted", "sent"), false);
    assert.equal(canTransitionQuote("draft", "accepted"), false);
    assert.equal(canTransitionQuote("sent", "draft"), false);
  });

  it("applyQuoteTransition sella acceptedAt y no muta", () => {
    const quote = { id: "q1", status: "sent" };
    const accepted = applyQuoteTransition(quote, "accepted", { now: "2026-07-22T10:00:00Z" });
    assert.equal(quote.status, "sent");
    assert.equal(accepted.status, "accepted");
    assert.equal(accepted.acceptedAt, "2026-07-22T10:00:00Z");
    assert.equal(accepted.updatedAt, "2026-07-22T10:00:00Z");
  });

  it("lanza en transicion de cotizacion invalida", () => {
    assert.throws(() => applyQuoteTransition({ status: "draft" }, "accepted"), /invalida/);
    assert.throws(() => applyQuoteTransition({ status: "rejected" }, "sent"), /invalida/);
  });
});

describe("order state machine", () => {
  it("declara los estados del pedido", () => {
    assert.deepEqual(ORDER_STATES, ["draft", "confirmed", "fulfilled", "cancelled"]);
  });

  it("draft -> confirmed -> fulfilled|cancelled (transiciones validas)", () => {
    assert.ok(canTransitionOrder("draft", "confirmed"));
    assert.ok(canTransitionOrder("confirmed", "fulfilled"));
    assert.ok(canTransitionOrder("confirmed", "cancelled"));
  });

  it("fulfilled y cancelled son terminales; no se salta ni se retrocede", () => {
    assert.equal(canTransitionOrder("fulfilled", "confirmed"), false);
    assert.equal(canTransitionOrder("cancelled", "confirmed"), false);
    assert.equal(canTransitionOrder("draft", "fulfilled"), false);
    assert.equal(canTransitionOrder("confirmed", "draft"), false);
  });

  it("applyOrderTransition sella confirmedAt y no muta", () => {
    const order = { id: "o1", status: "draft" };
    const confirmed = applyOrderTransition(order, "confirmed", { now: "2026-07-22T11:00:00Z" });
    assert.equal(order.status, "draft");
    assert.equal(confirmed.status, "confirmed");
    assert.equal(confirmed.confirmedAt, "2026-07-22T11:00:00Z");
  });

  it("lanza en transicion de pedido invalida", () => {
    assert.throws(() => applyOrderTransition({ status: "draft" }, "fulfilled"), /invalida/);
    assert.throws(() => applyOrderTransition({ status: "cancelled" }, "confirmed"), /invalida/);
  });
});

describe("acceptQuoteToOrder", () => {
  const quote = {
    id: "q9",
    status: "accepted",
    organizationId: "org1",
    partnerId: "p1",
    currency: "USD",
    ownerId: "u1",
    lines: [
      { variantId: "v1", quantity: 2, unitPrice: 10 },
      { variantId: "v2", quantity: 1, unitPrice: 5, discount: 2 },
    ],
  };

  it("arma un pedido draft con lineas y total desde una cotizacion accepted", () => {
    const order = acceptQuoteToOrder(quote, { now: "2026-07-22T12:00:00Z" });
    assert.equal(order.status, "draft");
    assert.equal(order.quoteId, "q9");
    assert.equal(order.partnerId, "p1");
    assert.equal(order.currency, "USD");
    assert.equal(order.total, 23);
    assert.equal(order.lines.length, 2);
    assert.equal(order.lines[0].lineTotal, 20);
    assert.equal(order.lines[1].lineTotal, 3);
    assert.equal(order.createdAt, "2026-07-22T12:00:00Z");
  });

  it("no muta la cotizacion de origen", () => {
    const snapshot = JSON.stringify(quote);
    acceptQuoteToOrder(quote, { now: "2026-07-22T12:00:00Z" });
    assert.equal(JSON.stringify(quote), snapshot);
  });

  it("lanza si la cotizacion no esta accepted", () => {
    assert.throws(() => acceptQuoteToOrder({ status: "sent", lines: [] }), /accepted/);
  });
});

describe("isQuoteExpired", () => {
  it("es true cuando now supera validUntil (vencida)", () => {
    assert.equal(isQuoteExpired({ validUntil: "2026-07-01T00:00:00Z" }, "2026-07-22T00:00:00Z"), true);
  });

  it("es false cuando validUntil sigue en el futuro (vigente)", () => {
    assert.equal(isQuoteExpired({ validUntil: "2026-08-01T00:00:00Z" }, "2026-07-22T00:00:00Z"), false);
  });

  it("es false cuando no hay validUntil", () => {
    assert.equal(isQuoteExpired({}, "2026-07-22T00:00:00Z"), false);
  });
});

describe("paymentBalance", () => {
  it("saldo parcial: total menos pagos", () => {
    assert.equal(paymentBalance(100, [{ amount: 30 }, { amount: 20 }]), 50);
  });

  it("saldo total: queda en cero cuando se paga todo", () => {
    assert.equal(paymentBalance(100, [{ amount: 100 }]), 0);
  });

  it("sobrepago: permite saldo negativo", () => {
    assert.equal(paymentBalance(100, [{ amount: 120 }]), -20);
  });

  it("sin pagos el saldo es el total", () => {
    assert.equal(paymentBalance(100), 100);
  });
});
