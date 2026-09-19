#!/usr/bin/env node
/**
 * ¿El reloj guardado del prospecto coincide con lo que el prospecto REALMENTE hizo?
 *
 * POR QUE EXISTE, con la medición que lo destapó (2026-09-19).
 * El 18-sep (2f92eb70) se curó al PRODUCTOR: `step()` pisaba `lastInboundAt` con el
 * `receivedAt` de cualquier turno, sin preguntar el autor, y al motor también entra lo que
 * sale de NUESTRO lado (el adapter convierte el saliente de un humano en `author:"human"`).
 * Ese arreglo impide que el reloj se vuelva a correr — y no repara ni una fila de las que ya
 * estaban corridas. Curar al productor no repara lo ya escrito, y el dato viejo sigue siendo
 * la ENTRADA de los tres consumidores que deciden a quién escribirle.
 *
 * Contado en producción ese día cruzando las dos tablas (20 conversaciones con reloj):
 *
 *     conv 58   reloj 09-18 19:17:02   último del prospecto 09-17 22:50:55   +20,4 h  <- lead REAL
 *     conv 57   reloj 09-04 17:00:05   último del prospecto 09-04 14:38:10   + 2,4 h
 *     conv 56   reloj 09-04 12:00:08   último del prospecto 09-04 06:38:55   + 5,4 h
 *     conv 54   reloj 09-04 12:00:08   último del prospecto 09-04 03:43:20   + 8,3 h
 *     conv 52   reloj 09-04 12:00:06   último del prospecto 09-04 03:39:29   + 8,4 h
 *
 * Las otras quince difieren 1-5 segundos, que es el sellado de la fila: por eso la tolerancia.
 *
 * QUE MIDE, y por qué cruza DOS tablas y no una. `onia_center.bot_conversations` es estado
 * MUTABLE (lo reescribe cada turno) y `onia_center.bot_messages` es APPEND-ONLY (lo que de
 * verdad pasó). Ningún gate del carril los cruzaba nunca, así que el estado podía divergir de
 * los hechos en silencio — y los gates del embudo, que leen el estado, heredaban la mentira.
 * La pregunta es de una línea: ¿`last_inbound_at` coincide con el último mensaje cuyo autor es
 * el contacto?
 *
 * LAS DOS DIRECCIONES IMPORTAN, y no cuestan lo mismo:
 *   · ADELANTADO — el reloj dice que habló después de lo que habló. `sweepInsistenciaCandidates`
 *     lo usa como la ventana de 24 h de Meta, que Meta cuenta desde el último mensaje DEL
 *     USUARIO: el bot cree abierta una ventana ya cerrada y el envío se rechaza o se cobra como
 *     plantilla (6,5x), y lo paga el cliente del cliente con el quality rating de SU línea.
 *   · ATRASADO — el reloj se quedó corto y el prospecto cae fuera de toda ventana: no se le
 *     escribe nunca. Falla hacia el silencio, que es barato en plata y caro en leads.
 *
 * QUE NO HACE: no escribe nada. Sólo SELECT. Reparar el dato es un acto aparte y con respaldo.
 *
 * NO FIRMA VERDE ANTE LA AUSENCIA. Un gate que cuenta ocurrencias malas dice "sano" cuando no
 * pudo leer nada. Si no hay ni una fila juzgable el veredicto es NO MEDIDO (exit 2), nunca ok.
 *
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 * UNA DIVERGENCIA, DOS CAUSAS OPUESTAS — y hasta el 2026-09-19 este gate sólo nombraba una.
 *
 * Cruzar el estado mutable contra `bot_messages` dice QUE el reloj no coincide, no POR QUE. Y hay
 * dos historias que producen exactamente la misma resta:
 *
 *   1. RELOJ CORRIDO — el prospecto no escribió; lo que corrió el reloj fue un saliente nuestro
 *      que volvió al motor como turno `author:"human"`. El motor registró todo lo que llegó.
 *      Remedio: un `update` que devuelve `last_inbound_at` al valor de `bot_messages`.
 *
 *   2. ENTRANTE SIN PROCESAR — el prospecto SI escribió, y el bot no lo atendió ni lo registró.
 *      Es el bug del segundo turno, el que mató a este carril dos veces. Remedio: NINGUN update
 *      — correrlo BORRA la única evidencia de que hubo un entrante sin contestar.
 *
 * Un diagnóstico único manda a ejecutar el remedio 1 sobre un caso de clase 2, o sea a destruir
 * la prueba del defecto más caro del carril. La pregunta que sí las distingue es la TERCERA
 * tabla: `messages` de Chatwoot (`message_type = 0`, los entrantes de verdad). Si Chatwoot tiene
 * un entrante MAS NUEVO que el último que el motor registró, la causa es la 2.
 *
 * Y la asimetría manda el default: si no se puede preguntar, el veredicto es SIN DISTINGUIR y el
 * gate NO recomienda el `update`. Fallar hacia "no toques nada" es barato; fallar hacia "reparalo"
 * es irreversible.
 *
 * Medido el 2026-09-19 sobre las 40 conversaciones juzgables: Chatwoot nunca está más nuevo que
 * el motor (sella 1-5 s antes de que el motor inserte su fila), así que el cruce no acusa a nadie
 * hoy — por eso cerrar la confusión ahora es barato. Los conteos SI difieren (conv 49: 532 en
 * Chatwoot, 531 en el motor; convs 6-8: 1 contra 2) porque el motor también registra turnos
 * sembrados: por eso se comparan MARCAS DE TIEMPO y nunca cantidades.
 */

