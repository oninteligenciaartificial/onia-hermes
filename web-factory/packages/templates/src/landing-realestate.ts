import {
  EDITORIAL_STATEMENT_CSS,
  FOOTER_BRAND_CSS,
  MEDIA_HERO_CSS,
  NEWSLETTER_BAND_CSS,
  PATH_CARDS_CSS,
  PROPERTY_CARDS_CSS,
  escapeHtml,
  renderEditorialStatement,
  renderFaq,
  renderFooterBrand,
  renderMediaHero,
  renderMotionScript,
  renderMotionStyles,
  renderNewsletterBand,
  renderPathCards,
  renderPropertyCards,
  type PathCard,
  type PropertyCard,
} from "@onia/blocks";
import { clientTokenCss } from "@onia/tokens";
import type { LandingClient } from "./landing";

/**
 * Generated from the learned model `find-realestate-editorial`
 * (data/references/reels/models/find-realestate-editorial.json · confidence high).
 *
 * Section order is the model's, unchanged:
 *   media-hero -> editorial-statement -> path-cards -> property-cards ->
 *   [article-cards] -> newsletter-band -> footer-brand
 *
 * article-cards is the one substitution, and the model itself prescribes it:
 * "2-3 articulos o notas de mercado del cliente. Si no tiene, la seccion de proof
 * se reemplaza por FAQ, no se inventan articulos." So proof renders from the
 * client's real FAQ; nothing is fabricated to fill the slot.
 *
 * The model's palette is NOT copied. Its hexes are roles (bg / surface / text /
 * accent / detail) and they map onto the client's ONIA tokens:
 *   bg -> --color-bg · text -> --color-fg · accent -> --color-primary ·
 *   detail -> color-mix over --color-fg · surface -> --color-surface
 * Every block below styles itself from those variables, so swapping the client
 * swaps the whole site and no literal color ships.
 */

export type RealestateProperty = {
  titulo: string;
  categoria: string;
  precio: string;
  imagen: string;
  imagenAlt: string;
  especificaciones: Array<{ label: string; value: string }>;
  /** Sample row waiting for the client's real portfolio; rendered with a visible tag. */
  esMuestra: boolean;
};

export type RealestateClient = LandingClient & {
  statement: string;
  statementAccent: string;
  newsletter: {
    titulo: string;
    texto: string;
    accion: string;
    boton: string;
    nota: string;
  };
  productos: RealestateProperty[];
  footerLegal: string;
};

export function renderLandingRealestateBody(client: RealestateClient): string {
  return `
    <div class="wf-re">
      ${renderMediaHero({
        brand: client.nombre,
        kicker: client.contacto.direccion || undefined,
        headline: client.tagline,
        sub: client.descripcion,
        cta: { label: client.cta.texto, url: client.cta.url },
        nav: buildNav(client),
        media: client.heroPoster
          ? { src: client.heroPoster, alt: `Vista principal de ${client.nombre}` }
          : undefined,
      })}

      <main id="contenido">
        ${renderEditorialStatement({
          label: client.statement ? "sobre nosotros" : undefined,
          statement: client.statement ?? "",
          accent: client.statementAccent || undefined,
        })}

        ${renderPathCards({
          label: "como podemos ayudarte",
          heading: "Tres caminos, un solo contacto",
          cards: buildPaths(client),
        })}

        ${renderPropertyCards({
          label: "cartera",
          heading: "Propiedades disponibles",
          note: buildPortfolioNote(client),
          items: buildProperties(client),
        })}

        ${renderFaq(client)}

        ${renderNewsletterBand({
          heading: client.newsletter?.titulo ?? "",
          copy: client.newsletter?.texto,
          action: client.newsletter?.accion ?? "",
          buttonLabel: client.newsletter?.boton,
          note: client.newsletter?.nota,
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

function buildNav(client: RealestateClient): Array<{ label: string; url: string }> {
  const nav = [
    { label: "Caminos", url: "#caminos" },
    { label: "Propiedades", url: "#propiedades" },
  ];
  if ((client.faq ?? []).length > 0) nav.push({ label: "Preguntas", url: "#preguntas" });
  nav.push({ label: client.cta.texto, url: client.cta.url });
  return nav;
}

// The three intentions come from the client's own servicios: this template does
// not invent "comprar / vender / alquilar" for a client that does not offer them.
function buildPaths(client: RealestateClient): PathCard[] {
  return client.servicios.map((service) => ({
    title: service.titulo,
    copy: service.desc,
    icon: service.icono,
    cta: {
      label: "Empezar",
      url: service.url?.trim() || client.cta.url,
    },
  }));
}

function buildProperties(client: RealestateClient): PropertyCard[] {
  return client.productos.map((product) => ({
    title: product.titulo,
    price: product.precio,
    location: product.categoria,
    specs: product.especificaciones,
    media: product.imagen
      ? { src: product.imagen, alt: product.imagenAlt || product.titulo }
      : undefined,
    placeholder: product.esMuestra,
  }));
}

function buildPortfolioNote(client: RealestateClient): string | undefined {
  const samples = client.productos.filter((product) => product.esMuestra).length;
  if (samples === 0) return undefined;
  return `${samples} de ${client.productos.length} fichas son de muestra: esperan las fotos, los precios y las especificaciones reales de la cartera.`;
}

function buildFooterGroups(client: RealestateClient) {
  const contacto = [
    client.contacto.email && {
      label: client.contacto.email,
      url: `mailto:${client.contacto.email}`,
    },
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
        { label: "Caminos", url: "#caminos" },
        { label: "Propiedades", url: "#propiedades" },
        { label: "Novedades", url: "#novedades" },
      ],
    },
    { title: "Contacto", items: contacto },
    ...(redes.length ? [{ title: "Redes", items: redes }] : []),
  ];
}

export function renderLandingRealestateCss(client: RealestateClient): string {
  return [
    clientTokenCss(client),
    REALESTATE_BASE_CSS,
    MEDIA_HERO_CSS,
    EDITORIAL_STATEMENT_CSS,
    PATH_CARDS_CSS,
    PROPERTY_CARDS_CSS,
    NEWSLETTER_BAND_CSS,
    FOOTER_BRAND_CSS,
  ].join("\n\n");
}

export function renderLandingRealestateDocument(client: RealestateClient): string {
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
         Bricolage Grotesque + body DM Sans. Two families, swap, no extra weights:
         without this the token font stack silently falls back to system sans and
         the model's typographic contrast disappears. -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..700&family=DM+Sans:opsz,wght@9..40,400..600&display=swap">
    <link rel="stylesheet" href="./site.css">
    ${renderMotionStyles()}
  </head>
  <body>
    <a class="wf-skip" href="#contenido">Ir al contenido</a>
    ${renderLandingRealestateBody(client)}
    ${renderMotionScript()}
  </body>
</html>
`;
}

