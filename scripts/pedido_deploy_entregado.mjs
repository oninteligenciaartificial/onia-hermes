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
 *   - `bot` y `siat`: se despliegan por copia archivo-por-archivo, así que no hay sha ni
 *     fecha que comparar — pero su publicador en seco ENUMERA lo que copiaría, y con eso se
 *     miden las dos direcciones (ya publicado / el cuerpo queda corto). Ver
 *     `DESTINOS_POR_COPIA`.
 *
 * Desde el 2026-09-12 no queda ningún destino del `ok` sin instrumento, y eso lo exige un
 * gate que DERIVA el universo de la lista blanca del ejecutor (`publicar-aprobado.mjs
 * DESTINOS`) en vez de enumerarlo a mano: el día que entre un quinto destino, el rojo sale
 * acá y no en un pedido que nadie pudo juzgar.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
// El criterio de «esto lo ve un lead» se IMPORTA del instrumento que ya lo tiene y que el
// publicador de landing aplica. Reescribirlo acá sería una segunda copia del mismo juicio,
// que es como el gate termina midiendo algo distinto de lo que el destino hace.
import { baseDelBuild, llegaAlCliente } from '../web-factory/apps/onia-platform/scripts/deploy-vivo.mjs';
// El BRAZO que ejecuta el `ok`. Se importa su decisión —pura, con guarda `import.meta.url`—
// en vez de reimplementarla: dos derivaciones de «qué hace el ok» se contradicen el día que
// una cambia, y este gate existe justamente para que el cuerpo y el botón digan lo mismo.
// Y por el mismo motivo, QUÉ tareas siguen vivas. `motivoParaNoEjecutar` es la función con la
// que el brazo decide si el `ok` de Sergio Urcullo ejecuta algo: preguntarle a ELLA es lo único
// que garantiza que «pedido vivo» signifique acá lo mismo que allá.
import { elegirCamino, motivoParaNoEjecutar } from './kanban/publicar-aprobado.mjs';

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
 * ¿Sigue viva esta tarea? Se lo pregunto al BRAZO, no a una lista propia.
 *
 * 🔴 ACÁ VIVÍA UNA LISTA DE INCLUSIÓN ESCRITA A MANO, y falló abierto igual que todas.
 * Era `/^[⊘▶◻]/` sobre los SÍMBOLOS que imprime `list`: blocked, ready y todo. Medido el
 * 2026-09-13 cruzando `list` contra `list --json` sobre el tablero real, los símbolos son
 * CINCO y el ejecutor declara SIETE estados vivos (`ESTADOS_VIVOS`): faltaban `running`
 * —que imprime `●`—, `triage`, `review` y `scheduled`.
 *
 * O sea que un pedido de deploy RECLAMADO era invisible para este gate mientras su `ok`
 * seguía ejecutando perfectamente. Las dos direcciones del daño, en el mismo agujero:
 *   · no sale en `pedidos` → «este destino no tiene pedido vivo» → se abre un DUPLICADO;
 *   · no sale en `abiertos` → `cuerpoPunteroMuerto` acusa de muerto a un puntero VIVO.
 *
 * La cabecera de este archivo ya prometía derivar el universo de la lista blanca del
 * ejecutor; en este punto no lo hacía. Ahora sí, y por la misma función que decide el `ok`:
 * un estado nuevo en el tablero lo heredan los dos a la vez o ninguno.
 */
export function tareaAbierta(status) {
  return motivoParaNoEjecutar(status) === null;
}

/**
 * PURA: separa los pedidos de deploy de las tareas del tablero, y NOMBRA lo que no se pudo
 * leer. `tareas` es lo que devuelve `list --json`: objetos con `id`, `status` y `body`.
 *
 * ⚠️ LOS `ilegibles` SON LA MITAD DEL VALOR, y su ausencia es el bug que este barrido tenía.
 * La versión anterior hacía `if (!cuerpo) continue`: un cuerpo que fallaba se descartaba
 * EXACTAMENTE igual que una tarea sin línea `DESPLEGAR:`, así que el pedido desaparecía del
 * barrido y el gate seguía hablando como si hubiera mirado el tablero entero.
 *
 * La dirección del daño importa: un barrido incompleto se ve IDÉNTICO a un tablero sin
 * pedidos, y de ahí sale la conclusión cara —«este destino no tiene pedido vivo»— que hace
 * abrir un pedido DUPLICADO. Ese duplicado es el ruido que hace que Sergio Urcullo deje de
 * creerle a los avisos. Medido a mano el 2026-09-07: un barrido leído a mitad de camino
 * reportó 2 pedidos de 3 y ocultó justo el de `plataforma`.
 *
 * Un `status` que no se pudo leer cae en `ilegibles` Y en `abiertos`: no sé si está viva, y
 * las dos salidas conservadoras son no callar el pedido y no acusar al puntero.
 */
/**
 * PURA: cuándo nació la tarea, en segundos epoch, o `null` si no se puede saber.
 *
 * `null` no es un adorno del tri-estado: quien lo consume decide con él si un pedido
 * ENVEJECIÓ, y una fecha inventada (hoy, 0, el epoch) declararía viejo a un pedido de hace
 * cinco minutos o fresco a uno de la semana pasada. Las dos direcciones cuestan: una manda
 * a escalar de más, la otra calla trabajo que no llega al cliente.
 */
export function creadoEnSegundos(tarea) {
  const crudo = tarea?.created_at ?? tarea?.createdAt;
  if (typeof crudo === 'number' && Number.isFinite(crudo)) return crudo;
  if (typeof crudo === 'string' && /^\d+$/.test(crudo.trim())) return Number(crudo.trim());
  if (typeof crudo === 'string' && crudo.trim() !== '') {
    const t = Date.parse(crudo);
    return Number.isFinite(t) ? Math.floor(t / 1000) : null;
  }
  return null;
}

export function barrerTablero({ tareas }) {
  const pedidos = [];
  const ilegibles = [];
  const abiertos = new Set();
  for (const t of Array.isArray(tareas) ? tareas : []) {
    const id = typeof t?.id === 'string' ? t.id.trim() : '';
    if (!id) continue;
    const estado = typeof t?.status === 'string' ? t.status.trim() : '';
    if (estado === '') {
      abiertos.add(id);
      ilegibles.push(id);
      continue;
    }
    if (!tareaAbierta(estado)) continue;
    abiertos.add(id);
    const cuerpo = t?.body;
    if (typeof cuerpo !== 'string') {
      ilegibles.push(id);
      continue;
    }
    const m = cuerpo.match(/^DESPLEGAR:\s*(\S+)/im);
    if (!m) continue;
    pedidos.push({ id, destino: m[1].toLowerCase(), texto: cuerpo, creado: creadoEnSegundos(t) });
  }
  return { pedidos, ilegibles, abiertos };
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
    // `causa` y no sólo `motivo`: el reporte tiene que poder separar este caso —el pedido
    // está mal escrito, y se arregla con un comentario— de los otros NO_MEDIDO, que son
    // AMBIENTALES (no pude fetchear, no pude derivar el build vivo). Distinguirlos comparando
    // la prosa del motivo ata el control a una cadena que cualquiera reescribe sin saberlo.
    return {
      id,
      estado: 'NO_MEDIDO',
      causa: 'SIN_DECLARAR',
      motivo: 'el pedido no nombra un solo sha',
      sinPublicar: [],
      indeterminados: [],
    };
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
 * PURA: los pedidos que NO SE PUEDEN JUZGAR porque no declaran ni un sha con su marca.
 *
 * Medido el 2026-09-12 sobre los pedidos vivos: `t_bd62e5a0` (plataforma) y `t_fd5b30c4`
 * (landing) nombraban su sha en PROSA —«1) 4bff903 - la escalera de precios NUEVA»— y salían
 * `NO MEDIDO` con el gate en código 0. O sea que el modo de falla que este archivo existe
 * para cazar —pedirle un `ok` a Sergio Urcullo por trabajo ya publicado— era inalcanzable en
 * la mitad de los pedidos vivos, en silencio.
 *
 * ⚠️ La cura NO es aflojar `shasPrometidos` para que adivine el sha de la prosa: deducir el
 * sujeto del texto libre es lo que rompió a este gate el 2026-09-06 y está medido arriba. La
 * cura es que un pedido inmedible sea un ROJO accionable — declararlo cuesta un comentario.
 */
export function inmediblesSinDeclarar({ resultados }) {
  return (resultados || []).filter((r) => r && r.causa === 'SIN_DECLARAR').map((r) => r.id);
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
    // …y también la cierra cualquier línea SIN SANGRÍA. El publicador sangra cada archivo con
    // tres espacios y arranca sus mensajes en la columna 0 (`ERR: hay una corrida de Fase 1 EN
    // CURSO…`), así que la sangría es lo que distingue un archivo de una frase. Sin esta
    // segunda salida, el día que el publicador no deje la línea en blanco de por medio, el
    // gate cuenta su mensaje de error como un archivo más y le exige al pedido que lo nombre.
    // Apareció en el fixture de un ERR real, no en teoría.
    if (!/^\s/.test(l)) break;
    archivos.push(l.trim());
  }
  // «Cambia:» con la lista vacía no es «al día» —para eso está la marca de arriba—: es un
  // formato que no entiendo, y adivinar acá sería declarar al día lo que no medí.
  return archivos.length > 0 ? archivos : null;
}

