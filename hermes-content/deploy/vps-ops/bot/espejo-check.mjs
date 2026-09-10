// ONIA — ¿el espejo del motor ES el motor que corre?
//
// `hermes-content/deploy/vps-ops/bot/` es el espejo versionado de `/opt/onia/bot/` del VPS.
// Nada verificaba que fueran iguales, y ya se desincronizo dos veces — las dos descubiertas de
// casualidad, semanas despues, y en direcciones opuestas (ver el encabezado de
// espejo-check.test.mjs). El costo no es el drift: es que entre medio se ESCRIBE que algo esta
// desplegado. El 2026-08-31 la cola del carril decia que para encender las frases de campaña
// solo faltaba copiar `knowledge.json` al VPS — pero el motor de alla no tenia el commit que
// las lee, asi que esa copia no habria hecho nada y el item se habria dado por cerrado.
//
// Esto lo contesta con un md5 por lado. No despliega, no escribe, no toca el VPS: lee.
//
//   node hermes-content/deploy/vps-ops/bot/espejo-check.mjs
//
// EL MOTOR VIVE EN TRES LUGARES, y confundirlos hace perder la vuelta entera:
//
//   1. este espejo versionado          (lo que se edita)
//   2. VPS host `/opt/onia/bot/`       (lo que se despliega)  <- lo que compara este script
//   3. contenedor onia-center, `/tmp/onia-bot/`  (lo que CORRE)
//
// El 3 es una copia del 2 que `webhook-server.sh` rehace sola: calcula un STAMP md5 de
// `*.mjs`+`*.json` del 2 y, si no coincide con `/tmp/onia-bot/.stamp`, borra y vuelve a copiar
// al arrancar. Por eso el blanco correcto es el 2: alinearlo es lo que el proximo restart lleva
// al motor vivo. Y por eso `ps` en el host muestra `node /tmp/onia-bot/webhook-server.mjs` con
// ese directorio inexistente en el host — es el /tmp DEL CONTENEDOR, no el de la maquina.
//
// Sale 0 si el codigo coincide, 1 si hay drift (y nombra los archivos). Env opcionales:
// ONIA_VPS_HOST (default root@187.77.16.63), ONIA_VPS_KEY, ONIA_VPS_BOT_DIR.
//
// Si ONIA_VPS_BOT_DIR es una ruta de ESTE disco (el loop corriendo dentro del propio VPS desde
// el 2026-09-01), se lee directo sin SSH — ver `ladoVps`.

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

/** Solo el codigo decide el veredicto. Lo demas se reporta y se perdona — ver ES_CODIGO. */
const ES_CODIGO = (nombre) => nombre.endsWith(".mjs") || nombre.endsWith(".sh");

/**
 * El fin de linea no es drift en un `.mjs`, y si lo es en un `.sh`.
 *
 * `onia-hermes` tiene `core.autocrlf=true` y ningun `.gitattributes`: git guarda LF y
 * materializa CRLF al hacer checkout. Un `git checkout --` sobre el espejo cambia entonces los
 * BYTES sin cambiar una linea de codigo (medido: `recepcionista.mjs` 14110 -> 14375, +265, una
 * por linea, con `git status` vacio), y este gate — que compara md5 de bytes — fabricaba un
 * "deploy pendiente" que nadie pidio. Un rojo que no corresponde a ningun cambio se apaga, o se
 * paga con un scp inutil al VPS: es el mismo fantasma que el gate existe para matar.
 *
 * En un `.sh` el CRLF NO es cosmetico (`#!/bin/bash\r` no arranca), asi que ahi el byte cuenta.
 * Se borra el \r entero, no solo el de fin de linea, para que el lado remoto pueda hacer lo
 * mismo con `tr -d` — que a diferencia de `sed` no agrega un salto final si el archivo no lo
 * tenia, y sin esa simetria exacta los dos hashes no comparan.
 */
export function md5Archivo(nombre, contenido) {
  const buf = nombre.endsWith(".mjs")
    ? Buffer.from(contenido.filter((b) => b !== 0x0d))
    : contenido;
  return createHash("md5").update(buf).digest("hex");
}

/**
 * `md5sum` escribe "<hash>  <ruta>", y en dos dialectos que rompen el nombre si no se limpian:
 * el VPS lo da con la ruta absoluta y Git Bash antepone "*" al nombre en modo binario.
 */
