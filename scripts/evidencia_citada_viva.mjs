#!/usr/bin/env node
/**
 * evidencia_citada_viva.mjs — una linea de cola cuya EVIDENCIA declarada es el veredicto de otro
 * gate tiene que seguir obteniendo ese veredicto. Se corre el gate citado y se compara.
 *
 * NACE DEL 2026-09-26 22:30 La Paz, del item 🔴 de `cola/chatbot.md`: `deploy:ya-ocurrio` firmaba
 * «cierta» una afirmacion cuya consecuencia ya era falsa, porque juzga por ARCHIVO y no por
 * ARREGLO. Su juez (`juezDelMotor`) decide mirando si el archivo que el item NOMBRA esta entre los
 * desfasados de `/tmp/onia-bot`; `knowledge.onia.json` lo esta SIEMPRE mientras el pedido de deploy
 * del bot espere firma, asi que toda linea que lo nombre sale «cierta» sin importar si el arreglo
 * de ESE item ya viajo. El caso real: `chatbot.md:3888` declaraba *«`npm run precios:vivos` sigue
 * acusando al bot vivo»* y el gate hoy sale **0** — la linea mandaba a hacer a mano un install que
 * el deploy ya hace solo, y `deploy:ya-ocurrio` decia «0 mienten».
 *
 * POR QUE UN INSTRUMENTO APARTE Y NO EL ARREGLO OBVIO. El arreglo ingenuo —que `juezDelMotor` corra
 * el gate que la linea cita— mete una medicion VIVA dentro de un script cuyo `--self-check` esta en
 * la cadena raiz, y este repo ya prohibio esa forma: «un gate cuyo self-check necesita el repo
 * hermano NO va en la cadena». Aca el `--self-check` es PURO (el corredor se inyecta) y la medicion
 * viva vive en el alias `evidencia:citada`, que corre en la medicion de arranque del carril — el
 * mismo reparto que `campanas-vivas` y `bloqueo:citado`.
 *
 * QUE MIDE. Una cita ejecutable (`npm run <alias>` o `node <ruta>`) mas un CODIGO DE SALIDA
 * declarado a su lado (`→ exit 1`, `(exit 1)`, `sale 1`, `→ **0**`). Se corre y se compara:
 *   · el codigo coincide            → OK, la linea dice la verdad.
 *   · el codigo NO coincide         → ITEM: la linea MIENTE, y hay que editarla.
 *   · no se pudo correr / timeout   → NO MEDIDA (exit 2), nunca verde.
 *
 * LO QUE NO MIDE, dicho para que un cero sea legible: los NUMEROS de adentro de la salida. La
 * linea `plataforma-v1.md:1860` dice *«paso a "En organizaciones REALES: 4" (exit 1)»* y hoy son
 * **3**: el veredicto sigue siendo 1, asi que este gate la absuelve con razon. Juzgar el cuerpo de
 * la salida es otro gate y otra unidad; prometerlo aca seria el mismo error de unidad que este
 * archivo existe para no repetir.
 *
 * TAMPOCO mide las filas con la marca `**Verificador:** \`<comando>\` → <codigo>`: esas ya tienen
 * dueño (`bloqueos_vencidos.mjs`) y dos gates sobre el mismo sujeto es justo lo que `CLAUDE.md`
 * prohibe. Se saltan explicitamente y se cuentan.
 *
 * ⚠️ `sinHistoria()` NO SE APLICA ACA, Y ES UNA DECISION, NO UN OLVIDO. Ese helper blanquea los
 * items `- [x]` porque la prosa de un item cerrado es historia por construccion, y le saco 5 de 7
 * falsos positivos a `en_vuelo_vencido.mjs`. Pero la unidad de ESTE gate no es prosa: es «correr
 * este comando da este codigo», que es falsable por ejecucion y se lee como RECETA aunque viva
 * dentro de un item cerrado. El caso que lo decide es el que trajo este archivo: `chatbot.md:3888`
 * esta dentro de un `- [x]` y se comio una vuelta entera del carril mandando a instalar a mano.
 * Con `sinHistoria` puesto, este gate habria nacido ciego a su propio caso fundador.
 *
 * LA GUARDA QUE EVITA QUE ESTE GATE SE APAGUE SOLO: una cita que YA lleva su nota de correccion
 * fechada no se juzga. `bloqueo_citado_vivo.mjs` excluye la nota que cae en la MISMA frase; una
 * receta de reproduccion se corrige en el parrafo SIGUIENTE (asi estan hoy `chatbot.md:7832` y
 * `:7916`, las dos con su nota adyacente). Gritar sobre una linea que ya trae la correccion escrita
 * al lado es como se apaga un gate, asi que se mira tambien hacia adelante, hasta el fin del item.
 *
 *   node scripts/evidencia_citada_viva.mjs hermes-content/docs/cola/chatbot.md
 *   node scripts/evidencia_citada_viva.mjs --self-check
 */

