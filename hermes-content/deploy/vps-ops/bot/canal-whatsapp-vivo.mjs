#!/usr/bin/env node
/**
 * ¿El bot contesta por WHATSAPP? — la mitad del objetivo del carril que nadie medía.
 *
 * POR QUE EXISTE, con la medición que lo destapó (2026-09-13).
 * La definición de hecho del carril tiene dos mitades: que la conversación SE VEA en la
 * bandeja (`npm run objetivo:visible`, que ya mira los inboxes 4 y 5) y que el bot CONTESTE
 * los dos mensajes (`npm run sonda:widget`). La segunda prueba el **widget web** y firma
 * `EL BOT CONTESTO LOS 2` — por los dos canales. Contado contra la base de Chatwoot ese día:
 *
 *     inbox 5 (Onia WhatsApp) · 3 conversaciones
 *       conv 11  Sergio       +59171654992   11 entrantes · 15 salientes   <- el DUEÑO
 *       conv 35  F            +59173232758    1 entrante  ·  0 salientes   25-ago, sigue open
 *       conv 37  mariohassen  +59173021804    1 entrante  ·  0 salientes   28-ago, sigue open
 *
 * O sea: en el canal donde llega un lead boliviano, el bot le contestó a **una sola persona
 * en toda su historia, y es el dueño**. Los dos desconocidos que escribieron nunca recibieron
 * respuesta. Eso estuvo 18 días invisible porque la medida del carril mide otro canal.
 * Es la misma clase que el 12-sep dejó a `avisos-vivo` firmando "circuito sano y avisando"
 * contando al dueño como lead: el instrumento nunca vio a su sujeto y no lo decía.
 *
 * QUE MIDE, y por qué en DOS mitades separadas. Un objetivo que cuenta EVENTOS no distingue
 * "circuito roto" de "día sin eventos" — con un canal por el que hace dos semanas no escribe
 * nadie, contar respuestas da cero en los dos mundos. Entonces:
 *
 *   · CIRCUITO — ¿puede contestar hoy? Se le pregunta al proceso vivo por la MISMA vía que
 *     usa el camino de respuesta (`/health?inboxId=<id>`, que keyea `inbox:<id>` igual que
 *     `cacheKeyOf`), y se mira si el canal SALE (hubo alguna saliente). No inventa tráfico.
 *   · EVENTOS — de los desconocidos que escribieron, ¿a cuántos se les contestó?
 *
 * QUE NO HACE: no escribe nada en producción. Sólo SELECT y un GET al /health. Una sonda que
 * siembra en el canal de los leads reales los tapa en la bandeja (pasó con la del widget, que
 * dejaba su conversación arriba de 4 desconocidos) y, en WhatsApp, un envío sale a un teléfono
 * de verdad y lo factura Meta. Este canal se AUDITA, no se sondea.
 *
 * EL EXIT LO DECIDE EL CIRCUITO, NO EL PASIVO. Los dos mudos son de agosto —del período del
 * bug que ya se arregló— y contestarles es "contactar personas": decisión de Sergio Urcullo,
 * ya bloqueada en el tablero (`t_43868cdb`). Un gate que queda ROJO para siempre por algo que
 * sólo él puede cerrar es ruido que se aprende a ignorar; uno que lo esconde es el falso verde
 * que este archivo existe para matar. Así que el pasivo se IMPRIME siempre, con nombre y
 * fecha, y el código de salida lo decide si el canal puede contestar hoy.
 */

import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import { esNuestra } from "../../../../scripts/objetivo_visible.mjs";

export const CONTENEDOR_BOT = "onia-center";
export const PUERTO_BOT = 3020;

/**
 * Los inboxes de WhatsApp se DERIVAN de la base por `channel_type`, nunca se clava el 5.
 * Hoy hay uno; el Embedded Signup multi-tenant crea uno POR CLIENTE, y una lista a mano
 * falla abierto justo en el inbox nuevo — que es el del cliente que paga.
 */
