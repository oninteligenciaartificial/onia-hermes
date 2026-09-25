#!/usr/bin/env node
/**
 * ¿Lo que arreglamos llegó al cliente?
 *
 * POR QUÉ EXISTE — y es un defecto del INSTRUMENTO de este carril, no del sitio.
 * El objetivo del loop se mide con cuatro números y el cuarto es «el favicon en
 * 200», declarado ahí mismo como *termómetro del deploy*. El 2026-09-04 los
 * cuatro dieron verde —prohibidos 0, precios fuera de fuente 0, CTA rotos 0,
 * favicon 200— con SEIS arreglos ya mergeados a `main` que el sitio vivo no
 * servía. Entre ellos, los nueve botones «Creá tu cuenta» abriendo otra página
 * de venta en vez del registro: el defecto más caro del sitio, en el último
 * clic, arreglado y sin llegar a nadie.
 *
 * El favicon no puede detectar eso. Una vez que un deploy lo trae, da 200 para
 * siempre: queda clavado en verde y firma «el deploy está al día» sobre un
 * build de ocho horas. Es la misma familia que este carril ya cazó tres veces
 * —el gate que saca sus sujetos de una lista de inclusión, el que prohíbe un
 * literal en un solo orden de palabras, el que lo busca sólo en su forma
 * cómoda—: el patrón era correcto y el sujeto estaba mal elegido.
 *
 * QUÉ MIDE, y por qué así. La pregunta no es «¿hubo algún deploy?» sino «¿hay
 * trabajo mío que el cliente todavía no ve?». Eso se contesta con una resta:
 * los commits de la zona en `origin/main` que son POSTERIORES al build que
 * corre. Es genérica a propósito —no una lista de arreglos a mano— para que un
 * cambio futuro nazca vigilado en vez de haber que acordarse de agregarlo.
 *
 * La fecha del build vivo sale del mtime del BUILD_ID, que `next build` escribe
 * al terminar. NO se usa `docker inspect --format {{.Created}}`: el swap
 * reemplaza el runtime y REINICIA, no recrea, así que `Created` queda anclado
 * al día que se levantó el contenedor y se aleja del último commit para siempre
 * aunque el deploy esté al día — un falso positivo que hace pedir deploys
 * inventados, y a Sergio le llegan igual que los reales.
 *
 * CÓMO NO FALLA EN VERDE. Cada rama que no puede medir sale por NO_PUDE_MEDIR,
 * nunca por AL_DIA: sin BUILD_ID legible, sin respuesta de git, o con la home
 * caída. Un `git log` vacío tiene dos causas opuestas —no hay nada varado, o el
 * comando falló— y confundirlas es exactamente como esta familia se rinde en
 * verde; por eso `[]` es un dato y `null` es la ausencia de dato.
 *
 * NO se cuelga de `prebuild`: necesita red, el disco del VPS y producción en
 * pie, igual que `mirar-venta.mjs`, `enlaces-vivos.mjs` y `precios-vivos.mjs`.
 * Atarlo al build encadenaría el deploy a que el sitio ya esté arriba. Se corre
 * cada vuelta del loop.
 *
 * Uso:
 *   node scripts/deploy-vivo.mjs
 *   node scripts/deploy-vivo.mjs --json
 */
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

/** El sitio vivo ya sirve todo lo que `main` tiene de esta zona. */
export const AL_DIA = 0;
/** Hay arreglos mergeados que el cliente no ve. Falta desplegar. */
export const ARREGLOS_VARADOS = 1;
/** No se pudo medir. Nunca es verde: un gate que no corrió no es un gate que pasó. */
export const NO_PUDE_MEDIR = 2;

/**
 * La zona del carril, entera y en una sola línea.
 *
 * Se declara como constante y `deploy-vivo.test.ts` la ancla a propósito: la
 * tentación es acotarla a las subcarpetas «que importan», y ahí es donde esta
 * familia de gates falla abierto. Un archivo nuevo tiene que nacer cubierto.
 */
export const ZONA = "web-factory/apps/onia-platform";

/** El BUILD_ID del runtime que sirve onia.com.bo (contenedor onia-landing, no Vercel). */
export const BUILD_ID_VIVO =
  "/opt/onia-landing/runtime-next/apps/onia-platform/.next/BUILD_ID";

