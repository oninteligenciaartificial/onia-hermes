#!/usr/bin/env node
/**
 * pedido_deploy_entregado.mjs — un pedido de deploy cuyo trabajo YA se publicó no puede
 * seguir pidiéndole un `ok` a Sergio Urcullo.
 *
 *   node scripts/pedido_deploy_entregado.mjs              # medición viva
 *   node scripts/pedido_deploy_entregado.mjs --self-check # casos puros, sin red ni git
 *
 * ─────────────────────────────────────────────────────────────────────────────────────
 * NACE DEL 2026-09-06, y de haber pagado el MISMO fallo dos veces el mismo día.
 *
 * A las 14:44 lo aprendí sobre `t_0268567b` y arreglé la instancia. A las 19:30 el mismo
 * pedido volvía a estar vencido: producción había publicado a las 17:08 UTC y los TRECE
 * shas que el pedido prometía estaban adentro de `build-5fc8bcd`, con el pedido todavía
 * en `blocked`. Arreglar la instancia y no la clase es como esto no termina nunca.
 *
 * POR QUÉ NO LO VE NINGUNO DE LOS INSTRUMENTOS QUE YA EXISTEN, que es lo que lo hace caro:
 *
 *   - `deploy-vivo.mjs` (web-venta) cuenta commits sin desplegar. Mide la dirección
 *     contraria: si falta publicar. Acá sobra.
 *   - `bloqueos_vencidos.mjs` mide filas de una tabla en un DOC con verificador declarado.
 *     Un pedido del TABLERO no tiene fila ni verificador.
 *   - Las tres medidas canónicas del proyecto (mergeado / BUILD_ID vivo / símbolo en el
 *     build) dan **OK las tres** sobre un pedido vencido: el comando está sano y deriva el
 *     sha al ejecutarse. Justamente por eso nadie sospecha.
 *
 * Y el arreglo del 04-sep —que el comando DERIVE la ruta y el sha para que el pedido no
 * caduque— tapó el modo de falla ruidoso y dejó éste, que es mudo: el pedido queda prolijo,
 * ejecutable y pidiendo permiso por algo hecho. La firma es al revés de la conocida: no
 * «dice resuelto sobre lo pendiente», sino **«dice pendiente sobre lo resuelto»**.
 *
 * ─────────────────────────────────────────────────────────────────────────────────────
 * QUÉ MIDE. Los pedidos vivos del tablero (los que traen una línea `DESPLEGAR: <destino>`).
 * Junta los shas que el pedido promete —cuerpo y comentarios, que es donde se van sumando
 * los `DEPLOY PEDIDO <sha>`— y pregunta por cada uno si es ancestro del sha que corre
 * PRODUCCIÓN, no de `origin/master`. Esa distinción es el gate entero: contra `master` un
 * pedido vencido da «todo mergeado» y se lee como sano.
 *
 *   todos publicados  → ENTREGADO: es un ítem, hay que cerrarlo y rehacer con lo que falte.
 *   alguno sin publicar → VIGENTE: el pedido sirve, no se toca.
 *
 * FALLA CONSERVADOR, y la dirección importa. Si no puede resolver un sha, o no puede
 * derivar el build vivo, el pedido queda VIGENTE / NO_MEDIDO — nunca ENTREGADO. Cerrar un
 * pedido de menos cuesta una vuelta; cerrarlo de más le borra a Sergio Urcullo un pedido
 * real y el arreglo no llega al cliente.
 *
 * QUÉ DEJA AFUERA, dicho para que no se lea como «revisé todo». Hasta el 2026-09-08 esto
 * medía UN destino de tres y salía con código 0 igual: `landing` y `bot` caían en un
 * NO_MEDIDO silencioso, así que el modo de falla que este gate existe para cazar —el pedido
 * que pide un ok por trabajo hecho— era invisible en dos tercios de los pedidos vivos. Es la
 * misma firma que ya está medida en `deploy_sin_pedido.mjs`: **el hueco no está en lo que el
 * gate mira mal, está en el sujeto que no mira**, y un exit 0 lo tapa.
 *
 * Hoy:
 *   - `plataforma`: completo. Su artefacto nombra el sha (`/opt/onia-platform/build-<sha>`),
 *     así que se miden las DOS direcciones (sobre-describe y sub-describe).
 *   - `landing`: sirve desde `runtime-next/` **sin sha en el nombre**, pero el `BUILD_ID` sí
 *     tiene fecha, y con eso alcanza para la dirección cara: si TODO lo que el pedido promete
 *     es anterior al build vivo, está pidiendo un ok por trabajo hecho. Ver
 *     `publicadoPorFecha` — mide sólo eso; el sub-describe de landing sigue sin instrumento
 *     porque exige decidir qué commit VIAJA al navegador (`deploy-vivo.mjs llegaAlCliente`).
 *   - `bot`: se despliega por copia archivo-por-archivo y nada en `/opt/onia/bot` nombra un
 *     sha ni una fecha de origen. Sigue sin instrumento, y ahora se DICE en el veredicto en
 *     vez de esconderse en un exit 0.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
// El criterio de «esto lo ve un lead» se IMPORTA del instrumento que ya lo tiene y que el
// publicador de landing aplica. Reescribirlo acá sería una segunda copia del mismo juicio,
// que es como el gate termina midiendo algo distinto de lo que el destino hace.
import { llegaAlCliente } from '../web-factory/apps/onia-platform/scripts/deploy-vivo.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
/** La zona de `main` que arma el sitio de venta. Anclada con `:/` a propósito: un pathspec
 *  relativo se resuelve contra el CWD y devuelve CERO commits desde cualquier subcarpeta —
 *  un verde que no midió nada, ya cazado el 2026-09-04 en `deploy-vivo.mjs`. */
const ZONA_LANDING = ':/web-factory/apps/onia-platform';
const TABLERO = '/root/bin/onia-tablero.sh';
const REPO_PLATAFORMA = '/root/loops/onia-platform';
const DIR_BUILDS = '/opt/onia-platform';
/** El nodo de casa no tiene `/opt`, pero sí llega al VPS por SSH. Ver `shaVivoPlataforma`. */
const VPS = '/root/bin/onia-vps.sh';

/** Palabras que parecen sha pero no lo son: sin este corte el gate junta basura, la declara
 *  «no publicada» y deja VIGENTE a todo pedido para siempre (falla en verde). */
const NO_SON_SHA = new Set([
  'added', 'cadena', 'decidida', 'feedback', 'defecto', 'deploy', 'destino', 'archivo',
  'cliente', 'commits', 'produccion', 'plataforma', 'landing', 'blocked', 'arregla',
  'pedidos', 'decision', 'publica', 'publicar', 'primero', 'segundo', 'entrega',
]);

/**
 * Saca los shas de un texto libre. Con límites de palabra a propósito: `38bcf8a` no puede
 * matchear dentro de `38bcf8ab12`, o el gate da por publicado un commit que nadie publicó.
 *
 * ⚠️ Es el ayudante, NO el sujeto del gate. Ver `shasPrometidos`.
 */
export function shasDelTexto(texto) {
  const vistos = new Set();
  for (const m of String(texto).matchAll(/\b[0-9a-f]{7,40}\b/g)) {
    const s = m[0];
    if (NO_SON_SHA.has(s)) continue;
    if (!/[0-9]/.test(s)) continue; // una palabra de puras letras a-f no es un sha
    vistos.add(s);
  }
  return [...vistos];
}

/**
 * Los shas que el pedido PROMETE publicar. Sólo los declarados con la marca `DEPLOY PEDIDO
 * <sha>`, que es como este proyecto suma arreglos a un pedido que envejece.
 *
 * ⚠️ ESTO NO ES UN DETALLE DE PARSEO: es el gate entero, y su primera versión —que juntaba
 * todos los shas del texto— fallaba EN VERDE. Medido sobre `t_0268567b` el 2026-09-06: de
 * los 27 shas que aparecen en su hilo, tres NO eran promesas — `c81f431` es el HEAD de un
 * recuento, y `7149658` está nombrado bajo el título literal **«Lo que NO viaja»**. Con
 * ellos adentro el pedido daba VIGENTE estando entregado, y como basta UN sha ajeno para
 * eso, el gate no podía cazar su propio caso nunca. Un gate decorativo es peor que ninguno:
 * ocupa el lugar del que sí mide.
 *
 * Es la misma regla que `bloqueos_vencidos.mjs` ya escribió para los verificadores —«la
 * fila lo declara o no se mide»—, y por el mismo motivo: un documento nombra decenas de
 * cosas que parecen el sujeto y no lo son. Deducir el sujeto del texto libre es lo que
 * rompe a esta familia de gates.
 */
