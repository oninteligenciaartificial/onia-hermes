#!/usr/bin/env node
/**
 * bot_vivo_tiene_el_codigo.mjs — ¿el PROCESO del bot corre el código que el repo dice?
 *
 *   node scripts/bot_vivo_tiene_el_codigo.mjs              # medición viva (0 al día · 1 desfasado · 2 NO MEDIDO)
 *   node scripts/bot_vivo_tiene_el_codigo.mjs --self-check # casos puros, sin docker ni red
 *
 * ────────────────────────────────────────────────────────────────────────────────────────
 * POR QUÉ EXISTE, y por qué no lo cubre ninguno de los que ya están
 *
 * Los dos gates de deploy del bot razonan por COMMITS contra PEDIDO: `deploy_sin_pedido.mjs`
 * («hay trabajo varado y ningún pedido que lo cubra») y `deploy_ya_ocurrio.mjs` («una cola
 * pide un deploy que ya pasó»). Los dos son correctos y los dos son ciegos a lo mismo:
 * **ninguno le pregunta al proceso que atiende al prospecto.**
 *
 * Y el bot tiene una forma de falla propia, ya medida: corre DENTRO del contenedor
 * `onia-center` sobre `/tmp/onia-bot/` (rsync desde `/opt/onia/bot`) y **Node cachea los
 * módulos**, así que copiar sin reiniciar no cambia nada. En ese estado el deploy «ocurrió»
 * —los archivos viajaron, los commits están— los gates de commits quedan verdes, y el bot
 * sigue contestando con el código viejo. El verde tapa exactamente el caso que importa.
 *
 * Medido a mano el 2026-09-25 (y esa medición a mano es el motivo de este archivo): el bot
 * vivo no tenía `slotsElegibles` y conservaba el `slice(0, 2)` de los tres puntos que el
 * arreglo del 24-sep ya había corregido en el repo. O sea: los horarios 3 a 5 seguían
 * inalcanzables para cualquiera que escribiera ese día, con `demo:agendada` en verde,
 * `deploy_sin_pedido` diciendo «ya hay pedido» y 0 de 43 conversaciones reservadas.
 *
 * LAS DOS PREGUNTAS SON DISTINTAS, y por eso hay dos veredictos:
 *   1. ¿el archivo que corre es el del repo?            -> `desfasado`
 *   2. ¿el proceso arrancó DESPUÉS de la última copia?  -> `copiado_sin_reiniciar`
 * La (2) es la que ningún otro instrumento mira, y es la que se lee como éxito.
 *
 * TRI-ESTADO A PROPÓSITO: sin docker (o sin el contenedor) sale **2 = NO MEDIDO**, nunca
 * verde. Un chequeo que confunde «no pude preguntar» con «me dijeron que sí» es el falso
 * verde que este archivo existe para no repetir.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR_REPO = path.join(RAIZ, "hermes-content", "deploy", "vps-ops", "bot");
const CONTENEDOR = "onia-center";
const DIR_VIVO = "/tmp/onia-bot";

// --- la decisión (pura: ni docker, ni disco, ni reloj) ------------------------

/**
 * @param {object} medida
 * @param {Array<{nombre:string, hashRepo:string, hashVivo:string|null, mtimeVivo:number|null}>} medida.archivos
 * @param {number|null} medida.arranqueProceso  epoch ms en que arrancó el proceso vivo
 */
