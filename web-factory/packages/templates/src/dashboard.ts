import { clientTokenCss } from "@onia/tokens";

export type DashboardKpi = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "flat";
  context: string;
};

export type DashboardChart = {
  title: string;
  unit: string;
  type: "bar" | "line";
  points: Array<{ label: string; value: number }>;
};

export type DashboardTable = {
  title: string;
  columns: string[];
  rows: string[][];
};

export type DashboardData = {
  title: string;
  subtitle: string;
  nav: string[];
  filters: string[];
  kpis: DashboardKpi[];
  charts: DashboardChart[];
  table: DashboardTable;
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
  const nav = dash.nav.length ? dash.nav : ["Resumen", "Reportes", "Actividad", "Ajustes"];

  return `
    <div class="wf-dash" id="top">
      <aside class="wf-dash-side" aria-label="Navegacion del panel">
        <a class="wf-dash-brand" href="#top">
          <span class="wf-dash-brand-mark">${escapeHtml(brandMark)}</span>
          <span class="wf-dash-brand-name">${escapeHtml(client.nombre)}</span>
        </a>
        <nav class="wf-dash-nav">
          ${nav
            .map(
              (item, index) =>
                `<a class="wf-dash-nav-link${index === 0 ? " is-active" : ""}" href="#top"${
                  index === 0 ? ' aria-current="page"' : ""
                }>${escapeHtml(item)}</a>`,
            )
            .join("\n          ")}
        </nav>
      </aside>
      <div class="wf-dash-main">
        ${renderTopbar(client)}
        ${renderKpis(dash.kpis)}
        ${renderCharts(dash.charts)}
        ${renderTable(dash.table)}
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
            ${filters}
            ${cta}
          </div>
        </header>`;
}

function renderKpis(kpis: DashboardKpi[]): string {
  if (!kpis.length) {
    return renderEmpty("Sin KPIs definidos", "Carga metricas clave con valor, delta y periodo.");
  }

  const cards = kpis
    .map(
      (kpi) => `
          <article class="wf-kpi" data-reveal>
            <span class="wf-kpi-label">${escapeHtml(kpi.label)}</span>
            <strong class="wf-kpi-value">${escapeHtml(kpi.value)}</strong>
            <div class="wf-kpi-foot">
              ${
                kpi.delta
                  ? `<span class="wf-kpi-delta wf-kpi-delta--${kpi.trend}">${trendGlyph(kpi.trend)} ${escapeHtml(
                      kpi.delta,
                    )}</span>`
                  : ""
              }
              ${kpi.context ? `<span class="wf-kpi-context">${escapeHtml(kpi.context)}</span>` : ""}
            </div>
          </article>`,
    )
    .join("");

  return `
        <section class="wf-dash-kpis" aria-label="Indicadores clave">
          ${cards}
        </section>`;
}

function renderCharts(charts: DashboardChart[]): string {
  if (!charts.length) {
    return "";
  }

  const cards = charts
    .map(
      (chart) => `
          <article class="wf-chart-card" data-reveal>
            <div class="wf-chart-head">
              <h2>${escapeHtml(chart.title)}</h2>
              ${chart.unit ? `<span class="wf-chart-unit">${escapeHtml(chart.unit)}</span>` : ""}
            </div>
            ${
              chart.points.length
                ? chart.type === "line"
                  ? renderLineChart(chart.points)
                  : renderBarChart(chart.points)
                : renderEmpty("Sin datos", "Este grafico se completa cuando llegan los datos.")
            }
          </article>`,
    )
    .join("");

  return `
        <section class="wf-dash-charts" aria-label="Graficos">
          ${cards}
        </section>`;
}

