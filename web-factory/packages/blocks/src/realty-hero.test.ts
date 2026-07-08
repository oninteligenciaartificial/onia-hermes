import { describe, expect, it } from "vitest";
import { renderRealtyHero } from "./realty-hero";

const base = {
  nombre: "Terra Propiedades", tagline: "Encontra tu proximo lugar", descripcion: "Agencia inmobiliaria.", logo: "TP",
  contacto: { email: "", tel: "", whatsapp: "", direccion: "" },
  redes: { ig: "", fb: "", linkedin: "", x: "" },
  servicios: [{ titulo: "s", desc: "d", icono: "x" }],
  cta: { texto: "Consultar por WhatsApp", url: "https://wa.me/1" },
} as const;

describe("renderRealtyHero", () => {
  it("renders a full-bleed hero with a floating search panel", () => {
    const html = renderRealtyHero({ ...base, heroPoster: "assets/hero.webp", zonas: ["Zona Sur", "Centro"] });
    expect(html).toContain("wf-realty-hero");
    expect(html).toContain("wf-realty-search");
    expect(html).toContain("Zona Sur");
    expect(html).toContain("Encontra tu proximo lugar");
    expect(html).toContain("Consultar por WhatsApp");
  });

  it("degrades gracefully without a hero photo", () => {
    const html = renderRealtyHero(base);
    expect(html).toContain("wf-realty-hero");
    expect(html).not.toContain("<img");
  });

  it("escapes HTML in zone options", () => {
    const html = renderRealtyHero({ ...base, zonas: ["<script>x</script>"] });
    expect(html).not.toContain("<script>x</script>");
  });
});