/**
 * Dónde vive el sitio cuando no vive en esta máquina.
 *
 * POR QUÉ. Este carril dejó de correr sólo en el VPS: el 2026-09-04 pasó a
 * correr también en el nodo de casa (WSL), donde `/opt/onia-landing` no existe.
 * El gate salía por «no pude leer la fecha del build vivo. ¿Estoy en el VPS?»
 * en su PRIMERA línea, sin llegar a preguntarle nada a git — y con eso el único
 * instrumento capaz de ver un deploy varado dejó de producir veredicto durante
 * dos vueltas, mientras veinte arreglos ya en `main` no llegaban al cliente.
 *
 * Dónde está montado el disco es una circunstancia de la máquina, no una
 * propiedad del sitio: el gate pregunta local primero y por SSH después.
 */
export const VPS_SSH = process.env.ONIA_VPS_SSH ?? "root@187.77.16.63";

/** Sin `BatchMode` un SSH sin llave se cuelga pidiendo contraseña y el cron muere por timeout. */
const SSH_ARGS = ["-o", "BatchMode=yes", "-o", "ConnectTimeout=8", "-o", "StrictHostKeyChecking=accept-new"];

/** Donde el runbook de la casa deja los builds ya armados, sin tocar producción. */
export const STAGED_DIR = "/opt/onia-landing";
export const STAGED_PREFIX = "runtime-next.new-";

/**
 * El archivo que `swap-and-verify.sh` exige para aceptar una ruta: si no está,
 * corta con `ERR: bad STAGE path` y exit 1 sin tocar producción.
 *
 * Se comprueba lo MISMO que comprueba el script, a propósito. Ofrecer una ruta
 * que el swap va a rechazar no es un error inofensivo: el pedido queda escrito
 * en la tarea que mira Sergio, él corre el comando, ve un error y el deploy no
 * pasa. Es un fallo que se disfraza de pedido atendido.
 */
export const STAGED_MARCA = "apps/onia-platform/server.js";

/** Hay un build armado que ya contiene todos los arreglos varados. */
export const STAGED_CUBRE = "CUBRE";
/** Hay un build armado, pero es ANTERIOR a algún arreglo: publicarlo lo dejaría afuera. */
export const STAGED_VIEJO = "VIEJO";
/** No hay ningún build armado utilizable: hay que correr build-and-stage.sh. */
export const STAGED_NINGUNO = "NINGUNO";

/**
 * Lo que Next NUNCA empaqueta: por más que cambie, el navegador de un lead ve
 * exactamente lo mismo antes y después de publicar.
 *
 * Es una lista de EXCLUSIÓN corta y nombrada, no una lista de inclusión de «lo
 * que sí viaja», y la diferencia es la que decide el sesgo del gate: un archivo
 * de una clase que nadie previó cuenta como que viaja, así que el error posible
 * es pedir un deploy de más —barato— y nunca declarar al día un sitio que no lo
 * está.
 */
export const NO_LLEGA_AL_CLIENTE = [
  /(^|\/)scripts\//,
  /(^|\/)__tests__\//,
  /\.test\.[cm]?[jt]sx?$/,
  /(^|\/)vitest\.config\.[cm]?[jt]s$/,
];

/**
 * ¿Este commit puede cambiar algo de lo que ve un lead?
 *
 * Basta UN archivo que viaje. Exigir que viajen todos dejaría pasar un arreglo
 * real escondido entre tests, que es el fallo abierto de siempre; y una lista
 * ausente o vacía es ausencia de dato —`git log --name-only` pudo no
 * contestar—, así que se responde que sí. La misma regla que separa `[]` de
 * `null` en el resto de este archivo.
 *
 * @param {string[]|undefined|null} archivos
 */
export function llegaAlCliente(archivos) {
  if (!Array.isArray(archivos) || archivos.length === 0) return true;
  return archivos.some((f) => !NO_LLEGA_AL_CLIENTE.some((re) => re.test(f)));
}

/**
 * El diagnóstico, puro: recibe lo medido y decide. Separado de la medición para
 * poder probar las ramas que no se pueden reproducir a pedido (git mudo, home
 * caída) sin tocar producción.
 *
 * @param {{buildIdMtimeMs: number|null, commits: Array<{sha:string,ct:number,subject:string,archivos?:string[]}>|null, homeStatus: number|null}} m
 */
