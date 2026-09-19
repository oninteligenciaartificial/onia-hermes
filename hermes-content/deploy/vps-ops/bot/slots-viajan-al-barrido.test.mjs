/**
 * Los horarios de demo tienen que LLEGAR al proceso que corre adentro del contenedor.
 *
 * EL BUG QUE CIERRA (medido en produccion el 2026-09-18, con un desconocido real esperando):
 * los wrappers pasaban `-e ONIA_BOT_SLOTS="${ONIA_BOT_SLOTS:-}"`, o sea la tomaban del entorno
 * del que llama. El cron los invoca PELADOS, asi que viajaba VACIA y el barrido de follow-up
 * salteaba a TODO el mundo con `slots_sin_definir` — teniendo los cinco horarios vivos en
 * `webhook.env` y en el proceso del webhook. Reproducido contra produccion en seco:
 *
 *   bash /opt/onia/bot/followup-run.sh --dry-run --now 2026-09-18T19:17:01Z --json
 *     -> skipped: [{ "chatwoot:58", "slots_sin_definir" }]
 *   ONIA_BOT_SLOTS="$(...webhook.env...)" bash ... (mismo comando)
 *     -> send: [{ "chatwoot:58", templateKey "M3" }]
 *
 * Es la MISMA clase que ONIA_BOT_DRY_RUN tuvo hasta el 2026-09-17 (dos interruptores en serie,
 * uno decorativo): la cura se escribio para un hermano y no viajo al otro, en el mismo archivo.
 *
 * POR QUE SE EJECUTA Y NO SE LEE: un gate que exige que el archivo NOMBRE a `webhook.env` pasa
 * verde ante cualquier esquive (leerla y no usarla, leerla DESPUES del `docker exec`, romperle
 * los espacios al valor). Aca cada wrapper se corre de verdad contra un `docker` FALSO que graba
 * sus argumentos, con el entorno limpio, y se exige que el valor llegue ENTERO.
 *
 * El universo sale del DISCO (readdirSync, no `git ls-files`: el wrapper nuevo sin commitear es
 * justo el sujeto que se quiere cazar) y se satisface de dos maneras, las dos mecanicas:
 *   (a) el wrapper carga `webhook.env` ENTERO (`set -a; . "$ENV_FILE"`) — asi hace el webhook, y
 *       entonces ya tiene todas las variables del archivo; o
 *   (b) el wrapper pasa la prueba ejecutada de aca abajo.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, mkdtempSync, writeFileSync, rmSync, chmodSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));

/** El valor de verdad: lleva ESPACIOS, comas, acentos, `|`, `@` y comillas que lo envuelven. */
const SLOTS = "sábado 19 de septiembre, 14:00@2026-09-19T18:00:00Z|lunes 21 de septiembre, 14:00@2026-09-21T18:00:00Z";

/** Universo del disco: todo `.sh` de esta carpeta que le pase ONIA_BOT_SLOTS al contenedor. */
export function wrappersQuePasanSlots(dir = AQUI) {
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith(".sh"))
    .map((d) => d.name)
    .filter((name) => /-e\s+ONIA_BOT_SLOTS=/.test(readFileSync(join(dir, name), "utf8")))
    .sort();
}

/** (a) Carga el archivo de entorno ENTERO: entonces tiene todas sus variables, no solo esta. */
export function cargaElEnvEntero(texto) {
  return /set\s+-a\s*;?\s*\.\s+"\$(ENV_FILE|\{ENV_FILE\})"/.test(texto);
}

/**
 * (b) Corre el wrapper de verdad con un `docker` falso y devuelve lo que ese docker recibio.
 * Nada toca produccion: el stub esta PRIMERO en el PATH, asi que el docker real nunca se invoca.
 */
