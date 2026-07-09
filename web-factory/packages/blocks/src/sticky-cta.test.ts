import { describe, expect, it } from "vitest";
import { renderStickyCta } from "./sticky-cta";
import type { SiteClient } from "./types";

const base: SiteClient = {
  nombre: "Aura", tagline: "t", descripcion: "d", logo: "A",
  contacto: { email: "", tel: "", whatsapp: "", direccion: "" },
  redes: { ig: "", fb: "", linkedin: "", x: "" },
  servicios: [{ titulo: "s", desc: "d", icono: "x" }],
  cta: { texto: "Agendar cita", url: "https://wa.me/59170000000" },
};

describe("renderStickyCta", () => {
  it("renders a fixed CTA pointing at the real channel", () => {
    const html = renderStickyCta(base);
    expect(html).toContain("wf-sticky-cta");
    expect(html).toContain("https://wa.me/59170000000");
    expect(html).toContain("Agendar cita");
    expect(html).toContain("aria-label");
  });

  it("returns empty string when the CTA url is missing", () => {
    expect(renderStickyCta({ ...base, cta: { texto: "x", url: "" } })).toBe("");
  });
});
