import { test } from "node:test";
import assert from "node:assert/strict";
import { estimateCost, createHiggsfieldAdapter } from "../engine/higgsfield/adapter.mjs";

test("estimateCost multiplica rate por duración", () => {
  assert.equal(estimateCost({ model: "marketing_studio_video", duration_s: 15 }), 120);
  assert.equal(estimateCost({ model: "seedance_2_0", duration_s: 8 }), 40);
});

test("estimateCost de modelo desconocido lanza", () => {
  assert.throws(() => estimateCost({ model: "no-existe", duration_s: 5 }));
});

test("generate sin runtime no gasta (engine_runtime_required)", async () => {
  const adapter = createHiggsfieldAdapter();
  const out = await adapter.generate({ id: "j1" });
  assert.equal(out.ok, false);
  assert.equal(out.reason, "engine_runtime_required");
});

test("generate con runtime delega", async () => {
  const runtime = { generate: async (job) => ({ ok: true, id: job.id }) };
  const adapter = createHiggsfieldAdapter({ runtime });
  const out = await adapter.generate({ id: "j2" });
  assert.deepEqual(out, { ok: true, id: "j2" });
});