/**
 * PURA: lo mismo que `archivosDelDryRun`, para el OTRO publicador por copia — el del bot.
 *
 * POR QUÉ HAY DOS LECTORES Y NO UNO. El invariante es el mismo (el cuerpo describe lo que
 * su `ok` publica) y el artefacto es de la misma especie (copia de archivos), pero el
 * FORMATO lo imprime cada publicador y no coinciden: `siat` cierra con `Cambia:` + lista,
 * y el bot escribe una línea `NUEVO`/`CAMBIA` por archivo y la cierra con su propio
 * recuento. Reescribir uno para que se parezca al otro sería tocar el programa que hace el
 * deploy para que le quede cómodo a su medidor; y un lector solo que acepte las dos formas
 * es el que, el día que una cambie, sigue entendiendo la otra y declara «al día» lo que no
 * midió. Dos lectores, cada uno atado al literal de SU publicador.
 *
 * POR QUÉ EXISTE AHORA. Hasta el 2026-09-12 `bot` era el último destino en `sinCubrir`:
 * el gate imprimía «su artefacto no nombra sha ni fecha — sin instrumento» y seguía. Cierto
 * y a la vez irrelevante — el bot tampoco necesita sha: su publicador ya deriva y ENUMERA
 * lo que copiaría, igual que el de `siat`. Con el pedido `t_e45a24ff` vivo pidiendo publicar
 * precios que el bot le está diciendo mal a leads reales, el único destino que no se podía
 * juzgar era justo el que estaba mintiendo en producción.
 *
 * EL RECUENTO DEL PROPIO PUBLICADOR ES LA GUARDA. `deploy-bot.sh` imprime `total: N
 * archivo(s)` derivado del MISMO arreglo con el que escribió las líneas de arriba: si lo que
 * parseo no da N, lo que cambió es el formato y el lector se calla (`null`) en vez de
 * devolver una lista corta, que es la forma en que este lector fallaría EN VERDE — una lista
 * a la que le falta un archivo declara «el cuerpo lo nombra todo» sobre algo que nadie leyó.
 *
 * TRI-ESTADO igual que su gemelo: `null` = no pude leer · `[]` = al día · lista = lo que
 * publicaría.
 *
 * @param {string|null} salida  stdout de `/opt/onia/bot/_deploy/publicar.sh --dry-run`
 * @returns {string[]|null}
 */
