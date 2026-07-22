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
  officialRate,
  repriceUsdToBob,
  usdToBob,
} from "./fx.logic.mjs";

describe("tipo de cambio Bolivia", () => {
  it("el fallback oficial historico es 6.96 y el spread por defecto 0.10", () => {
    assert.equal(OFFICIAL_RATE_BOB_PER_USD, 6.96);
    assert.equal(DEFAULT_BANK_SPREAD, 0.1);
  });

  it("officialRate usa el TCO diario del BCB y cae al fallback si no hay dato", () => {
    assert.equal(officialRate(10.9), 10.9); // TCO del dia (external_gate)
    assert.equal(officialRate(undefined), 6.96); // sin TCO -> fallback historico
    assert.equal(officialRate(null), 6.96);
    assert.equal(officialRate(0), 6.96); // 0 no es tasa valida -> fallback
    assert.equal(officialRate(-1), 6.96); // negativo -> fallback
    assert.equal(officialRate("no-numero"), 6.96);
    assert.equal(officialRate(9.83, 7), 9.83); // fallback custom, TCO valido igual gana
    assert.equal(officialRate(undefined, 7), 7); // fallback custom
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
