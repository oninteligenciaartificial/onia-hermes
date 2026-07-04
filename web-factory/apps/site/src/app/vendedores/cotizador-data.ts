// Catalogo de cotizacion ONIA — fuente: hermes-content/propuestas/ONIA_CATALOGO_PRECIOS_2026.md
// Precios de lanzamiento (fase sin portafolio). Ancla minima por componente.

export type QuoteKind = "oneoff" | "monthly";

export type QuoteCategory = "web" | "saas" | "setup" | "creative" | "addon";

// Modelo de comision de Arthur por tipo de componente.
export type CommissionModel =
  | { type: "web"; close: number; full: number } // toggle: cierre vs hace todo
  | { type: "saasMonthly"; firstMonth: number } // % del primer mes (una vez)
  | { type: "setup"; onboarded: number; sold: number } // onboardea vs solo vende
  | { type: "monthlyShare"; rate: number } // recurrente mientras produce/gestiona
  | { type: "oneoffShare"; rate: number } // pieza unica
  | { type: "none" };

export interface QuoteComponent {
  id: string;
  label: string;
  price: number; // Bs (piso de referencia)
  kind: QuoteKind;
  category: QuoteCategory;
  commission: CommissionModel;
  perSeat?: boolean; // ProveeGest: precio por asiento
  note?: string;
}

export interface QuoteGroup {
  id: QuoteCategory;
  title: string;
  hint: string;
  components: QuoteComponent[];
}

