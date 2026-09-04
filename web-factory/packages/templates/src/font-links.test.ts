import { describe, expect, it } from "vitest";

import { fontHref, renderFontLinks } from "./font-links.js";

describe("fontHref", () => {
  it("pide el rango REAL de la familia, no uno inventado", () => {
    // Bricolage llega a 800 y Spline Sans Mono a 700: con el 300..900 viejo la
    // API respondia 400 y la familia no cargaba nunca.
    expect(fontHref("Bricolage Grotesque")).toContain("wght@200..800");
    expect(fontHref("Spline Sans Mono")).toContain("wght@300..700");
    expect(fontHref("DM Sans")).toContain("wght@100..1000");
    expect(fontHref("Onest")).toContain("wght@100..900");
  });

  it("con una familia desconocida NO arriesga el eje", () => {
    // Un eje fuera de rango tumba el link entero; sin eje, css2 responde 200 y
    // al menos la regular llega. Se degrada el peso, no la familia.
    const href = fontHref("Familia Que No Conocemos");
    expect(href).not.toContain("wght");
    expect(href).toContain("family=Familia+Que+No+Conocemos");
  });

  it("codifica el espacio como + y no como %20", () => {
    expect(fontHref("DM Sans")).toContain("family=DM+Sans");
  });
});

describe("renderFontLinks", () => {
  it("emite un link por familia distinta, sin repetir", () => {
    const html = renderFontLinks({ heading: "Onest", body: "Onest" }, ["DM Sans"]);
    expect([...html.matchAll(/<link rel="stylesheet"/g)]).toHaveLength(2);
  });

  it("sin tipografia no emite nada (ni preconnect huerfano)", () => {
    expect(renderFontLinks({ heading: "", body: "" })).toBe("");
  });
});
