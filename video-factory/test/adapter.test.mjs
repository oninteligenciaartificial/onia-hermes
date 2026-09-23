import { test } from "node:test";
import assert from "node:assert/strict";
import { estimateCost, createHiggsfieldAdapter, quoteBindingHash, validateGenerationGate } from "../engine/higgsfield/adapter.mjs";

const nowMs = Date.parse("2026-09-22T12:10:00Z");
const liveCostQuote = {
  source: "higgsfield_generate_cost",
  input_hash: "abc123",
  workspace_id: "workspace-onia",
  cli_version: "1.1.24",
  model: "seedance_2_0",
  model_schema_hash: "schema-1",
  params_hash: "params-1",
  references_hash: "refs-1",
  quantity: 1,
  quoted_credits: 2,
  quoted_at: "2026-09-22T12:00:00Z",
};
const approvedJob = {
  id: "j-approved",
  status: "approved_for_generation",
  input_hash: "abc123",
  workspace_id: "workspace-onia",
  cli_version: "1.1.24",
  model: "seedance_2_0",
  model_schema_hash: "schema-1",
  params_hash: "params-1",
  references_hash: "refs-1",
  quantity: 1,
  identity_ok: true,
  live_cost_quote: liveCostQuote,
  generation_approval: {
    approved_by: "Sergio Urcullo",
    approved_at: "2026-09-22T12:01:00Z",
    input_hash: "abc123",
    quote_hash: quoteBindingHash(liveCostQuote),
    max_credits: 2,
    max_quantity: 1,
  },
};

test("estimateCost multiplica rate por duración", () => {
  assert.equal(estimateCost({ model: "marketing_studio_video", duration_s: 15 }), 120);
  assert.equal(estimateCost({ model: "seedance_2_0", duration_s: 8 }), 40);
});

test("estimateCost de modelo desconocido lanza", () => {
  assert.throws(() => estimateCost({ model: "no-existe", duration_s: 5 }));
});

test("generate sin runtime no gasta (engine_runtime_required)", async () => {
  const adapter = createHiggsfieldAdapter({ now: () => nowMs });
  const out = await adapter.generate({ ...approvedJob, id: "j1" });
  assert.equal(out.ok, false);
  assert.equal(out.reason, "engine_runtime_required");
});

test("generate rechaza un job sin costo vivo ni aprobación", async () => {
  const gate = validateGenerationGate({ id: "j0", status: "waiting_approval" });
  assert.equal(gate.ok, false);
  assert.ok(gate.missing.includes("live_cost_quote.source"));

  const adapter = createHiggsfieldAdapter({ runtime: { generate: async () => ({ ok: true }) }, now: () => nowMs });
  const out = await adapter.generate({ id: "j0", status: "waiting_approval" });
  assert.equal(out.ok, false);
  assert.equal(out.reason, "generation_gate_failed");
});

test("gate liga costo y aprobación al input, modelo, params, referencias, cantidad y vigencia", () => {
  assert.equal(validateGenerationGate(approvedJob, { nowMs }).ok, true);

  const bypass = {
    ...approvedJob,
    model: "kling3_0",
    live_cost_quote: { ...liveCostQuote, quoted_credits: 0, quoted_at: "stale" },
    generation_approval: { ...approvedJob.generation_approval, approved_by: "any string", max_credits: 0 },
  };
  const gate = validateGenerationGate(bypass, { nowMs });
  assert.equal(gate.ok, false);
  assert.ok(gate.missing.includes("live_cost_quote.model"));
  assert.ok(gate.missing.includes("live_cost_quote.quoted_at"));
  assert.ok(gate.missing.includes("generation_approval.approved_by"));
  assert.ok(gate.missing.includes("generation_approval.quote_hash"));
});

test("generate con runtime delega", async () => {
  const runtime = { generate: async (job) => ({ ok: true, id: job.id }) };
  const adapter = createHiggsfieldAdapter({ runtime, now: () => nowMs });
  const out = await adapter.generate({ ...approvedJob, id: "j2" });
  assert.deepEqual(out, { ok: true, id: "j2" });
});
