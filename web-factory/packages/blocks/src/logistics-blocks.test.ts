import { describe, expect, it } from "vitest";
import { renderInlineQuoteForm } from "./inline-quote-form";
import { renderScrollStoryHero } from "./scroll-story-hero";
import { renderStatStrip } from "./stat-strip";

// The three blocks that complete unitedcarriers-logistics. The assertions that
// matter are the model's rules, not the markup: the story must survive without
// motion, a number must never be invented, and a form must never be a prop.

describe("renderScrollStoryHero", () => {
  const frames = [
    { src: "assets/a.svg", alt: "Deposito", stage: "Deposito" },
    { src: "assets/b.svg", alt: "Ruta", stage: "Ruta" },
    { src: "assets/c.svg", alt: "Entrega", stage: "Entrega" },
  ];

  it("wires the scrub track to the frame count and marks the story steps", () => {
    const html = renderScrollStoryHero({
      brand: "Carriers",
      headline: "Segui tu carga",
      ctaPrimary: { label: "Cotizar", url: "#cotizacion" },
      frames,
    });

    expect(html).toContain("data-wf-scrub");
    expect(html).toContain("--wf-frames:3");
    expect(html.match(/class="wf-frame wf-ssh-frame"/g)).toHaveLength(3);
    // The steps are text inside the track: that is what the runtime syncs and
    // what a screen reader reads when nothing moves.
    expect(html.match(/class="wf-step wf-ssh-step"/g)).toHaveLength(3);
    expect(html).toContain("Entrega");
  });

  it("keeps the first frame eager and lazy-loads the rest", () => {
    const html = renderScrollStoryHero({
      brand: "Carriers",
      headline: "Segui tu carga",
      ctaPrimary: { label: "Cotizar", url: "#cotizacion" },
      frames,
    });

    expect(html.match(/loading="eager"/g)).toHaveLength(1);
    expect(html.match(/loading="lazy"/g)).toHaveLength(2);
  });

  it("degrades to a single-frame hero (lecercle) with an optional second cta", () => {
    const html = renderScrollStoryHero({
      brand: "Le Cercle",
      headline: "Live where the sun meets the sea",
      ctaPrimary: { label: "Ver propiedades", url: "#cartera" },
      ctaSecondary: { label: "Agendar visita", url: "#contacto" },
      frames: [{ src: "assets/villa.webp", alt: "Villa" }],
    });

    expect(html).toContain("--wf-frames:1");
    expect(html).toContain("wf-ssh-cta-2");
    // One stage is not a story: no step list, no fake progress.
    expect(html).not.toContain("wf-ssh-steps");
  });

  it("renders without media and escapes what it prints", () => {
    const html = renderScrollStoryHero({
      brand: "<script>x</script>",
      headline: "Titular",
      ctaPrimary: { label: "Cotizar", url: "#cotizacion" },
    });

    expect(html).not.toContain("<script>x</script>");
    expect(html).not.toContain("wf-ssh-media");
    expect(html).toContain("--wf-frames:1");
  });
});

describe("renderStatStrip", () => {
  it("counts up a plain integer and keeps the final value in the html", () => {
    const html = renderStatStrip({
      items: [{ value: "4.200", label: "envios entregados", source: "registro interno 2026" }],
    });

    expect(html).toContain('data-wf-count="4200"');
    expect(html).toContain(">4.200</span>");
    expect(html).toContain("registro interno 2026");
  });

  it("keeps the suffix out of the counter", () => {
    const html = renderStatStrip({ items: [{ value: "9 departamentos", label: "cobertura" }] });
    expect(html).toContain('data-wf-count="9"');
    expect(html).toContain("departamentos");
  });

  it("never animates money or an unconfirmed number (pattern bank rule 7)", () => {
    const html = renderStatStrip({
      items: [
        { value: "Bs 1.200", label: "tarifa base" },
        { value: "—", label: "envios por mes", placeholder: true },
      ],
    });

    expect(html).not.toContain("data-wf-count");
    expect(html).toContain("dato de muestra");
  });

  it("renders nothing without items: no numbers, no section", () => {
    expect(renderStatStrip({ items: [] })).toBe("");
    expect(renderStatStrip({ items: [{ value: " ", label: "x" }] })).toBe("");
  });
});

describe("renderInlineQuoteForm", () => {
  const fields = [
    { name: "origen", label: "Origen", required: true },
    { name: "carga", label: "Tipo de carga", type: "select" as const, options: ["Paletizada", "Granel"] },
    { name: "detalle", label: "Detalle", type: "textarea" as const },
  ];

  it("builds the fields it is given, labelled and attributed", () => {
    const html = renderInlineQuoteForm({
      heading: "Cotiza tu envio",
      action: "/api/leads",
      fields,
      source: "logistics-demo",
    });

    expect(html).toContain('for="cotizacion-origen"');
    expect(html).toContain('id="cotizacion-origen"');
    expect(html).toContain("(obligatorio)");
    expect(html).toContain('<option value="">');
    expect(html).toContain("<textarea");
    expect(html).toContain('name="src" value="logistics-demo"');
  });

  it("drops the form without an endpoint but keeps the direct channels", () => {
    const html = renderInlineQuoteForm({
      heading: "Cotiza tu envio",
      action: "",
      fields,
      direct: [{ label: "WhatsApp", value: "+591 700 00000", url: "https://wa.me/59170000000" }],
    });

    expect(html).not.toContain("<form");
    expect(html).toContain("https://wa.me/59170000000");
  });

  it("renders nothing without a heading and escapes what it prints", () => {
    expect(renderInlineQuoteForm({ heading: "  ", action: "/x", fields })).toBe("");
    const html = renderInlineQuoteForm({
      heading: "<script>x</script>",
      action: "/x",
      fields: [{ name: "a", label: "<b>l</b>" }],
    });
    expect(html).not.toContain("<script>x</script>");
    expect(html).not.toContain("<b>l</b>");
  });
});
