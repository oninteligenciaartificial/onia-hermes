import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { generateSite, parseSlug } from "./generate";

describe("generateSite", () => {
  it("creates a tokenized static site for a valid client", async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), "onia-web-factory-"));
    await mkdir(path.join(rootDir, "data", "clients"), { recursive: true });

    await writeFile(
      path.join(rootDir, "data", "clients", "demo.json"),
      JSON.stringify({
        nombre: "Demo Co",
        slug: "demo",
        tagline: "Demo tagline",
        descripcion: "Demo description",
      }),
      "utf8",
    );
    await writeFile(
      path.join(rootDir, "data", "clients", "demo.design.json"),
      JSON.stringify({ schemaVersion: "web-factory-auto-design-v1" }),
      "utf8",
    );
    await writeFile(
      path.join(rootDir, "data", "clients", "demo.design.md"),
      "# Demo design\n",
      "utf8",
    );

    const result = await generateSite("demo", { rootDir });
    const html = await readFile(path.join(result.outputDir, "index.html"), "utf8");
    const css = await readFile(path.join(result.outputDir, "site.css"), "utf8");
    const design = await readFile(path.join(result.outputDir, "demo.design.md"), "utf8");

    expect(html).toContain("Demo tagline");
    expect(html).toContain("./site.css");
    expect(css).toContain("--color-primary");
    expect(css).toContain(".wf-hero");
    expect(design).toContain("Demo design");
    expect(result.files).toContain(path.join(result.outputDir, "demo.design.json"));
    expect(result.files).toContain(path.join(result.outputDir, "demo.design.md"));
  });

  it("rejects unsafe slugs", () => {
    expect(() => parseSlug("../demo")).toThrow();
    expect(() => parseSlug("Demo")).toThrow();
  });

  it("creates a static store site when requested", async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), "onia-web-factory-"));
    await mkdir(path.join(rootDir, "data", "clients"), { recursive: true });

    await writeFile(
      path.join(rootDir, "data", "clients", "store.json"),
      JSON.stringify({
        nombre: "Store Co",
        slug: "store",
        tagline: "Todo en una tienda",
        descripcion: "Catalogo multiproducto.",
        cta: { texto: "Ver catalogo", url: "#catalogo" },
        categorias: ["Tecnologia"],
        productos: [
          {
            titulo: "Audifonos demo",
            categoria: "Tecnologia",
            precio: "Desde Bs. 100",
            desc: "Producto de prueba.",
            imagen: "assets/audifonos-demo.webp",
            imagenAlt: "Audifonos demo",
            incluye: ["Caja", "Cable de carga"],
            especificaciones: [{ label: "Bateria", value: "24 horas" }],
            detalleImagenes: [{ src: "assets/audifonos-demo.webp", label: "Packshot" }],
          },
        ],
        heroVideo: "assets/store-hero.mp4",
        heroPoster: "assets/store-hero.webp",
      }),
      "utf8",
    );

    const result = await generateSite("store", { rootDir, template: "store" });
    const html = await readFile(path.join(result.outputDir, "index.html"), "utf8");
    const productHtml = await readFile(
      path.join(result.outputDir, "productos", "audifonos-demo", "index.html"),
      "utf8",
    );
    const css = await readFile(path.join(result.outputDir, "site.css"), "utf8");

    expect(html).toContain("ELIGE, CONSULTA Y COMPRA CON ASISTENCIA");
    expect(html).toContain("productos destacados del mes");
    expect(html).toContain("10% de descuento");
    expect(html).toContain("store-cart-data");
    expect(html).toContain("data-store-hero-video");
    expect(html).toContain('preload="none"');
    expect(html).toContain('poster="assets/store-hero.webp"');
    expect(html).toContain('data-src="assets/store-hero.mp4"');
    expect(html).not.toContain('class="store-hero-video" src="assets/store-hero.mp4"');
    expect(html).toContain("data-cart-open");
    expect(html).toContain("data-cart-add=\"audifonos-demo\"");
    expect(html).toContain("tu carrito");
    expect(html).toContain("localStorage");
    expect(html).toContain("UN SOLO LUGAR PARA ELEGIR PRODUCTOS");
    expect(html).toContain("GUIA DE COMPRA");
    expect(html).not.toContain("MARCAS ACTIVAS");
    expect(html).not.toContain("RUTINA CORTA");
    expect(html).not.toContain("QUE TRAE Y COMO ELEGIRLO");
    expect(html).not.toContain("Cable de carga");
    expect(html).toContain('href="productos/audifonos-demo/"');
    expect(html).toContain("Audifonos demo");
    expect(productHtml).toContain("Detalles");
    expect(productHtml).toContain("agregar al carrito");
    expect(productHtml).toContain("data-cart-add=\"audifonos-demo\"");
    expect(productHtml).toContain("tu carrito");
    expect(productHtml).toContain("Caracteristicas");
    expect(productHtml).toContain("Indicaciones");
    expect(productHtml).toContain("Cable de carga");
    expect(productHtml).toContain("Bateria");
    expect(productHtml).toContain('href="../../site.css');
    expect(productHtml).toContain('src="../../assets/audifonos-demo.webp"');
    expect(productHtml).not.toContain("Que trae");
    expect(productHtml).not.toContain("store-detail-card");
    expect(productHtml).not.toContain("OTROS PRODUCTOS DISPONIBLES");
    expect(productHtml).not.toContain("UBICA ESTE PRODUCTO EN LA RUTINA");
    expect(productHtml).not.toContain(">DESCUENTOS<");
    expect(productHtml).not.toContain(">FAQ<");
    expect(result.files).toContain(path.join(result.outputDir, "productos", "audifonos-demo", "index.html"));
    expect(css).toContain(".store-catalog-tools");
    expect(css).toContain(".store-guide");
    expect(css).not.toContain(".store-brand-grid");
    expect(css).toContain(".store-product-accordions");
    expect(css).toContain(".store-product-price-panel");
    expect(css).toContain(".store-product-page-hero");
    expect(css).toContain("storeProductFloat");
    expect(css).toContain(".store-product-grid");
    expect(css).toContain(".store-subscribe");
  });

  it("creates a static dashboard site when requested", async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), "onia-web-factory-"));
    await mkdir(path.join(rootDir, "data", "clients"), { recursive: true });

    await writeFile(
      path.join(rootDir, "data", "clients", "panel.json"),
      JSON.stringify({
        nombre: "Panel Demo",
        slug: "panel",
        tagline: "Panel de control demo",
        descripcion: "Dashboard de ejemplo.",
        cta: { texto: "Exportar", url: "#top" },
        dashboard: {
          title: "Panel operativo",
          subtitle: "Resumen de ejemplo",
          nav: ["Resumen", "Ventas"],
          filters: ["7 dias", "30 dias"],
          kpis: [{ label: "Ingresos", value: "Bs. 48.2k", delta: "12%", trend: "up", context: "vs anterior" }],
          charts: [
            { title: "Ingresos por mes", unit: "Bs.", type: "bar", points: [{ label: "Ene", value: 32 }, { label: "Feb", value: 41 }] },
            { title: "Sesiones", unit: "n", type: "line", points: [{ label: "L", value: 120 }, { label: "M", value: 162 }] },
          ],
          table: {
            title: "Ultimos pedidos",
            columns: ["Pedido", "Monto"],
            rows: [["#1042", "Bs. 1.240"]],
          },
        },
      }),
      "utf8",
    );

    const result = await generateSite("panel", { rootDir, template: "dashboard" });
    const html = await readFile(path.join(result.outputDir, "index.html"), "utf8");
    const css = await readFile(path.join(result.outputDir, "site.css"), "utf8");

    expect(html).toContain("wf-dash");
    expect(html).toContain("Panel operativo");
    expect(html).toContain("Bs. 48.2k");
    expect(html).toContain("wf-kpi-delta--up");
    expect(html).toContain('<svg class="wf-chart"');
    expect(html).toContain("<polyline");
    expect(html).toContain("<rect");
    expect(html).toContain("Ultimos pedidos");
    expect(html).toContain("#1042");
    expect(html).toContain("data-dash-filter");
    expect(css).toContain(".wf-dash-kpis");
    expect(css).toContain(".wf-chart");
    expect(css).toContain("--color-primary");
  });

  it("renders dashboard empty states when data is missing", async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), "onia-web-factory-"));
    await mkdir(path.join(rootDir, "data", "clients"), { recursive: true });

    await writeFile(
      path.join(rootDir, "data", "clients", "empty-panel.json"),
      JSON.stringify({
        nombre: "Empty Panel",
        slug: "empty-panel",
        tagline: "Panel sin datos",
        descripcion: "Dashboard sin metricas cargadas.",
        dashboard: { title: "Panel vacio", table: { title: "Detalle", columns: ["A"], rows: [] } },
      }),
      "utf8",
    );

    const result = await generateSite("empty-panel", { rootDir, template: "dashboard" });
    const html = await readFile(path.join(result.outputDir, "index.html"), "utf8");

    expect(html).toContain("wf-dash-empty");
    expect(html).toContain("Sin KPIs definidos");
    expect(html).toContain("Sin registros para el periodo seleccionado.");
  });
});
