#!/usr/bin/env node
// Una migración de Prisma que está en el repo y NO en producción es invisible para
// TODOS los gates de deploy del proyecto, y esta es la segunda vez que muerde.
//
// POR QUE existe (2026-09-11, integrador): los tres gates de deploy —`deploy-vivo.mjs`,
// `deploy_sin_pedido.mjs`, `pedido_deploy_entregado.mjs`— cuentan COMMITS. Ninguno mira
// migraciones. Y el publicador tampoco las aplica: `grep -ciE 'migrate|prisma'` sobre
// /opt/onia-platform/_deploy/publicar.sh da 0 en sus 108 líneas. O sea que el swap
// NUNCA cierra esa brecha, y como todo lo demás sale verde, nadie la ve.
//
// La primera vez costó un incidente real: el 2026-09-08 la migración `avisadoAgotadaAt`
// llevaba TRES DÍAS pendiente con su código ya vivo en el build de producción, y
// `aplicarRecarga` (la recarga paga del chatbot, Bs 190) tiraba P2022 DESPUES de
// incrementar el contador — el operador veía un error sobre una recarga que SÍ se había
// aplicado, y reintentar la duplicaba.
//
// La segunda fue hoy: al mergear `20260911170000_addon_canceled_at` a master quedó otra
// pendiente. Esta vez NO revienta —su autor la escribió fail-soft, el cron contesta
// "migracion_pendiente" y no manda nada— pero el efecto es que la baja del add-on llega
// a producción MUDA, y el pedido de deploy que espera el ok de Sergio Urcullo no lo dice
// porque ningún instrumento se lo puede contar. Que hoy sea fail-soft es diligencia del
// autor, no una propiedad del sistema.
//
// TRI-ESTADO, y es la mitad que importa: "no pude preguntarle a la base" NO es "la base
// no tiene ninguna". Si esto devolviera `[]` ante un docker caído, reportaría las 34
// migraciones como pendientes — la respuesta contraria a la verdad, y en la dirección
// cara: manda a re-aplicar sobre producción lo que ya está aplicado. Por eso `null`
// nunca se colapsa a lista vacía y el veredicto sale NO MEDIDO (exit 2).
//
// Se corre con:  node scripts/migraciones_pendientes.mjs      (medición viva)
//                node scripts/migraciones_pendientes.mjs --self-check   (cadena npm test)

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { elegirArbol } from "./catalogo_modulos_vivos.mjs";
import { refsAlDia } from "./pedido_deploy_entregado.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));

/** Se prefiere el árbol que está en `master` y al día; `elegirArbol` nombra al descartado. */
const CANDIDATOS = [
  "/root/loops/onia-platform/prisma/migrations",
  "/root/loops/onia-platform-chatbot/prisma/migrations",
  resolve(AQUI, "../../onia-platform/prisma/migrations"),
];

/** El contenedor de la base de producción. Self-hosted en el VPS, NO la nube de Supabase. */
const CONTENEDOR = "supabase-db";

/**
 * Las migraciones que hay en el repo, por nombre de carpeta.
 * `null` = no pude leer el directorio (no es «el repo no tiene ninguna»).
 */
export function enDisco(dir) {
  try {
    return readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isDirectory() && /^\d/.test(e.name))
      .map((e) => e.name)
      .sort();
  } catch {
    return null;
  }
}

/**
 * Las migraciones que producción declara TERMINADAS.
 * `null` = no pude preguntar. Una migración a medio aplicar (`finished_at` nulo) no cuenta
 * como aplicada a propósito: es justo el estado que deja la columna sin existir.
 */
export function enProduccion(ejecutar = psql) {
  const salida = ejecutar(
    "select migration_name from _prisma_migrations where finished_at is not null",
  );
  if (salida === null) return null;
  return salida
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .sort();
}

function psql(sql) {
  try {
    return execFileSync(
      "docker",
      ["exec", CONTENEDOR, "psql", "-U", "postgres", "-d", "postgres", "-tAc", sql],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 60_000 },
    );
  } catch {
    return null;
  }
}

/**
 * El cruce, puro. Devuelve `medido:false` si falta CUALQUIERA de los dos lados — sin eso,
 * la ausencia de un lado se leería como un veredicto sobre el otro.
 */
export function comparar(disco, produccion) {
  if (disco === null || produccion === null) {
    return { medido: false, pendientes: [], sobrantes: [] };
  }
  const aplicadas = new Set(produccion);
  const enRepo = new Set(disco);
  return {
    medido: true,
    // Están en el repo y producción no las tiene: el deploy NO las va a aplicar.
    pendientes: disco.filter((m) => !aplicadas.has(m)),
    // Producción las tiene y el repo no: alguien borró la carpeta, o el clon está atrasado.
    sobrantes: produccion.filter((m) => !enRepo.has(m)),
  };
}

