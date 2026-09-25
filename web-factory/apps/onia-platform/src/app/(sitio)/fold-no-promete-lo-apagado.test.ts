import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { CAPACIDADES_INCLUIDAS, PLANES, planDeEntrada, primerPlanCon } from "@/lib/pricing";

/**
 * El FOLD de la portada — lo que se lee de un golpe de vista, antes de scrollear.
 *
 * 🔴 POR QUE EXISTE. Medido el 2026-09-25 sobre `onia.com.bo` SERVIDA, mirando la
 * captura renderizada (`npm run mirar:portada`). El hero decía, en el mismo bloque:
 *
 *   «Onia es el sistema con el que llevás tu negocio: clientes, caja, cobros y
 *    contabilidad, **con agentes que trabajan de noche** y te dejan las decisiones a vos.»
 *   «14 días de prueba con el plan Profesional, sin tarjeta. Después, **desde Bs 320** al mes.»
 *
 * Y el Básico —el que cuesta esos Bs 320— trae `agentesIncluidos: false`: los agentes
 * entran recién en Crece (Bs 550). El lead lee las dos frases, las dos son ciertas por
 * separado y falsas juntas, y se entera DESPUES de pagar. Es el daño que
 * `NOTA_PRUEBA_POR_PLAN` (lib/pricing.ts) ya tiene escrito palabra por palabra.
 *
 * Es el TERCER eslabón de una cadena que la casa ya pagó dos veces, y cada arreglo
 * dejó vivo al hermano de al lado:
 *
 *   1. las TARJETAS de precio  → arregladas el 2026-09-07 (`capacidad-vs-precio.test.ts`);
 *   2. el PANEL dibujado       → arreglado el 2026-09-19 (`6e75cca2`, `modulos-de-la-cuenta.ts`);
 *   3. la PROSA del hero       → esto.
 *
 * Y el 2 dejó a la pantalla contradiciéndose sola: el panel del fold hoy dibuja
 * «Clientes · Caja · Contabilidad» —honesto, deriva del plan de entrada— tres líneas
 * debajo de un texto que promete agentes. La misma pantalla, el mismo golpe de vista.
 *
 * POR QUE NINGUN GATE LO VEIA, que es lo que hace nueva a esta clase.
 * `capacidad-vs-precio.test.ts` es su dueño natural: nació por ESTE caso y lo cita
 * textual en su cabecera. Pasa en verde por **23 caracteres**. Mide la vecindad en
 * caracteres de texto leído con una ventana de 160, y hoy el marcador y el precio
 * quedaron a **183**: entre los dos crecieron los dos CTAs del hero
 * («Creá tu cuenta», «Preguntar por WhatsApp»). Su corte por distancia se evalúa
 * ANTES que la salvedad, así que el gate nunca llega a preguntar si la promesa está
 * desnuda — y lo está.
 *
 * Su ventana de 160 NO se toca, y no es pereza: está calibrada a propósito, con su
 * medición escrita («a 340 cruza el borde de sección y empieza a marcar frases que
 * describen el PRODUCTO … eso lo decide Sergio Urcullo viendo la pieza, no un gate»).
 * Subirla para alcanzar este caso rompería esa calibración y metería al gate en
 * territorio editorial. Lo que falta no es más ventana: es que el FOLD se mida como la
 * unidad que es. Un lead no cuenta caracteres — ve una pantalla.
 *
 * POR ESO EL SUJETO ES LA SECCION, NO LA DISTANCIA. Acá no hay ventana que calibrar:
 * o la capacidad está en el fold, o no está.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const PORTADA = join(AQUI, "page.tsx");

const ENTRADA = planDeEntrada();
const PLANES_DE_ARRIBA = PLANES.filter((p) => p.mensual > ENTRADA.mensual).map((p) => p.nombre);

/** Comentarios fuera: esta misma bitácora nombra la capacidad y el precio. */
function sinComentarios(texto: string): string {
  return texto.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^[ \t]*\/\/.*$/gm, " ");
}

