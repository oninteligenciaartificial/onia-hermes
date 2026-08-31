import { clientTokenCss } from "@onia/tokens";
import { renderFontLinks } from "./font-links";

export type DashboardKpi = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "flat";
  context: string;
  /** "accent": hero KPI cell as a solid dark accent card (pattern bank: Fireart 25241984). */
  variant?: "default" | "accent";
  /** Integrated sparkline drawn inside the card, under the figure (pattern bank: Stakent 23902428). */
  spark?: number[];
};

/** `pending: true` renders the point as a diagonal-hatch outline bar (pattern bank: Fireart 25241984). */
export type DashboardPoint = { label: string; value: number; pending?: boolean };

export type DashboardListStatus = {
  label: string;
  tone: "pos" | "neg" | "accent" | "muted";
};

export type DashboardListRow = {
  title: string;
  meta: string;
  /** 0-100; renders a thin progress bar under the row text. */
  percent?: number;
  status?: DashboardListStatus;
};

/** Rows with right-aligned status chips (pattern bank: Fireart 25241984, OnPoint 25540988). */
export type DashboardProgressList = {
  title: string;
  rows: DashboardListRow[];
};

export type DashboardSeries = { name: string; points: DashboardPoint[] };

export type DashboardChart = {
  title: string;
  unit: string;
  type: "bar" | "line" | "donut" | "sparkline";
  points: DashboardPoint[];
  series?: DashboardSeries[];
};

export type DashboardTable = {
  title: string;
  columns: string[];
  rows: string[][];
};

/**
 * Familia mono de los datos. Nuestro propio banco de patrones lo pide para
 * SaaS/producto ("datos Spline Sans Mono con tabular-nums") y ademas resuelve un
 * defecto real: con UNA sola familia para todo, las cifras y las etiquetas pesan
 * igual y el panel se lee plano. El mono separa el dato del texto sin gritar.
 */
const DASHBOARD_MONO = "Spline Sans Mono";

/** Una propuesta del agente: SIEMPRE con la evidencia que la justifica al lado. */
export type DashboardAgentAction = {
  titulo: string;
  detalle: string;
  evidencia: string;
  impacto: string;
  urgencia: "alta" | "media" | "baja";
  canal: string;
};

export type DashboardAgent = {
  titulo: string;
  resumen: string;
  acciones: DashboardAgentAction[];
};

export type DashboardNote = { texto: string; meta: string; ancla: string };
export type DashboardNotes = { titulo: string; items: DashboardNote[] };

