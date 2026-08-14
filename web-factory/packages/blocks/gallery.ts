/**
 * The block catalog behind the living gallery (`pnpm blocks:demo`).
 *
 * One entry per renderable block: what it is, where it lives, what it takes, and
 * a sample render produced by the REAL function. Usage is NOT hand-kept here —
 * `readTemplateUsage` scans packages/templates/src and `readModelDemand` reads
 * data/references/reels/models, so "who uses this" and "what is still missing"
 * cannot drift from the code the way a written inventory does.
 *
 * gallery.test.ts asserts this catalog covers every render* export of src/index.ts.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  renderBenefitStrip,
  renderClinicFeature,
  renderClinicHero,
  renderClinicProcess,
  renderClinicServices,
  renderEditorialStatement,
  renderFaq,
  renderFeatures,
  renderFooter,
  renderFooterBrand,
  renderHero,
  renderInlineQuoteForm,
  renderMediaHero,
  renderNewsletterBand,
  renderPathCards,
  renderProcess,
  renderPropertyCards,
  renderScrollStoryHero,
  renderStatStrip,
  renderStickyCta,
  renderTrust,
} from "./src/index";
import { SAMPLE_CLIENT } from "./sample-client";

/** web-factory/ — resolved from this file so cwd never matters. */
export const FACTORY_ROOT = path.resolve(fileURLToPath(new URL(".", import.meta.url)), "..", "..");

/**
 * Which stylesheet a block needs to look like itself.
 * Blocks are grouped by it because the gallery renders each family inside its own
 * frame: mixing landing's bare `h1 {}` rule with the realestate sheet would make
 * the page lie about how the model blocks actually look in production.
 */
export type BlockFamily = "base" | "clinic" | "model";

export type GalleryBlock = {
  /**
   * Catalog id. For blocks born from a learned model this IS the model's own
   * section vocabulary (`media-hero`, `path-cards`…), which is how the gap list
   * matches catalog against demand without a translation table.
   */
  id: string;
  /** Exported function name — the key the usage scan looks for. */
  fn: string;
  /** Repo-relative source path. */
  file: string;
  /** One-line signature: what the block takes. */
  props: string;
  family: BlockFamily;
  /** Where the styles live. */
  css: string;
  /** What the block is for, one line. */
  note: string;
  /** Sample markup, rendered by the real function. */
  html: string;
};

/**
 * render* exports of src/index.ts that are not blocks. Listed so a new render
 * export either lands in the catalog or is deliberately declared a utility —
 * gallery.test.ts fails on anything that is neither.
 */
export const NON_BLOCK_RENDER_EXPORTS = [
  "renderIcon",
  "renderMotionStyles",
  "renderMotionScript",
  "renderMotionAssets",
] as const;

const SAMPLE_COPY = "Copy de muestra: aca va el dato real del cliente.";

