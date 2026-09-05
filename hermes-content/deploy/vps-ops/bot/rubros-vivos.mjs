#!/usr/bin/env node
// Cruza los rubros que el bot RECITA contra los que el producto VENDE de verdad.
//
// Por que existe: el catalogo del bot se desincronizo del alta DOS veces, y las dos en la misma
// direccion — subvendiendo. El 2026-08-13 le decia "en construcción" a comercio e importadora; el
// 2026-09-05, a servicios profesionales, y a estetica ni la nombraba, mientras las cinco se podian
// contratar en app.onia.com.bo/register. Ninguna de las tres cifras del carril (simulador, widget,
// avisos) puede ver esto: todas miran si SALE un mensaje, no si lo que dice es verdad.
//
// La fuente de verdad es `RUBROS_ACTIVOS` en onia-platform — la lista que la pantalla de alta
// OFRECE y que el endpoint ACEPTA. Vive en el OTRO repo, y por eso esto es un gate aparte y no un
// test de la cadena `npm test`: un test que depende de un repo vecino da rojo falso en todo
// worktree que no lo tenga, y ese rojo traba el merge de los 15 carriles.
//
// Salidas:  0 = coinciden · 1 = divergen (alguien tiene que barrer) · 2 = NO MEDIDO
// El 2 nunca es verde: si no encuentra el otro repo lo dice, en vez de aprobar por defecto — que
// es como esta familia de gates falla abierto.
//
//   node rubros-vivos.mjs [--self-check]

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

import { MODULOS_LISTOS, PRODUCTOS } from "./config.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));

/**
 * Que rubro de onia-platform es cada modulo del bot. Explicito a proposito: las dos listas usan
 * vocabularios distintos ("proveedores" aca, "proveegest-electrico" alla) y adivinar el mapeo por
 * parecido de nombre es como se cuela un rubro sin que nadie lo note.
 */
export const TRACK_POR_MODULO = Object.freeze({
  dental: "dentagest-clinical",
  comercio: "gestios-general",
  proveedores: "proveegest-electrico",
  servicios: "gestios-servicios-profesionales",
  estetica: "esteticagest-clinical",
});

const CANDIDATOS = [
  "/root/loops/onia-platform/lib/platform/rubros-activos.ts",
  "/root/loops/onia-platform-chatbot/lib/platform/rubros-activos.ts",
  resolve(AQUI, "../../../../../onia-platform/lib/platform/rubros-activos.ts"),
];

/** La ruta del archivo fuente, o null si este arbol no tiene el otro repo. */
export function rutaRubrosActivos(candidatos = CANDIDATOS) {
  return candidatos.find((ruta) => existsSync(ruta)) || null;
}

/**
 * Los trackId de RUBROS_ACTIVOS. Se leen del bloque de la constante y con los comentarios
 * QUITADOS: el archivo nombra `vetgest-clinical` y `ganadero-offline` en comentarios que explican
 * por que NO se ofrecen, y un regex ingenuo los contaria como activos — o sea, el gate aprobaria
 * justo los dos rubros que no se venden.
 */
export function parsearRubrosActivos(fuente) {
  const desde = fuente.indexOf("export const RUBROS_ACTIVOS");
  if (desde === -1) throw new Error("no encontre RUBROS_ACTIVOS: el archivo cambio de forma");
  const hasta = fuente.indexOf("] as const", desde);
  if (hasta === -1) throw new Error("no encontre el cierre de RUBROS_ACTIVOS");
  const bloque = fuente
    .slice(desde, hasta)
    .split("\n")
    .filter((linea) => !linea.trim().startsWith("//"))
    .join("\n");
  return [...bloque.matchAll(/\bid:\s*"([^"]+)"/g)].map((m) => m[1]);
}

/** Compara las dos listas. Devuelve las dos direcciones por separado: se arreglan en repos distintos. */
export function comparar(activos, listos = MODULOS_LISTOS, mapa = TRACK_POR_MODULO) {
  const declarados = new Set(Object.values(mapa));
  const tracksDelBot = new Set([...listos].map((key) => mapa[key]).filter(Boolean));

  return {
    // Produccion los vende y el bot no los ofrece: plata que se va. Es la direccion que fallo dos veces.
    subvendidos: activos.filter((track) => !tracksDelBot.has(track)),
    // El bot los ofrece y el alta no los acepta: promete lo que no se puede contratar.
    sobrevendidos: [...tracksDelBot].filter((track) => !activos.includes(track)),
    // Un rubro nuevo alla que el bot no sabe ni nombrar: hay que decidirlo, no adivinarlo.
    sinMapear: activos.filter((track) => !declarados.has(track)),
  };
}

