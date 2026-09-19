#!/usr/bin/env node
/**
 * ¿El espejo del producto acepta EXACTAMENTE lo que acepta el motor?
 *
 * Hay DOS validadores del documento de conocimiento del bot y ninguno sabe del otro:
 *   - el MOTOR      `hermes-content/deploy/vps-ops/bot/knowledge.mjs` → `validateKnowledge`
 *   - el PRODUCTO   `onia-platform/lib/chatbot/knowledge.ts`          → `validarConocimiento`
 *
 * Quien PUBLICA desde el panel pasa por el del producto; quien SIRVE la respuesta al cliente del
 * cliente pasa por el del motor. Cuando divergen, el dueño de un negocio ve "guardado" y su bot
 * le contesta a sus clientes el documento por defecto —el guion de venta de ONIA— sin que nada se
 * ponga rojo.
 *
 * ORIGEN, medido el 2026-09-19: `checkHorario` nació en el motor el 18-sep y el producto ACEPTABA
 * los tres documentos que el motor rechaza (18→02, un solo extremo, 9→9). Lo dejó pasar un test
 * que declaraba el invariante en su cabecera y lo verificaba con una lista de casos escrita a
 * mano: lista de inclusión, que falla abierto en la regla nueva. Ese arreglo cerró la INSTANCIA
 * (onia-platform 681bf4a3); esto cierra la CLASE.
 *
 * DOS MITADES, y las dos hacen falta:
 *   A. mismas REGLAS — el conjunto de `check*` que cada validador invoca tiene que coincidir.
 *      Caza la regla nueva que sólo nació de un lado (el caso del 18-sep).
 *   B. mismo VEREDICTO — los dos corren sobre el MISMO corpus y tienen que decir lo mismo.
 *      Caza la regla que existe de los dos lados y endureció de uno solo (A es ciega a eso).
 *
 * El corpus NO se enumera: se deriva de `camposQueElValidadorNombra()`, que el producto ya
 * calcula EJECUTANDO su validador sobre una ruta rota por cada hoja del esquema. Enumerar los
 * campos a mano es la misma falla un piso más abajo.
 *
 * TRI-ESTADO. Sin poder leer el ref publicado, sin esbuild o sin bundle → NO MEDIDO (exit 2),
 * nunca verde: el modo de falla de esta familia es firmar sano sin haber mirado.
 *
 * Correr:  npm run validadores:cruzados        (exit 0 ok · 1 divergen · 2 no medido)
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { repoPlataforma } from "./fuente-plataforma.mjs";

export const NO_MEDIDO = 2;

// ---------------------------------------------------------------------------
// A. Las reglas que cada validador INVOCA (puro)
// ---------------------------------------------------------------------------

/**
 * Comentarios en blanco conservando los saltos de línea: un `check*` nombrado en una cabecera
 * ("ya no llamamos a checkX") no es una llamada, y contarlo acusa o absuelve al archivo sano.
 */
export function sinComentarios(texto) {
  return String(texto)
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/\/\/[^\n]*/g, (m) => m.replace(/[^\n]/g, " "));
}

/** El bloque `{...}` balanceado que arranca en `abre`. `null` si no cierra. */
function bloque(texto, abre) {
  let nivel = 0;
  for (let i = abre; i < texto.length; i += 1) {
    if (texto[i] === "{") nivel += 1;
    else if (texto[i] === "}") {
      nivel -= 1;
      if (nivel === 0) return { texto: texto.slice(abre, i + 1), fin: i };
    }
  }
  return null;
}

/**
 * El cuerpo de `function <nombre>(...)`, por llaves balanceadas.
 *
 * ⚠️ El lado del producto es TypeScript y su firma trae el tipo de RETORNO entre llaves
 * (`): { ok: boolean; errores: ErrorDeCampo[] } {`). Quedarse con la primera `{` después de la
 * firma devuelve ese TIPO como si fuera el cuerpo: cero llamadas adentro, así que el gate acusa
 * de huérfanas a las seis reglas sanas. Medido el 2026-09-19 escribiendo este archivo — el
 * instrumento me mintió a mí antes que al producto. Un bloque precedido por `:` es una anotación,
 * no un cuerpo.
 */
