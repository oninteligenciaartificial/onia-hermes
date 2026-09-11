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
