import { z } from "zod";

export const intakeSchema = z.object({
  slug: z.string().min(1),
  lane: z.enum(["cliente", "onia", "sergio"]),
  format: z.string().min(1),
  negocio: z.string().optional(),
  oferta: z.string().optional(),
  tema: z.string().optional(),
  objetivo: z.string().optional(),
  refs: z.array(z.string()).default([]),
  consent: z.boolean().default(false),
});

export function parseIntake(input) {
  return intakeSchema.parse(input);
}
