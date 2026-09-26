#!/usr/bin/env node
/**
 * en_vuelo_vencido.mjs — una cola que dice "este commit esta EN VUELO y en ningun remoto: si la
 * maquina muere se pierde" tiene que estar diciendo la verdad HOY.
 *
 * Nace del 2026-09-26, auditando las dos colas de este carril. Los DOS sujetos vivos estaban
 * vencidos, y los dos citaban un sha que no existe en ningun remoto:
 *
 *   plataforma-v1.md:5890  "Commiteado, NO publicado en ningun remoto — y esto se pierde si
 *                           nadie lo entrega" citando `71cd8fa9`
 *                          → publicado como `e3276455`, patch-id identico (97706f49...).
 *   chatbot.md:3758        "🔴 EN VUELO, con su riesgo: el commit `42eab9a8` esta solo en el
 *                           clon de casa. Si esa maquina se pierde, se pierde el arreglo"
 *                          → publicado como `eb6182d3`, y YA MERGEADO en origin/master.
 *
 *   node scripts/en_vuelo_vencido.mjs hermes-content/docs/cola/chatbot.md
 *   node scripts/en_vuelo_vencido.mjs --self-check
 *
 * CABLEADO el 2026-09-26: `npm run test:en-vuelo-vencido` (SOLO el `--self-check`, 18 casos) va en
 * la cadena del integrador, y la medicion viva es `npm run envuelo:vencido`, en la lista de
 * arranque de este carril. La medicion viva NO se cablea a la cadena: necesita el clon de
 * `onia-platform` y `fetch` a los remotos, asi que un gate asi se pone rojo por ambiente y traba
 * el merge de TODOS los carriles.
 *
 * COMO ERA HASTA ESE DIA, porque explica la forma del archivo: medido sobre las dos colas daba
 * **7 sujetos y 6 eran falsos**, y encima perdia el unico realmente vencido.
 *
 *   MEDIA DE MAS — mordia HISTORIA, que por definicion habla de algo que ya paso. CINCO de los
 *   seis falsos (`chatbot.md:4519`, `plataforma-v1.md:506`, `:1759`, `:6329`) vivian dentro de un
 *   item `- [x]`. El sexto (`plataforma-v1.md:5715`) es una nota de correccion en un item
 *   ABIERTO: dice "Este parrafo citaba `9d6d7bc6`". Morder una correccion es el peor modo de
 *   falla que el hermano ya documenta — le pide borrarla para ponerse verde.
 *
 *   MEDIA DE MENOS — `plataforma-v1.md:5890` decia "Commiteado, NO publicado en ningun remoto" y
 *   su sha (`71cd8fa9`) vivia unos renglones mas abajo: la afirmacion y el sha estaban en frases
 *   DISTINTAS del mismo parrafo, y medir de a frases lo dejaba pasar. Se encontro a mano.
 *
 * EL ARREGLO, en dos piezas que atacan causas distintas:
 *   1. `sinHistoria()` blanquea los items `- [x]` antes de medir. El tiempo verbal de un item no
 *      esta en sus palabras, esta en su CASILLA — y la casilla ya la escribe la cola, gratis.
 *   2. Una afirmacion sin sha adopta los shas de otras frases de su MISMO bloque de prosa. El
 *      bloque es un parrafo: el lenguaje de un parrafo nunca se empareja con el sha de otro.
 *   Mas el ensanche de `NOTA_DE_CORRECCION` con "YA DESPLEGADO" / "YA ENTREGADO" / "Entregado hoy
 *   al remoto" / "citaba", que es lo unico que salva al sexto falso (esta en un item abierto).
 *
 * LIMITE CONOCIDO, y se deja a proposito: separar "en vuelo" de "mergeado sin desplegar" son dos
 * preguntas distintas y este gate solo contesta la primera. `plataforma-v1.md:506` ("su arreglo
 * esta en `master` pero **no** en el build vivo") hoy no sale porque su item esta cerrado; el dia
 * que una frase asi viva en un item abierto, este gate la va a nombrar y el veredicto correcto lo
 * tiene el otro: `deploy-vivo.mjs`. No lo absorbas aca.
 *
 * POR QUE ES UN GATE Y NO UNA LECCION ESCRITA. Porque la leccion YA estaba escrita, dos veces, y
 * no alcanzo. `plataforma-v1.md:1759` la dejo anotada ("el local decia `4d94cdf`, que no existe
 * en ningun remoto") y `plataforma-v1.md:5713` la explica entera y CORRECTAMENTE — "Entregado
 * hoy al remoto — y el sha cambio, por eso el de arriba ya no se nombra". El parrafo de 5890 se
 * escribio el DIA SIGUIENTE y volvio a caer en la misma trampa. Una regla que se desobedece
 * teniendola al lado no necesita una tercera redaccion: necesita que algo la cuente.
 *
 * LA TRAMPA, que es la razon de ser del archivo: `git am` REGENERA el sha. El commit local se
 * entrega, nace con otro sha alla, y el sha viejo queda para siempre sin aparecer en ningun
 * remoto. Asi que el instrumento con el que las dos notas se "probaron" —
 * `git log HEAD --not --remotes=origin`— sigue devolviendo el sha local para siempre, y se lee
 * como "no esta entregado" cuando la verdad es "esta entregado con otro nombre". El sha es la
 * identidad equivocada para esta pregunta. La identidad que SI sobrevive a `git am` es el
 * MENSAJE, y el contenido se confirma con `patch-id`.
 *
 * QUE MIDE. Afirmaciones en PRESENTE de trabajo sin publicar ("en vuelo", "en ningun remoto",
 * "solo en el clon de casa", "se pierde si...") que citen un sha, y que vivan dentro de un item
 * ABIERTO o en la prosa suelta de la cola — nunca dentro de un `- [x]`. De cada sha:
 *   - su subject aparece en una ref publicada  → ITEM: la afirmacion esta VENCIDA.
 *   - no aparece                               → OK, el riesgo es real y la linea dice la verdad.
 *   - el sha no resuelve en ningun clon        → NO MEDIDO (exit 2), que no es estar bien.
 *
 * REUSA `frases()` DEL GATE HERMANO A PROPOSITO. El wrap duro a ~95 columnas de estas colas ya
 * costo un falso verde entero en `bloqueo_citado_vivo.mjs` (el lenguaje caia en un renglon y el
 * id en el siguiente, y ninguna lista blanca de frases podia morderlo porque estaba mal la
 * UNIDAD DE MEDIDA). Ese problema es de la cola, no de lo que se busca adentro: resolverlo de
 * nuevo aca seria garantizar que las dos copias se separen y que una de las dos vuelva a medir
 * renglones. Se importa, y con el importe viene gratis la exclusion de notas de correccion.
 *
 * FALLO CONSERVADOR, igual que el hermano. Sin `fetch` no se mide: las refs de disco de un clon
 * que nadie refresco declararian "no publicado" un commit entregado hace horas — es decir, el
 * MISMO falso positivo que este gate existe para cazar, producido por el gate. Si el fetch no se
 * puede hacer, el sujeto sale NO MEDIDO y el gate termina en 2, nunca en verde.
 */

