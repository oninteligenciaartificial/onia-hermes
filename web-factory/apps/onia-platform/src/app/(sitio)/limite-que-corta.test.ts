import { readFileSync, readdirSync } from "node:fs";
import { dirname, isAbsolute, join, relative } from "node:path";
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

/* -------------------------------------------------------------------------
 * El mismo límite, en el `<head>` — el gemelo que faltaba.
 * ------------------------------------------------------------------------- */

/**
 * Medido el 2026-09-07. El arreglo del cupo (54a7fa334) aterrizó en el DATO
 * (`CHATBOT_STACKS[].incluye`) y por eso alcanzó a todo el CUERPO de las
 * páginas que lo renderizan. Pero los `describe` de arriba tienen por sujeto
 * `CHATBOT_STACKS`, no las páginas — y el `<head>` no sale de ahí: cada página
 * escribe su `description` y su `openGraph.description` a mano. Los cuatro
 * campos quedaron con la promesa vieja:
 *
 *   «Chatbot de WhatsApp que contesta 24/7 … Bs 390/mes»
 *   «Contesta al instante a cualquier hora … Bs 390/mes»
 *
 * en `/chatbot` y en `/v1/chatbot`, las dos servidas con 200. Atención sin
 * tope, pegada al precio, sobre un producto que corta a las
 * `CONVERSACIONES_INCLUIDAS` del mes.
 *
 * POR QUÉ NO LO VEÍA NADIE, que es lo que hace nueva a esta vuelta de la
 * clase: el `<head>` no se ve MIRANDO la pantalla (no es visible), no está en
 * `CHATBOT_STACKS` (donde mira el gate del cupo) y no sobra ninguna palabra
 * (invisible a todo barrido de prohibidos). Y el `og:description` es la
 * superficie que se lee ANTES que el sitio: es la tarjeta que aparece cuando
 * el enlace se manda por WhatsApp, o sea lo único que ve quien nunca abre la
 * página. Ya está escrito en la memoria del proyecto que «todo guard de copy
 * de venta necesita su gemelo sobre title/description/og»; éste es el guard
 * al que le faltaba el suyo.
 *
 * EL SUJETO SE DERIVA DEL DISCO —todas las `page.tsx` de `src/app`— para que
 * una página nueva nazca cubierta. La VECINDAD acá es el campo entero: una
 * `description` se lee de corrido, no por partes.
 */
const APP = join(AQUI, "..", "..", "app");

/**
 * Todas las páginas del disco, en ruta RELATIVA a `APP`. Sujeto derivado: nada
 * de lista escrita a mano.
 *
 * Van relativas A PROPÓSITO, y no es cosmético. Mientras devolvió rutas
 * absolutas, el caso de cobertura de más abajo filtraba `p.includes("chatbot")`
 * sobre la ruta ENTERA, así que su veredicto quedó atado al NOMBRE DEL
 * DIRECTORIO donde corre el gate: desde `/root/loops/onia-hermes-chatbot` las
 * 25 páginas matcheaban, el caso exigía 2, y la cadena `npm test` de la raíz
 * —la que corre el integrador antes de tocar `main`— cortaba ahí. Un rojo
 * falso que trababa el merge de los quince carriles y que desde ESTE worktree
 * era invisible, porque acá el path no dice "chatbot" y el filtro cuenta 2.
 *
 * Medido el 2026-09-08 (t_fed03aba, abierta por `chatbot-cola`, el único
 * carril que podía verlo). Con la ruta relativa el nombre de la carpeta
 * contenedora ya no puede entrar en ningún filtro de este archivo — el arreglo
 * es la forma del dato, no un caso más.
 */
function paginasDelDisco(dir: string = APP): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const ruta = join(dir, e.name);
    if (e.isDirectory()) return paginasDelDisco(ruta);
    return e.name === "page.tsx" ? [relative(APP, ruta)] : [];
  });
}

/**
 * Los `description:` de la metadata (raíz y `openGraph`), con su literal
 * entero. NO se les quitan las interpolaciones: `${CONVERSACIONES_INCLUIDAS}`
 * es justamente la forma en que el cupo tiene que aparecer acá.
 */
