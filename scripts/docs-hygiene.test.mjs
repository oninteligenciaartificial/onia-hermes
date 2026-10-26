#!/usr/bin/env node
// Tests for scripts/docs-hygiene.mjs. Run: node --test scripts/docs-hygiene.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, writeFile, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Active routing instructions are part of documentation hygiene, not an optional unrun check.
import "./instrucciones-activas.test.mjs";

import { tokenize, fuzzyNameMatch, looksSuperseded, sha256, classifyRootFile, buildMarkdownSummary, buildShortSummary, sortDivergentFindings } from "./docs-hygiene.mjs";

const SCRIPT_PATH = fileURLToPath(new URL("./docs-hygiene.mjs", import.meta.url));

test("tokenize: drops years, dates and bare numbers", () => {
  assert.deepEqual([...tokenize("ONIA_CENTER_AUTH_RLS_ACTIVATION_20260623.md")].sort(), ["activation", "auth", "center", "onia", "rls"].sort());
  assert.deepEqual([...tokenize("ONIA_PLAN_MAESTRO_30_60_90_20260705.md")].sort(), ["maestro", "onia", "plan"].sort());
});

test("tokenize: light singularization", () => {
  assert.ok(tokenize("OPERATIONS.md").has("operation"));
  assert.ok(tokenize("HERMES_OPERATIONS.md").has("operation"));
});

test("tokenize: drops stopwords like 'and'", () => {
  assert.deepEqual([...tokenize("CRM_AND_PROSPECTING.md")].sort(), ["crm", "prospecting"].sort());
});

// Real pairs found in this repo (2026-07-06) — the fuzzy matcher must catch all of them.
const REAL_DIVERGENT_PAIRS = [
  ["HERMES_OPERATIONS.md", "OPERATIONS.md"],
  ["HERMES_CONTENT_WORKFLOW.md", "CONTENT_WORKFLOW.md"],
  ["HERMES_DAILY_CRONS.md", "DAILY_CRONS.md"],
  ["HERMES_EXECUTION_PROTOCOL.md", "EXECUTION_PROTOCOL.md"],
  ["HERMES_TELEGRAM_COMMAND_CENTER.md", "TELEGRAM_COMMAND_CENTER.md"],
  ["HERMES_VIDEO_LAB.md", "VIDEO_LAB.md"],
  ["HERMES_WEEKLY_OPERATING_SYSTEM.md", "WEEKLY_OPERATING_SYSTEM.md"],
  ["CRM_AND_PROSPECTING.md", "CRM_PROSPECTING.md"],
  ["TAX_REMINDERS_BOLIVIA.md", "TAX_REMINDERS.md"],
  ["STYLE_REFERENCE_SYSTEM.md", "STYLE_REFERENCES.md"],
];

test("fuzzyNameMatch: catches every known root<->docs pair in this repo", () => {
  for (const [root, docs] of REAL_DIVERGENT_PAIRS) {
    assert.equal(fuzzyNameMatch(root, docs), true, `expected ${root} <-> ${docs} to fuzzy-match`);
  }
});

test("fuzzyNameMatch: does not match unrelated docs", () => {
  assert.equal(fuzzyNameMatch("ONIA_MASTER_PLAN.md", "ORCHESTRATOR.md"), false);
  assert.equal(fuzzyNameMatch("PRODUCT.md", "SECURITY.md"), false);
  assert.equal(fuzzyNameMatch("FINANCE_LOG_2026.md", "DASHBOARD.md"), false);
});

test("fuzzyNameMatch: two unrelated single-word names sharing only noise tokens do not match", () => {
  assert.equal(fuzzyNameMatch("ONIA_HERMES.md", "ONIA.md"), false);
});

test("looksSuperseded: flags common stale-doc markers", () => {
  assert.equal(looksSuperseded("PLAN_OLD.md"), true);
  assert.equal(looksSuperseded("BORRADOR_PROPUESTA.md"), true);
  assert.equal(looksSuperseded("ONIA_MASTER_PLAN.md"), false);
});

test("sha256: identical buffers hash the same, different buffers do not", () => {
  const a = Buffer.from("hola mundo");
  const b = Buffer.from("hola mundo");
  const c = Buffer.from("otro contenido");
  assert.equal(sha256(a), sha256(b));
  assert.notEqual(sha256(a), sha256(c));
});

function makeDocsIndex(entries) {
  const byHash = new Map();
  const byBasename = new Map();
  for (const e of entries) {
    if (!byHash.has(e.hash)) byHash.set(e.hash, []);
    byHash.get(e.hash).push(e);
    if (!byBasename.has(e.basename)) byBasename.set(e.basename, []);
    byBasename.get(e.basename).push(e);
  }
  return { byHash, byBasename, all: entries };
}

