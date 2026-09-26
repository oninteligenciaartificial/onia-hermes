#!/usr/bin/env node
// Gate del AVISO a Sergio — el ultimo eslabon del objetivo de este carril.
//
// El objetivo dice "cada demo agendada o handoff le llega a Sergio" y se medía contando
// lineas `[aviso]` en el log. Ese numero llevaba turnos en 0 y NO se podia interpretar:
// 0 porque el circuito esta roto, o 0 porque no hubo ni un handoff real. Un numero que
// no puede ponerse rojo no es una medida, es decoracion.
//
// Este gate separa las dos cosas. Mide el CIRCUITO (cuatro eslabones, cada uno contra
// produccion) y aparte cuenta los EVENTOS. Asi "0 avisos" se lee entero:
//
//   circuito=ok  eventos=0  -> verde. Nadie pidio un humano hoy.
//   circuito=roto eventos=0 -> rojo.  El proximo que lo pida se pierde.
//
// Los cuatro eslabones, y por que cada uno esta medido donde esta:
//
//  1. flagEncendido    — del ENTORNO DEL PROCESO VIVO, no del `.env`. `webhook.env` vive
//                        fuera de git y el lanzador pasa las variables por lista blanca:
//                        ponerla en el archivo NO la hace llegar (medido 2026-09-04).
//  2. credencialesOk   — `getMe` + `getChat` contra la API de Telegram. No manda nada.
//                        Un token vencido o un chat_id equivocado hace fallar TODO aviso
//                        futuro sin dejar rastro hasta el dia que hay alguien esperando.
//  3. motorEmiteNotify — el motor DESPLEGADO tiene que emitir `notify_sergio` en LAS DOS
//                        ramas que el objetivo nombra (handoff Y demo agendada), no en una.
//                        Se maneja el engine real, no un mock. Ver `RAMAS_QUE_AVISAN`:
//                        hasta el 2026-09-07 esto medía sólo el handoff y el gate quedaba
//                        VERDE con el aviso de la demo borrado del motor.
//  4. textoAccionable  — el aviso tiene que nombrar la conversacion. Uno que no dice a
//                        quien contestarle no sirve (lo dice el propio aviso-telegram.mjs).
//
// Y si no puede medir —no hay `/opt/onia/bot`, el loop se mudo de maquina— el veredicto
// es `no_medido`, nunca `ok`. Esa es la direccion cara: un gate que firma "al dia" desde
// una maquina que no ve produccion apaga al unico instrumento que miraba el problema.
//
// Uso:  node avisos-vivo.mjs          (exit 0 verde · 1 rojo · 2 no se pudo medir)

import { execFileSync, spawnSync } from "node:child_process";
import net from "node:net";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

// El juicio "¿esta conversacion somos nosotros?" tiene UNA sola fuente en el repo: cruza los
// telefonos propios con el patron de nombre de prueba, y su comentario cita la conv 11 como
// caso medido. Este modulo tenia su propia version pobre (un `inbox === 7` pelado) y por eso
// contaba al dueño como lead. Se importa; copiarlo es como este par volvio a divergir.
// ⚠️ Ruta al repo, no al arbol desplegado: esto es un GATE, no codigo que corra en el bot
// (`webhook-server.sh` copia `/opt/onia/bot/*.mjs` plano y nada de aca lo carga en runtime).
import { esNuestra } from "../../../../scripts/objetivo_visible.mjs";

export const BOT_DIR = "/opt/onia/bot";
export const CONTENEDOR = "onia-center";

/** La maquina donde vive el bot desplegado. Se le pregunta cuando el disco local no lo tiene. */
export const VPS_DEL_BOT = "root@187.77.16.63";
const LLAVE_VPS = "/root/.ssh/onia_hermes_vps_ed25519";

/** Sin esto no hay nada que medir: es el modulo que el gate maneja de verdad. */
const MOTOR = "bot-engine.mjs";

/**
 * Devuelve el directorio del bot DESPLEGADO listo para importar, o `null` si no se puede.
 *
 * Por que existe: este gate importa el artefacto que CORRE, no el del repo — ahi esta todo su
 * valor, porque cada pieza ya tiene su test y lo unico que nadie prueba es el empalme entre
 * ellas. Eso lo ataba a `/opt/onia/bot`, que existe en el VPS y NO en nodo-casa, adonde se mudo
 * este carril el 2026-09-06: desde entonces el tercer numero del objetivo salia `no_medido` en
 * cada vuelta, con el circuito sano del otro lado.
 *
 * Los dos escalones, y por que NO hay un tercero que apunte al repo: traerse el artefacto
 * cuesta un `tar` por vuelta; apuntar al repo seria mas facil y **romperia lo que el gate
 * existe para probar** — mediria codigo commiteado y firmaria sobre produccion.
 */
export function resolverBotDesplegado(deps = {}) {
  const existe = deps.existsSync || existsSync;
  const correr = deps.spawnSync || spawnSync;

  // 1. El artefacto en el disco de esta maquina. Es el caso del VPS, y no sale a la red.
  if (existe(BOT_DIR)) return { dir: BOT_DIR, origen: "local" };

  // 2. nodo-casa: se lo trae del VPS a un temporal.
  const destino = mkdtempSync(join(tmpdir(), "onia-bot-desplegado-"));
  const fallar = () => {
    try {
      rmSync(destino, { recursive: true, force: true });
    } catch {
      /* que no exista ya es el resultado buscado */
    }
    return null;
  };

  let bajado;
  try {
    bajado = correr(
      "ssh",
      ["-o", "BatchMode=yes", "-o", "ConnectTimeout=15", "-i", LLAVE_VPS, VPS_DEL_BOT, `tar -cf - -C ${BOT_DIR} .`],
      { encoding: "buffer", maxBuffer: 64 * 1024 * 1024, timeout: 120_000 },
    );
  } catch {
    return fallar();
  }
  // El estado del `ssh` se mira SOLO, sin tuberia: `ssh | tar` devuelve el del ultimo comando,
  // asi que un VPS caido puede terminar en exit 0 con el destino vacio.
  if (!bajado || bajado.status !== 0) return fallar();

  let extraido;
  try {
    extraido = correr("tar", ["-xf", "-", "-C", destino], { input: bajado.stdout, timeout: 60_000 });
  } catch {
    return fallar();
  }
  if (!extraido || extraido.status !== 0) return fallar();

  // Y aun con los dos en 0 se verifica el ARTEFACTO, no el codigo de salida: lo que hace falta
  // es el motor en el destino, no que los comandos hayan dicho que si.
  if (!existe(join(destino, MOTOR))) return fallar();

  return { dir: destino, origen: "remoto" };
}

// ---------------------------------------------------------------------------
// Nucleo puro — esto es lo que prueba el test, sin tocar produccion
// ---------------------------------------------------------------------------

/**
 * La UNICA causa de salteo que es global al circuito: con el flag apagado no sale NINGUN
 * aviso, de ninguna conversacion. Por eso —y solo por eso— un envio posterior la desmiente.
 * Cualquier otro salteo es propio de su aviso y no lo cura que otro haya salido despues.
 * La escribe `aviso-telegram.mjs` (`reason: "aviso por Telegram apagado (ONIA_BOT_TG_AVISO)"`).
 */
export const CAUSA_GLOBAL_DE_SALTEO = "ONIA_BOT_TG_AVISO";

/** El `(motivo)` con el que el motor pidio el aviso: `[aviso] skipped (cuota_agotada): ...`. */
function motivoDelAviso(linea) {
  return /\[aviso\]\s+\w+\s+(?:conv=\d+\s+)?\(([^)]+)\)/.exec(String(linea))?.[1] || "sin motivo en el log";
}