function descripcionesDe(fuente: string): string[] {
  return [...fuente.matchAll(/description:\s*(`[^`]*`|"[^"]*"|'[^']*')/g)].map((m) => m[1]);
}

/**
 * En el `<head>` el cupo va INTERPOLADO desde la constante. Un número tipeado
 * a mano se pudre igual que un precio a mano: el día que el producto cambie el
 * cupo, la tarjeta que se comparte por WhatsApp sigue anunciando el viejo.
 */
const CUPO_INTERPOLADO = /\$\{\s*CONVERSACIONES_INCLUIDAS\s*\}\s*conversaciones/i;

/** El campo habla del add-on, que es lo que el cupo limita. */
const HABLA_DEL_BOT = /chatbot|asistente|\bbot\b/i;

/** Campos de metadata que prometen atención sin tope y no dicen su cupo. */
function metadataSinCupo(fuente: string): string[] {
  return descripcionesDe(fuente).filter(
    (d) => HABLA_DEL_BOT.test(d) && CLAMA_SIN_LIMITE.test(d) && !CUPO_INTERPOLADO.test(d),
  );
}

describe("el <head> dice el mismo límite que el cuerpo", () => {
  it("ninguna metadata promete atención sin tope sin nombrar el cupo", () => {
    const culpables = paginasDelDisco()
      .flatMap((p) =>
        metadataSinCupo(readFileSync(join(APP, p), "utf8")).map((d) => `${p}\n    ${d}`),
      )
      .sort();
    expect(culpables, "metadata con atención ilimitada y sin cupo").toEqual([]);
  });

  it("el cupo del <head> no se tipea a mano", () => {
    const aMano = paginasDelDisco()
      .flatMap((p) => descripcionesDe(readFileSync(join(APP, p), "utf8")).map((d) => `${p} → ${d}`))
      .filter((d) => new RegExp(`\\b${CONVERSACIONES_INCLUIDAS}\\b\\s*conversaciones`, "i").test(d));
    expect(aMano, "el cupo se tipeó a mano en una metadata").toEqual([]);
  });

  it("el barrido llega de verdad a las páginas del chatbot", () => {
    // Sin este caso, un `paginasDelDisco()` que devolviera vacío —una raíz
    // mal armada, un rename— dejaría los dos casos de arriba en verde sin
    // haber mirado un solo archivo. Es el modo de falla ABIERTO de esta
    // familia, y ya mordió antes en este repo.
    const paginas = paginasDelDisco();
    expect(paginas.length).toBeGreaterThan(20);
    // Y ninguna absoluta: es lo único que impide que el filtro de la línea
    // siguiente vuelva a contar el nombre de la carpeta contenedora. Revertir
    // el barrido a rutas absolutas pone ROJO este caso desde CUALQUIER
    // worktree, que es justo lo que faltaba: el rojo falso sólo se veía desde
    // uno con "chatbot" en el path.
    expect(
      paginas.filter(isAbsolute),
      "las páginas tienen que venir relativas a APP (ver la cabecera de paginasDelDisco)",
    ).toEqual([]);
    expect(paginas.filter((p) => p.includes("chatbot"))).toHaveLength(2);
  });

  it("el veredicto no depende de cómo se llame la carpeta del worktree", () => {
    // La clase, hecha visible desde acá: con la ruta ABSOLUTA bajo un worktree
    // que se llama "…-chatbot", el filtro se lleva puestas las 25 páginas; con
    // la relativa devuelve las 2 de siempre. Es el rojo falso del 2026-09-08,
    // reproducido sin depender de dónde corra el gate.
    const RAIZ_QUE_MIENTE = join("/root/loops/onia-hermes-chatbot", "src", "app");
    const absolutas = paginasDelDisco().map((p) => join(RAIZ_QUE_MIENTE, p));
    expect(absolutas.filter((p) => p.includes("chatbot")).length).toBe(absolutas.length);
    expect(absolutas.filter((p) => relative(RAIZ_QUE_MIENTE, p).includes("chatbot"))).toHaveLength(
      2,
    );
  });

  describe("el detector distingue el defecto de su arreglo", () => {
    const CON_TOPE =
      "description: `Contesta a cualquier hora, hasta ${CONVERSACIONES_INCLUIDAS} conversaciones por mes. Chatbot de WhatsApp.`";
    const SIN_TOPE =
      "description: `Chatbot de WhatsApp que contesta 24/7 con lo que cargaste. Bs 390/mes.`";

    it("caza el campo sin tope (el que estaba vivo)", () => {
      expect(metadataSinCupo(SIN_TOPE)).toHaveLength(1);
    });

    it("aprueba el mismo campo con su cupo interpolado", () => {
      expect(metadataSinCupo(CON_TOPE)).toEqual([]);
    });

    it("no exige el cupo a lo que no es el bot", () => {
      // «tu negocio abierto 24/7» habla del SISTEMA, que no tiene cupo de
      // conversaciones. Sin este recorte el gate obligaría a meter el límite
      // del add-on en la venta del producto que no lo tiene.
      const sistema = "description: `Tu negocio ordenado y abierto 24/7 con el sistema de Onia.`";
      expect(metadataSinCupo(sistema)).toEqual([]);
    });

    it("no acepta el número tipeado en vez de la constante", () => {
      const aMano = "description: `Chatbot que contesta 24/7, hasta 500 conversaciones por mes.`";
      expect(metadataSinCupo(aMano)).toHaveLength(1);
    });
  });
});