import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export const CONTENEDOR_BASE = "supabase-db";

/**
 * En Swarm el contenedor no se llama como su servicio: `onia-chatbot_chatwoot-db` es en realidad
 * `onia-chatbot_chatwoot-db.1.<sufijo>`, y el sufijo cambia en cada redeploy. Por eso se busca por
 * PREFIJO en `docker ps` y no se escribe el nombre completo.
 */
export const CONTENEDOR_CHATWOOT_PREFIJO = "onia-chatbot_chatwoot-db";
/** La base de Chatwoot NO se llama "chatwoot". Equivocarse acá devuelve "database does not exist". */
export const BASE_CHATWOOT = "onia-chatbot";
/** En Chatwoot `message_type` 0 = entrante (lo que escribió la persona), 1 = saliente. */
export const CHATWOOT_ENTRANTE = 0;

/** Las tres causas posibles de una divergencia, cada una con su remedio propio. */
export const CAUSA = {
  RELOJ_CORRIDO: "reloj_corrido",
  ENTRANTE_SIN_PROCESAR: "entrante_sin_procesar",
  SIN_DISTINGUIR: "sin_distinguir",
};

export const REMEDIO = {
  [CAUSA.RELOJ_CORRIDO]:
    "reparable con un update de last_inbound_at al valor de bot_messages (Chatwoot confirma que el motor registro todo)",
  [CAUSA.ENTRANTE_SIN_PROCESAR]:
    "NO se repara con un update: Chatwoot tiene un entrante que el motor nunca registro. El update BORRA esa evidencia",
  [CAUSA.SIN_DISTINGUIR]:
    "no se sabe cual de las dos: preguntarle a Chatwoot antes de tocar la fila. NO correr el update a ciegas",
};

/**
 * El reloj se sella cuando el motor procesa el turno y `created_at` cuando se inserta la fila:
 * entre los dos hay siempre unos segundos. Medido sobre las quince conversaciones sanas de
 * producción el 2026-09-19: la diferencia máxima fue de 5 s. 120 s deja margen de sobra sin
 * tapar ninguna de las cinco divergencias reales, que se cuentan en HORAS.
 */
export const TOLERANCIA_SEGUNDOS = 120;

const SQL = `
select c.contact_ref,
       c.conversation_key,
       to_char(c.last_inbound_at,'YYYY-MM-DD"T"HH24:MI:SSOF') as reloj_guardado,
       to_char(max(m.created_at) filter (where m.author = 'contact'),'YYYY-MM-DD"T"HH24:MI:SSOF') as ultimo_del_prospecto,
       count(*) filter (where m.author = 'contact') as mensajes_del_prospecto
from onia_center.bot_conversations c
left join onia_center.bot_messages m on m.conversation_key = c.conversation_key
group by c.contact_ref, c.conversation_key, c.last_inbound_at
order by c.last_inbound_at desc nulls last
`.trim();

