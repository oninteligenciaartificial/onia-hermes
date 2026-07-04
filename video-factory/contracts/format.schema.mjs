import { z } from "zod";

export const shotSchema = z.object({
  n: z.number().int().positive(),
  description: z.string().min(1),
  seconds: z.number().positive().optional(),
});

export const formatSchema = z.object({
  id: z.string().min(1),
  engine: z.literal("higgsfield").default("higgsfield"),
  engine_model: z.string().min(1),
  aspect_ratio: z.enum(["9:16", "16:9", "1:1", "4:3", "3:4", "auto"]),
  duration_s: z.number().positive(),
  lane: z.enum(["cliente", "onia", "sergio"]),
  shots: z.array(shotSchema).min(1),
  hook: z.string().optional(),
  negative_prompt: z.string().min(1),
  requires_gate: z.array(z.enum(["brief", "cost", "identity", "review"])).default([]),
  generate_audio: z.boolean().default(false),
});

export function parseFormat(input) {
  return formatSchema.parse(input);
}
