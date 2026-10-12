import { readFile } from "node:fs/promises";
import { z } from "zod";

// Single source of truth for template ids. This list used to be copy-pasted in
// six places (generate, factory-build, auto-design, create-client, the intake
// enum and the auto-designer type), which is how `landing-clinic` ended up
// renderable but unreachable from the CLI and the intake.
export const WEB_FACTORY_TEMPLATES = [
  "landing",
  "store",
  "dashboard",
  "landing-focus",
  "landing-clinic",
  "landing-realestate",
  "landing-logistics",
] as const;

export type WebFactoryTemplate = (typeof WEB_FACTORY_TEMPLATES)[number];

export function parseTemplate(value: string | undefined): WebFactoryTemplate | undefined {
  if (!value) {
    return undefined;
  }

  if ((WEB_FACTORY_TEMPLATES as readonly string[]).includes(value)) {
    return value as WebFactoryTemplate;
  }

  throw new Error(`Unsupported template "${value}". Available: ${WEB_FACTORY_TEMPLATES.join(", ")}.`);
}

const hexColorSchema = z
  .string()
  .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Use a hex color like #0f766e.");

const optionalUrlSchema = z.union([z.string().url(), z.literal("")]).default("");
const optionalAssetSchema = z
  .union([
    z.string().url(),
    z.string().regex(/^assets\/[a-zA-Z0-9._/-]+$/, "Use a relative asset path like assets/logo.png."),
    z.literal(""),
  ])
  .default("");

const actionUrlSchema = z
  .string()
  .min(1)
  .refine((value) => value.startsWith("/") || value.startsWith("#") || /^https?:\/\//.test(value), {
    message: "Use an absolute URL, a local path that starts with /, or an anchor that starts with #.",
  });

const serviceSchema = z.object({
  titulo: z.string().min(1),
  desc: z.string().min(1),
  icono: z.string().min(1).default("sparkles"),
  // Per-service destination. Blocks that give every service its own next step
  // (path-cards) use it; empty falls back to the site-wide CTA.
  url: z.string().default(""),
});

const procesoPasoSchema = z.object({
  titulo: z.string().min(1),
  desc: z.string().min(1),
  // A step can carry its own photo. That is what turns the process into a scene
  // the visitor scrolls through (scroll-story-hero) instead of a list of words.
  // Blocks that only render text ignore both fields.
  imagen: optionalAssetSchema,
  imagenAlt: z.string().default(""),
});

// Proof, and the model's rule with it: "SOLO con numeros reales del cliente.
// Sin datos verificables, esta seccion se elimina, no se inventa." `fuente` is
// where the number comes from; `esMuestra` tags a value the client has not
// confirmed, and the block prints that tag on screen.
const metricaSchema = z.object({
  valor: z.string().min(1),
  label: z.string().min(1),
  fuente: z.string().default(""),
  esMuestra: z.boolean().default(false),
});

const cotizacionCampoSchema = z.object({
  nombre: z.string().min(1),
  label: z.string().min(1),
  tipo: z.enum(["text", "email", "tel", "number", "date", "textarea", "select"]).default("text"),
  requerido: z.boolean().default(false),
  opciones: z.array(z.string().min(1)).default([]),
  placeholder: z.string().default(""),
  autocomplete: z.string().default(""),
});

const faqItemSchema = z.object({
  pregunta: z.string().min(1),
  respuesta: z.string().min(1),
});

const productSpecSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

const productDetailImageSchema = z.object({
  src: optionalAssetSchema,
  alt: z.string().default(""),
  label: z.string().min(1).default("Detalle"),
});

const referenceSchema = z.object({
  title: z.string().default(""),
  url: z.string().url(),
  type: z
    .enum(["visual", "layout", "copy", "product", "competitor", "anti-reference"])
    .default("visual"),
  use: z.string().default(""),
  avoid: z.string().default(""),
});

const productSchema = z.object({
  titulo: z.string().min(1),
  categoria: z.string().min(1),
  precio: z.string().min(1),
  precioValor: z.number().positive().nullable().optional(),
  moneda: z.string().min(1).default("BOB"),
  desc: z.string().min(1),
  etiqueta: z.string().min(1).default("Nuevo"),
  imagen: optionalAssetSchema,
  imagenAlt: z.string().default(""),
  marca: z.string().default(""),
  tamano: z.string().default(""),
  uso: z.string().default(""),
  beneficios: z.array(z.string().min(1)).default([]),
  idealPara: z.array(z.string().min(1)).default([]),
  ingredientesClave: z.array(z.string().min(1)).default([]),
  modoUso: z.string().default(""),
  incluye: z.array(z.string().min(1)).default([]),
  especificaciones: z.array(productSpecSchema).default([]),
  detalleImagenes: z.array(productDetailImageSchema).default([]),
  detalleNota: z.string().default(""),
  // Sample item waiting for the client's real data. Blocks that render it MUST
  // label it on screen, so a page built before the portfolio arrives can never
  // be mistaken for a real listing.
  esMuestra: z.boolean().default(false),
  ordenRutina: z.number().int().positive().optional(),
  destacadoMes: z.boolean().optional(),
  descuentoPorcentaje: z.number().min(0).max(100).optional(),
  precioPromocional: z.number().positive().nullable().optional(),
});

const dashboardKpiSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  delta: z.string().default(""),
  trend: z.enum(["up", "down", "flat"]).default("flat"),
  context: z.string().default(""),
  // Celda hero (card oscura de acento) y sparkline integrada en el KPI — el
  // template ya los soporta; el schema los dejaba caer. Aprendido de Tabler/
  // shadcn: el KPI cuenta la tendencia en la propia tarjeta, no en otro chart.
  variant: z.enum(["default", "accent"]).optional(),
  spark: z.array(z.number()).optional(),
});

// Ausente = listo. Sin esto el template solo sabia dibujar el estado final: una
// consulta caida se veia igual que un negocio sin datos.
const dashboardEstadoSchema = z.enum(["cargando", "error"]).optional();

const dashboardPointSchema = z.object({
  label: z.string().min(1),
  value: z.number(),
  // El template dibuja la barra rayada con `pending: true` desde hace tiempo, pero
  // el schema no lo declaraba y Zod descarta lo no declarado: el patron era
  // inalcanzable desde el JSON. Mismo drift que ya habian tenido `variant`/`spark`.
  pending: z.boolean().optional(),
});

const dashboardChartSchema = z.object({
  title: z.string().min(1),
  unit: z.string().default(""),
  type: z.enum(["bar", "line", "donut", "sparkline", "radial"]).default("bar"),
  points: z.array(dashboardPointSchema).default([]),
  // Optional multi-series for bar/line: when present, each series is drawn as its
  // own colored line/group with a legend.
  series: z
    .array(
      z.object({
        name: z.string().min(1),
        points: z.array(dashboardPointSchema).default([]),
      }),
    )
    .default([]),
  estado: dashboardEstadoSchema,
});

const dashboardTableSchema = z.object({
  title: z.string().default("Detalle"),
  columns: z.array(z.string().min(1)).default([]),
  rows: z.array(z.array(z.string())).default([]),
  estado: dashboardEstadoSchema,
});

// Propuestas del agente. NO es un chat: cada propuesta viaja pegada a la
// evidencia que la justifica y se aprueba o se descarta (human-in-the-loop, que
// es como funciona el modulo `agents` del core). El patron sale del pattern bank
// ratificado el 2026-08-17: "propuestas del agente INLINE junto a su evidencia".
const dashboardAgentActionSchema = z.object({
  titulo: z.string().min(1),
  /** Que haria exactamente si se aprueba. En lenguaje del duenio, no del sistema. */
  detalle: z.string().default(""),
  /** El dato que la justifica. Sin esto es una corazonada con botones. */
  evidencia: z.string().default(""),
  /** Plata o tiempo en juego. Es lo que hace que valga la pena mirarlo. */
  impacto: z.string().default(""),
  urgencia: z.enum(["alta", "media", "baja"]).default("media"),
  canal: z.string().default(""),
});

const dashboardAgentSchema = z.object({
  titulo: z.string().default("Tu asistente"),
  /** Una linea de contexto: que reviso y cuando. */
  resumen: z.string().default(""),
  acciones: z.array(dashboardAgentActionSchema).default([]),
  estado: dashboardEstadoSchema,
});

const dashboardNoteSchema = z.object({
  texto: z.string().min(1),
  meta: z.string().default(""),
  /** A que cuelga la nota (un paciente, una cita, un pendiente). Vacio = suelta. */
  ancla: z.string().default(""),
});

const dashboardNotesSchema = z.object({
  titulo: z.string().default("Notas"),
  items: z.array(dashboardNoteSchema).default([]),
  estado: dashboardEstadoSchema,
});

const dashboardSchema = z
  .object({
    title: z.string().default("Panel de control"),
    subtitle: z.string().default(""),
    nav: z.array(z.string().min(1)).default([]),
    filters: z.array(z.string().min(1)).default([]),
    kpis: z.array(dashboardKpiSchema).default([]),
    charts: z.array(dashboardChartSchema).default([]),
    table: dashboardTableSchema.default({ title: "Detalle", columns: [], rows: [] }),
    agente: dashboardAgentSchema.optional(),
    notas: dashboardNotesSchema.optional(),
  })
  .default({
    title: "Panel de control",
    subtitle: "",
    nav: [],
    filters: [],
    kpis: [],
    charts: [],
    table: { title: "Detalle", columns: [], rows: [] },
  });

