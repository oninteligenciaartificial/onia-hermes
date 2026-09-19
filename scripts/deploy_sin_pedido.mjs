#!/usr/bin/env node
/**
 * deploy_sin_pedido.mjs — trabajo varado para un destino y NINGÚN pedido vivo que lo cubra.
 *
 *   node scripts/deploy_sin_pedido.mjs              # medición viva (0 cubierto · 1 descubierto · 2 no medido)
 *   node scripts/deploy_sin_pedido.mjs --self-check # casos puros, sin red ni tablero
 *
 * ─────────────────────────────────────────────────────────────────────────────────────
 * NACE DEL 2026-09-07, y de que nada se puso rojo.
 *
 * `onia.com.bo` llevaba horas sirviendo un build viejo con TRES arreglos detrás, y uno de
 * ellos era de venta: la portada y `/v1` ofrecían «agentes que revisan tu negocio cada día»
 * pegado a «Desde Bs 320 al mes», y los agentes recién vienen desde Pro (Bs 750). No existía
 * ni un pedido de deploy de `landing` en el tablero — el último había quedado en `done`. Se
 * encontró contando los pedidos A MANO en una vuelta del integrador; si esa vuelta no se
 * hacía, el arreglo seguía sin llegar al cliente y ningún instrumento lo decía.
 *
 * POR QUÉ NO LO VE NINGUNO DE LOS QUE YA EXISTEN, que es lo que lo hace caro:
 *
 *   - `deploy-vivo.mjs` (web-venta) cuenta lo que falta publicar y lo imprime. Nunca
 *     pregunta si alguien lo PIDIÓ: su salida es la misma con pedido y sin pedido.
 *   - `pedido_deploy_entregado.mjs` mide los pedidos que EXISTEN y ya se publicaron
 *     («dice pendiente sobre lo resuelto»). Un destino sin ninguna tarea no tiene sujeto
 *     ahí: no hay pedido que clasificar, así que sale del barrido sin decir nada.
 *   - Los publicadores en seco dicen «hay que publicar: N arreglo(s)» y nadie los corre
 *     salvo cuando ya se sospecha.
 *
 * Es el hueco ENTRE dos gates que tienen razón por separado: uno mira el trabajo sin el
 * pedido, el otro el pedido sin el trabajo. La firma es la tercera de la familia —ni «dice
 * resuelto sobre lo pendiente» ni «dice pendiente sobre lo resuelto», sino **no dice nada
 * sobre lo pendiente**— y es la única que no deja rastro en el tablero.
 *
 * ─────────────────────────────────────────────────────────────────────────────────────
 * QUÉ MIDE. Para cada destino de la lista blanca (`DESTINOS` de `publicar-aprobado.mjs`, que
 * es de donde salen y adonde van los `ok` de Sergio Urcullo): ¿hay trabajo sin publicar? y
 * ¿hay un pedido vivo con `DESPLEGAR: <ese destino>`?
 *
 *   trabajo > 0 y sin pedido            → DESCUBIERTO. Es el ítem: hay que abrir el pedido.
 *   trabajo > 0 y con pedido de hoy     → cubierto.
 *   trabajo > 0 y con pedido de +24 h   → CUBIERTO_VIEJO. No falta un pedido: falta el `ok`.
 *   trabajo > 0 y con pedido que DESCRIBE MENOS → CUBIERTO_CORTO. Ver la quinta pregunta.
 *   trabajo 0                           → cubierto (no hay nada que pedir).
 *
 * ─────────────────────────────────────────────────────────────────────────────────────
 * LA TERCERA PREGUNTA, Y POR QUÉ NO ESTABA — medido el 2026-09-12 20:44 La Paz.
 *
 * Este gate nació cuando publicar era SIEMPRE un acto humano. Desde entonces el VPS tiene
 * `/root/bin/onia-publicar-solo.sh` (un cron cada 3 horas), que publica solo lo que NO toca una
 * fuente de precio. Esa tarde el integrador mergeó 5 archivos del bot y esto dijo
 * «DESCUBIERTO bot», o sea: abrile un pedido y que Sergio Urcullo apriete un `ok`. Seis
 * minutos después el cron lo publicaba solo — el pedido habría nacido cumplido, que es el
 * modo de falla que ya está medido y que hace que los avisos dejen de creerse.
 *
 * Así que con trabajo pendiente y sin pedido hay que preguntar una tercera cosa: **¿lo va a
 * publicar solo?**. Y se le pregunta AL MISMO publicador automático (su `--dry-run` ya
 * imprime su veredicto por destino), nunca reimplementando su `FIRMA_HUMANA`: dos
 * derivaciones de «esto necesita firma» se contradicen el día que una cambia, que es lo que
 * su propio guion se escribió para evitar.
 *
 * ⚠️ Y que el guion EXISTA no prueba que el cron lo corra. Un interruptor que vive fuera de
 * git y nadie mira es exactamente como esto fallaría en verde para siempre: absolviendo
 * arreglos varados porque «se publican solos» mientras el cron está muerto. Por eso la
 * absolución se condiciona a una corrida reciente en su log (cadencia 3 h, margen 4 h);
 * sin log fresco no absuelve a nadie.
 *
 * EL UNIVERSO SE DERIVA, LA MEDICIÓN NO SE PUEDE DERIVAR. Los destinos salen de la lista
 * blanca, así que uno nuevo nace vigilado. Pero *cómo* se le pregunta «¿te falta publicar?»
 * es distinto en cada uno (la plataforma nombra su sha, la landing no, el bot se despliega
 * por copia), y esa parte es un mapa escrito a mano. Por eso un destino SIN detector sale
 * NO_MEDIDO **y con su nombre**: es la única forma de que la lista escrita a mano no se
 * vuelva una lista de inclusión que falla abierto un nivel más arriba.
 *
 * ─────────────────────────────────────────────────────────────────────────────────────
 * LA QUINTA PREGUNTA, del 2026-09-18: **¿el pedido DESCRIBE lo que hoy publicaría?**
 *
 * Las cuatro anteriores absuelven a un destino por la EXISTENCIA de un pedido vivo, y el que
 * los deja cortos es este mismo carril: el integrador mergea DESPUÉS de que el pedido existe,
 * que es el caso normal y no el excepcional. Medido en vivo ese día: con `t_5053480f` (landing)
 * abierto con seis arreglos, integré tres carriles y `e9dca736` —los coadministradores por
 * plan— entró al universo que su `ok` publica sin estar en el cuerpo. Los dos gates hermanos,
 * corridos seguidos, se contradecían:
 *
 *     node scripts/deploy_sin_pedido.mjs   → OK landing: falta publicar y ya hay pedido
 *     npm run pedido:entregado             → ROJO: su ok publica 1 arreglo que el pedido NO nombra
 *
 * **El cuerpo es lo único que Sergio Urcullo lee**, así que ese botón le hace aprobar un
 * cambio que nadie le mostró. La quinta pregunta la contestaba sólo el hermano, que es un
 * alias suelto: si una vuelta del integrador mergea y no lo corre, el pedido queda corto EN
 * VERDE — la misma firma de siempre, «verde mientras el trabajo no llega bien».
 *
 * CÓMO SE CONTESTA SIN PAGAR EL CAMINO CARO. `publicaria` —el universo de arreglos que el `ok`
 * mandaría— sólo lo sabe derivar el hermano, con su maquinaria de SSH + git. No hace falta: el
 * método vigente ya obliga a que el cuerpo **cite textual** el recuento del publicador en seco
 * (`hay que publicar: N arreglo(s)`), y ese mismo seco es el que este gate YA corrió para
 * contestar la primera pregunta. O sea que la quinta son dos números leídos de dos artefactos
 * DISTINTOS —el cuerpo que escribió el que abrió el pedido, y la salida viva de hoy— con cero
 * SSH extra. `seco > citado` ⇒ `CUBIERTO_CORTO`.
 *
 * DIRECCIÓN DEL ERROR, y es asimétrica a propósito: `seco < citado` NO se acusa (ésa es la
 * otra familia, `cuerpoVencido`, y tiene dueño en el hermano), y un cuerpo sin recuento legible
 * sale `null` con su causa, nunca rojo. Acusar de más hace rehacer un pedido sano, que es el
 * daño caro de este control.
 *
 * ⚠️ Igual que `CUBIERTO_VIEJO`, **no cambia el código de salida**. Sólo Sergio Urcullo destraba
 * un pedido, y este gate está en la cadena `npm test` que el integrador corre antes de CADA
 * merge: un rojo acá trabaría el merge de todos los carriles hasta que él apriete un botón, y
 * la cura sería saltearse el gate — que es como esta familia se muere.
 *
 * FALLA CONSERVADOR HACIA «NO MEDIDO», y la dirección importa por un motivo que ya está
 * medido: un barrido incompleto del tablero se ve IDÉNTICO a un tablero sin pedidos, y de
 * ahí sale la conclusión cara —«este destino no tiene pedido»— que hace abrir un pedido
 * DUPLICADO. Ese duplicado es el ruido que hace que Sergio Urcullo deje de creerle a los
 * avisos. Así que si alguna tarea abierta no contesta el `show`, esto no concluye nada.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

import { DESTINOS } from './kanban/publicar-aprobado.mjs';
import { barrerTablero, barrerTableroJson, partirPedido } from './pedido_deploy_entregado.mjs';

const TABLERO = '/root/bin/onia-tablero.sh';
/** El nodo de casa no tiene `/opt`, pero sí llega al VPS por SSH. Ver `pendienteEnVivo`. */
const VPS = '/root/bin/onia-vps.sh';
/** El cron que publica solo lo que no toca una fuente de precio. Ver la cabecera. */
const PUBLICADOR_SOLO = '/root/bin/onia-publicar-solo.sh';
const LOG_SOLO = '/var/log/onia-publicar-solo.log';
/** Su cadencia es de 3 h (cron `50` cada 3 horas). Con margen: más de 4 h sin correr es que no está corriendo. */
const HORAS_SIN_CORRER = 4;
/** La Paz no tiene horario de verano, así que el desfase es fijo. */
const LA_PAZ_UTC = -4;

// ── núcleo puro ────────────────────────────────────────────────────────────────────────

/**
 * A partir de cuántas horas un pedido de deploy vivo deja de ser «recién pedido» y pasa a
 * ser trabajo varado. 24 h, por dos motivos medidos y no por gusto: el mismo umbral con el
 * que este carril juzga una rama sin mergear, y Sergio Urcullo mira los bloqueos del tablero
 * a lo sumo una vez por día. Debajo de eso, avisar es apurarlo; encima, el silencio es lo
 * que dejó al bot cuatro días sin publicar.
 */
export const HORAS_PARA_ENVEJECER = 24;

/**
 * PURA: cuántas horas lleva esperando el pedido MÁS VIEJO de los que cubren un destino, o
 * `null` si ninguno trae fecha legible.
 *
 * Un pedido sin fecha no cuenta como 0: eso lo declararía recién abierto y lo absolvería
 * para siempre, que es justo la dirección que este gate no puede permitirse.
 */
export function esperaDelMasViejo(pedidos, ahora) {
  const fechas = (pedidos || [])
    .map((p) => p?.creado)
    .filter((c) => typeof c === 'number' && Number.isFinite(c));
  if (fechas.length === 0) return null;
  return Math.floor((ahora - Math.min(...fechas) * 1000) / 3_600_000);
}

/**
 * PURA: el recuento de arreglos que un texto declara con la marca del publicador en seco
 * (`hay que publicar: N arreglo(s)`), o `null` si no trae ninguna.
 *
 * Sirve para los DOS lados de la quinta pregunta y a propósito: el método vigente obliga a que
 * el cuerpo del pedido CITE textual esa línea, así que el mismo formato se lee del cuerpo y de
 * la salida viva. No es una tautología —son dos artefactos distintos, uno escrito cuando se
 * abrió el pedido y otro medido hoy—; lo que sería tautológico es derivar los dos del seco.
 *
 * Con VARIAS apariciones devuelve la MAYOR, que es la dirección que no acusa de más: un cuerpo
 * que cita su recuento y además menciona otro número (el de un destino hermano, el de una
 * corrida anterior) no puede hacer que este gate mande a rehacer un pedido sano.
 */
export function recuentoDeArreglos(texto) {
  const hallados = [...String(texto ?? '').matchAll(/hay que publicar:\s*(\d+)\s*arreglo/gi)]
    .map((m) => Number(m[1]))
    .filter((n) => Number.isFinite(n));
  return hallados.length === 0 ? null : Math.max(...hallados);
}

