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
});
