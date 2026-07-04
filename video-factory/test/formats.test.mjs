import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parseFormat } from "../contracts/format.schema.mjs";

async function load(id) {
  return parseFormat(JSON.parse(await readFile(new URL(`../formats/${id}.json`, import.meta.url), "utf8")));
}

test("ugc-ad es lane cliente con gate brief+cost", async () => {
  const f = await load("ugc-ad");
  assert.equal(f.lane, "cliente");
  assert.ok(f.requires_gate.includes("brief"));
  assert.ok(f.requires_gate.includes("cost"));
});

test("sergio-talking-head exige gate de identidad", async () => {
  const f = await load("sergio-talking-head");
  assert.equal(f.lane, "sergio");
  assert.ok(f.requires_gate.includes("identity"));
});

test("reel-onia es 9:16 seedance", async () => {
  const f = await load("reel-onia");
  assert.equal(f.aspect_ratio, "9:16");
  assert.equal(f.engine_model, "seedance_2_0");
});
