// ONIA — el espejo del motor tiene que ser el motor que corre.
//
// El agujero que este test existe para tapar: `hermes-content/deploy/vps-ops/bot/` es el
// ESPEJO de `/opt/onia/bot/` del VPS, y nada verifica que sean iguales. Ya se desincronizo
// dos veces, las dos descubiertas de casualidad y en direcciones opuestas:
//
//   - 2026-08-28 (`d334d776`): el espejo quedo 25 archivos ATRAS del VPS. Trabajar sobre el
//     habria pisado el motor vivo.
//   - 2026-08-31 (esta vuelta): el VPS quedo un commit atras del espejo — le falta `994eb42d`,
//     el que hace que las frases de campaña se vean en modo venta. La cola daba el motor por
//     desplegado y escribia que solo faltaba copiar `knowledge.json`: con el motor viejo esa
//     copia no hace NADA, y el desconocido sigue recibiendo el saludo generico.
//
// Los dos costaron lo mismo: creer que estaba desplegado. Un md5 por lado lo responde.
//
// Correr:  node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"

import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import path from "node:path";

import {
  acoplesDeCopia,
  compararEspejo,
  frescuraDelEspejo,
  fuentesLocales,
  ladoVps,
  md5Archivo,
  md5Local,
  parsearMd5sum,
  simbolosDefinidos,
  simbolosUsados,
} from "./espejo-check.mjs";

test("parsearMd5sum: el prefijo de ruta del VPS no cambia el nombre del archivo", () => {
  const salida = [
    "7f50f1a9f84cbf0a51f28fd811d9a76a  /opt/onia/bot/bot-engine.mjs",
    "679e13da6b84d112ca17be1d9cab998e  /opt/onia/bot/config.mjs",
  ].join("\n");
  assert.deepEqual(parsearMd5sum(salida), {
    "bot-engine.mjs": "7f50f1a9f84cbf0a51f28fd811d9a76a",
    "config.mjs": "679e13da6b84d112ca17be1d9cab998e",
  });
});

test("parsearMd5sum: el asterisco de modo binario tampoco (md5sum de Git Bash lo escribe)", () => {
  // Trampa real: en Windows `md5sum *.mjs` devuelve "hash *nombre.mjs". Sin comerse ese
  // asterisco cada archivo del lado local aparece como "solo en el VPS" y el gate miente entero.
  assert.deepEqual(parsearMd5sum("b5a5c8789ed33b18ea9e490f8a04a64f *bot-engine.mjs"), {
    "bot-engine.mjs": "b5a5c8789ed33b18ea9e490f8a04a64f",
  });
});

test("compararEspejo: espejo igual al VPS => ok", () => {
  const lado = { "bot-engine.mjs": "aaa", "webhook-server.sh": "bbb" };
  const r = compararEspejo(lado, { ...lado });
  assert.equal(r.ok, true);
  assert.deepEqual(r.distintos, []);
  assert.deepEqual(r.soloRepo, []);
  assert.deepEqual(r.soloVps, []);
});

test("compararEspejo: el drift REAL del 2026-08-31 se pone rojo y nombra los archivos", () => {
  // Los md5 son los medidos en vivo: el VPS quedo en `3e3841aa` (comprobantes) y el espejo
  // en `994eb42d` (campañas). Si este caso pasara en verde, el gate no sirve para nada.
  const repo = {
    "bot-engine.mjs": "b5a5c8789ed33b18ea9e490f8a04a64f",
    "knowledge.mjs": "4ba536524a2e2d0cbb6d5ec16e02648c",
    "config.mjs": "679e13da6b84d112ca17be1d9cab998e",
    "campanas-web.test.mjs": "ccc",
  };
  const vps = {
    "bot-engine.mjs": "7f50f1a9f84cbf0a51f28fd811d9a76a",
    "knowledge.mjs": "d00a3c1f35c3ff1739b207d306c13b5c",
    "config.mjs": "679e13da6b84d112ca17be1d9cab998e",
  };
  const r = compararEspejo(repo, vps);
  assert.equal(r.ok, false);
  assert.deepEqual(r.distintos, ["bot-engine.mjs", "knowledge.mjs"]);
  assert.deepEqual(r.soloRepo, ["campanas-web.test.mjs"]);
  assert.deepEqual(r.soloVps, []);
});

