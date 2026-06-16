#!/usr/bin/env node
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_REPOS_ROOT = "C:/Users/PC/.codex/design-stack/repos";
const DEFAULT_OUT = "web-factory/data/references/code-sources/latest-code-cache-index.json";

function argValue(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function classifyLicense(text) {
  const normalized = text.toLowerCase();

  if (normalized.includes("polyform noncommercial")) {
    return { license: "PolyForm Noncommercial", status: "study-only" };
  }

  if (normalized.includes("mit license")) {
    return { license: "MIT", status: "allowed-after-review" };
  }

  if (normalized.includes("apache license") || normalized.includes("apache-2.0")) {
    return { license: "Apache-2.0", status: "allowed-after-review" };
  }

  if (normalized.includes("bsd")) {
    return { license: "BSD", status: "allowed-after-review" };
  }

  if (normalized.includes("isc license")) {
    return { license: "ISC", status: "allowed-after-review" };
  }

  if (normalized.includes("gnu general public license") || normalized.includes("agpl")) {
    return { license: "GPL/AGPL", status: "rejected-for-client-use" };
  }

  return { license: "unknown", status: "review-required" };
}

async function findLicense(repoPath) {
  const entries = await readdir(repoPath, { withFileTypes: true });
  const licenseFile = entries.find((entry) => entry.isFile() && /^licen[sc]e/i.test(entry.name));

  if (!licenseFile) {
    return { license: "missing", status: "review-required", licensePath: "" };
  }

  const licensePath = path.join(repoPath, licenseFile.name);
  const text = await readFile(licensePath, "utf8");
  return {
    ...classifyLicense(text),
    licensePath: licensePath.replaceAll("\\", "/"),
    excerpt: text.slice(0, 180).replace(/\s+/g, " ").trim(),
  };
}

async function main() {
  const reposRoot = argValue("--repos-root", DEFAULT_REPOS_ROOT);
  const outPath = argValue("--out", DEFAULT_OUT);
  const entries = await readdir(reposRoot, { withFileTypes: true });
  const repositories = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const repoPath = path.join(reposRoot, entry.name);
    const license = await findLicense(repoPath);
    repositories.push({
      name: entry.name,
      localPath: repoPath.replaceAll("\\", "/"),
      ...license,
    });
  }

  await writeFile(
    outPath,
    JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        reposRoot,
        policy: "Copy/adapt code only from allowed-after-review repos. Never use study-only or rejected code in client sites.",
        repositories,
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );
  console.log(`wrote ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
