// qa-release.test.mjs — el QA después de cada publicación (HERMES_ROL_QA.md Q5, 10-oct).
//
// Hecho de Q5: «en el VPS simulado, un release roto da un aviso y una ventana fallida da una línea».
// El VPS simulado: docker y onia-mirar.js de mentira, el log del publicador escrito a mano, y la
// ADUANA DE VERDAD (onia-tg.sh) con tablero y Telegram de mentira. Así se prueba lo que le llega a
// Sergio Urcullo, no lo que el script cree que manda. Cada silencio tiene su gemelo que suena.
//
// Se corre con: node --test scripts/loops/qa-release.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, chmodSync, existsSync, mkdirSync, appendFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(AQUI, "qa-release.sh");
const ADUANA = join(AQUI, "onia-tg.sh");
const CORREO = "oninteligenciaartificial+qapago@gmail.com";

function ejecutable(f, contenido) {
  writeFileSync(f, contenido);
  chmodSync(f, 0o755);
}

/** Una pantalla sana tal cual la imprime onia-mirar.js. */
const sana = (ruta, extra = "") =>
  `URL_FINAL=https://app.onia.com.bo${ruta}\nTITULO=Onia\n---TEXTO---\n${"Agenda de hoy · Pacientes · Cobros\n".repeat(12)}${extra}`;

function vps() {
  const dir = mkdtempSync(join(tmpdir(), "qa-release-"));
  const bin = join(dir, "bin");
  const estado = join(dir, "estado");
  const aduana = join(dir, "aduana");
  mkdirSync(bin);
  mkdirSync(aduana);
  writeFileSync(join(aduana, "activo"), "");
  writeFileSync(join(dir, "tareas"), "");

  ejecutable(
    join(bin, "docker"),
    `#!/usr/bin/env bash
[ "$*" = "inspect --format {{.Config.Image}} onia-platform" ] || exit 9
[ -f ${dir}/imagen ] || { echo "Error: No such object: onia-platform" >&2; exit 1; }
cat ${dir}/imagen
`,
  );
  // onia-mirar.js de mentira: anota con qué lo llamaron y contesta lo que dice el escenario de esa ruta.
  writeFileSync(
    join(dir, "mirar.js"),
    `const fs = require("fs");
const [correo, ruta, captura] = process.argv.slice(2);
fs.appendFileSync(${JSON.stringify(join(dir, "mirar.log"))}, JSON.stringify({ correo, ruta, captura, n: process.argv.length }) + "\\n");
const base = ${JSON.stringify(dir)} + "/escena" + ruta.replace(/\\//g, "_");
const veces = (fs.existsSync(base + ".n") ? Number(fs.readFileSync(base + ".n", "utf8")) : 0) + 1;
fs.writeFileSync(base + ".n", String(veces));
const todo = JSON.parse(fs.readFileSync(base + ".json", "utf8"));
const e = veces > 1 && todo.luego ? todo.luego : todo;
const fin = Date.now() + (e.demora || 0);
while (Date.now() < fin) {}
process.stdout.write(e.salida);
process.exit(e.rc || 0);
`,
  );
  // En el VPS la aduana está en /root/bin con permiso de ejecución; en el repo no lo tiene.
  ejecutable(join(dir, "onia-tg.sh"), `#!/usr/bin/env bash\nexec bash ${ADUANA} "$@"\n`);
  ejecutable(
    join(dir, "tablero.sh"),
    `#!/usr/bin/env bash
T=${dir}/tareas
case "$1" in
  list) cat "$T" ;;
  create) n=$(( $(wc -l < "$T") + 1 )); id=$(printf 't_%08x' "$n"); echo "▶ $id ready $2" >> "$T"; echo "Created $id" ;;
  comment) echo "$2 $3" >> ${dir}/comentarios ;;
  complete) [ -f ${dir}/complete-falla ] && exit 1; sed -i "s/^▶ $2 /✓ $2 /" "$T" ;;
  *) exit 9 ;;
esac
`,
  );
  ejecutable(
    join(bin, "curl"),
    `#!/usr/bin/env bash
for a in "$@"; do case "$a" in text=*) printf '%s' "\${a#text=}" | base64 -w0 >> ${dir}/telegram; echo >> ${dir}/telegram;; esac; done
echo '{"ok":true,"result":{"message_id":42}}'
`,
  );

  const escena = (ruta, e) => {
    writeFileSync(join(dir, `escena${ruta.replace(/\//g, "_")}.json`), JSON.stringify(e));
    writeFileSync(join(dir, `escena${ruta.replace(/\//g, "_")}.n`), "0");
  };
  const imagen = (tag) => writeFileSync(join(dir, "imagen"), tag + "\n");
  escena("/dashboard", { salida: sana("/dashboard") });
  escena("/checkout", { salida: sana("/checkout") });
  imagen("onia-platform:release-abcd1234");
  // El publicador de las 12:50 UTC (08:50 La Paz) no tenía nada nuevo: la ventana que leen las corridas de las 14:00.
  writeFileSync(join(dir, "publicar-solo.log"), "== 2026-10-10 08:50 La Paz ==\n  plataforma: al dia\n");

  const correr = ({ ahora = "2026-10-10T14:00:00Z", env = {}, args = [] } = {}) => {
    const r = spawnSync("bash", [SCRIPT, ...args], {
      encoding: "utf8",
      env: {
        ...process.env,
        PATH: `${bin}:${process.env.PATH}`,
        ONIA_AHORA: ahora,
        ONIA_QA_ESTADO: estado,
        ONIA_QA_MIRAR: join(dir, "mirar.js"),
        ONIA_QA_LOG: join(dir, "qa.log"),
        ONIA_PUBLICAR_LOG: join(dir, "publicar-solo.log"),
        ONIA_PUBLICAR_LOCK: join(dir, "publicar.lock"),
        ONIA_QA_REINTENTO: "0",
        ONIA_TG: join(dir, "onia-tg.sh"),
        ONIA_TABLERO: join(dir, "tablero.sh"),
        ONIA_TG_LOG: join(dir, "onia-tg.log"),
        ONIA_TG_ENV: join(dir, "no-existe.env"),
        ONIA_AVISO_ESTADO: aduana,
        ONIA_AVISO_HM: "1000",
        TELEGRAM_BOT_TOKEN: "token-de-mentira",
        TELEGRAM_HOME_CHANNEL: "0",
        ...env,
      },
    });
    return { codigo: r.status, salida: r.stdout, error: r.stderr };
  };
  const leer = (f) => (existsSync(join(dir, f)) ? readFileSync(join(dir, f), "utf8") : "");
  // Un proceso que retiene un candado (flock) mientras la prueba corre el script.
  const retener = (archivo) => {
    // En su propio grupo: al soltar se mata también el sleep, que es el que tiene el candado.
    const p = spawn("flock", [archivo, "sleep", "30"], { stdio: "ignore", detached: true });
    spawnSync("bash", ["-c", `for i in $(seq 50); do flock -n ${archivo} true || exit 0; sleep 0.1; done`]);
    return () => process.kill(-p.pid, "SIGKILL");
  };
  return {
    dir,
    estado,
    retener,
    escena,
    imagen,
    correr,
    llamadas: () => leer("mirar.log").split("\n").filter(Boolean).map((l) => JSON.parse(l)),
    tareas: () => leer("tareas").split("\n").filter(Boolean),
    comentarios: () => leer("comentarios"),
    telegram: () => leer("telegram").split("\n").filter(Boolean).map((l) => Buffer.from(l, "base64").toString("utf8")),
    publicador: (texto) => appendFileSync(join(dir, "publicar-solo.log"), texto),
    // La aduana espera 30 min con el reloj de verdad: se envejece su marca, como en onia-tg-aduana.test.mjs.
    envejecerEspera: (min) => {
      mkdirSync(join(aduana, "pendientes"), { recursive: true });
      writeFileSync(join(aduana, "pendientes", "qa-release"), String(Math.floor(Date.now() / 1000) - min * 60));
    },
  };
}

