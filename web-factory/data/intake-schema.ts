import { z } from "zod";
import { clientSchema, WEB_FACTORY_TEMPLATES, type ClientProfile } from "./schema";

const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase URL slug.");

const optionalAssetSchema = z
  .union([
    z.string().url(),
    z.string().regex(/^assets\/[a-zA-Z0-9._/-]+$/, "Use a relative asset path like assets/hero.webp."),
    z.literal(""),
  ])
  .default("");

const hexColorSchema = z
  .string()
  .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Use a hex color like #0f766e.");

const ctaUrlSchema = z
  .string()
  .default("")
  .transform((value) => value.trim());

const referenceSchema = z.object({
  title: z.string().default(""),
  url: z.string().url(),
  type: z
    .enum(["visual", "layout", "copy", "product", "competitor", "anti-reference"])
    .default("visual"),
  use: z.string().default(""),
  avoid: z.string().default(""),
});

const intakeServiceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().default("sparkles"),
});

const intakeProductSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  price: z.string().min(1).default("Consultar"),
  priceValue: z.number().positive().optional(),
  currency: z.string().default("BOB"),
  description: z.string().min(1),
  label: z.string().default("Nuevo"),
  image: optionalAssetSchema,
  imageAlt: z.string().default(""),
  brand: z.string().default(""),
  size: z.string().default(""),
  use: z.string().default(""),
  benefits: z.array(z.string().min(1)).default([]),
  idealFor: z.array(z.string().min(1)).default([]),
  ingredients: z.array(z.string().min(1)).default([]),
  usage: z.string().default(""),
  included: z.array(z.string().min(1)).default([]),
  specs: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.string().min(1),
      }),
    )
    .default([]),
});

const intakeDashboardKpiSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  delta: z.string().default(""),
  trend: z.enum(["up", "down", "flat"]).default("flat"),
  context: z.string().default(""),
});

const intakeDashboardChartSchema = z.object({
  title: z.string().min(1),
  unit: z.string().default(""),
  type: z.enum(["bar", "line", "donut", "sparkline", "radial"]).default("bar"),
  points: z.array(z.object({ label: z.string().min(1), value: z.number() })).default([]),
  series: z
    .array(
      z.object({
        name: z.string().min(1),
        points: z.array(z.object({ label: z.string().min(1), value: z.number() })).default([]),
      }),
    )
    .default([]),
});

