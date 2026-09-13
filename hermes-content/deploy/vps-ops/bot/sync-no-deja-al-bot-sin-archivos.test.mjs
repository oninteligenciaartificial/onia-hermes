// ONIA — sincronizar el codigo al contenedor NO puede dejar al bot vivo sin sus archivos.
//
// EL DEFECTO, medido el 2026-09-12 en produccion. El bot corre DESDE el destino
// (`node /tmp/onia-bot/webhook-server.mjs`) y `webhook-server.sh` sincronizaba asi:
//
//     docker exec $CONTAINER rm -rf /tmp/onia-bot      # <- el destino VIVO, borrado
//     docker cp   $BOT_DIR   $CONTAINER:/tmp/onia-bot  # <- y recien despues, la copia
//
// Ese sync corre tambien en `start`, o sea CON EL PROCESO VIVO. Durante todo el `cp` el bot no
// tiene `knowledge.json`, y un archivo ausente NO es un error que el cargador grite (es el estado
// normal de una instalacion sin conocimiento): el motor cae a los textos de codigo y contesta el
// `M4_BODY`, que NO cotiza. Sintoma real: a las 22:48:35 UTC la conv 49 pregunto "cuanto cuesta
// el sistema" y el bot contesto "el numero exacto te lo pasa Sergio en la demo, no te quiero
// tirar una cifra" — con la escalera de precios entera en el archivo, y el MISMO proceso (sin
// reiniciar) sirviendola bien media hora despues.
//
// Y el peor modo de falla no era la ventana sino el fallo: si el `cp` fallaba, el destino ya
// estaba borrado, asi que el script salia en ERROR y ademas dejaba al proceso vivo sin archivos.
// El remedio ("volve a correrlo") depende de que alguien este mirando.
//
// POR QUE SE PRUEBA EJECUTANDO Y NO LEYENDO EL TEXTO DEL SCRIPT. Lo que falla es un EFECTO —que
// hay en el destino en cada momento—, no una redaccion. Un assert sobre el texto no distingue
// "copia al lado y publica con mv" de "lo dice en un comentario". Se monta un mundo falso (host,
// contenedor y un `docker` de mentira en el PATH) y se corre el script de verdad, igual que
// `conocimiento-viaja-con-el-deploy.test.mjs`.
//
// Correr:  node --test "hermes-content/deploy/vps-ops/bot/sync-no-deja-al-bot-sin-archivos.test.mjs"

import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER_SH = path.join(HERE, "webhook-server.sh");

/** El path que `webhook-server.sh` usa DENTRO del contenedor. Si cambia, el docker falso deja de traducir. */
const DEST_EN_CONTENEDOR = "/tmp/onia-bot";

const VIVO = JSON.stringify({ marca: "LO-QUE-EL-BOT-ESTA-SIRVIENDO" });
const NUEVO = JSON.stringify({ marca: "LA-VERSION-QUE-SE-DESPLIEGA" });

/**
 * Monta host + contenedor + un `docker` falso y devuelve como correr `webhook-server.sh start`.
 *
 * El falso TRADUCE `/tmp/onia-bot*` a la carpeta del contenedor falso (asi el test nunca toca el
 * /tmp real de nadie) y, en cada `cp`, deja un TESTIGO de si el destino vivo seguia completo en
 * ese instante — que es exactamente lo que este test mide.
 *
 * `cpFalla: true` simula el `docker cp` que no pudo copiar (disco lleno, contenedor que se
 * reinicia): el modo en que el sync viejo dejaba al bot sin nada.
 */
