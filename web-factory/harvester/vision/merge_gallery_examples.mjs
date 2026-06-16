#!/usr/bin/env node
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_INPUT_DIR = "web-factory/data/references/design-sources/gallery-examples";
const DEFAULT_OUT = "web-factory/data/references/design-sources/gallery-examples/latest-gallery-examples.json";

function argValue(name, fallback) {
  if (typeof process === "undefined") return fallback;
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function toPublicPath(value) {
  return value.replaceAll("\\", "/");
}

export async function mergeGalleryExamples(options = {}) {
  const inputDir = options.inputDir || DEFAULT_INPUT_DIR;
  const outPath = options.outPath || DEFAULT_OUT;
  const files = (await readdir(inputDir))
    .filter((file) => file.endsWith(".json"))
    .filter((file) => !file.startsWith("latest-") && !file.startsWith("smoke-"))
    .filter((file) => !file.includes("smoke"))
    .filter((file) => !file.includes("playwright"))
    .filter((file) => !file.startsWith("2026-"))
    .sort();

  const bySource = new Map();
  const errors = [];
  const inputs = [];

  for (const file of files) {
    const filePath = path.join(inputDir, file);
    const json = JSON.parse(await readFile(filePath, "utf8"));
    inputs.push(toPublicPath(filePath));
    for (const result of json.results || []) {
      bySource.set(result.id, {
        ...result,
        mergedFrom: toPublicPath(filePath),
      });
    }
    for (const error of json.errors || []) {
      errors.push({ ...error, mergedFrom: toPublicPath(filePath) });
    }
  }

  const results = [...bySource.values()].sort((a, b) => a.id.localeCompare(b.id));
  const payload = {
    capturedAt: new Date().toISOString(),
    policy:
      "Merged Web Factory gallery index. Use candidates for design intelligence; use examples for deeper screenshots/code. Respect licenseStatus before code reuse.",
    inputDir: toPublicPath(inputDir),
    inputs,
    summary: {
      sources: results.length,
      candidates: results.reduce((sum, source) => sum + (source.selectedCandidateCount || 0), 0),
      detailedExamples: results.reduce((sum, source) => sum + (source.examples?.length || 0), 0),
      errors: errors.length,
      codeBlocks: results.reduce(
        (sum, source) =>
          sum + (source.examples || []).reduce((innerSum, example) => innerSum + (example.codeBlocks?.length || 0), 0),
        0,
      ),
    },
    results,
    errors,
  };

  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
  return payload;
}

async function main() {
  const outPath = argValue("--out", DEFAULT_OUT);
  const payload = await mergeGalleryExamples({
    inputDir: argValue("--input-dir", DEFAULT_INPUT_DIR),
    outPath,
  });
  console.log(`merged ${payload.summary.sources} sources / ${payload.summary.candidates} candidates to ${outPath}`);
}

if (typeof process !== "undefined" && process.argv?.[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
