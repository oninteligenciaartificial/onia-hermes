import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { saveSnapshot, latestSnapshot } from "../radar/refresh.mjs";

test("saveSnapshot + latestSnapshot roundtrip", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "radar-"));
  await saveSnapshot("models", [{ id: "seedance_2_0" }], { dir, date: new Date("2026-07-01") });
  await saveSnapshot("models", [{ id: "veo3_1" }], { dir, date: new Date("2026-07-03") });
  const latest = await latestSnapshot("models", { dir });
  assert.equal(latest[0].id, "veo3_1");
});

test("latestSnapshot sin datos devuelve null", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "radar-"));
  assert.equal(await latestSnapshot("presets", { dir }), null);
});
