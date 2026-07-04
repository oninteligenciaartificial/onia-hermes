import { escapeAttribute, escapeHtml, renderFeatures, renderFooter, renderHero } from "@onia/blocks";
import { renderLandingCss, type LandingClient } from "./landing";

// Focus landing variant: no navigation, a single conversion action and a final
// CTA. Landing pages without nav convert meaningfully better because there are
// fewer exits competing with the primary action. Reuses the landing CSS.
export { renderLandingCss as renderLandingFocusCss };

function renderFinalCta(client: LandingClient): string {
  return `
    <section class="wf-final-cta" aria-labelledby="wf-final-cta-heading">
      <h2 id="wf-final-cta-heading">${escapeHtml(client.tagline)}</h2>
      <a class="wf-button-primary" href="${escapeAttribute(client.cta.url)}">${escapeHtml(client.cta.texto)}</a>
    </section>
  `;
}

export function renderLandingFocusBody(client: LandingClient): string {
  return `
    <main class="wf-page wf-page--focus" id="top">
      ${renderHero(client, { focus: true })}
      ${renderFeatures(client)}
      ${renderFinalCta(client)}
      ${renderFooter(client, { minimal: true })}
    </main>
  `;
}

export function renderLandingFocusDocument(client: LandingClient): string {
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
    <link rel="stylesheet" href="./site.css">
  </head>
  <body>
    ${renderLandingFocusBody(client)}
  </body>
</html>
`;
}
