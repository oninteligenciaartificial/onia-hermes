import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { PLANES, cuantosPlanes } from "@/lib/pricing";

/**
 * Ninguna frase de venta tipea CUÁNTOS planes hay: los cuenta.
 *
 * Medido el 2026-09-13 contra producción (`onia.com.bo/` y `/precios` devuelven 200 e imprimen
 * la frase dos veces cada una — cuerpo y JSON-LD de la FAQ): el sitio decía **«En los tres
 * planes no cobramos implementación ni migración»** mientras pintaba **CUATRO** tarjetas
 * comprables (Bs 320 · 550 · 890 · 1.290). La escalera C sumó el plan Crece el 2026-09-12 y
 * cuatro frases se quedaron contando tres:
 *
 *   · `lib/pricing.ts` (CONDICIONES) — la letra chica de `/precios`
 *   · `app/(sitio)/faq-datos.ts` — la FAQ de la portada, que además viaja a Google en JSON-LD
 *   · `app/v1/precios/page.tsx` — y de yapa enumeraba TRES saltos de valor
 *   · `app/v1/empezar/resultado.tsx` — el cierre del wizard
 *
 * Por qué importa y no es cosmético: la promesa es de PLATA. El lead parado en el Crece de
 * Bs 550 —el escalón nuevo, el que se vende como el salto a los agentes— leía una enumeración
 * que no lo nombraba, con las cuatro tarjetas a la vista. O no le alcanza la promesa, o el
 * sitio se contradice solo; las dos cuestan la venta.
 *
 * ⚠️ **Por qué el gate prohíbe el numeral en vez de exigir "cuatro".** Prohibir el número
 * equivocado se apaga solo el día que la respuesta correcta sea ese número: con cinco planes,
 * un gate que buscara "tres" quedaría verde sobre un texto que dice "cuatro". El sujeto es la
 * FORMA —un numeral pegado a la palabra «plan»— y la cura es que salga de `cuantosPlanes()`.
 *
 * ⚠️ **El universo se camina del DISCO, no de `git ls-files`**: git sólo ve lo trackeado, así
 * que la pantalla nueva sin commitear —justo el sujeto que este gate existe para no perder—
 * sería invisible y la mutación pasaría verde.
 *
 * ⚠️ **Se mide sobre el código con los comentarios EN BLANCO.** Esta cabecera cita «los tres
 * planes» para contar qué pasó: un gate que no los filtrara obligaría a borrar el registro,
 * que es como esta familia de gates falla.
 */

const AQUI = path.dirname(fileURLToPath(import.meta.url));
/** `src/` — el mismo sujeto que el resto de los gates de esta app. */
const SRC = path.resolve(AQUI, "..", "..");

/**
 * Un numeral —en palabras o en dígito— pegado a «plan/planes», con la tolerancia justa para
 * «los tres planes de arriba». No entra `un plan`/`el plan`: hablar de UN plan en singular es
 * lo normal («cambiás de plan cuando quieras») y no afirma cuántos hay.
 */
const NUMERAL_JUNTO_A_PLANES =
  /\b(dos|tres|cuatro|cinco|seis|siete|ocho|[2-9])\s+planes\b/i;

/**
 * Exclusiones, cada una con su motivo, re-medidas en cada corrida. Vacía a propósito: si
 * mañana hace falta una, que quede escrita acá y no como un silencio.
 */
const EXENTOS: ReadonlyArray<{ archivo: string; motivo: string }> = [];

function archivosDe(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...archivosDe(p));
    else if (/\.tsx?$/.test(e.name) && !/\.test\.tsx?$/.test(e.name)) out.push(p);
  }
  return out;
}

/** Quita comentarios CONSERVANDO los saltos de línea, para que la línea reportada no mienta. */
function sinComentarios(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/\/\/[^\n]*/g, (m) => " ".repeat(m.length));
}

interface Hallazgo {
  archivo: string;
  linea: number;
  texto: string;
}

function buscar(re: RegExp): Hallazgo[] {
  const exentos = new Set(EXENTOS.map((e) => e.archivo));
  const hallazgos: Hallazgo[] = [];

  for (const abs of archivosDe(SRC)) {
    const rel = path.relative(SRC, abs);
    if (exentos.has(rel)) continue;

    const lineas = sinComentarios(fs.readFileSync(abs, "utf8")).split("\n");
    lineas.forEach((linea, i) => {
      if (re.test(linea)) {
        hallazgos.push({ archivo: rel, linea: i + 1, texto: linea.trim() });
      }
    });
  }
  return hallazgos;
}

function comoLista(hs: Hallazgo[]): string {
  return hs.map((h) => `  ${h.archivo}:${h.linea}  ${h.texto}`).join("\n");
}

describe("la cantidad de planes se cuenta, no se tipea", () => {
  it("el barrido ve el árbol entero", () => {
    // Ancla contra el fallo ABIERTO: si alguien recorta el recorrido, los casos de abajo
    // dejarían de mirar nada y pasarían en verde sin vigilar nada.
    expect(archivosDe(SRC).length).toBeGreaterThan(20);
  });

  it("cuenta los planes que el sitio publica de verdad", () => {
    // El caso ancla: el helper no puede ser una constante disfrazada. Hoy son cuatro
    // —Básico, Crece, Pro y Full—; Grupo / Empresarial no entra porque no se compra en línea.
    expect(PLANES.length).toBeGreaterThanOrEqual(2);
    expect(cuantosPlanes()).toBe("cuatro");
    expect(cuantosPlanes(PLANES.slice(0, 3))).toBe("tres");
    expect(cuantosPlanes(PLANES.slice(0, 2))).toBe("dos");
  });

  it("ninguna pantalla tipea cuántos planes hay", () => {
    const tipeados = buscar(NUMERAL_JUNTO_A_PLANES);

    expect(
      tipeados,
      `hay frases que cuentan los planes a mano. La cantidad sale de cuantosPlanes() ` +
        `(lib/pricing.ts): el día que entre un plan —como entró el Crece el 2026-09-12— la ` +
        `frase se mueve sola en vez de dejar afuera al que el lead está mirando.\n` +
        comoLista(tipeados),
    ).toEqual([]);
  });

  it("las dos frases que cuentan planes siguen contándolos", () => {
    // Un gate que sólo PROHÍBE se satisface borrando lo que vigila: sin este caso, arrancar la
    // frase de la FAQ dejaría el de arriba en verde. Las dos son promesas de plata —"no
    // cobramos implementación ni migración"— y son las que el lead usa para decidir.
    const SUJETOS = [
      path.join(SRC, "lib", "pricing.ts"),
      path.join(SRC, "app", "(sitio)", "faq-datos.ts"),
    ];

    for (const abs of SUJETOS) {
      const rel = path.relative(SRC, abs);
      expect(fs.existsSync(abs), `no existe ${rel}`).toBe(true);

      const codigo = sinComentarios(fs.readFileSync(abs, "utf8"));
      expect(
        /cuantosPlanes\(\)\s*\}\s*planes/.test(codigo),
        `${rel} dejó de contar los planes con cuantosPlanes(). Si la frase se fue, este ` +
          `caso tiene que mudarse con ella — no borrarse.`,
      ).toBe(true);
    }
  });
});