export function diagnosticar({ buildIdMtimeMs, commits, homeStatus }) {
  if (typeof buildIdMtimeMs !== "number") {
    return {
      codigo: NO_PUDE_MEDIR,
      varados: [],
      motivo:
        `no pude leer la fecha del build vivo (${BUILD_ID_VIVO}), ni en este disco` +
        ` ni por SSH a ${VPS_SSH}. Sin eso no sé qué está publicado: NO es «al día».`,
    };
  }
  if (!Array.isArray(commits)) {
    return {
      codigo: NO_PUDE_MEDIR,
      varados: [],
      motivo: "git no contestó: no sé si hay commits varados o si falló el comando",
    };
  }
  if (homeStatus !== 200) {
    return {
      codigo: NO_PUDE_MEDIR,
      varados: [],
      motivo: `onia.com.bo contestó ${homeStatus ?? "nada"}: no puedo afirmar nada del sitio vivo`,
    };
  }

  // ⚠️ Acá vivía una SEGUNDA copia del filtro por fecha
  // (`commits.filter(c => c.ct * 1000 > buildIdMtimeMs)`), y por eso arreglar
  // `commitsDesde` no alcanzó: el conjunto llegaba entero y se volvía a perder
  // acá mismo. Medido el 2026-09-17 — con la cura puesta, `commitsDesde` ya
  // devolvía los 3 commits y esta línea los dejaba en 0 varados, con el
  // publicador firmando «al día» igual que antes.
  //
  // Quién decide QUÉ entra es `commitsDesde`, que lo acota por ancestría
  // (`base..origin/main`). Re-filtrar por fecha acá es preguntar de nuevo lo
  // que ya se contestó bien, con el instrumento que se contestaba mal.
  const posteriores = commits;
  // De esos, sólo los que un lead podría notar. Un commit al instrumento del
  // carril es trabajo real, pero publicarlo no le cambia la pantalla a nadie:
  // contarlo invalidaba el build armado en cada vuelta y el deploy no salía
  // nunca (medido el 2026-09-04, tres pedidos vencidos el mismo día).
  const varados = posteriores.filter((c) => llegaAlCliente(c.archivos));
  const soloHerramientas = posteriores.length - varados.length;

  return varados.length === 0
    ? {
        codigo: AL_DIA,
        varados,
        soloHerramientas,
        motivo: "el sitio vivo sirve todo lo que main tiene",
      }
    : {
        codigo: ARREGLOS_VARADOS,
        varados,
        soloHerramientas,
        motivo: `${varados.length} arreglo(s) en main que el cliente no ve`,
      };
}

/**
 * ¿El build ya armado en disco sirve para publicar lo que está varado?
 *
 * POR QUÉ EXISTE. Hasta hoy este script decía «6 arreglos varados» y mandaba a
 * buscar la ruta a mano (`ls -dt …runtime-next.new-*`). Ese paso manual falló
 * TRES veces el 2026-09-04 sobre la misma tarea de deploy: a las 12:40 el
 * staged traía viva la etiqueta «Facturación SIAT» que el commit siguiente ya
 * había sacado; a las 16:38 se escribió el comando bueno y para las 20:55 esa
 * carpeta ya no existía —borrada por el build siguiente—, así que la tarea le
 * pedía a Sergio un comando que sólo podía darle un error. Un pedido de deploy
 * que no se puede ejecutar se lee igual que uno pendiente de decisión: nadie
 * mira si la ruta sigue viva, y el arreglo no llega al cliente ningún día.
 *
 * La ruta se DERIVA cada vez que corre el gate, nunca se copia. Es la misma
 * lección que este carril ya pagó con las capturas por variante: una ruta
 * escrita a mano sigue resolviendo mucho después de que dejó de ser cierta.
 *
 * Puro: recibe lo medido y decide, para poder probar las tres ramas sin
 * depender de qué haya en `/opt` hoy.
 *
 * @param {{staged: {ruta:string, buildId:string|null, mtimeMs:number}|null,
 *          varados: Array<{sha:string, ct:number, subject:string}>}} m
 */
