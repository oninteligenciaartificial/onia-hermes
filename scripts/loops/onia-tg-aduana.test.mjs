// onia-tg-aduana.test.mjs — la aduana de avisos hace cumplir lo que Sergio Urcullo eligió.
//
// POR QUÉ EXISTE. El 2026-09-29 Sergio Urcullo dijo "que me envíe poquitas cosas… me manda
// puros errores" y eligió, una por una, lo que le llega: un resumen a las 06:30, un cierre a
// las 22:00 y, en el medio, cuatro interrupciones (ONIA_CEREBRO.md, «La regla de entrega»).
// `onia-tg.sh` pasa a ser la aduana única. Estos casos fijan cada promesa de esa regla, y
// también la dirección contraria: una aduana que se calla TODO pasaría cualquier test que
// sólo mida silencio — por eso cada silencio tiene su caso gemelo que SÍ tiene que sonar.
//
// Se corre con: node --test scripts/loops/onia-tg-aduana.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, chmodSync, existsSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(AQUI, "onia-tg.sh");

/** Banco hermético: tablero y curl de mentira, estado y log en un directorio temporal. */
function banco({ activa = true, respuesta = '{"ok":true,"result":{"message_id":42}}' } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "onia-aduana-"));
  const estado = join(dir, "estado");
  mkdirSync(estado);
  if (activa) writeFileSync(join(estado, "activo"), "");
  const envios = join(dir, "envios.txt");
  const tareas = join(dir, "tareas.txt");
  writeFileSync(tareas, "");

  const tablero = join(dir, "tablero.sh");
  writeFileSync(
    tablero,
    `#!/usr/bin/env bash
if [ "$1" = "list" ]; then cat ${tareas}; exit 0; fi
if [ "$1" = "create" ]; then echo "▶ t_0000aaaa ready $2" >> ${tareas}; echo "Created t_0000aaaa"; exit 0; fi
exit 9
`,
  );
  chmodSync(tablero, 0o755);

  // El curl de mentira anota el texto que se habría mandado, sin salir a la red.
  const curl = join(dir, "curl");
  writeFileSync(
    curl,
    `#!/usr/bin/env bash
for a in "$@"; do case "$a" in text=*) printf '%s\\n' "\${a#text=}" >> ${envios};; esac; done
echo '${respuesta}'
`,
  );
  chmodSync(curl, 0o755);

  const avisar = (msg, env = {}) =>
    execFileSync("bash", [SCRIPT, msg], {
      env: {
        ...process.env,
        PATH: `${dir}:${process.env.PATH}`,
        ONIA_TABLERO: tablero,
        ONIA_TG_LOG: join(dir, "onia-tg.log"),
        ONIA_TG_ENV: join(dir, "no-existe.env"),
        ONIA_AVISO_ESTADO: estado,
        TELEGRAM_BOT_TOKEN: "token-de-mentira",
        TELEGRAM_HOME_CHANNEL: "0",
        ONIA_AVISO_HM: "1000",
        ...env,
      },
      encoding: "utf8",
    });

  const enviados = () => (existsSync(envios) ? readFileSync(envios, "utf8").split("\n").filter(Boolean) : []);
  const cola = () => {
    const f = join(estado, "resumen.log");
    return existsSync(f) ? readFileSync(f, "utf8").split("\n").filter(Boolean) : [];
  };
  const log = () => (existsSync(join(dir, "onia-tg.log")) ? readFileSync(join(dir, "onia-tg.log"), "utf8") : "");
  const tareasCreadas = () => readFileSync(tareas, "utf8").split("\n").filter(Boolean);
  const envejecer = (sub, clave, minutos) => {
    mkdirSync(join(estado, sub), { recursive: true });
    writeFileSync(join(estado, sub, clave), String(Math.floor(Date.now() / 1000) - minutos * 60));
  };
  return { avisar, enviados, cola, log, tareasCreadas, envejecer, estado };
}

// ── El interruptor: sin él, nada cambia para los emisores viejos ────────────────

