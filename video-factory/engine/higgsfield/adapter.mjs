import { createHash } from "node:crypto";

const CREDIT_RATE = {
  marketing_studio_video: 8,
  seedance_2_0: 5,
  seedance_2_0_mini: 3,
  veo3_1_lite: 4,
  kling3_0: 9,
  // Snapshot histórico del prototipo; producción usa el cost vivo de la CLI.
  explainer_video: 6,
  higgsfield_preset: 5,
  clipify: 3,
  nano_banana: 2,
};

// Historical prototype estimates only. Never use this table as approval to spend.
// Production must attach a live `higgsfield generate cost` quote to the job.
export function estimateCost({ model, duration_s }) {
  const rate = CREDIT_RATE[model];
  if (rate == null) throw new Error(`estimateCost: modelo desconocido ${model}`);
  return Math.ceil(rate * duration_s);
}

const DEFAULT_QUOTE_TTL_MS = 60 * 60 * 1000;

export function quoteBindingHash(quote) {
  const bound = {
    source: quote?.source,
    input_hash: quote?.input_hash,
    workspace_id: quote?.workspace_id,
    cli_version: quote?.cli_version,
    model: quote?.model,
    model_schema_hash: quote?.model_schema_hash,
    params_hash: quote?.params_hash,
    references_hash: quote?.references_hash,
    quantity: quote?.quantity,
    quoted_credits: quote?.quoted_credits,
    quoted_at: quote?.quoted_at,
  };
  return createHash("sha256").update(JSON.stringify(bound)).digest("hex");
}

export function validateGenerationGate(job, { nowMs = Date.now(), quoteTtlMs = DEFAULT_QUOTE_TTL_MS } = {}) {
  const missing = [];
  const quote = job?.live_cost_quote;
  const approval = job?.generation_approval;
  const quotedAtMs = Date.parse(quote?.quoted_at ?? "");
  const approvedAtMs = Date.parse(approval?.approved_at ?? "");

  if (job?.status !== "approved_for_generation") missing.push("status");
  if (!job?.input_hash) missing.push("input_hash");
  if (!job?.workspace_id) missing.push("workspace_id");
  if (!job?.cli_version) missing.push("cli_version");
  if (!job?.model) missing.push("model");
  if (!job?.model_schema_hash) missing.push("model_schema_hash");
  if (!job?.params_hash) missing.push("params_hash");
  if (!job?.references_hash) missing.push("references_hash");
  if (!Number.isInteger(job?.quantity) || job.quantity <= 0) missing.push("quantity");
  if (job?.identity_ok !== true) missing.push("identity_ok");
  if (quote?.source !== "higgsfield_generate_cost") missing.push("live_cost_quote.source");
  if (!Number.isFinite(quote?.quoted_credits) || quote.quoted_credits <= 0) {
    missing.push("live_cost_quote.quoted_credits");
  }
  if (quote?.input_hash !== job?.input_hash) missing.push("live_cost_quote.input_hash");
  if (quote?.workspace_id !== job?.workspace_id) missing.push("live_cost_quote.workspace_id");
  if (quote?.cli_version !== job?.cli_version) missing.push("live_cost_quote.cli_version");
  if (quote?.model !== job?.model) missing.push("live_cost_quote.model");
  if (quote?.model_schema_hash !== job?.model_schema_hash) missing.push("live_cost_quote.model_schema_hash");
  if (quote?.params_hash !== job?.params_hash) missing.push("live_cost_quote.params_hash");
  if (quote?.references_hash !== job?.references_hash) missing.push("live_cost_quote.references_hash");
  if (quote?.quantity !== job?.quantity) missing.push("live_cost_quote.quantity");
  if (!Number.isFinite(quotedAtMs) || quotedAtMs > nowMs || nowMs - quotedAtMs > quoteTtlMs) {
    missing.push("live_cost_quote.quoted_at");
  }
  if (approval?.approved_by !== "Sergio Urcullo") missing.push("generation_approval.approved_by");
  if (!Number.isFinite(approvedAtMs) || approvedAtMs < quotedAtMs || approvedAtMs > nowMs) {
    missing.push("generation_approval.approved_at");
  }
  if (approval?.input_hash !== job?.input_hash) missing.push("generation_approval.input_hash");
  if (approval?.quote_hash !== quoteBindingHash(quote)) missing.push("generation_approval.quote_hash");
  if (!Number.isFinite(approval?.max_credits) || approval.max_credits < quote?.quoted_credits) {
    missing.push("generation_approval.max_credits");
  }
  if (!Number.isInteger(approval?.max_quantity) || approval.max_quantity < job?.quantity) {
    missing.push("generation_approval.max_quantity");
  }

  return { ok: missing.length === 0, missing: [...new Set(missing)] };
}

export function createHiggsfieldAdapter({ runtime, now = () => Date.now() } = {}) {
  return {
    estimateCost,
    async generate(job) {
      const gate = validateGenerationGate(job, { nowMs: now() });
      if (!gate.ok) return { ok: false, reason: "generation_gate_failed", missing: gate.missing };
      if (!runtime) return { ok: false, reason: "engine_runtime_required", job };
      return runtime.generate(job);
    },
    async getStatus(id) {
      if (!runtime) return { id, status: "unknown", reason: "engine_runtime_required" };
      return runtime.getStatus(id);
    },
  };
}
