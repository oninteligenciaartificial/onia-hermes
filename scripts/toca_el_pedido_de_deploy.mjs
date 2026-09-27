#!/usr/bin/env node
/**
 * toca_el_pedido_de_deploy.mjs — «no es uno de los 13» NO es «no toca el pedido»: es justo lo
 * que hace que tocarlo lo vuelva el 14.º.
 *
 *   node scripts/toca_el_pedido_de_deploy.mjs              # mide las colas del disco
 *   node scripts/toca_el_pedido_de_deploy.mjs --self-check # casos puros, sin leer colas
 *
 * CODIGOS DE SALIDA
 *   0  ninguna frase absuelve a un archivo que el publicador copiaria
 *   1  al menos una absuelve a un archivo que SI viaja  → el item no esta desbloqueado
 *   2  no se pudo derivar la lista blanca, o cero sujetos → NO MEDIDO, nunca verde
 *
 * ────────────────────────────────────────────────────────────────────────────────────────
 * POR QUE EXISTE — la misma premisa leida en las DOS direcciones, en items vecinos del mismo
 * archivo, y una de las dos lecturas desbloquea trabajo que esta bloqueado.
 *
 * El deploy del bot esta parkeado detras de la firma de Sergio Urcullo (FIRMA_HUMANA), y el
 * cuerpo del pedido ENUMERA los archivos que publicaria. El metodo vigente de esta casa dice que
 * un cuerpo que queda corto obliga a rehacer el pedido y archivar el viejo. Asi que "cuantos
 * archivos toca mi arreglo" no es una curiosidad: decide si un item se puede hacer hoy.
 *
 * Medido el 2026-09-27 en `hermes-content/docs/cola/chatbot.md`, con el mismo dato de entrada:
 *
 *   :9576  «el archivo que hay que tocar **no es uno de esos 13**, asi que tocarlo lo haria
 *          el 14.º e invalidaria el pedido»                              → CORRECTO, y frena.
 *   :9710  «No toca el pedido de deploy vivo: `publicar.sh --dry-run` cuenta 13 y
 *          `espejo-check` no es uno»                                     → INVERTIDO, y suelta.
 *
 * Las dos hablan de un archivo que no esta entre los 13. La primera concluye que tocarlo suma
 * uno; la segunda, que tocarlo es gratis. `espejo-check.mjs` vive en la RAIZ del subarbol del bot
 * y cae en `*.mjs`, que es la lista blanca del publicador: editarlo lo hace aparecer como
 * `CAMBIA`, o sea el 14.º. El item quedo escrito como NO bloqueado y su arreglo habria invalidado
 * un pedido que ya iba por su cuarta version.
 *
 * La tercera —`:9808`, un item cerrado— es la que dice bien la razon, y por eso es el contraste
 * que define el juicio: «No toca ninguno de los 13 archivos del pedido de deploy del bot
 * (`scripts/` de `onia-hermes`, **no la carpeta del bot**)». La pregunta correcta nunca fue
 * "¿esta entre los N de hoy?" sino **"¿cae en la lista blanca del publicador?"**.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────
 * QUE MIDE
 *
 * Sujetos derivados del disco, nunca de una lista a mano:
 *
 *   - la LISTA BLANCA sale de `PATRONES=(...)` en el `deploy-bot.sh` del propio subarbol. Si
 *     manana alguien agrega `*.json` o saca `*.sh`, este gate se mueve con el. Copiar los globs
 *     aca seria fundar la cuarta fuente de verdad del mismo hecho.
 *   - los GLOBS SON DE RAIZ, no recursivos: el publicador hace `cd` al subarbol y expande
 *     `*.mjs` con el glob del shell, que no cruza `/`. Un `.mjs` en una subcarpeta NO viaja, y
 *     tratarlo como si viajara frenaria items que se pueden hacer hoy — el daño caro de este
 *     control, igual que en `deploy_sin_pedido.mjs`.
 *   - las FRASES salen de `lib/frases_de_cola.mjs`, no de renglones: estas colas tienen wrap duro
 *     a ~95 columnas y el lenguaje de absolucion cae en un renglon con el nombre del archivo en
 *     el siguiente. Medir renglones es como se apago su gate hermano.
 *
 * QUE ABSUELVE, y por que cada exclusion es necesaria:
 *   - una frase que ADVIERTE en vez de absolver (`asi que tocarlo lo haria el 14.º`,
 *     `invalidaria el pedido`): dice lo correcto, y acusarla ensena a borrar la advertencia;
 *   - los backticks que son COMANDOS —tienen espacios adentro (`publicar.sh --dry-run`)—: el
 *     archivo esta invocado, no propuesto. Sin esta guarda el gate acusa a toda frase que cite
 *     el comando con el que se deriva el recuento, o sea justo a la que midio bien;
 *   - lo tachado (`~~…~~`) y las notas de correccion fechadas, con la misma convencion que sus
 *     hermanos: el texto viejo se conserva CON su medicion al lado.
 *
 * PURO A PROPOSITO. No abre SSH ni docker, asi que entra en la cadena `npm test` con su medicion
 * viva incluida: todo lo que necesita —la lista blanca, los archivos del subarbol y las colas—
 * esta en el repo. La pregunta "¿ya existe en produccion?" no cambia el veredicto: exista o no,
 * `NUEVO` y `CAMBIA` suman al mismo recuento.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { frases, NOTA_DE_CORRECCION } from './lib/frases_de_cola.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Los subarboles que un `ok` publica con lista blanca y cuerpo enumerado. Hoy es uno; la forma
 * es una lista para que agregar el segundo sea una linea y no una reescritura.
 */
