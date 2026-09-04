import { describe, expect, it } from "vitest";
import {
  PANORAMA_SLIDER_3D_CSS,
  PANORAMA_SLIDER_3D_JS,
  renderPanoramaSlider3D,
  type PanoramaCard,
} from "./panorama-slider-3d";

/**
 * Dos cosas se prueban aca, y ninguna la cazaria una captura de pantalla:
 *
 *  1. El contrato de datos: que el bloque se apague cuando no hay con que
 *     llenarlo, en vez de dibujar un carrusel que se delata.
 *  2. LA MATEMATICA, contra los transforms inline REALES medidos en el original
 *     (fanvue.com, 2026-08-18, viewport 1440x900 y 375x812). Si alguien "limpia"
 *     la formula, esto se pone rojo con el numero exacto que rompio.
 *
 * El runtime se ejecuta de verdad — no se re-implementa la formula en el test,
 * que seria probar la copia. Se inyecta un DOM minimo por parametro (asi el
 * cuerpo del IIFE ve estos objetos en lugar de los globales) y se leen los
 * transforms que el propio bloque escribio.
 */

const items = (n: number): PanoramaCard[] =>
  Array.from({ length: n }, (_, i) => ({ title: `Modulo ${i + 1}` }));

// --- DOM minimo: solo lo que el runtime toca de verdad ------------------------

type FakeEl = {
  style: { transform: string; setProperty(k: string, v: string): void };
  vars: Record<string, string>;
  attrs: Record<string, string>;
  offsetWidth: number;
  offsetHeight: number;
  setAttribute(k: string, v: string): void;
  getAttribute(k: string): string | null;
  addEventListener(): void;
  contains(): boolean;
  classList: { add(): void; remove(): void };
  querySelectorAll(): FakeEl[];
};

function fakeEl(attrs: Record<string, string> = {}): FakeEl {
  const vars: Record<string, string> = {};
  return {
    vars,
    attrs,
    offsetWidth: 0,
    offsetHeight: 0,
    style: {
      transform: "",
      setProperty(k, v) {
        vars[k] = v;
      },
    },
    setAttribute(k, v) {
      attrs[k] = v;
    },
    getAttribute(k) {
      return k in attrs ? attrs[k] : null;
    },
    addEventListener() {},
    contains: () => false,
    classList: { add() {}, remove() {} },
    querySelectorAll: () => [],
  };
}

type BootOptions = {
  count?: number;
  width: number;
  rotate: number;
  depth: number;
  reducedMotion?: boolean;
  autoplay?: string;
};

function boot(opts: BootOptions) {
  const cards = Array.from({ length: opts.count ?? 12 }, () => fakeEl());
  for (const card of cards) card.offsetWidth = opts.width;

  const root = fakeEl(opts.autoplay ? { "data-wf-pano-autoplay": opts.autoplay } : {});
  root.offsetHeight = 592;
  root.querySelectorAll = () => cards;

  let onIntersect: ((entries: { isIntersecting: boolean }[]) => void) | null = null;
  const intervals: number[] = [];

  const win = {
    innerHeight: 900,
    matchMedia: () => ({ matches: !!opts.reducedMotion }),
    addEventListener() {},
    IntersectionObserver: class {
      constructor(cb: (entries: { isIntersecting: boolean }[]) => void) {
        onIntersect = cb;
      }
      observe() {}
    },
  };
  const doc = { querySelectorAll: () => [root] };
  const computed = () => ({
    getPropertyValue: (k: string) =>
      k === "--wf-pano-rotate" ? String(opts.rotate) : k === "--wf-pano-depth" ? String(opts.depth) : "",
  });

  new Function(
    "window",
    "document",
    "getComputedStyle",
    "setInterval",
    "clearInterval",
    PANORAMA_SLIDER_3D_JS,
  )(win, doc, computed, (_fn: () => void, ms: number) => {
    intervals.push(ms);
    return intervals.length;
  }, () => {});

  return {
    root,
    cards,
    intervals,
    enterViewport: () => onIntersect?.([{ isIntersecting: true }]),
  };
}

