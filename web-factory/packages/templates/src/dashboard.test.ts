import { describe, expect, it } from "vitest";

import { chartScale, renderChart, type DashboardChart, type DashboardPoint } from "./dashboard.js";

// Geometria del chart (espejo de las constantes privadas de dashboard.ts).
const CHART_W = 320;
const PAD_L = 34;
const PAD_R = 12;
const PLOT_RIGHT = CHART_W - PAD_R;

function bars(svg: string): Array<{ x: number; y: number; width: number; height: number }> {
  return [...svg.matchAll(/<rect x="([-\d.]+)" y="([-\d.]+)" width="([-\d.]+)" height="([-\d.]+)"/g)].map(
    (match) => ({
      x: Number(match[1]),
      y: Number(match[2]),
      width: Number(match[3]),
      height: Number(match[4]),
    }),
  );
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
