import { readFile } from "node:fs/promises";
import { z } from "zod";

/**
 * Web Model (a.k.a. learned blueprint).
 *
 * This is the KNOWLEDGE the web factory acquires from a reel: the design of the
 * web page shown inside the video, captured as a generation-ready blueprint the
 * factory can build FROM — not just a description.
 *
 * Flow:  reel video  ->  watch + understand (ANALYZE.md -> showcasedSite)
 *        showcasedSite  ->  acquire the model (ACQUIRE.md -> this schema)
 *        web-model  ->  build-web-models.mjs -> learned-models catalog
 *        catalog  ->  design:auto / generate seed a new client site from a model
 *
 * A web-model maps the shown design onto the factory's own vocabulary (blocks,
 * tokens, section order) so a matching site can be generated fast and faithfully,
 * then rebuilt with ONIA tokens and QA'd. It is inspiration turned into a
 * reusable recipe — never a copy of third-party code or assets.
 */

const paletteTokenSchema = z.object({
  /** bg | surface | accent | secondary | text | detail | on-dark ... */
  role: z.string().min(1),
  hex: z
    .string()
    .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Use a hex color like #0f766e."),
  note: z.string().default(""),
});

const designTokensSchema = z.object({
  palette: z.array(paletteTokenSchema).default([]),
  typography: z
    .object({
      /** display face vibe, e.g. "elegant serif", "condensed grotesk" */
      display: z.string().default(""),
      /** body face vibe, e.g. "clean sans" */
      body: z.string().default(""),
      /** treatment, e.g. "uppercase kinetic", "tight tracking", "editorial" */
      treatment: z.string().default(""),
    })
    .default({}),
  /** corner language of the UI */
  radius: z.enum(["sharp", "rounded", "pill", "mixed"]).default("rounded"),
  density: z.enum(["airy", "balanced", "dense"]).default("balanced"),
  /** 1 = static, 5 = highly kinetic */
  motionLevel: z.number().int().min(1).max(5).default(3),
});

/**
 * Precise, reproducible motion for a section — the thing that makes these sites
 * feel professional. Captured as data, not adjectives, so the factory can rebuild
 * it exactly (with motion/react) instead of guessing "motionLevel: 4".
 */
const motionSpecSchema = z.object({
  /** what enters and how: "clip-path wipe up + slow zoom", "staggered fade-up", "type slam", "none" */
  entrance: z.string().default("none"),
  /** when it fires */
  trigger: z.enum(["on-load", "in-view", "scroll-linked", "none"]).default("in-view"),
  /** cubic-bezier or named easing; the factory's editorial ease is [0.22, 1, 0.36, 1] */
  easing: z.string().default("[0.22, 1, 0.36, 1]"),
  durationSec: z.number().nonnegative().default(0.7),
  /** delay between staggered children, 0 = none */
  staggerSec: z.number().nonnegative().default(0),
  /** scroll-linked behavior (parallax, pin, progress reveal), empty = none */
  scrollLinked: z.string().default(""),
  /** hover micro-interaction, empty = none */
  hover: z.string().default(""),
  /** REQUIRED fallback under prefers-reduced-motion */
  reducedMotion: z.string().default("render final state, no transform"),
});

/** One section of the shown page, mapped to a factory block. */
const modelSectionSchema = z.object({
  order: z.number().int().nonnegative(),
  /** the job this section does: hero | trust | offer | proof | process | catalog | objection | conversion | final-cta | footer */
  job: z.string().min(1),
  /**
   * factory block to build it with (existing or to-add), e.g.:
   * media-hero | split-hero | product-vitrine | bento-grid | property-cards |
   * logo-wall | value-band | inline-quote-form | stat-strip | scroll-story ...
   */
  block: z.string().min(1),
  /** split | full-bleed | grid | alternating | pinned | list ... */
  layout: z.string().default(""),
  /** content slots this block needs: headline, sub, cta, media, price, form ... */
  content: z.array(z.string()).default([]),
  /** precise motion for this section — how it enters/behaves */
  motion: motionSpecSchema.default({}),
  notes: z.string().default(""),
});

const interactionSchema = z.object({
  pattern: z.string().min(1),
  /** what happens under prefers-reduced-motion — REQUIRED by the factory */
  reducedMotionFallback: z.string().default("render static"),
});

export const webModelSchema = z.object({
  id: z.string().min(1),
  /** the reel this model was learned from */
  sourceReel: z.string().default(""),
  /** brand / site name shown, e.g. "Le Cercle" */
  name: z.string().default(""),
  /** rubro of the shown site: real-estate | ecommerce-food | agency | saas ... */
  siteType: z.string().default(""),
  sourceUrl: z.string().default(""),
  /** one line: what this web is and when to reach for it */
  summary: z.string().default(""),

  designTokens: designTokensSchema.default({}),
  /** ordered section-by-section blueprint, mapped to factory blocks */
  sections: z.array(modelSectionSchema).default([]),
  components: z.array(z.string()).default([]),
  interactions: z.array(interactionSchema).default([]),

  /** concrete steps to rebuild this with ONIA tokens/blocks */
  buildWithOnia: z.array(z.string()).default([]),
  /** real assets the client must supply (no fabricated proof) */
  assetsNeeded: z.array(z.string()).default([]),
  /** which client rubros this model is a good starting point for */
  bestFor: z.array(z.string()).default([]),
  confidence: z.enum(["low", "medium", "high"]).default("medium"),
});

export type WebModel = z.infer<typeof webModelSchema>;

export function parseWebModel(value: unknown): WebModel {
  return webModelSchema.parse(value);
}

export async function loadWebModel(filePath: string): Promise<WebModel> {
  return parseWebModel(JSON.parse(await readFile(filePath, "utf8")));
}