// ── El release ───────────────────────────────────────────────────────────────────

test("primera corrida: mira /dashboard y /checkout del release vivo con la cuenta de QA, y no avisa nada", () => {
  const v = vps();
  const r = v.correr();
  assert.equal(r.codigo, 0, r.salida + r.error);
  assert.match(r.salida, /release abcd1234 \(primera vez que lo miro\): \/dashboard OK \d+ s · \/checkout OK \d+ s/);
  assert.deepEqual(v.llamadas().map((l) => [l.correo, l.ruta]), [[CORREO, "/dashboard"], [CORREO, "/checkout"]]);
  assert.deepEqual(v.tareas(), []);
  assert.deepEqual(v.telegram(), []);
});

test("mismo release: no vuelve a abrir el navegador, pero deja su línea (el diagnóstico mide el log)", () => {
  const v = vps();
  v.correr();
  const r = v.correr({ ahora: "2026-10-10T14:15:00Z" });
  assert.equal(r.codigo, 0);
  assert.match(r.salida, /^2026-10-10T14:15Z release abcd1234 sin cambios$/m);
  assert.equal(v.llamadas().length, 2, "solo las dos de la primera corrida");
});

test("gemelo: release nuevo, vuelve a mirar y lo dice con el anterior", () => {
  const v = vps();
  v.correr();
  v.imagen("onia-platform:release-ffff0000");
  const r = v.correr({ ahora: "2026-10-10T14:15:00Z" });
  assert.match(r.salida, /release ffff0000 nuevo \(antes abcd1234\): \/dashboard OK/);
  assert.equal(v.llamadas().length, 4);
});

