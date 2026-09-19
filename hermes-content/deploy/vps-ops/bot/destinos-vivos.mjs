#!/usr/bin/env node
// Le pregunta, EN PRODUCCION, si los servicios externos de los que depende un turno del bot
// estan VIVOS — y si alguna capacidad esta encendida apuntando a un destino que no existe.
//
// POR QUE EXISTE. Medido el 2026-09-19 desde el contenedor `onia-center`, que es la red por la que
// habla el bot: `ONIA_AUDIO_ENABLED=true` y `ONIA_AUDIO_STT_BASE_URL=http://speaches:8000/v1`, con
// `wget` contestando `bad address 'speaches:8000'` y `docker ps -a | grep -i speach` VACIO. O sea:
// la transcripcion de notas de voz —la capacidad que `audio-transcribe.mjs` describe como "el
// agujero de comprension mas grande del bot", porque en Bolivia una parte enorme del WhatsApp son
// audios— esta encendida contra un contenedor que no existe. Cada nota de voz cae a M_AUDIO_FAIL
// ("¿me lo escribís?") con el modulo entero construido y desplegado.
//
// Y NADIE PODIA SABERLO. `audio-transcribe.mjs` es TOLERANTE POR CONTRATO: no tira jamas, devuelve
// `{ok:false, reason}` y el llamador sigue. Esa decision es correcta —que se rompa el audio no
// puede dejar mudo al prospecto— pero tiene un costo: la capacidad degrada EN SILENCIO y el unico
// testigo es el prospecto que se va. Ninguno de los instrumentos del carril lo ve: precios, avisos,
// horario, anticipacion y rubros miran TEXTO; el simulador y la sonda del widget escriben TEXTO. Un
// audio no aparece en ninguna de esas mediciones. La unica senal existia despues del dano.
//
// LA PREGUNTA QUE HACE ESTE GATE ES LA DE ANTES: no "¿fallo un audio?" sino "¿esta vivo el destino
// al que este bot le va a hablar cuando llegue uno?". Un destino se puede preguntar hoy, gratis y
// sin que ningun lead pague la respuesta.
//
// EL UNIVERSO SE DERIVA DEL DISCO, no de una lista a mano: todo modulo del bot que resuelve un
// destino externo desde una env `*_BASE_URL` / `*_BASE` es sujeto, y tiene que estar DECIDIDO acá
// (medido, o excusado con su motivo, que se re-mide en cada corrida). El dia que alguien enchufe un
// servicio nuevo, este gate se pone rojo con su nombre hasta que se decida que hacer con el. Es la
// unica forma de que la clase quede cerrada: el defecto de hoy no fue un destino mal escrito, fue
// un destino que nadie se acordo de preguntar.
//
// TRI-ESTADO, y el lado del que falla importa: `null` = no se pudo preguntar (exit 2, NO MEDIDO),
// nunca `false`. Un "no pude" que se imprime como "no contesta" manda a levantar un servicio sano;
// un "no contesta" que se imprime como "no pude" deja el bot roto en verde.
//
// Uso:
//   node destinos-vivos.mjs [--self-check]

import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const CONTENEDOR = "onia-center";

/**
 * Los modulos del bot que enchufan un servicio externo en el camino de UN TURNO, con la pregunta
 * que le hacemos a ese servicio. `probe` es una ruta GET: si contesta cualquier HTTP, el destino
 * existe (un 401 prueba que hay alguien del otro lado, que es lo que este gate mide).
 */