/** Expuesto para que un caso pueda exigir que el SELECT pida las columnas que el núcleo lee. */
export function columnasDelSelect(sql = SQL) {
  const hastaFrom = sql.slice(0, sql.search(/\bfrom\b/i));
  return hastaFrom;
}

/**
 * De `chatwoot:58` saca `"58"`. Devuelve `null` para toda clave que no sea una conversación de
 * Chatwoot identificable: sin id no hay a quién preguntarle, y eso es SIN DISTINGUIR, no "sana".
 */
export function idDeChatwoot(conversationKey) {
  const m = /^chatwoot:(\d+)$/.exec(String(conversationKey ?? "").trim());
  return m ? m[1] : null;
}

/**
 * El SELECT contra Chatwoot. Devuelve `null` si no queda ni un id preguntable — así el llamador
 * distingue "no hay a quién preguntar" de "pregunté y no hay nada".
 * Los ids se filtran a dígitos antes de interpolarse: nada que venga de la otra base entra crudo.
 */
export function sqlEntrantes(ids) {
  const limpios = [...new Set((ids || []).map((id) => String(id)))].filter((id) => /^\d+$/.test(id));
  if (limpios.length === 0) return null;
  return (
    `select conversation_id, to_char(max(created_at),'YYYY-MM-DD"T"HH24:MI:SSOF') ` +
    `from messages where message_type = ${CHATWOOT_ENTRANTE} ` +
    `and conversation_id in (${limpios.join(",")}) group by conversation_id`
  );
}

/**
 * `to_char(ts, '...OF')` de Postgres emite el huso con DOS digitos (`+00`, `-04`) y `Date.parse`
 * lo RECHAZA: sólo acepta `+00:00` o `Z`. Sin esto, las filas vivas se parsean a NaN, caen todas
 * a "no juzgable" y el gate no puede ver ni una divergencia. Lo destapó el propio test con los
 * datos reales de producción: 6 casos en rojo con el núcleo escrito y el SQL correcto.
 */
export function normalizarFecha(iso) {
  if (typeof iso !== "string") return iso;
  return iso.replace(/([+-]\d{2})$/, "$1:00");
}

function segundosEntre(a, b) {
  const ta = Date.parse(normalizarFecha(a));
  const tb = Date.parse(normalizarFecha(b));
  if (!Number.isFinite(ta) || !Number.isFinite(tb)) return null;
  return Math.round((ta - tb) / 1000);
}

/**
 * NUCLEO PURO. Recibe las filas ya leídas y decide. Separado del lector a propósito: el lector
 * necesita producción y el núcleo se prueba con casos.
 *
 * Una fila sin mensajes del contacto, o sin reloj, NO es sana ni rota: es NO JUZGABLE, y va a su
 * propio cubo con el motivo. Meterla entre las sanas es como un gate se felicita solo.
 */
/**
 * Qué dice Chatwoot sobre una conversación, en TRI-ESTADO. `entrantes` es un Map id -> última
 * marca de tiempo entrante, o `null` cuando no se pudo preguntar.
 *
 * Nunca devuelve "al dia" por defecto: si falta el dato, el estado es `sin_contrastar` con su
 * motivo. Aplanar "no pude preguntar" contra "pregunté y coincide" es justamente lo que haría que
 * el gate volviera a recomendar el `update` a ciegas.
 */
export function evidenciaDeChatwoot(
  { conversationKey, ultimoDelProspecto },
  entrantes,
  { toleranciaSegundos = TOLERANCIA_SEGUNDOS } = {},
) {
  if (!entrantes) {
    return { estado: "sin_contrastar", motivo: "no se le pudo preguntar a Chatwoot" };
  }
  const id = idDeChatwoot(conversationKey);
  if (!id) {
    return {
      estado: "sin_contrastar",
      motivo: `la clave ${conversationKey || "(vacia)"} no identifica una conversacion de Chatwoot`,
    };
  }
  const enChatwoot = entrantes.get(id) || null;
  if (!enChatwoot) {
    return { estado: "sin_contrastar", motivo: `Chatwoot no tiene ningun entrante de la conversacion ${id}` };
  }
  const adelanto = segundosEntre(enChatwoot, ultimoDelProspecto);
  if (adelanto === null) {
    return { estado: "sin_contrastar", motivo: `fecha ilegible en el entrante de Chatwoot (${enChatwoot})` };
  }
  if (adelanto > toleranciaSegundos) {
    return { estado: "mas_nuevo", ultimoEnChatwoot: enChatwoot, adelantoSegundos: adelanto };
  }
  return { estado: "al_dia", ultimoEnChatwoot: enChatwoot, adelantoSegundos: adelanto };
}