test("🔴 el correo de QA va fijo: el script no acepta argumentos ni lo toma del entorno", () => {
  const v = vps();
  const conArgumento = v.correr({ args: ["superadmin@onia.com.bo"] });
  assert.equal(conArgumento.codigo, 64);
  assert.equal(v.llamadas().length, 0, "con un argumento no abre nada");
  v.correr({ env: { CORREO_QA: "superadmin@onia.com.bo", ONIA_QA_CORREO: "superadmin@onia.com.bo" } });
  assert.ok(v.llamadas().every((l) => l.correo === CORREO && l.n === 5), JSON.stringify(v.llamadas()));
  // Y en el código hay UN solo correo, en una constante de solo lectura.
  const fuente = readFileSync(SCRIPT, "utf8");
  assert.deepEqual(fuente.match(/[\w.+-]+@[\w-]+\.[\w.]+/g), [CORREO]);
  assert.match(fuente, /^readonly CORREO_QA='[^']+'$/m);
});

test("un release roto: tarea para Plataforma al momento, sin despertar a nadie todavía", () => {
  const v = vps();
  v.correr();
  v.imagen("onia-platform:release-bad00bad");
  v.escena("/checkout", { salida: "URL_FINAL=https://app.onia.com.bo/login?next=/checkout\nTITULO=Ingresar\n---TEXTO---\nHola de nuevo\n" });
  const r = v.correr({ ahora: "2026-10-10T14:15:00Z" });
  assert.equal(r.codigo, 0, "midió: lo roto es la plataforma, no el vigía");
  assert.match(r.salida, /release bad00bad nuevo \(antes abcd1234\) ROTO: \/checkout terminó en \/login/);
  assert.equal(v.tareas().length, 1);
  assert.match(v.tareas()[0], /Plataforma: el release publicado está roto/);
  assert.deepEqual(v.telegram(), [], "la interrupción 4 espera 30 min");
});

test("gemelo: si a los 30 min sigue roto, le llega la interrupción 4; y cuando vuelve, se cierra todo", () => {
  const v = vps();
  v.correr();
  v.imagen("onia-platform:release-bad00bad");
  v.escena("/checkout", { salida: "URL_FINAL=https://app.onia.com.bo/login\n---TEXTO---\nx\n" });
  v.correr({ ahora: "2026-10-10T14:15:00Z" });
  v.envejecerEspera(31);
  const sigue = v.correr({ ahora: "2026-10-10T14:45:00Z" });
  assert.match(sigue.salida, /\(vuelvo a mirar\) ROTO: .*roto desde 14:15Z/);
  assert.equal(v.telegram().length, 1);
  assert.match(v.telegram()[0], /la app publicada está rota[\s\S]*Pasó: \/checkout terminó en \/login \(release bad00bad\), desde las 10:15 de La Paz/);
  assert.equal(v.tareas().length, 1, "la misma tarea, no una por corrida");

  v.escena("/checkout", { salida: sana("/checkout") });
  const volvio = v.correr({ ahora: "2026-10-10T15:00:00Z" });
  assert.match(volvio.salida, /\(vuelvo a mirar\): \/dashboard OK .* \/checkout OK/);
  assert.equal(v.telegram().length, 2);
  assert.match(v.telegram()[1], /la app volvió/);
  assert.match(v.tareas()[0], /^✓ /, "la tarea roja se cierra");
  assert.match(v.comentarios(), /Volvió: release bad00bad sano/);
  assert.equal(existsSync(join(v.estado, "roto")), false);
  const despues = v.correr({ ahora: "2026-10-10T15:15:00Z" });
  assert.match(despues.salida, /release bad00bad sin cambios/);
});

test("si se arregla antes de los 30 min, no le llega nada", () => {
  const v = vps();
  v.escena("/dashboard", { salida: sana("/dashboard", "Algo salió mal\n") });
  const roto = v.correr();
  assert.match(roto.salida, /ROTO: \/dashboard muestra «Algo salió mal»/);
  v.escena("/dashboard", { salida: sana("/dashboard") });
  v.correr({ ahora: "2026-10-10T14:15:00Z" });
  assert.deepEqual(v.telegram(), []);
  assert.match(v.tareas()[0], /^✓ /);
});

