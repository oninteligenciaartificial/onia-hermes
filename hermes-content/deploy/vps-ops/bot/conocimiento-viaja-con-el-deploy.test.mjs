// ONIA — el conocimiento del bot tiene que VIAJAR con el deploy, y tiene que QUEDARSE.
//
// EL DEFECTO, medido el 2026-09-12 02:55 La Paz contra el VPS, en dos mitades que se tapan
// entre si. La primera ya se conocia; la segunda hacia que el remedio de la primera durara
// hasta el deploy siguiente.
//
// (A) `deploy-bot.sh` COPIA `knowledge.onia.json` al host pero nunca lo APLICA. El archivo que
//     el bot lee es `knowledge.json`, y pasar de uno al otro era un segundo comando a mano
//     (`webhook-server.sh knowledge`) que nadie corria. Medido en /opt/onia/bot:
//
//       knowledge.onia.json  6-sep 07:35   "desde el 1 de octubre de 2026 ... RND 102600000007"
//       knowledge.json       4-sep 01:36   "desde el 30 de septiembre es obligatoria"
//
//     O sea SEIS DIAS cotizandole a desconocidos un plazo fiscal que CLAUDE.md prohibe por
//     nombre ("NUNCA 30 de septiembre"), con el texto corregido en el mismo directorio. El
//     `vigenteHasta` de esa misma entrada decia 2026-09-30: el dato ademas caducaba solo.
//
// (B) `webhook-server.sh knowledge` aplicaba el conocimiento SOLO ADENTRO DEL CONTENEDOR
//     (`docker cp` a /tmp/onia-bot) y dejaba intacto el `knowledge.json` del host. Eso lo
//     vuelve REVERSIBLE EN SILENCIO: el sync de `restart` calcula un stamp sobre
//     `$BOT_DIR/*.mjs` y `$BOT_DIR/*.json` del HOST y, si cambio, hace `rm -rf $DEST` y
//     vuelve a copiar el host entero. Cualquier deploy posterior toca un .mjs -> el stamp
//     cambia -> el contenedor se rearma desde el host -> vuelve el knowledge VIEJO. El
//     operador que corrio el comando a mano lo vio aplicarse y nada le avisa cuando se
//     deshace.
//
// POR QUE SE PRUEBA EJECUTANDO Y NO LEYENDO EL TEXTO DEL SCRIPT. Lo que falla acá es un
// EFECTO (que archivo queda escrito y donde), no una redaccion. Un assert sobre el texto de
// `webhook-server.sh` no distingue "copia al host" de "menciona el host en un comentario", y
// esta familia de bug ya nos costo un gate que aprobaba leyendose a si mismo. Se monta un
// mundo falso -host, contenedor y un `docker` de mentira en el PATH- y se corre el script de
// verdad.
//
// Correr:  node --test "hermes-content/deploy/vps-ops/bot/conocimiento-viaja-con-el-deploy.test.mjs"

import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, chmodSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER_SH = path.join(HERE, "webhook-server.sh");
const DEPLOY = readFileSync(path.join(HERE, "deploy-bot.sh"), "utf8");

/** El path que `webhook-server.sh` usa DENTRO del contenedor. Si cambia, el docker falso deja de traducir. */
const DEST_EN_CONTENEDOR = "/tmp/onia-bot";

const VIEJO = JSON.stringify({ marca: "VIEJO", hechos: [{ body: "desde el 30 de septiembre" }] }, null, 2);
const NUEVO = JSON.stringify({ marca: "NUEVO", hechos: [{ body: "desde el 1 de octubre de 2026" }] }, null, 2);

/**
 * Monta host + contenedor + un `docker` falso, y devuelve como correr `webhook-server.sh`.
 *
 * El `docker` falso traduce `/tmp/onia-bot/...` a la carpeta del contenedor falso, asi que el
 * test NUNCA toca el /tmp/onia-bot real de ninguna maquina.
 */
