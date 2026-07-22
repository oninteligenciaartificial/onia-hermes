import { readFile } from "node:fs/promises";
import { z } from "zod";

/**
 * Reels Intelligence schema.
 *
 * A "reel analysis" is the evidence-backed read of ONE Instagram/TikTok reel,
 * turned into web-design decisions. Two lanes share the same shape:
 *
 *  - lane "trend"  -> mine top reels by rubro to grow the pattern bank taste.
 *  - lane "client" -> read the client's OWN reels to extract their real brand
 *    (palette, footage, voice) so their site uses real assets, not fabricated proof.
 *
 * Boundary (same rule as WEB_FACTORY_REFERENCE_CAPTURE_RUNBOOK.md):
 *  - Trend reels are INSPIRATION ONLY. Never reuse their audio, footage, copy,
 *    logos or music as client assets.
 *  - Client reels: the client owns their footage, so real product/lifestyle
 *    clips CAN become client assets, but only after the client confirms rights.
 */

const isoDate = z.string().min(1);

const paletteColorSchema = z.object({
  /** bg | surface | accent | secondary | text | detail ... */
  role: z.string().min(1),
  hex: z
    .string()
    .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Use a hex color like #0f766e."),
  note: z.string().default(""),
});

const hookSchema = z.object({
  /** question | bold-claim | result-first | pattern-interrupt | problem | none */
  type: z.string().default("none"),
  /** literal on-screen / spoken hook seen in the first ~3s */
  text: z.string().default(""),
});

const typographySchema = z.object({
  /** free description, e.g. "condensed grotesk, ALL CAPS, tight tracking" */
  style: z.string().default(""),
  cases: z.array(z.string()).default([]),
  /** literal text overlays read from the frames (the brand's real voice) */
  onScreenText: z.array(z.string()).default([]),
});

const motionSchema = z.object({
  pacing: z.enum(["slow", "medium", "fast", "frenetic"]).default("medium"),
  /** hard-cut | whip-pan | match-cut | zoom-punch | crossfade | speed-ramp ... */
  transitions: z.array(z.string()).default([]),
  /** kinetic-typography | product-spin | before-after | pov | unboxing ... */
  techniques: z.array(z.string()).default([]),
});

/** The actionable bridge: how this reel becomes a better web. */
const webIdeasSchema = z.object({
  heroDirection: z.string().default(""),
  sectionIdeas: z.array(z.string()).default([]),
  /** motion patterns to REBUILD with ONIA tokens, reduced-motion aware */
  motionForWeb: z.array(z.string()).default([]),
  /**
   * Real footage/photos from the reel usable as a client asset (client lane only,
   * after rights confirmed). For trend lane keep this empty or "study only".
   */
  assetsToRequestOrReuse: z.array(z.string()).default([]),
  copyAngles: z.array(z.string()).default([]),
});

const sourceSchema = z.object({
  /** original reel URL — kept as evidence, never as a reuse license */
  url: z.string().default(""),
  handle: z.string().default(""),
  /** relative path to the local .mp4 inside the repo, or "" if frames-only */
  localVideo: z.string().default(""),
  /** sha-256 of the local video for integrity, or "" */
  sha256: z.string().default(""),
  capturedAt: isoDate,
  durationSec: z.number().nonnegative().optional(),
});

/**
 * THE WEB PAGE SHOWN INSIDE THE VIDEO — the primary payload when a reel is a
 * website showcase (agency portfolio reel, "I built this site" reel, POV design
 * reel). This is the design of the SITE being demonstrated, kept separate from
 * the reel's own production style (which lives in the top-level palette/motion).
 */
