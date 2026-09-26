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
 * 🔴 NO ESTA CABLEADO A NINGUNA CADENA, Y NO LO CABLEES TODAVIA: mide de mas y de menos, y las
 * DOS fallas estan medidas (2026-09-26, corrida sobre las dos colas → 8 sujetos, 6 falsos).
 * Cablear esto hoy pone un rojo falso en `npm test` y traba el merge de TODOS los carriles.
 *
 *   MIDE DE MAS — muerde HISTORIA, que por definicion habla de algo que ya paso:
 *     · `chatbot.md:4506`      el renglon de arriba dice "**En vuelo:**" y el de abajo
 *                              "✅ YA DESPLEGADO (medido 2026-09-25: `4bc6dad1` …)". El wrap
 *                              pega los dos y la correccion queda DENTRO del sujeto.
 *     · `plataforma-v1.md:506` "su arreglo (`b1247fb`) esta en `master` pero **no** en el build
 *                              vivo" — eso es DEPLOY pendiente, no trabajo en vuelo. Son dos
 *                              riesgos distintos y este gate no los separa.
 *     · `plataforma-v1.md:1759` y `:5715` son las dos notas que EXPLICAN esta misma leccion
 *                              ("el local decia `4d94cdf`…", "Entregado hoy al remoto — y el sha
 *                              cambio"). Morderlas premia borrar la correccion para ponerse
 *                              verde: el peor modo de falla que el hermano ya documenta.
 *     · `plataforma-v1.md:6317` relato en PASADO de un item de la seccion "Cerrado".
 *
 *   MIDE DE MENOS — se perdio el unico sujeto que de verdad estaba vencido:
 *     · `plataforma-v1.md:5890` "Commiteado, NO publicado en ningun remoto" NO salio, porque su
 *       sha (`71cd8fa9`) vive 6 renglones mas arriba: la afirmacion y el sha estan en frases
 *       DISTINTAS del mismo item. Se encontro a mano, no con esto.
 *
 * EL REDISENO, ya diagnosticado y sin escribir: la unidad no es la FRASE, es el ITEM ABIERTO
 * (`- [ ]`). Un item `- [x]` es historia por construccion —su prosa habla en pasado— y ahi caen
 * 5 de los 6 falsos; el sexto es una nota de correccion dentro de un item abierto, que pide
 * ensanchar `NOTA_DE_CORRECCION` con "YA DESPLEGADO" / "Entregado hoy al remoto" / "citaba". Y
 * tomar el item como unidad resuelve de una el sujeto perdido, porque junta el sha con su
 * afirmacion. Lo que NO se resuelve asi es separar "en vuelo" de "mergeado sin desplegar": eso
 * son dos gates, no uno — el segundo ya existe (`deploy-vivo.mjs`).
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
 * QUE MIDE. Frases que hablan en PRESENTE de trabajo sin publicar ("en vuelo", "en ningun
 * remoto", "solo en el clon de casa", "se pierde si...") Y ADEMAS citan un sha. De cada sha:
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
import { frases, NOTA_DE_CORRECCION } from './lib/frases_de_cola.mjs';

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
  const salida = [];
  for (const frase of frases(md, SHA)) {
    if (NOTA_DE_CORRECCION.test(frase.texto)) continue;
    if (DOCTRINA_DE_METODO.test(frase.texto)) continue;
    if (!LENGUAJE_DE_EN_VUELO.test(frase.texto)) continue;
    const vistos = new Set();
    for (const { id, linea } of frase.ocurrencias) {
      const sha = id.replaceAll('`', '');
      if (vistos.has(`${sha}:${linea}`)) continue;
      vistos.add(`${sha}:${linea}`);
      salida.push({ sha, linea, texto: frase.texto.trim() });
    }
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
