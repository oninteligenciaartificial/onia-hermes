import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * Los textos que el lead ENVÍA no pueden decir que Onia está a medio hacer.
 *
 * `site.ts` es el archivo del que salen los CTA de todo el sitio: el número de
 * WhatsApp, los links `waLink(...)` y los textos que viajan precargados en el
 * mensaje. Lo que se escribe acá no es una etiqueta en pantalla — es lo que el
 * lead *afirma sobre su propio negocio*, con su nombre arriba, en el chat de
 * Sergio.
 *
 * EL DEFECTO QUE LO TRAJO (medido el 2026-09-05). Tres constantes exportadas
 * seguían vivas en el árbol:
 *
 *     WA_TEXT_COMERCIO    = "…quiero que me avisen cuando Onia para comercio esté listo"
 *     WA_TEXT_SERVICIOS   = "…quiero que me avisen cuando Onia para servicios esté listo"
 *     WA_TEXT_PROVEEDORES = "…quiero que me avisen cuando Onia para importadoras esté listo"
 *
 * Son restos de cuando esos tres rubros no existían. Hoy los tres están VIVOS y
 * el alta los ofrece: un lead que apretara ese botón mandaría un mensaje
 * pidiendo que le avisen por un rubro que ya puede contratar hoy — obra a la
 * vista *y* contradicción con la pantalla de al lado, las dos cosas puestas en
 * su boca. Es exactamente el defecto que `app/v1/empezar/whatsapp.test.ts`
 * arregló en la salida del wizard; estas quedaron atrás porque ese gate mira
 * `buildWaText()` y nunca miró `site.ts`.
 *
 * ⚠️ NO ALCANZA CON QUE ESTÉN SIN USAR. Cuando se encontraron no las llamaba
 * nadie, así que ninguna captura, ningún `curl` y ningún gate de pantalla podía
 * verlas: un texto muerto es invisible para todo instrumento que mire la
 * superficie. Pero sobrevive a los refactors y está a un `import` de volver a
 * la web — y el día que vuelva, vuelve ya aprobado, porque nadie audita una
 * constante que "ya estaba". Se borran, no se comentan.
 *
 * ⚠️ CÓMO NO FALLA EN VERDE. Los sujetos se derivan del DISCO: se leen TODOS los
 * literales de `site.ts`, no una lista de nombres escrita acá — así una
 * constante nueva nace cubierta y hay que excluirla a mano, a la vista. Si el
 * parser se rompe y deja de encontrar literales, el test se pone ROJO por
 * `MINIMO_LITERALES` en vez de aprobar la nada, que es como esta familia de
 * gates se muere en silencio.
 *
 * ⚠️ LOS COMENTARIOS SE FILTRAN ANTES DE BUSCAR. Si no, este mismo bloque —que
 * cita los tres textos prohibidos para explicar por qué existe el gate— pondría
 * el gate en rojo y obligaría a borrar la bitácora del defecto.
 *
 * ⚠️ ESTO NO TOCA LA HONESTIDAD FISCAL. "En trámite de homologación ante el SIN"
 * (`lib/siat.ts`) es un límite legal real, declarado a propósito: taparlo sería
 * fabricar. Lo prohibido acá es anunciar que el PRODUCTO está a medio construir.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const SITE_TS = join(AQUI, "site.ts");

/**
 * Si el parser deja de encontrar literales, el archivo cambió de forma y este
 * gate dejó de mirar lo que dice mirar. Rojo, no verde.
 */
const MINIMO_LITERALES = 8;

/**
 * Obra a la vista, en las formas en que aparece en un texto que el lead manda.
 * Incluye las de `CLAUDE.md` («muy pronto», «en construcción», «beta»…) y la
 * familia que se le escapa a esa lista: pedir que le avisen *cuando esté*, que
 * es cómo se admite obra sin nombrar ninguna de esas palabras.
 */
const OBRA = [
  /muy pronto/i,
  /pr[oó]ximamente/i,
  /en construcci[oó]n/i,
  /\bbeta\b/i,
  /avis[ae]n?\s+cuando/i,
  /cuando\b[^.!?]{0,40}\best[éeá]\s*(listo|lista|disponible)?/i,
  /lista de espera/i,
  /todav[ií]a no/i,
] as const;

/** Extrae los literales de string, con los comentarios ya fuera. */
function literalesDe(fuente: string): string[] {
  const sinComentarios = fuente
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");

  const literales: string[] = [];
  const patron = /"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g;
  for (const m of sinComentarios.matchAll(patron)) {
    const valor = m[1] ?? m[2] ?? m[3] ?? "";
    if (valor.trim()) literales.push(valor);
  }
  return literales;
}

describe("los CTA de site.ts no exhiben obra", () => {
  const literales = literalesDe(readFileSync(SITE_TS, "utf8"));

  it("encuentra literales para mirar (si no, el gate se quedó ciego)", () => {
    expect(literales.length).toBeGreaterThanOrEqual(MINIMO_LITERALES);
  });

  it("ningún texto de site.ts admite que el producto está a medio hacer", () => {
    const ofensores = literales.filter((texto) =>
      OBRA.some((patron) => patron.test(texto)),
    );
    expect(ofensores).toEqual([]);
  });

  it("el gate detecta la forma REAL del defecto, no una cómoda", () => {
    // Se prueba con el texto exacto que estaba vivo en el árbol: si alguien
    // afloja los patrones, este caso se cae antes que el de arriba.
    const comoEstaba =
      "Hola, quiero que me avisen cuando Onia para comercio esté listo";
    expect(OBRA.some((patron) => patron.test(comoEstaba))).toBe(true);
  });
});
