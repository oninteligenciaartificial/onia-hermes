import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildAutoDesignRecipe, renderAutoDesignMarkdown, writeAutoDesignRecipe } from "./auto-designer";

describe("auto designer", () => {
  it("builds a vertical design recipe from client data, screenshots and allowed code", async () => {
    const rootDir = await createAutoDesignFixture();

    const recipe = await buildAutoDesignRecipe("skincare-demo", {
      rootDir,
      now: new Date("2026-06-25T12:00:00.000Z"),
    });

    expect(recipe.client.inferredVertical).toBe("skincare-ecommerce");
    expect(recipe.client.template).toBe("store");
    expect(recipe.selectedReferences.some((reference) => reference.screenshots.desktop?.path.includes("desktop.png"))).toBe(
      true,
    );
    expect(recipe.selectedReferences.some((reference) => reference.sourceName === "Glossier")).toBe(true);
    expect(recipe.codeReferences).toHaveLength(2);
    expect(recipe.codeReferences.every((reference) => reference.status === "allowed-after-review")).toBe(true);
    expect(recipe.codeReferences.some((reference) => reference.file.includes("product-card"))).toBe(true);
    expect(recipe.antiGenericGuardrails.join(" ")).toContain("No copiar identidad");
    expect(recipe.mediaPlan.generationRequests.join(" ")).toContain("Serum demo");
  });

  it("infers the dashboard-analytics vertical for a panel/KPI client", async () => {
    const rootDir = await createAutoDesignFixture();

    await writeFile(
      path.join(rootDir, "data", "clients", "ops-panel-demo.json"),
      JSON.stringify(
        {
          nombre: "Panel Operativo Demo",
          slug: "ops-panel-demo",
          tagline: "Tablero de control con KPIs y reportes en tiempo real",
          descripcion:
            "Panel administrativo con metricas, graficos y tabla operativa para monitoreo y business intelligence del negocio.",
          referencias: [
            {
              title: "Tremor",
              url: "https://www.tremor.so",
              type: "visual",
              use: "jerarquia de KPI y graficos",
              avoid: "copiar identidad",
            },
          ],
        },
        null,
        2,
      ),
      "utf8",
    );
    await writeFile(
      path.join(rootDir, "data", "clients", "ops-panel-demo.context.md"),
      "# Context\n\nRubro: dashboard analytics interno.\n",
      "utf8",
    );

    const recipe = await buildAutoDesignRecipe("ops-panel-demo", {
      rootDir,
      now: new Date("2026-07-03T12:00:00.000Z"),
    });

    expect(recipe.client.inferredVertical).toBe("dashboard-analytics");
    expect(recipe.client.matchedKeywords).toEqual(expect.arrayContaining(["dashboard", "kpi", "metricas"]));
    expect(recipe.sectionPlan.some((section) => section.id === "kpi-overview")).toBe(true);
  });

  it("surfaces Tremor components and a per-section map for a dashboard recipe", async () => {
    const rootDir = await createAutoDesignFixture();

    await writeFile(
      path.join(rootDir, "data", "references", "code-sources", "latest-component-code-examples.json"),
      JSON.stringify({
        capturedAt: "2026-07-03T00:00:00.000Z",
        repositories: [
          {
            name: "tremorlabs__tremor",
            localPath: "C:/repos/tremor",
            license: "MIT",
            status: "allowed-after-review",
            examples: [
              {
                relativePath: "src/components/AreaChart/AreaChart.tsx",
                sha256: "area",
                sample: "export function AreaChart() { return <div />; }",
                signals: { type: "react-component", hasTailwind: true, exports: ["AreaChart"] },
              },
              {
                relativePath: "src/components/Badge/Badge.tsx",
                sha256: "badge",
                sample: "export function Badge() { return <span />; }",
                signals: { type: "react-component", hasTailwind: true, exports: ["Badge"] },
              },
            ],
          },
          {
            name: "shadcn-ui__ui",
            localPath: "C:/repos/shadcn",
            license: "MIT",
            status: "allowed-after-review",
            examples: [
              {
                relativePath: "blocks/dashboard-01/components/data-table.tsx",
                sha256: "dt",
                sample: "export function DataTable() { return <table />; }",
                signals: { type: "react-component", hasTailwind: true, hasShadcn: true, exports: ["DataTable"] },
              },
            ],
          },
        ],
      }),
      "utf8",
    );

    await writeFile(
      path.join(rootDir, "data", "clients", "ops-panel-demo.json"),
      JSON.stringify({
        nombre: "Panel Operativo Demo",
        slug: "ops-panel-demo",
        tagline: "Tablero con KPIs, graficos y reportes",
        descripcion: "Panel administrativo con metricas, graficos y tabla operativa para dashboard analytics.",
      }),
      "utf8",
    );
    await writeFile(
      path.join(rootDir, "data", "clients", "ops-panel-demo.context.md"),
      "# Context\n\nRubro: dashboard analytics.\n",
      "utf8",
    );

    const recipe = await buildAutoDesignRecipe("ops-panel-demo", {
      rootDir,
      now: new Date("2026-07-04T12:00:00.000Z"),
    });

    expect(recipe.client.inferredVertical).toBe("dashboard-analytics");
    // Tremor is boosted for dashboards, so it leads the code references.
    expect(recipe.codeReferences[0].repo).toBe("tremorlabs__tremor");
    expect(recipe.codeReferences.some((code) => code.file.includes("AreaChart"))).toBe(true);

    const markdown = renderAutoDesignMarkdown(recipe);
    expect(markdown).toContain("## Componentes De Dashboard Sugeridos");
    expect(markdown).toContain("AreaChart");
    expect(markdown).toContain("data-table");
  });

  it("writes json and markdown recipes without overwriting unless forced", async () => {
    const rootDir = await createAutoDesignFixture();

    const result = await writeAutoDesignRecipe("skincare-demo", {
      rootDir,
      now: new Date("2026-06-25T12:00:00.000Z"),
    });

    const json = JSON.parse(await readFile(result.jsonPath, "utf8"));
    const markdown = await readFile(result.markdownPath, "utf8");

    expect(json.schemaVersion).toBe("web-factory-auto-design-v1");
    expect(markdown).toContain("Auto Design Recipe - Luma Skin Demo");

    await expect(writeAutoDesignRecipe("skincare-demo", { rootDir })).rejects.toThrow("already exists");

    await expect(writeAutoDesignRecipe("skincare-demo", { rootDir, force: true })).resolves.toMatchObject({
      slug: "skincare-demo",
    });
  });
});