/**
 * Cuenta los avisos del log por su resultado real. Sólo mira lineas `[aviso]`: el log del
 * webhook mezcla `[n8n]` y una linea por mensaje, y contar de mas inventa avisos.
 *
 * Y separa los salteos VIGENTES de los ya curados. El log del webhook es append-only y no
 * se rota (51.774 lineas el 2026-09-12): contar la historia entera dejaba este gate en rojo
 * para siempre por dos lineas del 4-sep, anteriores al dia en que se encendio el flag. Un
 * rojo que no puede volver a verde deja de mirarse, y entonces el rojo de verdad llega
 * indistinguible del de siempre. La pregunta no es "¿hubo un salteo alguna vez?" sino
 * "¿la causa sigue viva?".
 */
export function contarEventos(lineas = []) {
  const avisos = (Array.isArray(lineas) ? lineas : []).filter((l) => String(l).includes("[aviso]"));
  const conEstado = (estado) => avisos.filter((l) => new RegExp(`\\[aviso\\]\\s+${estado}\\b`).test(l)).length;

  // Posicion del ultimo envio exitoso: todo lo anterior a el ya fue desmentido POR EL
  // CIRCUITO, que volvio a mandar. Se compara por orden en el log, que es el orden real.
  let ultimoEnvio = -1;
  avisos.forEach((l, i) => {
    if (/\[aviso\]\s+sent\b/.test(String(l))) ultimoEnvio = i;
  });

  const vigentes = [];
  avisos.forEach((l, i) => {
    if (!/\[aviso\]\s+skipped\b/.test(String(l))) return;
    const curado = String(l).includes(CAUSA_GLOBAL_DE_SALTEO) && ultimoEnvio > i;
    if (!curado) vigentes.push(motivoDelAviso(l));
  });

  return {
    total: avisos.length,
    enviados: conEstado("sent"),
    salteados: conEstado("skipped"),
    fallidos: conEstado("failed"),
    salteadosVigentes: vigentes.length,
    motivosVigentes: vigentes,
  };
}

/**
 * De QUIEN es cada aviso, en el orden del log.
 *
 * POR QUE EXISTE. El 2026-09-12 este gate firmaba `avisos enviados 3 — circuito sano y
 * avisando` sobre CINCO eventos que eran, todos, nuestros: conv 53, 55 y 57 del inbox 7
 * (`ZZ QA Clinica Chatbot`, el banco de pruebas) y conv 11 del inbox 5, contacto `Sergio`
 * — o sea Sergio Urcullo probando su propio bot. Cero desconocidos. La frase es cierta
 * sobre el circuito y falsa sobre lo que el carril tiene que saber, que es si un LEAD real
 * llega a Sergio Urcullo. Un instrumento que nunca vio a su sujeto tiene que decirlo.
 *
 * El `conv` sale de la propia linea cuando esta (`[aviso] sent conv=11 (...)`), y si no —las
 * del 4-sep salieron sin el— de la linea INMEDIATAMENTE anterior, que es la del webhook que
 * lo produjo. No es una suposicion: el log es append-only y esta en orden, la misma
 * propiedad con la que `contarEventos` cura los salteos. El item de la cola daba esto por
 * imposible ("un aviso que no salio y no dice a quien no se puede reparar") y era falso:
 * asi se identificaron las dos conversaciones del 4-sep.
 *
 * Nunca inventa: si no hay `conv` en ninguna de las dos, queda `null`. Atribuirle un aviso
 * a la conversacion equivocada manda a buscar a la persona que no es.
 */
export function conversacionesDeAvisos(lineas = []) {
  const todas = Array.isArray(lineas) ? lineas.map(String) : [];
  const eventos = [];
  todas.forEach((l, i) => {
    if (!l.includes("[aviso]")) return;
    const propio = /\[aviso\]\s+\w+\s+conv=(\d+)/.exec(l)?.[1];
    // Solo la vecina INMEDIATA, y solo si es una linea de webhook: el aviso se loguea en el
    // callback del mismo turno, asi que cualquier otra distancia ya es adivinar.
    const previa = todas[i - 1] || "";
    const vecino = !propio && previa.includes("[onia-webhook]") ? /\bconv=(\d+)/.exec(previa)?.[1] : null;
    const conv = propio ?? vecino ?? null;
    eventos.push({
      estado: /\[aviso\]\s+(\w+)/.exec(l)?.[1] || null,
      motivo: motivoDelAviso(l),
      conv: conv === null ? null : Number(conv),
    });
  });
  return eventos;
}

/**
 * El inbox del banco de pruebas. Sus conversaciones NO son leads: las siembran nuestras
 * propias sondas (`sonda_widget.mjs` y los deploys), y contarlas como gente esperando fue
 * exactamente lo que mando a este carril a buscar "dos personas" que no existian.
 */
export const INBOX_BANCO_DE_PRUEBAS = 7;

/**
 * Separa los avisos que somos NOSOTROS de los que vienen de afuera.
 *
 * `inboxPorConv` es un Map conv->inbox, o `null` cuando no se pudo preguntar. Es TRI-ESTADO
 * a proposito: sin poder consultar la base, "esto es un lead real" es una suposicion, y la
 * suposicion optimista es justo la que dejo pasar el agujero. Un conv que la base no conoce
 * queda en `sinUbicar`, nunca en `reales`.
 *
 * ⚠️ El sujeto NO es el numero de inbox. Esa fue la primera version y fallaba abierto en las
 * dos mitades, medido en produccion el 2026-09-13: el inbox 3 (`ONIA Demo`) esta vivo con 8
 * conversaciones nuestras y no estaba en la lista, y el DUEÑO probando desde su celular entra
 * por el inbox 5 —el de los leads de verdad— asi que ningun inbox lo delata. El objetivo del
 * carril lo dice con todas las letras: *"una persona que no somos nosotros — ni una org QA, ni
 * el probador, ni Sergio desde su celular"*. Por eso se preguntan las DOS cosas: el inbox del
 * banco de pruebas (que alcanza cuando el contacto no tiene ni nombre) y `esNuestra`, que
 * cruza telefono propio con nombre de prueba. Cualquiera de las dos vuelve la conversacion
 * nuestra; el sesgo es el correcto para un gate, porque el falso VERDE es el que apaga.
 */
export function clasificarEventos(eventos = [], inboxPorConv = null) {
  const lista = Array.isArray(eventos) ? eventos : [];
  const medido = inboxPorConv instanceof Map;
  const nuestros = [];
  const reales = [];
  const sinUbicar = [];
  const contactos = new Map();
  // Se cuentan CONVERSACIONES, no eventos: dos avisos de la misma persona son una persona.
  // La primera version imprimio `leads 2 (conv 11, 11)` sobre un solo interesado.
  const vistas = new Set();
  for (const ev of lista) {
    const conv = ev?.conv ?? null;
    if (conv === null || vistas.has(conv)) continue;
    vistas.add(conv);
    if (!medido) {
      sinUbicar.push(conv);
      continue;
    }
    // El mapa acepta el inbox pelado o `{inbox, contacto, telefono}`. El inbox por si solo no
    // alcanza (ver arriba); el contacto es lo que delata al dueño y a las sondas viejas.
    const dato = inboxPorConv.get(conv);
    const esObjeto = dato && typeof dato === "object";
    const inbox = esObjeto ? dato.inbox : dato;
    if (esObjeto && dato.contacto) contactos.set(conv, dato.contacto);
    if (inbox === undefined || inbox === null) sinUbicar.push(conv);
    else if (inbox === INBOX_BANCO_DE_PRUEBAS) nuestros.push(conv);
    else if (!esObjeto) sinUbicar.push(conv); // dato incompleto: sin contacto no hay con que descartarnos
    else if (esNuestra({ contacto: dato.contacto, telefono: dato.telefono })) nuestros.push(conv);
    else reales.push(conv);
  }
  return { medido, nuestros, reales, sinUbicar, contactos };
}

