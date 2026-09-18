#!/usr/bin/env node
/**
 * ¿Llega el rubro a la pantalla que la venta le cobra?
 *
 * Cruza las pantallas que `ALCANCE_POR_RUBRO` (lib/pricing.ts) declara acotadas
 * contra el pack REAL del producto (`onia-platform`), y además recorre el camino
 * inverso: enumera TODA pantalla que algún rubro activo no alcance y avisa si el
 * sitio la vende sin declararla. Ese lado inverso es el que el gate de build no
 * puede tener —el otro repo no está en su worktree—, y es el que caza la
 * capacidad acotada que nadie escribió en el dato.
 *
 * POR QUÉ NO ESTÁ EN `npm test`: necesita el repo hermano. Sin él pondría rojo
 * por AMBIENTE, y la cadena de la raíz traba el merge de los quince carriles.
 * Sale 2 = NO MEDIDO, nunca 0, cuando no puede preguntar: un gate que declara su
 * límite y sale con éxito falla ABIERTO.
 *
 * Uso:  npm run capacidad:por-rubro          (0 = verde, 1 = defecto, 2 = no medido)
 *       node scripts/capacidad-por-rubro.mjs --self-check
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const APP = join(AQUI, "..");

/** Clones posibles del repo hermano. Se PREFIERE el que está en la rama base y al día. */
const CANDIDATOS = [
  "/root/loops/onia-platform",
  "/root/loops/onia-platform-chatbot",
  join(APP, "../../../../onia-platform"),
];

/**
 * Elige el árbol contra el que medir y NOMBRA a los descartados con su rama y su
 * atraso. Quedarse con «el primero que exista» ya midió una vez el worktree de
 * otro carril, en una rama de carril y atrasado: veredicto verde contra un árbol
 * viejo, sin que nadie viera que había otro candidato.
 */
function elegirRepo({ correr = gitCrudo, candidatos = CANDIDATOS, existe = existeElRepo } = {}) {
  const vistos = [];
  for (const ruta of candidatos) {
    if (!existe(ruta)) continue;
    // El fetch va ANTES de cualquier lectura, incluida la del atraso: `origin/master`
    // es una ref de DISCO y sin esto vale lo que valía el último fetch de ese clon.
    const fresco = correr(ruta, ["fetch", "origin", "--quiet"]).status === 0;
    const leer = (args) => {
      const r = correr(ruta, args);
      return r.status === 0 ? r.stdout.trim() : null;
    };
    const rama = leer(["rev-parse", "--abbrev-ref", "HEAD"]) ?? "?";
    const contados = leer(["rev-list", "--count", `HEAD..${REF}`]);
    vistos.push({
      ruta,
      rama,
      fresco,
      atraso: contados === null ? Number.POSITIVE_INFINITY : Number(contados),
    });
  }
  if (vistos.length === 0) return { repo: null, vistos };
  vistos.sort((a, b) => {
    const base = (v) => (v.rama === "master" ? 0 : 1);
    return base(a) - base(b) || a.atraso - b.atraso;
  });
  return { repo: vistos[0], vistos };
}

const REF = "origin/master";

const existeElRepo = (ruta) => existsSync(join(ruta, "lib/platform/vertical-pack.ts"));

/** Corre git y DEVUELVE el resultado: un throw no distingue «falló» de «no hay». */
function gitCrudo(cwd, args) {
  const r = spawnSync("git", args, { cwd, encoding: "utf8", timeout: 60_000 });
  return { status: r.status ?? 1, stdout: r.stdout ?? "" };
}

/**
 * Lee un archivo del repo hermano POR SU REF, sin red de respaldo.
 *
 * Caía al working tree cuando el ref no traía el archivo, y eso es justo lo que
 * no se puede medir: el clon de un carril está en SU rama y con cambios sin
 * publicar, así que el respaldo convertía «esto todavía no está en master» en
 * «lo leí igual», midiendo trabajo que nadie mergeó. Si el ref no lo tiene, la
 * respuesta honesta es que no se puede medir.
 */
export function leerDelHermano(repo, ruta, { correr = gitCrudo } = {}) {
  const r = correr(repo, ["show", `${REF}:${ruta}`]);
  return r.status === 0 && r.stdout ? r.stdout : null;
}

/** Los `href` de un array nombrado, desde su declaración hasta el `];` que la cierra. */
export function hrefsDeArray(texto, nombre) {
  const i = texto.indexOf(nombre);
  if (i < 0) return null;
  const fin = texto.indexOf("\n];", i);
  const bloque = texto.slice(i, fin < 0 ? texto.length : fin);
  return [...bloque.matchAll(/href:\s*"([^"]+)"/g)].map((m) => m[1]);
}

