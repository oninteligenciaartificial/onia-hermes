#!/usr/bin/env node
/**
 * bloqueos_vencidos.mjs — un bloqueo que ya se puede comprobar solo no puede seguir
 * pidiendole una decision a Sergio.
 *
 * Nace del 2026-09-02, y del modo de falla que el propio loop llama "peor que un fantasma":
 *
 *   S16 declaraba su verificador (`npm run deploy:alcanzable` → 0) y NADIE lo corria como
 *   paso propio. Cuando el integrador mergeo el carril a `master`, el verificador paso a
 *   verde y la fila siguio pidiendo la decision. Se destapo de casualidad, adentro de una
 *   auditoria de los `[x]`, ya vencido.
 *
 *   Y un bloqueo vencido no se queda quieto: **le presta su motivo falso al de al lado**.
 *   S11 abria con "commiteado y pusheado, pero NO llega a `master`: ver S16" — con el commit
 *   ya en `master`. Esa frase es justo la que le dice a Sergio que dar el OK del deploy no
 *   sirve de nada, o sea que el bloqueo vencido bloqueaba a su vecino.
 *
 *   node scripts/bloqueos_vencidos.mjs hermes-content/docs/cola/chatbot.md
 *   node scripts/bloqueos_vencidos.mjs --self-check
 *
 * QUE MIDE. Las filas VIVAS de la tabla "Bloqueado en Sergio" que declaran su verificador
 * con la marca `**Verificador:** \`<comando>\` → <codigo>`. Corre cada comando y compara su
 * codigo de salida:
 *   - sale `<codigo>`  → el bloqueo ESTA SATISFECHO: es un ITEM, la fila hay que cerrarla.
 *   - sale otra cosa   → sigue bloqueado, nada que hacer.
 *
 * POR QUE LA DECLARACION ES EXPLICITA Y NO SE DEDUCE DEL TEXTO. La tabla nombra decenas de
 * comandos entre backticks que NO son su verificador, y uno de ellos ya engañaria: el
 * verificador de S16 (`deploy:alcanzable`) sale 0 hoy, pero S11 —que habla del mismo
 * commit— NO esta resuelto, porque le falta el swap en produccion. Deducir el verificador
 * del texto cerraria S11 en falso. La fila lo declara o no se mide.
 *
 * LAS FILAS TACHADAS NO SE MIDEN. `| ~~S16~~ |` ya esta cerrada; volver a nombrarla seria
 * el gate gritando en falso, que es como se apaga un gate.
 *
 * ⚠️ GUARDA DE EJECUCION. Solo corre dos formas, y las dos se validan ANTES de ejecutar:
 *   1. `npm run <script>` donde `<script>` es una clave real de `package.json`.
 *   2. `node <ruta>` donde `<ruta>` es relativa, sin `..`, cae dentro del repo y existe.
 * Todo lo demas se reporta como NO EJECUTABLE y no se corre. Ademas se ejecuta siempre con
 * `execFileSync` y argumentos como array —nunca con shell—, asi que el texto del documento
 * jamas se interpreta como comando. Un gate que ejecuta texto arbitrario sacado de un
 * documento es peor que el problema que tapa.
 *
 * QUE NO MIDE. Las filas sin verificador mecanico (hoy la mayoria: son chips, tramites de
 * banco y horas de la agenda de Sergio). Las lista igual al final, porque un gate que no
 * dice lo que dejo afuera se lee como "revise todo".
 *
 * FALLO CONSERVADOR. Si el verificador no se puede correr (timeout, SSH caido), se lee como
 * "sigue bloqueado", no como vencido: dejar un bloqueo de mas cuesta una vuelta, cerrarlo de
 * menos le pide a Sergio algo que ya hizo.
 */

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, relative, isAbsolute } from 'node:path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