test("lo que cuenta como roto: texto de error, pantalla vacía, lenta, que no termine", () => {
  const casos = [
    [{ salida: sana("/checkout", "Página no encontrada\n") }, /\/checkout muestra «Página no encontrada»/],
    [{ salida: "URL_FINAL=https://app.onia.com.bo/checkout\n---TEXTO---\nCargando\n" }, /\/checkout pantalla casi vacía \(\d+ caracteres\)/],
    [{ salida: sana("/checkout"), demora: 1300 }, /\/checkout lenta: \d+ s \(tope 1 s\)/],
    [{ salida: "FALLO: page.goto: Timeout 60000ms exceeded\n", rc: 1 }, /\/checkout page\.goto: Timeout 60000ms exceeded/],
    [{ salida: sana("/dashboard") }, /\/checkout terminó en \/dashboard/],
  ];
  for (const [e, esperado] of casos) {
    const v = vps();
    v.escena("/checkout", e);
    const r = v.correr({ env: { ONIA_QA_LENTO: "1" } });
    assert.match(r.salida, esperado, JSON.stringify(e));
    assert.equal(v.tareas().length, 1, JSON.stringify(e));
  }
});

test("los errores de consola se cuentan pero no rompen; nada de la sesión llega al log", () => {
  const v = vps();
  v.escena("/dashboard", { salida: sana("/dashboard", "---ERRORES CONSOLA---\nCSP report\nfavicon 404\n") });
  const sano = v.correr();
  assert.match(sano.salida, /\/dashboard OK \d+ s, 2 error\(es\) de consola · \/checkout OK \d+ s$/m);
  v.imagen("onia-platform:release-0000beef");
  v.escena("/checkout", {
    salida: "FALLO: page.goto: net::ERR_ABORTED at https://app.onia.com.bo/auth/confirm?token_hash=secreto123&type=magiclink con eyJhbGciOi.eyJzdWIi.firma\n",
    rc: 1,
  });
  const r = v.correr({ ahora: "2026-10-10T14:15:00Z" });
  assert.match(r.salida, /ROTO: \/checkout page\.goto: net::ERR_ABORTED/);
  assert.doesNotMatch(r.salida + v.tareas().join("\n"), /secreto123|eyJhbGciOi/);
  assert.match(r.salida, /token_hash=…/);
});

test("no poder abrir la sesión de QA no es la plataforma rota: tarea del instrumento, sin interrupción, exit 2", () => {
  const v = vps();
  v.escena("/dashboard", { salida: 'FALLO: generate_link HTTP 404: {"msg":"User not found"}\n', rc: 1 });
  const r = v.correr();
  assert.equal(r.codigo, 2);
  assert.match(r.salida, /NO MEDIDO: \/dashboard no pude abrir la sesión de QA/);
  assert.match(v.tareas()[0], /QA de publicación: no pude medir/);
  assert.doesNotMatch(v.tareas()[0], /Plataforma/);
  assert.equal(existsSync(join(v.dir, "aduana", "pendientes", "qa-release")), false, "no arranca la espera de la interrupción");
  // Sigue intentando en cada corrida, y cuando vuelve a medir cierra su tarea.
  v.escena("/dashboard", { salida: sana("/dashboard") });
  const r2 = v.correr({ ahora: "2026-10-10T14:15:00Z" });
  assert.equal(r2.codigo, 0);
  assert.match(r2.salida, /release abcd1234 \(primera vez que lo miro\): \/dashboard OK/);
  assert.match(v.tareas()[0], /^✓ /);
});

test("sin onia-mirar.js o sin release legible: no medido, exit 2", () => {
  const v = vps();
  const sinMirar = v.correr({ env: { ONIA_QA_MIRAR: join(v.dir, "no-esta.js") } });
  assert.equal(sinMirar.codigo, 2);
  assert.match(sinMirar.salida, /NO MEDIDO: \/dashboard no encuentro/);
  v.imagen("onia-platform:latest");
  const sinRelease = v.correr({ ahora: "2026-10-10T14:15:00Z" });
  assert.equal(sinRelease.codigo, 2);
  assert.match(sinRelease.salida, /release: no pude leerlo/);
});

// ── Las ventanas del publicador de las :50 ───────────────────────────────────────

const bloque = (laPaz, plataforma) => `== 2026-10-10 ${laPaz} La Paz ==\n  plataforma: ${plataforma}\n  landing: al dia\n`;

test("una ventana fallida da una línea, sin tarea; la segunda seguida abre tarea para Plataforma", () => {
  const v = vps();
  v.publicador(bloque("11:50", "FALLO"));
  const una = v.correr({ ahora: "2026-10-10T17:00:00Z" });
  assert.equal(una.codigo, 0);
  assert.match(una.salida, /^2026-10-10T17:00Z ventana 15:50 UTC sin publicar: FALLO \(seguidas: 1\)$/m);
  assert.deepEqual(v.tareas(), []);

  v.publicador(bloque("14:51", "NO publico solo — toca una fuente de precio y no pude medir si cambia"));
  const dos = v.correr({ ahora: "2026-10-10T20:00:00Z" });
  assert.match(dos.salida, /ventana 18:50 UTC sin publicar: NO publico solo — toca una fuente de precio y no pude medir si cambia \(seguidas: 2\)/);
  assert.equal(v.tareas().length, 1);
  assert.match(v.tareas()[0], /Plataforma: 2 ventanas de publicación seguidas sin publicar/);
  assert.deepEqual(v.telegram(), [], "nunca interrumpe: producción sigue con el release anterior");

  v.publicador(bloque("17:50", "PUBLICADO"));
  const vuelve = v.correr({ ahora: "2026-10-10T23:00:00Z" });
  assert.match(vuelve.salida, /ventana 21:50 UTC: plataforma PUBLICADO/);
  assert.match(v.tareas()[0], /^✓ /, "la tarea se cierra cuando vuelve a publicar");
  assert.equal(readFileSync(join(v.estado, "ventanas-seguidas"), "utf8").trim(), "0");
});

