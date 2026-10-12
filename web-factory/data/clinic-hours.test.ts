import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { renderFooter } from "@onia/blocks";
import { generateSite } from "../generate/generate";
import { buildClientContextMarkdown, buildClientProfileFromIntake, getMissingClientInputs } from "./intake-schema";

const intake = (hours?: string, template = "landing-clinic") => ({
  project: { slug: "dental-ficticia", template },
  business: { name: "Dental Ficticia", industry: "dental", offer: "Atención dental", hours },
  contact: { email: "dental@example.com", phone: "+59170000001", whatsapp: "+59170000001", address: "Dirección ficticia 123" },
  content: { services: [{ title: "Limpieza dental", description: "Servicio confirmado" }] },
});

async function generate(hours?: string) {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "onia-clinic-hours-"));
  try {
    const client = buildClientProfileFromIntake(intake(hours));
    await mkdir(path.join(rootDir, "data/clients"), { recursive: true });
    await writeFile(path.join(rootDir, "data/clients/dental-ficticia.json"), JSON.stringify(client));
    const result = await generateSite(client.slug, { rootDir, template: "landing-clinic" });
    return { client, html: await readFile(path.join(result.outputDir, "index.html"), "utf8") };
  } finally { await rm(rootDir, { recursive: true, force: true }); }
}

describe("confirmed clinic hours through the real generator", () => {
  it("preserves the supplied schedule and updates the generated page when it changes", async () => {
    const first = await generate("Lunes a viernes: 09:00–17:00");
    const second = await generate("Sábados: 10:00–13:00");
    expect(first.client.contacto).toHaveProperty("horario", "Lunes a viernes: 09:00–17:00");
    expect(first.html).toContain("Lunes a viernes: 09:00–17:00");
    expect(second.html).toContain("Sábados: 10:00–13:00");
    expect(second.html).not.toContain("Lunes a viernes: 09:00–17:00");
    for (const html of [first.html, second.html]) {
      for (const fact of ["Dental Ficticia", "dental@example.com", "+59170000001", "Dirección ficticia 123", "Limpieza dental"]) expect(html).toContain(fact);
    }
    expect(getMissingClientInputs(intake("Sábados: 10:00–13:00"))).not.toContain("horarios de atención confirmados");
    expect(renderFooter(first.client)).not.toContain("Lunes a viernes");
  });

  it.each([undefined, "", " \n "])("requests missing hours (%j) in context without inventing public hours", async (hours) => {
    const { client, html } = await generate(hours);
    expect(client.contacto).not.toHaveProperty("horario");
    expect(html).not.toContain("Horarios:");
    expect(html).not.toContain("horarios de atención confirmados");
    expect(getMissingClientInputs(intake(hours))).toContain("horarios de atención confirmados");
    expect(buildClientContextMarkdown(intake(hours))).toContain("horarios de atención confirmados");
    expect(getMissingClientInputs(intake(hours, "landing"))).not.toContain("horarios de atención confirmados");
  });

  it("escapes HTML in the supplied hours through profile reload and document rendering", async () => {
    const { html } = await generate('Lunes <img src=x onerror="alert(1)"> & martes\n09:00–12:00');
    expect(html).toContain("&lt;img");
    expect(html).toContain("&amp; martes<br>09:00–12:00");
    expect(html).not.toContain('<img src=x onerror=');
  });
});