export type DashboardData = {
  title: string;
  subtitle: string;
  nav: string[];
  filters: string[];
  kpis: DashboardKpi[];
  charts: DashboardChart[];
  table: DashboardTable;
  lists?: DashboardProgressList[];
  agente?: DashboardAgent;
  notas?: DashboardNotes;
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
        ${renderAgentAndNotes(dash.agente, dash.notas)}
        ${renderCharts(dash.charts)}
        ${renderLists(dash.lists ?? [])}
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
            <button type="button" class="wf-dash-theme" data-theme-toggle aria-label="Cambiar entre tema claro y oscuro">
              <span aria-hidden="true">◐</span> Tema
            </button>
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
          <article class="wf-kpi${kpi.variant === "accent" ? " wf-kpi--accent" : ""}" data-reveal>
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
            ${kpi.spark && kpi.spark.length ? renderKpiSpark(kpi.spark, kpi.label) : ""}
          </article>`,
    )
    .join("");

  return `
        <section class="wf-dash-kpis" aria-label="Indicadores clave">
          ${cards}
        </section>`;
}

/**
 * Banda "que hago ahora": propuestas del agente + notas, lado a lado.
 *
 * Va ARRIBA de los graficos a proposito. Los KPI dicen que paso y los graficos
 * como viene; esta banda es la unica parte del panel que dice QUE HACER, y es lo
 * que el duenio mira cuando abre a la manana. Enterrarla abajo la vuelve adorno.
 */
function renderAgentAndNotes(agent?: DashboardAgent, notes?: DashboardNotes): string {
  if (!agent && !notes) return "";
  return `
        <section class="wf-dash-act" aria-label="Acciones sugeridas y notas">
          ${agent ? renderAgent(agent) : ""}
          ${notes ? renderNotes(notes) : ""}
        </section>`;
}

function renderAgent(agent: DashboardAgent): string {
  if (!agent.acciones.length) {
    return `<article class="wf-agent">
            <div class="wf-agent-head">
              <h2>${escapeHtml(agent.titulo)}</h2>
            </div>
            ${renderEmpty("Nada que aprobar", "Cuando el asistente encuentre algo que valga la pena, aparece aca.")}
          </article>`;
  }

  const acciones = agent.acciones
    .map(
      (accion) => `
              <li class="wf-agent-item wf-agent-item--${accion.urgencia}">
                <div class="wf-agent-item-main">
                  <p class="wf-agent-item-title">${escapeHtml(accion.titulo)}</p>
                  ${accion.detalle ? `<p class="wf-agent-item-detail">${escapeHtml(accion.detalle)}</p>` : ""}
                  ${
                    accion.evidencia
                      ? `<p class="wf-agent-item-why"><span class="wf-agent-why-label">Porque</span> ${escapeHtml(
                          accion.evidencia,
                        )}</p>`
                      : ""
                  }
                </div>
                <div class="wf-agent-item-side">
                  ${accion.impacto ? `<span class="wf-agent-impact">${escapeHtml(accion.impacto)}</span>` : ""}
                  ${accion.canal ? `<span class="wf-agent-channel">${escapeHtml(accion.canal)}</span>` : ""}
                  <div class="wf-agent-actions">
                    <button type="button" class="wf-agent-ok">Aprobar</button>
                    <button type="button" class="wf-agent-no">Descartar</button>
                  </div>
                </div>
              </li>`,
    )
    .join("");

  return `
          <article class="wf-agent" data-reveal>
            <div class="wf-agent-head">
              <h2>${escapeHtml(agent.titulo)}</h2>
              ${agent.resumen ? `<p class="wf-agent-sub">${escapeHtml(agent.resumen)}</p>` : ""}
            </div>
            <ul class="wf-agent-list">${acciones}</ul>
          </article>`;
}

function renderNotes(notes: DashboardNotes): string {
  const items = notes.items.length
    ? notes.items
        .map(
          (nota) => `
              <li class="wf-note">
                ${nota.ancla ? `<span class="wf-note-ancla">${escapeHtml(nota.ancla)}</span>` : ""}
                <p class="wf-note-text">${escapeHtml(nota.texto)}</p>
                ${nota.meta ? `<span class="wf-note-meta">${escapeHtml(nota.meta)}</span>` : ""}
              </li>`,
        )
        .join("")
    : "";

  return `
          <article class="wf-notes" data-reveal>
            <div class="wf-notes-head">
              <h2>${escapeHtml(notes.titulo)}</h2>
            </div>
            ${
              items
                ? `<ul class="wf-notes-list">${items}</ul>`
                : renderEmpty("Sin notas", "Lo que anotes queda a la vista del equipo.")
            }
          </article>`;
}

function renderCharts(charts: DashboardChart[]): string {
  if (!charts.length) {
    return "";
  }

  const cards = charts
    .map(
      (chart) => `
          <article class="wf-chart-card wf-chart-card--${chart.type}" data-reveal>
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

function renderLists(lists: DashboardProgressList[]): string {
  if (!lists.length) {
    return "";
  }

  const cards = lists
    .map((list) => {
      const rows = list.rows
        .map((row) => {
          const percent =
            typeof row.percent === "number"
              ? `<div class="wf-list-bar" role="img" aria-label="${escapeAttribute(
                  `${row.title}: ${Math.round(row.percent)}%`,
                )}"><span style="width:${Math.min(Math.max(row.percent, 0), 100).toFixed(0)}%"></span></div>`
              : "";
          const status = row.status
            ? `<span class="wf-list-status wf-list-status--${row.status.tone}">${escapeHtml(row.status.label)}</span>`
            : "";
          return `
            <li class="wf-list-row">
              <div class="wf-list-main">
                <strong>${escapeHtml(row.title)}</strong>
                <span class="wf-list-meta">${escapeHtml(row.meta)}</span>
                ${percent}
              </div>
              ${status}
            </li>`;
        })
        .join("");
      return `
          <article class="wf-list-card" data-reveal>
            <div class="wf-dash-table-head"><h2>${escapeHtml(list.title)}</h2></div>
            <ul class="wf-list">${rows}</ul>
          </article>`;
    })
    .join("");

  return `
        <section class="wf-dash-lists" aria-label="Listas de seguimiento">
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

// Escalera de topes "redondos". La vieja saltaba 1 > 2 > 5 > 10 y con eso un maximo
// de 340 se iba a un eje de 500: el 32% del plot quedaba muerto y la serie se veia
// aplastada contra el piso. Con estos peldanos 340 cae en 350 (2,9% de aire) y las
// mitades siguen siendo cifras leibles (350/2 = 175), que es lo que la grilla dibuja.
const NICE_FRACTIONS = [1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7.5, 8, 10];

function niceMax(value: number): number {
  if (value <= 0) {
    return 1;
  }
  const base = Math.pow(10, Math.floor(Math.log10(value)));
  const fraction = value / base;
  return (NICE_FRACTIONS.find((candidate) => fraction <= candidate) ?? 10) * base;
}

function formatTick(value: number): string {
  const magnitude = Math.abs(value);
  if (magnitude >= 1000) {
    return `${(value / 1000).toFixed(magnitude % 1000 === 0 ? 0 : 1)}k`;
  }
  return `${Math.round(value)}`;
}

/** Escala vertical de un chart, con su linea de cero. */
export interface ChartScale {
  min: number;
  max: number;
  zeroY: number;
  yFor: (value: number) => number;
}

// El dominio se calcula con los valores REALES, negativos incluidos. Antes cada
// lectura pasaba por `Math.max(value, 0)`: un reembolso o un churn se dibujaba con
// altura cero mientras el `<title>` seguia diciendo el numero de verdad, o sea el
// grafico MENTIA y el tooltip lo desmentia. Ahora el cero es una linea interna y
// lo negativo cuelga debajo.
export function chartScale(values: number[]): ChartScale {
  const rawMax = Math.max(...values, 0);
  const rawMin = Math.min(...values, 0);
  const max = rawMax > 0 ? niceMax(rawMax) : 0;
  const min = rawMin < 0 ? -niceMax(-rawMin) : 0;
  const span = max - min || 1;
  const top = span === 1 && max === 0 ? 1 : max;
  const yFor = (value: number): number => PAD_T + PLOT_H - ((value - min) / (top - min)) * PLOT_H;
  return { min, max: top, zeroY: yFor(0), yFor };
}

function renderGrid(scale: ChartScale): string {
  // Con dominio negativo los peldanos son min / 0 / max, y el cero se lleva la linea
  // solida: es la referencia que dice de que lado cae cada barra.
  const ticks = Array.from(
    new Set(scale.min < 0 ? [scale.min, 0, scale.max] : [0, scale.max / 2, scale.max]),
  );
  return ticks
    .map((tick) => {
      const y = scale.yFor(tick);
      const dash = tick === 0 ? "" : ' stroke-dasharray="2 3"';
      return (
        `<line x1="${PAD_L}" y1="${y.toFixed(1)}" x2="${CHART_W - PAD_R}" y2="${y.toFixed(
          1,
        )}" stroke="var(--border)" stroke-width="1"${dash}></line>` +
        `<text x="${PAD_L - 6}" y="${(y + 3).toFixed(1)}" text-anchor="end" class="wf-chart-axis">${formatTick(
          tick,
        )}</text>`
      );
    })
    .join("");
}