function renderTable(table: DashboardTable): string {
  if (!table.columns.length) {
    return "";
  }

  const head = `<tr>${table.columns.map((column) => `<th scope="col">${escapeHtml(column)}</th>`).join("")}</tr>`;

  const body = table.rows.length
    ? table.rows
        .map(
          (row) =>
            `<tr>${table.columns
              .map((_, index) => `<td>${escapeHtml(row[index] ?? "")}</td>`)
              .join("")}</tr>`,
        )
        .join("")
    : `<tr class="wf-table-empty-row"><td colspan="${table.columns.length}">Sin registros para el periodo seleccionado.</td></tr>`;

  return `
        <section class="wf-dash-table" aria-label="${escapeAttribute(table.title)}" data-reveal>
          <div class="wf-dash-table-head">
            <h2>${escapeHtml(table.title)}</h2>
          </div>
          <div class="wf-dash-table-scroll">
            <table>
              <thead>${head}</thead>
              <tbody>${body}</tbody>
            </table>
          </div>
        </section>`;
}

function renderEmpty(title: string, hint: string): string {
  return `<div class="wf-dash-empty" role="status">
            <strong>${escapeHtml(title)}</strong>
            <span>${escapeHtml(hint)}</span>
          </div>`;
}

// --- charts (pure SVG computed from data, no runtime deps) ---

const CHART_W = 320;
const CHART_H = 150;
const PAD_L = 34;
const PAD_R = 12;
const PAD_T = 12;
const PAD_B = 22;
const PLOT_W = CHART_W - PAD_L - PAD_R;
const PLOT_H = CHART_H - PAD_T - PAD_B;

function niceMax(value: number): number {
  if (value <= 0) {
    return 1;
  }
  const exponent = Math.floor(Math.log10(value));
  const base = Math.pow(10, exponent);
  const fraction = value / base;
  const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return niceFraction * base;
}

function formatTick(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  }
  return `${Math.round(value)}`;
}

function renderGrid(max: number): string {
  return [0, 0.5, 1]
    .map((tick) => {
      const y = PAD_T + PLOT_H - tick * PLOT_H;
      const dash = tick === 0 ? "" : ' stroke-dasharray="2 3"';
      return (
        `<line x1="${PAD_L}" y1="${y.toFixed(1)}" x2="${CHART_W - PAD_R}" y2="${y.toFixed(
          1,
        )}" stroke="var(--border)" stroke-width="1"${dash}></line>` +
        `<text x="${PAD_L - 6}" y="${(y + 3).toFixed(1)}" text-anchor="end" class="wf-chart-axis">${formatTick(
          tick * max,
        )}</text>`
      );
    })
    .join("");
}

function renderBarChart(points: Array<{ label: string; value: number }>): string {
  const max = niceMax(Math.max(...points.map((point) => Math.max(point.value, 0)), 1));
  const count = points.length;
  const gap = count > 12 ? 3 : 8;
  const barWidth = Math.max(2, (PLOT_W - gap * (count - 1)) / count);

  const bars = points
    .map((point, index) => {
      const height = (Math.max(point.value, 0) / max) * PLOT_H;
      const x = PAD_L + index * (barWidth + gap);
      const y = PAD_T + PLOT_H - height;
      return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${height.toFixed(
        1,
      )}" rx="3" fill="var(--color-primary)"><title>${escapeHtml(point.label)}: ${point.value}</title></rect>`;
    })
    .join("");

  const labels = renderChartLabels(points, (index) => PAD_L + index * (barWidth + gap) + barWidth / 2);

  return chartSvg(`${renderGrid(max)}${bars}${labels}`);
}

function renderLineChart(points: Array<{ label: string; value: number }>): string {
  const max = niceMax(Math.max(...points.map((point) => point.value), 1));
  const count = points.length;

  const xFor = (index: number): number =>
    PAD_L + (count === 1 ? PLOT_W / 2 : (index / (count - 1)) * PLOT_W);
  const yFor = (value: number): number => PAD_T + PLOT_H - (Math.max(value, 0) / max) * PLOT_H;

  const line = points.map((point, index) => `${xFor(index).toFixed(1)},${yFor(point.value).toFixed(1)}`).join(" ");
  const area = `${xFor(0).toFixed(1)},${(PAD_T + PLOT_H).toFixed(1)} ${line} ${xFor(count - 1).toFixed(1)},${(
    PAD_T + PLOT_H
  ).toFixed(1)}`;
  const dots = points
    .map(
      (point, index) =>
        `<circle cx="${xFor(index).toFixed(1)}" cy="${yFor(point.value).toFixed(
          1,
        )}" r="3" fill="var(--color-primary)"><title>${escapeHtml(point.label)}: ${point.value}</title></circle>`,
    )
    .join("");

  const labels = renderChartLabels(points, xFor);

  return chartSvg(
    `${renderGrid(max)}<polygon points="${area}" fill="var(--color-primary)" fill-opacity="0.12"></polygon>` +
      `<polyline points="${line}" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></polyline>${dots}${labels}`,
  );
}

