import { z } from "zod";

export const jobStatus = z.enum([
  "waiting_approval", "approved_for_generation", "generating", "generated",
  "avatar_review_pending", "needs_revision", "approved_for_publish", "published",
]);

export const jobSchema = z.object({
  id: z.string().min(1),
  status: jobStatus,
  format: z.string().min(1),
  lane: z.enum(["cliente", "onia", "sergio"]),
  engine: z.string().default("higgsfield"),
  model: z.string().min(1),
  credits_estimated: z.number().nonnegative().optional(),
  credits_used: z.number().nonnegative().optional(),
  source_urls: z.array(z.string()).default([]),
  soul_id: z.string().optional(),
  identity_ok: z.boolean().default(false),
  input_hash: z.string().min(1),
  created_at: z.string().min(1),
  updated_at: z.string().min(1),
});

export function parseJob(input) {
  return jobSchema.parse(input);
}
