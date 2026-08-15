// Catalogo de cotizacion Onia — fuente: Kit Comercial Interno (vendedora) + ONIA_CATALOGO_PRECIOS_2026.md
// Comision = porcentaje fijo del PRIMER PAGO (una sola vez). Los pagos siguientes son de Onia.

export type QuoteKind = "oneoff" | "monthly";

export type QuoteCategory = "saas" | "onboarding" | "web" | "care" | "automation" | "custom" | "addon";

export interface QuoteComponent {
  id: string;
  label: string;
  price: number; // Bs (precio cliente, piso de referencia)
  kind: QuoteKind;
  category: QuoteCategory;
  commissionRate: number; // % del primer pago para la vendedora
  perSeat?: boolean;
  needsApproval?: boolean; // WhatsApp/Meta u otros: requiere validacion antes de prometer
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
    id: "saas",
    title: "SaaS (Onia Dental / Onia Comercio)",
    hint: "Recurrente de Onia. Comision de la vendedora: 35% del primer mes, una vez.",
    components: [
      { id: "dentalgest-basico", label: "Onia Dental Basico", price: 320, kind: "monthly", category: "saas", commissionRate: 0.35 },
      { id: "dentalgest-pro", label: "Onia Dental Profesional", price: 750, kind: "monthly", category: "saas", commissionRate: 0.35 },
      { id: "dentalgest-clinica", label: "Onia Dental Clinica", price: 1500, kind: "monthly", category: "saas", commissionRate: 0.35 },
      { id: "gestios-basico", label: "Onia Comercio Basico", price: 350, kind: "monthly", category: "saas", commissionRate: 0.35 },
      { id: "gestios-crecer", label: "Onia Comercio Crecer", price: 530, kind: "monthly", category: "saas", commissionRate: 0.35 },
      { id: "gestios-pro", label: "Onia Comercio Pro", price: 800, kind: "monthly", category: "saas", commissionRate: 0.35 },
      { id: "gestios-empresarial", label: "Onia Comercio Empresarial", price: 1250, kind: "monthly", category: "saas", commissionRate: 0.35 },
    ],
  },
  {
    id: "onboarding",
    title: "Onboarding / setup SaaS",
    hint: "Configuracion, migracion ligera y capacitacion. Comision 10%.",
    components: [
      { id: "onboarding-dental", label: "Onboarding Onia Dental (290 / 690 / 1.490 segun alcance)", price: 690, kind: "oneoff", category: "onboarding", commissionRate: 0.1, note: "Elegi el precio segun alcance: 290 basico, 690 medio, 1.490 completo." },
    ],
  },
  {
    id: "web",
    title: "Paginas web y captacion",
    hint: "Pago unico. Comision: Landing 10%, Web Profesional y Web Pro Onia 12%.",
    components: [
      { id: "landing", label: "Landing de Captacion", price: 790, kind: "oneoff", category: "web", commissionRate: 0.1 },
      { id: "web-profesional", label: "Web Profesional", price: 1500, kind: "oneoff", category: "web", commissionRate: 0.12 },
      { id: "web-pro-onia", label: "Web Pro Onia", price: 2900, kind: "oneoff", category: "web", commissionRate: 0.12 },
    ],
  },
  {
    id: "care",
    title: "Cuidado Web (mensual)",
    hint: "Mantenimiento vendido aparte. Comision 10% del primer mes.",
    components: [
      { id: "cuidado-basico", label: "Cuidado Web Basico", price: 190, kind: "monthly", category: "care", commissionRate: 0.1 },
      { id: "cuidado-crecimiento", label: "Cuidado Web Crecimiento", price: 390, kind: "monthly", category: "care", commissionRate: 0.1 },
      { id: "cuidado-pro", label: "Cuidado Web Pro", price: 690, kind: "monthly", category: "care", commissionRate: 0.1 },
    ],
  },
  {
    id: "automation",
    title: "Automatizaciones y bots",
    hint: "Setup unico. Comision 10%. WhatsApp requiere validacion Meta.",
    components: [
      { id: "n8n-simple", label: "Automatizacion simple n8n", price: 790, kind: "oneoff", category: "automation", commissionRate: 0.1 },
      { id: "n8n-flujo", label: "Flujo de aprobacion n8n", price: 1200, kind: "oneoff", category: "automation", commissionRate: 0.1 },
      { id: "bot-recordatorios", label: "Bot Telegram recordatorios", price: 690, kind: "oneoff", category: "automation", commissionRate: 0.1 },
      { id: "bot-operativo", label: "Bot Telegram operativo", price: 790, kind: "oneoff", category: "automation", commissionRate: 0.1 },
      { id: "bot-avanzado", label: "Bot Telegram avanzado", price: 1200, kind: "oneoff", category: "automation", commissionRate: 0.1 },
      { id: "chatbot-whatsapp", label: "Chatbot WhatsApp conversacional (+ Meta)", price: 990, kind: "oneoff", category: "automation", commissionRate: 0.1, needsApproval: true, note: "Desde 990 setup + costos Meta. Requiere validacion tecnica antes de prometer." },
    ],
  },
  {
    id: "custom",
    title: "Servicios a medida",
    hint: "Requiere alcance escrito antes de dar precio. Comision 10%.",
    components: [
      { id: "portal-mini", label: "Portal o mini sistema (login, dashboard, BD)", price: 6500, kind: "oneoff", category: "custom", commissionRate: 0.1, note: "Desde 6.500. Cotizar por alcance real." },
    ],
  },
  {
    id: "addon",
    title: "Add-ons",
    hint: "Se venden despues del primer cierre. Terceros los paga el cliente.",
    components: [
      // Precio ratificado 2026-08-15. Fuente de verdad: onia-platform/lib/pricing.ts
      // (WHATSAPP_ADDON) — es el unico archivo que cobra de verdad. Antes vivia aca un
      // 650 inst. + 350/mes que se habia retirado y quedo cotizable durante semanas, en
      // una pagina publica sin auth ni noindex.
      { id: "wa-chatbot-setup", label: "Chatbot WhatsApp con IA (instalacion)", price: 1500, kind: "oneoff", category: "addon", commissionRate: 0.1, needsApproval: true, note: "Bs 1.500 inst. + Bs 1.490/mes. Incluye 500 conversaciones/mes; el excedente de Meta va al costo." },
      { id: "wa-chatbot-mes", label: "Chatbot WhatsApp con IA (mensual)", price: 1490, kind: "monthly", category: "addon", commissionRate: 0, needsApproval: true },
      { id: "wa-chatbot-medida", label: "Chatbot a medida (integracion o flujo propio)", price: 0, kind: "oneoff", category: "addon", commissionRate: 0.1, needsApproval: true, note: "No se cotiza de lista: se define el alcance con el cliente y recien ahi se pone precio." },
      { id: "agenda-publica", label: "Agenda publica Onia Dental", price: 150, kind: "monthly", category: "addon", commissionRate: 0.1 },
      { id: "usuario-extra", label: "Usuario extra Onia Dental", price: 70, kind: "monthly", category: "addon", commissionRate: 0.1 },
      { id: "insumos-dental", label: "Insumos Onia Dental", price: 80, kind: "monthly", category: "addon", commissionRate: 0.1 },
      { id: "wa-gestios", label: "WhatsApp Onia Comercio (+ excedentes)", price: 280, kind: "monthly", category: "addon", commissionRate: 0.1, needsApproval: true },
      { id: "qr-gestios", label: "QR / cobro Onia Comercio", price: 105, kind: "monthly", category: "addon", commissionRate: 0.1 },
      { id: "ecommerce-gestios", label: "E-commerce Onia Comercio (PRO+)", price: 140, kind: "monthly", category: "addon", commissionRate: 0.1 },
      { id: "crm-n8n", label: "CRM / formulario a n8n", price: 790, kind: "oneoff", category: "addon", commissionRate: 0.1 },
      { id: "conexion-social", label: "Conexion canal social (IG / TikTok)", price: 690, kind: "oneoff", category: "addon", commissionRate: 0.1 },
      { id: "integracion-extra", label: "Integracion extra entre sistemas", price: 1900, kind: "oneoff", category: "addon", commissionRate: 0.1, note: "Desde 1.900. Requiere diagnostico y alcance escrito." },
    ],
  },
];

