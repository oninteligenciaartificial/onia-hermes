// Exact v1 contract mirror: ONIA Platform PR #170, base 65ae1326 + export delta.
// Keep canonical JSON field order for SHA-256; cross-repo demo tests verify parity.
import { z } from "zod";

const text = (max: number) => z.string().trim().max(max);
const revisionSchema = z.number().int().positive().max(Number.MAX_SAFE_INTEGER - 1);
const publicPhone = text(40).refine((value) => !value || (
  /^[+\d\s().-]+$/.test(value) && /^\d{7,15}$/.test(value.replace(/\D/g, ""))
), "Indicá un teléfono público válido, con entre 7 y 15 dígitos");

/** Sólo datos que el negocio autoriza publicar; nunca contacto del solicitante. */
export const businessSnapshotDataSchema = z.object({
  businessName: text(160).optional(),
  contact: z.object({
    email: text(254).refine((value) => !value || z.string().email().safeParse(value).success, "Indicá un correo público válido").optional(),
    phone: publicPhone.optional(),
    whatsapp: publicPhone.optional(),
    address: text(500).optional(),
  }).strict().optional(),
  services: z.array(z.object({ title: text(160), description: text(2000) }).strict()).max(50).optional(),
  hours: text(2000).optional(),
}).strict();
export type BusinessSnapshotData = z.infer<typeof businessSnapshotDataSchema>;

const metadata = {
  version: z.literal(1),
  organizationId: z.string().min(1),
  revision: revisionSchema,
  editedByProfileId: z.string().min(1),
  updatedAt: z.string().datetime({ offset: true }),
  data: businessSnapshotDataSchema,
};
const confirmationSchema = z.object({
  revision: revisionSchema,
  contentHash: z.string().regex(/^[a-f0-9]{64}$/),
  confirmedByProfileId: z.string().min(1),
  confirmedAt: z.string().datetime({ offset: true }),
}).strict();

/** Para JSON de persistencia confiable, NO para aceptar metadatos del cliente. */
export const businessSnapshotSchema = z.discriminatedUnion("status", [
  z.object({ ...metadata, status: z.literal("DRAFT"), confirmation: z.null() }).strict(),
  z.object({ ...metadata, status: z.literal("CONFIRMED"), confirmation: confirmationSchema }).strict(),
]);
export type BusinessSnapshot = z.infer<typeof businessSnapshotSchema>;
export function missingBusinessSnapshotInputs(input: unknown): string[] {
  const data = businessSnapshotDataSchema.parse(input);
  const missing: string[] = [];
  if (!data.businessName) missing.push("Nombre público del negocio");
  if (!data.contact?.email && !data.contact?.phone && !data.contact?.whatsapp) missing.push("Contacto público: correo, teléfono o WhatsApp");
  if (!data.services?.length) missing.push("Servicios con título y descripción");
  data.services?.forEach((service, index) => {
    if (!service.title) missing.push(`Título del servicio ${index + 1}`);
    if (!service.description) missing.push(`Descripción del servicio ${index + 1}`);
  });
  if (!data.hours) missing.push("Horarios de atención confirmados");
  return missing;
}

/** Versioned server export; integrity hash is not an authentication mechanism. */
export const businessSnapshotExportSchema = z.object({
  packageVersion: z.literal(1),
  organizationId: z.string().min(1),
  requestId: z.string().min(1),
  revision: revisionSchema,
  contentHash: z.string().regex(/^[a-f0-9]{64}$/),
  snapshot: businessSnapshotSchema,
}).strict();
export type BusinessSnapshotExport = z.infer<typeof businessSnapshotExportSchema>;
