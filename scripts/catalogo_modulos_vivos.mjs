#!/usr/bin/env node
// Cruza los MODULOS que el catalogo de venta declara contra las pantallas que el producto TIENE.
//
// Por que existe: `ONIA_CATALOGO_DE_VENTA.md` es la fuente de verdad de "que se vende" — Sergio
// lee esa tabla para saber que prometer. El 2026-09-06, recorriendo los modulos 🟡 uno por uno, su
// §4 declaraba un modulo entero, "Operaciones", cuya pantalla `/operations` NO EXISTE: la ruta
// redirige a `/dashboard`, no esta en ninguna nav y no figura en `route-access.ts` ni en
// `vertical-pack.ts`. Lo mismo `/accounting`, que redirige a `/contabilidad`.
//
// Ningun instrumento del proyecto podia verlo, y por tres motivos a la vez:
//   · no es un literal PROHIBIDO — "Operaciones" es una palabra legitima;
//   · no es superficie servida — el catalogo es un .md, no una url que se pueda mirar ni grepear;
//   · la redireccion tapa el sintoma — un cliente que tipea /operations no ve un 404, ve el panel,
//     asi que ni un barrido de enlaces rotos lo encuentra.
// El costo no es una pantalla rota: es que se venda un modulo que no se puede entregar.
//
// La direccion INVERSA es la que ya mordio dos veces (ver `rubros-vivos.mjs`): el catalogo
// SUBVENDIENDO algo que si funciona. Por eso este gate mira las dos, y la segunda no se puede
// medir contra el disco — se mide contra el propio archivo, exigiendo que §4 no contradiga a §7.
//
// Salidas:  0 = coinciden · 1 = divergen (alguien tiene que barrer) · 2 = NO MEDIDO
// El 2 nunca es verde: si no encuentra el otro repo lo dice, en vez de aprobar por defecto — que
// es como esta familia de gates falla abierto.
//
//   node scripts/catalogo_modulos_vivos.mjs [--self-check]

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const AQUI = dirname(fileURLToPath(import.meta.url));

const CATALOGO = resolve(AQUI, "../hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md");

/**
 * Donde vive el arbol de rutas del producto. Se prueban en orden y gana el primero que exista:
 * el worktree de este carril primero, porque es el unico que tiene lo que todavia no se mergeo.
 */
const CANDIDATOS = [
  "/root/loops/onia-platform-chatbot/app/(dashboard)",
  "/root/loops/onia-platform/app/(dashboard)",
  resolve(AQUI, "../../onia-platform/app/(dashboard)"),
];

/** La carpeta de rutas del producto, o null si este arbol no tiene el otro repo. */
export function rutaDashboard(candidatos = CANDIDATOS) {
  return candidatos.find((ruta) => existsSync(ruta)) || null;
}

/**
 * Las filas de la tabla de modulos de §4. Se acota al bloque de esa seccion a proposito: el
 * archivo tiene otras tablas (add-ons, planes) y un regex de fila suelto las mezclaria.
 */
export function parsearModulos(fuente) {
  const desde = fuente.indexOf("## 4. Módulos del producto");
  if (desde < 0) throw new Error("no encontré la sección '## 4. Módulos del producto'");
  const hasta = fuente.indexOf("\n## ", desde + 1);
  const bloque = fuente.slice(desde, hasta < 0 ? undefined : hasta);

  const filas = [];
  for (const linea of bloque.split("\n")) {
    if (!linea.startsWith("|")) continue;
    const celdas = linea.split("|").slice(1, -1).map((c) => c.trim());
    if (celdas.length < 4) continue;
    const [modulo, pantalla, , estado] = celdas;
    if (/^-+$/.test(modulo) || modulo === "Módulo") continue; // cabecera y separador
    filas.push({ modulo, pantalla, estado, rutas: rutasDe(pantalla) });
  }
  return filas;
}

/**
 * Las rutas de la celda "Pantalla", normalizadas a su SEGMENTO RAIZ — que es lo que existe como
 * carpeta. `/comercio/**` y `/importadora/cotizaciones` son subrutas: exigirlas enteras daria
 * rojo falso sobre modulos sanos, que es como un gate manda a arreglar lo que funciona.
 */
export function rutasDe(celda) {
  const crudas = celda.match(/`\/[^`]+`/g) || [];
  const vistas = new Set();
  for (const cruda of crudas) {
    const raiz = cruda.replace(/`/g, "").split("/")[1];
    if (raiz && raiz !== "**") vistas.add(raiz);
  }
  return [...vistas];
}

/** Los módulos cuya pantalla NO existe en el producto. */
export function pantallasFantasma(filas, dashboard) {
  const faltan = [];
  for (const fila of filas) {
    for (const raiz of fila.rutas) {
      if (!existsSync(`${dashboard}/${raiz}`)) faltan.push({ ...fila, raiz });
    }
  }
  return faltan;
}

/**
 * §4 no puede contradecir a §7. Nace del caso real: la fila de Agentes decia "no corren solos —
 * ver §7" y §7, corregido el 2026-08-30, dice que SI corren solos y que se puede vender. La tabla
 * mandaba a leer la seccion que la desmiente, y el efecto es el caro: subvender algo que funciona.
 * Se mide sobre el par (afirmacion, seccion citada), no sobre el archivo entero — buscar las dos
 * frases sueltas en todo el .md absuelve cualquier mencion lejana.
 */
