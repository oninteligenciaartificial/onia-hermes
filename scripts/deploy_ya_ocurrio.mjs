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
// El motor del bot tiene su propio instrumento: se IMPORTA, no se re-implementa.
import { medirVivo as medirMotor, sujetosDelRepo as sujetosDelMotor, veredicto as veredictoDelMotor } from "./bot_vivo_tiene_el_codigo.mjs";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
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
 * La marca que deja `--corregir`, y que EXIME a la línea de volver a ser acusada.
 *
 * Sin ella el arreglo no cierra nada: la línea sigue diciendo «NO desplegado» —y tiene que
 * seguir diciéndolo, porque esa era la verdad el día que se escribió— así que `PIDE_DEPLOY`
 * la vuelve a encontrar en la corrida siguiente y el conteo no baja nunca. La marca es lo que
 * hace que corregir sea IDEMPOTENTE en vez de un bucle.
 */
export const MARCA = /✅ YA DESPLEGADO \(medido /;

/**
 * La medición va en su PROPIA línea, debajo de la que caducó. NO reescribe lo que decía: la
 * historia del ítem es cierta, lo que caducó es su estado — borrarla dejaría al próximo sin
 * saber qué se creía.
 *
 * ⚠️ Y no se anexa al final del renglón, que fue el primer intento y estaba mal: estas colas
 * vienen envueltas a ~100 columnas, así que la mayoría de las líneas acusadas son la MITAD de
 * una oración. Pegar ahí la marca produce «…falta merge de `onia-cola` y deploy del ✅ YA
 * DESPLEGADO (…)» y la frase sigue en el renglón siguiente: corregir el estado a costa de
 * romper la prosa deja al ítem ilegible, que es otra forma de perder la información.
 */
export function lineaDeMarca(lineaOriginal, { vivos, desplegado, fecha }) {
  const l = String(lineaOriginal);
  // ⚠️ La sangría no es cosmética: en este formato el cuerpo de un ítem son las líneas que
  // arrancan con seis espacios, y la primera que no lo hace lo TERMINA. Una marca en columna 0
  // debajo de un `- [x] …` parte el ítem en dos y le deja el cuerpo huérfano — medido el
  // 2026-09-25: `verificar_cola.js` pasó a acusar «no nombra ninguna ruta entre backticks» a
  // dos ítems que sí la nombraban. Cuando la línea acusada ES la cabecera, la marca va con la
  // sangría del cuerpo, no con la de ella.
  const sangria = /^- \[[ x]\] /.test(l) ? "      " : (/^(\s*)/.exec(l)?.[1] ?? "");
  const shas = [...new Set(vivos ?? [])].map((s) => `\`${s}\``).join(" ");
  // El motor no se mide por sha: su marca nombra el instrumento que la emitió, para que quien la
  // lea pueda re-derivarla. Sin esta rama la marca del bot salía «: vive en produccion ``».
  if (!shas) return `${sangria}✅ YA DESPLEGADO (medido ${fecha}: \`npm run bot:vivo-al-dia\` — el motor vivo ya corre este archivo).`;
  return `${sangria}✅ YA DESPLEGADO (medido ${fecha}: ${shas} vive en produccion \`${desplegado}\`).`;
}

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

/**
 * Quita el texto TACHADO (`~~…~~`), que en estas colas significa «esto ya no es cierto».
 *
 * `chatbot.md:5011` decía `~~falta el deploy~~ CUMPLIDO Y VIVO` y el gate la acusaba igual, o sea
 * nombraba como trabajo pendiente justo la línea donde el autor había escrito que ya está vivo.
 *
 * ⚠️ Sólo pares COMPLETOS dentro de la misma línea, y por eso `[^~]*` y no `[\s\S]*?`: en 3492 y
 * 3623 el tachado abre en el título y cierra renglones más abajo, en la MISMA línea que el
 * «Commiteado, NO desplegado» que sí está vigente. Un `~~` suelto no borra nada: si esto se
 * tragara la línea entera, esas dos quedarían absueltas y el gate fallaría abierto.
 */
export function sinTachado(linea) {
  return String(linea ?? "").replace(/~~[^~]*~~/g, " ");
}

// ---------------------------------------------------------------------------
// La decisión — pura, sin sistema. Es lo que prueba `--self-check`.
// ---------------------------------------------------------------------------

/** Huellas del deploy del MOTOR. `/opt/onia/bot` es rsync, no un checkout: otra frontera. */
export const HUELLA_BOT = /\/opt\/onia\/bot|\/tmp\/onia-bot|deploy-bot\.sh|DESPLEGAR:\s*bot|vps-ops\/bot|webhook-server\.sh/i;
/** Huellas del deploy del PANEL — el único que este gate sabe medir. */
export const HUELLA_PLATAFORMA = /onia-platform|app\.onia\.com\.bo|DESPLEGAR:\s*plataforma|(?:publique|swap|deploy)\s+(?:de\s+)?`?plataforma/i;

/**
 * A qué deploy se refiere una afirmación: `"bot"`, `"plataforma"` o `"sin ubicar"`.
 *
 * POR QUÉ EXISTE (medido el 2026-09-25, corriendo el gate en vivo): de las 58 afirmaciones que
 * este archivo encuentra, 36 salían con el motivo `la linea no cita sha`, y el veredicto le
 * explicaba al que viene después que *«al ítem le falta su commit, y sin eso nadie puede
 * corregirlo nunca»*. Mirados los 36 sujetos uno por uno, **la enorme mayoría son del MOTOR**
 * («el bot vivo corre desde `/tmp/onia-bot/`», «`/opt/onia/bot` es rsync, no git»). Agregarles
 * el sha —que es lo que el remedio pedía— no los habría hecho medibles ni por un renglón: este
 * gate sólo resuelve shas de `onia-platform`, así que los 30 y pico habrían pasado de
 * `la linea no cita sha` a `ningun sha es de onia-platform` y el `2` seguiría igual.
 *
 * Un instrumento que nombra un remedio que no cambia su propia medición manda a trabajo
 * inútil, y encima ENTIERRA el sujeto que sí es corregible entre 30 que no lo son. La frontera
 * no cambia ningún veredicto —una no medida sigue siendo no medida— cambia a quién se le pide
 * qué, que es lo único que ese texto tenía que hacer.
 *
 * Se mira la LÍNEA primero y el cuerpo del ítem después: casi todas lo dicen por sí mismas, y
 * un ítem largo puede nombrar los dos deploys mientras la frase acusada habla de uno solo.
 */
export function fronteraDe(linea, cuerpo = "") {
  /** Cuántas huellas DISTINTAS de esa frontera hay. Distintas y no totales: repetir `/tmp/onia-bot`
   *  seis veces es una sola evidencia dicha seis veces, y contarla seis ganaría cualquier empate. */
  const cuantas = (re, t) => new Set([...t.matchAll(new RegExp(re.source, "gi"))].map((m) => m[0].toLowerCase())).size;
  for (const texto of [linea, cuerpo]) {
    // `http://onia-platform:3000/…` es el BOT llamando al panel por la red de Docker, no el
    // deploy del panel: contarlo como huella mandaba ítems del motor a pedir un commit que en
    // onia-platform no existe, y un sha imposible los deja incorregibles para siempre.
    const t = String(texto ?? "").replace(/\bhttps?:\/\/onia-platform[^\s'"`)]*/gi, "");
    const bot = cuantas(HUELLA_BOT, t);
    const plataforma = cuantas(HUELLA_PLATAFORMA, t);
    if (bot && !plataforma) return "bot";
    if (plataforma && !bot) return "plataforma";
    // Las dos nombradas: decide sólo una MAYORÍA CLARA (el doble o más). Medido el 2026-09-26,
    // cuatro líneas del motor de `chatbot.md` traían 3-5 huellas del bot y UNA de `onia-platform`
    // —la mención al pasar que tiene cualquier ítem largo— y salían `sin ubicar`, que es la pila
    // que nadie vacía. El umbral es conservador porque el error caro es el otro: mandar una línea
    // del panel a la frontera del motor la saca del juicio por sha, el único que caza mentiras.
    // El `> 0` no es redundante: sin él `0 >= 0 * 2` es cierto y una línea SIN NINGUNA huella
    // volvería "bot" — el gate adivinando en el caso en que menos sabe, que es el fallo abierto
    // que este bloque existe para no cometer.
    if (bot > 0 && bot >= plataforma * 2) return "bot";
    if (plataforma > 0 && plataforma >= bot * 2) return "plataforma";
  }
  return "sin ubicar";
}

/**
 * Por qué no se pudo juzgar una afirmación — y, sobre todo, QUÉ haría falta para poder.
 * Es el texto que decide si el que lee se pone a trabajar en algo que sirve.
 */
/**
 * EL JUEZ DEL MOTOR — la mitad de este gate que faltaba, y que lo dejaba en un `2` permanente.
 *
 * Medido el 2026-09-25 20:40 La Paz: de 58 líneas que piden deploy, **51 son del motor** y las
 * 51 salían NO MEDIDAS *«otra frontera — este gate no las mide»*. Cierto como límite y falso
 * como conclusión: la frontera del motor SÍ tiene instrumento —`bot_vivo_tiene_el_codigo.mjs`,
 * que compara archivo por archivo el repo contra `/tmp/onia-bot`— y su propia cabecera nombra a
 * este gate como ciego. O sea que el dato existía y nadie lo cruzaba. Con 51 de 58 sin juzgar,
 * el exit 2 sale todas las vueltas, y un `2` permanente se lee como «el ambiental de siempre».
 *
 * El caso que lo vuelve caro: el ítem del 25-sep decía *«el bot vivo sirve horarios del pasado
 * … lo único que falta es publicar»*, y ese deploy ocurrió a las 18:44 UTC (`anticipacion:viva`
 * → `ok`, corte vivo). Una línea así leída como presente manda a re-arreglar lo que ya anda.
 *
 * Cómo juzga, y por qué NO razona por sha: el motor no se despliega por commits, se rsyncea, así
 * que su unidad es el ARCHIVO. Un ítem del bot nombra los archivos que tocó —lo exige
 * `verificar_cola.js`— y el instrumento vivo dice cuáles están desfasados HOY:
 *
 *   · el motor entero al día        → la línea MIENTE (no queda nada por publicar)
 *   · nombra un archivo desfasado   → la línea es CIERTA para ese archivo, no se toca
 *   · nombra archivos, ninguno de ellos desfasado → MIENTE
 *   · no nombra ningún archivo      → NO MEDIDA: «hay que leerla» (no se acusa a ciegas)
 *   · el motor no se pudo medir     → NO MEDIDA, nunca verde
 *
 * @param {{frase?:string, cuerpo?:string}} afirmacion
 * @param {{medido:boolean, desfasados:string[]}|null} motor
 * @param {string[]} sujetos  los archivos que el deploy del bot instala (derivados del repo)
 */
export function juezDelMotor({ frase = "", cuerpo = "" } = {}, motor, sujetos = []) {
  if (!motor || motor.medido !== true) {
    return { estado: "no-medida", motivo: "es del bot y el motor vivo no se pudo medir" };
  }
  const desfasados = motor.desfasados ?? [];
  // `nombrados` se calcula ANTES del atajo de «entero al día»: con el motor entero publicado la
  // acusación es igual de cierta, y quien juzga desde `sin ubicar` necesita saber QUÉ archivos
  // nombró para poder exigir que sean exclusivos del motor. Sin esto, salir por el atajo dejaba
  // sin juzgar justo a las líneas que nombran su archivo — las únicas ubicables sin adivinar.
  const texto = `${frase}\n${cuerpo}`;
  const nombrados = (sujetos ?? []).filter((nombre) => texto.includes(nombre));
  if (desfasados.length === 0) {
    return { estado: "miente", motivo: "el motor vivo esta ENTERO al dia", nombrados };
  }
  const pendientes = nombrados.filter((nombre) => desfasados.includes(nombre));
  if (pendientes.length) return { estado: "honesta", faltan: pendientes, nombrados };
  if (nombrados.length) return { estado: "miente", motivo: `nombra ${nombrados.length} archivo(s) del motor y ninguno esta desfasado`, nombrados };
  return { estado: "no-medida", motivo: `es del bot, no nombra ningun archivo del motor y quedan ${desfasados.length} sin publicar: hay que leerla` };
}

/**
 * Los nombres de archivo del motor que NO existen en `onia-platform` — o sea, los que al
 * aparecer en una línea la ubican sin lugar a duda.
 *
 * Se resta por NOMBRE CON EXTENSIÓN, que es la unidad real: `config.mjs` (motor) y `config.ts`
 * (panel) son dos archivos distintos, y confundirlos era lo que dejaba a la clase entera sin
 * juzgar. Medido el 2026-09-26: de los 74 sujetos del motor, los 74 resultan exclusivos.
 *
 * @param {string[]} sujetos          nombres base de los archivos del motor
 * @param {string[]|null} delPanel    nombres base de `onia-platform`, o `null` si no se pudo leer
 * @returns {string[]|null} los exclusivos, o `null` si no se pudo derivar (no se acusa a nadie)
 */
export function exclusivosDelMotor(sujetos, delPanel, todoOniaHermes = null) {
  if (!delPanel) return null;
  const panel = new Set(delPanel);
  // Y la ambigüedad DENTRO de onia-hermes, que es la que casi metió el falso positivo: medido el
  // 2026-09-26 en vivo, las dos líneas del SIAT (`plataforma-v1.md:6131` y `6160`) salieron
  // acusadas por nombrar `publicar.sh` — que es sujeto del motor y ADEMÁS el nombre del
  // publicador del SIAT, de la landing y del panel: hay cuatro en el repo. Un basename repetido
  // no ubica nada, y acusar con él manda el trabajo a un dueño que no es el suyo, que es
  // justamente lo que la frontera existe para no hacer. Se cuenta, no se enumera a mano.
  const repetidos = new Set();
  if (todoOniaHermes) {
    const veces = new Map();
    for (const n of todoOniaHermes) veces.set(n, (veces.get(n) ?? 0) + 1);
    for (const [n, c] of veces) if (c > 1) repetidos.add(n);
  }
  return (sujetos ?? []).filter((n) => !panel.has(n) && !repetidos.has(n));
}

/**
 * Los nombres base que publica `onia-platform`, leídos de su ref y no del working tree.
 *
 * `null` si no se puede preguntar —el clon no está, no hay ref, no hay red—: "no pude preguntar"
 * no es "me dijeron que no", y con `null` este gate vuelve al comportamiento de antes (absuelve,
 * nunca acusa) en vez de acusar por no haber podido mirar.
 */
export function basenamesDe(repo, ref) {
  try {
    return execFileSync("git", ["ls-tree", "-r", "--name-only", ref], {
      cwd: repo,
      encoding: "utf8",
      timeout: 120_000,
      maxBuffer: 1 << 26,
    })
      .split("\n")
      .map((p) => p.trim().split("/").pop())
      .filter(Boolean);
  } catch {
    return null;
  }
}

export function nombresDelPanel(repo = REPO_PLATAFORMA) {
  try {
    execFileSync("git", ["fetch", "origin", "--quiet"], { cwd: repo, timeout: 120_000, stdio: "ignore" });
  } catch {
    // Un fetch que falla no invalida el ref de disco: se sigue con lo que haya, y si no hay, el
    // `ls-tree` de abajo tira y el tri-estado sale `null`.
  }
  return basenamesDe(repo, "origin/master");
}

export function motivoDeNoMedida({ shas = [], frontera = "sin ubicar" } = {}) {
  // Primero la frontera: a una línea del motor, citar un sha no la vuelve medible. Decirle
  // «te falta el commit» es mandarla a un trabajo que deja el gate exactamente igual.
  if (frontera === "bot") return "es del bot: otra frontera — citar un sha NO la haria medible";
  // Y la frontera manda TAMBIÉN cuando hay sha. Tener un sha que este gate no puede resolver no
  // dice de qué deploy habla la línea: `onia-hermes` es el repo del motor, pero también el de las
  // colas y el del SIAT. Atribuirle el motor por descarte es una conjetura, y medido el 2026-09-26
  // las 7 líneas que salían así tenían `sin ubicar` — una era del SIAT. Se dice lo que se sabe.
  if (shas.length) return frontera === "plataforma" ? "ningun sha es de onia-platform" : "cita un sha ajeno y no se pudo ubicar la frontera";
  if (frontera === "plataforma") return "la linea no cita sha";
  return "no cita sha y no se pudo ubicar la frontera";
}

/**
 * @param {Array<{archivo:string, linea:number, frase:string, shas:string[]}>} afirmaciones
 * @param {(sha:string)=>(boolean|null)} estaVivo  true = desplegado · false = no · null = no sé
 * @returns {{mienten:Array, noMedidas:Array, honestas:Array}}
 */
export function juzgar(afirmaciones, estaVivo, motor = null, sujetos = [], exclusivos = null) {
  const mienten = [];
  const noMedidas = [];
  const honestas = [];
  for (const a of afirmaciones) {
    const veredictos = a.shas.map((s) => ({ sha: s, vivo: estaVivo(s) }));
    const juzgables = veredictos.filter((v) => v.vivo !== null);
    // Sin un solo sha juzgable no hay nada que afirmar POR SHA. Si la línea es del motor, su
    // frontera tiene su propio instrumento y se le pregunta a él: el sha nunca la iba a juzgar
    // (el bot se rsyncea, no se mergea) y por eso 51 de 58 salían NO MEDIDAS para siempre.
    if (juzgables.length === 0) {
      if (a.frontera === "bot") {
        const delMotor = juezDelMotor(a, motor, sujetos);
        if (delMotor.estado === "miente") mienten.push({ ...a, vivos: [], motor: true, porQue: delMotor.motivo });
        else if (delMotor.estado === "honesta") honestas.push({ ...a, faltan: delMotor.faltan, motor: true });
        else noMedidas.push({ ...a, motivo: delMotor.motivo });
        continue;
      }
      // Sin frontera ubicada queda una pregunta que SÍ se puede contestar sin adivinar: ¿la línea
      // nombra un archivo que el deploy del motor todavía no instaló? Si sí, el deploy que pide no
      // ocurrió para ese archivo y la línea es CIERTA por medición. Sólo absuelve: acusar desde
      // `sin ubicar` sacaría una línea del panel de su único juez —`config.mjs` vive en los dos
      // repos— y ése es el error caro que este gate cuida. Absolver de más no cuesta nada: la
      // línea se queda escrita como está.
      // `sin ubicar` y NADA más: a una línea ya ubicada en el panel, absolverla con el estado del
      // motor es un falso verde —la saca del recuento de no medidas sin haberla medido— y es la
      // clase que este archivo entero existe para no cometer.
      if (a.frontera === "sin ubicar") {
        const quizaDelMotor = juezDelMotor(a, motor, sujetos);
        if (quizaDelMotor.estado === "honesta") {
          honestas.push({ ...a, faltan: quizaDelMotor.faltan, motor: true });
          continue;
        }
        // Y se ACUSA cuando el nombre no deja duda: el juez nombró archivos del motor, todos ya
        // publicados, y todos EXCLUSIVOS del motor (no existen en `onia-platform`). Las tres
        // condiciones juntas — sin `nombrados` sería adivinar desde «el motor está entero al día»,
        // y con un nombre compartido podría ser una línea del panel, que es el error caro.
        const nombrados = quizaDelMotor.nombrados ?? [];
        const soloDelMotor = exclusivos && nombrados.length && nombrados.every((n) => exclusivos.includes(n));
        if (quizaDelMotor.estado === "miente" && soloDelMotor) {
          mienten.push({
            ...a,
            vivos: [],
            motor: true,
            porQue: `nombra ${nombrados.length} archivo(s) exclusivos del motor (${nombrados.join(" ")}) y ninguno esta desfasado`,
          });
          continue;
        }
      }
      noMedidas.push({ ...a, motivo: motivoDeNoMedida(a) });
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
 * El veredicto de la corrida: qué exit code y qué frase le corresponden a un recuento.
 *
 * Vive aparte de `medir()` a propósito — estaba embebido ahí y por eso `--self-check` no podía
 * probarlo, que es como sobrevivió el falso verde medido el 2026-09-25: con **58 de 58 líneas
 * NO MEDIDAS** esto imprimía «OK — ninguna linea pide un deploy que ya ocurrio» y salía `0`.
 * Para quien lee el exit, «ninguna miente» y «no pude juzgar a ninguna» son la misma cara, y
 * esta herramienta existe justamente porque 20 líneas caducadas sobrevivieron leídas así.
 * Lo dice `medir()` treinta líneas más abajo, sobre su otra precondición: no medir NO es estar
 * bien. Faltaba aplicarlo al agregado.
 *
 * @param {{mienten:Array, honestas:Array, noMedidas:Array}} recuento
 * @returns {{codigo:number, mensaje:string}}
 */
/**
 * El desglose de las no medidas: cuántas son del MOTOR (para las que este gate no es el
 * instrumento) y cuántas son el sujeto realmente corregible — una línea del panel sin su
 * commit. Antes las 58 salían bajo un solo remedio, «al ítem le falta su commit», y mandaba a
 * ponerle sha a 30 y pico de líneas del bot sin mover el veredicto ni un renglón.
 */
export function porFrontera(noMedidas) {
  const cuenta = (m) => noMedidas.filter((n) => n.motivo === m).length;
  const bot = cuenta("es del bot: otra frontera — citar un sha NO la haria medible");
  const sinSha = cuenta("la linea no cita sha");
  const shaAjeno = cuenta("ningun sha es de onia-platform");
  const shaAjenoSinUbicar = cuenta("cita un sha ajeno y no se pudo ubicar la frontera");
  const sinUbicar = cuenta("no cita sha y no se pudo ubicar la frontera") + shaAjenoSinUbicar;
  const partes = [];
  if (bot) partes.push(`  ${bot} son del MOTOR (/opt/onia/bot): otra frontera — este gate no las mide, y citarles un sha tampoco.`);
  if (shaAjeno) partes.push(`  ${shaAjeno} piden el deploy del PANEL y su sha no esta en onia-platform: sin el suyo nadie las puede juzgar.`);
  if (sinUbicar) partes.push(`  ${sinUbicar} no se pudo ubicar su frontera (${shaAjenoSinUbicar} con sha ajeno): hay que leerlas.`);
  partes.push(
    sinSha
      ? `  ${sinSha} son EL SUJETO: piden el deploy del panel y no citan su commit. Sin sha nadie las puede corregir nunca.`
      : "  0 son el sujeto corregible: ninguna linea del panel se quedo sin su commit.",
  );
  // Y AHORA se las ubica. Contar sin nombrar obliga a re-derivar los sujetos a mano en cada
  // vuelta —la cola mandaba a «correr el comando y leer el desglose», y el desglose no traía el
  // `archivo:línea`—, que es por qué estos cuatro sobrevivieron vueltas enteras. Sólo se listan
  // las ACCIONABLES: las del motor se cuentan arriba y no son trabajo de este gate; volcar sus
  // 45 renglones enterraría a los 4 sujetos, que es el modo de falla del 25-sep al revés.
  const accionables = noMedidas.filter(
    (n) =>
      n.motivo === "la linea no cita sha" ||
      n.motivo === "no cita sha y no se pudo ubicar la frontera" ||
      n.motivo === "cita un sha ajeno y no se pudo ubicar la frontera" ||
      n.motivo === "ningun sha es de onia-platform",
  );
  for (const n of accionables) {
    const que = n.motivo === "la linea no cita sha" ? "SUJETO" : "leer";
    partes.push(`    · ${n.archivo}:${n.linea} [${que}] ${String(n.frase ?? "").slice(0, 80)}`);
  }
  return partes.join("\n");
}

export function veredicto({ mienten, honestas, noMedidas }) {
  const juzgadas = mienten.length + honestas.length;
  if (mienten.length) return { codigo: MIENTEN, mensaje: "" };
  // Cero afirmaciones NO es un hueco: si ninguna cola pide un deploy, no hay nada que pueda
  // mentir. Distinguirlo importa — devolver NO MEDIDO acá dejaría el gate en un `2` permanente,
  // y un `2` que sale siempre se lee como «el ambiental de siempre» y se saltea.
  if (!juzgadas && !noMedidas.length) {
    return { codigo: SIN_MENTIRAS, mensaje: "\nOK — ninguna cola pide un deploy: no hay nada que pueda caducar." };
  }
  if (!juzgadas) {
    return {
      codigo: NO_PUDE_MEDIR,
      mensaje:
        `\nNO MEDIDO — las ${noMedidas.length} lineas piden un deploy y NINGUNA se pudo juzgar.\n` +
        "No absuelvo a nadie: sin un sha de la plataforma que resolver, este gate no sabe si\n" +
        `caducaron.\n${porFrontera(noMedidas)}`,
    };
  }
  // El desglose va también acá: en cuanto UNA línea se vuelve juzgable, el gate sale por esta
  // rama, y sin esto el sujeto corregible se volvería invisible detrás de un «OK» — que es
  // justo el modo de falla que este archivo entero existe para no repetir.
  return {
    codigo: SIN_MENTIRAS,
    mensaje:
      `\nOK — ninguna de las ${juzgadas} lineas juzgadas pide un deploy que ya ocurrio (${noMedidas.length} no medidas).` +
      (noMedidas.length ? `\n${porFrontera(noMedidas)}` : ""),
  };
}

/**
 * Saca de un markdown de cola las líneas que piden deploy, con los shas del ÍTEM al que
 * pertenecen (no los de la línea: casi ninguna los repite — el sha vive en la cabecera).
 */
export function afirmacionesDe(texto, archivo, esCommit = () => false) {
  const lineas = texto.split("\n");
  const items = [];
  let actual = null;
  for (let i = 0; i < lineas.length; i++) {
    const l = lineas[i];
    // Una cabecera de seccion abre su propio sujeto ADEMAS de cerrar el anterior. Hasta el
    // 2026-09-25 solo cerraba, y por eso tres rotulos («## ✅ T10 … commiteado, **NO
    // desplegado**: …» y sus hermanos T9 y T6) nunca entraron al juicio: el titulo es lo
    // primero que lee la vuelta siguiente, y es el que decide si el item cuenta por cerrado.
    if (/^- \[[ x]\] /.test(l) || /^#{2,3} /.test(l)) {
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
    // El filtro anti-números no puede ser por FORMA: `7756295` es un commit real de
    // onia-platform y era todo dígitos, así que su línea salía como «no cita sha» —el sujeto
    // incorregible— teniendo el commit escrito al lado. Pero soltar el filtro tampoco sirve:
    // estas colas citan RNDs (`102600000007`) y teléfonos. Decide el repo, no la pinta.
    const shas = [...new Set([...cuerpo.matchAll(SHA)].map((m) => m[1]))].filter((s) => !/^\d+$/.test(s) || esCommit(s));
    // Un ``` abre y cierra: lo de adentro es el comando que el ítem ENSEÑA a correr, no una
    // afirmación sobre producción. Acusarlo hace que `--corregir` le meta prosa a un bash.
    let enCodigo = false;
    for (const { n, texto: t } of it.lineas) {
      if (/^\s*```/.test(t)) {
        enCodigo = !enCodigo;
        continue;
      }
      if (enCodigo) continue;
      // Una línea ya corregida sigue diciendo «NO desplegado» a propósito (es su historia), y
      // la corrección vive en la línea de ABAJO. Sin esta salida se la vuelve a acusar en cada
      // corrida y el conteo no baja nunca: sería un bucle, no un arreglo.
      // La marca de una línea ya corregida vive al FINAL de su párrafo, no en el renglón de
      // abajo (la frase suele seguir ahí). Se busca con el mismo `finDeParrafo` que la escribe:
      // dos criterios distintos acá y allá re-acusan la línea en cada corrida, para siempre.
      if (MARCA.test(t) || MARCA.test(lineas[finDeParrafo(lineas, n - 1) + 1] ?? "")) continue;
      if (PIDE_DEPLOY.test(sinTachado(sinCitas(t))))
        // El `cuerpo` viaja con la afirmación porque el juez del MOTOR razona por archivo, no por
        // sha, y el archivo casi nunca está en el renglón acusado: está en el cuerpo del ítem.
        out.push({ archivo, linea: n, frase: t.trim().slice(0, 120), shas, frontera: fronteraDe(t, cuerpo), cuerpo });
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

/**
 * Aplica la marca a las líneas que mienten de UN texto. Pura: no toca disco.
 * `mentiras` son las de `juzgar(...).mienten` de ese archivo (número de línea 1-indexed).
 */
/**
 * ¿Esta línea continúa el párrafo de arriba? Sólo la sangría del cuerpo de un ítem cuenta: una
 * línea en blanco cierra, y un `- [ ]`, un `##`, un `---` o un ``` abren otra cosa — meter la
 * marca ahí la pegaría a una frase ajena, que es el bug que este corrector ya tenía al revés.
 */
export function esContinuacion(linea) {
  const l = String(linea ?? "");
  if (l.trim() === "") return false;
  if (/^\s*(- |\* |#{1,6} |---|```|\|)/.test(l)) return false;
  return /^\s{2,}\S/.test(l);
}

/**
 * Índice de la ÚLTIMA línea del párrafo que empieza en `i` — donde va la marca, y donde hay
 * que buscarla para no acusar dos veces. Vive acá, en una sola función, porque el corrector y
 * el acusador tienen que usar el MISMO criterio: si uno escribe la marca al final del párrafo
 * y el otro la busca sólo en el renglón de abajo, la línea se re-acusa para siempre y el
 * conteo no baja nunca. Una marca ya puesta corta el avance (es una línea sangrada más).
 *
 * @param {string[]} lineas  el archivo entero, 0-based
 * @param {number} i         índice de la línea acusada
 */
export function finDeParrafo(lineas, i) {
  let fin = i;
  while (fin + 1 < lineas.length && esContinuacion(lineas[fin + 1]) && !MARCA.test(lineas[fin + 1])) fin++;
  return fin;
}

export function corregirTexto(texto, mentiras, { desplegado, fecha }) {
  const lineas = String(texto).split("\n");
  // De ABAJO hacia arriba: cada inserción corre los números de línea de todo lo que sigue, así
  // que insertar en orden normal haría que la segunda marca caiga un renglón más abajo que su
  // dueña, la tercera dos, y el archivo terminaría con las marcas pegadas a frases ajenas.
  const orden = [...mentiras].sort((a, b) => b.linea - a.linea);
  for (const m of orden) {
    const i = m.linea - 1;
    if (i < 0 || i >= lineas.length) continue; // el archivo se movió debajo: no inventamos
    // La afirmación casi nunca termina donde termina su renglón: estas colas envuelven a ~100
    // columnas, así que «viaja con el» sigue abajo con «pedido de deploy». Insertar en i+1
    // partía la frase al medio y dejaba el párrafo ilegible aunque la marca fuera cierta.
    const fin = finDeParrafo(lineas, i);
    if (MARCA.test(lineas[i]) || MARCA.test(lineas[fin + 1] ?? "")) continue; // ya corregida
    lineas.splice(fin + 1, 0, lineaDeMarca(lineas[i], { vivos: m.vivos, desplegado, fecha }));
  }
  return lineas.join("\n");
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

  // --- El veredicto: lo que el que corre el gate lee como respuesta ---
  // Medido el 2026-09-25 en vivo: 58 afirmaciones, 58 NO MEDIDAS, y el gate igual imprimía
  // «OK — ninguna linea pide un deploy que ya ocurrio» con exit 0. Un instrumento que no pudo
  // juzgar a NADIE no puede absolver a nadie: eso es el falso verde que trae de vuelta las
  // líneas caducadas.
  const linea = (n) => ({ archivo: "a", linea: n, frase: "x", shas: [] });
  ok(
    "0 de N juzgadas -> NO MEDIDO, nunca OK",
    veredicto({ mienten: [], honestas: [], noMedidas: [linea(1), linea(2)] }).codigo === NO_PUDE_MEDIR,
  );
  ok(
    "y lo DICE: no puede imprimir OK",
    !/^\s*OK/m.test(veredicto({ mienten: [], honestas: [], noMedidas: [linea(1)] }).mensaje),
  );
  // Al revés: cero afirmaciones NO es un hueco. Si ninguna cola pide un deploy, no hay nada que
  // pueda mentir y el verde es honesto — tratarlo como NO MEDIDO dejaría el gate en un 2
  // permanente, que es como se aprende a saltearlo.
  ok("sin lineas que pidan deploy -> OK", veredicto({ mienten: [], honestas: [], noMedidas: [] }).codigo === SIN_MENTIRAS);
  // Un verde tiene que decir SOBRE CUÁNTAS lo dice, o vuelve a valer lo mismo medir 1 que 58.
  const verde = veredicto({ mienten: [], honestas: [linea(1), linea(2)], noMedidas: [linea(3)] });
  ok("el OK nombra cuantas juzgo", verde.codigo === SIN_MENTIRAS && /\b2\b/.test(verde.mensaje));
  ok("el OK nombra cuantas NO midio", /\b1\b/.test(verde.mensaje));
  // Y una que miente manda sobre cualquier recuento de no medidas.
  ok(
    "una que miente -> MIENTEN, aunque haya no medidas",
    veredicto({ mienten: [linea(1)], honestas: [], noMedidas: [linea(2), linea(3)] }).codigo === MIENTEN,
  );

  // --- Corregir: lo que convierte al gate en un arreglo y no en una queja recurrente ---
  const arg = { vivos: ["abc1234"], desplegado: "39234c89", fecha: "2026-09-25" };
  // Una línea PARTIDA a la mitad de la oración, que es la forma más común en estas colas:
  // vienen envueltas a ~100 columnas y la frase sigue en el renglón de abajo.
  const cruda = "      `lib/x.ts`, rama del carril, **falta merge de `onia-cola` y deploy del";
  const marca = lineaDeMarca(cruda, arg);

  ok("la marca lleva el sha vivo y el de produccion", marca.includes("abc1234") && marca.includes("39234c89"));
  ok("la marca lleva la fecha de la medicion", marca.includes("2026-09-25"));
  ok("la marca hereda la sangria del item", marca.startsWith("      ✅"));
  ok("la marca se reconoce a si misma", MARCA.test(marca));

  // El texto completo: la línea que caducó queda INTACTA y la medición va debajo.
  const md0 = ["- [x] **CERRADO (`abc1234`)**", cruda, "      panel, que es lo que faltaba."].join("\n");
  const corr = corregirTexto(md0, [{ linea: 2, vivos: ["abc1234"] }], arg);
  const filas = corr.split("\n");
  ok("no parte la frase: la linea original queda intacta", filas[1] === cruda);
  // Corregido el 2026-09-25: este caso EXIGÍA la marca en `filas[2]`, o sea entre «falta merge
  // y deploy del» y «panel, que es lo que faltaba» — el defecto medido al aplicar `--corregir`
  // de verdad. El párrafo entero queda junto y la medición va después de su última línea.
  ok("la medicion va en su propia linea, debajo del parrafo entero", filas[2].includes("panel") && MARCA.test(filas[3]));

  // La cabecera del ítem es el caso que rompe: una marca en columna 0 debajo de un `- [x] …`
  // corta el ítem y le deja el cuerpo huérfano para TODO gate que lo lea por sangría.
  const cabecera = "- [x] 🔴 **CERRADO el 2026-09-11 (`abc1234`, rama del carril — falta el merge del";
  const mdCab = [cabecera, "      integrador): `lib/x.ts`, probado en produccion.**"].join("\n");
  const corrCab = corregirTexto(mdCab, [{ linea: 1, vivos: ["abc1234"] }], arg);
  // Misma corrección: la cabecera sigue en el renglón de abajo («…falta el merge del /
  // integrador): `lib/x.ts`…»), así que la marca va después de ÉSE, no en el medio.
  ok("la marca bajo una cabecera lleva la sangria del cuerpo", corrCab.split("\n")[2].startsWith("      ✅"));
  ok("no corta el item: el cuerpo sigue siendo suyo", afirmacionesDe(corrCab, "x.md").length === 0);

  // Idempotencia — la propiedad que hace que el conteo baje en vez de repetirse para siempre.
  ok("una linea ya corregida no se vuelve a acusar", afirmacionesDe(corr, "x.md").length === 0);
  ok("corregir dos veces es corregir una vez", corregirTexto(corr, [{ linea: 2, vivos: ["abc1234"] }], arg) === corr);

  // Un bloque de código NO es prosa: corregir adentro rompe el comando que el ítem enseña.
  const conCodigo = [
    "- [x] **CERRADO (`abc1234`)**",
    "      ```bash",
    "      echo 'Commiteado, NO desplegado'   # lo que imprime el gate",
    "      ```",
  ].join("\n");
  ok("no acusa dentro de un bloque de codigo", afirmacionesDe(conCodigo, "x.md").length === 0);

  // --- El ROTULO de la seccion tambien afirma, y era el unico invisible -------------------
  //
  // Medido el 2026-09-25 22:00 La Paz: `chatbot.md:32` dice en su TITULO de seccion
  // «## ✅ T10 — CERRADO el 2026-09-24 (commiteado, **NO desplegado**): el log del bot estaba
  // ahogado…» y el dedup que ese item entrego YA ESTA VIVO (`/tmp/onia-bot/knowledge.mjs`
  // trae `avisosDePanelYaDados`, y el log tiene 0 lineas `[knowledge:panel]` el 25 y el 26 de
  // septiembre contra 5.032 historicas). O sea que el rotulo MIENTE — y este gate no lo veia,
  // porque solo abria item con `- [ ]` / `- [x]` y la cabecera `## ` unicamente CERRABA el
  // anterior. Tres cabeceras (T10, T9, T6) afirmaban deploy y ninguna entraba al juicio.
  //
  // El rotulo es lo PRIMERO que lee la vuelta siguiente y es lo que decide si el item cuenta
  // como cerrado: un renglon del cuerpo corregido debajo de un titulo que sigue diciendo «NO
  // desplegado» deja la mentira arriba, donde mas se lee.
  const cabSeccion = "## ✅ T10 — CERRADO el 2026-09-24 (commiteado, **NO desplegado**): el bot vivo corre desde `/tmp/onia-bot`";
  ok("la cabecera de seccion tambien es una afirmacion", afirmacionesDe(cabSeccion + "\n", "x.md").length === 1);
  ok("y se le ubica la frontera igual que a un item", afirmacionesDe(cabSeccion + "\n", "x.md")[0]?.frontera === "bot");
  // Y la regla del archivo NO es una afirmacion: dice «NO desplegado» entre guillemets porque
  // habla DEL LITERAL, no de codigo suyo. Absolverla no es una excepcion escrita a mano — la
  // hace `sinCitas`, el mismo criterio que ya absolvia a las citas dentro de un item.
  ok(
    "la cabecera-REGLA que menciona el literal no se acusa",
    afirmacionesDe("## 🔴 ANTES DE CREERLE A UN «NO desplegado» DE ESTE ARCHIVO\n", "x.md").length === 0,
  );
  // Un item que vive DENTRO de la seccion sigue siendo suyo: la cabecera no se queda con su
  // cuerpo (si se lo quedara, el juez del motor leeria los archivos del item de al lado).
  const seccionConItem = [cabSeccion, "", "- [x] **CERRADO.** Commiteado, **NO desplegado** — `knowledge.mjs`.", ""].join("\n");
  ok("cabecera e item se acusan por separado", afirmacionesDe(seccionConItem, "x.md").length === 2);

  // La etiqueta de imagen: es de donde sale el sha que corre.
  ok("lee la etiqueta", shaDeEtiqueta("onia-platform:release-3986b807") === "3986b807");
  ok("BUILD_ID no es una etiqueta", shaDeEtiqueta("VREeqNSncIqDIOTMbfLTQ") === null);
  ok("sin etiqueta -> null, no cadena vacia", shaDeEtiqueta(null) === null);

  // --- La frontera: a quién se le pide qué cuando no se pudo medir -----------------------
  // Los cuatro sujetos son textuales de `chatbot.md`, medidos el 2026-09-25.
  ok(
    "frontera: el bot vivo corre en /tmp/onia-bot -> bot",
    fronteraDe("⚠️ **Commiteado, NO desplegado.** El bot vivo corre desde `/tmp/onia-bot/` dentro de") === "bot",
  );
  ok("frontera: /opt/onia/bot es rsync -> bot", fronteraDe("⚠️ **Commiteado, NO desplegado** — `/opt/onia/bot` es rsync, no git.") === "bot");
  ok(
    "frontera: hasta que onia-cola publique plataforma -> plataforma",
    fronteraDe("⚠️ **NO DESPLEGADO.** Hasta que `onia-cola` publique `plataforma`, el dueño sigue leyendo") === "plataforma",
  );
  ok("frontera: la linea calla, el cuerpo dice bot -> bot", fronteraDe("**Commiteado, NO desplegado**.", "viaja con `deploy-bot.sh`") === "bot");
  // Manda la LÍNEA: un ítem largo nombra los dos deploys y la frase acusada habla de uno.
  ok(
    "frontera: manda la linea, no el cuerpo",
    fronteraDe("NO desplegado: falta el swap de `plataforma`", "el bot vivo corre en `/tmp/onia-bot/`") === "plataforma",
  );
  ok("frontera: sin huellas -> sin ubicar, nunca un default", fronteraDe("**Commiteado, NO desplegado.**") === "sin ubicar");
  ok("frontera: nombra los dos -> sin ubicar", fronteraDe("`/opt/onia/bot` y `onia-platform`") === "sin ubicar");
  // `onia-platform` como HOST de una URL no es una huella del deploy del panel: es el bot
  // llamándolo por la red de Docker, o sea evidencia de lo contrario. Medido el 2026-09-25 en
  // `chatbot.md:7173` (el inbox huérfano): su único `onia-platform` era
  // `http://onia-platform:3000/api/chatbot-knowledge/published`, y con eso el gate lo mandaba a
  // la cola del panel a pedirle un commit que sólo existe en el motor (`fetchOrgKnowledge` vive
  // en `vps-ops/bot/knowledge.mjs` y en ningún archivo de onia-platform). Pedir un sha imposible
  // deja al ítem incorregible para siempre, con cara de trabajo pendiente.
  ok(
    "frontera: onia-platform como host de URL no es huella del panel",
    fronteraDe("COMMITEADO, NO DESPLEGADO: el bot vivo sirve el panel", "curl 'http://onia-platform:3000/api/chatbot-knowledge/published?inboxId=7'") ===
      "sin ubicar",
  );
  // Pero el repo nombrado como repo SÍ sigue siendo huella del panel.
  ok("frontera: onia-platform como repo sigue siendo el panel", fronteraDe("falta el swap", "arreglado en `onia-platform/lib/x.ts`") === "plataforma");

  // --- UN VOTO CONTRA CINCO NO ES UN EMPATE ---------------------------------------------
  // Medido el 2026-09-26 sobre `chatbot.md`: de las 7 líneas que salían `sin ubicar`, CUATRO
  // (796, 860, 5011, 7368) tenían **una sola** mención de `onia-platform` en el cuerpo contra
  // **tres a cinco** huellas del motor (`/tmp/onia-bot`, `DESPLEGAR: bot`, `deploy-bot.sh`,
  // `webhook-server.sh`). El `bot && !plataforma` las leía como ambiguas y las mandaba a la pila
  // de «hay que leerlas» — la pila que nadie vacía, porque re-derivarla a mano cuesta una vuelta.
  // Un ítem largo del motor casi siempre nombra el panel UNA vez al pasar; exigir cero menciones
  // del otro lado es exigir que no exista prosa.
  // El umbral es el DOBLE y es conservador a propósito: clasificar una línea del panel como del
  // motor la saca del juicio por sha, que es el único que caza mentiras. Ante la duda, `sin ubicar`.
  ok("frontera: 3 huellas del bot contra 1 del panel -> bot", fronteraDe("**Commiteado, NO desplegado**.", "corre en `/tmp/onia-bot`, se pide con `DESPLEGAR: bot` y `deploy-bot.sh`; el panel de `onia-platform` lo muestra") === "bot");
  ok("frontera: 3 huellas del panel contra 1 del bot -> plataforma", fronteraDe("**Commiteado, NO desplegado**.", "`onia-platform` y `app.onia.com.bo`: falta el `DESPLEGAR: plataforma`; el bot llama a `vps-ops/bot`") === "plataforma");
  // Los hermanos que impiden que el umbral falle abierto: sin mayoría clara NO se adivina.
  ok("frontera: 1 contra 1 sigue sin ubicar", fronteraDe("`/opt/onia/bot` y `onia-platform`") === "sin ubicar");
  ok("frontera: 2 contra 3 no alcanza el doble -> sin ubicar", fronteraDe("x", "`/opt/onia/bot` `deploy-bot.sh` contra `onia-platform` `app.onia.com.bo` `DESPLEGAR: plataforma`") === "sin ubicar");

  // --- UNA AFIRMACIÓN TACHADA YA FUE CORREGIDA POR SU AUTOR ------------------------------
  // `chatbot.md:5011` decía `~~falta el deploy~~ CUMPLIDO Y VIVO` y el gate la acusaba igual:
  // `PIDE_DEPLOY` ve el literal y no ve el `~~`. En estas colas el tachado es LA convención para
  // «esto ya no es cierto» (se usa en 3492, 3623, 7673, S9, S17...), así que acusarlo es mandar a
  // trabajar sobre lo ya resuelto — el trabajo fantasma que este carril tiene medido al 46%.
  ok("tachado: `~~falta el deploy~~ CUMPLIDO` no se acusa", afirmacionesDe("- [x] F2.1 — ~~falta el deploy~~ CUMPLIDO Y VIVO.\n", "x.md").length === 0);
  // El hermano, y es el que importa: en 3492 y 3623 el tachado cubre el TÍTULO viejo y el
  // «NO desplegado» está FUERA. Quitar la línea entera por tener un `~~` las absolvería a las dos.
  ok("tachado: el NO desplegado de AFUERA se sigue acusando", afirmacionesDe("- [x] ~~El bot promete de más~~ — CERRADO en el repo. Commiteado, **NO desplegado**.\n", "x.md").length === 1);
  ok("tachado: un `~~` sin cerrar no borra el resto de la linea", afirmacionesDe("- [x] ~~a medias. Commiteado, **NO desplegado**.\n", "x.md").length === 1);

  // El remedio que se le imprime a cada no medida. Es el caso que este arreglo existe para cazar.
  ok(
    "remedio: a una linea del bot NO se le pide el commit",
    motivoDeNoMedida({ shas: [], frontera: "bot" }) === "es del bot: otra frontera — citar un sha NO la haria medible",
  );
  ok(
    "remedio: y tampoco cuando SÍ cita un sha (el sha es de onia-hermes)",
    motivoDeNoMedida({ shas: ["abc1234"], frontera: "bot" }) === "es del bot: otra frontera — citar un sha NO la haria medible",
  );
  ok("remedio: la del panel sin sha SÍ es el sujeto corregible", motivoDeNoMedida({ shas: [], frontera: "plataforma" }) === "la linea no cita sha");
  ok("remedio: sin ubicar no se disfraza de ninguna de las dos", motivoDeNoMedida({ shas: [], frontera: "sin ubicar" }) === "no cita sha y no se pudo ubicar la frontera");

  // Integración: la frontera tiene que VIAJAR desde el markdown hasta el motivo. Sin esto las
  // funciones de arriba son puro adorno — es como sobrevivió el falso verde del 25-sep.
  const mdBot = [
    "- [x] **CERRADO — el bot le contesta mal**",
    "      ⚠️ **Commiteado, NO desplegado** — `/opt/onia/bot` es rsync, no git.",
  ].join("\n");
  const afsBot = afirmacionesDe(mdBot, "chatbot.md");
  ok("integra: la afirmacion del motor sale con frontera bot", afsBot.length === 1 && afsBot[0].frontera === "bot");
  ok(
    "integra: sin medicion del motor, la del bot sigue NO MEDIDA (y lo dice)",
    juzgar(afsBot, () => null).noMedidas[0]?.motivo === "es del bot y el motor vivo no se pudo medir",
  );

  // --- EL JUEZ DEL MOTOR: la frontera que este gate declaraba «no mía» y sí tiene instrumento --
  const SUJETOS = ["config.mjs", "followup-run.mjs", "knowledge.onia.json", "marcas-en-disco.mjs"];
  const alDia = { medido: true, desfasados: [] };
  const conTres = { medido: true, desfasados: ["followup-run.mjs", "knowledge.onia.json", "marcas-en-disco.mjs"] };

  ok("motor: sin medir -> NO MEDIDA, nunca verde", juezDelMotor({ frase: "NO desplegado" }, null, SUJETOS).estado === "no-medida");
  ok("motor: entero al dia -> la linea MIENTE", juezDelMotor({ frase: "NO desplegado" }, alDia, SUJETOS).estado === "miente");
  ok(
    "motor: nombra un archivo que sigue desfasado -> es CIERTA, no se toca",
    juezDelMotor({ frase: "NO desplegado", cuerpo: "el arreglo vive en `followup-run.mjs`" }, conTres, SUJETOS).estado === "honesta",
  );
  ok(
    "motor: nombra archivos y NINGUNO esta desfasado -> MIENTE",
    juezDelMotor({ frase: "NO desplegado", cuerpo: "corregido en `config.mjs`" }, conTres, SUJETOS).estado === "miente",
  );
  ok(
    "motor: no nombra ningun archivo y quedan pendientes -> hay que leerla, no se acusa a ciegas",
    juezDelMotor({ frase: "NO desplegado" }, conTres, SUJETOS).estado === "no-medida",
  );
  // ANCLA: si la lista de sujetos llega vacía —el instrumento del motor cambió de nombres— nada
  // se nombra nunca y TODO pasaría a «hay que leerla» en silencio. Con el motor entero al día eso
  // no puede disfrazarse de verde: el veredicto no depende de los sujetos en ese caso.
  ok("motor ANCLA: sin sujetos, un motor al dia sigue desmintiendo", juezDelMotor({ frase: "NO desplegado" }, alDia, []).estado === "miente");
  ok(
    "motor ANCLA: sin sujetos y con pendientes, NO acusa",
    juezDelMotor({ frase: "NO desplegado", cuerpo: "`followup-run.mjs`" }, conTres, []).estado === "no-medida",
  );

  // Integración: la afirmación del markdown tiene que llegar al juez con su CUERPO, que es donde
  // vive el nombre del archivo. Sin eso el juez ve sólo el renglón acusado y no nombra nada.
  // La huella de frontera (`/tmp/onia-bot`) va en el MISMO ítem y el archivo en el cuerpo, que es
  // la forma real de estos ítems: el renglón acusado dice «NO desplegado» y el archivo aparece
  // arriba o abajo. Un fixture sin huella no probaría el juez, probaría a `fronteraDe` — y a
  // propósito no se amplió esa función con nombres de archivo: `config.mjs` existe en los DOS
  // repos, así que usarlo como huella mandaría líneas del panel al juez del bot. Ése es el error
  // que este gate cuida, al revés.
  const mdBotArchivo = [
    "- [x] **CERRADO — el barrido dejaba leads mudos**",
    "      El arreglo vive en `marcas-en-disco.mjs`; el bot vivo corre desde `/tmp/onia-bot/`.",
    "      ⚠️ **Commiteado, NO desplegado.**",
  ].join("\n");
  const afsArchivo = afirmacionesDe(mdBotArchivo, "chatbot.md");
  ok("integra: el cuerpo viaja con la afirmacion", typeof afsArchivo[0]?.cuerpo === "string" && afsArchivo[0].cuerpo.includes("marcas-en-disco.mjs"));
  ok("integra: y con el motor desfasado esa linea es honesta", juzgar(afsArchivo, () => null, conTres, SUJETOS).honestas.length === 1);
  ok("integra: con el motor al dia, la misma linea miente", juzgar(afsArchivo, () => null, alDia, SUJETOS).mienten.length === 1);
  ok(
    "integra: y su marca no cita un sha vacio",
    lineaDeMarca("      ⚠️ **Commiteado, NO desplegado**", { vivos: [], desplegado: null, fecha: "2026-09-25" }).includes("bot:vivo-al-dia"),
  );

  // El veredicto agregado tiene que nombrar el sujeto CORREGIBLE, no las 58 juntas.
  const vBot = veredicto({ mienten: [], honestas: [], noMedidas: [{ motivo: "es del bot: otra frontera — citar un sha NO la haria medible" }] });
  ok("veredicto: sigue siendo NO MEDIDO", vBot.codigo === NO_PUDE_MEDIR);
  ok("veredicto: no le pide su commit a una cola que es toda del motor", !/al ítem le falta su commit/.test(vBot.mensaje));
  const vMix = veredicto({
    mienten: [],
    honestas: [],
    noMedidas: [{ motivo: "es del bot: otra frontera — citar un sha NO la haria medible" }, { motivo: "la linea no cita sha" }],
  });
  ok("veredicto: cuenta cuantas son el sujeto corregible", /1 .*no cita.*sha|sin sha: 1/i.test(vMix.mensaje));

  // --- Nombrar al sujeto, no sólo contarlo -----------------------------------------------
  // Contar «4 son EL SUJETO» sin decir CUÁLES obliga a re-derivarlos a mano cada vuelta, y por
  // eso llevaban vueltas sin corregirse: la cola mandaba a «correr el comando y leer el
  // desglose», pero el desglose no traía el `archivo:línea`. Lo mismo con las «hay que
  // leerlas»: no se puede leer lo que el instrumento no ubica. Los datos ya estaban en la
  // afirmación (`archivo`, `linea`) — sólo no se imprimían.
  const conUbicacion = porFrontera([
    { motivo: "la linea no cita sha", archivo: "chatbot.md", linea: 1623, frase: "⚠️ **NO DESPLEGADO.** Hasta que `onia-cola` publique" },
    { motivo: "no cita sha y no se pudo ubicar la frontera", archivo: "plataforma-v1.md", linea: 6652, frase: "**Commiteado, NO desplegado.**" },
    { motivo: "es del bot: otra frontera — citar un sha NO la haria medible", archivo: "chatbot.md", linea: 99, frase: "rsync" },
  ]);
  ok("ubica: nombra el archivo:linea del sujeto corregible", /chatbot\.md:1623/.test(conUbicacion));
  ok("ubica: nombra tambien la que hay que leer", /plataforma-v1\.md:6652/.test(conUbicacion));
  // Las del motor se cuentan pero NO se listan: son 45 y no son trabajo de nadie acá — listarlas
  // entierra a los 4 sujetos entre 45 renglones, que es el mismo modo de falla del 25-sep.
  ok("ubica: no lista las 45 del motor", !/chatbot\.md:99/.test(conUbicacion));

  // --- Un sha que no se puede resolver NO ubica una frontera ------------------------------
  // Medido el 2026-09-26 en vivo: 7 de las 14 no medidas salían bajo el rótulo «citan un sha que
  // no es de onia-platform: TAMBIEN DEL MOTOR», y `fronteraDe` les había medido `sin ubicar` a
  // las siete. O sea que el rótulo era una CONJETURA impresa como medición — y encima ese bucket
  // quedaba fuera de `accionables`, así que ninguna se nombraba nunca con su `archivo:línea`.
  // Una de ellas es `plataforma-v1.md:6096`, que es del SIAT (`/opt/onia-siat`): la tercera
  // frontera, la que este archivo declara SIN instrumento. Llamarla «del motor» la manda a un
  // dueño que no es el suyo, y no nombrarla la deja invisible, que es exactamente el modo de
  // falla que el bloque de arriba existe para cerrar.
  ok(
    "no medida: un sha ajeno con la frontera SIN UBICAR no se le atribuye al motor",
    motivoDeNoMedida({ shas: ["5c2af97a"], frontera: "sin ubicar" }) === "cita un sha ajeno y no se pudo ubicar la frontera",
  );
  ok(
    "no medida: con la frontera en el PANEL, el sha ajeno sigue siendo el reclamo correcto",
    motivoDeNoMedida({ shas: ["5c2af97a"], frontera: "plataforma" }) === "ningun sha es de onia-platform",
  );
  const sinUbicarConSha = porFrontera([
    { motivo: "cita un sha ajeno y no se pudo ubicar la frontera", archivo: "plataforma-v1.md", linea: 6096, frase: "🔴 **Commiteado, NO desplegado:** `/opt/onia-siat/run-fase1-volumen.sh`" },
    { motivo: "ningun sha es de onia-platform", archivo: "chatbot.md", linea: 77, frase: "falta el swap de `plataforma`" },
  ]);
  ok("ubica: la del sha ajeno sin frontera tambien se nombra", /plataforma-v1\.md:6096/.test(sinUbicarConSha));
  ok("ubica: y la del panel con sha ajeno tambien, que es corregible", /chatbot\.md:77/.test(sinUbicarConSha));
  // El rótulo mismo era la mentira: «tambien del motor» se imprimía por tener un sha irresoluble,
  // y ninguna de las dos clases lo justifica — la del panel es del PANEL y la sin ubicar no se
  // midió. Un desglose que atribuye dueño sin haberlo medido manda el trabajo al carril de al lado.
  ok("ubica: el desglose ya no le atribuye el motor a nadie por el sha", !/tambien del motor/i.test(sinUbicarConSha));
  ok(
    "ubica: a la del panel le pide SU sha, que es lo unico que la vuelve medible",
    /sha/.test(sinUbicarConSha) && /onia-platform/.test(sinUbicarConSha),
  );

  // --- Desde `sin ubicar` se puede ABSOLVER, nunca ACUSAR ---------------------------------
  // El nombre de archivo es la unidad del deploy del motor, así que una línea que nombra un
  // archivo TODAVÍA sin publicar es cierta por medición, no por conjetura: el deploy que pide no
  // ocurrió para ese archivo. Al revés no: `config.mjs` existe en los DOS repos, así que acusar
  // desde `sin ubicar` es el error caro —sacar una línea del panel de su único juez— y por eso
  // este juicio absuelve pero no acusa. `fronteraDe` sigue SIN mirar nombres de archivo.
  const lineaSinUbicar = (cuerpo, shas = []) => [{ archivo: "chatbot.md", linea: 931, frase: "**NO desplegado**", shas, frontera: "sin ubicar", cuerpo }];
  ok(
    "sin ubicar: nombra un archivo del motor que sigue desfasado -> es CIERTA",
    juzgar(lineaSinUbicar("el arreglo vive en `followup-run.mjs`", ["5c2af97a"]), () => null, conTres, SUJETOS).honestas.length === 1,
  );
  ok(
    "sin ubicar ANCLA: nombra solo archivos ya publicados -> sigue NO MEDIDA, no se acusa",
    juzgar(lineaSinUbicar("corregido en `config.mjs`"), () => null, conTres, SUJETOS).noMedidas.length === 1,
  );
  ok(
    "sin ubicar ANCLA: con el motor ENTERO al dia tampoco acusa",
    juzgar(lineaSinUbicar("corregido en `config.mjs`"), () => null, alDia, SUJETOS).mienten.length === 0,
  );
  ok(
    "sin ubicar ANCLA: no nombra ningun archivo -> NO MEDIDA con su motivo de frontera",
    juzgar(lineaSinUbicar("", ["5c2af97a"]), () => null, conTres, SUJETOS).noMedidas[0]?.motivo === "cita un sha ajeno y no se pudo ubicar la frontera",
  );
  ok(
    "frontera ANCLA: sigue sin mirar nombres de archivo",
    fronteraDe("**NO desplegado** — el arreglo vive en `followup-run.mjs`") === "sin ubicar",
  );

  // --- Desde `sin ubicar` SÍ se acusa cuando el nombre es EXCLUSIVO del motor -------------
  // El bloque de arriba no acusa nunca, y su motivo escrito era «`config.mjs` vive en los dos
  // repos». Medido el 2026-09-26 contra `origin/master` de `onia-platform`: de los **74** sujetos
  // del motor, **74 son exclusivos** — ni `config.mjs` existe allá (lo que existe es `config.ts`,
  // otro nombre). O sea que la premisa que justificaba el fallo cerrado era falsa, y con ella se
  // quedaban sin juzgar líneas del motor que nombran SÓLO archivos ya publicados: mienten, y son
  // justo la clase que este gate existe para cazar.
  //
  // La ambigüedad no se asume ni se niega: se MIDE por nombre, y el criterio sigue siendo
  // conservador en los dos filos —
  //  · se acusa sólo si TODOS los archivos del motor que nombra son exclusivos (uno compartido
  //    devuelve la línea a NO MEDIDA: podría ser del panel, y sacarla de su juez por sha es el
  //    error caro que el bloque de arriba cuida);
  //  · y sólo cuando el juez acusó por haber NOMBRADO archivos. Un «el motor está ENTERO al día»
  //    no nombra ninguno: acusar ahí sería adivinar desde la frontera que menos sabe.
  // Sin la lista de exclusivos (`null` = no se pudo derivar) nada cambia: absuelve y no acusa.
  const EXCL = ["followup-run.mjs", "knowledge.onia.json", "marcas-en-disco.mjs"]; // `config.mjs` NO: fixture del nombre compartido
  ok(
    "sin ubicar: nombra SOLO archivos exclusivos ya publicados -> MIENTE",
    juzgar(lineaSinUbicar("corregido en `marcas-en-disco.mjs`"), () => null, alDia, SUJETOS, EXCL).mienten.length === 1,
  );
  ok(
    "sin ubicar: y la acusacion dice por que, nombrando la exclusividad",
    /exclusiv/i.test(juzgar(lineaSinUbicar("corregido en `marcas-en-disco.mjs`"), () => null, alDia, SUJETOS, EXCL).mienten[0]?.porQue ?? ""),
  );
  ok(
    "sin ubicar ANCLA: un nombre COMPARTIDO con el panel devuelve la linea a NO MEDIDA",
    juzgar(lineaSinUbicar("corregido en `config.mjs`"), () => null, alDia, SUJETOS, EXCL).noMedidas.length === 1,
  );
  ok(
    "sin ubicar ANCLA: mezcla de exclusivo y compartido tampoco acusa",
    juzgar(lineaSinUbicar("tocamos `marcas-en-disco.mjs` y `config.mjs`"), () => null, alDia, SUJETOS, EXCL).mienten.length === 0,
  );
  ok(
    "sin ubicar ANCLA: sin lista de exclusivos (null) se comporta como antes: no acusa",
    juzgar(lineaSinUbicar("corregido en `marcas-en-disco.mjs`"), () => null, alDia, SUJETOS, null).mienten.length === 0,
  );
  ok(
    "sin ubicar ANCLA: el archivo exclusivo DESFASADO sigue absolviendo, no acusando",
    juzgar(lineaSinUbicar("el arreglo vive en `followup-run.mjs`"), () => null, conTres, SUJETOS, EXCL).honestas.length === 1,
  );
  ok(
    "sin ubicar ANCLA: no nombra ningun archivo -> NO MEDIDA aunque el motor este al dia",
    juzgar(lineaSinUbicar("sin archivos", ["5c2af97a"]), () => null, alDia, SUJETOS, EXCL).noMedidas.length === 1,
  );
  ok(
    "panel ANCLA: la exclusividad no acusa a una linea del PANEL",
    juzgar(
      [{ archivo: "chatbot.md", linea: 1, frase: "**NO desplegado**, falta el swap de `plataforma`", shas: [], frontera: "plataforma", cuerpo: "y el bot corre `marcas-en-disco.mjs`" }],
      () => null,
      alDia,
      SUJETOS,
      EXCL,
    ).mienten.length === 0,
  );
  // Y la derivación: los exclusivos son los sujetos del motor MENOS los basenames del panel.
  ok(
    "exclusivos: resta por nombre con extension, no por nombre suelto",
    JSON.stringify(exclusivosDelMotor(["config.mjs", "followup-run.mjs"], ["config.ts", "page.tsx"])) ===
      JSON.stringify(["config.mjs", "followup-run.mjs"]),
  );
  ok(
    "exclusivos: un nombre que SI esta en el panel queda afuera",
    JSON.stringify(exclusivosDelMotor(["config.mjs", "followup-run.mjs"], ["config.mjs"])) === JSON.stringify(["followup-run.mjs"]),
  );
  ok(
    "exclusivos: sin lista del panel devuelve null, nunca la lista entera",
    exclusivosDelMotor(["config.mjs"], null) === null,
  );
  // El falso positivo medido en vivo, ahora ANCLA: `publicar.sh` es sujeto del motor Y el nombre
  // del publicador del SIAT, la landing y el panel. Un basename repetido dentro de onia-hermes no
  // ubica nada, y con él las dos lineas del SIAT salian acusadas por la medicion del bot.
  ok(
    "exclusivos ANCLA: un basename REPETIDO en onia-hermes no es exclusivo (publicar.sh)",
    !exclusivosDelMotor(["publicar.sh", "marcas-en-disco.mjs"], ["page.tsx"], [
      "hermes-content/deploy/vps-ops/bot/publicar.sh".split("/").pop(),
      "hermes-content/deploy/vps-ops/siat/publicar.sh".split("/").pop(),
      "marcas-en-disco.mjs",
    ]).includes("publicar.sh"),
  );
  ok(
    "exclusivos ANCLA: y el que aparece UNA sola vez sigue siendo exclusivo",
    exclusivosDelMotor(["publicar.sh", "marcas-en-disco.mjs"], ["page.tsx"], ["publicar.sh", "publicar.sh", "marcas-en-disco.mjs"]) .join() ===
      "marcas-en-disco.mjs",
  );
  ok(
    "exclusivos ANCLA: sin el inventario del repo (null) no se inventan repetidos",
    exclusivosDelMotor(["publicar.sh"], ["page.tsx"], null).join() === "publicar.sh",
  );
  // ANCLA de la otra punta: la absolución vale sólo desde `sin ubicar`. Una línea ya ubicada en el
  // PANEL que de paso nombre un archivo del motor no se absuelve con el estado del motor — eso la
  // sacaría del recuento de no medidas sin medirla, que es el falso verde de siempre.
  ok(
    "panel ANCLA: una linea del PANEL no se absuelve con el estado del motor",
    juzgar(
      [{ archivo: "chatbot.md", linea: 1, frase: "**NO desplegado**, falta el swap de `plataforma`", shas: ["5c2af97a"], frontera: "plataforma", cuerpo: "y el bot corre `followup-run.mjs`" }],
      () => null,
      conTres,
      SUJETOS,
    ).noMedidas[0]?.motivo === "ningun sha es de onia-platform",
  );

  // --- Un sha que sólo tiene dígitos sigue siendo un sha ---------------------------------
  // `7756295` es un commit REAL de onia-platform (`77562957`, "el cupo de WhatsApp deja de
  // cortar mudo") y el filtro anti-números lo tiraba por ser todo dígitos: la línea quedaba
  // como «no cita sha» —el sujeto que nadie puede corregir— teniendo su commit escrito al
  // lado. ~4% de los shas de 7 caracteres son todo dígitos, así que no es un caso de borde.
  // El filtro sigue haciendo falta (estas colas citan RNDs y teléfonos): lo que cambia es
  // QUIÉN decide — antes la FORMA, ahora el repo, vía `esCommit`.
  const mdDigitos = ["- [x] **CERRADO** arreglado en `7756295`", "      ⚠️ **Commiteado, NO desplegado**: viaja con `plataforma`."].join("\n");
  ok("sha todo-digitos: se descarta si el repo no lo conoce", afirmacionesDe(mdDigitos, "x.md")[0]?.shas.length === 0);
  ok("sha todo-digitos: se acepta si el repo dice que es un commit", afirmacionesDe(mdDigitos, "x.md", (s) => s === "7756295")[0]?.shas[0] === "7756295");
  const mdRnd = ["- [x] **La RND `102600000007` fija el plazo**", "      ⚠️ **Commiteado, NO desplegado**."].join("\n");
  ok("sha todo-digitos: una RND no se vuelve sha por existir el predicado", afirmacionesDe(mdRnd, "x.md", () => false)[0]?.shas.length === 0);

  // --- La marca no parte la frase que corrige --------------------------------------------
  // Medido el 2026-09-25 aplicando `--corregir` de verdad: la afirmación terminaba en «viaja
  // con el» y seguía en el renglón de abajo con «pedido de deploy de `plataforma`». La marca
  // entró en el medio y quedó *«viaja con el / ✅ YA DESPLEGADO / pedido de deploy»*: la
  // corrección es cierta y aun así deja el párrafo ilegible, que es justo lo que este gate
  // dice de sí mismo evitar («se corrigen CON su medición al lado»). Va al final del párrafo.
  const parrafo = [
    "- [x] **CERRADO**: arreglado en `abc1234`. ⚠️ **Commiteado, NO desplegado**: viaja con el",
    "      pedido de deploy de `plataforma`.",
    "",
    "      Otro parrafo que no se toca.",
  ].join("\n");
  const corregido = corregirTexto(parrafo, [{ linea: 1, vivos: ["abc1234"] }], { desplegado: "def5678", fecha: "2026-09-25" }).split("\n");
  ok("corrige: la marca va DESPUES de la ultima linea del parrafo", /pedido de deploy/.test(corregido[1]) && MARCA.test(corregido[2]));
  ok("corrige: no parte la frase", !MARCA.test(corregido[1]));
  ok("corrige: no invade el parrafo siguiente", corregido[3] === "" && /Otro parrafo/.test(corregido[4]));
  // Y sigue sin corregir dos veces: el guard tiene que mirar el punto NUEVO, no el viejo.
  ok("corrige: no duplica la marca al re-correr", corregirTexto(corregido.join("\n"), [{ linea: 1, vivos: ["abc1234"] }], { desplegado: "def5678", fecha: "2026-09-25" }).split("\n").filter((l) => MARCA.test(l)).length === 1);

  const malos = casos.filter((c) => !c.ok);
  for (const c of casos) console.log(`${c.ok ? "ok  " : "FALLA"} ${c.nombre}`);
  console.log(`\n${casos.length - malos.length}/${casos.length} casos`);
  return malos.length ? 1 : 0;
}

// ---------------------------------------------------------------------------

/**
 * La medición del MOTOR, delegada al instrumento que ya la hace (`bot_vivo_tiene_el_codigo.mjs`).
 * Se importa en vez de replicarse: comparar 73 archivos contra el contenedor por segunda vez es
 * como nacen los dos criterios que se desincronizan. Todo lo que falla devuelve `medido: false`
 * con su motivo — un motor que no se pudo mirar deja sus líneas NO MEDIDAS, nunca absueltas.
 */
function motorVivo() {
  try {
    const { archivos } = medirMotor();
    const v = veredictoDelMotor({ archivos });
    if (v.estado === "no_medido") return { motor: { medido: false, porQue: v.lineas[0] ?? "no medido" }, sujetos: [] };
    // `copiado_sin_reiniciar` es desfase REAL para este gate: los archivos viajaron pero el
    // proceso corre los viejos, así que ninguna línea del motor caducó todavía.
    if (v.estado === "copiado_sin_reiniciar") {
      return { motor: { medido: false, porQue: "el proceso arranco ANTES de la ultima copia: corre codigo viejo" }, sujetos: [] };
    }
    return { motor: { medido: true, desfasados: v.distintos ?? [] }, sujetos: sujetosDelMotor() };
  } catch (e) {
    return { motor: { medido: false, porQue: String(e?.message ?? e).slice(0, 80) }, sujetos: [] };
  }
}

function medir(corregir = false) {
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

  // `estaVivo` ya devuelve null para lo que no existe en el repo: reusarlo como predicado de
  // "esto es un commit" evita un segundo criterio que se desincronice con el primero.
  const esCommit = (sha) => estaVivo(sha) !== null;
  const afirmaciones = colasDe(DIR_COLAS).flatMap(({ archivo, texto }) => afirmacionesDe(texto, archivo, esCommit));
  const { motor, sujetos } = motorVivo();
  // La exclusividad se DERIVA del ref del panel cada corrida, no se escribe: el día que
  // `onia-platform` agregue un archivo con el nombre de uno del motor, ese nombre deja de acusar
  // solo. `null` (no se pudo leer el clon) devuelve el gate a absolver sin acusar.
  const exclusivos = exclusivosDelMotor(sujetos, nombresDelPanel(), basenamesDe(".", "HEAD"));
  const { mienten, noMedidas, honestas } = juzgar(afirmaciones, estaVivo, motor, sujetos, exclusivos);

  console.log(`Produccion corre \`${desplegado}\` (etiqueta de imagen de ${CONTENEDOR}).`);
  console.log(
    motor.medido
      ? `Motor del bot (/tmp/onia-bot): ${motor.desfasados.length} archivo(s) sin publicar${motor.desfasados.length ? ` — ${motor.desfasados.join(" ")}` : ""}.`
      : `Motor del bot: NO MEDIDO (${motor.porQue}) — sus lineas no se juzgan.`,
  );
  console.log(
    `Lineas que piden deploy en ${DIR_COLAS}: ${afirmaciones.length} — ` +
      `${mienten.length} mienten · ${honestas.length} ciertas · ${noMedidas.length} no medidas (sha ajeno o sin sha).`,
  );
  const fallo = veredicto({ mienten, honestas, noMedidas });
  if (fallo.codigo !== MIENTEN) {
    console.log(fallo.mensaje);
    return fallo.codigo;
  }
  console.log("\nESTAS LINEAS PIDEN UN DEPLOY QUE YA OCURRIO (su codigo esta vivo):\n");
  for (const m of mienten.slice(0, 80)) {
    console.log(`  ${m.archivo}:${m.linea}  [${m.vivos.join(" ")}]`);
    console.log(`      ${m.frase}`);
  }
  if (mienten.length > 80) console.log(`  … y ${mienten.length - 80} mas.`);
  console.log("\nSe corrigen CON su medicion al lado, no se borran: la historia del item es cierta,");
  console.log("lo que caduco es su estado. Una linea congelada en pasado se lee como presente.");
  if (!corregir) {
    console.log("\nPara aplicarlo: npm run deploy:ya-ocurrio -- --corregir");
    return MIENTEN;
  }

  const fecha = new Date().toISOString().slice(0, 10);
  const porArchivo = new Map();
  for (const m of mienten) (porArchivo.get(m.archivo) ?? porArchivo.set(m.archivo, []).get(m.archivo)).push(m);
  for (const [archivo, mentiras] of porArchivo) {
    const texto = readFileSync(archivo, "utf8");
    writeFileSync(archivo, corregirTexto(texto, mentiras, { desplegado, fecha }));
    console.log(`\ncorregidas ${mentiras.length} lineas en ${archivo}`);
  }
  console.log("\nRe-medido despues de corregir (si no baja a 0, la marca no exime y es un bucle):");
  return medir(false);
}

const esMain = process.argv[1] && process.argv[1].endsWith("deploy_ya_ocurrio.mjs");
if (esMain) process.exit(process.argv.includes("--self-check") ? selfCheck() : medir(process.argv.includes("--corregir")));
