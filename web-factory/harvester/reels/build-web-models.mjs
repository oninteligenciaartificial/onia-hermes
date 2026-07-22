#!/usr/bin/env node
/**
 * Compile acquired web-models into the factory's LEARNED MODELS library.
 *
 * Reads data/references/reels/models/*.json (each a generation-ready blueprint of
 * a web page seen in a reel) and writes:
 *   - data/references/reels/web-models.json   (machine catalog)
 *   - docs/WEB_FACTORY_LEARNED_MODELS.md       (human catalog)
 *
 * The catalog is what design:auto / generate reach for: pick a learned model that
 * matches the client's rubro, then build the client site from that blueprint with
 * ONIA tokens. It also surfaces the "block library" — the union of factory blocks
 * the learned models need — so we know what to have in packages/blocks.
 *
 * Usage: node harvester/reels/build-web-models.mjs
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

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

function inc(map, key) {
  const clean = String(key || "").trim();
  if (!clean) return;
  map.set(clean, (map.get(clean) || 0) + 1);
}

function top(map, limit = 40) {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([value, count]) => ({ value, count }));
}

export async function buildWebModels(options = {}) {
  const modelsDir = options.modelsDir || "data/references/reels/models";
  const outPath = options.outPath || "data/references/reels/web-models.json";
  const markdownPath = options.markdownPath || "docs/WEB_FACTORY_LEARNED_MODELS.md";
  const nowIso = options.now || new Date().toISOString();

  let files = [];
  try {
    files = (await readdir(modelsDir)).filter((f) => f.endsWith(".json"));
  } catch {
    files = [];
  }

  const models = [];
  for (const f of files) {
    try {
      models.push(JSON.parse(await readFile(path.join(modelsDir, f), "utf8")));
    } catch {
      // skip malformed model
    }
  }

  const blockLibrary = new Map();
  const componentLibrary = new Map();
  const bySiteType = new Map();
  const motionPrimitives = new Map();
  const motionTriggers = new Map();
  // Detect reusable motion primitives from the free-text motion specs, so the
  // catalog surfaces the animation building blocks the factory must implement.
  const PRIMITIVES = [
    [/clip-?path/i, "clip-path-reveal"],
    [/parallax/i, "scroll-parallax"],
    [/stagger/i, "staggered-children"],
    [/\bslam\b/i, "type-slam"],
    [/zoom|scale/i, "scale-zoom"],
    [/\bslide\b/i, "slide-in"],
    [/\bfade\b/i, "fade"],
    [/\blift\b/i, "hover-lift"],
    [/sticky/i, "sticky-nav"],
    [/spotlight|glow/i, "spotlight-glow"],
    [/\brotate\b/i, "rotate"],
  ];
  for (const m of models) {
    for (const c of asArray(m.components)) inc(componentLibrary, c);
    inc(bySiteType, m.siteType || "unclassified");
    for (const s of asArray(m.sections)) {
      inc(blockLibrary, s.block);
      const mo = s.motion || {};
      inc(motionTriggers, mo.trigger);
      const text = `${mo.entrance || ""} ${mo.scrollLinked || ""} ${mo.hover || ""}`;
      for (const [re, name] of PRIMITIVES) if (re.test(text)) inc(motionPrimitives, name);
    }
  }

  const payload = {
    generatedAt: nowIso,
    policy:
      "Learned web-models are generation blueprints, not copies. Rebuild each with ONIA tokens and blocks; supply real client assets; never reuse third-party footage, code, copy or logos. Trend models are inspiration; client-owned assets only after rights confirmed.",
    summary: {
      models: models.length,
      siteTypes: bySiteType.size,
      blocks: blockLibrary.size,
      motionPrimitives: motionPrimitives.size,
    },
    /** the factory blocks the learned models need — the shopping list for packages/blocks */
    blockLibrary: top(blockLibrary),
    /** the animation primitives the models need — the shopping list for a factory motion system */
    motionLibrary: { primitives: top(motionPrimitives), triggers: top(motionTriggers) },
    componentLibrary: top(componentLibrary),
    bySiteType: top(bySiteType),
    models: models
      .map((m) => ({
        id: m.id,
        name: m.name || "",
        siteType: m.siteType || "",
        sourceReel: m.sourceReel || "",
        sourceUrl: m.sourceUrl || "",
        summary: m.summary || "",
        sectionFlow: asArray(m.sections)
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((s) => s.block),
        paletteFamilies: asArray(m.designTokens?.palette).map((p) => p.hex),
        bestFor: asArray(m.bestFor),
        confidence: m.confidence || "medium",
        path: toPublicPath(path.join(modelsDir, `${m.id}.json`)),
      }))
      .sort((a, b) => a.siteType.localeCompare(b.siteType) || a.name.localeCompare(b.name)),
    howToUse: [
      "Match the client's rubro to a learned model in bySiteType.",
      "Open the model JSON: use its sections[] as the composition, designTokens as the token seed, interactions with reduced-motion fallbacks.",
      "Build with ONIA blocks (see blockLibrary for what each model needs); swap in the client's real palette and assets.",
      "Run the pre-ship checklist (real assets, hierarchy, responsive, reduced motion, Core Web Vitals) before delivery.",
    ],
  };

  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
  await mkdir(path.dirname(markdownPath), { recursive: true });
  await writeFile(markdownPath, renderMarkdown(payload), "utf8");
  return payload;
}

