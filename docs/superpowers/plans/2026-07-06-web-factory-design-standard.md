# Web Factory Design Standard (Landings + Dashboards) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Document the landing design standard (landing-clinic v2 as the floor) and build a real hierarchy-driven dashboard design system (hero panel, card primitive, status pills, states, grouped nav) on top of Web Factory's existing `dashboard` template, shipping `dashboard-demo` as the live reference.

**Architecture:** Landing side is documentation only (no code). Dashboard side splits the monolithic `packages/templates/src/dashboard.ts` (1039 lines) into 3 files by responsibility (orchestration / charts / cards), adds 4 new optional, backward-compatible data fields (`heroPanel`, table `filtros` + rich cells, `sidePanel`, grouped `nav`), and re-composes the 3 near-duplicate card styles onto one `.wf-dash-card` primitive. Every new field is added to BOTH the TS type (`DashboardData`) and the Zod schema (`data/schema.ts`) in the same step — this codebase silently drops fields declared only in TS but not in Zod (confirmed bug pattern from this session).

**Tech Stack:** TypeScript, Zod (validation), vitest (unit), Playwright + axe-core (e2e a11y/visual/perf), pure SVG (no chart library), pnpm workspaces.

**Spec:** `docs/superpowers/specs/2026-07-06-web-factory-design-standard-design.md`

---

### Task 1: Landing Design Standard doc

**Files:**
- Create: `web-factory/WEB_FACTORY_LANDING_STANDARD.md`

- [ ] **Step 1: Write the standard doc**

Create `web-factory/WEB_FACTORY_LANDING_STANDARD.md`:

```markdown
# Web Factory — Landing Design Standard

Piso de calidad para toda landing nueva o rediseñada, agnóstico de rubro.
landing-clinic v2 (`web-factory/packages/blocks/src/clinic-*.ts`,
`web-factory/packages/templates/src/landing-clinic.ts`) es el ejemplo
canónico — no la única forma válida, sino la vara.

## Piso de calidad (checklist)

- [ ] ≥4 Required Qualities presentes: jerarquía por escala, ritmo
      no-uniforme, profundidad/layering, tipografía con carácter, color
      semántico, estados hover/focus diseñados, bento/editorial, motion con
      propósito.
- [ ] Hero elegido por el dispatcher de variantes (`resolveHeroVariant` en
      `clinic-hero.ts`), nunca hardcodeado a una sola composición.
- [ ] Imagen real o marcada como stock (`.context.md`) en el hero **y** al
      menos una banda editorial a mitad de página.
- [ ] Motion scroll-driven progresivo: `@supports (animation-timeline: ...)`
      + `prefers-reduced-motion: no-preference`, con fallback visible.
- [ ] `:focus-visible` en todo interactivo, con contraste sobre foto y sobre
      fondo claro/oscuro (anillo + halo, no solo `outline` default).
- [ ] Tokens-only CSS: cero color hardcodeado en bloques/templates.
- [ ] Íconos SVG reales de un set canónico (`icons.ts`), nunca iniciales.

## DO

- Bento asimétrico para ofertas agrupadas (`clinic-services.ts`).
- Timeline conectada para procesos (`clinic-process.ts`), no cards clonadas.
- Marquee reutilizable para sellos/beneficios repetibles (`marquee.ts`), con
  pausa en hover y `aria-hidden` en la copia duplicada.
- Copy parametrizable con default sensato (`disponibilidad`,
  `ctaSecundariaTexto`) para que un bloque compartido sirva a cualquier
  rubro. Nunca texto de un solo vertical hardcodeado en un componente
  "genérico" (bug real encontrado y corregido en esta sesión: "Ver
  tratamientos" y "Atención con turno" estaban fijos en las 3 variantes de
  hero).
- Heurísticos (como `pickCredencialIcon`) con vocabulario amplio, no sesgado
  a un solo rubro.

## DON'T

- Hero "texto izquierda + imagen derecha" como única composición
  considerada.
- Grids de cards idénticas (mismo tamaño, mismo ícono, cero variación).
- Gradient-text, glassmorphism decorativo por defecto, hero-metric-SaaS-
  cliché.
- Copy o íconos que asumen un solo vertical dentro de un bloque compartido.
- Generar (no adaptar) datos de prueba como si fueran reales; stock siempre
  marcado en `.context.md`.

## Referencias

- `WEB_FACTORY_HERO_VARIANTS.md` — sistema de variantes de hero y cómo
  agregar una nueva.
- `WEB_FACTORY_PATTERN_BANK_2026.md` — playbooks por rubro, quality bar
  universal, fuentes de investigación permitidas.
- `WEB_FACTORY_SKILL_STACK.md` — flujo de skills para construir/rediseñar.
- Implementación canónica: landing-clinic v2, PR con los commits desde
  `2b78196e` (rediseño full-bleed) en adelante.
```

- [ ] **Step 2: Commit**

```bash
git add web-factory/WEB_FACTORY_LANDING_STANDARD.md
git commit -m "docs(web-factory): landing design standard (floor: landing-clinic v2)"
```

---

### Task 2: Extract chart rendering into `dashboard-charts.ts` (mechanical, no behavior change)

**Files:**
- Create: `web-factory/packages/templates/src/dashboard-charts.ts`
- Modify: `web-factory/packages/templates/src/dashboard.ts`

- [ ] **Step 1: Run the existing dashboard tests to confirm the baseline is green**

Run: `cd web-factory && pnpm exec vitest run generate/generate.test.ts`
Expected: PASS (all existing tests, including the 3 dashboard cases at lines 176-291).

- [ ] **Step 2: Create `dashboard-charts.ts` with the chart renderer moved as-is**

Create `web-factory/packages/templates/src/dashboard-charts.ts`:

```ts
import type { DashboardChart, DashboardKpi } from "./dashboard-types";

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

// Token-driven palette for multi-series and donut slices (no hardcoded brand).
const SERIES_COLORS = [
  "var(--color-primary)",
  "var(--color-accent)",
  "var(--color-secondary)",
  "color-mix(in srgb, var(--color-primary) 50%, var(--color-bg))",
  "color-mix(in srgb, var(--color-accent) 50%, var(--color-bg))",
  "color-mix(in srgb, var(--color-secondary) 50%, var(--color-bg))",
];

export function hasChartData(chart: DashboardChart): boolean {
  return chart.points.length > 0 || (chart.series ?? []).some((series) => series.points.length > 0);
}

export function renderChart(chart: DashboardChart): string {
  switch (chart.type) {
    case "donut":
      return renderDonutChart(chart);
    case "sparkline":
      return renderSparkline(chart);
    case "line":
      return renderLineChart(chart);
    default:
      return renderBarChart(chart);
  }
}

function renderLegend(items: Array<{ name: string; color: string }>): string {
  return `<div class="wf-chart-legend">${items
    .map(
      (item) =>
        `<span class="wf-chart-legend-item"><span class="wf-chart-legend-dot" style="background:${item.color}"></span>${escapeHtml(
          item.name,
        )}</span>`,
    )
    .join("")}</div>`;
}

function chartLabel(chart: DashboardChart): string {
  const kind =
    chart.type === "line"
      ? "Grafico de linea"
      : chart.type === "donut"
        ? "Grafico de dona"
        : chart.type === "sparkline"
          ? "Sparkline"
          : "Grafico de barras";
  return `${kind}: ${chart.title}${chart.unit ? ` (${chart.unit})` : ""}`;
}

function renderBarChart(chart: DashboardChart): string {
  const points = chart.points.length ? chart.points : chart.series?.[0]?.points ?? [];
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

  return chartSvg(`${renderGrid(max)}${bars}${labels}`, chartLabel(chart));
}

function renderLineChart(chart: DashboardChart): string {
  const series =
    chart.series && chart.series.length ? chart.series : [{ name: chart.title, points: chart.points }];
  const max = niceMax(Math.max(...series.flatMap((entry) => entry.points.map((point) => point.value)), 1));
  const multi = series.length > 1;

  const xFor = (index: number, count: number): number =>
    PAD_L + (count <= 1 ? PLOT_W / 2 : (index / (count - 1)) * PLOT_W);
  const yFor = (value: number): number => PAD_T + PLOT_H - (Math.max(value, 0) / max) * PLOT_H;

  const lines = series
    .map((entry, seriesIndex) => {
      const color = SERIES_COLORS[seriesIndex % SERIES_COLORS.length];
      const count = entry.points.length;
      const line = entry.points
        .map((point, index) => `${xFor(index, count).toFixed(1)},${yFor(point.value).toFixed(1)}`)
        .join(" ");
      const area = multi
        ? ""
        : `<polygon points="${xFor(0, count).toFixed(1)},${(PAD_T + PLOT_H).toFixed(1)} ${line} ${xFor(
            count - 1,
            count,
          ).toFixed(1)},${(PAD_T + PLOT_H).toFixed(1)}" fill="${color}" fill-opacity="0.12"></polygon>`;
      const dots = entry.points
        .map(
          (point, index) =>
            `<circle cx="${xFor(index, count).toFixed(1)}" cy="${yFor(point.value).toFixed(
              1,
            )}" r="2.5" fill="${color}"><title>${escapeHtml(entry.name)} - ${escapeHtml(point.label)}: ${
              point.value
            }</title></circle>`,
        )
        .join("");
      return `${area}<polyline points="${line}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></polyline>${dots}`;
    })
    .join("");

  const labelEntry = series.reduce((longest, entry) => (entry.points.length > longest.points.length ? entry : longest), series[0]);
  const labels = renderChartLabels(labelEntry.points, (index) => xFor(index, labelEntry.points.length));

  const svg = chartSvg(`${renderGrid(max)}${lines}${labels}`, chartLabel(chart));
  if (!multi) {
    return svg;
  }
  const legend = renderLegend(
    series.map((entry, index) => ({ name: entry.name, color: SERIES_COLORS[index % SERIES_COLORS.length] })),
  );
  return `${legend}${svg}`;
}

