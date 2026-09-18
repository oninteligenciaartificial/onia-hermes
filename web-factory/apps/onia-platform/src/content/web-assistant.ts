/**
 * Asistente del configurador (/servicios/webs): cuatro respuestas → una web
 * armada en el preview. Sergio Urcullo, 2026-09-17: «algo que sea como un
 * asistente que les arme su web rápidamente, solo visual, mediante un
 * cuestionario con su nombre y preguntas».
 *
 * Son REGLAS, no un modelo: cada rubro trae su dirección visual, paleta,
 * tipografía, objetivo y alcance por defecto, y las respuestas del dueño
 * pisan lo que quieran pisar. Costo de API cero, resultado inmediato, y todo
 * lo que elige se puede corregir en los pasos manuales de abajo. Un modelo
 * de lenguaje entraría después, y sólo para escribir el copy.
 *
 * Los ids de dirección, paleta y fuente son los de `web-configurator.ts`; los
 * de alcance, los de `webs.ts`. Si uno desaparece, TypeScript lo dice acá.
 *
 * ⚠️ SOLO los rubros que el alta entrega (+ ecommerce sobre plataforma, pedido
 * el 17-sep, + «Otro»). Sergio Urcullo, 21-ago: «aún no terminemos los que ya
 * tenemos» — vender un rubro que el registro no ofrece pierde al lead en el
 * último clic. `rubros-del-alta.test.ts` lo vigila; restaurante, construcción,
 * educación y salud salieron por eso el 17-sep. «Otro» los cubre con defaults
 * neutros.
 */
import {
  DEFAULT_LAYOUT_BY_DIRECTION,
  WEB_DIRECTIONS,
  WEB_GOALS,
  WEB_PALETTES,
  type WebDirectionId,
  type WebFontId,
  type WebGoalId,
  type WebLayoutId,
  type WebPaletteId,
} from "./web-configurator";
import type { WebStackId } from "./webs";

export type AssistantRubroId =
  | "dental"
  | "estetica"
  | "comercio"
  | "importadora"
  | "servicios"
  | "ecommerce"
  | "otro";

export interface AssistantRubro {
  readonly id: AssistantRubroId;
  /** Como se lee en el chip. */
  readonly label: string;
  /** Como queda escrito en el campo «Rubro» del intake. */
  readonly industry: string;
  readonly direction: WebDirectionId;
  readonly palette: WebPaletteId;
  readonly font: WebFontId;
  readonly goal: WebGoalId;
  readonly stack: WebStackId;
  /** Titular de arranque del preview; el dueño lo cambia en el paso 03. */
  readonly offer: string;
  /** Hasta tres, uno por línea: alimentan las tarjetas del preview. */
  readonly services: string;
}

export const ASSISTANT_RUBROS: readonly AssistantRubro[] = [
  {
    id: "dental",
    label: "Clínica dental",
    industry: "Clínica dental",
    direction: "minimalista",
    palette: "azul-confianza",
    font: "archivo",
    goal: "reservas",
    stack: "profesional",
    offer: "Tu sonrisa, atendida con calma y sin esperas.",
    services: "Limpieza y prevención\nOrtodoncia\nImplantes",
  },
  {
    id: "estetica",
    label: "Estética / spa",
    industry: "Centro de estética",
    direction: "cercano",
    palette: "rosa-ciruela",
    font: "humana",
    goal: "reservas",
    stack: "profesional",
    offer: "Cuidarte bien, con tiempo para vos.",
    services: "Faciales\nDepilación láser\nMasajes",
  },
  {
    id: "comercio",
    label: "Comercio / tienda",
    industry: "Comercio",
    direction: "catalogo",
    palette: "papel-verde",
    font: "archivo",
    goal: "catalogo",
    stack: "tienda",
    offer: "Todo lo que buscás, listo para pedir.",
    services: "Productos destacados\nOfertas de la semana\nPedidos por WhatsApp",
  },
  {
    id: "importadora",
    label: "Importadora / distribuidora",
    industry: "Importadora",
    direction: "empresarial",
    palette: "azul-cobalto",
    font: "archivo",
    goal: "cotizaciones",
    stack: "profesional",
    offer: "Stock real, precios claros y entrega a tiempo.",
    services: "Catálogo por categoría\nVenta por mayor\nCotización rápida",
  },
  {
    id: "servicios",
    label: "Abogados, contadores, consultores",
    industry: "Servicios profesionales",
    direction: "empresarial",
    palette: "tinta-marfil",
    font: "editorial",
    goal: "contactos",
    stack: "profesional",
    offer: "Asesoría clara para decidir con tranquilidad.",
    services: "Consulta inicial\nAsesoría continua\nTrámites y gestiones",
  },
  {
    id: "ecommerce",
    label: "Ecommerce (Shopify, Hotmart, Whop)",
    industry: "Tienda online",
    direction: "catalogo",
    palette: "carbón-lima",
    font: "archivo",
    goal: "catalogo",
    stack: "ecommerce",
    offer: "Vendé online sin armarlo vos.",
    services: "Productos, cursos o membresías\nPagos y entregas automáticos\nTu marca, no una plantilla",
  },
  {
    id: "otro",
    label: "Otro",
    industry: "",
    direction: "minimalista",
    palette: "papel-verde",
    font: "archivo",
    goal: "contactos",
    stack: "profesional",
    offer: "Lo que hacemos, explicado simple.",
    services: "",
  },
] as const;

