import {
  BENEFIT_STRIP_CSS,
  FOOTER_BRAND_CSS,
  INLINE_QUOTE_FORM_CSS,
  SCROLL_STORY_HERO_CSS,
  STAT_STRIP_CSS,
  escapeHtml,
  renderBenefitStrip,
  renderFooterBrand,
  renderInlineQuoteForm,
  renderMotionScript,
  renderMotionStyles,
  renderScrollStoryHero,
  renderStatStrip,
  type QuoteField,
  type ScrollStoryFrame,
  type StatItem,
} from "@onia/blocks";
import { clientTokenCss } from "@onia/tokens";
import type { LandingClient } from "./landing";

/**
 * Generated from the learned model `unitedcarriers-logistics`
 * (data/references/reels/models/unitedcarriers-logistics.json · confidence medium).
 * For any client that sells an INVISIBLE PROCESS — logistica, transporte,
 * importacion, distribucion, instalacion — where the job of the page is to make
 * that process visible.
 *
 * Model flow:  scroll-story-hero -> scroll-story -> benefit-strip -> stat-strip
 *              -> inline-quote-form -> footer-brand
 * Built here:  scroll-story-hero -> benefit-strip -> stat-strip
 *              -> inline-quote-form -> footer-brand
 *
 * The one gap is deliberate and named: `scroll-story` (the pinned mid-page
 * section that advances a stage per screen) is NOT built yet, so this template
 * does not fake it with a stack of cards. The hero carries the stages instead —
 * it is the same scrub over the same client photos, and each stage is also text
 * in an ordered list, so the process is legible with no JS, on a screen reader
 * and under reduced motion. When the dedicated block lands, it slots in at
 * position 1 and the hero keeps its own scene.
 *
 * The model's palette is NOT copied. Its hexes are roles (bg / surface / accent /
 * text / detail) mapped onto the client's ONIA tokens:
 *   bg -> --color-bg · text -> --color-fg · accent ("el azul de ruta") ->
 *   --color-primary · detail -> color-mix over --color-fg · surface ->
 *   --color-surface. No literal color ships.
 *
 * The JS budget note from the model is honored by construction: no 3D engine,
 * no scroll library. The scene is the client's real photos cross-faded by the
 * shared motion runtime (pattern bank P3, sticky + scrub), which is the 2D
 * fallback the model itself prescribes.
 */

export type LogisticsMetric = {
  valor: string;
  label: string;
  fuente: string;
  esMuestra: boolean;
};

export type LogisticsQuoteField = {
  nombre: string;
  label: string;
  tipo: "text" | "email" | "tel" | "number" | "date" | "textarea" | "select";
  requerido: boolean;
  opciones: string[];
  placeholder: string;
  autocomplete: string;
};

export type LogisticsClient = LandingClient & {
  metricas: LogisticsMetric[];
  cotizacion: {
    titulo: string;
    texto: string;
    accion: string;
    boton: string;
    nota: string;
    campos: LogisticsQuoteField[];
  };
  footerLegal: string;
};

export function renderLandingLogisticsBody(client: LogisticsClient): string {
  return `
    <div class="wf-lg">
      ${renderScrollStoryHero({
        brand: client.nombre,
        kicker: client.contacto.direccion || undefined,
        headline: client.tagline,
        sub: client.descripcion,
        ctaPrimary: { label: client.cta.texto, url: client.cta.url },
        nav: buildNav(client),
        frames: buildFrames(client),
        stepsLabel: "Etapas del servicio",
      })}

      <main id="contenido">
        ${renderBenefitStrip({
          label: "que movemos",
          items: client.servicios.map((service) => ({
            title: service.titulo,
            copy: service.desc,
            icon: service.icono,
          })),
        })}

        ${renderStatStrip({
          label: "en numeros",
          heading: "La operacion, medida",
          items: buildStats(client),
          note: buildStatsNote(client),
        })}

        ${renderInlineQuoteForm({
          heading: client.cotizacion.titulo,
          copy: client.cotizacion.texto,
          action: client.cotizacion.accion,
          submitLabel: client.cotizacion.boton,
          note: client.cotizacion.nota,
          fields: buildQuoteFields(client),
          direct: buildDirectChannels(client),
          source: client.slug,
        })}
      </main>

      ${renderFooterBrand({
        brand: client.nombre,
        statement: client.descripcion,
        groups: buildFooterGroups(client),
        legal: client.footerLegal,
      })}
    </div>
  `;
}

function buildNav(client: LogisticsClient): Array<{ label: string; url: string }> {
  const nav = [{ label: "Servicios", url: "#contenido" }];
  if (client.metricas.length > 0) nav.push({ label: "Cifras", url: "#cifras" });
  nav.push({ label: client.cta.texto, url: client.cta.url });
  return nav;
}

/**
 * The scene comes from the client's own process steps: one photo per stage, in
 * order. A step with no photo is not a frame — the scene never invents an image,
 * it just gets shorter (and with a single frame the hero stops scrubbing).
 */
function buildFrames(client: LogisticsClient): ScrollStoryFrame[] {
  const steps = (client.proceso ?? [])
    .filter((step) => (step.imagen ?? "").trim().length > 0)
    .map((step) => ({
      src: (step.imagen ?? "").trim(),
      alt: (step.imagenAlt ?? "").trim() || `${step.titulo}: ${step.desc}`,
      stage: step.titulo,
    }));

  if (steps.length > 0) return steps;
  return client.heroPoster
    ? [{ src: client.heroPoster, alt: `Operacion de ${client.nombre}` }]
    : [];
}

