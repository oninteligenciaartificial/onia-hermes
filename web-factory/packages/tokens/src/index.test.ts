import { describe, expect, it } from "vitest";
import { clientDarkTokenVars, clientTokenCss } from "./index";

const client = {
  colores: { primary: "#0f766e", secondary: "#1d4ed8", accent: "#f59e0b", bg: "#f8fafc", fg: "#111827" },
  tipografia: { heading: "Onest", body: "Onest" },
};

describe("clientTokenCss dark variant", () => {
  it("emits the light :root block plus dark overrides for the default scope", () => {
    const css = clientTokenCss(client);

    expect(css).toContain(":root {");
    expect(css).toContain("--color-bg: #f8fafc"); // light value from the client
    expect(css).toContain("@media (prefers-color-scheme: dark)");
    expect(css).toContain(':root:not([data-theme="light"])');
    expect(css).toContain('[data-theme="dark"]');
    expect(css).toContain("--color-bg: #0c1013"); // dark surface override
    expect(css).toContain("--card: #161c22");
  });

  it("omits the dark blocks when a custom selector scope is requested", () => {
    const css = clientTokenCss(client, ".wf-preview");

    expect(css).toContain(".wf-preview {");
    expect(css).not.toContain("prefers-color-scheme");
    expect(css).not.toContain("data-theme");
  });

  it("dark overrides only swap surfaces, never brand colors", () => {
    const dark = clientDarkTokenVars();

    expect(dark["--color-fg"]).toBe("#e7e9ec");
    expect(dark["--card"]).toBe("#161c22");
    expect(dark).not.toHaveProperty("--color-primary");
    expect(dark).not.toHaveProperty("--color-accent");
  });
});

describe("modo oscuro: la marca no puede volverse invisible", () => {
  const clinica = {
    colores: { primary: "#0ea5e9", secondary: "#0f172a", accent: "#22d3ee", bg: "#ffffff", fg: "#0f172a" },
    tipografia: { heading: "Onest", body: "Onest" },
  };

  it("un secondary casi negro se reemplaza en oscuro (era 1,05:1 = invisible)", () => {
    const dark = clientDarkTokenVars(clinica);
    expect(dark["--color-secondary"]).toBe("#e7e9ec");
    expect(dark["--secondary"]).toBe("#e7e9ec");
  });

  it("una marca que SI se lee sobre oscuro se respeta, no se aplana", () => {
    const legible = {
      ...clinica,
      colores: { ...clinica.colores, secondary: "#f5c542", primary: "#f5c542" },
    };
    const dark = clientDarkTokenVars(legible);
    expect(dark["--color-secondary"]).toBeUndefined();
    expect(dark["--color-primary"]).toBeUndefined();
  });

  it("el CSS emitido lleva el arreglo al bloque oscuro", () => {
    const css = clientTokenCss(clinica);
    const bloqueOscuro = css.slice(css.indexOf("prefers-color-scheme"));
    expect(bloqueOscuro).toContain("--color-secondary: #e7e9ec");
  });
});