export function evaluarStaged({ staged, varados }) {
  if (!staged) {
    return {
      estado: STAGED_NINGUNO,
      faltan: varados,
      motivo: "no hay ningún build armado en disco que el swap acepte",
    };
  }

  // Mismo criterio que `diagnosticar`: `next build` escribe el BUILD_ID al
  // TERMINAR, así que un commit del mismo segundo ya entró.
  const faltan = varados.filter((c) => c.ct * 1000 > staged.mtimeMs);

  return faltan.length === 0
    ? {
        estado: STAGED_CUBRE,
        faltan,
        motivo: `el build armado contiene los ${varados.length} arreglo(s)`,
      }
    : {
        estado: STAGED_VIEJO,
        faltan,
        motivo: `el build armado es anterior a ${faltan.length} arreglo(s): publicarlo los dejaría afuera`,
      };
}

/**
 * El comando que se pega en la tarea de deploy. UNO, sin argumentos.
 *
 * POR QUÉ NO NOMBRA LA CARPETA. El runbook de la casa es
 * `swap-and-verify.sh <ruta-staged>`, y esa ruta lleva timestamp
 * (`runtime-next.new-20260905023618`). Quien pide el deploy la mide, la escribe
 * en la tarea, y ahí se queda quieta — mientras el build siguiente BORRA esa
 * carpeta. Cuando Sergio contesta «ok», el swap corta con `ERR: bad STAGE path`
 * y no publica nada, ningún día.
 *
 * Y el fallo se disfraza de decisión pendiente: la tarea se lee como «espera el
 * OK de Sergio» cuando ya es inejecutable, así que nadie mira la ruta. Medido
 * sobre t_cb722b7e, que envejeció TRES veces el 2026-09-04 (12:40 el staged
 * traía viva una etiqueta ya sacada; 16:41 corregido; 20:55 la carpeta ya no
 * existía). Derivar la ruta «recién» no salva: caduca entre que se escribe y
 * que Sergio contesta, que es justo el rato que el pedido pasa esperando.
 *
 * `publicar.sh` mide, arma si hace falta y publica, así que sirve igual en las
 * TRES ramas (cubre / viejo / ninguno) y no puede quedar viejo.
 */
export const COMANDO_PUBLICAR = "bash /opt/onia-landing/_deploy/publicar.sh";

/**
 * El build armado más reciente que `swap-and-verify.sh` aceptaría, o `null`.
 *
 * Se descartan los que no tienen `server.js` en vez de elegir el más nuevo a
 * ciegas: un build interrumpido deja el directorio a medias y el swap lo
 * rechaza. La fecha sale del BUILD_ID —igual que la del runtime vivo— y no del
 * nombre del directorio: el nombre lo pone quien lo creó y puede mentir.
 */
export function stagedLocal(dir = STAGED_DIR) {
  let entradas;
  try {
    entradas = readdirSync(dir).filter((n) => n.startsWith(STAGED_PREFIX));
  } catch {
    // El directorio no existe acá. Es «no pude preguntar», no «no hay ninguno».
    return null;
  }

  const candidatos = [];
  for (const nombre of entradas) {
    const ruta = join(dir, nombre);
    try {
      statSync(join(ruta, STAGED_MARCA));
      const buildIdPath = join(ruta, "apps/onia-platform/.next/BUILD_ID");
      candidatos.push({
        ruta,
        mtimeMs: statSync(buildIdPath).mtimeMs,
        buildId: readFileSync(buildIdPath, "utf8").trim(),
      });
    } catch {
      // Incompleto o ilegible: el swap lo rechazaría, así que no se ofrece.
    }
  }

  return candidatos;
}

/**
 * La respuesta del VPS, parseada. Aparte de la red para poder probarla.
 *
 * Una línea a la que le falta un campo es un directorio del que no sabemos la
 * fecha o el BUILD_ID: se descarta en vez de ofrecerse, igual que la rama local
 * descarta el build sin `server.js`. Ofrecer una ruta que el swap va a rechazar
 * es un fallo que se disfraza de pedido atendido.
 *
 * @param {string} stdout
 */
