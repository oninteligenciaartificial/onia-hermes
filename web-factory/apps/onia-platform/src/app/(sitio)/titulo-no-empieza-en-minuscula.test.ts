import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { ALTA_VERBO_VOS, ALTA_VERBO_VOS_TITULO } from "./alta";

/**
 * Un título de venta no arranca en minúscula.
 *
 * POR QUÉ EXISTE. Medido el 2026-09-25 MIRANDO la home renderizada en
 * producción: el cierre —la última pantalla antes del pie, el empujón final al
 * alta— mostraba en tipografía display, a tres renglones y centrado:
 *
 *     creás tu cuenta
 *     hoy y probalo con
 *     tu propio negocio.
 *
 * Se lee como una frase cortada a la que le falta el arranque. La causa no era
 * el render: `page.tsx` abría el `<h2>` con `{ALTA_VERBO_VOS}`, que `alta.ts`
 * declara en su propio comentario como «el mismo verbo dentro de una frase
 * CORRIDA (FAQ, metadatos, prosa)» — un fragmento pensado para ir en el medio
 * de una oración, puesto a empezar un titular.
 *
 * Es el defecto que ningún gate de al lado podía ver. Los tests de copy leen
 * literales y este texto no es un literal; `precios-vivos` y `enlaces-vivos`
 * miran números y destinos; la captura del pie lo tenía a la vista desde
 * siempre y hacía falta un ojo. Este test lo convierte en rojo automático.
 *
 * QUÉ MIDE. Los títulos (`<h1>`/`<h2>`) del `page.tsx` de la home, con las
 * interpolaciones RESUELTAS contra el valor que realmente publica `alta.ts`:
 * lo que importa es la letra que ve el lead, no la que está tipeada. Por eso el
 * caso del flag cerrado (`pedís tu acceso`) también está cubierto abajo: si
 * mañana se cierra el alta, el título tiene que seguir arrancando en mayúscula.
 *
 * FALLA CERRADA. Una interpolación que este archivo no sepa resolver es un
 * rojo, no un permiso: un gate que saltea lo que no entiende deja pasar
 * exactamente el caso nuevo que nadie miró.
 */

const PAGE = join(__dirname, "page.tsx");

/** El valor publicado de cada expresión que puede ABRIR un título. */
const INTERPOLACIONES_CONOCIDAS: Record<string, string> = {
  ALTA_VERBO_VOS,
  ALTA_VERBO_VOS_TITULO,
};

type Titulo = { etiqueta: string; crudo: string };

/**
 * Los `<h1>`/`<h2>` del fuente, con su contenido. Se lee el archivo como texto
 * a propósito: importar el componente obligaría a renderizar React acá, y lo
 * que se quiere vigilar es lo que alguien ESCRIBE en el JSX.
 */
export function titulosDe(fuente: string): Titulo[] {
  const titulos: Titulo[] = [];
  const abre = /<(h[12])\b[^>]*>/g;
  let m: RegExpExecArray | null;
  while ((m = abre.exec(fuente)) !== null) {
    const etiqueta = m[1];
    const cierra = fuente.indexOf(`</${etiqueta}>`, abre.lastIndex);
    if (cierra === -1) continue;
    titulos.push({ etiqueta, crudo: fuente.slice(abre.lastIndex, cierra) });
  }
  return titulos;
}

/**
 * La primera letra que ve el lead. Devuelve `null` cuando el título abre con
 * una interpolación que no sabemos resolver — el llamador lo trata como rojo.
 */
export function primeraLetraVisible(
  crudo: string,
  conocidas: Record<string, string>,
): string | null {
  const texto = crudo.trim();
  const interpolacion = /^\{\s*([A-Za-z_$][\w$]*)\s*\}/.exec(texto);
  if (interpolacion) {
    const valor = conocidas[interpolacion[1]];
    if (valor === undefined) return null;
    return primeraLetraVisible(valor, conocidas);
  }
  // Cualquier otra expresión (llamada, ternario, template) tampoco se adivina.
  if (texto.startsWith("{")) return null;
  const letra = texto.match(/\p{L}/u);
  return letra ? letra[0] : null;
}

const arrancaEnMayuscula = (letra: string) => letra === letra.toLocaleUpperCase("es");

describe("un título de venta no arranca en minúscula", () => {
  const fuente = readFileSync(PAGE, "utf8");
  const titulos = titulosDe(fuente);

  it("la home tiene títulos para medir", () => {
    // Sin esto, el verde de abajo sobre cero títulos sería falla abierta.
    expect(titulos.length).toBeGreaterThanOrEqual(8);
  });

  it("cada h1/h2 de la home empieza con mayúscula", () => {
    const enMinuscula = titulos
      .map((t) => ({ ...t, letra: primeraLetraVisible(t.crudo, INTERPOLACIONES_CONOCIDAS) }))
      .filter((t) => t.letra === null || !arrancaEnMayuscula(t.letra))
      .map((t) => `<${t.etiqueta}> ${t.crudo.trim().slice(0, 60).replace(/\s+/g, " ")}`);

    expect(enMinuscula).toEqual([]);
  });
});

describe("el verbo del alta en tono de título", () => {
  it("es el mismo verbo, con la primera letra en mayúscula", () => {
    expect(ALTA_VERBO_VOS_TITULO.toLocaleLowerCase("es")).toBe(
      ALTA_VERBO_VOS.toLocaleLowerCase("es"),
    );
    expect(ALTA_VERBO_VOS_TITULO[0]).toBe(ALTA_VERBO_VOS[0].toLocaleUpperCase("es"));
  });

  it("la mayúscula se deriva, así también sirve si mañana cambia el verbo", () => {
    // El verbo de la rama apagada NO se tipea acá a propósito: `alta.test.ts`
    // prohíbe su vocabulario en toda superficie, y con razón — un literal de la
    // rama que no corre es una promesa vieja esperando a que alguien la lea.
    // Lo que se prueba es la PROPIEDAD, con un verbo cualquiera acentuado.
    const cualquierVerbo = "ábrís tu prueba";
    const enTitulo =
      cualquierVerbo[0].toLocaleUpperCase("es") + cualquierVerbo.slice(1);

    expect(primeraLetraVisible(cualquierVerbo, {})).toBe("á");
    expect(arrancaEnMayuscula("á")).toBe(false);
    expect(arrancaEnMayuscula(primeraLetraVisible(enTitulo, {})!)).toBe(true);
  });
});
