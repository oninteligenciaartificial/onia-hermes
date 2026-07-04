import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFormat } from "../contracts/format.schema.mjs";

const valid = {
  id: "reel-onia", engine_model: "seedance_2_0", aspect_ratio: "9:16",
  duration_s: 8, lane: "onia",
  shots: [{ n: 1, description: "Hook" }],
  negative_prompt: "No placeholder text.",
  requires_gate: ["review"], generate_audio: false,
};

test("formato válido pasa y aplica defaults", () => {
  const out = parseFormat(valid);
  assert.equal(out.engine, "higgsfield");
  assert.equal(out.shots[0].n, 1);
});

test("shots vacío falla", () => {
  assert.throws(() => parseFormat({ ...valid, shots: [] }));
});

test("gate desconocido falla", () => {
  assert.throws(() => parseFormat({ ...valid, requires_gate: ["magic"] }));
});