test("compararEspejo: knowledge.json vive SOLO en el VPS y eso no es drift", () => {
  // Es el documento publicado del numero, no codigo. El espejo no lo versiona a proposito
  // (`d334d776`: "sin env, sin knowledge.json"), asi que compararlo daria rojo para siempre
  // — y un gate que siempre esta rojo se apaga.
  const r = compararEspejo({ "bot-engine.mjs": "aaa" }, { "bot-engine.mjs": "aaa", "knowledge.json": "xxx" });
  assert.equal(r.ok, true);
  assert.deepEqual(r.soloVps, []);
});

test("compararEspejo: un .json que SI difiere tampoco tumba el gate, pero se reporta", () => {
  const r = compararEspejo({ "knowledge.example.json": "aaa" }, { "knowledge.example.json": "zzz" });
  assert.equal(r.ok, true);
  assert.deepEqual(r.distintos, []);
  assert.deepEqual(r.ignorados, ["knowledge.example.json"]);
});

test("compararEspejo: un archivo que falta en el VPS es drift (deploy a medias)", () => {
  const r = compararEspejo({ "insistencia-run.mjs": "aaa" }, {});
  assert.equal(r.ok, false);
  assert.deepEqual(r.soloRepo, ["insistencia-run.mjs"]);
});

test("compararEspejo: un archivo que sobra en el VPS tambien es drift (el espejo quedo atras)", () => {
  // Es el caso de `d334d776`, el que paso al reves. Si solo miraramos "falta en el VPS",
  // trabajar sobre un espejo viejo seguiria pisando el motor vivo sin aviso.
  const r = compararEspejo({}, { "recepcionista.mjs": "aaa" });
  assert.equal(r.ok, false);
  assert.deepEqual(r.soloVps, ["recepcionista.mjs"]);
});

// --- El fin de linea NO es drift en un .mjs, y SI lo es en un .sh -------------------------
//
// `onia-hermes` tiene `core.autocrlf=true` y no tiene `.gitattributes`: git guarda el blob en
// LF y lo materializa en CRLF al hacer checkout. O sea que un `git checkout --` sobre el espejo
// cambia los BYTES de un archivo sin cambiar una sola linea de codigo — medido el 2026-08-31:
// `recepcionista.mjs` paso de 14110 bytes (LF, lo que corre el VPS) a 14375 (CRLF), +265,
// exactamente una por linea, con `git status --porcelain` VACIO y `diff` normalizando \r vacio.
//
// Como el gate compara md5 de bytes, eso fabricaba un "deploy pendiente" que nadie pidio. Es el
// molde exacto del fantasma que este carril sangra: un rojo que no corresponde a ningun cambio
// se apaga, o se "arregla" con un scp inutil al VPS.
//
// La asimetria es a proposito y no se puede colapsar: en un `.sh` el CRLF NO es cosmetico
// (`#!/bin/bash\r` no arranca), asi que ahi el byte tiene que seguir contando.

test("md5Archivo: en un .mjs, CRLF y LF con el mismo codigo dan el MISMO hash", () => {
  const lf = Buffer.from("const a = 1;\nexport default a;\n");
  const crlf = Buffer.from("const a = 1;\r\nexport default a;\r\n");
  assert.notEqual(lf.length, crlf.length, "el fixture tiene que diferir en bytes, si no no prueba nada");
  assert.equal(md5Archivo("bot-engine.mjs", crlf), md5Archivo("bot-engine.mjs", lf));
});

test("md5Archivo: en un .sh, CRLF y LF dan hashes DISTINTOS — ahi el byte importa", () => {
  const lf = Buffer.from("#!/bin/bash\necho hola\n");
  const crlf = Buffer.from("#!/bin/bash\r\necho hola\r\n");
  assert.notEqual(md5Archivo("webhook-server.sh", crlf), md5Archivo("webhook-server.sh", lf));
});

test("md5Archivo: normalizar NO tapa el drift real (el caso medido hoy en el VPS)", () => {
  // `recepcionista.test.mjs`: 9783 bytes en el espejo, 0 bytes en el VPS (md5 del archivo
  // vacio, d41d8cd9...). Si normalizar pusiera esto en verde, el gate dejaria de servir.
  const espejo = Buffer.from("import test from 'node:test';\r\ntest('x', () => {});\r\n");
  const vps = Buffer.from("");
  assert.notEqual(md5Archivo("recepcionista.test.mjs", espejo), md5Archivo("recepcionista.test.mjs", vps));
});

