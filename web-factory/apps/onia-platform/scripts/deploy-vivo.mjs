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
import { statSync } from "node:fs";
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
    console.error(
      "\nPublicar onia.com.bo lo decide Sergio. El pedido va COMENTADO en la tarea de deploy" +
        "\nque ya existe (una sola, no una por commit), con la ruta del staged verificada" +
        "\nADENTRO —el artefacto envejece aunque el sha siga siendo ancestro de main—:" +
        "\n  ls -dt /opt/onia-landing/runtime-next.new-*",
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
