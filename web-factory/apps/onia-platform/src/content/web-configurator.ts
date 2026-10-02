import type { WebStackId } from "./webs";

export type WebDirectionId =
  | "minimalista"
  | "editorial"
  | "empresarial"
  | "impacto"
  | "cercano"
  | "catalogo";

export type WebPaletteId =
  | "papel-verde"
  | "carbón-lima"
  | "azul-confianza"
  | "terracota-crema"
  | "violeta-claro"
  | "tinta-marfil"
  | "oliva-arena"
  | "azul-cobalto"
  | "rosa-ciruela"
  | "noche-cobre";

export type WebLayoutId =
  | "centrada"
  | "portada"
  | "corporativa"
  | "tipografica"
  | "humana"
  | "vitrina";

export interface WebLayout {
  readonly id: WebLayoutId;
  readonly nombre: string;
  readonly descripcion: string;
  readonly orden: readonly string[];
}

export type WebFontId = "archivo" | "editorial" | "humana" | "tecnica";

export type WebGoalId = "contactos" | "reservas" | "catalogo" | "cotizaciones";

export interface WebPreviewCard {
  readonly eyebrow: string;
  readonly title: string;
  readonly detail: string;
}

export interface WebDirection {
  readonly id: WebDirectionId;
  readonly nombre: string;
  readonly descripcion: string;
  readonly marca: string;
  readonly promesa: string;
  readonly hero: string;
  readonly subcopy: string;
  readonly cards: readonly WebPreviewCard[];
}

export interface WebPalette {
  readonly id: WebPaletteId;
  readonly nombre: string;
  readonly descripcion: string;
  readonly background: string;
  readonly surface: string;
  readonly ink: string;
  readonly muted: string;
  readonly accent: string;
  readonly swatches: readonly string[];
}

export interface WebFont {
  readonly id: WebFontId;
  readonly nombre: string;
  readonly descripcion: string;
  readonly muestra: string;
  /** CSS font stack. The final font is confirmed during production. */
  readonly css: string;
}

export interface WebGoal {
  readonly id: WebGoalId;
  readonly nombre: string;
  readonly descripcion: string;
  readonly cta: string;
}

export interface WebConfiguratorSelection {
  readonly layout: WebLayoutId;
  readonly direction: WebDirectionId;
  readonly palette: WebPaletteId;
  readonly accent: string;
  readonly font: WebFontId;
  readonly goal: WebGoalId;
  readonly stack: WebStackId;
}

export const WEB_LAYOUTS: readonly WebLayout[] = [
  { id: "centrada", nombre: "Esencial", descripcion: "Mensaje al centro, imagen panorámica después.", orden: ["Mensaje", "Imagen", "Servicios"] },
  { id: "portada", nombre: "Portada editorial", descripcion: "Fotografía a todo ancho y relato debajo.", orden: ["Imagen", "Historia", "Selección"] },
  { id: "corporativa", nombre: "Corporativa", descripcion: "Propuesta, argumentos y soluciones en columnas.", orden: ["Propuesta", "Confianza", "Soluciones"] },
  { id: "tipografica", nombre: "Gran impacto", descripcion: "Titular protagonista, fotografía y llamadas claras.", orden: ["Titular", "Imagen", "Acciones"] },
  { id: "humana", nombre: "Cercana", descripcion: "Imagen a la izquierda, conversación a la derecha.", orden: ["Personas", "Mensaje", "Ayuda"] },
  { id: "vitrina", nombre: "Vitrina", descripcion: "Categorías y opciones visibles desde el inicio.", orden: ["Categorías", "Productos", "Consulta"] },
] as const;

export const DEFAULT_LAYOUT_BY_DIRECTION: Record<WebDirectionId, WebLayoutId> = {
  minimalista: "centrada",
  editorial: "portada",
  empresarial: "corporativa",
  impacto: "tipografica",
  cercano: "humana",
  catalogo: "vitrina",
};

