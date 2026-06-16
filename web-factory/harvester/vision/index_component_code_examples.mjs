#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readdir, readFile, stat, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_CODE_INDEX = "web-factory/data/references/code-sources/latest-code-cache-index.json";
const DEFAULT_OUT = "web-factory/data/references/code-sources/latest-component-code-examples.json";
const REUSABLE_STATUS = "allowed-after-review";
const MAX_FILE_BYTES = 180_000;
const MAX_SAMPLE_CHARS = 5000;
const DEFAULT_MAX_FILES_PER_REPO = 36;

const IGNORED_DIRS = new Set([
  ".git",
  ".next",
  ".turbo",
  "dist",
  "build",
  "coverage",
  "node_modules",
  "out",
  ".cache",
]);

const ALLOWED_EXTENSIONS = new Set([".tsx", ".jsx", ".ts", ".js", ".css", ".mdx"]);

function argValue(name, fallback) {
  if (typeof process === "undefined") return fallback;
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function argNumber(name, fallback) {
  const value = Number(argValue(name, ""));
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function toPublicPath(value) {
  return value.replaceAll("\\", "/");
}

function relativePath(root, filePath) {
  return toPublicPath(path.relative(root, filePath));
}

function hashText(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function walkFiles(root, maxFiles = 1000) {
  const files = [];

  async function visit(dir) {
    if (files.length >= maxFiles) return;
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (files.length >= maxFiles) return;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!IGNORED_DIRS.has(entry.name)) await visit(fullPath);
        continue;
      }
      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(ext)) continue;
      files.push(fullPath);
    }
  }

  await visit(root);
  return files;
}

function scoreFile(relative) {
  const value = relative.toLowerCase();
  let score = 0;
  if (value.includes("component")) score += 4;
  if (value.includes("block")) score += 4;
  if (value.includes("registry")) score += 3;
  if (value.includes("example")) score += 3;
  if (value.includes("/ui/")) score += 3;
  if (value.includes("/components/")) score += 5;
  if (value.includes("/blocks/")) score += 5;
  if (value.includes("demo")) score += 2;
  if (value.endsWith(".tsx") || value.endsWith(".jsx")) score += 3;
  if (value.endsWith(".mdx")) score += 1;
  if (value.includes("test") || value.includes("spec")) score -= 4;
  if (value.includes("package.json") || value.includes("config")) score -= 2;
  return score;
}

function classifySnippet(text, relative) {
  const lowerPath = relative.toLowerCase();
  const hasReact = /from ["']react["']|className=|<[A-Z][A-Za-z]/.test(text);
  const hasTailwind = /className=["'][^"']*(?:flex|grid|rounded|bg-|text-|p-|m-|gap-|w-|h-)/.test(text);
  const hasMotion = /framer-motion|motion\/react|motion\./.test(text);
  const hasShadcn = /@\/components\/ui|cva\(|variant/.test(text);
  const hasCss = lowerPath.endsWith(".css");

  return {
    type: hasCss ? "css" : hasReact ? "react-component" : lowerPath.endsWith(".mdx") ? "docs-example" : "utility",
    hasTailwind,
    hasMotion,
    hasShadcn,
    exports: [...text.matchAll(/export\s+(?:default\s+)?(?:function|const|class)\s+([A-Za-z0-9_]+)/g)]
      .map((match) => match[1])
      .slice(0, 10),
    imports: [...text.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]).slice(0, 20),
  };
}

async function readCandidate(filePath, repoRoot) {
  const fileStat = await stat(filePath);
  if (fileStat.size > MAX_FILE_BYTES) return null;
  const relative = relativePath(repoRoot, filePath);
  const score = scoreFile(relative);
  if (score <= 0) return null;
  const text = await readFile(filePath, "utf8");
  if (!/(className=|export |function |const |<[A-Z][A-Za-z]|@\/components|tailwind|motion|component)/i.test(text)) {
    return null;
  }
  return {
    relativePath: relative,
    score,
    bytes: fileStat.size,
    sha256: hashText(text),
    sampleChars: Math.min(text.length, MAX_SAMPLE_CHARS),
    sample: text.slice(0, MAX_SAMPLE_CHARS),
    signals: classifySnippet(text, relative),
  };
}

export async function indexComponentCodeExamples(options = {}) {
  const codeIndexPath = options.codeIndexPath || DEFAULT_CODE_INDEX;
  const outPath = options.outPath || DEFAULT_OUT;
  const maxFilesPerRepo = options.maxFilesPerRepo || DEFAULT_MAX_FILES_PER_REPO;
  const codeIndex = JSON.parse(await readFile(codeIndexPath, "utf8"));
  const repositories = [];

  for (const repo of codeIndex.repositories || []) {
    if (repo.status !== REUSABLE_STATUS) {
      repositories.push({
        name: repo.name,
        localPath: repo.localPath,
        license: repo.license,
        status: repo.status,
        indexed: false,
        reason: `status is ${repo.status}, not ${REUSABLE_STATUS}`,
      });
      continue;
    }

    const allFiles = await walkFiles(repo.localPath, 2500);
    const ranked = allFiles
      .map((filePath) => ({
        filePath,
        relative: relativePath(repo.localPath, filePath),
        score: scoreFile(relativePath(repo.localPath, filePath)),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.relative.localeCompare(b.relative))
      .slice(0, maxFilesPerRepo * 3);

    const examples = [];
    for (const item of ranked) {
      if (examples.length >= maxFilesPerRepo) break;
      const candidate = await readCandidate(item.filePath, repo.localPath);
      if (candidate) examples.push(candidate);
    }

    repositories.push({
      name: repo.name,
      localPath: repo.localPath,
      license: repo.license,
      licensePath: repo.licensePath,
      status: repo.status,
      indexed: true,
      totalCandidateFiles: ranked.length,
      selectedExamples: examples.length,
      examples,
    });
  }

  const payload = {
    capturedAt: new Date().toISOString(),
    policy:
      "Samples are indexed only from local repositories marked allowed-after-review. Review original license and attribution before using code in generated sites.",
    codeIndexPath: toPublicPath(codeIndexPath),
    maxSampleChars: MAX_SAMPLE_CHARS,
    maxFilesPerRepo,
    repositories,
  };

  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
  return payload;
}

async function main() {
  const outPath = argValue("--out", DEFAULT_OUT);
  const payload = await indexComponentCodeExamples({
    codeIndexPath: argValue("--code-index", DEFAULT_CODE_INDEX),
    outPath,
    maxFilesPerRepo: argNumber("--max-files-per-repo", DEFAULT_MAX_FILES_PER_REPO),
  });
  const examples = payload.repositories.reduce((sum, repo) => sum + (repo.selectedExamples || 0), 0);
  console.log(`wrote ${examples} code examples to ${outPath}`);
}

if (typeof process !== "undefined" && process.argv?.[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
