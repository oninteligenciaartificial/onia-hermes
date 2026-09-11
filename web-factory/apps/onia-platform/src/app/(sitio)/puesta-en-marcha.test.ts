import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";
import * as ALTA from "./alta";
import {
  ALTA_CONFIRMA_CORREO,
  ALTA_VERBO_VOS,
  DE_DONDE_LLEGA_EL_ENLACE,
  FRASE_CONFIRMACION,
  PASO_CONFIRMAR_CORREO,
  PASO_CONFIRMAR_CORREO_IMPERATIVO,
} from "./alta";

/**
 * La venta enumera la puesta en marcha, y no puede SALTEARSE un paso que el
 * producto exige.
 *
 * La familia de guards de este carril juzga lo que la venta AFIRMA: que no
 * sobre obra, que no prometa una capacidad que no existe, que no exija una
 * condición que el producto no impone (`datos-que-se-llevan.test.ts`), que el
 * monto salga de la fuente. Todos miran palabras que ESTÁN. Ninguno puede ver
 * este defecto, porque acá no sobra ninguna palabra: cada término de la
 * enumeración es cierto por separado y lo que está mal es que falte uno.
 *
 *   "No pide tarjeta ni pago: creás tu cuenta, elegís tu rubro y usás el
 *    sistema completo esos 14 días."     ← home, viva, y además en el JSON-LD
 *
 * Entre "creás tu cuenta" y "usás el sistema" hay un paso obligatorio: abrir el
 * correo y confirmar. Medido en producción el 2026-09-11 (las tres capas están
 * en la cabecera de `alta.ts`), con 1 de 8 cuentas parada justo ahí. Quien hace
 * exactamente lo que la home dice se come un 403 `email_not_confirmed` que nadie
 * le anticipó — en el último clic del embudo, que es donde más caro sale.
 *
 * El invariante no es "la home dice tal frase": eso queda verde en cuanto
 * alguien reescribe el copy. Es que TODA oración que vaya del alta al uso del
 * sistema nombre el paso mientras el producto lo exija — y como la condición
 * sale de `ALTA_CONFIRMA_CORREO`, invertir la bandera invierte el guard solo:
 * el día que se apague la confirmación, el copy que la nombre pasa a estar
 * prohibido y este mismo guard lo caza, sin envejecer con el texto.
 */

const AQUI = dirname(fileURLToPath(import.meta.url));

/**
 * `src` entero, no sólo `(sitio)`: el árbol `/v1` sigue publicado y servido
 * (200 medido), y de hecho DOS de las cuatro enumeraciones vivían ahí. Un gate
 * cuyas raíces se escriben a mano cubre sólo los archivos que ya fallaron.
 */
const RAIZ = join(AQUI, "..", "..");

const EXENTOS = new Set(["node_modules", ".next", "capturas"]);

function fuentes(dir: string): string[] {
  const salida: string[] = [];
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    if (entrada.name.startsWith(".") || EXENTOS.has(entrada.name)) continue;
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) {
      salida.push(...fuentes(ruta));
      continue;
    }
    if (!/\.tsx?$/.test(entrada.name)) continue;
    if (/\.test\.tsx?$/.test(entrada.name)) continue;
    salida.push(ruta);
  }
  return salida;
}

/**
 * Blanquea comentarios CONSERVANDO los saltos de línea y el largo.
 *
 * Las dos cosas son necesarias y por motivos distintos. Conservar el largo
 * mantiene el mapeo índice→línea, así el hallazgo se reporta en su renglón y no
 * en uno corrido. Y blanquear es obligatorio: la bitácora que explica este mismo
 * defecto —la de `alta.ts`— dice "entre crear la cuenta y usar el sistema", o
 * sea que sin esto el guard da rojo sobre el registro de lo que pasó y obedecerlo
 * obliga a borrarlo. El `//` de dentro de una URL (`https://`) no abre comentario.
 */
function sinComentarios(fuente: string): string {
  let salida = "";
  let i = 0;
  while (i < fuente.length) {
    const dos = fuente.slice(i, i + 2);
    if (dos === "//" && fuente[i - 1] !== ":") {
      while (i < fuente.length && fuente[i] !== "\n") {
        salida += " ";
        i += 1;
      }
      continue;
    }
    if (dos === "/*") {
      while (i < fuente.length && fuente.slice(i, i + 2) !== "*/") {
        salida += fuente[i] === "\n" ? "\n" : " ";
        i += 1;
      }
      salida += "  ";
      i += 2;
      continue;
    }
    salida += fuente[i];
    i += 1;
  }
  return salida;
}

