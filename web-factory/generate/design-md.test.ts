import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { clientSchema } from "../data/schema";
import { contrastRatio, designMdFromProfile } from "./design-md";

const profile = clientSchema.parse(
  JSON.parse(readFileSync(new URL("../data/clients/clinica-amanecer.json", import.meta.url), "utf8")),
);

describe("DESIGN.md por cliente: todo sale del perfil, nada inventado", () => {
  const md = designMdFromProfile(profile);

  it("lleva los tokens del perfil con su rol", () => {
    expect(md).toContain(`| Primario | \`${profile.colores.primary}\``);
    expect(md).toContain(`| Fondo | \`${profile.colores.bg}\``);
    expect(md).toContain(`Titulares: **${profile.tipografia.heading}**`);
    expect(md).toContain(profile.nombre);
  });

  it("mide el contraste con la fórmula WCAG y lo escribe", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 0);
    expect(contrastRatio("#777777", "#FFFFFF")).toBeCloseTo(4.5, 1);
    expect(md).toMatch(/sobre fondo (✓|✗)/);
  });

  it("no rellena lo que el cliente no dio", () => {
    const vacio = designMdFromProfile({ ...profile, tagline: "", descripcion: "" });
    expect(vacio).toContain("Promesa (tagline): _pendiente del cliente_");
    expect(vacio).toContain("Descripción: _pendiente del cliente_");
  });

  it("las reglas de voz están y no usan raya en titulares", () => {
    expect(md).toContain("## Voz y copy");
    expect(md).toContain("Sin raya (—)");
  });
});
