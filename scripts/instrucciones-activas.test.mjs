#!/usr/bin/env node
// Inert regression checks for active instructions; never runs hooks or Git.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const repoFile = (relative) => readFile(new URL(`../${relative}`, import.meta.url), "utf8");

test("the active router does not turn hook completion into commit/push permission", async () => {
  const router = await repoFile(".claude/skills/onia-router/SKILL.md");
  assert.doesNotMatch(router, /commitear y pushear la rama al terminar/i);
  assert.doesNotMatch(router, /auto-sync activado[^\n]*commitear/i);
  assert.match(router, /auto-sync[^\n]*no autoriza/i);
});
