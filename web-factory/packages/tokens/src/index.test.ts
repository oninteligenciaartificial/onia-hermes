import { describe, expect, it } from "vitest";
import { clientDarkTokenVars, clientTokenCss, clientTokenVars } from "./index";

const client = {
  colores: { primary: "#0f766e", secondary: "#1d4ed8", accent: "#f59e0b", bg: "#f8fafc", fg: "#111827" },
  tipografia: { heading: "Onest", body: "Onest" },
};

/** Contraste WCAG entre dos hex. Una sola definicion para todo el archivo. */
const ratio = (a: string, b: string): number => {
  const lum = (hex: string) => {
    const canal = (v: number) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    const n = parseInt(hex.slice(1), 16);
    return 0.2126 * canal(n >> 16) + 0.7152 * canal((n >> 8) & 255) + 0.0722 * canal(n & 255);
  };
  const [hi, lo] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (hi + 0.05) / (lo + 0.05);
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

describe("en oscuro la marca se ACLARA, no se borra", () => {
  // Nace de mirar el dashboard en oscuro (2026-08-30): sidebar activo, boton,
  // celda KPI hero y barras salian BLANCOS. El remedio anterior, ante un primary
  // ilegible sobre el fondo oscuro, lo reemplazaba por DARK_FG y el panel perdia
  // la marca justo en el tema que mas se usa.
  const hue = (hex: string): number => {
    const n = parseInt(hex.slice(1), 16);
    const [r, g, b] = [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    if (d === 0) return -1; // acromatico
    const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return ((h * 60) % 360 + 360) % 360;
  };
  const verdeOnia = {
    colores: { primary: "#0d6b5c", secondary: "#0b3b32", accent: "#0d6b5c", bg: "#f6f2ea", fg: "#172420" },
    tipografia: { heading: "Fraunces", body: "DM Sans" },
  };

  it("un primary oscuro se aclara conservando el hue, en vez de volverse blanco", () => {
    const dark = clientDarkTokenVars(verdeOnia);
    const salida = dark["--color-primary"];

    expect(salida).toBeDefined();
    expect(salida).not.toBe("#e7e9ec"); // el bug: la marca se volvia el foreground
    expect(ratio(salida, "#0c1013")).toBeGreaterThanOrEqual(4.5); // sigue legible
    expect(Math.abs(hue(salida) - hue(verdeOnia.colores.primary))).toBeLessThanOrEqual(6); // sigue siendo verde
  });

  it("mantiene el par completo: el boton solido no queda tinta sobre tinta", () => {
    const dark = clientDarkTokenVars(verdeOnia);
    expect(ratio(dark["--color-on-primary"], dark["--color-primary"])).toBeGreaterThanOrEqual(4.5);
  });

  it("una marca acromatica sigue cayendo al fallback, que es lo unico legible", () => {
    const negro = { ...verdeOnia, colores: { ...verdeOnia.colores, primary: "#000000" } };
    expect(clientDarkTokenVars(negro)["--color-primary"]).toBe("#e7e9ec");
  });

  it("un primary que ya es legible en oscuro no se toca", () => {
    const claro = { ...verdeOnia, colores: { ...verdeOnia.colores, primary: "#4ade80" } };
    expect(clientDarkTokenVars(claro)).not.toHaveProperty("--color-primary");
  });
});

describe("--color-on-primary: la tinta del boton solido", () => {
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

  it("si el primary cambia, cambia con el su texto: un boton solido nunca queda tinta sobre tinta", () => {
    // primary #0f766e (el default de la fabrica) no se lee sobre #0c1013, asi que
    // se aclara. Este test comprobaba el hex literal "#e7e9ec"; desde 2026-08-30 la
    // marca se ACLARA en vez de borrarse, asi que se comprueba la INTENCION (el par
    // contrasta y el foco se ve), que es lo que el test siempre quiso proteger.
    const dark = clientDarkTokenVars(client);
    expect(dark["--color-primary"]).toBeDefined();
    expect(dark["--color-primary"]).not.toBe("#e7e9ec"); // conserva la marca
    // El par: sin esto el boton era 1,21:1.
    expect(ratio(dark["--color-on-primary"], dark["--color-primary"])).toBeGreaterThanOrEqual(4.5);
    expect(dark["--primary-foreground"]).toBe("#0c1013");
    // El foco tiene que verse sobre el fondo oscuro.
    expect(ratio(dark["--ring"], "#0c1013")).toBeGreaterThanOrEqual(4.5);
  });

  it("la marca se lee sobre la TARJETA, no solo sobre el fondo", () => {
    // Casi todo el texto de color vive dentro de una card, y la card (#161c22)
    // es mas clara que el fondo (#0c1013): medir contra el fondo dejaba pasar
    // colores que en la card caen bajo AA. Lo encontro axe en realestate-dark
    // con 4,47:1 — a 0,03 del minimo, invisible a ojo y un fallo igual.
    const dark = clientDarkTokenVars(client);
    expect(ratio(dark["--color-primary"], "#161c22")).toBeGreaterThanOrEqual(4.5);
  });

  it("el CSS emitido lleva el arreglo al bloque oscuro", () => {
    const css = clientTokenCss(clinica);
    const bloqueOscuro = css.slice(css.indexOf("prefers-color-scheme"));
    expect(bloqueOscuro).toContain("--color-secondary: #e7e9ec");
  });
});