async function createAutoDesignFixture(): Promise<string> {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "onia-auto-design-"));
  await mkdir(path.join(rootDir, "data", "clients"), { recursive: true });
  await mkdir(path.join(rootDir, "data", "references", "design-sources"), { recursive: true });
  await mkdir(path.join(rootDir, "data", "references", "code-sources"), { recursive: true });

  await writeFile(
    path.join(rootDir, "data", "clients", "skincare-demo.json"),
    JSON.stringify(
      {
        nombre: "Luma Skin Demo",
        slug: "skincare-demo",
        tagline: "Skincare simple para comprar mejor",
        descripcion: "Tienda de cuidado de piel enfocada en productos claros, rutinas y consulta directa.",
        categorias: ["Serum", "Proteccion"],
        productos: [
          {
            titulo: "Serum demo",
            categoria: "Serum",
            precio: "Bs. 150",
            desc: "Serum de prueba para rutina diaria.",
          },
        ],
        referencias: [
          {
            title: "Glossier",
            url: "https://www.glossier.com",
            type: "visual",
            use: "claridad de producto",
            avoid: "copiar identidad",
          },
        ],
      },
      null,
      2,
    ),
    "utf8",
  );

  await writeFile(
    path.join(rootDir, "data", "clients", "skincare-demo.context.md"),
    "# Context\n\nRubro: skincare ecommerce.\n",
    "utf8",
  );

  await writeFile(
    path.join(rootDir, "data", "references", "design-sources", "latest-design-intelligence.json"),
    JSON.stringify(
      {
        generatedAt: "2026-06-25T00:00:00.000Z",
        sourceSummaries: [
          {
            id: "lapa-ninja",
            name: "Lapa Ninja",
            mode: "landing-gallery",
            licenseStatus: "inspiration-only",
            screenshots: 2,
          },
        ],
        globalSignals: {
          topFonts: [{ value: "Inter Variable", count: 2 }],
        },
        topExamples: [
          {
            sourceId: "lapa-ninja",
            sourceName: "Lapa Ninja",
            licenseStatus: "inspiration-only",
            url: "https://www.lapa.ninja/post/skincare-shop",
            title: "Skincare ecommerce landing",
            description: "Beauty product shop with clear CTAs",
            reuseGuidance: "Study structure only",
            screenshots: {
              desktop: {
                path: "C:/shots/skincare/desktop.png",
                sha256: "desktop-hash",
                mode: "viewport",
              },
              mobile: {
                path: "C:/shots/skincare/mobile.png",
                sha256: "mobile-hash",
                mode: "viewport",
              },
            },
            headings: ["Skincare shop"],
            ctas: ["Shop now"],
            topFonts: ["Inter Variable"],
            animationSignals: ["scroll reveal"],
            codeLinks: [{ url: "https://github.com/example/skincare-ui", text: "GitHub" }],
            codeBlockCount: 1,
            qualityWarnings: [],
          },
        ],
      },
      null,
      2,
    ),
    "utf8",
  );

  await writeFile(
    path.join(rootDir, "data", "references", "code-sources", "latest-component-code-examples.json"),
    JSON.stringify(
      {
        capturedAt: "2026-06-25T00:00:00.000Z",
        repositories: [
          {
            name: "example__shop-ui",
            localPath: "C:/repos/example__shop-ui",
            license: "MIT",
            status: "allowed-after-review",
            examples: [
              {
                relativePath: "components/product-card.tsx",
                sha256: "product-card-hash",
                sample: "export function ProductCard() { return <article />; }",
                signals: {
                  type: "react-component",
                  hasTailwind: true,
                  hasMotion: false,
                  hasShadcn: true,
                  imports: ["react"],
                  exports: ["ProductCard"],
                },
              },
              {
                relativePath: "components/cart-drawer.tsx",
                sha256: "cart-drawer-hash",
                sample: "export function CartDrawer() { return <aside />; }",
                signals: {
                  type: "react-component",
                  hasTailwind: true,
                  hasMotion: true,
                  hasShadcn: false,
                  imports: ["framer-motion"],
                  exports: ["CartDrawer"],
                },
              },
            ],
          },
          {
            name: "example__noncommercial",
            localPath: "C:/repos/example__noncommercial",
            license: "PolyForm Noncommercial",
            status: "study-only",
            examples: [
              {
                relativePath: "components/blocked.tsx",
                sha256: "blocked-hash",
                sample: "do not use",
                signals: { type: "react-component" },
              },
            ],
          },
        ],
      },
      null,
      2,
    ),
    "utf8",
  );

  return rootDir;
}