const intakeDashboardSchema = z
  .object({
    title: z.string().default("Panel de control"),
    subtitle: z.string().default(""),
    nav: z.array(z.string().min(1)).default([]),
    filters: z.array(z.string().min(1)).default([]),
    kpis: z.array(intakeDashboardKpiSchema).default([]),
    charts: z.array(intakeDashboardChartSchema).default([]),
    table: z
      .object({
        title: z.string().default("Detalle"),
        columns: z.array(z.string().min(1)).default([]),
        rows: z.array(z.array(z.string())).default([]),
      })
      .default({ title: "Detalle", columns: [], rows: [] }),
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

export const webFactoryIntakeSchema = z.object({
  project: z.object({
    slug: slugSchema,
    template: z.enum(WEB_FACTORY_TEMPLATES).default("landing"),
    package: z.string().default("web"),
    owner: z.string().default("ONIA"),
  }),
  business: z.object({
    name: z.string().min(1),
    industry: z.string().min(1),
    offer: z.string().min(1),
    tagline: z.string().default(""),
    description: z.string().default(""),
    location: z.string().default(""),
    hours: z.string().default(""),
    trustProofs: z.array(z.string().min(1)).default([]),
  }),
  brand: z
    .object({
      logoText: z.string().default(""),
      logoIcon: optionalAssetSchema,
      logoWide: optionalAssetSchema,
      colors: z
        .object({
          primary: hexColorSchema.optional(),
          secondary: hexColorSchema.optional(),
          accent: hexColorSchema.optional(),
          bg: hexColorSchema.optional(),
          fg: hexColorSchema.optional(),
        })
        .default({}),
      typography: z
        .object({
          heading: z.string().default("Onest"),
          body: z.string().default("Onest"),
        })
        .default({ heading: "Onest", body: "Onest" }),
      styleKeywords: z.array(z.string().min(1)).default([]),
      references: z.array(referenceSchema).default([]),
      antiReferences: z.array(referenceSchema).default([]),
    })
    .default({
      logoText: "",
      logoIcon: "",
      logoWide: "",
      colors: {},
      typography: { heading: "Onest", body: "Onest" },
      styleKeywords: [],
      references: [],
      antiReferences: [],
    }),
  media: z
    .object({
      heroVideo: optionalAssetSchema,
      heroPoster: optionalAssetSchema,
      heroImage: optionalAssetSchema,
      assetPermission: z
        .enum(["client-owned", "generate-ai", "stock-licensed", "pending"])
        .default("pending"),
      notes: z.string().default(""),
    })
    .default({
      heroVideo: "",
      heroPoster: "",
      heroImage: "",
      assetPermission: "pending",
      notes: "",
    }),
  content: z
    .object({
      services: z.array(intakeServiceSchema).default([]),
      benefits: z.array(z.string().min(1)).default([]),
      categories: z.array(z.string().min(1)).default([]),
      products: z.array(intakeProductSchema).default([]),
      faqs: z
        .array(
          z.object({
            question: z.string().min(1),
            answer: z.string().min(1),
          }),
      )
        .default([]),
      proceso: z
        .array(
          z.object({
            title: z.string().min(1),
            description: z.string().min(1),
          }),
        )
        .default([]),
    })
    .default({
      services: [],
      benefits: [],
      categories: [],
      products: [],
      faqs: [],
      proceso: [],
    }),
  conversion: z
    .object({
      primaryCtaText: z.string().default("Solicitar informacion"),
      primaryCtaUrl: ctaUrlSchema,
      whatsappMessage: z.string().default(""),
    })
    .default({
      primaryCtaText: "Solicitar informacion",
      primaryCtaUrl: "",
      whatsappMessage: "",
    }),
  contact: z
    .object({
      email: z.string().email().or(z.literal("")).default(""),
      phone: z.string().default(""),
      whatsapp: z.string().default(""),
      address: z.string().default(""),
    })
    .default({
      email: "",
      phone: "",
      whatsapp: "",
      address: "",
    }),
  social: z
    .object({
      instagram: z.string().url().or(z.literal("")).default(""),
      facebook: z.string().url().or(z.literal("")).default(""),
      linkedin: z.string().url().or(z.literal("")).default(""),
      x: z.string().url().or(z.literal("")).default(""),
      tiktok: z.string().url().or(z.literal("")).default(""),
    })
    .default({
      instagram: "",
      facebook: "",
      linkedin: "",
      x: "",
      tiktok: "",
    }),
  seo: z
    .object({
      title: z.string().default(""),
      description: z.string().default(""),
      keywords: z.array(z.string().min(1)).default([]),
      ogImage: z.string().url().or(z.literal("")).default(""),
    })
    .default({
      title: "",
      description: "",
      keywords: [],
      ogImage: "",
    }),
  /* Pedido de cotizacion/contacto de la web (circuito web → sistema). Claves en
   * espanol porque pasan TAL CUAL al perfil (misma forma que data/schema.ts);
   * traducirlas aca solo fabricaria un mapeo mas que mantener. */
  cotizacion: z
    .object({
      titulo: z.string().default(""),
      texto: z.string().default(""),
      accion: z.string().default(""),
      boton: z.string().default("Pedir cotizacion"),
      nota: z.string().default(""),
      campos: z
        .array(
          z.object({
            nombre: z.string().min(1),
            label: z.string().min(1),
            tipo: z
              .enum(["text", "email", "tel", "number", "date", "textarea", "select"])
              .default("text"),
            requerido: z.boolean().default(false),
            opciones: z.array(z.string().min(1)).default([]),
            placeholder: z.string().default(""),
            autocomplete: z.string().default(""),
          }),
        )
        .default([]),
    })
    .default({
      titulo: "",
      texto: "",
      accion: "",
      boton: "Pedir cotizacion",
      nota: "",
      campos: [],
    }),
  operations: z
    .object({
      domain: z.string().default(""),
      hosting: z.string().default(""),
      paymentMethods: z.array(z.string().min(1)).default([]),
      legalName: z.string().default(""),
      taxId: z.string().default(""),
      missing: z.array(z.string().min(1)).default([]),
    })
    .default({
      domain: "",
      hosting: "",
      paymentMethods: [],
      legalName: "",
      taxId: "",
      missing: [],
    }),
  dashboard: intakeDashboardSchema,
});

export type WebFactoryIntake = z.infer<typeof webFactoryIntakeSchema>;

export function buildClientProfileFromIntake(input: unknown): ClientProfile {
  const intake = webFactoryIntakeSchema.parse(input);
  const references = [...intake.brand.references, ...intake.brand.antiReferences];
  const products = intake.content.products.map((product) => ({
    titulo: product.title,
    categoria: product.category,
    precio: product.price,
    precioValor: product.priceValue,
    moneda: product.currency,
    desc: product.description,
    etiqueta: product.label,
    imagen: product.image,
    imagenAlt: product.imageAlt,
    marca: product.brand,
    tamano: product.size,
    uso: product.use,
    beneficios: product.benefits,
    idealPara: product.idealFor,
    ingredientesClave: product.ingredients,
    modoUso: product.usage,
    incluye: product.included,
    especificaciones: product.specs,
  }));

  const profile = {
    nombre: intake.business.name,
    slug: intake.project.slug,
    tagline: intake.business.tagline || intake.business.offer,
    descripcion:
      intake.business.description ||
      `${intake.business.name} ayuda a clientes de ${intake.business.industry} con ${intake.business.offer}.`,
    logo: intake.brand.logoText,
    logoIcon: intake.brand.logoIcon,
    logoWide: intake.brand.logoWide,
    heroVideo: intake.media.heroVideo,
    heroPoster: intake.media.heroPoster || intake.media.heroImage,
    // heroImage cumple doble rol: si no hay heroPoster, ES el hero (linea de
    // arriba); si hay ambos y son distintos, pasa a ser la imagen secundaria
    // (la que enciende la banda editorial del template clinic).
    imagenSecundaria:
      intake.media.heroPoster &&
      intake.media.heroImage &&
      intake.media.heroImage !== intake.media.heroPoster
        ? intake.media.heroImage
        : "",
    colores: {
      primary: intake.brand.colors.primary ?? "#0f766e",
      secondary: intake.brand.colors.secondary ?? "#1d4ed8",
      accent: intake.brand.colors.accent ?? "#f59e0b",
      bg: intake.brand.colors.bg ?? "#f8fafc",
      fg: intake.brand.colors.fg ?? "#111827",
    },
    tipografia: {
      heading: intake.brand.typography.heading,
      body: intake.brand.typography.body,
    },
    contacto: {
      email: intake.contact.email,
      tel: intake.contact.phone,
      whatsapp: intake.contact.whatsapp,
      direccion: intake.contact.address || intake.business.location,
      ...(intake.business.hours.trim() ? { horario: intake.business.hours.trim() } : {}),
    },
    redes: {
      ig: intake.social.instagram,
      fb: intake.social.facebook,
      linkedin: intake.social.linkedin,
      x: intake.social.x,
    },
    servicios: buildServices(intake),
    categorias: intake.content.categories.length
      ? intake.content.categories
      : getUnique(products.map((product) => product.categoria)),
    productos: products,
    beneficios: intake.content.benefits,
    credenciales: intake.business.trustProofs,
    proceso: intake.content.proceso.map((paso) => ({
      titulo: paso.title,
      desc: paso.description,
    })),
    faq: intake.content.faqs.map((item) => ({
      pregunta: item.question,
      respuesta: item.answer,
    })),
    cotizacion: intake.cotizacion,
    referencias: references,
    cta: {
      texto: intake.conversion.primaryCtaText,
      url: buildPrimaryCtaUrl(intake),
    },
    seo: {
      title: intake.seo.title || `${intake.business.name} | ${intake.business.offer}`,
      description: intake.seo.description || intake.business.description || intake.business.offer,
      ogImage: intake.seo.ogImage,
    },
    dashboard: intake.dashboard,
  };

  return clientSchema.parse(profile);
}

export function getMissingClientInputs(input: unknown): string[] {
  const intake = webFactoryIntakeSchema.parse(input);
  const missing = new Set<string>(intake.operations.missing);

  if (intake.project.template === "landing-clinic" && !intake.business.hours.trim()) {
    missing.add("horarios de atención confirmados");
  }

  if (!intake.brand.logoText && !intake.brand.logoIcon && !intake.brand.logoWide) {
    missing.add("logo o marca visual");
  }

  if (!intake.brand.references.length) {
    missing.add("referencias visuales exactas");
  }

  if (!intake.media.heroVideo && !intake.media.heroPoster && !intake.media.heroImage) {
    missing.add(
      intake.media.assetPermission === "pending"
        ? "asset principal del hero o permiso para generarlo"
        : "asset principal del hero pendiente de producir",
    );
  }

  if (!intake.contact.whatsapp && !intake.contact.email && !intake.conversion.primaryCtaUrl) {
    missing.add("canal de conversion");
  }

  if (intake.project.template === "store" && !intake.content.products.length) {
    missing.add("productos con precio/descripcion/imagen");
  }

  if (intake.project.template === "store" && !intake.operations.paymentMethods.length) {
    missing.add("metodos de pago y politicas comerciales");
  }

  if (
    intake.project.template === "dashboard" &&
    !intake.dashboard.kpis.length &&
    !intake.dashboard.charts.length
  ) {
    missing.add("metricas/KPIs o series de datos aprobadas para el panel");
  }

  if (!intake.operations.domain) {
    missing.add("dominio o decision de hosting");
  }

  return Array.from(missing);
}

export function buildClientContextMarkdown(input: unknown): string {
  const intake = webFactoryIntakeSchema.parse(input);
  const missing = getMissingClientInputs(intake);
  const references = [...intake.brand.references, ...intake.brand.antiReferences];

  return `# ${intake.business.name} - Web Factory Context

## Brief

- Slug: \`${intake.project.slug}\`
- Template: \`${intake.project.template}\`
- Rubro: ${intake.business.industry}
- Oferta: ${intake.business.offer}
- Responsable: ${intake.project.owner}
- Paquete: ${intake.project.package}

## Referencias

${references.length ? references.map((reference) => `- ${reference.title || reference.url}: ${reference.url} (${reference.type})${reference.use ? ` | usar: ${reference.use}` : ""}${reference.avoid ? ` | evitar: ${reference.avoid}` : ""}`).join("\n") : "- Pendiente: agregar referencias exactas."}

## Media

- Permiso de assets: ${intake.media.assetPermission}
- Hero video: ${intake.media.heroVideo || "pendiente"}
- Hero poster/imagen: ${intake.media.heroPoster || intake.media.heroImage || "pendiente"}
- Notas: ${intake.media.notes || "sin notas"}

## Operacion

- Dominio: ${intake.operations.domain || "pendiente"}
- Hosting: ${intake.operations.hosting || "pendiente"}
- Pagos: ${intake.operations.paymentMethods.join(", ") || "pendiente"}
- Legal/fiscal: ${[intake.operations.legalName, intake.operations.taxId].filter(Boolean).join(" / ") || "pendiente"}

## Pendientes antes de entrega

${missing.length ? missing.map((item) => `- ${item}`).join("\n") : "- Sin pendientes criticos para preview inicial."}
`;
}

function buildServices(intake: WebFactoryIntake) {
  if (intake.content.services.length) {
    return intake.content.services.map((service) => ({
      titulo: service.title,
      desc: service.description,
      icono: service.icon,
    }));
  }

  return [
    {
      titulo: "Propuesta clara",
      desc: `Explica ${intake.business.offer} sin hacer que el visitante adivine el valor.`,
      icono: "layout",
    },
    {
      titulo: "Confianza rapida",
      desc: intake.business.trustProofs[0] || `Presenta experiencia y senales reales de ${intake.business.industry}.`,
      icono: "shield",
    },
    {
      titulo: "Contacto directo",
      desc: "Lleva al visitante al canal correcto para cotizar, reservar o comprar.",
      icono: "message",
    },
  ];
}

function buildPrimaryCtaUrl(intake: WebFactoryIntake): string {
  if (intake.conversion.primaryCtaUrl) {
    return intake.conversion.primaryCtaUrl;
  }

  if (intake.contact.whatsapp) {
    const phone = intake.contact.whatsapp.replace(/[^\d]/g, "");
    const text = intake.conversion.whatsappMessage || `Hola, quiero informacion sobre ${intake.business.name}.`;
    return phone ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}` : "#contacto";
  }

  if (intake.contact.email) {
    return `mailto:${intake.contact.email}`;
  }

  return "#contacto";
}

function getUnique(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}
