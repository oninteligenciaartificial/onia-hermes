#!/usr/bin/env node
/**
 * bloqueo_citado_vivo.mjs — una cola que dice "esto depende de Sergio Urcullo (tarea t_XXX)"
 * tiene que citar una tarea que SIGA VIVA.
 *
 * Nace del 2026-09-25, midiendo `plataforma-v1.md:267`:
 *
 *   "No se pudo mirar renderizado con sesión real — sigue vivo el corte de 2FA que manda
 *    toda ruta del panel a /profile?mfa=obligatorio (tarea `t_3bb6b9ee`, depende de Sergio
 *    Urcullo)."
 *
 *   Las dos mitades de esa frase estaban vencidas: la tarea `t_3bb6b9ee` estaba ARCHIVADA
 *   desde el 2026-09-18, y el corte de 2FA se habia resuelto el 2026-09-24 cableando TOTP en
 *   `scripts/lib/sesion_dueno.mjs`. Medido ese dia: `mirar_bandeja_dueno.mjs --ruta /inbox`
 *   sale 0, con sesion aal2 y URL final `/inbox`. O sea la linea le pedia a Sergio Urcullo una
 *   decision que ya habia tomado, y de paso declaraba imposible la unica verificacion que este
 *   carril necesita — MIRAR una pantalla con sesion real.
 *
 *   node scripts/bloqueo_citado_vivo.mjs hermes-content/docs/cola/plataforma-v1.md
 *   node scripts/bloqueo_citado_vivo.mjs --self-check
 *
 * POR QUE NO LO AGARRABA `bloqueos_vencidos.mjs`. Ese gate mide las filas de la tabla
 * "Bloqueado en Sergio" que declaran su `**Verificador:**`. Este bloqueo no estaba en ninguna
 * tabla —vivia en el cuerpo de un item— y `plataforma-v1.md` NO TIENE esa tabla, asi que el
 * gate sale "NO MEDIDO" para esa cola entera. Los dos gates son complementarios y ninguno
 * reemplaza al otro: aquel pregunta "¿el verificador ya sale verde?", este pregunta "¿la
 * tarea que esta linea nombra como freno sigue existiendo?".
 *
 * QUE MIDE. Lineas que nombran un id del tablero (`t_` + 8 hex) Y ADEMAS hablan en PRESENTE de
 * estar esperando algo ("depende de Sergio", "espera decision", "sigue bloqueado"...). De cada
 * id citado asi se le pregunta al tablero su estado:
 *   - vivo (`ready`/`todo`/`blocked`/`in_progress`) → OK, la linea dice la verdad.
 *   - `done` / `archived` / inexistente              → ITEM: la linea cita un freno que ya no existe.
 *
 * POR QUE SE PREGUNTA POR EL ID Y NO SE LISTA TODO. `onia-tablero.sh list` no devuelve las
 * ARCHIVADAS, asi que "no esta en la lista" mezcla archivada con inexistente... y tambien con
 * "la lista vino truncada". Un gate que concluye ROJO desde una lista incompleta traba el
 * merge de TODOS los carriles por un problema de paginado. `show <id>` es la respuesta
 * autoritativa sobre UN id, y los ids que importan son poquitos (los de lineas con lenguaje de
 * bloqueo), asi que preguntar de a uno es barato y no se apoya en la completitud de nada.
 *
 * FALLO CONSERVADOR, igual que `bloqueos_vencidos.mjs`. Si el tablero no se puede consultar
 * (no existe el shim, timeout, salida sin `status:`), el id sale NO MEDIDO y el gate termina
 * en 2, no en 1. No medir NO es "esta vencido": cerrar un bloqueo de menos le pide a Sergio
 * Urcullo algo que ya hizo, pero inventarle un rojo a la cadena deja a todos sin mergear.
 */

import { readFile } from 'node:fs/promises';
// Sincrono y solo para el `--self-check`, que se lee a si mismo para verificar el camino de
// exito que no es una funcion pura (el de cero sujetos vive en el cuerpo del CLI).
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

const TABLERO = process.env.ONIA_TABLERO || '/root/bin/onia-tablero.sh';
const TIMEOUT_MS = Number(process.env.ONIA_BLOQUEO_CITADO_TIMEOUT_MS || 60000);

const ID = /t_[0-9a-f]{8}/g;

/**
 * Los estados en los que una tarea todavia puede frenar algo. Cualquier otro (`done`,
 * `archived`, y lo que el tablero invente despues) NO frena: por eso la lista blanca es de lo
 * VIVO y no una lista negra de lo muerto — un estado nuevo tiene que entrar a mano, y mientras
 * tanto se lee como muerto, que es el lado barato de equivocarse.
 */
export const ESTADOS_VIVOS = new Set(['ready', 'todo', 'blocked', 'in_progress', 'doing']);