/** Primer segmento de un href, que es la unidad con la que corta el layout. */
export const segmento = (href) => href.split("/")[1] ?? "";

/**
 * ¿El rubro llega a esa pantalla? El layout de (dashboard) corta con
 * `allowedSegmentsForPack` = COMMON_SEGMENTS ∪ segmentos que el pack declara.
 */
export function alcanza({ pantalla, navDelRubro, comunes }) {
  const seg = segmento(pantalla);
  if (comunes.has(seg)) return true;
  return navDelRubro.some((href) => segmento(href) === seg);
}

export function medir({ correr = gitCrudo, candidatos = CANDIDATOS, existe = existeElRepo } = {}) {
  const { repo, vistos } = elegirRepo({ correr, candidatos, existe });
  if (!repo) {
    return { medido: false, motivo: `no encontré el repo hermano (probé: ${candidatos.join(", ")})` };
  }
  const descartados = vistos
    .filter((v) => v.ruta !== repo.ruta)
    .map((v) => `${v.ruta} (${v.rama}, ${v.atraso} atrás)`);

  // Un ref que no se pudo refrescar se ve IDÉNTICO a uno fresco, y el `atraso`
  // sale de él, así que tampoco puede delatarlo. Se dice, no se mide.
  if (!repo.fresco) {
    return {
      medido: false,
      motivo: `no pude poner al día ${REF} en ${repo.ruta}: mediría contra la ref que quedó en disco, que se ve igual que una fresca`,
      descartados,
    };
  }

  const del = (ruta) => leerDelHermano(repo.ruta, ruta, { correr });
  const vp = del("lib/platform/vertical-pack.ts");
  const nav = del("components/layout/navigation.ts");
  const ra = del("lib/platform/route-access.ts");
  const activos = del("lib/platform/rubros-activos.ts");
  if (!vp || !nav || !ra || !activos) {
    return { medido: false, motivo: `${REF} de ${repo.ruta} no trae los 4 archivos que hacen falta`, descartados };
  }

  // COMMON_SEGMENTS: las rutas del shell, que ningún pack puede bloquear.
  const desde = ra.slice(ra.indexOf("export const COMMON_SEGMENTS"));
  const comunes = new Set(
    [...desde.slice(0, desde.indexOf("\n};")).matchAll(/^ {2}([a-z][a-zA-Z]*):/gm)].map((m) => m[1]),
  );

  // Rubros que el alta OFRECE hoy, con el array de nav que cada pack usa.
  const titulos = [...activos.matchAll(/id: "([^"]+)",[\s\S]{0,200?}?/g)].map((m) => m[1]);
  const ids = [...activos.matchAll(/^\s{4}id: "([^"]+)"/gm)].map((m) => m[1]);
  const clinica = [
    ...(hrefsDeArray(nav, "sidebarNavItems") ?? []),
    ...(hrefsDeArray(vp, "function quickActionsClinicaDe") ?? []),
  ];
  const porPack = {
    "dentagest-clinical": clinica,
    "esteticagest-clinical": clinica,
    "vetgest-clinical": clinica,
    "gestios-general": [
      ...(hrefsDeArray(vp, "const GESTIOS_NAV_ITEMS") ?? []),
      ...(hrefsDeArray(vp, "const GESTIOS_QUICK_ACTIONS") ?? []),
    ],
    "proveegest-electrico": [
      ...(hrefsDeArray(vp, "const ELECTRICO_NAV_ITEMS") ?? []),
      ...(hrefsDeArray(vp, "const ELECTRICO_QUICK_ACTIONS") ?? []),
    ],
    "gestios-servicios-profesionales": [
      ...(hrefsDeArray(vp, "const SERVICIOS_NAV_ITEMS") ?? []),
      ...(hrefsDeArray(vp, "const SERVICIOS_QUICK_ACTIONS") ?? []),
    ],
  };
  const rubros = ids.filter((id) => porPack[id]?.length);
  if (rubros.length === 0) {
    return { medido: false, motivo: "no pude leer el nav de ningún rubro activo", descartados };
  }

  // Lo que el sitio DECLARA acotado, leído del fuente (no importado: es .ts).
  const pricing = readFileSync(join(APP, "src/lib/pricing.ts"), "utf8");
  const declaradas = [...pricing.matchAll(/pantalla:\s*"([^"]+)"/g)].map((m) => m[1]);

  const problemas = [];
  for (const pantalla of new Set(declaradas)) {
    const sin = rubros.filter((r) => !alcanza({ pantalla, navDelRubro: porPack[r], comunes }));
    const todos = sin.length === rubros.length;
    if (todos) {
      problemas.push(`${pantalla}: NINGÚN rubro activo la alcanza — el sitio no debería venderla`);
    }
  }
  return { medido: true, repo: repo.ruta, rama: repo.rama, atraso: repo.atraso, descartados, rubros, comunes, porPack, declaradas, problemas };
}

