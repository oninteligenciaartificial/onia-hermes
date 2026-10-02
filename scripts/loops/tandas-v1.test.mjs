import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, test } from "node:test";

import { reviewTanda, spawnBounded, validateManifest } from "./tandas-v1.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST = path.resolve(HERE, "../../hermes-content/docs/cola/tandas-v1.json");
const roots = [];
afterEach(async () => { while (roots.length) await fs.rm(roots.pop(), { recursive: true, force: true }); });

function command(cwd, executable, args) {
  const result = spawnSync(executable, args, { cwd, encoding: "utf8", shell: false });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

async function fixture(options = {}) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "onia-tandas-test-"));
  roots.push(root);
  const repo = path.join(root, "repo");
  await fs.mkdir(repo);
  command(repo, "git", ["init", "-q"]);
  command(repo, "git", ["config", "user.name", "Tanda QA"]);
  command(repo, "git", ["config", "user.email", "tanda@example.invalid"]);
  await fs.mkdir(path.join(repo, "lib", "chatbot"), { recursive: true });
  const target = path.join(repo, "lib", "chatbot", "flow.ts");
  await fs.writeFile(target, "export const estado = 'base';\n");
  command(repo, "git", ["add", "lib/chatbot/flow.ts"]);
  command(repo, "git", ["commit", "-qm", "base"]);
  command(repo, "git", ["branch", "-M", "main"]);
  command(repo, "git", ["update-ref", "refs/remotes/origin/main", "HEAD"]);
  await fs.writeFile(target, "export const estado = 'nuevo';\n");
  const manifest = {
    version: 1, wave: "onia-v1-test", lanes: [{
      id: "chatbot", owner: "carril-chatbot", repo: "onia-platform", baseRef: "origin/main",
      status: "ready", sensitivity: options.sensitive ? "sensitive" : "normal",
      backlogRef: "hermes-content/docs/cola/plataforma-v1.md", paths: ["lib/chatbot/**"],
      resources: ["platform:chatbot"], dependsOn: [],
      checks: [{ argv: ["node", "-e", options.failCheck ? "process.exit(7)" : "process.stdout.write('ok')"] }],
    }],
  };
  const manifestPath = path.join(root, "manifest.json");
  await fs.writeFile(manifestPath, JSON.stringify(manifest));
  return { root, repo, target, manifest, manifestPath, laneId: "chatbot", outPath: path.join(root, "review.json"), lockRoot: path.join(root, "locks") };
}

const goodReview = ({ candidateSha256, testEvidenceSha256 }) => ({
  verdict: "apto", candidateSha256, testEvidenceSha256, summary: "Cambio acotado y pruebas verdes.", findings: [],
});

test("el revisor compatible se elige explícitamente y se registra sin fallback", async () => {
  const data = await fixture();
  let selected;
  const record = await reviewTanda({ ...data, worktree: data.repo, reviewerModel: "gpt-5.5", reviewer: async (input) => {
    selected = input.model;
    return goodReview(input);
  } });
  assert.equal(selected, "gpt-5.5");
  assert.equal(record.reviewerModel, "gpt-5.5");
  assert.equal(record.reviewerEffort, "medium");
  await assert.rejects(reviewTanda({ ...data, worktree: data.repo, reviewerModel: "modelo-desconocido" }), /modelo de revisión no permitido/);
});

test("manifiesto real: tres carriles disjuntos y referencias mínimas", async () => {
  const manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8"));
  assert.deepEqual(validateManifest(manifest), []);
  assert.deepEqual(manifest.lanes.map((lane) => lane.id), ["chatbot", "operacion", "ux-dueno"]);
  assert.ok(manifest.lanes.every((lane) => lane.status === "discovery"));
  assert.equal(manifest.externalOwners.length, 5);
  manifest.lanes[0].status = "ready";
  assert.match(validateManifest(manifest).join("\n"), /owner externo activo/);
});

