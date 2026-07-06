/*
 * Tests del barrel de logica (@onia/core/logic). Run:
 *   node --test onia-core/logic/index.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import * as core from "./index.mjs";

describe("@onia/core/logic barrel", () => {
  it("expone los namespaces de logica del core", () => {
    for (const namespace of [
      "workItems",
      "intake",
      "roles",
      "approvals",
      "scheduling",
      "savedView",
      "fx",
      "numbering",
    ]) {
      assert.equal(typeof core[namespace], "object", `namespace ${namespace}`);
    }
  });

  it("las funciones clave son accesibles por namespace", () => {
    assert.equal(typeof core.workItems.canTransition, "function");
    assert.equal(typeof core.intake.normalizeIntake, "function");
    assert.equal(typeof core.roles.can, "function");
    assert.equal(typeof core.approvals.applyDecision, "function");
    assert.equal(typeof core.scheduling.isUpcoming, "function");
    assert.equal(typeof core.savedView.sanitizeFilters, "function");
    assert.equal(typeof core.fx.effectiveRate, "function");
    assert.equal(typeof core.numbering.nextDocNumber, "function");
  });
});
