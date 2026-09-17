// ---------------------------------------------------------------------------
// barridos-corren-en-el-modo-que-dice-el-interruptor.test.mjs
//
// QUE FIJA. Un barrido del embudo corre en el modo que dice SU INTERRUPTOR
// (`ONIA_BOT_DRY_RUN`, en `webhook.env`), no en el que adivina quien lo llama.
// El wrapper deriva `--emit` de ese interruptor, y el llamador que quiere otra
// cosa la pide (`--dry-run`, `--json`, `--emit`) y le gana.
//
// POR QUE EXISTE. Medido el 2026-09-17 en el VPS, en los logs de produccion:
// `followup-run.sh` (cron `17 * * * *`), `reminder-run.sh` (`32 * * * *`) y
// `postdemo-run.sh` (`47 * * * *`) llevaban 667, 670 y 670 corridas y CERO en
// modo envio: `grep -c "modo dry-run"` da 667/670/670 y `grep -c "modo envio"`
// da 0. Los tres crons invocan el wrapper PELADO, y sin `--emit` el .mjs no
// reserva ni manda. O sea que en toda la historia del bot:
//
//   - ningun prospecto que quedo a medias recibio el follow-up M3 (el mensaje
//     que lo rescata),
//   - ningun prospecto que agendo recibio el recordatorio de su demo,
//   - ninguna demo se cerro sola despues de ocurrir.
//
// Y el interruptor de produccion decia lo contrario: `/opt/onia/bot/webhook.env`
// tiene `ONIA_BOT_DRY_RUN=false` desde hace tiempo. El unico barrido que SI
// manda es `insistencia`, y no por merito propio: su linea de cron trae el
// `--emit` escrito a mano (`*/30 12-23 * * * ONIA_BOT_DRY_RUN=false bash
// /opt/onia/bot/insistencia-run.sh --emit`). Cuatro hermanos, un solo encendido,
// por una diferencia que vive fuera de git.
//
// LA CLASE. El propio wrapper afirmaba en un comentario que "el interruptor de
// 'manda de verdad' vive en UN SOLO lugar: webhook.env" — y era falso, porque
// habia DOS en serie y el segundo (`--emit`) no lo podia encender ese archivo.
// Un interruptor que no puede encender nada por si mismo es decorativo: quien
// lo lee cree que decidio y no decidio nada. La cura es que el modo se DERIVE
// del interruptor, que es lo que el comentario ya prometia.
//
// COMO SE PRUEBA. Ejecutando el wrapper de verdad, en una carpeta sellada por
// corrida, con `docker` reemplazado por un stub que anota sus argumentos y no
// imprime nada (si imprimiera, contaminaria el `CWDB` del wrapper). Se mira la
// linea con la que el wrapper invoca a `node`: ahi esta, o no esta, el `--emit`.
// Un gate que solo grepeara el .sh no veria el ORDEN de las guardas ni al
// llamador que pide dry-run.
//
// EL UNIVERSO SE DERIVA DEL DISCO. Sujetos: todo `*-run.sh` cuyo `.mjs` hermano
// acepte `--emit`. No una lista a mano — el barrido nuevo tiene que nacer
// adentro. Se enumera la CARPETA (no `git ls-files`): el wrapper recien escrito
// y sin commitear es justo el sujeto que se quiere cazar.
// ---------------------------------------------------------------------------

import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const AQUI = dirname(fileURLToPath(import.meta.url));

/** Los barridos conocidos hoy. Caso ancla: ninguno puede quedar FUERA del universo. */
const ANCLAS = ["followup-run.sh", "insistencia-run.sh", "postdemo-run.sh", "reminder-run.sh"];

/**
 * Sujetos derivados del disco: `X-run.sh` cuyo `X-run.mjs` reconoce `--emit`.
 * Si el .mjs no sabe emitir, su wrapper no tiene nada que derivar (`usage-run`).
 */
export function barridosConEmit(dir = AQUI) {
  return readdirSync(dir)
    .filter((nombre) => nombre.endsWith("-run.sh"))
    .filter((nombre) => {
      const hermano = join(dir, `${nombre.slice(0, -3)}.mjs`);
      try {
        return readFileSync(hermano, "utf8").includes('"--emit"');
      } catch {
        return false;
      }
    })
    .sort();
}

/**
 * Corre el wrapper de verdad con `docker` stubbeado y devuelve la linea con la
 * que invoco a `node` (la ultima que lo nombra), o `null` si nunca lo invoco.
 */
