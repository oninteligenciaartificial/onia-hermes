#!/usr/bin/env node
/**
 * El freno de precio del publicador mide si cambio un MONTO, no que archivo se toco.
 *
 * POR QUE EXISTE, medido el 2026-09-17 (tarea t_189a6037). `onia-publicar-solo.sh`
 * es el unico camino por el que un arreglo llega al cliente sin que Sergio Urcullo
 * apriete nada, y se detiene cuando un commit varado toca una fuente de precio. Ese
 * dia el criterio era el NOMBRE del archivo: `grep` sobre `git show --name-only`.
 * Con eso, los TRES destinos llevaban dias detenidos y el unico cambio real en
 * `lib/subscription-plans.ts` era `DEFAULT_PLAN_AMOUNTS[plan][cycle]` pasando a
 * `[plan]?.[cycle]`, mas comentarios: la tabla de montos, identica linea por linea.
 * Atras de ese freno esperaba el arreglo que dejaba afuera a todo cliente nuevo.
 *
 * QUE FIJA. Las dos direcciones, que es lo unico que hace util a este gate:
 *   · aflojar de mas — un cambio REAL de monto tiene que seguir deteniendo el
 *     destino, tambien cuando entra por un MERGE (un `git show` de un merge sale
 *     VACIO si no se le pide `-m --first-parent`, y los medidores de varados
 *     devuelven merges: el que trae la rama a main es un commit varado mas);
 *   · apretar de mas — un `?.`, un renombre o un comentario que CITA un precio
 *     viejo no son un monto nuevo y no pueden costarle la publicacion a nadie.
 *
 * COMO. No mira el texto del guion: lo EJECUTA (`--montos`) contra un repo git
 * sembrado por corrida, que es la unica forma de que el sujeto sea la funcion real.
 * Preguntar no publica nada y no necesita `/opt`, asi que el caso corre en cualquier
 * maquina — la de los carriles no tiene `/opt`.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const GUION = join(AQUI, "loops/extras/publicar-solo.sh");
const ARCHIVO = "lib/subscription-plans.ts";

/** La tabla de montos tal como la escribe el producto, para poder mutarla. */
const tabla = (mensual, textoDelAddon) => `// Los montos de los planes. FUENTE UNICA: lo que valida el pago.
export const DEFAULT_PLAN_AMOUNTS = {
  basico: { monthly: ${mensual}, yearly: 7500 },
};
export const ADDON = { etiqueta: "Bs ${textoDelAddon}/mes" };
export function getPlanAmount(plan, cycle) {
  return DEFAULT_PLAN_AMOUNTS[plan][cycle];
}
`;

function git(repo, ...args) {
  const r = spawnSync("git", ["-C", repo, ...args], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`git ${args.join(" ")}: ${r.stderr}`);
  return (r.stdout ?? "").trim();
}

/** Un repo con un commit base y el archivo de precios adentro. */
function repoSembrado() {
  const dir = mkdtempSync(join(tmpdir(), "onia-freno-precio-"));
  git(dir, "init", "--quiet", "-b", "main");
  git(dir, "config", "user.email", "gate@onia.test");
  git(dir, "config", "user.name", "gate");
  spawnSync("mkdir", ["-p", join(dir, "lib")]);
  writeFileSync(join(dir, ARCHIVO), tabla(320, "390"));
  git(dir, "add", "-A");
  git(dir, "commit", "--quiet", "-m", "base");
  return dir;
}

function commitear(dir, contenido, mensaje) {
  writeFileSync(join(dir, ARCHIVO), contenido);
  git(dir, "add", "-A");
  git(dir, "commit", "--quiet", "-m", mensaje);
  return git(dir, "rev-parse", "HEAD");
}

/** Le pregunta al guion REAL si esos commits cambian algun monto. */
function preguntar(repo, ...shas) {
  const r = spawnSync("bash", [GUION, "--montos", repo, ARCHIVO, ...shas], {
    encoding: "utf8",
    timeout: 60_000,
  });
  return { codigo: r.status, salida: `${r.stdout ?? ""}${r.stderr ?? ""}`.trim() };
}

