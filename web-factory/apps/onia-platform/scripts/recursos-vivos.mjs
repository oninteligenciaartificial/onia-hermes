#!/usr/bin/env node
/**
 * ¿Lo que el material de AFUERA le manda a un lead sigue existiendo?
 *
 * `src/app/recurso-que-se-manda.test.ts` cruza el registro contra el DISCO en
 * las dos direcciones y con eso ataja el borrado y el renombre. Lo que ese gate
 * NO puede ver, y lo dice en su propio comentario, es el tercer lado: que el
 * material de afuera cambie la URL que manda. Disco y registro siguen
 * coincidiendo y pasa en verde mientras el DM entrega un 404.
 *
 * Ese cruce necesita leer `hermes-content/`, que no está en todos los worktrees
 * —sparse-checkout, o el árbol de la app copiado solo—, así que NO se cablea a
 * `npm test`: sería un rojo por AMBIENTE, y la cadena la corre el integrador
 * antes de tocar `main`, o sea que trabaría el merge de los quince carriles.
 * Va como alias suelto, y cuando no alcanza el material sale **2 = NO MEDIDO**,
 * nunca 1: un gate que no puede preguntar tiene que decirlo, no contestar que sí.
 *
 * Sujeto: sólo el material que MANDA (la «pieza»), nunca la prosa que NARRA.
 * `ONIA_AUTOMATIZACION_MENSAJES_20260818.md` cita la URL para contar que un día
 * dio 404 — exigirle que exista obligaría a reescribir la bitácora, que es como
 * esta familia de gates ya rompió el registro de lo que pasó. Por eso las
 * fuentes se nombran de a una, con su motivo.
 *
 *   node scripts/recursos-vivos.mjs           mide y compara
 *   node scripts/recursos-vivos.mjs --sin-red  sólo el cruce de texto
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * `traer` trae las DOS curas de red y por eso se fue de acá el
 * `setDefaultAutoSelectFamilyAttemptTimeout(2000)` que este archivo tenía suelto:
 *
 *  1. La que ya estaba — Node corta cada intento de conexión a los 250 ms por defecto, y en
 *     el nodo de casa la ruta IPv6 no llega: `fetch` moría con ETIMEDOUT contra un host vivo,
 *     que se lee como "el recurso está caído" — el falso rojo más caro de acá.
 *  2. La que faltaba — reintentar el parpadeo. La cura 1 sola no alcanzó: el 2026-09-27
 *     `rubros:vivos` salió NO PUDE MEDIR por un `fetch failed` sobre un host que contestaba
 *     200 en 0,93 s.
 */
import { traer } from "./red-que-parpadea.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const APP = resolve(AQUI, "..");
const SIN_RED = process.argv.includes("--sin-red");

/**
 * El registro se LEE como texto, no se importa: `node` no carga `.ts` en todas
 * las versiones donde corren los loops, y un import que falla acá se leería como
 * "no hay recursos declarados" — o sea, verde sobre el defecto.
 */
const REGISTRO = join(APP, "src", "lib", "recursos-que-se-mandan.ts");
if (!existsSync(REGISTRO)) {
  console.log(`NO MEDIDO: falta ${REGISTRO}, que es el registro de lo que se manda.`);
  process.exit(2);
}
const fuenteRegistro = readFileSync(REGISTRO, "utf8");
const CARPETA_DE_RECURSOS = (fuenteRegistro.match(
  /CARPETA_DE_RECURSOS\s*=\s*"([^"]+)"/,
) ?? [])[1];
const RECURSOS_QUE_SE_MANDAN = [
  ...fuenteRegistro.matchAll(
    /archivo:\s*"([^"]+)"[\s\S]{0,120}?palabra:\s*"([^"]*)"/g,
  ),
].map(([, archivo, palabra]) => ({ archivo, palabra }));

// Si el parseo no encuentra nada, el resto compararía conjuntos vacíos y saldría
// VERDE. Es la forma en que esta familia de gates falla abierto.
if (!CARPETA_DE_RECURSOS || RECURSOS_QUE_SE_MANDAN.length === 0) {
  console.log(
    `NO MEDIDO: no pude leer el registro (carpeta=${CARPETA_DE_RECURSOS ?? "?"}, ` +
      `recursos=${RECURSOS_QUE_SE_MANDAN.length}). Cambió el formato de ${REGISTRO}.`,
  );
  process.exit(2);
}

const PUBLICO = join(APP, "public", CARPETA_DE_RECURSOS);

/** La raíz del monorepo, subiendo hasta encontrar `hermes-content/`. */
function raizDelMonorepo() {
  let dir = APP;
  for (let i = 0; i < 8; i++) {
    if (existsSync(join(dir, "hermes-content"))) return dir;
    const padre = dirname(dir);
    if (padre === dir) break;
    dir = padre;
  }
  return null;
}

/**
 * Las fuentes que MANDAN, cada una con por qué cuenta. Se declaran de a una: un
 * `grep` de todo `hermes-content/` traería la prosa que narra el 404 histórico.
 */