export function parsearMd5sum(texto) {
  const out = {};
  for (const linea of String(texto).split("\n")) {
    const m = linea.trim().match(/^([0-9a-f]{32})\s+\*?(.+)$/i);
    if (m) out[path.posix.basename(m[2].replace(/\\/g, "/").trim())] = m[1].toLowerCase();
  }
  return out;
}

/**
 * Compara los dos lados por nombre de archivo.
 *
 * `knowledge.json` — el documento publicado del numero — vive SOLO en el VPS a proposito
 * (`d334d776`: "sin env, sin knowledge.json"): es dato vivo, no codigo, y el repo no debe
 * pisarlo nunca. Por eso el veredicto mira solo `.mjs` y `.sh`; el resto se lista en
 * `ignorados` para que se vea, sin poner rojo un gate que entonces alguien apagaria.
 */
/**
 * PURA: ¿este espejo puede opinar sobre el deploy del bot, o está mirando su propio atraso?
 *
 * Nace del 2026-09-10. El clon `/root/loops/onia-hermes` del VPS se atrasa solo desde que el
 * integrador se mudó al nodo de casa y pushea desde allá. Ese día el clon estaba en
 * `acd34a6d4`, `origin/main` ya tenía `4bc1c97e` —que toca `persistence.mjs` de este mismo
 * subárbol— y producción YA lo corría. Así que este script comparó el `persistence.mjs` VIEJO
 * del clon contra el NUEVO de `/opt/onia/bot` y cantó DESINCRONIZADO: producción estaba
 * ADELANTE, no atrás. `deploy_sin_pedido.mjs`, que le pregunta a este script, tradujo eso a
 * «el bot tiene arreglos sin publicar» y mandaba a abrir un pedido de deploy a Sergio Urcullo.
 *
 * El costo no es el ruido: es que obedecerlo copiaba el clon atrasado ENCIMA de producción y
 * REVERTÍA el arreglo del acuse del handoff. Su hermano `publicar.sh` ya se cuida de esto
 * (pone el árbol en `origin/main` antes de comparar); este no, y es el que consultan los gates.
 *
 * No se arregla poniendo el árbol al día: este script declara en su encabezado que lee y no
 * escribe, y un instrumento que muta lo que mide deja de ser instrumento. Se arregla
 * NEGÁNDOSE A CONCLUIR: si el espejo no es `origin/main`, la diferencia que ve puede ser suya,
 * y «no sé» es la única respuesta honesta. La dirección importa — de los dos errores posibles,
 * el que cuesta plata es declarar un deploy pendiente que no existe.
 *
 * @param difieren archivos del subárbol que no coinciden con `origin/main` (o sin versionar).
 * @param error    texto si ni siquiera se pudo preguntar (no es repo, no hay `origin/main`).
 */
export function frescuraDelEspejo({ difieren = [], error = null } = {}) {
  if (error) {
    return { fresco: false, motivo: `no pude preguntarle a git si el espejo es origin/main: ${error}` };
  }
  if (difieren.length) {
    return {
      fresco: false,
      motivo:
        `el espejo NO es origin/main — difieren ${difieren.join(", ")}. Lo que este script vería ` +
        `puede ser su propio atraso y no un deploy pendiente.`,
    };
  }
  return { fresco: true, motivo: null };
}

/** Lee del disco lo que `frescuraDelEspejo` necesita. Un `fetch` que falla no es motivo para */
/** callarse: se compara contra el `origin/main` que haya, igual que hace `publicar.sh`. */
function frescuraEnVivo(espejo) {
  const git = (args) => execFileSync("git", args, { cwd: espejo, encoding: "utf8", timeout: 60_000, stdio: ["ignore", "pipe", "ignore"] });
  try {
    try {
      git(["fetch", "origin", "--quiet"]);
    } catch {
      /* sin red se compara contra el origin/main de disco: peor es no comparar */
    }
    const difieren = [
      ...git(["diff", "--name-only", "origin/main", "--", "."]).split("\n"),
      ...git(["ls-files", "--others", "--exclude-standard", "--", "."]).split("\n"),
    ]
      .map((s) => s.trim())
      .filter(Boolean);
    return frescuraDelEspejo({ difieren: [...new Set(difieren)] });
  } catch (e) {
    return frescuraDelEspejo({ error: String(e?.message || e).split("\n")[0] });
  }
}