export function veredicto({ archivos, arranqueProceso } = {}) {
  // NO MEDIDO gana sobre todo: sin sujetos o sin proceso no hay nada que afirmar.
  if (!Array.isArray(archivos) || archivos.length === 0) {
    return { estado: "no_medido", codigo: 2, lineas: ["no se pudo listar el bot vivo"], distintos: [] };
  }

  const distintos = archivos.filter((a) => a.hashVivo === null || a.hashVivo !== a.hashRepo);
  if (distintos.length > 0) {
    return {
      estado: "desfasado",
      codigo: 1,
      distintos: distintos.map((a) => a.nombre),
      lineas: [
        `${distintos.length} archivo(s) del bot NO son los del repo — el prospecto habla con el código viejo:`,
        ...distintos.map((a) => `  ${a.nombre}${a.hashVivo === null ? " (no llegó nunca)" : ""}`),
      ],
    };
  }

  // Todos iguales. Falta la segunda pregunta, la que nadie hace.
  if (!Number.isFinite(arranqueProceso)) {
    return {
      estado: "no_medido",
      codigo: 2,
      distintos: [],
      lineas: ["los archivos coinciden, pero no se pudo leer cuándo arrancó el proceso: sin eso no se sabe si los cargó"],
    };
  }
  const copiaMasNueva = archivos.reduce((max, a) => (Number.isFinite(a.mtimeVivo) && a.mtimeVivo > max ? a.mtimeVivo : max), 0);
  if (copiaMasNueva > arranqueProceso) {
    return {
      estado: "copiado_sin_reiniciar",
      codigo: 1,
      distintos: [],
      lineas: [
        "los archivos son los del repo pero el proceso arrancó ANTES de la última copia:",
        "  Node cacheó los módulos viejos — el deploy no llegó al prospecto hasta que se reinicie",
      ],
    };
  }
  return { estado: "al_dia", codigo: 0, distintos: [], lineas: ["el bot vivo corre el código del repo, y arrancó después de la última copia"] };
}

// --- medición viva -----------------------------------------------------------

/** El `docker` que sirve en esta máquina: el shim de nodo-casa delega por SSH al VPS. */
function comandoDocker() {
  return fs.existsSync("/root/bin/docker") ? "/root/bin/docker" : "docker";
}