/**
 * Cruza los eventos que la BASE registra contra los avisos que el LOG nombra.
 *
 * POR QUE EXISTE, medido el 2026-09-26 contra produccion. Todo lo de arriba deriva su
 * universo de eventos del log: `contarEventos` cuenta lineas `[aviso]`. Con eso, un handoff
 * que ocurrio y NO llego a la linea de aviso no aparece como fallo — aparece como que no
 * hubo evento. La cabecera de este archivo lo dice con todas las letras: `circuito=ok
 * eventos=0 -> verde. Nadie pidio un humano hoy`. Esa inferencia no se sostiene: el log
 * cuenta lo que el codigo de aviso HIZO, y la pregunta del objetivo es que paso con lo que
 * OCURRIO. Los dos numeros de ese dia: `onia_center.bot_conversations` tenia DOCE filas en
 * `handoff_humano` y el log tenia avisos de TRES conversaciones — y el veredicto era
 * `ok · circuito sano`. Diez personas pidieron un humano adentro de la ventana que el log
 * cubre y no hay una sola linea que las nombre.
 *
 * La base es el registro durable: `bot_stage` lo escribe el motor y queda. El log es lo que
 * el aviso alcanzo a decir. Conciliar los dos es lo unico que distingue "nadie pidio" de
 * "alguien pidio y se perdio", que es exactamente la distincion que este gate nacio a hacer
 * y que hasta hoy solo hacia del lado del log.
 *
 * LA VENTANA, y por que se es conservador con su borde izquierdo. El log arranca donde
 * arranca; un handoff anterior no tiene por que estar ahi. Acusar al circuito por un evento
 * que el log no pudo ver es un FALSO ROJO, y este archivo ya pago uno: el 2026-09-12 dijo
 * "alguien pidio un humano y nadie se entero" sobre dos salteos que el propio log desmentia,
 * y eso manda a arreglar lo que no esta roto. Por eso solo entra a la conciliacion el evento
 * cuyo `desde` —el inicio de la conversacion, la cota mas temprana en que el handoff pudo
 * pasar— cae DENTRO de la ventana. El resto se cuenta y se NOMBRA como fuera de alcance:
 * no es cero, es "no lo puedo mirar".
 *
 * @param eventosEnLaBase `[{conv, estado, desde}]` con `desde` en ISO, de la base.
 * @param convsConAviso   numeros de conversacion que el log nombra en un aviso.
 * @param ventana         `{desde, hasta}` en ISO, derivada del propio log.
 */
export function conciliarAvisos({ eventosEnLaBase, convsConAviso, ventana } = {}) {
  const vacio = { medido: false, sinAviso: [], fueraDeAlcance: [], conAviso: [] };
  // Tri-estado: sin la base o sin la ventana la respuesta es "no pude preguntar", nunca cero.
  // Un `[]` por defecto aca seria un verde firmado sobre una pregunta que no se hizo.
  if (!Array.isArray(eventosEnLaBase) || !ventana?.desde || !ventana?.hasta) return vacio;
  const avisados = new Set((convsConAviso || []).filter((n) => Number.isInteger(n) && n > 0));
  const sinAviso = [];
  const fueraDeAlcance = [];
  const conAviso = [];
  for (const ev of eventosEnLaBase) {
    const desde = String(ev?.desde || "");
    // Comparacion lexicografica de ISO: es la misma que usa el orden del log.
    if (!desde || desde < ventana.desde || desde > ventana.hasta) fueraDeAlcance.push(ev);
    else if (avisados.has(ev.conv)) conAviso.push(ev);
    else sinAviso.push(ev);
  }
  return { medido: true, sinAviso, fueraDeAlcance, conAviso };
}

/**
 * La ventana que el AVISO pudo cubrir, que no es la del log.
 *
 * POR QUE EXISTE, medido el 2026-09-26 contra produccion. `conciliarAvisos` fue conservador
 * con su borde izquierdo y eligio la referencia equivocada: la ventana del log. La pregunta
 * que contesta es "¿el circuito perdio este evento?", y para poder perderlo el codigo que
 * escribe la linea `[aviso]` tiene que haber estado CORRIENDO. Los dos numeros de ese dia:
 *
 *   ventana del log         desde `2026-08-28T22:22:51`  (primera marca del propio log)
 *   primera linea [aviso]         `2026-09-04T03:41:45`  (linea 50803 del log vivo)
 *
 * Seis dias de brecha, y OCHO de los diez eventos que el gate acusaba vivian ahi: handoffs
 * anteriores al aviso mismo, estructuralmente inavisables. El veredicto salia `roto — 10
 * pedidos que NINGUN aviso nombra, ya se perdieron, hay que ir a buscar a esas personas`, y
 * ese rojo no lo puede curar nadie: es historia. Un rojo permanente se lee como el ambiental
 * de siempre, y el dia que el circuito se rompa DE VERDAD el veredicto sera identico al de
 * hoy — el gate pierde justo la unica cosa que tiene que poder decir, "se rompio HOY".
 *
 * El borde es el MAXIMO de los dos, nunca uno solo:
 *  - el log manda cuando arranca despues (alguien lo roto): mas atras no hay lineas que mirar.
 *  - el primer aviso manda cuando arranca despues: mas atras no habia quien escribiera.
 *
 * Y sin una sola linea `[aviso]` en el log no hay borde: no se puede distinguir "no habia
 * codigo" de "se perdio", y eso es `no_medido`. `desde: null` hace que `conciliarAvisos`
 * devuelva su tri-estado solo, sin una rama nueva. Los eslabones del circuito
 * (`motorEmiteNotify` y compania) siguen contestando ahi: son los que ven un aviso que no
 * emite nunca, que es la unica cosa que este borde podria tapar.
 *
 * @param ventana     `{desde, hasta}` en ISO, del propio log.
 * @param primerAviso ISO de la primera evidencia de que el aviso emitia, o `null`.
 */
export function ventanaDelAviso({ ventana, primerAviso } = {}) {
  if (!ventana?.desde || !ventana?.hasta) return null;
  if (!primerAviso) return { desde: null, hasta: ventana.hasta, borde: "sin_evidencia" };
  // Comparacion lexicografica de ISO: el mismo eje que usa la conciliacion.
  if (primerAviso > ventana.desde) return { desde: primerAviso, hasta: ventana.hasta, borde: "primer_aviso" };
  return { desde: ventana.desde, hasta: ventana.hasta, borde: "log" };
}

/**
 * La linea que le sirve al objetivo del carril. Vive aparte del reporte para que se pueda
 * probar: es una AFIRMACION sobre produccion, y hasta hoy no tenia ni un caso.
 */