export const GALLERY: readonly GalleryBlock[] = [
  {
    id: "hero",
    fn: "renderHero",
    file: "packages/blocks/src/hero.ts",
    props: "(client: SiteClient, options?: { focus?: boolean })",
    family: "base",
    css: "packages/templates/src/landing.ts (landingBaseCss)",
    note: "Apertura split: promesa + panel de prueba con los beneficios reales. focus:true saca nav y CTA secundario.",
    html: renderHero(SAMPLE_CLIENT),
  },
  {
    id: "hero-focus",
    fn: "renderHero",
    file: "packages/blocks/src/hero.ts",
    props: "renderHero(client, { focus: true })",
    family: "base",
    css: "packages/templates/src/landing.ts (landingBaseCss)",
    note: "Variante de landing de conversion: sin nav ni CTA secundario, una sola salida.",
    html: renderHero(SAMPLE_CLIENT, { focus: true }),
  },
  {
    id: "trust",
    fn: "renderTrust",
    file: "packages/blocks/src/trust.ts",
    props: "(client: SiteClient) · lee credenciales[]",
    family: "base",
    css: "packages/templates/src/landing.ts (landingBaseCss)",
    note: "Tira de credenciales. Sin credenciales no renderiza nada: no inventa prueba.",
    html: renderTrust(SAMPLE_CLIENT),
  },
  {
    id: "features",
    fn: "renderFeatures",
    file: "packages/blocks/src/features.ts",
    props: "(client: SiteClient) · lee servicios[{ titulo, desc, icono }]",
    family: "base",
    css: "packages/templates/src/landing.ts (landingBaseCss)",
    note: "Grilla de servicios con icono real por servicio (icons.ts), no iniciales.",
    html: renderFeatures(SAMPLE_CLIENT),
  },
  {
    id: "process",
    fn: "renderProcess",
    file: "packages/blocks/src/process.ts",
    props: "(client: SiteClient) · lee proceso[], procesoKicker, procesoTitulo",
    family: "base",
    css: "packages/templates/src/landing.ts (landingBaseCss)",
    note: "Que pasa despues del contacto. Pasos con verbo: baja la ansiedad de agendar.",
    html: renderProcess(SAMPLE_CLIENT),
  },
  {
    id: "faq",
    fn: "renderFaq",
    file: "packages/blocks/src/faq.ts",
    props: "(client: SiteClient) · lee faq[{ pregunta, respuesta }]",
    family: "base",
    css: "packages/templates/src/landing.ts (landingBaseCss)",
    note: "Objeciones con <details> nativo: accesible por teclado y 0kb de JS.",
    html: renderFaq(SAMPLE_CLIENT),
  },
  {
    id: "footer",
    fn: "renderFooter",
    file: "packages/blocks/src/footer.ts",
    props: "(client: SiteClient, options?: { minimal?: boolean })",
    family: "base",
    css: "packages/templates/src/landing.ts (landingBaseCss)",
    note: "Pie con contacto y redes. minimal:true saca las redes (salidas) en landings de conversion.",
    html: renderFooter(SAMPLE_CLIENT),
  },
  {
    id: "sticky-cta",
    fn: "renderStickyCta",
    file: "packages/blocks/src/sticky-cta.ts",
    props: "(client: SiteClient) · lee cta{ texto, url }",
    family: "base",
    css: "packages/templates/src/landing.ts (landingBaseCss)",
    note: "Ancla de conversion fija (position:fixed, sin JS) para trafico de WhatsApp y redes.",
    html: renderStickyCta(SAMPLE_CLIENT),
  },

  {
    id: "clinic-hero",
    fn: "renderClinicHero",
    file: "packages/blocks/src/clinic-hero.ts",
    props: "(client: SiteClient) · heroPoster, tagline, credenciales|beneficios, cta",
    family: "clinic",
    css: "packages/templates/src/clinic-css.ts",
    note: "Hero full-bleed: foto dominante, nav superpuesta, titular sobre scrim. La media es objetivo de parallax.",
    html: renderClinicHero(SAMPLE_CLIENT),
  },
  {
    id: "clinic-services",
    fn: "renderClinicServices",
    file: "packages/blocks/src/clinic-services.ts",
    props: "(client: SiteClient) · lee servicios[]",
    family: "clinic",
    css: "packages/templates/src/clinic-css.ts",
    note: "Bento de servicios: la primera celda pesa mas. Rompe la grilla de tarjetas iguales.",
    html: renderClinicServices(SAMPLE_CLIENT),
  },
  {
    id: "clinic-feature",
    fn: "renderClinicFeature",
    file: "packages/blocks/src/clinic-feature.ts",
    props: "(client: SiteClient) · requiere imagenSecundaria; sin ella devuelve \"\"",
    family: "clinic",
    css: "packages/templates/src/clinic-css.ts",
    note: "Banda editorial imagen + copy que rompe el ritmo de secciones a mitad de pagina.",
    html: renderClinicFeature(SAMPLE_CLIENT),
  },
  {
    id: "clinic-process",
    fn: "renderClinicProcess",
    file: "packages/blocks/src/clinic-process.ts",
    props: "(client: SiteClient) · lee proceso[]",
    family: "clinic",
    css: "packages/templates/src/clinic-css.ts",
    note: "Proceso como linea de tiempo conectada (no cuatro tarjetas iguales).",
    html: renderClinicProcess(SAMPLE_CLIENT),
  },

  {
    id: "media-hero",
    fn: "renderMediaHero",
    file: "packages/blocks/src/media-hero.ts",
    props: "({ brand, headline, cta:{label,url}, kicker?, sub?, nav?, media?:{src,alt} })",
    family: "model",
    css: "MEDIA_HERO_CSS (mismo archivo)",
    note: "Pantalla de apertura full-bleed. El titular entra por palabras (split-text con wf-stagger) y la media revela con clip-path.",
    html: renderMediaHero({
      brand: "Marca de muestra",
      kicker: "Santa Cruz de la Sierra",
      headline: "El titular entra palabra por palabra",
      sub: SAMPLE_COPY,
      cta: { label: "Hablar por WhatsApp", url: "#top" },
      nav: [
        { label: "Caminos", url: "#top" },
        { label: "Cartera", url: "#top" },
        { label: "Contacto", url: "#top" },
      ],
      media: { src: "./assets/hero-placeholder.svg", alt: "Imagen de muestra del hero" },
    }),
  },
  {
    id: "scroll-story-hero",
    fn: "renderScrollStoryHero",
    file: "packages/blocks/src/scroll-story-hero.ts",
    props:
      "({ brand, headline, ctaPrimary:{label,url}, kicker?, sub?, ctaSecondary?, nav?, frames?:[{src,alt,stage}], stepsLabel? })",
    family: "model",
    css: "SCROLL_STORY_HERO_CSS (mismo archivo)",
    note: "Apertura donde el scroll AVANZA la escena: una etapa por tramo (sticky + scrub, sin 3D ni libreria). Cada etapa tambien es texto, asi que la historia se lee sin JS.",
    html: renderScrollStoryHero({
      brand: "Marca de muestra",
      kicker: "Santa Cruz de la Sierra",
      headline: "El scroll avanza la escena",
      sub: SAMPLE_COPY,
      ctaPrimary: { label: "Pedir cotizacion", url: "#top" },
      ctaSecondary: { label: "Ver cobertura", url: "#top" },
      nav: [
        { label: "Servicios", url: "#top" },
        { label: "Cifras", url: "#top" },
        { label: "Cotizar", url: "#top" },
      ],
      frames: [
        { src: "./assets/etapa-1-deposito.svg", alt: "Imagen de muestra de la etapa 1", stage: "Etapa de muestra" },
        { src: "./assets/etapa-2-ruta.svg", alt: "Imagen de muestra de la etapa 2", stage: "Etapa de muestra" },
        { src: "./assets/etapa-3-entrega.svg", alt: "Imagen de muestra de la etapa 3", stage: "Etapa de muestra" },
      ],
    }),
  },
  {
    id: "stat-strip",
    fn: "renderStatStrip",
    file: "packages/blocks/src/stat-strip.ts",
    props: "({ items:[{ value, label, source?, placeholder? }], label?, heading?, note?, id? })",
    family: "model",
    css: "STAT_STRIP_CSS (mismo archivo)",
    note: "Prueba con numeros reales: cuenta hasta el valor al entrar en viewport. Sin items no hay seccion, y un dato sin confirmar sale etiquetado en vez de inventado.",
    html: renderStatStrip({
      label: "en numeros",
      heading: "Cifras de muestra",
      items: [
        { value: "4.200", label: "Metrica de muestra (cuenta al entrar)", source: "fuente de muestra" },
        { value: "9 ciudades", label: "Metrica de muestra con sufijo" },
        { value: "Bs 1.200", label: "Un monto nunca baila (regla 7 del banco de patrones)" },
        { value: "—", label: "Dato que el cliente todavia no confirmo", placeholder: true },
      ],
      note: "Nota de muestra: las cifras reales y su fuente las confirma el cliente.",
    }),
  },
  {
    id: "inline-quote-form",
    fn: "renderInlineQuoteForm",
    file: "packages/blocks/src/inline-quote-form.ts",
    props:
      "({ heading, action, fields:[{name,label,type?,required?,options?}], copy?, submitLabel?, source?, note?, direct?, id? })",
    family: "model",
    css: "INLINE_QUOTE_FORM_CSS (mismo archivo)",
    note: "Cotizacion inline: los campos son props, asi que el mismo bloque sirve a logistica, importacion o instalacion. Sin endpoint no hay formulario, pero el contacto directo queda.",
    html: renderInlineQuoteForm({
      heading: "Titular de muestra",
      copy: SAMPLE_COPY,
      action: "#top",
      source: "blocks-demo",
      note: "Nota de muestra: que pasa despues de enviar el formulario.",
      fields: [
        { name: "nombre", label: "Campo de muestra", required: true },
        { name: "telefono", label: "Campo de muestra", type: "tel", required: true },
        { name: "carga", label: "Campo de muestra (opciones)", type: "select", options: ["Opcion A", "Opcion B"] },
        { name: "detalle", label: "Campo de muestra (texto largo)", type: "textarea" },
      ],
      direct: [
        { label: "WhatsApp", value: "Dato de muestra", url: "#top" },
        { label: "Deposito", value: "Direccion de muestra" },
      ],
    }),
  },
  {
    id: "editorial-statement",
    fn: "renderEditorialStatement",
    file: "packages/blocks/src/editorial-statement.ts",
    props: "({ statement, label?, accent? })",
    family: "model",
    css: "EDITORIAL_STATEMENT_CSS (mismo archivo)",
    note: "Una linea sobredimensionada que reencuadra el rubro: el salto de escala entre el hero y la oferta.",
    html: renderEditorialStatement({
      label: "el bloque",
      statement: "Una linea reencuadra el rubro y sube el tono de toda la pagina",
      accent: "por el precio de una frase.",
    }),
  },
  {
    id: "path-cards",
    fn: "renderPathCards",
    file: "packages/blocks/src/path-cards.ts",
    props: "({ cards:[{ title, copy, icon?, cta:{label,url} }], label?, heading?, id? })",
    family: "model",
    css: "PATH_CARDS_CSS (mismo archivo)",
    note: "Caminos explicitos de entrada. Tres intenciones distintas, tres siguientes pasos distintos: es lo que convierte.",
    html: renderPathCards({
      label: "como podemos ayudarte",
      heading: "Tres caminos, un solo contacto",
      cards: [
        { title: "Camino de muestra", copy: SAMPLE_COPY, icon: "search", cta: { label: "Ver opciones", url: "#top" } },
        { title: "Camino de muestra", copy: SAMPLE_COPY, icon: "chart", cta: { label: "Pedir tasacion", url: "#top" } },
        { title: "Camino de muestra", copy: SAMPLE_COPY, icon: "calendar", cta: { label: "Agendar visita", url: "#top" } },
      ],
    }),
  },
  {
    id: "property-cards",
    fn: "renderPropertyCards",
    file: "packages/blocks/src/property-cards.ts",
    props: "({ items:[{ title, price, location?, specs?, media?, url?, placeholder? }], label?, heading?, note?, id? })",
    family: "model",
    css: "PROPERTY_CARDS_CSS (mismo archivo)",
    note: "Grilla de cartera con el precio visible en la tarjeta. placeholder:true marca la fila como muestra.",
    html: renderPropertyCards({
      label: "cartera",
      heading: "Grilla de catalogo",
      note: "Nota de muestra: el portafolio real lo manda el cliente.",
      items: [
        {
          title: "Ficha de muestra",
          price: "USD 000.000",
          location: "Zona de muestra",
          specs: [
            { label: "dorm.", value: "0" },
            { label: "banos", value: "0" },
            { label: "m2", value: "000" },
          ],
          media: { src: "./assets/propiedad-placeholder.svg", alt: "Imagen de muestra de la ficha" },
          url: "#top",
          placeholder: true,
        },
        {
          title: "Ficha de muestra",
          price: "USD 000.000",
          location: "Zona de muestra",
          specs: [
            { label: "dorm.", value: "0" },
            { label: "m2", value: "000" },
          ],
          media: { src: "./assets/propiedad-placeholder.svg", alt: "Imagen de muestra de la ficha" },
          placeholder: true,
        },
      ],
    }),
  },
  {
    id: "benefit-strip",
    fn: "renderBenefitStrip",
    file: "packages/blocks/src/benefit-strip.ts",
    props: "({ items:[{ title, copy?, icon? }], label?, layout?: \"grid\" | \"row\" })",
    family: "model",
    css: "BENEFIT_STRIP_CSS (mismo archivo)",
    note: "Baja la promesa a terminos concretos. Dos layouts con la misma data: grid (icono+titulo+copy) y row (solo claims).",
    html: `${renderBenefitStrip({
      label: "layout: grid",
      items: [
        { icon: "map-pin", title: "Titulo de muestra", copy: SAMPLE_COPY },
        { icon: "clock", title: "Titulo de muestra", copy: SAMPLE_COPY },
        { icon: "shield-check", title: "Titulo de muestra", copy: SAMPLE_COPY },
      ],
    })}${renderBenefitStrip({
      label: "layout: row",
      layout: "row",
      items: [{ title: "Claim de muestra" }, { title: "Claim de muestra" }, { title: "Claim de muestra" }],
    })}`,
  },
  {
    id: "newsletter-band",
    fn: "renderNewsletterBand",
    file: "packages/blocks/src/newsletter-band.ts",
    props: "({ heading, action, copy?, buttonLabel?, fieldLabel?, source?, note?, id? })",
    family: "model",
    css: "NEWSLETTER_BAND_CSS (mismo archivo)",
    note: "Captura de cierre para quien no compra hoy. source viaja como campo oculto src= al pipeline de leads.",
    html: renderNewsletterBand({
      heading: "Titular de muestra",
      copy: SAMPLE_COPY,
      action: "#top",
      note: "Nota de muestra: a que se esta suscribiendo el visitante.",
      source: "blocks-demo",
    }),
  },
  {
    id: "footer-brand",
    fn: "renderFooterBrand",
    file: "packages/blocks/src/footer-brand.ts",
    props: "({ brand, statement?, groups?, legal?, reveal? })",
    family: "model",
    css: "FOOTER_BRAND_CSS (mismo archivo)",
    note: "Banda de cierre: el wordmark tratado como grafico. Sin groups queda la variante band de lecercle.",
    html: renderFooterBrand({
      brand: "Marca de muestra",
      statement: "Una linea de cierre con lo que hace la marca y donde opera.",
      groups: [
        {
          title: "Navegacion",
          items: [
            { label: "Inicio", url: "#top" },
            { label: "Servicios", url: "#top" },
            { label: "Contacto", url: "#top" },
          ],
        },
        {
          title: "Contacto",
          items: [{ label: "hola@ejemplo.test", url: "mailto:hola@ejemplo.test" }, { label: "Direccion de muestra" }],
        },
      ],
      legal: "Linea legal de muestra, el titular y el ano los pone el cliente.",
    }),
  },
];

