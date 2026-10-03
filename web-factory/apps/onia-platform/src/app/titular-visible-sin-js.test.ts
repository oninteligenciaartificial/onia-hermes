import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { beforeAll, describe, expect, it } from "vitest";

import {
  htmlDe,
  PAGINA_DE_RUTA,
  renderizarPublicadas,
  RUTAS_PUBLICADAS,
  TIEMPO_PARA_RENDERIZAR,
} from "./html-servido";

/**
 * El titular de cada página pública se pinta con el HTML del servidor, sin
 * esperar al JavaScript.
 *
 * **Por qué existe** (auditoría de producción del 2026-10-02, §5 Velocidad): en
 * /precios, /empezar y otras nueve páginas el `<h1>` iba envuelto en el
 * `<Reveal>` de motion, que sale del servidor con `style="opacity:0;
 * transform:…"` en línea y recién se ve cuando hidrata React Y llegan las
 * features diferidas de LazyMotion. El navegador tenía el texto desde el primer
 * byte y lo pintaba transparente: LCP de 3,4-3,7 s en un celular, contra una
 * meta de 2,5 s, en la página a la que el bot de WhatsApp manda a cada lead
 * (onia.com.bo/precios).
 *
 * La portada ya lo había resuelto el 29-sep con una entrada en CSS
 * (`heroEntrada`), pero el arreglo quedó local a esa página y las demás
 * siguieron con el patrón viejo. Por eso el gate recorre TODAS las páginas
 * publicadas, no una: la regla es del sitio, no de una pantalla.
 *
 * Qué mide: se renderiza cada página en el servidor (lo mismo que hace Next) y
 * se exige que el bloque que trae el `<h1>` —titular, bajada, botones y la
 * pieza de al lado— no tenga NINGÚN elemento con `opacity:0` ni
 * `visibility:hidden` en línea. La animación de entrada puede existir, pero en
 * CSS (`<Entrada>` de `@/motion`), que el navegador corre con el HTML y que
 * `prefers-reduced-motion` apaga.
 *
 * Las páginas se descubren solas y se renderizan una vez para todo el archivo
 * (`html-servido.ts`, que comparte con `promesa-que-el-producto-cumple.test.ts`):
 * una página nueva que entre al sitemap queda vigilada sin tocar este archivo, y
 * el import en frío va en el `beforeAll`, no contra el timeout de cada `it()`.
 */

type Nodo = { tag: string; atributos: string; inicio: number };

const VACIOS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta",
  "source", "track", "wbr", "path", "circle", "rect", "line", "polyline",
  "polygon", "ellipse", "stop", "use",
]);

/**
 * Devuelve lo que se pinta en la primera pantalla alrededor del primer `<h1>`:
 * la apertura de cada elemento que lo envuelve (si un ancestro va transparente,
 * el titular también) más el fragmento entero del `<section>` (o `<header>`, en
 * los legales) más cercano que lo contiene.
 */
function bloqueDelTitular(html: string): string {
  const pila: Nodo[] = [];
  const re = /<\/?([a-zA-Z][a-zA-Z0-9-]*)([^>]*?)(\/?)>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const [completo, tagCrudo, atributos, autocierre] = m;
    const tag = tagCrudo.toLowerCase();
    if (completo.startsWith("</")) {
      // Cierra hasta el último abierto con ese nombre.
      for (let i = pila.length - 1; i >= 0; i--) {
        if (pila[i].tag === tag) {
          pila.length = i;
          break;
        }
      }
      continue;
    }
    if (tag === "h1") {
      const contenedor = [...pila].reverse().find((n) => n.tag === "section" || n.tag === "header");
      if (!contenedor) throw new Error("El <h1> no está dentro de un <section> ni de un <header>");
      // Los que envuelven al contenedor desde afuera; los de adentro ya van en el fragmento.
      const deAfuera = pila.slice(0, pila.indexOf(contenedor));
      const ancestros = deAfuera.map((n) => `<${n.tag}${n.atributos}>`).join("");
      return ancestros + cerrarDesde(html, contenedor);
    }
    if (!autocierre && !VACIOS.has(tag)) pila.push({ tag, atributos, inicio: m.index });
  }
  throw new Error("La página no tiene <h1>");
}