export const CAPACIDADES = [
  {
    archivo: "audio-transcribe.mjs",
    env: "ONIA_AUDIO_STT_BASE_URL",
    defecto: "http://speaches:8000/v1",
    capacidad: "el prospecto manda una NOTA DE VOZ y el bot la entiende",
    interruptor: { env: "ONIA_AUDIO_ENABLED", apagadoSi: "false" },
    probe: "/models",
    caida: "cae a M_AUDIO_FAIL: le pide al prospecto que reescriba lo que acaba de decir",
  },
  {
    archivo: "vision.mjs",
    env: "LITELLM_BASE",
    defecto: "http://onia_selfhosted-litellm-1:4000/v1",
    capacidad: "el prospecto manda una FOTO y el bot la describe",
    interruptor: null,
    probe: "/models",
    caida: "cae a R_ATTACH pelado: contesta sin haber mirado la imagen",
  },
  {
    archivo: "run-turn.mjs",
    env: "LITELLM_BASE",
    defecto: "http://onia_selfhosted-litellm-1:4000/v1",
    capacidad: "el bot RAZONA la respuesta (el modelo del turno)",
    interruptor: null,
    probe: "/models",
    caida: "el bot degrada al texto de respaldo del guion",
  },
  {
    archivo: "chatwoot-adapter.mjs",
    env: "CHATWOOT_BASE_URL",
    defecto: "https://onia-chatbot-chatwoot.hqdqgh.easypanel.host",
    capacidad: "el bot ENTREGA el mensaje al prospecto",
    interruptor: null,
    probe: "/api",
    caida: "el prospecto no recibe NADA: el turno corre y el mensaje no sale",
  },
];

/**
 * Sujetos del disco que NO son un destino del turno. El motivo se re-lee cada corrida: si deja de
 * ser cierto, se saca de acá y pasa a medirse. No se excusa por ruta ni por nombre parecido.
 */
export const NO_SON_DESTINO_DEL_TURNO = [
  { archivo: "es-nuestra.mjs", motivo: "mismo destino que chatwoot-adapter.mjs (CHATWOOT_BASE_URL): se mide una vez" },
  { archivo: "editor-sugerir.mjs", motivo: "mismo destino que vision.mjs (LITELLM_BASE): se mide una vez" },
  { archivo: "calcom-availability.mjs", motivo: "Cal.com no existe y la decision ya esta tomada (cola chatbot, 2026-09-13): el bot no reserva por ahi" },
  { archivo: "calcom-booking.mjs", motivo: "mismo destino que calcom-availability.mjs (CALCOM_BASE_URL), y ademas su defecto es vacio: sin env no sale a ningun lado" },
  { archivo: "chatwoot-onboard.mjs", motivo: "mismo destino que chatwoot-adapter.mjs (CHATWOOT_BASE_URL): se mide una vez" },
  { archivo: "bcp-qr.mjs", motivo: "no hay QR para pagarle a Onia (se elimino el 2026-08-18): el bot no cobra" },
];

// ---------------------------------------------------------------------------
// Universo: derivado del disco
// ---------------------------------------------------------------------------

/**
 * Todo `.mjs` del bot que resuelve un destino externo desde una env `*_BASE_URL` / `*_BASE`.
 *
 * Se pregunta por el NOMBRE DE LA VARIABLE y no por el literal `|| "http..."` a proposito: el
 * sujeto que origino este gate —`audio-transcribe.mjs`— cae del lado de enfrente, porque su
 * defecto es una CONSTANTE (`|| DEFAULT_BASE_URL`) y no un literal. Un detector por la forma del
 * valor lo pierde, y lo perderia justo en el unico caso conocido.
 */
export function destinosDelDisco(dir = AQUI, leerDir = readdirSync, leer = readFileSync) {
  const encontrados = [];
  for (const archivo of leerDir(dir).sort()) {
    if (!archivo.endsWith(".mjs") || archivo.endsWith(".test.mjs")) continue;
    const texto = String(leer(join(dir, archivo), "utf8"));
    const envs = new Set();
    for (const m of texto.matchAll(/env\.([A-Z0-9_]*(?:_BASE_URL|_BASE))\s*\|\|/g)) envs.add(m[1]);
    if (envs.size) encontrados.push({ archivo, envs: [...envs].sort() });
  }
  return encontrados;
}

