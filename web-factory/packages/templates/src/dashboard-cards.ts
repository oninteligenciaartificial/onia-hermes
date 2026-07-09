import { hasChartData, renderChart, trendGlyph } from "./dashboard-charts";
import type { DashboardChart, DashboardKpi, DashboardSidePanel } from "./dashboard-types";

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

export type DashboardTableCell = string | { value: string; status?: "pos" | "neg" | "warn" };

export type DashboardTable = {
  title: string;
  columns: string[];
  rows: DashboardTableCell[][];
  filtros?: string[];
};

export function renderEmpty(title: string, hint: string): string {
  return `<div class="wf-dash-card wf-dash-empty" role="status">
            <strong>${escapeHtml(title)}</strong>
            <span>${escapeHtml(hint)}</span>
          </div>`;
}

export function renderKpis(kpis: DashboardKpi[]): string {
  if (!kpis.length) {
    return renderEmpty("Sin KPIs definidos", "Carga metricas clave con valor, delta y periodo.");
  }

  const cards = kpis
    .map(
      (kpi) => `
          <article class="wf-dash-card wf-dash-card--compact wf-kpi" data-reveal>
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

export function renderCharts(charts: DashboardChart[]): string {
  if (!charts.length) {
    return "";
  }

  const cards = charts
    .map(
      (chart) => `
          <article class="wf-dash-card wf-chart-card" data-reveal>
            <div class="wf-chart-head">
              <h2>${escapeHtml(chart.title)}</h2>
              ${chart.unit ? `<span class="wf-chart-unit">${escapeHtml(chart.unit)}</span>` : ""}
            </div>
            ${
              hasChartData(chart)
                ? renderChart(chart)
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

const PILL_GLYPH: Record<string, string> = { pos: "&#10003;", neg: "&#10005;", warn: "&#33;" };

function renderCell(cell: DashboardTableCell): string {
  if (typeof cell === "string") {
    return escapeHtml(cell);
  }
  const status = cell.status;
  if (!status) {
    return escapeHtml(cell.value);
  }
  return `<span class="wf-dash-pill wf-dash-pill--${status}"><span class="wf-dash-pill-glyph" aria-hidden="true">${PILL_GLYPH[status]}</span>${escapeHtml(cell.value)}</span>`;
}

function renderFiltros(filtros: string[] | undefined): string {
  if (!filtros || !filtros.length) {
    return "";
  }
  return `<div class="wf-dash-chips" role="group" aria-label="Filtros">${filtros
    .map((label) => `<button type="button" class="wf-dash-chip">${escapeHtml(label)}</button>`)
    .join("")}</div>`;
}

export function renderTable(table: DashboardTable): string {
  if (!table.columns.length) {
    return "";
  }

  const head = `<tr>${table.columns.map((column) => `<th scope="col">${escapeHtml(column)}</th>`).join("")}</tr>`;

  const body = table.rows.length
    ? table.rows
        .map(
          (row) =>
            `<tr>${table.columns
              .map((_, index) => `<td>${row[index] !== undefined ? renderCell(row[index]) : ""}</td>`)
              .join("")}</tr>`,
        )
        .join("")
    : `<tr class="wf-table-empty-row"><td colspan="${table.columns.length}">Sin registros para el periodo seleccionado.</td></tr>`;

  return `
        <section class="wf-dash-card wf-dash-table" aria-label="${escapeAttribute(table.title)}" data-reveal>
          <div class="wf-dash-table-head">
            <h2>${escapeHtml(table.title)}</h2>
          </div>
          ${renderFiltros(table.filtros)}
          <div class="wf-dash-table-scroll" tabindex="0" role="group" aria-label="${escapeAttribute(table.title)} (tabla desplazable)">
            <table>
              <thead>${head}</thead>
              <tbody>${body}</tbody>
            </table>
          </div>
        </section>`;
}

function initialsOf(label: string): string {
  return (
    label
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

export function renderSidePanel(panel: DashboardSidePanel | undefined): string {
  if (!panel) {
    return "";
  }
  const rows = panel.items
    .map(
      (item) => `
          <li class="wf-dash-side-row">
            <span class="wf-dash-side-avatar" aria-hidden="true">${escapeHtml(item.initial ?? initialsOf(item.label))}</span>
            <span class="wf-dash-side-label">${escapeHtml(item.label)}</span>
            <span class="wf-dash-side-value">${escapeHtml(item.value)}</span>
          </li>`,
    )
    .join("");

  return `
        <aside class="wf-dash-card wf-dash-side-panel" aria-label="${escapeAttribute(panel.title)}" data-reveal>
          <h2 class="wf-dash-table-head-title">${escapeHtml(panel.title)}</h2>
          <ul class="wf-dash-side-list">${rows}</ul>
        </aside>`;
}

export const dashboardCardsCss = `
.wf-dash-card {
  padding: 18px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--card);
}

.wf-dash-card--compact {
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wf-dash-kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 14px;
}

.wf-dash-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
}

@media (max-width: 520px) {
  .wf-dash-charts {
    grid-template-columns: 1fr;
  }
}

.wf-kpi-label {
  color: var(--muted-foreground);
  font-size: 0.82rem;
}

.wf-kpi-value {
  font-family: var(--font-heading);
  font-size: 1.6rem;
  color: var(--color-fg);
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

.wf-dash-table-scroll {
  overflow-x: auto;
}

.wf-dash-table-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
}

.wf-dash-table-head h2 {
  font-size: 1.05rem;
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
  border-style: dashed;
  color: var(--muted-foreground);
}

.wf-dash-empty strong {
  color: var(--color-fg);
}

.wf-dash-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.wf-dash-chip {
  padding: 6px 12px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: transparent;
  color: var(--muted-foreground);
  font-size: 0.8rem;
  cursor: pointer;
}

.wf-dash-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 9px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
}

.wf-dash-pill-glyph {
  font-size: 0.72rem;
}

.wf-dash-pill--pos {
  color: var(--wf-pos);
  background: color-mix(in srgb, var(--wf-pos) 14%, transparent);
}

.wf-dash-pill--neg {
  color: var(--wf-neg);
  background: color-mix(in srgb, var(--wf-neg) 14%, transparent);
}

.wf-dash-pill--warn {
  color: var(--wf-warn);
  background: color-mix(in srgb, var(--wf-warn) 14%, transparent);
}

.wf-dash-detail-row {
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.wf-dash-table-head-title {
  font-size: 1.05rem;
  margin-bottom: 14px;
}

.wf-dash-side-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.wf-dash-side-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
}

.wf-dash-side-row:last-child {
  border-bottom: none;
}

.wf-dash-side-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  flex: 0 0 auto;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--color-on-primary, #fff);
  background: var(--color-primary);
}

.wf-dash-side-label {
  flex: 1;
  color: var(--color-fg);
  font-weight: 600;
  font-size: 0.9rem;
}

.wf-dash-side-value {
  color: var(--muted-foreground);
  font-size: 0.85rem;
  white-space: nowrap;
}

@media (max-width: 860px) {
  .wf-dash-detail-row {
    grid-template-columns: minmax(0, 1fr);
  }

  .wf-dash-table,
  .wf-dash-side-panel {
    min-width: 0;
  }
}
`;