// Tema categórico FIJO para series/donut: la tinta de dato NO sale de la marca.
// Con primary=accent (Onia todo verde) las series salían indistinguibles.
//
// Los 6 hues NO se eligen a ojo: el orden salió de enumerar las 720 permutaciones
// y validar cada una con el validador de la skill `dataviz` contra los surfaces
// REALES de este template (cream #f6f2ea / oscuro #161c22), en AMBOS modos.
// Ganador `aqua > blue > orange > violet > yellow > magenta`: peor ΔE adyacente
// 13.2 (el piso del gate es 8). La tanda anterior, elegida a criterio, FALLABA:
// el verde de marca daba chroma 0.097 (leía gris) y terracota↔oliva daban ΔE 4.9
// en deutan — el mismo color para quien tiene daltonismo verde.
//
// Se emiten como custom properties, no como hex incrustados en el SVG, porque el
// dark mode necesita SUS PROPIOS steps (no un flip): un hex quemado en el atributo
// del path no puede cambiar con el tema. Los pares light/dark salen de la paleta
// de referencia de `dataviz`, ya validada como conjunto — cero hex inventados.
const SERIES_COUNT = 6;
const SERIES_COLORS = Array.from({ length: SERIES_COUNT }, (_, index) => `var(--wf-series-${index + 1})`);

