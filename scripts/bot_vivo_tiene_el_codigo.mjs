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
    // Desfasado tiene DOS causas con curas OPUESTAS, y mezclarlas manda a pedir la firma
    // equivocada. El publicador publica desde `origin/main`: un archivo que ya está ahí sólo
    // espera el `ok` de Sergio Urcullo, y uno que todavía difiere no lo trae ningún deploy.
    const esperanFirma = distintos.filter((a) => a.enMain === true);
    const esperanMerge = distintos.filter((a) => a.enMain === false);
    const sinLado = distintos.filter((a) => a.enMain !== true && a.enMain !== false);
    const nombres = (lista) => lista.map((a) => `  ${a.nombre}${a.hashVivo === null ? " (no llegó nunca)" : ""}`);

    // No saber de qué lado está un archivo no le inventa remedio: si no se pudo derivar
    // NINGUNO, el desfase es cierto pero la cura no, y una cura equivocada cuesta más que
    // no medir. NO MEDIDO gana, igual que arriba.
    if (esperanFirma.length === 0 && esperanMerge.length === 0) {
      return {
        estado: "no_medido",
        codigo: 2,
        distintos: distintos.map((a) => a.nombre),
        esperanFirma: [],
        esperanMerge: [],
        lineas: [
          `${distintos.length} archivo(s) del bot NO son los del repo, pero no se pudo derivar si están en origin/main:`,
          ...nombres(sinLado),
          "  sin eso no se sabe si falta la firma o falta el merge, y son remedios opuestos",
        ],
      };
    }

    const lineas = [`${distintos.length} archivo(s) del bot NO son los del repo — el prospecto habla con el código viejo:`];
    if (esperanFirma.length > 0) {
      lineas.push(
        `${esperanFirma.length} ya está(n) en origin/main — espera(n) FIRMA:`,
        ...nombres(esperanFirma),
        "  se destraba con el pedido de deploy del bot, no a mano",
      );
    }
    if (esperanMerge.length > 0) {
      lineas.push(
        `${esperanMerge.length} difiere(n) de origin/main — espera(n) MERGE:`,
        ...nombres(esperanMerge),
        "  el publicador publica desde origin/main: ningún deploy los trae, y pedir la firma no los destraba",
      );
    }
    if (sinLado.length > 0) {
      lineas.push(`${sinLado.length} sin lado derivado (remedio desconocido):`, ...nombres(sinLado));
    }
    return { estado: "desfasado", codigo: 1, distintos: distintos.map((a) => a.nombre), esperanFirma, esperanMerge, lineas };
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

/** Un patrón de la lista blanca del deploy (`*.mjs`, `knowledge.onia.json`) a RegExp. */
export function globAregex(patron) {
  return new RegExp(`^${patron.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")}$`);
}

/**
 * QUÉ instala el deploy — leído de `deploy-bot.sh`, nunca copiado acá.
 *
 * Nace de un agujero medido el 2026-09-25: este gate miraba `*.mjs` y el deploy instala además
 * `*.sh` y tres `.json`. Entre esos `.json` está `knowledge.onia.json`, que es lo que el bot
 * RECITA. En producción le faltaba la clave `campanas` —las 9 respuestas de los enlaces de
 * WhatsApp de onia.com.bo— y este gate, que salía rojo por otros 13 archivos, no lo nombró
 * nunca: no estaba rojo, estaba INVISIBLE, que es el modo de falla que más caro sale.
 *
 * Si no se puede leer el guion, TIRA: el que llama lo convierte en NO MEDIDO. Devolver una
 * lista por defecto sería volver a curar a mano lo que este cambio vino a derivar.
 */
