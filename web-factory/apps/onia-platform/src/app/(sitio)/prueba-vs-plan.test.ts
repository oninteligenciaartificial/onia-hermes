import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { PLANES, PRUEBA } from "@/lib/pricing";

/**
 * La PRUEBA entrega un plan; la tarjeta vende otro. Eso se dice ANTES de pagar.
 *
 * Medido el 2026-09-06. `onia-platform/lib/subscription/plan-state.ts` fija
 * `TRIAL_PLAN = "professional"` (= Pro) y `app/api/auth/register/route.ts:272`
 * da de alta **toda** cuenta con ese plan: apriete el lead la tarjeta que
 * apriete, sus 14 días corren con el Pro. La tabla de precios no lo decía.
 *
 * Lo que le pasaba a quien elige el Básico —el plan más barato, o sea el
 * camino más transitado—:
 *  1. aprieta «Empezar» en Básico;
 *  2. usa 14 días con Pro: agentes de IA, reservas online, reportes completos,
 *     1.500 fichas y 5 usuarios;
 *  3. paga Bs 320;
 *  4. se le apagan los agentes, las reservas y los reportes, y los topes bajan
 *     a 300 fichas y 2 usuarios.
 * Y si durante la prueba cargó más de 300 fichas, `checkPatientLimit`
 * (`lib/plan-limits.ts:208`) deja de dejarlo crear: *«Tu plan permite hasta 300
 * pacientes activos. Tienes 800»*. La decepción llega **después de cobrar**,
 * que es el peor momento en el que puede llegar.
 *
 * POR QUÉ NINGÚN GATE LO VEÍA, que es lo que hace nueva a esta clase:
 *  - no sobra ninguna palabra → invisible a `obra.test.ts`, `forma.test.ts`,
 *    `hueco-declarado.test.ts`;
 *  - los montos salen bien de la fuente → `precios.test.ts` y
 *    `precios-addons.test.ts` pasan en verde sobre el defecto;
 *  - no niega nada ni promete gente → invisible a `hueco-declarado.test.ts` y
 *    a `promesa-humana.test.ts`;
 *  - no le falta el límite a ninguna capacidad → invisible a
 *    `limite-que-corta.test.ts`.
 * Los ejes que la casa ya vigila son lo que SOBRA, lo que FALTA en cobertura y
 * la capacidad sin su límite. Éste es un cuarto: **lo que la prueba entrega no
 * es lo que la tarjeta vende**, y el desajuste sólo se descubre pagando.
 *
 * LO QUE LO MANTUVO ESCONDIDO, y por eso el caso `TIPEADA_A_MANO` existe: el
 * texto honesto **ya estaba escrito** en la fuente (`PRUEBA.copy`, que dice
 * «corriendo con el plan Pro completo»), y una sola pantalla lo leía
 * (`/empezar`). La tabla de precios —donde el lead ELIGE— tipeaba a mano
 * «corriendo con este mismo plan», y como esa nota se pintaba únicamente en la
 * tarjeta destacada, que es justo el Pro, el literal a mano era **cierto donde
 * se veía**. Un defecto que sólo miente en las tarjetas donde nadie lo escribió
 * no lo encuentra ningún barrido de literales: hay que preguntar por el par
 * (plan, nota).
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const SRC = join(AQUI, "..", "..");

/**
 * Sujetos derivados del DISCO, no de una lista escrita a mano: así una pantalla
 * nueva nace cubierta y hay que excluirla a la vista. Es la corrección que ya
 * pagamos dos veces (`compartir.test.ts` sacaba sus rutas del sitemap;
 * `precios.test.ts` tenía cuatro raíces a mano y dejaba `app/v1/**` afuera).
 */
const EXENTOS = [
  join("lib", "pricing.ts"), // la fuente: acá SÍ vive el texto
];

function tsxDelSitio(dir: string, acc: string[] = []): string[] {
  for (const entrada of readdirSync(dir)) {
    if (entrada === "node_modules" || entrada.startsWith(".")) continue;
    const ruta = join(dir, entrada);
    if (statSync(ruta).isDirectory()) {
      tsxDelSitio(ruta, acc);
      continue;
    }
    if (!/\.tsx?$/.test(entrada)) continue;
    if (/\.test\.tsx?$/.test(entrada)) continue;
    if (EXENTOS.some((e) => ruta.endsWith(e))) continue;
    acc.push(ruta);
  }
  return acc;
}

const PANTALLAS = tsxDelSitio(SRC);

/** Comentarios fuera: el que explica el defecto no puede DISPARAR el gate. */
function sinComentarios(texto: string): string {
  return texto.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^[ \t]*\/\/.*$/gm, " ");
}

