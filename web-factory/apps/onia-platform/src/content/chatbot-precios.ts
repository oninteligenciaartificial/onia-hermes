/**
 * Precios de lanzamiento propuestos (B6) — Sergio edita SOLO acá.
 *
 * ÚNICA fuente de verdad de los montos del chatbot: la página /chatbot,
 * el configurador y el resumen que se manda por WhatsApp leen de este
 * archivo. Ningún monto del chatbot vive hardcodeado en JSX.
 */

export const CHATBOT_BASE = {
  nombre: "Chatbot WhatsApp",
  mensual: 350,
  instalacion: 1000,
  incluye: [
    "Responde 24/7, también de madrugada y feriados",
    "Califica al cliente: separa el curioso del que quiere comprar",
    "Deriva a un humano cuando la conversación lo necesita",
    "Entrenado con la información real de tu negocio",
  ],
} as const;

export type AddonId = "recordatorios" | "agenda" | "cobrosQr" | "audios";

export interface ChatbotAddon {
  readonly id: AddonId;
  readonly nombre: string;
  readonly mensual: number;
  readonly detalle: string;
}

export const CHATBOT_ADDONS: readonly ChatbotAddon[] = [
  {
    id: "recordatorios",
    nombre: "Recordatorios",
    mensual: 100,
    detalle: "Recordatorios automáticos de citas y pagos",
  },
  {
    id: "agenda",
    nombre: "Agenda",
    mensual: 100,
    detalle: "Agenda y reserva de citas desde el chat",
  },
  {
    id: "cobrosQr",
    nombre: "Cobros con QR",
    mensual: 150,
    detalle: "Cobra con QR desde la conversación",
  },
  {
    id: "audios",
    nombre: "Notas de voz",
    mensual: 100,
    detalle: "Entiende las notas de voz de tus clientes",
  },
] as const;

export interface ChatbotPreset {
  readonly id: "n1" | "n2" | "n3";
  readonly nombre: string;
  readonly resultado: string;
  readonly addons: readonly AddonId[];
}

/** N1 = solo base · N2 = base + agenda · N3 = todo. */
export const CHATBOT_PRESETS: readonly ChatbotPreset[] = [
  {
    id: "n1",
    nombre: "Atender",
    resultado: "Nadie queda sin respuesta",
    addons: [],
  },
  {
    id: "n2",
    nombre: "Agendar",
    resultado: "El chat llena tu agenda solo",
    addons: ["recordatorios", "agenda"],
  },
  {
    id: "n3",
    nombre: "Cobrar",
    resultado: "De la conversación al pago",
    addons: ["recordatorios", "agenda", "cobrosQr", "audios"],
  },
] as const;