/**
 * Resuelve las interpolaciones, conservando el largo.
 *
 * Sin esto el guard es ciego a la mitad del sujeto: la enumeración de la home no
 * tipea el verbo del alta, lo interpola (`${ALTA_VERBO_VOS}`) — que es lo
 * correcto, y es justo lo que la haría invisible a un barrido de literales. Las
 * conocidas se sustituyen por su texto rellenado al mismo ancho; las demás se
 * borran, porque un `${PRUEBA.dias}` en el medio no parte la oración.
 */
const CONOCIDAS: Record<string, string> = {
  ALTA_VERBO_VOS,
  PASO_CONFIRMAR_CORREO,
  PASO_CONFIRMAR_CORREO_IMPERATIVO,
  DE_DONDE_LLEGA_EL_ENLACE,
};

function resolverInterpolaciones(fuente: string): string {
  return fuente.replace(/\$\{([^{}]*)\}/g, (todo, dentro: string) => {
    const valor = CONOCIDAS[dentro.trim()];
    const texto = valor ?? "";
    return texto.length >= todo.length
      ? texto.slice(0, todo.length)
      : texto + " ".repeat(todo.length - texto.length);
  });
}

/**
 * El verbo del alta. `registraste`/`registrada` quedan fuera a propósito: en
 * este sitio lo que más se "registra" es una VENTA ("la venta que ya registraste
 * al cobrar", `lib/siat.ts`), y un patrón que las tome manda a reescribir copy
 * fiscal impecable — la dirección cara.
 */
const VERBO_ALTA =
  /te\s+registr[aá]s|registrate|registr[aá]s\s+(?:solo|sola|en)|cre[aá][rs]?\s+(?:tu|mi|la)\s+cuenta/i;

/**
 * "Ya estás adentro, usando el sistema". Se exige esta forma fuerte y no
 * cualquier verbo de uso: "creás tu cuenta hoy y probalo con tu negocio" (el
 * cierre de la home) es una invitación, no una enumeración de pasos, y ponerla
 * en rojo mandaría a meter letra chica en un cierre de página. El caso
 * `el cierre de la home no es una enumeración` fija ese límite: si algún día se
 * ensancha el patrón, ese caso avisa en vez de que el cambio entre mudo.
 */
const VERBO_USO =
  /us[aá]s?\s+el\s+sistema|qued[aá]s\s+andando|el\s+sistema\s+carga\s+tus\s+datos|ya\s+pod[eé]s\s+(?:usar|empezar\s+a\s+usar)/i;

/**
 * Corta en oraciones candidatas.
 *
 * Además del punto, cortan los delimitadores de literal y de etiqueta: dos
 * cadenas vecinas no forman una oración, y unirlas inventaría enumeraciones que
 * nadie escribió. Prettier parte un literal largo en dos renglones, así que el
 * salto de línea NO corta — ésa es la trampa que deja media oración sin
 * contexto y hace reportar copy sano.
 */
