/*
 * Tests de la logica de tipo de cambio (Bolivia). Run:
 *   node --test onia-core/logic/fx.logic.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  DEFAULT_BANK_SPREAD,
  OFFICIAL_RATE_BOB_PER_USD,
  bobToUsd,
  convertUsdToBob,
  effectiveRate,
  repriceUsdToBob,
  usdToBob,
} from "./fx.logic.mjs";

describe("tipo de cambio Bolivia", () => {
  it("el oficial fijo (SIAT) es 6.96 y el spread por defecto 0.10", () => {
    assert.equal(OFFICIAL_RATE_BOB_PER_USD, 6.96);
    assert.equal(DEFAULT_BANK_SPREAD, 0.1);
  });

  it("tasa efectiva = VRD + spread", () => {
    assert.equal(effectiveRate(9.83), 9.93);
    assert.equal(effectiveRate(9.8, 0.13), 9.93);
  });

  it("convierte USD <-> BOB", () => {
    assert.equal(usdToBob(100, 9.93), 993);
    assert.equal(bobToUsd(993, 9.93), 100);
    assert.throws(() => bobToUsd(100, 0), /invalida/);
  });

  it("convierte USD a BOB con la tasa efectiva en un paso", () => {
    assert.equal(convertUsdToBob(100, { vrd: 9.83 }), 993);
  });

  it("reprecia una lista USD a BOB", () => {
    assert.deepEqual(repriceUsdToBob([10, 20.5], { vrd: 9.83 }), [99.3, 203.57]);
  });
});
