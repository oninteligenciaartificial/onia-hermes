import { describe, expect, it } from "vitest";
import { MARQUEE_CSS, renderMarquee } from "./marquee";

const ITEMS = ["Reseña de muestra A", "Reseña de muestra B", "Reseña de muestra C"];

describe("renderMarquee", () => {
  it("sin items no dibuja cinta: no inventa contenido", () => {
    expect(renderMarquee({ items: [] })).toBe("");
    expect(renderMarquee({ items: ["  ", ""] })).toBe("");
  });

  it("renderiza la lista DOS veces — el loop limpio depende de eso", () => {
    const html = renderMarquee({ items: ITEMS });
    for (const item of ITEMS) {
      expect(html.split(item).length - 1, `${item} tiene que aparecer 2 veces`).toBe(2);
    }
  });

  it("la copia va aria-hidden: un lector de pantalla no lee dos veces", () => {
    const html = renderMarquee({ items: ITEMS });
    expect(html).toContain('aria-hidden="true"');
    // Y solo una copia: la primera mitad es la real.
    expect(html.split('aria-hidden="true"').length - 1).toBe(1);
  });

  it("escapa el texto del cliente", () => {
    const html = renderMarquee({ items: ['<script>alert(1)</script>'] });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("la duración escala con la cantidad de items y tiene piso", () => {
    expect(renderMarquee({ items: ITEMS })).toContain("--wf-marquee-dur:18s");
    expect(renderMarquee({ items: Array(8).fill("x") })).toContain("--wf-marquee-dur:48s");
    expect(renderMarquee({ items: ITEMS, segundos: 90 })).toContain("--wf-marquee-dur:90s");
  });

  it("la separación es padding del item, nunca gap del track", () => {
    // Con `gap` el track mide 2S+(2n-1)g y translateX(-50%) cae medio gap
    // corrido: el salto que esta técnica existe para evitar.
    const track = MARQUEE_CSS.slice(MARQUEE_CSS.indexOf(".wf-marquee-track,"));
    expect(track).not.toMatch(/^\s*gap:/m);
    expect(MARQUEE_CSS).toContain("padding-inline-end: var(--wf-marquee-gap)");
    expect(MARQUEE_CSS).toContain("translateX(-50%)");
  });

  it("se puede frenar con teclado, no solo con el mouse (WCAG 2.2.2)", () => {
    expect(MARQUEE_CSS).toContain(":focus-within .wf-marquee-track");
    expect(MARQUEE_CSS).toContain("animation-play-state: paused");
  });

  it("bajo reduced-motion no se mueve y el contenido sigue alcanzable", () => {
    const reduced = MARQUEE_CSS.slice(MARQUEE_CSS.indexOf("prefers-reduced-motion"));
    expect(reduced).toContain("animation: none");
    expect(reduced).toContain("overflow-x: auto");
  });

  it("no quema ningún color literal: todo sale de los tokens", () => {
    const colores = MARQUEE_CSS.replace(/#000/g, "").match(/#[0-9a-f]{3,8}\b/gi);
    expect(colores, "solo el negro de la máscara, que no es color de marca").toBeNull();
  });
});