export function cuerpoDeFuncion(texto, nombre) {
  const limpio = sinComentarios(texto);
  const firma = new RegExp(`function\\s+${nombre}\\s*\\(`);
  const inicio = limpio.search(firma);
  if (inicio < 0) return null;
  let i = limpio.indexOf("(", inicio);
  if (i < 0) return null;
  let parens = 0;
  for (; i < limpio.length; i += 1) {
    if (limpio[i] === "(") parens += 1;
    else if (limpio[i] === ")") {
      parens -= 1;
      if (parens === 0) break;
    }
  }
  let cursor = i + 1;
  while (cursor < limpio.length) {
    const abre = limpio.indexOf("{", cursor);
    if (abre < 0) return null;
    const previo = limpio.slice(cursor, abre).trimEnd().slice(-1);
    const encontrado = bloque(limpio, abre);
    if (!encontrado) return null;
    if (previo === ":" || previo === "|" || previo === "&") {
      cursor = encontrado.fin + 1; // era el tipo de retorno; el cuerpo viene después
      continue;
    }
    return encontrado.texto;
  }
  return null;
}

/**
 * Las reglas `check*` INVOCADAS dentro de ese validador. Se pregunta por la llamada y no por la
 * declaración a propósito: una regla declarada que nadie llama no corre, y es justo la forma en
 * que un arreglo se apaga en silencio.
 */
