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
    // Tambien "bot-engine.mjs:141-166", que es como se cita un BLOQUE y no una linea suelta.
    // Sin el `-`, el rango quedaba pegado al nombre y el archivo salia fantasma aunque
    // existiera: medido el 2026-09-03, `scripts/mirar-venta.mjs:141-166` daba fantasma con el
    // archivo vivo en `web-factory/apps/onia-platform/scripts/mirar-venta.mjs`. El gate acusaba
    // de inexistente un archivo real por como se lo citaba.
    const ruta = t.replace(/:\d+(?:[-:]\d+)?$/, '');

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

    // Una EXPANSION DE LLAVES tampoco: es un GLOB con otra sintaxis. La cola escribe
    // `hermes-content/docs/historial/canario-visual/2026-09-03-{home,precios,empezar}.png`
    // para citar las cinco capturas de una corrida sin repetir la carpeta larga. El gate
    // buscaba en disco el literal CON las llaves y daba fantasma sobre archivos que existen
    // (medido el 2026-09-03: 2 de sus 10 errores sobre COLA.md, items 1538 y 1675).
    // Se piden las DOS llaves y en orden, que es lo que impide que esto afloje el gate: un
    // archivo con una llave suelta en el nombre se sigue verificando.
    if (/\{[^}]*\}/.test(ruta)) continue;

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

    // Una ETIQUETA XML/HTML no es un archivo. La cola pega la salida de un `curl` para probar
    // lo que sirve produccion: `<loc>https://onia.com.bo/terminos</loc>`. Tiene barra y termina
    // en algo con forma de extension, asi que salia fantasma (medido el 2026-09-06 sobre
    // COLA.md, item de la linea 1938). Ningun archivo de estos repos tiene `<` ni `>` en el
    // nombre, asi que esto no puede tapar uno de verdad.
    if (/[<>]/.test(ruta)) continue;

    // Una METAVARIABLE tampoco: la cola cita «esto lo cruza `scripts/X.mjs`» para nombrar la
    // FORMA de un puntero, no un archivo. Es el mismo caso que el glob y la expansion de
    // llaves —un molde, no una ruta— escrito con otra notacion. Se pide que el nombre, sin
    // extension, sea UNA sola letra mayuscula: ningun archivo de estos repos se llama asi
    // (medido el 2026-09-11 sobre los dos arboles), y una de dos letras o en minuscula se
    // sigue verificando. Sin esto el gate acusaba de inexistente un archivo que nadie afirmo
    // que existiera.
    if (/(?:^|\/)[A-Z]\.[a-z0-9]{1,5}$/.test(ruta)) continue;

    // Un TIPO MIME tampoco: `image/x-icon`, `text/html`. La cola los cita porque son la
    // respuesta de un `curl -I` (medido el 2026-09-06: el item del favicon, linea 1856, pegaba
    // su Content-Type y salia fantasma). Tienen barra, asi que caian en "esto parece una ruta".
    // El recorte es angosto a proposito: se pide que el primer segmento sea un tipo MIME
    // conocido Y que el subtipo no tenga punto. Un archivo de verdad dentro de una carpeta
    // llamada `image/` lleva extension (`image/logo.png`) y se sigue verificando.
    if (/^(image|text|application|audio|video|font|multipart)\/[a-z0-9+-]+$/i.test(ruta)) continue;

    // Un PAR DE ALTERNATIVAS del lenguaje tampoco es un archivo: `if/else`, `try/catch`. La
    // cola los cita como sustantivo para hablar de la FORMA del codigo, no de un archivo —es
    // el mismo caso que la extension citada como sustantivo, con otra notacion. Medido el
    // 2026-09-25: `if/else` era el UNICO ERROR que tenia `npm run cola:viva` en exit 1, sobre
    // el item de la linea 80 de COLA.md, que dice «un `if/else` sin cobertura al lado de su
    // gate». Se exige el token ENTERO contra una lista cerrada (ver PARES_DEL_LENGUAJE), asi
    // que `if/else.ts` y `lib/if/else` se siguen verificando: esto no puede tapar un archivo.
    if (PARES_DEL_LENGUAJE.has(ruta.toLowerCase())) continue;

    // Una ruta se reconoce por tener separador o extension. "10 min" no es una ruta.
    // La barra sola no alcanza: un RECUENTO se escribe con barra (`100/106`, `3/3`, `14/24`) y
    // salia acusado de "apunta a 100/106 y ese archivo NO existe". Mordio dos vueltas seguidas
    // (2026-09-25) y las dos se curo reescribiendo la frase, o sea la instancia. Es el falso rojo
    // caro: manda a borrar de la cola la PRUEBA del item —el recuento que el gate de al lado
    // exige— y deja el verificador en rojo, que traba el merge de todos los carriles. Se pide una
    // letra en ALGUN tramo: ningun archivo se llama solo con digitos y barras, y una ruta que
    // tenga un tramo numerico (`scripts/loops/v2/correr.sh`) sigue entrando por sus otros tramos.
    if (/[\/]/.test(ruta)) {
      if (/[a-z]/i.test(ruta)) rutas.push(ruta);
      continue;
    }

    // Sin barra, la sola presencia de un punto NO alcanza: `visto.texto`, `d.fonts`,
    // `patient.ci` son expresiones de codigo, y `.texto` no es una extension de nada. Se
    // pide que el sufijo sea una extension que exista de verdad en estos repos. Con barra
    // (arriba) se sigue verificando siempre, asi que esto no puede tapar un archivo en una
    // carpeta — solo desarma la confusion "identificador punteado == nombre de archivo".
    // Y ademas tiene que haber NOMBRE antes del punto. Sin el `(.+)` el token entero `.tsx`
    // pasaba —su sufijo es una extension conocida— y el gate acusaba "apunta a .tsx y ese
    // archivo NO existe" sobre una frase que solo decia "todos los archivos de ese tipo".
    // Un dotfile de verdad (`.env`, `.gitignore`) se nombra CON su carpeta y lo resuelve la
    // rama de arriba, asi que exigir nombre aca no puede tapar ninguno.
    //
    // Y el nombre no puede EMPEZAR con punto, o una extension COMPUESTA se cuela: `.test.ts`
    // partia en nombre `.test` + extension `ts`, el `(.+)` quedaba satisfecho, y el gate
    // acusaba "apunta a .test.ts y ese archivo NO existe" sobre una frase que solo decia «una
    // afirmacion escrita dentro de un `.test.ts`» (medido el 2026-09-11: 1 de los 4 errores
    // falsos que tenian `npm run cola:viva` en rojo). Es el MISMO caso que el `.tsx` de arriba
    // —una extension citada como sustantivo— y la regla de entonces solo cubria las simples.
    // Vale igual para `.d.ts` y `.spec.mjs`. Un dotfile de verdad se sigue nombrando CON su
    // carpeta y lo resuelve la rama del separador, asi que esto no puede tapar ninguno.
    const ext = ruta.match(/^(.+)\.([a-z0-9]{1,5})$/i);
    if (ext && !ext[1].startsWith('.') && EXTENSIONES.has(ext[2].toLowerCase())) rutas.push(ruta);
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

