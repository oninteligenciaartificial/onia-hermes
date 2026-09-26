#!/usr/bin/env node
/**
 * log_del_bot_ahogado.mjs — ¿la cola del log del bot deja VER los eventos que miden el carril?
 *
 *   node scripts/log_del_bot_ahogado.mjs              # medicion viva (0 sano · 1 ahogado · 2 NO MEDIDO)
 *   node scripts/log_del_bot_ahogado.mjs --self-check # casos puros, sin docker ni ssh
 *
 * ──────────────────────────────────────────────────────────────────────────────────────────────
 * POR QUE EXISTE — y existe por un error propio, medido
 *
 * El objetivo de este carril se mide, entre otras cosas, con una linea del log vivo por cada
 * `demo_agendada` / `handoff_humano`. La forma natural de mirar un log es `tail`, y `tail` es
 * exactamente donde este sistema ya se cego dos veces:
 *
 *   1. 2026-09-24 — `tail -80 | grep -E "demo_agendada|handoff_humano"` devolvio VACIO con 27 de
 *      esos eventos adentro del archivo. Un `console.warn` de una condicion PERMANENTE
 *      (`[knowledge:panel] ignoro empresa.horario…`) habia escrito 3.541 copias y ocupaba la cola
 *      entera. Se leyo como «no paso nada». Un log ahogado es tan ciego como un log vacio, con el
 *      agravante de que CONTESTA.
 *
 *   2. 2026-09-26 — el arreglo de (1) estaba vivo y funcionando, y esta misma sesion lo declaro
 *      roto: `tail -2000 | grep -c knowledge:panel` devolvio 1.417 y se reabrio el item T10. Era
 *      falso. Probado golpeando `/health` cinco veces contra el bot de produccion: contesto OK las
 *      cinco y el log NO crecio ni una linea. Las 1.417 copias eran de antes del ultimo arranque
 *      del proceso, congeladas en un log que nunca se rota.
 *
 * LA CAUSA COMUN, que es lo que este archivo arregla: **`tail -N` es una ventana de LINEAS, no de
 * TIEMPO.** En un log que no se rota las dos cosas se separan hasta invertir el veredicto, y se
 * separan MAS cuanto mas prolifica es la linea de ruido — su propio pasado le come la ventana.
 * De ahi que el criterio de cierre que T10 traia escrito (`tail -2000` con < 50 copias) fuera
 * inalcanzable por construccion: no podia ponerse verde por perfecto que fuera el emisor, asi que
 * mandaba a cada vuelta a «arreglar» algo sano.
 *
 * COMO SE FECHA UNA LINEA QUE NO TIENE HORA. Las lineas `[onia-webhook]` llevan marca ISO; las de
 * ruido y las `[aviso]` salen peladas (eso ultimo es un item aparte de la cola, y toca un archivo
 * que hoy no viaja en el pedido de deploy vivo). Se fecha por VECINDAD, que es lo que el log si
 * permite afirmar:
 *   · marca anterior mas cercana >= inicio de la ventana  -> dentro de la ventana, con certeza.
 *   · marca posterior mas cercana <  inicio de la ventana  -> historica, con certeza.
 *   · ninguna de las dos alcanza                           -> SIN FECHAR, y entonces NO MEDIDO.
 * El tercer caso es el que evita las dos cegueras a la vez: no inventa un rojo (error de 2026-09-26)
 * ni regala un verde (error de 2026-09-24).
 *
 * LOS DOS VEREDICTOS SON DISTINTOS, y por eso se informan separados:
 *   · `ruido`  — ¿se sigue EMITIENDO ruido ahora? Es el diagnostico, y es lo que un arreglo mueve.
 *   · `cola`   — ¿el `tail` con el que se mide el objetivo deja ver los eventos? Es el SINTOMA, y
 *                es el que le importa al carril. Puede estar verde con ruido historico de sobra.
 *
 * TRI-ESTADO A PROPOSITO: sin docker, sin contenedor o sin poder fechar sale **2 = NO MEDIDO**,
 * nunca verde. Confundir «no pude preguntar» con «me dijeron que si» es el falso verde de siempre.
 */

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

