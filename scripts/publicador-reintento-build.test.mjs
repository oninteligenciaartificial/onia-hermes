#!/usr/bin/env node
// El publicador reintenta cuando el VPS esta ocupado con OTRO build.
//
// POR QUE EXISTE. El 9-oct y el 10-oct la corrida de las 15:50 UTC dio
// «plataforma: FALLO» con el codigo sano: el CI de GitHub (onia-runner-platform)
// corre en el mismo VPS y el armador se niega a encimarse («FATAL: hay otro build
// corriendo»). Lo que ya estaba en `master` espero 3 h hasta la corrida
// siguiente. Ahora `correr_con_reintento` espera y reintenta ESE motivo, y
// ningun otro: un build roto falla igual a la primera.
//
// Corre sin red ni produccion: un publicar.sh falso cuenta sus llamadas, el lock
// va a una carpeta temporal y la espera es 0.

import { execFileSync } from "node:child_process";
import { strict as assert } from "node:assert";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const GUION =
  process.env.ONIA_PUBLICAR_SOLO_GUION ||
  (process.env.ONIA_LOOPS_REPO
    ? `${process.env.ONIA_LOOPS_REPO}/scripts/loops/extras/publicar-solo.sh`
    : fileURLToPath(new URL("./loops/extras/publicar-solo.sh", import.meta.url)));

const OCUPADO = "FATAL: hay otro build corriendo (next build / npm ci / docker build): no encimo otro";

// Un publicar.sh falso: las primeras `ocupado` veces encuentra otro build; despues
// publica, o falla con `error` si se pide.
function preparar(ocupado, error = "") {
  const dir = mkdtempSync(join(tmpdir(), "pub-reintento-"));
  const cuenta = join(dir, "cuenta");
  writeFileSync(cuenta, "0");
  const final = error ? `echo ${JSON.stringify(error)}; exit 1` : 'echo "PUBLICADO Y VERIFICADO"; exit 0';
  writeFileSync(
    join(dir, "publicar.sh"),
    `#!/usr/bin/env bash
n=$(cat ${JSON.stringify(cuenta)}); n=$((n + 1)); echo "$n" > ${JSON.stringify(cuenta)}
if [ "$n" -le ${ocupado} ]; then echo ${JSON.stringify(OCUPADO)}; echo "ERR: el build falló, no publico"; exit 1; fi
${final}
`,
  );
  return { dir, llamadas: () => Number(readFileSync(cuenta, "utf8")) };
}

function correr(dir, extra = {}) {
  const env = {
    ...process.env,
    ONIA_PUBLICAR_SOLO_SOURCE: "1",
    ONIA_PUBLICAR_LOCK: join(dir, "lock"),
    ONIA_PUBLICAR_REINTENTO_SEG: "0",
    ...extra,
  };
  const script = `source ${JSON.stringify(GUION)} >/dev/null 2>&1; correr_con_reintento ${JSON.stringify(
    join(dir, "publicar.sh"),
  )} ${JSON.stringify(join(dir, "pub.log"))} plataforma`;
  try {
    return { salida: execFileSync("/bin/bash", ["-c", script], { encoding: "utf8", env }), code: 0 };
  } catch (e) {
    return { salida: e.stdout || "", code: e.status };
  }
}

const casos = [];
const caso = (nombre, fn) => casos.push([nombre, fn]);

caso("con el VPS ocupado espera, reintenta y publica", () => {
  const { dir, llamadas } = preparar(2);
  const r = correr(dir);
  assert.equal(r.code, 0, r.salida);
  assert.equal(llamadas(), 3);
  assert.equal((r.salida.match(/reintento/g) || []).length, 2, r.salida);
  assert.match(readFileSync(join(dir, "pub.log"), "utf8"), /PUBLICADO Y VERIFICADO/);
  rmSync(dir, { recursive: true, force: true });
});

caso("un build roto NO se reintenta", () => {
  const { dir, llamadas } = preparar(0, "ERR: el build falló, no publico");
  const r = correr(dir);
  assert.equal(r.code, 1);
  assert.equal(llamadas(), 1);
  assert.doesNotMatch(r.salida, /reintento/);
  rmSync(dir, { recursive: true, force: true });
});

caso("se rinde despues del ultimo intento y deja el motivo en el log", () => {
  const { dir, llamadas } = preparar(10);
  const r = correr(dir, { ONIA_PUBLICAR_REINTENTOS: "3" });
  assert.equal(r.code, 1);
  assert.equal(llamadas(), 3);
  assert.match(readFileSync(join(dir, "pub.log"), "utf8"), /hay otro build corriendo/);
  rmSync(dir, { recursive: true, force: true });
});

let fallas = 0;
for (const [nombre, fn] of casos) {
  try {
    fn();
    console.log(`ok   ${nombre}`);
  } catch (e) {
    fallas += 1;
    console.log(`FAIL ${nombre}\n     ${e.message.split("\n")[0]}`);
  }
}
console.log(`\n${casos.length - fallas}/${casos.length} casos`);
process.exit(fallas ? 1 : 0);
