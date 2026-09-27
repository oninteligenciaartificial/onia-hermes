#!/usr/bin/env node
/**
 * punteros-de-cola.mjs — una cola que apunta a un archivo que NO esta donde dice
 * manda a la proxima vuelta a concluir que el archivo no existe.
 *
 *   node scripts/punteros-de-cola.mjs
 *   node scripts/punteros-de-cola.mjs --self-check
 *
 * NACE DE UNA MEDICION, NO DE UNA SOSPECHA (2026-09-26, carril chatbot-cola). Con las dos colas
 * de este carril sin item desbloqueado, la vuelta bajo al escalon "auditar los [x]" y conto los
 * punteros que citan. Alcance de la primera corrida: **310 rutas completas y 120 alias**, y de
 * ahi **5 sujetos rotos en 13 citas**, de tres clases distintas:
 *
 *   · 2 estaban en OTRA raiz del mismo repo — `scripts/inclusion-chatbot.mjs` y
 *     `scripts/chat-diferido-vivo.mjs` viven en `web-factory/apps/onia-platform/scripts/`.
 *     Hay TRES carpetas `scripts/` en juego (la raiz de onia-hermes, la del repo
 *     `onia-platform` y la de `web-factory/apps/onia-platform`), asi que un `scripts/x.mjs`
 *     pelado no dice cual. **Mi propia auditoria a mano se equivoco con estas dos antes de
 *     mirar**: las conto como inexistentes, que es justo el error que el gate evita.
 *   · 1 era un FOSIL citado 9 veces: `hermes-content/docs/chatbot/campanas-onia.knowledge.json`
 *     lo borro el commit `82831cc4` ("las 9 campanas vivian en un archivo que ningun deploy
 *     copiaba") y la cola lo siguio citando como si estuviera.
 *   · 2 eran ALIAS que no existen. `test:siat-fase1` es hoy `test:siat-todo` (430 pass, 0 fail);
 *     `test:traefik-auth-cloudflare` **nunca existio** — el alias es `test:auth-solo-cloudflare`
 *     y "traefik" es el nombre del ARCHIVO. Los dos estaban en frases que afirman que el gate
 *     esta cableado, o sea una promesa sobre el presente que manda a cablearlo de nuevo.
 *
 * POR QUE NO ALCANZA CON `verificar_cola.js`, QUE YA EXISTE, YA LEE BACKTICKS Y YA AVISA.
 * Ese gate exige que cada item de **"Ahora"** traiga al menos UNA ruta que exista —deja libres
 * "Despues" y "Bloqueado" a proposito: *"pueden hablar de cosas que todavia no existen: para eso
 * estan"*— y para las rutas que no existen imprime `AVISO fantasma-narrado`, que **no corta**:
 * sale exit 0. Esa decision es correcta y este gate no la toca. La diferencia es de pregunta:
 * aquel mide si el item tiene evidencia; este, si el puntero APUNTA BIEN. Y por eso puede ser
 * duro donde el otro solo avisa — un archivo que esta en otra raiz, o que git vio borrar, no es
 * trabajo futuro ni una narracion: es una ruta que manda al lugar equivocado, y eso se prueba.
 *
 * LAS CUATRO VERDICTOS POR RUTA CITADA, y por que el silencio es parte del diseno:
 *
 *   ok           esta donde dice                                  → nada que decir
 *   MISROUTADA   no esta ahi, pero el repo la tiene en otra raiz   → ROJO (y dice donde)
 *   FOSIL        no esta en ningun lado y git la vio BORRAR        → ROJO (y dice en que commit)
 *   sin juicio   no esta y git nunca la vio                        → SILENCIO
 *
 * El ultimo caso es el que hace sostenible correr esto en la cadena: una ruta que nunca
 * existio puede ser de otro repo, del VPS, o algo que todavia no se escribio. Juzgarla seria
 * reponer el falso positivo que este gate existe para matar.
 *
 * Y LOS ALIAS DE GATE (`test:algo`) SE MIDEN CONTRA `package.json`, sin excepcion. La misma
 * auditoria encontro dos citados que ya no existen: `test:siat-fase1` (hoy `test:siat-todo`)
 * y `test:traefik-auth-cloudflare` (hoy `test:auth-solo-cloudflare`). Los dos aparecian en
 * frases que afirman que el gate **esta cableado** — o sea una promesa sobre el presente. Un
 * alias renombrado y no barrido manda a buscar un gate que no contesta, y de ahi a cablearlo
 * de nuevo al lado del que ya corre.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Las dos colas que este carril lee en cada vuelta. No se barren las de otros carriles: un
// puntero roto ajeno se arregla en la vuelta de su dueno, no en la mia.
const COLAS = [
  'hermes-content/docs/cola/chatbot.md',
  'hermes-content/docs/cola/plataforma-v1.md',
];

// Extensiones que hacen que un trozo entre backticks sea una RUTA y no prosa.
const EXT = /\.(mjs|cjs|js|ts|tsx|json|md|sh|py|sql|yml|yaml)$/;

// Prefijos que declaran explicitamente otra raiz: el que los escribio ya dijo donde mirar.
const AJENAS = [/^\//, /^[a-z]+:\/\//i, /^onia-platform\//, /^~\//, /^\.\.\//];

const ALIAS = /^(?:npm run\s+)?(test:[a-z0-9-]+)$/;

/**
 * Trozos entre backticks, con su linea. Un item largo pone su evidencia en la continuacion.
 *
 * `tachado` marca los que vienen envueltos en `~~`. Esa es la salida para el puntero que se cita
 * como HISTORIA — "las 9 campañas vivian aca y el commit 82831cc4 lo borro" es una frase
 * verdadera y util, y un gate que la muerda empuja a borrar el registro para poner el verde.
 * Se eligio el tachado de markdown y no una lista de frases ("ya no existe", "se borro"…) por
 * una razon medida en este repo: **una lista de frases falla ABIERTA** — alcanza con redactarlo
 * distinto para que pase. El `~~` es estructura, lo ve el que lee la cola, y no hay forma de
 * escribirlo sin querer.
 */
