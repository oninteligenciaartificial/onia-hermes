import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { renderFeatures } from "./features";
import { hasIcon } from "./icons";

const base = {
  nombre: "Aura", tagline: "Sonrisas sanas", descripcion: "Clinica dental.", logo: "A",
  contacto: { email: "", tel: "", whatsapp: "", direccion: "La Paz" },
  redes: { ig: "", fb: "", linkedin: "", x: "" },
  cta: { texto: "Agendar cita", url: "https://wa.me/1" },
} as const;

const clientsDir = path.resolve(fileURLToPath(new URL("../../..", import.meta.url)), "data/clients");

function iconNamesInClientData(): string[] {
  const names = new Set<string>();
  const walk = (value: unknown): void => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) return value.forEach(walk);
    for (const [key, child] of Object.entries(value)) {
      if (key === "icono" && typeof child === "string") names.add(child);
      else walk(child);
    }
  };
  for (const file of readdirSync(clientsDir).filter((f) => f.endsWith(".json"))) {
    try {
      walk(JSON.parse(readFileSync(path.join(clientsDir, file), "utf8")));
    } catch {
      // Non-client JSON siblings (design recipes) are not our concern here.
    }
  }
  return [...names].sort();
}

describe("renderFeatures icons", () => {
  it("renders the SVG icon, not the first two letters of the icon name", () => {
    const html = renderFeatures({ ...base, servicios: [{ titulo: "t", desc: "d", icono: "sparkles" }] });
    expect(html).toContain("<svg");
    expect(html).not.toMatch(/wf-feature-icon"[^>]*>SP</);
  });

  // renderIcon falls back to `check` for unknown names, which renders identical
  // ticks across a services grid instead of failing loudly. This is the check
  // that catches a new client shipping an icon name the set does not cover.
  it("covers every icon name used by the shipped client data", () => {
    const missing = iconNamesInClientData().filter((name) => !hasIcon(name));
    expect(missing).toEqual([]);
  });
});