import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { NOTA_DE_CORRECCION } from './lib/frases_de_cola.mjs';
import { validarComando, resolverBin } from './lib/comando_de_cola.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const TIMEOUT_MS = Number(process.env.ONIA_EVIDENCIA_TIMEOUT_MS || 300000);

export const SIN_MENTIRAS = 0;
export const MIENTEN = 1;
export const NO_PUDE_MEDIR = 2;

/** El codigo con el que TODO gate de este repo dice «no pude preguntar». Ver `medir()`. */
export const CODIGO_NO_MEDIDO = 2;

/** Una cita ejecutable dentro de backticks. Las dos formas que `validarComando` acepta. */
export const CITA = /`(npm run [\w:.-]+|node [\w./-]+)`/g;

/**
 * El codigo de salida declarado al lado de la cita.
 *
 * Se exige una PALABRA o una flecha: sin eso, `«\`npm run x\` de los 3 rubros»` se leeria como
 * «declara 3». Los adornos de markdown van en el medio a proposito (`→ **exit 0**` es la forma mas
 * comun en estas colas) y el digito es UNO solo: los codigos de salida que este repo usa son 0, 1
 * y 2, y aceptar `\d+` hacia que «exit 1114» de los tests contara como codigo.
 */
export const CODIGO = new RegExp(
  [
    // (a) con palabra: `exit 1`, `sale 1`, `→ **exit 0**`. La palabra desambigua sola.
    //
    // El PASADO (`salió 1`, `daba 2`) entra a proposito, aunque despues se descarte: si no se
    // extrae, la cita se cae del recuento sin motivo y el gate dice «22 saltadas» cuando en
    // realidad miro menos. Se extrae, se descarta por `NO_ES_RECETA_VIVA` y se CUENTA.
    '\\b(?:exit|sale|salga|sali[oó]|daba|dio|termina en)\\s*\\**(\\d)(?!\\d)',
    // (b) flecha pelada: `→ 0`, `→ **2**,`. El digito NO puede estar seguido de una palabra —
    // `→ 2 horarios con 33,7 h de aviso` (el texto real de `chatbot.md:7872`) declaraba un CONTEO
    // y este gate lo leia como codigo 2, o sea acusaba con una polaridad inventada. Que la
    // palabra fuera opcional despues de la flecha era todo el bug.
    '(?:→|->)\\s*\\**(\\d)(?!\\d)\\**(?!\\s*\\p{L})',
  ].join('|'),
  'iu',
);

/** La marca que `bloqueos_vencidos.mjs` ya mide: su sujeto no es de este gate. */
export const DEL_HERMANO = /\*\*Verificador:\*\*/;

/**
 * Las enmiendas que corrigen una RECETA, que se escriben distinto de las que corrigen un bloqueo.
 *
 * `NOTA_DE_CORRECCION` del lib compartido caza «acá decía», «corregido el N», «ya no es cierto»…
 * y NO caza la forma con la que estas colas enmiendan una reproduccion. Medido en el corpus real:
 * `chatbot.md:7917` dice *«✅ **CAMBIÓ el 2026-09-04: el gate mide `exit 0`**»* y `:7833` dice
 * *«🔴 **AMPLIADO el 2026-09-03**: ese gate llevaba una hora en VERDE»*. Con solo la lista
 * compartida, este gate acusaba a las dos — y un gate que grita sobre una linea que ya trae la
 * correccion escrita al lado es un gate que alguien apaga.
 *
 * NO se toco `NOTA_DE_CORRECCION`: la comparten `bloqueo_citado_vivo` y `en_vuelo_vencido`, y
 * ensancharla les haria perder sujetos en silencio (fallan ABIERTO). La diferencia es de unidad,
 * no de prolijidad: un bloqueo se corrige diciendo «ya no es cierto», una receta se corrige
 * diciendo «ya no da 1».
 *
 * Se exige FECHA en la primera forma a proposito. «cambió» suelto aparece en prosa comun; «cambió
 * el 2026-09-04» es un autor fechando una enmienda, que es justo lo que absuelve. La segunda forma
 * no la necesita porque ya nombra el veredicto nuevo.
 *
 * ⚠️ SIN `\b` DESPUES DE LA CLASE, y no es descuido. `\b` se define por `\w` = `[A-Za-z0-9_]`, y
 * `Ó` no es `\w`: entre «CAMBIÓ» y el espacio que sigue NO HAY word boundary, asi que
 * `cambi[oó]\b` no matchea «CAMBIÓ el 2026-09-04» — el texto real de `chatbot.md:7917`. Con
 * «AMPLIADO» si andaba (termina en `O`, que es `\w`), y esa asimetria es la que vuelve al bug
 * invisible: la mitad de los casos en verde. Es el mismo tropiezo de acento que ya se pago en esta
 * cola con la raiz `includ` contra «inclu-i-do». Lo caza el caso de abajo, con el texto del corpus.
 */
