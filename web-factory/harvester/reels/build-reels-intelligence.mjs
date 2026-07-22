#!/usr/bin/env node
/**
 * Compile per-reel analyses into reels intelligence: aggregated palette families,
 * motion techniques, hooks, shots, moods and section ideas — grouped by rubro —
 * plus a human-readable markdown. Trend lane feeds the pattern bank; client lane
 * writes <slug>.reels.json/.md next to the client design recipe.
 *
 * Usage:
 *   node harvester/reels/build-reels-intelligence.mjs --lane trend
 *   node harvester/reels/build-reels-intelligence.mjs --lane client --slug nuvia
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

function inc(map, key, amount = 1) {
  const cleanKey = String(key || "").trim();
  if (!cleanKey) return;
  map.set(cleanKey, (map.get(cleanKey) || 0) + amount);
}

function top(map, limit = 24) {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([value, count]) => ({ value, count }));
}

/** Coarse hue family from a hex color, so palettes aggregate meaningfully. */
function hexToFamily(hex) {
  const m = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(String(hex).trim());
  if (!m) return "";
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d < 0.08) {
    if (l < 0.2) return "near-black";
    if (l > 0.85) return "near-white";
    return "neutral-gray";
  }
  let hue = 0;
  if (max === r) hue = ((g - b) / d) % 6;
  else if (max === g) hue = (b - r) / d + 2;
  else hue = (r - g) / d + 4;
  hue = (hue * 60 + 360) % 360;
  const names = [
    [15, "red"], [45, "orange"], [70, "yellow"], [160, "green"],
    [200, "teal"], [255, "blue"], [290, "purple"], [335, "pink"], [360, "red"],
  ];
  const base = names.find(([deg]) => hue <= deg)[1];
  const tone = l < 0.35 ? "deep " : l > 0.7 ? "light " : "";
  return `${tone}${base}`.trim();
}

