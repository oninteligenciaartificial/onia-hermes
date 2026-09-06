import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { CHATBOT_STACKS, CONVERSACIONES_INCLUIDAS } from "@/content/chatbot-precios";

/**
 * Lo que el producto CORTA se dice ANTES de cobrar, no después.
 *
 * Medido el 2026-09-06. El producto cuenta y corta las conversaciones del
 * chatbot: `onia-platform/lib/chatbot/cupo.ts` lleva el contador por mes
 * (`registrarMensajeEntrante`), expone `agotada: usadas >= limite`, el motor
 * del VPS deriva a una persona cuando es true, y hay un producto de RECARGA
 * que se le cobra al dueño cuando se le acaba. El propio archivo del producto
 * lo dice: *«El cupo sale de pricing.ts: lo que se vende es lo que se aplica»*.
 *
 * Y la superficie de venta no lo nombraba en NINGUNA parte: ni la portada, ni
 * `/chatbot`, ni `/precios`. Lo que el lead leía era «contesta al instante a
 * cualquier hora: de noche, el domingo y el feriado» — cierto, y sin su
 * límite. El dueño se enteraba **pagando**, el día que sus clientes recibían
 * «se agotaron las conversaciones de este mes».
 *
 * POR QUÉ NINGÚN GATE LO VEÍA, que es lo que hace nueva a esta clase:
 *  - no sobra ninguna palabra → invisible a todo barrido de prohibidos
 *    (`obra.test.ts`, `forma.test.ts`, `hueco-declarado.test.ts`);
 *  - el precio está bien leído de la fuente → `precios.test.ts` y
 *    `precios-addons.test.ts` pasan en verde sobre el defecto;
 *  - no niega la existencia de nada ni promete gente → invisible a
 *    `hueco-declarado.test.ts` y a `promesa-humana.test.ts`.
 * Los gates de la casa persiguen lo que SOBRA (obra, autobombo, un precio
 * viejo) y lo que FALTA en cobertura (un rubro que no se ofrece). Éste es un
 * tercer eje: la capacidad está bien descrita y **le falta su límite**.
 *
 * LO QUE MANTUVO VIVO EL DEFECTO, y por eso se corrige acá al lado: la
 * cabecera de `chatbot-precios.ts` justificaba la omisión con
 * *«no hay contador ni corte implementado, así que no se promete un cupo»*.
 * Era verdad el 2026-08-21 y dejó de serlo el 2026-09-03, cuando se construyó
 * `cupo.ts`. Un comentario que explica por qué algo NO se dice es una
 * hipótesis con fecha: sin corregirlo, la próxima vuelta lee la justificación
 * y vuelve a sacar el cupo.
 *
 * NO es exhibir obra (§«la venta nunca exhibe obra»): un cupo de plan es una
 * condición comercial normal, y decirlo con su salida —al agotarse la
 * conversación pasa a una persona, no se pierde— vende mejor que ocultarlo.
 *
 * El cruce del NÚMERO contra el producto (`WHATSAPP_ADDON.includedConversations`
 * del repo `onia-platform`) no puede vivir en esta cadena: ese repo no está en
 * el worktree y exigirlo pondría rojo por AMBIENTE, trabando el merge de los
 * quince carriles. Va como script aparte: `scripts/limites-vivos.mjs`.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const FUENTE = readFileSync(join(AQUI, "..", "..", "content", "chatbot-precios.ts"), "utf8");

/** Nombra el cupo: «hasta N conversaciones», «N conversaciones por mes». */
const NOMBRA_EL_CUPO = /\d[\d.]*\s*conversaciones/i;

/**
 * Dice qué pasa cuando se agota. El corte real NO es que el bot se calle:
 * deriva a una persona. Omitir la salida convierte un límite manejable en
 * una amenaza, así que se exige la salida junto con el número.
 */
const DICE_LA_SALIDA = /se agotan|agotarse|al agotar/i;

/** La atención descrita como ilimitada: «a cualquier hora», «siempre», «24/7». */
const CLAMA_SIN_LIMITE = /cualquier hora|24\s*\/\s*7|siempre|sin l[ií]mite|ilimitad/i;

/**
 * Ventana de vecindad, en caracteres. El sujeto es lo que una persona lee de
 * corrido, no el archivo entero: `promesa-fiscal.test.ts` ya pagó ese error
 * (28 casos verdes porque la salvedad vivía 90 líneas más arriba).
 */