export function lecturaDeEventos({ veredicto, eventos, circuitoSano, origen, conciliacion, origenPerdidos } = {}) {
  const ev = eventos || contarEventos([]);
  const noSalieron = (ev.salteadosVigentes ?? ev.salteados) + ev.fallidos;
  // Va ANTES que todo lo demas porque es la unica lectura que habla de eventos que el log no
  // tiene: si se deja abajo, el `enviados === 0` de mas adelante contesta "sin eventos reales
  // todavia" sobre gente que si pidio. Ese era el agujero.
  const perdidos = conciliacion?.medido ? conciliacion.sinAviso.length : 0;
  if (perdidos > 0) {
    const cabeza = `la base registra ${perdidos} pedido(s) de humano/demo que NINGUN aviso nombra`;
    // A QUIEN se perdio cambia lo que hay que hacer, y el 2026-09-26 esta linea mandaba a
    // perseguir a nuestras propias sondas: los diez sujetos eran inbox 7 o contacto `Sonda
    // QA`. Sigue siendo rojo —el circuito perdio eventos— pero no hay a quien ir a buscar.
    // Solo absuelve con la pregunta HECHA: `medido` en false es ignorancia, y en la duda se
    // va a buscar. Si se leyera como "0 leads" se firmaria una absolucion sin preguntar.
    if (origenPerdidos?.medido && origenPerdidos.reales.length === 0) {
      const detalle = [
        origenPerdidos.nuestros.length ? `${origenPerdidos.nuestros.length} del banco de pruebas` : "",
        origenPerdidos.sinUbicar.length ? `${origenPerdidos.sinUbicar.length} sin ubicar` : "",
      ].filter(Boolean).join(" · ");
      return `${cabeza}, y NINGUNO es de un lead (${detalle}) — el circuito perdio eventos, pero no hay a quien ir a buscar`;
    }
    const quienes = origenPerdidos?.medido && origenPerdidos.reales.length
      ? ` (${origenPerdidos.reales.map((c) => `conv ${c}${origenPerdidos.contactos?.get(c) ? ` · ${origenPerdidos.contactos.get(c)}` : ""}`).join(", ")})`
      : "";
    return `${cabeza} — ya se perdieron, hay que ir a buscar a esas personas${quienes}`;
  }
  // El motivo se CITA, no se supone. El 2026-09-12 esta linea decia "alguien pidio un humano
  // y nadie se entero" sobre dos salteos que el propio log desmentia (`cuota_agotada` y
  // `pregunta_precio_recepcion`), mientras el unico `pidio_humano_recepcion` habia salido bien.
  const cuales = (ev.motivosVigentes || []).join(", ");
  if (veredicto !== "ok") {
    if (veredicto !== "roto") return "no se pudo medir contra produccion";
    return circuitoSano
      ? `el circuito responde, pero ${noSalieron} aviso(s) NO salieron${cuales ? ` (${cuales})` : ""} y nada posterior lo desmiente`
      : "EL PROXIMO QUE PIDA UN HUMANO SE PIERDE";
  }
  if (ev.enviados === 0) return "circuito sano, sin eventos reales todavia";
  // Hay envios. La pregunta que faltaba: ¿alguno fue de alguien de AFUERA?
  if (origen?.medido && origen.reales.length === 0) {
    const delBanco = origen.nuestros.length;
    return `circuito sano, pero NINGUN aviso es de un lead: ${delBanco} nuestro(s)${
      origen.sinUbicar.length ? ` y ${origen.sinUbicar.length} sin ubicar` : ""
    } — nunca se probo con un desconocido`;
  }
  if (origen && !origen.medido) return "circuito sano y avisando (no se pudo ubicar de quien son los avisos)";
  return "circuito sano y avisando";
}

/**
 * El veredicto. `circuito` en null significa "no se pudo medir" y NO puede dar verde.
 */
export function diagnosticar({ circuito, eventos, conciliacion }) {
  const ev = eventos || contarEventos([]);
  if (!circuito) {
    return { veredicto: "no_medido", motivos: ["no se pudo medir el circuito contra produccion"], eventos: ev };
  }

  const motivos = [];
  // Un eslabon que quedo en `null` no se pudo PREGUNTAR. No es lo mismo que haber recibido
  // un no, y mezclarlos manda a arreglar lo que funciona: el 2026-09-08 este gate declaro
  // "el token o el chat de Telegram no responden" con los dos sanos, porque el instrumento
  // no llegaba a preguntar. La ignorancia se reporta como ignorancia.
  const sinMedir = [];
  for (const [eslabon, etiqueta] of [
    ["flagEncendido", "flagEncendido: el proceso vivo no tiene ONIA_BOT_TG_AVISO en true"],
    ["credencialesOk", "credencialesOk: el token o el chat de Telegram no responden"],
    ["motorEmiteNotify", "motorEmiteNotify: el motor no emite notify_sergio ante un pedido de humano"],
    ["textoAccionable", "textoAccionable: el aviso no nombra la conversacion a la que contestar"],
  ]) {
    if (circuito[eslabon] === null) sinMedir.push(`${eslabon}: no se pudo preguntar (¿hay red desde esta maquina?)`);
    else if (!circuito[eslabon]) motivos.push(etiqueta);
  }

  // Un aviso que salio mal manda sobre cualquier chequeo de configuracion: es una persona
  // esperando que Sergio le escriba, y el circuito "bien configurado" no la atendio.
  if (ev.fallidos > 0) motivos.push(`${ev.fallidos} aviso(s) FALLIDO(s) en el log`);
  // `?? ev.salteados`: si llega un objeto de eventos sin el campo nuevo, se cae del lado
  // seguro —cuenta todos— en vez de firmar verde por una propiedad ausente.
  const salteadosVivos = ev.salteadosVigentes ?? ev.salteados;
  if (salteadosVivos > 0) {
    // El motivo se CITA del log. Hasta el 2026-09-12 este gate decia "alguien pidio un
    // humano" sobre dos salteos que eran `cuota_agotada` y `pregunta_precio_recepcion`:
    // acusar con una causa inventada manda a arreglar lo que no esta roto.
    const cuales = (ev.motivosVigentes || []).join(", ");
    motivos.push(
      `${salteadosVivos} aviso(s) SALTEADO(s) sin un envio posterior que los desmienta${cuales ? `: ${cuales}` : ""}`,
    );
  }

  // La conciliacion con la base. Es el unico motivo que puede nacer de un evento que el log
  // NO nombra, y por eso es el unico que ve la clase de fallo en la que este gate era ciego:
  // los otros necesitan una linea `[aviso]` para existir. Sin base no hay verde — `medido`
  // en false es ignorancia, y la ignorancia se reporta como ignorancia.
  if (!conciliacion || conciliacion.medido !== true) {
    sinMedir.push("conciliacion: no se pudo preguntarle a la base que eventos ocurrieron (el log solo no alcanza)");
  } else if (conciliacion.sinAviso.length) {
    const cuales = conciliacion.sinAviso.map((e) => `conv ${e.conv} (${e.estado})`).join(", ");
    motivos.push(
      `${conciliacion.sinAviso.length} evento(s) en la base SIN un aviso que los nombre, dentro del alcance en que el aviso YA emitia: ${cuales}`,
    );
  }

  // Prioridad: evidencia de fallo > no haber podido preguntar > verde. Un rojo MEDIDO no lo
  // tapa un eslabon sin medir, y un eslabon sin medir nunca se firma como verde.
  if (motivos.length) return { veredicto: "roto", motivos: motivos.concat(sinMedir), eventos: ev };
  if (sinMedir.length) return { veredicto: "no_medido", motivos: sinMedir, eventos: ev };
  return { veredicto: "ok", motivos, eventos: ev };
}

// ---------------------------------------------------------------------------
// Medicion contra produccion
// ---------------------------------------------------------------------------