export function reglasInvocadas(texto, nombreValidador) {
  const cuerpo = cuerpoDeFuncion(texto, nombreValidador);
  if (cuerpo === null) return null;
  const reglas = new Set();
  for (const m of cuerpo.matchAll(/\b(check[A-Z][A-Za-z0-9]*)\s*\(/g)) reglas.add(m[1]);
  return reglas;
}

// ---------------------------------------------------------------------------
// B. El corpus (puro)
// ---------------------------------------------------------------------------

/**
 * Valores sonda. No describen el esquema —eso lo sabe cada validador— sino las formas con las que
 * un panel puede llegar: vacíos, tipos cambiados, números de borde. Lo que importa no es que un
 * valor sea válido, sino que los DOS lados opinen lo mismo de él.
 */
export const SONDAS = Object.freeze([
  null,
  "",
  "  ",
  "x",
  0,
  1,
  -1,
  23,
  24,
  48,
  999,
  true,
  [],
  {},
  ["ab"],
  [{}],
  "una frase entera con varias palabras para un campo de texto",
]);

/** `empresa.horario.desde` / `campanas[0].frase` → documento mínimo con ese valor en esa ruta. */
export function docConRuta(ruta, valor, base = {}) {
  const partes = String(ruta)
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter((p) => p !== "");
  if (!partes.length) return valor;
  const raiz = { ...base };
  let nodo = raiz;
  for (let i = 0; i < partes.length - 1; i += 1) {
    const siguienteEsIndice = /^\d+$/.test(partes[i + 1]);
    const actual = /^\d+$/.test(partes[i]) ? Number(partes[i]) : partes[i];
    const previo = nodo[actual];
    const contenedor = Array.isArray(previo) || (previo && typeof previo === "object") ? previo : siguienteEsIndice ? [] : {};
    nodo[actual] = contenedor;
    nodo = contenedor;
  }
  const hoja = partes[partes.length - 1];
  nodo[/^\d+$/.test(hoja) ? Number(hoja) : hoja] = valor;
  return raiz;
}

/**
 * Un documento por cada (campo × sonda), más las combinaciones del horario —la regla que dio
 * origen a este gate— barridas de borde a borde en vez de nombradas de a una.
 */
export function corpus(campos, schema) {
  const casos = [];
  const base = { schema };
  for (const campo of campos) {
    if (!campo) continue;
    for (const sonda of SONDAS) {
      casos.push({ nombre: `${campo} = ${JSON.stringify(sonda)}`, doc: docConRuta(campo, sonda, base) });
    }
  }
  const horas = [undefined, 0, 2, 9, 18, 23, 24];
  for (const desde of horas) {
    for (const hasta of horas) {
      const horario = {};
      if (desde !== undefined) horario.desde = desde;
      if (hasta !== undefined) horario.hasta = hasta;
      casos.push({ nombre: `empresa.horario ${desde}->${hasta}`, doc: { schema, empresa: { horario } } });
    }
  }
  casos.push({ nombre: "documento vacio", doc: {} });
  casos.push({ nombre: "documento no es objeto", doc: "esto no es un documento" });
  casos.push({ nombre: "solo schema", doc: { schema } });
  return casos;
}

/**
 * Los casos en que los dos validadores NO coinciden en ACEPTAR o RECHAZAR. El veredicto se compara
 * por `ok` y no por los mensajes: el producto los traduce al castellano del dueño a propósito, así
 * que exigir el mismo texto sería un gate de redacción, no del invariante.
 */
export function divergencias(casos, validarMotor, validarProducto) {
  const salida = [];
  for (const caso of casos) {
    const motor = Boolean(validarMotor(caso.doc)?.ok);
    const producto = Boolean(validarProducto(caso.doc)?.ok);
    if (motor !== producto) salida.push({ ...caso, motor, producto });
  }
  return salida;
}

// ---------------------------------------------------------------------------
// La medición viva
// ---------------------------------------------------------------------------

/**
 * El validador del producto se lee del ref PUBLICADO y se ejecuta de verdad. Materializar `lib/`
 * con `git archive` (y no leer el working tree) es lo único que hace que las dos mitades sean del
 * MISMO instante: dos fotos de momentos distintos coinciden por casualidad.
 */
export function bundleDelProducto(repo, deps = {}) {
  const correr = deps.correr || ((cmd, args, opts) => execFileSync(cmd, args, { encoding: "utf8", ...opts }));
  const esbuild = path.join(repo, "node_modules", ".bin", "esbuild");
  if (!existsSync(esbuild)) {
    return { ok: false, motivo: `no encontre esbuild en ${esbuild} — sin el no puedo EJECUTAR el validador del producto (npm ci en ese repo)` };
  }
  const dir = mkdtempSync(path.join(tmpdir(), "onia-validadores-"));
  try {
    correr("git", ["fetch", "origin", "--quiet"], { cwd: repo, stdio: "ignore", timeout: 120_000 });
  } catch {
    return { ok: false, dir, motivo: `no pude fetchear origin en ${repo}: origin/master es una ref de DISCO y sin refrescar mide un fosil` };
  }
  let sha = "";
  try {
    sha = correr("git", ["rev-parse", "--short", "origin/master"], { cwd: repo }).trim();
    correr("sh", ["-c", `git -C ${JSON.stringify(repo)} archive origin/master lib | tar -x -C ${JSON.stringify(dir)}`], {
      timeout: 120_000,
    });
  } catch (error) {
    return { ok: false, dir, motivo: `no pude materializar lib/ de origin/master: ${error.message}` };
  }
  try {
    symlinkSync(path.join(repo, "node_modules"), path.join(dir, "node_modules"));
    correr(esbuild, [
      path.join(dir, "lib", "chatbot", "knowledge.ts"),
      "--bundle",
      "--format=esm",
      "--platform=node",
      "--packages=external",
      `--alias:@=${dir}`,
      `--outfile=${path.join(dir, "producto.mjs")}`,
    ]);
  } catch (error) {
    return { ok: false, dir, motivo: `esbuild no pudo armar el validador del producto: ${String(error.message).slice(0, 300)}` };
  }
  return { ok: true, dir, sha, bundle: path.join(dir, "producto.mjs"), fuente: path.join(dir, "lib", "chatbot", "knowledge.ts") };
}

export async function medir(deps = {}) {
  const repo = deps.repo || repoPlataforma();
  const armado = (deps.bundleDelProducto || bundleDelProducto)(repo, deps);
  if (!armado.ok) {
    if (armado.dir) rmSync(armado.dir, { recursive: true, force: true });
    return { estado: "no-medido", motivo: armado.motivo };
  }
  try {
    const producto = await import(pathToFileURL(armado.bundle).href);
    const motor = await import("./knowledge.mjs");
    const textoProducto = (deps.leer || ((p) => execFileSync("cat", [p], { encoding: "utf8" })))(armado.fuente);
    const textoMotor = (deps.leer || ((p) => execFileSync("cat", [p], { encoding: "utf8" })))(
      path.join(path.dirname(new URL(import.meta.url).pathname), "knowledge.mjs"),
    );

    const reglasMotor = reglasInvocadas(textoMotor, "validateKnowledge");
    const reglasProducto = reglasInvocadas(textoProducto, "validarConocimiento");
    if (!reglasMotor || !reglasProducto) {
      return { estado: "no-medido", motivo: "no encontre el cuerpo de uno de los dos validadores — se renombro?" };
    }
    const soloMotor = [...reglasMotor].filter((r) => !reglasProducto.has(r));
    const soloProducto = [...reglasProducto].filter((r) => !reglasMotor.has(r));

    const campos = producto.camposQueElValidadorNombra();
    const casos = corpus(campos, motor.KNOWLEDGE_SCHEMA);
    const distintos = divergencias(casos, motor.validateKnowledge, producto.validarConocimiento);

    return {
      estado: "medido",
      sha: armado.sha,
      reglas: { motor: [...reglasMotor].sort(), producto: [...reglasProducto].sort(), soloMotor, soloProducto },
      casos: casos.length,
      campos: campos.length,
      divergencias: distintos,
    };
  } catch (error) {
    return { estado: "no-medido", motivo: `no pude ejecutar los dos validadores: ${String(error.message).slice(0, 300)}` };
  } finally {
    rmSync(armado.dir, { recursive: true, force: true });
  }
}

export function informe(r) {
  const lineas = [];
  if (r.estado !== "medido") {
    lineas.push(`NO MEDIDO: ${r.motivo}`);
    return { texto: lineas.join("\n"), codigo: NO_MEDIDO };
  }
  lineas.push(`ref publicado de onia-platform: ${r.sha} · campos derivados ${r.campos} · casos ${r.casos}`);
  lineas.push(`reglas que corre el motor:    ${r.reglas.motor.join(", ")}`);
  lineas.push(`reglas que corre el producto: ${r.reglas.producto.join(", ")}`);
  const roto = r.reglas.soloMotor.length || r.reglas.soloProducto.length || r.divergencias.length;
  for (const regla of r.reglas.soloMotor) {
    lineas.push(`  ROJO  ${regla} corre en el motor y NO en el producto: el panel publica lo que el bot despues descarta`);
  }
  for (const regla of r.reglas.soloProducto) {
    lineas.push(`  ROJO  ${regla} corre en el producto y NO en el motor: el panel rechaza lo que el bot si sabe servir`);
  }
  for (const d of r.divergencias.slice(0, 12)) {
    lineas.push(`  ROJO  ${d.nombre} — motor ${d.motor ? "acepta" : "rechaza"} / producto ${d.producto ? "acepta" : "rechaza"}`);
  }
  if (r.divergencias.length > 12) lineas.push(`  ... y ${r.divergencias.length - 12} caso(s) mas`);
  lineas.push(
    roto
      ? `VEREDICTO: DIVERGEN — ${r.divergencias.length} caso(s) y ${r.reglas.soloMotor.length + r.reglas.soloProducto.length} regla(s) huerfana(s). El documento que el dueño guarda no es el que su bot sirve.`
      : "VEREDICTO: ok — el espejo del producto acepta exactamente lo que acepta el motor",
  );
  return { texto: lineas.join("\n"), codigo: roto ? 1 : 0 };
}

const invocadoDirecto = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invocadoDirecto) {
  medir()
    .then((r) => {
      const { texto, codigo } = informe(r);
      console.log(texto);
      process.exitCode = codigo;
    })
    .catch((error) => {
      console.log(`NO MEDIDO: ${error.message}`);
      process.exitCode = NO_MEDIDO;
    });
}