// ---------------------------------------------------------------------------
// Veredicto — puro
// ---------------------------------------------------------------------------

/**
 * @param {object} entrada
 * @param {Array<{archivo:string, envs:string[]}>} entrada.sujetos  universo del disco
 * @param {Array<object>} entrada.medidas  [{archivo, destino, encendida, contesta: true|false|null, motivo}]
 * @returns {{exit:number, veredicto:string, lineas:string[]}}
 */
export function juzgar({ sujetos = [], medidas = [] } = {}) {
  const lineas = [];
  const decididos = new Set([
    ...CAPACIDADES.map((c) => c.archivo),
    ...NO_SON_DESTINO_DEL_TURNO.map((c) => c.archivo),
  ]);

  const sinDecidir = sujetos.filter((s) => !decididos.has(s.archivo));
  const rotas = [];
  const noMedidas = [];

  for (const m of medidas) {
    const cap = CAPACIDADES.find((c) => c.archivo === m.archivo);
    const que = cap ? cap.capacidad : m.archivo;
    if (m.contesta === null || m.contesta === undefined) {
      noMedidas.push(m);
      lineas.push(`  NO MEDIDO  ${que} — ${m.destino}: ${m.motivo || "no se pudo preguntar"}`);
      continue;
    }
    if (m.contesta) {
      lineas.push(`  ok         ${que} — ${m.destino} contesta`);
      continue;
    }
    if (m.encendida === false) {
      lineas.push(`  apagada    ${que} — ${m.destino} no contesta, pero la capacidad esta APAGADA a proposito`);
      continue;
    }
    rotas.push({ ...m, cap });
    lineas.push(`  ROTA       ${que}`);
    lineas.push(`             destino ${m.destino} NO contesta (${m.motivo || "sin respuesta"})`);
    if (cap) lineas.push(`             lo que recibe el prospecto: ${cap.caida}`);
  }

  for (const s of sinDecidir) {
    lineas.push(`  SIN DECIDIR ${s.archivo} enchufa un destino externo (${s.envs.join(", ")}) y nadie dijo si se mide`);
  }

  if (sinDecidir.length) {
    return {
      exit: 1,
      veredicto: `HAY ${sinDecidir.length} DESTINO(S) QUE NADIE DECIDIO SI SE MIDEN — declaralos en CAPACIDADES o en NO_SON_DESTINO_DEL_TURNO`,
      lineas,
    };
  }
  if (rotas.length) {
    return {
      exit: 1,
      veredicto: `${rotas.length} CAPACIDAD(ES) ENCENDIDA(S) CONTRA UN DESTINO QUE NO EXISTE — el bot promete algo que no puede hacer`,
      lineas,
    };
  }
  if (noMedidas.length) {
    return {
      exit: 2,
      veredicto: `NO MEDIDO — ${noMedidas.length} destino(s) sin respuesta del instrumento (no es lo mismo que un destino caido)`,
      lineas,
    };
  }
  return {
    exit: 0,
    veredicto: `ok — los ${medidas.length} destino(s) externos del turno contestan`,
    lineas,
  };
}

// ---------------------------------------------------------------------------
// Lector vivo
// ---------------------------------------------------------------------------

