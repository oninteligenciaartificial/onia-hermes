import { describe, expect, it } from "vitest";
import {
  buildClientContextMarkdown,
  buildClientProfileFromIntake,
  getMissingClientInputs,
  webFactoryIntakeSchema,
} from "./intake-schema";

describe("webFactoryIntakeSchema", () => {
  it("builds a client profile from key business data and references", () => {
    const intake = webFactoryIntakeSchema.parse({
      project: { slug: "demo-clinic", template: "landing" },
      business: {
        name: "Clinica Demo",
        industry: "salud",
        offer: "consultas odontologicas claras",
      },
      brand: {
        references: [
          {
            title: "Referencia visual",
            url: "https://example.com",
            use: "jerarquia limpia y CTA directo",
          },
        ],
      },
      media: {
        heroPoster: "assets/clinica-demo.webp",
      },
      contact: {
        whatsapp: "+59170000000",
      },
    });

    const client = buildClientProfileFromIntake(intake);

    expect(client.slug).toBe("demo-clinic");
    expect(client.nombre).toBe("Clinica Demo");
    expect(client.tagline).toBe("consultas odontologicas claras");
    expect(client.heroPoster).toBe("assets/clinica-demo.webp");
    expect(client.referencias[0].use).toContain("CTA");
    expect(client.cta.url).toContain("https://wa.me/59170000000");
    expect(client.servicios).toHaveLength(3);
  });

  it("reports the missing inputs that block a professional delivery", () => {
    const missing = getMissingClientInputs({
      project: { slug: "store-demo", template: "store" },
      business: {
        name: "Store Demo",
        industry: "ecommerce",
        offer: "venta asistida",
      },
    });

    expect(missing).toContain("referencias visuales exactas");
    expect(missing).toContain("productos con precio/descripcion/imagen");
    expect(missing).toContain("metodos de pago y politicas comerciales");
  });

  it("maps dashboard data through the intake to the client profile", () => {
    const client = buildClientProfileFromIntake({
      project: { slug: "ops-panel", template: "dashboard" },
      business: {
        name: "Ops Panel",
        industry: "dashboard analytics interno",
        offer: "panel operativo con KPIs y reportes",
      },
      dashboard: {
        title: "Panel operativo",
        filters: ["7 dias", "30 dias"],
        kpis: [{ label: "Ingresos", value: "Bs. 48.2k", delta: "12%", trend: "up", context: "vs anterior" }],
        charts: [{ title: "Ingresos", type: "bar", points: [{ label: "Ene", value: 32 }] }],
        table: { title: "Pedidos", columns: ["Pedido", "Monto"], rows: [["#1042", "Bs. 1.240"]] },
      },
    });

    expect(client.dashboard.title).toBe("Panel operativo");
    expect(client.dashboard.kpis).toHaveLength(1);
    expect(client.dashboard.kpis[0].trend).toBe("up");
    expect(client.dashboard.charts[0].points[0].value).toBe(32);
    expect(client.dashboard.table.rows[0]).toEqual(["#1042", "Bs. 1.240"]);
  });

  it("flags missing dashboard metrics when a panel has no KPIs or charts", () => {
    const missing = getMissingClientInputs({
      project: { slug: "empty-panel", template: "dashboard" },
      business: { name: "Empty Panel", industry: "analytics", offer: "panel interno" },
    });

    expect(missing).toContain("metricas/KPIs o series de datos aprobadas para el panel");
  });

  it("keeps a context file with references and pending fields", () => {
    const context = buildClientContextMarkdown({
      project: { slug: "saas-demo", template: "landing", owner: "ONIA" },
      business: {
        name: "SaaS Demo",
        industry: "software",
        offer: "dashboard operativo",
      },
      brand: {
        references: [{ title: "Stripe", url: "https://stripe.com", type: "layout" }],
      },
    });

    expect(context).toContain("# SaaS Demo - Web Factory Context");
    expect(context).toContain("https://stripe.com");
    expect(context).toContain("Pendientes antes de entrega");
  });
});
