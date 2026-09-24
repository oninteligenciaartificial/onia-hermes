#!/usr/bin/env node
/**
 * deploy_ya_ocurrio.mjs — ¿alguna línea de las colas pide un deploy que YA OCURRIÓ?
 *
 * ────────────────────────────────────────────────────────────────────────────────────────
 * POR QUÉ EXISTE
 *
 * Este carril tiene medida su peor tasa: **7 de 15 pendientes heredados eran fantasma (46%)**,
 * y `plataforma-v1.md` nombra su forma más cara con todas las letras:
 *
 *   «Cuatro líneas de este mismo ítem decían "Commiteado, NO desplegado" sobre código que ya
 *    estaba vivo hacía días — el 46 % de pendientes fantasma de este carril, en su forma más
 *    cara: mandan a pedir un deploy que ya ocurrió.»
 *
 * Medido el 2026-09-24: **66 ítems cerrados** de `plataforma-v1.md` seguían afirmando «falta
 * mergear» o «NO desplegado», y producción corría `3986b807` — o sea que los shas de los 66
 * estaban vivos. Una línea así no es ruido: le presta su motivo falso al pedido de deploy que
 * espera la firma de Sergio Urcullo, y hace que una vuelta entera se vaya a re-pedir algo hecho.
 *
 * El hermano de este gate es `s11_desplegado.mjs`, que cuida UN símbolo. Éste cuida la CLASE:
 * no sabe de antemano qué líneas mirar, las **deriva del disco** cada corrida.
 *
 *   node scripts/deploy_ya_ocurrio.mjs          (mide vivo; o `npm run deploy:ya-ocurrio`)
 *   node scripts/deploy_ya_ocurrio.mjs --self-check
 *
 * CÓDIGOS DE SALIDA
 *   0  ninguna línea miente                     → las colas y producción dicen lo mismo
 *   1  hay líneas que piden un deploy ya hecho  → se corrigen CON su medición al lado
 *   2  no se pudo medir                         → no medir NO es estar bien
 *
 * ────────────────────────────────────────────────────────────────────────────────────────
 * QUÉ MIDE, Y CONTRA QUÉ
 *
 * El sha que CORRE sale de la ETIQUETA DE IMAGEN del contenedor (`onia-platform:release-<sha>`),
 * no de la fecha del build ni de `origin/master`. Desde el 2026-09-24 producción se publica por
 * imagen, y por eso el `BUILD_ID` vivo ya NO tiene par en `/opt/onia-platform/build-*`: quien
 * siga casando BUILD_ID contra el disco obtiene «no pude medir» para siempre y lo lee como
 * «nadie desplegó». La etiqueta es el dato que el publicador escribe a propósito.
 *
 * ⚠️ ESTE GATE JUZGA SOLO LA PLATAFORMA. Las colas citan shas de DOS repos —`onia-platform` y
 * `onia-hermes`— y el bot tiene su propia frontera de deploy (`/opt/onia/bot`, otro publicador,
 * otra firma). Un sha que no existe en el clon de `onia-platform` NO se juzga: sale NO MEDIDO.
 * Acusar a una línea del bot con la frontera de la plataforma sería el mismo error que este
 * gate existe para cerrar, sólo que al revés.
 *
 * ⚠️ Y UN SHA QUE NO EXISTE EN EL CLON NO ES UN SHA NO DESPLEGADO. `git merge-base` sale 128
 * cuando el sha no existe; aplanar eso a `false` invierte el veredicto. Por eso todo viaja en
 * TRI-ESTADO y `null` nunca se puede leer como una respuesta.
 */

import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export const SIN_MENTIRAS = 0;
export const MIENTEN = 1;
export const NO_PUDE_MEDIR = 2;

export const CONTENEDOR = "onia-platform";
export const REPO_PLATAFORMA = process.env.ONIA_PLATFORM_REPO ?? "/root/loops/onia-platform-chatbot";
export const DIR_COLAS = process.env.ONIA_COLAS_DIR ?? "hermes-content/docs/cola";

/**
 * Las frases con las que una cola le pide un deploy al que viene después.
 *
 * Se buscan por SIGNIFICADO, no por literal exacto: las mismas 66 líneas lo dicen de nueve
 * formas distintas («falta mergear y desplegar», «Commiteado, NO desplegado», «NO DESPLEGADO»,
 * «sin desplegar», «falta el deploy»...). Una lista de literales se queda corta con la décima.
 */
export const PIDE_DEPLOY =
  /falta(?:n)?\s+(?:el\s+)?(?:merge(?:ar)?|deploy|desplegar)|falta\s+su\s+deploy|no\s+desplegad[oa]|sin\s+desplegar|todav[ií]a\s+no\s+(?:est[áa]\s+)?desplegad/i;

