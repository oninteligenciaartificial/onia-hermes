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

/**
 * Un alias citado. Dos formas, y la diferencia entre ellas es lo que evita 61 falsos positivos.
 *
 * ⚠️ NACE DEL HUECO DE SU PROPIO DISENO, medido el 2026-09-27 por el carril chatbot-cola. Aca
 * decia `^(?:npm run\s+)?(test:[a-z0-9-]+)$` — o sea que **solo veia el namespace `test:`**, y la
 * raiz tiene 50 namespaces mas (`precios:`, `avisos:`, `embudo:`, `sonda:`, `bot:`, `deploy:`…).
 * Un alias muerto en cualquiera de ellos era INVISIBLE, no rojo. Y el propio origen de este gate
 * (arriba) cuenta el caso `test:traefik-auth-cloudflare`: el mismo defecto, un namespace corrido.
 *
 * La forma BARE se acepta solo para `test:`, y eso no es pereza: en prosa de cola `chatwoot:58`,
 * `10:23:04`, `og:url`, `md:pb-28`, `postgres:postgres` y `node:test` tienen la misma forma que un
 * alias. Medido: aceptar cualquier `x:y` bare acusaba **61** sujetos, ninguno un alias. Con
 * `npm run` delante el que escribio ya declaro que es un alias ejecutable, asi que ahi no hay
 * ambiguedad — 0 ruido sobre 466 trozos.
 */
const ALIAS_BARE = /^(test:[a-z0-9-]+)$/;
const ALIAS_CON_RUN = /^npm run\s+([a-z0-9-]+:[a-z0-9:-]+)$/;

export function aliasCitado(trozo) {
  const m = String(trozo).trim().match(ALIAS_CON_RUN) || String(trozo).trim().match(ALIAS_BARE);
  return m ? m[1] : null;
}

/**
 * Un alias cuyo namespace la raiz NO usa es de OTRO package.json (o del repo `onia-platform`, que
 * no esta en este arbol): no se juzga. `gate:iconos` y `check:onia-core` son del producto, y
 * acusarlos seria inventar un fosil. Se cuentan aparte, nunca en silencio.
 */
export function juzgarAlias(alias, { vivos, propios }) {
  if (!propios.has(String(alias).split(':')[0])) return 'AJENO';
  return vivos.has(alias) ? 'VIVO' : 'ALIAS MUERTO';
}

/**
 * Los alias vivos salen de TODOS los package.json del repo, no solo del de la raiz.
 *
 * Es la misma leccion que ya costo una vuelta con las rutas: este repo tiene **21** package.json
 * (raiz, `onia-core`, las 6 apps de `web-factory`, los paquetes…). Medido: `precios:fuente` esta
 * vivo en `web-factory/apps/onia-platform` y contra la raiz sola salia MUERTO — un fosil inventado.
 */
export function aliasVivosDelRepo({ leer, listar = listarArchivosDelRepo } = {}) {
  const vivos = new Set();
  const ilegibles = [];
  for (const rel of listar()) {
    if (path.basename(rel) !== 'package.json' || rel.includes('node_modules/')) continue;
    const texto = leer ? leer(rel) : leerDelArbolOdelRef(rel);
    // ⚠️ Un package.json que el indice nombra y no se puede leer NO se ignora en silencio: en un
    // worktree sparse el archivo no esta en disco, y descartarlo INVENTA fosiles (sus alias
    // desaparecen y las citas quedan "muertas"). Se cuenta, y con uno solo el gate sale NO MEDIDO.
    if (texto === null) { ilegibles.push(rel); continue; }
    try {
      for (const k of Object.keys(JSON.parse(texto).scripts || {})) vivos.add(k);
    } catch { ilegibles.push(rel); }
  }
  return { vivos, ilegibles };
}

/** Disco primero (ve los alias sin commitear); si el worktree es sparse, el ref del indice. */
function leerDelArbolOdelRef(rel) {
  try { return fs.readFileSync(path.join(RAIZ, rel), 'utf8'); } catch { /* sigue por el ref */ }
  try { return execFileSync('git', ['-C', RAIZ, 'show', `HEAD:${rel}`], { encoding: 'utf8' }); } catch { return null; }
}

/**
 * Los INSTRUMENTOS: los archivos que los alias de la raiz nombran. Son sujetos derivados del
 * disco, no una lista a mano — un gate nuevo entra solo al alcance el dia que se cablea.
 *
 * ⚠️ POR QUE EXISTE (medido el 2026-09-27). El hueco de arriba era de namespace; este es de
 * SUJETO. El gate barria las dos colas, y la receta que un carril de verdad sigue cuando algo se
 * rompe no esta en la cola: **la IMPRIME el instrumento**. `scripts/sonda_widget.mjs:318` mandaba
 * a correr ~~`npm run bot:precios-vivos`~~ justo en el rojo de "el bot vivo cotiza un monto que ya no
 * existe" — y ese alias nunca existio (es `precios:vivos`). O sea que el remedio del peor momento
 * del carril moria en `Missing script`, y ningun gate podia verlo. El otro lugar que lo citaba era
 * la cabecera de `precios-vivos.mjs`, el propio instrumento.
 *
 * Los `*.test.*` quedan afuera CON motivo: un caso de prueba nombra alias de fixture a proposito
 * (`test:x`, `x:y`, `viejo:gate`) y acusarlos convierte el gate en ruido. Un fixture del propio
 * instrumento que necesite un alias muerto se TACHA con `~~`, igual que en las colas.
 */
