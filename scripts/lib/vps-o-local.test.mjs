// Guarda del helper que devolvió la vista a los gates vivos del carril.
//
// Cada caso está escrito para que NINGÚN otro caso pueda taparlo: validar por
// mutación da verde con el guardia roto cuando dos guardias hermanos atajan el
// mismo escenario, y eso ya pasó en este repo (avisos-vivo, 2026-09-07).

import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { citarParaShell, leerDeProduccion, listarDeProduccion } from "./vps-o-local.mjs";

test("si el disco local lo tiene, contesta local y NO sale a la red", () => {
  let preguntasAlVps = 0;
  const r = leerDeProduccion("/opt/x", {
    local: () => "CRON_SECRET=abc",
    remoto: () => {
      preguntasAlVps += 1;
      return "no-deberia-usarse";
    },
  });
  assert.equal(r.origen, "local");
  assert.equal(r.contenido, "CRON_SECRET=abc");
  // El testigo se ANOTA y se afirma acá: un assert.fail DENTRO de la dependencia
  // inyectada lo puede comer un try/catch del código bajo prueba y el caso pasa igual.
  assert.equal(preguntasAlVps, 0, "con el archivo en disco no hay que pagar un SSH");
});

test("si el disco local NO lo tiene, se lo pregunta al VPS", () => {
  const r = leerDeProduccion("/opt/x", {
    local: () => null,
    remoto: () => "CRON_SECRET=desde-el-vps",
  });
  assert.equal(r.origen, "remoto");
  assert.equal(r.contenido, "CRON_SECRET=desde-el-vps");
});

test("si NINGUNA vía contesta devuelve null, nunca cadena vacía", () => {
  const r = leerDeProduccion("/opt/x", { local: () => null, remoto: () => null });
  // Esto es el punto entero del módulo: `""` se lee como «lo medí y está vacío».
  assert.equal(r, null);
});

test("un archivo VACÍO de verdad no es lo mismo que no poder preguntar", () => {
  // Sólo este caso puede ver la diferencia: si el helper tratara `""` como falsy,
  // saldría a la red por un archivo que YA leyó, y con la red caída diría `null`
  // sobre un archivo que existe y está vacío.
  let preguntasAlVps = 0;
  const r = leerDeProduccion("/opt/vacio", {
    local: () => "",
    remoto: () => {
      preguntasAlVps += 1;
      return "contenido-inventado";
    },
  });
  assert.equal(r.contenido, "");
  assert.equal(r.origen, "local");
  assert.equal(preguntasAlVps, 0, "un archivo vacío ya es una respuesta: no se re-pregunta");
});

test("listar: sin dirs locales le pregunta al VPS", () => {
  const r = listarDeProduccion("/opt/onia-platform/build-*/", {
    local: () => [],
    remoto: () => ["/opt/onia-platform/build-3d1dabb/"],
  });
  assert.equal(r.origen, "remoto");
  assert.deepEqual(r.dirs, ["/opt/onia-platform/build-3d1dabb/"]);
});

test("listar: el VPS contestando LISTA VACÍA es una respuesta, no un no-medí", () => {
  // «no hay ningún build armado» y «no pude preguntar» se arreglan en lugares
  // opuestos; el único caso que los separa es éste.
  const r = listarDeProduccion("/opt/onia-platform/build-*/", {
    local: () => [],
    remoto: () => [],
  });
  assert.notEqual(r, null, "lista vacía del VPS es una respuesta real");
  assert.deepEqual(r.dirs, []);
  assert.equal(r.origen, "remoto");
});

test("listar: sin disco y sin VPS devuelve null", () => {
  const r = listarDeProduccion("/opt/onia-platform/build-*/", {
    local: () => null,
    remoto: () => null,
  });
  assert.equal(r, null);
});

test("la ruta viaja CITADA al shell remoto: los route groups de Next tienen paréntesis", () => {
  // `ssh` concatena sus argumentos en UNA cadena que el shell del otro lado
  // vuelve a interpretar. Sin citar, `app/(dashboard)/layout.tsx` revienta ALLÁ y
  // el fallo vuelve como `status != 0` — indistinguible de «el archivo no existe»,
  // así que el gate se declara ciego sobre un archivo que está ahí. Medido el
  // 2026-09-17: `puerta:alta` salió «no pude leer app/(dashboard)/layout.tsx del
  // build vivo» con el archivo de 13.032 bytes en su lugar.
  assert.equal(citarParaShell("app/(dashboard)/layout.tsx"), "'app/(dashboard)/layout.tsx'");
  assert.equal(citarParaShell("con espacio.tsx"), "'con espacio.tsx'");
  // Una comilla simple adentro no puede cerrar la cita y dejar el resto suelto:
  // eso sería ejecución remota de lo que venga después.
  assert.equal(citarParaShell("a'b"), `'a'\\''b'`);
  // Y no por heuristica: se le PREGUNTA a un shell de verdad si lo que recibe es
  // exactamente la ruta que pedimos. Un patron sobre la cadena citada se equivoca
  // justo en el caso que importa (`a'\''b` esta bien citado y parece roto).
  for (const crudo of ["app/(dashboard)/layout.tsx", "a'b", "con espacio.tsx", "$(whoami)", "`id`", "x; rm -rf /tmp/no"]) {
    const r = spawnSync("sh", ["-c", `printf %s ${citarParaShell(crudo)}`], { encoding: "utf8" });
    assert.equal(r.status, 0, `${crudo}: el shell tiene que poder parsearlo`);
    assert.equal(r.stdout, crudo, `${crudo}: al shell le tiene que llegar la cadena TAL CUAL`);
  }
});