// Los PARES DE ALTERNATIVAS que estas colas escriben para nombrar un constructo de codigo
// como sustantivo: «un `if/else` sin cobertura», «un `try/catch` que se traga el error».
// No prometen un archivo —nombran una forma, igual que el `.test.ts` de mas arriba— pero
// tienen barra, asi que caian en "esto parece una ruta". Los dos salen de CONTAR sobre el
// corpus (2026-09-25: los unicos pares palabra/palabra de las colas que no son rutas reales
// ni paquetes), no de imaginar cuales podrian aparecer. Lista cerrada y token exacto a
// proposito: el dia que haga falta un tercero, el sintoma es un rojo visible con el par
// adentro del mensaje, que es barato; un patron generico (`\w+/\w+` sin extension) taparia
// carpetas de verdad como `scripts/loops` y dejaria pasar fantasmas.
const PARES_DEL_LENGUAJE = new Set(['if/else', 'try/catch']);


// ONIA es DOS repos y una cola cita a los dos: el carril de producto trabaja en
// `onia-platform` (lib/plan-limits.ts, app/api/...) y escribe su cola en
// `onia-hermes`. Resolviendo solo contra el repo actual, cada ruta del producto
// salia como "fantasma" y el verificador quedaba inservible justo para el carril
// que mas lo necesita — se midio el 2026-08-31: 10 falsos positivos de 10.
//
// No se pasa a rutas absolutas a proposito: una cola con `C:\dev\...` adentro
// solo sirve en la maquina de Sergio.
// `onia-platform-chatbot` es el WORKTREE del carril, y va acá por un falso rojo
// medido el 2026-09-06: el clon `onia-platform` está en `master`, así que todo
// archivo que el carril acaba de crear en SU rama sale fantasma — el gate le
// exige evidencia a la cola y después llama inexistente a la única que hay. El
// efecto es el peor posible: empuja a NO citar el archivo que uno acaba de
// escribir. No afloja nada, sigue exigiendo que el archivo exista en disco.
const REPOS_HERMANOS = ['onia-platform', 'onia-platform-chatbot'];

// Y las apps que viven DENTRO de este repo. Un item del sitio de venta escribe sus rutas
// relativas a la app (`src/app/terminos/opengraph-image.tsx`), no al repo — es como se
// nombran entre gente que trabaja ahi, y pedirle el prefijo largo a cada renglon es pedir
// que el gate se ignore. Medido el 2026-09-02: 4 falsos positivos de 4, todos archivos que
// SI existen, el dia despues de que `dc8baa8b` limpiara otros 4 por lo mismo. Un gate que
// sale rojo de fabrica se empieza a saltear, y ahi deja de proteger nada.
const APPS_DEL_REPO = ['web-factory/apps/onia-platform'];

function existeEnAlgunRepo(ruta, baseDir) {
  // Una zona termina en barra y se resuelve como CARPETA, no como archivo: el indice de
  // sufijos solo tiene archivos y le diria fantasma. Ver `existeComoCarpeta`.
  if (ruta.endsWith('/')) return existeComoCarpeta(ruta, baseDir);
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
      // Y la misma ruta escrita CON el nombre del repo adelante
      // (`onia-platform/lib/pricing.ts`), que es como la escribe CLAUDE.md para fijar la
      // fuente de verdad de precios. Sin este renglon el prefijo se unia al repo hermano
      // —que se llama igual— y quedaba `onia-platform/onia-platform/lib/...`: fantasma
      // garantizado sobre el archivo mas citado del carril. No afloja nada: se sigue
      // exigiendo que exista DENTRO de algun hermano, solo se deja de contar el nombre dos veces.
      //
      // El resto se busca en TODOS los hermanos, no solo en el que dio el prefijo. `master` y
      // el worktree del carril se llaman distinto pero son el MISMO repo: pedirle a quien
      // escribe la cola que adivine en cual de los dos aterrizo su archivo es pedir que el gate
      // se ignore. Medido el 2026-09-11: `onia-platform/scripts/cron/run-onia-renewal-reminders.sh`
      // salia fantasma con el archivo vivo en el worktree y el clon `onia-platform` atrasado —
      // el rojo caro, el que manda a borrar de la cola una referencia cierta.
      if (ruta.startsWith(repo + '/')) {
        const sinPrefijo = ruta.slice(repo.length + 1);
        for (const hermano of REPOS_HERMANOS) {
          if (fs.existsSync(path.join(path.dirname(dir), hermano, sinPrefijo))) return true;
        }
      }
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
  if (ruta.includes('/')) {
    return existeComoSufijo(ruta, baseDir) || existeComoRutaAbreviada(ruta, baseDir);
  }

  // Sin barra se resuelve por sufijo SOLO si el nombre es unico en el arbol. El motivo por el
  // que esto estuvo prohibido durante meses era, textual, que "un `page.tsx` suelto matchearia
  // cientos" — un argumento sobre AMBIGUEDAD, no sobre existencia. Con exactamente UNA
  // coincidencia no hay ambiguedad: hay un solo archivo con ese nombre y resolverlo es
  // determinista.
  //
  // Corregido el 2026-09-03 por `onia-cola`. La carve-out anterior tapaba el caso de CIENTOS
  // (`nombreSueltoAmbiguo`, >=2, se ignora) y dejaba vivo el de UNO, que es peor: el gate
  // decia "ese archivo NO existe" sobre un archivo que existe. Medido despues de mergear
  // `web-venta` y `canario-visual`: seis nombres reales (`compartir.test.ts`, `indexar.test.ts`,
  // `cierre.test.ts`, `legal-page.tsx`, `switcher.tsx`, `apple-icon.png`) acusados de
  // inexistentes, y el gate de 3 a 16 errores. Un gate rojo de fabrica se saltea, y ahi deja
  // de proteger — la misma leccion que el vigia que grita mal.
  //
  // Los tres tramos, y son excluyentes: 0 coincidencias -> fantasma de verdad (`no-esta.png`);
  // 1 -> se resuelve aca; >=2 -> `nombreSueltoAmbiguo` ya lo filtro antes de llegar, sin
  // evidencia y sin error. El indice no mira `node_modules` ni `.next`, asi que las copias de
  // build no cuentan: `apple-icon.png` tiene tres archivos en disco y UNO en fuente.
  return cuantosSeLlamanAsi(ruta, baseDir) === 1;
}

// Los arboles donde puede vivir un archivo citado. NO se incluyen las `APPS_DEL_REPO`: cuelgan
// de `baseDir` y su indice ya las cubre — sumarlas contaria dos veces el mismo archivo y un
// nombre unico pasaria por ambiguo.
function dirsDeBusqueda(baseDir) {
  const dirs = [path.resolve(baseDir)];
  let dir = path.resolve(baseDir);
  for (let i = 0; i < 6; i++) {
    for (const repo of REPOS_HERMANOS) {
      const cand = path.join(path.dirname(dir), repo);
      if (fs.existsSync(cand)) dirs.push(cand);
    }
    const padre = path.dirname(dir);
    if (padre === dir) break;
    dir = padre;
  }
  return [...new Set(dirs)];
}

