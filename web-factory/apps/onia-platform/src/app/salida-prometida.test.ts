import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { PAGINAS, archivoDe, cadenaHastaTexto } from "./rutas";

const SRC = path.resolve(__dirname, "..");
const TERMINOS = path.join(SRC, "content/legal/terminos.md");

/**
 * Ninguna página promete una SALIDA más ancha que la que concede el contrato.
 *
 * **El defecto que lo trajo, medido en producción el 2026-09-11.**
 * `onia.com.bo/v1/precios` (HTTP 200, 70 KB) abría con:
 *
 * > «Pagás mensual, semanal o anual, y **cancelás cuando quieras**.»
 *
 * y el contrato que ese mismo lead acepta al crear la cuenta dice lo contrario
 * en dos renglones (`content/legal/terminos.md` §3.3, status vigente):
 *
 * > «Podés **no renovar** avisando antes del inicio del nuevo período; no hay
 * > penalidad por no renovar. […] lo pagado cubre el período en curso y **no se
 * > reembolsa de forma anticipada**.»
 *
 * No son la misma promesa. *No renovar* es dejar que el ciclo termine; *cancelar
 * cuando quieras* es salirse en el medio, y quien lo lee al lado del precio
 * **anual** —Bs 7.500 el Pro, Bs 15.000 el Full, pagados por adelantado— entiende
 * que puede irse en el mes 2 y recuperar el resto. El contrato dice que no. Es la
 * lectura más cara posible, en la pantalla donde se decide el gasto más grande.
 *
 * **Por qué no lo veía ningún gate del carril**, que es lo que lo vuelve una
 * clase y no un typo. La familia entera juzga la venta contra el PRODUCTO —qué
 * capacidades tiene (`capacidad-vs-precio`, `capacidad-acotada`), qué cobra
 * (`precios`, `precios-fuente`), qué entrega (`hueco-declarado`,
 * `promesa-humana`)—; y `envio-automatico-en-el-contrato` mide el contrato
 * contra el producto. **Nadie leía el contrato como FUENTE y la venta como
 * SUJETO.** Con esa pregunta ausente, la frase pasaba los seis cortes:
 *
 * - ninguna palabra prohibida, ni obra, ni autobombo;
 * - ningún monto fuera de fuente: no lleva un solo número;
 * - ningún enlace roto ni capacidad inexistente;
 * - no promete trabajo humano ni un plazo;
 * - y leída sola es una frase perfectamente legítima —de hecho es la frase que
 *   escribe cualquier SaaS con tarjeta y renovación automática—, así que ni
 *   mirando la pantalla salta: hay que tener el contrato al lado.
 *
 * El resto del sitio estaba bien y eso es lo que la escondía: las otras DOCE
 * copias del mismo compromiso usan la forma acotada («sin permanencia», «no
 * renovás cuando quieras, sin penalidad», «podés no renovar»). Una sola decía la
 * forma fuerte, y un barrido que sólo busca lo que sobra no puede ver que una
 * afirmación es más ancha que su hermana.
 *
 * ⚠️ **Lo que este gate NO prohíbe, a propósito.** La firma es *salida sin
 * condición*, no la palabra «cancelar»:
 *
 * - **«No renovás cuando quieras», «podés no renovar sin penalidad»** — es
 *   exactamente lo que §3.3 concede, y un patrón que las coma obliga a borrar el
 *   copy honesto.
 * - **«Podés terminar en cualquier momento no renovando»** — la redacción del
 *   propio contrato: fuerte en apariencia y acotada en el mismo renglón.
 * - **Cancelar una CITA, un turno o un pedido** — es una función del producto,
 *   no una cláusula: el cliente del cliente sí las cancela cuando quiere.
 * - **«Sin permanencia»** sola, que es verdad y está en §3.3 con esas palabras.
 */

/** No cruza fin de oración: una persona lee una frase, no un archivo. */
const SEP = '[^.;!?"]';

/** Irse del servicio, dicho como acto propio del lead. */
const SALIDA =
  "\\b(?:cancel(?:[aá]s|[aá]|ar|arlo|arla|amos)|" +
  "(?:te )?d[aá]s de baja|darte de baja|" +
  "termin(?:[aá]s|ar|[aá])|" +
  "te v[aá]s|salirte|irte)\\b";

/** Sin condición: lo que convierte la salida en una promesa más ancha que §3.3. */
const CUANDO_QUIERAS =
  "\\b(?:cuando quieras|cuando quieran|en cualquier momento|" +
  "cuando se te ocurra|sin avisar|sin dar explicaciones)\\b";

/**
 * Cómo la concede el contrato de verdad. Si aparece en la MISMA oración, la
 * frase está acotada y es correcta: «no renovás cuando quieras» es §3.3 literal.
 */
const COMO_LA_CONCEDE = "\\bno\\s+(?:la\\s+|lo\\s+)?renov\\w*\\b";

/**
 * Lo que se cancela no siempre es el contrato. Estas son cosas del PRODUCTO que
 * el cliente sí cancela cuando quiere, y que no tienen nada que ver con §3.3.
 */
const OTRA_COSA =
  "\\b(?:cita|citas|turno|turnos|reserva|reservas|pedido|pedidos|env[ií]o|" +
  "recordatorio|recordatorios|factura|facturas|suscripci[oó]n al bolet[ií]n)\\b";

/**
 * Una oración que ofrece la salida SIN la condición con la que el contrato la da.
 * Los dos ingredientes en cualquier orden, y ni el acote ni el objeto ajeno.
 */
