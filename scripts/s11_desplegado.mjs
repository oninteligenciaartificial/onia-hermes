#!/usr/bin/env node
/**
 * s11_desplegado.mjs — ¿el build que CORRE ya dejo de dibujar el nombre crudo del icono?
 *
 * Nace del 2026-09-02 y de la fila S11 de `hermes-content/docs/cola/chatbot.md`, que es la
 * fila mas cara del carril para que se pudra en silencio:
 *
 *   El item "Requerimientos" del menu usaba `assignment_turned_in`, que NO esta en la fuente
 *   subseteada que se publica, asi que el navegador dibuja la PALABRA en vez del icono. El
 *   arreglo (`22fd088`, ya en `origin/master`) lo cambia por `task_alt`, que si esta. Lo unico
 *   que falta es el swap en produccion — un deploy, que es de Sergio.
 *
 *   Hasta hoy eso se comprobaba a mano y solo cuando alguien se acordaba. Es exactamente la
 *   condicion con la que **S16 vencio en silencio**: un bloqueo que ya no bloquea sigue
 *   pidiendole a Sergio una decision que ya tomo, y le presta su motivo falso al de al lado.
 *
 *   node scripts/s11_desplegado.mjs      (o `npm run s11:desplegado`)
 *   node scripts/s11_desplegado.mjs --self-check
 *
 * QUE MIDE. El contenedor `onia-platform` del VPS: el build publicado en `/app/.next`. No el
 * host, no el repo, no `origin/master` — el que CORRE. Es la trampa que este carril ya pago con
 * el bot, cuyo motor vivia en tres lugares y se verifico el equivocado.
 *
 * ⚠️ POR QUE NO ES UN `grep assignment_turned_in`, que era lo obvio. Porque el fuente ARREGLADO
 * sigue conteniendo esa cadena: `components/layout/navigation.ts:45` la nombra en un comentario
 * que explica por que se eligio `task_alt`, y `scripts/iconos-en-la-fuente.mjs` la usa de caso
 * de prueba. Hoy la minificacion los borra, pero eso es una propiedad del minificador, no del
 * arreglo: alcanza un source map, un chunk sin minificar o que alguien mueva el comentario a un
 * string para que el grep quede en ROJO PARA SIEMPRE. Un verificador que no puede ponerse verde
 * es peor que ninguno — es justo el modo de falla que este script existe para cerrar.
 *
 * Por eso mide el PAR ruta→icono, que es el hecho del mundo que la fila declara: que entrada de
 * menu apunta a `/requerimientos` y con que icono la dibuja. Un comentario no forma ese par.
 *
 * CODIGOS DE SALIDA
 *   0  el build que corre ya NO dibuja el nombre crudo  → S11 satisfecho, la fila se cierra
 *   1  el defecto sigue vivo, y se nombra el icono      → sigue bloqueado
 *   2  no se pudo medir (docker/ssh caido, build con otra forma) → sigue bloqueado
 *
 * FALLO CONSERVADOR, igual que `bloqueos_vencidos.mjs`: no medir NO es estar resuelto. Dejar un
 * bloqueo de mas cuesta una vuelta; cerrarlo de menos le pide a Sergio un deploy que ya hizo.
 *
 * NO TOCA NADA. Lee. Mismo molde que `hermes-content/deploy/vps-ops/bot/espejo-check.mjs`: si
 * `docker` esta en esta maquina (el loop corre DENTRO del VPS desde el 2026-09-01) se ejecuta
 * directo; si no, se cae al SSH de siempre. Env opcionales: ONIA_VPS_HOST, ONIA_VPS_KEY,
 * ONIA_PLATFORM_CONTAINER, ONIA_PLATFORM_BUILD_DIR.
 */

import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

/** El icono roto: el que la fila S11 manda sacar de produccion. */
export const ICONO_ROTO = 'assignment_turned_in';

/** La ruta cuya entrada de menu se mide. Es el "Requerimientos" del sidebar. */
export const RUTA = '/requerimientos';

/**
 * Los iconos con los que el build dibuja la entrada de `/requerimientos`.
 *
 * Las entradas del menu se compilan a objetos PLANOS —`{href:"...",icon:"...",label:"...",
 * roles:[...k]}`— asi que se puede aislar el objeto entero por sus llaves y sacar el icono de
 * ADENTRO. Es lo que evita el error de una ventana de contexto: en el bundle real la entrada de
 * al lado termina en `icon:"credit_score",label:"Fiados",roles:[...k]}` justo antes, y mirar
 * hacia atras un puñado de caracteres devolveria ESE icono. Aislar el objeto tambien aguanta que
 * el orden de las claves cambie, cosa que la adyacencia `href` → `icon` no aguantaria.
 *
 * Devuelve la lista de iconos encontrados (el menu declara la entrada varias veces, una por
 * rubro). Vacia = el build no tiene la forma esperada, y eso se lee como "no medido".
 */