export function shasPrometidos(texto) {
  const vistos = new Set();
  for (const m of String(texto).matchAll(/DEPLOY PEDIDO\s+([0-9a-f]{7,40})\b/gi)) vistos.add(m[1]);
  // El cuerpo suele abrir con el rango que el pedido cubre: «Son 6 commits (545dd28..8b420b6)».
  // La punta derecha es la promesa; la izquierda es el punto de partida, ya publicado.
  for (const m of String(texto).matchAll(/\b[0-9a-f]{7,40}\.\.([0-9a-f]{7,40})\b/g)) vistos.add(m[1]);
  return [...vistos];
}

/**
 * PURA: barre la lista del tablero y separa los pedidos de deploy de lo que NO se pudo leer.
 * `leerCuerpo(id)` devuelve el texto de la tarea, o `null` si el `show` no contestó.
 *
 * ⚠️ LOS `ilegibles` SON LA MITAD DEL VALOR, y su ausencia es el bug que este barrido tenía.
 * La versión anterior hacía `if (!cuerpo) continue`: un `show` que fallaba se descartaba
 * EXACTAMENTE igual que una tarea sin línea `DESPLEGAR:`, así que el pedido desaparecía del
 * barrido y el gate seguía hablando como si hubiera mirado el tablero entero. Desde que el
 * integrador corre en el nodo de casa cada `show` es una llamada SSH —88 en un barrido—, o
 * sea que un timeout suelto alcanza.
 *
 * La dirección del daño importa: un barrido incompleto se ve IDÉNTICO a un tablero sin
 * pedidos, y de ahí sale la conclusión cara —«este destino no tiene pedido vivo»— que hace
 * abrir un pedido DUPLICADO. Ese duplicado es el ruido que hace que Sergio Urcullo deje de
 * creerle a los avisos. Medido a mano el 2026-09-07: un barrido leído a mitad de camino
 * reportó 2 pedidos de 3 y ocultó justo el de `plataforma`.
 */
export function barrerPedidos({ lista, leerCuerpo }) {
  const pedidos = [];
  const ilegibles = [];
  for (const linea of String(lista).split('\n')) {
    if (!/^[⊘▶◻]/.test(linea)) continue;
    const id = linea.trim().split(/\s+/)[1];
    if (!id) continue;
    const cuerpo = leerCuerpo(id);
    if (cuerpo === null || cuerpo === undefined) {
      ilegibles.push(id);
      continue;
    }
    const m = String(cuerpo).match(/^DESPLEGAR:\s*(\S+)/im);
    if (!m) continue;
    pedidos.push({ id, destino: m[1].toLowerCase(), texto: String(cuerpo) });
  }
  return { pedidos, ilegibles };
}

/**
 * PURA: cuál de los `build-<sha>` del disco es el que corre, casando su `BUILD_ID` contra el
 * que sirve el contenedor. Devuelve `null` si no hay con qué casar.
 *
 * Nunca «el más nuevo» ni «el primero»: elegir uno sin casarlo declararía ENTREGADO contra un
 * build inventado, y eso le borra a Sergio Urcullo un pedido real por un arreglo que el
 * cliente nunca recibió.
 */
export function buildQueCorre({ buildIdVivo, candidatos }) {
  if (!buildIdVivo) return null;
  for (const c of candidatos || []) {
    if (c && c.buildId && c.buildId === buildIdVivo) return c.sha;
  }
  return null;
}

/**
 * PURA: decide el estado de un pedido. `publicado(sha)` devuelve true / false / null,
 * donde null es «no se sabe» y arrastra a VIGENTE, nunca a ENTREGADO.
 */
export function clasificarPedido({ id, shas, publicado }) {
  if (!shas || shas.length === 0) {
    return { id, estado: 'NO_MEDIDO', motivo: 'el pedido no nombra un solo sha', sinPublicar: [], indeterminados: [] };
  }
  const sinPublicar = [];
  const indeterminados = [];
  for (const s of shas) {
    const r = publicado(s);
    if (r === true) continue;
    if (r === false) sinPublicar.push(s);
    else indeterminados.push(s);
  }
  const estado = sinPublicar.length === 0 && indeterminados.length === 0 ? 'ENTREGADO' : 'VIGENTE';
  return { id, estado, sinPublicar, indeterminados };
}

/**
 * PURA: ¿el commit ya estaba cuando se armó el build que corre? Es el `publicado(sha)` de los
 * destinos cuyo artefacto NO nombra su sha pero sí tiene fecha — hoy `landing`.
 *
 * Los dos instantes entran en EPOCH (segundos), nunca como texto: `stat` imprime
 * `2026-09-08 02:58:08.061721697 +0000` y `git log` puede dar otro formato, y comparar eso
 * como cadena —o parsearlo— es la familia de bugs de fecha que este proyecto ya pagó. Con
 * `stat -c %Y` y `git log --format=%ct` no hay nada que interpretar.
 *
 * 🔴 LA VENTANA ES EL PUNTO, no un detalle de tolerancia. La fecha del `BUILD_ID` es cuándo
 * TERMINÓ el build, y el build se armó de un commit ANTERIOR a eso. Un commit que cae en el
 * medio (entró mientras compilaba) parece anterior al artefacto y NO viajó en él. Sin la
 * ventana, ese caso devuelve `true` y `clasificarPedido` lo lee como ENTREGADO: cerraría un
 * pedido vivo y el arreglo no llegaría nunca al cliente. Dentro de la ventana devuelve `null`
 * —«no se sabe»—, que arrastra a VIGENTE. El error posible queda del lado barato: sostener un
 * pedido de más cuesta una vuelta; cerrarlo de menos le borra a Sergio Urcullo el pedido real.
 */
/**
 * PURA: ¿el commit ya está dentro del build que corre? Es el `publicado(sha)` de los destinos
 * cuyo artefacto SÍ nombra su sha — hoy `plataforma`.
 *
 * 🔴 POR QUÉ EXISTE, medido el 2026-09-10 en este carril: `git merge-base --is-ancestor A B`
 * sale con **1** cuando A no es ancestro de B, y con **128** cuando B **no existe en el repo**.
 * Envueltos en el mismo `catch`, los dos se aplanan a `false` = «no publicado» — y ese es el
 * veredicto INVERTIDO, no un «no sé». Ese día producción corría `eaa6703` y el clon de
 * `onia-platform` del nodo de casa estaba atrasado y no conocía ese sha: los SEIS arreglos del
 * pedido `t_c78d9fa8` salieron «sin publicar, 0 sin resolver» estando los seis **vivos** en
 * producción. O sea el gate sostuvo un pedido que le pedía a Sergio Urcullo un ok por trabajo
 * hecho, que es exactamente lo que el caso ENTREGADO existe para cazar: desde el nodo de casa
 * ese caso **no podía dispararse nunca**.
 *
 * Es la misma clase que ya está anotada para los gates que se mudan de máquina —pierden una
 * fuente y siguen concluyendo con las que quedan—, un escalón más abajo: acá no se calla, da
 * el veredicto contrario. Y se escondía porque la mitad hermana (`publicaria`, que hace
 * `git log vivo..origin/master`) falla por la MISMA causa y sí sale honesta con NO MEDIDO:
 * leído junto, el NO MEDIDO se lee como el ruido de ambiente y el VIGENTE falso pasa por bueno.
 *
 * `null` («no se sabe») arrastra a VIGENTE igual que antes, así que el error posible queda del
 * lado barato: sostener un pedido de más cuesta una vuelta, cerrarlo de menos le borra a Sergio
 * Urcullo un pedido real.
 */
export function publicadoEnBuild({ vivoExiste, esAncestro }) {
  if (vivoExiste !== true) return null;   // no conozco el build que corre: no se sabe
  if (esAncestro === true) return true;
  if (esAncestro === false) return false;
  return null;
}

export function publicadoPorFecha({ epochCommit, epochBuild, ventanaSegundos = 20 * 60 }) {
  if (!Number.isFinite(epochCommit) || !Number.isFinite(epochBuild)) return null;
  if (epochCommit >= epochBuild) return false;          // posterior al build: no viajó, seguro
  if (epochCommit >= epochBuild - ventanaSegundos) return null;  // pudo entrar compilando
  return true;
}