export function trozosConLinea(texto) {
  const salida = [];
  texto.split(/\r?\n/).forEach((linea, i) => {
    for (const m of linea.matchAll(/(~~)?`([^`\n]+)`(~~)?/g)) {
      salida.push({ trozo: m[2].trim(), linea: i + 1, tachado: Boolean(m[1] && m[3]) });
    }
  });
  return salida;
}

/**
 * Solo se juzga lo que se LEE como ruta completa: la que arranca en una carpeta raiz del repo.
 *
 * ⚠️ Esta condicion no estaba en la primera version y la volvia daniña, medido al correrla:
 * acusaba 33 punteros y la mayoria eran ABREVIATURAS legitimas de la prosa —`lib/pricing.ts`,
 * `bot/knowledge.mjs`, `cola/chatbot.md`, `evals/evals.test.mjs`—, que nadie escribe creyendo
 * que son rutas desde la raiz. Peor: a `lib/pricing.ts`, que es del repo `onia-platform` y es
 * **fuente de precio**, la mandaba a `web-factory/.../src/lib/pricing.ts`, que es su ESPEJO.
 * Un gate que rutea de la fuente a la copia es peor que no tenerlo.
 *
 * `raices` sale del disco (`git ls-files`), no de una lista a mano: una carpeta nueva en la
 * raiz entra sola al alcance.
 */
export function esRuta(trozo, raices) {
  if (!EXT.test(trozo)) return false;
  if (/\s/.test(trozo)) return false;            // un comando, no una ruta
  if (!trozo.includes('/')) return false;        // un nombre suelto no promete ubicacion
  // ⚠️ Un GLOB no es un puntero, y medirlo como tal MIENTE: `app/api/**/route.ts` salio FOSIL en
  // la primera corrida del modo --producto porque `git log -- <pathspec>` resuelve comodines, y
  // le encontro el borrado de `app/api/webhooks/whatsapp/route.ts`. La cola hablaba de una FAMILIA
  // de rutas, que sigue viva y con 60 archivos. Se descarta aca, no en un modo: un comodin no
  // apunta a un archivo en ninguno de los dos.
  if (/[*?]/.test(trozo)) return false;
  if (AJENAS.some((re) => re.test(trozo))) return false;
  return raices.has(trozo.split('/')[0]);
}

/**
 * El juicio, con las tres preguntas inyectadas: asi el self-check corre sin tocar disco ni git.
 *   existe(ruta)      → boolean
 *   dondeEsta(ruta)   → string[] rutas del repo que TERMINAN en esa ruta
 *   commitQueBorro(r) → sha o null
 */
export function juzgarRuta(ruta, { existe, dondeEsta, commitQueBorro }) {
  if (existe(ruta)) return { veredicto: 'ok' };
  const otras = dondeEsta(ruta);
  if (otras.length) return { veredicto: 'MISROUTADA', donde: otras };
  const sha = commitQueBorro(ruta);
  if (sha) return { veredicto: 'FOSIL', sha };
  return { veredicto: 'sin juicio' };
}

/**
 * La frontera entre los dos modos, aparte para que el self-check la mida: una ruta que este repo
 * tiene (en cualquier raiz) la juzga `medir()`, que mira el DISCO; el modo `--producto` mira un
 * ref del repo hermano y sabe menos. Dos gates sobre el mismo sujeto acaban contradiciendose.
 */
export function loJuzgaElRepoLocal(ruta, sufijosDeAca) {
  return sufijosDeAca.has(ruta);
}

// ── medicion viva ───────────────────────────────────────────────────────────────────────

function listarArchivosDelRepo() {
  const salida = execFileSync('git', ['-C', RAIZ, 'ls-files'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return salida.split('\n').filter(Boolean);
}

function medir() {
  const archivos = listarArchivosDelRepo();
  const raices = new Set(archivos.map((f) => f.split('/')[0]).filter((s) => s));
  const porSufijo = new Map();
  for (const f of archivos) {
    // Se indexa por los DOS ultimos segmentos: es lo que distingue `scripts/x.mjs` de `x.mjs`.
    const partes = f.split('/');
    for (let n = 1; n <= Math.min(3, partes.length); n++) {
      const suf = partes.slice(-n).join('/');
      if (!porSufijo.has(suf)) porSufijo.set(suf, []);
      porSufijo.get(suf).push(f);
    }
  }

  const herramientas = {
    existe: (r) => fs.existsSync(path.join(RAIZ, r)),
    dondeEsta: (r) => (porSufijo.get(r) || []).filter((f) => f !== r),
    commitQueBorro: (r) => {
      try {
        const sha = execFileSync('git', ['-C', RAIZ, 'log', '--diff-filter=D', '--format=%h', '-1', '--', `:(literal)${r}`], { encoding: 'utf8' }).trim();
        return sha || null;
      } catch { return null; }
    },
  };

  const pkg = JSON.parse(fs.readFileSync(path.join(RAIZ, 'package.json'), 'utf8'));
  const aliasVivos = new Set(Object.keys(pkg.scripts || {}));

  const hallazgos = [];
  let rutasMiradas = 0;
  let aliasMirados = 0;
  let tachados = 0;

  for (const cola of COLAS) {
    const abs = path.join(RAIZ, cola);
    if (!fs.existsSync(abs)) {
      hallazgos.push({ cola, linea: 0, trozo: cola, veredicto: 'COLA AUSENTE', detalle: 'el gate mide una cola que no esta' });
      continue;
    }
    const texto = fs.readFileSync(abs, 'utf8');
    for (const { trozo, linea, tachado } of trozosConLinea(texto)) {
      if (tachado) { tachados++; continue; }
      const alias = trozo.match(ALIAS);
      if (alias) {
        aliasMirados++;
        if (!aliasVivos.has(alias[1])) {
          hallazgos.push({ cola, linea, trozo: alias[1], veredicto: 'ALIAS MUERTO', detalle: 'no esta en package.json' });
        }
        continue;
      }
      if (!esRuta(trozo, raices)) continue;
      rutasMiradas++;
      const j = juzgarRuta(trozo, herramientas);
      if (j.veredicto === 'MISROUTADA') {
        hallazgos.push({ cola, linea, trozo, veredicto: j.veredicto, detalle: `el repo la tiene en: ${j.donde.slice(0, 3).join(' · ')}` });
      } else if (j.veredicto === 'FOSIL') {
        hallazgos.push({ cola, linea, trozo, veredicto: j.veredicto, detalle: `la borro el commit ${j.sha}` });
      }
    }
  }

  console.log(`punteros de cola — ${rutasMiradas} ruta(s) completa(s) y ${aliasMirados} alias citados en ${COLAS.length} cola(s) · ${tachados} tachado(s) como historia`);
  // Agrupado por sujeto: una misma ruta citada nueve veces es UN puntero roto, no nueve.
  const porSujeto = new Map();
  for (const h of hallazgos) {
    const clave = `${h.veredicto} ${h.trozo} ${h.detalle}`;
    if (!porSujeto.has(clave)) porSujeto.set(clave, { ...h, lugares: [] });
    porSujeto.get(clave).lugares.push(`${h.cola}:${h.linea}`);
  }
  for (const h of porSujeto.values()) {
    console.log(`  ${h.veredicto}  \`${h.trozo}\` — ${h.detalle}`);
    console.log(`            citada en ${h.lugares.length}: ${h.lugares.slice(0, 6).join(' · ')}${h.lugares.length > 6 ? ' …' : ''}`);
  }
  if (!hallazgos.length) {
    console.log('VEREDICTO: ok — toda ruta citada esta donde dice, y todo alias citado existe en package.json.');
    return 0;
  }
  console.log(`VEREDICTO: ROTO — ${porSujeto.size} puntero(s) mandan al lugar equivocado (${hallazgos.length} cita(s)).`);
  console.log('  Una ruta MISROUTADA se escribe completa; un FOSIL se reemplaza por el sujeto de hoy;');
  console.log('  un ALIAS MUERTO se cambia por el que corre (mirar package.json), no se recablea al lado.');
  return 1;
}

