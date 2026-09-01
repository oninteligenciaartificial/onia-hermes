import { describe, expect, it } from "vitest";
import { renderBenefitStrip } from "./benefit-strip";
import { EDITORIAL_STATEMENT_CSS, renderEditorialStatement } from "./editorial-statement";
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

  // T9 (statement pantalla-completa) es una VARIANTE de este bloque, no otro
  // bloque: estos tests fijan lo que la variante agrega y lo que no rompe.
  it("por defecto no es pantalla completa ni pinta fondo", () => {
    const html = renderEditorialStatement({ statement: "Una linea" });
    expect(html).not.toContain("wf-statement--pantalla");
    expect(html).not.toContain("wf-statement--bleed");
    expect(html).not.toContain("wf-statement--marca");
  });

  it("con pantalla se toma la pantalla, y el fondo pintado va full-bleed", () => {
    const html = renderEditorialStatement({
      statement: "Una linea",
      pantalla: true,
      fondo: "tinta",
    });
    expect(html).toContain("wf-statement--pantalla");
    expect(html).toContain("wf-statement--tinta");
    // Un color que se corta en la medida lee como tarjeta, no como seccion.
    expect(html).toContain("wf-statement--bleed");
  });

  it("cada linea declarada es un hijo del stagger, para que revelen por turno", () => {
    const html = renderEditorialStatement({
      statement: "Primera linea\n\nSegunda linea",
      accent: "y el giro.",
    });
    expect(html).toContain("wf-stagger");
    expect(html.match(/wf-statement-l"/g)).toHaveLength(2);
    // El acento cierra la ULTIMA linea: es el giro de la frase, no un adorno
    // suelto entre medio.
    expect(html).toMatch(/Segunda linea <em class="wf-statement-accent">/);
  });

  it("dibuja el CTA solo cuando tiene texto Y url", () => {
    const conCta = renderEditorialStatement({
      statement: "Una linea",
      cta: { label: "Pedir demo", url: "#contacto" },
    });
    expect(conCta).toContain('class="wf-statement-cta" href="#contacto"');
    expect(conCta).toContain("Pedir demo");

    const sinUrl = renderEditorialStatement({
      statement: "Una linea",
      cta: { label: "Pedir demo", url: "  " },
    });
    expect(sinUrl).not.toContain("wf-statement-cta");
  });

  it("la variante solida invierte el par completo del boton y del acento", () => {
    // Cambiar solo el fondo es como se fabrica un boton invisible: el par
    // entero tiene que darse vuelta.
    expect(EDITORIAL_STATEMENT_CSS).toMatch(
      /\.wf-statement--tinta\s*\{[^}]*--wf-statement-surface:\s*var\(--color-primary\)[^}]*--wf-statement-fg:\s*var\(--color-on-primary\)/,
    );
    expect(EDITORIAL_STATEMENT_CSS).toMatch(
      /\.wf-statement--tinta \.wf-statement-cta\s*\{[^}]*background:\s*var\(--color-on-primary\)[^}]*color:\s*var\(--color-primary\)/,
    );
    expect(EDITORIAL_STATEMENT_CSS).toContain(".wf-statement--tinta .wf-statement-accent");
  });

  // Los dos defectos que solo apareceron MIDIENDO el render, no leyendo el CSS.
  it("la pantalla completa mide una pantalla, padding incluido", () => {
    // Sin box-sizing el padding se suma a las 100svh: 1080px en un viewport de
    // 900. La seccion no puede depender del reset de la pagina que la usa.
    expect(EDITORIAL_STATEMENT_CSS).toMatch(
      /\.wf-statement--pantalla\s*\{[^}]*box-sizing:\s*border-box[^}]*min-height:\s*100svh/,
    );
  });

  it("la pantalla completa ensancha la medida para que la linea declarada no se parta", () => {
    expect(EDITORIAL_STATEMENT_CSS).toMatch(
      /\.wf-statement--pantalla \.wf-statement-line\s*\{[^}]*max-width:\s*24ch/,
    );
  });

  it("el CTA respeta el minimo tactil y tiene anillo de foco", () => {
    expect(EDITORIAL_STATEMENT_CSS).toMatch(/\.wf-statement-cta\s*\{[^}]*min-height:\s*44px/);
    expect(EDITORIAL_STATEMENT_CSS).toContain(".wf-statement-cta:focus-visible");
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