import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { frases, sinHistoria, NOTA_DE_CORRECCION } from './lib/frases_de_cola.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const TIMEOUT_MS = Number(process.env.ONIA_EN_VUELO_TIMEOUT_MS || 60000);

/**
 * Los dos repos donde puede vivir un sha citado por estas colas. Se prueban LOS DOS porque una
 * cola de este carril cita commits de los dos indistintamente, y "no esta en el repo que mire"
 * no prueba nada sobre el otro.
 */
export const REPOS = [
  process.env.ONIA_HERMES_REPO || RAIZ,
  process.env.ONIA_PLATFORM_REPO || '/root/loops/onia-platform-chatbot',
];

/** Un sha citado va en backticks; suelto en la prosa matchea demasiadas palabras hex. */
const SHA = /`[0-9a-f]{7,40}`/g;

/**
 * Lenguaje que AFIRMA, en presente, que algo no llego a un remoto. Deliberadamente corto: cada
 * alternativa sale de un sujeto real medido, no de imaginar redacciones. Ensancharlo a ojo es
 * como se construye un gate que grita en falso y termina apagado.
 */
export const LENGUAJE_DE_EN_VUELO =
  /EN VUELO|en vuelo|NO publicado|no publicado|sin publicar|en ning[uú]n remoto|s[oó]lo en el clon|solo en el clon|se pierde si|podr[ií]a perderse|sin commitear y/i;