/**
 * Page shell + the FAQ styling this composition needs (renderFaq emits wf-faq-*
 * and wf-section markup that the base landing stylesheet owns; this template does
 * not load that stylesheet, so it styles those classes itself).
 * Note: no backticks in this file's CSS comments -- it lives inside a template
 * literal and a stray backtick ends the string mid-stylesheet.
 */
const REALESTATE_BASE_CSS = `
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

h1, h2, h3, p {
  margin: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  max-width: 100%;
}

/* Surface role from the model's palette (white cards over the cream field). */
.wf-re {
  /* Tarjeta = bg apenas levantado hacia el fg (patron de logistics). La version
     anterior mezclaba con #ffffff literal: en claro daba tarjeta, en dark
     fabricaba un gris medio #797c7d que hundia TODO el contraste del bloque. */
  --color-surface: color-mix(in srgb, var(--color-fg) 5%, var(--color-bg));
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

/* FAQ (stands in for article-cards when the client has no real market notes) */
.wf-section {
  width: min(1200px, calc(100% - 40px));
  margin: 0 auto;
  padding: clamp(48px, 7vw, 96px) 0;
}

.wf-section-heading {
  display: grid;
  gap: 8px;
  margin-bottom: 26px;
}

.wf-kicker {
  color: color-mix(in srgb, var(--color-fg) 62%, var(--color-bg));
  font-size: 0.8rem;
  letter-spacing: 0.06em;
}

.wf-section-heading h2 {
  max-width: 20ch;
  font-family: var(--font-heading);
  font-size: clamp(1.9rem, 4vw, 3.1rem);
  line-height: 1.04;
  letter-spacing: -0.02em;
  font-weight: 500;
}

.wf-faq-list {
  display: grid;
  gap: 0;
  max-width: 860px;
  border-top: 1px solid color-mix(in srgb, var(--color-fg) 14%, transparent);
}

.wf-faq-item {
  border-bottom: 1px solid color-mix(in srgb, var(--color-fg) 14%, transparent);
}

.wf-faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 64px;
  padding: 16px 4px;
  cursor: pointer;
  font-family: var(--font-heading);
  font-size: clamp(1.02rem, 1.6vw, 1.2rem);
  list-style: none;
}

.wf-faq-question::-webkit-details-marker {
  display: none;
}

.wf-faq-question::after {
  content: "+";
  color: var(--color-primary);
  font-size: 1.5rem;
  line-height: 1;
}

.wf-faq-item[open] .wf-faq-question::after {
  content: "\\2212";
}

.wf-faq-question:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.wf-faq-answer {
  padding: 0 4px 20px;
  max-width: 70ch;
  color: color-mix(in srgb, var(--color-fg) 68%, var(--color-bg));
  line-height: 1.65;
}
`.trim();
