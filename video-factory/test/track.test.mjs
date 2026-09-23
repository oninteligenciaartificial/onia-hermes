import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { writeJob, findByHash } from "../engine/track.mjs";
import { quoteBindingHash } from "../engine/higgsfield/adapter.mjs";

const quote = {
  source: "higgsfield_generate_cost", input_hash: "hash-a", workspace_id: "workspace-onia",
  cli_version: "1.1.24", model: "seedance_2_0", model_schema_hash: "schema-a",
  params_hash: "params-a", references_hash: "refs-a", quantity: 1,
  quoted_credits: 2, quoted_at: "2026-07-03T00:00:00Z",
};

function job(over = {}) {
  return {
    id: "vf-001", status: "waiting_approval", format: "reel-onia", lane: "onia",
    model: "seedance_2_0", input_hash: "hash-a", created_at: "t", updated_at: "t",
    ...over,
  };
}

function generatedJob(over = {}) {
  return job({
    status: "generated", workspace_id: "workspace-onia", cli_version: "1.1.24",
    model_schema_hash: "schema-a", params_hash: "params-a", references_hash: "refs-a", quantity: 1,
    identity_ok: true, live_cost_quote: quote,
    generation_approval: {
      approved_by: "Sergio Urcullo", approved_at: "2026-07-03T00:01:00Z",
      input_hash: "hash-a", quote_hash: quoteBindingHash(quote), max_credits: 2, max_quantity: 1,
    },
    ...over,
  });
}

test("writeJob escribe y findByHash lo encuentra", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "vl-"));
  const res = await writeJob(job(), dir);
  assert.equal(res.written, true);
  const found = await findByHash("hash-a", dir);
  assert.equal(found.id, "vf-001");
  const raw = JSON.parse(await readFile(path.join(dir, "vf-001.json"), "utf8"));
  assert.equal(raw.status, "waiting_approval");
});

test("no sobrescribe un job ya generated (idempotente)", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "vl-"));
  await writeJob(generatedJob(), dir);
  const res = await writeJob(job({ id: "vf-002", status: "waiting_approval" }), dir);
  assert.equal(res.written, false);
  assert.equal(res.reason, "idempotent_skip");
});
