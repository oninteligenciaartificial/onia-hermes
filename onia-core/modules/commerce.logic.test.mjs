/*
 * Tests de la logica pura del modulo commerce. Run:
 *   node --test onia-core/modules/commerce.logic.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  applyStockMovement,
  computeLineTotal,
  computeQuoteTotal,
  isBelowReorder,
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
