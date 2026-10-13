import { createHash } from "node:crypto";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { z } from "zod";
import { businessSnapshotExportSchema, missingBusinessSnapshotInputs } from "../data/platform-business-snapshot-contract";
import { buildClientProfileFromIntake } from "../data/intake-schema";
import { generateSite } from "./generate";

/** Independently supplied by a trusted operator/server, NEVER from the packet.
 * No live service binding exists: this module accepts offline trusted exports only.
 * SHA-256 proves integrity, not identity or permission to publish. */
const processingContextSchema = z.object({
  organizationId: z.string().min(1),
  requestId: z.string().min(1),
  expectedRevision: z.number().int().positive().max(Number.MAX_SAFE_INTEGER - 1),
  project: z.object({
    slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    template: z.literal("landing-clinic"),
    industry: z.literal("dental"),
  }).strict(),
}).strict();
export type SnapshotProcessingContext = z.infer<typeof processingContextSchema>;

/** Pure validation/mapping: fails before filesystem effects. Complete replacement,
 * with no seed/intake merge, assets, inferred WhatsApp, business claims or prices. */
export function profileFromBusinessSnapshot(packet: unknown, trustedContext: SnapshotProcessingContext) {
  const context = processingContextSchema.parse(trustedContext);
  const envelope = businessSnapshotExportSchema.parse(packet);
  const snapshot = envelope.snapshot;
  if (envelope.organizationId !== context.organizationId || snapshot.organizationId !== context.organizationId ||
      envelope.requestId !== context.requestId || envelope.revision !== context.expectedRevision ||
      snapshot.revision !== context.expectedRevision) throw new Error("Snapshot processing context mismatch");
  if (snapshot.status !== "CONFIRMED" || snapshot.confirmation.revision !== snapshot.revision) {
    throw new Error("Current confirmed receipt required");
  }
  const digest = createHash("sha256").update(JSON.stringify(snapshot.data)).digest("hex");
  if (digest !== envelope.contentHash || digest !== snapshot.confirmation.contentHash) throw new Error("Snapshot integrity mismatch");
  const missing = missingBusinessSnapshotInputs(snapshot.data);
  if (missing.length) throw new Error(`Missing public data: ${missing.join("; ")}`);
  const data = snapshot.data;
  return buildClientProfileFromIntake({
    project: { slug: context.project.slug, template: context.project.template },
    business: {
      name: data.businessName!, industry: context.project.industry,
      offer: data.services!.map((service) => service.title).join("; "),
      description: data.services!.map((service) => service.description).join("\n"),
      hours: data.hours!,
    },
    contact: { ...data.contact },
    content: { services: data.services!.map((service) => ({ ...service })) },
  });
}

/** Local data preview through the existing HTML engine. Output root is chosen by
 * the operator, not the packet. Fresh private input root cannot reuse clinic seeds.
 * NOT AI/design generation, artifact approval, live intake or publication. */
export async function previewBusinessSnapshot(packet: unknown, trustedContext: SnapshotProcessingContext, outputRoot: string) {
  const profile = profileFromBusinessSnapshot(packet, trustedContext);
  const context = processingContextSchema.parse(trustedContext);
  const scope = createHash("sha256").update(JSON.stringify([context.organizationId, context.requestId, context.expectedRevision])).digest("hex");
  const rootDir = await mkdtemp(path.join(tmpdir(), "onia-snapshot-preview-"));
  try {
    const clients = path.join(rootDir, "data", "clients");
    await mkdir(clients, { recursive: true });
    await writeFile(path.join(clients, `${profile.slug}.json`), JSON.stringify(profile), "utf8");
    return await generateSite(profile.slug, { rootDir, outDir: path.join(outputRoot, scope), template: context.project.template });
  } finally {
    await rm(rootDir, { recursive: true, force: true });
  }
}