function mundoFalso({ validador = "acepta" } = {}) {
  const raiz = mkdtempSync(path.join(tmpdir(), "onia-conocimiento-"));
  const host = path.join(raiz, "host");
  const contenedor = path.join(raiz, "contenedor");
  const bin = path.join(raiz, "bin");
  for (const d of [host, contenedor, bin]) mkdirSync(d, { recursive: true });

  // El host: el script real, su centinela de BOT_DIR, y los dos conocimientos.
  writeFileSync(path.join(host, "webhook-server.sh"), readFileSync(SERVER_SH));
  chmodSync(path.join(host, "webhook-server.sh"), 0o755);
  writeFileSync(path.join(host, "webhook-server.mjs"), "// centinela: hace que BOT_DIR sea este\n");
  writeFileSync(path.join(host, "knowledge.json"), VIEJO);
  writeFileSync(path.join(host, "knowledge.onia.json"), NUEVO);

  // El contenedor arranca con lo mismo que el host, que es lo que hace el sync real.
  writeFileSync(path.join(contenedor, "knowledge.json"), VIEJO);

  // `docker`: solo los tres verbos que el subcomando usa. Cualquier otro sale 1 a proposito —
  // un stub que aprueba lo que no entiende es la forma de fallar en verde de estos mundos falsos.
  // `trad` va con `case` y no con `\${x/#patron/valor}`: en esa sustitucion bash corta el patron
  // en la PRIMERA `/`, asi que un patron que empieza con `/tmp/...` queda VACIO y la expansion
  // PREPENDE en vez de traducir. Costo la primera corrida de este test, con un rojo que parecia
  // del producto ("no se pudo copiar el conocimiento al contenedor") y era del instrumento.
  const docker = `#!/usr/bin/env bash
set -uo pipefail
C=${JSON.stringify(contenedor)}
DEST=${JSON.stringify(DEST_EN_CONTENEDOR)}
trad() {
  case "\$1" in
    "\$DEST"/*) printf '%s' "\$C/\${1#\$DEST/}" ;;
    *) printf '%s' "\$1" ;;
  esac
}
case "\${1:-}" in
  cp)
    # docker cp <src> <contenedor>:<dest>
    src="\$2"; dst="\${3#*:}"
    cp "\$src" "\$(trad "\$dst")" || exit 1
    exit 0
    ;;
  exec)
    shift 2   # 'exec' y el nombre del contenedor
    case "\${1:-}" in
      node)
        # node <dest>/knowledge.mjs --check <archivo>  -> el validador. El archivo es el \$4:
        # apuntarle al \$3 lo hace validar la cadena "--check", que no existe, y el rechazo se
        # lee identico a un conocimiento invalido.
        archivo="\$(trad "\${4:-}")"
        [ -f "\$archivo" ] || { echo "validador: no existe \$archivo" >&2; exit 1; }
        ${validador === "acepta" ? "exit 0" : 'echo "validador: conocimiento invalido" >&2; exit 1'}
        ;;
      mv) mv "\$(trad "\$2")" "\$(trad "\$3")"; exit \$? ;;
      rm) shift; args=(); for a in "\$@"; do args+=("\$(trad "\$a")"); done; rm "\${args[@]}"; exit \$? ;;
      *) echo "docker falso: verbo exec no contemplado: \$*" >&2; exit 1 ;;
    esac
    ;;
  *) echo "docker falso: verbo no contemplado: \$*" >&2; exit 1 ;;
esac
`;
  writeFileSync(path.join(bin, "docker"), docker);
  chmodSync(path.join(bin, "docker"), 0o755);

  const correr = (args, env = {}) =>
    execFileSync("bash", [path.join(host, "webhook-server.sh"), ...args], {
      encoding: "utf8",
      env: {
        ...process.env,
        PATH: `${bin}:${process.env.PATH}`,
        ONIA_BOT_CONTAINER: "contenedor-falso",
        ...env,
      },
    });

  return {
    correr,
    host,
    contenedor,
    limpiar: () => rmSync(raiz, { recursive: true, force: true }),
    leerHost: (f) => readFileSync(path.join(host, f), "utf8"),
    leerContenedor: (f) => readFileSync(path.join(contenedor, f), "utf8"),
  };
}

test("el mundo falso es capaz de fallar: sin el arreglo, el host se queda con el conocimiento viejo", () => {
  // Guarda del propio instrumento. Si el docker falso no tradujera, o el script no llegara a
  // tocar nada, los dos asserts de abajo pasarian por vacio y este gate seria decorativo.
  const m = mundoFalso();
  try {
    assert.equal(JSON.parse(m.leerHost("knowledge.json")).marca, "VIEJO");
    assert.equal(JSON.parse(m.leerContenedor("knowledge.json")).marca, "VIEJO");
    assert.equal(JSON.parse(m.leerHost("knowledge.onia.json")).marca, "NUEVO");
  } finally {
    m.limpiar();
  }
});