/** Lee el transform que escribio el bloque, no uno recalculado por el test. */
function transform(el: FakeEl) {
  const m = /^translateX\((-?[\d.]+)px\) translateZ\((-?[\d.]+)px\) rotateY\((-?[\d.]+)deg\)$/.exec(
    el.style.transform,
  );
  if (!m) throw new Error(`transform inesperado: ${el.style.transform}`);
  return { x: Number(m[1]), z: Number(m[2]), rotY: Number(m[3]) };
}

describe("panorama-slider-3d · contrato de datos", () => {
  it("sin items no renderiza nada", () => {
    expect(renderPanoramaSlider3D({ items: [] })).toBe("");
  });

  it("con menos de 5 tarjetas no renderiza: eso es una grilla, no un cilindro", () => {
    expect(renderPanoramaSlider3D({ items: items(4) })).toBe("");
    expect(renderPanoramaSlider3D({ items: items(5) })).not.toBe("");
  });

  it("la tarjeta sin titulo se descarta, y si quedan menos de 5 el bloque se apaga", () => {
    const conVacias = [...items(5), { title: "   " }, { title: "" }];
    expect((renderPanoramaSlider3D({ items: conVacias }).match(/wf-pano-card/g) ?? []).length).toBe(5);
    expect(renderPanoramaSlider3D({ items: [...items(4), { title: "  " }] })).toBe("");
  });

  it("sin href la tarjeta es un div: no finge ser un enlace", () => {
    expect(renderPanoramaSlider3D({ items: items(6) })).not.toContain("<a ");
    expect(renderPanoramaSlider3D({ items: items(6).map((i) => ({ ...i, href: "/x" })) })).toContain(
      'href="/x"',
    );
  });

  it("sin imagen no hay <img> roto: queda el placeholder del token", () => {
    expect(renderPanoramaSlider3D({ items: items(6) })).not.toContain("<img");
    expect(PANORAMA_SLIDER_3D_CSS).toContain(".wf-pano-media");
  });

  it("la imagen reserva su caja (sin salto de layout) y no bloquea el primer pintado", () => {
    const html = renderPanoramaSlider3D({ items: items(6).map((i) => ({ ...i, image: "/a.avif" })) });
    expect(html).toContain('width="360" height="461"');
    expect(html).toContain('loading="lazy"');
  });

  it("escapa titulo, subtitulo, href y alt", () => {
    const html = renderPanoramaSlider3D({
      items: [
        { title: '<script>x</script>', subtitle: 'a"b', href: '/x?a=1&b=2', image: "/i.png", imageAlt: "<i>" },
        ...items(5),
      ],
    });
    expect(html).not.toContain("<script>x");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("a&quot;b");
    expect(html).toContain("/x?a=1&amp;b=2");
    expect(html).toContain('alt="&lt;i&gt;"');
  });

  it("autoplay: 5000 por defecto (medido), y false lo apaga del todo", () => {
    expect(renderPanoramaSlider3D({ items: items(6) })).toContain('data-wf-pano-autoplay="5000"');
    expect(renderPanoramaSlider3D({ items: items(6), autoplay: false })).not.toContain(
      "data-wf-pano-autoplay",
    );
    expect(renderPanoramaSlider3D({ items: items(6), autoplay: 0 })).not.toContain(
      "data-wf-pano-autoplay",
    );
  });

  it("sin JS sale una lista alcanzable con teclado, no el cilindro a medio armar", () => {
    const html = renderPanoramaSlider3D({ items: items(6), heading: "Modulos" });
    expect(html).toContain('tabindex="0"');
    expect(html).toContain("<ul class=\"wf-pano\"");
    expect(html).not.toContain("data-wf-pano-ready");
    expect(html).toContain('aria-labelledby="vitrina-heading"');
  });
});