export function iconosDeLaRuta(texto) {
  const iconos = [];
  for (const objeto of String(texto).matchAll(/\{[^{}]*\}/g)) {
    const cuerpo = objeto[0];
    // Se exige la ruta como VALOR entre comillas y no como subcadena: `"/requerimientos"` y no
    // `"/requerimientos/nuevo"`, que es otra pantalla y no es la entrada del menu.
    if (!new RegExp(`["']${RUTA}["']`).test(cuerpo)) continue;
    const icono = /\bicon["']?\s*:\s*["']([a-z0-9_]+)["']/i.exec(cuerpo);
    if (icono) iconos.push(icono[1]);
  }
  return [...new Set(iconos)].sort();
}

/**
 * El veredicto, separado de la lectura a proposito: es lo que se prueba sin docker ni red.
 */
export function juzgar(iconos) {
  if (!iconos.length) {
    return {
      codigo: 2,
      mensaje:
        `NO MEDIDO — el build que corre no declara ninguna entrada de menu para \`${RUTA}\`. ` +
        'Puede que el bundle haya cambiado de forma. No medir NO es estar resuelto: S11 sigue bloqueado.',
    };
  }
  if (iconos.includes(ICONO_ROTO)) {
    return {
      codigo: 1,
      mensaje:
        `DEFECTO VIVO — el build que corre todavia dibuja \`${RUTA}\` con \`${ICONO_ROTO}\`, ` +
        'que no esta en la fuente subseteada: el menu muestra la PALABRA en vez del icono. ' +
        'Falta el swap en produccion (S11, y el deploy es de Sergio).',
    };
  }
  return {
    codigo: 0,
    mensaje:
      `RESUELTO — el build que corre dibuja \`${RUTA}\` con \`${iconos.join(', ')}\`, ` +
      `ya no con \`${ICONO_ROTO}\`. El swap llego: S11 esta satisfecho y su fila se cierra.`,
  };
}

/**
 * El texto del build publicado, elegido segun DONDE corre este script — mismo criterio que
 * `ladoVps` de `espejo-check.mjs`.
 *
 * No se baja el bundle entero (son megabytes): se traen solo los objetos que nombran la ruta,
 * que es lo unico que se mide.
 *
 * ⚠️ EL BUNDLE SE PARTE EN `}` ANTES DE FILTRAR, y no es un adorno: es la diferencia entre 0,8 s
 * y 48 s. Lo obvio era `grep -o ".\{0,220\}/requerimientos.\{0,220\}"`, pero un chunk minificado
 * es UNA linea de megabytes y esa ventana obliga a backtrackear en cada posicion — medido el
 * 2026-09-02: 13 s con ventana 60, 27 s con 120, 48 s con 220, lineal en el ancho. El gate que
 * lo invoca corta a los 120 s y ahi un timeout se lee como "no medido": el verificador se
 * volveria inutil solo con que el build crezca. Partir en `}` deja registros de decenas de bytes
 * —las entradas de menu son objetos PLANOS, uno por registro— y el filtro pasa a ser trivial. El
 * `}` se vuelve a pegar porque es lo que delimita el objeto para `iconosDeLaRuta`.
 */
export function leerBuild({ contenedor, dir, host, key }) {
  // `grep` sale 1 cuando no encontro nada, y eso NO es un error de lectura: es un build sin la
  // ruta, que `juzgar` ya traduce a "no medido". Por eso se perdona con `|| true` y se distingue
  // del fallo real de docker/ssh, que si tira.
  const guion =
    `docker exec ${contenedor} sh -c ` +
    `'grep -rl "${RUTA}" ${dir} 2>/dev/null | while IFS= read -r f; do ` +
    `tr "}" "\\n" < "$f" | grep -F "${RUTA}" | sed "s/$/}/"; done || true'`;

  const local = () => execFileSync('sh', ['-c', guion], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });

  const remoto = () => {
    const args = ['-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=20'];
    if (key) args.push('-i', key);
    args.push(host, guion);
    return execFileSync('ssh', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  };

  try {
    execFileSync('docker', ['inspect', '--format', '{{.State.Running}}', contenedor], { stdio: 'ignore' });
    return local();
  } catch {
    return remoto();
  }
}

// ---------------------------------------------------------------------------