export function divergencias(filas, { toleranciaSegundos = TOLERANCIA_SEGUNDOS, entrantes = null } = {}) {
  if (!Array.isArray(filas)) return { medido: false, motivo: "no se pudieron leer las conversaciones" };

  const adelantados = [];
  const atrasados = [];
  const entrantesSinProcesar = [];
  const noJuzgables = [];
  /**
   * Cuántas filas pudieron contrastarse contra Chatwoot. Sin este contador, un Chatwoot caído
   * produce una salida IDENTICA a la de un cruce completo —las sanas no imprimen causa— y el
   * gate pierde su mitad nueva sin decir una palabra. Se imprime siempre, no sólo cuando falla.
   */
  const contraste = { contrastadas: 0, sinContrastar: 0, motivos: new Map() };
  let sanos = 0;

  for (const fila of filas) {
    const ref = String(fila?.contactRef ?? "");
    const conversationKey = fila?.conversationKey || null;
    const reloj = fila?.relojGuardado || null;
    const ultimo = fila?.ultimoDelProspecto || null;
    const mensajes = Number(fila?.mensajesDelProspecto ?? 0);

    if (!reloj) {
      noJuzgables.push({ contactRef: ref, motivo: "sin reloj guardado" });
      continue;
    }
    if (!ultimo || mensajes === 0) {
      noJuzgables.push({ contactRef: ref, motivo: "sin ningun mensaje del prospecto con que comparar" });
      continue;
    }

    const derivaSegundos = segundosEntre(reloj, ultimo);
    if (derivaSegundos === null) {
      noJuzgables.push({ contactRef: ref, motivo: "fecha ilegible" });
      continue;
    }

    const chatwoot = evidenciaDeChatwoot({ conversationKey, ultimoDelProspecto: ultimo }, entrantes, {
      toleranciaSegundos,
    });
    if (chatwoot.estado === "sin_contrastar") {
      contraste.sinContrastar += 1;
      const motivo = chatwoot.motivo.replace(/\d+/g, "N");
      contraste.motivos.set(motivo, (contraste.motivos.get(motivo) || 0) + 1);
    } else {
      contraste.contrastadas += 1;
    }
    const caso = {
      contactRef: ref,
      conversationKey,
      relojGuardado: reloj,
      ultimoDelProspecto: ultimo,
      derivaSegundos,
      chatwoot,
    };

    /**
     * El entrante sin atender manda sobre la resta del reloj, y por eso se pregunta PRIMERO: con
     * o sin divergencia, que Chatwoot tenga un mensaje que el motor no registró es el defecto más
     * caro del carril, y su remedio nunca es un `update`. Clasificarlo como "reloj corrido" sería
     * mandar a borrar la prueba.
     */
    if (chatwoot.estado === "mas_nuevo") {
      entrantesSinProcesar.push({ ...caso, causa: CAUSA.ENTRANTE_SIN_PROCESAR });
      continue;
    }

    const causa = chatwoot.estado === "al_dia" ? CAUSA.RELOJ_CORRIDO : CAUSA.SIN_DISTINGUIR;
    if (derivaSegundos > toleranciaSegundos) adelantados.push({ ...caso, causa });
    else if (derivaSegundos < -toleranciaSegundos) atrasados.push({ ...caso, causa });
    else sanos += 1;
  }

  const juzgables = adelantados.length + atrasados.length + entrantesSinProcesar.length + sanos;
  if (juzgables === 0) {
    return {
      medido: false,
      motivo: "ninguna conversacion tiene reloj Y mensajes del prospecto: no hay nada que cruzar",
      noJuzgables,
    };
  }

  return {
    medido: true,
    adelantados,
    atrasados,
    entrantesSinProcesar,
    sanos,
    noJuzgables,
    juzgables,
    contraste: { ...contraste, motivos: [...contraste.motivos].map(([motivo, veces]) => ({ motivo, veces })) },
  };
}