function mundoFalso({ cpFalla = false } = {}) {
  const raiz = mkdtempSync(path.join(tmpdir(), "onia-sync-"));
  const host = path.join(raiz, "host");
  const contenedor = path.join(raiz, "contenedor");
  const bin = path.join(raiz, "bin");
  const testigo = path.join(raiz, "testigo-durante-el-cp.txt");
  for (const d of [host, contenedor, bin]) mkdirSync(d, { recursive: true });

  // El host: el script real + el centinela que fija BOT_DIR + el conocimiento que se despliega.
  writeFileSync(path.join(host, "webhook-server.sh"), readFileSync(SERVER_SH));
  chmodSync(path.join(host, "webhook-server.sh"), 0o755);
  writeFileSync(path.join(host, "webhook-server.mjs"), "// centinela: hace que BOT_DIR sea este\n");
  writeFileSync(path.join(host, "knowledge.json"), NUEVO);

  // El contenedor ya tiene una version vieja SIRVIENDO, con su stamp: es el bot que hoy atiende.
  writeFileSync(path.join(contenedor, "knowledge.json"), VIVO);
  writeFileSync(path.join(contenedor, "webhook-server.mjs"), "// version vieja, en ejecucion\n");
  writeFileSync(path.join(contenedor, ".stamp"), "stampviejo000");

  // `docker` falso. Un stub que aprueba lo que no entiende es como estos mundos fallan EN VERDE:
  // cada verbo que no esta contemplado sale 1 y se ve en el rojo.
  const docker = `#!/usr/bin/env bash
set -uo pipefail
C=${JSON.stringify(contenedor)}
DEST=${JSON.stringify(DEST_EN_CONTENEDOR)}
TESTIGO=${JSON.stringify(testigo)}
trad() {
  case "\$1" in
    "\$DEST"*) printf '%s' "\$C\${1#"\$DEST"}" ;;
    *) printf '%s' "\$1" ;;
  esac
}
case "\${1:-}" in
  ps) echo "contenedor-falso"; exit 0 ;;
  cp)
    # Lo que mide este test: en el instante del cp, ¿el destino VIVO sigue completo?
    if [ -f "\$C/knowledge.json" ]; then echo "vivo-completo" >> "\$TESTIGO"; else echo "vivo-BORRADO" >> "\$TESTIGO"; fi
    ${cpFalla ? 'exit 1' : 'src="$2"; dst="${3#*:}"; cp -R "$src" "$(trad "$dst")" || exit 1; exit 0'}
    ;;
  exec)
    shift
    while [ \$# -gt 0 ]; do
      case "\${1:-}" in
        -d) shift ;;
        -e) shift 2 ;;
        *) break ;;
      esac
    done
    shift   # el nombre del contenedor
    case "\${1:-}" in
      cat) archivo="\$(trad "\${2:-}")"; [ -f "\$archivo" ] || exit 1; cat "\$archivo"; exit 0 ;;
      mv) origen="\$(trad "\${2:-}")"; [ -e "\$origen" ] || exit 1; mv "\$origen" "\$(trad "\${3:-}")"; exit \$? ;;
      rm) shift; args=(); for a in "\$@"; do case "\$a" in -*) args+=("\$a") ;; *) args+=("\$(trad "\$a")") ;; esac; done; rm "\${args[@]}"; exit \$? ;;
      printenv) echo "clave-falsa"; exit 0 ;;
      sh)
        cmd="\${3:-}"
        case "\$cmd" in
          *wget*) echo '{"ok":true}'; exit 0 ;;
          *"grep -c"*) echo "1"; exit 0 ;;
          *webhook-server.mjs*) exit 0 ;;   # el arranque: no se lanza nada de verdad
          *printf*) bash -c "\${cmd//\$DEST/\$C}"; exit \$? ;;
          *) echo "docker falso: sh -c no contemplado: \$cmd" >&2; exit 1 ;;
        esac
        ;;
      *) echo "docker falso: verbo exec no contemplado: \$*" >&2; exit 1 ;;
    esac
    ;;
  *) echo "docker falso: verbo no contemplado: \$*" >&2; exit 1 ;;
esac
`;
  writeFileSync(path.join(bin, "docker"), docker);
  chmodSync(path.join(bin, "docker"), 0o755);

  const correr = () => {
    try {
      const salida = execFileSync("bash", [path.join(host, "webhook-server.sh"), "start"], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        env: {
          ...process.env,
          PATH: `${bin}:${process.env.PATH}`,
          ONIA_BOT_CONTAINER: "contenedor-falso",
          ONIA_TG_ENV_FILE: path.join(raiz, "no-existe.env"),
          ONIA_WEBHOOK_ENV_FILE: path.join(raiz, "no-existe.env"),
        },
      });
      return { code: 0, salida };
    } catch (error) {
      return { code: error.status ?? 1, salida: `${error.stdout || ""}${error.stderr || ""}` };
    }
  };

  return {
    correr,
    contenedor,
    limpiar: () => rmSync(raiz, { recursive: true, force: true }),
    testigos: () => (existsSync(testigo) ? readFileSync(testigo, "utf8").trim().split("\n") : []),
    leerContenedor: (f) => (existsSync(path.join(contenedor, f)) ? readFileSync(path.join(contenedor, f), "utf8") : null),
  };
}

test("el sync NO borra el destino vivo antes de tener la copia nueva lista", () => {
  const mundo = mundoFalso();
  try {
    const { code, salida } = mundo.correr();
    assert.equal(code, 0, `el sync tenia que salir bien: ${salida}`);

    assert.deepEqual(
      mundo.testigos(),
      ["vivo-completo"],
      "mientras se copia la version nueva, el bot que esta atendiendo tiene que seguir con TODOS sus archivos",
    );

    assert.equal(mundo.leerContenedor("knowledge.json"), NUEVO, "al terminar, lo publicado es la version nueva");
    assert.notEqual(mundo.leerContenedor(".stamp"), "stampviejo000", "el stamp se publica junto con el codigo");
    assert.equal(mundo.leerContenedor(".new"), null, "no queda basura al lado del destino");
    assert.equal(mundo.leerContenedor(".old"), null, "la copia anterior se limpia");
  } finally {
    mundo.limpiar();
  }
});

test("si la copia al contenedor FALLA, el bot sigue sirviendo lo que tenia (no queda sin archivos)", () => {
  const mundo = mundoFalso({ cpFalla: true });
  try {
    const { code, salida } = mundo.correr();
    assert.notEqual(code, 0, "una copia fallida tiene que salir en error, no en silencio");
    assert.match(salida, /no se pudo copiar/i);

    assert.equal(
      mundo.leerContenedor("knowledge.json"),
      VIVO,
      "el destino vivo no se toca hasta que la copia nueva esta completa: con el sync viejo, aca el bot quedaba sin nada",
    );
    assert.equal(mundo.leerContenedor(".stamp"), "stampviejo000", "sin publicar, el stamp sigue siendo el de lo que corre");
  } finally {
    mundo.limpiar();
  }
});
