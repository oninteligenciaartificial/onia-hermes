/**
 * Chatbot de WhatsApp — FUENTE ÚNICA del precio y de la promesa.
 *
 * Todo lo que la web dice del chatbot (landing, /preview/precios,
 * /preview/chatbot, /chatbot y el configurador) sale de acá. `lib/pricing.ts`
 * → ADDONS también lee de este archivo: no hay una segunda lista de precios.
 *
 * ⚠️ Corregido 2026-08-21, DOS cosas:
 *
 * 1. EL PRECIO. Convivían dos: `lib/pricing.ts` → ADDONS decía "Desde Bs 300
 *    de instalación + Bs 200/mes" y este archivo decía "Bs 1.500 + Bs
 *    1.490/mes". Dos fuentes del mismo add-on = la sesión elige mal. Decisión
 *    de Sergio (2026-08-21): **Bs 390/mes, sin instalación**, anual Bs 3.900
 *    (10 meses, igual que los planes). Y el markup del 20 % sobre Meta se cae:
 *    el cliente le paga a Meta directo, en su propia cuenta.
 *
 * 2. LA PROMESA. Se midió el bot contra su código y el material vendía cosas
 *    que no hace. Lo que se sacó, y por qué:
 *      - "IA que responde, entrenada con el contenido real de tu negocio" → el
 *        modo cliente NO usa LLM: son intents contra un JSON validado.
 *      - "Recordatorios automáticos de cita y de cobro" → no existen todavía.
 *      - "agenda" → no agenda: todo pedido de cita va a una persona.
 *      - "500 conversaciones por mes incluidas" → no hay contador ni corte
 *        implementado, así que no se promete un cupo (ni CUPO_MENSUAL ni
 *        META_MARKUP_PCT siguen existiendo: se borraron, no se maquillaron).
 *
 *    Lo que quedó es lo que el código SÍ hace, y es defendible: contesta al
 *    instante a cualquier hora, responde con la información que el negocio
 *    cargó, **no puede inventar ni cotizar un precio** (es determinístico —
 *    ventaja frente a un bot con IA suelta que alucina) y pasa el caso a una
 *    persona cuando no sabe.
 *
 * Referencia de valor: Bs 390/mes es el 12 % del salario mínimo 2026
 * (Bs 3.300, DS 5516), sin aguinaldo ni domingos, por algo que atiende 24/7.
 */

export type StackId = "whatsapp";

export interface ChatbotStack {
  readonly id: StackId;
  /** Etiqueta corta de la celda. No hay escalera: es un solo servicio. */
  readonly nivel: string;
  readonly nombre: string;
  readonly paraQuien: string;
  readonly resuelve: string;
  readonly incluye: readonly string[];
  readonly noIncluye: readonly string[];
  readonly necesitasVos: readonly string[];
  /** Bs por mes. */
  readonly mensual: number;
  /** Bs, año adelantado (= 10 meses, igual que los planes). */
  readonly anual: number;
  readonly destacado?: boolean;
}

export const CHATBOT_STACKS: readonly ChatbotStack[] = [
  {
    id: "whatsapp",
    nivel: "WhatsApp",
    nombre: "No pierdo al que escribe",
    paraQuien:
      "El que recibe consultas y las está perdiendo fuera de horario: consultorio, comercio, importadora.",
    resuelve:
      "El mensaje de las 11 de la noche, el del domingo, el del feriado. El que preguntó, nadie contestó y se fue a otro lado.",
    incluye: [
      "Contesta al instante a cualquier hora: de noche, el domingo y el feriado",
      "Responde con la información real que vos publicaste: horarios, servicios y los datos de la cita",
      "No inventa ni cotiza por su cuenta: solo dice lo que vos cargaste",
      "Lo que no sabe se lo pasa a una persona, con la conversación completa",
      "Configuración del número y de las plantillas que Meta aprueba",
    ],
    noIncluye: [
      "Cerrar la cita: el bot toma el pedido y lo pasa a tu equipo, que confirma el horario",
      "Lo que salga de este alcance (integraciones, flujos propios) se cotiza a medida",
    ],
    necesitasVos: [
      "Un número que Meta pueda verificar",
      "Tus preguntas frecuentes con tus respuestas reales",
      "Alguien que atienda lo que el bot derive",
    ],
    mensual: 390,
    anual: 3900,
    destacado: true,
  },
] as const;

/** El único servicio. Alias para las pantallas que muestran una sola tarjeta. */
export const CHATBOT_PLAN = CHATBOT_STACKS[0];

/**
 * Lo que no entra en el alcance no se infla a un nivel más caro: se cotiza.
 * Texto compartido para que las pantallas no lo redacten cada una distinto.
 */
export const A_MEDIDA =
  "¿Necesitás flujos propios, integraciones o más volumen? Se cotiza a medida.";

/**
 * Meta: el cliente le paga a Meta DIRECTO, en su propia cuenta. Nosotros no
 * facturamos esos mensajes ni les sumamos nada encima (decisión 2026-08-21:
 * se cae el +20 %). Una sola redacción para todas las pantallas.
 */
export const META_NOTA =
  "Los mensajes que Meta cobra los pagás vos, directo a Meta y en tu propia cuenta: no pasan por nuestra factura y no les sumamos nada encima. Responder dentro de las 24 horas desde que el cliente escribe no lo cobra Meta.";

export function fmtBs(v: number): string {
  return Math.round(v).toLocaleString("es-BO");
}

/** "Bs 390/mes, sin instalación" — una sola forma de decir el precio. */
export function precioStack(stack: ChatbotStack = CHATBOT_PLAN): string {
  return `Bs ${fmtBs(stack.mensual)}/mes, sin instalación`;
}

/** "Bs 3.900 al año (pagás 10 meses)" — el anual, dicho igual en todas partes. */
export function precioAnual(stack: ChatbotStack = CHATBOT_PLAN): string {
  return `Bs ${fmtBs(stack.anual)} al año (pagás 10 meses)`;
}

/** Celda de precio en la tabla de add-ons (lib/pricing.ts → ADDONS). */
export function precioAddonChatbot(): string {
  return `Bs ${fmtBs(CHATBOT_PLAN.mensual)}/mes, sin instalación`;
}
