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
  it("6.96 es la tasa del regimen ANTERIOR, no una tasa vigente", () => {
    // Se conserva para leer registros anteriores al 26-jun-2026 (flotacion).
    // Ya no es el valor por defecto de officialRate: ver el test de abajo.
    assert.equal(OFFICIAL_RATE_BOB_PER_USD, 6.96);
    assert.equal(DEFAULT_BANK_SPREAD, 0.1);
  });

  it("officialRate usa el TCO diario del BCB", () => {
    assert.equal(officialRate(10.9), 10.9); // TCO del dia (external_gate)
    assert.equal(officialRate(9.83, 7), 9.83); // un TCO valido le gana al fallback
  });

  it("sin TCO valido LANZA: nunca inventa una tasa", () => {
    // Regresion con riesgo de plata: antes caia en silencio a 6.96. Con el
    // oficial cerca de 11.89 eso emitia una factura ~41% subvaluada sin aviso.
    // En una ruta de plata el patron correcto es fallar fuerte.
    assert.throws(() => officialRate(undefined), /TCO/);
    assert.throws(() => officialRate(null), /TCO/);
    assert.throws(() => officialRate(0), /TCO/);
    assert.throws(() => officialRate(-1), /TCO/);
    assert.throws(() => officialRate("no-numero"), /TCO/);
  });

  it("el fallback es opt-in explicito y tiene que ser una tasa valida", () => {
    assert.equal(officialRate(undefined, 7), 7); // el que lo pasa se hace cargo
    assert.throws(() => officialRate(undefined, 0), /fallback/);
    assert.throws(() => officialRate(undefined, -1), /fallback/);
    assert.throws(() => officialRate(undefined, "no-numero"), /fallback/);
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
