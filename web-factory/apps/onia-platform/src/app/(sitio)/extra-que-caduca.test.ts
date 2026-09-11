import { describe, expect, it } from "vitest";

import {
  A_MEDIDA,
  CHATBOT_STACKS,
  META_NOTA,
  RECARGA,
  fmtBs,
} from "@/content/chatbot-precios";

/**
 * Un EXTRA que se ofrece en la venta se ofrece con su PRECIO y con su VIGENCIA.
 *
 * Medido el 2026-09-11 en producción. `/chatbot` vendía el add-on y su bala de
 * salida decía, textual: *«si se agotan, las nuevas pasan a una persona de tu
 * equipo y podés sumar más»*. «Podés sumar más» es un producto PAGO —
 * `RECARGA_CONVERSACIONES` (`onia-platform/lib/pricing.ts`): 200 conversaciones
 * por Bs 190 — y el sitio no nombraba ninguna de las dos cosas que le cuestan
 * plata al dueño:
 *
 *  1. **cuánto cuesta** — `grep -c 190` daba 0 en la home, `/chatbot` y
 *     `/precios`, así que el lead descubría el precio del extra recién contra
 *     la pared, el día que sus clientes empezaban a rebotar;
 *  2. **cuánto dura** — y ésta es la mitad que más engaña, porque lo natural es
 *     suponer que lo comprado se acumula. `aplicarRecarga()` escribe
 *     `recargadas` en la fila del MES en curso (`chatbot_uso_mensual`, clave
 *     `organizationId_mes`): el 1 empieza una fila nueva en cero y lo pagado no
 *     viaja. Se compran 200 conversaciones que el 1 valen 0.
 *
 * POR QUÉ NINGÚN GATE PODÍA VERLO, que es lo que hace nueva a la clase:
 *  - no sobra ninguna palabra → invisible a todo barrido de prohibidos
 *    (`obra.test.ts`, `obra-literal.test.ts`, `hueco-declarado.test.ts`);
 *  - **no había cifra publicada que pudiera estar mal**, justamente porque el
 *    precio no se decía: `precios.test.ts`, `precios-addons.test.ts` y el cruce
 *    `scripts/precios-fuente.mjs` pasaban los tres en verde sobre el defecto —
 *    un cruce sólo puede comparar lo que los DOS lados publican;
 *  - no promete gente ni niega nada → invisible a `promesa-humana.test.ts` y a
 *    `hueco-declarado.test.ts`;
 *  - `limite-que-corta.test.ts` exige que el cupo se NOMBRE y esa bala lo
 *    nombra, así que el hermano de al lado daba verde y hacía leer la familia
 *    como cubierta.
 *
 * Es el escalón que sigue a «la venta no dice el límite que el producto
 * aplica» (cerrado el 2026-09-06, mismo add-on): allá se callaba **cuánto te
 * dan**; acá, **cuánto te cuesta salir del límite y cuánto te dura**. La mitad
 * de adentro del producto —que el panel avise la vigencia al comprar— la cerró
 * el carril del chatbot el mismo día; ésta es su simétrica en la superficie que
 * VENDE, que es donde el dueño decide.
 *
 * MEDIDO SOBRE EL TEXTO RESUELTO, nunca sobre el fuente: el archivo tiene
 * comentarios que narran este mismo defecto (darían rojo sobre la bitácora) y
 * la bala arma el precio con `${…}`, que un barrido del fuente tendría que
 * borrar para no confundirse — y borrándolo desaparece justo el número que hay
 * que exigir. Lo que el lead lee es lo que el módulo DEVUELVE.
 */

/** Toda la copia del chatbot que una página puede renderizar, ya resuelta. */
const COPIA: readonly string[] = [
  ...CHATBOT_STACKS.flatMap((s) => [
    s.nombre,
    s.paraQuien,
    s.resuelve,
    ...s.incluye,
    ...s.noIncluye,
    ...s.necesitasVos,
  ]),
  A_MEDIDA,
  META_NOTA,
];