function renderDonutChart(chart: DashboardChart): string {
  const points = chart.points.filter((point) => point.value > 0);
  const total = points.reduce((sum, point) => sum + point.value, 0) || 1;
  const size = 150;
  const cx = size / 2;
  const radius = 52;
  const stroke = 22;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;
  const arcs = points
    .map((point, index) => {
      const length = (point.value / total) * circumference;
      const color = SERIES_COLORS[index % SERIES_COLORS.length];
      const segment = `<circle cx="${cx}" cy="${cx}" r="${radius}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-dasharray="${length.toFixed(
        2,
      )} ${(circumference - length).toFixed(2)}" stroke-dashoffset="${(-accumulated).toFixed(
        2,
      )}" transform="rotate(-90 ${cx} ${cx})"><title>${escapeHtml(point.label)}: ${point.value} (${Math.round(
        (point.value / total) * 100,
      )}%)</title></circle>`;
      accumulated += length;
      return segment;
    })
    .join("");

  const svg = `<svg class="wf-chart wf-donut" viewBox="0 0 ${size} ${size}" role="img" aria-label="${escapeAttribute(
    chartLabel(chart),
  )}" preserveAspectRatio="xMidYMid meet"><circle cx="${cx}" cy="${cx}" r="${radius}" fill="none" stroke="var(--border)" stroke-width="${stroke}"></circle>${arcs}</svg>`;
  const legend = renderLegend(
    points.map((point, index) => ({
      name: `${point.label} ${Math.round((point.value / total) * 100)}%`,
      color: SERIES_COLORS[index % SERIES_COLORS.length],
    })),
  );
  return `<div class="wf-donut-wrap">${svg}${legend}</div>`;
}

export function renderSparkline(chart: DashboardChart): string {
  const points = chart.points;
  const values = points.map((point) => point.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const width = 320;
  const height = 60;
  const pad = 6;
  const count = points.length;

  const xFor = (index: number): number => pad + (count <= 1 ? (width - 2 * pad) / 2 : (index / (count - 1)) * (width - 2 * pad));
  const yFor = (value: number): number => height - pad - ((value - min) / range) * (height - 2 * pad);

  const line = points.map((point, index) => `${xFor(index).toFixed(1)},${yFor(point.value).toFixed(1)}`).join(" ");
  const area = `${xFor(0).toFixed(1)},${height - pad} ${line} ${xFor(count - 1).toFixed(1)},${height - pad}`;
  const last = points[count - 1];
  const dot = last
    ? `<circle cx="${xFor(count - 1).toFixed(1)}" cy="${yFor(last.value).toFixed(1)}" r="3" fill="var(--color-primary)"></circle>`
    : "";

  return `<svg class="wf-chart wf-sparkline" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeAttribute(
    chartLabel(chart),
  )}" preserveAspectRatio="none"><polygon points="${area}" fill="var(--color-primary)" fill-opacity="0.12"></polygon><polyline points="${line}" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></polyline>${dot}</svg>`;
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

function chartSvg(inner: string, label: string): string {
  return `<svg class="wf-chart" viewBox="0 0 ${CHART_W} ${CHART_H}" role="img" aria-label="${escapeAttribute(
    label,
  )}" preserveAspectRatio="xMidYMid meet">${inner}</svg>`;
}

export function trendGlyph(trend: DashboardKpi["trend"]): string {
  if (trend === "up") {
    return "&#9650;";
  }
  if (trend === "down") {
    return "&#9660;";
  }
  return "&#8226;";
}

export const dashboardChartsCss = `
.wf-chart-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
}

.wf-chart-head h2 {
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

.wf-sparkline {
  aspect-ratio: 320 / 60;
}

.wf-donut-wrap {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}

.wf-donut {
  width: 140px;
  aspect-ratio: 1;
  flex: 0 0 auto;
}

.wf-chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-bottom: 10px;
  font-size: 0.82rem;
  color: var(--muted-foreground);
}

.wf-chart-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.wf-chart-legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  flex: 0 0 auto;
}

.wf-chart-axis {
  fill: var(--muted-foreground);
  font-size: 9px;
  font-family: var(--font-body);
}
`;
```

- [ ] **Step 3: Create the shared types file (needed by both split files)**

Create `web-factory/packages/templates/src/dashboard-types.ts`:

```ts
export type DashboardKpi = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "flat";
  context: string;
};

export type DashboardPoint = { label: string; value: number };

export type DashboardSeries = { name: string; points: DashboardPoint[] };

export type DashboardChart = {
  title: string;
  unit: string;
  type: "bar" | "line" | "donut" | "sparkline";
  points: DashboardPoint[];
  series?: DashboardSeries[];
};
```

- [ ] **Step 4: Remove the moved code from `dashboard.ts` and import it back**

In `web-factory/packages/templates/src/dashboard.ts`:

1. Delete the local `DashboardKpi`, `DashboardPoint`, `DashboardSeries`, `DashboardChart` type declarations (lines 3-21) and replace with an import.
2. Delete everything from the `// --- charts (pure SVG computed from data, no runtime deps) ---` comment (line 220) through the end of `trendGlyph` (line 483) — this entire block now lives in `dashboard-charts.ts`.
3. Delete the `dashboardChartsCss`-equivalent block from `dashboardBaseCss` (the `.wf-chart-head` through `.wf-chart-axis` rules, lines 850-919) since it moved too.
4. Add imports at the top and re-wire `renderCharts`/`renderKpis` to use the imported `renderChart`, `hasChartData`, `trendGlyph`.

Replace the top of the file:

```ts
import { clientTokenCss } from "@onia/tokens";
import { dashboardChartsCss, hasChartData, renderChart, trendGlyph } from "./dashboard-charts";
import type { DashboardChart, DashboardKpi, DashboardPoint, DashboardSeries } from "./dashboard-types";

export type { DashboardChart, DashboardKpi, DashboardPoint, DashboardSeries } from "./dashboard-types";

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
```

Update `renderCharts` (uses `hasChartData`/`renderChart` from the import instead of the local functions — same call sites, no logic change) and `renderKpis` (uses imported `trendGlyph`). Update `renderDashboardCss`:

```ts
export function renderDashboardCss(client: DashboardClient): string {
  return `${clientTokenCss(client)}

${dashboardBaseCss}

${dashboardChartsCss}`;
}
```

- [ ] **Step 5: Run tests to verify the extraction didn't break anything**

Run: `cd web-factory && pnpm exec vitest run generate/generate.test.ts`
Expected: PASS (same 3 dashboard tests, unchanged behavior — this was a pure move).

- [ ] **Step 6: Commit**

```bash
git add web-factory/packages/templates/src/dashboard.ts web-factory/packages/templates/src/dashboard-charts.ts web-factory/packages/templates/src/dashboard-types.ts
git commit -m "refactor(web-factory): extract dashboard chart rendering into dashboard-charts.ts"
```

---

### Task 3: Extract card/table/empty rendering into `dashboard-cards.ts` (mechanical, no behavior change)

**Files:**
- Create: `web-factory/packages/templates/src/dashboard-cards.ts`
- Modify: `web-factory/packages/templates/src/dashboard.ts`

- [ ] **Step 1: Create `dashboard-cards.ts` with KPI/table/empty rendering moved as-is**

Create `web-factory/packages/templates/src/dashboard-cards.ts`:

```ts
import { hasChartData, renderChart, trendGlyph } from "./dashboard-charts";
import type { DashboardChart, DashboardKpi } from "./dashboard-types";

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

export type DashboardTable = {
  title: string;
  columns: string[];
  rows: string[][];
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
              .map((_, index) => `<td>${escapeHtml(row[index] ?? "")}</td>`)
              .join("")}</tr>`,
        )
        .join("")
    : `<tr class="wf-table-empty-row"><td colspan="${table.columns.length}">Sin registros para el periodo seleccionado.</td></tr>`;

  return `
        <section class="wf-dash-card wf-dash-table" aria-label="${escapeAttribute(table.title)}" data-reveal>
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
`;
```

Note: `.wf-chart-card` keeps its `data-reveal` wrapper but its border/radius/background now come from the shared `.wf-dash-card` class added alongside it — no separate `.wf-chart-card { border; border-radius; background }` rule needed anymore in the base CSS (removed in the next step).

- [ ] **Step 2: Update `dashboard.ts` to import from `dashboard-cards.ts` instead of declaring locally**

In `web-factory/packages/templates/src/dashboard.ts`:

1. Remove the local `renderKpis`, `renderCharts`, `renderTable`, `renderEmpty` function bodies (they're now imported).
2. Remove `DashboardTable` type declaration (now imported).
3. Remove the corresponding CSS rules from `dashboardBaseCss`: `.wf-dash-kpis`, `.wf-kpi*`, `.wf-dash-table*` (except keep `.wf-dash` grid/topbar/sidebar rules which stay), `.wf-dash-empty*` (lines 773-834, 843-848, 921-972 per the original file — verify against current line numbers after Task 2's edits since they shifted).
4. Add the import and re-export:

```ts
import { dashboardCardsCss, renderCharts, renderEmpty, renderKpis, renderTable } from "./dashboard-cards";
import type { DashboardTable } from "./dashboard-cards";

