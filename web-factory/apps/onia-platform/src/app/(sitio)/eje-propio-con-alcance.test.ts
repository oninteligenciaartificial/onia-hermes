import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import * as PRICING from "@/lib/pricing";
import { CONTENDIENTES, EJES } from "@/lib/proof";

/**
 * La matriz de la comparativa no puede afirmar una capacidad NUESTRA sin decir
 * hasta dónde llega — y toda superficie que la renderice tiene que mostrarlo.
 *
 * 🔴 **Por qué ningún gate podía verlo, y por qué no es una instancia más.**
 * El eje (capacidad, RUBRO) ya tenía tres instrumentos, y los tres persiguen la
 * MENCIÓN de la capacidad como TEXTO: `app/capacidad-acotada.test.ts` la busca
 * por su nombre en todo `src/`, `app/capacidad-en-la-enumeracion.test.ts` la
 * busca dentro de una enumeración, y `(sitio)/capacidad-por-rubro.test.ts`
 * deriva sus sujetos de las líneas de `PLANES`.
 *
 * Acá la afirmación **no es texto**: es el dato `estados: { gestion: "si" }`, y
 * el nombre de la capacidad vive en otro objeto (`EJES`), unido por una clave.
 * La palabra «agenda» no aparece ni una vez al lado de ese «si», así que ningún
 * patrón de texto puede juntar las dos mitades — por bien escrito que esté. Los
 * tres pasaban en VERDE, con razón, sobre el defecto.
 *
 * Medido el 2026-09-11 contra `origin/master` de `onia-platform` recorriendo
 * `VERTICAL_PACKS` de los 5 rubros de `RUBROS_ACTIVOS`: `tieneAgenda` y
 * `guardaClientesEnPatients` —el corte del Recall desde `64279ff`— son los dos
 * **false** para `gestios-general` (comercio) y `proveegest-electrico`
 * (importadora). La tabla les decía «Sí» a las dos capacidades en las TRES
 * superficies vivas que la renderizan, todas con HTTP 200:
 * `onia.com.bo/comparativa`, `/v1/comparativa` y la portada de `/v1`.
 *
 * TRES DECISIONES QUE LO HACEN CLASE Y NO INSTANCIA:
 *
 *  1. **El universo son los EJES, no una lista de capacidades sospechadas.** Un
 *     eje nuevo que nuestra fila afirme nace obligado a declarar su alcance: la
 *     agenda se escapó de las dos listas de `ALCANCE_*` justamente porque nadie
 *     la sospechó (es lo primero que uno da por hecho en un sistema de gestión).
 *  2. **Los CONSUMIDORES se derivan del disco.** No alcanza con que el dato
 *     traiga el alcance: una superficie que renderice la matriz y no lo pinte
 *     deja el «Sí» pelado igual. Un render nuevo nace cubierto.
 *  3. **Se exige el IDENTIFICADOR de `lib/pricing.ts`, no la frase tipeada.**
 *     Dos copias de la misma salvedad es como llegaron a convivir cuatro precios
 *     del mismo chatbot; y al leerse de la fuente, el día que cambie el alcance
 *     real cambia en las tres superficies a la vez.
 *
 * Se mide sobre el código SIN COMENTARIOS: un gate que busca su literal en el
 * archivo entero se absuelve con la bitácora que explica por qué el literal va.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const SRC = join(AQUI, "..", "..");

/** Blanquea comentarios conservando los saltos de línea (así `:línea` no corre). */
function sinComentarios(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + " ".repeat(m.length - p1.length));
}

function archivos(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) archivos(p, out);
    else if (/\.tsx?$/.test(e.name) && !/\.test\.tsx?$/.test(e.name)) out.push(p);
  }
  return out;
}

/**
 * Las frases de alcance que `lib/pricing.ts` exporta, con su nombre. Se leen del
 * módulo entero —no de una lista acá— para que una constante nueva cuente sola.
 */
