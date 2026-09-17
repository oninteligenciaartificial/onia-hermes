// ---------------------------------------------------------------------------
// webhook-watchdog.test.mjs
//
// QUE FIJA. Dos cosas del watchdog del bot, las dos medidas en produccion:
//
//   1. UN PARPADEO NO ES UNA CAIDA. El camino bot->Chatwoot se declara roto
//      recien cuando falla en DOS corridas seguidas. Una sola sonda de 5 s que
//      se pasa de tiempo no puede disparar la alarma 🚨 maxima.
//   2. EL LOG CUENTA EL DESENLACE. Toda rama que levanta un incidente escribe
//      en el log, no solo en Telegram. El log es append-only y lo lee el que
//      diagnostica: si solo registra fallas, su ULTIMA LINEA miente para
//      siempre.
//
// POR QUE EXISTE, con la medicion. El 2026-09-17, leyendo
// /var/log/onia-bot-watchdog.log del VPS, la ultima linea era:
//
//   [2026-09-17T02:00:02+00:00] ERROR: el bot NO llega a Chatwoot
//   (respuestas mudas aunque /health este ok)
//
// y de ahi se concluye —yo lo hice en esta misma vuelta— que el bot lleva 19 h
// mudo. Es FALSO: no existia /var/lib/onia-bot-watchdog.incidente-chatwoot y el
// camino contestaba 3 de 3 sondas. O sea que el incidente se habia resuelto en
// la corrida siguiente (2 min despues) y el log no lo podia decir, porque la
// rama de recuperacion llamaba a `tg_error` y NUNCA a `log`.
//
// Las tres apariciones del ERROR en 15 dias (03-sep, 05-sep, 17-sep) son de UNA
// linea cada una: con el cron cada 2 minutos, una caida real escribiria una
// linea cada 2 minutos. Eran parpadeos, y cada uno gasto DOS mensajes en el
// Telegram de Sergio Urcullo (el 🚨 y su ✅) — el canal que el mismo pidio
// ordenar porque se le llenaba de avisos que no eran nada.
//
// LA CLASE, y por eso el gate no mira UNA rama. El watchdog tiene TRES ramas de
// recuperacion (webhook que vuelve solo, camino a Chatwoot que vuelve, webhook
// levantado por el watchdog) y las tres avisaban por Telegram sin escribir el
// log. Es la asimetria "aviso del problema ↔ aviso del DESENLACE" que ya nos
// costo antes. El gate estructural DERIVA sus sujetos del disco —cada
// `tg_error "✅…"` del script— asi que la rama de recuperacion que se escriba
// manana nace adentro del universo.
//
// COMO SE PRUEBA. Ejecutando el script de verdad, en una carpeta sellada por
// corrida, con `docker`, `iptables` y `curl` reemplazados por stubs en el PATH.
// Un gate que solo grepeara el .sh no veria cuantas corridas hacen falta para
// que suene la alarma, que es justo lo que se esta fijando.
// ---------------------------------------------------------------------------