const SECCION = /^##\s+Bloqueado en Sergio\s*$/;
const OTRO_TITULO = /^#{2,6}\s+/;
// Arranque de fila: `| S9 |` o `| ~~S16~~ |`. El `~~` es como la cola marca lo ya cerrado.
const FILA = /^\|\s*(~~)?\s*(S\d+)\s*(~~)?\s*\|/;
const VERIFICADOR = /\*\*Verificador:\*\*\s*`([^`]+)`\s*(?:→|->)\s*(\d+)/;
// Arranque de item de cola, primer nivel: `- [ ] ...` o `- [x] ...`.
const ITEM = /^- \[( |x|X)\]\s/;
// Un item que se DECLARA bloqueo: `- [ ] 🔴 ...`. No es lo mismo que un item abierto.
const ITEM_BLOQUEO = /^- \[( |x|X)\]\s*🔴/;
// Lo que CORTA el bloque de un item: otro item de primer nivel, un titulo, o una tabla.
const CORTE_ITEM = /^(- \[( |x|X)\]\s|#{1,6}\s|\|)/;

const TIMEOUT_MS = Number(process.env.ONIA_BLOQUEOS_TIMEOUT_MS || 120000);

/**
 * Saca las filas de la tabla "Bloqueado en Sergio". Una fila puede ocupar VARIAS lineas
 * fisicas —S9 tiene un bloque de codigo indentado adentro— asi que el corte no es el salto
 * de linea sino el arranque de la fila siguiente.
 */
/**
 * Los bloqueos que viven como ITEM de cola y no como fila de tabla. `plataforma-v1.md` no tiene
 * tabla "Bloqueado en Sergio" —sus bloqueos son items `- [ ] 🔴`— asi que hasta el 2026-09-25
 * este gate no podia verlos: leia un solo formato y salia "NO MEDIDO" sobre la cola donde
 * estaban los cuatro bloqueos vivos del producto.
 *
 * Se mide el item que DECLARA su verificador, por lo mismo que una fila: en una cola un item
 * abierto no es necesariamente un bloqueo, y tratar a todos como tal llenaria el reporte de
 * items que nadie espera — un gate que grita de mas se apaga igual que uno que no grita.
 */
export function extraerItems(lineas) {
  const items = [];
  for (let i = 0; i < lineas.length; i++) {
    const m = ITEM.exec(lineas[i]);
    if (!m) continue;

    let fin = lineas.length;
    for (let j = i + 1; j < lineas.length; j++) {
      if (CORTE_ITEM.test(lineas[j])) { fin = j; break; }
    }

    const v = VERIFICADOR.exec(lineas.slice(i, fin).join('\n'));
    const cerrado = m[1].toLowerCase() === 'x';
    // Se extrae si declara verificador (para CORRERLO), o si es un bloqueo abierto `- [ ] 🔴`
    // (para LISTARLO como "se re-mide a mano"). Sin la segunda mitad, una cola cuyos bloqueos
    // no declaran verificador devolvia vacio y salia "NO MEDIDO", indistinguible de un archivo
    // sin bloqueos — ver el bloque largo del self-check. Un bloqueo CERRADO sin verificador no
    // entra: no se corre ni se lista, y sumarlo haria decir "todos siguen bloqueados" sobre
    // colas que no tienen ninguno vivo.
    if (!v && !(!cerrado && ITEM_BLOQUEO.test(lineas[i]))) continue;

    items.push({
      // El id es la linea: un item de cola no tiene numero como `S9`, y la linea es con lo que
      // alguien lo encuentra. Dos items nunca comparten linea, asi que tampoco id.
      id: `L${i + 1}`,
      linea: i + 1,
      cerrado,
      comando: v ? v[1].trim() : null,
      esperado: v ? Number(v[2]) : null,
    });
  }
  return items;
}

export function extraerBloqueos(md) {
  const lineas = md.split(/\r?\n/);
  const items = extraerItems(lineas);
  const inicio = lineas.findIndex((l) => SECCION.test(l));
  if (inicio === -1) return items;

  let fin = lineas.length;
  for (let i = inicio + 1; i < lineas.length; i++) {
    if (OTRO_TITULO.test(lineas[i])) { fin = i; break; }
  }

  const filas = [];
  for (let i = inicio + 1; i < fin; i++) {
    const m = FILA.exec(lineas[i]);
    if (!m) continue;
    if (filas.length) filas[filas.length - 1].fin = i;
    filas.push({ id: m[2], cerrado: Boolean(m[1] && m[3]), linea: i + 1, inicio: i, fin });
  }

  return [
    ...items,
    ...filas.map((f) => {
      const texto = lineas.slice(f.inicio, f.fin).join('\n');
      const v = VERIFICADOR.exec(texto);
      return {
        id: f.id,
        linea: f.linea,
        cerrado: f.cerrado,
        comando: v ? v[1].trim() : null,
        esperado: v ? Number(v[2]) : null,
      };
    }),
  ];
}

/**
 * La guarda, separada de la ejecucion a proposito: es la parte que decide si algo se corre,
 * y esa parte se prueba sin correr nada.
 */
export function validarComando(comando, scripts, existe = (p) => existsSync(join(RAIZ, p))) {
  const npm = /^npm run ([\w:.-]+)$/.exec(comando);
  if (npm) {
    if (!(npm[1] in scripts)) return { error: `\`npm run ${npm[1]}\` no existe en package.json` };
    return { bin: 'npm', args: ['run', '--silent', npm[1]] };
  }

  const nodo = /^node ([\w./-]+)$/.exec(comando);
  if (nodo) {
    const ruta = nodo[1];
    if (isAbsolute(ruta) || ruta.split('/').includes('..')) return { error: `la ruta \`${ruta}\` se sale del repo` };
    const abs = resolve(RAIZ, ruta);
    const dentro = relative(RAIZ, abs);
    if (dentro.startsWith('..')) return { error: `la ruta \`${ruta}\` se sale del repo` };
    if (!/\.(mjs|js)$/.test(ruta)) return { error: `\`${ruta}\` no es un script de node` };
    if (!existe(ruta)) return { error: `\`${ruta}\` no existe en el repo` };
    return { bin: 'node', args: [abs] };
  }

  return { error: 'solo se aceptan `npm run <script>` y `node <ruta del repo>`' };
}