export type { DashboardTable } from "./dashboard-cards";
```

5. Update `renderDashboardCss`:

```ts
export function renderDashboardCss(client: DashboardClient): string {
  return `${clientTokenCss(client)}

${dashboardBaseCss}

${dashboardChartsCss}

${dashboardCardsCss}`;
}
```

- [ ] **Step 3: Run tests to verify the extraction didn't break anything**

Run: `cd web-factory && pnpm exec vitest run generate/generate.test.ts`
Expected: PASS (same 3 dashboard tests). If any fail on a missing CSS class assertion, check that the class name wasn't accidentally dropped during the move (e.g., `.wf-chart-card` must still appear in the rendered HTML from `renderCharts`, and `.wf-dash-card` is additive, not a replacement).

- [ ] **Step 4: Commit**

```bash
git add web-factory/packages/templates/src/dashboard.ts web-factory/packages/templates/src/dashboard-cards.ts
git commit -m "refactor(web-factory): extract dashboard card/table rendering, add wf-dash-card primitive"
```

---

### Task 4: Add `--wf-warn` token (status pill support)

**Files:**
- Modify: `web-factory/packages/templates/src/dashboard.ts` (the `dashboardBaseCss` token block)

- [ ] **Step 1: Write the failing test**

Add to `web-factory/generate/generate.test.ts` (after the existing "creates a static dashboard site" test, i.e. after line ~226):

```ts
  it("emits a --wf-warn token alongside --wf-pos/--wf-neg for status pills", async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), "onia-web-factory-"));
    await mkdir(path.join(rootDir, "data", "clients"), { recursive: true });

    await writeFile(
      path.join(rootDir, "data", "clients", "panel.json"),
      JSON.stringify({
        nombre: "Panel Demo",
        slug: "panel",
        tagline: "Panel de control demo",
        descripcion: "Dashboard de ejemplo.",
        dashboard: { title: "Panel" },
      }),
      "utf8",
    );

    const result = await generateSite("panel", { rootDir, template: "dashboard" });
    const css = await readFile(path.join(result.outputDir, "site.css"), "utf8");

    expect(css).toContain("--wf-warn:");
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web-factory && pnpm exec vitest run generate/generate.test.ts -t "wf-warn"`
Expected: FAIL (`--wf-warn` not found).

- [ ] **Step 3: Add the token next to the existing pos/neg declarations**

In `web-factory/packages/templates/src/dashboard.ts`, find the token block inside `dashboardBaseCss` (the `body { ... --wf-pos: #166534; --wf-neg: #b91c1c; }` rule and its two dark-mode overrides) and add `--wf-warn`:

```css
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web-factory && pnpm exec vitest run generate/generate.test.ts -t "wf-warn"`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add web-factory/packages/templates/src/dashboard.ts web-factory/generate/generate.test.ts
git commit -m "feat(web-factory): add --wf-warn token for dashboard status pills"
```

---

### Task 5: `DashboardHeroPanel` type (both variants) + Zod schema

**Files:**
- Modify: `web-factory/packages/templates/src/dashboard-types.ts`
- Modify: `web-factory/data/schema.ts`
- Test: `web-factory/data/schema.test.ts`

- [ ] **Step 1: Write the failing test**

Add to `web-factory/data/schema.test.ts` (new `describe` block at the end of the file):

```ts
describe("clientSchema dashboard heroPanel", () => {
  it("parses a metric-trend heroPanel", () => {
    const parsed = clientSchema.parse({
      nombre: "Panel", slug: "panel", tagline: "t", descripcion: "d",
      dashboard: {
        heroPanel: {
          kind: "metric-trend",
          kpi: { label: "Ingresos", value: "Bs. 48.2k", delta: "12%", trend: "up", context: "vs mes anterior" },
          points: [{ label: "Ene", value: 10 }, { label: "Feb", value: 12 }],
        },
      },
    });
    expect(parsed.dashboard.heroPanel?.kind).toBe("metric-trend");
  });

  it("parses a queue heroPanel", () => {
    const parsed = clientSchema.parse({
      nombre: "Panel", slug: "panel", tagline: "t", descripcion: "d",
      dashboard: {
        heroPanel: {
          kind: "queue",
          title: "Para hoy",
          items: [{ titulo: "Turno 10:00", estado: "pendiente", meta: "Hoy 10:00" }],
        },
      },
    });
    expect(parsed.dashboard.heroPanel?.kind).toBe("queue");
  });

  it("defaults heroPanel to undefined when absent", () => {
    const parsed = clientSchema.parse({ nombre: "Panel", slug: "panel", tagline: "t", descripcion: "d" });
    expect(parsed.dashboard.heroPanel).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web-factory && pnpm exec vitest run data/schema.test.ts -t "heroPanel"`
Expected: FAIL (`heroPanel` is `undefined` in all cases including the ones that set it, or a Zod parse error since the field isn't declared — either failure mode confirms the gap).

- [ ] **Step 3: Add the TS types**

In `web-factory/packages/templates/src/dashboard-types.ts`, append:

```ts
export type DashboardHeroPanel =
  | { kind: "metric-trend"; kpi: DashboardKpi; points: DashboardPoint[] }
  | {
      kind: "queue";
      title: string;
      items: Array<{
        titulo: string;
        estado: "pendiente" | "urgente" | "al-dia";
        meta: string;
        url?: string;
      }>;
    };
```

- [ ] **Step 4: Add the Zod schema**

In `web-factory/data/schema.ts`, add after `dashboardTableSchema` (around line 122, before `dashboardSchema`):

```ts
const dashboardHeroPanelSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("metric-trend"),
    kpi: dashboardKpiSchema,
    points: z.array(dashboardPointSchema).default([]),
  }),
  z.object({
    kind: z.literal("queue"),
    title: z.string().min(1).default("Para hoy"),
    items: z
      .array(
        z.object({
          titulo: z.string().min(1),
          estado: z.enum(["pendiente", "urgente", "al-dia"]).default("pendiente"),
          meta: z.string().default(""),
          url: z.string().optional(),
        }),
      )
      .default([]),
  }),
]);
```

Then add `heroPanel: dashboardHeroPanelSchema.optional(),` inside `dashboardSchema`'s `.object({...})` (after the `table` field, before the closing `})`):

```ts
const dashboardSchema = z
  .object({
    title: z.string().default("Panel de control"),
    subtitle: z.string().default(""),
    nav: z.array(z.string().min(1)).default([]),
    filters: z.array(z.string().min(1)).default([]),
    kpis: z.array(dashboardKpiSchema).default([]),
    charts: z.array(dashboardChartSchema).default([]),
    table: dashboardTableSchema.default({ title: "Detalle", columns: [], rows: [] }),
    heroPanel: dashboardHeroPanelSchema.optional(),
  })
  .default({
    title: "Panel de control",
    subtitle: "",
    nav: [],
    filters: [],
    kpis: [],
    charts: [],
    table: { title: "Detalle", columns: [], rows: [] },
  });
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd web-factory && pnpm exec vitest run data/schema.test.ts -t "heroPanel"`
Expected: PASS (3 tests).

- [ ] **Step 6: Add `heroPanel` to `DashboardData`**

In `web-factory/packages/templates/src/dashboard.ts`, update the `DashboardData` type (added in Task 2's Step 4) to include:

```ts
export type DashboardData = {
  title: string;
  subtitle: string;
  nav: string[];
  filters: string[];
  kpis: DashboardKpi[];
  charts: DashboardChart[];
  table: DashboardTable;
  heroPanel?: DashboardHeroPanel;
};
```

Add `DashboardHeroPanel` to the import from `./dashboard-types` at the top of the file.

- [ ] **Step 7: Run the full unit suite to confirm no regressions**

Run: `cd web-factory && pnpm test`
Expected: PASS (all suites, since `heroPanel` is optional and unused so far).

- [ ] **Step 8: Commit**

```bash
git add web-factory/packages/templates/src/dashboard-types.ts web-factory/packages/templates/src/dashboard.ts web-factory/data/schema.ts web-factory/data/schema.test.ts
git commit -m "feat(web-factory): add DashboardHeroPanel type (metric-trend/queue) + schema"
```

---

### Task 6: Render the hero panel (both variants) + CSS

**Files:**
- Create: `web-factory/packages/templates/src/dashboard-hero.ts`
- Modify: `web-factory/packages/templates/src/dashboard.ts`
- Test: `web-factory/packages/templates/src/dashboard-hero.test.ts`

- [ ] **Step 1: Write the failing test**

Create `web-factory/packages/templates/src/dashboard-hero.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { renderHeroPanel } from "./dashboard-hero";