export function contradiceASiete(fuente, filas) {
  const desde = fuente.indexOf("## 7. Lo que NO se puede prometer");
  if (desde < 0) return [];
  const hasta = fuente.indexOf("\n## ", desde + 1);
  const siete = fuente.slice(desde, hasta < 0 ? undefined : hasta);
  const sieteDiceQueCorren = /agentes SÍ corren solos|corren todos los días sin que hagas nada/i.test(siete);

  const choques = [];
  for (const fila of filas) {
    if (/no corren solos/i.test(fila.estado) && sieteDiceQueCorren) {
      choques.push({
        modulo: fila.modulo,
        dice: fila.estado,
        pero: "§7 dice que los agentes SÍ corren solos y que se puede vender",
      });
    }
  }
  return choques;
}

function medir() {
  const fuente = readFileSync(CATALOGO, "utf8");
  const filas = parsearModulos(fuente);
  const dashboard = rutaDashboard();

  console.log(`catálogo: ${CATALOGO}`);
  console.log(`módulos declarados: ${filas.length}`);

  if (!dashboard) {
    console.log("VEREDICTO: NO MEDIDO — no encontré el árbol de rutas de onia-platform. Se buscó en:");
    for (const c of CANDIDATOS) console.log(`  ${c}`);
    return 2;
  }
  console.log(`producto:  ${dashboard}`);

  const fantasma = pantallasFantasma(filas, dashboard);
  const choques = contradiceASiete(fuente, filas);

  for (const f of fantasma) {
    console.log(`  ROTO  «${f.modulo}» declara ${f.pantalla} y /${f.raiz} no existe en el producto`);
  }
  for (const c of choques) {
    console.log(`  ROTO  «${c.modulo}» dice "${c.dice}" — ${c.pero}`);
  }

  if (fantasma.length === 0 && choques.length === 0) {
    console.log("VEREDICTO: ok — cada módulo del catálogo tiene su pantalla, y §4 no contradice a §7");
    return 0;
  }
  console.log(
    `VEREDICTO: roto — ${fantasma.length} pantalla(s) fantasma y ${choques.length} contradicción(es).\n` +
      "  El catálogo es lo que Sergio lee para saber qué prometer: un módulo que no existe se vende igual."
  );
  return 1;
}

/**
 * El self-check prueba el instrumento en las DOS direcciones. Un caso que sólo prueba el rojo pasa
 * en verde aunque el gate no encuentre nunca nada — es como esta familia se rinde en silencio.
 */
function selfCheck() {
  const fallos = [];
  const ok = (cond, que) => { if (!cond) fallos.push(que); };

  // rutasDe: subruta y comodín colapsan a su raíz; una celda sin ruta no inventa ninguna.
  ok(JSON.stringify(rutasDe("`/comercio/**`")) === '["comercio"]', "rutasDe no colapsa el comodín");
  ok(JSON.stringify(rutasDe("`/importadora/cotizaciones`")) === '["importadora"]', "rutasDe no colapsa la subruta");
  ok(JSON.stringify(rutasDe("`/agenda`, `/appointments`")) === '["agenda","appointments"]', "rutasDe pierde una ruta");
  ok(rutasDe("sin ruta").length === 0, "rutasDe inventa rutas");

  // pantallasFantasma: encuentra la ausente Y absuelve a la que existe (el caso que YA cumple).
  const dashboard = rutaDashboard();
  if (!dashboard) {
    fallos.push("self-check no pudo correr: falta el árbol de onia-platform");
  } else {
    const inventada = [{ modulo: "X", pantalla: "`/no-existe-jamas`", estado: "🟡", rutas: ["no-existe-jamas"] }];
    ok(pantallasFantasma(inventada, dashboard).length === 1, "no detecta una pantalla ausente");
    const viva = [{ modulo: "Y", pantalla: "`/billing`", estado: "🟡", rutas: ["billing"] }];
    ok(pantallasFantasma(viva, dashboard).length === 0, "marca como fantasma una pantalla que SÍ existe");
  }

  // contradiceASiete: dispara con el texto real que tenía la tabla, y calla cuando ya está corregido.
  const conSiete = "## 7. Lo que NO se puede prometer\nlos agentes SÍ corren solos\n";
  const filaMala = [{ modulo: "Agentes de IA", pantalla: "`/agents`", estado: "🟡 **no corren solos** — ver §7", rutas: ["agents"] }];
  const filaBuena = [{ modulo: "Agentes de IA", pantalla: "`/agents`", estado: "🟡", rutas: ["agents"] }];
  ok(contradiceASiete(conSiete, filaMala).length === 1, "no ve la contradicción entre §4 y §7");
  ok(contradiceASiete(conSiete, filaBuena).length === 0, "inventa una contradicción sobre una fila corregida");

  // Y sobre el archivo REAL: si no parsea la tabla de verdad, todo lo de arriba es teatro.
  const filas = parsearModulos(readFileSync(CATALOGO, "utf8"));
  ok(filas.length >= 10, `la tabla real parseó ${filas.length} módulos, esperaba 10+`);
  ok(filas.every((f) => f.rutas.length > 0), "hay módulos reales sin ninguna ruta parseada");

  if (fallos.length) {
    console.log("SELF-CHECK ROTO:");
    for (const f of fallos) console.log(`  ✗ ${f}`);
    return 1;
  }
  console.log(`self-check ok — ${filas.length} módulos parseados del catálogo real`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(process.argv.includes("--self-check") ? selfCheck() : medir());
}