export const quoteGroups: QuoteGroup[] = [
  {
    id: "web",
    title: "Webs y automatizacion",
    hint: "Pago unico. Arthur cobra 15% si cierra y Sergio entrega, 50% si hace todo.",
    components: [
      { id: "landing", label: "Landing", price: 790, kind: "oneoff", category: "web", commission: { type: "web", close: 0.15, full: 0.5 } },
      { id: "web-pro", label: "Web Pro", price: 1500, kind: "oneoff", category: "web", commission: { type: "web", close: 0.15, full: 0.5 } },
      { id: "web-pro-onia", label: "Web Pro ONIA", price: 2900, kind: "oneoff", category: "web", commission: { type: "web", close: 0.15, full: 0.5 } },
      { id: "tienda", label: "Tienda con pago (BCP + carrito)", price: 2500, kind: "oneoff", category: "web", commission: { type: "web", close: 0.15, full: 0.5 } },
      { id: "n8n-simple", label: "Automatizacion n8n simple", price: 790, kind: "oneoff", category: "web", commission: { type: "web", close: 0.25, full: 0.5 } },
      { id: "n8n-flujo", label: "Flujo n8n (orden + WhatsApp)", price: 1200, kind: "oneoff", category: "web", commission: { type: "web", close: 0.25, full: 0.5 } },
    ],
  },
  {
    id: "saas",
    title: "SaaS / Core (recurrente)",
    hint: "Lo construye Sergio, la recurrencia es de ONIA. Arthur cobra 30% del primer mes.",
    components: [
      { id: "dentalgest-basico", label: "DentalGest Basico", price: 320, kind: "monthly", category: "saas", commission: { type: "saasMonthly", firstMonth: 0.3 } },
      { id: "dentalgest-pro", label: "DentalGest Profesional", price: 750, kind: "monthly", category: "saas", commission: { type: "saasMonthly", firstMonth: 0.3 } },
      { id: "dentalgest-clinica", label: "DentalGest Clinica", price: 1500, kind: "monthly", category: "saas", commission: { type: "saasMonthly", firstMonth: 0.3 } },
      { id: "gestios-basico", label: "GestiOS Basico", price: 350, kind: "monthly", category: "saas", commission: { type: "saasMonthly", firstMonth: 0.3 } },
      { id: "gestios-pro", label: "GestiOS Pro", price: 690, kind: "monthly", category: "saas", commission: { type: "saasMonthly", firstMonth: 0.3 } },
      { id: "gestios-empresarial", label: "GestiOS Empresarial", price: 1250, kind: "monthly", category: "saas", commission: { type: "saasMonthly", firstMonth: 0.3 } },
      { id: "proveegest", label: "ProveeGest B2B (por asiento, min. 5)", price: 150, kind: "monthly", category: "saas", perSeat: true, commission: { type: "saasMonthly", firstMonth: 0.3 }, note: "Cantidad = numero de asientos/vendedores." },
      { id: "ganadero-basico", label: "Ganadero OS Basico", price: 290, kind: "monthly", category: "saas", commission: { type: "saasMonthly", firstMonth: 0.3 } },
      { id: "ganadero-estancia", label: "Ganadero OS Estancia", price: 690, kind: "monthly", category: "saas", commission: { type: "saasMonthly", firstMonth: 0.3 } },
    ],
  },
  {
    id: "setup",
    title: "Setup / implementacion (una vez)",
    hint: "Arthur cobra 40% si el ejecuta el onboarding/carga de datos, 10% si solo vende.",
    components: [
      { id: "setup-dentalgest", label: "Setup DentalGest", price: 500, kind: "oneoff", category: "setup", commission: { type: "setup", onboarded: 0.4, sold: 0.1 } },
      { id: "setup-gestios", label: "Setup GestiOS", price: 690, kind: "oneoff", category: "setup", commission: { type: "setup", onboarded: 0.4, sold: 0.1 } },
      { id: "setup-b2b", label: "Setup B2B (ProveeGest)", price: 3500, kind: "oneoff", category: "setup", commission: { type: "setup", onboarded: 0.4, sold: 0.1 } },
      { id: "setup-ganadero", label: "Setup Ganadero OS", price: 690, kind: "oneoff", category: "setup", commission: { type: "setup", onboarded: 0.4, sold: 0.1 } },
    ],
  },
  {
    id: "creative",
    title: "Servicios de Arthur (creativo)",
    hint: "Lo ejecuta Arthur. Packs mensuales al 50% mientras produce.",
    components: [
      { id: "pack-basico", label: "Pack contenido mensual basico", price: 1500, kind: "monthly", category: "creative", commission: { type: "monthlyShare", rate: 0.5 } },
      { id: "pack-higgs", label: "Pack contenido + Higgsfield (8 videos)", price: 2200, kind: "monthly", category: "creative", commission: { type: "monthlyShare", rate: 0.5 } },
      { id: "pack-premium", label: "Pack contenido premium", price: 2900, kind: "monthly", category: "creative", commission: { type: "monthlyShare", rate: 0.5 } },
      { id: "video-ugc", label: "Video IA / UGC (por pieza)", price: 350, kind: "oneoff", category: "creative", commission: { type: "oneoffShare", rate: 0.5 } },
      { id: "gestion-redes", label: "Gestion de redes mensual", price: 690, kind: "monthly", category: "creative", commission: { type: "monthlyShare", rate: 0.15 } },
      { id: "capacitacion", label: "Capacitacion a equipo del cliente", price: 490, kind: "oneoff", category: "creative", commission: { type: "oneoffShare", rate: 0.3 } },
    ],
  },
  {
    id: "addon",
    title: "Add-ons",
    hint: "WhatsApp boton simple va incluido en la web. Terceros los paga el cliente.",
    components: [
      { id: "chatbot-setup", label: "Chatbot WhatsApp IA (setup)", price: 900, kind: "oneoff", category: "addon", commission: { type: "web", close: 0.15, full: 0.5 } },
      { id: "chatbot-mes", label: "Chatbot WhatsApp IA (mensual)", price: 80, kind: "monthly", category: "addon", commission: { type: "monthlyShare", rate: 0.1 } },
      { id: "pasarela", label: "Pasarela de pago (BCP)", price: 1900, kind: "oneoff", category: "addon", commission: { type: "web", close: 0.15, full: 0.5 } },
      { id: "ig-setup", label: "Conexion Instagram / TikTok (setup)", price: 900, kind: "oneoff", category: "addon", commission: { type: "web", close: 0.15, full: 0.5 } },
      { id: "ig-mes", label: "Instagram / TikTok (mensual)", price: 150, kind: "monthly", category: "addon", commission: { type: "monthlyShare", rate: 0.15 } },
      { id: "cuidado-web", label: "Cuidado Web (mensual)", price: 390, kind: "monthly", category: "addon", commission: { type: "monthlyShare", rate: 0.1 } },
      { id: "videos-ia", label: "Videos con IA (8/mes)", price: 2200, kind: "monthly", category: "creative", commission: { type: "monthlyShare", rate: 0.5 } },
    ],
  },
];

// Reglas del modelo (ver ONIA_ARRANQUE_ARTHUR_60_DIAS_20260703.md).
export const SKIM_RATE = 0.1; // recuperacion de capital, apartado del ingreso neto
export const FONDO_RATE = 0.4; // Fondo ONIA sobre la base (90%)

export const quoteRules: string[] = [
  "El catalogo es el PISO. Se sube por alcance, no se baja por regatear sin aprobacion de Sergio.",
  "Todo proyecto sale con un mensual pegado (Cuidado Web / SaaS / contenido).",
  "Terceros los paga el cliente: dominio, hosting, pasarela, IA, WhatsApp, pauta.",
  "Asesorias y consultorias no se cobran por ahora: auditoria y diagnostico son gancho gratis.",
  "Sergio aprueba precio final, descuentos y alcance antes de enviar.",
];