import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { chmodSync, existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const AQUI = dirname(fileURLToPath(import.meta.url));
const WATCHDOG = join(AQUI, "webhook-watchdog.sh");

/** Comentarios en BLANCO, conservando los saltos: un `#` no absuelve ni acusa. */
function sinComentarios(texto) {
  return texto
    .split("\n")
    .map((linea) => (/^\s*#/.test(linea) ? "" : linea))
    .join("\n");
}

/**
 * Banco sellado por corrida: stubs en el PATH y marcadores en su propia carpeta.
 * `ctrl/` es el unico canal por el que el test le dice a los stubs que contestar.
 */
function bancoDePruebas() {
  const raiz = mkdtempSync(join(tmpdir(), "watchdog-"));
  const bin = join(raiz, "bin");
  const ctrl = join(raiz, "ctrl");
  mkdirSync(bin);
  mkdirSync(ctrl);

  const stub = (nombre, cuerpo) => {
    const ruta = join(bin, nombre);
    writeFileSync(ruta, `#!/bin/sh\n${cuerpo}\n`);
    chmodSync(ruta, 0o755);
  };

  // `docker ps` lista el contenedor; `docker exec … sh -c "<cmd>"` contesta segun
  // a QUIEN apunta el comando. Sin imprimir nada: el script tira stdout igual.
  stub(
    "docker",
    [
      'if [ "$1" = "ps" ]; then echo onia-center; exit 0; fi',
      'cmd="$*"',
      'case "$cmd" in',
      '  *health*) [ -f "$CTRL/health-falla" ] && exit 1; exit 0;;',
      '  *chatwoot*) [ -f "$CTRL/chatwoot-falla" ] && exit 1; exit 0;;',
      "esac",
      "exit 0",
    ].join("\n"),
  );
  // La regla de firewall ya esta: el watchdog no tiene que insertar nada.
  stub("iptables", "exit 0");
  // Cada aviso de Telegram queda anotado, uno por linea.
  stub("curl", 'printf "%s\\n" "$*" >> "$CTRL/curl.log"\nexit 0');

  writeFileSync(join(raiz, "alert.env"), "TG_BOT_TOKEN=tok-de-prueba\nTG_CHAT_ID=42\n");

  // El `restart` del watchdog: existe y no hace nada. Sin el, el script sale 1
  // por "falta webhook-server.sh" y el test mediria eso en vez de la conducta.
  const botDir = join(raiz, "bot");
  mkdirSync(botDir);
  writeFileSync(join(botDir, "webhook-server.sh"), "#!/bin/sh\nexit 0\n");
  chmodSync(join(botDir, "webhook-server.sh"), 0o755);

  return {
    raiz,
    ctrl,
    /** Una corrida del watchdog. `chatwoot` false = la sonda falla esta vez. */
    correr({ chatwoot = true, health = true } = {}) {
      for (const [nombre, ok] of [
        ["chatwoot-falla", chatwoot],
        ["health-falla", health],
      ]) {
        const marca = join(ctrl, nombre);
        if (ok) rmSync(marca, { force: true });
        else writeFileSync(marca, "");
      }
      return execFileSync("bash", [WATCHDOG], {
        encoding: "utf8",
        env: {
          ...process.env,
          PATH: `${bin}:${process.env.PATH}`,
          CTRL: ctrl,
          ONIA_WATCHDOG_ESTADO: join(raiz, "estado"),
          ONIA_WATCHDOG_ALERT_ENV: join(raiz, "alert.env"),
          ONIA_BOT_DIR: botDir,
        },
      });
    },
    /** Los avisos mandados hasta ahora, en orden. */
    avisos() {
      const log = join(ctrl, "curl.log");
      return existsSync(log) ? readFileSync(log, "utf8").trim().split("\n").filter(Boolean) : [];
    },
    marcador(sufijo) {
      return existsSync(join(raiz, `estado.${sufijo}`));
    },
    limpiar() {
      rmSync(raiz, { recursive: true, force: true });
    },
  };
}

test("el camino sano no escribe ni avisa: el watchdog es idempotente", () => {
  const banco = bancoDePruebas();
  try {
    const salida = banco.correr();
    assert.equal(salida.trim(), "", `no deberia escribir nada con todo sano, escribio: ${salida}`);
    assert.deepEqual(banco.avisos(), []);
  } finally {
    banco.limpiar();
  }
});

test("UN parpadeo del camino a Chatwoot NO dispara la alarma 🚨", () => {
  const banco = bancoDePruebas();
  try {
    banco.correr({ chatwoot: false });

    assert.deepEqual(
      banco.avisos(),
      [],
      "una sola sonda de 5 s que se pasa de tiempo no puede sonar la alarma maxima",
    );
    assert.equal(
      banco.marcador("incidente-chatwoot"),
      false,
      "el incidente no esta declarado todavia: falta la confirmacion de la corrida siguiente",
    );
  } finally {
    banco.limpiar();
  }
});

test("un parpadeo seguido de exito se olvida: no deja el strike pegado", () => {
  const banco = bancoDePruebas();
  try {
    banco.correr({ chatwoot: false });
    banco.correr({ chatwoot: true });
    // La tercera falla tiene que volver a ser "la primera": si el strike quedara
    // pegado, el proximo parpadeo -dias despues- sonaria como incidente.
    banco.correr({ chatwoot: false });

    assert.deepEqual(banco.avisos(), [], "el strike de un parpadeo viejo no puede acumularse");
  } finally {
    banco.limpiar();
  }
});

test("DOS corridas seguidas fallando SI declaran el incidente, y avisan UNA vez", () => {
  const banco = bancoDePruebas();
  try {
    banco.correr({ chatwoot: false });
    const segunda = banco.correr({ chatwoot: false });
    banco.correr({ chatwoot: false });
    banco.correr({ chatwoot: false });

    const avisos = banco.avisos();
    assert.equal(avisos.length, 1, `un incidente = UN aviso, salieron ${avisos.length}`);
    assert.match(avisos[0], /MUDO/);
    assert.equal(banco.marcador("incidente-chatwoot"), true);
    assert.match(
      segunda,
      /ERROR: el bot NO llega a Chatwoot/,
      "la corrida que declara el incidente tiene que gritarlo en el log",
    );
  } finally {
    banco.limpiar();
  }
});

test("la recuperacion del camino a Chatwoot se ESCRIBE en el log, no solo en Telegram", () => {
  const banco = bancoDePruebas();
  try {
    banco.correr({ chatwoot: false });
    banco.correr({ chatwoot: false });
    const vuelta = banco.correr({ chatwoot: true });

    assert.equal(banco.marcador("incidente-chatwoot"), false, "el incidente se cierra");
    assert.notEqual(
      vuelta.trim(),
      "",
      "la ultima linea del log decia ERROR y el bot estaba sano: el desenlace TIENE que quedar escrito",
    );
    assert.match(vuelta, /Chatwoot/);
    assert.equal(banco.avisos().length, 2, "sale el 🚨 y despues su ✅");
  } finally {
    banco.limpiar();
  }
});

test("la recuperacion del webhook tambien se escribe (la misma clase, otra rama)", () => {
  const banco = bancoDePruebas();
  try {
    // Cae y el watchdog no lo puede levantar: queda el incidente declarado.
    banco.correr({ health: false });
    assert.equal(banco.marcador("incidente"), true);

    // Vuelve solo, sin que el watchdog lo reinicie.
    const vuelta = banco.correr({ health: true });
    assert.equal(banco.marcador("incidente"), false);
    assert.notEqual(vuelta.trim(), "", "un incidente que se cierra solo tambien deja linea");
  } finally {
    banco.limpiar();
  }
});

test("CLASE: toda rama de recuperacion escribe el log — sujetos derivados del script", () => {
  const lineas = sinComentarios(readFileSync(WATCHDOG, "utf8")).split("\n");

  const recuperaciones = lineas
    .map((linea, i) => ({ linea, i }))
    .filter(({ linea }) => /tg_error\s+"✅/.test(linea));

  assert.ok(
    recuperaciones.length >= 3,
    `el watchdog tiene tres ramas de recuperacion; el gate encontro ${recuperaciones.length}`,
  );

  for (const { i } of recuperaciones) {
    const ventana = lineas.slice(Math.max(0, i - 4), i + 2);
    assert.ok(
      ventana.some((l) => /^\s*log\s+"/.test(l)),
      `la rama de recuperacion de la linea ${i + 1} avisa por Telegram y no escribe el log:\n` +
        ventana.join("\n"),
    );
  }
});