const ALCANCES_DE_LA_FUENTE = Object.entries(PRICING).filter(
  ([nombre, valor]) => nombre.startsWith("ALCANCE_") && typeof valor === "string",
) as [string, string][];

/** La fila que se declara NUESTRA: es la única cuyo alcance conocemos. */
const ONIA = CONTENDIENTES.find((c) => c.esOnia);

describe("la matriz de la comparativa dice hasta dónde llega lo NUESTRO", () => {
  it("hay una fila propia y la fuente exporta frases de alcance", () => {
    expect(ONIA, "ninguna fila tiene esOnia: el gate no tendría sujeto").toBeTruthy();
    expect(ALCANCES_DE_LA_FUENTE.length).toBeGreaterThan(0);
  });

  it("cada eje que NUESTRA fila afirma trae su alcance, y sale de lib/pricing.ts", () => {
    const sinDecir: string[] = [];
    const tipeados: string[] = [];

    for (const eje of EJES) {
      if (ONIA?.estados[eje.id] !== "si") continue;
      const alcance = eje.alcanceOnia as string | null;
      if (alcance === null) {
        // `null` es legítimo sólo si la capacidad llega a los cinco rubros del
        // alta. Hoy ninguna lo hace, y el día que una lo haga se declara acá con
        // su medición — no se deja el hueco abierto por omisión.
        sinDecir.push(
          `«${eje.label}»: nuestra fila dice «Sí» y no declara alcanceOnia. ` +
            `Si de verdad llega a los 5 rubros del alta, medilo contra VERTICAL_PACKS y dejalo escrito.`,
        );
        continue;
      }
      const viene = ALCANCES_DE_LA_FUENTE.some(([, frase]) => frase === alcance);
      if (!viene) {
        tipeados.push(
          `«${eje.label}»: su alcance («${alcance}») no es ninguna constante ALCANCE_* de lib/pricing.ts. ` +
            `Una segunda copia de la salvedad se despega el día que cambie el alcance real.`,
        );
      }
    }

    expect(sinDecir, sinDecir.join("\n")).toEqual([]);
    expect(tipeados, tipeados.join("\n")).toEqual([]);
  });

  it("un eje que NO afirmamos no puede traer alcance colgando", () => {
    // Un `alcanceOnia` sobre un «no» o un «en trámite» es una salvedad huérfana:
    // no se renderiza, nadie la re-mide, y entra pre-aprobada el día que ese eje
    // pase a «Sí» — que es exactamente cómo sobrevive el copy muerto.
    const sobrantes = EJES.filter(
      (e) => ONIA?.estados[e.id] !== "si" && e.alcanceOnia !== null,
    ).map((e) => `«${e.label}» no lo afirmamos y trae alcanceOnia`);
    expect(sobrantes, sobrantes.join("\n")).toEqual([]);
  });

  it("toda superficie que renderiza la matriz pinta el alcance de nuestra fila", () => {
    // El sujeto se deriva del DISCO: un render nuevo de CONTENDIENTES nace
    // cubierto, en vez de depender de que alguien lo agregue a una lista.
    const mudas: string[] = [];
    for (const ruta of archivos(SRC)) {
      const crudo = readFileSync(ruta, "utf8");
      if (!/\bCONTENDIENTES\b/.test(crudo)) continue;
      const codigo = sinComentarios(crudo);
      // Sólo mira quien RENDERIZA la matriz: leer estados por eje.
      if (!/\bestados\s*\[/.test(codigo) && !/\bestados\[/.test(codigo)) continue;
      if (!/\balcanceOnia\b/.test(codigo)) {
        mudas.push(
          `${relative(SRC, ruta)} renderiza la matriz y nunca nombra alcanceOnia: ` +
            `pinta un «Sí» pelado a los rubros que no tienen la capacidad.`,
        );
      }
    }
    expect(mudas, mudas.join("\n")).toEqual([]);
  });
});
