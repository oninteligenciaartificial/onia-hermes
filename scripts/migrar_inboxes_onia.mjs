#!/usr/bin/env node
/**
 * migrar_inboxes_onia.mjs — poner cada inbox en la columna que le corresponde.
 *
 * Nace del 2026-09-03. Medido en produccion: el inbox 4 de Chatwoot ("Onia Web", el widget
 * de onia.com.bo) tenia ONCE conversaciones —cinco de personas reales, una con su correo— y
 * NINGUNA se veia en `/inbox`, porque `Onia (interna)` tenia `chatwootInboxId=5`, que es el
 * inbox de WhatsApp. El objetivo del carril ("un desconocido escribe y esa conversacion se ve
 * en la bandeja") estaba roto justo en el canal por el que de hecho escriben los desconocidos.
 *
 * Lo que hace: en UNA transaccion, sobre la org `Onia (interna)`:
 *
 *     chatwootInboxId         5  →  4   (el widget web)
 *     chatwootWhatsappInboxId NULL → 5  (WhatsApp)
 *
 * `ZZ QA Clinica Chatbot` no se toca: su 7 ya es un WebWidget y esta en la columna correcta.
 *
 * 🔴 EL ORDEN IMPORTA, Y EN UN SOLO SENTIDO. Esto se corre DESPUES de desplegar el codigo que
 * lee las dos columnas (commit 9c77883 de onia-platform). Al reves, el codigo viejo —que manda
 * WhatsApp por `chatwootInboxId`— empezaria a mandar WhatsApp por el inbox del widget web.
 * El codigo nuevo tiene fallback y aguanta la base sin migrar; la base migrada NO aguanta el
 * codigo viejo. Por eso el script se niega a correr si no le confirman el deploy.
 *
 *   node scripts/migrar_inboxes_onia.mjs                    → muestra el plan y NO escribe
 *   node scripts/migrar_inboxes_onia.mjs --aplicar --deploy-hecho <sha>
 *
 * NO ES un `prisma migrate`: no cambia el esquema (las dos columnas ya existen en produccion),
 * mueve DATOS de una fila. La base de produccion es el contenedor `supabase-db`, schema
 * `public` — no la nube de Supabase.
 */

import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const ORG = 'Onia (interna)';
export const INBOX_WEB = 4;
export const INBOX_WHATSAPP = 5;

/** Lo que la base tiene HOY, para no escribir a ciegas. */
export const SQL_LEER =
  'select o.name, cs."chatwootInboxId", cs."chatwootWhatsappInboxId" ' +
  'from public.organizations o ' +
  'join public.clinic_settings cs on cs."organizationId" = o.id ' +
  `where o.name = '${ORG}';`;

/**
 * La escritura. En una transaccion y con el WHERE por nombre de org: si el nombre no existe,
 * el UPDATE afecta cero filas y el COMMIT no cambia nada — nunca pisa la org equivocada.
 */
export const SQL_APLICAR =
  'begin; ' +
  'update public.clinic_settings cs ' +
  `set "chatwootInboxId" = ${INBOX_WEB}, "chatwootWhatsappInboxId" = ${INBOX_WHATSAPP} ` +
  'from public.organizations o ' +
  `where o.id = cs."organizationId" and o.name = '${ORG}'; ` +
  'commit;';

/**
 * El veredicto sobre el estado leido, separado de la escritura: es lo que se prueba sin base.
 *
 * `yaMigrada` existe para que correrlo dos veces no sea un error: la segunda vez no tiene nada
 * que hacer y lo dice. Un script de migracion que explota al repetirse termina corriendose a
 * mano "con cuidado", que es como se saltean pasos.
 */
export function juzgar(filas) {
  const fila = filas.find((f) => f.nombre === ORG);
  if (!fila) {
    return {
      codigo: 2,
      yaMigrada: false,
      mensaje:
        `NO MEDIDO — la org \`${ORG}\` no aparece en la base. Sin ella no hay que migrar, ` +
        'pero tampoco se puede confirmar: puede ser la base equivocada (la de produccion es ' +
        'el contenedor `supabase-db`).',
    };
  }
  if (fila.web === INBOX_WEB && fila.whatsapp === INBOX_WHATSAPP) {
    return {
      codigo: 0,
      yaMigrada: true,
      mensaje: `YA MIGRADA — \`${ORG}\` tiene web=${INBOX_WEB} y WhatsApp=${INBOX_WHATSAPP}. Nada que hacer.`,
    };
  }
  return {
    codigo: 1,
    yaMigrada: false,
    mensaje:
      `FALTA MIGRAR — \`${ORG}\` tiene web=${fila.web ?? 'NULL'} y WhatsApp=${fila.whatsapp ?? 'NULL'}; ` +
      `deberia tener web=${INBOX_WEB} y WhatsApp=${INBOX_WHATSAPP}. Mientras siga asi, las ` +
      'conversaciones del widget de onia.com.bo no se ven en `/inbox`.',
  };
}

