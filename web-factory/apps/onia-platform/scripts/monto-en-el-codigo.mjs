/**
 * Decidir si un monto que produccion pinta como precio lo ESCRIBE el codigo de esta
 * rama — la mitad del diagnostico que decide donde se arregla.
 *
 * POR QUE EXISTE, con el caso que lo originó. `precios-vivos.mjs` separa dos causas
 * opuestas del mismo rojo: el numero esta en el codigo (defecto nuestro, se arregla
 * aca, sale 1) o no esta (produccion corre un build viejo, falta DESPLEGAR, sale 3).
 * Hasta el 2026-09-12 esa pregunta se contestaba buscando el NUMERO DESNUDO en los
 * `.ts`/`.tsx`, y por eso contestaba mal: medido contra produccion ese dia, `Bs 1.500`
 * —un precio de la escalera vieja, que solo el deploy pendiente cura— se reportaba
 * como «Escrito a mano en: src/app/v1/empezar/data.ts, src/lib/pricing.ts,
 * src/motion/agent-scene.tsx → el defecto es del CODIGO, arreglarlo aca». Los tres
 * eran falsos:
 *
 *     `hasta 1.500 fichas`                        ← un TOPE del plan, no un precio
 *     `"Topes: 1.500 fichas · 5 usuarios"`        ← idem
 *     `STEP_HOLD_MS = [900, 1500, 1600, ...]`     ← milisegundos de una animacion
 *
 * Obedecer ese diagnostico es caro en las dos direcciones: bajar el tope de 1.500 a
 * 1.290 fichas le RECORTA al cliente algo que su plan si incluye, y tocar el
 * `STEP_HOLD_MS` rompe una animacion. Y ademas rompia el veredicto: `precios-vivos`
 * apaga `soloFaltaDesplegar` con una sola coincidencia, asi que mientras exista un
 * numero que coincida con un tope o un milisegundo, el exit 3 —«ya esta arreglado,
 * esperá el deploy», que era el caso vivo— es INALCANZABLE.
 *
 * COMO LO CONTESTA. Con la MISMA pregunta que el medidor le hace a la pantalla:
 * ¿esta escrito como plata? `montosVisibles` es la fuente unica de esa nocion y se
 * importa, no se reimplementa — reconoce las dos direcciones (`Bs 1.500` y `1.500 Bs`)
 * y admite salto de linea entre el numero y la moneda. Un numero sin moneda pegada no
 * es un precio, sea un tope, un milisegundo o un indice.
 *
 * QUE NO SE PIERDE. La ocurrencia sin moneda se sigue NOMBRANDO (`'numero'`), no se
 * borra: si la clasificacion se equivoco, se ve en la misma corrida en vez de
 * desaparecer en verde.
 *
 * Vive en su propio modulo por el mismo motivo que `montos-en-pantalla.mjs`: el
 * medidor corre su barrido en el top-level, asi que importarlo para probar esta
 * funcion dispararia 24 pantallas contra produccion y un `process.exit()`. Aca no hay
 * efectos, y el test esta al lado.
 */
import { montosVisibles } from './montos-en-pantalla.mjs';

/**
 * Los comentarios se BLANQUEAN, no se borran: un numero citado en un comentario que
 * NARRA el bug viejo (y hay varios en `src/lib/pricing.ts`) no es un precio publicado,
 * pero conservar los saltos de linea deja que el que lea el informe cuente renglones.
 */
export function sinComentarios(texto) {
  return texto
    .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '))
    .replace(/^\s*\/\/.*$/gm, (c) => c.replace(/[^\n]/g, ' '));
}

/** El numero suelto, con limites de digito: `790` no matchea dentro de `7.900`. */
function reNumeroDesnudo(monto) {
  return [String(monto), monto.toLocaleString('es-BO')].map(
    (f) => new RegExp(`(?<![\\d.])${f.replace('.', '\\.')}(?![\\d.])`),
  );
}

/**
 * Como aparece `monto` en el texto de UN archivo de codigo.
 *
 * @returns {'precio'|'numero'|'no'} `'precio'` = escrito como plata (defecto del
 *   codigo) · `'numero'` = el numero esta, pero no como plata (un tope, un
 *   milisegundo: se nombra, no acusa) · `'no'` = no esta.
 */
export function comoAparece(texto, monto) {
  const limpio = sinComentarios(texto);
  if (montosVisibles(limpio).todos.has(monto)) return 'precio';
  return reNumeroDesnudo(monto).some((f) => f.test(limpio)) ? 'numero' : 'no';
}
