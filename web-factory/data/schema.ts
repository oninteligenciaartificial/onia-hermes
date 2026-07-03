import { readFile } from "node:fs/promises";
import { z } from "zod";

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
});

const dashboardChartSchema = z.object({
  title: z.string().min(1),
  unit: z.string().default(""),
  type: z.enum(["bar", "line"]).default("bar"),
  points: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.number(),
      }),
    )
    .default([]),
});

const dashboardTableSchema = z.object({
  title: z.string().default("Detalle"),
  columns: z.array(z.string().min(1)).default([]),
  rows: z.array(z.array(z.string())).default([]),
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
    },
    {
      titulo: "Oferta ordenada",
      desc: "Convierte servicios dispersos en una propuesta facil de entender.",
      icono: "layout",
    },
    {
      titulo: "Contacto directo",
      desc: "Lleva al visitante a escribir, llamar o pedir una cotizacion.",
      icono: "message",
    },
  ]),
  categorias: z.array(z.string().min(1)).default([]),
  productos: z.array(productSchema).default([]),
  beneficios: z.array(z.string().min(1)).default([]),
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