function medir() {
  const ruta = rutaRubrosActivos();
  if (!ruta) {
    console.log("NO MEDIDO: este arbol no tiene onia-platform (probe " + CANDIDATOS.length + " rutas).");
    console.log("  El cruce necesita lib/platform/rubros-activos.ts del otro repo.");
    return 2;
  }

  let activos;
  try {
    activos = parsearRubrosActivos(readFileSync(ruta, "utf8"));
  } catch (err) {
    console.log(`NO MEDIDO: ${err.message}`);
    console.log(`  fuente: ${ruta}`);
    return 2;
  }
  if (!activos.length) {
    console.log(`NO MEDIDO: lei 0 rubros en ${ruta} — el parseo quedo viejo, no el catalogo`);
    return 2;
  }

  const { subvendidos, sobrevendidos, sinMapear } = comparar(activos);
  console.log(`fuente: ${ruta}`);
  console.log(`produccion vende ${activos.length}: ${activos.join(", ")}`);
  console.log(`el bot ofrece ${MODULOS_LISTOS.size}: ${[...MODULOS_LISTOS].join(", ")}`);

  for (const track of subvendidos) console.log(`  SUBVENDE  ${track} — se contrata hoy y el bot no lo ofrece`);
  for (const track of sobrevendidos) console.log(`  SOBREVENDE ${track} — el bot lo ofrece y el alta no lo acepta`);
  for (const track of sinMapear) console.log(`  SIN MAPEAR ${track} — rubro nuevo: decidir su modulo en TRACK_POR_MODULO`);

  const roto = subvendidos.length + sobrevendidos.length + sinMapear.length;
  console.log(roto ? `VEREDICTO: divergen en ${roto}` : "VEREDICTO: ok — el bot ofrece exactamente lo que se vende");
  return roto ? 1 : 0;
}

/** El instrumento probado en las DOS direcciones: uno que solo sabe decir "ok" no sirve de gate. */
function selfCheck() {
  const casos = [
    ["ok", ["dentagest-clinical"], new Set(["dental"]), { subvendidos: 0, sobrevendidos: 0 }],
    ["subvende", ["dentagest-clinical", "esteticagest-clinical"], new Set(["dental"]), { subvendidos: 1, sobrevendidos: 0 }],
    ["sobrevende", ["dentagest-clinical"], new Set(["dental", "estetica"]), { subvendidos: 0, sobrevendidos: 1 }],
  ];
  let fallos = 0;
  for (const [nombre, activos, listos, esperado] of casos) {
    const r = comparar(activos, listos);
    const ok = r.subvendidos.length === esperado.subvendidos && r.sobrevendidos.length === esperado.sobrevendidos;
    console.log(`  ${ok ? "ok  " : "FALLA"} ${nombre}`);
    if (!ok) fallos++;
  }

  // El parseo NO puede contar los rubros que los comentarios nombran para explicar que no se ofrecen.
  const fuente = `export const RUBROS_ACTIVOS = [
  { id: "dentagest-clinical", titulo: "Clínica dental" },
  // Veterinaria NO se ofrece: { id: "vetgest-clinical" }
] as const satisfies readonly`;
  const leidos = parsearRubrosActivos(fuente);
  const okComentario = leidos.length === 1 && leidos[0] === "dentagest-clinical";
  console.log(`  ${okComentario ? "ok  " : "FALLA"} ignora los rubros nombrados en comentarios`);
  if (!okComentario) fallos++;

  // Y el catalogo del bot tiene que estar mapeado entero, o el cruce mide de menos sin avisar.
  const sinMapa = [...MODULOS_LISTOS].filter((key) => !TRACK_POR_MODULO[key]);
  console.log(`  ${sinMapa.length ? "FALLA" : "ok  "} todo modulo listo tiene su track${sinMapa.length ? `: falta ${sinMapa}` : ""}`);
  if (sinMapa.length) fallos++;

  const huerfanos = Object.keys(TRACK_POR_MODULO).filter((key) => !PRODUCTOS.some((p) => p.key === key));
  console.log(`  ${huerfanos.length ? "FALLA" : "ok  "} el mapa no inventa modulos${huerfanos.length ? `: sobra ${huerfanos}` : ""}`);
  if (huerfanos.length) fallos++;

  console.log(fallos ? `SELF-CHECK: ${fallos} fallo(s)` : "SELF-CHECK: ok");
  return fallos ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(process.argv.includes("--self-check") ? selfCheck() : medir());
}
