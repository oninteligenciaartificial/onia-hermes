// Leer un archivo de PRODUCCION desde donde sea que esté corriendo el loop.
//
// Un gate VIVO mide producción, y producción vive en `/opt/...` del VPS. Cuando el
// loop se muda de máquina —chatbot-cola se mudó a nodo-casa— esas rutas dejan de
// existir en el disco local y el gate queda CIEGO. No falla en verde (sale con
// `NO MEDIDO`, exit 2, que es honesto), pero el efecto es el mismo: nadie mira, nada
// se pone rojo, y el objetivo del carril se sigue midiendo con OTRAS cifras que
// siguen en meta.
//
// Medido el 2026-09-08 desde nodo-casa: de los gates vivos de este carril, TRES
// salían `NO MEDIDO` y los tres por lo mismo —leen `/opt` del disco local—, mientras
// `docker exec` sí funcionaba (es un shim que delega en el VPS por SSH). O sea que
// la mitad cara de la medición estaba muda y la barata no.
//
//   addon:canal-vivo        -> «no pude leer las orgs de la base o el codigo del build vivo»
//   recordatorio:vivo       -> «no pude leer /opt/onia-platform/app.env»
//   deploy:plataforma-vivo  -> «BUILD_ID vivo sin par en disco»   (de onia-cola, su zona)
//
// La salida es preguntarle al disco local y, si no contesta, preguntarle al VPS por
// SSH — el nodo de casa tiene `ssh root@187.77.16.63` con BatchMode. Lo que NO se
// puede hacer es confundir «no pude preguntar» con «me contestaron que no»: por eso
// todo devuelve TRI-ESTADO y el `null` nunca se puede leer como una respuesta real.

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

export const VPS = process.env.ONIA_VPS_SSH ?? "root@187.77.16.63";

/** Sin `BatchMode` un SSH sin llave se cuelga pidiendo contraseña y el cron muere por timeout. */
export const SSH_ARGS = [
  "-o",
  "BatchMode=yes",
  "-o",
  "ConnectTimeout=15",
  "-o",
  "StrictHostKeyChecking=accept-new",
];

/** Lee del disco de esta máquina. `null` = no está acá (no es «no pude preguntar»). */
export function leerLocal(ruta) {
  if (!existsSync(ruta)) return null;
  try {
    return readFileSync(ruta, "utf8");
  } catch {
    return null;
  }
}

/** Le pregunta al VPS. `null` = no pude preguntar O no está allá; las dos son «no medí». */
export function leerPorSsh(ruta, destino = VPS) {
  const r = spawnSync("ssh", [...SSH_ARGS, destino, "cat", "--", ruta], {
    encoding: "utf8",
    timeout: 60_000,
  });
  if (r.error || r.status !== 0) return null;
  return r.stdout;
}

/** Lista directorios que matchean un patrón en el VPS. `null` = no pude preguntar. */
export function listarPorSsh(patron, destino = VPS) {
  const r = spawnSync("ssh", [...SSH_ARGS, destino, `ls -d ${patron} 2>/dev/null || true`], {
    encoding: "utf8",
    timeout: 60_000,
  });
  if (r.error || r.status !== 0) return null;
  return r.stdout
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/**
 * El archivo de producción, venga de donde venga.
 *
 * Devuelve `{ contenido, origen }` con `origen` en `"local" | "remoto"`, o `null`
 * cuando NINGUNA de las dos vías contestó. El `null` es el punto entero de este
 * módulo: un gate que reciba `""` no puede distinguir «el archivo está vacío» de
 * «no llegué a preguntar», y ahí es donde un `NO MEDIDO` se vuelve un falso verde.
 *
 * Las dos vías se inyectan para poder validar por mutación sin tocar producción.
 */
export function leerDeProduccion(ruta, { local = leerLocal, remoto = leerPorSsh } = {}) {
  const enDisco = local(ruta);
  if (enDisco !== null && enDisco !== undefined) return { contenido: enDisco, origen: "local" };

  const enVps = remoto(ruta);
  if (enVps !== null && enVps !== undefined) return { contenido: enVps, origen: "remoto" };

  return null;
}

/**
 * Los directorios de producción que matchean `patron`, del disco local o del VPS.
 *
 * Devuelve `{ dirs, origen }` o `null`. Ojo con la diferencia que cuesta cara:
 * una lista VACÍA del VPS es una respuesta real («no hay ningún build armado»), y
 * `null` es «no pude preguntar». Meterlas en la misma bolsa es lo que hace que un
 * gate declare «al día» sobre algo que no midió.
 */
export function listarDeProduccion(patron, { local = listarLocal, remoto = listarPorSsh } = {}) {
  const enDisco = local(patron);
  if (enDisco !== null && enDisco !== undefined && enDisco.length > 0) {
    return { dirs: enDisco, origen: "local" };
  }

  const enVps = remoto(patron);
  if (enVps !== null && enVps !== undefined) return { dirs: enVps, origen: "remoto" };

  return null;
}

/** Lista local por glob de shell, para no depender de una librería por esto. */
export function listarLocal(patron) {
  const r = spawnSync("bash", ["-c", `ls -d ${patron} 2>/dev/null || true`], {
    encoding: "utf8",
    timeout: 30_000,
  });
  if (r.error || r.status !== 0) return null;
  return r.stdout
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}