export const clientSchema = z.object({
  nombre: z.string().min(1).default("ONIA Demo Client"),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase URL slug.")
    .default("demo"),
  tagline: z.string().min(1).default("Sitio listo para vender mejor"),
  descripcion: z
    .string()
    .min(1)
    .default("Una presencia web clara, rapida y lista para convertir visitantes en conversaciones."),
  logo: z.string().default(""),
  logoIcon: optionalAssetSchema,
  logoWide: optionalAssetSchema,
  heroVideo: optionalAssetSchema,
  heroPoster: optionalAssetSchema,
  imagenSecundaria: optionalAssetSchema,
  colores: z
    .object({
      primary: hexColorSchema.default("#0f766e"),
      secondary: hexColorSchema.default("#1d4ed8"),
      accent: hexColorSchema.default("#f59e0b"),
      bg: hexColorSchema.default("#f8fafc"),
      fg: hexColorSchema.default("#111827"),
    })
    .default({
      primary: "#0f766e",
      secondary: "#1d4ed8",
      accent: "#f59e0b",
      bg: "#f8fafc",
      fg: "#111827",
    }),
  tipografia: z
    .object({
      heading: z.string().min(1).default("Onest"),
      body: z.string().min(1).default("Onest"),
    })
    .default({
      heading: "Onest",
      body: "Onest",
    }),
  contacto: z
    .object({
      email: z.string().email().or(z.literal("")).default(""),
      tel: z.string().default(""),
      whatsapp: z.string().default(""),
      direccion: z.string().default(""),
      horario: z.string().trim().optional(),
    })
    .default({
      email: "",
      tel: "",
      whatsapp: "",
      direccion: "",
    }),
  redes: z
    .object({
      ig: optionalUrlSchema,
      fb: optionalUrlSchema,
      linkedin: optionalUrlSchema,
      x: optionalUrlSchema,
    })
    .default({
      ig: "",
      fb: "",
      linkedin: "",
      x: "",
    }),
  servicios: z.array(serviceSchema).min(1).default([
    {
      titulo: "Diagnostico claro",
      desc: "Explica que haces, para quien y por que conviene elegirte.",
      icono: "search",
      url: "",
    },
    {
      titulo: "Oferta ordenada",
      desc: "Convierte servicios dispersos en una propuesta facil de entender.",
      icono: "layout",
      url: "",
    },
    {
      titulo: "Contacto directo",
      desc: "Lleva al visitante a escribir, llamar o pedir una cotizacion.",
      icono: "message",
      url: "",
    },
  ]),
  // One line that reframes the rubro (editorial-statement). Optional: with no
  // statement the section simply does not render.
  statement: z.string().default(""),
  statementAccent: z.string().default(""),
  // T9: el statement se toma una pantalla entera, con su fondo y su unica
  // accion. Declarado aca porque lo que el schema no nombra, lo descarta: el
  // bloque quedaria inalcanzable desde el JSON del cliente.
  statementPantalla: z.boolean().default(false),
  statementFondo: z.enum(["base", "marca", "tinta"]).default("base"),
  statementCta: z
    .object({
      // Sin texto o sin url no se dibuja el boton: un CTA muerto es peor que
      // ninguno.
      texto: z.string().default(""),
      url: z.string().default(""),
    })
    .default({ texto: "", url: "" }),
  // Legal line for the footer. Client-supplied: the factory never guesses the
  // holder or the year.
  footerLegal: z.string().default(""),
  newsletter: z
    .object({
      titulo: z.string().default(""),
      texto: z.string().default(""),
      // Form endpoint. Empty renders the band without a form instead of a dead input.
      accion: z.string().default(""),
      boton: z.string().default("Suscribirme"),
      nota: z.string().default(""),
    })
    .default({ titulo: "", texto: "", accion: "", boton: "Suscribirme", nota: "" }),
  metricas: z.array(metricaSchema).default([]),
  // Inline quote (the conversion block for a rubro whose lead is a price, not a
  // newsletter). Like the newsletter band: no `accion` or no `campos`, no form —
  // the direct contact stays as the way in.
  cotizacion: z
    .object({
      titulo: z.string().default(""),
      texto: z.string().default(""),
      accion: z.string().default(""),
      boton: z.string().default("Pedir cotizacion"),
      nota: z.string().default(""),
      campos: z.array(cotizacionCampoSchema).default([]),
    })
    .default({ titulo: "", texto: "", accion: "", boton: "Pedir cotizacion", nota: "", campos: [] }),
  categorias: z.array(z.string().min(1)).default([]),
  productos: z.array(productSchema).default([]),
  beneficios: z.array(z.string().min(1)).default([]),
  credenciales: z.array(z.string().min(1)).default([]),
  proceso: z.array(procesoPasoSchema).default([]),
  faq: z.array(faqItemSchema).default([]),
  referencias: z.array(referenceSchema).default([]),
  cta: z
    .object({
      texto: z.string().min(1).default("Agendar una llamada"),
      url: actionUrlSchema.default("/contacto"),
    })
    .default({
      texto: "Agendar una llamada",
      url: "/contacto",
    }),
  seo: z
    .object({
      title: z.string().min(1).default("ONIA Demo Client"),
      description: z
        .string()
        .min(1)
        .default("Sitio web generado por ONIA Web Factory."),
      ogImage: optionalUrlSchema,
    })
    .default({
      title: "ONIA Demo Client",
      description: "Sitio web generado por ONIA Web Factory.",
      ogImage: "",
    }),
  dashboard: dashboardSchema,
});

export type ClientProfile = z.infer<typeof clientSchema>;

export async function loadClientProfile(path: string): Promise<ClientProfile> {
  const raw = await readFile(path, "utf8");
  return clientSchema.parse(JSON.parse(raw));
}
