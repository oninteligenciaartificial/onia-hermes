import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createClientFromIntake } from "./create-client";

describe("createClientFromIntake", () => {
  it("creates a client JSON and context file from an intake", async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), "onia-web-factory-intake-"));
    await mkdir(path.join(rootDir, "data", "intakes"), { recursive: true });
    const intakePath = path.join(rootDir, "data", "intakes", "clinic.json");

    await writeFile(
      intakePath,
      JSON.stringify({
        project: { slug: "clinic-demo", template: "landing" },
        business: {
          name: "Clinic Demo",
          industry: "salud",
          offer: "reservas medicas",
        },
        brand: {
          references: [{ title: "Referencia", url: "https://example.com" }],
        },
        media: {
          heroPoster: "assets/clinic.webp",
        },
      }),
      "utf8",
    );

    const result = await createClientFromIntake({
      rootDir,
      input: "data/intakes/clinic.json",
    });

    const profile = JSON.parse(await readFile(result.profilePath, "utf8"));
    const context = await readFile(result.contextPath, "utf8");

    expect(result.slug).toBe("clinic-demo");
    expect(result.template).toBe("landing");
    expect(profile.nombre).toBe("Clinic Demo");
    expect(profile.heroPoster).toBe("assets/clinic.webp");
    expect(context).toContain("https://example.com");
  });

  it("refuses to overwrite generated client files without --force", async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), "onia-web-factory-intake-"));
    await mkdir(path.join(rootDir, "data", "intakes"), { recursive: true });

    await writeFile(
      path.join(rootDir, "data", "intakes", "demo.json"),
      JSON.stringify({
        project: { slug: "demo-client", template: "landing" },
        business: {
          name: "Demo Client",
          industry: "servicios",
          offer: "servicio claro",
        },
      }),
      "utf8",
    );

    await createClientFromIntake({ rootDir, input: "data/intakes/demo.json" });

    await expect(createClientFromIntake({ rootDir, input: "data/intakes/demo.json" })).rejects.toThrow(
      "already exists",
    );

    await expect(createClientFromIntake({ rootDir, input: "data/intakes/demo.json", force: true })).resolves.toMatchObject({
      slug: "demo-client",
    });
  });
});
