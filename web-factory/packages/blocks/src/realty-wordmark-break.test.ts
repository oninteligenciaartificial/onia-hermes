import { describe, expect, it } from "vitest";
import { renderWordmarkBreak } from "./realty-wordmark-break";
import type { SiteClient } from "./types";

const base: SiteClient = {
  nombre: "Terra Propiedades", tagline: "Encontra tu proximo lugar", descripcion: "Agencia inmobiliaria.", logo: "TP",
  contacto: { email: "", tel: "", whatsapp: "", direccion: "" },
  redes: { ig: "", fb: "", linkedin: "", x: "" },
  servicios: [{ titulo: "s", desc: "d", icono: "x" }],
  cta: { texto: "Consultar por WhatsApp", url: "https://wa.me/1" },
};

describe("renderWordmarkBreak", () => {
  it("uses wordmarkBreak text when provided", () => {
    const html = renderWordmarkBreak({ ...base, wordmarkBreak: "TERRA", credenciales: ["12 anos en el mercado"] });
    expect(html).toContain("wf-realty-wordmark");
    expect(html).toContain("TERRA");
    expect(html).toContain("12 anos en el mercado");
  });

  it("falls back to the client name when wordmarkBreak is empty", () => {
    const html = renderWordmarkBreak(base);
    expect(html).toContain("TERRA PROPIEDADES");
  });

  it("escapes HTML", () => {
    const html = renderWordmarkBreak({ ...base, wordmarkBreak: "<b>x</b>" });
    expect(html).not.toContain("<b>x</b>");
  });
});
