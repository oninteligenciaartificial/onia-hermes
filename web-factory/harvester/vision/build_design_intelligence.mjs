#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_GALLERY = "data/references/design-sources/gallery-examples/latest-gallery-examples.json";
const DEFAULT_CODE = "data/references/code-sources/latest-component-code-examples.json";
const DEFAULT_OUT = "data/references/design-sources/latest-design-intelligence.json";
const DEFAULT_MARKDOWN = "docs/WEB_FACTORY_DESIGN_INTELLIGENCE_LATEST.md";

function argValue(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function toPublicPath(value) {
  return value.replaceAll("\\", "/");
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function inc(map, key, amount = 1) {
  const cleanKey = String(key || "").trim();
  if (!cleanKey) return;
  map.set(cleanKey, (map.get(cleanKey) || 0) + amount);
}

function top(map, limit = 20) {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([value, count]) => ({ value, count }));
}

async function readJsonIfExists(filePath, fallback) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

export async function buildDesignIntelligence(options = {}) {
  const galleryPath = options.galleryPath || DEFAULT_GALLERY;
  const codePath = options.codePath || DEFAULT_CODE;
  const outPath = options.outPath || DEFAULT_OUT;
  const markdownPath = options.markdownPath || DEFAULT_MARKDOWN;
  const gallery = await readJsonIfExists(galleryPath, { results: [] });
  const code = await readJsonIfExists(codePath, { repositories: [] });
  const fontCounts = new Map();
  const ctaCounts = new Map();
  const animationLibraryCounts = new Map();
  const technologyCounts = new Map();
  const sectionCounts = new Map();
  const examples = [];

  const sourceSummaries = asArray(gallery.results).map((source) => {
    const sourceExamples = asArray(source.examples);
    const sourceFontCounts = new Map();
    const sourceAnimations = new Map();
    const sourceCtas = new Map();

    for (const example of sourceExamples) {
      const fonts = asArray(example.fontSignals?.computedFamilies).slice(0, 8);
      const ctas = asArray(example.ctas).slice(0, 12);
      const sections = asArray(example.sections).map((section) => section.heading || section.textSample).slice(0, 12);
      const libraries = example.animationSignals?.libraries || {};
      const tech = example.technologySignals || {};

      for (const font of fonts) {
        inc(fontCounts, font);
        inc(sourceFontCounts, font);
      }

      for (const cta of ctas) {
        inc(ctaCounts, cta.toLowerCase());
        inc(sourceCtas, cta.toLowerCase());
      }

      for (const section of sections) {
        inc(sectionCounts, section);
      }

      for (const [name, active] of Object.entries(libraries)) {
        if (active) {
          inc(animationLibraryCounts, name);
          inc(sourceAnimations, name);
        }
      }

      for (const [name, active] of Object.entries(tech)) {
        if (typeof active === "boolean" && active) inc(technologyCounts, name);
      }

      examples.push({
        sourceId: source.id,
        sourceName: source.name,
        licenseStatus: example.licenseStatus || source.licenseStatus,
        url: example.url,
        title: example.title || example.candidate?.heading || example.candidate?.text || "",
        description: example.description || "",
        reuseGuidance: example.reuseGuidance || source.usage || "",
        screenshots: example.screenshots || {},
        headings: asArray(example.headings).slice(0, 6),
        ctas,
        topFonts: fonts,
        animationSignals: {
          libraries,
          animatedElementCount: example.animationSignals?.animatedElementCount || 0,
          keyframes: asArray(example.animationSignals?.keyframes).slice(0, 12),
        },
        codeLinks: asArray(example.codeLinks).slice(0, 8),
        codeBlockCount: asArray(example.codeBlocks).length,
        qualityWarnings: asArray(example.qualityWarnings),
      });
    }

    return {
      id: source.id,
      name: source.name,
      url: source.url,
      mode: source.mode,
      licenseStatus: source.licenseStatus,
      usage: source.usage,
      candidates: source.selectedCandidateCount || asArray(source.candidates).length,
      examples: sourceExamples.length,
      codeBlocks: sourceExamples.reduce((sum, example) => sum + asArray(example.codeBlocks).length, 0),
      screenshots: sourceExamples.reduce(
        (sum, example) => sum + (example.screenshots?.desktop ? 1 : 0) + (example.screenshots?.mobile ? 1 : 0),
        0,
      ),
      topFonts: top(sourceFontCounts, 8),
      animationLibraries: top(sourceAnimations, 8),
      topCtas: top(sourceCtas, 10),
    };
  });

  const reusableCodeRepositories = asArray(code.repositories)
    .filter((repo) => repo.status === "allowed-after-review")
    .map((repo) => ({
      name: repo.name,
      license: repo.license,
      localPath: repo.localPath,
      selectedExamples: repo.selectedExamples || asArray(repo.examples).length,
      motionExamples: asArray(repo.examples).filter((example) => example.signals?.hasMotion).length,
      shadcnExamples: asArray(repo.examples).filter((example) => example.signals?.hasShadcn).length,
      tailwindExamples: asArray(repo.examples).filter((example) => example.signals?.hasTailwind).length,
    }))
    .sort((a, b) => b.selectedExamples - a.selectedExamples || a.name.localeCompare(b.name));

  const payload = {
    generatedAt: new Date().toISOString(),
    policy:
      "Use this as design intelligence, not as a copy source. Screenshots and closed-site structures are inspiration only. Reuse code only from allowed-after-review repositories after retokenization and QA.",
    inputs: {
      gallery: toPublicPath(galleryPath),
      code: toPublicPath(codePath),
    },
    summary: {
      sources: sourceSummaries.length,
      examples: examples.length,
      screenshots: sourceSummaries.reduce((sum, source) => sum + source.screenshots, 0),
      codeBlocksFromDocs: examples.reduce((sum, example) => sum + example.codeBlockCount, 0),
      reusableCodeRepositories: reusableCodeRepositories.length,
    },
    sourceSummaries,
    globalSignals: {
      fonts: top(fontCounts, 24),
      ctas: top(ctaCounts, 24),
      animationLibraries: top(animationLibraryCounts, 12),
      technologies: top(technologyCounts, 12),
      sectionHeadings: top(sectionCounts, 24),
    },
    recommendedWorkflow: [
      "Select 3-6 exact references per client: one structure, one typography, one motion, one CTA/proof, one asset direction.",
      "Use screenshot paths and URLs to study visual hierarchy; never reuse screenshots, copy or closed-site assets as client media.",
      "Use animationSignals to choose one or two motion patterns, then rebuild them with ONIA tokens.",
      "Use reusableCodeRepositories only when status is allowed-after-review and after license, dependency, accessibility and responsive checks.",
      "Write final selected references into data/intakes/<slug>.json before generating the client profile.",
    ],
    topExamples: examples
      .sort(
        (a, b) =>
          (b.animationSignals.animatedElementCount || 0) - (a.animationSignals.animatedElementCount || 0) ||
          b.codeBlockCount - a.codeBlockCount ||
          a.sourceName.localeCompare(b.sourceName),
      )
      .slice(0, 60),
    reusableCodeRepositories,
  };

  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(payload, null, 2) + "\n", "utf8");

  if (markdownPath) {
    await mkdir(path.dirname(markdownPath), { recursive: true });
    await writeFile(markdownPath, renderMarkdown(payload), "utf8");
  }

  return payload;
}