function lineaDeNode(wrapper, { env = {}, args = [], webhookEnv = null } = {}) {
  const base = wrapper.slice(0, -3);
  const caja = mkdtempSync(join(tmpdir(), "barrido-emit-"));
  try {
    const bin = join(caja, "bin");
    mkdirSync(bin);
    const anotador = join(caja, "docker-args.txt");
    // El stub NO imprime nada: el wrapper captura la salida de `docker ps` en CWDB.
    writeFileSync(join(bin, "docker"), `#!/bin/sh\nprintf '%s\\n' "$*" >> "${anotador}"\nexit 0\n`);
    execFileSync("chmod", ["+x", join(bin, "docker")]);

    // Carpeta del barrido: el wrapper real + un .mjs hermano vacio (existe para que
    // `BOT_DIR` no caiga a /opt/onia/bot) + el webhook.env del caso, si lo hay.
    writeFileSync(join(caja, wrapper), readFileSync(join(AQUI, wrapper), "utf8"));
    writeFileSync(join(caja, `${base}.mjs`), "");
    if (webhookEnv !== null) writeFileSync(join(caja, "webhook.env"), webhookEnv);

    execFileSync("bash", [join(caja, wrapper), ...args], {
      env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, ONIA_BOT_DRY_RUN: "", ...env },
      encoding: "utf8",
      timeout: 30_000,
    });

    const anotadas = readFileSync(anotador, "utf8").split("\n").filter(Boolean);
    const conNode = anotadas.filter((linea) => linea.includes(`node `) && linea.includes(`${base}.mjs`));
    return conNode.length ? conNode[conNode.length - 1] : null;
  } finally {
    rmSync(caja, { recursive: true, force: true });
  }
}

test("el universo sale del disco y ningun barrido conocido queda afuera", () => {
  const sujetos = barridosConEmit();
  for (const ancla of ANCLAS) {
    assert.ok(sujetos.includes(ancla), `${ancla} tiene que ser sujeto del gate (universo: ${sujetos.join(", ")})`);
  }
  // `usage-run.sh` no emite nada: su .mjs no reconoce `--emit`. Si algun dia lo
  // reconoce, entra solo — que es justo lo que este gate existe para garantizar.
  assert.ok(!sujetos.includes("usage-run.sh"), "usage-run no acepta --emit: no es sujeto");
});

for (const wrapper of barridosConEmit()) {
  test(`${wrapper}: con el interruptor en "manda de verdad" (env) el barrido EMITE`, () => {
    const linea = lineaDeNode(wrapper, { env: { ONIA_BOT_DRY_RUN: "false" } });
    assert.ok(linea, `${wrapper} no llego a invocar node`);
    assert.match(linea, /--emit\b/, `${wrapper} corrio en seco con el interruptor en false: ${linea}`);
  });

  test(`${wrapper}: el interruptor tambien vale leido de webhook.env`, () => {
    const linea = lineaDeNode(wrapper, { webhookEnv: "ONIA_BOT_DRY_RUN=false\n" });
    assert.ok(linea, `${wrapper} no llego a invocar node`);
    assert.match(linea, /--emit\b/, `${wrapper} ignoro el webhook.env: ${linea}`);
  });

  test(`${wrapper}: con el interruptor en dry-run NO emite`, () => {
    const linea = lineaDeNode(wrapper, { env: { ONIA_BOT_DRY_RUN: "true" } });
    assert.ok(linea, `${wrapper} no llego a invocar node`);
    assert.doesNotMatch(linea, /--emit\b/, `${wrapper} emitio con el interruptor en true: ${linea}`);
  });

  test(`${wrapper}: sin interruptor (ni env ni archivo) NO emite — el default seguro manda`, () => {
    const linea = lineaDeNode(wrapper, {});
    assert.ok(linea, `${wrapper} no llego a invocar node`);
    assert.doesNotMatch(linea, /--emit\b/, `${wrapper} emitio sin que nadie lo decidiera: ${linea}`);
  });

  test(`${wrapper}: el llamador que pide --dry-run le gana al interruptor`, () => {
    const linea = lineaDeNode(wrapper, { env: { ONIA_BOT_DRY_RUN: "false" }, args: ["--dry-run"] });
    assert.ok(linea, `${wrapper} no llego a invocar node`);
    assert.doesNotMatch(linea, /--emit\b/, `${wrapper} emitio pese al --dry-run explicito: ${linea}`);
  });

  test(`${wrapper}: --json solo pide formato, no autoriza a mandar`, () => {
    const linea = lineaDeNode(wrapper, { env: { ONIA_BOT_DRY_RUN: "false" }, args: ["--json"] });
    assert.ok(linea, `${wrapper} no llego a invocar node`);
    assert.doesNotMatch(linea, /--emit\b/, `${wrapper} convirtio un --json en un envio real: ${linea}`);
  });

  test(`${wrapper}: el --emit del llamador no se duplica`, () => {
    const linea = lineaDeNode(wrapper, { env: { ONIA_BOT_DRY_RUN: "false" }, args: ["--emit"] });
    assert.ok(linea, `${wrapper} no llego a invocar node`);
    assert.equal(linea.match(/--emit\b/g)?.length, 1, `${wrapper} paso --emit dos veces: ${linea}`);
  });
}