export const CANAL_WHATSAPP = "Channel::Whatsapp";

/**
 * Una conversación del canal, ya contada. `ultimoEntranteAt` es lo que permite preguntar si
 * el canal habló DESPUES de este silencio; sin esa fecha no hay forma de distinguir un canal
 * muerto de un caso propio, y el gate tendría que elegir entre callar o gritar para siempre.
 */
export function normalizarFila(linea) {
  const partes = String(linea ?? "").trim().split("|");
  if (partes.length < 7) return null;
  const [inbox, id, contacto, telefono, entrantes, salientes, ultimoEntranteAt] = partes;
  if (!/^[0-9]+$/.test(inbox) || !/^[0-9]+$/.test(id)) return null;
  return {
    inbox: Number(inbox),
    id: Number(id),
    contacto: contacto && contacto !== "-" ? contacto : null,
    telefono: telefono || null,
    entrantes: Number(entrantes) || 0,
    salientes: Number(salientes) || 0,
    ultimoEntranteAt: ultimoEntranteAt || null,
  };
}

/**
 * De quién es cada conversación y a quién se le contestó.
 *
 * `esNuestra` se IMPORTA de `objetivo_visible.mjs`: cruza teléfono propio Y nombre de prueba.
 * Escribir acá una segunda versión es el par clásico que diverge y se arregla de un solo lado
 * — exactamente como este módulo y `avisos-vivo` divergieron hasta el 12-sep.
 */
export function clasificar(filas = []) {
  const nuestras = [];
  const contestados = [];
  const mudos = [];

  for (const f of filas) {
    if (!f) continue;
    if (esNuestra(f)) {
      nuestras.push(f);
      continue;
    }
    // Sin entrantes no es un lead que esperó: es una conversación que abrimos nosotros.
    if (f.entrantes <= 0) continue;
    (f.salientes > 0 ? contestados : mudos).push(f);
  }

  return { nuestras, contestados, mudos };
}

/**
 * ¿El canal habló DESPUES de este silencio? El log de Chatwoot es append-only y está en
 * orden, así que alcanza comparar fechas: si salió un mensaje por ese inbox después del
 * último entrante sin respuesta, el canal no estaba mudo y ese silencio es un caso propio.
 *
 * ⚠️ La salvedad, medida el 12-sep en la familia hermana: esto cura causas GLOBALES del
 * canal (un token vencido calla a todos, y un envío posterior lo desmiente). NO cura al
 * sujeto: la persona sigue sin respuesta, y por eso el pasivo se imprime igual.
 */
export function canalHabloDespues(mudo, ultimaSalientePorInbox) {
  const ultima = ultimaSalientePorInbox?.get?.(mudo?.inbox) ?? null;
  if (!ultima || !mudo?.ultimoEntranteAt) return null; // no se pudo saber
  return ultima > mudo.ultimoEntranteAt;
}

/**
 * El veredicto. `null` en cualquier insumo es NO MEDIDO: un gate que confunde "no pude
 * preguntar" con "me dijeron que no" manda a arreglar un canal sano — y al revés, firma
 * verde sobre uno muerto.
 */
