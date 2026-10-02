import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  CONTENDIENTES,
  EJES,
  cuantosCruzanTodosLosEjes,
  tituloDelCuadro,
  type Contendiente,
  type EjeId,
} from "@/lib/proof";

/**
 * La comparación NO afirma un cruce que su propia tabla refuta.
 *
 * El defecto, medido el 2026-09-18 sobre `onia.com.bo` servido (build
 * 2026-09-18 02:41 UTC): `/comparativa` abría el cuadro con un `<h2>` tipeado
 * —«Tres ejes. El que los cruza es uno solo.»— y diez líneas más abajo pintaba
 * la tabla que lo desmiente. Ninguna fila de `CONTENDIENTES` tiene los tres
 * ejes en `"si"`; la nuestra dice `siat: "tramite"` y su veredicto lo admite.
 * El lead leía «el único» y entendía Onia, en la única pantalla del sitio que
 * existe para que nos crean, y a la que `/precios` lo manda con «¿Lo estás
 * comparando con otra opción? Mirá la comparación».
 *
 * ⚠️ **Por qué ningún gate lo veía.** `promesa-en-el-cuerpo.test.ts` exime a
 * `/comparativa` con un motivo CIERTO —ahí el lector ve el estado real—, pero
 * esa exención cubre la tabla y `HUECO` (que habla del mercado y se comprueba
 * mirándola), no una afirmación de unicidad tipeada al lado, que la tabla no
 * corrige. Y la forma que envejece acá es un CONTEO: «uno solo» no es un
 * precio, ni un nombre de plan, ni la mención de una capacidad, así que las
 * tres familias de gates del sitio son ciegas a él.
 *
 * ⚠️ **Se prohíbe la FORMA, no el texto viejo.** Prohibir la frase «el que los
 * cruza es uno solo» se apagaría solo el día que ésa sea la respuesta correcta
 * —justo cuando el emisor se homologue—, que es cuando más haría falta que el
 * número saliera del dato. Por eso el sujeto es *afirmar una cantidad al lado
 * de un verbo de cruce sin derivarla*.
 */

const AQUI = import.meta.dirname;
const SRC = join(AQUI, "..", "..", "..");

/** Se camina el DISCO, no `git ls-files`: el archivo nuevo sin commitear es
 *  justo el sujeto que este gate existe para no perder. Se saltean los
 *  directorios con la convención de siembra de otros gates (`__x__`), que
 *  aparecen y desaparecen mientras se lee. */
function tsxDeSrc(dir: string, acc: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next") continue;
    if (/^__.+__$/.test(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) tsxDeSrc(p, acc);
    else if (/\.tsx?$/.test(e.name) && !/\.test\.tsx?$/.test(e.name)) acc.push(p);
  }
  return acc;
}

/** Los sujetos: lo que RENDERIZA la tabla. Derivado del disco, nunca a mano. */
function pantallasDeLaComparacion(): string[] {
  return tsxDeSrc(SRC).filter((f) => {
    const src = readFileSync(f, "utf8");
    return src.includes("CONTENDIENTES") && !f.endsWith(join("lib", "proof.ts"));
  });
}

/** Comentarios en blanco conservando saltos: un comentario que NARRA el
 *  defecto no puede acusar al archivo que lo documenta. */
function sinComentarios(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/\/\/[^\n]*/g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, (m) => m.replace(/[^\n]/g, " "));
}

const VERBO_DE_CRUCE = /\bcruz(a|an|ar|arlos)\b/i;
const CANTIDAD =
  /\b(uno solo|una sola|ninguno|ninguna|el [úu]nico|la [úu]nica|los? cruzan? \d+|dos|tres|cuatro)\b/i;

describe("el titular de la comparación sale de la tabla, no de la mano", () => {
  it("hoy ninguna fila cruza los tres ejes — el dato que el titular tiene que decir", () => {
    // Afirmado contra los DATOS crudos, no contra el helper: si los dos leyeran
    // lo mismo el caso sería tautológico y no podría romperse nunca.
    const cruzan = CONTENDIENTES.filter((c) =>
      EJES.every((e) => c.estados[e.id] === "si"),
    );
    expect(cruzan).toHaveLength(0);

    const onia = CONTENDIENTES.find((c) => c.esOnia);
    expect(onia, "la tabla tiene que tener nuestra fila").toBeDefined();
    // Era "tramite" hasta el 2026-10-01; ese estado se sacó de la venta y la
    // fila dice lo que hay hoy: Onia no emite la factura fiscal.
    expect(onia!.estados.siat).toBe("no");
  });

  it("el titular NO afirma que alguien cruza los tres mientras nadie los cruce", () => {
    const titulo = tituloDelCuadro();
    expect(cuantosCruzanTodosLosEjes()).toBe(0);
    expect(
      /uno solo|el [úu]nico|los cruzan/i.test(titulo),
      `el titular dice «${titulo}» con CERO filas que crucen los tres ejes`,
    ).toBe(false);
    expect(titulo).toBe("Tres ejes. Hoy no los cruza ninguno.");
  });

  it("y vuelve a decir «uno solo» solo cuando eso sea verdad", () => {
    // El caso INALCANZABLE con los datos de hoy: es el único que prueba que el
    // titular se deriva de verdad y que la promesa vuelve sola el día que el
    // emisor se homologue. Mundo sembrado, no los datos reales.
    const ejes: readonly { id: EjeId }[] = EJES;
    const conLaFacturaViva = CONTENDIENTES.map((c) =>
      c.esOnia ? { ...c, estados: { ...c.estados, siat: "si" as const } } : c,
    ) as readonly Contendiente[];

    expect(cuantosCruzanTodosLosEjes(conLaFacturaViva, ejes)).toBe(1);
    expect(tituloDelCuadro(conLaFacturaViva, ejes)).toBe(
      "Tres ejes. El que los cruza es uno solo.",
    );

    const dosCruzan = conLaFacturaViva.map((c) =>
      c.id === "dental-region" ? { ...c, estados: { ...c.estados, siat: "si" as const } } : c,
    ) as readonly Contendiente[];
    expect(tituloDelCuadro(dosCruzan, ejes)).toBe("Tres ejes. Los cruzan 2.");
  });

  it("ninguna pantalla de la comparación TIPEA la cantidad que cruza", () => {
    const sujetos = pantallasDeLaComparacion();

    // Caso ancla: el sujeto conocido está en el universo. Sin esto, un universo
    // que se queda vacío firma verde para siempre.
    expect(
      sujetos.some((f) => f.includes(join("(sitio)", "comparativa"))),
      `la página de /comparativa tiene que estar entre los sujetos; hay ${sujetos.length}`,
    ).toBe(true);

    const culpables: string[] = [];
    for (const f of sujetos) {
      const limpio = sinComentarios(readFileSync(f, "utf8"));
      for (const linea of limpio.split("\n")) {
        // La ventana es la ORACIÓN: una cantidad y un verbo de cruce en frases
        // distintas del mismo renglón no se acusan entre sí.
        for (const oracion of linea.split(/(?<=[.!?])\s+/)) {
          if (VERBO_DE_CRUCE.test(oracion) && CANTIDAD.test(oracion)) {
            culpables.push(`${f.replace(SRC, "src")} → ${oracion.trim()}`);
          }
        }
      }
    }

    expect(
      culpables,
      `Tipean cuántos cruzan los ejes en vez de derivarlo de la tabla.\n` +
        `Se dice con tituloDelCuadro() de lib/proof.ts:\n  ${culpables.join("\n  ")}`,
    ).toEqual([]);
  });
});
