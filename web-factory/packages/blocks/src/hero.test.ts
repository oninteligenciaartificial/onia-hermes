import { describe, expect, it } from "vitest";
import { renderHero } from "./hero";
import type { SiteClient } from "./types";

const base: SiteClient = {
  nombre: "Aura", tagline: "Sonrisas sanas", descripcion: "Clinica dental.", logo: "A",
  contacto: { email: "", tel: "", whatsapp: "", direccion: "La Paz" },
  redes: { ig: "", fb: "", linkedin: "", x: "" },
  servicios: [{ titulo: "s", desc: "d", icono: "x" }],
  cta: { texto: "Agendar cita", url: "https://wa.me/1" },
};

describe("renderHero trust panel", () => {
  it("uses credenciales in the proof panel when present", () => {
    const html = renderHero({ ...base, credenciales: ["Matricula profesional"] }, { focus: true });
    expect(html).toContain("Matricula profesional");
    expect(html).toContain("wf-proof-points");
  });

  it("still renders when there is no credential data (backward compatible)", () => {
    const html = renderHero(base, { focus: true });
    expect(html).toContain("wf-proof-panel");
    expect(html).toContain("Agendar cita");
  });
});