/** Pares light/dark del tema categórico. Índice = slot de serie. */
const SERIES_THEME: ReadonlyArray<{ light: string; dark: string; hue: string }> = [
  { hue: "aqua", light: "#1baf7a", dark: "#199e70" },
  { hue: "blue", light: "#2a78d6", dark: "#3987e5" },
  { hue: "orange", light: "#eb6834", dark: "#d95926" },
  { hue: "violet", light: "#4a3aa7", dark: "#9085e9" },
  { hue: "yellow", light: "#eda100", dark: "#c98500" },
  { hue: "magenta", light: "#e87ba4", dark: "#d55181" },
];

function seriesVars(mode: "light" | "dark"): string {
  return SERIES_THEME.map((slot, index) => `  --wf-series-${index + 1}: ${slot[mode]}; /* ${slot.hue} */`).join("\n");
}

function hasChartData(chart: DashboardChart): boolean {
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
  const scale = chartScale(points.map((point) => point.value));
  const count = points.length;
  // El ancho sale de repartir el plot en ranuras y el gap se recorta si no cabe.
  // Antes era al reves: gap fijo y barra con piso de 2px, asi que a partir de ~58
  // puntos el ancho pedido excedia el plot y las ultimas barras se dibujaban FUERA
  // del viewBox — la serie se recortaba sin que nada lo dijera.
  const slot = count ? PLOT_W / count : PLOT_W;
  const gap = Math.min(count > 12 ? 3 : 8, slot * 0.35);
  const barWidth = Math.max(1, slot - gap);

  const hasPending = points.some((point) => point.pending);
  // Diagonal-hatch fill for pending/future bars (pattern bank: Fireart 25241984).
  // Identical defs may repeat across inline charts; the shared id resolves to the same drawing.
  const hatchDefs = hasPending
    ? `<defs><pattern id="wf-hatch" width="5" height="5" patternTransform="rotate(45)" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="0" y2="5" stroke="var(--wf-series-1)" stroke-width="1.6" opacity="0.55"></line></pattern></defs>`
    : "";

  const bars = points
    .map((point, index) => {
      const valueY = scale.yFor(point.value);
      const height = Math.abs(valueY - scale.zeroY);
      const x = PAD_L + index * slot + gap / 2;
      const y = Math.min(valueY, scale.zeroY);
      const paint = point.pending
        ? `fill="url(#wf-hatch)" stroke="var(--wf-series-1)" stroke-opacity="0.45" stroke-width="1"`
        : `fill="var(--wf-series-1)"`;
      const pendingNote = point.pending ? " (pendiente)" : "";
      return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${height.toFixed(
        1,
      )}" rx="${Math.min(3, barWidth / 2, height / 2).toFixed(1)}" ${paint}><title>${escapeHtml(point.label)}: ${point.value}${pendingNote}</title></rect>`;
    })
    .join("");

  const labels = renderChartLabels(points, (index) => PAD_L + index * slot + slot / 2);

  return chartSvg(`${hatchDefs}${renderGrid(scale)}${bars}${labels}`, chartLabel(chart));
}