/**
 * PURA: la dirección INVERSA de `clasificarPedido`, y la que ningún gate del proyecto medía.
 *
 * `clasificarPedido` caza el pedido que SOBRE-describe: promete arreglos que ya se publicaron.
 * Éste caza el que SUB-describe: su `ok` publica commits que el pedido no le nombró a nadie.
 * Los dos modos conviven en la misma tarea y el peligroso es éste, porque **la parte muda es
 * justo la que se publica**: Sergio Urcullo aprueba código que el pedido nunca le mostró.
 *
 * 🔴 LO QUE LO HACE ESTRUCTURAL, medido el 2026-09-07 en esta misma vuelta: la brecha **la
 * abre el integrador**. El pedido `t_deddf471` decía a las 22:09 UTC «eec06d7 NO viaja con el
 * swap de HOY — está en `claude/chatbots-platform-review-0d1d09` y entra cuando el integrador
 * la mergee». Una hora después la mergeé, y esa frase quedó falsa: el `ok` pasó a publicar
 * SEIS arreglos donde el hilo nombraba cinco. No es un descuido de quien escribió el pedido —
 * es la consecuencia mecánica de que `main`/`master` avancen mientras el pedido espera, y
 * pasa en CADA vuelta de este carril.
 *
 * POR QUÉ NO LO VE NINGUNO DE LOS TRES INSTRUMENTOS QUE YA EXISTEN:
 *
 *   - `clasificarPedido` (acá arriba) mira sólo los shas que el pedido DECLARA. Un commit que
 *     el pedido no nombra no es sujeto suyo: no puede ponerse rojo por algo que no enumera.
 *   - `deploy_sin_pedido.mjs` pregunta si el destino TIENE pedido. Éste lo tiene, y vigente.
 *   - `deploy-vivo.mjs` cuenta cuántos arreglos faltan publicar, no si alguien los nombró.
 *
 * El sujeto por lo tanto NO son los shas del pedido —recorrer lo que hay es exactamente lo que
 * no puede ver al que falta—: es **lo que el `ok` publicaría**, derivado del build vivo contra
 * la rama base. Misma regla que ya arregló a `deploy_sin_pedido.mjs`: el universo se deriva.
 *
 * Dirección del daño al fallar: sin `publicaria` sale NO_MEDIDO, nunca COMPLETA. Declarar
 * completa una promesa que no se pudo comparar es la única salida que borra el problema.
 */
export function promesaCompleta({ shas, publicaria }) {
  if (!Array.isArray(publicaria)) {
    return { estado: 'NO_MEDIDO', motivo: 'no pude derivar que publicaria el ok', mudos: [] };
  }
  if (publicaria.length === 0) {
    return { estado: 'NO_MEDIDO', motivo: 'el ok no publicaria nada: lo mide clasificarPedido', mudos: [] };
  }
  // Los shas se comparan por PREFIJO en las dos direcciones: el tablero escribe 7 caracteres
  // y `git log` puede devolver 8 o más. Exigir igualdad los daría a todos por mudos.
  const nombrado = (sha) =>
    (shas || []).some((p) => sha.startsWith(p) || p.startsWith(sha));
  const mudos = publicaria.filter((c) => !nombrado(c.sha));
  return mudos.length === 0
    ? { estado: 'COMPLETA', mudos: [] }
    : { estado: 'SUB_DESCRIBE', mudos };
}

/**
 * PURA: parte el `show` de una tarea en su CUERPO y sus COMENTARIOS.
 *
 * POR QUÉ HACE FALTA SEPARARLOS. Los dos clasificadores de acá arriba reciben el `show`
 * entero, así que para ellos una promesa escrita en el cuerpo y una escrita en un comentario
 * de hoy valen lo mismo. Para Sergio Urcullo NO valen lo mismo: el TÍTULO es lo único que se
 * ve en la lista del tablero y el CUERPO es lo primero que lee, mientras que los comentarios
 * se apilan abajo — el de t_e51796c8 llevaba cuatro.
 *
 * Si el `show` no trae la marca, todo cuenta como cuerpo: eso deja al gate en su dirección
 * barata (sin comentarios que puedan tapar nada, `cuerpoVencido` nunca dice VENCIDO).
 */
export function partirPedido(texto) {
  const s = String(texto ?? '');
  const m = s.match(/^Comments \(\d+\):/m);
  if (!m) return { cuerpo: s, comentarios: '' };
  return { cuerpo: s.slice(0, m.index), comentarios: s.slice(m.index) };
}

/**
 * PURA: ¿el CUERPO del pedido describe trabajo que ya está publicado, mientras lo que su `ok`
 * publicaría de verdad vive sólo en un comentario?
 *
 * LA TERCERA PREGUNTA, y el 2026-09-10 no tenía dueño. `clasificarPedido` caza el pedido que
 * SOBRE-describe (promete lo ya publicado) y `promesaCompleta` el que SUB-describe (el ok
 * publica algo que nadie nombró). Las dos leen cuerpo y comentarios como un solo texto, así
 * que **los comentarios tapan al cuerpo**: basta que el comentario más nuevo nombre un sha
 * pendiente para que el pedido salga VIGENTE con su cuerpo entero vencido.
 *
 * Medido ese día sobre t_e51796c8: prometía f8d0fc2, e911638 y 7756295 en el cuerpo y los TRES
 * eran ancestros del build vivo (`build-335389f`); lo único que su ok publicaba era afa9da6,
 * nombrado en un comentario. `npm run pedido:entregado` dijo «sigue VIGENTE — 1 sin publicar»,
 * y tenía razón para SU pregunta. El costo es el de siempre: Sergio Urcullo aprueba leyendo un
 * título y un cuerpo que describen otra cosa que la que se publica.
 *
 * La salida NO es el comentario N+1 —ese método ya se agotó, y el `edit` del tablero no cambia
 * el cuerpo—: es rehacer el pedido con el cuerpo derivado del publicador en seco y archivar el
 * viejo en la misma vuelta.
 *
 * DIRECCIÓN DEL ERROR, elegida: ante cualquier duda NO se dice VENCIDO. Sin shas en el cuerpo
 * o con uno que no se pudo resolver sale NO_MEDIDO, porque un VENCIDO falso manda a rehacer —y
 * a archivar— un pedido sano, que es la única salida que le borra a Sergio un pedido real.
 *
 * @param {{texto:string, publicado:(sha:string)=>boolean|null}} args
 */
export function cuerpoVencido({ texto, publicado }) {
  const { cuerpo, comentarios } = partirPedido(texto);
  const delCuerpo = shasPrometidos(cuerpo);
  if (delCuerpo.length === 0) {
    return { estado: 'NO_MEDIDO', motivo: 'el cuerpo no promete ningun sha con su marca', mudos: [] };
  }
  const estados = delCuerpo.map((s) => ({ sha: s, pub: publicado(s) }));
  if (estados.some((e) => e.pub === null || e.pub === undefined)) {
    return { estado: 'NO_MEDIDO', motivo: 'un sha del cuerpo no se pudo resolver', mudos: [] };
  }
  if (estados.some((e) => !e.pub)) {
    return { estado: 'VIGENTE', motivo: 'el cuerpo todavia promete algo sin publicar', mudos: [] };
  }
  // El cuerpo entero ya está publicado. Sólo es VENCIDO si el `ok` todavía publicaría algo —y
  // eso, por construcción, vive en un comentario. Si tampoco hay nada ahí, el pedido está
  // cumplido y eso ya lo dice `clasificarPedido`: no se pisan.
  // Sin descontar los que el cuerpo ya nombra: a esta altura TODOS los del cuerpo están
  // publicados, así que `publicado(s) === false` no puede ser verdadero para ninguno de ellos
  // y el filtro extra sería una guarda que ninguna entrada puede romper. Se probó: mutarla no
  // ponía en rojo un solo caso, que es la firma de una guarda decorativa.
  const mudos = shasPrometidos(comentarios).filter((s) => publicado(s) === false);
  return mudos.length === 0
    ? { estado: 'ENTREGADO', motivo: 'el cuerpo esta publicado y no queda nada pendiente', mudos: [] }
    : { estado: 'VENCIDO', mudos };
}

