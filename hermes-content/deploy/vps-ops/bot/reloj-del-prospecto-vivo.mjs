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
 */

import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export const CONTENEDOR_BASE = "supabase-db";

/**
 * El reloj se sella cuando el motor procesa el turno y `created_at` cuando se inserta la fila:
 * entre los dos hay siempre unos segundos. Medido sobre las quince conversaciones sanas de
 * producción el 2026-09-19: la diferencia máxima fue de 5 s. 120 s deja margen de sobra sin
 * tapar ninguna de las cinco divergencias reales, que se cuentan en HORAS.
 */
export const TOLERANCIA_SEGUNDOS = 120;

const SQL = `
select c.contact_ref,
       to_char(c.last_inbound_at,'YYYY-MM-DD"T"HH24:MI:SSOF') as reloj_guardado,
       to_char(max(m.created_at) filter (where m.author = 'contact'),'YYYY-MM-DD"T"HH24:MI:SSOF') as ultimo_del_prospecto,
       count(*) filter (where m.author = 'contact') as mensajes_del_prospecto
from onia_center.bot_conversations c
left join onia_center.bot_messages m on m.conversation_key = c.conversation_key
group by c.contact_ref, c.last_inbound_at
order by c.last_inbound_at desc nulls last
`.trim();

/** Expuesto para que un caso pueda exigir que el SELECT pida las cuatro columnas que el núcleo lee. */
export function columnasDelSelect(sql = SQL) {
  const hastaFrom = sql.slice(0, sql.search(/\bfrom\b/i));
  return hastaFrom;
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
export function divergencias(filas, { toleranciaSegundos = TOLERANCIA_SEGUNDOS } = {}) {
  if (!Array.isArray(filas)) return { medido: false, motivo: "no se pudieron leer las conversaciones" };

  const adelantados = [];
  const atrasados = [];
  const noJuzgables = [];
  let sanos = 0;

  for (const fila of filas) {
    const ref = String(fila?.contactRef ?? "");
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

    const caso = { contactRef: ref, relojGuardado: reloj, ultimoDelProspecto: ultimo, derivaSegundos };
    if (derivaSegundos > toleranciaSegundos) adelantados.push(caso);
    else if (derivaSegundos < -toleranciaSegundos) atrasados.push(caso);
    else sanos += 1;
  }

  const juzgables = adelantados.length + atrasados.length + sanos;
  if (juzgables === 0) {
    return {
      medido: false,
      motivo: "ninguna conversacion tiene reloj Y mensajes del prospecto: no hay nada que cruzar",
      noJuzgables,
    };
  }

  return { medido: true, adelantados, atrasados, sanos, noJuzgables, juzgables };
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
      const [contactRef, relojGuardado, ultimoDelProspecto, mensajesDelProspecto] = linea.split("|");
      return {
        contactRef,
        relojGuardado: relojGuardado || null,
        ultimoDelProspecto: ultimoDelProspecto || null,
        mensajesDelProspecto: Number(mensajesDelProspecto || 0),
      };
    });
  return { filas, causa: null };
}

export function informe(veredicto) {
  const lineas = [];
  if (!veredicto.medido) {
    lineas.push(`NO MEDIDO: ${veredicto.motivo}`);
    return { texto: lineas.join("\n"), exit: 2 };
  }

  lineas.push(`conversaciones cruzadas: ${veredicto.juzgables} (sanas ${veredicto.sanos})`);
  for (const c of veredicto.adelantados) {
    lineas.push(
      `  ADELANTADO  conv ${c.contactRef}: el reloj dice ${c.relojGuardado} y el prospecto hablo ${c.ultimoDelProspecto} (+${horas(c.derivaSegundos)})`,
    );
  }
  for (const c of veredicto.atrasados) {
    lineas.push(
      `  ATRASADO    conv ${c.contactRef}: el reloj dice ${c.relojGuardado} y el prospecto hablo ${c.ultimoDelProspecto} (-${horas(c.derivaSegundos)})`,
    );
  }
  for (const c of veredicto.noJuzgables) lineas.push(`  sin juzgar  conv ${c.contactRef}: ${c.motivo}`);

  const rotos = veredicto.adelantados.length + veredicto.atrasados.length;
  if (rotos === 0) {
    lineas.push("VEREDICTO: ok — el reloj de cada prospecto coincide con lo que el prospecto hizo");
    return { texto: lineas.join("\n"), exit: 0 };
  }
  lineas.push(
    `VEREDICTO: ROTO — ${rotos} conversacion(es) con el reloj divergido de los hechos. ` +
      `Ese reloj es la ventana de 24 h de Meta y las dos ventanas del rescate: adelantado se escribe ` +
      `fuera de ventana (lo paga el quality rating), atrasado no se escribe nunca.`,
  );
  return { texto: lineas.join("\n"), exit: 1 };
}

export function medir(deps = {}) {
  const { filas, causa } = deps.leerFilas ? deps.leerFilas() : leerFilas(deps);
  if (filas === null) return { medido: false, motivo: `no se pudo leer la base: ${causa}` };
  return divergencias(filas, deps);
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  const salida = informe(medir());
  console.log(salida.texto);
  process.exit(salida.exit);
}
