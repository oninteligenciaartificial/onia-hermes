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
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

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

/** Commits de la rama de deploy posteriores al sha vivo que SÍ viajan al cliente. */
export function varadosDesde(shaVivo, repo = REPO) {
  if (!shaVivo) return null;
  const crudo = corre('git', ['-C', repo, 'log', '--format=%h\t%s', `${shaVivo}..${RAMA_DEPLOY}`]);
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
  const builds = buildsEnDisco();
  const shaVivo = shaQueCorre({ buildIdVivo: buildIdVivo(), builds });
  const headSha = headDeploy();
  const varados = varadosDesde(shaVivo);
  const d = diagnosticar({ shaVivo, headSha, varados, desciende: desciendeDe(shaVivo, headSha) });
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