/** Recorta desde la apertura de `nodo` hasta su cierre balanceado. */
function cerrarDesde(html: string, nodo: Nodo): string {
  const re = new RegExp(`<(/?)${nodo.tag}\\b[^>]*>`, "g");
  re.lastIndex = nodo.inicio;
  let profundidad = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    profundidad += m[1] ? -1 : 1;
    if (profundidad === 0) return html.slice(nodo.inicio, m.index + m[0].length);
  }
  return html.slice(nodo.inicio);
}

/** Cada `style="…"` del fragmento que esconde lo que envuelve. */
function estilosQueEsconden(fragmento: string): string[] {
  const estilos = [...fragmento.matchAll(/style="([^"]*)"/g)].map((m) => m[1]);
  return estilos.filter((css) => {
    const limpio = css.replace(/\s+/g, "");
    return /(^|;)opacity:0(\.0+)?(;|$)/.test(limpio) || /(^|;)visibility:hidden(;|$)/.test(limpio);
  });
}

describe("el titular sale visible del servidor, sin esperar JavaScript", () => {
  let renderizadas: Map<string, string | Error>;
  beforeAll(async () => {
    renderizadas = await renderizarPublicadas();
  }, TIEMPO_PARA_RENDERIZAR);

  it("cada ruta publicada tiene su page.tsx (si no, el gate no la estaría midiendo)", () => {
    expect(RUTAS_PUBLICADAS.length).toBeGreaterThanOrEqual(14);
    expect(RUTAS_PUBLICADAS.filter((ruta) => !PAGINA_DE_RUTA.has(ruta))).toEqual([]);
  });

  for (const ruta of RUTAS_PUBLICADAS) {
    it(`${ruta}: el bloque del <h1> no trae nada escondido en línea`, () => {
      const bloque = bloqueDelTitular(htmlDe(renderizadas, ruta));
      expect(bloque).toMatch(/<h1\b/);
      expect(estilosQueEsconden(bloque)).toEqual([]);
    });
  }

  it("el detector reconoce el patrón que rompió producción (opacity:0 de motion)", () => {
    const html =
      '<main><section class="b"><div style="opacity:0;transform:translateY(24px)"><h1>Hola</h1></div></section></main>';
    expect(estilosQueEsconden(bloqueDelTitular(html))).toEqual(["opacity:0;transform:translateY(24px)"]);
  });

  it("el detector ve un ancestro transparente por FUERA del bloque (los legales)", () => {
    const html =
      '<main><div style="opacity:0;transform:translateY(24px)"><header><h1>Privacidad</h1></header></div></main>';
    expect(estilosQueEsconden(bloqueDelTitular(html))).toEqual(["opacity:0;transform:translateY(24px)"]);
  });

  it("el detector no confunde una opacidad parcial con esconder", () => {
    const html = '<section><h1>Hola</h1><span style="opacity:0.55">nota</span></section>';
    expect(estilosQueEsconden(bloqueDelTitular(html))).toEqual([]);
  });
});

/**
 * La entrada en CSS tampoco puede arrancar transparente. Medido el 2026-10-02
 * con Chromium: un elemento cuyo PRIMER paint es `opacity: 0` queda fuera del
 * LCP para siempre, aunque la animación lo muestre al frame siguiente. Con el
 * fundido, /precios «bajó» a 408 ms porque Chrome tomó como LCP el botón del
 * header y nunca el titular: el número mejoraba mintiendo, y el titular seguía
 * entrando desde invisible. Sin fundido, el LCP mide lo que se ve.
 */
describe("la <Entrada> del hero no arranca transparente", () => {
  const css = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "..", "motion", "entrada.module.css"),
    "utf8",
  ).replace(/\/\*[\s\S]*?\*\//g, "");

  it("ningún keyframe pone opacity en 0", () => {
    const keyframes = [...css.matchAll(/@keyframes[^{]+\{([\s\S]*?\})\s*\}/g)].map((m) => m[1]);
    expect(keyframes.length).toBeGreaterThan(0);
    for (const cuerpo of keyframes) {
      expect(cuerpo.replace(/\s+/g, "")).not.toMatch(/opacity:0(\.0+)?(;|\})/);
    }
  });

  it("con prefers-reduced-motion no anima", () => {
    expect(css).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[^}]*animation:\s*none/);
  });
});