test("aplicar el conocimiento lo deja tambien en el HOST: si no, el proximo deploy lo revierte mudo", () => {
  const m = mundoFalso();
  try {
    const salida = m.correr(["knowledge"], {
      ONIA_BOT_KNOWLEDGE_FILE: path.join(m.host, "knowledge.onia.json"),
    });
    assert.match(salida, /conocimiento aplicado/i, `no dijo que lo aplico: ${salida}`);

    assert.equal(
      JSON.parse(m.leerContenedor("knowledge.json")).marca,
      "NUEVO",
      "el contenedor tendria que tener el conocimiento nuevo (esa mitad ya funcionaba)",
    );

    // ESTA es la mitad que faltaba. El sync de `restart` rearma el contenedor DESDE EL HOST
    // cuando cambia el stamp: si el host quedo viejo, el conocimiento aplicado se deshace solo.
    assert.equal(
      JSON.parse(m.leerHost("knowledge.json")).marca,
      "NUEVO",
      "el conocimiento se aplico SOLO adentro del contenedor: el primer deploy que cambie el " +
        "stamp va a hacer `rm -rf $DEST` y recopiar el host, devolviendo el conocimiento viejo " +
        "sin que nadie se entere",
    );
  } finally {
    m.limpiar();
  }
});

test("si el validador RECHAZA, no se toca NADA — ni el contenedor ni el host", () => {
  const m = mundoFalso({ validador: "rechaza" });
  try {
    let fallo = null;
    try {
      m.correr(["knowledge"], { ONIA_BOT_KNOWLEDGE_FILE: path.join(m.host, "knowledge.onia.json") });
    } catch (e) {
      fallo = e;
    }
    assert.ok(fallo, "un conocimiento invalido tiene que salir distinto de cero");

    // La compuerta de publicacion existe para esto: el bot sigue con lo anterior. Persistir al
    // host tiene que quedar DESPUES de la validacion, o el arreglo de arriba abre un agujero
    // peor que el que cierra.
    assert.equal(
      JSON.parse(m.leerContenedor("knowledge.json")).marca,
      "VIEJO",
      "un conocimiento rechazado NO puede llegar al contenedor",
    );
    assert.equal(
      JSON.parse(m.leerHost("knowledge.json")).marca,
      "VIEJO",
      "un conocimiento rechazado NO puede llegar al host",
    );
  } finally {
    m.limpiar();
  }
});

test("aplicar el conocimiento que YA es el vivo no rompe (cp de un archivo sobre si mismo)", () => {
  // El caso que `ONIA_BOT_KNOWLEDGE_FILE` sin definir produce: SRC es el propio
  // $BOT_DIR/knowledge.json. `cp a a` tira "are the same file", y un deploy que se cae ahi es
  // un deploy sano reportado como fallido — la misma trampa que ya pago deploy-bot.test.mjs.
  const m = mundoFalso();
  try {
    const salida = m.correr(["knowledge"]);
    assert.match(salida, /conocimiento aplicado/i, `deberia aplicar sin romper: ${salida}`);
    assert.equal(JSON.parse(m.leerHost("knowledge.json")).marca, "VIEJO");
  } finally {
    m.limpiar();
  }
});

test("deploy-bot.sh APLICA el conocimiento, y despues de verificar que el bot revivio", () => {
  // (A): sin esto, `DESPLEGAR: bot` publica el codigo y deja el texto viejo — que es como el
  // bot paso agosto sin precios y seis dias con el plazo fiscal equivocado.
  const posSalud = DEPLOY.indexOf("-- /health");
  assert.ok(posSalud > 0, "deploy-bot.sh ya no tiene el paso de verificacion /health");

  const invocacion = /webhook-server\.sh"\s+knowledge/.exec(DEPLOY);
  assert.ok(
    invocacion,
    "deploy-bot.sh no aplica el conocimiento: `knowledge.onia.json` viaja al host pero el bot " +
      "sigue leyendo el `knowledge.json` de antes, y cerrar esa brecha queda como un segundo " +
      "comando a mano que nadie corre",
  );
  assert.ok(
    invocacion.index > posSalud,
    "el conocimiento se aplica ANTES de comprobar que el bot revivio: si el deploy dejo el " +
      "proceso caido, el docker cp falla y el error que se lee es el del conocimiento, no el real",
  );

  // Y tiene que nombrar la FUENTE versionada: sin `ONIA_BOT_KNOWLEDGE_FILE`, el subcomando
  // reaplica el knowledge.json que ya estaba y el deploy no cambia una coma.
  const tramo = DEPLOY.slice(posSalud);
  assert.match(
    tramo,
    /ONIA_BOT_KNOWLEDGE_FILE=[^\n]*knowledge\.onia\.json/,
    "deploy-bot.sh tiene que aplicar `knowledge.onia.json` (la fuente que esta en git), no el " +
      "`knowledge.json` que ya estaba instalado",
  );
});