export function compararEspejo(repo, vps) {
  const nombres = [...new Set([...Object.keys(repo), ...Object.keys(vps)])].sort();
  const distintos = [];
  const soloRepo = [];
  const soloVps = [];
  const ignorados = [];

  for (const n of nombres) {
    const enRepo = Object.hasOwn(repo, n);
    const enVps = Object.hasOwn(vps, n);
    const coincide = enRepo && enVps && repo[n] === vps[n];
    if (coincide) continue;
    if (!ES_CODIGO(n)) {
      ignorados.push(n);
    } else if (!enVps) {
      soloRepo.push(n);
    } else if (!enRepo) {
      soloVps.push(n);
    } else {
      distintos.push(n);
    }
  }

  return {
    ok: distintos.length === 0 && soloRepo.length === 0 && soloVps.length === 0,
    distintos,
    soloRepo,
    soloVps,
    ignorados,
  };
}

// ---------------------------------------------------------------------------
// Acoples: que archivos VIAJAN JUNTOS
// ---------------------------------------------------------------------------
//
// Saber QUE archivos difieren no alcanza para desplegar bien, y el 2026-09-02 costo casi un
// deploy roto: la cola mandaba copiar `knowledge.mjs` + `recepcionista.mjs` y nada mas, pero el
// `recepcionista.mjs` del espejo ya llamaba a `intents.wantsToBook()` y a la plantilla
// `R_AGENDA` — ninguna de las dos existe todavia en el VPS. Copiar ese subconjunto deja el motor
// llamando a una funcion inexistente: `TypeError: intents.wantsToBook is not a function`.
//
// Es el mismo molde que el gate ya cazo dos veces, un escalon mas abajo: la primera vez el
// archivo de datos viajaba sin el codigo que lo lee; esta vez el codigo viaja sin el codigo del
// que depende. En los dos casos la instruccion escrita se sigue al pie y produce algo peor que
// no hacer nada.
//
// Esto es analisis estatico a proposito — no importa los modulos. Importarlos ejecutaria el
// motor del VPS dentro de este proceso, y un gate de solo lectura no puede permitirse efectos.

/**
 * Los simbolos que un fuente USA y que tiene que definir OTRO archivo del espejo.
 *
 * Dos familias, que son las dos que cruzan archivos en este motor: las funciones de intents
 * (`intents.wantsToBook(...)`) y las plantillas del guion (`say("R_AGENDA", ...)`), que viven en
 * `config.mjs`. Se exige el parentesis en el caso de intents para no contar `"./intents.mjs"` de
 * la linea de import — que es un string, no una llamada.
 */
