import { describe, expect, it } from "vitest";

import { barPath, chartScale, renderChart, type DashboardChart, type DashboardPoint } from "./dashboard.js";

// Geometria del chart (espejo de las constantes privadas de dashboard.ts).
const CHART_W = 320;
const PAD_L = 34;
const PAD_R = 12;
const PLOT_RIGHT = CHART_W - PAD_R;

/** Vertices de un `path` de barra (M / h / v / a relativos). */
function pathVertices(d: string): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  let x = 0;
  let y = 0;
  for (const token of d.match(/[MHhVvAaZz][^MHhVvAaZz]*/g) ?? []) {
    const numbers = (token.slice(1).match(/-?\d*\.?\d+/g) ?? []).map(Number);
    switch (token[0]) {
      case "M":
        x = numbers[0];
        y = numbers[1];
        break;
      case "h":
        x += numbers[0];
        break;
      case "v":
        y += numbers[0];
        break;
      case "a":
        x += numbers[5];
        y += numbers[6];
        break;
      default:
        continue;
    }
    points.push({ x, y });
  }
  return points;
}

function bars(svg: string): Array<{ x: number; y: number; width: number; height: number }> {
  return [...svg.matchAll(/<path d="(M[^"]+)"/g)].map((match) => {
    const points = pathVertices(match[1]);
    const xs = points.map((point) => point.x);
    const ys = points.map((point) => point.y);
    const x = Math.min(...xs);
    const y = Math.min(...ys);
    return { x, y, width: Math.max(...xs) - x, height: Math.max(...ys) - y };
  });
}

function axisLabels(svg: string): string[] {
  return [...svg.matchAll(/class="wf-chart-axis">([^<]*)<\/text>/g)].map((match) => match[1]);
}

function chart(type: DashboardChart["type"], points: DashboardPoint[]): DashboardChart {
  return { title: "Prueba", unit: "Bs", type, points };
}

describe("chartScale", () => {
  it("abre el dominio hacia abajo cuando hay negativos", () => {
    const scale = chartScale([120, -40, 80]);
    expect(scale.min).toBeLessThan(0);
    expect(scale.max).toBeGreaterThan(0);
    // El cero deja de ser el piso: queda como linea interna del plot.
    expect(scale.yFor(-40)).toBeGreaterThan(scale.zeroY);
    expect(scale.yFor(120)).toBeLessThan(scale.zeroY);
  });

  it("no deja el 32% del plot muerto: 340 va a 350, no a 500", () => {
    expect(chartScale([340]).max).toBe(350);
  });

  it("sobrevive a una serie toda en cero", () => {
    const scale = chartScale([0, 0, 0]);
    expect(Number.isFinite(scale.zeroY)).toBe(true);
    expect(scale.max).toBeGreaterThan(0);
  });
});

describe("renderBarChart", () => {
  it("dibuja el negativo BAJO el cero, no aplastado a altura 0", () => {
    const svg = renderChart(
      chart("bar", [
        { label: "Ene", value: 900 },
        { label: "Feb", value: -300 },
      ]),
    );
    const [positive, negative] = bars(svg);
    expect(negative.height).toBeGreaterThan(0);
    // La barra negativa arranca donde termina el cero y baja: su tope queda
    // por debajo del tope de la positiva.
    expect(negative.y).toBeGreaterThan(positive.y + positive.height - 0.1);
    // Y el titulo sigue diciendo el numero real (era la contradiccion original).
    expect(svg).toContain("Feb: -300");
  });

  it("mete 90 barras dentro del viewBox en vez de recortar la serie", () => {
    const points = Array.from({ length: 90 }, (_, index) => ({ label: `d${index}`, value: index + 1 }));
    const drawn = bars(renderChart(chart("bar", points)));
    expect(drawn).toHaveLength(90);
    for (const bar of drawn) {
      expect(bar.x).toBeGreaterThanOrEqual(PAD_L - 0.1);
      expect(bar.x + bar.width).toBeLessThanOrEqual(PLOT_RIGHT + 0.1);
    }
  });

  it("rotula el ultimo punto del eje X", () => {
    const points = Array.from({ length: 58 }, (_, index) => ({ label: `p${index}`, value: 10 }));
    expect(axisLabels(renderChart(chart("bar", points)))).toContain("p57");
  });
});

describe("renderLineChart", () => {
  it("baja del cero en vez de clavar el punto en el piso", () => {
    const svg = renderChart(
      chart("line", [
        { label: "Ene", value: 50 },
        { label: "Feb", value: -50 },
      ]),
    );
    const scale = chartScale([50, -50]);
    const ys = [...svg.matchAll(/<circle cx="[-\d.]+" cy="([-\d.]+)"/g)].map((match) => Number(match[1]));
    expect(ys[1]).toBeCloseTo(scale.yFor(-50), 1);
    expect(ys[1]).toBeGreaterThan(scale.zeroY);
  });
});

