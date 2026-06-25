import { describe, expect, it } from "vitest";
import { clientSchema } from "./schema";

describe("clientSchema", () => {
  it("applies sensible defaults to a minimal client", () => {
    const client = clientSchema.parse({ nombre: "Demo", slug: "demo" });

    expect(client.colores.primary).toBe("#0f766e");
    expect(client.tipografia.heading).toBe("Onest");
    expect(client.servicios).toHaveLength(3);
    expect(client.cta.url).toBe("/contacto");
  });

  it("rejects invalid color tokens", () => {
    expect(() =>
      clientSchema.parse({
        nombre: "Bad Color",
        slug: "bad-color",
        colores: { primary: "teal" },
      }),
    ).toThrow();
  });

  it("accepts store data and local anchor CTAs", () => {
    const client = clientSchema.parse({
      nombre: "Store",
      slug: "store",
      cta: {
        texto: "Ver catalogo",
        url: "#catalogo",
      },
      productos: [
        {
          titulo: "Producto demo",
          categoria: "Tecnologia",
          precio: "Consultar",
          precioValor: 120,
          moneda: "BOB",
          desc: "Producto de prueba para tienda.",
          imagen: "assets/producto-demo.webp",
          marca: "Demo Labs",
          beneficios: ["Compra asistida"],
          incluye: ["Producto unitario"],
          especificaciones: [{ label: "Tamano", value: "1 unidad" }],
          detalleImagenes: [{ src: "assets/producto-demo.webp", label: "Envase" }],
          ordenRutina: 1,
        },
      ],
      heroVideo: "assets/store-hero.mp4",
      heroPoster: "assets/store-hero.webp",
      referencias: [{ title: "Referencia demo", url: "https://example.com", type: "visual" }],
    });

    expect(client.cta.url).toBe("#catalogo");
    expect(client.heroVideo).toBe("assets/store-hero.mp4");
    expect(client.heroPoster).toBe("assets/store-hero.webp");
    expect(client.referencias[0].url).toBe("https://example.com");
    expect(client.productos).toHaveLength(1);
    expect(client.productos[0].etiqueta).toBe("Nuevo");
    expect(client.productos[0].precioValor).toBe(120);
    expect(client.productos[0].moneda).toBe("BOB");
    expect(client.productos[0].imagen).toBe("assets/producto-demo.webp");
    expect(client.productos[0].marca).toBe("Demo Labs");
    expect(client.productos[0].beneficios).toEqual(["Compra asistida"]);
    expect(client.productos[0].incluye).toEqual(["Producto unitario"]);
    expect(client.productos[0].especificaciones[0]).toEqual({ label: "Tamano", value: "1 unidad" });
    expect(client.productos[0].detalleImagenes[0].src).toBe("assets/producto-demo.webp");
    expect(client.productos[0].ordenRutina).toBe(1);
  });
});
