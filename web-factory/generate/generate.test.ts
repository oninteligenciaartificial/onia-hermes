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

    const result = await generateSite("demo", { rootDir });
    const html = await readFile(path.join(result.outputDir, "index.html"), "utf8");
    const css = await readFile(path.join(result.outputDir, "site.css"), "utf8");

    expect(html).toContain("Demo tagline");
    expect(html).toContain("./site.css");
    expect(css).toContain("--color-primary");
    expect(css).toContain(".wf-hero");
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
          },
        ],
      }),
      "utf8",
    );

    const result = await generateSite("store", { rootDir, template: "store" });
    const html = await readFile(path.join(result.outputDir, "index.html"), "utf8");
    const css = await readFile(path.join(result.outputDir, "site.css"), "utf8");

    expect(html).toContain("elige, consulta y compra con asistencia");
    expect(html).toContain("Audifonos demo");
    expect(css).toContain(".store-product-grid");
    expect(css).toContain(".store-subscribe");
  });
});
