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
 * El diagnóstico, puro: recibe lo medido y decide. Separado de la medición para
 * poder probar las ramas que no se pueden reproducir a pedido (git mudo, home
 * caída) sin tocar producción.
 *
 * @param {{buildIdMtimeMs: number|null, commits: Array<{sha:string,ct:number,subject:string}>|null, homeStatus: number|null}} m
 */
export function diagnosticar({ buildIdMtimeMs, commits, homeStatus }) {
  if (typeof buildIdMtimeMs !== "number") {
    return {
      codigo: NO_PUDE_MEDIR,
      varados: [],
      motivo: `no pude leer la fecha del build vivo (${BUILD_ID_VIVO}). ¿Estoy en el VPS?`,
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

  // Estricto: `next build` escribe el BUILD_ID al TERMINAR, así que un commit
  // del mismo segundo ya está adentro.
  const varados = commits.filter((c) => c.ct * 1000 > buildIdMtimeMs);

  return varados.length === 0
    ? { codigo: AL_DIA, varados, motivo: "el sitio vivo sirve todo lo que main tiene" }
    : {
        codigo: ARREGLOS_VARADOS,
        varados,
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
 * El build armado más reciente que `swap-and-verify.sh` aceptaría, o `null`.
 *
 * Se descartan los que no tienen `server.js` en vez de elegir el más nuevo a
 * ciegas: un build interrumpido deja el directorio a medias y el swap lo
 * rechaza. La fecha sale del BUILD_ID —igual que la del runtime vivo— y no del
 * nombre del directorio: el nombre lo pone quien lo creó y puede mentir.
 */
export function stagedDisponible(dir = STAGED_DIR) {
  let entradas;
  try {
    entradas = readdirSync(dir).filter((n) => n.startsWith(STAGED_PREFIX));
  } catch {
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

  return candidatos.sort((a, b) => b.mtimeMs - a.mtimeMs)[0] ?? null;
}

/** mtime del BUILD_ID vivo, en ms. `null` si no se puede leer. */
export function fechaBuildVivo(ruta = BUILD_ID_VIVO) {
  try {
    return statSync(ruta).mtimeMs;
  } catch {
    return null;
  }
}

/**
 * Commits de la zona en `origin/main` posteriores a `desdeMs`. `null` si git
 * falla — que es distinto de «no hay ninguno».
 *
 * ⚠️ El pathspec va anclado con `:/`, que es «desde la raíz del repo». Sin eso,
 * `git log -- web-factory/apps/onia-platform` lo interpreta relativo al CWD, y
 * este script vive DENTRO de esa misma carpeta: el pathspec no matchea nada,
 * salen cero commits y el gate firma «al día». Fue el primer veredicto que dio
 * al escribirlo —verde, con seis arreglos varados a la vista— o sea el mismo
 * fallo abierto que viene a cerrar, en su propia implementación.
 */
export function commitsDesde(desdeMs, zona = ZONA) {
  const r = spawnSync(
    "git",
    [
      "log",
      "--format=%H%x09%ct%x09%s",
      `--since=@${Math.floor(desdeMs / 1000)}`,
      "origin/main",
      "--",
      `:/${zona}`,
    ],
    { encoding: "utf8" },
  );
  if (r.status !== 0) return null;
  return r.stdout
    .split("\n")
    .filter(Boolean)
    .map((l) => {
      const [sha, ct, ...resto] = l.split("\t");
      return { sha: sha.slice(0, 9), ct: Number(ct), subject: resto.join("\t") };
    })
    .filter((c) => Number.isFinite(c.ct));
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

  if (r.codigo === AL_DIA) {
    console.log(`DEPLOY AL DIA — onia.com.bo sirve el build del ${cuando}, sin nada varado.`);
  } else if (r.codigo === ARREGLOS_VARADOS) {
    console.error(`ARREGLOS VARADOS — onia.com.bo sirve el build del ${cuando}.`);
    console.error(`${r.varados.length} commit(s) de ${ZONA} en main que el cliente NO ve:\n`);
    for (const c of r.varados) console.error(`  ${c.sha}  ${c.subject}`);
    const staged = stagedDisponible();
    const s = evaluarStaged({ staged, varados: r.varados });
    console.error(
      "\nPublicar onia.com.bo lo decide Sergio. El pedido va COMENTADO en la tarea de deploy" +
        "\nque ya existe (una sola, no una por commit).\n",
    );

    if (s.estado === STAGED_CUBRE) {
      console.error(`Build ya armado que SÍ los trae (${s.motivo}):\n`);
      console.error(`  bash /opt/onia-landing/_deploy/swap-and-verify.sh ${staged.ruta}`);
      console.error(`  BUILD_ID staged ${staged.buildId} — el vivo es otro (${cuando})`);
      console.error(
        "\nLa ruta se derivó recién, no se copió de otra vuelta: los staged se borran" +
          "\nunos a otros y un comando pegado ayer apunta a una carpeta que ya no existe.",
      );
    } else if (s.estado === STAGED_VIEJO) {
      console.error(`NO publicar el build que hay armado — ${s.motivo}:\n`);
      for (const c of s.faltan) console.error(`  queda afuera  ${c.sha}  ${c.subject}`);
      console.error("\nHay que rearmarlo desde main:  bash /opt/onia-landing/_deploy/build-and-stage.sh");
    } else {
      console.error(`${s.motivo}. Hay que armarlo desde main antes de pedir el swap:`);
      console.error("  bash /opt/onia-landing/_deploy/build-and-stage.sh");
    }
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
