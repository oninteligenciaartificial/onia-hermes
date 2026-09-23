import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parseLane } from "../contracts/lane.schema.mjs";

async function load(id) {
  return parseLane(JSON.parse(await readFile(new URL(`../lanes/${id}.json`, import.meta.url), "utf8")));
}

test("cliente exige gate antes de generar y no es publicable", async () => {
  const l = await load("cliente");
  assert.equal(l.gate_before_generate, true);
  assert.equal(l.publishable, false);
});

test("onia exige aprobacion, costo e identidad y no publica", async () => {
  const l = await load("onia");
  assert.equal(l.gate_before_generate, true);
  assert.equal(l.require_approved_brief, true);
  assert.equal(l.require_cost_estimate, true);
  assert.equal(l.identity_gate, true);
  assert.equal(l.publishable, false);
});

test("sergio exige aprobacion, costo e identidad y no publica", async () => {
  const l = await load("sergio");
  assert.equal(l.gate_before_generate, true);
  assert.equal(l.require_approved_brief, true);
  assert.equal(l.require_cost_estimate, true);
  assert.equal(l.identity_gate, true);
  assert.equal(l.publishable, false);
});
