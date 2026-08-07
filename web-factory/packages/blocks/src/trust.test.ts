import { describe, expect, it } from "vitest";
import { renderTrust } from "./trust";

const base = {
  nombre: "Aura", tagline: "t", descripcion: "d", logo: "A",
  contacto: { email: "", tel: "", whatsapp: "", direccion: "" },
  redes: { ig: "", fb: "", linkedin: "", x: "" },
  servicios: [{ titulo: "s", desc: "d", icono: "x" }],
  cta: { texto: "c", url: "#" },
} as const;

describe("renderTrust", () => {
  it("renders credenciales as a trust strip", () => {
    const html = renderTrust({ ...base, credenciales: ["Matricula profesional", "Esterilizacion certificada"] });
    expect(html).toContain("wf-trust");
    expect(html).toContain("Matricula profesional");
    expect(html).toContain("Esterilizacion certificada");
  });

  it("ignores beneficios: those belong to the hero proof panel", () => {
    expect(renderTrust({ ...base, beneficios: ["Urgencias el mismo dia"] })).toBe("");
  });

  it("returns empty string when there is nothing to show", () => {
    expect(renderTrust(base)).toBe("");
  });

  it("escapes HTML in items", () => {
    const html = renderTrust({ ...base, credenciales: ["<script>x</script>"] });
    expect(html).not.toContain("<script>x</script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
