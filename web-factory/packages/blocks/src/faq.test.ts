import { describe, expect, it } from "vitest";
import { renderFaq } from "./faq";
import type { SiteClient } from "./types";

const base: SiteClient = {
  nombre: "Aura", tagline: "t", descripcion: "d", logo: "A",
  contacto: { email: "", tel: "", whatsapp: "", direccion: "" },
  redes: { ig: "", fb: "", linkedin: "", x: "" },
  servicios: [{ titulo: "s", desc: "d", icono: "x" }],
  cta: { texto: "c", url: "#" },
};

describe("renderFaq", () => {
  it("renders accessible details/summary items", () => {
    const html = renderFaq({
      ...base,
      faq: [{ pregunta: "Duele?", respuesta: "Usamos anestesia local." }],
    });
    expect(html).toContain("wf-faq");
    expect(html).toContain("<details");
    expect(html).toContain("<summary");
    expect(html).toContain("Duele?");
    expect(html).toContain("Usamos anestesia local.");
  });

  it("returns empty string when faq is empty", () => {
    expect(renderFaq(base)).toBe("");
  });

  it("escapes HTML", () => {
    const html = renderFaq({ ...base, faq: [{ pregunta: "<i>x</i>", respuesta: "r" }] });
    expect(html).not.toContain("<i>x</i>");
  });
});