function sh(cmd, args, timeout = 20000) {
  try {
    return execFileSync(cmd, args, { encoding: "utf8", timeout, stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return null;
  }
}

/** El entorno del PROCESO, que es lo unico que dice el estado real de un flag. */
function envDelProcesoVivo() {
  const ps = sh("docker", ["exec", CONTENEDOR, "sh", "-c", "ps -eo pid,args"]);
  if (!ps) return null;
  const linea = ps.split("\n").find((l) => l.includes("webhook-server") && !l.includes("grep"));
  const pid = linea?.trim().split(/\s+/)[0];
  if (!pid) return null;
  const environ = sh("docker", ["exec", CONTENEDOR, "sh", "-c", `tr '\\0' '\\n' < /proc/${pid}/environ`]);
  if (!environ) return null;
  const env = {};
  for (const l of environ.split("\n")) {
    const i = l.indexOf("=");
    if (i > 0) env[l.slice(0, i)] = l.slice(i + 1);
  }
  return env;
}

/**
 * El piso de tiempo que necesita UN intento de conexion para que preguntar sea posible.
 *
 * Node corta cada intento a los 250 ms (`autoSelectFamilyAttemptTimeout`). Desde nodo-casa
 * la ruta IPv6 a api.telegram.org es ENETUNREACH y la IPv4 tarda mas que ese corte, asi que
 * `fetch` muere en ~350 ms con ETIMEDOUT sobre un host que `curl` atiende con 200. Medido el
 * 2026-09-08: con el corte en 2000 ms, la misma llamada devuelve 200 en 2,0 s y 0,5 s.
 */
export const ATENCION_MINIMA_MS = 2000;

/** Sube el piso del transporte si esta por debajo. Nunca baja uno mas generoso. */
export function asegurarTransporteQueAguanta(red = net) {
  if (red.getDefaultAutoSelectFamilyAttemptTimeout() < ATENCION_MINIMA_MS) {
    red.setDefaultAutoSelectFamilyAttemptTimeout(ATENCION_MINIMA_MS);
  }
}

/** `getMe` + `getChat`. No manda un solo mensaje: no se le grita al lobo para probar el grito. */
async function credencialesResponden(token, chatId) {
  // Que el proceso vivo no las tenga SI es una rotura real: sin token no hay aviso posible.
  if (!token || !chatId) return false;
  asegurarTransporteQueAguanta();

  // Tres estados, y la diferencia es el punto: `true` contesto que si, `false` contesto que
  // no, `null` NO SE PUDO PREGUNTAR. Colapsar los dos ultimos en `false` es lo que hizo que
  // este gate acusara a un token sano (2026-09-08).
  const pedir = async (metodo, qs = "") => {
    try {
      const r = await fetch(`https://api.telegram.org/bot${token}/${metodo}${qs}`, {
        signal: AbortSignal.timeout(25000),
      });
      return (await r.json())?.ok === true;
    } catch {
      return null;
    }
  };

  const me = await pedir("getMe");
  if (me !== true) return me; // null (no se pudo) o false (token rechazado): cada uno es lo suyo
  return await pedir("getChat", `?chat_id=${encodeURIComponent(chatId)}`);
}

/**
 * Las DOS ramas que el objetivo del carril nombra: "cada demo agendada O handoff le llega a
 * Sergio". Son HERMANAS y se emiten desde funciones DISTINTAS del motor, con payloads de
 * forma distinta (el handoff trae `reason`, la demo no), asi que probar una no dice nada de
 * la otra.
 *
 * 🔴 POR QUE ESTA LISTA EXISTE, medido el 2026-09-07. Este gate manejaba el motor SOLO hasta
 * un handoff, y su propio encabezado lo declaraba ("ante un pedido de humano"). Borrando
 * entero el `notify_sergio` de la rama de agendar, el gate seguia dando VERDE — o sea que el
 * dia que se rompa el aviso de la demo, el unico instrumento que mira este objetivo dice
 * "circuito: ok" y ningun numero se mueve, mientras cada demo reservada se pierde en silencio.
 * Es la rama que lleva la plata: un prospecto que YA eligio horario.
 *
 * Una rama que no se puede manejar es ROJO, nunca un salteo: ese es el modo de falla del que
 * venimos.
 */
export const RAMAS_QUE_AVISAN = Object.freeze(["handoff", "demo_agendada"]);

/**
 * La traduccion rama-del-motor -> estado que queda escrito en la base. Vive en UN lugar
 * porque las dos mitades de este gate hablan de LO MISMO por nombres distintos: el motor
 * emite la rama `handoff`, y lo que sobrevive en `onia_center.bot_conversations` es
 * `bot_stage='handoff_humano'`. Con la traduccion repartida, agregar una rama que avisa deja
 * al conciliador buscando un estado que nadie escribe — y eso no sale rojo: sale VACIO.
 */
export const ESTADO_POR_RAMA = Object.freeze({ handoff: "handoff_humano", demo_agendada: "demo_agendada" });
export const ESTADOS_QUE_AVISAN = Object.freeze(RAMAS_QUE_AVISAN.map((r) => ESTADO_POR_RAMA[r]));

/**
 * Maneja el motor DESPLEGADO hasta CADA una de las ramas de `RAMAS_QUE_AVISAN` y arma el
 * aviso con el `construirAviso` desplegado. Es el unico eslabon que prueba que las piezas
 * encajan entre si: cada una tiene su test, y aun asi el empalme puede estar cambiado de
 * nombre.
 *
 * `emite`/`accionable` son la Y de todas las ramas: basta que una falle para que el circuito
 * este roto, porque cada una es un prospecto distinto que se pierde.
 */
export async function motorProduceAviso(dir) {
  try {
    const mod = (archivo) => pathToFileURL(join(dir, archivo)).href;
    const engine = await import(mod(MOTOR));
    const { DEFAULT_CONFIG, createBotConfig } = await import(mod("config.mjs"));
    const { construirAviso } = await import(mod("aviso-telegram.mjs"));

    const ahora = () => new Date().toISOString();

    // Los horarios de `DEFAULT_CONFIG` vienen `pending: true` (placeholders), y con esos el
    // motor cae en "no tengo horarios libres" y NUNCA llega a agendar. Produccion los carga
    // de `ONIA_BOT_SLOTS`; aca se inyectan dos reales y futuros para que la rama se maneje
    // siempre, incluso el dia que el renovador no haya corrido.
    const futuro = new Date(Date.now() + 72 * 3600 * 1000).toISOString();
    const conHorarios = createBotConfig({
      slots: [
        { key: "A", label: "horario A del gate", startAt: futuro, pending: false },
        { key: "B", label: "horario B del gate", startAt: futuro, pending: false },
      ],
    });

    // Cada rama: el guion que la dispara y la config que hace falta para llegar.
    const guiones = {
      handoff: { config: DEFAULT_CONFIG, dice: "quiero hablar con un humano por favor" },
      demo_agendada: { config: conHorarios, dice: "A" },
    };

    const ramas = {};
    let ejemplo = null;

    for (const kind of RAMAS_QUE_AVISAN) {
      const { config, dice } = guiones[kind];
      let estado = engine.createState({ conversationKey: "chatwoot:0", leadKey: "gate", channel: "web" });
      estado = engine.step(estado, { text: "Hola", receivedAt: ahora() }, { config }).nextState;
      const r = engine.step(estado, { text: dice, receivedAt: ahora() }, { config });

      const notify = (r.sideEffects || []).filter((e) => e.type === "notify_sergio").map((e) => e.payload);
      // Se exige el `kind` esperado, no "algun notify": si la rama emite otra cosa (un
      // `sin_horarios` en vez de la demo) el empalme esta roto igual.
      const deLaRama = notify.filter((p) => String(p?.kind) === kind);
      if (deLaRama.length === 0) {
        ramas[kind] = { emite: false, accionable: false };
        continue;
      }

      // El canal va porque este gate imprime "lo que recibiria Sergio": sin el, el ejemplo sale
      // MAS POBRE que el aviso real y el instrumento deja de mostrar lo que mide.
      const aviso = construirAviso({
        notify: deLaRama,
        conversationId: 4242,
        stageAfter: r.nextState?.botStage,
        canal: "Channel::WebWidget",
      });
      // "Accionable" = nombra la conversacion. Sin eso Sergio recibe un timbre sin puerta.
      const accionable = Boolean(aviso?.texto?.includes("4242")) && aviso?.conversationId === 4242;
      ramas[kind] = { emite: true, accionable };
      if (!ejemplo) ejemplo = aviso?.texto;
    }

    return {
      emite: RAMAS_QUE_AVISAN.every((k) => ramas[k]?.emite),
      accionable: RAMAS_QUE_AVISAN.every((k) => ramas[k]?.accionable),
      ramas,
      ejemplo,
    };
  } catch {
    return null;
  }
}

/**
 * La ruta del log DENTRO del contenedor, derivada del propio `webhook-server.sh`. Se DERIVA
 * y no se escribe aca: el dueño de esa ruta es el script, y una copia mia se desincroniza
 * sin que nada se ponga rojo. Si la linea deja de existir devuelve `null`, nunca una ruta
 * inventada que leeria vacio para siempre.
 */
function archivoDeLog(dir) {
  try {
    return /^LOGFILE="([^"]+)"/m.exec(readFileSync(join(dir, "webhook-server.sh"), "utf8"))?.[1] || null;
  } catch {
    return null;
  }
}

