import { describe, expect, it } from "vitest";
import { clientSchema } from "./schema";

describe("clientSchema", () => {
  it("applies sensible defaults to a minimal client", () => {
    const client = clientSchema.parse({ nombre: "Demo", slug: "demo" });

    expect(client.colores.primary).toBe("#0f766e");
    expect(client.tipografia.heading).toBe("Inter");
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

describe("clientSchema clinic fields", () => {
  it("parses credenciales, proceso and faq when present", () => {
    const parsed = clientSchema.parse({
      nombre: "Aura",
      slug: "aura",
      tagline: "Sonrisas sanas",
      descripcion: "Clinica dental.",
      credenciales: ["Matricula profesional"],
      proceso: [{ titulo: "Agenda", desc: "Escribinos por WhatsApp." }],
      faq: [{ pregunta: "Duele?", respuesta: "Trabajamos con anestesia." }],
    });
    expect(parsed.credenciales).toEqual(["Matricula profesional"]);
    expect(parsed.proceso[0].titulo).toBe("Agenda");
    expect(parsed.faq[0].pregunta).toBe("Duele?");
  });

  it("defaults the clinic fields to empty arrays when absent", () => {
    const parsed = clientSchema.parse({
      nombre: "Aura",
      slug: "aura",
      tagline: "Sonrisas sanas",
      descripcion: "Clinica dental.",
    });
    expect(parsed.credenciales).toEqual([]);
    expect(parsed.proceso).toEqual([]);
    expect(parsed.faq).toEqual([]);
  });
});

describe("clientSchema dashboard heroPanel", () => {
  it("parses a metric-trend heroPanel", () => {
    const parsed = clientSchema.parse({
      nombre: "Panel", slug: "panel", tagline: "t", descripcion: "d",
      dashboard: {
        heroPanel: {
          kind: "metric-trend",
          kpi: { label: "Ingresos", value: "Bs. 48.2k", delta: "12%", trend: "up", context: "vs mes anterior" },
          points: [{ label: "Ene", value: 10 }, { label: "Feb", value: 12 }],
        },
      },
    });
    expect(parsed.dashboard.heroPanel?.kind).toBe("metric-trend");
  });

  it("parses a queue heroPanel", () => {
    const parsed = clientSchema.parse({
      nombre: "Panel", slug: "panel", tagline: "t", descripcion: "d",
      dashboard: {
        heroPanel: {
          kind: "queue",
          title: "Para hoy",
          items: [{ titulo: "Turno 10:00", estado: "pendiente", meta: "Hoy 10:00" }],
        },
      },
    });
    expect(parsed.dashboard.heroPanel?.kind).toBe("queue");
  });

  it("defaults heroPanel to undefined when absent", () => {
    const parsed = clientSchema.parse({ nombre: "Panel", slug: "panel", tagline: "t", descripcion: "d" });
    expect(parsed.dashboard.heroPanel).toBeUndefined();
  });
});

describe("clientSchema dashboard table cells and filtros", () => {
  it("accepts plain string cells (backward compatible)", () => {
    const parsed = clientSchema.parse({
      nombre: "Panel", slug: "panel", tagline: "t", descripcion: "d",
      dashboard: { table: { title: "Pedidos", columns: ["Pedido", "Estado"], rows: [["#1", "Pagado"]] } },
    });
    expect(parsed.dashboard.table.rows[0][1]).toBe("Pagado");
  });

  it("accepts rich status cells", () => {
    const parsed = clientSchema.parse({
      nombre: "Panel", slug: "panel", tagline: "t", descripcion: "d",
      dashboard: {
        table: {
          title: "Pedidos",
          columns: ["Pedido", "Estado"],
          rows: [["#1", { value: "Pagado", status: "pos" }]],
          filtros: ["Estado", "Fecha"],
        },
      },
    });
    const cell = parsed.dashboard.table.rows[0][1];
    expect(typeof cell === "object" ? cell.value : cell).toBe("Pagado");
    expect(parsed.dashboard.table.filtros).toEqual(["Estado", "Fecha"]);
  });
});

describe("clientSchema dashboard sidePanel", () => {
  it("parses a sidePanel with list items", () => {
    const parsed = clientSchema.parse({
      nombre: "Panel", slug: "panel", tagline: "t", descripcion: "d",
      dashboard: {
        sidePanel: {
          title: "Aprobaciones recientes",
          items: [{ label: "Maria Lopez", value: "Aprobado", initial: "ML" }],
        },
      },
    });
    expect(parsed.dashboard.sidePanel?.items[0].label).toBe("Maria Lopez");
  });

  it("defaults sidePanel to undefined when absent", () => {
    const parsed = clientSchema.parse({ nombre: "Panel", slug: "panel", tagline: "t", descripcion: "d" });
    expect(parsed.dashboard.sidePanel).toBeUndefined();
  });
});

describe("clientSchema dashboard showStatesReference", () => {
  it("defaults showStatesReference to false", () => {
    const parsed = clientSchema.parse({ nombre: "Panel", slug: "panel", tagline: "t", descripcion: "d" });
    expect(parsed.dashboard.showStatesReference).toBe(false);
  });

  it("accepts showStatesReference: true", () => {
    const parsed = clientSchema.parse({
      nombre: "Panel", slug: "panel", tagline: "t", descripcion: "d",
      dashboard: { showStatesReference: true },
    });
    expect(parsed.dashboard.showStatesReference).toBe(true);
  });
});

describe("clientSchema dashboard grouped nav", () => {
  it("accepts a flat string nav (backward compatible)", () => {
    const parsed = clientSchema.parse({
      nombre: "Panel", slug: "panel", tagline: "t", descripcion: "d",
      dashboard: { nav: ["Resumen", "Ventas"] },
    });
    expect(parsed.dashboard.nav).toEqual(["Resumen", "Ventas"]);
  });

  it("accepts a grouped nav shape", () => {
    const parsed = clientSchema.parse({
      nombre: "Panel", slug: "panel", tagline: "t", descripcion: "d",
      dashboard: {
        nav: [
          { group: "Hoy", items: ["Resumen"] },
          { group: "Trabajo", items: ["Aprobaciones", "Tareas"] },
        ],
      },
    });
    expect(Array.isArray(parsed.dashboard.nav)).toBe(true);
  });
});

describe("clientSchema realty fields", () => {
  it("parses listings, zonas and wordmarkBreak when present", () => {
    const parsed = clientSchema.parse({
      nombre: "Terra Propiedades",
      slug: "terra",
      tagline: "Encontra tu proximo lugar",
      descripcion: "Agencia inmobiliaria.",
      wordmarkBreak: "TERRA",
      zonas: ["Zona Sur", "Centro"],
      listings: [
        {
          titulo: "Casa 3 dormitorios en Zona Sur",
          precio: "USD 145.000",
          zona: "Zona Sur",
          tipo: "Casa",
          operacion: "venta",
          dormitorios: 3,
          banos: 2,
          imagen: "assets/listing-1.webp",
          imagenAlt: "Fachada de casa en Zona Sur",
          destacado: true,
        },
      ],
    });
    expect(parsed.wordmarkBreak).toBe("TERRA");
    expect(parsed.zonas).toEqual(["Zona Sur", "Centro"]);
    expect(parsed.listings[0].operacion).toBe("venta");
    expect(parsed.listings[0].destacado).toBe(true);
  });

  it("defaults realty fields to empty when absent", () => {
    const parsed = clientSchema.parse({
      nombre: "Terra Propiedades",
      slug: "terra",
      tagline: "t",
      descripcion: "d",
    });
    expect(parsed.wordmarkBreak).toBe("");
    expect(parsed.zonas).toEqual([]);
    expect(parsed.listings).toEqual([]);
  });

  it("defaults listing operacion to venta and destacado to false", () => {
    const parsed = clientSchema.parse({
      nombre: "Terra Propiedades",
      slug: "terra",
      tagline: "t",
      descripcion: "d",
      listings: [
        { titulo: "Depto", precio: "USD 80.000", zona: "Centro", tipo: "Departamento" },
      ],
    });
    expect(parsed.listings[0].operacion).toBe("venta");
    expect(parsed.listings[0].destacado).toBe(false);
  });
});