/**
 * PURA: ¿el CUERPO de un pedido describe al menos tantos arreglos como los que su `ok`
 * publicaría hoy? `null` = no se puede juzgar.
 *
 * ⚠️ El cuerpo, no el texto entero. Es la misma razón por la que existe `cuerpoCorto` en el
 * hermano: los comentarios se apilan abajo y tapan al cuerpo, así que un recuento comentado
 * dejaría satisfecha la pregunta mientras Sergio Urcullo sigue leyendo un cuerpo corto. Y
 * `partirPedido` se IMPORTA, no se copia: dos versiones del mismo corte divergen.
 *
 * @param {{texto:string, seco:number|null}} args  `seco` es el recuento que el publicador
 *   imprime HOY; sin él no hay con qué comparar y sale `null`.
 */
export function cuerpoDescribeElRecuento({ texto, seco }) {
  if (!Number.isFinite(seco)) return null;
  const citado = recuentoDeArreglos(partirPedido(texto).cuerpo);
  if (citado === null) return null;
  // `>=` y no `===`: que el cuerpo describa de MÁS es la otra familia (`cuerpoVencido`, con
  // dueño en el hermano), y acusarla desde acá haría rehacer pedidos por el lado barato.
  return citado >= seco;
}

/**
 * PURA: el veredicto de la quinta pregunta para UN destino, agregando sus pedidos vivos.
 *
 * Basta que UNO esté corto para que el destino salga corto, y no es pesimismo: el botón que
 * Sergio Urcullo aprieta puede ser justo ése, y su `ok` publica el universo entero igual.
 * Todos ilegibles ⇒ `null`; ninguno corto y al menos uno legible ⇒ `true`.
 */
export function pedidosQueDescribenDeMenos(pedidosDelDestino, seco) {
  const cortos = [];
  let algunoLegible = false;
  for (const p of pedidosDelDestino || []) {
    const v = cuerpoDescribeElRecuento({ texto: p?.texto, seco });
    if (v === null) continue;
    algunoLegible = true;
    if (v === false) cortos.push(p.id);
  }
  if (!algunoLegible) return null;
  return cortos;
}

/**
 * PURA: el veredicto por destino.
 *
 * @param destinos  nombres de la lista blanca (`Object.keys(DESTINOS)`).
 * @param pendiente `(destino) => true | false | null` — null es «no se sabe».
 * @param pedidos   los del barrido del tablero: `[{ id, destino, creado }]`.
 * @param ahora     epoch en ms; con él se decide si un pedido vivo ya ENVEJECIÓ.
 *
 * ⚠️ El sujeto son los DESTINOS, no los pedidos. Recorrer los pedidos —que es lo natural
 * cuando ya tenés el barrido en la mano— hace que un destino sin ninguna tarea no tenga
 * fila, y ése es exactamente el caso que este gate existe para cazar: el que no deja rastro.
 *
 * ⚠️ LA CUARTA PREGUNTA, del 2026-09-17: **¿hace cuánto que está pedido?**. `CUBIERTO`
 * absolvía a un destino por el solo hecho de que existiera un pedido, sin mirar su edad, y
 * eso es exactamente lo que este gate dijo durante los CUATRO días que el bot estuvo sin
 * publicar 17 archivos de arreglos (su publicador decía `FALLO` ocho veces por día en un log
 * que no escala a nadie). El veredicto era cierto —había pedido— y aun así el cliente no
 * recibía nada: la firma de la familia es «verde mientras el trabajo no llega».
 */
export function clasificarCobertura({ destinos, pendiente, pedidos, seAutoPublica, describeLoQuePublica, ahora }) {
  // EXIGIDA, no opcional con default: un llamador que se olvide de la tercera pregunta
  // volvería a mandar a abrir pedidos que el cron cumple solo, y lo haría en silencio.
  if (typeof seAutoPublica !== 'function') {
    throw new TypeError('clasificarCobertura necesita seAutoPublica(destino) → true | false | null');
  }
  // EXIGIDA por el mismo motivo, y es la quinta pregunta: con un default (`() => null`) un
  // llamador que la olvide absolvería a todo pedido corto sin que nada se pusiera rojo, que
  // es exactamente el agujero que esto vino a cerrar. Que no compile es el punto.
  if (typeof describeLoQuePublica !== 'function') {
    throw new TypeError('clasificarCobertura necesita describeLoQuePublica(destino, pedidos) → string[] | null');
  }
  // EXIGIDA por el mismo motivo, y con un default sería peor todavía: `Date.now()` adentro
  // vuelve la función impura y sus casos irrepetibles, y un llamador que se olvide del reloj
  // dejaría de preguntar por la CUARTA pregunta sin que nada se pusiera rojo.
  if (!Number.isFinite(ahora)) {
    throw new TypeError('clasificarCobertura necesita ahora (epoch ms) para saber si un pedido envejecio');
  }
  const filas = [];
  for (const destino of destinos) {
    const delDestino = (pedidos || []).filter((p) => p.destino === destino);
    const cubiertoPor = delDestino.map((p) => p.id);
    const p = pendiente(destino);
    if (p === null || p === undefined) {
      // `fuente` dice QUIÉN no contestó, para que el que imprime pueda buscar la causa sin
      // adivinarla del texto del motivo: los dos NO_MEDIDO vienen de instrumentos distintos.
      filas.push({ destino, estado: 'NO_MEDIDO', fuente: 'detector', motivo: 'no pude preguntarle si le falta publicar', pedidos: cubiertoPor });
      continue;
    }
    if (p === false) {
      filas.push({ destino, estado: 'AL_DIA', pedidos: cubiertoPor });
      continue;
    }
    if (cubiertoPor.length > 0) {
      // El pedido MÁS VIEJO, no el último: lo que se mide es hace cuánto que el arreglo no
      // le llega al cliente, y eso arranca con el primer pedido que lo pidió. Abrir uno
      // nuevo para el mismo destino no rejuvenece el trabajo varado.
      const esperaH = esperaDelMasViejo(delDestino, ahora);
      const viejo = esperaH !== null && esperaH >= HORAS_PARA_ENVEJECER;
      // LA QUINTA PREGUNTA. `null` = no se pudo juzgar; `[]` = el cuerpo alcanza; con ids,
      // esos pedidos describen menos de lo que su `ok` publica.
      const cortos = describeLoQuePublica(destino, delDestino);
      // El corto GANA al viejo, y no es arbitrario: su remedio —rehacer el pedido con el
      // cuerpo derivado y archivar el viejo— cura las dos cosas a la vez (el pedido nuevo
      // nace con la edad en cero), mientras que el remedio del viejo —esperar el `ok`— deja
      // el cuerpo corto intacto. Imprimir primero el que NO limpia al otro haría gastar la
      // vuelta siguiente, que es como esta cadena de controles ya falló una vez.
      const corto = Array.isArray(cortos) && cortos.length > 0;
      // LA SEXTA PREGUNTA, del 2026-09-19: ¿este pedido SOBRA? Hasta hoy la cadena cortaba
      // acá y no llegaba a preguntarlo: `seAutoPublica` vivía sólo en la rama SIN pedido, o
      // sea que un destino cubierto jamás se preguntaba si el cron lo publica solo igual.
      // Medido ese día: `t_bec84ac0` llevaba 2 h pidiéndole un `ok` a Sergio Urcullo por una
      // landing que el publicador automático ya sacaba solo (el freno de precio que la
      // detenía se había arreglado hacía una hora), y este gate imprimía «falta publicar y
      // ya hay pedido» — cierto, y por eso nadie lo miraba. Peor: el gate hermano
      // (`pedido:entregado`) lo veía CORTO y mandaba a REHACERLO, o sea a fabricar un pedido
      // más prolijo para una pregunta que no hay que hacer.
      //
      // Gana a `corto` y a `viejo` por el mismo criterio que ya decide entre esos dos: se
      // imprime el remedio que limpia a los otros. Archivar el pedido cura las tres cosas;
      // rehacerlo deja uno nuevo que también sobra, y esperar el `ok` espera algo que no
      // hace falta.
      //
      // `null` (no se pudo medir) NO absuelve: se cae a la clasificación de siempre. El
      // daño no es simétrico — mantener un pedido que sobraba cuesta un `ok` de más;
      // archivar uno que hacía falta deja el arreglo sin llegar al cliente y sin nadie
      // mirando.
      const sobra = seAutoPublica(destino) === true;
      filas.push({
        destino,
        estado: sobra ? 'CUBIERTO_SOBRA' : corto ? 'CUBIERTO_CORTO' : viejo ? 'CUBIERTO_VIEJO' : 'CUBIERTO',
        pedidos: cubiertoPor,
        esperaH,
        // Tri-estado explícito para el que imprime: sin esto, «no pude juzgarlo» y «lo juzgué
        // y está bien» salen iguales, que es la distinción que sostiene todo este archivo.
        cortos: Array.isArray(cortos) ? cortos : null,
      });
      continue;
    }
    // Falta publicar y nadie lo pidió. Antes de mandar a molestar a Sergio Urcullo:
    // ¿no lo publica solo el cron?
    const solo = seAutoPublica(destino);
    if (solo === true) {
      filas.push({ destino, estado: 'SE_PUBLICA_SOLO', pedidos: [] });
      continue;
    }
    if (solo === null || solo === undefined) {
      filas.push({
        destino,
        estado: 'NO_MEDIDO',
        fuente: 'publicador',
        // NO dice «no pude preguntarle»: de los cuatro caminos hasta acá, TRES sí le
        // preguntaron y les contestó. Cuál fue lo dice la línea `causa:`, no el motivo.
        motivo: 'le falta publicar y el publicador automatico no dejo un veredicto que sirva',
        pedidos: [],
      });
      continue;
    }
    filas.push({ destino, estado: 'DESCUBIERTO', pedidos: [] });
  }
  return filas;
}

/**
 * PURA: los veredictos del publicador automático, uno por destino, leídos de su salida.
 * `null` si no dijo ni uno (no llegó a medir, otra corrida tenía el candado, no existe).
 *
 * Sus formas, tal cual las imprime `publicar_destino`: `al dia`, `publicaria (…)` (modo
 * seco), `PUBLICADO`, `FALLO`, y las que piden firma, que desde el 2026-09-18 son DOS
 * —`NO publico solo — cambia un monto` y `NO publico solo — toca una fuente de precio y no
 * pude medir si cambia`—. Por eso lo que se ancla es el PREFIJO (`NO publico solo`) y no la
 * frase entera: el motivo se afina cada vez que el freno aprende a distinguir mejor, y un
 * lector atado al texto completo se queda mudo justo el día que eso pasa.
 */
export function leerPublicadorSolo(salida) {
  const verdictos = {};
  for (const linea of String(salida ?? '').split('\n')) {
    const m = linea.match(/^\s*([a-z][a-z0-9_-]*):\s*(\S.*?)\s*$/i);
    if (!m) continue;
    const [, destino, dice] = m;
    // ⚠️ «NO publico solo» tiene DOS causas y el remedio de cada una es el OPUESTO: si un
    // monto cambió de verdad, la firma de Sergio Urcullo es el camino correcto; si el freno
    // NO PUDO MEDIR, pedirle la firma es gastarla en una falla de instrumento. El freno las
    // escribe distinto a propósito (`publicar-solo.sh`: «cambia un numero…» contra «…y no
    // pude medir si cambia»), así que se leen separadas y no se aplanan acá.
    if (/^NO\s+publico\s+solo/i.test(dice)) {
      verdictos[destino] = /no\s+pude\s+(medir|comprobar)/i.test(dice) ? 'FRENO_SIN_MEDIR' : 'NECESITA_FIRMA';
    }
    else if (/^publicaria\b/i.test(dice)) verdictos[destino] = 'SE_PUBLICA_SOLO';
    else if (/^PUBLICADO\b/.test(dice)) verdictos[destino] = 'SE_PUBLICA_SOLO';
    else if (/^FALLO\b/.test(dice)) verdictos[destino] = 'FALLO';
    else if (/^al\s+dia\b/i.test(dice)) verdictos[destino] = 'AL_DIA';
  }
  return Object.keys(verdictos).length > 0 ? verdictos : null;
}

/**
 * PURA: `true` si el publicador automático se encarga de ese destino, `false` si no lo hará
 * (no lo cubre, necesita firma, o su última corrida falló), `null` si no se sabe.
 *
 * ⚠️ Un destino AUSENTE de sus veredictos es `false`, no `null`: el emisor SIAT no es uno de
 * sus destinos, y «no aparece» es una respuesta, no una falta de respuesta. El `null` queda
 * para el desacuerdo —él dice «al dia» y nuestro detector dice que falta—, porque ahí los
 * dos instrumentos no pueden tener razón y absolver sería creerle al que no mide el sujeto.
 */
