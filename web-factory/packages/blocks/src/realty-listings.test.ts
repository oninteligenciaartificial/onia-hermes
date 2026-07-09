import { describe, expect, it } from "vitest";
import { renderListings } from "./realty-listings";

const base = {
  nombre: "Terra Propiedades", tagline: "t", descripcion: "d", logo: "TP",
  contacto: { email: "", tel: "", whatsapp: "", direccion: "" },
  redes: { ig: "", fb: "", linkedin: "", x: "" },
  servicios: [{ titulo: "s", desc: "d", icono: "x" }],
  cta: { texto: "c", url: "#" },
} as const;

describe("renderListings", () => {
  it("renders a featured card and a grid of regular cards", () => {
    const html = renderListings({
      ...base,
      listings: [
        { titulo: "Casa Zona Sur", precio: "USD 145.000", zona: "Zona Sur", tipo: "Casa", operacion: "venta", dormitorios: 3, banos: 2, imagen: "assets/a.webp", imagenAlt: "a", destacado: true },
        { titulo: "Depto Centro", precio: "USD 80.000", zona: "Centro", tipo: "Departamento", operacion: "venta", dormitorios: 2, banos: 1, imagen: "assets/b.webp", imagenAlt: "b" },
        { titulo: "Terreno Norte", precio: "USD 40.000", zona: "Norte", tipo: "Terreno", operacion: "venta" },
      ],
    });
    expect(html).toContain("wf-realty-listing--featured");
    expect(html).toContain("Casa Zona Sur");
    expect(html).toContain("USD 145.000");
    expect(html).toContain("3 dorm");
    expect(html).toContain("Depto Centro");
    expect(html).toContain("Terreno Norte");
  });

  it("renders an honest empty state with no fabricated listings", () => {
    const html = renderListings(base);
    expect(html).toContain("wf-realty-empty");
    expect(html).not.toContain("wf-realty-listing-card");
  });

  it("escapes HTML in listing fields", () => {
    const html = renderListings({
      ...base,
      listings: [{ titulo: "<script>x</script>", precio: "p", zona: "z", tipo: "t", operacion: "venta" }],
    });
    expect(html).not.toContain("<script>x</script>");
  });
});
