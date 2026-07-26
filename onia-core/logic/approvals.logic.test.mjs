/*
 * Tests de la logica de aprobaciones (core). Run:
 *   node --test onia-core/logic/approvals.logic.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { applyDecision, canDecide, isPending } from "./approvals.logic.mjs";

describe("aprobaciones", () => {
  it("isPending detecta pendientes", () => {
    assert.equal(isPending({ status: "pending" }), true);
    assert.equal(isPending({ status: "approved" }), false);
  });

  it("no se puede decidir la propia solicitud (salvo allowSelf)", () => {
    const approval = { status: "pending", requestedBy: "u1" };
    assert.equal(canDecide(approval, "u2"), true);
    assert.equal(canDecide(approval, "u1"), false);
    assert.equal(canDecide(approval, "u1", { allowSelf: true }), true);
    assert.equal(canDecide({ status: "approved", requestedBy: "u1" }, "u2"), false);
  });

  it("applyDecision es one-shot e inmutable", () => {
    const approval = { id: "a1", status: "pending", requestedBy: "u1" };
    const decided = applyDecision(approval, "approved", { by: "u2", now: "2026-07-05T12:00:00.000Z" });
    assert.equal(decided.status, "approved");
    assert.equal(decided.approvedBy, "u2");
    assert.equal(decided.decidedAt, "2026-07-05T12:00:00.000Z");
    assert.equal(approval.status, "pending"); // original intacto

    assert.throws(() => applyDecision(decided, "rejected", { by: "u3" }), /ya decidida/);
    assert.throws(() => applyDecision(approval, "quiza", { by: "u2" }), /decision invalida/);
  });
});