/**
 * Las lineas de AVISO del log del proceso vivo.
 *
 * Por que NO usa `webhook-server.sh logs`, que era lo natural y es lo que hacia: ese
 * subcomando es `tail -n ${2:-50}`, o sea que llamarlo sin argumento mira 50 lineas y nada
 * mas. Medido el 2026-09-12 contra produccion: el log vivo pesaba 2,7 MB con CINCO lineas
 * `[aviso]` entre cientos por mensaje, y este gate informaba `eventos: 0 avisos — circuito
 * sano, sin eventos reales todavia` teniendo DOS avisos salteados adentro, que son dos
 * personas que pidieron un humano y a Sergio Urcullo nunca le llego nada. `diagnosticar` ya
 * sabia ponerse rojo con un salteado: la ventana le tapaba la evidencia.
 *
 * Y pedir el log ENTERO tampoco alcanza, que fue el primer arreglo y salia verde igual:
 * `execFileSync` corta en 1 MB por defecto, asi que 2,7 MB devuelven `null` y el gate vuelve
 * a decir 0, ahora por el otro lado. Por eso el filtro va DONDE VIVE EL LOG: la salida queda
 * acotada por construccion y no tiene techo que alcanzar cuando el log crezca. `docker` es el
 * mismo shim que usa el resto del archivo, asi que se sigue midiendo produccion desde las dos
 * maquinas.
 */
export function lineasDelLog(dir) {
  if (!dir) return [];
  const archivo = archivoDeLog(dir);
  if (!archivo) return [];
  // El `|| true` es para que un log SIN avisos no se lea como error: `grep` sale 1 cuando no
  // encuentra nada, y `sh()` convierte cualquier salida distinta de 0 en `null`.
  // `-B 1` trae la linea del webhook que produjo cada aviso: es de donde sale el `conv` de
  // los avisos viejos, que salieron sin el (ver `conversacionesDeAvisos`). Sigue acotado por
  // construccion —dos lineas por evento, no el log— que es la propiedad por la que el filtro
  // vive aca adentro y no en el lector. `grep` separa los grupos no contiguos con `--`, que
  // no contiene `[aviso]` ni `[onia-webhook]`: los dos consumidores lo ignoran solos.
  const cmd = `grep -B 1 -F '[aviso]' ${archivo} 2>/dev/null || true`;
  const out = sh("docker", ["exec", CONTENEDOR, "sh", "-c", cmd], 30000);
  return out ? out.split("\n").filter(Boolean) : [];
}

/**
 * El inbox de cada conversacion, preguntandole a la base de Chatwoot. `null` cuando no se
 * pudo preguntar — de ahi sale el tri-estado de `clasificarEventos`.
 *
 * El nombre del contenedor se DERIVA (`docker ps`), nunca se clava: Swarm le pega un sufijo
 * distinto en cada re-deploy (`onia-chatbot_chatwoot-db.1.sddet2j4f4gvnrozj4t5b1850`), asi
 * que un nombre escrito a mano se rompe solo y el gate se quedaria ciego en verde.
 */
export function inboxPorConversacion(convs = []) {
  // Enteros y nada mas: estos numeros salen del log y viajan a un SQL.
  const ids = [...new Set((convs || []).filter((n) => Number.isInteger(n) && n > 0))];
  if (!ids.length) return new Map();
  const nombres = sh("docker", ["ps", "--format", "{{.Names}}"], 20000);
  const db = (nombres || "").split("\n").find((n) => n.includes("chatwoot-db"));
  if (!db) return null;
  // El contacto viaja con el inbox: el inbox dice si es el banco de pruebas, y el NOMBRE Y EL
  // TELEFONO dicen si el "lead" somos nosotros. El telefono no es un adorno — es la unica
  // prueba dura que tiene `esNuestra` del dueño probando (conv 11, `+59171654992`), y sin el
  // esta funcion le entrega a `clasificarEventos` un dato incompleto que la hace fallar EN
  // VERDE. Aplanado por si trae saltos de linea.
  const sql =
    "select c.id, c.inbox_id, replace(coalesce(ct.name,'-'), E'\\n', ' '), coalesce(ct.phone_number,'') " +
    `from conversations c left join contacts ct on ct.id = c.contact_id where c.id in (${ids.join(",")});`;
  const out = sh("docker", ["exec", db, "psql", "-U", "postgres", "-d", "onia-chatbot", "-tAc", sql], 30000);
  if (out === null) return null;
  const mapa = new Map();
  for (const linea of out.split("\n")) {
    const [id, inbox, contacto, telefono] = linea.trim().split("|");
    if (id && inbox) mapa.set(Number(id), { inbox: Number(inbox), contacto: contacto || null, telefono: telefono || null });
  }
  return mapa;
}

/** El patron ISO que el log estampa. Lo comparten la ventana y la conciliacion: son el mismo eje. */
const ISO_EN_EL_LOG = '20[0-9][0-9]-[0-9][0-9]-[0-9][0-9]T[0-9][0-9]:[0-9][0-9]:[0-9][0-9]';

/**
 * La ventana de tiempo que el log VIVO puede responder, derivada de sus propias marcas.
 * `null` cuando no se pudo preguntar o no hay ni una marca: sin ventana no hay conciliacion,
 * y eso es `no_medido`, no verde.
 *
 * Se DERIVA y no se asume por dos razones medidas: el log es append-only y sobrevive a los
 * reinicios (tiene varias lineas `escuchando` adentro), asi que "arranca cuando arranco el
 * proceso" es falso — el 2026-09-26 el proceso tenia 30 minutos de vida y el log llegaba al
 * 28 de agosto. Y al reves, el dia que alguien lo rote, la ventana se achica sola y los
 * eventos viejos pasan a `fueraDeAlcance` en vez de volverse un rojo inventado.
 */