describe("panorama-slider-3d · CSS", () => {
  it("trae su propio border-box y no depende del reset de la pagina", () => {
    expect(PANORAMA_SLIDER_3D_CSS).toContain("box-sizing: border-box");
  });

  it("reduced-motion usa transition: none, NUNCA 0.01ms", () => {
    const reglas = PANORAMA_SLIDER_3D_CSS.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(reglas).not.toMatch(/0?\.01ms/);
    const bloque = reglas.slice(reglas.indexOf("prefers-reduced-motion"));
    expect(bloque).toContain("transition: none");
    expect(bloque).toContain("animation: none");
    // El selector debe repetir [data-wf-pano-ready]: una media query no suma
    // especificidad y .wf-pano-card a secas perderia contra la regla del cilindro.
    expect(bloque).toContain("[data-wf-pano-ready] .wf-pano-card");
  });

  it("conserva la geometria medida por breakpoint", () => {
    const pares = PANORAMA_SLIDER_3D_CSS.match(/--wf-pano-rotate: \d+; --wf-pano-depth: \d+/g) ?? [];
    expect(pares).toEqual([
      "--wf-pano-rotate: 30; --wf-pano-depth: 200",
      "--wf-pano-rotate: 30; --wf-pano-depth: 150",
      "--wf-pano-rotate: 35; --wf-pano-depth: 150",
      "--wf-pano-rotate: 45; --wf-pano-depth: 150",
    ]);
    expect(PANORAMA_SLIDER_3D_CSS).toContain("perspective: 1200px");
    expect(PANORAMA_SLIDER_3D_CSS).toContain("touch-action: pan-y");
  });
});

describe("panorama-slider-3d · runtime contra los transforms medidos", () => {
  // Tabla medida a 1440 (rotate 25, depth 250, slide 360px). El translateX de la
  // tabla es el DELTA: en el original la posicion base la ponia el wrapper de
  // Swiper, aca la lleva el mismo transform como -p*S. Por eso se le resta.
  const MEDIDO = [
    { i: 0, dx: 0, z: -250, rotY: 0 },
    { i: 1, dx: -11.2431, z: -172.082, rotY: -25 },
    { i: 2, dx: -85.731, z: 47.0724, rotY: -50 },
    { i: 3, dx: -266.825, z: 366.396, rotY: -75 },
  ];

  it("reproduce los transforms inline reales con error < 0,01 px", () => {
    const { cards } = boot({ width: 360, rotate: 25, depth: 250 });
    for (const caso of MEDIDO) {
      const t = transform(cards[caso.i]);
      const p = -caso.i; // p = center - i, con center = 0
      expect(Math.abs(t.x + p * 360 - caso.dx)).toBeLessThan(0.01);
      expect(Math.abs(t.z - caso.z)).toBeLessThan(0.01);
      expect(t.rotY).toBe(caso.rotY);
    }
  });

  it("a 375 reproduce la configuracion movil medida (45 grados, -150px)", () => {
    const { cards } = boot({ width: 187.5, rotate: 45, depth: 150 });
    expect(Math.abs(transform(cards[0]).z + 150)).toBeLessThan(0.01);
    expect(transform(cards[1]).rotY).toBe(-45);
  });

  it("el loop envuelve: la tarjeta 9 de 12 aparece del otro lado", () => {
    const { cards } = boot({ width: 360, rotate: 25, depth: 250 });
    expect(transform(cards[9]).rotY).toBe(75); // p = 3, no -9
  });

  it("apaga SOLO el texto y clampea en 0.2", () => {
    const { cards } = boot({ width: 360, rotate: 25, depth: 250 });
    expect(cards[0].vars["--wf-pano-op"]).toBe("1.0000");
    expect(cards[1].vars["--wf-pano-op"]).toBe("0.2000");
    expect(cards[0].attrs["aria-current"]).toBe("true");
    expect(cards[1].attrs["aria-current"]).toBe("false");
  });

  it("enciende el cilindro recien cuando hay JS", () => {
    const { root } = boot({ width: 360, rotate: 25, depth: 250 });
    expect(root.attrs["data-wf-pano-ready"]).toBe("");
  });

  it("el autoplay arranca al entrar en pantalla, con el delay medido", () => {
    const carrusel = boot({ width: 360, rotate: 25, depth: 250, autoplay: "5000" });
    expect(carrusel.intervals).toEqual([]);
    carrusel.enterViewport();
    expect(carrusel.intervals).toEqual([5000]);
  });

  it("con reduced-motion no arranca autoplay aunque el bloque este a la vista", () => {
    const carrusel = boot({
      width: 360,
      rotate: 25,
      depth: 250,
      autoplay: "5000",
      reducedMotion: true,
    });
    carrusel.enterViewport();
    expect(carrusel.intervals).toEqual([]);
  });
});