export const SUBARBOLES = [
  { nombre: 'bot', sub: 'hermes-content/deploy/vps-ops/bot', guion: 'deploy-bot.sh' },
];

/**
 * Lee `PATRONES=("*.mjs" "*.sh" …)` del guion de deploy. Devuelve `null` si no lo encuentra:
 * derivar mal la lista blanca y seguir seria peor que no medir, porque absolveria a todos.
 */
export function patronesDelGuion(texto) {
  const m = /^\s*PATRONES=\(([^)]*)\)/m.exec(String(texto ?? ''));
  if (!m) return null;
  const globs = [...m[1].matchAll(/"([^"]+)"|'([^']+)'|(\S+)/g)].map((g) => g[1] ?? g[2] ?? g[3]);
  return globs.length > 0 ? globs : null;
}

/** Un glob de shell de un solo segmento (`*.mjs`, `knowledge.onia.json`) contra un basename. */
export function caeEnGlob(basename, glob) {
  if (basename.includes('/') || glob.includes('/')) return false;
  const rx = new RegExp(`^${glob.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*').replace(/\?/g, '[^/]')}$`);
  return rx.test(basename);
}

/**
 * Los basenames de la RAIZ del subarbol que el publicador copiaria. Sin recursion a proposito:
 * el glob del shell no cruza `/`.
 */
export function archivosQueViajan(dir, patrones, { leerDir = readdirSync, esArchivo } = {}) {
  const mirar = esArchivo ?? ((p) => { try { return statSync(p).isFile(); } catch { return false; } });
  const nombres = leerDir(dir);
  return nombres.filter((n) => mirar(resolve(dir, n)) && patrones.some((g) => caeEnGlob(n, g)));
}

/**
 * ¿La frase ABSUELVE (dice que el cambio no toca el pedido) o ADVIERTE (dice que lo tocaria)?
 *
 * La advertencia gana siempre: una frase que nombra la consecuencia esta razonando bien, y el
 * costo de equivocarse para ese lado es un gate que pide borrar la advertencia para ponerse
 * verde. Sin la vocal acentuada en `\b` — `invalidar[ií]a\b` no matchea «invalidaría».
 */
