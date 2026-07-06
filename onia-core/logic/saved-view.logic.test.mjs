/*
 * Tests de la logica de vistas guardadas (core). Run:
 *   node --test onia-core/logic/saved-view.logic.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { hasBlockedFilterKeys, sanitizeFilters } from "./saved-view.logic.mjs";

describe("saneo de filtros de SavedView", () => {
  it("detecta claves prohibidas (tenant y proto)", () => {
    assert.equal(hasBlockedFilterKeys({ organizationId: "otra-org" }), true);
    assert.equal(hasBlockedFilterKeys({ status: "open" }), false);
    assert.equal(hasBlockedFilterKeys(JSON.parse('{"__proto__": {"admin": true}}')), true);
  });

  it("no deja sobrescribir el tenant", () => {
    const clean = sanitizeFilters({ status: "open", organizationId: "otra-org" });
    assert.deepEqual(clean, { status: "open" });
  });

  it("evita prototype pollution desde JSON", () => {
    const clean = sanitizeFilters(JSON.parse('{"__proto__": {"admin": true}, "status": "open"}'));
    assert.deepEqual(clean, { status: "open" });
    assert.equal(clean.admin, undefined);
    assert.equal(Object.getPrototypeOf(clean), Object.prototype);
  });

  it("tolera entradas no-objeto", () => {
    assert.deepEqual(sanitizeFilters(null), {});
    assert.deepEqual(sanitizeFilters([1, 2]), {});
  });
});