/**
 * PURA: por qué no se pudo preguntar, en UNA línea. `null` si no hay nada que decir.
 *
 * NACE DEL 2026-09-13 04:50 UTC, y de que el `null` no sabía explicarse. Esa vuelta el
 * integrador mergeó 8 commits del carril del chatbot y esto contestó «NO MEDIDO bot: no
 * pude preguntarle si le falta publicar». Dos corridas después el mismo comando contestó
 * perfecto, y seis corridas sueltas del detector dieron 6/6 iguales: el fallo no se pudo
 * reproducir NUNCA, porque `sh()` mandaba la stderr a `'ignore'` y la única evidencia se
 * tiraba a la basura en el mismo `catch` que devolvía el `null`.
 *
 * Y la dirección del daño no es simétrica. `NO_MEDIDO` es el veredicto que este gate usa
 * para NO molestar a Sergio Urcullo, así que un destino que falla al azar y no sabe decir
 * por qué **se calla un pedido de deploy que hacía falta**, que es exactamente el agujero
 * que este archivo existe para tapar. Un rojo que no se puede diagnosticar se termina
 * ignorando; uno que nombra su causa se arregla en la vuelta siguiente.
 */
export function describirFallo({ status, signal, stderr } = {}) {
  const linea = String(stderr ?? '')
    .split('\n')
    .map((l) => l.trim())
    // Un stack de node pone el mensaje ARRIBA y los frames abajo; el `^` es del recuadro
    // que dibuja al citar la línea. Sacándolos, lo último que queda es la causa.
    .filter((l) => l && !/^at\s/.test(l) && !/^\^+$/.test(l))
    .pop();
  const partes = [];
  if (signal) partes.push(`cortado por ${signal}`);
  else if (Number.isInteger(status)) partes.push(`salio ${status}`);
  if (linea) partes.push(linea.slice(0, 160));
  return partes.length ? partes.join(': ') : null;
}

/**
 * PURA: los veredictos del seco, pero marcando `FALLO` a todo destino cuya ÚLTIMA corrida REAL
 * falló. Devuelve el mismo objeto si no hay nada que marcar (o si no hay veredictos).
 *
 * NACE DEL 2026-09-19. Las dos preguntas que este gate le hacía al publicador automático
 * —«¿corrió hace poco?» y «¿qué dice que haría?»— son ciegas al que corre y FALLA:
 * `publicadorSoloVigente` sólo mira la CABECERA de la corrida, que un publicador roto escribe
 * igual cada 3 h; y los veredictos salen del `--dry-run`, que sólo sabe decir `al dia`,
 * `publicaria` y `NO publico solo`. `FALLO` y `PUBLICADO` son formas que **sólo** existen en el
 * log de las corridas reales, así que la rama que ya sabía leerlas nunca las veía llegar.
 * Juntas absolvían para siempre: «OK <destino>: falta publicar, pero el publicador lo hace
 * solo». El bot pasó CUATRO días exactamente así, con 17 arreglos varados en `main`.
 *
 * ⚠️ Se marca SÓLO con `FALLO`, no con `NO publico solo`: lo primero es la máquina rota (y el
 * seco no lo puede saber), lo segundo es una DECISIÓN del freno de precio, y ahí el seco —que
 * mide el árbol de ahora— está más fresco que cualquier corrida vieja del log.
 *
 * ⚠️ Y lo que cura un `FALLO` es un éxito POSTERIOR, no que alguien lo borre: el log es
 * append-only y nadie lo rota, así que contar fallos históricos dejaría esto rojo para
 * siempre. Se mira el ÚLTIMO veredicto de cada destino, que es lo que `leerPublicadorSolo` ya
 * devuelve al recorrer las líneas en orden.
 */
export function conLoQueFalloDeVerdad(verdictos, log) {
  const delLog = leerPublicadorSolo(log);
  if (!verdictos || !delLog) return verdictos;
  const rotos = Object.keys(delLog).filter((d) => delLog[d] === 'FALLO');
  if (rotos.length === 0) return verdictos;
  const salida = { ...verdictos };
  for (const d of rotos) salida[d] = 'FALLO';
  return salida;
}

export function seAutoPublicaSegun(verdictos, destino) {
  if (!verdictos) return null;
  const v = verdictos[destino];
  if (v === undefined) return false;
  if (v === 'SE_PUBLICA_SOLO') return true;
  if (v === 'NECESITA_FIRMA' || v === 'FALLO') return false;
  // FRENO_SIN_MEDIR cae acá a propósito: el freno contestó, pero lo que contestó es que no
  // sabe. Devolver `false` lo convertiría en DESCUBIERTO y mandaría a pedir una firma que
  // no decide nada; devolver `true` absolvería a un destino que puede estar varado.
  return null;
}

/**
 * PURA: por qué el publicador automático retuvo un destino SIN haber podido medirlo.
 *
 * NACE DEL 2026-09-19. El freno de precio del publicador se arregló en `c52d9a56` para que
 * pudiera medir el destino `bot`, y ese commit entró a `main` a las 15:44:22 UTC — el sync
 * que copia las herramientas a `/root/bin` había corrido a las 15:44. Por segundos, la
 * copia VIVA quedó vieja una hora, y el publicador de las 15:50 UTC retuvo los 14 archivos
 * del bot escribiendo «no pude medir si cambia». Este gate lo leyó como NECESITA_FIRMA y
 * cantó `DESCUBIERTO bot`, o sea: abrile un pedido y que Sergio Urcullo apriete un `ok`.
 *
 * Los dos remedios son opuestos y sólo uno cuesta su firma. Por eso la causa se dice, con
 * el comando que distingue «la copia viva está vieja» de «el freno no sabe medir esto».
 */
export function describirFrenoCiego(verdictos, destino) {
  if (!verdictos || verdictos[destino] !== 'FRENO_SIN_MEDIR') return null;
  return (
    `el publicador automatico retuvo ${destino} sin poder medir si cambia un monto: eso NO es una ` +
    `firma pendiente de Sergio Urcullo, es el freno que no sabe medir ese destino. Comparar la copia ` +
    `viva con la del repo (md5sum ${PUBLICADOR_SOLO} scripts/loops/extras/publicar-solo.sh): si difieren, ` +
    `la copia viva esta vieja y el sync horario (:44) la actualiza sola`
  );
}

/** PURA: la última corrida REAL que quedó escrita en el log del publicador automático. */
export function ultimaCorridaDelLog(log) {
  let ultima = null;
  const re = /^==\s*(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})\s+La Paz\s*==\s*$/gm;
  let m;
  while ((m = re.exec(String(log ?? '')))) {
    const [, y, mo, d, hh, mm] = m;
    ultima = new Date(Date.UTC(+y, +mo - 1, +d, +hh - LA_PAZ_UTC, +mm));
  }
  return ultima;
}

/**
 * PURA: `true` si el publicador automático corrió hace poco —o sea, si se puede contar con
 * él—, `false` si hace rato que no, `null` si su log no dice cuándo corrió.
 */
export function publicadorSoloVigente(log, ahora, horas = HORAS_SIN_CORRER) {
  const ultima = ultimaCorridaDelLog(log);
  if (!ultima) return null;
  return ahora.getTime() - ultima.getTime() <= horas * 3_600_000;
}

/**
 * PURA: `true` si al publicador en seco le falta publicar algo, `false` si está al día,
 * `null` si su salida no dice ni una cosa ni la otra.
 *
 * ⚠️ El `null` no es prolijidad: si el publicador cambia su texto, lo barato es que este
 * gate se calle, no que declare AL_DIA un destino con arreglos varados — que es la única
 * conclusión de acá que le cuesta plata a alguien.
 */
export function leerPendienteDelSeco(salida) {
  const t = String(salida ?? '');
  if (/YA\s+EST[AÁ]\s+PUBLICADO/i.test(t)) return false;
  const m = t.match(/hay que publicar:\s*(\d+)\s*arreglo/i);
  if (m) return Number(m[1]) > 0;
  return null;
}

/**
 * PURA: lo mismo para el bot, que no se mide por commits sino por espejo — se despliega
 * copiando archivos, así que «lo que falta» es la diferencia entre el repo y `/opt/onia/bot`.
 */
export function leerPendienteDelEspejo(salida) {
  const t = String(salida ?? '');
  if (/ESPEJO\s+DESINCRONIZADO/i.test(t)) return true;
  if (/ESPEJO\s+OK/i.test(t)) return false;
  return null;
}

// ── medición viva ──────────────────────────────────────────────────────────────────────

/**
 * Por qué falló lo último que preguntamos, indexado por quién preguntaba. Es lo que
 * convierte un `null` mudo en un rojo diagnosticable — ver `describirFallo`.
 */
const CAUSAS = new Map();

/**
 * La salida CRUDA de cada detector, indexada por destino. La primera pregunta («¿le falta
 * publicar?») la reduce a un booleano y tira el resto; la quinta necesita el RECUENTO que la
 * misma salida ya traía. Guardarla es lo que hace que la quinta pregunta cueste cero SSH.
 */
const SALIDAS = new Map();

function sh(cmd, args, { clave, ...opts } = {}) {
  try {
    const salida = execFileSync(cmd, args, {
      encoding: 'utf8',
      timeout: 60_000,
      // stderr se CAPTURA, no se ignora: es la única evidencia de por qué no se pudo
      // preguntar, y es justo la que hace falta cuando el veredicto sale NO MEDIDO.
      stdio: ['ignore', 'pipe', 'pipe'],
      ...opts,
    }).trim();
    if (clave) CAUSAS.delete(clave);
    return salida;
  } catch (e) {
    // Un publicador en seco puede salir con código != 0 y aun así haber dicho lo que hace
    // falta. Se conserva su salida: descartarla nos dejaría en NO_MEDIDO por un detalle.
    const out = e && (e.stdout || e.output?.[1]);
    if (out) {
      if (clave) CAUSAS.delete(clave);
      return String(out).trim();
    }
    if (clave) {
      CAUSAS.set(clave, describirFallo({ status: e?.status, signal: e?.signal, stderr: e?.stderr ?? e?.output?.[2] }));
    }
    return null;
  }
}

/**
 * Sólo para el self-check, y no es adorno: la parte que de verdad se rompió es el CABLEADO
 * (`stdio` mandando la stderr a `'ignore'`), y ningún caso puro puede verlo. Sin esta
 * costura, volver a poner `'ignore'` deja el archivo entero en verde.
 */
export function _preguntarParaPruebas(cmd, args, clave) {
  return { salida: sh(cmd, args, { clave }), causa: CAUSAS.get(clave) ?? null };
}

/**
 * El clon donde corren los detectores. No es una ruta cualquiera: es el árbol que
 * `espejo-check.mjs` compara contra `/opt/onia/bot`, y el que se atrasa.
 */
const CLON_DE_LOS_DETECTORES = '/root/loops/onia-hermes';

/**
 * PREPARAR el árbol donde se va a medir — no es medir, y por eso vive acá y no en el detector.
 *
 * ⚠️ El que se negaba a contestar era el bot, y su detector tiene RAZÓN en negarse:
 * `espejo-check.mjs` declara en su encabezado que lee y no escribe, porque un instrumento que
 * muta lo que mide deja de ser instrumento (y el 2026-09-10 un clon atrasado ya hizo cantar
 * DESINCRONIZADO con producción ADELANTE: obedecerlo revertía un arreglo vivo). Así que la
 * cura NO es que el detector se ponga al día: es que QUIEN PREGUNTA deje el árbol en
 * condiciones de contestar, igual que ya hacen `publicar.sh` del bot y del SIAT (los dos con
 * su `merge --ff-only` antes de comparar) y el sincronizador de las :44.
 *
 * Medido el 2026-09-18: el integrador corre en nodo-casa, así que los detectores corren por
 * SSH en el clon del VPS. Pushear a `main` lo deja atrasado al instante, y la corrida
 * siguiente contesta «ESPEJO SIN VEREDICTO — difieren promesa-inclusion.mjs» sobre el archivo
 * recién pusheado. O sea que el integrador se cegaba SOLO, cada vuelta, justo después de
 * mergear — y la dirección del daño es la cara: NO_MEDIDO es el veredicto que se usa para no
 * molestar a Sergio Urcullo, así que un destino mudo CALLA un pedido de deploy que hacía falta.
 * Esa corrida tenía 28 archivos del bot desincronizados con producción.
 *
 * `--ff-only` es lo único que se permite: no puede crear un commit ni perder trabajo local. Si
 * el clon tiene algo propio, el fast-forward no procede, el detector sigue viendo un árbol
 * dudoso y se sigue negando — que es exactamente lo que debe pasar.
 */
export function ponerElEspejoAlDia({ correr = dondeVive, repo = CLON_DE_LOS_DETECTORES } = {}) {
  const salida = correr(
    `git -C ${repo} fetch origin --quiet; git -C ${repo} merge --ff-only --quiet origin/main 2>&1 && echo AL_DIA`,
    { clave: 'espejo' },
  );
  if (salida === null) return { puesto: false, motivo: 'no pude ejecutar el fast-forward' };
  if (!String(salida).split('\n').map((l) => l.trim()).includes('AL_DIA')) {
    return { puesto: false, motivo: `el fast-forward no procedió: ${String(salida).trim().split('\n')[0] || 'sin salida'}` };
  }
  return { puesto: true, motivo: null };
}

