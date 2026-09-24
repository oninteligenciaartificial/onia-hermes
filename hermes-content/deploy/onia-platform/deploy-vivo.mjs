#!/usr/bin/env node
/**
 * ¿Lo que arreglamos en la PLATAFORMA llegó al cliente?
 *
 * POR QUÉ EXISTE. `onia.com.bo` ya tiene su medidor (`deploy-vivo.mjs` de
 * web-venta) y su comando que no caduca (`publicar.sh`). `app.onia.com.bo` no
 * tenía ninguno de los dos, y el hueco no era teórico: el 2026-09-05 la
 * plataforma llevaba 5 commits sin desplegar —entre ellos el dueño con el
 * add-on OTORGADO que no podía conectar su WhatsApp, y la pantalla que decía
 * «3 de 500» arriba y «Contratar el chatbot» abajo— sin UNA tarea de deploy
 * viva que los nombrara. El gate que sí existe para este repo,
 * `deploy_alcanzable.mjs`, declara en su propia cabecera que NO mide esto:
 * mata el fantasma de ANTES del deploy (¿el commit está en la rama de la que
 * se buildea?), no el de después.
 *
 * QUÉ MIDE, y por qué así. La pregunta no es «¿hubo algún deploy?» sino «¿hay
 * trabajo mío que el cliente todavía no ve?». Acá se contesta con SHAS, no con
 * fechas. Los varados son los commits de `origin/master` posteriores al que
 * corre y que además VIAJAN al navegador.
 *
 * DE DÓNDE SALE EL SHA QUE CORRE — y por qué son dos vías. La primera es la
 * ETIQUETA de la imagen del contenedor (`onia-platform:release-<sha>`): el
 * publicador estampa ahí el commit, así que basta leer el nombre. La segunda,
 * de respaldo, es la vieja: casar el `BUILD_ID` que sirve el contenedor contra
 * los `/opt/onia-platform/build-<sha>/` del disco. Si las dos contestan y
 * discrepan no se elige ninguna (ver `shaVivoConciliado`).
 *
 * La vía del disco dejó de alcanzar sola, y no por un fallo: el deploy cambió
 * de forma —construye una imagen en vez de swapear `runtime-next`— y encima los
 * `build-<sha>` de staging se BORRAN a propósito para liberar disco
 * (`limpiar-builds-staging.sh` se llevó 92 de una vez). Medido el 2026-09-24:
 * producción corría `release-7bcd0a83`, que es el HEAD exacto de `master` —o
 * sea AL DIA— y este gate decía NO PUDE MEDIR porque su `BUILD_ID` no casaba
 * contra ningún directorio. Un NO PUDE MEDIR permanente es el peor de los
 * rojos: se lee como «el ambiental de siempre» y se saltea, y con él se saltea
 * la única pregunta que este gate existe para contestar.
 *
 * NO se usa `docker inspect --format '{{.Created}}'`. El swap reemplaza el
 * runtime y REINICIA el contenedor, no lo recrea, así que `Created` queda
 * anclado al día que se levantó y se aleja del último commit para siempre
 * aunque el deploy esté al día. Medido el 2026-09-04: por esa regla daban «17
 * commits sin desplegar» y, casando el BUILD_ID, corría el HEAD de `master`.
 * Cero. Un instrumento que inventa trabajo urgente hace abrir pedidos de deploy
 * que a Sergio Urcullo le llegan igual que los de verdad.
 *
 * LA GUARDA QUE EVITA EL DAÑO. Un pedido heredado puede pedir publicar un build
 * ANTERIOR al que ya corre, y obedecerlo RETROCEDE producción (t_18ea4aff,
 * 2026-09-04: pedía `build-a4b1d97` con `build-b5e23d4` vivo, que lo incluye —
 * el swap habría apagado el fix de la CSP del add-on de WhatsApp). Por eso, si
 * lo que se publicaría no desciende de lo que corre, el veredicto es RETROCEDE
 * y nadie publica nada.
 *
 * CÓMO NO FALLA EN VERDE. Cada rama que no puede medir sale por NO_PUDE_MEDIR,
 * nunca por AL_DIA: sin BUILD_ID legible, sin sha que case, sin HEAD, o sin
 * respuesta de git. Un `git log` vacío tiene dos causas opuestas —no hay nada
 * varado, o el comando falló— y confundirlas es como esta familia de gates se
 * rinde en verde; por eso `[]` es un dato y `null` es la ausencia de dato.
 *
 * Uso:
 *   node hermes-content/deploy/onia-platform/deploy-vivo.mjs
 *   node hermes-content/deploy/onia-platform/deploy-vivo.mjs --json
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

// El mismo destino y los mismos flags que usan los demás gates vivos del sistema:
// tenerlos en un solo lugar es lo que evita que uno se quede sin `BatchMode` y
// cuelgue el cron pidiendo una contraseña que nadie va a escribir.
import { VPS, SSH_ARGS } from '../../../scripts/lib/vps-o-local.mjs';

// ── veredictos ──────────────────────────────────────────────────────────────
export const AL_DIA = 0;
export const ARREGLOS_VARADOS = 1;
export const NO_PUDE_MEDIR = 2;
export const RETROCEDE = 3;

export const CUBRE = 'CUBRE';
export const VIEJO = 'VIEJO';
export const NINGUNO = 'NINGUNO';

export const REPO = process.env.ONIA_PLATFORM_REPO ?? '/root/loops/onia-platform';
export const RAMA_DEPLOY = 'origin/master';
export const BASE = process.env.ONIA_PLATFORM_BASE ?? '/opt/onia-platform';
export const CONTENEDOR = 'onia-platform';
export const COMANDO_PUBLICAR = 'bash /opt/onia-platform/_deploy/publicar.sh';

// Un archivo que sólo existe para el desarrollo NO cambia lo que el navegador
// recibe. La lista es de EXCLUSIÓN a propósito: por defecto un archivo viaja,
// así un archivo nuevo nace contado y hay que excluirlo a mano, a la vista. Al
// revés —una lista de inclusión— el día que aparece una carpeta nueva deja de
// vigilarse sin que nada se ponga rojo.
export const NO_VIAJA = [
  /(^|\/)__tests__\//,
  /(^|\/)scripts\//,
  /\.test\.[cm]?[jt]sx?$/,
  /\.spec\.[cm]?[jt]sx?$/,
  /(^|\/)vitest\.config\./,
  /(^|\/)playwright\.config\./,
  /(^|\/)\.claude\//,
  /(^|\/)docs\//,
  /\.md$/,
];

/** ¿Alguno de estos archivos cambia lo que el cliente recibe? Sin datos: sí. */
export function llegaAlCliente(archivos) {
  if (!Array.isArray(archivos) || archivos.length === 0) return true;
  return archivos.some((a) => !NO_VIAJA.some((re) => re.test(a)));
}

