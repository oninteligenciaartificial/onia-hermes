/**
 * Chatbot de WhatsApp — UN nivel con IA + trabajo a medida.
 *
 * FUENTE ÚNICA de los montos del chatbot en la web: /chatbot, el configurador,
 * las landings y el resumen que se manda por WhatsApp leen de este archivo.
 * Y este archivo copia a `onia-platform/lib/pricing.ts → WHATSAPP_ADDON`
 * (**ratificado 2026-08-15**), que es el código que cobra.
 *
 * ⚠️ Corregido 2026-08-20. Acá vivía la escalera N1/N2/N3 (300+200 / 1.500+550 /
 * 3.500+900), RETIRADA en esa ratificación — y las dos landings y /chatbot la
 * siguieron publicando durante cinco días. Por qué se retiró (del propio
 * pricing.ts): los 3 niveles eran INFACTURABLES — la organización guarda
 * `whatsappAddon` como Boolean, no existe `whatsappTier`, y el cupo era
 * idéntico en los tres; el equilibrio real es el SOPORTE HUMANO, no el volumen
 * de mensajes; y la IA es una fracción del costo (medido 2026-08-20: 0,4–2,2 %)
 * — el flete de Meta es lo caro.
 *
 * Referencia de valor: Bs 1.490 es el 45 % del salario mínimo 2026 (Bs 3.300,
 * DS 5516), sin aguinaldo ni domingos, por algo que atiende 24/7.
 */

export type StackId = "ia";

export interface ChatbotStack {
  readonly id: StackId;
  /** Etiqueta corta de la celda ("IA"). Ya no hay escalera. */
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
    id: "ia",
    nivel: "IA",
    nombre: "No pierdo al que escribe",
    paraQuien:
      "El que recibe consultas y las está perdiendo fuera de horario: consultorio, comercio, importadora.",
    resuelve:
      "El mensaje de las 11 de la noche, el del domingo, el del feriado. El que preguntó, nadie contestó y se fue a otro lado.",
    incluye: [
      "IA que responde, entrenada con el contenido real de tu negocio",
      "Recordatorios automáticos de cita y de cobro",
      "Califica al cliente y te deriva al humano con el contexto",
      "500 conversaciones por mes incluidas",
      "Configuración del número y plantillas aprobadas por Meta",
    ],
    noIncluye: [
      "Lo que salga de este alcance (integraciones, flujos propios) se cotiza a medida",
    ],
    necesitasVos: [
      "Un número que Meta pueda verificar",
      "Tus preguntas frecuentes con tus respuestas reales",
      "Alguien que atienda lo que el bot derive",
    ],
    setup: 1500,
    setupDesde: false,
    mensual: 1490,
    metaAparte: true,
    destacado: true,
  },
] as const;

/** El único stack. Alias para las pantallas que muestran una sola tarjeta. */
export const CHATBOT_PLAN = CHATBOT_STACKS[0];

/**
 * Lo que no entra en el nivel único no se infla a un "N3": se cotiza a medida.
 * Texto compartido para que las pantallas no lo redacten cada una distinto.
 */
export const A_MEDIDA =
  "¿Necesitás flujos propios, integraciones o más volumen? Se cotiza a medida.";

/** Conversaciones al mes incluidas (WHATSAPP_ADDON: 500). Al llegar, corta. */
export const CUPO_MENSUAL = 500;

/** Markup sobre el costo que cobra Meta (WHATSAPP_ADDON.meta.markupPct). */
export const META_MARKUP_PCT = 20;

export function fmtBs(v: number): string {
  return Math.round(v).toLocaleString("es-BO");
}

/** "Bs 1.500 de instalación + Bs 1.490/mes" — una sola forma de decir el precio. */
export function precioStack(stack: ChatbotStack): string {
  const setup = `${stack.setupDesde ? "Desde Bs " : "Bs "}${fmtBs(stack.setup)}`;
  return `${setup} de instalación + Bs ${fmtBs(stack.mensual)}/mes${
    stack.metaAparte ? " + lo que Meta cobre por los mensajes que iniciás" : ""
  }`;
}