// ── self-check: cada veredicto validado por mutacion, sin tocar disco ni git ─────────────

function selfCheck() {
  const fallos = [];
  const afirmar = (caso, real, esperado) => {
    if (real !== esperado) fallos.push(`${caso}: esperaba ${esperado}, dio ${real}`);
  };

  const vacio = { existe: () => false, dondeEsta: () => [], commitQueBorro: () => null };

  afirmar('una ruta que esta donde dice pasa',
    juzgarRuta('scripts/x.mjs', { ...vacio, existe: () => true }).veredicto, 'ok');

  afirmar('una ruta que vive en otra raiz es MISROUTADA',
    juzgarRuta('scripts/x.mjs', { ...vacio, dondeEsta: () => ['web-factory/apps/onia-platform/scripts/x.mjs'] }).veredicto,
    'MISROUTADA');

  afirmar('una ruta borrada es FOSIL',
    juzgarRuta('hermes-content/docs/x.json', { ...vacio, commitQueBorro: () => '82831cc4' }).veredicto, 'FOSIL');

  // El silencio es una afirmacion del diseno: sin esto el gate acusaria trabajo futuro.
  afirmar('una ruta que nunca existio no se juzga',
    juzgarRuta('hermes-content/docs/lo-que-viene.md', vacio).veredicto, 'sin juicio');

  // El orden importa: si MISROUTADA no ganara sobre FOSIL, un archivo MOVIDO (que git ve como
  // borrado en su ruta vieja) se reportaria como perdido en vez de decir donde esta hoy.
  afirmar('un archivo MOVIDO se reporta por donde esta, no por el borrado',
    juzgarRuta('scripts/x.mjs', { existe: () => false, dondeEsta: () => ['otra/scripts/x.mjs'], commitQueBorro: () => 'abc1234' }).veredicto,
    'MISROUTADA');

  const raices = new Set(['scripts', 'hermes-content', 'web-factory']);
  afirmar('un comando entre backticks no es una ruta', esRuta('node scripts/x.mjs', raices), false);
  afirmar('una ruta absoluta del VPS no se juzga', esRuta('/opt/onia/bot/webhook.env', raices), false);
  afirmar('una ruta del otro repo no se juzga', esRuta('onia-platform/lib/pricing.ts', raices), false);
  afirmar('un nombre suelto no promete ubicacion', esRuta('pricing.ts', raices), false);
  afirmar('una ruta del repo si se juzga', esRuta('scripts/x.mjs', raices), true);
  // La mutacion que valio el rojo: sin esta condicion el gate mandaba `lib/pricing.ts` —fuente
  // de precio del OTRO repo— a su espejo de web-factory.
  afirmar('una abreviatura de prosa NO se juzga', esRuta('lib/pricing.ts', raices), false);
  afirmar('otra abreviatura de prosa NO se juzga', esRuta('bot/knowledge.mjs', raices), false);

  // ── la frontera del modo --producto, que es de donde salio el hueco ──────────────────────
  // El sujeto que estuvo invisible: con las raices de ESTE repo, `lib/...` se descarta como
  // abreviatura de prosa (y esta bien: aca `lib` no existe). Con las del PRODUCTO se juzga.
  const raicesProducto = new Set(['lib', 'app', 'components', 'prisma', 'scripts']);
  afirmar('con las raices del producto, lib/ SI se juzga', esRuta('lib/whatsapp-bot.ts', raicesProducto), true);
  afirmar('con las raices de este repo, lib/ no se juzga', esRuta('lib/whatsapp-bot.ts', raices), false);
  // Sin esta frontera, `scripts/x.mjs` lo juzgarian LOS DOS modos y el que mira un ref ajeno
  // (que sabe menos) podria acusar de fosil lo que este repo tiene en el disco.
  afirmar('lo que este repo tiene se lo deja al modo local',
    loJuzgaElRepoLocal('scripts/x.mjs', new Set(['scripts/x.mjs'])), true);
  afirmar('lo que este repo no tiene pasa al modo producto',
    loJuzgaElRepoLocal('lib/whatsapp-bot.ts', new Set(['scripts/x.mjs'])), false);

  // El falso positivo que la primera corrida del modo --producto canto sola.
  afirmar('un glob no es un puntero', esRuta('app/api/**/route.ts', raicesProducto), false);
  afirmar('un glob del repo local tampoco', esRuta('scripts/*.mjs', raices), false);

  const t = trozosConLinea('una linea\nsigue `scripts/a.mjs` y `test:b`\n');
  afirmar('los trozos traen su linea', t.length === 2 && t[0].linea === 2 && t[1].trozo === 'test:b', true);

  const th = trozosConLinea('vivia en ~~`hermes-content/x.json`~~ y hoy en `hermes-content/y.json`');
  afirmar('el puntero tachado se marca como historia', th[0].tachado, true);
  afirmar('el puntero vivo de al lado NO se marca', th[1].tachado, false);

  if (fallos.length) {
    console.error('SELF-CHECK ROJO:');
    for (const f of fallos) console.error('  · ' + f);
    return 1;
  }
  console.log(`self-check ok — 21 caso(s), los cuatro veredictos validados por mutacion.`);
  return 0;
}