export function instrumentosDeLosAlias(scripts, { existe = (p) => fs.existsSync(path.join(RAIZ, p)) } = {}) {
  const sujetos = new Set();
  for (const cmd of Object.values(scripts || {})) {
    for (const m of String(cmd).matchAll(/(?:^|\s)((?:scripts|hermes-content|web-factory|onia-core)[A-Za-z0-9_./-]*\.(?:mjs|cjs|js|ts|sh))/g)) {
      if (/\.test\.[a-z]+$/.test(m[1])) continue;
      if (existe(m[1])) sujetos.add(m[1]);
    }
  }
  return [...sujetos].sort();
}

/** Las citas `npm run <alias>` de un texto cualquiera, con su linea. Salta las tachadas. */
export function aliasDeUnInstrumento(texto) {
  const salida = [];
  String(texto).split(/\r?\n/).forEach((linea, i) => {
    for (const m of linea.matchAll(/(~~)?`?npm run\s+([a-z0-9-]+:[a-z0-9:-]+)`?(~~)?/g)) {
      if (m[1] && m[3]) continue;
      salida.push({ alias: m[2], linea: i + 1 });
    }
  });
  return salida;
}

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
  const { vivos: aliasVivos, ilegibles } = aliasVivosDelRepo();
  // El namespace lo define la RAIZ: es la que este gate puede juzgar. Los de otros package.json
  // aportan alias vivos (para no inventar fosiles) pero no amplian lo que se acusa.
  const propios = new Set(Object.keys(pkg.scripts || {}).filter((a) => a.includes(':')).map((a) => a.split(':')[0]));
  if (ilegibles.length) {
    console.log(`punteros de cola — NO MEDIDO: ${ilegibles.length} package.json del indice no se pudieron leer (${ilegibles.slice(0, 3).join(' · ')})`);
    console.log('  Sin todos los alias vivos, una cita sana se lee como fosil. No medir no es estar bien.');
    return 2;
  }

  const hallazgos = [];
  let rutasMiradas = 0;
  let aliasMirados = 0;
  let aliasAjenos = 0;
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
      const alias = aliasCitado(trozo);
      if (alias) {
        const v = juzgarAlias(alias, { vivos: aliasVivos, propios });
        if (v === 'AJENO') { aliasAjenos++; continue; }
        aliasMirados++;
        if (v === 'ALIAS MUERTO') {
          hallazgos.push({ cola, linea, trozo: alias, veredicto: 'ALIAS MUERTO', detalle: 'ningun package.json del repo lo tiene' });
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

  // Los instrumentos: la receta que un carril sigue cuando algo se rompe la imprime el gate, no
  // la cola. Ver el porque en `instrumentosDeLosAlias`.
  const instrumentos = instrumentosDeLosAlias(pkg.scripts);
  let citasDeInstrumento = 0;
  for (const rel of instrumentos) {
    let texto;
    try { texto = fs.readFileSync(path.join(RAIZ, rel), 'utf8'); } catch { continue; }
    for (const { alias, linea } of aliasDeUnInstrumento(texto)) {
      const v = juzgarAlias(alias, { vivos: aliasVivos, propios });
      if (v === 'AJENO') { aliasAjenos++; continue; }
      citasDeInstrumento++;
      if (v === 'ALIAS MUERTO') {
        hallazgos.push({ cola: rel, linea, trozo: alias, veredicto: 'ALIAS MUERTO', detalle: 'lo manda a correr un instrumento y ningun package.json lo tiene' });
      }
    }
  }

  console.log(`punteros de cola — ${rutasMiradas} ruta(s) completa(s) y ${aliasMirados} alias citados en ${COLAS.length} cola(s) · ${tachados} tachado(s) como historia`);
  console.log(`  instrumentos — ${citasDeInstrumento} cita(s) \`npm run\` en ${instrumentos.length} archivo(s) que los alias de la raiz nombran · ${aliasAjenos} alias de otro namespace, no juzgados`);
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
    console.log('VEREDICTO: ok — toda ruta citada esta donde dice, y todo alias citado (cola o instrumento) existe en algun package.json del repo.');
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
  // El conteo se DERIVA de las corridas: estaba escrito a mano ("21 caso(s)") y el numero se
  // queda viejo en cuanto alguien agrega un caso — un gate que miente sobre cuanto midio.
  let corridos = 0;
  const afirmar = (caso, real, esperado) => {
    corridos++;
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

  // ── alias: el namespace, que es el hueco del 2026-09-27 ───────────────────────────────────
  afirmar('un alias `test:` bare sigue siendo alias (sin regresion)', aliasCitado('test:bot'), 'test:bot');
  afirmar('un alias de OTRO namespace con `npm run` delante tambien', aliasCitado('npm run precios:vivos'), 'precios:vivos');
  // El caso que da nombre al arreglo — con el regex viejo esto daba null y el fosil era invisible.
  // El fixture usa un namespace que la raiz NO tiene a proposito: el fosil real de hoy se llama
  // `bot:`… y este archivo ES sujeto del barrido, asi que nombrarlo aca se acusaria a si mismo.
  // Esa es la propiedad buscada, no un estorbo: un instrumento no se exime de su propio gate.
  afirmar('un alias de namespace nuevo con `npm run` SI se lee', aliasCitado('npm run fulano:mengano'), 'fulano:mengano');
  // Y los cinco que costarian 61 falsos positivos si se aceptara cualquier `x:y` bare.
  afirmar('una conversacion de Chatwoot no es un alias', aliasCitado('chatwoot:58'), null);
  afirmar('una hora no es un alias', aliasCitado('10:23:04'), null);
  afirmar('una clave de og no es un alias', aliasCitado('og:url'), null);
  afirmar('una clase de tailwind no es un alias', aliasCitado('md:pb-28'), null);
  afirmar('una imagen de docker no es un alias', aliasCitado('node:20-alpine'), null);

  const propios = new Set(['test', 'precios', 'bot']);
  const vivos = new Set(['test:bot', 'precios:vivos', 'precios:fuente']);
  afirmar('un alias que existe pasa', juzgarAlias('precios:vivos', { vivos, propios }), 'VIVO');
  afirmar('un alias de un namespace propio que no existe es MUERTO', juzgarAlias('bot:precios-vivos', { vivos, propios }), 'ALIAS MUERTO');
  // `gate:iconos` y `check:onia-core` son del repo `onia-platform`, que no esta en este arbol:
  // acusarlos seria inventar un fosil, y callarlos sin contarlos seria fallar en verde.
  afirmar('un alias de un namespace ajeno no se juzga', juzgarAlias('gate:iconos', { vivos, propios }), 'AJENO');
  // El fosil inventado que costo la version anterior: vive en OTRO package.json del repo.
  afirmar('un alias vivo en otro package.json del repo no es fosil', juzgarAlias('precios:fuente', { vivos, propios }), 'VIVO');

  const pkgFalso = { scripts: { a: 'node scripts/vivo.mjs', b: 'node scripts/x.test.mjs', c: 'node /opt/afuera.mjs' } };
  const inst = instrumentosDeLosAlias(pkgFalso.scripts, { existe: (p) => p === 'scripts/vivo.mjs' || p === 'scripts/x.test.mjs' });
  afirmar('el instrumento que el alias nombra es sujeto', inst.includes('scripts/vivo.mjs'), true);
  afirmar('un *.test.* NO es sujeto (sus fixtures nombran alias a proposito)', inst.includes('scripts/x.test.mjs'), false);
  afirmar('una ruta fuera del repo no es sujeto', inst.length, 1);

  const citas = aliasDeUnInstrumento('linea\n// mirar `npm run precios:vivos` para eso\n// antes ~~`npm run viejo:gate`~~\n');
  afirmar('la cita del instrumento trae su linea', citas.length === 1 && citas[0].alias === 'precios:vivos' && citas[0].linea === 2, true);
  afirmar('una cita tachada en el instrumento es historia', citas.some((c) => c.alias === 'viejo:gate'), false);

  // El tri-estado de los alias vivos: un package.json del indice que no se puede leer NO se
  // descarta en silencio — en un worktree sparse eso borraria alias y convertiria citas sanas
  // en fosiles. Con uno ilegible el gate sale NO MEDIDO, no verde y no rojo.
  const sparse = aliasVivosDelRepo({ listar: () => ['package.json', 'web-factory/apps/x/package.json'], leer: (r) => (r === 'package.json' ? '{"scripts":{"test:a":"x"}}' : null) });
  afirmar('un package.json ilegible se cuenta, no se ignora', sparse.ilegibles.length, 1);
  afirmar('y los alias que si se leyeron se conservan', sparse.vivos.has('test:a'), true);
  const roto = aliasVivosDelRepo({ listar: () => ['package.json'], leer: () => '{no es json' });
  afirmar('un package.json ilegible por JSON invalido tambien se cuenta', roto.ilegibles.length, 1);

  if (fallos.length) {
    console.error('SELF-CHECK ROJO:');
    for (const f of fallos) console.error('  · ' + f);
    return 1;
  }
  console.log(`self-check ok — ${corridos} caso(s), los cuatro veredictos de ruta y los tres de alias validados por mutacion.`);
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