function renderLineChart(chart: DashboardChart): string {
  const series =
    chart.series && chart.series.length ? chart.series : [{ name: chart.title, points: chart.points }];
  const scale = chartScale(series.flatMap((entry) => entry.points.map((point) => point.value)));
  const multi = series.length > 1;

  const xFor = (index: number, count: number): number =>
    PAD_L + (count <= 1 ? PLOT_W / 2 : (index / (count - 1)) * PLOT_W);
  const yFor = scale.yFor;

  const lines = series
    .map((entry, seriesIndex) => {
      const color = SERIES_COLORS[seriesIndex % SERIES_COLORS.length];
      const count = entry.points.length;
      const line = entry.points
        .map((point, index) => `${xFor(index, count).toFixed(1)},${yFor(point.value).toFixed(1)}`)
        .join(" ");
      const area = multi
        ? ""
        : `<polygon points="${xFor(0, count).toFixed(1)},${scale.zeroY.toFixed(1)} ${line} ${xFor(
            count - 1,
            count,
          ).toFixed(1)},${scale.zeroY.toFixed(1)}" fill="${color}" fill-opacity="0.12"></polygon>`;
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

  const svg = chartSvg(`${renderGrid(scale)}${lines}${labels}`, chartLabel(chart));
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

function renderSparkline(chart: DashboardChart): string {
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
    ? `<circle cx="${xFor(count - 1).toFixed(1)}" cy="${yFor(last.value).toFixed(1)}" r="3" fill="var(--wf-series-1)"></circle>`
    : "";

  // `preserveAspectRatio="none"` estiraba el viewBox al ancho de la tarjeta y con
  // el estiron se deformaba TODO lo dibujado: el trazo perdia grosor uniforme y el
  // punto final dejaba de ser un circulo para volverse una elipse. `meet` mantiene
  // la proporcion; la CSS de .wf-sparkline ya fija el aspect-ratio, asi que el
  // ancho se sigue llenando igual.
  return `<svg class="wf-chart wf-sparkline" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeAttribute(
    chartLabel(chart),
  )}" preserveAspectRatio="xMidYMid meet"><polygon points="${area}" fill="var(--wf-series-1)" fill-opacity="0.12"></polygon><polyline points="${line}" fill="none" stroke="var(--wf-series-1)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></polyline>${dot}</svg>`;
}

/** Sparkline drawn inside a KPI card, under the figure (pattern bank: Stakent 23902428).
 *  Uses currentColor so it inherits the card's ink (accent variant included). */
function renderKpiSpark(values: number[], label: string): string {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const width = 320;
  const height = 44;
  const pad = 4;
  const count = values.length;

  const xFor = (index: number): number =>
    pad + (count <= 1 ? (width - 2 * pad) / 2 : (index / (count - 1)) * (width - 2 * pad));
  const yFor = (value: number): number =>
    height - pad - ((value - min) / range) * (height - 2 * pad);

  const line = values.map((v, index) => `${xFor(index).toFixed(1)},${yFor(v).toFixed(1)}`).join(" ");
  const area = `${xFor(0).toFixed(1)},${height - pad} ${line} ${xFor(count - 1).toFixed(1)},${height - pad}`;
  const last = count ? values[count - 1] : undefined;
  const dot = last !== undefined
    ? `<circle cx="${xFor(count - 1).toFixed(1)}" cy="${yFor(last).toFixed(1)}" r="3" fill="currentColor"></circle>`
    : "";

  return `<svg class="wf-kpi-spark" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeAttribute(
    `Tendencia: ${label}`,
  )}" preserveAspectRatio="none"><polygon points="${area}" fill="currentColor" fill-opacity="0.14"></polygon><polyline points="${line}" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></polyline>${dot}</svg>`;
}

function renderChartLabels(
  points: Array<{ label: string; value: number }>,
  xFor: (index: number) => number,
): string {
  const step = points.length > 8 ? Math.ceil(points.length / 6) : 1;
  // Se cuenta DESDE EL FINAL. Con `index % step` el ultimo punto quedaba sin rotulo
  // salvo casualidad, y el eje mentia sobre donde termina la serie.
  const lastIndex = points.length - 1;
  return points
    .map((point, index) =>
      (lastIndex - index) % step === 0
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
    ${renderFontLinks(client.tipografia, [DASHBOARD_MONO])}
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
  --wf-font-mono: "${DASHBOARD_MONO}", ui-monospace, "SFMono-Regular", "Menlo", monospace;
${seriesVars("light")}
}

/* Dark mode: the dark green/red status text fails contrast on the dark tinted
   pill, so lift them to brighter tones that read on a dark surface. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) body {
    --wf-pos: #4ade80;
    --wf-neg: #f87171;
${seriesVars("dark")}
  }
}

[data-theme="dark"] body {
  --wf-pos: #4ade80;
  --wf-neg: #f87171;
${seriesVars("dark")}
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
  overflow: hidden;
}

/* Hero KPI cell: one solid accent card among quiet siblings
   (pattern bank: Fireart 25241984). Use on ONE kpi per row. */
.wf-kpi--accent {
  border-color: transparent;
  background: color-mix(in srgb, var(--color-primary) 86%, var(--color-fg) 14%);
  color: var(--color-on-primary);
}

.wf-kpi--accent .wf-kpi-label,
.wf-kpi--accent .wf-kpi-context {
  color: color-mix(in srgb, var(--color-on-primary) 78%, transparent);
}

.wf-kpi--accent .wf-kpi-delta {
  color: var(--color-on-primary);
  background: color-mix(in srgb, var(--color-on-primary) 16%, transparent);
}

/* Sparkline as card anatomy: bleeds to the card edges, under the figure
   (pattern bank: Stakent 23902428). */
.wf-kpi-spark {
  display: block;
  width: calc(100% + 36px);
  height: 44px;
  margin: 4px -18px -16px;
  /* El sparkline del KPI es DATO, asi que su tinta sale del tema categorico y no
     de la marca: con --color-primary quedaban barras aqua y sparklines verde
     marca en la misma pantalla, dos colores para lo mismo. En la celda hero
     sigue heredando la tinta de la card, que ahi es lo unico legible. */
  color: var(--wf-series-1);
}

.wf-kpi--accent .wf-kpi-spark {
  color: var(--color-on-primary);
}

.wf-kpi-label {
  color: var(--muted-foreground);
  font-size: 0.82rem;
  font-weight: 650;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

/* Cifras de ancho fijo: sin esto los digitos cambian de ancho al actualizarse y
   el numero "baila" en el lugar; en la tabla, ademas, las columnas no alinean.
   7 de 8 dashboards del corpus lo hacen (2026-08-30-como-se-hace-un-dashboard).
   Y van en la familia MONO: con una sola familia para todo, cifra y etiqueta
   pesan igual y el panel se lee plano. El mono separa el dato del texto. */
.wf-kpi-value,
.wf-kpi-delta,
.wf-chart-axis,
.wf-agent-impact {
  font-family: var(--wf-font-mono);
  font-variant-numeric: tabular-nums;
}

/* La tabla lleva tabular-nums para que las columnas alineen, pero NO la familia
   mono: las celdas mezclan cifras con nombres propios, y un "Marta Rios" en mono
   parece un log de sistema. El mono es para el DATO, no para el texto. */
.wf-dash-table td {
  font-variant-numeric: tabular-nums;
}

/* ── Banda "que hago ahora": agente + notas ───────────────────────────────
   Grid 7/5 en vez de mitades: la columna del agente carga texto y botones, la
   de notas es una lista corta. Partirlo por la mitad dejaba la izquierda
   apretada y la derecha vacia. */
.wf-dash-act {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: 16px;
  margin-bottom: 22px;
}

@media (max-width: 900px) {
  .wf-dash-act {
    grid-template-columns: 1fr;
  }
}

.wf-agent,
.wf-notes {
  padding: 18px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--card);
  min-width: 0;
}

.wf-agent-head,
.wf-notes-head {
  margin-bottom: 12px;
}

.wf-agent-head h2,
.wf-notes-head h2 {
  font-size: 1.05rem;
}

.wf-agent-sub {
  margin-top: 3px;
  font-size: 0.82rem;
  color: var(--muted-foreground);
}

.wf-agent-list,
.wf-notes-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.wf-agent-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  justify-content: space-between;
  padding: 14px 0 14px 12px;
  border-top: 1px solid var(--border);
  /* La urgencia entra por una barra en el borde, no por el fondo de la fila:
     un fondo tenido compite con la tinta de dato de los charts de al lado. */
  border-left: 3px solid transparent;
}

.wf-agent-item:first-child {
  border-top: 0;
}

.wf-agent-item--alta {
  border-left-color: var(--wf-neg);
}

.wf-agent-item--media {
  border-left-color: var(--wf-series-5);
}

.wf-agent-item--baja {
  border-left-color: var(--border);
}

.wf-agent-item-main {
  min-width: 0;
}

.wf-agent-item-title {
  font-weight: 600;
  line-height: 1.35;
}

.wf-agent-item-detail {
  margin-top: 3px;
  font-size: 0.86rem;
  color: var(--muted-foreground);
}

/* La evidencia es lo que separa una propuesta de una corazonada con botones. */
.wf-agent-item-why {
  margin-top: 6px;
  font-size: 0.8rem;
  color: var(--muted-foreground);
}

.wf-agent-why-label {
  font-weight: 600;
  color: var(--color-fg);
  opacity: 0.75;
}

.wf-agent-item-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex: 0 0 auto;
}

.wf-agent-impact {
  font-weight: 600;
  font-size: 0.92rem;
  white-space: nowrap;
}

.wf-agent-channel {
  font-size: 0.74rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted-foreground);
}

.wf-agent-actions {
  display: flex;
  gap: 6px;
  margin-top: 2px;
}

.wf-agent-ok,
.wf-agent-no {
  font: inherit;
  font-size: 0.8rem;
  padding: 6px 12px;
  min-height: 32px;
  border-radius: 999px;
  cursor: pointer;
  border: 1px solid var(--border);
  transition: background 150ms ease, border-color 150ms ease;
}

.wf-agent-ok {
  background: var(--color-primary);
  color: var(--color-on-primary);
  border-color: transparent;
}

.wf-agent-ok:hover {
  background: color-mix(in srgb, var(--color-primary) 86%, var(--color-fg) 14%);
}

.wf-agent-no {
  background: transparent;
  color: var(--muted-foreground);
}

.wf-agent-no:hover {
  background: color-mix(in srgb, var(--color-fg) 6%, transparent);
}

.wf-agent-ok:focus-visible,
.wf-agent-no:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

.wf-note {
  padding: 11px 0;
  border-top: 1px solid var(--border);
}

.wf-note:first-child {
  border-top: 0;
}

.wf-note-ancla {
  display: inline-block;
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted-foreground);
  margin-bottom: 3px;
}