function horas(segundos) {
  return `${(Math.abs(segundos) / 3600).toFixed(1)} h`;
}

/** Lector vivo. Devuelve `null` —no `[]`— cuando no se pudo preguntar: son cosas distintas. */
export function leerFilas({ ejecutar } = {}) {
  const correr =
    ejecutar ||
    ((args) => execFileSync("docker", args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 }));
  let salida;
  try {
    salida = correr(["exec", CONTENEDOR_BASE, "psql", "-U", "postgres", "-d", "postgres", "-tAc", SQL]);
  } catch (err) {
    const causa = String(err?.stderr || err?.message || "")
      .split("\n")
      .filter((l) => l.trim() && !/^\s+at\s/.test(l))
      .slice(-1)[0];
    return { filas: null, causa: causa || "docker exec no contesto" };
  }
  const filas = String(salida)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((linea) => {
      const [contactRef, conversationKey, relojGuardado, ultimoDelProspecto, mensajesDelProspecto] =
        linea.split("|");
      return {
        contactRef,
        conversationKey: conversationKey || null,
        relojGuardado: relojGuardado || null,
        ultimoDelProspecto: ultimoDelProspecto || null,
        mensajesDelProspecto: Number(mensajesDelProspecto || 0),
      };
    });
  return { filas, causa: null };
}

function unaLineaDeError(err) {
  return (
    String(err?.stderr || err?.message || "")
      .split("\n")
      .filter((l) => l.trim() && !/^\s+at\s/.test(l))
      .slice(-1)[0] || "docker exec no contesto"
  );
}

/**
 * La TERCERA tabla, en otra base y otro motor: `messages` de Chatwoot. No hay JOIN posible con
 * `onia_center`, así que se lee aparte y se cruza en memoria.
 *
 * Devuelve `{ entrantes: null, causa }` cuando no se pudo preguntar — nunca un Map vacío, que el
 * núcleo leería como "Chatwoot no tiene nada" y es una afirmación distinta.
 */
export function leerEntrantesDeChatwoot(claves, { ejecutar } = {}) {
  const correr =
    ejecutar || ((args) => execFileSync("docker", args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 }));

  const ids = (claves || []).map(idDeChatwoot).filter(Boolean);
  const sql = sqlEntrantes(ids);
  if (!sql) return { entrantes: null, causa: "ninguna conversacion tiene un id de Chatwoot que preguntar" };

  let contenedor;
  try {
    contenedor = String(
      correr(["ps", "--filter", `name=${CONTENEDOR_CHATWOOT_PREFIJO}`, "--format", "{{.Names}}"]),
    )
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)[0];
  } catch (err) {
    return { entrantes: null, causa: unaLineaDeError(err) };
  }
  if (!contenedor) {
    return { entrantes: null, causa: `no encontre el contenedor "${CONTENEDOR_CHATWOOT_PREFIJO}" en docker ps` };
  }

  let salida;
  try {
    salida = correr(["exec", contenedor, "psql", "-U", "postgres", "-d", BASE_CHATWOOT, "-tAc", sql]);
  } catch (err) {
    return { entrantes: null, causa: unaLineaDeError(err) };
  }

  const entrantes = new Map();
  for (const linea of String(salida).split("\n")) {
    const [id, ultimo] = linea.trim().split("|");
    if (id && ultimo) entrantes.set(id.trim(), ultimo.trim());
  }
  return { entrantes, causa: null };
}