/**
 * Frases que hablan de en-vuelo EN GENERAL, sin ser una afirmacion sobre un commit concreto.
 * Estas colas explican a cada rato POR QUE un gate camina el disco ("un archivo nuevo sin
 * commitear es justo el sujeto a cazar"): es doctrina de metodo, no un riesgo vigente. Si el
 * gate las muerde, el ruido entierra a los dos sujetos que importan.
 */
export const DOCTRINA_DE_METODO =
  /sujeto a cazar|sujeto que (?:hay que )?cazar|sujeto que caza|git ls-files|readdirSync|justo el sujeto/i;

/**
 * Saca las afirmaciones de trabajo en vuelo con su sha. Sin red y sin disco: es lo que se prueba
 * en `--self-check`.
 *
 * El sha se reporta con SU renglon, no con el de la frase: en un archivo de 9.000 renglones el
 * renglon exacto es la mitad del arreglo.
 */
export function afirmacionesEnVuelo(md) {
  const vigentes = frases(sinHistoria(md), SHA).filter(
    (f) => !NOTA_DE_CORRECCION.test(f.texto) && !DOCTRINA_DE_METODO.test(f.texto),
  );

  const salida = [];
  const vistos = new Set();
  const anotar = (sha, linea, texto) => {
    if (vistos.has(`${sha}:${linea}`)) return;
    vistos.add(`${sha}:${linea}`);
    salida.push({ sha, linea, texto: texto.trim() });
  };

  for (const frase of vigentes) {
    if (!LENGUAJE_DE_EN_VUELO.test(frase.texto)) continue;

    // La afirmacion y su sha suelen caer en la misma frase. Cuando no —y ahi se perdio el unico
    // sujeto realmente vencido del 2026-09-26— el sha vive en otra frase del MISMO bloque de
    // prosa, a unos renglones. Se adopta de ahi, y solo de ahi: un bloque es un parrafo, asi que
    // el lenguaje de un parrafo nunca se empareja con el sha de otro. El renglon reportado es
    // siempre el DEL SHA, que es donde hay que escribir el arreglo.
    const propias = frase.ocurrencias;
    const prestadas = propias.length
      ? []
      : vigentes.filter((o) => o.bloque === frase.bloque && o !== frase).flatMap((o) => o.ocurrencias);
    for (const { id, linea } of [...propias, ...prestadas]) anotar(id.replaceAll('`', ''), linea, frase.texto);
  }
  return salida;
}