test("md5Archivo: dos .mjs con codigo distinto siguen difiriendo aunque compartan fin de linea", () => {
  const a = Buffer.from("const a = 1;\r\n");
  const b = Buffer.from("const a = 2;\r\n");
  assert.notEqual(md5Archivo("config.mjs", a), md5Archivo("config.mjs", b));
});

// --- La politica de fin de linea del espejo tiene que estar ESCRITA, no ser una casualidad ---
//
// Los tests de arriba prueban que el gate PERDONA el \r de un .mjs. Eso baja el ruido, pero
// deja los dos lados distintos de verdad: el dia que haga falta un `scp` selectivo por md5
// crudo, el hash sigue sin coincidir. Lo unico que hace que el espejo SEA un espejo es que el
// checkout materialice LF, y eso lo decide `.gitattributes` — que en `onia-hermes` no existe
// en la raiz, con `core.autocrlf=true`: o sea CRLF al hacer checkout.
//
// Medido el 2026-09-01: 21 .mjs del espejo estaban en CRLF en disco con el blob en LF, y
// coincidian con el VPS por casualidad. Este test se pone rojo si alguien deja el directorio
// sin politica otra vez.

test("el espejo declara eol=lf para sus .mjs (si no, un checkout los vuelve CRLF)", () => {
  const espejo = fileURLToPath(new URL(".", import.meta.url));
  const nombres = readdirSync(espejo).filter(
    (n) => n.endsWith(".mjs") && statSync(path.join(espejo, n)).isFile(),
  );
  assert.ok(nombres.length > 0, "el espejo tiene que tener .mjs, si no el test no prueba nada");

  // `git check-attr` lee la politica EFECTIVA, no el texto del archivo: es lo que git va a
  // aplicar en el proximo checkout, que es exactamente lo que este test cuida.
  const salida = execFileSync("git", ["check-attr", "eol", "--", ...nombres], {
    cwd: espejo,
    encoding: "utf8",
  });
  const sinPolitica = salida
    .split("\n")
    .filter((l) => l.trim() && !l.endsWith(": eol: lf"))
    .map((l) => l.split(":")[0]);
  assert.deepEqual(sinPolitica, [], `sin eol=lf en .gitattributes: ${sinPolitica.join(", ")}`);
});

// --- Desde el 2026-09-01 el loop corre DENTRO del VPS: /opt/onia/bot ya es este disco --------
//
// Hasta el 2026-08-31 este gate corria en la maquina de Sergio y el unico camino al VPS era
// SSH con ONIA_VPS_KEY. Migrado el loop al propio VPS, esa clave no existe en el host (se
// conectaria a si mismo) y el script fallaba entero con "Permission denied (publickey)" en vez
// de comparar nada — medido en vivo el 2026-09-01. Si el directorio ya esta en este disco no
// hace falta SSH.