// ── modo --producto: las rutas del OTRO repo, que este gate deja en silencio a proposito ──
//
// NACE DEL HUECO DE SU PROPIO DISENO, medido el 2026-09-26 por el carril chatbot-cola. Arriba
// esta escrito que una ruta que "no esta y git nunca la vio" sale en SILENCIO porque "puede ser
// de otro repo". Correcto — y por eso mismo **todo el producto queda afuera**: `onia-platform`
// es otro repo, sus raices (`lib/`, `app/`, `prisma/`, `components/`) no son raices de este, y
// `esRuta` las descarta como abreviaturas de prosa. Resultado medido sobre `plataforma-v1.md`:
// **222 rutas de producto citadas y 4 fosiles invisibles** —
// `lib/whatsapp-bot.ts` + su test (los borro `abf6cb5b`, *retire the legacy direct WhatsApp
// webhook*, 2026-09-17) y `lib/whatsapp-ai.ts` + el suyo (`4f8441ae`). Dos items `[x]` decian
// "YA DESPLEGADO ... vive en produccion" sobre commits cuyo codigo ya no existe: el commit sigue
// siendo antepasado del build, y el archivo no esta. La proxima vuelta que abriera esa evidencia
// concluiria "no existe" en vez de "se mudo al motor de onia-center", que son dos vueltas.
//
// POR QUE ES UN MODO APARTE Y NO PARTE DE `medir()`: necesita el clon hermano. Un gate cuyo
// sujeto vive en otro repo se pone rojo POR AMBIENTE en cualquier arbol que no lo tenga, y este
// corre en la cadena del integrador, o sea que trabaria el merge de todos los carriles. La
// division ya esta medida en este repo: self-check puro en la cadena, medicion viva como alias
// suelto — y para que el alias no muera de olvido, entra a la lista de arranque del carril.
//
// TRI-ESTADO, sin excepcion: sin clon, sin `fetch` o sin `origin/master` sale **2 = NO MEDIDO**.
// No medir no es estar bien, y un `catch → false` aca diria "el producto esta sano" cuando lo
// unico cierto es que no se pudo preguntar.
const CLONES_PRODUCTO = [
  process.env.ONIA_PLATFORM_REPO,
  '/root/loops/onia-platform-chatbot',
  '/root/loops/onia-platform',
].filter(Boolean);

