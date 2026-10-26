#!/usr/bin/env node
// Agente de limpieza diaria de docs (carril G infra-deploy-n8n).
//
// hermes-content/docs/ es la fuente; la raiz no deberia tener gemelos. Este script:
//  1. Detecta duplicados raiz <-> hermes-content/docs/**, por hash de contenido
//     (identico byte-a-byte, sin importar el nombre) Y por nombre (exacto o "fuzzy":
//     mismo tema con un prefijo distinto, ej HERMES_OPERATIONS.md <-> OPERATIONS.md).
//  2. AUTO-LIMPIEZA SEGURA: con --apply, borra (git rm) SOLO los archivos de raiz cuyo
//     contenido es IDENTICO byte-a-byte a su copia en docs/ (equivalente a `cmp`).
//     Nunca borra nada dentro de hermes-content/docs/. Nada mas se borra solo.
//  3. Todo lo demas queda como FLAG en el reporte (JSON + markdown corto) para que
//     Sergio decida: divergentes (posible fusion pendiente), nuevos en raiz (deberian
//     vivir en docs/), sospechosos de superseded (patron en el nombre o docs/ mas
//     nuevo que la raiz).
//
// Uso:
//   node scripts/docs-hygiene.mjs                          # dry-run, solo reporte
//   node scripts/docs-hygiene.mjs --apply                  # borra identicos + commitea
//   node scripts/docs-hygiene.mjs --apply --out .onia-docs-hygiene
//
// El commit (si hay algo que borrar) queda listo en el working tree local; el push
// lo hace el workflow de GitHub Actions (.github/workflows/docs-hygiene-daily.yml),
// igual que separa repo-pulse el calculo del deploy.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const DOCS_DIR = "hermes-content/docs";

// Archivos de raiz que son estructurales (entry point del repo o del carril), no
// "contenido" que deba vivir en docs/. Nunca se flaguean como "nuevo en raiz".
const ROOT_ALLOWLIST = new Set([
  "README.md",
  "CLAUDE.md",
  "AGENTS.md",
  "LICENSE.md",
  "CHANGELOG.md",
  "CONTRIBUTING.md",
  "COORDINATION_MANIFEST.md",
  "CODEX_SKILL_ROUTING.md",
  "PRODUCT.md", // contexto del skill impeccable: lo busca en el cwd (.claude/skills/impeccable/scripts/context.mjs)
]);

const STOPWORDS = new Set(["and", "the", "of", "a", "en", "de", "la", "el", "y"]);
const NOISE_PREFIX_TOKENS = new Set(["hermes", "onia"]);
const SUPERSEDED_WORDS = new Set(["old", "deprecated", "viejo", "borrador", "backup", "copy", "superseded", "wip"]);

export function tokenize(basename) {
  const stem = basename.replace(/\.md$/i, "");
  const rawTokens = stem.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  const tokens = [];
  for (const raw of rawTokens) {
    if (/^\d+$/.test(raw)) continue; // años, fechas yyyymmdd, y numeros sueltos (30/60/90) son ruido
    let tok = raw.toLowerCase();
    if (STOPWORDS.has(tok)) continue;
    // Singularizacion liviana, pero nunca sobre un token de ruido conocido (evita que
    // "hermes" (termina en s) se convierta en "herme" y deje de reconocerse como ruido).
    if (!NOISE_PREFIX_TOKENS.has(tok) && tok.length > 4 && tok.endsWith("s")) tok = tok.slice(0, -1);
    tokens.push(tok);
  }
  return new Set(tokens);
}

// Saca SIEMPRE los tokens de marca (onia/hermes), incluso si el resultado queda vacio:
// un nombre que es puramente "ONIA"/"HERMES" no tiene tema propio que comparar, y
// fuzzyNameMatch ya trata los sets vacios como "no hay match" (evita que dos archivos
// que son solo la marca, ej. ONIA_HERMES.md y ONIA.md, matcheen por el residuo).
function stripNoisePrefix(tokenSet) {
  const stripped = new Set(tokenSet);
  for (const t of NOISE_PREFIX_TOKENS) stripped.delete(t);
  return stripped;
}

