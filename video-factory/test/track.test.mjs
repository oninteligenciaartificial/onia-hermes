import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { writeJob, findByHash } from "../engine/track.mjs";

function job(over = {}) {
  return {
    id: "vf-001", status: "waiting_approval", format: "reel-onia", lane: "onia",
    model: "seedance_2_0", input_hash: "hash-a", created_at: "t", updated_at: "t",
    ...over,
  };
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
  await writeJob(job({ status: "generated" }), dir);
  const res = await writeJob(job({ id: "vf-002", status: "waiting_approval" }), dir);
  assert.equal(res.written, false);
  assert.equal(res.reason, "idempotent_skip");
});
