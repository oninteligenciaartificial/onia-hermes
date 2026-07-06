import { clientTokenCss } from "@onia/tokens";
import { dashboardCardsCss, renderCharts, renderKpis, renderSidePanel, renderTable } from "./dashboard-cards";
import type { DashboardTable } from "./dashboard-cards";
import { dashboardChartsCss } from "./dashboard-charts";
import { dashboardHeroCss, renderHeroPanel } from "./dashboard-hero";
import { dashboardStatesCss, renderStatesShowcase } from "./dashboard-states";
import type {
  DashboardChart,
  DashboardHeroPanel,
  DashboardKpi,
  DashboardNavGroup,
  DashboardPoint,
  DashboardSeries,
  DashboardSidePanel,
} from "./dashboard-types";

export type {
  DashboardChart,
  DashboardHeroPanel,
  DashboardKpi,
  DashboardNavGroup,
  DashboardPoint,
  DashboardSeries,
  DashboardSidePanel,
} from "./dashboard-types";
export type { DashboardTable } from "./dashboard-cards";

export type DashboardData = {
  title: string;
  subtitle: string;
  nav: string[] | DashboardNavGroup[];
  filters: string[];
  kpis: DashboardKpi[];
  charts: DashboardChart[];
  table: DashboardTable;
  heroPanel?: DashboardHeroPanel;
  sidePanel?: DashboardSidePanel;
  showStatesReference: boolean;
};

export type DashboardClient = {
  nombre: string;
  slug: string;
  logo: string;
  colores: { primary: string; secondary: string; accent: string; bg: string; fg: string };
  tipografia: { heading: string; body: string };
  seo: { title: string; description: string; ogImage: string };
  contacto: { email: string; tel: string; whatsapp: string; direccion: string };
  cta: { texto: string; url: string };
  dashboard: DashboardData;
};

export function renderDashboardBody(client: DashboardClient): string {
  const dash = client.dashboard;
  const brandMark = client.logo || initials(client.nombre);

  return `
    <div class="wf-dash" id="top">
      <aside class="wf-dash-side" aria-label="Navegacion del panel">
        <a class="wf-dash-brand" href="#top">
          <span class="wf-dash-brand-mark">${escapeHtml(brandMark)}</span>
          <span class="wf-dash-brand-name">${escapeHtml(client.nombre)}</span>
        </a>
        <nav class="wf-dash-nav">
          ${renderNavGroups(dash.nav)}
        </nav>
      </aside>
      <div class="wf-dash-main">
        ${renderTopbar(client)}
        ${renderHeroPanel(dash.heroPanel)}
        ${renderKpis(dash.kpis)}
        ${renderCharts(dash.charts)}
        ${
          dash.sidePanel
            ? `<div class="wf-dash-detail-row">${renderTable(dash.table)}${renderSidePanel(dash.sidePanel)}</div>`
            : renderTable(dash.table)
        }
        ${renderStatesShowcase(dash.showStatesReference)}
      </div>
    </div>
    ${dashboardScript}
  `;
}

function renderTopbar(client: DashboardClient): string {
  const dash = client.dashboard;
  const subtitle = dash.subtitle
    ? `<p class="wf-dash-subtitle">${escapeHtml(dash.subtitle)}</p>`
    : "";
  const filters = dash.filters.length
    ? `<div class="wf-dash-filters" role="group" aria-label="Rango de tiempo">
        ${dash.filters
          .map(
            (filter, index) =>
              `<button type="button" class="wf-dash-filter${index === 0 ? " is-active" : ""}" data-dash-filter${
                index === 0 ? ' aria-pressed="true"' : ' aria-pressed="false"'
              }>${escapeHtml(filter)}</button>`,
          )
          .join("\n        ")}
      </div>`
    : "";
  const cta = client.cta.texto
    ? `<a class="wf-dash-cta" href="${escapeAttribute(client.cta.url)}">${escapeHtml(client.cta.texto)}</a>`
    : "";

  return `
        <header class="wf-dash-topbar" data-reveal>
          <div class="wf-dash-heading">
            <h1>${escapeHtml(dash.title)}</h1>
            ${subtitle}
          </div>
          <div class="wf-dash-topbar-actions">
            <button type="button" class="wf-dash-theme" data-theme-toggle aria-label="Cambiar entre tema claro y oscuro">
              <span aria-hidden="true">◐</span> Tema
            </button>
            ${filters}
            ${cta}
          </div>
        </header>`;
}

function isGroupedNav(nav: string[] | DashboardNavGroup[]): nav is DashboardNavGroup[] {
  return nav.length > 0 && typeof nav[0] === "object";
}

function renderNavLink(item: string, isFirst: boolean): string {
  return `<a class="wf-dash-nav-link${isFirst ? " is-active" : ""}" href="#top"${
    isFirst ? ' aria-current="page"' : ""
  }>${escapeHtml(item)}</a>`;
}

function renderNavGroups(nav: string[] | DashboardNavGroup[]): string {
  const groups: DashboardNavGroup[] = isGroupedNav(nav)
    ? nav
    : [{ items: nav.length ? nav : ["Resumen", "Reportes", "Actividad", "Ajustes"] }];
  let seenFirst = false;
  return groups
    .map((groupEntry) => {
      const heading = groupEntry.group ? `<span class="wf-dash-nav-group">${escapeHtml(groupEntry.group)}</span>` : "";
      const links = groupEntry.items
        .map((item) => {
          const isFirst = !seenFirst;
          seenFirst = true;
          return renderNavLink(item, isFirst);
        })
        .join("\n          ");
      return `${heading}${links}`;
    })
    .join("\n          ");
}

function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "ON"
  );
}

