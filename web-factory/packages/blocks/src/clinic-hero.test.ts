import { describe, expect, it } from "vitest";
import { renderClinicHero, resolveHeroVariant } from "./clinic-hero";

const base = {
  nombre: "Aura", tagline: "Sonrisas sanas", descripcion: "Clinica dental.", logo: "A",
  contacto: { email: "", tel: "", whatsapp: "", direccion: "La Paz" },
  redes: { ig: "", fb: "", linkedin: "", x: "" },
  servicios: [{ titulo: "s", desc: "d", icono: "x" }],
  cta: { texto: "Agendar cita", url: "https://wa.me/1" },
} as const;

describe("hero variant dispatcher", () => {
  it("uses the explicit variant when set", () => {
    expect(resolveHeroVariant({ ...base, heroVariant: "split" })).toBe("split");
    expect(resolveHeroVariant({ ...base, heroVariant: "fullbleed" })).toBe("fullbleed");
  });

  it("auto-selects full-bleed with a photo and split without", () => {
    expect(resolveHeroVariant({ ...base, heroVariant: "auto", heroPoster: "assets/x.webp" })).toBe("fullbleed");
    expect(resolveHeroVariant({ ...base, heroVariant: "auto" })).toBe("split");
  });

  it("renders the split composition when selected", () => {
    const html = renderClinicHero({ ...base, heroVariant: "split", heroPoster: "assets/x.webp" });
    expect(html).toContain("wf-clinic-hero--split");
    expect(html).toContain("wf-clinic-split-media");
  });

  it("renders the full-bleed composition by default with a photo", () => {
    const html = renderClinicHero({ ...base, heroPoster: "assets/x.webp" });
    expect(html).toContain("wf-clinic-hero-media");
    expect(html).not.toContain("wf-clinic-hero--split");
  });
});
