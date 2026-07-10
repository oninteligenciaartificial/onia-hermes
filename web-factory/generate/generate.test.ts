import { mkdir, mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
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

  it("self-hosts the Inter font next to every generated site", async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), "onia-web-factory-"));
    await mkdir(path.join(rootDir, "data", "clients"), { recursive: true });

    await writeFile(
      path.join(rootDir, "data", "clients", "mini.json"),
      JSON.stringify({
        nombre: "Mini Co",
        slug: "mini",
        tagline: "Mini tagline",
        descripcion: "Mini description",
        cta: { texto: "Hola", url: "#" },
      }),
      "utf8",
    );

    const result = await generateSite("mini", { rootDir, template: "landing" });
    const css = await readFile(path.join(result.outputDir, "site.css"), "utf8");
    const fontStat = await stat(path.join(result.outputDir, "fonts", "inter-latin-var.woff2"));

    // The @font-face resolves to a file the generator copied into the site.
    expect(css).toContain("@font-face");
    expect(css).toContain("./fonts/inter-latin-var.woff2");
    expect(fontStat.size).toBeGreaterThan(20000); // ~47kb variable woff2
  });

  it("creates a focus landing without nav and with a single CTA path", async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), "onia-web-factory-"));
    await mkdir(path.join(rootDir, "data", "clients"), { recursive: true });

    await writeFile(
      path.join(rootDir, "data", "clients", "focus.json"),
      JSON.stringify({
        nombre: "Focus Co",
        slug: "focus",
        tagline: "Reserva en un clic",
        descripcion: "Landing enfocada.",
        cta: { texto: "Agendar", url: "https://wa.me/59170000000" },
      }),
      "utf8",
    );

    const result = await generateSite("focus", { rootDir, template: "landing-focus" });
    const html = await readFile(path.join(result.outputDir, "index.html"), "utf8");

    // No navigation and no secondary CTA = fewer exits.
    expect(html).not.toContain("wf-nav");
    expect(html).not.toContain("wf-button-secondary");
    expect(html).not.toContain("Ver servicios");
    // Minimal brand + a repeated final CTA driving the single action.
    expect(html).toContain("wf-focus-brand");
    expect(html).toContain("wf-final-cta");
    expect((html.match(/wf-button-primary/g) ?? []).length).toBe(2);
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
            destacadoMes: true,
            descuentoPorcentaje: 15,
            precioPromocional: 85,
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
    expect(html).toContain("15% de descuento");
    expect(html).toContain("store-product-discount");
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
    expect(productHtml).toContain("precio - 15% off");
    expect(productHtml).toContain("Bs. 85");
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

  it("emits a --wf-warn token alongside --wf-pos/--wf-neg for status pills", async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), "onia-web-factory-"));
    await mkdir(path.join(rootDir, "data", "clients"), { recursive: true });

    await writeFile(
      path.join(rootDir, "data", "clients", "panel.json"),
      JSON.stringify({
        nombre: "Panel Demo",
        slug: "panel",
        tagline: "Panel de control demo",
        descripcion: "Dashboard de ejemplo.",
        dashboard: { title: "Panel" },
      }),
      "utf8",
    );

    const result = await generateSite("panel", { rootDir, template: "dashboard" });
    const css = await readFile(path.join(result.outputDir, "site.css"), "utf8");

    expect(css).toContain("--wf-warn:");
  });

  it("renders a queue heroPanel through the dashboard generator", async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), "onia-web-factory-"));
    await mkdir(path.join(rootDir, "data", "clients"), { recursive: true });

    await writeFile(
      path.join(rootDir, "data", "clients", "panel.json"),
      JSON.stringify({
        nombre: "Panel Demo",
        slug: "panel",
        tagline: "Panel de control demo",
        descripcion: "Dashboard de ejemplo.",
        dashboard: {
          title: "Panel operativo",
          heroPanel: {
            kind: "queue",
            title: "Para hoy",
            items: [{ titulo: "Aprobar presupuesto #204", estado: "urgente", meta: "Vence hoy" }],
          },
        },
      }),
      "utf8",
    );

    const result = await generateSite("panel", { rootDir, template: "dashboard" });
    const html = await readFile(path.join(result.outputDir, "index.html"), "utf8");
    const css = await readFile(path.join(result.outputDir, "site.css"), "utf8");

    expect(html).toContain("wf-dash-hero--queue");
    expect(html).toContain("Aprobar presupuesto #204");
    expect(css).toContain(".wf-dash-hero");
  });

  it("renders grouped nav with group headers", async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), "onia-web-factory-"));
    await mkdir(path.join(rootDir, "data", "clients"), { recursive: true });

    await writeFile(
      path.join(rootDir, "data", "clients", "panel.json"),
      JSON.stringify({
        nombre: "Panel Demo",
        slug: "panel",
        tagline: "Panel de control demo",
        descripcion: "Dashboard de ejemplo.",
        dashboard: {
          title: "Panel operativo",
          nav: [
            { group: "Hoy", items: ["Resumen"] },
            { group: "Trabajo", items: ["Aprobaciones", "Tareas"] },
          ],
        },
      }),
      "utf8",
    );

    const result = await generateSite("panel", { rootDir, template: "dashboard" });
    const html = await readFile(path.join(result.outputDir, "index.html"), "utf8");

    expect(html).toContain("wf-dash-nav-group");
    expect(html).toContain("Hoy");
    expect(html).toContain("Trabajo");
    expect(html).toContain("Aprobaciones");
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

  it("renders donut, sparkline and multi-series dashboard charts", async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), "onia-web-factory-"));
    await mkdir(path.join(rootDir, "data", "clients"), { recursive: true });

    await writeFile(
      path.join(rootDir, "data", "clients", "panel.json"),
      JSON.stringify({
        nombre: "Panel Demo",
        slug: "panel",
        tagline: "Panel demo",
        descripcion: "Dashboard con tipos de chart.",
        dashboard: {
          title: "Panel",
          charts: [
            { title: "Categorias", type: "donut", points: [{ label: "A", value: 60 }, { label: "B", value: 40 }] },
            { title: "Tendencia", type: "sparkline", points: [{ label: "1", value: 10 }, { label: "2", value: 30 }] },
            {
              title: "Real vs meta",
              type: "line",
              series: [
                { name: "Real", points: [{ label: "Ene", value: 20 }, { label: "Feb", value: 30 }] },
                { name: "Meta", points: [{ label: "Ene", value: 25 }, { label: "Feb", value: 28 }] },
              ],
            },
          ],
        },
      }),
      "utf8",
    );

    const result = await generateSite("panel", { rootDir, template: "dashboard" });
    const html = await readFile(path.join(result.outputDir, "index.html"), "utf8");

    expect(html).toContain("wf-donut");
    expect(html).toContain("wf-sparkline");
    expect(html).toContain("wf-chart-legend"); // multi-series + donut legends
    expect(html).toContain("stroke-dasharray"); // donut arc segments
    // multi-series line draws one polyline per series, plus the sparkline
    expect((html.match(/<polyline/g) ?? []).length).toBeGreaterThanOrEqual(3);
  });

  it("creates a clinic landing with trust, process, faq and sticky cta", async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), "onia-web-factory-"));
    await mkdir(path.join(rootDir, "data", "clients"), { recursive: true });

    await writeFile(
      path.join(rootDir, "data", "clients", "clinic.json"),
      JSON.stringify({
        nombre: "Clinica Dental Aura",
        slug: "clinic",
        tagline: "Sonrisas sanas, sin miedo al dentista",
        descripcion: "Clinica dental con atencion clara y reserva directa.",
        cta: { texto: "Agendar cita", url: "https://wa.me/59170000000" },
        credenciales: ["Matricula profesional", "Esterilizacion certificada"],
        proceso: [
          { titulo: "Agenda", desc: "Escribinos por WhatsApp." },
          { titulo: "Evaluacion", desc: "Revisamos tu caso." },
        ],
        faq: [{ pregunta: "Duele?", respuesta: "Trabajamos con anestesia local." }],
      }),
      "utf8",
    );

    const result = await generateSite("clinic", { rootDir, template: "landing-clinic" });
    const html = await readFile(path.join(result.outputDir, "index.html"), "utf8");
    const css = await readFile(path.join(result.outputDir, "site.css"), "utf8");

    expect(html).toContain("wf-clinic-hero");
    expect(html).toContain("Matricula profesional");
    expect(html).toContain("wf-clinic-bento");
    expect(html).toContain("wf-clinic-timeline");
    expect(html).toContain("wf-clinic-faq");
    expect(html).toContain("<details");
    expect(html).toContain("wf-sticky-cta");
    expect(html).toContain("wf-clinic-final");
    expect(html).toContain("data-reveal");
    expect(html).not.toContain("wf-nav");
    expect(css).toContain(".wf-sticky-cta");
    expect(css).toContain(".wf-clinic-bento");
  });

  it("creates a realty landing with hero search, wordmark break, listings and zones", async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), "onia-web-factory-"));
    await mkdir(path.join(rootDir, "data", "clients"), { recursive: true });

    await writeFile(
      path.join(rootDir, "data", "clients", "terra.json"),
      JSON.stringify({
        nombre: "Terra Propiedades",
        slug: "terra",
        tagline: "Encontra tu proximo lugar",
        descripcion: "Agencia inmobiliaria con presencia en toda la ciudad.",
        cta: { texto: "Consultar por WhatsApp", url: "https://wa.me/59170000000" },
        wordmarkBreak: "TERRA",
        zonas: ["Zona Sur", "Centro", "Norte"],
        listings: [
          { titulo: "Casa Zona Sur", precio: "USD 145.000", zona: "Zona Sur", tipo: "Casa", operacion: "venta", dormitorios: 3, banos: 2, destacado: true },
          { titulo: "Depto Centro", precio: "USD 80.000", zona: "Centro", tipo: "Departamento", operacion: "venta", dormitorios: 2, banos: 1 },
        ],
      }),
      "utf8",
    );

    const result = await generateSite("terra", { rootDir, template: "landing-realty" });
    const html = await readFile(path.join(result.outputDir, "index.html"), "utf8");
    const css = await readFile(path.join(result.outputDir, "site.css"), "utf8");

    expect(html).toContain("wf-realty-hero");
    expect(html).toContain("wf-realty-search");
    expect(html).toContain("wf-realty-wordmark");
    expect(html).toContain("TERRA");
    expect(html).toContain("wf-realty-listing--featured");
    expect(html).toContain("Casa Zona Sur");
    expect(html).toContain("Zona Sur");
    expect(html).toContain("wf-realty-zone-chip");
    expect(css).toContain(".wf-realty-hero");
    expect(css).toContain(".wf-realty-listing-card");
  });
});
