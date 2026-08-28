import {
  escapeAttribute,
  escapeHtml,
  renderClinicFeature,
  renderClinicHero,
  renderClinicProcess,
  renderClinicServices,
  renderFooter,
  renderIcon,
  renderInlineQuoteForm,
  renderStickyCta,
  INLINE_QUOTE_FORM_CSS,
  type QuoteContact,
  type QuoteField,
} from "@onia/blocks";
import { renderLandingCss, type LandingClient } from "./landing";
import { clinicCss } from "./clinic-css";

// Clinic/Health vertical, editorial direction. Hero (media + glass card) ->
// benefits strip -> bento services -> process timeline -> two-column FAQ ->
// final CTA surface + persistent WhatsApp. Reveal-on-scroll motion is opt-in and
// reduced-motion safe. Reuses landing CSS tokens/base + clinic CSS.

function renderClinicStrip(client: LandingClient): string {
  const items = (client.beneficios ?? []).filter((item) => item.trim().length > 0);
  if (items.length === 0) return "";
  return `
    <div class="wf-clinic-strip" data-reveal>
      ${items
        .map(
          (item) =>
            `<span class="wf-clinic-chip">${renderIcon("check", "wf-icon")}<span>${escapeHtml(item)}</span></span>`,
        )
        .join("")}
    </div>
  `;
}

function renderClinicFaq(client: LandingClient): string {
  const items = client.faq ?? [];
  if (items.length === 0) return "";
  const rows = items
    .map(
      (item) =>
        `<details class="wf-clinic-faq-item"><summary>${escapeHtml(item.pregunta)}</summary><p>${escapeHtml(item.respuesta)}</p></details>`,
    )
    .join("");
  return `
    <section class="wf-clinic-section wf-clinic-faq" id="preguntas" data-reveal aria-labelledby="wf-clinic-faq-h">
      <div class="wf-clinic-faq-grid">
        <div class="wf-clinic-faq-aside">
          <p class="wf-clinic-kicker">Preguntas frecuentes</p>
          <h2 id="wf-clinic-faq-h">Lo que preguntan antes de venir</h2>
          <p>¿Otra duda puntual? Escribinos y te respondemos por WhatsApp.</p>
          <a class="wf-clinic-btn wf-clinic-btn--ghost" href="${escapeAttribute(client.cta.url)}"><span>${escapeHtml(client.cta.texto)}</span></a>
        </div>
        <div class="wf-clinic-faq-list">${rows}</div>
      </div>
    </section>
  `;
}

function renderClinicFinalCta(client: LandingClient): string {
  return `
    <section class="wf-clinic-final" data-reveal aria-labelledby="wf-clinic-final-h">
      <div class="wf-clinic-final-inner">
        <h2 id="wf-clinic-final-h">${escapeHtml(client.tagline)}</h2>
        <a class="wf-clinic-btn wf-clinic-btn--primary" href="${escapeAttribute(client.cta.url)}">${renderIcon("message", "wf-icon")}<span>${escapeHtml(client.cta.texto)}</span></a>
      </div>
    </section>
  `;
}

// Progressive-enhancement reveal: content is visible by default; the script adds
// the motion class (hide) then reveals on scroll, with a timeout fallback and a
// reduced-motion short-circuit. No external JS, so the static output stays light.
function renderRevealScript(): string {
  return `<script>(function(){var r=document.querySelector('.wf-clinic-page');if(!r)return;var i=r.querySelectorAll('[data-reveal]');var m=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(m||!('IntersectionObserver' in window)){r.classList.add('wf-clinic-motion');i.forEach(function(e){e.classList.add('is-revealed')});return;}r.classList.add('wf-clinic-motion');var o=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-revealed');o.unobserve(e.target);}})},{rootMargin:'0px 0px -8% 0px',threshold:0.08});i.forEach(function(e){o.observe(e)});setTimeout(function(){i.forEach(function(e){e.classList.add('is-revealed')})},1400);})();</script>`;
}

