import { test } from "node:test";
import assert from "node:assert/strict";
import { inputHash, buildPlan } from "../engine/plan.mjs";

const intake = { slug: "cafe-luna", lane: "cliente", format: "ugc-ad", oferta: "2x1 miércoles", refs: [], consent: false };
const format = { id: "ugc-ad", engine_model: "marketing_studio_video", aspect_ratio: "9:16", duration_s: 15, lane: "cliente", requires_gate: ["brief", "cost", "review"], generate_audio: false };
const lane = { id: "cliente", gate_before_generate: true, require_approved_brief: true, require_cost_estimate: true, identity_gate: false, publishable: false };

test("inputHash es estable y corto", () => {
  assert.equal(inputHash(intake), inputHash({ ...intake }));
  assert.equal(inputHash(intake).length, 16);
});

test("buildPlan calcula costo y respeta gate", () => {
  const plan = buildPlan(intake, format, lane);
  assert.equal(plan.model, "marketing_studio_video");
  assert.equal(plan.credits_estimated, 120);
  assert.equal(plan.gate_before_generate, true);
  assert.equal(plan.input_hash.length, 16);
});

test("buildPlan falla si lane del formato no coincide con intake", () => {
  assert.throws(() => buildPlan({ ...intake, lane: "onia" }, format, lane));
});
