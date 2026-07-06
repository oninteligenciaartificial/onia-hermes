/*
 * Tests de la numeracion de comprobantes (core). Run:
 *   node --test onia-core/logic/numbering.logic.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { formatDocNumber, nextDocNumber, nextSequence, parseDocNumber } from "./numbering.logic.mjs";

describe("numeracion de comprobantes", () => {
  it("formatea prefijo + correlativo con ceros", () => {
    assert.equal(formatDocNumber("FAC-", 123), "FAC-000123");
    assert.equal(formatDocNumber("AS-", 1, { padding: 4 }), "AS-0001");
  });

  it("parsea el correlativo", () => {
    assert.equal(parseDocNumber("FAC-000123", "FAC-"), 123);
    assert.equal(parseDocNumber("FAC-", "FAC-"), null);
    assert.equal(parseDocNumber(null), null);
  });

  it("incrementa el correlativo", () => {
    assert.equal(nextSequence(0), 1);
    assert.equal(nextSequence(41), 42);
    assert.equal(nextSequence(undefined), 1);
  });

  it("calcula el siguiente numero formateado", () => {
    assert.equal(nextDocNumber("FAC-000123", { prefix: "FAC-" }), "FAC-000124");
    assert.equal(nextDocNumber(null, { prefix: "AS-", padding: 4 }), "AS-0001");
  });
});
