import { describe, expect, it } from "vitest";
import { renderZones } from "./realty-zones";

const base = {
  nombre: "Terra Propiedades", tagline: "t", descripcion: "d", logo: "TP",
  contacto: { email: "", tel: "", whatsapp: "", direccion: "" },
  redes: { ig: "", fb: "", linkedin: "", x: "" },
  servicios: [{ titulo: "s", desc: "d", icono: "x" }],
  cta: { texto: "c", url: "#" },
} as const;

describe("renderZones", () => {
  it("renders zone chips without a fake interactive map", () => {
    const html = renderZones({ ...base, zonas: ["Zona Sur", "Centro", "Norte"] });
    expect(html).toContain("wf-realty-zones");
    expect(html).toContain("Zona Sur");
    expect(html).toContain("Centro");
    expect(html).not.toContain("<iframe");
    expect(html).not.toContain("maps.google");
  });

  it("returns empty string when there are no zones", () => {
    expect(renderZones(base)).toBe("");
  });

  it("escapes HTML", () => {
    const html = renderZones({ ...base, zonas: ["<script>x</script>"] });
    expect(html).not.toContain("<script>x</script>");
  });
});