/**
 * PURA: ¿el CUERPO del pedido nombra todo lo que su `ok` publica, o quedó corto?
 *
 * LA FAMILIA SIMÉTRICA DE `cuerpoVencido`, y estaba abierta. Esa caza el cuerpo que
 * SOBRE-describe (habla de trabajo ya publicado); ésta caza el que SUB-describe. Las dos
 * preguntas ya existían para el pedido ENTERO (`clasificarPedido` y `promesaCompleta`), pero
 * las dos leen cuerpo y comentarios como UN texto, así que **los comentarios tapan al cuerpo**
 * en las dos direcciones — y sólo una de las dos tenía su versión sobre el cuerpo solo.
 *
 * Medido el 2026-09-11 sobre t_5511da55: su cuerpo describía DOS arreglos, medidos contra
 * `master 42ed1e2`, y para entonces master era `18b1feb` con 6 commits más — el `ok` publicaba
 * SIETE. Los cinco que faltaban estaban nombrados en comentarios, así que `promesaCompleta`
 * decía «0 sin resolver» con razón para su pregunta, y `cuerpoVencido` salía NO_MEDIDO porque
 * el cuerpo describe en prosa y no lleva la marca. Nadie podía decir que el cuerpo quedó corto.
 * El costo es el de siempre y es el peor de la familia: Sergio Urcullo aprueba leyendo un
 * cuerpo que describe DOS cosas, y su `ok` publica SIETE que nunca le mostraron.
 *
 * POR QUÉ EL SUJETO ES `shasDelTexto` Y NO `shasPrometidos`. La pregunta no es «¿qué promete
 * el cuerpo con su marca?» sino «¿lo MENCIONÓ en algún lado del cuerpo?» — Sergio Urcullo lee
 * el texto, no la marca, y un cuerpo que nombra el sha en prosa ya se lo mostró. Mismo criterio
 * que el cableado de `promesaCompleta` en `main`, y por el mismo motivo: acá perdonar de más
 * sólo calla un rojo, mientras que un rojo falso hace rehacer un pedido sano.
 *
 * Hereda las guardas de `promesaCompleta`: sin poder derivar qué publica sale NO_MEDIDO, nunca
 * COMPLETA, y los shas se casan por prefijo en las dos direcciones.
 *
 * @param {{texto:string, publicaria:{sha:string,titulo:string}[]|null}} args
 */
export function cuerpoCorto({ texto, publicaria }) {
  const { cuerpo } = partirPedido(texto);
  return promesaCompleta({ shas: shasDelTexto(cuerpo), publicaria });
}

/**
 * De todo lo que `main` tiene sin publicar, ¿qué puede cambiar algo que el cliente VE?
 *
 * POR QUÉ EXISTE. `promesaCompleta` necesita el universo de «lo que el ok publicaría», y para
 * `plataforma` ese universo es directo: todo commit posterior al build vivo. Para `landing` no,
 * porque su zona (`web-factory/apps/onia-platform`) mezcla el sitio con SUS PROPIAS
 * herramientas —gates, scripts, tests— que no viajan al navegador. Contarlas obligaría a
 * nombrarlas en el pedido, y un pedido lleno de commits que no cambian nada es exactamente el
 * ruido que hace que Sergio Urcullo deje de leerlos.
 *
 * El filtro NO se reescribe acá: es `llegaAlCliente` de `deploy-vivo.mjs`, el mismo que ya usa
 * el publicador para decir «2 arreglos» donde `git log` crudo dice 3. Dos copias del criterio
 * es como nace el gate que mide una cosa distinta de la que el destino aplica.
 *
 * Dirección del error, heredada de ese archivo y a propósito: ante la duda el commit VIAJA
 * (lista de exclusión, no de inclusión), así que se puede pedir nombrar de más —barato— y
 * nunca callar un arreglo real. `null` entra y `null` sale: sin datos no se decide nada.
 *
 * @param {Array<{sha:string,titulo:string,archivos?:string[]}>|null} commits
 */
export function soloLosQueViajan(commits) {
  if (!Array.isArray(commits)) return null;
  return commits.filter((c) => llegaAlCliente(c.archivos));
}

// ── destinos que despliegan por COPIA DE ARCHIVOS (hoy: siat) ──────────────────────────

/**
 * PURA: de la salida del publicador en seco de un destino que copia archivos, ¿qué
 * publicaría su `ok`?
 *
 * POR QUÉ EXISTE. Hasta el 2026-09-11 este gate daba por sentado que un deploy se
 * identifica por SHA (`plataforma`, `/opt/onia-platform/build-<sha>`) o por FECHA de build
 * (`landing`), y todo destino que no fuera `plataforma` ni `landing` caía en `sinCubrir`
 * con «su artefacto no nombra sha ni fecha». `siat` es de una tercera especie: se publica
 * copiando archivos del repo a `/opt/onia-siat/emisor`, así que no hay build, no hay sha y
 * no hay fecha que comparar — y por eso su pedido podía derivar a «su ok publica lo que
 * nadie leyó» sin que nada se pusiera rojo.
 *
 * El invariante NO cambia (el cuerpo describe lo que su `ok` publica): cambia el artefacto
 * contra el que se mide. El universo NO se reescribe acá — lo imprime el propio publicador,
 * que es el mismo programa que hace el deploy. Reescribir su criterio en JS sería la
 * segunda copia del juicio, que es como nace el gate que mide algo distinto de lo que el
 * destino aplica.
 *
 * TRI-ESTADO, y es el punto entero: `null` = no pude leer, `[]` = al día, lista = lo que
 * publicaría. Confundir `[]` con `null` es lo que vuelve un NO MEDIDO en un falso verde, así
 * que cualquier salida que no traiga una de las DOS marcas conocidas sale `null` en vez de
 * adivinar — si el publicador cambia su formato, este gate se calla, no miente.
 *
 * @param {string|null} salida  stdout del publicador corrido con `--dry-run`
 * @returns {string[]|null}
 */
export function archivosDelDryRun(salida) {
  const s = String(salida ?? '');
  if (!s.trim()) return null;
  // «al día» es una respuesta REAL y tiene su propia marca: sin ella, un dry-run que no
  // lista nada sería indistinguible de uno que no se pudo leer.
  if (/^YA ESTA PUBLICADO/m.test(s)) return [];
  const lineas = s.split('\n');
  const i = lineas.findIndex((l) => /^Cambia:\s*$/.test(l));
  if (i === -1) return null;
  const archivos = [];
  for (const l of lineas.slice(i + 1)) {
    if (!l.trim()) break; // el publicador cierra la lista con una línea vacía
    archivos.push(l.trim());
  }
  // «Cambia:» con la lista vacía no es «al día» —para eso está la marca de arriba—: es un
  // formato que no entiendo, y adivinar acá sería declarar al día lo que no medí.
  return archivos.length > 0 ? archivos : null;
}

/**
 * PURA: ¿el texto nombra todos los ARCHIVOS que su `ok` publica?
 *
 * La gemela de `promesaCompleta` para los destinos que se publican por copia. Mismas dos
 * guardas y por los mismos motivos: sin poder derivar qué publica sale NO_MEDIDO (nunca
 * COMPLETA — declarar completa una promesa que no se pudo comparar es la única salida que
 * borra el problema), y con `[]` también, porque «el ok no publicaría nada» es la pregunta
 * de otro caso (ENTREGADO), no de éste.
 *
 * QUÉ CUENTA COMO NOMBRAR, y por qué así. Vale la RUTA (`test/fase1-runner.test.mjs`) o el
 * NOMBRE del archivo (`fase1-runner.test.mjs`); NO vale describirlo en prosa («el archivo de
 * pruebas»). Es la misma vara que el gate ya usa con los shas —donde «arreglé la cita» no
 * cuenta y `54c987a` sí—, y por el mismo motivo: sin un identificador literal nadie puede
 * verificar que lo descrito sea lo publicado, y el día que el publicador arrastre OTRO
 * archivo de pruebas la misma frase lo seguiría dando por cubierto. Eso es exactamente la
 * lista de inclusión que falla abierto.
 *
 * Aceptar el basename además de la ruta es deliberado y va en la dirección barata, igual
 * que casar shas por prefijo: el pedido puede escribir la ruta del repo y el publicador la
 * suya, y perdonar de más sólo calla un rojo, mientras que un rojo falso hace rehacer —y
 * archivar— un pedido sano, que es la única salida que le borra a Sergio Urcullo un pedido
 * real.
 *
 * @param {{texto:string, publicaria:string[]|null}} args
 */
export function archivosNombrados({ texto, publicaria }) {
  if (!Array.isArray(publicaria)) {
    return { estado: 'NO_MEDIDO', motivo: 'no pude derivar que archivos publicaria el ok', mudos: [] };
  }
  if (publicaria.length === 0) {
    return { estado: 'NO_MEDIDO', motivo: 'el ok no publicaria nada: lo mide el caso ENTREGADO', mudos: [] };
  }
  const t = String(texto ?? '');
  const nombrado = (ruta) => {
    if (t.includes(ruta)) return true;
    const base = String(ruta).split('/').pop();
    return Boolean(base) && t.includes(base);
  };
  const mudos = publicaria.filter((r) => !nombrado(r));
  return mudos.length === 0
    ? { estado: 'COMPLETA', mudos: [] }
    : { estado: 'SUB_DESCRIBE', mudos };
}