test("sin el interruptor, un emisor viejo (DIRECTO=1) de noche sale igual, como siempre", () => {
  const b = banco({ activa: false });
  b.avisar("💰 Pago pendiente de revisar", { ONIA_TG_DIRECTO: "1", ONIA_AVISO_HM: "2330" });
  assert.equal(b.enviados().length, 1);
  assert.equal(b.cola().length, 0);
});

test("sin el interruptor, `resumen` no encola (no hay resumen que lo lea) y no suena", () => {
  const b = banco({ activa: false });
  b.avisar("📬 Se publicó el carrusel K1", { ONIA_AVISO: "resumen" });
  assert.equal(b.enviados().length, 0);
  assert.equal(b.cola().length, 0);
  assert.match(b.log(), /INFORMATIVO/);
});

// ── El silencio de 22:00 a 06:30 ────────────────────────────────────────────────

test("de noche una interrupción NO suena: va al resumen de la mañana, una sola vez", () => {
  const b = banco();
  b.avisar("🔴 El bot no contesta", { ONIA_AVISO: "interrumpe", ONIA_AVISO_HM: "2330" });
  b.avisar("🔴 El bot no contesta", { ONIA_AVISO: "interrumpe", ONIA_AVISO_HM: "0200" });
  assert.equal(b.enviados().length, 0);
  assert.equal(b.cola().length, 1, "la misma caída repetida de noche se encola una sola vez");
  assert.match(b.cola()[0], /\tnoche\t/);
});

test("gemelo: a las 06:30 en punto ya suena, y a las 21:59 todavía suena", () => {
  for (const hm of ["0630", "2159"]) {
    const b = banco();
    b.avisar("🔴 El bot no contesta", { ONIA_AVISO: "interrumpe", ONIA_AVISO_HM: hm });
    assert.equal(b.enviados().length, 1, `a las ${hm} tenía que sonar`);
  }
});

test("el resumen y el cierre (AHORA=1) salen aunque caigan en el borde del silencio", () => {
  const b = banco();
  b.avisar("🌙 Cierre del día", { ONIA_AVISO: "interrumpe", ONIA_AVISO_AHORA: "1", ONIA_AVISO_HM: "2200" });
  assert.equal(b.enviados().length, 1);
});

// ── No repetir ──────────────────────────────────────────────────────────────────

test("el mismo aviso no se repite antes de 6 h", () => {
  const b = banco();
  b.avisar("🙋 Espera tu ok: publicar el bot", { ONIA_AVISO: "interrumpe" });
  b.avisar("🙋 Espera tu ok: publicar el bot", { ONIA_AVISO: "interrumpe" });
  assert.equal(b.enviados().length, 1);
  assert.match(b.log(), /REPETIDO-CALLADO/);
});

test("gemelo: pasado el enfriamiento, el mismo aviso vuelve a sonar", () => {
  const b = banco();
  b.avisar("🙋 Espera tu ok: publicar el bot", { ONIA_AVISO: "interrumpe", ONIA_AVISO_CLAVE: "ok-bot" });
  b.envejecer("enviados", "ok-bot", 361);
  b.avisar("🙋 Espera tu ok: publicar el bot", { ONIA_AVISO: "interrumpe", ONIA_AVISO_CLAVE: "ok-bot" });
  assert.equal(b.enviados().length, 2);
});

test("un envío que Telegram rechazó NO cuenta como avisado: el reintento sale", () => {
  const b = banco({ respuesta: '{"ok":false,"description":"Bad Request"}' });
  assert.throws(() => b.avisar("🙋 Espera tu ok", { ONIA_AVISO: "interrumpe", ONIA_AVISO_CLAVE: "x" }));
  assert.equal(existsSync(join(b.estado, "enviados", "x")), false);
});

// ── Esperar antes de avisar una caída, y callarse si se arregló sola ────────────

test("una caída con ESPERA=30 no suena en la primera vuelta", () => {
  const b = banco();
  b.avisar("🚨 Login de Onia caído", { ONIA_AVISO: "interrumpe", ONIA_AVISO_CLAVE: "login", ONIA_AVISO_ESPERA: "30" });
  assert.equal(b.enviados().length, 0);
  assert.match(b.log(), /ESPERANDO/);
});

