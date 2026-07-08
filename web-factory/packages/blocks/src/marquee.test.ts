import { describe, expect, it } from "vitest";
import { renderMarquee } from "./marquee";

describe("renderMarquee", () => {
  it("renders items and a duplicated aria-hidden set for a seamless loop", () => {
    const html = renderMarquee(["Matricula profesional", "Urgencias"], { label: "Sellos" });
    expect(html).toContain("wf-marquee");
    expect(html).toContain("wf-marquee-track");
    expect(html).toContain('aria-label="Sellos"');
    // Two copies: 4 items total, exactly one duplicated set is aria-hidden.
    expect((html.match(/wf-marquee-item/g) ?? []).length).toBe(4);
    expect((html.match(/marquee-item" aria-hidden="true"/g) ?? []).length).toBe(2);
  });

  it("returns empty string when there are no items", () => {
    expect(renderMarquee([])).toBe("");
    expect(renderMarquee(["", "   "])).toBe("");
  });

  it("escapes HTML in items", () => {
    const html = renderMarquee(["<script>x</script>"]);
    expect(html).not.toContain("<script>x</script>");
  });
});