test("rechaza path padre/hijo, recurso repetido, owner/base y dependencias cíclicas", async () => {
  const { manifest } = await fixture();
  const second = structuredClone(manifest.lanes[0]);
  second.id = "ux";
  second.paths = ["lib/chatbot/flow.ts"];
  second.dependsOn = ["chatbot"];
  manifest.lanes.push(second);
  const errors = validateManifest(manifest);
  assert.match(errors.join("\n"), /paths solapados/);
  assert.match(errors.join("\n"), /recurso duplicado/);
  manifest.lanes[0].dependsOn = ["ux"];
  manifest.lanes[0].owner = "";
  manifest.lanes[0].baseRef = "main";
  const more = validateManifest(manifest).join("\n");
  assert.match(more, /ciclo de dependencias/);
  assert.match(more, /owner inválido/);
  assert.match(more, /baseRef inválido/);
});

test("manifiesto malformado devuelve errores sin ejecutar ni romper el validador", async () => {
  const { manifest } = await fixture();
  manifest.externalOwners = {};
  manifest.lanes[0].paths = 7;
  manifest.lanes[0].resources = 8;
  manifest.lanes[0].dependsOn = 9;
  const problems = validateManifest(manifest).join("\n");
  assert.match(problems, /externalOwners inválidos/);
  assert.match(problems, /faltan paths/);
  assert.match(problems, /resources inválidos/);
  assert.match(problems, /dependsOn inválido/);
});

test("aprueba candidato exacto y conserva hashes de diff y pruebas", async () => {
  const data = await fixture();
  const record = await reviewTanda({ ...data, worktree: data.repo, reviewer: goodReview });
  assert.equal(record.verdict, "apto");
  assert.match(record.candidateSha256, /^[a-f0-9]{64}$/);
  assert.match(record.testEvidenceSha256, /^[a-f0-9]{64}$/);
  assert.deepEqual(record.files, ["lib/chatbot/flow.ts"]);
  assert.deepEqual(JSON.parse(await fs.readFile(data.outPath, "utf8")), record);
});

test("base SHA fija sobrevive avance del ref y HEAD distinto no se acepta", async () => {
  const data = await fixture();
  const base = command(data.repo, "git", ["rev-parse", "HEAD"]);
  const advanced = command(data.repo, "git", ["commit-tree", "HEAD^{tree}", "-p", base, "-m", "remote advanced"]);
  command(data.repo, "git", ["update-ref", "refs/remotes/origin/main", advanced]);
  const record = await reviewTanda({ ...data, worktree: data.repo, expectedBaseCommit: base, expectedHeadCommit: base, reviewer: goodReview });
  assert.equal(record.baseCommit, base);
  assert.equal(record.headCommit, base);
  command(data.repo, "git", ["update-ref", "HEAD", advanced]);
  await assert.rejects(reviewTanda({ ...data, worktree: data.repo, outPath: path.join(data.root, "different-head.json"), expectedBaseCommit: base, expectedHeadCommit: base, reviewer: goodReview }), /HEAD SHA no coincide/);
});

test("timeout mata el árbol del revisor incluido un proceso nieto", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "onia-tandas-tree-"));
  roots.push(root);
  const pidFile = path.join(root, "grandchild.pid");
  const script = path.join(root, "reviewer.mjs");
  await fs.writeFile(script, `import { spawn } from 'node:child_process';\nimport { writeFileSync } from 'node:fs';\nconst child = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], { stdio: 'inherit' });\nwriteFileSync(${JSON.stringify(pidFile)}, String(child.pid));\nsetInterval(() => {}, 1000);\n`);
  const started = Date.now();
  await assert.rejects(spawnBounded(process.execPath, [script], { cwd: root, timeoutMs: 1500 }), /proceso excedió tiempo/);
  assert.ok(Date.now() - started < 7500, "timeout debe terminar en tiempo acotado");
  const pid = Number(await fs.readFile(pidFile, "utf8"));
  let alive = false;
  try { process.kill(pid, 0); alive = true; } catch { /* proceso terminado */ }
  assert.equal(alive, false, "el nieto no puede seguir consumiendo después del timeout");
});

test("un carril sensible nunca queda apto sólo por Luna", async () => {
  const data = await fixture({ sensitive: true });
  const record = await reviewTanda({ ...data, worktree: data.repo, reviewer: goodReview });
  assert.equal(record.reviewerVerdict, "apto");
  assert.equal(record.verdict, "escalar");
  assert.equal(record.strongReviewRequired, true);
});