describe("la prueba entrega un plan y la tarjeta vende otro: se dice antes de pagar", () => {
  it("hay pantallas que auditar (si esto da 0, el barrido se quedó sin sujetos)", () => {
    expect(PANTALLAS.length).toBeGreaterThan(10);
  });

  /**
   * Caso 1 — el texto de la prueba NO se tipea a mano en ninguna pantalla.
   * `PRUEBA` es la fuente; una copia a mano es libre de decir otra cosa, y eso
   * es exactamente lo que pasó.
   */
  it("ninguna pantalla tipea a mano la nota de la prueba", () => {
    const A_MANO = /\b\d+\s+d[ií]as\s+de\s+prueba\b|corriendo\s+con\s+este\s+mismo\s+plan/i;
    const culpables = PANTALLAS.filter((ruta) =>
      A_MANO.test(sinComentarios(readFileSync(ruta, "utf8"))),
    ).map((ruta) => relative(SRC, ruta));

    expect(
      culpables,
      `Estas pantallas escriben la nota de la prueba a mano en vez de leerla de ` +
        `PRUEBA (src/lib/pricing.ts). Una copia a mano puede contradecir a la ` +
        `fuente sin que nada se ponga rojo: ${culpables.join(", ")}`,
    ).toEqual([]);
  });

  /**
   * Caso 2 — CADA plan comprable dice con qué plan corre su prueba.
   * El botón arranca la misma prueba en las tres tarjetas, así que las tres
   * tienen que decirlo; hoy la nota vivía detrás de `plan.destacado &&`.
   */
  it("cada plan tiene su nota de prueba, no sólo el destacado", () => {
    const sinNota = PLANES.filter((p) => !PRUEBA.notaPorPlan[p.id]).map((p) => p.nombre);

    expect(
      sinNota,
      `Estos planes no dicen con qué plan corre la prueba, y su botón arranca ` +
        `la misma prueba que el resto: ${sinNota.join(", ")}`,
    ).toEqual([]);
  });

  /**
   * Caso 3 — «este mismo plan» sólo lo puede decir el plan que de verdad corre.
   * Es el par (plan, nota): el literal es copy legítimo en la tarjeta del Pro y
   * mentira en las otras dos, así que ningún barrido de literales lo puede
   * juzgar sin mirar de quién es la tarjeta.
   */
  it("sólo el plan que corre la prueba puede decir «este mismo plan»", () => {
    const mentirosos = PLANES.filter(
      (p) =>
        /este mismo plan/i.test(PRUEBA.notaPorPlan[p.id] ?? "") &&
        p.nombre !== PRUEBA.planQueCorre,
    ).map((p) => p.nombre);

    expect(
      mentirosos,
      `La prueba corre con el plan ${PRUEBA.planQueCorre}. Estas tarjetas dicen ` +
        `«este mismo plan» y no son ése: ${mentirosos.join(", ")}`,
    ).toEqual([]);
  });

  /**
   * Caso 4 — el plan que NO corre la prueba nombra al que sí.
   * No alcanza con no mentir: si el lead va a recibir 14 días de otro nivel,
   * la tarjeta que está mirando tiene que nombrarlo.
   */
  it("el plan que no corre la prueba nombra al que sí", () => {
    const mudos = PLANES.filter((p) => {
      if (p.nombre === PRUEBA.planQueCorre) return false;
      const nota = PRUEBA.notaPorPlan[p.id] ?? "";
      return !nota.includes(PRUEBA.planQueCorre);
    }).map((p) => p.nombre);

    expect(
      mudos,
      `La prueba corre con ${PRUEBA.planQueCorre}. Estas tarjetas no lo nombran, ` +
        `así que su lead se entera al pagar: ${mudos.join(", ")}`,
    ).toEqual([]);
  });

  /**
   * Caso 5 — el CAMINO, no sólo el dato.
   *
   * Este caso existe porque los cuatro de arriba no alcanzaban, y se descubrió
   * MUTANDO: con `notaPorPlan` completo y correcto, volver a envolver la nota
   * en `{plan.destacado && (…)}` dejaba dos tarjetas mudas otra vez y los 734
   * tests pasaban en VERDE. Es la trampa que la casa ya pagó tres veces
   * (`/requerimientos`, `/empresa`, `/rrhh`): **permiso concedido, camino
   * ausente**. Un gate que verifica el dato no ve la pantalla.
   *
   * Lo ideal sería renderizar el componente, pero el entorno de test de esta
   * app no procesa JSX (`rolldown` sin plugin de React), así que se mide la
   * estructura: dentro del pie de la tarjeta y ANTES del botón no puede haber
   * ninguna condición — ahí va la nota, y va para las tres. El botón sí usa
   * `destacado` para su etiqueta y su estilo, y queda fuera de la ventana.
   */
  it("la nota se pinta en las tres tarjetas, no detrás de una condición", () => {
    const pricing = readFileSync(
      join(SRC, "components", "landing-v1", "pricing.tsx"),
      "utf8",
    );

    const pie = pricing.match(/styles\.planCta[\s\S]*?<a\b/)?.[0];

    expect(
      pie,
      "No encontré el pie de la tarjeta (styles.planCta … <a). Si lo renombraste, " +
        "actualizá este gate: sin la ventana no mide nada y se queda ciego callado.",
    ).toBeDefined();

    expect(
      /destacado/.test(pie ?? ""),
      "La nota de la prueba está condicionada dentro del pie de la tarjeta. El " +
        "botón de los tres planes arranca la misma prueba: si la nota sólo se " +
        "pinta en el destacado, las otras dos tarjetas vuelven a callar que la " +
        `prueba corre con ${PRUEBA.planQueCorre} y su lead se entera al pagar.`,
    ).toBe(false);

    expect(
      /notaPorPlan\[plan\.id\]/.test(pie ?? ""),
      "El pie de la tarjeta no lee PRUEBA.notaPorPlan[plan.id].",
    ).toBe(true);
  });

  /**
   * ANCLA — un caso que YA cumple hoy.
   * La memoria de la casa (2026-09-06): un test de guarda escrito sólo contra
   * el caso que falla queda de adorno el día que alguien recorta el árbol. Si
   * `/empezar` deja de leer `PRUEBA.copy`, este caso lo dice.
   */
  it("/empezar sigue leyendo el copy de la prueba desde la fuente", () => {
    const empezar = readFileSync(join(SRC, "app", "(sitio)", "empezar", "page.tsx"), "utf8");
    expect(empezar).toMatch(/PRUEBA\.copy/);
  });

  /** El copy de la fuente nombra el plan que corre: si no, todo lo de arriba miente. */
  it("PRUEBA.copy nombra el plan con el que corre", () => {
    expect(PRUEBA.copy).toContain(PRUEBA.planQueCorre);
  });
});