/** El BUILD_ID vivo, casado contra los build-<sha> del disco. null = no se sabe. */
export function shaQueCorre({ buildIdVivo, builds }) {
  if (!buildIdVivo) return null;
  if (!Array.isArray(builds)) return null;
  const hit = builds.find((b) => b && b.buildId && b.buildId === buildIdVivo);
  return hit ? hit.sha : null;
}

/**
 * El sha que el deploy le estampó a la imagen del contenedor.
 *
 * Es la vía VIGENTE, y no depende de que sobreviva nada en disco: el publicador
 * construye `onia-platform:release-<sha>` y levanta el contenedor con ella, así
 * que el commit que corre viaja en el nombre. `latest`, un tag sin sha o algo
 * que no sea hexadecimal devuelven `null` — un nombre que no nombra un commit
 * no se fuerza a parecerlo.
 */
export function shaDeEtiqueta(imagen) {
  if (typeof imagen !== 'string') return null;
  const m = imagen.match(/:release-([0-9a-f]{7,40})$/i);
  return m ? m[1].toLowerCase() : null;
}

/** ¿Dos nombres del mismo commit? La etiqueta trae 8 dígitos y el disco 7. */
function mismoCommit(a, b) {
  const n = Math.min(a.length, b.length);
  return a.slice(0, n) === b.slice(0, n);
}

/**
 * Concilia las DOS vías que pueden decir qué corre, y devuelve `{ sha, motivo }`.
 *
 * Manda la etiqueta porque es lo que el deploy ESCRIBE hoy; el BUILD_ID casado
 * contra `build-<sha>` queda de respaldo para los swaps viejos. Si las dos
 * contestan y discrepan NO se elige ninguna: el veredicto de este gate publica
 * o retiene producción, y ahí «no sé» es un dato, no un empate a resolver.
 */