test("«al dia» no es una ventana fallida: no había nada nuevo para publicar", () => {
  const v = vps();
  v.publicador(bloque("11:50", "FALLO"));
  v.correr({ ahora: "2026-10-10T17:00:00Z" });
  v.publicador(bloque("14:50", "al dia"));
  const r = v.correr({ ahora: "2026-10-10T20:00:00Z" });
  assert.match(r.salida, /ventana 18:50 UTC: plataforma al dia/);
  v.publicador(bloque("17:50", "FALLO"));
  v.correr({ ahora: "2026-10-10T23:00:00Z" });
  assert.deepEqual(v.tareas(), [], "FALLO, al día, FALLO no son dos seguidas");
});

test("cada ventana se lee una sola vez, recién una hora y diez después", () => {
  const v = vps();
  v.publicador(bloque("08:50", "al dia") + bloque("11:50", "FALLO"));
  const antes = v.correr({ ahora: "2026-10-10T16:45:00Z" });
  assert.match(antes.salida, /ventana 12:50 UTC: plataforma al dia/, "la última ventana ya lista es la de las 12:50");
  assert.doesNotMatch(antes.salida, /ventana 15:50/, "a las 16:45 el publicador puede seguir corriendo");
  v.correr({ ahora: "2026-10-10T17:00:00Z" });
  const otra = v.correr({ ahora: "2026-10-10T17:15:00Z" });
  assert.doesNotMatch(otra.salida, /ventana/);
  assert.equal(readFileSync(join(v.estado, "ventanas-seguidas"), "utf8").trim(), "1");
});

test("el publicador que se rindió con el lock, o que no dejó nada, también es ventana fallida", () => {
  const v = vps();
  v.publicador("== 2026-10-10 12:05 La Paz ==\n  me rendi: otra publicacion lleva mas de 900s con el lock (/var/lock/x)\n");
  const r = v.correr({ ahora: "2026-10-10T17:00:00Z" });
  assert.match(r.salida, /ventana 15:50 UTC sin publicar: se rindió: otra publicación tenía el lock/);
  const nada = v.correr({ ahora: "2026-10-10T20:00:00Z" });
  assert.match(nada.salida, /ventana 18:50 UTC sin publicar: el publicador no dejó veredicto de la plataforma en esa hora \(seguidas: 2\)/);
});

test("el bloque de OTRA ventana no cuenta, y sin el log del publicador no se inventa nada", () => {
  const v = vps();
  v.publicador(bloque("11:50", "PUBLICADO") + bloque("15:50", "FALLO"));
  const r = v.correr({ ahora: "2026-10-10T20:00:00Z" });
  assert.match(r.salida, /ventana 18:50 UTC sin publicar: el publicador no dejó veredicto/, "el FALLO de las 19:50 UTC es de la ventana siguiente");
});

test("sin el log del publicador no se inventa nada: exit 2, tarea, y la ventana se lee cuando aparece", () => {
  const v = vps();
  rmSync(join(v.dir, "publicar-solo.log"));
  const sinLog = v.correr({ ahora: "2026-10-10T17:00:00Z" });
  assert.equal(sinLog.codigo, 2, "el latido lo anota: el resumen lo nombra");
  assert.match(sinLog.salida, /ventana 15:50 UTC: no puedo leer el log del publicador/);
  assert.match(v.tareas()[0], /no puedo leer el log del publicador/);
  assert.equal(existsSync(join(v.estado, "ventanas-seguidas")), false);
  v.publicador(bloque("11:50", "FALLO"));
  const despues = v.correr({ ahora: "2026-10-10T17:15:00Z" });
  assert.equal(despues.codigo, 0);
  assert.match(despues.salida, /ventana 15:50 UTC sin publicar: FALLO \(seguidas: 1\)/, "la ventana no se había dado por leída");
  assert.match(v.tareas()[0], /^✓ /, "la tarea del log se cierra");
});