/**
 * PURA: ¿el CUERPO del pedido nombra todos los archivos que su `ok` publica?
 *
 * La misma relación que `cuerpoCorto` tiene con `promesaCompleta`, y por el mismo motivo: el
 * cuerpo es lo que Sergio Urcullo lee para decidir, y los comentarios se apilan abajo y lo
 * tapan. Un recuento comentado deja satisfecha a la pregunta del texto entero y el cuerpo
 * puede seguir describiendo menos de lo que su `ok` publica.
 *
 * @param {{texto:string, publicaria:string[]|null}} args
 */
export function cuerpoCortoArchivos({ texto, publicaria }) {
  return archivosNombrados({ texto: partirPedido(texto).cuerpo, publicaria });
}

// ── medición viva ──────────────────────────────────────────────────────────────────────

function sh(cmd, args, opts = {}) {
  try {
    return execFileSync(cmd, args, { encoding: 'utf8', timeout: 30_000, stdio: ['ignore', 'pipe', 'ignore'], ...opts }).trim();
  } catch {
    return null;
  }
}

/**
 * El sha que corre producción, derivado del artefacto — nunca de `origin/master`.
 *
 * ⚠️ SE MIDE DONDE ESTÁ `/opt`, NO DONDE CORRE EL LOOP. El integrador se mudó al nodo de
 * casa, donde `/opt/onia-platform` no existe: `readdirSync` tiraba, esto devolvía `null` y
 * el ÚNICO destino que este gate sabe medir salía «no pude derivar el build vivo» en cada
 * vuelta. No fallaba en verde —el motivo se imprime— pero el efecto es el mismo que ya está
 * medido para `deploy-vivo.mjs`: el instrumento que caza un pedido vencido queda mudo
 * justo en la máquina del carril que lo posee. El nodo de casa SÍ llega al VPS por SSH.
 */
function shaVivoPlataforma() {
  if (existsSync(DIR_BUILDS)) {
    const buildId = sh('docker', ['exec', 'onia-platform', 'cat', '/app/.next/BUILD_ID']);
    let dirs = [];
    try {
      dirs = readdirSync(DIR_BUILDS).filter((d) => d.startsWith('build-'));
    } catch {
      return null;
    }
    const candidatos = dirs.map((d) => {
      const p = `${DIR_BUILDS}/${d}/.next/standalone/.next/BUILD_ID`;
      return { sha: d.slice('build-'.length), buildId: existsSync(p) ? sh('cat', [p]) : null };
    });
    return buildQueCorre({ buildIdVivo: buildId, candidatos });
  }

  // Sin `/opt` local: se le pregunta al VPS. Una sola llamada, y su salida se valida —si el
  // SSH no contesta o devuelve cualquier otra cosa, esto es `null` (NO MEDIDO), nunca un sha
  // adivinado que haría cerrar un pedido vivo.
  if (!existsSync(VPS)) return null;
  const guion = [
    'V=$(docker exec onia-platform cat /app/.next/BUILD_ID 2>/dev/null) || exit 1',
    '[ -n "$V" ] || exit 1',
    `for d in ${DIR_BUILDS}/build-*/; do`,
    '  [ "$(cat "$d/.next/standalone/.next/BUILD_ID" 2>/dev/null)" = "$V" ] && { basename "$d" | sed s/^build-//; exit 0; }',
    'done',
    'exit 1',
  ].join('\n');
  const salida = sh('bash', [VPS, 'bash', '-lc', guion], { timeout: 120_000 });
  return salida && /^[0-9a-f]{7,40}$/.test(salida) ? salida : null;
}

/**
 * Cuándo terminó de armarse el build que sirve `onia.com.bo`, en epoch. Local si hay `/opt`,
 * por SSH desde el nodo de casa si no — misma degradación que `shaVivoPlataforma`, y por el
 * mismo motivo: el instrumento no puede quedar mudo justo en la máquina donde corre el carril
 * que lo posee. Cualquier salida que no sea un entero es `null` (NO MEDIDO), nunca una fecha
 * adivinada: con una fecha inventada el gate cerraría pedidos vivos.
 */
function epochBuildLanding() {
  const ruta = '/opt/onia-landing/runtime-next/apps/onia-platform/.next/BUILD_ID';
  const crudo = existsSync(ruta)
    ? sh('stat', ['-c', '%Y', ruta])
    : existsSync(VPS)
      ? sh('ssh', ['-o', 'BatchMode=yes', '-o', 'ConnectTimeout=20', 'root@187.77.16.63', `stat -c %Y ${ruta}`], { timeout: 120_000 })
      : null;
  return crudo && /^\d+$/.test(crudo.trim()) ? Number(crudo.trim()) : null;
}

/**
 * Lo que el `ok` de un pedido de `landing` publicaría de verdad: los commits de la zona del
 * sitio posteriores al build vivo, ya filtrados por si le cambian algo al lead.
 *
 * Se lee en UNA sola llamada con separadores de control (RS entre commits, US entre campos)
 * para no pagar un `git show` por commit. `--no-merges` no es cosmético: `git log --name-only`
 * NO lista los archivos de un merge, así que un merge llegaría con `archivos: []` y —por la
 * regla de «ausencia de dato = viaja»— se contaría como arreglo, inflando el pedido con los
 * merges del propio integrador. Ya pasó: 7 de 43 commits, medido el 2026-09-06.
 *
 * @returns {Array<{sha:string,titulo:string,archivos:string[]}>|null} `null` si no se pudo medir.
 */
function publicariaLanding(epochBuild) {
  if (typeof epochBuild !== 'number') return null;
  const RS = '\x1e';
  const salida = sh('git', [
    '-C', RAIZ, 'log', '--no-merges', '--name-only',
    `--format=${RS}%h%x1f%ct%x1f%s`, 'origin/main', '--', ZONA_LANDING,
  ]);
  if (salida === null) return null;
  return salida
    .split(RS)
    .filter((b) => b.trim())
    .map((bloque) => {
      const [cabecera, ...archivos] = bloque.split('\n');
      const [sha, ct, ...resto] = cabecera.split('\x1f');
      return { sha, ct: Number(ct), titulo: resto.join('\x1f'), archivos: archivos.filter(Boolean) };
    })
    // Posteriores al build: los mismos que `deploy-vivo.mjs` llama «varados». Sin ventana de
    // gracia acá a propósito — la de `publicadoPorFecha` existe para no CERRAR un pedido vivo;
    // acá el error barato es pedir que se nombre uno de más.
    .filter((c) => Number.isFinite(c.ct) && c.ct > epochBuild);
}

/** Fecha de un commit de `onia-hermes` en epoch, o `null` si el sha no resuelve. */
function epochCommitHermes(sha) {
  const crudo = sh('git', ['-C', RAIZ, 'log', '-1', '--format=%ct', sha]);
  return crudo && /^\d+$/.test(crudo.trim()) ? Number(crudo.trim()) : null;
}

/** El publicador en seco de un destino que copia archivos. Ruta en el VPS, fija por destino. */
const SECO_SIAT = '/opt/onia-siat/_deploy/publicar.sh';

/**
 * Corre un publicador en seco y devuelve su stdout, del disco local o del VPS. `null` = no
 * pude preguntar.
 *
 * POR QUÉ LAS DOS VÍAS. Este gate corre hoy desde el nodo de casa, donde `/opt` NO existe: un
 * lector que sólo mire el disco local devuelve vacío siempre y el destino queda sin medir sin
 * que nada se ponga rojo — es la misma degradación muda que ya dejó ciegos a otros tres gates
 * vivos al mudarse de máquina. Se pregunta al disco y, si no está, por SSH.
 *
 * Las dos vías se inyectan para poder validar por mutación sin salir a la red, y el `null` es
 * el punto entero: `''` se leería como «el publicador no dijo nada», que es una respuesta, y
 * acá la verdad es «no llegué a preguntar».
 */
export function secoDeProduccion(ruta, { local = secoLocal, remoto = secoPorSsh } = {}) {
  const enDisco = local(ruta);
  if (enDisco !== null && enDisco !== undefined) return enDisco;
  const enVps = remoto(ruta);
  if (enVps !== null && enVps !== undefined) return enVps;
  return null;
}

