import { describe, expect, it } from "vitest";
import { clientDarkTokenVars, clientTokenCss, clientTokenVars } from "./index";

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

describe("--color-on-primary: la tinta del boton solido", () => {
  const ratio = (a: string, b: string) => {
    const lum = (hex: string) => {
      const canal = (v: number) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      const n = hex.replace("#", "");
      const [r, g, bl] = [0, 2, 4].map((i) => Number.parseInt(n.slice(i, i + 2), 16));
      return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(bl);
    };
    const [x, y] = [lum(a), lum(b)];
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  };

  // Cada uno de estos es un CTA real de un sitio generado: el par
  // background:--color-primary + color:--color-on-primary tiene que leerse.
  const marcas = ["#3D7DFF", "#0f766e", "#f5c542", "#22d3ee", "#0ea5e9", "#111827", "#ffffff"];

  it.each(marcas)("%s da 4.5:1 o mas con su on-primary", (primary) => {
    const vars = clientTokenVars({
      colores: { primary, secondary: primary, accent: primary, bg: "#ffffff", fg: "#111827" },
      tipografia: { heading: "Onest", body: "Onest" },
    });
    expect(ratio(primary, vars["--color-on-primary"])).toBeGreaterThanOrEqual(4.5);
  });

  it("un azul de tono medio lleva tinta oscura, no blanco (era 3,77:1)", () => {
    const vars = clientTokenVars({
      colores: { primary: "#3D7DFF", secondary: "#8FB6FF", accent: "#6AA0FF", bg: "#0E1116", fg: "#EEF1F6" },
      tipografia: { heading: "Onest", body: "Onest" },
    });
    expect(vars["--color-on-primary"]).toBe("#111827");
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

  it("si el primary cambia, cambia con el su texto: un boton solido nunca queda blanco sobre blanco", () => {
    // primary #0f766e (el default de la fabrica) no se lee sobre #0c1013.
    const dark = clientDarkTokenVars(client);
    expect(dark["--color-primary"]).toBe("#e7e9ec");
    // El par: fondo claro exige tinta oscura. Sin esto el boton era 1,21:1.
    expect(dark["--color-on-primary"]).toBe("#0c1013");
    expect(dark["--primary-foreground"]).toBe("#0c1013");
    expect(dark["--ring"]).toBe("#e7e9ec");
  });

  it("el CSS emitido lleva el arreglo al bloque oscuro", () => {
    const css = clientTokenCss(clinica);
    const bloqueOscuro = css.slice(css.indexOf("prefers-color-scheme"));
    expect(bloqueOscuro).toContain("--color-secondary: #e7e9ec");
  });
});