function renderMarkdown(payload) {
  return `# Web Factory — Learned Models

Generated: ${payload.generatedAt}

Web designs the factory has **acquired** from reels: each is a generation-ready
blueprint (sections → blocks, tokens, interactions) to build a similar site fast.
These are recipes, not copies — rebuild with ONIA tokens and real client assets.

## Summary

- Learned models: ${payload.summary.models}
- Site types: ${payload.summary.siteTypes}
- Distinct factory blocks needed: ${payload.summary.blocks}
- Motion primitives needed: ${payload.summary.motionPrimitives}

## Block Library (what these models need in packages/blocks)

${payload.blockLibrary.length ? payload.blockLibrary.map((b) => `- \`${b.value}\` × ${b.count}`).join("\n") : "- (none yet)"}

## Motion Library (the animation primitives to build — what makes these feel pro)

Each model's sections carry a precise \`motion\` spec (entrance, trigger, easing
\`[0.22, 1, 0.36, 1]\`, duration, stagger, scroll-linked, hover, reduced-motion).
The reusable primitives across all models:

${payload.motionLibrary.primitives.length ? payload.motionLibrary.primitives.map((p) => `- \`${p.value}\` × ${p.count}`).join("\n") : "- (none yet)"}

Triggers: ${payload.motionLibrary.triggers.map((t) => `${t.value} (${t.count})`).join(" · ") || "-"}. Every primitive ships a reduced-motion fallback.

## Models

${
  payload.models.length
    ? payload.models
        .map(
          (m) =>
            `### ${m.name || m.id} — ${m.siteType} (${m.confidence})\n\n` +
            `${m.summary}\n\n` +
            `- Flow: ${m.sectionFlow.join(" → ") || "-"}\n` +
            `- Best for: ${m.bestFor.join(", ") || "-"}\n` +
            `- Blueprint: \`${m.path}\`${m.sourceUrl ? ` · source: ${m.sourceUrl}` : ""}`,
        )
        .join("\n\n")
    : "- (no models yet — run the acquire pass per harvester/reels/ACQUIRE.md)"
}

## How To Generate From A Model

${payload.howToUse.map((h, i) => `${i + 1}. ${h}`).join("\n")}
`;
}

async function main() {
  const payload = await buildWebModels({
    modelsDir: argValue("--models", ""),
    outPath: argValue("--out", ""),
    markdownPath: argValue("--markdown", ""),
    now: process.argv.includes("--stable-date") ? "1970-01-01T00:00:00.000Z" : undefined,
  });
  console.log(
    `wrote learned models: ${payload.summary.models} model(s) / ${payload.summary.blocks} block type(s)`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