export function shaVivoConciliado({ shaEtiqueta, shaBuildId }) {
  if (shaEtiqueta && shaBuildId && !mismoCommit(shaEtiqueta, shaBuildId)) {
    return { sha: null, motivo: `la imagen dice ${shaEtiqueta} y el BUILD_ID casa con ${shaBuildId}: no elijo` };
  }
  const sha = shaEtiqueta || shaBuildId || null;
  if (!sha) {
    return { sha: null, motivo: 'ni la etiqueta de la imagen ni el BUILD_ID dicen qué commit corre' };
  }
  return { sha, motivo: null };
}

export function diagnosticar({ shaVivo, headSha, varados, desciende, motivoSinSha }) {
  if (!shaVivo) {
    // El motivo lo trae quien intentó averiguarlo: dar por sentada la causa
    // ("BUILD_ID sin par en disco") mandaba a buscar el problema donde no está
    // el día que el deploy cambió de forma.
    return { codigo: NO_PUDE_MEDIR, motivo: motivoSinSha || 'no sé qué commit corre en producción', varados: [] };
  }
  if (!headSha) {
    return { codigo: NO_PUDE_MEDIR, motivo: `no pude leer el HEAD de ${RAMA_DEPLOY}`, varados: [] };
  }
  if (varados === null || varados === undefined) {
    return { codigo: NO_PUDE_MEDIR, motivo: 'git no contestó qué commits hay después del build vivo', varados: [] };
  }
  // `desciende` sólo importa si hay algo que publicar: con la rama al día, que
  // el HEAD sea el propio sha vivo ya lo responde.
  if (varados.length === 0) {
    return { codigo: AL_DIA, motivo: `producción corre ${shaVivo} y nada posterior cambia lo que el cliente ve`, varados: [] };
  }
  if (desciende === null || desciende === undefined) {
    return { codigo: NO_PUDE_MEDIR, motivo: 'no pude preguntar si lo nuevo desciende de lo que corre', varados: [] };
  }
  if (desciende === false) {
    return {
      codigo: RETROCEDE,
      motivo: `${headSha} NO desciende de ${shaVivo}: publicarlo retrocedería producción`,
      varados,
    };
  }
  return { codigo: ARREGLOS_VARADOS, motivo: `${varados.length} arreglo(s) que el cliente no ve`, varados };
}

export function evaluarStaged({ staged, headSha }) {
  if (!staged) return { estado: NINGUNO, motivo: 'no hay ningún build armado en disco' };
  if (staged.sha !== headSha) {
    return { estado: VIEJO, motivo: `el build armado es de ${staged.sha} y el HEAD es ${headSha}` };
  }
  if (!staged.integro) {
    return { estado: VIEJO, motivo: `el build de ${staged.sha} está incompleto: el swap dejaría producción sin server.js` };
  }
  return { estado: CUBRE, motivo: `el build de ${staged.sha} está armado e íntegro`, ruta: staged.ruta ?? `${BASE}/build-${staged.sha}` };
}

// ── lectura del mundo real (nada de esto corre al importar) ─────────────────

function corre(cmd, args, opts = {}) {
  try {
    return execFileSync(cmd, args, { encoding: 'utf8', timeout: 30000, stdio: ['ignore', 'pipe', 'ignore'], ...opts }).trim();
  } catch {
    return null;
  }
}

export function buildIdVivo(contenedor = CONTENEDOR) {
  return corre('docker', ['exec', contenedor, 'cat', '/app/.next/BUILD_ID']) || null;
}

/**
 * La imagen con la que se creó el contenedor vivo (`onia-platform:release-<sha>`).
 *
 * Es `.Config.Image`, no `.Created`: la fecha no sirve para nada acá (ver la
 * cabecera), pero el NOMBRE de la imagen lleva el commit adentro y no se mueve
 * cuando el contenedor se reinicia.
 */
export function imagenViva(contenedor = CONTENEDOR) {
  return corre('docker', ['inspect', contenedor, '--format', '{{.Config.Image}}']) || null;
}