function plano(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/**
 * El fold: del titular hasta el panel dibujado, que es lo último del primer golpe de
 * vista. Los dos bordes son elementos ESTRUCTURALES (el `<h1>` y `<PanelDibujado`), no
 * clases de CSS: un retoque de estilos no puede dejar al gate sin sujeto en silencio.
 *
 * Y si alguno de los dos bordes desaparece, esto NO cae en un fold vacío que pasaría en
 * verde para siempre: lo vigila la primera prueba de abajo.
 */
function foldDeLaPortada(): string {
  const fuente = sinComentarios(readFileSync(PORTADA, "utf8"));
  const desde = fuente.indexOf("<h1");
  const hasta = fuente.indexOf("<PanelDibujado", desde);
  if (desde === -1 || hasta === -1) return "";
  return fuente
    .slice(desde, hasta)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ");
}

/**
 * El sustantivo de cabeza de cada exclusión del plan de entrada — «Agentes de IA
 * (vienen desde Crece)» → `agentes`. Sale del DATO (`sinEsto`), no de una lista a mano:
 * una exclusión nueva nace vigilada. Misma regla que `capacidad-vs-precio.test.ts`,
 * porque la venta no repite la frase de la tabla: la parafrasea.
 */
function marcadorDe(exclusion: string): string | null {
  const cabeza = plano(exclusion).split(/[(—–-]| y /)[0];
  const palabra = cabeza.split(/\s+/).find((p) => p.replace(/[^a-z]/g, "").length >= 6);
  return palabra ? palabra.replace(/[^a-z]/g, "") : null;
}

const APAGADAS = Object.entries(CAPACIDADES_INCLUIDAS)
  .filter(([, campo]) => ENTRADA[campo] === false)
  .map(([capacidad]) => capacidad as keyof typeof CAPACIDADES_INCLUIDAS);

const EXCLUIDAS = ENTRADA.sinEsto.map((linea) => ({ linea, marcador: marcadorDe(linea) })).filter(
  (e): e is { linea: string; marcador: string } => e.marcador !== null,
);

/**
 * La salvedad tiene que contestar «¿desde qué plan viene ESTA capacidad?».
 *
 * ⚠️ `{PRUEBA.planQueCorre}` NO cuenta, y ésta es la diferencia fina con el gate vecino,
 * que sí lo acepta. Ahí la pregunta es si la promesa viaja con UN plan nombrado; acá el
 * fold ya nombra uno —«14 días de prueba con el plan Profesional»— y contesta otra cosa:
 * con qué plan corre la PRUEBA. Lejos de absolver, es lo que arma el daño: el lead prueba
 * 14 días con todo encendido, paga el plan de entrada, y ahí se le apaga. Aceptarlo como
 * salvedad haría que este gate naciera verde sobre el defecto que lo hizo nacer.
 */
function tieneSalvedad(fold: string): boolean {
  const v = plano(fold);
  if (/add-?on|se agrega|aparte|no inclui/.test(v)) return true;
  // La forma que NO envejece, y la única obligatoria desde el 2026-09-17:
  // `capacidad-incluida.test.ts` prohíbe TIPEAR el plan del que viene una capacidad.
  if (/primerplancon\s*\(/.test(v)) return true;
  // Con límite de palabra: «Pro» vive dentro de «aprobación» y «aprobás», que es como
  // termina cada frase que habla de los agentes en este sitio.
  return PLANES_DE_ARRIBA.some((nombre) => new RegExp(`\\b${plano(nombre)}\\b`).test(v));
}

describe("el fold de la portada no promete lo que el plan de entrada tiene apagado", () => {
  it("hay fold que auditar, y cita el precio de entrada (si no, el gate se quedó sin sujeto)", () => {
    const fold = foldDeLaPortada();
    expect(fold.length).toBeGreaterThan(200);
    // El fold es el sujeto PORQUE ahí vive el «desde Bs <plan de entrada>». El día que
    // el precio se vaya del primer golpe de vista, este gate está midiendo otra cosa.
    expect(plano(fold)).toMatch(/desde bs/);
  });

  it("hay exclusiones que vigilar, y salen del dato", () => {
    expect(APAGADAS.length).toBeGreaterThan(0);
    expect(EXCLUIDAS.length).toBeGreaterThan(0);
    expect(PLANES_DE_ARRIBA.length).toBeGreaterThan(0);
  });

  it("ninguna capacidad apagada se promete en el fold sin decir desde qué plan viene", () => {
    const fold = foldDeLaPortada();
    const plana = plano(fold);

    const desnudas = EXCLUIDAS.filter(({ marcador }) => plana.includes(marcador)).filter(
      () => !tieneSalvedad(fold),
    );

    expect(
      desnudas.map(
        ({ linea, marcador }) =>
          `«${linea}» aparece en el fold como «${marcador}», y ahí mismo se lee ` +
          `«desde Bs ${ENTRADA.mensual}»`,
      ),
      `El plan ${ENTRADA.nombre} cuesta Bs ${ENTRADA.mensual} y NO trae lo de abajo. ` +
        `Prometerlo en el MISMO golpe de vista que su precio hace que el lead pague ` +
        `creyendo que lo compró, y se entera cuando se le apaga — que es el peor momento ` +
        `en el que puede llegar. Se deriva el plan que sí lo trae con ` +
        `primerPlanCon("agentes") → «${primerPlanCon("agentes")}», nunca tipeado. ` +
        `Decir con qué plan corre la PRUEBA no alcanza: contesta otra pregunta.`,
    ).toEqual([]);
  });
});
