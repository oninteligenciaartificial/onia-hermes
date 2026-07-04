import { test } from "node:test";
import assert from "node:assert/strict";
import { laneSchema, parseLane } from "../contracts/lane.schema.mjs";

test("lane válida pasa", () => {
  const lane = { id: "cliente", gate_before_generate: true, require_approved_brief: true, require_cost_estimate: true, identity_gate: false, publishable: false };
  assert.deepEqual(parseLane(lane), lane);
});

test("id fuera de enum falla", () => {
  assert.throws(() => parseLane({ id: "otra", gate_before_generate: false, require_approved_brief: false, require_cost_estimate: false, identity_gate: false, publishable: true }));
});

test("campo booleano faltante falla", () => {
  assert.throws(() => laneSchema.parse({ id: "onia" }));
});