/** Un token de sha citado entre backticks. Descarta los que son sólo dígitos (fechas, montos). */
export const SHA = /`([0-9a-f]{7,40})`/g;

/**
 * Una CITA no es una afirmación.
 *
 * Medido el 2026-09-24: las líneas que MÁS repiten «Commiteado, NO desplegado» son justamente
 * las que lo están corrigiendo — *«Cuatro líneas de este mismo ítem decían "Commiteado, NO
 * desplegado" sobre código que ya estaba vivo»*. Un gate que las acusa le pide a la próxima
 * vuelta que corrija una corrección, y así se desgasta hasta que alguien lo apaga.
 *
 * Se recortan los tramos entre comillas —`*"…"*`, `"…"`, `«…»`— y se juzga sólo lo que queda,
 * que es lo que la línea dice POR SÍ MISMA.
 */
export function sinCitas(linea) {
  return String(linea ?? "")
    .replace(/\*"[^"]*"\*/g, " ")
    .replace(/«[^»]*»/g, " ")
    .replace(/"[^"]*"/g, " ")
    .replace(/“[^”]*”/g, " ");
}

// ---------------------------------------------------------------------------
// La decisión — pura, sin sistema. Es lo que prueba `--self-check`.
// ---------------------------------------------------------------------------

/**
 * @param {Array<{archivo:string, linea:number, frase:string, shas:string[]}>} afirmaciones
 * @param {(sha:string)=>(boolean|null)} estaVivo  true = desplegado · false = no · null = no sé
 * @returns {{mienten:Array, noMedidas:Array, honestas:Array}}
 */
export function juzgar(afirmaciones, estaVivo) {
  const mienten = [];
  const noMedidas = [];
  const honestas = [];
  for (const a of afirmaciones) {
    const veredictos = a.shas.map((s) => ({ sha: s, vivo: estaVivo(s) }));
    const juzgables = veredictos.filter((v) => v.vivo !== null);
    // Sin un solo sha juzgable no hay nada que afirmar: puede ser una línea del bot, o un ítem
    // que nunca citó su commit. NO MEDIDO, que es distinto de honesta.
    if (juzgables.length === 0) {
      noMedidas.push({ ...a, motivo: a.shas.length ? "ningun sha es de onia-platform" : "la linea no cita sha" });
      continue;
    }
    // Miente cuando TODO lo que se puede juzgar ya está vivo. Si queda una pieza afuera, la
    // línea sigue siendo cierta para esa pieza y no se toca.
    if (juzgables.every((v) => v.vivo === true)) {
      mienten.push({ ...a, vivos: juzgables.map((v) => v.sha) });
    } else {
      honestas.push({ ...a, faltan: juzgables.filter((v) => v.vivo === false).map((v) => v.sha) });
    }
  }
  return { mienten, noMedidas, honestas };
}

/**
 * Saca de un markdown de cola las líneas que piden deploy, con los shas del ÍTEM al que
 * pertenecen (no los de la línea: casi ninguna los repite — el sha vive en la cabecera).
 */
