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