export const ABSUELVE = /no (?:toca|invalida|afecta|rehace)\b[^.]{0,90}?pedido|sin rehacer el pedido|no (?:es|son) (?:uno de )?(?:esos|los) \d+ archivos?\b(?![^.]{0,60}(?:as[ií] que|por eso))/i;
export const ADVIERTE = /(?:lo )?har[ií]a el \d+|invalidar[ií]a|lo volver[ií]a el \d+|sumar[ií]a (?:uno|un archivo)|rehacer(?:lo)? y archivar/i;

/** Backticks cuyo contenido es UN token: un nombre de archivo propuesto, no un comando corrido. */
export function tokensEnBackticks(texto) {
  return [...String(texto ?? '').matchAll(/`([^`]+)`/g)]
    .map((m) => m[1].trim())
    .filter((t) => t && !/\s/.test(t))
    .map((t) => t.replace(/[,.;:)]+$/, ''));
}

/**
 * Resuelve un token citado (`espejo-check`, `avisos-vivo.mjs`, `bot/espejo-check.mjs`) contra los
 * basenames que viajan. Acepta el nombre sin extension porque asi se cita en prosa, y ese fue
 * justo el caso que se escapo.
 */
export function viajaEsteToken(token, basenames) {
  const hoja = token.split('/').filter(Boolean).pop() ?? '';
  if (!hoja) return null;
  if (basenames.includes(hoja)) return hoja;
  const conExt = basenames.filter((b) => b.slice(0, b.lastIndexOf('.')) === hoja);
  return conExt.length === 1 ? conExt[0] : null;
}

/** Una frase que no afirma sobre hoy: tachada, o nota de correccion fechada. */
export function seSalta(texto) {
  return /~~/.test(texto) || NOTA_DE_CORRECCION.test(texto);
}

/**
 * LA DOCUMENTACION DE UN DETECTOR ES CORPUS DEL DETECTOR — y este se acuso a si mismo.
 *
 * Medido en esta misma vuelta: la nota de correccion que escribi para el item conserva el texto
 * viejo entre `*«…»*` (la convencion de `CLAUDE.md`: se corrige CON la medicion al lado, no se
 * borra), y el gate leyo esa CITA como una absolucion nueva. O sea: pedia borrar la correccion
 * para ponerse verde, que es como se apaga un gate.
 *
 * El recorte es el mismo de `frontera_sin_veredicto_congelado.mjs:textoJuzgable` —reemplazar por
 * espacios, no borrar, para no correr los offsets— pero SOLO alcanza a lo citado. Los backticks
 * de una linea NO se recortan, al contrario del hermano: ahi vive el nombre del archivo, que es
 * justo el sujeto de este gate. Y los bloques de codigo se blanquean ANTES de partir en frases
 * (ver `sinBloquesDeCodigo`), no aca.
 */
export function sinCitas(texto) {
  return String(texto ?? '')
    .replace(/\*«[\s\S]*?»\*/gu, (m) => ' '.repeat(m.length))
    .replace(/«[\s\S]*?»/gu, (m) => ' '.repeat(m.length));
}

/**
 * Blanquea el CONTENIDO de las cercas de codigo, conservando los renglones.
 *
 * Va antes de `frases()` y no adentro de una frase, porque `frases_de_cola.mjs` corta en la cerca:
 * una frase nunca contiene ` ``` … ``` ` entera, sino un renglon suelto de adentro. Medido en esta
 * vuelta — con el recorte puesto en el lugar equivocado, un comentario de shell
 * (`# No toca el pedido: …`) seguia acusando. La leyenda de un comando no es una afirmacion sobre
 * hoy, igual que en el hermano.
 */
export function sinBloquesDeCodigo(md) {
  let dentro = false;
  return String(md ?? '').split(/\n/).map((l) => {
    if (/^\s*```/.test(l)) { dentro = !dentro; return l; }
    return dentro ? '' : l;
  }).join('\n');
}

/**
 * DOS PUNTOS NO CIERRAN UNA ABSOLUCION: LA ABREN.
 *
 * Es el defecto que este gate tuvo primero, y se vio exigiendo el rojo antes de arreglar: sobre
 * la cola real salio `0 acusada(s)` con el sujeto delante. `frases_de_cola.mjs` corta en `:`
 * —correcto para sus dos consumidores, que buscan ids del tablero— pero en esta prosa los dos
 * puntos INTRODUCEN la evidencia: «No toca el pedido de deploy vivo:» cierra ahi, y
 * `espejo-check` —el unico nombre que puede desmentirla— queda en la frase siguiente.
 *
 * Se arregla ACA y no en la libreria a proposito: cambiar `cierraFrase` moveria el suelo de
 * `bloqueo_citado_vivo.mjs` y `en_vuelo_vencido.mjs`, que ya estan verdes sobre esa unidad. Lo
 * que es propio de este gate es que su sujeto viaja DESPUES del terminador.
 */
export function conLaEvidencia(lista, i) {
  const f = lista[i];
  if (!/:\s*$/.test(f.texto)) return f.texto;
  const sigue = lista[i + 1];
  if (!sigue || sigue.bloque !== f.bloque) return f.texto;
  return `${f.texto} ${sigue.texto}`;
}

/**
 * El juicio, puro: frases de una cola + los basenames que viajan → acusaciones.
 */
export function juzgar(md, basenames) {
  const lista = frases(sinBloquesDeCodigo(md), /`[^`]+`/g);
  const sujetos = [];
  lista.forEach((f, i) => {
    if (!ABSUELVE.test(sinCitas(f.texto))) return;
    const texto = conLaEvidencia(lista, i);
    // La absolucion tiene que estar fuera de cita tambien en el texto EXTENDIDO: si los dos
    // puntos abren una cita del texto viejo, lo que sigue es historia, no una afirmacion.
    if (!ABSUELVE.test(sinCitas(texto))) return;
    // ADVIERTE y las guardas se juzgan sobre el texto EXTENDIDO: la consecuencia («…lo haria el
    // 14.º») tambien puede caer despues de los dos puntos, y absolver de menos es el daño caro.
    if (ADVIERTE.test(texto)) return;
    if (seSalta(texto)) return;
    const viajan = [...new Set(
      tokensEnBackticks(texto).map((t) => viajaEsteToken(t, basenames)).filter(Boolean),
    )];
    sujetos.push({
      linea: f.ocurrencias[0]?.linea ?? null,
      texto,
      viajan,
      acusada: viajan.length > 0,
    });
  });
  return sujetos;
}

// ── CLI ─────────────────────────────────────────────────────────────────────────────────
function medirColas() {
  const dirColas = resolve(RAIZ, 'hermes-content/docs/cola');
  if (!existsSync(dirColas)) {
    console.error('NO MEDIDO — no encuentro hermes-content/docs/cola/');
    return 2;
  }

  const basenames = [];
  for (const s of SUBARBOLES) {
    const dir = resolve(RAIZ, s.sub);
    const guion = resolve(dir, s.guion);
    if (!existsSync(guion)) {
      console.error(`NO MEDIDO — no encuentro ${s.sub}/${s.guion}: sin el guion no hay lista blanca.`);
      return 2;
    }
    const patrones = patronesDelGuion(readFileSync(guion, 'utf8'));
    if (!patrones) {
      console.error(`NO MEDIDO — no pude derivar PATRONES de ${s.sub}/${s.guion}.`);
      return 2;
    }
    console.log(`  lista blanca de ${s.nombre} (derivada de ${s.guion}): ${patrones.join(' ')}`);
    basenames.push(...archivosQueViajan(dir, patrones));
  }

  let sujetos = 0;
  const acusadas = [];
  for (const nombre of readdirSync(dirColas).filter((f) => f.endsWith('.md')).sort()) {
    const md = readFileSync(resolve(dirColas, nombre), 'utf8');
    for (const s of juzgar(md, basenames)) {
      sujetos++;
      if (s.acusada) acusadas.push({ ...s, cola: `hermes-content/docs/cola/${nombre}` });
    }
  }

  if (sujetos === 0) {
    console.error('NO MEDIDO — cero frases de frontera en las colas. "ninguna miente" y "no pude juzgar a ninguna" no se leen igual.');
    return 2;
  }

  for (const a of acusadas) {
    console.error(`ROJO ${a.cola}:${a.linea} — absuelve, y ${a.viajan.join(', ')} SI viaja(n) en el deploy: tocarlo(s) suma al recuento del pedido.`);
    console.error(`     «${a.texto.slice(0, 160)}»`);
  }
  console.log(`frontera del pedido: ${sujetos} frase(s) juzgada(s) sobre ${basenames.length} archivo(s) que viajan — ${acusadas.length} acusada(s)`);
  return acusadas.length > 0 ? 1 : 0;
}

function selfCheck() {
  let casos = 0;
  const ok = (cond, que) => { casos++; if (!cond) { console.error(`self-check FALLA: ${que}`); process.exit(1); } };

  // patronesDelGuion
  ok(String(patronesDelGuion('PATRONES=("*.mjs" "*.sh" "knowledge.onia.json")')) === '*.mjs,*.sh,knowledge.onia.json', 'lee los globs entrecomillados');
  ok(patronesDelGuion('nada aca') === null, 'sin PATRONES devuelve null y no absuelve a nadie');
  ok(patronesDelGuion('PATRONES=()') === null, 'una lista vacia es null, no una lista blanca vacia');

  // caeEnGlob
  ok(caeEnGlob('espejo-check.mjs', '*.mjs'), 'un .mjs de la raiz cae en *.mjs');
  ok(caeEnGlob('knowledge.onia.json', 'knowledge.onia.json'), 'el nombre literal cae');
  ok(!caeEnGlob('knowledge.example.json', 'knowledge.onia.json'), 'el literal no pega de mas');
  ok(!caeEnGlob('sub/x.mjs', '*.mjs'), 'el glob del shell NO cruza /');
  ok(!caeEnGlob('x.test.mjs', '*.sh'), 'no confunde extensiones');

  // tokensEnBackticks: el comando invocado no es un sujeto
  const t = tokensEnBackticks('`publicar.sh --dry-run` cuenta 13 y `espejo-check` no es uno (`grep -c espejo-check` → 0)');
  ok(!t.includes('publicar.sh'), 'un backtick con espacios es un COMANDO, no un archivo propuesto');
  ok(t.includes('espejo-check'), 'un backtick de un token si es sujeto');
  ok(tokensEnBackticks('`avisos-vivo.mjs`,').includes('avisos-vivo.mjs'), 'recorta la puntuacion pegada');

  // viajaEsteToken: el nombre sin extension es como se cita en prosa
  const bn = ['espejo-check.mjs', 'avisos-vivo.mjs', 'deploy-bot.sh'];
  ok(viajaEsteToken('espejo-check', bn) === 'espejo-check.mjs', 'resuelve el nombre sin extension');
  ok(viajaEsteToken('espejo-check.mjs', bn) === 'espejo-check.mjs', 'y con extension');
  ok(viajaEsteToken('bot/espejo-check.mjs', bn) === 'espejo-check.mjs', 'resuelve por hoja de la ruta');
  ok(viajaEsteToken('scripts/', bn) === null, 'una carpeta no es un archivo que viaje');
  ok(viajaEsteToken('deploy_sin_pedido.mjs', bn) === null, 'un .mjs de OTRA carpeta no viaja');

  // El contraste que define el juicio: las dos direcciones de la misma premisa.
  const suelta = '- [ ] **x.** van los dos archivos o ninguno. No toca el pedido de deploy vivo: `publicar.sh --dry-run` cuenta 13 y `espejo-check` no es uno (`grep -c espejo-check` → 0, medido el 2026-09-27).\n';
  const frena = '- [ ] **y.** El cuerpo enumera **13 archivos**, y el archivo que hay que tocar **no es uno de esos 13**, asi que tocarlo lo haria el 14.º e invalidaria el pedido.\n';
  const afuera = '- [x] **z.** No toca ninguno de los 13 archivos del pedido de deploy del bot (`scripts/` de `onia-hermes`, no la carpeta del bot), asi que se puede hacer.\n';

  const jSuelta = juzgar(suelta, bn);
  ok(jSuelta.length === 1 && jSuelta[0].acusada, 'la absolucion sobre un archivo que viaja se ACUSA');
  ok(jSuelta[0].viajan.includes('espejo-check.mjs'), 'y nombra el archivo que la desmiente');

  const jFrena = juzgar(frena, bn);
  ok(jFrena.every((s) => !s.acusada), 'la frase que ADVIERTE la consecuencia no se acusa');

  const jAfuera = juzgar(afuera, bn);
  ok(jAfuera.length === 1 && !jAfuera[0].acusada, 'la absolucion cuyo sujeto vive fuera del subarbol se absuelve');

  // Las guardas de conservacion
  ok(juzgar(`- [ ] ~~No toca el pedido de deploy: \`espejo-check\` no es uno de los 13~~\n`, bn).every((s) => !s.acusada), 'lo tachado no afirma');
  ok(juzgar(`- [ ] Aca decia que no toca el pedido de deploy y \`espejo-check\` si viaja — corregido el 2026-09-27.\n`, bn).every((s) => !s.acusada), 'una nota de correccion fechada no afirma');

  // La documentacion del detector es corpus del detector: la CITA del texto viejo no absuelve.
  const citada = '- [ ] **v.** Corregido: la frase terminaba en *«No toca el pedido de deploy vivo:»* con `espejo-check` en la frase siguiente.\n';
  ok(juzgar(citada, bn).every((s) => !s.acusada), 'lo citado entre *«»* es historia, no una absolucion nueva');
  const conCita = 'dice «no toca el pedido» y sigue';
  ok(sinCitas(conCita).length === conCita.length && !/pedido/.test(sinCitas(conCita)) && /sigue/.test(sinCitas(conCita)),
    'el recorte reemplaza por espacios (misma longitud, offsets intactos) y deja lo de afuera');
  ok(tokensEnBackticks('`espejo-check`').includes('espejo-check'), 'los backticks de una linea NO se recortan: ahi vive el sujeto');
  const enBloque = '- [ ] **u.** Derivar:\n\n      ```bash\n      # No toca el pedido: `espejo-check` no es uno de los 13\n      ```\n';
  ok(juzgar(enBloque, bn).every((s) => !s.acusada), 'una absolucion dentro de un bloque de codigo es leyenda, no afirmacion');

  // El wrap duro: el lenguaje de absolucion y el nombre en renglones distintos.
  const partida = '- [ ] **w.** El arreglo va en dos archivos. No toca el pedido de deploy vivo del bot:\n      `espejo-check` no es uno de los 13 que cuenta el publicador.\n';
  ok(juzgar(partida, bn).some((s) => s.acusada), 'reconstruye la frase a traves del wrap: renglones no, frases si');

  console.log(`self-check: ok — ${casos} casos`);
  return 0;
}

// La CLI corre SOLO cuando este archivo es el ejecutado. Sin esta guarda el modulo no es
// importable: quien lo pida se come la medicion y el `process.exit` del importado, y su propio
// self-check nunca corre — el falso verde que `lib/frases_de_cola.mjs` documenta y que
// `bloqueos_vencidos.mjs` ya pago. Medido aca mismo: el primer `import` de prueba imprimio el
// veredicto de las colas en vez de los casos puros.
if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  process.exit(process.argv[2] === '--self-check' ? selfCheck() : medirColas());
}