export const ENMIENDA_DE_RECETA =
  /(?:cambi[oó]|ampliad[oa]|corregid[oa]|rectificad[oa]|actualizad[oa]|caduc[oó]|venci[oó]|vencid[oa])[^.\n]{0,40}?\bel\s+\d|ya NO da|ya no (?:sale|reproduce|acusa)|hoy sale|pas[oó] a (?:exit|sale|dar)/i;

/**
 * Lo que delata que un codigo declarado NO es una receta viva, y por eso no se juzga.
 *
 * Derivado del corpus, no inventado. Medido el 2026-09-26 sobre las dos colas: de 33 citas con
 * codigo, la mayoria no afirmaba «corre esto y da esto HOY» sino una de estas tres cosas:
 *
 *   · PASADO — `chatbot.md:1309` *«`npm run bloqueo:citado` salió **1** con dos sujetos»*,
 *     `:8578` *«`sonda_widget.mjs` daba **exit 2**»*. Cuentan como se encontro un defecto que ya
 *     se arreglo; el codigo de entonces no es una promesa de ahora.
 *   · MUTACION — `chatbot.md:10726` *«con `git update-index --chmod=-x`, `npm run test:bot` sale 1
 *     … restaurado, 1114/1114 verdes»*. El 1 es el rojo-primero de un test, o sea la PRUEBA de que
 *     el gate sirve. Acusarlo seria castigar la unica practica que este repo exige.
 *   · BITACORA — las filas `| … |` de las tablas de medicion de arranque (`:11152`, `:11257`) son
 *     la foto de un dia, y una foto no se desmiente: se lee con su fecha.
 *
 * Acusar a cualquiera de esas tres es como se apaga un gate: 30 rojos que el lector sabe que estan
 * mal le enseñan a no mirar el 31, que es el unico verdadero. Se salta y SE CUENTA — el recuento
 * deja el punto ciego a la vista en vez de esconderlo detras de un cero.
 */
// ⚠️ Sin `\b` despues de `[oó]` / `[ií]`, por la MISMA razon que `ENMIENDA_DE_RECETA`: la vocal
// acentuada no es `\w`, asi que `sali[oó]\b` no cierra contra «salió » y el patron queda muerto
// justo en la mitad acentuada. Escrito con `\b` la primera vez, y la primera vez fallo.
export const NO_ES_RECETA_VIVA =
  /sali[oó]|daba\b|\bdio\b|hab[ií]a|qued[oó]|estaba\b|mutaci[oó]n|mutad|pinchad|restaurad|update-index|Gate 1|era REAL|\bantes:/i;

/** Cuanto se mira HACIA ADELANTE buscando la nota de correccion, en renglones. */
export const VENTANA_DE_NOTA = 14;

/** Un renglon que arranca un item de cola: la frontera natural de «el parrafo siguiente». */
const ITEM = /^\s*- \[[ x]\]/;

/**
 * ¿La cita de este renglon ya tiene su correccion escrita? Se mira el renglon, y despues hacia
 * adelante hasta el proximo item o titulo (tope `VENTANA_DE_NOTA`), que es donde un autor deja la
 * enmienda de una receta que dejo de reproducir.
 */