test("classifyRootFile: identical content -> identical (regardless of name)", () => {
  const docsIndex = makeDocsIndex([{ relPath: "hermes-content/docs/OPERATIONS.md", basename: "OPERATIONS.md", hash: "abc123", lastCommitDate: "2026-07-01T00:00:00Z" }]);
  const result = classifyRootFile({ relPath: "HERMES_OPERATIONS.md", basename: "HERMES_OPERATIONS.md", hash: "abc123", lastCommitDate: "2026-06-01T00:00:00Z" }, docsIndex);
  assert.equal(result.classification, "identical");
  assert.equal(result.twins[0].relPath, "hermes-content/docs/OPERATIONS.md");
});

test("classifyRootFile: same basename, different hash -> divergent (name match)", () => {
  const docsIndex = makeDocsIndex([{ relPath: "hermes-content/docs/ELEVENLABS_AUDIO_SYSTEM.md", basename: "ELEVENLABS_AUDIO_SYSTEM.md", hash: "hash-docs", lastCommitDate: "2026-07-01T00:00:00Z" }]);
  const result = classifyRootFile({ relPath: "ELEVENLABS_AUDIO_SYSTEM.md", basename: "ELEVENLABS_AUDIO_SYSTEM.md", hash: "hash-root", lastCommitDate: "2026-06-01T00:00:00Z" }, docsIndex);
  assert.equal(result.classification, "divergent");
  assert.equal(result.matchType, "name");
  assert.equal(result.rootOlderThanTwin, true);
});

test("classifyRootFile: different basename, fuzzy match, different hash -> divergent (fuzzy)", () => {
  const docsIndex = makeDocsIndex([{ relPath: "hermes-content/docs/OPERATIONS.md", basename: "OPERATIONS.md", hash: "hash-docs", lastCommitDate: "2026-07-01T00:00:00Z" }]);
  const result = classifyRootFile({ relPath: "HERMES_OPERATIONS.md", basename: "HERMES_OPERATIONS.md", hash: "hash-root", lastCommitDate: "2026-06-01T00:00:00Z" }, docsIndex);
  assert.equal(result.classification, "divergent");
  assert.equal(result.matchType, "fuzzy");
});

test("classifyRootFile: no name/fuzzy/hash match -> new_in_root", () => {
  const docsIndex = makeDocsIndex([{ relPath: "hermes-content/docs/DASHBOARD.md", basename: "DASHBOARD.md", hash: "hash-docs", lastCommitDate: "2026-07-01T00:00:00Z" }]);
  const result = classifyRootFile({ relPath: "FINANCE_LOG_2026.md", basename: "FINANCE_LOG_2026.md", hash: "hash-root", lastCommitDate: "2026-06-01T00:00:00Z" }, docsIndex);
  assert.equal(result.classification, "new_in_root");
});

test("classifyRootFile: root newer than docs twin is flagged distinctly (not silently treated as stale)", () => {
  const docsIndex = makeDocsIndex([{ relPath: "hermes-content/docs/OPERATIONS.md", basename: "OPERATIONS.md", hash: "hash-docs", lastCommitDate: "2026-06-01T00:00:00Z" }]);
  const result = classifyRootFile({ relPath: "HERMES_OPERATIONS.md", basename: "HERMES_OPERATIONS.md", hash: "hash-root", lastCommitDate: "2026-07-01T00:00:00Z" }, docsIndex);
  assert.equal(result.rootOlderThanTwin, false);
});

test("classifyRootFile: with multiple fuzzy candidates, picks the tightest match (Jaccard) not just the one with more raw shared tokens", () => {
  // Reproduce el caso real: HERMES_VIDEO_LAB.md debe preferir el VIDEO_LAB.md exacto
  // (overlap 2/2) sobre un doc mas largo que tambien comparte "video"+"lab" (overlap 2/5).
  const docsIndex = makeDocsIndex([
    { relPath: "hermes-content/docs/ONIA_OPEN_SOURCE_AI_VIDEO_LAB_2026.md", basename: "ONIA_OPEN_SOURCE_AI_VIDEO_LAB_2026.md", hash: "hash-long", lastCommitDate: "2026-07-01T00:00:00Z" },
    { relPath: "hermes-content/docs/VIDEO_LAB.md", basename: "VIDEO_LAB.md", hash: "hash-tight", lastCommitDate: "2026-07-01T00:00:00Z" },
  ]);
  const result = classifyRootFile({ relPath: "HERMES_VIDEO_LAB.md", basename: "HERMES_VIDEO_LAB.md", hash: "hash-root", lastCommitDate: "2026-06-01T00:00:00Z" }, docsIndex);
  assert.equal(result.classification, "divergent");
  assert.equal(result.twins[0].relPath, "hermes-content/docs/VIDEO_LAB.md");
});

test("sortDivergentFindings: exact-name matches sort before fuzzy matches", () => {
  const findings = [
    { relPath: "Z.md", matchType: "fuzzy" },
    { relPath: "A.md", matchType: "name" },
    { relPath: "B.md", matchType: "fuzzy" },
  ];
  const sorted = sortDivergentFindings(findings);
  assert.deepEqual(sorted.map((f) => f.relPath), ["A.md", "B.md", "Z.md"]);
});

