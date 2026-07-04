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

test("onia es auto y publicable", async () => {
  const l = await load("onia");
  assert.equal(l.gate_before_generate, false);
  assert.equal(l.publishable, true);
});

test("sergio tiene gate de identidad", async () => {
  const l = await load("sergio");
  assert.equal(l.identity_gate, true);
});