// Dos nombres "hablan del mismo tema" si, tras sacar ruido (HERMES_/ONIA_, stopwords,
// numeros sueltos), sus tokens son iguales, o uno es subconjunto del otro compartiendo
// al menos 2 tokens (para no matchear por una sola palabra generica).
export function fuzzyNameMatch(basenameA, basenameB) {
  const a = stripNoisePrefix(tokenize(basenameA));
  const b = stripNoisePrefix(tokenize(basenameB));
  if (a.size === 0 || b.size === 0) return false;
  const shared = [...a].filter((t) => b.has(t));
  const setEq = a.size === b.size && shared.length === a.size;
  if (setEq) return true;
  const isSubset = shared.length === a.size || shared.length === b.size;
  return shared.length >= 2 && isSubset;
}

export function looksSuperseded(basename) {
  // Token-based (no regex \b): un \b clasico no corta en "_", asi que "BORRADOR_X" no
  // matchearia con \bBORRADOR\b. tokenize() ya separa por no-alfanumerico.
  for (const tok of tokenize(basename)) {
    if (SUPERSEDED_WORDS.has(tok)) return true;
  }
  return false;
}

export function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

// Clasifica un archivo de raiz contra el indice de docs/ ya construido. Pura: no toca
// disco ni git. `docsIndex` = { byHash: Map<hash,[entry]>, byBasename: Map<basename,[entry]>, all: [entry] }
// entry = { relPath, basename, hash, lastCommitDate }
export function classifyRootFile({ relPath, basename, hash, lastCommitDate }, docsIndex) {
  const patternSuspect = looksSuperseded(basename);

  const identicalTwins = docsIndex.byHash.get(hash) || [];
  if (identicalTwins.length > 0) {
    return { relPath, basename, classification: "identical", patternSuspect, twins: identicalTwins };
  }

  const nameTwins = docsIndex.byBasename.get(basename) || [];
  if (nameTwins.length > 0) {
    return buildDivergent(relPath, basename, lastCommitDate, nameTwins, patternSuspect, "name");
  }

  // Cuando hay varios candidatos fuzzy, el mas util es el mas "ajustado" (mayor
  // solapamiento relativo de tokens), no el que comparte mas tokens en numeros
  // absolutos: ej. HERMES_VIDEO_LAB {video,lab} debe preferir VIDEO_LAB {video,lab}
  // (Jaccard 1.0) sobre ONIA_OPEN_SOURCE_AI_VIDEO_LAB_2026 {open,source,ai,video,lab}
  // (Jaccard 0.4), aunque ambos compartan 2 tokens.
  const fuzzyTwins = docsIndex.all
    .map((entry) => ({ entry, score: jaccardSimilarity(basename, entry.basename) }))
    .filter((x) => fuzzyNameMatch(basename, x.entry.basename))
    .sort((x, y) => y.score - x.score)
    .map((x) => x.entry);
  if (fuzzyTwins.length > 0) {
    return buildDivergent(relPath, basename, lastCommitDate, fuzzyTwins, patternSuspect, "fuzzy");
  }

  return { relPath, basename, classification: "new_in_root", patternSuspect, lastCommitDate };
}

function jaccardSimilarity(basenameA, basenameB) {
  const a = stripNoisePrefix(tokenize(basenameA));
  const b = stripNoisePrefix(tokenize(basenameB));
  if (a.size === 0 || b.size === 0) return 0;
  const shared = [...a].filter((t) => b.has(t)).length;
  const union = new Set([...a, ...b]).size;
  return shared / union;
}

function buildDivergent(relPath, basename, lastCommitDate, twins, patternSuspect, matchType) {
  const twin = twins[0];
  const rootOlderThanTwin =
    lastCommitDate && twin.lastCommitDate ? new Date(lastCommitDate) < new Date(twin.lastCommitDate) : null;
  return {
    relPath,
    basename,
    classification: "divergent",
    matchType,
    patternSuspect,
    lastCommitDate,
    twins,
    rootOlderThanTwin,
  };
}

const MATCH_TYPE_PRIORITY = { name: 0, fuzzy: 1 };

