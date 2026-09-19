import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { ADDONS, PLANES, USUARIO_EXTRA_ADDON, alcanceDelUsuarioExtra, type Plan } from "@/lib/pricing";

/**
 * El add-on que se vende en VARIOS planes no puede nombrar UNO.
 *
 * 🔴 QUE PASO. Medido el 2026-09-19 sobre `onia.com.bo/precios` SERVIDA: la carta de add-ons decía
 * «Una persona más en el sistema. En Básico se pueden sumar hasta 3» — la ÚNICA frase de alcance
 * del add-on, y nombraba un solo plan. El producto (`onia-platform/lib/asientos.ts`, y
 * `checkUserLimit` que la aplica) los vende también en Crece y en Profesional, y ahí SIN TOPE:
 * «Bs 70/mes por persona, sin tope», textual en la tabla que el dueño ve en `/settings`.
 *
 * El lead de Profesional (5 usuarios, Bs 890) que necesitaba una persona más leía que el add-on
 * era cosa del Básico y le quedaba una sola salida: subir al Completo, Bs 1.290. La verdad era
 * 890 + 70 = Bs 960 — **Bs 330/mes de más**, Bs 3.960 al año. En Crece, Bs 270/mes. Y la misma
 * pantalla se desmentía sola tres renglones más arriba: «Ninguno te obliga a saltar de plan para
 * desbloquear una sola cosa».
 *
 * POR QUE NINGUN GATE LO VEIA, que es lo que hace nueva a esta clase:
 *  - no es una cifra mal: Bs 70 sale de la fuente y `precios:fuente` firma verde con sus 43;
 *  - no es una afirmación de INCLUSION («viene desde X») sino de RESTRICCION, así que
 *    `capacidad-incluida.test.ts` no la mira;
 *  - no es un universal («todos los planes», «cualquier plan») sino un PARTICULAR, así que
 *    `desbloqueo-que-no-se-tipea.test.ts` y los gates de alcance total tampoco.
 * Los gates de la casa persiguen prometer de MAS. Esto ofrece de MENOS, y eso no lo mira ninguno.
 *
 * SE ESCRIBE CONTRA LA FORMA, NO CONTRA EL TEXTO VIEJO: prohibir «En Básico» se apagaría solo el
 * día que el Básico sea el único que los venda, que es una respuesta legítima. Lo que se exige es
 * que la frase nombre a TODOS los que el catálogo dice que los venden, y que el copy no tipee
 * ningún nombre de plan a mano.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const PRICING = join(AQUI, "..", "..", "lib", "pricing.ts");

function filaDelUsuarioExtra() {
  const fila = ADDONS.find((a) => a.nombre === USUARIO_EXTRA_ADDON.nombre);
  if (!fila) throw new Error("el add-on de usuario extra salió de la carta: sujeto sin medir");
  return fila;
}

/** Los planes que el catálogo dice que VENDEN asientos extra (`null` = sin tope, `n > 0` = hasta n). */
function planesQueVenden(planes: readonly Plan[] = PLANES): readonly Plan[] {
  return planes.filter((p) => p.asientosExtra === null || (p.asientosExtra ?? 0) > 0);
}