// Cuantos archivos del arbol se llaman asi. Es lo que distingue un nombre suelto AMBIGUO —que
// el gate decidio no resolver, y por eso no puede acusarlo— de uno que de verdad no existe.
function cuantosSeLlamanAsi(nombre, baseDir) {
  let n = 0;
  for (const d of dirsDeBusqueda(baseDir)) n += (indiceDe(d).get(nombre) || []).length;
  return n;
}

// Un nombre suelto que matchea VARIOS archivos es irresoluble por diseño: `existeComoSufijo`
// se niega a buscarlo justamente porque `page.tsx` matchearia cientos. Reportarlo como
// fantasma es el gate acusando "ese archivo NO existe" sobre algo que decidio no buscar — y un
// gate que se acusa a si mismo sale rojo de fabrica y se termina salteando. Medido el
// 2026-09-03 sobre COLA.md: `page.tsx` tiene 155 archivos con ese nombre entre los dos repos y
// `globals.css` 6. Ni evidencia ni error: se ignora.
function nombreSueltoAmbiguo(ruta, baseDir) {
  if (ruta.includes('/')) return false;
  return cuantosSeLlamanAsi(ruta, baseDir) >= 2;
}

// Un especificador de MODULO no es un archivo de este arbol, aunque tenga barra.
// `@/lib/pricing` es un alias de TypeScript (se resuelve por `tsconfig`, no por disco),
// `next/link` un paquete de npm y `packs/js/sdk.js` el SDK de Chatwoot que sirve OTRO host.
// Los tres salian fantasma sobre archivos que nunca fueron de este repo.
const MODULOS_EXTERNOS = new Set(['next/link', 'packs/js/sdk.js']);