test("prueba roja cierra sin llamar al revisor ni dejar resultado/lock", async () => {
  const data = await fixture({ failCheck: true });
  let called = false;
  await assert.rejects(reviewTanda({ ...data, worktree: data.repo, reviewer: async () => { called = true; return goodReview({}); } }), /check falló/);
  assert.equal(called, false);
  await assert.rejects(fs.access(data.outPath), /ENOENT/);
  assert.deepEqual(await fs.readdir(data.lockRoot), []);
});

test("revisor erróneo o hash de replay no firma el candidato", async () => {
  const data = await fixture();
  await assert.rejects(reviewTanda({ ...data, worktree: data.repo, reviewer: async (input) => ({ ...goodReview(input), candidateSha256: "0".repeat(64) }) }), /salida del revisor inválida/);
  await assert.rejects(fs.access(data.outPath), /ENOENT/);
  assert.deepEqual(await fs.readdir(data.lockRoot), []);
});

test("error del revisor cierra sin resultado y libera locks locales", async () => {
  const data = await fixture();
  await assert.rejects(reviewTanda({ ...data, worktree: data.repo, reviewer: async () => { throw new Error("modelo no disponible"); } }), /modelo no disponible/);
  await assert.rejects(fs.access(data.outPath), /ENOENT/);
  assert.deepEqual(await fs.readdir(data.lockRoot), []);
});

test("si el cierre del proceso no está confirmado conserva locks para inspección", async () => {
  const data = await fixture();
  await assert.rejects(reviewTanda({ ...data, worktree: data.repo, reviewer: async () => {
    throw Object.assign(new Error("cierre del árbol no confirmado"), { retainLock: true });
  } }), /cierre del árbol no confirmado/);
  await assert.rejects(fs.access(data.outPath), /ENOENT/);
  assert.ok((await fs.readdir(data.lockRoot)).length > 0);
  await assert.rejects(reviewTanda({ ...data, worktree: data.repo, reviewer: goodReview }), /recurso local ocupado/);
});

test("cambio durante revisión invalida la prueba y no escribe resultado", async () => {
  const data = await fixture();
  await assert.rejects(reviewTanda({ ...data, worktree: data.repo, reviewer: async (input) => {
    await fs.writeFile(data.target, "export const estado = 'otro';\n");
    return goodReview(input);
  } }), /candidato cambió durante la revisión/);
  await assert.rejects(fs.access(data.outPath), /ENOENT/);
});

test("un lock local bloquea otro cierre simultáneo del mismo recurso", async () => {
  const data = await fixture();
  let releaseReviewer;
  let started;
  const reviewerStarted = new Promise((resolve) => { started = resolve; });
  const hold = new Promise((resolve) => { releaseReviewer = resolve; });
  const first = reviewTanda({ ...data, worktree: data.repo, reviewer: async (input) => { started(); await hold; return goodReview(input); } });
  await reviewerStarted;
  await assert.rejects(reviewTanda({ ...data, worktree: data.repo, outPath: path.join(data.root, "other.json"), reviewer: goodReview }), /recurso local ocupado/);
  releaseReviewer();
  assert.equal((await first).verdict, "apto");
});

test("un resultado anterior no se sobreescribe ni se reusa", async () => {
  const data = await fixture();
  await reviewTanda({ ...data, worktree: data.repo, reviewer: goodReview });
  await fs.writeFile(data.target, "export const estado = 'replay';\n");
  await assert.rejects(reviewTanda({ ...data, worktree: data.repo, reviewer: goodReview }), /--out ya existe/);
});

test("archivo fuera del carril falla antes del modelo", async () => {
  const data = await fixture();
  await fs.writeFile(path.join(data.repo, "otro.ts"), "export const otro = true;\n");
  let called = false;
  await assert.rejects(reviewTanda({ ...data, worktree: data.repo, reviewer: async () => { called = true; return goodReview({}); } }), /fuera del carril/);
  assert.equal(called, false);
});