export function parsearStagedRemoto(stdout) {
  const candidatos = [];
  for (const linea of String(stdout).split("\n")) {
    if (!linea.trim()) continue;
    const [ruta, epoch, buildId] = linea.split("\t");
    const seg = Number(epoch);
    if (!ruta?.trim() || !buildId?.trim() || !Number.isFinite(seg) || seg <= 0) continue;
    candidatos.push({ ruta: ruta.trim(), mtimeMs: seg * 1000, buildId: buildId.trim() });
  }
  return candidatos.sort((a, b) => b.mtimeMs - a.mtimeMs);
}

/**
 * Lo mismo que `stagedLocal`, preguntado por SSH. `null` si el SSH no contestó.
 *
 * Se comprueban en el VPS exactamente las mismas dos cosas que comprueba la
 * rama local —el `server.js` que exige el swap y un BUILD_ID legible— para que
 * el veredicto no dependa de desde dónde se miró.
 */
export function stagedPorSsh(dir = STAGED_DIR, destino = VPS_SSH) {
  const guion =
    `for d in ${dir}/${STAGED_PREFIX}*/; do ` +
    `[ -f "\${d}${STAGED_MARCA}" ] || continue; ` +
    `b="\${d}apps/onia-platform/.next/BUILD_ID"; ` +
    `[ -f "$b" ] || continue; ` +
    `printf '%s\\t%s\\t%s\\n' "\${d%/}" "$(stat -c %Y "$b")" "$(cat "$b")"; ` +
    `done`;
  const r = spawnSync("ssh", [...SSH_ARGS, destino, guion], { encoding: "utf8" });
  if (r.status !== 0) return null;
  return parsearStagedRemoto(r.stdout);
}

/**
 * El build armado más reciente que `swap-and-verify.sh` aceptaría, o `null`.
 *
 * Se busca en el MISMO disco donde se encontró el runtime vivo. Medir el
 * runtime por SSH y el staged en el disco local diría «no hay ningún build
 * armado» sobre una máquina donde sí lo hay, y mandaría a rearmar uno que ya
 * existe: un pedido de deploy inventado, que a Sergio le llega igual que los
 * reales.
 */
export function stagedDisponible(dir = STAGED_DIR, { local = stagedLocal, remoto = stagedPorSsh } = {}) {
  const candidatos = local(dir) ?? remoto(dir);
  if (!Array.isArray(candidatos)) return null;
  return candidatos.slice().sort((a, b) => b.mtimeMs - a.mtimeMs)[0] ?? null;
}

/** mtime del BUILD_ID vivo en este disco, en ms. `null` si no está montado acá. */
export function mtimeLocal(ruta = BUILD_ID_VIVO) {
  try {
    return statSync(ruta).mtimeMs;
  } catch {
    return null;
  }
}

/** Lo mismo, preguntado al VPS. `null` si el SSH no contestó. */
export function mtimePorSsh(ruta = BUILD_ID_VIVO, destino = VPS_SSH) {
  const r = spawnSync("ssh", [...SSH_ARGS, destino, "stat", "-c", "%Y", ruta], {
    encoding: "utf8",
  });
  if (r.status !== 0) return null;
  const seg = Number(r.stdout.trim());
  return Number.isFinite(seg) && seg > 0 ? seg * 1000 : null;
}

/** El log del publicador automatico del VPS (`onia-publicar-solo.sh`, cada 3 h). */
export const LOG_PUBLICADOR_SOLO = "/var/log/onia-publicar-solo.log";

/**
 * Que dijo de la LANDING la ultima corrida del publicador automatico.
 *
 * POR QUE EXISTE. Sin esto, cualquier arreglo varado hacia que el gate mandara
 * abrir un pedido de deploy — y el pedido le cuesta un `ok` a Sergio Urcullo por
 * algo que la maquina hace sola. El publicador publica la landing salvo que el
 * commit toque una fuente de precio (esas quedan detras de firma humana), asi
 * que el pedido solo hace falta cuando el destino esta FRENADO.
 *
 * Devuelve `null` —NO MEDIDO, nunca «publica solo»— si el log no se pudo leer o
 * si ninguna corrida nombra la landing: confundir «no pude preguntar» con «me
 * dijeron que si» es como se pierde un arreglo esperando un cron que no viene.
 */