function sh(comando) {
  return execFileSync("docker", ["exec", CONTENEDOR, "sh", "-c", comando], {
    encoding: "utf8",
    timeout: 45_000,
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
}

/** El entorno del PROCESO vivo, no de webhook.env: lo que el bot USA. */
export function entornoDelProceso(ejecutar = sh) {
  const pid = ejecutar(`ps -eo pid,args | grep -F webhook-server | grep -v grep | head -1 | awk '{print $1}'`);
  if (!pid) return { pid: null, env: null };
  const crudo = ejecutar(`tr '\\0' '\\n' < /proc/${pid}/environ`);
  const env = {};
  for (const linea of crudo.split("\n")) {
    const i = linea.indexOf("=");
    if (i > 0) env[linea.slice(0, i)] = linea.slice(i + 1);
  }
  return { pid, env };
}

/**
 * Le pregunta al destino DESDE LA RED DEL BOT. Devuelve `true` si alguien contesta HTTP (un 401
 * tambien: prueba que el servicio existe), `false` si el host no resuelve o la conexion se niega,
 * y `null` si no se pudo ni preguntar.
 */
export function destinoContesta(url, ejecutar = sh) {
  let salida = "";
  try {
    salida = ejecutar(`wget -q -S -O /dev/null --timeout=12 --tries=1 '${url}' 2>&1; echo "__rc=$?"`);
  } catch {
    return { contesta: null, motivo: "no se pudo correr wget en el contenedor" };
  }
  if (/HTTP\//.test(salida)) return { contesta: true, motivo: (salida.match(/HTTP\/[\d.]+ \d+[^\n]*/) || [""])[0].trim() };
  if (/bad address|Name or service not known|unable to resolve/i.test(salida)) {
    return { contesta: false, motivo: "el host no resuelve — ese servicio no existe en esta red" };
  }
  if (/[Cc]onnection refused/.test(salida)) return { contesta: false, motivo: "conexion rechazada — nadie escuchando en ese puerto" };
  if (/timed out|Connection timed out/i.test(salida)) return { contesta: false, motivo: "timeout: nadie contesto en 12 s" };
  return { contesta: null, motivo: `respuesta que no se pudo clasificar: ${salida.split("\n").slice(-2).join(" ").slice(0, 120)}` };
}

function medir() {
  let proceso;
  try {
    proceso = entornoDelProceso();
  } catch (error) {
    console.log(`NO MEDIDO — no se pudo hablar con el contenedor ${CONTENEDOR}: ${String(error?.message || error).slice(0, 160)}`);
    return 2;
  }
  if (!proceso.pid || !proceso.env) {
    console.log(`NO MEDIDO — no encontre el proceso del webhook dentro de ${CONTENEDOR}`);
    return 2;
  }

  const yaPreguntado = new Map();
  const medidas = CAPACIDADES.map((cap) => {
    const destino = (proceso.env[cap.env] || cap.defecto).replace(/\/+$/, "");
    const encendida = cap.interruptor
      ? String(proceso.env[cap.interruptor.env] ?? "").trim().toLowerCase() !== cap.interruptor.apagadoSi
      : true;
    const url = `${destino}${cap.probe}`;
    if (!yaPreguntado.has(url)) yaPreguntado.set(url, destinoContesta(url));
    const r = yaPreguntado.get(url);
    return { archivo: cap.archivo, destino, encendida, contesta: r.contesta, motivo: r.motivo };
  });

  const sujetos = destinosDelDisco();
  const { exit, veredicto, lineas } = juzgar({ sujetos, medidas });
  console.log(`proceso ${proceso.pid} en ${CONTENEDOR} — ${sujetos.length} modulo(s) del disco enchufan un destino externo`);
  for (const l of lineas) console.log(l);
  for (const e of NO_SON_DESTINO_DEL_TURNO) console.log(`  (excusado) ${e.archivo}: ${e.motivo}`);
  console.log(`VEREDICTO: ${veredicto}`);
  return exit;
}

// ---------------------------------------------------------------------------
// Self-check — puro, va a la cadena
// ---------------------------------------------------------------------------

function selfCheck() {
  const fallas = [];
  const ok = (cond, que) => { if (!cond) fallas.push(que); };

  // ANCLA: los dos sujetos que originaron el gate tienen que salir del disco. Si el detector deja
  // de verlos, el gate se apaga en silencio y este caso es lo unico que lo delata.
  const sujetos = destinosDelDisco();
  const nombres = sujetos.map((s) => s.archivo);
  ok(nombres.includes("audio-transcribe.mjs"), "el universo del disco perdio audio-transcribe.mjs (defecto por CONSTANTE, no por literal)");
  ok(nombres.includes("vision.mjs"), "el universo del disco perdio vision.mjs");
  ok(
    sujetos.find((s) => s.archivo === "audio-transcribe.mjs")?.envs.includes("ONIA_AUDIO_STT_BASE_URL"),
    "no se detecto ONIA_AUDIO_STT_BASE_URL como el destino de la transcripcion",
  );

  // Todo sujeto del disco tiene que estar decidido: es la mitad que cierra la CLASE.
  const decididos = new Set([...CAPACIDADES.map((c) => c.archivo), ...NO_SON_DESTINO_DEL_TURNO.map((c) => c.archivo)]);
  const huerfanos = nombres.filter((n) => !decididos.has(n));
  ok(huerfanos.length === 0, `hay destinos del disco sin decidir: ${huerfanos.join(", ")}`);

  // El defecto real del 2026-09-19: capacidad encendida, destino que no resuelve.
  const roto = juzgar({
    sujetos,
    medidas: [{ archivo: "audio-transcribe.mjs", destino: "http://speaches:8000/v1", encendida: true, contesta: false, motivo: "el host no resuelve" }],
  });
  ok(roto.exit === 1, "una capacidad encendida contra un destino muerto tiene que salir ROJO");
  ok(/M_AUDIO_FAIL/.test(roto.lineas.join("\n")), "el rojo tiene que decir que recibe el prospecto, no solo que el destino no contesta");

  // Apagada a proposito no es rojo: apagar es una decision, no una falla.
  ok(
    juzgar({ sujetos, medidas: [{ archivo: "audio-transcribe.mjs", destino: "http://speaches:8000/v1", encendida: false, contesta: false }] }).exit === 0,
    "una capacidad APAGADA con el destino caido no puede salir roja",
  );

  // Tri-estado: no poder preguntar NO es lo mismo que un destino caido.
  const nm = juzgar({ sujetos, medidas: [{ archivo: "vision.mjs", destino: "http://x/v1", encendida: true, contesta: null, motivo: "sin docker" }] });
  ok(nm.exit === 2, "no haber podido preguntar tiene que salir NO MEDIDO (2), nunca rojo ni verde");

  // Un destino nuevo que nadie decidio es rojo CON SU NOMBRE: asi se cierra la clase.
  const nuevo = juzgar({ sujetos: [...sujetos, { archivo: "ocr.mjs", envs: ["ONIA_OCR_BASE_URL"] }], medidas: [] });
  ok(nuevo.exit === 1 && /ocr\.mjs/.test(nuevo.lineas.join("\n")), "un destino externo nuevo sin decidir tiene que salir rojo nombrandolo");

  // Verde solo cuando TODOS contestan.
  ok(
    juzgar({ sujetos, medidas: [{ archivo: "vision.mjs", destino: "http://x/v1", encendida: true, contesta: true }] }).exit === 0,
    "con todos los destinos contestando tiene que salir verde",
  );

  // Un HTTP 401 prueba que el servicio EXISTE: es lo que este gate mide.
  const fake = () => "  HTTP/1.1 401 Unauthorized\n__rc=1";
  ok(destinoContesta("http://x/v1/models", fake).contesta === true, "un 401 prueba que hay alguien del otro lado");
  const dns = () => "wget: bad address 'speaches:8000'\n__rc=1";
  ok(destinoContesta("http://speaches:8000/v1/models", dns).contesta === false, "un host que no resuelve es un destino CAIDO, no un no-medido");
  const raro = () => "algo que nadie previo\n__rc=1";
  ok(destinoContesta("http://x", raro).contesta === null, "una salida que no se sabe leer es NO MEDIDO, nunca 'no contesta'");

  for (const f of fallas) console.log(`  FALLA  ${f}`);
  console.log(fallas.length ? `self-check: ${fallas.length} falla(s)` : "self-check: ok");
  return fallas.length ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(process.argv.includes("--self-check") ? selfCheck() : medir());
}
