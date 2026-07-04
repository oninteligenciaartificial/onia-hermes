import { test } from "node:test";
import assert from "node:assert/strict";
import { parseJob } from "../contracts/job.schema.mjs";

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