export function diagnosticar({ filas, ultimaSalientePorInbox, documentoPorInbox } = {}) {
  if (filas === null || filas === undefined) {
    return { codigo: 2, veredicto: "no_medido", mensaje: "NO MEDIDO: no se pudo leer la base de Chatwoot." };
  }
  const inboxes = [...new Set(filas.map((f) => f?.inbox).filter(Number.isInteger))];
  if (!inboxes.length) {
    return {
      codigo: 2,
      veredicto: "no_medido",
      mensaje: `NO MEDIDO: no hay ningun inbox ${CANAL_WHATSAPP} en Chatwoot — sin canal no hay nada que concluir.`,
    };
  }

  const { nuestras, contestados, mudos } = clasificar(filas);

  // CIRCUITO, mitad 1: ¿el bot resuelve documento para ese inbox? Es la via del camino de
  // respuesta, no la del archivo: preguntar por el archivo fue lo que dejo a `/health`
  // contestando sobre un documento distinto del que recibe el lead (medido el 12-sep).
  const sinDocumento = documentoPorInbox
    ? inboxes.filter((i) => documentoPorInbox.get(i) === false)
    : [];
  const documentoNoMedido = !documentoPorInbox || inboxes.some((i) => documentoPorInbox.get(i) == null);

  // CIRCUITO, mitad 2: ¿el canal SALE? Un mudo cuyo canal nunca hablo despues no se puede
  // atribuir a un caso propio.
  const mudosSinDesmentir = mudos.filter((m) => canalHabloDespues(m, ultimaSalientePorInbox) === false);
  const mudosNoMedidos = mudos.filter((m) => canalHabloDespues(m, ultimaSalientePorInbox) === null);

  const pasivo = mudos.length
    ? ` · ${mudos.length} desconocido(s) SIN RESPUESTA: ${mudos
        .map((m) => `#${m.id} ${m.contacto ?? "?"}${m.ultimoEntranteAt ? ` (${m.ultimoEntranteAt.slice(0, 10)})` : ""}`)
        .join(", ")}`
    : "";
  const resumen =
    `inbox(es) ${inboxes.join(", ")} · desconocidos contestados ${contestados.length}/${contestados.length + mudos.length}` +
    ` · nuestras ${nuestras.length}${pasivo}`;

  if (sinDocumento.length) {
    return {
      codigo: 1,
      veredicto: "problema",
      mensaje: `EL BOT NO RESUELVE DOCUMENTO para el/los inbox ${sinDocumento.join(", ")} de WhatsApp: un lead que escriba por ahi no recibe lo que el producto promete. ${resumen}`,
    };
  }
  if (mudosSinDesmentir.length) {
    return {
      codigo: 1,
      veredicto: "problema",
      mensaje:
        `EL CANAL DE WHATSAPP PUEDE ESTAR MUDO: ${mudosSinDesmentir.length} desconocido(s) sin respuesta y NINGUNA saliente posterior por ese inbox` +
        ` — no es un caso propio, es el canal. ${resumen}`,
    };
  }
  if (documentoNoMedido || mudosNoMedidos.length) {
    return {
      codigo: 2,
      veredicto: "no_medido",
      mensaje: `NO MEDIDO: falto un insumo del circuito (documento del bot o fecha de la ultima saliente). ${resumen}`,
    };
  }
  if (!contestados.length) {
    // Verde del circuito, pero la frase dice la verdad incomoda: el canal SALE y aun asi
    // nunca le contesto a un desconocido. Es lo que la sonda del widget tapaba.
    return {
      codigo: 0,
      veredicto: "ok",
      mensaje: `ok · el canal sale y el bot resuelve documento, pero NUNCA le contesto a un desconocido por WhatsApp. ${resumen}`,
    };
  }
  return { codigo: 0, veredicto: "ok", mensaje: `ok · el bot contesta por WhatsApp. ${resumen}` };
}

// ---------------------------------------------------------------- lectores (red y docker)

function sh(cmd, args, timeout = 30000) {
  try {
    return execFileSync(cmd, args, { encoding: "utf8", timeout, maxBuffer: 32 * 1024 * 1024 });
  } catch (e) {
    // La salida cuenta aunque el comando falle: un destino que contesta y sale !=0 dijo algo,
    // y tirarlo convierte una negativa informada en una falla de red inventada.
    const salida = String(e?.stdout ?? "");
    return salida.trim() ? salida : null;
  }
}

/** El contenedor de la base se DERIVA: Swarm le pega un sufijo distinto en cada re-deploy. */
export function contenedorChatwootDb(deps = {}) {
  const correr = deps.sh ?? sh;
  const nombres = correr("docker", ["ps", "--format", "{{.Names}}"], 20000);
  if (nombres === null) return null;
  return nombres.split("\n").find((n) => n.includes("chatwoot-db")) || null;
}

export const SQL_CONVERSACIONES =
  "select i.id, c.id, replace(coalesce(ct.name,'-'), E'\\n', ' '), coalesce(ct.phone_number,''), " +
  "count(*) filter (where m.message_type = 0), count(*) filter (where m.message_type = 1), " +
  "coalesce(max(m.created_at) filter (where m.message_type = 0)::text,'') " +
  "from inboxes i join conversations c on c.inbox_id = i.id left join contacts ct on ct.id = c.contact_id " +
  `left join messages m on m.conversation_id = c.id where i.channel_type = '${CANAL_WHATSAPP}' ` +
  "group by i.id, c.id, ct.name, ct.phone_number order by i.id, c.id;";

export const SQL_ULTIMA_SALIENTE =
  "select i.id, max(m.created_at)::text from inboxes i join conversations c on c.inbox_id = i.id " +
  `join messages m on m.conversation_id = c.id where i.channel_type = '${CANAL_WHATSAPP}' ` +
  "and m.message_type = 1 group by i.id;";

export function leerConversaciones(db, deps = {}) {
  const correr = deps.sh ?? sh;
  const out = correr("docker", ["exec", db, "psql", "-U", "postgres", "-d", "onia-chatbot", "-tAc", SQL_CONVERSACIONES]);
  if (out === null) return null;
  return out.split("\n").map(normalizarFila).filter(Boolean);
}

export function leerUltimaSaliente(db, deps = {}) {
  const correr = deps.sh ?? sh;
  const out = correr("docker", ["exec", db, "psql", "-U", "postgres", "-d", "onia-chatbot", "-tAc", SQL_ULTIMA_SALIENTE]);
  if (out === null) return null;
  const mapa = new Map();
  for (const linea of out.split("\n")) {
    const [inbox, fecha] = linea.trim().split("|");
    if (/^[0-9]+$/.test(inbox || "") && fecha) mapa.set(Number(inbox), fecha);
  }
  return mapa;
}

/**
 * ¿El bot resuelve un documento para ESE inbox? Se le pregunta al proceso vivo con el mismo
 * parametro que usa el camino de respuesta. `null` = no se pudo preguntar.
 */
export function documentosPorInbox(inboxes, deps = {}) {
  const correr = deps.sh ?? sh;
  const mapa = new Map();
  for (const inbox of inboxes) {
    const out = correr("docker", [
      "exec",
      CONTENEDOR_BOT,
      "wget",
      "-qO-",
      `http://127.0.0.1:${PUERTO_BOT}/health?inboxId=${inbox}`,
    ]);
    if (out === null) {
      mapa.set(inbox, null);
      continue;
    }
    let salud = null;
    try {
      salud = JSON.parse(out);
    } catch {
      mapa.set(inbox, null);
      continue;
    }
    const k = salud?.knowledge ?? salud;
    mapa.set(inbox, Boolean(k?.source || k?.path));
  }
  return mapa;
}

export function medir(deps = {}) {
  const db = deps.db ?? contenedorChatwootDb(deps);
  if (!db) return { filas: null };
  const filas = (deps.leerConversaciones ?? leerConversaciones)(db, deps);
  if (filas === null) return { filas: null };
  const inboxes = [...new Set(filas.map((f) => f.inbox))];
  return {
    filas,
    ultimaSalientePorInbox: (deps.leerUltimaSaliente ?? leerUltimaSaliente)(db, deps),
    documentoPorInbox: inboxes.length ? (deps.documentosPorInbox ?? documentosPorInbox)(inboxes, deps) : new Map(),
  };
}

// La guarda: sin esto, importar este archivo para probarlo dispara `docker exec` contra
// produccion y un `process.exit()` que mata al proceso importador.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const medicion = medir();
  const d = diagnosticar(medicion);
  console.log(`VEREDICTO: ${d.mensaje}`);
  process.exit(d.codigo);
}