function buildStats(client: LogisticsClient): StatItem[] {
  return client.metricas.map((metric) => ({
    value: metric.valor,
    label: metric.label,
    source: metric.fuente || undefined,
    placeholder: metric.esMuestra,
  }));
}

function buildStatsNote(client: LogisticsClient): string | undefined {
  const samples = client.metricas.filter((metric) => metric.esMuestra).length;
  if (samples === 0) return undefined;
  return `${samples} de ${client.metricas.length} cifras son de muestra: se publican solo cuando el cliente confirma el dato y su fuente.`;
}

function buildQuoteFields(client: LogisticsClient): QuoteField[] {
  return client.cotizacion.campos.map((field) => ({
    name: field.nombre,
    label: field.label,
    type: field.tipo,
    required: field.requerido,
    options: field.opciones,
    placeholder: field.placeholder || undefined,
    autocomplete: field.autocomplete || undefined,
  }));
}

function buildDirectChannels(client: LogisticsClient) {
  return [
    client.contacto.whatsapp && {
      label: "WhatsApp",
      value: client.contacto.tel || "Escribinos",
      url: client.contacto.whatsapp,
    },
    client.contacto.tel && { label: "Telefono", value: client.contacto.tel, url: `tel:${client.contacto.tel}` },
    client.contacto.email && {
      label: "Correo",
      value: client.contacto.email,
      url: `mailto:${client.contacto.email}`,
    },
    client.contacto.direccion && { label: "Deposito", value: client.contacto.direccion },
  ].filter((item): item is { label: string; value: string; url?: string } => Boolean(item));
}

function buildFooterGroups(client: LogisticsClient) {
  const contacto = [
    client.contacto.email && { label: client.contacto.email, url: `mailto:${client.contacto.email}` },
    client.contacto.tel && { label: client.contacto.tel, url: `tel:${client.contacto.tel}` },
    client.contacto.whatsapp && { label: "WhatsApp", url: client.contacto.whatsapp },
    client.contacto.direccion && { label: client.contacto.direccion },
  ].filter((item): item is { label: string; url?: string } => Boolean(item));

  const redes = [
    client.redes.ig && { label: "Instagram", url: client.redes.ig },
    client.redes.fb && { label: "Facebook", url: client.redes.fb },
    client.redes.linkedin && { label: "LinkedIn", url: client.redes.linkedin },
    client.redes.x && { label: "X", url: client.redes.x },
  ].filter((item): item is { label: string; url: string } => Boolean(item));

  return [
    {
      title: "Navegacion",
      items: [
        { label: "Servicios", url: "#contenido" },
        { label: "Cifras", url: "#cifras" },
        { label: "Cotizar", url: "#cotizacion" },
      ],
    },
    { title: "Contacto", items: contacto },
    ...(redes.length ? [{ title: "Redes", items: redes }] : []),
  ];
}

export function renderLandingLogisticsCss(client: LogisticsClient): string {
  return [
    clientTokenCss(client),
    LOGISTICS_BASE_CSS,
    SCROLL_STORY_HERO_CSS,
    BENEFIT_STRIP_CSS,
    STAT_STRIP_CSS,
    INLINE_QUOTE_FORM_CSS,
    FOOTER_BRAND_CSS,
  ].join("\n\n");
}

export function renderLandingLogisticsDocument(client: LogisticsClient): string {
  const ogImage = client.seo.ogImage
    ? `<meta property="og:image" content="${escapeHtml(client.seo.ogImage)}">`
    : "";

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(client.seo.title)}</title>
    <meta name="description" content="${escapeHtml(client.seo.description)}">
    <meta property="og:title" content="${escapeHtml(client.seo.title)}">
    <meta property="og:description" content="${escapeHtml(client.seo.description)}">
    ${ogImage}
    <!-- The two ONIA families (docs/TIPOGRAFIA_SISTEMA_20260727.md): display
         Bricolage Grotesque + body DM Sans. -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..700&family=DM+Sans:opsz,wght@9..40,400..600&display=swap">
    <link rel="stylesheet" href="./site.css">
    ${renderMotionStyles()}
  </head>
  <body>
    <a class="wf-skip" href="#contenido">Ir al contenido</a>
    ${renderLandingLogisticsBody(client)}
    ${renderMotionScript()}
  </body>
</html>
`;
}

/**
 * Page shell. `--color-surface` is the model's card/band role, declared once on
 * the page wrapper so every block that needs a raised surface reads it from the
 * client's own field instead of inventing a grey.
 * Note: no backticks in this file's CSS comments -- it lives inside a template
 * literal and a stray backtick ends the string mid-stylesheet.
 */
const LOGISTICS_BASE_CSS = `
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-width: 320px;
  background: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, p, ol, ul {
  margin: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  max-width: 100%;
}

.wf-lg {
  --color-surface: color-mix(in srgb, var(--color-fg) 6%, var(--color-bg));
}

/* Rhythm: two blocks that both own generous vertical padding stack into a dead
   band between the offer and the proof. The offer strip gives up its bottom
   padding so the page breathes on purpose instead of by accident. */
.wf-lg .wf-benefit-strip {
  padding-bottom: 0;
}

.wf-skip {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 100;
  padding: 12px 18px;
  background: var(--color-fg);
  color: var(--color-bg);
}

.wf-skip:focus {
  left: 12px;
  top: 12px;
}
`.trim();