/**
 * fn name -> template ids that call it, read from packages/templates/src.
 * A block nobody calls comes back with an empty list: that is the orphan check,
 * computed instead of remembered.
 */
export async function readTemplateUsage(root = FACTORY_ROOT): Promise<Map<string, string[]>> {
  const dir = path.join(root, "packages", "templates", "src");
  const files = (await readdir(dir)).filter((name) => name.endsWith(".ts") && !name.endsWith(".test.ts"));
  const usage = new Map<string, string[]>();

  for (const block of GALLERY) {
    usage.set(block.fn, []);
  }

  for (const file of files) {
    const templateId = file.replace(/\.ts$/, "");
    if (templateId === "index") continue;

    const source = await readFile(path.join(dir, file), "utf8");
    for (const [fn, templates] of usage) {
      // The paren matters: `renderFooter(` must not match `renderFooterBrand(`.
      if (new RegExp(`\\b${fn}\\(`).test(source) && !templates.includes(templateId)) {
        templates.push(templateId);
      }
    }
  }

  return usage;
}

export type ModelDemand = {
  /** Block id in the models' own vocabulary. */
  block: string;
  /** Model ids that ask for it. */
  models: string[];
};

/**
 * What the learned models ask for, read from data/references/reels/models/*.json.
 * Sorted by how many models need each block, so the gap list is already ordered
 * by how much it unblocks.
 */
export async function readModelDemand(root = FACTORY_ROOT): Promise<ModelDemand[]> {
  const dir = path.join(root, "data", "references", "reels", "models");
  const files = (await readdir(dir)).filter((name) => name.endsWith(".json"));
  const demand = new Map<string, string[]>();

  for (const file of files) {
    const model = JSON.parse(await readFile(path.join(dir, file), "utf8")) as {
      id?: string;
      sections?: Array<{ block?: string }>;
    };
    const modelId = model.id ?? file.replace(/\.json$/, "");

    for (const section of model.sections ?? []) {
      if (!section.block) continue;
      const models = demand.get(section.block) ?? [];
      if (!models.includes(modelId)) models.push(modelId);
      demand.set(section.block, models);
    }
  }

  return [...demand.entries()]
    .map(([block, models]) => ({ block, models }))
    .sort((a, b) => b.models.length - a.models.length || a.block.localeCompare(b.block));
}

/** Blocks the models ask for that the factory cannot build yet. */
export function modelGaps(demand: readonly ModelDemand[]): ModelDemand[] {
  const built = new Set(GALLERY.map((block) => block.id));
  return demand.filter((entry) => !built.has(entry.block));
}
