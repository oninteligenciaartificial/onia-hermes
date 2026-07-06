/*
 * Tests del motor de permisos (core). Run:
 *   node --test onia-core/logic/roles.logic.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { activeRoleAssignments, can, effectiveRoleKeys, resolvePermissions } from "./roles.logic.mjs";

// Matriz generica de ejemplo (la aporta el vertical, no el core).
const matrix = {
  owner: ["*"],
  cash: ["cash.read", "cash.write"],
  doctor: ["clinical.read", "clinical.write"],
  reception: ["appointment.read", "appointment.write"],
};

describe("asignaciones activas", () => {
  it("descarta inactivas y vencidas", () => {
    const now = "2026-07-05T12:00:00.000Z";
    const assignments = [
      { roleKey: "cash", active: true },
      { roleKey: "doctor", active: false },
      { roleKey: "reception", active: true, expiresAt: "2026-07-01T00:00:00.000Z" },
      { roleKey: "owner", active: true, expiresAt: "2026-12-31T00:00:00.000Z" },
    ];
    const active = activeRoleAssignments(assignments, { now }).map((a) => a.roleKey);
    assert.deepEqual(active.sort(), ["cash", "owner"]);
  });
});

describe("permisos deny-by-default", () => {
  it("concede solo lo que la matriz permite", () => {
    const cash = [{ roleKey: "cash", scopeType: "ORGANIZATION", active: true }];
    assert.equal(can(cash, "cash.write", matrix), true);
    assert.equal(can(cash, "clinical.read", matrix), false); // deny-by-default
  });

  it("el wildcard '*' del dueno concede todo", () => {
    const owner = [{ roleKey: "owner", active: true }];
    assert.equal(can(owner, "clinical.write", matrix), true);
    assert.equal(can(owner, "cualquier.cosa", matrix), true);
  });

  it("union de multiples roles", () => {
    const both = [
      { roleKey: "cash", active: true },
      { roleKey: "doctor", active: true },
    ];
    const actions = resolvePermissions(both, matrix);
    assert.ok(actions.has("cash.write"));
    assert.ok(actions.has("clinical.read"));
  });
});

describe("alcance por area", () => {
  it("un rol de area solo aplica en su area", () => {
    const areaRole = [{ roleKey: "cash", scopeType: "AREA", scopeId: "suc1", active: true }];
    assert.equal(can(areaRole, "cash.write", matrix, { scope: { type: "AREA", id: "suc1" } }), true);
    assert.equal(can(areaRole, "cash.write", matrix, { scope: { type: "AREA", id: "suc2" } }), false);
    assert.equal(can(areaRole, "cash.write", matrix), false); // sin scope no aplica
  });

  it("effectiveRoleKeys respeta activo, vencimiento y alcance", () => {
    const assignments = [
      { roleKey: "owner", scopeType: "ORGANIZATION", active: true },
      { roleKey: "cash", scopeType: "AREA", scopeId: "suc1", active: true },
    ];
    const keys = effectiveRoleKeys(assignments, { scope: { type: "AREA", id: "suc1" } });
    assert.deepEqual(keys.sort(), ["cash", "owner"]);
  });
});
