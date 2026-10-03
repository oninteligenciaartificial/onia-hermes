import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import * as siat from "@/lib/siat";

import { PAGINAS, archivoDe } from "../rutas";

/**
 * Ninguna página le habla al lead del plazo del SIN **en futuro**.
 *
 * El sitio de venta se sirve ESTÁTICO: el HTML se hornea en el build y se
 * queda quieto hasta el próximo swap, que es manual y esporádico (el
 * 2026-09-05 producción servía un build de dos días antes, con 24 arreglos
 * detrás). Un texto que dice *«desde el 1 de octubre …  podrán»* no se corrige
 * solo el 1 de octubre: sigue publicado, palabra por palabra, hablando en
 * futuro de algo que ya rige.
 *
 * ⚠️ **Por eso el arreglo NO es el reloj.** La tentación es hacer que el copy
 * dependa de `now` y elija variante. En una página estática eso es la trampa
 * que la casa ya pagó en el bot —*«una garantía que se calcula UNA VEZ y
 * después se SIRVE durante una ventana se gasta sola»*—: el valor se congela
 * en el build y el mecanismo da la sensación de estar cubierto sin cubrir
 * nada. La única redacción que sobrevive a un deploy que no ocurre es la que
 * **no caduca**: la norma enunciada en presente, o un hecho ya ocurrido en
 * pasado. ⚠️ El ejemplo que estaba acá («desde el 1 de octubre de 2026, esos
 * negocios facturan en línea») dejó de ser verdad el 30-sep: la RND
 * 102600000038 abrogó esa obligación. Ese caso lo vigila otro gate,
 * `plazo-sin-efecto.test.ts`: éste mira el TIEMPO VERBAL y aquél, si la norma
 * que se cita sigue viva. Son preguntas distintas y hacen falta las dos.
 *
 * El defecto que lo trajo, medido el 2026-09-06 sobre el árbol — a 24 días del
 * plazo, en las tres rutas fiscales, las tres con 200 en producción:
 *
 *   · `SIAT_TITULAR` — «Desde el 1 de octubre de 2026, miles de negocios solo
 *     **podrán** facturar en línea.»
 *   · `SIAT_FAQ` — «¿Qué pasa si no migro **antes del** 1 de octubre de 2026?»
 *   · `SIAT_GUIA_FRENA` — «Dejarlo para la **última semana de septiembre**.»
 *
 * Y es la superficie donde más caro sale: `/facturacion` y `/guia-facturacion`
 * existen para captar la búsqueda del plazo, que es la más valiosa del sitio
 * — y esa búsqueda **no se apaga el 1 de octubre, explota**, porque la hace el
 * que no llegó. Ese lead aterriza en una página que le habla como si todavía
 * tuviera tiempo. La única superficie donde Onia habla de normativa fiscal es
 * justo la que no puede equivocarse de tiempo verbal.
 *
 * ⚠️ Esto NO es la clase «texto prohibido»: acá no sobra ninguna palabra y
 * cada frase es cierta HOY. Lo que caduca es el TIEMPO VERBAL, y por eso
 * ningún barrido de literales prohibidos, ninguna captura y ningún `curl`
 * pueden verlo — los tres miran el sitio de hoy, y el defecto nace mañana.
 *
 * El sujeto se deriva del MÓDULO entero (`lib/siat.ts`) y de las `page.tsx`
 * del disco, nunca de una lista escrita a mano: un texto fiscal nuevo nace
 * cubierto y hay que excluirlo a la vista para que deje de estarlo.
 */

/**
 * El plazo, escrito como lo escribe la gente. Desde el 3-oct las dos fechas
 * se nombran como historia (el plazo que la RND 102600000038 dejó sin efecto, y
 * el día de esa RND): una oración que las ponga en futuro sigue siendo el
 * defecto. Si el SIN fija una fecha nueva, acá se agrega y el gate sigue midiendo.
 */
const PLAZO =
  /(1|1º|1°|01)\s*(de\s*)?(octubre|oct)[a-z]*\s*(de\s*)?2026|01-10-2026|2026-10-01|30\s*(de\s*)?septiembre\s*(de\s*)?2026|[úu]ltima semana de septiembre/i;

/**
 * Hablar de algo que todavía no pasó. Dos formas: el futuro morfológico
 * («podrán») y la anticipación relativa («antes del», «faltan»), que es la que
 * se escapa porque el verbo va en presente.
 */
const FUTURO =
  /\b(podr[áa]n?|podr[áa]s|deber[áa]n?|deber[áa]s|tendr[áa]n?|tendr[áa]s|ser[áa]n?|quedar[áa]n?|dejar[áa]n?|empezar[áa]n?|comenzar[áa]n?|pasar[áa]n?|estar[áa]n?|van a|vas a|vamos a)\b|\bantes de(l| que)\b|[úu]ltima semana de septiembre|\bfaltan?\s+\d|\bse viene\b|\btodav[íi]a pod[ée]s\b|\ba[úu]n pod[ée]s\b/i;

