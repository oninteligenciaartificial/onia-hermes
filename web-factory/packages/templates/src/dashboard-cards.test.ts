import { describe, expect, it } from "vitest";
import { renderSidePanel, renderTable } from "./dashboard-cards";

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