export function parsearFilas(texto) {
  return String(texto)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((linea) => {
      const p = linea.split('|');
      const n = (v) => (v === undefined || v === '' ? null : Number(v));
      return { nombre: p[0], web: n(p[1]), whatsapp: n(p[2]) };
    });
}

function psql(sql, contenedor) {
  return execFileSync('docker', ['exec', '-i', contenedor, 'psql', '-U', 'postgres', '-d', 'postgres', '-t', '-A', '-F', '|'], {
    input: sql,
    encoding: 'utf8',
  });
}

// ---------------------------------------------------------------------------

if (process.argv.includes('--self-check')) {
  let casos = 0;
  const afirmar = (cond, que) => { casos++; if (!cond) { console.error('FALLO:', que); process.exitCode = 1; } };

  // Bytes REALES de la base el 2026-09-03, antes de migrar.
  const antes = parsearFilas('Onia (interna)|5|\n');
  afirmar(antes[0].web === 5, 'lee la columna web');
  afirmar(antes[0].whatsapp === null, 'una columna NULL se lee como null, no como 0');
  afirmar(juzgar(antes).codigo === 1, 'el estado de hoy dice que falta migrar');
  afirmar(juzgar(antes).mensaje.includes('onia.com.bo'), 'y explica que se pierde mientras tanto');

  const despues = parsearFilas('Onia (interna)|4|5\n');
  afirmar(juzgar(despues).codigo === 0, 'el estado destino sale 0');
  afirmar(juzgar(despues).yaMigrada === true, 'y se reconoce como ya migrada (correrlo dos veces no rompe)');

  // A medio camino NO es migrada: si alguien escribio una sola columna a mano, hay que verlo.
  afirmar(juzgar(parsearFilas('Onia (interna)|4|\n')).codigo === 1, 'media migracion no cuenta como hecha');

  afirmar(juzgar([]).codigo === 2, 'sin la org no se concluye que este bien');
  afirmar(SQL_APLICAR.includes('begin;') && SQL_APLICAR.includes('commit;'), 'la escritura va en una transaccion');
  afirmar(SQL_APLICAR.includes(`o.name = '${ORG}'`), 'y acotada por nombre de org');

  if (!process.exitCode) console.log(`self-check: ok — ${casos} casos`);
  process.exit(process.exitCode || 0);
}

function main() {
  const contenedor = process.env.ONIA_DB_CONTAINER || 'supabase-db';
  const aplicar = process.argv.includes('--aplicar');
  const iDeploy = process.argv.indexOf('--deploy-hecho');
  const sha = iDeploy !== -1 ? process.argv[iDeploy + 1] : '';

  let veredicto;
  try {
    veredicto = juzgar(parsearFilas(psql(SQL_LEER, contenedor)));
  } catch (e) {
    console.error(`NO MEDIDO — no se pudo leer \`${contenedor}\`: ${e.message.split('\n')[0]}`);
    return 2;
  }

  console.log(veredicto.mensaje);
  if (veredicto.codigo === 2 || veredicto.yaMigrada) return veredicto.codigo;

  if (!aplicar) {
    console.log(
      '\nPLAN (no se escribio nada):\n' +
        `  chatwootInboxId         → ${INBOX_WEB}  (widget web)\n` +
        `  chatwootWhatsappInboxId → ${INBOX_WHATSAPP}  (WhatsApp)\n\n` +
        'Para aplicarlo hace falta que el codigo que lee las DOS columnas ya este desplegado:\n' +
        '  node scripts/migrar_inboxes_onia.mjs --aplicar --deploy-hecho <sha-en-produccion>',
    );
    return 1;
  }

  if (!sha || sha.startsWith('--')) {
    console.error(
      '\nNO SE APLICO — falta `--deploy-hecho <sha>`. Es a proposito: con el codigo viejo en\n' +
        'produccion, esta migracion manda WhatsApp por el inbox del widget web. Verificar con\n' +
        '`docker exec onia-platform cat .next/BUILD_ID` y el sha que corresponde.',
    );
    return 1;
  }

  psql(SQL_APLICAR, contenedor);
  const post = juzgar(parsearFilas(psql(SQL_LEER, contenedor)));
  console.log(`\nAplicada (deploy declarado: ${sha}). Estado ahora: ${post.mensaje}`);
  return post.yaMigrada ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main());
}