describe("renderHeroPanel", () => {
  it("renders a metric-trend hero as a fused KPI + sparkline card", () => {
    const html = renderHeroPanel({
      kind: "metric-trend",
      kpi: { label: "Ingresos", value: "Bs. 48.2k", delta: "12.4%", trend: "up", context: "vs periodo anterior" },
      points: [{ label: "Ene", value: 32 }, { label: "Feb", value: 38 }],
    });
    expect(html).toContain("wf-dash-hero");
    expect(html).toContain("wf-dash-hero--metric");
    expect(html).toContain("Ingresos");
    expect(html).toContain("Bs. 48.2k");
    expect(html).toContain("wf-sparkline");
  });

  it("renders a queue hero as a prioritized action list", () => {
    const html = renderHeroPanel({
      kind: "queue",
      title: "Para hoy",
      items: [
        { titulo: "Turno 10:00 - Juana P.", estado: "urgente", meta: "En 20 min" },
        { titulo: "Aprobar presupuesto #204", estado: "pendiente", meta: "Vence hoy" },
        { titulo: "Renovar certificado ISO", estado: "al-dia", meta: "Vence en 30 dias" },
      ],
    });
    expect(html).toContain("wf-dash-hero--queue");
    expect(html).toContain("Para hoy");
    expect(html).toContain("Turno 10:00 - Juana P.");
    expect(html).toContain("wf-dash-queue-item--urgente");
  });

  it("escapes HTML in queue item titles", () => {
    const html = renderHeroPanel({
      kind: "queue",
      title: "Para hoy",
      items: [{ titulo: "<script>x</script>", estado: "pendiente", meta: "" }],
    });
    expect(html).not.toContain("<script>x</script>");
  });

  it("returns empty string when there is no heroPanel", () => {
    expect(renderHeroPanel(undefined)).toBe("");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web-factory && pnpm exec vitest run packages/templates/src/dashboard-hero.test.ts`
Expected: FAIL (`Cannot find module './dashboard-hero'`).

- [ ] **Step 3: Implement `dashboard-hero.ts`**

Create `web-factory/packages/templates/src/dashboard-hero.ts`:

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web-factory && pnpm exec vitest run packages/templates/src/dashboard-hero.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Wire `renderHeroPanel` into `renderDashboardBody` and the CSS assembly**

In `web-factory/packages/templates/src/dashboard.ts`:

1. Import: `import { dashboardHeroCss, renderHeroPanel } from "./dashboard-hero";`
2. In `renderDashboardBody`, insert the hero panel right after `renderTopbar` and before `renderKpis`:

```ts
      <div class="wf-dash-main">
        ${renderTopbar(client)}
        ${renderHeroPanel(dash.heroPanel)}
        ${renderKpis(dash.kpis)}
        ${renderCharts(dash.charts)}
        ${renderTable(dash.table)}
      </div>
```

3. Update `renderDashboardCss` to include `dashboardHeroCss`:

```ts
export function renderDashboardCss(client: DashboardClient): string {
  return `${clientTokenCss(client)}

${dashboardBaseCss}

${dashboardChartsCss}

${dashboardCardsCss}

${dashboardHeroCss}`;
}
```

- [ ] **Step 6: Add a generator-level test with `heroPanel` wired through the full pipeline**

Add to `web-factory/generate/generate.test.ts` (after the `--wf-warn` test from Task 4):

```ts
  it("renders a queue heroPanel through the dashboard generator", async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), "onia-web-factory-"));
    await mkdir(path.join(rootDir, "data", "clients"), { recursive: true });

    await writeFile(
      path.join(rootDir, "data", "clients", "panel.json"),
      JSON.stringify({
        nombre: "Panel Demo",
        slug: "panel",
        tagline: "Panel de control demo",
        descripcion: "Dashboard de ejemplo.",
        dashboard: {
          title: "Panel operativo",
          heroPanel: {
            kind: "queue",
            title: "Para hoy",
            items: [{ titulo: "Aprobar presupuesto #204", estado: "urgente", meta: "Vence hoy" }],
          },
        },
      }),
      "utf8",
    );

    const result = await generateSite("panel", { rootDir, template: "dashboard" });
    const html = await readFile(path.join(result.outputDir, "index.html"), "utf8");
    const css = await readFile(path.join(result.outputDir, "site.css"), "utf8");

    expect(html).toContain("wf-dash-hero--queue");
    expect(html).toContain("Aprobar presupuesto #204");
    expect(css).toContain(".wf-dash-hero");
  });
