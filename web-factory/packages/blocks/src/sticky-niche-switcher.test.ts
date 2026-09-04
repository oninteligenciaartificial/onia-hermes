import { describe, expect, it } from "vitest";
import {
  renderStickyNicheSwitcher,
  STICKY_NICHE_SWITCHER_CSS,
  STICKY_NICHE_SWITCHER_JS,
  type NicheItem,
} from "./sticky-niche-switcher";

/**
 * Invariantes del bloque: lo que, si se rompe, convierte el conmutador medido en
 * una seccion rota o — peor — en una que promete lo que no tenemos.
 * Lo visual (que el rodillo avance 331 px por rubro, que el pegado pegue) se
 * verifica mirando la pantalla, no aca.
 */

const niche = (n: number, extra: Partial<NicheItem> = {}): NicheItem => ({
  id: `rubro-${n}`,
  word: `Rubro ${n}`,
  photoLeft: { src: `/l${n}.avif`, alt: `Pantalla ${n}` },
  photoRight: { src: `/r${n}.avif`, alt: `Detalle ${n}` },
  ...extra,
});

const BASE = { niches: [niche(1), niche(2), niche(3)] };

describe("sticky-niche-switcher", () => {
  it("con menos de 2 rubros no renderiza: un conmutador de uno miente", () => {
    expect(renderStickyNicheSwitcher({ niches: [] })).toBe("");
    expect(renderStickyNicheSwitcher({ niches: [niche(1)] })).toBe("");
  });

  it("descarta el rubro sin id o sin palabra", () => {
    const html = renderStickyNicheSwitcher({
      niches: [niche(1), { ...niche(2), id: "  " }, { ...niche(3), word: " " }, niche(4)],
    });
    expect(html.match(/data-wf-niche-word/g)).toHaveLength(2);
    expect(html).not.toContain("Rubro 2");
  });

  it("sin una columna COMPLETA de fotos no renderiza: un rodillo con hueco es un frame en blanco", () => {
    const cojo = [niche(1), { ...niche(2), photoLeft: undefined, photoRight: undefined }, niche(3)];
    expect(renderStickyNicheSwitcher({ niches: cojo })).toBe("");
  });

  it("si falta la columna derecha cae a UNA tarjeta y la escena se recompone", () => {
    const html = renderStickyNicheSwitcher({
      niches: BASE.niches.map((n) => ({ ...n, photoRight: undefined })),
    });
    expect(html.match(/wf-niche-card wf-niche-card--/g)).toHaveLength(1);
    expect(html).toContain("wf-niche-stage--one");
    expect(renderStickyNicheSwitcher(BASE).match(/wf-niche-card wf-niche-card--/g)).toHaveLength(2);
  });

  it("el reparto es alto/(n+1), no alto/n: ese +1 son los dos colchones medidos", () => {
    const html = renderStickyNicheSwitcher(BASE);
    expect(html).toContain("--wf-niche-run:4"); // 3 rubros + 1
    expect(html).toContain("--wf-niche-step:750px"); // medido en >=1440
    expect(html.match(/data-wf-niche-mark/g)).toHaveLength(3);
    expect(html).toContain("top:calc(var(--wf-niche-step) * 2)");
  });

  it("el scroll por rubro nunca baja del piso de 600 px", () => {
    // El tablet del original usa 265 px contra una transicion de 500 ms: un
    // scroll normal atraviesa 2-3 rubros antes de que termine la primera.
    expect(renderStickyNicheSwitcher({ ...BASE, scrollPerNiche: 265 })).toContain("--wf-niche-step:600px");
    expect(renderStickyNicheSwitcher({ ...BASE, scrollPerNiche: 900 })).toContain("--wf-niche-step:900px");
  });

  it("con href es <a> (teclado) y sin href es <span>, sin romperse", () => {
    const html = renderStickyNicheSwitcher({
      niches: [niche(1, { href: "/packs/dental" }), niche(2), niche(3)],
    });
    expect(html).toContain('<a class="wf-niche-word" href="/packs/dental"');
    expect(html).toContain('<span class="wf-niche-word" data-wf-niche-word');
  });

  it("arranca con el primer rubro activo y uno solo", () => {
    const html = renderStickyNicheSwitcher(BASE);
    expect(html.match(/aria-current="true"/g)).toHaveLength(1);
    expect(html.indexOf('aria-current="true"')).toBeLessThan(html.indexOf("Rubro 2"));
    expect(html.match(/aria-current="false"/g)).toHaveLength(2);
  });

  it("sin metrica no inventa nada: ni punto ni linea", () => {
    // Cero clientes pagando ⇒ prohibido inventar cifras. La pildora se acorta.
    const html = renderStickyNicheSwitcher({
      niches: BASE.niches.map((n) => ({ ...n, business: "Negocio" })),
    });
    expect(html).toContain("wf-niche-rows");
    expect(html).not.toContain("wf-niche-dot");
    expect(html).not.toContain("wf-niche-metric");
  });

  it("con metrica real el punto separador aparece pegado al nombre", () => {
    const html = renderStickyNicheSwitcher({
      niches: BASE.niches.map((n) => ({ ...n, business: "Negocio", metric: "140 al mes" })),
    });
    expect(html).toContain("wf-niche-dot");
    expect(html).toContain("140 al mes");
  });

  it("sin negocio ni avatar no hay pildora", () => {
    expect(renderStickyNicheSwitcher(BASE)).not.toContain("wf-niche-pill");
  });

  it("sin avatar usa el monograma del negocio, nunca una cara de stock", () => {
    const html = renderStickyNicheSwitcher({
      niches: BASE.niches.map((n) => ({ ...n, business: "Clinica Rex" })),
    });
    expect(html).toContain("<svg class=\"wf-niche-face\"");
    expect(html).toContain(">C</text>");
  });

  it("la pildora es decorativa: el rodillo de nombres no se lee como una lista de 5", () => {
    const html = renderStickyNicheSwitcher({
      niches: BASE.niches.map((n) => ({ ...n, business: "Negocio" })),
    });
    expect(html).toContain('<div class="wf-niche-pill" aria-hidden="true">');
  });

  it("escapa palabra, alt y href", () => {
    const html = renderStickyNicheSwitcher({
      niches: [
        niche(1, {
          word: '<script>alert("x")</script>',
          href: '" onclick="x',
          photoLeft: { src: "/a.avif", alt: 'Un "alt" <peligroso>' },
        }),
        niche(2),
        niche(3),
      ],
    });
    expect(html).not.toContain("<script>alert");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain('alt="Un &quot;alt&quot; &lt;peligroso&gt;"');
    expect(html).not.toContain('onclick="x"');
  });

  it("las fotos van lazy y con dimensiones: el peso real del bloque son ellas", () => {
    const html = renderStickyNicheSwitcher(BASE);
    const imgs = html.match(/<img class="wf-niche-shot"[\s\S]*?>/g) ?? [];
    expect(imgs).toHaveLength(6); // 3 rubros x 2 columnas
    for (const img of imgs) {
      expect(img).toContain('loading="lazy"');
      expect(img).toContain('decoding="async"');
      expect(img).toMatch(/width="282"[\s\S]*height="331"/);
    }
  });

  it("reduced-motion usa transition: none, NUNCA 0.01ms", () => {
    // Con 0.01ms las propiedades discretas siguen animando: el estado queda a
    // medio camino, invisible pero vivo.
    expect(STICKY_NICHE_SWITCHER_CSS).toContain("prefers-reduced-motion");
    const reglas = STICKY_NICHE_SWITCHER_CSS.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(reglas).not.toMatch(/0?\.01ms/);
    const bloque = reglas.slice(reglas.indexOf("prefers-reduced-motion"));
    expect(bloque).toContain("transition: none");
    expect(bloque).toContain("animation: none");
    // Y bajo reduced-motion se ven TODAS las palabras: nadie pierde un rubro.
    expect(bloque).toContain(".wf-niche-word { opacity: 1; }");
  });

  it("el bloque trae su propio border-box y no depende del reset de la pagina", () => {
    expect(STICKY_NICHE_SWITCHER_CSS).toContain("box-sizing: border-box");
  });

  it("cero librerias: el JS solo decide un entero y el CSS deriva el resto", () => {
    expect(STICKY_NICHE_SWITCHER_JS).toContain("IntersectionObserver");
    expect(STICKY_NICHE_SWITCHER_JS).toContain("--wf-niche-i");
    for (const lib of ["gsap", "ScrollTrigger", "Swiper", "requestAnimationFrame"]) {
      expect(STICKY_NICHE_SWITCHER_JS).not.toContain(lib);
    }
    // El presupuesto es 150 KB de JS por landing; este bloque no puede pesar.
    expect(STICKY_NICHE_SWITCHER_JS.length).toBeLessThan(1400);
  });

  /**
   * Los cuatro de abajo son regresiones: el bloque pasaba los 19 tests de arriba
   * y en pantalla estaba roto. Salieron de abrirlo en Chromium y medir
   * getComputedStyle / getBoundingClientRect, no de leer el codigo.
   */

  it("la tira derecha rueda al reves Y se ancla abajo invertida, o la ventana queda VACIA", () => {
    // MEDIDO: con signo positivo pero anclada arriba y en orden, en i=1 e i=2
    // ningun <img> solapaba el rect de la ventana derecha. Se veia un hueco del
    // color del fondo en todos los estados menos el primero.
    const regla = STICKY_NICHE_SWITCHER_CSS.slice(
      STICKY_NICHE_SWITCHER_CSS.indexOf(".wf-niche-card--r .wf-niche-roll {"),
    ).slice(0, 200);
    expect(regla).toContain("transform: translateY(calc(var(--wf-niche-i) * var(--wf-niche-slot)))");
    expect(regla).toContain("inset: auto 0 0"); // anclada abajo
    expect(regla).toContain("flex-direction: column-reverse"); // celda 0 abajo de todo
  });

  it("el indice se relee de la geometria: un estado por centinela se queda viejo", () => {
    // MEDIDO: saltando de y=3920 a y=2050 el indice se quedaba en 4 en vez de
    // volver a 1. En un salto, un centinela pasa de abajo del viewport a arriba
    // sin intersecar nunca: no genera entrada y su estado guardado manda.
    expect(STICKY_NICHE_SWITCHER_JS).toContain("getBoundingClientRect");
    expect(STICKY_NICHE_SWITCHER_JS).not.toContain("dataset");
  });

  it("los centinelas son bandas de un rubro de alto, no puntos de 1 px", () => {
    // Un punto de 1 px lo saltea un scroll rapido entre dos frames sin que su
    // interseccion cambie: el observador nunca despierta.
    expect(STICKY_NICHE_SWITCHER_CSS).toContain(".wf-niche-mark { position: absolute;");
    expect(STICKY_NICHE_SWITCHER_CSS).toContain("height: var(--wf-niche-step); }");
  });

  it("apilado, las palabras van ANTES de las fotos", () => {
    // En el DOM la tarjeta va primero porque en escritorio es la columna
    // izquierda. Apilado tal cual, en 375 el visitante se come ~1 700 px de
    // capturas antes de leer un rubro: la prueba antes que la afirmacion.
    const stacked = STICKY_NICHE_SWITCHER_CSS.slice(STICKY_NICHE_SWITCHER_CSS.indexOf("max-width: 47.99em"));
    expect(stacked).toContain(".wf-niche-mid { order: -1; }");
    expect(stacked).toMatch(/\.wf-niche-stage \{[^}]*flex-direction: column/);
  });
});