test("gemelo: si la caída sigue a los 31 minutos, suena", () => {
  const b = banco();
  b.envejecer("pendientes", "login", 31);
  b.avisar("🚨 Login de Onia caído", { ONIA_AVISO: "interrumpe", ONIA_AVISO_CLAVE: "login", ONIA_AVISO_ESPERA: "30" });
  assert.equal(b.enviados().length, 1);
});

test("si se arregló sola antes de avisar, el 'volvió' tampoco suena", () => {
  const b = banco();
  b.avisar("🚨 Login de Onia caído", { ONIA_AVISO: "interrumpe", ONIA_AVISO_CLAVE: "login", ONIA_AVISO_ESPERA: "30" });
  b.avisar("🟢 Login volvió", { ONIA_AVISO: "interrumpe", ONIA_AVISO_CLAVE: "login", ONIA_AVISO_RECUPERADO: "1" });
  assert.equal(b.enviados().length, 0);
  assert.equal(existsSync(join(b.estado, "pendientes", "login")), false, "la espera se limpia");
});

test("gemelo: si la caída se avisó, el 'volvió' SÍ suena y limpia las marcas", () => {
  const b = banco();
  b.envejecer("pendientes", "login", 31);
  b.avisar("🚨 Login de Onia caído", { ONIA_AVISO: "interrumpe", ONIA_AVISO_CLAVE: "login", ONIA_AVISO_ESPERA: "30" });
  b.avisar("🟢 Login volvió", { ONIA_AVISO: "interrumpe", ONIA_AVISO_CLAVE: "login", ONIA_AVISO_RECUPERADO: "1" });
  assert.deepEqual(b.enviados(), ["🚨 Login de Onia caído", "🟢 Login volvió"]);
  assert.equal(existsSync(join(b.estado, "enviados", "login")), false);
});

test("una caída avisada con la política APAGADA tampoco se repite en cada vuelta", () => {
  const b = banco({ activa: false });
  b.envejecer("pendientes", "login", 31);
  const env = { ONIA_AVISO: "interrumpe", ONIA_AVISO_CLAVE: "login", ONIA_AVISO_ESPERA: "30" };
  b.avisar("🚨 Login de Onia caído", env);
  b.avisar("🚨 Login de Onia caído", env);
  b.avisar("🚨 Login de Onia caído", env);
  assert.equal(b.enviados().length, 1);
});

// ── resumen y sistema ───────────────────────────────────────────────────────────

test("`resumen` con la política encendida se encola y nunca suena", () => {
  const b = banco();
  b.avisar("📬 Se publicó el carrusel K1", { ONIA_AVISO: "resumen", ONIA_AVISO_EMISOR: "publicador" });
  assert.equal(b.enviados().length, 0);
  assert.equal(b.cola().length, 1);
  assert.match(b.cola()[0], /\tpublicador\tresumen\t/);
});

test("`sistema` (el default) sigue siendo tarea del tablero y nunca suena", () => {
  const b = banco();
  b.avisar("🔴 CI en ROJO en main");
  assert.equal(b.enviados().length, 0);
  assert.equal(b.tareasCreadas().length, 1);
});

test("una categoría mal escrita cae en `sistema`, no en el teléfono", () => {
  const b = banco();
  b.avisar("🔴 algo", { ONIA_AVISO: "urgentisimo" });
  assert.equal(b.enviados().length, 0);
  assert.match(b.log(), /CATEGORIA-DESCONOCIDA/);
});

test("la línea OK del log dice QUÉ se mandó, no solo el message_id", () => {
  const b = banco();
  b.avisar("🙋 Espera tu ok: publicar el bot", { ONIA_AVISO: "interrumpe", ONIA_AVISO_EMISOR: "aprobaciones" });
  assert.match(b.log(), / OK message_id=42 .*emisor=aprobaciones titulo=🙋 Espera tu ok: publicar el bot/);
});