export function afirmacionesDe(texto, archivo) {
  const lineas = texto.split("\n");
  const items = [];
  let actual = null;
  for (let i = 0; i < lineas.length; i++) {
    const l = lineas[i];
    if (/^- \[[ x]\] /.test(l)) {
      actual = { desde: i, lineas: [] };
      items.push(actual);
    } else if (actual && !(l.startsWith("      ") || l.trim() === "")) {
      if (/^(- |## |---)/.test(l)) actual = null;
    }
    if (actual) actual.lineas.push({ n: i + 1, texto: l });
  }
  const out = [];
  for (const it of items) {
    const cuerpo = it.lineas.map((x) => x.texto).join("\n");
    const shas = [...new Set([...cuerpo.matchAll(SHA)].map((m) => m[1]))].filter((s) => !/^\d+$/.test(s));
    for (const { n, texto: t } of it.lineas) {
      if (PIDE_DEPLOY.test(sinCitas(t))) out.push({ archivo, linea: n, frase: t.trim().slice(0, 120), shas });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// La medición — el sistema. Todo lo que puede fallar devuelve null, nunca false.
// ---------------------------------------------------------------------------

function correr(cmd, args) {
  try {
    return execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 120000 }).trim();
  } catch {
    return null;
  }
}

/** El sha que CORRE, derivado de la etiqueta de imagen. `null` = no pude preguntar. */
export function shaDesplegado() {
  const crudo =
    correr("docker", ["inspect", CONTENEDOR, "--format", "{{.Config.Image}}"]) ??
    correr("/root/bin/onia-vps.sh", ["docker", "inspect", CONTENEDOR, "--format", "{{.Config.Image}}"]);
  return shaDeEtiqueta(crudo);
}

/** `onia-platform:release-3986b807` -> `3986b807`. Cualquier otra forma -> null. */
export function shaDeEtiqueta(etiqueta) {
  const m = /release-([0-9a-f]{7,40})\b/.exec(String(etiqueta ?? ""));
  return m ? m[1] : null;
}

/** Fábrica de `estaVivo` contra un repo y un sha de referencia. */
export function vivoContra(repo, referencia) {
  return (sha) => {
    // Preguntar primero si el sha EXISTE: `merge-base` sale 128 si no, y ese 128 no es un "no".
    const existe = (() => {
      try {
        execFileSync("git", ["-C", repo, "cat-file", "-e", `${sha}^{commit}`], { stdio: "ignore", timeout: 30000 });
        return true;
      } catch {
        return false;
      }
    })();
    if (!existe) return null;
    // Existir en el clon NO es haber sido publicado. Desde nodo-casa `onia-platform` no se
    // pushea: la entrega va por `format-patch | ssh … git am`, y `git am` REGENERA el sha. El
    // local queda como un fantasma que no está en ningún remoto — `4d94cdf` es uno, y el propio
    // ítem lo dice. Juzgarlo como «no desplegado» blinda al ítem entero contra su corrección.
    const enAlgunRemoto = (() => {
      try {
        const r = execFileSync("git", ["-C", repo, "branch", "-r", "--contains", sha], {
          encoding: "utf8",
          stdio: ["ignore", "pipe", "ignore"],
          timeout: 30000,
        });
        return r.trim().length > 0;
      } catch {
        return false;
      }
    })();
    if (!enAlgunRemoto) return null;
    try {
      execFileSync("git", ["-C", repo, "merge-base", "--is-ancestor", sha, referencia], { stdio: "ignore", timeout: 30000 });
      return true;
    } catch {
      return false;
    }
  };
}

export function colasDe(dir) {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ archivo: join(dir, f), texto: readFileSync(join(dir, f), "utf8") }));
}

// ---------------------------------------------------------------------------
// Self-check — lógica pura, sin repo ni contenedor. Es lo que entra a la cadena.
// ---------------------------------------------------------------------------

function selfCheck() {
  const casos = [];
  const ok = (nombre, cond) => casos.push({ nombre, ok: Boolean(cond) });

  // La frase se reconoce en las nueve formas medidas el 2026-09-24 en plataforma-v1.md.
  for (const frase of [
    "**Falta mergear y desplegar** para que el cliente lo vea.",
    "⚠️ **Commiteado, NO desplegado**: el contenedor sigue con el build viejo",
    "**NO DESPLEGADO** — llega al cliente con el swap de `plataforma`",
    "falta mergear a `master` y desplegar; pedido `t_cba4fa74`",
    "Sin desplegar: viaja en el pedido",
    "**Commiteado y pusheado; todavía NO desplegado.**",
    "**Falta el deploy** para que el cliente lo vea.",
    "rama, NO desplegado**: falta el merge a `master` y el swap.",
    "falta su deploy",
  ]) ok(`reconoce: ${frase.slice(0, 40)}`, PIDE_DEPLOY.test(frase));

  // Y NO se dispara con lo que sólo habla de deploys sin pedir uno.
  for (const frase of [
    "El circuito de deploy YA EXISTE — no lo construyas.",
    "verificado 2026-09-24, mergeado y DESPLEGADO",
    "el pedido de deploy se DERIVA, no se copia",
  ]) ok(`no se dispara con: ${frase.slice(0, 40)}`, !PIDE_DEPLOY.test(frase));

  // Una CITA de la frase no es la frase: son las líneas que la están corrigiendo.
  for (const frase of [
    '⚠️ Cuatro líneas de este mismo ítem decían *"Commiteado, NO desplegado"* sobre código vivo',
    'esta línea daba por faltantes. Decía *"COMMITEADO, NO DESPLEGADO, y NO se miró"*',
    "la cola decía «falta mergear y desplegar» y hacía tres días que estaba vivo",
  ]) ok(`no acusa a la cita: ${frase.slice(0, 38)}`, !PIDE_DEPLOY.test(sinCitas(frase)));
  // …pero una línea que lo afirma DE VERDAD sigue cayendo, aunque tenga comillas en otra parte.
  ok(
    "acusa igual si la cita es de otra cosa",
    PIDE_DEPLOY.test(sinCitas('El pedido se llama "Publicar app.onia" — **Commiteado, NO desplegado**.')),
  );

  // Extracción: el sha vive en la cabecera del ítem, la frase dos líneas más abajo.
  const md = [
    "## Ahora",
    "",
    "- [x] ✅ **CERRADO (`abc1234`, onia-platform): algo**",
    "      cuerpo del item.",
    "      ⚠️ **Commiteado, NO desplegado**: viaja con el pedido.",
    "",
    "- [x] otro item sin frase ni sha",
  ].join("\n");
  const af = afirmacionesDe(md, "x.md");
  ok("encuentra 1 afirmacion", af.length === 1);
  ok("hereda el sha de la cabecera del item", af[0]?.shas.join() === "abc1234");
  ok("la senala en su linea real", af[0]?.linea === 5);

  // El juicio, con sus tres salidas.
  const base = [{ archivo: "a", linea: 1, frase: "NO desplegado", shas: ["aaa1111"] }];
  ok("todo vivo -> miente", juzgar(base, () => true).mienten.length === 1);
  ok("nada vivo -> honesta", juzgar(base, () => false).honestas.length === 1);
  ok("sha ajeno -> NO MEDIDO", juzgar(base, () => null).noMedidas.length === 1);
  ok("sin sha -> NO MEDIDO", juzgar([{ archivo: "a", linea: 1, frase: "x", shas: [] }], () => true).noMedidas.length === 1);
  // La mitad viva NO alcanza: la línea sigue siendo cierta para la pieza que falta.
  const mixto = [{ archivo: "a", linea: 1, frase: "x", shas: ["aaa1111", "bbb2222"] }];
  ok("una pieza afuera -> honesta", juzgar(mixto, (s) => s === "aaa1111").honestas.length === 1);
  // Y un sha NO MEDIDO no salva a una línea cuyo resto está vivo: se juzga con lo juzgable.
  const conAjeno = [{ archivo: "a", linea: 1, frase: "x", shas: ["aaa1111", "ccc3333"] }];
  ok("ignora el sha ajeno y juzga el resto", juzgar(conAjeno, (s) => (s === "ccc3333" ? null : true)).mienten.length === 1);

  // La etiqueta de imagen: es de donde sale el sha que corre.
  ok("lee la etiqueta", shaDeEtiqueta("onia-platform:release-3986b807") === "3986b807");
  ok("BUILD_ID no es una etiqueta", shaDeEtiqueta("VREeqNSncIqDIOTMbfLTQ") === null);
  ok("sin etiqueta -> null, no cadena vacia", shaDeEtiqueta(null) === null);

  const malos = casos.filter((c) => !c.ok);
  for (const c of casos) console.log(`${c.ok ? "ok  " : "FALLA"} ${c.nombre}`);
  console.log(`\n${casos.length - malos.length}/${casos.length} casos`);
  return malos.length ? 1 : 0;
}

