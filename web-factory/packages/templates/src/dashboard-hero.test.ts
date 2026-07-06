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