const showcasedSiteSchema = z.object({
  /** does the reel actually show a website/app on screen? */
  present: z.boolean().default(false),
  /** rubro/type of the SHOWN site (real-estate, food-cpg, agency, saas...) */
  siteType: z.string().default(""),
  /** the site's URL if it is visible on screen or in the caption, else "" */
  url: z.string().default(""),
  /** overall layout/structure of the shown page */
  layout: z.string().default(""),
  /** sections visible in the shown site: hero, gallery, pricing, footer... */
  sections: z.array(z.string()).default([]),
  /** the SITE's palette (distinct from the reel's production palette) */
  palette: z.array(paletteColorSchema).default([]),
  /** the site's typography treatment */
  typography: z.string().default(""),
  /** notable UI components/patterns: bento, sticky nav, cards, mega-menu... */
  components: z.array(z.string()).default([]),
  /** scroll/motion interactions shown: scrollytelling, parallax, hover-reveal, pinned-hero... */
  interactions: z.array(z.string()).default([]),
  /** concrete ideas from the shown site to rebuild with ONIA tokens */
  reuseForFactory: z.array(z.string()).default([]),
  /** "clear" if the site was clearly visible, "partial"/"not-shown" otherwise */
  captureQuality: z.enum(["clear", "partial", "not-shown"]).default("not-shown"),
});

export const reelAnalysisSchema = z.object({
  id: z.string().min(1),
  lane: z.enum(["trend", "client"]),
  clientSlug: z.string().default(""),
  /** business type used to route ideas into the pattern bank (beauty, food, agency...) */
  rubro: z.string().default(""),
  source: sourceSchema,
  caption: z.string().default(""),
  /** relative paths to extracted keyframes and/or the contact-sheet montage */
  frames: z.array(z.string()).default([]),

  // ---- extracted design signals (filled by the Claude-side vision pass) ----
  palette: z.array(paletteColorSchema).default([]),
  typography: typographySchema.default({}),
  motion: motionSchema.default({}),
  /** product-macro | hands-application | lifestyle | talking-head | b-roll ... */
  shots: z.array(z.string()).default([]),
  productPresentation: z.string().default(""),
  hook: hookSchema.default({}),
  /** aesthetic keywords: editorial | warm | clinical | premium | playful ... */
  mood: z.array(z.string()).default([]),

  /** THE WEB PAGE SHOWN IN THE VIDEO — the main thing to grab from showcase reels */
  showcasedSite: showcasedSiteSchema.default({}),

  webIdeas: webIdeasSchema.default({}),
  /** reminders: don't reuse third-party audio, don't fake proof, respect reduced motion */
  guardrails: z.array(z.string()).default([]),
  confidence: z.enum(["low", "medium", "high"]).default("medium"),
});

export type ReelAnalysis = z.infer<typeof reelAnalysisSchema>;

/** A concrete, copy-pasteable shape for the analysis step to fill in. */
export const REEL_ANALYSIS_TEMPLATE: ReelAnalysis = {
  id: "",
  lane: "trend",
  clientSlug: "",
  rubro: "",
  source: { url: "", handle: "", localVideo: "", sha256: "", capturedAt: "" },
  caption: "",
  frames: [],
  palette: [],
  typography: { style: "", cases: [], onScreenText: [] },
  motion: { pacing: "medium", transitions: [], techniques: [] },
  shots: [],
  productPresentation: "",
  hook: { type: "none", text: "" },
  mood: [],
  showcasedSite: {
    present: false,
    siteType: "",
    url: "",
    layout: "",
    sections: [],
    palette: [],
    typography: "",
    components: [],
    interactions: [],
    reuseForFactory: [],
    captureQuality: "not-shown",
  },
  webIdeas: {
    heroDirection: "",
    sectionIdeas: [],
    motionForWeb: [],
    assetsToRequestOrReuse: [],
    copyAngles: [],
  },
  guardrails: [],
  confidence: "medium",
};

export function parseReelAnalysis(value: unknown): ReelAnalysis {
  return reelAnalysisSchema.parse(value);
}

export async function loadReelAnalysis(filePath: string): Promise<ReelAnalysis> {
  const raw = JSON.parse(await readFile(filePath, "utf8"));
  return parseReelAnalysis(raw);
}
