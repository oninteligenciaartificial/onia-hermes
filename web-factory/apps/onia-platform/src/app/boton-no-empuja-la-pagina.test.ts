import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * Un botón nunca es más ancho que su lugar.
 *
 * POR QUÉ EXISTE ESTE GATE. Medido el 2026-09-17 contra producción, con
 * Chromium a 320px (el iPhone SE, el más angosto que sigue vivo):
 * `/v1/funciones/facturacion-electronica-siat` tenía `scrollWidth` 350 sobre un
 * viewport de 320 — la página entera se movía 30px de costado— y el culpable
 * era su CTA principal: «Dejá tu operación lista — 14 días gratis» pedía 338px
 * dentro de 320 y se salía por la derecha. `/v1/chatbot` se movía 8px por lo
 * mismo. Los tres `.btn` del repo declaraban `white-space: nowrap` y ninguno
 * declaraba `max-width`, así que el ancho del botón lo decidía el LARGO DEL
 * TEXTO y nada lo frenaba.
 *
 * Y el largo del texto no lo decide el diseño: lo decide el CATÁLOGO. Ya pasó
 * el 2026-09-17 en la otra punta —renombrar el plan a «Profesional» hizo que
 * «Empezar con el Profesional» pidiera 219px en una pastilla de 214 y la última
 * letra se pintara fuera del verde a 1440 y 1920 (`cf19a28e`)—. Un cambio de
 * dato de negocio rompe el layout, y por eso el cinturón tiene que estar en el
 * CSS y no en el criterio de quien escribe el copy.
 *
 * LA CURA, y por qué no cambia nada donde hoy está bien: `white-space: normal`
 * sólo parte cuando el texto NO entra —donde entra, se ve idéntico—, y
 * `max-width: 100%` es lo que impide que el botón empuje al documento. Probada
 * inyectándola con `addStyleTag` sobre producción, 6 pantallas × 5 vistas: 30→0px
 * en la de facturación, 8→0px en `/v1/chatbot`, y cero desbordes nuevos en las
 * otras 28 mediciones.
 *
 * CÓMO NO FALLA EN VERDE. Los sujetos se derivan del DISCO —toda regla de
 * cualquier CSS de `src/` cuyo selector nombre un botón—, nunca de una lista de
 * archivos escrita a mano: había TRES `.btn` con el mismo agujero (`globals.css`,
 * `landing-v1/landing.module.css`, `site-header.module.css`) y una lista escrita
 * el día de la cura se queda corta con el cuarto. Si el parser se rompe y deja de
 * encontrar reglas, el test se pone ROJO por `MINIMO_SUJETOS` y por el caso ancla,
 * en vez de aprobar la nada.
 *
 * ⚠️ LÍMITE, dicho de frente: el universo sale del NOMBRE de la clase (`btn`),
 * que es la convención del repo. Un botón que se llame `.cta` o `.pill` no es
 * sujeto de nadie. Se eligió igual porque la alternativa —adivinar «esto parece
 * un botón» por su `padding` y su `border-radius`— arrastra media hoja de estilos
 * y el gate deja de poder decir por qué acusa.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const SRC = join(AQUI, "..");

/** Menos que esto = el parser se rompió, no es que el repo esté limpio. */
const MINIMO_SUJETOS = 4;

/** Los CUATRO que tenían el agujero el día que se escribió esto — a mano se
 * habían encontrado tres; el de la home lo destapó este gate. */
const ANCLAS = [
  "app/globals.css",
  "app/(sitio)/sitio.module.css",
  "components/landing-v1/landing.module.css",
  "components/site-header.module.css",
];

function css(dir: string): string[] {
  const salida: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next") continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) salida.push(...css(p));
    else if (e.name.endsWith(".css")) salida.push(p);
  }
  return salida;
}

type Regla = { archivo: string; selector: string; cuerpo: string };

/**
 * Las reglas de cada CSS, con los comentarios EN BLANCO: un `/* … *\/` que
 * mencione `white-space: nowrap` explicando por qué se sacó no puede acusar a
 * la regla que lo tiene al lado.
 */
function reglas(archivo: string): Regla[] {
  const crudo = readFileSync(archivo, "utf8");
  const limpio = crudo.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
  const salida: Regla[] = [];
  for (const m of limpio.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    salida.push({
      archivo: relative(SRC, archivo),
      selector: m[1].trim().replace(/\s+/g, " "),
      cuerpo: m[2],
    });
  }
  return salida;
}

/** Toda regla cuyo selector nombre un botón: `.btn`, `.btnPrimary`, `.btn-ghost`… */
const SUJETOS = css(SRC)
  .flatMap(reglas)
  .filter((r) => /\.btn/i.test(r.selector));

/**
 * Las que DECLARAN el botón base — selector exactamente `.btn`, que es donde
 * vive el cinturón. Una regla agrupada (`.btn, .card { transition… }`) nombra
 * al botón pero no lo define: exigirle `max-width` sería pedirle el cinturón a
 * la transición. Sigue siendo sujeto de la prohibición de `nowrap`, que es la
 * que puede escribirse en cualquiera de las dos.
 */
const BASES = SUJETOS.filter((r) => /^\.btn$/i.test(r.selector.trim()));

describe("un botón no empuja la página de costado", () => {
  it("encuentra los botones del disco, incluidos los tres que tenían el agujero", () => {
    expect(SUJETOS.length).toBeGreaterThanOrEqual(MINIMO_SUJETOS);
    for (const ancla of ANCLAS) {
      expect(
        BASES.map((r) => r.archivo),
        `el caso ancla ${ancla} salió del universo: el barrido dejó de ver su .btn`,
      ).toContain(ancla);
    }
  });

  it("ningún botón fija `white-space: nowrap`: es lo que convierte un CTA largo en desborde", () => {
    const culpables = SUJETOS.filter((r) => /white-space\s*:\s*nowrap/i.test(r.cuerpo)).map(
      (r) => `${r.archivo} → ${r.selector}`,
    );

    expect(
      culpables,
      "un botón con `nowrap` crece con el largo de su texto y no lo frena nadie; " +
        "el 2026-09-17 eso movió /v1/funciones/facturacion-electronica-siat 30px de lado en un iPhone SE",
    ).toEqual([]);
  });

  it("todo botón base declara `max-width`, que es lo que le impide desbordar", () => {
    const sinCinturon = BASES.filter((r) => !/max-width\s*:/i.test(r.cuerpo)).map(
      (r) => `${r.archivo} → ${r.selector}`,
    );

    expect(sinCinturon, "sin `max-width` el botón puede ser más ancho que su contenedor").toEqual(
      [],
    );
  });
});