/** Una oración por vez: una persona lee una frase, no un archivo. */
function oraciones(texto: string): string[] {
  return texto
    .split(/(?<=[.?!;])\s+|\n+/)
    .map((o) => o.trim())
    .filter(Boolean);
}

/** La oración habla del plazo Y lo pone en futuro. */
function hablaEnFuturoDelPlazo(texto: string): string[] {
  return oraciones(texto).filter((o) => PLAZO.test(o) && FUTURO.test(o));
}

/** Todo string publicable del módulo fiscal, con el nombre de su export. */
function textosDeSiat(): Array<{ donde: string; texto: string }> {
  const salida: Array<{ donde: string; texto: string }> = [];
  const visitar = (donde: string, valor: unknown): void => {
    if (typeof valor === "string") {
      salida.push({ donde, texto: valor });
      return;
    }
    if (Array.isArray(valor)) {
      valor.forEach((v, i) => visitar(`${donde}[${i}]`, v));
      return;
    }
    if (valor && typeof valor === "object") {
      for (const [k, v] of Object.entries(valor)) visitar(`${donde}.${k}`, v);
    }
  };
  for (const [nombre, valor] of Object.entries(siat)) visitar(nombre, valor);
  return salida;
}

describe("el plazo del SIN no se cuenta en futuro", () => {
  it("el módulo fiscal expone texto (si no, el gate no está midiendo nada)", () => {
    const textos = textosDeSiat();
    expect(textos.length).toBeGreaterThan(15);
    expect(textos.some(({ texto }) => PLAZO.test(texto))).toBe(true);
  });

  it.each(textosDeSiat())("$donde no anticipa el plazo", ({ donde, texto }) => {
    expect(hablaEnFuturoDelPlazo(texto), `${donde} habla en futuro de un plazo que va a pasar, y el sitio se sirve estático: el día después seguirá diciéndolo igual`).toEqual([]);
  });

  // Las páginas tipean su propio copy y su metadata — el <head> es superficie
  // de cliente que ninguna captura mira, y es lo que se lee en el resultado de
  // Google y en la tarjeta de WhatsApp.
  it.each(PAGINAS)("$ruta no anticipa el plazo", (pagina) => {
    const fuente = readFileSync(archivoDe(pagina), "utf8")
      // El comentario que explica el defecto no es superficie de cliente: si
      // el gate lo mira, obliga a borrar la bitácora para ponerse verde.
      .replace(/\/\*[\s\S]*?\*\//g, " ")
      .replace(/^\s*\/\/.*$/gm, " ");
    expect(hablaEnFuturoDelPlazo(fuente), `${pagina.ruta} habla en futuro del plazo del SIN`).toEqual([]);
  });
});

describe("el gate puede fallar", () => {
  it("caza la redacción que trajo el defecto", () => {
    expect(
      hablaEnFuturoDelPlazo(
        "Desde el 1 de octubre de 2026, miles de negocios solo podrán facturar en línea.",
      ),
    ).toHaveLength(1);
    expect(
      hablaEnFuturoDelPlazo("¿Qué pasa si no migro antes del 1 de octubre de 2026?"),
    ).toHaveLength(1);
    expect(hablaEnFuturoDelPlazo("Dejarlo para la última semana de septiembre.")).toHaveLength(1);
  });

  it("deja pasar la que cuenta la norma en presente o en pasado, que es la que no caduca", () => {
    // Hasta el 3-oct los dos ejemplos de acá eran la redacción de la RND
    // 102600000007 («desde el 1 de octubre… emiten únicamente…»). Dejó de ser
    // verdad el 30-sep: los ejemplos sanos son ahora los de la RND 102600000038.
    expect(
      hablaEnFuturoDelPlazo(
        "La RND 102600000038, del 30 de septiembre de 2026, abrogó las resoluciones que obligaban a los grupos 9° al 12° a facturar en línea desde el 1 de octubre de 2026.",
      ),
    ).toEqual([]);
    expect(
      hablaEnFuturoDelPlazo("¿Sigo obligado a facturar en línea desde el 1 de octubre de 2026?"),
    ).toEqual([]);
  });

  it("caza el futuro también sobre la norma nueva", () => {
    // La RND 102600000038 dice que el SIN «asignará periódicamente» la
    // modalidad. Copiado con una fecha al lado, el futuro vuelve a caducar.
    expect(
      hablaEnFuturoDelPlazo(
        "Desde el 1 de octubre de 2026 el SIN asignará la modalidad, y vas a tener que facturar en línea.",
      ),
    ).toHaveLength(1);
  });

  it("no confunde un futuro que NO habla del plazo", () => {
    // «te avisamos apenas la homologación concluya» es legítimo y atemporal:
    // el futuro es de Onia, no de la norma.
    expect(
      hablaEnFuturoDelPlazo("Te avisamos apenas la homologación concluya; será tu aviso."),
    ).toEqual([]);
  });
});