// ---------------------------------------------------------------------------

function medir() {
  const desplegado = shaDesplegado();
  if (!desplegado) {
    console.log(`NO MEDIDO — no pude leer la etiqueta de imagen de \`${CONTENEDOR}\` (ni local ni por SSH).`);
    console.log("Sin el sha que corre no se puede acusar a ninguna linea: no medir NO es estar bien.");
    return NO_PUDE_MEDIR;
  }
  const estaVivo = vivoContra(REPO_PLATAFORMA, desplegado);
  if (estaVivo(desplegado) !== true) {
    console.log(`NO MEDIDO — el sha desplegado \`${desplegado}\` no existe en ${REPO_PLATAFORMA} (¿falta un fetch?).`);
    return NO_PUDE_MEDIR;
  }

  const afirmaciones = colasDe(DIR_COLAS).flatMap(({ archivo, texto }) => afirmacionesDe(texto, archivo));
  const { mienten, noMedidas, honestas } = juzgar(afirmaciones, estaVivo);

  console.log(`Produccion corre \`${desplegado}\` (etiqueta de imagen de ${CONTENEDOR}).`);
  console.log(
    `Lineas que piden deploy en ${DIR_COLAS}: ${afirmaciones.length} — ` +
      `${mienten.length} mienten · ${honestas.length} ciertas · ${noMedidas.length} no medidas (sha ajeno o sin sha).`,
  );
  if (!mienten.length) {
    console.log("\nOK — ninguna linea pide un deploy que ya ocurrio.");
    return SIN_MENTIRAS;
  }
  console.log("\nESTAS LINEAS PIDEN UN DEPLOY QUE YA OCURRIO (su codigo esta vivo):\n");
  for (const m of mienten.slice(0, 80)) {
    console.log(`  ${m.archivo}:${m.linea}  [${m.vivos.join(" ")}]`);
    console.log(`      ${m.frase}`);
  }
  if (mienten.length > 80) console.log(`  … y ${mienten.length - 80} mas.`);
  console.log("\nSe corrigen CON su medicion al lado, no se borran: la historia del item es cierta,");
  console.log("lo que caduco es su estado. Una linea congelada en pasado se lee como presente.");
  return MIENTEN;
}

const esMain = process.argv[1] && process.argv[1].endsWith("deploy_ya_ocurrio.mjs");
if (esMain) process.exit(process.argv.includes("--self-check") ? selfCheck() : medir());