/**
 * El lenguaje que hace que una cita sea un FRENO y no una nota historica.
 *
 * Es deliberadamente corto. Las colas nombran decenas de tareas como historia ("cerrado en
 * t_XXX", "lo midio t_XXX") y esas citas SON correctas apuntando a una tarea done — marcarlas
 * seria el gate gritando en falso, que es como se apaga un gate. Solo muerde el presente:
 * la linea tiene que decir que algo ESTA esperando.
 *
 * ⚠️ AMPLIADO el 2026-09-26, y el motivo importa mas que las frases nuevas: esta lista blanca
 * salio `exit 0` sobre `cola/chatbot.md` mientras SIETE lineas citaban `t_c2fab948` — ya
 * ARCHIVADA — y una decia textualmente "(pedido `t_c2fab948`, vivo)". Se escapaba por la
 * CONJUGACION: la lista pedia "esperando el ok" y el archivo decia "esperan el ok". Una lista
 * blanca de frases falla ABIERTA con la proxima redaccion, y el `exit 0` la deja invisible.
 * Por eso ademas de las frases nuevas, el gate ahora IMPRIME cuantos ids vio en total: un cero
 * de sujetos sobre un archivo lleno de ids es la firma de este mismo fallo.
 */
export const LENGUAJE_DE_FRENO =
  /depende de Sergio|espera (?:la )?decisi|esperan?(?:do)?\s+(?:el\s+|su\s+)?`?ok|sigue (?:vivo el |sin )?bloquead|sigue bloqueado|bloqueado en Sergio|pendiente de Sergio|necesita el ok de Sergio|sigue vivo el corte|ya est[aá] pedido|t_[0-9a-f]{8}`?\s*,?\s*(?:y\s+)?(?:sigue\s+)?vivo/i;

/**
 * Citar un id como EL OK QUE HAY QUE APRETAR es la forma mas caable de este fallo, y no la
 * cubre ninguna frase de espera: "se pone verde cuando el `ok` de `t_XXX` publique el bot" no
 * dice que nada este bloqueado, pero le dice a Sergio Urcullo QUE id contestar. Si esa tarea
 * esta archivada, `ok <id>` **no ejecuta** (lista blanca de estados vivos, exit 3) y el deploy
 * se pierde en silencio — el peor modo de falla posible, porque quien lo pidio cree que salio.
 *
 * VA SIN `/i` A PROPOSITO. La instruccion se escribe en minuscula (`ok <id>`, como en todos los
 * prompts), mientras que `OK t_XXX (bot): sigue VIGENTE` es la salida LITERAL del gate
 * `pedido:entregado` copiada en una tabla de evidencia — historia fechada, no una instruccion.
 * Distinguirlas por la caja es lo unico que separa el sujeto real del falso positivo que
 * apagaria el gate.
 *
 * ⚠️ EL HUECO ENTRE `ok` Y EL ID, ampliado el 2026-09-26. Antes se exigia que el id viniera
 * PEGADO ("ok t_X" u "ok de t_X"), y la cola escribia **"el `ok` de Sergio Urcullo en
 * `t_76cdb5dc`"** — el destinatario metido en medio. Tres lineas citaban una tarea archivada y
 * el gate salia verde. Ahora se admite cualquier relleno corto que NO cruce un fin de frase:
 * el limite de 40 caracteres y la exclusion de `.!?` son lo que impide que "ok" enganche un id
 * de la frase de al lado.
 */
