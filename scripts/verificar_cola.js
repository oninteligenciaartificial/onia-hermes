#!/usr/bin/env node
/**
 * verificar_cola.js — nada entra a "Ahora" sin evidencia de que existe.
 *
 * Regla de Sergio, 2026-08-30: *"nada entra a 'Ahora' sin evidencia de que existe
 * (archivo:linea, salida de comando o captura). Eso mata el trabajo fantasma."*
 *
 * Nace de un dato medido: en otra sesion, de 6 items declarados pendientes, **4 eran
 * fantasma** — no existian. Una cola con fantasmas es peor que no tener cola, porque se
 * planifica el dia sobre trabajo que no esta.
 *
 * Esta es la version mecanica de esa regla. Una regla que solo vive en un doc se
 * desobedece; una que falla con exit 1 no.
 *
 *   node scripts/verificar_cola.js <cola.md>
 *   node scripts/verificar_cola.js --self-check
 *
 * QUE EXIGE. Cada item de la seccion "Ahora" tiene que nombrar al menos una `ruta` entre
 * backticks que EXISTA en disco. Se acepta tambien `$ comando` como evidencia de forma —
 * pero solo cuando el item ademas trae una ruta, porque un comando escrito no prueba nada
 * hasta que alguien lo corre.
 *
 * Y NINGUN item abierto puede repetir el titulo de otro item, en cualquier seccion. Esa regla
 * mira el archivo ENTERO —no solo "Ahora"— porque el duplicado clasico vive con una pata en
 * cada seccion. Nace del 2026-08-31: `DELETE /api/payments/[id]` estaba abierto DOS veces, una
 * con sus tres salidas cotizadas y la otra sin analizar, y este gate pasaba en verde — porque
 * una copia sin analizar trae exactamente la misma evidencia que el original. Era la TERCERA
 * vez que esta cola se duplicaba; las dos anteriores quedaron como leccion escrita y no
 * alcanzo. Un item duplicado no es desprolijidad: manda a cotizar de nuevo un hueco ya
 * cotizado, que es trabajo fantasma con otra cara.
 *
 * QUE NO EXIGE. Las secciones "Despues" y "Bloqueado" pueden hablar de cosas que todavia no
 * existen: para eso estan. El filtro es sobre lo que se declara accionable HOY.
 */

const fs = require('fs');
const path = require('path');

const SECCION_DURA = /^##\s+ahora\b/i;
const OTRA_SECCION = /^##\s+/;
const ITEM = /^\s*[-*]\s+\[[ xX]\]\s+(.*)$/;
const ITEM_ESTADO = /^\s*[-*]\s+\[([ xX])\]\s+(.*)$/;