function arbolDelProducto() {
  for (const clon of CLONES_PRODUCTO) {
    if (!fs.existsSync(path.join(clon, '.git'))) continue;
    try {
      // Fetch primero: sin esto se mide el ref de disco y se falla EN VERDE.
      execFileSync('git', ['-C', clon, 'fetch', 'origin', '--quiet'], { encoding: 'utf8', timeout: 120_000 });
      const archivos = execFileSync('git', ['-C', clon, 'ls-tree', '-r', '--name-only', 'origin/master'],
        { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).split('\n').filter(Boolean);
      if (!archivos.length) continue;
      return { clon, archivos };
    } catch { /* probar el siguiente */ }
  }
  return null;
}

function medirProducto() {
  const arbol = arbolDelProducto();
  if (!arbol) {
    console.log('NO MEDIDO — ningun clon de onia-platform contesto `fetch` + `ls-tree origin/master`.');
    console.log(`  probados: ${CLONES_PRODUCTO.join(' · ')}`);
    console.log('  Se mide donde el clon EXISTE (o con ONIA_PLATFORM_REPO=<ruta>). No medir no es estar bien.');
    return 2;
  }
  const { clon, archivos } = arbol;
  const enProducto = new Set(archivos);
  const raicesProducto = new Set(archivos.map((f) => f.split('/')[0]).filter(Boolean));
  const porSufijoProducto = new Map();
  for (const f of archivos) {
    const partes = f.split('/');
    for (let n = 1; n <= Math.min(3, partes.length); n++) {
      const suf = partes.slice(-n).join('/');
      if (!porSufijoProducto.has(suf)) porSufijoProducto.set(suf, []);
      porSufijoProducto.get(suf).push(f);
    }
  }
  // Lo que este repo tiene se lo deja al modo local: dos gates sobre el mismo sujeto se
  // contradicen, y el local sabe mas (mira el disco, no un ref).
  const deAca = new Set(listarArchivosDelRepo());
  const sufijosDeAca = new Set();
  for (const f of deAca) {
    const partes = f.split('/');
    for (let n = 1; n <= Math.min(3, partes.length); n++) sufijosDeAca.add(partes.slice(-n).join('/'));
  }

  const herramientas = {
    existe: (r) => enProducto.has(r),
    dondeEsta: (r) => (porSufijoProducto.get(r) || []).filter((f) => f !== r),
    commitQueBorro: (r) => {
      try {
        const sha = execFileSync('git', ['-C', clon, 'log', '--all', '--diff-filter=D', '--format=%h', '-1', '--', `:(literal)${r}`],
          { encoding: 'utf8', timeout: 120_000 }).trim();
        return sha || null;
      } catch { return null; }
    },
  };

  const hallazgos = [];
  let miradas = 0;
  let tachados = 0;
  for (const cola of COLAS) {
    const abs = path.join(RAIZ, cola);
    if (!fs.existsSync(abs)) continue;
    for (const { trozo, linea, tachado } of trozosConLinea(fs.readFileSync(abs, 'utf8'))) {
      if (!esRuta(trozo, raicesProducto)) continue;
      if (loJuzgaElRepoLocal(trozo, sufijosDeAca)) continue;   // es de este repo: lo juzga `medir()`
      if (tachado) { tachados++; continue; }
      miradas++;
      const j = juzgarRuta(trozo, herramientas);
      if (j.veredicto === 'MISROUTADA') {
        hallazgos.push({ cola, linea, trozo, veredicto: j.veredicto, detalle: `el producto la tiene en: ${j.donde.slice(0, 3).join(' · ')}` });
      } else if (j.veredicto === 'FOSIL') {
        hallazgos.push({ cola, linea, trozo, veredicto: j.veredicto, detalle: `la borro el commit ${j.sha} de onia-platform` });
      }
    }
  }

  console.log(`punteros de PRODUCTO — ${miradas} ruta(s) de onia-platform citada(s) en ${COLAS.length} cola(s) · ${tachados} tachada(s) como historia · arbol ${clon} origin/master`);
  const porSujeto = new Map();
  for (const h of hallazgos) {
    const clave = `${h.veredicto} ${h.trozo} ${h.detalle}`;
    if (!porSujeto.has(clave)) porSujeto.set(clave, { ...h, lugares: [] });
    porSujeto.get(clave).lugares.push(`${h.cola}:${h.linea}`);
  }
  for (const h of porSujeto.values()) {
    console.log(`  ${h.veredicto}  \`${h.trozo}\` — ${h.detalle}`);
    console.log(`            citada en ${h.lugares.length}: ${h.lugares.slice(0, 6).join(' · ')}${h.lugares.length > 6 ? ' …' : ''}`);
  }
  if (!hallazgos.length) {
    console.log('VEREDICTO: ok — toda ruta de producto citada sigue en el arbol de onia-platform.');
    return 0;
  }
  console.log(`VEREDICTO: ROTO — ${porSujeto.size} puntero(s) de producto mandan al lugar equivocado (${hallazgos.length} cita(s)).`);
  console.log('  Un FOSIL del producto NO se borra de la cola: se TACHA con `~~` y se dice donde vive hoy esa');
  console.log('  capacidad. El `[x]` sigue siendo cierto (el trabajo se hizo); lo que caduco es el puntero.');
  return 1;
}

const esCLI = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (esCLI) {
  process.exit(process.argv.includes('--self-check') ? selfCheck()
    : process.argv.includes('--producto') ? medirProducto()
    : medir());
}