export const INSTRUCCION_DE_OK = /`?\bok\b`?[^.!?\n]{0,40}?`?t_[0-9a-f]{8}/;

/**
 * Un `ok` YA CONTESTADO no es una instruccion: es el acuse de que el deploy salio, y su id
 * apunta —correctamente— a una tarea `done`. Marcarlo seria el gate gritando en falso sobre la
 * unica clase de linea que conviene tener escrita.
 *
 * Medido el 2026-09-26: `plataforma-v1.md:6280` dice "Sergio Urcullo contesto `ok t_24fa76aa` a
 * las 18:43 UTC y el brazo ejecutor publico el bot" — `t_24fa76aa` esta `done` y la frase es
 * cierta. Fue el unico falso positivo de los 16 sujetos que aparecieron al ampliar el detector,
 * y se encontro porque se leyeron los 16 a mano antes de commitear el gate.
 *
 * Solo desactiva `INSTRUCCION_DE_OK`. `LENGUAJE_DE_FRENO` sigue midiendo la misma linea: si
 * alguien escribe "contesto ok t_viejo, y t_nuevo sigue esperando el ok", el freno nuevo muerde
 * igual por la otra via.
 *
 * `lleg[oó]` entro el 2026-09-26: "El ok de Sergio Urcullo llego (tarea `t_X`, hoy `archived`)"
 * es el acuse de un deploy que ya salio, y la frase misma dice que la tarea esta archivada.
 */
export const OK_YA_CONTESTADO = /contest[oó]|respondi[oó]|lleg[oó]|ya dio el|dio el `?ok`? (?:a|de)\b/i;

/*
 * El parser de frases, la guarda de notas de correccion y el cierre de frase viven en
 * `scripts/lib/frases_de_cola.mjs` desde el 2026-09-26: los necesita tambien
 * `en_vuelo_vencido.mjs`, y este archivo no se puede importar (su CLI y su `--self-check`
 * corren a nivel de modulo). Se re-exportan porque el `--self-check` de abajo los afirma.
 */
import { NOTA_DE_CORRECCION, cierraFrase, frases } from './lib/frases_de_cola.mjs';
export { NOTA_DE_CORRECCION, cierraFrase, frases };

/**
 * Saca las citas que afirman un freno vigente. Sin red y sin disco: es lo que se prueba en
 * `--self-check`.
 *
 * El id se reporta con SU renglon —no con el de la frase— porque el renglon del id es el que
 * hay que editar, y en un archivo de 9.000 renglones esa diferencia es la mitad del arreglo.
 */
export function citasDeBloqueo(md) {
  const citas = [];
  for (const frase of frases(md, ID)) {
    if (NOTA_DE_CORRECCION.test(frase.texto)) continue;
    const instruye = INSTRUCCION_DE_OK.test(frase.texto) && !OK_YA_CONTESTADO.test(frase.texto);
    if (!LENGUAJE_DE_FRENO.test(frase.texto) && !instruye) continue;
    const vistos = new Set();
    for (const { id, linea } of frase.ocurrencias) {
      if (vistos.has(`${id}:${linea}`)) continue;
      vistos.add(`${id}:${linea}`);
      citas.push({ id, linea, texto: frase.texto.trim() });
    }
  }
  return citas;
}

/**
 * Cuantos ids del tablero nombra el archivo, sin importar el lenguaje. NO es lo que el gate
 * juzga: es el DENOMINADOR que hace legible un cero. "0 citas de freno" sobre un archivo con
 * 0 ids es un archivo sin tareas; sobre uno con 40 ids es un detector ciego.
 */
export function idsNombrados(md) {
  return new Set(md.match(ID) ?? []).size;
}

/** Traduce la salida de `onia-tablero.sh show` a un estado. Pura: se le pasa el texto. */
export function estadoDesdeShow(salida) {
  const m = /^\s*status:\s*(\S+)\s*$/m.exec(salida ?? '');
  return m ? m[1] : null;
}

/** El titulo que `onia-tablero.sh show` pone en su primera linea. Pura. */
export function tituloDesdeShow(salida) {
  const m = /^Task\s+t_[0-9a-f]{8}:\s*(.+?)\s*$/m.exec(salida ?? '');
  return m ? m[1] : null;
}

/**
 * La misma normalizacion que usa el dedup del tablero para los avisos automaticos: digitos a `N`,
 * minusculas, espacios aplanados. Sin esto, "7 desconocido(s)" y "12 desconocido(s)" se leen como
 * dos tareas distintas cuando son la MISMA, re-creada.
 */
export function normalizarTitulo(t) {
  if (typeof t !== 'string') return null;
  return t.replace(/\d+/g, 'N').toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * Un titulo que ARRANCA con un marcador entre corchetes (`[leads-esperando]`, `[auto:4435e1]`) lo
 * escribe una maquina, y esa maquina lo re-crea: archiva la de ayer y crea la de hoy con id nuevo.
 * Citar ese id es citar la fecha de ayer. El que NO tiene marcador lo escribio una persona y su id
 * es estable: ahi copiar el id esta bien, y prohibirlo de gratis hace que se desobedezca la regla.
 */
export function marcadorRotatorio(titulo) {
  const m = /^\s*(\[[^\]\n]{1,40}\])/.exec(titulo ?? '');
  return m ? m[1] : null;
}

/** Entre las tareas VIVAS, la que repite el titulo normalizado de la muerta. Pura. */
export function sucesoraViva(tituloMuerto, vivas) {
  const clave = normalizarTitulo(tituloMuerto);
  if (!clave) return null;
  for (const t of vivas ?? []) {
    if (!ESTADOS_VIVOS.has(t?.estado)) continue;
    if (normalizarTitulo(t.titulo) === clave) return t;
  }
  return null;
}

/**
 * Traduce los estados a los motivos por los que ESTO es un item. Pura, como en
 * `bloqueos_vencidos.mjs`: la parte que decide se prueba sin consultar nada.
 *
 * EL REMEDIO ES DISTINTO SEGUN QUIEN ESCRIBIO LA TAREA, y eso no es un adorno: hasta el
 * 2026-09-26 el motivo decia "nombra la tarea VIVA que de verdad frena" para todos, y para una
 * tarea de vigia eso es un consejo que caduca en 24 h — el id nuevo tambien va a estar archivado
 * mañana. Con marcador, el remedio es el titulo; sin marcador, el id sirve.
 */
export function juzgar(resultados) {
  const motivos = [];
  for (const r of resultados) {
    if (r.estado === null) continue; // no medido: no es un item, es un aviso
    if (ESTADOS_VIVOS.has(r.estado)) continue;
    let motivo =
      `${r.archivo}:${r.linea} cita \`${r.id}\` como freno vigente y esa tarea esta ${r.estado}. ` +
      `La linea le pide a Sergio Urcullo una decision que ya tomo — reescribila con lo que se ` +
      `midio, o nombra la tarea VIVA que de verdad frena`;
    if (r.sucesora?.id) {
      const marcador = marcadorRotatorio(r.sucesora.titulo ?? r.titulo);
      motivo += `. SUCESORA VIVA: \`${r.sucesora.id}\` (${r.sucesora.estado}), MISMO titulo`;
      motivo += marcador
        ? ` — y el marcador \`${marcador}\` dice que la re-crea una maquina, asi que su id ROTA y ` +
          `no se copia: nombra el titulo/marcador y deja que el lector lo derive ` +
          `(\`onia-tablero.sh list --json\`). Copiar el id nuevo pone esta misma linea en rojo mañana`
        : `: el freno sigue, cambio de id — reescribi la linea nombrandola`;
    }
    motivos.push(motivo);
  }
  return motivos;
}

/**
 * Consulta un id. `estado` es null cuando NO SE PUDO medir (que no es lo mismo que muerto), y
 * `titulo` null cuando la salida no lo trae: sin titulo no hay sucesora que buscar, y eso baja la
 * calidad del remedio sin inventar nada.
 */