export function renderDashboardCss(client: DashboardClient): string {
  return `${clientTokenCss(client)}

${dashboardBaseCss}

${dashboardChartsCss}

${dashboardCardsCss}

${dashboardHeroCss}

${dashboardStatesCss}`;
}

export function renderDashboardDocument(client: DashboardClient): string {
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
    <script>try{var t=localStorage.getItem("wf-theme");if(t)document.documentElement.setAttribute("data-theme",t);}catch(e){}</script>
    <link rel="stylesheet" href="./site.css">
  </head>
  <body>
    ${renderDashboardBody(client)}
  </body>
</html>
`;
}

const dashboardScript = `<script>
  (function () {
    var groups = document.querySelectorAll(".wf-dash-filters");
    groups.forEach(function (group) {
      group.addEventListener("click", function (event) {
        var button = event.target.closest("[data-dash-filter]");
        if (!button) return;
        group.querySelectorAll("[data-dash-filter]").forEach(function (item) {
          item.classList.toggle("is-active", item === button);
          item.setAttribute("aria-pressed", item === button ? "true" : "false");
        });
      });
    });

    var themeToggle = document.querySelector("[data-theme-toggle]");
    if (themeToggle) {
      themeToggle.addEventListener("click", function () {
        var root = document.documentElement;
        var current = root.getAttribute("data-theme");
        if (!current) {
          current = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }
        var next = current === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        try { localStorage.setItem("wf-theme", next); } catch (e) {}
      });
    }

    var reveal = document.querySelectorAll("[data-reveal]");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      reveal.forEach(function (node) { node.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    reveal.forEach(function (node) { io.observe(node); });
  })();
</script>`;

const dashboardBaseCss = `
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  background: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-body);
  --wf-pos: #166534;
  --wf-neg: #b91c1c;
  --wf-warn: #92400e;
}

/* Dark mode: the dark green/red/amber status text fails contrast on the dark
   tinted pill, so lift them to brighter tones that read on a dark surface. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) body {
    --wf-pos: #4ade80;
    --wf-neg: #f87171;
    --wf-warn: #fbbf24;
  }
}

[data-theme="dark"] body {
  --wf-pos: #4ade80;
  --wf-neg: #f87171;
  --wf-warn: #fbbf24;
}

a {
  color: inherit;
  text-decoration: none;
}

h1, h2, h3, p {
  margin: 0;
}

h1, h2, h3 {
  font-family: var(--font-heading);
}

.wf-dash {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 248px minmax(0, 1fr);
}

.wf-dash-side {
  position: sticky;
  top: 0;
  align-self: start;
  height: 100vh;
  padding: 22px 18px;
  display: flex;
  flex-direction: column;
  gap: 26px;
  background: color-mix(in srgb, var(--color-fg) 5%, var(--color-bg));
  border-right: 1px solid var(--border);
}

.wf-dash-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  min-width: 0;
}

.wf-dash-brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  font-size: 0.8rem;
  color: var(--color-on-primary);
  background: var(--color-primary);
}

.wf-dash-brand-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wf-dash-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.wf-dash-nav-link {
  padding: 10px 12px;
  border-radius: 9px;
  font-weight: 650;
  color: var(--muted-foreground);
  transition: background 150ms ease, color 150ms ease;
}

.wf-dash-nav-link:hover {
  color: var(--color-fg);
  background: color-mix(in srgb, var(--color-fg) 6%, transparent);
}

.wf-dash-nav-link.is-active {
  color: var(--color-on-primary);
  background: var(--color-primary);
}

.wf-dash-nav-group {
  display: block;
  margin: 14px 0 4px;
  padding: 0 10px;
  color: var(--muted-foreground);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.wf-dash-nav-group:first-child {
  margin-top: 0;
}

.wf-dash-main {
  padding: clamp(20px, 3vw, 34px);
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.wf-dash-topbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
}

.wf-dash-heading h1 {
  font-size: clamp(1.7rem, 3vw, 2.4rem);
  line-height: 1.05;
}

.wf-dash-subtitle {
  margin-top: 6px;
  color: var(--muted-foreground);
}

.wf-dash-topbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.wf-dash-filters {
  display: inline-flex;
  padding: 4px;
  gap: 2px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--color-bg);
}

.wf-dash-filter {
  min-height: 36px;
  padding: 0 14px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--muted-foreground);
  font: inherit;
  font-weight: 650;
  cursor: pointer;
}

.wf-dash-filter.is-active {
  color: var(--color-on-primary);
  background: var(--color-primary);
}

.wf-dash-cta {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 16px;
  border-radius: 9px;
  font-weight: 750;
  color: var(--color-on-primary);
  background: var(--color-secondary);
}

.wf-dash-theme {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid var(--border);
  border-radius: 9px;
  background: var(--card);
  color: var(--color-fg);
  font: inherit;
  font-weight: 650;
  cursor: pointer;
}

.wf-dash-theme:hover {
  background: color-mix(in srgb, var(--color-fg) 6%, var(--card));
}

[data-reveal] {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 420ms ease, transform 420ms ease;
}

[data-reveal].is-in {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  [data-reveal] {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

@media (max-width: 860px) {
  .wf-dash {
    grid-template-columns: 1fr;
  }

  .wf-dash-side {
    position: static;
    height: auto;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    overflow-x: auto;
  }

  .wf-dash-nav {
    flex-direction: row;
    gap: 4px;
  }

  .wf-dash-nav-link {
    white-space: nowrap;
  }
}

@media (max-width: 520px) {
  .wf-dash-topbar {
    align-items: flex-start;
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

function escapeAttribute(value: string): string {
  return escapeHtml(value).replace(/'/g, "&#39;");
}