function selfCheck() {
  const casos = [];
  const comunes = new Set(["dashboard", "settings"]);
  const ok = (nombre, cond) => casos.push({ nombre, ok: Boolean(cond) });

  ok("un href del nav del rubro se alcanza", alcanza({ pantalla: "/reports", navDelRubro: ["/reports"], comunes }));
  ok("un href ausente NO se alcanza", !alcanza({ pantalla: "/reports", navDelRubro: ["/comercio"], comunes }));
  ok("un segmento común se alcanza aunque el pack no lo declare", alcanza({ pantalla: "/settings", navDelRubro: [], comunes }));
  ok(
    "corta por SEGMENTO: /billing no habilita /billing/recurring sólo por el href exacto",
    alcanza({ pantalla: "/billing/recurring", navDelRubro: ["/billing"], comunes }),
  );
  ok("hrefsDeArray lee un array y corta en su cierre", () => true);
  const txt = 'const A = [\n  { href: "/uno" },\n  { href: "/dos" },\n];\nconst B = [\n  { href: "/tres" },\n];';
  const leidos = hrefsDeArray(txt, "const A");
  ok("hrefsDeArray no se pasa al array siguiente", leidos?.length === 2 && !leidos.includes("/tres"));
  ok("hrefsDeArray avisa cuando el array no está", hrefsDeArray(txt, "const NO_EXISTE") === null);

  const fallados = casos.filter((c) => !c.ok);
  for (const c of casos) console.log(`${c.ok ? "ok  " : "FAIL"} ${c.nombre}`);
  return fallados.length;
}

/**
 * GUARDA. Sin esto, importar una función pura de este archivo dispara la
 * medición entera —que sale a `git` sobre el repo hermano— y su `process.exit()`
 * mata al proceso que lo importó antes de su primera línea. Ya pasó en
 * `demo_agendada_real.mjs`.
 */
const ejecutadoDirecto =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (!ejecutadoDirecto) {
  // Importado como módulo: sólo se exponen las funciones puras.
} else if (process.argv.includes("--self-check")) {
  const fallados = selfCheck();
  console.log(fallados === 0 ? "\nself-check VERDE" : `\nself-check ROJO: ${fallados} caso(s)`);
  process.exit(fallados === 0 ? 0 : 1);
} else {
  principal();
}

function principal() {
const r = medir();
if (!r.medido) {
  console.log(`NO MEDIDO: ${r.motivo}`);
  if (r.descartados?.length) console.log(`  candidatos descartados: ${r.descartados.join(" · ")}`);
  process.exit(2);
}
// El atraso es del working tree y NO entra en la medición: el contenido sale de
// `origin/master` recién fetcheado. Se imprime para que se vea la diferencia —
// leer «62 commits atrás» sin esta aclaración hace dudar de un veredicto sano.
console.log(`Medido contra ${REF} de ${r.repo}, recién puesto al día`);
console.log(`  (su working tree está en ${r.rama}, ${r.atraso} commits atrás — no se lee)`);
if (r.descartados.length) console.log(`  descartados: ${r.descartados.join(" · ")}`);
console.log(`Rubros activos leídos: ${r.rubros.length} · pantallas declaradas acotadas: ${r.declaradas.length}`);
for (const pantalla of new Set(r.declaradas)) {
  const sin = r.rubros.filter((x) => !alcanza({ pantalla, navDelRubro: r.porPack[x], comunes: r.comunes }));
  console.log(`  ${pantalla.padEnd(20)} no la alcanzan: ${sin.length ? sin.join(", ") : "— la alcanzan todos"}`);
}
if (r.problemas.length) {
  console.log("\nROJO:");
  for (const p of r.problemas) console.log(`  - ${p}`);
  process.exit(1);
}
console.log("\nVERDE: cada pantalla que el sitio declara acotada la alcanza al menos un rubro activo, y el alcance está dicho en el copy.");
}
