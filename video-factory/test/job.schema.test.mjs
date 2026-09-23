import { test } from "node:test";
import assert from "node:assert/strict";
import { parseJob } from "../contracts/job.schema.mjs";
import { quoteBindingHash } from "../engine/higgsfield/adapter.mjs";

const base = {
  id: "vf-20260703-001", status: "waiting_approval", format: "reel-onia",
  lane: "onia", model: "seedance_2_0", input_hash: "abc123",
  created_at: "2026-07-03T00:00:00Z", updated_at: "2026-07-03T00:00:00Z",
};

test("job válido aplica defaults", () => {
  const out = parseJob(base);
  assert.deepEqual(out.source_urls, []);
  assert.equal(out.identity_ok, false);
  assert.equal(out.engine, "higgsfield");
});

test("status desconocido falla", () => {
  assert.throws(() => parseJob({ ...base, status: "done" }));
});

test("approved_for_generation exige identidad, hashes, costo vivo y aprobación", () => {
  assert.throws(() => parseJob({ ...base, status: "approved_for_generation" }));
});

test("approved_for_generation conserva quote y aprobación ligadas", () => {
  const quote = {
    source: "higgsfield_generate_cost", input_hash: "abc123",
    workspace_id: "workspace-onia", cli_version: "1.1.24", model: "seedance_2_0",
    model_schema_hash: "schema-a",
    params_hash: "params-a", references_hash: "refs-a", quantity: 1,
    quoted_credits: 2, quoted_at: "2026-09-22T12:00:00Z",
  };
  const out = parseJob({
    ...base, status: "approved_for_generation", workspace_id: "workspace-onia",
    cli_version: "1.1.24", model_schema_hash: "schema-a", params_hash: "params-a",
    references_hash: "refs-a", identity_ok: true, live_cost_quote: quote,
    generation_approval: {
      approved_by: "Sergio Urcullo", approved_at: "2026-09-22T12:01:00Z",
      input_hash: "abc123", quote_hash: quoteBindingHash(quote), max_credits: 2, max_quantity: 1,
    },
  });
  assert.equal(out.generation_approval.approved_by, "Sergio Urcullo");
  assert.throws(() => parseJob({
    ...out,
    model: "kling3_0",
  }));
});