export function simbolosUsados(src) {
  // Se exige el IMPORT, no solo la mención. Sin esto el propio `espejo-check.mjs` salia acoplado
  // a `intents.mjs` por nombrar `intents.wantsToBook` en un comentario — medido el 2026-09-02, y
  // un gate que nombra archivos que no son es el ruido que termina apagandolo.
  const importaIntents = /from\s+["']\.\/intents\.mjs["']/.test(src);
  // `say` no siempre se importa: `recepcionista.mjs` lo recibe INYECTADO desde bot-engine
  // (`const { finalize, handoffResult, say } = motor;`). Buscar solo el import daba un falso
  // NEGATIVO — que en un gate es peor que el falso positivo: calla justo donde hay que avisar.
  const importaSay = /(?:import|const|let|var)\s*\{[^}]*\bsay\b[^}]*\}/.test(src);

  const funciones = importaIntents
    ? [...src.matchAll(/\bintents\.(\w+)\s*\(/g)].map((m) => `intents.${m[1]}`)
    : [];
  const plantillas = importaSay
    ? [...src.matchAll(/\bsay\(\s*"([A-Z][A-Z0-9_]*)"/g)].map((m) => `config.${m[1]}`)
    : [];
  return [...new Set([...funciones, ...plantillas])].sort();
}

/** Los simbolos que un conjunto de fuentes DEFINE (nombre -> texto del archivo). */
export function simbolosDefinidos(fuentes) {
  const out = new Set();
  for (const [nombre, src] of Object.entries(fuentes)) {
    if (nombre === "intents.mjs") {
      for (const m of src.matchAll(/export\s+function\s+(\w+)/g)) out.add(`intents.${m[1]}`);
    }
    if (nombre === "config.mjs") {
      for (const m of src.matchAll(/^\s{2,}([A-Z][A-Z0-9_]*)\s*:/gm)) out.add(`config.${m[1]}`);
    }
  }
  return out;
}

/**
 * Si copiara `aCopiar` del espejo al VPS y nada mas, ¿queda el motor coherente?
 *
 * Devuelve un renglon por cada simbolo que quedaria colgado, diciendo QUE archivo hay que sumar
 * al viaje para que no quede. Vacio = ese conjunto se puede copiar solo.
 */
export function acoplesDeCopia(repo, vps, aCopiar) {
  const despues = { ...vps };
  for (const n of aCopiar) if (Object.hasOwn(repo, n)) despues[n] = repo[n];

  const definidos = simbolosDefinidos(despues);
  const faltantes = [];
  for (const archivo of aCopiar) {
    if (!Object.hasOwn(repo, archivo)) continue;
    for (const simbolo of simbolosUsados(repo[archivo])) {
      if (definidos.has(simbolo)) continue;
      const loTrae = Object.keys(repo)
        .filter((n) => simbolosDefinidos({ [n]: repo[n] }).has(simbolo))
        .sort();
      faltantes.push({ archivo, simbolo, loTrae });
    }
  }
  return faltantes;
}

/** Texto de los `.mjs` sueltos de un directorio (mismo alcance que `md5Local`). */
export function fuentesLocales(dir) {
  const out = {};
  for (const nombre of readdirSync(dir)) {
    if (!nombre.endsWith(".mjs")) continue;
    const completo = path.join(dir, nombre);
    if (!statSync(completo).isFile()) continue;
    out[nombre] = readFileSync(completo, "utf8");
  }
  return out;
}

/** md5 de los archivos sueltos del espejo local (sin bajar a backups/ ni evals/). */
export function md5Local(dir) {
  const out = {};
  for (const nombre of readdirSync(dir)) {
    const completo = path.join(dir, nombre);
    if (!statSync(completo).isFile()) continue;
    out[nombre] = md5Archivo(nombre, readFileSync(completo));
  }
  return out;
}

function md5Vps({ host, key, dir }) {
  const args = ["-o", "StrictHostKeyChecking=no", "-o", "ConnectTimeout=20"];
  if (key) args.push("-i", key);
  // `md5sum *` sale 1 al toparse con backups/ y evals/, y eso hacia fallar el comando entero
  // aunque la lectura fuera perfecta. `find -maxdepth 1 -type f` toma solo archivos sueltos —
  // el mismo criterio que md5Local — y deja el exit code libre para reportar fallas de ssh.
  // Mismo criterio que `md5Archivo` del lado de alla: al `.mjs` se le saca el retorno de
  // carro antes de hashear, al resto no. `tr -d` y no `sed` porque sed agrega un salto final
  // si el archivo no lo tenia, y sin esa simetria exacta los dos hashes no comparan.
  const sinCr = `tr -d '\\r' < "$f" | md5sum | cut -d' ' -f1`;
  args.push(
    host,
    `cd ${dir} && find . -maxdepth 1 -type f | while IFS= read -r f; do ` +
      `case "$f" in *.mjs) printf '%s  %s\\n' "$(${sinCr})" "$f";; ` +
      `*) md5sum "$f";; esac; done`,
  );
  return parsearMd5sum(execFileSync("ssh", args, { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 }));
}

/**
 * El lado VPS, elegido segun DONDE corre este script.
 *
 * Hasta el 2026-08-31 esto corria en la maquina de Sergio y `/opt/onia/bot` solo existia del
 * otro lado de un SSH. Desde el 2026-09-01 el loop del carril corre DENTRO del propio VPS
 * (`hermes-content/docs/cola/loops.md`), y ahi `dir` YA es una ruta de este mismo disco: la
 * clave `ONIA_VPS_KEY` (pensada para conectarse a uno mismo) ni siquiera existe en el host, y
 * el script fallaba entero por un SSH que no hacia falta. Si el directorio esta accesible
 * localmente se lee directo — mas simple y no depende de ninguna clave —; si no, se cae al SSH
 * de siempre (loop corriendo fuera del VPS, o dir apuntando a otra maquina via env).
 */
export function ladoVps({ host, key, dir }) {
  if (existsSync(dir)) return md5Local(dir);
  return md5Vps({ host, key, dir });
}

function main() {
  const espejo = fileURLToPath(new URL(".", import.meta.url));
  const host = process.env.ONIA_VPS_HOST || "root@187.77.16.63";
  const dir = process.env.ONIA_VPS_BOT_DIR || "/opt/onia/bot";
  const key = process.env.ONIA_VPS_KEY || path.join(process.env.HOME || "", ".ssh/onia_hermes_vps_ed25519");

  // Antes de comparar nada: ¿este espejo es `origin/main`? Si no, se calla — ver
  // `frescuraDelEspejo`. Sale 2 (NO MEDIDO) y no 1, para que quien lo consulte distinga
  // «no sé» de «hay drift»: el 1 hace abrir un pedido de deploy.
  const frescura = frescuraEnVivo(espejo);
  if (!frescura.fresco) {
    console.log(`ESPEJO SIN VEREDICTO — ${frescura.motivo}`);
    console.log(`  No es un drift: es que ${espejo} no está en origin/main, así que cualquier`);
    console.log("  diferencia contra el VPS puede ser su propio atraso. Poné el árbol al día");
    console.log("  (git merge --ff-only origin/main) o commiteá lo tuyo, y volvé a correrlo.");
    return 2;
  }

  const r = compararEspejo(md5Local(espejo), ladoVps({ host, key, dir }));

  if (r.ok) {
    console.log(`ESPEJO OK — el codigo de ${espejo} es el que corre en ${host}:${dir}`);
    if (r.ignorados.length) console.log(`  (no son codigo, no cuentan: ${r.ignorados.join(", ")})`);
    return 0;
  }
  console.log(`ESPEJO DESINCRONIZADO — ${espejo} vs ${host}:${dir}`);
  if (r.distintos.length) console.log(`  DISTINTOS (el VPS corre otra version): ${r.distintos.join(", ")}`);
  if (r.soloRepo.length) console.log(`  FALTAN EN EL VPS (deploy a medias):    ${r.soloRepo.join(", ")}`);
  if (r.soloVps.length) console.log(`  SOBRAN EN EL VPS (el espejo quedo atras): ${r.soloVps.join(", ")}`);
  if (r.ignorados.length) console.log(`  (no son codigo, no cuentan: ${r.ignorados.join(", ")})`);

  // Los acoples solo se pueden calcular leyendo el TEXTO de los dos lados. Si el VPS esta del
  // otro lado de un SSH no se baja el codigo entero por esto: se dice que no se midio, en vez de
  // callar y dejar creer que no hay acoples.
  if (existsSync(dir)) {
    const repoSrc = fuentesLocales(espejo);
    const vpsSrc = fuentesLocales(dir);
    const lineas = [];
    // Solo el MOTOR. Quedan afuera los `.test.mjs` (no los corre nadie en el VPS: un acople suyo
    // no rompe nada) y este mismo archivo, que documenta el caso real citando `R_AGENDA` y
    // `wantsToBook` y por eso se denunciaba a si mismo en cada corrida. Los dos son herramienta,
    // no el motor — la misma distincion que el espejo ya hacia en prosa.
    const esMotor = (n) => n.endsWith(".mjs") && !n.endsWith(".test.mjs") && n !== "espejo-check.mjs";
    for (const archivo of r.distintos.filter(esMotor)) {
      const faltan = acoplesDeCopia(repoSrc, vpsSrc, [archivo]);
      if (!faltan.length) continue;
      const detalle = faltan
        .map((f) => `${f.loTrae.join("+") || "?"} (${f.simbolo})`)
        .filter((v, i, a) => a.indexOf(v) === i)
        .join(", ");
      lineas.push(`    ${archivo} NO viaja solo: necesita ${detalle}`);
    }
    if (lineas.length) {
      console.log("  VIAJAN JUNTOS (copiar uno solo deja el motor llamando a lo que no existe):");
      for (const l of lineas) console.log(l);
    }
  } else {
    console.log("  (acoples no medidos: el VPS esta por SSH y no se bajo el codigo)");
  }
  return 1;
}

// `pathToFileURL` y no `new URL("file://" + argv[1])`: con `node -e "import(...)" <arg>`, `argv[1]`
// es el ARGUMENTO y no una ruta, y concatenarlo tira `ERR_INVALID_URL` — o sea que importar este
// modulo con argumentos lo rompia. Reproducido el 2026-09-02, cuando `s11_desplegado.mjs` copio
// esta guarda de aca y fallo asi. Ademas resuelve solo el escapado y las barras invertidas.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main());
}
