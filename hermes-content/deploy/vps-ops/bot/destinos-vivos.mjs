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
import { basename, dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { getFallbackConfig } from "./audio-transcribe.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const ESTE = basename(fileURLToPath(import.meta.url));
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
    // El respaldo NO sale de una env: `audio-transcribe.mjs` lo resuelve de un mapa congelado
    // (`PROVEEDORES_DE_RESPALDO`), asi que el detector de `destinosDelDisco` —que pregunta por el
    // NOMBRE de la variable— es ciego a el. Se resuelve llamando a la funcion DEL PRODUCTO con el
    // entorno vivo: si manana alguien agrega un proveedor, el gate lo sigue sin tocar una linea.
    respaldo: { resuelve: "getFallbackConfig", con: getFallbackConfig, probe: "/models" },
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
  { archivo: "es-nuestra.mjs", clase: "duplicado", de: "chatwoot-adapter.mjs", motivo: "mismo destino que chatwoot-adapter.mjs (CHATWOOT_BASE_URL): se mide una vez" },
  { archivo: "editor-sugerir.mjs", clase: "duplicado", de: "vision.mjs", motivo: "mismo destino que vision.mjs (LITELLM_BASE): se mide una vez" },
  // Cal.com NO es una excusa "apagada": la env esta puesta y `run-turn.mjs` llama a la reserva
  // cada vez que un prospecto elige horario, o sea SI sale a la red. Lo que esta decidido es el
  // desenlace, no el silencio — ver la cola del chatbot, bloque del 2026-09-13.
  { archivo: "calcom-availability.mjs", clase: "caido-por-decision", motivo: "Cal.com no existe y es la opcion (c) de Sergio Urcullo (tablero t_b18ca430): el aviso por Telegram alcanza hasta >1 demo/semana" },
  { archivo: "calcom-booking.mjs", clase: "caido-por-decision", motivo: "mismo destino que calcom-availability.mjs (CALCOM_BASE_URL), opcion (c) del 2026-09-13; el prospecto recibe la salvedad 'Estoy confirmando ese horario con Sergio' y Sergio recibe el aviso — flujo degradado honesto, por diseno" },
  { archivo: "chatwoot-onboard.mjs", clase: "duplicado", de: "chatwoot-adapter.mjs", motivo: "mismo destino que chatwoot-adapter.mjs (CHATWOOT_BASE_URL): se mide una vez" },
  { archivo: "bcp-qr.mjs", clase: "apagada", motivo: "no hay QR para pagarle a Onia (se elimino el 2026-08-18): el bot no cobra" },
  // Sale a la red —le pregunta a onia.com.bo qué frases manda la web viva— pero NO desde un turno:
  // es un instrumento que se corre desde el repo. Por eso no puede ser "apagada" (mentiria: sí
  // sale) ni "duplicado" (su destino, la web publica, no lo mide ningun otro sujeto).
  { archivo: "campanas-vivas.mjs", clase: "no-es-del-turno", motivo: "instrumento de medicion (2026-09-26): le pregunta a onia.com.bo por las frases de campana y al bot vivo si las escucha; ningun turno lo carga — se corre desde el repo" },
];

/**
 * Una excusa no se lee: se RE-MIDE, y cada clase se refuta distinto.
 *
 * - `apagada` AFIRMA que el modulo no sale a ningun lado. Esa premisa la contesta el PROCESO
 *   VIVO: si la env que ese modulo lee esta puesta y no vacia, el modulo SI sale, la excusa
 *   dejo de valer y el destino vuelve a medirse.
 * - `duplicado` AFIRMA que otro sujeto mide el mismo destino. Si ese gemelo no esta en
 *   CAPACIDADES, no lo mide nadie y la excusa tapa el agujero entero.
 * - `no-es-del-turno` AFIRMA que el modulo sale a la red pero NO desde un turno: es un
 *   instrumento que se corre desde el repo. Esa premisa la contesta el DISCO: si cualquier modulo
 *   del bot lo carga, esta en el camino del turno y su destino vuelve a medirse. No se pregunta
 *   solo por `import` a proposito — una LECTURA (`readFileSync`, un `execFileSync` que lo invoca)
 *   tambien lo pone en el camino, y mirar solo los import ya apago una landing el 2026-09-25.
 *
 * Nace del 2026-09-19: `calcom-booking.mjs` estaba excusado con «su defecto es vacio: sin env no
 * sale a ningun lado» mientras el proceso vivo corria con `CALCOM_BASE_URL=http://calcom:3000`,
 * un host que no resuelve y sin contenedor detras. `run-turn.mjs` llama a la reserva CADA vez que
 * un prospecto elige horario, asi que la unica accion del embudo que vale plata apuntaba a la
 * nada — y este gate, que existe justamente para eso, la excusaba. Un motivo cierto el dia que se
 * escribio es una hipotesis CON FECHA.
 */
/**
 * Quien MENCIONA a cada archivo del directorio del bot: su nombre buscado en el texto de los demas
 * modulos. Se pregunta por la mencion y no por la forma del `import` porque las dos maneras de
 * ponerlo en el camino del turno cuentan igual: importarlo, o leerlo/ejecutarlo por su ruta.
 *
 * Tres clases de mencion no cuentan, y las tres por el mismo motivo —nombrar no es cargar—:
 * los `.test.mjs` (un test nombra a su sujeto por definicion), los otros instrumentos ya
 * declarados `no-es-del-turno` (que un medidor llame a otro medidor no lo pone en un turno), y
 * ESTE archivo, que es el clasificador: su lista de excusas nombra a cada sujeto que decide.
 *
 * La tercera la encontro el propio self-check el 2026-09-26, en rojo: al clasificar
 * `campanas-vivas.mjs` como instrumento, el detector vio la mencion DE ESA MISMA LINEA y refuto la
 * excusa que se acababa de escribir. Un clasificador que se cuenta como evidencia no puede
 * clasificar nada.
 */
