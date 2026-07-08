import { describe, expect, it } from "vitest";
import { renderProcess } from "./process";

const base = {
  nombre: "Aura", tagline: "t", descripcion: "d", logo: "A",
  contacto: { email: "", tel: "", whatsapp: "", direccion: "" },
  redes: { ig: "", fb: "", linkedin: "", x: "" },
  servicios: [{ titulo: "s", desc: "d", icono: "x" }],
  cta: { texto: "c", url: "#" },
} as const;

describe("renderProcess", () => {
  it("renders numbered steps", () => {
    const html = renderProcess({
      ...base,
      proceso: [
        { titulo: "Agenda", desc: "Escribinos por WhatsApp." },
        { titulo: "Evaluacion", desc: "Revisamos tu caso." },
      ],
    });
    expect(html).toContain("wf-process");
    expect(html).toContain("Agenda");
    expect(html).toContain("Evaluacion");
    expect(html).toContain("01");
    expect(html).toContain("02");
  });

  it("returns empty string when proceso is empty", () => {
    expect(renderProcess(base)).toBe("");
  });

  it("escapes HTML", () => {
    const html = renderProcess({ ...base, proceso: [{ titulo: "<b>x</b>", desc: "d" }] });
    expect(html).not.toContain("<b>x</b>");
  });

  it("uses process copy overrides when provided (generalization)", () => {
    const html = renderProcess({
      ...base,
      proceso: [{ titulo: "Contacto", desc: "Nos escribis por WhatsApp." }],
      procesoKicker: "Como comprar",
      procesoTitulo: "De tu consulta a la firma, sin vueltas",
    });
    expect(html).toContain("Como comprar");
    expect(html).toContain("De tu consulta a la firma, sin vueltas");
    expect(html).not.toContain("Como funciona");
    expect(html).not.toContain("De tu mensaje a tu cita");
  });

  it("still defaults to the clinic copy when no override is given (backward compatible)", () => {
    const html = renderProcess({ ...base, proceso: [{ titulo: "Agenda", desc: "d" }] });
    expect(html).toContain("Como funciona");
    expect(html).toContain("De tu mensaje a tu cita, sin vueltas");
  });
});
