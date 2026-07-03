#!/usr/bin/env node
// ONIA docs hygiene - deterministic daily check.
// Detects the recurring hygiene problems we fixed by hand on 2026-07-03:
//   1. Duplicate docs between repo root and hermes-content/docs/.
//   2. Tracked files that .gitignore says should be ignored (e.g. __pycache__).
//   3. Stray tracked temp files (tmp_*, *.tmp, session screenshots).
//   4. Dead script/path references inside Markdown docs.
// Read-only by default. Pass --fix to apply only the "safe_auto" cleanups
// (untrack gitignored files, untrack stray temp files). It never deletes doc
// content or resolves divergent duplicates; those need a human/PR.
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

const run = promisify(execFile);
const repoRoot = process.cwd();
const args = parseArgs(process.argv.slice(2));
const outDir = path.resolve(repoRoot, args.out || ".onia-hygiene");
const applyFix = parseBoolean(args.fix ?? "false");
const failOn = (args.failOn || "never").toLowerCase(); // never | high | blocker

const DOC_DIRS = ["hermes-content/docs", "web-factory/docs"];
const TEMP_PATTERNS = [/(^|\/)tmp[_-]/i, /\.tmp$/i, /(^|\/)temp[_-]/i, /~$/];
const SCRIPT_REF = /\b((?:scripts|hermes-scripts)\/[A-Za-z0-9_./-]+\.(?:mjs|js|py|ps1|cmd))\b/g;
// Only these regenerable caches are auto-fixable by --fix. Other tracked-but-
// ignored files (e.g. *.log under references/, which the .gitignore NOTE says
// should sync) are surfaced for human review, never auto-removed.
const REGENERABLE = [
  /(^|\/)__pycache__\//,
  /\.pyc$/,
  /(^|\/)\.ruff_cache\//,
  /(^|\/)dist\//,
  /(^|\/)build\//,
  /(^|\/)\.cache\//,
  /(^|\/)node_modules\//,
];

const findings = [];
const actions = [];