function secoLocal(ruta) {
  if (!existsSync(ruta)) return null;
  return sh('bash', [ruta, '--dry-run'], { timeout: 180_000 });
}

/** Por el MISMO shim que ya usa `shaVivoPlataforma`: un segundo camino al VPS es una segunda
 *  respuesta posible a «a qué máquina le pregunto». */
function secoPorSsh(ruta, shim = VPS) {
  if (!existsSync(shim)) return null;
  return sh('bash', [shim, 'bash', '-lc', `bash ${ruta} --dry-run`], { timeout: 180_000 });
}

/**
 * Lo que el `ok` de un pedido de `siat` publicaría: la lista de archivos que su propio
 * publicador en seco enumera. `null` = no se pudo medir, `[]` = ya está al día.
 */
function publicariaSiat(io = {}) {
  return archivosDelDryRun(secoDeProduccion(SECO_SIAT, io));
}

/**
 * Los pedidos vivos del tablero. Devuelve `null` si NO se pudo leer la lista, y el barrido
 * con sus `ilegibles` si se pudo — ver `barrerPedidos`: un `show` que no contesta se NOMBRA,
 * no se descarta.
 */
function pedidosVivos() {
  const lista = sh('bash', [TABLERO, 'list'], { timeout: 180_000 });
  if (lista === null) return null;
  return barrerPedidos({
    lista,
    leerCuerpo: (id) => sh('bash', [TABLERO, 'show', id], { timeout: 60_000 }),
  });
}