export function patronesDelDeploy(guion = path.join(DIR_REPO, "deploy-bot.sh")) {
  const linea = fs.readFileSync(guion, "utf8").match(/^PATRONES=\(([^)]*)\)/m);
  if (!linea) throw new Error(`no encontré la lista blanca PATRONES=(...) en ${guion}`);
  const patrones = [...linea[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  if (patrones.length === 0) throw new Error(`la lista blanca de ${guion} salió vacía`);
  return patrones;
}

/**
 * Los sujetos se DERIVAN del disco y de la lista blanca del deploy, no de una lista escrita acá:
 * una lista se queda corta el día que alguien agrega un módulo —o un patrón—, y justo ése es el
 * que no viajó.
 *
 * Los `.test.mjs` quedan afuera a propósito, y el motivo NO es que el deploy no los instale
 * (los instala: `*.mjs` los matchea, y el 2026-09-03 se midieron tres viajando). Es que un test
 * no le contesta a ningún prospecto: su desfase no cambia una coma de lo que el bot dice.
 */
export function sujetosDelRepo(dir = DIR_REPO) {
  const patrones = patronesDelDeploy().map(globAregex);
  return fs
    .readdirSync(dir)
    .filter((n) => !n.endsWith(".test.mjs") && patrones.some((re) => re.test(n)))
    .sort();
}

// Exportada para que `deploy_ya_ocurrio.mjs` juzgue las lineas del MOTOR con ESTA medicion y no
// con una copia propia: su cabecera ya lo nombraba como ciego a esta frontera.
/**
 * Los sujetos del bot que DIFIEREN de `origin/main` — o sea, los que ningún deploy puede traer
 * todavía porque el publicador publica desde ahí.
 *
 * Se FETCHEA antes: sin eso se comparan refs de disco y el gate falla EN VERDE, que es la
 * trampa que este repo ya tiene escrita. Si no se puede preguntar (sin red, sin ref) devuelve
 * `null` y el veredicto sale NO MEDIDO: "no pude preguntar" no es "me dijeron que no".
 *
 * @returns {Set<string>|null} nombres base que difieren, o null si no se pudo derivar
 */
export function difierenDeMain() {
  const git = (args) => execFileSync("git", args, { cwd: RAIZ, encoding: "utf8", timeout: 120_000, stdio: ["ignore", "pipe", "pipe"] });
  try {
    git(["fetch", "origin", "--quiet"]);
    return new Set(
      git(["diff", "--name-only", "origin/main", "--", DIR_REPO])
        .split("\n")
        .map((l) => path.basename(l.trim()))
        .filter(Boolean),
    );
  } catch {
    return null;
  }
}

export function medirVivo() {
  const nombres = sujetosDelRepo();
  const archivos = [];
  let arranqueProceso = null;
  const fueraDeMain = difierenDeMain();

  // Un solo `docker exec`: cada uno desde casa es un SSH, y 70 archivos serían 70 viajes.
  // El `[ -f ]` no es de adorno: un patrón sin match queda LITERAL en sh y `sed` sobre él
  // hashearía vacío — un archivo ausente se leería como uno presente y distinto.
  const globs = patronesDelDeploy().map((p) => `${DIR_VIVO}/${p}`).join(" ");
  const salida = enElContenedor(
    `for f in ${globs}; do [ -f "$f" ] || continue; printf '%s\\t%s\\n' "$f" "$(stat -c %Y "$f" 2>/dev/null)"; sed 's/\\r//' "$f" | md5sum | cut -d' ' -f1; done`,
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
      // De qué lado de `origin/main` está: decide si el remedio es la firma o el merge.
      enMain: fueraDeMain === null ? null : !fueraDeMain.has(nombre),
    });
  }

  // Se le pregunta al PROCESO y no al `.Created` del contenedor: el contenedor no se recrea
  // cuando el bot se reinicia, así que su fecha de creación contestaría por el proceso
  // equivocado. Y se pregunta con `etime` y no con `lstart` porque `onia-center` es Alpine: su
  // `ps` de busybox rechaza `lstart` y dejaba este gate en NO MEDIDO para siempre (ver el
  // self-check). `etime` lo soportan los dos, con formatos distintos que `epochDeElapsed` cubre.
  try {
    const ps = enElContenedor(`ps -eo etime,args | grep -F "${DIR_VIVO}" | grep -v grep | head -1`);
    arranqueProceso = epochDeElapsed(ps.trim().split(/\s+/)[0] || "", Date.now());
  } catch {
    arranqueProceso = null;
  }

  return { archivos, arranqueProceso };
}

/**
 * El tiempo que lleva corriendo un proceso, llevado al epoch en que arrancó.
 *
 * Existe porque `ps` no habla un solo idioma: procps da `[[DD-]HH:]MM:SS` y el busybox de Alpine
 * —el que corre adentro de `onia-center`— da un formato propio y compacto, `2d03` / `2h06` /
 * `5:30`. Devuelve `null` ante cualquier cosa que no reconozca, incluido el mensaje de error del
 * propio `ps`: no saber cuándo arrancó tiene que seguir siendo NO MEDIDO, nunca "arrancó recién".
 *
 * @param {string} texto  la primera columna de `ps -eo etime,args`
 * @param {number} ahora  epoch ms de referencia
 * @returns {number|null} epoch ms del arranque, o null si no se pudo leer
 */
