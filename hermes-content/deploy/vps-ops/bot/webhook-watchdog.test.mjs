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
      'if [ "$1" = "ps" ]; then [ -f "$CTRL/sin-contenedor" ] || echo onia-center; exit 0; fi',
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
    /**
     * Una corrida del watchdog. `chatwoot` false = la sonda falla esta vez;
     * `contenedor` false = `docker ps` no lo lista (el bot esta 100% mudo);
     * `servidor` "sin-permiso"/"ausente" = el watchdog no puede reiniciar nada.
     *
     * La salida se devuelve TAMBIEN cuando el script sale != 0: una rama que
     * termina con `exit 1` es justo la que hay que poder medir, y execFileSync
     * tira en ese caso (se perderia el log de la corrida que mas importa).
     */
    correr({ chatwoot = true, health = true, contenedor = true, servidor = "ok" } = {}) {
      for (const [nombre, ok] of [
        ["chatwoot-falla", chatwoot],
        ["health-falla", health],
        ["sin-contenedor", contenedor],
      ]) {
        const marca = join(ctrl, nombre);
        if (ok) rmSync(marca, { force: true });
        else writeFileSync(marca, "");
      }

      const servidorSh = join(botDir, "webhook-server.sh");
      rmSync(servidorSh, { force: true });
      if (servidor !== "ausente") {
        writeFileSync(servidorSh, "#!/bin/sh\nexit 0\n");
        // 644 es EXACTAMENTE lo que el deploy del 2026-09-18 dejo en los hermanos.
        chmodSync(servidorSh, servidor === "sin-permiso" ? 0o644 : 0o755);
      }

      const opciones = {
        encoding: "utf8",
        env: {
          ...process.env,
          PATH: `${bin}:${process.env.PATH}`,
          CTRL: ctrl,
          ONIA_WATCHDOG_ESTADO: join(raiz, "estado"),
          ONIA_WATCHDOG_ALERT_ENV: join(raiz, "alert.env"),
          ONIA_BOT_DIR: botDir,
        },
      };
      try {
        return execFileSync("bash", [WATCHDOG], opciones);
      } catch (e) {
        return e.stdout ?? "";
      }
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

// --- El watchdog calla justo donde el bot esta MAS muerto --------------------
//
// Medido el 2026-09-18 leyendo /var/log/onia-bot-watchdog.log: 76 corridas
// seguidas de "Permission denied" (2,5 h con el watchdog muerto) y NADIE se
// entero — lo encontro un carril mirando el log por casualidad. Eso destapo que
// las dos ramas donde el watchdog se rinde no avisan por Telegram:
//
//   a) el contenedor onia-center no esta corriendo -> el bot esta 100% mudo
//      (widget Y WhatsApp) y el script escribia "el watchdog no puede hacer
//      nada" y salia 0, que para el cron es exito.
//   b) webhook-server.sh no es ejecutable -> el webhook YA no responde (solo se
//      llega aca con /health caido) y el watchdog no lo puede levantar. Es
//      exactamente lo que el deploy de las 03:47 UTC provoco en sus tres
//      hermanos, dejandolos en 644.
//
// La asimetria: con el contenedor VIVO y el webhook caido sonaba la alarma 🚨,
// y con el contenedor MUERTO -dano estrictamente mayor- habia silencio.

test("el contenedor caido NO suena a la primera: un reinicio de docker no es una caida", () => {
  const banco = bancoDePruebas();
  try {
    banco.correr({ contenedor: false });

    assert.deepEqual(
      banco.avisos(),
      [],
      "durante un reinicio de docker el contenedor desaparece unos segundos: eso no es un incidente",
    );
    assert.equal(banco.marcador("incidente-contenedor"), false);
  } finally {
    banco.limpiar();
  }
});

test("el contenedor caido DOS corridas SI avisa: el bot esta mudo en widget Y WhatsApp", () => {
  const banco = bancoDePruebas();
  try {
    banco.correr({ contenedor: false });
    const segunda = banco.correr({ contenedor: false });
    banco.correr({ contenedor: false });

    const avisos = banco.avisos();
    assert.equal(avisos.length, 1, `un incidente = UN aviso, salieron ${avisos.length}`);
    assert.match(avisos[0], /🚨/);
    assert.equal(banco.marcador("incidente-contenedor"), true);
    assert.match(
      segunda,
      /ERROR:/,
      "la corrida que declara el incidente tiene que gritarlo en el log, no llamarlo AVISO",
    );
  } finally {
    banco.limpiar();
  }
});

test("el contenedor que vuelve cierra su incidente, lo escribe y avisa el desenlace", () => {
  const banco = bancoDePruebas();
  try {
    banco.correr({ contenedor: false });
    banco.correr({ contenedor: false });
    const vuelta = banco.correr({ contenedor: true });

    assert.equal(banco.marcador("incidente-contenedor"), false, "el incidente se cierra");
    assert.notEqual(vuelta.trim(), "", "un incidente que se cierra deja linea: el log es lo que se lee");
    assert.equal(banco.avisos().length, 2, "sale el 🚨 y despues su ✅");
  } finally {
    banco.limpiar();
  }
});

test("el incidente del contenedor NO lo cierra la recuperacion del webhook (marcadores propios)", () => {
  const banco = bancoDePruebas();
  try {
    // Webhook caido y sin poder levantarlo: queda declarado `incidente`.
    banco.correr({ health: false, servidor: "ausente" });
    assert.equal(banco.marcador("incidente"), true);

    // Ahora ademas se cae el contenedor, dos corridas: su propio incidente.
    banco.correr({ contenedor: false });
    banco.correr({ contenedor: false });
    assert.equal(banco.marcador("incidente-contenedor"), true);

    // Vuelve el contenedor y el webhook contesta: cada incidente se cierra solo.
    banco.correr({ contenedor: true, health: true });
    assert.equal(banco.marcador("incidente-contenedor"), false);
    assert.equal(banco.marcador("incidente"), false, "un incidente no puede cerrar al del vecino");
  } finally {
    banco.limpiar();
  }
});

test("si el watchdog no puede levantar el bot porque su script perdio el bit, AVISA", () => {
  const banco = bancoDePruebas();
  try {
    const salida = banco.correr({ health: false, servidor: "sin-permiso" });

    const avisos = banco.avisos();
    assert.equal(
      avisos.length,
      1,
      "el webhook esta caido y el watchdog no lo puede levantar: eso tiene que llegarle a alguien",
    );
    assert.match(avisos[0], /🚨/);
    assert.match(salida, /ERROR:/);
    assert.equal(banco.marcador("incidente"), true, "queda declarado: no re-avisa cada 2 min");
  } finally {
    banco.limpiar();
  }
});

test("el script que falta se trata igual que el que no se puede ejecutar", () => {
  const banco = bancoDePruebas();
  try {
    banco.correr({ health: false, servidor: "ausente" });

    assert.equal(banco.avisos().length, 1, "falta el script: el bot sigue caido y nadie lo va a levantar");
    assert.match(banco.avisos()[0], /🚨/);
  } finally {
    banco.limpiar();
  }
});

// La direccion SIMETRICA del gate de recuperacion de mas abajo: aquel exige que
// todo ✅ de Telegram escriba el log; este exige que todo ERROR del log llegue a
// Telegram. La distincion la hace el propio script y tiene significado: ERROR =
// el bot esta roto y Sergio Urcullo se entera; AVISO = observacion que no
// escala (el parpadeo de una sonda, el firewall re-insertado). Por eso el sujeto
// no lleva ni una exencion a mano: la rama que se escriba manana nace adentro.
test("CLASE: todo ERROR del log llega a Telegram — sujetos derivados del script", () => {
  const lineas = sinComentarios(readFileSync(WATCHDOG, "utf8")).split("\n");

  const errores = lineas
    .map((linea, i) => ({ linea, i }))
    .filter(({ linea }) => /^\s*log\s+"ERROR:/.test(linea));

  assert.ok(
    errores.length >= 4,
    `el watchdog declara al menos cuatro fallas duras; el gate encontro ${errores.length}`,
  );

  for (const { i, linea } of errores) {
    const ventana = lineas.slice(Math.max(0, i - 2), i + 8);
    assert.ok(
      // `avisar_caida` cuenta porque TERMINA en tg_error: es tg_error mas la escalada (re-avisa
      // a los 15 min, 1 h, 6 h y despues por dia). Se agrego el 2026-09-21 y sin nombrarla aca
      // el gate se volvia ciego justo al refactor que lo hace mas fuerte — o sea, rojo por el
      // motivo contrario al que existe.
      ventana.some((l) => /(tg_error|avisar_caida)\s/.test(l)),
      `el script grita un ERROR que no le llega a nadie (linea ${i + 1}):\n${linea}\n` +
        `Un fallo que solo va al log es un fallo mudo: /var/log/onia-bot-watchdog.log no lo lee nadie.`,
    );
  }
});

test("CLASE: toda rama de recuperacion escribe el log — sujetos derivados del script", () => {
  const lineas = sinComentarios(readFileSync(WATCHDOG, "utf8")).split("\n");

  const recuperaciones = lineas
    .map((linea, i) => ({ linea, i }))
    // Las tres ramas pasan por `avisar_recuperacion "$MARCADOR" "✅ ..."`, que borra el marcador
    // y avisa diciendo cuanto duro. La forma con `tg_error "✅` sigue contemplada para que el
    // gate no dependa de que nadie vuelva a llamarlo directo.
    .filter(({ linea }) => /(tg_error|avisar_recuperacion\s+\S+)\s+"✅/.test(linea));

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
