import { renderFeatures, renderFooter, renderHero, type SiteClient } from "@onia/blocks";
import { clientTokenCss } from "@onia/tokens";

export type LandingClient = SiteClient & {
  slug: string;
  tipografia: {
    heading: string;
    body: string;
  };
  colores: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    fg: string;
  };
  seo: {
    title: string;
    description: string;
    ogImage: string;
  };
};

export function renderLandingBody(client: LandingClient): string {
  return `
    <main class="wf-page" id="top">
      ${renderHero(client)}
      ${renderFeatures(client)}
      ${renderFooter(client)}
    </main>
  `;
}

export function renderLandingCss(client: LandingClient): string {
  return `${clientTokenCss(client)}

${landingBaseCss}`;
}

export function renderLandingDocument(client: LandingClient): string {
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
    ${renderLandingBody(client)}
  </body>
</html>
`;
}

const landingBaseCss = `
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
}

a {
  color: inherit;
  text-decoration: none;
}

.wf-page {
  min-height: 100vh;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 7%, transparent), transparent 34%),
    linear-gradient(315deg, color-mix(in srgb, var(--color-accent) 11%, transparent), transparent 36%),
    var(--color-bg);
}

.wf-hero,
.wf-section,
.wf-footer {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
}

.wf-hero {
  min-height: 86vh;
  padding: 24px 0 64px;
  display: flex;
  flex-direction: column;
}

.wf-nav {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.wf-brand,
.wf-nav-cta,
.wf-actions,
.wf-footer-links {
  display: flex;
  align-items: center;
}

.wf-brand {
  gap: 10px;
  min-width: 0;
  font-weight: 800;
}

.wf-brand-mark,
.wf-feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  color: var(--color-on-primary);
  background: var(--color-primary);
}

.wf-brand-mark {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  font-size: 0.82rem;
  letter-spacing: 0;
}

.wf-nav-cta,
.wf-button-primary,
.wf-button-secondary {
  min-height: 44px;
  border-radius: 8px;
  padding: 0 18px;
  font-weight: 750;
}

.wf-nav-cta,
.wf-button-secondary {
  border: 1px solid color-mix(in srgb, var(--color-fg) 14%, transparent);
}

.wf-hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
  align-items: center;
  gap: clamp(32px, 7vw, 88px);
  flex: 1;
}

.wf-hero-copy {
  max-width: 720px;
}

.wf-kicker,
.wf-proof-label,
.wf-feature-number {
  color: var(--color-primary);
  font-size: 0.78rem;
  font-weight: 850;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1,
h2,
h3,
p {
  margin: 0;
}

h1,
h2,
h3 {
  font-family: var(--font-heading);
  letter-spacing: 0;
}

h1 {
  margin-top: 14px;
  font-size: clamp(3rem, 7vw, 5.75rem);
  line-height: 0.94;
  max-width: 780px;
}

.wf-lede {
  margin-top: 22px;
  color: color-mix(in srgb, var(--color-fg) 74%, var(--color-bg));
  font-size: clamp(1.05rem, 2vw, 1.25rem);
  line-height: 1.65;
  max-width: 640px;
}

.wf-actions {
  margin-top: 34px;
  gap: 12px;
  flex-wrap: wrap;
}

.wf-button-primary {
  display: inline-flex;
  align-items: center;
  color: var(--color-on-primary);
  background: var(--color-primary);
  box-shadow: 0 18px 46px color-mix(in srgb, var(--color-primary) 20%, transparent);
}

.wf-button-secondary {
  display: inline-flex;
  align-items: center;
  background: color-mix(in srgb, var(--color-bg) 86%, transparent);
}

.wf-proof-panel,
.wf-feature {
  border: 1px solid color-mix(in srgb, var(--color-fg) 12%, transparent);
  border-radius: 8px;
  background: color-mix(in srgb, var(--color-bg) 88%, transparent);
  box-shadow: 0 24px 80px color-mix(in srgb, var(--color-fg) 10%, transparent);
}

.wf-proof-panel {
  padding: clamp(24px, 4vw, 42px);
  overflow: hidden;
}

.wf-hero-media {
  margin: -18px -18px 24px;
  aspect-ratio: 4 / 3;
  border-radius: 8px;
  overflow: hidden;
  background: color-mix(in srgb, var(--color-primary) 9%, var(--color-bg));
}

.wf-hero-media img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.wf-proof-copy {
  display: block;
}

.wf-proof-panel strong {
  display: block;
  margin-top: 18px;
  color: var(--color-secondary);
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  line-height: 1.05;
}

.wf-proof-panel p,
.wf-feature p,
.wf-footer p {
  color: color-mix(in srgb, var(--color-fg) 68%, var(--color-bg));
  line-height: 1.65;
}

.wf-proof-panel p {
  margin-top: 18px;
}

.wf-section {
  padding: 72px 0;
}

.wf-section-heading {
  display: grid;
  gap: 10px;
  margin-bottom: 24px;
}

.wf-section-heading h2 {
  font-size: clamp(2rem, 4vw, 3.25rem);
  line-height: 1;
  max-width: 680px;
}

.wf-feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.wf-feature {
  min-height: 264px;
  padding: 22px;
  display: flex;
  flex-direction: column;
}

.wf-feature-icon {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  font-size: 0.76rem;
  font-weight: 850;
}

.wf-feature-number {
  margin-top: auto;
}

.wf-feature h3 {
  margin-top: 12px;
  color: var(--color-secondary);
  font-size: 1.35rem;
}

.wf-feature p {
  margin-top: 10px;
}

.wf-footer {
  padding: 34px 0 42px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 24px;
  border-top: 1px solid color-mix(in srgb, var(--color-fg) 12%, transparent);
}

.wf-footer strong {
  display: block;
  margin-bottom: 8px;
  font-family: var(--font-heading);
}

.wf-footer-links {
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 14px;
  font-weight: 700;
}

.wf-focus-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 56px;
  font-weight: 800;
}

.wf-final-cta {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: clamp(56px, 8vw, 96px) 0;
  display: grid;
  gap: 24px;
  justify-items: center;
  text-align: center;
}

.wf-final-cta h2 {
  font-size: clamp(2rem, 4vw, 3.25rem);
  line-height: 1.02;
  max-width: 720px;
}

@media (max-width: 840px) {
  .wf-hero {
    min-height: auto;
    padding-bottom: 48px;
  }

  .wf-hero-grid,
  .wf-feature-grid,
  .wf-footer {
    grid-template-columns: 1fr;
  }

  .wf-hero-grid {
    padding-top: 42px;
  }

  .wf-footer-links {
    justify-content: flex-start;
  }
}

@media (max-width: 520px) {
  .wf-hero,
  .wf-section,
  .wf-footer {
    width: min(100% - 24px, 1120px);
  }

  .wf-nav {
    align-items: flex-start;
    height: auto;
  }

  .wf-hero-grid {
    gap: 28px;
    padding-top: 32px;
  }

  .wf-lede {
    margin-top: 18px;
  }

  .wf-actions {
    margin-top: 26px;
  }

  .wf-nav-cta {
    min-height: 38px;
    padding: 0 12px;
    font-size: 0.9rem;
  }

  h1 {
    font-size: 2.55rem;
  }

  .wf-proof-panel {
    padding: 20px 24px;
  }

  .wf-proof-panel strong {
    margin-top: 12px;
    font-size: 1.6rem;
  }

  .wf-proof-panel p {
    margin-top: 12px;
  }

  .wf-section {
    padding-top: 48px;
  }
}
`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