/**
 * Traduce el plan validado a algo que ESTA plataforma pueda spawnear sin shell.
 *
 * En Windows `npm` es `npm.cmd`, y Node se niega a spawnear `.cmd`/`.bat` sin shell
 * (CVE-2024-27980). Con `bin: 'npm'` pelado, en win32 TODOS los verificadores npm morian en el
 * spawn → `status` null → `no-medido`, y un bloqueo ya satisfecho (S17, 2026-09-12) quedaba
 * invisible — el molde exacto por el que S16 vencio en silencio. Se corre el JS de npm con
 * este MISMO node: sin shell, sin cmd.exe, la guarda de `validarComando` intacta.
 */
export function resolverBin(plan, plataforma = process.platform, existe = existsSync) {
  if (plan.error || plan.bin !== 'npm' || plataforma !== 'win32') return plan;
  const cli = join(dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js');
  if (!existe(cli)) return plan; // sin npm-cli.js a la vista, el intento directo al menos avisa
  return { bin: process.execPath, args: [cli, ...plan.args] };
}

/**
 * Traduce los resultados a los motivos por los que ESTO es un item. Sin red y sin disco: es
 * lo que se prueba en `--self-check`.
 */
export function juzgar(resultados) {
  const motivos = [];
  for (const r of resultados) {
    const donde = `linea ${r.linea}`;
    if (r.estado === 'vencido') {
      motivos.push(
        `${r.id} YA ESTA SATISFECHO — su verificador \`${r.comando}\` sale ${r.esperado}, ` +
          `que es lo que la propia fila declara como resuelto. Cerrala y revisa a quien nombra (${donde})`,
      );
    } else if (r.estado === 'no-ejecutable') {
      motivos.push(
        `${r.id} declara un verificador que no se puede correr: ${r.error}. ` +
          `Una fila que no se puede comprobar sola no vence nunca (${donde})`,
      );
    }
  }
  return motivos;
}

/**
 * Un id repetido entre filas VIVAS vuelve ambigua toda referencia a esa fila — empezando por
 * el `ok <id>` que Sergio Urcullo tipea, que es la unica forma de destrabar un deploy.
 *
 * ESTO YA PASO DOS VECES Y EL GATE LO VIO LAS DOS. El 2026-09-02 la tabla tenia dos `S12` (los
 * horarios de demo y "¿sigue en pie la opcion 1 de §9?") y se fusionaron a mano; el 2026-09-24
 * volvio a haber dos, porque una fila NUEVA ("Publicar el bot") reuso el numero. Las dos veces
 * la salida de este mismo script IMPRIMIO `S12, S12` en la linea de "sin verificador mecanico"
 * — y siguio saliendo 0 por ese motivo. **Un sintoma a la vista que no pone rojo se lee como
 * decoracion**: por eso la deteccion va aca y no en el ojo del que lea la salida.
 *
 * Solo mira las VIVAS a proposito: las filas cerradas (`~~S8~~`) son historia y comparten
 * numero con sus propias menciones viejas sin ambiguedad para nadie.
 */
export function idsDuplicados(filas) {
  const porId = new Map();
  for (const f of filas.filter((f) => !f.cerrado)) {
    if (!porId.has(f.id)) porId.set(f.id, []);
    porId.get(f.id).push(f.linea);
  }

  const motivos = [];
  for (const [id, lineas] of porId) {
    if (lineas.length < 2) continue;
    motivos.push(
      `${id} nombra ${lineas.length} filas VIVAS (lineas ${lineas.join(', ')}) — toda referencia a ` +
        `${id} es ambigua, incluido el \`ok ${id}\` de Sergio Urcullo. Renumera una con un id libre`,
    );
  }
  return motivos;
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const FECHA_CORTA = /\b(\d{1,2})[-\s]?(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)\b/gi;
const RELATIVO = /\b(HOY|MAÑANA|MANANA|en \d+ d[ií]as?)\b/i;
// Verbos que cuentan la fecha como algo que YA ocurrio. Acentuados y sin acentuar: los titulos se
// escriben desde tres maquinas y una no siempre los pone.
// SIN `\b` de cierre a proposito: en JS `\b` mira [A-Za-z0-9_], asi que despues de una `ó` NO hay
// limite de palabra y `/venci[óo]\b/` no matchea «Venció» — el bug que dejo pasar el falso
// positivo la primera vez que se corrio esto en vivo.
const NARRA_PASADO = /\b(venci[óo]|vencido|pas[óo]|paso el|se venci[óo]|expir[óo])/i;

/**
 * ¿El TITULO de una tarea bloqueada afirma un plazo que ya pasó?
 *
 * Por qué el titulo y no el cuerpo: el parte diario de las 09:00 arma la hoja de decisiones de
 * Sergio Urcullo con el TITULO truncado a 72 (`onia-parte-diario.sh`), asi que es lo unico que el
 * lee en el telefono. Un comentario aclaratorio adentro no lo alcanza — eso ya se midio el
 * 2026-09-25 con el T-plata, y se volvio a medir el mismo dia con `t_539598e3`: su titulo decia
 * «🔴 HOY vence el VPS (24-sep)» y le seguia llegando en rojo el 25-sep, con el VPS vivo y 32 dias
 * de uptime. Un rojo que miente no es ruido neutro: TAPA a los que no mienten, y ese dia competia
 * con el unico plazo real que quedaba (la tarjeta de Meta antes del 1-oct).
 *
 * Dos formas de caducar, y se distinguen porque se arreglan distinto:
 *  - `vencido`: el titulo nombra una fecha ABSOLUTA («24-sep») que ya pasó. Se re-mide y se
 *    reemplaza la tarea.
 *  - `relativo`: el titulo dice «HOY» / «en 6 dias» y fue escrito OTRO dia. La palabra era cierta
 *    cuando se escribio y hoy miente sola, sin que nadie la toque. Se reescribe con fecha absoluta.
 *
 * No adivina el año: interpreta la fecha en el año de `hoy`, y si eso la deja a mas de 180 dias en
 * el pasado asume que es del año que viene (un «3-ene» leido en diciembre es futuro, no un vencido).
 *
 * @returns {{tipo:'vencido'|'relativo', detalle:string}|null} `null` = el titulo no promete plazo.
 */
export function plazoVencidoEnTitulo(titulo, { hoy, creado } = {}) {
  const texto = String(titulo || '');
  const ahora = hoy instanceof Date ? hoy : new Date();
  const dia = (d) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const hoyDia = dia(ahora);

  // 0. Un titulo que NARRA la fecha en pasado no esta pidiendo nada para esa fecha — es el estado
  //    ya medido, o sea la forma CORRECTA de reescribir un vencido. Marcarlo seria marcar la cura.
  if (NARRA_PASADO.test(texto)) return null;

  // 1. Fecha absoluta. Se recorren TODAS y gana la mas tardia: un titulo que nombra dos fechas
  //    («vence el 24-sep, cortan el 30-sep») sigue vivo mientras la ultima no haya pasado.
  let masTardia = null;
  for (const m of texto.matchAll(FECHA_CORTA)) {
    const d = Number(m[1]);
    const mes = MESES.indexOf(m[2].toLowerCase());
    if (mes < 0 || d < 1 || d > 31) continue;
    let cuando = Date.UTC(ahora.getUTCFullYear(), mes, d);
    // A mas de 180 dias en el pasado se asume el año siguiente (ver el comentario de arriba).
    if (hoyDia - cuando > 180 * 86400000) cuando = Date.UTC(ahora.getUTCFullYear() + 1, mes, d);
    if (masTardia === null || cuando > masTardia) masTardia = cuando;
  }
  if (masTardia !== null) {
    if (masTardia >= hoyDia) return null;
    const dias = Math.round((hoyDia - masTardia) / 86400000);
    const etiqueta = `${new Date(masTardia).getUTCDate()}-${MESES[new Date(masTardia).getUTCMonth()]}`;
    return {
      tipo: 'vencido',
      detalle: `el titulo afirma ${etiqueta} y ya pasaron ${dias} dia(s). Re-medi el estado real y reemplaza la tarea: el parte lee el TITULO, un comentario adentro no lo alcanza`,
    };
  }

  // 2. Relativo congelado. Solo se puede juzgar sabiendo QUE DIA se escribio; sin `creado` no se
  //    inventa un veredicto — un gate que adivina es peor que uno que se calla.
  const rel = texto.match(RELATIVO);
  if (rel && creado instanceof Date && dia(creado) !== hoyDia) {
    const dias = Math.round((hoyDia - dia(creado)) / 86400000);
    return {
      tipo: 'relativo',
      detalle: `el titulo dice «${rel[1]}» y se escribio hace ${dias} dia(s): era cierto ese dia y hoy miente solo. Reescribilo con la fecha absoluta`,
    };
  }
  return null;
}

if (process.argv.includes('--self-check')) {
  // Contados por el script, no escritos a mano: un conteo hardcodeado deja de coincidir en
  // cuanto se agrega un caso, y un gate que miente en su propio numero ya no es un gate.
  let casos = 0;
  const afirmar = (cond, que) => { casos++; if (!cond) { console.error('FALLO:', que); process.exitCode = 1; } };

  const tabla = [
    '## Bloqueado en Sergio',
    '',
    '| # | Que | Por que solo el | Que desbloquea |',
    '|---|---|---|---|',
    '| S9 | copiar cosas. **Verificador:** `node hermes-content/deploy/vps-ops/bot/espejo-check.mjs` → 0 | infra | el item 2 |',
    '| ~~S16~~ | VENCIDO, ya cerrado. **Verificador:** `npm run deploy:alcanzable` → 0 | — | — |',
    '| S2 | credenciales del BCP | tramite | el QR |',
    '',
    '### S9 — el item completo',
    '| S99 | esta fila esta FUERA de la seccion | x | y |',
  ].join('\n');

  const filas = extraerBloqueos(tabla);
  afirmar(filas.length === 3, 'saca las 3 filas de la seccion y ninguna de afuera');
  afirmar(!filas.some((f) => f.id === 'S99'), 'una fila despues del proximo titulo NO es de esta tabla');
  afirmar(filas[0].id === 'S9' && filas[0].esperado === 0, 'saca el id y el codigo esperado');
  afirmar(filas[0].comando === 'node hermes-content/deploy/vps-ops/bot/espejo-check.mjs', 'saca el comando declarado');
  afirmar(filas[0].linea === 5, 'reporta la linea donde esta la fila');
  afirmar(filas[1].cerrado === true, 'una fila tachada se reconoce como cerrada');
  afirmar(filas[0].cerrado === false, 'una fila viva no se confunde con una cerrada');
  afirmar(filas[2].comando === null, 'una fila sin verificador no inventa uno');

  // Una fila puede ocupar varias lineas fisicas: S9 tiene un bloque de codigo adentro.
  const multi = extraerBloqueos([
    '## Bloqueado en Sergio',
    '| # | Que |',
    '|---|---|',
    '| S9 | primero esto:',
    '  ```bash',
    '  ssh root@vps "docker exec ..."',
    '  ```',
    '  y **Verificador:** `npm run marca:chatwoot` → 0 |',
    '| S10 | otra |',
  ].join('\n'));
  afirmar(multi.length === 2, 'un bloque de codigo adentro de una fila no la parte en dos');
  afirmar(multi[0].comando === 'npm run marca:chatwoot', 'encuentra el verificador en la continuacion de la fila');

  // Los bloqueos que NO viven en una tabla. `plataforma-v1.md` no tiene tabla "Bloqueado en
  // Sergio": sus bloqueos son items `- [ ] 🔴` en el cuerpo, y por eso este gate estuvo CIEGO
  // para ellos. El 2026-09-19 una sesion midio que la mitad OpenAI del item T-plata estaba
  // vencida y pidio acotar el texto; nadie lo hizo, y el pedido de recargar siguio saliendo en
  // el parte diario seis dias mas. El gate existia y no podia verlo: leia un solo formato.
  const items = extraerBloqueos([
    '# Cola',
    '',
    '- [ ] 🔴 **Item con verificador** (algo que se puede comprobar solo)',
    '      **Verificador:** `npm run marca:chatwoot` → 0',
    '',
    '- [ ] 🔴 **Item sin verificador** — este se re-mide a mano.',
    '',
    '- [ ] **Item abierto cualquiera**, que NO es un bloqueo y no debe ensuciar el reporte.',
    '',
    '- [x] 🔴 **Item ya cerrado** con **Verificador:** `npm run deploy:alcanzable` → 0',
  ].join('\n'));
  // Un item se CORRE solo si DECLARA su verificador, igual que una fila. Pero un `- [ ] 🔴`
  // sin verificador igual se EXTRAE, para que salga en la linea de "se re-miden a mano".
  //
  // ESTA DISTINCION ES EL AGUJERO QUE DEJO ABIERTO EL ARREGLO DEL 2026-09-25 (63ab39aa). Ese
  // commit enseño al gate a leer items y declaro cerrado el punto ciego de `plataforma-v1.md`
  // — pero como ningun item de esa cola declara verificador, `extraerBloqueos` seguia
  // devolviendo VACIO y el archivo caia en el mismo `NO MEDIDO` de antes, con exit 1. O sea:
  // una cola con CUATRO bloqueos vivos daba la misma salida, palabra por palabra, que un
  // archivo que no es una cola. Ese es el modo de falla que este carril llama el mas caro —
  // una salida vacia no avisa, CONFIRMA — y ademas dejaba a la capacidad nueva sin un solo
  // sujeto vivo: self-check verde, cero uso real.
  //
  // El `🔴` es lo que separa un bloqueo de un pendiente, y no es teoria: medido el 2026-09-25,
  // en las 30 colas del repo `- [ ] 🔴` aparece SOLO en `plataforma-v1.md` y son exactamente
  // sus 4 bloqueos. El miedo al ruido valia para `- [ ]` pelado, que se sigue ignorando.
  afirmar(items.length === 3, 'un `- [ ] 🔴` sin verificador tambien se extrae: es un bloqueo declarado');
  afirmar(
    !items.some((f) => /cualquiera/.test(String(f.id)) || f.linea === 8),
    'un `- [ ]` sin 🔴 y sin verificador NO se extrae: un pendiente no es un bloqueo',
  );
  const sinV = items.find((f) => f.linea === 6);
  afirmar(sinV && sinV.comando === null && sinV.esperado === null,
    'el bloqueo sin verificador sale con comando null, asi cae en "se re-miden a mano" y no se corre nada');
  afirmar(items[0].comando === 'npm run marca:chatwoot', 'saca el verificador declarado en la continuacion del item');
  afirmar(items[0].esperado === 0, 'saca el codigo esperado del item');
  afirmar(items[0].linea === 3, 'reporta la linea del item, que es como se lo encuentra');
  afirmar(items[0].cerrado === false, 'el item abierto no se confunde con uno cerrado');
  afirmar(items[2].linea === 10 && items[2].cerrado === true, 'un `- [x]` sale marcado cerrado, como una fila tachada');
  afirmar(items.filter((f) => !f.cerrado).length === 2, 'el filtro de vivas deja fuera al item cerrado y deja los DOS bloqueos');
  afirmar(items.length === new Set(items.map((f) => f.id)).size, 'dos items nunca comparten id: el id es su linea');

  // Una cola con las DOS formas se mide entera: la tabla no le tapa los items ni al revés.
  const mixto = extraerBloqueos([
    '- [ ] 🔴 **Un item arriba de la tabla** **Verificador:** `npm run marca:chatwoot` → 0',
    '',
    '## Bloqueado en Sergio',
    '| # | Que |',
    '|---|---|',
    '| S9 | una fila. **Verificador:** `npm run deploy:alcanzable` → 0 |',
  ].join('\n'));
  afirmar(mixto.length === 2, 'una cola con tabla Y items devuelve los dos');
  afirmar(mixto.some((f) => f.id === 'S9'), 'la fila de la tabla sigue saliendo con su id');

  // La guarda de ejecucion, que es la parte peligrosa.
  const scripts = { 'marca:chatwoot': 'node x.mjs' };
  const existe = (p) => p === 'scripts/ok.mjs';
  afirmar(validarComando('npm run marca:chatwoot', scripts).bin === 'npm', 'un npm script declarado se corre');
  afirmar(validarComando('npm run no-existe', scripts).error, 'un npm script inexistente NO se corre');
  afirmar(validarComando('node scripts/ok.mjs', scripts, existe).bin === 'node', 'un script del repo se corre');
  afirmar(validarComando('node scripts/fantasma.mjs', scripts, existe).error, 'un archivo inexistente NO se corre');
  afirmar(validarComando('node ../../etc/passwd.js', scripts, existe).error, 'una ruta que sale del repo NO se corre');
  afirmar(validarComando('node /etc/malo.js', scripts, existe).error, 'una ruta absoluta NO se corre');
  afirmar(validarComando('node scripts/ok.sh', scripts, existe).error, 'lo que no es .mjs/.js NO se corre');
  afirmar(validarComando('rm -rf /', scripts, existe).error, 'un comando arbitrario del documento NO se corre');
  afirmar(validarComando('npm run marca:chatwoot; rm -rf /', scripts).error, 'no se puede encadenar otro comando');
  afirmar(validarComando('node scripts/ok.mjs && curl evil', scripts, existe).error, 'no se puede encadenar despues de node');
  afirmar(validarComando('npm run marca:chatwoot', scripts).args.includes('--silent'), 'npm corre en silencio');

  // La traduccion por plataforma: sin ella, en win32 todo `npm run` salia `no-medido`.
  const planNpm = { bin: 'npm', args: ['run', '--silent', 'x'] };
  afirmar(resolverBin(planNpm, 'linux').bin === 'npm', 'en POSIX npm se corre directo');
  afirmar(resolverBin(planNpm, 'win32', () => true).bin === process.execPath, 'en win32 npm corre via node: .cmd sin shell no spawnea');
  afirmar(resolverBin(planNpm, 'win32', () => true).args.slice(1).join(' ') === 'run --silent x', 'la traduccion conserva los args validados');
  afirmar(resolverBin(planNpm, 'win32', () => false).bin === 'npm', 'sin npm-cli.js a la vista se intenta directo, no se inventa ruta');
  afirmar(resolverBin({ bin: 'node', args: ['x'] }, 'win32', () => true).bin === 'node', 'node no se traduce: ya es spawneable');

  // Que MUERDE: es la razon de existir del gate.
  afirmar(juzgar([{ id: 'S9', estado: 'bloqueado', linea: 1 }]).length === 0, 'un bloqueo que sigue vivo NO es un item');
  const vencido = juzgar([{ id: 'S16', estado: 'vencido', comando: 'npm run deploy:alcanzable', esperado: 0, linea: 220 }]);
  afirmar(vencido.length === 1 && vencido[0].includes('S16'), 'un bloqueo satisfecho SI es un item, y se nombra');
  afirmar(vencido[0].includes('linea 220'), 'el motivo dice DONDE esta la fila que hay que cerrar');
  afirmar(vencido[0].includes('a quien nombra'), 'y recuerda revisar al vecino, que es el daño real (S11 por S16)');
  const roto = juzgar([{ id: 'S9', estado: 'no-ejecutable', error: 'no existe', linea: 3 }]);
  afirmar(roto.length === 1 && roto[0].includes('no vence nunca'), 'un verificador que no corre SI es un item');
  afirmar(juzgar([{ id: 'S2', estado: 'sin-verificador', linea: 4 }]).length === 0, 'una fila sin verificador no es un item: se re-mide a mano');

  // Ids duplicados. El caso real que lo motiva: dos filas vivas `S12` el 2026-09-24, una de
  // ellas con el `ok` que Sergio Urcullo tiene que tipear para publicar el bot.
  const dupe = idsDuplicados([
    { id: 'S12', linea: 10, cerrado: false },
    { id: 'S13', linea: 11, cerrado: false },
    { id: 'S12', linea: 12, cerrado: false },
  ]);
  afirmar(dupe.length === 1, 'dos filas vivas con el mismo id son UN item, no dos');
  afirmar(/S12/.test(dupe[0]) && /10, 12/.test(dupe[0]), 'nombra el id repetido y las DOS lineas, para poder renumerar');
  afirmar(
    idsDuplicados([{ id: 'S1', linea: 1, cerrado: false }, { id: 'S2', linea: 2, cerrado: false }]).length === 0,
    'ids distintos no son un item',
  );
  afirmar(
    idsDuplicados([{ id: 'S8', linea: 1, cerrado: true }, { id: 'S8', linea: 2, cerrado: false }]).length === 0,
    'una fila CERRADA que comparte numero con una viva es historia, no ambiguedad',
  );
  afirmar(
    idsDuplicados([{ id: 'S8', linea: 1, cerrado: true }, { id: 'S8', linea: 2, cerrado: true }]).length === 0,
    'dos filas cerradas con el mismo id tampoco: nadie les tipea un ok',
  );

  // --- Plazo caduco en el TITULO de una tarea del tablero (el canal que si le llega a Sergio).
  const HOY = new Date('2026-09-25T12:00:00Z');
  const pv = (titulo, creado) => plazoVencidoEnTitulo(titulo, { hoy: HOY, creado: creado ? new Date(creado) : undefined });

  // El caso real que lo origino, tal cual estaba escrito.
  const vps = pv('🔴 HOY vence el VPS (24-sep): renovalo o se apaga TODO', '2026-09-24T12:00:00Z');
  afirmar(vps !== null, 'un titulo con una fecha ya pasada NO pasa callado');
  afirmar(vps?.tipo === 'vencido', 'la fecha absoluta vencida se llama `vencido`, que se arregla re-midiendo');
  afirmar(/24-sep/.test(vps?.detalle || ''), 'el detalle nombra la fecha que caduco, para no tener que abrir la tarea');

  // El hermano vigente el mismo dia: no se toca. Un gate que tambien marca lo vivo apaga el canal
  // que vino a limpiar — y este es justo el plazo real que el rojo falso estaba tapando.
  afirmar(pv('🔴 Cargá la tarjeta en Meta antes del 1-oct', '2026-09-25T12:00:00Z') === null,
    'una fecha que TODAVIA no llego no es un vencimiento');

  // Relativo congelado: era cierto el dia que se escribio y miente solo al dia siguiente.
  const rel = pv('Contestar hoy a los leads en silencio', '2026-09-20T12:00:00Z');
  afirmar(rel?.tipo === 'relativo', 'un «hoy» escrito otro dia se marca relativo, no vencido');
  afirmar(pv('Contestar hoy a los leads en silencio', '2026-09-25T09:00:00Z') === null,
    'un «hoy» escrito HOY todavia es cierto: no se molesta a nadie');
  afirmar(pv('Cargá la tarjeta en Meta en 6 días', '2026-09-20T12:00:00Z')?.tipo === 'relativo',
    '«en N dias» tambien caduca solo — el numero no se recalcula con el tiempo');

  // PASADO != PLAZO. Encontrado corriendo el gate en vivo el 2026-09-25: marco `vencido` la tarea
  // de reemplazo que acababa de escribirse BIEN («¿Renovaste el VPS? Venció el 24-sep y sigue
  // vivo»). Ese titulo no promete un plazo: reporta un hecho ya medido, que es exactamente la
  // forma correcta de reescribir un vencido. Un gate que marca su propia cura se apaga por ruido
  // en dos vueltas. El self-check no lo vio: hizo falta correrlo contra el tablero de verdad.
  afirmar(pv('¿Renovaste el VPS? Venció el 24-sep y sigue vivo — decime ok y lo cierro', '2026-09-25T12:00:00Z') === null,
    'un titulo que NARRA la fecha en pasado no esta pidiendo algo para esa fecha');
  afirmar(pv('Ya pasó el 24-sep sin cortes: confirmá y cierro', '2026-09-25T12:00:00Z') === null,
    '«ya paso el X» tampoco es un plazo pendiente');
  afirmar(pv('🔴 HOY vence el VPS (24-sep): renovalo', '2026-09-24T12:00:00Z')?.tipo === 'vencido',
    'el presente («vence el X») sigue siendo un plazo: la cura no puede tapar el caso original');

  // Sin plazo: la enorme mayoria de las tareas. Falso positivo aca = gate apagado por ruido.
  afirmar(pv('Elegí A o B: cómo se nota qué botón apretar', '2026-09-01T12:00:00Z') === null,
    'un titulo sin plazo no inventa uno');
  // Fin de año: `3-ene` leido en diciembre es futuro. Sin esto el gate marcaria vencido todo
  // enero cada diciembre, que es como un gate se gana que lo ignoren.
  afirmar(plazoVencidoEnTitulo('Pagar el 3-ene', { hoy: new Date('2026-12-20T12:00:00Z') }) === null,
    'una fecha de enero leida en diciembre es del año que viene, no un vencido');

  if (!process.exitCode) console.log(`self-check: ok — ${casos} casos`);
  process.exit(process.exitCode || 0);
}

// --- Modo tablero: las tareas `blocked` cuyo TITULO promete un plazo que ya caduco.
// Va aparte de las colas .md a proposito: una cola es trabajo del carril, y el tablero es el canal
// por donde el parte diario le habla a Sergio Urcullo. Este modo mide el SEGUNDO, que es el que
// llega. Tri-estado: exit 2 = no se pudo preguntar (nunca se confunde con «esta limpio»).
if (process.argv.includes('--tablero')) {
  const bin = process.env.ONIA_TABLERO_BIN || '/root/bin/onia-tablero.sh';
  if (!existsSync(bin)) {
    console.error(`NO MEDIDO — no existe ${bin}. El tablero vive en la maquina de los loops; desde otra no se puede preguntar.`);
    process.exit(2);
  }
  let tareas;
  try {
    const salida = execFileSync(bin, ['list', '--status', 'blocked', '--json'], {
      encoding: 'utf8', timeout: TIMEOUT_MS, stdio: ['ignore', 'pipe', 'pipe'],
    });
    tareas = JSON.parse(salida);
    if (!Array.isArray(tareas)) throw new Error('la salida no es una lista de tareas');
  } catch (e) {
    console.error(`NO MEDIDO — ${bin} no contesto una lista de tareas: ${e.message}`);
    process.exit(2);
  }

  const hoy = new Date();
  const caducos = [];
  for (const t of tareas) {
    const v = plazoVencidoEnTitulo(t?.title, {
      hoy,
      creado: t?.created_at ? new Date(typeof t.created_at === 'number' ? t.created_at * 1000 : t.created_at) : undefined,
    });
    if (v) caducos.push({ id: t.id, titulo: t.title, ...v });
  }

  if (caducos.length === 0) {
    console.log(`tablero: ${tareas.length} tarea(s) bloqueada(s), ninguna promete un plazo caduco`);
    process.exit(0);
  }
  console.error(`tablero: ${caducos.length} de ${tareas.length} tarea(s) bloqueada(s) le piden a Sergio Urcullo algo con un plazo que ya caduco:\n`);
  for (const c of caducos) {
    console.error(`  [${c.tipo}] ${c.id} — ${c.titulo}`);
    console.error(`      ${c.detalle}\n`);
  }
  process.exit(1);
}

const ruta = process.argv[2];
if (!ruta) {
  console.error('uso: node scripts/bloqueos_vencidos.mjs <cola.md> | --tablero | --self-check');
  process.exit(2);
}

const scripts = JSON.parse(await readFile(join(RAIZ, 'package.json'), 'utf8')).scripts ?? {};
const filas = extraerBloqueos(await readFile(ruta, 'utf8'));

if (!filas.length) {
  console.error(
    `NO MEDIDO — ${ruta} no tiene ni una tabla "Bloqueado en Sergio", ni un bloqueo abierto ` +
      `\`- [ ] 🔴\`, ni un item que declare su verificador ` +
      `(\`**Verificador:** \\\`<comando>\\\` → <codigo>\`). Sin eso no hay nada que correr.`,
  );
  process.exit(1);
}

const vivas = filas.filter((f) => !f.cerrado);
const conVerificador = vivas.filter((f) => f.comando);
const sinVerificador = vivas.filter((f) => !f.comando);

const resultados = [];
for (const f of conVerificador) {
  const plan = resolverBin(validarComando(f.comando, scripts));
  if (plan.error) { resultados.push({ ...f, estado: 'no-ejecutable', error: plan.error }); continue; }

  let salida = null;
  try {
    execFileSync(plan.bin, plan.args, { cwd: RAIZ, encoding: 'utf8', stdio: 'ignore', timeout: TIMEOUT_MS });
    salida = 0;
  } catch (e) {
    // `status` null = murio por señal o timeout: no se pudo medir, y no medir NO es vencido.
    salida = typeof e.status === 'number' ? e.status : null;
  }

  if (salida === null) resultados.push({ ...f, estado: 'no-medido', salida });
  else resultados.push({ ...f, estado: salida === f.esperado ? 'vencido' : 'bloqueado', salida });
}

for (const r of resultados) {
  const etiqueta = r.estado === 'vencido' || r.estado === 'no-ejecutable' ? 'ITEM    ' : 'OK      ';
  const detalle = r.estado === 'no-ejecutable' ? r.error : `salio ${r.salida}, la fila espera ${r.esperado}`;
  console.log(`  ${etiqueta} ${r.id.padEnd(4)} ${r.estado.padEnd(14)} ${detalle}`);
}

if (sinVerificador.length) {
  console.log(
    `  (${sinVerificador.length} fila(s) sin verificador mecanico, se re-miden a mano: ` +
      `${sinVerificador.map((f) => f.id).join(', ')})`,
  );
}

const motivos = [...juzgar(resultados), ...idsDuplicados(filas)];
if (!motivos.length) {
  console.log(`bloqueos vencidos: ${conVerificador.length} verificador(es) corrido(s), ninguno satisfecho — todos siguen bloqueados`);
  process.exit(0);
}

console.error(`\nBLOQUEO VENCIDO — ${ruta}`);
for (const m of motivos) console.error(`  - ${m}`);
console.error('\nUn bloqueo vencido le pide a Sergio una decision que ya tomo, y le presta su motivo falso al de al lado.');
process.exit(1);