/** Corre un comando donde vive `/opt`: acá si existe, y si no, en el VPS por SSH. */
function dondeVive(guion, { timeout = 300_000, clave } = {}) {
  if (existsSync('/opt/onia-landing') || existsSync('/opt/onia-platform')) {
    return sh('bash', ['-lc', guion], { timeout, clave });
  }
  if (!existsSync(VPS)) {
    if (clave) CAUSAS.set(clave, `no hay /opt local ni el puente al VPS (${VPS})`);
    return null;
  }
  return sh('bash', [VPS, 'bash', '-lc', guion], { timeout, clave });
}

/**
 * PURA: la causa de un `null` que NO viene de no poder ejecutar, sino de no poder LEER.
 *
 * ⚠️ Un detector devuelve `null` por dos motivos que desde afuera se ven idénticos: no se
 * pudo ejecutar (lo explica el `catch` de `sh`, con su código de salida) o **corrió, contestó
 * y el parser no supo leer la respuesta**. El segundo no dejaba rastro: `sh` borraba la clave
 * de `CAUSAS` al volver con éxito, así que el `NO MEDIDO` salía MUDO y sólo se podía
 * diagnosticar corriendo el gate hasta que volviera a fallar. Medido el 2026-09-17 sobre el
 * bot, con las dos corridas siguientes en verde.
 *
 * Devuelve `null` cuando no hay nada que contar —sin salida, el `catch` ya puso su causa—,
 * para no pisar una explicación mejor con una peor.
 */
export function describirRespuestaIlegible(salida) {
  const t = String(salida ?? '').trim();
  if (!t) return null;
  const linea = t.split('\n').map((l) => l.trim()).filter(Boolean)[0] ?? '';
  return `corrio y contesto algo que no se sabe leer: "${linea.slice(0, 160)}"`;
}

/**
 * PURA: por qué el publicador automático no dejó veredictos que sirvan, cuando SÍ contestó.
 *
 * ⚠️ MISMO AGUJERO QUE EL HERMANO `describirRespuestaIlegible`, y por eso se cura igual.
 * `verdictosDelPublicadorSolo()` aplanaba a `null` TRES situaciones distintas —no se pudo
 * ejecutar, contestó pero hace rato que no corre, contestó algo ilegible— y sólo la primera
 * dejaba causa. Las otras dos salían MUDAS bajo un motivo que además **miente**: decía «no
 * pude preguntarle al publicador automatico» cuando la verdad era que le preguntamos y nos
 * contestó. Medido el 2026-09-18 04:34 La Paz: el publicador decía `plataforma: publicaria` y
 * `bot: publicaria`, y este gate imprimió `NO MEDIDO` por los dos, sin una línea de causa.
 *
 * La dirección del daño es la de siempre: `NO_MEDIDO` es el veredicto que se usa para NO
 * molestar a Sergio Urcullo, así que un publicador atrasado **calla dos pedidos de deploy**.
 * Y los dos remedios son OPUESTOS: uno se arregla mirando el acceso, el otro mirando el cron.
 *
 * Toma `vigente` YA CALCULADO por `publicadorSoloVigente`: re-derivar acá la comparación
 * sería una segunda fuente del mismo hecho, que es como se desincronizan.
 */
export function describirPublicadorMudo({ vigente, ultima, ahora } = {}) {
  if (vigente === true) return null;
  if (vigente === null || vigente === undefined) {
    return `contesto, pero su log no dice cuando corrio por ultima vez (${LOG_SOLO})`;
  }
  const h = ultima && ahora ? ((ahora.getTime() - ultima.getTime()) / 3_600_000).toFixed(1) : '?';
  return `contesto, pero hace ${h} h que no corre: se salteo su turno (cron 50 */3, ${LOG_SOLO})`;
}

/**
 * PURA: el desacuerdo entre los dos instrumentos, dicho de frente.
 *
 * Nuestro detector dice que a ese destino le falta publicar y el publicador dice otra cosa.
 * `seAutoPublicaSegun` ya devuelve `null` ahí —absolver sería creerle al que no mide el
 * sujeto—, pero ese `null` también salía mudo, y es el más confuso de los tres: el gate
 * funcionó perfecto y aun así no se puede saber a cuál de los dos creerle sin ir a mirar.
 */
export function describirDesacuerdo(destino, veredicto) {
  if (!destino || !veredicto) return null;
  return `nuestro detector dice que a ${destino} le falta publicar y el publicador automatico dice "${veredicto}": desacuerdo, no se absuelve a nadie`;
}

/** Anota una causa sin pisar una explicación mejor que ya esté puesta (igual que `detectar`). */
function anotarCausa(clave, causa) {
  if (causa && !CAUSAS.has(clave)) CAUSAS.set(clave, causa);
}

/**
 * Corre un detector y deja anotado POR QUÉ no se sabe, sea cual sea el motivo.
 *
 * `correr` es inyectable sólo para el self-check: la costura que de verdad se rompió es el
 * cableado entre el que ejecuta y el que lee, y ningún caso sobre las funciones puras puede
 * verla. Su default es el camino real.
 */
export function detectar({ clave, guion, leer, correr = dondeVive }) {
  const salida = correr(guion, { clave });
  // La salida CRUDA se guarda porque la quinta pregunta la necesita y correr el seco otra vez
  // sería un SSH de más por destino. Se guarda acá y no en el llamador por la misma razón que
  // `CAUSAS`: es el único punto por el que pasan los cuatro detectores.
  if (typeof salida === 'string') SALIDAS.set(clave, salida);
  const valor = leer(salida);
  if (valor === null || valor === undefined) {
    const porIlegible = describirRespuestaIlegible(salida);
    if (porIlegible && !CAUSAS.has(clave)) CAUSAS.set(clave, porIlegible);
  }
  return valor;
}

/** Sólo para el self-check: leer lo que quedó anotado sin exponer el Map. */
export function _causaParaPruebas(clave) {
  return CAUSAS.get(clave) ?? null;
}

/** Ídem para la salida cruda que la quinta pregunta reusa. */
export function _salidaParaPruebas(clave) {
  return SALIDAS.get(clave) ?? null;
}

/**
 * LA QUINTA PREGUNTA para un destino, ya con la salida cruda de SU detector en la mano.
 *
 * Vive acá y no como closure de `medirEnVivo` para que el self-check pueda ejercerla entera:
 * la costura que de verdad importa es «de dónde sale el recuento del seco», y una closure la
 * dejaría sin sujeto. Devuelve lo que `clasificarCobertura` espera: `null` = no se pudo
 * juzgar, `[]` = el cuerpo alcanza, ids = pedidos que describen de menos.
 */
export function quintaPregunta(destino, delDestino, { salida, anotar = anotarCausa } = {}) {
  const seco = recuentoDeArreglos(salida);
  if (seco === null) {
    // El bot no entra por acá: su detector es el espejo, que no imprime recuento. Decirlo con
    // el nombre del destino es lo que impide que «no sé preguntarle» se lea como «lo pregunté
    // y está bien» — la distinción que sostiene todo este archivo.
    anotar(`cuerpo:${destino}`, 'su detector no imprime "hay que publicar: N arreglo(s)", asi que no hay con que comparar el cuerpo');
    return null;
  }
  const cortos = pedidosQueDescribenDeMenos(delDestino, seco);
  if (cortos === null) {
    anotar(`cuerpo:${destino}`, `ningun pedido vivo cita el recuento del publicador en seco (hoy: ${seco})`);
    return null;
  }
  if (cortos.length > 0) anotar(`cuerpo:${destino}`, `el publicador en seco dice ${seco} arreglo(s) y el cuerpo cita menos`);
  return cortos;
}

/**
 * Cómo se le pregunta a cada destino si le falta publicar. Escrito a mano a propósito y
 * NOMBRADO: un destino de la lista blanca que no esté acá sale NO_MEDIDO con su nombre.
 */
const DETECTORES = {
  landing: () => detectar({ clave: 'landing', guion: `bash ${DESTINOS.landing} --dry-run 2>&1`, leer: leerPendienteDelSeco }),
  plataforma: () => detectar({ clave: 'plataforma', guion: `bash ${DESTINOS.plataforma} --dry-run 2>&1`, leer: leerPendienteDelSeco }),
  bot: () => detectar({
    clave: 'bot',
    guion: 'node /root/loops/onia-hermes/hermes-content/deploy/vps-ops/bot/espejo-check.mjs 2>&1',
    leer: leerPendienteDelEspejo,
  }),
  // El emisor SIAT se despliega copiando archivos, como el bot, pero su publicador
  // imprime el MISMO formato que los de landing y plataforma ("YA ESTA PUBLICADO" /
  // "hay que publicar: N arreglo(s)") justamente para reusar este parser: un
  // detector nuevo por destino es otra fuente que se desincroniza.
  siat: () => detectar({ clave: 'siat', guion: `bash ${DESTINOS.siat} --dry-run 2>&1`, leer: leerPendienteDelSeco }),
};

const MARCA_LOG = '___LOG_DEL_PUBLICADOR___';

/**
 * VIVA: le pregunta al publicador automático qué haría, y sólo le cree si su log muestra que
 * de verdad está corriendo. Se pide UNA vez por corrida y sólo si hace falta: su `--dry-run`
 * corre los tres publicadores en seco y tarda.
 */
/**
 * La COSTURA entre leer la respuesta del publicador y anotar por qué no sirve. Separada de la
 * caché y del `spawn` a propósito: lo que de verdad se rompió acá fue el cableado —tres
 * caminos volviendo `null` y uno solo dejando causa—, y ningún caso sobre las funciones puras
 * puede verlo. Con la salida y el reloj por parámetro, el self-check lo ejerce entero.
 */
export function _veredictosDesdeSalida(salida, ahora = new Date(), clave = 'publicador') {
  // `null` acá es el único caso que NO hace falta explicar: el `catch` de `sh` ya dejó su
  // causa con el código de salida y la stderr.
  if (salida === null || salida === undefined) return null;
  const [seco = '', log = ''] = String(salida).split(MARCA_LOG);
  const vigente = publicadorSoloVigente(log, ahora);
  if (vigente !== true) {
    anotarCausa(clave, describirPublicadorMudo({ vigente, ultima: ultimaCorridaDelLog(log), ahora }));
    return null;
  }
  const verdictos = leerPublicadorSolo(seco);
  // Corrió hace poco y aun así no se le entiende («ya hay una corrida en curso; salgo»).
  if (verdictos === null) anotarCausa(clave, describirRespuestaIlegible(seco));
  // El seco dice qué HARÍA; sólo el log dice qué le PASÓ. Un destino que viene fallando de
  // verdad no lo absuelve ningún «publicaria» — ver `conLoQueFalloDeVerdad`.
  return conLoQueFalloDeVerdad(verdictos, log);
}

let verdictosCache;
function verdictosDelPublicadorSolo() {
  if (verdictosCache !== undefined) return verdictosCache;
  const salida = dondeVive(
    `bash ${PUBLICADOR_SOLO} --dry-run 2>&1; echo "${MARCA_LOG}"; tail -60 ${LOG_SOLO} 2>/dev/null`,
    { clave: 'publicador' },
  );
  return (verdictosCache = _veredictosDesdeSalida(salida, new Date()));
}

/**
 * 🔴 MISMO AGUJERO QUE EL HERMANO, y por eso se cura en la misma vuelta. Esto pedía la lista
 * y después un `show` POR TAREA: en el nodo de casa cada uno es un handshake SSH, o sea que el
 * gate tardaba lo que midiera el tablero (~7 min con 72 tareas el 2026-09-13) y su universo
 * salía de una lista de símbolos escrita a mano que no incluía `running`. Un pedido RECLAMADO
 * era invisible acá también — y este gate es justo el que decide si se abre un pedido: no
 * verlo es abrir un DUPLICADO por un destino que ya tenía el suyo.
 */
function pedidosVivos() {
  return barrerTableroJson(
    sh('bash', [TABLERO, 'list', '--json'], { timeout: 180_000, clave: 'tablero' }),
  );
}

