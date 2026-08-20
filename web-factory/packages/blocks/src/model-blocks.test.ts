import { describe, expect, it } from "vitest";
import { renderBenefitStrip } from "./benefit-strip";
import { renderEditorialStatement } from "./editorial-statement";
import { renderFooterBrand } from "./footer-brand";

describe("renderEditorialStatement", () => {
  it("renders the statement with the in-view reveal the models specify", () => {
    const html = renderEditorialStatement({ statement: "Esto no se trata solo de inmuebles" });
    expect(html).toContain("wf-statement-line");
    expect(html).toContain("wf-reveal");
    expect(html).toContain("Esto no se trata solo de inmuebles");
  });

  it("renders nothing without a statement", () => {
    expect(renderEditorialStatement({ statement: "   " })).toBe("");
  });

  it("escapes the statement, the label and the accent", () => {
    const html = renderEditorialStatement({
      statement: "<script>x</script>",
      label: "<b>l</b>",
      accent: "<i>a</i>",
    });
    expect(html).not.toContain("<script>x</script>");
    expect(html).not.toContain("<b>l</b>");
    expect(html).not.toContain("<i>a</i>");
    expect(html).toContain("&lt;script&gt;");
  });
});

describe("renderBenefitStrip", () => {
  it("staggers items and uses the icon when one is given", () => {
    const html = renderBenefitStrip({
      items: [{ title: "Cobertura nacional", copy: "9 departamentos", icon: "map-pin" }],
    });
    expect(html).toContain("wf-stagger");
    expect(html).toContain("wf-benefit-icon");
    expect(html).toContain("Cobertura nacional");
  });

  it("falls back to an index numeral when there is no icon (row variant)", () => {
    const html = renderBenefitStrip({ layout: "row", items: [{ title: "Sin conservantes" }] });
    expect(html).toContain("wf-benefit-row");
    expect(html).toContain("wf-benefit-index");
    expect(html).toContain("01");
  });

  it("drops blank items and renders nothing when none survive", () => {
    expect(renderBenefitStrip({ items: [{ title: "  " }] })).toBe("");
  });

  it("escapes titles and copy", () => {
    const html = renderBenefitStrip({ items: [{ title: "<script>x</script>", copy: "<b>c</b>" }] });
    expect(html).not.toContain("<script>x</script>");
    expect(html).not.toContain("<b>c</b>");
  });
});

describe("renderFooterBrand", () => {
  it("renders the wordmark, linked and unlinked items, and the legal line", () => {
    const html = renderFooterBrand({
      brand: "FIND",
      groups: [
        {
          title: "Contacto",
          items: [{ label: "hola@find.test", url: "mailto:hola@find.test" }, { label: "Santa Cruz" }],
        },
      ],
      legal: "Linea legal",
    });
    expect(html).toContain("wf-fb-mark");
    expect(html).toContain('href="mailto:hola@find.test"');
    // No url means plain text, not an empty anchor.
    expect(html).toContain("<span class=\"wf-fb-text\">Santa Cruz</span>");
    expect(html).toContain("Linea legal");
  });

  it("stays static by default and only reveals when asked (lecercle band)", () => {
    expect(renderFooterBrand({ brand: "FIND" })).not.toContain("wf-reveal");
    expect(renderFooterBrand({ brand: "Le Cercle", reveal: true })).toContain("wf-reveal");
  });

  it("skips groups whose items are all blank", () => {
    const html = renderFooterBrand({ brand: "FIND", groups: [{ title: "Vacio", items: [{ label: " " }] }] });
    expect(html).not.toContain("Vacio");
  });

  it("renders nothing without a brand and escapes what it does render", () => {
    expect(renderFooterBrand({ brand: " " })).toBe("");
    expect(renderFooterBrand({ brand: "<script>x</script>" })).not.toContain("<script>x</script>");
  });
});
