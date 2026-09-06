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
 *      - "500 conversaciones por mes incluidas" → no había contador ni corte
 *        implementado, así que no se prometía un cupo (META_MARKUP_PCT no
 *        existe más: se borró, no se maquilló).
 *
 *    ⚠️ Ese último punto quedó VENCIDO el 2026-09-03 y siguió leyéndose como
 *    presente tres días — corregido el 2026-09-06. El contador existe y CORTA:
 *    `onia-platform/lib/chatbot/cupo.ts` cuenta por mes, expone
 *    `agotada: usadas >= limite`, el motor deriva a una persona cuando es
 *    true, y hay una recarga que se le COBRA al dueño cuando se le acaba. O
 *    sea que el cupo pasó de ser copy a ser una condición que el cliente
 *    sufre — y la venta seguía sin nombrarlo, así que se enteraba pagando.
 *    Un comentario que explica por qué algo NO se dice es una hipótesis con
 *    fecha: mientras esta cabecera dijo «no se promete un cupo», cada vuelta
 *    que la leía volvía a sacarlo. Hoy se promete, con su salida al lado.
 *    Guarda: `app/(sitio)/limite-que-corta.test.ts` (y el número se cruza
 *    contra el producto con `scripts/limites-vivos.mjs`).
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

/**
 * Conversaciones que el add-on atiende por mes — ESPEJO de
 * `WHATSAPP_ADDON.includedConversations` (`onia-platform/lib/pricing.ts`), que
 * es el número que el producto APLICA: `lib/chatbot/cupo.ts` lo lee para
 * cortar («El cupo sale de pricing.ts: lo que se vende es lo que se aplica»).
 *
 * Vive acá porque el otro repo no está en este worktree, igual que los montos
 * de `lib/pricing.ts`. Que las dos copias coincidan NO es una propiedad del
 * código: lo cruza `scripts/limites-vivos.mjs` contra la fuente real, fuera de
 * la cadena `npm test` (exigir el repo hermano pondría rojo por ambiente y
 * trabaría el merge de los quince carriles).
 */
export const CONVERSACIONES_INCLUIDAS = 500;

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
      // El límite se dice ACÁ, segundo, pegado a la frase que promete «a
      // cualquier hora» — no al pie ni en una FAQ. Y con su salida: al
      // agotarse la conversación NO se pierde, pasa a una persona. Es lo que
      // el producto hace de verdad (`cupo.ts` → textoDeCupo).
      `Atiende hasta ${CONVERSACIONES_INCLUIDAS} conversaciones por mes; si se agotan, las nuevas pasan a una persona de tu equipo y podés sumar más`,
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

/**
 * El salario mínimo nacional — el dato AJENO contra el que anclamos el precio.
 *
 * Vive acá, al lado del precio del que es referencia, porque las dos mitades
 * de la frase se mueven por separado: el monto lo fija un DS (cambia por año)
 * y el precio del chatbot lo fija Sergio. Separadas, cualquiera de las dos
 * deja a la otra mintiendo.
 *
 * ⚠️ Hasta el 2026-09-04 estaba tipeado TRES veces —la portada, `/precios` y
 * `/chatbot`, cada una recalculando su propio porcentaje—, y lo que mantuvo
 * vivo el duplicado fue un comentario al lado de cada copia diciendo que le
 * correspondía estar acá *«pero ese archivo está fuera de este carril»*. Era
 * falso: `src/content/` es la misma app que las páginas que lo escribían. Un
 * comentario que explica por qué algo no se puede hacer es una hipótesis con
 * fecha. La invariante ahora se ejecuta: `(sitio)/salario-minimo.test.ts`.
 *
 * Es dato público con fuente legal, y por eso la norma se publica en pantalla
 * junto al número: un anclaje sin fuente es una cifra inventada.
 */
export const SALARIO_MINIMO = {
  /** Bs por mes. DS 5516. */
  monto: 3300,
  /** El año que nombra la frase en pantalla. */
  anio: 2026,
  /** La norma que lo fija, mostrada al lado del monto. */
  norma: "DS 5516",
} as const;

/**
 * Qué porcentaje del salario mínimo cuesta el chatbot — derivado, nunca
 * escrito. Hoy: 390 / 3.300 = 11,8 % → 12 %.
 */
export function pctDelSalarioMinimo(
  stack: ChatbotStack = CHATBOT_PLAN,
): number {
  return Math.round((stack.mensual / SALARIO_MINIMO.monto) * 100);
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