const CONTENEDOR = "onia-center";
const LOG_VIVO = "/tmp/onia-bot-webhook.log";
/** Cuantas lineas se bajan para tener con que fechar. Generoso: el ruido historico come ventana. */
const LINEAS_A_MIRAR = 4000;
/** La cola con la que este carril mide su objetivo. Tiene que ser el MISMO numero que el prompt. */
const LINEAS_DE_COLA = 80;
const VENTANA_HORAS = 2;
/** Copias toleradas DENTRO de la ventana. Un evento real repetido un pu~nado de veces no ahoga. */
const UMBRAL_EN_VENTANA = 50;

/** La marca que el log estampa en las lineas que si la llevan. */
const ISO_EN_EL_LOG = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

/** Los eventos que miden el objetivo del carril: si estos no se ven, la medicion esta ciega. */
const EVENTOS_DEL_OBJETIVO = /demo_agendada|handoff_humano/;

/**
 * Lineas de CONDICION PERMANENTE conocidas. Una condicion permanente no es un evento: se dice una
 * vez. Se listan con su historia para que el proximo que agregue una sepa contra que se mide.
 */
export const RUIDO_CONOCIDO = [
  {
    nombre: "knowledge:panel ignoro empresa.horario",
    patron: /\[knowledge:panel\] ignoro/,
    historia:
      "3.541 copias el 2026-09-24 (ocupaba la cola entera). Dedup por VALOR en knowledge.mjs; " +
      "medido sano el 2026-09-26 golpeando /health cinco veces sin que el log crezca.",
  },
];

// --- la decision (pura: ni docker, ni disco, ni reloj) ----------------------------------------

/**
 * Cuenta el ruido por TIEMPO, no por volumen.
 *
 * @param lineas        el `tail` del log, en orden cronologico.
 * @param ahoraIso      el borde derecho de la ventana.
 * @param ventanaHoras  cuanto mira hacia atras.
 * @param patron        que linea de condicion permanente se esta contando.
 * @param umbral        copias toleradas dentro de la ventana.
 * @returns `{veredicto, enVentana, historicas, sinFechar, ventana}` · veredicto:
 *          `sano` | `ahogado` | `no_medido`.
 */
export function juzgarRuidoDelLog({
  lineas,
  ahoraIso,
  ventanaHoras = VENTANA_HORAS,
  patron,
  umbral = UMBRAL_EN_VENTANA,
} = {}) {
  const vacio = { veredicto: "no_medido", enVentana: 0, historicas: 0, sinFechar: 0, ventana: null };
  if (!Array.isArray(lineas) || lineas.length === 0 || !patron) return vacio;
  const hasta = marcaDe(ahoraIso);
  if (!hasta) return vacio;
  const desde = new Date(hasta.getTime() - ventanaHoras * 3600_000);
  const ventana = { desde: desde.toISOString().slice(0, 19), hasta: hasta.toISOString().slice(0, 19) };

  // Marca ISO por posicion, para poder mirar hacia atras y hacia adelante desde cualquier linea.
  const marcas = lineas.map((l) => {
    const m = ISO_EN_EL_LOG.exec(String(l ?? ""));
    return m ? m[0] : null;
  });

  let enVentana = 0;
  let historicas = 0;
  let sinFechar = 0;

  for (let i = 0; i < lineas.length; i += 1) {
    if (!patron.test(String(lineas[i] ?? ""))) continue;
    const previa = marcaHaciaAtras(marcas, i);
    const posterior = marcaHaciaAdelante(marcas, i);
    if (previa && marcaDe(previa) >= desde) enVentana += 1;
    else if (posterior && marcaDe(posterior) < desde) historicas += 1;
    else if (previa && posterior && marcaDe(posterior) >= desde) enVentana += 1; // el bloque cruza el borde: se cuenta
    else sinFechar += 1; // no alcanza para afirmar nada: ni rojo inventado, ni verde regalado
  }

  // El orden importa: `sinFechar` gana sobre `sano`, porque un verde sin poder fechar es el falso
  // verde que este archivo existe para no repetir. No gana sobre `ahogado`: si ya hay ruido
  // probado dentro de la ventana, el veredicto esta decidido y lo de mas es detalle.
  let veredicto;
  if (enVentana > umbral) veredicto = "ahogado";
  else if (sinFechar > 0) veredicto = "no_medido";
  else veredicto = "sano";
  return { veredicto, enVentana, historicas, sinFechar, ventana };
}