describe("el alcance del add-on de usuario extra sale del catálogo", () => {
  it("el universo no está vacío: hay al menos un plan que los vende", () => {
    // Caso ancla. Sin esto, los dos casos de abajo pasarían en verde sobre una lista vacía.
    expect(planesQueVenden().length).toBeGreaterThan(0);
  });

  it("la frase nombra a TODOS los planes que los venden, no a uno", () => {
    const copy = filaDelUsuarioExtra().copy;
    const faltan = planesQueVenden()
      .map((p) => p.nombre)
      .filter((nombre) => !copy.includes(nombre));

    expect(
      faltan,
      `El add-on "${USUARIO_EXTRA_ADDON.nombre}" se vende en ${planesQueVenden().length} planes y ` +
        `su copy no nombra a ${faltan.join(", ")}. El lead de esos planes lee que el add-on no es ` +
        `para él, y la única salida que le queda es el escalón de arriba, que es más caro. ` +
        `Copy vivo: "${copy}"`,
    ).toEqual([]);
  });

  it("los planes que NO los venden no se nombran: no es una carencia", () => {
    const copy = filaDelUsuarioExtra().copy;
    const sobran = PLANES.filter((p) => p.asientosExtra === 0)
      .map((p) => p.nombre)
      .filter((nombre) => copy.includes(nombre));

    expect(
      sobran,
      `El copy nombra a ${sobran.join(", ")}, que no vende asientos extra porque sus usuarios no ` +
        `tienen tope. Nombrarlo ahí lo hace leer como una restricción suya.`,
    ).toEqual([]);
  });

  it("el copy no tipea ningún nombre de plan: sale de `alcanceDelUsuarioExtra`", () => {
    // La mitad que sobrevive a que alguien acierte la lista a mano HOY. Se mide sobre la FUENTE
    // leída como texto, porque el valor ya interpolado es indistinguible de uno tipeado.
    const fuente = readFileSync(PRICING, "utf8");
    const bloque = fuente.slice(fuente.indexOf("nombre: USUARIO_EXTRA_ADDON.nombre"));
    const copy = bloque.slice(bloque.indexOf("copy:"), bloque.indexOf("precio:"));
    const sinComentarios = copy.replace(/\/\/[^\n]*/g, "");

    expect(
      sinComentarios,
      "El copy del add-on de usuario extra tiene que derivar los planes de `alcanceDelUsuarioExtra()`.",
    ).toContain("alcanceDelUsuarioExtra(");

    for (const plan of PLANES) {
      expect(
        sinComentarios,
        `"${plan.nombre}" está TIPEADO en el copy del add-on. Un nombre a mano no se entera el día ` +
          `que el producto mueva quién vende asientos extra — que es exactamente como nació este bug.`,
      ).not.toContain(plan.nombre);
    }
  });

  it("el tope que se publica es el que el plan declara, no una constante suelta", () => {
    // `USUARIO_EXTRA_ADDON.maxEnBasico` y `asientosExtra` del Básico son el MISMO número escrito
    // dos veces; si se separan, la carta y la tarjeta del plan publican topes distintos.
    const basico = PLANES.find((p) => p.id === "basico");
    expect(basico?.asientosExtra).toBe(USUARIO_EXTRA_ADDON.maxEnBasico);
  });
});

describe("alcanceDelUsuarioExtra no se apaga sola", () => {
  const plan = (id: string, nombre: string, asientosExtra: number | null): Plan =>
    ({ ...PLANES[0], id, nombre, asientosExtra }) as unknown as Plan;

  it("con tope y sin tope, dice las dos cosas", () => {
    const frase = alcanceDelUsuarioExtra([
      plan("basico", "Básico", 3),
      plan("crece", "Crece", null),
      plan("pro", "Profesional", null),
      plan("full", "Completo", 0),
    ]);
    expect(frase).toContain("Básico");
    expect(frase).toContain("hasta 3");
    expect(frase).toContain("Crece y Profesional");
    expect(frase).not.toContain("Completo");
  });

  it("si mañana el producto le pone tope al Crece, la frase lo dice sola", () => {
    const frase = alcanceDelUsuarioExtra([
      plan("basico", "Básico", 3),
      plan("crece", "Crece", 2),
      plan("full", "Completo", 0),
    ]);
    expect(frase).toContain("en Crece se pueden sumar hasta 2");
    expect(frase).not.toContain("las que necesites");
  });

  it("si ningún plan los vende, no publica una lista vacía", () => {
    const frase = alcanceDelUsuarioExtra([plan("full", "Completo", 0)]);
    expect(frase).not.toMatch(/en\s*,/);
    expect(frase.length).toBeGreaterThan(0);
  });
});
