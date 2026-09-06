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
import { execFileSync } from "node:child_process";

const AQUI = dirname(fileURLToPath(import.meta.url));

const CATALOGO = resolve(AQUI, "../hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md");

/**
 * Donde vive el arbol de rutas del producto. Se prueban en orden.
 *
 * ⚠️ Acá decía "gana el primero que exista: el worktree de este carril primero, porque es el
 * unico que tiene lo que todavia no se mergeo". Eso era cierto para el carril que lo escribio y
 * FALSO para cualquier otro que corra el gate: el primer candidato es el worktree del carril
 * chatbot, que vive en una RAMA DE CARRIL y el 2026-09-06 estaba 5 commits atras de master.
 * Medir el catalogo de `main` contra un arbol de producto atrasado es el fosil que esta memoria
 * ya tiene documentado dos veces, y falla en la direccion cara: VERDE sobre un modulo que el
 * catalogo vende y master ya no tiene. Ese dia no dio un veredicto falso de casualidad (los dos
 * arboles tenian las mismas 24 carpetas); la casualidad no es una garantia.
 *
 * Ahora gana el arbol CONFIABLE — el que esta en la rama base y al dia— y si no hay ninguno se
 * usa el primero que exista pero DICIENDOLO, junto con el que quedo afuera y por que.
 */
const CANDIDATOS = [
  "/root/loops/onia-platform/app/(dashboard)",
  "/root/loops/onia-platform-chatbot/app/(dashboard)",
  resolve(AQUI, "../../onia-platform/app/(dashboard)"),
];

/** La rama base del repo del producto. Ese repo NO usa `main`. */
const RAMA_BASE = "master";

/**
 * Rama y atraso del repo que contiene esa carpeta. Devuelve null si no se puede preguntar —
 * degradar con gracia importa: un gate que se cae porque git no contesta es un rojo ambiental,
 * y un rojo ambiental en la cadena `npm test` traba el merge de los quince carriles.
 */
