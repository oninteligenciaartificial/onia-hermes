#!/usr/bin/env node
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";

const DEFAULT_SOURCE_IDS = [
  "21st-landing-page-components",
  "registry-directory",
  "magic-ui",
  "aceternity-ui",
  "aceternity-shadcn-blocks",
  "shadcnblocks-blocks",
  "kibo-ui",
  "shadcn-ui",
  "landingfolio",
  "saasframe-landing-pages",
  "recent-design",
];

function argValue(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function argNumber(name, fallback) {
  const value = Number(argValue(name, ""));
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function parseSourceIds() {
  const raw = argValue("--source-ids", DEFAULT_SOURCE_IDS.join(","));
  if (raw === "all") return [];
  return raw.split(",").map((item) => item.trim()).filter(Boolean);
}

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function toPublicPath(value) {
  return value.replaceAll("\\", "/");
}

async function runNode(script, args, cwd) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script, ...args], {
      cwd,
      stdio: "inherit",
      shell: false,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${script} exited with code ${code}`));
    });
  });
}

async function readSummary(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    return null;
  }
}

export async function runDesignReferenceHarvest(options = {}) {
  const cwd = options.cwd || process.cwd();
  const id = options.id || stamp();
  const sourceIds = options.sourceIds ?? parseSourceIds();
  const maxItems = options.maxItems || argNumber("--max-items", 16);
  const detailItems = options.detailItems || argNumber("--detail-items", 2);
  const maxFilesPerRepo = options.maxFilesPerRepo || argNumber("--max-files-per-repo", 36);
  const skipGallery = options.skipGallery ?? hasFlag("--skip-gallery");
  const skipCode = options.skipCode ?? hasFlag("--skip-code");
  const skipIntelligence = options.skipIntelligence ?? hasFlag("--skip-intelligence");
  const galleryOut = path.join("data", "references", "design-sources", "gallery-examples", `${id}-design-harvest.json`);
  const codeIndexOut = path.join("data", "references", "code-sources", `${id}-code-cache-index.json`);
  const codeExamplesOut = path.join("data", "references", "code-sources", `${id}-component-code-reference-pack.json`);
  const latestCodeIndex = path.join("data", "references", "code-sources", "latest-code-cache-index.json");
  const latestCodeExamples = path.join("data", "references", "code-sources", "latest-component-code-examples.json");
  const latestGallery = path.join("data", "references", "design-sources", "gallery-examples", "latest-gallery-examples.json");
  const intelligenceOut = path.join("data", "references", "design-sources", "latest-design-intelligence.json");
  const intelligenceMarkdown = path.join("docs", "WEB_FACTORY_DESIGN_INTELLIGENCE_LATEST.md");
  const summaryOut = path.join("data", "references", "design-sources", "gallery-examples", "latest-harvest-summary.json");
  const startedAt = new Date().toISOString();
  const steps = [];

  if (!skipGallery) {
    const args = [
      path.join("harvester", "vision", "scrape_gallery_examples.mjs"),
      "--config",
      path.join("data", "references", "design-sources", "gallery-reference-sources.json"),
      "--cache-root",
      "C:/Users/PC/.codex/design-stack/gallery-examples-full",
      "--out",
      galleryOut,
      "--max-items",
      String(maxItems),
      "--detail-items",
      String(detailItems),
    ];

    if (sourceIds.length) {
      args.push("--source-ids", sourceIds.join(","));
    }

    await runNode(args[0], args.slice(1), cwd);
    steps.push({ name: "gallery", out: galleryOut, sourceIds, maxItems, detailItems });
  }

  if (!skipCode) {
    await runNode(
      path.join("harvester", "vision", "index_licensed_code.mjs"),
      ["--repos-root", "C:/Users/PC/.codex/design-stack/repos", "--out", codeIndexOut],
      cwd,
    );
    await runNode(
      path.join("harvester", "vision", "index_component_code_examples.mjs"),
      ["--code-index", codeIndexOut, "--out", codeExamplesOut, "--max-files-per-repo", String(maxFilesPerRepo)],
      cwd,
    );
    await copyFile(path.join(cwd, codeIndexOut), path.join(cwd, latestCodeIndex));
    await copyFile(path.join(cwd, codeExamplesOut), path.join(cwd, latestCodeExamples));
    steps.push({ name: "code", codeIndexOut, codeExamplesOut, maxFilesPerRepo });
  }

  await runNode(
    path.join("harvester", "vision", "merge_gallery_examples.mjs"),
    ["--input-dir", path.join("data", "references", "design-sources", "gallery-examples"), "--out", latestGallery],
    cwd,
  );
  steps.push({ name: "merge", out: latestGallery });

  if (!skipIntelligence) {
    await runNode(
      path.join("harvester", "vision", "build_design_intelligence.mjs"),
      [
        "--gallery",
        latestGallery,
        "--code",
        skipCode ? path.join("data", "references", "code-sources", "latest-component-code-examples.json") : codeExamplesOut,
        "--out",
        intelligenceOut,
        "--markdown",
        intelligenceMarkdown,
      ],
      cwd,
    );
    steps.push({ name: "intelligence", out: intelligenceOut, markdown: intelligenceMarkdown });
  }

  const galleryPayload = await readSummary(path.join(cwd, latestGallery));
  const intelligencePayload = await readSummary(path.join(cwd, intelligenceOut));
  const summary = {
    id,
    startedAt,
    finishedAt: new Date().toISOString(),
    policy:
      "Automated design reference harvest. Screenshots and closed-site structures are reference-only. Code reuse is limited to allowed-after-review repositories and compatible registry/docs code after review.",
    steps: steps.map((step) => Object.fromEntries(Object.entries(step).map(([key, value]) => [key, Array.isArray(value) ? value : typeof value === "string" ? toPublicPath(value) : value]))),
    latestGallery: toPublicPath(latestGallery),
    latestDesignIntelligence: toPublicPath(intelligenceOut),
    counts: {
      sources: galleryPayload?.summary?.sources ?? 0,
      candidates: galleryPayload?.summary?.candidates ?? 0,
      detailedExamples: galleryPayload?.summary?.detailedExamples ?? 0,
      errors: galleryPayload?.summary?.errors ?? 0,
      intelligenceExamples: intelligencePayload?.summary?.examples ?? 0,
      reusableCodeRepositories: intelligencePayload?.summary?.reusableCodeRepositories ?? 0,
    },
  };

  await mkdir(path.dirname(path.join(cwd, summaryOut)), { recursive: true });
  await writeFile(path.join(cwd, summaryOut), JSON.stringify(summary, null, 2) + "\n", "utf8");
  console.log(`wrote harvest summary to ${summaryOut}`);
  return summary;
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const intervalMinutes = argNumber("--interval-minutes", 0);
  const once = hasFlag("--once") || !intervalMinutes;

  do {
    const summary = await runDesignReferenceHarvest();
    console.log(
      `harvest ${summary.id}: ${summary.counts.sources} sources, ${summary.counts.detailedExamples} examples, ${summary.counts.reusableCodeRepositories} code repos`,
    );

    if (once) break;
    await sleep(intervalMinutes * 60 * 1000);
  } while (true);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
