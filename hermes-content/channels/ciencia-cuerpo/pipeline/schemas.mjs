import { z } from "zod";

export const sourceSchema = z.object({
  claim: z.string().min(1),
  source_title: z.string().min(1),
  source_url: z.string().url(),
  source_publisher: z.string().min(1),
  verified_date: z.string().min(1),
});

export const researchBriefSchema = z.object({
  topic_id: z.string().min(1),
  slug: z.string().min(1),
  title_working: z.string().min(1),
  angle_thesis: z.string().min(1),
  audience: z.string().min(1),
  ymyl_sensitive_topic: z.boolean(),
  sensitive_topic_tags: z.array(z.string()).default([]),
  key_claims: z.array(sourceSchema).min(1),
  risks: z.array(z.string()).default([]),
  what_we_dont_know_yet: z.array(z.string()).default([]),
  disclaimer_required: z.literal(true),
  fact_check: z.object({
    status: z.enum(["pending", "passed", "needs_revision"]),
    reviewed_by: z.string().default(""),
    notes: z.string().default(""),
  }),
});

export const shotSchema = z.object({
  n: z.number().int().positive(),
  script_ref: z.string().min(1),
  seconds: z.number().positive(),
  type: z.enum(["still_pan_zoom", "hero_clip", "diagram", "text_overlay"]),
  description: z.string().min(1),
  higgsfield_model: z.string().min(1),
  higgsfield_prompt: z.string().min(1),
  negative_prompt: z.string().min(1),
  estimated_credits: z.number().nonnegative(),
  reuse_from_library: z.boolean().default(false),
});

export const shotListSchema = z.object({
  topic_id: z.string().min(1),
  video_slug: z.string().min(1),
  style_guide: z.object({
    palette: z.string().min(1),
    line_style: z.string().min(1),
    reused_assets_ref: z.string().min(1),
  }),
  shots: z.array(shotSchema).min(1),
  totals: z.object({
    still_count: z.number().int().nonnegative(),
    hero_clip_count: z.number().int().nonnegative(),
    estimated_credits_total: z.number().nonnegative(),
  }),
});

export const metadataSchema = z.object({
  content_id: z.string().min(1),
  title_options: z.array(z.string()).min(1),
  title_final: z.string().default(""),
  description: z.string().min(1),
  disclaimer_text: z.string().min(1),
  sources_in_description: z
    .array(
      z.object({
        n: z.number().int().positive(),
        title: z.string().min(1),
        url: z.string().url(),
      }),
    )
    .min(1),
  tags: z.array(z.string()).default([]),
  thumbnail_brief: z.string().min(1),
  chapters: z
    .array(z.object({ time: z.string().min(1), label: z.string().min(1) }))
    .default([]),
  language: z.literal("es"),
  category: z.string().min(1),
  made_for_kids: z.literal(false),
  contains_synthetic_media: z.literal(true),
  privacy_status_initial: z.literal("private"),
  pinned_comment: z.string().default(""),
});

export function parseResearchBrief(input) {
  return researchBriefSchema.parse(input);
}

export function parseShotList(input) {
  return shotListSchema.parse(input);
}

export function parseMetadata(input) {
  return metadataSchema.parse(input);
}