/** Los clones que existen, derivados de los candidatos: `prisma/migrations` cuelga de la raíz. */
function reposDeLosCandidatos(candidatos = CANDIDATOS) {
  return candidatos.filter((c) => existsSync(c)).map((c) => resolve(c, "../.."));
}

/** Trae los refs del remoto de un clon. `true` = quedó al día. */
function fetchear(repo) {
  try {
    execFileSync("git", ["-C", repo, "fetch", "--quiet", "origin", "master"], {
      stdio: "ignore",
      timeout: 120_000,
    });
    return true;
  } catch {
    return false;
  }
}

function main() {
  // Sin FETCHEAR, «al día» se mide contra los refs que el clon tenga en DISCO, y eso falla
  // EN VERDE: medido hoy, tras pushear la migración a master, el clon de nodo-casa seguía
  // con su `origin/master` viejo, se declaró al día estando 4 commits atrás, y este gate
  // cantó «las 33 están aplicadas» sin ver la única pendiente. La cura ya existía en
  // `pedido_deploy_entregado.mjs` (mismo agujero, arreglado el 2026-09-11) y no había
  // viajado al hermano nuevo. Si el fetch no contesta, NO MEDIDO: un clon con refs
  // dudosos no puede absolver a nadie.
  const frescura = refsAlDia({ repos: reposDeLosCandidatos(), fetchear });
  if (!frescura.ok) {
    console.log("VEREDICTO: NO MEDIDO — no pude traer los refs de:");
    for (const r of frescura.fallaron) console.log(`  ${r}`);
    console.log("  Sin refs frescos, «al día» se mediría contra un origin/master viejo.");
    return 2;
  }

  const elegido = elegirArbol(CANDIDATOS);
  if (elegido.ruta === null) {
    console.log("VEREDICTO: NO MEDIDO — no encontré prisma/migrations de onia-platform. Se buscó en:");
    for (const c of CANDIDATOS) console.log(`  ${c}`);
    return 2;
  }
  for (const d of elegido.descartados) console.log(`  (descartado: ${d})`);

  // Un árbol atrasado NO PUEDE decir «al día», y esta guarda nació de la primera corrida
  // viva de este gate: el clon local estaba 19 commits atrás de master, así que veía 32
  // migraciones en vez de 34 — le faltaban justo las dos NUEVAS, que son las únicas que
  // pueden estar pendientes — y cantó OK con exit 0 mientras imprimía el aviso al lado.
  // Un gate que declara su límite y sale con código 0 igual falla ABIERTO: el aviso no lo
  // lee nadie, el exit sí. Con el árbol dudoso el único veredicto honesto es NO MEDIDO.
  if (elegido.aviso) {
    console.log(`VEREDICTO: NO MEDIDO — ${elegido.aviso}`);
    console.log("  Un clon atrasado no ve las migraciones nuevas, que son las que pueden faltar.");
    return 2;
  }

  const disco = enDisco(elegido.ruta);
  const produccion = enProduccion();
  const r = comparar(disco, produccion);

  if (!r.medido) {
    const lado = disco === null ? `no pude leer ${elegido.ruta}` : `no pude preguntarle a ${CONTENEDOR}`;
    console.log(`VEREDICTO: NO MEDIDO — ${lado}.`);
    console.log("  Ojo: esto NO significa que estén al día, y tampoco que falten todas.");
    return 2;
  }

  for (const s of r.sobrantes) {
    console.log(`AVISO sobrante: producción aplicó ${s} y el repo no la tiene`);
  }

  if (r.pendientes.length === 0) {
    console.log(`OK: las ${disco.length} migraciones del repo están aplicadas en producción.`);
    return 0;
  }

  console.log(`PENDIENTES: ${r.pendientes.length} migración(es) en el repo que producción NO tiene:`);
  for (const m of r.pendientes) console.log(`  ${m}`);
  console.log("");
  console.log("El swap NO las aplica: publicar.sh no corre prisma migrate (medido, 0 líneas).");
  console.log("Si un pedido de deploy publica código que las necesita, hay que decirlo EN el pedido.");
  return 1;
}