async function medirEnVivo() {
  const barrido = pedidosVivos();
  if (barrido === null) {
    console.log('NO MEDIDO: no pude leer el tablero (' + TABLERO + ')');
    return 2;
  }
  const { pedidos, ilegibles } = barrido;

  // Un barrido incompleto NO puede concluir nada, ni siquiera «no hay pedidos»: las dos cosas
  // se ven igual. Se dice cuántas tareas quedaron sin leer y con cuáles.
  if (ilegibles.length > 0) {
    console.log(`NO MEDIDO: ${ilegibles.length} tarea(s) abiertas no contestaron el show — ${ilegibles.join(', ')}`);
    console.log('  El barrido quedo incompleto: puede haber un pedido de deploy que no vi.');
    return 2;
  }

  if (pedidos.length === 0) {
    console.log('OK: no hay pedidos de deploy vivos.');
    return 0;
  }

  const vivo = shaVivoPlataforma();
  const puedePlataforma = Boolean(vivo) && existsSync(REPO_PLATAFORMA);
  const esPublicado = (sha) => {
    try {
      execFileSync('git', ['-C', REPO_PLATAFORMA, 'cat-file', '-e', `${sha}^{commit}`], { stdio: 'ignore', timeout: 15_000 });
    } catch {
      return null; // el sha no existe en este repo: no se sabe
    }
    // El build que corre tiene que existir EN ESTE repo antes de comparar contra él: si no,
    // `merge-base --is-ancestor` sale 128 y el catch lo leería como «no es ancestro».
    let vivoExiste = false;
    try {
      execFileSync('git', ['-C', REPO_PLATAFORMA, 'cat-file', '-e', `${vivo}^{commit}`], { stdio: 'ignore', timeout: 15_000 });
      vivoExiste = true;
    } catch {
      vivoExiste = false;
    }
    let esAncestro = null;
    if (vivoExiste) {
      try {
        execFileSync('git', ['-C', REPO_PLATAFORMA, 'merge-base', '--is-ancestor', sha, vivo], { stdio: 'ignore', timeout: 15_000 });
        esAncestro = true;
      } catch {
        esAncestro = false;
      }
    }
    return publicadoEnBuild({ vivoExiste, esAncestro });
  };

  // Lo que el `ok` publicaría HOY, derivado: del build vivo a la rama base, sin merges (un
  // merge no es un arreglo). Es el universo del que sale `promesaCompleta`, y por eso NO se
  // arma con los shas del pedido: recorrer lo que el pedido enumera no puede ver al que falta.
  const publicariaPlataforma = (() => {
    if (!puedePlataforma) return null;
    const salida = sh('git', ['-C', REPO_PLATAFORMA, 'log', '--no-merges', '--format=%h\t%s', `${vivo}..origin/master`]);
    if (salida === null) return null;
    return salida
      .split('\n')
      .filter(Boolean)
      .map((l) => {
        const [sha, ...resto] = l.split('\t');
        return { sha, titulo: resto.join('\t') };
      });
  })();

  const entregados = [];
  const incompletos = [];
  const vencidos = [];
  const cortos = [];
  const noMedidos = [];
  // `noMedidos` y `sinCubrir` NO son lo mismo, y mezclarlos fue el bug: el primero es
  // transitorio (el SSH no contestó, el sha no resuelve) y se cura solo en la vuelta
  // siguiente; el segundo es un AGUJERO del gate, que no se cura nunca y hay que escribirle
  // instrumento. Impresos juntos, el segundo se lee como ruido de ambiente y sobrevive.
  const sinCubrir = [];
  // Los de `siat` van aparte porque su veredicto se dice con ARCHIVOS, no con shas: meterlos
  // en las mismas listas obligaría a que el reporte adivine de qué especie es cada entrada.
  const entregadosSiat = [];
  const cortosSiat = [];
  // `landing` no nombra su sha, pero su artefacto tiene FECHA: alcanza para la dirección cara
  // (¿pide un ok por trabajo hecho?). Se deriva UNA vez, no por pedido: si el SSH no contesta
  // queda `null` y todos los pedidos de landing salen NO MEDIDO con su motivo.
  const buildLanding = pedidos.some((p) => p.destino === 'landing') ? epochBuildLanding() : null;

  for (const p of pedidos) {
    if (p.destino === 'landing') {
      if (buildLanding === null) {
        noMedidos.push(`${p.id} (landing): no pude leer la fecha del build vivo (¿SSH al VPS?)`);
        continue;
      }
      const r = clasificarPedido({
        id: p.id,
        shas: shasPrometidos(p.texto),
        publicado: (s) => publicadoPorFecha({ epochCommit: epochCommitHermes(s), epochBuild: buildLanding }),
      });
      if (r.estado === 'ENTREGADO') entregados.push(r);
      else if (r.estado === 'NO_MEDIDO') noMedidos.push(`${p.id} (landing): ${r.motivo}`);
      else {
        console.log(`OK ${p.id} (landing): sigue VIGENTE — ${r.sinPublicar.length} sin publicar, ${r.indeterminados.length} sin resolver`);
        // Vigente no alcanza, igual que en plataforma: un pedido puede estar vigente Y
        // sub-describir lo que su `ok` publica — y ésa es la dirección cara, porque lo que
        // se publica sin nombrar es justo lo que Sergio Urcullo no leyó. El universo se
        // DERIVA (commits de la zona posteriores al build, los que le llegan al lead), nunca
        // de los shas del pedido: recorrer lo que el pedido enumera no puede ver al que falta.
        const c = promesaCompleta({
          shas: shasDelTexto(p.texto),
          publicaria: soloLosQueViajan(publicariaLanding(buildLanding)),
        });
        if (c.estado === 'SUB_DESCRIBE') incompletos.push({ id: p.id, mudos: c.mudos });
        else if (c.estado === 'NO_MEDIDO') noMedidos.push(`${p.id} (landing, promesa completa): ${c.motivo}`);
      }
      continue;
    }
    if (p.destino === 'siat') {
      // `siat` no se identifica por sha ni por fecha: se publica copiando archivos, así que su
      // universo son los ARCHIVOS que su propio publicador en seco enumera. Mismo invariante
      // que los otros dos destinos (el cuerpo describe lo que su ok publica), otro artefacto.
      const publicaria = publicariaSiat();
      if (publicaria === null) {
        noMedidos.push(`${p.id} (siat): no pude correr el publicador en seco (¿SSH al VPS?)`);
        continue;
      }
      if (publicaria.length === 0) {
        // La dirección cara, la misma que `clasificarPedido` caza en los otros destinos: el
        // pedido sigue bloqueado pidiendo un ok por trabajo que ya está publicado.
        entregadosSiat.push(p.id);
        continue;
      }
      console.log(`OK ${p.id} (siat): sigue VIGENTE — ${publicaria.length} archivo(s) sin publicar`);
      // El cuerpo, no el texto entero: los comentarios se apilan abajo y lo tapan. Es la misma
      // pregunta que `cuerpoCorto` le hace a `plataforma`.
      const k = cuerpoCortoArchivos({ texto: p.texto, publicaria });
      if (k.estado === 'SUB_DESCRIBE') {
        cortosSiat.push({ id: p.id, mudos: k.mudos });
      } else if (k.estado === 'NO_MEDIDO') {
        noMedidos.push(`${p.id} (siat, cuerpo completo): ${k.motivo}`);
      }
      continue;
    }
    if (p.destino !== 'plataforma') {
      sinCubrir.push(`${p.id} (${p.destino}): su artefacto no nombra sha ni fecha — sin instrumento`);
      continue;
    }
    if (!puedePlataforma) {
      noMedidos.push(`${p.id} (plataforma): no pude derivar el build vivo ni el repo`);
      continue;
    }
    const r = clasificarPedido({ id: p.id, shas: shasPrometidos(p.texto), publicado: esPublicado });
    if (r.estado === 'ENTREGADO') entregados.push(r);
    else if (r.estado === 'NO_MEDIDO') noMedidos.push(`${p.id} (plataforma): ${r.motivo}`);
    else {
      console.log(`OK ${p.id} (plataforma): sigue VIGENTE — ${r.sinPublicar.length} sin publicar, ${r.indeterminados.length} sin resolver`);
      // Vigente no alcanza: un pedido puede estar vigente Y sub-describir lo que publica.
      // OJO: acá va `shasDelTexto` (TODOS los shas del cuerpo y los comentarios), no
      // `shasPrometidos` (sólo los de la marca `DEPLOY PEDIDO`). Son dos preguntas distintas
      // y por eso el sujeto cambia: `clasificarPedido` pregunta «¿qué PROMETE?» —y ahí un sha
      // suelto del texto lo daría por vencido en falso, que fue el bug del 2026-09-06—;
      // ésta pregunta «¿lo MENCIONÓ en algún lado?», y Sergio Urcullo lee el texto, no la
      // marca. Un recuento derivado en un comentario nombra los shas en prosa y cuenta.
      // La dirección del error también manda: acá perdonar de más sólo calla un rojo, y un
      // rojo falso haría comentar el pedido otra vez — el ruido que lo vuelve ilegible.
      const c = promesaCompleta({ shas: shasDelTexto(p.texto), publicaria: publicariaPlataforma });
      if (c.estado === 'SUB_DESCRIBE') incompletos.push({ id: p.id, mudos: c.mudos });
      else if (c.estado === 'NO_MEDIDO') noMedidos.push(`${p.id} (plataforma, promesa completa): ${c.motivo}`);
      // Y la tercera pregunta, que hasta el 2026-09-10 no tenia dueno: las dos de arriba leen
      // cuerpo y comentarios como UN texto, asi que los comentarios TAPAN al cuerpo. Un pedido
      // puede estar vigente, nombrar todo lo que publica, y aun asi tener el cuerpo entero
      // vencido — que es lo que Sergio Urcullo lee para decidir.
      const v = cuerpoVencido({ texto: p.texto, publicado: esPublicado });
      if (v.estado === 'VENCIDO') vencidos.push({ id: p.id, mudos: v.mudos });
      else if (v.estado === 'NO_MEDIDO') noMedidos.push(`${p.id} (plataforma, cuerpo vigente): ${v.motivo}`);

      // Y la simétrica de esa, que hasta el 2026-09-11 tampoco tenía dueño: el cuerpo puede
      // quedar CORTO. `promesaCompleta` ya pregunta esto para el pedido entero, y por eso un
      // comentario con el recuento derivado la deja satisfecha — pero el cuerpo es lo que él
      // lee para decidir. Ver `cuerpoCorto`.
      const k = cuerpoCorto({ texto: p.texto, publicaria: publicariaPlataforma });
      if (k.estado === 'SUB_DESCRIBE') cortos.push({ id: p.id, mudos: k.mudos });
      else if (k.estado === 'NO_MEDIDO') noMedidos.push(`${p.id} (plataforma, cuerpo completo): ${k.motivo}`);
    }
  }

  for (const n of noMedidos) console.log(`NO MEDIDO ${n}`);
  for (const s of sinCubrir) console.log(`SIN INSTRUMENTO ${s}`);

  if (entregados.length > 0) {
    for (const e of entregados) {
      console.log(`\nROJO ${e.id}: TODO lo que promete ya esta publicado (produccion corre ${vivo}).`);
      console.log('  Le esta pidiendo un ok a Sergio Urcullo por trabajo hecho. Cerralo con su');
      console.log('  evidencia y, si quedo algo sin publicar despues, hace un pedido NUEVO: el');
      console.log('  cuerpo del viejo no lo describe, y el cuerpo es lo unico que el lee.');
    }
    return 1;
  }

  if (entregadosSiat.length > 0) {
    for (const id of entregadosSiat) {
      console.log(`\nROJO ${id}: su publicador en seco dice que YA ESTA PUBLICADO.`);
      console.log('  Le esta pidiendo un ok a Sergio Urcullo por trabajo hecho. Cerralo con su');
      console.log('  evidencia y, si quedo algo sin publicar despues, hace un pedido NUEVO: el');
      console.log('  cuerpo del viejo no lo describe, y el cuerpo es lo unico que el lee.');
    }
    return 1;
  }

  if (cortosSiat.length > 0) {
    for (const c of cortosSiat) {
      console.log(`\nROJO ${c.id}: su CUERPO no nombra ${c.mudos.length} archivo(s) que su ok publica.`);
      for (const m of c.mudos) console.log(`    ${m}`);
      console.log('  El cuerpo es lo unico que Sergio Urcullo lee para decidir, y hoy describe');
      console.log('  menos de lo que su ok publica. Nombralos comentando el recuento DERIVADO de');
      console.log('  `bash /opt/onia-siat/_deploy/publicar.sh --dry-run`; si ya se comento y el');
      console.log('  cuerpo sigue corto, rehace el pedido y ARCHIVA el viejo en la misma vuelta');
      console.log('  (el `edit` del tablero no cambia el cuerpo).');
    }
    return 1;
  }

  if (incompletos.length > 0) {
    for (const i of incompletos) {
      console.log(`\nROJO ${i.id}: su ok publica ${i.mudos.length} arreglo(s) que el pedido NO nombra.`);
      for (const m of i.mudos) console.log(`    ${m.sha}  ${m.titulo}`);
      console.log('  El cuerpo es lo unico que Sergio Urcullo lee: hoy aprobaria codigo que nadie');
      console.log('  le mostro. Comenta el recuento DERIVADO (no rehagas la tarea: el comando ya');
      console.log('  deriva el sha al ejecutarse y no caduca).');
    }
    return 1;
  }

  if (vencidos.length > 0) {
    for (const v of vencidos) {
      console.log(`\nROJO ${v.id}: su CUERPO esta entero publicado (produccion corre ${vivo}).`);
      console.log(`  Lo unico que su ok publica de verdad vive en un comentario: ${v.mudos.join(', ')}.`);
      console.log('  El titulo es lo unico que se ve en la lista y el cuerpo lo primero que lee:');
      console.log('  hoy los dos describen trabajo hecho. El comentario N+1 no lo arregla y el');
      console.log('  `edit` del tablero no cambia el cuerpo: rehace el pedido con el cuerpo');
      console.log('  derivado de `publicar.sh --dry-run` y ARCHIVA el viejo en la misma vuelta.');
    }
    return 1;
  }

  if (cortos.length > 0) {
    for (const c of cortos) {
      console.log(`\nROJO ${c.id}: su CUERPO no nombra ${c.mudos.length} arreglo(s) que su ok publica.`);
      for (const m of c.mudos) console.log(`    ${m.sha}  ${m.titulo}`);
      console.log('  Los comentarios pueden nombrarlos —por eso el pedido sale VIGENTE y completo—');
      console.log('  pero el cuerpo es lo que Sergio Urcullo lee para decidir, y hoy describe menos');
      console.log('  de lo que su ok publica. Comenta el recuento DERIVADO de `publicar.sh --dry-run`;');
      console.log('  si ya se comento y el cuerpo sigue quedando corto, rehace el pedido y ARCHIVA');
      console.log('  el viejo en la misma vuelta (el `edit` del tablero no cambia el cuerpo).');
    }
    return 1;
  }

  // 2 = NO MEDIDO, y sólo cuando NINGÚN pedido se pudo juzgar. Un solo veredicto real vale
  // más que la queja: con exit 2 el carril sabe que el gate no vio nada, y con 0 que sí.
  return noMedidos.length + sinCubrir.length === pedidos.length ? 2 : 0;
}

// ── self-check: los mismos casos que el .test.mjs, para poder correrlo suelto ───────────