export function cargadoresDelDisco(dir = AQUI, leerDir = readdirSync, leer = readFileSync) {
  const instrumentos = new Set(NO_SON_DESTINO_DEL_TURNO.filter((e) => e.clase === "no-es-del-turno").map((e) => e.archivo));
  const porArchivo = new Map();
  const modulos = leerDir(dir).filter((a) => a.endsWith(".mjs") && !a.endsWith(".test.mjs"));
  for (const archivo of modulos) {
    const quienes = modulos.filter((otro) => {
      if (otro === archivo || otro === ESTE || instrumentos.has(otro)) return false;
      return String(leer(join(dir, otro), "utf8")).includes(archivo);
    });
    if (quienes.length) porArchivo.set(archivo, quienes.sort());
  }
  return porArchivo;
}

export function excusasRefutadas({
  excusas = NO_SON_DESTINO_DEL_TURNO,
  sujetos = [],
  env = {},
  medidos = CAPACIDADES.map((c) => c.archivo),
  cargadores = null,
} = {}) {
  const refutadas = [];
  for (const e of excusas) {
    if (e.clase === "duplicado") {
      if (!medidos.includes(e.de)) {
        refutadas.push({ ...e, porque: `dice que el destino lo mide ${e.de}, y ${e.de} no esta en CAPACIDADES: no lo mide nadie` });
      }
      continue;
    }
    // `no-es-del-turno` AFIRMA que ningun turno lo carga. Lo contesta el disco, no el motivo escrito.
    if (e.clase === "no-es-del-turno") {
      const quienes = (cargadores ?? cargadoresDelDisco()).get(e.archivo) || [];
      if (quienes.length) {
        refutadas.push({ ...e, porque: `dice que ningun turno lo carga, y lo menciona ${quienes.join(", ")}: su destino esta en el camino del turno` });
      }
      continue;
    }
    // `caido-por-decision` declara que el destino NO esta y que el desenlace ya se eligio: tener
    // la env puesta es su estado normal, no una contradiccion. Lo que la vencería es que el
    // destino vuelva a contestar, y eso lo reporta `medir()` como una capacidad mas.
    if (e.clase !== "apagada") continue;
    const envsDelDisco = sujetos.find((s) => s.archivo === e.archivo)?.envs || [];
    for (const nombre of envsDelDisco) {
      const valor = String(env[nombre] ?? "").trim();
      if (!valor) continue;
      refutadas.push({
        ...e,
        env: nombre,
        destino: valor.replace(/\/+$/, ""),
        porque: `la excusa dice que no sale a ningun lado, y el proceso vivo tiene ${nombre}=${valor}`,
      });
      break;
    }
  }
  return refutadas;
}

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

/**
 * Los modulos que EXPONEN un respaldo (un segundo destino para la misma capacidad) y no lo
 * declararon en CAPACIDADES.
 *
 * Nace del 2026-09-19, y es el agujero que abrio el arreglo del dia anterior: al cablearle a la
 * transcripcion un respaldo contra OpenAI, la capacidad paso a tener DOS destinos y este gate
 * seguia preguntando por uno solo — justo por el que esta muerto a proposito. O sea que el destino
 * que hoy atiende el 100% de las notas de voz no lo medía nadie, y el gate imprimia "ROTA · cae a
 * M_AUDIO_FAIL" sobre una capacidad que SI se entrega. Los dos lados equivocados a la vez.
 *
 * Se deriva del DISCO leyendo el fuente, no de una lista: el dia que alguien le ponga respaldo a
 * la vision o al modelo del turno, este gate se pone rojo con su nombre hasta que se decida.
 */
