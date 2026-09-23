import { z } from "zod";

export const jobStatus = z.enum([
  "waiting_approval", "approved_for_generation", "generating", "generated",
  "avatar_review_pending", "needs_revision", "approved_for_publish", "published",
]);

const liveCostQuoteSchema = z.object({
  source: z.literal("higgsfield_generate_cost"),
  input_hash: z.string().min(1),
  workspace_id: z.string().min(1),
  cli_version: z.string().min(1),
  model: z.string().min(1),
  model_schema_hash: z.string().min(1),
  params_hash: z.string().min(1),
  references_hash: z.string().min(1),
  quantity: z.number().int().positive(),
  quoted_credits: z.number().positive(),
  quoted_at: z.string().datetime(),
});

const generationApprovalSchema = z.object({
  approved_by: z.literal("Sergio Urcullo"),
  approved_at: z.string().datetime(),
  input_hash: z.string().min(1),
  quote_hash: z.string().regex(/^[a-f0-9]{64}$/),
  max_credits: z.number().positive(),
  max_quantity: z.number().int().positive(),
});

export const jobSchema = z.object({
  id: z.string().min(1),
  status: jobStatus,
  format: z.string().min(1),
  lane: z.enum(["cliente", "onia", "sergio"]),
  engine: z.string().default("higgsfield"),
  model: z.string().min(1),
  workspace_id: z.string().min(1).optional(),
  cli_version: z.string().min(1).optional(),
  model_schema_hash: z.string().min(1).optional(),
  params_hash: z.string().min(1).optional(),
  references_hash: z.string().min(1).optional(),
  quantity: z.number().int().positive().default(1),
  credits_estimated: z.number().nonnegative().optional(),
  credits_used: z.number().nonnegative().optional(),
  live_cost_quote: liveCostQuoteSchema.optional(),
  generation_approval: generationApprovalSchema.optional(),
  source_urls: z.array(z.string()).default([]),
  soul_id: z.string().optional(),
  identity_ok: z.boolean().default(false),
  input_hash: z.string().min(1),
  created_at: z.string().min(1),
  updated_at: z.string().min(1),
}).superRefine((job, ctx) => {
  const gatedStatuses = new Set([
    "approved_for_generation", "generating", "generated", "avatar_review_pending",
    "needs_revision", "approved_for_publish", "published",
  ]);
  if (!gatedStatuses.has(job.status)) return;

  for (const field of ["workspace_id", "cli_version", "model_schema_hash", "params_hash", "references_hash", "live_cost_quote", "generation_approval"]) {
    if (job[field] == null) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message: `${field} required for ${job.status}` });
    }
  }
  if (job.identity_ok !== true) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["identity_ok"], message: `identity_ok required for ${job.status}` });
  }
  const quote = job.live_cost_quote;
  const approval = job.generation_approval;
  const boundFields = ["input_hash", "workspace_id", "cli_version", "model", "model_schema_hash", "params_hash", "references_hash", "quantity"];
  for (const field of boundFields) {
    if (quote && quote[field] !== job[field]) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["live_cost_quote", field], message: `${field} must match job` });
    }
  }
  if (approval && approval.input_hash !== job.input_hash) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["generation_approval", "input_hash"], message: "input_hash must match job" });
  }
  if (approval && quote && approval.max_credits < quote.quoted_credits) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["generation_approval", "max_credits"], message: "max_credits below quote" });
  }
  if (approval && approval.max_quantity < job.quantity) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["generation_approval", "max_quantity"], message: "max_quantity below job quantity" });
  }
});

export function parseJob(input) {
  return jobSchema.parse(input);
}