export function yaAnotada(renglones, i, ventana = VENTANA_DE_NOTA) {
  const enmienda = (linea) => NOTA_DE_CORRECCION.test(linea) || ENMIENDA_DE_RECETA.test(linea);
  if (enmienda(renglones[i])) return true;
  for (let j = i + 1; j < Math.min(renglones.length, i + 1 + ventana); j += 1) {
    const linea = renglones[j];
    if (ITEM.test(linea) || /^#{1,6} |^---\s*$/.test(linea)) break;
    if (enmienda(linea)) return true;
  }
  return false;
}

/**
 * Las citas de un documento que declaran un veredicto y se pueden juzgar.
 *
 * Sin red y sin disco: es lo que prueba el `--self-check`. Cada cita sale con su renglon (el que
 * hay que editar) y con el motivo cuando se salta, porque un gate que no dice lo que dejo afuera
 * se lee como «revise todo».
 */
export function citasDeEvidencia(md) {
  const renglones = md.split(/\r?\n/);
  const juzgables = [];
  const saltadas = [];
  for (let i = 0; i < renglones.length; i += 1) {
    const linea = renglones[i];
    for (const m of linea.matchAll(CITA)) {
      const comando = m[1];
      const cola = linea.slice(m.index + m[0].length, m.index + m[0].length + 160);
      const codigo = CODIGO.exec(cola);
      // El digito cae en el grupo 1 (forma con palabra) o en el 2 (flecha pelada): `CODIGO` es una
      // union de dos alternativas. Leer solo el 1 daba `NaN` en toda la forma `→ 0`, y un
      // `esperado: NaN` nunca es igual a nada, o sea que esas citas salian ACUSADAS siempre.
      const declarado = codigo ? Number(codigo[1] ?? codigo[2]) : null;
      const base = { comando, linea: i + 1, texto: linea.trim() };
      if (!codigo) continue; // una cita sin veredicto declarado no afirma nada que este gate mida
      if (linea.includes('~~')) { saltadas.push({ ...base, motivo: 'tachada: es historia' }); continue; }
      if (DEL_HERMANO.test(linea)) { saltadas.push({ ...base, motivo: 'la mide `bloqueos:vencidos`' }); continue; }
      if (linea.trimStart().startsWith('|')) { saltadas.push({ ...base, motivo: 'fila de bitacora: es la foto de un dia' }); continue; }
      if (NO_ES_RECETA_VIVA.test(linea)) { saltadas.push({ ...base, motivo: 'no es receta viva (pasado o mutacion)' }); continue; }
      if (yaAnotada(renglones, i)) { saltadas.push({ ...base, motivo: 'ya trae su nota de correccion' }); continue; }
      juzgables.push({ ...base, esperado: declarado });
    }
  }
  return { juzgables, saltadas };
}

/**
 * Corre una cita ya validada y devuelve su codigo, o `null` si no se pudo medir.
 *
 * `status` null = murio por señal o por timeout. No medir NO es «miente»: un gate que inventa un
 * rojo desde una medicion que no pudo hacer traba el merge de todos los carriles.
 */
export function correrCita(comando, scripts) {
  const plan = resolverBin(validarComando(comando, scripts));
  if (plan.error) return { codigo: null, error: plan.error };
  try {
    execFileSync(plan.bin, plan.args, { cwd: RAIZ, encoding: 'utf8', stdio: 'ignore', timeout: TIMEOUT_MS });
    return { codigo: 0 };
  } catch (e) {
    if (typeof e.status === 'number') return { codigo: e.status };
    return { codigo: null, error: `no se pudo correr (${e.code ?? 'timeout'})` };
  }
}

/**
 * A que script APUNTA una cita, mirando a traves del alias de `package.json`.
 *
 * Es la clave del cache, y no el texto de la cita, porque varias de estas mediciones ESCRIBEN en
 * produccion. `scripts/sonda_widget.mjs` le manda dos mensajes de verdad al widget del inbox 4 —el
 * de los leads reales— y el widget ratelimitea al 4.º pedido por IP. Esta cola lo cita de las dos
 * formas (`node scripts/sonda_widget.mjs` en `:3091` y `:8525`, `npm run sonda:widget` en `:8789`),
 * asi que cachear por texto lo corria DOS veces y duplicaba trafico de sonda sobre la bandeja que
 * un cliente usa. Un gate que mide no puede ensuciar mas que el defecto que busca.
 */
export function claveDeCache(comando, scripts = {}) {
  const npm = /^npm run ([\w:.-]+)$/.exec(comando);
  const cuerpo = npm ? scripts[npm[1]] : null;
  return (cuerpo ?? comando).trim();
}

/**
 * Compara lo declarado con lo medido. Un mismo script se corre UNA vez aunque lo citen diez
 * lineas: son 300 s de tope cada uno, varios tocan produccion, y las colas los repiten.
 */
export function medir(juzgables, correr, clave = (c) => c) {
  const cache = new Map();
  return juzgables.map((cita) => {
    const k = clave(cita.comando);
    if (!cache.has(k)) cache.set(k, correr(cita.comando));
    const { codigo, error } = cache.get(k);
    if (codigo === null) return { ...cita, estado: 'no-medida', medido: null, error };
    // ⚠️ UN `2` DEL GATE CITADO NO ES UN VEREDICTO QUE CONTRADIGA: es su propio NO MEDIDO. Todo
    // gate de este repo usa 2 para «no pude preguntar», asi que tratarlo como desacuerdo acusa a
    // la linea por un problema de AMBIENTE. Medido en la primera pasada viva (2026-09-27, desde
    // nodo-casa): `espejo-check.mjs` salio 2 —no alcanza `/opt` desde casa— y este gate llamo
    // mentirosa a una linea cierta. Es exactamente el falso positivo que el instrumento existe
    // para no cometer, cometido por el instrumento.
    if (codigo === CODIGO_NO_MEDIDO && cita.esperado !== CODIGO_NO_MEDIDO) {
      return { ...cita, estado: 'no-medida', medido: codigo, error: `el gate citado salio ${CODIGO_NO_MEDIDO} (su propio NO MEDIDO): no contesto` };
    }
    return { ...cita, estado: codigo === cita.esperado ? 'honesta' : 'miente', medido: codigo };
  });
}

/**
 * El veredicto. `miente` gana sobre `no-medida` a proposito: una mentira confirmada es un dato
 * accionable y no se puede perder detras de un ambiental de otro sujeto.
 */
export function veredicto(resultados) {
  if (resultados.some((r) => r.estado === 'miente')) return MIENTEN;
  if (resultados.some((r) => r.estado === 'no-medida')) return NO_PUDE_MEDIR;
  return SIN_MENTIRAS;
}

function selfCheck() {
  let fallos = 0;
  const ok = (que, condicion) => {
    console.log(`${condicion ? 'ok  ' : 'FAIL'} ${que}`);
    if (!condicion) fallos += 1;
  };

  // --- el extractor -------------------------------------------------------------------------
  const unaCita = '      **Reproduccion en 30 s:** `npm run demo:agendada` → exit 1.';
  const { juzgables } = citasDeEvidencia(unaCita);
  ok('extrae comando y codigo de la forma `→ exit N`', juzgables.length === 1 && juzgables[0].esperado === 1);
  ok('el comando viaja entero', juzgables[0]?.comando === 'npm run demo:agendada');
  ok('el renglon se reporta 1-indexado', juzgables[0]?.linea === 1);

  ok(
    'forma `(sale N ...)` — la de `chatbot.md:2551`',
    citasDeEvidencia('`npm run bot:vivo-al-dia` (sale 1 y NOMBRA los archivos)').juzgables[0]?.esperado === 1,
  );
  ok(
    'forma `(exit N)` con texto en medio — la de `plataforma-v1.md:1860`',
    citasDeEvidencia('`npm run qa:sin-rastro` paso a `En organizaciones REALES: 4` (exit 1)').juzgables[0]?.esperado === 1,
  );
  ok(
    'forma `→ **exit 0**` con adornos de markdown',
    citasDeEvidencia('`npm run reloj:vivo` → **exit 0**, «40 conversaciones»').juzgables[0]?.esperado === 0,
  );
  ok(
    'forma `node <ruta>` tambien es cita ejecutable',
    citasDeEvidencia('`node scripts/x.mjs` → 2').juzgables[0]?.comando === 'node scripts/x.mjs',
  );

  // Lo que NO tiene que morder. Cada uno es un falso positivo que costaria una vuelta.
  ok('una cita SIN veredicto declarado no se juzga', citasDeEvidencia('correr `npm run test:bot` antes').juzgables.length === 0);
  ok(
    'un numero suelto no es un codigo de salida',
    citasDeEvidencia('`npm run rubros:vendibles` de los 5 rubros activos').juzgables.length === 0,
  );
  ok(
    'un codigo de 4 digitos no es un codigo de salida (`exit 1114` de los tests)',
    citasDeEvidencia('`npm run test:bot` exit 1114').juzgables.length === 0,
  );
  const tachada = citasDeEvidencia('~~`npm run viejo:gate` → exit 1~~');
  ok('tachada = historia: no se juzga', tachada.juzgables.length === 0 && tachada.saltadas.length === 1);
  const delHermano = citasDeEvidencia('| S9 | **Verificador:** `npm run deploy:alcanzable` → 0 |');
  ok('la marca **Verificador:** es del gate hermano', delHermano.juzgables.length === 0);
  ok('y se cuenta, no se descarta en silencio', delHermano.saltadas[0]?.motivo.includes('bloqueos:vencidos'));

  // --- lo que NO es una receta viva, con los textos reales del corpus -----------------------
  ok(
    '⚠️ `→ 2 horarios` es un CONTEO, no un codigo (el texto real de `chatbot.md:7872`)',
    citasDeEvidencia('(`npm run anticipacion:viva` → 2 horarios con 33,7 h de aviso, exit 0)').juzgables[0]?.esperado === 0,
  );
  ok(
    'flecha pelada seguida de puntuacion SI es codigo',
    citasDeEvidencia('`npm run inbox:tenencia` → 0, todo en orden').juzgables[0]?.esperado === 0,
  );
  const enPasado = citasDeEvidencia('`npm run bloqueo:citado` salió **1** con dos sujetos');
  ok('pasado («salió 1») no se juzga: cuenta un defecto ya arreglado', enPasado.juzgables.length === 0);
  ok('y se cuenta con su motivo', enPasado.saltadas[0]?.motivo.includes('no es receta viva'));
  ok(
    'mutacion («con update-index … sale 1; restaurado, verdes») no se juzga',
    citasDeEvidencia('con `git update-index --chmod=-x reminder-run.sh`, `npm run test:bot` sale 1 con `fail 1`; restaurado')
      .juzgables.length === 0,
  );
  const bitacora = citasDeEvidencia('| `S16` sigue vivo | `npm run deploy:alcanzable` → exit **1**, `22fd088` |');
  ok('fila de bitacora no se juzga: es la foto de un dia', bitacora.juzgables.length === 0);
  ok('y tambien se cuenta', bitacora.saltadas[0]?.motivo.includes('bitacora'));
  ok(
    'pero una receta en presente SI se juzga (el texto real de `chatbot.md:2551`)',
    citasDeEvidencia('**Cómo se reproduce en 30 segundos:** `npm run bot:vivo-al-dia` (sale 1 y NOMBRA los')
      .juzgables[0]?.esperado === 1,
  );

  // --- la guarda de la nota de correccion ---------------------------------------------------
  ok(
    'nota de correccion en la MISMA frase: no se juzga',
    citasDeEvidencia('`npm run precios:vivos` → exit 1. Aca decia que acusaba y ya no.').juzgables.length === 0,
  );
  const conNotaAbajo = [
    '- [x] Item cerrado',
    '      **Reproduccion en 30 s:** `npm run demo:agendada` → exit 1.',
    '      ✅ **CAMBIO el 2026-09-04: el gate mide `exit 0`.** La reproduccion de arriba ya NO da 1.',
  ].join('\n');
  ok(
    'nota de correccion en el parrafo SIGUIENTE: no se juzga (el caso de `chatbot.md:7832`)',
    citasDeEvidencia(conNotaAbajo).juzgables.length === 0,
  );
  // Los DOS textos de enmienda reales de esta cola, copiados del corpus y no inventados: son los
  // que `NOTA_DE_CORRECCION` sola no cazaba, y por los que este gate nacio acusando en falso.
  ok(
    'enmienda real de `chatbot.md:7917` («CAMBIÓ el <fecha>») absuelve',
    citasDeEvidencia(
      ['      **Reproducción en 30 s:** `npm run demo:agendada` → exit 1 nombrando al contacto.',
       '      ✅ **CAMBIÓ el 2026-09-04: el gate mide `exit 0`, y no porque se lo aflojara.**'].join('\n'),
    ).juzgables.length === 0,
  );
  ok(
    'enmienda real de `chatbot.md:7833` («AMPLIADO el <fecha>») absuelve',
    citasDeEvidencia(
      ['      **Reproducción en 30 s:** `npm run demo:agendada` → exit 1.',
       '      🔴 **AMPLIADO el 2026-09-03 (vuelta siguiente): ese gate "en rojo y a la vista" llevaba una',
       '      hora en VERDE, y lo apagaba el propio chequeo de arranque de este carril.**'].join('\n'),
    ).juzgables.length === 0,
  );
  ok(
    'y la enmienda sin fecha pero con el veredicto nuevo tambien («ya NO da 1»)',
    citasDeEvidencia(
      ['      `npm run demo:agendada` → exit 1.', '      La reproducción de arriba ya NO da 1.'].join('\n'),
    ).juzgables.length === 0,
  );
  ok(
    '⚠️ pero «cambió» SIN fecha no absuelve: es prosa comun, no una enmienda',
    citasDeEvidencia(
      ['      `npm run demo:agendada` → exit 1.', '      Desde entonces cambió el orden de los mensajes.'].join('\n'),
    ).juzgables.length === 1,
  );

  const notaTrasFrontera = [
    '- [ ] Item A',
    '      `npm run demo:agendada` → exit 1.',
    '- [x] Item B',
    '      corregido el 2026-09-04: ya sale 0.',
  ].join('\n');
  ok(
    'la nota del item de AL LADO no absuelve: la ventana corta en el proximo item',
    citasDeEvidencia(notaTrasFrontera).juzgables.length === 1,
  );
  ok(
    'la ventana no es infinita: una nota 40 renglones abajo no absuelve',
    citasDeEvidencia(['      `npm run x:y` → exit 1.', ...Array(40).fill('      relleno'), '      corregido el 2026-09-04'].join('\n'))
      .juzgables.length === 1,
  );

  // --- la decision de NO aplicar sinHistoria ------------------------------------------------
  // El caso fundador vive dentro de un `- [x]`. Si alguien mete `sinHistoria()` aca «por
  // consistencia con en_vuelo_vencido», este caso se pone rojo y explica por que no va.
  const dentroDeCerrado = ['- [x] ✅ **CERRADO**', '      **Reproduccion:** `npm run precios:vivos` → exit 1.'].join('\n');
  ok(
    'una RECETA dentro de un item `- [x]` SI se juzga: es falsable por ejecucion, no prosa',
    citasDeEvidencia(dentroDeCerrado).juzgables.length === 1,
  );

  // --- el juicio ----------------------------------------------------------------------------
  const cita = { comando: 'npm run demo:agendada', linea: 7832, esperado: 1 };
  ok('declarado 1 y medido 0 → MIENTE', medir([cita], () => ({ codigo: 0 }))[0].estado === 'miente');
  ok('declarado 1 y medido 1 → honesta', medir([cita], () => ({ codigo: 1 }))[0].estado === 'honesta');
  ok(
    'la otra polaridad tambien: declarado 0 y medido 1 → MIENTE',
    medir([{ ...cita, esperado: 0 }], () => ({ codigo: 1 }))[0].estado === 'miente',
  );
  ok(
    'no se pudo correr → NO MEDIDA, nunca honesta',
    medir([cita], () => ({ codigo: null, error: 'timeout' }))[0].estado === 'no-medida',
  );
  // El caso que la primera pasada viva encontro: `espejo-check.mjs` salio 2 desde nodo-casa y este
  // gate acuso a una linea cierta. Un 2 del gate citado es SU no-medido, no un desacuerdo.
  ok(
    'el gate citado sale 2 (su NO MEDIDO) → NO MEDIDA, nunca MIENTE',
    medir([{ ...cita, esperado: 0 }], () => ({ codigo: 2 }))[0].estado === 'no-medida',
  );
  ok(
    'pero una linea que DECLARA 2 y recibe 2 es honesta',
    medir([{ ...cita, esperado: 2 }], () => ({ codigo: 2 }))[0].estado === 'honesta',
  );
  ok(
    'y una que declara 2 y recibe 0 SI miente',
    medir([{ ...cita, esperado: 2 }], () => ({ codigo: 0 }))[0].estado === 'miente',
  );

  let corridas = 0;
  medir([cita, { ...cita, linea: 7916 }], () => { corridas += 1; return { codigo: 1 }; });
  ok('el mismo comando se corre UNA vez aunque lo citen dos lineas', corridas === 1);

  // Y el caso que protege la bandeja de leads reales: el alias y su script son EL MISMO sujeto.
  const scriptsFalsos = { 'sonda:widget': 'node scripts/sonda_widget.mjs' };
  ok(
    'el alias y su script resuelven a la misma clave de cache',
    claveDeCache('npm run sonda:widget', scriptsFalsos) === claveDeCache('node scripts/sonda_widget.mjs', scriptsFalsos),
  );
  let sondas = 0;
  medir(
    [{ comando: 'npm run sonda:widget', esperado: 0 }, { comando: 'node scripts/sonda_widget.mjs', esperado: 0 }],
    () => { sondas += 1; return { codigo: 0 }; },
    (c) => claveDeCache(c, scriptsFalsos),
  );
  ok('la sonda que escribe en produccion se corre UNA vez, citada de las dos formas', sondas === 1);
  ok(
    'un alias desconocido no colapsa con otro: cae en su propio texto',
    claveDeCache('npm run otro:gate', scriptsFalsos) === 'npm run otro:gate',
  );

  ok('veredicto: una mentira → 1', veredicto([{ estado: 'honesta' }, { estado: 'miente' }]) === MIENTEN);
  ok('veredicto: la mentira gana sobre el no-medido', veredicto([{ estado: 'no-medida' }, { estado: 'miente' }]) === MIENTEN);
  ok('veredicto: sin mentiras pero con no-medido → 2', veredicto([{ estado: 'no-medida' }]) === NO_PUDE_MEDIR);
  ok('veredicto: todo honesto → 0', veredicto([{ estado: 'honesta' }]) === SIN_MENTIRAS);
  ok('veredicto: cero sujetos → 0', veredicto([]) === SIN_MENTIRAS);

  // --- la guarda de ejecucion, heredada del hermano -----------------------------------------
  ok(
    'un alias que no existe en package.json no se corre',
    Boolean(validarComando('npm run no-existe-jamas', {}).error),
  );
  ok('una ruta que se sale del repo no se corre', Boolean(validarComando('node ../fuera.mjs', {}).error));

  // --- el caso FUNDADOR, con el texto real de `chatbot.md:3888` -----------------------------
  // Tal como estaba escrito el 2026-09-26 antes de corregirlo: declara que el gate acusa y el
  // gate sale 0. Sin el codigo declarado no hay veredicto que comparar, y eso tambien se dice.
  const fundador = '      🔴 **NO DESPLEGADO.** `npm run precios:vivos` → exit 1, sigue acusando al bot vivo.';
  const f = citasDeEvidencia(fundador);
  ok('el caso fundador se extrae', f.juzgables.length === 1);
  ok('y con el gate en 0 sale MIENTE', medir(f.juzgables, () => ({ codigo: 0 }))[0].estado === 'miente');

  console.log(fallos ? `\n${fallos} FALLO(S)` : '\nself-check OK');
  return fallos ? 1 : 0;
}

async function medirVivo(rutas) {
  const scripts = JSON.parse(await readFile(join(RAIZ, 'package.json'), 'utf8')).scripts ?? {};
  const porCola = [];
  for (const ruta of rutas) porCola.push({ ruta, ...citasDeEvidencia(await readFile(ruta, 'utf8')) });

  const juzgables = porCola.flatMap((c) => c.juzgables.map((x) => ({ ...x, cola: c.ruta })));
  const saltadas = porCola.flatMap((c) => c.saltadas.map((x) => ({ ...x, cola: c.ruta })));

  const resultados = medir(
    juzgables,
    (comando) => correrCita(comando, scripts),
    (comando) => claveDeCache(comando, scripts),
  );

  // El denominador primero: "0 mienten" sobre 0 sujetos es un detector ciego, y sobre 20 es una
  // cola sana. Las dos cosas se leen igual si no se imprime el denominador.
  console.log(
    `Citas que declaran el veredicto de otro gate: ${juzgables.length} juzgables · ${saltadas.length} saltadas ` +
      `(${saltadas.filter((s) => s.motivo.startsWith('ya trae')).length} ya con su nota de correccion).`,
  );

  for (const r of resultados) {
    const etiqueta = r.estado === 'miente' ? 'ITEM   ' : r.estado === 'no-medida' ? 'NO MEDI' : 'OK     ';
    const detalle =
      r.estado === 'no-medida'
        ? `no se pudo correr \`${r.comando}\`: ${r.error}`
        : `\`${r.comando}\` declara ${r.esperado} y sale ${r.medido}`;
    console.log(`  ${etiqueta} ${r.cola.replace(/^.*cola\//, '')}:${r.linea} — ${detalle}`);
  }

  const mienten = resultados.filter((r) => r.estado === 'miente');
  if (mienten.length) {
    console.error(
      `\n🔴 ${mienten.length} linea(s) declaran un veredicto que el gate citado ya no da. ` +
        `Editarlas: la evidencia caduco, no el arreglo.`,
    );
  } else if (resultados.some((r) => r.estado === 'no-medida')) {
    console.error(`\nNO MEDIDO — alguna cita no se pudo correr. No medir no es estar bien.`);
  } else {
    console.log(
      `\nOK — las ${resultados.length} cita(s) juzgadas siguen obteniendo el veredicto que declaran.`,
    );
  }

  return veredicto(resultados);
}

const esMain = process.argv[1] && process.argv[1].endsWith('evidencia_citada_viva.mjs');
if (esMain) {
  const args = process.argv.slice(2);
  if (args.includes('--self-check')) {
    process.exit(selfCheck());
  } else {
    const rutas = args.filter((a) => !a.startsWith('--'));
    if (!rutas.length) {
      console.error('uso: node scripts/evidencia_citada_viva.mjs <cola.md> [...] | --self-check');
      process.exit(NO_PUDE_MEDIR);
    }
    process.exit(await medirVivo(rutas));
  }
}