export type AssistantFeelId = "rubro" | "clara" | "cercana" | "premium" | "impacto" | "corporativa";

export interface AssistantFeel {
  readonly id: AssistantFeelId;
  readonly label: string;
  readonly descripcion: string;
  /** Sin dirección = la que trae el rubro. */
  readonly direction?: WebDirectionId;
}

export const ASSISTANT_FEELS: readonly AssistantFeel[] = [
  { id: "rubro", label: "Como suele verse mi rubro", descripcion: "El asistente elige." },
  { id: "clara", label: "Clara y ordenada", descripcion: "Espacio, poco ruido.", direction: "minimalista" },
  { id: "cercana", label: "Cercana", descripcion: "Personas y conversación.", direction: "cercano" },
  { id: "premium", label: "Premium", descripcion: "Fotografía y detalle.", direction: "editorial" },
  { id: "impacto", label: "Con impacto", descripcion: "Titular grande, mensaje fuerte.", direction: "impacto" },
  { id: "corporativa", label: "Corporativa", descripcion: "Argumentos y confianza.", direction: "empresarial" },
] as const;

export type AssistantColorId = "rubro" | WebPaletteId;

/** Las paletas que se ofrecen en el cuestionario; las diez siguen abajo, en el paso 06. */
export const ASSISTANT_COLORS: readonly WebPaletteId[] = [
  "papel-verde",
  "azul-confianza",
  "terracota-crema",
  "tinta-marfil",
  "rosa-ciruela",
  "noche-cobre",
] as const;

export type AssistantGoalId = "rubro" | WebGoalId;

export interface AssistantAnswers {
  /** «Contanos tu negocio en una frase»: de acá salen rubro, ciudad y la descripción del preview. */
  readonly phrase: string;
  readonly businessName: string;
  readonly rubro: AssistantRubroId;
  readonly goal: AssistantGoalId;
  readonly feel: AssistantFeelId;
  readonly color: AssistantColorId;
}

export const EMPTY_ASSISTANT_ANSWERS: AssistantAnswers = {
  phrase: "",
  businessName: "",
  rubro: "otro",
  goal: "rubro",
  feel: "rubro",
  color: "rubro",
};

export interface AssistantPlan {
  readonly direction: WebDirectionId;
  readonly layout: WebLayoutId;
  readonly palette: WebPaletteId;
  readonly font: WebFontId;
  readonly goal: WebGoalId;
  readonly stack: WebStackId;
  readonly intake: {
    readonly businessName: string;
    readonly industry: string;
    readonly offer: string;
    readonly services: string;
    /** La frase del dueño, tal cual: es la bajada del hero del preview. */
    readonly description: string;
    readonly city: string;
  };
}

const FONT_BY_DIRECTION: Record<WebDirectionId, WebFontId> = {
  minimalista: "archivo",
  editorial: "editorial",
  empresarial: "archivo",
  impacto: "archivo",
  cercano: "humana",
  catalogo: "archivo",
};

export function findAssistantRubro(id: AssistantRubroId): AssistantRubro {
  return ASSISTANT_RUBROS.find((item) => item.id === id) ?? ASSISTANT_RUBROS[ASSISTANT_RUBROS.length - 1];
}

/**
 * Una frase sobre el negocio elige el rubro sola. Durable, Hostinger, Wix y
 * 10Web arrancan con UNA caja de texto, no con un formulario (mirados el
 * 17-sep); acá se logra sin modelo: palabras clave por rubro, en orden de
 * especificidad. «Tienda online» es ecommerce antes que comercio; «clínica
 * dental estética» es dental antes que estética.
 */
