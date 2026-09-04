import { describe, expect, it } from "vitest";
import { renderHero } from "./hero";

const base = {
  nombre: "Aura", tagline: "Sonrisas sanas", descripcion: "Clinica dental.", logo: "A",
  contacto: { email: "", tel: "", whatsapp: "", direccion: "La Paz" },
  redes: { ig: "", fb: "", linkedin: "", x: "" },
  servicios: [{ titulo: "s", desc: "d", icono: "x" }],
  cta: { texto: "Agendar cita", url: "https://wa.me/1" },
};

describe("renderHero trust panel", () => {
  it("uses beneficios in the proof panel when present", () => {
    const html = renderHero({ ...base, beneficios: ["Urgencias el mismo dia"] }, { focus: true });
    expect(html).toContain("Urgencias el mismo dia");
    expect(html).toContain("wf-proof-points");
  });

  it("leaves credenciales to the trust strip so the same list never prints twice", () => {
    const html = renderHero({ ...base, credenciales: ["Matricula profesional"] }, { focus: true });
    expect(html).not.toContain("Matricula profesional");
    expect(html).toContain("wf-proof-panel");
  });

  it("still renders when there is no credential data (backward compatible)", () => {
    const html = renderHero(base, { focus: true });
    expect(html).toContain("wf-proof-panel");
    expect(html).toContain("Agendar cita");
  });
});
