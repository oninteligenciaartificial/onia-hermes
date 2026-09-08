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

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
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

/** Fecha de un commit de `onia-hermes` en epoch, o `null` si el sha no resuelve. */
function epochCommitHermes(sha) {
  const crudo = sh('git', ['-C', RAIZ, 'log', '-1', '--format=%ct', sha]);
  return crudo && /^\d+$/.test(crudo.trim()) ? Number(crudo.trim()) : null;
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
    try {
      execFileSync('git', ['-C', REPO_PLATAFORMA, 'merge-base', '--is-ancestor', sha, vivo], { stdio: 'ignore', timeout: 15_000 });
      return true;
    } catch {
      return false;
    }
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
  const noMedidos = [];
  // `noMedidos` y `sinCubrir` NO son lo mismo, y mezclarlos fue el bug: el primero es
  // transitorio (el SSH no contestó, el sha no resuelve) y se cura solo en la vuelta
  // siguiente; el segundo es un AGUJERO del gate, que no se cura nunca y hay que escribirle
  // instrumento. Impresos juntos, el segundo se lee como ruido de ambiente y sobrevive.
  const sinCubrir = [];
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
        // El sub-describe de landing NO se mide todavía: exige decidir qué commit VIAJA al
        // navegador. Se dice acá para que un OK de arriba no se lea como «revisado entero».
        sinCubrir.push(`${p.id} (landing): falta medir si SUB-describe — sin instrumento`);
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
