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
 * fechas: el `BUILD_ID` que sirve el contenedor se casa contra los
 * `/opt/onia-platform/build-<sha>/` del disco, y eso dice exactamente qué
 * commit corre. Los varados son los commits de `origin/master` posteriores a
 * ése que además VIAJAN al navegador.
 *
 * DESDE EL 2026-09-24 PRODUCCIÓN ES UNA IMAGEN. El contenedor corre
 * `onia-platform:release-<sha8>` (Node 22, sin bind mount) y lo armado vive en
 * `/opt/onia-platform/releases/<sha8>-<yyyymmdd>/`, con `BUILD_ID` y `SHA` que escribe
 * `build-and-stage.sh`. El BUILD_ID vivo se casa primero contra esos releases, después
 * contra los `build-<sha>` de la receta vieja (fallback), y si ninguno casa, el sha sale
 * del NOMBRE de la imagen que corre el contenedor — así se reconoce el release de ese día,
 * armado a mano sin BUILD_ID ni SHA. Sólo un release puede ser el STAGED: el swap por
 * imagen no sabe publicar un `build-<sha>`.
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

/** La etiqueta de la imagen de un sha: la MISMA regla en build, swap y medidor. */
export const etiquetaDe = (sha) => `${CONTENEDOR}:release-${String(sha).slice(0, 8)}`;

/** El sha que nombra una imagen `onia-platform:release-<sha>`. Cualquier otra: null. */
export function shaDeImagen(imagen) {
  const m = /^onia-platform:release-([0-9a-f]{7,40})$/.exec(imagen ?? '');
  return m ? m[1] : null;
}

/** Dos abreviaturas del mismo commit (git abrevia a 7 u 8 según el repo). */
export const mismoSha = (a, b) => Boolean(a) && Boolean(b) && (a.startsWith(b) || b.startsWith(a));

/**
 * El sha que corre. null = no se sabe.
 * 1) el BUILD_ID vivo casado contra releases y build-<sha> del disco;
 * 2) si no casa, el nombre de la imagen del contenedor vivo (`release-<sha8>`).
 * Sin poder listar el disco no se mide: `builds` null sigue siendo NO_PUDE_MEDIR.
 */
export function shaQueCorre({ buildIdVivo, builds, imagenViva = null }) {
  if (!buildIdVivo) return null;
  if (!Array.isArray(builds)) return null;
  const hit = builds.find((b) => b && b.buildId && b.buildId === buildIdVivo);
  return hit ? hit.sha : shaDeImagen(imagenViva);
}

/** El staged del HEAD: sólo un RELEASE, porque el swap publica imágenes. */
export function stagedPara(builds, headSha) {
  return (builds ?? []).find((b) => b && b.tipo === 'release' && mismoSha(b.sha, headSha)) ?? null;
}