function consultar(id) {
  let salida = null;
  try {
    salida = execFileSync(TABLERO, ['show', id], {
      cwd: RAIZ,
      encoding: 'utf8',
      timeout: TIMEOUT_MS,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch (e) {
    // Una tarea inexistente puede salir por error; su texto igual puede traer el status.
    salida = e?.stdout ?? null;
  }
  return { estado: estadoDesdeShow(salida), titulo: tituloDesdeShow(salida) };
}

/**
 * Las tareas VIVAS del tablero, para buscarle sucesora a una muerta. Se pide UNA vez y solo si hay
 * alguna cita muerta. Si no se puede listar, devuelve `[]`: el motivo queda como el de siempre —
 * degradar el remedio es barato, inventar una sucesora no.
 */
function tareasVivas() {
  try {
    const salida = execFileSync(TABLERO, ['list', '--json'], {
      cwd: RAIZ,
      encoding: 'utf8',
      timeout: TIMEOUT_MS,
      maxBuffer: 64 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return JSON.parse(salida)
      .filter((t) => ESTADOS_VIVOS.has(t?.status))
      .map((t) => ({ id: t.id, estado: t.status, titulo: t.title }));
  } catch {
    return [];
  }
}

/**
 * El instrumento que SI contesta "¿produccion corre el codigo del repo?". Va exportado porque lo
 * nombra la linea de exito de aca y el gate lo exige: si se renombra, esto tiene que romperse.
 */
export const HERMANO_QUE_MIDE_PRODUCCION = 'scripts/bot_vivo_tiene_el_codigo.mjs';

/**
 * LA LINEA DE EXITO, y por que no puede ser solo "todas nombran una tarea VIVA".
 *
 * Medido el 2026-09-26. `cola/chatbot.md` le atribuia a este verde un significado que este gate
 * NO mide: *"Hoy sale 1 y se pone verde cuando el `ok` al pedido de deploy vivo de `bot` lo
 * publique: es tambien el acuse de ese deploy, sin tener que creerle a nadie"*. Ese mismo dia el
 * gate salio 0 con el deploy SIN hacer — `bot_vivo_tiene_el_codigo.mjs` contaba 7 archivos viejos
 * corriendo en `onia-center`, entre ellos `knowledge.onia.json`, o sea 2 de los 3 botones de
 * WhatsApp de la web viva cayendo en el saludo generico.
 *
 * POR QUE SE PUSO VERDE, que es lo que lo hace un modo de falla y no un descuido: este gate mide
 * CITAS, y la vuelta anterior le enseño a morder la redaccion "el `ok` de t_X" (caso
 * `instruccion` del self-check). La cola respondio a ese rojo BORRANDO la cita. Sujeto cero,
 * verde trivial — y el significado atribuido al verde sobrevivio al borrado del sujeto. Un gate
 * de citas se pone verde cuando se borran las citas, y eso NO es que el freno se haya levantado.
 *
 * Por eso el exito declara su ALCANCE y nombra al hermano, igual que hizo `campanas:documento`
 * con el suyo. Un verde que no dice que midio se lee como el verde que el lector esperaba.
 *
 * EL TEXTO ES UNO Y LOS CAMINOS DE EXITO SON DOS (N citas vivas, y cero sujetos). Los dos salen
 * `exit 0` y los dos se leen igual de mal, asi que el alcance vive en UNA constante: este mismo
 * archivo tiene escrito que dos copias de un texto es como nacio el bug que lo trajo. Y el camino
 * de cero sujetos es el MAS probable para este fallo, no el menos: es donde cae un pedido de
 * deploy que nadie cita.
 */
export const ALCANCE_DEL_VERDE = [
  `  ALCANCE: esto mide las CITAS de las colas, NO el estado de produccion. Un pedido de deploy`,
  `  pendiente no se ve aca: si nadie lo cita, este gate sale verde igual. Que el bot vivo corra`,
  `  el codigo del repo lo mide ${HERMANO_QUE_MIDE_PRODUCCION}.`,
].join('\n');

export function lineaDeExito(cuantas) {
  return `bloqueos citados: ${cuantas} cita(s), todas nombran una tarea VIVA\n${ALCANCE_DEL_VERDE}`;
}

if (process.argv.includes('--self-check')) {
  let casos = 0;
  const afirmar = (cond, que) => { casos++; if (!cond) { console.error('FALLO:', que); process.exitCode = 1; } };

  const md = [
    'Una linea cualquiera sin ids.',
    'ruta del panel a `/profile?mfa=obligatorio` (tarea `t_3bb6b9ee`, depende de Sergio Urcullo).',
    'CERRADO el 2026-09-18 por la tarea `t_82251f19` — historia, no freno.',
    'El pedido `t_aaaaaaa1` espera decision de Sergio Urcullo.',
    'Lo midio t_bbbbbbb2 y quedo hecho.',
  ].join('\n');

  const citas = citasDeBloqueo(md);
  afirmar(citas.length === 2, 'solo las lineas con lenguaje de freno son citas');
  afirmar(citas[0].id === 't_3bb6b9ee' && citas[0].linea === 2, 'saca el id y la linea del caso real');
  afirmar(!citas.some((c) => c.id === 't_82251f19'), 'una cita historica (CERRADO en t_X) NO es un freno');
  afirmar(!citas.some((c) => c.id === 't_bbbbbbb2'), '"lo midio t_X" tampoco: habla en pasado');

  const dos = citasDeBloqueo('depende de Sergio Urcullo: t_aaaaaaa1 y t_aaaaaaa2 frenan esto');
  afirmar(dos.length === 2, 'una linea puede citar dos frenos');
  const repe = citasDeBloqueo('depende de Sergio Urcullo: t_aaaaaaa1, ver t_aaaaaaa1');
  afirmar(repe.length === 1, 'el mismo id repetido en la linea se cuenta una vez');

  /**
   * Los cuatro sujetos REALES que se le escaparon el 2026-09-26, medidos en
   * `cola/chatbot.md` con `t_c2fab948` ya ARCHIVADA y el gate saliendo `exit 0`.
   * Cada uno entra por un hueco distinto, y los cuatro son textuales del archivo.
   */
  const conjugado = citasDeBloqueo('`origin/main` y solo esperan el `ok` de Sergio Urcullo (pedido `t_c2fab948`, vivo); el quinto,');
  afirmar(conjugado.length === 1, 'CONJUGACION: "esperan el ok" es lo mismo que "esperando el ok"');
  afirmar(citasDeBloqueo('el pedido espera el `ok` de Sergio Urcullo: t_aaaaaaa1').length === 1, 'y "espera el ok" en singular tambien');

  const vitalidad = citasDeBloqueo('Es `t_aaaaaaa1`, vivo.');
  afirmar(vitalidad.length === 1, 'VITALIDAD: una linea que declara el id "vivo" afirma un freno vigente');
  afirmar(citasDeBloqueo('el arreglo ya esta pedido y NO se duplico. Es `t_aaaaaaa1`').length === 1, 'y "ya esta pedido" tambien lo afirma');

  const instruccion = citasDeBloqueo('Hoy sale **1** y se pone verde cuando el `ok` de `t_c2fab948` publique el bot: es');
  afirmar(instruccion.length === 1, 'INSTRUCCION: "el `ok` de t_X" le dice a alguien QUE id apretar — si esta archivada, el ok no ejecuta');
  afirmar(citasDeBloqueo('se destraba con `ok t_aaaaaaa1`').length === 1, 'y la forma imperativa "ok t_X" igual');

  /**
   * LOS DOS HUECOS del 2026-09-26 (segunda tanda), medidos con `t_76cdb5dc` ya ARCHIVADA,
   * TRES lineas de `cola/chatbot.md` citandola y este gate saliendo `exit 0` con 2 citas.
   * Los dos son textuales del archivo y cada uno entra por un hueco distinto.
   */
  const okConNombre = citasDeBloqueo(
    '      **Qué queda, y no es código:** el `ok` de Sergio Urcullo en **`t_76cdb5dc`**. Al desplegar, las',
  );
  afirmar(okConNombre.length === 1,
    'NOMBRE EN MEDIO: "el `ok` de Sergio Urcullo en `t_X`" es la misma instruccion que "el `ok` de `t_X`"');

  const partida = citasDeBloqueo([
    '      **Deploy:** el arreglo de la insistencia ya está commiteado y espera el `ok` de Sergio',
    '      Urcullo en **`t_76cdb5dc`** ("Publicar el bot…"). No se creó un pedido nuevo.',
  ].join('\n'));
  afirmar(partida.length === 1,
    'WRAP: el freno y el id caen en renglones distintos de la MISMA frase — la unidad de significado es la frase, no el renglon');
  afirmar(partida[0]?.linea === 2,
    'y se reporta el renglon donde esta el ID, que es el que hay que editar');

  // La contracara: reconstruir la frase NO puede pegar dos frases distintas, que es como este
  // ensanche se convertiria en un gate que grita en falso y termina apagado.
  const noPega = citasDeBloqueo([
    'El pedido `t_aaaaaaa1` espera decision de Sergio Urcullo.',
    'CERRADO el 2026-09-18 por la tarea `t_82251f19` — historia, no freno.',
  ].join('\n'));
  afirmar(noPega.length === 1 && noPega[0].id === 't_aaaaaaa1',
    'TERMINADOR: una frase que ya cerro con punto no contamina el renglon siguiente');
  afirmar(citasDeBloqueo([
    '      del bot y solo falta que lo publiquen; espera el `ok` de Sergio',
    '',
    '- [x] CERRADO el 2026-09-18: lo midio `t_82251f19`.',
  ].join('\n')).length === 0,
    'un renglon en blanco y un item nuevo cortan la frase: no se pega con el bullet siguiente');

  /**
   * LOS DOS FALSOS POSITIVOS que produjo el ensanche de arriba, encontrados leyendo a mano los
   * 9 sujetos que aparecieron — la misma disciplina que la vez anterior. Son textuales, y los dos
   * son la clase de linea que MAS conviene tener escrita: la que cuenta que el freno se levanto.
   */
  afirmar(citasDeBloqueo([
    '      ✅ **VIVO para el cliente. Medido el 2026-09-26 01:35 La Paz, no heredado.** El ok de',
    '      Sergio Urcullo llegó (tarea `t_fca27a62`, hoy `archived`) y el deploy corrió el 2026-09-24',
    '      09:44. Las tres medidas, en el motor que CORRE y no en el host:',
  ].join('\n')).length === 0,
    'PASADO: "el ok de Sergio Urcullo llego (tarea t_X, hoy archived)" es el acuse del deploy, no una instruccion');

  afirmar(citasDeBloqueo([
    '      ⚠️ **Acá decía que NO se podía mirar renderizado con sesión real porque «sigue vivo el',
    '      corte de 2FA» y que eso dependía de Sergio Urcullo (tarea `t_3bb6b9ee`) — las dos mitades',
    '      estaban VENCIDAS, corregido el 2026-09-25.** `t_3bb6b9ee` está **archivada** desde el',
    '      18-sep, y el corte se resolvió el 24-sep cableando TOTP (RFC 6238) en',
  ].join('\n')).length === 0,
    'CORRECCION: una nota que CITA el freno viejo para desmentirlo no lo afirma — si esto muerde, el gate castiga justo la linea que lo arreglo');

  // Y lo que NO debe morder, que es como se apaga un gate: la historia fechada.
  afirmar(citasDeBloqueo('| El gate quedo verde | `npm run pedido:entregado` | `OK t_aaaaaaa1 (bot): sigue VIGENTE` |').length === 0,
    'una tabla de evidencia con la salida literal de un comando NO es un freno');
  afirmar(citasDeBloqueo('**Que se hizo.** Pedido nuevo `t_aaaaaaa1`, cuerpo derivado de').length === 0,
    '"pedido nuevo t_X" cuenta lo que se hizo: es historia de esa vuelta');
  afirmar(citasDeBloqueo('ONIA_DESPLEGAR_DRY=1 node /root/bin/onia-publicar-aprobado.mjs t_aaaaaaa1').length === 0,
    'un comando de verificacion reproducible tampoco afirma que el pedido siga vivo');

  afirmar(citasDeBloqueo('Urcullo contesto `ok t_aaaaaaa1` a las 18:43 UTC y el brazo ejecutor publico el bot').length === 0,
    'PASADO: un ok ya contestado es el acuse del deploy, no una instruccion pendiente');
  afirmar(citasDeBloqueo('Sergio respondio `ok t_aaaaaaa1` y se publico').length === 0, 'y "respondio ok t_X" tampoco');
  afirmar(citasDeBloqueo('contesto `ok t_aaaaaaa1`, y `t_aaaaaaa2` sigue esperando el `ok`').some((c) => c.id === 't_aaaaaaa2'),
    'pero la exclusion NO tapa un freno nuevo en la misma linea: muerde por LENGUAJE_DE_FRENO');

  // El DENOMINADOR que hace legible un cero de sujetos.
  afirmar(idsNombrados('cerrado en t_aaaaaaa1 y t_aaaaaaa2, ver t_aaaaaaa1') === 2, 'cuenta ids unicos sin mirar el lenguaje');
  afirmar(idsNombrados('una linea sin ids') === 0, 'un archivo sin ids da cero, y ese cero si es honesto');

  // El parseo del tablero.
  afirmar(estadoDesdeShow('Task t_x: hola\n  status:    archived\n  assignee:  -') === 'archived', 'lee el status de show');
  afirmar(estadoDesdeShow('Task t_x: hola\n  status:    ready\n') === 'ready', 'lee un status vivo');
  afirmar(estadoDesdeShow('no such task') === null, 'sin linea de status no inventa estado');
  afirmar(estadoDesdeShow(undefined) === null, 'una salida vacia no rompe el parseo');

  // Lo que MUERDE.
  const vivo = juzgar([{ id: 't_1', estado: 'blocked', archivo: 'c.md', linea: 1 }]);
  afirmar(vivo.length === 0, 'un freno que cita una tarea VIVA no es un item');
  afirmar(juzgar([{ id: 't_1', estado: 'ready', archivo: 'c.md', linea: 1 }]).length === 0, 'ready tambien es vivo');
  const muerto = juzgar([{ id: 't_3bb6b9ee', estado: 'archived', archivo: 'hermes-content/docs/cola/plataforma-v1.md', linea: 267 }]);
  afirmar(muerto.length === 1, 'un freno que cita una tarea ARCHIVADA si es un item');
  afirmar(muerto[0].includes('t_3bb6b9ee') && muerto[0].includes(':267'), 'el motivo dice QUE id y DONDE esta la linea');
  afirmar(muerto[0].includes('ya tomo'), 'y dice por que importa: le pide una decision ya tomada');
  afirmar(juzgar([{ id: 't_1', estado: 'done', archivo: 'c.md', linea: 1 }]).length === 1, 'done tampoco frena');
  afirmar(juzgar([{ id: 't_1', estado: 'inexistente', archivo: 'c.md', linea: 1 }]).length === 1, 'un id que no existe tampoco frena');
  afirmar(juzgar([{ id: 't_1', estado: null, archivo: 'c.md', linea: 1 }]).length === 0, 'NO MEDIDO no es un item: fallo conservador');

  /**
   * LA SUCESORA, y por que el remedio de arriba solo no alcanza — medido el 2026-09-26 17:30.
   *
   * `cola/chatbot.md` citaba `t_4f30a836` (*"[leads-esperando] 7 desconocido(s) esperando una
   * respuesta tuya"*, `archived`) como freno vigente. El remedio que imprimia este gate era
   * "nombra la tarea VIVA que de verdad frena" — y la tarea viva es `t_da35d070`, con el MISMO
   * titulo, creada por el vigia UN DIA DESPUES (25-sep 20:39 -> 26-sep 20:39). O sea que ese
   * remedio, seguido al pie de la letra, pone la cola en rojo otra vez mañana sobre un id nuevo:
   * el vigia archiva la de ayer y crea la de hoy, y el dedup es por titulo normalizado.
   *
   * Por eso el motivo distingue DOS cosas que antes decia igual: si la tarea muerta tiene una
   * sucesora viva se nombra, y si su titulo arranca con un marcador entre corchetes —lo que
   * escribe una MAQUINA— el remedio prohibe copiar el id y manda a citar el titulo. Un puntero
   * que rota cada 24 h no se copia: se deriva.
   */
  afirmar(normalizarTitulo('[leads-esperando] 7 desconocido(s) esperando una respuesta tuya')
    === normalizarTitulo('[leads-esperando] 12 desconocido(s) esperando una respuesta tuya'),
    'NORMALIZACION: el dedup del tablero manda los digitos a N, asi que 7 y 12 desconocidos son el MISMO titulo');
  afirmar(normalizarTitulo('  Hola   MUNDO ') === normalizarTitulo('hola mundo'),
    'y aplana mayusculas y espacios, como el dedup');
  afirmar(normalizarTitulo('Publicar el bot') !== normalizarTitulo('Publicar la landing'),
    'pero NO confunde dos titulos distintos: sin esto la sucesora seria cualquiera');

  afirmar(marcadorRotatorio('[leads-esperando] 7 desconocido(s)') === '[leads-esperando]',
    'MARCADOR: un titulo que arranca entre corchetes lo escribe el vigia, y su id rota');
  afirmar(marcadorRotatorio('[auto:4435e1] Recorrido de cliente') === '[auto:4435e1]',
    'los [auto:] tambien: es el mismo mecanismo de dedup por titulo');
  afirmar(marcadorRotatorio('Publicar el bot: 5 pedidos quedaron mudos') === null,
    'y una tarea escrita a mano NO es rotatoria: su id se puede citar');
  afirmar(marcadorRotatorio('texto y despues [algo]') === null,
    'el marcador tiene que ARRANCAR la linea: un corchete en medio es prosa');

  const vivas = [
    { id: 't_da35d070', estado: 'blocked', titulo: '[leads-esperando] 7 desconocido(s) esperando una respuesta tuya' },
    { id: 't_9d970ada', estado: 'ready', titulo: 'Infra: cerrar los huecos del rate limit del login' },
    { id: 't_ffffffff', estado: 'done', titulo: '[leads-esperando] 7 desconocido(s) esperando una respuesta tuya' },
  ];
  const suc = sucesoraViva('[leads-esperando] 5 desconocido(s) esperando una respuesta tuya', vivas);
  afirmar(suc?.id === 't_da35d070', 'SUCESORA: la encuentra por titulo normalizado, aunque cambie el numero');
  afirmar(sucesoraViva('Una tarea que nadie re-creo', vivas) === null, 'y sin sucesora devuelve null, no la primera que pasa');
  afirmar(sucesoraViva(null, vivas) === null, 'sin titulo de la muerta no inventa sucesora');
  afirmar(sucesoraViva('[leads-esperando] 7 desconocido(s) esperando una respuesta tuya', [vivas[2]]) === null,
    'una tarea `done` NO es sucesora: no frena nada');

  const conSucesoraRota = juzgar([{
    id: 't_4f30a836', estado: 'archived', archivo: 'hermes-content/docs/cola/chatbot.md', linea: 1586,
    titulo: '[leads-esperando] 7 desconocido(s) esperando una respuesta tuya',
    sucesora: { id: 't_da35d070', estado: 'blocked', titulo: '[leads-esperando] 7 desconocido(s) esperando una respuesta tuya' },
  }]);
  afirmar(conSucesoraRota.length === 1, 'con sucesora sigue siendo un item: la linea citada igual esta mintiendo');
  afirmar(conSucesoraRota[0].includes('t_da35d070'), 'el motivo NOMBRA la sucesora viva: sin eso hay que ir a buscarla');
  afirmar(conSucesoraRota[0].includes('[leads-esperando]'), 'y nombra el marcador, que es el puntero que NO caduca');
  afirmar(/no cop\w+ el id|no se copia/i.test(conSucesoraRota[0]),
    'y PROHIBE copiar el id nuevo: copiarlo pone la cola en rojo mañana sobre otro id');

  const conSucesoraEstable = juzgar([{
    id: 't_1', estado: 'done', archivo: 'c.md', linea: 9,
    titulo: 'Publicar el bot', sucesora: { id: 't_2', estado: 'blocked', titulo: 'Publicar el bot' },
  }]);
  afirmar(conSucesoraEstable[0].includes('t_2'), 'sin marcador tambien nombra la sucesora');
  afirmar(!/no se copia/i.test(conSucesoraEstable[0]),
    'pero ahi el id SI se puede citar: una tarea escrita a mano no rota, y prohibirlo de gratis se desobedece');

  const sinSucesora = juzgar([{
    id: 't_1', estado: 'archived', archivo: 'c.md', linea: 9, titulo: 'Algo que nadie re-creo', sucesora: null,
  }]);
  afirmar(!sinSucesora[0].includes('SUCESORA') && sinSucesora[0].includes('ya tomo'),
    'sin sucesora el motivo es el de siempre: no se inventa una tarea que no existe');

  /**
   * EL VERDE TIENE QUE DECIR QUE MIDIO. Estos cuatro cierran el hueco del 2026-09-26: el gate
   * salio 0 con el deploy del bot sin hacer, porque las citas se habian borrado, y la cola leyo
   * ese 0 como "el deploy se publico". Se afirma la PROPIEDAD (el exito declara su alcance y
   * manda al hermano), no el texto — cualquier redaccion que la cumpla pasa.
   */
  const exito = lineaDeExito(1);
  afirmar(/ALCANCE/.test(exito), 'el exito declara su ALCANCE: sin eso se lee como el verde que el lector esperaba');
  afirmar(exito.includes(HERMANO_QUE_MIDE_PRODUCCION), 'y nombra al instrumento hermano que SI mira produccion');
  afirmar(/deploy/i.test(exito) && /no se ve|NO el estado/i.test(exito),
    'y dice explicitamente que un pedido de deploy pendiente NO se ve aca: es el significado que se le atribuyo mal');
  afirmar(lineaDeExito(3).includes('3 cita(s)'), 'y sigue diciendo cuantas citas miro');
  // Los DOS caminos de exit 0 lo llevan: el de N citas vivas y el de cero sujetos. Se afirma
  // sobre la fuente compartida, asi que separarlos en dos textos rompe esto.
  afirmar(lineaDeExito(1).includes(ALCANCE_DEL_VERDE), 'el camino de N citas usa el alcance compartido, no una copia');
  const fuente = readFileSync(new URL(import.meta.url), 'utf8');
  const cerosConAlcance = /if \(!resultados\.length\) \{[\s\S]*?console\.log\(ALCANCE_DEL_VERDE\);[\s\S]*?process\.exit\(0\)/.test(fuente);
  afirmar(cerosConAlcance, 'el camino de CERO sujetos tambien lo imprime: es donde cae un deploy que nadie cita');

  if (!process.exitCode) console.log(`self-check: ok — ${casos} casos`);
  process.exit(process.exitCode || 0);
}

const rutas = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!rutas.length) {
  console.error('uso: node scripts/bloqueo_citado_vivo.mjs <cola.md> [<cola.md>...] | --self-check');
  process.exit(2);
}

const resultados = [];
let idsTotales = 0;
for (const ruta of rutas) {
  const md = await readFile(ruta, 'utf8');
  idsTotales += idsNombrados(md);
  for (const cita of citasDeBloqueo(md)) {
    resultados.push({ ...cita, archivo: ruta, ...consultar(cita.id) });
  }
}

// La sucesora se busca SOLO si hay alguna cita muerta: sin muertas no hay remedio que mejorar, y
// la lista del tablero es la consulta mas caro de este gate.
if (resultados.some((r) => r.estado !== null && !ESTADOS_VIVOS.has(r.estado))) {
  const vivas = tareasVivas();
  for (const r of resultados) {
    if (r.estado === null || ESTADOS_VIVOS.has(r.estado)) continue;
    r.sucesora = sucesoraViva(r.titulo, vivas);
  }
}

if (!resultados.length) {
  // El denominador va SIEMPRE, y por esto: la version anterior imprimia solo "ninguna linea
  // afirma un freno vigente" y eso se lee como "esta todo bien". Salio asi sobre una cola con
  // 7 citas de una tarea archivada. Con el denominador delante, el mismo cero se lee como lo
  // que es — el detector no encontro sujetos entre N ids, que es una pregunta, no un veredicto.
  console.log(
    `bloqueos citados: 0 de ${idsTotales} id(s) nombrados afirman un freno vigente en ${rutas.join(', ')}`,
  );
  if (idsTotales >= 10) {
    console.log(
      `  ⚠️  ${idsTotales} ids citados y NINGUNO con lenguaje de freno: puede ser cierto, o puede ` +
        `ser que la redaccion de esos frenos no este en LENGUAJE_DE_FRENO. Si buscas un freno ` +
        `vencido y este gate calla, leelo a mano antes de creerle al verde.`,
    );
  }
  console.log(ALCANCE_DEL_VERDE);
  process.exit(0);
}

for (const r of resultados) {
  const vivo = r.estado !== null && ESTADOS_VIVOS.has(r.estado);
  const etiqueta = r.estado === null ? 'NO MEDIDO' : vivo ? 'OK       ' : 'ITEM     ';
  console.log(`  ${etiqueta} ${r.id} ${String(r.estado ?? 'no se pudo consultar').padEnd(12)} ${r.archivo}:${r.linea}`);
}

const noMedidos = resultados.filter((r) => r.estado === null);
const motivos = juzgar(resultados);

if (motivos.length) {
  console.error(`\nBLOQUEO CITADO QUE YA NO EXISTE`);
  for (const m of motivos) console.error(`  - ${m}`);
  console.error(
    '\nUn bloqueo vencido es peor que un fantasma: le presta su motivo falso al de al lado y ' +
      'declara imposible una verificacion que hoy se puede hacer.',
  );
  process.exit(1);
}

if (noMedidos.length) {
  console.error(
    `\nNO MEDIDO — ${noMedidos.length} de ${resultados.length} cita(s) no se pudieron consultar ` +
      `(${TABLERO}). No medir no es "esta vencido", asi que esto no es rojo: es que falta el instrumento.`,
  );
  process.exit(2);
}

console.log(lineaDeExito(resultados.length));
process.exit(0);