export function archivosDelDryRunBot(salida) {
  const s = String(salida ?? '');
  if (!s.trim()) return null;
  // «al día» es una respuesta REAL y tiene su propia marca, y es la línea con la que
  // `deploy-bot.sh` corta antes de imprimir ningún recuento.
  if (/^\s*\(nada que desplegar/m.test(s)) return [];
  const archivos = [];
  for (const l of s.split('\n')) {
    const m = /^\s+(?:NUEVO|CAMBIA)\s+(\S+)/.exec(l);
    if (m) archivos.push(m[1]);
  }
  const t = /^\s*total:\s*(\d+)\s+archivo/m.exec(s);
  if (t === null) return null;
  if (Number(t[1]) !== archivos.length) return null;
  // `total: 0` no lo imprime nunca (el publicador sale antes, por la marca de arriba), así
  // que una lista vacía acá es un formato que no entiendo — no «al día».
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

/**
 * PURA: ¿el CUERPO manda a apretar un `ok` sobre una tarea que ya no existe?
 *
 * 🔴 EL DEFECTO, medido el 2026-09-12 sobre `t_fd5b30c4` (la landing). Su cuerpo cierra con
 * «Orden: ok t_bd62e5a0 (el sistema) -> ... -> ok de este (la web)», y `t_bd62e5a0` está
 * ARCHIVADA desde esa madrugada: el pedido vivo de plataforma pasó a ser `t_8a8a4e94` cuando
 * se rehízo. O sea que el texto le da a Sergio Urcullo una instrucción que no ejecuta nada
 * (el brazo tiene lista blanca de estados vivos y sale 3 sobre una archivada), y encima se la
 * da como PRERREQUISITO: aprieta, no pasa nada, y queda esperando a que «el sistema» se
 * publique para recién soltar la web. Los dos deploys quedan trabados por un puntero.
 *
 * Es la familia que esta memoria ya nombró —«los IDs de tarea y punteros en colas/handoffs
 * caducan en ambas direcciones: el pedido vivo se DERIVA, nunca se copia»—, y ningún control
 * de este archivo la podía ver: todos preguntan por shas o por archivos, y éste es el único
 * dato del cuerpo que apunta a OTRA tarea.
 *
 * EL SUJETO ES LA INSTRUCCIÓN TECLEABLE, no la mención. `ok <id>` es literalmente lo que
 * Sergio Urcullo escribe, así que un cuerpo que quiera mandarlo a apretar algo lo escribe
 * así. Citar un id sin `ok` es historia y NO se acusa — el mismo `t_fd5b30c4` dice «REEMPLAZA
 * a t_33406907 (archivado)», que es cierto, útil y no le pide nada a nadie. Preguntar PARA
 * QUÉ se cita el id, en vez de CÓMO está escrito, es lo que evita la lista de verbos que
 * falla abierta en el sinónimo siguiente.
 *
 * DIRECCIÓN DEL ERROR: ante cualquier duda NO se acusa. Con la lista vacía —un `list` que no
 * contestó, o truncado— TODO id se vería muerto y el gate mandaría a rehacer pedidos sanos,
 * que es el daño caro de este control.
 *
 * @param {{texto:string, idPropio:string, idsVivos:Set<string>|null}} args
 */
/**
 * PURA: ¿el `ok` de este pedido EJECUTA el deploy que su cuerpo promete?
 *
 * Todos los controles de acá arriba miden qué DESCRIBE el cuerpo. Ninguno preguntaba lo
 * otro —si el brazo, leyendo ese mismo cuerpo, va a desplegar algo—, y por eso el
 * 2026-09-12 un pedido de la plataforma salió VIGENTE y completo mientras su `ok` moría
 * con «la linea PUBLICAR: no trae cuenta, imagenes, texto» sin publicar nada.
 *
 * La causa está curada en el brazo (`elegirCamino`: una cita del recuento ya no le gana a
 * una orden `DESPLEGAR:`), pero curar la instancia no cierra la clase: el cuerpo lo escribe
 * un LLM y el brazo tiene más formas de no ejecutar que las que uno puede enumerar. Por eso
 * esto no busca el defecto conocido —no grepea «publicar:»— sino que le PREGUNTA AL BRAZO,
 * con la misma función que corre cuando Sergio Urcullo aprieta el botón. Un modo de falla
 * nuevo nace cazado.
 *
 * `elegir` se inyecta para poder probar el control sin el brazo; el default es el brazo real,
 * que es puro (decide, no publica).
 */
export function cuerpoNoEjecuta({ texto, elegir = elegirCamino }) {
  const { cuerpo } = partirPedido(texto);
  // Sujeto: sólo los pedidos que PIDEN un deploy. Uno de piezas no promete desplegar nada.
  if (!/^DESPLEGAR:/im.test(String(cuerpo))) return { estado: 'SIN_ORDEN' };
  let camino;
  try {
    camino = elegir(cuerpo);
  } catch (e) {
    return { estado: 'NO_EJECUTA', motivo: `el brazo se cae leyendo el cuerpo: ${e?.message || e}` };
  }
  if (camino?.modo === 'deploy') return { estado: 'DESPLIEGA', destino: camino.deploy.destino };
  return {
    estado: 'NO_EJECUTA',
    motivo: camino?.modo === 'pieza'
      ? 'el cuerpo trae una orden PUBLICAR: valida y el brazo publica esa PIEZA en vez de desplegar'
      : `el brazo no eligio ningun camino (modo "${camino?.modo}")`,
  };
}

export function cuerpoPunteroMuerto({ texto, idPropio, idsVivos }) {
  const { cuerpo } = partirPedido(texto);
  const citados = [...new Set(
    [...String(cuerpo).matchAll(/\bok\s+(t_[0-9a-f]{6,})\b/gi)].map((m) => m[1]),
  )].filter((id) => id !== idPropio);
  if (citados.length === 0) return { estado: 'SIN_PUNTEROS', muertos: [] };
  if (!idsVivos || idsVivos.size === 0) {
    return { estado: 'NO_MEDIDO', motivo: 'no pude derivar que tareas siguen abiertas', muertos: [] };
  }
  const muertos = citados.filter((id) => !idsVivos.has(id));
  return muertos.length > 0
    ? { estado: 'PUNTERO_MUERTO', muertos }
    : { estado: 'VIVOS', muertos: [] };
}

/**
 * PURA: ¿se pudieron poner al día los refs con los que se va a medir?
 *
 * POR QUÉ EXISTE, Y POR QUÉ ESTE GATE FALLABA EN VERDE SIN ELLO. Todo lo que este archivo
 * deriva —`publicariaPlataforma`, `publicariaLanding`, `esPublicado`— se calcula contra
 * `origin/master` y `origin/main` **del clon en disco**, y hasta el 2026-09-11 no había una
 * sola llamada a `git fetch` en las 1.105 líneas. Con el clon atrasado, los commits que
 * faltan por nombrar no entran en el universo, así que `promesaCompleta` los da por
 * COMPLETA: un pedido que SUB-DESCRIBE sale **OK**.
 *
 * No es teórico y muerde justo al dueño del gate. El integrador se mudó al nodo de casa, y
 * desde ahí `onia-platform` **no se puede pushear**: el merge se hace en el clon gemelo del
 * VPS por SSH. O sea que el clon local de casa NUNCA ve el push del propio integrador salvo
 * que otro proceso fetchee por casualidad. Medido ese día sobre `t_e0f3b3b7`: mergeé dos
 * arreglos a `master`, corrí el gate y dijo `OK ... sigue VIGENTE`; algo fetcheó en el medio
 * y la corrida siguiente —sin que nada del producto cambiara— sacó el `ROJO`. Un gate cuyo
 * veredicto depende de si otro proceso fetcheó no es un gate.
 *
 * Es la misma cura que `espejo-check.mjs` ya escribió el 2026-09-10 para su clon viejo, que
 * no viajó hasta acá. Allá el clon atrasado producía un rojo falso —ruidoso, se investiga—;
 * acá produce un **verde** falso, que es la dirección que nadie audita.
 *
 * Dirección del daño al fallar: sin poder fetchear se sale NO_MEDIDO, nunca OK. Concluir con
 * refs que no se pudieron actualizar es exactamente el modo de falla que esto viene a cerrar.
 *
 * @param {{repos:string[], fetchear:(repo:string)=>boolean}} args
 */
export function refsAlDia({ repos, fetchear }) {
  const fallaron = [];
  for (const repo of repos || []) {
    if (fetchear(repo) !== true) fallaron.push(repo);
  }
  return { ok: fallaron.length === 0, fallaron };
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
 * Trae los refs del remoto de un clon. `true` = quedó al día.
 *
 * `sh` devuelve `''` cuando el comando anduvo (un fetch silencioso no imprime nada) y `null`
 * cuando falló, así que la distinción es exactamente la que hace falta: `'' !== null`.
 * No toca el árbol de trabajo — un carril con cambios sin commitear no corre riesgo.
 */
function fetchearRepo(repo) {
  return sh('git', ['-C', repo, 'fetch', '--quiet', '--prune', 'origin'], { timeout: 120_000 }) !== null;
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

export const RUTA_COMMIT_LANDING = '/opt/onia-landing/runtime-next/.commit';

/** Lo que contesta el shell cuando PUDO mirar y el archivo no está. Ver `guionDelCommit`. */
export const SIN_COMMIT = '__SIN_COMMIT__';

/**
 * El guion que separa «no pude preguntar» de «pregunté y no está»: un `cat` a secas falla igual
 * en los dos casos —SSH caído y archivo ausente dan la misma salida vacía—, así que la ausencia
 * queda muda. Con el centinela, el shell contesta y dice cuál de las dos es.
 */
export function guionDelCommit(ruta = RUTA_COMMIT_LANDING) {
  return `if [ -f "${ruta}" ]; then cat "${ruta}"; else printf %s ${SIN_COMMIT}; fi`;
}

/**
 * Le pregunta al runtime vivo por su `.commit`. Donde está `/opt/onia-landing` la respuesta es
 * local y autoritativa; desde el nodo de casa va por el shim del VPS. `null` = no se pudo
 * preguntar, y eso NO es lo mismo que `SIN_COMMIT`.
 *
 * ⚠️ La rama local se elige por el DIRECTORIO, no por el archivo: preguntando `existsSync(ruta)`
 * —como hasta el 2026-09-18— el archivo ausente en la máquina que SÍ lo tiene se leía como «acá
 * no es, preguntale al VPS», que es justo la confusión que este tri-estado existe para deshacer.
 */
function leerCommitDeLaLanding({ ruta = RUTA_COMMIT_LANDING, correr = sh } = {}) {
  const guion = guionDelCommit(ruta);
  if (existsSync('/opt/onia-landing')) return correr('bash', ['-lc', guion]);
  if (existsSync(VPS)) return correr('bash', [VPS, 'bash', '-lc', guion], { timeout: 120_000 });
  return null;
}

/**
 * Los tres estados de la cita del build vivo de la landing. Puro, para poder probarlo.
 *
 * @returns {{estado:'MEDIDO'|'SIN_COMMIT'|'NO_MEDIDO', sha:string|null, motivo:string|null}}
 */
export function clasificarShaVivo(crudo) {
  if (crudo === null || crudo === undefined) {
    return { estado: 'NO_MEDIDO', sha: null, motivo: 'no pude preguntarle al runtime de la landing' };
  }
  const t = String(crudo).trim();
  if (t === SIN_COMMIT) {
    return { estado: 'SIN_COMMIT', sha: null, motivo: 'el runtime vivo no tiene .commit' };
  }
  if (/^[0-9a-f]{7,40}$/.test(t)) return { estado: 'MEDIDO', sha: t, motivo: null };
  return {
    estado: 'NO_MEDIDO',
    sha: null,
    motivo: t === '' ? 'el runtime contesto vacio' : `el runtime contesto algo que no es un sha: ${t.slice(0, 40)}`,
  };
}

/**
 * El sha del build que sirve `onia.com.bo`, TRI-ESTADO. Nunca un sha inventado: una cita falsa
 * manda a verificar contra un commit que no existe.
 *
 * No sirve para decidir si un pedido está entregado —para eso está `epochBuildLanding`, porque
 * la landing se mide por FECHA— sino para CITAR contra qué build se midió… y para NOTAR cuándo
 * no se puede citar. Hasta el 2026-09-18 devolvía `null` pelado, así que el runtime publicado
 * sin su `.commit` —medido ese día: `/opt/onia-landing/runtime-next/` sin él mientras los
 * respaldos y los builds armados lo tienen— era indistinguible de un SSH caído, y la ausencia
 * no la notaba nadie. Se cura sola en la próxima publicación; lo que faltaba era verla.
 */
function shaVivoLanding(opciones = {}) {
  return clasificarShaVivo(leerCommitDeLaLanding(opciones));
}

/**
 * El aviso —nunca un rojo— de que el runtime corre sin su `.commit`.
 *
 * No cambia ningún veredicto a propósito: el de la landing lo da `epochBuildLanding` por FECHA,
 * y esto se cura en la próxima publicación. Escribirlo a mano en producción sería inventar un
 * sha que nadie derivó. Lo que se pierde mientras tanto es la CITA, que es la diferencia entre
 * refutar un veredicto en dos segundos y volver a medirlo a mano.
 */
export function avisoDelCommitAusente(vivoLanding) {
  if (!vivoLanding || vivoLanding.estado !== 'SIN_COMMIT') return null;
  return [
    'AVISO: el runtime vivo de la landing corre SIN .commit, asi que «que corre onia.com.bo»',
    '  vuelve a ser a mano. No cambia ningun veredicto (se mide por FECHA) y se cura en la',
    '  proxima publicacion; si vuelve a pasar DESPUES de publicar, el sospechoso es el stage:',
    '  ssh root@187.77.16.63 \'ls -la /opt/onia-landing/runtime-next/; find /opt/onia-landing -maxdepth 3 -name .commit\'',
  ].join('\n');
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
export function publicariaLanding(epochBuild, { cwd = RAIZ, ref = 'origin/main' } = {}) {
  if (typeof epochBuild !== 'number') return null;

  // ⚠️ Acá el conjunto se acotaba con `.filter((c) => c.ct > epochBuild)` —«lo posterior al
  // build»— y eso perdía el sujeto EN VERDE y para siempre. Un commit de rama de carril tiene
  // fecha ANTERIOR al merge que lo trae, así que el filtro lo descartaba por viejo y
  // `--no-merges` descartaba al merge que lo hacía visible. Medido el 2026-09-18 con el pedido
  // `t_afd816af` vivo: esta función devolvía VACÍO mientras el publicador en seco decía «hay que
  // publicar: 1 arreglo(s)», y con la lista vacía `promesaCompleta` y `cuerpoCorto` salen los dos
  // NO_MEDIDO — que no se pone rojo nunca. O sea el control que impide que Sergio Urcullo apruebe
  // código que el pedido no le nombró quedaba apagado, en silencio.
  //
  // La pregunta correcta no es «¿qué hay más nuevo que el build?» sino «¿qué tiene `main` que el
  // build no contiene?»: ANCESTRÍA, no tiempo. La fecha sigue siendo el único proxy disponible
  // —la landing no deja escrito el sha que publicó— pero se usa UNA vez, para elegir el punto de
  // `--first-parent` por el que el build pasó, y de ahí manda el grafo.
  //
  // `baseDelBuild` se IMPORTA de `deploy-vivo.mjs`, que es donde esta misma cura se escribió el
  // 2026-09-17: son el mismo invariante sobre el mismo destino, y dos copias divergen — de hecho
  // esta función es la mitad a la que la cura no había viajado.
  const base = baseDelBuild(epochBuild * 1000, { cwd, ref });
  if (base === null) return null;

  const RS = '\x1e';
  const salida = sh('git', [
    '-C', cwd, 'log', '--no-merges', '--name-only',
    `--format=${RS}%h%x1f%ct%x1f%s`,
    base.sha ? `${base.sha}..${ref}` : ref,
    '--', ZONA_LANDING,
  ]);
  if (salida === null) return null;
  return salida
    .split(RS)
    .filter((b) => b.trim())
    .map((bloque) => {
      const [cabecera, ...archivos] = bloque.split('\n');
      const [sha, ct, ...resto] = cabecera.split('\x1f');
      return { sha, ct: Number(ct), titulo: resto.join('\x1f'), archivos: archivos.filter(Boolean) };
    });
}

/** Fecha de un commit de `onia-hermes` en epoch, o `null` si el sha no resuelve. */
function epochCommitHermes(sha) {
  const crudo = sh('git', ['-C', RAIZ, 'log', '-1', '--format=%ct', sha]);
  return crudo && /^\d+$/.test(crudo.trim()) ? Number(crudo.trim()) : null;
}

/**
 * Los destinos que se publican COPIANDO ARCHIVOS, con su publicador en seco y el lector de
 * SU formato. Es una tabla y no dos ramas gemelas a propósito: el 2026-09-11 se cableó
 * `siat` copiando la forma de `plataforma`, y el hermano `bot` —misma especie, mismo
 * invariante— quedó afuera otro día entero. Un destino nuevo de esta especie tiene que ser
 * una fila acá, no una rama nueva; y el gate de abajo exige que no falte ninguno.
 */
const DESTINOS_POR_COPIA = {
  siat: { seco: '/opt/onia-siat/_deploy/publicar.sh', lector: archivosDelDryRun },
  bot: { seco: '/opt/onia/bot/_deploy/publicar.sh', lector: archivosDelDryRunBot },
};

/**
 * Los dos destinos que se identifican por SHA (`plataforma`) y por FECHA (`landing`), con el
 * publicador del que sale el cuerpo derivado cuando quedan cortos. Es una tabla por el mismo
 * motivo que la de arriba: con la ruta escrita a mano en el veredicto, el carril de la landing
 * salía a correr el publicador de la plataforma, que no publica nada suyo.
 */
const SECO_POR_SHA = {
  plataforma: '/opt/onia-platform/_deploy/publicar.sh',
  landing: '/opt/onia-landing/_deploy/publicar.sh',
};

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

/**
 * Corre un comando y devuelve su stdout AUNQUE salga distinto de 0; `null` sólo si no se
 * pudo ejecutar (no existe, o lo mató el timeout y la salida quedó a medias).
 *
 * ⚠️ POR QUÉ NO ALCANZA `sh`. Un publicador en seco sale ≠ 0 por condiciones OPERATIVAS del
 * destino después de haber impreso su recuento entero. Medido el 2026-09-12 sobre el único
 * pedido vivo (`t_053da636`, siat): imprimió «hay que publicar: 2 arreglo(s)» con los dos
 * nombres y salió 1 porque había una corrida de Fase 1 en curso y se niega a pisar código
 * bajo un runner vivo. `sh` devuelve `null` ante cualquier status ≠ 0, así que el gate tiró
 * esa salida y firmó «no pude correr el publicador en seco (¿SSH al VPS?)» — mandando a
 * diagnosticar una red que andaba perfecta, y dejando sin medir al único pedido que había.
 *
 * La negativa a publicar es una respuesta; no haber llegado a preguntar es otra cosa.
 */
function salidaAunqueFalle(cmd, args, opts = {}) {
  try {
    return execFileSync(cmd, args, { encoding: 'utf8', timeout: 180_000, stdio: ['ignore', 'pipe', 'ignore'], ...opts }).trim();
  } catch (e) {
    // Un timeout mata al proceso a mitad de frase: lo que haya impreso está INCOMPLETO, y un
    // recuento a medias se leería como un recuento. Eso es no medido.
    if (e?.signal || e?.code === 'ENOENT' || typeof e?.status !== 'number') return null;
    // Falló Y no imprimió nada: eso NO es una respuesta. Es el caso del shim que sale por SSH
    // contra un publicador que no está en el VPS — status 127 y stdout vacía. Devolver `''`
    // acá sería el falso verde entero de este archivo: `''` se lee como «el publicador no
    // tiene nada que publicar». Un recuento existe o no llegué a preguntar; no hay medio.
    const salida = typeof e.stdout === 'string' ? e.stdout.trim() : '';
    return salida === '' ? null : salida;
  }
}

function secoLocal(ruta) {
  if (!existsSync(ruta)) return null;
  return salidaAunqueFalle('bash', [ruta, '--dry-run']);
}

/** Por el MISMO shim que ya usa `shaVivoPlataforma`: un segundo camino al VPS es una segunda
 *  respuesta posible a «a qué máquina le pregunto». */
function secoPorSsh(ruta, shim = VPS) {
  if (!existsSync(shim)) return null;
  return salidaAunqueFalle('bash', [shim, 'bash', '-lc', `bash ${ruta} --dry-run`]);
}

/**
 * Lo que el `ok` de un pedido por COPIA publicaría: la lista de archivos que su propio
 * publicador en seco enumera. `null` = no se pudo medir, `[]` = ya está al día.
 *
 * Un destino que no esté en la tabla sale `null` (no medido), nunca `[]`: «no sé
 * preguntarle» y «no tiene nada que publicar» son la distinción que este archivo entero
 * defiende.
 */
export function publicariaPorCopia(destino, io = {}) {
  const d = DESTINOS_POR_COPIA[destino];
  if (d === undefined) return null;
  return d.lector(secoDeProduccion(d.seco, io));
}

/**
 * PURA: el barrido a partir del texto crudo de `list --json`. `null` = no se pudo leer.
 *
 * El parseo va separado del proceso a propósito: es el único punto donde una respuesta
 * TRUNCADA (un SSH cortado a mitad del JSON) se distingue de un tablero vacío, y esa
 * distinción es la que sostiene el `NO MEDIDO` de todo este archivo. `JSON.parse` de medio
 * documento tira, y ese tirón tiene que salir como `null`, nunca como `[]`.
 */
export function barrerTableroJson(crudo) {
  if (typeof crudo !== 'string' || crudo.trim() === '') return null;
  let tareas;
  try {
    tareas = JSON.parse(crudo);
  } catch {
    return null;
  }
  if (!Array.isArray(tareas)) return null;
  return barrerTablero({ tareas });
}

/**
 * Los pedidos vivos del tablero. Devuelve `null` si NO se pudo leer la lista, y el barrido
 * con sus `ilegibles` si se pudo — ver `barrerTablero`: un cuerpo que no llega se NOMBRA.
 *
 * 🔴 UNA SOLA LECTURA, y el motivo es que el gate se apagaba solo. Hasta el 2026-09-13 esto
 * pedía `list` y después un `show` POR CADA TAREA ABIERTA. En el nodo de casa `onia-tablero.sh`
 * es un shim que hace `exec ssh` al VPS, así que eso era un handshake SSH por tarea: con 72
 * tareas abiertas, ~7 minutos —medido ese día, con el gate corriendo en background y su hijo
 * `ssh ... show t_9d970ada` a la vista en `ps`—, y creciendo con el tablero. O sea un
 * instrumento sin tope de tiempo: el día que el tablero tenga 200 tareas no contesta dentro
 * de la vuelta, y un gate que no contesta es indistinguible de uno que no existe (fue
 * exactamente el reclamo de `t_e768cae3`, que lo había atribuido a un SSH sin timeout —
 * todos los timeouts estaban puestos; lo que fallaba era la CANTIDAD de llamadas).
 *
 * `list --json` trae `body` para las 262 tareas en una sola respuesta. Y de paso cierra la
 * ventana que el comentario viejo cuidaba a mano: los cuerpos y los estados salen de la
 * MISMA foto, así que ninguna tarea puede archivarse entre dos lecturas.
 */
function pedidosVivos() {
  return barrerTableroJson(sh('bash', [TABLERO, 'list', '--json'], { timeout: 180_000 }));
}

/**
 * Corre `correr` UNA VEZ POR PEDIDO, con cada acumulador recortado a ese pedido. Devuelve 1 si
 * alguno tuvo rojo.
 *
 * 🔴 Nace del 2026-09-12. La cadena de prioridad de `imprimirCadena` es DELIBERADA —un pedido
 * con dos rojos imprime el más caro, se cura, y en la corrida siguiente aparece el de abajo—,
 * pero corría UNA sola vez para TODOS los pedidos: el `return 1` del primer bloque con contenido
 * se llevaba puesto a los pedidos de los OTROS destinos, sin dejar señal de que existían. Medido
 * ese día en tres corridas seguidas: con un pedido de plataforma entregado, el del bot
 * (`t_2baef483`, también entregado y también pidiéndole un `ok` a Sergio Urcullo por trabajo ya
 * publicado) no salía ni OK ni rojo — o sea que el gate tapaba justo el modo de falla que existe
 * para cazar. Se notó de casualidad, comparando dos corridas.
 *
 * Tapar el segundo control DEL MISMO pedido es el diseño; tapar un pedido ENTERO de otro destino
 * es el bug. Por eso la prioridad se mantiene, pero se aplica por pedido.
 */
export function cadenaPorPedido({ ids, acumuladores, correr }) {
  let corta = 0;
  for (const id of ids) {
    const propios = {};
    for (const [nombre, lista] of Object.entries(acumuladores)) {
      propios[nombre] = lista.filter((e) => e.id === id);
    }
    if (correr(propios) === 1) corta = 1;
  }
  return corta;
}

/**
 * La cita «(produccion corre X)» del build que corre en EL DESTINO de ese pedido.
 *
 * 🔴 Nace del 2026-09-12 (t_da62bade). Esto era UNA constante —el `vivo` de
 * `shaVivoPlataforma()`— pero el acumulador `entregados` recibe pedidos de los DOS destinos,
 * así que el rojo de la landing `t_a840b237` salió justificado con `a888b5b`, un sha de
 * `onia-platform`; la landing corría `bd90e8af2`. El VEREDICTO era correcto: lo que mentía era
 * la cita, y manda a verificar contra un repo donde ese sha ni siquiera existe.
 *
 * Sin sha del destino la cita se OMITE: no se cae a la del vecino ni se inventa una. El
 * veredicto se imprime igual, que es lo único que el lector necesita para actuar.
 */
export function citaDelVivo(destino, vivoPorDestino) {
  const dato = destino ? (vivoPorDestino ?? {})[destino] : null;
  // El de la plataforma es un sha pelado; el de la landing es tri-estado (`clasificarShaVivo`).
  // `SIN_COMMIT` y `NO_MEDIDO` traen `sha: null`, así que la cita se omite igual: acá no se
  // decide nada, se cita — el aviso de la ausencia lo da `avisoDelCommitAusente`, una sola vez.
  const sha = dato && typeof dato === 'object' ? dato.sha : dato;
  return sha ? ` (produccion corre ${sha})` : '';
}

/**
 * La cadena de prioridad de un pedido: imprime su rojo más caro y devuelve 1, o 0 si no tiene.
 * Se llama desde `cadenaPorPedido`, nunca con los acumuladores crudos — ver el porqué ahí.
 */
export function imprimirCadena({
  entregados, entregadosSiat, mudos, punteros, cortosSiat, incompletos, vencidos, cortos,
  inmedibles, vivoPorDestino,
}) {
  if (entregados.length > 0) {
    for (const e of entregados) {
      console.log(`\nROJO ${e.id}: TODO lo que promete ya esta publicado${citaDelVivo(e.destino, vivoPorDestino)}.`);
      console.log('  Le esta pidiendo un ok a Sergio Urcullo por trabajo hecho. Cerralo con su');
      console.log('  evidencia y, si quedo algo sin publicar despues, hace un pedido NUEVO: el');
      console.log('  cuerpo del viejo no lo describe, y el cuerpo es lo unico que el lee.');
    }
    return 1;
  }

  if (entregadosSiat.length > 0) {
    for (const e of entregadosSiat) {
      console.log(`\nROJO ${e.id}: su publicador en seco dice que YA ESTA PUBLICADO (${e.destino}).`);
      console.log('  Le esta pidiendo un ok a Sergio Urcullo por trabajo hecho. Cerralo con su');
      console.log('  evidencia y, si quedo algo sin publicar despues, hace un pedido NUEVO: el');
      console.log('  cuerpo del viejo no lo describe, y el cuerpo es lo unico que el lee.');
    }
    return 1;
  }

  // Tercero en la cadena, y arriba de los que describen de menos: un cuerpo corto le muestra a
  // Sergio Urcullo menos de lo que publica, pero su `ok` PUBLICA. Éste no: lo manda a apretar
  // algo que no ejecuta nada, y como lo pide como prerrequisito, deja los DOS deploys trabados
  // esperando un paso que él ya dio.
  // Va ANTES de los controles de cuerpo a proposito: que el pedido describa bien lo que
  // publica importa menos que el hecho de que su ok NO PUBLIQUE NADA. Este es el unico
  // control que le pregunta al brazo en vez de leer el texto.
  if (mudos.length > 0) {
    for (const m of mudos) {
      console.log(`\nROJO ${m.id}: su cuerpo pide desplegar ${m.destino}, pero su ok NO DESPLIEGA NADA.`);
      console.log(`  ${m.motivo}`);
      console.log('  Sergio Urcullo aprieta, no pasa nada, y los pedidos que esperan a este por');
      console.log('  DESPUES-DE quedan trabados detras de un paso que el cree dado. El gate no lo');
      console.log('  veia porque todos los demas controles leen el CUERPO; este le pregunta al brazo.');
      console.log('  Verificalo vos mismo, en seco y sin tocar produccion:');
      console.log(`    ONIA_DESPLEGAR_DRY=1 node /root/bin/onia-publicar-aprobado.mjs ${m.id}`);
      console.log('  Se cura rehaciendo el pedido con el cuerpo derivado y ARCHIVANDO el viejo en la');
      console.log('  misma vuelta: el `edit` del tablero no cambia el cuerpo.');
    }
    return 1;
  }

  if (punteros.length > 0) {
    for (const p of punteros) {
      console.log(`\nROJO ${p.id}: su cuerpo manda a apretar un ok sobre ${p.muertos.join(', ')}, que ya no esta abierta (${p.destino}).`);
      console.log('  Una tarea archivada o terminada NO ejecuta: el brazo la rechaza y no publica');
      console.log('  nada. Sergio Urcullo aprieta, no pasa nada, y se queda esperando ese paso.');
      console.log('  El pedido vivo del otro destino se DERIVA, nunca se copia:');
      console.log("    /root/bin/onia-tablero.sh list | grep -E '^[⊘▶]' | grep -iE 'deploy|publicar'");
      console.log('  Se cura rehaciendo el pedido con el id vigente y ARCHIVANDO el viejo en la');
      console.log('  misma vuelta. El cuerpo no se puede editar, y el cuerpo es lo que el lee.');
    }
    return 1;
  }

  if (cortosSiat.length > 0) {
    for (const c of cortosSiat) {
      console.log(`\nROJO ${c.id}: su CUERPO no nombra ${c.mudos.length} archivo(s) que su ok publica.`);
      for (const m of c.mudos) console.log(`    ${m}`);
      console.log('  El cuerpo es lo unico que Sergio Urcullo lee para decidir, y hoy describe');
      console.log('  menos de lo que su ok publica. COMENTAR NO LO LIMPIA: este control lee el');
      console.log('  cuerpo y nada mas, y el `edit` del tablero no cambia el cuerpo. Se cura');
      console.log('  rehaciendo el pedido con el cuerpo derivado de');
      // El comando lo DERIVA la tabla: escribir acá la ruta de `siat` mandaba al carril del
      // bot a correr el publicador del emisor fiscal, que no publica nada suyo.
      console.log(`    bash ${DESTINOS_POR_COPIA[c.destino].seco} --dry-run`);
      console.log('  y ARCHIVANDO el viejo en la misma vuelta.');
    }
    return 1;
  }

  if (incompletos.length > 0) {
    for (const i of incompletos) {
      console.log(`\nROJO ${i.id}: su ok publica ${i.mudos.length} arreglo(s) que el pedido NO nombra.`);
      for (const m of i.mudos) console.log(`    ${m.sha}  ${m.titulo}`);
      console.log('  El cuerpo es lo unico que Sergio Urcullo lee: hoy aprobaria codigo que nadie');
      console.log('  le mostro. NO ALCANZA con agregarlos en un comentario: esto se limpiaria,');
      console.log('  pero `cortos` —mas abajo en esta misma cadena— lee el cuerpo y nada mas, y');
      console.log('  quedaria rojo pidiendo lo contrario. Se cura rehaciendo el pedido con el');
      console.log('  cuerpo derivado de');
      // La ruta sale de la tabla, como en los hermanos: escrita a mano, el pedido de la landing
      // mandaba a correr el publicador de la plataforma, que no publica nada suyo. La guarda deja
      // pasar al sujeto sin destino en vez de imprimir `undefined` como si fuera una ruta.
      if (SECO_POR_SHA[i.destino]) console.log(`    bash ${SECO_POR_SHA[i.destino]} --dry-run`);
      console.log('  y ARCHIVANDO el viejo en la misma vuelta.');
    }
    return 1;
  }

  if (vencidos.length > 0) {
    for (const v of vencidos) {
      console.log(`\nROJO ${v.id}: su CUERPO esta entero publicado${citaDelVivo(v.destino, vivoPorDestino)}.`);
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
      console.log('  de lo que su ok publica. COMENTAR NO LO LIMPIA: este control lee el cuerpo y');
      console.log('  nada mas, y el `edit` del tablero no cambia el cuerpo. Se cura rehaciendo el');
      console.log('  pedido con el cuerpo derivado de');
      // La ruta sale de la tabla: con el literal de `plataforma` escrito aca, el pedido de la
      // landing mandaba a correr el publicador del otro destino, que no publica nada suyo.
      console.log(`    bash ${SECO_POR_SHA[c.destino]} --dry-run`);
      console.log('  y ARCHIVANDO el viejo en la misma vuelta.');
    }
    return 1;
  }

  // Va ÚLTIMO en la cadena a propósito: los rojos de arriba son de pedidos que SÍ se pudieron
  // juzgar, y son más caros (uno le está pidiendo un `ok` por trabajo hecho ahora mismo). Este
  // dice que a otro pedido ni siquiera se le pudo preguntar — importa, pero después.
  if (inmedibles.length > 0) {
    for (const m of inmedibles) {
      console.log(`\nROJO ${m.id}: no declara ni un sha, asi que NO SE PUEDE JUZGAR (destino ${m.destino}).`);
      console.log('  Su destino tiene instrumento; lo que falta es la marca. Mientras siga asi, si');
      console.log('  produccion publica sola este pedido va a seguir pidiendo un ok por trabajo');
      console.log('  hecho y nada se va a poner rojo — que es el unico caso que este gate caza.');
      console.log(`  Se cura con un comentario, sin rehacer la tarea ni tocar el cuerpo que el lee:`);
      console.log(`    /root/bin/onia-tablero.sh comment ${m.id} "DEPLOY PEDIDO <sha> — <que arregla>"`);
    }
    return 1;
  }

  return 0;
}

async function medirEnVivo() {
  const barrido = pedidosVivos();
  if (barrido === null) {
    console.log('NO MEDIDO: no pude leer el tablero (' + TABLERO + ')');
    return 2;
  }
  const { pedidos, ilegibles, abiertos } = barrido;

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

  // Los refs ANTES de derivar nada: todo lo que sigue mide contra `origin/*` del disco, y con
  // un clon atrasado un pedido que SUB-DESCRIBE sale OK. Ver `refsAlDia`.
  const frescura = refsAlDia({
    repos: [RAIZ, REPO_PLATAFORMA].filter((r) => existsSync(r)),
    fetchear: fetchearRepo,
  });
  if (!frescura.ok) {
    console.log(`NO MEDIDO: no pude actualizar los refs de ${frescura.fallaron.join(', ')}`);
    console.log('  Medir contra refs viejos hace que un pedido que SUB-DESCRIBE salga OK.');
    return 2;
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
  //
  // ⚠️ Y pasa por `soloLosQueViajan`, igual que su hermano `publicariaLanding`. Hasta el
  // 2026-09-11 no lo hacía —ni siquiera pedía los archivos—, así que un commit que sólo toca
  // un `.test.ts` entraba al universo y el gate exigía nombrarlo en el pedido. Ese día contó
  // 23 donde `publicar.sh --dry-run` contaba 20, y los 3 de más eran tests puros. El costo no
  // es cosmético: obedecerlo mete en el cuerpo que lee Sergio Urcullo arreglos que no cambian
  // NADA de lo que él puede ver, y además el pedido no se estabiliza nunca —cada commit de
  // herramientas de cualquier carril lo vuelve a poner corto—. Es el mismo defecto que
  // `deploy-vivo.mjs` ya había curado el 2026-09-04; acá estaba curada la mitad `landing` y
  // cruda la mitad `plataforma`, en el mismo archivo.
  const publicariaPlataforma = (() => {
    if (!puedePlataforma) return null;
    const salida = sh('git', ['-C', REPO_PLATAFORMA, 'log', '--no-merges', '--format=%h\t%s', `${vivo}..origin/master`]);
    if (salida === null) return null;
    const commits = salida
      .split('\n')
      .filter(Boolean)
      .map((l) => {
        const [sha, ...resto] = l.split('\t');
        // `null` es «no pude preguntar», y `llegaAlCliente` lo cuenta como que VIAJA: se
        // prefiere pedir nombrar de más antes que callar un arreglo real.
        const crudo = sh('git', ['-C', REPO_PLATAFORMA, 'show', '--pretty=', '--name-only', sha]);
        const archivos = crudo === null ? null : crudo.split('\n').filter(Boolean);
        return { sha, titulo: resto.join('\t'), archivos };
      });
    return soloLosQueViajan(commits);
  })();

  const entregados = [];
  const incompletos = [];
  const vencidos = [];
  const cortos = [];
  const noMedidos = [];
  // Y la TERCERA especie, que hasta el 2026-09-12 vivía escondida adentro de `noMedidos`: el
  // pedido cuyo destino SÍ tiene instrumento pero que no declara ni un sha con su marca. No es
  // transitorio como un `noMedidos` ni un agujero del gate como un `sinCubrir`: es un pedido
  // MAL ESCRITO, que se cura con un comentario y que mientras tanto vuelve inalcanzable al
  // único modo de falla que este archivo existe para cazar. Impreso como no-medido se lee
  // como ruido de ambiente, y por eso sobrevivió con el gate en verde. Ver `inmediblesSinDeclarar`.
  const inmedibles = [];
  // `noMedidos` y `sinCubrir` NO son lo mismo, y mezclarlos fue el bug: el primero es
  // transitorio (el SSH no contestó, el sha no resuelve) y se cura solo en la vuelta
  // siguiente; el segundo es un AGUJERO del gate, que no se cura nunca y hay que escribirle
  // instrumento. Impresos juntos, el segundo se lee como ruido de ambiente y sobrevive.
  const sinCubrir = [];
  // Los que se publican por COPIA (`siat`, `bot`) van aparte porque su veredicto se dice con
  // ARCHIVOS, no con shas: meterlos en las mismas listas obligaría a que el reporte adivine de
  // qué especie es cada entrada. Cada entrada lleva su `destino` para poder imprimir el
  // comando de cura del publicador que le toca.
  const entregadosSiat = [];
  const cortosSiat = [];
  // Transversal a TODOS los destinos: cualquier cuerpo puede mandar a apretar el `ok` de otra
  // tarea, y el daño no depende de si se publica por sha, por fecha o por copia. Por eso se
  // barre aparte del `for` de destinos, y no adentro de una de sus ramas.
  const punteros = [];
  /** Pedidos cuyo `ok` no despliega nada aunque su cuerpo lo prometa. Ver `cuerpoNoEjecuta`. */
  const mudos = [];
  for (const p of pedidos) {
    const r = cuerpoPunteroMuerto({ texto: p.texto, idPropio: p.id, idsVivos: abiertos });
    if (r.estado === 'PUNTERO_MUERTO') punteros.push({ id: p.id, destino: p.destino, muertos: r.muertos });
    else if (r.estado === 'NO_MEDIDO') noMedidos.push(`${p.id} (${p.destino}, punteros): ${r.motivo}`);
    const e = cuerpoNoEjecuta({ texto: p.texto });
    if (e.estado === 'NO_EJECUTA') mudos.push({ id: p.id, destino: p.destino, motivo: e.motivo });
  }
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
      if (r.estado === 'ENTREGADO') entregados.push({ ...r, destino: 'landing' });
      else if (r.causa === 'SIN_DECLARAR') inmedibles.push({ id: p.id, destino: 'landing' });
      else if (r.estado === 'NO_MEDIDO') noMedidos.push(`${p.id} (landing): ${r.motivo}`);
      else {
        console.log(`OK ${p.id} (landing): sigue VIGENTE — ${r.sinPublicar.length} sin publicar, ${r.indeterminados.length} sin resolver`);
        // Vigente no alcanza, igual que en plataforma: un pedido puede estar vigente Y
        // sub-describir lo que su `ok` publica — y ésa es la dirección cara, porque lo que
        // se publica sin nombrar es justo lo que Sergio Urcullo no leyó. El universo se
        // DERIVA (commits de la zona posteriores al build, los que le llegan al lead), nunca
        // de los shas del pedido: recorrer lo que el pedido enumera no puede ver al que falta.
        const viajanLanding = soloLosQueViajan(publicariaLanding(buildLanding));
        const c = promesaCompleta({ shas: shasDelTexto(p.texto), publicaria: viajanLanding });
        if (c.estado === 'SUB_DESCRIBE') incompletos.push({ id: p.id, destino: p.destino, mudos: c.mudos });
        else if (c.estado === 'NO_MEDIDO') noMedidos.push(`${p.id} (landing, promesa completa): ${c.motivo}`);
        // Y la del cuerpo, que hasta el 2026-09-12 sólo tenían los otros tres destinos: la de
        // arriba lee cuerpo Y comentarios como un texto, así que un comentario con los shas que
        // faltan la deja satisfecha — y el comentario no viaja a la pantalla donde Sergio
        // Urcullo decide. Misma pregunta que `cuerpoCorto` le hace a `plataforma`.
        const k = cuerpoCorto({ texto: p.texto, publicaria: viajanLanding });
        if (k.estado === 'SUB_DESCRIBE') cortos.push({ id: p.id, destino: 'landing', mudos: k.mudos });
        else if (k.estado === 'NO_MEDIDO') noMedidos.push(`${p.id} (landing, cuerpo completo): ${k.motivo}`);
      }
      continue;
    }
    if (DESTINOS_POR_COPIA[p.destino] !== undefined) {
      // Ni `siat` ni `bot` se identifican por sha ni por fecha: se publican copiando archivos,
      // así que su universo son los ARCHIVOS que su propio publicador en seco enumera. Mismo
      // invariante que los otros dos destinos (el cuerpo describe lo que su ok publica), otro
      // artefacto.
      const publicaria = publicariaPorCopia(p.destino);
      if (publicaria === null) {
        noMedidos.push(`${p.id} (${p.destino}): no pude correr el publicador en seco (¿SSH al VPS?)`);
        continue;
      }
      if (publicaria.length === 0) {
        // La dirección cara, la misma que `clasificarPedido` caza en los otros destinos: el
        // pedido sigue bloqueado pidiendo un ok por trabajo que ya está publicado.
        entregadosSiat.push({ id: p.id, destino: p.destino });
        continue;
      }
      console.log(`OK ${p.id} (${p.destino}): sigue VIGENTE — ${publicaria.length} archivo(s) sin publicar`);
      // El cuerpo, no el texto entero: los comentarios se apilan abajo y lo tapan. Es la misma
      // pregunta que `cuerpoCorto` le hace a `plataforma`.
      const k = cuerpoCortoArchivos({ texto: p.texto, publicaria });
      if (k.estado === 'SUB_DESCRIBE') {
        cortosSiat.push({ id: p.id, destino: p.destino, mudos: k.mudos });
      } else if (k.estado === 'NO_MEDIDO') {
        noMedidos.push(`${p.id} (${p.destino}, cuerpo completo): ${k.motivo}`);
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
    if (r.estado === 'ENTREGADO') entregados.push({ ...r, destino: 'plataforma' });
    else if (r.causa === 'SIN_DECLARAR') inmedibles.push({ id: p.id, destino: 'plataforma' });
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
      if (c.estado === 'SUB_DESCRIBE') incompletos.push({ id: p.id, destino: p.destino, mudos: c.mudos });
      else if (c.estado === 'NO_MEDIDO') noMedidos.push(`${p.id} (plataforma, promesa completa): ${c.motivo}`);
      // Y la tercera pregunta, que hasta el 2026-09-10 no tenia dueno: las dos de arriba leen
      // cuerpo y comentarios como UN texto, asi que los comentarios TAPAN al cuerpo. Un pedido
      // puede estar vigente, nombrar todo lo que publica, y aun asi tener el cuerpo entero
      // vencido — que es lo que Sergio Urcullo lee para decidir.
      const v = cuerpoVencido({ texto: p.texto, publicado: esPublicado });
      if (v.estado === 'VENCIDO') vencidos.push({ id: p.id, destino: 'plataforma', mudos: v.mudos });
      else if (v.estado === 'NO_MEDIDO') noMedidos.push(`${p.id} (plataforma, cuerpo vigente): ${v.motivo}`);

      // Y la simétrica de esa, que hasta el 2026-09-11 tampoco tenía dueño: el cuerpo puede
      // quedar CORTO. `promesaCompleta` ya pregunta esto para el pedido entero, y por eso un
      // comentario con el recuento derivado la deja satisfecha — pero el cuerpo es lo que él
      // lee para decidir. Ver `cuerpoCorto`.
      const k = cuerpoCorto({ texto: p.texto, publicaria: publicariaPlataforma });
      if (k.estado === 'SUB_DESCRIBE') cortos.push({ id: p.id, destino: 'plataforma', mudos: k.mudos });
      else if (k.estado === 'NO_MEDIDO') noMedidos.push(`${p.id} (plataforma, cuerpo completo): ${k.motivo}`);
    }
  }

  for (const n of noMedidos) console.log(`NO MEDIDO ${n}`);
  for (const s of sinCubrir) console.log(`SIN INSTRUMENTO ${s}`);

  // Cada destino cita SU build. El de la landing se pide sólo si hay un pedido suyo —es un SSH—
  // y si no contesta queda `null`: la cita se omite, nunca se cae a la del vecino. Ver
  // `citaDelVivo`.
  //
  // ⚠️ Se pregunta por TODO pedido de landing, no sólo por los `entregados` (que es el único
  // camino que imprime cita). Acotarlo a ésos dejaba la ausencia del `.commit` invisible en el
  // caso normal —un pedido VIGENTE, que es el 99 % de las corridas—, y la ausencia es
  // justamente lo que este tri-estado existe para notar. Sigue siendo UN SSH por corrida.
  const vivoLanding = pedidos.some((p) => p.destino === 'landing') ? shaVivoLanding() : null;
  const vivoPorDestino = { plataforma: vivo, landing: vivoLanding };

  const aviso = avisoDelCommitAusente(vivoLanding);
  if (aviso) console.log(aviso);

  // La cadena de prioridad de `imprimirCadena` corre UNA VEZ POR PEDIDO. Correrla una sola vez
  // para todos —como hasta el 2026-09-12— hacía que el `return 1` del primer bloque con
  // contenido tapara a los pedidos de los OTROS destinos, sin dejar señal de que existían. Ver
  // `cadenaPorPedido`.
  const corta = cadenaPorPedido({
    ids: pedidos.map((p) => p.id),
    acumuladores: {
      entregados, entregadosSiat, mudos, punteros, cortosSiat, incompletos, vencidos, cortos,
      inmedibles,
    },
    correr: (propios) => imprimirCadena({ ...propios, vivoPorDestino }),
  });
  if (corta === 1) return 1;

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

    // ── el puntero a OTRA tarea: el unico dato del cuerpo que no es un sha ni un archivo ──
    // EL BUG REAL, tal como estaba escrito en t_fd5b30c4 el 2026-09-12.
    ['el cuerpo manda a apretar un ok sobre una tarea archivada -> PUNTERO_MUERTO',
      cuerpoPunteroMuerto({
        texto: 'DESPLEGAR: landing\nOrden: ok t_bd62e5a0 (el sistema) -> ok de este (la web).',
        idPropio: 't_fd5b30c4',
        idsVivos: new Set(['t_fd5b30c4', 't_8a8a4e94']),
      }).estado === 'PUNTERO_MUERTO'],
    // Nombrarlo es lo unico accionable: «hay un puntero muerto» sin decir cual manda a releer
    // el cuerpo entero a mano.
    ['y NOMBRA al muerto',
      cuerpoPunteroMuerto({
        texto: 'ok t_bd62e5a0 primero',
        idPropio: 't_fd5b30c4',
        idsVivos: new Set(['t_8a8a4e94']),
      }).muertos.join() === 't_bd62e5a0'],
    // El caso que YA cumple. Sin el, un detector que acuse SIEMPRE pasa el de arriba y deja
    // en rojo permanente a todo pedido que coordine con otro — que es la forma correcta de
    // escribirlos.
    ['el caso que YA cumple: el id citado sigue abierto -> VIVOS',
      cuerpoPunteroMuerto({
        texto: 'Orden: ok t_8a8a4e94 (el sistema) -> ok de este.',
        idPropio: 't_fd5b30c4',
        idsVivos: new Set(['t_fd5b30c4', 't_8a8a4e94']),
      }).estado === 'VIVOS'],
    // La MENCION no es la instruccion. El mismo t_fd5b30c4 dice «REEMPLAZA a t_33406907
    // (archivado)»: es cierto, es util, y no le pide nada a nadie. Acusarlo obligaria a
    // borrar la historia del pedido para poner el gate en verde.
    ['citar un id sin `ok` es historia, no se acusa',
      cuerpoPunteroMuerto({
        texto: 'REEMPLAZA a t_33406907 (archivado). Mismo trabajo, mismo destino.',
        idPropio: 't_fd5b30c4',
        idsVivos: new Set(['t_fd5b30c4']),
      }).estado === 'SIN_PUNTEROS'],
    // 🔴 SIN EXCEPCION PARA LA CITA, y no es una postura: lo encontro este mismo gate, en
    // vivo, sobre el PRIMER pedido que se escribio para curar el defecto. Ese cuerpo explicaba
    // el cambio diciendo «aquel cuerpo te mandaba a apretar "ok t_bd62e5a0", y esa tarea esta
    // ARCHIVADA» — una cita, correcta y util, que el control acuso igual. La tentacion es
    // perdonar lo que esta entre comillas; la respuesta es NO, por dos motivos. Uno: la cadena
    // es TECLEABLE tal cual esta escrita, y Sergio Urcullo lee rapido — ve un `ok t_xxx` y lo
    // escribe. Dos: perdonar por comillas es el carve-out de notacion que esta familia de
    // gates ya aprendio a no hacer (se cita sin comillas, en mayusculas, con backticks...).
    // La regla que queda es simple y se puede obedecer: el cuerpo de un pedido no escribe la
    // forma `ok <id>` sobre algo que no esta abierto, ni para explicar. Se dice «el ok de esa
    // tarea» y el gate no tiene nada que acusar.
    ['citar la instruccion muerta entre comillas TAMBIEN se acusa: es tecleable tal cual',
      cuerpoPunteroMuerto({
        texto: 'Aquel cuerpo mandaba a apretar "ok t_bd62e5a0", y esa tarea esta archivada.',
        idPropio: 't_9ad5049f',
        idsVivos: new Set(['t_9ad5049f', 't_8a8a4e94']),
      }).estado === 'PUNTERO_MUERTO'],
    // Y su simetrica, que es la salida: nombrar la tarea SIN la forma tecleable no se acusa.
    // Sin este caso, la regla de arriba no tendria como cumplirse y el rojo no tendria cura.
    ['nombrar la tarea sin la forma tecleable es la salida, y no se acusa',
      cuerpoPunteroMuerto({
        texto: 'Aquel cuerpo mandaba a apretar el ok de t_bd62e5a0, que ya esta archivada.',
        idPropio: 't_9ad5049f',
        idsVivos: new Set(['t_9ad5049f', 't_8a8a4e94']),
      }).estado === 'SIN_PUNTEROS'],

    // Todo pedido dice «apreta este ok». Sin excluir el propio id, el pedido se acusaria a si
    // mismo en cuanto alguien lo escribiera con su id a la vista.
    ['el pedido no se acusa a si mismo',
      cuerpoPunteroMuerto({
        texto: 'Para publicar: ok t_fd5b30c4',
        idPropio: 't_fd5b30c4',
        idsVivos: new Set(['t_fd5b30c4']),
      }).estado === 'SIN_PUNTEROS'],
    // La direccion cara del error: con la lista sin leer, TODO id se ve muerto y el gate
    // mandaria a rehacer pedidos sanos.
    ['sin poder derivar las abiertas -> NO_MEDIDO, nunca acusar',
      cuerpoPunteroMuerto({
        texto: 'ok t_bd62e5a0',
        idPropio: 't_fd5b30c4',
        idsVivos: new Set(),
      }).estado === 'NO_MEDIDO'],
    // `abiertos` es el otro lado del control: si contara las terminadas, un `ok` sobre una
    // tarea `done` —que tampoco ejecuta— pasaria por vivo. Y si NO contara las reclamadas,
    // acusaria de muerto a un puntero que el brazo si ejecuta (el agujero del 2026-09-13).
    ['las abiertas incluyen la RECLAMADA y no las terminadas',
      [...barrerTablero({ tareas: [
        { id: 't_aaaaaaaa', status: 'ready', body: '' },
        { id: 't_bbbbbbbb', status: 'running', body: '' },
        { id: 't_cccccccc', status: 'done', body: '' },
      ] }).abiertos].join() === 't_aaaaaaaa,t_bbbbbbbb'],
    ['un tablero vacio no inventa abiertas',
      barrerTablero({ tareas: [] }).abiertos.size === 0],

    // CABLEADO, por el mismo motivo que el de `refsAlDia`: los casos de arriba prueban la
    // funcion, y los esquives baratos dejan los literales intactos y pasan en verde con el
    // control muerto.
    //
    // ⚠️ ANCLA LA CONDICION ENTERA, no el `push` suelto — y no es teorico: la primera version
    // de este caso pedia `/punteros\.push\(/` y `/if \(punteros\.length > 0\)/` por separado, y
    // con eso `if (false && r.estado === 'PUNTERO_MUERTO') punteros.push(...)` pasaba en
    // VERDE con el control apagado (medido acá mismo, mutando el archivo). El `push` tiene
    // que estar gobernado por ESA comparacion y por nada antes.
    ['punteros: `medirEnVivo` lo llama, acumula y CORTA',
      (() => {
        const fuente = readFileSync(fileURLToPath(import.meta.url), 'utf8');
        return /const\s+r\s*=\s*cuerpoPunteroMuerto\(\{/.test(fuente)
          && /if\s*\(r\.estado === 'PUNTERO_MUERTO'\)\s*punteros\.push\(/.test(fuente)
          && /if\s*\(\s*punteros\.length\s*>\s*0\s*\)/.test(fuente)
          && /idsVivos:\s*abiertos/.test(fuente);
      })()],

    // ── ¿el ok EJECUTA lo que el cuerpo promete? ──────────────────────────────────────
    // Los casos de la FUNCION viven en `pedido_deploy_entregado.test.mjs`, que es la cadena
    // que corre el integrador antes de tocar `main` — un caso que vive solo acá no lo corre
    // nadie. Acá queda unicamente lo que ese archivo no puede ver: el CABLEADO.
    //
    // Y hay un segundo motivo, medido al escribir esto: llamar a la funcion acá con
    // `const r = cuerpoNoEjecuta({...})` pone ROJO al gate derivado «un control que lee SOLO
    // el cuerpo no manda a comentar», que exige que toda llamada de esa forma empuje a un
    // acumulador. El gate tiene razon: una llamada que no acumula es un control muerto.
    //
    // CABLEADO, por el mismo motivo que los dos de arriba: los casos prueban la función y
    // los esquives baratos —llamarla y tirar el resultado, o `false &&` en la guarda— dejan
    // los literales intactos y pasan en verde con el control muerto.
    ['ejecuta: `medirEnVivo` lo llama, acumula y CORTA',
      (() => {
        const fuente = readFileSync(fileURLToPath(import.meta.url), 'utf8');
        return /const\s+e\s*=\s*cuerpoNoEjecuta\(\{/.test(fuente)
          && /if\s*\(e\.estado === 'NO_EJECUTA'\)\s*mudos\.push\(/.test(fuente)
          && /if\s*\(\s*mudos\.length\s*>\s*0\s*\)/.test(fuente);
      })()],

    // ── los refs con los que se mide, que hasta hoy nadie actualizaba ─────────────────
    // El caso que YA cumple, primero: sin él, un detector que marque SIEMPRE fallo pasaría
    // el de abajo y el gate saldría NO_MEDIDO para siempre — mudo en vez de falso, pero
    // igual de inútil.
    ['refs: los dos clones al dia -> se puede medir',
      refsAlDia({ repos: ['/a', '/b'], fetchear: () => true }).ok === true],
    ['refs: si un clon no se pudo actualizar NO se mide',
      refsAlDia({ repos: ['/a', '/b'], fetchear: (r) => r === '/a' }).ok === false],
    // Nombrarlo es lo único accionable: «no pude medir» sin decir cuál manda a adivinar.
    ['refs: y NOMBRA al que fallo',
      refsAlDia({ repos: ['/a', '/b'], fetchear: (r) => r === '/a' }).fallaron.join() === '/b'],
    // Estricto contra `true` a propósito: `sh` devuelve `''` o `null`, y un `!== true`
    // flojo (`!fetchear(...)`) leería cualquier cadena como éxito.
    ['refs: una respuesta que no es `true` cuenta como que NO se pudo',
      refsAlDia({ repos: ['/a'], fetchear: () => 'quizas' }).ok === false],

    // CABLEADO. Los casos de arriba prueban la función; éste prueba que `medirEnVivo` la
    // use y CORTE. Ancla la ASIGNACIÓN y el `if (` de apertura porque los dos esquives
    // baratos —llamarla y tirar el resultado, o anteponer `false &&` a la guarda— dejan el
    // literal intacto y pasan en verde con el gate muerto.
    ['refs: `medirEnVivo` los pone al dia y CORTA si no pudo',
      (() => {
        const fuente = readFileSync(fileURLToPath(import.meta.url), 'utf8');
        return /const\s+frescura\s*=\s*refsAlDia\(/.test(fuente)
          && /if\s*\(\s*!frescura\.ok\s*\)/.test(fuente)
          && /fetchear:\s*fetchearRepo/.test(fuente);
      })()],
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
