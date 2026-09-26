// Todo archivo EJECUTABLE del emisor SIAT tiene que tener quién lo despliegue.
//
// POR QUÉ EXISTE. `hermes-content/deploy/onia-siat/publicar.sh` copia por una
// lista derivada de `git ls-files` filtrada con un regex, y hasta el 2026-09-10
// dejaba `run-fase1-volumen.sh` afuera con un motivo escrito y verdadero: «vive
// en /opt/onia-siat/, un nivel más arriba». Es cierto DÓNDE vive y no lo saca de
// necesitar deploy — el archivo es el orquestador de la corrida de volumen de la
// Fase 1, está versionado, y ningún otro circuito lo lleva. Efecto medido ese
// día: el VPS corría la versión del 4-sep (633 B) mientras `origin/main` tenía
// la del 10-sep (3023 B), con `2e9230c5` mergeado — la que deriva sus etapas de
// `STAGE_ORDER` en vez de tipearlas, o sea la que corre la etapa I, la que pide
// el CUIS por punto de venta. Sin ella, el día que exista el Punto de Venta 1 el
// script NO lo desbloquea y los 11 combos pv1 (1.169 documentos de cobertura) no
// se emiten.
//
// LA CLASE, que es lo que este gate cuida y no el archivo: una EXENCIÓN de lista
// blanca con su motivo escrito se lee como decidida y nadie la vuelve a auditar.
// Es la hermana de «una entrada de lista blanca que ningún sujeto usa queda
// pre-aprobada», al revés: acá la exención deja huérfano a un archivo VIVO. Por
// eso el sujeto se deriva del disco y la exención se RE-MIDE en cada corrida: un
// `.sh` nuevo en el subárbol nace cubierto o pone esto en rojo.
//
// Se mide sobre el fuente del publicador (no se puede correr sin el VPS), y los
// regex se LEEN de ahí en vez de copiarse: duplicarlos es como se desincronizan.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const SUB = "hermes-content/integrations/siat";
const PUBLICADOR = join(RAIZ, "hermes-content/deploy/onia-siat/publicar.sh");

const git = (...args) =>
  execFileSync("git", ["-C", RAIZ, ...args], { encoding: "utf8" }).trim();

/** Los archivos del subárbol, relativos a él, con su bit de ejecución. */
function archivosDelSubarbol() {
  return git("ls-files", "-s", "--", SUB)
    .split("\n")
    .filter(Boolean)
    .map((linea) => {
      const [modo, , , ruta] = linea.split(/\s+/);
      return { ruta: ruta.slice(SUB.length + 1), ejecutable: modo === "100755" };
    });
}

/**
 * Los dos regex del publicador, LEÍDOS de su fuente.
 *
 * `ARCHIVOS=` es lo que se copia al emisor y `ARRIBA=` lo que se copia un nivel
 * más arriba. Si el publicador deja de declarar alguno, esto tira en vez de dar
 * verde: un gate que no encuentra a su sujeto no puede aprobarlo.
 */
function regexDelPublicador() {
  const fuente = readFileSync(PUBLICADOR, "utf8");
  const sacar = (nombre) => {
    const m = fuente.match(new RegExp(`^${nombre}=\\$\\(cd "\\$SRC" && git ls-files \\. \\| grep -E '([^']+)'`, "m"));
    assert.ok(m, `${PUBLICADOR} ya no declara ${nombre}= con su grep -E: el gate no puede medir la cobertura`);
    return new RegExp(m[1]);
  };
  return { alEmisor: sacar("ARCHIVOS"), arriba: sacar("ARRIBA") };
}

/** Lo que el publicador puede dejar afuera, con su motivo. Se re-mide abajo. */
const EXENTOS = {
  ".env.example": "plantilla del repo, no del despliegue",
  ".gitignore": "del repo, no del despliegue",
  "ONBOARDING_CLIENTE.md": "documentación de cliente, no la ejecuta nadie",
};