export function ultimaCorridaDeLanding(texto) {
  if (!texto) return null;
  let cuando = null;
  let ultima = null;
  for (const linea of texto.split("\n")) {
    const cabecera = linea.match(/^==\s*(.+?)\s*==\s*$/);
    if (cabecera) {
      cuando = cabecera[1];
      continue;
    }
    const landing = linea.match(/^\s*landing:\s*(.+?)\s*$/);
    if (landing) ultima = { cuando, motivo: landing[1] };
  }
  if (!ultima) return null;
  return { ...ultima, publicaSolo: !/^NO publico solo/i.test(ultima.motivo) };
}

/** El log del publicador, leido de este disco o preguntado al VPS. `null` si ninguno contesto. */
export function textoDelLogPublicador(ruta = LOG_PUBLICADOR_SOLO, destino = VPS_SSH) {
  try {
    return readFileSync(ruta, "utf8");
  } catch {
    /* no esta montado aca: se pregunta al VPS */
  }
  const r = spawnSync("ssh", [...SSH_ARGS, destino, "tail", "-n", "60", ruta], {
    encoding: "utf8",
  });
  return r.status === 0 && r.stdout.trim() ? r.stdout : null;
}

/**
 * mtime del BUILD_ID vivo, en ms, venga de donde venga. `null` si ninguna de
 * las dos vías contestó — que sigue siendo ausencia de dato, nunca «al día».
 *
 * El disco local manda siempre que conteste: en el VPS salir a la red sería más
 * lento y podría no estar configurado.
 */
export function fechaBuildVivo(ruta = BUILD_ID_VIVO, { local = mtimeLocal, remoto = mtimePorSsh } = {}) {
  return local(ruta) ?? remoto(ruta);
}

/**
 * El punto de `main` por el que pasó el build vivo: el commit más nuevo de la
 * cadena `--first-parent` con fecha ≤ la del build.
 *
 * Devuelve `{ sha }` si lo encontró · `{ sha: null }` si NINGÚN commit de `ref`
 * es anterior al build (todo `ref` está varado) · `null` si git no contestó,
 * que es «no pude medir» y nunca «no hay nada».
 *
 * ⚠️ Por qué `--first-parent` y no las fechas de todos los commits: la fecha de
 * un commit es CUÁNDO SE ESCRIBIÓ, no cuándo entró a `main`. Un commit de una
 * rama de carril es siempre anterior al merge que lo trae. La cadena
 * first-parent, en cambio, son los puntos por los que `main` realmente pasó —
 * cada merge lleva la fecha en que se integró—, así que sí es monótona respecto
 * de la entrada. La fecha se usa UNA vez, para elegir este punto; de ahí en
 * adelante manda el grafo.
 *
 * ⚠️ `cwd` se declara acá aunque producción nunca lo pase: es la costura por la
 * que los casos siembran un repo temporal con la topología que cada uno
 * necesita. Un parámetro que el runtime acepta y el tipo no declara compila en
 * `.mjs` y rompe en el `.test.ts` que lo usa — y ese rojo no lo ve la cadena
 * `npm test`, sólo el `prebuild` del publicador, que se niega a publicar sin
 * escalarle a nadie. Pasó el 2026-09-17: la landing quedó sin publicar.
 *
 * @param {number} desdeMs
 * @param {{cwd?: string, ref?: string}} [opciones]
 */
export function baseDelBuild(desdeMs, { cwd, ref = "origin/main" } = {}) {
  const r = spawnSync("git", ["log", "--first-parent", "--format=%H%x09%ct", ref], {
    encoding: "utf8",
    cwd,
  });
  if (r.status !== 0) return null;

  const limite = Math.floor(desdeMs / 1000);
  for (const linea of r.stdout.split("\n")) {
    if (!linea) continue;
    const [sha, ct] = linea.split("\t");
    if (Number.isFinite(Number(ct)) && Number(ct) <= limite) return { sha };
  }
  return { sha: null };
}