export async function buildReelsIntelligence(options = {}) {
  const lane = options.lane || "trend";
  const slug = options.slug || "";
  const analysesDir =
    options.analysesDir ||
    (lane === "client" ? `data/clients/${slug}.reels/analyses` : "data/references/reels/analyses");
  const outPath =
    options.outPath ||
    (lane === "client" ? `data/clients/${slug}.reels.json` : "data/references/reels/reels-intelligence.json");
  const markdownPath =
    options.markdownPath ||
    (lane === "client" ? `data/clients/${slug}.reels.md` : "docs/WEB_FACTORY_REELS_INTELLIGENCE_LATEST.md");
  const nowIso = options.now || new Date().toISOString();

  let files = [];
  try {
    files = (await readdir(analysesDir)).filter((f) => f.endsWith(".json"));
  } catch {
    files = [];
  }

  const analyses = [];
  for (const f of files) {
    try {
      analyses.push(JSON.parse(await readFile(path.join(analysesDir, f), "utf8")));
    } catch {
      // skip malformed analysis
    }
  }

  const paletteFamilies = new Map();
  const motionTechniques = new Map();
  const transitions = new Map();
  const pacing = new Map();
  const shots = new Map();
  const hookTypes = new Map();
  const moods = new Map();
  const sectionIdeas = new Map();
  const byRubro = new Map();
  // Signals of the WEB PAGE shown inside the reels (the main payload).
  const siteSections = new Map();
  const siteComponents = new Map();
  const siteInteractions = new Map();
  const sitePaletteFamilies = new Map();
  const siteReuse = new Map();
  let sitesShown = 0;

  for (const a of analyses) {
    for (const c of asArray(a.palette)) inc(paletteFamilies, hexToFamily(c.hex));
    for (const t of asArray(a.motion?.techniques)) inc(motionTechniques, t);
    for (const t of asArray(a.motion?.transitions)) inc(transitions, t);
    inc(pacing, a.motion?.pacing);
    for (const s of asArray(a.shots)) inc(shots, s);
    inc(hookTypes, a.hook?.type);
    for (const m of asArray(a.mood)) inc(moods, m);
    for (const s of asArray(a.webIdeas?.sectionIdeas)) inc(sectionIdeas, s);

    const site = a.showcasedSite || {};
    if (site.present) {
      sitesShown += 1;
      for (const s of asArray(site.sections)) inc(siteSections, s);
      for (const c of asArray(site.components)) inc(siteComponents, c);
      for (const i of asArray(site.interactions)) inc(siteInteractions, i);
      for (const c of asArray(site.palette)) inc(sitePaletteFamilies, hexToFamily(c.hex));
      for (const r of asArray(site.reuseForFactory)) inc(siteReuse, r);
    }

    const rubro = (a.rubro || "unclassified").trim() || "unclassified";
    if (!byRubro.has(rubro)) {
      byRubro.set(rubro, { rubro, reels: 0, palette: new Map(), motion: new Map(), hooks: new Map(), sections: new Map() });
    }
    const bucket = byRubro.get(rubro);
    bucket.reels += 1;
    for (const c of asArray(a.palette)) inc(bucket.palette, hexToFamily(c.hex));
    for (const t of asArray(a.motion?.techniques)) inc(bucket.motion, t);
    inc(bucket.hooks, a.hook?.type);
    for (const s of asArray(a.webIdeas?.sectionIdeas)) inc(bucket.sections, s);
  }

  const payload = {
    generatedAt: nowIso,
    lane,
    clientSlug: lane === "client" ? slug : "",
    policy:
      "Reels intelligence for design decisions, not a copy source. Trend reels: inspiration only — rebuild motion/type with ONIA tokens, never reuse third-party footage, audio, music, copy or logos. Client reels: reuse the client's OWN footage only after the client confirms rights.",
    inputs: { analysesDir: toPublicPath(analysesDir) },
    summary: {
      reels: analyses.length,
      rubros: byRubro.size,
      sitesShown,
      avgConfidence: analyses.length
        ? (
            analyses.reduce((s, a) => s + ({ low: 1, medium: 2, high: 3 }[a.confidence] || 2), 0) / analyses.length
          ).toFixed(2)
        : "0",
    },
    // The web pages shown INSIDE the reels — the main thing to learn from.
    showcasedSites: {
      count: sitesShown,
      sections: top(siteSections, 24),
      components: top(siteComponents, 20),
      interactions: top(siteInteractions, 20),
      paletteFamilies: top(sitePaletteFamilies, 16),
      reuseForFactory: top(siteReuse, 24),
    },
    globalSignals: {
      paletteFamilies: top(paletteFamilies, 16),
      motionTechniques: top(motionTechniques, 16),
      transitions: top(transitions, 12),
      pacing: top(pacing, 4),
      shots: top(shots, 16),
      hookTypes: top(hookTypes, 12),
      moods: top(moods, 16),
      sectionIdeas: top(sectionIdeas, 24),
    },
    byRubro: [...byRubro.values()]
      .sort((a, b) => b.reels - a.reels || a.rubro.localeCompare(b.rubro))
      .map((b) => ({
        rubro: b.rubro,
        reels: b.reels,
        paletteFamilies: top(b.palette, 8),
        motionTechniques: top(b.motion, 8),
        hookTypes: top(b.hooks, 6),
        sectionIdeas: top(b.sections, 12),
      })),
    recommendedWorkflow: [
      "Pick 3-6 reels per client: one palette direction, one type/motion direction, one hook, one product-presentation idea.",
      "Rebuild motion and kinetic type with ONIA tokens; add a reduced-motion fallback. Never embed the reel's audio/music.",
      "Client lane: list which of the client's OWN clips can become hero/proof footage, and confirm rights before using them.",
      "Feed selected reel ideas into data/clients/<slug>.design.json (references) before generating the site.",
    ],
    reels: analyses.map((a) => ({
      id: a.id,
      lane: a.lane,
      rubro: a.rubro || "",
      handle: a.source?.handle || "",
      url: a.source?.url || "",
      frames: asArray(a.frames).slice(0, 12),
      contactSheet: a.contactSheet || "",
      paletteFamilies: [...new Set(asArray(a.palette).map((c) => hexToFamily(c.hex)).filter(Boolean))],
      pacing: a.motion?.pacing || "",
      hook: a.hook || {},
      showcasedSite: a.showcasedSite?.present
        ? {
            siteType: a.showcasedSite.siteType || "",
            url: a.showcasedSite.url || "",
            layout: a.showcasedSite.layout || "",
            sections: asArray(a.showcasedSite.sections).slice(0, 12),
            components: asArray(a.showcasedSite.components).slice(0, 12),
            interactions: asArray(a.showcasedSite.interactions).slice(0, 12),
            reuseForFactory: asArray(a.showcasedSite.reuseForFactory).slice(0, 12),
            captureQuality: a.showcasedSite.captureQuality || "not-shown",
          }
        : null,
      heroDirection: a.webIdeas?.heroDirection || "",
      sectionIdeas: asArray(a.webIdeas?.sectionIdeas).slice(0, 8),
      assetsToRequestOrReuse: asArray(a.webIdeas?.assetsToRequestOrReuse).slice(0, 8),
      confidence: a.confidence || "medium",
    })),
  };

  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
  await mkdir(path.dirname(markdownPath), { recursive: true });
  await writeFile(markdownPath, renderMarkdown(payload), "utf8");
  return payload;
}