/** Los build-<sha> del disco con su BUILD_ID y si el standalone está íntegro. */
export function buildsEnDisco(base = BASE) {
  let dirs;
  try {
    dirs = readdirSync(base).filter((d) => d.startsWith('build-') && !d.endsWith('.log') && !d.endsWith('.sh'));
  } catch {
    return null;
  }
  return dirs.map((d) => {
    const sha = d.slice('build-'.length);
    const nb = `${base}/${d}/.next/standalone`;
    let id = null;
    try {
      id = readFileSync(`${nb}/.next/BUILD_ID`, 'utf8').trim();
    } catch {
      /* build a medio armar: queda con buildId null y nunca casa */
    }
    return {
      sha,
      buildId: id,
      ruta: `${base}/${d}`,
      integro: Boolean(id) && existsSync(`${nb}/server.js`) && existsSync(`${nb}/node_modules`) && existsSync(`${nb}/.next/static`),
    };
  });
}

/**
 * La salida del VPS (`sha|buildId|integro` por línea) con la MISMA forma que la
 * del disco, para que `shaQueCorre` y `evaluarStaged` no sepan de dónde vino.
 *
 * `integro` se decide allá, donde están los archivos, y viaja como `si`/`no`.
 * Traducirlo como «tiene BUILD_ID» sería el error caro: `evaluarStaged` diría
 * CUBRE sobre un build a medio armar y el swap dejaría producción sin
 * `server.js`. Un `buildId` vacío queda en `null` —nunca cadena vacía— porque
 * `''` casaría por descuido contra un `buildIdVivo` también vacío.
 */
export function parsearBuildsSsh(salida, base = BASE) {
  if (typeof salida !== 'string') return null;
  return salida
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((linea) => {
      const [sha, buildId, integro] = linea.split('|');
      return { sha, buildId: buildId || null, ruta: `${base}/build-${sha}`, integro: integro === 'si' };
    })
    .filter((b) => b.sha);
}

/** Los builds del VPS. `null` = no pude preguntar; `[]` = pregunté y no hay ninguno. */
export function buildsPorSsh(base = BASE, destino = VPS) {
  const guion = `for d in ${base}/build-*/; do [ -d "$d" ] || continue; n=$(basename "$d"); case "$n" in *.log|*.sh) continue;; esac; nb="$d.next/standalone"; id=$(tr -d "[:space:]" < "$nb/.next/BUILD_ID" 2>/dev/null); integro=no; if [ -n "$id" ] && [ -f "$nb/server.js" ] && [ -d "$nb/node_modules" ] && [ -d "$nb/.next/static" ]; then integro=si; fi; printf '%s|%s|%s\\n' "\${n#build-}" "$id" "$integro"; done`;
  const r = spawnSync('ssh', [...SSH_ARGS, destino, guion], { encoding: 'utf8', timeout: 60_000 });
  if (r.error || r.status !== 0) return null;
  return parsearBuildsSsh(r.stdout, base);
}

/**
 * Los builds de producción, del disco de esta máquina o del VPS.
 *
 * Devuelve `{ builds, origen }` o `null`. El `null` es el punto entero: un gate
 * que reciba `[]` no puede distinguir «no hay ningún build armado» de «no llegué
 * a preguntar», y ahí es donde un `NO PUDE MEDIR` se vuelve un falso «al día».
 * Una lista local vacía SÍ es una respuesta (el directorio existe y está vacío),
 * así que no se cae al VPS por ella: `buildsEnDisco` ya devuelve `null` —y sólo
 * `null`— cuando la ruta no existe, que es el caso de nodo-casa.
 *
 * Las dos vías se inyectan para poder validar por mutación sin tocar producción.
 */
export function buildsDeProduccion(base = BASE, { local = buildsEnDisco, remoto = buildsPorSsh } = {}) {
  const enDisco = local(base);
  if (enDisco !== null && enDisco !== undefined) return { builds: enDisco, origen: 'local' };

  const enVps = remoto(base);
  if (enVps !== null && enVps !== undefined) return { builds: enVps, origen: 'remoto' };

  return null;
}

export function headDeploy(repo = REPO) {
  corre('git', ['-C', repo, 'fetch', '--quiet', 'origin']);
  return corre('git', ['-C', repo, 'rev-parse', '--short', RAMA_DEPLOY]);
}