test("la espera de una firma no es una ventana fallida, ni borra la cuenta", () => {
  const v = vps();
  const firmaBloque = (h) => bloque(h, "NO publico solo — cambia un monto: lib/pricing.ts");
  v.publicador(firmaBloque("11:50"));
  const firma = v.correr({ ahora: "2026-10-10T17:00:00Z" });
  assert.match(firma.salida, /ventana 15:50 UTC: plataforma espera la firma de Sergio Urcullo \(NO publico solo — cambia un monto/);
  v.publicador(firmaBloque("14:50"));
  v.correr({ ahora: "2026-10-10T20:00:00Z" });
  assert.deepEqual(v.tareas(), [], "dos firmas pendientes no son tarea de Plataforma");
  // FALLO, firma, FALLO: la firma no cuenta, pero tampoco borra la cuenta.
  v.publicador(bloque("17:50", "FALLO"));
  v.correr({ ahora: "2026-10-10T23:00:00Z" });
  v.publicador(firmaBloque("20:50").replace("2026-10-10", "2026-10-10"));
  v.correr({ ahora: "2026-10-11T02:00:00Z" });
  v.publicador("== 2026-10-10 23:50 La Paz ==\n  plataforma: FALLO\n");
  v.correr({ ahora: "2026-10-11T05:00:00Z" });
  assert.equal(readFileSync(join(v.estado, "ventanas-seguidas"), "utf8").trim(), "2");
  assert.match(v.tareas()[0], /Plataforma: 2 ventanas de publicación seguidas sin publicar/);
});

test("un bloque sin veredicto con el publicador corriendo se lee en la próxima; sin publicador, es fallida", () => {
  const v = vps();
  v.publicador("== 2026-10-10 11:58 La Paz ==\n");
  const soltar = v.retener(join(v.dir, "publicar.lock"));
  const corriendo = v.correr({ ahora: "2026-10-10T17:00:00Z" });
  soltar();
  assert.match(corriendo.salida, /ventana 15:50 UTC: el publicador sigue corriendo, la leo en la próxima/);
  v.publicador("  plataforma: PUBLICADO\n");
  const luego = v.correr({ ahora: "2026-10-10T17:15:00Z" });
  assert.match(luego.salida, /ventana 15:50 UTC: plataforma PUBLICADO/);
  // Gemelo: el mismo bloque mudo sin nadie con el candado es una ventana fallida.
  const w = vps();
  w.publicador("== 2026-10-10 11:58 La Paz ==\n");
  writeFileSync(join(w.dir, "publicar.lock"), "");
  assert.match(w.correr({ ahora: "2026-10-10T17:00:00Z" }).salida, /ventana 15:50 UTC sin publicar: el publicador no dejó veredicto/);
});

test("un --dry-run a mano en esa hora no tapa la corrida de verdad", () => {
  const v = vps();
  v.publicador(bloque("11:50", "FALLO") + bloque("12:20", "publicaria (nada toca precio)"));
  const r = v.correr({ ahora: "2026-10-10T17:00:00Z" });
  assert.match(r.salida, /ventana 15:50 UTC sin publicar: FALLO/);
});

// ── El instrumento contra la plataforma ─────────────────────────────────────────

test("instrumento roto es NO MEDIDO (exit 2, tarea del carril, sin interrupción), nunca «release roto»", () => {
  const casos = [
    [{ salida: "", rc: 137 }, /no terminó en 150 s/],
    [{ salida: "FALLO: browserType.launch: Executable doesn't exist at /root/.cache/ms-playwright\n", rc: 1 }, /browserType\.launch: Executable doesn't exist/],
    [{ salida: "/root/bin/onia-mirar.js:3\nSyntaxError: Unexpected token\n", rc: 1 }, /onia-mirar\.js terminó con código 1 sin decir por qué/],
    [{ salida: "FALLO: Command failed: docker exec onia-platform printenv SUPABASE_SERVICE_ROLE_KEY\n", rc: 1 }, /Command failed: docker exec/],
    [{ salida: 'FALLO: sin hashed_token: {"action_link":"https://x/verify?token=abc123secreto"}\n', rc: 1 }, /no pude abrir la sesión de QA \(sin hashed_token\)/],
  ];
  for (const [e, esperado] of casos) {
    const v = vps();
    v.escena("/checkout", e);
    const r = v.correr();
    assert.equal(r.codigo, 2, JSON.stringify(e));
    assert.match(r.salida, /NO MEDIDO: \/checkout /, JSON.stringify(e));
    assert.match(r.salida, esperado, JSON.stringify(e));
    assert.doesNotMatch(r.salida + v.tareas().join("\n"), /abc123secreto/);
    assert.equal(v.tareas().length, 1);
    assert.match(v.tareas()[0], /QA de publicación: no pude medir/);
    assert.equal(existsSync(join(v.dir, "aduana", "pendientes", "qa-release")), false, JSON.stringify(e));
  }
});

test("gemelo: el servidor que no responde o el login que da 5xx SÍ es la plataforma rota", () => {
  for (const [salida, esperado] of [
    ["FALLO: generate_link HTTP 502: <html>Bad Gateway</html>\n", /\/checkout el login \(Supabase\) responde HTTP 502/],
    ["FALLO: fetch failed\n", /\/checkout fetch failed/],
    ["FALLO: page.goto: net::ERR_CONNECTION_REFUSED at https://app.onia.com.bo/checkout\n", /\/checkout page\.goto: net::ERR_CONNECTION_REFUSED/],
  ]) {
    const v = vps();
    v.escena("/checkout", { salida, rc: 1 });
    const r = v.correr();
    assert.equal(r.codigo, 0);
    assert.match(r.salida, esperado);
    assert.match(v.tareas()[0], /Plataforma: el release publicado está roto/);
  }
});

test("lo roto gana: una pantalla rota es evidencia aunque la otra no se haya podido medir", () => {
  const v = vps();
  v.escena("/dashboard", { salida: "", rc: 137 });
  v.escena("/checkout", { salida: sana("/checkout", "Algo salió mal\n") });
  const r = v.correr();
  assert.match(r.salida, /ROTO: \/checkout muestra «Algo salió mal»/);
  assert.match(v.tareas()[0], /Plataforma: el release publicado está roto/);
});

test("lo que sale roto se vuelve a mirar una vez antes de abrir tarea (Next recién swapeado)", () => {
  const v = vps();
  v.escena("/checkout", { salida: "URL_FINAL=https://app.onia.com.bo/checkout\n---TEXTO---\nx\n", luego: { salida: sana("/checkout") } });
  const r = v.correr();
  assert.match(r.salida, /\/dashboard OK \d+ s · \/checkout OK \d+ s/);
  assert.deepEqual(v.tareas(), []);
  assert.deepEqual(v.llamadas().map((l) => l.ruta), ["/dashboard", "/checkout", "/checkout"]);
});

test("una tarea cerrada a mano no deja el script sin abrir otra", () => {
  const v = vps();
  v.escena("/checkout", { salida: sana("/dashboard") });
  v.correr();
  assert.equal(v.tareas().length, 1);
  writeFileSync(join(v.dir, "tareas"), v.tareas()[0].replace(/^▶/, "✓") + "\n");
  v.correr({ ahora: "2026-10-10T14:15:00Z" });
  assert.equal(v.tareas().length, 2);
  assert.match(v.tareas()[1], /^▶ .*Plataforma: el release publicado está roto/);
});

test("el aviso a Telegram escapa el HTML (un «<» suelto hace que Telegram lo rechace)", () => {
  const v = vps();
  v.escena("/checkout", { salida: "URL_FINAL=https://app.onia.com.bo/a<b>\n---TEXTO---\nx\n" });
  v.correr();
  v.envejecerEspera(31);
  v.correr({ ahora: "2026-10-10T14:45:00Z" });
  assert.equal(v.telegram().length, 1);
  assert.match(v.telegram()[0], /terminó en \/a&lt;b&gt;/);
});

test("el candado: una corrida que se pisa salta; una trabada hace más de 20 min sale con 75", () => {
  const v = vps();
  mkdirSync(v.estado, { recursive: true });
  const soltar = v.retener(join(v.estado, ".candado"));
  try {
    writeFileSync(join(v.estado, "corriendo-desde"), String(Date.parse("2026-10-10T13:55:00Z") / 1000));
    const pisada = v.correr();
    assert.equal(pisada.codigo, 0);
    assert.match(pisada.salida, /otra corrida sigue mirando: salto esta/);
    writeFileSync(join(v.estado, "corriendo-desde"), String(Date.parse("2026-10-10T13:30:00Z") / 1000));
    const trabada = v.correr();
    assert.equal(trabada.codigo, 75);
    assert.match(trabada.salida, /la corrida de las 13:30Z sigue con el candado \(30 min\): nadie está mirando/);
  } finally {
    soltar();
  }
  assert.equal(v.llamadas().length, 0);
});

test("el log se recorta a 2000 líneas cuando pasa de 4000", () => {
  const v = vps();
  const log = join(v.dir, "qa.log");
  writeFileSync(log, "línea vieja\n".repeat(4001));
  v.correr();
  assert.equal(readFileSync(log, "utf8").split("\n").filter(Boolean).length, 2000);
});

test("contrato con onia-mirar.js: lo que este script lee, ese script lo imprime", () => {
  const mirar = readFileSync(join(AQUI, "..", "onia-mirar.js"), "utf8");
  for (const marca of ['"URL_FINAL="', '"---TEXTO---"', '"---ERRORES CONSOLA---"', '"FALLO: "', '"generate_link HTTP "', '"sin hashed_token: "']) {
    assert.ok(mirar.includes(marca), `onia-mirar.js ya no imprime ${marca}`);
  }
  // Argumentos: correo, ruta, captura. Si cambia el orden, este script le pasaría la ruta como correo.
  assert.match(mirar, /const email = process\.argv\[2\];\nconst target = process\.argv\[3\][^\n]*;\nconst shot = process\.argv\[4\]/);
});

test("salida sin las marcas de onia-mirar.js (vacía, truncada) con código 0: NO MEDIDO, no «roto»", () => {
  const v = vps();
  v.escena("/dashboard", { salida: "" });
  v.escena("/checkout", { salida: "TITULO=Onia\n" });
  const r = v.correr();
  assert.equal(r.codigo, 2);
  assert.match(r.salida, /NO MEDIDO: \/dashboard onia-mirar\.js no imprimió la pantalla; \/checkout onia-mirar\.js no imprimió la pantalla/);
  assert.doesNotMatch(v.tareas().join("\n"), /Plataforma/);
});

test("el contenedor parado SÍ es la plataforma caída; Chromium que murió es el instrumento", () => {
  const v = vps();
  v.escena("/checkout", { salida: "FALLO: Command failed: docker exec onia-platform printenv SUPABASE_SERVICE_ROLE_KEY\nError response from daemon: container 3f2a is not running\n", rc: 1 });
  const parado = v.correr();
  assert.match(parado.salida, /ROTO: \/checkout el contenedor onia-platform no está corriendo/);
  for (const fallo of ["FALLO: page.goto: Page crashed", "FALLO: page.goto: Target page, context or browser has been closed", "FALLO: page.goto: net::ERR_NAME_NOT_RESOLVED at https://app.onia.com.bo/x"]) {
    const w = vps();
    w.escena("/checkout", { salida: fallo + "\n", rc: 1 });
    const r = w.correr();
    assert.equal(r.codigo, 2, fallo);
    assert.match(r.salida, /NO MEDIDO: \/checkout /, fallo);
  }
});

test("lo roto se mira dos veces como mucho, no en bucle", () => {
  const v = vps();
  v.escena("/checkout", { salida: sana("/dashboard") });
  v.correr();
  assert.deepEqual(v.llamadas().map((l) => l.ruta), ["/dashboard", "/checkout", "/checkout"]);
});

test("una ventana esperando un publicador colgado no se pierde: a las 2 h 30 es fallida", () => {
  const v = vps();
  v.publicador("== 2026-10-10 11:58 La Paz ==\n");
  const soltar = v.retener(join(v.dir, "publicar.lock"));
  try {
    assert.match(v.correr({ ahora: "2026-10-10T18:15:00Z" }).salida, /ventana 15:50 UTC: el publicador sigue corriendo/);
    const tarde = v.correr({ ahora: "2026-10-10T18:30:00Z" });
    assert.match(tarde.salida, /ventana 15:50 UTC sin publicar: el publicador lleva más de 2 h con el lock \(seguidas: 1\)/);
  } finally {
    soltar();
  }
});

test("si el tablero no deja cerrar la tarea, el id se guarda y se cierra en la próxima", () => {
  const v = vps();
  v.escena("/checkout", { salida: sana("/dashboard") });
  v.correr();
  v.escena("/checkout", { salida: sana("/checkout") });
  writeFileSync(join(v.dir, "complete-falla"), "");
  v.correr({ ahora: "2026-10-10T14:15:00Z" });
  assert.match(v.tareas()[0], /^▶ /);
  assert.equal(existsSync(join(v.estado, "tarea-roto")), true, "no se olvida el id");
  rmSync(join(v.dir, "complete-falla"));
  v.correr({ ahora: "2026-10-10T14:30:00Z" });
  assert.match(v.tareas()[0], /^✓ /, "con el tablero de vuelta, la próxima corrida la cierra");
  assert.equal(existsSync(join(v.estado, "tarea-roto")), false);
});

test("onia-mirar.js no hereda el candado: un Chromium huérfano no deja al QA mudo", () => {
  const v = vps();
  // Un onia-mirar.js que mira qué tiene en su descriptor 8 y lo anota.
  const espia = join(v.dir, "espia.js");
  writeFileSync(espia, `const fs = require("fs");
let fd8 = "cerrado";
try { fd8 = fs.readlinkSync("/proc/self/fd/8"); } catch {}
fs.appendFileSync(${JSON.stringify(join(v.dir, "fd8"))}, fd8 + "\\n");
process.stdout.write("URL_FINAL=https://app.onia.com.bo" + process.argv[3] + "\\n---TEXTO---\\n" + "x".repeat(300) + "\\n");
`);
  v.correr({ env: { ONIA_QA_MIRAR: espia } });
  const vistos = readFileSync(join(v.dir, "fd8"), "utf8").trim().split("\n");
  assert.equal(vistos.length, 2);
  for (const f of vistos) assert.doesNotMatch(f, /\.candado/);
});
