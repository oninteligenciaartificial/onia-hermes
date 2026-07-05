import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parseFormat } from "../contracts/format.schema.mjs";
import { estimateCost } from "../engine/higgsfield/adapter.mjs";

async function load(id) {
  return parseFormat(JSON.parse(await readFile(new URL(`../formats/${id}.json`, import.meta.url), "utf8")));
}

test("product-showcase es lane cliente con gate brief+cost y mode product_showcase", async () => {
  const f = await load("product-showcase");
  assert.equal(f.lane, "cliente");
  assert.equal(f.engine_model, "marketing_studio_video");
  assert.equal(f.mode, "product_showcase");
  assert.ok(f.requires_gate.includes("brief"));
  assert.ok(f.requires_gate.includes("cost"));
  assert.ok(f.requires_gate.includes("review"));
  assert.equal(f.generate_audio, false);
});

test("explainer es lane onia narrado con solo gate review", async () => {
  const f = await load("explainer");
  assert.equal(f.lane, "onia");
  assert.equal(f.engine_model, "explainer_video");
  assert.equal(f.duration_s, 30);
  assert.deepEqual(f.requires_gate, ["review"]);
  assert.ok(f.shots.length >= 2 && f.shots.length <= 3);
  assert.equal(f.generate_audio, false);
});

test("viral-preset usa higgsfield_preset con preset_id del radar", async () => {
  const f = await load("viral-preset");
  assert.equal(f.lane, "onia");
  assert.equal(f.engine_model, "higgsfield_preset");
  assert.equal(f.preset_id, "<preset-id-del-radar>");
  assert.deepEqual(f.requires_gate, ["review"]);
  assert.equal(f.generate_audio, false);
});

test("clip-from-long usa clipify con source_url youtube", async () => {
  const f = await load("clip-from-long");
  assert.equal(f.lane, "onia");
  assert.equal(f.engine_model, "clipify");
  assert.equal(f.source_url, "<youtube-url>");
  assert.deepEqual(f.requires_gate, ["review"]);
  assert.equal(f.generate_audio, false);
});

test("avatar-outfit es lane sergio con gate identity y try-on (garment_ref + soul_id)", async () => {
  const f = await load("avatar-outfit");
  assert.equal(f.lane, "sergio");
  assert.equal(f.engine_model, "nano_banana");
  assert.equal(f.mode, "virtual_try_on");
  assert.equal(f.garment_ref, "<imagen-prenda>");
  assert.equal(f.soul_id, "<soul-id-sergio>");
  assert.ok(f.requires_gate.includes("identity"));
  assert.ok(f.requires_gate.includes("review"));
  assert.equal(f.generate_audio, false);
});

test("avatar-outfit prohíbe deriva facial y cara de Sergio sin aprobación", async () => {
  const f = await load("avatar-outfit");
  const np = f.negative_prompt.toLowerCase();
  assert.ok(np.includes("deriva facial"));
  assert.ok(np.includes("cuello estirado"));
  assert.ok(np.includes("cgi"));
  assert.ok(np.includes("cara de sergio sin aprobación"));
});

test("estimateCost funciona para un modelo nuevo (nano_banana)", () => {
  assert.equal(estimateCost({ model: "nano_banana", duration_s: 5 }), 10);
});