test("un `?.` y unos comentarios que CITAN precios no son un monto nuevo: publica", () => {
  const dir = repoSembrado();
  try {
    const sha = commitear(
      dir,
      tabla(320, "390").replace(
        "DEFAULT_PLAN_AMOUNTS[plan][cycle];",
        "DEFAULT_PLAN_AMOUNTS[plan]?.[cycle];\n  // Antes cotizaba 890 y 1290 sin preguntar",
      ),
      "fix: getPlanAmount tiraba con un plan desconocido",
    );
    const r = preguntar(dir, sha);
    assert.equal(
      r.codigo,
      0,
      "detuvo la publicacion por un cambio que no toca ningun monto. Eso es el freno " +
        "viejo (medir el NOMBRE del archivo) y dejo los tres destinos parados dias. " +
        "Salida: " + r.salida,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("un comentario de bloque que NARRA precios viejos tampoco detiene", () => {
  // `lib/pricing.ts` tiene varios: parrafos `/** … */` que cuentan el bug de la
  // escalera vieja y citan Bs 890 y Bs 1.290. Son historia, no una promesa nueva.
  const dir = repoSembrado();
  try {
    const sha = commitear(
      dir,
      `/**\n * Hasta el 2026-09-12 esto cotizaba 890 y 1290.\n * La escalera C metio el Crece de 550 en el medio.\n */\n${tabla(320, "390")}`,
      "docs: por que la tabla quedo asi",
    );
    const r = preguntar(dir, sha);
    assert.equal(
      r.codigo,
      0,
      "conto los precios citados en un comentario como montos nuevos: con eso, documentar " +
        "por que un precio es el que es cuesta una publicacion. Salida: " + r.salida,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("cambiar un monto de la tabla DETIENE, y el aviso dice QUE numero cambia", () => {
  const dir = repoSembrado();
  try {
    const sha = commitear(dir, tabla(330, "390"), "el plan de entrada sube a 330");
    const r = preguntar(dir, sha);
    assert.equal(r.codigo, 1, "publico un cambio de precio sin la firma. Salida: " + r.salida);
    assert.match(r.salida, /330/, "no nombro el monto nuevo: el aviso vuelve a ser 'toca una fuente de precio', que obliga a abrir el diff. Salida: " + r.salida);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("un monto que vive DENTRO de un texto tambien detiene", () => {
  const dir = repoSembrado();
  try {
    const sha = commitear(dir, tabla(320, "420"), "el add-on pasa a Bs 420");
    const r = preguntar(dir, sha);
    assert.equal(r.codigo, 1, "el precio del add-on viaja en un string, no en la tabla: igual es plata. Salida: " + r.salida);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("un MERGE que trae el cambio de monto tambien detiene — un merge sin `-m --first-parent` sale VACIO", () => {
  const dir = repoSembrado();
  try {
    git(dir, "checkout", "--quiet", "-b", "carril");
    commitear(dir, tabla(330, "390"), "el plan de entrada sube a 330");
    git(dir, "checkout", "--quiet", "main");
    git(dir, "merge", "--quiet", "--no-ff", "--no-edit", "carril");
    const merge = git(dir, "rev-parse", "HEAD");
    const r = preguntar(dir, merge);
    assert.equal(
      r.codigo,
      1,
      "el merge se leyo como si no cambiara nada: asi entra un precio nuevo en verde, " +
        "porque los medidores de varados devuelven merges. Salida: " + r.salida,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("si no se puede mirar, NO dice que esta limpio: falla CERRADO", () => {
  const dir = repoSembrado();
  try {
    for (const caso of [["deadbeefdeadbeef"], []]) {
      const r = preguntar(dir, ...caso);
      assert.equal(
        r.codigo,
        2,
        `con ${caso.length ? "un sha ilegible" : "ningun sha"} contesto ${r.codigo} en vez de NO MEDIDO. ` +
          "'No pude preguntar' no es 'me dijeron que no cambia': publicaria un precio sin mirarlo. " +
          "Salida: " + r.salida,
      );
    }
    const r = preguntar("/no/existe/este/repo", "deadbeef");
    assert.equal(r.codigo, 2, "un repo que no existe tiene que salir NO MEDIDO. Salida: " + r.salida);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

/* -------------------------------------------------------------------------
 * El VEREDICTO tiene que llegar con su CITA por el canal que alguien lee.
 *
 * Medido el 2026-09-18 (tarea t_c441fba9): el detalle —que numero cambia— se
 * calculaba bien y salia UNICAMENTE por Telegram, un canal que no entrega
 * (`/var/log/onia-tg.log`: 136 emisiones de "publicacion detenida a proposito",
 * CERO con `OK message_id=`, sobre 1.403 entregas reales, o sea el log si
 * distingue). El log del publicador, que es lo que se lee al arrancar cada
 * vuelta, decia el motivo a secas. Con eso el freno no se puede refutar: otra
 * sesion abrio esa tarea afirmando que contaba los numeros de los COMENTARIOS
 * —que ya descarta— cuando lo que cambiaba eran `0` y `1`, los indices de un
 * helper nuevo, y su cura propuesta ya estaba escrita hacia horas.
 * ---------------------------------------------------------------------- */

/**
 * Le pregunta al guion REAL como queda el renglon del log cuando detiene.
 *
 * `ONIA_PUBLICAR_SECO` no es adorno: si el modo de consulta desapareciera, el
 * guion seguiria de largo, y en el VPS eso publica los tres destinos de verdad.
 * Un caso de prueba no puede tener ese final ni cuando falla.
 */
function correr(...args) {
  const r = spawnSync("bash", [GUION, ...args], {
    encoding: "utf8",
    timeout: 60_000,
    env: { ...process.env, ONIA_PUBLICAR_SECO: "1" },
  });
  return { codigo: r.status, salida: `${r.stdout ?? ""}${r.stderr ?? ""}`.trim() };
}

const renglon = (nombre, motivo, detalle) => correr("--renglon", nombre, motivo, detalle);

test("el renglon del log NOMBRA el numero que cambia, no solo el motivo", () => {
  const r = renglon("landing", "cambia un numero en una fuente de precio", `${ARCHIVO}: 330`);
  assert.equal(r.codigo, 0, "el guion no sabe rendir el renglon del log. Salida: " + r.salida);
  assert.match(
    r.salida,
    /330/,
    "el renglon no dice QUE numero cambia, y ese detalle solo sale por un canal que no entrega: " +
      "el que lee el log no puede distinguir un precio nuevo de un indice de array. Salida: " + r.salida,
  );
  assert.match(r.salida, /landing/, "el renglon no nombra el destino. Salida: " + r.salida);
  assert.match(r.salida, new RegExp(ARCHIVO.replace(/[.]/g, "\\.")), "el renglon no nombra el archivo. Salida: " + r.salida);
});

test("el renglon del NO MEDIDO tambien nombra lo que no se pudo mirar", () => {
  const r = renglon("bot", "toca una fuente de precio y no pude medir si cambia", ARCHIVO);
  assert.equal(r.codigo, 0, "el guion no sabe rendir el renglon del NO MEDIDO. Salida: " + r.salida);
  assert.match(
    r.salida,
    new RegExp(ARCHIVO.replace(/[.]/g, "\\.")),
    "el NO MEDIDO no dice QUE archivo no se pudo mirar: los dos remedios son opuestos " +
      "(mirar el repo vs mirar el acceso) y sin el nombre no se elige. Salida: " + r.salida,
  );
});

test("sin detalle el renglon no inventa un `:` colgando", () => {
  const r = renglon("bot", "toca una fuente de precio y no pude medir si cambia", "");
  assert.equal(r.codigo, 0, "Salida: " + r.salida);
  assert.doesNotMatch(
    r.salida,
    /:\s*$/,
    "queda un dos puntos sin nada atras, que se lee como detalle perdido. Salida: " + r.salida,
  );
});

test("un flag mal escrito NO cae en publicar de verdad: sale con error", () => {
  // `--dryrun` es el typo que importa: hasta el 2026-09-18 este guion solo miraba
  // `--dry-run` y cualquier otra cosa seguia de largo hasta publicar los tres
  // destinos, sin decir una palabra.
  const r = correr("--dryrun");
  // El codigo 2 SOLO no alcanza y se midio por que: si el guion sigue de largo,
  // en la maquina de los carriles termina en NO MEDIDO, que tambien es 2. Lo que
  // distingue es QUIEN contesto — el uso, o el publicador arrancando su corrida.
  assert.match(
    r.salida,
    /^uso: /m,
    "un argumento que el guion no reconoce siguio de largo en vez de salir con el uso. " +
      "En el VPS eso publica produccion por un typo. Salida: " + r.salida,
  );
  assert.doesNotMatch(
    r.salida,
    /La Paz ==/,
    "el guion llego a arrancar su corrida con un flag que no reconoce. Salida: " + r.salida,
  );
  assert.equal(r.codigo, 2, "no salio con codigo de error. Salida: " + r.salida);
});

test("la frase del veredicto tiene UNA sola fuente: nadie la escribe por su cuenta", () => {
  // Sobre el guion con los COMENTARIOS en blanco: esta misma explicacion la cita,
  // y un gate que se acusa a si mismo por su propia documentacion es ruido.
  const codigo = readFileSync(GUION, "utf8")
    .split("\n")
    .filter((l) => !/^\s*#/.test(l))
    .join("\n");
  const veces = codigo.split("NO publico solo").length - 1;
  assert.equal(
    veces,
    1,
    `la frase "NO publico solo" se arma en ${veces} lugares. Si un destino la escribe por su ` +
      "cuenta vuelve a quedar sin cita, y este gate no lo vería: el renglon se rinde en un solo " +
      "lugar para que agregar un destino no pueda perder el detalle.",
  );
});

/**
 * La tercera forma de apretar de mas, medida el 2026-09-19 sobre la landing.
 *
 * El freno contaba TODO digito de una linea que no fuera comentario, asi que los
 * `0` y `1` de un helper nuevo —indices de array y comparaciones de cardinalidad—
 * detuvieron `onia.com.bo` desde el 2026-09-18 23:50. Lo que retenia incluia
 * `f9d932c7`, que corrige una tarjeta afirmando que "la cuenta gana" cuando PIERDE
 * por Bs 10: el freno de precio manteniendo publicada una mentira de precio, y
 * pidiendole a Sergio Urcullo una firma por un cambio que no mueve un centavo.
 *
 * El corte NO es el valor del numero: es su POSICION. Un umbral de plata nunca se
 * escribe `> 0` ni `> 1`, y un add-on que pasa a ser gratis se escribe `: 0` —una
 * asignacion—, no una comparacion. Por eso los dos casos van juntos: el que afloja
 * sin el que aprieta es una puerta abierta.
 */
const helperConIndices = `${tabla(320, "390")}
export function escalonAnterior(planes, i) {
  const contra = i > 0 ? planes[i - 1] : null;
  const ultimo = planes.filter((p) => p.chatbotIncluido).at(-1);
  const verbo = planes.filter((p) => p.chatbotIncluido).length > 1 ? "traen" : "trae";
  return contra === 0 ? { ultimo, verbo } : { ultimo, verbo, vacio: planes.length === 0 };
}
`;

test("los `0` y `1` de indices y comparaciones no son plata: publica", () => {
  const dir = repoSembrado();
  try {
    const sha = commitear(dir, helperConIndices, "helper que ordena la escalera");
    const r = preguntar(dir, sha);
    assert.equal(
      r.codigo,
      0,
      "conto indices de array y comparaciones de cardinalidad como montos nuevos: con eso, " +
        "escribir un helper en una fuente de precio cuesta la publicacion del destino entero, " +
        "y la firma que se le pide a Sergio Urcullo no protege nada. Salida: " + r.salida,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("un UMBRAL de plata comparado sigue deteniendo: aflojar no puede abrir esa puerta", () => {
  const dir = repoSembrado();
  try {
    const sha = commitear(
      dir,
      `${tabla(320, "390")}\nexport const gratis = (total) => total > 1500;\n`,
      "descuento a partir de 1500",
    );
    const r = preguntar(dir, sha);
    assert.equal(r.codigo, 1, "un umbral de plata entro sin firma por estar a la derecha de un `>`. Salida: " + r.salida);
    assert.match(r.salida, /1500/, "no nombro el umbral que cambia. Salida: " + r.salida);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("un monto ASIGNADO a 0 —un add-on que pasa a gratis— sigue deteniendo", () => {
  const dir = repoSembrado();
  try {
    const sha = commitear(dir, tabla(320, "390").replace("yearly: 7500", "yearly: 0"), "el anual pasa a 0");
    const r = preguntar(dir, sha);
    assert.equal(r.codigo, 1, "un precio que pasa a CERO es un cambio de precio: cobrar 0 es una decision de plata. Salida: " + r.salida);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

/**
 * El corte NO es la forma del numero ni su valor: es si la CLAVE que lo recibe habla
 * de plata. `asientosExtra: 0` son personas; `mensualAddon: 0` son Bs.
 *
 * Medido el 2026-09-19 06:39 La Paz, con `2b12f50ae` esperando en `origin/main`:
 * `onia-publicar-solo.sh --dry-run` contestaba «landing: NO publico solo — cambia un
 * numero en una fuente de precio: .../pricing.ts: 0 1» y NINGUN monto cambiaba —
 * `Bs 70` seguia saliendo intacto de `USUARIO_EXTRA_ADDON`. Los numeros acusados eran
 * `asientosExtra: 0` (cuantas personas extra vende un plan) y el `0`/`1` de
 * `frase.charAt(0)` / `frase.slice(1)`, un helper que arma texto.
 *
 * Cada falso positivo le pide a Sergio Urcullo una firma por un cambio que no mueve un
 * centavo, y esa es la unica firma que importa: gastarla en falsos la vuelve automatica.
 */
const cantidadesYTexto = `${tabla(320, "390")}
export const PLANES = [
  { id: "basico", asientosExtra: 0 },
  { id: "pro", asientosExtra: null },
];
export function enMayuscula(frase) {
  return \`\${frase.charAt(0).toUpperCase()}\${frase.slice(1)}.\`;
}
export function primero(nombres) {
  return nombres[0];
}
`;

test("una CANTIDAD asignada a 0 —personas, no plata— publica sola", () => {
  const dir = repoSembrado();
  try {
    const sha = commitear(dir, cantidadesYTexto, "cuantas personas extra vende cada plan");
    const r = preguntar(dir, sha);
    assert.equal(
      r.codigo,
      0,
      "conto `asientosExtra: 0` (personas) y las posiciones de un helper de texto como montos " +
        "nuevos: con eso el destino entero se detiene y se le pide a Sergio Urcullo una firma por " +
        "un cambio que no mueve un centavo. Salida: " + r.salida,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

/**
 * La direccion del dano NO es simetrica y por eso este caso es el que sostiene al de
 * arriba: detener de mas cuesta una firma; dejar pasar de menos publica un precio nuevo
 * sin que nadie lo decida. Por eso la excusa se ancla a un vocabulario de CANTIDAD y
 * todo lo demas sigue deteniendo — una clave que el guion no sabe nombrar falla CERRADO.
 */
test("una clave que el guion NO sabe nombrar, asignada a 0, sigue deteniendo", () => {
  const dir = repoSembrado();
  try {
    const sha = commitear(
      dir,
      `${tabla(320, "390")}\nexport const EXTRA = { recargoNocturno: 0 };\n`,
      "clave desconocida a cero",
    );
    const r = preguntar(dir, sha);
    assert.equal(
      r.codigo,
      1,
      "una clave desconocida asignada a 0 se publico sola: la excusa por CAMPO falla ABIERTO, " +
        "que es el lado caro — un add-on que pasa a gratis entra sin firma. Salida: " + r.salida,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("un monto de plata asignado a 0 sigue deteniendo aunque la cura mire la clave", () => {
  const dir = repoSembrado();
  try {
    const sha = commitear(
      dir,
      `${tabla(320, "390")}\nexport const ADDONS = { mensualAddon: 0 };\n`,
      "el addon pasa a gratis",
    );
    const r = preguntar(dir, sha);
    assert.equal(r.codigo, 1, "`mensualAddon: 0` es plata: cobrar 0 es una decision de plata. Salida: " + r.salida);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

/**
 * La mitad que sostiene la excusa por CAMPO: una clave puede decir CANTIDAD y PLATA a
 * la vez. `precioPorUsuario` nombra «usuario», asi que entra al vocabulario de
 * cantidad — y es un precio. Sin esta segunda pregunta, la cura del falso positivo
 * abriria la puerta que el freno existe para cerrar.
 */
test("una clave que dice cantidad Y plata a la vez detiene: manda la plata", () => {
  const dir = repoSembrado();
  try {
    const sha = commitear(
      dir,
      `${tabla(320, "390")}\nexport const EXTRA = { precioPorUsuario: 0 };\n`,
      "el usuario extra pasa a gratis",
    );
    const r = preguntar(dir, sha);
    assert.equal(
      r.codigo,
      1,
      "`precioPorUsuario: 0` se publico solo por nombrar «usuario»: un precio que pasa a cero " +
        "entro sin firma. Salida: " + r.salida,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// ---------------------------------------------------------------------------
// El bot: un destino SIN medidor por commits
//
// Su publicador no lista shas, lista archivos, y hasta el 2026-09-19 esa salida
// se le pasaba CRUDA a la guarda como si fuera una lista de nombres. Dos danos,
// y el segundo es el caro: el sujeto que se media terminaba siendo la palabra
// `CAMBIA`, asi que TODO toque a `knowledge.onia.json` —la fuente de precio que
// el bot cotiza— caia en NO MEDIDO y detenia el lote entero, para siempre.
//
// Medido ese dia: el arreglo que le sacaba un cobro inventado de Bs 390/mes al
// plan mas caro no mueve UN SOLO monto (320/550/890/1.290/390 identicos a los
// dos lados; lo que cambia es a quienes alcanza la frase) y aun asi retuvo 13
// archivos del bot, entre ellos el respaldo que hace que vuelvan a entenderse
// las notas de voz — pidiendole a Sergio Urcullo una firma por cero centavos.
// ---------------------------------------------------------------------------

const DRY_RUN_DEL_BOT = `   destino: /opt/onia/bot
   modo:   DRY-RUN (agrega --aplicar para desplegar de verdad)

-- diferencias repo -> produccion
   CAMBIA   bot-engine.mjs  (34 lineas)
   NUEVO    lo-que-el-bot-no-puede-leer-va-a-un-humano.test.mjs
   CAMBIA   knowledge.onia.json  (2 lineas)
   total: 3 archivo(s)`;

test("del renglon del publicador se saca el ARCHIVO, no la linea entera", () => {
  const r = spawnSync("bash", [GUION, "--nombres"], {
    input: DRY_RUN_DEL_BOT,
    encoding: "utf8",
    timeout: 60_000,
  });
  const nombres = (r.stdout ?? "").trim().split("\n").filter(Boolean);
  assert.deepEqual(nombres, [
    "bot-engine.mjs",
    "lo-que-el-bot-no-puede-leer-va-a-un-humano.test.mjs",
    "knowledge.onia.json",
  ], "los nombres salen mal. Salida: " + (r.stdout ?? "") + (r.stderr ?? ""));
  // La mitad que importa: ninguna palabra del adorno puede colarse como sujeto.
  for (const ruido of ["CAMBIA", "NUEVO", "(2", "lineas)", "total:"]) {
    assert.ok(
      !nombres.includes(ruido),
      `\`${ruido}\` entro como si fuera un archivo: es lo que hacia que el sujeto ` +
        "medido fuera una palabra del renglon y el bot cayera en NO MEDIDO siempre",
    );
  }
});

/** Las dos copias de un archivo del bot: la viva y la del repo. */
function dosCopias(enProduccion, enElRepo) {
  const prod = mkdtempSync(join(tmpdir(), "bot-prod-"));
  const repo = mkdtempSync(join(tmpdir(), "bot-repo-"));
  if (enProduccion !== null) writeFileSync(join(prod, "knowledge.onia.json"), enProduccion);
  if (enElRepo !== null) writeFileSync(join(repo, "knowledge.onia.json"), enElRepo);
  return { prod, repo };
}

const copias = (prod, repo) => {
  const r = spawnSync("bash", [GUION, "--montos-copias", prod, repo, "knowledge.onia.json"], {
    encoding: "utf8",
    timeout: 60_000,
  });
  return { codigo: r.status, salida: `${r.stdout ?? ""}${r.stderr ?? ""}`.trim() };
};

// El caso REAL del 2026-09-19, palabra por palabra: los cinco montos se repiten
// a los dos lados y lo unico que cambia es a quienes alcanza la frase.
const COTIZACION = (aQuienes) =>
  `{"faq":[{"id":"precios","body":"el sistema arranca en Bs 320 al mes con el plan Basico, ` +
  `Bs 550 el Crece, Bs 890 el Profesional y Bs 1.290 el Completo, que ya trae el chatbot ` +
  `adentro. En ${aQuienes} el chatbot va aparte, Bs 390 al mes."}]}\n`;

test("el bot publica solo cuando NINGUN monto cambia, aunque el texto cambie", () => {
  const { prod, repo } = dosCopias(
    COTIZACION("los otros planes"),
    COTIZACION("el Basico, el Crece y el Profesional"),
  );
  try {
    const r = copias(prod, repo);
    assert.equal(
      r.codigo,
      0,
      "detuvo un arreglo que no mueve un centavo: los cinco montos son identicos a los " +
        "dos lados y solo cambia a quienes alcanza la frase. Salida: " + r.salida,
    );
  } finally {
    rmSync(prod, { recursive: true, force: true });
    rmSync(repo, { recursive: true, force: true });
  }
});

test("un monto distinto entre las dos copias SI detiene, y dice cual", () => {
  const { prod, repo } = dosCopias(
    COTIZACION("los otros planes"),
    COTIZACION("los otros planes").replace("Bs 390", "Bs 420"),
  );
  try {
    const r = copias(prod, repo);
    assert.equal(r.codigo, 1, "un precio nuevo del bot entro sin firma. Salida: " + r.salida);
    assert.match(
      r.salida,
      /420/,
      "detuvo, pero no nombra el numero que cambia: un veredicto sin cita no se puede " +
        "refutar. Salida: " + r.salida,
    );
  } finally {
    rmSync(prod, { recursive: true, force: true });
    rmSync(repo, { recursive: true, force: true });
  }
});

test("si el archivo no esta en el repo sigue siendo NO MEDIDO: falla CERRADO", () => {
  const { prod, repo } = dosCopias(COTIZACION("los otros planes"), null);
  try {
    const r = copias(prod, repo);
    assert.equal(
      r.codigo,
      2,
      "sin poder mirar el repo dijo algo distinto de NO MEDIDO. Poder medir el caso " +
        "normal no vuelve honesto decir 'limpio' cuando no se miro. Salida: " + r.salida,
    );
  } finally {
    rmSync(prod, { recursive: true, force: true });
    rmSync(repo, { recursive: true, force: true });
  }
});

// ---------------------------------------------------------------------------
// UN ARCHIVO QUE NO VIAJA A UN DESTINO NO PUEDE PUBLICARLE UN PRECIO.
//
// Medido el 2026-09-19 (tarea t_beb73a77) con `3ed8fdaa` esperando en su rama:
// `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` entraba al freno con `+500` y
// `+200` —el cupo de conversaciones del add-on, escrito en PROSA markdown— y
// detenia la landing. Pero la landing se arma con `git archive origin/main
// web-factory/apps web-factory/packages ...`: ese archivo no esta en ningun
// subarbol que viaje, asi que ningun numero suyo le llega a un cliente por ahi.
// Una firma pedida por un archivo que el destino no publica es una firma falsa,
// y gastarlas vuelve automatica la unica firma que importa (t_189a6037).
//
// Las dos direcciones, que es lo unico que hace util a este gate:
//   · aflojar de mas — la fuente de precio que SI viaja tiene que seguir
//     deteniendo, y las tres formas de "no se" tienen que seguir deteniendo;
//   · apretar de mas — lo que el destino no publica no cuesta una firma.
const armadorSembrado = (cuerpo) => {
  const dir = mkdtempSync(join(tmpdir(), "onia-armador-"));
  const f = join(dir, "build-and-stage.sh");
  writeFileSync(f, cuerpo);
  return { dir, f };
};

/** Le pregunta al guion REAL si ese archivo viaja a ese destino. */
function viaja(armador, archivo) {
  const r = spawnSync("bash", [GUION, "--viaja", armador, archivo], {
    encoding: "utf8",
    timeout: 60_000,
  });
  return { codigo: r.status, salida: `${r.stdout ?? ""}${r.stderr ?? ""}`.trim() };
}

/** Un armador como el de la landing: archiva unos pocos subarboles. */
const ARMA_SUBARBOLES = `#!/usr/bin/env bash
set -uo pipefail
[ -d "$REPO" ] || { echo "ERR"; exit 2; }
  git -C "$REPO" archive --format=tar "$REF" \\
    web-factory/apps web-factory/packages web-factory/package.json \\
    | gzip > "$TARBALL.new" && mv -f "$TARBALL.new" "$TARBALL"
`;

/** Un armador como el de la plataforma: archiva el repo entero, sin rutas. */
const ARMA_TODO = `#!/usr/bin/env bash
git -C "$REPO" archive --format=tar "$SHA" | tar -x -C "$D" || { echo "FATAL: git archive fallo"; exit 1; }
`;

test("lo que el destino NO publica no le cuesta una firma a nadie", () => {
  const { dir, f } = armadorSembrado(ARMA_SUBARBOLES);
  try {
    const r = viaja(f, "hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md");
    assert.equal(
      r.codigo,
      1,
      "un archivo que ese destino no archiva sigue deteniendolo: es una firma " +
        "falsa, y gastarlas vuelve automatica la que importa. Salida: " + r.salida,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("la fuente de precio que SI viaja sigue deteniendo", () => {
  const { dir, f } = armadorSembrado(ARMA_SUBARBOLES);
  try {
    const r = viaja(f, "web-factory/apps/onia-platform/src/lib/pricing.ts");
    assert.equal(
      r.codigo,
      0,
      "el pricing.ts que el sitio SI publica dejo de detener: por ahi entra un " +
        "precio que nadie firmo. Salida: " + r.salida,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("un armador SIN rutas archiva el repo entero, y entonces todo viaja", () => {
  const { dir, f } = armadorSembrado(ARMA_TODO);
  try {
    const r = viaja(f, "lib/subscription-plans.ts");
    assert.equal(
      r.codigo,
      0,
      "el destino archiva el repo entero y aun asi dijo que su fuente de precio " +
        "no viaja: eso publica un monto sin firma. Salida: " + r.salida,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// Este caso ancla un bug REAL que paso verde en las dos primeras escrituras de la
// cura: `sub(/^.*archive/,"")` es GOLOSO y se quedaba con la SEGUNDA aparicion de
// la palabra —la del mensaje de error del `||`—, devolviendo `fallo";` como si
// fuera un subarbol publicado. Con eso el armador de la plataforma contestaba "no
// viaja" para `lib/subscription-plans.ts`: fallaba ABIERTO, que es el lado caro.
test("el mensaje de error de un `||` no se confunde con un subarbol publicado", () => {
  const { dir, f } = armadorSembrado(ARMA_TODO);
  try {
    const r = viaja(f, "fallo");
    assert.equal(
      r.codigo,
      0,
      "leyo el `git archive` del mensaje de error en vez del de verdad. Con eso " +
        "las rutas publicadas salen mal y una fuente de precio deja de detener. " +
        "Salida: " + r.salida,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// Y este ancla el segundo: con el corte del cano guardado como estado que se
// ACUMULA, el `||` de cualquier renglon anterior del armador lo dejaba prendido
// y el parseo salia en el primer renglon, devolviendo la lista VACIA — que el
// guion lee como "archiva el repo entero", o sea el freno volvia a detener por
// archivos que el destino no publica. Se ve con un armador que tenga un `||`
// ARRIBA del `git archive`, que es lo normal.
test("un `||` en un renglon ANTERIOR no deja el parseo sin subarboles", () => {
  const { dir, f } = armadorSembrado(ARMA_SUBARBOLES);
  try {
    assert.equal(
      viaja(f, "hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md").codigo,
      1,
      "devolvio la lista de subarboles vacia: perdio las rutas del `git archive` " +
        "por culpa de un `||` de mas arriba, y entonces no filtra nada.",
    );
    assert.equal(
      viaja(f, "web-factory/packages/ui/precio.ts").codigo,
      0,
      "perdio un subarbol que el destino SI publica.",
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("una lista de subarboles armada con variables no se adivina: todo viaja", () => {
  const { dir, f } = armadorSembrado(`#!/usr/bin/env bash
git -C "$REPO" archive --format=tar "$REF" web-factory/apps $EXTRA | gzip > "$T"
`);
  try {
    const r = viaja(f, "hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md");
    assert.equal(
      r.codigo,
      0,
      "la lista se arma con una variable que aca no se puede resolver y aun asi " +
        "dijo que no viaja. No se puede saber: se detiene. Salida: " + r.salida,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("si no se puede leer el armador, todo viaja: falla CERRADO", () => {
  const r = viaja(join(tmpdir(), "no-existe-onia", "build-and-stage.sh"), "lib/pricing.ts");
  assert.equal(
    r.codigo,
    0,
    "sin poder mirar que publica el destino contesto 'no viaja'. No haber podido " +
      "mirar nunca es permiso para publicar. Salida: " + r.salida,
  );
});