try {
  await checkRootDocsDuplicates();
  await checkTrackedIgnored();
  await checkStrayTempFiles();
  await checkDeadScriptRefs();

  const report = buildReport();
  await writeOutputs(report);

  const blockers = findings.filter((f) => f.severity === "blocker").length;
  const highs = findings.filter((f) => f.severity === "high").length;
  console.log(
    `ONIA docs hygiene: ${findings.length} findings (${blockers} blocker, ${highs} high). ` +
      `${applyFix ? actions.length + " auto-fixes applied." : "read-only."}`,
  );
  for (const line of report.summaryLines) console.log(line);

  if (failOn === "blocker" && blockers > 0) process.exitCode = 2;
  if (failOn === "high" && (blockers > 0 || highs > 0)) process.exitCode = 2;
} catch (error) {
  console.error(`ONIA docs hygiene failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}

function parseArgs(items) {
  const parsed = {};
  for (let i = 0; i < items.length; i += 1) {
    if (!items[i].startsWith("--")) continue;
    const key = items[i].slice(2);
    const next = items[i + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = "true";
      continue;
    }
    parsed[key] = next;
    i += 1;
  }
  return parsed;
}

function parseBoolean(value) {
  return ["1", "true", "yes", "si", "on"].includes(String(value).trim().toLowerCase());
}

async function git(argv) {
  const { stdout } = await run("git", argv, { cwd: repoRoot, maxBuffer: 20 * 1024 * 1024 });
  return stdout;
}

async function trackedFiles() {
  const out = await git(["ls-files"]);
  return out.split("\n").map((l) => l.trim()).filter(Boolean);
}

function addFinding(input) {
  findings.push({
    id: input.id,
    check: input.check,
    severity: input.severity ?? "info",
    cleanupLevel: input.cleanupLevel ?? "pull_request",
    title: input.title,
    detail: input.detail,
    recommendedAction: input.recommendedAction,
    files: input.files ?? [],
    autoFixed: false,
  });
  return findings[findings.length - 1];
}

async function sha(file) {
  const buf = await readFile(path.resolve(repoRoot, file));
  return createHash("sha1").update(buf).digest("hex");
}

// 1. Duplicate docs between repo root and hermes-content/docs/.
async function checkRootDocsDuplicates() {
  const tracked = await trackedFiles();
  const rootDocs = tracked.filter((f) => !f.includes("/") && /\.(md|html)$/i.test(f));
  for (const name of rootDocs) {
    const twin = `hermes-content/docs/${name}`;
    if (!tracked.includes(twin)) continue;
    const identical = (await sha(name)) === (await sha(twin));
    if (identical) {
      addFinding({
        id: `dup-identical-${name}`,
        check: "root_docs_duplicate",
        severity: "medium",
        cleanupLevel: "pull_request",
        title: `Doc duplicado identico en raiz y docs/: ${name}`,
        detail: "El mismo archivo existe en la raiz y en hermes-content/docs/. hermes-content/docs/ es canonico (se despliega al VPS).",
        recommendedAction: `Eliminar la copia de raiz ./${name} y dejar solo hermes-content/docs/${name}.`,
        files: [name, twin],
      });
    } else {
      addFinding({
        id: `dup-divergent-${name}`,
        check: "root_docs_duplicate",
        severity: "high",
        cleanupLevel: "approval_required",
        title: `Doc duplicado DIVERGENTE en raiz y docs/: ${name}`,
        detail: "Existe en ambos lugares con contenido distinto. Riesgo de fuente-de-verdad ambigua (ej. precios).",
        recommendedAction: `Fusionar el contenido unico en hermes-content/docs/${name} y borrar la copia de raiz. No borrar sin revisar; puede haber contenido unico en cada lado.`,
        files: [name, twin],
      });
    }
  }
}

// 2. Tracked files that .gitignore already declares ignored.
async function checkTrackedIgnored() {
  let out = "";
  try {
    out = await git(["ls-files", "--cached", "--ignored", "--exclude-standard"]);
  } catch {
    return;
  }
  const files = out.split("\n").map((l) => l.trim()).filter(Boolean);
  if (!files.length) return;

  const regen = files.filter((f) => REGENERABLE.some((re) => re.test(f)));
  const other = files.filter((f) => !regen.includes(f));

  if (regen.length) {
    const finding = addFinding({
      id: "tracked-ignored-cache",
      check: "tracked_ignored",
      severity: "medium",
      cleanupLevel: "safe_auto",
      title: `${regen.length} cache/build regenerable trackeado pese a .gitignore`,
      detail: "Archivos regenerables (pycache, dist, build) versionados por error. Se destrackean sin perdida; siguen en disco.",
      recommendedAction: "git rm --cached <archivos>. El --fix lo hace automaticamente.",
      files: regen,
    });
    if (applyFix) {
      await git(["rm", "--cached", "--quiet", ...regen]);
      finding.autoFixed = true;
      actions.push(`untracked ${regen.length} regenerable cache file(s)`);
    }
  }

  if (other.length) {
    addFinding({
      id: "tracked-ignored-review",
      check: "tracked_ignored",
      severity: "low",
      cleanupLevel: "pull_request",
      title: `${other.length} archivo(s) ignorado(s) por .gitignore pero trackeado(s) (revisar)`,
      detail: "Coinciden con una regla de .gitignore (ej. *.log) pero estan bajo carpetas de referencias/assets. No se auto-borran: decidir si el patron de .gitignore o el tracking es lo correcto.",
      recommendedAction: "Revisar manualmente: o ajustar .gitignore (excepcion) o git rm --cached si son basura.",
      files: other,
    });
  }
}

// 3. Stray tracked temp files (screenshots, tmp_*, *.tmp).
async function checkStrayTempFiles() {
  const tracked = await trackedFiles();
  const stray = tracked.filter(
    (f) => TEMP_PATTERNS.some((re) => re.test(f)) && !f.startsWith("tmp-assets/") && !f.includes("/node_modules/"),
  );
  if (!stray.length) return;
  const finding = addFinding({
    id: "stray-temp",
    check: "stray_temp",
    severity: "low",
    cleanupLevel: "safe_auto",
    title: `${stray.length} archivo(s) temporal(es) trackeado(s)`,
    detail: "Nombres tipo tmp_*, *.tmp o capturas de sesion versionadas por error (excluye tmp-assets/, que son assets reales).",
    recommendedAction: "Revisar y git rm si son basura de sesion. El --fix los destrackea (siguen en disco).",
    files: stray,
  });
  if (applyFix) {
    await git(["rm", "--cached", "--quiet", ...stray]);
    finding.autoFixed = true;
    actions.push(`untracked ${stray.length} stray temp file(s)`);
  }
}

// 4. Dead script/path references inside Markdown docs.
async function checkDeadScriptRefs() {
  const tracked = await trackedFiles();
  const trackedSet = new Set(tracked);
  const docs = tracked.filter((f) => /\.md$/i.test(f) && (DOC_DIRS.some((d) => f.startsWith(d)) || !f.includes("/")));
  const dead = new Map(); // ref -> Set(docs)
  for (const doc of docs) {
    let text;
    try {
      text = await readFile(path.resolve(repoRoot, doc), "utf8");
    } catch {
      continue;
    }
    // A ref like "scripts/x.mjs" is package-relative shorthand: the real file
    // may live under web-factory/scripts/x.mjs, hermes-scripts/x.mjs, etc. Treat
    // it as alive if any tracked file shares that same path tail. Only refs that
    // match nowhere are truly dead.
    for (const rawLine of text.split("\n")) {
      // Skip roadmap items: an unchecked checkbox describes a script to build,
      // not a claim that it already exists.
      if (/\[\s?\]/.test(rawLine)) continue;
      for (const match of rawLine.matchAll(SCRIPT_REF)) {
        const ref = match[1];
        const alive =
          trackedSet.has(ref) ||
          tracked.some((t) => t.endsWith(`/${ref}`)) ||
          existsSync(path.resolve(repoRoot, ref));
        if (alive) continue;
        if (!dead.has(ref)) dead.set(ref, new Set());
        dead.get(ref).add(doc);
      }
    }
  }
  for (const [ref, inDocs] of dead) {
    addFinding({
      id: `dead-ref-${ref}`,
      check: "dead_reference",
      severity: "medium",
      cleanupLevel: "pull_request",
      title: `Referencia a script inexistente: ${ref}`,
      detail: `Documentado en: ${[...inDocs].join(", ")}. El archivo no existe en el repo.`,
      recommendedAction: "Actualizar el doc al path correcto o crear/restaurar el script.",
      files: [...inDocs],
    });
  }
}

function buildReport() {
  findings.sort(
    (a, b) => severityRank(b.severity) - severityRank(a.severity) || a.check.localeCompare(b.check),
  );
  const byCheck = {};
  for (const f of findings) byCheck[f.check] = (byCheck[f.check] ?? 0) + 1;
  const summaryLines = findings.slice(0, 25).map((f) => `- [${f.severity}] ${f.title}`);
  return {
    ok: true,
    generatedAt: new Date().toISOString(),
    repoRoot,
    applyFix,
    totals: {
      findings: findings.length,
      blocker: findings.filter((f) => f.severity === "blocker").length,
      high: findings.filter((f) => f.severity === "high").length,
      autoFixed: findings.filter((f) => f.autoFixed).length,
    },
    byCheck,
    actions,
    findings,
    summaryLines,
  };
}

function severityRank(severity) {
  return { blocker: 5, high: 4, medium: 3, low: 2, info: 1 }[severity] ?? 0;
}

async function writeOutputs(report) {
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "onia-docs-hygiene-report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  await writeFile(path.join(outDir, "onia-docs-hygiene-summary.md"), renderMarkdown(report), "utf8");
}

function renderMarkdown(report) {
  const lines = [
    "# ONIA Docs Hygiene Report",
    "",
    `- Generated at: ${report.generatedAt}`,
    `- Findings: ${report.totals.findings} (blocker ${report.totals.blocker}, high ${report.totals.high})`,
    `- Auto-fixes applied: ${report.totals.autoFixed}`,
    "",
    "## Findings",
    "",
  ];
  if (!report.findings.length) {
    lines.push("No findings. Docs hygiene clean.");
  } else {
    for (const f of report.findings) {
      lines.push(`### [${f.severity}] ${f.title}`);
      lines.push("");
      lines.push(`- Check: ${f.check}`);
      lines.push(`- Cleanup level: ${f.cleanupLevel}${f.autoFixed ? " (auto-fixed)" : ""}`);
      lines.push(`- Detail: ${f.detail}`);
      lines.push(`- Recommended action: ${f.recommendedAction}`);
      if (f.files.length) lines.push(`- Files: ${f.files.slice(0, 20).join(", ")}${f.files.length > 20 ? " ..." : ""}`);
      lines.push("");
    }
  }
  return `${lines.join("\n")}\n`;
}