/** ¿`hijo` desciende de `ancestro`? null si no se pudo preguntar. */
export function desciendeDe(ancestro, hijo, repo = REPO) {
  if (!ancestro || !hijo) return null;
  try {
    execFileSync('git', ['-C', repo, 'merge-base', '--is-ancestor', ancestro, hijo], { stdio: 'ignore', timeout: 30000 });
    return true;
  } catch (e) {
    // exit 1 = no es ancestro (dato). Cualquier otro código = no se pudo
    // preguntar (ausencia de dato), y eso NO se puede confundir con un `false`.
    return e && e.status === 1 ? false : null;
  }
}

/**
 * Commits de la rama de deploy posteriores al sha vivo que SÍ viajan al cliente.
 *
 * ⚠️ `--no-merges` no es cosmético: es el número que se cita en el pedido de
 * deploy, o sea lo único que Sergio Urcullo lee antes de contestar «ok». Sin él
 * el conteo salía inflado (el 2026-09-06: «4 arreglos» sobre 2 reales, porque
 * los dos merges que los trajeron contaban de nuevo el mismo trabajo).
 *
 * Y el filtro va ACÁ y no en `llegaAlCliente` a propósito: `git log --name-only`
 * no lista los archivos de un merge, así que todo merge llega con `[]`, y ese
 * `[]` significa «no sé qué tocó» — que por diseño cuenta como que viaja, para
 * pedir un deploy de más y nunca declarar al día lo que no lo está. Tocar el
 * clasificador rompería ese sesgo para todos los commits, no sólo los merges.
 */
export function varadosDesde(shaVivo, repo = REPO) {
  if (!shaVivo) return null;
  const crudo = corre('git', ['-C', repo, 'log', '--no-merges', '--format=%h\t%s', `${shaVivo}..${RAMA_DEPLOY}`]);
  if (crudo === null) return null;
  if (crudo === '') return [];
  const out = [];
  for (const linea of crudo.split('\n')) {
    const [sha, ...resto] = linea.split('\t');
    if (!sha) continue;
    const archivos = corre('git', ['-C', repo, 'show', '--pretty=', '--name-only', sha]);
    // Un merge vacío no lista archivos: `null` acá es «no sé», y llegaAlCliente
    // lo cuenta como que viaja. Se prefiere pedir un deploy de más.
    if (llegaAlCliente(archivos === null ? null : archivos.split('\n').filter(Boolean))) {
      out.push({ sha, asunto: resto.join('\t') });
    }
  }
  return out;
}

export function medir() {
  const builds = buildsDeProduccion()?.builds ?? null;
  const shaBuildId = shaQueCorre({ buildIdVivo: buildIdVivo(), builds });
  const shaEtiqueta = shaDeEtiqueta(imagenViva());
  const { sha: shaVivo, motivo: motivoSinSha } = shaVivoConciliado({ shaEtiqueta, shaBuildId });
  const headSha = headDeploy();
  const varados = varadosDesde(shaVivo);
  const d = diagnosticar({ shaVivo, headSha, varados, desciende: desciendeDe(shaVivo, headSha), motivoSinSha });
  const staged = (builds ?? []).find((b) => b.sha === headSha) ?? null;
  return { ...d, shaVivo, headSha, staged: evaluarStaged({ staged, headSha }) };
}

function principal() {
  const r = medir();
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(r, null, 2));
  } else {
    const etiqueta = { [AL_DIA]: 'AL DIA', [ARREGLOS_VARADOS]: 'ARREGLOS VARADOS', [NO_PUDE_MEDIR]: 'NO PUDE MEDIR', [RETROCEDE]: 'RETROCEDE' }[r.codigo];
    console.log(`${etiqueta} — ${r.motivo}`);
    console.log(`  corre: ${r.shaVivo ?? '?'} · ${RAMA_DEPLOY}: ${r.headSha ?? '?'} · staged: ${r.staged.estado} (${r.staged.motivo})`);
    for (const c of r.varados) console.log(`  - ${c.sha} ${c.asunto}`);
    if (r.codigo === ARREGLOS_VARADOS) console.log(`  publicar: ${COMANDO_PUBLICAR}`);
  }
  process.exit(r.codigo);
}

// La medición NO corre al importar: un gate que se dispara solo lanza docker
// exec contra producción y un process.exit() que mata al proceso importador
// antes de su primera línea (medido el 2026-09-03 en demo_agendada_real.mjs).
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  principal();
}