const FUENTES_QUE_MANDAN = [
  {
    ruta: "hermes-content/contenido/README.md",
    porque: "declara qué entrega cada palabra clave (sección 5)",
  },
  {
    ruta: "hermes-content/docs/ONIA_CIRCUITO_COMENTARIO_DM.md",
    porque: "declara el DM de Lucía por palabra",
  },
  {
    ruta: "hermes-content/deploy/vps-ops/n8n-backup-20260820/gWrVHU8OxI9yugc4.json",
    porque: "el workflow que efectivamente manda el mensaje",
  },
];

const CITA = /onia\.com\.bo\/recursos\/([A-Za-z0-9._-]+)/g;

function noMedido(motivo) {
  console.log(`NO MEDIDO: ${motivo}`);
  process.exit(2);
}

const raiz = raizDelMonorepo();
if (!raiz) {
  noMedido(
    "no encuentro `hermes-content/` desde este árbol (worktree con sparse-checkout, " +
      "o la app copiada sola). El cruce contra el material que manda no se puede hacer acá.",
  );
}

const fuentes = FUENTES_QUE_MANDAN.map((f) => ({
  ...f,
  absoluta: join(raiz, f.ruta),
})).filter((f) => existsSync(f.absoluta));

if (fuentes.length === 0) {
  noMedido(
    `ninguna de las ${FUENTES_QUE_MANDAN.length} fuentes que mandan está en este árbol.`,
  );
}

/** archivo citado → las fuentes que lo citan */
const citados = new Map();
for (const f of fuentes) {
  const texto = readFileSync(f.absoluta, "utf8");
  for (const hallado of texto.matchAll(CITA)) {
    const archivo = hallado[1];
    if (!citados.has(archivo)) citados.set(archivo, []);
    if (!citados.get(archivo).includes(f.ruta)) citados.get(archivo).push(f.ruta);
  }
}

const enDisco = existsSync(PUBLICO)
  ? new Set(
      readdirSync(PUBLICO, { withFileTypes: true })
        .filter((e) => e.isFile() && !e.name.startsWith("."))
        .map((e) => e.name),
    )
  : new Set();
const declarados = new Set(RECURSOS_QUE_SE_MANDAN.map((r) => r.archivo));

const problemas = [];

// 1. Lo que el material manda tiene que existir. Éste es el fallo que ya pasó.
for (const [archivo, quienes] of citados) {
  if (!enDisco.has(archivo)) {
    problemas.push(
      `El material manda onia.com.bo/recursos/${archivo} y ese archivo NO está en ` +
        `public/${CARPETA_DE_RECURSOS}/. Lo citan: ${quienes.join(", ")}. ` +
        `El DM sale igual y el lead abre un 404.`,
    );
  } else if (!declarados.has(archivo)) {
    problemas.push(
      `onia.com.bo/recursos/${archivo} se manda (${quienes.join(", ")}) y no está ` +
        `declarado en src/lib/recursos-que-se-mandan.ts: nadie lo vigila.`,
    );
  }
}

// 2. Lo declarado que ya no lo manda nadie: candidato a borrar, no a mantener.
for (const r of RECURSOS_QUE_SE_MANDAN) {
  if (!citados.has(r.archivo)) {
    problemas.push(
      `AVISO: ${r.archivo} está declarado como que lo manda «${r.palabra}», y ` +
        `ninguna de las ${fuentes.length} fuentes que mandan lo cita hoy. ` +
        `O el material cambió la URL, o el recurso dejó de usarse.`,
    );
  }
}

// 3. Y que la URL conteste de verdad, que es lo único que ve el lead.
if (!SIN_RED) {
  for (const archivo of new Set([...citados.keys(), ...declarados])) {
    if (!enDisco.has(archivo)) continue;
    const url = `https://onia.com.bo/${CARPETA_DE_RECURSOS}/${archivo}`;
    try {
      const r = await traer(url, {
        redirect: "follow",
        // Sin esto una red lenta cuelga el gate para siempre, que en un loop por
        // cron es peor que un rojo: se come la vuelta entera sin decir nada.
        signal: AbortSignal.timeout(20_000),
      });
      const tipo = r.headers.get("content-type") ?? "";
      if (!r.ok) {
        problemas.push(`${url} → HTTP ${r.status}. El lead que lo abre no recibe nada.`);
      } else if (/text\/html/.test(tipo)) {
        // Un 200 de HTML donde se espera un PDF es la página de 404 del sitio.
        problemas.push(
          `${url} → 200 pero devuelve HTML (${tipo}), no el archivo: es la pantalla ` +
            `de "no encontrado" con cara de éxito.`,
        );
      }
    } catch (e) {
      console.log(`NO MEDIDO (red): ${url} → ${e.message}`);
      process.exit(2);
    }
  }
}

const dondeMedi = fuentes.map((f) => `  · ${f.ruta} — ${f.porque}`).join("\n");
if (problemas.length > 0) {
  console.log(`ROJO: ${problemas.length} problema(s).\n`);
  for (const p of problemas) console.log(`  - ${p}`);
  console.log(`\nMedido contra:\n${dondeMedi}`);
  process.exit(problemas.every((p) => p.startsWith("AVISO:")) ? 0 : 1);
}

console.log(
  `VERDE: los ${citados.size} recurso(s) que el material manda existen en disco, ` +
    `están declarados${SIN_RED ? "" : " y la URL entrega el archivo"}.\n\nMedido contra:\n${dondeMedi}`,
);