export function ventanaDelLog(dir) {
  if (!dir) return null;
  const archivo = archivoDeLog(dir);
  if (!archivo) return null;
  // `sort` sobre las marcas y no sobre el log: la salida son dos lineas, acotada por
  // construccion. Igual que `lineasDelLog`, el filtro va DONDE VIVE EL LOG.
  const cmd = `grep -oE '${ISO_EN_EL_LOG}' ${archivo} 2>/dev/null | sort | sed -n '1p;$p' || true`;
  const out = sh("docker", ["exec", CONTENEDOR, "sh", "-c", cmd], 60000);
  const marcas = (out || "").split("\n").map((s) => s.trim()).filter(Boolean);
  if (marcas.length < 2) return null;
  return { desde: marcas[0], hasta: marcas[marcas.length - 1] };
}

/**
 * La primera evidencia, en el log VIVO, de que el aviso ya emitia. `null` cuando no se pudo
 * preguntar o cuando el log no tiene ni una linea `[aviso]`.
 *
 * Se toma la hora de la linea ANTERIOR y no de la propia porque las lineas `[aviso]` no
 * llevan marca: lo escribe `log()` sin estampar. Medido el 2026-09-26 en produccion — la
 * primera es `[aviso] skipped (cuota_agotada): aviso por Telegram apagado` a secas, y la
 * linea de arriba es `[onia-webhook] 2026-09-04T03:41:45.953Z conv=53 ... rama=respondio
 * etapa=nuevo->handoff_humano`. El log esta EN ORDEN y es append-only, asi que la ultima
 * marca en o antes de esa linea es la cota mas temprana en que sabemos que la capacidad
 * estaba viva. Es la misma tecnica por la que `conversacionesDeAvisos` recupera el `conv` de
 * los avisos viejos.
 *
 * POR QUE NO el mtime del modulo: `/tmp/onia-bot/aviso-telegram.mjs` dice `2026-09-25 10:41`,
 * que es cuando llego LA COPIA DE HOY, no cuando llego la capacidad. Usarlo pondria el borde
 * seis semanas adelante de la verdad y se moveria con cada rsync, tapando en verde cualquier
 * perdida anterior. El log no se re-escribe: la evidencia que deja es monotona.
 */
export function primerAvisoDelLog(dir) {
  if (!dir) return null;
  const archivo = archivoDeLog(dir);
  if (!archivo) return null;
  // Todo el filtro corre DONDE VIVE EL LOG, igual que sus hermanos: la salida es UNA marca,
  // acotada por construccion, y no tiene techo que alcanzar cuando el log crezca.
  const cmd =
    `n=$(grep -n -F '[aviso]' ${archivo} 2>/dev/null | head -1 | cut -d: -f1); ` +
    `if [ -n "$n" ]; then sed -n "1,\${n}p" ${archivo} | grep -oE '${ISO_EN_EL_LOG}' | tail -1; fi; true`;
  const out = sh("docker", ["exec", CONTENEDOR, "sh", "-c", cmd], 60000);
  const marca = (out || "").trim();
  // Se exige la forma: una salida rara no puede convertirse en un borde que absuelve.
  return new RegExp(`^${ISO_EN_EL_LOG}$`).test(marca) ? marca : null;
}

/**
 * Los eventos que el objetivo obliga a avisar, leidos del registro DURABLE.
 * `null` cuando no se pudo preguntar — de ahi sale el tri-estado de `conciliarAvisos`.
 *
 * Es la otra mitad del par: el log dice que hizo el codigo de aviso, esta tabla dice que
 * ocurrio. `bot_stage` lo escribe el motor y queda; una linea de log puede no haberse
 * escrito nunca. Por eso la lista de sujetos sale de aca y no del log.
 */
export function eventosDeLaBase() {
  const nombres = sh("docker", ["ps", "--format", "{{.Names}}"], 20000);
  // Derivado, no clavado: el nombre del contenedor es de otro dueño. Si un dia cambia, esto
  // devuelve null (no medido) en vez de leer vacio para siempre en verde.
  const db = (nombres || "").split("\n").map((s) => s.trim()).find((n) => n === "supabase-db" || n.includes("supabase-db"));
  if (!db) return null;
  const estados = ESTADOS_QUE_AVISAN.map((e) => `'${e}'`).join(",");
  const sql =
    `select conversation_key, bot_stage, to_char(created_at,'YYYY-MM-DD"T"HH24:MI:SS') ` +
    `from onia_center.bot_conversations where bot_stage in (${estados});`;
  const out = sh("docker", ["exec", db, "psql", "-U", "postgres", "-tAc", sql], 30000);
  if (out === null) return null;
  const eventos = [];
  for (const linea of out.split("\n")) {
    const [clave, estado, desde] = linea.trim().split("|");
    if (!clave || !estado) continue;
    // `chatwoot:57` -> 57. El numero es la clave con la que el log nombra la conversacion;
    // una clave de otro canal sin numero no se puede cruzar y no se inventa.
    const conv = Number(/:(\d+)$/.exec(clave)?.[1]);
    if (!Number.isInteger(conv)) continue;
    eventos.push({ conv, estado, desde: desde || "" });
  }
  return eventos;
}

export async function medir() {
  const bot = resolverBotDesplegado();
  try {
    return await medirCon(bot);
  } finally {
    // El temporal se borra siempre: en WSL `/tmp` es un tmpfs que vive EN RAM, y son 7 MB
    // por vuelta con este loop corriendo cada hora.
    if (bot?.origen === "remoto") {
      try {
        rmSync(bot.dir, { recursive: true, force: true });
      } catch {
        /* dejar basura en /tmp no justifica tumbar la medicion */
      }
    }
  }
}

async function medirCon(bot) {
  const env = envDelProcesoVivo();
  const motor = bot ? await motorProduceAviso(bot.dir) : null;
  // El log se lee UNA vez: cada llamada es un `docker exec` contra produccion.
  const lineas = lineasDelLog(bot?.dir);
  const eventos = contarEventos(lineas);
  // De quien son esos avisos. Va aunque el circuito no se pueda medir: son preguntas
  // independientes, y "hubo avisos pero ninguno de un lead" se responde con el log y la base.
  const deQuien = conversacionesDeAvisos(lineas);
  const origen = clasificarEventos(deQuien, inboxPorConversacion(deQuien.map((e) => e.conv)));
  // La conciliacion va con el log ya leido: los sujetos salen de la base, los avisos de estas
  // mismas lineas. Si se pidieran los avisos aparte, las dos mitades podrian mirar momentos
  // distintos del log y el cruce acusaria por el desfase.
  // El borde izquierdo es el de la CAPACIDAD, no el del log: un handoff anterior a la primera
  // linea `[aviso]` no lo pudo perder un circuito que todavia no existia (ver `ventanaDelAviso`).
  const borde = ventanaDelAviso({ ventana: ventanaDelLog(bot?.dir), primerAviso: primerAvisoDelLog(bot?.dir) });
  const conciliacion = conciliarAvisos({
    eventosEnLaBase: eventosDeLaBase(),
    // Solo `sent` cubre a una conversacion. Un `skipped` o un `failed` la NOMBRAN en el log
    // pero a esa persona no le llego nada: contarlos como cobertura seria usar la evidencia
    // del fallo para tapar el fallo.
    convsConAviso: deQuien.filter((e) => e.estado === "sent").map((e) => e.conv),
    ventana: borde,
  });
  // De quien son los PERDIDOS. Es otra pregunta que la de `origen`, que mira los avisos que el
  // log nombra: estos sujetos nunca pasaron por el log, salen de la base. Sin esto el veredicto
  // mandaba a "ir a buscar a esas personas" sobre el banco de pruebas — los diez sujetos del
  // rojo del 2026-09-26 eran inbox 7 o contacto `Sonda QA`, medidos en la base de Chatwoot.
  const perdidos = conciliacion.sinAviso.map((e) => ({ conv: e.conv }));
  const origenPerdidos = perdidos.length
    ? clasificarEventos(perdidos, inboxPorConversacion(perdidos.map((e) => e.conv)))
    : null;

  // Sin el proceso vivo o sin el codigo desplegado no hay nada que afirmar del circuito.
  if (!env || !motor) return { circuito: null, eventos, origen, conciliacion, borde, origenPerdidos, ejemplo: null };

  const credencialesOk = await credencialesResponden(env.TG_BOT_TOKEN, env.TG_CHAT_ID);
  return {
    circuito: {
      flagEncendido: String(env.ONIA_BOT_TG_AVISO || "").toLowerCase() === "true",
      credencialesOk,
      motorEmiteNotify: motor.emite,
      textoAccionable: motor.accionable,
    },
    eventos,
    origen,
    conciliacion,
    borde,
    origenPerdidos,
    ejemplo: motor.ejemplo,
    ramas: motor.ramas,
  };
}