/**
 * Ofrecer MÁS cupo del incluido. Persigue la OFERTA, no la forma mala de
 * escribirla: así el sujeto sigue existiendo después del arreglo — un detector
 * que buscara «podés sumar más» se quedaría sin universo el día que se corrige
 * y dejaría de cuidar la frase justo cuando empieza a importar.
 */
const OFRECE_EXTRA = /\b(sum[aá]\w*|recarg\w*|comprar?\b|amplia\w*)\b[^.;]{0,60}\b(m[aá]s|conversaciones|cupo)\b/i;

/** El precio del extra, dicho como lo dice el sitio: «Bs 190». */
const DICE_EL_PRECIO = new RegExp(`Bs\\s*${fmtBs(RECARGA.precio)}(?!\\d)`);

/**
 * Que se termina con el mes. Se aceptan las formas en que un boliviano lo dice;
 * lo que NO se acepta es el silencio. «no se acumulan» sola alcanza: dice lo
 * mismo desde el otro lado.
 */
const DICE_LA_VIGENCIA =
  /(hasta fin de mes|hasta el fin de mes|dentro del mes|ese mismo mes|no se acumulan|no se acumula|vencen a fin de mes|se renueva|del mes en curso)/i;

describe("un extra de cupo se ofrece con su precio y su vigencia", () => {
  /**
   * ANCLA. Sin esto el gate se satisface BORRANDO la oferta: quedaría verde y
   * vacío, y el día que alguien la reponga entra sin auditoría porque «ya
   * estaba en verde». Es el par que le falta a todo gate que persigue una
   * condición sobre un sujeto opcional.
   */
  it("la venta OFRECE el extra (si no, este gate no está midiendo nada)", () => {
    const ofertas = COPIA.filter((t) => OFRECE_EXTRA.test(t));
    expect(
      ofertas.length,
      "Ninguna línea de la copia del chatbot ofrece sumar cupo. Si la oferta se " +
        "retiró a propósito, este gate quedó sin sujeto y hay que decirlo acá; " +
        "si no, el detector dejó de reconocerla y el extra volvió a venderse mudo.",
    ).toBeGreaterThan(0);
  });

  it("cada oferta dice cuánto cuesta, en la MISMA frase", () => {
    const mudas = COPIA.filter(
      (t) => OFRECE_EXTRA.test(t) && !DICE_EL_PRECIO.test(t),
    );
    expect(
      mudas,
      `Ofrece sumar cupo sin decir que cuesta Bs ${fmtBs(RECARGA.precio)}. El ` +
        "precio va PEGADO a la oferta: una salvedad en la oración siguiente es " +
        "de otra promesa, y al pie no la lee nadie.",
    ).toEqual([]);
  });

  it("cada oferta dice que lo comprado se termina con el mes", () => {
    const mudas = COPIA.filter(
      (t) => OFRECE_EXTRA.test(t) && !DICE_LA_VIGENCIA.test(t),
    );
    expect(
      mudas,
      "Ofrece sumar cupo sin decir que vale hasta fin de mes. `aplicarRecarga()` " +
        "escribe sobre la fila del mes en curso: el 1 vuelve a cero. Callarlo le " +
        "vende al dueño algo que cree que se acumula y no se acumula.",
    ).toEqual([]);
  });

  /**
   * El número del extra sale de `RECARGA`, que es el espejo cruzado contra el
   * producto por `npm run precios:fuente`. Si alguien lo tipea, el cruce deja
   * de protegerlo: es la misma trampa que abre `CLAUDE.md`.
   */
  it("la cantidad ofrecida es la que el producto entrega", () => {
    const ofertas = COPIA.filter((t) => OFRECE_EXTRA.test(t));
    const conCantidad = ofertas.filter((t) =>
      new RegExp(`\\b${RECARGA.conversaciones}\\b`).test(t),
    );
    expect(
      conCantidad.length,
      `Ninguna oferta nombra las ${RECARGA.conversaciones} conversaciones que ` +
        "suma una recarga. Decir el precio sin la cantidad no deja comparar nada.",
    ).toBeGreaterThan(0);
  });
});
