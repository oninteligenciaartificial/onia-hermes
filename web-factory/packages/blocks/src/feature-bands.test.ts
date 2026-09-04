import { describe, expect, it } from "vitest";
import { FEATURE_BANDS_CSS, renderFeatureBands } from "./feature-bands";

const ITEMS = [
  { title: "Banda de muestra A", copy: "Copy de muestra A" },
  { title: "Banda de muestra B", copy: "Copy de muestra B" },
  { title: "Banda de muestra C" },
  { title: "Banda de muestra D" },
  { title: "Banda de muestra E" },
];

describe("renderFeatureBands", () => {
  it("sin items no dibuja bandas: no inventa contenido", () => {
    expect(renderFeatureBands({ items: [] })).toBe("");
    expect(renderFeatureBands({ items: [{ title: "   " }] })).toBe("");
  });

  it("el tono cicla por indice y vuelve a empezar a la quinta banda", () => {
    const html = renderFeatureBands({ items: ITEMS });
    const tonos = [...html.matchAll(/wf-band wf-band--([a-z]+)/g)].map((m) => m[1]);
    expect(tonos).toEqual(["primary", "accent", "secondary", "neutral", "primary"]);
  });

  it("el tono explicito manda sobre el ciclo", () => {
    const html = renderFeatureBands({
      items: [{ title: "Una", tono: "solido" }, { title: "Dos" }],
    });
    const tonos = [...html.matchAll(/wf-band wf-band--([a-z]+)/g)].map((m) => m[1]);
    expect(tonos).toEqual(["solido", "accent"]);
  });

  it("el orden del DOM es SIEMPRE texto -> imagen; el zigzag lo hace el CSS", () => {
    // Alternar en el HTML daria el mismo dibujo y romperia la lectura: quien
    // escucha oiria "imagen de..." antes que el titulo en una banda de cada dos.
    const html = renderFeatureBands({
      items: [
        { title: "Una", media: { src: "a.svg", alt: "Alt A" } },
        { title: "Dos", media: { src: "b.svg", alt: "Alt B" } },
      ],
    });
    for (const banda of html.split("<article").slice(1)) {
      expect(banda.indexOf("wf-band-text")).toBeLessThan(banda.indexOf("wf-band-media"));
    }
    expect(FEATURE_BANDS_CSS).toContain(".wf-band:nth-child(even) .wf-band-media");
    expect(FEATURE_BANDS_CSS).toContain("order: 1");
  });

  it("la banda solida cambia el PAR completo: fondo primary + texto on-primary", () => {
    // Cambiar solo el fondo es como se fabrica un boton invisible.
    const solida = FEATURE_BANDS_CSS.slice(FEATURE_BANDS_CSS.indexOf(".wf-band--solido"));
    expect(solida).toContain("--wf-band-surface: var(--color-primary)");
    expect(solida).toContain("--wf-band-fg: var(--color-on-primary)");
  });

  it("sin media no emite figure vacio y la banda pasa a una sola columna", () => {
    const html = renderFeatureBands({ items: [{ title: "Sin foto" }] });
    expect(html).not.toContain("wf-band-media");
    expect(html).not.toContain("<img");
    expect(html).toContain("wf-band--sin-media");
    expect(FEATURE_BANDS_CSS).toContain(".wf-band--sin-media .wf-band-inner");
  });

  it("la imagen lleva alt y se carga diferida", () => {
    const html = renderFeatureBands({
      items: [{ title: "Con foto", media: { src: "a.svg", alt: "Alt de muestra", width: 800, height: 600 } }],
    });
    expect(html).toContain('alt="Alt de muestra"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('width="800"');
    expect(html).toContain('height="600"');
  });

  it("escapa el texto y los atributos del cliente", () => {
    const html = renderFeatureBands({
      items: [
        {
          title: "<script>alert(1)</script>",
          copy: "<b>x</b>",
          bullets: ["<i>y</i>"],
          media: { src: '"><script>', alt: '"><script>' },
        },
      ],
      label: '"><script>',
    });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("los bullets vacios no dibujan vinetas huerfanas", () => {
    const html = renderFeatureBands({ items: [{ title: "Una", bullets: ["  ", ""] }] });
    expect(html).not.toContain("wf-band-bullets");
  });

  it("la banda es full-bleed: sin eso la tecnica no existe", () => {
    // Una banda con margenes es una tarjeta, no un capitulo.
    expect(FEATURE_BANDS_CSS).toContain("width: 100vw");
    expect(FEATURE_BANDS_CSS).toContain("margin-inline: calc(50% - 50vw)");
  });

  it("no quema ningun color literal: todo sale de los tokens", () => {
    // Un hex acá seria un color que no cambia con el tema: el bug de W1.
    expect(FEATURE_BANDS_CSS.match(/#[0-9a-f]{3,8}\b/gi)).toBeNull();
    for (const token of ["--color-primary", "--color-accent", "--color-secondary", "--color-bg"]) {
      expect(FEATURE_BANDS_CSS).toContain(`var(${token})`);
    }
  });
});
