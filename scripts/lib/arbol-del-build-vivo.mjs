// Dónde está en disco el árbol de FUENTES del build que producción sirve ahora mismo.
//
// ORIGEN (medido el 2026-09-25/26, carril chatbot-cola). `puerta:alta` —el único instrumento de
// la mitad «no promete lo que el producto no hace» del objetivo de ese carril— llevaba ~18 días
// saliendo `exit 2` con el motivo «no pude casar el BUILD_ID vivo con ningún árbol de fuentes en
// /opt/onia-platform». La causa no era la mudanza a nodo-casa (esa hipótesis se midió y es
// falsa: `vps-o-local.mjs` contesta perfecto por SSH): era **dónde** buscaba.
//
// Producción deja el árbol en disco de DOS formas distintas, y conviven:
//
//   staging   /opt/onia-platform/build-<sha>/
//               BUILD_ID  -> <dir>/.next/standalone/.next/BUILD_ID
//               fuentes   -> <dir>            (el repo entero, en la raíz)
//
//   release   /opt/onia-platform/releases/<sha8>-<YYYYMMDD>/
//               BUILD_ID  -> <dir>/BUILD_ID   (en la RAÍZ, no bajo .next)
//               fuentes   -> <dir>/src        (bajo src/, no en la raíz)
//               sha       -> <dir>/SHA        (el sha completo, escrito por el publicador)
//
// Desde el 2026-09-24 producción se publica por imagen (`onia-platform:release-<sha>`) y el
// árbol que la produjo queda bajo `releases/`; los `build-*` son staging y
// `scripts/limpiar-builds-staging.sh` los borra. O sea que después de cada swap el `BUILD_ID`
// vivo legítimamente NO tiene par en `build-*`, y todo instrumento que case sólo contra ahí
// queda ciego para siempre.
//
// Medido el 2026-09-26 desde nodo-casa:
//   docker exec onia-platform cat /app/.next/BUILD_ID        -> 4FWMcecd4jRBGUVwStDQb
//   docker inspect onia-platform --format '{{.Config.Image}}' -> onia-platform:release-492e7155
//   /opt/onia-platform/releases/492e7155-20260925/BUILD_ID    -> 4FWMcecd4jRBGUVwStDQb   <- el vivo
//   ninguno de los 7 /opt/onia-platform/build-*/ casaba.
//
// ⚠️ POR QUÉ ESTO VIVE EN UN MÓDULO Y NO INLINE EN CADA GATE. El punto ciego no era de un
// instrumento: era de la RECETA, que estaba copiada en cuatro lugares. Arreglar uno deja la
// familia viva. Cuando mañana aparezca un tercer layout, se agrega UNA entrada a la tabla de
// abajo y los consumidores se enteran solos.
//
// ⚠️ Y TODO VIAJA EN TRI-ESTADO. `null` es «no pude preguntar / no casó», nunca «no hay build».
// Un gate que reciba un sha adivinado cierra pedidos vivos; uno que reciba `null` sale NO MEDIDO,
// que es honesto — pero un NO MEDIDO permanente tampoco es honestidad: es un rojo disfrazado.

import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import { leerDeProduccion, listarDeProduccion } from "./vps-o-local.mjs";

export const BASE_BUILDS = "/opt/onia-platform";
export const CONTENEDOR_APP = "onia-platform";

/** Sin la barra final, para que `${dir}/x` no salga con `//` y las comparaciones casen. */
const sinBarra = (d) => String(d).replace(/\/+$/, "");

const SHA_SUELTO = /^[0-9a-f]{7,40}$/;

/**
 * Los layouts conocidos, EN EL ORDEN EN QUE SE PRUEBAN.
 *
 * `releases` va primero porque es donde vive el build que hoy corre: probar staging primero
 * gastaría una vuelta entera de `cat` por SSH que ya sabemos que no casa.
 */
export const LAYOUTS_DEL_BUILD = [
  {
    nombre: "release",
    patron: (base) => `${base}/releases/*`,
    buildId: (dir) => `${dir}/BUILD_ID`,
    fuentes: (dir) => `${dir}/src`,
    sha: (dir, leer) => {
      const f = leer(`${dir}/SHA`);
      const v = f ? String(f.contenido).trim() : "";
      if (SHA_SUELTO.test(v)) return v;
      // El nombre del directorio es el respaldo, no la fuente: trae el sha ABREVIADO.
      return dir.match(/\/([0-9a-f]{7,40})-\d{8}$/)?.[1] ?? null;
    },
  },
  {
    nombre: "staging",
    patron: (base) => `${base}/build-*`,
    buildId: (dir) => `${dir}/.next/standalone/.next/BUILD_ID`,
    fuentes: (dir) => dir,
    sha: (dir) => dir.match(/\/build-([0-9a-f]{7,40})$/)?.[1] ?? null,
  },
];

/** El `BUILD_ID` que sirve el contenedor. `null` = no pude preguntar. */
export function buildIdVivo({ correr = spawnSync, contenedor = CONTENEDOR_APP } = {}) {
  const r = correr("docker", ["exec", contenedor, "cat", "/app/.next/BUILD_ID"], {
    encoding: "utf8",
    timeout: 60_000,
  });
  if (!r || r.error || r.status !== 0 || typeof r.stdout !== "string") return null;
  return r.stdout.trim() || null;
}

/**
 * El build en disco cuyo `BUILD_ID` es el que corre, mirando TODOS los layouts.
 *
 * Devuelve `{ dir, fuentes, sha, layout }` o `null`. `fuentes` es el directorio desde el que se
 * leen rutas del repo (`lib/...`, `app/...`) — que NO siempre es `dir`, y esa diferencia es el
 * bug entero que este módulo cierra.
 */
