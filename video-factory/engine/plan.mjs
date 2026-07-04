import { createHash } from "node:crypto";
import { mapModel } from "./higgsfield/model-map.mjs";
import { estimateCost } from "./higgsfield/adapter.mjs";

export function inputHash(intake) {
  const json = JSON.stringify({
    slug: intake.slug, format: intake.format, lane: intake.lane,
    tema: intake.tema ?? null, oferta: intake.oferta ?? null,
  });
  return createHash("sha256").update(json).digest("hex").slice(0, 16);
}

export function buildPlan(intake, format, lane) {
  if (format.lane !== intake.lane) {
    throw new Error(`buildPlan: formato ${format.id} es lane ${format.lane}, intake pide ${intake.lane}`);
  }
  const { model, params } = mapModel(format);
  const credits_estimated = estimateCost({ model, duration_s: format.duration_s });
  return {
    slug: intake.slug,
    format: format.id,
    lane: lane.id,
    model,
    params,
    credits_estimated,
    requires_gate: format.requires_gate,
    gate_before_generate: lane.gate_before_generate,
    input_hash: inputHash(intake),
  };
}
