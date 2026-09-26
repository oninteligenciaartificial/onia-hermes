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

import { execFile, spawnSync } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { buildQueCorre } from './lib/arbol-del-build-vivo.mjs';
import { leerDeProduccion, listarDeProduccion } from './lib/vps-o-local.mjs';

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

/**
 * Quien, de los que TIENEN el add-on otorgado, se queda sin canal.
 *
 * Replica la pregunta que hace el producto (onia-platform/lib/plan-limits.ts):
 *   isWhatsAppAddonActive = whatsappAddon || (entitlement active y no vencido)
 *
 * `leeCapacidad` es de que mundo hablamos, y por eso el gate sigue distinguiendo
 * las dos causas: si el build vivo ignora la capacidad, al otorgado sin la
 * columna vieja no le sirve tenerla; si la lee, alcanza con que este vigente.
 *
 * ⚠️ Hasta el 2026-09-05 esto era una sola consulta —"capacidad activa y columna
 * vieja en false"— y daba ROJO FALSO con el fix ya desplegado: esa condicion
 * describe a las orgs que el arreglo ARREGLO, asi que el gate no podia volver a
 * verde nunca (para eso el booleano viejo tendria que estar en `true`, que es la
 * columna que el fix dejo de usar). Mando a "revisar isWhatsAppAddonActive",
 * que estaba sano, y sostuvo dos pedidos de deploy vencidos esperando el ok de
 * Sergio Urcullo.
 */
export function sinCanal(filas, ahora = new Date(), leeCapacidad = true) {
  return filas.filter((f) => {
    // Sin fila de capacidad y sin la columna: no compro el add-on, no le falta nada.
    const otorgado = f.whatsappAddon === true || f.status != null;
    if (!otorgado) return false;
    // La columna vieja alcanza sola en los dos mundos.
    if (f.whatsappAddon === true) return false;
    // El build ignora la capacidad: por bien otorgada que este, no la ve.
    if (!leeCapacidad) return true;
    const vigente = f.status === 'active' && (f.validUntil == null || new Date(f.validUntil) > ahora);
    return !vigente;
  });
}

/** Orgs a las que el producto le negaria el canal teniendo el add-on otorgado. */
async function medirAfectadas(leeCapacidad) {
  try {
    const sql =
      `select o.slug, o."whatsappAddon", coalesce(e.status,''), ` +
      `coalesce(to_char(e."validUntil" at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS"Z"'),'') ` +
      `from public.organizations o ` +
      `left join public.organization_entitlements e on e."organizationId"=o.id ` +
      `and e."featureKey"='addon.whatsapp' order by o.slug;`;
    const out = await salida('docker', ['exec', CONTENEDOR_DB, 'psql', '-U', 'postgres', '-d', 'postgres', '-tAF|', '-c', sql]);
    const filas = out
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => l.split('|'))
      .filter((c) => c.length >= 4)
      .map(([slug, addon, status, validUntil]) => ({
        slug,
        whatsappAddon: addon === 't',
        status: status || null,
        validUntil: validUntil || null,
      }));
    // Cero filas es "no pude medir", no "nadie afectado": la base siempre tiene orgs.
    if (filas.length === 0) return null;
    return sinCanal(filas, new Date(), leeCapacidad);
  } catch {
    return null;
  }
}

/**
 * BUILD_ID vivo -> el arbol en disco que lo produjo -> su sha.
 *
 * Los builds viven en el disco del VPS. Cuando este loop se mudo a nodo-casa
 * `/opt/onia-platform` dejo de existir acá, asi que el `ls` salia vacio y TODO el
 * gate quedaba en `NO MEDIDO` — honesto, exit 2, y por eso nadie lo noto: la mitad
 * barata (la base por `docker exec`) sí contestaba, porque `docker` es un shim que
 * delega en el VPS. Medido el 2026-09-08. Ahora se le pregunta al disco local y,
 * si no contesta, al VPS por SSH.
 *
 * ⚠️ Y DONDE BUSCAR TAMPOCO SE DECIDE ACA (2026-09-26). Esto casaba el `BUILD_ID`
 * solo contra `/opt/onia-platform/build-*`, que es STAGING; desde que produccion se
 * publica por imagen el arbol vivo queda bajo `releases/<sha>-<fecha>/` y
 * `limpiar-builds-staging.sh` borra los `build-*`. Resultado medido ese dia: `exit 2`
 * («no pude leer las orgs de la base o el codigo del build vivo») con la base
 * contestando perfecto — o sea que la mitad cara estaba muda y se leia como
 * ambiental. La tabla de layouts vive en UN lugar porque el punto ciego era de la
 * RECETA, copiada en cuatro instrumentos.
 */
export async function medirShaVivo({
  correr = spawnSync,
  leer = leerDeProduccion,
  listar = listarDeProduccion,
} = {}) {
  try {
    return buildQueCorre({ correr, contenedor: CONTENEDOR_APP, base: DIR_BUILDS, leer, listar })?.sha ?? null;
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
  const [buildLeeCapacidad, shaQueArregla] = await Promise.all([
    medirBuildLeeCapacidad(repo, shaVivo),
    medirShaQueArregla(repo),
  ]);
  // Quien queda sin canal depende de QUE build corre, asi que esto va despues:
  // con el build viejo, tener la capacidad no sirve de nada. Si no se pudo medir
  // el build, tampoco se puede decidir quien esta afectado -> no_medido, que el
  // veredicto ya trata como "nunca verde".
  const afectadas = buildLeeCapacidad === null ? null : await medirAfectadas(buildLeeCapacidad);

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