export const WEB_DIRECTIONS: readonly WebDirection[] = [
  {
    id: "minimalista",
    nombre: "Minimalista",
    descripcion: "Poco ruido, mucha claridad.",
    marca: "casa norte",
    promesa: "Movimiento, calma y presencia",
    hero: "Un espacio para volver a vos.",
    subcopy: "Clases y experiencias para hacer una pausa, moverte a tu ritmo y sentirte mejor cada día.",
    cards: [
      { eyebrow: "01 / Clases", title: "Yoga para todos.", detail: "Conocé los horarios" },
      { eyebrow: "02 / Espacio", title: "Un lugar para vos.", detail: "Descubrí el estudio" },
      { eyebrow: "03 / Comenzá", title: "Tu primera clase.", detail: "Reservá tu lugar" },
    ],
  },
  {
    id: "editorial",
    nombre: "Editorial",
    descripcion: "Elegante, con ritmo y criterio.",
    marca: "lino atelier",
    promesa: "Piezas hechas para durar",
    hero: "El arte de vestir a tu manera.",
    subcopy: "Prendas de líneas honestas, materiales elegidos con cuidado y una forma más personal de crear estilo.",
    cards: [
      { eyebrow: "La colección", title: "Piezas esenciales.", detail: "Explorá la selección" },
      { eyebrow: "El taller", title: "Hecho con intención.", detail: "Conocé el proceso" },
      { eyebrow: "Citas", title: "Un momento para elegir.", detail: "Agendá una visita" },
    ],
  },
  {
    id: "empresarial",
    nombre: "Empresarial",
    descripcion: "Ordenado, sólido y confiable.",
    marca: "pilar ingeniería",
    promesa: "Ingeniería y gestión de proyectos",
    hero: "De la planificación a la obra.",
    subcopy: "Acompañamos proyectos con criterio técnico, procesos claros y un equipo comprometido con cada etapa.",
    cards: [
      { eyebrow: "01 / Proyectos", title: "Diseño y cálculo.", detail: "Ver especialidades" },
      { eyebrow: "02 / Ejecución", title: "Supervisión de obra.", detail: "Conocé el método" },
      { eyebrow: "03 / Asesoría", title: "Decisiones con respaldo.", detail: "Solicitá una reunión" },
    ],
  },
  {
    id: "impacto",
    nombre: "Impacto",
    descripcion: "Grande, expresivo y memorable.",
    marca: "arco estudio",
    promesa: "Ideas que toman forma",
    hero: "No vinimos a pasar desapercibidos.",
    subcopy: "Diseñamos identidades y experiencias que hacen visible lo que vuelve diferente a cada marca.",
    cards: [
      { eyebrow: "01 / Identidad", title: "Marcas con carácter.", detail: "Ver proyectos" },
      { eyebrow: "02 / Campañas", title: "Ideas en movimiento.", detail: "Descubrir trabajos" },
      { eyebrow: "03 / Colaboremos", title: "Hagamos algo grande.", detail: "Contanos tu idea" },
    ],
  },
  {
    id: "cercano",
    nombre: "Cercano",
    descripcion: "Humano, cálido y fácil de recorrer.",
    marca: "mesa viva",
    promesa: "Cocina de encuentro",
    hero: "Siempre hay lugar para uno más.",
    subcopy: "Comida hecha con cariño, tardes que se alargan y una mesa que invita a quedarse un rato más.",
    cards: [
      { eyebrow: "La carta", title: "Algo rico para cada día.", detail: "Mirá el menú" },
      { eyebrow: "La casa", title: "Un lugar para compartir.", detail: "Conocé el espacio" },
      { eyebrow: "Nos vemos", title: "Guardamos tu mesa.", detail: "Hacé una reserva" },
    ],
  },
  {
    id: "catalogo",
    nombre: "Catálogo",
    descripcion: "Visual, ordenado y pensado para elegir.",
    marca: "casa objeto",
    promesa: "Objetos para vivir bonito",
    hero: "Detalles que hacen hogar.",
    subcopy: "Una selección de objetos cotidianos que suman textura, color y personalidad a tus espacios.",
    cards: [
      { eyebrow: "Colección 01", title: "Cerámica de autor.", detail: "Ver piezas" },
      { eyebrow: "Colección 02", title: "Textiles suaves.", detail: "Explorar" },
      { eyebrow: "Colección 03", title: "Luz y pequeños objetos.", detail: "Consultar" },
    ],
  },
] as const;