test("buildMarkdownSummary / buildShortSummary: render without throwing and mention counts", () => {
  const report = {
    generatedAt: "2026-07-06T10:00:00.000Z",
    totals: { rootDocs: 3, docsDocs: 2, identicalDeleted: 1, divergent: 1, newInRoot: 1 },
    deleted: [{ relPath: "A.md", twins: [{ relPath: "hermes-content/docs/A.md" }] }],
    divergentFindings: [{ relPath: "B.md", matchType: "fuzzy", patternSuspect: false, rootOlderThanTwin: true, twins: [{ relPath: "hermes-content/docs/B2.md" }] }],
    newInRootFindings: [{ relPath: "C.md", patternSuspect: false }],
  };
  const md = buildMarkdownSummary(report);
  assert.match(md, /Auto-deleted \(identical\): 1/);
  assert.match(md, /B\.md <-> hermes-content\/docs\/B2\.md/);

  const short = buildShortSummary(report);
  assert.match(short, /Auto-limpiado: 1 duplicado/);
  assert.match(short, /Divergentes a fusionar: 1/);
});

// ---- Integration: real git repo fixture, verifies --apply only deletes true byte-identical dupes ----
test("CLI --apply: deletes only the byte-identical root duplicate, leaves divergent/new files, commits", async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), "docs-hygiene-fixture-"));
  try {
    await mkdir(path.join(fixture, "hermes-content/docs"), { recursive: true });

    const sharedContent = "# Operations\n\ncontent that is identical in both places\n";
    await writeFile(path.join(fixture, "hermes-content/docs/OPERATIONS.md"), sharedContent);
    await writeFile(path.join(fixture, "HERMES_OPERATIONS.md"), sharedContent); // identical -> must be deleted

    await writeFile(path.join(fixture, "hermes-content/docs/DAILY_CRONS.md"), "# Daily crons\n\nnew version\n");
    await writeFile(path.join(fixture, "HERMES_DAILY_CRONS.md"), "# Daily crons\n\nold version, different text\n"); // divergent -> keep

    await writeFile(path.join(fixture, "FINANCE_LOG_2026.md"), "# Finance log\n\nunique root-only content\n"); // new_in_root -> keep
    await writeFile(path.join(fixture, "README.md"), "# Fixture repo\n"); // allowlisted -> never flagged
    await writeFile(path.join(fixture, ".gitignore"), ".onia-docs-hygiene/\n");

    const run = (cmd) => execFileSync("git", cmd, { cwd: fixture, encoding: "utf8" });
    run(["init", "-q"]);
    run(["config", "user.email", "test@example.com"]);
    run(["config", "user.name", "Test"]);
    run(["add", "-A"]);
    run(["commit", "-q", "-m", "seed fixture"]);

    const stdout = execFileSync("node", [SCRIPT_PATH, "--apply", "--out", ".onia-docs-hygiene"], { cwd: fixture, encoding: "utf8" });
    assert.match(stdout, /Auto-limpiado: 1 duplicado/);

    await assert.rejects(readFile(path.join(fixture, "HERMES_OPERATIONS.md")), /ENOENT/);
    await assert.doesNotReject(readFile(path.join(fixture, "hermes-content/docs/OPERATIONS.md")));
    await assert.doesNotReject(readFile(path.join(fixture, "HERMES_DAILY_CRONS.md")));
    await assert.doesNotReject(readFile(path.join(fixture, "FINANCE_LOG_2026.md")));

    const log = run(["log", "--format=%s", "-1"]);
    assert.match(log, /chore\(docs\): auto-clean 1 duplicados/);

    const status = run(["status", "--porcelain"]);
    assert.equal(status.trim(), "", "working tree should be clean after commit");

    const report = JSON.parse(await readFile(path.join(fixture, ".onia-docs-hygiene/docs-hygiene-report.json"), "utf8"));
    assert.equal(report.totals.identicalDeleted, 1);
    assert.equal(report.totals.divergent, 1);
    assert.equal(report.totals.newInRoot, 1);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("CLI dry-run (no --apply): never deletes or commits", async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), "docs-hygiene-fixture-dry-"));
  try {
    await mkdir(path.join(fixture, "hermes-content/docs"), { recursive: true });
    const sharedContent = "identical dry-run content\n";
    await writeFile(path.join(fixture, "hermes-content/docs/OPERATIONS.md"), sharedContent);
    await writeFile(path.join(fixture, "HERMES_OPERATIONS.md"), sharedContent);

    const run = (cmd) => execFileSync("git", cmd, { cwd: fixture, encoding: "utf8" });
    run(["init", "-q"]);
    run(["config", "user.email", "test@example.com"]);
    run(["config", "user.name", "Test"]);
    run(["add", "-A"]);
    run(["commit", "-q", "-m", "seed fixture"]);

    const beforeLog = run(["log", "--format=%H"]);
    execFileSync("node", [SCRIPT_PATH, "--out", ".onia-docs-hygiene"], { cwd: fixture, encoding: "utf8" });
    const afterLog = run(["log", "--format=%H"]);

    assert.equal(beforeLog, afterLog, "dry-run must not create a commit");
    await assert.doesNotReject(readFile(path.join(fixture, "HERMES_OPERATIONS.md")), "dry-run must not delete files");
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});