function selfCheck() {
  let fallos = 0;
  const ok = (cond, nombre) => {
    console.log(`${cond ? "ok" : "FAIL"} - ${nombre}`);
    if (!cond) fallos++;
  };

  const TRES = ["20260101000000_a", "20260202000000_b", "20260303000000_c"];

  // El caso que YA cumple. Sin él, un detector que diga "todo pendiente" pasaría igual.
  const alDia = comparar(TRES, TRES);
  ok(alDia.medido && alDia.pendientes.length === 0 && alDia.sobrantes.length === 0, "al día: nada pendiente ni sobrante");

  const falta = comparar(TRES, ["20260101000000_a", "20260202000000_b"]);
  ok(falta.medido && falta.pendientes.length === 1, "una sin aplicar se cuenta");
  ok(falta.pendientes.join() === "20260303000000_c", "y la NOMBRA");

  const sobra = comparar(["20260101000000_a"], TRES);
  ok(sobra.medido && sobra.sobrantes.length === 2, "lo que producción tiene de más se nombra aparte");
  ok(sobra.pendientes.length === 0, "un sobrante no se cuenta como pendiente");

  // Las dos puertas del NO MEDIDO. La segunda es la cara: sin ella, un docker caído
  // reportaría TODAS las migraciones como pendientes y mandaría a re-aplicar producción.
  const sinDisco = comparar(null, TRES);
  ok(!sinDisco.medido && sinDisco.pendientes.length === 0, "sin repo: NO MEDIDO, y no inventa pendientes");
  const sinBase = comparar(TRES, null);
  ok(!sinBase.medido, "sin base: NO MEDIDO");
  ok(sinBase.pendientes.length !== TRES.length, "sin base NO reporta todas como pendientes");

  // `enProduccion` tiene que propagar el null del ejecutor, no convertirlo en [].
  ok(enProduccion(() => null) === null, "si el psql no contesta, devuelve null y no una lista vacía");
  ok(enProduccion(() => "b\na\n")?.join() === "a,b", "parsea y ordena lo que contesta el psql");
  // Una salida vacía SÍ es una respuesta: producción sin ninguna migración terminada.
  ok(enProduccion(() => "\n")?.length === 0, "una respuesta vacía es una lista vacía, no un null");

  // `enDisco` filtra lo que no es migración y degrada con null.
  ok(enDisco("/no/existe/por/suerte") === null, "un directorio ausente da null, no []");

  // Cableado: que el main USE el cruce y su veredicto, no que lo mencione. Anclado a la
  // ASIGNACIÓN y al `if` de apertura porque llamar-y-tirar, y anteponer `false &&`, son
  // los dos esquives que pasan en verde con el guardia muerto.
  const fuente = readdirSync(AQUI).includes("migraciones_pendientes.mjs")
    ? execFileSync("cat", [resolve(AQUI, "migraciones_pendientes.mjs")], { encoding: "utf8" })
    : "";
  const codigo = fuente.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " ")).replace(/^\s*\/\/.*$/gm, "");
  ok(/const\s+r\s*=\s*comparar\(disco,\s*produccion\)/.test(codigo), "el main asigna el resultado de comparar()");
  ok(/if\s*\(\s*!r\.medido\s*\)/.test(codigo), "y corta por !r.medido con una guarda viva");
  ok(/const\s+produccion\s*=\s*enProduccion\(\)/.test(codigo), "el main le pregunta a producción de verdad");
  // La guarda del árbol dudoso: tiene que CORTAR, no sólo avisar. Se exige el `if` de
  // apertura y su `return 2` en la vecindad, porque imprimir el aviso y seguir es
  // exactamente el bug que esta guarda vino a cerrar.
  // Ojo con recortar el bloque por la primera `}`: el cuerpo tiene un template string y su
  // `${elegido.aviso}` cierra antes, así que el match lazy acusaba a una guarda sana — la
  // dirección cara. Va por VENTANA desde el `if`, y el largo lo fija la mutación: con 320
  // no alcanza el `return 2` del bloque siguiente, así que sacarle el suyo la pone en rojo.
  const abre = codigo.search(/if\s*\(\s*elegido\.aviso\s*\)/);
  const guarda = abre === -1 ? null : codigo.slice(abre, abre + 320);
  ok(guarda !== null, "el main tiene una guarda viva sobre elegido.aviso");
  ok(guarda !== null && /return 2/.test(guarda), "y esa guarda CORTA con NO MEDIDO, no sólo avisa");

  console.log(`\n${fallos === 0 ? "SELF-CHECK OK" : `SELF-CHECK: ${fallos} FAIL`}`);
  return fallos === 0 ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(process.argv.includes("--self-check") ? selfCheck() : main());
}