export function loQueRecibioDocker(wrapper, { env = {}, conEnvFile = true, envFile = null, salidaDocker = "" } = {}) {
  const caja = mkdtempSync(join(tmpdir(), "slots-gate-"));
  try {
    const bin = join(caja, "bin");
    const registro = join(caja, "docker.args");
    execFileSync("mkdir", ["-p", bin]);
    // El docker falso: graba lo que le pidieron y se calla. Cubre exec, cp y ps.
    //
    // `salidaDocker` existe porque no todo insumo viaja por `webhook.env`: algunos wrappers lo
    // LEEN de la base con `CW_TOKEN="$(docker exec … psql …)"`, y un docker falso mudo los deja
    // con la variable vacia — lo que se lee igual que "el wrapper no la pasa" y acusa al
    // wrapper equivocado. Vacio por defecto: los dos gates que ya usan este harness no cambian.
    const eco = salidaDocker ? `printf '%s\\n' ${JSON.stringify(salidaDocker)}\n` : "";
    writeFileSync(join(bin, "docker"), `#!/bin/sh\nprintf '%s\\n' "$@" >> ${JSON.stringify(registro)}\n${eco}exit 0\n`);
    chmodSync(join(bin, "docker"), 0o755);

    writeFileSync(join(caja, wrapper), readFileSync(join(AQUI, wrapper), "utf8"));
    // El wrapper exige su propio .mjs al lado o se va a /opt/onia/bot (que en nodo-casa no existe).
    writeFileSync(join(caja, wrapper.replace(/\.sh$/, ".mjs")), "// dummy\n");
    if (conEnvFile) {
      writeFileSync(join(caja, "webhook.env"), envFile ?? `ONIA_BOT_DRY_RUN=true\nONIA_BOT_SLOTS="${SLOTS}"\n`);
    }

    const limpio = { PATH: `${bin}:${process.env.PATH}`, HOME: caja, ...env };
    try {
      execFileSync("bash", [join(caja, wrapper)], {
        env: limpio,
        input: "",
        timeout: 30000,
        stdio: ["pipe", "pipe", "pipe"],
      });
    } catch {
      /* el wrapper sale 0 siempre; si algo raro pasa, el registro de abajo lo delata igual */
    }
    return existsSync(registro) ? readFileSync(registro, "utf8") : "";
  } finally {
    rmSync(caja, { recursive: true, force: true });
  }
}

test("el universo sale del disco e incluye los wrappers que el cron invoca pelados", () => {
  const universo = wrappersQuePasanSlots();
  // Caso ancla: los sujetos YA CONOCIDOS tienen que estar. Sin esto, un filtro que se estrecha
  // solo (un regex que deja de matchear) vacia el universo y el gate firma verde sin sujetos.
  for (const conocido of ["followup-run.sh", "insistencia-run.sh", "run-turn.sh", "chatwoot-adapter.sh"]) {
    assert.ok(universo.includes(conocido), `${conocido} tiene que estar en el universo`);
  }
});

test("los horarios llegan al contenedor aunque el que llama no los exporte", () => {
  for (const wrapper of wrappersQuePasanSlots()) {
    const texto = readFileSync(join(AQUI, wrapper), "utf8");
    if (cargaElEnvEntero(texto)) continue; // (a): ya tiene el archivo entero

    const recibido = loQueRecibioDocker(wrapper);
    assert.ok(
      recibido.includes(`ONIA_BOT_SLOTS=${SLOTS}`),
      `${wrapper}: el cron lo llama sin ONIA_BOT_SLOTS y el valor NO llego entero al contenedor.\n` +
        `Tiene que derivarlo de webhook.env (ojo: el valor lleva espacios; no se puede limpiar con tr -d).\n` +
        `docker recibio:\n${recibido.slice(0, 800) || "(nada)"}`,
    );
  }
});

test("el que llama sigue mandando: un valor explicito le gana al archivo", () => {
  // La direccion simetrica. Sin esto, la cura podria PISAR lo que el llamador eligio a proposito
  // (es como se prueba un horario distinto sin tocar produccion).
  const mio = "lunes 1 de enero, 09:00@2027-01-01T13:00:00Z";
  const recibido = loQueRecibioDocker("followup-run.sh", { env: { ONIA_BOT_SLOTS: mio } });
  assert.ok(recibido.includes(`ONIA_BOT_SLOTS=${mio}`), "el valor explicito del llamador tiene que ganar");
});

test("sin webhook.env no se inventa nada: la variable viaja vacia", () => {
  // Falla CERRADO a proposito: mejor "slots_sin_definir" (que el barrido sabe decir y no manda)
  // que un horario fabricado. Es lo que ya hacia antes de la cura, y se conserva.
  const recibido = loQueRecibioDocker("followup-run.sh", { conEnvFile: false });
  assert.ok(recibido.includes("ONIA_BOT_SLOTS="), "tiene que seguir pasando la variable");
  assert.ok(!recibido.includes("ONIA_BOT_SLOTS=sábado"), "sin archivo no puede aparecer ningun horario");
});