const RUBRO_POR_PALABRA: ReadonlyArray<{ readonly id: AssistantRubroId; readonly re: RegExp }> = [
  { id: "dental", re: /dental|dentist|odont|ortodonc|sonrisa/i },
  { id: "ecommerce", re: /shopify|hotmart|whop|e-?commerce|tienda (online|virtual)|curso online|membres[ií]a|vend(o|er|emos) (por internet|online)/i },
  { id: "estetica", re: /est[ée]tic|\bspa\b|belleza|masaj|depilaci|facial|barber|peluquer|u[ñn]as|cosm[ée]tic|manicur/i },
  { id: "importadora", re: /import|distribui|mayorista|por mayor|repuesto/i },
  { id: "comercio", re: /tienda|comercio|almac[ée]n|ferreter|librer|boutique|minimarket|mercado|ropa|zapat|vend(o|emos)\b/i },
  { id: "servicios", re: /abogad|contad|contab|consultor|jur[ií]dic|asesor|arquitect|ingenier|notar|auditor/i },
];

export function inferRubro(phrase: string): AssistantRubroId | null {
  return RUBRO_POR_PALABRA.find((item) => item.re.test(phrase))?.id ?? null;
}

/** «… en Santa Cruz de la Sierra, …» → «Santa Cruz de la Sierra». Sólo con mayúscula: «en la zona sur» no es una ciudad. */
export function inferCity(phrase: string): string {
  const m = /\ben ([A-ZÁÉÍÓÚÑ][\wáéíóúñ]*(?: (?:(?:de|del|la|el|los|las) )*[A-ZÁÉÍÓÚÑ][\wáéíóúñ]*)*)/.exec(phrase);
  return m ? m[1] : "";
}

/**
 * El brief, como lo muestra Wix antes de personalizar: lo que el asistente
 * entendió, en una línea, para corregirlo antes de seguir.
 */
export function describeAssistantPlan(answers: AssistantAnswers, plan: AssistantPlan): string {
  const rubro = findAssistantRubro(answers.rubro);
  const goal = WEB_GOALS.find((item) => item.id === plan.goal)?.nombre ?? plan.goal;
  const direction = WEB_DIRECTIONS.find((item) => item.id === plan.direction)?.nombre ?? plan.direction;
  const palette = WEB_PALETTES.find((item) => item.id === plan.palette)?.nombre ?? plan.palette;
  const que = rubro.id === "otro" ? plan.intake.businessName || "tu negocio" : rubro.label.toLowerCase();
  const donde = plan.intake.city ? ` en ${plan.intake.city}` : "";
  return `Entendí: ${que}${donde} · para ${goal.toLowerCase()} · estilo ${direction.toLowerCase()} · colores ${palette.toLowerCase()}.`;
}

/**
 * Las respuestas mandan; el rubro rellena lo que no se contestó.
 * - Objetivo «catálogo» fuerza la estructura vitrina y un alcance con
 *   productos a la vista: tienda, o ecommerce sobre plataforma si el rubro ya
 *   lo es. No hay catálogo sin productos.
 * - Si el dueño eligió cómo se siente, la tipografía sigue a esa dirección,
 *   no a la del rubro; si no, se queda la del rubro.
 */
export function buildAssistantPlan(answers: AssistantAnswers): AssistantPlan {
  const rubro = findAssistantRubro(answers.rubro);
  const feel = ASSISTANT_FEELS.find((item) => item.id === answers.feel);
  const goal: WebGoalId = answers.goal === "rubro" ? rubro.goal : answers.goal;
  const direction: WebDirectionId =
    goal === "catalogo" ? "catalogo" : (feel?.direction ?? rubro.direction);
  const layout: WebLayoutId = DEFAULT_LAYOUT_BY_DIRECTION[direction];
  const palette: WebPaletteId = answers.color === "rubro" ? rubro.palette : answers.color;
  const font: WebFontId = feel?.direction ? FONT_BY_DIRECTION[direction] : rubro.font;
  const stack: WebStackId =
    goal === "catalogo" ? (rubro.stack === "ecommerce" ? "ecommerce" : "tienda") : rubro.stack;

  return {
    direction,
    layout,
    palette,
    font,
    goal,
    stack,
    intake: {
      businessName: answers.businessName.trim(),
      industry: rubro.industry,
      offer: rubro.offer,
      services: rubro.services,
      description: answers.phrase.trim(),
      city: inferCity(answers.phrase),
    },
  };
}