export function diagnosticar({ shaVivo, headSha, varados, desciende }) {
  if (!shaVivo) {
    return { codigo: NO_PUDE_MEDIR, motivo: 'no sé qué build corre (BUILD_ID vivo sin par en disco)', varados: [] };
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
  if (!mismoSha(staged.sha, headSha)) {
    return { estado: VIEJO, motivo: `el build armado es de ${staged.sha} y el HEAD es ${headSha}` };
  }
  if (!staged.integro) {
    return { estado: VIEJO, motivo: `el build de ${staged.sha} está incompleto (sin BUILD_ID, sin imagen o sin standalone): no se publica` };
  }
  return { estado: CUBRE, motivo: `el build de ${staged.sha} está armado e íntegro`, ruta: staged.ruta ?? null };
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

/** La imagen con la que se creó el contenedor vivo (`onia-platform:release-<sha8>`). */
export function imagenViva(contenedor = CONTENEDOR) {
  return corre('docker', ['inspect', '--format', '{{.Config.Image}}', contenedor]) || null;
}

const leer = (ruta) => {
  try {
    return readFileSync(ruta, 'utf8').trim() || null;
  } catch {
    return null;
  }
};

/**
 * Los releases (receta por imagen) y los build-<sha> (receta vieja) del disco. `null` =
 * no existe `base` (nodo-casa). Un release está íntegro con BUILD_ID escrito —que
 * build-and-stage.sh escribe DESPUÉS de pasar los gates— y su imagen presente.
 */
export function buildsEnDisco(base = BASE, { imagenExiste = (tag) => corre('docker', ['image', 'inspect', '--format', '{{.Id}}', tag]) !== null } = {}) {
  let dirs;
  try {
    dirs = readdirSync(base).filter((d) => d.startsWith('build-') && !d.endsWith('.log') && !d.endsWith('.sh'));
  } catch {
    return null;
  }
  let rels = [];
  try {
    rels = readdirSync(`${base}/releases`).filter((d) => /^[0-9a-f]{7,40}-/.test(d));
  } catch {
    /* sin releases todavía: sólo la receta vieja */
  }
  const releases = rels.map((d) => {
    const ruta = `${base}/releases/${d}`;
    const sha = (leer(`${ruta}/SHA`) ?? d.split('-')[0]).slice(0, 8);
    const buildId = leer(`${ruta}/BUILD_ID`);
    return { sha, buildId, tipo: 'release', integro: Boolean(buildId) && imagenExiste(etiquetaDe(sha)), ruta };
  });
  return [...releases, ...dirs.map((d) => {
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
      tipo: 'legacy',
      ruta: `${base}/${d}`,
      integro: Boolean(id) && existsSync(`${nb}/server.js`) && existsSync(`${nb}/node_modules`) && existsSync(`${nb}/.next/static`),
    };
  })];
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
      // `sha|buildId|integro` (build-<sha>) o `sha|buildId|integro|release|<dir>`.
      const [sha, buildId, integro, tipo, dir] = linea.split('|');
      const release = tipo === 'release';
      return {
        sha,
        buildId: buildId || null,
        ruta: release ? `${base}/releases/${dir}` : `${base}/build-${sha}`,
        integro: integro === 'si',
        tipo: release ? 'release' : 'legacy',
      };
    })
    .filter((b) => b.sha);
}

/** El guion que lista releases y build-<sha> allá, en el formato de `parsearBuildsSsh`. */
export function guionBuildsSsh(base = BASE) {
  const releases =`for d in ${base}/releases/*/; do [ -d "$d" ] || continue; n=$(basename "$d"); s=$(tr -d "[:space:]" < "$d/SHA" 2>/dev/null); [ -n "$s" ] || s=\${n%%-*}; s=$(printf %.8s "$s"); id=$(tr -d "[:space:]" < "$d/BUILD_ID" 2>/dev/null); integro=no; if [ -n "$id" ] && docker image inspect "${CONTENEDOR}:release-$s" >/dev/null 2>&1; then integro=si; fi; printf '%s|%s|%s|release|%s\\n' "$s" "$id" "$integro" "$n"; done; `;
  const guion = `${releases}for d in ${base}/build-*/; do [ -d "$d" ] || continue; n=$(basename "$d"); case "$n" in *.log|*.sh) continue;; esac; nb="$d.next/standalone"; id=$(tr -d "[:space:]" < "$nb/.next/BUILD_ID" 2>/dev/null); integro=no; if [ -n "$id" ] && [ -f "$nb/server.js" ] && [ -d "$nb/node_modules" ] && [ -d "$nb/.next/static" ]; then integro=si; fi; printf '%s|%s|%s\\n' "\${n#build-}" "$id" "$integro"; done`;
  return guion;
}

/** Los builds del VPS. `null` = no pude preguntar; `[]` = pregunté y no hay ninguno. */
export function buildsPorSsh(base = BASE, destino = VPS) {
  const r = spawnSync('ssh', [...SSH_ARGS, destino, guionBuildsSsh(base)], { encoding: 'utf8', timeout: 60_000 });
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
  const shaVivo = shaQueCorre({ buildIdVivo: buildIdVivo(), builds, imagenViva: imagenViva() });
  const headSha = headDeploy();
  const varados = varadosDesde(shaVivo);
  const d = diagnosticar({ shaVivo, headSha, varados, desciende: desciendeDe(shaVivo, headSha) });
  return { ...d, shaVivo, headSha, staged: evaluarStaged({ staged: stagedPara(builds, headSha), headSha }) };
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