test("ladoVps: si el directorio ya esta en este disco, lo lee directo sin pasar por SSH", () => {
  const tmp = mkdtempSync(path.join(tmpdir(), "espejo-check-"));
  try {
    writeFileSync(path.join(tmp, "bot-engine.mjs"), "const a = 1;\n");
    // Host y clave a proposito rotos: si `ladoVps` intentara SSH esto tiraria, no daria un
    // resultado. Que devuelva el md5 local prueba que no lo intento.
    const r = ladoVps({ host: "root@host-que-no-existe.invalid", key: "/no/existe", dir: tmp });
    assert.deepEqual(r, md5Local(tmp));
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

// --- Acoples: saber QUE difiere no alcanza para desplegar bien --------------------------------
//
// El 2026-09-02 la cola mandaba copiar al VPS `knowledge.mjs` + `recepcionista.mjs` y nada mas.
// Medido ese dia contra `/opt/onia/bot` real: el `recepcionista.mjs` del espejo ya llama a
// `intents.wantsToBook()` y a la plantilla `R_AGENDA`, y NINGUNA de las dos existe todavia alla
// (`intents.mjs` del VPS exporta `wantsToOrder` pero no `wantsToBook`; su `config.mjs` tiene
// cero `R_AGENDA`). Seguir esa instruccion al pie deja el motor llamando a `undefined`.

test("simbolosUsados: cuenta la LLAMADA a intents, no el import del modulo", () => {
  const src = 'import * as intents from "./intents.mjs";\nif (intents.wantsToBook(m)) return 1;\n';
  // Sin exigir el parentesis, `"./intents.mjs"` colaba un simbolo fantasma `intents.mjs`.
  assert.deepEqual(simbolosUsados(src), ["intents.wantsToBook"]);
});

test("simbolosUsados: las plantillas del guion tambien cruzan archivos", () => {
  const src = 'import { say } from "./reply-builder.mjs";\n'
    + 'return faq(say("R_AGENDA", next, config, { link: l }), "agenda");';
  assert.deepEqual(simbolosUsados(src), ["config.R_AGENDA"]);
});

test("simbolosUsados: nombrar un simbolo en un COMENTARIO no acopla nada", () => {
  // El falso positivo real del 2026-09-02: este mismo gate se declaraba acoplado a intents.mjs
  // y a config.mjs porque su encabezado explica el caso citando los dos nombres. Sin el import,
  // no hay llamada posible en tiempo de ejecucion.
  const src = '// el recepcionista llama a intents.wantsToBook() y a say("R_AGENDA", ...)\n';
  assert.deepEqual(simbolosUsados(src), []);
});

test("simbolosDefinidos: intents define funciones exportadas; config, plantillas en mayuscula", () => {
  const d = simbolosDefinidos({
    "intents.mjs": "export function wantsToBook(n) { return true; }\n",
    "config.mjs": "export const BASE_CONFIG = {\n  R_AGENDA: [\n    'x',\n  ].join('\\n'),\n};\n",
    "otro.mjs": "export function noCuenta() {}\n",
  });
  assert.ok(d.has("intents.wantsToBook"));
  assert.ok(d.has("config.R_AGENDA"));
  assert.ok(!d.has("intents.noCuenta"), "solo intents.mjs define intents.*");
});

test("acoplesDeCopia: el caso REAL del 2026-09-02 — recepcionista.mjs no viaja solo", () => {
  const repo = {
    "recepcionista.mjs": 'import * as intents from "./intents.mjs";\n'
      + 'import { say } from "./reply-builder.mjs";\n'
      + "if (linkAgenda && intents.wantsToBook(m.norm)) return say(\"R_AGENDA\", n, c);\n",
    "intents.mjs": "export function wantsToOrder(n) {}\nexport function wantsToBook(n) {}\n",
    "config.mjs": "export const BASE_CONFIG = {\n  R_AGENDA: 'x',\n};\n",
  };
  const vps = {
    "recepcionista.mjs": "// version vieja\n",
    "intents.mjs": "export function wantsToOrder(n) {}\n",
    "config.mjs": "export const BASE_CONFIG = {\n  R_DERIVA: 'x',\n};\n",
  };

  const solo = acoplesDeCopia(repo, vps, ["recepcionista.mjs"]);
  assert.deepEqual(
    solo.map((f) => f.simbolo).sort(),
    ["config.R_AGENDA", "intents.wantsToBook"],
    "copiar el recepcionista solo deja dos simbolos colgados",
  );
  assert.deepEqual(solo.find((f) => f.simbolo === "intents.wantsToBook").loTrae, ["intents.mjs"]);
  assert.deepEqual(solo.find((f) => f.simbolo === "config.R_AGENDA").loTrae, ["config.mjs"]);

  // Y el conjunto COMPLETO si se puede copiar: si esto no fuera vacio, el gate seria inutil
  // (gritaria siempre y alguien lo apagaria, que es la trampa que este archivo ya documenta).
  assert.deepEqual(acoplesDeCopia(repo, vps, ["recepcionista.mjs", "intents.mjs", "config.mjs"]), []);
});

test("acoplesDeCopia: no inventa acoples cuando el VPS ya tiene el simbolo", () => {
  const usa = 'import * as intents from "./intents.mjs";\nintents.wantsToOrder(m);\n';
  const repo = { "recepcionista.mjs": usa, "intents.mjs": "export function wantsToOrder(n) {}\n" };
  const vps = { "recepcionista.mjs": "// vieja\n", "intents.mjs": "export function wantsToOrder(n) {}\n" };
  // El simbolo SI se detecta (si no, este caso pasaria por no mirar nada) y aun asi no hay acople.
  assert.deepEqual(simbolosUsados(usa), ["intents.wantsToOrder"]);
  assert.deepEqual(acoplesDeCopia(repo, vps, ["recepcionista.mjs"]), []);
});

test("el espejo REAL es coherente consigo mismo: copiarlo entero nunca deja un simbolo colgado", () => {
  // El guardia que impide que este gate se vuelva un rojo permanente: el espejo tiene que poder
  // desplegarse completo sin acoples pendientes. Si algun dia falla, el roto es el espejo.
  const espejo = fileURLToPath(new URL(".", import.meta.url));
  const repo = fuentesLocales(espejo);
  assert.deepEqual(acoplesDeCopia(repo, {}, Object.keys(repo)), []);
});

// --- El agujero que tenian los 21 casos de arriba, medido el 2026-09-04 -----------------------
//
// Todos prueban las FUNCIONES de comparacion con datos sinteticos, y el unico que dice mirar
// "el espejo REAL" (el de aca arriba) compara el repo contra `{}`: o sea, contra si mismo.
// NINGUNO leia `/opt/onia/bot`. Con este archivo entero en verde, `uso-plataforma.mjs` (130
// lineas) y `uso-plataforma.test.mjs` (242) vivieron SOLO en el VPS, sin commitear nunca, y el
// `webhook-server.mjs` de produccion era superset del espejo en 27 lineas — el disparo del
// contador de la cuota mensual del add-on. Se descubrio de casualidad, desplegando otra cosa:
// `deploy-bot.sh` copia espejo -> VPS por lista blanca, asi que el deploy iba a BORRAR el
// contador sin romper nada visible. Codigo sin versionar en un VPS existe en un solo lugar.
//
// POR QUE SOLO SE MIRA LA DIRECCION VPS -> REPO, y no la simetrica: que el repo tenga algo que
// el VPS todavia no, es el estado NORMAL de cualquier arreglo commiteado y no desplegado. Un
// gate rojo aca vive en la cadena `npm test` de la raiz, que traba el merge de los 15 carriles:
// ponerlo rojo por trabajo pendiente de deploy seria un freno permanente. La direccion contraria
// -algo vivo en el VPS que no esta en git- no tiene ningun caso legitimo salvo los exentos, y es
// la unica que pierde codigo para siempre.
//
// Y los SUJETOS se derivan del DISCO del VPS menos una lista de exclusiones, no de una lista de
// inclusion: asi un archivo nuevo nace cubierto y hay que excluirlo a mano, a la vista. Al reves
// el gate falla ABIERTO — que es exactamente como nacio este agujero.

/** Lo que vive en /opt/onia/bot a proposito y NO va al repo. Cada exencion, con su motivo. */
const EXENTOS_DEL_VPS = new Set([
  "knowledge.json", // el conocimiento cargado en vivo; lo edita Sergio, no el repo
  "webhook.env", // secretos
]);

/** Mismos patrones que la lista blanca de `deploy-bot.sh`: lo que el deploy copia y pisa. */
const PATRONES_DEPLOY = [/\.mjs$/, /\.sh$/, /^knowledge\.example\.json$/, /^knowledge\.onia\.json$/, /^plantillas-humo\.json$/];

test("todo archivo VIVO en /opt/onia/bot que el deploy pisaria esta versionado en el espejo", () => {
  const DIR_VPS = "/opt/onia/bot";
  const espejo = fileURLToPath(new URL(".", import.meta.url));

  if (!existsSync(DIR_VPS)) {
    // No se salta en silencio: un gate que no midio nada tiene que DECIRLO, si no se lee como
    // verde. En el VPS -donde corren los 15 loops- la ruta es absoluta y siempre existe.
    console.log(`      (sin medir: no existe ${DIR_VPS} en este host — este gate solo corre en el VPS)`);
    return;
  }

  const enElVps = readdirSync(DIR_VPS, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => d.name)
    .filter((n) => PATRONES_DEPLOY.some((p) => p.test(n)))
    .filter((n) => !EXENTOS_DEL_VPS.has(n));

  assert.ok(
    enElVps.length > 10,
    `solo vi ${enElVps.length} archivos en ${DIR_VPS}: el filtro se rompio y el gate falla ABIERTO`,
  );

  const sinVersionar = enElVps.filter((n) => !existsSync(path.join(espejo, n)));
  assert.deepEqual(
    sinVersionar,
    [],
    `viven SOLO en ${DIR_VPS} y se perderian con el proximo deploy: ${sinVersionar.join(", ")}. ` +
      `Rescatalos al espejo con cp -p, o agregalos a EXENTOS_DEL_VPS con su motivo.`,
  );
});

// ── el espejo no puede opinar sobre el deploy si el atrasado es él ────────────────────────
//
// 2026-09-10: tercera desincronizacion, y la primera que NO era drift. El clon del VPS estaba
// un commit atras de origin/main; ese commit (`4bc1c97e`) toca `persistence.mjs` de este
// subarbol y produccion YA lo corria. Este script comparo el archivo VIEJO del clon contra el
// NUEVO del VPS y canto DESINCRONIZADO — o sea acuso de "falta desplegar" a una produccion que
// estaba ADELANTE. `deploy_sin_pedido.mjs` lo tradujo a un pedido de deploy para Sergio
// Urcullo, y ejecutarlo habria copiado el clon atrasado encima y revertido el arreglo.
//
// De los dos errores posibles el caro es declarar pendiente lo que no lo esta, asi que el
// veredicto sin frescura es "no se" (exit 2), nunca "hay drift" (exit 1).

test("con el espejo en origin/main, el veredicto se puede dar", () => {
  assert.equal(frescuraDelEspejo({ difieren: [] }).fresco, true);
});

test("si el espejo difiere de origin/main NO se concluye, y el motivo nombra el archivo", () => {
  const r = frescuraDelEspejo({ difieren: ["hermes-content/deploy/vps-ops/bot/persistence.mjs"] });
  assert.equal(r.fresco, false, "un espejo atrasado no puede distinguir su atraso de un drift");
  assert.match(r.motivo, /persistence\.mjs/, "sin nombrar el archivo nadie sabe que poner al dia");
});

test("si no se le pudo preguntar a git tampoco se concluye", () => {
  const r = frescuraDelEspejo({ error: "not a git repository" });
  assert.equal(r.fresco, false);
  assert.match(r.motivo, /not a git repository/);
});

// EL ANCLA: el que consume este script es `leerPendienteDelEspejo` de `deploy_sin_pedido.mjs`,
// que decide por el TEXTO. Un veredicto sin frescura que dijera "ESPEJO OK" haria dar por al
// dia un bot con drift real, y uno que dijera "DESINCRONIZADO" abriria el pedido falso que
// esto vino a matar. Tiene que leerse `null` = NO MEDIDO. Se cruza contra la funcion de
// verdad, no contra una copia del regex: una copia se desincroniza y el gate queda de adorno.
test("el texto del veredicto sin frescura le llega al gate como NO MEDIDO", async () => {
  const { leerPendienteDelEspejo } = await import("../../../../scripts/deploy_sin_pedido.mjs");

  // El texto se le pide al SCRIPT, no se copia aca: un test que trae su propia copia del
  // mensaje sigue verde el dia que el mensaje cambia, que es cuando el gate se rompe.
  // Se lo corre desde una copia en un directorio que NO es un repo: ahi `frescuraEnVivo`
  // falla, sale por esta rama y ni llega a tocar el VPS, asi que el caso no usa red.
  const espejo = fileURLToPath(new URL(".", import.meta.url));
  const fuera = mkdtempSync(path.join(tmpdir(), "espejo-sin-repo-"));
  let salida;
  let codigo = 0;
  try {
    const copia = path.join(fuera, "espejo-check.mjs");
    writeFileSync(copia, readFileSync(path.join(espejo, "espejo-check.mjs")));
    try {
      salida = execFileSync(process.execPath, [copia], { encoding: "utf8", timeout: 60_000, stdio: ["ignore", "pipe", "ignore"] });
    } catch (e) {
      salida = String(e.stdout || "");
      codigo = e.status;
    }
  } finally {
    rmSync(fuera, { recursive: true, force: true });
  }

  assert.equal(codigo, 2, `sin poder medir tiene que salir 2 (no se), no 1 (hay drift). Dijo: ${salida}`);
  assert.equal(leerPendienteDelEspejo(salida), null, `no es ni al dia ni pendiente: es no se. Dijo: ${salida}`);
  assert.equal(leerPendienteDelEspejo("ESPEJO OK — coincide"), false);
  assert.equal(leerPendienteDelEspejo("ESPEJO DESINCRONIZADO — vs el VPS"), true);
});