function renderChartLabels(
  points: Array<{ label: string; value: number }>,
  xFor: (index: number) => number,
): string {
  const step = points.length > 8 ? Math.ceil(points.length / 6) : 1;
  return points
    .map((point, index) =>
      index % step === 0
        ? `<text x="${xFor(index).toFixed(1)}" y="${CHART_H - 6}" text-anchor="middle" class="wf-chart-axis">${escapeHtml(
            point.label,
          )}</text>`
        : "",
    )
    .join("");
}

function chartSvg(inner: string): string {
  return `<svg class="wf-chart" viewBox="0 0 ${CHART_W} ${CHART_H}" role="img" preserveAspectRatio="xMidYMid meet">${inner}</svg>`;
}

function trendGlyph(trend: DashboardKpi["trend"]): string {
  if (trend === "up") {
    return "&#9650;";
  }
  if (trend === "down") {
    return "&#9660;";
  }
  return "&#8226;";
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

${dashboardBaseCss}`;
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
  --wf-pos: #15803d;
  --wf-neg: #b91c1c;
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

.wf-dash-kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 14px;
}

.wf-kpi {
  padding: 16px 18px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--card);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wf-kpi-label {
  color: var(--muted-foreground);
  font-size: 0.82rem;
  font-weight: 650;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.wf-kpi-value {
  font-family: var(--font-heading);
  font-size: clamp(1.6rem, 2.4vw, 2.1rem);
  line-height: 1;
}

.wf-kpi-foot {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.wf-kpi-delta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  background: color-mix(in srgb, var(--color-fg) 8%, transparent);
}

.wf-kpi-delta--up {
  color: var(--wf-pos);
  background: color-mix(in srgb, var(--wf-pos) 14%, transparent);
}

.wf-kpi-delta--down {
  color: var(--wf-neg);
  background: color-mix(in srgb, var(--wf-neg) 14%, transparent);
}

.wf-kpi-context {
  color: var(--muted-foreground);
  font-size: 0.8rem;
}

.wf-dash-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
}

.wf-chart-card,
.wf-dash-table {
  padding: 18px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--card);
}

.wf-chart-head,
.wf-dash-table-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
}

.wf-chart-head h2,
.wf-dash-table-head h2 {
  font-size: 1.05rem;
}

.wf-chart-unit {
  color: var(--muted-foreground);
  font-size: 0.82rem;
}

.wf-chart {
  width: 100%;
  height: auto;
  aspect-ratio: 320 / 150;
  display: block;
}

.wf-chart-axis {
  fill: var(--muted-foreground);
  font-size: 9px;
  font-family: var(--font-body);
}

.wf-dash-table-scroll {
  overflow-x: auto;
}

.wf-dash-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92rem;
}

.wf-dash-table th,
.wf-dash-table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}

.wf-dash-table th {
  position: sticky;
  top: 0;
  color: var(--muted-foreground);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  background: var(--card);
}

.wf-dash-table tbody tr:hover td {
  background: color-mix(in srgb, var(--color-fg) 4%, transparent);
}

.wf-table-empty-row td {
  text-align: center;
  color: var(--muted-foreground);
  padding: 26px 12px;
}

.wf-dash-empty {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 26px;
  text-align: center;
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  color: var(--muted-foreground);
}

.wf-dash-empty strong {
  color: var(--color-fg);
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

  .wf-dash-charts {
    grid-template-columns: 1fr;
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