function medirEnVivo() {
  const barrido = pedidosVivos();
  if (barrido === null) {
    console.log(`NO MEDIDO: no pude leer el tablero (${TABLERO})`);
    const causa = CAUSAS.get('tablero');
    if (causa) console.log(`  causa: ${causa}`);
    return 2;
  }
  const { pedidos, ilegibles } = barrido;

  // Ver la cabecera: un barrido incompleto y un tablero sin pedidos se ven igual, y la
  // conclusión equivocada hace abrir un pedido duplicado.
  if (ilegibles.length > 0) {
    console.log(`NO MEDIDO: ${ilegibles.length} tarea(s) abiertas no contestaron el show — ${ilegibles.join(', ')}`);
    console.log('  Con el barrido incompleto no puedo decir que a un destino le falte pedido.');
    return 2;
  }

  // Antes de preguntarle a nadie: dejar el clon donde corren los detectores en `origin/main`.
  // Se hace ACÁ y no dentro de un detector porque preparar no es medir — ver `ponerElEspejoAlDia`.
  const alDia = ponerElEspejoAlDia();
  if (!alDia.puesto) console.log(`aviso: el árbol de los detectores quedó como estaba (${alDia.motivo})`);

  const destinos = Object.keys(DESTINOS);
  const filas = clasificarCobertura({
    destinos,
    pedidos,
    pendiente: (d) => (DETECTORES[d] ? DETECTORES[d]() : null),
    seAutoPublica: (d) => {
      const verdictos = verdictosDelPublicadorSolo();
      const solo = seAutoPublicaSegun(verdictos, d);
      // El QUINTO `null`, y el más caro de confundir: el freno retuvo el destino SIN poder
      // medirlo. Va ANTES del desacuerdo porque `anotarCausa` no pisa lo ya puesto y el
      // desacuerdo lo describiría mal — acá los dos instrumentos coinciden en que falta
      // publicar; lo que no se sabe es si hace falta una firma.
      if (solo === null && verdictos) anotarCausa(`publicador:${d}`, describirFrenoCiego(verdictos, d));
      // El CUARTO `null`, y el único que es por destino: los dos instrumentos contestaron y
      // no coinciden. Va con su propia clave o el segundo destino pisaría la causa del primero.
      if (solo === null && verdictos) anotarCausa(`publicador:${d}`, describirDesacuerdo(d, verdictos[d]));
      return solo;
    },
    // LA QUINTA PREGUNTA, contra la salida que el detector YA corrió — cero SSH extra.
    describeLoQuePublica: (d, delDestino) => quintaPregunta(d, delDestino, { salida: SALIDAS.get(d) }),
    ahora: Date.now(),
  });

  for (const f of filas) {
    const quien = f.pedidos.length ? ` — pedido ${f.pedidos.join(', ')}` : '';
    if (f.estado === 'DESCUBIERTO') {
      console.log(`DESCUBIERTO ${f.destino}: tiene arreglos sin publicar y NINGUN pedido vivo los pide.`);
    } else if (f.estado === 'NO_MEDIDO') {
      console.log(`NO MEDIDO ${f.destino}: ${f.motivo}${quien}`);
      // `fuente` dice a cuál de los dos instrumentos preguntarle la causa. Sin esta línea,
      // el rojo es irreproducible: ya pasó una vez y costó la vuelta entera.
      // La del destino primero: el desacuerdo es más preciso que el motivo global, y si lo
      // hay, el global no aplica.
      const causa = f.fuente === 'publicador'
        ? (CAUSAS.get(`publicador:${f.destino}`) ?? CAUSAS.get('publicador'))
        : CAUSAS.get(f.destino);
      if (causa) console.log(`  causa: ${causa}`);
    } else if (f.estado === 'AL_DIA') {
      console.log(`OK ${f.destino}: al dia, no hay nada que pedir${quien}`);
    } else if (f.estado === 'SE_PUBLICA_SOLO') {
      console.log(`OK ${f.destino}: falta publicar, pero el publicador automatico lo hace solo (<=3 h) — no hay que pedir ok.`);
    } else if (f.estado === 'CUBIERTO_SOBRA') {
      console.log(`AVISO ${f.destino}: el pedido SOBRA — el publicador automatico lo saca solo (<=3 h)${quien}`);
      console.log('  Le esta pidiendo un ok a Sergio Urcullo por trabajo que sale sin su firma.');
      console.log('  Archivalo en esta vuelta (es accion tuya, no suya): onia-tablero.sh archive <id>.');
    } else if (f.estado === 'CUBIERTO_VIEJO') {
      console.log(`AVISO ${f.destino}: el pedido lleva ${f.esperaH} h sin resolver — el arreglo sigue sin llegar al cliente${quien}`);
      console.log('  No es un pedido que falte: es uno que nadie apreto. Abrir otro seria un duplicado.');
    } else if (f.estado === 'CUBIERTO_CORTO') {
      console.log(`AVISO ${f.destino}: el pedido existe pero su CUERPO describe menos de lo que su ok publicaria — ${f.cortos.join(', ')}`);
      const causa = CAUSAS.get(`cuerpo:${f.destino}`);
      if (causa) console.log(`  causa: ${causa}`);
      console.log('  El cuerpo es lo unico que Sergio Urcullo lee: rehacer el pedido con el recuento');
      console.log('  derivado del publicador en seco y ARCHIVAR el viejo en la misma vuelta (comentar no alcanza).');
    } else {
      const desde = f.esperaH === null ? '' : ` (pedido hace ${f.esperaH} h)`;
      // Un `cortos: null` es «no pude juzgar la quinta pregunta», y se dice: callarlo lo
      // volvería indistinguible de «la juzgué y el cuerpo alcanza».
      const dudoso = f.cortos === null ? ` — sin juzgar si el cuerpo lo describe (${CAUSAS.get(`cuerpo:${f.destino}`) ?? 'sin causa anotada'})` : '';
      console.log(`OK ${f.destino}: falta publicar y ya hay pedido${quien}${desde}${dudoso}`);
    }
  }

  if (filas.some((f) => f.estado === 'DESCUBIERTO')) {
    console.log('');
    console.log('Abrir UN pedido por destino descubierto, con la linea "DESPLEGAR: <destino>" en el');
    console.log('cuerpo y bloqueado con --kind needs_input. La cifra se cita del publicador en seco.');
    return 1;
  }
  if (filas.some((f) => f.estado === 'NO_MEDIDO')) return 2;
  // ⚠️ Ni `CUBIERTO_VIEJO` ni `CUBIERTO_CORTO` cambian el código de salida, y es una decisión,
  // no un olvido — los dos se curan con algo que sólo pasa fuera de esta vuelta. Este
  // gate está en la cadena `npm test` que el integrador corre antes de cada merge: ponerlo
  // rojo por un pedido que sólo Sergio Urcullo puede destrabar trabaría el merge de TODOS los
  // carriles hasta que él apriete un botón, y la cura sería saltearse el gate — que es como
  // esta familia de gates se muere. El aviso va donde lo lee quien puede hacer algo: la
  // salida que mira la vuelta del integrador.
  return 0;
}

// ── self-check ─────────────────────────────────────────────────────────────────────────