export function estadoGit(ruta) {
  try {
    const q = (args) =>
      execFileSync("git", ["-C", ruta, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    return { rama: q(["rev-parse", "--abbrev-ref", "HEAD"]), atras: Number(q(["rev-list", "--count", `HEAD..origin/${RAMA_BASE}`])) };
  } catch {
    return null;
  }
}

/** Un arbol sirve de referencia si esta en la rama base y no le falta ningun commit de ella. */
function esConfiable(estado) {
  return estado !== null && estado.rama === RAMA_BASE && estado.atras === 0;
}

/**
 * Elige el arbol y explica la eleccion. Se separa de `rutaDashboard` para poder probarla con un
 * `estadoDe` inyectado: sin eso el caso dependeria del estado real de los worktrees del VPS, que
 * cambia solo, y un test que cambia solo no prueba nada.
 */
export function elegirArbol(candidatos = CANDIDATOS, estadoDe = estadoGit) {
  const existentes = candidatos.filter((ruta) => existsSync(ruta));
  if (existentes.length === 0) return { ruta: null, aviso: null, descartados: [] };

  const conEstado = existentes.map((ruta) => ({ ruta, estado: estadoDe(ruta) }));
  const bueno = conEstado.find((c) => esConfiable(c.estado));
  const elegido = bueno || conEstado[0];
  const descartados = conEstado.filter((c) => c.ruta !== elegido.ruta).map((c) => describir(c));

  return {
    ruta: elegido.ruta,
    // Sin arbol confiable el veredicto puede no valer para la rama base: se dice, no se calla.
    aviso: bueno ? null : `el arbol medido NO es de ${RAMA_BASE} al dia (${describir(elegido)}) — el veredicto puede no valer para la rama base`,
    descartados,
  };
}

function describir({ ruta, estado }) {
  if (!estado) return `${ruta} (no pude preguntarle a git)`;
  return `${ruta} (rama ${estado.rama}, ${estado.atras} commit(s) atras de ${RAMA_BASE})`;
}

/** La carpeta de rutas del producto, o null si este arbol no tiene el otro repo. */
export function rutaDashboard(candidatos = CANDIDATOS) {
  return elegirArbol(candidatos).ruta;
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
  const { ruta: dashboard, aviso, descartados } = elegirArbol();

  console.log(`catálogo: ${CATALOGO}`);
  console.log(`módulos declarados: ${filas.length}`);

  if (!dashboard) {
    console.log("VEREDICTO: NO MEDIDO — no encontré el árbol de rutas de onia-platform. Se buscó en:");
    for (const c of CANDIDATOS) console.log(`  ${c}`);
    return 2;
  }
  console.log(`producto:  ${describir({ ruta: dashboard, estado: estadoGit(dashboard) })}`);
  // Nombrar al que queda afuera: un gate que elige en silencio entre dos copias hace creer que
  // sólo había una, y ahí es donde un veredicto se mide contra el árbol equivocado sin que nadie
  // lo note. Mismo patrón que el cron que elegía entre dos copias del mismo script.
  for (const d of descartados) console.log(`           (no medido: ${d})`);
  if (aviso) console.log(`  AVISO  ${aviso}`);

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
  //
  // El árbol de prueba es ESTE repo (`scripts/`, que tiene `scripts/loops` adentro), NO el hermano.
  // Antes se medía contra `rutaDashboard()` real y, sin el otro repo, el self-check devolvía 1:
  // un rojo por AMBIENTE. Como este self-check corre en la cadena `npm test`, ese rojo traba el
  // merge de LOS QUINCE CARRILES por algo que no tiene nada que ver con el cambio de nadie.
  // La ausencia del hermano la reporta `medir()` con su exit 2 (NO MEDIDO), que es su lugar.
  const inventada = [{ modulo: "X", pantalla: "`/no-existe-jamas`", estado: "🟡", rutas: ["no-existe-jamas"] }];
  ok(pantallasFantasma(inventada, AQUI).length === 1, "no detecta una pantalla ausente");
  const viva = [{ modulo: "Y", pantalla: "`/loops`", estado: "🟡", rutas: ["loops"] }];
  ok(pantallasFantasma(viva, AQUI).length === 0, "marca como fantasma una pantalla que SÍ existe");

  // Y la puerta del NO MEDIDO: sin ningún candidato no inventa un árbol, que es lo que hace que
  // `medir()` salga con 2 en vez de aprobar en verde sin haber mirado nada.
  ok(rutaDashboard(["/no/existe/jamas"]) === null, "rutaDashboard inventa un árbol que no está");

  // elegirArbol: el caso que motivó el arreglo. Dos árboles existen, el PRIMERO de la lista está
  // en una rama de carril y atrasado (así estaba el worktree del chatbot el 2026-09-06) — hay que
  // saltearlo y quedarse con el de la rama base al día, aunque venga después.
  const dos = [AQUI, resolve(AQUI, "..")];
  const atrasadoPrimero = (r) => (r === dos[0] ? { rama: "claude/otro-carril", atras: 5 } : { rama: RAMA_BASE, atras: 0 });
  const elegido = elegirArbol(dos, atrasadoPrimero);
  ok(elegido.ruta === dos[1], "elige el árbol atrasado de una rama de carril teniendo uno al día");
  ok(elegido.aviso === null, "avisa aunque el árbol elegido SEA de la rama base al día");
  ok(elegido.descartados.length === 1 && /5 commit/.test(elegido.descartados[0]), "no nombra al candidato que quedó afuera");

  // La dirección contraria, que es la que se rinde en silencio: si NINGUNO es confiable, se mide
  // igual (un veredicto vale más que ninguno) pero el aviso es obligatorio. Sin este caso, un
  // `aviso` siempre-null pasaría el caso de arriba y nadie se enteraría nunca.
  const ningunoSirve = elegirArbol(dos, () => ({ rama: "claude/x", atras: 3 }));
  ok(ningunoSirve.ruta === dos[0], "sin árbol confiable no cae al primero que existe");
  // El patrón busca las PIEZAS que el aviso tiene que llevar (la rama base y la rama medida), no
  // la oración literal: escrito como frase exacta este caso ya falló una vez por un "de" de más,
  // y un test que se rompe al reescribir el copy se termina relajando hasta que no mide nada.
  ok(new RegExp(RAMA_BASE).test(ningunoSirve.aviso || "") && /claude\/x/.test(ningunoSirve.aviso || ""),
    "no avisa que midió contra un árbol que no es la rama base");

  // Y que git no conteste no puede tumbar el gate: degrada a "no confiable", nunca a excepción.
  const sinGit = elegirArbol(dos, () => null);
  ok(sinGit.ruta === dos[0] && sinGit.aviso !== null, "no degrada con gracia cuando git no contesta");

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