export function respaldosSinDeclarar(capacidades = CAPACIDADES, dir = AQUI, leer = readFileSync) {
  const sinDeclarar = [];
  for (const cap of capacidades) {
    if (cap.respaldo) continue;
    let texto = "";
    try {
      texto = String(leer(join(dir, cap.archivo), "utf8"));
    } catch {
      continue; // no poder leer el fuente no es "no tiene respaldo": no se inventa un veredicto
    }
    const m = texto.match(/export function (get\w*[Ff]allback\w*Config)\s*\(/);
    if (m) sinDeclarar.push({ archivo: cap.archivo, funcion: m[1] });
  }
  return sinDeclarar;
}

/**
 * La cadena de destinos de UNA capacidad, en el orden en que el producto los intenta.
 *
 * Un solo destino cuando no hay respaldo. Cuando lo hay, el respaldo se RESUELVE con la funcion
 * del producto y el entorno vivo: si esa funcion devuelve `null` (sin proveedor, sin key) no hay
 * segundo destino y la cadena vuelve a ser de uno — que es la verdad, y es lo que hay que medir.
 */
export function cadenaDeDestinos(cap, env = {}, desplegado = true) {
  const primario = String(env[cap.env] || cap.defecto).replace(/\/+$/, "");
  // Los primarios de hoy son vecinos de la red de docker: no les aportamos llave, asi que su
  // criterio sigue siendo "hay alguien del otro lado". El dia que uno sea de un tercero, su
  // credencial se declara aca igual que la del respaldo.
  const cadena = [{ rol: "primario", url: `${primario}${cap.probe}`, destino: primario, credencial: null }];
  if (!cap.respaldo || typeof cap.respaldo.con !== "function") return cadena;

  // Un respaldo que esta en el REPO y no en el bot vivo no atiende a nadie. Contarlo daria
  // "degradada, la sirve el respaldo" sobre un prospecto que hoy recibe M_AUDIO_FAIL — el verde
  // falso que ya costo una vuelta el 2026-09-18: la exencion cuelga del DEPLOY, no del repo.
  // `null` (no se pudo preguntar) tampoco cuenta: sin saberlo, no se le promete red a nadie.
  if (desplegado !== true) return cadena;

  let conf = null;
  try {
    conf = cap.respaldo.con(env);
  } catch {
    conf = null;
  }
  const base = String(conf?.baseUrl || "").replace(/\/+$/, "");
  if (!base) return cadena;
  // La llave sale de la MISMA funcion del producto que la resuelve para el turno real
  // (`getFallbackConfig`), no de una copia: preguntarle a OpenAI sin ella daria 401 siempre y el
  // gate llamaria roto a un respaldo sano.
  return [...cadena, { rol: "respaldo", url: `${base}${cap.respaldo.probe}`, destino: base, credencial: conf?.apiKey || null }];
}

/**
 * Si el respaldo declarado esta CORRIENDO (no solo commiteado). Tri-estado: `null` cuando no se
 * pudo preguntar — que no es lo mismo que "no esta", y por eso tampoco se cuenta como red.
 */
export function respaldoDesplegado(cap, ejecutar = sh) {
  if (!cap.respaldo) return false;
  try {
    const salida = ejecutar(`grep -c '${cap.respaldo.resuelve}' /tmp/onia-bot/${cap.archivo} 2>/dev/null; echo "__rc=$?"`);
    const n = Number((salida.match(/^\s*(\d+)/m) || [])[1]);
    return Number.isFinite(n) ? n > 0 : null;
  } catch {
    return null;
  }
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
export function juzgar({ sujetos = [], medidas = [], refutadas = [], respaldosOcultos = [] } = {}) {
  const lineas = [];
  const decididos = new Set([
    ...CAPACIDADES.map((c) => c.archivo),
    ...NO_SON_DESTINO_DEL_TURNO.map((c) => c.archivo),
  ]);

  const sinDecidir = sujetos.filter((s) => !decididos.has(s.archivo));
  const rotas = [];
  const noMedidas = [];

  // Se juzga por CAPACIDAD y no por destino: una capacidad con respaldo esta rota solo cuando NO
  // contesta NINGUNO de sus destinos. Medir eslabon por eslabon daba "ROTA" sobre una capacidad
  // que se entrega — y callaba el caso inverso, que es el que hace volver el bug: el respaldo
  // muerto mientras el primario aguanta.
  const porCapacidad = new Map();
  for (const m of medidas) {
    if (!porCapacidad.has(m.archivo)) porCapacidad.set(m.archivo, []);
    porCapacidad.get(m.archivo).push({ ...m, rol: m.rol || "primario" });
  }

  for (const [archivo, eslabones] of porCapacidad) {
    const cap = CAPACIDADES.find((c) => c.archivo === archivo);
    const que = cap ? cap.capacidad : eslabones[0]?.capacidad || archivo;
    const primario = eslabones.find((e) => e.rol === "primario") || eslabones[0];
    const respaldo = eslabones.find((e) => e.rol === "respaldo");
    const sirve = eslabones.find((e) => e.contesta === true);

    if (!sirve && eslabones.some((e) => e.contesta === null || e.contesta === undefined)) {
      const m = eslabones.find((e) => e.contesta === null || e.contesta === undefined);
      noMedidas.push(m);
      lineas.push(`  NO MEDIDO  ${que} — ${m.destino}: ${m.motivo || "no se pudo preguntar"}`);
      continue;
    }

    if (sirve) {
      if (sirve.rol === "respaldo") {
        lineas.push(`  degradada  ${que} — el primario ${primario.destino} NO contesta (${primario.motivo || "sin respuesta"})`);
        lineas.push(`             la sirve el RESPALDO ${sirve.destino}, que contesta: el prospecto SI recibe la capacidad`);
      } else {
        lineas.push(`  ok         ${que} — ${sirve.destino} contesta`);
      }
      // El primario vivo no absuelve al respaldo muerto: perder la red es como vuelve el bug, en
      // silencio y con todo verde. No es rojo (hoy se entrega), pero se dice.
      if (respaldo && respaldo.contesta === false) {
        lineas.push(`  AVISO      ${que} — el RESPALDO ${respaldo.destino} no contesta (${respaldo.motivo || "sin respuesta"}): hoy se entrega, pero sin red`);
      }
      if (respaldo && (respaldo.contesta === null || respaldo.contesta === undefined)) {
        lineas.push(`  AVISO      ${que} — no se pudo preguntar por el RESPALDO ${respaldo.destino}: ${respaldo.motivo || "sin respuesta"}`);
      }
      continue;
    }

    if (primario.encendida === false) {
      lineas.push(`  apagada    ${que} — ${primario.destino} no contesta, pero la capacidad esta APAGADA a proposito`);
      continue;
    }

    rotas.push({ ...primario, cap });
    lineas.push(`  ROTA       ${que}`);
    for (const e of eslabones) {
      lineas.push(`             destino ${e.destino} (${e.rol}) NO contesta (${e.motivo || "sin respuesta"})`);
    }
    if (cap) lineas.push(`             lo que recibe el prospecto: ${cap.caida}`);
  }

  for (const s of sinDecidir) {
    lineas.push(`  SIN DECIDIR ${s.archivo} enchufa un destino externo (${s.envs.join(", ")}) y nadie dijo si se mide`);
  }
  for (const r of refutadas) {
    lineas.push(`  EXCUSA FALSA ${r.archivo} sigue excusado y su premisa ya no es cierta`);
    lineas.push(`             ${r.porque}`);
    lineas.push(`             decidilo en CAPACIDADES (con que recibe el prospecto si el destino no esta) o corregi la excusa`);
  }

  for (const r of respaldosOcultos) {
    lineas.push(`  RESPALDO SIN DECLARAR ${r.archivo} expone ${r.funcion}() y su capacidad no declara 'respaldo'`);
    lineas.push(`             esa capacidad tiene DOS destinos y este gate pregunta por uno: el otro no lo mide nadie`);
  }

  if (sinDecidir.length) {
    return {
      exit: 1,
      veredicto: `HAY ${sinDecidir.length} DESTINO(S) QUE NADIE DECIDIO SI SE MIDEN — declaralos en CAPACIDADES o en NO_SON_DESTINO_DEL_TURNO`,
      lineas,
    };
  }
  if (respaldosOcultos.length) {
    return {
      exit: 1,
      veredicto: `${respaldosOcultos.length} CAPACIDAD(ES) TIENEN UN RESPALDO QUE ESTE GATE NO MIDE — declaralo con 'respaldo' en CAPACIDADES`,
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
  if (refutadas.length) {
    return {
      exit: 1,
      veredicto: `${refutadas.length} EXCUSA(S) DE ESTE GATE YA NO SON CIERTAS — un destino excusado con premisa falsa no lo mide nadie`,
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
 *
 * CON `credencial`, la pregunta CAMBIA y por eso el veredicto tambien. Un destino de TERCERO cuya
 * llave aportamos nosotros (hoy: el respaldo de transcripcion en api.openai.com) no se puede medir
 * por "hay alguien del otro lado": eso es cierto para siempre y vuelve al gate incapaz de
 * reportarlo roto. Lo unico que puede fallar ahi es la AUTORIZACION —llave revocada, sin permisos,
 * sin cuota— y para el prospecto eso es identico a que el destino no exista. Sin credencial
 * declarada NO se toca el criterio: litellm y chatwoot contestan 401 estando sanos.
 *
 * La llave viaja en el header y NUNCA vuelve en el motivo: este veredicto se pega en tareas y logs.
 */
export function destinoContesta(url, ejecutar = sh, credencial = null) {
  const llave = String(credencial || "").trim();
  const auth = llave ? `--header='Authorization: Bearer ${llave}' ` : "";
  let salida = "";
  try {
    salida = ejecutar(`wget -q -S -O /dev/null ${auth}--timeout=12 --tries=1 '${url}' 2>&1; echo "__rc=$?"`);
  } catch {
    return { contesta: null, motivo: "no se pudo correr wget en el contenedor" };
  }
  if (/HTTP\//.test(salida)) {
    const linea = (salida.match(/HTTP\/[\d.]+ \d+[^\n]*/) || [""])[0].trim();
    const codigo = Number((linea.match(/HTTP\/[\d.]+ (\d+)/) || [])[1]);
    if (llave && (codigo === 401 || codigo === 403)) {
      return { contesta: false, motivo: `el destino existe pero NO nos autoriza (HTTP ${codigo}): la credencial esta revocada, vencida o sin permisos` };
    }
    if (llave && codigo === 429) {
      return { contesta: false, motivo: "el destino nos rechaza por cuota o limite (HTTP 429): hay que recargar o esperar" };
    }
    return { contesta: true, motivo: linea };
  }
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
  const medidas = [];
  const avisosDeRespaldo = [];
  for (const cap of CAPACIDADES) {
    const encendida = cap.interruptor
      ? String(proceso.env[cap.interruptor.env] ?? "").trim().toLowerCase() !== cap.interruptor.apagadoSi
      : true;
    const vivo = cap.respaldo ? respaldoDesplegado(cap) : true;
    if (cap.respaldo && vivo !== true) {
      avisosDeRespaldo.push(
        vivo === false
          ? `  AVISO      ${cap.capacidad} — el respaldo existe en el repo y NO en el bot vivo (/tmp/onia-bot/${cap.archivo} no tiene ${cap.respaldo.resuelve}): no se cuenta como red hasta desplegarlo`
          : `  AVISO      ${cap.capacidad} — no se pudo preguntarle al bot vivo si tiene el respaldo: no se cuenta como red`,
      );
    }
    for (const eslabon of cadenaDeDestinos(cap, proceso.env, vivo)) {
      // La clave lleva SI se pregunto con llave: la misma URL y la misma respuesta dan veredictos
      // opuestos segun quien tenga que autorizar, asi que una cache por URL pelada le daria a uno
      // el veredicto del otro.
      const clave = `${eslabon.url}${eslabon.credencial ? " +credencial" : ""}`;
      if (!yaPreguntado.has(clave)) yaPreguntado.set(clave, destinoContesta(eslabon.url, sh, eslabon.credencial));
      const r = yaPreguntado.get(clave);
      medidas.push({
        archivo: cap.archivo,
        rol: eslabon.rol,
        destino: eslabon.destino,
        encendida,
        contesta: r.contesta,
        motivo: r.motivo,
      });
    }
  }

  const sujetos = destinosDelDisco();

  // Una excusa refutada vuelve a ser un destino: se MIDE, no se reimprime como excusada. Sin esto
  // el gate diria "la premisa es falsa" y seguiria sin saber si el destino esta vivo.
  const refutadas = excusasRefutadas({ sujetos, env: proceso.env });
  for (const r of refutadas) {
    if (!r.destino) continue;
    if (!yaPreguntado.has(r.destino)) yaPreguntado.set(r.destino, destinoContesta(r.destino));
    const resp = yaPreguntado.get(r.destino);
    medidas.push({
      archivo: r.archivo,
      capacidad: `${r.archivo} (excusado como apagado, pero el proceso vivo lo tiene encendido)`,
      destino: r.destino,
      encendida: true,
      contesta: resp.contesta,
      motivo: resp.motivo,
    });
  }

  const { exit, veredicto, lineas } = juzgar({ sujetos, medidas, refutadas, respaldosOcultos: respaldosSinDeclarar() });
  console.log(`proceso ${proceso.pid} en ${CONTENEDOR} — ${sujetos.length} modulo(s) del disco enchufan un destino externo`);
  for (const l of lineas) console.log(l);
  for (const l of avisosDeRespaldo) console.log(l);
  const refutados = new Set(refutadas.map((r) => r.archivo));
  for (const e of NO_SON_DESTINO_DEL_TURNO) {
    if (!refutados.has(e.archivo)) console.log(`  (excusado) ${e.archivo}: ${e.motivo}`);
  }
  console.log(`VEREDICTO: ${veredicto}`);
  return exit;
}

// ---------------------------------------------------------------------------
// Self-check — puro, va a la cadena
// ---------------------------------------------------------------------------

/**
 * Los sujetos con los que se arma un caso que mide EL JUICIO: solo los que ese caso mide, y
 * declarados sinteticamente. `juzgar()` usa la lista de sujetos para UNA sola cosa —detectar los
 * que nadie decidio— asi que un caso que le pasa el disco entero deja de medir lo que dice medir:
 * mide "ademas, hoy no hay archivos nuevos".
 *
 * Nace del 2026-09-26. `campanas-vivas.mjs` entro al directorio con una env `*_BASE` y el gate
 * saco SEIS fallas: la suya —correcta— y cinco que decian «una capacidad APAGADA con el destino
 * caido no puede salir roja», «no haber podido preguntar tiene que salir NO MEDIDO», «con el
 * primario vivo la capacidad se entrega»… todas mentira. Esos cinco comportamientos estaban
 * perfectos; lo unico roto era que un archivo nuevo estaba sin clasificar. Un rojo que nombra el
 * sintoma equivocado manda al callejon equivocado, y cuesta la vuelta entera del que lo lee.
 */
function sujetosDelCaso(...archivos) {
  const decididos = new Set([...CAPACIDADES.map((c) => c.archivo), ...NO_SON_DESTINO_DEL_TURNO.map((c) => c.archivo)]);
  const sinDecidir = archivos.filter((a) => !decididos.has(a));
  if (sinDecidir.length) throw new Error(`caso del juicio armado con sujetos sin decidir: ${sinDecidir.join(", ")}`);
  return archivos.map((archivo) => ({ archivo, envs: [] }));
}

function correrCasos({ sujetos = destinosDelDisco(), conAncla = true } = {}) {
  const fallas = [];
  const ok = (cond, que) => { if (!cond) fallas.push(que); };

  // ANCLA: los dos sujetos que originaron el gate tienen que salir del disco. Si el detector deja
  // de verlos, el gate se apaga en silencio y este caso es lo unico que lo delata.
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
    sujetos: sujetosDelCaso("audio-transcribe.mjs"),
    medidas: [{ archivo: "audio-transcribe.mjs", destino: "http://speaches:8000/v1", encendida: true, contesta: false, motivo: "el host no resuelve" }],
  });
  ok(roto.exit === 1, "una capacidad encendida contra un destino muerto tiene que salir ROJO");
  ok(/M_AUDIO_FAIL/.test(roto.lineas.join("\n")), "el rojo tiene que decir que recibe el prospecto, no solo que el destino no contesta");

  // Apagada a proposito no es rojo: apagar es una decision, no una falla.
  ok(
    juzgar({ sujetos: sujetosDelCaso("audio-transcribe.mjs"), medidas: [{ archivo: "audio-transcribe.mjs", destino: "http://speaches:8000/v1", encendida: false, contesta: false }] }).exit === 0,
    "una capacidad APAGADA con el destino caido no puede salir roja",
  );

  // Tri-estado: no poder preguntar NO es lo mismo que un destino caido.
  const nm = juzgar({ sujetos: sujetosDelCaso("vision.mjs"), medidas: [{ archivo: "vision.mjs", destino: "http://x/v1", encendida: true, contesta: null, motivo: "sin docker" }] });
  ok(nm.exit === 2, "no haber podido preguntar tiene que salir NO MEDIDO (2), nunca rojo ni verde");

  // Un destino nuevo que nadie decidio es rojo CON SU NOMBRE: asi se cierra la clase.
  const nuevo = juzgar({ sujetos: [...sujetosDelCaso("vision.mjs"), { archivo: "ocr.mjs", envs: ["ONIA_OCR_BASE_URL"] }], medidas: [] });
  ok(nuevo.exit === 1 && /ocr\.mjs/.test(nuevo.lineas.join("\n")), "un destino externo nuevo sin decidir tiene que salir rojo nombrandolo");

  // Verde solo cuando TODOS contestan.
  ok(
    juzgar({ sujetos: sujetosDelCaso("vision.mjs"), medidas: [{ archivo: "vision.mjs", destino: "http://x/v1", encendida: true, contesta: true }] }).exit === 0,
    "con todos los destinos contestando tiene que salir verde",
  );

  // --- La CADENA de destinos: una capacidad puede tener respaldo y se juzga entera. ---

  // ANCLA DE LA CLASE (2026-09-19): el respaldo de la transcripcion NO sale de una env, asi que
  // `destinosDelDisco` es ciego a el. Si alguien le saca el `respaldo` a la capacidad, el gate
  // vuelve a preguntar por un solo destino y este caso es lo unico que lo delata.
  const capAudio = CAPACIDADES.find((c) => c.archivo === "audio-transcribe.mjs");
  ok(capAudio?.respaldo, "la transcripcion perdio la declaracion de su respaldo: su segundo destino deja de medirse");
  const envVivoFalso = {
    ONIA_AUDIO_STT_BASE_URL: "http://speaches:8000/v1",
    ONIA_AUDIO_STT_FALLBACK_PROVIDER: "openai",
    OPENAI_ONIA_CENTER_API_KEY: "sk-de-prueba",
  };
  const cadena = cadenaDeDestinos(capAudio, envVivoFalso);
  ok(cadena.length === 2, `con proveedor y key la cadena tiene que traer DOS destinos, trajo ${cadena.length}`);
  ok(cadena[1]?.rol === "respaldo" && /api\.openai\.com/.test(cadena[1]?.url || ""),
    "el segundo destino tiene que ser el respaldo REAL que resuelve el producto, no un literal copiado acá");

  // El respaldo que esta SOLO en el repo no atiende a nadie: contarlo es el verde falso que ya
  // costo una vuelta (2026-09-18). La red cuelga del DEPLOY, no del commit.
  ok(cadenaDeDestinos(capAudio, envVivoFalso, false).length === 1,
    "un respaldo commiteado y NO desplegado no puede contarse como red: el prospecto recibe la caida igual");
  ok(cadenaDeDestinos(capAudio, envVivoFalso, null).length === 1,
    "no haber podido preguntar si el respaldo esta desplegado tampoco cuenta como red (falla cerrado)");
  ok(respaldoDesplegado(capAudio, () => "0\n__rc=1") === false, "grep en 0 es un NO desplegado, no un 'no pude preguntar'");
  ok(respaldoDesplegado(capAudio, () => "3\n__rc=0") === true, "grep con coincidencias prueba que el respaldo esta corriendo");
  ok(respaldoDesplegado(capAudio, () => { throw new Error("sin docker"); }) === null,
    "no poder hablar con el contenedor es NO MEDIDO, nunca 'no esta desplegado'");

  // Sin key no hay respaldo: la cadena vuelve a ser de uno, que es la verdad que hay que medir.
  ok(cadenaDeDestinos(capAudio, { ONIA_AUDIO_STT_FALLBACK_PROVIDER: "openai" }).length === 1,
    "sin key el producto NO tiene respaldo: inventarle un segundo destino mediria algo que no existe");

  // El defecto que este arreglo cierra: primario muerto + respaldo vivo NO es una capacidad rota.
  const degradada = juzgar({
    sujetos: sujetosDelCaso("audio-transcribe.mjs"),
    medidas: [
      { archivo: "audio-transcribe.mjs", rol: "primario", destino: "http://speaches:8000/v1", encendida: true, contesta: false, motivo: "el host no resuelve" },
      { archivo: "audio-transcribe.mjs", rol: "respaldo", destino: "https://api.openai.com/v1", encendida: true, contesta: true },
    ],
  });
  ok(degradada.exit === 0, "primario muerto con el respaldo vivo NO puede salir rojo: el prospecto SI recibe la capacidad");
  ok(/degradada/.test(degradada.lineas.join("\n")) && !/M_AUDIO_FAIL/.test(degradada.lineas.join("\n")),
    "con el respaldo vivo el gate no puede seguir diciendo que el prospecto recibe la caida del primario");

  // La direccion simetrica, que es como vuelve el bug: el primario aguanta y la red se cayo.
  const sinRed = juzgar({
    sujetos: sujetosDelCaso("audio-transcribe.mjs"),
    medidas: [
      { archivo: "audio-transcribe.mjs", rol: "primario", destino: "http://speaches:8000/v1", encendida: true, contesta: true },
      { archivo: "audio-transcribe.mjs", rol: "respaldo", destino: "https://api.openai.com/v1", encendida: true, contesta: false, motivo: "timeout" },
    ],
  });
  ok(sinRed.exit === 0, "con el primario vivo la capacidad se entrega: el respaldo caido no es rojo");
  ok(/AVISO/.test(sinRed.lineas.join("\n")), "un respaldo caido tiene que DECIRSE: perder la red es como vuelve el bug en silencio");

  // Los DOS destinos muertos sí es rojo, y nombra los dos.
  const dosMuertos = juzgar({
    sujetos: sujetosDelCaso("audio-transcribe.mjs"),
    medidas: [
      { archivo: "audio-transcribe.mjs", rol: "primario", destino: "http://speaches:8000/v1", encendida: true, contesta: false, motivo: "el host no resuelve" },
      { archivo: "audio-transcribe.mjs", rol: "respaldo", destino: "https://api.openai.com/v1", encendida: true, contesta: false, motivo: "timeout" },
    ],
  });
  ok(dosMuertos.exit === 1, "con TODA la cadena muerta la capacidad esta rota");
  ok(/speaches/.test(dosMuertos.lineas.join("\n")) && /api\.openai\.com/.test(dosMuertos.lineas.join("\n")),
    "el rojo de una cadena muerta tiene que nombrar los DOS destinos, no solo el primero");

  // Cierre de clase: un modulo que expone un respaldo y no lo declara es ROJO con su nombre.
  ok(respaldosSinDeclarar().length === 0,
    `hay capacidades con respaldo sin declarar: ${respaldosSinDeclarar().map((r) => r.archivo).join(", ")}`);
  const oculto = juzgar({ sujetos: sujetosDelCaso("vision.mjs"), medidas: [], respaldosOcultos: [{ archivo: "vision.mjs", funcion: "getFallbackConfig" }] });
  ok(oculto.exit === 1 && /vision\.mjs/.test(oculto.lineas.join("\n")),
    "un respaldo nuevo sin declarar tiene que salir rojo nombrando el archivo");
  // Y el detector tiene que VER el caso conocido: sin esto el ancla de arriba pasa por vacia.
  ok(
    respaldosSinDeclarar([{ archivo: "audio-transcribe.mjs" }]).some((r) => r.archivo === "audio-transcribe.mjs"),
    "el detector del disco no reconoce el respaldo de audio-transcribe.mjs: el ancla estaria pasando en vacio",
  );

  // Un HTTP 401 prueba que el servicio EXISTE: es lo que este gate mide.
  const fake = () => "  HTTP/1.1 401 Unauthorized\n__rc=1";
  ok(destinoContesta("http://x/v1/models", fake).contesta === true, "un 401 prueba que hay alguien del otro lado");
  const dns = () => "wget: bad address 'speaches:8000'\n__rc=1";
  ok(destinoContesta("http://speaches:8000/v1/models", dns).contesta === false, "un host que no resuelve es un destino CAIDO, no un no-medido");
  const raro = () => "algo que nadie previo\n__rc=1";
  ok(destinoContesta("http://x", raro).contesta === null, "una salida que no se sabe leer es NO MEDIDO, nunca 'no contesta'");

  // --- Las excusas se RE-MIDEN: una premisa vencida no puede seguir tapando un destino. ---

  // Toda excusa declara su CLASE como dato. En prosa, «sin env no sale a ningun lado» era
  // indistinguible de «lo mide el gemelo», y por eso nadie podia verificarla.
  for (const e of NO_SON_DESTINO_DEL_TURNO) {
    ok(
      ["apagada", "duplicado", "caido-por-decision", "no-es-del-turno"].includes(e.clase),
      `la excusa de ${e.archivo} no declara una clase verificable`,
    );
    ok(e.clase !== "duplicado" || Boolean(e.de), `la excusa duplicado de ${e.archivo} no nombra al sujeto que SI lo mide`);
    // Una excusa que AFIRMA que el modulo no sale a la red no puede estar puesta sobre uno que si
    // sale: es la premisa que el proceso vivo refuto el 2026-09-19 y que la cola ya habia
    // corregido el 13-sep. Se prohibe la FORMA, no el texto viejo.
    ok(
      e.clase !== "apagada" || !/sin env|no sale a ningun lado|defecto es vacio/i.test(e.motivo),
      `la excusa de ${e.archivo} afirma que no sale a la red: eso lo contesta el proceso vivo, no un motivo escrito`,
    );
  }

  // `caido-por-decision` NO se refuta por tener la env puesta: justamente la tiene. Es la unica
  // clase que declara un desenlace decidido, y por eso tiene que citar la decision.
  for (const e of NO_SON_DESTINO_DEL_TURNO.filter((x) => x.clase === "caido-por-decision")) {
    ok(/\bt_[0-9a-f]{6,}\b|\b20\d\d-\d\d-\d\d\b/.test(e.motivo), `la excusa de ${e.archivo} dice 'decidido' y no cita la decision (tarea o fecha)`);
  }
  ok(
    excusasRefutadas({ sujetos, env: { CALCOM_BASE_URL: "http://calcom:3000" } }).every((r) => r.clase !== "caido-por-decision"),
    "una excusa 'caido-por-decision' no se refuta por tener la env puesta: el desenlace ya esta decidido",
  );

  // ANCLA del defecto real del 2026-09-19: un modulo excusado como apagado mientras el proceso
  // vivo corre con su env puesta apuntando a un host que no existe. Es la forma exacta que tenia
  // la excusa de calcom-booking.mjs, reproducida acá con un sujeto propio para que el caso siga
  // midiendo la CLASE aunque Cal.com se reclasifique.
  const comoCalcom = [{ archivo: "x.mjs", clase: "apagada", motivo: "no sale a ningun lado" }];
  const sujetoX = [{ archivo: "x.mjs", envs: ["X_BASE_URL"] }];
  const conEnv = excusasRefutadas({ excusas: comoCalcom, sujetos: sujetoX, env: { X_BASE_URL: "http://x:3000" } });
  ok(conEnv.length === 1, "con la env puesta en el proceso vivo, una excusa 'apagada' tiene que quedar REFUTADA");
  ok(
    /X_BASE_URL=http:\/\/x:3000/.test(conEnv[0]?.porque || ""),
    "la refutacion tiene que CITAR la env y su valor vivo, no solo decir que la excusa es falsa",
  );

  // La mitad simetrica: sin esa env el modulo de verdad no sale, y la excusa sigue valiendo. Sin
  // este caso el arreglo seria un gate que grita siempre, que es otra forma de apagarlo.
  ok(
    excusasRefutadas({ excusas: comoCalcom, sujetos: sujetoX, env: {} }).length === 0,
    "sin la env en el proceso vivo, una excusa 'apagada' NO puede darse por refutada",
  );
  ok(
    excusasRefutadas({ sujetos, env: {} }).every((r) => r.clase !== "apagada"),
    "con el entorno vacio ninguna excusa 'apagada' real puede quedar refutada",
  );

  // --- `no-es-del-turno`: la premisa es "ningun turno lo carga", y la contesta el disco. ---

  // Las dos mitades. Sin la segunda, la clase seria un gate que grita siempre; sin la primera,
  // una excusa que tapa un destino que SI esta en el camino del turno.
  const comoInstrumento = [{ archivo: "medidor.mjs", clase: "no-es-del-turno", motivo: "instrumento: se corre desde el repo" }];
  const cargado = excusasRefutadas({
    excusas: comoInstrumento,
    cargadores: new Map([["medidor.mjs", ["run-turn.mjs"]]]),
  });
  ok(cargado.length === 1, "un modulo excusado como instrumento que un modulo del bot CARGA tiene que quedar refutado");
  ok(/run-turn\.mjs/.test(cargado[0]?.porque || ""), "la refutacion tiene que NOMBRAR quien lo carga, no solo decir que la excusa es falsa");
  ok(
    excusasRefutadas({ excusas: comoInstrumento, cargadores: new Map() }).length === 0,
    "un instrumento que nadie carga NO puede darse por refutado: se corre desde el repo, no en un turno",
  );

  // El clasificador no es evidencia: nombrar un sujeto en la lista de excusas no lo carga. Sin este
  // caso, clasificar un instrumento refuta la excusa que se acaba de escribir (pasó el 2026-09-26).
  ok(
    !(cargadoresDelDisco().get("campanas-vivas.mjs") || []).includes(ESTE),
    `el detector de cargadores se cuenta a si mismo (${ESTE}): toda excusa 'no-es-del-turno' se auto-refuta al escribirse`,
  );

  // Y el detector tiene que ver de verdad el caso conocido: sin esto las dos mitades pasan en vacio.
  const cargadoresReales = cargadoresDelDisco();
  ok(
    cargadoresReales.get("audio-transcribe.mjs")?.length,
    "el detector de cargadores no ve quien carga audio-transcribe.mjs: las excusas 'no-es-del-turno' pasarian en vacio",
  );
  ok(
    excusasRefutadas({ sujetos, env: {}, cargadores: cargadoresReales }).every((r) => r.clase !== "no-es-del-turno"),
    `hay un instrumento que en realidad esta en el camino del turno: ${excusasRefutadas({ sujetos, env: {}, cargadores: cargadoresReales }).filter((r) => r.clase === "no-es-del-turno").map((r) => r.archivo).join(", ")}`,
  );

  // Un `duplicado` cuyo gemelo no se mide tapa el agujero entero.
  ok(
    excusasRefutadas({
      excusas: [{ archivo: "x.mjs", clase: "duplicado", de: "fantasma.mjs", motivo: "lo mide el gemelo" }],
      sujetos: [{ archivo: "x.mjs", envs: ["X_BASE_URL"] }],
      env: {},
    }).length === 1,
    "un duplicado que apunta a un gemelo que nadie mide tiene que quedar refutado",
  );
  ok(
    excusasRefutadas({
      excusas: [{ archivo: "x.mjs", clase: "duplicado", de: "vision.mjs", motivo: "lo mide vision" }],
      sujetos: [{ archivo: "x.mjs", envs: ["LITELLM_BASE"] }],
      env: { LITELLM_BASE: "http://litellm:4000/v1" },
    }).length === 0,
    "un duplicado cuyo gemelo SI se mide no es una excusa falsa: se mide una vez a proposito",
  );

  // Una excusa refutada nunca puede terminar en verde: si nadie mide ese destino, el gate no sabe.
  const conRefutada = juzgar({
    sujetos: sujetosDelCaso("vision.mjs"),
    medidas: [{ archivo: "vision.mjs", destino: "http://x/v1", encendida: true, contesta: true }],
    refutadas: [{ archivo: "calcom-booking.mjs", porque: "el proceso vivo tiene CALCOM_BASE_URL=http://calcom:3000" }],
  });
  ok(conRefutada.exit === 1, "con una excusa refutada el gate no puede salir verde");
  ok(/calcom-booking\.mjs/.test(conRefutada.lineas.join("\n")), "el rojo de excusa falsa tiene que NOMBRAR el archivo excusado");

  // ANCLA DEL AISLAMIENTO (2026-09-26): un archivo nuevo sin clasificar tiene que dar UN rojo —el
  // suyo, con su nombre— y no contaminar ningun otro caso. Se corre el self-check ENTERO contra un
  // disco simulado que trae un huerfano y se cuentan las fallas: si son mas de una, hay casos que
  // estan preguntandole al disco en vez de a la logica que dicen medir, y sus rojos mienten.
  if (conAncla) {
    const conHuerfano = correrCasos({
      sujetos: [...sujetos, { archivo: "huerfano-de-prueba.mjs", envs: ["ONIA_HUERFANO_BASE"] }],
      conAncla: false,
    });
    ok(
      conHuerfano.length === 1 && /huerfano-de-prueba\.mjs/.test(conHuerfano[0]),
      `un archivo nuevo sin clasificar contamina otros casos: dio ${conHuerfano.length} fallas en vez de 1 (${conHuerfano.filter((f) => !/huerfano-de-prueba/.test(f)).join(" · ")})`,
    );
  }

  return fallas;
}

function selfCheck() {
  const fallas = correrCasos();
  for (const f of fallas) console.log(`  FALLA  ${f}`);
  console.log(fallas.length ? `self-check: ${fallas.length} falla(s)` : "self-check: ok");
  return fallas.length ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(process.argv.includes("--self-check") ? selfCheck() : medir());
}