const AL_LADO = 340;

/** ¿Hay un cupo nombrado dentro de la vecindad de cada frase «sin límite»? */
function frasesSinLimiteSinCupo(texto: string): string[] {
  const huerfanas: string[] = [];
  for (const m of texto.matchAll(new RegExp(CLAMA_SIN_LIMITE, "gi"))) {
    const i = m.index ?? 0;
    const vecindad = texto.slice(Math.max(0, i - AL_LADO), i + AL_LADO);
    if (!NOMBRA_EL_CUPO.test(vecindad)) huerfanas.push(texto.slice(Math.max(0, i - 60), i + 60));
  }
  return huerfanas;
}

describe("la venta dice el límite que el producto aplica", () => {
  it("el cupo vive como constante, no tipeado en una frase", () => {
    // Si el número se escribe a mano dentro del texto, el día que el producto
    // cambie el cupo la frase sigue anunciando el viejo — el mismo camino por
    // el que el precio de la web pasó doce días a menos de la mitad.
    expect(CONVERSACIONES_INCLUIDAS).toBeGreaterThan(0);
    const promesa = CHATBOT_STACKS.flatMap((s) => s.incluye).join(" ");
    expect(promesa).toContain(String(CONVERSACIONES_INCLUIDAS));
    // Y en el archivo la línea se interpola: nada de "500" escrito suelto
    // dentro de un string de `incluye`.
    // Comilla doble, simple o backtick: el defecto entra por cualquiera de
    // las tres, y el arreglo usa justo la que un patrón sólo-comillas no ve.
    const lineasConCupo = FUENTE.split("\n").filter(
      (l) => /["'`][^"'`]*conversaciones/i.test(l) && !l.trimStart().startsWith("*"),
    );
    for (const linea of lineasConCupo) {
      expect(linea, `el cupo se tipeó a mano: ${linea.trim()}`).not.toMatch(
        new RegExp(`\\b${CONVERSACIONES_INCLUIDAS}\\b`),
      );
    }
  });

  it("lo que se ofrece nombra el cupo y qué pasa al agotarse", () => {
    const promesa = CHATBOT_STACKS.flatMap((s) => [...s.incluye, ...s.noIncluye]).join(" ");
    expect(promesa, "la promesa del chatbot no nombra su cupo").toMatch(NOMBRA_EL_CUPO);
    expect(promesa, "nombra el cupo y no dice qué pasa al agotarse").toMatch(DICE_LA_SALIDA);
  });

  it("ninguna frase de atención ilimitada queda sin su cupo al lado", () => {
    const texto = CHATBOT_STACKS.flatMap((s) => [
      s.resuelve,
      s.paraQuien,
      ...s.incluye,
      ...s.noIncluye,
    ]).join(" · ");
    expect(frasesSinLimiteSinCupo(texto)).toEqual([]);
  });

  // -- La guarda se valida ROMPIÉNDOLA. Un caso que sólo mira el texto vivo
  //    puede pasar en verde con el detector arrancado: el dato de hoy no
  //    ejercita el patrón. Estos fixtures lo fuerzan en las dos direcciones.
  describe("el detector distingue el defecto de su arreglo", () => {
    it("caza la promesa sin límite (la que estaba viva)", () => {
      const roto = "Contesta al instante a cualquier hora: de noche, el domingo y el feriado";
      expect(NOMBRA_EL_CUPO.test(roto)).toBe(false);
      expect(frasesSinLimiteSinCupo(roto)).toHaveLength(1);
    });

    it("aprueba la misma promesa con su cupo y su salida", () => {
      const sano =
        "Contesta al instante a cualquier hora: de noche, el domingo y el feriado · " +
        "Atiende hasta 500 conversaciones por mes; si se agotan, las nuevas pasan a tu equipo";
      expect(frasesSinLimiteSinCupo(sano)).toEqual([]);
      expect(DICE_LA_SALIDA.test(sano)).toBe(true);
    });

    it("no aprueba un número cualquiera: el cupo se nombra por lo que es", () => {
      // «390» es el precio, no el cupo. Si el patrón se aflojara a /\d+/ el
      // gate quedaría satisfecho por el precio que ya estaba en la frase.
      expect(NOMBRA_EL_CUPO.test("Bs 390/mes, sin instalación")).toBe(false);
    });
  });
});