function git(repo, args) {
  return execFileSync('git', args, {
    cwd: repo,
    encoding: 'utf8',
    timeout: TIMEOUT_MS,
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
}

/** Encuentra el repo que conoce el sha. `null` = ninguno de los dos, o sea NO MEDIDO. */
function repoQueLoConoce(sha) {
  for (const repo of REPOS) {
    try {
      if (git(repo, ['cat-file', '-t', sha]) === 'commit') return repo;
    } catch {
      /* repo ausente o sha desconocido: se prueba el siguiente */
    }
  }
  return null;
}

/**
 * Pregunta si el commit ya viajo. Devuelve `{ publicado, como, mismoContenido }`, o `null`
 * cuando NO SE PUDO medir — que no es lo mismo que "no viajo".
 *
 * Busca por SUBJECT porque es lo unico que sobrevive a `git am`, y confirma con `patch-id`. Un
 * subject que coincide con patch-id distinto sigue siendo "ya entregado" (alguien lo edito al
 * entregarlo), y se dice, porque el riesgo que la linea denuncia —perderlo— ya no existe.
 */
export function yaViajo(repo, sha) {
  let subject;
  try {
    git(repo, ['fetch', 'origin', '--quiet']);
    subject = git(repo, ['log', '-1', '--format=%s', sha]);
  } catch {
    return null;
  }
  if (!subject) return null;
  try {
    const encontrado = git(repo, [
      'log', '--remotes=origin', '--format=%H', '-F', `--grep=${subject}`, '-1',
    ]);
    if (!encontrado) return { publicado: false };
    const patchDe = (c) =>
      execFileSync('sh', ['-c', `git show ${c} | git patch-id --stable`], {
        cwd: repo, encoding: 'utf8', timeout: TIMEOUT_MS, stdio: ['ignore', 'pipe', 'ignore'],
      }).trim().split(' ')[0];
    return {
      publicado: true,
      como: encontrado,
      mismoContenido: patchDe(sha) === patchDe(encontrado),
    };
  } catch {
    return null;
  }
}

export function juzgar(resultados) {
  const motivos = [];
  for (const r of resultados) {
    if (r.veredicto === null) continue; // no medido: es un aviso, no un item
    if (!r.veredicto.publicado) continue;
    const matiz = r.veredicto.mismoContenido
      ? 'con patch-id identico'
      : 'con el MISMO mensaje pero patch-id distinto (lo editaron al entregarlo)';
    motivos.push(
      `${r.archivo}:${r.linea} dice que \`${r.sha}\` esta en vuelo / sin publicar, y ya viajo: ` +
        `vive publicado como \`${r.veredicto.como.slice(0, 8)}\` ${matiz}. El sha local no va a ` +
        `aparecer nunca en un remoto porque \`git am\` lo regenera — reescribi la linea con el ` +
        `sha PUBLICADO, o borra el riesgo si ya no existe`,
    );
  }
  return motivos;
}

export const ALCANCE_DEL_VERDE =
  '  ALCANCE: esto mide las AFIRMACIONES de las colas, no el riesgo real de perder trabajo. Un\n' +
  '  commit en vuelo que ninguna cola nombre no se ve aca: lo mide `git log HEAD --not\n' +
  '  --remotes=origin` en cada clon.';

export function lineaDeExito(cuantas) {
  return `afirmaciones de trabajo en vuelo: ${cuantas}, todas siguen siendo ciertas\n${ALCANCE_DEL_VERDE}`;
}

if (process.argv.includes('--self-check')) {
  let casos = 0;
  const afirmar = (cond, que) => { casos++; if (!cond) { console.error('FALLO:', que); process.exitCode = 1; } };

  const md = [
    'Una linea cualquiera sin shas.',
    'El commit `42eab9a8` esta solo en el clon de casa: si esa maquina se pierde, se pierde.',
    'Camina el disco (no `git ls-files`: el archivo nuevo sin commitear es justo el sujeto a cazar).',
    'Aca decia que `71cd8fa9` no estaba publicado, y ya no es cierto: corregido el 2026-09-26.',
    'El arreglo `abc1234` esta mergeado y desplegado, nada pendiente.',
  ].join('\n');

  const vistas = afirmacionesEnVuelo(md);
  afirmar(vistas.length === 1, `solo la afirmacion real es sujeto (vio ${vistas.length})`);
  afirmar(vistas[0].sha === '42eab9a8' && vistas[0].linea === 2, 'saca el sha y SU renglon');
  afirmar(!vistas.some((v) => v.sha === '71cd8fa9'), 'una nota de correccion fechada NO es una afirmacion');
  afirmar(!vistas.some((v) => v.sha === 'abc1234'), 'sin lenguaje de en-vuelo no hay sujeto');

  // El caso que costo el falso verde del hermano: wrap duro con el lenguaje y el sha separados.
  const partido = 'El commit quedo EN VUELO, con su riesgo, y no llego a\nningun remoto: es `deadbeef` y se pierde si muere.';
  afirmar(
    afirmacionesEnVuelo(partido).some((v) => v.sha === 'deadbeef'),
    'reconstruye la frase: lenguaje en un renglon y sha en el siguiente',
  );

  // Doctrina de metodo partida en dos renglones tampoco muerde.
  const doctrina = 'Camina el disco con readdirSync y no git ls-files, porque un archivo\nnuevo sin commitear `0123abc` es justo el sujeto a cazar.';
  afirmar(afirmacionesEnVuelo(doctrina).length === 0, 'la doctrina de metodo no es un riesgo vigente');

  // ── LA UNIDAD ES EL ITEM ABIERTO ────────────────────────────────────────────────────────
  // 6 de los 7 sujetos medidos el 2026-09-26 eran falsos, y 5 vivian dentro de un item `- [x]`:
  // un item cerrado es historia POR CONSTRUCCION — su prosa cuenta lo que ya paso. Los tramos
  // de abajo son COPIA TEXTUAL de los falsos medidos, no redacciones inventadas: un caso
  // sanitizado se pone verde sin arreglar el sujeto real (paso en el primer intento de esto).
  const historiaPura = [   // plataforma-v1.md:6322-6329, relato en pasado de un item cerrado
    '- [x] **CERRADO el 2026-09-26 12:10 La Paz — publicado en la rama del carril `873d0729`, NO',
    '      mergeado a `master` y NO desplegado.** La tarjeta de WhatsApp del panel tipeaba el monto',
    '',
    '      **Cómo apareció, que es la parte que importa:** no estaba en ninguna cola. La vuelta',
    '      arrancó midiendo el objetivo y encontró en `/root/loops/onia-platform-chatbot` **un commit',
    '      que no estaba en ningún remoto** (`git log HEAD --not --remotes=origin` → `71cd8fa9`, del',
    '      26-sep 00:59 La Paz). Desde nodo-casa este repo no puede pushear.',
  ].join('\n');
  afirmar(
    afirmacionesEnVuelo(historiaPura).length === 0,
    'un item `- [x]` es historia: su relato en pasado no es una afirmacion vigente',
  );

  // chatbot.md:4518-4520 — la correccion se inserto A MEDIA FRASE partida por el wrap, asi que
  // "En vuelo:" queda pegado a los tres shas de la nota. Cerrado: lo mata la unidad.
  const correccionAMediaFrase = [
    '      **En vuelo:** commiteado y pusheado a la rama; **falta el merge a `master` (de `onia-cola`)',
    '      ✅ YA DESPLEGADO (medido 2026-09-25: `4bc6dad1` `f3082204` vive en produccion `39234c89`).',
    '      y el deploy**. No cuenta como llegado al cliente.',
  ].join('\n');
  afirmar(
    afirmacionesEnVuelo(`- [x] 🔴 **~~Dos caminos mas elegian dueño de un inbox~~**\n\n${correccionAMediaFrase}`).length === 0,
    'la correccion insertada a media frase, en un item cerrado, no es sujeto',
  );
  // Y en un item ABIERTO tampoco, pero por la otra razon: "YA DESPLEGADO" es una correccion.
  afirmar(
    afirmacionesEnVuelo(`- [ ] 🔴 **Falta el merge**\n\n${correccionAMediaFrase}`).length === 0,
    '"YA DESPLEGADO" es una nota de correccion aunque el item siga abierto',
  );

  const enItemAbierto = [
    '- [ ] 🔴 **Terminar el emisor**',
    '',
    '      El commit `cafe123` esta EN VUELO y en ningun remoto: si muere la maquina se pierde.',
  ].join('\n');
  const vistasAbierto = afirmacionesEnVuelo(enItemAbierto);
  afirmar(
    vistasAbierto.length === 1 && vistasAbierto[0].sha === 'cafe123',
    `el MISMO texto en un item abierto SI es sujeto (vio ${vistasAbierto.length})`,
  );

  // El sujeto PERDIDO del 2026-09-26: la afirmacion y el sha caen en frases DISTINTAS del mismo
  // parrafo (a 6 renglones), asi que medir de a frases lo dejaba pasar. Se encontro a mano.
  const shaLejos = [
    '- [ ] 🔴 **T-plata — el metodo de pago de Meta**',
    '',
    '      Commiteado, NO publicado en ningun remoto — y esto se pierde si nadie lo entrega.',
    '      El gate quedo cableado y los tres gates dieron verde en el clon de casa.',
    '      Lo entrega `71cd8fa9`, que es el unico commit del arreglo.',
  ].join('\n');
  const vistasLejos = afirmacionesEnVuelo(shaLejos);
  afirmar(
    vistasLejos.some((v) => v.sha === '71cd8fa9' && v.linea === 5),
    'empareja la afirmacion con un sha de OTRA frase del mismo parrafo, y reporta el renglon del SHA',
  );

  // Y no al reves: el item es el ambito de la HISTORIA, no del emparejamiento. Lenguaje en un
  // parrafo y sha en otro, a 20 renglones, no es una afirmacion sobre ese commit.
  const parrafosDistintos = [
    '- [ ] 🔴 **Un item largo**',
    '',
    '      Aquel commit quedo EN VUELO y en ningun remoto.',
    '',
    '      **Otro parrafo, otro tema.** El arreglo que ya viajo es `bead111`.',
  ].join('\n');
  afirmar(
    afirmacionesEnVuelo(parrafosDistintos).length === 0,
    'lenguaje en un parrafo y sha en otro NO se emparejan: el ambito es el parrafo',
  );

  // El 6.º falso: nota de correccion dentro de un item ABIERTO, donde la unidad no ayuda.
  // Copia textual de plataforma-v1.md:5713-5716 — no dice "aca decia", dice "citaba".
  const notaEnAbierto = [
    '- [ ] 🔴 **Dos propuestas de diseño para el dashboard del producto**',
    '',
    '      ⚠️ **2026-09-25 (chatbot-cola) — el commit estaba EN VUELO y en ningún remoto: la pieza',
    '      podía perderse entera, y la tarea que le pide a Sergio Urcullo elegir le daba un link',
    '      que no abre.** Este párrafo citaba `9d6d7bc6`, que era un commit del clon de casa de',
    '      `onia-platform` — cuyo `push` está DESHABILITADO a propósito.',
  ].join('\n');
  afirmar(
    afirmacionesEnVuelo(notaEnAbierto).length === 0,
    'una nota de correccion dentro de un item abierto tampoco afirma lo que cita',
  );

  // La prosa de una seccion no es un item, y no por eso deja de medirse: la cabecera de estas
  // colas tambien puede afirmar que hay trabajo sin publicar.
  const prosaSuelta = '## Ahora\n\nEl arreglo `feed0ff` quedo sin publicar en ningun remoto: se pierde si muere el clon.';
  afirmar(
    afirmacionesEnVuelo(prosaSuelta).some((v) => v.sha === 'feed0ff'),
    'la prosa fuera de todo item se sigue midiendo',
  );

  afirmar(juzgar([{ veredicto: null }]).length === 0, 'NO MEDIDO no inventa un item');
  afirmar(
    juzgar([{ archivo: 'c.md', linea: 9, sha: 'aaaaaaa', veredicto: { publicado: false } }]).length === 0,
    'un riesgo real y vigente no es un item',
  );
  const item = juzgar([
    { archivo: 'c.md', linea: 9, sha: 'aaaaaaa', veredicto: { publicado: true, como: 'bbbbbbbb1111', mismoContenido: true } },
  ]);
  afirmar(item.length === 1 && item[0].includes('`bbbbbbbb`'), 'el item nombra el sha PUBLICADO, que es el arreglo');
  afirmar(item[0].includes('git am'), 'el item explica por que el sha local nunca aparece');

  if (!process.exitCode) console.log(`self-check: ok — ${casos} casos`);
} else {
  const archivos = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  if (!archivos.length) {
    console.error('uso: node scripts/en_vuelo_vencido.mjs <cola.md> [<cola.md>...] | --self-check');
    process.exit(2);
  }

  const resultados = [];
  let noMedidos = 0;
  for (const archivo of archivos) {
    const md = await readFile(join(RAIZ, archivo), 'utf8').catch(() => null);
    if (md === null) {
      console.log(`  NO MEDIDO  ${archivo} — no se pudo leer`);
      noMedidos++;
      continue;
    }
    for (const { sha, linea, texto } of afirmacionesEnVuelo(md)) {
      const repo = repoQueLoConoce(sha);
      const veredicto = repo ? yaViajo(repo, sha) : null;
      resultados.push({ archivo, linea, sha, texto, veredicto });
      if (veredicto === null) {
        noMedidos++;
        console.log(
          `  NO MEDIDO  ${archivo}:${linea} \`${sha}\` — ${repo ? 'no se pudo preguntar al remoto' : 'ningun clon conoce ese sha'}`,
        );
      } else if (veredicto.publicado) {
        console.log(`  VENCIDA    ${archivo}:${linea} \`${sha}\` → publicado como \`${veredicto.como.slice(0, 8)}\``);
      } else {
        console.log(`  OK         ${archivo}:${linea} \`${sha}\` — sigue sin viajar, el riesgo es real`);
      }
    }
  }

  const motivos = juzgar(resultados);
  if (motivos.length) {
    console.error('\nafirmaciones de trabajo en vuelo que ya VENCIERON:');
    for (const m of motivos) console.error(`  · ${m}`);
    process.exit(1);
  }
  if (noMedidos) {
    console.error(`\nNO MEDIDO: ${noMedidos} sujeto(s) sin veredicto. No medir no es estar bien.`);
    process.exit(2);
  }
  console.log(lineaDeExito(resultados.length));
}
