import { mkdir, mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { runFactoryBuild } from "./factory-build";

describe("runFactoryBuild", () => {
  it("runs the full intake -> profile -> design -> preview flow", async () => {
    const rootDir = await createFactoryFixture();

    const result = await runFactoryBuild({
      rootDir,
      input: "data/intakes/skincare-demo.json",
      force: true,
    });

    expect(result.slug).toBe("skincare-demo");
    expect(result.template).toBe("store");

    // profile + context produced from intake
    const profile = JSON.parse(await readFile(result.profilePath as string, "utf8"));
    expect(profile.nombre).toBe("Luma Skin Demo");
    expect((await stat(result.contextPath as string)).isFile()).toBe(true);

    // design recipe produced
    const design = JSON.parse(await readFile(result.designJsonPath, "utf8"));
    expect(design.schemaVersion).toBe("web-factory-auto-design-v1");
    expect((await stat(result.designMarkdownPath)).isFile()).toBe(true);

    // static preview produced
    const indexHtml = await readFile(path.join(result.outputDir as string, "index.html"), "utf8");
    expect(indexHtml).toContain("Luma Skin Demo");
    expect(result.files).toContain(path.join(result.outputDir as string, "index.html"));
  });

  it("dry-run validates and returns paths without writing a preview", async () => {
    const rootDir = await createFactoryFixture();

    const result = await runFactoryBuild({
      rootDir,
      input: "data/intakes/skincare-demo.json",
      force: true,
      dryRun: true,
    });

    expect(result.outputDir).toBeUndefined();
    expect(result.files).toEqual([]);
    expect(result.designJsonPath).toContain("skincare-demo.design.json");
    expect(result.warnings.join(" ")).toContain("dry-run desde intake");

    // dry-run from intake must not write the profile, design recipe or preview
    await expect(stat(path.join(rootDir, "data", "clients", "skincare-demo.json"))).rejects.toThrow();
    await expect(stat(path.join(rootDir, "data", "clients", "skincare-demo.design.json"))).rejects.toThrow();
    await expect(stat(path.join(rootDir, "out", "skincare-demo"))).rejects.toThrow();
  });

  it("requires a slug or intake input", async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), "onia-factory-build-empty-"));
    await expect(runFactoryBuild({ rootDir })).rejects.toThrow("Provide a slug");
  });
});

async function createFactoryFixture(): Promise<string> {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "onia-factory-build-"));
  await mkdir(path.join(rootDir, "data", "intakes"), { recursive: true });
  await mkdir(path.join(rootDir, "data", "references", "design-sources"), { recursive: true });
  await mkdir(path.join(rootDir, "data", "references", "code-sources"), { recursive: true });

  await writeFile(
    path.join(rootDir, "data", "intakes", "skincare-demo.json"),
    JSON.stringify({
      project: { slug: "skincare-demo", template: "store" },
      business: {
        name: "Luma Skin Demo",
        industry: "skincare",
        offer: "cuidado de piel simple",
        description: "Tienda de cuidado de piel con productos claros, rutinas y consulta directa.",
      },
      brand: {
        references: [
          {
            title: "Glossier",
            url: "https://www.glossier.com",
            type: "visual",
            use: "claridad de producto",
            avoid: "copiar identidad",
          },
        ],
      },
      catalog: {
        categories: ["Serum"],
        products: [
          {
            title: "Serum demo",
            category: "Serum",
            price: "Bs. 150",
            description: "Serum de prueba para rutina diaria.",
          },
        ],
      },
      conversion: { primaryCtaText: "Comprar" },
      contact: { whatsapp: "+59170000000" },
    }),
    "utf8",
  );

  await writeFile(
    path.join(rootDir, "data", "references", "design-sources", "latest-design-intelligence.json"),
    JSON.stringify({
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
      globalSignals: { topFonts: [{ value: "Inter Variable", count: 2 }] },
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
            desktop: { path: "C:/shots/skincare/desktop.png", sha256: "desktop-hash", mode: "viewport" },
            mobile: { path: "C:/shots/skincare/mobile.png", sha256: "mobile-hash", mode: "viewport" },
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
    }),
    "utf8",
  );

  await writeFile(
    path.join(rootDir, "data", "references", "code-sources", "latest-component-code-examples.json"),
    JSON.stringify({
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
          ],
        },
      ],
    }),
    "utf8",
  );

  return rootDir;
}