export const WEB_PALETTES: readonly WebPalette[] = [
  {
    id: "papel-verde",
    nombre: "Papel + verde",
    descripcion: "Limpia, fresca y confiable.",
    background: "#F2F6F1",
    surface: "#FFFFFF",
    ink: "#143328",
    muted: "#64766C",
    accent: "#079E68",
    swatches: ["#F2F6F1", "#079E68", "#143328"],
  },
  {
    id: "carbón-lima",
    nombre: "Carbón + lima",
    descripcion: "Fuerte, contemporánea y directa.",
    background: "#171A18",
    surface: "#252A27",
    ink: "#F5F8F5",
    muted: "#A9B4AD",
    accent: "#C7F36B",
    swatches: ["#171A18", "#C7F36B", "#F5F8F5"],
  },
  {
    id: "azul-confianza",
    nombre: "Azul + blanco",
    descripcion: "Seria, clara y profesional.",
    background: "#EEF4FA",
    surface: "#FFFFFF",
    ink: "#102A43",
    muted: "#61758A",
    accent: "#1769AA",
    swatches: ["#EEF4FA", "#1769AA", "#102A43"],
  },
  {
    id: "terracota-crema",
    nombre: "Terracota + crema",
    descripcion: "Cálida, artesanal y memorable.",
    background: "#FBF0E4",
    surface: "#FFF9F2",
    ink: "#42251D",
    muted: "#866C5E",
    accent: "#C95F3D",
    swatches: ["#FBF0E4", "#C95F3D", "#42251D"],
  },
  {
    id: "violeta-claro",
    nombre: "Violeta + nube",
    descripcion: "Creativa, digital y con carácter.",
    background: "#F2EFFB",
    surface: "#FFFFFF",
    ink: "#2E2454",
    muted: "#756C92",
    accent: "#7656D6",
    swatches: ["#F2EFFB", "#7656D6", "#2E2454"],
  },
  {
    id: "tinta-marfil",
    nombre: "Tinta + marfil",
    descripcion: "Sobria y editorial.",
    background: "#F6F2E9",
    surface: "#FFFCF6",
    ink: "#222321",
    muted: "#676965",
    accent: "#404C5A",
    swatches: ["#F6F2E9", "#404C5A", "#222321"],
  },
  {
    id: "oliva-arena",
    nombre: "Oliva + arena",
    descripcion: "Natural y sofisticada.",
    background: "#EEEDE0",
    surface: "#FAF9F0",
    ink: "#30392C",
    muted: "#69715F",
    accent: "#697A37",
    swatches: ["#EEEDE0", "#697A37", "#30392C"],
  },
  {
    id: "azul-cobalto",
    nombre: "Cobalto + hielo",
    descripcion: "Audaz y tecnológica.",
    background: "#EAF0FD",
    surface: "#FFFFFF",
    ink: "#172044",
    muted: "#5E688A",
    accent: "#304FCA",
    swatches: ["#EAF0FD", "#304FCA", "#172044"],
  },
  {
    id: "rosa-ciruela",
    nombre: "Rosa + ciruela",
    descripcion: "Expresiva sin perder elegancia.",
    background: "#FBF0F3",
    surface: "#FFF9FA",
    ink: "#402238",
    muted: "#896879",
    accent: "#AC4270",
    swatches: ["#FBF0F3", "#AC4270", "#402238"],
  },
  {
    id: "noche-cobre",
    nombre: "Noche + cobre",
    descripcion: "Oscura, cálida y premium.",
    background: "#1E2426",
    surface: "#2B3335",
    ink: "#FAF4E8",
    muted: "#BAC0BA",
    accent: "#D99A66",
    swatches: ["#1E2426", "#D99A66", "#FAF4E8"],
  },
] as const;

export const WEB_FONTS: readonly WebFont[] = [
  {
    id: "archivo",
    nombre: "Grotesca limpia",
    descripcion: "Actual y directa",
    muestra: "Grotesca",
    css: "var(--font-instrument-sans), Arial, sans-serif",
  },
  {
    id: "editorial",
    nombre: "Serif editorial",
    descripcion: "Cuidada y expresiva",
    muestra: "Editorial",
    css: "Georgia, 'Times New Roman', serif",
  },
  {
    id: "humana",
    nombre: "Humana",
    descripcion: "Amable y accesible",
    muestra: "Humana",
    css: "'Trebuchet MS', var(--font-instrument-sans), sans-serif",
  },
  {
    id: "tecnica",
    nombre: "Técnica",
    descripcion: "Precisa y funcional",
    muestra: "Técnica",
    css: "var(--font-plex-mono), 'Courier New', monospace",
  },
] as const;

export const WEB_GOALS: readonly WebGoal[] = [
  {
    id: "contactos",
    nombre: "Recibir contactos",
    descripcion: "Que te escriban por WhatsApp.",
    cta: "Escribinos por WhatsApp",
  },
  {
    id: "reservas",
    nombre: "Conseguir reservas",
    descripcion: "Que agenden una cita o reunión.",
    cta: "Reservar un turno",
  },
  {
    id: "catalogo",
    nombre: "Mostrar mi oferta",
    descripcion: "Que vean y comparen opciones.",
    cta: "Ver opciones",
  },
  {
    id: "cotizaciones",
    nombre: "Pedir cotizaciones",
    descripcion: "Que lleguen pedidos más claros.",
    cta: "Pedir cotización",
  },
] as const;

export function isWebDirectionId(value: string | null): value is WebDirectionId {
  return WEB_DIRECTIONS.some((item) => item.id === value);
}

export function isWebLayoutId(value: string | null): value is WebLayoutId {
  return WEB_LAYOUTS.some((item) => item.id === value);
}

export function isWebStackId(value: string | null): value is WebStackId {
  return value === "landing" || value === "profesional" || value === "pro" || value === "tienda" || value === "ecommerce";
}