function enElContenedor(guion) {
  return execFileSync(comandoDocker(), ["exec", CONTENEDOR, "sh", "-c", guion], {
    encoding: "utf8",
    timeout: 120_000,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

/**
 * Hash del contenido normalizado. El `\r` se saca a propósito: un archivo que viajó en un tar
 * armado en Windows llega con CRLF y sería un rojo que no cambia una coma de lo que el bot hace.
 */
export function hashDeContenido(texto) {
  return crypto.createHash("md5").update(String(texto).replace(/\r/g, "")).digest("hex");
}

/**
 * Los sujetos se DERIVAN del disco, no de una lista escrita: una lista se queda corta el día que
 * alguien agrega un módulo, y justo ese módulo nuevo es el que no viajó. Los `.test.mjs` quedan
 * afuera porque el deploy no los instala.
 */
export function sujetosDelRepo(dir = DIR_REPO) {
  return fs
    .readdirSync(dir)
    .filter((n) => n.endsWith(".mjs") && !n.endsWith(".test.mjs"))
    .sort();
}

function medirVivo() {
  const nombres = sujetosDelRepo();
  const archivos = [];
  let arranqueProceso = null;

  // Un solo `docker exec`: cada uno desde casa es un SSH, y 40 archivos serían 40 viajes.
  const salida = enElContenedor(
    `for f in ${DIR_VIVO}/*.mjs; do printf '%s\\t%s\\n' "$f" "$(stat -c %Y "$f" 2>/dev/null)"; sed 's/\\r//' "$f" | md5sum | cut -d' ' -f1; done`,
  );
  const vivo = new Map();
  const lineas = salida.split("\n");
  for (let i = 0; i + 1 < lineas.length; i += 2) {
    const [ruta, mtime] = lineas[i].split("\t");
    if (!ruta) continue;
    vivo.set(path.basename(ruta.trim()), { hash: (lineas[i + 1] || "").trim(), mtime: Number(mtime) * 1000 });
  }

  for (const nombre of nombres) {
    const delVivo = vivo.get(nombre) || null;
    archivos.push({
      nombre,
      hashRepo: hashDeContenido(fs.readFileSync(path.join(DIR_REPO, nombre), "utf8")),
      hashVivo: delVivo ? delVivo.hash : null,
      mtimeVivo: delVivo ? delVivo.mtime : null,
    });
  }

  // `ps -eo lstart` y no el `.Created` del contenedor: el contenedor no se recrea cuando el bot
  // se reinicia, así que su fecha de creación contestaría por el proceso equivocado.
  try {
    const ps = enElContenedor(`ps -eo lstart,args | grep -F "${DIR_VIVO}" | grep -v grep | head -1`);
    const marca = Date.parse(ps.trim().slice(0, 24));
    if (Number.isFinite(marca)) arranqueProceso = marca;
  } catch {
    arranqueProceso = null;
  }

  return { archivos, arranqueProceso };
}

// --- self-check (lo que entra a la cadena) -----------------------------------

function selfCheck() {
  const ok = (cond, msg) => {
    if (!cond) {
      console.error(`FALLA: ${msg}`);
      process.exitCode = 1;
    }
  };
  const A = (extra = {}) => ({ nombre: "config.mjs", hashRepo: "aa", hashVivo: "aa", mtimeVivo: 1000, ...extra });

  ok(veredicto({ archivos: [A()], arranqueProceso: 2000 }).codigo === 0, "iguales y reiniciado despues = al dia");
  ok(veredicto({ archivos: [A({ hashVivo: "bb" })], arranqueProceso: 2000 }).codigo === 1, "hash distinto = desfasado");
  ok(
    veredicto({ archivos: [A({ hashVivo: null })], arranqueProceso: 2000 }).distintos.length === 1,
    "un archivo que no llego nunca tiene que NOMBRARSE, no contarse como ausencia de novedad",
  );
  // El caso que ningún otro gate ve.
  const tarde = veredicto({ archivos: [A({ mtimeVivo: 3000 })], arranqueProceso: 2000 });
  ok(tarde.estado === "copiado_sin_reiniciar" && tarde.codigo === 1, "copiado DESPUES del arranque = Node cacheo el viejo");
  // Y los dos modos de no saber, que no pueden salir verdes.
  ok(veredicto({ archivos: [] }).codigo === 2, "sin sujetos = NO MEDIDO");
  ok(veredicto({ archivos: [A()], arranqueProceso: null }).codigo === 2, "sin arranque del proceso = NO MEDIDO");
  ok(veredicto({}).codigo === 2, "sin medida = NO MEDIDO");
  // Normalizar CRLF no es cosmético: sin esto un tar de Windows pinta rojo todo el bot.
  ok(hashDeContenido("a\r\nb") === hashDeContenido("a\nb"), "CRLF y LF tienen que hashear igual");
  ok(sujetosDelRepo().includes("run-turn.mjs"), "los sujetos se derivan del disco y run-turn.mjs es uno");
  ok(!sujetosDelRepo().some((n) => n.endsWith(".test.mjs")), "los tests no los instala el deploy: no son sujetos");

  if (!process.exitCode) console.log("self-check OK — la lógica distingue desfasado, copiado-sin-reiniciar y NO MEDIDO");
}

// --- main --------------------------------------------------------------------

const ESTE = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === ESTE) {
  if (process.argv.includes("--self-check")) {
    selfCheck();
  } else {
    let medida;
    try {
      medida = medirVivo();
    } catch (error) {
      console.log(`NO MEDIDO: no se pudo preguntarle al bot vivo (${String(error.message).split("\n")[0]})`);
      process.exit(2);
    }
    const r = veredicto(medida);
    const etiqueta = { al_dia: "OK", desfasado: "ROJO", copiado_sin_reiniciar: "ROJO", no_medido: "NO MEDIDO" }[r.estado];
    console.log(`${etiqueta} bot vivo (${CONTENEDOR}:${DIR_VIVO}) — ${medida.archivos.length} archivo(s) mirado(s)`);
    for (const linea of r.lineas) console.log(linea);
    if (r.codigo === 1) console.log("\nEl arreglo está commiteado y NO corre. Se destraba con el pedido de deploy del bot, no a mano.");
    process.exit(r.codigo);
  }
}