function selfCheck() {
  const casos = [
    ['todo publicado -> ENTREGADO',
      clasificarPedido({ id: 'a', shas: ['1111111', '2222222'], publicado: () => true }).estado === 'ENTREGADO'],
    ['el caso que YA cumple: algo sin publicar -> VIGENTE',
      clasificarPedido({ id: 'b', shas: ['1111111', '2222222'], publicado: (s) => s === '1111111' }).estado === 'VIGENTE'],
    ['sin shas -> NO_MEDIDO (no se cierra por vacio)',
      clasificarPedido({ id: 'c', shas: [], publicado: () => true }).estado === 'NO_MEDIDO'],
    ['un sha irresoluble deja VIGENTE',
      clasificarPedido({ id: 'd', shas: ['1111111'], publicado: () => null }).estado === 'VIGENTE'],
    ['el sha se lee con limites', !shasDelTexto('38bcf8ab12cafe').includes('38bcf8a')],
    ['no confunde palabras con shas', shasDelTexto('deploy cadena decidida').length === 0],

    // ── la direccion inversa: el pedido SUB-describe lo que su ok publica ──────────────
    ['el ok publica un arreglo que el pedido no nombra -> SUB_DESCRIBE',
      promesaCompleta({
        shas: ['1111111'],
        publicaria: [{ sha: '1111111', titulo: 'nombrado' }, { sha: '9999999', titulo: 'mudo' }],
      }).estado === 'SUB_DESCRIBE'],
    // ⚠️ Se lee con `.map(...).join()` y NO con `.mudos[0].titulo`: sobre una lista vacia el
    // indexado lanza, y como los casos se evaluan al ARMAR el array, un throw mata el
    // self-check entero antes de imprimir una sola linea — `grep -c FAIL` devuelve 0 y la
    // mutacion se lee como «el gate aguanta». Medido: con el detector siempre-vacio esta
    // misma tanda dio «0 casos en rojo» estando los tres rotos.
    ['y lo NOMBRA, que es lo unico accionable',
      promesaCompleta({
        shas: ['1111111'],
        publicaria: [{ sha: '1111111', titulo: 'nombrado' }, { sha: '9999999', titulo: 'mudo' }],
      }).mudos.map((m) => m.titulo).join(',') === 'mudo'],
    // El caso que YA cumple. Sin el, romper la comparacion pasa igual: todo daria rojo y el
    // gate parece vivo. Es el que caza la mutacion «marcar mudo a todo».
    ['el caso que YA cumple: nombra todo lo que publica -> COMPLETA',
      promesaCompleta({
        shas: ['1111111', '2222222'],
        publicaria: [{ sha: '1111111', titulo: 'a' }, { sha: '2222222', titulo: 'b' }],
      }).estado === 'COMPLETA'],
    // El tablero escribe 7 caracteres y `git log` puede devolver mas. Exigir igualdad daria
    // TODOS los commits por mudos y llenaria de rojos falsos un pedido bien escrito.
    ['el sha corto del pedido casa con el largo de git log',
      promesaCompleta({ shas: ['1111111'], publicaria: [{ sha: '1111111abc', titulo: 'a' }] }).estado === 'COMPLETA'],
    ['sin poder derivar que publica -> NO_MEDIDO, nunca COMPLETA',
      promesaCompleta({ shas: ['1111111'], publicaria: null }).estado === 'NO_MEDIDO'],

    // ── landing: el destino sin sha en el artefacto, que se mide por FECHA ─────────────
    // El caso que YA cumple. Sin él, romper la comparación (devolver siempre null) pasaría
    // igual: todo quedaría VIGENTE y el gate parecería vivo sin poder cerrar nada nunca.
    // 🔴 El caso que faltaba y que dejó pasar un pedido CUMPLIDO el 2026-09-10: si el repo
    // local no conoce el sha del build vivo, `merge-base --is-ancestor` sale 128 y antes se
    // leía como «no es ancestro» = sin publicar. Es el veredicto INVERTIDO: sostiene un pedido
    // que le pide un ok a Sergio Urcullo por trabajo hecho.
    ['plataforma: si el repo NO conoce el build vivo es INDETERMINADO, nunca sin publicar',
      publicadoEnBuild({ vivoExiste: false, esAncestro: false }) === null],
    ['plataforma: sin saber si el build vivo existe tampoco se decide',
      publicadoEnBuild({ vivoExiste: null, esAncestro: true }) === null],
    // Los dos de anclaje: sin ellos, devolver `null` siempre pasaría los casos de arriba.
    ['plataforma: con el build vivo conocido, ancestro -> publicado',
      publicadoEnBuild({ vivoExiste: true, esAncestro: true }) === true],
    ['plataforma: con el build vivo conocido, NO ancestro -> sin publicar',
      publicadoEnBuild({ vivoExiste: true, esAncestro: false }) === false],
    ['landing: un commit muy anterior al build ya viajo -> publicado',
      publicadoPorFecha({ epochCommit: 1000, epochBuild: 100_000 }) === true],
    ['landing: un commit POSTERIOR al build no viajo -> sin publicar',
      publicadoPorFecha({ epochCommit: 100_001, epochBuild: 100_000 }) === false],
    // Éste es el que protege el error caro: dentro de la ventana el build ya estaba
    // compilando, así que el commit pudo NO viajar. Sin él, un commit de hace 5 minutos se
    // daría por publicado y el pedido se cerraría estando vivo.
    ['landing: un commit dentro de la ventana del build es INDETERMINADO, no publicado',
      publicadoPorFecha({ epochCommit: 100_000 - 300, epochBuild: 100_000 }) === null],
    ['landing: sin fecha de build no se decide nada',
      publicadoPorFecha({ epochCommit: 1000, epochBuild: null }) === null],
    ['landing: sin fecha de commit tampoco',
      publicadoPorFecha({ epochCommit: null, epochBuild: 100_000 }) === null],
    // El indeterminado tiene que ARRASTRAR: si `clasificarPedido` lo tratara como publicado,
    // los tres casos de arriba serían decorativos.
    ['landing: un indeterminado deja el pedido VIGENTE, nunca ENTREGADO',
      clasificarPedido({
        id: 'l', shas: ['1111111', '2222222'],
        publicado: (s) => (s === '1111111' ? true : publicadoPorFecha({ epochCommit: 99_900, epochBuild: 100_000 })),
      }).estado === 'VIGENTE'],
    ['un pedido que no nombra NADA y publica algo -> SUB_DESCRIBE',
      promesaCompleta({ shas: [], publicaria: [{ sha: '1111111', titulo: 'a' }] }).estado === 'SUB_DESCRIBE'],

    // ── landing: QUÉ entra en el universo de «lo que el ok publicaría» ────────────────
    // Sin este filtro, el pedido de landing tendría que nombrar sus propios gates y scripts,
    // que no cambian un pixel de lo que ve un lead: un pedido ilegible es un pedido que no
    // se lee. El criterio NO se reescribe acá, se importa del publicador.
    ['landing: un commit que solo toca un gate NO entra en lo que el ok publica',
      (soloLosQueViajan([
        { sha: '1111111', titulo: 'copy', archivos: ['web-factory/apps/onia-platform/src/app/page.tsx'] },
        { sha: '9999999', titulo: 'gate', archivos: ['web-factory/apps/onia-platform/src/app/x.test.ts'] },
      ]) || []).map((c) => c.sha).join() === '1111111'],
    // El caso que YA cumple. Sin él, un filtro que devuelva SIEMPRE vacío pasa el de arriba
    // por el motivo equivocado: el pedido saldría COMPLETA para siempre y el gate, mudo.
    ['landing: el caso que YA cumple: un arreglo de copy SI entra',
      (soloLosQueViajan([
        { sha: '1111111', titulo: 'copy', archivos: ['web-factory/apps/onia-platform/src/lib/pricing.ts'] },
      ]) || []).length === 1],
    // Ausencia de dato NO es «no viaja»: `git log --name-only` pudo no contestar. Misma
    // regla que separa `[]` de `null` en el resto del archivo.
    ['landing: un commit sin lista de archivos se cuenta como que viaja',
      (soloLosQueViajan([{ sha: '1111111', titulo: 'sin datos' }]) || []).length === 1],
    ['landing: sin commits medidos no se inventa un universo vacio',
      soloLosQueViajan(null) === null],
  ];
  let malos = 0;
  for (const [nombre, ok] of casos) {
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${nombre}`);
    if (!ok) malos++;
  }
  return malos === 0 ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const code = process.argv.includes('--self-check') ? selfCheck() : await medirEnVivo();
  process.exit(code);
}