// `algo` entre backticks. Una ruta se distingue de un comando por el `$ ` inicial.
const TROZOS = /`([^`]+)`/g;

// Una linea de continuacion: indentada y con contenido. Un item largo pone su evidencia ahi,
// asi que leer solo la primera linea era declarar "sin evidencia" lo que citaba tres archivos.
const CONTINUACION = /^\s{2,}\S/;

function itemsDeAhora(texto) {
  const items = [];
  let dentro = false;
  let actual = null;
  const cerrar = () => { if (actual) items.push(actual); actual = null; };

  texto.split(/\r?\n/).forEach((linea, i) => {
    if (SECCION_DURA.test(linea)) { cerrar(); dentro = true; return; }
    if (dentro && OTRA_SECCION.test(linea)) { cerrar(); dentro = false; return; }
    if (!dentro) return;

    const m = linea.match(ITEM);
    if (m) { cerrar(); actual = { linea: i + 1, texto: m[1] }; return; }

    // Una linea en blanco NO cierra el item: los items largos traen parrafos separados.
    if (!linea.trim()) return;
    if (actual && CONTINUACION.test(linea)) { actual.texto += '\n' + linea.trim(); return; }

    // Texto sin indentar = ya no es este item.
    cerrar();
  });

  cerrar();
  return items;
}

function evidenciaDe(textoCrudo) {
  const rutas = [];
  const comandos = [];
  const shas = [];
  let m;

  // Un bloque ``` desbalancea el conteo de backticks y DESPLAZA todos los pares que vienen
  // despues: el cierre del bloque se aparea con el backtick de la siguiente ruta, y a partir
  // de ahi el gate lee basura. Medido el 2026-09-01: un item que citaba
  // `hermes-content/deploy/vps-ops/bot/knowledge.mjs` en texto plano salia como
  // "no nombra ninguna ruta" solo por tener arriba una salida de comando en un bloque.
  // Se quitan los bloques antes de buscar: adentro va salida pegada, nunca la cita del item.
  const texto = textoCrudo.replace(/```[\s\S]*?```/g, ' ').replace(/```/g, ' ');

  TROZOS.lastIndex = 0;
  while ((m = TROZOS.exec(texto)) !== null) {
    const t = m[1].trim();
    if (t.startsWith('$ ')) { comandos.push(t.slice(2).trim()); continue; }

    // Un SHA es la otra forma de evidencia que escribe esta cola: "ya en `origin/master`
    // (`e644c85`)". Se pide UN digito y UNA letra a proposito — sin eso, `defaced` y `facade`
    // son hexadecimal validos y cualquier palabra de esas entra como commit.
    if (/^[0-9a-f]{7,40}$/.test(t) && /[0-9]/.test(t) && /[a-f]/.test(t)) { shas.push(t); continue; }

    // "lib/plan-limits.ts:396" es como se cita una linea. El archivo es lo de la izquierda;
    // el sufijo no es parte del nombre, y buscarlo tal cual daba fantasmas falsos.
    const ruta = t.replace(/:\d+(?::\d+)?$/, '');

    // "/inbox", "/requerimientos", "/root/bin" son URLs de la app o rutas del VPS: no se
    // verifican contra ESTE disco. No son evidencia, pero llamarlas fantasma es el gate
    // gritando en falso, y un gate que grita en falso se termina ignorando.
    if (/^[\/]/.test(ruta)) continue;

    // Una URL tampoco es un archivo de este disco. Con o sin esquema: la cola del carril
    // chatbot cita `https://chat.onia.com.bo/app/login` y `app.onia.com.bo/settings/chatbot`
    // como la PANTALLA que hay que mirar, que es justo la evidencia que este repo pide.
    // Medido el 2026-09-01: la cola de chatbot salia en rojo (exit 1) por dos URLs y un
    // directorio gitignoreado — cero fantasmas de verdad. Es el mismo gate gritando en falso
    // que el comentario de arriba: si sale rojo por escribir bien la evidencia, se apaga.
    // Ojo con la segunda: EXIGE la barra despues del dominio. Sin ella "package.json" y
    // "bot-engine.mjs" tambien parecen dominio.tld y el gate deja de ver archivos reales
    // (probado: rompe el --self-check).
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(ruta)) continue;
    if (/^(?:[a-z0-9-]+\.)+[a-z]{2,}\//i.test(ruta)) continue;

    // "origin/master" es una REF de git, no un archivo, pero tiene barra y por eso caia en
    // la regla de "esto parece ruta". Esta cola escribe "ya en `origin/master`" cada vez que
    // un commit llega, asi que el gate gritaba en falso justo sobre su frase mas comun
    // (medido el 2026-08-31: 5 errores falsos en un solo item). Se descarta solo el remoto
    // desnudo: `origin/foo.png` sigue verificandose, para no tapar un archivo de verdad.
    if (/^(origin|upstream)\/[^\/]+$/.test(ruta) && !/\.[a-z0-9]{2,5}$/i.test(ruta)) continue;

    // Un HOST o una URL entre backticks no es una ruta de este repo, y esta cola los escribe
    // todo el tiempo: `app.onia.com.bo/login`, `onia.com.bo`, `onia.com:3000`. Caian en "esto
    // parece una ruta" —tienen barra, o terminan en algo con forma de extension (`.bo`)— y
    // salian fantasma. Medido el 2026-09-01: la cola de `origin/main` daba 6 errores falsos
    // por esto, o sea el gate estaba ROJO DE FABRICA. Es peor que gritar en falso de vez en
    // cuando: si el gate nunca puede estar verde, nadie distingue su rojo real del de siempre
    // y se deja de correr. Se reconoce por el esquema o porque el primer segmento (cortado
    // tambien en ":" para el caso host:puerto) termina en un TLD de los que usamos. No puede
    // tragarse un archivo de verdad: ninguno del repo se llama `algo.com`.
    if (/^https?:\/\//i.test(ruta)) continue;
    if (/\.(com|bo|app|dev|io|net|org|ai|co)$/i.test(ruta.split(/[\/:]/)[0])) continue;

    // Comillas: es un pedazo de codigo o de JSON citado ("BRAND_URL":"https://..."), no un
    // nombre de archivo. Ninguno del repo las tiene.
    if (/["']/.test(ruta)) continue;

    // Un backtick tambien envuelve codigo y endpoints: `GET /api/x`, `invoice.patient?.ci`,
    // `responsable?.ci ?? patient.ci`. Ningun archivo del repo tiene espacios ni signos de
    // pregunta en el nombre, asi que eso los descarta sin tener que adivinar.
    if (/[\s?]/.test(ruta)) continue;

    // Un paquete de npm CON SCOPE no es un archivo de este repo: `@supabase/ssr`,
    // `@anthropic-ai/sdk`, `@supabase/ssr/dist/main/index.js`. Tienen barra, asi que caian en
    // "esto parece una ruta" y salian fantasma (medido el 2026-09-02: la cola de chatbot volvio
    // a exit 1 por citar la libreria con la que se arman las cookies de sesion). Es el mismo
    // gate gritando en falso que las cinco reglas de arriba, y por el mismo motivo se descarta:
    // ningun archivo de estos repos tiene un primer segmento que empiece con `@`.
    // Ojo: se exige que el `@` sea el PRIMER caracter. Un `correo@dominio/x` no es un scope.
    if (/^@[a-z0-9._-]+\//i.test(ruta)) continue;

    // Un GLOB no es un archivo: es una ZONA. Esta cola escribe
    // `web-factory/apps/onia-platform/**` para decir de que carril es una carpeta, y
    // `public/rubros/*.webp` para nombrar un conjunto. Buscarlos en disco daba fantasma
    // siempre (medido el 2026-09-02 sobre COLA.md). Ningun archivo del repo tiene `*`.
    if (/\*/.test(ruta)) continue;

    // Una cita ABREVIADA tampoco es un archivo. La cola escribe
    // `…/2026-09-02-mismo-html-chromium-real-login.png` para no repetir la carpeta larga: el
    // archivo existe, lo que no existe es esa forma de escribirlo. Medido el 2026-09-02:
    // ningun archivo de los dos repos tiene `…` ni `...` en el nombre, asi que esto no puede
    // tapar uno de verdad — y sin la elipsis la misma ruta se sigue verificando.
    if (/…|\.\.\./.test(ruta)) continue;

    // Una RAMA de git no es un archivo. La cola nombra `claude/canario-visual` para decir de
    // que carril es un item, y el gate la buscaba en disco. Medido: no hay ninguna carpeta
    // `claude/` en los dos repos, asi que el prefijo alcanza para distinguirla.
    if (/^claude\//.test(ruta)) continue;

    // Una ruta se reconoce por tener separador o extension. "10 min" no es una ruta.
    if (/[\/]/.test(ruta)) { rutas.push(ruta); continue; }

    // Sin barra, la sola presencia de un punto NO alcanza: `visto.texto`, `d.fonts`,
    // `patient.ci` son expresiones de codigo, y `.texto` no es una extension de nada. Se
    // pide que el sufijo sea una extension que exista de verdad en estos repos. Con barra
    // (arriba) se sigue verificando siempre, asi que esto no puede tapar un archivo en una
    // carpeta — solo desarma la confusion "identificador punteado == nombre de archivo".
    const ext = ruta.match(/\.([a-z0-9]{1,5})$/i);
    if (ext && EXTENSIONES.has(ext[1].toLowerCase())) rutas.push(ruta);
  }

  // La misma ruta citada dos veces en un item es UN problema, no dos. El gate reportaba el
  // mismo renglon repetido (medido el 2026-09-02: `visto.texto` salia dos veces), y un gate
  // que dice dos veces lo mismo entrena a saltearlo igual que uno que grita en falso.
  const unicas = [...new Set(rutas)];

  // Un item cita el archivo entero una vez y despues lo nombra corto: "Ese archivo
  // (`alta.ts`) ya deja el runbook". El nombre corto no existe en la raiz, pero no es un
  // fantasma — es el mismo archivo del renglon de arriba, y la ruta larga YA se verifica.
  // Se descarta solo si el propio item trae una ruta que termina en ese nombre.
  const conBarra = unicas.filter((r) => r.includes('/'));
  return {
    rutas: unicas.filter((r) => r.includes('/') || !conBarra.some((l) => l.endsWith('/' + r))),
    comandos,
    shas: [...new Set(shas)],
  };
}

// Las extensiones que de verdad aparecen en estos dos repos. Es una lista y no un patron a
// proposito: un patron generico (`\.[a-z]{2,5}$`) toma por archivo cualquier identificador
// punteado del codigo que la cola cita, que es exactamente el falso positivo que esto arregla.
// Si algun dia falta una, el sintoma es leve y visible (una ruta real deja de contar como
// evidencia); al reves —volver al patron— el gate vuelve a salir rojo de fabrica.
const EXTENSIONES = new Set([
  'ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs', 'json', 'md', 'mdx', 'sql', 'prisma', 'sh', 'py',
  'css', 'scss', 'html', 'yml', 'yaml', 'toml', 'txt', 'csv', 'log', 'env', 'lock', 'xml',
  'png', 'jpg', 'jpeg', 'webp', 'svg', 'gif', 'ico', 'avif', 'pdf', 'woff', 'woff2', 'ttf',
  'mp4', 'mov', 'webm', 'mp3', 'wav', 'srt', 'vtt', 'zip', 'gz', 'tar', 'bak',
]);


// ONIA es DOS repos y una cola cita a los dos: el carril de producto trabaja en
// `onia-platform` (lib/plan-limits.ts, app/api/...) y escribe su cola en
// `onia-hermes`. Resolviendo solo contra el repo actual, cada ruta del producto
// salia como "fantasma" y el verificador quedaba inservible justo para el carril
// que mas lo necesita — se midio el 2026-08-31: 10 falsos positivos de 10.
//
// No se pasa a rutas absolutas a proposito: una cola con `C:\dev\...` adentro
// solo sirve en la maquina de Sergio.
const REPOS_HERMANOS = ['onia-platform'];

// Y las apps que viven DENTRO de este repo. Un item del sitio de venta escribe sus rutas
// relativas a la app (`src/app/terminos/opengraph-image.tsx`), no al repo — es como se
// nombran entre gente que trabaja ahi, y pedirle el prefijo largo a cada renglon es pedir
// que el gate se ignore. Medido el 2026-09-02: 4 falsos positivos de 4, todos archivos que
// SI existen, el dia despues de que `dc8baa8b` limpiara otros 4 por lo mismo. Un gate que
// sale rojo de fabrica se empieza a saltear, y ahi deja de proteger nada.
const APPS_DEL_REPO = ['web-factory/apps/onia-platform'];

function existeEnAlgunRepo(ruta, baseDir) {
  if (fs.existsSync(path.resolve(baseDir, ruta))) return true;
  for (const app of APPS_DEL_REPO) {
    if (fs.existsSync(path.resolve(baseDir, app, ruta))) return true;
  }
  // El repo hermano cuelga del mismo padre que este (…/proyectos/onia-hermes
  // y …/proyectos/onia-platform). Desde un worktree hay que subir mas, asi que
  // se prueban los padres hasta encontrarlo.
  let dir = path.resolve(baseDir);
  for (let i = 0; i < 6; i++) {
    for (const repo of REPOS_HERMANOS) {
      if (fs.existsSync(path.join(path.dirname(dir), repo, ruta))) return true;
    }
    const padre = path.dirname(dir);
    if (padre === dir) break;
    dir = padre;
  }

  // Ultimo recurso: una ruta PARCIAL. El sitio de venta cita `(sitio)/opengraph-image.tsx`
  // —relativo a `src/app/`, que es como se nombran entre quienes trabajan ahi— y ni el repo ni
  // `APPS_DEL_REPO` lo resuelven, porque el prefijo que falta es intermedio. Cuenta si algun
  // archivo del repo TERMINA en esa ruta, en limite de segmento. No afloja el gate: sigue
  // exigiendo que el archivo exista de verdad; solo deja de exigir el prefijo entero.
  // Se aplica solo CON barra: `page.tsx` suelto matchearia cualquiera de los cientos que hay.
  if (ruta.includes('/')) return existeComoSufijo(ruta, baseDir);
  return false;
}

// Indice perezoso de los archivos del arbol, por nombre. Se construye UNA vez y solo si algun
// sufijo lo necesita — el caso normal (la ruta existe tal cual) no paga nada.
const indicePorNombre = new Map();

function indiceDe(baseDir) {
  const clave = path.resolve(baseDir);
  if (indicePorNombre.has(clave)) return indicePorNombre.get(clave);
  const porNombre = new Map();
  const IGNORAR = new Set(['node_modules', '.git', '.next', 'dist', 'build', '.turbo']);
  const caminar = (dir, rel, hondo) => {
    if (hondo > 12) return;
    let entradas;
    try { entradas = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entradas) {
      if (IGNORAR.has(e.name)) continue;
      const sub = rel ? rel + '/' + e.name : e.name;
      if (e.isDirectory()) caminar(path.join(dir, e.name), sub, hondo + 1);
      else {
        if (!porNombre.has(e.name)) porNombre.set(e.name, []);
        porNombre.get(e.name).push(sub);
      }
    }
  };
  caminar(clave, '', 0);
  indicePorNombre.set(clave, porNombre);
  return porNombre;
}

function existeComoSufijo(ruta, baseDir) {
  const nombre = ruta.slice(ruta.lastIndexOf('/') + 1);
  const candidatos = indiceDe(baseDir).get(nombre) || [];
  // `endsWith('/' + ruta)` es lo que fuerza el limite de segmento: `itio)/og.tsx` no puede
  // matchear `app/(sitio)/og.tsx`, porque el corte tiene que caer en una barra.
  return candidatos.some((p) => p === ruta || p.endsWith('/' + ruta));
}

// --- SHAs: la otra mitad de la evidencia, y hasta hoy nadie la verificaba ---
//
// Esta cola cierra items escribiendo "commit `X`, ya en origin/master". El gate verificaba que
// el ARCHIVO citado existiera y daba por buena la otra mitad. Ya fallo una vez, y el propio
// archivo lo documenta: un `[x]` citaba `6d8b6b7` —el sha LOCAL de la rama antes del squash—
// que no esta en `origin/master`. Citar el sha de la rama y no el del merge hace que la
// proxima auditoria lea "no llego" sobre trabajo que si llego, y al reves: un sha inventado
// declara desplegado algo que nunca salio.
//
// Medido el 2026-09-02: este loop gasto DOS vueltas enteras comprobando a mano "los 24 shas
// citados existen y los que se declaran ancestros lo son". Peor: el script ad-hoc que lo
// comprobo esta vuelta tenia un bug de substring y dio por bueno un sha que NO esta en master.
// Una auditoria que se rehace a mano cada vuelta se hace mal alguna vuelta.
const SHA_ES = /^[0-9a-f]{7,40}$/;

// Shas que NO resuelven en ningun repo y esta BIEN que no resuelvan, cada uno con su motivo.
// Sin esta lista el gate sale rojo de fabrica —el anti-patron que este archivo ya documenta
// tres veces— porque la cola los cita justamente para explicar que son duplicados locales.
// Tiene su reciproco abajo: si alguno EMPIEZA a resolver, se marca. Una excepcion que envejece
// en silencio es como se tapa un fantasma de verdad.
const SHAS_SIN_REPO_A_PROPOSITO = new Map([
  ['6edfab6', 'duplicado local de una rama ya squasheada; la cola lo cita para documentarlo'],
  ['a15c82f', 'idem 6edfab6'],
  ['e46e9ee', 'idem 6edfab6'],
]);

// Los repos donde puede vivir un sha citado. Mismo paseo por los padres que `existeEnAlgunRepo`:
// la cola de producto cita commits de `onia-platform` y se escribe en `onia-hermes`.
function reposGit(baseDir) {
  const dirs = [path.resolve(baseDir)];
  let dir = path.resolve(baseDir);
  for (let i = 0; i < 6; i++) {
    for (const repo of REPOS_HERMANOS) {
      const c = path.join(path.dirname(dir), repo);
      if (fs.existsSync(path.join(c, '.git'))) dirs.push(c);
    }
    const padre = path.dirname(dir);
    if (padre === dir) break;
    dir = padre;
  }
  return [...new Set(dirs)];
}

// Devuelve true si el sha es un commit de verdad en alguno de los repos. UNA llamada a git por
// repo (`--batch-check` come todos los shas de una), no una por sha: el gate corre antes de cada
// item y un gate lento se saltea igual que uno que miente.
function resolvedorGit(baseDir) {
  return (shas) => {
    if (!shas.length) return new Set();
    const cp = require('child_process');
    const vivos = new Set();
    for (const dir of reposGit(baseDir)) {
      let salida;
      try {
        salida = cp.execFileSync('git', ['-C', dir, 'cat-file', '--batch-check'], {
          input: shas.map((s) => s + '^{commit}').join('\n') + '\n',
          encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'], timeout: 20000,
        });
      } catch { continue; } // sin git, o sin repo: el gate no opina de shas, no grita
      // Se compara el CAMPO, no el substring. Cuando el objeto falta, git responde
      // "6edfab6^{commit} missing" — o sea que la palabra "commit" aparece igual en la linea
      // del fallo. Un `includes('commit')` da por vivo todo lo muerto; es exactamente el bug
      // de substring que tenia el script ad-hoc que motivo este gate.
      salida.split('\n').forEach((linea, i) => {
        if (linea.trim().split(/\s+/)[1] === 'commit' && shas[i]) vivos.add(shas[i]);
      });
    }
    return vivos;
  };
}

// Un item se identifica por su TITULO: la primera **negrita**, o lo que va antes del primer
// punto. Es como esta cola nombra el trabajo. Comparar el cuerpo entero no serviria — la copia
// larga trae el analisis y la corta no, que es exactamente la forma que tuvo el duplicado del
// 2026-08-31 (`DELETE /api/payments/[id]` abierto en la 476 con tres salidas cotizadas y en la
// 583 sin analizar).
function tituloDe(texto) {
  const negrita = texto.match(/\*\*([\s\S]+?)\*\*/);
  let t = negrita ? negrita[1] : texto.split(/[.·]/)[0];
  t = t.replace(/`/g, '').toLowerCase();
  t = t.replace(/^[^a-z0-9\/]+/, '');
  // El prefijo de decision lo lleva la copia analizada y no la cruda. Sin sacarlo, los dos
  // titulos no coinciden y el duplicado pasa en verde.
  t = t.replace(/^(decide sergio|bloqueado en sergio|bloqueado)\s*[—–-]\s*/, '');
  return t.replace(/\s+/g, ' ').replace(/[.,;:]+$/, '').trim();
}

// A diferencia de itemsDeAhora, esto lee el archivo ENTERO: el duplicado clasico vive con una
// pata en "Ahora" y la otra en "Despues", asi que mirar una sola seccion no lo puede ver.
function todosLosItems(texto) {
  const items = [];
  let actual = null;
  const cerrar = () => { if (actual) items.push(actual); actual = null; };
  texto.split(/\r?\n/).forEach((linea, i) => {
    const m = linea.match(ITEM_ESTADO);
    if (m) { cerrar(); actual = { linea: i + 1, abierto: m[1] === ' ', texto: m[2] }; return; }
    if (!linea.trim()) return;
    if (actual && CONTINUACION.test(linea)) { actual.texto += '\n' + linea.trim(); return; }
    cerrar();
  });
  cerrar();
  return items;
}

// Un titulo corto ("Revisar") no alcanza para AFIRMAR que dos items son el mismo trabajo.
// Marcarlos seria el gate adivinando, y un gate que adivina se desactiva.
const TITULO_MINIMO = 20;

function duplicados(texto) {
  const items = todosLosItems(texto).map((it) => ({ ...it, titulo: tituloDe(it.texto) }));
  const problemas = [];
  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) {
      const a = items[i];
      const b = items[j];
      // Dos copias ya cerradas son historia y no hacen dano. El fantasma aparece cuando UNA
      // sigue abierta: eso es lo que manda a rehacer trabajo hecho, o a analizar dos veces el
      // mismo hueco.
      if (!a.abierto && !b.abierto) continue;
      if (a.titulo.length < TITULO_MINIMO || b.titulo.length < TITULO_MINIMO) continue;
      if (a.titulo === b.titulo || a.titulo.includes(b.titulo) || b.titulo.includes(a.titulo)) {
        problemas.push({
          regla: 'duplicado', linea: b.linea,
          msg: `"${b.titulo.slice(0, 60)}" repite el item de la linea ${a.linea}: cerrar o borrar una de las dos`,
        });
      }
    }
  }
  return problemas;
}

// Dos secciones con el mismo titulo. Es el agujero por el que se cuela lo que la regla
// `duplicado` no puede ver: esa mira items `- [ ]`, y las listas de bloqueos se escriben con
// vinetas y filas de tabla. El 2026-09-01 convivian DOS "## Bloqueado", y la copia vieja
// seguia pidiendo bajar un deployment de Vercel medido inexistente el dia anterior. Un item
// duplicado hace rehacer trabajo; una SECCION duplicada hace pedirle a Sergio una decision ya
// tomada, y su tiempo es el unico recurso que no se recupera.
function seccionesDuplicadas(texto) {
  const vistas = new Map();
  const problemas = [];
  texto.split(/\r?\n/).forEach((linea, i) => {
    if (!OTRA_SECCION.test(linea)) return;
    const titulo = linea.replace(/^##\s+/, '').replace(/`/g, '').toLowerCase()
      .replace(/\s+/g, ' ').replace(/[.,;:]+$/, '').trim();
    if (!titulo) return;
    const antes = vistas.get(titulo);
    if (antes) {
      problemas.push({
        regla: 'seccion-duplicada', linea: i + 1,
        msg: `"${titulo.slice(0, 60)}" repite la seccion de la linea ${antes}: fusionar las dos o fechar una`,
      });
      return;
    }
    vistas.set(titulo, i + 1);
  });
  return problemas;
}

function revisarCola(texto, baseDir = process.cwd(), resolverShas = null) {
  const problemas = [...seccionesDuplicadas(texto), ...duplicados(texto)];
  const items = itemsDeAhora(texto);
  const resolver = resolverShas || resolvedorGit(baseDir);

  if (!items.length) {
    problemas.push({ regla: 'cola-vacia', linea: 0,
      msg: 'la seccion "## Ahora" no tiene items: o no existe, o el carril esta parado' });
    return { problemas, items };
  }

  // Todos los shas de la seccion, en UNA sola pasada de git. Se resuelven antes del bucle para
  // no pagar un proceso por item.
  const shasPorItem = items.map((it) => evidenciaDe(it.texto).shas);
  const todosLosShas = [...new Set(shasPorItem.flat())];
  const shasVivos = resolver(todosLosShas);

  // Reciproco de la lista de excepciones: si un sha declarado "no esta en ningun repo a
  // proposito" empieza a resolver, la excepcion vencio y hay que sacarla. Sin esto, la lista
  // crece y termina tapando un fantasma de verdad — que es como muere toda allowlist.
  for (const [sha, motivo] of SHAS_SIN_REPO_A_PROPOSITO) {
    if (shasVivos.has(sha) && todosLosShas.includes(sha)) {
      problemas.push({ regla: 'excepcion-sha-vencida', linea: 0,
        msg: `${sha} esta en la lista de excepciones ("${motivo}") pero HOY resuelve: sacalo de SHAS_SIN_REPO_A_PROPOSITO` });
    }
  }

  for (const [i, it] of items.entries()) {
    const { rutas, comandos } = evidenciaDe(it.texto);

    if (!rutas.length) {
      problemas.push({
        regla: 'sin-evidencia', linea: it.linea,
        msg: comandos.length
          ? `"${it.texto.slice(0, 60)}" trae un comando pero ninguna ruta: un comando escrito no prueba que algo exista`
          : `"${it.texto.slice(0, 60)}" no nombra ninguna ruta entre backticks`,
      });
      continue;
    }

    // El punto de todo el archivo: la ruta tiene que ESTAR.
    for (const r of rutas) {
      if (!existeEnAlgunRepo(r, baseDir)) {
        problemas.push({
          regla: 'fantasma', linea: it.linea,
          msg: `"${it.texto.slice(0, 50)}" apunta a ${r} y ese archivo NO existe`,
        });
      }
    }

    // La otra mitad: el commit citado como prueba de que el trabajo llego tiene que EXISTIR.
    for (const sha of shasPorItem[i]) {
      if (shasVivos.has(sha) || SHAS_SIN_REPO_A_PROPOSITO.has(sha)) continue;
      problemas.push({
        regla: 'sha-fantasma', linea: it.linea,
        msg: `"${it.texto.slice(0, 50)}" cita el commit ${sha} y no existe en ningun repo: o esta mal escrito, o es el sha local de una rama que se squasheo (cita el del merge)`,
      });
    }
  }
  return { problemas, items };
}

function selfCheck() {
  const assert = require('node:assert');
  let casos = 0;
  const ok = (c, m) => { casos += 1; assert.ok(c, m); };

  const tmp = path.join(require('os').tmpdir(), 'cola-selfcheck');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  fs.writeFileSync(path.join(tmp, 'existe.png'), 'x');

  // El caso que da nombre al archivo: 4 de 6 eran fantasma.
  let r = revisarCola('## Ahora\n- [ ] Publicar algo · `existe.png` · 10 min\n', tmp);
  ok(!r.problemas.length, 'un item con ruta que existe pasa');

  r = revisarCola('## Ahora\n- [ ] Publicar algo · `no-esta.png` · 10 min\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'una ruta que no existe es fantasma');

  // Un bloque ``` no puede desplazar el apareo de backticks del resto del item.
  // Sin el filtro de bloques, el cierre del ``` se aparea con el backtick de `existe.png`
  // y el item sale "sin evidencia" aunque la cite en texto plano.
  r = revisarCola(
    '## Ahora\n- [ ] Medido\n      ```\n      salida | del comando\n      ```\n      La prueba: `existe.png`\n',
    tmp,
  );
  ok(!r.problemas.length, 'un bloque de codigo no rompe el apareo de backticks del item');

  // Y el filtro no puede volverse una tapadera: una ruta fantasma FUERA del bloque
  // se tiene que seguir viendo.
  r = revisarCola(
    '## Ahora\n- [ ] Medido\n      ```\n      salida | del comando\n      ```\n      La prueba: `no-esta.png`\n',
    tmp,
  );
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'con bloque, una ruta fantasma sigue siendo fantasma');

  // Una URL es la PANTALLA que hay que mirar, no un archivo de este disco.
  r = revisarCola('## Ahora\n- [ ] Mirar `https://chat.onia.com.bo/app/login` y `existe.png`\n', tmp);
  ok(!r.problemas.length, 'una URL con esquema no se busca en disco');
  r = revisarCola('## Ahora\n- [ ] Mirar `app.onia.com.bo/settings/chatbot` y `existe.png`\n', tmp);
  ok(!r.problemas.length, 'un dominio con path tampoco se busca en disco');
  // Pero un archivo con punto NO es un dominio: sin barra, se sigue verificando.
  r = revisarCola('## Ahora\n- [ ] Publicar `no-esta.png`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'el filtro de dominios no se come un archivo suelto');

  r = revisarCola('## Ahora\n- [ ] Terminar el sistema de publicacion\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'sin-evidencia'), 'un item sin ruta no entra');

  // Un comando solo NO alcanza: es justo la forma que tiene el trabajo fantasma de sonar real.
  r = revisarCola('## Ahora\n- [ ] Correr el gate · `$ node scripts/carousel_gate.js`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'sin-evidencia'), 'un comando escrito no es evidencia');

  // "10 min" y "Sergio" no son rutas: sin esto, cualquier item con un backtick pasaria.
  r = revisarCola('## Ahora\n- [ ] Algo · `10 min` · `Sergio`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'sin-evidencia'), 'un texto entre backticks no es una ruta');

  // "origin/master" es una REF de git, no un archivo. Tiene barra, asi que caia en la regla
  // de "esto parece una ruta" y salia fantasma — y "ya en `origin/master`" es justo como esta
  // cola escribe que un commit llego. Medido el 2026-08-31: el item F3 daba 5 errores falsos.
  // Un gate que grita en falso se termina ignorando, que es el motivo de las otras carve-outs.
  r = revisarCola('## Ahora\n- [x] Hecho · `existe.png` · ya en `origin/master`\n', tmp);
  ok(!r.problemas.length, 'una ref de git no es una ruta');

  // Un host no es una ruta del repo. Sin esto la cola de origin/main daba 6 fantasmas falsos.
  r = revisarCola('## Ahora\n- [ ] Mirar `app.onia.com.bo/login` · `existe.png`\n', tmp);
  ok(!r.problemas.length, 'un host con path no es una ruta');

  r = revisarCola('## Ahora\n- [ ] Sirve `onia.com.bo` · `existe.png`\n', tmp);
  ok(!r.problemas.length, 'un host desnudo no es una ruta');

  // Su reciproco: la carve-out mira el PRIMER segmento, asi que un archivo se sigue verificando.
  r = revisarCola('## Ahora\n- [ ] Roto · `web-factory/no-esta.json`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'la carve-out de host no tapa un archivo');

  // Pero la carve-out NO puede tragarse un archivo de verdad que empiece con esa palabra.
  r = revisarCola('## Ahora\n- [x] Hecho · `origin/no-esta.png`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'la carve-out de refs no tapa un archivo');

  // Despues y Bloqueado hablan del futuro: ahi el fantasma es legitimo.
  r = revisarCola('## Ahora\n- [ ] ok · `existe.png`\n\n## Despues\n- [ ] algo que no existe todavia\n', tmp);
  ok(!r.problemas.length, 'Despues no se revisa: para eso esta');

  // Un item ya hecho igual tiene que apuntar a algo real, o la cola miente hacia atras.
  r = revisarCola('## Ahora\n- [x] Hecho · `no-esta.png`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'un item marcado hecho tambien se verifica');

  // Una cola sin "Ahora" es un carril parado, y eso hay que decirlo, no dejarlo pasar en verde.
  r = revisarCola('## Despues\n- [ ] algo\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'cola-vacia'), 'sin Ahora, el carril esta parado');

  // Varias rutas en un item: basta que UNA falte para que el item sea mentira.
  r = revisarCola('## Ahora\n- [ ] Dos cosas · `existe.png` y `no-esta.png`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'alcanza que una ruta falte');

  // --- Los tres falsos positivos medidos el 2026-08-31 sobre la cola de producto ---

  // (1) Un item largo pone su evidencia en las lineas de continuacion. Leer solo la primera
  // linea declaraba "sin evidencia" items que citaban tres archivos reales.
  r = revisarCola('## Ahora\n- [ ] Algo grande, sin ruta en la primera linea\n      la evidencia esta aca: `existe.png`\n', tmp);
  ok(!r.problemas.length, 'la evidencia puede vivir en una linea de continuacion');

  // Y su reciproco, que es lo que impide que el arreglo afloje el gate: la continuacion de un
  // item no le presta evidencia al item siguiente.
  r = revisarCola('## Ahora\n- [ ] uno · `existe.png`\n- [ ] dos, sin nada\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'sin-evidencia' && p.linea === 3), 'cada item necesita su propia evidencia');

  // (2) `archivo.ts:396` es como se cita una linea. El archivo existe; el sufijo no es su nombre.
  r = revisarCola('## Ahora\n- [ ] Algo · `existe.png:42`\n', tmp);
  ok(!r.problemas.length, 'archivo:linea apunta a un archivo que existe');

  // (3) `/requerimientos` es una URL de la app, no un archivo. No es evidencia, pero tampoco es
  // un fantasma: llamarla fantasma es la forma que tiene el gate de gritar en falso.
  r = revisarCola('## Ahora\n- [ ] Enlazar `/requerimientos` desde `existe.png`\n', tmp);
  ok(!r.problemas.length, 'una URL de app no se verifica contra el disco');

  r = revisarCola('## Ahora\n- [ ] Enlazar `/requerimientos`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'sin-evidencia'), 'una URL sola no alcanza como evidencia');

  // (4) Un backtick tambien envuelve codigo y endpoints: `GET /api/x`, `invoice.patient?.ci`,
  // `responsable?.ci ?? patient.ci`. Ningun archivo del repo tiene espacios ni `?` en el nombre,
  // asi que eso los descarta sin tener que adivinar.
  r = revisarCola('## Ahora\n- [ ] Algo · `existe.png` · `GET /api/x` · `invoice.patient?.ci`\n', tmp);
  ok(!r.problemas.length, 'codigo y endpoints entre backticks no son rutas');

  // (4b) Una URL y un dominio no son archivos. Medido el 2026-09-01: el item de la marca de
  // Chatwoot daba 8 fantasmas y 7 eran `chat.onia.com.bo`, `www.chatwoot.com` y JSON citado.
  r = revisarCola('## Ahora\n- [ ] Mirar `https://chat.onia.com.bo/app/login` desde `existe.png`\n', tmp);
  ok(!r.problemas.length, 'una URL con esquema no se verifica contra el disco');

  r = revisarCola('## Ahora\n- [ ] `chat.onia.com.bo` y `www.chatwoot.com` desde `existe.png`\n', tmp);
  ok(!r.problemas.length, 'un dominio suelto tampoco');

  r = revisarCola('## Ahora\n- [ ] Sale `"BRAND_URL":"https://www.chatwoot.com"` · `existe.png`\n', tmp);
  ok(!r.problemas.length, 'un pedazo de JSON citado no es una ruta');

  // Y el limite, que es lo que impide que el arreglo afloje el gate: un archivo con extension
  // corta sigue siendo una ruta, y sigue siendo fantasma si no esta.
  r = revisarCola('## Ahora\n- [ ] Algo · `no-esta.png`\n', tmp);
  ok(r.problemas.some((x) => x.regla === 'fantasma'), 'un archivo que no existe sigue siendo fantasma');

  r = revisarCola('## Ahora\n- [ ] Solo `https://chat.onia.com.bo`\n', tmp);
  ok(r.problemas.some((x) => x.regla === 'sin-evidencia'), 'una URL sola no alcanza como evidencia');

  // (5) La cola de producto vive en onia-hermes y cita archivos de onia-platform, que es un
  // repo hermano. Sin esto el gate llamaba fantasma a todo el producto — la mitad del carril —
  // y se volvia ruido puro. `existeEnAlgunRepo` no tenia ni un caso que lo cubriera.
  fs.mkdirSync(path.join(tmp, 'onia-platform', 'lib'), { recursive: true });
  fs.writeFileSync(path.join(tmp, 'onia-platform', 'lib', 'plan-limits.ts'), 'x');
  fs.mkdirSync(path.join(tmp, 'onia-hermes'), { recursive: true });
  r = revisarCola('## Ahora\n- [ ] Gatear el add-on · `lib/plan-limits.ts:396`\n', path.join(tmp, 'onia-hermes'));
  ok(!r.problemas.length, 'una ruta del repo hermano onia-platform resuelve');

  // Y su limite: lo que no esta ni aca ni en el hermano sigue siendo fantasma.
  r = revisarCola('## Ahora\n- [ ] Algo · `lib/no-existe-en-ningun-lado.ts`\n', path.join(tmp, 'onia-hermes'));
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'el repo hermano no vuelve verde cualquier ruta');


  // --- Los cuatro falsos positivos medidos el 2026-09-02 sobre la propia COLA.md ---
  // El gate salia con 4 ERROR y los cuatro eran falsos. Un gate que siempre sale rojo por
  // motivos falsos entrena a saltearlo: es como `CLAUDE.md` cuenta que se rompio el CI dos
  // veces. Cada carve-out va con su reciproco, que es lo que impide que el arreglo afloje.

  // (1) Un GLOB de zona no es un archivo. La cola escribe `web-factory/apps/onia-platform/**`
  // para decir "esta carpeta es de tal carril", y el gate lo buscaba en disco.
  r = revisarCola('## Ahora\n- [ ] Zona `web-factory/apps/onia-platform/**` · `existe.png`\n', tmp);
  ok(!r.problemas.length, 'un glob de zona no es una ruta');
  r = revisarCola('## Ahora\n- [ ] Zona `carpeta/*.webp` · `existe.png`\n', tmp);
  ok(!r.problemas.length, 'un glob con comodin de nombre tampoco');

  // (1b) Un paquete de npm CON SCOPE tiene barra y no es un archivo del repo. La cola de chatbot
  // salio en rojo el 2026-09-02 por citar `@supabase/ssr`, la libreria con la que se arman las
  // cookies de sesion — evidencia legitima, marcada como fantasma.
  r = revisarCola('## Ahora\n- [ ] Cookies con `@supabase/ssr` · `existe.png`\n', tmp);
  ok(!r.problemas.length, 'un paquete npm con scope no es una ruta');
  r = revisarCola('## Ahora\n- [ ] Import de `@supabase/ssr/dist/main/index.js` · `existe.png`\n', tmp);
  ok(!r.problemas.length, 'ni una ruta interna de ese paquete');
  // Su reciproco, que es lo que impide que el carve-out afloje: el `@` tiene que ser el PRIMER
  // caracter. Una ruta de verdad que apenas contiene un `@` sigue verificandose.
  r = revisarCola('## Ahora\n- [ ] Roto `carpeta@vieja/no-existe.png`\n', tmp);
  ok(r.problemas.length === 1, 'un `@` en medio NO convierte la ruta en paquete npm');

  // (2) `visto.texto` es una EXPRESION de JavaScript citada, no un archivo: `.texto` no es una
  // extension. Un nombre suelto sin barra solo es ruta si su extension es de las que existen
  // en estos repos; con barra se sigue verificando siempre.
  r = revisarCola('## Ahora\n- [ ] El `visto.texto` coincide · `existe.png`\n', tmp);
  ok(!r.problemas.length, 'una expresion de codigo con punto no es una ruta');
  r = revisarCola('## Ahora\n- [ ] Algo · `no-esta.png`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'la carve-out de extensiones no tapa un archivo suelto');
  r = revisarCola('## Ahora\n- [ ] Algo · `carpeta/no-esta.texto`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'con barra se verifica aunque la extension sea rara');

  // (3) Un mismo item cita el archivo entero UNA vez y despues lo nombra corto
  // ("Ese archivo (`alta.ts`) ya deja el runbook"). El nombre corto no existe en la raiz, pero
  // no es un fantasma: es el mismo archivo del renglon de arriba.
  fs.mkdirSync(path.join(tmp, 'sub'), { recursive: true });
  fs.writeFileSync(path.join(tmp, 'sub', 'alta.ts'), 'x');
  r = revisarCola('## Ahora\n- [ ] Ver `sub/alta.ts`\n      Ese archivo (`alta.ts`) trae el runbook · `existe.png`\n', tmp);
  ok(!r.problemas.length, 'el nombre corto de un archivo ya citado entero no es fantasma');
  // Su reciproco: si el item NO cita la ruta larga, el nombre corto sigue siendo fantasma.
  r = revisarCola('## Ahora\n- [ ] Ese archivo (`alta.ts`) trae el runbook · `existe.png`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'un nombre corto sin su ruta larga sigue siendo fantasma');

  // (4) La misma ruta citada dos veces en un item se reporta UNA vez. El gate decia dos veces
  // lo mismo sobre el mismo renglon, que es la otra forma de entrenar a saltearlo.
  r = revisarCola('## Ahora\n- [ ] Falta `no-esta.png` y otra vez `no-esta.png`\n', tmp);
  ok(r.problemas.filter((p) => p.regla === 'fantasma').length === 1, 'una ruta repetida se reporta una sola vez');

  // --- Los DOCE falsos positivos medidos el 2026-09-02 14:34 UTC sobre la propia COLA.md ---
  // El item que declaraba este gate "verde, exit 0, 16 items" ENVEJECIO: hoy sale exit 1 con 12
  // ERROR y los doce son falsos. Mismo modo de falla que la tanda anterior, con tres caras
  // nuevas. Cada carve-out va con su reciproco, que es lo que impide que el arreglo afloje.

  // (5) Una cita ABREVIADA con puntos suspensivos no es un archivo. La cola escribe
  // `…/2026-09-02-mismo-html-chromium-real-login.png` para no repetir la carpeta larga, y ese
  // archivo EXISTE (hermes-content/docs/historial/canario-visual/). Medido: ningun archivo de
  // los dos repos tiene `…` ni `...` en el nombre, asi que descartarlo no puede tapar nada.
  r = revisarCola('## Ahora\n- [ ] Ver `…/no-esta.png` · `existe.png`\n', tmp);
  ok(!r.problemas.length, 'una cita abreviada con puntos suspensivos no es una ruta');
  r = revisarCola('## Ahora\n- [ ] Ver `carpeta/.../no-esta.png` · `existe.png`\n', tmp);
  ok(!r.problemas.length, 'tres puntos ASCII tambien abrevian');
  // Su reciproco: sin la elipsis, la misma ruta se sigue verificando.
  r = revisarCola('## Ahora\n- [ ] Ver `carpeta/no-esta.png`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'sin elipsis la ruta se sigue verificando');

  // (6) Una RAMA de git no es un archivo. La cola nombra `claude/canario-visual` para decir de
  // que carril es un item. Medido: no existe ninguna carpeta `claude/` en los dos repos.
  r = revisarCola('## Ahora\n- [ ] Es del carril `claude/canario-visual` · `existe.png`\n', tmp);
  ok(!r.problemas.length, 'un nombre de rama no es una ruta');
  // Su reciproco: una ruta de verdad que arranque con otra cosa se sigue verificando.
  r = revisarCola('## Ahora\n- [ ] Ver `scripts/no-esta.js`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'la carve-out de ramas no tapa otras rutas');

  // (7) Una ruta PARCIAL con barra cuenta como evidencia si algun archivo del repo TERMINA en
  // ella. El sitio de venta cita `(sitio)/opengraph-image.tsx` —relativo a `src/app/`, no a la
  // app— y el archivo existe bajo web-factory/apps/onia-platform/src/app/. Esto NO afloja el
  // gate: sigue exigiendo que el archivo exista de verdad, solo deja de exigir que la cita
  // traiga el prefijo entero. Sin barra NO se aplica a proposito: `page.tsx` suelto matchearia
  // cualquiera de los cientos que hay y dejaria de identificar nada.
  // Arbol propio: el indice de archivos se cachea por carpeta la primera vez que un sufijo lo
  // necesita, y para entonces `tmp` ya fue recorrido por los casos de arriba. Un fixture
  // creado tarde en esa misma carpeta no se veria. Un arbol nuevo evita el falso rojo sin
  // inventarle al script una API de reset que solo usarian los tests.
  const tmpSufijo = fs.mkdtempSync(path.join(require('os').tmpdir(), 'cola-sufijo-'));
  fs.mkdirSync(path.join(tmpSufijo, 'app', '(sitio)'), { recursive: true });
  fs.writeFileSync(path.join(tmpSufijo, 'app', '(sitio)', 'og.tsx'), 'x');
  r = revisarCola('## Ahora\n- [ ] Ver `(sitio)/og.tsx`\n', tmpSufijo);
  ok(!r.problemas.length, 'una ruta parcial con barra resuelve por sufijo');
  // Su reciproco 1: si NINGUN archivo termina asi, sigue siendo fantasma.
  r = revisarCola('## Ahora\n- [ ] Ver `(sitio)/no-esta.tsx`\n', tmpSufijo);
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'un sufijo que no existe sigue siendo fantasma');
  // Su reciproco 2: el sufijo corta en limite de segmento, no a media palabra.
  r = revisarCola('## Ahora\n- [ ] Ver `itio)/og.tsx`\n', tmpSufijo);
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'el sufijo no matchea a media carpeta');
  // Su reciproco 3: un nombre suelto sin barra NO resuelve por sufijo.
  r = revisarCola('## Ahora\n- [ ] Ver `og.tsx`\n', tmpSufijo);
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'sin barra no hay resolucion por sufijo');

  // --- Duplicados: "cerrar un item no cierra su copia" ---
  // Este defecto ya golpeo DOS veces por escrito en la propia cola. El 2026-08-31 se encontro
  // la tercera: `DELETE /api/payments/[id]` estaba abierto en las lineas 476 y 583, la primera
  // con sus tres salidas cotizadas y la segunda sin analizar. El gate pasaba VERDE — solo
  // miraba "Ahora" y solo pedia evidencia, y una copia sin analizar tiene la misma evidencia
  // que el original. Una leccion escrita se desobedece; un exit 1 no.

  const dosSecciones = (a, b) =>
    `## Ahora\n- [ ] **${a}** · \`existe.png\`\n\n## Despues\n- [ ] **${b}** · \`existe.png\`\n`;

  r = revisarCola(dosSecciones('Borrar un pago de un mes ya declarado', 'Borrar un pago de un mes ya declarado'), tmp);
  ok(r.problemas.some((p) => p.regla === 'duplicado'), 'el mismo item abierto en dos secciones se marca');

  // Se reporta UNA vez, no una por cada lado del par: un gate que dice dos veces lo mismo
  // entrena a saltearlo.
  ok(r.problemas.filter((p) => p.regla === 'duplicado').length === 1, 'un par duplicado se reporta una sola vez');

  // El caso historico exacto: se cierra en "Ahora" y la copia queda ABIERTA en "Despues".
  // Ahi la cola miente hacia adelante — manda a rehacer trabajo ya hecho.
  r = revisarCola(
    '## Ahora\n- [x] **Borrar un pago de un mes ya declarado** · `existe.png`\n\n## Despues\n- [ ] **Borrar un pago de un mes ya declarado** · `existe.png`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'duplicado'), 'una copia abierta de un item ya cerrado se marca');

  // El caso REAL del 2026-08-31: la copia larga lleva el prefijo de decision y la corta no.
  // Sin normalizar ese prefijo, los dos titulos no coinciden y el duplicado pasa.
  r = revisarCola(dosSecciones(
    'DECIDE SERGIO — `DELETE /api/payments/[id]` sobre un mes ya declarado',
    '`DELETE /api/payments/[id]` sobre un mes ya declarado'), tmp);
  ok(r.problemas.some((p) => p.regla === 'duplicado'), 'el prefijo "DECIDE SERGIO" no esconde la copia');

  // --- Y los reciprocos, que son lo que impide que este gate grite en falso ---

  // Dos items DISTINTOS que citan el mismo archivo no son duplicados. Sin esto, el gate
  // ladraria sobre media cola —`lib/pricing.ts` aparece en todos lados— y se desactivaria.
  r = revisarCola(dosSecciones(
    'Ponerle precio al add-on inmobiliaria en el catalogo comercial',
    'Sacar el add-on de veterinaria del catalogo comercial'), tmp);
  ok(!r.problemas.some((p) => p.regla === 'duplicado'), 'dos items distintos no son duplicados');

  // Dos copias YA CERRADAS son historia, no trabajo fantasma: no se marcan.
  r = revisarCola(
    '## Ahora\n- [x] **Borrar un pago de un mes ya declarado** · `existe.png`\n\n## Despues\n- [x] **Borrar un pago de un mes ya declarado** · `existe.png`\n', tmp);
  ok(!r.problemas.some((p) => p.regla === 'duplicado'), 'dos copias cerradas son historia, no fantasma');

  // Un titulo corto no alcanza para afirmar duplicado: "Revisar" y "Revisar" no son el mismo
  // trabajo, y marcarlos seria el gate adivinando.
  r = revisarCola(dosSecciones('Revisar', 'Revisar'), tmp);
  ok(!r.problemas.some((p) => p.regla === 'duplicado'), 'un titulo demasiado corto no afirma duplicado');

  // --- Secciones duplicadas: por donde se cuela lo que la regla de items no ve ---
  // El 2026-09-01 la cola tenia DOS "## Bloqueado", DOS "## Despues" y DOS "## Cerrado
  // (2026-08-30)". La copia vieja de Bloqueado seguia pidiendo bajar un deployment de Vercel
  // que ese mismo dia se habia medido inexistente (404 DEPLOYMENT_NOT_FOUND). La regla
  // `duplicado` no lo podia ver: las entradas de esa lista son vinetas y filas de tabla, sin
  // `- [ ]`. Una entrada vencida en la lista de bloqueos FABRICA trabajo — manda a pedirle a
  // Sergio una decision sobre algo ya resuelto, que es el unico recurso que no se recupera.
  r = revisarCola(
    '## Ahora\n- [ ] ok · `existe.png`\n\n## Bloqueado\n- algo\n\n## Bloqueado\n- la copia vieja\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'seccion-duplicada'), 'dos secciones con el mismo titulo se marcan');

  // Su reciproco: las secciones fechadas son distintas entre si y no se tocan.
  r = revisarCola(
    '## Ahora\n- [ ] ok · `existe.png`\n\n## Cerrado (2026-08-30)\n- algo\n\n## Cerrado (2026-08-31)\n- otra cosa\n', tmp);
  ok(!r.problemas.some((p) => p.regla === 'seccion-duplicada'), 'dos fechas distintas no son la misma seccion');

  // --- SHAs citados como evidencia ---
  // El resolvedor se inyecta: el self-check corre en un tmp sin repo, y ademas asi el caso
  // mide LA REGLA y no el estado de git de la maquina donde corra.
  const gitFalso = (vivos) => () => new Set(vivos);
  const conSha = (sha) => `## Ahora\n- [ ] Se arreglo · \`existe.png\` · commit \`${sha}\`\n`;

  // Lo que motivo todo: un `[x]` citaba el sha LOCAL de una rama squasheada, que no existe en
  // ningun lado. La cola declaraba desplegado algo cuya prueba no se puede ni mirar.
  r = revisarCola(conSha('6d8b6b7'), tmp, gitFalso([]));
  ok(r.problemas.some((p) => p.regla === 'sha-fantasma'), 'un sha que no existe en ningun repo se marca');

  // Reciproco 1: el sha que SI resuelve no molesta a nadie.
  r = revisarCola(conSha('e644c85'), tmp, gitFalso(['e644c85']));
  ok(!r.problemas.some((p) => p.regla === 'sha-fantasma'), 'un sha que resuelve no se marca');

  // Reciproco 2: la lista de excepciones tapa los duplicados documentados, o el gate sale rojo
  // de fabrica sobre la cola de hoy.
  r = revisarCola(conSha('6edfab6'), tmp, gitFalso([]));
  ok(!r.problemas.some((p) => p.regla === 'sha-fantasma'), 'un sha en la lista de excepciones no se marca');

  // Reciproco 3 — el que impide que la excepcion envejezca en silencio: si el sha excusado
  // empieza a resolver, la excusa vencio.
  r = revisarCola(conSha('6edfab6'), tmp, gitFalso(['6edfab6']));
  ok(r.problemas.some((p) => p.regla === 'excepcion-sha-vencida'), 'una excepcion de sha que ya resuelve se marca');

  // Una palabra hexadecimal NO es un commit. Sin pedir un digito, `defaced` y `facade` entran
  // como sha y el gate inventa fantasmas sobre prosa.
  r = revisarCola('## Ahora\n- [ ] Se arreglo · `existe.png` · quedo `defaced`\n', tmp, gitFalso([]));
  ok(!r.problemas.some((p) => p.regla === 'sha-fantasma'), 'una palabra hexadecimal sin digito no es un sha');

  // Y el numero de un item o un año tampoco: sin pedir una letra, `2026090` es un sha valido.
  r = revisarCola('## Ahora\n- [ ] Se arreglo · `existe.png` · ticket `2026090`\n', tmp, gitFalso([]));
  ok(!r.problemas.some((p) => p.regla === 'sha-fantasma'), 'una cifra sin letras no es un sha');

  // El sha va entre backticks y entero: `753718f` cuenta, pero no un pedazo de otra palabra.
  ok(evidenciaDe('commit `753718f` y `no-es-sha`').shas.join() === '753718f',
    'se extrae el sha del trozo entero, no un pedazo');

  console.log(`self-check ok: ${casos} casos`);
}

function main() {
  const a = process.argv.slice(2);
  if (a.includes('--self-check')) return selfCheck();

  const archivo = a[0];
  if (!archivo) {
    console.error('uso: node scripts/verificar_cola.js <cola.md>');
    process.exit(2);
  }

  const { problemas, items } = revisarCola(fs.readFileSync(archivo, 'utf8'), process.cwd());
  for (const p of problemas) console.log(`ERROR ${p.regla} [linea ${p.linea}]: ${p.msg}`);

  if (!problemas.length) console.log(`cola ok: ${items.length} items en Ahora, todos con evidencia real`);
  process.exit(problemas.length ? 1 : 0);
}

if (require.main === module) main();
module.exports = { revisarCola, itemsDeAhora, evidenciaDe, todosLosItems, tituloDe, duplicados, seccionesDuplicadas };