const SALIDA_SIN_CONDICION = new RegExp(
  `(?:^|["\\.;!?]\\s*)(` +
    `(?=${SEP}*?${SALIDA})` +
    `(?=${SEP}*?${CUANDO_QUIERAS})` +
    `(?!${SEP}*?${COMO_LA_CONCEDE})` +
    `(?!${SEP}*?${OTRA_COSA})` +
    `${SEP}+)`,
  "i",
);

/** El contrato, aplanado igual que lee el gate las páginas. */
function contrato(): string {
  return readFileSync(TERMINOS, "utf8").replace(/\s+/g, " ");
}

describe("ninguna página promete una salida que el contrato no concede", () => {
  /*
   * ANCLA 1 — contra el fallo ABIERTO del instrumento. Si el resolver de
   * imports se rompe, el recorrido no visita nada, ningún patrón matchea y el
   * gate firma verde sobre un sitio sin vigilancia. Se ancla en una frase que
   * vive en un componente IMPORTADO (la FAQ), no en el `page.tsx`: eso prueba
   * además que el recorrido entra a los imports, que es donde el sitio escribe
   * casi todas sus condiciones.
   */
  it("el recorredor llega al texto de la FAQ, dentro de un import de /v1/precios", () => {
    const precios = PAGINAS.find((p) => p.ruta === "/v1/precios");
    expect(precios, "no existe la página /v1/precios").toBeDefined();
    const hallado = cadenaHastaTexto(archivoDe(precios!), /¿Hay contrato de permanencia\?/i);
    expect(hallado, "el recorredor no llegó a la FAQ: mide en falso").not.toBeNull();
    expect(hallado!.cadena.length).toBeGreaterThan(1);
  });

  /*
   * ANCLA 2 — el contrato sigue concediendo lo que este gate supone. Sin esto,
   * el día que §3.3 pase a permitir la baja anticipada con devolución, el gate
   * seguiría prohibiendo una frase que ya sería verdadera: un guardia que
   * defiende un dato vencido. Si esto se pone rojo, lo que hay que revisar es el
   * gate, no la página.
   */
  it("el contrato concede NO RENOVAR, no la baja anticipada", () => {
    const texto = contrato();
    expect(
      /no hay penalidad por no renovar/i.test(texto),
      "§3.3 dejó de decir que no hay penalidad por no renovar",
    ).toBe(true);
    expect(
      /no se reembolsa de forma anticipada/i.test(texto),
      "§3.3 dejó de decir que lo pagado no se reembolsa de forma anticipada: " +
        "si ahora se concede la baja anticipada, este gate hay que reescribirlo",
    ).toBe(true);
  });

  it("el patrón reconoce la promesa que estaba viva y sus variantes", () => {
    for (const vivo of [
      // Servida en onia.com.bo/v1/precios hasta el 2026-09-11.
      "Pagás mensual, semanal o anual, y cancelás cuando quieras.",
      "Cancelás en cualquier momento, sin letra chica.",
      "Te das de baja cuando quieras.",
      "Podés cancelar cuando quieras y te devolvemos lo que no usaste",
    ]) {
      expect(
        SALIDA_SIN_CONDICION.test(vivo),
        `el gate dejó de reconocer una salida sin condición: «${vivo}»`,
      ).toBe(true);
    }
  });

  it("el patrón perdona la forma acotada, la del contrato y la del producto", () => {
    for (const [texto, porque] of [
      [
        "Pagás por adelantado el ciclo que elijas y no renovás cuando quieras: sin permanencia y sin penalidad.",
        "es §3.3 dicho en castellano: la forma acotada es la correcta",
      ],
      [
        "No. Pagás por adelantado el ciclo que elijas —semana, mes o año— y no renovás cuando quieras, sin penalidad.",
        "la FAQ viva, acotada en la misma oración",
      ],
      [
        "Podés terminar en cualquier momento no renovando.",
        "es la redacción del propio contrato (§10.2)",
      ],
      [
        "No hay contrato de permanencia: lo pagado cubre el período en curso.",
        "«sin permanencia» sola es verdad y está en §3.3",
      ],
      [
        "Tu cliente cancela su cita desde el link, cuando quiera, y la agenda se libera sola.",
        "cancelar una CITA es una función del producto, no una cláusula",
      ],
      [
        "Los exportás en CSV cuando quieras, sin importar el plan.",
        "no hay salida del servicio: es el derecho sobre los datos",
      ],
    ] as const) {
      expect(
        SALIDA_SIN_CONDICION.test(texto),
        `el patrón se comió algo legítimo: ${porque}`,
      ).toBe(false);
    }
  });

  it("ninguna página servida ofrece la salida sin la condición del contrato", () => {
    /*
     * Un solo `it` y no uno por página: el bloque de precios lo sirven varias
     * rutas, así que UN defecto las pondría rojas a todas y el reporte se
     * volvería ilegible. Acá se nombra la frase, por dónde entra y cuántas
     * pantallas la sirven.
     */
    const tocadas = PAGINAS.map((p) => ({
      p,
      hallado: cadenaHastaTexto(archivoDe(p), SALIDA_SIN_CONDICION),
    })).filter((x) => x.hallado !== null);

    const primera = tocadas[0];
    expect(
      primera ? `«${primera.hallado!.encontrado.trim()}»` : null,
      primera
        ? `esta frase ofrece salirse del servicio sin la condición con la que el ` +
          `contrato la concede, y la sirven ${tocadas.length} pantalla(s). ` +
          `Entra por ${primera.hallado!.cadena.join(" → ")}. ` +
          `terminos.md §3.3 concede NO RENOVAR sin penalidad, y dice que lo ` +
          `pagado cubre el período en curso y no se reembolsa de forma ` +
          `anticipada. Al lado del precio anual, «cuando quieras» se lee como ` +
          `devolución proporcional. Escribilo acotado: «no renovás cuando quieras».`
        : "",
    ).toBeNull();
  });
});