export function epochDeElapsed(texto, ahora) {
  const t = String(texto || "").trim();
  if (!t) return null;
  const seg = (d, h, m, s) => ((d * 24 + h) * 60 + m) * 60 + s;
  let transcurrido = null;

  // busybox: `2d03` (días+horas) y `2h06` (horas+minutos).
  let m = /^(\d+)([dh])(\d{1,2})$/.exec(t);
  if (m) {
    const [uno, dos] = [Number(m[1]), Number(m[3])];
    transcurrido = m[2] === "d" ? seg(uno, dos, 0, 0) : seg(0, uno, dos, 0);
  }
  // procps: `[[DD-]HH:]MM:SS`. busybox `M:SS` cae acá y significa lo mismo.
  if (transcurrido === null) {
    m = /^(?:(\d+)-)?(?:(\d+):)?(\d{1,2}):(\d{2})$/.exec(t);
    if (m) transcurrido = seg(Number(m[1] || 0), Number(m[2] || 0), Number(m[3]), Number(m[4]));
  }
  if (transcurrido === null || !Number.isFinite(transcurrido)) return null;
  return ahora - transcurrido * 1000;
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
  ok(veredicto({ archivos: [A({ hashVivo: "bb", enMain: true })], arranqueProceso: 2000 }).codigo === 1, "hash distinto = desfasado");
  ok(
    veredicto({ archivos: [A({ hashVivo: null })], arranqueProceso: 2000 }).distintos.length === 1,
    "un archivo que no llego nunca tiene que NOMBRARSE, no contarse como ausencia de novedad",
  );
  // El caso que ningún otro gate ve.
  const tarde = veredicto({ archivos: [A({ mtimeVivo: 3000 })], arranqueProceso: 2000 });
  ok(tarde.estado === "copiado_sin_reiniciar" && tarde.codigo === 1, "copiado DESPUES del arranque = Node cacheo el viejo");
  // EL CASO QUE MANDABA AL REMEDIO OPUESTO (2026-09-26): un archivo desfasado tiene DOS causas
  // y sus curas son contrarias. Si el archivo del repo ES el de `origin/main`, el deploy lo
  // trae y lo que falta es la FIRMA de Sergio Urcullo. Si DIFIERE de `origin/main` —un commit
  // de carril todavía sin mergear— ningún deploy puede traerlo: el publicador publica desde
  // `origin/main`, así que lo que falta es el MERGE y pedir la firma no destraba nada.
  // Medido ese día: de los 5 acusados, 4 esperaban firma y `calcom-booking.mjs` esperaba merge
  // —el arreglo que este mismo carril había commiteado la vuelta anterior— y el gate los metía
  // en una sola lista bajo "Se destraba con el pedido de deploy del bot". Pedirle a Sergio
  // Urcullo una firma que no puede traer el archivo es el modo de falla que esta cola llama
  // "peor que un pendiente fantasma". Su hermano `espejo-check.mjs` ya tenía la guarda.
  const firma = veredicto({ archivos: [A({ hashVivo: "bb", enMain: true })], arranqueProceso: 2000 });
  ok(firma.esperanFirma?.length === 1 && firma.esperanMerge?.length === 0, "el que YA está en origin/main espera FIRMA");
  const merge = veredicto({ archivos: [A({ hashVivo: "bb", enMain: false })], arranqueProceso: 2000 });
  ok(merge.esperanMerge?.length === 1 && merge.esperanFirma?.length === 0, "el que DIFIERE de origin/main espera MERGE, no firma");
  // Se prohíbe la INSTRUCCIÓN, no la palabra: la línea del merge nombra la firma justamente
  // para negarla ("pedir la firma no los destraba"), y eso es lo que hay que poder decir.
  ok(
    merge.lineas.some((l) => /MERGE/.test(l)) && !merge.lineas.some((l) => /se destraba con el pedido de deploy/i.test(l)),
    "el que espera merge NO puede salir con el remedio de la firma",
  );
  // Los dos a la vez: cada uno con su remedio, y ninguno tapa al otro.
  const mixto = veredicto({
    archivos: [A({ nombre: "followup-run.mjs", hashVivo: "bb", enMain: true }), A({ nombre: "calcom-booking.mjs", hashVivo: "bb", enMain: false })],
    arranqueProceso: 2000,
  });
  ok(mixto.codigo === 1 && mixto.esperanFirma.length === 1 && mixto.esperanMerge.length === 1, "firma y merge conviven sin taparse");
  // Y no saber de qué lado está un archivo no puede inventarle un remedio.
  const sinRef = veredicto({ archivos: [A({ hashVivo: "bb", enMain: null })], arranqueProceso: 2000 });
  ok(sinRef.codigo === 2, "sin poder derivar el lado de origin/main, el remedio es NO MEDIDO");

  // Y los dos modos de no saber, que no pueden salir verdes.
  ok(veredicto({ archivos: [] }).codigo === 2, "sin sujetos = NO MEDIDO");
  ok(veredicto({ archivos: [A()], arranqueProceso: null }).codigo === 2, "sin arranque del proceso = NO MEDIDO");
  ok(veredicto({}).codigo === 2, "sin medida = NO MEDIDO");
  // EL CASO QUE DEJÓ AL GATE EN exit 2 PERMANENTE (2026-09-25): el contenedor `onia-center` es
  // Alpine, y su `ps` de busybox NO soporta `lstart` — contesta `ps: bad -o argument 'lstart'`.
  // Así que "los archivos coinciden" salía con `arranqueProceso: null`, o sea NO MEDIDO, SIEMPRE.
  // Y un exit 2 que nunca cambia se lee como "el ambiental de siempre" y se saltea: el gate
  // quedaba vivo y ciego a la vez. Busybox sí da `etime`, pero en formato PROPIO y compacto
  // (`2h06` = 2 h 6 min), no el `[[DD-]HH:]MM:SS` de procps. Se parsean los dos: el mismo gate
  // corre contra Alpine y contra una distro con procps, y ninguno de los dos puede quedar mudo.
  const AHORA = 1_000_000_000_000;
  const min = 60_000;
  ok(epochDeElapsed("2h06", AHORA) === AHORA - (126 * min), "busybox `2h06` son 2 h 6 min");
  ok(epochDeElapsed("2d03", AHORA) === AHORA - (51 * 60 * min), "busybox `2d03` son 2 d 3 h");
  ok(epochDeElapsed("5:30", AHORA) === AHORA - (5 * min + 30_000), "busybox `5:30` son 5 min 30 s");
  ok(epochDeElapsed("01:02:03", AHORA) === AHORA - (62 * min + 3_000), "procps `HH:MM:SS`");
  ok(epochDeElapsed("2-03:04:05", AHORA) === AHORA - (51 * 60 * min + 4 * min + 5_000), "procps `DD-HH:MM:SS`");
  // No saber sigue siendo no saber: un formato que no se reconoce NO puede volverse "arrancó
  // recién", que es la respuesta que pondría el gate en verde justo cuando está más ciego.
  ok(epochDeElapsed("", AHORA) === null, "vacío no es un arranque");
  ok(epochDeElapsed("ps: bad -o argument", AHORA) === null, "el mensaje de error de busybox no es un arranque");

  // Normalizar CRLF no es cosmético: sin esto un tar de Windows pinta rojo todo el bot.
  ok(hashDeContenido("a\r\nb") === hashDeContenido("a\nb"), "CRLF y LF tienen que hashear igual");
  ok(sujetosDelRepo().includes("run-turn.mjs"), "los sujetos se derivan del disco y run-turn.mjs es uno");
  ok(!sujetosDelRepo().some((n) => n.endsWith(".test.mjs")), "un .test.mjs no le contesta a nadie: no es sujeto");

  // EL CASO QUE ABRIÓ EL AGUJERO (2026-09-25): mirar sólo `*.mjs` dejaba fuera el archivo que
  // CONTIENE lo que el bot dice. `knowledge.onia.json` viaja en el deploy y en producción no
  // tiene la clave `campanas` — las 9 respuestas de los enlaces de onia.com.bo — y el gate
  // salía rojo por otros 13 archivos sin nombrar NUNCA a éste.
  ok(sujetosDelRepo().includes("knowledge.onia.json"), "el conocimiento que el bot RECITA es sujeto, no sólo el código que lo lee");
  ok(sujetosDelRepo().includes("webhook-server.sh"), "los .sh son el runtime del bot: el deploy los instala y son sujetos");

  // Y la propiedad que impide que el agujero vuelva: los sujetos NO pueden ser menos que lo que
  // el deploy instala. Se deriva del propio `deploy-bot.sh`, así que agregar un patrón allá
  // arrastra el gate solo. Una lista copiada a mano es como nació este bug.
  const patrones = patronesDelDeploy();
  ok(patrones.length > 0, "los patrones se leen de deploy-bot.sh, no se escriben acá");
  for (const patron of patrones) {
    const enElRepo = fs.readdirSync(DIR_REPO).filter((n) => !n.endsWith(".test.mjs") && globAregex(patron).test(n));
    const cubiertos = enElRepo.filter((n) => sujetosDelRepo().includes(n));
    ok(cubiertos.length === enElRepo.length, `el deploy instala "${patron}" y el gate no mira ${enElRepo.length - cubiertos.length} de esos archivos`);
  }

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
    // El remedio lo DERIVA `veredicto()` por archivo y ya viene en `lineas`: acá estaba escrito
    // fijo ("se destraba con el pedido de deploy"), y era falso para todo archivo que aún no
    // está en `origin/main` — el caso que manda a pedir una firma que no lo puede traer.
    if (r.codigo === 1) console.log("\nEl arreglo está commiteado y NO corre — arriba, el remedio de cada archivo.");
    process.exit(r.codigo);
  }
}