/**
 * Commits de la zona que `origin/main` tiene y el build vivo NO. `null` si git
 * falla — que es distinto de «no hay ninguno».
 *
 * ⚠️ Acá decía «posteriores a `desdeMs`» y se medía con `--since`. Eso perdía
 * el sujeto en silencio y para siempre; el suceso y la cura están contados en
 * el caso «un arreglo que entra a main por un merge posterior al build NO se
 * pierde» de `deploy-vivo.test.ts`. En una línea: un commit de rama tiene fecha
 * anterior al merge que lo trae, así que `--since` lo descartaba por viejo y
 * `--no-merges` descartaba al merge que lo hacía visible. La pregunta correcta
 * no es «¿qué hay más nuevo que el build?» sino «¿qué tiene `main` que el build
 * no contiene?».
 *
 * ⚠️ El pathspec va anclado con `:/`, que es «desde la raíz del repo». Sin eso,
 * `git log -- web-factory/apps/onia-platform` lo interpreta relativo al CWD, y
 * este script vive DENTRO de esa misma carpeta: el pathspec no matchea nada,
 * salen cero commits y el gate firma «al día». Fue el primer veredicto que dio
 * al escribirlo —verde, con seis arreglos varados a la vista— o sea el mismo
 * fallo abierto que viene a cerrar, en su propia implementación.
 *
 * ⚠️ `--no-merges` no es cosmético: sin él el conteo salía 16 % inflado (43
 * commits, 7 merges, medido el 2026-09-06), y ese número es el que Sergio
 * Urcullo lee en el pedido de deploy. Un merge duplica el arreglo que ya se
 * contó por su commit propio.
 *
 * Y el filtro va ACÁ y no en `llegaAlCliente` a propósito: `git log --name-only`
 * no lista los archivos de un merge, así que los merges llegaban con
 * `archivos: []` y caían en el «ante la duda, sí viaja» —que es el sesgo
 * correcto para un commit normal y hay que conservar—. Se los saca del conjunto
 * antes de clasificar, en vez de enseñarle a `llegaAlCliente` a fallar cerrado.
 *
 * @param {number} desdeMs
 * @param {string} [zona]
 * @param {{cwd?: string, ref?: string}} [opciones] la misma costura de
 *   `baseDelBuild`: sólo la usan los casos, y va declarada por el mismo motivo.
 */
export function commitsDesde(desdeMs, zona = ZONA, { cwd, ref = "origin/main" } = {}) {
  const base = baseDelBuild(desdeMs, { cwd, ref });
  if (base === null) return null;

  const r = spawnSync(
    "git",
    [
      "log",
      // El NUL abre cada cabecera. Es el único byte que no puede aparecer en el
      // asunto de un commit ni en un nombre de archivo, así que distinguir
      // cabecera de archivo no depende de adivinar el formato de git.
      "--format=%x00%H%x09%ct%x09%s",
      "--name-only",
      "--no-merges",
      // Ancestría, NO fecha: `base..ref` es «lo que ref tiene y el build no».
      base.sha ? `${base.sha}..${ref}` : ref,
      "--",
      `:/${zona}`,
    ],
    { encoding: "utf8", cwd },
  );
  if (r.status !== 0) return null;

  const commits = [];
  for (const linea of r.stdout.split("\n")) {
    if (linea.startsWith("\0")) {
      const [sha, ct, ...resto] = linea.slice(1).split("\t");
      commits.push({
        sha: sha.slice(0, 9),
        ct: Number(ct),
        subject: resto.join("\t"),
        archivos: [],
      });
    } else if (linea && commits.length > 0) {
      // Con pathspec, `--name-only` sólo lista los archivos de la zona: es
      // exactamente el conjunto sobre el que hay que decidir si viaja.
      commits[commits.length - 1].archivos.push(linea);
    }
  }
  return commits.filter((c) => Number.isFinite(c.ct));
}

/** Código HTTP de la home. `null` si no contestó. */
export function estadoHome(url = "https://onia.com.bo/") {
  const r = spawnSync(
    "curl",
    ["-s", "-o", "/dev/null", "-w", "%{http_code}", "-L", "--max-time", "20", url],
    { encoding: "utf8" },
  );
  if (r.status !== 0) return null;
  const n = Number(r.stdout.trim());
  return Number.isFinite(n) && n > 0 ? n : null;
}

