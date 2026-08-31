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

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

/** Solo el codigo decide el veredicto. Lo demas se reporta y se perdona — ver ES_CODIGO. */
const ES_CODIGO = (nombre) => nombre.endsWith(".mjs") || nombre.endsWith(".sh");

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

/** md5 de los archivos sueltos del espejo local (sin bajar a backups/ ni evals/). */
export function md5Local(dir) {
  const out = {};
  for (const nombre of readdirSync(dir)) {
    const completo = path.join(dir, nombre);
    if (!statSync(completo).isFile()) continue;
    out[nombre] = createHash("md5").update(readFileSync(completo)).digest("hex");
  }
  return out;
}

function md5Vps({ host, key, dir }) {
  const args = ["-o", "StrictHostKeyChecking=no", "-o", "ConnectTimeout=20"];
  if (key) args.push("-i", key);
  // `md5sum *` sale 1 al toparse con backups/ y evals/, y eso hacia fallar el comando entero
  // aunque la lectura fuera perfecta. `find -maxdepth 1 -type f` toma solo archivos sueltos —
  // el mismo criterio que md5Local — y deja el exit code libre para reportar fallas de ssh.
  args.push(host, `cd ${dir} && find . -maxdepth 1 -type f -exec md5sum {} +`);
  return parsearMd5sum(execFileSync("ssh", args, { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 }));
}

function main() {
  const espejo = fileURLToPath(new URL(".", import.meta.url));
  const host = process.env.ONIA_VPS_HOST || "root@187.77.16.63";
  const dir = process.env.ONIA_VPS_BOT_DIR || "/opt/onia/bot";
  const key = process.env.ONIA_VPS_KEY || path.join(process.env.HOME || "", ".ssh/onia_hermes_vps_ed25519");

  const r = compararEspejo(md5Local(espejo), md5Vps({ host, key, dir }));

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
  return 1;
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1].replace(/\\/g, "/")}`).href) {
  process.exit(main());
}
