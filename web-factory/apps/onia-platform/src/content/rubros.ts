/**
 * Los rubros que el alta entrega hoy, con la forma en que el sitio los nombra.
 *
 * POR QUÉ VIVE ACÁ Y NO ADENTRO DEL COMPONENTE — medido el 2026-09-11.
 *
 * El encabezado de la sección de módulos de la portada enumeraba **cuatro**
 * rubros ("Módulos para clínicas, comercios, importadoras y profesionales")
 * mientras la banda de dos centímetros más abajo listaba **cinco**. El que
 * faltaba era Estética, un rubro vivo que el alta entrega: el dueño de un
 * centro de estética leía el título de la sección que le tenía que vender los
 * módulos y concluía que Onia no era para él, con su propio chip encendido al
 * lado. No sobra ninguna palabra — FALTA una, y esa es la dirección que casi
 * ningún instrumento mira.
 *
 * **Ningún gate del carril podía verlo, y por eso es una clase y no un typo:**
 *
 * - El barrido de obra y el de autobombo son listas de INCLUSIÓN de literales
 *   prohibidos. Acá no sobra ningún literal.
 * - No hay precio fuera de fuente ni enlace roto: los otros dos números del
 *   objetivo miran para otro lado.
 * - `scripts/rubros-vivos.mjs` existe EXACTAMENTE para cruzar los rubros que el
 *   sitio vende contra los que el alta entrega, y daba VERDE con razón: su
 *   sujeto es la LISTA declarada (el conmutador de la portada, `switcher.tsx`),
 *   y el defecto vivía en la PROSA que enumera el mismo hecho. Un hecho con dos
 *   representaciones, y sólo una con dueño.
 * - Las otras CUATRO superficies del sitio que enumeran rubros (la FAQ, los dos
 *   textos de `how-it-works` y `/nosotros`) estaban completas y decían "cinco".
 *   Ver una hermana sana hace dar la familia por cubierta: es el mismo motivo
 *   por el que este defecto sobrevivió a las pasadas anteriores.
 *
 * `plural` es OBLIGATORIO a propósito: es lo que hace que un rubro nuevo nazca
 * nombrado en el encabezado en vez de quedarse afuera en silencio. Mismo motivo
 * por el que es obligatorio en `RUBROS_ACTIVOS` del producto, donde el pie del
 * panel de auth ya se había quedado corto de la misma forma.
 *
 * Lo vigila `app/rubros-en-la-prosa.test.ts`, que mira las dos representaciones:
 * el VALOR que sale de acá y la PROSA de todo el sitio.
 */
export interface RubroVivo {
  /** Como lo publica la banda "Andando hoy" y el conmutador de la portada. */
  readonly chip: string;
  /** Como lo nombra una frase que enumera a quién le sirve Onia. */
  readonly plural: string;
}

export const RUBROS_VIVOS: readonly RubroVivo[] = [
  { chip: "Dental", plural: "clínicas dentales" },
  { chip: "Comercio", plural: "comercios" },
  { chip: "Importadora", plural: "importadoras" },
  { chip: "Estética", plural: "estéticas" },
  { chip: "Servicios", plural: "servicios profesionales" },
] as const;

/**
 * "a, b, c y d" — la enumeración CERRADA de rubros, derivada.
 *
 * Cerrada quiere decir que afirma cobertura: quien la lee entiende que esos son
 * TODOS. Por eso no puede tipearse a mano, y por eso una lista abierta ("dental,
 * comercio, importadora y más") es legítima y no pasa por acá.
 */
export const RUBROS_EN_PROSA: string = (() => {
  const plurales = RUBROS_VIVOS.map((rubro) => rubro.plural);
  return `${plurales.slice(0, -1).join(", ")} y ${plurales[plurales.length - 1]}`;
})();

/**
 * "cinco" — CUÁNTOS son, en palabras y derivado.
 *
 * POR QUÉ HACE FALTA UNA TERCERA CONSTANTE — medido el 2026-09-18.
 *
 * El mismo hecho vive en el sitio en TRES representaciones, y hasta hoy sólo
 * dos tenían dueño: el `chip` de cada rubro, la enumeración de `plural` que
 * arma `RUBROS_EN_PROSA`… y el CARDINAL, que estaba tipeado en seis textos de
 * venta — la FAQ de la home (que además viaja al JSON-LD que lee Google), la
 * FAQ de la landing v1, `/rubros`, `/nosotros`, el `alt` de `how-it-works` y
 * el cuadro comparativo de `proof.ts`.
 *
 * El día que entre el sexto rubro, las dos primeras representaciones se
 * corrigen SOLAS y el gate de enumeración se pone rojo si alguna se queda
 * corta; las seis frases que dicen "cinco rubros" siguen diciéndolo, ciertas
 * ayer y falsas hoy, **sin que nada se ponga rojo**. Es exactamente lo que
 * costó "en los TRES planes" cuando entró el Crece (escalera C, 2026-09-12):
 * quedó vivo en la portada, en /precios y en el JSON-LD de la FAQ, y ningún
 * cruce de precios lo vio porque una cantidad escrita en palabras no es un
 * monto.
 *
 * Y no es hipotético: este repo ya registra DOS instancias arregladas a mano
 * —la portada enumeraba cuatro con cinco vivos (2026-09-11, arriba), y
 * `v1/empezar/resultado.tsx` decía "para seis rubros" cuando el sitio vendía
 * cinco—. Dos instancias curadas de a una es la firma de una clase abierta.
 *
 * Va en PALABRAS porque así lo escribe la prosa de venta ("Cinco rubros vivos
 * y vendibles hoy"), no en dígito. Si algún día hay más rubros que nombres en
 * la tabla, es preferible el dígito a una frase muda: por eso el fallback.
 */
const CARDINALES = ["cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho"];

/**
 * Se exporta la FUNCIÓN, no sólo el valor de hoy, y ése es el punto.
 *
 * Su caso interesante es INALCANZABLE desde la tabla: mientras haya cinco
 * rubros, un `CUANTOS_RUBROS` clavado a mano en `"cinco"` es indistinguible del
 * derivado — coinciden, y coincidirían para siempre. Un gate que comparara los
 * dos valores sería una tautología con cara de ancla (se midió: la mutación que
 * clava el literal pasaba VERDE). Con la función aparte, el gate puede
 * preguntarle por los cardinales que la tabla todavía no produce —`cardinalDe(6)`
 * el día que entre el sexto rubro— y además exigir, leyendo este archivo, que la
 * constante se DERIVE en vez de asignarse un literal.
 */
export function cardinalDe(cantidad: number): string {
  return CARDINALES[cantidad] ?? String(cantidad);
}

export const CUANTOS_RUBROS: string = cardinalDe(RUBROS_VIVOS.length);

/** "Cinco" — el mismo cardinal cuando abre una oración. */
export const CUANTOS_RUBROS_CAPITAL: string =
  CUANTOS_RUBROS.charAt(0).toUpperCase() + CUANTOS_RUBROS.slice(1);