function renderList(items) {
  return items.length ? items.map((i) => `- ${i.value}: ${i.count}`).join("\n") : "- (none yet)";
}

function renderMarkdown(payload) {
  const scope = payload.lane === "client" ? `client: ${payload.clientSlug}` : "trend bank";
  return `# Web Factory Reels Intelligence (${scope})

Generated: ${payload.generatedAt}

## Summary

- Reels analyzed: ${payload.summary.reels}
- Rubros: ${payload.summary.rubros}
- Reels that show a web page: ${payload.summary.sitesShown}
- Avg confidence (1-3): ${payload.summary.avgConfidence}

## Web Pages Shown In The Reels (main payload)

The design of the sites demonstrated inside the reels — rebuild with ONIA tokens.

Sections seen:

${renderList(payload.showcasedSites.sections)}

Components / patterns:

${renderList(payload.showcasedSites.components)}

Scroll / motion interactions:

${renderList(payload.showcasedSites.interactions)}

Site palette families:

${renderList(payload.showcasedSites.paletteFamilies)}

Reusable for the factory:

${renderList(payload.showcasedSites.reuseForFactory)}

## Reel Production Palette Families

${renderList(payload.globalSignals.paletteFamilies)}

## Motion Techniques

${renderList(payload.globalSignals.motionTechniques)}

## Hooks

${renderList(payload.globalSignals.hookTypes)}

## Shot Types

${renderList(payload.globalSignals.shots)}

## Mood

${renderList(payload.globalSignals.moods)}

## Section Ideas For Web

${renderList(payload.globalSignals.sectionIdeas)}

## By Rubro

${
  payload.byRubro.length
    ? payload.byRubro
        .map(
          (b) =>
            `### ${b.rubro} (${b.reels} reel${b.reels === 1 ? "" : "s"})\n\n` +
            `- Palette: ${b.paletteFamilies.map((x) => x.value).join(", ") || "-"}\n` +
            `- Motion: ${b.motionTechniques.map((x) => x.value).join(", ") || "-"}\n` +
            `- Hooks: ${b.hookTypes.map((x) => x.value).join(", ") || "-"}\n` +
            `- Section ideas: ${b.sectionIdeas.map((x) => x.value).join(", ") || "-"}`,
        )
        .join("\n\n")
    : "- (no rubros yet)"
}

## Use Rule

Inspiration for structure, palette, motion and hook — rebuilt with ONIA tokens.
Never reuse third-party reel footage, audio, music, copy or logos as client
assets. Client-owned footage may be reused only after the client confirms rights.
`;
}

async function main() {
  const payload = await buildReelsIntelligence({
    lane: argValue("--lane", "trend"),
    slug: argValue("--slug", ""),
    analysesDir: argValue("--analyses", ""),
    outPath: argValue("--out", ""),
    markdownPath: argValue("--markdown", ""),
    now: process.argv.includes("--stable-date") ? "1970-01-01T00:00:00.000Z" : undefined,
  });
  console.log(`wrote reels intelligence: ${payload.summary.reels} reel(s) / ${payload.summary.rubros} rubro(s)`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