function oraciones(plano: string): { texto: string; indice: number }[] {
  const trozos: { texto: string; indice: number }[] = [];
  let actual = "";
  let inicio = 0;
  const corta = (c: string) => /[.!?`"'<>;]/.test(c);
  for (let i = 0; i < plano.length; i += 1) {
    const c = plano[i];
    if (corta(c)) {
      if (actual.trim()) trozos.push({ texto: actual, indice: inicio });
      actual = "";
      inicio = i + 1;
      continue;
    }
    if (!actual) inicio = i;
    actual += c;
  }
  if (actual.trim()) trozos.push({ texto: actual, indice: inicio });
  return trozos;
}

interface Hallazgo {
  archivo: string;
  linea: number;
  oracion: string;
}

function enumeracionesDePuestaEnMarcha(): Hallazgo[] {
  const salida: Hallazgo[] = [];
  for (const ruta of fuentes(RAIZ)) {
    const crudo = readFileSync(ruta, "utf8");
    const plano = resolverInterpolaciones(sinComentarios(crudo));
    for (const { texto, indice } of oraciones(plano)) {
      const unaLinea = texto.replace(/\s+/g, " ").trim();
      if (!VERBO_ALTA.test(unaLinea)) continue;
      if (!VERBO_USO.test(unaLinea)) continue;
      salida.push({
        archivo: relative(RAIZ, ruta),
        linea: plano.slice(0, indice).split("\n").length,
        oracion: unaLinea,
      });
    }
  }
  return salida;
}

describe("la venta no se saltea un paso de la puesta en marcha", () => {
  const enumeraciones = enumeracionesDePuestaEnMarcha();

  it("el barrido sigue encontrando las enumeraciones que existen", () => {
    // El ancla contra el gate que se apaga solo: el día que alguien recorte las
    // raíces, cambie el tokenizador o Prettier parta el literal de otra forma,
    // el universo se vacía y TODOS los casos de abajo pasan en verde sin haber
    // mirado una línea. Que el número baje a cero es la firma de esa avería.
    expect(
      enumeraciones.length,
      "el barrido no encontró NINGUNA enumeración del alta al uso del sistema: " +
        "no es que el sitio esté limpio, es que el guard dejó de medir",
    ).toBeGreaterThan(0);
  });

  it.runIf(ALTA_CONFIRMA_CORREO)(
    "toda enumeración que va del alta al sistema nombra el paso que el producto exige",
    () => {
      const mudas = enumeraciones.filter((e) => !FRASE_CONFIRMACION.test(e.oracion));
      expect(
        mudas.map((e) => `${e.archivo}:${e.linea} → "${e.oracion}"`),
        `El alta exige confirmar el correo (alta.ts: ALTA_CONFIRMA_CORREO, medido en ` +
          `producción) y estas enumeraciones van del registro al uso del sistema sin ` +
          `nombrarlo. El lead que hace lo que dicen se come un 403 email_not_confirmed. ` +
          `No se borra la promesa: se intercala PASO_CONFIRMAR_CORREO, leído de alta.ts.`,
      ).toEqual([]);
    },
  );

  it.runIf(!ALTA_CONFIRMA_CORREO)(
    "si el producto deja de exigirlo, ninguna superficie sigue pidiéndolo",
    () => {
      const sobrantes = enumeraciones.filter((e) => FRASE_CONFIRMACION.test(e.oracion));
      expect(
        sobrantes.map((e) => `${e.archivo}:${e.linea}`),
        "ALTA_CONFIRMA_CORREO está en false y estas superficies siguen mandando a " +
          "confirmar el correo: es un paso que ya no existe, puesto en el último clic.",
      ).toEqual([]);
    },
  );

  it("el resolvedor conoce todas las formas del paso que exporta alta.ts", () => {
    // `CONOCIDAS` es una lista de inclusión, y como tal falla el día que alguien
    // agrega una cuarta redacción del paso: la interpolación se resuelve a
    // vacío, la oración queda sin nombrarlo y el guard da ROJO sobre una página
    // recién arreglada — que es lo que pasó al escribir esto, con la forma
    // imperativa. Atarlo a los exports vuelve el hueco fail-closed: la forma
    // nueva se declara acá o este caso la nombra.
    const formasDelPaso = Object.entries(ALTA)
      .filter(([, v]) => typeof v === "string" && FRASE_CONFIRMACION.test(v as string))
      .map(([k]) => k);
    expect(
      formasDelPaso.filter((k) => !(k in CONOCIDAS)),
      "alta.ts exporta una forma del paso que el resolvedor no conoce: agregala a " +
        "CONOCIDAS o el guard acusará en falso a quien la use",
    ).toEqual([]);
  });

  it("el cierre de la home no es una enumeración de pasos", () => {
    // El límite del patrón, escrito como caso. "creás tu cuenta hoy y probalo
    // con tu propio negocio" invita, no enumera: exigirle letra chica sería el
    // falso positivo caro. Si alguien ensancha VERBO_USO para tomar "probalo",
    // este caso cae y la decisión se toma a la vista en vez de entrar muda.
    expect(VERBO_USO.test("creás tu cuenta hoy y probalo con tu propio negocio")).toBe(
      false,
    );
  });

  it("registrar una venta no es registrarse", () => {
    // La otra mitad del mismo riesgo: el copy fiscal habla todo el tiempo de
    // ventas registradas, y tomarlas mandaría a reescribir páginas impecables.
    expect(
      VERBO_ALTA.test("la factura sale de la misma venta que ya registraste al cobrar"),
    ).toBe(false);
  });
});