export function informe(veredicto) {
  const lineas = [];
  if (!veredicto.medido) {
    lineas.push(`NO MEDIDO: ${veredicto.motivo}`);
    return { texto: lineas.join("\n"), exit: 2 };
  }

  lineas.push(`conversaciones cruzadas: ${veredicto.juzgables} (sanas ${veredicto.sanos})`);

  /**
   * La cobertura del contraste va SIEMPRE, no sólo cuando falla: sin esta línea un Chatwoot
   * caído imprime exactamente lo mismo que un cruce completo y el gate pierde su mitad en mudo.
   */
  const ct = veredicto.contraste || { contrastadas: 0, sinContrastar: 0, motivos: [] };
  lineas.push(
    `contrastadas contra Chatwoot: ${ct.contrastadas} de ${veredicto.juzgables}` +
      (ct.sinContrastar
        ? ` — ${ct.sinContrastar} sin contrastar: ${ct.motivos.map((m) => `${m.motivo} (x${m.veces})`).join("; ")}`
        : ""),
  );
  if (ct.contrastadas === 0) {
    lineas.push(
      "  AVISO: ninguna fila se pudo contrastar, asi que NINGUNA causa esta distinguida. " +
        "Un reloj divergido aca puede ser un entrante sin atender: no correr updates.",
    );
  }

  /**
   * Cada caso sale con su CAUSA y su REMEDIO pegados. Un diagnóstico suelto se lee como una
   * orden, y en esta familia dos de los tres remedios son incompatibles entre sí.
   */
  const conCausa = (etiqueta, c, signo) =>
    `  ${etiqueta}  conv ${c.contactRef}: el reloj dice ${c.relojGuardado} y el prospecto hablo ` +
    `${c.ultimoDelProspecto} (${signo}${horas(c.derivaSegundos)})\n` +
    `              causa: ${c.causa}${c.chatwoot?.motivo ? ` (${c.chatwoot.motivo})` : ""} — ${REMEDIO[c.causa]}`;

  for (const c of veredicto.entrantesSinProcesar || []) {
    lineas.push(
      `  ENTRANTE SIN PROCESAR  conv ${c.contactRef}: Chatwoot recibio un mensaje el ` +
        `${c.chatwoot.ultimoEnChatwoot} y el motor no registro nada despues de ${c.ultimoDelProspecto} ` +
        `(+${horas(c.chatwoot.adelantoSegundos)})\n` +
        `              causa: ${c.causa} — ${REMEDIO[c.causa]}`,
    );
  }
  for (const c of veredicto.adelantados) lineas.push(conCausa("ADELANTADO", c, "+"));
  for (const c of veredicto.atrasados) lineas.push(conCausa("ATRASADO  ", c, "-"));
  for (const c of veredicto.noJuzgables) lineas.push(`  sin juzgar  conv ${c.contactRef}: ${c.motivo}`);

  const sinProcesar = (veredicto.entrantesSinProcesar || []).length;
  const rotos = veredicto.adelantados.length + veredicto.atrasados.length + sinProcesar;
  if (rotos === 0) {
    lineas.push("VEREDICTO: ok — el reloj de cada prospecto coincide con lo que el prospecto hizo");
    return { texto: lineas.join("\n"), exit: 0 };
  }
  if (sinProcesar > 0) {
    lineas.push(
      `VEREDICTO: ROTO — ${sinProcesar} conversacion(es) con un entrante que el bot NO atendio. ` +
        `Eso no es un reloj corrido: es el bug del segundo turno. NO correr ningun update sobre esas filas.`,
    );
  }
  if (rotos > sinProcesar) {
    lineas.push(
      `VEREDICTO: ROTO — ${rotos - sinProcesar} conversacion(es) con el reloj divergido de los hechos. ` +
        `Ese reloj es la ventana de 24 h de Meta y las dos ventanas del rescate: adelantado se escribe ` +
        `fuera de ventana (lo paga el quality rating), atrasado no se escribe nunca.`,
    );
  }
  return { texto: lineas.join("\n"), exit: 1 };
}

export function medir(deps = {}) {
  const { filas, causa } = deps.leerFilas ? deps.leerFilas() : leerFilas(deps);
  if (filas === null) return { medido: false, motivo: `no se pudo leer la base: ${causa}` };

  /**
   * Chatwoot es evidencia EXTRA, no un prerrequisito: si no contesta, el gate igual juzga el
   * reloj y lo que pierde es la CAUSA, que sale `sin_distinguir` con su motivo a la vista.
   * Hacerlo obligatorio convertiría una base de terceros caída en un NO MEDIDO del reloj.
   */
  const claves = filas.map((f) => f?.conversationKey).filter(Boolean);
  const leer = deps.leerEntrantesDeChatwoot || ((c) => leerEntrantesDeChatwoot(c, deps));
  const { entrantes } = leer(claves);
  return divergencias(filas, { ...deps, entrantes });
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  const salida = informe(medir());
  console.log(salida.texto);
  process.exit(salida.exit);
}
