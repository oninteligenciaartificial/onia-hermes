import { z } from "zod";

export const laneSchema = z.object({
  id: z.enum(["cliente", "onia", "sergio"]),
  gate_before_generate: z.boolean(),
  require_approved_brief: z.boolean(),
  require_cost_estimate: z.boolean(),
  identity_gate: z.boolean(),
  publishable: z.boolean(),
});

export function parseLane(input) {
  return laneSchema.parse(input);
}
