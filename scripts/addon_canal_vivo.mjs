#!/usr/bin/env node
// ¿El cliente que YA tiene el chatbot otorgado puede conectar su canal?
//
// Mide TRES cosas y las cruza, porque el defecto se ve igual desde dos causas
// opuestas y arreglarlas al reves cuesta una vuelta entera:
//
//   1. Cuantas orgs tienen la capacidad `addon.whatsapp` ACTIVA pero la columna
//      vieja organizations."whatsappAddon" en false. Esas son las que, si el
//      codigo mira solo la columna, ven "Contratar el chatbot" habiendo pagado.
//   2. Que build corre AHORA app.onia.com.bo (BUILD_ID vivo -> /opt/onia-platform/build-<sha>).
//   3. Si el CODIGO FUENTE de ese build lee la capacidad (isWhatsAppAddonActive)
//      o la columna cruda.
//
// Con (1) y (3) el veredicto distingue "el codigo esta mal" de "produccion corre
// un build viejo", que se arreglan en lugares opuestos.
//
// Medido el 2026-09-05: 3 orgs divergentes y el build vivo (443e3e7, de las 20:39
// La Paz) era ANTERIOR al fix (7599b5d, 22:13). La captura de la tarjeta mostraba
// "Contratar el chatbot" dos veces sobre una org con 3 de 500 conversaciones
// consumidas — o sea el add-on activo.

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const ejecutar = promisify(execFile);

const CONTENEDOR_APP = 'onia-platform';
const CONTENEDOR_DB = 'supabase-db';
const DIR_BUILDS = '/opt/onia-platform';
// El clon de master primero: el sha que corre produccion vive ahi seguro.
const REPOS = ['/root/loops/onia-platform', '/root/loops/onia-platform-chatbot'];
// Las dos rutas que pintan las tarjetas de /settings/chatbot. Las DOS tienen que
// leer la capacidad: el mismo commit arreglo las dos y la captura mostraba los
// dos botones mal.
const RUTAS = [
  'app/api/chatbot-canal-whatsapp/route.ts',
  'app/api/chatbot-canal-web/route.ts',
];
const HELPER = 'isWhatsAppAddonActive';

/**
 * Veredicto puro. Separado de la medicion para poder probarlo sin tocar produccion.
 * `afectadas` o `buildLeeCapacidad` en null significan "no pude medir" y NUNCA
 * pueden salir verdes: un "al dia" falso es como este defecto sobrevivio 4 horas.
 */
export function veredicto({ afectadas, buildLeeCapacidad, shaVivo, shaQueArregla }) {
  if (afectadas === null || afectadas === undefined || buildLeeCapacidad === null || buildLeeCapacidad === undefined) {
    return {
      exit: 2,
      causa: 'no_medido',
      aviso: false,
      mensaje:
        'NO MEDIDO: no pude leer las orgs de la base o el codigo del build vivo. ' +
        'No es verde: sin esta medicion un cliente con el add-on puede estar viendo "Contratar el chatbot".',
    };
  }

  const n = afectadas.length;
  const slugs = afectadas.map((o) => o.slug).join(', ');

  if (buildLeeCapacidad) {
    if (n === 0) {
      return { exit: 0, causa: 'ok', aviso: false, mensaje: `OK: el build vivo (${shaVivo}) lee la capacidad y ninguna org diverge.` };
    }
    // El codigo mira las dos fuentes y aun asi quedan afuera: no es el deploy.
    return {
      exit: 1,
      causa: 'codigo',
      aviso: false,
      mensaje:
        `ROJO (codigo): el build vivo (${shaVivo}) YA lee la capacidad y aun asi ${n} org(s) ` +
        `quedan sin canal: ${slugs}. El problema no es el build; revisar ${HELPER} y las rutas del canal.`,
    };
  }

  // El build vivo lee la columna cruda.
  if (n === 0) {
    return {
      exit: 0,
      causa: 'latente',
      aviso: true,
      mensaje:
        `OK con aviso: hoy ninguna org diverge, pero el build vivo (${shaVivo}) lee la columna cruda. ` +
        `Al proximo cliente al que le otorguen la capacidad sin tocar la columna, la tarjeta le va a decir ` +
        `"Contratar el chatbot" habiendo pagado.` +
        (shaQueArregla ? ` El arreglo ya esta en el codigo (${shaQueArregla}): falta desplegarlo.` : ''),
    };
  }

  return {
    exit: 1,
    causa: 'falta_desplegar',
    aviso: false,
    mensaje:
      `ROJO (falta desplegar): ${n} org(s) tienen el chatbot OTORGADO y la tarjeta les dice ` +
      `"Contratar el chatbot": ${slugs}. El codigo ya esta bien` +
      (shaQueArregla ? ` (${shaQueArregla})` : '') +
      `; el build vivo (${shaVivo}) es anterior. NO tocar el codigo: desplegar.`,
  };
}

