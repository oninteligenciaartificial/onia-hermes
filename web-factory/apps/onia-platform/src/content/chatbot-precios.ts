/**
 * Chatbot de WhatsApp — los 3 stacks vigentes.
 *
 * FUENTE ÚNICA de los montos del chatbot: /chatbot, el configurador y el
 * resumen que se manda por WhatsApp leen de este archivo.
 *
 * Los precios salen del código que cobra: `onia-platform/lib/pricing.ts` →
 * `WHATSAPP_ADDON.tiers` (ratificado 2026-07-09, reemplaza el add-on anterior
 * de setup 650 + 350/mes):
 *   N1 Recordatorios ....... Bs 300 inst. + Bs 200/mes · `ai: false`
 *   N2 IA responde y capta . Bs 1.500 inst. + Bs 550/mes + Meta · `star: true`
 *   N3 IA opera ............ desde Bs 3.500 inst. + Bs 900/mes + Meta
 * Cupo operativo: 200 mensajes salientes/mes, IGUAL para los tres niveles y
 * fail-closed — al llegar corta el envío (`WHATSAPP_ADDON.meta
 * .operationalMonthlyLimit` + `lib/plan-limits.ts`). Markup sobre Meta: 20%
 * (`WHATSAPP_ADDON.meta.markupPct`).
 *
 * Se sacó lo que no existe: los add-ons "Cobros con QR" (gatewayEnabled es
 * false en los cinco planes) y "Notas de voz" (cero manejo de audio en el
 * webhook de WhatsApp del producto), y el precio de Bs 350/mes + Bs 1.000 de
 * instalación, retirado el 2026-07-09.
 *
 * No se publica tarifa por mensaje de Meta: el CSV oficial no se pudo
 * verificar y los bolivianos que hay en el código están mal calculados.
 */

export type StackId = "n1" | "n2" | "n3";

export interface ChatbotStack {
  readonly id: StackId;
  /** N1 / N2 / N3 — la escalera. */
  readonly nivel: string;
  readonly nombre: string;
  readonly paraQuien: string;
  readonly resuelve: string;
  readonly incluye: readonly string[];
  readonly noIncluye: readonly string[];
  readonly necesitasVos: readonly string[];
  readonly setup: number;
  /** true = el setup es "desde" (el alcance define el número final). */
  readonly setupDesde: boolean;
  readonly mensual: number;
  /** true = además del abono, Meta cobra por los mensajes que iniciás. */
  readonly metaAparte: boolean;
  readonly destacado?: boolean;
}

export const CHATBOT_STACKS: readonly ChatbotStack[] = [
  {
    id: "n1",
    nivel: "N1",
    nombre: "No se me olvida nadie",
    paraQuien: "El que tiene agenda y pierde turnos: consultorio chico, veterinaria, taller.",
    resuelve:
      "El no-show y la cobranza que se olvida. Plata que ya estaba ganada y se pierde.",
    incluye: [
      "Recordatorios automáticos de cita y de cobro, con reglas fijas",
      "Los 200 mensajes del mes van incluidos: acá no hay factura de Meta aparte",
      "Configuración del número y plantillas aprobadas por Meta",
    ],
    noIncluye: [
      "No conversa: avisa. No tiene IA",
      "No responde consultas ni califica clientes",
    ],
    necesitasVos: [
      "Un número que Meta pueda verificar",
      "La agenda cargada en Onia — sin agenda no hay qué recordar",
    ],
    setup: 300,
    setupDesde: false,
    mensual: 200,
    metaAparte: false,
  },
  {
    id: "n2",
    nivel: "N2",
    nombre: "No pierdo al que escribe",
    paraQuien: "El que recibe consultas y las está perdiendo fuera de horario.",
    resuelve:
      "El mensaje de las 11 de la noche, el del domingo, el del feriado. El que preguntó, nadie contestó y se fue a otro lado.",
    incluye: [
      "IA que responde, entrenada con el contenido real de tu negocio",
      "Califica al cliente y te deriva al humano con el contexto",
      "Responder es gratis: toda respuesta dentro de las 24 h desde que el cliente escribe no la cobra Meta",
      "Hasta 200 mensajes salientes por mes (los que inicia tu negocio)",
    ],
    noIncluye: [
      "No agenda solo ni crea tareas — eso es el N3",
      "No cobra con tarjeta: la pasarela no existe en el sistema todavía",
    ],
    necesitasVos: [
      "Un número dedicado para el bot",
      "Tus preguntas frecuentes con tus respuestas reales",
      "Alguien que atienda lo que el bot derive",
    ],
    setup: 1500,
    setupDesde: false,
    mensual: 550,
    metaAparte: true,
    destacado: true,
  },
  {
    id: "n3",
    nivel: "N3",
    nombre: "El chat opera",
    paraQuien:
      "El que ya tiene volumen y a quien le sale más caro el tiempo del equipo que el bot.",
    resuelve:
      "El tiempo de la recepcionista. No es que no contesten: contestar, agendar y hacer seguimiento consume una persona entera.",
    incluye: [
      "Todo lo del N2",
      "Agenda sola dentro de las reglas que vos escribís",
      "Crea tareas y hace seguimiento",
    ],
    noIncluye: [
      "No cobra con tarjeta: la pasarela no existe en el sistema todavía",
      "No decide nada fuera de las reglas que acordamos por escrito",
    ],
    necesitasVos: [
      "Todo lo del N2",
      "La agenda y los servicios cargados en Onia",
      "Reglas escritas de qué puede agendar solo y qué no",
      "Plan Pro o superior",
    ],
    setup: 3500,
    setupDesde: true,
    mensual: 900,
    metaAparte: true,
  },
] as const;

/** Mensajes salientes por mes. Mismo tope para los tres niveles; al llegar, corta. */
export const CUPO_MENSUAL = 200;

/** Markup sobre el costo que cobra Meta (WHATSAPP_ADDON.meta.markupPct). */
export const META_MARKUP_PCT = 20;

export function fmtBs(v: number): string {
  return Math.round(v).toLocaleString("es-BO");
}

/** "Bs 1.500 de instalación + Bs 550/mes" — una sola forma de decir el precio. */
export function precioStack(stack: ChatbotStack): string {
  const setup = `${stack.setupDesde ? "Desde Bs " : "Bs "}${fmtBs(stack.setup)}`;
  return `${setup} de instalación + Bs ${fmtBs(stack.mensual)}/mes${
    stack.metaAparte ? " + lo que Meta cobre por los mensajes que iniciás" : ""
  }`;
}
