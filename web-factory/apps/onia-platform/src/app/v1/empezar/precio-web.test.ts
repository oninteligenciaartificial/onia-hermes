import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { precioWebDesde, WEB_STACKS } from "../../../content/webs";

/**
 * El copy que le pone precio a la web NO escribe el número a mano: lo lee de
 * `content/webs.ts`, que es la fuente.
 *
 * **Por qué existe este gate.** El 2026-08-23 Sergio ratificó la línea
 * `2.000 / 4.500 / desde 7.500` y `content/webs.ts` se movió con él. La línea
 * anterior —`790 / 1.500 / 2.900`— era una **oferta de arranque vencida el
 * 31-jul-2026** que nadie estaba cobrando: las propuestas reales cotizaban ya
 * la línea premium. El barrido de ese cambio alcanzó al catálogo y a
 * `/servicios/webs`, pero **no** a este wizard: `FALTA_COPY.web` siguió
 * doce días anunciando *"Desde Bs 790, pago único"* — menos de la mitad del
 * precio ratificado.
 *
 * **Por qué no lo vio nadie.** El bloque «Lo que te falta» que muestra ese
 * texto no está en el HTML que sirve el servidor: se pinta del lado del
 * cliente, **después** de responder el cuestionario. Un `curl` de
 * `/v1/empezar` y un `grep` de "790" salen los dos vacíos y dan verde. El
 * precio vencido vivía en el **segundo** paso, que es donde ningún
 * instrumento estaba mirando — y `recommend.ts:72` lo muestra a todo el que
 * responde que no tiene web, o sea el caso más común, no un borde.
 *
 * **Qué exige, y por qué no alcanza con prohibir el 790.** Prohibir ese
 * literal cierra el caso de ayer y ninguno más: mañana el número vencido es
 * otro. Lo que se exige acá es que el copy **no escriba ninguna cifra en Bs a
 * mano** y que interpole `precioWebDesde()`. Es más fuerte que comparar
 * números: un valor correcto pero escrito a mano pasaría una comparación y
 * volvería a despegarse en el próximo cambio de catálogo — que es exactamente
 * como nació este bug. Atado a la fuente, el texto se mueve solo.
 *
 * El vecino de al lado en el mismo objeto ya hacía lo correcto: el copy del
 * chatbot llama a `precioStack()` en vez de escribir la cifra, con un
 * comentario que recuerda que ese texto llegó a ser el CUARTO precio vivo del
 * mismo add-on. Este gate le da al de la web la misma garantía.
 */

/** Precios que el catálogo tiene VIVOS hoy. `null` = se cotiza, no es cifra. */
const PRECIOS_VIVOS = WEB_STACKS.map((w) => w.precio).filter(
  (p): p is number => p !== null,
);

/**
 * El copy se lee del FUENTE, no se importa.
 *
 * `data.ts` importa `@/lib/site`, y el alias `@/` sólo lo resuelve Next: bajo
 * vitest ese import explota antes de que corra un solo `expect`. Es la
 * convención que ya siguen los gates de al lado (`alcance.test.ts` lee el
 * disco por el mismo motivo). Leer el texto tiene además la ventaja de mirar
 * lo que está ESCRITO, que es justo lo que este gate vigila.
 */
const AQUI = dirname(fileURLToPath(import.meta.url));

function copyDeLaWeb(): string {
  const fuente = readFileSync(join(AQUI, "data.ts"), "utf8");
  const bloque = fuente.match(
    /FALTA_COPY[\s\S]*?\bweb:\s*\{[\s\S]*?\bcopy:\s*(["`])([\s\S]*?)\1/,
  );

  // Fail-closed: si el bloque cambió de forma, este gate deja de tener sujeto.
  // Salir en verde ahí sería el fallo abierto que ya nos costó una página
  // publicada sin vigilancia — mejor romper y que alguien mire.
  if (!bloque) {
    throw new Error(
      "No encontré el copy de `FALTA_COPY.web` en data.ts. Si el dato se " +
        "movió o cambió de forma, este gate quedó sin sujeto: apuntalo al " +
        "lugar nuevo en vez de borrarlo.",
    );
  }

  return bloque[2];
}

/**
 * Cifras en Bs que aparecen escritas en un texto de venta.
 *
 * Acepta el separador de miles que produce `toLocaleString("es-BO")` (punto),
 * porque el copy correcto dice "Bs 2.000" y no "Bs 2000": un parser que sólo
 * entienda dígitos pelados leería `2` y daría rojo sobre el texto bueno.
 */
function cifrasBs(texto: string): number[] {
  const encontradas = texto.matchAll(/Bs\.?\s?([\d.]+)/g);
  return [...encontradas].map((m) => Number(m[1].replace(/\./g, "")));
}

describe("el precio de la web en el wizard sale de la fuente", () => {
  const copy = copyDeLaWeb();

  it("no escribe ninguna cifra en Bs a mano", () => {
    const cifras = cifrasBs(copy);

    expect(
      cifras,
      `El copy del wizard tiene el precio de la web ESCRITO A MANO ` +
        `(Bs ${cifras.map((c) => c.toLocaleString("es-BO")).join(", Bs ")}). ` +
        `Un número acá se despega del catálogo en cuanto el catálogo cambia, y ` +
        `nadie se entera: este texto se pinta después de responder el ` +
        `cuestionario, así que no sale en el HTML servido. Interpolá ` +
        `\`precioWebDesde()\` de content/webs.ts.\nCopy: ${copy}`,
    ).toEqual([]);
  });

  it("toma el precio de content/webs.ts, y es el stack más barato", () => {
    expect(
      copy,
      `El copy tiene que interpolar \`precioWebDesde()\` — si no, no hay nada ` +
        `que lo ate al catálogo y el "desde" queda libre de decir cualquier ` +
        `cosa.\nCopy: ${copy}`,
    ).toContain("precioWebDesde()");

    // Y que esa fuente siga significando lo que el copy promete: "desde" es el
    // piso. Si mañana `precioWebDesde` devolviera otra cosa (el destacado, un
    // promedio), el texto mentiría sin que cambie una línea de este archivo.
    expect(
      precioWebDesde(),
      `El copy dice "desde", así que la cifra tiene que ser la más barata del ` +
        `catálogo. Anunciar un "desde" más caro que el piso real espanta al ` +
        `lead que sí podía pagarlo.`,
    ).toBe(Math.min(...PRECIOS_VIVOS));
  });
});
