import { test } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import path from "node:path";

const run = promisify(execFile);
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

test("cli plan imprime modelo y costo estimado", async () => {
  const { stdout } = await run("node", ["cli.mjs", "plan", "--intake", "data/intakes/demo.json"], { cwd: root });
  assert.match(stdout, /marketing_studio_video/);
  assert.match(stdout, /credits_estimated/);
});
