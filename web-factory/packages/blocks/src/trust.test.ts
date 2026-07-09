import { describe, expect, it } from "vitest";
import { renderTrust } from "./trust";
import type { SiteClient } from "./types";

const base: SiteClient = {
  nombre: "Aura", tagline: "t", descripcion: "d", logo: "A",
  contacto: { email: "", tel: "", whatsapp: "", direccion: "" },
  redes: { ig: "", fb: "", linkedin: "", x: "" },
  servicios: [{ titulo: "s", desc: "d", icono: "x" }],
  cta: { texto: "c", url: "#" },
};

describe("renderTrust", () => {
  it("renders credenciales as a trust strip", () => {
    const html = renderTrust({ ...base, credenciales: ["Matricula profesional", "Esterilizacion certificada"] });
    expect(html).toContain("wf-trust");
    expect(html).toContain("Matricula profesional");
    expect(html).toContain("Esterilizacion certificada");
  });

  it("falls back to beneficios when credenciales is empty", () => {
    const html = renderTrust({ ...base, beneficios: ["Urgencias el mismo dia"] });
    expect(html).toContain("Urgencias el mismo dia");
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