test("el publicador del emisor SIAT cubre todo lo que el VPS ejecuta", async (t) => {
  const archivos = archivosDelSubarbol();
  const { alEmisor, arriba } = regexDelPublicador();

  await t.test("hay archivos que medir (si esto falla, el sujeto se evaporó)", () => {
    assert.ok(archivos.length >= 10, `esperaba el subárbol del emisor, encontré ${archivos.length} archivos`);
    assert.ok(
      archivos.some((a) => a.ejecutable),
      "ningún archivo del subárbol es ejecutable: o cambió el modo en git, o el gate está midiendo otra carpeta",
    );
  });

  await t.test("ningún archivo queda sin quién lo despliegue ni motivo", () => {
    const huerfanos = archivos
      .filter((a) => !alEmisor.test(a.ruta) && !arriba.test(a.ruta) && !(a.ruta in EXENTOS))
      .map((a) => a.ruta);
    assert.deepEqual(
      huerfanos,
      [],
      `estos archivos del emisor no los copia nadie y no están exentos: ${huerfanos.join(", ")}`,
    );
  });

  await t.test("un EJECUTABLE nunca puede estar exento: es lo que el VPS corre", () => {
    const exentosEjecutables = archivos
      .filter((a) => a.ejecutable && a.ruta in EXENTOS)
      .map((a) => a.ruta);
    assert.deepEqual(
      exentosEjecutables,
      [],
      `un ejecutable con exención es un archivo vivo sin deploy: ${exentosEjecutables.join(", ")}`,
    );
  });

  await t.test("cada ejecutable del subárbol lo copia alguno de los dos destinos", () => {
    const sinDeploy = archivos
      .filter((a) => a.ejecutable && !alEmisor.test(a.ruta) && !arriba.test(a.ruta))
      .map((a) => a.ruta);
    assert.deepEqual(
      sinDeploy,
      [],
      `el VPS ejecuta esto y ningún circuito se lo lleva: ${sinDeploy.join(", ")}`,
    );
  });

  await t.test("ninguna exención sobra (una exención que no aplica se pudre sin que nadie la mire)", () => {
    const presentes = new Set(archivos.map((a) => a.ruta));
    const sobran = Object.keys(EXENTOS).filter((r) => !presentes.has(r));
    assert.deepEqual(sobran, [], `estas exenciones ya no describen a ningún archivo: ${sobran.join(", ")}`);
  });

  await t.test("los dos destinos no se pisan: ningún archivo va a los dos lados", () => {
    const dobles = archivos.filter((a) => alEmisor.test(a.ruta) && arriba.test(a.ruta)).map((a) => a.ruta);
    assert.deepEqual(dobles, [], `estos irían a los dos destinos y la segunda copia pisa a la primera: ${dobles.join(", ")}`);
  });

  // COBERTURA NO ES RUTEO, y esa distinción costó 16 días de un archivo vivo.
  //
  // Los sub-tests de arriba preguntan QUIÉN copia cada archivo; ninguno pregunta
  // ADÓNDE. El 2026-09-26 se midió que `destino_de()` mandaba los TRES
  // orquestadores a `$DEST` (/opt/onia-siat/emisor/) en vez de `$DEST_ARRIBA`
  // (/opt/onia-siat/), que es donde se ejecutan y donde vive el estado que leen.
  // Efecto: `/opt/onia-siat/run-fase1-volumen.sh` seguía siendo el del 4-sep
  // (633 B, `for E in IV VII XI`) mientras main tenía el del 10-sep (3023 B, el
  // que deriva las etapas de STAGE_ORDER y corre la etapa I).
  //
  // Y el falso verde era perfecto: el publicador COMPARA con el mismo
  // `destino_de()` con el que copia, así que encontraba sus propias copias en el
  // lugar equivocado, decía «YA ESTA PUBLICADO» y `deploy:sin-pedido` remataba
  // «siat: al día, no hay nada que pedir». Un gate que usa la función que está
  // rota para juzgarla siempre absuelve.
  //
  // LA CLASE: el arreglo del 10-sep amplió el sujeto (de un nombre a dedo a la
  // derivación por `git ls-files`) y al hacerlo cambió el SEPARADOR de `$ARRIBA`
  // de «un solo valor» a «varias líneas» — y `case " $ARRIBA " in *" $1 "*` pide
  // espacios a los lados. Con un archivo matcheaba; con tres dejó de matchear
  // para todos, en silencio y cayendo al default. Ampliar un conjunto puede
  // romper el ruteo del elemento que ya funcionaba: por eso esto se mide
  // ejecutando la función real, no leyéndola.
  await t.test("los orquestadores se copian UN NIVEL MÁS ARRIBA, no dentro del emisor", () => {
    const fuente = readFileSync(PUBLICADOR, "utf8");
    const m = fuente.match(/^destino_de\(\) \{\n[\s\S]*?^\}/m);
    assert.ok(m, `${PUBLICADOR} ya no declara destino_de(): el gate no puede medir el ruteo`);

    const alNivelDeArriba = archivos.filter((a) => arriba.test(a.ruta)).map((a) => a.ruta);
    assert.ok(
      alNivelDeArriba.length >= 2,
      `esperaba varios orquestadores (el bug sólo aparece con más de uno), encontré ${alNivelDeArriba.length}`,
    );

    // `ARRIBA` se arma como lo arma el publicador —salida de `git ls-files`, una
    // por línea—, porque el separador ES el defecto que se está midiendo.
    const guion = [
      `ARRIBA=$(printf '%s\\n' ${alNivelDeArriba.map((r) => `'${r}'`).join(" ")})`,
      'DEST=/opt/onia-siat/emisor',
      'DEST_ARRIBA=/opt/onia-siat',
      m[0],
      'for f in $ARRIBA; do echo "$f=$(destino_de "$f")"; done',
    ].join("\n");

    const salida = execFileSync("bash", ["-c", guion], { encoding: "utf8" }).trim().split("\n");
    const malRuteados = salida.filter((l) => l.split("=")[1].startsWith("/opt/onia-siat/emisor/"));
    assert.deepEqual(
      malRuteados,
      [],
      `estos orquestadores se copiarían DENTRO del emisor en vez de un nivel más arriba, ` +
        `así que el archivo que el VPS ejecuta nunca se actualiza: ${malRuteados.join(", ")}`,
    );
  });
});
