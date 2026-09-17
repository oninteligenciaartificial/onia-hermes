import type { WebPreviewCard } from "./web-configurator";

export type AssetPermission = "propias" | "generar-ia" | "stock" | "pendiente";

export interface WebIntakeDraft {
  readonly contactName: string;
  readonly businessName: string;
  readonly industry: string;
  readonly offer: string;
  readonly description: string;
  readonly services: string;
  readonly city: string;
  readonly whatsapp: string;
  readonly email: string;
  readonly referenceUrl: string;
  readonly assetPermission: AssetPermission;
  readonly notes: string;
}

export const EMPTY_WEB_INTAKE: WebIntakeDraft = {
  contactName: "",
  businessName: "",
  industry: "",
  offer: "",
  description: "",
  services: "",
  city: "",
  whatsapp: "",
  email: "",
  referenceUrl: "",
  assetPermission: "pendiente",
  notes: "",
};

export const REQUIRED_WEB_INTAKE_FIELDS: ReadonlyArray<{
  readonly key: keyof WebIntakeDraft;
  readonly label: string;
}> = [
  { key: "contactName", label: "tu nombre" },
  { key: "businessName", label: "nombre del negocio" },
  { key: "industry", label: "rubro" },
  { key: "offer", label: "oferta principal" },
  { key: "whatsapp", label: "WhatsApp" },
] as const;

export function getMissingWebIntakeFields(value: WebIntakeDraft): string[] {
  return REQUIRED_WEB_INTAKE_FIELDS
    .filter((field) => !value[field.key].trim())
    .map((field) => field.label);
}

export function intakeCards(services: string): WebPreviewCard[] {
  return services
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3)
    .map((title, index) => ({
      eyebrow: `${String(index + 1).padStart(2, "0")} / Tu oferta`,
      title,
      detail: "Conocé más",
    }));
}

export const ASSET_PERMISSION_LABELS: Record<AssetPermission, string> = {
  propias: "Tengo fotos propias y permiso para usarlas",
  "generar-ia": "Quiero que ONIA proponga imágenes con IA",
  stock: "Prefiero fotografías de stock con licencia",
  pendiente: "Todavía no lo decidí",
};