/* La conversion del clinic era SOLO WhatsApp. Con `cotizacion` cargada en el
 * perfil, entre el FAQ y el cierre entra el bloque de pedido (inline-quote-form):
 * el circuito web → sistema. Sus dos reglas de honestidad ya vienen del bloque —
 * sin `accion` no hay form muerto (solo canales directos), y `src` viaja oculto
 * con el slug para que el lead llegue atribuido. */

function buildClinicQuoteFields(client: LandingClient): QuoteField[] {
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

function buildClinicDirectChannels(client: LandingClient): QuoteContact[] {
  const wa = client.contacto.whatsapp?.trim() ?? "";
  const waUrl = wa
    ? wa.startsWith("http")
      ? wa
      : `https://wa.me/${wa.replace(/\D/g, "")}`
    : "";
  return [
    waUrl ? { label: "WhatsApp", value: wa.startsWith("http") ? "Escribinos" : wa, url: waUrl } : null,
    client.contacto.tel?.trim()
      ? { label: "Teléfono", value: client.contacto.tel, url: `tel:${client.contacto.tel}` }
      : null,
    client.contacto.email?.trim()
      ? { label: "Correo", value: client.contacto.email, url: `mailto:${client.contacto.email}` }
      : null,
  ].filter((item): item is QuoteContact => item !== null);
}

function renderClinicQuote(client: LandingClient): string {
  if (!client.cotizacion.titulo.trim()) return "";
  return `
    <div class="wf-clinic-quote" data-reveal>
      ${renderInlineQuoteForm({
        heading: client.cotizacion.titulo,
        copy: client.cotizacion.texto,
        action: client.cotizacion.accion,
        submitLabel: client.cotizacion.boton,
        note: client.cotizacion.nota,
        fields: buildClinicQuoteFields(client),
        direct: buildClinicDirectChannels(client),
        source: client.slug,
      })}
    </div>
  `;
}

export function renderLandingClinicBody(client: LandingClient): string {
  return `
    <main class="wf-clinic-page">
      ${renderClinicHero(client)}
      ${renderClinicStrip(client)}
      ${renderClinicServices(client)}
      ${renderClinicFeature(client)}
      ${renderClinicProcess(client)}
      ${renderClinicFaq(client)}
      ${renderClinicQuote(client)}
      ${renderClinicFinalCta(client)}
      ${renderFooter(client, { minimal: true })}
    </main>
    ${renderStickyCta(client)}
    ${renderRevealScript()}
  `;
}

export function renderLandingClinicCss(client: LandingClient): string {
  return `${renderLandingCss(client)}

${clinicCss}

${INLINE_QUOTE_FORM_CSS}`;
}

// La tipografia del perfil solo existe si el documento la CARGA: sin este link
// todo cae al fallback del sistema (Segoe UI en Windows) y la receta de marca
// queda en el papel. Mismo patron que logistics/realestate, pero derivado del
// cliente en vez de hardcodear familias.
function renderFontLinks(client: LandingClient): string {
  const familias = [
    ...new Set(
      [client.tipografia.heading, client.tipografia.body]
        .map((familia) => familia.trim())
        .filter(Boolean),
    ),
  ];
  if (familias.length === 0) return "";
  // Un <link> POR familia y rango variable 300..900: el CSS del template pide
  // pesos altos (hero 820) que una escalera estatica 400-700 no trae. Si una
  // familia es solo-estatica, css2 devuelve 400 y muere SOLO ese link — la
  // otra familia y el fallback stack siguen vivos.
  const links = familias
    .map(
      (familia) =>
        `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(familia).replace(/%20/g, "+")}:wght@300..900&display=swap">`,
    )
    .join("\n    ");
  return `<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    ${links}`;
}

export function renderLandingClinicDocument(client: LandingClient): string {
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
    ${renderFontLinks(client)}
    <link rel="stylesheet" href="./site.css">
  </head>
  <body>
    ${renderLandingClinicBody(client)}
  </body>
</html>
`;
}