/**
 * ¿La cola del log deja ver los eventos del objetivo?
 *
 * Es el sintoma, y es independiente del conteo de ruido: la cola puede estar limpia con miles de
 * copias historicas mas arriba. Rojo SOLO si el archivo tiene eventos y la cola no muestra
 * ninguno — sin eventos no hay nada que tapar, y llamar a eso «ahogado» es inventar un culpable
 * para un dia tranquilo.
 */
export function colaDejaVerLosEventos({ cola, lineasDelArchivo } = {}) {
  const enLaCola = contarEventos(cola);
  const enElArchivo = contarEventos(lineasDelArchivo);
  return { ve: enElArchivo === 0 || enLaCola > 0, enLaCola, enElArchivo };
}

function contarEventos(lineas) {
  if (!Array.isArray(lineas)) return 0;
  return lineas.filter((l) => EVENTOS_DEL_OBJETIVO.test(String(l ?? ""))).length;
}

function marcaDe(iso) {
  if (!iso) return null;
  const d = new Date(`${String(iso).slice(0, 19)}Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function marcaHaciaAtras(marcas, i) {
  for (let j = i - 1; j >= 0; j -= 1) if (marcas[j]) return marcas[j];
  return null;
}

function marcaHaciaAdelante(marcas, i) {
  for (let j = i + 1; j < marcas.length; j += 1) if (marcas[j]) return marcas[j];
  return null;
}

// --- la medicion viva -------------------------------------------------------------------------

function leerDelBotVivo() {
  const sh =
    `tail -${LINEAS_A_MIRAR} ${LOG_VIVO} 2>/dev/null; ` +
    `echo "---CORTE---"; tail -${LINEAS_DE_COLA} ${LOG_VIVO} 2>/dev/null`;
  const salida = execFileSync("docker", ["exec", CONTENEDOR, "sh", "-c", sh], {
    encoding: "utf8",
    timeout: 60_000,
    maxBuffer: 32 * 1024 * 1024,
  });
  const [arriba, abajo] = salida.split("---CORTE---");
  const lineas = String(arriba ?? "").split("\n").filter(Boolean);
  const cola = String(abajo ?? "").split("\n").filter(Boolean);
  if (lineas.length === 0) throw new Error(`${LOG_VIVO} vino vacio`);
  return { lineas, cola };
}

function medir() {
  let leido;
  try {
    leido = leerDelBotVivo();
  } catch (err) {
    console.log(`2 NO MEDIDO — no pude leer ${LOG_VIVO} en ${CONTENEDOR}: ${err.message.split("\n")[0]}`);
    return 2;
  }
  const { lineas, cola } = leido;
  const ahoraIso = new Date().toISOString().slice(0, 19);

  const ruidos = RUIDO_CONOCIDO.map((r) => ({
    ...r,
    ...juzgarRuidoDelLog({ lineas, ahoraIso, patron: r.patron }),
  }));
  const vista = colaDejaVerLosEventos({ cola, lineasDelArchivo: lineas });

  console.log(`log vivo: ${lineas.length} lineas miradas · ventana ${ruidos[0]?.ventana?.desde ?? "?"} -> ${ahoraIso} UTC`);
  for (const r of ruidos) {
    console.log(
      `  ruido «${r.nombre}»: ${r.veredicto} — ${r.enVentana} en la ventana · ` +
        `${r.historicas} historicas · ${r.sinFechar} sin fechar`,
    );
  }
  console.log(
    `  cola de ${LINEAS_DE_COLA}: ${vista.ve ? "deja ver los eventos" : "TAPADA"} — ` +
      `${vista.enLaCola} evento(s) en la cola · ${vista.enElArchivo} en las ${lineas.length} miradas`,
  );

  if (!vista.ve) {
    console.log(
      "1 AHOGADO — la cola del log no muestra ni un evento y el archivo los tiene: la medicion " +
        "del objetivo de este carril esta CIEGA (devuelve lineas y cero se~nal).",
    );
    return 1;
  }
  if (ruidos.some((r) => r.veredicto === "ahogado")) {
    console.log("1 AHOGADO — se esta emitiendo ruido AHORA: la cola se va a tapar sola.");
    return 1;
  }
  if (ruidos.some((r) => r.veredicto === "no_medido")) {
    console.log("2 NO MEDIDO — hay ruido que no se puede fechar: no afirmo sano ni ahogado.");
    return 2;
  }
  console.log("0 sano — la cola deja ver los eventos y no se emite ruido en la ventana.");
  return 0;
}

// --- self-check -------------------------------------------------------------------------------

function selfCheck() {
  const ahora = "2026-09-26T17:16:00";
  const patron = RUIDO_CONOCIDO[0].patron;
  const web = (iso) => `[onia-webhook] ${iso}.000Z conv=49 rama=respondio`;
  const ruido = () => "[knowledge:panel] ignoro `empresa.horario` de la fila del panel";

  // El caso del error propio: miles de copias viejas y cero recientes es SANO.
  const viejas = juzgarRuidoDelLog({
    lineas: [web("2026-09-26T10:23:04"), ...Array.from({ length: 1417 }, ruido), web("2026-09-26T10:48:48")],
    ahoraIso: ahora,
    patron,
  });
  assert.equal(viejas.veredicto, "sano");
  assert.equal(viejas.historicas, 1417);

  // Las mismas copias dentro de la ventana son ROJO: mide tasa, no volumen.
  assert.equal(
    juzgarRuidoDelLog({
      lineas: [web("2026-09-26T15:20:00"), ...Array.from({ length: 1417 }, ruido), web("2026-09-26T17:15:00")],
      ahoraIso: ahora,
      patron,
    }).veredicto,
    "ahogado",
  );

  // Sin poder fechar: NO MEDIDO, nunca verde.
  assert.equal(juzgarRuidoDelLog({ lineas: [ruido()], ahoraIso: ahora, patron }).veredicto, "no_medido");
  assert.equal(juzgarRuidoDelLog({ lineas: [], ahoraIso: ahora, patron }).veredicto, "no_medido");
  assert.equal(juzgarRuidoDelLog({ lineas: [web("2026-09-26T17:00:00")], ahoraIso: null, patron }).veredicto, "no_medido");

  // La cola tapada es roja aunque el archivo tenga los eventos; sin eventos no hay nada que tapar.
  assert.equal(
    colaDejaVerLosEventos({ cola: Array.from({ length: 80 }, ruido), lineasDelArchivo: ["x demo_agendada y"] }).ve,
    false,
  );
  assert.equal(colaDejaVerLosEventos({ cola: [web("2026-09-26T17:15:00")], lineasDelArchivo: [] }).ve, true);

  console.log("self-check OK — juzgarRuidoDelLog mide TASA por tiempo, y sin poder fechar sale NO MEDIDO.");
  return 0;
}

const esteArchivo = process.argv[1] && process.argv[1].endsWith("log_del_bot_ahogado.mjs");
if (esteArchivo) process.exit(process.argv.includes("--self-check") ? selfCheck() : medir());