// Los matches por "name" (mismo basename exacto en otra parte de docs/) son mucho mas
// confiables que los "fuzzy" (heuristica de tokens): van primero para que el resumen
// corto (que trunca a top-N) priorice lo mas accionable.
export function sortDivergentFindings(findings) {
  return [...findings].sort((a, b) => {
    const pa = MATCH_TYPE_PRIORITY[a.matchType] ?? 2;
    const pb = MATCH_TYPE_PRIORITY[b.matchType] ?? 2;
    if (pa !== pb) return pa - pb;
    return a.relPath.localeCompare(b.relPath);
  });
}

export function buildMarkdownSummary(report) {
  const lines = [
    "# Docs Hygiene Report",
    "",
    `- Generated at: ${report.generatedAt}`,
    `- Root docs checked: ${report.totals.rootDocs}`,
    `- Docs/ files checked: ${report.totals.docsDocs}`,
    `- Auto-deleted (identical): ${report.totals.identicalDeleted}`,
    `- Divergent (needs manual merge): ${report.totals.divergent}`,
    `- New in root (should move to docs/): ${report.totals.newInRoot}`,
    "",
  ];

  if (report.deleted.length) {
    lines.push("## Auto-deleted (identical to docs/ copy)", "");
    for (const d of report.deleted) lines.push(`- ${d.relPath} (== ${d.twins[0].relPath})`);
    lines.push("");
  }

  if (report.divergentFindings.length) {
    lines.push("## Divergent — needs manual merge decision", "");
    for (const f of report.divergentFindings) {
      const staleNote = f.rootOlderThanTwin === true ? " [docs/ es mas reciente]" : f.rootOlderThanTwin === false ? " [raiz es mas reciente, revisar]" : "";
      lines.push(`- ${f.relPath} <-> ${f.twins[0].relPath} (${f.matchType})${staleNote}${f.patternSuspect ? " [patron superseded]" : ""}`);
    }
    lines.push("");
  }

  if (report.newInRootFindings.length) {
    lines.push("## New in root — should move to docs/", "");
    for (const f of report.newInRootFindings) {
      lines.push(`- ${f.relPath}${f.patternSuspect ? " [patron superseded]" : ""}`);
    }
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

// Version corta para Telegram (via n8n): pocas lineas, cuenta todo, lista solo el top.
export function buildShortSummary(report, topN = 6) {
  const lines = [`Docs hygiene (${report.generatedAt.slice(0, 10)}):`];
  lines.push(
    report.totals.identicalDeleted
      ? `Auto-limpiado: ${report.totals.identicalDeleted} duplicado(s) identico(s).`
      : "Auto-limpiado: nada (sin duplicados identicos hoy).",
  );
  if (report.totals.divergent) {
    lines.push(`Divergentes a fusionar: ${report.totals.divergent}`);
    for (const f of report.divergentFindings.slice(0, topN)) {
      lines.push(`  - ${f.relPath} <-> ${f.twins[0].relPath}`);
    }
    if (report.divergentFindings.length > topN) lines.push(`  ...+${report.divergentFindings.length - topN} mas`);
  }
  if (report.totals.newInRoot) {
    lines.push(`Nuevos en raiz (mover a docs/): ${report.totals.newInRoot}`);
    for (const f of report.newInRootFindings.slice(0, topN)) {
      lines.push(`  - ${f.relPath}`);
    }
    if (report.newInRootFindings.length > topN) lines.push(`  ...+${report.newInRootFindings.length - topN} mas`);
  }
  return lines.join("\n");
}

// ---- I/O + git (no se testea unitariamente; se cubre con dry-run real + fixture e2e) ----

function git(args, cwd) {
  return execFileSync("git", args, { encoding: "utf8", cwd, maxBuffer: 32 * 1024 * 1024 }).trim();
}

function tryGit(args, cwd) {
  try {
    return git(args, cwd);
  } catch {
    return "";
  }
}

function lastCommitDate(relPath, cwd) {
  const out = tryGit(["log", "-1", "--format=%cI", "--", relPath], cwd);
  return out || null;
}

async function buildDocsIndex(repoRoot) {
  const listed = tryGit(["ls-files", "--", DOCS_DIR], repoRoot)
    .split("\n")
    .filter((p) => p.toLowerCase().endsWith(".md"));

  const byHash = new Map();
  const byBasename = new Map();
  const all = [];

  for (const relPath of listed) {
    const buf = await readFile(path.join(repoRoot, relPath));
    const hash = sha256(buf);
    const basename = path.basename(relPath);
    const entry = { relPath, basename, hash, lastCommitDate: lastCommitDate(relPath, repoRoot) };
    all.push(entry);
    if (!byHash.has(hash)) byHash.set(hash, []);
    byHash.get(hash).push(entry);
    if (!byBasename.has(basename)) byBasename.set(basename, []);
    byBasename.get(basename).push(entry);
  }

  return { byHash, byBasename, all };
}

async function listRootDocs(repoRoot) {
  return tryGit(["ls-files", "--", "*.md"], repoRoot)
    .split("\n")
    .filter(Boolean)
    .filter((p) => !p.includes("/"))
    .filter((p) => !ROOT_ALLOWLIST.has(p));
}

async function buildReport(repoRoot) {
  const startedAt = Date.now();
  const docsIndex = await buildDocsIndex(repoRoot);
  const rootPaths = await listRootDocs(repoRoot);

  const deleted = [];
  const divergentFindings = [];
  const newInRootFindings = [];

  for (const relPath of rootPaths) {
    const buf = await readFile(path.join(repoRoot, relPath));
    const hash = sha256(buf);
    const basename = path.basename(relPath);
    const finding = classifyRootFile({ relPath, basename, hash, lastCommitDate: lastCommitDate(relPath, repoRoot) }, docsIndex);

    if (finding.classification === "identical") deleted.push(finding);
    else if (finding.classification === "divergent") divergentFindings.push(finding);
    else newInRootFindings.push(finding);
  }

  return {
    generatedAt: new Date().toISOString(),
    durationMs: Date.now() - startedAt,
    totals: {
      rootDocs: rootPaths.length,
      docsDocs: docsIndex.all.length,
      identicalDeleted: deleted.length,
      divergent: divergentFindings.length,
      newInRoot: newInRootFindings.length,
    },
    deleted,
    divergentFindings: sortDivergentFindings(divergentFindings),
    newInRootFindings,
  };
}

function applyCleanup(report, repoRoot) {
  if (!report.deleted.length) {
    return { committed: false, message: "nada que limpiar" };
  }

  const paths = report.deleted.map((d) => d.relPath);
  git(["rm", "--quiet", "--", ...paths], repoRoot);

  const body = report.deleted.map((d) => `- ${d.relPath} (identico a ${d.twins[0].relPath})`).join("\n");
  const message = `chore(docs): auto-clean ${paths.length} duplicados\n\n${body}\n\nGenerado por scripts/docs-hygiene.mjs`;
  git(["commit", "-m", message], repoRoot);

  return { committed: true, message: `commit creado: ${paths.length} archivo(s) borrado(s)` };
}

function parseArgs(argv) {
  const args = { apply: false, out: ".onia-docs-hygiene" };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--apply") args.apply = true;
    else if (argv[i] === "--out") args.out = argv[++i];
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const repoRoot = process.cwd();

  const report = await buildReport(repoRoot);

  let applyResult = { committed: false, message: "dry-run (sin --apply)" };
  if (args.apply) {
    applyResult = applyCleanup(report, repoRoot);
  }
  report.apply = { requested: args.apply, ...applyResult };

  const outDir = path.resolve(repoRoot, args.out);
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "docs-hygiene-report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  await writeFile(path.join(outDir, "docs-hygiene-summary.md"), buildMarkdownSummary(report), "utf8");

  console.log(buildShortSummary(report));
  console.log(`\n[docs-hygiene] ${applyResult.message}`);
  console.log(`[docs-hygiene] reporte completo en ${outDir}`);
}

const isMain = path.resolve(process.argv[1] || "") === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
if (isMain) {
  main().catch((err) => {
    console.error("[docs-hygiene] error:", err instanceof Error ? err.message : err);
    process.exitCode = 1;
  });
}