async function salida(cmd, args) {
  const { stdout } = await ejecutar(cmd, args, { maxBuffer: 8 * 1024 * 1024 });
  return stdout;
}

/** Orgs con la capacidad activa y la columna vieja en false. */
async function medirAfectadas() {
  try {
    const sql =
      `select o.slug from public.organizations o ` +
      `join public.organization_entitlements e on e."organizationId"=o.id ` +
      `and e."featureKey"='addon.whatsapp' and e.status='active' ` +
      `where o."whatsappAddon" is not true order by o.slug;`;
    const out = await salida('docker', ['exec', CONTENEDOR_DB, 'psql', '-U', 'postgres', '-d', 'postgres', '-tAc', sql]);
    return out
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((slug) => ({ slug }));
  } catch {
    return null;
  }
}

/** BUILD_ID vivo -> /opt/onia-platform/build-<sha> -> sha. */
async function medirShaVivo() {
  try {
    const buildId = (await salida('docker', ['exec', CONTENEDOR_APP, 'cat', '/app/.next/BUILD_ID'])).trim();
    if (!buildId) return null;
    const dirs = (await salida('bash', ['-c', `ls -d ${DIR_BUILDS}/build-*/ 2>/dev/null || true`]))
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    for (const d of dirs) {
      const f = `${d}.next/standalone/.next/BUILD_ID`;
      if (!existsSync(f)) continue;
      const b = (await salida('cat', [f])).trim();
      if (b === buildId) {
        const m = d.match(/build-([0-9a-f]+)\/?$/);
        if (m) return m[1];
      }
    }
    return null;
  } catch {
    return null;
  }
}

function repoDisponible() {
  return REPOS.find((r) => existsSync(`${r}/.git`)) || null;
}

/** ¿El codigo fuente de ESE build llama al helper en las dos rutas del canal? */
async function medirBuildLeeCapacidad(repo, sha) {
  if (!repo || !sha) return null;
  try {
    for (const ruta of RUTAS) {
      const src = await salida('git', ['-C', repo, 'show', `${sha}:${ruta}`]);
      if (!src.includes(HELPER)) return false;
    }
    return true;
  } catch {
    return null;
  }
}

/** El commit que metio el helper en la ruta: lo que hay que desplegar. */
async function medirShaQueArregla(repo) {
  if (!repo) return null;
  try {
    const out = await salida('git', ['-C', repo, 'log', '--format=%h', '-1', '-S', HELPER, 'origin/master', '--', RUTAS[0]]);
    return out.trim() || null;
  } catch {
    return null;
  }
}

async function main() {
  const repo = repoDisponible();
  const shaVivo = await medirShaVivo();
  const [afectadas, buildLeeCapacidad, shaQueArregla] = await Promise.all([
    medirAfectadas(),
    medirBuildLeeCapacidad(repo, shaVivo),
    medirShaQueArregla(repo),
  ]);

  const v = veredicto({ afectadas, buildLeeCapacidad, shaVivo, shaQueArregla });
  console.log(v.mensaje);
  process.exit(v.exit);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.log(`NO MEDIDO: ${e.message}`);
    process.exit(2);
  });
}