// Ganchos gratis para abrir la venta (NO se cobran por ahora).
export const freeHooks: string[] = [
  "Auditoria Express: revision corta, 3 problemas + 3 acciones + siguiente oferta Onia sugerida.",
  "Diagnostico + Plan: sesion mas profunda, mapa del proceso y presupuesto recomendado.",
];

export const quoteRules: string[] = [
  "Comision = solo el primer pago neto real y comprobado (primer mes, enganche, anticipo o setup). No es recurrente.",
  "No improvisar precios. Descuentos en Onia Dental / Onia Comercio requieren aprobacion de Sergio.",
  "La vendedora lidera llamadas y seguimiento. Sergio entra en casos importantes o cierres complejos.",
  "Prometer solo alcance confirmado. WhatsApp conversacional u operativo: sujeto a validacion Meta y costos de mensajeria.",
  "Terceros los paga el cliente: dominio, hosting, pasarela, QR, Meta, IA, pauta, migracion grande.",
  "Auditoria por Zoom: GRATIS, 30 minutos. La consultoria personalizada que busca fallas en la empresa SI se cobra, y el precio se define caso por caso con Sergio (no hay tarifa de lista todavia).",
  "Videos IA / Higgsfield: pausados como producto, no se cotizan.",
  "Chatbot: hay UN precio con IA. Lo que no entre en el estandar no se descuenta ni se improvisa — se define el alcance y se cotiza a medida.",
];
