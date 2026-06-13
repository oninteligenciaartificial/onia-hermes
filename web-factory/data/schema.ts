import { readFile } from "node:fs/promises";
import { z } from "zod";

const hexColorSchema = z
  .string()
  .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Use a hex color like #0f766e.");

const optionalUrlSchema = z.union([z.string().url(), z.literal("")]).default("");

const actionUrlSchema = z
  .string()
  .min(1)
  .refine((value) => value.startsWith("/") || /^https?:\/\//.test(value), {
    message: "Use an absolute URL or a local path that starts with /.",
  });

const serviceSchema = z.object({
  titulo: z.string().min(1),
  desc: z.string().min(1),
  icono: z.string().min(1).default("sparkles"),
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
      heading: z.string().min(1).default("Inter"),
      body: z.string().min(1).default("Inter"),
    })
    .default({
      heading: "Inter",
      body: "Inter",
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
});

export type ClientProfile = z.infer<typeof clientSchema>;

export async function loadClientProfile(path: string): Promise<ClientProfile> {
  const raw = await readFile(path, "utf8");
  return clientSchema.parse(JSON.parse(raw));
}