// La guarda: sin esto, importar este archivo para probarlo dispara docker exec contra
// produccion y un process.exit() que mata al proceso importador (medido en este carril
// el 2026-09-03 con demo_agendada_real.mjs).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { circuito, eventos, origen, conciliacion, borde, origenPerdidos, ejemplo, ramas } = await medir();
  const d = diagnosticar({ circuito, eventos, conciliacion });

  console.log(`circuito: ${circuito ? (d.veredicto === "no_medido" ? "?" : "medido") : "NO SE PUDO MEDIR"}`);
  if (circuito) {
    // El tercer estado se imprime como tal: un `?` es "no pude preguntar", y leerlo como
    // ROTO es exactamente el error que este gate cometio contra un token sano.
    for (const [k, v] of Object.entries(circuito)) {
      console.log(`  ${v === null ? "?   " : v ? "ok  " : "ROTO"} ${k}`);
    }
  }
  // Las ramas van SIEMPRE, no sólo cuando fallan: un "motorEmiteNotify ok" sin decir sobre
  // qué ramas es justo la lectura que dejó pasar el agujero del 2026-09-07.
  if (ramas) {
    for (const kind of RAMAS_QUE_AVISAN) {
      const r = ramas[kind];
      console.log(`  ${r?.emite && r?.accionable ? "ok  " : "ROTO"} rama ${kind}`);
    }
  }
  // Los curados se NOMBRAN aunque no pongan rojo: si no, un verde con salteos adentro se
  // lee como "nunca paso nada" y nadie puede auditar por que este gate dejo de gritar.
  const curados = eventos.salteados - (eventos.salteadosVigentes ?? eventos.salteados);
  const detalleSalteados = `${eventos.salteados}${curados > 0 ? ` (${curados} ya desmentido(s) por un envio posterior)` : ""}`;
  console.log(
    `eventos: ${eventos.total} avisos (enviados ${eventos.enviados} · salteados ${detalleSalteados} · fallidos ${eventos.fallidos})`,
  );
  // De quien son. Se imprime SIEMPRE que haya avisos: el dia que aparezca el primer lead de
  // verdad, esta linea es la que lo dice — y hasta entonces dice que todavia no paso.
  if (eventos.total > 0) {
    const o = origen || { medido: false, nuestros: [], reales: [], sinUbicar: [] };
    console.log(
      o.medido
        ? `de quien: leads ${o.reales.length}${
            o.reales.length
              ? ` (${o.reales.map((c) => `conv ${c}${o.contactos?.get(c) ? ` · ${o.contactos.get(c)}` : ""}`).join(", ")})`
              : ""
          } · nuestros ${o.nuestros.length}${o.sinUbicar.length ? ` · sin ubicar ${o.sinUbicar.length}` : ""}`
        : "de quien: no se pudo preguntar a la base de Chatwoot (no medido, NO es cero)",
    );
  }
  // La conciliacion se imprime SIEMPRE, con o sin rojo: es el unico renglon que dice cuantos
  // eventos hubo DE VERDAD. Un gate que solo habla cuando acusa deja al que lo lee sin saber
  // sobre cuantos sujetos se pronuncio — que es como "0 avisos" paso de medida a decoracion.
  if (conciliacion?.medido) {
    const { conAviso, sinAviso, fueraDeAlcance } = conciliacion;
    // El BORDE se imprime con su motivo: es el numero que decide a quien se acusa, y hasta el
    // 2026-09-26 era invisible — el reporte decia "dentro de la ventana del log" sobre una
    // ventana seis dias mas ancha que la capacidad. Un alcance que no se nombra se re-descubre.
    const porQue = borde?.borde === "primer_aviso"
      ? `desde ${borde.desde}, que es cuando el aviso EMPEZO a emitir (el log arranca antes)`
      : `desde ${borde?.desde}, que es donde arranca el log`;
    console.log(
      `en la base: ${conAviso.length + sinAviso.length} evento(s) dentro del alcance del aviso` +
        ` (con aviso ${conAviso.length} · SIN aviso ${sinAviso.length}) — ${porQue}` +
        (fueraDeAlcance.length ? `\n  · ${fueraDeAlcance.length} evento(s) anteriores a ese borde, fuera de alcance: no los pudo perder un circuito que no existia` : ""),
    );
    if (origenPerdidos) {
      console.log(
        origenPerdidos.medido
          ? `  · de los perdidos: leads ${origenPerdidos.reales.length}${
              origenPerdidos.reales.length ? ` (${origenPerdidos.reales.map((c) => `conv ${c}`).join(", ")})` : ""
            } · nuestros ${origenPerdidos.nuestros.length}${origenPerdidos.sinUbicar.length ? ` · sin ubicar ${origenPerdidos.sinUbicar.length}` : ""}`
          : "  · de los perdidos: no se pudo preguntar de quien son (no medido, NO es cero)",
      );
    }
  } else if (borde?.borde === "sin_evidencia") {
    // Se distingue de "no pude hablar con la base": la base contesto, lo que falta es el borde.
    console.log("en la base: no se puede conciliar — el log no tiene ni UNA linea [aviso], asi que no hay con que distinguir 'no habia codigo' de 'se perdio'");
  } else {
    console.log("en la base: no se pudo preguntar que eventos ocurrieron (no medido, NO es cero)");
  }
  if (d.motivos.length) console.log("motivos:\n  - " + d.motivos.join("\n  - "));
  if (ejemplo && d.veredicto === "ok") console.log(`\nlo que recibiria Sergio:\n${ejemplo.replace(/^/gm, "  ")}`);

  // La linea que le sirve al objetivo del carril: dice el numero Y como leerlo.
  // Un rojo tiene DOS causas que se arreglan en lugares opuestos y hasta hoy se leian igual.
  // Si el circuito contesta que si a las cuatro preguntas, "el proximo se pierde" es una
  // afirmacion FALSA sobre el futuro: lo que se perdio ya se perdio, y lo que queda por hacer
  // es ir a buscar a esas personas, no arreglar el circuito. Medido el 2026-09-12, que es la
  // primera vez que este gate pudo ver sus propios avisos salteados.
  const circuitoSano = circuito && Object.values(circuito).every((v) => v === true);
  const lectura = lecturaDeEventos({ veredicto: d.veredicto, eventos, circuitoSano, origen, conciliacion, origenPerdidos });
  console.log(`\nVEREDICTO: ${d.veredicto} · avisos enviados ${eventos.enviados} — ${lectura}`);

  process.exit(d.veredicto === "ok" ? 0 : d.veredicto === "roto" ? 1 : 2);
}