function esEspecificadorDeModulo(ruta) {
  // El alias `@/` es la unica forma generica que se puede descartar sin riesgo: ninguna ruta
  // real empieza con arroba-barra. Un paquete CON scope (`@supabase/ssr`) ya lo descarta la
  // regla del extractor, y esa exige un nombre entre el `@` y la barra.
  if (/^@\//.test(ruta)) return true;
  return MODULOS_EXTERNOS.has(ruta);
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

// Una CARPETA citada como zona (`app/servicios/`, `app/(sitio)/`) no es un archivo, pero
// tampoco es algo que el gate deba ignorar: la cola la usa para decir DONDE vive un problema
// ("las dos siguen en `app/servicios/`, el arbol viejo"), y una carpeta inventada es un
// fantasma tan caro como un archivo inventado. Por eso se verifica en vez de descartarse.
//
// Se resuelve reusando el indice de archivos en lugar de construir uno de directorios: una
// carpeta existe si algun archivo del repo la tiene de PREFIJO, cortando en limite de segmento.
// Eso es lo que impide que esto afloje el gate — `app/inventada/` no matchea ningun archivo y
// sigue saliendo fantasma.
//
// Medido el 2026-09-06: `app/servicios/` y `app/(sitio)/` salian fantasma sobre carpetas que
// existen (viven bajo `web-factory/apps/onia-platform/src/`, asi que el prefijo que falta es
// intermedio, igual que en el caso de las rutas parciales).
function existeComoCarpeta(ruta, baseDir) {
  const zona = ruta.replace(/\/+$/, '');
  if (!zona) return false;
  if (fs.existsSync(path.resolve(baseDir, zona))) return true;
  for (const app of APPS_DEL_REPO) {
    if (fs.existsSync(path.resolve(baseDir, app, zona))) return true;
  }
  for (const lista of indiceDe(baseDir).values()) {
    if (lista.some((p) => p.startsWith(zona + '/') || p.includes('/' + zona + '/'))) return true;
  }
  return false;
}

// Una cita ABREVIADA CON HUECO: primer segmento y nombre, saltandose los del medio. La cola
// escribe `lucia/palabras-cableadas.py` para el archivo que vive en
// `hermes-content/references/modelos/lucia/scripts/palabras-cableadas.py` — no es sufijo (falta
// `scripts/` en el medio), asi que `existeComoSufijo` se niega y el gate acusaba de inexistente
// un archivo VIVO. Medido el 2026-09-11: 1 de los 4 errores falsos que tenian `cola:viva` en rojo.
//
// No afloja el gate, y este es el motivo: se exige que el NOMBRE sea UNICO en el arbol (una sola
// coincidencia, igual que el tramo de nombre suelto de `existeEnAlgunRepo`) y que los segmentos
// citados aparezcan EN ORDEN dentro de la ruta real. Con cero coincidencias sigue siendo fantasma
// de verdad; con dos o mas no se resuelve, porque ahi la abreviacion es ambigua y adivinar es
// justo como un gate empieza a fallar abierto.
function existeComoRutaAbreviada(ruta, baseDir) {
  const partes = ruta.split('/').filter(Boolean);
  if (partes.length < 2) return false;
  const nombre = partes[partes.length - 1];
  const candidatos = [];
  for (const d of dirsDeBusqueda(baseDir)) candidatos.push(...(indiceDe(d).get(nombre) || []));
  if (candidatos.length !== 1) return false;
  const reales = candidatos[0].split('/').filter(Boolean);
  let i = 0;
  for (const seg of reales) {
    if (seg === partes[i]) i += 1;
    if (i === partes.length) return true;
  }
  return false;
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
  // El cuarto del mismo conjunto, y quedo afuera por descuido: COLA.md:285 lo lista JUNTO a los
  // tres de arriba ("(`6edfab6`, `a15c82f`, `e46e9ee`, `6d8b6b7`) son los duplicados locales"),
  // y otras tres lineas lo citan justamente para narrar que NO existe (`COLA.md:215` "aca decia
  // 6d8b6b7, que es el sha local de la rama antes del squash", `:1312`, `:2542`). O sea que el
  // gate daba rojo sobre la bitacora que documenta este mismo defecto, y obedecerlo obligaba a
  // borrar el registro de lo que paso. Medido el 2026-09-07: `git cat-file -t 6d8b6b7` dice
  // "Not a valid object name" en los DOS repos. Su reciproco lo cubre `excepcion-sha-vencida`.
  ['6d8b6b7', 'idem 6edfab6; la cola lo cita 4 veces para documentar que NO resuelve'],
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

// --- Bitacora contra afirmacion: el criterio que reemplaza al carve-out numero N ---
//
// Este archivo lleva SEIS carve-outs de notacion (glob, llaves, elipsis, rama, etiqueta, MIME) y
// el ciclo volvio a divergir cada vez, porque todos preguntan COMO esta escrita la ruta y el
// problema es OTRO: para que la cita es. Un item que DENUNCIA un puntero muerto tiene que poder
// nombrarlo —«el gate existe para cazar el puntero muerto, un comentario que dice esto lo cruza
// `scripts/limites-vivos.mjs` sobre un archivo que nunca se escribio»— sin que el gate lo obligue
// a borrar su propio diagnostico. Esa cita no manda a nadie a trabajar ahi: es el OBJETO de lo
// que el item narra. Es el mismo criterio con el que `palabras-cableadas.py` separo pieza de
// prosa en el carril de Lucia.
//
// La ventana es la ORACION de la aparicion, no el item: con el item entero, un parrafo que narra
// un puntero muerto absolveria a la ruta de trabajo del parrafo siguiente, que es exactamente
// como esta familia de gates empieza a fallar ABIERTO. Alcanza con que UNA aparicion este en
// vecindad de bitacora: si el item declara en algun lado que ese archivo no existe, citarlo no es
// mandar a trabajar ahi.
//
// Los marcadores salen de los casos REALES medidos el 2026-09-11, no de lo que a uno se le ocurre
// que alguien podria escribir.
const MARCAS_DE_BITACORA = [
  /nunca (?:se |lo )?(?:escribi|cre|existi)/i,
  /\bno existe\b/i, /\bya no existe\b/i, /\binexistente\b/i,
  /No such file/i, /MODULE_NOT_FOUND/,
  /puntero muerto/i, /corrigi[oó] el puntero/i,
];

function citadaComoBitacora(texto, ruta) {
  let desde = 0;
  for (;;) {
    const i = texto.indexOf(ruta, desde);
    if (i === -1) return false;
    desde = i + ruta.length;
    // La oracion: hacia atras hasta un punto seguido de espacio o un salto de parrafo, y hacia
    // adelante igual. El punto de una extension no corta porque se exige el espacio detras.
    const izq = Math.max(
      texto.lastIndexOf('. ', i), texto.lastIndexOf('.\n', i), texto.lastIndexOf('\n\n', i),
    );
    const der = [texto.indexOf('. ', desde), texto.indexOf('.\n', desde), texto.indexOf('\n\n', desde)]
      .filter((n) => n !== -1);
    const oracion = texto.slice(izq === -1 ? 0 : izq + 1, der.length ? Math.min(...der) : texto.length);
    if (MARCAS_DE_BITACORA.some((re) => re.test(oracion))) return true;
  }
}

function revisarCola(texto, baseDir = process.cwd(), resolverShas = null) {
  const problemas = [...seccionesDuplicadas(texto), ...duplicados(texto)];
  const avisos = [];
  const items = itemsDeAhora(texto);
  const resolver = resolverShas || resolvedorGit(baseDir);

  if (!items.length) {
    problemas.push({ regla: 'cola-vacia', linea: 0,
      msg: 'la seccion "## Ahora" no tiene items: o no existe, o el carril esta parado' });
    return { problemas, avisos, items };
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
    const { rutas: crudas, comandos } = evidenciaDe(it.texto);

    // Lo que el gate NO PUEDE decidir se descarta ANTES de contar evidencia, no despues: un
    // nombre suelto ambiguo y un especificador de modulo no son ni prueba ni fantasma. Va
    // aca —y no en el extractor— porque hace falta el disco para saber si un nombre es
    // ambiguo, y el extractor solo ve texto. Que caiga antes del `!rutas.length` es a
    // proposito: un item que SOLO cita cosas irresolubles queda `sin-evidencia`, que es la
    // verdad, en vez de pasar con una prueba que nadie puede seguir.
    const rutas = crudas.filter(
      (r) => !esEspecificadorDeModulo(r) && !nombreSueltoAmbiguo(r, baseDir),
    );

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
      if (existeEnAlgunRepo(r, baseDir)) continue;
      const destino = citadaComoBitacora(it.texto, r) ? avisos : problemas;
      destino.push({
        regla: citadaComoBitacora(it.texto, r) ? 'fantasma-narrado' : 'fantasma', linea: it.linea,
        msg: citadaComoBitacora(it.texto, r)
          ? `"${it.texto.slice(0, 50)}" nombra ${r}, que no existe — su vecindad lo declara asi, es bitacora`
          : `"${it.texto.slice(0, 50)}" apunta a ${r} y ese archivo NO existe`,
      });
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
  return { problemas, avisos, items };
}

function selfCheck() {
  const assert = require('node:assert');
  let casos = 0;
  const ok = (c, m) => { casos += 1; assert.ok(c, m); };

  const tmp = path.join(require('os').tmpdir(), 'cola-selfcheck');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  fs.writeFileSync(path.join(tmp, 'existe.png'), 'x');
  // Fixtures de los casos de nombre suelto. Van ACA y no junto a su caso porque el indice por
  // nombre se construye una vez por directorio y queda cacheado: un archivo creado despues de
  // la primera revision no lo ve, y el caso falla por la cache y no por la regla.
  fs.mkdirSync(path.join(tmp, 'a'), { recursive: true });
  fs.mkdirSync(path.join(tmp, 'b'), { recursive: true });
  fs.writeFileSync(path.join(tmp, 'a', 'page.tsx'), 'x');   // ambiguo: dos con el mismo nombre
  fs.writeFileSync(path.join(tmp, 'b', 'page.tsx'), 'x');
  fs.writeFileSync(path.join(tmp, 'a', 'unico-nombre.tsx'), 'x');  // sin ambiguedad: uno solo
  // Para el caso de ZONA: una carpeta existe si algun archivo la tiene de prefijo.
  fs.mkdirSync(path.join(tmp, 'sub'), { recursive: true });
  fs.writeFileSync(path.join(tmp, 'sub', 'algo.txt'), 'x');
  // Para la cita ABREVIADA CON HUECO (`lucia/solo-uno.py` -> .../lucia/scripts/solo-uno.py).
  // Va ACA y no al lado de su caso: `indiceDe` cachea el arbol por directorio la primera vez
  // que algun sufijo lo necesita, asi que un archivo creado a mitad del self-check no existe
  // para el indice y el caso falla por el motivo equivocado.
  fs.mkdirSync(path.join(tmp, 'modelos', 'lucia', 'scripts'), { recursive: true });
  fs.writeFileSync(path.join(tmp, 'modelos', 'lucia', 'scripts', 'solo-uno.py'), 'x');

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

  // --- Nombre suelto AMBIGUO: el gate acusandose a si mismo ---
  // `existeComoSufijo` se niega a propósito a resolver un nombre sin barra, porque un
  // `page.tsx` suelto matchearia cientos. Pero despues se reportaba como fantasma: el gate
  // declaraba "ese archivo NO existe" sobre algo que decidio no buscar. Medido el 2026-09-03
  // sobre COLA.md: `page.tsx` tiene 155 archivos con ese nombre entre los dos repos y
  // `globals.css` 6. Lo honesto es ignorarlo — ni evidencia ni error.
  r = revisarCola('## Ahora\n- [ ] Algo · `existe.png` · y el `page.tsx`\n', tmp);
  ok(!r.problemas.some((p) => p.regla === 'fantasma'),
    'un nombre suelto que matchea varios archivos no es fantasma: el gate decidio no resolverlo');

  // Reciproco 1 — y es el que impide que esto afloje el gate: ambiguo NO es evidencia.
  // Si lo fuera, cualquier item pasaria escribiendo `page.tsx`.
  r = revisarCola('## Ahora\n- [ ] Algo · `page.tsx`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'sin-evidencia'),
    'un nombre suelto ambiguo no cuenta como evidencia');

  // Reciproco 2: un nombre suelto que no matchea NADA sigue siendo fantasma de verdad.
  // Es la diferencia medida entre `page.tsx` (155 archivos) y `no-esta.png` (cero).
  r = revisarCola('## Ahora\n- [ ] Algo · `existe.png` · y el `no-existe-en-ningun-lado.tsx`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'),
    'un nombre suelto sin ninguna coincidencia sigue siendo fantasma');

  // Reciproco 3 — el limite exacto, CORREGIDO el 2026-09-03 por `onia-cola`. Antes este caso
  // exigia `fantasma` con UNA sola coincidencia, y era el ultimo resto del defecto que este
  // gate ya se habia arreglado a medias: acusar de inexistente un archivo que existe. La
  // carve-out de ambiguedad tapaba el caso de CIENTOS y dejaba vivo el de UNO.
  //
  // El razonamiento original de "sin barra no hay resolucion por sufijo" era, textual, que
  // "un `page.tsx` suelto matchearia cientos" — o sea un argumento sobre AMBIGUEDAD. Con una
  // sola coincidencia no hay ninguna: hay exactamente un archivo en el arbol con ese nombre y
  // resolverlo es determinista. Medido el 2026-09-03 sobre COLA.md despues de mergear los
  // carriles `web-venta` y `canario-visual`: seis nombres — `compartir.test.ts`,
  // `indexar.test.ts`, `cierre.test.ts`, `legal-page.tsx`, `switcher.tsx` y `apple-icon.png` —
  // se reportaban como "ese archivo NO existe" existiendo, uno solo cada uno. El gate paso de
  // 3 a 16 errores de golpe, y un gate que sale rojo de fabrica se saltea: ahi deja de proteger.
  r = revisarCola('## Ahora\n- [ ] Algo · `unico-nombre.tsx`\n', tmp);
  ok(!r.problemas.some((p) => p.regla === 'fantasma'),
    'con una sola coincidencia se resuelve: no hay ambiguedad que lo impida');

  // Y resuelve DE VERDAD, o sea tambien cuenta como evidencia. Sin esto el arreglo seria
  // cosmetico: el item dejaria de salir `fantasma` para salir `sin-evidencia`, y el gate
  // seguiria rojo por el mismo archivo que si existe.
  ok(!r.problemas.length,
    'un nombre suelto unico es evidencia: el archivo existe y se encontro');

  // --- Rango de lineas: "archivo.mjs:141-166" cita un BLOQUE, no una linea ---
  // El limpiador entendia `:141` y `:141:5` pero no el rango, asi que el `-166` quedaba
  // pegado al nombre y el archivo salia fantasma existiendo.
  r = revisarCola('## Ahora\n- [ ] Ver `existe.png:141-166`\n', tmp);
  ok(!r.problemas.length, 'un rango de lineas no convierte en fantasma un archivo que existe');
  // Reciproco: sacar el rango no puede volver verde un archivo que NO esta.
  r = revisarCola('## Ahora\n- [ ] Ver `no-esta.png:141-166`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'sacar el rango no tapa un archivo que falta');

  // --- Especificador de MODULO: no es un archivo de este arbol ---
  // `@/lib/pricing` es un alias de TypeScript, `next/link` un paquete de npm y
  // `packs/js/sdk.js` el SDK de Chatwoot servido por otro host. Los tres tienen barra, asi
  // que caian en "esto parece una ruta" y salian fantasma sobre archivos que no son de acá.
  for (const mod of ['@/lib/pricing', 'next/link', 'packs/js/sdk.js']) {
    r = revisarCola(`## Ahora\n- [ ] Algo · \`existe.png\` · importa \`${mod}\`\n`, tmp);
    ok(!r.problemas.some((p) => p.regla === 'fantasma'), `${mod} no es una ruta de este repo`);
  }

  // Reciproco: un especificador de modulo tampoco es evidencia de que algo exista.
  r = revisarCola('## Ahora\n- [ ] Algo · `@/lib/pricing`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'sin-evidencia'),
    'un especificador de modulo no cuenta como evidencia');

  // Y el alias no puede tapar una carpeta de verdad que empiece con arroba: se exige
  // que el `@` vaya seguido de barra, que es la forma del alias y de ninguna ruta real.
  r = revisarCola('## Ahora\n- [ ] Algo · `@scope/paquete/no-esta.js`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'sin-evidencia'),
    'un paquete con scope sigue sin ser evidencia');

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

  // (5b) La MISMA ruta pero escrita CON el nombre del repo adelante. Es la forma que usa
  // CLAUDE.md para fijar la fuente de verdad de precios (`onia-platform/lib/pricing.ts`), o sea
  // la forma mas autorizada que hay — y era un fantasma garantizado: al unir el prefijo con el
  // repo hermano, que se llama igual, salia `onia-platform/onia-platform/lib/...`. Medido el
  // 2026-09-03: 3 de los 8 errores de COLA.md eran esto, sobre archivos que existen.
  fs.writeFileSync(path.join(tmp, 'onia-platform', 'lib', 'pricing.ts'), 'x');
  r = revisarCola('## Ahora\n- [ ] Leer precios · `onia-platform/lib/pricing.ts`\n', path.join(tmp, 'onia-hermes'));
  ok(!r.problemas.length, 'una ruta del hermano CON el prefijo del repo tambien resuelve');

  // Y su limite: lo que no esta ni aca ni en el hermano sigue siendo fantasma.
  r = revisarCola('## Ahora\n- [ ] Algo · `lib/no-existe-en-ningun-lado.ts`\n', path.join(tmp, 'onia-hermes'));
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'el repo hermano no vuelve verde cualquier ruta');

  // Ni el prefijo del repo hermano vuelve verde un archivo que no existe ahi.
  r = revisarCola('## Ahora\n- [ ] Algo · `onia-platform/lib/tampoco-existe.ts`\n', path.join(tmp, 'onia-hermes'));
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'el prefijo del hermano no absuelve una ruta inventada');

  // --- Los cuatro falsos positivos medidos el 2026-09-11 (`cola:viva` en rojo, exit 1) ---
  // Los cuatro salian del MISMO item —prosa narrando punteros muertos— y por eso el carve-out
  // de notacion numero N no cerraba: no eran una causa, eran cuatro, y de tres naturalezas.
  // Cada uno va con su reciproco, que es lo que impide que el arreglo afloje el gate.
  //
  // OJO, y es la razon por la que estos casos existen y no alcanzaba con mutar contra COLA.md:
  // (a) y (b) dan VERDE al mutarlos sobre el corpus real, porque la cura de CONTEXTO los tapa
  // (la vecindad de `.test.ts` en ese item dice «el archivo inexistente»). Dos guardias hermanos
  // atajando el mismo caso hacen pasar la mutacion por el motivo equivocado: cada cura necesita
  // el caso que NINGUNA otra puede ver.

  // (a) Una extension COMPUESTA citada como sustantivo no es una ruta. `.test.ts` partia en
  // nombre `.test` + extension `ts`, satisfacia el `(.+)` de la regla del `.tsx`, y el gate
  // acusaba "apunta a .test.ts y ese archivo NO existe" sobre una frase que solo decia
  // «una afirmacion escrita dentro de un `.test.ts`».
  r = revisarCola('## Ahora\n- [ ] Una afirmacion dentro de un `.test.ts` · `existe.png`\n', tmp);
  ok(!r.problemas.length, 'una extension compuesta citada como sustantivo no es una ruta');
  r = revisarCola('## Ahora\n- [ ] Arreglar `sub/no-esta.test.ts` · `existe.png`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'),
    'pero un .test.ts CON nombre y que no existe sigue siendo fantasma');

  // (b) Una METAVARIABLE no es un archivo: la cola escribe «esto lo cruza `scripts/X.mjs`» para
  // nombrar la FORMA de un puntero. Es el glob con otra notacion.
  r = revisarCola('## Ahora\n- [ ] Un comentario que dice «lo cruza `scripts/X.mjs`» · `existe.png`\n', tmp);
  ok(!r.problemas.length, 'una metavariable de un solo caracter en mayuscula no es una ruta');
  r = revisarCola('## Ahora\n- [ ] Arreglar `scripts/Xa.mjs` · `existe.png`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'),
    'pero un nombre de DOS letras se sigue verificando: el recorte es de un caracter');

  // (c) La cura central: bitacora contra afirmacion, por la VECINDAD de la cita. Un item que
  // DENUNCIA un puntero muerto tiene que poder nombrarlo sin que el gate lo obligue a borrar su
  // propio diagnostico; uno que manda a trabajar ahi tiene que salir rojo.
  r = revisarCola('## Ahora\n- [ ] El puntero `scripts/fantasmita.mjs` nunca se escribio · `existe.png`\n', tmp);
  ok(!r.problemas.length, 'una cita cuya vecindad la declara inexistente es bitacora, no error');
  ok(r.avisos.some((a) => a.regla === 'fantasma-narrado'), 'y sale como AVISO, no en silencio');
  r = revisarCola('## Ahora\n- [ ] Arreglar el cruce en `scripts/fantasmita.mjs` · `existe.png`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'),
    'la MISMA ruta sin esa vecindad sigue siendo fantasma: separa el contexto, no la notacion');
  // Y la ventana es la ORACION, no el item: sin esto, un parrafo que narra un puntero muerto
  // absolveria a la ruta de trabajo del parrafo siguiente — asi falla ABIERTA esta familia.
  r = revisarCola('## Ahora\n- [ ] `scripts/viejo.mjs` nunca se escribio. Hay que editar `scripts/otro-que-falta.mjs` · `existe.png`\n', tmp);
  ok(r.problemas.some((p) => p.msg.includes('otro-que-falta.mjs')),
    'la bitacora de una oracion no absuelve a la ruta de trabajo de la oracion siguiente');

  // (d) Una cita ABREVIADA CON HUECO —primer segmento y nombre, sin los del medio— sobre un
  // archivo que SI existe. No es sufijo, asi que `existeComoSufijo` se negaba y el gate acusaba
  // de inexistente un archivo vivo. Se exige nombre UNICO y segmentos en orden.
  r = revisarCola('## Ahora\n- [ ] Ver `lucia/solo-uno.py` · `existe.png`\n', tmp);
  ok(!r.problemas.length, 'una cita abreviada con hueco resuelve si el nombre es unico y los segmentos van en orden');
  r = revisarCola('## Ahora\n- [ ] Ver `inventado/solo-uno.py` · `existe.png`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'),
    'pero un segmento que NO esta en la ruta real no resuelve: no alcanza con que el nombre exista');

  // (e) Un PAR DE ALTERNATIVAS del lenguaje no es una ruta. La cola escribe «un `if/else` sin
  // cobertura» para nombrar un constructo de codigo como sustantivo, igual que `.test.ts` en
  // (a): no promete un archivo, nombra una forma. Tiene barra, asi que caia en "esto parece
  // una ruta" (medido el 2026-09-25: era el UNICO ERROR que tenia `npm run cola:viva` en
  // rojo, item de la linea 80 de COLA.md, y por eso el gate llevaba dias en exit 1).
  r = revisarCola('## Ahora\n- [ ] Un `if/else` sin cobertura al lado de su gate · `existe.png`\n', tmp);
  ok(!r.problemas.length, 'un par de alternativas del lenguaje no es una ruta');
  r = revisarCola('## Ahora\n- [ ] Un `try/catch` que se traga el error · `existe.png`\n', tmp);
  ok(!r.problemas.length, 'y vale para el otro par que estas colas escriben');
  // Los reciprocos: el recorte pide el token EXACTO, asi que una ruta que solo EMPIECE con esa
  // palabra —o que la lleve como carpeta— se sigue verificando. Sin esto el carve-out afloja.
  r = revisarCola('## Ahora\n- [ ] Arreglar `if/else.ts` · `existe.png`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'),
    'pero un archivo con extension bajo esa palabra sigue siendo fantasma');
  r = revisarCola('## Ahora\n- [ ] Arreglar `lib/if/else` · `existe.png`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'),
    'y el par como SUFIJO de una ruta tampoco absuelve: se pide el token entero');


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

  // (1c) Una EXPANSION DE LLAVES de shell tampoco es un archivo: es la forma corta de nombrar
  // varios. La cola escribe `.../2026-09-03-{home,precios,empezar,rubros}.png` para citar las
  // cinco capturas de una corrida en un renglon. Es el MISMO caso que el glob de (1) —una
  // notacion que denota un conjunto— y salia fantasma por el mismo motivo: se buscaba en disco
  // el literal con las llaves adentro. Medido el 2026-09-03 sobre COLA.md: 2 de los 10 errores
  // del gate eran esto, en los items 1538 y 1675, sobre capturas que SI existen.
  r = revisarCola('## Ahora\n- [ ] Fotos `carpeta/2026-{a,b}.png` · `existe.png`\n', tmp);
  ok(!r.problemas.length, 'una expansion de llaves no es una ruta');
  // Su reciproco: hacen falta las DOS llaves. Una ruta con una llave suelta no se tapa.
  r = revisarCola('## Ahora\n- [ ] Roto `carpeta/no-existe{.png`\n', tmp);
  ok(r.problemas.length === 1, 'una llave suelta NO convierte la ruta en expansion');

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

  // (2b) Una extension SOLA no es un archivo. La cola escribe "grep sobre todos los `.tsx`"
  // para decir "los archivos de ese tipo", y el gate contestaba "apunta a .tsx y ese archivo NO
  // existe" — una frase sin sentido, porque nadie nombro un archivo llamado `.tsx`.
  // Medido el 2026-09-02 sobre COLA.md: 2 de los 9 ERROR eran esto (`.tsx` y `.css`).
  // La carve-out de (2) pedia que el sufijo fuera una extension conocida, pero NO que hubiera
  // nombre antes del punto, asi que el token entero `.css` pasaba el filtro y entraba como ruta.
  r = revisarCola('## Ahora\n- [ ] Un grep sobre todos los `.tsx` y los `.css` · `existe.png`\n', tmp);
  ok(!r.problemas.length, 'una extension sola no es una ruta');
  // Su reciproco 1: con nombre delante, el archivo suelto se sigue verificando.
  r = revisarCola('## Ahora\n- [ ] Algo · `a.tsx`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'la carve-out no tapa un archivo de nombre corto');
  // Su reciproco 2: un dotfile de verdad se nombra CON su carpeta, y ahi se sigue verificando.
  r = revisarCola('## Ahora\n- [ ] Algo · `carpeta/.env`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'un dotfile con barra se sigue verificando');

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

  // (6b) Una ETIQUETA XML/HTML no es un archivo: la cola pega la salida de un curl para probar
  // lo que sirve produccion. Medido el 2026-09-06 sobre COLA.md (item de la linea 1938).
  r = revisarCola('## Ahora\n- [ ] Traia `<loc>https://onia.com.bo/terminos</loc>` · `existe.png`\n', tmp);
  ok(!r.problemas.length, 'una etiqueta XML no es una ruta');
  // Su reciproco: sin las etiquetas, una ruta inexistente se sigue verificando.
  r = revisarCola('## Ahora\n- [ ] Ver `carpeta/loc-no-esta.png`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'la carve-out de XML no tapa otras rutas');

  // (6c) Un TIPO MIME tampoco: es la respuesta de un `curl -I`, no un archivo. Medido el
  // 2026-09-06: el item del favicon (linea 1856) pegaba su Content-Type y salia fantasma.
  r = revisarCola('## Ahora\n- [ ] Devolvia `image/x-icon` y `text/html` · `existe.png`\n', tmp);
  ok(!r.problemas.length, 'un tipo MIME no es una ruta');
  // Su reciproco, que es lo que mantiene angosto el recorte: un archivo DENTRO de una carpeta
  // que se llame igual que un tipo MIME lleva extension, y se sigue verificando.
  r = revisarCola('## Ahora\n- [ ] Ver `image/no-esta.png`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'la carve-out de MIME no tapa un archivo con extension');

  // (6d) Una ZONA (carpeta con barra final) SI se verifica, como carpeta y no como archivo: la
  // cola escribe "las dos siguen en `app/servicios/`" para decir donde vive un problema.
  // Medido el 2026-09-06: `app/servicios/` y `app/(sitio)/` salian fantasma sobre carpetas que
  // existen bajo `web-factory/apps/onia-platform/src/`.
  r = revisarCola('## Ahora\n- [ ] Viven en `sub/`\n', tmp);
  ok(!r.problemas.length, 'una carpeta que existe cuenta como evidencia');
  // Su reciproco, sin el cual esto seria un "ignorar todo lo que termine en barra", que es
  // exactamente como se afloja un gate sin darse cuenta.
  r = revisarCola('## Ahora\n- [ ] Viven en `carpeta-inventada/`\n', tmp);
  ok(r.problemas.some((p) => p.regla === 'fantasma'), 'una carpeta inventada sigue siendo fantasma');

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
  // Su reciproco 3: sin barra SI resuelve, pero solo si el nombre es unico en el arbol —
  // corregido el 2026-09-03 junto con el caso de `unico-nombre.tsx` de mas arriba, que es donde
  // esta el razonamiento completo. `og.tsx` existe una sola vez en este fixture.
  r = revisarCola('## Ahora\n- [ ] Ver `og.tsx`\n', tmpSufijo);
  ok(!r.problemas.length, 'sin barra resuelve cuando el nombre es unico');

  // Y su limite: en cuanto el mismo nombre aparece DOS veces deja de ser resoluble, y entonces
  // manda el filtro de ambiguedad — ni evidencia ni error, nunca un fantasma sobre algo que el
  // gate decidio no buscar. Es la frontera exacta de lo que se afloja.
  fs.mkdirSync(path.join(tmpSufijo, 'app', '(otro)'), { recursive: true });
  fs.writeFileSync(path.join(tmpSufijo, 'app', '(otro)', 'og.tsx'), 'x');
  const tmpAmbiguo = fs.mkdtempSync(path.join(require('os').tmpdir(), 'cola-ambiguo-'));
  fs.cpSync(tmpSufijo, tmpAmbiguo, { recursive: true });
  r = revisarCola('## Ahora\n- [ ] Ver `og.tsx`\n', tmpAmbiguo);
  ok(!r.problemas.some((p) => p.regla === 'fantasma'), 'con dos copias el nombre suelto no es fantasma');
  ok(r.problemas.some((p) => p.regla === 'sin-evidencia'), 'con dos copias tampoco es evidencia');

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
  //
  // El fixture NO puede ser un sha real de la cola: hasta el 2026-09-07 era `6d8b6b7`, y el dia
  // que ese sha entro a SHAS_SIN_REPO_A_PROPOSITO —donde ya estaban sus tres hermanos— este caso
  // se cayo. El self-check hizo su trabajo, pero el modo de falla peligroso es el otro: un
  // fixture que comparte valor con la lista blanca queda absuelto por ella y el caso pasa en
  // VERDE sin medir nada. Por eso va un sha imposible y su guarda debajo.
  // El fixture tiene que cumplir las TRES condiciones del extractor (linea 99): hex, con al
  // menos un digito Y al menos una letra a-f. Probados y descartados en esta misma vuelta:
  // `f1x7ure` (tiene x, u, r: no es hex) y `deadbee` (hex, pero sin un solo digito, que es la
  // guarda que evita tomar una palabra inglesa por un sha). Los dos hacian fallar el caso por
  // "no es un sha" en vez de por la regla — rojo por el motivo equivocado, que no mide nada.
  const SHA_FIXTURE = '0ddbeef';
  ok(!SHAS_SIN_REPO_A_PROPOSITO.has(SHA_FIXTURE),
    'el sha de prueba no puede estar en la lista de excepciones: la lista lo absolveria y el caso pasaria sin medir');
  r = revisarCola(conSha(SHA_FIXTURE), tmp, gitFalso([]));
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

  // --- Un RECUENTO no es una ruta, aunque lleve barra ---
  // La barra bastaba para declarar ruta, y el recuento de un self-check se escribe `100/106`:
  // el gate lo acusaba de "apunta a 100/106 y ese archivo NO existe" y salia 1. Mordio DOS
  // vueltas seguidas (2026-09-25, chatbot-cola) y las dos veces se curo reescribiendo la frase
  // — la instancia, no la clase. Es el falso rojo caro: manda a borrar de la cola justamente la
  // PRUEBA del item, que es el numero que el gate de al lado existe para exigir. Ningun archivo
  // se llama solo con digitos y barras, asi que pedir una letra en algun tramo no tapa ninguno.
  ok(evidenciaDe('self-check: `100/106` casos').rutas.length === 0,
    'un recuento `100/106` no se lee como ruta');
  ok(evidenciaDe('simulador `3/3` y widget `2/2`').rutas.length === 0,
    'tampoco los recuentos cortos del objetivo');
  // ANCLA de la otra punta: una ruta de verdad con digitos adentro sigue siendo ruta.
  ok(evidenciaDe('`hermes-content/docs/cola/plataforma-v1.md`').rutas.length === 1,
    'una ruta con cifras adentro sigue siendo ruta');
  ok(evidenciaDe('`scripts/loops/v2/correr.sh`').rutas.length === 1,
    'y un tramo de solo digitos dentro de una ruta con letras tambien');

  // --- La ruta CON el nombre del repo adelante se busca en TODOS los hermanos ---
  // Medido el 2026-09-11: `onia-platform/scripts/cron/run-onia-renewal-reminders.sh` salia
  // fantasma con el archivo vivo en el WORKTREE del carril, porque al sacar el prefijo se
  // buscaba el resto SOLO dentro del repo cuyo nombre habia matcheado — nunca en el worktree.
  // Es el falso rojo que el comentario de `REPOS_HERMANOS` ya describe, arreglado entonces solo
  // para la forma SIN prefijo: la instancia curada y la clase abierta. Y es el rojo caro, el que
  // manda a BORRAR de la cola una referencia cierta al archivo que uno acaba de escribir.
  const hnos = path.join(tmp, 'hermanos');
  const base = path.join(hnos, 'onia-hermes-carril');
  fs.mkdirSync(base, { recursive: true });
  fs.mkdirSync(path.join(hnos, 'onia-platform'), { recursive: true });           // clon, atrasado
  fs.mkdirSync(path.join(hnos, 'onia-platform-chatbot', 'scripts'), { recursive: true });
  fs.writeFileSync(path.join(hnos, 'onia-platform-chatbot', 'scripts', 'zz-solo-en-el-worktree.sh'), 'x');

  r = revisarCola('## Ahora\n- [ ] Medido · `onia-platform/scripts/zz-solo-en-el-worktree.sh` · 10 min\n', base);
  ok(!r.problemas.some((p) => p.regla === 'fantasma'),
    'una ruta con el prefijo del repo se resuelve en el WORKTREE hermano, no solo en el clon');

  // Y no afloja: si no esta en NINGUN hermano sigue siendo fantasma.
  r = revisarCola('## Ahora\n- [ ] Medido · `onia-platform/scripts/zz-no-esta-en-ningun-lado.sh` · 10 min\n', base);
  ok(r.problemas.some((p) => p.regla === 'fantasma'),
    'con el prefijo del repo, lo que no existe en ningun hermano sigue siendo fantasma');

  // --- El guardia que impide que este gate se lea como rojo cuando es el ARBOL ---
  // Se prueba en las DOS direcciones a proposito: un guardia que solo prueba el caso malo pasa
  // igual si alguien lo deja siempre encendido, y entonces el gate no mide NUNCA y sale 2 para
  // siempre — que es la forma silenciosa de apagarlo.
  ok(puedeMedir(tmp) !== null, 'desde un arbol sin el repo, el gate NO puede medir');
  ok(puedeMedir(path.resolve(__dirname, '..')) === null,
    'desde la raiz de onia-hermes SI puede medir — sin esto el gate saldria 2 siempre');

  console.log(`self-check ok: ${casos} casos`);
}

// Todo veredicto de este gate depende del ARBOL desde el que se corre: `existeEnAlgunRepo` le
// pregunta al disco por cada ruta, y sube hasta seis padres buscando el repo hermano. En un
// arbol que no ve esos archivos, la MISMA cola que aca sale verde sale con decenas de
// `fantasma` — medido el 2026-09-07 copiando `COLA.md` a un directorio pelado: 0 errores acá,
// rojo entero allá, sin tocar una línea del documento.
//
// Eso hace que este gate NO se pueda cablear a la cadena `npm test` de la raíz: el integrador
// la corre entera antes de tocar `main`, así que un carril cuyo worktree no tenga el repo
// hermano —le pasó a `chatbot-cola` al mudarse de máquina— pondría `main` en rojo y trabaría el
// merge de los quince, por higiene de un documento y sin un solo defecto real.
//
// El patrón de la casa para esto ya existe (`rubros-vivos.mjs`, `recordatorio_cita_vivo.mjs`):
// el `--self-check` PURO va en la cadena, y la medición viva sale **2 = NO MEDIDO** cuando no
// alcanza lo que necesita. Un 2 se lee distinto de un 1: "no pude medir" nunca es "está roto".
function puedeMedir(baseDir) {
  const faltan = ['CLAUDE.md', 'hermes-content'].filter(
    (x) => !fs.existsSync(path.resolve(baseDir, x)),
  );
  return faltan.length ? faltan : null;
}

function main() {
  const a = process.argv.slice(2);
  if (a.includes('--self-check')) return selfCheck();

  const archivo = a[0];
  if (!archivo) {
    console.error('uso: node scripts/verificar_cola.js <cola.md>');
    process.exit(2);
  }

  const faltan = puedeMedir(process.cwd());
  if (faltan) {
    console.log(`NO MEDIDO: desde ${process.cwd()} no se ve el repo (falta ${faltan.join(', ')}).`);
    console.log('Todo `fantasma` de acá sería del árbol, no de la cola: se corre desde la raíz de onia-hermes.');
    process.exit(2);
  }

  const { problemas, avisos, items } = revisarCola(fs.readFileSync(archivo, 'utf8'), process.cwd());
  for (const p of problemas) console.log(`ERROR ${p.regla} [linea ${p.linea}]: ${p.msg}`);
  // Los avisos se IMPRIMEN y no cuentan para el exit: callarlos seria como esta familia de
  // gates falla abierto, y ponerlos en rojo es lo que obliga a borrar la bitacora.
  for (const a of avisos || []) console.log(`AVISO ${a.regla} [linea ${a.linea}]: ${a.msg}`);

  if (!problemas.length) console.log(`cola ok: ${items.length} items en Ahora, todos con evidencia real`);
  process.exit(problemas.length ? 1 : 0);
}

if (require.main === module) main();
module.exports = { revisarCola, itemsDeAhora, evidenciaDe, todosLosItems, tituloDe, duplicados, seccionesDuplicadas };
