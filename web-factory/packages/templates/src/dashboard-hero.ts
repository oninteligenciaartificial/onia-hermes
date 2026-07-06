import { renderSparkline, trendGlyph } from "./dashboard-charts";
import type { DashboardHeroPanel } from "./dashboard-types";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Tier 1 of the dashboard hierarchy: the single highest-weight element. Two
// data-driven variants (never both): a growth-style KPI fused with its own
// inline trend (metric-trend), or an ops-style priority queue (queue). Which
// one to use is a product decision documented in WEB_FACTORY_DASHBOARD_SYSTEM.md,
// not a code fork - both render through this one function.
export function renderHeroPanel(panel: DashboardHeroPanel | undefined): string {
  if (!panel) {
    return "";
  }
  return panel.kind === "metric-trend" ? renderMetricTrendHero(panel) : renderQueueHero(panel);
}

function renderMetricTrendHero(panel: Extract<DashboardHeroPanel, { kind: "metric-trend" }>): string {
  const { kpi, points } = panel;
  const sparkline =
    points.length > 0
      ? renderSparkline({ title: kpi.label, unit: "", type: "sparkline", points, series: [] })
      : "";

  return `
        <section class="wf-dash-card wf-dash-hero wf-dash-hero--metric" data-reveal aria-label="Metrica principal">
          <span class="wf-dash-hero-label">${escapeHtml(kpi.label)}</span>
          <div class="wf-dash-hero-row">
            <strong class="wf-dash-hero-value">${escapeHtml(kpi.value)}</strong>
            ${
              kpi.delta
                ? `<span class="wf-kpi-delta wf-kpi-delta--${kpi.trend}">${trendGlyph(kpi.trend)} ${escapeHtml(kpi.delta)}</span>`
                : ""
            }
          </div>
          ${kpi.context ? `<span class="wf-kpi-context">${escapeHtml(kpi.context)}</span>` : ""}
          ${sparkline ? `<div class="wf-dash-hero-spark">${sparkline}</div>` : ""}
        </section>`;
}

const QUEUE_GLYPH: Record<string, string> = {
  urgente: "&#33;",
  pendiente: "&#8226;",
  "al-dia": "&#10003;",
};

function renderQueueHero(panel: Extract<DashboardHeroPanel, { kind: "queue" }>): string {
  const items = panel.items
    .map((item) => {
      const label = escapeHtml(item.titulo);
      const inner = `
            <span class="wf-dash-queue-status wf-dash-queue-item--${item.estado}" aria-hidden="true">${QUEUE_GLYPH[item.estado] ?? "&#8226;"}</span>
            <span class="wf-dash-queue-title">${label}</span>
            <span class="wf-dash-queue-meta">${escapeHtml(item.meta)}</span>`;
      return item.url
        ? `<li class="wf-dash-queue-row"><a class="wf-dash-queue-link" href="${item.url}">${inner}</a></li>`
        : `<li class="wf-dash-queue-row">${inner}</li>`;
    })
    .join("");

  return `
        <section class="wf-dash-card wf-dash-hero wf-dash-hero--queue" data-reveal aria-label="${escapeHtml(panel.title)}">
          <h2 class="wf-dash-hero-label">${escapeHtml(panel.title)}</h2>
          <ol class="wf-dash-queue-list">${items}</ol>
        </section>`;
}

export const dashboardHeroCss = `
.wf-dash-hero {
  grid-column: 1 / -1;
  padding: 24px;
}

.wf-dash-hero-label {
  display: block;
  color: var(--muted-foreground);
  font-size: 0.88rem;
  margin-bottom: 10px;
}

.wf-dash-hero-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
}

.wf-dash-hero-value {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 3vw, 2.75rem);
  color: var(--color-fg);
}

.wf-dash-hero-spark {
  margin-top: 14px;
  max-width: 420px;
}

.wf-dash-queue-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.wf-dash-queue-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 10px 8px;
  border-bottom: 1px solid var(--border);
}

.wf-dash-queue-row:last-child {
  border-bottom: none;
}

.wf-dash-queue-link {
  display: contents;
}

.wf-dash-queue-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: 800;
}

.wf-dash-queue-item--urgente {
  color: var(--wf-neg);
  background: color-mix(in srgb, var(--wf-neg) 16%, transparent);
}

.wf-dash-queue-item--pendiente {
  color: var(--wf-warn);
  background: color-mix(in srgb, var(--wf-warn) 16%, transparent);
}

.wf-dash-queue-item--al-dia {
  color: var(--wf-pos);
  background: color-mix(in srgb, var(--wf-pos) 16%, transparent);
}

.wf-dash-queue-title {
  color: var(--color-fg);
  font-weight: 600;
}

.wf-dash-queue-meta {
  color: var(--muted-foreground);
  font-size: 0.85rem;
  white-space: nowrap;
}
`;
