import { describe, expect, it } from "vitest";

import { PLAN_INCLUYE, RUBRO_OPTIONS } from "./data";
import type { Rubro } from "./recommend";

/**
 * El resultado del wizard no le muestra a un rubro los módulos de otro.
 *
 * **El caso vivo, medido el 2026-09-06 manejando `onia.com.bo/v1/empezar`
 * (HTTP 200, cero fallos de red) como si fuera un lead de Comercio:** eligiendo
 * «Comercio» → «2 a 5» → «Nada de esto todavía», la pantalla de pago del wizard
 * —la última antes del botón de WhatsApp— contestaba:
 *
 *     Esto es lo que encenderíamos para vos.
 *     Armado con tus 3 respuestas — nada genérico.
 *       · Agenda
 *       · Historia clínica con odontograma      ← a una TIENDA
 *       · Cobros y caja
 *       · Agente IA que reprograma
 *
 * `PLAN_INCLUYE` era UNA lista plana, escrita para dental, y `VarianteDental`
 * la pintaba sin mirar el rubro. Como los cinco rubros de `RUBRO_OPTIONS` están
 * `disponible: true`, los cinco caen en esa variante: el odontograma le salía a
 * comercio, importadora, estética y servicios — **cuatro de cada cinco leads**,
 * y encima debajo de la frase «nada genérico», que lo vuelve una promesa rota a
 * la vista. Es la regla de `CLAUDE.md`: *«No se le vende sólo a clínicas: son 7
 * rubros. Nada de "tus pacientes" en material genérico»*.
 *
 * ⚠️ **Por qué ningún gate lo veía.** Los barridos de esta app persiguen texto
 * PROHIBIDO (obra, autobombo, un precio a mano) o enlaces muertos, y acá no
 * sobra ninguna palabra: «Historia clínica con odontograma» es copy legítimo —
 * en dental. El defecto no está en el literal sino en el PAR (rubro, módulo),
 * que ningún grep puede juzgar porque necesita saber a quién se le muestra.
 * Por eso el sujeto de este gate es el cruce, no el texto.
 */

/**
 * Vocabulario que pertenece a UN rubro y a ninguno de los otros. La lista es
 * corta a propósito: cada término es de los que un dueño reconoce como «esto no
 * es lo mío» en un segundo, que es exactamente el daño que hace verlo.
 */
const EXCLUSIVO: Record<string, { de: Rubro; patron: RegExp }> = {
  odontograma: { de: "dental", patron: /odontograma/i },
  "historia clínica": { de: "dental", patron: /historia cl[ií]nica/i },
  paciente: { de: "dental", patron: /\bpacientes?\b/i },
  "cobro QR": { de: "comercio", patron: /cobro QR/i },
  "costeo de importación": { de: "proveedores", patron: /costeo de importaci[oó]n/i },
  tratamiento: { de: "estetica", patron: /\btratamientos?\b/i },
};

describe("los módulos del resultado son los del rubro que eligió el lead", () => {
  /*
   * El ancla del SUJETO. `PLAN_INCLUYE` era un array plano; si alguien lo
   * vuelve a aplanar, los `it.each` de abajo recorrerían `undefined` y pasarían
   * en verde sobre el defecto entero. Acá se afirma que existe una lista POR
   * rubro, que es la forma que hace la pregunta posible.
   */
  it("cada rubro que el selector ofrece tiene su propia lista de módulos", () => {
    for (const o of RUBRO_OPTIONS) {
      const modulos = PLAN_INCLUYE[o.id];
      expect(
        Array.isArray(modulos) && modulos.length > 0,
        `«${o.nombre}» se ofrece en el selector y no tiene módulos propios: ` +
          `cae en la lista de otro rubro`,
      ).toBe(true);
    }
  });

  it.each(RUBRO_OPTIONS.map((o) => [o.id, o.nombre] as const))(
    "%s no recibe vocabulario de otro rubro",
    (id, nombre) => {
      const texto = (PLAN_INCLUYE[id] ?? []).join(" · ");
      for (const [termino, { de, patron }] of Object.entries(EXCLUSIVO)) {
        if (de === id) continue;
        expect(
          patron.test(texto),
          `a «${nombre}» se le ofrece «${termino}», que es de ${de}. ` +
            `Lo que ve el lead: ${texto}`,
        ).toBe(false);
      }
    },
  );

  /*
   * El caso que YA cumple. Sin esto, un `PLAN_INCLUYE` vaciado —o con listas de
   * una palabra inocua— dejaría los dos `it` de arriba en verde: el gate diría
   * que el defecto se arregló cuando lo que pasó es que no queda nada que
   * mirar. Dental es el único rubro al que el odontograma SÍ le corresponde, y
   * tiene que poder seguir escrito.
   */
  it("dental conserva su odontograma: el gate no obliga a borrar copy legítimo", () => {
    expect(PLAN_INCLUYE.dental.join(" · ")).toMatch(/odontograma/i);
  });
});