function renderMarkdown(payload) {
  const topSources = payload.sourceSummaries
    .filter((source) => source.examples)
    .sort((a, b) => b.examples - a.examples || b.screenshots - a.screenshots)
    .slice(0, 12);

  return `# Web Factory Design Intelligence

Generated: ${payload.generatedAt}

## Summary

- Sources: ${payload.summary.sources}
- Opened examples: ${payload.summary.examples}
- Screenshots indexed: ${payload.summary.screenshots}
- Doc code blocks indexed: ${payload.summary.codeBlocksFromDocs}
- Reusable code repositories: ${payload.summary.reusableCodeRepositories}

## Strongest Sources

${topSources
  .map(
    (source) =>
      `- ${source.name}: ${source.examples} examples, ${source.screenshots} screenshots, license: ${source.licenseStatus}`,
  )
  .join("\n")}

## Motion Signals

${payload.globalSignals.animationLibraries.length ? payload.globalSignals.animationLibraries.map((item) => `- ${item.value}: ${item.count}`).join("\n") : "- No motion library signals captured yet."}

## Motion Code Repositories

${payload.reusableCodeRepositories
  .filter((repo) => repo.motionExamples > 0)
  .slice(0, 12)
  .map((repo) => `- ${repo.name}: ${repo.motionExamples} motion examples, license: ${repo.license}`)
  .join("\n") || "- No reusable motion code repositories indexed yet."}

## Font Signals

${payload.globalSignals.fonts.slice(0, 12).map((item) => `- ${item.value}: ${item.count}`).join("\n")}

## Use Rule

Use this file to pick references and rebuild patterns with ONIA tokens. Do not
copy closed-site HTML/CSS/JS, screenshots, images, videos, logos, claims or brand
identity into client work.
`;
}

async function main() {
  const payload = await buildDesignIntelligence({
    galleryPath: argValue("--gallery", DEFAULT_GALLERY),
    codePath: argValue("--code", DEFAULT_CODE),
    outPath: argValue("--out", DEFAULT_OUT),
    markdownPath: argValue("--markdown", DEFAULT_MARKDOWN),
  });
  console.log(
    `wrote design intelligence: ${payload.summary.sources} sources / ${payload.summary.examples} examples`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