describe("barPath", () => {
  it("deja la base PLANA y redondea solo la punta libre", () => {
    // Un `rect rx` redondeaba las cuatro esquinas: la barra flotaba sobre el cero.
    // Las dos esquinas de la base tienen que existir tal cual, sin radio.
    const base = 100;
    const points = pathVertices(barPath(10, base - 40, 20, 40, 3, false));
    const onBase = points.filter((point) => Math.abs(point.y - base) < 0.01);
    expect(onBase.map((point) => point.x).sort((a, b) => a - b)).toEqual([10, 30]);
    // ...y ninguna esquina superior queda sobre la linea del tope.
    expect(points.some((point) => Math.abs(point.y - (base - 40)) < 0.01 && point.x === 10)).toBe(false);
  });

  it("en la barra negativa el radio se va ABAJO", () => {
    const top = 60;
    const points = pathVertices(barPath(10, top, 20, 40, 3, true));
    const onTop = points.filter((point) => Math.abs(point.y - top) < 0.01);
    expect(onTop.map((point) => point.x).sort((a, b) => a - b)).toEqual([10, 30]);
  });

  it("no desborda la barra cuando el radio no cabe", () => {
    const points = pathVertices(barPath(0, 0, 2, 1, 3, false));
    expect(Math.max(...points.map((point) => point.x))).toBeLessThanOrEqual(2.01);
    expect(Math.max(...points.map((point) => point.y))).toBeLessThanOrEqual(1.01);
  });
});

describe("renderRadialChart", () => {
  const gauge = (points: DashboardPoint[]): DashboardChart => ({
    title: "Agenda",
    unit: "9 citas",
    type: "radial",
    points,
  });

  it("expresa la parte sobre el total y la canta al centro", () => {
    const svg = renderChart(
      gauge([
        { label: "Confirmadas", value: 7 },
        { label: "Sin confirmar", value: 2 },
      ]),
    );
    expect(svg).toContain(">78%<");
    expect(svg).toContain("Confirmadas: 7 de 9 (78%)");
  });

  it("con un solo punto lee el valor como porcentaje", () => {
    expect(renderChart(gauge([{ label: "Cierre", value: 34 }]))).toContain(">34%<");
  });

  it("con valor cero NO dibuja arco de dato", () => {
    // Un arco de largo 0 con linecap round pinta un punto: se leeria como "algo".
    const svg = renderChart(gauge([{ label: "Cierre", value: 0 }]));
    expect(svg).toContain(">0%<");
    expect([...svg.matchAll(/<path /g)]).toHaveLength(1);
  });
});

describe("renderDonutChart", () => {
  const donut: DashboardChart = {
    title: "Tratamientos",
    unit: "tratamientos",
    type: "donut",
    points: [
      { label: "Limpieza", value: 38 },
      { label: "Restauracion", value: 27 },
      { label: "Ortodoncia", value: 21 },
      { label: "Otros", value: 14 },
    ],
  };

  it("separa los gajos SIN mover el reparto", () => {
    const svg = renderChart(donut);
    const drawn = [...svg.matchAll(/stroke-dasharray="([\d.]+) /g)].map((match) => Number(match[1]));
    const offsets = [...svg.matchAll(/stroke-dashoffset="(-?[\d.]+)"/g)].map((match) => Number(match[1]));
    const circumference = 2 * Math.PI * 52;
    // Cada gajo se dibuja mas corto que su angulo (ahi esta el gap)...
    expect(drawn[0]).toBeCloseTo((38 / 100) * circumference - 4, 1);
    // ...pero el siguiente arranca donde le toca por proporcion, no corrido.
    expect(-offsets[1]).toBeCloseTo((38 / 100) * circumference, 1);
  });

  it("pone el total al centro en vez de dejar el agujero vacio", () => {
    expect(renderChart(donut)).toContain('class="wf-donut-total">100<');
  });
});

describe("marcadores", () => {
  it("los puntos de la linea llegan al minimo de 8px de diametro", () => {
    const svg = renderChart(
      chart("line", [
        { label: "Ene", value: 10 },
        { label: "Feb", value: 20 },
      ]),
    );
    const radii = [...svg.matchAll(/<circle [^>]*r="([\d.]+)"/g)].map((match) => Number(match[1]));
    expect(Math.min(...radii)).toBeGreaterThanOrEqual(4);
  });
});