function selfCheck() {
  let fallos = 0;
  const ok = (cond, nombre) => {
    if (cond) return;
    fallos++;
    console.log(`FALLO: ${nombre}`);
  };

  const sinPedidos = [];
  const conLanding = [{ id: 't_x', destino: 'landing' }];
  /** El publicador automático no cubre a `landing`: es el caso viejo, sin tercera pregunta. */
  const nadieLoPublicaSolo = () => false;
  /** Ídem para la quinta: `[]` es «la juzgué y ningún cuerpo describe de menos». */
  const nadieEstaCorto = () => [];

  // ── Un pedido que ENVEJECE no es lo mismo que un pedido recién abierto ────────────────
  // Ver la cabecera: mientras el pedido del bot esperaba 4 días, esto decía `CUBIERTO` y
  // salía 0. Los casos van con `ahora` y una fecha de creación, que es lo único que
  // distingue las dos situaciones.
  const AHORA = Date.parse('2026-09-17T10:00:00Z');
  const hace = (horas) => Math.floor((AHORA - horas * 3_600_000) / 1000);
  const cubrir = (creado) => [{ id: 't_x', destino: 'landing', creado }];
  const estadoDe = (pedidos, ahora = AHORA) =>
    clasificarCobertura({ destinos: ['landing'], pedidos, pendiente: () => true, seAutoPublica: nadieLoPublicaSolo, describeLoQuePublica: nadieEstaCorto, ahora })[0];

  ok(estadoDe(cubrir(hace(2))).estado === 'CUBIERTO', 'un pedido de hace 2 h es cobertura normal');
  ok(estadoDe(cubrir(hace(96))).estado === 'CUBIERTO_VIEJO', 'un pedido de hace 4 dias ya no puede salir como cobertura normal');
  ok(estadoDe(cubrir(hace(96))).esperaH === 96, 'el veredicto tiene que decir CUANTAS horas lleva esperando');
  // El borde, escrito de los dos lados: sin esto, mover el umbral no rompe nada.
  ok(estadoDe(cubrir(hace(23))).estado === 'CUBIERTO', 'debajo del umbral sigue siendo cobertura normal');
  ok(estadoDe(cubrir(hace(25))).estado === 'CUBIERTO_VIEJO', 'pasado el umbral es CUBIERTO_VIEJO');
  // Tri-estado: un pedido sin fecha legible NO se declara viejo ni se declara fresco.
  ok(estadoDe(cubrir(null)).estado === 'CUBIERTO', 'sin fecha de creacion no se puede afirmar que envejecio');
  ok(estadoDe(cubrir(null)).esperaH === null, 'sin fecha, la espera es null y no 0');
  // Con dos pedidos del mismo destino manda el MÁS VIEJO: lo que se mide es hace cuánto que
  // el arreglo no llega al cliente, y eso arranca con el primero, no con el último.
  ok(
    estadoDe([{ id: 't_viejo', destino: 'landing', creado: hace(96) }, { id: 't_nuevo', destino: 'landing', creado: hace(1) }]).estado === 'CUBIERTO_VIEJO',
    'abrir un pedido nuevo no rejuvenece el trabajo que lleva 4 dias sin publicar',
  );
  // Y no puede tapar al DESCUBIERTO, que es el motivo por el que este gate existe.
  ok(estadoDe(sinPedidos).estado === 'DESCUBIERTO', 'la pregunta nueva no puede cambiar el veredicto sin pedido');

  // El caso que motivó el gate: falta publicar y no hay pedido.
  ok(
    clasificarCobertura({ destinos: ['landing'], pedidos: sinPedidos, pendiente: () => true, seAutoPublica: nadieLoPublicaSolo, describeLoQuePublica: nadieEstaCorto, ahora: AHORA })[0].estado === 'DESCUBIERTO',
    'falta publicar y sin pedido tiene que ser DESCUBIERTO',
  );
  // El caso que YA CUMPLE. Sin él, un gate que devolviera DESCUBIERTO siempre pasaría.
  //
  // ⚠️ Acá este caso exigía `preguntas.length === 0` —con pedido vivo NO preguntarle al
  // publicador— y su motivo escrito tenía dos mitades: que el `--dry-run` cuesta SSH, y que
  // «la respuesta no cambiaría el veredicto». La primera la cubre el caché
  // (`verdictosDelPublicadorSolo` corre una sola vez por vuelta, sin importar cuántos
  // destinos pregunten). La segunda era cierta el día que se escribió y dejó de serlo el
  // 2026-09-19, cuando la respuesta pasó a decidir `CUBIERTO_SOBRA`: el caso defendía el
  // hueco que tapaba, que es como esta familia de fixtures falla.
  //
  // Lo que se conserva es la propiedad que de verdad importaba: se le pregunta UNA vez por
  // destino, no una por pedido — un destino con cinco pedidos vivos no multiplica nada.
  const preguntas = [];
  ok(
    clasificarCobertura({
      destinos: ['landing'],
      pedidos: [...conLanding, { id: 't_x2', destino: 'landing' }, { id: 't_x3', destino: 'landing' }],
      pendiente: () => true,
      seAutoPublica: (d) => { preguntas.push(d); return false; },
      describeLoQuePublica: nadieEstaCorto,
      ahora: AHORA,
    })[0].estado === 'CUBIERTO',
    'falta publicar y con pedido vivo NO puede ser DESCUBIERTO',
  );
  ok(
    preguntas.length === 1 && preguntas[0] === 'landing',
    `al publicador se le pregunta una vez por destino y por el propio: ${JSON.stringify(preguntas)}`,
  );
  ok(
    clasificarCobertura({ destinos: ['landing'], pedidos: sinPedidos, pendiente: () => false, seAutoPublica: nadieLoPublicaSolo, describeLoQuePublica: nadieEstaCorto, ahora: AHORA })[0].estado === 'AL_DIA',
    'sin trabajo pendiente no hay nada que pedir',
  );
  // No se sabe nunca puede acusar: es la dirección que hace abrir pedidos duplicados.
  ok(
    clasificarCobertura({ destinos: ['landing'], pedidos: sinPedidos, pendiente: () => null, seAutoPublica: nadieLoPublicaSolo, describeLoQuePublica: nadieEstaCorto, ahora: AHORA })[0].estado === 'NO_MEDIDO',
    'sin poder medir NO puede salir DESCUBIERTO',
  );

  // ── que un NO MEDIDO sepa decir POR QUÉ (2026-09-13) ────────────────────────────────
  // Los dos NO_MEDIDO vienen de instrumentos distintos, y el que imprime tiene que poder
  // buscar la causa del que falló SIN adivinarla del texto del motivo.
  ok(
    clasificarCobertura({ destinos: ['landing'], pedidos: sinPedidos, pendiente: () => null, seAutoPublica: nadieLoPublicaSolo, describeLoQuePublica: nadieEstaCorto, ahora: AHORA })[0].fuente === 'detector',
    'el NO_MEDIDO del detector se declara "detector"',
  );
  ok(
    clasificarCobertura({ destinos: ['landing'], pedidos: sinPedidos, pendiente: () => true, seAutoPublica: () => null, describeLoQuePublica: nadieEstaCorto, ahora: AHORA })[0].fuente === 'publicador',
    'el NO_MEDIDO del publicador automatico se declara "publicador"',
  );
  // Los dos NO_MEDIDO tienen que ser DISTINGUIBLES: si los dos dijeran lo mismo, el que
  // imprime le pediría la causa al instrumento que sí contestó y la línea saldría vacía.
  ok(
    clasificarCobertura({ destinos: ['landing'], pedidos: sinPedidos, pendiente: () => null, seAutoPublica: nadieLoPublicaSolo, describeLoQuePublica: nadieEstaCorto, ahora: AHORA })[0].fuente
      !== clasificarCobertura({ destinos: ['landing'], pedidos: sinPedidos, pendiente: () => true, seAutoPublica: () => null, describeLoQuePublica: nadieEstaCorto, ahora: AHORA })[0].fuente,
    'los dos NO_MEDIDO no pueden nombrar la misma fuente',
  );

  // `describirFallo`: las formas reales con las que muere una pregunta por SSH.
  ok(
    describirFallo({ status: 255, stderr: 'ssh: connect to host 187.77.16.63 port 22: Connection timed out\n' })
      === 'salio 255: ssh: connect to host 187.77.16.63 port 22: Connection timed out',
    'un SSH caido nombra su codigo y su linea',
  );
  ok(
    describirFallo({ signal: 'SIGTERM', stderr: '' }) === 'cortado por SIGTERM',
    'un timeout se nombra por su senal aunque no haya escrito nada',
  );
  // Un stack de node pone el mensaje ARRIBA: quedarse con la última línea a secas devuelve
  // un frame («at Object.<anonymous>…»), que no dice NADA de la causa.
  ok(
    describirFallo({ status: 1, stderr: '/opt/x.mjs:12\n  throw new Error("no existe el espejo")\n  ^\n\nError: no existe el espejo\n    at Object.<anonymous> (/opt/x.mjs:12:9)\n' })
      === 'salio 1: Error: no existe el espejo',
    'un stack de node se resume en su mensaje, no en un frame',
  );
  // Sin NADA que decir devuelve null, y el que imprime no dibuja una línea «causa:» vacía.
  ok(describirFallo({}) === null, 'sin status, senal ni stderr no hay causa que inventar');
  ok(describirFallo({ status: 0, stderr: '   \n\n' }) === 'salio 0', 'stderr en blanco no es una causa');

  // El CABLEADO, con procesos de verdad (locales, sin red): es la mitad que se rompió.
  const mudo = _preguntarParaPruebas('bash', ['-c', 'echo "no pude abrir el espejo" >&2; exit 3'], 'zz-prueba-muda');
  ok(mudo.salida === null, 'un comando que no dice nada por stdout sigue devolviendo null');
  ok(
    mudo.causa === 'salio 3: no pude abrir el espejo',
    'y la causa conserva lo que escribio por stderr — si stdio la ignora, esto se cae',
  );
  // La otra mitad, ya medida el 2026-09-12: una negativa INFORMADA del destino no es una
  // falla de red. Si se tirara, el veredicto volveria a ser NO MEDIDO por un detalle.
  const informado = _preguntarParaPruebas('bash', ['-c', 'echo "hay que publicar: 2 arreglo(s)"; echo ruido >&2; exit 1'], 'zz-prueba-informado');
  ok(informado.salida === 'hay que publicar: 2 arreglo(s)', 'corrio y dijo algo: su salida NO se tira');
  ok(informado.causa === null, 'y no deja causa colgada: no hubo nada que diagnosticar');
  // Un pedido de OTRO destino no cubre a éste.
  ok(
    clasificarCobertura({ destinos: ['landing'], pedidos: [{ id: 't_y', destino: 'bot' }], pendiente: () => true, seAutoPublica: nadieLoPublicaSolo, describeLoQuePublica: nadieEstaCorto, ahora: AHORA })[0].estado === 'DESCUBIERTO',
    'un pedido de otro destino no cubre a landing',
  );
  // El sujeto son los DESTINOS: uno sin ninguna tarea tiene que tener fila igual.
  const filas = clasificarCobertura({ destinos: ['landing', 'plataforma', 'bot'], pedidos: conLanding, pendiente: () => true, seAutoPublica: nadieLoPublicaSolo, describeLoQuePublica: nadieEstaCorto, ahora: AHORA });
  ok(filas.length === 3, 'tiene que haber una fila por destino, tenga tareas o no');
  ok(filas.filter((f) => f.estado === 'DESCUBIERTO').length === 2, 'los dos destinos sin pedido tienen que salir descubiertos');

  // ── ¿lo publica solo el publicador automatico? ───────────────────────────────────────
  // Falta publicar, no hay pedido, PERO el cron lo publica solo en <=3 h: pedirle un `ok`
  // a Sergio Urcullo por eso es el pedido que nace cumplido.
  ok(
    clasificarCobertura({ destinos: ['bot'], pedidos: sinPedidos, pendiente: () => true, seAutoPublica: () => true, describeLoQuePublica: nadieEstaCorto, ahora: AHORA })[0].estado === 'SE_PUBLICA_SOLO',
    'lo que el publicador automatico hace solo NO puede salir DESCUBIERTO',
  );
  // El caso que YA CUMPLE: sin auto-publicacion, el veredicto de siempre.
  ok(
    clasificarCobertura({ destinos: ['bot'], pedidos: sinPedidos, pendiente: () => true, seAutoPublica: () => false, describeLoQuePublica: nadieEstaCorto, ahora: AHORA })[0].estado === 'DESCUBIERTO',
    'lo que el publicador automatico NO toca sigue siendo DESCUBIERTO',
  );
  // No poder preguntarle tampoco absuelve: absolver a ciegas esconde un arreglo varado.
  ok(
    clasificarCobertura({ destinos: ['bot'], pedidos: sinPedidos, pendiente: () => true, seAutoPublica: () => null, describeLoQuePublica: nadieEstaCorto, ahora: AHORA })[0].estado === 'NO_MEDIDO',
    'sin saber si se publica solo NO puede salir ni DESCUBIERTO ni absuelto',
  );
  // ── ¿y si el pedido SOBRA? (2026-09-19) ─────────────────────────────────────────────
  // Falta publicar, HAY pedido, y el cron lo publica solo igual: ese `ok` no hace falta.
  // Hasta hoy la cadena cortaba en «hay pedido» y nunca llegaba a preguntarlo, así que el
  // caso salía como cobertura normal — cierto, y por eso invisible.
  ok(
    clasificarCobertura({ destinos: ['landing'], pedidos: conLanding, pendiente: () => true, seAutoPublica: () => true, describeLoQuePublica: nadieEstaCorto, ahora: AHORA })[0].estado === 'CUBIERTO_SOBRA',
    'un pedido vivo que el publicador automatico vuelve innecesario tiene que salir como que SOBRA',
  );
  // El caso que YA CUMPLE. Sin él, un gate que devolviera CUBIERTO_SOBRA siempre pasaría.
  ok(
    clasificarCobertura({ destinos: ['landing'], pedidos: conLanding, pendiente: () => true, seAutoPublica: nadieLoPublicaSolo, describeLoQuePublica: nadieEstaCorto, ahora: AHORA })[0].estado === 'CUBIERTO',
    'un pedido que el publicador automatico NO cubre sigue siendo cobertura normal',
  );
  // SOBRA gana a CORTO: el remedio del corto es REHACER el pedido, o sea fabricar otro que
  // también sobra. Archivarlo cura los dos. Imprimir primero el que no limpia al otro es
  // como esta misma cadena de controles ya falló una vez.
  ok(
    clasificarCobertura({ destinos: ['landing'], pedidos: conLanding, pendiente: () => true, seAutoPublica: () => true, describeLoQuePublica: () => ['t_x'], ahora: AHORA })[0].estado === 'CUBIERTO_SOBRA',
    'un pedido corto que ademas sobra se archiva, no se rehace',
  );
  // Y gana al viejo por lo mismo: esperar un `ok` que no hace falta es esperar para siempre.
  ok(
    clasificarCobertura({ destinos: ['landing'], pedidos: cubrir(hace(96)), pendiente: () => true, seAutoPublica: () => true, describeLoQuePublica: nadieEstaCorto, ahora: AHORA })[0].estado === 'CUBIERTO_SOBRA',
    'un pedido viejo que ademas sobra se archiva, no se espera',
  );
  // No poder preguntarle NO archiva nada. El daño no es simétrico: mantener un pedido que
  // sobraba cuesta un `ok` de más; archivar uno que hacía falta deja el arreglo sin llegar
  // al cliente y sin nadie mirando.
  ok(
    clasificarCobertura({ destinos: ['landing'], pedidos: conLanding, pendiente: () => true, seAutoPublica: () => null, describeLoQuePublica: nadieEstaCorto, ahora: AHORA })[0].estado === 'CUBIERTO',
    'sin poder medir al publicador, un pedido vivo NO se declara sobrante',
  );

  // La pregunta es OBLIGATORIA: un llamador que se la olvide tiene que romperse, no
  // heredar el veredicto viejo en silencio.
  // Cada una se prueba con la OTRA puesta: si al caso le faltan las dos, el `catch` se lo
  // come el primer `throw` y el segundo parámetro queda sin probar, opcional y en verde.
  let exigida = false;
  try {
    clasificarCobertura({ destinos: ['bot'], pedidos: sinPedidos, pendiente: () => true, describeLoQuePublica: nadieEstaCorto, ahora: AHORA });
  } catch {
    exigida = true;
  }
  ok(exigida, 'clasificarCobertura tiene que EXIGIR seAutoPublica, no darla por default');
  let exigeAhora = false;
  try {
    clasificarCobertura({ destinos: ['bot'], pedidos: sinPedidos, pendiente: () => true, seAutoPublica: nadieLoPublicaSolo, describeLoQuePublica: nadieEstaCorto });
  } catch {
    exigeAhora = true;
  }
  ok(exigeAhora, 'clasificarCobertura tiene que EXIGIR ahora: sin reloj no puede decir si un pedido envejecio');
  let exigeDescribe = false;
  try {
    clasificarCobertura({ destinos: ['bot'], pedidos: sinPedidos, pendiente: () => true, seAutoPublica: nadieLoPublicaSolo, ahora: AHORA });
  } catch {
    exigeDescribe = true;
  }
  ok(exigeDescribe, 'clasificarCobertura tiene que EXIGIR describeLoQuePublica: con default, todo pedido corto se absuelve solo');

  // ── LA QUINTA PREGUNTA: ¿el pedido DESCRIBE lo que hoy publicaria? ──────────────────
  // Ver la cabecera. El caso medido el 2026-09-18: pedido abierto con 6 arreglos, el
  // integrador mergea, el seco pasa a 7 y el cuerpo sigue diciendo 6.
  const SECO7 = '== hay que publicar: 7 arreglo(s) que el cliente no ve ==';
  const cuerpoCon = (n) => `DESPLEGAR: landing\nhay que publicar: ${n} arreglo(s) que el cliente no ve`;
  const conCuerpo = (texto, creado = hace(1)) => [{ id: 't_x', destino: 'landing', texto, creado }];
  const quinta = (pedidosDelDestino, seco = recuentoDeArreglos(SECO7)) =>
    clasificarCobertura({
      destinos: ['landing'],
      pedidos: pedidosDelDestino,
      pendiente: () => true,
      seAutoPublica: nadieLoPublicaSolo,
      describeLoQuePublica: (_d, del) => pedidosQueDescribenDeMenos(del, seco),
      ahora: AHORA,
    })[0];

  ok(quinta(conCuerpo(cuerpoCon(6))).estado === 'CUBIERTO_CORTO', 'un cuerpo que cita 6 con el seco en 7 describe de menos');
  ok(quinta(conCuerpo(cuerpoCon(6))).cortos.join() === 't_x', 'y el veredicto NOMBRA al pedido corto, que es lo que hay que rehacer');
  // El caso que YA CUMPLE. Sin él, un gate que devolviera CUBIERTO_CORTO siempre pasaría.
  ok(quinta(conCuerpo(cuerpoCon(7))).estado === 'CUBIERTO', 'un cuerpo que cita lo mismo que el seco es cobertura normal');
  // La dirección asimétrica, escrita: describir de MÁS es la otra familia (`cuerpoVencido`),
  // y acusarla desde acá haría rehacer pedidos sanos por el lado barato.
  ok(quinta(conCuerpo(cuerpoCon(9))).estado === 'CUBIERTO', 'un cuerpo que cita de mas NO se acusa acá: ésa es la familia del hermano');
  // Tri-estado: un cuerpo sin recuento legible no se puede juzgar, y eso NO es «está bien».
  ok(quinta(conCuerpo('DESPLEGAR: landing\nhay unos arreglos')).cortos === null, 'un cuerpo sin recuento sale null, no aprobado');
  ok(quinta(conCuerpo('DESPLEGAR: landing\nhay unos arreglos')).estado === 'CUBIERTO', 'y sin poder juzgarlo NO se acusa');
  // Sin recuento del seco tampoco hay con qué comparar (es el caso del bot, que se mide por espejo).
  ok(quinta(conCuerpo(cuerpoCon(6)), null).cortos === null, 'sin recuento del seco no se puede juzgar el cuerpo');
  // El COMENTARIO no puede tapar al cuerpo: es el motivo por el que se parte el texto.
  const conComentario = `${cuerpoCon(6)}\n\nComments (1):\n- hay que publicar: 7 arreglo(s) que el cliente no ve\n`;
  ok(quinta(conCuerpo(conComentario)).estado === 'CUBIERTO_CORTO', 'un recuento COMENTADO no alcanza: Sergio Urcullo lee el cuerpo');
  // Basta que UNO de los pedidos vivos del destino esté corto: el boton que se aprieta puede ser ese.
  ok(
    quinta([
      { id: 't_bien', destino: 'landing', texto: cuerpoCon(7), creado: hace(1) },
      { id: 't_corto', destino: 'landing', texto: cuerpoCon(6), creado: hace(1) },
    ]).cortos.join() === 't_corto',
    'con dos pedidos vivos, el corto se nombra y no lo absuelve el hermano completo',
  );
  // El corto GANA al viejo: su remedio (rehacer + archivar) cura los dos; el del viejo, no.
  ok(quinta(conCuerpo(cuerpoCon(6), hace(96))).estado === 'CUBIERTO_CORTO', 'un pedido viejo Y corto se imprime como corto: rehacerlo cura las dos cosas');
  // Y la quinta NO puede tapar al DESCUBIERTO, que es el motivo por el que este gate existe.
  ok(quinta([]).estado === 'DESCUBIERTO', 'la pregunta nueva no puede cambiar el veredicto sin pedido');

  // Las dos funciones puras, aparte del veredicto que las usa.
  ok(recuentoDeArreglos(SECO7) === 7, 'el recuento se lee de la marca del publicador');
  ok(recuentoDeArreglos('YA ESTA PUBLICADO — produccion corre 2045ff1') === null, 'sin la marca no hay recuento que inventar');
  ok(recuentoDeArreglos('hay que publicar: 2 arreglo(s)\nhay que publicar: 9 arreglo(s)') === 9, 'con varias apariciones manda la MAYOR: no acusar de mas');
  ok(cuerpoDescribeElRecuento({ texto: cuerpoCon(7), seco: 7 }) === true, 'cuerpo al dia');
  ok(cuerpoDescribeElRecuento({ texto: cuerpoCon(6), seco: 7 }) === false, 'cuerpo corto');
  ok(cuerpoDescribeElRecuento({ texto: cuerpoCon(6), seco: null }) === null, 'sin seco no se juzga');

  // La COSTURA: de dónde sale el recuento del seco, y que cada `null` deje su causa. Ningún
  // caso sobre `cuerpoDescribeElRecuento` la ve, y es donde se rompería sin hacer ruido.
  const causasQuinta = new Map();
  const anotar = (k, v) => causasQuinta.set(k, v);
  ok(
    quintaPregunta('landing', conCuerpo(cuerpoCon(6)), { salida: SECO7, anotar }).join() === 't_x',
    'la quinta pregunta saca su recuento de la salida CRUDA del detector, no de otro lado',
  );
  ok(/dice 7 arreglo/.test(String(causasQuinta.get('cuerpo:landing'))), 'y deja la causa con el numero que midio');
  ok(
    quintaPregunta('bot', conCuerpo(cuerpoCon(6)), { salida: 'ESPEJO DESINCRONIZADO — 28 archivos', anotar }) === null,
    'un detector sin recuento (el espejo del bot) no se puede juzgar: null, no aprobado',
  );
  ok(/no imprime/.test(String(causasQuinta.get('cuerpo:bot'))), 'y ese null tambien dice por que, o el rojo seria irreproducible');
  ok(
    quintaPregunta('landing', conCuerpo('DESPLEGAR: landing\nsin recuento'), { salida: SECO7, anotar }) === null,
    'un cuerpo sin recuento citado tampoco se juzga',
  );
  ok(/ningun pedido vivo cita/.test(String(causasQuinta.get('cuerpo:landing'))), 'con su causa propia, distinta de la del detector mudo');
  ok(quintaPregunta('landing', conCuerpo(cuerpoCon(7)), { salida: SECO7, anotar }).length === 0, 'y el caso que YA CUMPLE devuelve lista vacia, no null');

  // Lectura de la salida real del publicador automatico (sus cinco veredictos).
  const seco = [
    '== 2026-09-12 20:44 La Paz ==',
    '  plataforma: al dia',
    '  landing: NO publico solo — toca una fuente de precio',
    '  bot: publicaria (nada toca precio)',
  ].join('\n');
  const v = leerPublicadorSolo(seco);
  ok(seAutoPublicaSegun(v, 'bot') === true, 'publicaria = lo hace solo');
  ok(seAutoPublicaSegun(v, 'landing') === false, 'una fuente de precio NO se publica sola: necesita firma');
  ok(seAutoPublicaSegun(v, 'plataforma') === null, 'si el publicador dice "al dia" y nuestro detector dice que falta, hay desacuerdo: no se sabe');
  // El emisor SIAT no es destino de ese cron: que no aparezca significa que NO se publica solo.
  ok(seAutoPublicaSegun(v, 'siat') === false, 'un destino que el publicador no cubre no se publica solo');
  ok(seAutoPublicaSegun(leerPublicadorSolo('PUBLICADO por alguien'), 'bot') === null, 'sin veredictos por destino no se sabe nada');
  ok(leerPublicadorSolo('ya hay una corrida en curso; salgo') === null, 'si el publicador no llego a medir, no dice nada');
  ok(seAutoPublicaSegun(leerPublicadorSolo('  bot: FALLO'), 'bot') === false, 'un publicador que FALLO no absuelve a nadie');
  ok(seAutoPublicaSegun(leerPublicadorSolo('  bot: PUBLICADO'), 'bot') === true, 'PUBLICADO es la forma no-seca de "lo hace solo"');

  // ── «no publico solo» tiene DOS causas y mandan a lugares OPUESTOS ───────────────────
  // Medido en produccion el 2026-09-19 15:50 UTC, con el literal que el freno escribio:
  // el bot quedo retenido no porque cambiara un monto, sino porque la copia VIVA del freno
  // (/root/bin, que el sync copia al :44) todavia era la vieja que no sabia medir el bot.
  // Aplanar las dos en NECESITA_FIRMA hace que este gate diga DESCUBIERTO y mande a gastar
  // la firma de Sergio Urcullo en algo que se arregla solo a la hora siguiente.
  const frenoCiego = leerPublicadorSolo(
    '  bot: NO publico solo — toca una fuente de precio y no pude medir si cambia: CAMBIA knowledge.onia.json (2 lineas)',
  );
  ok(seAutoPublicaSegun(frenoCiego, 'bot') === null, 'un freno que NO PUDO MEDIR no es una firma pendiente: no se sabe');
  const frenoMidio = leerPublicadorSolo(
    '  landing: NO publico solo — cambia un numero en una fuente de precio: src/lib/pricing.ts: 320 550',
  );
  ok(seAutoPublicaSegun(frenoMidio, 'landing') === false, 'un monto que SI cambio sigue necesitando la firma');
  ok(
    describirFrenoCiego(frenoCiego, 'bot') !== null && describirFrenoCiego(frenoMidio, 'landing') === null,
    'solo el freno que no pudo medir explica su causa; el que midio no tiene nada que explicar',
  );

  // Que el guion exista no prueba que el cron lo corra: se exige una corrida reciente.
  const logSolo = '== 2026-09-12 14:50 La Paz ==\n  bot: al dia\n== 2026-09-12 17:50 La Paz ==\n  bot: al dia\n';
  ok(publicadorSoloVigente(logSolo, new Date('2026-09-12T22:30:00Z')) === true, 'una corrida de hace 30 min es vigente');
  ok(publicadorSoloVigente(logSolo, new Date('2026-09-13T04:00:00Z')) === false, 'sin correr en 6 h, el publicador automatico no absuelve a nadie');
  ok(publicadorSoloVigente('', new Date('2026-09-12T22:30:00Z')) === null, 'sin log no se sabe si corre');
  ok(publicadorSoloVigente(logSolo, new Date('2026-09-12T21:55:00Z')) === true, 'la ultima corrida se lee en hora de La Paz (UTC-4), no como UTC');

  // ── El publicador que CORRE pero FALLA, del 2026-09-19 ──────────────────────────────────
  // `vigente` sólo pregunta CUÁNDO corrió, y un publicador que falla en todas sus corridas
  // escribe su cabecera igual cada 3 h: sigue leyéndose «vigente». Y los veredictos salían
  // del `--dry-run`, que nunca imprime `FALLO` —sólo `al dia`/`publicaria`/`NO publico solo`—,
  // así que las dos preguntas juntas absolvían para siempre a un destino que no publica nada.
  // No es hipotético: el bot pasó CUATRO días así (17 arreglos en `main`, única señal
  // `bot: FALLO` 8 veces por día en un log que no escala a nadie), y este log trae el
  // `landing: FALLO` del 18-sep 17:50. Y falla hacia el lado caro: el verde de acá es lo que
  // se usa para NO molestar a Sergio Urcullo, o sea que se calla el pedido que hacía falta.
  const secoOptimista = ['  bot: publicaria (nada toca precio)', '  landing: publicaria (nada toca precio)'].join('\n');
  const logQueFalla = [
    '== 2026-09-19 02:50 La Paz ==',
    '  bot: FALLO',
    '  landing: FALLO',
    '== 2026-09-19 05:50 La Paz ==',
    '  bot: FALLO',
    '  landing: PUBLICADO',
  ].join('\n');
  const ahoraLog = new Date('2026-09-19T10:30:00Z'); // 06:30 La Paz: la corrida de las 05:50 es vigente
  const vReal = _veredictosDesdeSalida(`${secoOptimista}\n${MARCA_LOG}\n${logQueFalla}`, ahoraLog, 'prueba-fallo');
  ok(
    seAutoPublicaSegun(vReal, 'bot') === false,
    'un destino cuya ULTIMA corrida real FALLO no se publica solo, por mas que el seco diga "publicaria"',
  );
  // El recíproco, que es lo que impide que esto quede rojo para siempre: el log es
  // append-only y nadie lo rota, así que lo que cura un `FALLO` viejo es un éxito POSTERIOR.
  ok(
    seAutoPublicaSegun(vReal, 'landing') === true,
    'y un FALLO ya curado por una corrida posterior NO deja al destino rojo para siempre',
  );

  // ── Los CUATRO `null` del publicador, del 2026-09-18 ────────────────────────────────────
  // Medido a las 04:34 La Paz: el publicador contestaba `plataforma: publicaria` y `bot:
  // publicaria`, su log no tenía corrida desde hacía 4,8 h, y este gate imprimió `NO MEDIDO`
  // por los dos bajo el motivo «no pude preguntarle» y SIN línea de causa. Dos pedidos de
  // deploy callados por un diagnóstico falso que además mandaba a mirar el lado equivocado.
  ok(describirPublicadorMudo({ vigente: true }) === null, 'un publicador vigente no tiene nada que explicar');
  const atrasado = describirPublicadorMudo({
    vigente: false,
    ultima: new Date('2026-09-18T03:50:00Z'),
    ahora: new Date('2026-09-18T08:38:00Z'),
  });
  ok(/4\.8 h/.test(String(atrasado)), `la causa CITA hace cuanto que no corre, o no sirve para decidir: ${atrasado}`);
  ok(/salteo su turno/.test(String(atrasado)), 'y dice QUE pasó, no solo que no se sabe');
  ok(
    !/no pude preguntar/.test(String(atrasado)),
    'y sobre todo NO dice que no se pudo preguntar: le preguntamos y contesto — esa es la mentira que se esta curando',
  );
  ok(
    /no dice cuando corrio/.test(String(describirPublicadorMudo({ vigente: null }))),
    'sin fecha en el log la causa es otra, y tambien se nombra',
  );
  // El desacuerdo: los dos contestaron y no coinciden. Es el más confuso de los cuatro.
  const desac = describirDesacuerdo('plataforma', 'AL_DIA');
  ok(/plataforma/.test(String(desac)) && /AL_DIA/.test(String(desac)), `el desacuerdo nombra al destino y al veredicto ajeno: ${desac}`);
  ok(describirDesacuerdo('plataforma', undefined) === null, 'sin veredicto ajeno no hay desacuerdo que contar');

  // LA COSTURA, que es la parte que de verdad se rompió: que el lector ANOTE. Reproduce el
  // caso vivo del 2026-09-18 — el publicador contesta perfecto y su log está atrasado.
  const secoVivo = ['== 2026-09-18 04:34 La Paz ==', '  plataforma: publicaria (nada toca precio)', '  bot: publicaria (nada toca precio)'].join('\n');
  const logViejo = '== 2026-09-17 23:50 La Paz ==\n  plataforma: al dia\n';
  const vAtrasado = _veredictosDesdeSalida(`${secoVivo}\n${MARCA_LOG}\n${logViejo}`, new Date('2026-09-18T08:38:00Z'), 'zz_pub_atrasado');
  ok(vAtrasado === null, 'un publicador atrasado no absuelve a nadie, por bien que conteste');
  ok(
    /no corre/.test(String(_causaParaPruebas('zz_pub_atrasado'))),
    'y DEJA la causa: sin esto el NO MEDIDO sale mudo y se diagnostica el lado equivocado',
  );
  // El hermano: corrió recién y contestó algo ilegible.
  const vIlegible = _veredictosDesdeSalida(
    `ya hay una corrida en curso; salgo\n${MARCA_LOG}\n== 2026-09-18 04:20 La Paz ==\n  bot: al dia\n`,
    new Date('2026-09-18T08:38:00Z'), 'zz_pub_ilegible',
  );
  ok(vIlegible === null, 'sin veredictos por destino no se absuelve a nadie');
  ok(
    /corrida en curso/.test(String(_causaParaPruebas('zz_pub_ilegible'))),
    'y la causa CITA lo que contesto, que es lo unico que permite reproducirlo',
  );
  // Y el camino feliz no inventa causa.
  const vSano = _veredictosDesdeSalida(
    `${secoVivo}\n${MARCA_LOG}\n== 2026-09-18 04:20 La Paz ==\n  bot: al dia\n`,
    new Date('2026-09-18T08:38:00Z'), 'zz_pub_sano',
  );
  ok(vSano && vSano.bot === 'SE_PUBLICA_SOLO', 'con el log fresco si se le cree al publicador');
  ok(_causaParaPruebas('zz_pub_sano') === null, 'y no deja causa colgada: no hubo problema que explicar');

  // El motivo que se imprime NO puede volver a afirmar que no se preguntó: tres de los
  // cuatro caminos sí preguntaron. Si alguien lo revierte, este caso lo caza.
  const noMedido = clasificarCobertura({
    destinos: ['landing'], pedidos: [], pendiente: () => true, seAutoPublica: () => null, describeLoQuePublica: nadieEstaCorto, ahora: AHORA,
  })[0];
  ok(
    !/no pude preguntarle/.test(noMedido.motivo),
    `el motivo no puede afirmar que no se pregunto: ${noMedido.motivo}`,
  );

  // El universo se deriva de la lista blanca, no se copia.
  ok(Object.keys(DESTINOS).length >= 3, 'la lista blanca tiene que traer los destinos');
  const sinDetector = Object.keys(DESTINOS).filter((d) => !DETECTORES[d]);
  ok(sinDetector.length === 0, `hay destinos sin detector y saldrian NO_MEDIDO: ${sinDetector.join(', ')}`);

  // Lectura de las salidas reales de los publicadores.
  ok(leerPendienteDelSeco('== hay que publicar: 3 arreglo(s) que el cliente no ve ==') === true, 'seco: 3 arreglos es pendiente');
  ok(leerPendienteDelSeco('== hay que publicar: 0 arreglo(s) ==') === false, 'seco: 0 arreglos no es pendiente');
  ok(leerPendienteDelSeco('YA ESTA PUBLICADO — produccion corre 2045ff1') === false, 'seco: ya publicado no es pendiente');
  ok(leerPendienteDelSeco('cualquier otra cosa') === null, 'seco: una salida que no dice nada es NO se sabe');
  ok(leerPendienteDelEspejo('ESPEJO DESINCRONIZADO — ...') === true, 'espejo: desincronizado es pendiente');
  ok(leerPendienteDelEspejo('ESPEJO OK') === false, 'espejo: ok no es pendiente');
  ok(leerPendienteDelEspejo('') === null, 'espejo: sin salida es NO se sabe');

  // El barrido del tablero es el del hermano, no una copia: si cambia allá, se ve acá.
  const b = barrerTablero({
    tareas: [
      { id: 't_a', status: 'blocked', body: 'DESPLEGAR: landing' },
      { id: 't_b', status: 'ready', body: 'sin nada' },
    ],
  });
  ok(b.pedidos.length === 1 && b.pedidos[0].destino === 'landing', 'el barrido compartido tiene que reconocer el pedido');
  ok(b.ilegibles.length === 0, 'sin fallos de lectura no puede haber ilegibles');
  // Un pedido RECLAMADO cuenta acá también: si no, este gate lo da por inexistente y manda a
  // abrir un pedido duplicado para un destino que ya tiene el suyo, en manos de alguien.
  ok(
    barrerTablero({ tareas: [{ id: 't_c', status: 'running', body: 'DESPLEGAR: bot' }] }).pedidos.length === 1,
    'un pedido running es un pedido vivo: el ok ejecuta sobre el',
  );
  // Y el tri-estado del parseo: un JSON truncado NO es un tablero sin pedidos.
  ok(barrerTableroJson('[{"id":"t_1","status":"rea') === null, 'un JSON truncado es NO MEDIDO');

  // ── La TERCERA causa de un `null`, del 2026-09-17 ─────────────────────────────────────
  // `CAUSAS` sólo se llenaba cuando el comando NO SE PUDO EJECUTAR. Pero un detector
  // devuelve `null` por dos motivos distintos, y el segundo no dejaba rastro: el comando
  // corrió, contestó, y el parser no supo leer la respuesta. Medido esa mañana: el bot salió
  // `NO MEDIDO ... — pedido t_64f64647` SIN línea de causa, y las dos corridas siguientes
  // del mismo detector dieron `OK`. Sin la salida guardada, el rojo es irreproducible y se
  // diagnostica corriendo el gate hasta que vuelva a fallar.
  ok(describirRespuestaIlegible('') === null, 'sin salida no hay nada que citar: eso ya lo explica el catch');
  ok(describirRespuestaIlegible(null) === null, 'un null de ejecucion no es una respuesta ilegible');
  const ileg = describirRespuestaIlegible('ssh: connect to host 187.77.16.63 port 22: Connection timed out');
  ok(/Connection timed out/.test(String(ileg)), 'la causa tiene que CITAR lo que contesto, o no sirve para reproducir');
  ok(/no se sabe leer/i.test(String(ileg)), 'y tiene que decir que el problema es de LECTURA, no de ejecucion');

  // La costura: que `detectar` ANOTE esa causa. Un caso sobre la función pura sola dejaría
  // pasar el cableado, que es justo la mitad que estuvo rota.
  const leerEspejo = (s) => leerPendienteDelEspejo(s);
  ok(
    detectar({ clave: 'zz_test_ok', guion: 'x', leer: leerEspejo, correr: () => 'ESPEJO OK' }) === false,
    'una respuesta que SI se entiende sigue devolviendo su valor',
  );
  ok(_causaParaPruebas('zz_test_ok') === null, 'y no deja causa: no hubo problema que explicar');
  ok(
    detectar({ clave: 'zz_test_ileg', guion: 'x', leer: leerEspejo, correr: () => 'ssh: Connection timed out' }) === null,
    'una respuesta ilegible sigue siendo NO se sabe',
  );
  ok(
    /Connection timed out/.test(String(_causaParaPruebas('zz_test_ileg'))),
    'pero ahora DEJA la causa: sin esto el NO MEDIDO sale mudo y es irreproducible',
  );
  // Y no pisa la causa del catch, que es más precisa (trae el código de salida).
  ok(
    detectar({ clave: 'zz_test_nulo', guion: 'x', leer: leerEspejo, correr: () => null }) === null,
    'si no se pudo ejecutar, sigue siendo null',
  );
  ok(_causaParaPruebas('zz_test_nulo') === null, 'y la causa la pone el catch, no el lector');

  // ── preparar el árbol de los detectores ─────────────────────────────────────────────
  // El bot se cegaba solo cada vez que el integrador pusheaba: el clon donde corren los
  // detectores quedaba atrás y `espejo-check.mjs` se negaba a concluir (con razón).
  ok(
    ponerElEspejoAlDia({ correr: () => 'AL_DIA' }).puesto === true,
    'si el fast-forward procede, el árbol quedó al día',
  );
  ok(
    ponerElEspejoAlDia({ correr: () => null }).puesto === false,
    'si no se pudo ejecutar, NO se declara al día',
  );
  const noProcede = ponerElEspejoAlDia({ correr: () => 'fatal: Not possible to fast-forward, aborting.' });
  ok(noProcede.puesto === false, 'un fast-forward que no procede deja el árbol como estaba');
  ok(
    /fast-forward no procedió/.test(noProcede.motivo || ''),
    'y lo dice, para que el NO MEDIDO del detector no salga mudo',
  );

  // ANTI-MUTACIÓN: el comando tiene que ser un fast-forward y nada más. Un `merge` pelado
  // acá crearía un commit de merge en el clon del VPS a espaldas de todos, y un `reset
  // --hard` le borraría trabajo local a quien lo tuviera. Sin este caso, cambiar la bandera
  // deja el archivo entero en verde.
  let pedido = '';
  ponerElEspejoAlDia({ correr: (guion) => { pedido = guion; return 'AL_DIA'; } });
  ok(/merge --ff-only/.test(pedido), 'el árbol se adelanta sólo por fast-forward');
  ok(!/reset|--hard|checkout|clean/.test(pedido), 'nunca se le tira trabajo local al clon');
  ok(/fetch origin/.test(pedido), 'y se fetchea antes, o el ff compararía contra un ref viejo');

  // CABLEADO: preparar y después medir. Si la llamada desaparece —o queda DESPUÉS de los
  // detectores— el defecto vuelve entero y ningún caso puro lo ve.
  const fuente = readFileSync(new URL(import.meta.url), 'utf8');
  const iPrepara = fuente.indexOf('const alDia = ponerElEspejoAlDia()');
  const iMide = fuente.indexOf('const filas = clasificarCobertura({');
  ok(iPrepara > 0, 'medirEnVivo prepara el árbol de los detectores');
  ok(iPrepara < iMide, 'y lo prepara ANTES de preguntarle a los detectores, no después');

  // CABLEADO de la quinta pregunta, por el mismo motivo: si el llamador vivo la contesta con
  // un `[]` fijo en vez de mirar la salida del detector, todos los casos de arriba siguen
  // verdes y el pedido corto vuelve a absolverse solo.
  ok(
    /describeLoQuePublica: \(d, delDestino\) => quintaPregunta\(d, delDestino, \{ salida: SALIDAS\.get\(d\) \}\)/.test(fuente),
    'medirEnVivo contesta la quinta pregunta con quintaPregunta y la salida cruda del detector',
  );
  // Y que esa salida cruda quede DISPONIBLE: sin ella `quintaPregunta` recibe `undefined` y
  // devuelve `null` para todos — mudo y en verde. El sujeto es el EFECTO, no la línea: con
  // un `/SALIDAS\.set\(/` sobre el fuente, envolverla en `if (false)` pasaba verde (probado).
  detectar({ clave: 'zz_quinta', guion: 'x', leer: leerPendienteDelSeco, correr: () => SECO7 });
  ok(_salidaParaPruebas('zz_quinta') === SECO7, 'detectar deja la salida CRUDA disponible para la quinta pregunta');
  ok(recuentoDeArreglos(_salidaParaPruebas('zz_quinta')) === 7, 'y de ahi sale el recuento con el que se juzga el cuerpo');

  console.log(fallos === 0 ? 'self-check OK' : `self-check con ${fallos} fallo(s)`);
  return fallos === 0 ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(process.argv.includes('--self-check') ? selfCheck() : medirEnVivo());
}