.wf-note-text {
  font-size: 0.9rem;
  line-height: 1.45;
}

.wf-note-meta {
  display: block;
  margin-top: 4px;
  font-size: 0.74rem;
  color: var(--muted-foreground);
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

/* El grid iguala la altura de la fila a la tarjeta mas alta (la del donut, que
   lleva leyenda de dos lineas), pero el chart tiene aspect-ratio fijo y no crece:
   medido, sobraban 73px MUERTOS al pie de "Ingresos por mes". Con la tarjeta en
   columna y el chart con margen automatico, el sobrante se reparte arriba y abajo
   en vez de amontonarse al fondo. No se deforma nada: estirar el SVG deformaria
   tambien las etiquetas de los ejes, que son <text> dentro del mismo viewBox. */
.wf-chart-card {
  display: flex;
  flex-direction: column;
}

.wf-chart-card .wf-chart,
.wf-chart-card .wf-donut-wrap {
  margin-block: auto;
}

/* El sparkline es ancho y bajo: en una celda de un tercio quedaba solo en su
   propia fila, con dos tercios vacios al lado. Ocupa dos columnas, que es la
   forma que la serie larga pide (12 semanas no entran legibles en 365px). */
@media (min-width: 901px) {
  .wf-chart-card--sparkline {
    grid-column: span 2;
  }
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

/* Progress lists: rows with right-aligned status chips
   (pattern bank: Fireart 25241984, OnPoint 25540988). */
.wf-dash-lists {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
}

.wf-list-card {
  padding: 18px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--card);
}

.wf-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.wf-list-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
}

.wf-list-row + .wf-list-row {
  border-top: 1px solid var(--border);
}

.wf-list-main {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.wf-list-main strong {
  font-size: 0.92rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wf-list-meta {
  color: var(--muted-foreground);
  font-size: 0.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wf-list-bar {
  margin-top: 4px;
  height: 5px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-fg) 10%, transparent);
  overflow: hidden;
}

.wf-list-bar span {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: var(--color-primary);
}

.wf-list-status {
  flex: 0 0 auto;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
}

.wf-list-status--pos {
  color: var(--wf-pos);
  background: color-mix(in srgb, var(--wf-pos) 14%, transparent);
}

.wf-list-status--neg {
  color: var(--wf-neg);
  background: color-mix(in srgb, var(--wf-neg) 14%, transparent);
}

.wf-list-status--accent {
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 14%, transparent);
}

.wf-list-status--muted {
  color: var(--muted-foreground);
  background: color-mix(in srgb, var(--color-fg) 8%, transparent);
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