```

- [ ] **Step 7: Run the full unit suite**

Run: `cd web-factory && pnpm test`
Expected: PASS (all suites).

- [ ] **Step 8: Commit**

```bash
git add web-factory/packages/templates/src/dashboard-hero.ts web-factory/packages/templates/src/dashboard-hero.test.ts web-factory/packages/templates/src/dashboard.ts web-factory/generate/generate.test.ts
git commit -m "feat(web-factory): render dashboard heroPanel (metric-trend + queue variants)"
```

---

### Task 7: Rich table cells (status pills) + filter chips

**Files:**
- Modify: `web-factory/packages/templates/src/dashboard-types.ts`
- Modify: `web-factory/packages/templates/src/dashboard-cards.ts`
- Modify: `web-factory/data/schema.ts`
- Test: `web-factory/data/schema.test.ts`, `web-factory/packages/templates/src/dashboard-cards.test.ts`

- [ ] **Step 1: Write the failing schema test**

Add to `web-factory/data/schema.test.ts`:

```ts
describe("clientSchema dashboard table cells and filtros", () => {
  it("accepts plain string cells (backward compatible)", () => {
    const parsed = clientSchema.parse({
      nombre: "Panel", slug: "panel", tagline: "t", descripcion: "d",
      dashboard: { table: { title: "Pedidos", columns: ["Pedido", "Estado"], rows: [["#1", "Pagado"]] } },
    });
    expect(parsed.dashboard.table.rows[0][1]).toBe("Pagado");
  });

  it("accepts rich status cells", () => {
    const parsed = clientSchema.parse({
      nombre: "Panel", slug: "panel", tagline: "t", descripcion: "d",
      dashboard: {
        table: {
          title: "Pedidos",
          columns: ["Pedido", "Estado"],
          rows: [["#1", { value: "Pagado", status: "pos" }]],
          filtros: ["Estado", "Fecha"],
        },
      },
    });
    const cell = parsed.dashboard.table.rows[0][1];
    expect(typeof cell === "object" ? cell.value : cell).toBe("Pagado");
    expect(parsed.dashboard.table.filtros).toEqual(["Estado", "Fecha"]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web-factory && pnpm exec vitest run data/schema.test.ts -t "table cells"`
Expected: FAIL (rich cell object rejected by current `z.array(z.array(z.string()))`, `filtros` stripped silently).

- [ ] **Step 3: Update the Zod schema**

In `web-factory/data/schema.ts`, replace `dashboardTableSchema`:

```ts
const dashboardTableCellSchema = z.union([
  z.string(),
  z.object({ value: z.string(), status: z.enum(["pos", "neg", "warn"]).optional() }),
]);

const dashboardTableSchema = z.object({
  title: z.string().default("Detalle"),
  columns: z.array(z.string().min(1)).default([]),
  rows: z.array(z.array(dashboardTableCellSchema)).default([]),
  filtros: z.array(z.string().min(1)).default([]),
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web-factory && pnpm exec vitest run data/schema.test.ts -t "table cells"`
Expected: PASS (2 tests).

- [ ] **Step 5: Update the TS type**

In `web-factory/packages/templates/src/dashboard-cards.ts`, replace the `DashboardTable` type:

```ts
export type DashboardTableCell = string | { value: string; status?: "pos" | "neg" | "warn" };

export type DashboardTable = {
  title: string;
  columns: string[];
  rows: DashboardTableCell[][];
  filtros?: string[];
};
```

- [ ] **Step 6: Write the failing render test**

Create `web-factory/packages/templates/src/dashboard-cards.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { renderTable } from "./dashboard-cards";

describe("renderTable", () => {
  it("renders plain string cells as before", () => {
    const html = renderTable({ title: "Pedidos", columns: ["Pedido", "Estado"], rows: [["#1", "Pagado"]] });
    expect(html).toContain("#1");
    expect(html).toContain(">Pagado<");
  });

  it("renders a status pill for rich cells, with a glyph (not color alone)", () => {
    const html = renderTable({
      title: "Pedidos",
      columns: ["Pedido", "Estado"],
      rows: [
        ["#1", { value: "Pagado", status: "pos" }],
        ["#2", { value: "Pendiente", status: "warn" }],
        ["#3", { value: "Rechazado", status: "neg" }],
      ],
    });
    expect(html).toContain("wf-dash-pill wf-dash-pill--pos");
    expect(html).toContain("wf-dash-pill wf-dash-pill--warn");
    expect(html).toContain("wf-dash-pill wf-dash-pill--neg");
    // Redundant encoding: each pill has a glyph span, not only a color class.
    expect(html).toContain("wf-dash-pill-glyph");
  });

  it("renders filter chips above the table when filtros is present", () => {
    const html = renderTable({ title: "Pedidos", columns: ["Pedido"], rows: [], filtros: ["Estado", "Fecha"] });
    expect(html).toContain("wf-dash-chip");
    expect(html).toContain("Estado");
    expect(html).toContain("Fecha");
  });
});
```

- [ ] **Step 7: Run test to verify it fails**

Run: `cd web-factory && pnpm exec vitest run packages/templates/src/dashboard-cards.test.ts`
Expected: FAIL (no pill/chip markup yet).

- [ ] **Step 8: Implement in `dashboard-cards.ts`**

Update `renderTable` in `web-factory/packages/templates/src/dashboard-cards.ts`:

```ts
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
            `<tr>${table.columns.map((_, index) => `<td>${row[index] !== undefined ? renderCell(row[index]) : ""}</td>`).join("")}</tr>`,
        )
        .join("")
    : `<tr class="wf-table-empty-row"><td colspan="${table.columns.length}">Sin registros para el periodo seleccionado.</td></tr>`;

  return `
        <section class="wf-dash-card wf-dash-table" aria-label="${escapeAttribute(table.title)}" data-reveal>
          <div class="wf-dash-table-head">
            <h2>${escapeHtml(table.title)}</h2>
          </div>
          ${renderFiltros(table.filtros)}
          <div class="wf-dash-table-scroll">
            <table>
              <thead>${head}</thead>
              <tbody>${body}</tbody>
            </table>
          </div>
        </section>`;
}
```

Add to `dashboardCardsCss` (append at the end of the exported string in the same file):

```css
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
```

- [ ] **Step 9: Run test to verify it passes**

Run: `cd web-factory && pnpm exec vitest run packages/templates/src/dashboard-cards.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 10: Run the full unit suite**

Run: `cd web-factory && pnpm test`
Expected: PASS (all suites — existing dashboard tests use plain string rows, still valid under the new union type).

- [ ] **Step 11: Commit**

```bash
git add web-factory/packages/templates/src/dashboard-types.ts web-factory/packages/templates/src/dashboard-cards.ts web-factory/packages/templates/src/dashboard-cards.test.ts web-factory/data/schema.ts web-factory/data/schema.test.ts
git commit -m "feat(web-factory): rich table cells (status pills) + filter chips for dashboard table"
```

---

### Task 8: Side panel (compact list)

**Files:**
- Modify: `web-factory/packages/templates/src/dashboard-types.ts`
- Modify: `web-factory/packages/templates/src/dashboard-cards.ts`
- Modify: `web-factory/packages/templates/src/dashboard.ts`
- Modify: `web-factory/data/schema.ts`
- Test: `web-factory/data/schema.test.ts`, `web-factory/packages/templates/src/dashboard-cards.test.ts`

- [ ] **Step 1: Write the failing schema test**

Add to `web-factory/data/schema.test.ts`:

```ts
describe("clientSchema dashboard sidePanel", () => {
  it("parses a sidePanel with list items", () => {
    const parsed = clientSchema.parse({
      nombre: "Panel", slug: "panel", tagline: "t", descripcion: "d",
      dashboard: {
        sidePanel: {
          title: "Aprobaciones recientes",
          items: [{ label: "Maria Lopez", value: "Aprobado", initial: "ML" }],
        },
      },
    });
    expect(parsed.dashboard.sidePanel?.items[0].label).toBe("Maria Lopez");
  });

  it("defaults sidePanel to undefined when absent", () => {
    const parsed = clientSchema.parse({ nombre: "Panel", slug: "panel", tagline: "t", descripcion: "d" });
    expect(parsed.dashboard.sidePanel).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web-factory && pnpm exec vitest run data/schema.test.ts -t "sidePanel"`
Expected: FAIL.

- [ ] **Step 3: Add the Zod schema**

In `web-factory/data/schema.ts`, add after `dashboardHeroPanelSchema` (from Task 5):

```ts
const dashboardSidePanelSchema = z.object({
  title: z.string().min(1),
  items: z.array(
    z.object({
      label: z.string().min(1),
      value: z.string().default(""),
      initial: z.string().max(3).optional(),
    }),
  ).default([]),
});
```

Add `sidePanel: dashboardSidePanelSchema.optional(),` to `dashboardSchema`'s object (next to `heroPanel`).

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web-factory && pnpm exec vitest run data/schema.test.ts -t "sidePanel"`
Expected: PASS (2 tests).

- [ ] **Step 5: Add the TS type**

In `web-factory/packages/templates/src/dashboard-types.ts`, append:

```ts
export type DashboardSidePanel = {
  title: string;
  items: Array<{ label: string; value: string; initial?: string }>;
};
```

- [ ] **Step 6: Write the failing render test**

Add to `web-factory/packages/templates/src/dashboard-cards.test.ts`:

```ts
import { renderSidePanel } from "./dashboard-cards";

describe("renderSidePanel", () => {
  it("renders list items with an initial-in-circle, never a fake photo avatar", () => {
    const html = renderSidePanel({
      title: "Aprobaciones recientes",
      items: [{ label: "Maria Lopez", value: "Aprobado", initial: "ML" }],
    });
    expect(html).toContain("wf-dash-side-panel");
    expect(html).toContain("Aprobaciones recientes");
    expect(html).toContain("Maria Lopez");
    expect(html).toContain("wf-dash-side-avatar");
    expect(html).toContain("ML");
    expect(html).not.toContain("<img");
  });

  it("derives an initial from the label when not provided", () => {
    const html = renderSidePanel({ title: "t", items: [{ label: "Carlos Diaz", value: "" }] });
    expect(html).toContain("CD");
  });

  it("returns empty string when there is no sidePanel", () => {
    expect(renderSidePanel(undefined)).toBe("");
  });
});
```

- [ ] **Step 7: Run test to verify it fails**

Run: `cd web-factory && pnpm exec vitest run packages/templates/src/dashboard-cards.test.ts -t "SidePanel"`
Expected: FAIL (`renderSidePanel` not exported).

- [ ] **Step 8: Implement in `dashboard-cards.ts`**

Add to `web-factory/packages/templates/src/dashboard-cards.ts`:

```ts
import type { DashboardSidePanel } from "./dashboard-types";

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
```

Add to `dashboardCardsCss` (append):

```css
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
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 9: Run test to verify it passes**

Run: `cd web-factory && pnpm exec vitest run packages/templates/src/dashboard-cards.test.ts`
Expected: PASS (all cases in the file, including the earlier pill/chip tests from Task 7).

- [ ] **Step 10: Wire `sidePanel` + `heroPanel`/`table` into an asymmetric detail row**

In `web-factory/packages/templates/src/dashboard.ts`, add the `sidePanel?: DashboardSidePanel` field to `DashboardData`, import `renderSidePanel` from `./dashboard-cards`, and update `renderDashboardBody` so the table and side panel sit in one asymmetric row when a side panel exists:

```ts
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
      </div>
```

- [ ] **Step 11: Run the full unit suite**

Run: `cd web-factory && pnpm test`
Expected: PASS.

- [ ] **Step 12: Commit**

```bash
git add web-factory/packages/templates/src/dashboard-types.ts web-factory/packages/templates/src/dashboard-cards.ts web-factory/packages/templates/src/dashboard-cards.test.ts web-factory/packages/templates/src/dashboard.ts web-factory/data/schema.ts web-factory/data/schema.test.ts
git commit -m "feat(web-factory): dashboard side panel (list) + asymmetric detail row with table"
```

---

### Task 9: States showcase (loading / vacio / error, always visible)

**Files:**
- Create: `web-factory/packages/templates/src/dashboard-states.ts`
- Modify: `web-factory/packages/templates/src/dashboard.ts`
- Modify: `web-factory/data/schema.ts`
- Test: `web-factory/packages/templates/src/dashboard-states.test.ts`, `web-factory/data/schema.test.ts`

- [ ] **Step 1: Write the failing schema test**

Add to `web-factory/data/schema.test.ts`:

```ts
describe("clientSchema dashboard showStatesReference", () => {
  it("defaults showStatesReference to false", () => {
    const parsed = clientSchema.parse({ nombre: "Panel", slug: "panel", tagline: "t", descripcion: "d" });
    expect(parsed.dashboard.showStatesReference).toBe(false);
  });

  it("accepts showStatesReference: true", () => {
    const parsed = clientSchema.parse({
      nombre: "Panel", slug: "panel", tagline: "t", descripcion: "d",
      dashboard: { showStatesReference: true },
    });
    expect(parsed.dashboard.showStatesReference).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web-factory && pnpm exec vitest run data/schema.test.ts -t "showStatesReference"`
Expected: FAIL.

- [ ] **Step 3: Add the Zod field**

In `web-factory/data/schema.ts`, add `showStatesReference: z.boolean().default(false),` to `dashboardSchema`'s object (next to `sidePanel`).

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web-factory && pnpm exec vitest run data/schema.test.ts -t "showStatesReference"`
Expected: PASS (2 tests).

- [ ] **Step 5: Write the failing render test**

Create `web-factory/packages/templates/src/dashboard-states.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { renderStatesShowcase } from "./dashboard-states";

describe("renderStatesShowcase", () => {
  it("renders nothing when not enabled", () => {
    expect(renderStatesShowcase(false)).toBe("");
  });

  it("renders all 3 states always-visible (no toggle required) when enabled", () => {
    const html = renderStatesShowcase(true);
    expect(html).toContain('id="estados"');
    expect(html).toContain("wf-dash-card--loading");
    expect(html).toContain("wf-dash-shimmer");
    expect(html).toContain("wf-dash-empty");
    expect(html).toContain("wf-dash-error");
    // Error state uses icon+text, not color alone (redundant encoding).
    expect(html).toContain("wf-dash-error-icon");
    expect(html).toContain("Reintentar");
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `cd web-factory && pnpm exec vitest run packages/templates/src/dashboard-states.test.ts`
Expected: FAIL (`Cannot find module './dashboard-states'`).

- [ ] **Step 7: Implement `dashboard-states.ts`**

Create `web-factory/packages/templates/src/dashboard-states.ts`:

```ts
// Always-visible reference for the 3 interface states (loading/empty/error).
// Real products wire .wf-dash-card--loading / .wf-dash-error to their own
// async state; this section exists so the pattern is inspectable without
// needing to trigger a hidden interaction first.
export function renderStatesShowcase(enabled: boolean): string {
  if (!enabled) {
    return "";
  }

  return `
        <section class="wf-dash-states" id="estados" aria-label="Estados de la interfaz">
          <h2 class="wf-dash-table-head-title">Estados de la interfaz</h2>
          <div class="wf-dash-states-grid">
            <div class="wf-dash-card wf-dash-card--compact wf-dash-card--loading" aria-hidden="true">
              <span class="wf-dash-shimmer wf-dash-shimmer--label"></span>
              <span class="wf-dash-shimmer wf-dash-shimmer--value"></span>
              <span class="wf-dash-shimmer wf-dash-shimmer--foot"></span>
            </div>
            <div class="wf-dash-card wf-dash-empty" role="status">
              <strong>Sin datos</strong>
              <span>Esta seccion se completa cuando llegan los datos.</span>
            </div>
            <div class="wf-dash-card wf-dash-error" role="alert">
              <span class="wf-dash-error-icon" aria-hidden="true">&#9888;</span>
              <strong>No se pudo cargar</strong>
              <span>Revisa tu conexion o intenta de nuevo.</span>
              <button type="button" class="wf-dash-chip" data-dash-retry>Reintentar</button>
            </div>
          </div>
        </section>`;
}

export const dashboardStatesCss = `
.wf-dash-states-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.wf-dash-card--loading {
  gap: 10px;
}

.wf-dash-shimmer {
  display: block;
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--color-fg) 8%, transparent) 25%,
    color-mix(in srgb, var(--color-fg) 14%, transparent) 37%,
    color-mix(in srgb, var(--color-fg) 8%, transparent) 63%
  );
  background-size: 200% 100%;
}

.wf-dash-shimmer--label {
  width: 40%;
  height: 12px;
}

.wf-dash-shimmer--value {
  width: 65%;
  height: 26px;
}

.wf-dash-shimmer--foot {
  width: 50%;
  height: 12px;
}

@media (prefers-reduced-motion: no-preference) {
  .wf-dash-shimmer {
    animation: wfDashShimmer 1.4s ease-in-out infinite;
  }
}

@keyframes wfDashShimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.wf-dash-error {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
  border-color: color-mix(in srgb, var(--wf-neg) 40%, var(--border));
}

.wf-dash-error-icon {
  font-size: 1.3rem;
  color: var(--wf-neg);
}
`;
```

- [ ] **Step 8: Run test to verify it passes**

Run: `cd web-factory && pnpm exec vitest run packages/templates/src/dashboard-states.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 9: Wire into `dashboard.ts`**

Add `showStatesReference: boolean` to `DashboardData` in `web-factory/packages/templates/src/dashboard.ts`. Import `dashboardStatesCss, renderStatesShowcase` from `./dashboard-states`. In `renderDashboardBody`, append the showcase at the end of `.wf-dash-main`:

```ts
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
```

Update `renderDashboardCss` to append `dashboardStatesCss` at the end.

- [ ] **Step 10: Run the full unit suite**

Run: `cd web-factory && pnpm test`
Expected: PASS.

- [ ] **Step 11: Commit**

```bash
git add web-factory/packages/templates/src/dashboard-states.ts web-factory/packages/templates/src/dashboard-states.test.ts web-factory/packages/templates/src/dashboard.ts web-factory/data/schema.ts web-factory/data/schema.test.ts
git commit -m "feat(web-factory): always-visible states showcase (loading/empty/error) for dashboards"
```

---

### Task 10: Grouped navigation (backward-compatible)

**Files:**
- Modify: `web-factory/packages/templates/src/dashboard-types.ts`
- Modify: `web-factory/packages/templates/src/dashboard.ts`
- Modify: `web-factory/data/schema.ts`
- Test: `web-factory/data/schema.test.ts`, `web-factory/generate/generate.test.ts`

- [ ] **Step 1: Write the failing schema test**

Add to `web-factory/data/schema.test.ts`:

```ts
describe("clientSchema dashboard grouped nav", () => {
  it("accepts a flat string nav (backward compatible)", () => {
    const parsed = clientSchema.parse({
      nombre: "Panel", slug: "panel", tagline: "t", descripcion: "d",
      dashboard: { nav: ["Resumen", "Ventas"] },
    });
    expect(parsed.dashboard.nav).toEqual(["Resumen", "Ventas"]);
  });

  it("accepts a grouped nav shape", () => {
    const parsed = clientSchema.parse({
      nombre: "Panel", slug: "panel", tagline: "t", descripcion: "d",
      dashboard: {
        nav: [
          { group: "Hoy", items: ["Resumen"] },
          { group: "Trabajo", items: ["Aprobaciones", "Tareas"] },
        ],
      },
    });
    expect(Array.isArray(parsed.dashboard.nav)).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web-factory && pnpm exec vitest run data/schema.test.ts -t "grouped nav"`
Expected: FAIL (grouped shape rejected by current `z.array(z.string().min(1))`).

- [ ] **Step 3: Update the Zod schema**

In `web-factory/data/schema.ts`, replace the `nav` field inside `dashboardSchema`:

```ts
const dashboardNavGroupSchema = z.object({
  group: z.string().optional(),
  items: z.array(z.string().min(1)).min(1),
});

const dashboardNavSchema = z.union([z.array(z.string().min(1)), z.array(dashboardNavGroupSchema)]);
```

Then change `nav: z.array(z.string().min(1)).default([]),` to `nav: dashboardNavSchema.default([]),` inside `dashboardSchema`'s object.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web-factory && pnpm exec vitest run data/schema.test.ts -t "grouped nav"`
Expected: PASS (2 tests).

- [ ] **Step 5: Update the TS type**

In `web-factory/packages/templates/src/dashboard-types.ts`, append:

```ts
export type DashboardNavGroup = { group?: string; items: string[] };
```

- [ ] **Step 6: Update `DashboardData.nav` and the sidebar renderer**

In `web-factory/packages/templates/src/dashboard.ts`:

1. Change `nav: string[];` to `nav: string[] | DashboardNavGroup[];` in `DashboardData` (import `DashboardNavGroup` from `./dashboard-types`).
2. Update `renderDashboardBody`'s sidebar nav rendering. Replace the current flat-list block:

```ts
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
```

with a version that detects the shape and renders group headers when present:

```ts
        <nav class="wf-dash-nav">
          ${renderNavGroups(nav)}
        </nav>
```

Add the helper function near `renderTopbar`:

```ts
function isGroupedNav(nav: string[] | DashboardNavGroup[]): nav is DashboardNavGroup[] {
  return nav.length > 0 && typeof nav[0] === "object";
}

function renderNavLink(item: string, isFirst: boolean): string {
  return `<a class="wf-dash-nav-link${isFirst ? " is-active" : ""}" href="#top"${
    isFirst ? ' aria-current="page"' : ""
  }>${escapeHtml(item)}</a>`;
}

function renderNavGroups(nav: string[] | DashboardNavGroup[]): string {
  const groups: DashboardNavGroup[] = isGroupedNav(nav) ? nav : [{ items: nav.length ? nav : ["Resumen", "Reportes", "Actividad", "Ajustes"] }];
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
```

Remove the now-unused `const nav = dash.nav.length ? dash.nav : [...]` default line from `renderDashboardBody` (the default is now handled inside `renderNavGroups`), and pass `dash.nav` directly.

- [ ] **Step 7: Add nav-group CSS**

Append to `dashboardBaseCss` (in `dashboard.ts`, near the existing `.wf-dash-nav-link` styles):

```css
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
```

- [ ] **Step 8: Add a generator-level test for grouped nav**

Add to `web-factory/generate/generate.test.ts`:

```ts
  it("renders grouped nav with group headers", async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), "onia-web-factory-"));
    await mkdir(path.join(rootDir, "data", "clients"), { recursive: true });

    await writeFile(
      path.join(rootDir, "data", "clients", "panel.json"),
      JSON.stringify({
        nombre: "Panel Demo",
        slug: "panel",
        tagline: "Panel de control demo",
        descripcion: "Dashboard de ejemplo.",
        dashboard: {
          title: "Panel operativo",
          nav: [
            { group: "Hoy", items: ["Resumen"] },
            { group: "Trabajo", items: ["Aprobaciones", "Tareas"] },
          ],
        },
      }),
      "utf8",
    );

    const result = await generateSite("panel", { rootDir, template: "dashboard" });
    const html = await readFile(path.join(result.outputDir, "index.html"), "utf8");

    expect(html).toContain("wf-dash-nav-group");
    expect(html).toContain("Hoy");
    expect(html).toContain("Trabajo");
    expect(html).toContain("Aprobaciones");
  });
```

- [ ] **Step 9: Run the full unit suite**

Run: `cd web-factory && pnpm test`
Expected: PASS (existing `dashboard-demo`/other dashboard tests use flat `nav: string[]`, still valid — `isGroupedNav` returns `false` for them, preserving current behavior exactly).

- [ ] **Step 10: Commit**

```bash
git add web-factory/packages/templates/src/dashboard-types.ts web-factory/packages/templates/src/dashboard.ts web-factory/data/schema.ts web-factory/data/schema.test.ts web-factory/generate/generate.test.ts
git commit -m "feat(web-factory): grouped sidebar nav for dashboards (backward compatible)"
```

---

### Task 11: Enrich `dashboard-demo.json` as the full reference

**Files:**
- Modify: `web-factory/data/clients/dashboard-demo.json`

- [ ] **Step 1: Replace the `dashboard` field with the full-system version**

In `web-factory/data/clients/dashboard-demo.json`, replace the entire `"dashboard": { ... }` value (currently lines 72-324) with:

```json
  "dashboard": {
    "title": "Panel operativo",
    "subtitle": "Resumen de actividad - datos de ejemplo",
    "nav": [
      { "group": "Hoy", "items": ["Resumen"] },
      { "group": "Trabajo", "items": ["Aprobaciones", "Cuentas"] },
      { "group": "Analisis", "items": ["Reportes"] },
      { "group": "Cuenta", "items": ["Ajustes"] }
    ],
    "filters": ["7 dias", "30 dias", "90 dias"],
    "heroPanel": {
      "kind": "queue",
      "title": "Para hoy",
      "items": [
        { "titulo": "Aprobar presupuesto #204 - Comercial Andina", "estado": "urgente", "meta": "Vence hoy" },
        { "titulo": "Renovar plan de Ferreteria Sur", "estado": "pendiente", "meta": "Vence en 3 dias" },
        { "titulo": "Revisar uso excedido - Distribuidora Lux", "estado": "pendiente", "meta": "Detectado ayer" },
        { "titulo": "Confirmar alta de Clinica Vida", "estado": "al-dia", "meta": "Completado" }
      ]
    },
    "kpis": [
      {
        "label": "Cuentas activas",
        "value": "312",
        "delta": "4.2%",
        "trend": "up",
        "context": "vs periodo anterior"
      },
      {
        "label": "Ingresos recurrentes",
        "value": "Bs. 48.2k",
        "delta": "12.4%",
        "trend": "up",
        "context": "vs periodo anterior"
      },
      {
        "label": "Aprobaciones pendientes",
        "value": "7",
        "delta": "2",
        "trend": "down",
        "context": "menos que ayer"
      },
      {
        "label": "Uptime",
        "value": "99.95%",
        "delta": "0.0%",
        "trend": "flat",
        "context": "ultimos 30 dias"
      }
    ],
    "charts": [
      {
        "title": "Ingresos por mes",
        "unit": "Bs. (miles)",
        "type": "bar",
        "points": [
          { "label": "Ene", "value": 32 },
          { "label": "Feb", "value": 38 },
          { "label": "Mar", "value": 30 },
          { "label": "Abr", "value": 41 },
          { "label": "May", "value": 45 },
          { "label": "Jun", "value": 48 }
        ],
        "series": []
      },
      {
        "title": "Cuentas por plan",
        "unit": "% del total",
        "type": "donut",
        "points": [
          { "label": "Basico", "value": 46 },
          { "label": "Pro", "value": 34 },
          { "label": "Enterprise", "value": 20 }
        ],
        "series": []
      }
    ],
    "table": {
      "title": "Cuentas recientes",
      "columns": ["Cuenta", "Plan", "Monto", "Estado"],
      "filtros": ["Plan", "Estado", "Fecha"],
      "rows": [
        ["Comercial Andina", "Enterprise", "Bs. 1.240", { "value": "Pagado", "status": "pos" }],
        ["Ferreteria Sur", "Pro", "Bs. 860", { "value": "Pendiente", "status": "warn" }],
        ["Distribuidora Lux", "Pro", "Bs. 2.310", { "value": "Pagado", "status": "pos" }],
        ["Clinica Vida", "Basico", "Bs. 540", { "value": "Rechazado", "status": "neg" }]
      ]
    },
    "sidePanel": {
      "title": "Aprobaciones recientes",
      "items": [
        { "label": "Maria Lopez", "value": "Aprobado", "initial": "ML" },
        { "label": "Carlos Diaz", "value": "Aprobado", "initial": "CD" },
        { "label": "Sofia Roman", "value": "Rechazado", "initial": "SR" }
      ]
    },
    "showStatesReference": true
  }
```

- [ ] **Step 2: Regenerate and eyeball the output**

Run: `cd web-factory && pnpm generate dashboard-demo --template dashboard`
Expected: writes `out/dashboard-demo/index.html` + `site.css` with no errors.

- [ ] **Step 3: Run the full unit suite**

Run: `cd web-factory && pnpm test`
Expected: PASS (this is data-only; the existing "creates a static dashboard site" / "empty states" / "chart types" tests use their OWN synthetic fixtures in `generate.test.ts`, not `dashboard-demo.json`, so they are unaffected by this data change).

- [ ] **Step 4: Commit**

```bash
git add web-factory/data/clients/dashboard-demo.json
git commit -m "feat(web-factory): enrich dashboard-demo as the full reference (hero queue, side panel, pills, grouped nav, states)"
```

---

### Task 12: Update `tests/e2e/dashboard.spec.ts` for the new structure

**Files:**
- Modify: `web-factory/tests/e2e/dashboard.spec.ts`

- [ ] **Step 1: Extend the existing shell/KPI/chart/table test and add new assertions**

Replace the full content of `web-factory/tests/e2e/dashboard.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test.describe("dashboard preview (dashboard-demo)", () => {
  test("renders shell, hero panel, KPIs, charts and a data table", async ({ page }) => {
    await page.goto("/dashboard-demo/");

    // App shell + heading.
    await expect(page.locator(".wf-dash-side")).toBeVisible();
    await expect(page.locator("h1")).toContainText("Panel operativo");

    // Grouped nav shows section headers, not a flat list.
    await expect(page.locator(".wf-dash-nav-group").first()).toBeVisible();

    // Hero panel (Tier 1): queue variant for this ops-profile reference.
    await expect(page.locator(".wf-dash-hero--queue")).toBeVisible();
    expect(await page.locator(".wf-dash-queue-row").count()).toBeGreaterThan(0);

    // KPI row with at least one metric and a delta pill.
    const kpis = page.locator(".wf-kpi");
    expect(await kpis.count()).toBeGreaterThan(0);
    await expect(page.locator(".wf-kpi-delta").first()).toBeVisible();

    // Charts render as inline SVG (bar + donut in the reference data).
    await expect(page.locator("svg.wf-chart").first()).toBeVisible();
    expect(await page.locator("svg.wf-chart rect").count()).toBeGreaterThan(0);

    // Data table with filter chips and at least one status pill.
    await expect(page.locator(".wf-dash-table table")).toBeVisible();
    expect(await page.locator(".wf-dash-table tbody tr").count()).toBeGreaterThan(0);
    await expect(page.locator(".wf-dash-chip").first()).toBeVisible();
    await expect(page.locator(".wf-dash-pill").first()).toBeVisible();

    // Side panel sits next to the table in the asymmetric detail row.
    await expect(page.locator(".wf-dash-side-panel")).toBeVisible();
  });

  test("status pills carry a glyph, not color alone", async ({ page }) => {
    await page.goto("/dashboard-demo/");
    const glyph = page.locator(".wf-dash-pill-glyph").first();
    await expect(glyph).toBeVisible();
    const text = await glyph.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test("states showcase is always visible, no interaction required", async ({ page }) => {
    await page.goto("/dashboard-demo/");
    const states = page.locator("#estados");
    await expect(states).toBeVisible();
    await expect(states.locator(".wf-dash-card--loading")).toBeVisible();
    await expect(states.locator(".wf-dash-empty")).toBeVisible();
    await expect(states.locator(".wf-dash-error")).toBeVisible();
  });

  test("time-range filter toggles active state", async ({ page }) => {
    await page.goto("/dashboard-demo/");

    const filters = page.locator("[data-dash-filter]");
    const count = await filters.count();
    test.skip(count < 2, "demo has no multi-option filter");

    const second = filters.nth(1);
    await second.click();
    await expect(second).toHaveClass(/is-active/);
    await expect(second).toHaveAttribute("aria-pressed", "true");
    await expect(filters.first()).toHaveAttribute("aria-pressed", "false");
  });

  test("no broken same-origin assets", async ({ page }) => {
    const failed: string[] = [];
    page.on("requestfailed", (request) => {
      const kind = request.resourceType();
      if (kind === "image" || kind === "stylesheet") {
        failed.push(`${kind} ${request.url()}`);
      }
    });

    const response = await page.goto("/dashboard-demo/");
    expect(response?.ok()).toBeTruthy();
    await page.waitForLoadState("networkidle");
    expect(failed, `broken assets: ${failed.join(", ")}`).toEqual([]);
  });
});
```

- [ ] **Step 2: Commit (test changes only, will run in the next task)**

```bash
git add web-factory/tests/e2e/dashboard.spec.ts
git commit -m "test(web-factory): cover dashboard hero panel, pills, side panel, grouped nav, states"
```

---

### Task 13: Write the portable dashboard design system doc

**Files:**
- Create: `web-factory/WEB_FACTORY_DASHBOARD_SYSTEM.md`

This is the actual portability deliverable the spec asks for ("un sistema de
diseño portable... que DentalGest/GestiOS/ONIA Center puedan adoptar en su
propio stack"). Tasks 2-12 built the code and the reference; this doc is what
those teams read to port the PATTERN into their own React codebases (they
will not import this Web Factory package directly).

- [ ] **Step 1: Write the doc**

Create `web-factory/WEB_FACTORY_DASHBOARD_SYSTEM.md`:

```markdown
# Web Factory — Dashboard Design System

Sistema de diseño para paneles de datos densos (ERPs/SaaS internos), pensado
para que DentalGest, GestiOS y ONIA Center lo porten a su propio stack — no es
código compartido entre repos, es el estándar + una implementación de
referencia real dentro de Web Factory (`dashboard-demo`,
`packages/templates/src/dashboard*.ts`).

**Validación pendiente**: este sistema es un modelo B2B razonado y grounded en
producto real (Asana Insights, Hotjar, shadcn dashboard-01, launch-ui, Tremor,
un dashboard fintech — vía capturas Mobbin/licencia de referencia en
`design-stack`), pero no fue validado contra las pantallas reales de
DentalGest, GestiOS ni ONIA Center (no hay acceso a esos repos desde este
carril). Antes de adoptarlo como estándar obligatorio, alguien de esos equipos
debería confirmarlo contra 2-3 pantallas reales de su producto.

## Modelo de jerarquía (3 niveles)

1. **Hero (`heroPanel`)** — el elemento de mayor peso visual. Dos variantes,
   elegidas por dato, no por código separado:
   - `metric-trend`: un KPI headline + su propia mini-tendencia (sparkline)
     fusionados en una card. Perfil growth/analytics — "estado de un
     vistazo" (ingresos, ocupación, uptime).
   - `queue`: lista priorizada de acciones (título + estado + urgencia/
     vencimiento + acción rápida). Perfil ops/ERP — "qué tengo que atender
     hoy" (turnos, aprobaciones, stock bajo). **Es la variante que
     probablemente sirve a DentalGest/GestiOS** (ver validación pendiente).
2. **KPIs de apoyo** — 3-5 métricas secundarias, tipografía/peso menor que el
   hero, no compiten visualmente con él.
3. **Detalle** — charts secundarios + fila asimétrica: tabla (con filtros
   tipo chip y celdas de estado) + panel lateral compacto tipo lista, en vez
   de grid uniforme.

## Primitivo de card

Una sola clase base con modificadores, no 3 estilos casi-duplicados:

```css
.wf-dash-card {
  padding: 18px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--card);
}
.wf-dash-card--compact { padding: 16px 18px; } /* KPIs de apoyo */
/* el hero (.wf-dash-hero) y los estados usan la base + su propia clase de contenido */
```

Todo (KPI, chart-card, tabla, hero, estados) compone sobre `.wf-dash-card` en
vez de declarar border/radius/background por separado.

## Reglas de data-viz

- **Selección de tipo**: línea/área para tendencia (1-3 series); barra para
  comparación categórica; donut solo con ≤4-5 segmentos; sparkline para el
  mini-chart del hero `metric-trend`. **Nunca eje dual** (dos escalas Y en un
  chart) — confunde la correlación entre series.
- **Redundancia de color** (accesibilidad, daltonismo): ninguna señal de
  estado depende solo del color. Trends de KPI usan ▲/▼/• además del color
  (`trendGlyph`); status pills de tabla usan ✓/✕/! además del color; los
  ítems de la cola (`heroPanel: queue`) usan el mismo criterio.
- **Leyendas**: paleta token-driven (`SERIES_COLORS`), verificar separación
  de luminancia suficiente entre series (proxy simple de daltonismo).
- **Ejes**: siempre con unidad visible; en mobile reducir ticks del eje X en
  vez de rotar/truncar etiquetas.

## Estados: loading / vacío / error

Los 3 estados se muestran **siempre visibles** en la referencia (sección
`#estados`, activable con `dashboard.showStatesReference: true`) — nunca
escondidos detrás de un toggle que nadie va a descubrir. Los productos reales
cablean `.wf-dash-card--loading` / `.wf-dash-error` a su propio estado async;
acá el patrón es inspeccionable con solo mirar el HTML/CSS.

## Navegación agrupada

`nav` acepta `string[]` (plano, comportamiento actual sin cambios) o
`Array<{ group?: string; items: string[] }>` (grupos con caption). Agrupar por
lo que el usuario **decide** (ej. "Hoy" / "Trabajo" / "Análisis" / "Cuenta"),
no por jerarquía técnica interna del producto.

## Responsive

- Sidebar colapsa a fila con scroll horizontal en `≤860px`.
- KPI row de apoyo pasa a scroll-snap horizontal en mobile (no columna
  apilada, que alejaría el hero del fold).
- Tabla y hero-chart ya tienen wrappers de scroll/reflow; verificar legibilidad
  a 375px sin overflow horizontal accidental del documento.

## Referencia viva

`pnpm generate dashboard-demo --template dashboard` — código en
`packages/templates/src/dashboard*.ts` (5 archivos: orquestación, charts,
cards, hero, states). Datos de ejemplo en `data/clients/dashboard-demo.json`
(escenario neutro: consola de operaciones genérica).
```

- [ ] **Step 2: Commit**

```bash
git add web-factory/WEB_FACTORY_DASHBOARD_SYSTEM.md
git commit -m "docs(web-factory): portable dashboard design system doc (tokens, hierarchy, states, nav)"
```

---

### Task 14: Full gate run, visual verification, fix regressions

- [ ] **Step 1: Run the full unit suite**

Run: `cd web-factory && pnpm test`
Expected: all green (this now includes every test added in Tasks 4-12).

- [ ] **Step 2: Run the dashboard + a11y + perf e2e tests**

Run: `cd web-factory && pnpm exec playwright test --grep "dashboard-demo"`
Expected: PASS. If `a11y.spec.ts` fails on contrast for `.wf-dash-pill--warn`, `.wf-dash-queue-item--*`, or the states showcase, check the failing selector's computed color/background against its surface in both light and dark, and darken/lighten the offending token (`--wf-warn` light `#92400e` / dark `#fbbf24` should already pass at 14% background tint per the existing `--wf-pos`/`--wf-neg` pattern, but verify, don't assume). If `perf.spec.ts` fails the 60kb budget for `dashboard-demo` (the new hero/pills/side-panel/states CSS adds real weight), measure the actual `site.css` + `index.html` size and raise `maxBytesKb` in `web-factory/tests/e2e/perf.spec.ts` for that one entry to the measured value rounded up to the nearest 10kb, same approach used for `landing-clinic` earlier in this project — do not silently increase it without measuring first.

- [ ] **Step 3: Visual verification (light/dark/mobile)**

Serve `web-factory/out/` (e.g. `node web-factory/scripts/serve-out.mjs 4331` if not already running) and capture `/dashboard-demo/` with Playwright at 1280x800 (light and dark) and 390x844 (mobile), scrolling to cover the hero panel, KPI row, charts, table+side-panel row, and the `#estados` section. Confirm:
- Hero queue items show 3 visually distinct status colors/glyphs.
- Table status pills are legible in both themes.
- Nav group headers are visible and distinct from links.
- States showcase shows all 3 states without needing any click.
- No horizontal overflow at 390px width.

- [ ] **Step 4: Run `factory:smoke`**

Run: `cd web-factory && pnpm factory:smoke`
Expected: unit tests pass + every demo (including `dashboard-demo`) generates without error. No change needed to the `factory:smoke` script itself (same slug as before).

- [ ] **Step 5: Final commit for any gate-driven fixes**

```bash
git add -A web-factory
git commit -m "fix(web-factory): dashboard system gate fixes (contrast/perf budget as measured)"
```

(Skip this commit if Steps 1-4 required no changes.)

---

## Self-Review

**Spec coverage:** Landing standard doc (Task 1). Card primitive + refactor (Tasks 2-4). Hero panel both variants, grounded in real Mobbin references per the corrected spec (Tasks 5-6). Data-viz rules (chart type selection, redundant color encoding via glyphs) applied concretely to KPI deltas (pre-existing `trendGlyph`), queue status, and table pills (Tasks 6-7), and written up as portable guidance in Task 13. Status pills + filter chips (Task 7). Side panel with initials, never fake photos (Task 8). States always visible, not behind a toggle (Task 9). Grouped nav, backward compatible (Task 10). Reference data enrichment with neutral ops scenario, `queue` hero (Task 11). e2e coverage (Task 12). **Portable design-system doc for DentalGest/GestiOS/ONIA Center adoption** (Task 13) — this was missing from the first draft of this plan (code-only); added after self-review since it's the actual deliverable the spec's restricción-de-alcance section describes, not an optional extra. Gates + honest perf/contrast verification (Task 14). The spec's "Validación pendiente" caveat is carried into Task 13's doc verbatim (adapted), so it travels with the artifact that outside teams will actually read.

**Placeholder scan:** every step ships complete, real code (full function bodies, full CSS blocks, full JSON, full markdown). Commands are exact. No "add appropriate handling" language anywhere.

**Type consistency:** `DashboardHeroPanel` (Task 5) used identically in `dashboard-hero.ts` (Task 6) and `dashboard.ts`. `DashboardTableCell` (Task 7) used in `dashboard-cards.ts`'s `renderTable`/`renderCell` and matches the Zod union. `DashboardSidePanel` (Task 8) matches between schema and `dashboard-cards.ts`. `DashboardNavGroup` (Task 10) matches between schema and `dashboard.ts`'s `renderNavGroups`. All new `DashboardData` fields (`heroPanel`, `sidePanel`, `showStatesReference`, updated `nav`, updated `table`) are added to the same type across Tasks 5/8/9/10 without renaming collisions. `--wf-warn` (Task 4) is referenced consistently in Tasks 7 (pills), 8 (n/a), and the queue item styles in Task 6.