function main() {
  const buildIdMtimeMs = fechaBuildVivo();
  const medicion = {
    buildIdMtimeMs,
    commits: typeof buildIdMtimeMs === "number" ? commitsDesde(buildIdMtimeMs) : null,
    homeStatus: estadoHome(),
  };
  const r = diagnosticar(medicion);

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify({ ...r, buildIdMtimeMs }, null, 2));
    process.exit(r.codigo);
  }

  const cuando =
    typeof buildIdMtimeMs === "number"
      ? new Date(buildIdMtimeMs).toISOString().replace("T", " ").slice(0, 16) + " UTC"
      : "?";

  // Se nombra siempre, en las dos ramas: si no, el conteo del gate no cuadra
  // con el de `git log` y el que audita concluye que el gate se comió commits.
  const nota =
    r.soloHerramientas > 0
      ? `\n(${r.soloHerramientas} commit(s) más de la zona tocan sólo herramientas` +
        " —scripts y tests—, que no viajan al navegador: no piden deploy.)"
      : "";

  if (r.codigo === AL_DIA) {
    console.log(
      `DEPLOY AL DIA — onia.com.bo sirve el build del ${cuando}, sin nada varado.${nota}`,
    );
  } else if (r.codigo === ARREGLOS_VARADOS) {
    console.error(`ARREGLOS VARADOS — onia.com.bo sirve el build del ${cuando}.`);
    console.error(`${r.varados.length} commit(s) de ${ZONA} en main que el cliente NO ve:\n`);
    for (const c of r.varados) console.error(`  ${c.sha}  ${c.subject}`);
    if (nota) console.error(nota);
    const staged = stagedDisponible();
    const s = evaluarStaged({ staged, varados: r.varados });
    // Antes de mandar a pedir un `ok`, se pregunta si el publicador automatico
    // ya lo resuelve. Un pedido que no hace falta le cuesta a Sergio Urcullo lo
    // mismo que uno que si: leerlo y contestarlo.
    const corrida = ultimaCorridaDeLanding(textoDelLogPublicador());
    if (corrida === null) {
      console.error(
        `\nNO PUDE MEDIR si el publicador automatico lo resuelve solo (${LOG_PUBLICADOR_SOLO}` +
          "\nno contesto). Miralo ANTES de abrir un pedido: si la landing no esta frenada," +
          "\nsale sola en la proxima corrida y el pedido sobra.\n",
      );
    } else if (corrida.publicaSolo) {
      console.error(
        `\nNO abras un pedido de deploy: el publicador automatico publica la landing solo` +
          `\n(ultima corrida ${corrida.cuando} — "${corrida.motivo}"), y esto sale en la` +
          "\nproxima. El pedido solo hace falta si el destino queda FRENADO por firma humana.\n",
      );
    } else {
      console.error(
        `\nEl publicador automatico NO lo va a publicar (${corrida.cuando} — "${corrida.motivo}"),` +
          "\nasi que aca SI va el pedido: COMENTADO en la tarea de deploy que ya existe" +
          "\n(una sola, no una por commit). Publicar onia.com.bo lo decide Sergio Urcullo.\n",
      );
    }

    // El ESTADO del staged se sigue diciendo —es el diagnóstico, y sirve para
    // saber si hay que rearmar—, pero ya no se emite un comando por rama: el
    // que se pega es siempre el mismo y no nombra ninguna carpeta.
    if (s.estado === STAGED_CUBRE) {
      console.error(`Hay un build armado que SÍ los trae (${s.motivo}).`);
      console.error(`BUILD_ID staged ${staged.buildId} — el vivo es otro (${cuando}).\n`);
    } else if (s.estado === STAGED_VIEJO) {
      console.error(`El build que hay armado quedó viejo — ${s.motivo}:\n`);
      for (const c of s.faltan) console.error(`  queda afuera  ${c.sha}  ${c.subject}`);
      console.error("");
    } else {
      console.error(`${s.motivo}.\n`);
    }

    console.error(`El comando, el mismo en los tres casos (mide, arma si hace falta y publica):\n`);
    console.error(`  ${COMANDO_PUBLICAR}\n`);
    console.error(
      "No nombra la carpeta armada a propósito: los staged se borran unos a otros y" +
        "\nun pedido que la nombra ya no se puede ejecutar cuando llega el OK.",
    );
  } else {
    console.error(`NO PUDE MEDIR — ${r.motivo}`);
  }
  process.exit(r.codigo);
}

// La guarda: sin esto, importar el módulo dispara la medición (y su process.exit)
// en el proceso que lo importa. Medido el 2026-09-04 en otro gate del sistema.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