if (process.argv.includes('--self-check')) {
  // Contados por el script y no escritos a mano: un conteo hardcodeado deja de coincidir en
  // cuanto se agrega un caso, y un gate que miente en su propio numero ya no es un gate.
  let casos = 0;
  const afirmar = (cond, que) => { casos++; if (!cond) { console.error('FALLO:', que); process.exitCode = 1; } };

  // Bytes REALES del build que corre hoy, copiados de `docker exec … grep -o` el 2026-09-02.
  // Es el caso que importa: el defecto vivo, con la entrada de "Fiados" pegada justo antes.
  const vivo =
    'iados",icon:"credit_score",label:"Fiados",roles:[...k]},' +
    '{href:"/requerimientos",icon:"assignment_turned_in",label:"Requerimientos",roles:[...k]},' +
    '{href:"/contabilidad",icon:"account_balance",label:"Contabilidad",roles:[...k]}';

  afirmar(iconosDeLaRuta(vivo).join() === 'assignment_turned_in', 'saca el icono del build vivo de hoy');
  afirmar(juzgar(iconosDeLaRuta(vivo)).codigo === 1, 'con el defecto vivo sale 1');
  afirmar(juzgar(iconosDeLaRuta(vivo)).mensaje.includes(ICONO_ROTO), 'y NOMBRA el icono, como pide la fila S11');

  // El mismo bundle despues del swap: es la unica forma de que la fila se pueda cerrar sola.
  const arreglado = vivo.replace('assignment_turned_in', 'task_alt');
  afirmar(iconosDeLaRuta(arreglado).join() === 'task_alt', 'saca el icono nuevo despues del swap');
  afirmar(juzgar(iconosDeLaRuta(arreglado)).codigo === 0, 'con el defecto resuelto sale 0');

  // LA RAZON DE SER DEL SCRIPT: el fuente arreglado SIGUE nombrando el icono roto en comentarios
  // (`navigation.ts:45` y `scripts/iconos-en-la-fuente.mjs`). Un `grep assignment_turned_in`
  // quedaria en rojo para siempre si alguno de esos sobreviviera al build.
  const conComentario =
    '// El icono es `task_alt` y no `assignment_turned_in` a proposito: el segundo NO esta\n' +
    '{href:"/requerimientos",icon:"task_alt",label:"Requerimientos",roles:["ADMIN"]}';
  afirmar(juzgar(iconosDeLaRuta(conComentario)).codigo === 0, 'un comentario que nombra el icono roto NO deja la fila en rojo');
  afirmar(/assignment_turned_in/.test(conComentario), 'y ese texto SI contiene la cadena: por eso un grep crudo no servia');

  // Una ventana de contexto hacia atras devolveria `credit_score`, el icono del vecino.
  afirmar(!iconosDeLaRuta(vivo).includes('credit_score'), 'no confunde el icono de la entrada de al lado');

  // El orden de las claves lo decide el bundler, no nosotros.
  afirmar(
    iconosDeLaRuta('{icon:"task_alt",href:"/requerimientos",label:"Requerimientos"}').join() === 'task_alt',
    'aguanta que el bundler ponga `icon` antes que `href`',
  );
  afirmar(
    iconosDeLaRuta('{"href":"/requerimientos","icon":"task_alt"}').join() === 'task_alt',
    'aguanta las claves entre comillas (chunk sin minificar)',
  );

  // Otra pantalla que empieza igual no es la entrada del menu.
  afirmar(
    iconosDeLaRuta('{href:"/requerimientos/nuevo",icon:"add",label:"Nuevo"}').length === 0,
    'una subruta no se confunde con la entrada del menu',
  );

  // Fallo conservador: no medir no es estar resuelto.
  afirmar(juzgar([]).codigo === 2, 'un build sin la ruta se lee como NO MEDIDO, no como resuelto');
  afirmar(juzgar([]).mensaje.includes('sigue bloqueado'), 'y lo dice: dejar un bloqueo de mas cuesta menos que cerrarlo de menos');

  // El menu declara la entrada una vez por rubro: si UNA sigue rota, el defecto sigue vivo.
  afirmar(juzgar(['assignment_turned_in', 'task_alt']).codigo === 1, 'si una sola de las copias sigue rota, sale 1');

  if (!process.exitCode) console.log(`self-check: ok — ${casos} casos`);
  process.exit(process.exitCode || 0);
}

function main() {
  const contenedor = process.env.ONIA_PLATFORM_CONTAINER || 'onia-platform';
  const dir = process.env.ONIA_PLATFORM_BUILD_DIR || '/app/.next';
  const host = process.env.ONIA_VPS_HOST || 'root@187.77.16.63';
  const key = process.env.ONIA_VPS_KEY || '';

  let texto;
  try {
    texto = leerBuild({ contenedor, dir, host, key });
  } catch (e) {
    console.error(
      `NO MEDIDO — no se pudo leer el build de \`${contenedor}:${dir}\`: ${e.message.split('\n')[0]}. ` +
        'No medir NO es estar resuelto: S11 sigue bloqueado.',
    );
    return 2;
  }

  const veredicto = juzgar(iconosDeLaRuta(texto));
  console[veredicto.codigo === 0 ? 'log' : 'error'](veredicto.mensaje);
  return veredicto.codigo;
}

// Solo corre la medicion VIVA si se lo invoca como programa. Sin esta guarda, un `import` de las
// funciones puras —para un test, o para leerlas desde otro gate— dispara un `docker exec` contra
// produccion como efecto de cargar el modulo. Medido: paso al probar el parser contra la salida
// real.
//
// ⚠️ `pathToFileURL` y no `new URL("file://" + argv[1])`, que es el molde que venia copiado de
// `espejo-check.mjs`. Con `node -e "import(...)" <arg>`, `argv[1]` es el ARGUMENTO y no una ruta,
// y concatenarlo tira `ERR_INVALID_URL` — o sea que el modulo no se podia importar con argumentos
// sin romperse. Medido el 2026-09-02 haciendo exactamente eso. `pathToFileURL` ademas resuelve
// solo el escapado y las barras invertidas, sin el reemplazo a mano.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main());
}