export function buildVivoEnDisco({
  buildId,
  base = BASE_BUILDS,
  leer = leerDeProduccion,
  listar = listarDeProduccion,
  layouts = LAYOUTS_DEL_BUILD,
} = {}) {
  if (!buildId) return null;
  for (const layout of layouts) {
    const candidatos = listar(layout.patron(base));
    if (!candidatos || !Array.isArray(candidatos.dirs)) continue;
    for (const crudo of candidatos.dirs) {
      const dir = sinBarra(crudo);
      if (!dir) continue;
      const suyo = leer(layout.buildId(dir));
      if (!suyo || String(suyo.contenido).trim() !== buildId) continue;
      return { dir, fuentes: sinBarra(layout.fuentes(dir)), sha: layout.sha(dir, leer), layout: layout.nombre };
    }
  }
  return null;
}

/** Lo mismo, preguntándole al contenedor cuál es el `BUILD_ID` vivo. */
export function buildQueCorre({ correr = spawnSync, contenedor = CONTENEDOR_APP, ...resto } = {}) {
  return buildVivoEnDisco({ buildId: buildIdVivo({ correr, contenedor }), ...resto });
}

// ---------------------------------------------------------------------------
// Self-check: puro, sin docker ni red, para que pueda vivir en la cadena.
// ---------------------------------------------------------------------------

export function selfCheck() {
  const casos = [];
  const ok = (cond, nombre) => casos.push({ nombre, ok: Boolean(cond) });

  const REL = "/opt/onia-platform/releases/492e715-20260925";
  const STG = "/opt/onia-platform/build-251f64c";

  const listar = (patron) =>
    String(patron).includes("/releases/")
      ? { dirs: ["/opt/onia-platform/releases/aaaaaaa-20260924", `${REL}/`], origen: "remoto" }
      : { dirs: ["/opt/onia-platform/build-aaaaaaa", STG], origen: "remoto" };
  const leer = (ruta) => {
    if (ruta === `${REL}/BUILD_ID`) return { contenido: "ID-RELEASE\n", origen: "remoto" };
    if (ruta === `${REL}/SHA`) return { contenido: "492e715598236efdb3af0ad86c2a5077eb0ee285\n", origen: "remoto" };
    if (ruta === `${STG}/.next/standalone/.next/BUILD_ID`) return { contenido: "ID-STAGING\n", origen: "remoto" };
    return null;
  };

  const rel = buildVivoEnDisco({ buildId: "ID-RELEASE", leer, listar });
  ok(rel?.dir === REL, "un release se casa por BUILD_ID leido de la RAIZ del directorio");
  ok(rel?.fuentes === `${REL}/src`, "de un release las fuentes salen de src/, no de la raiz");
  ok(rel?.sha === "492e715598236efdb3af0ad86c2a5077eb0ee285", "el sha de un release sale del archivo SHA: completo, no abreviado");
  ok(rel?.layout === "release", "el layout que caso se DICE, para que el consumidor no adivine");

  const stg = buildVivoEnDisco({ buildId: "ID-STAGING", leer, listar });
  ok(stg?.dir === STG, "el layout viejo de staging sigue casando: agregar uno no rompe el otro");
  ok(stg?.fuentes === STG, "de un staging las fuentes SI son la raiz");
  ok(stg?.sha === "251f64c", "el sha de un staging sale del nombre del directorio");

  ok(buildVivoEnDisco({ buildId: "ID-QUE-NO-ESTA", leer, listar }) === null, "sin par no se devuelve el primero que haya: null");
  ok(buildVivoEnDisco({ buildId: null, leer, listar }) === null, "sin BUILD_ID vivo es null, nunca un build adivinado");

  // La barra final la pone `ls -d <patron>/`, y sin normalizar rompe toda comparacion de rutas.
  ok(!/\/\//.test(String(rel?.fuentes)), "una barra final en el listado no se propaga a las rutas derivadas");

  // Un SHA ilegible no inventa sha, pero TAMPOCO tira el build: el arbol sigue siendo medible.
  const sinSha = buildVivoEnDisco({
    buildId: "ID-RELEASE",
    listar,
    leer: (r) => (r === `${REL}/SHA` ? null : leer(r)),
  });
  ok(sinSha?.dir === REL, "un SHA ilegible no tira el build: el arbol de fuentes sigue medido");
  ok(sinSha?.sha === "492e715", "sin el archivo SHA se cae al sha abreviado del nombre, y se sabe que es abreviado");

  // Si `listar` no contesta para un layout (null = no pude preguntar), se sigue con el otro.
  ok(
    buildVivoEnDisco({
      buildId: "ID-STAGING",
      leer,
      listar: (p) => (String(p).includes("/releases/") ? null : listar(p)),
    })?.dir === STG,
    "que un layout no conteste no puede cegar a los otros",
  );

  // ANCLA en la otra punta: el orden de los layouts no puede decidir el veredicto.
  ok(
    buildVivoEnDisco({ buildId: "ID-STAGING", leer, listar, layouts: [...LAYOUTS_DEL_BUILD].reverse() })?.dir === STG &&
      buildVivoEnDisco({ buildId: "ID-RELEASE", leer, listar, layouts: [...LAYOUTS_DEL_BUILD].reverse() })?.dir === REL,
    "invertir el orden de los layouts da el mismo build: el orden es costo, no criterio",
  );

  const fallan = casos.filter((c) => !c.ok);
  for (const c of casos) console.log(`${c.ok ? "ok  " : "FAIL"} ${c.nombre}`);
  console.log(`${casos.length - fallan.length}/${casos.length}`);
  return fallan.length === 0 ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  process.exit(selfCheck());
}
