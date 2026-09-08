// El simulacro de un publicador no puede nombrar una carpeta que la corrida REAL no usaría.
//
// POR QUÉ EXISTE ESTE ARCHIVO
// `publicar.sh --dry-run` es lo único que se corre antes de pedirle el `ok` a Sergio
// Urcullo: es el instrumento con el que se decide si un deploy va o no va. El 2026-09-06,
// con 26 arreglos parados hacía dos días, el simulacro de landing imprimía:
//
//     == el build armado no sirve (VIEJO): rearmo desde origin/main ==
//     [dry-run] correría: bash .../build-and-stage.sh
//     [dry-run] publicaría: bash .../swap-and-verify.sh .../runtime-next.new-20260905023618
//
// Las dos últimas líneas se contradicen: dice que rearma y a la vez que publicaría una
// carpeta armada un día y medio antes. En la corrida real eso NO pasa —el script rearma y
// vuelve a medir, así que `RUTA` queda apuntando al staged nuevo—, pero en seco el build no
// corre, la segunda medición devuelve la MISMA ruta vieja, y el mensaje la muestra igual.
//
// EL COSTO VA EN LA DIRECCIÓN CARA, y por eso no alcanza con que la corrida real esté sana:
// quien lee el simulacro concluye «esto publicaría código del 05-sep, no le des ok» y frena
// un deploy que habría publicado lo último. Un instrumento que desaconseja lo sano cuesta
// más que uno que no mide: al que no mide no se le cree.
//
// Es la misma familia que ya está medida en este carril el 2026-09-05 —un modo seco que
// dice la verdad por un canal y miente por otro— un escalón más abajo: ahí el simulacro
// mentía sobre si había tocado producción; acá miente sobre QUÉ publicaría.
//
// CÓMO SE MIDE, y por qué con un repo de mentira en vez de leyendo el texto del script:
// un test que grepea el .sh se pone verde con cualquier reescritura que conserve la
// palabra, y rojo con cualquiera que la cambie sin romper nada. Acá se EJECUTA el
// publicador real contra un `deploy-vivo.mjs` falso que declara el staged VIEJO, que es
// exactamente el estado en el que se descubrió el defecto. Producción no se toca: el script
// en `--dry-run` no llama a build-and-stage ni al swap.

import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Los publicadores que ejecuta el `ok <id>` de Sergio Urcullo, con su fuente versionada. */
const PUBLICADORES = [
  { destino: "landing", script: "hermes-content/deploy/onia-landing/publicar.sh" },
];

/** Un staged que el swap aceptaría, pero armado ANTES de lo varado: el caso del defecto. */
const RUTA_VIEJA = "/opt/onia-landing/runtime-next.new-20260905023618";

/**
 * Arma un repo de mentira cuyo `deploy-vivo.mjs` contesta lo que le pidamos, y corre el
 * publicador ahí. Sin red, sin git y sin tocar `/opt`.
 */
function correrEnSeco({ estadoStaged }) {
  const raizFalsa = mkdtempSync(join(tmpdir(), "publicador-seco-"));
  try {
    const dirGate = join(raizFalsa, "web-factory", "apps", "onia-platform", "scripts");
    mkdirSync(dirGate, { recursive: true });
    writeFileSync(
      join(dirGate, "deploy-vivo.mjs"),
      `export const NO_PUDE_MEDIR = 2;
       export const AL_DIA = 0;
       export const VARADO = 1;
       export function fechaBuildVivo() { return 1000; }
       export function commitsDesde() { return []; }
       export function estadoHome() { return 200; }
       export function diagnosticar() {
         return { codigo: VARADO, motivo: "varado", varados: [{ sha: "aaaaaaa" }, { sha: "bbbbbbb" }] };
       }
       export function stagedDisponible() { return { ruta: ${JSON.stringify(RUTA_VIEJA)} }; }
       export function evaluarStaged() { return { estado: ${JSON.stringify(estadoStaged)} }; }
      `,
    );
    // git fetch falla solo y el script lo degrada con un aviso: es su camino previsto.
    return execFileSync("bash", [join(RAIZ, PUBLICADORES[0].script), "--dry-run"], {
      encoding: "utf8",
      env: { ...process.env, ONIA_LOOPS_REPO: raizFalsa, ONIA_LANDING_DEPLOY: "/opt/onia-landing/_deploy" },
      timeout: 60_000,
    });
  } finally {
    rmSync(raizFalsa, { recursive: true, force: true });
  }
}

test("el simulacro no nombra el staged viejo cuando dice que va a rearmar", () => {
  const salida = correrEnSeco({ estadoStaged: "VIEJO" });

  assert.match(salida, /rearmo desde origin\/main/, "el fixture tiene que caer en la rama de rearmado");
  assert.match(salida, /producción NO se tocó/, "en seco no se puede tocar producción");

  const publicaria = salida.split("\n").find((l) => l.includes("publicaría")) ?? "";
  assert.ok(publicaria, "el simulacro tiene que decir qué publicaría");
  assert.ok(
    !publicaria.includes(RUTA_VIEJA),
    `el simulacro dice que rearma y aun así anuncia la carpeta vieja:\n  ${publicaria}\n` +
      "Quien lo lee frena un deploy sano creyendo que publicaría código de otro día.",
  );
});

test("cuando el staged SÍ cubre lo varado, el simulacro sí nombra esa carpeta", () => {
  // El caso que YA cumple. Sin él, el arreglo podría ser «no nombrar nunca una ruta», que
  // deja al simulacro sin decir qué publica y pasa este archivo igual.
  const salida = correrEnSeco({ estadoStaged: "CUBRE" });

  assert.doesNotMatch(salida, /rearmo desde origin\/main/, "si el staged cubre, no se rearma");
  const publicaria = salida.split("\n").find((l) => l.includes("publicaría")) ?? "";
  assert.ok(
    publicaria.includes(RUTA_VIEJA),
    `con el staged al día el simulacro tiene que nombrar la carpeta real:\n  ${publicaria}`,
  );
});

test("la fuente versionada es la que se despliega", () => {
  // Si la fuente y `/opt` divergen, este archivo mide un script que nadie ejecuta.
  for (const { destino, script } of PUBLICADORES) {
    assert.ok(existsSync(join(RAIZ, script)), `falta la fuente de ${destino}: ${script}`);
  }
});
